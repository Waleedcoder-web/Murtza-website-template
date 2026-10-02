const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all artwork requests
router.get('/', async (req, res) => {
  try {
    if (db.getIsConnected()) {
      const result = await db.query('SELECT * FROM artwork_requests ORDER BY created_at DESC');
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching artwork requests:', err);
  }
  return res.json(db.fallbackStore.artwork_requests);
});

// CREATE artwork request
router.post('/', async (req, res) => {
  const { customer_name, email, phone, team_name, sport, aesthetic, products_needed, notes } = req.body;
  const request_number = 'ART-' + Math.floor(100 + Math.random() * 900);

  try {
    if (db.getIsConnected()) {
      const result = await db.query(
        `INSERT INTO artwork_requests 
        (request_number, customer_name, email, phone, team_name, sport, aesthetic, products_needed, notes, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [request_number, customer_name, email, phone, team_name, sport, aesthetic || 'Custom', products_needed || 'Jerseys', notes || '', 'Designer Assigned']
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error creating artwork request:', err);
  }

  const newRequest = {
    id: Date.now(),
    request_number,
    customer_name,
    email,
    phone,
    team_name,
    sport,
    aesthetic: aesthetic || 'Custom',
    products_needed: products_needed || 'Jerseys',
    notes: notes || '',
    status: 'Designer Assigned',
    created_at: new Date().toISOString()
  };
  db.fallbackStore.artwork_requests.unshift(newRequest);
  return res.status(201).json(newRequest);
});

module.exports = router;
