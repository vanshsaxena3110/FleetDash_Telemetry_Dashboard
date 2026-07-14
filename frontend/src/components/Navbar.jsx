import React from 'react'
import { Bell, Settings, LogOut, ShieldAlert, Sun, Shield } from 'lucide-react'
import { useVehicleStore } from '../store/vehicleStore'

export default function Navbar({ activeTab, onLogout }) {
  const alerts = useVehicleStore((state) => state.alerts)
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical')

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Fleet Overview'
      case 'vehicles': return 'Vehicle Management'
      case 'alerts': return 'Real-time Alert Center'
      case 'analytics': return 'Telemetry Analytics'
      case 'geofences': return 'Geofencing Controller'
      default: return 'Fleet Dashboard'
    }
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-6 z-10">
      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-white tracking-tight">{getPageTitle()}</h1>
        <span className="flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
          <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping"></span>
          Live Sync Active
        </span>
      </div>

      {/* Toolbar Options */}
      <div className="flex items-center gap-4">
        
        {/* Alerts Center Notification icon */}
        <div className="relative">
          <button className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer">
            <Bell className="h-4 w-4" />
          </button>
          {criticalAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-slate-900 animate-pulse"></span>
          )}
        </div>

        {/* System Settings Icon */}
        <button className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer">
          <Settings className="h-4 w-4" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="h-9 w-9 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Shield className="h-4.5 w-4.5 stroke-[2]" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-200 leading-none">Admin Controller</p>
            <p className="text-[9px] text-emerald-400 font-semibold tracking-wider uppercase mt-0.5">Systems Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}
