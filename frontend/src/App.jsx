import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import Navbar from './components/Navbar'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateOrder from './pages/CreateOrder'
import CreateInterCityOrder from './pages/CreateInterCityOrder'
import TrackOrder from './pages/TrackOrder'
import AgentMonitor from './pages/AgentMonitor'
import DriverDashboard from './pages/DriverDashboard'
import DriverLogin from './pages/DriverLogin'

const queryClient = new QueryClient()

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function DriverProtectedRoute({ children }) {
  const token = localStorage.getItem('driver_token')
  return token ? children : <Navigate to="/driver/login" />
}

function App() {
  const isAuthenticated = !!localStorage.getItem('token') || !!localStorage.getItem('driver_token')

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {isAuthenticated && <Navbar />}

          <main className={isAuthenticated ? "" : ""}>
            <div className={isAuthenticated ? "max-w-7xl mx-auto px-4 py-8" : ""}>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreateOrder /></ProtectedRoute>} />
                <Route path="/create-inter-city" element={<ProtectedRoute><CreateInterCityOrder /></ProtectedRoute>} />
                <Route path="/track" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
                <Route path="/agents" element={<ProtectedRoute><AgentMonitor /></ProtectedRoute>} />
                <Route path="/driver/login" element={<DriverLogin />} />
                <Route path="/driver/dashboard" element={<DriverProtectedRoute><DriverDashboard /></DriverProtectedRoute>} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
