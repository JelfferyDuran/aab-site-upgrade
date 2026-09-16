#!/usr/bin/env python3
"""
Lightroom-style batch grade for All Aspects at the Barn.
Non-generative: no diffusion, no GAN, no hallucinated detail.
Everything here is deterministic tone/colour maths on the real pixels.

Pipeline per image:
  1. EXIF-orientation normalise
  2. partial auto white balance (blend-weighted, protects golden-hour warmth)
  3. black/white point recovery from percentiles
  4. gentle S-curve contrast + shadow lift
  5. vibrance (saturation boost weighted toward muted pixels)
  6. clarity (large-radius local contrast) + detail sharpen (small radius, thresholded)
  7. optional Lanczos upscale when the image is smaller than its display target
  8. encode WebP (site) / JPEG (OG, metadata)

Usage:
  python photo_grade.py --in <file-or-dir> --out <file-or-dir> [options]
  python photo_grade.py --selftest
"""
from __future__ import annotations

import argparse
import io
import os
import sys
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

Image.MAX_IMAGE_PIXELS = None

RASTER_EXT = {".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"}


# ---------------------------------------------------------------- primitives
def _pct(a: np.ndarray, p: float) -> float:
    return float(np.percentile(a, p))


def auto_white_balance(rgb: np.ndarray, strength: float = 0.30, highlight_ref: float = 99.0) -> np.ndarray:
    """Partial grey-world/highlight hybrid. strength=0 disables, 1 fully neutralises.
    Kept low on purpose: a sunset must stay warm, not corrected into noon."""
    if strength <= 0:
        return rgb
    chans = [rgb[..., i] for i in range(3)]
    # highlight reference: what each channel's brightest real content reaches
    hr = np.array([_pct(c, highlight_ref) for c in chans], dtype=np.float32)
    hr = np.maximum(hr, 1.0)
    target = float(np.mean(hr))
    gain = target / hr                      # >1 lifts a channel, <1 pulls it down
    gain = 1.0 + (gain - 1.0) * strength    # blend toward neutral
    out = rgb * gain.reshape(1, 1, 3)
    return np.clip(out, 0, 255)


def levels(rgb: np.ndarray, lo_pct: float = 0.8, hi_pct: float = 99.0,
           max_clip: float = 0.7) -> np.ndarray:
    """Shadow-lift recovery. Stretches from the black point up to 255 only:
    darker shadows come down, highlights never get pushed past their natural
    ceiling, so sunsets and specular light keep their tonal headroom."""
    lum = rgb.mean(axis=2)
    lo = _pct(lum, lo_pct)
    if lo <= 1.0 or lo >= 250:
        return rgb
    scale = 255.0 / max(255.0 - lo, 1.0)
    out = (rgb - lo) * scale
    clipped_hi = float((out.max(axis=2) >= 254).mean() * 100)
    clipped_lo = float((out.min(axis=2) <= 1).mean() * 100)
    if clipped_hi > max_clip or clipped_lo > max_clip:   # sky or shadows too hot -> skip stretch
        return rgb
    return np.clip(out, 0, 255)


def s_curve(rgb: np.ndarray, contrast: float = 0.16, shadow_lift: float = 0.06) -> np.ndarray:
    x = np.clip(rgb, 0, 255) / 255.0
    if contrast:
        mid = 4.0 * x * (1.0 - x)                       # 0 at black, 0 at white, 1 at mid-grey
        lifted = 0.5 + (x - 0.5) * (1.0 + contrast)
        lifted = lifted * lifted * (3 - 2 * lifted) * 0.35 + lifted * 0.65   # filmic roll-off
        x = x + (lifted - x) * mid                       # move mid-tones only, protect both ends
        x = np.clip(x, 0, 1)
    if shadow_lift:
        x = x + shadow_lift * (1 - x) * (1 - x) * 0.9     # lift shadows, leave highlights alone
    return np.clip(x * 255.0, 0, 255)


