const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET full storefront configuration (Hero slides, Special Offers heading/banner, and Deal Cards)
router.get('/', async (req, res) => {
  try {
    if (db.getIsConnected()) {
      const heroRes = await db.query('SELECT * FROM storefront_hero WHERE is_active = true ORDER BY slide_order ASC, id ASC');
      const offersRes = await db.query('SELECT * FROM storefront_offers ORDER BY id ASC LIMIT 1');
      const featRes = await db.query('SELECT * FROM storefront_featured_banners WHERE is_active = true ORDER BY banner_order ASC, id ASC');
      const dealsRes = await db.query('SELECT * FROM storefront_deal_cards WHERE is_active = true ORDER BY card_order ASC, id ASC');

      return res.json({
        hero: heroRes.rows || [],
        special: (offersRes.rows && offersRes.rows[0]) || db.fallbackStore.special_offers,
        featured_banners: featRes.rows || [],
        deals: dealsRes.rows || []
      });
    }
  } catch (err) {
    console.error('Error fetching storefront offers from PostgreSQL:', err);
  }

  return res.json({
    hero: db.fallbackStore.hero_slides,
    special: db.fallbackStore.special_offers,
    featured_banners: db.fallbackStore.featured_banners,
    deals: db.fallbackStore.deal_cards
  });
});

// POST /api/offers/hero - Add a New Hero Banner Slide
router.post('/hero', async (req, res) => {
  const {
    title, subtitle,
    btn_text, btn_link,
    banner_image, athlete_image,
    slide_order
  } = req.body;

  if (!banner_image) {
    return res.status(400).json({ error: 'Banner image is required' });
  }

  try {
    if (db.getIsConnected()) {
      const maxOrderRes = await db.query('SELECT COALESCE(MAX(slide_order), 0) as max_order FROM storefront_hero');
      const nextOrder = slide_order || ((maxOrderRes.rows[0]?.max_order || 0) + 1);

      const insertRes = await db.query(
        `INSERT INTO storefront_hero
         (title, subtitle, btn_text, btn_link, banner_image, athlete_image, slide_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)
         RETURNING *`,
        [
          title || 'New Sports Banner',
          subtitle || '',
          btn_text || 'Shop The Collection',
          btn_link || 'catalogue.html',
          banner_image,
          athlete_image || '',
          nextOrder
        ]
      );
      return res.status(201).json({ success: true, message: 'Hero banner added', slide: insertRes.rows[0] });
    }
  } catch (err) {
    console.error('Error adding hero banner in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to add hero banner: ' + err.message });
  }

  const newSlide = {
    id: Date.now(),
    title: title || 'New Sports Banner',
    subtitle: subtitle || '',
    btn_text: btn_text || 'Shop The Collection',
    btn_link: btn_link || 'catalogue.html',
    banner_image,
    athlete_image: athlete_image || '',
    slide_order: slide_order || (db.fallbackStore.hero_slides.length + 1),
    is_active: true
  };
  db.fallbackStore.hero_slides.push(newSlide);
  return res.status(201).json({ success: true, message: 'Hero banner added to local store', slide: newSlide });
});

// DELETE /api/offers/hero/:id - Delete a Hero Banner Slide
router.delete('/hero/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid banner ID' });
  }

  try {
    if (db.getIsConnected()) {
      await db.query('DELETE FROM storefront_hero WHERE id = $1', [id]);
      return res.json({ success: true, message: `Banner #${id} deleted` });
    }
  } catch (err) {
    console.error('Error deleting hero banner in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to delete hero banner: ' + err.message });
  }

  db.fallbackStore.hero_slides = db.fallbackStore.hero_slides.filter(s => s.id !== id);
  return res.json({ success: true, message: `Banner #${id} deleted from local store` });
});

// PUT /api/offers/hero/:id - Update Single Hero Banner
router.put('/hero/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const { title, subtitle, btn_text, btn_link, banner_image, athlete_image, slide_order } = req.body;
  try {
    if (db.getIsConnected()) {
      const updateRes = await db.query(
        `UPDATE storefront_hero
         SET title = $1, subtitle = $2, btn_text = $3, btn_link = $4,
             banner_image = $5, athlete_image = $6, slide_order = $7
         WHERE id = $8 RETURNING *`,
        [title, subtitle, btn_text, btn_link, banner_image, athlete_image || '', slide_order || 1, id]
      );
      if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Banner not found' });
      return res.json({ success: true, message: 'Hero banner updated', slide: updateRes.rows[0] });
    }
  } catch (err) {
    console.error('Error updating single hero banner:', err);
    return res.status(500).json({ error: 'Failed to update hero banner: ' + err.message });
  }

  const idx = db.fallbackStore.hero_slides.findIndex(s => s.id === id);
  if (idx !== -1) {
    db.fallbackStore.hero_slides[idx] = { ...db.fallbackStore.hero_slides[idx], ...req.body, id };
    return res.json({ success: true, message: 'Hero banner updated in local store', slide: db.fallbackStore.hero_slides[idx] });
  }
  return res.status(404).json({ error: 'Banner not found' });
});

