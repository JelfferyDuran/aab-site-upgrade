# HANDOFF.md — State of the AAB Rebuild

_Last refreshed: 2026-09-17_

## Read this first

The **canonical active application is `allaspectsbarn/`** (Next.js). The root-level `index.html`, `styles.css`, `tokens.css`, `script.js`, and related static pages are an older prototype/reference layer. Do **not** continue normal product/design work in the root static prototype unless a task explicitly targets it.

For active development, start with:

1. `allaspectsbarn/README.md`
2. `allaspectsbarn/NEXT.md`
3. the relevant route/component under `allaspectsbarn/src/`

## Current active implementation

- Next.js App Router + React 19 + TypeScript + Tailwind CSS 4.
- Brand system is back on AAB indigo `#435298` with Cardo / Playfair Display / Dancing Script.
- Photo-forward home hero using the real barn imagery.
- Layered “What We Offer” photo cards.
- Contained gallery carousel.
- FAQ accordion.
- Contact/event inquiry path.
- Newsletter integration.
- Product catalog with thousands of static product routes and local product imagery.
- Sitemap, robots, LocalBusiness/EventVenue/Store JSON-LD, Open Graph/Twitter metadata, hard 404 handling, and legacy redirects.
- Reduced-motion handling is in place across motion-heavy areas.
- Vercel config includes baseline security headers.

Recent performance work removed Framer Motion from LCP-critical shared UI where CSS was enough, optimized the hero image, and lazy-gated below-fold motion. A recent verified production build generated roughly 2.7k static pages successfully.

## Current P0 work

See `allaspectsbarn/NEXT.md` for the live queue. Highest-value items:

1. **Catalog payload/search architecture.** `src/app/products/page.tsx` is currently a client component importing the full catalog. `src/data/products.json` is roughly 1 MB source JSON before bundling, while the UI shows only 30 cards at a time. Make the first render server/static-first and load only compact/on-demand search data in the browser.
2. **Conversion-path QA.** Verify home → gallery/contact, forms, phone/email links, product discovery, privacy/terms, and mobile states.
3. **Canonical/custom-domain cutover.** Metadata currently points to the Vercel deployment URL. When the replacement site moves to `allaspectsbarn.com`, update canonical, sitemap, robots, JSON-LD, and OG URLs together.
4. **Motion/carousel consolidation.** Preserve the best interactions while reducing overlapping abstractions and client cost.
5. **Mobile polish.** Test real narrow-phone widths, not only desktop responsive mode.

## Fast agent workflow

From `allaspectsbarn/`:

```bash
npm run dev
npm run check:quick   # typecheck + lint for normal iteration
npm run check         # formatting + typecheck + lint
npm run build         # full production/deploy gate; expensive because of static catalog generation
```

Do not run the full multi-thousand-page build after every tiny visual change.

## Source/content history that still matters

The repo contains the original Square Online scrape and clean extraction used to recover AAB content and product data:

- `site-scrape/` — full scraped source/archive.
- `site-scrape/content-clean/` — extracted AAB content.
- `site-scrape/content-clean/_site/` — recovered design/SEO/nav metadata.
- `template-ranch/` — analysis/blueprint of the visual inspiration only.

The original migration guardrails still apply:

- Use AAB’s real content/brand; do not fabricate business facts.
- Do not copy Paulina Pixi/Lone Mustang expressive copy/assets/code.
- Product imagery is retail evidence; do not generatively alter product appearance.
- Keep credentials out of the repo.
- Prefer local/verified media and source-backed claims.

## Deployment state

The active app is configured for Vercel. `src/app/layout.tsx` currently uses `https://allaspectsbarn.vercel.app` as the metadata base/canonical host. Treat that as staging/current-app configuration until the custom domain cutover is intentionally performed.

Do not remove or break the current public business site before the replacement passes smoke tests and canonical/redirect checks.

## Definition of “done” for the rebuild

- Active Next.js app is the only implementation being advanced.
- All critical customer paths work on mobile and desktop.
- Catalog discovery is fast without shipping unnecessary full-catalog data to the browser.
- Business facts and inventory representation are verified.
- Performance remains measurable and within an agreed budget.
- Custom domain, canonical URLs, sitemap, robots, schema, and redirects agree.
- Deployment is public and stable.
- Handoff + `NEXT.md` reflect reality for the next agent.
