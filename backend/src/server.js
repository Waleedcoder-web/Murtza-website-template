const path = require('path');
const { exec } = require('child_process');
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

// Fallback route for SPA / direct file browsing (ignore /api requests)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  if (req.path.startsWith('/admin')) {
    return res.sendFile(path.join(__dirname, '../../frontend/admin/index.html'));
  }
  return res.sendFile(path.join(__dirname, '../../frontend/user/index.html'));
});

// Function to automatically open user side in default browser (local only)
function openBrowser(url) {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) return;
  const platform = process.platform;
  let command = '';

  if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    command = `open "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (err) => {
    if (err) {
      console.warn(`Could not auto-launch browser: ${err.message}`);
    }
  });
}

// Start Server locally
app.listen(PORT, async () => {
  console.log('========================================================');
  console.log(`🚀 Prosix Sports Server running on port ${PORT}`);
  console.log(`👉 User Storefront:  http://localhost:${PORT}/`);
  console.log(`👉 Admin Dashboard:  http://localhost:${PORT}/admin`);
  console.log(`👉 API Endpoints:    http://localhost:${PORT}/api/products`);
  console.log('========================================================');

  // Initialize PostgreSQL
  await db.initDB();

  // Automatically open the user storefront in default browser
  setTimeout(() => {
    openBrowser(`http://localhost:${PORT}/`);
  }, 1000);
});
