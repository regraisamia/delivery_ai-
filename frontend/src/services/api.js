import axios from 'axios'

const API_BASE = '/api'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const api = {
  // Auth
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  getMe: () => axios.get(`${API_BASE}/auth/me`),
  
  // Orders
  createOrder: (data) => axios.post(`${API_BASE}/orders/`, data),
  getOrders: () => axios.get(`${API_BASE}/orders/`),
  getOrder: (id) => axios.get(`${API_BASE}/orders/${id}`),
  trackOrder: (trackingNumber) => axios.get(`${API_BASE}/orders/tracking/${trackingNumber}`),
  getTrackingEvents: (orderId) => axios.get(`${API_BASE}/tracking/${orderId}`),
  calculatePrice: (data) => axios.post(`${API_BASE}/pricing/calculate`, data),
  getAgentStatus: () => axios.get(`${API_BASE}/agents/status`),

  // Inter-City Operations
  createInterCityOrder: (data) => axios.post(`${API_BASE}/inter-city/orders`, data),
  monitorInterCityDelivery: (orderId) => axios.post(`${API_BASE}/inter-city/orders/${orderId}/monitor`),
  getInterCityPricing: (origin, destination, params = {}) => axios.get(`${API_BASE}/inter-city/pricing/${origin}/${destination}`, { params }),
  getInterCityRoute: (origin, destination, params = {}) => axios.get(`${API_BASE}/inter-city/routes/${origin}/${destination}`, { params })
}
