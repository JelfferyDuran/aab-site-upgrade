#!/usr/bin/env python3
"""
All Aspects at the Barn - clean content re-extractor.

The first scrape pass wrote `content/*.md` from a shallow walker that mostly
captured <img> refs. This pass parses the *raw HTML* properly and emits
structured, prose-bearing markdown so the rebuild has real page copy.

Output:  site-scrape/content-clean/<same-name>.md
Console: progress + a per-file char count.

No third-party deps (bs4 is not installed on this host) - stdlib html.parser.
"""
import os
import re
import sys
import json
import html as htmllib
from html.parser import HTMLParser

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "html")
OUT = os.path.join(BASE, "content-clean")

SKIP_TAGS = {"script", "style", "noscript", "svg", "path", "iframe", "template", "head"}
BLOCK_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote",
              "figcaption", "caption", "td", "th", "dd", "dt", "summary"}
META_TAGS = {"title", "meta", "link"}

# things that are UI chrome, not page copy
CHROME_PAT = re.compile(
    r'^(menu|close|search|cart|shop all|log ?in|sign ?up|next|previous|'
    r'back|share|skip to|accept|deny|instagram|facebook|tiktok|youtube|'
    r'powered by|©|all rights reserved)', re.I)


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.buf = []
        self.block = None
        self.blocks = []            # (tag, text)
        self.meta = {}
        self.title = ""
        self._in_title = False
        self.ldjson = []
        self._in_ld = False
        self._ld_buf = []
        self.links = []             # (href, text)
        self._link_href = None
        self._link_buf = None
        self.imgs = []              # (src, alt)

    # ---------- helpers ----------
    def _flush_block(self):
        if self.block and self.buf:
            text = html_unescape_ws(" ".join(self.buf))
            if text:
                self.blocks.append((self.block, text))
        self.block = None
        self.buf = []

    # ---------- parser hooks ----------
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in SKIP_TAGS:
            if tag in ("script", "style", "noscript", "svg", "iframe", "template"):
                self.skip_depth += 1
            if tag == "script" and a.get("type", "").lower() == "application/ld+json":
                self._in_ld = True
                self._ld_buf = []
            return
        if self.skip_depth:
            return
        if tag == "title":
            self._in_title = True
            return
        if tag == "meta":
            n = (a.get("name") or a.get("property") or "").lower()
            c = a.get("content", "")
            if n and c:
                self.meta[n] = c
            return
        if tag == "img":
            self.imgs.append((a.get("src", ""), a.get("alt", "")))
            return
        if tag == "a":
            self._link_href = a.get("href", "")
            self._link_buf = []
        if tag in BLOCK_TAGS:
            self._flush_block()
            self.block = tag
            self.buf = []

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS:
            if tag == "script" and self._in_ld:
                self._in_ld = False
                blob = "".join(self._ld_buf).strip()
                if blob:
                    try:
                        self.ldjson.append(json.loads(blob))
                    except Exception:
                        pass
            if tag in ("script", "style", "noscript", "svg", "iframe", "template") and self.skip_depth:
                self.skip_depth -= 1
            return
        if self.skip_depth:
            return
        if tag == "title":
            self._in_title = False
            return
        if tag == "a" and self._link_buf is not None:
            t = html_unescape_ws(" ".join(self._link_buf))
            if t:
                self.links.append((self._link_href or "", t))
            self._link_href = None
            self._link_buf = None
        if tag in BLOCK_TAGS:
            self._flush_block()

    def handle_data(self, data):
        if self._in_ld:
            self._ld_buf.append(data)
            return
        if self._in_title:
            self.title += data
            return
        if self.skip_depth:
            return
        if not data or not data.strip():
            return
        if self.block:
            self.buf.append(data)
        if self._link_buf is not None:
            self._link_buf.append(data)


def html_unescape_ws(s):
    s = htmllib.unescape(s or "")
    return re.sub(r"\s+", " ", s).strip()


