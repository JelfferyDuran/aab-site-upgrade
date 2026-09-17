# HANDOFF.md — State of the AAB Rebuild

_Last refreshed: 2026-09-17_

## Read this first

The **canonical active application is `allaspectsbarn/`** (Next.js). Root-level `index.html`, `styles.css`, `tokens.css`, `script.js`, and related static pages are legacy prototype/reference material. Do **not** continue normal product/design work there unless a task explicitly targets it.

For active development, start with:

1. `allaspectsbarn/AGENTS.md`
2. `allaspectsbarn/README.md`
3. `allaspectsbarn/NEXT.md`
4. the relevant route/component under `allaspectsbarn/src/`

## Current production foundation

- Next.js 15.5 App Router + React 19 + strict TypeScript + Tailwind CSS 4.
- Turbopack is the local development bundler; stable `next build` remains the production gate.
- Brand system uses AAB indigo `#435298` with Cardo / Playfair Display / Dancing Script.
- Photo-forward real AAB imagery remains the design direction.
- Thousands of product detail routes are statically generated.
- Sitemap, robots, LocalBusiness/EventVenue/Store JSON-LD, Open Graph/Twitter metadata, hard 404 handling, and legacy redirects are present.
- Baseline deployment security headers are configured; the framework signature header is disabled.
- Global application error recovery exists.
- Reduced-motion behavior remains a requirement across non-essential animation.

## Architecture decisions now locked in

### Server/client boundary

Server Components are the default. Client Components should be the smallest interactive island that needs state, events, or browser APIs.

The product catalog landing page no longer imports the full ~1 MB source catalog into a Client Component. It now renders the first compact page server-side and hands only that page to `ProductExplorer`; search/pagination requests compact pages through `/api/products`.

### Data boundaries

Stable interfaces now sit between routes/UI and imported source JSON:

- `src/lib/catalog.ts` — product data, static slugs, bounded search/pagination.
- `src/lib/content.ts` — editorial/content-page data and normalized routes.
- `src/lib/site.ts` — stable business facts + canonical public origin.
- `src/lib/forms.ts` — public form endpoint configuration.
- `src/lib/data.ts` — compatibility adapter only; new code should use the explicit modules above.

Product detail pages and sitemap generation consume the same catalog service. Duplicate/invalid imported slugs are filtered from generated static params.

This boundary is intentional: a future CMS/database/search-service migration should replace internals behind these modules rather than force route/component rewrites.

### Configuration

Public environment configuration is documented in `allaspectsbarn/.env.example`:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_FORMSPREE_ENDPOINT`

Do not commit secret credentials.

### Verification

`allaspectsbarn/scripts/validate-content.mjs` checks imported-data structure and reports legacy catalog irregularities. GitHub Actions runs the quick verification suite plus the stable production build and caches `.next/cache`.

From `allaspectsbarn/`:

```bash
npm run dev
npm run check:quick   # content validation + typecheck + lint
npm run check         # format check + quick checks
npm run build         # stable production/static-route gate
npm run build:turbo   # benchmark/experiment only; not current deploy gate
```

## Current verification state for foundation PR #1

- PR branch: `chatgpt/project-acceleration-2026-09-17`.
- GitHub reports the PR as mergeable.
- GitHub Actions `AAB CI` is configured on the PR and should be treated as the code/build authority for this branch.
- Current Vercel preview failures point to the account `build-rate-limit` rather than an application build result; do not treat that account quota response as a code regression.
- A local production build could not be run from the assistant container because that runtime could not resolve GitHub for dependency/repository access. Do not claim local verification that did not occur.

## Current active implementation

- Photo-forward home hero using real barn imagery.
- Layered “What We Offer” photo cards.
- Contained gallery carousel.
- FAQ accordion.
- Contact/event inquiry path.
- Newsletter integration.
- Product catalog + product detail pages.
- Local/curated gallery and shop-floor imagery.
- Performance diagnostics retained in `.metrics/`.

## What is next

See `allaspectsbarn/NEXT.md`. Highest value after the current foundation PR is green:

1. Conversion-path QA across home/contact/forms/products.
2. Small Playwright browser smoke/E2E suite as a separate dependency/lockfile change.
3. Real-device mobile polish.
4. Motion/carousel consolidation.
5. Image-budget cleanup.
6. Custom-domain/canonical cutover readiness.
7. Only after tests/build are stable: evaluate a separate Next.js major upgrade and typed routes.

## Source/content history that still matters

- `site-scrape/` — full Square Online source/archive.
- `site-scrape/content-clean/` — extracted AAB content.
- `site-scrape/content-clean/_site/` — recovered design/SEO/nav metadata.
- `template-ranch/` — analysis/blueprint of visual inspiration only.

Migration guardrails still apply:

- Use AAB’s real content/brand; do not fabricate business facts.
- Do not copy Paulina Pixi/Lone Mustang expressive copy/assets/code.
- Product imagery is retail evidence; do not generatively alter product appearance.
- Keep credentials out of the repo.
- Prefer local/verified media and source-backed claims.

## Deployment / custom domain

`SITE_URL` currently has a deterministic Vercel fallback and can be overridden with `NEXT_PUBLIC_SITE_URL`. When the replacement is intentionally moved to `allaspectsbarn.com`, set that variable and verify canonical metadata, sitemap, robots, schema, OG URLs, redirects, and public accessibility in the same release.

Do not remove the existing live business site before replacement smoke tests pass.

## Definition of done

- The Next.js app is the only implementation being advanced.
- Critical customer paths work on mobile and desktop.
- Catalog discovery remains fast without shipping the full source catalog into the browser.
- Business facts/inventory representation are verified.
- Performance is measured, not guessed.
- Custom domain, canonical URLs, sitemap, robots, schema, and redirects agree.
- Deployment is public and stable.
- README/HANDOFF/NEXT stay synchronized for future agents.
