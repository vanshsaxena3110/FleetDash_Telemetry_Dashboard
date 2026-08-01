import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Attach JWT token if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth API Calls
export const loginApi = async (credentials) => {
  // credentials: { Username, password }
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const registerApi = async (userData) => {
  // userData: { Username, password }
  const response = await api.post('/auth/register', userData)
  return response.data
}

export const logoutApi = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Vehicle API Calls
export const fetchVehiclesApi = async () => {
  const response = await api.get('/vehicle')
  return response.data
}

export const createVehicleApi = async (data) => {
  const response = await api.post('/vehicle', data)
  return response.data
}

// Geofence API Calls
export const fetchGeofencesApi = async () => {
  const response = await api.get('/geofence')
  return response.data
}

export const createGeofenceApi = async (data) => {
  const response = await api.post('/geofence', data)
  return response.data
}

// Dashboard Stats API Call
export const fetchDashboardStatsApi = async () => {
  const response = await api.get('/dashboard')
  return response.data
}

// Alerts API Call
export const fetchAlertsApi = async () => {
  const response = await api.get('/alert')
  return response.data
}

// Analytics API Call
export const fetchAnalyticsApi = async () => {
  const response = await api.get('/analytics')
  return response.data
}

export default api
