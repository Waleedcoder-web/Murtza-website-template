/**
 * PROSIX SPORTS - UNIFORM CUSTOMIZER STUDIO ENGINE
 * Professional Studio-Grade Customizer with Clean Garment Recoloring,
 * Authentic Athletic Lettering/Numbering, and 100% Solid Swatches.
 */

// Fallback catalog of 20 authentic Prosix rashguards/uniforms
const FALLBACK_CUSTOMIZER_PRODUCTS = [
  { id: 1, sku: 'RG-001', name: 'Stealth Blackout Carbon Rashguard', sport: 'Compression Wear', category: 'Best Sellers', image: 'assets/images/products/rashguard-1.jpg', primaryColor: '#0a0a0a', secondaryColor: '#2b2b2b' },
  { id: 2, sku: 'RG-002', name: 'Royal Cyan & Navy Compression Top', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-2.jpg', primaryColor: '#002b66', secondaryColor: '#00d4ff' },
  { id: 3, sku: 'RG-003', name: 'Crimson Velocity Armor Rashguard', sport: '7v7 Football', category: 'Best Sellers', image: 'assets/images/products/rashguard-3.jpg', primaryColor: '#e60026', secondaryColor: '#0a0a0a' },
  { id: 4, sku: 'RG-004', name: 'Volt Yellow Sprint Rashguard', sport: 'Training', category: 'New Arrivals', image: 'assets/images/products/rashguard-4.jpg', primaryColor: '#39ff14', secondaryColor: '#111111' },
  { id: 5, sku: 'RG-005', name: 'Glacier White & Deep Navy Top', sport: 'Compression Wear', category: 'Best Sellers', image: 'assets/images/products/rashguard-5.jpg', primaryColor: '#f8f9fa', secondaryColor: '#002b66' },
  { id: 6, sku: 'RG-006', name: 'Hyper Sunset Orange Rashguard', sport: '7v7 Football', category: 'New Arrivals', image: 'assets/images/products/rashguard-6.jpg', primaryColor: '#ff5400', secondaryColor: '#222222' },
  { id: 7, sku: 'RG-007', name: 'Emerald Matrix Honeycomb Top', sport: 'Training', category: 'Best Sellers', image: 'assets/images/products/rashguard-7.jpg', primaryColor: '#00875a', secondaryColor: '#0a0a0a' },
  { id: 8, sku: 'RG-008', name: 'Regal Purple Tournament Rashguard', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-8.jpg', primaryColor: '#7b2cbf', secondaryColor: '#ffb400' },
  { id: 9, sku: 'RG-009', name: 'Desert Sand Tactical Camo Rashguard', sport: 'Training', category: 'Best Sellers', image: 'assets/images/products/rashguard-9.jpg', primaryColor: '#c2b280', secondaryColor: '#2b2b2b' },
  { id: 10, sku: 'RG-010', name: 'Oceanic Teal & Mint Base Layer', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-10.jpg', primaryColor: '#008080', secondaryColor: '#98ff98' },
  { id: 11, sku: 'RG-011', name: 'Solar Gold & Black Striker Top', sport: '7v7 Football', category: 'Best Sellers', image: 'assets/images/products/rashguard-11.jpg', primaryColor: '#ffb400', secondaryColor: '#0a0a0a' },
  { id: 12, sku: 'RG-012', name: 'Bloodline Maroon Armor Rashguard', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-12.jpg', primaryColor: '#800000', secondaryColor: '#111111' },
  { id: 13, sku: 'RG-013', name: 'Titanium Silver & Acid Lime Top', sport: 'Training', category: 'Best Sellers', image: 'assets/images/products/rashguard-13.jpg', primaryColor: '#8a8d91', secondaryColor: '#39ff14' },
  { id: 14, sku: 'RG-014', name: 'Cobalt Blue Cross-Trainer Rashguard', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-14.jpg', primaryColor: '#0047ab', secondaryColor: '#ffffff' },
  { id: 15, sku: 'RG-015', name: 'Shadow Charcoal & Red Speed Top', sport: '7v7 Football', category: 'Best Sellers', image: 'assets/images/products/rashguard-15.jpg', primaryColor: '#2c2c2c', secondaryColor: '#e60026' },
  { id: 16, sku: 'RG-016', name: 'Vortex Violet Performance Rashguard', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-16.jpg', primaryColor: '#7b2cbf', secondaryColor: '#f72585' },
  { id: 17, sku: 'RG-017', name: 'Military Green Camo Tactical Top', sport: 'Training', category: 'Best Sellers', image: 'assets/images/products/rashguard-17.jpg', primaryColor: '#4b5320', secondaryColor: '#1c1c1c' },
  { id: 18, sku: 'RG-018', name: 'Electric Cyan & Magenta Duo Rashguard', sport: '7v7 Football', category: 'New Arrivals', image: 'assets/images/products/rashguard-18.jpg', primaryColor: '#00d4ff', secondaryColor: '#ff007f' },
  { id: 19, sku: 'RG-019', name: 'Pitch Black & Gold Foil Rashguard', sport: 'Compression Wear', category: 'Best Sellers', image: 'assets/images/products/rashguard-19.jpg', primaryColor: '#0a0a0a', secondaryColor: '#ffb400' },
  { id: 20, sku: 'RG-020', name: 'Pure Frost Minimalist Base Layer', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-20.jpg', primaryColor: '#f8f9fa', secondaryColor: '#002b66' }
];

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const selectedProductThumb = document.getElementById('selectedProductThumb');
  const selectedProductName = document.getElementById('selectedProductName');
  const selectedProductCategory = document.getElementById('selectedProductCategory');
  const customizerProductImg = document.getElementById('customizerProductImg');
  const productRealLayer = document.getElementById('productRealLayer');
  const productVectorLayer = document.getElementById('productVectorLayer');

  // Text Wrappers
  const realChestWrap = document.getElementById('realChestWrap');
  const realNumberWrap = document.getElementById('realNumberWrap');
  const realBackNameWrap = document.getElementById('realBackNameWrap');

  const realChestText = document.getElementById('realChestText');
  const realNumberText = document.getElementById('realNumberText');
  const realBackNameText = document.getElementById('realBackNameText');

  // Vector Elements
  const baseFill = document.getElementById('jerseyBase');
  const sleeveFill = document.getElementById('jerseySleeves');
  const collarFill = document.getElementById('jerseyCollar');
  const chestText = document.getElementById('jerseyChestText');
  const numberText = document.getElementById('jerseyNumberText');
  const backNameText = document.getElementById('jerseyBackNameText');

  // Color Pickers
  const primaryColorPicker = document.getElementById('customPrimaryColor');
  const secondaryColorPicker = document.getElementById('customSecondaryColor');
  const textColorPicker = document.getElementById('customTextColor');

  const primaryColorCode = document.getElementById('primaryColorCode');
  const secondaryColorCode = document.getElementById('secondaryColorCode');
  const textColorCode = document.getElementById('textColorCode');

  // Inputs
  const teamNameInput = document.getElementById('customTeamName');
  const playerNumberInput = document.getElementById('customPlayerNumber');
  const playerNameInput = document.getElementById('customPlayerName');
  const fontSelect = document.getElementById('customFontSelect');

  // Toggles
  const viewFrontBtn = document.getElementById('viewFrontBtn');
  const viewBackBtn = document.getElementById('viewBackBtn');
  const modeRealBtn = document.getElementById('modeRealBtn');
  const modeVectorBtn = document.getElementById('modeVectorBtn');

  // Swatches
  const primarySwatches = document.querySelectorAll('.primary-swatch');
  const secondarySwatches = document.querySelectorAll('.secondary-swatch');
  const textSwatches = document.querySelectorAll('.text-swatch');
  const themePresetBtns = document.querySelectorAll('.theme-preset-btn');

  // State
  let currentView = 'front';
  let currentMode = 'real';
  let activeProduct = null;
  let allProducts = [];

  function resolveAssetUrl(url) {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
    const isUserDir = window.location.pathname.includes('/user/') || window.location.pathname.endsWith('/user');
    const clean = url.replace(/^\.?\/?/, '');
    return (isUserDir ? '../' : '') + clean;
  }

  function hexToHSL(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16) / 255;
      g = parseInt(hex[2] + hex[2], 16) / 255;
      b = parseInt(hex[3] + hex[3], 16) / 255;
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16) / 255;
      g = parseInt(hex.slice(3, 5), 16) / 255;
      b = parseInt(hex.slice(5, 7), 16) / 255;
    }
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  // 1. Fetch products from API or Fallback
  try {
    const isUserDir = window.location.pathname.includes('/user/');
    const apiBase = isUserDir ? '../api' : '/api';
    const res = await fetch(`${apiBase}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allProducts = data;
      }
    }
  } catch (e) {
    console.warn('Could not fetch products from API, using fallback store', e);
  }

  if (allProducts.length === 0) {
    allProducts = FALLBACK_CUSTOMIZER_PRODUCTS;
  }

  // 2. Determine Product from URL Param ?id=X
  function findProductFromParam() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');

    if (idParam) {
      let match = allProducts.find(p => String(p.id) === String(idParam));
      if (match) return match;

      const num = parseInt(idParam, 10);
      if (!isNaN(num) && num >= 1 && num <= allProducts.length) {
        return allProducts[num - 1];
      }
    }

    return allProducts[0];
  }

  function selectProduct(product, updateUrl = true) {
    if (!product) return;
    activeProduct = product;

    const resolvedImg = resolveAssetUrl(product.image);
    if (selectedProductThumb) selectedProductThumb.src = resolvedImg;
    if (selectedProductName) selectedProductName.textContent = product.name;
    if (selectedProductCategory) selectedProductCategory.textContent = product.sport || product.category || 'Custom Apparel';
    if (customizerProductImg) customizerProductImg.src = resolvedImg;

    if (product.primaryColor && primaryColorPicker) {
      setPrimaryColor(product.primaryColor);
    }
    if (product.secondaryColor && secondaryColorPicker) {
      setSecondaryColor(product.secondaryColor);
    }

    if (updateUrl && history.replaceState) {
      const url = new URL(window.location);
      url.searchParams.set('id', product.id);
      window.history.replaceState({}, '', url);
    }

    updateUniform();
    highlightActiveProductCard(product.id);
  }

  // 3. Clean Garment Color Application (No purple background rectangle!)
  function applyGarmentFilter(hex) {
    if (!customizerProductImg) return;
    const hsl = hexToHSL(hex);
    const baseHue = 195; // Base cyan/blue rashguard reference
    const diffHue = hsl.h - baseHue;

    if (hsl.s < 12) {
      // Monochrome: Black, White, Charcoal
      if (hsl.l < 22) {
        // Deep Blackout
        customizerProductImg.style.filter = 'grayscale(1) brightness(0.28) contrast(1.5) drop-shadow(0 15px 35px rgba(0,0,0,0.25))';
      } else if (hsl.l > 82) {
        // Pure White / Frost
        customizerProductImg.style.filter = 'grayscale(1) brightness(1.38) contrast(1.15) drop-shadow(0 15px 35px rgba(0,0,0,0.18))';
      } else {
        // Charcoal
        customizerProductImg.style.filter = 'grayscale(1) brightness(0.7) contrast(1.25) drop-shadow(0 15px 35px rgba(0,0,0,0.2))';
      }
    } else {
      // Saturated Sport Colorways
      const sat = Math.max(1.3, hsl.s / 45);
      const bright = Math.max(0.75, Math.min(1.2, hsl.l / 46));
      customizerProductImg.style.filter = `hue-rotate(${diffHue}deg) saturate(${sat}) brightness(${bright}) drop-shadow(0 15px 35px rgba(0,0,0,0.22))`;
    }
  }

  // 4. Update Uniform Live
  function updateUniform() {
    const primary = primaryColorPicker?.value || '#0a0a0a';
    const secondary = secondaryColorPicker?.value || '#e60026';
    const textCol = textColorPicker?.value || '#ffffff';
    const teamName = teamNameInput?.value.toUpperCase().trim() || 'PROSIX';
    const playerNum = playerNumberInput?.value.trim() || '07';
    const playerName = playerNameInput?.value.toUpperCase().trim() || 'CHAMPION';
    const font = fontSelect?.value || "'Oswald', sans-serif";

    // Text contrast stroke helper
    const textIsLight = hexToHSL(textCol).l > 55;
    const strokeColor = textIsLight ? 'rgba(0, 0, 0, 0.88)' : '#ffffff';

    // A. Photo-Realistic Garment
    applyGarmentFilter(primary);

    if (realChestText) {
      realChestText.textContent = teamName;
      realChestText.style.color = textCol;
      realChestText.style.fontFamily = font;
      realChestText.style.webkitTextStroke = `1.2px ${strokeColor}`;
    }
    if (realNumberText) {
      realNumberText.textContent = playerNum;
      realNumberText.style.color = textCol;
      realNumberText.style.fontFamily = font.includes('Impact') ? font : "'Impact', 'Oswald', sans-serif";
      realNumberText.style.webkitTextStroke = `1.8px ${strokeColor}`;
    }
    if (realBackNameText) {
      realBackNameText.textContent = playerName;
      realBackNameText.style.color = textCol;
      realBackNameText.style.fontFamily = font;
      realBackNameText.style.webkitTextStroke = `1px ${strokeColor}`;
    }

    // B. Vector SVG Layer
    if (baseFill) baseFill.setAttribute('fill', primary);
    if (sleeveFill) sleeveFill.setAttribute('fill', secondary);
    if (collarFill) collarFill.setAttribute('fill', secondary);

    if (chestText) {
      chestText.setAttribute('fill', textCol);
      chestText.setAttribute('stroke', strokeColor);
      chestText.textContent = teamName;
      chestText.style.fontFamily = font;
    }
    if (numberText) {
      numberText.setAttribute('fill', textCol);
      numberText.setAttribute('stroke', strokeColor);
      numberText.textContent = playerNum;
      numberText.style.fontFamily = font.includes('Impact') ? font : "'Impact', 'Oswald', sans-serif";
    }
    if (backNameText) {
      backNameText.setAttribute('fill', textCol);
      backNameText.setAttribute('stroke', strokeColor);
      backNameText.textContent = playerName;
      backNameText.style.fontFamily = font;
    }
  }

  // Setters for colors
  function setPrimaryColor(hex) {
    if (primaryColorPicker) primaryColorPicker.value = hex;
    if (primaryColorCode) primaryColorCode.textContent = hex.toUpperCase();
    primarySwatches.forEach(s => {
      s.classList.toggle('active', s.dataset.color?.toLowerCase() === hex.toLowerCase());
    });
    updateUniform();
  }

  function setSecondaryColor(hex) {
    if (secondaryColorPicker) secondaryColorPicker.value = hex;
    if (secondaryColorCode) secondaryColorCode.textContent = hex.toUpperCase();
    secondarySwatches.forEach(s => {
      s.classList.toggle('active', s.dataset.color?.toLowerCase() === hex.toLowerCase());
    });
    updateUniform();
  }

  function setTextColor(hex) {
    if (textColorPicker) textColorPicker.value = hex;
    if (textColorCode) textColorCode.textContent = hex.toUpperCase();
    textSwatches.forEach(s => {
      s.classList.toggle('active', s.dataset.color?.toLowerCase() === hex.toLowerCase());
    });
    updateUniform();
  }

  // 5. Front vs Back Views
  function setView(view) {
    currentView = view;
    viewFrontBtn?.classList.toggle('active', view === 'front');
    viewBackBtn?.classList.toggle('active', view === 'back');

    if (view === 'front') {
      if (realChestWrap) realChestWrap.style.display = 'block';
      if (realNumberWrap) {
        realNumberWrap.style.display = 'block';
        realNumberWrap.style.top = '54%';
      }
      if (realBackNameWrap) realBackNameWrap.style.display = 'none';

      if (chestText) chestText.style.display = 'block';
      if (backNameText) backNameText.style.display = 'none';
      if (numberText) {
        numberText.setAttribute('y', '340');
        numberText.setAttribute('font-size', '78');
      }
    } else {
      if (realChestWrap) realChestWrap.style.display = 'none';
      if (realBackNameWrap) realBackNameWrap.style.display = 'block';
      if (realNumberWrap) {
        realNumberWrap.style.display = 'block';
        realNumberWrap.style.top = '50%';
      }

      if (chestText) chestText.style.display = 'none';
      if (backNameText) backNameText.style.display = 'block';
      if (numberText) {
        numberText.setAttribute('y', '330');
        numberText.setAttribute('font-size', '96');
      }
    }
  }

  // 6. Display Modes (Realistic Photo vs Vector Schematic)
  function setMode(mode) {
    currentMode = mode;
    modeRealBtn?.classList.toggle('active', mode === 'real');
    modeVectorBtn?.classList.toggle('active', mode === 'vector');

    if (mode === 'real') {
      if (productRealLayer) productRealLayer.classList.remove('d-none');
      if (productVectorLayer) productVectorLayer.classList.add('d-none');
    } else {
      if (productRealLayer) productRealLayer.classList.add('d-none');
      if (productVectorLayer) productVectorLayer.classList.remove('d-none');
    }
  }

  viewFrontBtn?.addEventListener('click', () => setView('front'));
  viewBackBtn?.addEventListener('click', () => setView('back'));

  modeRealBtn?.addEventListener('click', () => setMode('real'));
  modeVectorBtn?.addEventListener('click', () => setMode('vector'));

  // Color Pickers Input
  primaryColorPicker?.addEventListener('input', (e) => setPrimaryColor(e.target.value));
  secondaryColorPicker?.addEventListener('input', (e) => setSecondaryColor(e.target.value));
  textColorPicker?.addEventListener('input', (e) => setTextColor(e.target.value));

  // Text Inputs
  teamNameInput?.addEventListener('input', updateUniform);
  playerNumberInput?.addEventListener('input', updateUniform);
  playerNameInput?.addEventListener('input', updateUniform);
  fontSelect?.addEventListener('change', updateUniform);

  // Swatches Click Handlers
  primarySwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const col = swatch.dataset.color;
      if (col) setPrimaryColor(col);
    });
  });

  secondarySwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const col = swatch.dataset.color;
      if (col) setSecondaryColor(col);
    });
  });

  textSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const col = swatch.dataset.color;
      if (col) setTextColor(col);
    });
  });

  // Quick Colorway Themes
  themePresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.dataset.primary;
      const s = btn.dataset.secondary;
      const t = btn.dataset.text;
      if (p) setPrimaryColor(p);
      if (s) setSecondaryColor(s);
      if (t) setTextColor(t);
    });
  });

  // 7. Quick Product Switcher Carousel
  const productSwitcherContainer = document.getElementById('customizerProductSwitcher');
  if (productSwitcherContainer && allProducts.length > 0) {
    let cardsHtml = '';
    allProducts.forEach(p => {
      const img = resolveAssetUrl(p.image);
      cardsHtml += `
        <div class="product-mini-select-card" data-id="${p.id}" style="cursor: pointer; min-width: 130px; text-align: center; padding: 10px; border: 2px solid #e9ecef; border-radius: 14px; transition: all 0.25s ease; background: #ffffff;">
          <img src="${img}" alt="${p.name}" style="width: 100%; height: 95px; object-fit: contain; margin-bottom: 6px;">
          <div class="fw-bold text-dark text-truncate small" style="font-size: 0.78rem;">${p.name}</div>
          <span class="badge bg-light text-muted border text-uppercase" style="font-size: 0.65rem;">${p.sport || 'Pro'}</span>
        </div>
      `;
    });
    productSwitcherContainer.innerHTML = cardsHtml;

    productSwitcherContainer.querySelectorAll('.product-mini-select-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const prod = allProducts.find(x => String(x.id) === String(id));
        if (prod) selectProduct(prod, true);
      });
    });
  }

  function highlightActiveProductCard(id) {
    if (!productSwitcherContainer) return;
    productSwitcherContainer.querySelectorAll('.product-mini-select-card').forEach(c => {
      const match = String(c.dataset.id) === String(id);
      c.style.borderColor = match ? '#000000' : '#e9ecef';
      c.style.transform = match ? 'translateY(-3px)' : 'none';
      c.style.boxShadow = match ? '0 8px 20px rgba(0,0,0,0.12)' : 'none';
    });
  }

  // 8. Team Roster Table Builder
  const rosterTableBody = document.getElementById('rosterTableBody');
  const addPlayerBtn = document.getElementById('addPlayerRowBtn');
  const totalCountEl = document.getElementById('rosterTotalCount');
  const totalPriceEl = document.getElementById('rosterTotalPrice');
  const UNIT_PRICE = 65.00;

  function updateRosterSummary() {
    const rows = rosterTableBody?.querySelectorAll('tr') || [];
    const count = rows.length;
    if (totalCountEl) totalCountEl.textContent = count;
    if (totalPriceEl) totalPriceEl.textContent = `$${(count * UNIT_PRICE).toFixed(2)}`;
  }

  function addRosterRow(name = '', number = '', size = 'Adult L') {
    if (!rosterTableBody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="form-control form-control-sm player-name-val" value="${name}" placeholder="Player Name"></td>
      <td><input type="text" class="form-control form-control-sm player-num-val" value="${number}" placeholder="##" style="max-width: 80px;"></td>
      <td>
        <select class="form-select form-select-sm player-size-val">
          <option ${size === 'Youth S' ? 'selected' : ''}>Youth S</option>
          <option ${size === 'Youth M' ? 'selected' : ''}>Youth M</option>
          <option ${size === 'Youth L' ? 'selected' : ''}>Youth L</option>
          <option ${size === 'Adult S' ? 'selected' : ''}>Adult S</option>
          <option ${size === 'Adult M' ? 'selected' : ''}>Adult M</option>
          <option ${size === 'Adult L' ? 'selected' : ''}>Adult L</option>
          <option ${size === 'Adult XL' ? 'selected' : ''}>Adult XL</option>
          <option ${size === 'Adult 2XL' ? 'selected' : ''}>Adult 2XL</option>
          <option ${size === 'Adult 3XL' ? 'selected' : ''}>Adult 3XL</option>
        </select>
      </td>
      <td class="text-center">
        <button class="btn btn-outline-danger btn-sm p-1 delete-row-btn" type="button" title="Remove Player">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tr.querySelector('.delete-row-btn')?.addEventListener('click', () => {
      tr.remove();
      updateRosterSummary();
    });
    rosterTableBody.appendChild(tr);
    updateRosterSummary();
  }

  addPlayerBtn?.addEventListener('click', () => {
    addRosterRow();
  });

  if (rosterTableBody && rosterTableBody.children.length === 0) {
    addRosterRow('Captain', '01', 'Adult L');
    addRosterRow('Striker', '07', 'Adult M');
    addRosterRow('Defender', '10', 'Adult XL');
  }

  // 9. Order Submission
  const addCustomToCartBtn = document.getElementById('addCustomOrderToCartBtn');
  addCustomToCartBtn?.addEventListener('click', () => {
    const rows = rosterTableBody?.querySelectorAll('tr') || [];
    const count = Math.max(1, rows.length);
    const teamName = teamNameInput?.value || 'Custom Team';
    const prodName = activeProduct ? activeProduct.name : 'Custom Sublimated Uniform';

    sessionStorage.setItem('customOrderTeam', teamName);
    sessionStorage.setItem('customOrderProduct', prodName);
    sessionStorage.setItem('customOrderCount', count);
    sessionStorage.setItem('customPrimaryColor', primaryColorPicker?.value || '#0a0a0a');
    sessionStorage.setItem('customSecondaryColor', secondaryColorPicker?.value || '#e60026');

    if (typeof CartStore !== 'undefined' && CartStore.showToast) {
      CartStore.showToast(`Custom team design saved for "${prodName}"! Proceeding to order form...`);
    }

    setTimeout(() => {
      window.location.href = 'placeorder.html';
    }, 600);
  });

  // Initialize selected product
  const initialProduct = findProductFromParam();
  selectProduct(initialProduct, false);
  setView('front');
  setMode('real');
});