def vibrance(rgb: np.ndarray, amount: float = 0.22) -> np.ndarray:
    """Boost muted colour more than saturated colour, and mid-tones more than
    highlights — so a golden sky doesn't clip its own red channel to white."""
    if amount <= 0:
        return rgb
    mx = rgb.max(axis=2, keepdims=True) / 255.0
    mn = rgb.min(axis=2, keepdims=True) / 255.0
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0.0)
    weight = (1.0 - sat ** 0.7) * (1.0 - mx) ** 0.6      # muted + not-already-bright
    grey = rgb.mean(axis=2, keepdims=True)
    out = grey + (rgb - grey) * (1.0 + amount * weight)
    return np.clip(out, 0, 255)


def unsharp(rgb: np.ndarray, radius: float, amount: float, threshold: int = 0,
            protect_highlights: bool = True) -> np.ndarray:
    if amount <= 0 or radius <= 0:
        return rgb
    img = Image.fromarray(rgb.astype(np.uint8), "RGB")
    blur = img.filter(ImageFilter.GaussianBlur(radius))
    b = np.asarray(blur, dtype=np.float32)
    diff = rgb - b
    if threshold > 0:
        mask = np.abs(diff).max(axis=2, keepdims=True) >= threshold
        diff = diff * mask
    if protect_highlights:
        mx = rgb.max(axis=2, keepdims=True) / 255.0
        diff = diff * np.clip(1.0 - mx ** 1.4, 0.15, 1.0)   # don't sharpen whites into blowout
    return np.clip(rgb + diff * amount, 0, 255)


def highlight_rolloff(rgb: np.ndarray, knee: float = 0.86, ceiling: int = 251) -> np.ndarray:
    """Soft shoulder: compress the top of the range instead of letting it clip,
    so bright cloud keeps its glow rather than flattening to pure white."""
    x = np.clip(rgb, 0, 255) / 255.0
    hi = x > knee
    if not hi.any():
        return rgb
    head = (1.0 - knee)
    comp = knee + head * (1.0 - np.exp(-(x - knee) / max(head, 1e-6)))
    out = np.where(hi, comp, x) * 255.0
    return np.clip(out, 0, ceiling)


def lanczos_upscale(rgb: np.ndarray, target_long_edge: int) -> np.ndarray:
    h, w = rgb.shape[:2]
    if max(h, w) >= target_long_edge:
        return rgb
    scale = target_long_edge / max(h, w)
    nw, nh = int(round(w * scale)), int(round(h * scale))
    img = Image.fromarray(rgb.astype(np.uint8), "RGB").resize((nw, nh), Image.LANCZOS)
    return np.asarray(img, dtype=np.float32)


def downscale(rgb: np.ndarray, max_long_edge: int) -> np.ndarray:
    h, w = rgb.shape[:2]
    if max(h, w) <= max_long_edge:
        return rgb
    scale = max_long_edge / max(h, w)
    nw, nh = max(1, int(round(w * scale))), max(1, int(round(h * scale)))
    img = Image.fromarray(rgb.astype(np.uint8), "RGB").resize((nw, nh), Image.LANCZOS)
    return np.asarray(img, dtype=np.float32)


# ------------------------------------------------------------------- metrics
def metrics(rgb: np.ndarray) -> dict:
    lum = rgb.mean(axis=2)
    mx = rgb.max(axis=2); mn = rgb.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0.0)
    g = np.asarray(Image.fromarray(rgb.astype(np.uint8), "RGB").convert("L"), dtype=np.float32)
    lap = (np.abs(np.diff(g, axis=0)[:, :-1]) + np.abs(np.diff(g, axis=1)[:-1, :]))
    return {
        "w": rgb.shape[1], "h": rgb.shape[0],
        "mean_lum": round(float(lum.mean()), 1),
        "contrast_sd": round(float(lum.std()), 1),
        "sat_mean": round(float(sat.mean()), 3),
        "clip_hi_pct": round(float((rgb.max(axis=2) >= 254).mean() * 100), 2),
        "clip_lo_pct": round(float((rgb.min(axis=2) <= 1).mean() * 100), 2),
        "blue_dominant_pct": round(float((rgb[..., 2] - np.maximum(rgb[..., 0], rgb[..., 1]) >= 15).mean() * 100), 1),
        "warm_pct": round(float((rgb[..., 0] - rgb[..., 2] >= 15).mean() * 100), 1),
        "detail_energy": round(float(lap.mean()), 2),
    }


