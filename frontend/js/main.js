/**
 * PROSIX SPORTS - MAIN INTERACTION SCRIPT (Vanilla JS)
 */

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
  // Hero 3D Parallax Carousel Engine
  // ==========================================
  const heroCarousel = document.getElementById('heroCarousel3D') || document.querySelector('.hero-carousel');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrev = document.getElementById('heroPrevBtn');
  const heroNext = document.getElementById('heroNextBtn');
  let currentHeroIdx = 0;
  let heroTimer = null;

  function showHeroSlide(index) {
    if (heroSlides.length === 0) return;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentHeroIdx = index;
  }

  function nextHeroSlide() {
    const nextIdx = (currentHeroIdx + 1) % heroSlides.length;
    showHeroSlide(nextIdx);
  }

  function prevHeroSlide() {
    const prevIdx = (currentHeroIdx - 1 + heroSlides.length) % heroSlides.length;
    showHeroSlide(prevIdx);
  }

  if (heroSlides.length > 1) {
    heroNext?.addEventListener('click', () => {
      nextHeroSlide();
      resetHeroTimer();
    });

    heroPrev?.addEventListener('click', () => {
      prevHeroSlide();
      resetHeroTimer();
    });

    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showHeroSlide(idx);
        resetHeroTimer();
      });
    });

    function resetHeroTimer() {
      clearInterval(heroTimer);
      heroTimer = setInterval(nextHeroSlide, 5500);
    }
    resetHeroTimer();
  } else {
    // Single slide: hide navigation arrows and dots
    const heroControls = heroCarousel?.querySelector('.hero-controls');
    const heroDotsWrap = heroCarousel?.querySelector('.hero-dots');
    if (heroControls) heroControls.style.display = 'none';
    if (heroDotsWrap) heroDotsWrap.style.display = 'none';
  }

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
  }

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

    const startAutoScroll = () => {
      if (!autoScrollInterval) {
        autoScrollInterval = setInterval(doAutoScroll, 2000);
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

    startAutoScroll();

    // Global and clickable button handlers
    window.trendingScrollNext = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      const step = getScrollStep();
      const maxScroll = trendingTrack.scrollWidth - trendingTrack.clientWidth;
      if (trendingTrack.scrollLeft >= maxScroll - 15) {
        scrollDirection = -1;
        trendingTrack.scrollBy({ left: -step, behavior: 'smooth' });
      } else {
        scrollDirection = 1;
        trendingTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
      resetAutoScroll();
    };

    window.trendingScrollPrev = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      const step = getScrollStep();
      if (trendingTrack.scrollLeft <= 15) {
        scrollDirection = 1;
        trendingTrack.scrollBy({ left: step, behavior: 'smooth' });
      } else {
        scrollDirection = -1;
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

    // Pause on hover or touch over carousel container, resume on leave
    const carouselOuter = trendingTrack.closest('.trending-carousel-outer') || trendingTrack;
    carouselOuter.addEventListener('mouseenter', () => { isAutoScrolling = false; });
    carouselOuter.addEventListener('mouseleave', () => { isAutoScrolling = true; });
    carouselOuter.addEventListener('touchstart', () => { isAutoScrolling = false; }, { passive: true });
    carouselOuter.addEventListener('touchend', () => { isAutoScrolling = true; });

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
  // Search Modal
  // ==========================================
  const searchTriggers = document.querySelectorAll('.trigger-search-modal');
  const searchModal = document.getElementById('searchModalBackdrop');
  const closeSearchBtn = document.getElementById('closeSearchModal');
  const searchInput = document.getElementById('siteSearchInput');
  const searchResults = document.getElementById('searchResultsContainer');

  let searchableProducts = [];
  fetch('/api/products')
    .then(r => r.ok ? r.json() : [])
    .then(data => { if (Array.isArray(data)) searchableProducts = data; })
    .catch(() => {});

  searchTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal?.classList.add('open');
      searchInput?.focus();
    });
  });

  closeSearchBtn?.addEventListener('click', () => {
    searchModal?.classList.remove('open');
  });

  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) searchModal.classList.remove('open');
  });

  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (q.length < 2) {
      if (searchResults) searchResults.innerHTML = '<p class="text-muted text-center py-3">Type at least 2 characters to search...</p>';
      return;
    }

    const matches = searchableProducts.filter(p => p.name.toLowerCase().includes(q));
    if (matches.length === 0) {
      if (searchResults) searchResults.innerHTML = '<p class="text-muted text-center py-3">No products found matching your search.</p>';
      return;
    }

    let html = '';
    matches.forEach(p => {
      html += `
        <div class="d-flex align-items-center justify-content-between p-2 border-bottom">
          <div class="d-flex align-items-center gap-3">
            <img src="${p.image}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: contain;">
            <div>
              <div class="fw-bold">${p.name}</div>
            </div>
          </div>
          <a href="product-details.html?id=${p.id}" class="btn btn-dark btn-sm rounded-pill px-3">View</a>
        </div>
      `;
    });
    if (searchResults) searchResults.innerHTML = html;
  });
});
