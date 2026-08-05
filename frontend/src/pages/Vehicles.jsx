import React from 'react'
import {
  Car,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  MapPin,
  Gauge,
  Droplet,
  Power,
  ChevronRight,
  Activity,
  X,
  RefreshCw,
  Loader2
} from 'lucide-react'
import VehicleTable from '../components/VehicleTable.jsx'
import VehicleDetails from '../components/VehicleDetails.jsx'
import {
  fetchVehiclesApi,
  createVehicleApi,
  updateVehicleApi,
  deleteVehicleApi
} from '../services/api.js'

// Map a backend-formatted vehicle → frontend-friendly shape
// (backend already calls formatVehicle() so fields are pre-mapped)
function mapVehicle(v) {
  return {
    id: v.id || v._id,
    name: v.regNo || v.vehicleNumber || '—',          // vehicleNumber used as display name
    regNo: v.regNo || v.vehicleNumber || '—',
    driver: v.driver || v.driverName || 'Not assigned',
    driverContact: v.driverContact || '—',
    type: v.type ? v.type.charAt(0).toUpperCase() + v.type.slice(1) : 'Truck',
    status: v.status || 'offline',
    speed: v.speed ?? 0,
    fuel: v.fuel ?? 0,
    engineStatus: v.engineStatus === 'on' ? 'ON' : 'OFF',
    temp: v.temp ?? null,
    voltage: v.voltage != null ? `${v.voltage} V` : '—',
    distance: v.distance != null ? `${v.distance} km` : '—',
    location: v.latitude ? `${Number(v.latitude).toFixed(4)}, ${Number(v.longitude).toFixed(4)}` : 'No GPS data',
    time: v.updatedAt ? new Date(v.updatedAt).toLocaleTimeString() : '—'
  }
}

const EMPTY_FORM = {
  vehicleNumber: '',
  driverName: '',
  driverContact: '',
  type: 'truck'
}

