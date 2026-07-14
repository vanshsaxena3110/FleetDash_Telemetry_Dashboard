import { create } from 'zustand'

// Initial list of vehicles with coordinates around New Delhi
const INITIAL_VEHICLES = [
  { id: 'v1', name: 'MH01 AB 1234', driver: 'Rahul Sharma', speed: 60, temp: 88, fuel: 82, lat: 28.6304, lng: 77.2177, status: 'active', route: 'CP Ring Road' },
  { id: 'v2', name: 'DL02 CD 5678', driver: 'Amit Verma', speed: 45, temp: 82, fuel: 65, lat: 28.6500, lng: 77.3000, status: 'active', route: 'Anand Vihar Highway' },
  { id: 'v3', name: 'KA02 EF 9012', driver: 'Sandeep Singh', speed: 0, temp: 40, fuel: 90, lat: 28.5562, lng: 77.1000, status: 'stopped', route: 'IGI Airport Terminal 3' },
  { id: 'v4', name: 'GJ04 GH 3456', driver: 'Vikram Patel', speed: 12, temp: 75, fuel: 48, lat: 28.6000, lng: 77.2500, status: 'idle', route: 'Noida Link Road' },
  { id: 'v5', name: 'HR26 AL 7890', driver: 'Manish Yadav', speed: 52, temp: 85, fuel: 72, lat: 28.6400, lng: 77.1800, status: 'active', route: 'Karol Bagh Road' },
  { id: 'v6', name: 'UP16 ZQ 4567', driver: 'Pankaj Kumar', speed: 0, temp: 35, fuel: 15, lat: 28.5800, lng: 77.3200, status: 'stopped', route: 'Noida Sector 62' }
]

// Predefined Geofences
const GEOFENCES = [
  { id: 'g1', name: 'Connaught Place Zone', lat: 28.6304, lng: 77.2177, radius: 1500, type: 'safe', status: 'active' },
  { id: 'g2', name: 'IGI Airport Circle', lat: 28.5562, lng: 77.1000, radius: 2500, type: 'restricted', status: 'active' },
  { id: 'g3', name: 'Anand Vihar Hub', lat: 28.6500, lng: 77.3000, radius: 1800, type: 'safe', status: 'warning' }
]

// Helper to calculate distance in meters between two lat/lng coordinates
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3 // metres
  const phi1 = lat1 * Math.PI / 180
  const phi2 = lat2 * Math.PI / 180
  const deltaPhi = (lat2 - lat1) * Math.PI / 180
  const deltaLambda = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c // in metres
}

export const useVehicleStore = create((set, get) => {
  let intervalId = null

  return {
    vehicles: INITIAL_VEHICLES,
    geofences: GEOFENCES,
    alerts: [
      { id: 'a1', vehicle: 'MH01 AB 1234', type: 'Geofence Exit', severity: 'warning', message: 'MH01 AB 1234 exited Connaught Place Zone', time: new Date(Date.now() - 300000).toLocaleTimeString() },
      { id: 'a2', vehicle: 'GJ04 GH 3456', type: 'Overheating', severity: 'critical', message: 'Engine Temperature high: 95°C', time: new Date(Date.now() - 600000).toLocaleTimeString() }
    ],
    searchQuery: '',
    statusFilter: 'all',
    
    // Actions
    setSearchQuery: (query) => set({ searchQuery: query }),
    setStatusFilter: (filter) => set({ statusFilter: filter }),
    
    addGeofence: (newFence) => set((state) => ({ 
      geofences: [...state.geofences, { ...newFence, id: `g${state.geofences.length + 1}`, status: 'active' }] 
    })),
    
    deleteGeofence: (id) => set((state) => ({
      geofences: state.geofences.filter((g) => g.id !== id)
    })),
    
    resolveAlert: (id) => set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id)
    })),

    clearAllAlerts: () => set({ alerts: [] }),

    // Start live simulation updates
    startSimulation: () => {
      if (intervalId) return

      intervalId = setInterval(() => {
        set((state) => {
          const updatedVehicles = state.vehicles.map((v) => {
            if (v.status === 'stopped') {
              // Occasional startup
              if (Math.random() > 0.85) {
                return { ...v, status: 'active', speed: 20, temp: 50 }
              }
              return v
            }

            // Normal active/idle updates
            let speedDiff = (Math.random() - 0.5) * 8
            let newSpeed = Math.max(0, Math.min(100, Math.round(v.speed + speedDiff)))
            let newStatus = newSpeed === 0 ? 'idle' : 'active'
            
            // Random movement drift around New Delhi
            let latDrift = (Math.random() - 0.5) * 0.0015
            let lngDrift = (Math.random() - 0.5) * 0.0015
            let newLat = v.lat + latDrift
            let newLng = v.lng + lngDrift

            // Temperature matches speed/load
            let tempDiff = (newSpeed > 75 ? 2.5 : (Math.random() - 0.5) * 2)
            let newTemp = Math.max(30, Math.min(110, Math.round(v.temp + tempDiff)))
            
            // Fuel decreases slowly
            let newFuel = Math.max(0, Math.round((v.fuel - 0.05) * 10) / 10)

            return {
              ...v,
              speed: newSpeed,
              status: newStatus,
              lat: newLat,
              lng: newLng,
              temp: newTemp,
              fuel: newFuel
            }
          })

          // Calculate alert checks (overspeeding, geofence violations)
          const newAlerts = [...state.alerts]
          updatedVehicles.forEach((v) => {
            // 1. Overspeed Alert
            if (v.speed > 80) {
              const alertExists = newAlerts.some(
                (a) => a.vehicle === v.name && a.type === 'Overspeeding' && (Date.now() - new Date('2026-07-14T' + a.time).getTime() < 10000)
              )
              if (!alertExists) {
                newAlerts.unshift({
                  id: `alert-${Date.now()}-${Math.random()}`,
                  vehicle: v.name,
                  type: 'Overspeeding',
                  severity: 'critical',
                  message: `Vehicle ${v.name} exceeded speed limit: ${v.speed} km/h`,
                  time: new Date().toLocaleTimeString()
                })
              }
            }

            // 2. Geofence Alerts
            state.geofences.forEach((fence) => {
              const dist = getDistance(v.lat, v.lng, fence.lat, fence.lng)
              const inside = dist <= fence.radius
              
              // We can track geofence state (simulating entrance/exit triggers)
              if (fence.type === 'restricted' && inside && v.speed > 0) {
                const alertExists = newAlerts.some(
                  (a) => a.vehicle === v.name && a.type === 'Restricted Entry' && (Date.now() - new Date('2026-07-14T' + a.time).getTime() < 20000)
                )
                if (!alertExists) {
                  newAlerts.unshift({
                    id: `alert-${Date.now()}-${Math.random()}`,
                    vehicle: v.name,
                    type: 'Restricted Entry',
                    severity: 'critical',
                    message: `Restricted Area entry! ${v.name} entered ${fence.name}`,
                    time: new Date().toLocaleTimeString()
                  })
                }
              }
            })
          })

          // Keep alerts list capped to 25 items
          return {
            vehicles: updatedVehicles,
            alerts: newAlerts.slice(0, 25)
          }
        })
      }, 3000)
    },

    stopSimulation: () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }
})
