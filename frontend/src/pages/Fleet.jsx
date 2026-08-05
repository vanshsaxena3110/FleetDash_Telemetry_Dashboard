import React from 'react'
import {
  Car,
  Search,
  Maximize2,
  Compass,
  SlidersHorizontal,
  RefreshCw,
  Clock,
  X,
  User,
  Gauge,
  Power,
  Thermometer,
  AlertTriangle,
  MapPin,
  ChevronRight
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet'
import L from 'leaflet'
import { fetchVehiclesApi } from '../services/api.js'
import { connectSocket, onTelemetryUpdate, offSocketEvent } from '../services/socket.js'


// A controller component to automatically trigger invalidateSize on MapContainer mount
function MapResizeController() {
  const map = useMap()
  React.useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)
    return () => clearTimeout(timer)
  }, [map])
  return null
}


// Helper to render a car-shaped vehicle icon in Leaflet
const customMarkerIcon = (color) => {
  const fill = color === 'green' ? '#10B981' : color === 'yellow' ? '#F59E0B' : '#EF4444'
  const svg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 11h18l-1.5-4.5A1.5 1.5 0 0 0 18 5H6a1.5 1.5 0 0 0-1.5 1.5L3 11Z" fill="${fill}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 11v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5" fill="${fill}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.5" cy="16" r="1.5" fill="white"/><circle cx="16.5" cy="16" r="1.5" fill="white"/></svg>`
  const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  return L.icon({
    iconUrl: url,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  })
}

