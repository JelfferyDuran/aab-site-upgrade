"""Identify what renders BELOW the site footer, after forcing lazy images to load."""
import asyncio
import json
import subprocess
import time
import urllib.request

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9227
URL = "http://127.0.0.1:8124/"
PROF = "C:/Users/Jayto/aab-port/capture/chrome-prof-bottom"


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
                       {"width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False})
            await send("Page.navigate", {"url": URL})
            await asyncio.sleep(5)

            # Force every lazy image in by scrolling the whole page, then settle.
            await ev("""(() => {
              const h = document.documentElement.scrollHeight;
              for (let y = 0; y < h; y += 700) window.scrollTo(0, y);
              window.scrollTo(0, h);
              return h;
            })()""")
            await asyncio.sleep(4)
            await ev("window.scrollTo(0, 0);")
            await asyncio.sleep(2)

            print("docH:", await ev("document.documentElement.scrollHeight"))
            print("brokenImages:", await ev(
                "JSON.stringify([...document.images].filter(i => !i.complete || i.naturalWidth === 0)"
                ".map(i => i.currentSrc || i.src))"))

            print("\n--- whatsapp fab geometry ---")
            print(await ev("""(() => {
              const a = document.querySelector('.whatsapp-fab');
              if (!a) return 'NO FAB';
              const r = a.getBoundingClientRect();
              const s = a.querySelector('svg');
              const sr = s ? s.getBoundingClientRect() : null;
              const cs = getComputedStyle(a);
              return JSON.stringify({
                pos: cs.position, z: cs.zIndex, radius: cs.borderRadius,
                anchor: { w: Math.round(r.width), h: Math.round(r.height),
                          right: Math.round(window.innerWidth - r.right),
                          bottom: Math.round(window.innerHeight - r.bottom) },
                svg: sr ? { w: Math.round(sr.width), h: Math.round(sr.height) } : null,
                fill: s ? getComputedStyle(s).fill : null
              });
            })()"""))

            print("\n--- footer text ---")
            print(await ev("(() => { const f = document.querySelector('footer');"
                           " return f ? f.innerText.replace(/\\n+/g, ' | ').slice(0, 400) : 'NO FOOTER'; })()"))

            print("\n--- elements below footer ---")
            print(await ev("""(() => {
              const f = document.querySelector('footer');
              if (!f) return 'no footer';
              const fb = f.getBoundingClientRect().bottom + window.scrollY;
              const out = [];
              document.querySelectorAll('body *').forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.height < 20 || r.width < 100) return;
                const top = r.top + window.scrollY;
                const cs = getComputedStyle(el);
                if (cs.position === 'fixed' || cs.display === 'none') return;
                if (top >= fb - 5) {
                  out.push({ tag: el.tagName, cls: String(el.className || '').slice(0, 50),
                    top: Math.round(top), h: Math.round(r.height), w: Math.round(r.width),
                    bg: cs.backgroundColor, img: cs.backgroundImage.slice(0, 40),
                    txt: (el.innerText || '').replace(/\\s+/g, ' ').slice(0, 45) });
                }
              });
              return JSON.stringify(out.slice(0, 20), null, 1);
            })()"""))

            print("\n--- last section on page ---")
            print(await ev("""(() => {
              const secs = [...document.querySelectorAll('section, footer, div[id]')];
              return JSON.stringify(secs.slice(-6).map(s => ({
                tag: s.tagName, id: s.id, cls: String(s.className || '').slice(0, 40),
                top: Math.round(s.getBoundingClientRect().top + window.scrollY),
                h: Math.round(s.getBoundingClientRect().height)
              })));
            })()"""))
    finally:
        proc.terminate()


asyncio.run(main())
