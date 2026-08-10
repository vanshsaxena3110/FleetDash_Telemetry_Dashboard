import React from 'react'
import { io } from 'socket.io-client'
import { Plus } from 'lucide-react'
import GeofenceStats from '../components/GeofenceStats.jsx'
import GeofenceToolbar from '../components/GeofenceToolbar.jsx'
import GeofenceMap from '../components/GeofenceMap.jsx'
import GeofenceTable from '../components/GeofenceTable.jsx'
import GeofenceDetailsDrawer from '../components/GeofenceDetailsDrawer.jsx'
import GeofenceEvents from '../components/GeofenceEvents.jsx'
import {
  fetchVehiclesApi,
  fetchGeofencesApi,
  createGeofenceApi,
} from '../services/api.js'



export default function Geofences({ isDarkMode = false }) {

  // REAL geofences from MongoDB
  const [geofences, setGeofences] = React.useState([])

  // REAL vehicles from MongoDB
  const [geofenceVehicles, setGeofenceVehicles] = React.useState([])

 
  

  // Load geofences from backend
  React.useEffect(() => {
    const loadGeofences = async () => {
      try {
        const response = await fetchGeofencesApi()
        const data = response?.geofences || response?.data?.geofences || []
        setGeofences(data)
      } catch (error) {
        console.error('Failed to load geofences:', error)
      }
    }
    loadGeofences()
  }, [])

  // Load vehicles from backend
  React.useEffect(() => {
    const loadVehicles = async () => {
      try {
       const response = await fetchVehiclesApi()

const vehicles =
  Array.isArray(response)
    ? response
    : response?.vehicles ||
      response?.data?.vehicles ||
      response?.data?.data?.vehicles ||
      []

console.log("🚚 GEOFENCE VEHICLES FROM API:", vehicles)

const formattedVehicles = vehicles
  .map((vehicle) => {
    const lat =
      vehicle.currentLocation?.latitude ??
      vehicle.latitude

    const lng =
      vehicle.currentLocation?.longitude ??
      vehicle.longitude

    return {
      ...vehicle,
      id: vehicle.id || vehicle._id,
      lat: Number(lat),
      lng: Number(lng),
      speed: vehicle.latestTelemetry?.speed ?? 0,
      status: vehicle.status || "offline",
      color:
        vehicle.status === "moving"
          ? "green"
          : vehicle.status === "idle"
            ? "yellow"
            : "red",
    }
  })
  .filter(
    (vehicle) =>
      Number.isFinite(vehicle.lat) &&
      Number.isFinite(vehicle.lng)
  )

console.log("📍 GEOFENCE VEHICLES ON MAP:", formattedVehicles)

setGeofenceVehicles(formattedVehicles)
      } catch (error) {
        console.error('Failed to load geofence vehicles:', error)
      }
    }
    loadVehicles()
  }, [])

  // Real-time telemetry updates + geofence entry/exit alert popup
  const [geofencePopAlert, setGeofencePopAlert] = React.useState(null)

  React.useEffect(() => {
    const socket = io('http://localhost:3000')

    socket.on('telemetry_update', ({ vehicle }) => {
      if (!vehicle) return
      const updatedVehicle = {
        ...vehicle,
        id: vehicle.id || vehicle._id,
        lat: vehicle.currentLocation?.latitude,
        lng: vehicle.currentLocation?.longitude,
        speed: `${vehicle.latestTelemetry?.speed ?? 0} km/h`,
        status: vehicle.status,
        color:
          vehicle.status === 'moving'
            ? 'green'
            : vehicle.status === 'idle'
              ? 'yellow'
              : 'red',
      }
      setGeofenceVehicles((prev) =>
        prev.map((v) =>
          String(v.id) === String(updatedVehicle.id)
            ? { ...v, ...updatedVehicle }
            : v
        )
      )
    })

    socket.on('new_alert', (newAlert) => {
  console.log(" FRONTEND RECEIVED ALERT:", newAlert)

  if (!newAlert) return

  if (newAlert.type === 'geofence') {
    console.log("🟢 GEOFENCE ALERT RECEIVED:", newAlert)

    setGeofencePopAlert(newAlert)

    setTimeout(() => {
      setGeofencePopAlert(null)
    }, 25000)
  }
})

    socket.on('geofence_update', ({ geofence }) => {
      if (!geofence) return
      setGeofences((prev) =>
        prev.map((g) =>
          String(g._id || g.id) === String(geofence.id)
            ? { ...g, ...geofence }
            : g
        )
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  
  
  const [selectedGeofence, setSelectedGeofence] = React.useState(null)
  const [searchVal, setSearchVal] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [newGeofenceName, setNewGeofenceName] = React.useState('')
  const [newGeofenceType, setNewGeofenceType] = React.useState('circle')
  const [newGeofenceRadius, setNewGeofenceRadius] = React.useState('1000')

  // Search / filter
  const filteredGeofences = geofences.filter((g) => {
    const matchesSearch = (g.name || '').toLowerCase().includes(searchVal.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      g.status === statusFilter ||
      (statusFilter === 'active' && (!g.status || g.status === 'active'))
    return matchesSearch && matchesStatus
  })

  // CREATE REAL GEOFENCE
  const handleCreateGeofence = async (e) => {
    e.preventDefault()
    if (!newGeofenceName.trim()) return

    const lat = 28.6139
    const lng = 77.2090

    const newFence = {
      name: newGeofenceName.trim(),
      type: newGeofenceType,
      radius: newGeofenceType === 'circle' ? Number(newGeofenceRadius) : 0,
      lat,
      lng,
      positions:
        newGeofenceType === 'polygon'
          ? [
            [lat + 0.02, lng - 0.03],
            [lat + 0.02, lng + 0.03],
            [lat - 0.02, lng + 0.03],
            [lat - 0.02, lng - 0.03],
          ]
          : undefined,
      insideCount: 0,
      outsideCount: geofenceVehicles.length,
      lastActivity: 'Just now',
      status: 'active',
    }

    try {
      const response = await createGeofenceApi(newFence)
      const createdGeofence = response?.geofence || response?.data?.geofence

      if (!createdGeofence) {
        console.error('Geofence was created but response was unexpected:', response)
        return
      }

      setGeofences((prev) => [...prev, createdGeofence])
      setSelectedGeofence(createdGeofence)
      setNewGeofenceName('')
      setNewGeofenceType('circle')
      setNewGeofenceRadius('1000')
      setShowCreateModal(false)
    } catch (error) {
      console.error('Create geofence failed:', error)
    }
  }

  // Delete from current UI
  const handleDeleteGeofence = (id) => {
    setGeofences((prev) => prev.filter((g) => g.id !== id))
    if (selectedGeofence && selectedGeofence.id === id) {
      setSelectedGeofence(null)
    }
  }

  return (
    <div className="grow overflow-y-auto p-6 md:p-8 flex flex-col gap-6 text-left bg-transparent">

      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      {/* GEOFENCE ENTRY/EXIT ALERT POPUP */}
      {geofencePopAlert && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[380px] rounded-xl border border-rose-500 bg-white p-4 shadow-2xl">
          <div className="font-black text-rose-600 text-sm flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            🚨 {geofencePopAlert.title}
          </div>
          <div className="mt-2 text-xs font-bold text-slate-700">
            {geofencePopAlert.description}
          </div>
          {geofencePopAlert.vehicleNumber && (
            <div className="mt-1 text-[10px] text-slate-500 font-semibold">
              Vehicle: {geofencePopAlert.vehicleNumber} · Driver: {geofencePopAlert.driverName || 'N/A'}
            </div>
          )}
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex items-center justify-between select-none">
        <div>
          <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Geofence Management</h1>
          <p className="text-[11px] text-slate-500 font-bold mt-0.5">Create, monitor, and manage virtual boundaries for fleet vehicles.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all px-3 py-1.5 text-xs font-bold text-white cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Create Geofence</span>
        </button>
      </div>

      {/* 2. Geofence Stats cards */}
      <GeofenceStats isDarkMode={isDarkMode} />

      {/* 3. Toolbar filters */}
      <GeofenceToolbar
        searchVal={searchVal}
        onSearchChange={setSearchVal}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isDarkMode={isDarkMode}
        onRefresh={() => window.location.reload()}
      />

      {/* 4. Map + Side Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        <div className="lg:col-span-7">
          <GeofenceMap
            geofences={geofences}
            vehicles={geofenceVehicles}
            onSelectGeofence={(g) => setSelectedGeofence(g)}
            selectedGeofenceId={selectedGeofence ? selectedGeofence.id : null}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="lg:col-span-3">
          <GeofenceDetailsDrawer
            geofence={selectedGeofence}
            onClose={() => setSelectedGeofence(null)}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* 5. Geofence Events & Registry Grid split */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-start">
        <div className="xl:col-span-7">
          <GeofenceTable
            geofences={filteredGeofences}
            onSelectGeofence={(g) => setSelectedGeofence(g)}
            selectedGeofenceId={selectedGeofence ? selectedGeofence.id : null}
            onDeleteGeofence={handleDeleteGeofence}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="xl:col-span-3">
          <GeofenceEvents isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Create Geofence Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl border shadow-lg max-w-sm w-full p-5 text-left ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-4">Create New Geofence</h3>
            <form onSubmit={handleCreateGeofence} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Geofence Name</label>
                <input
                  type="text"
                  value={newGeofenceName}
                  onChange={(e) => setNewGeofenceName(e.target.value)}
                  placeholder="e.g. Warehouse C"
                  className={`w-full border rounded-lg p-2 text-xs focus:outline-none ${isDarkMode ? 'bg-slate-950 border-slate-850 text-white' : 'bg-slate-50 border-slate-250 text-slate-805'
                    }`}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Zone Type</label>
                <select
                  value={newGeofenceType}
                  onChange={(e) => setNewGeofenceType(e.target.value)}
                  className={`w-full border rounded-lg p-2 text-xs focus:outline-none cursor-pointer ${isDarkMode ? 'bg-slate-950 border-slate-855 text-white' : 'bg-slate-50 border-slate-250 text-slate-805'
                    }`}
                >
                  <option value="circle">Circular Zone</option>
                  <option value="polygon">Polygon Zone</option>
                </select>
              </div>
              {newGeofenceType === 'circle' && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Radius (meters)</label>
                  <input
                    type="number"
                    value={newGeofenceRadius}
                    onChange={(e) => setNewGeofenceRadius(e.target.value)}
                    placeholder="Radius in meters"
                    className={`w-full border rounded-lg p-2 text-xs focus:outline-none ${isDarkMode ? 'bg-slate-950 border-slate-850 text-white' : 'bg-slate-50 border-slate-250 text-slate-805'
                      }`}
                    min="100"
                    max="10000"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${isDarkMode ? 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-850' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
