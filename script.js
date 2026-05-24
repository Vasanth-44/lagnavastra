/* ══════════════════════════════════════════════════════
   LAGNA VASTRA — script.js
   Human-first interactions, no AI fluff
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll shadow ───────────────────────── */
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Mega menu positioning ──────────────────────── */
  // Position mega menus below the nav row
  const hnItems = document.querySelectorAll('.hn-item');
  const headerNav = document.getElementById('header-nav');

  const positionMegaMenus = () => {
    if (!headerNav) return;
    const navBottom = headerNav.getBoundingClientRect().bottom + window.scrollY;
    document.querySelectorAll('.mega-menu').forEach(menu => {
      menu.style.top = (headerNav.getBoundingClientRect().bottom) + 'px';
    });
  };

  positionMegaMenus();
  window.addEventListener('scroll', positionMegaMenus, { passive: true });
  window.addEventListener('resize', positionMegaMenus);

  /* ── Active nav item highlight ──────────────────── */
  hnItems.forEach(item => {
    item.addEventListener('mouseenter', () => item.classList.add('active'));
    item.addEventListener('mouseleave', () => item.classList.remove('active'));
  });

  /* ── Hero image ken burns ───────────────────────── */
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    const trigger = () => heroImg.classList.add('loaded');
    heroImg.complete ? trigger() : heroImg.addEventListener('load', trigger);
  }

  /* ── Mobile menu ────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  if (hamburger && mobileMenu) {
    const openMenu = () => {
      hamburger.classList.add('open');
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    };
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMenu));
  }

  /* ── Collections horizontal scroll ─────────────── */
  const track = document.getElementById('collections-track');
  const prevBtn = document.getElementById('scroll-prev');
  const nextBtn = document.getElementById('scroll-next');

  if (track && prevBtn && nextBtn) {
    const CARD_W = 382;
    nextBtn.addEventListener('click', () => track.scrollBy({ left: CARD_W, behavior: 'smooth' }));
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -CARD_W, behavior: 'smooth' }));

    let isDown = false, startX = 0, scrollLeft = 0;
    track.addEventListener('mousedown', e => {
      isDown = true; track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', e => {
      if (!isDown) return; e.preventDefault();
      track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.2;
    });

    const updateArrows = () => {
      prevBtn.style.opacity = track.scrollLeft <= 10 ? '0.4' : '1';
      nextBtn.style.opacity = track.scrollLeft >= track.scrollWidth - track.clientWidth - 10 ? '0.4' : '1';
    };
    track.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
  }

  /* ── Scroll reveal ──────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  const revealSelectors = [
    '.bs-inner', '.section-header',
    '.col-card', '.ens-card', '.acc-card',
    '.lw-text', '.lw-visual',
    '.atelier-text', '.atelier-img-wrap',
    '.contact-text', '.contact-form-wrap',
    '.footer-logo-wrap', '.footer-nav',
    '.stat-item', '.lw-option',
  ];
  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i > 0 && i <= 3) el.classList.add(`reveal-delay-${i}`);
      revealObserver.observe(el);
    });
  });

  /* ── Stat counter ───────────────────────────────── */
  const statMap = { '500+': [500, '+'], '100%': [100, '%'], '12+': [12, '+'] };
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const cfg = statMap[raw];
      if (!cfg) return;
      let cur = 0;
      const [end, suffix] = cfg;
      const step = end / 60;
      const tick = () => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur) + suffix;
        if (cur < end) requestAnimationFrame(tick);
      };
      tick();
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-n').forEach(el => countObserver.observe(el));

  /* ── "Complete Your Look" popup ─────────────────── */
  const popup = document.getElementById('cyl-popup');
  const popupClose = document.getElementById('cyl-popup-close');
  const popupTitle = document.getElementById('cyl-popup-title');
  const popupBody = document.getElementById('cyl-popup-body');
  const popupBtn = document.getElementById('cyl-popup-btn');

  if (popup) {
    const cylData = {
      indo: { title: 'Complete the Indo-Western Look', body: 'Complete the Silhouette with the Regal Footwear Suite — Handcrafted Loafers recommended for the Avant-Garde Ensemble.', link: '#footwear' },
      sherwani: { title: 'Complete the Sherwani Look', body: 'Elevate the Imperial Ensemble with the Royal Pagdi Collective and Imperial Kanduva — both included in the 4-Piece Set.', link: '#pagdi' },
      bandhgala: { title: 'Complete the Bandhgala Look', body: 'Complete the Sovereign Reception Ensemble with Sleek Mojris from the Regal Footwear Suite.', link: '#footwear' },
      waistcoat: { title: 'Complete the Waistcoat Look', body: 'Add the Imperial Kanduva as a ceremonial stole to elevate the Festive Co-ord Set.', link: '#kanduva' },
      kurta: { title: 'Complete the Kurta Look', body: 'Pair the Classic Ritual Set with handcrafted Mojris from the Regal Footwear Suite for a timeless finish.', link: '#footwear' },
    };
    let popupTimer = null;
    const showPopup = (key) => {
      const d = cylData[key]; if (!d) return;
      popupTitle.textContent = d.title;
      popupBody.textContent = d.body;
      popupBtn.href = d.link;
      popup.classList.add('visible');
      clearTimeout(popupTimer);
      popupTimer = setTimeout(() => popup.classList.remove('visible'), 8000);
    };
    popupClose.addEventListener('click', () => { popup.classList.remove('visible'); clearTimeout(popupTimer); });
    const ensObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const key = entry.target.dataset.ensemble;
          if (key) { setTimeout(() => showPopup(key), 600); ensObserver.unobserve(entry.target); }
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.ens-card').forEach(c => ensObserver.observe(c));
  }

  /* ── Contact form ───────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const orig = btn.textContent;
      btn.textContent = 'Enquiry Sent ✓';
      btn.style.background = '#5a8a5a';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; form.reset(); }, 4000);
    });
  }

  /* ── Smooth anchor scroll ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = siteHeader ? siteHeader.offsetHeight : 120;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH - 16, behavior: 'smooth' });
      }
    });
  });

  /* ── Page fade in ───────────────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => { document.body.style.opacity = '1'; });

});
