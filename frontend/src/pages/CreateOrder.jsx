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
    sender_address: '',
    sender_lat: null,
    sender_lng: null,
    receiver_name: '',
    receiver_address: '',
    receiver_lat: null,
    receiver_lng: null,
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    service_type: 'standard'
  })
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

  const createMutation = useMutation(api.createOrder, {
    onSuccess: (response) => {
      alert(`Order created! Tracking: ${response.data.tracking_number}`)
      navigate('/dashboard')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.sender_lat || !formData.receiver_lat) {
      alert('Please select locations on the map for both sender and receiver')
      return
    }
    createMutation.mutate({
      ...formData,
      weight: parseFloat(formData.weight),
      dimensions: {
        length: parseFloat(formData.dimensions.length),
        width: parseFloat(formData.dimensions.width),
        height: parseFloat(formData.dimensions.height)
      }
    })
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
          </div>
        </div>

        {/* Service Type */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-lg">Service Type</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['standard', 'express', 'overnight'].map((type) => (
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

        <button
          type="submit"
          disabled={createMutation.isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          {createMutation.isLoading ? 'Creating Order...' : 'Create Order'}
        </button>
      </form>
    </div>
  )
}
