import React from 'react'
import { MapPin, Navigation, Info, Shield, ZoomIn, ZoomOut, Compass, Search } from 'lucide-react'

export default function LiveMap({ vehicles, geofences, activeVehicleId, onSelectVehicle }) {
  const [zoomLevel, setZoomLevel] = React.useState(1)
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 })
  const [selectedVehicle, setSelectedVehicle] = React.useState(null)
  const [selectedGeofence, setSelectedGeofence] = React.useState(null)

  // Coordinate bounding box for New Delhi simulation projection
  const latMin = 28.50
  const latMax = 28.68
  const lngMin = 77.05
  const lngMax = 77.35

  // Project geographic coordinates to SVG coordinate canvas (600 width, 400 height)
  const project = (lat, lng) => {
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 600
    const y = 400 - (((lat - latMin) / (latMax - latMin)) * 400)
    
    // Apply zoom and pan transformation
    const centerX = 300
    const centerY = 200
    const tx = (x - centerX) * zoomLevel + centerX + panOffset.x
    const ty = (y - centerY) * zoomLevel + centerY + panOffset.y
    return { x: tx, y: ty }
  }

  // Scale geofence radius to match SVG pixel scale
  const projectRadius = (meters) => {
    // 0.18 degree latitude spans 400px, which is ~20,000 meters
    // Scale factor: 400px / 20000m = 0.02px per meter
    return meters * 0.02 * zoomLevel
  }

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.75))
    if (zoomLevel <= 1) setPanOffset({ x: 0, y: 0 })
  }

  const handleResetPan = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // Find currently highlighted active vehicle from parent props
  React.useEffect(() => {
    if (activeVehicleId) {
      const vehicle = vehicles.find(v => v.id === activeVehicleId)
      if (vehicle) {
        setSelectedVehicle(vehicle)
        setSelectedGeofence(null)
      }
    }
  }, [activeVehicleId, vehicles])

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner h-[380px] flex flex-col justify-between">
      
      {/* Top Map Controls Panel */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        {/* Active tracking display */}
        <div className="rounded-lg bg-slate-900/90 border border-slate-800 px-3 py-1.5 backdrop-blur-sm pointer-events-auto flex items-center gap-2">
          <Compass className="h-4 w-4 text-emerald-400 animate-spin-slow" />
          <div className="text-left leading-none">
            <span className="text-[10px] font-bold text-slate-200 block uppercase">Tracking Hub</span>
            <span className="text-[8px] font-medium text-slate-500">Scale: {Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>

        {/* Zoom and resetting toolbar widget */}
        <div className="flex gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-lg backdrop-blur-sm pointer-events-auto text-slate-400">
          <button onClick={handleZoomIn} className="p-1 hover:text-white hover:bg-slate-850 rounded transition-colors cursor-pointer" title="Zoom In">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleZoomOut} className="p-1 hover:text-white hover:bg-slate-850 rounded transition-colors cursor-pointer" title="Zoom Out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleResetPan} className="px-1 text-[9px] font-extrabold hover:text-white hover:bg-slate-850 rounded transition-colors cursor-pointer" title="Reset View">
            Reset
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <svg className="w-full h-full flex-grow select-none bg-[#0a0f1d]">
        {/* Draw subtle grid background representing GPS lines */}
        <defs>
          <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(51, 65, 85, 0.08)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapGrid)" />

        {/* Draw simulated New Delhi roads and highways */}
        <g stroke="rgba(148, 163, 184, 0.05)" fill="none" strokeLinecap="round">
          {/* Ring Road */}
          <circle cx="300" cy="200" r={projectRadius(4500)} strokeWidth="3" />
          <circle cx="300" cy="200" r={projectRadius(4500)} strokeWidth="1" strokeDasharray="4,4" />
          
          {/* Outer Ring Road */}
          <circle cx="300" cy="200" r={projectRadius(8500)} strokeWidth="2" stroke="rgba(148, 163, 184, 0.03)" />

          {/* NH-44 Express Highway */}
          <line x1="100" y1="0" x2="200" y2="400" strokeWidth="3" />
          <line x1="200" y1="400" x2="300" y2="500" strokeWidth="3" />
          
          {/* Yamuna Expressway link */}
          <path d="M 450 0 C 420 150, 480 300, 430 400" strokeWidth="2.5" />

          {/* Core Delhi Grid Lines */}
          <line x1="0" y1="200" x2="600" y2="200" strokeWidth="1.5" />
          <line x1="300" y1="0" x2="300" y2="400" strokeWidth="1.5" />
        </g>

        {/* Draw Circular Geofence Zones */}
        {geofences.map((g) => {
          const pt = project(g.lat, g.lng)
          const radius = projectRadius(g.radius)
          const isSelected = selectedGeofence?.id === g.id
          
          // Determine color based on fence type
          const color = g.type === 'safe' ? 'stroke-emerald-500 fill-emerald-500/5' : 'stroke-red-500 fill-red-500/5'
          
          return (
            <g key={g.id} className="cursor-pointer group" onClick={() => { setSelectedGeofence(g); setSelectedVehicle(null); }}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={radius}
                className={`transition-all duration-300 ${color} ${
                  isSelected ? 'stroke-[2] fill-opacity-10' : 'stroke-[1] hover:fill-opacity-8'
                }`}
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={3}
                className={g.type === 'safe' ? 'fill-emerald-500' : 'fill-red-500'}
              />
            </g>
          )
        })}

        {/* Draw Active Vehicle Pins */}
        {vehicles.map((v) => {
          const pt = project(v.lat, v.lng)
          const isSelected = selectedVehicle?.id === v.id
          
          // Speed dictates color indicator
          let pinColor = 'fill-emerald-500 text-emerald-500'
          if (v.status === 'idle') pinColor = 'fill-yellow-500 text-yellow-500'
          if (v.status === 'stopped') pinColor = 'fill-slate-500 text-slate-500'
          if (v.speed > 80) pinColor = 'fill-red-500 text-red-500'

          return (
            <g 
              key={v.id} 
              className="cursor-pointer group z-30" 
              onClick={() => {
                setSelectedVehicle(v);
                setSelectedGeofence(null);
                if (onSelectVehicle) onSelectVehicle(v.id);
              }}
            >
              {/* Dynamic pulse ring for active moving vehicles */}
              {v.status === 'active' && (
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isSelected ? 14 : 9} 
                  className={`fill-none stroke-current animate-ping opacity-25 ${pinColor}`}
                />
              )}
              
              {/* Vehicle Pin body */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 6.5 : 4.5}
                className={`stroke-slate-900 stroke-2 transition-all duration-300 ${pinColor}`}
              />

              {/* Muted label shown on hover */}
              {!isSelected && (
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  textAnchor="middle"
                  className="fill-slate-400 text-[6.5px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 px-1 py-0.5 pointer-events-none"
                >
                  {v.name.split(' ')[2] || v.name}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Dynamic Popups for details */}
      {selectedVehicle && (
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md text-left z-20 flex items-center justify-between text-white animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Navigation className={`h-5 w-5 ${selectedVehicle.speed > 0 ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'}`} style={{ transform: `rotate(${selectedVehicle.speed > 0 ? 45 : 0}deg)` }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{selectedVehicle.name}</span>
                <span className={`text-[8px] font-bold px-1.5 rounded uppercase leading-none ${
                  selectedVehicle.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  selectedVehicle.status === 'idle' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {selectedVehicle.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Driver: <span className="font-semibold text-slate-300">{selectedVehicle.driver}</span> | Route: <span className="font-semibold text-slate-350">{selectedVehicle.route}</span></p>
            </div>
          </div>
          
          <div className="flex gap-4 border-l border-slate-800 pl-4 text-right">
            <div>
              <span className="text-[8px] text-slate-500 font-bold uppercase block leading-none">Speed</span>
              <span className="text-sm font-extrabold text-white">{selectedVehicle.speed} <span className="text-[9px] font-medium text-slate-400">km/h</span></span>
            </div>
            <div>
              <span className="text-[8px] text-slate-500 font-bold uppercase block leading-none">Fuel</span>
              <span className="text-sm font-extrabold text-white">{selectedVehicle.fuel}%</span>
            </div>
            <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-white self-center cursor-pointer text-xs font-bold pl-1">
              Close
            </button>
          </div>
        </div>
      )}

      {selectedGeofence && (
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md text-left z-20 flex items-center justify-between text-white animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-350">
              <Shield className={`h-5 w-5 ${selectedGeofence.type === 'safe' ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{selectedGeofence.name}</span>
                <span className={`text-[8px] font-bold px-1.5 rounded uppercase leading-none ${
                  selectedGeofence.type === 'safe' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {selectedGeofence.type} Perimeter
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Coordinates: <span className="font-semibold text-slate-350">{selectedGeofence.lat.toFixed(4)}, {selectedGeofence.lng.toFixed(4)}</span> | Radius: <span className="font-semibold text-slate-350">{selectedGeofence.radius}m</span></p>
            </div>
          </div>
          
          <button onClick={() => setSelectedGeofence(null)} className="text-slate-400 hover:text-white cursor-pointer text-xs font-bold">
            Close
          </button>
        </div>
      )}

    </div>
  )
}
