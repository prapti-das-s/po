/* ============================================================
   PRAPTI DAS PORTFOLIO — scripts.js
   ============================================================ */

// ---- SPA ROUTING ----
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  window.scrollTo(0, 0);

  // Page-specific inits
  if (id === 'portfolio') initClock();
  if (id === 'blog') initFeathers();
  if (id === 'resume') initSnitch();

  // Trigger reveals for new page
  setTimeout(triggerReveals, 80);
}

// ---- SCROLL REVEAL ----
function triggerReveals() {
  const els = document.querySelectorAll('.page.active .reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
}

// ---- CAROUSEL ----
let slideIdx = 0;
const TOTAL = 3;
let autoTimer;

function goTo(idx) {
  slideIdx = (idx + TOTAL) % TOTAL;
  const track = document.getElementById('carousel-track');
  if (track) track.style.transform = `translateX(-${slideIdx * 100}%)`;
  document.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === slideIdx));
}

function moveCarousel(dir) { goTo(slideIdx + dir); resetAuto(); }

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(slideIdx + 1), 5000);
}

// ---- GOLDEN SNITCH ----
function initSnitch() {
  const snitch = document.getElementById('snitch');
  if (!snitch || snitch._snitchInit) return;
  snitch._snitchInit = true;
  let flying = false;

  snitch.addEventListener('click', () => {
    if (flying) return;
    flying = true;
    const vw = window.innerWidth, vh = window.innerHeight;
    const pts = [];
    for (let i = 0; i < 7; i++) pts.push({ x: Math.random() * (vw - 80), y: Math.random() * (vh - 80) });
    pts.push({ x: vw - 70, y: vh - 70 });

    const rect = snitch.getBoundingClientRect();
    snitch.style.position = 'fixed';
    snitch.style.right = 'auto';
    snitch.style.bottom = 'auto';
    snitch.style.left = rect.left + 'px';
    snitch.style.top = rect.top + 'px';

    let step = 0;
    function fly() {
      if (step >= pts.length) { flying = false; snitch.style.left = 'auto'; snitch.style.top = 'auto'; snitch.style.right = '2.5rem'; snitch.style.bottom = '2.5rem'; return; }
      const p = pts[step];
      const cur = snitch.getBoundingClientRect();
      const dist = Math.hypot(p.x - cur.left, p.y - cur.top);
      const dur = Math.max(180, dist / 220 * 1000);
      snitch.style.transition = `left ${dur}ms ease, top ${dur}ms ease`;
      snitch.style.left = p.x + 'px'; snitch.style.top = p.y + 'px';
      step++; setTimeout(fly, dur + 60);
    }
    setTimeout(fly, 30);
  });

  snitch.addEventListener('mouseenter', () => snitch.style.filter = 'drop-shadow(0 0 14px gold)');
  snitch.addEventListener('mouseleave', () => snitch.style.filter = '');
}

// ---- BACKWARD CLOCK ----
let clockTimer;
function initClock() {
  if (clockTimer) return;
  let min = 0, hr = 0;
  clockTimer = setInterval(() => {
    min -= 6; hr -= 0.5;
    const m = document.getElementById('clock-minute');
    const h = document.getElementById('clock-hour');
    if (m) m.setAttribute('transform', `rotate(${min},100,100)`);
    if (h) h.setAttribute('transform', `rotate(${hr},100,100)`);
  }, 1000);
}

// ---- FEATHERS ----
let featherTimer;
function initFeathers() {
  if (featherTimer) return;
  function spawn() {
    const f = document.createElement('div');
    f.classList.add('feather');
    f.textContent = '🪶';
    f.style.left = (10 + Math.random() * 80) + 'vw';
    f.style.top = '-60px';
    f.style.animationDuration = (9 + Math.random() * 7) + 's';
    f.style.fontSize = (0.75 + Math.random() * 0.7) + 'rem';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 17000);
  }
  spawn();
  featherTimer = setInterval(spawn, 7000);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  goTo(0);
  resetAuto();

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle) toggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  // Keyboard carousel
  document.addEventListener('keydown', e => {
    const active = document.querySelector('.page.active');
    if (!active || active.id !== 'page-home') return;
    if (e.key === 'ArrowLeft') moveCarousel(-1);
    if (e.key === 'ArrowRight') moveCarousel(1);
  });
});
