# NEXT — All Aspects at the Barn

_Last refreshed: 2026-09-17_

This is the short execution queue for the canonical `allaspectsbarn/` application. Keep it prioritized; finished architecture work belongs in the handoff/README, not in an endless backlog.

## Foundation completed in current PR

- Canonical Next.js app documented; stale root prototype demoted to legacy reference.
- Stable site/business configuration centralized.
- Contact/newsletter endpoint configuration centralized.
- Product catalog split behind `src/lib/catalog.ts`.
- Page content split behind `src/lib/content.ts`.
- `/products` changed from full-catalog Client Component to server-first render + compact interactive island.
- Product search/pagination moved behind `/api/products` with bounded paging/query inputs.
- Product detail routes + sitemap use the same catalog service.
- Invalid/duplicate imported product slugs are excluded from generated route params.
- Fast imported-data validation added.
- GitHub Actions verification/build gate added with Next build cache.
- Turbopack made the default local dev bundler; stable production build remains the deploy gate.
- Global application error recovery added.
- Architecture rules documented for future coding agents.

## P0 — Verification + conversion confidence

### 1. Get the foundation PR fully green

- GitHub Actions: content validation → TypeScript → ESLint → stable production build.
- Vercel preview should be treated separately from code verification when account build-rate limits block deployment.
- Do not merge around a real type/build failure; fix it.

### 2. Conversion-path QA

Verify on mobile and desktop:
- Home hero → Gallery.
- Home hero → Contact/event inquiry.
- Contact form success/error states.
- Newsletter success/error states.
- Phone/email links.
- Product search → pagination → product detail → inquiry/visit path.
- Footer privacy/terms links.

No dead buttons, placeholder URLs, or silent fake-success states.

### 3. Deployment/canonical readiness

Before custom-domain cutover:
- Set `NEXT_PUBLIC_SITE_URL=https://allaspectsbarn.com` in production.
- Verify canonical metadata, JSON-LD, sitemap, robots and OG URLs on the deployed site.
- Verify old-site redirects and important historical URLs.
- Verify public access without Vercel protection/SSO.
- Keep the existing live site available until replacement smoke tests pass.

## P1 — Quality / performance

### 4. Add browser E2E tests

Once the current production build is green, add a small Playwright suite for the routes that matter most:
- `/`
- `/products`
- one representative product detail
- `/contact`
- `/gallery`

Cover navigation, product search/pagination, contact form validation, and critical mobile behavior. Keep this a separate dependency/lockfile change.

### 5. Consolidate motion systems

Current code still has multiple motion abstractions plus Framer Motion and GSAP.

Goal:
- one preferred entrance/reveal system
- one preferred carousel implementation per use case
- no root/shared animation runtime where CSS is sufficient
- reduced-motion parity
- preserve effects that genuinely improve the barn experience

### 6. Mobile polish pass

Test at least:
- 360×800
- 375×812
- 390×844
- 430×932
- tablet portrait

Focus on nav/dropdowns, hero density, gallery controls, FAQ spacing, product search/pagination, footer/newsletter, forms, and long product titles.

### 7. Image budget

- Keep hero/LCP media aggressively optimized.
- Audit oversized originals in `public/`.
- Avoid `priority` below the fold.
- Confirm `sizes` against real rendered widths.
- Prefer WebP/AVIF derivatives for site imagery while preserving retail-accurate product imagery.

## P2 — Future-proof upgrades

### 8. Product discovery that reflects real inventory

Do not derive categories from the first word of a title. Only add facets backed by real source data; otherwise use curated groups such as featured finds/recent finds.

### 9. Next.js major upgrade — separate change

Evaluate Next 16 only after the current stack has a green production build and browser smoke tests. Do not combine a major framework upgrade with a redesign or data migration.

After upgrade, evaluate:
- framework migration requirements/deprecations
- typed routes
- updated Turbopack production behavior
- Next.js agent/MCP tooling
- bundle/build differences

### 10. Replace JSON source without replacing the app

If inventory eventually moves to a CMS/database/search service, preserve the existing `catalog.ts` contract where practical. UI routes should not need to know which backend supplies products.

The same rule applies to `content.ts` for editorial pages.

### 11. Analytics + useful measurement

Once tooling is chosen, track only meaningful events:
- event inquiry started/submitted
- newsletter submitted
- product search used
- product detail viewed
- phone/email CTA
- gallery engagement

Keep it lightweight and privacy-conscious.

## Working rules

- Canonical app: `allaspectsbarn/`.
- Server Components by default; smallest possible client boundary.
- Use `npm run check:quick` during iteration.
- Use `npm run build` for routing/data/deploy confidence.
- Keep framework upgrades separate from product/design changes.
- Update this file when the execution order materially changes.
