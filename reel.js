// ==========================================================
// CINEMATIC DEVELOPER PORTFOLIO REEL ENGINE
// Creative Motion, Particles, 3D Tilt, Magnetic UI & Modals
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Visual & Interactive Systems
  initAmbientCanvas();
  initCursorSpotlight();
  initMagneticButtons();
  initActiveNav();
  init3DTilt();
  initScrollReveals();
  initMobileMenu();
  initContactForm();
  initCinematicAnimations();
});

// 1. Ambient Celestial Particle Canvas
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Reduced motion preference check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numParticles = Math.min(Math.floor((width * height) / 28000), 55);
  const colors = [
    'rgba(0, 240, 255, 0.75)',    // Electric Cyan
    'rgba(168, 85, 247, 0.75)',   // Neon Violet
    'rgba(59, 130, 246, 0.75)',   // Electric Blue
    'rgba(223, 177, 91, 0.85)'    // Metallic Gold
  ];

  const particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      baseAlpha: Math.random() * 0.5 + 0.3
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse repulsion/interaction
      const dxm = mouseX - p.x;
      const dym = mouseY - p.y;
      const distM = Math.sqrt(dxm * dxm + dym * dym);
      if (distM < 120 && distM > 0) {
        p.x -= (dxm / distM) * 0.8;
        p.y -= (dym / distM) * 0.8;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect near neighbors
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.16;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// 2. Cursor Spotlight with Smooth Interpolation
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursorSpotlight');
  if (!spotlight) return;

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function update() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// 3. Magnetic Buttons for High-End Tactile Feel
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.hero-btn-primary, .hero-btn-outline, .btn-magnetic');
  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// 4. Active Navigation Indicator
function initActiveNav() {
  const sections = document.querySelectorAll('header[id], section[id]');
  const navLinks = document.querySelectorAll('#navbar a[href^="#"], #mobileNav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

// 5. 3D Perspective Tilt on Mouse Movement
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.tilt');
  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// 6. Native Scroll Reveal Observer (Guaranteed Baseline Fallback)
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal3d, .curtain');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    },
    { threshold: 0.12 }
  );
  revealElements.forEach((el) => observer.observe(el));

  // Dynamic Sticky Navigation Bar Blur
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('bg-background/90', 'backdrop-blur-md', 'border-b', 'border-border/60');
      } else {
        nav.classList.remove('bg-background/90', 'backdrop-blur-md', 'border-b', 'border-border/60');
      }
    });
  }
}

// 7. Mobile Menu Drawer Toggle
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// 8. Contact Form Mailto Generator
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const name = fd.get('name');
    const email = fd.get('email');
    const subject = fd.get('subject');
    const message = fd.get('message');
    const body = `From: ${name} (${email})\n\n${message}`;
    const mailto = `mailto:rukshanaroshan.it@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    const btn = contactForm.querySelector('button');
    if (btn) btn.textContent = 'Opening your email client ✓';
    setTimeout(() => {
      if (btn) btn.textContent = 'Send message →';
    }, 4000);
  });
}

// 9. GSAP Cinematic Entrance Timelines (Natural Native Scrolling)
function initCinematicAnimations() {
  // GSAP Entrance & Stagger if loaded (no scroll hijacking)
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-eyebrow', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 })
      .from('.hero-title-main', { opacity: 0, y: 30, duration: 1 }, '-=0.5')
      .from('.hero-lead-text', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
      .from('.hero-buttons a', { opacity: 0, y: 15, stagger: 0.1, duration: 0.7 }, '-=0.5')
      .from('.cinema-poster-wrap', { opacity: 0, scale: 0.95, duration: 1 }, '-=0.8')
      .from('.floating-tech-badge', { opacity: 0, scale: 0.7, stagger: 0.12, duration: 0.7 }, '-=0.5')
      .from('.hero-scroll-indicator', { opacity: 0, y: -10, duration: 0.8 }, '-=0.3');
  }

  // Easy horizontal scrolling on filmstrip when hovering with mouse wheel
  const strip = document.getElementById('filmstripTrack');
  if (strip) {
    strip.addEventListener('wheel', (e) => {
      // If user is actively wheeling horizontally or holding shift, scroll smoothly
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        strip.scrollLeft += e.deltaX;
      }
    }, { passive: true });
  }
}

// 10. Horizontal Filmstrip Reel Scrolling Buttons
function scrollReel(direction) {
  const strip = document.getElementById('filmstripTrack');
  if (strip) {
    strip.scrollBy({ left: direction * (strip.clientWidth * 0.75), behavior: 'smooth' });
  }
}

// 11. Interactive Project Reel Filtering
function filterProjects(category) {
  document.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === category);
  });
  const cards = document.querySelectorAll('.project-reel-card');
  let visibleCount = 0;
  cards.forEach((card) => {
    const cardCats = (card.dataset.category || '').split(' ');
    if (category === 'all' || cardCats.includes(category)) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  const counter = document.getElementById('reelCounter');
  if (counter) {
    counter.textContent = `${visibleCount} titles · scroll the reel`;
  }
}

// 12. Full-Resolution Certificate & Architecture Lightbox Modal
function openCertModal(imageSrc, title, subtitle) {
  const modal = document.getElementById('certModal');
  const img = document.getElementById('certModalImg');
  const titleEl = document.getElementById('certModalTitle');
  const subEl = document.getElementById('certModalSub');
  if (img) img.src = imageSrc;
  if (titleEl) titleEl.textContent = title || '';
  if (subEl) subEl.textContent = subtitle || '';
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  const modal = document.getElementById('certModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCertModal();
  }
});