export default function Vehicles({ isDarkMode = false }) {
  const [vehicles, setVehicles] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [selectedVehicle, setSelectedVehicle] = React.useState(null)

  // Add Vehicle modal state
  const [showModal, setShowModal] = React.useState(false)
  const [form, setForm] = React.useState(EMPTY_FORM)
  const [saving, setSaving] = React.useState(false)
  const [formError, setFormError] = React.useState(null)

  // Edit Vehicle modal state
  const [editVehicle, setEditVehicle] = React.useState(null)
  const [editForm, setEditForm] = React.useState(EMPTY_FORM)
  const [editSaving, setEditSaving] = React.useState(false)
  const [editError, setEditError] = React.useState(null)

  // Load vehicles from backend
  const loadVehicles = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchVehiclesApi()
      // Backend returns { vehicles: [...] } or array directly
      const list = Array.isArray(data) ? data : (data.vehicles || [])
      setVehicles(list.map(mapVehicle))
      if (!selectedVehicle && list.length > 0) {
        setSelectedVehicle(mapVehicle(list[0]))
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadVehicles()
  }, [loadVehicles])

  // Derived stats
  const total = vehicles.length
  const moving = vehicles.filter(v => v.status === 'moving').length
  const idle = vehicles.filter(v => v.status === 'idle').length
  const offline = vehicles.filter(v => v.status === 'offline').length

  // Add Vehicle submit
  const handleAddVehicle = async (e) => {
    e.preventDefault()
    if (!form.vehicleNumber.trim()) {
      setFormError('Vehicle number is required')
      return
    }
    try {
      setSaving(true)
      setFormError(null)
      await createVehicleApi(form)
      setShowModal(false)
      setForm(EMPTY_FORM)
      await loadVehicles()
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to create vehicle')
    } finally {
      setSaving(false)
    }
  }

  // Delete vehicle
  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Delete this vehicle? This cannot be undone.')) return
    try {
      await deleteVehicleApi(vehicleId)
      if (selectedVehicle?.id === vehicleId) setSelectedVehicle(null)
      await loadVehicles()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete vehicle')
    }
  }

  // Open edit modal
  const handleEdit = (v) => {
    setEditVehicle(v)
    setEditForm({
      vehicleNumber: v.name,
      driverName: v.driver === 'Not assigned' ? '' : v.driver,
      driverContact: v.driverContact === '—' ? '' : v.driverContact,
      type: v.type.toLowerCase()
    })
    setEditError(null)
  }

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      setEditSaving(true)
      setEditError(null)
      await updateVehicleApi(editVehicle.id, editForm)
      setEditVehicle(null)
      await loadVehicles()
    } catch (err) {
      setEditError(err?.response?.data?.message || 'Failed to update vehicle')
    } finally {
      setEditSaving(false)
    }
  }

  const inputCls = `w-full border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none transition-all ${
    isDarkMode
      ? 'bg-slate-950 border-slate-700 text-slate-200 focus:border-emerald-500/60 placeholder:text-slate-600'
      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/60 placeholder:text-slate-400'
  }`
  const labelCls = `block text-[10px] font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`

  return (
    <div className="overflow-y-auto p-6 md:p-8 flex flex-col gap-6 text-left bg-transparent">

      {/* Header Row */}
      <div className="flex items-center justify-between select-none">
        <div>
          <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vehicles</h1>
          <p className="text-[11px] text-slate-500 font-bold mt-0.5">Monitor and manage your fleet vehicles</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setFormError(null); setForm(EMPTY_FORM) }}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all px-3 py-1.5 text-xs font-bold text-white cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-400">
          ⚠️ {error} —{' '}
          <button onClick={loadVehicles} className="underline cursor-pointer">Retry</button>
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">

        <div className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'}`}>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">Total Vehicles</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{loading ? '—' : total}</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center"><TrendingUp className="h-3 w-3 mr-0.5" />Fleet</span>
            </div>
          </div>
          <div className="rounded-full p-2 bg-slate-50 border border-slate-100 text-slate-500 dark:bg-slate-950 dark:border-slate-850"><Car className="h-5 w-5" /></div>
        </div>

        <div className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'}`}>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">Moving</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{loading ? '—' : moving}</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center"><TrendingUp className="h-3 w-3 mr-0.5" />Active</span>
            </div>
          </div>
          <div className="rounded-full p-2 bg-emerald-50 border border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-950/40"><Activity className="h-5 w-5" /></div>
        </div>

        <div className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'}`}>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">Idle</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{loading ? '—' : idle}</span>
              <span className="text-[10px] font-bold text-yellow-600 flex items-center"><TrendingDown className="h-3 w-3 mr-0.5" />Parked</span>
            </div>
          </div>
          <div className="rounded-full p-2 bg-yellow-50 border border-yellow-100 text-yellow-600 dark:bg-yellow-950/20 dark:border-yellow-950/40"><Clock className="h-5 w-5" /></div>
        </div>

        <div className={`rounded-xl border p-4.5 shadow-sm transition-all flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-250'}`}>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500">Offline</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{loading ? '—' : offline}</span>
              <span className="text-[10px] font-bold text-rose-600 flex items-center"><TrendingDown className="h-3 w-3 mr-0.5" />Down</span>
            </div>
          </div>
          <div className="rounded-full p-2 bg-rose-50 border border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-950/40"><AlertCircle className="h-5 w-5" /></div>
        </div>

      </div>

      {/* Loading state */}
      {loading && (
        <div className={`flex flex-col items-center justify-center gap-3 py-16 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <Loader2 className="h-7 w-7 text-emerald-500 animate-spin" />
          <p className="text-xs font-bold text-slate-400">Loading vehicles from server…</p>
        </div>
      )}

      {/* Main Table + Side Details Layout */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
          <div className="lg:col-span-7">
            <VehicleTable
              vehicles={vehicles}
              activeVehicleId={selectedVehicle?.id || null}
              onSelectVehicle={setSelectedVehicle}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onRefresh={loadVehicles}
              isDarkMode={isDarkMode}
            />
          </div>
          <div className="lg:col-span-3">
            <VehicleDetails
              vehicle={selectedVehicle}
              onClose={() => setSelectedVehicle(null)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && vehicles.length === 0 && !error && (
        <div className={`flex flex-col items-center justify-center gap-3 py-16 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
          <Car className="h-10 w-10 opacity-30" />
          <p className="text-xs font-bold">No vehicles in your fleet yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add your first vehicle
          </button>
        </div>
      )}

      {/* ── Add Vehicle Modal ───────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add New Vehicle</h2>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Register a vehicle to your fleet</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddVehicle} className="px-6 py-5 space-y-4">
              {formError && (
                <p className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2">
                  ⚠️ {formError}
                </p>
              )}
              <div>
                <label className={labelCls}>Vehicle Number <span className="text-rose-500">*</span></label>
                <input
                  className={inputCls}
                  placeholder="e.g. MH01AB1234"
                  value={form.vehicleNumber}
                  onChange={e => setForm(f => ({ ...f, vehicleNumber: e.target.value.toUpperCase() }))}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Driver Name</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Rahul Sharma"
                  value={form.driverName}
                  onChange={e => setForm(f => ({ ...f, driverName: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Driver Contact</label>
                <input
                  className={inputCls}
                  placeholder="e.g. +91 98765 43210"
                  value={form.driverContact}
                  onChange={e => setForm(f => ({ ...f, driverContact: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Vehicle Type</label>
                <select
                  className={inputCls}
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold border cursor-pointer transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  {saving ? 'Adding…' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Vehicle Modal ──────────────────────────────────── */}
      {editVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit Vehicle</h2>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{editVehicle.name}</p>
              </div>
              <button onClick={() => setEditVehicle(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-4">
              {editError && (
                <p className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2">
                  ⚠️ {editError}
                </p>
              )}
              <div>
                <label className={labelCls}>Vehicle Number</label>
                <input
                  className={inputCls}
                  value={editForm.vehicleNumber}
                  onChange={e => setEditForm(f => ({ ...f, vehicleNumber: e.target.value.toUpperCase() }))}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Driver Name</label>
                <input
                  className={inputCls}
                  value={editForm.driverName}
                  onChange={e => setEditForm(f => ({ ...f, driverName: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Driver Contact</label>
                <input
                  className={inputCls}
                  value={editForm.driverContact}
                  onChange={e => setEditForm(f => ({ ...f, driverContact: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Vehicle Type</label>
                <select
                  className={inputCls}
                  value={editForm.type}
                  onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditVehicle(null)}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold border cursor-pointer transition-all ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all disabled:opacity-60"
                >
                  {editSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  {editSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
