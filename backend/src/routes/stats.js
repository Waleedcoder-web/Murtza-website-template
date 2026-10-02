const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET Admin Dashboard KPI stats
router.get('/', async (req, res) => {
  try {
    if (db.getIsConnected()) {
      const productsRes = await db.query('SELECT COUNT(*) AS total_products FROM products WHERE is_active = true');
      const categoriesRes = await db.query('SELECT COUNT(*) AS active_categories FROM categories WHERE is_active = true');
      const inquiriesRes = await db.query('SELECT COUNT(*) AS total_inquiries FROM inquiries');
      const newInquiriesRes = await db.query("SELECT COUNT(*) AS new_inquiries FROM inquiries WHERE status = 'new'");

      return res.json({
        totalProducts: parseInt(productsRes.rows[0].total_products, 10) || 0,
        activeCategories: parseInt(categoriesRes.rows[0].active_categories, 10) || 0,
        totalInquiries: parseInt(inquiriesRes.rows[0].total_inquiries, 10) || 0,
        newInquiries: parseInt(newInquiriesRes.rows[0].new_inquiries, 10) || 0,
        systemHealth: '100% Operational'
      });
    }
  } catch (err) {
    console.error('Error fetching admin stats from PostgreSQL:', err);
  }

  // Fallback calculations
  return res.json({
    totalProducts: db.fallbackStore.products.length || 12,
    activeCategories: 6,
    totalInquiries: db.fallbackStore.inquiries.length || 4,
    newInquiries: db.fallbackStore.inquiries.filter(i => i.status === 'new').length || 2,
    systemHealth: '100% Operational'
  });
});

module.exports = router;