# ------------------------------------------------------------------ pipeline
def grade(rgb: np.ndarray, cfg: dict) -> np.ndarray:
    out = rgb.astype(np.float32)
    out = auto_white_balance(out, cfg.get("wb", 0.30))
    out = levels(out, cfg.get("lo_pct", 0.35), cfg.get("hi_pct", 99.65))
    out = s_curve(out, cfg.get("contrast", 0.16), cfg.get("shadow_lift", 0.06))
    out = vibrance(out, cfg.get("vibrance", 0.22))
    if cfg.get("max_edge"):
        out = downscale(out, cfg["max_edge"])
    if cfg.get("upscale_to"):
        out = lanczos_upscale(out, cfg["upscale_to"])
    h, w = out.shape[:2]
    out = unsharp(out, max(1.0, max(h, w) * 0.004), cfg.get("clarity", 0.30))   # local contrast
    out = unsharp(out, 1.0, cfg.get("sharpen", 0.55), threshold=cfg.get("sharpen_threshold", 4))
    out = highlight_rolloff(out, cfg.get("rolloff_knee", 0.86), cfg.get("rolloff_ceiling", 251))
    sat_boost_guard = cfg.get("saturation_guard", 1.0)
    if sat_boost_guard != 1.0:
        g = out.mean(axis=2, keepdims=True)
        out = np.clip(g + (out - g) * sat_boost_guard, 0, 255)
    return out


def load_rgb(path: Path) -> np.ndarray:
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGB")
    return np.asarray(img.convert("RGB"), dtype=np.float32)


def save_webp(rgb: np.ndarray, path: Path, quality: int = 82, lossless: bool = False) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    buf = io.BytesIO()
    Image.fromarray(rgb.astype(np.uint8), "RGB").save(
        buf, format="WEBP", quality=quality, method=6, lossless=lossless)
    data = buf.getvalue()
    path.write_bytes(data)
    return len(data)


def save_jpeg(rgb: np.ndarray, path: Path, quality: int = 86) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    buf = io.BytesIO()
    Image.fromarray(rgb.astype(np.uint8), "RGB").save(
        buf, format="JPEG", quality=quality, optimize=True, progressive=True, subsampling=1)
    data = buf.getvalue()
    path.write_bytes(data)
    return len(data)


def run_one(src: Path, dst: Path | None, cfg: dict, fmt: str = "webp") -> dict:
    before = load_rgb(src)
    after = grade(before, cfg)
    mb, ma = metrics(before), metrics(after)
    wrote = None
    if dst is not None:
        if fmt == "webp":
            wrote = save_webp(after, dst, cfg.get("quality", 82))
        elif fmt == "jpeg":
            wrote = save_jpeg(after, dst, cfg.get("quality", 86))
        elif fmt == "same":
            if dst.suffix.lower() == ".webp":
                wrote = save_webp(after, dst, cfg.get("quality", 82))
            else:
                wrote = save_jpeg(after, dst, cfg.get("quality", 86))
        elif fmt == "inplace-jpeg-webp":     # keep .jpg name, store webp-encoded? no -> real jpeg
            wrote = save_jpeg(after, dst, cfg.get("quality", 86))
    return {
        "src": str(src), "dst": str(dst) if dst else None,
        "src_bytes": src.stat().st_size, "out_bytes": wrote,
        "before": mb, "after": ma,
        "delta": {
            "contrast_sd": round(ma["contrast_sd"] - mb["contrast_sd"], 1),
            "sat_mean": round(ma["sat_mean"] - mb["sat_mean"], 3),
            "detail_energy": round(ma["detail_energy"] - mb["detail_energy"], 2),
            "clip_hi_pct": round(ma["clip_hi_pct"] - mb["clip_hi_pct"], 2),
        },
    }


# ----------------------------------------------------------------- CLI modes
DEFAULT_CFG = {
    "wb": 0.30, "lo_pct": 0.8, "hi_pct": 98.9, "contrast": 0.14, "shadow_lift": 0.07,
    "vibrance": 0.22, "clarity": 0.30, "sharpen": 0.55, "sharpen_threshold": 4,
    "quality": 82,
}

