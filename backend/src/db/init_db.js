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
  { sku: 'RG-001', name: 'Stealth Blackout Carbon Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Best Sellers', image: '/assets/images/products/rashguard-1.jpg', type: 'model', description: 'Matte carbon fiber flank panels with dark grey flatlock ergonomic stitching.' },
  { sku: 'RG-002', name: 'Royal Cyan & Navy Compression Top', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-2.jpg', type: 'model', description: 'Electric blue raglan sleeves with moisture-wicking contrast seam panels.' },
  { sku: 'RG-003', name: 'Crimson Velocity Armor Rashguard', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/products/rashguard-3.jpg', type: 'model', description: 'Charcoal base with geometric crimson shoulder panels and reinforced seams.' },
  { sku: 'RG-004', name: 'Volt Yellow Sprint Rashguard', price: 120.00, sport: 'Training', category: 'New Arrivals', image: '/assets/images/products/rashguard-4.jpg', type: 'model', description: 'High-visibility neon volt yellow accents with multi-directional stretch.' },
  { sku: 'RG-005', name: 'Glacier White & Deep Navy Top', price: 120.00, sport: 'Compression Wear', category: 'Best Sellers', image: '/assets/images/products/rashguard-5.jpg', type: 'model', description: 'Frost white torso with deep navy sleeves and ice-blue contour stitch.' },
  { sku: 'RG-006', name: 'Hyper Sunset Orange Rashguard', price: 120.00, sport: '7v7 Football', category: 'New Arrivals', image: '/assets/images/products/rashguard-6.jpg', type: 'model', description: 'Vibrant sunset orange with gunmetal velocity side panels.' },
  { sku: 'RG-007', name: 'Emerald Matrix Honeycomb Top', price: 120.00, sport: 'Training', category: 'Best Sellers', image: '/assets/images/products/rashguard-7.jpg', type: 'model', description: 'Anthracite base with vibrant emerald green honeycomb matrix pattern.' },
  { sku: 'RG-008', name: 'Regal Purple Tournament Rashguard', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-8.jpg', type: 'model', description: 'Deep royal purple with metallic silver tournament contrast lines.' },
  { sku: 'RG-009', name: 'Desert Sand Tactical Camo Rashguard', price: 120.00, sport: 'Training', category: 'Best Sellers', image: '/assets/images/products/rashguard-9.jpg', type: 'model', description: 'Sublimated tactical urban camo with reinforced elbow contours.' },
  { sku: 'RG-010', name: 'Oceanic Teal & Mint Base Layer', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-10.jpg', type: 'model', description: 'Dark teal with mint green gradient transitions and antimicrobial fabric.' },
  { sku: 'RG-011', name: 'Solar Gold & Black Striker Top', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/products/rashguard-11.jpg', type: 'model', description: 'Jet black with high-voltage solar gold sleeves and ergonomic panels.' },
  { sku: 'RG-012', name: 'Bloodline Maroon Armor Rashguard', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-12.jpg', type: 'model', description: 'Matte black with bloodline maroon panels and red flatlock stitching.' },
  { sku: 'RG-013', name: 'Titanium Silver & Acid Lime Top', price: 120.00, sport: 'Training', category: 'Best Sellers', image: '/assets/images/products/rashguard-13.jpg', type: 'model', description: 'Titanium grey body with acid lime geometric speed ribbing.' },
  { sku: 'RG-014', name: 'Cobalt Blue Cross-Trainer Rashguard', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-14.jpg', type: 'model', description: 'Cobalt blue with crisp white athletic raglan sleeve contours.' },
  { sku: 'RG-015', name: 'Shadow Charcoal & Red Speed Top', price: 120.00, sport: '7v7 Football', category: 'Best Sellers', image: '/assets/images/products/rashguard-15.jpg', type: 'model', description: 'Dark charcoal with crimson speed streaks and ventilation mesh panels.' },
  { sku: 'RG-016', name: 'Vortex Violet Performance Rashguard', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-16.jpg', type: 'model', description: 'Vortex violet with radiant coral gradient accents.' },
  { sku: 'RG-017', name: 'Military Green Camo Tactical Top', price: 120.00, sport: 'Training', category: 'Best Sellers', image: '/assets/images/products/rashguard-17.jpg', type: 'model', description: 'Obsidian black with military green camo sleeves and rugged flatlock seams.' },
  { sku: 'RG-018', name: 'Electric Cyan & Magenta Duo Rashguard', price: 120.00, sport: '7v7 Football', category: 'New Arrivals', image: '/assets/images/products/rashguard-18.jpg', type: 'model', description: 'High-energy cyan and magenta contrast tournament compression wear.' },
  { sku: 'RG-019', name: 'Pitch Black & Gold Foil Rashguard', price: 120.00, sport: 'Compression Wear', category: 'Best Sellers', image: '/assets/images/products/rashguard-19.jpg', type: 'model', description: 'Championship gold foil geometric lines on premium ultra-stretch black spandex.' },
  { sku: 'RG-020', name: 'Pure Frost Minimalist Base Layer', price: 120.00, sport: 'Compression Wear', category: 'New Arrivals', image: '/assets/images/products/rashguard-20.jpg', type: 'model', description: 'Clean frost white with steel grey technical stitching and moisture-wicking weave.' }
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
        ['admin', 'admin@snowtopsports.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6W6W6W6W6W6W6W6', 'superadmin']
      );
      console.log('✅ Seeded default admin user (admin).');
    } else {
      console.log(`ℹ️ Admin users table already has ${adminCount} rows.`);
    }

    // 8. Storefront Hero Slides (Clean - managed via admin)
    const heroCountRes = await appClient.query('SELECT COUNT(*) FROM storefront_hero');
    const heroCount = parseInt(heroCountRes.rows[0].count, 10);
    console.log(`ℹ️ Storefront hero table has ${heroCount} rows.`);

    // 9. Seed Storefront Season Special Offers Heading (Without fake banners)
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
          '',
          '',
          'GET PACKAGE QUOTE',
          'placeorder.html',
          ''
        ]
      );
      console.log('✅ Seeded Season Special Offers.');
    } else {
      console.log(`ℹ️ Storefront offers table already has ${offersCount} rows.`);
    }

    // 10. Storefront Deal Cards (Clean - managed via admin)
    const dealsCountRes = await appClient.query('SELECT COUNT(*) FROM storefront_deal_cards');
    const dealsCount = parseInt(dealsCountRes.rows[0].count, 10);
    console.log(`ℹ️ Storefront deal cards table has ${dealsCount} rows.`);

    console.log('🎉 Database initialization complete!');
    await appClient.end();
  } catch (err) {
    console.error('❌ Database initialization error:', err);
    process.exit(1);
  }
}

initializeDatabase();
