/* ============================================================
   MILLION DESIRE — Global JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky Navigation ── */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active Nav Link ── */
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll Reveal (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Animated Number Counter ── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal ? (target * eased).toFixed(1) : Math.floor(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ── Testimonial Slider ── */
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let autoSlide;

  function goToSlide(index) {
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    const visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const max = Math.max(0, cards.length - visibleCount);
    currentSlide = Math.max(0, Math.min(index, max));
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 28;
    track.style.transform = `translateX(-${currentSlide * (cardWidth + gap)}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    clearInterval(autoSlide);
    goToSlide(i);
  }));

  if (track) {
    autoSlide = setInterval(() => {
      const cards = track.querySelectorAll('.testimonial-card');
      const visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      const max = cards.length - visibleCount;
      goToSlide(currentSlide >= max ? 0 : currentSlide + 1);
    }, 4000);
    goToSlide(0);

    /* ── Touch / Swipe support ── */
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) { // at least 40px swipe
        clearInterval(autoSlide);
        if (diff > 0) {
          goToSlide(currentSlide + 1); // swipe left → next
        } else {
          goToSlide(currentSlide - 1); // swipe right → prev
        }
      }
    }, { passive: true });
  }

  /* ── Portfolio Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity 0.3s, transform 0.3s';
        item.style.opacity = show ? '1' : '0';
        item.style.transform = show ? 'scale(1)' : 'scale(0.95)';
        item.style.pointerEvents = show ? '' : 'none';
        setTimeout(() => { item.style.display = show ? '' : 'none'; }, 300);
        if (show) { setTimeout(() => { item.style.display = ''; item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50); }
      });
    });
  });

  /* ── Contact Form ── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.querySelector('.form-success');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#ff4d4d';
          valid = false;
          field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
        }
      });
      if (!valid) return;
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      }, 1500);
    });
  }

  /* ── Smooth Scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Services Tab Scroll (services page) ── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Scroll-driven parallax on hero ── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  }

  console.log('%c Million Desire 💎 ', 'background:#c9a84c;color:#000;font-weight:900;font-size:14px;padding:4px 8px;border-radius:4px;');
})();

/* ── Video Testimonials — Inline Playback ── */
window.playVTInline = function (card) {
  const frame = card.querySelector('.vt-phone-frame');
  if (!frame) return;

  /* If already playing, do nothing */
  if (frame.querySelector('.vt-inline-iframe')) return;

  /* Append params that suppress YouTube branding / title */
  let videoSrc = card.dataset.video || '';
  const extraParams = 'modestbranding=1&rel=0&showinfo=0&iv_load_policy=3';
  videoSrc += (videoSrc.includes('?') ? '&' : '?') + extraParams;

  /* Build iframe */
  const iframe = document.createElement('iframe');
  iframe.src = videoSrc;
  iframe.className = 'vt-inline-iframe';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'autoplay; fullscreen');
  iframe.setAttribute('allowfullscreen', '');

  /* Title-mask overlay — covers the YouTube title/channel bar at the top */
  const mask = document.createElement('div');
  mask.className = 'vt-title-mask';

  /* Build close button */
  const closeBtn = document.createElement('button');
  closeBtn.className = 'vt-inline-close';
  closeBtn.innerHTML = '&#10005;';
  closeBtn.setAttribute('aria-label', 'Close video');
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    iframe.remove();
    mask.remove();
    closeBtn.remove();
    /* Restore thumbnail visibility */
    frame.querySelectorAll('.vt-thumb, .vt-play-btn, .vt-progress-bar')
      .forEach(function (el) { el.style.display = ''; });
  });

  /* Hide thumbnail elements */
  frame.querySelectorAll('.vt-thumb, .vt-play-btn, .vt-progress-bar')
    .forEach(function (el) { el.style.display = 'none'; });

  frame.appendChild(iframe);
  frame.appendChild(mask);
  frame.appendChild(closeBtn);
};
