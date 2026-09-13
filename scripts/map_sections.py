import re, os
p = r"C:\Users\Jayto\aab-port\build\index.html"
html = open(p, encoding="utf-8").read()
# split on section boundaries
parts = re.split(r'(?=<section)', html)
for i, s in enumerate(parts):
    if not s.startswith("<section"):
        continue
    head = re.match(r'<section[^>]*>', s).group(0)
    inner = s[:2500]
    hs = re.findall(r'<h[1-3][^>]*>(.*?)</h[1-3]>', inner, re.S)
    hs = [re.sub(r'<[^>]+>', '', h).strip()[:70] for h in hs]
    imgs = len(re.findall(r'<img', s)) if len(s) < 400000 else 0
    print(f"[{i}] {head}")
    print(f"     headings: {hs[:4]} | imgs_in_section_total={len(re.findall('<img', s))}")
