import React from 'react'
import { Eye, CheckCircle2, ChevronDown } from 'lucide-react'

export default function AlertTable({
  alerts,
  onSelectAlert,
  selectedAlertId,
  onResolveAlert,
  isDarkMode = false
}) {
  const [openDropdownId, setOpenDropdownId] = React.useState(null)

  // Toggle Action Dropdown
  const handleToggleDropdown = (id, e) => {
    e.stopPropagation()
    setOpenDropdownId(openDropdownId === id ? null : id)
  }

  // Handle clicking outside to close dropdowns
  React.useEffect(() => {
    const handleCloseAll = () => setOpenDropdownId(null)
    window.addEventListener('click', handleCloseAll)
    return () => window.removeEventListener('click', handleCloseAll)
  }, [])

  const getSeverityBadge = (sev) => {
    const cleanSev = sev.toLowerCase()
    if (cleanSev === 'critical') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded bg-rose-500 text-white font-extrabold text-[9px] uppercase tracking-wide">
          Critical
        </span>
      )
    } else if (cleanSev === 'warning') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-wide">
          Warning
        </span>
      )
    } else if (cleanSev === 'info') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded bg-sky-500 text-white font-extrabold text-[9px] uppercase tracking-wide">
          Info
        </span>
      )
    } else if (cleanSev === 'low fuel') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded bg-orange-500 text-white font-extrabold text-[9px] uppercase tracking-wide">
          Low Fuel
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded bg-slate-500 text-white font-extrabold text-[9px] uppercase tracking-wide">
        {sev}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const cleanStatus = status.toLowerCase()
    if (cleanStatus === 'critical' || cleanStatus === 'active') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 font-extrabold text-[9px] uppercase tracking-wide">
          Critical
        </span>
      )
    } else if (cleanStatus === 'resolved') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-extrabold text-[9px] uppercase tracking-wide">
          Resolved
        </span>
      )
    } else if (cleanStatus === 'info') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-600 font-extrabold text-[9px] uppercase tracking-wide">
          Info
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded bg-slate-100 dark:bg-slate-950 text-slate-500 font-extrabold text-[9px] uppercase tracking-wide">
        {status}
      </span>
    )
  }

  return (
    <div className={`border rounded-xl shadow-sm overflow-hidden select-none transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/85'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
              isDarkMode ? 'border-slate-800 text-slate-400 bg-slate-950/30' : 'border-slate-150 text-slate-400 bg-slate-50/50'
            }`}>
              <th className="px-5 py-4">Time</th>
              <th className="px-5 py-4">Vehicle ID</th>
              <th className="px-5 py-4">Driver</th>
              <th className="px-5 py-4">Alert Type</th>
              <th className="px-5 py-4">Severity</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${
            isDarkMode ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-100 text-slate-700'
          }`}>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-slate-400 font-bold">
                  No alerts match the search or filter query.
                </td>
              </tr>
            ) : (
              alerts.map((row) => {
                const isSelected = selectedAlertId === row.id
                return (
                  <tr 
                    key={row.id}
                    onClick={() => onSelectAlert && onSelectAlert(row)}
                    className={`cursor-pointer transition-colors duration-150 ${
                      isSelected 
                        ? isDarkMode 
                          ? 'bg-slate-800/40 text-white' 
                          : 'bg-emerald-50/20 text-slate-900 border-l-2 border-emerald-555' 
                        : isDarkMode 
                          ? 'hover:bg-slate-850/40' 
                          : 'hover:bg-slate-50/40'
                    }`}
                  >
                    {/* Time */}
                    <td className="px-5 py-4.5 text-slate-500 dark:text-slate-450 text-[10px] font-bold">
                      {row.time}
                    </td>

                    {/* Vehicle ID */}
                    <td className="px-5 py-4.5 font-extrabold">{row.vehicleId}</td>

                    {/* Driver */}
                    <td className="px-5 py-4.5 text-slate-550 dark:text-slate-400 font-bold">{row.driver}</td>

                    {/* Alert Type */}
                    <td className="px-5 py-4.5">{row.alertType}</td>

                    {/* Severity */}
                    <td className="px-5 py-4.5">{getSeverityBadge(row.severity)}</td>

                    {/* Status */}
                    <td className="px-5 py-4.5">{getStatusBadge(row.status)}</td>

                    {/* Action */}
                    <td className="px-5 py-4.5 text-center relative" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={(e) => handleToggleDropdown(row.id, e)}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold border rounded px-3 py-1 cursor-pointer transition-colors ${
                          isDarkMode 
                            ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850' 
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span>Action</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdownId === row.id && (
                        <div className={`absolute right-5 top-12 rounded-lg border shadow-md w-32 py-1.5 z-20 ${
                          isDarkMode ? 'bg-slate-950 border-slate-850 text-white' : 'bg-white border-slate-200 text-slate-700'
                        }`}>
                          <button 
                            onClick={() => {
                              onSelectAlert && onSelectAlert(row)
                              setOpenDropdownId(null)
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-emerald-500/10 hover:text-emerald-600 flex items-center gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View details</span>
                          </button>
                          
                          {row.status !== 'resolved' && (
                            <button 
                              onClick={() => {
                                onResolveAlert && onResolveAlert(row.id)
                                setOpenDropdownId(null)
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-emerald-500/10 hover:text-emerald-600 flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Resolve alert</span>
                            </button>
                          )}
                        </div>
                      )}
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
