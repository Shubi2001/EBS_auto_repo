/* =============================================
   Crumbly — main.js
   Effects: Intro splash, custom cursor, particles,
            stagger reveal, card tilt, nav scroll
   ============================================= */

// ══════════════════════════════════════════════
//  INTRO / SPLASH ANIMATION
// ══════════════════════════════════════════════
(function initIntro() {
  const overlay = document.getElementById('introOverlay');
  const iCanvas = document.getElementById('introCanvas');
  if (!overlay || !iCanvas) return;
  const iCtx = iCanvas.getContext('2d');

  // Lock scroll while intro plays
  document.body.classList.add('intro-active');

  // Resize canvas to full screen
  iCanvas.width  = window.innerWidth;
  iCanvas.height = window.innerHeight;

  // ── Rising sparkle particles ─────────────────
  const sparks = Array.from({ length: 70 }, () => ({
    x: Math.random() * iCanvas.width,
    y: Math.random() * iCanvas.height,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -(Math.random() * 0.8 + 0.3),
    life: Math.random() * 200,
    maxLife: Math.random() * 280 + 160,
    hue: Math.random() > 0.5 ? 35 : 42,
  }));

  let introRaf;
  function drawIntroParticles() {
    iCtx.clearRect(0, 0, iCanvas.width, iCanvas.height);

    // Soft center glow
    const cx = iCanvas.width / 2, cy = iCanvas.height / 2;
    const grd = iCtx.createRadialGradient(cx, cy, 0, cx, cy, 240);
    grd.addColorStop(0, 'rgba(201,149,74,0.07)');
    grd.addColorStop(1, 'rgba(201,149,74,0)');
    iCtx.fillStyle = grd;
    iCtx.fillRect(0, 0, iCanvas.width, iCanvas.height);

    // Particles
    sparks.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.life++;
      const a = Math.sin((s.life / s.maxLife) * Math.PI) * 0.55;
      iCtx.beginPath();
      iCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      iCtx.fillStyle = `hsla(${s.hue},75%,65%,${a})`;
      iCtx.fill();
      if (s.life >= s.maxLife || s.y < -8) {
        s.x = Math.random() * iCanvas.width;
        s.y = iCanvas.height + 8;
        s.life = 0;
        s.maxLife = Math.random() * 280 + 160;
      }
    });
    introRaf = requestAnimationFrame(drawIntroParticles);
  }
  drawIntroParticles();

  // ── Burst on cookie icon pop ──────────────────
  setTimeout(() => {
    const cx = iCanvas.width / 2, cy = iCanvas.height / 2;
    const burst = Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const spd   = Math.random() * 4 + 2;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 1.5,
        r: Math.random() * 3.5 + 1,
        life: 0, maxLife: Math.random() * 55 + 35,
        hue: Math.random() > 0.5 ? 35 : 48,
      };
    });
    sparks.push(...burst);
    setTimeout(() => burst.forEach(b => { const i = sparks.indexOf(b); if (i > -1) sparks.splice(i, 1); }), 900);
  }, 750);

  // ── Exit sequence (curtain split) ─────────────
  setTimeout(() => {
    cancelAnimationFrame(introRaf);
    overlay.classList.add('exit');
    document.body.classList.remove('intro-active');
    setTimeout(() => overlay.classList.add('done'), 1150);
  }, 3800);
})();

// ── Custom Cursor ─────────────────────────────────────────
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className  = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mx = -100, my = -100;
let rx = -100, ry = -100;

window.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

// Cursor grow on hover
document.querySelectorAll('a, button, .menu-card, .journal-card, .review-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// ── Particle Canvas ───────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x    = Math.random() * canvas.width;
    this.y    = init ? Math.random() * canvas.height : canvas.height + 10;
    this.size = Math.random() * 2.5 + 0.5;
    this.vx   = (Math.random() - 0.5) * 0.3;
    this.vy   = -(Math.random() * 0.6 + 0.2);
    this.alpha = Math.random() * 0.5 + 0.1;
    this.life  = 0;
    this.maxLife = Math.random() * 300 + 200;
    const hue = Math.random() > 0.5 ? 35 : 28;
    this.color = `hsla(${hue}, 70%, 65%,`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    const t = this.life / this.maxLife;
    this.alpha = Math.sin(t * Math.PI) * 0.4;
    if (this.life >= this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
  }
}

for (let i = 0; i < 55; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Nav scroll effect ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu toggle ────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Staggered Scroll Reveal ────────────────────────────────
const staggeredGroups = [
  document.querySelectorAll('.menu-grid .menu-card'),
  document.querySelectorAll('.journal-grid .journal-card'),
  document.querySelectorAll('.reviews-grid .review-card'),
];

function setupStagger(group) {
  const obs = new IntersectionObserver(entries => {
    const visibles = [...entries].filter(e => e.isIntersecting);
    visibles.forEach((entry, i) => {
      setTimeout(() => {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }, i * 120);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  group.forEach(el => obs.observe(el));
}
staggeredGroups.forEach(setupStagger);

// Block-level reveal
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.story-inner, .specials-inner, .cta-top, .cta-info, ' +
  '.press-strip, .menu-header, .reviews-header, .journal-top'
).forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

// ── 3D Card Tilt ──────────────────────────────────────────
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const rotX  = -dy * 6;
    const rotY  =  dx * 6;
    card.style.transform = `translateY(-10px) scale(1.02) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(.34,1.56,.64,1), box-shadow 0.35s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'box-shadow 0.35s ease';
  });
});

// ── Number Counter Animation ──────────────────────────────
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(eased * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stats = entry.target.querySelectorAll('.stat strong');
      stats.forEach(el => {
        const raw = el.textContent.replace(/[^\d]/g, '');
        const suffix = el.textContent.replace(/[\d]/g, '');
        if (raw) animateCounter(el, parseInt(raw), suffix);
      });
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.specials-stats').forEach(el => counterObs.observe(el));

// ── Cookie Banner ─────────────────────────────────────────
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDeny   = document.getElementById('cookieDeny');

if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    cookieBanner.classList.add('hidden');
    localStorage.setItem('crumbly_cookie', 'accepted');
  });
}
if (cookieDeny) {
  cookieDeny.addEventListener('click', () => {
    cookieBanner.classList.add('hidden');
    localStorage.setItem('crumbly_cookie', 'denied');
  });
}
if (localStorage.getItem('crumbly_cookie')) {
  cookieBanner && cookieBanner.classList.add('hidden');
}

// ── Active nav link highlight ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.style.color = active ? 'var(--gold)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObs.observe(s));

// ── Parallax on hero image ────────────────────────────────
const heroImg = document.getElementById('hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroImg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
  }, { passive: true });
}
