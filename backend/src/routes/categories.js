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
          COALESCE(p_count.total_products, 0)::int as product_count
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

// GET single category
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    if (db.getIsConnected()) {
      const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching category by ID:', err);
  }

  const cat = (db.fallbackStore.categories || []).find(c => c.id === id);
  if (cat) return res.json(cat);
  return res.status(404).json({ error: 'Category not found' });
});

// CREATE a category
router.post('/', async (req, res) => {
  const { name, description, image } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const cleanName = name.trim();
  const slug = generateSlug(cleanName) || `cat-${Date.now()}`;
  const cleanDesc = description ? description.trim() : '';
  const cleanImage = image ? image.trim() : '/assets/images/products/rashguard-1.jpg';

  try {
    if (db.getIsConnected()) {
      const result = await db.query(
        `INSERT INTO categories (name, slug, description, image, is_active)
         VALUES ($1, $2, $3, $4, true)
         ON CONFLICT (name) DO UPDATE 
         SET description = EXCLUDED.description,
             image = COALESCE(EXCLUDED.image, categories.image),
             is_active = true
         RETURNING *`,
        [cleanName, slug, cleanDesc, cleanImage]
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
    image: cleanImage,
    is_active: true,
    product_count: 0
  };
  db.fallbackStore.categories = db.fallbackStore.categories || [];
  db.fallbackStore.categories.push(newCat);
  return res.status(201).json(newCat);
});

// UPDATE a category
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description, image, is_active } = req.body;

  const cleanName = name ? name.trim() : null;
  const slug = cleanName ? generateSlug(cleanName) : null;
  const cleanDesc = description !== undefined ? description.trim() : null;
  const cleanImage = image !== undefined ? image.trim() : null;
  const cleanActive = is_active !== undefined ? Boolean(is_active) : true;

  try {
    if (db.getIsConnected()) {
      const result = await db.query(
        `UPDATE categories 
         SET name = COALESCE($1, name),
             slug = COALESCE($2, slug),
             description = COALESCE($3, description),
             image = COALESCE($4, image),
             is_active = $5
         WHERE id = $6
         RETURNING *`,
        [cleanName, slug, cleanDesc, cleanImage, cleanActive, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating category in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to update category: ' + err.message });
  }

  // Fallback memory store
  if (db.fallbackStore.categories) {
    const cat = db.fallbackStore.categories.find(c => c.id === id);
    if (cat) {
      if (cleanName) { cat.name = cleanName; cat.slug = slug; }
      if (cleanDesc !== null) cat.description = cleanDesc;
      if (cleanImage !== null) cat.image = cleanImage;
      if (is_active !== undefined) cat.is_active = cleanActive;
      return res.json(cat);
    }
  }
  return res.status(404).json({ error: 'Category not found' });
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
