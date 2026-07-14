import React from 'react'
import { Car, Activity, Gauge, Navigation, TrendingUp, TrendingDown } from 'lucide-react'

export default function AnalyticsCards({ isDarkMode = false }) {
  const cards = [
    {
      title: 'Total Vehicles',
      value: '1,248',
      trend: '15%',
      isUp: true,
      icon: Car,
      colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
    },
    {
      title: 'Active Vehicles',
      value: '986',
      trend: '79%',
      isUp: true,
      icon: Activity,
      colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
    },
    {
      title: 'Average Speed',
      value: '58 km/h',
      trend: '-2%',
      isUp: false,
      icon: Gauge,
      colorClass: 'bg-rose-500/10 border-rose-500/20 text-rose-600',
    },
    {
      title: 'Distance Travelled Today',
      value: '15,400 km',
      trend: '6%',
      isUp: true,
      icon: Navigation,
      colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
      {cards.map((card, idx) => {
        const IconComponent = card.icon
        return (
          <div 
            key={idx} 
            className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'
            }`}
          >
            <div>
              <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">{card.title}</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{card.value}</span>
                <span className={`text-[10px] font-bold flex items-center ${card.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {card.isUp ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                  {card.trend}
                </span>
              </div>
            </div>
            <div className={`rounded-full p-2.5 border ${
              card.isUp 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-950/40' 
                : 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-950/40'
            }`}>
              <IconComponent className="h-5 w-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
