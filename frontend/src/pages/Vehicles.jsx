import React from 'react'
import { 
  Car, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Gauge, 
  Droplet, 
  Power, 
  ChevronRight,
  Activity
} from 'lucide-react'
import VehicleTable from '../components/VehicleTable.jsx'
import VehicleDetails from '../components/VehicleDetails.jsx'

export default function Vehicles({ isDarkMode = false }) {
  // Mock dataset representing the photo precisely
  const vehicleList = [
    { 
      id: 'TRK-09AB', 
      regNo: 'TR9AB-1234', 
      name: 'Warehouse A', 
      driver: 'Rohit Sharma', 
      driverContact: '+((01) 427-7532',
      type: 'Truck', 
      status: 'Moving', 
      speed: '62 km/h', 
      fuel: 68, 
      engineStatus: 'ON', 
      temp: 78, 
      voltage: '12.2 V', 
      distance: '1,237 km', 
      location: 'Sector 62, Noida, Uttar Pradesh', 
      time: 'Just now' 
    },
    { 
      id: 'TRK-07CD', 
      regNo: 'TRK09-9631', 
      name: 'Warehouse Name A', 
      driver: 'Amit Verma', 
      driverContact: '+((01) 427-9031',
      type: 'Van', 
      status: 'Idle', 
      speed: '0 km/h', 
      fuel: 82, 
      engineStatus: 'OFF', 
      temp: 42, 
      voltage: '12.4 V', 
      distance: '3,850 km', 
      location: 'Warehouse A, Mathura Bypass', 
      time: '2 min ago' 
    },
    { 
      id: 'TRK-05EF', 
      regNo: 'TRK05-1780', 
      name: 'Warehouse Name A', 
      driver: 'Sandeep Singh', 
      driverContact: '+((01) 427-1845',
      type: 'Truck', 
      status: 'Idle', 
      speed: '0 km/h', 
      fuel: 90, 
      engineStatus: 'OFF', 
      temp: 40, 
      voltage: '12.6 V', 
      distance: '2,110 km', 
      location: 'NH-19, Farah, Mathura-Agra Road', 
      time: '5 min ago' 
    },
    { 
      id: 'TRK-0998', 
      regNo: 'TRK11-9012', 
      name: 'Warehouse Name B', 
      driver: 'Manish Yadav', 
      driverContact: '+((01) 427-8902',
      type: 'Truck', 
      status: 'Offline', 
      speed: '0 km/h', 
      fuel: 5, 
      engineStatus: 'OFF', 
      temp: 35, 
      voltage: '11.8 V', 
      distance: '4,920 km', 
      location: 'Sikandra Crossing, Agra', 
      time: '8 min ago' 
    },
    { 
      id: 'TRK-03EF', 
      regNo: 'TRK00-3237', 
      name: 'Warehouse Name B', 
      driver: 'Vikram Patel', 
      driverContact: '+((01) 427-2374',
      type: 'Truck', 
      status: 'Moving', 
      speed: '62 km/h', 
      fuel: 45, 
      engineStatus: 'ON', 
      temp: 81, 
      voltage: '12.3 V', 
      distance: '1,830 km', 
      location: 'Refinery Area, Mathura', 
      time: '12 min ago' 
    },
    { 
      id: 'TRK-0800', 
      regNo: 'TRK08-1334', 
      name: 'Warehouse Name A', 
      driver: 'Rahul Sharma', 
      driverContact: '+((01) 427-1334',
      type: 'Truck', 
      status: 'Moving', 
      speed: '62 km/h', 
      fuel: 90, 
      engineStatus: 'ON', 
      temp: 80, 
      voltage: '12.2 V', 
      distance: '920 km', 
      location: 'Yamuna Expressway Toll, Agra', 
      time: 'Just now' 
    },
    { 
      id: 'TRK-0907', 
      regNo: 'TRK08-9012', 
      name: 'Warehouse Name A', 
      driver: 'Pankaj Kumar', 
      driverContact: '+((01) 427-9012',
      type: 'Truck', 
      status: 'Offline', 
      speed: '0 km/h', 
      fuel: 0, 
      engineStatus: 'OFF', 
      temp: 25, 
      voltage: '10.8 V', 
      distance: '10,480 km', 
      location: 'Rohta Bypass, Agra', 
      time: '25 min ago' 
    }
  ]

  const [selectedVehicle, setSelectedVehicle] = React.useState(vehicleList[0])

  return (
    <div className="flex-grow overflow-y-auto p-6 md:p-8 flex flex-col gap-6 text-left bg-transparent">
      
      {/* Header Row */}
      <div className="flex items-center justify-between select-none">
        <div>
          <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vehicles</h1>
          <p className="text-[11px] text-slate-500 font-bold mt-0.5">Monitor and manage your fleet vehicles</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all px-3 py-1.5 text-xs font-bold text-white cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
        
        {/* Card 1: Total Vehicles */}
        <div className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'
        }`}>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">Total Vehicles</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>1,248</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                79%
              </span>
            </div>
          </div>
          <div className="rounded-full p-2 bg-slate-50 border border-slate-100 text-slate-500 dark:bg-slate-950 dark:border-slate-850">
            <Car className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Moving Vehicles */}
        <div className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'
        }`}>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">Moving Vehicles</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>986</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                79%
              </span>
            </div>
          </div>
          <div className="rounded-full p-2 bg-emerald-50 border border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-950/40">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Idle Vehicles */}
        <div className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'
        }`}>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">Idle Vehicles</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>156</span>
              <span className="text-[10px] font-bold text-yellow-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-0.5" />
                16%
              </span>
            </div>
          </div>
          <div className="rounded-full p-2 bg-yellow-50 border border-yellow-100 text-yellow-600 dark:bg-yellow-950/20 dark:border-yellow-950/40">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Offline Vehicles */}
        <div className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'
        }`}>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">Offline Vehicles</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>106</span>
              <span className="text-[10px] font-bold text-rose-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-0.5" />
                9%
              </span>
            </div>
          </div>
          <div className="rounded-full p-2 bg-rose-50 border border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-950/40">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Main Table + Side Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* Left Column: Vehicles Registry Table (70% or 7 cols) */}
        <div className="lg:col-span-7">
          <VehicleTable 
            vehicles={vehicleList}
            activeVehicleId={selectedVehicle ? selectedVehicle.id : null}
            onSelectVehicle={(v) => setSelectedVehicle(v)}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Right Column: Vehicle Details Inspector (30% or 3 cols) */}
        <div className="lg:col-span-3">
          <VehicleDetails 
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
            isDarkMode={isDarkMode}
          />
        </div>

      </div>

      {/* Bottom Row: Recent Vehicle Activity Log Bar */}
      <div className={`border rounded-xl p-5 shadow-sm transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200/80'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-100 dark:border-slate-800">
          <h3 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Recent Vehicle Activity
          </h3>
          <button className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer">
            <span>View All Events</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          
          {/* Log 1 */}
          <div className={`rounded-xl border p-3 flex items-center gap-3 select-none ${
            isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <div className="rounded-full p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
              <Car className="h-4 w-4" />
            </div>
            <div className="text-left leading-tight">
              <p className={`text-[10px] font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Vehicle Started</p>
              <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">Started Moving</p>
              <p className="text-[8px] text-slate-400 mt-1 font-bold">Just now</p>
            </div>
          </div>

          {/* Log 2 */}
          <div className={`rounded-xl border p-3 flex items-center gap-3 select-none ${
            isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <div className="rounded-full p-2 bg-rose-50 text-rose-600 dark:bg-rose-950/30">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-left leading-tight">
              <p className={`text-[10px] font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Vehicle Stopped</p>
              <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">Entered Geofence</p>
              <p className="text-[8px] text-slate-400 mt-1 font-bold">2 min ago</p>
            </div>
          </div>

          {/* Log 3 */}
          <div className={`rounded-xl border p-3 flex items-center gap-3 select-none ${
            isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <div className="rounded-full p-2 bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30">
              <Gauge className="h-4 w-4" />
            </div>
            <div className="text-left leading-tight">
              <p className={`text-[10px] font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Speed Limit Exceeded</p>
              <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">Speed: 85 km/h</p>
              <p className="text-[8px] text-slate-400 mt-1 font-bold">3 min ago</p>
            </div>
          </div>

          {/* Log 4 */}
          <div className={`rounded-xl border p-3 flex items-center gap-3 select-none ${
            isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <div className="rounded-full p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
              <Droplet className="h-4 w-4" />
            </div>
            <div className="text-left leading-tight">
              <p className={`text-[10px] font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Fuel Refilled</p>
              <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">Low Level: 6%</p>
              <p className="text-[8px] text-slate-400 mt-1 font-bold">5 min ago</p>
            </div>
          </div>

          {/* Log 5 */}
          <div className={`rounded-xl border p-3 flex items-center gap-3 select-none ${
            isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <div className="rounded-full p-2 bg-rose-50 text-rose-600 dark:bg-rose-950/30">
              <Power className="h-4 w-4" />
            </div>
            <div className="text-left leading-tight">
              <p className={`text-[10px] font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Engine Turned Off</p>
              <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">Low Level: 2%</p>
              <p className="text-[8px] text-slate-400 mt-1 font-bold">8 min ago</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
