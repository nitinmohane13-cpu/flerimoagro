const express = require('express');
const router = express.Router();
const { get, all } = require('../db');

// GET /api/products
router.get('/', (req, res) => {
  const { search, category, featured, deal } = req.query;

  let query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    query += ` AND c.slug = ?`;
    params.push(category);
  }
  if (featured === 'true') query += ` AND p.is_featured = 1`;
  if (deal === 'true') query += ` AND p.is_deal = 1`;

  const products = all(query, params);
  res.json({ data: products, count: products.length });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = get(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, [req.params.id]);

  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ data: product });
});

module.exports = router;
