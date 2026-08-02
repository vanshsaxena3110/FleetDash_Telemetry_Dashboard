import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:3000'

let socket = null

/**
 * Initialize the Socket.IO connection.
 * Call this once after a successful login.
 */
export const connectSocket = () => {
  if (socket && socket.connected) return socket

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
  })

  socket.on('connect', () => {
    console.log('🟢 Socket connected:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('🔴 Socket disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.warn('⚠️ Socket connection error:', err.message)
  })

  return socket
}

/**
 * Disconnect and clean up the Socket.IO connection.
 * Call this on logout.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log('Socket disconnected and cleaned up.')
  }
}

/**
 * Get the current socket instance.
 * Returns null if not connected.
 */
export const getSocket = () => socket

/**
 * Subscribe to live telemetry updates.
 * Callback receives: { telemetry, vehicle }
 */
export const onTelemetryUpdate = (callback) => {
  if (!socket) return
  socket.on('telemetry_update', callback)
}

/**
 * Subscribe to new alert events.
 * Callback receives the alert object.
 */
export const onNewAlert = (callback) => {
  if (!socket) return
  socket.on('new_alert', callback)
}

/**
 * Remove a specific event listener.
 */
export const offSocketEvent = (event, callback) => {
  if (!socket) return
  socket.off(event, callback)
}

export default { connectSocket, disconnectSocket, getSocket, onTelemetryUpdate, onNewAlert, offSocketEvent }
