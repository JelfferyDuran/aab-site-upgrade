"""Phase 3 QA: dual-viewport (desktop 1440x900 + phone 390x844) captures at real scroll anchors.

Also probes computed styles so the design system is machine-verified, not eyeballed:
pill radius, brand/gold tokens, hero cue position, FAQ accordion open/close, REASON badges.
"""
import asyncio
import base64
import json
import subprocess
import time
import urllib.request
from pathlib import Path

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9225
URL = "http://127.0.0.1:8124/"
PROF = "C:/Users/Jayto/aab-port/capture/chrome-prof-p3"
SHOTS = Path("C:/Users/Jayto/aab-port/shots")

VIEWPORTS = [("desktop", 1440, 900, 1, False), ("phone", 390, 844, 2, True)]
ANCHORS = [
    ("hero", None, 0),
    ("why", ".why", 90),
    ("gallery", "#gallery", 90),
    ("faq", ".faq-item", 150),
    ("booking", "#booking", 90),
    ("footer", "BOTTOM", 0),
]

PROBE = r"""(() => {
  const gs = (el, p) => el ? getComputedStyle(el)[p] : 'no-el';
  const brand = document.querySelector('.btn-primary');
  const ghost = document.querySelector('.btn-secondary');
  const cue = document.querySelector('.hero-scroll');
  const faqQ = document.querySelector('.faq-question');
  const ans = document.querySelector('.faq-answer');
  const out = {
    theme: document.querySelector('meta[name=theme-color]').content,
    brandVar: getComputedStyle(document.documentElement).getPropertyValue('--color-brand').trim(),
    goldVar: getComputedStyle(document.documentElement).getPropertyValue('--color-gold').trim(),
    btnRadius: gs(brand, 'borderRadius'),
    btnBg: gs(brand, 'backgroundColor'),
    btnShadow: gs(brand, 'boxShadow').slice(0, 30),
    ghostBorder: gs(ghost, 'borderTopColor'),
    ghostColor: gs(ghost, 'color'),
    cuePos: cue ? (Math.round(cue.getBoundingClientRect().bottom) + '/' + window.innerHeight) : 'MISSING',
    eyebrowBorder: gs(document.querySelector('.hero .eyebrow'), 'borderTopWidth'),
    navPos: gs(document.querySelector('.nav-links a'), 'position'),
    faqClosed: gs(ans, 'display'),
    faqIconClosed: getComputedStyle(faqQ, '::after').content,
    reasonBadge: getComputedStyle(document.querySelector('.why-card'), '::before').content,
    indigoLeft: (document.documentElement.outerHTML.match(/435298/g) || []).length,
    navDisplay: gs(document.querySelector('.nav-links'), 'display')
  };
  faqQ.click();
  out.faqOpen = gs(ans, 'display');
  out.faqIconOpen = getComputedStyle(faqQ, '::after').content;
  faqQ.click();
  out.faqReclosed = gs(ans, 'display');
  return JSON.stringify(out);
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

            for vp, w, h, dsf, mobile in VIEWPORTS:
                await send("Emulation.setDeviceMetricsOverride",
                           {"width": w, "height": h, "deviceScaleFactor": dsf, "mobile": mobile})
                await send("Page.navigate", {"url": URL})
                await asyncio.sleep(4)
                total = await ev("document.documentElement.scrollHeight")
                overflow = await ev("document.documentElement.scrollWidth > window.innerWidth")
                print(f"\n=== [{vp}] {w}x{h} dsf={dsf} scrollHeight={total} horizontalOverflow={overflow}")

                probe = await ev(PROBE)
                print(f"[{vp}] PROBE {probe}")

                for name, sel, off in ANCHORS:
                    if sel is None:
                        y = 0
                    elif sel == "BOTTOM":
                        y = total - h
                    else:
                        y = await ev(
                            "(() => { const e = document.querySelector('%s');"
                            " return e ? Math.max(0, Math.round(e.getBoundingClientRect().top"
                            " + window.scrollY - %d)) : -1; })()" % (sel, off)
                        )
                        if y in (-1, None):
                            print(f"[{vp}] {name}: SELECTOR MISSING ({sel})")
                            continue
                    await ev(f"window.scrollTo(0, {y});")
                    await asyncio.sleep(1.6)
                    r = await send("Page.captureScreenshot", {"format": "png"})
                    data = base64.b64decode(r["result"]["data"])
                    p = SHOTS / f"p3-{vp}-{name}.png"
                    p.write_bytes(data)
                    print(f"p3-{vp}-{name}.png: {len(data)} bytes @ y={y}")
    finally:
        proc.terminate()


asyncio.run(main())
