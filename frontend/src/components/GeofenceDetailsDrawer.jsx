import React from 'react'
import { X, MapPin, Compass, Shield, Users, AlertOctagon, Clock, Activity } from 'lucide-react'

export default function GeofenceDetailsDrawer({ geofence, onClose, isDarkMode = false }) {
  if (!geofence) {
    return (
      <div className={`border rounded-xl p-6 text-center shadow-sm select-none ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
      }`}>
        <Compass className="h-8 w-8 mx-auto mb-2 opacity-40 animate-spin-slow" />
        <p className="text-xs font-bold">Select a geofence on the map or registry table to inspect details.</p>
      </div>
    )
  }

  const isPolygon = geofence.type === 'polygon'

  return (
    <div className={`border rounded-xl p-5 shadow-sm text-left relative overflow-hidden transition-all duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/90 backdrop-blur-md border-slate-200/80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-100 dark:border-slate-800">
        <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Geofence Details</h3>
        <button 
          onClick={onClose}
          className={`rounded-full p-1 cursor-pointer transition-colors ${
            isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Info Rows */}
      <div className="space-y-4 text-xs font-semibold">
        
        {/* Name */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-450" />
            Geofence Name
          </span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{geofence.name}</span>
        </div>

        {/* Zone Type */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-slate-450" />
            Zone Type
          </span>
          <span className={`font-black lowercase tracking-wide bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded text-[10px] ${
            isDarkMode ? 'text-slate-350' : 'text-slate-650'
          }`}>
            {geofence.type}
          </span>
        </div>

        {/* Radius */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-slate-450" />
            Radius
          </span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            {isPolygon ? 'No fixed radius' : `${geofence.radius} m`}
          </span>
        </div>

        {/* Vehicles Inside */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-450" />
            Vehicles Inside
          </span>
          <span className={`font-black ${geofence.insideCount > 0 ? 'text-emerald-600' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {geofence.insideCount}
          </span>
        </div>

        {/* Vehicles Outside */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5">
            <AlertOctagon className="h-3.5 w-3.5 text-slate-450" />
            Vehicles Outside
          </span>
          <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-805'}`}>{geofence.outsideCount || 2}</span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-slate-450" />
            Status
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-450" />
            Last Updated
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px]">Just now</span>
        </div>

      </div>
    </div>
  )
}
