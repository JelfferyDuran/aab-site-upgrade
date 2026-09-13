"""CDP-driven viewport screenshots at scroll positions (true footer / bottom paint).

Headless --screenshot at 33,179px window height fails to rasterize the very
bottom of the page. This script launches Chrome with a normal 1440x900 viewport,
scrolls to real positions, and captures via CDP so the footer actually paints.
"""
import asyncio
import base64
import json
import subprocess
import time
import urllib.request
from pathlib import Path

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9223
URL = "http://127.0.0.1:8124/"
PROF = "C:/Users/Jayto/aab-port/capture/chrome-prof"
SHOTS = Path("C:/Users/Jayto/aab-port/shots")

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
        async with websockets.connect(tab["webSocketDebuggerUrl"], max_size=200_000_000) as ws:
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

            async def shot(name, y):
                await send("Runtime.evaluate",
                           {"expression": f"window.scrollTo(0, {y}); document.title='shot';"})
                await asyncio.sleep(2.0)
                r = await send("Page.captureScreenshot", {"format": "png"})
                data = base64.b64decode(r["result"]["data"])
                p = SHOTS / name
                p.write_bytes(data)
                print(f"{name}: {len(data)} bytes")

            # real bottom: last viewport
            r = await send("Runtime.evaluate",
                           {"expression": "document.documentElement.scrollHeight"})
            total = int(r["result"]["result"]["value"])
            print("scrollHeight:", total)
            await shot("bottom-real.png", total - 900)
            await shot("contact-real.png", 29500)
    finally:
        proc.terminate()

asyncio.run(main())
