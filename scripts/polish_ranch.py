"""Phase 2.6 - Ranch look & feel polish.

1. tokens.css  -> real Lone Mustang ranch palette + template font stack
2. index.html  -> Google Fonts stack swap + theme-color
3. styles.css  -> appended RANCH POLISH LAYER (treatments, bands, cards, nav, footer)
Idempotent: re-running replaces the polish layer instead of stacking it.
"""
import re, hashlib, os

BASE = r"C:\Users\Jayto\aab-port\build"
TOK = os.path.join(BASE, "tokens.css")
IDX = os.path.join(BASE, "index.html")
CSS = os.path.join(BASE, "styles.css")
MARK = "/* ==== RANCH POLISH LAYER (phase 2.6) ==== */"

# ---------------------------------------------------------------- tokens.css
TOKENS = """:root {
  /* ===== RANCH PALETTE - extracted from the Lone Mustang template scrape ===== */
  /* Neutrals / darks (template usage weights in parens) */
  --color-ink: #221e1a;          /* espresso ink (177 uses) - text + dark bands */
  --color-brown-900: #221e1a;
  --color-brown-800: #332622;    /* deep coffee (67) */
  --color-brown-700: #4c3833;    /* rich brown (78) */
  --color-brown-600: #664b44;    /* light brown (14) */
  --color-tan: #d5c5b6;          /* tan / borders (30) */
  --color-cream-50: #fbf9f8;     /* off white (31) */
  --color-cream-100: #f5efe7;    /* card cream */
  --color-cream-200: #eee8e2;    /* warm cream - light bands (73) */
  --color-cream-300: #efe5d2;    /* warmer cream (60) */

  /* Signature accents */
  --color-rust: #b1502a;         /* terracotta - primary action (124 uses) */
  --color-rust-dark: #944725;
  --color-rust-light: #c86441;
  --color-gold: #d99a23;         /* golden amber (82) */
  --color-gold-bright: #fec202;  /* bright gold - ticker / highlights (64) */
  --color-gold-dark: #b07d15;

  /* ---- semantic mapping (existing selectors keep working) ---- */
  --color-primary: var(--color-rust);
  --color-primary-darker: var(--color-rust-dark);
  --color-primary-lighter: var(--color-rust-light);

  --color-surface: var(--color-cream-200);
  --color-surface-dark: var(--color-tan);
  --color-card: var(--color-cream-50);
  --color-border: var(--color-tan);

  --color-text: var(--color-ink);
  --color-text-light: var(--color-brown-700);
  --color-text-dim: #6b5b54;

  --color-accent: var(--color-gold);
  --color-accent-light: var(--color-gold-bright);
  --color-accent-darker: var(--color-gold-dark);

  /* dark-surface helpers (used by the polish layer) */
  --color-on-dark: var(--color-cream-300);
  --color-on-dark-dim: #cbbfae;
  --color-band-dark: var(--color-ink);
  --color-band-cream: var(--color-cream-200);
  --color-band-light: var(--color-cream-50);

  /* Status colors */
  --color-success: #2f7d4f;
  --color-warning: var(--color-gold);
  --color-error: #b3261e;

  /* ===== Typography - Lone Mustang template stack ===== */
  --font-display: 'Alfa Slab One', Georgia, 'Times New Roman', serif;
  --font-ui: 'Rye', Georgia, serif;
  --font-script: 'Satisfy', 'Segoe Script', cursive;
  --font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-serif: 'Cardo', Georgia, serif;

  /* Type scale - base 20px, scale 1.25 */
  --font-size-xxs: 0.8rem; /* 16px */
  --font-size-xs: 0.9rem; /* 18px */
  --font-size-sm: 1rem; /* 20px */
  --font-size-md: 1.25rem; /* 25px */
  --font-size-lg: 1.5625rem; /* 31px */
  --font-size-xl: 1.953125rem; /* 39px */
  --font-size-xxl: 2.44140625rem; /* 49px */
  --font-size-xxxl: 3.0517578125rem; /* 61px */

  /* Line heights */
  --line-height-tight: 1.15;
  --line-height-normal: 1.6;
  --line-height-loose: 1.8;

  /* Spacing scale */
  --space-xxs: 0.25rem; /* 4px */
  --space-xs: 0.5rem; /* 8px */
  --space-sm: 0.75rem; /* 12px */
  --space-md: 1rem; /* 16px */
  --space-lg: 1.5rem; /* 24px */
  --space-xl: 2rem; /* 32px */
  --space-xxl: 3rem; /* 48px */
  --space-xxxl: 4rem; /* 64px */

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

  /* Shadows - warm, brown-tinted instead of neutral black */
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

# ---------------------------------------------------------------- polish layer
POLISH = MARK + """
/* Warm base + selection */
body { background-color: var(--color-band-cream); color: var(--color-text); }
::selection { background: var(--color-gold-bright); color: var(--color-ink); }
:focus-visible { outline: 3px solid var(--color-gold); outline-offset: 2px; }

