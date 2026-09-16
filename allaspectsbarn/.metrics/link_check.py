"""Full live link check for allaspectsbarn.vercel.app — all 2,769 sitemap URLs + core pages."""
import concurrent.futures as cf
import json
import re
import time
import urllib.request

BASE = "https://allaspectsbarn.vercel.app"
URLS = [u.strip() for u in open(r"C:/Users/Jayto/Documents/Home/allaspectsbarn/.metrics/live_urls.txt", encoding="utf-8") if u.strip()]

# Extra core routes not in sitemap (must return 200 or proper 404)
EXTRA = [
    ("/sitemap.xml", 200),
    ("/robots.txt", 200),
    ("/this-page-does-not-exist-xyz-123", 404),
]

def check(u):
    req = urllib.request.Request(u, method="GET", headers={"User-Agent": "Mozilla/5.0 (compatible; linkcheck)"})
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = r.read()
            return u, r.status, len(body), round(time.time() - t0, 2), None
    except urllib.error.HTTPError as e:
        return u, e.code, 0, round(time.time() - t0, 2), None
    except Exception as e:
        return u, None, 0, round(time.time() - t0, 2), str(e)[:120]

def main():
    results = []
    with cf.ThreadPoolExecutor(max_workers=32) as ex:
        for res in ex.map(check, URLS):
            results.append(res)
    # Extra checks
    extras = []
    for path, want in EXTRA:
        u = BASE + path
        req = urllib.request.Request(u, method="GET", headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                code = r.status
        except urllib.error.HTTPError as e:
            code = e.code
        except Exception as e:
            code = str(e)[:60]
        extras.append((u, code, want))

    by_code = {}
    for u, code, size, ms, err in results:
        by_code.setdefault(code, []).append(u)

    print("=" * 60)
    print(f"LINK CHECK | {len(results)} sitemap URLs | {time.time() - 0:.0f}s wall")
    print("=" * 60)
    for code in sorted(by_code, key=lambda c: (c != 200, str(c))):
        urls = by_code[code]
        print(f"  HTTP {code}: {len(urls)}")
        if code != 200:
            for u in urls[:20]:
                print(f"      BROKEN -> {u}")
            if len(urls) > 20:
                print(f"      ... and {len(urls)-20} more")
    print("-" * 60)
    print("EXTRA ROUTES:")
    for u, code, want in extras:
        ok = "OK" if code == want else "FAIL"
        print(f"  [{ok}] {u} -> {code} (expected {want})")
    print("-" * 60)
    total_ms = sum(r[3] for r in results)
    print(f"Totals: 200={by_code.get(200, []) and len(by_code[200]) or 0} | non-200={len(results)-(by_code.get(200,[]) and len(by_code[200]) or 0)} | avg {total_ms/len(results):.2f}s/url")

if __name__ == "__main__":
    main()
