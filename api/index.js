const app = require('../backend/src/app');
const db = require('../backend/src/config/db');

let isDbInitialized = false;

// Middleware to ensure Neon / PostgreSQL connection & tables are created automatically
app.use(async (req, res, next) => {
  try {
    await db.initDB();
  } catch (err) {
    console.warn('DB initialization notice:', err.message);
  }
  next();
});

module.exports = app;
