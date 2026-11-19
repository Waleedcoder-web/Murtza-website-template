const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let pool = null;
if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10
  });
}

// Clean in-memory fallback store ready for user uploads
const fallbackStore = {
  products: [
    { id: 1, sku: 'RG-001', name: 'Stealth Blackout Carbon Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Best Sellers', image: '/assets/images/products/rashguard-1.jpg', type: 'model', description: 'Matte carbon fiber flank panels with dark grey flatlock ergonomic stitching.', is_active: true },
    { id: 2, sku: 'RG-002', name: 'Royal Cyan & Navy Compression Top', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-2.jpg', type: 'model', description: 'Electric blue raglan sleeves with moisture-wicking contrast seam panels.', is_active: true },
    { id: 3, sku: 'RG-003', name: 'Crimson Velocity Armor Rashguard', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/products/rashguard-3.jpg', type: 'model', description: 'Charcoal base with geometric crimson shoulder panels and reinforced seams.', is_active: true },
    { id: 4, sku: 'RG-004', name: 'Volt Yellow Sprint Rashguard', price: 120.00, sport: 'Training', category: 'New Arrivals', image: '/assets/images/products/rashguard-4.jpg', type: 'model', description: 'High-visibility neon volt yellow accents with multi-directional stretch.', is_active: true },
    { id: 5, sku: 'RG-005', name: 'Glacier White & Deep Navy Top', price: 120.00, sport: 'Compression Wear', category: 'Best Sellers', image: '/assets/images/products/rashguard-5.jpg', type: 'model', description: 'Frost white torso with deep navy sleeves and ice-blue contour stitch.', is_active: true },
    { id: 6, sku: 'RG-006', name: 'Hyper Sunset Orange Rashguard', price: 120.00, sport: '7v7 Football', category: 'New Arrivals', image: '/assets/images/products/rashguard-6.jpg', type: 'model', description: 'Vibrant sunset orange with gunmetal velocity side panels.', is_active: true },
    { id: 7, sku: 'RG-007', name: 'Emerald Matrix Honeycomb Top', price: 120.00, sport: 'Training', category: 'Best Sellers', image: '/assets/images/products/rashguard-7.jpg', type: 'model', description: 'Anthracite base with vibrant emerald green honeycomb matrix pattern.', is_active: true },
    { id: 8, sku: 'RG-008', name: 'Regal Purple Tournament Rashguard', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-8.jpg', type: 'model', description: 'Deep royal purple with metallic silver tournament contrast lines.', is_active: true },
    { id: 9, sku: 'RG-009', name: 'Desert Sand Tactical Camo Rashguard', price: 120.00, sport: 'Training', category: 'Best Sellers', image: '/assets/images/products/rashguard-9.jpg', type: 'model', description: 'Sublimated tactical urban camo with reinforced elbow contours.', is_active: true },
    { id: 10, sku: 'RG-010', name: 'Oceanic Teal & Mint Base Layer', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-10.jpg', type: 'model', description: 'Dark teal with mint green gradient transitions and antimicrobial fabric.', is_active: true },
    { id: 11, sku: 'RG-011', name: 'Solar Gold & Black Striker Top', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/products/rashguard-11.jpg', type: 'model', description: 'Jet black with high-voltage solar gold sleeves and ergonomic panels.', is_active: true },
    { id: 12, sku: 'RG-012', name: 'Bloodline Maroon Armor Rashguard', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-12.jpg', type: 'model', description: 'Matte black with bloodline maroon panels and red flatlock stitching.', is_active: true },
    { id: 13, sku: 'RG-013', name: 'Titanium Silver & Acid Lime Top', price: 120.00, sport: 'Training', category: 'Best Sellers', image: '/assets/images/products/rashguard-13.jpg', type: 'model', description: 'Titanium grey body with acid lime geometric speed ribbing.', is_active: true },
    { id: 14, sku: 'RG-014', name: 'Cobalt Blue Cross-Trainer Rashguard', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-14.jpg', type: 'model', description: 'Cobalt blue with crisp white athletic raglan sleeve contours.', is_active: true },
    { id: 15, sku: 'RG-015', name: 'Shadow Charcoal & Red Speed Top', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/products/rashguard-15.jpg', type: 'model', description: 'Dark charcoal with crimson speed streaks and ventilation mesh panels.', is_active: true },
    { id: 16, sku: 'RG-016', name: 'Vortex Violet Performance Rashguard', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-16.jpg', type: 'model', description: 'Vortex violet with radiant coral gradient accents.', is_active: true },
    { id: 17, sku: 'RG-017', name: 'Military Green Camo Tactical Top', price: 120.00, sport: 'Training', category: 'Best Sellers', image: '/assets/images/products/rashguard-17.jpg', type: 'model', description: 'Obsidian black with military green camo sleeves and rugged flatlock seams.', is_active: true },
    { id: 18, sku: 'RG-018', name: 'Electric Cyan & Magenta Duo Rashguard', price: 120.00, sport: '7v7 Football', category: 'New Arrivals', image: '/assets/images/products/rashguard-18.jpg', type: 'model', description: 'High-energy cyan and magenta contrast tournament compression wear.', is_active: true },
    { id: 19, sku: 'RG-019', name: 'Pitch Black & Gold Foil Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Best Sellers', image: '/assets/images/products/rashguard-19.jpg', type: 'model', description: 'Championship gold foil geometric lines on premium ultra-stretch black spandex.', is_active: true },
    { id: 20, sku: 'RG-020', name: 'Pure Frost Minimalist Base Layer', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-20.jpg', type: 'model', description: 'Clean frost white with steel grey technical stitching and moisture-wicking weave.', is_active: true }
  ],
  inquiries: [],
  orders: [],
  admin_users: [
    { id: 1, username: 'murtza', email: 'murtza@gmail.com', role: 'superadmin', password_hash: 'c256808d6a23e034b0f70dba55e16e5e:e3b6a7b46bc948f662720f8adbef6a7de6e30013691f2e1ff7a23f900a1a2f6a53651d6b7314dcbb3f0d2787f791f7ab9d0df5e968669e0d2f6f32b1a1726aaa', is_active: true }
  ],
  categories: [
    { id: 1, name: '7v7 Football', slug: '7v7', image: '/assets/images/sport-7v7.png', description: 'Non-padded 7v7 tournament uniforms & practice compression gear', is_active: true, product_count: 5 },
    { id: 2, name: 'American Football', slug: 'american-football', image: '/assets/images/sport-american-football.png', description: 'Tackle & flag American football jerseys, pants & practice uniforms', is_active: true, product_count: 2 },
    { id: 3, name: 'Basketball', slug: 'basketball', image: '/assets/images/sport-basketball.png', description: 'Championship basketball jerseys, reversible kits & speed-mesh shorts', is_active: true, product_count: 4 },
    { id: 4, name: 'Baseball', slug: 'baseball', image: '/assets/images/sport-baseball.png', description: 'Custom button-down & two-button sublimated baseball jerseys', is_active: true, product_count: 2 },
    { id: 5, name: 'Cheer', slug: 'cheer', image: '/assets/images/sport-cheer.png', description: 'Cheerleading performance tops, skirts, warm-ups & sideline wear', is_active: true, product_count: 1 },
    { id: 6, name: 'Ice Hockey', slug: 'hockey', image: '/assets/images/sport-hockey.png', description: 'Heavyweight pro-mesh ice hockey sweaters & practice jerseys', is_active: true, product_count: 1 },
    { id: 7, name: 'Lacrosse', slug: 'lacrosse', image: '/assets/images/sport-lacrosse.png', description: 'Custom reversible lacrosse pinnies, game jerseys & shooter shirts', is_active: true, product_count: 1 },
    { id: 8, name: 'Soccer', slug: 'soccer', image: '/assets/images/sport-soccer.png', description: 'Sublimated match soccer kits, goalie kits & training tops', is_active: true, product_count: 2 },
    { id: 9, name: 'Track & Field', slug: 'track', image: '/assets/images/sport-track.png', description: 'Ultra-lightweight speed singlets, split shorts & running tights', is_active: true, product_count: 2 },
    { id: 10, name: 'Volleyball', slug: 'volleyball', image: '/assets/images/sport-volleyball.png', description: 'Long sleeve & sleeveless sublimated athletic volleyball jerseys', is_active: true, product_count: 2 },
    { id: 11, name: 'Wrestling', slug: 'wrestling', image: '/assets/images/sport-wrestling.png', description: 'Custom sublimated wrestling singlets, compression tops & fight shorts', is_active: true, product_count: 3 },
    { id: 12, name: 'Compression Wear', slug: 'compression-wear', image: '/assets/images/sport-7v7.png', description: 'High-flex compression shirts, rashguards & base layers', is_active: true, product_count: 8 },
    { id: 13, name: 'Best Sellers', slug: 'best-sellers', image: '/assets/images/sport-basketball.png', description: 'Top performing and most ordered uniform sets', is_active: true, product_count: 10 },
    { id: 14, name: 'New Arrivals', slug: 'new-arrivals', image: '/assets/images/sport-soccer.png', description: 'Latest season releases and modern cuts', is_active: true, product_count: 10 }
  ],
  hero_slides: [],
  special_offers: {
    id: 1,
    heading: 'SEASON SPECIAL OFFERS',
    subheading: 'Save up to 40% on select bulk team packages and seasonal uniform designs',
    featured_title: '',
    featured_desc: '',
    featured_btn_text: 'GET PACKAGE QUOTE',
    featured_btn_link: 'placeorder.html',
    featured_image: ''
  },
  featured_banners: [],
  deal_cards: []
};

const SCHEMA_SQL = `
-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image TEXT;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    price NUMERIC(10, 2) NOT NULL DEFAULT 120.00,
    sport VARCHAR(100) DEFAULT '7v7 Football',
    category VARCHAR(100) DEFAULT 'New Arrivals',
    image TEXT DEFAULT '',
    description TEXT,
    sizes_available JSONB DEFAULT '["Youth S","Youth M","Youth L","Adult S","Adult M","Adult L","Adult XL","Adult 2XL","Adult 3XL"]',
    type VARCHAR(50) DEFAULT 'model',
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer Inquiries & Leads Table
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) DEFAULT 'Contact Form',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    sport VARCHAR(100),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    project_details TEXT,
    budget_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    reply_notes TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'superadmin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Storefront Hero Slides Table
CREATE TABLE IF NOT EXISTS storefront_hero (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    btn_text VARCHAR(100) DEFAULT 'Shop The Collection',
    btn_link VARCHAR(255) DEFAULT 'catalogue.html',
    banner_image TEXT NOT NULL,
    athlete_image TEXT DEFAULT '',
    slide_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Storefront Season Special Offers Table (Main Section Heading)
CREATE TABLE IF NOT EXISTS storefront_offers (
    id SERIAL PRIMARY KEY,
    heading VARCHAR(255) DEFAULT 'SEASON SPECIAL OFFERS',
    subheading TEXT DEFAULT 'Save up to 40% on select bulk team packages and seasonal uniform designs',
    featured_title VARCHAR(255) DEFAULT '',
    featured_desc TEXT DEFAULT '',
    featured_btn_text VARCHAR(100) DEFAULT 'GET PACKAGE QUOTE',
    featured_btn_link VARCHAR(255) DEFAULT 'placeorder.html',
    featured_image TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6b. Storefront Multiple Featured Deal Banners Table
CREATE TABLE IF NOT EXISTS storefront_featured_banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    btn_text VARCHAR(100) DEFAULT 'GET PACKAGE QUOTE',
    btn_link VARCHAR(255) DEFAULT 'placeorder.html',
    banner_image TEXT NOT NULL,
    banner_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Storefront Special Deal Cards Table
CREATE TABLE IF NOT EXISTS storefront_deal_cards (
    id SERIAL PRIMARY KEY,
    badge VARCHAR(50) NOT NULL,
    title VARCHAR(255) DEFAULT 'Deal Jersey',
    image TEXT NOT NULL,
    link_url VARCHAR(255) DEFAULT 'product-details.html',
    card_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_sport ON products(sport);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON inquiries(type);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_deal_cards_order ON storefront_deal_cards(card_order);
CREATE INDEX IF NOT EXISTS idx_hero_order ON storefront_hero(slide_order);

-- Initial Base Records (Safe on conflict)
INSERT INTO storefront_offers (id, heading, subheading, featured_title, featured_desc, featured_btn_text, featured_btn_link, featured_image)
VALUES (1, 'SEASON SPECIAL OFFERS', 'Save up to 40% on select bulk team packages and seasonal uniform designs', '', '', 'GET PACKAGE QUOTE', 'placeorder.html', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (name, slug, description, image)
VALUES 
  ('7v7 Football', '7v7', 'Non-padded 7v7 tournament uniforms & practice compression gear', '/assets/images/sport-7v7.png'),
  ('American Football', 'american-football', 'Tackle & flag American football jerseys, pants & practice uniforms', '/assets/images/sport-american-football.png'),
  ('Basketball', 'basketball', 'Championship basketball jerseys, reversible kits & speed-mesh shorts', '/assets/images/sport-basketball.png'),
  ('Baseball', 'baseball', 'Custom button-down & two-button sublimated baseball jerseys', '/assets/images/sport-baseball.png'),
  ('Cheer', 'cheer', 'Cheerleading performance tops, skirts, warm-ups & sideline wear', '/assets/images/sport-cheer.png'),
  ('Ice Hockey', 'hockey', 'Heavyweight pro-mesh ice hockey sweaters & practice jerseys', '/assets/images/sport-hockey.png'),
  ('Lacrosse', 'lacrosse', 'Custom reversible lacrosse pinnies, game jerseys & shooter shirts', '/assets/images/sport-lacrosse.png'),
  ('Soccer', 'soccer', 'Sublimated match soccer kits, goalie kits & training tops', '/assets/images/sport-soccer.png'),
  ('Track & Field', 'track', 'Ultra-lightweight speed singlets, split shorts & running tights', '/assets/images/sport-track.png'),
  ('Volleyball', 'volleyball', 'Long sleeve & sleeveless sublimated athletic volleyball jerseys', '/assets/images/sport-volleyball.png'),
  ('Wrestling', 'wrestling', 'Custom sublimated wrestling singlets, compression tops & fight shorts', '/assets/images/sport-wrestling.png'),
  ('Compression Wear', 'compression-wear', 'High-flex compression shirts, rashguards & base layers', '/assets/images/sport-7v7.png'),
  ('Best Sellers', 'best-sellers', 'Top performing and most ordered uniform sets', '/assets/images/sport-basketball.png'),
  ('New Arrivals', 'new-arrivals', 'Latest season releases and modern cuts', '/assets/images/sport-soccer.png')
ON CONFLICT (name) DO UPDATE SET 
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  slug = EXCLUDED.slug;

INSERT INTO admin_users (username, email, password_hash, role)
VALUES ('murtza', 'murtza@gmail.com', 'c256808d6a23e034b0f70dba55e16e5e:e3b6a7b46bc948f662720f8adbef6a7de6e30013691f2e1ff7a23f900a1a2f6a53651d6b7314dcbb3f0d2787f791f7ab9d0df5e968669e0d2f6f32b1a1726aaa', 'superadmin')
ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash;

INSERT INTO products (name, sku, price, sport, category, image, type, description, is_featured, is_active)
VALUES 
  ('Stealth Blackout Carbon Rashguard', 'RG-001', 120.00, 'Compression Wear', 'Best Sellers', '/assets/images/products/rashguard-1.jpg', 'model', 'Matte carbon fiber flank panels with dark grey flatlock ergonomic stitching.', true, true),
  ('Royal Cyan & Navy Compression Top', 'RG-002', 120.00, 'Compression Wear', 'New Arrivals', '/assets/images/products/rashguard-2.jpg', 'model', 'Electric blue raglan sleeves with moisture-wicking contrast seam panels.', true, true),
  ('Crimson Velocity Armor Rashguard', 'RG-003', 120.00, '7v7 Football', 'Best Sellers', '/assets/images/products/rashguard-3.jpg', 'model', 'Charcoal base with geometric crimson shoulder panels and reinforced seams.', true, true),
  ('Volt Yellow Sprint Rashguard', 'RG-004', 120.00, 'Training', 'New Arrivals', '/assets/images/products/rashguard-4.jpg', 'model', 'High-visibility neon volt yellow accents with multi-directional stretch.', true, true),
  ('Glacier White & Deep Navy Top', 'RG-005', 120.00, 'Compression Wear', 'Best Sellers', '/assets/images/products/rashguard-5.jpg', 'model', 'Frost white torso with deep navy sleeves and ice-blue contour stitch.', true, true),
  ('Hyper Sunset Orange Rashguard', 'RG-006', 120.00, '7v7 Football', 'New Arrivals', '/assets/images/products/rashguard-6.jpg', 'model', 'Vibrant sunset orange with gunmetal velocity side panels.', true, true),
  ('Emerald Matrix Honeycomb Top', 'RG-007', 120.00, 'Training', 'Best Sellers', '/assets/images/products/rashguard-7.jpg', 'model', 'Anthracite base with vibrant emerald green honeycomb matrix pattern.', true, true),
  ('Regal Purple Tournament Rashguard', 'RG-008', 120.00, 'Compression Wear', 'New Arrivals', '/assets/images/products/rashguard-8.jpg', 'model', 'Deep royal purple with metallic silver tournament contrast lines.', true, true),
  ('Desert Sand Tactical Camo Rashguard', 'RG-009', 120.00, 'Training', 'Best Sellers', '/assets/images/products/rashguard-9.jpg', 'model', 'Sublimated tactical urban camo with reinforced elbow contours.', true, true),
  ('Oceanic Teal & Mint Base Layer', 'RG-010', 120.00, 'Compression Wear', 'New Arrivals', '/assets/images/products/rashguard-10.jpg', 'model', 'Dark teal with mint green gradient transitions and antimicrobial fabric.', true, true),
  ('Solar Gold & Black Striker Top', 'RG-011', 120.00, '7v7 Football', 'Best Sellers', '/assets/images/products/rashguard-11.jpg', 'model', 'Jet black with high-voltage solar gold sleeves and ergonomic panels.', true, true),
  ('Bloodline Maroon Armor Rashguard', 'RG-012', 120.00, 'Compression Wear', 'New Arrivals', '/assets/images/products/rashguard-12.jpg', 'model', 'Matte black with bloodline maroon panels and red flatlock stitching.', true, true),
  ('Titanium Silver & Acid Lime Top', 'RG-013', 120.00, 'Training', 'Best Sellers', '/assets/images/products/rashguard-13.jpg', 'model', 'Titanium grey body with acid lime geometric speed ribbing.', true, true),
  ('Cobalt Blue Cross-Trainer Rashguard', 'RG-014', 120.00, 'Compression Wear', 'New Arrivals', '/assets/images/products/rashguard-14.jpg', 'model', 'Cobalt blue with crisp white athletic raglan sleeve contours.', true, true),
  ('Shadow Charcoal & Red Speed Top', 'RG-015', 120.00, '7v7 Football', 'Best Sellers', '/assets/images/products/rashguard-15.jpg', 'model', 'Dark charcoal with crimson speed streaks and ventilation mesh panels.', true, true),
  ('Vortex Violet Performance Rashguard', 'RG-016', 120.00, 'Compression Wear', 'New Arrivals', '/assets/images/products/rashguard-16.jpg', 'model', 'Vortex violet with radiant coral gradient accents.', true, true),
  ('Military Green Camo Tactical Top', 'RG-017', 120.00, 'Training', 'Best Sellers', '/assets/images/products/rashguard-17.jpg', 'model', 'Obsidian black with military green camo sleeves and rugged flatlock seams.', true, true),
  ('Electric Cyan & Magenta Duo Rashguard', 'RG-018', 120.00, '7v7 Football', 'New Arrivals', '/assets/images/products/rashguard-18.jpg', 'model', 'High-energy cyan and magenta contrast tournament compression wear.', true, true),
  ('Pitch Black & Gold Foil Rashguard', 'RG-019', 120.00, 'Compression Wear', 'Best Sellers', '/assets/images/products/rashguard-19.jpg', 'model', 'Championship gold foil geometric lines on premium ultra-stretch black spandex.', true, true),
  ('Pure Frost Minimalist Base Layer', 'RG-020', 120.00, 'Compression Wear', 'New Arrivals', '/assets/images/products/rashguard-20.jpg', 'model', 'Clean frost white with steel grey technical stitching and moisture-wicking weave.', true, true)
ON CONFLICT (sku) DO NOTHING;
`;

let isConnected = false;
let initPromise = null;
let lastConnectionError = null;

async function initDB() {
  if (!pool) {
    isConnected = false;
    lastConnectionError = 'No DATABASE_URL set. Running in cloud fallback mode (Neon / Vercel ready).';
    return;
  }

  if (initPromise && isConnected) return initPromise;

  initPromise = (async () => {
    try {
      const client = await pool.connect();
      isConnected = true;
      lastConnectionError = null;
      console.log('✅ Neon / Cloud PostgreSQL connected successfully.');

      // Automatically create all tables and indexes if not created yet (Neon / Cloud)
      await client.query(SCHEMA_SQL);
      console.log('✅ Neon PostgreSQL schema verified & all tables automatically initialized.');

      client.release();
    } catch (err) {
      isConnected = false;
      lastConnectionError = err.message;
      console.warn(`⚠️ Cloud Database notice: ${err.message}`);
      initPromise = null; // Allow retry on subsequent calls
    }
  })();

  return initPromise;
}

// Unified Query Helper (auto-ensures init before query)
async function query(text, params) {
  if (!pool) return null;
  if (!isConnected) {
    await initDB().catch(() => {});
  }
  if (isConnected && pool) {
    return pool.query(text, params);
  }
  return null;
}

module.exports = {
  pool,
  initDB,
  query,
  fallbackStore,
  getIsConnected: () => isConnected,
  getLastError: () => lastConnectionError,
  SCHEMA_SQL
};
