# All Aspects at the Barn — Production App

This directory is the **canonical production application** for the All Aspects at the Barn rebuild.

> Root-level static HTML/CSS files are legacy reference only. New product, design, SEO, accessibility, conversion, and performance work belongs here unless a task explicitly says otherwise.

## Foundation stack

- Next.js 15.5 App Router
- React 19 + strict TypeScript
- Tailwind CSS 4
- `next/image` + `next/font`
- Server Components by default; small Client Components for real interaction
- Framer Motion / GSAP only where the interaction justifies the client cost
- Turbopack for local development; stable `next build` for production verification
- Static generation for product detail routes
- Vercel deployment + GitHub Actions verification

## Architecture boundaries

The app is deliberately split so future data-source or design changes stay localized:

- `src/lib/site.ts` — stable business identity + canonical public origin
- `src/lib/forms.ts` — public form endpoint configuration
- `src/lib/catalog.ts` — product/catalog data access, pagination, search, static slugs
- `src/lib/content.ts` — imported content-page access + route normalization
- `src/lib/data.ts` — compatibility adapter for older imports; new code should not depend on it
- `src/app/api/products/route.ts` — narrow catalog-query boundary for browser search/pagination
- `src/components/ProductExplorer.tsx` — catalog interactive island; receives only one page initially

`src/data/products.json` remains the imported source today, but route/components should depend on `catalog.ts`, not on that JSON file directly. This makes a later move to a CMS, database, search service, or API much less invasive.

## Run locally

```bash
npm install
npm run dev
```

`npm run dev` uses Turbopack. Open `http://localhost:3000`.

## Verification workflow

Use the lightest check that matches the change:

```bash
# Imported-data integrity + TypeScript + ESLint
npm run check:quick

# Formatting + all quick checks
npm run check

# Full production verification / static-route generation
npm run build

# Optional benchmark only; Turbopack production build is not the deploy gate yet
npm run build:turbo
```

A pull request touching `allaspectsbarn/` also runs `.github/workflows/aab-ci.yml`, which caches `.next/cache`, performs the quick verification suite, and runs the stable production build.

The production build generates thousands of routes, so **do not run it after every small visual edit**. Quick checks are the normal inner loop; the full build is the routing/data/deploy gate.

## Configuration

Copy `.env.example` when environment-specific public configuration is needed.

- `NEXT_PUBLIC_SITE_URL` — canonical public origin used by metadata/schema/sitemap/robots
- `NEXT_PUBLIC_FORMSPREE_ENDPOINT` — browser-visible Formspree endpoint shared by contact/newsletter forms

These are public browser configuration values, not secret credentials.

## Source of truth

- `src/app/` — routes, metadata, global styling, route handlers
- `src/components/` — reusable UI and deliberately scoped interaction islands
- `src/data/` — imported/curated source data; access through `src/lib/` boundaries
- `public/` — local site/product media
- `scripts/validate-content.mjs` — fast data-integrity guard
- `.metrics/` — Lighthouse/performance diagnostics
- `next.config.ts` — redirects, image-host policy, framework configuration
- `vercel.json` — deployment/security headers
- `.github/workflows/aab-ci.yml` — pull-request/build gate

## Brand / content guardrails

- Primary brand color: `#435298` indigo.
- Keep the site photo-forward; real barn, event, animal, and inventory photography should carry the visual story.
- Do not fabricate business facts, event claims, hours, inventory, reviews, awards, or services.
- Prefer extracted/verified AAB content and real AAB imagery.
- Do not copy expressive assets, copy, or implementation from the Lone Mustang inspiration template.
- Product imagery is retail evidence: do not generatively alter product appearance.
- Honor `prefers-reduced-motion` for non-essential motion.

## Performance rules

1. Server Components are the default. Add `"use client"` at the smallest interactive boundary.
2. Never import the full product catalog into a Client Component.
3. Keep above-the-fold shared components light.
4. Avoid adding motion/runtime dependencies when CSS or an existing primitive is sufficient.
5. Use `next/image` with accurate `sizes`; reserve `priority` for true LCP images.
6. Lazy-load below-fold interaction and media.
7. Measure meaningful performance changes using `.metrics/` rather than optimizing by intuition.
8. Preserve stable product URLs and route generation when changing catalog infrastructure.

## Catalog architecture

The catalog landing page is server-first. The server sends the first 30 compact product cards; browser search/pagination asks `/api/products` for only the requested page. Full product data remains on the server side of that Client Component boundary.

Product detail pages and sitemap generation consume the same `catalog.ts` service, with duplicate/invalid imported slugs defensively excluded from generated route parameters.

## Error resilience

`src/app/global-error.tsx` provides an application-level recovery UI. Feature-level forms and catalog search also expose explicit error states rather than silent success.

## Upgrade strategy

Do not combine framework upgrades with visual/product changes. The current Next 15.5 stack is stabilized first; a Next 16 migration, typed routes, browser E2E tests, or new infrastructure should each be separate measured changes after the production build is green.

## Current priorities

See [`NEXT.md`](./NEXT.md). With the catalog foundation now separated, the next useful work is conversion-path QA, real-device mobile polish, motion consolidation, and custom-domain launch readiness.

## Agent handoff rule

Before substantial work, read `AGENTS.md`, this README, `NEXT.md`, and the repository-root `HANDOFF.md`. After a meaningful architecture/deployment/content-source decision, update the relevant handoff in the same change so another agent does not have to rediscover it.
