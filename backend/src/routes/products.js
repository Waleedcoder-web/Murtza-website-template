const express = require('express');
const router = express.Router();
const db = require('../config/db');

// SEED 20 RASHGUARD PRODUCTS (Cloud & Local)
router.all('/seed', async (req, res) => {
  const seedItems = [
    { sku: 'RG-001', name: 'Stealth Blackout Carbon Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-1.jpg', desc: 'Matte carbon fiber flank panels with dark grey flatlock ergonomic stitching.' },
    { sku: 'RG-002', name: 'Royal Cyan & Navy Compression Top', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-2.jpg', desc: 'Electric blue raglan sleeves with moisture-wicking contrast seam panels.' },
    { sku: 'RG-003', name: 'Crimson Velocity Armor Rashguard', price: 120.00, sport: '7v7 Football', category: '7v7 Football', image: '/assets/images/products/rashguard-3.jpg', desc: 'Charcoal base with geometric crimson shoulder panels and reinforced seams.' },
    { sku: 'RG-004', name: 'Volt Yellow Sprint Rashguard', price: 120.00, sport: 'American Football', category: 'American Football', image: '/assets/images/products/rashguard-4.jpg', desc: 'High-visibility neon volt yellow accents with multi-directional stretch.' },
    { sku: 'RG-005', name: 'Glacier White & Deep Navy Top', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-5.jpg', desc: 'Frost white torso with deep navy sleeves and ice-blue contour stitch.' },
    { sku: 'RG-006', name: 'Hyper Sunset Orange Rashguard', price: 120.00, sport: '7v7 Football', category: '7v7 Football', image: '/assets/images/products/rashguard-6.jpg', desc: 'Vibrant sunset orange with gunmetal velocity side panels.' },
    { sku: 'RG-007', name: 'Emerald Matrix Honeycomb Top', price: 120.00, sport: 'American Football', category: 'American Football', image: '/assets/images/products/rashguard-7.jpg', desc: 'Anthracite base with vibrant emerald green honeycomb matrix pattern.' },
    { sku: 'RG-008', name: 'Regal Purple Tournament Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-8.jpg', desc: 'Deep royal purple with metallic silver tournament contrast lines.' },
    { sku: 'RG-009', name: 'Desert Sand Tactical Camo Rashguard', price: 120.00, sport: 'Basketball', category: 'Basketball', image: '/assets/images/products/rashguard-9.jpg', desc: 'Sublimated tactical urban camo with reinforced elbow contours.' },
    { sku: 'RG-010', name: 'Oceanic Teal & Mint Base Layer', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-10.jpg', desc: 'Dark teal with mint green gradient transitions and antimicrobial fabric.' },
    { sku: 'RG-011', name: 'Solar Gold & Black Striker Top', price: 120.00, sport: '7v7 Football', category: '7v7 Football', image: '/assets/images/products/rashguard-11.jpg', desc: 'Jet black with high-voltage solar gold sleeves and ergonomic panels.' },
    { sku: 'RG-012', name: 'Bloodline Maroon Armor Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-12.jpg', desc: 'Matte black with bloodline maroon panels and red flatlock stitching.' },
    { sku: 'RG-013', name: 'Titanium Silver & Acid Lime Top', price: 120.00, sport: 'Basketball', category: 'Basketball', image: '/assets/images/products/rashguard-13.jpg', desc: 'Titanium grey body with acid lime geometric speed ribbing.' },
    { sku: 'RG-014', name: 'Cobalt Blue Cross-Trainer Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-14.jpg', desc: 'Cobalt blue with crisp white athletic raglan sleeve contours.' },
    { sku: 'RG-015', name: 'Shadow Charcoal & Red Speed Top', price: 120.00, sport: '7v7 Football', category: '7v7 Football', image: '/assets/images/products/rashguard-15.jpg', desc: 'Dark charcoal with crimson speed streaks and ventilation mesh panels.' },
    { sku: 'RG-016', name: 'Vortex Violet Performance Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-16.jpg', desc: 'Vortex violet with radiant coral gradient accents.' },
    { sku: 'RG-017', name: 'Military Green Camo Tactical Top', price: 120.00, sport: 'Basketball', category: 'Basketball', image: '/assets/images/products/rashguard-17.jpg', desc: 'Obsidian black with military green camo sleeves and rugged flatlock seams.' },
    { sku: 'RG-018', name: 'Electric Cyan & Magenta Duo Rashguard', price: 120.00, sport: '7v7 Football', category: '7v7 Football', image: '/assets/images/products/rashguard-18.jpg', desc: 'High-energy cyan and magenta contrast tournament compression wear.' },
    { sku: 'RG-019', name: 'Pitch Black & Gold Foil Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-19.jpg', desc: 'Championship gold foil geometric lines on premium ultra-stretch black spandex.' },
    { sku: 'RG-020', name: 'Pure Frost Minimalist Base Layer', price: 120.00, sport: 'Compression Wear', category: 'Compression Wear', image: '/assets/images/products/rashguard-20.jpg', desc: 'Clean frost white with steel grey technical stitching and moisture-wicking weave.' }
  ];

  try {
    for (const p of seedItems) {
      await db.query(
        `INSERT INTO products (name, sku, price, sport, category, image, type, description, is_featured, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, 'model', $7, true, true)
         ON CONFLICT (sku) DO NOTHING`,
        [p.name, p.sku, p.price, p.sport, p.category, p.image, p.desc]
      );
    }
    const countRes = await db.query('SELECT COUNT(*) FROM products');
    if (countRes && countRes.rows) {
      return res.json({ success: true, count: parseInt(countRes.rows[0].count, 10), message: 'All 20 rashguards seeded into database successfully!' });
    }
  } catch (err) {
    console.error('Error seeding products:', err);
    return res.status(500).json({ error: err.message });
  }

  return res.json({ success: true, count: db.fallbackStore.products.length, message: 'Products in local fallback store.' });
});

// GET all products (newest first)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE is_active = true ORDER BY id DESC');
    if (result && result.rows) {
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
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result && result.rows && result.rows.length > 0) {
      return res.json(result.rows[0]);
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
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const generatedSku = sku || `PRO-${Math.floor(100 + Math.random() * 900)}`;
  const cleanPrice = price !== undefined && price !== null && price !== '' ? parseFloat(price) : 0.00;
  const cleanSport = sport || '7v7 Football';
  const cleanCategory = category || cleanSport || 'Compression Wear';
  const cleanImage = image || '';
  const cleanType = type || 'model';
  const cleanDesc = description || `${cleanSport} performance uniform.`;

  try {
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
    if (result && result.rows && result.rows.length > 0) {
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

// UPDATE product (including its category, sport, etc.)
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, price, sport, category, image, type, sku, description, is_active } = req.body;

  const cleanName = name !== undefined && name !== null ? name.trim() : null;
  const cleanPrice = price !== undefined && price !== null && price !== '' ? parseFloat(price) : null;
  const cleanSport = sport !== undefined && sport !== null ? sport.trim() : null;
  const cleanCategory = category !== undefined && category !== null ? category.trim() : null;
  const cleanImage = image !== undefined && image !== null ? image.trim() : null;
  const cleanType = type !== undefined && type !== null ? type.trim() : null;
  const cleanSku = sku !== undefined && sku !== null ? sku.trim() : null;
  const cleanDesc = description !== undefined && description !== null ? description.trim() : null;
  const cleanActive = is_active !== undefined ? Boolean(is_active) : null;

  try {
    // If category is provided, auto-register in categories table if missing
    if (cleanCategory) {
      const catSlug = cleanCategory.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
      await db.query(
        `INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [cleanCategory, catSlug]
      ).catch(e => console.warn('Auto-category note on update:', e.message));
    }

    const result = await db.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           price = COALESCE($2, price),
           sport = COALESCE($3, sport),
           category = COALESCE($4, category),
           image = COALESCE($5, image),
           type = COALESCE($6, type),
           sku = COALESCE($7, sku),
           description = COALESCE($8, description),
           is_active = COALESCE($9, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [cleanName, cleanPrice, cleanSport, cleanCategory, cleanImage, cleanType, cleanSku, cleanDesc, cleanActive, id]
    );

    if (result && result.rows) {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating product in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to update product: ' + err.message });
  }

  // Fallback memory store
  const prod = db.fallbackStore.products.find(p => p.id === id);
  if (prod) {
    if (cleanName !== null) prod.name = cleanName;
    if (cleanPrice !== null) prod.price = cleanPrice;
    if (cleanSport !== null) prod.sport = cleanSport;
    if (cleanCategory !== null) prod.category = cleanCategory;
    if (cleanImage !== null) prod.image = cleanImage;
    if (cleanType !== null) prod.type = cleanType;
    if (cleanSku !== null) prod.sku = cleanSku;
    if (cleanDesc !== null) prod.description = cleanDesc;
    if (cleanActive !== null) prod.is_active = cleanActive;
    return res.json(prod);
  }

  return res.status(404).json({ error: 'Product not found' });
});

// DELETE product
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1', [id]);
    if (result) {
      return res.json({ success: true, message: 'Product deleted from database' });
    }
  } catch (err) {
    console.error('Error deleting product from PostgreSQL:', err);
  }
  db.fallbackStore.products = db.fallbackStore.products.filter(p => p.id !== id);
  return res.json({ success: true, message: 'Product deleted from store' });
});

module.exports = router;
