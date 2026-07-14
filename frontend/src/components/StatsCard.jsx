import React from 'react'

export default function StatsCard({ title, value, icon: IconComponent, subtitle, trend, type }) {
  const getColorClasses = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-500/10 border-red-500/20 text-red-400',
          iconBg: 'bg-red-500/10 border-red-500/30 text-red-400',
          text: 'text-red-400',
          dot: 'bg-red-400'
        }
      case 'success':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          text: 'text-emerald-400',
          dot: 'bg-emerald-400'
        }
      case 'info':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          iconBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          text: 'text-blue-400',
          dot: 'bg-blue-400'
        }
      default:
        return {
          bg: 'bg-slate-800/40 border-slate-700/50 text-slate-350',
          iconBg: 'bg-slate-800 border-slate-700 text-slate-300',
          text: 'text-slate-400',
          dot: 'bg-slate-400'
        }
    }
  }

  const colors = getColorClasses()

  return (
    <div className={`rounded-xl border p-4.5 bg-slate-900 border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-700 transition-all duration-300 hover:-translate-y-0.5 group`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`rounded-lg border p-1.5 transition-transform duration-300 group-hover:scale-105 ${colors.iconBg}`}>
          <IconComponent className="h-4 w-4" />
        </div>
      </div>
      
      <div className="flex items-baseline justify-between mt-3">
        <span className="text-2xl font-extrabold text-white leading-none">{value}</span>
        {trend && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${colors.bg}`}>
            {trend}
          </span>
        )}
        {subtitle && !trend && (
          <span className="text-[9px] font-semibold text-slate-500 flex items-center gap-1 select-none">
            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`}></span>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
