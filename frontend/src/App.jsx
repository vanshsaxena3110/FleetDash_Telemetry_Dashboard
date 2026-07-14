import React from 'react'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  if (!isLoggedIn) {
    return <Home onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  return <Dashboard onLogout={() => setIsLoggedIn(false)} />
}

export default App
