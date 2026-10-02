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
  // Hero Carousel
  // ==========================================
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

  if (heroSlides.length > 0) {
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
      heroTimer = setInterval(nextHeroSlide, 5000);
    }
    resetHeroTimer();
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
      return card ? card.offsetWidth + 16 : 300;
    };

    // Initial position showing previous card slightly peeking on left like the authentic design
    const initCarouselPosition = () => {
      const card = trendingTrack.querySelector('.product-card');
      if (card && trendingTrack.scrollLeft === 0) {
        const peek = Math.max(50, Math.floor(card.offsetWidth * 0.25));
        trendingTrack.scrollLeft = card.offsetWidth + 16 - peek;
      }
    };
    setTimeout(initCarouselPosition, 150);

    let isAutoScrolling = true;
    let autoScrollInterval = null;

    const scrollNext = () => {
      const step = getScrollStep();
      const maxScroll = trendingTrack.scrollWidth - trendingTrack.clientWidth;
      if (trendingTrack.scrollLeft >= maxScroll - 20) {
        trendingTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        trendingTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
    };

    const scrollPrev = () => {
      const step = getScrollStep();
      if (trendingTrack.scrollLeft <= 20) {
        const maxScroll = trendingTrack.scrollWidth - trendingTrack.clientWidth;
        trendingTrack.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        trendingTrack.scrollBy({ left: -step, behavior: 'smooth' });
      }
    };

    // Auto-scroll 1 product to next every 2 seconds
    const startAutoScroll = () => {
      if (!autoScrollInterval) {
        autoScrollInterval = setInterval(() => {
          if (isAutoScrolling) {
            scrollNext();
          }
        }, 2000);
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

    // Pause on hover or touch, resume on leave
    trendingTrack.addEventListener('mouseenter', () => { isAutoScrolling = false; });
    trendingTrack.addEventListener('mouseleave', () => { isAutoScrolling = true; });
    trendingTrack.addEventListener('touchstart', () => { isAutoScrolling = false; }, { passive: true });
    trendingTrack.addEventListener('touchend', () => { isAutoScrolling = true; });

    trendingNext?.addEventListener('click', () => {
      scrollNext();
      resetAutoScroll();
    });

    trendingPrev?.addEventListener('click', () => {
      scrollPrev();
      resetAutoScroll();
    });

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
      const targetCategory = btn.dataset.tab;

      productCards.forEach(card => {
        if (targetCategory === 'all' || card.dataset.category === targetCategory) {
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

  const searchableProducts = [
    { id: 287, name: 'Chargers Jersey Designs', price: 120, image: 'assets/images/sample-jersey-1.png' },
    { id: 288, name: 'Football Jersey Designs', price: 120, image: 'assets/images/sample-jersey-2.png' },
    { id: 289, name: 'Wolfpack Jersey Designs', price: 120, image: 'assets/images/sample-jersey-3.png' },
    { id: 290, name: 'Patriots Jersey Designs', price: 120, image: 'assets/images/sample-jersey-4.png' },
    { id: 291, name: 'Hawks Jersey Designs', price: 120, image: 'assets/images/sample-jersey-5.png' },
    { id: 296, name: 'Army Jersey Designs', price: 120, image: 'assets/images/sample-jersey-6.png' },
    { id: 297, name: 'Vikings Jersey Designs', price: 120, image: 'assets/images/sample-jersey-7.png' },
    { id: 299, name: 'Bears Jersey Designs', price: 120, image: 'assets/images/sample-jersey-8.png' }
  ];

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
              <div class="text-muted small">$${p.price.toFixed(2)}</div>
            </div>
          </div>
          <a href="product-details.html?id=${p.id}" class="btn btn-dark btn-sm rounded-pill px-3">View</a>
        </div>
      `;
    });
    if (searchResults) searchResults.innerHTML = html;
  });
});
