/* ══════════════════════════════════════════════════════
   LAGNA VASTRA — Image Lightbox for Collection Pages
══════════════════════════════════════════════════════ */
(function () {
  // Build lightbox DOM
  const backdrop = document.createElement('div');
  backdrop.className = 'img-lb-backdrop';
  backdrop.id = 'img-lb-backdrop';

  const lb = document.createElement('div');
  lb.className = 'img-lightbox';
  lb.id = 'img-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');

  lb.innerHTML = `
    <div class="img-lb-wrap">
      <img src="" alt="" class="img-lb-img" id="img-lb-img" />
      <p class="img-lb-caption" id="img-lb-caption"></p>
    </div>
  `;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'img-lb-close';
  closeBtn.id = 'img-lb-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '✕';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'img-lb-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#8592;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'img-lb-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#8594;';

  const counter = document.createElement('div');
  counter.className = 'img-lb-counter';
  counter.id = 'img-lb-counter';

  document.body.appendChild(backdrop);
  document.body.appendChild(lb);
  document.body.appendChild(closeBtn);
  document.body.appendChild(prevBtn);
  document.body.appendChild(nextBtn);
  document.body.appendChild(counter);

  // Collect all product images
  let images = [];
  let currentIdx = 0;

  const buildImageList = () => {
    images = [];
    document.querySelectorAll('.pc-img-wrap').forEach((wrap, i) => {
      const img = wrap.querySelector('.pc-img');
      const nameEl = wrap.closest('.product-card')?.querySelector('.pc-name');
      const catEl = wrap.closest('.product-card')?.querySelector('.pc-category');
      if (img) {
        images.push({
          src: img.src,
          alt: img.alt || '',
          caption: (catEl ? catEl.textContent.trim() + ' — ' : '') + (nameEl ? nameEl.textContent.trim() : ''),
          index: i
        });
        wrap.dataset.lbIndex = i;
      }
    });
  };

  const openLightbox = (idx) => {
    currentIdx = idx;
    const d = images[idx];
    if (!d) return;
    document.getElementById('img-lb-img').src = d.src;
    document.getElementById('img-lb-img').alt = d.alt;
    document.getElementById('img-lb-caption').textContent = d.caption;
    document.getElementById('img-lb-counter').textContent = `${idx + 1} / ${images.length}`;
    lb.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lb.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  const showPrev = () => {
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    openLightbox(currentIdx);
  };

  const showNext = () => {
    currentIdx = (currentIdx + 1) % images.length;
    openLightbox(currentIdx);
  };

  // Event listeners
  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Touch swipe support
  let touchStartX = 0;
  lb.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
  });

  // Attach click to all product image wraps
  document.addEventListener('DOMContentLoaded', () => {
    buildImageList();
    document.querySelectorAll('.pc-img-wrap').forEach((wrap) => {
      wrap.addEventListener('click', () => {
        const idx = parseInt(wrap.dataset.lbIndex, 10);
        openLightbox(idx);
      });
    });
  });

  // Re-build if filter changes (cards shown/hidden)
  document.querySelectorAll('.ftab').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(buildImageList, 50);
    });
  });

})();
