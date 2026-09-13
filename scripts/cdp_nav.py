"""Nav + logo geometry probe: what does the header actually render at each viewport?

Reports logo font-size / wrap lines / overflow, nav height, whether .nav-links
wraps into multiple rows (the mobile "junk drawer" look), and the form <select>.
"""
import asyncio
import json
import subprocess
import time
import urllib.request

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9226
URL = "http://127.0.0.1:8124/"
PROF = "C:/Users/Jayto/aab-port/capture/chrome-prof-nav"

VIEWPORTS = [("desktop", 1440, 900, 1, False), ("tablet", 1024, 768, 1, False), ("phone", 390, 844, 2, True)]

PROBE = r"""(() => {
  const cs = (el, p) => el ? getComputedStyle(el)[p] : 'no-el';
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
  const logo = document.querySelector('.nav-logo a');
  const nav = document.querySelector('.nav');
  const links = document.querySelector('.nav-links');
  const anchors = [...document.querySelectorAll('.nav-links a')];
  const rows = {};
  anchors.forEach(a => { const y = Math.round(a.getBoundingClientRect().top); rows[y] = (rows[y] || 0) + 1; });
  const lh = parseFloat(cs(logo, 'lineHeight')) || 0;
  const logoRect = logo ? logo.getBoundingClientRect() : null;
  const sel = document.querySelector('select');
  return JSON.stringify({
    vw: window.innerWidth,
    navHeight: nav ? Math.round(nav.getBoundingClientRect().height) : null,
    navBg: cs(nav, 'backgroundColor'),
    logo: {
      rect: r(logo),
      fontSize: cs(logo, 'fontSize'),
      lineHeight: cs(logo, 'lineHeight'),
      lines: lh && logoRect ? Math.round(logoRect.height / lh) : null,
      textW: logo ? Math.round(logo.scrollWidth) : null,
      clientW: logo ? Math.round(logo.clientWidth) : null,
      clipped: logo ? logo.scrollWidth > logo.clientWidth + 1 : null,
      fontFamily: cs(logo, 'fontFamily'),
      text: logo ? logo.textContent.trim() : null
    },
    logoH1: r(document.querySelector('.nav-logo')),
    links: {
      rect: r(links), display: cs(links, 'display'),
      flexWrap: cs(links, 'flexWrap'), gap: cs(links, 'gap'),
      visibility: cs(links, 'visibility'), opacity: cs(links, 'opacity')
    },
    linkCount: anchors.length,
    linkRowCount: Object.keys(rows).length,
    linkRows: rows,
    firstLink: { rect: r(anchors[0]), fontSize: cs(anchors[0], 'fontSize') },
    select: sel ? { rect: r(sel), appearance: cs(sel, 'appearance'),
      borderW: cs(sel, 'borderTopWidth'), opts: sel.options.length,
      height: Math.round(sel.getBoundingClientRect().height) } : 'no-select',
    hOverflow: document.documentElement.scrollWidth > window.innerWidth,
    scrollW: document.documentElement.scrollWidth,
    bodyW: document.body.scrollWidth,
    heroTitleSize: cs(document.querySelector('.hero-title'), 'fontSize'),
    heroTop: Math.round(document.querySelector('.hero').getBoundingClientRect().top),
    containerW: Math.round(document.querySelector('.nav .container').getBoundingClientRect().width)
  });
})()"""


INTERACT_PROBE = """(() => {
  const toggle = document.getElementById('navToggle');
  const navList = document.getElementById('primaryNav');
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
  const link = document.querySelector('.nav-links a');
  return JSON.stringify({
    toggleDisplay: toggle ? getComputedStyle(toggle).display : 'no-toggle',
    toggleRect: r(toggle),
    ariaExpanded: toggle ? toggle.getAttribute('aria-expanded') : null,
    listIsOpen: navList ? navList.classList.contains('is-open') : null,
    listRect: r(navList),
    listVisibility: navList ? getComputedStyle(navList).visibility : null,
    listOpacity: navList ? getComputedStyle(navList).opacity : null,
    listMaxHeight: navList ? getComputedStyle(navList).maxHeight : null,
    bodyLocked: document.body.classList.contains('nav-open'),
    firstLinkRect: r(link)
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
            await send("Network.enable")
            await send("Network.setCacheDisabled", {"cacheDisabled": True})

            for vp, w, h, dsf, mobile in VIEWPORTS:
                await send("Emulation.setDeviceMetricsOverride",
                           {"width": w, "height": h, "deviceScaleFactor": dsf, "mobile": mobile})
                await send("Page.navigate", {"url": URL})
                await asyncio.sleep(3.5)
                print(f"\n=== [{vp}] {w}x{h} ===")
                out = await ev(PROBE)
                try:
                    print(json.dumps(json.loads(out), indent=2))
                except Exception:
                    print(out)
                if vp == "phone":
                    await ev("document.getElementById('navToggle').click()")
                    await asyncio.sleep(0.8)
                    print("\n--- phone: AFTER toggle OPEN ---")
                    print(json.dumps(json.loads(await ev(INTERACT_PROBE)), indent=2))
                    await ev("document.getElementById('navToggle').click()")
                    await asyncio.sleep(0.8)
                    print("\n--- phone: AFTER toggle CLOSE ---")
                    print(json.dumps(json.loads(await ev(INTERACT_PROBE)), indent=2))
                    await ev("document.getElementById('navToggle').click()")
                    await asyncio.sleep(0.8)
                    await ev("document.querySelector('.nav-links a').click()")
                    await asyncio.sleep(1.2)
                    print("\n--- phone: AFTER LINK CLICK (should be closed + scrolled to top) ---")
                    print(json.dumps(json.loads(await ev(INTERACT_PROBE)), indent=2))
                    print("scrollY=", await ev("window.scrollY"))
    finally:
        proc.terminate()


asyncio.run(main())
