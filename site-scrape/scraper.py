#!/usr/bin/env python3
"""Full-site scraper for allaspectsbarn.com -> HTML mirror + text + media download.

Output layout under OUT_DIR:
  html/          raw HTML per page (slugified filename)
  content/       per-page markdown: title, meta, headings, paragraphs, links, media refs
  media/         all unique images/videos downloaded (query strings stripped)
  manifest.json  URL -> slug map, media list, stats
  SUMMARY.md     human-readable overview
"""
import asyncio, hashlib, json, os, re, sys, urllib.parse
from pathlib import Path
from html.parser import HTMLParser

import httpx

BASE = "https://www.allaspectsbarn.com"
OUT = Path(r"C:/Users/Jayto/Documents/Home/06-Clients&Projects/All-Aspects-at-the-Barn/site-scrape")
SITEMAP = Path(r"C:/Users/Jayto/AppData/Local/Temp/aab-sitemap-urls.txt")
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"}

MEDIA_SRCS = re.compile(r'''(?:src|href|data-src|data-srcset|content)\s*=\s*["']([^"']+\.(?:jpe?g|png|gif|webp|avif|mp4|webm|mov|heic|svg)(?:\?[^"']*)?)["']''', re.I)
SRCSET = re.compile(r'([^"\s,]+\.(?:jpe?g|png|gif|webp|avif|mp4|webm|mov|heic|svg)(?:\?[^"\s,]*)?)', re.I)

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = None
        self.meta_desc = None
        self.h = []
        self.p = []
        self.li = []
        self.img = []
        self.video = []
        self.cur = None
        self.cur_tag = None
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style", "noscript", "svg", "head"):
            self.skip += 1
            return
        if tag == "title" and self.title is None:
            self.cur, self.cur_tag = [], "title"
        elif tag == "meta" and a.get("name", "").lower() == "description":
            self.meta_desc = a.get("content", "")
        elif tag in ("h1", "h2", "h3"):
            self.cur, self.cur_tag = [], tag
        elif tag == "p":
            self.cur, self.cur_tag = [], "p"
        elif tag == "li":
            self.cur, self.cur_tag = [], "li"
        elif tag == "img":
            src = a.get("src") or a.get("data-src") or ""
            if src:
                self.img.append(src)
        elif tag in ("video", "source"):
            src = a.get("src") or ""
            if src:
                self.video.append(src)
    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript", "svg", "head") and self.skip:
            self.skip -= 1
            return
        if self.cur is not None and tag == self.cur_tag:
            text = " ".join("".join(self.cur).split())
            if text:
                if tag == "title": self.title = text
                elif tag in ("h1", "h2", "h3"): self.h.append((tag, text))
                elif tag == "p": self.p.append(text)
                elif tag == "li": self.li.append(text)
            self.cur = None
            self.cur_tag = None
    def handle_data(self, data):
        if self.cur is not None and self.skip == 0:
            self.cur.append(data)

def slugify(url: str, i: int) -> str:
    path = urllib.parse.urlparse(url).path.strip("/")
    parts = [p for p in re.split(r"[^A-Za-z0-9]+", path) if p]
    base = "-".join(parts[:4]) if parts else "home"
    return f"{i:04d}-{base[:90]}" or f"page-{i}"

def is_same_host(u):
    try:
        return urllib.parse.urlparse(u).netloc.endswith("allaspectsbarn.com") or "square" in urllib.parse.urlparse(u).netloc or "cdn" in urllib.parse.urlparse(u).netloc or urllib.parse.urlparse(u).netloc == ""
    except Exception:
        return False

def abs_url(u):
    return urllib.parse.urljoin(BASE, u) if u.startswith(("/", "//")) else u

async def fetch(client, url, i):
    try:
        r = await client.get(url, headers=HEADERS, follow_redirects=True, timeout=30)
        if r.status_code != 200:
            return {"url": url, "status": r.status_code, "ok": False}
        html = r.text
        slug = slugify(url, i)
        (OUT / "html").mkdir(parents=True, exist_ok=True)
        (OUT / "html" / f"{slug}.html").write_text(html, encoding="utf-8", errors="replace")
        # extract text
        ex = TextExtractor()
        try:
            ex.feed(html)
        except Exception:
            pass
        # collect media
        media = set()
        for m in MEDIA_SRCS.finditer(html):
            media.add(abs_url(m.group(1)))
        for m in SRCSET.finditer(html):
            media.add(abs_url(m.group(1)))
        # also images referenced by attribute-free patterns (square lazy)
        for m in re.finditer(r'["\'](https?://[^"\']+\.(?:jpg|jpeg|png|webp|gif|mp4)(?:\?[^"\']*)?)["\']', html, re.I):
            media.add(m.group(1))
        for s in ex.img:
            media.add(abs_url(s))
        for s in ex.video:
            media.add(abs_url(s))
        # visible text markdown
        md = []
        md.append(f"# {ex.title or slug}")
        if ex.meta_desc:
            md.append(f"\n> Meta: {ex.meta_desc}\n")
        for tag, htxt in ex.h:
            md.append(f"\n## {htxt}" if tag in ("h2", "h3") else f"\n# {htxt}")
        if ex.p:
            md.append("\n".join(f"{t}" for t in ex.p))
        if ex.li:
            md.append("\n### List items\n" + "\n".join(f"- {t}" for t in ex.li))
        if media:
            md.append("\n### Media\n" + "\n".join(f"- {m}" for m in sorted(media)))
        (OUT / "content").mkdir(parents=True, exist_ok=True)
        (OUT / "content" / f"{slug}.md").write_text("\n".join(md), encoding="utf-8")
        return {"url": url, "slug": slug, "status": 200, "ok": True, "bytes": len(html),
                "media": sorted(media), "title": ex.title}
    except Exception as e:
        return {"url": url, "ok": False, "status": 0, "error": str(e)[:120]}

