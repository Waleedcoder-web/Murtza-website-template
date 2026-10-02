const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const poolConfig = connectionString
  ? {
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'prosix_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '1234',
      connectionTimeoutMillis: 3000
    };

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

let isConnected = false;

async function initDB() {
  try {
    const client = await pool.connect();
    isConnected = true;
    console.log('✅ PostgreSQL connected successfully to database:', process.env.DB_NAME || 'prosix_db');

    // Run Schema Migrations
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      await client.query(sql);
      console.log('✅ PostgreSQL schema verified & tables initialized.');
    }

    client.release();
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️ PostgreSQL connection notice: ${err.message}`);
    console.warn('ℹ️ Running backend with local memory persistence fallback.');
  }
}

// Unified Query Helper
async function query(text, params) {
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
  getIsConnected: () => isConnected
};
