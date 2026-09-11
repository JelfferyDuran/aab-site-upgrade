# HANDOFF.md — State of the AAB Rebuild

_Last updated: 2026-09-11. This repo carries the complete scraped + analyzed source for the All Aspects at the Barn rebuild._

## Mission (short)
Recreate the visual system of the **Lone Mustang Ranch** Framer template ($49, Paulina Pixi) as a clean hand-built static site for **All Aspects at the Barn**, filled with AAB's own real content/brand, strengthened, **recreated not plagiarized** — and ship it live (it currently 404s). See `GOAL.md` and `CLAUDE.md` for full specs.

## What's DONE (verified)
- **AAB full site scrape:** `site-scrape/` — 2,828/2,830 pages (`html/` raw), `content/` md (media-lists — deprecated), `media/` 1,077 files (~561 MB, SHA-1 dedup), `manifest.json` (15 MB), `SUMMARY.md`. 2 crochet URLs 400 on the live site.
- **Content re-extraction:** `site-scrape/extract_clean_v2.py` extracts the real copy from `window.__BOOTSTRAP_STATE__` (Square Online is a Vue SPA; HTML bodies are ~30-char shells). Output → `content-clean/*.md` + `content-clean/_site/{AAB-DESIGN-SYSTEM,AAB-SEO-MAP,AAB-NAV,AAB-PAGES-META}.json`.
- **AAB brand recovered (verified):** primary `#435298` indigo; fonts Dancing Script (400 display) + Cardo (500 UI / 200 body); base 20px scale 1.25; icons thin-outline; logo path captured; email `allaspectsrecycled@gmail.com`, FB `allaspectsrepurposed/`, IG `allaspectsrestoredrecycled/`; hours Thu–Sat 10–5 + by appointment Sun–Wed; Route 611, Stone Church, Upper Mount Bethel, PA.
- **Template scrape:** `template-ranch/` — 12 pages, 66 media (18.2 MB), manifest, and **`RANCH-TEMPLATE-BLUEPRINT.md`** (full build spec).
- **Template stack analysis:** Framer export = static HTML + React/Framer Motion; 152 CSS custom-property tokens, 40 `--framer-*` type tokens, 29 hexes; fonts Alfa Slab One / Archivo / Rye (Inter, Karla present); palette cream/earth/rust/red/black/gold/lime.
- **Conversion audit** (earlier pass): 15 proofs, 9 conversion killers, 66/66 checkpoints — fixes live in `conversion-schema` skill + patched `index.html`.
- **Skills:** `.claude/skills/` × 4 — `framer-token-recreation`, `aab-content-migration`, `non-plagiarism-boundary`, `conversion-schema`.
- **Repo:** clean `main` (`index.html` patched baseline, `images/` 123, `.nojekyll`, `vercel.json`, `package.json`), branches `main` + `gh-pages`.

## What's NEXT (in order)
1. **Run/verify `content-clean` extraction complete** — confirm all 79 main pages + product pages have real copy.
2. **Build `tokens.css`** (AAB tokens, ranch rhythm) → foundation layout → Home → main pages → products → conversion pass (GOAL.md phases).
3. **Deploy & verify live.** Vercel project `aab-site-upgrade` (org `kingdom-noel`) currently shows SSO/login wall (the "404 on Brave" issue) — SSO protection must be disabled (PATCH `ssoProtection:null`) or redeploy public. GitHub Pages via `gh-pages` is the reliable fallback: `https://jelfferyduran.github.io/aab-site-upgrade/`.
4. **Media decision:** 561 MB media is gitignored or LFS — never raw-committed to GitHub.

## Guardrails
- No credentials in any file → `[REDACTED]`. Square creds & Vercel token exist on the source machine only.
- Non-plagiarism: layout system mirrored, everything expressive replaced with AAB's own (see `non-plagiarism-boundary`).
- English only. Verify deploys by reading the live HTML.
- Attribution: *Layout concept inspired by the Lone Mustang Ranch Framer template by Paulina Pixi ($49, framer.com marketplace). All content and brand assets © All Aspects at the Barn. Built from scratch.*

## File map
```
CLAUDE.md / GOAL.md / HANDOFF.md   ← this package
.claude/skills/                    ← 4 project skills
site-scrape/
  extract_clean.py                 (v1 — deprecated, empty output)
  extract_clean_v2.py              (v2 — THE extractor, bootstrap-based)
  content-clean/                   ← real copy + _site/ JSON (use this)
  content/  html/  media/  manifest.json  SUMMARY.md   (raw scrape)
template-ranch/
  RANCH-TEMPLATE-BLUEPRINT.md      ← build spec (8,221 chars)
  html/ content/ media/ manifest.json
index.html                         ← patched conversion baseline (single-page)
images/  vercel.json  package.json
```
