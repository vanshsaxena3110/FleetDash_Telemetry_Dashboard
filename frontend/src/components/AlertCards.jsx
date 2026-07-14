import React from 'react'
import { Bell, AlertTriangle, ShieldAlert, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react'

export default function AlertCards({ isDarkMode = false }) {
  const cards = [
    {
      title: 'Total Alerts',
      value: '248',
      trend: '15%',
      isUp: true,
      icon: Bell,
      colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/50',
    },
    {
      title: 'Critical Alerts',
      value: '25',
      trend: '2%',
      isUp: false,
      icon: ShieldAlert,
      colorClass: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50',
    },
    {
      title: 'Warning Alerts',
      value: '102',
      trend: '21%',
      isUp: false,
      icon: AlertTriangle,
      colorClass: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/50',
    },
    {
      title: 'Resolved Alerts',
      value: '121',
      trend: '12%',
      isUp: true,
      icon: CheckCircle,
      colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/50',
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
            <div className={`rounded-full p-2.5 border ${card.colorClass}`}>
              <IconComponent className="h-5 w-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
