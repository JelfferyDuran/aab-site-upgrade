---
name: conversion-schema
description: Add conversion and discovery features to the AAB rebuild — JSON-LD LocalBusiness/Organization schema, newsletter capture, WhatsApp booking, OG/social tags, analytics hooks. Use during the conversion pass and when finalizing head/meta.
---

# Conversion Schema

The rebuild must out-convert the old Square Online site. These are the verified hooks from the audit (15 proofs, 9 conversion killers identified).

## 1. JSON-LD structured data (head of every page)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.allaspectsbarn.com/#business",
  "name": "All Aspects at the Barn",
  "alternateName": "All Aspects Restored & Recycled",
  "description": "<from AAB-SEO-MAP.json home description>",
  "url": "https://www.allaspectsbarn.com",
  "email": "allaspectsrecycled@gmail.com",
  "telephone": "<REAL PHONE IF RECOVERED, else omit — do not invent>",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Route 611, Village of Stone Church",
    "addressLocality": "Upper Mount Bethel",
    "addressRegion": "PA",
    "addressCountry": "US"
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Thursday","Friday","Saturday"], "opens": "10:00", "closes": "17:00" }
  ],
  "sameAs": [
    "https://www.facebook.com/allaspectsrepurposed",
    "https://www.instagram.com/allaspectsrestoredrecycled"
  ],
  "image": "<logo URL>"
}
```

Plus `Organization` on the home page, and `BreadcrumbList` on interior pages.

## 2. Newsletter capture

- Static form (no backend needed) posting to a placeholder: set `YOUR_FORM_ID` to a real service ID when available (ConvertKit placeholder). Mark clearly in code: `// TODO: real form endpoint — ID currently [REDACTED]/placeholder`.
- Never invent a working endpoint; a form that silently fails is a conversion killer.

## 3. WhatsApp booking

- Button "Book Your Event" → `https://wa.me/<REAL_NUMBER>?text=...` (prefill: "Hi All Aspects! I'd like to book the pavilion / ask about…"). Use the verified WhatsApp number when available; otherwise keep the `wa.me/` with the number placeholder `[REDACTED]` — do not ship a random number.

## 4. OG / social tags

```html
<meta property="og:title" content="<per-page title from AAB-SEO-MAP.json>">
<meta property="og:description" content="<per-page description>">
<meta property="og:type" content="website">
<meta property="og:image" content="<real og image URL — use AAB logo or hero>">
<meta property="og:url" content="https://www.allaspectsbarn.com/<slug>">
<meta name="twitter:card" content="summary_large_image">
```

## 5. Analytics hooks

- GA4: `G-XXXXXXX` placeholder (replace with real measurement ID when provided)
- Meta Pixel: `XXXXXXXXXXXXXX` placeholder
- Keep them inert until real IDs arrive; don't fabricate.

## 6. SEO fundamentals

- Use `AAB-SEO-MAP.json` titles/descriptions verbatim per page (they're Square's SEO truth — all 2,828 pages have them)
- One `<h1>` per page, semantic landmarks, alt text on all images
- `sitemap.xml` + `robots.txt` generated from `AAB-PAGES-META.json`
- Canonical URLs pointing at `https://www.allaspectsbarn.com/…`

## Pitfalls

- `allaspectsrecycled@gmail.com` is the verified live email (from bootstrap). Earlier builds used `info@allspectsbarn.com` (typo) — use the real one.
- Don't ship placeholder IDs as if real; mark every placeholder `[REDACTED]`/`TODO`.
- No credentials in any file — ever.
