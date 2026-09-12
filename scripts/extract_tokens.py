"""Extract Lone Mustang Ranch (Framer) design tokens from scraped template HTML.
Outputs our OWN analyzed token file (not template code) so the repo is self-sufficient.
"""
import re, json, glob, os, collections

SRC = r"C:/Users/Jayto/Documents/Home/06-Clients&Projects/All-Aspects-at-the-Barn/template-ranch/html"
OUT = r"C:/Users/Jayto/AppData/Local/Temp/aab-recreate/template-ranch"

# Framer emits ephemeral hashed vars (--extracted-xxxx, --1bd4d3i) - skip them
EPHEMERAL = re.compile(r"^(extracted-|[0-9a-z]{5,9}$)")

def classify(name, value):
    v = value.strip().lower()
    if re.match(r"^#([0-9a-f]{3,8})$", v) or v.startswith(("rgb", "hsl", "linear-gradient", "radial-gradient")):
        return "color"
    if "font-family" in name or "font-selector" in name:
        return "font"
    if "font-size" in name or "letter-spacing" in name or "line-height" in name or "text-transform" in name:
        return "typography"
    if "font-weight" in name or "font-style" in name or "variation" in name:
        return "weight"
    if "radius" in name:
        return "radius"
    if "shadow" in name:
        return "shadow"
    if "padding" in name or "gap" in name or "spacing" in name or "margin" in name:
        return "space"
    if "width" in name or "height" in name or "size" in name or "aspect" in name:
        return "dimension"
    return "other"

tokens = collections.defaultdict(collections.Counter)
files = sorted(glob.glob(os.path.join(SRC, "*.html")))
for fp in files:
    html = open(fp, encoding="utf-8", errors="ignore").read()
    for m in re.finditer(r"--([a-zA-Z0-9-]+)\s*:\s*([^;{}]+);", html):
        name, val = m.group(1), m.group(2).strip()
        if EPHEMERAL.match(name):
            continue
        if len(val) > 200 or not val:
            continue
        tokens[name][val] += 1

buckets = collections.defaultdict(list)
for name, counts in tokens.items():
    for val, cnt in counts.items():
        buckets[classify(name, val)].append((name, val, cnt))

# --- distinct real colors, ranked by usage ---
color_counts = collections.Counter()
for name, val, cnt in buckets["color"]:
    color_counts[val] += cnt
hexes = [c for c in color_counts if c.startswith("#")]

# --- fonts ---
fonts = collections.Counter()
for name, val, cnt in buckets["font"]:
    for fam in re.findall(r"'([^']+)'|\"?([A-Za-z][A-Za-z0-9 ]+)\"?", val):
        f = (fam[0] or fam[1]).strip().lower()
        if f and f not in ("sans-serif", "serif", "monospace", "inter", "var"):
            fonts[f] += cnt

result = {
    "source": "Lone Mustang Ranch (Framer) - https://drab-humor-103231.framer.app/",
    "extractor": "extract_tokens.py (analyzed output, template code NOT redistributed)",
    "pages_scanned": len(files),
    "distinct_custom_properties": len(tokens),
    "colors": dict(color_counts.most_common()),
    "hex_palette": sorted(set(hexes)),
    "font_families_ranked": dict(fonts.most_common(15)),
    "typography": sorted({(n, v) for n, v, c in buckets["typography"]}),
    "weights": sorted({(n, v) for n, v, c in buckets["weight"]}),
    "radius": sorted({(n, v) for n, v, c in buckets["radius"]}),
    "shadows": sorted({(n, v) for n, v, c in buckets["shadow"]}),
    "spacing": sorted({(n, v) for n, v, c in buckets["space"]})[:80],
    "dimensions": sorted({(n, v) for n, v, c in buckets["dimension"]})[:80],
}

os.makedirs(OUT, exist_ok=True)
with open(os.path.join(OUT, "RANCH-DESIGN-TOKENS.json"), "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2)

# --- readable markdown companion ---
lines = [
    "# Ranch Template — Design Tokens (analyzed)",
    "",
    f"Analyzed from {len(files)} scraped template pages. **{len(tokens)}** distinct custom properties,",
    f"**{len(color_counts)}** color values, **{len(set(hexes))}** hex codes.",
    "",
    "> This is our own analysis output. No Framer runtime code or template source is redistributed.",
    "",
    "## Palette (by usage)",
    "",
]
for c, n in color_counts.most_common(30):
    lines.append(f"- `{c}` — {n}x")
lines += ["", "## Fonts (ranked)", ""]
for f, n in fonts.most_common(12):
    lines.append(f"- {f} — {n}x")
lines += ["", "## Typography", ""]
for n, v in result["typography"][:40]:
    lines.append(f"- `--{n}: {v}`")
lines += ["", "## Weights / styles", ""]
for n, v in result["weights"]:
    lines.append(f"- `--{n}: {v}`")
lines += ["", "## Radii", ""]
for n, v in result["radius"]:
    lines.append(f"- `--{n}: {v}`")
lines += ["", "## Shadows", ""]
for n, v in result["shadows"][:20]:
    lines.append(f"- `--{n}: {v}`")

with open(os.path.join(OUT, "RANCH-DESIGN-TOKENS.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

print(f"TOKENS_DONE pages={len(files)} props={len(tokens)} colors={len(color_counts)} hexes={len(set(hexes))}")
print("TOP_HEX:", ", ".join(list(color_counts.most_common(12))[0][0] for _ in [0]), sep="")
print("FONTS:", ", ".join(list(fonts.most_common(8))[i][0] for i in range(min(8, len(fonts)))))
