// script.js - Basic interactivity for AAB site

// Toggle FAQ items
function toggleFaq(el) {
  const question = el;
  const answer = question.nextElementSibling;
  
  question.classList.toggle('active');
  answer.classList.toggle('open');
}

// Image error fallback
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.src = '';
    this.style.background = '#f0f0f0';
    this.style.minHeight = '150px';
  });
});

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if (e.isIntersecting) { 
      e.target.classList.add('visible'); 
      io.unobserve(e.target); 
    } 
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Newsletter form handling
function handleNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector("input[type=email]").value;
  
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email");
    return;
  }
  
  // In a real implementation, this would submit to a form service
  alert("Thank you for subscribing!");
  e.target.reset();
}

document.addEventListener("DOMContentLoaded", function() {
  const nf = document.getElementById("newsletter-form");
  if (nf) {
    nf.addEventListener("submit", handleNewsletter);
  }
});

// ===== Mobile nav toggle (Phase 4) =====
(function () {
  const toggle = document.getElementById('navToggle');
  const navList = document.getElementById('primaryNav');
  if (!toggle || !navList) return;

  function setOpen(open) {
    navList.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(!navList.classList.contains('is-open'));
  });

  // Close when a link is chosen (capture phase: unlock scroll BEFORE the
  // anchor's own smooth-scroll handler runs, so the scroll actually works)
  navList.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  }, true);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // Close when tapping outside the nav
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav')) setOpen(false);
  });
})();

/* ===== Depth system (Phase 5) — pointer-tracked tilt + travelling lamp sheen =====
   Answers the visitor's own cursor rather than animating on its own. Writes --rx/--ry
   (rotation) and --mx/--my (sheen position) as CSS custom properties; the CSS layer does
   the rendering. Skipped entirely for reduced-motion users and coarse pointers. */
(function () {
  const FAMILY = '.pillar-card, .why-card, .events-card, .video-card, .contact-card, .festival';
  const cards = document.querySelectorAll(FAMILY);
  if (!cards.length) return;

  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)');
  const FINE = window.matchMedia('(hover: hover) and (pointer: fine)');
  const MAX = 6; // degrees — matches --tilt-max

  function point(card, e) {
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = (e.clientX - r.left) / r.width;   // 0..1 across the card
    const py = (e.clientY - r.top) / r.height;   // 0..1 down the card
    card.style.setProperty('--rx', ((0.5 - py) * 2 * MAX).toFixed(2) + 'deg');
    card.style.setProperty('--ry', ((px - 0.5) * 2 * MAX).toFixed(2) + 'deg');
    card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
    card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
  }

  function rest(card) {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '18%');
  }

  cards.forEach(function (card) {
    let raf = 0;
    card.addEventListener('pointermove', function (e) {
      if (REDUCE.matches || !FINE.matches) return;
      if (raf) return; // one frame at a time
      raf = requestAnimationFrame(function () { raf = 0; point(card, e); });
    }, { passive: true });

    card.addEventListener('pointerleave', function () {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (!REDUCE.matches) rest(card);
    }, { passive: true });
  });
})();