"""Ad-hoc CDP probe: evaluate JS expressions against the page and print results."""
import asyncio
import json
import subprocess
import sys
import time
import urllib.request

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9226
URL = "http://127.0.0.1:8124/"
PROF = "C:/Users/Jayto/aab-port/capture/chrome-prof-probe"

EXPRS = {
    "headline_colors": """
(() => {
  const g = (sel, p) => { const e = document.querySelector(sel); return e ? getComputedStyle(e)[p] : 'no-el'; };
  return JSON.stringify({
    h1Color: g('.hero h1', 'color'),
    h1Font: g('.hero h1', 'fontFamily').slice(0, 50),
    logoColor: g('.logo, .nav-logo, .brand, .site-title, nav a', 'color'),
    navBg: g('nav, header, .nav', 'backgroundColor'),
    navPos: g('nav, header, .nav', 'position'),
    eyebrowColor: g('.hero .eyebrow', 'color'),
    tickerBg: g('.ticker', 'backgroundColor'),
    sectionTitleColor: g('.section-title', 'color')
  });
})()""",
    "bottom_inventory": """
(() => {
  const out = [];
  document.querySelectorAll('body *').forEach(el => {
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY;
    const cs = getComputedStyle(el);
    if (top > 31400 && r.height > 80 && r.width > 250 && cs.position !== 'fixed' && cs.display !== 'none') {
      out.push({
        tag: el.tagName, cls: String(el.className || '').slice(0, 55),
        top: Math.round(top), h: Math.round(r.height), w: Math.round(r.width),
        bg: cs.backgroundColor, img: cs.backgroundImage.slice(0, 45)
      });
    }
  });
  return JSON.stringify(out.slice(0, 22));
})()""",
    "footer_geometry": """
(() => {
  const f = document.querySelector('footer');
  const r = f ? f.getBoundingClientRect() : null;
  const kids = f ? [...f.children].map(c => ({ t: c.tagName, c: String(c.className||'').slice(0,40), h: Math.round(c.getBoundingClientRect().height) })) : [];
  return JSON.stringify({
    footerTop: r ? Math.round(r.top + window.scrollY) : 'no-footer',
    footerH: r ? Math.round(r.height) : 0,
    docH: document.documentElement.scrollHeight,
    afterFooter: r ? document.documentElement.scrollHeight - Math.round(r.bottom + window.scrollY) : 0,
    children: kids
  });
})()""",
    "reason_badges": """
(() => {
  const cards = [...document.querySelectorAll('.why-card')];
  return JSON.stringify({
    count: cards.length,
    badges: cards.map(c => getComputedStyle(c, '::before').content),
    counterReset: getComputedStyle(document.querySelector('.why-grid') || document.body).counterReset,
    counterInc: cards.length ? getComputedStyle(cards[0]).counterIncrement : 'none'
  });
})()""",
}


async def main():
    proc = subprocess.Popen(
        [CHROME, "--headless=new", "--disable-gpu", f"--remote-debugging-port={PORT}",
         f"--user-data-dir={PROF}", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        for _ in range(60):
            try:
                urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/version", timeout=1)
                break
            except Exception:
                time.sleep(0.25)
        req = urllib.request.Request(f"http://127.0.0.1:{PORT}/json/new?{URL}", method="PUT")
        tab = json.load(urllib.request.urlopen(req, timeout=5))
        import websockets
        async with websockets.connect(tab["webSocketDebuggerUrl"], max_size=300_000_000) as ws:
            mid = 0

            async def send(method, params=None):
                nonlocal mid
                mid += 1
                await ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
                while True:
                    msg = json.loads(await ws.recv())
                    if msg.get("id") == mid:
                        return msg

            await send("Page.enable")
            await send("Runtime.enable")
            await send("Emulation.setDeviceMetricsOverride",
                       {"width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False})
            await send("Page.navigate", {"url": URL})
            await asyncio.sleep(4)
            for name, expr in EXPRS.items():
                r = await send("Runtime.evaluate", {"expression": expr, "returnByValue": True})
                val = r["result"]["result"].get("value")
                print(f"\n--- {name} ---\n{val}")
    finally:
        proc.terminate()


asyncio.run(main())
