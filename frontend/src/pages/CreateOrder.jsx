import { useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom'
import MapPicker from '../components/MapPicker'
import { Package, MapPin, User, Weight, Ruler, Zap } from 'lucide-react'

export default function CreateOrder() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_phone: '',
    sender_address: '',
    sender_lat: null,
    sender_lng: null,
    pickup_city: 'Casablanca',
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
    receiver_lat: null,
    receiver_lng: null,
    delivery_city: 'Casablanca',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    service_type: 'standard',
    delivery_type: 'intra_city',
    pickup_option: 'door_pickup',
    delivery_option: 'door_delivery',
    package_description: '',
    fragile: false,
    insurance_value: 0
  })
  
  const [cities] = useState([
    'Casablanca', 'Rabat', 'Marrakech', 'El Jadida', 'Salé', 'Agadir'
  ])
  
  const [isInterCity, setIsInterCity] = useState(false)
  const [showSenderMap, setShowSenderMap] = useState(false)
  const [showReceiverMap, setShowReceiverMap] = useState(false)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    document.body.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.body.removeChild(script)
    }
  }, [])

  const createMutation = useMutation(
    isInterCity ? api.createInterCityOrder : api.createOrder,
    {
      onSuccess: (response) => {
        alert(`Order created! Tracking: ${response.data.tracking_number}`)
        navigate('/dashboard')
      }
    }
  )
  
  // Check if inter-city when cities change
  const checkInterCity = () => {
    const isIntercity = formData.pickup_city !== formData.delivery_city
    setIsInterCity(isIntercity)
    setFormData(prev => ({ ...prev, delivery_type: isIntercity ? 'inter_city' : 'intra_city' }))
  }
  
  useEffect(() => {
    checkInterCity()
  }, [formData.pickup_city, formData.delivery_city])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const orderData = {
      pickup_address: formData.sender_address,
      delivery_address: formData.receiver_address,
      pickup_city: formData.pickup_city,
      delivery_city: formData.delivery_city,
      sender_name: formData.sender_name,
      sender_phone: formData.sender_phone,
      receiver_name: formData.receiver_name,
      receiver_phone: formData.receiver_phone,
      weight: parseFloat(formData.weight),
      dimensions: {
        length: parseFloat(formData.dimensions.length),
        width: parseFloat(formData.dimensions.width),
        height: parseFloat(formData.dimensions.height)
      },
      service_type: formData.service_type,
      package_description: formData.package_description
    }
    
    if (isInterCity) {
      orderData.pickup_option = formData.pickup_option
      orderData.delivery_option = formData.delivery_option
      orderData.fragile = formData.fragile
      orderData.insurance_value = parseFloat(formData.insurance_value) || 0
    } else {
      orderData.delivery_type = 'door_to_door'
    }
    
    createMutation.mutate(orderData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('dim_')) {
      const dimName = name.replace('dim_', '')
      setFormData(prev => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dimName]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Create New Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sender & Receiver */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg">Sender</h3>
            </div>
            <div className="space-y-4">
              <input
                name="sender_name"
                placeholder="Full Name"
                value={formData.sender_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                required
              />
              <input
                name="sender_phone"
                placeholder="Phone Number"
                value={formData.sender_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                required
              />
              <select
                name="pickup_city"
                value={formData.pickup_city}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                required
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div>
                <input
                  name="sender_address"
                  placeholder="Address"
                  value={formData.sender_address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSenderMap(!showSenderMap)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" />
                  {showSenderMap ? 'Hide Map' : 'Pick on Map'}
                </button>
              </div>
              {showSenderMap && (
                <MapPicker
                  label="Click to select sender location"
                  onLocationSelect={(loc) => setFormData(prev => ({ 
                    ...prev, 
                    sender_address: loc.address,
                    sender_lat: loc.lat,
                    sender_lng: loc.lng
                  }))}
                  initialPosition={[33.5731, -7.5898]}
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-lg">Receiver</h3>
            </div>
            <div className="space-y-4">
              <input
                name="receiver_name"
                placeholder="Full Name"
                value={formData.receiver_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all"
                required
              />
              <input
                name="receiver_phone"
                placeholder="Phone Number"
                value={formData.receiver_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all"
                required
              />
              <select
                name="delivery_city"
                value={formData.delivery_city}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all"
                required
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div>
                <input
                  name="receiver_address"
                  placeholder="Address"
                  value={formData.receiver_address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowReceiverMap(!showReceiverMap)}
                  className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" />
                  {showReceiverMap ? 'Hide Map' : 'Pick on Map'}
                </button>
              </div>
              {showReceiverMap && (
                <MapPicker
                  label="Click to select receiver location"
                  onLocationSelect={(loc) => setFormData(prev => ({ 
                    ...prev, 
                    receiver_address: loc.address,
                    receiver_lat: loc.lat,
                    receiver_lng: loc.lng
                  }))}
                  initialPosition={[33.5731, -7.5898]}
                />
              )}
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Weight className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-lg">Package Details</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                name="weight"
                type="number"
                step="0.1"
                placeholder="5.0"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
              <input
                name="dim_length"
                type="number"
                placeholder="30"
                value={formData.dimensions.length}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
              <input
                name="dim_width"
                type="number"
                placeholder="20"
                value={formData.dimensions.width}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                name="dim_height"
                type="number"
                placeholder="10"
                value={formData.dimensions.height}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Description</label>
              <input
                name="package_description"
                placeholder="Electronics, Documents, etc."
                value={formData.package_description}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Delivery Type Indicator */}
        {isInterCity && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <h3 className="font-bold text-lg text-orange-800">Inter-City Delivery</h3>
            </div>
            <p className="text-orange-700 mb-4">Your package will be delivered between {formData.pickup_city} and {formData.delivery_city}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">Pickup Option</label>
                <select
                  name="pickup_option"
                  value={formData.pickup_option}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none"
                >
                  <option value="door_pickup">Door Pickup (+0 MAD)</option>
                  <option value="warehouse_dropoff">Drop at Warehouse (-15 MAD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">Delivery Option</label>
                <select
                  name="delivery_option"
                  value={formData.delivery_option}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none"
                >
                  <option value="door_delivery">Door Delivery (+0 MAD)</option>
                  <option value="warehouse_pickup">Pickup from Warehouse (-15 MAD)</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="fragile"
                  checked={formData.fragile}
                  onChange={(e) => setFormData(prev => ({ ...prev, fragile: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 border-2 border-orange-300 rounded focus:ring-orange-500"
                />
                <label className="text-sm font-medium text-orange-700">Fragile Package (+25 MAD)</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-1">Insurance Value (MAD)</label>
                <input
                  name="insurance_value"
                  type="number"
                  placeholder="0"
                  value={formData.insurance_value}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Service Type */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-lg">Service Type</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['standard', 'express'].map((type) => (
              <label
                key={type}
                className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.service_type === type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="service_type"
                  value={type}
                  checked={formData.service_type === type}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="font-semibold capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Delivery Type:</span>
              <span className={`font-semibold ${isInterCity ? 'text-orange-600' : 'text-green-600'}`}>
                {isInterCity ? 'Inter-City' : 'Intra-City'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Route:</span>
              <span className="font-semibold">{formData.pickup_city} → {formData.delivery_city}</span>
            </div>
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="font-semibold capitalize">{formData.service_type}</span>
            </div>
            {isInterCity && (
              <>
                <div className="flex justify-between">
                  <span>Pickup:</span>
                  <span className="font-semibold">{formData.pickup_option === 'door_pickup' ? 'Door Pickup' : 'Warehouse Drop-off'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-semibold">{formData.delivery_option === 'door_delivery' ? 'Door Delivery' : 'Warehouse Pickup'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={createMutation.isLoading}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 ${
            isInterCity 
              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          {createMutation.isLoading ? 'Creating Order...' : `Create ${isInterCity ? 'Inter-City' : 'Local'} Order`}
        </button>
      </form>
    </div>
  )
}
