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

// GET all categories (Direct Neon PostgreSQL query with fallback)
router.get('/', async (req, res) => {
  try {
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
    if (result && result.rows) {
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching categories from PostgreSQL:', err);
  }

  if (db.fallbackStore.categories) {
    const prods = db.fallbackStore.products || [];
    const catsWithCounts = db.fallbackStore.categories.map(c => {
      const catNameLow = (c.name || '').toLowerCase();
      const catSlugLow = (c.slug || '').toLowerCase();
      const count = prods.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const pSport = (p.sport || '').toLowerCase();
        return (pCat === catNameLow || pSport === catNameLow || (catSlugLow && pCat === catSlugLow));
      }).length;
      return { ...c, product_count: count };
    });
    return res.json(catsWithCounts);
  }
  return res.json([]);
});

// GET single category
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result && result.rows && result.rows.length > 0) {
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching category by ID:', err);
  }

  const cat = (db.fallbackStore.categories || []).find(c => c.id == id || String(c.id) === String(id));
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
  const cleanImage = image ? image.trim() : '/assets/images/sport-7v7.png';

  try {
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
    if (result && result.rows && result.rows.length > 0) {
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
    if (result && result.rows) {
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
    const cat = db.fallbackStore.categories.find(c => c.id == id || String(c.id) === String(id));
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

// DELETE a category (with CASCADE deletion of related products)
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const catRes = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (catRes && catRes.rows) {
      if (catRes.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      const cat = catRes.rows[0];

      // Cascade delete associated products from Neon database
      const prodDelRes = await db.query(
        'DELETE FROM products WHERE LOWER(category) = LOWER($1) OR LOWER(sport) = LOWER($1) OR LOWER(category) = LOWER($2) RETURNING id',
        [cat.name, cat.slug]
      );

      // Delete category row from Neon database
      const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
      return res.json({
        success: true,
        message: `Category "${cat.name}" and ${prodDelRes.rows.length} associated product(s) deleted.`,
        deleted: result.rows[0],
        deletedProductsCount: prodDelRes.rows.length
      });
    }
  } catch (err) {
    console.error('Error deleting category from PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to delete category: ' + err.message });
  }

  if (db.fallbackStore.categories) {
    const idx = db.fallbackStore.categories.findIndex(c => c.id == id || String(c.id) === String(id));
    if (idx !== -1) {
      const [removedCat] = db.fallbackStore.categories.splice(idx, 1);
      const catNameLow = (removedCat.name || '').toLowerCase();
      const catSlugLow = (removedCat.slug || '').toLowerCase();
      let deletedProductsCount = 0;

      // Cascade delete related products from fallbackStore
      if (Array.isArray(db.fallbackStore.products)) {
        const initialLen = db.fallbackStore.products.length;
        db.fallbackStore.products = db.fallbackStore.products.filter(p => {
          const pCat = (p.category || '').toLowerCase();
          const pSport = (p.sport || '').toLowerCase();
          const matches = (pCat === catNameLow || pSport === catNameLow || (catSlugLow && pCat === catSlugLow));
          return !matches;
        });
        deletedProductsCount = initialLen - db.fallbackStore.products.length;
      }

      return res.json({
        success: true,
        message: `Category "${removedCat.name}" and ${deletedProductsCount} associated product(s) deleted.`,
        deleted: removedCat,
        deletedProductsCount
      });
    }
  }
  return res.status(404).json({ error: 'Category not found' });
});

module.exports = router;
