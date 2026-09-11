---
name: non-plagiarism-boundary
description: Guardrails for recreating the Lone Mustang Ranch template without plagiarizing it. Load before ANY design/build work on the AAB rebuild. Defines what may be mirrored vs what must be replaced.
---

# Non-Plagiarism Boundary

The rebuild recreates the *look and feel* of the "Lone Mustang Ranch" Framer template (Paulina Pixi, $49) — **not the work itself**. This skill draws the line.

## The line

### ✅ May mirror (structure/idea — fair game)
- **Page anatomy / layout system:** header pattern, hero with photo + address + scroll cue, services ticker, offer cards, sticky scroll-through sections, FAQ accordion, rich footer
- **Visual rhythm:** generous whitespace, editorial hero scale, section pacing, card grids
- **Interaction patterns:** scroll-driven reveal, accordion, hover states (implemented in vanilla CSS/JS)
- **Section inventory** (what a ranch-style site shows) — built with AAB's own content

### ❌ Must NEVER copy (expression — infringement risk)
- **Copy/text:** "A Barn to Call Home", "Saddle up with us", any template prose, taglines, descriptions
- **Imagery:** Paulina's photos, the template's media files (66 files, 18.2 MB — scraped only for reference)
- **Code:** Framer's generated HTML structure, minified class names (`framer-*`), Framer Motion/React runtime, inline styles, scripts
- **CSS:** the template's stylesheets/classes; `--framer-*` tokens must be re-expressed semantically, never copied wholesale
- **Font files:** don't vendor the template's font assets; load Google Fonts normally (Alfa Slab One, Archivo, Rye are fine as licensed web fonts — but AAB's own brand uses Dancing Script + Cardo, prefer those)
- **Brand identity:** don't paint AAB in the template's rust/cream palette as if it were the brand — AAB is `#435298` indigo with Dancing Script/Cardo

## Practical rules

1. **Reference = yes, paste = no.** You may open `template-ranch/html/*.html` to study layout ratios, spacing, section order. Write your own markup from scratch.
2. **Content always from `content-clean/`** (AAB's real copy) — see `aab-content-migration`.
3. **Tokens re-expressed:** read `--framer-*` scale values, then write your own `tokens.css` with AAB's colors/fonts under semantic names — see `framer-token-recreation`.
4. **Hero copy swap is mandatory:** any template-derived headline must become AAB's own (e.g., their real pitch from About: "family-owned, unique shop on Route 611…").
5. **Attribution:** in `HANDOFF.md`/README, note: *"Layout concept inspired by the Lone Mustang Ranch Framer template by Paulina Pixi ($49, framer.com marketplace). All content and brand assets © All Aspects at the Barn. Built from scratch."*
6. When in doubt: **paraphrase the layout, quote only AAB.**

## Why this matters

Jayto's directive, verbatim: *"Use exactly every coding language and structure and backend and strengthen if possible, make sure to recreate but not plagiarize."* A clean-room rebuild protects AAB from takedowns and keeps the site original. A static hand-built site is also *faster and more ownable* than the Framer original — that's the "strengthen" part.

## QA checklist (run before calling anything done)

- [ ] No template sentences survive anywhere in the build
- [ ] No `framer-*` class names, no framer-motion, no React runtime in output
- [ ] No template media files used as content (only reference/mockup)
- [ ] AAB brand tokens (indigo, Dancing Script/Cardo) are the identity
- [ ] Every page's copy traces to `content-clean/`
- [ ] Attribution note present in HANDOFF.md
