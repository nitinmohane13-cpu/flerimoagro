const express = require('express');
const cors = require('cors');
const { getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Init DB then start server
getDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌿 FlerimoAgro API running on http://localhost:${PORT}`);
    console.log(`   GET  /api/products`);
    console.log(`   GET  /api/categories`);
    console.log(`   POST /api/auth/login`);
    console.log(`   POST /api/orders\n`);
  });
}).catch(console.error);
