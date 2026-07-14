import React from 'react'
import { ChevronRight } from 'lucide-react'

export default function GeofenceEvents({ isDarkMode = false }) {
  const events = [
    { time: '2m ago', vehicleId: 'TRK-09AB', eventType: 'Vehicle Entered Zone', geofence: 'Warehouse A', status: 'Inside', color: 'green' },
    { time: '5m ago', vehicleId: 'TRK-10FG', eventType: 'Boundary Warning', geofence: 'Service Hub', status: 'Near', color: 'yellow' },
    { time: '8m ago', vehicleId: 'TRK-11HI', eventType: 'Geofence Breach', geofence: 'Distribution Center', status: 'Outside', color: 'red' },
    { time: '12m ago', vehicleId: 'TRK-05DE', eventType: 'Vehicle Exited Zone', geofence: 'Warehouse A', status: 'Outside', color: 'green' }
  ]

  return (
    <div className={`border rounded-xl p-5 shadow-sm transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200/80'
    }`}>
      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-100 dark:border-slate-800">
        <h3 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Recent Geofence Events
        </h3>
        <button className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer">
          <span>Responsive Table</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-semibold select-none border-collapse">
          <thead>
            <tr className="border-b text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-slate-100 dark:border-slate-800/60">
              <th className="py-2.5">Time</th>
              <th className="py-2.5">Vehicle ID</th>
              <th className="py-2.5">Event Type</th>
              <th className="py-2.5">Geofence</th>
              <th className="py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/60 text-slate-350' : 'divide-slate-100 text-slate-700'}`}>
            {events.map((e, idx) => (
              <tr key={idx} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/20">
                <td className="py-3 text-slate-500 font-bold text-[10px]">{e.time}</td>
                <td className="py-3 font-extrabold">{e.vehicleId}</td>
                <td className="py-3">{e.eventType}</td>
                <td className="py-3 text-slate-500 dark:text-slate-400 font-bold">{e.geofence}</td>
                <td className="py-3">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      e.color === 'green' ? 'bg-emerald-500' :
                      e.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-rose-500'
                    }`} />
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
