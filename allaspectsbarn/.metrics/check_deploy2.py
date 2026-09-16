import urllib.request, re, time

url = "https://allaspectsbarn.vercel.app"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, timeout=10).read().decode()

# All script chunks
scripts = re.findall(r'src="/_next/static/chunks/([^"]+\.js)"', html)
print(f"Total scripts: {len(scripts)}")
print("All chunks:")
for s in scripts:
    print(f"  {s}")

# Check page-specific and shared chunks for our changes
for s in scripts:
    if "page" in s or "cb5dd9a0" in s or "674" in s or "4-c0f5" in s or "356" in s or "619" in s:
        chunk_url = f"https://allaspectsbarn.vercel.app/_next/static/chunks/{s}"
        try:
            chunk_req = urllib.request.Request(chunk_url, headers={"User-Agent": "Mozilla/5.0"})
            chunk = urllib.request.urlopen(chunk_req, timeout=10).read().decode()
            has_inview = "inView" in chunk
            has_ioobserver = "IntersectionObserver" in chunk
            has_300px = "300px" in chunk
            print(f"\n  {s}: {len(chunk)} bytes | inView={has_inview} | IO={has_ioobserver} | 300px={has_300px}")
            if has_inview or has_300px:
                print("  ** CHANGES DETECTED **")
        except Exception as e:
            print(f"  {s}: error {e}")

# Also check Vercel deployment API
print("\n--- Checking Vercel deployments ---")
vercel_url = "https://api.vercel.com/v6/projects/prj_QrYKkULuR2GSzoChYlukBcwEJjbI/deployments?limit=3"
# Can't use Vercel API without token, so let's check via the deploy response headers
try:
    resp = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=10)
    deploy_id = resp.headers.get('x-vercel-id', 'unknown')
    print(f"  x-vercel-id: {deploy_id}")
except Exception as e:
    print(f"  Error: {e}")
