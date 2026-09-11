---
name: framer-token-recreation
description: Recreate the Lone Mustang Ranch Framer template's visual system as clean CSS custom properties (tokens), without copying Framer runtime code. Use when building tokens.css, typography scale, or palette for the AAB rebuild.
---

# Framer Token Recreation

Goal: translate the **visual language** of the "Lone Mustang Ranch" Framer template (by Paulina Pixi) into a hand-written design-token layer for All Aspects at the Barn — the look, re-expressed in clean CSS. Never ship Framer's generated CSS/class names/JS.

## Where the source tokens live

- Scraped template: `template-ranch/html/*.html` (12 pages) + `template-ranch/RANCH-TEMPLATE-BLUEPRINT.md`
- `template-ranch/manifest.json` — media manifest
- Template preview: `https://drab-humor-103231.framer.app/` ; marketplace: `https://www.framer.com/marketplace/templates/lone-mustang-ranch/` ($49)

## What the template's stack actually is (verified)

Framer export = **static HTML + React/Framer Motion runtime**. It is a JS app shell + inline CSS. You are extracting *design language*, not reproducing the stack.

- **152 CSS custom-property tokens** across the template
- **40 `--framer-*` type tokens** in the homepage alone (sizes, line-heights, letter-spacing)
- **29 distinct hex colors**

## Typography (from tokens)

- **Alfa Slab One** — display headlines (western slab)
- **Archivo** — body (with Archivo Placeholder fallback)
- **Rye** — western accent
- Inter + Karla also present (utility)

## Palette (verified hexes)

| Family | Hexes |
|---|---|
| Creams | `#ddd1c5 #efe5d2 #e5dfdd #eee8e2` |
| Earth browns | `#332622 #4c3833 #664b44 #997e77` |
| Rust | `#b1502a` |
| Deep reds | `#b41d1a #b51d1a` |
| Near-black | `#0b0b0c` |
| Gold | `#d99a23 #fec202` |
| Lime pop | `#eefe45` |

## Re-express, don't copy

1. Read `--framer-*` tokens from `template-ranch/html/home.html` (grep `--framer-`) to learn the **scale** (e.g., hero ~72px, section headings ~34px, body ~16–17px, letter-spacing on display faces).
2. Write **your own** `tokens.css` using **AAB's brand values**:
   - Primary `#435298` (indigo) — NOT the template's rust/cream as the identity
   - Display font: **Dancing Script** (400) ; UI/body: **Cardo** (500/200) — AAB's real fontset from its own snapshot
   - Base 20px, scale 1.25 (AAB's real type config)
   - The ranch template's *layout rhythm* (generous whitespace, editorial hero, sticky scroll sections, ticker) informs spacing/section anatomy
3. Borrow the template's *rhythm*, not its hexes. Optional: use cream/earth backgrounds as neutral surfaces; tint gold/lime pops toward AAB indigo if used.
4. Name your tokens semantically (`--color-primary`, `--font-display`, `--space-section`, `--radius-card`), not `--framer-*`.

## Deliverable shape

```
tokens.css
  --color-primary: #435298;            /* AAB brand */
  --color-ink: #141414;                /* from AAB page values */
  --color-surface: #efefef;
  --font-display: 'Dancing Script', cursive;
  --font-body: 'Cardo', serif;
  --font-size-base: 20px;
  --type-scale: 1.25;
  --space-section: clamp(4rem, 8vw, 7rem);
  ...
```

## Pitfalls

- Don't copy Framer's minified class names (`framer-xyz`) into your HTML.
- Don't vendor Framer Motion/React just to animate; CSS transitions + tiny vanilla JS suffice.
- Don't copy the template's hero copy ("A Barn to Call Home", "Saddle up with us") — swap for AAB's voice (see `aab-content-migration`).
- Verify fonts load (Google Fonts) or fall back gracefully; no font files from the template.
