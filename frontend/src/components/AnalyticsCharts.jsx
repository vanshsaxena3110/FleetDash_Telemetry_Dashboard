import React from 'react'

export default function AnalyticsCharts({ isDarkMode = false }) {
  const [trendRange, setTrendRange] = React.useState('daily')

  // Doughnut Legends
  const legends = [
    { label: 'Moving', color: 'bg-emerald-500', value: '55%' },
    { label: 'Idle', color: 'bg-yellow-500', value: '30%' },
    { label: 'Offline', color: 'bg-rose-500', value: '15%' }
  ]

  // Time Range specific datasets for dynamic updates
  const dataStore = {
    daily: {
      greenCurve: 'M 0,135 Q 65,75 130,120 T 260,55 T 400,30',
      greenFill: 'M 0,135 Q 65,75 130,120 T 260,55 T 400,30 L 400,180 L 0,180 Z',
      orangeCurve: 'M 0,165 Q 60,110 130,135 T 260,85 T 400,105',
      orangeFill: 'M 0,165 Q 60,110 130,135 T 260,85 T 400,105 L 400,180 L 0,180 Z',
      grayCurve: 'M 0,145 Q 60,130 130,100 T 260,95 T 400,85',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      fuel: [90, 82, 70, 64, 62, 56, 48, 40, 32, 24]
    },
    weekly: {
      greenCurve: 'M 0,110 Q 70,140 140,80 T 280,120 T 400,60',
      greenFill: 'M 0,110 Q 70,140 140,80 T 280,120 T 400,60 L 400,180 L 0,180 Z',
      orangeCurve: 'M 0,150 Q 80,90 140,110 T 280,130 T 400,90',
      orangeFill: 'M 0,150 Q 80,90 140,110 T 280,130 T 400,90 L 400,180 L 0,180 Z',
      grayCurve: 'M 0,130 Q 75,115 150,90 T 300,100 T 400,75',
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7'],
      fuel: [45, 68, 85, 34, 76, 52, 91, 58, 29, 63]
    },
    monthly: {
      greenCurve: 'M 0,60 Q 60,120 130,50 T 260,110 T 400,45',
      greenFill: 'M 0,60 Q 60,120 130,50 T 260,110 T 400,45 L 400,180 L 0,180 Z',
      orangeCurve: 'M 0,120 Q 70,160 130,120 T 260,150 T 400,115',
      orangeFill: 'M 0,120 Q 70,160 130,120 T 260,150 T 400,115 L 400,180 L 0,180 Z',
      grayCurve: 'M 0,90 Q 65,140 130,85 T 260,130 T 400,80',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      fuel: [78, 44, 95, 82, 38, 71, 50, 88, 62, 19]
    }
  }

  const activeData = dataStore[trendRange] || dataStore.daily

  // Construct label object arrays for fuel rendering
  const fuelData = [
  { label: 'AG-01', vehicle: 'UP80AG1201', val: 8.2 },
  { label: 'AG-02', vehicle: 'UP80AG1202', val: 7.6 },
  { label: 'AG-03', vehicle: 'UP80AG1203', val: 9.1 },
  { label: 'AG-04', vehicle: 'UP80AG1204', val: 8.7 },
  { label: 'AG-05', vehicle: 'UP80AG1205', val: 7.9 },
  { label: 'AG-06', vehicle: 'UP80AG1206', val: 9.4 },
  { label: 'AL-01', vehicle: 'UP81AL3401', val: 10.2 },
  { label: 'AL-02', vehicle: 'UP81AL3402', val: 8.5 },
  { label: 'AL-03', vehicle: 'UP81AL3403', val: 9.7 },
  { label: 'AL-04', vehicle: 'UP81AL3404', val: 8.9 }
]

const maxFuel = 12

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 select-none">
      
      {/* 1. Vehicle Status Distribution (3 cols / 30% width) */}
      <div className={`lg:col-span-3 rounded-xl border shadow-sm p-5 text-left flex flex-col justify-between h-[360px] ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Vehicle Status Distribution
        </h3>
        
        <div className="flex flex-col items-center justify-center flex-grow py-4 gap-6">
          {/* SVG Donut Chart */}
          <div className="relative h-32 w-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.91" fill="none" stroke={isDarkMode ? "#1e293b" : "#f8fafc"} strokeWidth="4.2" />
              {/* Red - Offline (6%) */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f43f5e" strokeWidth="4.2" strokeDasharray="6 94" strokeDashoffset="0" />
              {/* Yellow - Idle (15%) */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#eab308" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="-6" />
              {/* Green - Moving (79%) */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="79 21" strokeDashoffset="-21" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className={`text-2xl font-black block ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>55%</span>
            </div>
          </div>

          {/* Legends */}
          <div className="flex items-center justify-center gap-5 w-full">
            {legends.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.color}`}></span>
                <span className="text-[10px] font-black text-slate-550 dark:text-slate-450 uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Distance Travelled Trend (4 cols / 40% width) */}
      <div className={`lg:col-span-4 rounded-xl border shadow-sm p-5 text-left flex flex-col justify-between h-[360px] ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Distance Travelled Trend
          </h3>
          
          {/* Toggles */}
          <div className="flex items-center gap-1 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 select-none font-bold text-[10px]">
            {['Daily', 'Weekly', 'Monthly'].map((range) => (
              <button
                key={range}
                onClick={() => setTrendRange(range.toLowerCase())}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  trendRange === range.toLowerCase()
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 font-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Multi-curve line chart */}
        <div className="flex-grow w-full py-4 relative">
          <svg className="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="none">
            <defs>
              {/* Gradients */}
              <linearGradient id="trendGreenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
              </linearGradient>
              <linearGradient id="trendOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0"/>
              </linearGradient>
            </defs>

            {/* Grid coordinates */}
            <g stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} strokeWidth="1">
              <line x1="0" y1="36" x2="400" y2="36" />
              <line x1="0" y1="72" x2="400" y2="72" />
              <line x1="0" y1="108" x2="400" y2="108" />
              <line x1="0" y1="144" x2="400" y2="144" />
            </g>

            {/* Orange path (idle or comparison trend) */}
            <path d={activeData.orangeFill} fill="url(#trendOrangeGrad)" />
            <path d={activeData.orangeCurve} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

            {/* Green path (active distance trend) */}
            <path d={activeData.greenFill} fill="url(#trendGreenGrad)" />
            <path d={activeData.greenCurve} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Gray path (baseline/target) */}
            <path d={activeData.grayCurve} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[9px] font-black uppercase text-slate-455 dark:text-slate-500 mt-2 select-none">
            {activeData.labels.map(label => (
              <span key={label} className="w-12 text-center">{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Fuel Consumption by Vehicle (3 cols / 30% width) */}
      <div className={`lg:col-span-3 rounded-xl border shadow-sm p-5 text-left flex flex-col justify-between h-[360px] ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Fuel Consumption by Vehicle
          </h3>
          <p className="text-[10px] text-slate-500 font-bold mt-0.5">Top 10 vehicles by fuel</p>
        </div>

        {/* SVG vertical bar chart */}
        <div className="flex-grow w-full py-4 flex flex-col justify-end">
          <div className="flex items-end justify-between h-32 w-full gap-1.5 px-1 relative">
            {/* Y axis baseline grids */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 flex-grow">
              <div className="border-b border-black dark:border-white w-full"></div>
              <div className="border-b border-black dark:border-white w-full"></div>
              <div className="border-b border-black dark:border-white w-full"></div>
              <div className="border-b border-black dark:border-white w-full"></div>
            </div>

            {/* Bars */}
            {fuelData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-grow group select-none">
                <div 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-all duration-300 relative cursor-pointer"
                  style={{ height: `${item.val}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-950 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow-sm border border-slate-800 pointer-events-none z-10 select-none">
                    {item.val}L
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* X axis labels */}
          {/* SVG-style fuel consumption bar chart */}
<div className="flex-grow w-full py-4 flex flex-col justify-end">

  <div className="flex items-end justify-between h-40 w-full gap-2 px-1 relative">

    {/* Grid */}
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
      <div className="border-b border-slate-200 dark:border-slate-800 opacity-50"></div>
      <div className="border-b border-slate-200 dark:border-slate-800 opacity-50"></div>
      <div className="border-b border-slate-200 dark:border-slate-800 opacity-50"></div>
      <div className="border-b border-slate-200 dark:border-slate-800 opacity-50"></div>
    </div>

    {/* Bars */}
    {fuelData.map((item) => (
      <div
        key={item.vehicle}
        className="relative flex flex-col items-center justify-end h-full flex-1 group z-10"
      >

        {/* Value */}
        <span className="text-[8px] font-black text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {item.val}L
        </span>

        {/* Bar */}
        <div
          className="w-full max-w-[18px] bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all duration-300 cursor-pointer"
          style={{
            height: `${(item.val / maxFuel) * 100}%`
          }}
        >

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-50 whitespace-nowrap">
            <div className="bg-slate-950 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-lg">
              <div>{item.vehicle}</div>
              <div className="text-emerald-400">
                {item.val} L/100 km
              </div>
            </div>
          </div>

        </div>

      </div>
    ))}
  </div>

  {/* X-axis */}
  <div className="flex justify-between mt-2 px-1">
    {fuelData.map((item) => (
      <span
        key={item.label}
        className="flex-1 text-center text-[8px] font-black text-slate-500"
      >
        {item.label}
      </span>
    ))}
  </div>

  {/* Unit */}
  <p className="text-[9px] text-slate-400 font-bold text-center mt-2">
    Fuel consumption · L/100 km
  </p>

</div>
        </div>
      </div>

    </div>
  )
}
