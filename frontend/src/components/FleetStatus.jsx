import React from 'react'
import { ChevronRight } from 'lucide-react'

export default function FleetStatus({ isDarkMode = false, hoveredLegend, setHoveredLegend, onViewAll }) {
  const fleetLegends = [
    { label: 'On Route', count: 986, pct: '79%', color: 'bg-emerald-500', slice: 'on-route' },
    { label: 'Idle', count: 156, pct: '12%', color: 'bg-yellow-500', slice: 'idle' },
    { label: 'Stopped', count: 74, pct: '6%', color: 'bg-rose-500', slice: 'stopped' },
    { label: 'Offline', count: 32, pct: '3%', color: 'bg-slate-400', slice: 'offline' }
  ]

  return (
    <div className={`rounded-xl border shadow-sm p-5 text-left flex flex-col justify-between h-[360px] ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
    }`}>
      <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fleet Status</h3>
      <div className="flex items-center justify-around gap-4 py-2 flex-grow">
        <div className="relative h-32 w-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.91" fill="none" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="4.2" />
            <circle cx="18" cy="18" r="15.91" fill="none" stroke="#94a3b8" strokeWidth="4.2" strokeDasharray="3 97" strokeDashoffset="0" className={hoveredLegend === 'offline' ? 'scale-105 stroke-[4.8]' : ''} />
            <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f43f5e" strokeWidth="4.2" strokeDasharray="6 94" strokeDashoffset="-3" className={hoveredLegend === 'stopped' ? 'scale-105 stroke-[4.8]' : ''} />
            <circle cx="18" cy="18" r="15.91" fill="none" stroke="#eab308" strokeWidth="4.2" strokeDasharray="12 88" strokeDashoffset="-9" className={hoveredLegend === 'idle' ? 'scale-105 stroke-[4.8]' : ''} />
            <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="79 21" strokeDashoffset="-21" className={hoveredLegend === 'on-route' ? 'scale-105 stroke-[4.8]' : ''} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className={`text-xl font-extrabold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>1,248</span>
            <span className="text-[8px] text-slate-400 uppercase font-black">Total</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {fleetLegends.map((item, idx) => (
            <div 
              key={idx} 
              onMouseEnter={() => setHoveredLegend(item.slice)} 
              onMouseLeave={() => setHoveredLegend(null)} 
              className={`flex items-center gap-3 py-1 px-2 rounded-lg cursor-pointer transition-all duration-200 ${
                hoveredLegend === item.slice 
                  ? isDarkMode 
                    ? 'bg-slate-800/40 scale-105' 
                    : 'bg-slate-50 scale-105' 
                  : ''
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.color}`}></span>
              <div className="text-left leading-none">
                <p className="text-[10px] font-black uppercase text-slate-500">{item.label}</p>
                <p className={`text-[11px] font-black mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={onViewAll}
        className={`w-full flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-bold cursor-pointer transition-colors ${
          isDarkMode 
            ? 'bg-slate-955 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' 
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <span>View All Vehicles</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
