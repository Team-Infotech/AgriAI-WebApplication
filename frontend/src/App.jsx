import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import PriceChart from './components/PriceChart';

export default function App(){
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-bold">AgriAI</Link>
            <nav className="flex gap-2">
              <Link to="/farmer" className="text-sm">Farmer</Link>
              <Link to="/buyer" className="text-sm">Buyer</Link>
              <Link to="/prices" className="text-sm">Prices</Link>
            </nav>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">{user.name} ({user.role})</span>
                <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={logout}>Logout</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-sm">Login</Link>
                <Link to="/register" className="text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<div>Welcome to AgriAI — use the nav to explore.</div>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/farmer" element={<FarmerDashboard/>} />
          <Route path="/buyer" element={<BuyerDashboard/>} />
          <Route path="/prices" element={<PriceChart/>} />
        </Routes>
      </main>
    </div>
  )
}