/* --- Navigation: espresso bar, cream links, gold hover --- */
.nav { background: rgba(34,30,26,0.97); border-bottom: 2px solid var(--color-gold-dark); }
.nav-logo a { font-family: var(--font-ui); color: var(--color-gold-bright); letter-spacing: .5px; }
.nav-links a { color: var(--color-on-dark); font-family: var(--font-body); font-weight: 500;
  text-transform: uppercase; font-size: .82rem; letter-spacing: .12em; }
.nav-links a:hover { color: var(--color-gold-bright); }

/* --- Hero: deep espresso wash over the barn photo --- */
.hero { background: linear-gradient(rgba(34,30,26,.80), rgba(34,30,26,.55) 55%, rgba(34,30,26,.85)),
  url('images/IMG_1415.jpg') center/cover no-repeat; }
.hero-bg { opacity: .28; }
.hero-text .eyebrow, .hero .eyebrow { font-family: var(--font-ui); color: var(--color-gold-bright);
  text-transform: uppercase; letter-spacing: .18em; font-size: .82rem; }
.hero-title { font-family: var(--font-display); color: var(--color-cream-50);
  text-shadow: 3px 3px 0 rgba(34,30,26,.45); letter-spacing: .5px; }
.hero-subtitle { font-family: var(--font-script); color: var(--color-gold); }
.hero-description { color: var(--color-on-dark); font-family: var(--font-body); }

/* --- Buttons: rust primary, gold outline secondary --- */
.btn { font-family: var(--font-body); font-weight: 600; text-transform: uppercase;
  letter-spacing: .1em; font-size: .82rem; border-radius: var(--radius-sm); }
.btn-primary { background: var(--color-rust); color: var(--color-cream-50); border: 2px solid var(--color-rust); }
.btn-primary:hover { background: var(--color-rust-dark); border-color: var(--color-rust-dark); transform: translateY(-2px); }
.btn-secondary { background: transparent; color: var(--color-gold-bright); border: 2px solid var(--color-gold); }
.btn-secondary:hover { background: var(--color-gold-bright); color: var(--color-ink); border-color: var(--color-gold-bright); }

/* --- Ticker: the template's signature gold band --- */
.ticker { background: var(--color-gold-bright); border-top: 3px solid var(--color-ink); border-bottom: 3px solid var(--color-ink); }
.ticker p { color: var(--color-ink); font-family: var(--font-ui); letter-spacing: .06em; }

/* --- Section headings: slab display + rust rule --- */
.section-title { font-family: var(--font-display); color: var(--color-ink); letter-spacing: .5px; }
.section-title::after { content: ""; display: block; width: 78px; height: 4px; margin: .7rem auto 0;
  background: var(--color-rust); border-radius: 2px; }
.section-sub { color: var(--color-text-light); font-family: var(--font-body); }
.eyebrow { font-family: var(--font-ui); color: var(--color-rust); text-transform: uppercase;
  letter-spacing: .16em; font-size: .8rem; }

/* --- Cards: cream, tan hairline, small radius, warm lift --- */
.pillar-card, .why-card, .events-card, .video-card, .contact-card, .festival {
  background: var(--color-cream-50); border: 1px solid var(--color-tan);
  border-radius: var(--radius-md); box-shadow: var(--shadow-sm); overflow: hidden; }
.pillar-card:hover, .why-card:hover, .events-card:hover, .video-card:hover,
.contact-card:hover, .festival:hover { border-color: var(--color-rust); box-shadow: var(--shadow-md); transform: translateY(-3px); }
.pillar-body h3, .why-body h3, .events-body h3, .footer-info h4, .footer-links h4, .footer-social h4 {
  font-family: var(--font-display); color: var(--color-ink); }
.pillar-body p, .why-body p, .events-body p { color: var(--color-text-light); font-family: var(--font-body); }
.pillar-body .price, .price { font-family: var(--font-body); font-weight: 700; color: var(--color-rust); }
.why-icon { color: var(--color-gold); }
.events-image, .pillar-image { border-bottom: 3px solid var(--color-gold); }

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
.callout { background: var(--color-cream-300); border-left: 5px solid var(--color-rust);
  color: var(--color-brown-800); font-family: var(--font-serif); font-size: var(--font-size-md); }

/* --- Video wall --- */
.vc-caption { font-family: var(--font-ui); color: var(--color-brown-700); text-align: center; }
.vc-play { color: var(--color-cream-50); background: rgba(177,80,42,.92); }
.vc-stats { font-family: var(--font-body); font-weight: 600; color: var(--color-rust); }

