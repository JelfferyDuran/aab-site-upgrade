# CLAUDE.md — All Aspects at the Barn · Site Upgrade

You are working on the **AAB site upgrade**: rebuilding `allaspectsbarn.com` as a clean, hand-built static website that mirrors the layout/structure/design system of the **"Lone Mustang Ranch" Framer template** ($49, by Paulina Pixi) — **recreated, not plagiarized** — filled with AAB's **real content and brand**.

## Read first (in this order)
1. `GOAL.md` — the build goal and acceptance criteria
2. `HANDOFF.md` — what was captured and what's pending
3. `.claude/skills/` — load ALL four before any build work:
   - `framer-token-recreation` — convert the template's 152 CSS tokens to clean CSS
   - `aab-content-migration` — how real AAB content is structured in the extraction
   - `non-plagiarism-boundary` — legal/ethical rules (MUST follow)
   - `conversion-schema` — conversion features to carry over (schema.org, newsletter, WhatsApp booking)

## Source data (already captured, local)
- `site-scrape/content-clean/` — **2,828 markdown files**, one per live page, extracted from `window.__BOOTSTRAP_STATE__` (the real content layer; the visible HTML is a JS shell). Includes `_site/` JSON: `AAB-DESIGN-SYSTEM.json`, `AAB-NAV.json`, `AAB-PAGES-META.json`, `AAB-SEO-MAP.json`.
- `template-ranch/RANCH-TEMPLATE-BLUEPRINT.md` — full build spec of the template (fonts, palette, structure).
- `site-scrape/extract_clean_v2.py` — the extractor (re-run with `C:/Users/Jayto/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe`).

## AAB's real design system (from the live site)
- Primary: `#435298` indigo · base 20px · scale 1.25
- Display: **Dancing Script** (400) · Body/UI: **Cardo** (200/500) — Google Fonts
- Contact: `allaspectsrecycled@gmail.com` · FB `allaspectsrepurposed/` · IG `allaspectsrestoredrecycled/`
- Full per-page SEO titles/descriptions in `AAB-SEO-MAP.json`

## Template design system (to mirror, not copy assets)
- Display **Alfa Slab One** · Body **Archivo** · Accent **Rye**
- Palette: creams `#ddd1c5 #efe5d2 #e5dfdd #eee8e2`; earth browns `#332622 #4c3833 #664b44 #997e77`; rust `#b1502a`; deep reds `#b41d1a #b51d1a`; near-black `#0b0b0c`; gold `#d99a23 #fec202`; lime `#eefe45`
- Reconcile the template palette with AAB's `#435298` indigo before building — AAB's brand wins.

## Hard rules
- **Recreate, never plagiarize:** do not reuse Paulina's copy, images, or assets. Swap template hero lines ("A Barn to Call Home", "Saddle up with us") for AAB's real voice/content.
- **No credentials anywhere:** API keys/tokens → `[REDACTED]`.
- AAB's product pages (2,751) get their names from static `<meta og:title>` — product display JSON is sparse.
- Keep skills committed to the repo; the build must work from a fresh clone + this file alone.

## Stack
Clean HTML/CSS/JS (static, no framework). Deploy targets: GitHub Pages (`jelfferyduran.github.io/aab-site-upgrade/`, live) and Vercel (`aab-site-upgrade.vercel.app`, SSO off, live).
