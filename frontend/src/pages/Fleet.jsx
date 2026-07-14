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


// Helper to render responsive Lucide vehicle pins inside Leaflet Markers
const customMarkerIcon = (color) => {
  const colorMap = {
    green: 'bg-emerald-500 text-white ring-emerald-500/20',
    yellow: 'bg-yellow-500 text-white ring-yellow-500/20',
    red: 'bg-rose-500 text-white ring-rose-500/20',
    slate: 'bg-slate-500 text-white ring-slate-500/20'
  }
  const colorClass = colorMap[color] || 'bg-slate-400 text-white'
  
  return L.divIcon({
    html: `
      <div class="flex flex-col items-center justify-center" style="transform: translate(-2px, -6px);">
        <div class="rounded-lg border border-white p-1 shadow-md flex items-center justify-center ${colorClass}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
        </div>
        <div class="h-2 w-2 rounded-full border border-white shadow-sm -mt-0.5 ${color === 'green' ? 'bg-emerald-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-rose-500'}"></div>
      </div>
    `,
    className: 'custom-leaflet-marker',
    iconSize: [28, 32],
    iconAnchor: [14, 32]
  })
}

export default function Fleet({ isDarkMode = false }) {
  const [fleetSearchQuery, setFleetSearchQuery] = React.useState('')
  const [fleetStatusFilter, setFleetStatusFilter] = React.useState('all') // 'all', 'moving', 'idle', 'offline'
  
  // Live Fleet Vehicles data representing the Agra-Mathura NH-19 corridor
  const liveFleetVehicles = [
    { id: 'TRK-09AB-1234', driver: 'Rohit Sharma', speed: '62 km/h', fuel: 68, engine: 'ON', temp: '78°C', location: 'NH-19, Near Sikandra, Agra', time: 'Just now', status: 'Moving', color: 'green', lat: 27.224, lng: 77.955, x: '53%', y: '39%' },
    { id: 'TRK-07CD-5678', driver: 'Amit Verma', speed: '0 km/h', fuel: 82, engine: 'OFF', temp: '42°C', location: 'Warehouse A, Mathura Bypass', time: '2 min ago', status: 'Idle', color: 'yellow', lat: 27.498, lng: 77.685, x: '37%', y: '39%' },
    { id: 'TRK-03EF-7890', driver: 'Sandeep Singh', speed: '85 km/h', fuel: 12, engine: 'ON', temp: '94°C', location: 'NH-19, Farah, Mathura-Agra Road', time: '5 min ago', status: 'Moving', color: 'green', lat: 27.321, lng: 77.824, x: '59%', y: '58%' },
    { id: 'TRK-11GH-9012', driver: 'Manish Yadav', speed: '0 km/h', fuel: 5, engine: 'OFF', temp: '35°C', location: 'Sikandra Crossing, Agra', time: '8 min ago', status: 'Offline', color: 'red', lat: 27.221, lng: 77.960, x: '46%', y: '52%' },
    { id: 'TRK-05IJ-3456', driver: 'Vikram Patel', speed: '0 km/h', fuel: 45, engine: 'OFF', temp: '38°C', location: 'Refinery Area, Mathura', time: '12 min ago', status: 'Idle', color: 'yellow', lat: 27.472, lng: 77.712, x: '31%', y: '50%' },
    { id: 'TRK-12KL-7890', driver: 'Rahul Sharma', speed: '70 km/h', fuel: 90, engine: 'ON', temp: '82°C', location: 'Yamuna Expressway Toll, Agra', time: 'Just now', status: 'Moving', color: 'green', lat: 27.288, lng: 77.856, x: '28%', y: '27%' },
    { id: 'TRK-15MN-1234', driver: 'Pankaj Kumar', speed: '0 km/h', fuel: 0, engine: 'OFF', temp: '25°C', location: 'Rohta Bypass, Agra', time: '25 min ago', status: 'Offline', color: 'red', lat: 27.165, lng: 77.990, x: '64%', y: '27%' },
    { id: 'TRK-08XY-9012', driver: 'Vijay Yadav', speed: '0 km/h', fuel: 19, engine: 'OFF', temp: '33°C', location: 'Mathura Cantonment', time: '18 min ago', status: 'Idle', color: 'yellow', lat: 27.485, lng: 77.698, x: '26%', y: '67%' },
    { id: 'TRK-10ZW-3456', driver: 'Deepak Singh', speed: '55 km/h', fuel: 74, engine: 'ON', temp: '75°C', location: 'NH-19, Mathura-Agra Corridor', time: '4 min ago', status: 'Moving', color: 'green', lat: 27.382, lng: 77.785, x: '68%', y: '63%' },
    { id: 'TRK-06UV-7890', driver: 'Rakesh Verma', speed: '0 km/h', fuel: 88, engine: 'OFF', temp: '29°C', location: 'Fatehabad Road, Agra', time: '40 min ago', status: 'Offline', color: 'slate', lat: 27.152, lng: 78.020, x: '80%', y: '38%' }
  ]

  const [selectedVehicle, setSelectedVehicle] = React.useState(liveFleetVehicles[0])

  // Filter vehicles
  const filteredVehicles = liveFleetVehicles.filter(v => {
    const matchesSearch = v.id.toLowerCase().includes(fleetSearchQuery.toLowerCase()) || 
                          v.driver.toLowerCase().includes(fleetSearchQuery.toLowerCase())
    
    let matchesStatus = true
    if (fleetStatusFilter === 'moving') matchesStatus = v.status === 'Moving'
    else if (fleetStatusFilter === 'idle') matchesStatus = v.status === 'Idle'
    else if (fleetStatusFilter === 'offline') matchesStatus = v.status === 'Offline' || v.status === 'Stopped'

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex-grow overflow-y-auto p-6 md:p-8 flex flex-col gap-6 text-left bg-transparent">
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
          <div className="h-[480px] rounded-lg border border-slate-200 overflow-hidden relative" style={{ zIndex: 1 }}>
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
              center={[27.35, 77.85]} 
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
            <div className="leading-tight flex-grow min-w-0">
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
            <div className="leading-tight flex-grow min-w-0">
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
            <div className="leading-tight flex-grow min-w-0">
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
            <div className="leading-tight flex-grow min-w-0">
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
