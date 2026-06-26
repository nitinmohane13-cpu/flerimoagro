export const CATEGORIES = [
  { slug: 'vegetables', name: 'Vegetables', emoji: '🥦' },
  { slug: 'fruits',     name: 'Fruits',     emoji: '🍎' },
  { slug: 'dairy-eggs', name: 'Dairy & Eggs', emoji: '🥛' },
  { slug: 'pantry',     name: 'Pantry',     emoji: '🍯' },
]

export const PRODUCTS = [
  { id: 'tomato',     name: 'Vine Roma Tomatoes',    category: 'vegetables', price: 49,  unit: '500 g',  rating: 4.7, reviews: 214, description: 'Sun-ripened Roma tomatoes picked at peak freshness.', tags: ['Local Farm', 'Pesticide-Free'], inStock: true },
  { id: 'spinach',    name: 'Organic Baby Spinach',  category: 'vegetables', price: 65,  unit: '200 g',  rating: 4.8, reviews: 167, description: 'Tender organic baby spinach leaves, triple-washed.', tags: ['Organic', 'Ready to Eat'], discount: 15, inStock: true },
  { id: 'carrot',     name: 'Farm Carrots',          category: 'vegetables', price: 39,  unit: '1 kg',   rating: 4.6, reviews: 132, description: 'Crunchy, sweet carrots harvested fresh from the farm.', tags: ['Local Farm'], inStock: true },
  { id: 'broccoli',   name: 'Green Broccoli',        category: 'vegetables', price: 45,  unit: '1 head', rating: 4.5, reviews: 98,  description: 'Dense, vibrant broccoli crowns packed with nutrients.', tags: ['High Fiber'], inStock: true },
  { id: 'bell-pepper',name: 'Red Bell Peppers',      category: 'vegetables', price: 70,  unit: '3 pcs',  rating: 4.7, reviews: 76,  description: 'Glossy, sweet red bell peppers, crisp and colorful.', tags: ['Vitamin C'], inStock: true },
  { id: 'potato',     name: 'Golden Potatoes',       category: 'vegetables', price: 59,  unit: '2 kg',   rating: 4.4, reviews: 145, description: 'Versatile golden potatoes with a buttery texture.', tags: ['Pantry Staple'], inStock: true },
  { id: 'banana',     name: 'Ripe Bananas',          category: 'fruits',     price: 35,  unit: '1 kg',   rating: 4.8, reviews: 302, description: 'Naturally sweet bananas at the perfect ripeness.', tags: ['Everyday Favorite'], inStock: true },
  { id: 'apple',      name: 'Royal Gala Apples',     category: 'fruits',     price: 79,  unit: '1 kg',   rating: 4.7, reviews: 189, description: 'Crisp, juicy Royal Gala apples with a honeyed sweetness.', tags: ['Hand Picked'], discount: 10, inStock: true },
  { id: 'strawberry', name: 'Fresh Strawberries',    category: 'fruits',     price: 89,  unit: '250 g',  rating: 4.9, reviews: 256, description: 'Plump, fragrant strawberries bursting with flavor.', tags: ['Seasonal', 'Sweet'], inStock: true },
  { id: 'orange',     name: 'Navel Oranges',         category: 'fruits',     price: 59,  unit: '1 kg',   rating: 4.6, reviews: 121, description: 'Juicy, seedless navel oranges loaded with vitamin C.', tags: ['Vitamin C'], inStock: true },
  { id: 'avocado',    name: 'Hass Avocados',         category: 'fruits',     price: 99,  unit: '2 pcs',  rating: 4.5, reviews: 174, description: 'Creamy Hass avocados ripened to perfection.', tags: ['Healthy Fats'], inStock: true },
  { id: 'grapes',     name: 'Green Seedless Grapes', category: 'fruits',     price: 79,  unit: '500 g',  rating: 4.6, reviews: 88,  description: 'Crisp, sweet seedless green grapes.', tags: ['Seedless'], inStock: false },
  { id: 'eggs',       name: 'Free-Range Brown Eggs', category: 'dairy-eggs', price: 85,  unit: '12 pcs', rating: 4.8, reviews: 211, description: 'Farm-fresh free-range brown eggs from happy hens.', tags: ['Free Range'], inStock: true },
  { id: 'milk',       name: 'Farm Fresh Milk',       category: 'dairy-eggs', price: 55,  unit: '1 L',    rating: 4.7, reviews: 143, description: 'Creamy whole milk delivered fresh from local dairy farms.', tags: ['Local Dairy'], inStock: true },
  { id: 'honey',      name: 'Raw Wildflower Honey',  category: 'pantry',     price: 159, unit: '350 g',  rating: 4.9, reviews: 97,  description: 'Unfiltered raw wildflower honey with a rich floral aroma.', tags: ['Raw', 'Unfiltered'], discount: 20, inStock: true },
  { id: 'bread',      name: 'Whole Wheat Bread',     category: 'pantry',     price: 65,  unit: '600 g',  rating: 4.5, reviews: 64,  description: 'Hearty whole wheat bread baked fresh daily.', tags: ['Freshly Baked'], inStock: true },
]

export function finalPrice(product) {
  if (!product.discount) return product.price
  return +(product.price * (1 - product.discount / 100)).toFixed(0)
}

export function getProduct(id) {
  return PRODUCTS.find(p => p.id === id)
}

export function getProductsByCategory(slug) {
  return PRODUCTS.filter(p => p.category === slug)
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.category.toLowerCase().includes(q)
  )
}