export default function Fleet({ isDarkMode = false }) {
  const [fleetSearchQuery, setFleetSearchQuery] = React.useState('')
  const [fleetStatusFilter, setFleetStatusFilter] = React.useState('all') // 'all', 'moving', 'idle', 'offline'
  const [liveFleetVehicles, setLiveFleetVehicles] = React.useState([])
  const [selectedVehicle, setSelectedVehicle] = React.useState(null)
  const [mapCenter, setMapCenter] = React.useState([27.35, 77.85])

  const rebuildFleetState = (serverVehicles) => {
    return serverVehicles.map((v) => {
      const latitude = v.currentLocation?.latitude ?? v.latitude
      const longitude = v.currentLocation?.longitude ?? v.longitude
      const status = v.status === 'moving' ? 'Moving' : v.status === 'idle' ? 'Idle' : 'Offline'

      return {
        id: v.id,
        vehicleNumber: v.vehicleNumber || v.regNo || v.id,
        driver: v.driver || v.driverName || `Driver ${v.vehicleNumber || v.regNo || v.id}`,
        speed: `${v.latestTelemetry?.speed ?? v.speed ?? 0} km/h`,
        fuel: v.latestTelemetry?.fuel ?? v.fuel ?? 0,
        engine: (v.latestTelemetry?.engineStatus ?? v.engineStatus) === 'on' ? 'ON' : 'OFF',
        temp: v.latestTelemetry?.temperature != null
          ? `${v.latestTelemetry.temperature}°C`
          : v.temp != null
            ? `${v.temp}°C`
            : '—',
        location: latitude != null && longitude != null
          ? `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`
          : 'No GPS data',
        time: v.currentLocation?.updatedAt
          ? new Date(v.currentLocation.updatedAt).toLocaleTimeString()
          : 'Just now',
        status,
        color: status === 'Moving' ? 'green' : status === 'Idle' ? 'yellow' : 'red',
        lat: latitude ?? 27.35,
        lng: longitude ?? 77.85,
      }
    })
  }

  React.useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await fetchVehiclesApi()
        const list = Array.isArray(response) ? response : response.vehicles || []
        const formatted = rebuildFleetState(list)
        setLiveFleetVehicles(formatted)
        setSelectedVehicle(formatted[0] ?? null)
        if (formatted.length && formatted[0].lat && formatted[0].lng) {
          setMapCenter([formatted[0].lat, formatted[0].lng])
        }
      } catch (err) {
        console.warn('Failed to load fleet vehicles:', err.message || err)
      }
    }

    loadVehicles()

    const socket = connectSocket()
    const handleTelemetry = ({ vehicle }) => {
      if (!vehicle) return
      setLiveFleetVehicles((prev) => {
        const updated = prev.map((item) => {
          if (String(item.id) !== String(vehicle.id)) return item
          return {
            id: vehicle.id,
            driver: item.driver,
            speed: `${vehicle.latestTelemetry?.speed ?? 0} km/h`,
            fuel: vehicle.latestTelemetry?.fuel ?? 0,
            engine: vehicle.latestTelemetry?.engineStatus === 'on' ? 'ON' : 'OFF',
            temp: vehicle.latestTelemetry?.temperature != null ? `${vehicle.latestTelemetry.temperature}°C` : '—',
            location: vehicle.currentLocation?.latitude && vehicle.currentLocation?.longitude
              ? `${Number(vehicle.currentLocation.latitude).toFixed(4)}, ${Number(vehicle.currentLocation.longitude).toFixed(4)}`
              : item.location,
            time: vehicle.currentLocation?.updatedAt ? new Date(vehicle.currentLocation.updatedAt).toLocaleTimeString() : 'Just now',
            status: vehicle.status === 'moving' ? 'Moving' : vehicle.status === 'idle' ? 'Idle' : 'Offline',
            color: vehicle.status === 'moving' ? 'green' : vehicle.status === 'idle' ? 'yellow' : 'red',
            lat: vehicle.currentLocation?.latitude ?? item.lat,
            lng: vehicle.currentLocation?.longitude ?? item.lng,
          }
        })

        const found = updated.some((item) => String(item.id) === String(vehicle.id))
        if (!found) {
          return [...updated, {
            id: vehicle.id,
            driver: `Driver ${vehicle.vehicleNumber}`,
            speed: `${vehicle.latestTelemetry?.speed ?? 0} km/h`,
            fuel: vehicle.latestTelemetry?.fuel ?? 0,
            engine: vehicle.latestTelemetry?.engineStatus === 'on' ? 'ON' : 'OFF',
            temp: vehicle.latestTelemetry?.temperature != null ? `${vehicle.latestTelemetry.temperature}°C` : '—',
            location: vehicle.currentLocation?.latitude && vehicle.currentLocation?.longitude
              ? `${Number(vehicle.currentLocation.latitude).toFixed(4)}, ${Number(vehicle.currentLocation.longitude).toFixed(4)}`
              : 'No GPS data',
            time: vehicle.currentLocation?.updatedAt ? new Date(vehicle.currentLocation.updatedAt).toLocaleTimeString() : 'Just now',
            status: vehicle.status === 'moving' ? 'Moving' : vehicle.status === 'idle' ? 'Idle' : 'Offline',
            color: vehicle.status === 'moving' ? 'green' : vehicle.status === 'idle' ? 'yellow' : 'red',
            lat: vehicle.currentLocation?.latitude ?? 27.35,
            lng: vehicle.currentLocation?.longitude ?? 77.85,
          }]
        }
        return updated
      })
    }

    onTelemetryUpdate(handleTelemetry)

    return () => {
      offSocketEvent('telemetry_update', handleTelemetry)
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  // Filter vehicles
  const filteredVehicles = liveFleetVehicles.filter(v => {
    const matchesSearch = v.id.toLowerCase().includes(fleetSearchQuery.toLowerCase()) || 
                          v.driver.toLowerCase().includes(fleetSearchQuery.toLowerCase())
    
    let matchesStatus = true
    if (fleetStatusFilter === 'moving') matchesStatus = v.status === 'Moving'
    else if (fleetStatusFilter === 'idle') matchesStatus = v.status === 'Idle'
    else if (fleetStatusFilter === 'offline') matchesStatus = v.status === 'Offline'

    return matchesSearch && matchesStatus
  })

  return (
    <div className="grow overflow-y-auto p-6 md:p-8 flex flex-col gap-6 text-left bg-transparent">
      {/* Fallback Leaflet CDN CSS to resolve local bundler loading errors */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
        crossOrigin="" 
      />
      {/* Header row: Live Fleet Title */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Live Fleet</h1>
          <span className="flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live
          </span>
        </div>
      </div>

      {/* Sub-toolbar row */}
      <div className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border rounded-xl p-4 shadow-sm transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200/80'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search query box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Vehicle..."
              value={fleetSearchQuery}
              onChange={(e) => setFleetSearchQuery(e.target.value)}
              className={`w-56 border rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500/50' 
                  : 'bg-slate-50 border-slate-200 text-slate-805 focus:border-emerald-500/50'
              }`}
            />
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setFleetStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                fleetStatusFilter === 'all' 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 shadow-sm' 
                  : isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                    : 'bg-slate-55 border-slate-200 text-slate-550 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFleetStatusFilter('moving')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border flex items-center gap-1.5 ${
                fleetStatusFilter === 'moving' 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-805 shadow-sm' 
                  : isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                    : 'bg-slate-55 border-slate-200 text-slate-550 hover:bg-slate-50'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Moving
            </button>
            <button 
              onClick={() => setFleetStatusFilter('idle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border flex items-center gap-1.5 ${
                fleetStatusFilter === 'idle' 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-805 shadow-sm' 
                  : isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                    : 'bg-slate-55 border-slate-200 text-slate-550 hover:bg-slate-50'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
              Idle
            </button>
            <button 
              onClick={() => setFleetStatusFilter('offline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border flex items-center gap-1.5 ${
                fleetStatusFilter === 'offline' 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-850 shadow-sm' 
                  : isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                    : 'bg-slate-55 border-slate-200 text-slate-550 hover:bg-slate-50'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
              Offline
            </button>
          </div>
        </div>

        {/* Refresh & Last Updated details */}
        <div className="flex items-center justify-between md:justify-end gap-5">
          <button 
            onClick={() => {}}
            className={`flex items-center gap-1.5 text-xs font-bold border rounded-lg px-3 py-1.5 cursor-pointer shadow-sm active:scale-98 transition-transform ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 select-none">
            <Clock className="h-3.5 w-3.5" />
            <span>Last Updated: Just now</span>
          </div>
        </div>
      </div>

      {/* MAIN MAP LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* Left Column: Mock Map Panel (~70% width) */}
        <div className={`lg:col-span-7 border rounded-xl p-4 shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200/80'
        }`}>
          <div className="h-120 rounded-lg border border-slate-200 overflow-hidden relative" style={{ zIndex: 1 }}>
            <style>{`
              .leaflet-container img {
                max-width: none !important;
                max-height: none !important;
              }
              .leaflet-div-icon {
                background: transparent !important;
                border: none !important;
              }
            `}</style>
            <MapContainer 
              center={mapCenter} 
              zoom={10.5} 
              className="h-full w-full"
            >
              <MapResizeController />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />

              {/* Warehouse A Circle Geofence */}
              <Circle 
                center={[27.498, 77.685]} 
                radius={2500} 
                pathOptions={{ 
                  color: '#10b981', 
                  fillColor: '#10b981', 
                  fillOpacity: 0.12,
                  weight: 2 
                }} 
              />

              {/* Distribution Center Polygon Geofence */}
              <Polygon 
                positions={[
                  [27.24, 77.93],
                  [27.24, 77.97],
                  [27.20, 77.97],
                  [27.20, 77.93]
                ]}
                pathOptions={{ 
                  color: '#10b981', 
                  fillColor: '#10b981', 
                  fillOpacity: 0.12,
                  weight: 2,
                  dashArray: '3, 3'
                }} 
              />

              {/* Vehicle Markers */}
              {filteredVehicles.map(pin => (
                <Marker 
                  key={pin.id} 
                  position={[pin.lat, pin.lng]} 
                  icon={customMarkerIcon(pin.color)}
                  eventHandlers={{
                    click: () => setSelectedVehicle(pin),
                  }}
                >
                  <Popup>
                    <div className="text-left font-sans leading-tight">
                      <p className="font-bold text-emerald-805">{pin.id}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Driver: {pin.driver}</p>
                      <p className="text-[10px] text-slate-500">Speed: {pin.speed}</p>
                      <p className="text-[10px] text-slate-550">Status: <span className="font-bold text-emerald-600">{pin.status}</span></p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right Column: Information Cards Stack (~30% width) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* 1. Vehicle Details Card */}
          {selectedVehicle ? (
            <div className={`border rounded-xl p-5 shadow-sm text-left relative overflow-hidden transition-all duration-300 hover:border-slate-250 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200/80'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
                <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vehicle Details</h3>
                <button 
                  onClick={() => setSelectedVehicle(null)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ID & Status Row */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg border p-2 ${
                    isDarkMode ? 'bg-slate-950 border-slate-850 text-emerald-450' : 'bg-emerald-55 border-emerald-200 text-emerald-800'
                  }`}>
                    <Car className="h-5 w-5" />
                  </div>
                  <span className={`text-sm font-extrabold ${isDarkMode ? 'text-slate-200' : 'text-slate-808'}`}>{selectedVehicle.id}</span>
                </div>
                
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                  selectedVehicle.status === 'Moving' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                  selectedVehicle.status === 'Idle' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
                  'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    selectedVehicle.status === 'Moving' ? 'bg-emerald-500 animate-pulse' :
                    selectedVehicle.status === 'Idle' ? 'bg-yellow-500' :
                    'bg-slate-400'
                  }`}></span>
                  {selectedVehicle.status}
                </span>
              </div>

              {/* Details list grid */}
              <div className="space-y-4 text-xs font-bold text-slate-650 dark:text-slate-350">
                
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-450 uppercase flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    Driver Name
                  </span>
                  <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{selectedVehicle.driver}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-455 uppercase flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-slate-400 shrink-0" />
                    Current Speed
                  </span>
                  <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{selectedVehicle.speed}</span>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-455 uppercase flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
                      Fuel Level
                    </span>
                    <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{selectedVehicle.fuel}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedVehicle.fuel > 50 ? 'bg-emerald-500' :
                        selectedVehicle.fuel > 20 ? 'bg-yellow-500' :
                        'bg-rose-500'
                      }`}
                      style={{ width: `${selectedVehicle.fuel}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-455 uppercase flex items-center gap-2">
                    <Power className="h-4 w-4 text-slate-400 shrink-0" />
                    Engine Status
                  </span>
                  <span className={`flex items-center gap-1 font-extrabold select-none ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${selectedVehicle.engine === 'ON' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {selectedVehicle.engine}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-455 uppercase flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-slate-400 shrink-0" />
                    Temperature
                  </span>
                  <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{selectedVehicle.temp}</span>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <span className="text-[10px] text-slate-455 uppercase flex items-center gap-2 shrink-0">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    Location
                  </span>
                  <span className={`text-right font-medium text-[11px] leading-tight flex-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{selectedVehicle.location}</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-[10px] text-slate-455 uppercase flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    Last Updated
                  </span>
                  <span className="text-slate-500 dark:text-slate-450 font-semibold">{selectedVehicle.time}</span>
                </div>

              </div>
            </div>
          ) : (
            <div className={`border rounded-xl p-8 shadow-sm text-center flex flex-col items-center justify-center h-64 text-slate-450 select-none ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 border-slate-200/80'
            }`}>
              <Car className="h-10 w-10 text-slate-300 mb-2 animate-bounce" />
              <p className="font-bold text-slate-350">Select a vehicle pin to view telemetry details</p>
            </div>
          )}

          {/* 2. Fleet Summary Card */}
          <div className={`border rounded-xl p-5 shadow-sm text-left transition-all duration-300 hover:border-slate-250 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200/80'
          }`}>
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
              <SlidersHorizontal className="h-4.5 w-4.5 text-slate-450" />
              <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fleet Summary</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Total */}
              <div className={`border rounded-lg p-3 text-left ${
                isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'
              }`}>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[9px] font-black uppercase">Total</span>
                  <Car className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <p className={`text-lg font-black mt-1 leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>1,248</p>
              </div>

              {/* Moving */}
              <div className={`border rounded-lg p-3 text-left ${
                isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'
              }`}>
                <div className="flex items-center justify-between text-slate-455">
                  <span className="text-[9px] font-black uppercase">Moving</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex items-baseline gap-1 mt-1 leading-none">
                  <span className={`text-lg font-black leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>986</span>
                  <span className="text-[9px] font-semibold text-slate-400">79%</span>
                </div>
              </div>

              {/* Idle */}
              <div className={`border rounded-lg p-3 text-left ${
                isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'
              }`}>
                <div className="flex items-center justify-between text-slate-455">
                  <span className="text-[9px] font-black uppercase">Idle</span>
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                </div>
                <div className="flex items-baseline gap-1 mt-1 leading-none">
                  <span className={`text-lg font-black leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>156</span>
                  <span className="text-[9px] font-semibold text-slate-400">12%</span>
                </div>
              </div>

              {/* Offline */}
              <div className={`border rounded-lg p-3 text-left ${
                isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'
              }`}>
                <div className="flex items-center justify-between text-slate-455">
                  <span className="text-[9px] font-black uppercase">Offline</span>
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                </div>
                <div className="flex items-baseline gap-1 mt-1 leading-none">
                  <span className={`text-lg font-black leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>106</span>
                  <span className="text-[9px] font-semibold text-slate-400">9%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RECENT LIVE EVENTS SECTION */}
      <div className={`border rounded-xl p-5 shadow-sm flex flex-col gap-4 text-left transition-all duration-300 hover:border-slate-250 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200/80'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
          <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Live Events</h3>
          <button className="text-[10px] font-black text-emerald-600 uppercase tracking-wider hover:text-emerald-700 flex items-center gap-1 select-none">
            <span>View All Events</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Event 1 */}
          <div className={`border rounded-xl p-3.5 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 flex items-start gap-3 ${
            isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150/80'
          }`}>
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-600 shrink-0">
              <Car className="h-4.5 w-4.5" />
            </div>
            <div className="leading-tgrow min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p className={`text-[10px] font-black ${isDarkMode ? 'text-slate-205' : 'text-slate-800'}`}>TRK-09AB-1234</p>
                <span className="text-[7.5px] font-bold text-slate-400">Just now</span>
              </div>
              <p className={`text-[10px] font-black mt-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Started Moving</p>
              <p className="text-[9px] font-medium text-slate-450 mt-0.5 truncate">Sector 62, Noida</p>
            </div>
          </div>

          {/* Event 2 */}
          <div className={`border rounded-xl p-3.5 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 flex items-start gap-3 ${
            isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150/80'
          }`}>
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-600 shrink-0">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <div className="leading-tight grow min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p className={`text-[10px] font-black ${isDarkMode ? 'text-slate-205' : 'text-slate-800'}`}>TRK-07CD-5678</p>
                <span className="text-[7.5px] font-bold text-slate-400">2 min ago</span>
              </div>
              <p className={`text-[10px] font-black mt-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Entered Geofence</p>
              <p className="text-[9px] font-medium text-slate-455 mt-0.5 truncate">Warehouse A</p>
            </div>
          </div>

          {/* Event 3 */}
          <div className={`border rounded-xl p-3.5 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 flex items-start gap-3 ${
            isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150/80'
          }`}>
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-600 shrink-0">
              <Gauge className="h-4.5 w-4.5" />
            </div>
            <div className="leading-tight grow min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p className={`text-[10px] font-black ${isDarkMode ? 'text-slate-205' : 'text-slate-800'}`}>TRK-03EF-7890</p>
                <span className="text-[7.5px] font-bold text-slate-400">5 min ago</span>
              </div>
              <p className="text-[10px] font-black text-rose-600 mt-1 truncate animate-pulse flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                Overspeed Alert
              </p>
              <p className="text-[9px] font-medium text-slate-455 mt-0.5 truncate">Speed: 85 km/h</p>
            </div>
          </div>

          {/* Event 4 */}
          <div className={`border rounded-xl p-3.5 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 flex items-start gap-3 ${
            isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150/80'
          }`}>
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-600 shrink-0">
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </div>
            <div className="leading-tight grow min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p className={`text-[10px] font-black ${isDarkMode ? 'text-slate-205' : 'text-slate-800'}`}>TRK-11GH-9012</p>
                <span className="text-[7.5px] font-bold text-slate-400">8 min ago</span>
              </div>
              <p className="text-[10px] font-black text-yellow-600 mt-1 truncate">Low Fuel Warning</p>
              <p className="text-[9px] font-medium text-slate-455 mt-0.5 truncate">Fuel Level: 12%</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
