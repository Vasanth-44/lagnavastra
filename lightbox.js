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
      <div class="img-lb-views" id="img-lb-views"></div>
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
  lb.appendChild(closeBtn);
  lb.appendChild(prevBtn);
  lb.appendChild(nextBtn);
  lb.appendChild(counter);

  // Collect all product images
  let images = [];
  let currentIdx = 0;

  // Track active views for the currently open card
  let activeViews = [];
  let activeViewIdx = 0;

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
          side: wrap.dataset.sideSrc || '',
          back: wrap.dataset.backSrc || '',
          index: i
        });
        wrap.dataset.lbIndex = i;
      }
    });
  };

  // Touch zoom and swipe logic state
  let zoomScale = 1;
  const zoomMin = 1;
  const zoomMax = 4;
  let isDragging = false;
  let isPinching = false;
  let startX = 0, startY = 0;
  let translateX = 0, translateY = 0;
  let lastTranslateX = 0, lastTranslateY = 0;
  let startDistance = 0;
  let startScale = 1;
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTapTime = 0;

  const updateImageTransform = () => {
    const img = document.getElementById('img-lb-img');
    if (img) {
      img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
      img.style.transition = (isDragging || isPinching) ? 'none' : 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
  };

  const resetZoom = () => {
    zoomScale = 1;
    translateX = 0;
    translateY = 0;
    lastTranslateX = 0;
    lastTranslateY = 0;
    updateImageTransform();
  };

  const openLightbox = (idx) => {
    currentIdx = idx;
    const d = images[idx];
    if (!d) return;
    
    // Build array of available views for this product card
    activeViews = [d.src];
    if (d.side) activeViews.push(d.side);
    if (d.back) activeViews.push(d.back);
    
    activeViewIdx = 0;
    
    const imgEl = document.getElementById('img-lb-img');
    imgEl.src = activeViews[activeViewIdx];
    imgEl.alt = d.alt;
    document.getElementById('img-lb-caption').textContent = d.caption;
    
    // Show/hide navigation arrows and counter based on availability of multiple views
    if (activeViews.length > 1) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
      counter.style.display = 'block';
      counter.textContent = `${activeViewIdx + 1} / ${activeViews.length}`;
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      counter.style.display = 'none';
    }
    
    // Clean up old view container display
    const viewsContainer = document.getElementById('img-lb-views');
    if (viewsContainer) {
      viewsContainer.style.display = 'none';
    }
    
    lb.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    resetZoom();

    // Push history state if not already pushed to handle mobile back button closing the lightbox
    if (window.history.state !== 'lightbox-open') {
      window.history.pushState('lightbox-open', '');
    }
  };

  const closeLightbox = (fromPopstate = false) => {
    lb.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    resetZoom();

    // If closed manually (not from back button), go back in history to clean up the state
    if (!fromPopstate && window.history.state === 'lightbox-open') {
      window.history.back();
    }
  };

  const showPrev = () => {
    if (activeViews.length <= 1) return;
    activeViewIdx = (activeViewIdx - 1 + activeViews.length) % activeViews.length;
    resetZoom();
    const imgEl = document.getElementById('img-lb-img');
    if (imgEl) {
      imgEl.src = activeViews[activeViewIdx];
    }
    counter.textContent = `${activeViewIdx + 1} / ${activeViews.length}`;
  };

  const showNext = () => {
    if (activeViews.length <= 1) return;
    activeViewIdx = (activeViewIdx + 1) % activeViews.length;
    resetZoom();
    const imgEl = document.getElementById('img-lb-img');
    if (imgEl) {
      imgEl.src = activeViews[activeViewIdx];
    }
    counter.textContent = `${activeViewIdx + 1} / ${activeViews.length}`;
  };

  // Event listeners
  closeBtn.addEventListener('click', () => closeLightbox(false));
  backdrop.addEventListener('click', () => closeLightbox(false));
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox(false);
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  window.addEventListener('popstate', (e) => {
    if (lb.classList.contains('open')) {
      closeLightbox(true);
    }
  });

  // Touch and Gesture Listeners
  lb.addEventListener('touchstart', (e) => {
    const now = Date.now();
    const tapDelay = 300;
    
    if (e.touches.length === 1) {
      // Double tap check
      if (now - lastTapTime < tapDelay) {
        if (zoomScale > 1) {
          resetZoom();
        } else {
          zoomScale = 2.5;
          translateX = 0;
          translateY = 0;
          lastTranslateX = 0;
          lastTranslateY = 0;
          updateImageTransform();
        }
        e.preventDefault();
        return;
      }
      lastTapTime = now;
      
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      
      if (zoomScale > 1) {
        isDragging = true;
        startX = e.touches[0].clientX - lastTranslateX;
        startY = e.touches[0].clientY - lastTranslateY;
      }
    } else if (e.touches.length === 2) {
      isPinching = true;
      isDragging = false;
      startDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      startScale = zoomScale;
    }
  }, { passive: false });

  lb.addEventListener('touchmove', (e) => {
    if (isPinching && e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      zoomScale = (dist / startDistance) * startScale;
      zoomScale = Math.max(zoomMin, Math.min(zoomScale, zoomMax));
      updateImageTransform();
    } else if (isDragging && e.touches.length === 1 && !isPinching) {
      e.preventDefault();
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      
      // Clamp boundaries based on scale
      const maxTranslateX = (zoomScale - 1) * window.innerWidth / 2;
      const maxTranslateY = (zoomScale - 1) * window.innerHeight / 2;
      translateX = Math.max(-maxTranslateX, Math.min(translateX, maxTranslateX));
      translateY = Math.max(-maxTranslateY, Math.min(translateY, maxTranslateY));
      updateImageTransform();
    }
  }, { passive: false });

  lb.addEventListener('touchend', (e) => {
    if (isPinching) {
      if (e.touches.length < 2) {
        isPinching = false;
        lastTranslateX = translateX;
        lastTranslateY = translateY;
        if (zoomScale < 1.05) {
          resetZoom();
        }
      }
    } else if (isDragging) {
      isDragging = false;
      lastTranslateX = translateX;
      lastTranslateY = translateY;
    } else {
      // Swipe navigation when not zoomed or pinching
      if (zoomScale === 1 && e.touches.length === 0 && e.changedTouches.length === 1) {
        const diffX = touchStartX - e.changedTouches[0].clientX;
        const diffY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diffX) > 50 && Math.abs(diffY) < 100) {
          if (diffX > 0) {
            showNext();
          } else {
            showPrev();
          }
        }
      }
    }
  }, { passive: true });

  lb.addEventListener('touchcancel', () => {
    isDragging = false;
    isPinching = false;
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
