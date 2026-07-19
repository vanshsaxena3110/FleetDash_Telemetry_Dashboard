import React from 'react'
import {
  LayoutDashboard,
  Car,
  Bell,
  LineChart,
  Sun,
  Maximize2,
  Settings,
  MapPin,
  Zap,
  BarChart3,
  HardDrive,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  Play
} from 'lucide-react'

// Tech stack list for the marquee animation
const TECH_STACK = [
  { name: 'React.js', color: '#61DAFB', desc: 'Frontend Framework' },
  { name: 'Node.js', color: '#339933', desc: 'Backend Runtime' },
  { name: 'Express.js', color: '#000000', desc: 'Server Framework' },
  { name: 'MongoDB', color: '#47A248', desc: 'Database' },
  { name: 'Socket.io', color: '#010101', desc: 'Real-time Protocol' },
  { name: 'Tailwind CSS', color: '#06B6D4', desc: 'Utility Styling' },
  { name: 'Chart.js', color: '#FF6384', desc: 'Visualizations' },
  { name: 'Mapbox', color: '#31C48D', desc: 'Geospatial Maps' },
  { name: 'Redis', color: '#DC382D', desc: 'Caching / Queue' }
]

// Duplicate the list to make the marquee loop seamless
const DUP_TECH_STACK = [...TECH_STACK, ...TECH_STACK, ...TECH_STACK]