# per-purpose presets
PRESETS = {
    "hero":    {**DEFAULT_CFG, "wb": 0.14, "vibrance": 0.12, "contrast": 0.12, "clarity": 0.12, "sharpen": 0.26, "sharpen_threshold": 6, "quality": 86},
    "gallery": {**DEFAULT_CFG, "max_edge": 1600, "quality": 82},
    "detail":  {**DEFAULT_CFG, "max_edge": 1400, "vibrance": 0.18, "contrast": 0.14, "quality": 82},
    "og":      {**DEFAULT_CFG, "wb": 0.14, "vibrance": 0.24, "quality": 86},
    "tiny":    {**DEFAULT_CFG, "upscale_to": 1200, "ubs": 0, "quality": 82},
}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="src")
    ap.add_argument("--out", dest="dst")
    ap.add_argument("--preset", default="gallery", choices=sorted(PRESETS))
    ap.add_argument("--fmt", default="same", choices=["webp", "jpeg", "jpg", "same", "inplace-jpeg-webp"])
    ap.add_argument("--quality", type=int)
    ap.add_argument("--max-edge", type=int)
    ap.add_argument("--upscale-to", type=int)
    ap.add_argument("--metrics-json", dest="mj")
    ap.add_argument("--backup-dir", dest="backup")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()

    cfg = dict(PRESETS[a.preset])
    if a.quality is not None:
        cfg["quality"] = a.quality
    if a.max_edge is not None:
        cfg["max_edge"] = a.max_edge
    if a.upscale_to is not None:
        cfg["upscale_to"] = a.upscale_to

    if a.selftest:
        print("grading engine self-test: importing ok, presets:", sorted(PRESETS))
        return 0

    if not a.src:
        ap.error("--in required")

    src = Path(a.src)
    files = sorted(p for p in ([src] if src.is_file() else src.rglob("*")) if p.is_file() and p.suffix in RASTER_EXT)
    dst_root = Path(a.dst) if a.dst else None
    backup_root = Path(a.backup) if a.backup else None
    results = []
    for i, f in enumerate(files, 1):
        rel = f.name if src.is_file() else str(f.relative_to(src)).replace("\\", "/")
        out = None
        if dst_root:
            out = dst_root if src.is_file() and dst_root.suffix else (dst_root / rel)
            if a.fmt == "same" or out.suffix.lower() != (".webp" if a.fmt == "webp" else ".jpg"):
                if a.fmt == "webp" and out.suffix.lower() != ".webp":
                    out = out.with_suffix(".webp")
        if not a.dry_run and backup_root and dst_root and out and str(out).replace("\\", "/").startswith(str(dst_root).replace("\\", "/")):
            b = backup_root / rel
            b.parent.mkdir(parents=True, exist_ok=True)
            if not b.exists():
                b.write_bytes(f.read_bytes())
        try:
            r = run_one(f, out, cfg, a.fmt)
        except Exception as e:                                     # noqa: BLE001
            r = {"src": str(f), "error": f"{type(e).__name__}: {e}"}
        results.append(r)
        tag = "ERR" if "error" in r else "ok"
        if "error" in r:
            print(f"[{i}/{len(files)}] {tag} {rel} -> {r['error']}")
        else:
            b, af = r["before"], r["after"]
            grow = f"{r['out_bytes']/1024:.0f}KB" if r["out_bytes"] else "dry"
            print(f"[{i}/{len(files)}] {tag} {rel}  {r['src_bytes']//1024}KB->{grow}  "
                  f"{b['w']}x{b['h']}->{af['w']}x{af['h']}  sd {b['contrast_sd']}->{af['contrast_sd']}  "
                  f"sat {b['sat_mean']}->{af['sat_mean']}  detail {b['detail_energy']}->{af['detail_energy']}  "
                  f"clip {af['clip_hi_pct']}%")
    if a.mj:
        Path(a.mj).parent.mkdir(parents=True, exist_ok=True)
        Path(a.mj).write_text(json.dumps(results, indent=1), encoding="utf-8")
    ok = sum(1 for r in results if "error" not in r)
    print(f"\n{ok}/{len(results)} graded")
    return 0 if ok == len(results) else 1


if __name__ == "__main__":
    sys.exit(main())
