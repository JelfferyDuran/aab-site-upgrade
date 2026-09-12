# All Aspects at the Barn - Static Site Build

This is a static website rebuild of [allaspectsbarn.com](https://www.allaspectsbarn.com) using clean HTML/CSS/JS without any frameworks, recreating the visual system of the "Lone Mustang Ranch" Framer template (Paulina Pixi, $49) as a hand-built static site — **recreated, never plagiarized**.

## Features

- Clean, hand-written HTML/CSS/JS (static, no framework)
- AAB's real brand: indigo `#435298`, Dancing Script + Cardo type
- Template's layout rhythm mirrored (navi-style header, hero with photo + address + scroll cue, services ticker, offer cards, sticky scroll sections, FAQ accordion, rich footer)
- Content populated from `site-scrape/content-clean/`
- No plagiarism: no Paulina's copy, images, or assets
- Conversion features in place: JSON-LD LocalBusiness/Organization, newsletter capture, WhatsApp booking, OG tags, analytics hooks

## Files

- `index.html` - Main homepage
- `tokens.css` - AAB design tokens re-expressed from the template
- `styles.css` - Visual styling using the tokens
- `script.js` - Basic interactivity
- `images/` - Asset directory (not committed to git)

## Build Process

1. **Foundation** - Tokens and base layout
2. **Home page** - Hero + ticker + cards + scroll sections + FAQ
3. **Main pages** - About, Barn Brew, Gallery, Pavilion/Rental, Petting Farm, Contact
4. **Product pages** - Static generation from product extractions
5. **Conversion pass** - Schema, newsletter, WhatsApp, OG, analytics

## Deployment

The site is designed to deploy to GitHub Pages (`jelfferyduran.github.io/aab-site-upgrade/`) and Vercel (`aab-site-upgrade.vercel.app`).

## Attribution

Layout concept inspired by the Lone Mustang Ranch Framer template by Paulina Pixi ($49, framer.com marketplace). All content and brand assets © All Aspects at the Barn. Built from scratch.