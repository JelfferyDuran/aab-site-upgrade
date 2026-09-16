import json

with open('.metrics/lh_after_mobile.json') as f:
    d = json.load(f)

audits = d.get('audits', {})

print("=== MOBILE LCP BREAKDOWN (after) ===")

# LCP breakdown
if 'largest-contentful-paint-element' in audits:
    a = audits['largest-contentful-paint-element']
    details = a.get('details', {})
    if details and 'items' in details:
        for item in details['items']:
            node = item.get('node', {})
            if node:
                print(f"LCP element selector: {node.get('selector', '?')}")
                print(f"LCP element label: {node.get('nodeLabel', '?')}")

# Mainthread breakdown
if 'mainthread-work-breakdown' in audits:
    a = audits['mainthread-work-breakdown']
    details = a.get('details', {})
    if details and 'items' in details:
        for item in details['items'][:10]:
            src = item.get('source', {})
            print(f"Mainthread: duration={item.get('duration',0):.0f}ms start={item.get('start',0):.0f}ms src={src.get('url','?')[:80]}")

# Bootup
if 'bootup-time' in audits:
    a = audits['bootup-time']
    details = a.get('details', {})
    if details and 'items' in details:
        for item in details['items'][:10]:
            src = item.get('source', {})
            url = src.get('url', '?')
            if 'allaspectsbarn' in url:
                url = url.split('/')[-1]
            print(f"Bootup: duration={item.get('duration',0):.0f}ms src={url[:80]}")

# First paint
for k in ['first-contentful-paint', 'largest-contentful-paint']:
    if k in audits:
        a = audits[k]
        print(f"\n{k}: {a.get('displayValue')} | numeric={a.get('numericValue',0)/1000:.2f}s")
        details = a.get('details', {})
        if details and 'items' in details:
            for item in details['items']:
                ts = item.get('timestamp', 0)
                phase = item.get('phase', '?')
                print(f"  phase={phase} timestamp={ts}")

# Network requests for the hero image
if 'network-requests' in audits:
    a = audits['network-requests']
    details = a.get('details', {})
    if details and 'items' in details:
        for item in details['items']:
            url = item.get('url', '')
            if 'storefront-hero' in url or 'image' in url.lower():
                start = item.get('startTime', 0)
                end = item.get('endTime', 0)
                dur = item.get('transferSize', 0)
                print(f"\nRequest: {url[:100]}")
                print(f"  startTime={start:.0f}ms endTime={end:.0f}ms duration={end-start:.0f}ms size={dur}")

# TTFB
if 'speed-index' in audits:
    a = audits['speed-index']
    print(f"\nspeed-index: {a.get('displayValue')} | numeric={a.get('numericValue',0)/1000:.2f}s")

# Total byte weight breakdown
if 'total-byte-weight' in audits:
    a = audits['total-byte-weight']
    details = a.get('details', {})
    if details and 'items' in details:
        for item in details['items'][:5]:
            url = item.get('url', '?')
            bs = item.get('bytes', 0)
            print(f"Byte weight: {bs} bytes | {url[:80]}")
