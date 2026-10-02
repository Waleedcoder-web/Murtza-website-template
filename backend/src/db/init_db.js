/**
 * PROSIX SPORTS - DATABASE INITIALIZATION & SEED SCRIPT
 * Creates 'prosix_db' database in PostgreSQL, applies schema, and seeds:
 * - categories
 * - products
 * - inquiries
 * - admin_users
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 5432;
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_NAME = process.env.DB_NAME || 'prosix_db';

const initialCategories = [
  { name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest uniform releases and seasonal drops' },
  { name: 'Best Sellers', slug: 'best-sellers', description: 'Top performing team uniform designs' },
  { name: 'Pro Sublimation', slug: 'pro-sublimation', description: 'Elite 180 GSM full-dye sublimated jerseys' },
  { name: 'Fan Gear', slug: 'fan-gear', description: 'Hoodies, tees, and parent supporter apparel' },
  { name: 'Compression Wear', slug: 'compression-wear', description: 'Padded and standard base layer compression gear' }
];

const initialProducts = [
  { sku: 'PRO-287', name: 'Chargers Jersey Designs', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-1.png', type: 'model', description: 'Pro sublimation moisture-wicking 7v7 football jersey.' },
  { sku: 'PRO-288', name: 'Football Pro Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-2.png', type: 'model', description: 'Heavyweight reinforced stitching tackle football jersey.' },
  { sku: 'PRO-289', name: 'Wolfpack Jersey Designs', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-3.png', type: 'model', description: 'Custom aggressive mascot sublimation compression jersey.' },
  { sku: 'PRO-290', name: 'Patriots Jersey Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-4.png', type: 'model', description: 'Classic red, white and navy athletic football uniform.' },
  { sku: 'PRO-291', name: 'Hawks Elite Designs', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-5.png', type: 'model', description: 'Elite breathable 4-way stretch speed jersey.' },
  { sku: 'PRO-296', name: 'Army Camo Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-6.png', type: 'model', description: 'Military camo pattern sublimated uniform with durable shoulder panels.' },
  { sku: 'PRO-297', name: 'Vikings Jersey Designs', price: 120.00, sport: 'Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-7.png', type: 'model', description: 'Vibrant purple and gold game day performance jersey.' },
  { sku: 'PRO-299', name: 'Bears Jersey Designs', price: 120.00, sport: 'Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-8.png', type: 'model', description: 'Traditional dark navy and orange sublimated football top.' },
  { sku: 'PRO-302', name: 'Ohio Athletic Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-9.png', type: 'model', description: 'High-contrast athletic scarlet and silver design.' },
  { sku: 'PRO-324', name: 'Eagles Jersey Designs', price: 120.00, sport: 'Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-10.png', type: 'model', description: 'Midnight green and metallic silver sublimated jersey.' },
  { sku: 'PRO-332', name: 'Broncos Jersey Designs', price: 120.00, sport: 'Football', category: 'Best Sellers', image: '/assets/images/sample-jersey-11.png', type: 'model', description: 'Dynamic orange swoosh and royal blue performance cut.' },
  { sku: 'PRO-336', name: 'Seahawks Pro Designs', price: 120.00, sport: 'Football', category: 'New Arrivals', image: '/assets/images/sample-jersey-12.png', type: 'model', description: 'Action green accents with wolf grey and navy fabric.' }
];

const initialInquiries = [
  {
    type: 'Contact Form',
    name: 'Coach Sarah Jenkins',
    email: 'sarah@velocity.com',
    phone: '+1 (555) 882-1928',
    sport: '7v7 Football',
    subject: 'Bulk Re-order for Regional Tournament (35 sets)',
    message: 'Need 35 custom compression tops and shorts delivered by late October. Please send bulk discount tier pricing.',
    status: 'new'
  },
  {
    type: 'Website Request',
    name: 'David Ramirez',
    email: 'david@westcoast.org',
    phone: '+1 (555) 291-0492',
    sport: 'Baseball',
    subject: 'Dedicated Team Fan Store & Custom Roster Portal',
    message: 'We are looking to set up an online fan store and roster order registration portal for our club baseball organization.',
    status: 'new'
  },
  {
    type: 'Quote Request',
    name: 'Coach Marcus Clark',
    email: 'marcus@raptors.com',
    phone: '+1 (555) 431-8910',
    sport: '7v7 Football',
    subject: 'Sublimated Compression Shirts & Shorts Bundle',
    message: 'Requesting formal quotation for 24 players home and away kits.',
    status: 'replied',
    reply_notes: 'Sent PDF quote with volume discount.'
  },
  {
    type: 'General Inquiry',
    name: 'Elena Rostova',
    email: 'elena@vanceathletics.org',
    phone: '+1 (555) 762-3490',
    sport: 'Track & Field',
    subject: 'Custom Warm-Up Tracksuits with Sponsor Logos',
    message: 'Can you handle vector sponsor logos on chest and back warm-up jackets?',
    status: 'replied',
    reply_notes: 'Confirmed vector formats supported.'
  }
];

async function initializeDatabase() {
  console.log('🔄 Connecting to PostgreSQL root instance...');
  const rootClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres'
  });

  try {
    await rootClient.connect();
    console.log('✅ Connected to PostgreSQL root.');

    // 1. Check if prosix_db exists; create if not
    const checkDbRes = await rootClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (checkDbRes.rowCount === 0) {
      console.log(`📦 Database "${DB_NAME}" does not exist. Creating...`);
      await rootClient.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`✅ Database "${DB_NAME}" created successfully.`);
    } else {
      console.log(`ℹ️ Database "${DB_NAME}" already exists.`);
    }

    await rootClient.end();

    // 2. Connect to prosix_db and apply schema
    console.log(`🔄 Connecting to database "${DB_NAME}"...`);
    const appClient = new Client({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    await appClient.connect();
    console.log(`✅ Connected to "${DB_NAME}".`);

    // 3. Read and execute schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await appClient.query(schemaSql);
    console.log('✅ Schema tables verified: categories, products, inquiries, admin_users.');

    // 4. Seed Categories
    const catCountRes = await appClient.query('SELECT COUNT(*) FROM categories');
    const catCount = parseInt(catCountRes.rows[0].count, 10);
    if (catCount === 0) {
      console.log('🌱 Seeding initial categories...');
      for (const cat of initialCategories) {
        await appClient.query(
          `INSERT INTO categories (name, slug, description)
           VALUES ($1, $2, $3)
           ON CONFLICT (name) DO NOTHING`,
          [cat.name, cat.slug, cat.description]
        );
      }
      console.log(`✅ Seeded ${initialCategories.length} categories.`);
    } else {
      console.log(`ℹ️ Categories table already has ${catCount} rows.`);
    }

    // 5. Seed Products
    const productsCountRes = await appClient.query('SELECT COUNT(*) FROM products');
    const productsCount = parseInt(productsCountRes.rows[0].count, 10);
    if (productsCount === 0) {
      console.log('🌱 Seeding initial products...');
      for (const p of initialProducts) {
        await appClient.query(
          `INSERT INTO products (sku, name, price, sport, category, image, type, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (sku) DO NOTHING`,
          [p.sku, p.name, p.price, p.sport, p.category, p.image, p.type, p.description]
        );
      }
      console.log(`✅ Seeded ${initialProducts.length} products.`);
    } else {
      console.log(`ℹ️ Products table already has ${productsCount} rows.`);
    }

    // 6. Seed Inquiries
    const inquiriesCountRes = await appClient.query('SELECT COUNT(*) FROM inquiries');
    const inquiriesCount = parseInt(inquiriesCountRes.rows[0].count, 10);
    if (inquiriesCount === 0) {
      console.log('🌱 Seeding initial customer inquiries...');
      for (const i of initialInquiries) {
        await appClient.query(
          `INSERT INTO inquiries (type, name, email, phone, sport, subject, message, status, reply_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [i.type, i.name, i.email, i.phone, i.sport, i.subject, i.message, i.status, i.reply_notes || null]
        );
      }
      console.log(`✅ Seeded ${initialInquiries.length} customer inquiries.`);
    } else {
      console.log(`ℹ️ Inquiries table already has ${inquiriesCount} rows.`);
    }

    // 7. Seed Admin User
    const adminCountRes = await appClient.query('SELECT COUNT(*) FROM admin_users');
    const adminCount = parseInt(adminCountRes.rows[0].count, 10);
    if (adminCount === 0) {
      console.log('🌱 Seeding default admin user...');
      await appClient.query(
        `INSERT INTO admin_users (username, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (username) DO NOTHING`,
        ['admin', 'admin@prosixsports.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6W6W6W6W6W6W6W6', 'superadmin']
      );
      console.log('✅ Seeded default admin user (admin).');
    } else {
      console.log(`ℹ️ Admin users table already has ${adminCount} rows.`);
    }

    // 8. Seed Storefront Hero Slides
    const heroCountRes = await appClient.query('SELECT COUNT(*) FROM storefront_hero');
    const heroCount = parseInt(heroCountRes.rows[0].count, 10);
    if (heroCount === 0) {
      console.log('🌱 Seeding storefront hero slides...');
      const initialHeroSlides = [
        {
          title: 'Play Big. Dream Bigger. All Sports Here.',
          subtitle: 'High-performance custom team jerseys, athletic wear & premium sports gear built to win.',
          btn_text: 'Shop The Collection',
          btn_link: 'catalogue.html',
          banner_image: '/assets/images/hero-banner-1.jpg',
          athlete_image: '/assets/images/hero-athlete-1.png',
          slide_order: 1
        },
        {
          title: 'All Sports. One Ultimate Arena.',
          subtitle: 'Elevate your team with sublimated fabrics, precision stitching, and custom roster customization.',
          btn_text: 'Start Customizer',
          btn_link: 'customizer.html',
          banner_image: '/assets/images/hero-banner-2.jpg',
          athlete_image: '/assets/images/hero-athlete-2.png',
          slide_order: 2
        },
        {
          title: 'Live The Game. Love Every Sport.',
          subtitle: 'Trusted by thousands of schools, clubs, and competitive leagues worldwide.',
          btn_text: 'Request Team Quote',
          btn_link: 'placeorder.html',
          banner_image: '/assets/images/hero-banner-3.jpg',
          athlete_image: '/assets/images/hero-athlete-3.png',
          slide_order: 3
        }
      ];
      for (const h of initialHeroSlides) {
        await appClient.query(
          `INSERT INTO storefront_hero (title, subtitle, btn_text, btn_link, banner_image, athlete_image, slide_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [h.title, h.subtitle, h.btn_text, h.btn_link, h.banner_image, h.athlete_image, h.slide_order]
        );
      }
      console.log('✅ Seeded 3 hero slides.');
    } else {
      console.log(`ℹ️ Storefront hero table already has ${heroCount} rows.`);
    }

    // 9. Seed Storefront Season Special Offers
    const offersCountRes = await appClient.query('SELECT COUNT(*) FROM storefront_offers');
    const offersCount = parseInt(offersCountRes.rows[0].count, 10);
    if (offersCount === 0) {
      console.log('🌱 Seeding Season Special Offers configuration...');
      await appClient.query(
        `INSERT INTO storefront_offers (heading, subheading, featured_title, featured_desc, featured_btn_text, featured_btn_link, featured_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          'SEASON SPECIAL OFFERS',
          'Save up to 40% on select bulk team packages and seasonal uniform designs',
          'PRO TEAM STARTER KIT',
          'Includes home & away custom jerseys, team hoodies, and matching shorts.',
          'GET PACKAGE QUOTE',
          'placeorder.html',
          '/assets/images/hero-banner-2.jpg'
        ]
      );
      console.log('✅ Seeded Season Special Offers.');
    } else {
      console.log(`ℹ️ Storefront offers table already has ${offersCount} rows.`);
    }

    // 10. Seed Storefront Deal Cards
    const dealsCountRes = await appClient.query('SELECT COUNT(*) FROM storefront_deal_cards');
    const dealsCount = parseInt(dealsCountRes.rows[0].count, 10);
    if (dealsCount === 0) {
      console.log('🌱 Seeding 6 Special Deal Cards...');
      const initialDealCards = [
        { badge: '25% OFF', title: 'Chargers Deal Jersey', image: '/assets/images/sample-jersey-1.png', link_url: 'product-details.html?id=287', card_order: 1 },
        { badge: 'HOT DEAL', title: 'Pro Football Red Deal', image: '/assets/images/sample-jersey-2.png', link_url: 'product-details.html?id=288', card_order: 2 },
        { badge: '30% OFF', title: 'Wolfpack Aggressive Deal', image: '/assets/images/sample-jersey-3.png', link_url: 'product-details.html?id=289', card_order: 3 },
        { badge: 'POPULAR', title: 'Hawks Cyan Speed Deal', image: '/assets/images/sample-jersey-5.png', link_url: 'product-details.html?id=291', card_order: 4 },
        { badge: 'SAVE $20', title: 'Army Camo Reinforced Deal', image: '/assets/images/sample-jersey-6.png', link_url: 'product-details.html?id=296', card_order: 5 },
        { badge: 'BEST SELLER', title: 'Vikings Purple Gold Deal', image: '/assets/images/sample-jersey-7.png', link_url: 'product-details.html?id=297', card_order: 6 }
      ];
      for (const d of initialDealCards) {
        await appClient.query(
          `INSERT INTO storefront_deal_cards (badge, title, image, link_url, card_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [d.badge, d.title, d.image, d.link_url, d.card_order]
        );
      }
      console.log('✅ Seeded 6 Special Deal Cards.');
    } else {
      console.log(`ℹ️ Storefront deal cards table already has ${dealsCount} rows.`);
    }

    console.log('🎉 Database initialization complete!');
    await appClient.end();
  } catch (err) {
    console.error('❌ Database initialization error:', err);
    process.exit(1);
  }
}

initializeDatabase();
