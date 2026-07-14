import React from 'react'
import { 
  X, 
  Car, 
  User, 
  Phone, 
  Cpu, 
  Activity, 
  Gauge, 
  Droplet, 
  Power, 
  Thermometer, 
  Zap, 
  Navigation, 
  Clock 
} from 'lucide-react'

export default function VehicleDetails({ vehicle, onClose, isDarkMode = false }) {
  if (!vehicle) {
    return (
      <div className={`border rounded-xl p-6 text-center shadow-sm select-none ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
      }`}>
        <Car className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p className="text-xs font-bold">Select a vehicle from the registry list to inspect details.</p>
      </div>
    )
  }

  // Fallbacks for missing mock data properties
  const speed = vehicle.speed || '62 km/h'
  const speedVal = typeof speed === 'string' ? speed : `${speed} km/h`
  const fuel = vehicle.fuel !== undefined ? vehicle.fuel : 68
  const fuelVal = typeof fuel === 'string' ? fuel : `${fuel}%`
  const status = vehicle.status || 'Moving'
  const isMoving = status.toLowerCase() === 'moving' || status.toLowerCase() === 'active'

  return (
    <div className={`border rounded-xl p-5 shadow-sm text-left relative overflow-hidden transition-all duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/90 backdrop-blur-md border-slate-200/80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-100 dark:border-slate-800">
        <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vehicle Details</h3>
        <button 
          onClick={onClose}
          className={`rounded-full p-1 cursor-pointer transition-colors ${
            isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Truck Photo Asset */}
      <div className="w-full h-32 rounded-lg overflow-hidden border border-slate-200/70 dark:border-slate-800 mb-4 bg-slate-100 dark:bg-slate-950 relative select-none">
        <img 
          src="/detail_truck_mockup.png" 
          alt="Truck Details Asset" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Stat lists */}
      <div className="space-y-3.5 text-xs">
        
        {/* Row: Vehicle ID */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Vehicle ID</span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{vehicle.id}</span>
        </div>

        {/* Row: Registration Number */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Registration Number</span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{vehicle.regNo || vehicle.name || 'TR9AB-1234'}</span>
        </div>

        {/* Row: Driver Name */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Driver Name</span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{vehicle.driver}</span>
        </div>

        {/* Row: Driver Contact */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Driver Contact</span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{vehicle.driverContact || '+((01) 427-7532'}</span>
        </div>

        {/* Row: Vehicle Type */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Vehicle Type</span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{vehicle.type || 'Truck'}</span>
        </div>

        {/* Row: Current Status */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Current Status</span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
            isMoving
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-555/20' 
              : status.toLowerCase() === 'idle'
                ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-555/20'
                : 'bg-rose-500/10 text-rose-600 border border-rose-555/20'
          }`}>
            <span className={`h-1 w-1 rounded-full ${
              isMoving ? 'bg-emerald-500' : status.toLowerCase() === 'idle' ? 'bg-yellow-500' : 'bg-rose-500'
            }`}></span>
            {status}
          </span>
        </div>

        {/* Row: Current Speed */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Current Speed</span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{speedVal}</span>
        </div>

        {/* Row: Fuel Level (Progress Bar) */}
        <div className="py-1 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Fuel Level</span>
            <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{fuelVal}</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                fuel < 20 ? 'bg-rose-550' : fuel < 40 ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${fuel}%` }}
            />
          </div>
        </div>

        {/* Row: Engine Status */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Engine Status</span>
          <span className={`font-black uppercase tracking-wider flex items-center gap-1 text-[10px] ${
            vehicle.engineStatus === 'OFF' ? 'text-slate-400' : 'text-emerald-500'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${vehicle.engineStatus === 'OFF' ? 'bg-slate-400' : 'bg-emerald-500'}`} />
            {vehicle.engineStatus || 'ON'}
          </span>
        </div>

        {/* Row: Temperature */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Temperature</span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{vehicle.temp !== undefined ? `${vehicle.temp}°C` : '78°C'}</span>
        </div>

        {/* Row: Battery Voltage */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Battery Voltage</span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{vehicle.voltage || '12.2 V'}</span>
        </div>

        {/* Row: Total Distance Travelled */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Total Distance</span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{vehicle.distance || '1,237 km'}</span>
        </div>

        {/* Row: Last Known Location */}
        <div className="flex flex-col text-left py-1 border-b border-slate-100 dark:border-slate-800/60 gap-0.5">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Last Known Location</span>
          <span className={`font-black tracking-tight leading-snug ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>
            {vehicle.location || 'Sector 62, Uttar Pradesh'}
          </span>
        </div>

        {/* Row: Last Updated Time */}
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase text-[10px]">Last Updated Time</span>
          <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {vehicle.time || '3 min ago'}
          </span>
        </div>

      </div>
    </div>
  )
}
