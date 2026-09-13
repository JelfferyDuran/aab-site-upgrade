"""Phase 2.6b - Polish v2: AAB BRAND COLORS instead of ranch gold/rust.

Brand evidence (scraped from allaspectsbarn.com itself):
  #435298 indigo -> 31,108 occurrences   <-- their brand color
  #ffffff 8,484 | #efefef 5,656 | #141414 2,828 | #000000 2,828 (neutrals only)
No yellow/orange exists in their brand, so every gold/rust accent is remapped to
the indigo family. Warm ranch neutrals (espresso / cream / tan) stay as structure.

1. tokens.css -> brand palette + template font stack (kept)
2. index.html -> (unchanged fonts, theme-color -> #435298)
3. styles.css -> polish layer v2 (brand accents)
Idempotent.
"""
import re, hashlib, os

BASE = r"C:\Users\Jayto\aab-port\build"
TOK = os.path.join(BASE, "tokens.css")
IDX = os.path.join(BASE, "index.html")
CSS = os.path.join(BASE, "styles.css")
MARK = "/* ==== RANCH POLISH LAYER (phase 2.6b - AAB brand) ==== */"

TOKENS = """:root {
  /* ===== AAB BRAND PALETTE (from their own site: #435298 x31,108) ===== */
  --color-brand: #435298;         /* AAB indigo - THE brand color */
  --color-brand-dark: #35417a;    /* pressed / hover */
  --color-brand-light: #5a69b2;   /* mid tint - rules, borders on light */
  --color-brand-soft: #9aa6dc;    /* light indigo - readable ON dark bands */
  --color-brand-tint: #e9ebf5;    /* 8% indigo wash - badges, table heads */
  --color-brand-tint-2: #d3d8ec;  /* 15% wash - chips, tags */

  /* ===== Warm ranch neutrals (structure - kept from the Lone Mustang pass) ===== */
  --color-ink: #221e1a;           /* espresso ink - dark bands + body text */
  --color-brown-900: #221e1a;
  --color-brown-800: #332622;
  --color-brown-700: #4c3833;
  --color-brown-600: #664b44;
  --color-tan: #d5c5b6;           /* hairline borders */
  --color-cream-50: #fbf9f8;      /* cards / off white */
  --color-cream-100: #f5efe7;
  --color-cream-200: #eee8e2;     /* light band */
  --color-cream-300: #efe5d2;     /* warmer cream - callouts, on-dark text */

  /* ---- semantic mapping (existing core selectors keep working) ---- */
  --color-primary: var(--color-brand);
  --color-primary-darker: var(--color-brand-dark);
  --color-primary-lighter: var(--color-brand-light);

  --color-surface: var(--color-cream-200);
  --color-surface-dark: var(--color-tan);
  --color-card: var(--color-cream-50);
  --color-border: var(--color-tan);

  --color-text: var(--color-ink);
  --color-text-light: var(--color-brown-700);
  --color-text-dim: #6b5b54;

  --color-accent: var(--color-brand-light);
  --color-accent-light: var(--color-brand-soft);
  --color-accent-darker: var(--color-brand-dark);

  /* dark-surface helpers */
  --color-on-dark: var(--color-cream-300);
  --color-on-dark-dim: #cbbfae;
  --color-band-dark: var(--color-ink);
  --color-band-cream: var(--color-cream-200);
  --color-band-light: var(--color-cream-50);

  /* Status colors */
  --color-success: #2f7d4f;
  --color-warning: #b07d15;
  --color-error: #b3261e;

  /* ===== Typography - Lone Mustang template stack ===== */
  --font-display: 'Alfa Slab One', Georgia, 'Times New Roman', serif;
  --font-ui: 'Rye', Georgia, serif;
  --font-script: 'Satisfy', 'Segoe Script', cursive;
  --font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-serif: 'Cardo', Georgia, serif;

  /* Type scale - base 20px, scale 1.25 */
  --font-size-xxs: 0.8rem;
  --font-size-xs: 0.9rem;
  --font-size-sm: 1rem;
  --font-size-md: 1.25rem;
  --font-size-lg: 1.5625rem;
  --font-size-xl: 1.953125rem;
  --font-size-xxl: 2.44140625rem;
  --font-size-xxxl: 3.0517578125rem;

  /* Line heights */
  --line-height-tight: 1.15;
  --line-height-normal: 1.6;
  --line-height-loose: 1.8;

  /* Spacing scale */
  --space-xxs: 0.25rem;
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-xxl: 3rem;
  --space-xxxl: 4rem;

  /* Breakpoints */
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;

  /* Border radius - rustic = tight radii */
  --radius-sm: 3px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-xl: 8px;
  --radius-full: 50%;

  /* Shadows - warm, brown-tinted */
  --shadow-sm: 0 2px 4px rgba(34,30,26,0.07);
  --shadow-md: 0 6px 16px rgba(34,30,26,0.12);
  --shadow-lg: 0 14px 34px rgba(34,30,26,0.18);

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.4s ease;

  /* Z-index */
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal: 1050;
}
"""

