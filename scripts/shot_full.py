"""Capture the vh-neutralized page at TRUE full height and crop QA regions."""
from pathlib import Path
from PIL import Image

ROOT = Path("C:/Users/Jayto/aab-port")
SHOTS = ROOT / "shots"
H = 33179  # measured at 1440x900 viewport

im = Image.open(SHOTS / "full-page-900.png").convert("RGB")
W, Hh = im.size
print("captured:", W, "x", Hh)

regions = {
    "qa-hero.png":      (0, 900),          # hero
    "qa-about-top.png": (2197, 6197),      # #about first 4000px  (bloat check)
    "qa-gallery.png":   (22555, 25555),    # #gallery first 3000px (bloat check)
    "qa-footer.png":    (31100, 31770),    # last sections + footer
}
for name, (a, b) in regions.items():
    b = min(b, Hh)
    im.crop((0, a, W, b)).save(SHOTS / name)
    print(f"  {name}: y {a}-{b} ({b-a}px)")

# scale the two bloat suspects down so they fit a single vision pass
for src, dst in (("qa-about-top.png", "qa-about-small.png"), ("qa-gallery.png", "qa-gallery-small.png")):
    i = Image.open(SHOTS / src)
    i.resize((720, int(i.height * 720 / i.width))).save(SHOTS / dst)
    print("  scaled ->", dst)
