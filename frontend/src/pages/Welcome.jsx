import { Link } from 'react-router-dom'
import { Package, Zap, Shield, TrendingUp, MapPin, Clock } from 'lucide-react'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center space-y-8 animate-slide-up">
            <div className="inline-block">
              <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                <Package className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Delivery
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of logistics with intelligent routing, real-time tracking, and automated delivery management
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Optimized routes powered by AI for fastest delivery times' },
            { icon: Shield, title: 'Secure & Reliable', desc: 'End-to-end encryption and real-time package tracking' },
            { icon: TrendingUp, title: 'Smart Analytics', desc: 'Data-driven insights to improve your delivery operations' }
          ].map((feature, i) => (
            <div key={i} className="card p-8 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="glass rounded-3xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: '10K+', label: 'Deliveries' },
              { value: '500+', label: 'Active Drivers' },
              { value: '99.9%', label: 'Success Rate' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="gradient-primary rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Deliveries?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of businesses using AI-powered logistics</p>
          <Link to="/register" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}
