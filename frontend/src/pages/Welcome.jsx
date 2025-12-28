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
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full inline-block mb-4">
            <span className="font-bold text-lg">ULTIMATE VERSION 3.0</span> - Multi-Driver Intelligence
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced AI-powered delivery system with <strong>16 drivers</strong> across 6 cities and intelligent assignment algorithms
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/system/coverage"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>📊</span>
              <span>View Ultimate Coverage</span>
            </Link>
            <a
              href="http://localhost:8001/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <span>📚</span>
              <span>API Documentation</span>
            </a>
            <a
              href="http://localhost:8001/api/assignment/simulate?pickup_city=Casablanca&weight=2.0"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <span>🎯</span>
              <span>Test Assignment</span>
            </a>
          </div>
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

        {/* Ultimate Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Ultimate System Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-2">Multi-Driver Intelligence</h4>
              <p className="text-gray-600 text-sm">16 drivers with AI-powered assignment based on location, vehicle, and specialties</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl mb-3">📍</div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time GPS Scoring</h4>
              <p className="text-gray-600 text-sm">Exact distance calculation from driver's current location to pickup point</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl mb-3">🚗</div>
              <h4 className="font-semibold text-gray-900 mb-2">Vehicle Optimization</h4>
              <p className="text-gray-600 text-sm">Smart matching of vehicle type to package requirements and service level</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-3xl mb-3">⭐</div>
              <h4 className="font-semibold text-gray-900 mb-2">Rating-Based Selection</h4>
              <p className="text-gray-600 text-sm">Driver performance and customer satisfaction scores influence assignment</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
              <div className="text-3xl mb-3">🎪</div>
              <h4 className="font-semibold text-gray-900 mb-2">Specialty Matching</h4>
              <p className="text-gray-600 text-sm">Express, fragile, heavy cargo, and inter-city delivery specialists</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold text-gray-900 mb-2">Load Balancing</h4>
              <p className="text-gray-600 text-sm">Intelligent workload distribution across available drivers</p>
            </div>
          </div>
        </div>

        {/* Ultimate City Coverage */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">🏙️ Ultimate City Coverage (16 Drivers)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center border-2 border-blue-200">
              <div className="text-3xl mb-3">🏙️</div>
              <div className="font-bold text-xl text-gray-900">Casablanca</div>
              <div className="text-blue-600 font-semibold">4 Drivers</div>
              <div className="text-sm text-gray-600 mt-2">
                Ahmed (Bike) • Youssef (Car)<br/>
                Fatima (Scooter) • Karim (Van)
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center border-2 border-green-200">
              <div className="text-3xl mb-3">🏙️</div>
              <div className="font-bold text-xl text-gray-900">Rabat</div>
              <div className="text-green-600 font-semibold">3 Drivers</div>
              <div className="text-sm text-gray-600 mt-2">
                Laila (Car) • Omar (Bike)<br/>
                Nadia (Scooter)
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg text-center border-2 border-purple-200">
              <div className="text-3xl mb-3">🏙️</div>
              <div className="font-bold text-xl text-gray-900">Marrakech</div>
              <div className="text-purple-600 font-semibold">3 Drivers</div>
              <div className="text-sm text-gray-600 mt-2">
                Hassan (Car) • Aicha (Bike)<br/>
                Rachid (Van)
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg text-center border-2 border-orange-200">
              <div className="text-3xl mb-3">🏙️</div>
              <div className="font-bold text-xl text-gray-900">Agadir</div>
              <div className="text-orange-600 font-semibold">2 Drivers</div>
              <div className="text-sm text-gray-600 mt-2">
                Khadija (Van) • Mehdi (Car)
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg text-center border-2 border-yellow-200">
              <div className="text-3xl mb-3">🏙️</div>
              <div className="font-bold text-xl text-gray-900">El Jadida</div>
              <div className="text-yellow-600 font-semibold">2 Drivers</div>
              <div className="text-sm text-gray-600 mt-2">
                Zineb (Bike) • Samir (Scooter)
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg text-center border-2 border-red-200">
              <div className="text-3xl mb-3">🏙️</div>
              <div className="font-bold text-xl text-gray-900">Salé</div>
              <div className="text-red-600 font-semibold">2 Drivers</div>
              <div className="text-sm text-gray-600 mt-2">
                Amina (Car) • Khalid (Bike)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;