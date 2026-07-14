import React from 'react'
import AnalyticsCards from '../components/AnalyticsCards.jsx'
import AnalyticsCharts from '../components/AnalyticsCharts.jsx'
import TopVehiclesTable from '../components/TopVehiclesTable.jsx'

export default function Analytics({ isDarkMode = false }) {
  return (
    <div className="flex-grow overflow-y-auto p-6 md:p-8 flex flex-col gap-6 text-left bg-transparent">
      
      {/* 1. Page Header */}
      <div className="flex items-center justify-between select-none">
        <div>
          <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Analytics</h1>
          <p className="text-[11px] text-slate-500 font-bold mt-0.5">Fleet Performance Overview</p>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <AnalyticsCards isDarkMode={isDarkMode} />

      {/* 3. Charts Area */}
      <AnalyticsCharts isDarkMode={isDarkMode} />

      {/* 4. Top Performing Vehicles Table */}
      <TopVehiclesTable isDarkMode={isDarkMode} />

    </div>
  )
}
