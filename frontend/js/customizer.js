/**
 * SNOWTOP SPORTS - CUSTOM APPAREL INQUIRY & ORDER ENGINE
 * Supports:
 * 1. Image / Artwork / Mockup upload with immediate thumbnail preview & remove option
 * 2. Men/Unisex vs Women's Cut Fit selector
 * 3. Dynamic size chips (XS-5XL for Men, XS-3XL for Women)
 * 4. Interactive collapsible Size Chart & 7-point How to Measure Guide
 * 5. Order quantity stepper & quick-select presets
 * 6. Direct WhatsApp Order Confirmation
 * 7. Factory Direct Order Inquiry Form with online API submission & WhatsApp fallback
 */

const FALLBACK_CUSTOMIZER_PRODUCTS = [
  { id: 1, sku: 'RG-001', name: 'Stealth Blackout Carbon Rashguard', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-1.jpg' },
  { id: 2, sku: 'RG-002', name: 'Royal Cyan & Navy Compression Top', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-2.jpg' },
  { id: 3, sku: 'RG-003', name: 'Crimson Velocity Armor Rashguard', sport: '7v7 Football', category: '7v7 Football', image: 'assets/images/products/rashguard-3.jpg' },
  { id: 4, sku: 'RG-004', name: 'Volt Yellow Sprint Rashguard', sport: 'American Football', category: 'American Football', image: 'assets/images/products/rashguard-4.jpg' },
  { id: 5, sku: 'RG-005', name: 'Glacier White & Deep Navy Top', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-5.jpg' },
  { id: 6, sku: 'RG-006', name: 'Hyper Sunset Orange Rashguard', sport: '7v7 Football', category: '7v7 Football', image: 'assets/images/products/rashguard-6.jpg' },
  { id: 7, sku: 'RG-007', name: 'Emerald Matrix Honeycomb Top', sport: 'American Football', category: 'American Football', image: 'assets/images/products/rashguard-7.jpg' },
  { id: 8, sku: 'RG-008', name: 'Regal Purple Tournament Rashguard', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-8.jpg' },
  { id: 9, sku: 'RG-009', name: 'Desert Sand Tactical Camo Rashguard', sport: 'Basketball', category: 'Basketball', image: 'assets/images/products/rashguard-9.jpg' },
  { id: 10, sku: 'RG-010', name: 'Oceanic Teal & Mint Base Layer', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-10.jpg' },
  { id: 11, sku: 'RG-011', name: 'Solar Gold & Black Striker Top', sport: '7v7 Football', category: '7v7 Football', image: 'assets/images/products/rashguard-11.jpg' },
  { id: 12, sku: 'RG-012', name: 'Bloodline Maroon Armor Rashguard', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-12.jpg' },
  { id: 13, sku: 'RG-013', name: 'Titanium Silver & Acid Lime Top', sport: 'Basketball', category: 'Basketball', image: 'assets/images/products/rashguard-13.jpg' },
  { id: 14, sku: 'RG-014', name: 'Cobalt Blue Cross-Trainer Rashguard', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-14.jpg' },
  { id: 15, sku: 'RG-015', name: 'Shadow Charcoal & Red Speed Top', sport: '7v7 Football', category: '7v7 Football', image: 'assets/images/products/rashguard-15.jpg' },
  { id: 16, sku: 'RG-016', name: 'Vortex Violet Performance Rashguard', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-16.jpg' },
  { id: 17, sku: 'RG-017', name: 'Military Green Camo Tactical Top', sport: 'Basketball', category: 'Basketball', image: 'assets/images/products/rashguard-17.jpg' },
  { id: 18, sku: 'RG-018', name: 'Electric Cyan & Magenta Duo Rashguard', sport: '7v7 Football', category: '7v7 Football', image: 'assets/images/products/rashguard-18.jpg' },
  { id: 19, sku: 'RG-019', name: 'Pitch Black & Gold Foil Rashguard', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-19.jpg' },
  { id: 20, sku: 'RG-020', name: 'Pure Frost Minimalist Base Layer', sport: 'Compression Wear', category: 'Compression Wear', image: 'assets/images/products/rashguard-20.jpg' }
];

const MEN_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
const WOMEN_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const ADMIN_WHATSAPP = '923040999605';
const COMPANY_NAME = 'Snowtop Sports';
const ADMIN_EMAIL = 'snowtopsports@gmail.com';

let currentProduct = null;
let allProducts = [];
let attachedFile = null;
let selectedGender = 'men';
let selectedSize = 'L';
let orderQty = 15;

function resolveAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  const isUserDir = window.location.pathname.includes('/user/') || window.location.pathname.endsWith('/user');
  const clean = url.replace(/^\.?\/?/, '');
  return (isUserDir ? '../' : '') + clean;
}

function getApiBase() {
  if (window.location.protocol === 'file:') return 'http://localhost:5000/api';
  const isUserDir = window.location.pathname.includes('/user/') || window.location.pathname.endsWith('/user');
  const host = window.location.hostname || '';
  const port = window.location.port || '';
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.');
  if (isLocal && port && port !== '5000') return `http://${host}:5000/api`;
  return isUserDir ? '../api' : '/api';
}

// 1. Gender / Fit Handler
function setGender(gender) {
  selectedGender = gender;
  const btnMen = document.getElementById('btnGenderMen');
  const btnWomen = document.getElementById('btnGenderWomen');
  const label = document.getElementById('genderLabelDisplay');

  if (gender === 'men') {
    if (btnMen) btnMen.className = 'gender-pill-btn active';
    if (btnWomen) btnWomen.className = 'gender-pill-btn';
    if (label) label.textContent = 'Men / Unisex';
    renderSizeChips(MEN_SIZES);
    switchChartTab('men');
  } else {
    if (btnMen) btnMen.className = 'gender-pill-btn';
    if (btnWomen) btnWomen.className = 'gender-pill-btn active';
    if (label) label.textContent = "Women's Cut";
    renderSizeChips(WOMEN_SIZES);
    switchChartTab('women');
  }
}

// 2. Size Chips Rendering
function renderSizeChips(sizes) {
  const wrap = document.getElementById('sizeSelectorWrap');
  if (!wrap) return;

  if (!sizes.includes(selectedSize)) {
    selectedSize = sizes.includes('L') ? 'L' : sizes[0];
  }
  const lbl = document.getElementById('selectedSizeLabel');
  if (lbl) lbl.textContent = selectedSize;

  wrap.innerHTML = sizes.map(s => `
    <button type="button" class="size-badge-btn ${s === selectedSize ? 'active' : ''}" onclick="selectSize(this, '${s}')">${s}</button>
  `).join('');
}

function selectSize(btn, size) {
  document.querySelectorAll('#sizeSelectorWrap .size-badge-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = size;
  const lbl = document.getElementById('selectedSizeLabel');
  if (lbl) lbl.textContent = size;
}

// 3. Size Chart Tab Switching
function switchChartTab(tab) {
  const pMen = document.getElementById('chartPaneMen');
  const pWomen = document.getElementById('chartPaneWomen');
  const pMeasure = document.getElementById('chartPaneMeasure');
  const tMen = document.getElementById('tabMenChartBtn');
  const tWomen = document.getElementById('tabWomenChartBtn');
  const tMeasure = document.getElementById('tabMeasureBtn');

  if (pMen) pMen.style.display = (tab === 'men') ? 'block' : 'none';
  if (pWomen) pWomen.style.display = (tab === 'women') ? 'block' : 'none';
  if (pMeasure) pMeasure.style.display = (tab === 'measure') ? 'block' : 'none';

  if (tMen) tMen.className = `btn btn-sm rounded-pill px-3 py-1 fw-bold ${tab === 'men' ? 'btn-dark' : 'btn-outline-dark'}`;
  if (tWomen) tWomen.className = `btn btn-sm rounded-pill px-3 py-1 fw-bold ${tab === 'women' ? 'btn-dark' : 'btn-outline-dark'}`;
  if (tMeasure) tMeasure.className = `btn btn-sm rounded-pill px-3 py-1 fw-bold ${tab === 'measure' ? 'btn-dark' : 'btn-outline-dark'}`;
}

// 4. Quantity Adjustments
function adjustQty(delta) {
  orderQty = Math.max(1, orderQty + delta);
  const input = document.getElementById('productQtyInput');
  if (input) input.value = orderQty;
}

function setPresetQty(q) {
  orderQty = q;
  const input = document.getElementById('productQtyInput');
  if (input) input.value = orderQty;
}

// 5. Country Selector Initialization & Live Validation Listeners
function initCountrySelector() {
  const countrySelect = document.getElementById('inqCountry');
  const dialPrefix = document.getElementById('inqDialCodePrefix');
  const phoneInput = document.getElementById('inqPhone');

  if (countrySelect && dialPrefix) {
    const updateDialCode = () => {
      const code = countrySelect.value;
      dialPrefix.textContent = code === '+other' ? '+' : code;
      if (phoneInput) {
        if (code === '+1') phoneInput.placeholder = '(555) 019-2834';
        else if (code === '+44') phoneInput.placeholder = '7911 123456';
        else if (code === '+92') phoneInput.placeholder = '304 0999605';
        else if (code === '+971') phoneInput.placeholder = '50 123 4567';
        else if (code === '+61') phoneInput.placeholder = '412 345 678';
        else phoneInput.placeholder = 'Phone number';
      }
    };
    countrySelect.addEventListener('change', updateDialCode);
    updateDialCode();
  }

  // Live input validation clearers
  const inputs = ['inqName', 'inqEmail', 'inqPhone', 'inqAddress', 'inqNotes'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('is-invalid');
        const alertBox = document.getElementById('formValidationAlert');
        if (alertBox) alertBox.classList.add('d-none');
      });
    }
  });
}

// Validation Helper
function validateCustomOrderForm() {
  let isValid = true;
  let firstInvalidEl = null;

  const nameEl = document.getElementById('inqName');
  const emailEl = document.getElementById('inqEmail');
  const phoneEl = document.getElementById('inqPhone');
  const addressEl = document.getElementById('inqAddress');
  const notesEl = document.getElementById('inqNotes');
  const alertBox = document.getElementById('formValidationAlert');
  const alertText = document.getElementById('formValidationAlertText');
  const sizeWrap = document.getElementById('sizeSelectorWrap');

  // 1. Size Validation
  const sizeNotice = document.getElementById('sizeValidationNotice');
  if (sizeNotice) sizeNotice.remove();
  if (sizeWrap) sizeWrap.classList.remove('border', 'border-danger', 'p-2', 'rounded-3');

  if (!selectedSize || selectedSize.trim() === '') {
    isValid = false;
    if (sizeWrap) {
      sizeWrap.classList.add('border', 'border-danger', 'p-2', 'rounded-3');
      const notice = document.createElement('div');
      notice.id = 'sizeValidationNotice';
      notice.className = 'text-danger small fw-bold mt-1';
      notice.innerHTML = '<i class="bi bi-exclamation-circle-fill me-1"></i> Please select a uniform size (e.g. S, M, L, XL).';
      sizeWrap.parentNode.appendChild(notice);
      if (!firstInvalidEl) firstInvalidEl = sizeWrap;
    }
  }

  // 2. Full Name Validation
  const nameVal = nameEl ? nameEl.value.trim() : '';
  if (!nameVal || nameVal.length < 2) {
    isValid = false;
    if (nameEl) {
      nameEl.classList.add('is-invalid');
      if (!firstInvalidEl) firstInvalidEl = nameEl;
    }
  } else if (nameEl) {
    nameEl.classList.remove('is-invalid');
  }

  // 3. Email Address Validation
  const emailVal = emailEl ? emailEl.value.trim() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal || !emailRegex.test(emailVal)) {
    isValid = false;
    if (emailEl) {
      emailEl.classList.add('is-invalid');
      if (!firstInvalidEl) firstInvalidEl = emailEl;
    }
  } else if (emailEl) {
    emailEl.classList.remove('is-invalid');
  }

  // 4. Phone Number Validation (digits only, 7 to 15 digits)
  const phoneVal = phoneEl ? phoneEl.value.trim().replace(/[\s\-\(\)\.]/g, '') : '';
  if (!phoneVal || phoneVal.length < 7 || phoneVal.length > 15 || !/^\d+$/.test(phoneVal) || /^0+$/.test(phoneVal)) {
    isValid = false;
    if (phoneEl) {
      phoneEl.classList.add('is-invalid');
      if (!firstInvalidEl) firstInvalidEl = phoneEl;
    }
  } else if (phoneEl) {
    phoneEl.classList.remove('is-invalid');
  }

  // 5. Shipping / Delivery Address Validation
  const addressVal = addressEl ? addressEl.value.trim() : '';
  if (!addressVal || addressVal.length < 8) {
    isValid = false;
    if (addressEl) {
      addressEl.classList.add('is-invalid');
      if (!firstInvalidEl) firstInvalidEl = addressEl;
    }
  } else if (addressEl) {
    addressEl.classList.remove('is-invalid');
  }

  // 6. Custom Instructions / Notes Validation
  const notesVal = notesEl ? notesEl.value.trim() : '';
  if (!notesVal || notesVal.length < 5) {
    isValid = false;
    if (notesEl) {
      notesEl.classList.add('is-invalid');
      if (!firstInvalidEl) firstInvalidEl = notesEl;
    }
  } else if (notesEl) {
    notesEl.classList.remove('is-invalid');
  }

  if (!isValid) {
    if (alertBox && alertText) {
      alertText.textContent = 'Please fill out all required fields with valid details (including Country, Size, and Delivery Address).';
      alertBox.classList.remove('d-none');
    }
    if (firstInvalidEl && typeof firstInvalidEl.scrollIntoView === 'function') {
      firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof firstInvalidEl.focus === 'function') firstInvalidEl.focus();
    }
  } else if (alertBox) {
    alertBox.classList.add('d-none');
  }

  return isValid;
}

// 6. WhatsApp Order Generation
function handleWhatsAppOrder() {
  const prodName = currentProduct ? currentProduct.name : 'Custom Sublimated Team Uniform';
  const prodSku = currentProduct ? (currentProduct.sku || 'PRO-CUSTOM') : 'PRO-CUSTOM';
  const sport = currentProduct ? (currentProduct.sport || 'Custom Sportswear') : 'Custom Sportswear';
  const fitText = (selectedGender === 'women') ? "Women's Cut" : "Men / Unisex";
  const name = document.getElementById('inqName')?.value.trim() || '';
  const countryEl = document.getElementById('inqCountry');
  const countryName = countryEl ? countryEl.options[countryEl.selectedIndex].getAttribute('data-name') : 'Not specified';
  const dialCode = countryEl ? countryEl.value : '+92';
  const rawPhone = document.getElementById('inqPhone')?.value.trim() || '';
  const fullPhone = rawPhone ? `${dialCode} ${rawPhone}` : 'Not provided';
  const address = document.getElementById('inqAddress')?.value.trim() || 'Not provided yet';
  const notes = document.getElementById('inqNotes')?.value.trim() || 'Custom factory inquiry for digital mockups and pricing.';
  const artworkStatus = attachedFile ? `Yes (${attachedFile.name}) - Attached` : 'No file uploaded yet';

  const msg = 
`*NEW CUSTOM ORDER CONFIRMATION - SNOWTOP SPORTS*
---------------------------------------
*Product:* ${prodName}
*SKU:* ${prodSku}
*Sport Category:* ${sport}
*Fit / Gender:* ${fitText}
*Size Selected:* ${selectedSize}
*Order Quantity:* ${orderQty} pieces
*Artwork / Logo:* ${artworkStatus}

*CUSTOMER & SHIPPING DETAILS:*
*Customer Name:* ${name || 'Valued Customer'}
*Country:* ${countryName}
*Phone / WhatsApp:* ${fullPhone}
*Delivery Address:*
${address}

*CUSTOM ORDER INSTRUCTIONS:*
${notes}
---------------------------------------
*Page URL:* ${window.location.href}
_Sent via Snowtop Sports Customizer Studio_`;

  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
}

// 7. Direct Inquiry & Order Confirmation Form Submission
async function handleInquirySubmit(e) {
  e.preventDefault();

  // Run comprehensive validation
  if (!validateCustomOrderForm()) {
    return;
  }

  const name = document.getElementById('inqName').value.trim();
  const email = document.getElementById('inqEmail').value.trim();
  const countryEl = document.getElementById('inqCountry');
  const countryName = countryEl.options[countryEl.selectedIndex].getAttribute('data-name');
  const countryFlag = countryEl.options[countryEl.selectedIndex].getAttribute('data-flag') || '🌐';
  const dialCode = countryEl.value === '+other' ? '' : countryEl.value;
  const rawPhone = document.getElementById('inqPhone').value.trim().replace(/[\s\-\(\)\.]/g, '');
  const fullPhone = `${dialCode} ${rawPhone}`.trim();
  const address = document.getElementById('inqAddress').value.trim();
  const notes = document.getElementById('inqNotes').value.trim();
  const submitBtn = document.getElementById('inquirySubmitBtn');

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Generating Factory Order Ticket...`;

  const fitText = (selectedGender === 'women') ? "Women's Cut" : "Men / Unisex";
  const prodName = currentProduct ? currentProduct.name : 'Custom Sublimated Uniform';
  const prodSku = currentProduct ? (currentProduct.sku || 'PRO-CUSTOM') : 'PRO-CUSTOM';
  const artworkStatus = attachedFile ? `Yes (${attachedFile.name})` : 'None';

  let orderNumber = 'PO-' + Math.floor(100000 + Math.random() * 900000);

  // 1. Send Order to /api/orders
  try {
    const orderPayload = {
      customer_name: name,
      email: email,
      phone: fullPhone,
      team_name: prodName,
      sport: (currentProduct && currentProduct.sport) ? currentProduct.sport : 'Custom Sportswear',
      delivery_date: null,
      items_count: orderQty,
      total: 0,
      notes: `SKU: ${prodSku} | Fit: ${fitText} | Size: ${selectedSize} | Qty: ${orderQty} pcs\nCountry: ${countryName}\nDelivery Address:\n${address}\nArtwork: ${artworkStatus}\n\nCustom Instructions:\n${notes}`
    };

    const res = await fetch(`${getApiBase()}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (res.ok) {
      const orderData = await res.json();
      if (orderData.order_number) orderNumber = orderData.order_number;
    }
  } catch (err) {
    console.warn('Orders API notice:', err);
  }

  // 2. Backup to /api/contact
  try {
    await fetch(`${getApiBase()}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: fullPhone,
        subject: `Custom Order Ticket [${orderNumber}]: ${prodName} (${selectedSize}, ${orderQty} pcs)`,
        message: `Order Number: ${orderNumber}\nProduct: ${prodName} (${prodSku})\nFit: ${fitText}\nSize: ${selectedSize}\nQuantity: ${orderQty} pcs\nArtwork: ${artworkStatus}\n\nShipping Address:\n${address}\n\nCustom Instructions:\n${notes}`
      })
    });
  } catch (err) {
    console.warn('Contact API notice:', err);
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = `<i class="bi bi-shield-check me-2"></i> Confirm Custom Order Details`;

  // 3. Populate Confirmation Modal Elements
  const modalOrderNoEl = document.getElementById('modalOrderNumber');
  const modalProdNameEl = document.getElementById('modalProdName');
  const modalFitGenderEl = document.getElementById('modalFitGender');
  const modalSizeEl = document.getElementById('modalSize');
  const modalQtyEl = document.getElementById('modalQty');
  const modalArtworkEl = document.getElementById('modalArtwork');
  const modalCustomerNameEl = document.getElementById('modalCustomerName');
  const modalEmailEl = document.getElementById('modalEmail');
  const modalPhoneEl = document.getElementById('modalPhone');
  const modalAddressEl = document.getElementById('modalAddress');
  const modalNotesEl = document.getElementById('modalNotes');
  const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

  if (modalOrderNoEl) modalOrderNoEl.textContent = orderNumber;
  if (modalProdNameEl) modalProdNameEl.textContent = prodName;
  if (modalFitGenderEl) modalFitGenderEl.textContent = fitText;
  if (modalSizeEl) modalSizeEl.textContent = selectedSize;
  if (modalQtyEl) modalQtyEl.textContent = `${orderQty} pieces`;
  if (modalArtworkEl) modalArtworkEl.textContent = artworkStatus;
  if (modalCustomerNameEl) modalCustomerNameEl.textContent = name;
  if (modalEmailEl) modalEmailEl.textContent = email;
  if (modalPhoneEl) modalPhoneEl.textContent = `${countryFlag} ${fullPhone}`;
  if (modalAddressEl) modalAddressEl.textContent = address;
  if (modalNotesEl) modalNotesEl.textContent = notes;

  // Format WhatsApp Link
  const fullWaMessage = 
`*OFFICIAL ORDER CONFIRMATION TICKET: ${orderNumber}*
---------------------------------------
Hello Snowtop Sports Factory! I have submitted my official order inquiry:

*Order Reference:* ${orderNumber}
*Product:* ${prodName} (${prodSku})
*Fit / Gender:* ${fitText}
*Size Selected:* ${selectedSize}
*Order Quantity:* ${orderQty} pieces
*Artwork Attached:* ${artworkStatus}

*CUSTOMER & SHIPPING DETAILS:*
*Customer:* ${name}
*Email:* ${email}
*Phone:* ${fullPhone}
*Delivery Address:*
${address}

*CUSTOM ORDER INSTRUCTIONS:*
${notes}
---------------------------------------
Please confirm production schedule and factory wholesale invoice!`;

  if (modalWhatsAppBtn) {
    modalWhatsAppBtn.href = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(fullWaMessage)}`;
  }

  // Show Modal
  const modalEl = document.getElementById('orderConfirmationModal');
  if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    const modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
  } else {
    alert(`Order Confirmed! Reference Ticket: ${orderNumber}\nAn email confirmation and factory ticket have been generated.`);
  }
}

// 7. Product Selection
function selectProduct(product, updateUrl = true) {
  if (!product) return;
  currentProduct = product;

  const resolvedImg = resolveAssetUrl(product.image);
  const nameEl = document.getElementById('customizerProductName');
  const skuEl = document.getElementById('customizerProductSku');
  const catEl = document.getElementById('customizerProductCategory');
  const sportTag = document.getElementById('headerSportTag');
  const imgEl = document.getElementById('customizerProductImg');

  if (nameEl) nameEl.textContent = product.name.toUpperCase();
  if (skuEl) skuEl.textContent = `SKU: ${product.sku || 'PRO-' + product.id}`;
  if (catEl) catEl.textContent = (product.sport || product.category || 'Compression Wear').toUpperCase();
  if (sportTag) sportTag.textContent = (product.sport || 'CUSTOM SPORTSWEAR').toUpperCase();
  if (imgEl) imgEl.src = resolvedImg;

  if (updateUrl && history.replaceState) {
    const url = new URL(window.location);
    url.searchParams.set('id', product.id);
    window.history.replaceState({}, '', url);
  }

  highlightActiveCard(product.id);
}

function highlightActiveCard(id) {
  const container = document.getElementById('customizerProductSwitcher');
  if (!container) return;
  container.querySelectorAll('.product-mini-select-card').forEach(c => {
    const isMatch = String(c.dataset.id) === String(id);
    c.classList.toggle('active', isMatch);
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  // Render Men sizes by default
  renderSizeChips(MEN_SIZES);

  // Upload elements
  const dropzoneWrap = document.getElementById('artworkDropzoneWrap');
  const fileInput = document.getElementById('artworkFileInput');
  const uploadedCard = document.getElementById('uploadedArtworkCard');
  const previewImg = document.getElementById('artworkPreviewImg');
  const fileNameEl = document.getElementById('artworkFileName');
  const fileSizeEl = document.getElementById('artworkFileSize');
  const removeFileBtn = document.getElementById('removeArtworkBtn');

  function handleFile(file) {
    if (!file) return;
    attachedFile = file;

    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = (file.size / 1024).toFixed(1) + ' KB';

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

  dropzoneWrap?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  });

  dropzoneWrap?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzoneWrap.classList.add('dragover');
  });
  dropzoneWrap?.addEventListener('dragleave', () => dropzoneWrap.classList.remove('dragover'));
  dropzoneWrap?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzoneWrap.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  removeFileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    attachedFile = null;
    if (fileInput) fileInput.value = '';
    if (uploadedCard) uploadedCard.style.display = 'none';
  });

  // Initialize Country selector and real-time validation listeners
  initCountrySelector();

  // Fetch product list
  try {
    const res = await fetch(`${getApiBase()}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allProducts = data;
      }
    }
  } catch (err) {
    console.warn('Using fallback products', err);
  }

  if (allProducts.length === 0) {
    allProducts = FALLBACK_CUSTOMIZER_PRODUCTS;
  }

  // Populate Switcher Strip
  const switcherContainer = document.getElementById('customizerProductSwitcher');
  if (switcherContainer) {
    switcherContainer.innerHTML = allProducts.map(p => {
      const img = resolveAssetUrl(p.image);
      return `
        <div class="product-mini-select-card" data-id="${p.id}" onclick="selectProductFromCard('${p.id}')">
          <img src="${img}" alt="${p.name}" style="width: 100%; height: 85px; object-fit: contain; margin-bottom: 6px;">
          <div class="fw-bold text-dark text-truncate small" style="font-size: 0.76rem;">${p.name}</div>
          <span class="badge bg-light text-muted border text-uppercase" style="font-size: 0.64rem;">${p.sport || 'Pro'}</span>
        </div>
      `;
    }).join('');
  }

  // Initial Product selection from URL ?id=X
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');
  let targetProduct = allProducts[0];
  if (idParam) {
    const match = allProducts.find(p => String(p.id) === String(idParam));
    if (match) targetProduct = match;
  }
  selectProduct(targetProduct, false);
});

// Card click wrapper
function selectProductFromCard(id) {
  const prod = allProducts.find(p => String(p.id) === String(id));
  if (prod) selectProduct(prod, true);
}
