import json

with open('.metrics/lh_after_mobile.json') as f:
    d = json.load(f)

audits = d.get('audits', {})
perf_score = d.get('categories', {}).get('performance', {}).get('score', '?')

print("=== MOBILE (after) ===")
print(f"Performance score: {perf_score}")
keys = ['largest-contentful-paint', 'first-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift']
for k in keys:
    if k in audits:
        a = audits[k]
        print(f'{k}: {a.get("displayValue")} | {a.get("numericValue",0)/1000:.1f}s')
if 'bootup-time' in audits:
    print(f'bootup-time: {audits["bootup-time"].get("displayValue")} | {audits["bootup-time"].get("numericValue",0)/1000:.1f}s')

print("\n=== MOBILE (before, lh_mobile.json) ===")
with open('.metrics/lh_mobile.json') as f:
    before = json.load(f)
before_audits = before.get('audits', before.get('lhr',{}).get('audits',{}))
before_score = before.get('categories', {}).get('performance', {}).get('score', '?')
print(f"Performance score: {before_score}")
for k in keys:
    if k in before_audits:
        a = before_audits[k]
        print(f'{k}: {a.get("displayValue")} | {a.get("numericValue",0)/1000:.1f}s')
if 'bootup-time' in before_audits:
    print(f'bootup-time: {before_audits["bootup-time"].get("displayValue")} | {before_audits["bootup-time"].get("numericValue",0)/1000:.1f}s')
