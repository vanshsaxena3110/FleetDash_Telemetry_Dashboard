import React from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap
} from 'react-leaflet'
import L from 'leaflet'

import { useVehicleStore } from '../store/vehicleStore.js'

import Fleet from './Fleet.jsx'
import Vehicles from './Vehicles.jsx'
import Geofences from './Geofences.jsx'
import Analytics from './Analytics.jsx'
import Alerts from './Alerts.jsx'

import FleetStatus from '../components/FleetStatus.jsx'
import RecentAlerts from '../components/RecentAlerts.jsx'
import SystemHealth from '../components/SystemHealth.jsx'

import { fetchVehiclesApi } from '../services/api.js'

import {
  LayoutDashboard,
  MapPin,
  Navigation,
  LineChart,
  Bell,
  HelpCircle,
  LogOut,
  SlidersHorizontal,
  RefreshCw,
  Maximize2,
  Moon,
  Sun,
  Car,
  AlertTriangle,
  Activity,
  Compass,
  Zap,
  X
} from 'lucide-react'


// ============================================================
// SAME CAR-STYLE ICON USED FOR LIVE VEHICLES
// ============================================================

const customVehicleIcon = (color = 'green') => {
  const fill =
    color === 'green'
      ? '#10B981'
      : color === 'yellow'
        ? '#F59E0B'
        : '#EF4444'

  const svg = `
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 11h18l-1.5-4.5A1.5 1.5 0 0 0 18 5H6a1.5 1.5 0 0 0-1.5 1.5L3 11Z"
        fill="${fill}"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        d="M5 11v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5"
        fill="${fill}"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <circle
        cx="7.5"
        cy="16"
        r="1.5"
        fill="white"
      />

      <circle
        cx="16.5"
        cy="16"
        r="1.5"
        fill="white"
      />
    </svg>
  `

  return L.icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  })
}


// ============================================================
// MAP CONTROLLERS
// ============================================================

function MapViewController({ center, zoom }) {
  const map = useMap()

  React.useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  return null
}


function MapResizeController() {
  const map = useMap()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => clearTimeout(timer)
  }, [map])

  return null
}


// ============================================================
// DASHBOARD
// ============================================================

