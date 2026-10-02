const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all customer inquiries & leads (Admin)
router.get('/', async (req, res) => {
  try {
    if (db.getIsConnected()) {
      const result = await db.query('SELECT * FROM inquiries ORDER BY created_at DESC');
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching inquiries:', err);
  }
  return res.json(db.fallbackStore.inquiries);
});

// POST message (Customer contact, website request, or quote)
router.post('/', async (req, res) => {
  const { type, name, email, phone, sport, subject, message, project_details, budget_range } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    if (db.getIsConnected()) {
      const result = await db.query(
        `INSERT INTO inquiries (type, name, email, phone, sport, subject, message, project_details, budget_range, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          type || 'Contact Form',
          name,
          email,
          phone || '',
          sport || '',
          subject || 'New Inquiry',
          message || '',
          project_details || null,
          budget_range || null,
          'new'
        ]
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error creating inquiry:', err);
  }

  const newInquiry = {
    id: Date.now(),
    type: type || 'Contact Form',
    name,
    email,
    phone,
    sport,
    subject: subject || 'New Inquiry',
    message,
    project_details: project_details || null,
    budget_range: budget_range || null,
    status: 'new',
    created_at: new Date().toISOString()
  };
  db.fallbackStore.inquiries.unshift(newInquiry);
  return res.status(201).json(newInquiry);
});

// PATCH inquiry status / reply
router.patch('/:id/reply', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { reply_notes } = req.body;

  try {
    if (db.getIsConnected()) {
      const result = await db.query(
        `UPDATE inquiries 
         SET status = 'replied', reply_notes = $1, replied_at = CURRENT_TIMESTAMP 
         WHERE id = $2 RETURNING *`,
        [reply_notes || 'Replied to customer', id]
      );
      if (result.rows.length > 0) return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating inquiry status:', err);
  }

  const inq = db.fallbackStore.inquiries.find(i => i.id === id);
  if (inq) {
    inq.status = 'replied';
    inq.reply_notes = reply_notes;
    inq.replied_at = new Date().toISOString();
    return res.json(inq);
  }
  return res.status(404).json({ error: 'Inquiry not found' });
});

module.exports = router;