POLISH = MARK + """
/* Warm base + brand selection */
body { background-color: var(--color-band-cream); color: var(--color-text); }
::selection { background: var(--color-brand); color: var(--color-cream-50); }
:focus-visible { outline: 3px solid var(--color-brand-soft); outline-offset: 2px; }

/* --- Navigation: espresso bar, cream links, indigo hover --- */
.nav { background: rgba(34,30,26,0.97); border-bottom: 2px solid var(--color-brand); }
.nav-logo a { font-family: var(--font-ui); color: var(--color-brand-soft); letter-spacing: .5px; }
.nav-links a { color: var(--color-on-dark); font-family: var(--font-body); font-weight: 500;
  text-transform: uppercase; font-size: .82rem; letter-spacing: .12em; }
.nav-links a:hover { color: var(--color-brand-soft); }

/* --- Hero: size + wash the barn photo (original CSS never sized .hero-bg -> collapsed) --- */
.hero { background: var(--color-espresso); }
.hero-bg { position: absolute; inset: 0; z-index: 0; background-size: cover;
  background-position: center; opacity: 1; }
.hero-bg::after { content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(34,30,26,.80) 0%, rgba(34,30,26,.45) 45%,
  rgba(34,30,26,.58) 62%, rgba(34,30,26,.86) 100%); }
.hero-content { z-index: 2; }
.hero-text .eyebrow, .hero .eyebrow { font-family: var(--font-ui); color: var(--color-brand-soft);
  text-transform: uppercase; letter-spacing: .18em; font-size: .82rem; }
.hero-title { font-family: var(--font-display); color: var(--color-cream-50);
  text-shadow: 3px 3px 0 rgba(34,30,26,.45); letter-spacing: .5px; }
.hero-subtitle { font-family: var(--font-script); color: var(--color-brand-soft); }
.hero-description { color: var(--color-on-dark); font-family: var(--font-body); }

/* --- Buttons: indigo primary, light-indigo outline secondary --- */
.btn { font-family: var(--font-body); font-weight: 600; text-transform: uppercase;
  letter-spacing: .1em; font-size: .82rem; border-radius: var(--radius-sm); }
.btn-primary { background: var(--color-brand); color: var(--color-cream-50); border: 2px solid var(--color-brand); }
.btn-primary:hover { background: var(--color-brand-dark); border-color: var(--color-brand-dark); transform: translateY(-2px); }
.btn-secondary { background: transparent; color: var(--color-brand-soft); border: 2px solid var(--color-brand-soft); }
.btn-secondary:hover { background: var(--color-brand-soft); color: var(--color-ink); border-color: var(--color-brand-soft); }

/* --- Ticker: solid indigo band (brand) --- */
.ticker { background: var(--color-brand); border-top: 3px solid var(--color-ink); border-bottom: 3px solid var(--color-ink); }
.ticker p { color: var(--color-cream-300); font-family: var(--font-ui); letter-spacing: .06em; }

/* --- Section headings: slab display + indigo rule --- */
.section-title { font-family: var(--font-display); color: var(--color-ink); letter-spacing: .5px; }
.section-title::after { content: ""; display: block; width: 78px; height: 4px; margin: .7rem auto 0;
  background: var(--color-brand); border-radius: 2px; }
.section-sub { color: var(--color-text-light); font-family: var(--font-body); }
.eyebrow { font-family: var(--font-ui); color: var(--color-brand); text-transform: uppercase;
  letter-spacing: .16em; font-size: .8rem; }

/* --- Cards: cream, tan hairline, indigo hover --- */
.pillar-card, .why-card, .events-card, .video-card, .contact-card, .festival {
  background: var(--color-cream-50); border: 1px solid var(--color-tan);
  border-radius: var(--radius-md); box-shadow: var(--shadow-sm); overflow: hidden; }
.pillar-card:hover, .why-card:hover, .events-card:hover, .video-card:hover,
.contact-card:hover, .festival:hover { border-color: var(--color-brand); box-shadow: var(--shadow-md); transform: translateY(-3px); }
.pillar-body h3, .why-body h3, .events-body h3, .footer-info h4, .footer-links h4, .footer-social h4 {
  font-family: var(--font-display); color: var(--color-ink); }
.pillar-body p, .why-body p, .events-body p { color: var(--color-text-light); font-family: var(--font-body); }
.pillar-body .price, .price { font-family: var(--font-body); font-weight: 700; color: var(--color-brand); }
.why-icon { color: var(--color-brand); }
.events-image, .pillar-image { border-bottom: 3px solid var(--color-brand-light); }

/* --- Photos: cohesive warm treatment --- */
.pillar-image img, .events-image img, .gallery-item img, .split-image img, .video-image img {
  filter: saturate(1.06) contrast(1.03); transition: transform var(--transition-slow); }
.gallery-item { border: 1px solid var(--color-tan); border-radius: var(--radius-sm); overflow: hidden;
  background: var(--color-cream-50); }
.gallery-item:hover img, .pillar-card:hover .pillar-image img { transform: scale(1.04); }

/* --- Split / text blocks --- */
.split-text h3 { font-family: var(--font-display); color: var(--color-ink); }
.split-text p, .detail-list li, .vc-body p { color: var(--color-text-light); }
.detail-list li { border-bottom: 1px dashed var(--color-tan); }
.callout { background: var(--color-brand-tint); border-left: 5px solid var(--color-brand);
  color: var(--color-brown-800); font-family: var(--font-serif); font-size: var(--font-size-md); }

/* --- Video wall --- */
.vc-caption { font-family: var(--font-ui); color: var(--color-brand-dark); text-align: center; }
.vc-play { color: var(--color-cream-50); background: rgba(67,82,152,.92); }
.vc-stats { font-family: var(--font-body); font-weight: 600; color: var(--color-brand); }

/* --- FAQ --- */
.faq-item { background: var(--color-cream-50); border: 1px solid var(--color-tan); border-radius: var(--radius-sm); }
.faq-question { font-family: var(--font-body); font-weight: 600; color: var(--color-ink); }
.faq-answer { color: var(--color-text-light); font-family: var(--font-body); }
.faq-item[open], .faq-item.is-open { border-left: 5px solid var(--color-brand); }

/* --- Hours / location / contact --- */
.hours-table th { font-family: var(--font-ui); color: var(--color-ink); background: var(--color-brand-tint); }
.hours-table td, .hours-table th { border-bottom: 1px solid var(--color-tan); }
.hours-table td { color: var(--color-text-light); }
.loc { font-family: var(--font-body); color: var(--color-brown-700); }
.form-group label { font-family: var(--font-ui); color: var(--color-brown-800); font-size: .82rem;
  text-transform: uppercase; letter-spacing: .1em; }
.form-group input, .form-group textarea, .form-group select {
  background: var(--color-cream-50); border: 1px solid var(--color-tan);
  border-radius: var(--radius-sm); color: var(--color-ink); font-family: var(--font-body); }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus {
  border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(67,82,152,.20); outline: none; }
.submit-btn { background: var(--color-brand); color: var(--color-cream-50); border: 2px solid var(--color-brand);
  font-family: var(--font-body); font-weight: 600; text-transform: uppercase; letter-spacing: .1em; }
.submit-btn:hover { background: var(--color-brand-dark); border-color: var(--color-brand-dark); }

/* --- Festival / event badges --- */
.fest-date { font-family: var(--font-display); color: var(--color-cream-50); background: var(--color-brand); }
.fest-tags span { background: var(--color-brand-tint-2); color: var(--color-brand-dark); border: 1px solid var(--color-brand-soft); }

/* --- Footer: espresso with brand accents --- */
.footer { background: var(--color-ink); color: var(--color-on-dark); border-top: 4px solid var(--color-brand); }
.footer-info h4, .footer-links h4, .footer-social h4 { color: var(--color-brand-soft); }
.footer-info p, .footer-links a, .footer-social a { color: var(--color-on-dark); }
.footer-links a:hover, .footer-social a:hover { color: var(--color-brand-soft); }
.footer-social .social-links a { border-color: var(--color-brand-light); color: var(--color-on-dark); }
.footer-social .social-links a:hover { background: var(--color-brand-soft); color: var(--color-ink); border-color: var(--color-brand-soft); }
.footer-bottom { border-top: 1px solid rgba(239,229,210,.2); color: var(--color-on-dark-dim); }

/* --- Floating WhatsApp --- */
.whatsapp-fab { background: var(--color-brand); color: var(--color-cream-50); box-shadow: var(--shadow-md); }
.whatsapp-fab:hover { background: var(--color-brand-dark); }

/* --- Accessibility --- */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .001ms !important; transition-duration: .001ms !important; }
}
"""

def md5(p):
    return hashlib.md5(open(p, "rb").read()).hexdigest()[:10]

open(TOK, "w", encoding="utf-8", newline="\n").write(TOKENS)

html = open(IDX, encoding="utf-8").read()
html, n_theme = re.subn(r'(<meta name="theme-color" content=")[^"]*(")', r'\g<1>#435298\g<2>', html)
if n_theme == 0:
    html = html.replace("</head>", '<meta name="theme-color" content="#435298">\n</head>', 1)
open(IDX, "w", encoding="utf-8", newline="\n").write(html)

css = open(CSS, encoding="utf-8").read()
# drop BOTH polish layers (v1 gold + v2) if present, then append v2
for m in ("/* ==== RANCH POLISH LAYER (phase 2.6) ==== */", MARK):
    if m in css:
        css = css.split(m)[0].rstrip() + "\n\n"
css = (css.rstrip() + "\n\n" + POLISH)
open(CSS, "w", encoding="utf-8", newline="\n").write(css)

print("tokens.css ->", os.path.getsize(TOK), "B  md5", md5(TOK))
print("index.html ->", os.path.getsize(IDX), "B  md5", md5(IDX))
print("styles.css ->", os.path.getsize(CSS), "B  md5", md5(CSS))
