"""ranch_debug.py — what is actually in the tab after navigate?"""
import json, os, subprocess, time, urllib.request
import websocket

CHROME = r"C:/Program Files/Google/Chrome/Application/chrome.exe"
DP = 9225
uad = os.path.join(os.environ["LOCALAPPDATA"], "Temp", "ranch-dbg-profile")
proc = subprocess.Popen([CHROME, "--headless=new", f"--remote-debugging-port={DP}",
    f"--user-data-dir={uad}", "--no-first-run", "--disable-gpu",
    "--remote-allow-origins=*", "--hide-scrollbars", "about:blank"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    tabs = None
    for _ in range(60):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{DP}/json", timeout=2) as r:
                tabs = json.load(r)
            if tabs:
                break
        except Exception:
            time.sleep(0.5)
    print("TARGETS:", [(t.get("type"), t.get("url")) for t in tabs])
    ws = websocket.create_connection(tabs[0]["webSocketDebuggerUrl"], timeout=60)
    mid = 0
    def cmd(m, **p):
        global mid
        mid += 1
        ws.send(json.dumps({"id": mid, "method": m, "params": p}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get("id") == mid:
                if "error" in msg:
                    raise RuntimeError(f"{m}: {msg['error']}")
                return msg.get("result", {})
    cmd("Page.enable"); cmd("Runtime.enable")
    nav = cmd("Page.navigate", url="http://127.0.0.1:8126/about.html")
    print("NAV RESULT:", json.dumps(nav)[:300])
    time.sleep(2.5)
    for expr in [
        "location.href",
        "document.title",
        "document.readyState",
        "document.documentElement.outerHTML.length",
        "document.body ? document.body.innerText.slice(0,200) : 'NO BODY'",
        "document.querySelectorAll('nav').length + '|' + document.querySelectorAll('img').length",
    ]:
        r = cmd("Runtime.evaluate", expression=expr, returnByValue=True)
        v = r.get("result", {})
        print(f"  {expr[:40]:42s} -> {str(v.get('value'))[:200]}")
    ws.close()
finally:
    proc.terminate()