export default function Home({ onLoginSuccess }) {
  const [showLoginModal, setShowLoginModal] = React.useState(false)
  const [Username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    setTimeout(() => {
      if (Username === 'admin' && password === 'admin') {
        setIsLoading(false)
        setShowLoginModal(false)
        if (onLoginSuccess) {
          onLoginSuccess()
        }
      } else {
        setIsLoading(false)
        setError('Invalid admin credentials. Please try again.')
      }
    }, 1000)
  }
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 bg-grid-pattern pb-16">
      {/* 1. Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400">
              <Zap className="h-5 w-5 fill-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-950">FleetDash</span>
          </div>

          {/* Right Area */}
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
              <Sun className="h-5 w-5" />
            </button>
            
            {/* Get Started Action */}
            <div className="flex items-center border-l border-slate-200 pl-4">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="rounded-lg bg-emerald-950 px-4 py-2 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-900 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm shadow-emerald-950/15"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Container */}
      <main className="mx-auto max-w-7xl px-6 pt-8 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-250 px-3 py-1 text-xs font-semibold text-emerald-805 uppercase tracking-wider">
              REAL TIME TELEMETRY DASHBOARD
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-[44px] font-extrabold tracking-tight text-slate-955 leading-[1.15]">
              <span className="text-emerald-800">FleetDash:</span> Real-time Fleet Telemetry Dashboard
            </h1>
            
            <p className="text-base text-slate-650 font-normal leading-relaxed">
              A high-throughput, event-driven fleet telemetry dashboard that tracks thousands of vehicles in real-time with live location, performance analytics, and intelligent alerts.
            </p>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm hover:border-slate-300 transition-all duration-200">
                <MapPin className="h-4.5 w-4.5 text-emerald-650" />
                <span className="text-xs font-semibold text-slate-800">Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm hover:border-slate-300 transition-all duration-200">
                <Zap className="h-4.5 w-4.5 text-emerald-655" />
                <span className="text-xs font-semibold text-slate-800">Live Telemetry</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm hover:border-slate-300 transition-all duration-200">
                <TrendingUp className="h-4.5 w-4.5 text-emerald-655" />
                <span className="text-xs font-semibold text-slate-800">High Performance</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm hover:border-slate-300 transition-all duration-200">
                <HardDrive className="h-4.5 w-4.5 text-emerald-655" />
                <span className="text-xs font-semibold text-slate-800">Scalable</span>
              </div>
            </div>

          </div>

          {/* Right Column: High Fidelity Dashboard Mockup */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl ring-1 ring-slate-100/50 hover:scale-[1.02] hover:-rotate-1 hover:shadow-emerald-950/10 hover:border-emerald-500/30 transition-all duration-500 group/mockup">
              {/* Header border detailing */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 rounded-t-2xl"></div>
              
              {/* Inner Dashboard Layout */}
              <div className="grid grid-cols-12 gap-2 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 min-h-[460px]">
                
                {/* 1. Mockup Sidebar */}
                <div className="col-span-3 bg-white border-r border-slate-150 p-3 flex flex-col justify-between text-left hidden sm:flex">
                  <div className="space-y-5">
                    {/* Inner Brand */}
                    <div className="flex items-center gap-1.5 px-1">
                      <Zap className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                      <span className="text-sm font-extrabold tracking-tight text-emerald-950">FleetDash</span>
                    </div>

                    {/* Sidebar Links */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-2 py-1.5 text-xs font-semibold text-emerald-800">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Dashboard
                      </div>
                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800">
                        <Car className="h-3.5 w-3.5 text-slate-400" />
                        Vehicle
                      </div>
                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800">
                        <Bell className="h-3.5 w-3.5 text-slate-400" />
                        Alerts
                      </div>
                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800">
                        <LineChart className="h-3.5 w-3.5 text-slate-400" />
                        Analytics
                      </div>
                    </div>
                  </div>

                  {/* Profile info at sidebar bottom */}
                  <div className="flex items-center gap-2 px-1 pt-3 border-t border-slate-100">
                    <div className="h-6 w-6 rounded-full bg-emerald-900 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      FM
                    </div>
                    <div className="leading-tight">
                      <p className="text-[10px] font-bold text-slate-900">Fleet Manager</p>
                      <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping"></span>
                        Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Mockup Main Content Area */}
                <div className="col-span-12 sm:col-span-9 p-3 flex flex-col gap-3">
                  
                  {/* Mockup Subheader */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 text-left">Live Fleet Overview</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live
                      </span>
                      <div className="flex gap-0.5 rounded border border-slate-200 bg-white p-0.5 text-slate-400">
                        <button className="p-0.5 hover:text-slate-600"><Bell className="h-3 w-3" /></button>
                        <button className="p-0.5 hover:text-slate-600"><Settings className="h-3 w-3" /></button>
                        <button className="p-0.5 hover:text-slate-600"><Maximize2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>

                  {/* Main Grid: Map & Stats */}
                  <div className="grid grid-cols-12 gap-3">
                    
                    {/* Mock Map Panel */}
                    <div className="col-span-12 md:col-span-8 flex flex-col gap-3">
                      
                       {/* Map Container */}
                      <div className="relative h-44 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden shadow-sm flex items-center justify-center hover:shadow-md hover:border-slate-350 transition-all duration-300 group/map">
                        {/* Fake map drawing (roads and landmarks) using SVG */}
                        <svg className="absolute inset-0 h-full w-full opacity-60 group-hover/map:opacity-85 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg">
                          {/* Roads */}
                          <path d="M 0 30 Q 100 40 200 20 T 400 60" fill="none" stroke="#ffffff" strokeWidth="6" />
                          <path d="M 0 30 Q 100 40 200 20 T 400 60" fill="none" stroke="#cbd5e1" strokeWidth="2" />
                          
                          <path d="M 50 0 L 120 180" fill="none" stroke="#ffffff" strokeWidth="8" />
                          <path d="M 50 0 L 120 180" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                          
                          <path d="M 320 0 Q 300 90 280 180" fill="none" stroke="#ffffff" strokeWidth="5" />
                          <path d="M 320 0 Q 300 90 280 180" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                          
                          <path d="M 0 130 C 150 110, 250 160, 400 120" fill="none" stroke="#ffffff" strokeWidth="7" />
                          <path d="M 0 130 C 150 110, 250 160, 400 120" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />

                          {/* Secondary/Tertiary grid lines */}
                          <path d="M 120 180 Q 220 140 320 180" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
                        </svg>

                        {/* Landmark tags */}
                        <div className="absolute top-4 left-6 text-[8px] font-bold text-slate-400 select-none hover:text-slate-600 transition-colors">New Delhi</div>
                        <div className="absolute top-3 right-20 text-[8px] font-bold text-slate-400 select-none hover:text-slate-600 transition-colors">Anand Vihar</div>
                        <div className="absolute top-10 right-28 text-[8px] font-bold text-slate-400 select-none hover:text-slate-600 transition-colors">Connaught Place</div>
                        <div className="absolute bottom-8 left-8 text-[8px] font-bold text-slate-400 select-none hover:text-slate-600 transition-colors">Indira Gandhi Intl Airport</div>
                        <div className="absolute bottom-16 right-16 text-[8px] font-bold text-slate-400 select-none hover:text-slate-600 transition-colors">IAJP Delhi</div>

                        {/* Vehicle Pins */}
                        {/* 1. MH01 AB 1234 - Green */}
                        <div className="absolute top-[28%] left-[28%] z-10 flex flex-col items-center hover:scale-115 hover:z-25 transition-all duration-300 group/pin">
                          <div className="bg-white border border-emerald-500 rounded px-1.5 py-0.5 shadow-md flex items-center gap-0.5 leading-none group-hover/pin:border-emerald-600 group-hover/pin:shadow-lg transition-all duration-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[7px] font-bold text-slate-700">MH01 AB 1234</span>
                            <span className="text-[6px] text-emerald-600 font-semibold pl-0.5">60 km/h</span>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-emerald-600 border-2 border-white shadow-sm flex items-center justify-center -mt-0.5 group-hover/pin:scale-125 transition-transform duration-300"></div>
                        </div>

                        {/* 2. DL02 CD 5678 - Green */}
                        <div className="absolute top-[35%] right-[22%] z-10 flex flex-col items-center hover:scale-115 hover:z-25 transition-all duration-300 group/pin">
                          <div className="bg-white border border-emerald-500 rounded px-1.5 py-0.5 shadow-md flex items-center gap-0.5 leading-none group-hover/pin:border-emerald-600 group-hover/pin:shadow-lg transition-all duration-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[7px] font-bold text-slate-700">DL02 CD 5678</span>
                            <span className="text-[6px] text-emerald-600 font-semibold pl-0.5">45 km/h</span>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-emerald-600 border-2 border-white shadow-sm flex items-center justify-center -mt-0.5 group-hover/pin:scale-125 transition-transform duration-300"></div>
                        </div>

                        {/* 3. KA02 EF 9012 - Blue */}
                        <div className="absolute top-[52%] left-[45%] z-10 flex flex-col items-center hover:scale-115 hover:z-25 transition-all duration-300 group/pin">
                          <div className="bg-white border border-blue-500 rounded px-1.5 py-0.5 shadow-md flex items-center gap-0.5 leading-none group-hover/pin:border-blue-600 group-hover/pin:shadow-lg transition-all duration-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-505 animate-pulse"></span>
                            <span className="text-[7px] font-bold text-slate-700">KA02 EF 9012</span>
                            <span className="text-[6px] text-blue-600 font-semibold pl-0.5">65 km/h</span>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center -mt-0.5 group-hover/pin:scale-125 transition-transform duration-300"></div>
                        </div>

                        {/* 4. GJ04 GH 3456 - Purple */}
                        <div className="absolute bottom-[24%] right-[32%] z-10 flex flex-col items-center hover:scale-115 hover:z-25 transition-all duration-300 group/pin">
                          <div className="bg-white border border-purple-500 rounded px-1.5 py-0.5 shadow-md flex items-center gap-0.5 leading-none group-hover/pin:border-purple-600 group-hover/pin:shadow-lg transition-all duration-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-505 animate-pulse"></span>
                            <span className="text-[7px] font-bold text-slate-700">GJ04 GH 3456</span>
                            <span className="text-[6px] text-purple-600 font-semibold pl-0.5">55 km/h</span>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-purple-600 border-2 border-white shadow-sm flex items-center justify-center -mt-0.5 group-hover/pin:scale-125 transition-transform duration-300"></div>
                        </div>

                        {/* Map Zoom UI Elements */}
                        <div className="absolute right-2 bottom-2 flex flex-col gap-0.5 rounded border border-slate-200 bg-white p-0.5 shadow-sm text-slate-600 font-bold select-none text-[8px]">
                          <button className="h-3.5 w-3.5 bg-slate-50 hover:bg-slate-100 rounded flex items-center justify-center">+</button>
                          <button className="h-3.5 w-3.5 bg-slate-50 hover:bg-slate-100 rounded flex items-center justify-center">-</button>
                        </div>
                        <button className="absolute right-2 bottom-[45px] h-4 w-4 bg-white border border-slate-200 rounded shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-50">
                          <MapPin className="h-2.5 w-2.5 text-slate-600 fill-slate-200" />
                        </button>
                      </div>

                      {/* Speed & Chart Mockup Row */}
                      <div className="grid grid-cols-2 gap-3">
                        
                        {/* Telemetry Line Chart */}
                        <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 text-left shadow-sm flex flex-col justify-between h-32">
                          <div>
                            <h4 className="text-[9px] font-extrabold text-slate-900 leading-none">Telemetry Data (Last 1 Hour)</h4>
                            <div className="flex items-center gap-2 mt-1.5 text-[7px] font-bold text-slate-500">
                              <span className="flex items-center gap-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span> Speed (km/h)
                              </span>
                              <span className="flex items-center gap-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Engine Temp (°C)
                              </span>
                            </div>
                          </div>
                          
                          {/* SVG line chart */}
                          <div className="h-14 w-full relative mt-1">
                            <svg className="w-full h-full" viewBox="0 0 160 50">
                              {/* Grid lines */}
                              <line x1="0" y1="10" x2="160" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                              <line x1="0" y1="25" x2="160" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                              <line x1="0" y1="40" x2="160" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                              
                              {/* Speed Line (Blue) */}
                              <path d="M 0 35 L 20 28 L 40 32 L 60 22 L 80 20 L 100 24 L 120 26 L 140 23 L 160 25" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                              {/* Dots for speed */}
                              <circle cx="20" cy="28" r="1.5" fill="#3b82f6" />
                              <circle cx="60" cy="22" r="1.5" fill="#3b82f6" />
                              <circle cx="100" cy="24" r="1.5" fill="#3b82f6" />
                              <circle cx="140" cy="23" r="1.5" fill="#3b82f6" />

                              {/* Temp Line (Green) */}
                              <path d="M 0 20 L 20 18 L 40 14 L 60 16 L 80 12 L 100 15 L 120 16 L 140 13 L 160 14" fill="none" stroke="#10b981" strokeWidth="1.5" />
                              {/* Dots for temp */}
                              <circle cx="40" cy="14" r="1.5" fill="#10b981" />
                              <circle cx="80" cy="12" r="1.5" fill="#10b981" />
                              <circle cx="120" cy="16" r="1.5" fill="#10b981" />
                            </svg>
                          </div>
                          
                          {/* X-axis labels */}
                          <div className="flex justify-between text-[6px] font-bold text-slate-400 px-0.5">
                            <span>10:00</span>
                            <span>10:15</span>
                            <span>10:30</span>
                            <span>10:45</span>
                            <span>11:00</span>
                          </div>
                        </div>

                        {/* Vehicle Status (Donut Chart) */}
                        <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 text-left shadow-sm flex flex-col justify-between h-32">
                          <h4 className="text-[9px] font-extrabold text-slate-900 leading-none">Vehicle Status</h4>
                          
                          <div className="flex items-center gap-2 py-1 justify-center">
                            {/* Donut Chart SVG */}
                            <div className="relative h-14 w-14 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                {/* Segment 1: Stopped (Red) - 10% */}
                                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="0" />
                                {/* Segment 2: Idle (Yellow) - 20% */}
                                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-10" />
                                {/* Segment 3: Active (Green) - 70% */}
                                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="70 30" strokeDashoffset="-30" />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                                <span className="text-[10px] font-bold text-slate-800">128</span>
                                <span className="text-[5px] text-slate-400 uppercase font-semibold">Total</span>
                              </div>
                            </div>

                            {/* Legend labels */}
                            <div className="flex flex-col gap-1 text-[7px] font-extrabold text-slate-600">
                              <div className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                <span>Active (98)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                                <span>Idle (20)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                <span>Stopped (10)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Right column: Stats Card panel */}
                    <div className="col-span-12 md:col-span-4 flex flex-col gap-2.5">
                      
                      {/* Card 1: Total Vehicles */}
                      <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 text-left shadow-sm flex flex-col justify-between h-[66px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Total Vehicles</span>
                          <div className="rounded bg-slate-100 p-0.5"><Car className="h-3 w-3 text-slate-600" /></div>
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-extrabold text-slate-900 leading-none">128</span>
                          <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1 py-0.5">+12% vs last hr</span>
                        </div>
                      </div>

                      {/* Card 2: Active Vehicles */}
                      <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 text-left shadow-sm flex flex-col justify-between h-[66px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Active Vehicles</span>
                          <div className="rounded bg-slate-100 p-0.5"><Car className="h-3 w-3 text-slate-600" /></div>
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-extrabold text-slate-900 leading-none">98</span>
                          <span className="text-[7.5px] font-bold text-slate-500">76.5% of total</span>
                        </div>
                      </div>

                      {/* Card 3: Alerts */}
                      <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 text-left shadow-sm flex flex-col justify-between h-[66px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-1.5 w-1.5 rounded-bl-full bg-red-500"></div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Alerts</span>
                          <div className="rounded bg-red-50 p-0.5 border border-red-100 animate-pulse">
                            <Bell className="h-3 w-3 text-red-500 fill-red-100" />
                          </div>
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-extrabold text-slate-900 leading-none">7</span>
                          <span className="text-[8px] font-bold text-red-600 bg-red-50 border border-red-100 rounded px-1 py-0.5 flex items-center gap-0.5">
                            Requires attention
                          </span>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>

        {/* 3. Features Row (4 cards) with Flip Animation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-16">
          {/* Card 1: Live Vehicle Tracking */}
          <div className="group h-48 perspective-1000 cursor-pointer">
            <div className="relative w-full h-full duration-500 transition-all preserve-3d group-hover:rotate-y-180">
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full rounded-xl border border-slate-200 bg-white/80 p-5 flex flex-col justify-between backface-hidden shadow-sm hover:border-slate-350 transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-250 text-xl font-bold select-none">
                  📍
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Vehicle Tracking</h3>
                  <p className="mt-1 text-[10px] text-slate-400 font-medium">Hover to flip for details</p>
                </div>
              </div>
              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 flex flex-col justify-center backface-hidden rotate-y-180 text-left">
                <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📍</span> Live Tracking
                </h3>
                <p className="mt-2 text-[11px] text-slate-600 font-medium leading-relaxed">
                  Monitor exact GPS positions, directions, and routes of your entire fleet in real-time on interactive SVG map interfaces.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Real-time Telemetry */}
          <div className="group h-48 perspective-1000 cursor-pointer">
            <div className="relative w-full h-full duration-500 transition-all preserve-3d group-hover:rotate-y-180">
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full rounded-xl border border-slate-200 bg-white/80 p-5 flex flex-col justify-between backface-hidden shadow-sm hover:border-slate-350 transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-250 text-xl font-bold select-none">
                  ⚡
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Real-time Telemetry</h3>
                  <p className="mt-1 text-[10px] text-slate-400 font-medium">Hover to flip for details</p>
                </div>
              </div>
              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 flex flex-col justify-center backface-hidden rotate-y-180 text-left">
                <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡</span> Live Telemetry
                </h3>
                <p className="mt-2 text-[11px] text-slate-600 font-medium leading-relaxed">
                  Track vital statistics such as speeds, fuel usage, and engine temperatures instantly using event-driven WebSockets.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Fleet Analytics */}
          <div className="group h-48 perspective-1000 cursor-pointer">
            <div className="relative w-full h-full duration-500 transition-all preserve-3d group-hover:rotate-y-180">
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full rounded-xl border border-slate-200 bg-white/80 p-5 flex flex-col justify-between backface-hidden shadow-sm hover:border-slate-350 transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-250 text-xl font-bold select-none">
                  📊
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Fleet Analytics</h3>
                  <p className="mt-1 text-[10px] text-slate-400 font-medium">Hover to flip for details</p>
                </div>
              </div>
              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 flex flex-col justify-center backface-hidden rotate-y-180 text-left">
                <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📊</span> Fleet Analytics
                </h3>
                <p className="mt-2 text-[11px] text-slate-600 font-medium leading-relaxed">
                  Aggregate historical driver performance data, total speeds, alerts, and fuel efficiency indicators on a centralized dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Geofence Monitoring */}
          <div className="group h-48 perspective-1000 cursor-pointer">
            <div className="relative w-full h-full duration-500 transition-all preserve-3d group-hover:rotate-y-180">
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full rounded-xl border border-slate-200 bg-white/80 p-5 flex flex-col justify-between backface-hidden shadow-sm hover:border-slate-350 transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-250 text-xl font-bold select-none">
                  🛡️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Geofence Monitoring</h3>
                  <p className="mt-1 text-[10px] text-slate-400 font-medium">Hover to flip for details</p>
                </div>
              </div>
              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 flex flex-col justify-center backface-hidden rotate-y-180 text-left">
                <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛡️</span> Geofences
                </h3>
                <p className="mt-2 text-[11px] text-slate-600 font-medium leading-relaxed">
                  Establish safety boundaries and restricted zones. Automatically trigger live alarms on immediate unauthorized entries or exits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Row: Tech Stack with Marquee */}
        <div className="rounded-xl border border-slate-200/80 bg-white/80 p-6 text-left shadow-sm">
          {/* Tech Stack Heading and Scrolling Animation */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Tech Stack</h3>
            
            {/* Infinite Marquee Container (Moving from left to right) */}
            <div className="relative w-full overflow-hidden py-3">
              {/* Fade filters on left and right for premium look */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              
              {/* Scrolling track: keyframes marquee-right is set in index.css */}
              <div className="flex w-[200%] md:w-[300%] gap-4 animate-marquee-right hover:[animation-play-state:paused] cursor-pointer">
                {DUP_TECH_STACK.map((tech, idx) => (
                  <div 
                    key={idx}
                    className="group flex flex-shrink-0 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 hover:bg-emerald-50/70 hover:border-emerald-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md transition-all duration-300 transform select-none"
                  >
                    {/* Icon circle with interactive rotation */}
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-white border border-slate-100 text-[10px] font-black shadow-sm transition-transform duration-350 group-hover:rotate-12" style={{ color: tech.color }}>
                      {tech.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-none">{tech.name}</p>
                      <p className="text-[9px] font-medium text-slate-400 leading-none mt-0.5">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative animate-slide-up">
            <button 
              onClick={() => {
                setShowLoginModal(false);
                setError('');
                setUsername('');
                setPassword('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-205">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Admin Sign In</h2>
              <p className="text-xs text-slate-500 max-w-xs">
                Access the FleetDash system to monitor vehicles, alerts, analytics, and geofences.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input 
                  type="text" 
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 transition-all"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded px-2.5 py-1.5">
                  {error}
                </p>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-[11px] text-slate-500 flex items-start gap-2 select-none">
                <span className="font-bold text-emerald-800">Demo Tip:</span>
                <span>Use username <code className="bg-slate-200 px-1 rounded text-slate-700 font-mono">admin</code> and password <code className="bg-slate-200 px-1 rounded text-slate-700 font-mono">admin</code>.</span>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-emerald-950 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-900 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/10"
              >
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Login as Admin</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
