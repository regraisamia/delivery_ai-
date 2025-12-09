import { Link, useNavigate } from 'react-router-dom'
import { Package, Plus, Search, Activity, LogOut, Truck, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const driver = JSON.parse(localStorage.getItem('driver') || '{}')
  const isDriver = !!localStorage.getItem('driver_token')
  
  const handleLogout = () => {
    if (isDriver) {
      localStorage.removeItem('driver_token')
      localStorage.removeItem('driver')
      navigate('/driver/login')
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/')
    }
  }

  const navItems = isDriver ? [
    { to: '/driver/dashboard', icon: Truck, label: 'My Deliveries' }
  ] : [
    { to: '/dashboard', icon: Package, label: 'Dashboard' },
    { to: '/create', icon: Plus, label: 'Local Order' },
    { to: '/create-inter-city', icon: Truck, label: 'Inter-City Order' },
    { to: '/track', icon: Search, label: 'Track' },
    ...(user.role === 'admin' || user.role === 'employee' ? [
      { to: '/agents', icon: Activity, label: 'Agents' }
    ] : [])
  ]

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isDriver ? '/driver/dashboard' : '/dashboard'} className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DeliveryAI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="font-semibold text-sm">{isDriver ? driver.name : user.full_name}</div>
              <div className="text-xs text-gray-500 capitalize">{isDriver ? 'Driver' : user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-up">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
