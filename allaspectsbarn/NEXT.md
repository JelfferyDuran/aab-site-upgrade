# NEXT — All Aspects at the Barn

_Last refreshed: 2026-09-17_

This is the short execution queue for the active Next.js application. Keep it prioritized. Move finished items into the handoff rather than letting this become a giant backlog.

## P0 — Ship confidence

### 1. Catalog payload / search architecture

**Problem:** `/products` is a client component importing the complete catalog (`src/data/products.json`, ~1 MB source JSON) plus Framer Motion. Only 30 product cards are rendered per page, but the browser receives far more data than the first view requires.

**Target:**
- Keep the first catalog render server/static-first.
- Do not include full product bodies/images for all products in the initial browser bundle.
- Use a compact search document (`id`, `slug`, `title`, minimal searchable text) loaded on demand, or a server/search endpoint if deployment architecture allows it.
- Preserve current product URLs and SEO.
- Preserve fast client search UX.
- Measure catalog JS/payload before and after.

### 2. Conversion-path QA

Verify on mobile and desktop:
- Home hero → Gallery.
- Home hero → Contact/event inquiry.
- Contact form success/error states.
- Newsletter success/error states.
- Phone/email links.
- Product search → product detail → contact/visit path.
- Footer privacy/terms links.

No dead buttons, placeholder URLs, or silent fake-success states.

### 3. Deployment/canonical readiness

Before custom-domain cutover:
- Decide final production host (`allaspectsbarn.com`).
- Change metadata base/canonical, JSON-LD URL, sitemap host, OG host, and robots sitemap in the same release.
- Verify redirects from the old site.
- Verify public access without Vercel protection/SSO.
- Confirm the current Square site is not removed until the replacement passes smoke tests.

## P1 — Quality / performance

### 4. Consolidate motion systems

Current code has several motion abstractions plus Framer Motion and GSAP. Keep effects that materially improve the experience, but reduce overlapping primitives.

Goal:
- One preferred reveal/entrance system.
- One preferred carousel implementation per use case.
- No shared/root animation dependency where CSS is sufficient.
- Maintain reduced-motion behavior.

### 5. Mobile polish pass

Test at least:
- 360×800
- 375×812
- 390×844
- 430×932
- tablet portrait

Focus on:
- nav/dropdown fit and tap targets
- hero information density
- gallery controls
- FAQ spacing
- product search/filter/pagination
- footer/newsletter layout
- long product titles

### 6. Image budget

- Keep hero/LCP images aggressively optimized.
- Audit oversized originals in `public/`.
- Avoid `priority` below the fold.
- Confirm `sizes` matches actual layout widths.
- Prefer WebP/AVIF derivatives for site imagery while preserving retail-accurate product imagery.

## P2 — Experience upgrades

### 7. Product discovery that feels intentional

The current quick filters derive a “category” from the first word of the product title. Replace this with real facets only if the underlying source supports them; otherwise use curated discovery groups instead of pretending first words are categories.

Possible safe improvements:
- Recently added / featured finds
- furniture / decor / gifts / paint only when source classification is verified
- “Visit the barn to see current inventory” messaging for fast-changing stock

### 8. Social proof / local trust

Only add claims that can be verified. Prefer:
- real press mentions
- real customer reviews from an approved source
- real event photos
- real years in business / location details

Do not invent star ratings, awards, attendance counts, or testimonials.

### 9. Analytics + conversion measurement

Once the owner chooses analytics tooling, track only useful events:
- event inquiry started/submitted
- newsletter submitted
- product search used
- product detail viewed
- phone/email CTA
- gallery engagement

Keep the implementation lightweight and privacy-conscious.

## Working rules

- Canonical app: `allaspectsbarn/`.
- Use `npm run check:quick` during iteration.
- Use `npm run build` as a pre-deploy/full routing-data gate, not after every visual edit.
- Update this file when priorities change.
