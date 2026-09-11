---
name: aab-content-migration
description: Migrate All Aspects at the Barn's real content (79 main pages + 2,751 products) from the extracted content-clean layer into the rebuilt static site. Use whenever writing any page copy, SEO metadata, or product listing.
---

# AAB Content Migration

All copy on the rebuild MUST come from All Aspects' own site. This skill tells you where it lives and how to use it.

## Content truth chain (verified 2026-09-11)

1. Live site: `https://www.allaspectsbarn.com` — **Square Online**, a **Vue SPA**. The HTML files are JS shells: `html/0000-home.html` contains ~30 characters of visible text.
2. Real content = `window.__BOOTSTRAP_STATE__`, a JSON blob inside each `html/*.html` (e.g., 59.8 KB for home).
3. `site-scrape/extract_clean_v2.py` extracts it: walks `siteData.page.properties.contentAreas`, harvests `quill` rich text (headings, paragraphs, links, images) → markdown.
4. **Output (the layer you use):** `site-scrape/content-clean/*.md` (one per page) + `site-scrape/content-clean/_site/*.json` (site-wide).

## Site inventory (verified)

- **2,830 URLs** from sitemap.xml: **79 main pages** + **2,751 product pages** (`/product/`)
- Main pages include: Home, About, Barn Brew Coffee Bar, Contact, Gallery, Pavilion & Party Rental, Petting Farm, plus ~72 vendor/shop pages
- 2 scrape failures: crochet product URLs return **400 on the live site itself** (not our bug)

## Files you will actually use

| File | Contents |
|---|---|
| `site-scrape/content-clean/<n>-<slug>.md` | Real copy per page (headings, paragraphs, links, image refs) |
| `site-scrape/content-clean/_site/AAB-SEO-MAP.json` | Per-page title + meta description (use verbatim — don't invent SEO) |
| `site-scrape/content-clean/_site/AAB-NAV.json` | Navigation structure |
| `site-scrape/content-clean/_site/AAB-PAGES-META.json` | Page slugs, routes, types |
| `site-scrape/content-clean/_site/AAB-DESIGN-SYSTEM.json` | Brand tokens (color `#435298`, fonts, type scale, icons, logo path) |
| `site-scrape/media/` | 1,077 real image files (SHA-1 dedup) — reference by path; never commit the whole 561 MB |

## Verified facts to hard-code (from snapshot)

- **Email:** `allaspectsrecycled@gmail.com` (this is the REAL live contact from bootstrap; an earlier patched build used `info@allspectsbarn.com` — that was a typo variant, reconcile to the real one)
- **Facebook:** `allaspectsrepurposed/`
- **Instagram:** `allaspectsrestoredrecycled/`
- **Hours:** Open Thursday, Friday, Saturday 10–5; open by appointment Sunday–Wednesday
- **Location:** Route 611, Village of Stone Church, Upper Mount Bethel, PA
- **Name style:** "All Aspects Restored & Recycled" (About) / "All Aspects at the Barn" (site)
- **Social stats (context):** IG 2,889 · TikTok 494/1,773 · Google 4.8★

## Migration steps per page

1. Read `<n>-<slug>.md` from `content-clean/` — this is the copy.
2. Get title/description from `AAB-SEO-MAP.json`.
3. Map the Quill markdown into the rebuilt layout (headings → section headings, paragraphs → body, links/images preserved).
4. Keep the site's voice: friendly, rustic, family-owned. Do NOT import the ranch template's copy.
5. Products: `product pages` derive from content-clean product data (title, description, images); 2,751 products → paginate or statically generate.

## Pitfalls

- `site-scrape/content/*.md` (no `-clean`) is **media-lists only** — never use for copy.
- Raw `html/*.html` bodies have ~30 chars visible — only the bootstrap JSON is real.
- Some pages are image/CTA-led (e.g., home banner) with little prose — that's the truth; don't invent paragraphs.
- Product image URLs may be `cdn3.editmysite.com` — use the local `media/` copy in the build.
- If you must re-extract: `python extract_clean_v2.py [limit]` (hermes venv python on source machine).
