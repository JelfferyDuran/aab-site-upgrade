import json

with open('.metrics/lh_after.json') as f:
    d = json.load(f)

audits = d.get('audits', {})

print("=== PERFORMANCE AFTER (desktop) ===")
keys = ['largest-contentful-paint', 'first-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift', 'first-meaningful-paint']
for k in keys:
    if k in audits:
        a = audits[k]
        print(f'{k}: {a.get("displayValue")} | numericValue={a.get("numericValue")}')

print()
for k2 in ['bootup-time', 'total-byte-weight', 'mainthread-busy']:
    if k2 in audits:
        a = audits[k2]
        print(f'{k2}: {a.get("displayValue","")} | numericValue={a.get("numericValue","?")}')

# Performance score
perf_score = d.get('categories', {}).get('performance', {}).get('score', '?')
print(f"\nPerformance score: {perf_score}")

# Long tasks
if 'mainthread-work-breakdown' in audits:
    a = audits['mainthread-work-breakdown']
    print(f"mainthread-work-breakdown: {a.get('displayValue','')}")

# Long tasks
if 'long-tasks' in audits:
    a = audits['long-tasks']
    details = a.get('details', {})
    if details and 'items' in details:
        for item in details['items'][:10]:
            print(f"  long task: duration={item.get('duration',0):.0f}ms startTime={item.get('startTime',0):.0f}ms source={item.get('source',{}).get('url','?')}")

# LCP breakdown
if 'largest-contentful-paint-element' in audits:
    a = audits['largest-contentful-paint-element']
    details = a.get('details', {})
    if details and 'items' in details:
        for item in details['items'][:3]:
            node = item.get('node', {})
            if node:
                print(f"\nLCP element: {node.get('selector', '?')}")
                print(f"  nodeLabel: {node.get('nodeLabel', '?')}")

# Compare with before
print("\n=== COMPARISON ===")
with open('.metrics/lh_home_v2.json') as f:
    before = json.load(f)
before_audits = before.get('audits', before.get('lhr',{}).get('audits',{}))
for k in keys:
    if k in before_audits and k in audits:
        before_val = before_audits[k].get('numericValue', 0)
        after_val = audits[k].get('numericValue', 0)
        change = ((after_val - before_val) / before_val * 100) if before_val else 0
        print(f'{k}: {before_val/1000:.1f}s -> {after_val/1000:.1f}s ({change:+.1f}%)')