export default function Dashboard({ onLogout }) {

  const [isDarkMode, setIsDarkMode] = React.useState(false)

  const [activeNav, setActiveNav] =
    React.useState('dashboard')

  const [hoveredLegend, setHoveredLegend] =
    React.useState(null)

  const [showAdminPortal, setShowAdminPortal] =
    React.useState(false)


  // ----------------------------------------------------------
  // REAL GEOFENCES
  // ----------------------------------------------------------

  const { geofences } = useVehicleStore()


  // ----------------------------------------------------------
  // REAL VEHICLES
  // ----------------------------------------------------------

  const [dashboardVehicles, setDashboardVehicles] =
    React.useState([])


  // ----------------------------------------------------------
  // FETCH REAL VEHICLES
  // ----------------------------------------------------------

  React.useEffect(() => {

    let mounted = true

    const loadVehicles = async () => {

      try {

        const response = await fetchVehiclesApi()

        const list =
          Array.isArray(response)
            ? response
            : response?.vehicles ||
              response?.data?.vehicles ||
              response?.data ||
              []

        const formattedVehicles = list
          .map((vehicle) => {

            const latitude =
              vehicle.currentLocation?.latitude ??
              vehicle.latitude ??
              vehicle.lat

            const longitude =
              vehicle.currentLocation?.longitude ??
              vehicle.longitude ??
              vehicle.lng

            const rawStatus =
              String(vehicle.status || '')
                .toLowerCase()
                .trim()


            let status = 'Offline'
            let color = 'red'

            if (rawStatus === 'moving') {
              status = 'Moving'
              color = 'green'
            }

            if (rawStatus === 'idle') {
              status = 'Idle'
              color = 'yellow'
            }

            if (rawStatus === 'offline') {
              status = 'Offline'
              color = 'red'
            }


            return {
              id: String(
                vehicle.id ||
                vehicle._id ||
                vehicle.vehicleNumber
              ),

              name:
                vehicle.vehicleNumber ||
                vehicle.regNo ||
                vehicle.registrationNumber ||
                vehicle.id ||
                vehicle._id ||
                'Unknown Vehicle',

              driver:
                vehicle.driverName ||
                vehicle.driver ||
                'Unknown Driver',

              lat: Number(latitude),

              lng: Number(longitude),

              speed:
                Number(
                  vehicle.latestTelemetry?.speed ??
                  vehicle.speed ??
                  0
                ),

              fuel:
                Number(
                  vehicle.latestTelemetry?.fuel ??
                  vehicle.fuel ??
                  0
                ),

              temperature:
                Number(
                  vehicle.latestTelemetry?.temperature ??
                  vehicle.temperature ??
                  0
                ),

              status,

              color
            }
          })
          .filter(
            (vehicle) =>
              Number.isFinite(vehicle.lat) &&
              Number.isFinite(vehicle.lng)
          )


        if (mounted) {
          setDashboardVehicles(formattedVehicles)
        }

      } catch (error) {

        console.error(
          'Dashboard vehicle loading failed:',
          error
        )

      }

    }


    // Initial load
    loadVehicles()


    // Refresh every 5 seconds
    const interval =
      setInterval(loadVehicles, 5000)


    return () => {

      mounted = false

      clearInterval(interval)

    }

  }, [])


  // ----------------------------------------------------------
  // MAP STATE
  // ----------------------------------------------------------

  const [
    selectedMapVehicleId,
    setSelectedMapVehicleId
  ] = React.useState('all')


  const [mapCenter, setMapCenter] =
    React.useState([28.61, 77.23])


  const [mapZoom, setMapZoom] =
    React.useState(11)


  // ----------------------------------------------------------
  // SELECT VEHICLE FROM DROPDOWN
  // ----------------------------------------------------------

  const handleSelectMapVehicle = (event) => {

    const selectedId =
      event.target.value

    setSelectedMapVehicleId(selectedId)


    if (selectedId === 'all') {

      setMapCenter([28.61, 77.23])

      setMapZoom(11)

      return

    }


    const vehicle =
      dashboardVehicles.find(
        (item) =>
          item.id === selectedId
      )


    if (vehicle) {

      setMapCenter([
        vehicle.lat,
        vehicle.lng
      ])

      setMapZoom(14)

    }

  }


  // ----------------------------------------------------------
  // DEMO ALERTS - KEEPING YOUR EXISTING ALERT UI
  // ----------------------------------------------------------

  const [
    dashboardAlerts,
    setDashboardAlerts
  ] = React.useState([
    {
      id: '1',
      title: 'Geofence Breach',
      desc: 'NH-48, Delhi',
      time: '2 min ago',
      severity: 'critical',
      type: 'geofence'
    },

    {
      id: '2',
      title: 'Speed Limit Exceeded',
      desc: 'DLF Cyber City, Gurgaon',
      time: '8 min ago',
      severity: 'warning',
      type: 'speed'
    },

    {
      id: '3',
      title: 'Vehicle Idle',
      desc: 'Sector 62, Noida',
      time: '15 min ago',
      severity: 'info',
      type: 'status'
    },

    {
      id: '4',
      title: 'Low Fuel',
      desc: 'Vehicle Alert',
      time: '26 min ago',
      severity: 'warning',
      type: 'fuel'
    },

    {
      id: '5',
      title: 'Harsh Braking',
      desc: 'NH-24, Ghaziabad',
      time: '48 min ago',
      severity: 'critical',
      type: 'alert'
    }
  ])


  const resolveDashboardAlert = (id) => {

    setDashboardAlerts(
      (previous) =>
        previous.filter(
          (alert) =>
            alert.id !== id
        )
    )

  }


  // ==========================================================
  // SIDEBAR
  // ==========================================================

  const sidebarLinks = [

    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },

    {
      id: 'live-fleet',
      label: 'Live Fleet',
      icon: MapPin
    },

    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: Car
    },

    {
      id: 'analytics',
      label: 'Analytics',
      icon: LineChart
    },

    {
      id: 'geofence',
      label: 'Geofence',
      icon: Compass
    },

    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge:
        dashboardAlerts.length > 0
          ? dashboardAlerts.length
          : null
    }

  ]


  // ==========================================================
  // REAL DASHBOARD COUNTS
  // ==========================================================

  const totalVehicles =
    dashboardVehicles.length


  const movingVehicles =
    dashboardVehicles.filter(
      (vehicle) =>
        vehicle.status === 'Moving'
    ).length


  const idleVehicles =
    dashboardVehicles.filter(
      (vehicle) =>
        vehicle.status === 'Idle'
    ).length


  const offlineVehicles =
    dashboardVehicles.filter(
      (vehicle) =>
        vehicle.status === 'Offline'
    ).length


  // ==========================================================
  // DASHBOARD STAT CARDS
  // ==========================================================

  const dashboardStatsData = [

    {
      id: 'stats-1',

      title: 'Total Vehicles',

      value:
        totalVehicles.toLocaleString(),

      trend: 'LIVE',

      trendDesc: 'from MongoDB',

      trendColor:
        'text-emerald-600 bg-emerald-50',

      icon: Car,

      iconColor:
        'text-blue-500 bg-blue-50',

      darkIconColor:
        'text-blue-400 bg-blue-950/40',

      backValue:
        `${totalVehicles} vehicles`,

      backDesc:
        'Real vehicles loaded from backend.'
    },


    {
      id: 'stats-2',

      title: 'Active Vehicles',

      value:
        movingVehicles.toLocaleString(),

      trend: 'LIVE',

      trendDesc: 'currently moving',

      trendColor:
        'text-emerald-600 bg-emerald-50',

      icon: Activity,

      iconColor:
        'text-emerald-600 bg-emerald-50',

      darkIconColor:
        'text-emerald-400 bg-emerald-950/40',

      backValue:
        `${movingVehicles} moving`,

      backDesc:
        'Based on current vehicle status.'
    },


    {
      id: 'stats-3',

      title: 'Idle Vehicles',

      value:
        idleVehicles.toLocaleString(),

      trend: 'LIVE',

      trendDesc: 'currently idle',

      trendColor:
        'text-yellow-600 bg-yellow-50',

      icon: Car,

      iconColor:
        'text-yellow-600 bg-yellow-50',

      darkIconColor:
        'text-yellow-400 bg-yellow-950/40',

      backValue:
        `${idleVehicles} idle`,

      backDesc:
        'Vehicles currently stopped but available.'
    },


    {
      id: 'stats-4',

      title: 'Offline Vehicles',

      value:
        offlineVehicles.toLocaleString(),

      trend: 'LIVE',

      trendDesc: 'currently offline',

      trendColor:
        'text-rose-600 bg-rose-50',

      icon: Car,

      iconColor:
        'text-rose-600 bg-rose-50',

      darkIconColor:
        'text-rose-400 bg-rose-950/40',

      backValue:
        `${offlineVehicles} offline`,

      backDesc:
        'Vehicles currently marked offline.'
    },


    {
      id: 'stats-5',

      title: 'Alerts',

      value:
        dashboardAlerts.length.toString(),

      trend: 'LIVE',

      trendDesc: 'active alerts',

      trendColor:
        'text-rose-600 bg-rose-50',

      icon: AlertTriangle,

      iconColor:
        'text-rose-600 bg-rose-50',

      darkIconColor:
        'text-rose-400 bg-rose-950/40',

      backValue:
        `Active: ${dashboardAlerts.length}`,

      backDesc:
        'Awaiting operator acknowledgment.'
    }

  ]


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className={`
        flex
        min-h-screen
        w-screen
        overflow-hidden
        font-sans
        transition-colors
        duration-300

        ${
          isDarkMode
            ? 'bg-slate-950 text-slate-100 dark'
            : 'bg-gradient-to-tr from-emerald-50/40 via-white to-slate-100/80 text-slate-800'
        }
      `}
    >


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          w-64
          flex
          flex-col
          justify-between
          p-5
          shrink-0
          border-r
          transition-colors
          duration-300

          ${
            isDarkMode
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/10 border-slate-800'
              : 'bg-emerald-50/60 backdrop-blur-md border-emerald-100/80'
          }
        `}
      >

        <div className="space-y-6">

          {/* Logo */}

          <div className="flex items-center gap-2 px-1">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400">

              <Zap
                className="h-5 w-5 fill-emerald-400"
              />

            </div>

            <span
              className={`
                text-xl
                font-bold
                tracking-tight

                ${
                  isDarkMode
                    ? 'text-white'
                    : 'text-emerald-950'
                }
              `}
            >
              FleetDash
            </span>

          </div>


          {/* Navigation */}

          <div className="space-y-1">

            {sidebarLinks.map((item) => {

              const IconComponent =
                item.icon

              const isActive =
                activeNav === item.id


              return (

                <button
                  key={item.id}
                  onClick={() =>
                    setActiveNav(item.id)
                  }
                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-2.5
                    text-xs
                    font-bold
                    transition-all
                    cursor-pointer

                    ${
                      isActive

                        ? isDarkMode
                          ? 'bg-slate-800 text-emerald-400 border-l-[3px] border-emerald-500 pl-[9px]'
                          : 'bg-emerald-500/10 text-emerald-800 border-l-[3px] border-emerald-500 pl-[9px]'

                        : isDarkMode
                          ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }
                  `}
                >

                  <div className="flex items-center gap-3">

                    <IconComponent
                      className={`
                        h-4 w-4

                        ${
                          isActive
                            ? 'text-emerald-500'
                            : 'text-slate-400'
                        }
                      `}
                    />

                    <span>
                      {item.label}
                    </span>

                  </div>


                  {item.badge && (

                    <span
                      className="
                        bg-rose-500
                        text-white
                        font-black
                        text-[9px]
                        rounded-full
                        px-1.5
                        py-0.5
                      "
                    >
                      {item.badge}
                    </span>

                  )}

                </button>

              )

            })}

          </div>

        </div>


        {/* Sidebar footer */}

        <div
          className="
            space-y-1.5
            border-t
            border-slate-200/60
            pt-4
          "
        >

          <button
            className={`
              w-full
              flex
              items-center
              gap-3
              rounded-lg
              px-3
              py-2.5
              text-xs
              font-bold

              ${
                isDarkMode
                  ? 'text-slate-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:bg-slate-50'
              }
            `}
          >

            <HelpCircle
              className="h-4 w-4 text-slate-400"
            />

            <span>
              Help & Support
            </span>

          </button>


          <button
            onClick={onLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              rounded-lg
              px-3
              py-2.5
              text-xs
              font-bold
              text-rose-500
              hover:bg-rose-500/10
            "
          >

            <LogOut
              className="h-4 w-4"
            />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <div
        className="
          flex-1
          flex
          flex-col
          overflow-hidden
        "
      >


        {/* ===================================================
            NAVBAR
        =================================================== */}

        <header
          className={`
            h-16
            flex
            items-center
            justify-between
            px-8
            border-b

            ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white/80 backdrop-blur-md border-slate-200/80'
            }
          `}
        >

          <div />


          <div
            className="
              flex
              items-center
              gap-5
            "
          >

            {/* Live */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-500
                  animate-pulse
                "
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                "
              >
                Live
              </span>

            </div>


            {/* Notification */}

            <button
              onClick={() =>
                setActiveNav('alerts')
              }
              className="
                relative
                p-1.5
                rounded-lg
                border
                bg-slate-50
                border-slate-200
              "
            >

              <Bell
                className="h-3.5 w-3.5"
              />

              {dashboardAlerts.length > 0 && (

                <span
                  className="
                    absolute
                    top-1
                    right-1.5
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-rose-500
                  "
                />

              )}

            </button>


            {/* Admin */}

            <button
              onClick={() =>
                setShowAdminPortal(true)
              }
              className="
                flex
                items-center
                gap-2.5
                border-l
                pl-4
              "
            >

              <div
                className="
                  h-8
                  w-8
                  rounded-full
                  bg-slate-200
                  text-slate-700
                  flex
                  items-center
                  justify-center
                  text-[10px]
                  font-black
                "
              >
                AD
              </div>

              <div className="text-left">

                <p
                  className="
                    text-xs
                    font-bold
                  "
                >
                  Admin
                </p>

                <p
                  className="
                    text-[9px]
                    text-slate-400
                    font-semibold
                  "
                >
                  Fleet Manager
                </p>

              </div>

            </button>

          </div>

        </header>


        {/* ===================================================
            DASHBOARD
        =================================================== */}

        {activeNav === 'dashboard' ? (

          <main
            className="
              flex-grow
              overflow-y-auto
              p-6
              md:p-8
              space-y-6
            "
          >


            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <h1
                className="
                  text-xl
                  font-bold
                  tracking-tight
                "
              >
                Fleet Dashboard
              </h1>


              <button
                onClick={() =>
                  setIsDarkMode(
                    !isDarkMode
                  )
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  bg-white
                  border-slate-200
                "
              >

                {isDarkMode ? (

                  <>
                    <Sun
                      className="
                        h-3.5
                        w-3.5
                        text-yellow-500
                      "
                    />

                    <span>
                      Light Theme
                    </span>
                  </>

                ) : (

                  <>
                    <Moon
                      className="
                        h-3.5
                        w-3.5
                        text-slate-500
                      "
                    />

                    <span>
                      Theme Toggle
                    </span>
                  </>

                )}

              </button>

            </div>


            {/* =================================================
                MAP
            ================================================= */}

            <div
              className="
                rounded-xl
                border
                shadow-sm
                p-4
                bg-white
                border-slate-200
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <h2
                    className="
                      text-sm
                      font-extrabold
                      uppercase
                      tracking-wider
                    "
                  >
                    Live Map
                  </h2>

                  <span
                    className="
                      flex
                      items-center
                      gap-1
                      rounded
                      bg-emerald-500/10
                      border
                      border-emerald-500/20
                      px-1.5
                      py-0.5
                      text-[9px]
                      font-bold
                      text-emerald-500
                    "
                  >

                    <span
                      className="
                        h-1
                        w-1
                        rounded-full
                        bg-emerald-500
                        animate-pulse
                      "
                    />

                    Live

                  </span>

                </div>


                {/* Vehicle selector */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <select
                    value={
                      selectedMapVehicleId
                    }
                    onChange={
                      handleSelectMapVehicle
                    }
                    className="
                      text-xs
                      border
                      rounded-lg
                      px-2.5
                      py-1
                      bg-slate-50
                      border-slate-200
                    "
                  >

                    <option value="all">
                      All Vehicles
                    </option>


                    {dashboardVehicles.map(
                      (vehicle) => (

                        <option
                          key={vehicle.id}
                          value={vehicle.id}
                        >
                          {vehicle.name}
                        </option>

                      )
                    )}

                  </select>


                  <button
                    className="
                      p-1
                      rounded
                      border
                      bg-slate-50
                      border-slate-200
                    "
                  >

                    <Maximize2
                      className="
                        h-3.5
                        w-3.5
                      "
                    />

                  </button>

                </div>

              </div>


              {/* Map */}

              <div
                className="
                  h-[300px]
                  rounded-lg
                  border
                  border-slate-200
                  overflow-hidden
                  relative
                "
              >

                <style>{`

                  .leaflet-container img {
                    max-width: none !important;
                    max-height: none !important;
                  }

                  .dashboard-car-marker {
                    background: transparent !important;
                    border: none !important;
                  }

                `}</style>


                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  className="h-full w-full"
                >

                  <MapViewController
                    center={mapCenter}
                    zoom={mapZoom}
                  />

                  <MapResizeController />


                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />


                  {/* =========================================
                      REAL GEOFENCES
                  ========================================= */}

                  {geofences.map(
                    (geofence) => {

                      if (
                        geofence.lat == null ||
                        geofence.lng == null
                      ) {
                        return null
                      }

                      return (

                        <Circle
                          key={geofence.id}
                          center={[
                            Number(
                              geofence.lat
                            ),
                            Number(
                              geofence.lng
                            )
                          ]}
                          radius={
                            geofence.radius ||
                            1500
                          }
                          pathOptions={{
                            color:
                              geofence.type ===
                              'restricted'
                                ? '#f43f5e'
                                : '#10b981',

                            fillColor:
                              geofence.type ===
                              'restricted'
                                ? '#f43f5e'
                                : '#10b981',

                            fillOpacity: 0.07,

                            weight: 1.5
                          }}
                        />

                      )

                    }
                  )}


                  {/* =========================================
                      REAL VEHICLES
                  ========================================= */}

                  {dashboardVehicles.map(
                    (vehicle) => {

                      const isSelected =
                        selectedMapVehicleId ===
                        vehicle.id


                      return (

                        <Marker
                          key={vehicle.id}
                          position={[
                            vehicle.lat,
                            vehicle.lng
                          ]}
                          icon={
                            customVehicleIcon(
                              vehicle.color
                            )
                          }
                          zIndexOffset={
                            isSelected
                              ? 1000
                              : 0
                          }
                        >

                          <Popup>

                            <div
                              className="
                                text-left
                                font-sans
                                text-xs
                                leading-normal
                              "
                            >

                              <p
                                className="
                                  font-extrabold
                                  text-emerald-800
                                "
                              >
                                {vehicle.name}
                              </p>


                              <p
                                className="
                                  text-[10px]
                                  text-slate-500
                                "
                              >
                                Driver:{' '}
                                {vehicle.driver}
                              </p>


                              <p
                                className="
                                  text-[10px]
                                  text-slate-500
                                "
                              >
                                Speed:{' '}
                                {vehicle.speed}{' '}
                                km/h
                              </p>


                              <p
                                className="
                                  text-[10px]
                                  text-slate-500
                                  font-bold
                                "
                              >
                                Status:{' '}

                                <span
                                  className={
                                    vehicle.status ===
                                    'Moving'
                                      ? 'text-emerald-600'
                                      : vehicle.status ===
                                        'Idle'
                                        ? 'text-yellow-600'
                                        : 'text-rose-600'
                                  }
                                >
                                  {vehicle.status}
                                </span>

                              </p>


                              <p
                                className="
                                  text-[10px]
                                  text-slate-500
                                "
                              >
                                Fuel:{' '}
                                {vehicle.fuel}%
                              </p>

                            </div>

                          </Popup>

                        </Marker>

                      )

                    }
                  )}

                </MapContainer>

              </div>

            </div>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-5
                gap-5
              "
            >

              {dashboardStatsData.map(
                (card) => {

                  const IconComponent =
                    card.icon

                  return (

                    <div
                      key={card.id}
                      className="
                        group
                        h-24
                        cursor-pointer
                      "
                    >

                      <div
                        className="
                          relative
                          w-full
                          h-full
                        "
                      >

                        <div
                          className="
                            absolute
                            inset-0
                            rounded-xl
                            border
                            p-4
                            flex
                            flex-col
                            justify-between
                            bg-white
                            border-slate-200
                            shadow-sm
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <span
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-400
                              "
                            >
                              {card.title}
                            </span>


                            <div
                              className={`
                                rounded-lg
                                p-1.5
                                ${card.iconColor}
                              `}
                            >

                              <IconComponent
                                className="
                                  h-4
                                  w-4
                                "
                              />

                            </div>

                          </div>


                          <div
                            className="
                              flex
                              items-baseline
                              justify-between
                            "
                          >

                            <span
                              className="
                                text-xl
                                font-extrabold
                              "
                            >
                              {card.value}
                            </span>


                            <span
                              className={`
                                text-[8px]
                                font-extrabold
                                px-1.5
                                py-0.5
                                rounded
                                ${card.trendColor}
                              `}
                            >
                              {card.trend}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  )

                }
              )}

            </div>


            {/* =================================================
                LOWER DASHBOARD
            ================================================= */}

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-3
                gap-6
              "
            >

              <FleetStatus
                isDarkMode={isDarkMode}
                hoveredLegend={
                  hoveredLegend
                }
                setHoveredLegend={
                  setHoveredLegend
                }
                onViewAll={() =>
                  setActiveNav(
                    'vehicles'
                  )
                }
              />


              <RecentAlerts
                alerts={
                  dashboardAlerts
                }
                onResolve={
                  resolveDashboardAlert
                }
                isDarkMode={
                  isDarkMode
                }
                onViewAll={() =>
                  setActiveNav(
                    'alerts'
                  )
                }
              />


              <SystemHealth
                isDarkMode={
                  isDarkMode
                }
              />

            </div>


            {/* Footer */}

            <footer
              className="
                flex
                items-center
                justify-between
                text-[10px]
                font-bold
                border-t
                pt-4
                border-slate-200
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <RefreshCw
                  className="
                    h-3
                    w-3
                  "
                />

                <span>
                  Live vehicle data
                </span>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-500
                  "
                />

                <span>
                  Fleet connected
                </span>

              </div>

            </footer>

          </main>


        ) : activeNav === 'vehicles' ? (

          <Vehicles
            isDarkMode={
              isDarkMode
            }
          />


        ) : activeNav === 'geofence' ? (

          <Geofences
            isDarkMode={
              isDarkMode
            }
          />


        ) : activeNav === 'analytics' ? (

          <Analytics
            isDarkMode={
              isDarkMode
            }
          />


        ) : activeNav === 'alerts' ? (

          <Alerts
            isDarkMode={
              isDarkMode
            }
          />


        ) : (

          <Fleet
            isDarkMode={
              isDarkMode
            }
          />

        )}


      </div>


      {/* =====================================================
          ADMIN MODAL
      ===================================================== */}

      {showAdminPortal && (

        <div
          className="
            fixed
            inset-0
            bg-black/60
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >

          <div
            className="
              rounded-xl
              border
              shadow-xl
              max-w-md
              w-full
              p-6
              bg-white
              border-slate-200
              relative
            "
          >

            {/* Close */}

            <button
              onClick={() =>
                setShowAdminPortal(
                  false
                )
              }
              className="
                absolute
                right-4
                top-4
                rounded-full
                p-1
                text-slate-400
                hover:bg-slate-100
              "
            >

              <X
                className="
                  h-4
                  w-4
                "
              />

            </button>


            {/* Title */}

            <div
              className="
                border-b
                pb-4
                mb-4
              "
            >

              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  text-emerald-600
                  tracking-wider
                "
              >
                Security Access Control
              </span>


              <h3
                className="
                  text-base
                  font-black
                  tracking-tight
                  mt-0.5
                "
              >
                Admin Management Portal
              </h3>

            </div>


            {/* Profile */}

            <div
              className="
                flex
                items-center
                gap-4
                mb-6
              "
            >

              <div
                className="
                  h-16
                  w-16
                  rounded-full
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                  text-emerald-600
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-black
                "
              >
                AD
              </div>


              <div>

                <h4
                  className="
                    text-sm
                    font-black
                  "
                >
                  Admin Fleet Manager
                </h4>


                <p
                  className="
                    text-[10px]
                    text-emerald-600
                    font-extrabold
                    uppercase
                    mt-0.5
                  "
                >
                  Systems Administrator
                </p>


                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    mt-1.5
                    px-2
                    py-0.5
                    rounded
                    bg-emerald-500/10
                    text-[9px]
                    font-bold
                    text-emerald-600
                  "
                >

                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-emerald-500
                    "
                  />

                  Active Session

                </span>

              </div>

            </div>


            {/* Details */}

            <div
              className="
                space-y-4
                text-xs
                font-semibold
              "
            >

              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                "
              >

                <div>

                  <span
                    className="
                      text-slate-400
                      font-bold
                      uppercase
                      text-[9px]
                      block
                    "
                  >
                    Username
                  </span>

                  <span
                    className="
                      font-black
                    "
                  >
                    admin_fleet
                  </span>

                </div>


                <div>

                  <span
                    className="
                      text-slate-400
                      font-bold
                      uppercase
                      text-[9px]
                      block
                    "
                  >
                    Email
                  </span>

                  <span
                    className="
                      font-black
                    "
                  >
                    admin@fleetdash.com
                  </span>

                </div>

              </div>


              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                "
              >

                <div>

                  <span
                    className="
                      text-slate-400
                      font-bold
                      uppercase
                      text-[9px]
                      block
                    "
                  >
                    Department
                  </span>

                  <span
                    className="
                      font-black
                    "
                  >
                    Logistics & Fleet Ops
                  </span>

                </div>


                <div>

                  <span
                    className="
                      text-slate-400
                      font-bold
                      uppercase
                      text-[9px]
                      block
                    "
                  >
                    Assigned Hub
                  </span>

                  <span
                    className="
                      font-black
                    "
                  >
                    Agra Corridor (NH-19)
                  </span>

                </div>

              </div>


              <div
                className="
                  border-t
                  pt-4
                "
              >

                <span
                  className="
                    text-slate-400
                    font-bold
                    uppercase
                    text-[9px]
                    block
                    mb-1
                  "
                >
                  Access Level Permissions
                </span>


                <div
                  className="
                    flex
                    flex-wrap
                    gap-1.5
                  "
                >

                  {[
                    'Read Telemetry',
                    'Manage Geofences',
                    'Edit Vehicles',
                    'Acknowledge Alerts'
                  ].map(
                    (permission) => (

                      <span
                        key={permission}
                        className="
                          px-2
                          py-0.5
                          rounded
                          bg-slate-100
                          border
                          border-slate-200
                          text-slate-500
                          font-bold
                          text-[9px]
                        "
                      >
                        {permission}
                      </span>

                    )
                  )}

                </div>

              </div>

            </div>


            {/* Close */}

            <div
              className="
                flex
                justify-end
                pt-5
                mt-6
                border-t
              "
            >

              <button
                onClick={() =>
                  setShowAdminPortal(
                    false
                  )
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  text-xs
                  font-bold
                "
              >
                Close Portal
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}