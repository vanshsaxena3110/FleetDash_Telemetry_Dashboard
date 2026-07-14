import React from 'react'
import { Search } from 'lucide-react'
import AlertCards from '../components/AlertCards.jsx'
import AlertTable from '../components/AlertTable.jsx'
import AlertDetailsDrawer from '../components/AlertDetailsDrawer.jsx'

export default function Alerts({ isDarkMode = false }) {
  // Pre-configured alerts matching the screenshot details
  const [alerts, setAlerts] = React.useState([
    {
      id: 'a1',
      time: '09:06:23 PM',
      vehicleId: 'TRK-09AB',
      driver: 'Rohit Sharma',
      alertType: 'Speeding',
      severity: 'Critical',
      status: 'Critical',
      speed: '95 km/h',
      location: 'Agra',
      description: 'Description: Harsh Braking is barding. Geofence soelemetrnably speed of highers 95 km/h.'
    },
    {
      id: 'a2',
      time: '09:06:23 PM',
      vehicleId: 'TRK-07CD',
      driver: 'Rohit Sharma',
      alertType: 'Harsh Braking',
      severity: 'Critical',
      status: 'resolved',
      speed: '62 km/h',
      location: 'Mathura',
      description: 'Harsh Braking detected. Speed deceleration exceeded threshold on NH-19.'
    },
    {
      id: 'a3',
      time: '09:06:23 PM',
      vehicleId: 'TRK-07CD',
      driver: 'Rohit Sharma',
      alertType: 'Harsh Braking',
      severity: 'Warning',
      status: 'resolved',
      speed: '62 km/h',
      location: 'Farah',
      description: 'Harsh braking event detected. Driver initiated rapid stop near exit.'
    },
    {
      id: 'a4',
      time: '09:06:23 PM',
      vehicleId: 'TRK-098F',
      driver: 'Rohit Sharma',
      alertType: 'Geofence breach',
      severity: 'Warning',
      status: 'info',
      speed: '70 km/h',
      location: 'Sikandra',
      description: 'Vehicle crossed standard zone threshold boundary.'
    },
    {
      id: 'a5',
      time: '09:06:23 PM',
      vehicleId: 'TRK-09AB',
      driver: 'Rohit Sharma',
      alertType: 'Geofence breach',
      severity: 'Info',
      status: 'info',
      speed: '85 km/h',
      location: 'Yamuna Expressway',
      description: 'Vehicle exited the designated service zone.'
    },
    {
      id: 'a6',
      time: '09:06:23 PM',
      vehicleId: 'TRK-07CD',
      driver: 'Rohit Sharma',
      alertType: 'Geofence breach',
      severity: 'Warning',
      status: 'resolved',
      speed: '60 km/h',
      location: 'Agra',
      description: 'Geofence warning: vehicle approaching boundary limits.'
    },
    {
      id: 'a7',
      time: '09:06:23 PM',
      vehicleId: 'TRK-09AB',
      driver: 'Rohit Sharma',
      alertType: 'Speeding',
      severity: 'Info',
      status: 'resolved',
      speed: '95 km/h',
      location: 'Mathura',
      description: 'Temporary speed warning cleared after automatic check.'
    },
    {
      id: 'a8',
      time: '09:06:23 PM',
      vehicleId: 'TRK-09AB',
      driver: 'Rohit Sharma',
      alertType: 'Speeding',
      severity: 'Info',
      status: 'resolved',
      speed: '90 km/h',
      location: 'Farah',
      description: 'Vehicle exceeded standard highway speed recommendation.'
    },
    {
      id: 'a9',
      time: '09:06:23 PM',
      vehicleId: 'TRK-07CD',
      driver: 'Rohit Sharma',
      alertType: 'Speeding',
      severity: 'Low Fuel',
      status: 'resolved',
      speed: '65 km/h',
      location: 'Agra',
      description: 'Warning: Fuel level remaining is under 10% threshold.'
    },
    {
      id: 'a10',
      time: '09:09:23 PM',
      vehicleId: 'TRK-098F',
      driver: 'Rohit Sharma',
      alertType: 'Speeding',
      severity: 'Low Fuel',
      status: 'resolved',
      speed: '62 km/h',
      location: 'Mathura',
      description: 'Warning: Fuel level remaining is under 10% threshold.'
    }
  ])

  const [selectedAlert, setSelectedAlert] = React.useState(alerts[0]) // Default select first
  const [searchVal, setSearchVal] = React.useState('')
  const [severityFilter, setSeverityFilter] = React.useState('all')

  // Search/Filter logic
  const filteredAlerts = alerts.filter(item => {
    const matchesSearch = item.vehicleId.toLowerCase().includes(searchVal.toLowerCase()) || 
                          item.alertType.toLowerCase().includes(searchVal.toLowerCase()) ||
                          item.driver.toLowerCase().includes(searchVal.toLowerCase())

    const cleanFilter = severityFilter.toLowerCase()
    let matchesFilter = true
    if (cleanFilter !== 'all') {
      if (cleanFilter === 'resolved') {
        matchesFilter = item.status === 'resolved'
      } else {
        matchesFilter = item.severity.toLowerCase() === cleanFilter || item.status.toLowerCase() === cleanFilter
      }
    }

    return matchesSearch && matchesFilter
  })

  // Resolve Alert action
  const handleResolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a))
    if (selectedAlert && selectedAlert.id === id) {
      setSelectedAlert(prev => ({ ...prev, status: 'resolved' }))
    }
  }

  return (
    <div className="flex-grow overflow-y-auto p-6 md:p-8 flex flex-col gap-6 text-left bg-transparent">
      
      {/* 1. Page Header */}
      <div className="flex items-center justify-between select-none">
        <div>
          <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Alerts</h1>
          <p className="text-[11px] text-slate-500 font-bold mt-0.5">Monitor fleet alerts and notifications</p>
        </div>
      </div>

      {/* 2. Stats cards */}
      <AlertCards isDarkMode={isDarkMode} />

      {/* 3. Toolbar filters */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border rounded-xl p-4 shadow-sm transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/90 backdrop-blur-md border-slate-200/80'
      }`}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className={`w-64 border rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none transition-all ${
              isDarkMode 
                ? 'bg-slate-955 border-slate-800 text-slate-200 focus:border-emerald-500/50' 
                : 'bg-slate-50 border-slate-200 text-slate-850 focus:border-emerald-500/50'
            }`}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 select-none text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Critical', 'Warning', 'Info', 'Resolved'].map((chip) => (
              <button
                key={chip}
                onClick={() => setSeverityFilter(chip.toLowerCase())}
                className={`px-3 py-1 rounded-full border cursor-pointer transition-all ${
                  severityFilter === chip.toLowerCase()
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : isDarkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Table + Details drawer layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* Left Table Panel (7 cols / 70% width) */}
        <div className="lg:col-span-7">
          <AlertTable 
            alerts={filteredAlerts}
            onSelectAlert={(a) => setSelectedAlert(a)}
            selectedAlertId={selectedAlert ? selectedAlert.id : null}
            onResolveAlert={handleResolveAlert}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Right Details Drawer Panel (3 cols / 30% width) */}
        <div className="lg:col-span-3">
          <AlertDetailsDrawer 
            alert={selectedAlert}
            onClose={() => setSelectedAlert(null)}
            isDarkMode={isDarkMode}
          />
        </div>

      </div>

    </div>
  )
}
