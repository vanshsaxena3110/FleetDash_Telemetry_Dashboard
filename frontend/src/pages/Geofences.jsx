import React from 'react'
import { Plus } from 'lucide-react'
import GeofenceStats from '../components/GeofenceStats.jsx'
import GeofenceToolbar from '../components/GeofenceToolbar.jsx'
import GeofenceMap from '../components/GeofenceMap.jsx'
import GeofenceTable from '../components/GeofenceTable.jsx'
import GeofenceDetailsDrawer from '../components/GeofenceDetailsDrawer.jsx'
import GeofenceEvents from '../components/GeofenceEvents.jsx'

export default function Geofences({ isDarkMode = false }) {
  // Pre-configured geofences matching the screenshot
  const [geofences, setGeofences] = React.useState([
    { 
      id: 'g1', 
      name: 'Warehouse A', 
      type: 'circle', 
      radius: 2800, 
      lat: 27.498, 
      lng: 77.685, 
      insideCount: 1, 
      outsideCount: 2, 
      lastActivity: '2 min ago' 
    },
    { 
      id: 'g2', 
      name: 'Service Hub', 
      type: 'polygon', 
      radius: 0, 
      positions: [
        [27.35, 77.78],
        [27.36, 77.85],
        [27.28, 77.86],
        [27.27, 77.79]
      ], 
      insideCount: 1, 
      outsideCount: 2, 
      lastActivity: '5 min ago' 
    },
    { 
      id: 'g3', 
      name: 'Distribution Center', 
      type: 'polygon', 
      radius: 0, 
      positions: [
        [27.24, 77.92],
        [27.25, 77.98],
        [27.18, 77.99],
        [27.17, 77.93]
      ], 
      insideCount: 0, 
      outsideCount: 2, 
      lastActivity: 'Just now' 
    }
  ])

  // Mock vehicles displayed on the geofence map in Agra-Mathura area
  const geofenceVehicles = [
    { id: 'TRK-22AB', driver: 'Rahul Sharma', speed: '62 km/h', lat: 27.435, lng: 77.632, status: 'Moving', color: 'green' },
    { id: 'TRK-05DE', driver: 'Amit Verma', speed: '72 km/h', lat: 27.221, lng: 77.948, status: 'Moving', color: 'green' },
    { id: 'TRK-10FG', driver: 'Vikram Patel', speed: '0 km/h', lat: 27.315, lng: 77.820, status: 'Idle', color: 'yellow' },
    { id: 'TRK-11HI', driver: 'Sandeep Singh', speed: '0 km/h', lat: 27.162, lng: 77.995, status: 'Offline', color: 'red' },
    { id: 'TRK-09AB', driver: 'Rohit Sharma', speed: '60 km/h', lat: 27.228, lng: 77.958, status: 'Moving', color: 'green' }
  ]

  const [selectedGeofence, setSelectedGeofence] = React.useState(geofences[2]) // Default select Distribution Center
  const [searchVal, setSearchVal] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [newGeofenceName, setNewGeofenceName] = React.useState('')
  const [newGeofenceType, setNewGeofenceType] = React.useState('circle')
  const [newGeofenceRadius, setNewGeofenceRadius] = React.useState('1000')

  // Search/Filter logic
  const filteredGeofences = geofences.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchVal.toLowerCase())
    const matchesStatus = statusFilter === 'all' || statusFilter === 'active'
    return matchesSearch && matchesStatus
  })

  // Add geofence action with offset coordinates matching Mathura-Agra center
  const handleCreateGeofence = (e) => {
    e.preventDefault()
    if (!newGeofenceName.trim()) return

    // Offset center slightly to spread out newly created geofences
    const lat = 27.35 + (Math.random() - 0.5) * 0.15
    const lng = 77.85 + (Math.random() - 0.5) * 0.15

    const newFence = {
      id: `g${geofences.length + 1}`,
      name: newGeofenceName,
      type: newGeofenceType,
      radius: newGeofenceType === 'circle' ? parseInt(newGeofenceRadius) : 0,
      lat: lat,
      lng: lng,
      positions: newGeofenceType === 'polygon' ? [
        [lat + 0.02, lng - 0.03],
        [lat + 0.02, lng + 0.03],
        [lat - 0.02, lng + 0.03],
        [lat - 0.02, lng - 0.03]
      ] : null,
      insideCount: 0,
      outsideCount: 2,
      lastActivity: 'Just now'
    }

    setGeofences(prev => [...prev, newFence])
    setSelectedGeofence(newFence)
    setNewGeofenceName('')
    setShowCreateModal(false)
  }

  // Delete geofence action
  const handleDeleteGeofence = (id) => {
    setGeofences(prev => prev.filter(g => g.id !== id))
    if (selectedGeofence && selectedGeofence.id === id) {
      setSelectedGeofence(null)
    }
  }

  return (
    <div className="flex-grow overflow-y-auto p-6 md:p-8 flex flex-col gap-6 text-left bg-transparent">
      {/* Fallback Leaflet CDN CSS to resolve local bundler loading errors */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
        crossOrigin="" 
      />
      
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
        onRefresh={() => {}}
      />

      {/* 4. Map + Side Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* Left Column: Leaflet Map Container (70% / 7 cols) */}
        <div className="lg:col-span-7">
          <GeofenceMap 
            geofences={geofences}
            vehicles={geofenceVehicles}
            onSelectGeofence={(g) => setSelectedGeofence(g)}
            selectedGeofenceId={selectedGeofence ? selectedGeofence.id : null}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Right Column: Geofence Details Drawer (30% / 3 cols) */}
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

      {/* Mock Create Geofence Modal Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl border shadow-lg max-w-sm w-full p-5 text-left ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-4">Create New Geofence</h3>
            
            <form onSubmit={handleCreateGeofence} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Geofence Name</label>
                <input 
                  type="text" 
                  value={newGeofenceName}
                  onChange={(e) => setNewGeofenceName(e.target.value)}
                  placeholder="e.g. Warehouse C"
                  className={`w-full border rounded-lg p-2 text-xs focus:outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-850 text-white' : 'bg-slate-50 border-slate-250 text-slate-805'
                  }`}
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Zone Type</label>
                <select
                  value={newGeofenceType}
                  onChange={(e) => setNewGeofenceType(e.target.value)}
                  className={`w-full border rounded-lg p-2 text-xs focus:outline-none cursor-pointer ${
                    isDarkMode ? 'bg-slate-950 border-slate-855 text-white' : 'bg-slate-50 border-slate-250 text-slate-805'
                  }`}
                >
                  <option value="circle">Circular Zone</option>
                  <option value="polygon">Polygon Zone</option>
                </select>
              </div>

              {/* Radius (only for circular geofences) */}
              {newGeofenceType === 'circle' && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Radius (meters)</label>
                  <input 
                    type="number" 
                    value={newGeofenceRadius}
                    onChange={(e) => setNewGeofenceRadius(e.target.value)}
                    placeholder="Radius in meters"
                    className={`w-full border rounded-lg p-2 text-xs focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-850 text-white' : 'bg-slate-50 border-slate-250 text-slate-805'
                    }`}
                    min="100"
                    max="10000"
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-850">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                    isDarkMode ? 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-850' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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
