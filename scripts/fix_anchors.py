"""Fix the 2 dead nav anchors in the ranch build: #about and #gallery."""
import re, shutil, sys

SRC = r"C:\Users\Jayto\aab-port\build\index.html"

html = open(SRC, encoding="utf-8").read()
targets = [("The Barn", "about"), ("As Seen on TikTok", "gallery")]

for heading, sid in targets:
    hpos = html.find(heading)
    if hpos == -1:
        print("HEADING NOT FOUND:", heading); sys.exit(1)
    spos = html.rfind("<section", 0, hpos)
    epos = html.find(">", spos)
    tag = html[spos:epos + 1]
    if 'id=' in tag:
        print("already has id:", tag); continue
    new = tag[:-1] + ' id="%s">' % sid
    html = html[:spos] + new + html[epos + 1:]
    print("patched: %s -> %s" % (tag, new))

open(SRC, "w", encoding="utf-8", newline="").write(html)

# promote to repo root
shutil.copyfile(SRC, r"C:\Users\Jayto\aab-port\index.html")
shutil.copyfile(r"C:\Users\Jayto\aab-port\build\styles.css", r"C:\Users\Jayto\aab-port\styles.css")
print("\n--- section tags now ---")
for m in re.findall(r'<section[^>]*>', html):
    print(m)
print("\n--- nav anchors ---")
for m in sorted(set(re.findall(r'href="(#[^"]*)"', html))):
    print(m)
