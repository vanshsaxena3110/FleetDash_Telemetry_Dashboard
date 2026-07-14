import React from 'react'
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from 'react-leaflet'
import { useVehicleStore } from '../store/vehicleStore.js'
import Fleet from './Fleet.jsx'
import Vehicles from './Vehicles.jsx'
import Geofences from './Geofences.jsx'
import Analytics from './Analytics.jsx'
import Alerts from './Alerts.jsx'
import FleetStatus from '../components/FleetStatus.jsx'
import RecentAlerts from '../components/RecentAlerts.jsx'
import SystemHealth from '../components/SystemHealth.jsx'
import {
  LayoutDashboard,
  MapPin,
  Navigation,
  LineChart,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  SlidersHorizontal,
  RefreshCw,
  Search,
  Maximize2,
  Moon,
  Sun,
  Shield,
  Car,
  AlertTriangle,
  Activity,
  ChevronRight,
  TrendingUp,
  Compass,
  Zap,
  X
} from 'lucide-react'
// Dynamic map viewport controller helper
function MapViewController({ center, zoom }) {
  const map = useMap()
  React.useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

// Map resize invalidation controller helper
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

export default function Dashboard({ onLogout }) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [searchVal, setSearchVal] = React.useState('')
  const [activeNav, setActiveNav] = React.useState('live-fleet') // Set default to 'live-fleet' to match photo
  const [hoveredLegend, setHoveredLegend] = React.useState(null)
  const [showAdminPortal, setShowAdminPortal] = React.useState(false)
  
  // Live Vehicle Store values for Leaflet dashboard map
  const { vehicles, geofences } = useVehicleStore()
  const [selectedMapVehicleId, setSelectedMapVehicleId] = React.useState('all')
  const [mapCenter, setMapCenter] = React.useState([28.61, 77.23])
  const [mapZoom, setMapZoom] = React.useState(11)

  const handleSelectMapVehicle = (e) => {
    const val = e.target.value
    setSelectedMapVehicleId(val)
    if (val === 'all') {
      setMapCenter([28.61, 77.23])
      setMapZoom(11)
    } else {
      const v = vehicles.find(x => x.id === val)
      if (v) {
        setMapCenter([v.lat, v.lng])
        setMapZoom(14)
      }
    }
  }
  
  // Dashboard view state
  const [activePin, setActivePin] = React.useState(null)
  const [dashboardAlerts, setDashboardAlerts] = React.useState([
    { id: '1', title: 'Geofence Breach', desc: 'NH-48, Delhi', time: '2 min ago', severity: 'critical', type: 'geofence' },
    { id: '2', title: 'Speed Limit Exceeded', desc: 'DLF Cyber City, Gurgaon', time: '8 min ago', severity: 'warning', type: 'speed' },
    { id: '3', title: 'Vehicle Idle', desc: 'Sector 62, Noida', time: '15 min ago', severity: 'info', type: 'status' },
    { id: '4', title: 'Low Fuel', desc: 'HR-26 AB 1234', time: '26 min ago', severity: 'warning', type: 'fuel' },
    { id: '5', title: 'Harsh Braking', desc: 'NH-24, Ghaziabad', time: '48 min ago', severity: 'critical', type: 'alert' }
  ])

  const resolveDashboardAlert = (id) => {
    setDashboardAlerts(prev => prev.filter(a => a.id !== id))
  }

  // Sidebar Links
  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-fleet', label: 'Live Fleet', icon: MapPin },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'geofence', label: 'Geofence', icon: Compass },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: dashboardAlerts.length > 0 ? dashboardAlerts.length : null }
  ]

  // Dashboard Stats
  const dashboardStatsData = [
    {
      id: 'stats-1',
      title: 'Total Vehicles',
      value: '1,248',
      trend: '↑ 12.5%',
      trendDesc: 'vs yesterday',
      trendColor: 'text-emerald-505 bg-emerald-50/50',
      icon: Car,
      iconColor: 'text-blue-500 bg-blue-50',
      darkIconColor: 'text-blue-450 bg-blue-950/40',
      backValue: 'Peak: 1,320',
      backDesc: '94% operational efficiency.'
    },
    {
      id: 'stats-2',
      title: 'Active Vehicles',
      value: '986',
      trend: '↑ 8.2%',
      trendDesc: 'vs yesterday',
      trendColor: 'text-emerald-505 bg-emerald-50/50',
      icon: Activity,
      iconColor: 'text-emerald-600 bg-emerald-50',
      darkIconColor: 'text-emerald-450 bg-emerald-950/40',
      backValue: 'Utilization: 79%',
      backDesc: 'Avg active hours: 8.4 hr/day.'
    },
    {
      id: 'stats-3',
      title: 'Total Distance',
      value: '18,542 km',
      trend: '↑ 15.3%',
      trendDesc: 'vs yesterday',
      trendColor: 'text-emerald-505 bg-emerald-50/50',
      icon: Navigation,
      iconColor: 'text-sky-600 bg-sky-50',
      darkIconColor: 'text-sky-450 bg-sky-950/40',
      backValue: 'Avg: 14.8 km/v',
      backDesc: 'Noida Link Road has high traffic.'
    },
    {
      id: 'stats-4',
      title: 'Fuel Consumed',
      value: '5,832 L',
      trend: '↓ 2.6%',
      trendDesc: 'vs yesterday',
      trendColor: 'text-rose-600 bg-rose-50/50',
      icon: SlidersHorizontal,
      iconColor: 'text-orange-600 bg-orange-50',
      darkIconColor: 'text-orange-450 bg-orange-950/40',
      backValue: 'Avg: 8.2 km/L',
      backDesc: 'Saves 150 liters vs last week.'
    },
    {
      id: 'stats-5',
      title: 'Alerts',
      value: dashboardAlerts.length.toString(),
      trend: '↓ 67%',
      trendDesc: 'vs yesterday',
      trendColor: 'text-emerald-505 bg-emerald-50/50',
      icon: AlertTriangle,
      iconColor: 'text-rose-600 bg-rose-50',
      darkIconColor: 'text-rose-450 bg-rose-950/40',
      backValue: 'Active: ' + dashboardAlerts.length,
      backDesc: 'Awaiting operator acknowledgment.'
    }
  ]

  // Dashboard Map Markers
  const dashboardMapPins = [
    { id: 'p1', name: 'MH01 AB 1234', x: '28%', y: '30%', color: 'emerald', status: 'Active', driver: 'Rahul Sharma' },
    { id: 'p2', name: 'DL02 CD 5678', x: '72%', y: '32%', color: 'emerald', status: 'Active', driver: 'Amit Verma' },
    { id: 'p3', name: 'KA02 EF 9012', x: '58%', y: '48%', color: 'slate', status: 'Stopped', driver: 'Sandeep Singh', geofence: true },
    { id: 'p4', name: 'GJ04 GH 3456', x: '38%', y: '68%', color: 'red', status: 'Critical', driver: 'Vikram Patel' },
    { id: 'p5', name: 'HR26 AL 7890', x: '80%', y: '78%', color: 'slate', status: 'Idle', driver: 'Manish Yadav' }
  ]

  // System Services
  const systemServices = [
    { name: 'Ingestion Service', status: 'Operational', uptime: '99.9%' },
    { name: 'Database', status: 'Operational', uptime: '99.8%' },
    { name: 'Message Broker', status: 'Operational', uptime: '98.7%' },
    { name: 'WebSocket Server', status: 'Operational', uptime: '98.8%' },
    { name: 'API Server', status: 'Operational', uptime: '99.8%' }
  ]

  // Dashboard Donut Chart
  const fleetLegends = [
    { label: 'On Route', count: 986, pct: '79%', color: 'bg-emerald-500', slice: 'on-route' },
    { label: 'Idle', count: 156, pct: '12%', color: 'bg-yellow-500', slice: 'idle' },
    { label: 'Stopped', count: 74, pct: '6%', color: 'bg-rose-500', slice: 'stopped' },
    { label: 'Offline', count: 32, pct: '3%', color: 'bg-slate-400', slice: 'offline' }
  ]

  return (
    <div className={`flex min-h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-gradient-to-tr from-emerald-50/40 via-white to-slate-100/80 bg-grid-pattern text-slate-800'}`}>
      
      {/* 1. SIDEBAR */}
      <aside className={`w-64 flex flex-col justify-between p-5 shrink-0 border-r transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/10 border-slate-800' 
          : 'bg-emerald-50/60 backdrop-blur-md border-emerald-100/80'
      }`}>
        <div className="space-y-6">
          {/* Logo brand */}
          <div className="flex items-center gap-2 px-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-955 text-emerald-400">
              <Zap className="h-5 w-5 fill-emerald-400" />
            </div>
            <div className="text-left leading-none">
              <span className={`text-xl font-bold tracking-tight block ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>FleetDash</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {sidebarLinks.map((item) => {
              const IconComponent = item.icon
              const isActive = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? isDarkMode 
                        ? 'bg-slate-800/90 text-emerald-400 border-l-[3px] border-l-emerald-500 rounded-r-lg pl-[9px]' 
                        : 'bg-emerald-500/10 text-emerald-800 border-l-[3px] border-l-emerald-500 rounded-r-lg pl-[9px] shadow-sm'
                      : isDarkMode 
                        ? 'text-slate-450 hover:bg-slate-850 hover:text-slate-200' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="bg-rose-500 text-white font-black text-[9px] rounded-full px-1.5 py-0.5 leading-none shrink-0 border border-rose-400 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sidebar Footer options */}
        <div className="space-y-1.5 border-t border-slate-200/60 pt-4">
          <button className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-slate-450 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
            <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
            <span>Help & Support</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold cursor-pointer transition-colors text-rose-500 hover:bg-rose-500/10"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTROLLER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* 2. TOP NAVBAR */}
        <header className={`h-16 flex items-center justify-between px-8 border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200/80 shadow-sm/50'}`}>
          {/* Left spacer where search was */}
          <div></div>

          {/* Settings / Controls */}
          <div className="flex items-center gap-5.5">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-505'}`}>Live</span>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => alert("Alert Center: 5 active system warnings logged. Real-time websocket backend connection pending.")}
                className={`p-1.5 rounded-lg border cursor-pointer transition-colors relative ${isDarkMode ? 'bg-slate-955 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'}`}
              >
                <Bell className="h-3.5 w-3.5" />
                {dashboardAlerts.length > 0 && (
                  <span className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                )}
              </button>
            </div>

            {/* User Profile / Admin Portal button */}
            <button 
              onClick={() => setShowAdminPortal(true)}
              className="flex items-center gap-2.5 border-l border-slate-200/80 pl-4 cursor-pointer hover:opacity-85 focus:outline-none bg-transparent border-y-0 border-r-0"
            >
              <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-black tracking-tight select-none border border-slate-300">
                AD
              </div>
              <div className="text-left hidden sm:block">
                <p className={`text-xs font-bold leading-none ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Admin</p>
                <p className="text-[9px] text-slate-400 font-semibold tracking-wider mt-0.5">Fleet Manager</p>
              </div>
            </button>
          </div>
        </header>

        {/* 3. SWITCH VIEW CONTENT AREA */}
        {activeNav === 'dashboard' ? (
          // ======================= ORIGINAL DASHBOARD VIEW =======================
          <main className={`flex-grow overflow-y-auto p-6 md:p-8 space-y-6 ${isDarkMode ? 'bg-slate-955' : 'bg-transparent'}`}>
            {/* Header Row: Title & Theme Toggle */}
            <div className="flex items-center justify-between">
              <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fleet Dashboard</h1>
              
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold cursor-pointer transition-all shadow-sm ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                }`}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-yellow-455" />
                    <span>Light Theme</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-slate-500" />
                    <span>Theme Toggle</span>
                  </>
                )}
              </button>
            </div>

            {/* Map Widget */}
            <div className={`rounded-xl border shadow-sm p-4.5 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className={`text-sm font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Live Map</h2>
                  <span className="flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500">
                    <span className="h-1 w-1 rounded-full bg-emerald-455 animate-pulse"></span>
                    Live
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={selectedMapVehicleId}
                    onChange={handleSelectMapVehicle}
                    className={`text-xs border rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-250 text-slate-650'
                    }`}
                  >
                    <option value="all">All Vehicles</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.driver})</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => alert("Zoom View toggled")}
                    className={`p-1 rounded border cursor-pointer ${isDarkMode ? 'bg-slate-955 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-250 text-slate-500'}`}
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Leaflet Map - "make little long large map in dashboard" */}
              <div className="h-[300px] rounded-lg border border-slate-200 overflow-hidden relative" style={{ zIndex: 1 }}>
                <style>{`
                  .leaflet-container img {
                    max-width: none !important;
                    max-height: none !important;
                  }
                `}</style>
                <MapContainer 
                  center={mapCenter} 
                  zoom={mapZoom} 
                  className="h-full w-full"
                >
                  <MapViewController center={mapCenter} zoom={mapZoom} />
                  <MapResizeController />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />

                  {/* Dynamic Geofence Circles */}
                  {geofences.map(g => (
                    <Circle 
                      key={g.id}
                      center={[g.lat, g.lng]}
                      radius={g.radius || 1500}
                      pathOptions={{
                        color: g.type === 'restricted' ? '#f43f5e' : '#10b981',
                        fillColor: g.type === 'restricted' ? '#f43f5e' : '#10b981',
                        fillOpacity: 0.07,
                        weight: 1.5
                      }}
                    />
                  ))}

                  {/* Dynamic Vehicles plotted as dots */}
                  {vehicles.map(v => {
                    let color = '#10b981' // moving / active (green)
                    if (v.status === 'idle') color = '#eab308' // idle (yellow)
                    if (v.status === 'stopped') color = '#94a3b8' // stopped (gray)
                    const isSelected = selectedMapVehicleId === v.id

                    return (
                      <CircleMarker
                        key={v.id}
                        center={[v.lat, v.lng]}
                        radius={isSelected ? 10 : 7}
                        fillColor={color}
                        color="#ffffff"
                        weight={1.8}
                        fillOpacity={0.9}
                      >
                        <Popup>
                          <div className="text-left font-sans text-xs leading-normal">
                            <p className="font-extrabold text-emerald-800">{v.name}</p>
                            <p className="text-[10px] text-slate-550">Driver: {v.driver}</p>
                            <p className="text-[10px] text-slate-550">Speed: {v.speed} km/h</p>
                            <p className="text-[10px] text-slate-500 font-bold">Status: {v.status}</p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    )
                  })}
                </MapContainer>
              </div>
            </div>

            {/* Stats Cards Flip Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {dashboardStatsData.map((card) => {
                const IconComponent = card.icon
                return (
                  <div key={card.id} className="group h-24 perspective-1000 cursor-pointer">
                    <div className="relative w-full h-full duration-500 transition-all preserve-3d group-hover:rotate-y-180">
                      <div className={`absolute inset-0 w-full h-full rounded-xl border p-4 flex flex-col justify-between backface-hidden shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200/80 hover:border-slate-300'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.title}</span>
                          <div className={`rounded-lg p-1.5 ${isDarkMode ? card.darkIconColor : card.iconColor}`}><IconComponent className="h-4 w-4" /></div>
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-xl font-extrabold leading-none">{card.value}</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-transparent ${card.trendColor}`}>{card.trend}</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 w-full h-full rounded-xl border p-4 flex flex-col justify-center backface-hidden rotate-y-180 bg-emerald-600 border-emerald-700 text-white shadow-md">
                        <span className="text-[8px] font-extrabold uppercase tracking-widest text-emerald-250 block mb-0.5">{card.title}</span>
                        <span className="text-sm font-black leading-none">{card.backValue}</span>
                        <span className="text-[9px] font-bold text-emerald-100 leading-tight mt-1 block">{card.backDesc}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Three column summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Fleet Status Donut Chart */}
              <FleetStatus 
                isDarkMode={isDarkMode} 
                hoveredLegend={hoveredLegend} 
                setHoveredLegend={setHoveredLegend}
                onViewAll={() => setActiveNav('vehicles')}
              />

              {/* Recent Alerts Panel */}
              <RecentAlerts 
                alerts={dashboardAlerts} 
                onResolve={resolveDashboardAlert} 
                isDarkMode={isDarkMode}
                onViewAll={() => setActiveNav('alerts')}
              />

              {/* System Health Services */}
              <SystemHealth isDarkMode={isDarkMode} />
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-between text-[10px] font-bold border-t pt-4 border-slate-200">
              <div className="flex items-center gap-2"><RefreshCw className="h-3 w-3 animate-spin-slow" /><span>Last Updated: Just now</span></div>
              <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span><span>All systems operational</span></div>
            </footer>
          </main>
        ) : activeNav === 'vehicles' ? (
          // ======================= VEHICLES VIEW =======================
          <Vehicles isDarkMode={isDarkMode} />
        ) : activeNav === 'geofence' ? (
          // ======================= GEOFENCES VIEW =======================
          <Geofences isDarkMode={isDarkMode} />
        ) : activeNav === 'analytics' ? (
          // ======================= ANALYTICS VIEW =======================
          <Analytics isDarkMode={isDarkMode} />
        ) : activeNav === 'alerts' ? (
          // ======================= ALERTS VIEW =======================
          <Alerts isDarkMode={isDarkMode} />
        ) : (
          // ======================= LIVE FLEET VIEW =======================
          <Fleet isDarkMode={isDarkMode} />
        )}
      </div>

      {/* Admin Portal Modal Dialog */}
      {showAdminPortal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className={`rounded-xl border shadow-xl max-w-md w-full p-6 text-left relative transition-all duration-300 transform scale-100 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            {/* Close button */}
            <button 
              onClick={() => setShowAdminPortal(false)}
              className={`absolute right-4 top-4 rounded-full p-1 cursor-pointer transition-colors ${
                isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Title */}
            <div className="border-b pb-4 mb-4 border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-450 tracking-wider">Security Access Control</span>
              <h3 className="text-base font-black tracking-tight mt-0.5">Admin Management Portal</h3>
            </div>

            {/* Profile Avatar & Quick Status */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-black shadow-inner">
                AD
              </div>
              <div className="text-left">
                <h4 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Admin Fleet Manager</h4>
                <p className="text-[10px] text-emerald-600 font-extrabold uppercase mt-0.5 tracking-wider">Systems Administrator</p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Session
                </span>
              </div>
            </div>

            {/* Grid properties */}
            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Username</span>
                  <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>admin_fleet</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Email</span>
                  <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>admin@fleetdash.com</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 dark:text-slate-550 font-bold uppercase text-[9px] block mb-0.5">Department</span>
                  <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Logistics & Fleet Ops</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-550 font-bold uppercase text-[9px] block mb-0.5">Assigned Hub</span>
                  <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Agra Corridor (NH-19)</span>
                </div>
              </div>

              <div className="border-t pt-4 border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] block mb-1">Access Level Permissions</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Read Telemetry', 'Manage Geofences', 'Edit Vehicles', 'Acknowledge Alerts'].map((perm) => (
                    <span 
                      key={perm}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-405 font-bold text-[9px]"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-2.5 pt-5 mt-6 border-t border-slate-100 dark:border-slate-850">
              <button 
                onClick={() => setShowAdminPortal(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
