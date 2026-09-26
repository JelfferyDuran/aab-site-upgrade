# HANDOFF.md — State of the AAB Rebuild

## ⚠️ Canonical production moved

**Do not deploy this repository to the `allaspectsbarn` Vercel project.**

Git auto-deploys are disabled in this repo through `vercel.json` (`git.deploymentEnabled: false`) as a safety brake while the Vercel project is being reconnected to the canonical Next.js repo.

The canonical production codebase is now:
`JelfferyDuran/allaspectsbarn-site` → `main` → Vercel project `allaspectsbarn`.

This repository remains useful as a prototype/research/media source, including the
cinematic hero experiments. Port useful work into the canonical Next.js repo through
a reviewed change; do not switch production hosting back to this static codebase.

_Last updated: 2026-09-22. This repo carries the complete scraped + analyzed source for the All Aspects at the Barn rebuild._

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


## 2026-09-22 — Cinematic hero motion pass — LIVE
- The home hero is now **video-first with a static-photo fallback** and serves both modern WebM and universal MP4 sources.
- Live assets are committed at `media/aab-hero-parallax.webm` (~867 KB) and `media/aab-hero-parallax.mp4` (~1.2 MB). They are 960×540, 24 fps, 10-second seamless loops with a slow cinematic push/drift and no audio.
- `index.html` uses `autoplay muted loop playsinline`, `preload="metadata"`, and the existing barn photo as a poster/fallback.
- `styles.css` handles full-bleed cover cropping, a restrained legibility wash, mobile reframing, and reduced-motion fallback.
- `script.js` suppresses the legacy WebGL ember layer when video is active, keeps a subtle scroll-depth drift, falls back cleanly on video load failure, and pauses motion under `prefers-reduced-motion`.
- A reproducible renderer lives at `scripts/generate-hero-video.sh`; `.github/workflows/build-hero-video.yml` regenerates and publishes the web assets from `images/IMG_1415.jpg` when the source or renderer changes.
- GitHub Pages successfully deployed commit `fbf8fa53ba155a0f61d60369785e37cf5d467a24` to `https://jelfferyduran.github.io/aab-site-upgrade/`.
- ImageKit is now an optional future CDN optimization rather than a launch blocker. The current assets are small enough to ship directly with the static site.
- Current Vercel connector visibility shows no projects under the connected Kingdom Noel team, so **GitHub Pages is the verified public deployment path in this handoff**; do not claim the Vercel deployment is verified until the project becomes visible again.
