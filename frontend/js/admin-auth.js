/**
 * SNOWTOP SPORTS - ADMIN AUTHENTICATION GUARD
 * Protects all administrative pages from unauthorized access.
 * Redirects to login.html if not authenticated.
 */

(function () {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.endsWith('login.html') || currentPath.endsWith('login');
  const token = localStorage.getItem('snowtop_admin_token') || sessionStorage.getItem('snowtop_admin_token');

  // 1. Immediate Redirect Guard before DOM renders
  if (!isLoginPage && !token) {
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace('login.html?return=' + returnUrl);
    return;
  }

  // If on login page and already authenticated, send to dashboard
  if (isLoginPage && token) {
    window.location.replace('index.html');
    return;
  }

  // Helper function to resolve API URL
  function getApiBase() {
    if (window.location.protocol === 'file:') return 'http://localhost:5000/api';
    const host = window.location.hostname || '';
    const port = window.location.port || '';
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.');
    if (isLocal && port && port !== '5000') return `http://${host}:5000/api`;
    return '/api';
  }

  // 2. Background Token Verification
  if (!isLoginPage && token) {
    fetch(`${getApiBase()}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      if (!res.ok) {
        // Invalid or expired token
        localStorage.removeItem('snowtop_admin_token');
        sessionStorage.removeItem('snowtop_admin_token');
        localStorage.removeItem('snowtop_admin_user');
        window.location.replace('login.html?expired=1');
      }
    }).catch(err => {
      console.warn('Auth verification offline notice:', err.message);
    });
  }

  // 3. Global Logout Function
  window.logoutAdmin = function () {
    if (confirm('Are you sure you want to log out of Snowtop Sports Admin?')) {
      const activeToken = localStorage.getItem('snowtop_admin_token') || sessionStorage.getItem('snowtop_admin_token');
      try {
        fetch(`${getApiBase()}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
      } catch (e) {}

      localStorage.removeItem('snowtop_admin_token');
      sessionStorage.removeItem('snowtop_admin_token');
      localStorage.removeItem('snowtop_admin_user');
      window.location.replace('login.html');
    }
  };

  // 4. Populate admin identity on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const userStr = localStorage.getItem('snowtop_admin_user') || sessionStorage.getItem('snowtop_admin_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        document.querySelectorAll('.admin-user-display').forEach(el => {
          el.textContent = user.email || user.username || 'murtza@gmail.com';
        });
      } catch (e) {}
    }
  });

})();
