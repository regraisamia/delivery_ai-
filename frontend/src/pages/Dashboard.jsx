import { useQuery } from 'react-query'
import { api } from '../services/api'
import { Package, TrendingUp, Clock, CheckCircle, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data: orders, isLoading } = useQuery('orders', () => api.getOrders().then(res => res.data))

  const stats = [
    { label: 'Total Orders', value: orders?.length || 0, icon: Package, color: 'from-blue-500 to-indigo-500' },
    { label: 'In Transit', value: orders?.filter(o => o.status === 'in_transit').length || 0, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { label: 'Pending', value: orders?.filter(o => o.status === 'pending').length || 0, icon: Clock, color: 'from-orange-500 to-red-500' },
    { label: 'Delivered', value: orders?.filter(o => o.status === 'delivered').length || 0, icon: CheckCircle, color: 'from-green-500 to-emerald-500' }
  ]

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    picked_up: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your delivery overview</p>
        </div>
        <Link to="/create" className="btn-primary">
          New Order
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </div>
            <div className="text-sm font-medium text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No orders yet. Create your first order!</p>
            <div className="flex gap-4 justify-center">
              <Link to="/create" className="btn-primary">
                Local Order
              </Link>
              <Link to="/create-inter-city" className="btn-secondary">
                Inter-City Order
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tracking #</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">From</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">To</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <Link to={`/track?tracking=${order.tracking_number}`} className="font-mono text-blue-600 hover:text-blue-700 font-semibold">
                        {order.tracking_number}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{order.sender_name}</td>
                    <td className="py-4 px-4 text-gray-700">{order.receiver_name}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">${order.price}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
