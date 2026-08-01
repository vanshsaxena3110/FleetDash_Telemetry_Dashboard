import React from 'react'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { logoutApi } from './services/api.js'

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    return Boolean(localStorage.getItem('token'))
  })

  const handleLogout = () => {
    logoutApi()
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <Home onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  return <Dashboard onLogout={handleLogout} />
}

export default App