/* --- FAQ: espresso bars, rust open state --- */
.faq-item { background: var(--color-cream-50); border: 1px solid var(--color-tan); border-radius: var(--radius-sm); }
.faq-question { font-family: var(--font-body); font-weight: 600; color: var(--color-ink); }
.faq-answer { color: var(--color-text-light); font-family: var(--font-body); }
.faq-item[open], .faq-item.is-open { border-left: 5px solid var(--color-rust); }

/* --- Hours / location / contact --- */
.hours-table th { font-family: var(--font-ui); color: var(--color-ink); background: var(--color-cream-300); }
.hours-table td, .hours-table th { border-bottom: 1px solid var(--color-tan); }
.hours-table td { color: var(--color-text-light); }
.loc { font-family: var(--font-body); color: var(--color-brown-700); }
.form-group label { font-family: var(--font-ui); color: var(--color-brown-800); font-size: .82rem;
  text-transform: uppercase; letter-spacing: .1em; }
.form-group input, .form-group textarea, .form-group select {
  background: var(--color-cream-50); border: 1px solid var(--color-tan);
  border-radius: var(--radius-sm); color: var(--color-ink); font-family: var(--font-body); }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus {
  border-color: var(--color-rust); box-shadow: 0 0 0 3px rgba(177,80,42,.18); outline: none; }
.submit-btn { background: var(--color-rust); color: var(--color-cream-50); border: 2px solid var(--color-rust);
  font-family: var(--font-body); font-weight: 600; text-transform: uppercase; letter-spacing: .1em; }
.submit-btn:hover { background: var(--color-rust-dark); border-color: var(--color-rust-dark); }

/* --- Festival / event date badges --- */
.fest-date { font-family: var(--font-display); color: var(--color-ink); background: var(--color-gold-bright); }
.fest-tags span { background: var(--color-cream-300); color: var(--color-brown-800); border: 1px solid var(--color-tan); }

/* --- Footer: espresso with gold accents --- */
.footer { background: var(--color-ink); color: var(--color-on-dark); border-top: 4px solid var(--color-gold); }
.footer-info h4, .footer-links h4, .footer-social h4 { color: var(--color-gold-bright); }
.footer-info p, .footer-links a, .footer-social a { color: var(--color-on-dark); }
.footer-links a:hover, .footer-social a:hover { color: var(--color-gold-bright); }
.footer-social .social-links a { border-color: var(--color-gold-dark); color: var(--color-on-dark); }
.footer-social .social-links a:hover { background: var(--color-gold-bright); color: var(--color-ink); border-color: var(--color-gold-bright); }
.footer-bottom { border-top: 1px solid rgba(239,229,210,.2); color: var(--color-on-dark-dim); }

/* --- Floating WhatsApp --- */
.whatsapp-fab { background: var(--color-rust); color: var(--color-cream-50); box-shadow: var(--shadow-md); }
.whatsapp-fab:hover { background: var(--color-rust-dark); }

/* --- Accessibility --- */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .001ms !important; transition-duration: .001ms !important; }
}
"""

def md5(p):
    return hashlib.md5(open(p, "rb").read()).hexdigest()[:10]

open(TOK, "w", encoding="utf-8", newline="\n").write(TOKENS)

# --- index.html: font stack + theme color ---
html = open(IDX, encoding="utf-8").read()
NEWFONTS = ('<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One'
            '&family=Rye&family=Satisfy&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">')
html, n_font = re.subn(r'<link href="https://fonts\.googleapis\.com/css2\?[^"]*" rel="stylesheet">',
                       NEWFONTS, html)
html, n_theme = re.subn(r'(<meta name="theme-color" content=")[^"]*(")', r'\g<1>#221e1a\g<2>', html)
if n_theme == 0:
    html = html.replace("</head>", '<meta name="theme-color" content="#221e1a">\n</head>', 1)
open(IDX, "w", encoding="utf-8", newline="\n").write(html)

# --- styles.css: replace/append polish layer ---
css = open(CSS, encoding="utf-8").read()
if MARK in css:
    css = css.split(MARK)[0].rstrip() + "\n\n" + POLISH
else:
    css = css.rstrip() + "\n\n" + POLISH
open(CSS, "w", encoding="utf-8", newline="\n").write(css)

print("tokens.css  ->", os.path.getsize(TOK), "B  md5", md5(TOK))
print("index.html  ->", os.path.getsize(IDX), "B  md5", md5(IDX), "| font links replaced:", n_font, "| theme-color:", n_theme)
print("styles.css  ->", os.path.getsize(CSS), "B  md5", md5(CSS))
