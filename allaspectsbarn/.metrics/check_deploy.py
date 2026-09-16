import urllib.request, re, json, time

url = "https://allaspectsbarn.vercel.app"
for attempt in range(15):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req, timeout=10).read().decode()
        # Check for our new useInView import in the deployed JS
        scripts = re.findall(r'src="/_next/static/chunks/([^"]+\.js)"', html)
        print(f"Deploy check {attempt+1}: {len(scripts)} scripts found")
        for s in scripts[:5]:
            print(f"  chunk: {s}")
        # Check if there's a new deploy URL pattern
        deploys = re.findall(r'https://[a-z0-9-]+\.vercel\.app', html)
        if deploys:
            print(f"  deploy URL: {deploys[0]}")
        # Check for useInView in the main chunk
        for s in scripts:
            if "4bd1b696" in s or "cb5dd9a0" in s:
                chunk_url = f"https://allaspectsbarn.vercel.app/_next/static/chunks/{s}"
                try:
                    chunk_req = urllib.request.Request(chunk_url, headers={"User-Agent": "Mozilla/5.0"})
                    chunk = urllib.request.urlopen(chunk_req, timeout=10).read().decode()
                    if "useInView" in chunk or "IntersectionObserver" in chunk:
                        print(f"  HAS useInView/IO: {s} ({len(chunk)} bytes)")
                    else:
                        print(f"  no useInView: {s} ({len(chunk)} bytes)")
                except Exception as e:
                    print(f"  error fetching {s}: {e}")
                break
        break
    except Exception as e:
        print(f"Attempt {attempt+1} failed: {e}")
        time.sleep(10)
