const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper to generate URL-friendly slug
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// GET all categories
router.get('/', async (req, res) => {
  try {
    if (db.getIsConnected()) {
      const result = await db.query(
        `SELECT c.*, 
          COALESCE(p_count.total_products, 0) as product_count
         FROM categories c
         LEFT JOIN (
           SELECT category, COUNT(*) as total_products 
           FROM products 
           WHERE is_active = true 
           GROUP BY category
         ) p_count ON LOWER(c.name) = LOWER(p_count.category)
         WHERE c.is_active = true
         ORDER BY c.id ASC`
      );
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching categories from PostgreSQL:', err);
  }
  return res.json(db.fallbackStore.categories || []);
});

// CREATE a category
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const cleanName = name.trim();
  const slug = generateSlug(cleanName) || `cat-${Date.now()}`;
  const cleanDesc = description ? description.trim() : null;

  try {
    if (db.getIsConnected()) {
      const result = await db.query(
        `INSERT INTO categories (name, slug, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE 
         SET description = COALESCE(EXCLUDED.description, categories.description), is_active = true
         RETURNING *`,
        [cleanName, slug, cleanDesc]
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error inserting category into PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to create category: ' + err.message });
  }

  // Fallback memory store
  const newCat = {
    id: Date.now(),
    name: cleanName,
    slug,
    description: cleanDesc,
    display_order: cleanOrder,
    product_count: 0
  };
  db.fallbackStore.categories = db.fallbackStore.categories || [];
  db.fallbackStore.categories.push(newCat);
  return res.status(201).json(newCat);
});

// DELETE a category
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    if (db.getIsConnected()) {
      const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.json({ success: true, message: 'Category deleted', deleted: result.rows[0] });
    }
  } catch (err) {
    console.error('Error deleting category from PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to delete category: ' + err.message });
  }

  if (db.fallbackStore.categories) {
    const idx = db.fallbackStore.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      const removed = db.fallbackStore.categories.splice(idx, 1);
      return res.json({ success: true, message: 'Category deleted', deleted: removed[0] });
    }
  }
  return res.status(404).json({ error: 'Category not found' });
});

module.exports = router;
