import React from 'react'

export default function TopVehiclesTable({ isDarkMode = false }) {
  const data = [
    { id: 'HR38GH5678', driver: 'Sanjay Patel', distance: '40 km', speed: '75 km/h', fuel: '33.1 L' },
    { id: 'HR25AB7890', driver: 'Zahir Sheikh', distance: '67 km', speed: '62 km/h', fuel: '56 L' },
    { id: 'UP80AG1870', driver: 'Mohit Agrawal', distance: '54 km', speed: '15 km/h', fuel: '50 L' },
    { id: 'UP80XY1234', driver: 'Ravi sharma', distance: '34 km', speed: '45 km/h', fuel: '35 L' }
  ]

  return (
    <div className={`border rounded-xl shadow-sm overflow-hidden select-none transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
    }`}>
      {/* Header Row */}
      <div className={`px-5 py-4 text-left border-b ${
        isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-150 bg-slate-50/30'
      }`}>
        <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Top Performing Vehicles
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
              isDarkMode ? 'border-slate-800 text-slate-400 bg-slate-950/30' : 'border-slate-150 text-slate-400 bg-slate-50/50'
            }`}>
              <th className="px-5 py-3">Vehicle ID</th>
              <th className="px-5 py-3">Driver</th>
              <th className="px-5 py-3">Distance Travelled</th>
              <th className="px-5 py-3">Average Speed</th>
              <th className="px-5 py-3 font-semibold">Fuel Used</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-semibold ${
            isDarkMode ? 'divide-slate-800/60 text-slate-350' : 'divide-slate-100 text-slate-700'
          }`}>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/20">
                <td className="px-5 py-3.5 font-bold">{row.id}</td>
                <td className="px-5 py-3.5 text-slate-550 dark:text-slate-400 font-bold">{row.driver}</td>
                <td className="px-5 py-3.5 font-black">{row.distance}</td>
                <td className="px-5 py-3.5 font-bold">{row.speed}</td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-450 font-bold">{row.fuel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
