import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🚀 Multi-Agent Delivery System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced AI-powered delivery management system supporting both intra-city and inter-city logistics operations
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {/* Customer Access */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer</h3>
            <p className="text-gray-600 mb-6">
              Create orders, track deliveries, and manage your shipments
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Customer Login
              </Link>
              <Link
                to="/register"
                className="block w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Driver Access */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Driver</h3>
            <p className="text-gray-600 mb-6">
              Accept assignments, track routes, and manage deliveries
            </p>
            <div className="space-y-3">
              <Link
                to="/driver/login"
                className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                Driver Login
              </Link>
              <Link
                to="/driver/enhanced"
                className="block w-full border border-green-600 text-green-600 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors text-sm"
              >
                Enhanced Driver App
              </Link>
              <div className="text-sm text-gray-500">
                Test: driver@example.com / driver123
              </div>
            </div>
          </div>

          {/* Admin Access */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin</h3>
            <p className="text-gray-600 mb-6">
              Monitor system, manage drivers, and view analytics
            </p>
            <div className="space-y-3">
              <Link
                to="/admin/login"
                className="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Admin Login
              </Link>
              <Link
                to="/admin/super"
                className="block w-full border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors text-sm"
              >
                Super Admin Dashboard
              </Link>
              <div className="text-sm text-gray-500">
                Test: admin / admin123
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">System Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl mb-3">📍</div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time GPS Tracking</h4>
              <p className="text-gray-600 text-sm">Live location monitoring and route optimization</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">🏢</div>
              <h4 className="font-semibold text-gray-900 mb-2">Warehouse Management</h4>
              <p className="text-gray-600 text-sm">Automated sorting and inter-city logistics</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">🔔</div>
              <h4 className="font-semibold text-gray-900 mb-2">Multi-channel Notifications</h4>
              <p className="text-gray-600 text-sm">Real-time updates via WebSocket, email, and SMS</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Agents</h4>
              <p className="text-gray-600 text-sm">Intelligent routing and assignment algorithms</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="font-semibold text-gray-900 mb-2">Inter-city Delivery</h4>
              <p className="text-gray-600 text-sm">Cross-city logistics with multiple transport modes</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold text-gray-900 mb-2">Analytics Dashboard</h4>
              <p className="text-gray-600 text-sm">Performance metrics and delivery insights</p>
            </div>
          </div>
        </div>

        {/* Supported Cities */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Supported Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {['Casablanca', 'Rabat', 'Marrakech', 'El Jadida', 'Salé', 'Agadir'].map((city) => (
              <div key={city} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🏙️</div>
                <div className="font-medium text-gray-900">{city}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;