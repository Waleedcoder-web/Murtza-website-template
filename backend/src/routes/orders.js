const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all orders
router.get('/', async (req, res) => {
  try {
    if (db.getIsConnected()) {
      const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
  return res.json(db.fallbackStore.orders);
});

// GET single order by order_number
router.get('/:order_number', async (req, res) => {
  const num = req.params.order_number.toUpperCase();
  try {
    if (db.getIsConnected()) {
      const result = await db.query('SELECT * FROM orders WHERE order_number = $1', [num]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching order:', err);
  }
  const order = db.fallbackStore.orders.find(o => o.order_number.toUpperCase() === num);
  if (order) return res.json(order);
  return res.status(404).json({ error: 'Order not found' });
});

// CREATE new order
router.post('/', async (req, res) => {
  const { customer_name, email, phone, team_name, sport, delivery_date, items_count, total, notes } = req.body;
  const order_number = 'PO-' + Math.floor(100000 + Math.random() * 900000);

  try {
    if (db.getIsConnected()) {
      const result = await db.query(
        `INSERT INTO orders 
        (order_number, customer_name, email, phone, team_name, sport, delivery_date, items_count, total, status, notes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [order_number, customer_name || 'Valued Coach', email, phone, team_name, sport, delivery_date || null, items_count || 1, total || 0, 'pending', notes || '']
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error creating order in DB:', err);
  }

  const newOrder = {
    id: Date.now(),
    order_number,
    customer_name: customer_name || 'Valued Coach',
    email,
    phone,
    team_name,
    sport,
    delivery_date,
    items_count: items_count || 1,
    total: parseFloat(total) || 0,
    status: 'pending',
    notes: notes || '',
    created_at: new Date().toISOString()
  };
  db.fallbackStore.orders.unshift(newOrder);
  return res.status(201).json(newOrder);
});

// PATCH order status (Admin update)
router.patch('/:id/status', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  try {
    if (db.getIsConnected()) {
      const result = await db.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating status:', err);
  }

  const order = db.fallbackStore.orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    return res.json(order);
  }
  return res.status(404).json({ error: 'Order not found' });
});

module.exports = router;
