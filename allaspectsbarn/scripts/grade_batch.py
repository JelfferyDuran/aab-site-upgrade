#!/usr/bin/env python3
"""
Batch driver: grade every photo under a directory tree, preserving file paths.
Backs originals up outside the repo first; keeps the original when the graded
result is bigger than the budget allows. Non-generative (PIL/numpy only).

POLICY — non-generative only, site imagery only:
  This grader must NEVER touch product/catalogue photos. It is applied to
  site/gallery imagery only (e.g. public/images, public/gallery, workshop
  assets). The directory public/products holds the live product catalogue
  (1,047 photos, ~117 MB); grading it shifts product colour away from reality
  - a retail-accuracy liability. If --dir resolves to, or under, a
  'public/products' path segment, the script exits non-zero with ZERO files
  written.

  Additionally, any run targeting more than 200 files requires an explicit
  --force-scope flag, so a wide-scope pass can never happen silently again.
"""
import argparse
import io
import json
import os
import sys
import time
from pathlib import Path

from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import photo_grade as pg  # noqa: E402

# --- scope guard constants ---
SCOPE_FILE_LIMIT = 200


def _is_products_scope(root: Path) -> bool:
    """True if *root* resolves to, or sits under, a 'public/products' segment.

    Normalises the path to an absolute, resolved form and checks (case-
    insensitively) whether any two consecutive path components are 'public'
    followed by 'products'. This catches --dir values like
    'public/products', './public/products', an absolute path, or any
    subdirectory beneath public/products.
    """
    resolved = root.resolve()
    parts = [p.lower() for p in resolved.parts]
    for i in range(len(parts) - 1):
        if parts[i] == "public" and parts[i + 1] == "products":
            return True
    return False


def save_png(rgb, path: Path, alpha=None, compress_level=9) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    im = Image.fromarray(rgb.astype("uint8"), "RGB")
    if alpha is not None:
        sizes = im.size
        if alpha.size != sizes:
            alpha = alpha.resize(sizes, Image.LANCZOS)
        im = im.convert("RGBA")
        im.putalpha(alpha)
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True, compress_level=compress_level)
    data = buf.getvalue()
    path.write_bytes(data)
    return len(data)


def load_with_alpha(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    alpha = None
    if im.mode in ("RGBA", "LA"):
        alpha = im.getchannel("A")
    elif im.mode == "P" and "transparency" in im.info:
        alpha = im.convert("RGBA").getchannel("A")
    rgb = im.convert("RGB")
    return rgb, alpha


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--preset", default="gallery")
    ap.add_argument("--backup", required=True)
    ap.add_argument("--manifest", default=None,
                    help="optional JSON manifest output path")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--min-edge", type=int, default=900, help="upscale images smaller than this")
    ap.add_argument("--to-edge", type=int, default=1400)
    ap.add_argument("--allow-growth", type=float, default=1.0, help="accept result up to N x original bytes")
    ap.add_argument("--skip-prefix", default="barn-hero-sunset")
    ap.add_argument("--force-scope", action="store_true", default=False,
                    help="override the %d-file scope limit (NOT the products guard)"
                    % SCOPE_FILE_LIMIT)
    args = ap.parse_args()

    root = Path(args.dir)
    backup_root = Path(args.backup) / root.name       # keep runs for different dirs separate

    # --- guard: refuse public/products ---
    if _is_products_scope(root):
        print(
            "REFUSED: --dir '%s' resolves to or under a 'public/products' "
            "segment. Product catalogue photos must never be graded "
            "(retail-accuracy policy). No files written." % args.dir,
            file=sys.stderr,
            flush=True,
        )
        sys.exit(1)

    files = sorted(p for p in root.rglob("*") if p.suffix.lower() in {".jpg", ".jpeg", ".png"} and p.is_file())

    # --- guard: wide scope needs --force-scope ---
    if len(files) > SCOPE_FILE_LIMIT and not args.force_scope:
        print(
            "REFUSED: --dir '%s' contains %d image files, which exceeds the "
            "%d-file limit. Re-run with --force-scope to proceed. No files written."
            % (args.dir, len(files), SCOPE_FILE_LIMIT),
            file=sys.stderr,
            flush=True,
        )
        sys.exit(1)

    todo = []
    for f in files:
        if args.skip_prefix and f.name.startswith(args.skip_prefix):
            continue
        rel = f.relative_to(root)
        b = backup_root / rel
        if b.exists():
            continue                                   # already processed: never grade twice
        todo.append(f)

    print(f"dir={root}  total={len(files)}  todo={len(todo)}", flush=True)
    rows, t0 = [], time.time()
    for i, f in enumerate(todo, 1):
        rel = str(f.relative_to(root))
        before = f.stat().st_size
        ext = f.suffix.lower()
        try:
            pil, alpha = load_with_alpha(f)
            cfg = dict(pg.PRESETS[args.preset])
            h, w = pil.size[1], pil.size[0]
            if max(h, w) < args.min_edge:
                cfg.pop("max_edge", None)
                cfg["upscale_to"] = args.to_edge
            rgb = pg.load_rgb(f)
            out = pg.grade(rgb, cfg)
            tmp = f.with_name(f.name + ".graded.tmp")
            if ext == ".png":
                wrote = save_png(out, tmp, alpha=alpha)
            else:
                wrote = pg.save_jpeg(out, tmp, cfg.get("quality", 86))
                if wrote > before * args.allow_growth:      # re-encode leaner until it fits
                    for q in (82, 78, 74, 70, 66):
                        if wrote <= before * args.allow_growth:
                            break
                        wrote = pg.save_jpeg(out, tmp, q)
            if wrote <= before * args.allow_growth:
                bpath = backup_root / rel
                bpath.parent.mkdir(parents=True, exist_ok=True)
                if not bpath.exists():
                    with open(f, "rb") as a, open(bpath, "wb") as b:
                        b.write(a.read())
                os.replace(tmp, f)
                rows.append({"path": rel, "changed": True, "before": before, "after": wrote})
            else:
                tmp.unlink(missing_ok=True)
                rows.append({"path": rel, "changed": False, "before": before, "after": before})
        except Exception as e:
            rows.append({"path": rel, "error": str(e), "before": before, "after": before})
            print(f"  !! {rel}: {e}", flush=True)
        if i % 50 == 0:
            done = sum(r["before"] - r["after"] for r in rows if "error" not in r)
            print(f"  [{i}/{len(todo)}] saved {done/1e6:.1f} MB", flush=True)

    ok = [r for r in rows if "error" not in r]
    m = {
        "dir": str(root), "preset": args.preset, "processed": len(todo),
        "changed": sum(1 for r in ok if r["changed"]),
        "kept": sum(1 for r in ok if not r["changed"]),
        "errors": sum(1 for r in rows if "error" in r),
        "bytes_before": sum(r["before"] for r in rows),
        "bytes_after": sum(r["after"] for r in rows),
        "seconds": round(time.time() - t0, 1),
        "rows": rows,
    }
    if args.manifest:
        Path(args.manifest).write_text(json.dumps(m, indent=1))
    print(f"\nDONE processed={m['processed']} changed={m['changed']} kept={m['kept']} errors={m['errors']}")
    print(f"     {m['bytes_before']/1e6:.1f} MB -> {m['bytes_after']/1e6:.1f} MB "
          f"(-{100*(1-m['bytes_after']/max(m['bytes_before'],1)):.1f}%)  in {m['seconds']}s")
    print(f"     manifest: {args.manifest}")


if __name__ == "__main__":
    main()
