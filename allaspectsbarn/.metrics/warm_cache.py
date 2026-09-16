import urllib.request, time

urls = [
    "https://allaspectsbarn.vercel.app/",
    "https://allaspectsbarn.vercel.app/_next/image?url=%2Fimages%2Fstorefront-hero.webp&w=640&q=65",
    "https://allaspectsbarn.vercel.app/_next/image?url=%2Fimages%2Fstorefront-hero.webp&w=828&q=65",
    "https://allaspectsbarn.vercel.app/_next/image?url=%2Fimages%2Fstorefront-hero.webp&w=1080&q=65",
    "https://allaspectsbarn.vercel.app/_next/static/chunks/4bd1b696-c023c6e3521b1417.js",
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=15)
        print(f"  {url[:70]}... -> {resp.status} ({len(resp.read())} bytes)")
        resp.close()
    except Exception as e:
        print(f"  {url[:70]}... -> ERROR: {e}")
    time.sleep(0.2)

print("\nCache warmed. Ready for Lighthouse mobile run.")
