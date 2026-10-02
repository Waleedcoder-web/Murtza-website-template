-- ============================================================================
-- PROSIX SPORTS - POSTGRESQL DATABASE SCHEMA (prosix_db)
-- Scope: products, inquiries, admin_users, categories
-- ============================================================================

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
    image TEXT DEFAULT '/assets/images/sample-jersey-1.png',
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
    banner_image TEXT DEFAULT '/assets/images/hero-banner-1.jpg',
    athlete_image TEXT DEFAULT '/assets/images/hero-athlete-1.png',
    slide_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Storefront Season Special Offers Table (Main Section Heading)
CREATE TABLE IF NOT EXISTS storefront_offers (
    id SERIAL PRIMARY KEY,
    heading VARCHAR(255) DEFAULT 'SEASON SPECIAL OFFERS',
    subheading TEXT DEFAULT 'Save up to 40% on select bulk team packages and seasonal uniform designs',
    featured_title VARCHAR(255) DEFAULT 'PRO TEAM STARTER KIT',
    featured_desc TEXT DEFAULT 'Includes home & away custom jerseys, team hoodies, and matching shorts.',
    featured_btn_text VARCHAR(100) DEFAULT 'GET PACKAGE QUOTE',
    featured_btn_link VARCHAR(255) DEFAULT 'placeorder.html',
    featured_image TEXT DEFAULT '/assets/images/hero-banner-2.jpg',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6b. Storefront Multiple Featured Deal Banners Table
CREATE TABLE IF NOT EXISTS storefront_featured_banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'PRO TEAM STARTER KIT',
    description TEXT DEFAULT 'Includes home & away custom jerseys, team hoodies, and matching shorts.',
    btn_text VARCHAR(100) DEFAULT 'GET PACKAGE QUOTE',
    btn_link VARCHAR(255) DEFAULT 'placeorder.html',
    banner_image TEXT DEFAULT '/assets/images/hero-banner-2.jpg',
    banner_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Storefront Special Deal Cards Table (The 6 Deals)
CREATE TABLE IF NOT EXISTS storefront_deal_cards (
    id SERIAL PRIMARY KEY,
    badge VARCHAR(50) NOT NULL,
    title VARCHAR(255) DEFAULT 'Deal Jersey',
    image TEXT NOT NULL,
    link_url VARCHAR(255) DEFAULT 'product-details.html?id=287',
    card_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_sport ON products(sport);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON inquiries(type);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_deal_cards_order ON storefront_deal_cards(card_order);
CREATE INDEX IF NOT EXISTS idx_hero_order ON storefront_hero(slide_order);

