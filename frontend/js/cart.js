/**
 * PROSIX SPORTS - SHOPPING CART STORE (Vanilla JS)
 */

const CartStore = {
  CART_KEY: 'prosix_cart_items',

  getItems() {
    try {
      const data = localStorage.getItem(this.CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading cart', e);
      return [];
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(items));
      this.updateBadges();
      this.renderDrawer();
    } catch (e) {
      console.error('Error saving cart', e);
    }
  },

  addItem(item) {
    const items = this.getItems();
    const existing = items.find(i => i.id === item.id && i.size === (item.size || 'L'));
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
    } else {
      items.push({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price) || 0,
        image: item.image || 'assets/images/sample-jersey-1.png',
        size: item.size || 'L',
        quantity: item.quantity || 1,
        type: item.type || 'product'
      });
    }
    this.saveItems(items);
    this.showToast(`Added "${item.name}" to Cart!`);
  },

  removeItem(id, size) {
    let items = this.getItems();
    items = items.filter(i => !(i.id == id && i.size === size));
    this.saveItems(items);
  },

  updateQty(id, size, delta) {
    const items = this.getItems();
    const item = items.find(i => i.id == id && i.size === size);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        return this.removeItem(id, size);
      }
      this.saveItems(items);
    }
  },

  getCount() {
    return this.getItems().reduce((sum, i) => sum + (i.quantity || 1), 0);
  },

  getTotal() {
    return this.getItems().reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
  },

  updateBadges() {
    const count = this.getCount();
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  renderDrawer() {
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotalAmount');
    if (!container) return;

    const items = this.getItems();
    if (items.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-bag-x fs-1 text-muted mb-3 d-block"></i>
          <h5 class="fw-bold">Your Cart is Empty</h5>
          <p class="text-muted small">Browse our catalogue and find your favorite team wear!</p>
          <a href="catalogue.html" class="btn btn-dark btn-sm rounded-pill px-4 mt-2">Shop Now</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      return;
    }

    let html = '';
    items.forEach(item => {
      html += `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h6 class="cart-item-title">${item.name}</h6>
            <div class="cart-item-meta">Size: <strong>${item.size}</strong> | $${item.price.toFixed(2)}</div>
            <div class="cart-qty-ctrls">
              <button class="qty-btn" onclick="CartStore.updateQty(${item.id}, '${item.size}', -1)">-</button>
              <span class="fw-bold px-2">${item.quantity}</span>
              <button class="qty-btn" onclick="CartStore.updateQty(${item.id}, '${item.size}', 1)">+</button>
              <button class="btn btn-link text-danger p-0 ms-auto small" onclick="CartStore.removeItem(${item.id}, '${item.size}')">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (subtotalEl) {
      subtotalEl.textContent = `$${this.getTotal().toFixed(2)}`;
    }
  },

  showToast(message) {
    let toast = document.getElementById('globalToastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CartStore.updateBadges();
  CartStore.renderDrawer();
});
