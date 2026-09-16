import json

with open('.metrics/lh_home_v2.json') as fh:
    d = json.load(fh)

audits = d.get('audits', d.get('lhr',{}).get('audits',{}))

# LCP element details
lcp = audits.get('largest-contentful-paint', {})
print("=== LCP Audit ===")
print(json.dumps(lcp.get('details', {}), indent=2)[:3000])
print()

# Mainthread busy / long tasks
for k in ['mainthread-busy', 'long-tasks', 'third-party-summary', 'script-main', 'image-size-responsive', 'image-dimensions']:
    if k in audits:
        a = audits[k]
        print(f"\n=== {k} ===")
        print(f"  displayValue: {a.get('displayValue','')}")
        det = a.get('details', {})
        if det:
            items = det.get('items', det.get('node', {}))
            if isinstance(items, list):
                for item in items[:10]:
                    print(f"  item: {json.dumps(item)[:300]}")
            else:
                print(f"  node: {json.dumps(items)[:300]}")
        else:
            print(f"  description: {a.get('description','')[:200]}")

# Opportunities
print("\n=== OPPORTUNITIES ===")
for k in ['render-blocking-resources', 'uses-responsive-images', 'offscreen-images', 'unminified-javascript', '_unused-javascript']:
    if k in audits:
        a = audits[k]
        print(f"\n{k}: displayValue={a.get('displayValue','')} | savings={a.get('numericValue',0)/1000:.1f}ms")
        det = a.get('details', {})
        if det and 'items' in det:
            for item in det['items'][:10]:
                print(f"  {json.dumps(item)[:300]}")

# Network requests for the hero image
print("\n=== NETWORK REQUESTS (top 20 by size) ===")
nr = audits.get('network-requests', {})
if 'details' in nr:
    items = nr['details'].get('items', [])
    items_sorted = sorted(items, key=lambda x: x.get('transferSize', 0), reverse=True)
    for item in items_sorted[:20]:
        print(f"  {item.get('url','?')[:120]} | transfer={item.get('transferSize',0)//1000}KB | start={item.get('startTime',0)*1000:.0f}ms | end={item.get('endTime',0)*1000:.0f}ms | type={item.get('resourceType','?')}")
