"""Extract text + images from scraped AAB page HTML for Phase 3 interior pages."""
import os, re, json, html as H

BASE = r"C:\Users\Jayto\Documents\Home\06-Clients&Projects\All-Aspects-at-the-Barn\site-scrape"
slugs = ["about", "barn-brew-coffee-bar", "contact", "gallery", "pavilion-party-rental", "petting-farm", "workshops", "wedding-venue"]

out = {}
for slug in slugs:
    # find the html file whose name matches the slug
    cands = [f for f in os.listdir(os.path.join(BASE, "html")) if slug in f and f.endswith(".html")]
    if not cands:
        cands = [f for f in os.listdir(os.path.join(BASE, "html")) if slug.split("-")[0] in f and f.endswith(".html")]
    if not cands:
        out[slug] = {"error": "no html file"}; continue
    cands.sort(key=lambda f: len(f))
    path = os.path.join(BASE, "html", cands[0])
    raw = open(path, encoding="utf-8", errors="ignore").read()
    # images
    imgs = []
    for m in re.finditer(r'<img[^>]+src="([^"]+)"', raw):
        u = H.unescape(m.group(1))
        if u not in imgs and not u.startswith("data:"):
            imgs.append(u)
    # title
    t = re.search(r'<title>(.*?)</title>', raw, re.S)
    title = H.unescape(t.group(1)).strip() if t else slug
    # visible text
    body = re.sub(r'<script.*?</script>', ' ', raw, flags=re.S)
    body = re.sub(r'<style.*?</style>', ' ', body, flags=re.S)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = re.sub(r'\s+', ' ', body).strip()
    out[slug] = {
        "file": cands[0],
        "title": title,
        "chars": len(raw),
        "imgs": imgs[:25],
        "text": body[:1600],
    }

with open(r"C:\Users\Jayto\aab-port\scripts\phase3_sources.json", "w", encoding="utf-8") as f:
    json.dump(out, f, indent=1, ensure_ascii=False)
for slug, d in out.items():
    print("=" * 70)
    print(slug, "|", d.get("file"), "| chars:", d.get("chars"))
    print("TITLE:", d.get("title"))
    for u in d.get("imgs", [])[:6]:
        print("  IMG:", u[:120])
    print("TEXT:", d.get("text", "")[:500])
