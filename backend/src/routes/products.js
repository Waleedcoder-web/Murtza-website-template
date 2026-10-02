const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all products (newest first)
router.get('/', async (req, res) => {
  try {
    if (db.getIsConnected()) {
      const result = await db.query('SELECT * FROM products WHERE is_active = true ORDER BY id DESC');
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Error querying products from PostgreSQL:', err);
  }
  return res.json(db.fallbackStore.products);
});

// GET single product
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    if (db.getIsConnected()) {
      const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error querying single product from PostgreSQL:', err);
  }
  const item = db.fallbackStore.products.find(p => p.id === id);
  if (item) return res.json(item);
  return res.status(404).json({ error: 'Product not found' });
});

// CREATE new product
router.post('/', async (req, res) => {
  const { name, price, sport, category, image, type, sku, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const generatedSku = sku || `PRO-${Math.floor(100 + Math.random() * 900)}`;
  const cleanPrice = parseFloat(price);
  const cleanSport = sport || '7v7 Football';
  const cleanCategory = category || 'New Arrivals';
  const cleanImage = image || '/assets/images/sample-jersey-1.png';
  const cleanType = type || 'model';
  const cleanDesc = description || `${cleanSport} performance uniform.`;

  try {
    if (db.getIsConnected()) {
      // Auto-register category if not present
      if (cleanCategory) {
        const catSlug = cleanCategory.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
        await db.query(
          `INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [cleanCategory.trim(), catSlug]
        ).catch(e => {
          console.warn('Auto-category note:', e.message);
        });
      }

      const result = await db.query(
        `INSERT INTO products (name, sku, price, sport, category, image, type, description) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [name, generatedSku, cleanPrice, cleanSport, cleanCategory, cleanImage, cleanType, cleanDesc]
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error inserting product into PostgreSQL:', err);
  }

  const newProduct = {
    id: Date.now(),
    name,
    sku: generatedSku,
    price: cleanPrice,
    sport: cleanSport,
    category: cleanCategory,
    image: cleanImage,
    type: cleanType,
    description: cleanDesc
  };
  db.fallbackStore.products.unshift(newProduct);
  return res.status(201).json(newProduct);
});

// DELETE product
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    if (db.getIsConnected()) {
      await db.query('DELETE FROM products WHERE id = $1', [id]);
      return res.json({ success: true, message: 'Product deleted from database' });
    }
  } catch (err) {
    console.error('Error deleting product from PostgreSQL:', err);
  }
  db.fallbackStore.products = db.fallbackStore.products.filter(p => p.id !== id);
  return res.json({ success: true, message: 'Product deleted from store' });
});

module.exports = router;
