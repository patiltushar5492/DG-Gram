import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import GovernmentGRs from './pages/GovernmentGRs';
import Development from './pages/Development';
import Grievances from './pages/Grievances';
import About from './pages/About';
import TrackApplication from './pages/TrackApplication';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Universal Government Nav Header */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/government-grs" element={<GovernmentGRs />} />
          <Route path="/government-gr" element={<GovernmentGRs />} />
          <Route path="/development" element={<Development />} />
          <Route path="/grievances" element={<Grievances />} />
          <Route path="/complaints" element={<Grievances />} />
          <Route path="/about" element={<About />} />
          <Route path="/track-application" element={<TrackApplication />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Catch-all route to avoid white screen / 404 crashes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Official Government Footer */}
      <Footer />
    </div>
  );
}
