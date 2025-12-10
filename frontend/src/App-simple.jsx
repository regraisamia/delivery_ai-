import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple test components
const TestWelcome = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">🚀 Delivery System</h1>
      <p className="text-gray-600 mb-8">System is working!</p>
      <div className="space-y-4">
        <a href="/admin/login" className="block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          Admin Login
        </a>
        <a href="/driver/login" className="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
          Driver Login
        </a>
        <a href="/login" className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Customer Login
        </a>
      </div>
    </div>
  </div>
);

const TestLogin = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form>
        <input type="text" placeholder="Username" className="w-full p-3 border rounded mb-4" />
        <input type="password" placeholder="Password" className="w-full p-3 border rounded mb-4" />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestWelcome />} />
        <Route path="/login" element={<TestLogin />} />
        <Route path="/admin/login" element={<TestLogin />} />
        <Route path="/driver/login" element={<TestLogin />} />
      </Routes>
    </Router>
  );
}

export default App;