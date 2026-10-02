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

// Fallback Store in case PostgreSQL connection drops
const fallbackStore = {
  products: [
    { id: 287, sku: 'PRO-287', name: 'Chargers Jersey Designs', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-1.png', type: 'model' },
    { id: 288, sku: 'PRO-288', name: 'Football Pro Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-2.png', type: 'model' },
    { id: 289, sku: 'PRO-289', name: 'Wolfpack Jersey Designs', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-3.png', type: 'model' },
    { id: 290, sku: 'PRO-290', name: 'Patriots Jersey Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-4.png', type: 'model' },
    { id: 291, sku: 'PRO-291', name: 'Hawks Elite Designs', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-5.png', type: 'model' },
    { id: 296, sku: 'PRO-296', name: 'Army Camo Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-6.png', type: 'model' },
    { id: 297, sku: 'PRO-297', name: 'Vikings Jersey Designs', price: 120.00, sport: 'Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-7.png', type: 'model' },
    { id: 299, sku: 'PRO-299', name: 'Bears Jersey Designs', price: 120.00, sport: 'Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-8.png', type: 'model' },
    { id: 302, sku: 'PRO-302', name: 'Ohio Athletic Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-9.png', type: 'model' },
    { id: 324, sku: 'PRO-324', name: 'Eagles Jersey Designs', price: 120.00, sport: 'Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-10.png', type: 'model' },
    { id: 332, sku: 'PRO-332', name: 'Broncos Jersey Designs', price: 120.00, sport: 'Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-11.png', type: 'model' },
    { id: 336, sku: 'PRO-336', name: 'Seahawks Pro Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-12.png', type: 'model' }
  ],
  inquiries: [
    { id: 1, type: 'Contact Form', name: 'Coach Sarah Jenkins', email: 'sarah@velocity.com', phone: '+1 (555) 882-1928', sport: '7v7 Football', subject: 'Bulk Re-order for Regional Tournament (35 sets)', message: 'Need 35 sets.', status: 'new' },
    { id: 2, type: 'Website Request', name: 'David Ramirez', email: 'david@westcoast.org', phone: '+1 (555) 291-0492', sport: 'Baseball', subject: 'Dedicated Team Fan Store & Custom Roster Portal', message: 'Fan store request.', status: 'new' },
    { id: 3, type: 'Quote Request', name: 'Coach Marcus Clark', email: 'marcus@raptors.com', phone: '+1 (555) 431-8910', sport: '7v7 Football', subject: 'Sublimated Compression Shirts & Shorts Bundle', message: 'Quote request.', status: 'replied' },
    { id: 4, type: 'General Inquiry', name: 'Elena Rostova', email: 'elena@vanceathletics.org', phone: '+1 (555) 762-3490', sport: 'Track & Field', subject: 'Custom Warm-Up Tracksuits with Sponsor Logos', message: 'Vector sponsor logos inquiry.', status: 'replied' }
  ],
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
  hero_slides: [
    {
      id: 1,
      title: 'Play Big. Dream Bigger. All Sports Here.',
      subtitle: 'High-performance custom team jerseys, athletic wear & premium sports gear built to win.',
      btn_text: 'Shop The Collection',
      btn_link: 'catalogue.html',
      banner_image: '/assets/images/hero-banner-1.jpg',
      athlete_image: '/assets/images/hero-athlete-1.png',
      slide_order: 1
    },
    {
      id: 2,
      title: 'All Sports. One Ultimate Arena.',
      subtitle: 'Elevate your team with sublimated fabrics, precision stitching, and custom roster customization.',
      btn_text: 'Start Customizer',
      btn_link: 'customizer.html',
      banner_image: '/assets/images/hero-banner-2.jpg',
      athlete_image: '/assets/images/hero-athlete-2.png',
      slide_order: 2
    },
    {
      id: 3,
      title: 'Live The Game. Love Every Sport.',
      subtitle: 'Trusted by thousands of schools, clubs, and competitive leagues worldwide.',
      btn_text: 'Request Team Quote',
      btn_link: 'placeorder.html',
      banner_image: '/assets/images/hero-banner-3.jpg',
      athlete_image: '/assets/images/hero-athlete-3.png',
      slide_order: 3
    }
  ],
  special_offers: {
    id: 1,
    heading: 'SEASON SPECIAL OFFERS',
    subheading: 'Save up to 40% on select bulk team packages and seasonal uniform designs',
    featured_title: 'PRO TEAM STARTER KIT',
    featured_desc: 'Includes home & away custom jerseys, team hoodies, and matching shorts.',
    featured_btn_text: 'GET PACKAGE QUOTE',
    featured_btn_link: 'placeorder.html',
    featured_image: '/assets/images/hero-banner-2.jpg'
  },
  featured_banners: [
    {
      id: 1,
      title: 'PRO TEAM STARTER KIT',
      description: 'Includes home & away custom jerseys, team hoodies, and matching shorts.',
      btn_text: 'GET PACKAGE QUOTE',
      btn_link: 'placeorder.html',
      banner_image: '/assets/images/hero-banner-2.jpg',
      banner_order: 1,
      is_active: true
    }
  ],
  deal_cards: [
    { id: 1, badge: '25% OFF', title: 'Chargers Deal Jersey', image: '/assets/images/sample-jersey-1.png', link_url: 'product-details.html?id=287', card_order: 1 },
    { id: 2, badge: 'HOT DEAL', title: 'Pro Football Red Deal', image: '/assets/images/sample-jersey-2.png', link_url: 'product-details.html?id=288', card_order: 2 },
    { id: 3, badge: '30% OFF', title: 'Wolfpack Aggressive Deal', image: '/assets/images/sample-jersey-3.png', link_url: 'product-details.html?id=289', card_order: 3 },
    { id: 4, badge: 'POPULAR', title: 'Hawks Cyan Speed Deal', image: '/assets/images/sample-jersey-5.png', link_url: 'product-details.html?id=291', card_order: 4 },
    { id: 5, badge: 'SAVE $20', title: 'Army Camo Reinforced Deal', image: '/assets/images/sample-jersey-6.png', link_url: 'product-details.html?id=296', card_order: 5 },
    { id: 6, badge: 'BEST SELLER', title: 'Vikings Purple Gold Deal', image: '/assets/images/sample-jersey-7.png', link_url: 'product-details.html?id=297', card_order: 6 }
  ]
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

    // Auto-seed storefront content if empty
    const heroCount = await client.query('SELECT COUNT(*) FROM storefront_hero');
    if (parseInt(heroCount.rows[0].count, 10) === 0) {
      for (const h of fallbackStore.hero_slides) {
        await client.query(
          `INSERT INTO storefront_hero (title, subtitle, btn_text, btn_link, banner_image, athlete_image, slide_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [h.title, h.subtitle, h.btn_text, h.btn_link, h.banner_image, h.athlete_image, h.slide_order]
        );
      }
    }

    const offersCount = await client.query('SELECT COUNT(*) FROM storefront_offers');
    if (parseInt(offersCount.rows[0].count, 10) === 0) {
      const s = fallbackStore.special_offers;
      await client.query(
        `INSERT INTO storefront_offers (heading, subheading, featured_title, featured_desc, featured_btn_text, featured_btn_link, featured_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [s.heading, s.subheading, s.featured_title, s.featured_desc, s.featured_btn_text, s.featured_btn_link, s.featured_image]
      );
    }

    const dealsCount = await client.query('SELECT COUNT(*) FROM storefront_deal_cards');
    if (parseInt(dealsCount.rows[0].count, 10) === 0) {
      for (const d of fallbackStore.deal_cards) {
        await client.query(
          `INSERT INTO storefront_deal_cards (badge, title, image, link_url, card_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [d.badge, d.title, d.image, d.link_url, d.card_order]
        );
      }
    }

    const featCount = await client.query('SELECT COUNT(*) FROM storefront_featured_banners');
    if (parseInt(featCount.rows[0].count, 10) === 0) {
      for (const fb of fallbackStore.featured_banners) {
        await client.query(
          `INSERT INTO storefront_featured_banners (title, description, btn_text, btn_link, banner_image, banner_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [fb.title, fb.description, fb.btn_text, fb.btn_link, fb.banner_image, fb.banner_order, true]
        );
      }
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
