import React from 'react'
import { ChevronRight } from 'lucide-react'

export default function SystemHealth({ isDarkMode = false }) {
  const systemServices = [
    { name: 'Core Engine API', uptime: '99.98% Uptime' },
    { name: 'OSM Tile Server Gateway', uptime: '100% Online' },
    { name: 'Websocket Feed Sync', uptime: '24ms Latency' },
    { name: 'Geofence Breach Analyzer', uptime: 'Active (3s Interval)' }
  ]

  return (
    <div className={`rounded-xl border shadow-sm p-5 text-left flex flex-col justify-between h-[360px] ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
    }`}>
      <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Health</h3>
      <div className="space-y-3.5 flex-grow py-3">
        {systemServices.map((service, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
              <p className={`font-extrabold ${isDarkMode ? 'text-slate-200' : 'text-slate-850'}`}>{service.name}</p>
            </div>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">{service.uptime}</span>
          </div>
        ))}
      </div>
      <button 
        onClick={() => alert("System Log Viewer: Access restricted to System Administrators.")}
        className={`w-full flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-bold cursor-pointer transition-colors ${
          isDarkMode 
            ? 'bg-slate-955 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' 
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <span>View System Logs</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