// PUT /api/offers/hero - Update / Bulk Save Hero Carousel Slides
router.put('/hero', async (req, res) => {
  const { slides } = req.body;
  if (!Array.isArray(slides)) {
    return res.status(400).json({ error: 'Slides array is required' });
  }

  try {
    if (db.getIsConnected()) {
      for (const slide of slides) {
        if (slide.id && slide.id > 0) {
          await db.query(
            `UPDATE storefront_hero 
             SET title = $1, subtitle = $2, btn_text = $3, btn_link = $4, 
                 banner_image = $5, athlete_image = $6, slide_order = $7,
                 is_active = $8
             WHERE id = $9`,
            [
              slide.title, slide.subtitle, slide.btn_text, slide.btn_link,
              slide.banner_image, slide.athlete_image, slide.slide_order || 1,
              slide.is_active !== false, slide.id
            ]
          );
        } else {
          await db.query(
            `INSERT INTO storefront_hero
             (title, subtitle, btn_text, btn_link, banner_image, athlete_image, slide_order, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              slide.title, slide.subtitle, slide.btn_text, slide.btn_link,
              slide.banner_image, slide.athlete_image, slide.slide_order || 1,
              slide.is_active !== false
            ]
          );
        }
      }
      const updated = await db.query('SELECT * FROM storefront_hero WHERE is_active = true ORDER BY slide_order ASC, id ASC');
      return res.json({ success: true, message: 'Hero slides updated', slides: updated.rows });
    }
  } catch (err) {
    console.error('Error updating hero slides in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to update hero slides: ' + err.message });
  }

  db.fallbackStore.hero_slides = slides;
  return res.json({ success: true, message: 'Hero slides updated in local store', slides });
});

// PUT /api/offers/special - Update Season Special Offers (Headline & Featured Deal)
router.put('/special', async (req, res) => {
  const {
    heading, subheading,
    featured_title, featured_desc,
    featured_btn_text, featured_btn_link,
    featured_image
  } = req.body;

  try {
    if (db.getIsConnected()) {
      // Upsert into storefront_offers
      const checkRes = await db.query('SELECT id FROM storefront_offers LIMIT 1');
      let result;
      if (checkRes.rows.length > 0) {
        result = await db.query(
          `UPDATE storefront_offers
           SET heading = $1, subheading = $2,
               featured_title = $3, featured_desc = $4,
               featured_btn_text = $5, featured_btn_link = $6,
               featured_image = $7, updated_at = CURRENT_TIMESTAMP
           WHERE id = $8 RETURNING *`,
          [
            heading, subheading,
            featured_title, featured_desc,
            featured_btn_text, featured_btn_link,
            featured_image, checkRes.rows[0].id
          ]
        );
      } else {
        result = await db.query(
          `INSERT INTO storefront_offers 
           (heading, subheading, featured_title, featured_desc, featured_btn_text, featured_btn_link, featured_image)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [heading, subheading, featured_title, featured_desc, featured_btn_text, featured_btn_link, featured_image]
        );
      }
      return res.json({ success: true, message: 'Season special offers updated', special: result.rows[0] });
    }
  } catch (err) {
    console.error('Error updating special offers in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to update special offers: ' + err.message });
  }

  db.fallbackStore.special_offers = {
    ...db.fallbackStore.special_offers,
    heading, subheading,
    featured_title, featured_desc,
    featured_btn_text, featured_btn_link,
    featured_image
  };
  return res.json({ success: true, message: 'Season special offers updated', special: db.fallbackStore.special_offers });
});

