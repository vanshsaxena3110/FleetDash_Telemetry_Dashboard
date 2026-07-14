import React from 'react'
import { Info, Trash2, MapPin, Eye } from 'lucide-react'

export default function GeofenceTable({
  geofences,
  onSelectGeofence,
  selectedGeofenceId,
  onDeleteGeofence,
  isDarkMode = false
}) {
  return (
    <div className={`border rounded-xl shadow-sm overflow-hidden select-none transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
              isDarkMode ? 'border-slate-800 text-slate-400 bg-slate-950/30' : 'border-slate-150 text-slate-400 bg-slate-50/50'
            }`}>
              <th className="px-4 py-3.5">Geofence Name</th>
              <th className="px-4 py-3.5">Zone Type</th>
              <th className="px-4 py-3.5">Radius</th>
              <th className="px-4 py-3.5">Vehicles Inside</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Last Activity</th>
              <th className="px-4 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${
            isDarkMode ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-100 text-slate-700'
          }`}>
            {geofences.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-slate-400 font-bold">
                  No geofences created.
                </td>
              </tr>
            ) : (
              geofences.map((g) => {
                const isSelected = selectedGeofenceId === g.id
                return (
                  <tr 
                    key={g.id}
                    onClick={() => onSelectGeofence && onSelectGeofence(g)}
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
                    {/* Geofence Name */}
                    <td className="px-4 py-3.5 font-extrabold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-555 shrink-0" />
                      <span>{g.name}</span>
                    </td>
                    
                    {/* Zone Type */}
                    <td className="px-4 py-3.5 font-bold uppercase text-[10px] text-slate-500 dark:text-slate-400">
                      {g.type}
                    </td>

                    {/* Radius */}
                    <td className="px-4 py-3.5 text-slate-650 dark:text-slate-400">
                      {g.type === 'polygon' ? 'No fixed radius' : `${g.radius} m`}
                    </td>

                    {/* Vehicles Inside */}
                    <td className="px-4 py-3.5 font-bold">{g.insideCount}</td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-550/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active
                      </span>
                    </td>

                    {/* Last Activity */}
                    <td className="px-4 py-3.5 text-[10px] text-slate-500 dark:text-slate-450 font-bold whitespace-nowrap">
                      {g.lastActivity || 'Just now'}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onSelectGeofence && onSelectGeofence(g)}
                          className="p-1 rounded border border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => onDeleteGeofence && onDeleteGeofence(g.id)}
                          className="p-1 rounded border border-rose-200 bg-rose-50/30 text-rose-600 hover:bg-rose-500 hover:text-white cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
  )
}
