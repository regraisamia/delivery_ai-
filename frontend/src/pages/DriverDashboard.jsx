import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import { api } from '../services/api'
import { MapPin, Navigation, Package, Play, CheckCircle } from 'lucide-react'
import StaticRouteMap from '../components/StaticRouteMap'

export default function DriverDashboard() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      document.head.appendChild(link)
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    if (!document.querySelector('script[src*="leaflet.js"]')) {
      document.body.appendChild(script)
    }
  }, [])
  const courierId = 1 // Hardcoded for simulation
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)

  const [currentOrder, setCurrentOrder] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:8000/api/couriers/${courierId}/active-order`)
      .then(res => res.json())
      .then(data => setCurrentOrder(data.order))
  }, [])

  const refetch = () => {
    fetch(`http://localhost:8000/api/couriers/${courierId}/active-order`)
      .then(res => res.json())
      .then(data => setCurrentOrder(data.order))
  }

  const acceptOrder = (orderId) => {
    fetch(`http://localhost:8000/api/couriers/${courierId}/accept/${orderId}`, { method: 'POST' })
      .then(() => refetch())
  }

  const completeOrder = (orderId) => {
    fetch(`http://localhost:8000/api/couriers/${courierId}/complete/${orderId}`, { method: 'POST' })
      .then(() => refetch())
  }

  const startSimulation = () => {
    if (!currentOrder) return
    
    setIsSimulating(true)
    const order = currentOrder
    const routeCoords = order.route_geometry
    
    if (!routeCoords || routeCoords.length === 0) {
      alert('No route available for this order')
      setIsSimulating(false)
      return
    }
    
    // Calculate timing based on route_duration (in seconds)
    const estimatedDuration = order.route_duration || 600 // Default 10 min
    const totalPoints = routeCoords.length
    const updateInterval = 1000 // Update every 1 second for smooth movement
    const totalUpdates = estimatedDuration // One update per second
    const pointsPerUpdate = Math.max(1, Math.floor(totalPoints / totalUpdates))
    
    let currentIndex = 0
    
    const interval = setInterval(() => {
      if (currentIndex >= totalPoints) {
        clearInterval(interval)
        setIsSimulating(false)
        setSimulationProgress(100)
        return
      }
      
      const [lng, lat] = routeCoords[currentIndex]
      const progress = Math.round((currentIndex / totalPoints) * 100)
      setSimulationProgress(progress)
      
      // Update location
      fetch(`http://localhost:8000/api/couriers/${courierId}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      })
      
      currentIndex += pointsPerUpdate
    }, updateInterval)
  }

  const order = currentOrder

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-8">
        Driver Dashboard
      </h1>

      {!order ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Deliveries</h2>
          <p className="text-gray-600">Waiting for new orders...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Order #{order.tracking_number}</h3>
                <span className={`inline-block mt-2 px-4 py-2 rounded-full font-semibold ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-600">${order.price}</p>
                <p className="text-sm text-gray-500">{order.service_type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-500 text-sm mb-2">PICKUP</h4>
                <p className="font-bold text-gray-800">{order.sender_name}</p>
                <p className="text-gray-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 mt-1" />
                  {order.sender_address}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-500 text-sm mb-2">DELIVERY</h4>
                <p className="font-bold text-gray-800">{order.receiver_name}</p>
                <p className="text-gray-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-500 mt-1" />
                  {order.receiver_address}
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          {order.sender_lat && order.receiver_lat && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4">Route</h3>
              <StaticRouteMap
                pickup={{ lat: order.sender_lat, lng: order.sender_lng }}
                delivery={{ lat: order.receiver_lat, lng: order.receiver_lng }}
                routeGeometry={order.route_geometry}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {order.status === 'pending' && (
              <button
                onClick={() => acceptOrder(order.id)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all"
              >
                Accept Order
              </button>
            )}
            
            {order.status === 'picked_up' && !isSimulating && (
              <button
                onClick={startSimulation}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-6 h-6" />
                Start Delivery Simulation
              </button>
            )}

            {isSimulating && (
              <div className="flex-1 bg-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Simulating delivery...</span>
                  <span className="font-bold text-orange-600">{simulationProgress}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-600 to-red-600 h-3 rounded-full transition-all"
                    style={{ width: `${simulationProgress}%` }}
                  />
                </div>
              </div>
            )}

            {order.status === 'picked_up' && simulationProgress === 0 && (
              <button
                onClick={() => completeOrder(order.id)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-6 h-6" />
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
