import React from 'react'
import { 
  Search, 
  RefreshCw, 
  Download, 
  MoreVertical, 
  MapPin, 
  Info, 
  Edit2, 
  Signal, 
  ChevronDown 
} from 'lucide-react'

export default function VehicleTable({ 
  vehicles, 
  activeVehicleId, 
  onSelectVehicle, 
  isDarkMode = false 
}) {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all') // 'all', 'moving', 'idle', 'offline'
  const [typeFilter, setTypeFilter] = React.useState('all') // 'all', 'truck', 'van', 'car', 'bus'
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  // Status mapping to cover stores status nomenclature ('active' vs 'moving', 'stopped' vs 'offline')
  const getNormalizedStatus = (status) => {
    const s = status.toLowerCase()
    if (s === 'active' || s === 'moving') return 'Moving'
    if (s === 'idle') return 'Idle'
    if (s === 'stopped' || s === 'offline') return 'Offline'
    return 'Offline'
  }

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v => {
    const normStatus = getNormalizedStatus(v.status)
    const matchesSearch = 
      v.id.toLowerCase().includes(search.toLowerCase()) || 
      (v.regNo || '').toLowerCase().includes(search.toLowerCase()) ||
      v.name.toLowerCase().includes(search.toLowerCase()) || 
      v.driver.toLowerCase().includes(search.toLowerCase())

    let matchesStatus = true
    if (statusFilter !== 'all') {
      matchesStatus = normStatus.toLowerCase() === statusFilter.toLowerCase()
    }

    let matchesType = true
    if (typeFilter !== 'all') {
      matchesType = (v.type || '').toLowerCase() === typeFilter.toLowerCase()
    }

    return matchesSearch && matchesStatus && matchesType
  })

  // Export CSV helper
  const exportCSV = () => {
    const headers = ['Vehicle ID', 'Registration Number', 'Vehicle Name', 'Driver Name', 'Vehicle Type', 'Status', 'Speed', 'Fuel Level', 'Last Updated']
    const rows = filteredVehicles.map(v => [
      v.id,
      v.regNo || 'TR9AB-1234',
      v.name,
      v.driver,
      v.type || 'Truck',
      getNormalizedStatus(v.status),
      v.speed ? `${v.speed} km/h` : '62 km/h',
      `${v.fuel}%`,
      v.time || 'Just now'
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `fleet_vehicles_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* Sub-toolbar row */}
      <div className={`flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 border rounded-xl p-4 shadow-sm transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/90 backdrop-blur-md border-slate-200/80'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search query box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-52 border rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500/50' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/50'
              }`}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 select-none">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                statusFilter === 'all' 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-400 shadow-sm' 
                  : isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('moving')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border flex items-center gap-1.5 ${
                statusFilter === 'moving' 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-400 shadow-sm' 
                  : isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Moving
            </button>
            <button 
              onClick={() => setStatusFilter('offline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border flex items-center gap-1.5 ${
                statusFilter === 'offline' 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-400 shadow-sm' 
                  : isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              Offline
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

          {/* Vehicle Type filters */}
          <div className="flex flex-wrap items-center gap-1.5 select-none">
            {['Truck', 'Van', 'Car'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                  typeFilter === type
                    ? 'bg-slate-800 text-white border-slate-800'
                    : isDarkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                      : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
            
            {/* Bus dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all flex items-center gap-1.5 ${
                  typeFilter === 'bus'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : isDarkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                      : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                <span>Bus</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {dropdownOpen && (
                <div className={`absolute left-0 mt-1.5 w-24 rounded-lg shadow-md border py-1 z-25 text-left ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <button 
                    onClick={() => { setTypeFilter('bus'); setDropdownOpen(false) }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-500/10 hover:text-emerald-600 font-bold"
                  >
                    Select Bus
                  </button>
                  <button 
                    onClick={() => { setTypeFilter('all'); setDropdownOpen(false) }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-500/10 hover:text-emerald-600 font-bold"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Refresh & CSV Operations */}
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={() => {}}
            className={`flex items-center gap-1.5 text-xs font-bold border rounded-lg px-3 py-1.5 cursor-pointer shadow-sm transition-all ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850' 
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          
          <button 
            onClick={exportCSV}
            className={`flex items-center gap-1.5 text-xs font-bold border rounded-lg px-3 py-1.5 cursor-pointer shadow-sm transition-all ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-350 hover:bg-slate-850' 
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className={`border rounded-xl shadow-sm overflow-hidden select-none transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
                isDarkMode ? 'border-slate-800 text-slate-400 bg-slate-950/30' : 'border-slate-150 text-slate-400 bg-slate-50/50'
              }`}>
                <th className="px-4 py-3.5">Vehicle ID</th>
                <th className="px-4 py-3.5">Registration Number</th>
                <th className="px-4 py-3.5">Vehicle Name</th>
                <th className="px-4 py-3.5">Driver Name</th>
                <th className="px-4 py-3.5">Vehicle Type</th>
                <th className="px-4 py-3.5">Current Status</th>
                <th className="px-4 py-3.5">Current Speed</th>
                <th className="px-4 py-3.5">Fuel Level</th>
                <th className="px-4 py-3.5">GPS Signal</th>
                <th className="px-4 py-3.5">Last Updated</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${
              isDarkMode ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-100 text-slate-700'
            }`}>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-12 text-slate-400 font-bold select-none">
                    No vehicles found matching the active criteria.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => {
                  const isSelected = activeVehicleId === v.id
                  const normStatus = getNormalizedStatus(v.status)
                  const fuelVal = v.fuel !== undefined ? v.fuel : 68
                  
                  return (
                    <tr 
                      key={v.id}
                      onClick={() => onSelectVehicle && onSelectVehicle(v)}
                      className={`cursor-pointer transition-colors duration-200 ${
                        isSelected 
                          ? isDarkMode 
                            ? 'bg-slate-800/40 text-white' 
                            : 'bg-emerald-50/30 text-slate-900 border-l-2 border-emerald-555' 
                          : isDarkMode 
                            ? 'hover:bg-slate-850/40' 
                            : 'hover:bg-slate-50/40'
                      }`}
                    >
                      {/* 1. Vehicle ID */}
                      <td className="px-4 py-3.5 font-bold">{v.id}</td>
                      
                      {/* 2. Registration Number */}
                      <td className="px-4 py-3.5 font-bold text-slate-500 dark:text-slate-400">
                        {v.regNo || 'TR9AB-1234'}
                      </td>
                      
                      {/* 3. Vehicle Name */}
                      <td className="px-4 py-3.5 font-extrabold">{v.name}</td>
                      
                      {/* 4. Driver Name */}
                      <td className="px-4 py-3.5 font-bold text-slate-550 dark:text-slate-400">{v.driver}</td>
                      
                      {/* 5. Vehicle Type */}
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-450">{v.type || 'Truck'}</td>
                      
                      {/* 6. Current Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                          normStatus === 'Moving' 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15' 
                            : normStatus === 'Idle'
                              ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/15'
                              : 'bg-rose-500/10 text-rose-600 border border-rose-500/15'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            normStatus === 'Moving' ? 'bg-emerald-500 animate-pulse' :
                            normStatus === 'Idle' ? 'bg-yellow-500' : 'bg-rose-500'
                          }`}></span>
                          {normStatus}
                        </span>
                      </td>
                      
                      {/* 7. Current Speed */}
                      <td className="px-4 py-3.5 font-bold">{v.speed ? `${v.speed} km/h` : '62 km/h'}</td>
                      
                      {/* 8. Fuel Level */}
                      <td className="px-4 py-3.5 min-w-[90px]">
                        <div className="flex items-center gap-2">
                          <div className={`w-12 h-1.5 rounded-full overflow-hidden ${
                            isDarkMode ? 'bg-slate-950' : 'bg-slate-100'
                          }`}>
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                fuelVal < 20 ? 'bg-rose-500' : fuelVal < 40 ? 'bg-yellow-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${fuelVal}%` }}
                            />
                          </div>
                          <span className="font-bold text-[10px] text-slate-500 dark:text-slate-400">{fuelVal}%</span>
                        </div>
                      </td>
                      
                      {/* 9. GPS Signal */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-end gap-0.5 h-3">
                          <div className="w-[3px] h-1.5 bg-emerald-500 rounded-sm"></div>
                          <div className="w-[3px] h-2 bg-emerald-500 rounded-sm"></div>
                          <div className="w-[3px] h-2.5 bg-emerald-500 rounded-sm"></div>
                          <div className="w-[3px] h-3 bg-emerald-500 rounded-sm"></div>
                        </div>
                      </td>
                      
                      {/* 10. Last Updated */}
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-bold text-[10px] whitespace-nowrap">
                        {v.time || 'Just now'}
                      </td>
                      
                      {/* 11. Actions */}
                      <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => onSelectVehicle && onSelectVehicle(v)}
                            className="p-1 rounded border border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors"
                          >
                            <Info className="h-3 w-3" />
                          </button>
                          <button className="p-1 rounded border border-slate-200 hover:bg-slate-100 cursor-pointer text-slate-500 transition-colors">
                            <MapPin className="h-3 w-3" />
                          </button>
                          <button className="p-1 rounded border border-slate-200 hover:bg-slate-100 cursor-pointer text-slate-500 transition-colors">
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
