import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import Navbar from './components/Navbar'
import LoadingScreen from './components/LoadingScreen'

// Direct imports instead of lazy loading to prevent blank pages
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
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import SystemCoverage from './pages/SystemCoverage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 0,
      cacheTime: 0,
    },
  },
})

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function DriverProtectedRoute({ children }) {
  const token = localStorage.getItem('driver_token')
  return token ? children : <Navigate to="/driver/login" />
}

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token')
  return token ? children : <Navigate to="/admin/login" />
}

function App() {
  try {
    // Clear invalid tokens
    ['token', 'driver_token', 'admin_token'].forEach(key => {
      const token = localStorage.getItem(key)
      if (token === 'undefined' || token === 'null') {
        localStorage.removeItem(key)
      }
    })
    
    const isAuthenticated = !!localStorage.getItem('token') || !!localStorage.getItem('driver_token') || !!localStorage.getItem('admin_token')

    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {isAuthenticated && <Navbar />}

            <main>
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
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                  <Route path="/admin/super" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                  <Route path="/system/coverage" element={<SystemCoverage />} />
                  <Route path="/driver/enhanced" element={<DriverProtectedRoute><DriverDashboard /></DriverProtectedRoute>} />
                </Routes>
              </div>
            </main>
          </div>
        </Router>
      </QueryClientProvider>
    )
  } catch (error) {
    console.error('App error:', error)
    return <div className="p-4 text-red-600">Application Error. Please refresh the page.</div>
  }
}

export default App
