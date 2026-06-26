const express = require('express');
const router = express.Router();
const { get, all } = require('../db');

// GET /api/categories
router.get('/', (req, res) => {
  const categories = all(`
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id
  `);
  res.json({ data: categories });
});

// GET /api/categories/:slug/products
router.get('/:slug/products', (req, res) => {
  const category = get('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);
  if (!category) return res.status(404).json({ error: 'Category not found' });

  const products = all(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE c.slug = ?
  `, [req.params.slug]);

  res.json({ data: products, category });
});

module.exports = router;
