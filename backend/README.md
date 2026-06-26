# FlerimoAgro Backend

Node.js + Express + SQLite backend for the FlerimoAgro app.

## Setup

```bash
npm install
node seed.js     # seed DB with 16 products + 4 categories + test user
npm run dev      # start with nodemon (auto-restart)
# or
npm start        # start normally
```

API runs on http://localhost:8000

## Test credentials
- Email: test@flerimo.com
- Password: test1234

## Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/products | No | List products (supports ?search=, ?category=, ?featured=true, ?deal=true) |
| GET | /api/products/:id | No | Single product |
| GET | /api/categories | No | All categories with product count |
| GET | /api/categories/:slug/products | No | Products by category |
| POST | /api/auth/register | No | Register |
| POST | /api/auth/login | No | Login → returns JWT |
| GET | /api/auth/me | Yes | Current user profile |
| PUT | /api/auth/profile | Yes | Update profile |
| POST | /api/orders | Yes | Place order |
| GET | /api/orders | Yes | User's order history |

## Connect to Expo app

Update `src/api/client.js` in the Expo project:

```js
// For Android emulator
baseURL: 'http://10.0.2.2:8000'

// For iOS simulator or Expo Go on same WiFi
baseURL: 'http://YOUR_LOCAL_IP:8000'

// Find your IP:
// Windows: ipconfig → IPv4 Address
// Mac: ifconfig | grep inet
```
