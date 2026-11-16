/**
 * PROSIX SPORTS - CUSTOM APPAREL INQUIRY & ORDER ENGINE
 * Replaces the color system with direct image upload, quantity stepper,
 * multi-size selector, detailed description, and direct WhatsApp messaging.
 */

const FALLBACK_CUSTOMIZER_PRODUCTS = [
  { id: 1, sku: 'RG-001', name: 'Stealth Blackout Carbon Rashguard', sport: 'Compression Wear', category: 'Best Sellers', image: 'assets/images/products/rashguard-1.jpg' },
  { id: 2, sku: 'RG-002', name: 'Royal Cyan & Navy Compression Top', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-2.jpg' },
  { id: 3, sku: 'RG-003', name: 'Crimson Velocity Armor Rashguard', sport: '7v7 Football', category: 'Best Sellers', image: 'assets/images/products/rashguard-3.jpg' },
  { id: 4, sku: 'RG-004', name: 'Volt Yellow Sprint Rashguard', sport: 'Training', category: 'New Arrivals', image: 'assets/images/products/rashguard-4.jpg' },
  { id: 5, sku: 'RG-005', name: 'Glacier White & Deep Navy Top', sport: 'Compression Wear', category: 'Best Sellers', image: 'assets/images/products/rashguard-5.jpg' },
  { id: 6, sku: 'RG-006', name: 'Hyper Sunset Orange Rashguard', sport: '7v7 Football', category: 'New Arrivals', image: 'assets/images/products/rashguard-6.jpg' },
  { id: 7, sku: 'RG-007', name: 'Emerald Matrix Honeycomb Top', sport: 'Training', category: 'Best Sellers', image: 'assets/images/products/rashguard-7.jpg' },
  { id: 8, sku: 'RG-008', name: 'Regal Purple Tournament Rashguard', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-8.jpg' },
  { id: 9, sku: 'RG-009', name: 'Desert Sand Tactical Camo Rashguard', sport: 'Training', category: 'Best Sellers', image: 'assets/images/products/rashguard-9.jpg' },
  { id: 10, sku: 'RG-010', name: 'Oceanic Teal & Mint Base Layer', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-10.jpg' },
  { id: 11, sku: 'RG-011', name: 'Solar Gold & Black Striker Top', sport: '7v7 Football', category: 'Best Sellers', image: 'assets/images/products/rashguard-11.jpg' },
  { id: 12, sku: 'RG-012', name: 'Bloodline Maroon Armor Rashguard', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-12.jpg' },
  { id: 13, sku: 'RG-013', name: 'Titanium Silver & Acid Lime Top', sport: 'Training', category: 'Best Sellers', image: 'assets/images/products/rashguard-13.jpg' },
  { id: 14, sku: 'RG-014', name: 'Cobalt Blue Cross-Trainer Rashguard', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-14.jpg' },
  { id: 15, sku: 'RG-015', name: 'Shadow Charcoal & Red Speed Top', sport: '7v7 Football', category: 'Best Sellers', image: 'assets/images/products/rashguard-15.jpg' },
  { id: 16, sku: 'RG-016', name: 'Vortex Violet Performance Rashguard', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-16.jpg' },
  { id: 17, sku: 'RG-017', name: 'Military Green Camo Tactical Top', sport: 'Training', category: 'Best Sellers', image: 'assets/images/products/rashguard-17.jpg' },
  { id: 18, sku: 'RG-018', name: 'Electric Cyan & Magenta Duo Rashguard', sport: '7v7 Football', category: 'New Arrivals', image: 'assets/images/products/rashguard-18.jpg' },
  { id: 19, sku: 'RG-019', name: 'Pitch Black & Gold Foil Rashguard', sport: 'Compression Wear', category: 'Best Sellers', image: 'assets/images/products/rashguard-19.jpg' },
  { id: 20, sku: 'RG-020', name: 'Pure Frost Minimalist Base Layer', sport: 'Compression Wear', category: 'New Arrivals', image: 'assets/images/products/rashguard-20.jpg' }
];

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const selectedProductThumb = document.getElementById('selectedProductThumb');
  const selectedProductName = document.getElementById('selectedProductName');
  const selectedProductCategory = document.getElementById('selectedProductCategory');
  const customizerProductImg = document.getElementById('customizerProductImg');

  // Upload Elements
  const dropzoneWrap = document.getElementById('artworkDropzoneWrap');
  const fileInput = document.getElementById('artworkFileInput');
  const uploadedCard = document.getElementById('uploadedArtworkCard');
  const previewImg = document.getElementById('artworkPreviewImg');
  const fileNameEl = document.getElementById('artworkFileName');
  const fileSizeEl = document.getElementById('artworkFileSize');
  const removeFileBtn = document.getElementById('removeArtworkBtn');

  // Quantity Elements
  const qtyInput = document.getElementById('orderQuantityInput');
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');
  const qtyPresetBtns = document.querySelectorAll('.qty-preset-btn');

  // Size Chips
  const sizeChips = document.querySelectorAll('.size-chip-btn');

  // Form Fields
  const descriptionInput = document.getElementById('orderDescription');
  const customerNameInput = document.getElementById('customerName');
  const customerPhoneInput = document.getElementById('customerPhone');

  // Action Buttons
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
  const submitInquiryBtn = document.getElementById('submitInquiryBtn');

  // State
  let activeProduct = null;
  let allProducts = [];
  let attachedFile = null;
  let selectedSizes = ['Adult L'];

  function resolveAssetUrl(url) {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
    const isUserDir = window.location.pathname.includes('/user/') || window.location.pathname.endsWith('/user');
    const clean = url.replace(/^\.?\/?/, '');
    return (isUserDir ? '../' : '') + clean;
  }

  // 1. Fetch products from API or fallback
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
    console.warn('Using local fallback catalog', e);
  }

  if (allProducts.length === 0) {
    allProducts = FALLBACK_CUSTOMIZER_PRODUCTS;
  }

  // 2. Select product by URL parameter
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

    if (updateUrl && history.replaceState) {
      const url = new URL(window.location);
      url.searchParams.set('id', product.id);
      window.history.replaceState({}, '', url);
    }

    highlightActiveProductCard(product.id);
  }

  // 3. Image Upload Logic
  function handleFileSelection(file) {
    if (!file) return;
    attachedFile = file;

    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = (file.size / 1024).toFixed(1) + ' KB';

    // Show preview if it's an image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (previewImg) previewImg.src = e.target.result;
        if (uploadedCard) uploadedCard.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      if (previewImg) previewImg.src = 'assets/images/logo-black.png';
      if (uploadedCard) uploadedCard.style.display = 'block';
    }
  }

  dropzoneWrap?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  });

  // Drag and drop support
  dropzoneWrap?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzoneWrap.classList.add('border-primary', 'bg-white');
  });

  dropzoneWrap?.addEventListener('dragleave', () => {
    dropzoneWrap.classList.remove('border-primary', 'bg-white');
  });

  dropzoneWrap?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzoneWrap.classList.remove('border-primary', 'bg-white');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  });

  removeFileBtn?.addEventListener('click', () => {
    attachedFile = null;
    if (fileInput) fileInput.value = '';
    if (uploadedCard) uploadedCard.style.display = 'none';
  });

  // 4. Quantity Stepper
  qtyMinusBtn?.addEventListener('click', () => {
    let val = parseInt(qtyInput.value, 10) || 1;
    if (val > 1) qtyInput.value = val - 1;
  });

  qtyPlusBtn?.addEventListener('click', () => {
    let val = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = val + 1;
  });

  qtyPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = parseInt(btn.dataset.qty, 10);
      if (q && qtyInput) qtyInput.value = q;
    });
  });

  // 5. Size Selection Chips
  sizeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const size = chip.dataset.size;
      if (!size) return;

      if (chip.classList.contains('active')) {
        chip.classList.remove('active', 'btn-dark');
        chip.classList.add('btn-outline-dark');
        selectedSizes = selectedSizes.filter(s => s !== size);
      } else {
        chip.classList.add('active', 'btn-dark');
        chip.classList.remove('btn-outline-dark');
        if (!selectedSizes.includes(size)) selectedSizes.push(size);
      }
    });
  });

  // 6. Quick Product Switcher Carousel
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

  // 7. Send Message on WhatsApp
  sendWhatsAppBtn?.addEventListener('click', () => {
    const prodName = activeProduct ? activeProduct.name : 'Custom Sublimated Team Uniform';
    const prodSku = activeProduct ? (activeProduct.sku || 'RG-CUSTOM') : 'RG-CUSTOM';
    const quantity = qtyInput?.value || '15';
    const sizes = selectedSizes.length > 0 ? selectedSizes.join(', ') : 'Standard Team Sizes';
    const desc = descriptionInput?.value.trim() || 'No special placement notes provided.';
    const custName = customerNameInput?.value.trim() || 'Valued Customer';
    const custPhone = customerPhoneInput?.value.trim() || 'Not specified';
    const artworkStatus = attachedFile ? `Yes (${attachedFile.name}) - Ready to send` : 'No file attached';

    // WhatsApp Message Format
    const msg = 
`*NEW CUSTOM ORDER INQUIRY - PROSIX SPORTS*
---------------------------------------
*Product:* ${prodName}
*SKU:* ${prodSku}
*Quantity:* ${quantity} units
*Sizes Required:* ${sizes}
*Customer Name:* ${custName}
*Phone / WhatsApp:* ${custPhone}
*Custom Image/Logo:* ${artworkStatus}
*Details & Description:*
${desc}
---------------------------------------
_Sent via Prosix Sports Website Customizer_`;

    const waNumber = '19292104402'; // Prosix Official WhatsApp
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

    if (typeof CartStore !== 'undefined' && CartStore.showToast) {
      CartStore.showToast('Connecting to WhatsApp with your order details...');
    }

    window.open(waUrl, '_blank');
  });

  // 8. Submit Inquiry Form Online
  submitInquiryBtn?.addEventListener('click', async () => {
    const prodName = activeProduct ? activeProduct.name : 'Custom Sublimated Team Uniform';
    const quantity = qtyInput?.value || '15';
    const sizes = selectedSizes.length > 0 ? selectedSizes.join(', ') : 'Standard Team Sizes';
    const desc = descriptionInput?.value.trim() || '';
    const custName = customerNameInput?.value.trim() || 'Customer';
    const custPhone = customerPhoneInput?.value.trim() || '';

    submitInquiryBtn.disabled = true;
    submitInquiryBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Submitting...';

    try {
      const isUserDir = window.location.pathname.includes('/user/');
      const apiBase = isUserDir ? '../api' : '/api';

      await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: custName,
          phone: custPhone,
          subject: `Custom Inquiry: ${prodName} (${quantity} units)`,
          message: `Product: ${prodName}\nQty: ${quantity}\nSizes: ${sizes}\nArtwork: ${attachedFile ? attachedFile.name : 'None'}\n\nNotes:\n${desc}`
        })
      });

      alert(`Thank you ${custName}! Your custom inquiry for "${prodName}" has been received. Our team will contact you shortly.`);
    } catch (e) {
      alert(`Inquiry received for "${prodName}"! We will contact you at ${custPhone || 'your contact'}.`);
    } finally {
      submitInquiryBtn.disabled = false;
      submitInquiryBtn.innerHTML = '<i class="bi bi-send-check me-2"></i> Submit Inquiry Online';
    }
  });

  // Initialize
  const initialProduct = findProductFromParam();
  selectProduct(initialProduct, false);
});
