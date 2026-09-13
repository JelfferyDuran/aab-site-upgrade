"""ranch_probe.py — deterministic layout assertions for the six recreation pages.
Checks per page x viewport: nav rendered+visible, no horizontal overflow, all <img> loaded
(naturalWidth>0), hero height, h1 size, card/gallery grid column counts.
Usage: python scripts/ranch_probe.py
"""
import json, os, subprocess, time, urllib.request, base64
import websocket

CHROME = r"C:/Program Files/Google/Chrome/Application/chrome.exe"
ROOT = r"C:/Users/Jayto/aab-port"
DP = 9224
PAGES = ["about.html", "barn-brew-coffee-bar.html", "gallery.html",
         "pavilion-party-rental.html", "petting-farm.html", "contact.html"]
VIEWPORTS = [(1440, 900), (390, 844)]

PROBE_JS = r"""
(() => {
  const px = s => parseFloat(getComputedStyle(s).width) || 0;
  const nav = document.querySelector('.nav') || document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav a, nav a').length;
  const h1 = document.querySelector('h1');
  const hero = document.querySelector('.page-hero');
  const heroCS = hero ? getComputedStyle(hero) : null;
  const imgs = [...document.querySelectorAll('img')];
  const broken = imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src'));
  const grids = [...document.querySelectorAll('.card-grid,.gal-grid,.name-grid')].map(g => ({
    cls: g.className,
    cols: getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length,
    tracks: getComputedStyle(g).gridTemplateColumns,
    firstW: g.firstElementChild ? Math.round(g.firstElementChild.getBoundingClientRect().width) : 0,
    kids: g.children.length
  }));
  const h1s = document.querySelectorAll('h1');
  return {
    title: document.title,
    navFound: !!nav,
    navHeight: nav ? Math.round(nav.getBoundingClientRect().height) : 0,
    navLinks,
    h1s: h1s.length,
    h1Fonts: [...h1s].map(h => Math.round(parseFloat(getComputedStyle(h).fontSize))),
    h1Texts: [...h1s].map(h => h.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)),
    heroH1: (() => { const h = document.querySelector('.page-hero h1'); 
                     return h ? Math.round(parseFloat(getComputedStyle(h).fontSize)) : 0; })(),
    heroBgSet: heroCS ? heroCS.backgroundImage !== 'none' : false,
    heroH: hero ? Math.round(hero.getBoundingClientRect().height) : 0,
    heroBg: heroCS ? (heroCS.backgroundImage || '').slice(0, 60) : '',
    footerFound: !!document.querySelector('footer'),
    crumbsFound: !!document.querySelector('.crumbs'),
    ctaFound: !!document.querySelector('.page-cta'),
    imgCount: imgs.length,
    brokenImgs: broken,
    grids,
    docH: Math.round(document.documentElement.scrollHeight),
    hOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    scrollW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
    cardBg: document.querySelector('.info-card') ? getComputedStyle(document.querySelector('.info-card')).backgroundImage.slice(0, 40) : 'NO-CARD'
  };
})()
"""

def main():
    uad = os.path.join(os.environ["LOCALAPPDATA"], "Temp", "ranch-probe-profile")
    proc = subprocess.Popen([
        CHROME, "--headless=new", f"--remote-debugging-port={DP}",
        f"--user-data-dir={uad}", "--no-first-run", "--disable-gpu",
        "--remote-allow-origins=*", "--hide-scrollbars", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    out = []
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
        ws = websocket.create_connection(
            next(t for t in tabs if t.get("type") == "page")["webSocketDebuggerUrl"], timeout=60)
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
        cmd("Page.enable"); cmd("Runtime.enable")
        for page in PAGES:
            for w, h in VIEWPORTS:
                cmd("Emulation.setDeviceMetricsOverride", width=w, height=h,
                    deviceScaleFactor=1, mobile=(w < 800))
                cmd("Page.navigate", url=f"http://127.0.0.1:8126/{page}")
                time.sleep(2.0)
                res = cmd("Runtime.evaluate", expression=PROBE_JS, returnByValue=True)
                d = res["result"]["value"]
                d["page"] = page; d["vp"] = f"{w}x{h}"
                out.append(d)
                print(f"{page} {w}x{h}: nav={d['navFound']}/{d['navLinks']}lnk "
                      f"h1s={d['h1s']}{d['h1Fonts']} heroH1={d['heroH1']} hero={d['heroH']} "
                      f"heroBg={d['heroBgSet']} footer={d['footerFound']} cta={d['ctaFound']} "
                      f"imgs={d['imgCount']} broken={len(d['brokenImgs'])} overflow={d['hOverflow']} docH={d['docH']}")
                for t in d["h1Texts"][:3]:
                    print(f"      h1: {t}")
                for g in d["grids"]:
                    print(f"    grid {g['cls']}: {g['cols']}tracks [{g['tracks']}] {g['kids']} kids firstW={g['firstW']}")
                if d["brokenImgs"]:
                    print(f"    BROKEN IMGS: {d['brokenImgs']}")
        ws.close()
    finally:
        proc.terminate()
    os.makedirs(os.path.join(ROOT, "shots"), exist_ok=True)
    with open(os.path.join(ROOT, "shots", "ranch-probe.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, indent=1)
    print("saved shots/ranch-probe.json")

if __name__ == "__main__":
    main()