# All Aspects at the Barn — Active Website

This directory is the **canonical production application** for the All Aspects at the Barn rebuild.

> Do not treat the old root-level static HTML/CSS prototype as the active site. New product, design, SEO, accessibility, conversion, and performance work belongs here unless a task explicitly says otherwise.

## Stack

- Next.js App Router
- React 19 + TypeScript
- Tailwind CSS 4
- `next/image` + `next/font`
- Framer Motion / GSAP only where the interaction justifies the client cost
- Static generation for the large imported catalog
- Vercel deployment

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification workflow

Use the lightest check that matches the change:

```bash
# Fast feedback for most code edits
npm run check:quick

# Formatting + typecheck + lint
npm run check

# Full production verification before deploy / merge of routing or data changes
npm run build
```

The production build generates thousands of static pages, so **do not run `npm run build` after every small visual edit**. This is intentional: quick checks keep agent iteration fast, while the full build remains the deploy gate.

## Source of truth

- `src/app/` — routes, metadata, global styling
- `src/components/` — shared UI and interaction systems
- `src/data/products.json` — imported catalog data (~1 MB source JSON)
- `src/data/pages.json` — imported page/content data
- `src/data/gallery.json` / `finds.json` — curated site imagery
- `src/lib/data.ts` — typed data access helpers
- `public/images/` — local site/product media used by the app
- `.metrics/` — Lighthouse/performance diagnostics and analysis scripts
- `next.config.ts` — redirects and image host policy
- `vercel.json` — deployment/security headers

## Brand / content guardrails

- Primary brand color: `#435298` indigo.
- Keep the site photo-forward; the barn and real inventory should carry the visual story.
- Do not fabricate business facts, event claims, hours, inventory, reviews, awards, or services.
- Prefer extracted/verified AAB content and real AAB imagery.
- Do not copy expressive assets, copy, or implementation from the Lone Mustang inspiration template.
- Product imagery is retail evidence: do not generatively alter product appearance.
- Honor `prefers-reduced-motion` for non-essential motion.

## Performance rules

1. Keep above-the-fold shared components light.
2. Avoid adding Framer Motion or GSAP to root/shared UI when CSS can do the job.
3. Use `next/image` with correct `sizes`; reserve `priority` for true LCP/critical images.
4. Lazy-load below-fold interaction and imagery.
5. Do not ship the full product dataset to the browser unless the feature truly requires it.
6. Measure before/after meaningful performance changes using `.metrics/`.

### Current highest-value performance target

`src/app/products/page.tsx` is a client component that imports the complete product dataset and filters/paginates it in the browser. The source catalog JSON is roughly 1 MB before bundling. The next catalog performance pass should keep initial rendering server/static-first and load only a compact search index (or search data on demand) for client search.

## Current product priorities

See [`NEXT.md`](./NEXT.md) for the execution queue. In general, prioritize:

1. Catalog payload/search architecture.
2. Conversion-path QA (contact, event inquiry, newsletter, product discovery).
3. Mobile polish and real-device testing.
4. Custom-domain cutover/canonical metadata when the new site replaces the existing live site.
5. Consolidation of overlapping motion/carousel implementations.

## Deployment note

The app metadata currently uses the Vercel deployment URL as its canonical base. When `allaspectsbarn.com` is cut over to this application, update the canonical/site URL configuration in the same release so sitemap, Open Graph, JSON-LD, and canonical links all agree.

## Agent handoff rule

Before changing implementation, read this README, `../HANDOFF.md`, and the nearest code involved. After a meaningful architecture, deployment, content-source, or performance change, update the handoff/queue so the next agent does not have to rediscover the decision.
