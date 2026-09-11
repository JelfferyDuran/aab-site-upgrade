#!/usr/bin/env python3
"""
All Aspects at the Barn - v2 content extractor (BOOTSTRAP-STATE based).

v1 failed because Square Online is a Vue SPA: the raw HTML has ~30 chars of
visible text. The real content lives in `window.__BOOTSTRAP_STATE__`, a JSON
blob embedded in every page. This pass parses that blob and walks
`siteData.page.properties.contentAreas` recursively, extracting:

  * Quill rich-text (headings / paragraphs / list items / CTA labels)
  * Image refs + alt text
  * External + internal links
  * Product data on /product/ pages (name, price, description)
  * Page-level SEO (title, description)

Also dumps site-wide config once:
  * content-clean/_site/AAB-SEO-MAP.json     (per-page titles + descriptions)
  * content-clean/_site/AAB-DESIGN-SYSTEM.json (colors, fonts, logo, social)
  * content-clean/_site/AAB-NAV.json         (nav structure)

Usage:  python extract_clean_v2.py [limit]
Output: site-scrape/content-clean/<page>.md
"""
import os
import re
import sys
import json
import html as htmllib

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "html")
OUT = os.path.join(BASE, "content-clean")
SITE = os.path.join(OUT, "_site")

BOOT_RE = re.compile(r'window\.__BOOTSTRAP_STATE__\s*=\s*')


def grab_bootstrap(text):
    """Brace-match the JS object literal after window.__BOOTSTRAP_STATE__ =."""
    m = BOOT_RE.search(text)
    if not m:
        return None
    i = m.end()
    depth = 0
    instr = False
    esc = False
    start = None
    n = len(text)
    while i < n:
        c = text[i]
        if esc:
            esc = False
        elif c == '\\':
            esc = True
        elif c == '"':
            instr = not instr
        elif not instr:
            if c == '{':
                if depth == 0:
                    start = i
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0 and start is not None:
                    try:
                        return json.loads(text[start:i + 1])
                    except Exception:
                        return None
        i += 1
    return None


TAG_RE = re.compile(r'(?s)<[^>]+>')
WS_RE = re.compile(r'[ \t\xa0]+')


def quill_to_md(html):
    """Quill HTML -> structured markdown lines. Preserves h1-h6, p, li, br."""
    if not html or not isinstance(html, str):
        return []
    s = html
    s = re.sub(r'(?is)</(h[1-6]|p|li|div|blockquote|tr)>', '\n', s)
    s = re.sub(r'(?is)<br\s*/?>', '\n', s)
    s = re.sub(r'(?is)<li[^>]*>', '- ', s)
    out = []
    for raw in s.split('\n'):
        # keep heading level markers
        hm = re.match(r'(?is)\s*<h([1-6])[^>]*>(.*)$', raw)
        txt = TAG_RE.sub(' ', raw)
        txt = htmllib.unescape(txt)
        txt = WS_RE.sub(' ', txt).strip(' -')
        if not txt or len(txt) < 2:
            continue
        if hm:
            lvl = min(int(hm.group(1)), 6)
            out.append('#' * lvl + ' ' + txt)
        else:
            out.append(txt)
    return out


def walk(node, found, depth=0):
    """Recursively harvest content out of the contentAreas tree."""
    if depth > 24:
        return
    if isinstance(node, dict):
        for key in ("quill", "text", "richText", "caption", "html"):
            v = node.get(key)
            if isinstance(v, str) and len(v) > 3:
                found["text"].append(v)
        for key in ("alt", "altText"):
            v = node.get(key)
            if isinstance(v, str) and v.strip():
                found["alt"].append(v.strip())
        # image-ish
        for key in ("source", "src", "url", "image", "imageUrl", "original"):
            v = node.get(key)
            if isinstance(v, str) and re.search(r'\.(?:jpe?g|png|webp|gif|avif|svg)(?:\?|$)', v, re.I):
                found["images"].append(v)
        for key in ("link", "href", "site_link", "siteLink"):
            v = node.get(key)
            if isinstance(v, str) and v.startswith(("http", "/", "www.")):
                found["links"].append(v)
        # product / price
        for key in ("price", "priceMoney", "amount", "variations"):
            if key in node and node[key] not in (None, "", []):
                found["price"].append(str(node[key])[:200])
        p = node.get("purpose") or node.get("type")
        if isinstance(p, str) and p:
            found["purpose"].add(p)
        for k, v in node.items():
            if k in ("quill", "text", "richText", "caption", "html",
                     "source", "src", "url", "image", "imageUrl", "original",
                     "alt", "altText"):
                continue
            walk(v, found, depth + 1)
    elif isinstance(node, list):
        for it in node:
            walk(it, found, depth + 1)


def new_found():
    return {"text": [], "images": [], "links": [], "alt": [],
            "price": [], "purpose": set()}


