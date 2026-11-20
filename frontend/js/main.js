/**
 * SNOWTOP SPORTS - MAIN INTERACTION SCRIPT (Vanilla JS)
 */

// Global Trending Carousel Controls (Available immediately)
window.trendingScrollNext = window.trendingScrollNext || function (e) {
  if (e && e.preventDefault) e.preventDefault();
  const track = document.getElementById('trendingProductsTrack');
  if (!track) return;
  const card = track.querySelector('.product-card');
  const step = card ? (card.offsetWidth + 16) : 300;
  const maxScroll = track.scrollWidth - track.clientWidth;
  if (maxScroll > 0 && track.scrollLeft >= maxScroll - 20) {
    track.scrollTo({ left: 0, behavior: 'smooth' });
  } else {
    track.scrollBy({ left: step, behavior: 'smooth' });
  }
};

window.trendingScrollPrev = window.trendingScrollPrev || function (e) {
  if (e && e.preventDefault) e.preventDefault();
  const track = document.getElementById('trendingProductsTrack');
  if (!track) return;
  const card = track.querySelector('.product-card');
  const step = card ? (card.offsetWidth + 16) : 300;
  const maxScroll = track.scrollWidth - track.clientWidth;
  if (track.scrollLeft <= 20 && maxScroll > 0) {
    track.scrollTo({ left: maxScroll, behavior: 'smooth' });
  } else {
    track.scrollBy({ left: -step, behavior: 'smooth' });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Sticky Header & Back to Top
  // ==========================================
  const header = document.querySelector('.main-header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // Mobile Drawer Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeMobileDrawer');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', () => {
    closeDrawer();
    closeCartDrawer();
    closeModals();
  });

  // Cart Drawer Toggle (Disabled on User Storefront)
  const cartTriggerBtns = document.querySelectorAll('.trigger-cart-drawer');
  const cartDrawer = document.getElementById('cartDrawerPanel');
  const closeCartBtn = document.getElementById('closeCartDrawer');

  function openCartDrawer() {
    if (!cartDrawer) return;
    closeDrawer();
    cartDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof CartStore !== 'undefined' && CartStore.renderDrawer) {
      CartStore.renderDrawer();
    }
  }

  function closeCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartTriggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  closeCartBtn?.addEventListener('click', closeCartDrawer);

  // ==========================================
  // Hero 3D Parallax Carousel Engine (Dynamic Multi-Slide Support)
  // ==========================================
  const heroCarousel = document.getElementById('heroCarousel3D') || document.querySelector('.hero-carousel');
  let currentHeroIdx = 0;
  let heroTimer = null;

  function getHeroSlides() {
    return document.querySelectorAll('.hero-carousel .hero-slide');
  }

  function getHeroDots() {
    return document.querySelectorAll('.hero-carousel .hero-dot');
  }

  function showHeroSlide(index) {
    const slides = getHeroSlides();
    const dots = getHeroDots();
    if (slides.length === 0) return;
    currentHeroIdx = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentHeroIdx);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentHeroIdx);
    });

    // When transitioning slide, trigger fresh 360° circle spin on the active slide's athlete
    if (window.triggerTurntableSpin) {
      window.triggerTurntableSpin();
    }
  }

  function nextHeroSlide() {
    showHeroSlide(currentHeroIdx + 1);
  }

  function prevHeroSlide() {
    showHeroSlide(currentHeroIdx - 1);
  }

  function scheduleHeroSlideTransition() {
    clearTimeout(heroTimer);
    if (window._turntablePaused) return;
    const slides = getHeroSlides();
    if (slides.length <= 1) return;

    // Each slide displays for 4.5s with its 360° rotation stage
    const delay = 4500;
    heroTimer = setTimeout(() => {
      nextHeroSlide();
      scheduleHeroSlideTransition();
    }, delay);
  }

  function refreshHeroCarousel() {
    clearTimeout(heroTimer);
    const slides = getHeroSlides();
    const controls = heroCarousel?.querySelector('.hero-controls');
    const dotsWrap = heroCarousel?.querySelector('.hero-dots');

    if (controls) controls.style.display = slides.length > 1 ? 'flex' : 'none';
    if (dotsWrap) dotsWrap.style.display = slides.length > 1 ? 'flex' : 'none';

    // Bind dots click
    const dots = getHeroDots();
    dots.forEach((dot, idx) => {
      dot.onclick = () => {
        showHeroSlide(idx);
        scheduleHeroSlideTransition();
      };
    });

    if (slides.length > 0) {
      showHeroSlide(0);
      if (slides.length > 1) {
        scheduleHeroSlideTransition();
      }
    }
  }

  window.scheduleHeroSlideTransition = scheduleHeroSlideTransition;
  window.nextHeroSlide = nextHeroSlide;
  window.prevHeroSlide = prevHeroSlide;
  window.showHeroSlide = showHeroSlide;
  window.refreshHeroCarousel = refreshHeroCarousel;

  const heroPrev = document.getElementById('heroPrevBtn');
  const heroNext = document.getElementById('heroNextBtn');
  heroNext?.addEventListener('click', (e) => {
    e.preventDefault();
    nextHeroSlide();
    scheduleHeroSlideTransition();
  });
  heroPrev?.addEventListener('click', (e) => {
    e.preventDefault();
    prevHeroSlide();
    scheduleHeroSlideTransition();
  });

  refreshHeroCarousel();

    // ==========================================
    // Real-Time 3D Mouse Parallax Depth Effect
    // ==========================================
    if (heroCarousel) {
      heroCarousel.addEventListener('mousemove', (e) => {
        const rect = heroCarousel.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const activeSlide = heroCarousel.querySelector('.hero-slide.active');
        if (!activeSlide) return;

        const athlete = activeSlide.querySelector('.hero-athlete-img');
        const lineup = activeSlide.querySelector('.hero-lineup-img');
        const content = activeSlide.querySelector('.hero-content');
        const bg = activeSlide.querySelector('.hero-left-bg');

        // Athlete tilts and moves with prominent foreground 3D depth
        if (athlete) {
          const rotY = x * 14; // +/- 7 deg rotation
          const rotX = -y * 8; // +/- 4 deg rotation
          const transX = x * 35; // moves opposite/towards cursor
          const transY = y * 20;
          athlete.style.transform = `perspective(1200px) translate3d(${transX}px, ${transY}px, 110px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
        }

        // Middle-ground Uniforms Lineup floats with intermediate 3D depth
        if (lineup) {
          const transX = x * 22;
          const transY = y * 14;
          const rotY = x * 7;
          lineup.style.transform = `perspective(1000px) translate3d(${transX}px, ${transY}px, 45px) rotateY(${rotY}deg)`;
        }

        // Text content floats smoothly at mid-depth
        if (content) {
          const transX = x * 18;
          const transY = y * 12;
          content.style.transform = `translate3d(${transX}px, ${transY}px, 60px)`;
        }

        // Background moves subtly in deep negative Z-space (parallax depth)
        if (bg) {
          const transX = -x * 25;
          const transY = -y * 15;
          bg.style.transform = `translate3d(${transX}px, ${transY}px, -40px) scale(1.08)`;
        }
      });

      heroCarousel.addEventListener('mouseleave', () => {
        const activeSlide = heroCarousel.querySelector('.hero-slide.active');
        if (!activeSlide) return;

        const athlete = activeSlide.querySelector('.hero-athlete-img');
        const lineup = activeSlide.querySelector('.hero-lineup-img');
        const content = activeSlide.querySelector('.hero-content');
        const bg = activeSlide.querySelector('.hero-left-bg');

        if (athlete) {
          athlete.style.transform = `perspective(1200px) translate3d(0, 0, 100px) rotateY(0deg) rotateX(0deg)`;
          athlete.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          setTimeout(() => { athlete.style.transition = ''; }, 600);
        }
        if (lineup) {
          lineup.style.transform = `perspective(1000px) translate3d(0, 0, 40px) rotateY(0deg)`;
          lineup.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          setTimeout(() => { lineup.style.transition = ''; }, 600);
        }
        if (content) {
          content.style.transform = `translate3d(0, 0, 60px)`;
          content.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          setTimeout(() => { content.style.transition = ''; }, 600);
        }
        if (bg) {
          bg.style.transform = `translate3d(0, 0, -40px) scale(1.08)`;
          bg.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          setTimeout(() => { bg.style.transition = ''; }, 600);
        }
      });
    }

  // ==========================================
  // Hero 3D Turntable Stage (360° Circular Rotating Athlete on Neon Pedestal)
  // ==========================================
  function initHeroTurntable() {
    const stages = document.querySelectorAll('.hero-turntable-stage');
    if (!stages || stages.length === 0) return;

    // Global trigger function to spin the active slide's rotator
    window.triggerTurntableSpin = function() {
      const activeSlide = document.querySelector('.hero-carousel .hero-slide.active');
      if (!activeSlide || window._turntablePaused) return;
      const rotator = activeSlide.querySelector('.turntable-rotator');
      if (rotator) {
        rotator.classList.remove('spinning');
        rotator.style.transform = '';
        void rotator.offsetWidth; // force reflow to restart CSS 2s animation
        rotator.classList.add('spinning');
      }
    };

    stages.forEach((stage) => {
      if (stage._turntableBound) return;
      stage._turntableBound = true;

      const rotator = stage.querySelector('.turntable-rotator');
      const viewport = stage.querySelector('.turntable-viewport') || stage.querySelector('#turntableViewport');
      const toggleSpinBtn = stage.querySelector('.turntable-spin-toggle');
      const toggleSpinText = stage.querySelector('.turntable-spin-toggle span') || stage.querySelector('#spinToggleText');

      let isAutoSpinning = true;
      let currentAngle = 0;
      let isDragging = false;
      let startX = 0;

      // Auto-spin toggle
      toggleSpinBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        isAutoSpinning = !isAutoSpinning;
        window._turntablePaused = !isAutoSpinning;
        if (isAutoSpinning) {
          rotator?.classList.add('spinning');
          toggleSpinBtn?.classList.remove('paused');
          if (toggleSpinText) toggleSpinText.textContent = 'Auto 360° Spin: ON';
          if (window.triggerTurntableSpin) window.triggerTurntableSpin();
        } else {
          rotator?.classList.remove('spinning');
          toggleSpinBtn?.classList.add('paused');
          if (toggleSpinText) toggleSpinText.textContent = 'Auto 360° Spin: OFF';
        }
      });

      // Interactive Drag to Rotate 360° (Mouse & Touch)
      if (viewport && rotator) {
        const onStart = (clientX) => {
          isDragging = true;
          startX = clientX;
          window._turntablePaused = true;
          rotator.classList.remove('spinning');
          rotator.style.transition = 'none';
        };

        const onMove = (clientX) => {
          if (!isDragging) return;
          const deltaX = clientX - startX;
          startX = clientX;
          currentAngle = (currentAngle + deltaX * 0.75) % 360;
          rotator.style.transform = `perspective(1200px) rotateY(${currentAngle}deg)`;
        };

        const onEnd = () => {
          if (!isDragging) return;
          isDragging = false;
          rotator.style.transition = 'transform 0.4s ease-out';
          if (isAutoSpinning) {
            setTimeout(() => {
              if (isAutoSpinning && !isDragging) {
                window._turntablePaused = false;
                rotator.style.transition = '';
                if (window.triggerTurntableSpin) window.triggerTurntableSpin();
              }
            }, 800);
          }
        };

        viewport.addEventListener('mousedown', (e) => onStart(e.clientX));
        window.addEventListener('mousemove', (e) => {
          if (isDragging) onMove(e.clientX);
        });
        window.addEventListener('mouseup', onEnd);

        viewport.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches.length > 0) onStart(e.touches[0].clientX);
        }, { passive: true });
        window.addEventListener('touchmove', (e) => {
          if (isDragging && e.touches && e.touches.length > 0) onMove(e.touches[0].clientX);
        }, { passive: true });
        window.addEventListener('touchend', onEnd);
      }
    });

    // Initial trigger on load
    window.triggerTurntableSpin();
  }

  // Initialize Hero Turntable Stage
  initHeroTurntable();
  window.initHeroTurntable = initHeroTurntable;

  // ==========================================
  // Trending Carousel Scroll & Tab Filtering
  // ==========================================
  const trendingTrack = document.getElementById('trendingProductsTrack');
  const trendingPrev = document.getElementById('trendingPrevBtn');
  const trendingNext = document.getElementById('trendingNextBtn');
  const tabBtns = document.querySelectorAll('.filter-tabs .tab-btn');
  const productCards = document.querySelectorAll('.products-carousel-track .product-card, .products-grid .product-card');

  if (trendingTrack) {
    const getScrollStep = () => {
      const card = trendingTrack.querySelector('.product-card');
      return card ? card.offsetWidth + 16 : 296;
    };

    let isAutoScrolling = true;
    let autoScrollInterval = null;
    let scrollDirection = 1; // 1 = scrolling left-to-right (forward), -1 = opposite (backward)

    const doAutoScroll = () => {
      if (!isAutoScrolling) return;
      const step = getScrollStep();
      const maxScroll = trendingTrack.scrollWidth - trendingTrack.clientWidth;

      if (scrollDirection > 0) {
        // Moving from left to right
        if (trendingTrack.scrollLeft >= maxScroll - 15) {
          // Reached the end! Reverse to opposite direction (scroll backwards)
          scrollDirection = -1;
          trendingTrack.scrollBy({ left: -step, behavior: 'smooth' });
        } else {
          trendingTrack.scrollBy({ left: step, behavior: 'smooth' });
        }
      } else {
        // Moving in opposite direction (right to left)
        if (trendingTrack.scrollLeft <= 15) {
          // Reached the beginning! Reverse to opposite direction (scroll forwards)
          scrollDirection = 1;
          trendingTrack.scrollBy({ left: step, behavior: 'smooth' });
        } else {
          trendingTrack.scrollBy({ left: -step, behavior: 'smooth' });
        }
      }
    };

    const getAutoScrollDelay = () => {
      // 4 seconds on mobile (<= 768px), 2.5 seconds on desktop
      return window.innerWidth <= 768 ? 4000 : 2500;
    };

    const startAutoScroll = () => {
      if (!autoScrollInterval) {
        autoScrollInterval = setInterval(doAutoScroll, getAutoScrollDelay());
      }
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    const resetAutoScroll = () => {
      stopAutoScroll();
      startAutoScroll();
    };

    window.addEventListener('resize', () => {
      resetAutoScroll();
    });

    startAutoScroll();

    // Global and clickable button handlers
    window.trendingScrollNext = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      const step = getScrollStep();
      const maxScroll = trendingTrack.scrollWidth - trendingTrack.clientWidth;
      if (maxScroll > 0 && trendingTrack.scrollLeft >= maxScroll - 20) {
        trendingTrack.scrollTo({ left: 0, behavior: 'smooth' });
        scrollDirection = 1;
      } else {
        trendingTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
      resetAutoScroll();
    };

    window.trendingScrollPrev = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      const step = getScrollStep();
      const maxScroll = trendingTrack.scrollWidth - trendingTrack.clientWidth;
      if (trendingTrack.scrollLeft <= 20 && maxScroll > 0) {
        trendingTrack.scrollTo({ left: maxScroll, behavior: 'smooth' });
        scrollDirection = -1;
      } else {
        trendingTrack.scrollBy({ left: -step, behavior: 'smooth' });
      }
      resetAutoScroll();
    };

    // Attach click listeners to navigation buttons
    if (trendingNext) {
      trendingNext.onclick = window.trendingScrollNext;
      trendingNext.addEventListener('click', window.trendingScrollNext);
    }

    if (trendingPrev) {
      trendingPrev.onclick = window.trendingScrollPrev;
      trendingPrev.addEventListener('click', window.trendingScrollPrev);
    }

    // Pause only when hovering over product cards or touching/dragging, not entire outer container
    trendingTrack.addEventListener('mouseenter', () => { isAutoScrolling = false; });
    trendingTrack.addEventListener('mouseleave', () => { if (!isDown) isAutoScrolling = true; });
    trendingTrack.addEventListener('touchstart', () => { isAutoScrolling = false; }, { passive: true });
    trendingTrack.addEventListener('touchend', () => { isAutoScrolling = true; resetAutoScroll(); });

    // Touch & swipe drag support
    let isDown = false;
    let startX;
    let scrollLeft;

    trendingTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      isAutoScrolling = false;
      startX = e.pageX - trendingTrack.offsetLeft;
      scrollLeft = trendingTrack.scrollLeft;
    });
    trendingTrack.addEventListener('mouseleave', () => {
      isDown = false;
      isAutoScrolling = true;
    });
    trendingTrack.addEventListener('mouseup', () => {
      isDown = false;
      isAutoScrolling = true;
      resetAutoScroll();
    });
    trendingTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - trendingTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      trendingTrack.scrollLeft = scrollLeft - walk;
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetCategory = (btn.dataset.tab || 'all').toLowerCase();

      const currentCards = document.querySelectorAll('.products-carousel-track .product-card, .products-grid .product-card');
      currentCards.forEach(card => {
        const cardCategory = (card.dataset.category || '').toLowerCase();
        const matches = targetCategory === 'all' ||
          cardCategory.includes(targetCategory) ||
          (targetCategory === 'new' && (cardCategory.includes('new') || cardCategory.includes('arrival'))) ||
          (targetCategory === 'bestsellers' && (cardCategory.includes('best') || cardCategory.includes('seller')));

        if (matches) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      // Reset scroll position to beginning
      if (trendingTrack) {
        trendingTrack.scrollTo({ left: 0, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // Video Modal
  // ==========================================
  const videoModal = document.getElementById('videoModalBackdrop');
  const videoElement = document.getElementById('modalVideoPlayer');
  const closeVideoBtn = document.getElementById('closeVideoModal');
  const reelCards = document.querySelectorAll('.reel-card');

  reelCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoSrc = card.dataset.videoSrc;
      if (videoSrc && videoElement) {
        videoElement.src = videoSrc;
        videoModal?.classList.add('open');
        videoElement.play();
      }
    });
  });

  function closeModals() {
    if (videoElement) {
      videoElement.pause();
      videoElement.src = '';
    }
    videoModal?.classList.remove('open');
    searchModal?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
  }

  closeVideoBtn?.addEventListener('click', closeModals);
  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) closeModals();
  });

  // ==========================================
  // ==========================================
  // UNIFIED SEARCH ENGINE (Desktop In-Header Bar + Mobile Modal)
  // ==========================================
  function initSearchSystem() {
    const isUserDir = window.location.pathname.includes('/user/');
    const apiBase = isUserDir ? '../api' : '/api';
    const rootPrefix = isUserDir ? '../' : '';
    const detailsPage = isUserDir ? 'product-details.html' : 'product-details.html';
    const cataloguePage = isUserDir ? 'catalogue.html' : 'catalogue.html';

    let searchableProducts = [];

    // Auto-create Search Modal Backdrop in DOM if missing
    let searchModal = document.getElementById('searchModalBackdrop');
    if (!searchModal) {
      searchModal = document.createElement('div');
      searchModal.className = 'custom-modal-backdrop';
      searchModal.id = 'searchModalBackdrop';
      searchModal.innerHTML = `
        <div class="site-search-modal-box">
          <div class="modal-search-header">
            <i class="bi bi-search search-icon"></i>
            <input type="text" id="modalSearchInput" placeholder="Search jerseys, 7v7, rashguards, gear..." autocomplete="off">
            <button type="button" id="modalSearchClear" class="search-clear-btn" style="display: none;"><i class="bi bi-x-circle-fill"></i></button>
            <button type="button" class="modal-search-close" id="closeSearchModal" aria-label="Close search">&times;</button>
          </div>
          <div class="search-quick-tags">
            <span class="quick-tag-label">Popular:</span>
            <button type="button" class="quick-tag-btn" data-query="7v7">7v7 Football</button>
            <button type="button" class="quick-tag-btn" data-query="Rashguard">Rashguard</button>
            <button type="button" class="quick-tag-btn" data-query="Compression">Compression</button>
            <button type="button" class="quick-tag-btn" data-query="Armor">Armor</button>
          </div>
          <div class="modal-search-results" id="modalSearchResults">
            <div class="text-center py-4 px-3">
              <i class="bi bi-search fs-2 text-muted mb-2 d-block"></i>
              <p class="text-muted small mb-0">Search jerseys, 7v7, rashguards, or compression wear...</p>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(searchModal);
    }

    // Fetch product catalog once for instant lightning search
    fetch(`${apiBase}/products`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) searchableProducts = data.filter(p => p.is_active !== false);
      })
      .catch(e => console.warn('Search products fetch failed', e));

    function resolveImg(url) {
      if (!url) return rootPrefix + 'assets/images/products/rashguard-1.jpg';
      if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
      const clean = url.replace(/^\.?\/?/, '');
      return rootPrefix + clean;
    }

    function filterItems(query) {
      const q = (query || '').toLowerCase().trim();
      if (!q) return [];
      const terms = q.split(/\s+/).filter(Boolean);
      return searchableProducts.filter(p => {
        const combined = `${p.name || ''} ${p.sport || ''} ${p.category || ''} ${p.sku || ''} ${p.description || ''}`.toLowerCase();
        return terms.every(t => combined.includes(t));
      });
    }

    function renderResultsHtml(items, query) {
      if (!items || items.length === 0) {
        return `
          <div class="text-center py-4 px-3">
            <i class="bi bi-search fs-2 text-muted mb-2 d-block"></i>
            <p class="fw-bold text-dark mb-1">No products found for "${query}"</p>
            <p class="text-muted small mb-0">Try searching "jersey", "7v7", "rashguard", or "compression"</p>
          </div>
        `;
      }

      const maxItems = items.slice(0, 6);
      let html = '';
      maxItems.forEach(p => {
        const img = resolveImg(p.image);
        html += `
          <a href="${detailsPage}?id=${p.id}" class="search-result-item">
            <div class="search-result-left">
              <img src="${img}" alt="${p.name}" class="search-result-thumb" onerror="this.src='${rootPrefix}assets/images/products/rashguard-1.jpg'">
              <div class="search-result-info">
                <div class="search-result-name">${p.name}</div>
                <div class="search-result-meta">
                  <span class="search-result-badge">${p.sport || 'Sport'}</span>
                  <span>$${p.price || 120}</span>
                </div>
              </div>
            </div>
            <span class="search-result-btn">View <i class="bi bi-arrow-right"></i></span>
          </a>
        `;
      });

      if (items.length > 0) {
        html += `
          <div class="search-dropdown-footer">
            <a href="${cataloguePage}?search=${encodeURIComponent(query)}">
              View all ${items.length} designs in Catalogue &rarr;
            </a>
          </div>
        `;
      }
      return html;
    }

    // 1. Desktop In-Header Search Setup
    const desktopInput = document.querySelector('.desktop-search-input');
    const desktopDropdown = document.querySelector('.desktop-search-dropdown');
    const desktopClear = document.querySelector('.desktop-search-clear');

    if (desktopInput && desktopDropdown) {
      desktopInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        if (desktopClear) desktopClear.style.display = q ? 'block' : 'none';

        if (q.length < 1) {
          desktopDropdown.style.display = 'none';
          return;
        }
        const matches = filterItems(q);
        desktopDropdown.innerHTML = renderResultsHtml(matches, q);
        desktopDropdown.style.display = 'block';
      });

      desktopInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = desktopInput.value.trim();
          if (q) window.location.href = `${cataloguePage}?search=${encodeURIComponent(q)}`;
        } else if (e.key === 'Escape') {
          desktopDropdown.style.display = 'none';
        }
      });

      if (desktopClear) {
        desktopClear.addEventListener('click', () => {
          desktopInput.value = '';
          desktopClear.style.display = 'none';
          desktopDropdown.style.display = 'none';
          desktopInput.focus();
        });
      }

      document.addEventListener('click', (e) => {
        if (!desktopInput.contains(e.target) && !desktopDropdown.contains(e.target)) {
          desktopDropdown.style.display = 'none';
        }
      });
    }

    // 2. Mobile Modal Search Setup
    const modalInput = document.getElementById('modalSearchInput');
    const modalResults = document.getElementById('modalSearchResults');
    const modalClear = document.getElementById('modalSearchClear');
    const modalClose = document.getElementById('closeSearchModal');
    const searchTriggers = document.querySelectorAll('.trigger-search-modal');
    const quickTags = searchModal.querySelectorAll('.quick-tag-btn');

    function openModal(defaultQuery = '') {
      if (!searchModal) return;
      searchModal.classList.add('open');
      if (modalInput) {
        modalInput.value = defaultQuery;
        if (modalClear) modalClear.style.display = defaultQuery ? 'block' : 'none';
        setTimeout(() => modalInput.focus(), 120);
        if (defaultQuery) {
          const matches = filterItems(defaultQuery);
          if (modalResults) modalResults.innerHTML = renderResultsHtml(matches, defaultQuery);
        } else {
          if (modalResults) {
            modalResults.innerHTML = `
              <div class="text-center py-4 px-3">
                <i class="bi bi-search fs-2 text-muted mb-2 d-block"></i>
                <p class="text-muted small mb-0">Search jerseys, 7v7, rashguards, or compression wear...</p>
              </div>
            `;
          }
        }
      }
    }

    function closeModal() {
      if (searchModal) searchModal.classList.remove('open');
    }

    searchTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // If desktop in-header input is visible on screen, focus it, else open modal
        if (window.innerWidth >= 992 && desktopInput) {
          desktopInput.focus();
          desktopInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          openModal();
        }
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (searchModal) {
      searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeModal();
      });
    }

    if (modalInput && modalResults) {
      modalInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        if (modalClear) modalClear.style.display = q ? 'block' : 'none';
        if (q.length < 1) {
          modalResults.innerHTML = `
            <div class="text-center py-4 px-3">
              <i class="bi bi-search fs-2 text-muted mb-2 d-block"></i>
              <p class="text-muted small mb-0">Search jerseys, 7v7, rashguards, or compression wear...</p>
            </div>
          `;
          return;
        }
        const matches = filterItems(q);
        modalResults.innerHTML = renderResultsHtml(matches, q);
      });

      modalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = modalInput.value.trim();
          if (q) window.location.href = `${cataloguePage}?search=${encodeURIComponent(q)}`;
        } else if (e.key === 'Escape') {
          closeModal();
        }
      });

      if (modalClear) {
        modalClear.addEventListener('click', () => {
          modalInput.value = '';
          modalClear.style.display = 'none';
          modalInput.focus();
          modalResults.innerHTML = `
            <div class="text-center py-4 px-3">
              <i class="bi bi-search fs-2 text-muted mb-2 d-block"></i>
              <p class="text-muted small mb-0">Search jerseys, 7v7, rashguards, or compression wear...</p>
            </div>
          `;
        });
      }
    }

    quickTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const q = tag.dataset.query || tag.textContent.trim();
        if (modalInput) {
          modalInput.value = q;
          if (modalClear) modalClear.style.display = 'block';
          const matches = filterItems(q);
          if (modalResults) modalResults.innerHTML = renderResultsHtml(matches, q);
        }
      });
    });

    // 3. Mobile Nav Drawer Search Input (if present)
    const drawerSearchInput = document.querySelector('.drawer-search-input');
    if (drawerSearchInput) {
      drawerSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = drawerSearchInput.value.trim();
          if (q) window.location.href = `${cataloguePage}?search=${encodeURIComponent(q)}`;
        }
      });
      drawerSearchInput.addEventListener('focus', () => {
        const q = drawerSearchInput.value.trim();
        openModal(q);
      });
    }
  }

  initSearchSystem();

  // ==========================================
  // Dynamic Storefront Categories Engine
  // ==========================================
  async function loadStorefrontCategories() {
    const track = document.getElementById('sportsCategoryTrack') || document.querySelector('.sports-track');
    if (!track) return;

    try {
      const isUserDir = window.location.pathname.includes('/user/');
      const apiBase = isUserDir ? '../api' : '/api';
      const res = await fetch(`${apiBase}/categories`);
      if (!res.ok) return;

      const categories = await res.json();
      if (!Array.isArray(categories) || categories.length === 0) return;

      const activeCategories = categories.filter(c => c.is_active !== false);
      if (activeCategories.length === 0) return;

      function resolveCategoryUrl(url) {
        if (!url) return '';
        if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
        const clean = url.replace(/^\.?\/?/, '');
        return (isUserDir ? '../' : '') + clean;
      }

      const defaultIcon = resolveCategoryUrl('assets/images/sport-7v7.png');
      const catalogueLink = isUserDir ? 'catalogue.html' : 'catalogue.html';

      let cardsHtml = '';
      activeCategories.forEach(c => {
        const img = resolveCategoryUrl(c.image || 'assets/images/sport-7v7.png');
        const sportSlug = encodeURIComponent(c.slug || c.name);
        cardsHtml += `
          <a href="${catalogueLink}?sport=${sportSlug}" class="sport-icon-card">
            <div class="sport-icon-circle">
              <img src="${img}" alt="${c.name}" onerror="this.src='${defaultIcon}'">
            </div>
            <span class="sport-name">${c.name}</span>
          </a>
        `;
      });

      track.innerHTML = cardsHtml;
    } catch (e) {
      console.warn('Error loading dynamic storefront categories', e);
    }
  }

  loadStorefrontCategories();

  // ==========================================
  // Mobile 1-Per-Frame Sliders (Reels, Reviews, Stories)
  // ==========================================
  function initMobileSliders() {
    const sliderConfigs = [
      { gridId: 'reelsGrid', dotsId: 'reelsSliderDots' },
      { gridId: 'testimonialsGrid', dotsId: 'reviewsSliderDots' },
      { gridId: 'storiesGrid', dotsId: 'storiesSliderDots' }
    ];

    sliderConfigs.forEach(cfg => {
      const grid = document.getElementById(cfg.gridId);
      if (!grid) return;

      const dotsContainer = document.getElementById(cfg.dotsId);
      const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
      const prevBtns = document.querySelectorAll(`[data-slider-target="${cfg.gridId}"].prev`);
      const nextBtns = document.querySelectorAll(`[data-slider-target="${cfg.gridId}"].next`);

      function updateActiveDot() {
        const width = grid.clientWidth || 1;
        const activeIdx = Math.round(grid.scrollLeft / width);
        dots.forEach((dot, idx) => {
          if (idx === activeIdx) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }

      function scrollToIndex(idx) {
        const count = grid.children.length;
        if (!count) return;
        const safeIdx = Math.max(0, Math.min(idx, count - 1));
        const targetX = safeIdx * grid.clientWidth;
        grid.scrollTo({ left: targetX, behavior: 'smooth' });
      }

      function stepSlide(dir) {
        const count = grid.children.length;
        if (!count) return;
        const width = grid.clientWidth || 1;
        const curIdx = Math.round(grid.scrollLeft / width);
        let nextIdx = curIdx + dir;
        if (nextIdx >= count) nextIdx = 0;
        else if (nextIdx < 0) nextIdx = count - 1;
        scrollToIndex(nextIdx);
      }

      prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          stepSlide(-1);
        });
      });

      nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          stepSlide(1);
        });
      });

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          scrollToIndex(idx);
        });
      });

      let scrollDebounce;
      grid.addEventListener('scroll', () => {
        clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(updateActiveDot, 50);
      }, { passive: true });
    });
  }

  initMobileSliders();

  // ==========================================
  // Mobile Header: S Icon Left, Snowtop Text Center
  // ==========================================
  function setupMobileHeaderLogo() {
    const brandLogo = document.querySelector('.brand-logo');
    if (!brandLogo) return;

    if (!brandLogo.querySelector('.logo-mobile-icon')) {
      const isUserDir = window.location.pathname.includes('/user/');
      const prefix = isUserDir ? '../' : '';

      const desktopImg = brandLogo.querySelector('img');
      if (desktopImg) desktopImg.classList.add('logo-desktop-img');

      const iconImg = document.createElement('img');
      iconImg.src = prefix + 'assets/images/logo-icon-s.png';
      iconImg.alt = 'Snowtop Sports Icon';
      iconImg.className = 'logo-mobile-icon';

      const textImg = document.createElement('img');
      textImg.src = prefix + 'assets/images/logo-text-black.png';
      textImg.alt = 'SNOWTOP SPORTS';
      textImg.className = 'logo-mobile-text';

      brandLogo.appendChild(iconImg);
      brandLogo.appendChild(textImg);
    }
  }

  setupMobileHeaderLogo();
});
