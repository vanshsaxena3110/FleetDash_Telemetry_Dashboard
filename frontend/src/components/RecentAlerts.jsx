import React from 'react'

export default function RecentAlerts({ alerts, onResolve, isDarkMode = false, onViewAll }) {
  return (
    <div className={`rounded-xl border shadow-sm p-5 text-left flex flex-col justify-between h-[360px] ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Alerts</h3>
        <button onClick={onViewAll} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer">
          View All
        </button>
      </div>
      <div className="space-y-2 flex-grow overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <p className="text-xs text-slate-450 font-bold text-center py-10 select-none">No active alerts</p>
        ) : (
          alerts.map(item => (
            <div 
              key={item.id} 
              onClick={() => onResolve(item.id)} 
              title="Click to resolve alert"
              className={`rounded-lg border p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                isDarkMode 
                  ? 'bg-slate-955 border-slate-850 hover:bg-slate-800 hover:border-slate-700' 
                  : 'bg-slate-50/50 border-slate-150 hover:bg-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full shrink-0 ${item.severity === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                <div>
                  <p className={`text-[10px] font-black leading-none ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</p>
                  <p className="text-[9px] text-slate-450 font-semibold mt-0.5">{item.desc}</p>
                </div>
              </div>
              <span className="text-[8px] font-bold text-slate-400 whitespace-nowrap">{item.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