async def download_media(client, url):
    try:
        r = await client.get(url, headers=HEADERS, follow_redirects=True, timeout=45)
        if r.status_code != 200:
            return {"url": url, "ok": False, "status": r.status_code}
        ext = Path(urllib.parse.urlparse(url).path).suffix or ".bin"
        if len(ext) > 5:
            ext = ".bin"
        # filename from url, sanitized, dedupe by sha1 of content
        name = Path(urllib.parse.urlparse(url).path).name or "asset"
        name = re.sub(r"[^A-Za-z0-9._-]", "_", name)
        if not name:
            name = "asset"
        if not name.lower().endswith(ext.lower()):
            name += ext
        digest = hashlib.sha1(r.content).hexdigest()[:12]
        final = f"{digest}-{name}"
        (OUT / "media").mkdir(parents=True, exist_ok=True)
        fp = OUT / "media" / final
        if not fp.exists():
            fp.write_bytes(r.content)
        return {"url": url, "ok": True, "file": final, "size": len(r.content)}
    except Exception as e:
        return {"url": url, "ok": False, "status": 0, "error": str(e)[:120]}

async def main():
    urls = [u.strip() for u in SITEMAP.read_text().splitlines() if u.strip()]
    (OUT / "html").mkdir(parents=True, exist_ok=True)
    (OUT / "content").mkdir(parents=True, exist_ok=True)
    (OUT / "media").mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(6)
    async with httpx.AsyncClient(http2=False, limits=httpx.Limits(max_connections=12)) as client:
        async def bounded(u, i):
            async with sem:
                return await fetch(client, u, i)
        pages = await asyncio.gather(*[bounded(u, i) for i, u in enumerate(urls)])
        ok = [p for p in pages if p.get("ok")]
        media_all = []
        for p in ok:
            for m in p.get("media", []):
                media_all.append(m)
        media_all = sorted(set(media_all))
        print(f"PAGES_OK={len(ok)}/{len(urls)} MEDIA_URLS={len(media_all)}", flush=True)
        # download media (with semaphore)
        sem2 = asyncio.Semaphore(6)
        async def bounded_dl(u):
            async with sem2:
                return await download_media(client, u)
        results = []
        for k in range(0, len(media_all), 50):
            chunk = media_all[k:k+50]
            res = await asyncio.gather(*[bounded_dl(u) for u in chunk])
            results.extend(res)
            dl_ok = sum(1 for r in res if r.get("ok"))
            print(f"MEDIA {k+len(chunk)}/{len(media_all)} ok={dl_ok}", flush=True)
        dl_files = [r for r in results if r.get("ok")]
        # manifest
        manifest = {
            "source": BASE,
            "scraped_at": __import__("datetime").datetime.now().isoformat(),
            "pages_total": len(urls),
            "pages_ok": len(ok),
            "pages_failed": [{"url": p["url"], "status": p.get("status"), "error": p.get("error")} for p in pages if not p.get("ok")],
            "media_urls_total": len(media_all),
            "media_downloaded": len(dl_files),
            "media_bytes": sum(r.get("size", 0) for r in dl_files),
            "pages": [{"url": p["url"], "slug": p["slug"], "title": p.get("title"), "media": p.get("media", [])} for p in ok],
            "media": [{"url": r["url"], "file": r["file"], "size": r["size"]} for r in dl_files]
        }
        (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1), encoding="utf-8")
        # summary
        lines = [
            f"# All Aspects at the Barn — Site Scrape ({len(ok)} pages, {len(dl_files)} media files)",
            "",
            f"- Pages scraped: {len(ok)} / {len(urls)}",
            f"- Unique media URLs: {len(media_all)}",
            f"- Media files downloaded: {len(dl_files)} ({sum(r.get('size',0) for r in dl_files)/1e6:.1f} MB)",
            "",
            "## Pages",
        ]
        for p in ok:
            lines.append(f"- [{p.get('title') or p['url']}]({p['url']}) -> `content/{p['slug']}.md`, `html/{p['slug']}.html`")
        lines.append("\n## Failed")
        for p in pages:
            if not p.get("ok"):
                lines.append(f"- {p['url']} status={p.get('status')} {p.get('error','')}")
        (OUT / "SUMMARY.md").write_text("\n".join(lines), encoding="utf-8")
        print(f"DONE pages={len(ok)} media={len(dl_files)} bytes={sum(r.get('size',0) for r in dl_files)}", flush=True)

if __name__ == "__main__":
    asyncio.run(main())