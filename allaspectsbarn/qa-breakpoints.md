# 8-4 Mobile breakpoints + cross-browser — QA report

Date: 2026-09-16
Runner: aab-qa (Lens)
Site: https://allaspectsbarn.vercel.app
Scope: static review of all routes at 360/768/1024/1440; cross-browser pass; screenshot evidence.

## Pages inspected
- / (home) — src/app/page.tsx
- /contact — src/app/contact/page.tsx
- /products — src/app/products/page.tsx
- /products/[slug] — src/app/[...route]/page.tsx
- /not-found — src/app/not-found.tsx
- shared: SiteLayout, Nav, Footer, WhatsAppFAB, ImageCarousel, DragCarousel, SwivelItem

## Breakpoint audit (360 / 768 / 1024 / 1440)

### Horizontal overflow
PASS — no overflow risk found in static analysis.

- Every page container uses `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — responsive padding, centered, no escape.
- `SiteLayout` body is `min-h-full flex flex-col` with `main flex-1` — no flex collapse.
- Long text contained via `line-clamp-2` on product titles/body, `max-w-3xl` / `max-w-4xl` on prose blocks.
- Image-heavy sections use `aspect-[4/3]` / `aspect-square` with `object-cover` — no intrinsic sizing blowout.
- Hero heading: `text-5xl sm:text-6xl lg:text-8xl` — at 360px the base `text-5xl` (3rem) Playfair heading "All Aspects at the Barn" with `<br>` should fit inside `max-w-7xl` + padding. Visual confirmation recommended but no overflow pattern present.

### Sticky header
PASS

- Nav: `fixed top-0 left-0 right-0 z-300`, transitions from `bg-transparent` to `bg-white/95 backdrop-blur-md shadow-md` on scroll (threshold 20px).
- Page offsets: `pt-16 lg:pt-20` on every page's root `<div>` — matches header height `h-16 lg:h-20`. No content hidden behind sticky on load.
- Mobile menu: `AnimatePresence` with `height: auto`, `overflow-hidden` on container — no stray overflow. Toggle button: `p-2` wrapping 24px SVG = ~44px tap target. Menu links: `px-3 py-2` = 44px+ targets.

### Tap targets
PASS with one minor note

- CTA buttons: `px-8 py-4` → min 56px height. Pass.
- Contact cards, gallery frame cards: well above 44px.
- `/products` category filter pills: `px-4 py-2` with `text-sm` → ~40px height, borderline at 360px. Acceptable but recommend visual check.
- Pagination buttons: `px-4 py-2` similar.

### WhatsApp FAB
MINOR NOTE

- `fixed bottom-6 right-6`, 56px circle, shows after scrollY > 300.
- On 360px viewport with short pages, FAB may overlap content near bottom-right only after scrolling. Acceptable; not a defect.

### Cross-browser (Chrome / Edge / Firefox / Safari)
PASS (static)

- Tailwind CSS v4 with `@import "tailwindcss"` — CSS-first config, supported in all four browsers' current versions. No `-webkit-` gaps identified.
- `framer-motion` — widely supported. `scrollbar-hide` implementation in `DragCarousel` uses both `scrollbarWidth: "none"` (Firefox) and `msOverflowStyle: "none"` (legacy Edge) — covered.
- `next/font/google` self-hosted (Cardo, Playfair_Display, Dancing_Script) — consistent rendering across browsers; no FOIT risk.
- `Image` `fill` with `sizes` attribute present on all responsive images — correct lazy-loading and srcset behavior across browsers.

## Screenshot evidence
NOT CAPTURED in this run.

The task requires screenshots at 3 widths as evidence. Capturing them requires desktop browser automation (`computer_use` capture). The site is live and accessible — screenshots can be taken either:
(a) by a human with the browser open at the live URL, or
(b) by me via `computer_use` if `approvals.single_query_mode` is set to allow desktop drive.

Recommended capture set (3 widths = mobile / tablet / desktop per task):
- 360px: Home /products /contact
- 768px: Home /products
- 1024px (or 1440px): Home /products

## Findings summary
- Horizontal overflow: none detected
- Sticky header: correct offset + behavior
- Tap targets: pass (one borderline pill at 360px, not a defect)
- Cross-browser: pass
- Evidence: pending screenshot capture

## Verdict
**Static pass.** No blocking defects. Awaiting screenshot evidence to close.

## Blocker
Screenshot evidence cannot be produced in this headless session without desktop-automation approval (`computer_use` needs approval for focus/click drives, and the capture I ran landed on the Dropbox welcome window, not the site). 

To close this task: either (1) approve `computer_use` desktop drive so I can open the site and capture at 3 widths, or (2) capture the recommended screenshot set manually and this report serves as the accompanying QA record.
