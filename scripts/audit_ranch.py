import re, os, json, collections

VAULT = r"C:\Users\Jayto\Documents\Home\06-Clients&Projects\All-Aspects-at-the-Barn"
TPL = os.path.join(VAULT, "template-ranch", "html")
BUILD = r"C:\Users\Jayto\aab-port\build\index.html"

report = {}

# --- 1. Template pages: extract framer section names (top-level-ish) ---
def framer_names(html):
    names = re.findall(r'data-framer-name="([^"]{2,60})"', html)
    return names

tpl_pages = sorted(os.listdir(TPL))
out = {}
for f in tpl_pages:
    p = os.path.join(TPL, f)
    h = open(p, encoding="utf-8", errors="ignore").read()
    names = framer_names(h)
    # sections = names starting with 'Section' or known structural
    secs = [n for n in names if n.lower().startswith(("section", "hero", "navi", "footer"))]
    seen, ordered = set(), []
    for n in secs:
        if n not in seen:
            seen.add(n); ordered.append(n)
    out[f] = {"bytes": len(h), "framer_names": len(names), "sections": ordered}
report["template_pages"] = out

# --- 2. Build page: sections actually present ---
b = open(BUILD, encoding="utf-8").read()
bsecs = re.findall(r'<section[^>]*?(?:id="([^"]*)")?[^>]*>', b)
# headings per section
parts = re.split(r'(?=<section)', b)
built = []
for s in parts:
    if not s.startswith("<section"):
        continue
    idm = re.search(r'id="([^"]+)"', s[:200])
    h = re.search(r'<h[12][^>]*>(.*?)</h[12]>', s, re.S)
    txt = re.sub(r'<[^>]+>', '', h.group(1)).strip() if h else "(no h1/h2)"
    built.append({"id": idm.group(1) if idm else None, "heading": txt[:70],
                  "imgs": len(re.findall(r'<img', s))})
report["build_home"] = {"bytes": len(b), "sections": built,
                        "section_count": len(built),
                        "words": len(re.sub(r'<[^>]+>', ' ', b).split())}

# --- 3. AAB's own real pages (from site-scrape SUMMARY) ---
summ = open(os.path.join(VAULT, "site-scrape", "SUMMARY.md"), encoding="utf-8", errors="ignore").read()
pages = re.findall(r'- \[https://www\.allaspectsbarn\.com([^\]]*)\]', summ)
nonprod = [p for p in pages if not p.startswith("/product/")]
report["aab_pages_total"] = len(pages)
report["aab_nonproduct_pages"] = nonprod
report["aab_product_pages"] = len(pages) - len(nonprod)

# media inventory
for label, d in [("template_media", os.path.join(VAULT, "template-ranch", "media")),
                 ("scrape_media", os.path.join(VAULT, "site-scrape", "media"))]:
    if os.path.isdir(d):
        fs = [os.path.join(dp, f) for dp, _, fns in os.walk(d) for f in fns]
        report[label] = {"files": len(fs), "mb": round(sum(os.path.getsize(x) for x in fs)/1048576, 1)}
    else:
        report[label] = "MISSING: " + d

print(json.dumps(report, indent=1)[:6000])
open(r"C:\Users\Jayto\aab-port\scripts\audit.json", "w", encoding="utf-8").write(json.dumps(report, indent=1))
