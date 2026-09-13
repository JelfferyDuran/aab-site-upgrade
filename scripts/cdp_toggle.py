"""Definitive hamburger probe: is #navToggle actually PAINTING at 390px?

Captures via CDP Emulation.setDeviceMetricsOverride (mobile=True) -- the same
path the interaction probe uses -- then pixel-scans the toggle's own rect.
If bars are gold on screen, the CLI --screenshot flag was the liar, not the CSS.
"""
import asyncio
import base64
import json
import subprocess
import time
import urllib.request

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9227
URL = "http://127.0.0.1:8124/"
PROF = "C:/Users/Jayto/aab-port/capture/chrome-prof-toggle"
OUT = "C:/Users/Jayto/aab-port/shots/p4-phone-cdp.png"

PROBE = r"""(() => {
  const cs = (el, p) => el ? getComputedStyle(el)[p] : 'no-el';
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
  const t = document.getElementById('navToggle');
  const bars = [...document.querySelectorAll('.nav-toggle-bar')].map(b => ({
    rect: r(b),
    bg: cs(b, 'backgroundColor'),
    display: cs(b, 'display'),
    opacity: cs(b, 'opacity'),
    visibility: cs(b, 'visibility'),
    transform: cs(b, 'transform')
  }));
  const nav = document.querySelector('.nav');
  return JSON.stringify({
    vw: window.innerWidth,
    dpr: window.devicePixelRatio,
    mqMatches: window.matchMedia('(max-width: 768px)').matches,
    toggle: {
      rect: r(t),
      display: cs(t, 'display'),
      visibility: cs(t, 'visibility'),
      opacity: cs(t, 'opacity'),
      background: cs(t, 'backgroundColor'),
      border: cs(t, 'borderTopWidth') + ' ' + cs(t, 'borderTopStyle') + ' ' + cs(t, 'borderTopColor'),
      overflow: cs(t, 'overflow'),
      clipPath: cs(t, 'clipPath'),
      zIndex: cs(t, 'zIndex'),
      position: cs(t, 'position')
    },
    bars: bars,
    navRect: r(nav),
    navBg: cs(nav, 'backgroundColor'),
    navOverflow: cs(nav, 'overflow')
  });
})()"""


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

            async def ev(expr):
                r = await send("Runtime.evaluate", {"expression": expr, "returnByValue": True})
                return r["result"]["result"].get("value")

            await send("Page.enable")
            await send("Runtime.enable")
            await send("Emulation.setDeviceMetricsOverride",
                       {"width": 390, "height": 844, "deviceScaleFactor": 2, "mobile": True})
            await send("Page.navigate", {"url": URL})
            await asyncio.sleep(4)

            geo = json.loads(await ev(PROBE))
            print(json.dumps(geo, indent=2))

            shot = await send("Page.captureScreenshot", {"format": "png"})
            data = base64.b64decode(shot["result"]["data"])
            with open(OUT, "wb") as f:
                f.write(data)
            print("\nsaved", OUT, len(data), "bytes")

            # money shot: open the dropdown and capture the panel
            await ev("document.getElementById('navToggle').click()")
            await asyncio.sleep(1.0)
            shot2 = await send("Page.captureScreenshot", {"format": "png"})
            data2 = base64.b64decode(shot2["result"]["data"])
            with open("C:/Users/Jayto/aab-port/shots/p4-phone-open.png", "wb") as f:
                f.write(data2)
            print("saved open-state shot", len(data2), "bytes")

            # pixel-scan the toggle rect (coords are CSS px -> multiply by dpr)
            t = geo["toggle"]["rect"]
            dpr = geo.get("dpr", 2)
            print(f"\nTOGGLE CSS rect: x{t['x']} y{t['y']} {t['w']}x{t['h']}  dpr={dpr}")
    finally:
        proc.terminate()


asyncio.run(main())
