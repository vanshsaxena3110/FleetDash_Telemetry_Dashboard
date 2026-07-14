import React from 'react'
import { X, User, ShieldAlert, Compass, Gauge, Clock, ShieldCheck } from 'lucide-react'

export default function AlertDetailsDrawer({ alert, onClose, isDarkMode = false }) {
  if (!alert) {
    return (
      <div className={`border rounded-xl p-6 text-center shadow-sm select-none ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
      }`}>
        <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-40 animate-pulse" />
        <p className="text-xs font-bold">Select an alert on the registry table to inspect details.</p>
      </div>
    )
  }

  return (
    <div className={`border rounded-xl p-5 shadow-sm text-left relative overflow-hidden transition-all duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/90 backdrop-blur-md border-slate-200/80'
    }`}>
      {/* Close button top right */}
      <button 
        onClick={onClose}
        className={`absolute right-4 top-4 rounded-full p-1 cursor-pointer transition-colors ${
          isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
        }`}
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="border-b pb-3 mb-4 border-slate-100 dark:border-slate-800/80">
        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Vehicle ID</span>
        <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{alert.vehicleId}</h3>
      </div>

      {/* Specifications list */}
      <div className="space-y-4 text-xs font-semibold">
        
        {/* Driver Name */}
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5 mb-0.5">
            <User className="h-3.5 w-3.5 text-slate-450" />
            Driver Name
          </span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-850'}`}>{alert.driver}</span>
        </div>

        {/* Alert Type */}
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5 mb-0.5">
            <ShieldAlert className="h-3.5 w-3.5 text-slate-450" />
            Alert Type
          </span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-850'}`}>{alert.alertType}</span>
        </div>

        {/* Description */}
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5 mb-0.5">
            <ShieldAlert className="h-3.5 w-3.5 text-slate-450" />
            Description
          </span>
          <p className={`text-[11px] leading-relaxed font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {alert.description || `Vehicle ${alert.vehicleId} triggered a ${alert.alertType} warning near the monitored gateway area.`}
          </p>
        </div>

        {/* Speed */}
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5 mb-0.5">
            <Gauge className="h-3.5 w-3.5 text-slate-450" />
            Speed
          </span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-850'}`}>{alert.speed || 'N/A'}</span>
        </div>

        {/* Location */}
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5 mb-0.5">
            <Compass className="h-3.5 w-3.5 text-slate-450" />
            Location
          </span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-855'}`}>{alert.location || 'Agra-Mathura Highway'}</span>
        </div>

        {/* Time */}
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5 mb-0.5">
            <Clock className="h-3.5 w-3.5 text-slate-450" />
            Time
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] block">{alert.time}</span>
        </div>

        {/* Status */}
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5 mb-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-450" />
            Status
          </span>
          {alert.status === 'resolved' ? (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Resolved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[9px] font-extrabold text-rose-600 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              Active / {alert.severity}
            </span>
          )}
        </div>

      </div>
    </div>
  )
}
