import React from 'react'
import { MapPin, Users, AlertTriangle, Flag } from 'lucide-react'

export default function GeofenceStats({ isDarkMode = false }) {
  const stats = [
    {
      title: 'Active Geofences',
      value: '1,248',
      icon: MapPin,
      colorClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/50',
    },
    {
      title: 'Vehicles Inside Zones',
      value: '25',
      icon: Users,
      colorClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/50',
    },
    {
      title: "Today's Geofence Breaches",
      value: '0',
      icon: AlertTriangle,
      colorClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50',
    },
    {
      title: 'Total Geofence Events',
      value: '246',
      icon: Flag,
      colorClass: 'bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:border-slate-800',
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon
        return (
          <div 
            key={idx} 
            className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'
            }`}
          >
            <div>
              <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">{stat.title}</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</span>
              </div>
            </div>
            <div className={`rounded-full p-2 border ${stat.colorClass}`}>
              <IconComponent className="h-5 w-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
