const { getDb, run, exec, saveDb } = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  await getDb(); // init DB

  console.log('🌱 Seeding database...');

  exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM users;
  `);

  const categories = [
    { name: 'Vegetables', slug: 'vegetables', icon: '🥦', color: '#4CAF50' },
    { name: 'Fruits', slug: 'fruits', icon: '🍎', color: '#FF5722' },
    { name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: '🥛', color: '#FFC107' },
    { name: 'Pantry', slug: 'pantry', icon: '🌾', color: '#795548' },
  ];

  const categoryIds = {};
  for (const cat of categories) {
    const r = run(
      'INSERT INTO categories (name, slug, icon, color) VALUES (?, ?, ?, ?)',
      [cat.name, cat.slug, cat.icon, cat.color]
    );
    categoryIds[cat.slug] = r.lastInsertRowid;
  }

  const products = [
    { name: 'Fresh Spinach', slug: 'fresh-spinach', description: 'Tender baby spinach leaves, farm fresh', price: 2.99, orig: 3.99, cat: 'vegetables', unit: '250g', stock: 150, rating: 4.5, reviews: 128, featured: 1, deal: 1 },
    { name: 'Organic Tomatoes', slug: 'organic-tomatoes', description: 'Vine-ripened organic tomatoes', price: 3.49, orig: null, cat: 'vegetables', unit: '500g', stock: 200, rating: 4.3, reviews: 95, featured: 1, deal: 0 },
    { name: 'Carrots', slug: 'carrots', description: 'Fresh garden carrots, naturally sweet', price: 1.99, orig: 2.49, cat: 'vegetables', unit: '1kg', stock: 300, rating: 4.2, reviews: 74, featured: 0, deal: 1 },
    { name: 'Broccoli', slug: 'broccoli', description: 'Crisp green broccoli florets', price: 2.49, orig: null, cat: 'vegetables', unit: '500g', stock: 180, rating: 4.4, reviews: 112, featured: 0, deal: 0 },
    { name: 'Bell Peppers Mix', slug: 'bell-peppers-mix', description: 'Colorful mix of red, yellow and green peppers', price: 4.99, orig: 5.99, cat: 'vegetables', unit: '3 pack', stock: 120, rating: 4.6, reviews: 87, featured: 1, deal: 1 },
    { name: 'Alphonso Mangoes', slug: 'alphonso-mangoes', description: 'Premium Alphonso mangoes, sweet and juicy', price: 8.99, orig: 10.99, cat: 'fruits', unit: '1kg', stock: 80, rating: 4.8, reviews: 203, featured: 1, deal: 1 },
    { name: 'Strawberries', slug: 'strawberries', description: 'Fresh ripe strawberries', price: 5.49, orig: null, cat: 'fruits', unit: '400g', stock: 100, rating: 4.5, reviews: 156, featured: 1, deal: 0 },
    { name: 'Bananas', slug: 'bananas', description: 'Ripe yellow bananas', price: 1.49, orig: null, cat: 'fruits', unit: '6 pack', stock: 400, rating: 4.1, reviews: 89, featured: 0, deal: 0 },
    { name: 'Watermelon', slug: 'watermelon', description: 'Sweet seedless watermelon', price: 6.99, orig: 8.99, cat: 'fruits', unit: 'whole', stock: 50, rating: 4.7, reviews: 64, featured: 0, deal: 1 },
    { name: 'Farm Fresh Eggs', slug: 'farm-fresh-eggs', description: 'Free range eggs from happy hens', price: 4.99, orig: null, cat: 'dairy-eggs', unit: '12 pack', stock: 250, rating: 4.6, reviews: 178, featured: 1, deal: 0 },
    { name: 'Full Cream Milk', slug: 'full-cream-milk', description: 'Fresh full cream milk, pasteurised', price: 2.99, orig: null, cat: 'dairy-eggs', unit: '1 litre', stock: 300, rating: 4.3, reviews: 134, featured: 0, deal: 0 },
    { name: 'Natural Yogurt', slug: 'natural-yogurt', description: 'Creamy natural yogurt, no additives', price: 3.49, orig: 3.99, cat: 'dairy-eggs', unit: '500g', stock: 150, rating: 4.4, reviews: 92, featured: 1, deal: 1 },
    { name: 'Butter', slug: 'butter', description: 'Unsalted creamery butter', price: 4.49, orig: null, cat: 'dairy-eggs', unit: '250g', stock: 200, rating: 4.2, reviews: 67, featured: 0, deal: 0 },
    { name: 'Basmati Rice', slug: 'basmati-rice', description: 'Aged long grain basmati rice', price: 7.99, orig: 9.99, cat: 'pantry', unit: '2kg', stock: 500, rating: 4.5, reviews: 211, featured: 1, deal: 1 },
    { name: 'Cold Pressed Olive Oil', slug: 'olive-oil', description: 'Extra virgin cold pressed olive oil', price: 12.99, orig: null, cat: 'pantry', unit: '500ml', stock: 120, rating: 4.7, reviews: 145, featured: 1, deal: 0 },
    { name: 'Whole Wheat Flour', slug: 'whole-wheat-flour', description: 'Stone ground whole wheat flour', price: 3.99, orig: 4.99, cat: 'pantry', unit: '1kg', stock: 300, rating: 4.0, reviews: 78, featured: 0, deal: 1 },
  ];

  for (const p of products) {
    run(
      `INSERT INTO products (name, slug, description, price, original_price, category_id, unit, stock, rating, review_count, is_featured, is_deal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.name, p.slug, p.description, p.price, p.orig || null, categoryIds[p.cat], p.unit, p.stock, p.rating, p.reviews, p.featured, p.deal]
    );
  }

  const hash = bcrypt.hashSync('test1234', 10);
  run(
    'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
    ['Test User', 'test@flerimo.com', hash, '+91 9999999999']
  );

  saveDb();

  console.log('✅ Seeded:');
  console.log(`   ${categories.length} categories`);
  console.log(`   ${products.length} products`);
  console.log('   1 test user → test@flerimo.com / test1234');
}

seed().catch(console.error);