def extract(path):
    raw = open(path, encoding="utf-8", errors="ignore").read()
    p = TextExtractor()
    try:
        p.feed(raw)
    except Exception:
        pass
    p._flush_block()

    name = os.path.basename(path)
    lines = ["# " + name, ""]

    title = html_unescape_ws(p.title)
    desc = p.meta.get("description") or p.meta.get("og:description") or ""
    if title:
        lines += ["**Title:** " + title, ""]
    if desc:
        lines += ["**Meta description:** " + html_unescape_ws(desc), ""]
    if p.meta.get("og:title"):
        lines += ["**og:title:** " + html_unescape_ws(p.meta["og:title"]), ""]
    if p.meta.get("og:image"):
        lines += ["**og:image:** " + p.meta["og:image"], ""]

    # de-dup + drop chrome
    seen = set()
    body = []
    for tag, text in p.blocks:
        if len(text) < 2:
            continue
        if CHROME_PAT.match(text):
            continue
        k = (tag, text.lower())
        if k in seen:
            continue
        seen.add(k)
        body.append((tag, text))

    heads = [(t, x) for t, x in body if t.startswith("h") and len(t) == 2]
    paras = [x for t, x in body if t == "p"]
    lists = [x for t, x in body if t == "li"]

    if heads:
        lines += ["## Headings", ""]
        for t, x in heads:
            lvl = min(int(t[1]) + 1, 6)
            lines += ["#" * lvl + " " + x, ""]

    if paras:
        lines += ["## Body copy", ""]
        for x in paras:
            lines += [x, ""]

    if lists:
        lines += ["## List items", ""]
        for x in lists:
            lines += ["- " + x, ""]

    # contact / NAP sweep over everything we captured
    allt = " ".join([x for _, x in body])
    emails = sorted(set(re.findall(r"[\w.+-]+@[\w-]+\.[\w.]{2,}", allt)))
    phones = sorted(set(re.findall(r"\(?\b\d{3}\)?[\s.\-]?\d{3}[\s.\-]\d{4}\b", allt)))
    addrs = sorted(set(re.findall(
        r"\d{1,6}\s+[A-Z][A-Za-z0-9.'\- ]{2,40}?"
        r"(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Highway|Hwy|Lane|Ln|Drive|Dr|Way|Court|Ct|Parkway|Pkwy|Trail|Trl)\b[.,]?"
        r"(?:\s*(?:Suite|Ste|Unit|#)\s*[\w\-]+)?"
        r"(?:,?\s*[A-Z][A-Za-z.'\- ]{2,25})?(?:,?\s*[A-Z]{2}\s*\d{5})?", allt)))
    if emails or phones or addrs:
        lines += ["## Contact signals", ""]
        for e in emails:
            lines += ["- email: " + e]
        for ph in phones:
            lines += ["- phone: " + ph]
        for ad in addrs:
            lines += ["- address: " + ad]
        lines += [""]

    # outbound links worth keeping
    ext = []
    for href, text in p.links:
        if not href or href.startswith(("#", "javascript:", "tel:", "mailto:")):
            continue
        if any(d in href for d in ("facebook.com", "instagram.com", "tiktok.com",
                                   "youtube.com", "google.com/maps", "linktr.ee",
                                   "squareup.com", "wa.me")):
            ext.append((href, text))
    if ext:
        lines += ["## External links", ""]
        for href, text in ext[:40]:
            lines += ["- [%s](%s)" % (text[:80], href)]
        lines += [""]

    if p.ldjson:
        lines += ["## JSON-LD (structured data)", "", "```json",
                  json.dumps(p.ldjson, indent=2)[:4000], "```", ""]

    imgs = [(s, a) for s, a in p.imgs if s]
    if imgs:
        lines += ["## Images", ""]
        for s, a in imgs[:60]:
            lines += ["- %s%s" % (s, ("  (alt: %s)" % a) if a else "")]
        lines += [""]

    return "\n".join(lines), len(allt)


def main():
    os.makedirs(OUT, exist_ok=True)
    files = sorted(f for f in os.listdir(SRC) if f.endswith(".html"))
    if len(sys.argv) > 1:
        lim = int(sys.argv[1])
        files = files[:lim]
    done = 0
    fail = 0
    total_chars = 0
    for i, f in enumerate(files, 1):
        try:
            md, n = extract(os.path.join(SRC, f))
            with open(os.path.join(OUT, f[:-5] + ".md"), "w", encoding="utf-8") as fh:
                fh.write(md)
            done += 1
            total_chars += n
        except Exception as e:
            fail += 1
            if fail < 5:
                print("  FAIL", f, e)
        if i % 250 == 0:
            print("  ... %d/%d" % (i, len(files)), flush=True)
    print("EXTRACT_DONE files=%d fail=%d chars=%d out=%s" % (done, fail, total_chars, OUT))


if __name__ == "__main__":
    main()
