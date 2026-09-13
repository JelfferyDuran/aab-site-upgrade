"""Parse the dumped DOM from the capture copy and report page geometry.

Usage: python scripts/geo_report.py capture/dom.html
"""
import html
import json
import re
import sys
from pathlib import Path

p = Path(sys.argv[1] if len(sys.argv) > 1 else "C:/Users/Jayto/aab-port/capture/dom.html")
raw = p.read_text(encoding="utf-8", errors="replace")

m = re.search(r'data-geo="([^"]*)"', raw)
if not m:
    print("NO data-geo ATTRIBUTE FOUND — probe did not run.")
    print("dom bytes:", len(raw))
    sys.exit(1)

payload = html.unescape(m.group(1))
d = json.loads(payload)
print("PAGE HEIGHT (1440x900 viewport):", d["page"], "px")
print("sections/footer found:", len(d["items"]))
for it in d["items"]:
    print("  ", it)
print("BROKEN IMAGES:", d["broken"] if d["broken"] else "none")
