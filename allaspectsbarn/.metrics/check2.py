import json

# Check if lh_after2.json was written successfully
try:
    with open('.metrics/lh_after2.json') as f:
        d = json.load(f)
    audits = d.get('audits', {})
    perf_score = d.get('categories', {}).get('performance', {}).get('score', '?')
    print(f"=== DESKTOP (2nd run) ===")
    print(f"Performance score: {perf_score}")
    keys = ['largest-contentful-paint', 'first-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift']
    for k in keys:
        if k in audits:
            a = audits[k]
            print(f'{k}: {a.get("displayValue")} | {a.get("numericValue",0)/1000:.1f}s')
    if 'bootup-time' in audits:
        print(f'bootup-time: {audits["bootup-time"].get("displayValue")} | {audits["bootup-time"].get("numericValue",0)/1000:.1f}s')
except Exception as e:
    print(f"lh_after2.json error: {e}")
