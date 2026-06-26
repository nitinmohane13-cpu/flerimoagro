import { create } from 'zustand'
import { finalPrice, getProduct } from '../data/products'

export const useStore = create((set, get) => ({
  // ── Auth ──────────────────────────────────────────────────────────────────
  user: null,
  token: null,
  signIn: (user, token) => set({ user, token }),
  signOut: () => set({ user: null, token: null }),

  // ── Cart ──────────────────────────────────────────────────────────────────
  cart: [],

  addToCart: (id, qty = 1) => set(state => {
    const existing = state.cart.find(i => i.id === id)
    if (existing) {
      return { cart: state.cart.map(i => i.id === id ? { ...i, qty: i.qty + qty } : i) }
    }
    return { cart: [...state.cart, { id, qty }] }
  }),

  removeFromCart: (id) => set(state => ({
    cart: state.cart.filter(i => i.id !== id)
  })),

  setQty: (id, qty) => set(state => ({
    cart: qty <= 0
      ? state.cart.filter(i => i.id !== id)
      : state.cart.map(i => i.id === id ? { ...i, qty } : i)
  })),

  clearCart: () => set({ cart: [] }),

  get cartCount() {
    return get().cart.reduce((sum, i) => sum + i.qty, 0)
  },

  get cartSubtotal() {
    return get().cart.reduce((sum, i) => {
      const p = getProduct(i.id)
      return p ? sum + finalPrice(p) * i.qty : sum
    }, 0)
  },

  // ── Wishlist ──────────────────────────────────────────────────────────────
  wishlist: [],

  toggleWishlist: (id) => set(state => ({
    wishlist: state.wishlist.includes(id)
      ? state.wishlist.filter(x => x !== id)
      : [...state.wishlist, id]
  })),

  isWishlisted: (id) => get().wishlist.includes(id),
}))