// PUT /api/offers/deals - Update the 6 Deal Cards
router.put('/deals', async (req, res) => {
  const { deals } = req.body;
  if (!Array.isArray(deals)) {
    return res.status(400).json({ error: 'Deals array is required' });
  }

  try {
    if (db.getIsConnected()) {
      for (const card of deals) {
        if (card.id) {
          await db.query(
            `UPDATE storefront_deal_cards
             SET badge = $1, title = $2, image = $3, link_url = $4, card_order = $5
             WHERE id = $6`,
            [card.badge, card.title, card.image, card.link_url, card.card_order || 1, card.id]
          );
        } else {
          await db.query(
            `INSERT INTO storefront_deal_cards (badge, title, image, link_url, card_order)
             VALUES ($1, $2, $3, $4, $5)`,
            [card.badge, card.title, card.image, card.link_url, card.card_order || 1]
          );
        }
      }
      const updated = await db.query('SELECT * FROM storefront_deal_cards WHERE is_active = true ORDER BY card_order ASC, id ASC');
      return res.json({ success: true, message: 'Deal cards updated', deals: updated.rows });
    }
  } catch (err) {
    console.error('Error updating deal cards in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to update deal cards: ' + err.message });
  }

  db.fallbackStore.deal_cards = deals;
  return res.json({ success: true, message: 'Deal cards updated in local store', deals });
});

// POST /api/offers/featured-banners - Add a New Featured Deal Banner
router.post('/featured-banners', async (req, res) => {
  const { title, description, btn_text, btn_link, banner_image, banner_order } = req.body;
  if (!banner_image) {
    return res.status(400).json({ error: 'Banner image is required' });
  }

  try {
    if (db.getIsConnected()) {
      const maxOrderRes = await db.query('SELECT COALESCE(MAX(banner_order), 0) as max_order FROM storefront_featured_banners');
      const nextOrder = banner_order || ((maxOrderRes.rows[0]?.max_order || 0) + 1);

      const insertRes = await db.query(
        `INSERT INTO storefront_featured_banners (title, description, btn_text, btn_link, banner_image, banner_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *`,
        [title || 'PRO TEAM STARTER KIT', description || '', btn_text || 'GET PACKAGE QUOTE', btn_link || 'placeorder.html', banner_image, nextOrder]
      );
      return res.status(201).json({ success: true, message: 'Featured banner added', banner: insertRes.rows[0] });
    }
  } catch (err) {
    console.error('Error adding featured banner in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to add featured banner: ' + err.message });
  }

  const newBanner = {
    id: Date.now(),
    title: title || 'PRO TEAM STARTER KIT',
    description: description || '',
    btn_text: btn_text || 'GET PACKAGE QUOTE',
    btn_link: btn_link || 'placeorder.html',
    banner_image,
    banner_order: banner_order || (db.fallbackStore.featured_banners.length + 1),
    is_active: true
  };
  db.fallbackStore.featured_banners.push(newBanner);
  return res.status(201).json({ success: true, message: 'Featured banner added to local store', banner: newBanner });
});

// DELETE /api/offers/featured-banners/:id - Delete a Featured Banner
router.delete('/featured-banners/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    if (db.getIsConnected()) {
      await db.query('DELETE FROM storefront_featured_banners WHERE id = $1', [id]);
      return res.json({ success: true, message: `Featured banner #${id} deleted` });
    }
  } catch (err) {
    console.error('Error deleting featured banner in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to delete featured banner: ' + err.message });
  }

  db.fallbackStore.featured_banners = db.fallbackStore.featured_banners.filter(b => b.id !== id);
  return res.json({ success: true, message: `Featured banner #${id} deleted` });
});

// PUT /api/offers/featured-banners - Update / Bulk Save Featured Banners
router.put('/featured-banners', async (req, res) => {
  const { banners } = req.body;
  if (!Array.isArray(banners)) return res.status(400).json({ error: 'Banners array is required' });

  try {
    if (db.getIsConnected()) {
      for (const b of banners) {
        if (b.id && b.id > 0) {
          await db.query(
            `UPDATE storefront_featured_banners
             SET title = $1, description = $2, btn_text = $3, btn_link = $4, banner_image = $5, banner_order = $6
             WHERE id = $7`,
            [b.title, b.description, b.btn_text, b.btn_link, b.banner_image, b.banner_order || 1, b.id]
          );
        } else {
          await db.query(
            `INSERT INTO storefront_featured_banners (title, description, btn_text, btn_link, banner_image, banner_order, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, true)`,
            [b.title, b.description, b.btn_text, b.btn_link, b.banner_image, b.banner_order || 1]
          );
        }
      }
      const updated = await db.query('SELECT * FROM storefront_featured_banners WHERE is_active = true ORDER BY banner_order ASC, id ASC');
      return res.json({ success: true, message: 'Featured banners updated', banners: updated.rows });
    }
  } catch (err) {
    console.error('Error updating featured banners in PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to update featured banners: ' + err.message });
  }

  db.fallbackStore.featured_banners = banners;
  return res.json({ success: true, message: 'Featured banners updated in local store', banners });
});

