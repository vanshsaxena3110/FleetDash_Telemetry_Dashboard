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

// ─── Auth ──────────────────────────────────────────────────────────────────────

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

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export const fetchVehiclesApi = async () => {
  const response = await api.get('/vehicle/get')
  return response.data
}

export const createVehicleApi = async (data) => {
  const response = await api.post('/vehicle/create', data)
  return response.data
}

export const updateVehicleApi = async (id, data) => {
  const response = await api.patch(`/vehicle/update/${id}`, data)
  return response.data
}

export const deleteVehicleApi = async (id) => {
  const response = await api.delete(`/vehicle/delete/${id}`)
  return response.data
}

// ─── Geofences ────────────────────────────────────────────────────────────────

export const fetchGeofencesApi = async () => {
  const response = await api.get('/geofence/get')
  return response.data
}

export const createGeofenceApi = async (data) => {
  const response = await api.post('/geofence/create', data)
  return response.data
}

export const updateGeofenceApi = async (id, data) => {
  const response = await api.patch(`/geofence/update/${id}`, data)
  return response.data
}

export const deleteGeofenceApi = async (id) => {
  const response = await api.delete(`/geofence/delete/${id}`)
  return response.data
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const fetchDashboardStatsApi = async () => {
  const response = await api.get('/dashboard/summary')
  return response.data
}

export const fetchDashboardRecentAlertsApi = async () => {
  const response = await api.get('/dashboard/alerts')
  return response.data
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const fetchAlertsApi = async () => {
  const response = await api.get('/alert/get')
  return response.data
}

export const createAlertApi = async (data) => {
  const response = await api.post('/alert/create', data)
  return response.data
}

export const resolveAlertApi = async (id) => {
  const response = await api.patch(`/alert/resolve/${id}`)
  return response.data
}

export const deleteAlertApi = async (id) => {
  const response = await api.delete(`/alert/delete/${id}`)
  return response.data
}

export const clearResolvedAlertsApi = async () => {
  const response = await api.delete('/alert/clear-resolved')
  return response.data
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export const fetchAnalyticsSummaryApi = async () => {
  const response = await api.get('/analytics/summary')
  return response.data
}

export const fetchFleetPerformanceApi = async () => {
  const response = await api.get('/analytics/performance')
  return response.data
}

export const fetchTopVehiclesApi = async () => {
  const response = await api.get('/analytics/top-vehicles')
  return response.data
}

// ─── Telemetry ────────────────────────────────────────────────────────────────

export const addTelemetryApi = async (data) => {
  const response = await api.post('/telemetry/add', data)
  return response.data
}

export const fetchVehicleTelemetryApi = async (vehicleId, limit = 50) => {
  const response = await api.get(`/telemetry/vehicle/${vehicleId}?limit=${limit}`)
  return response.data
}

export const fetchLatestTelemetryApi = async (vehicleId) => {
  const response = await api.get(`/telemetry/vehicle/${vehicleId}/latest`)
  return response.data
}

export default api
