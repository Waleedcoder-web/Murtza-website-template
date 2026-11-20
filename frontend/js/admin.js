/**
 * SNOWTOP SPORTS - ADMIN PANEL JAVASCRIPT (admin.js)
 * Live Integration with PostgreSQL API & Products/Inquiries Management
 */

function getApiBase() {
  if (window.location.protocol === 'file:') return 'http://localhost:5000/api';
  const host = window.location.hostname || '';
  const port = window.location.port || '';
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.');
  if (isLocal && port && port !== '5000') return `http://${host}:5000/api`;
  return '/api';
}

function resolveAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  const clean = url.startsWith('/') ? url : '/' + url;
  if (window.location.protocol === 'file:') return 'http://localhost:5000' + clean;
  const host = window.location.hostname || '';
  const port = window.location.port || '';
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.');
  if (isLocal && port && port !== '5000') return `http://${host}:5000` + clean;
  return clean;
}

const AdminApp = {
  API_BASE: getApiBase(),
  resolveAssetUrl: resolveAssetUrl,

  // Fallback initial data if server is started standalone
  mockData: {
    stats: {
      totalProducts: 0,
      activeCategories: 5,
      totalInquiries: 0,
      systemHealth: '100% Operational'
    },
    inquiries: [],
    products: []
  },

  async checkHealth() {
    try {
      const res = await fetch(`${this.API_BASE}/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Health check not reachable', e);
    }
    return null;
  },

  async fetchStats() {
    try {
      const res = await fetch(`${this.API_BASE}/stats`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API not reachable, using local data', e);
    }
    return this.mockData.stats;
  },

  async fetchInquiries() {
    try {
      const res = await fetch(`${this.API_BASE}/contact`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('API error fetching inquiries', e);
    }
    return this.mockData.inquiries;
  },

  async fetchProducts() {
    try {
      const res = await fetch(`${this.API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map(p => ({
            ...p,
            image: resolveAssetUrl(p.image)
          }));
        }
      }
    } catch (e) {
      console.warn('API error fetching products', e);
    }
    return [];
  },

  async createProduct(productData) {
    try {
      // Ensure backend receives standard absolute or relative image path
      let payloadImage = productData.image || '';
      if (payloadImage.startsWith('../')) {
        payloadImage = payloadImage.replace(/^\.\./, '');
      }

      const res = await fetch(`${this.API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productData.name,
          price: productData.price,
          sport: productData.sport,
          category: productData.category || 'New Arrivals',
          image: payloadImage,
          description: productData.description || ''
        })
      });

      if (res.ok) {
        const created = await res.json();
        this.showAdminToast(`Product "${created.name}" published to database & storefront!`, 'bi-check-circle-fill text-success');
        return created;
      }
    } catch (e) {
      console.error('API error creating product:', e);
    }

    // Fallback local memory
    productData.id = Date.now();
    this.mockData.products.unshift(productData);
    this.showAdminToast(`Product added locally: ${productData.name}`, 'bi-check-circle-fill text-success');
    return productData;
  },

  async updateProduct(id, productData) {
    try {
      let payloadImage = productData.image;
      if (productData.imageFile) {
        payloadImage = await this.uploadImage(productData.imageFile);
      }

      const res = await fetch(`${this.API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productData.name,
          sku: productData.sku,
          price: productData.price,
          sport: productData.sport,
          category: productData.category,
          image: payloadImage,
          description: productData.description,
          is_active: productData.is_active
        })
      });

      if (res.ok) {
        const updated = await res.json();
        this.showAdminToast(`Product "${updated.name}" updated successfully!`, 'bi-check-circle-fill text-success');
        return updated;
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to update product');
    } catch (e) {
      console.error('API error updating product:', e);
      this.showAdminToast('Error updating product: ' + e.message, 'bi-exclamation-triangle-fill text-warning');
      throw e;
    }
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${this.API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        this.showAdminToast('Product deleted from database & catalog.', 'bi-trash-fill text-danger');
        return true;
      }
    } catch (e) {
      console.error('API error deleting product:', e);
    }

    this.mockData.products = this.mockData.products.filter(p => p.id !== id);
    this.showAdminToast('Product removed.', 'bi-trash-fill text-danger');
    return true;
  },

  async fetchCategories() {
    try {
      const res = await fetch(`${this.API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('API error fetching categories', e);
    }
    return [];
  },

  async createCategory(categoryData) {
    try {
      const res = await fetch(`${this.API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (res.ok) {
        const created = await res.json();
        this.showAdminToast(`Category "${created.name}" created!`, 'bi-check-circle-fill text-success');
        return created;
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to create category');
    } catch (e) {
      console.error('API error creating category:', e);
      this.showAdminToast('Error creating category: ' + e.message, 'bi-exclamation-triangle-fill text-warning');
      throw e;
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const res = await fetch(`${this.API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (res.ok) {
        const updated = await res.json();
        this.showAdminToast(`Category "${updated.name}" updated!`, 'bi-check-circle-fill text-success');
        return updated;
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to update category');
    } catch (e) {
      console.error('API error updating category:', e);
      this.showAdminToast('Error updating category: ' + e.message, 'bi-exclamation-triangle-fill text-warning');
      throw e;
    }
  },

  async deleteCategory(id) {
    const res = await fetch(`${this.API_BASE}/categories/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      const data = await res.json();
      const count = data.deletedProductsCount || 0;
      const msg = count > 0 
        ? `Category and ${count} associated product(s) deleted permanently.` 
        : 'Category deleted successfully.';
      this.showAdminToast(msg, 'bi-trash-fill text-danger');
      return data;
    }
    const errData = await res.json().catch(() => ({}));
    const errMsg = errData.error || 'Failed to delete category';
    this.showAdminToast(errMsg, 'bi-exclamation-triangle-fill text-warning');
    throw new Error(errMsg);
  },

  async uploadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file provided'));
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const res = await fetch(`${this.API_BASE}/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              data: base64Data
            })
          });
          if (res.ok) {
            const data = await res.json();
            resolve(data);
          } else {
            const err = await res.json();
            reject(new Error(err.error || 'Upload failed'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  async replyToInquiry(id) {
    try {
      await fetch(`${this.API_BASE}/contact/${id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply_notes: 'Response proposal sent.' })
      });
    } catch (e) {}

    const inquiry = this.mockData.inquiries.find(i => i.id === id);
    if (inquiry) inquiry.status = 'replied';
    this.showAdminToast('Proposal & response dispatched!', 'bi-check-circle-fill text-success');
  },

  showAdminToast(msg, iconClass = 'bi-bell-fill text-info') {
    let toast = document.getElementById('adminToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adminToast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi ${iconClass} fs-5"></i> <span>${msg}</span>`;
    toast.style.display = 'inline-flex';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.style.display = 'none';
    }, 2800);
  }
};
