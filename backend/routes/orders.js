const express = require('express');
const router = express.Router();
const { run, all } = require('../db');
const { auth } = require('../middleware/auth');

router.post('/', auth, (req, res) => {
  const { items, delivery_address, payment_method, total } = req.body;
  if (!items || !items.length)
    return res.status(400).json({ error: 'No items in order' });

  const order = run(
    'INSERT INTO orders (user_id, total, delivery_address, payment_method) VALUES (?, ?, ?, ?)',
    [req.user.id, total, delivery_address, payment_method || 'cod']
  );

  for (const item of items) {
    run('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [order.lastInsertRowid, item.product_id, item.quantity, item.price]);
  }

  res.status(201).json({ order_id: order.lastInsertRowid, message: 'Order placed successfully' });
});

router.get('/', auth, (req, res) => {
  const orders = all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json({ data: orders });
});

module.exports = router;