def extract_one(path):
    raw = open(path, encoding="utf-8", errors="ignore").read()
    bs = grab_bootstrap(raw)
    if not bs:
        return None, None
    sd = bs.get("siteData") or {}
    page = (sd.get("page") or {}).get("properties") or {}
    snap = ((sd.get("snapshot") or {}).get("properties")) or {}

    # Static <head> meta — Square emits real og data for every page, including
    # /product/ pages whose display name is NOT in the bootstrap tree.
    def _meta(prop):
        m = re.search(r'<meta property="%s" content="([^"]*)"' % re.escape(prop), raw)
        return m.group(1) if m else ""
    def _meta_name(nm):
        m = re.search(r'<meta name=["\']%s["\'] content=(["\'])(.*?)\1' % re.escape(nm), raw)
        return m.group(2) if m else ""

    og_title = _meta("og:title")
    og_url = _meta("og:url")
    og_image = _meta("og:image")
    og_desc = _meta("og:description")
    static_desc = _meta_name("description")
    theme_color = _meta_name("theme-color")

    name = page.get("name") or ""
    route = page.get("route") or ""
    title = page.get("title") or ""
    desc = page.get("description") or ""
    hidden = page.get("hidden")

    found = new_found()
    ca = page.get("contentAreas")
    if ca:
        walk(ca, found)

    # dedupe text preserving order
    lines = []
    seen = set()
    for chunk in found["text"]:
        for ln in quill_to_md(chunk):
            k = ln.lower()
            if k in seen:
                continue
            seen.add(k)
            lines.append(ln)

    imgs = []
    seeni = set()
    for s in found["images"]:
        s = s.strip()
        if s and s not in seeni and not s.startswith("data:"):
            seeni.add(s)
            imgs.append(s)

    links = []
    seenl = set()
    for s in found["links"]:
        s = s.strip()
        if s and s not in seenl and not s.startswith("data:"):
            seenl.add(s)
            links.append(s)

    md = ["# " + (name or os.path.basename(path)), ""]
    md += ["- route: `%s`" % route]
    md += ["- title: %s" % title]
    if desc:
        md += ["- meta description: %s" % desc]
    if hidden is not None:
        md += ["- hidden: %s" % hidden]
    if og_title:
        md += ["- og:title: %s" % og_title]
    if og_url:
        md += ["- og:url: %s" % og_url]
    if og_image:
        md += ["- og:image: %s" % og_image]
    if og_desc or static_desc:
        md += ["- og/meta description: %s" % (og_desc or static_desc)]
    if theme_color:
        md += ["- theme-color: %s" % theme_color]
    md += [""]

    heads = [l for l in lines if l.startswith("#")]
    body = [l for l in lines if not l.startswith("#")]
    if heads:
        md += ["## Headings", ""] + heads + [""]
    if body:
        md += ["## Copy", ""] + body + [""]
    if found["alt"]:
        md += ["## Image alt text", ""] + ["- " + a for a in found["alt"][:60]] + [""]
    if found["price"]:
        md += ["## Price data", ""] + ["- " + p for p in found["price"][:20]] + [""]
    if links:
        md += ["## Links", ""] + ["- " + l for l in links[:80]] + [""]
    if imgs:
        md += ["## Images", ""] + ["- " + i for i in imgs[:80]] + [""]
    if found["purpose"]:
        md += ["## Section types", ""] + ["- " + p for p in sorted(found["purpose"])[:40]] + [""]

    site_bits = {
        "name": name, "route": route, "title": title,
        "ogTitle": og_title, "ogUrl": og_url, "themeColor": theme_color,
        "description": desc, "hidden": hidden,
        "seo": snap.get("seo"),
        "logo": snap.get("logo"),
        "social": snap.get("social"),
        "color": snap.get("color"),
        "fontset": snap.get("fontset"),
        "fonts": snap.get("fonts"),
        "icons": snap.get("icons"),
        "siteTitle": snap.get("title"),
        "autoNavLinks": bs.get("autoNavLinks"),
        "pagesMeta": sd.get("pagesMeta"),
        "storeInfo": bs.get("storeInfo"),
        "blogPostLinks": bs.get("blogPostLinks"),
    }
    return "\n".join(md), site_bits


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(SITE, exist_ok=True)
    files = sorted(f for f in os.listdir(SRC) if f.endswith(".html"))
    if len(sys.argv) > 1:
        files = files[:int(sys.argv[1])]

    done = fail = 0
    tot = 0
    site_written = False
    for i, f in enumerate(files, 1):
        try:
            md, bits = extract_one(os.path.join(SRC, f))
            if md is None:
                fail += 1
            else:
                with open(os.path.join(OUT, f[:-5] + ".md"), "w", encoding="utf-8") as fh:
                    fh.write(md)
                done += 1
                tot += len(md)
                if bits and not site_written and bits.get("seo"):
                    json.dump(bits, open(os.path.join(SITE, "AAB-DESIGN-SYSTEM.json"),
                                         "w", encoding="utf-8"), indent=1)
                    if isinstance(bits.get("seo"), dict):
                        json.dump(bits["seo"], open(os.path.join(SITE, "AAB-SEO-MAP.json"),
                                                    "w", encoding="utf-8"), indent=1)
                    if bits.get("autoNavLinks"):
                        json.dump(bits["autoNavLinks"], open(os.path.join(SITE, "AAB-NAV.json"),
                                                             "w", encoding="utf-8"), indent=1)
                    if bits.get("pagesMeta"):
                        json.dump(bits["pagesMeta"], open(os.path.join(SITE, "AAB-PAGES-META.json"),
                                                          "w", encoding="utf-8"), indent=1)
                    site_written = True
        except Exception as e:
            fail += 1
            if fail < 6:
                print("  FAIL", f, repr(e)[:120], flush=True)
        if i % 250 == 0:
            print("  ... %d/%d done=%d fail=%d" % (i, len(files), done, fail), flush=True)

    print("EXTRACT2_DONE files=%d fail=%d chars=%d" % (done, fail, tot), flush=True)


if __name__ == "__main__":
    main()
