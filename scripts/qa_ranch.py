import re, os, sys, collections

ROOT = r"C:\Users\Jayto\aab-port"
BUILD = os.path.join(ROOT, "build")
html = open(os.path.join(BUILD, "index.html"), encoding="utf-8").read()

refs = re.findall(r'(?:src|href)="([^"]+)"', html)
local = [r for r in refs if not r.startswith(("http", "#", "mailto:", "tel:", "data:", "//", "/"))]
missing = []
for r in local:
    p = os.path.join(ROOT, r.replace("/", os.sep))
    if not os.path.exists(p):
        missing.append(r)

print("TOTAL refs:", len(refs), "| local:", len(local))
print("MISSING local targets:", missing if missing else "none")

# anchors
ids = set(re.findall(r'id="([^"]+)"', html))
anchors = sorted({r[1:] for r in refs if r.startswith("#") and len(r) > 1})
broken = [a for a in anchors if a not in ids]
print("ANCHORS:", anchors)
print("BROKEN anchors:", broken if broken else "none")

print("VIEWPORT:", bool(re.search(r'name="viewport"', html)))
print("TITLE:", re.search(r"<title>(.*?)</title>", html, re.S).group(1).strip())
print("META DESC:", (re.search(r'name="description" content="(.*?)"', html) or [None, "MISSING"])[1][:120])
print("OG tags:", len(re.findall(r'property="og:', html)), "| JSON-LD blocks:", len(re.findall(r'application/ld\+json', html)))
print("PLACEHOLDERS:", re.findall(r'(G-XXXXXXX|XXXXXXXXXXXXXX)', html))
print("sections:", len(re.findall(r'<section', html)), "| words:", len(html.split()))
print("forms:", len(re.findall(r'<form', html)), "| whatsapp:", len(re.findall(r'wa\.me', html)))
print("imgs referenced:", len(re.findall(r'<img', html)))
