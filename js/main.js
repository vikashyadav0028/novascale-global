/**
 * VDigitalverse - Unified Vanilla Client Animation & Interaction Engine
 * Ultra-lightweight (< 5KB), zero dependencies, 60fps performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    if (!progressBar) return;
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }

  // 3. Navbar Shrink & Glass Enhancement on Scroll
  const navbar = document.querySelector('header');
  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 25) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNavbar();
  }, { passive: true });
  updateScrollProgress();
  updateNavbar();

  // 4. Mobile Menu Drawer Controls
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');

  function openMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('translate-x-full');
      if (mobileBackdrop) mobileBackdrop.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('translate-x-full');
      if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', openMobileMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('#mobile-drawer a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // 5. IntersectionObserver Scroll Reveal System
  const revealElements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 6. Smooth Animated Count-Up Counters
  const counterElements = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
  } else {
    counterElements.forEach(el => animateCounter(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    function updateNumber(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = (easeOut * target).toFixed(decimals);
      
      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    }

    requestAnimationFrame(updateNumber);
  }

  // 7. Interactive Before / After Smile Comparison Slider (CarePlus Dental)
  document.querySelectorAll('.before-after-wrapper').forEach(wrapper => {
    const afterOverlay = wrapper.querySelector('.before-after-after');
    const handle = wrapper.querySelector('.before-after-handle');
    const afterImg = afterOverlay ? afterOverlay.querySelector('img') : null;
    if (!afterOverlay || !handle) return;

    function syncImgWidth() {
      if (afterImg) {
        afterImg.style.width = wrapper.offsetWidth + 'px';
        afterImg.style.maxWidth = wrapper.offsetWidth + 'px';
      }
    }
    syncImgWidth();
    window.addEventListener('resize', syncImgWidth);

    let isDown = false;

    function setSliderPos(x) {
      syncImgWidth();
      const rect = wrapper.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(5, Math.min(95, percent));
      afterOverlay.style.width = percent + '%';
      handle.style.left = percent + '%';
    }

    wrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      setSliderPos(e.clientX);
    });

    window.addEventListener('mouseup', () => { isDown = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      setSliderPos(e.clientX);
    });

    wrapper.addEventListener('touchstart', (e) => {
      isDown = true;
      if (e.touches[0]) setSliderPos(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { isDown = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      if (e.touches[0]) setSliderPos(e.touches[0].clientX);
    }, { passive: true });
  });

  // 8. Interactive Lookbook Lightbox Modal (Luxe Aura Salon)
  const lightboxModal = document.getElementById('lookbook-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightbox = document.getElementById('close-lightbox');

  document.querySelectorAll('[data-lightbox]').forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      e.preventDefault();
      const fullSrc = thumb.getAttribute('data-lightbox-src') || thumb.getAttribute('href');
      const caption = thumb.getAttribute('data-caption') || '';
      if (lightboxModal && lightboxImg) {
        lightboxImg.src = fullSrc;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightboxModal.classList.remove('hidden');
        lightboxModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeLightbox && lightboxModal) {
    closeLightbox.addEventListener('click', () => {
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.add('hidden');
        lightboxModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // 9. Interactive Real Estate Filter Bar (PrimeAcre)
  const filterBtns = document.querySelectorAll('.property-filter-btn');
  const propertyCards = document.querySelectorAll('.property-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'active-filter');
        b.classList.add('bg-slate-900', 'text-slate-300');
      });
      btn.classList.add('bg-amber-500', 'text-slate-950', 'active-filter');
      btn.classList.remove('bg-slate-900', 'text-slate-300');

      const filter = btn.getAttribute('data-filter');
      propertyCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
});
