const app = require('../backend/src/app');
const db = require('../backend/src/config/db');

let isDbInitialized = false;

// Middleware to ensure DB connection is initialized once
app.use(async (req, res, next) => {
  if (!isDbInitialized) {
    try {
      await db.initDB();
      isDbInitialized = true;
    } catch (err) {
      console.warn('DB initialization notice:', err.message);
    }
  }
  next();
});

module.exports = app;
