# GOAL.md — All Aspects at the Barn Site Rebuild

## Mission (one sentence)
Recreate the visual system of the **Lone Mustang Ranch Framer template** (Paulina Pixi, $49) as a clean, hand-built static website for **All Aspects at the Barn**, filled with All Aspects' **own real content and brand identity**, strengthened where possible, **recreated — never plagiarized** — and ship it live so it stops 404ing.

## Why
- Jayto bought the *concept* of the Ranch template's layout and wants that level of polish for All Aspects at the Barn without paying for/copying the template.
- The live site (allaspectsbarn.com) is an aging **Square Online** store (Vue SPA) — 2,830 pages (79 main + 2,751 products). It's slow, non-customizable, and holds conversion killers.
- All content, brand tokens, SEO, and media have been fully extracted into this repo (see CLAUDE.md).

## Acceptance criteria (done = all true)
1. **Static site builds from this repo** with clean HTML/CSS/JS (no Framer runtime, no React dependency).
2. **AAB's real brand** is used: indigo `#435298`, Dancing Script + Cardo type, real logo, real social links, real hours/location.
3. **Ranch template's layout rhythm** is visibly present: navi-style header, hero with photo + address + scroll cue, services ticker, offer cards, sticky scroll sections, FAQ accordion, rich footer.
4. **Content comes from `content-clean/`** — All Aspects' own copy, not the template's.
5. **No plagiarism:** no Paulina's copy, no Framer minified class names, no framer-motion code, no copied assets.
6. **Conversion features in place:** JSON-LD LocalBusiness/Organization, newsletter capture, WhatsApp booking (`wa.me`), OG tags, analytics hooks (IDs marked `[REDACTED]`/placeholder).
7. **Per-page SEO** matches `AAB-SEO-MAP.json` titles/descriptions.
8. **Live and public:** deploys to GitHub Pages and/or Vercel, returns real content (NOT "Login – Vercel", NOT_FOUND, or SSO wall) — verified by reading the deployed HTML.
9. **Product/shop story:** at least a product listing generated from extracted product data; 2,751 products mapped (can be paginated/static-generated).
10. **Media handled sanely:** referenced by path; the 561 MB media dir is gitignored or LFS — never committed raw to GitHub.

## Phases
1. **Foundation:** `tokens.css` (AAB design tokens), base layout, nav, footer → verify locally.
2. **Home page** (hero + ticker + cards + scroll sections + FAQ) → strongest page, sets the pattern.
3. **Main pages** (About, Barn Brew, Gallery, Pavilion/Rental, Petting Farm, Contact) from `content-clean`.
4. **Product pages** — static generation from product extractions.
5. **Conversion pass** (schema, newsletter, WhatsApp, OG, analytics).
6. **Deploy + verify live** (gh-pages + Vercel), kill the 404.

## Skills to load first
- `.claude/skills/framer-token-recreation/SKILL.md` — before any CSS
- `.claude/skills/aab-content-migration/SKILL.md` — before any page copy
- `.claude/skills/non-plagiarism-boundary/SKILL.md` — before any design work
- `.claude/skills/conversion-schema/SKILL.md` — before the conversion pass

## Boundaries
- English only. No credentials in any file (`[REDACTED]` for anything sensitive).
- Don't fabricate content that isn't in `content-clean/`. If a page has no extracted copy, say so and use the SEO map title + a clear stub rather than inventing prose.
- Ask before spending money (fonts/plugins/assets). Free/self-hosted preferred.
