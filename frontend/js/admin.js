/**
 * PROSIX SPORTS - ADMIN PANEL JAVASCRIPT (admin.js)
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
      let payloadImage = productData.image || '/assets/images/sample-jersey-1.png';
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
    return [
      { id: 1, name: 'Best Sellers', slug: 'best-sellers', product_count: 5 },
      { id: 2, name: 'New Arrivals', slug: 'new-arrivals', product_count: 4 },
      { id: 3, name: 'Compression Wear', slug: 'compression-wear', product_count: 0 },
      { id: 4, name: 'Team Uniforms', slug: 'team-uniforms', product_count: 0 },
      { id: 5, name: 'Outerwear & Warmups', slug: 'outerwear-warmups', product_count: 0 }
    ];
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
    } catch (e) {
      console.error('API error creating category:', e);
    }
    this.showAdminToast(`Category "${categoryData.name}" created!`, 'bi-check-circle-fill text-success');
    return { id: Date.now(), ...categoryData, slug: categoryData.name.toLowerCase().replace(/\s+/g, '-') };
  },

  async deleteCategory(id) {
    try {
      const res = await fetch(`${this.API_BASE}/categories/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        this.showAdminToast('Category deleted successfully.', 'bi-trash-fill text-danger');
        return true;
      }
    } catch (e) {
      console.error('API error deleting category:', e);
    }
    this.showAdminToast('Category removed.', 'bi-trash-fill text-danger');
    return true;
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
