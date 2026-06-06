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

  /* ── Mega menu — hover + click support ─────────── */
  const positionMegaMenus = () => {
    if (!siteHeader) return;
    const bottom = siteHeader.getBoundingClientRect().bottom;
    document.querySelectorAll('.mega-menu').forEach(menu => {
      menu.style.top = bottom + 'px';
    });
  };
  positionMegaMenus();
  window.addEventListener('scroll', positionMegaMenus, { passive: true });
  window.addEventListener('resize', positionMegaMenus);

  // Click to toggle mega menu (mobile + desktop)
  document.querySelectorAll('.hn-item').forEach(item => {
    const link = item.querySelector('.hn-has-arrow');
    const menu = item.querySelector('.mega-menu');
    if (!link || !menu) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = menu.classList.contains('open');
      // Close all others
      document.querySelectorAll('.mega-menu.open').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.hn-item.menu-open').forEach(i => i.classList.remove('menu-open'));
      if (!isOpen) {
        menu.classList.add('open');
        item.classList.add('menu-open');
        positionMegaMenus();
      }
    });
  });

  // Close mega menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hn-item')) {
      document.querySelectorAll('.mega-menu.open').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.hn-item.menu-open').forEach(i => i.classList.remove('menu-open'));
    }
  });

  /* ── Collections mega menu image preview ────────── */
  document.querySelectorAll('.mega-link[data-preview]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const img = document.getElementById('mega-preview-img');
      const discoverLink = document.getElementById('mega-discover-link');
      if (img) img.src = link.dataset.preview;
      if (discoverLink && link.dataset.href) discoverLink.href = link.dataset.href;
    });
  });

  /* ── Hero Video — Mute toggle ───────────────────── */
  const heroVideo   = document.querySelector('.hero-video');
  const muteBtn     = document.getElementById('hero-mute-btn');
  const iconMuted   = muteBtn?.querySelector('.icon-muted');
  const iconUnmuted = muteBtn?.querySelector('.icon-unmuted');

  if (heroVideo && muteBtn) {
    muteBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      iconMuted.style.display   = heroVideo.muted ? '' : 'none';
      iconUnmuted.style.display = heroVideo.muted ? 'none' : '';
    });
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
      if (window.history.state !== 'menu-open') {
        window.history.pushState('menu-open', '');
      }
    };
    const closeMenu = (fromPopstate = false) => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      if (!fromPopstate && window.history.state === 'menu-open') {
        window.history.back();
      }
    };
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu(false) : openMenu();
    });
    if (mobileClose) mobileClose.addEventListener('click', () => closeMenu(false));
    document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => closeMenu(false)));

    window.addEventListener('popstate', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMenu(true);
      }
    });
  }

  /* ── Collections horizontal scroll ─────────────── */
  const colTrack = document.getElementById('collections-track');
  const colPrev = document.getElementById('scroll-prev');
  const colNext = document.getElementById('scroll-next');

  if (colTrack && colPrev && colNext) {
    const CARD_W = 382;
    colNext.addEventListener('click', () => colTrack.scrollBy({ left: CARD_W, behavior: 'smooth' }));
    colPrev.addEventListener('click', () => colTrack.scrollBy({ left: -CARD_W, behavior: 'smooth' }));

    let isDown = false, startX = 0, scrollLeft = 0;
    colTrack.addEventListener('mousedown', e => {
      isDown = true; colTrack.style.cursor = 'grabbing';
      startX = e.pageX - colTrack.offsetLeft; scrollLeft = colTrack.scrollLeft;
    });
    colTrack.addEventListener('mouseleave', () => { isDown = false; colTrack.style.cursor = 'grab'; });
    colTrack.addEventListener('mouseup', () => { isDown = false; colTrack.style.cursor = 'grab'; });
    colTrack.addEventListener('mousemove', e => {
      if (!isDown) return; e.preventDefault();
      colTrack.scrollLeft = scrollLeft - (e.pageX - colTrack.offsetLeft - startX) * 1.2;
    });

    const updateArrows = () => {
      colPrev.style.opacity = colTrack.scrollLeft <= 10 ? '0.4' : '1';
      colNext.style.opacity = colTrack.scrollLeft >= colTrack.scrollWidth - colTrack.clientWidth - 10 ? '0.4' : '1';
    };
    colTrack.addEventListener('scroll', updateArrows, { passive: true });
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

  /* ── Image Stack + Review nav — synced ──────────── */
  const imgStack   = document.getElementById('testi-img-stack');
  const reviewItems = document.querySelectorAll('.testi-review-item');
  const trnPrev    = document.getElementById('trn-prev');
  const trnNext    = document.getElementById('trn-next');
  const trnCounter = document.getElementById('trn-counter');
  const total      = reviewItems.length;
  let   current    = 0;
  let   animating  = false;
  let   autoTimer  = null;

  // Update the review text panel
  const showReview = (idx) => {
    reviewItems.forEach(r => r.classList.remove('active'));
    reviewItems[idx].classList.add('active');
    if (trnCounter) trnCounter.textContent = `${idx + 1} / ${total}`;
  };

  // Re-apply depth (data-si) based on current order of DOM children
  const reapplyDepth = () => {
    const cards = imgStack ? Array.from(imgStack.querySelectorAll('.tsi-card')) : [];
    // last card in DOM = top of visual stack (si=0)
    cards.forEach((card, i) => {
      card.dataset.si = cards.length - 1 - i;
    });
  };

  // Slide the top card out to the right, then move it to the bottom
  const slideNext = () => {
    if (!imgStack || animating) return;
    const cards = Array.from(imgStack.querySelectorAll('.tsi-card'));
    const topCard = cards[cards.length - 1]; // last in DOM = visually on top
    if (!topCard) return;

    animating = true;
    topCard.classList.add('slide-out');

    setTimeout(() => {
      topCard.classList.remove('slide-out');
      topCard.classList.add('no-transition');
      // Move to bottom of stack (first in DOM)
      imgStack.insertBefore(topCard, imgStack.firstChild);
      reapplyDepth();
      // Force reflow, then remove no-transition
      void topCard.offsetWidth;
      topCard.classList.remove('no-transition');
      animating = false;
    }, 550);
  };

  // Slide the bottom card back to the top (prev direction)
  const slidePrev = () => {
    if (!imgStack || animating) return;
    const cards = Array.from(imgStack.querySelectorAll('.tsi-card'));
    const bottomCard = cards[0]; // first in DOM = visually at bottom
    if (!bottomCard) return;

    animating = true;
    // Instantly move it to top position (no animation), then let it settle
    bottomCard.classList.add('no-transition');
    bottomCard.style.transform = 'translateX(-130%) rotate(-12deg)';
    bottomCard.style.opacity   = '0';
    bottomCard.style.zIndex    = '10';
    imgStack.appendChild(bottomCard); // move to end of DOM = top of stack
    reapplyDepth();
    void bottomCard.offsetWidth;
    bottomCard.classList.remove('no-transition');
    bottomCard.style.transform = '';
    bottomCard.style.opacity   = '';
    bottomCard.style.zIndex    = '';
    animating = false;
  };

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      current = (current + 1) % total;
      slideNext();
      showReview(current);
    }, 4000);
  };

  if (imgStack && reviewItems.length) {
    reapplyDepth();
    showReview(0);

    // Click top card = next
    imgStack.addEventListener('click', () => {
      clearInterval(autoTimer);
      current = (current + 1) % total;
      slideNext();
      showReview(current);
      startAuto();
    });

    // Nav buttons
    if (trnNext) trnNext.addEventListener('click', () => {
      clearInterval(autoTimer);
      current = (current + 1) % total;
      slideNext();
      showReview(current);
      startAuto();
    });
    if (trnPrev) trnPrev.addEventListener('click', () => {
      clearInterval(autoTimer);
      current = (current - 1 + total) % total;
      slidePrev();
      showReview(current);
      startAuto();
    });

    startAuto();
  }

  /* ── "Complete Your Look" popup ─────────────────── */
  const popup = document.getElementById('cyl-popup');
  const popupClose = document.getElementById('cyl-popup-close');
  const popupTitle = document.getElementById('cyl-popup-title');
  const popupBody = document.getElementById('cyl-popup-body');
  const popupBtn = document.getElementById('cyl-popup-btn');

  if (popup) {
    const cylData = {
      indo: { title: 'Complete the Indo-Western Look', body: 'Complete the Silhouette with the Regal Footwear Suite — Handcrafted Loafers recommended for the Avant-Garde Ensemble.', link: 'collection-footwear.html' },
      sherwani: { title: 'Complete the Sherwani Look', body: 'Elevate the Imperial Ensemble with the Royal Pagdi Collective and Royal Jewellery Suite.', link: 'collection-pagdi.html' },
      bandhgala: { title: 'Complete the Bandhgala Look', body: 'Complete the Sovereign Reception Ensemble with Sleek Mojris from the Regal Footwear Suite.', link: 'collection-footwear.html' },
      waistcoat: { title: 'Complete the Waistcoat Look', body: 'Add the Royal Jewellery Suite to elevate the Festive Co-ord Set.', link: 'collection-jewellery.html' },
      kurta: { title: 'Complete the Kurta Look', body: 'Pair the Classic Ritual Set with handcrafted Mojris from the Regal Footwear Suite for a timeless finish.', link: 'collection-footwear.html' },
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

  /* ── Contact form — Handled in appointment-form.js ── */


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
