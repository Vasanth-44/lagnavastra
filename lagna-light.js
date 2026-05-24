/* Lagna Vastra — Light Luxury JS */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar ─────────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 60);
  }, { passive: true });

  /* ── Hero Ken Burns ─────────────────────────────── */
  const heroWrap = document.querySelector('.hero-img-wrap');
  if (heroWrap) setTimeout(() => heroWrap.classList.add('zoomed'), 100);

  /* ── Hero Parallax ──────────────────────────────── */
  const heroEl = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroWrap && y < window.innerHeight) {
      heroWrap.style.transform = `translateY(${y * 0.14}px) scale(1)`;
    }
  }, { passive: true });

  /* ── Mobile Burger ──────────────────────────────── */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-mobile-link').forEach(l => {
    l.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Scroll Reveal ──────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => observer.observe(el));

  /* ── Stat counters ──────────────────────────────── */
  const counters = { '500+': 500, '12': 12, '100%': 100 };
  const suffixes  = { '500+': '+', '12': '', '100%': '%' };
  document.querySelectorAll('.craft-stat-n').forEach(el => {
    const raw = el.textContent.trim();
    const end = counters[raw]; if (!end) return;
    const sfx = suffixes[raw];
    const co = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      let cur = 0; const step = end / (1600 / 16);
      const tick = () => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur) + sfx;
        if (cur < end) requestAnimationFrame(tick);
      };
      tick(); co.unobserve(el);
    }, { threshold: 0.6 });
    co.observe(el);
  });

  /* ── Strip pause on hover ───────────────────────── */
  const stripTrack = document.querySelector('.strip-track');
  if (stripTrack) {
    stripTrack.parentElement.addEventListener('mouseenter', () => stripTrack.style.animationPlayState = 'paused');
    stripTrack.parentElement.addEventListener('mouseleave', () => stripTrack.style.animationPlayState = 'running');
  }

  /* ── Booking form ───────────────────────────────── */
  const submitBtn = document.getElementById('booking-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name  = document.getElementById('b-name')?.value.trim();
      const email = document.getElementById('b-email')?.value.trim();
      if (!name || !email) {
        submitBtn.textContent = 'Please fill required fields';
        submitBtn.style.background = 'rgba(255,100,100,0.7)';
        setTimeout(() => {
          submitBtn.innerHTML = 'Request Appointment <span class="btn-arr">→</span>';
          submitBtn.style.background = '';
        }, 2500);
        return;
      }
      submitBtn.innerHTML = '✓ Request Received — We\'ll be in touch!';
      submitBtn.style.background = 'rgba(100,180,100,0.8)';
      submitBtn.style.letterSpacing = '0.1em';
    });
  }

  /* ── Luxury card 3D tilt (desktop) ─────────────── */
  if (window.innerWidth > 900) {
    document.querySelectorAll('.gc-card, .acc-card, .lb-item').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const cx = r.width / 2, cy = r.height / 2;
        const rx = -((y - cy) / cy) * 3;
        const ry = ((x - cx) / cx) * 3;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
        card.style.transition = 'transform 0.12s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.19,1,0.22,1), box-shadow 0.5s ease';
      });
    });
  }

  /* ── Cursor gold glow ───────────────────────────── */
  if (window.innerWidth > 900) {
    const glow = document.createElement('div');
    Object.assign(glow.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '9999',
      width: '320px', height: '320px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(184,146,74,0.07) 0%, transparent 70%)',
      transform: 'translate(-50%,-50%)', mixBlendMode: 'multiply',
    });
    document.body.appendChild(glow);
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const animGlow = () => {
      gx += (mx - gx) * 0.07; gy += (my - gy) * 0.07;
      glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
      requestAnimationFrame(animGlow);
    };
    animGlow();
  }

  /* ── Smooth hash scroll ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ── Page load fade ─────────────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => { document.body.style.opacity = '1'; });

});
