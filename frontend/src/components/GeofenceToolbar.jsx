import React from 'react'
import { Search, RefreshCw } from 'lucide-react'

export default function GeofenceToolbar({
  searchVal,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isDarkMode = false,
  onRefresh
}) {
  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border rounded-xl p-4 shadow-sm transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/90 backdrop-blur-md border-slate-200/80'
    }`}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Geofence..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-52 border rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none transition-all ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500/50' 
                : 'bg-slate-50 border-slate-200 text-slate-850 focus:border-emerald-500/50'
            }`}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 select-none text-xs font-bold text-slate-500">
          <span>Status filter</span>
          <div className="flex items-center gap-1">
            {['All', 'Active', 'Inactive'].map((status) => (
              <button
                key={status}
                onClick={() => onStatusFilterChange(status.toLowerCase())}
                className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                  statusFilter === status.toLowerCase()
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-450 shadow-sm'
                    : isDarkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end">
        <button 
          onClick={onRefresh}
          className={`flex items-center gap-1.5 text-xs font-bold border rounded-lg px-3 py-1.5 cursor-pointer shadow-sm transition-all ${
            isDarkMode 
              ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850' 
              : 'bg-white border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  )
}
