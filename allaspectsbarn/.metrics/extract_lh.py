import json, sys

files = ['.metrics/lh_live.json', '.metrics/lh_mobile.json', '.metrics/lh_home_v2.json']
for f in files:
    print('='*60)
    print(f'FILE: {f}')
    print('='*60)
    try:
        with open(f) as fh:
            d = json.load(fh)
        audits = d.get('audits', d.get('lhr',{}).get('audits',{}))
        keys = ['largest-contentful-paint', 'first-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift', 'first-meaningful-paint']
        for k in keys:
            if k in audits:
                a = audits[k]
                print(f'{k}: {a.get("displayValue")} | numericValue={a.get("numericValue")}')
        lcp = audits.get('largest-contentful-paint', {})
        details = lcp.get('details', {})
        if details:
            items = details.get('items', [details.get('node', {})])
            for item in items[:3]:
                node = item.get('node', {})
                if node:
                    print(f'  LCP element: {node.get("selector", "?")} | {node.get("nodeLabel", "?")}')
        print()
        for k2 in ['mainthread-busy', 'bootup-time', 'third-party-mainthread', 'total-byte-weight', 'largest-contentful-paint-element']:
            if k2 in audits:
                a = audits[k2]
                val = a.get('displayValue','')
                nv = a.get('numericValue','?')
                print(f'{k2}: {val} | numericValue={nv}')
    except Exception as e:
        print(f'ERROR: {e}')
    print()
