import React from 'react'
import { Search } from 'lucide-react'
import { fetchAlertsApi, resolveAlertApi } from '../services/api.js'
import { connectSocket, offSocketEvent } from '../services/socket.js'
import AlertCards from '../components/AlertCards.jsx'
import AlertTable from '../components/AlertTable.jsx'
import AlertDetailsDrawer from '../components/AlertDetailsDrawer.jsx'

export default function Alerts({ isDarkMode = false }) {

  const [alerts, setAlerts] = React.useState([])
  const [selectedAlert, setSelectedAlert] = React.useState(null)
  const [searchVal, setSearchVal] = React.useState('')
  const [severityFilter, setSeverityFilter] = React.useState('all')
  const [newAlertPopup, setNewAlertPopup] = React.useState(null)

  React.useEffect(() => {
  const loadAlerts = async () => {
    try {
      const response = await fetchAlertsApi()
      const realAlerts = response?.alerts || []

      const formattedAlerts = realAlerts.map((alert) => ({
        id: alert._id,
        time: new Date(alert.createdAt).toLocaleTimeString(),
        vehicleId: alert.vehicle?.vehicleNumber || 'Unknown Vehicle',
        driver: alert.vehicle?.driverName || 'Unknown Driver',
        alertType: alert.type || 'alert',
        severity: alert.severity || 'info',
        status: alert.isResolved ? 'resolved' : alert.severity || 'info',
        location: alert.geofence?.name || 'Unknown Location',
        description: alert.description || alert.title || '',
      }))

      setAlerts(formattedAlerts)

      if (formattedAlerts.length > 0) {
        setSelectedAlert(formattedAlerts[0])
      }
    } catch (error) {
      console.error('Failed to load alerts:', error)
    }
  }

  loadAlerts()
}, [])

React.useEffect(() => {
  const socket = connectSocket()

  const handleNewAlert = async (newAlert) => {
  if (!newAlert) return

  console.log('🚨 ALERTS PAGE RECEIVED:', newAlert)

  try {
    const response = await fetchAlertsApi()
    const realAlerts = response?.alerts || []

    const alert = realAlerts.find(
      (item) => String(item._id) === String(newAlert._id)
    )

    if (!alert) {
      console.warn('Alert not found in populated alerts')
      return
    }

    const formattedAlert = {
      id: alert._id,
      time: new Date(alert.createdAt).toLocaleTimeString(),
      vehicleId: alert.vehicle?.vehicleNumber || 'Unknown Vehicle',
      driver: alert.vehicle?.driverName || 'Unknown Driver',
      alertType: alert.type || 'alert',
      severity: alert.severity || 'info',
      status: alert.isResolved
        ? 'resolved'
        : alert.severity || 'info',
      location: alert.geofence?.name || 'Unknown Location',
      description: alert.description || alert.title || '',
    }

    setAlerts((prev) => [
      formattedAlert,
      ...prev.filter(
        (item) => String(item.id) !== String(formattedAlert.id)
      ),
    ])

    setSelectedAlert(formattedAlert)
    setNewAlertPopup(formattedAlert)

    setTimeout(() => {
      setNewAlertPopup(null)
    }, 5000)

  } catch (error) {
    console.error('Failed to fetch new alert details:', error)
  }
}

  socket.on('new_alert', handleNewAlert)

  return () => {
    offSocketEvent('new_alert', handleNewAlert)
  }
}, [])
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
      {newAlertPopup && (
  <div className="fixed top-5 right-5 z-[9999] w-[360px] rounded-xl border border-rose-200 bg-white p-4 shadow-2xl">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        
      </div>

      <div className="min-w-0">
        <p className="text-sm font-black text-slate-900">
          New Fleet Alert
        </p>

        <p className="mt-1 text-xs font-bold text-rose-600">
          {newAlertPopup.alertType}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          {newAlertPopup.vehicleId} · {newAlertPopup.driver}
        </p>

        <p className="mt-1 text-[11px] text-slate-500">
          {newAlertPopup.description}
        </p>
      </div>
    </div>
  </div>
)}
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
