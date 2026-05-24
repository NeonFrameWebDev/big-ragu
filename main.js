/* main.js -- Big Ragu's spec site
   Handles: loader, nav scroll state, hamburger menu, menu tabs,
            lightbox, scroll reveal animations.
   ES modules. No external dependencies.
*/

/* ================================
   LOADER
   ================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.classList.add('loading');

  // Loader runs 1.2s then fades out over 0.4s
  setTimeout(() => {
    loader.classList.add('fade-out');
    loader.addEventListener('animationend', () => {
      loader.hidden = true;
      document.body.classList.remove('loading');
    }, { once: true });
  }, 1200);
})();


/* ================================
   NAV -- scroll state + hamburger
   ================================ */
(function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuClose = document.getElementById('menuClose');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  // Scroll state
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function openMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (menuClose)  menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
})();


/* ================================
   MENU TABS
   ================================ */
(function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('aria-controls');

      // Deactivate all tabs
      tabs.forEach(t => {
        t.classList.remove('menu-tab--active');
        t.setAttribute('aria-selected', 'false');
      });

      // Hide all panels
      panels.forEach(p => {
        p.classList.remove('menu-panel--active');
        p.hidden = true;
      });

      // Activate clicked tab
      tab.classList.add('menu-tab--active');
      tab.setAttribute('aria-selected', 'true');

      // Show target panel
      const panel = document.getElementById(targetId);
      if (panel) {
        panel.classList.add('menu-panel--active');
        panel.hidden = false;
      }
    });
  });
})();


/* ================================
   LIGHTBOX
   ================================ */
(function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCaption');
  const overlay     = document.getElementById('lightboxOverlay');
  const closeBtn    = document.getElementById('lightboxClose');
  const prevBtn     = document.getElementById('lightboxPrev');
  const nextBtn     = document.getElementById('lightboxNext');

  if (!lightbox) return;

  // Build gallery item list (only real photos, not placeholders)
  const items = Array.from(document.querySelectorAll('.gallery__item[data-src]'));
  let current = 0;
  let touchStartX = 0;

  function open(index) {
    current = index;
    const item = items[current];
    lightboxImg.src = item.getAttribute('data-src');
    lightboxImg.alt = item.querySelector('img')
      ? item.querySelector('img').alt
      : (item.getAttribute('data-caption') || '');
    lightboxCap.textContent = item.getAttribute('data-caption') || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function prev() {
    current = (current - 1 + items.length) % items.length;
    open(current);
  }

  function next() {
    current = (current + 1) % items.length;
    open(current);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  if (closeBtn)  closeBtn.addEventListener('click', close);
  if (overlay)   overlay.addEventListener('click', close);
  if (prevBtn)   prevBtn.addEventListener('click', prev);
  if (nextBtn)   nextBtn.addEventListener('click', next);

  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Swipe support
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) next();
      else prev();
    }
  }, { passive: true });
})();


/* ================================
   SCROLL REVEAL
   ================================ */
(function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
})();
