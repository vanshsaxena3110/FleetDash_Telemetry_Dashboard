import React from 'react'
import {
  LayoutDashboard,
  Car,
  Bell,
  LineChart,
  Settings,
  MapPin,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Maximize2
} from 'lucide-react'

// Exact tech stack used in our FleetDash project
const TECH_STACK = [
  { name: 'React.js', role: 'Frontend UI Framework', color: '#61DAFB' },
  { name: 'Node.js', role: 'Backend Runtime', color: '#339933' },
  { name: 'Express.js', role: 'API Server', color: '#FFFFFF' },
  { name: 'MongoDB', role: 'Database', color: '#47A248' },
  { name: 'Socket.io', role: 'Real-time WebSockets', color: '#FFFFFF' },
  { name: 'Leaflet.js', role: 'Interactive Maps', color: '#199900' },
  { name: 'Turf.js', role: 'Geospatial Calculations', color: '#2ECC71' },
  { name: 'Tailwind CSS', role: 'Styling Engine', color: '#06B6D4' }
]

// Duplicate list for seamless 300% infinite marquee loop
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
      if (Username === 'vansh' && password === 'vansh1234') {
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
    <div className="min-h-screen bg-[#635bff] text-white selection:bg-white selection:text-[#635bff] flex flex-col justify-between overflow-x-hidden font-sans">

      {/* 1. Header (Navbar links removed; Project Name on Top-Left, Get Started on Top-Right) */}
      <header className="w-full z-50 px-6 py-5 md:px-12 flex items-center justify-between">
        {/* Top Left: Project Name */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm">
            <Zap className="h-5 w-5 fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white font-sans">FleetDash</span>
        </div>

        {/* Top Right: Get Started Button */}
        <div>
          <button
            onClick={() => setShowLoginModal(true)}
            className="rounded-full bg-white px-6 py-2.5 text-xs font-black text-[#635bff] transition-all hover:bg-slate-100 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 pt-6 pb-12 max-w-6xl mx-auto w-full">

        {/* Top Pill Tag */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold text-white/90 backdrop-blur-md mb-6 hover:bg-white/20 transition-all cursor-pointer">
          <span>Explore Fleet Capability Matrix</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl">
          The intelligent fleet telemetry platform
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-white/80 font-normal max-w-2xl leading-relaxed">
          Securely scale real-time vehicle tracking, live telemetry analytics, and automated geofence alerts with speed and control.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="rounded-full bg-white px-7 py-3 text-sm font-black text-[#635bff] transition-all hover:bg-slate-100 hover:scale-105 active:scale-95 cursor-pointer shadow-xl shadow-black/15"
          >
            Get Started
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="rounded-full bg-white/10 border border-white/25 px-7 py-3 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Sign in to Demo
          </button>
        </div>

        {/* 3. Middle Section: Moving Tech Stack Marquee */}
        <div className="w-full max-w-5xl mt-16 mb-12">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-4 select-none">
            POWERED BY OUR CORE TECH STACK
          </p>

          <div className="relative w-full overflow-hidden py-2">
            {/* Left/Right Fade Out Filters */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#635bff] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#635bff] to-transparent z-10 pointer-events-none"></div>

            {/* Marquee Track */}
            <div className="flex w-[200%] md:w-[300%] gap-6 animate-marquee-right hover:[animation-play-state:paused] cursor-pointer">
              {DUP_TECH_STACK.map((tech, idx) => (
                <div
                  key={idx}
                  className="flex flex-shrink-0 items-center gap-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2.5 text-white hover:bg-white/20 transition-all select-none"
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 font-black text-xs shadow-sm"
                    style={{ color: tech.color }}
                  >
                    {tech.name[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold leading-none">{tech.name}</p>
                    <p className="text-[10px] font-medium text-white/70 leading-none mt-1">{tech.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Bottom Screen Showcase: Live Fleet Map & Telemetry Dashboard Mockup */}
        <div className="w-full max-w-5xl mt-4">
          <div className="relative rounded-2xl border border-white/25 bg-slate-950/40 p-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 hover:border-white/40 transition-all duration-500 text-left">

            {/* Top Browser Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-3 text-[11px] font-bold text-white/50">FleetDash Live Map Operations</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Telemetry Socket Connected
                </span>
              </div>
            </div>

            {/* Inner Dashboard Layout */}
            <div className="grid grid-cols-12 gap-3 rounded-xl overflow-hidden bg-slate-900 border border-white/10 min-h-[380px] p-3">

              {/* Sidebar Mockup */}
              <div className="col-span-3 bg-slate-950/80 border border-white/10 rounded-lg p-3 hidden sm:flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white font-extrabold text-xs">
                    <Zap className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                    FleetDash Studio
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 rounded-md bg-white/15 px-2.5 py-1.5 text-xs font-bold text-white">
                      <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
                      Live Map
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5">
                      <Car className="h-3.5 w-3.5" />
                      Vehicles (1,248)
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5">
                      <Bell className="h-3.5 w-3.5" />
                      Alerts (3)
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5">
                      <LineChart className="h-3.5 w-3.5" />
                      Analytics
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-[10px] font-bold text-white">Fleet Manager Admin</p>
                  <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Socket Streaming Active
                  </p>
                </div>
              </div>

              {/* Interactive Fleet Map Showcase Screen */}
              <div className="col-span-12 sm:col-span-9 flex flex-col gap-3">
                <div className="relative h-72 sm:h-80 rounded-lg border border-white/10 bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center group/map">

                  {/* SVG Vector Map Canvas Roads */}
                  <svg className="absolute inset-0 h-full w-full opacity-40 group-hover/map:opacity-60 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 50 Q 150 70 300 30 T 600 90" fill="none" stroke="#ffffff" strokeWidth="6" />
                    <path d="M 0 50 Q 150 70 300 30 T 600 90" fill="none" stroke="#635bff" strokeWidth="2" />

                    <path d="M 90 0 L 180 280" fill="none" stroke="#ffffff" strokeWidth="8" />
                    <path d="M 90 0 L 180 280" fill="none" stroke="#635bff" strokeWidth="3" />

                    <path d="M 450 0 Q 420 140 380 280" fill="none" stroke="#ffffff" strokeWidth="5" />
                    <path d="M 450 0 Q 420 140 380 280" fill="none" stroke="#635bff" strokeWidth="1.5" />

                    <path d="M 0 200 C 200 170, 380 240, 600 180" fill="none" stroke="#ffffff" strokeWidth="7" />
                    <path d="M 0 200 C 200 170, 380 240, 600 180" fill="none" stroke="#635bff" strokeWidth="2.5" />
                  </svg>

                  {/* Geographical Labels */}
                  <div className="absolute top-4 left-6 text-[9px] font-extrabold text-white/40 uppercase tracking-wider">Sector 62 Hub</div>
                  <div className="absolute top-4 right-16 text-[9px] font-extrabold text-white/40 uppercase tracking-wider">Connaught Hub</div>
                  <div className="absolute bottom-6 left-12 text-[9px] font-extrabold text-white/40 uppercase tracking-wider">Terminal 3 Airport</div>

                  {/* Vehicle Pins & Live Telemetry Labels */}
                  {/* Pin 1: TRK-09AB Moving */}
                  <div className="absolute top-[32%] left-[30%] z-10 flex flex-col items-center hover:scale-110 transition-all duration-300">
                    <div className="bg-slate-900/90 border border-emerald-500/60 text-white rounded px-2 py-1 shadow-lg flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[9px] font-black">TRK-09AB</span>
                      <span className="text-[8px] text-emerald-400 font-extrabold">64 km/h</span>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-md -mt-1"></div>
                  </div>

                  {/* Pin 2: VAN-04CD Idle */}
                  <div className="absolute top-[55%] left-[62%] z-10 flex flex-col items-center hover:scale-110 transition-all duration-300">
                    <div className="bg-slate-900/90 border border-yellow-500/60 text-white rounded px-2 py-1 shadow-lg flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
                      <span className="text-[9px] font-black">VAN-04CD</span>
                      <span className="text-[8px] text-yellow-400 font-extrabold">Idle</span>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 border-2 border-white shadow-md -mt-1"></div>
                  </div>

                  {/* Pin 3: BKE-08EF Moving */}
                  <div className="absolute bottom-[20%] left-[25%] z-10 flex flex-col items-center hover:scale-110 transition-all duration-300">
                    <div className="bg-slate-900/90 border border-emerald-500/60 text-white rounded px-2 py-1 shadow-lg flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[9px] font-black">BKE-08EF</span>
                      <span className="text-[8px] text-emerald-400 font-extrabold">42 km/h</span>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-md -mt-1"></div>
                  </div>

                  {/* Bottom Control Bar */}
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-md px-2.5 py-1 text-[9px] font-bold text-white/70 flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Moving: 986</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span> Idle: 182</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span> Offline: 80</span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>

      </main>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-slate-900 text-white p-6 shadow-2xl relative animate-slide-up">
            <button
              onClick={() => {
                setShowLoginModal(false)
                setError('')
                setUsername('')
                setPassword('')
              }}
              className="absolute top-4 right-4 text-white/50 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#635bff] text-white border border-white/20 shadow-lg">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-white">Admin Sign In</h2>
              <p className="text-xs text-white/70 max-w-xs">
                Access the FleetDash system to monitor vehicles, alerts, analytics, and geofences.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full rounded-lg border border-white/20 px-3.5 py-2 text-sm text-white bg-slate-800 focus:bg-slate-750 focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-white/20 px-3.5 py-2 text-sm text-white bg-slate-800 focus:bg-slate-750 focus:outline-none focus:ring-2 focus:ring-[#635bff] transition-all"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded px-2.5 py-1.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#635bff] py-2.5 text-sm font-bold text-white hover:bg-[#5244e0] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#635bff]/30"
              >
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
