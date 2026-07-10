import './style.css'

// ── Cursor Glow ───────────────────────────────────────────
const glow = document.getElementById('cursor-glow');
if (glow) {
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ── Header: Scroll State ──────────────────────────────────
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Mobile Menu Toggle ────────────────────────────────────
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn && header) {
  const icon = mobileMenuBtn.querySelector('i');
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    if (icon) {
      icon.classList.remove(isOpen ? 'hgi-menu-01' : 'hgi-cancel-01');
      icon.classList.add(isOpen ? 'hgi-cancel-01' : 'hgi-menu-01');
    }
  });
}

// ── Video Modal ───────────────────────────────────────────
const modal    = document.getElementById('video-modal');
const playBtn  = document.getElementById('play-btn');
const videoCard = document.getElementById('video-card');
const closeBtn = document.getElementById('modal-close');
const backdrop = document.getElementById('modal-backdrop');

function openModal() {
  modal?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal?.classList.remove('open');
  document.body.style.overflow = '';
  // Pause any playing video
  const vid = modal?.querySelector('video');
  if (vid) { vid.pause(); vid.currentTime = 0; }
}

playBtn?.addEventListener('click', openModal);
videoCard?.addEventListener('click', e => {
  if (e.target === playBtn || playBtn?.contains(e.target)) return;
  openModal();
});
closeBtn?.addEventListener('click', closeModal);
backdrop?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// ── Fade-Up Intersection Observer ────────────────────────
const io = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '0px', threshold: 0.1 }
);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
  initCounters();
});

// ── Animated Number Counters ──────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || (target === 100 ? '%' : target === 4 ? '' : '+');
        const duration = 1600;
        const start  = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out quart
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => counterObserver.observe(el));
}
