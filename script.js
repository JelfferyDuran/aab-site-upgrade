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

      /* ===================== PHASE 6 — Hero embers + drift (vanilla WebGL, zero deps) ===================== */
      (function () {
        'use strict';

        var hero = document.querySelector('.hero');
        var panel = document.querySelector('.hero-content');
        var bg = document.querySelector('.hero-bg');
        var video = hero ? hero.querySelector('.hero-video') : null;
        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!hero || !panel) return;

        if (reduceMotion) {
          if (video) {
            video.pause();
            video.removeAttribute('autoplay');
          }
          return;
        }

        /* The video is progressive enhancement: if the asset/CDN is unavailable,
           hide it and expose the existing hero background image underneath. */
        if (video) {
          var source = video.querySelector('source');
          var fallbackToPhoto = function () { video.hidden = true; };
          video.addEventListener('error', fallbackToPhoto, { once: true });
          if (source) source.addEventListener('error', fallbackToPhoto, { once: true });
          var playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () { /* poster/fallback remains visible */ });
          }
        }

        /* Keep the ember layer above the photo and below the copy, no matter the pre-existing CSS */
        if (getComputedStyle(panel).position === 'static') panel.style.position = 'relative';
        if (getComputedStyle(panel).zIndex === 'auto') panel.style.zIndex = '2';

        /* ---- 1 · WebGL embers: barn dust caught in lamplight ---- */
        var cv = document.createElement('canvas');
        var gl = null;
        try {
          /* Keep the new photographic hero clean. The legacy ember canvas only
             runs when no video enhancement is present. */
          if (!video) {
            gl = cv.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false }) ||
                 cv.getContext('experimental-webgl');
          }
        } catch (err) { gl = null; }

        if (!gl || !window.WebGLRenderingContext) {
          hero.insertBefore(cv, hero.firstChild);
          hero.removeChild(cv);
        } else {
          var VSH = 'attribute vec2 aPos;attribute float aSize;attribute vec4 aCol;varying vec4 vCol;' +
            'void main(){gl_Position=vec4(aPos.x*2.0-1.0,aPos.y*2.0-1.0,0.0,1.0);gl_PointSize=aSize;vCol=aCol;}';
          var FSH = 'precision mediump float;varying vec4 vCol;' +
            'void main(){vec2 d=gl_PointCoord-vec2(0.5);float a=smoothstep(0.5,0.0,length(d));gl_FragColor=vec4(vCol.rgb,a*a*vCol.a);}';

          function shader(type, src) {
            var s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
          }

          var vs = shader(gl.VERTEX_SHADER, VSH);
          var fs = shader(gl.FRAGMENT_SHADER, FSH);
          var prog = (vs && fs) ? gl.createProgram() : null;
          if (!prog) { hero.insertBefore(cv, hero.firstChild); hero.removeChild(cv); return; }
          gl.attachShader(prog, vs);
          gl.attachShader(prog, fs);
          gl.linkProgram(prog);
          if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { hero.insertBefore(cv, hero.firstChild); hero.removeChild(cv); return; }
          gl.useProgram(prog);

          var locPos = gl.getAttribLocation(prog, 'aPos');
          var locSize = gl.getAttribLocation(prog, 'aSize');
          var locCol = gl.getAttribLocation(prog, 'aCol');

          var N = 54;
          var PAL = [[254, 194, 2], [233, 180, 76], [217, 154, 35], [177, 80, 42], [255, 244, 222]];
          var parts = [];
          for (var i = 0; i < N; i++) {
            var c = PAL[Math.floor(Math.random() * PAL.length)];
            parts.push({
              x: Math.random(), y: Math.random(),
              dy: 0.0004 + Math.random() * 0.0011,
              ph: Math.random() * 6.2832, sw: 0.4 + Math.random() * 0.9,
              size: (0.9 + Math.random() * 2.1) * Math.min(window.devicePixelRatio || 1, 2),
              r: c[0] / 255, g: c[1] / 255, b: c[2] / 255, a: 0.22 + Math.random() * 0.6
            });
          }
          var data = new Float32Array(N * 7);
          var buf = gl.createBuffer();
          var dpr = Math.min(window.devicePixelRatio || 1, 2);

          function fit() {
            var rect = hero.getBoundingClientRect();
            var w = Math.max(1, Math.round(rect.width * dpr));
            var h = Math.max(1, Math.round(rect.height * dpr));
            if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
          }

          cv.className = 'hero-fx';   // Phase 6 CSS: absolute/inset:0/z-index:1/opacity:0.72 — must be set BEFORE insert so the canvas is out of flow (was: classless canvas in normal flow -> height feedback loop, hero rect inflated to 2^25px on phones)
          hero.insertBefore(cv, hero.firstChild);

          var raf = 0, last = 0;
          function frame(now) {
            raf = requestAnimationFrame(frame);
            var t = now / 1000;
            var dt = last ? Math.min(2.5, t - last) : 0;
            last = t;
            if (document.hidden) return;
            fit();
            for (var i = 0; i < N; i++) {
              var p = parts[i];
              p.y -= p.dy * dt;
              if (p.y < -0.05) {
                p.y = 1.05 + Math.random() * 0.12;
                p.x = Math.random();
                p.dy = 0.0004 + Math.random() * 0.0011;
              }
              var off = i * 7;
              data[off] = p.x + Math.sin(t * p.sw + p.ph) * 0.012;
              data[off + 1] = p.y;
              data[off + 2] = p.size;
              data[off + 3] = p.r; data[off + 4] = p.g; data[off + 5] = p.b; data[off + 6] = p.a;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enableVertexAttribArray(locPos);
            gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 28, 0);
            gl.enableVertexAttribArray(locSize);
            gl.vertexAttribPointer(locSize, 1, gl.FLOAT, false, 28, 8);
            gl.enableVertexAttribArray(locCol);
            gl.vertexAttribPointer(locCol, 4, gl.FLOAT, false, 28, 12);
            gl.drawArrays(gl.POINTS, 0, N);
          }
          raf = requestAnimationFrame(frame);
          window.addEventListener('resize', fit, { passive: true });
        }

        /* ---- 2 · Pointer tilt for the hero panel (CSS halves the angle) ---- */
        var FINE = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (FINE.matches) {
          hero.addEventListener('pointermove', function (e) {
            var r = hero.getBoundingClientRect();
            var nx = (e.clientX - r.left) / r.width - 0.5;
            var ny = (e.clientY - r.top) / r.height - 0.5;
            panel.style.setProperty('--rx', String(ny * -7) + 'deg');
            panel.style.setProperty('--ry', String(nx * 7) + 'deg');
            panel.style.setProperty('--mx', String((nx + 0.5) * 100) + '%');
            panel.style.setProperty('--my', String((ny + 0.5) * 100) + '%');
          }, { passive: true });
          hero.addEventListener('pointerleave', function () {
            panel.style.setProperty('--rx', '0deg');
            panel.style.setProperty('--ry', '0deg');
            panel.style.setProperty('--mx', '50%');
            panel.style.setProperty('--my', '18%');
          }, { passive: true });
        }

        /* ---- 3 · Scroll drift: the photo lags behind the page (top edge never shows) ---- */
        var ticking = false;
        function onScroll() {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(function () {
            ticking = false;
            var y = window.pageYOffset || document.documentElement.scrollTop || 0;
            var top = hero.offsetTop || 0;
            var hp = hero.offsetHeight || 1;
            var p = Math.max(0, Math.min(1, (y - top) / hp));
            if (bg) bg.style.transform = 'translate3d(0,' + (p * 24).toFixed(1) + 'px,0) scale(1.035)';
          });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      })();