// PUT /api/offers/featured-banners/:id - Update Single Featured Banner
router.put('/featured-banners/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const { title, description, btn_text, btn_link, banner_image, banner_order } = req.body;
  try {
    if (db.getIsConnected()) {
      const updateRes = await db.query(
        `UPDATE storefront_featured_banners
         SET title = $1, description = $2, btn_text = $3, btn_link = $4,
             banner_image = $5, banner_order = $6
         WHERE id = $7 RETURNING *`,
        [title, description, btn_text, btn_link, banner_image, banner_order || 1, id]
      );
      if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Featured banner not found' });
      return res.json({ success: true, message: 'Featured banner updated', banner: updateRes.rows[0] });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update featured banner: ' + err.message });
  }

  const idx = db.fallbackStore.featured_banners.findIndex(b => b.id === id);
  if (idx !== -1) {
    db.fallbackStore.featured_banners[idx] = { ...db.fallbackStore.featured_banners[idx], ...req.body, id };
    return res.json({ success: true, message: 'Featured banner updated in local store', banner: db.fallbackStore.featured_banners[idx] });
  }
  return res.status(404).json({ error: 'Featured banner not found' });
});

// POST /api/offers/deals - Add a New Deal Card
router.post('/deals', async (req, res) => {
  const { badge, title, image, link_url, card_order } = req.body;
  if (!image) return res.status(400).json({ error: 'Image is required' });

  try {
    if (db.getIsConnected()) {
      const maxOrderRes = await db.query('SELECT COALESCE(MAX(card_order), 0) as max_order FROM storefront_deal_cards');
      const nextOrder = card_order || ((maxOrderRes.rows[0]?.max_order || 0) + 1);

      const insertRes = await db.query(
        `INSERT INTO storefront_deal_cards (badge, title, image, link_url, card_order, is_active)
         VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
        [badge || 'SPECIAL DEAL', title || 'Custom Team Jersey', image, link_url || 'catalogue.html', nextOrder]
      );
      return res.status(201).json({ success: true, message: 'Deal card added', deal: insertRes.rows[0] });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add deal card: ' + err.message });
  }

  const newDeal = {
    id: Date.now(),
    badge: badge || 'SPECIAL DEAL',
    title: title || 'Custom Team Jersey',
    image,
    link_url: link_url || 'catalogue.html',
    card_order: card_order || (db.fallbackStore.deal_cards.length + 1),
    is_active: true
  };
  db.fallbackStore.deal_cards.push(newDeal);
  return res.status(201).json({ success: true, message: 'Deal card added to local store', deal: newDeal });
});

// PUT /api/offers/deals/:id - Update Single Deal Card
router.put('/deals/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const { badge, title, image, link_url, card_order } = req.body;
  try {
    if (db.getIsConnected()) {
      const updateRes = await db.query(
        `UPDATE storefront_deal_cards
         SET badge = $1, title = $2, image = $3, link_url = $4, card_order = $5
         WHERE id = $6 RETURNING *`,
        [badge, title, image, link_url, card_order || 1, id]
      );
      if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Deal card not found' });
      return res.json({ success: true, message: 'Deal card updated', deal: updateRes.rows[0] });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update deal card: ' + err.message });
  }

  const idx = db.fallbackStore.deal_cards.findIndex(d => d.id === id);
  if (idx !== -1) {
    db.fallbackStore.deal_cards[idx] = { ...db.fallbackStore.deal_cards[idx], ...req.body, id };
    return res.json({ success: true, message: 'Deal card updated in local store', deal: db.fallbackStore.deal_cards[idx] });
  }
  return res.status(404).json({ error: 'Deal card not found' });
});

// DELETE /api/offers/deals/:id - Delete a Deal Card
router.delete('/deals/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    if (db.getIsConnected()) {
      await db.query('DELETE FROM storefront_deal_cards WHERE id = $1', [id]);
      return res.json({ success: true, message: `Deal card #${id} deleted` });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete deal card: ' + err.message });
  }

  db.fallbackStore.deal_cards = db.fallbackStore.deal_cards.filter(d => d.id !== id);
  return res.json({ success: true, message: `Deal card #${id} deleted from local store` });
});

module.exports = router;
