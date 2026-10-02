const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let poolConfig;
if (connectionString) {
  const isLocalHost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  poolConfig = {
    connectionString,
    ssl: isLocalHost ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'prosix_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    connectionTimeoutMillis: 4000
  };
}

const pool = new Pool(poolConfig);

// Clean in-memory fallback store ready for user uploads
const fallbackStore = {
  products: [],
  inquiries: [],
  admin_users: [
    { id: 1, username: 'admin', email: 'admin@prosixsports.com', role: 'superadmin', is_active: true }
  ],
  categories: [
    { id: 1, name: 'Best Sellers', slug: 'best-sellers', description: 'Top performing and most ordered uniform sets', display_order: 1 },
    { id: 2, name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest season releases and modern cuts', display_order: 2 },
    { id: 3, name: 'Compression Wear', slug: 'compression-wear', description: 'Sublimated high-flex compression shirts & tights', display_order: 3 },
    { id: 4, name: 'Team Uniforms', slug: 'team-uniforms', description: 'Complete custom team kits and practice jerseys', display_order: 4 },
    { id: 5, name: 'Outerwear & Warmups', slug: 'outerwear-warmups', description: 'Sideline jackets, hoodies, and travel tracksuits', display_order: 5 }
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
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

INSERT INTO categories (name, slug, description)
VALUES 
  ('Best Sellers', 'best-sellers', 'Top performing uniform sets'),
  ('New Arrivals', 'new-arrivals', 'Latest uniform releases'),
  ('Compression Wear', 'compression-wear', 'High-flex compression shirts & tights'),
  ('Team Uniforms', 'team-uniforms', 'Custom team kits & practice uniforms'),
  ('Outerwear & Warmups', 'outerwear-warmups', 'Sideline jackets, hoodies & tracksuits')
ON CONFLICT (name) DO NOTHING;

INSERT INTO admin_users (username, email, password_hash, role)
VALUES ('admin', 'admin@prosixsports.com', '$2b$10$e8w8q8r4Q1234567890abcdef...', 'superadmin')
ON CONFLICT (username) DO NOTHING;
`;

let isConnected = false;
let initPromise = null;
let lastConnectionError = null;

async function initDB() {
  if (initPromise && isConnected) return initPromise;

  initPromise = (async () => {
    try {
      const client = await pool.connect();
      isConnected = true;
      lastConnectionError = null;
      console.log('✅ PostgreSQL connected to database successfully.');

      // Automatically create all tables and indexes if not created yet (Neon / Cloud / Local)
      await client.query(SCHEMA_SQL);
      console.log('✅ PostgreSQL schema verified & all tables automatically initialized in database.');

      client.release();
    } catch (err) {
      isConnected = false;
      lastConnectionError = err.message;
      console.warn(`⚠️ PostgreSQL connection notice: ${err.message}`);
      console.warn('ℹ️ Running backend with local memory persistence fallback.');
      initPromise = null; // Allow retry on subsequent calls
    }
  })();

  return initPromise;
}

// Unified Query Helper (auto-ensures init before query)
async function query(text, params) {
  if (!isConnected) {
    await initDB().catch(() => {});
  }
  if (isConnected) {
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
