"""ranch_shot.py — headless-Chrome preview captures for the six recreation pages.
Usage: python scripts/ranch_shot.py
Saves full-page + hero captures to shots/ranch/.
"""
import json, os, subprocess, sys, time, urllib.request, websocket  # noqa: websocket via pip websocket-client

CHROME = r"C:/Program Files/Google/Chrome/Application/chrome.exe"
ROOT = r"C:/Users/Jayto/aab-port"
OUT = os.path.join(ROOT, "shots", "ranch")
os.makedirs(OUT, exist_ok=True)
DP = 9223
PAGES = [
    ("about.html", "about"),
    ("barn-brew-coffee-bar.html", "brew"),
    ("gallery.html", "gallery"),
    ("pavilion-party-rental.html", "pavilion"),
    ("petting-farm.html", "farm"),
    ("contact.html", "contact"),
]
VIEWPORTS = [(1440, 900), (390, 844)]

def main():
    uad = os.path.join(os.environ["LOCALAPPDATA"], "Temp", "ranch-shot-profile")
    proc = subprocess.Popen([
        CHROME, "--headless=new", f"--remote-debugging-port={DP}",
        f"--user-data-dir={uad}", "--no-first-run", "--disable-gpu",
        "--remote-allow-origins=*",
        "--hide-scrollbars", "--force-device-scale-factor=2", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        # wait for devtools endpoint
        for _ in range(60):
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{DP}/json", timeout=2) as r:
                    tabs = json.load(r)
                if tabs:
                    break
            except Exception:
                time.sleep(0.5)
        ws_url = next(t for t in tabs if t.get("type") == "page")["webSocketDebuggerUrl"]
        ws = websocket.create_connection(ws_url, timeout=60)
        mid = 0
        def cmd(method, **params):
            nonlocal mid
            mid += 1
            ws.send(json.dumps({"id": mid, "method": method, "params": params}))
            while True:
                msg = json.loads(ws.recv())
                if msg.get("id") == mid:
                    if "error" in msg:
                        raise RuntimeError(f"{method}: {msg['error']}")
                    return msg.get("result", {})
        cmd("Page.enable")
        cmd("Runtime.enable")
        for page, tag in PAGES:
            for w, h in VIEWPORTS:
                cmd("Emulation.setDeviceMetricsOverride", width=w, height=h,
                    deviceScaleFactor=2, mobile=(w < 800))
                cmd("Page.navigate", url=f"http://127.0.0.1:8126/{page}")
                time.sleep(2.2)
                # full-page metrics
                lm = cmd("Page.getLayoutMetrics")
                fh = int(lm.get("contentSize", {}).get("height", h))
                # viewport screenshot (synchronous reply)
                res = cmd("Page.captureScreenshot", format="png", captureBeyondViewport=False,
                    fromSurface=True)
                with open(os.path.join(OUT, f"{tag}_{w}x{h}.png"), "wb") as f:
                    f.write(__import__("base64").b64decode(res["data"]))
                print(f"OK {tag} {w}x{h} ({len(res['data'])}b)")
        ws.close()
    finally:
        proc.terminate()

if __name__ == "__main__":
    main()