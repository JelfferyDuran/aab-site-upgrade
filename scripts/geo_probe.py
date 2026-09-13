"""Phase 2.6b QA helper: make a vh-neutralized copy of the build for a TRUE full-page capture.

Why: capturing with --window-size=1440,25200 makes every `min-height:100vh` element
balloon to 25200px, which pushes the real footer below the captured frame.
Neutralizing 100vh -> 900px lets a tall-window capture show the page as it looks
at a normal 1440x900 viewport.
"""
import re
import shutil
from pathlib import Path

ROOT = Path("C:/Users/Jayto/aab-port")
SRC = ROOT / "build"
DST = ROOT / "capture"

if DST.exists():
    shutil.rmtree(DST)
shutil.copytree(SRC, DST)

# 1. neutralize viewport units so tall-window capture is representative
touched = {}
for name in ("styles.css", "tokens.css", "index.html"):
    p = DST / name
    if not p.exists():
        continue
    txt = p.read_text(encoding="utf-8", errors="replace")
    n = txt.count("100vh") + txt.count("100dvh")
    if n:
        txt = txt.replace("100vh", "900px").replace("100dvh", "900px")
        p.write_text(txt, encoding="utf-8")
        touched[name] = n
print("vh neutralized:", touched)

# 2. inject a geometry probe that reports section heights + broken images
probe = (
    '<script>window.addEventListener("load",function(){setTimeout(function(){'
    'var o={page:document.documentElement.scrollHeight,items:[],broken:[]};'
    'document.querySelectorAll("section,footer").forEach(function(el){'
    'var r=el.getBoundingClientRect();'
    'o.items.push(el.tagName+"#"+(el.id||"-")+"."+(el.className||"").toString().slice(0,20)'
    '+" top="+Math.round(r.top+window.scrollY)+" h="+Math.round(r.height));});'
    'document.querySelectorAll("img").forEach(function(im){'
    'if(!im.naturalWidth)o.broken.push((im.getAttribute("src")||"").slice(-36));});'
    'document.documentElement.setAttribute("data-geo",JSON.stringify(o));},1200);});</script>'
)
idx = DST / "index.html"
h = idx.read_text(encoding="utf-8", errors="replace")
if "data-geo" not in h:
    h = h.replace("</body>", probe + "</body>")
    idx.write_text(h, encoding="utf-8")
print("geo probe injected ->", idx)
print("capture dir ready:", DST)
