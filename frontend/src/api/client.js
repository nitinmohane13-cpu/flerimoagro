import axios from 'axios'
import { useStore } from '../store'

const api = axios.create({
  baseURL: 'http://192.168.1.8:8000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if available
api.interceptors.request.use(config => {
  const token = useStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

// ── Auth endpoints (swap mock for real when FastAPI is ready) ──────────────
export const authApi = {
  login:    (email, password) => api.post('/auth/login',    { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
}

// ── Product endpoints ──────────────────────────────────────────────────────
export const productApi = {
  list:       (params) => api.get('/products', { params }),
  detail:     (id)     => api.get(`/products/${id}`),
  categories: ()       => api.get('/categories'),
}

// ── Order endpoints ────────────────────────────────────────────────────────
export const orderApi = {
  place:  (payload) => api.post('/orders', payload),
  list:   ()        => api.get('/orders'),
  detail: (id)      => api.get(`/orders/${id}`),
}
