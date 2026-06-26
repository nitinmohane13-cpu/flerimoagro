# FlerimoAgro — React Native (Expo)

Agriculture e-commerce mobile app for iOS & Android.

## Stack
- Expo (managed workflow)
- React Navigation (bottom tabs + stack)
- Zustand (cart, wishlist, auth state)
- Axios (FastAPI backend — mock data for now)

## Setup

```bash
npm install
npx expo start
```

Scan QR with Expo Go app on your phone, or press `a` for Android emulator, `i` for iOS simulator.

## Screens
- Home — hero banner, categories, deals, popular products
- Search — live search across all products
- Category — filtered product grid
- Product Detail — image, rating, qty selector, add to cart
- Cart — item list, qty controls, order summary
- Checkout — delivery form, payment method, place order
- Wishlist — saved products
- Account — sign in / sign up / profile

## Connecting to FastAPI backend
Update `src/api/client.js`:
```js
baseURL: 'http://YOUR_SERVER_IP:8000'
```
Then swap mock data in screens with API calls from `src/api/client.js`.

## Project structure
```
FlerimoAgro/
  App.js
  src/
    screens/       — all 8 screens
    components/    — ProductCard
    store/         — Zustand store (cart, wishlist, auth)
    data/          — mock products + categories
    api/           — axios client + endpoints
    navigation/    — bottom tabs + stack navigator
```
