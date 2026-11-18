import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Landmark, LogOut, LogIn, UserPlus, Menu, X, User,
  ShieldAlert, PhoneCall, FileText, Home, Briefcase,
  FileCheck, AlertCircle, Building2, ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // Desktop & mobile nav links
  const navLinks = [
    { to: '/', label: 'मुख्यपृष्ठ', icon: <Home className="w-3.5 h-3.5" /> },
    { to: '/services', label: 'नागरी सेवा व दाखले', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { to: '/government-gr', label: 'शासन निर्णय व जीआर', icon: <FileText className="w-3.5 h-3.5" />, highlight: true },
    { to: '/development', label: 'विकासकामे', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { to: '/complaints', label: 'तक्रार निवारण', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { to: '/about', label: 'गावाविषयी', icon: <Building2 className="w-3.5 h-3.5" /> },
  ];

  const activeLinkClass = 'text-orange-600 font-black bg-orange-50 rounded-lg';
  const baseLinkClass = 'text-slate-600 hover:text-orange-600 hover:bg-orange-50 font-semibold transition-all rounded-lg';

  return (
    <header className="sticky top-0 z-50 shadow-md">

      {/* ── Government Ribbon (Top Bar) ── */}
      <div className="bg-slate-900 text-slate-300 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Ashoka emblem text */}
            <span className="text-amber-400 font-black shrink-0">🏛️</span>
            <span className="hidden sm:inline font-semibold text-slate-300 truncate">
              महाराष्ट्र शासन &nbsp;|&nbsp; जिल्हा परिषद जळगाव &nbsp;|&nbsp; पंचायत समिती पाचोरा
            </span>
            <span className="sm:hidden font-semibold text-slate-300 truncate">
              महाराष्ट्र शासन · जळगाव
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <PhoneCall className="w-3 h-3 text-green-400" />
              हेल्पलाईन: <strong className="text-white">02556-123456</strong>
            </span>
            <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">
              डिजिटल ग्रामपंचायत पोर्टल
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo + Title */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-200 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <h1 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                ग्रामपंचायत गाळण बुद्रुक
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold">
                ता. पाचोरा, जि. जळगाव, महाराष्ट्र - ४२४२०१
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 text-xs transition-all rounded-lg ${
                    isActive ? activeLinkClass : baseLinkClass
                  } ${link.highlight && !window.location.pathname.includes(link.to)
                      ? 'text-green-700 hover:text-green-700 hover:bg-green-50'
                      : ''
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Area */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                {/* User role badge */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                    {user.name || 'नागरिक'}
                  </span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg ${
                    isAdmin
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {isAdmin ? 'प्रशासक' : 'नागरिक'}
                  </span>
                </div>

                {/* Admin Dashboard Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl font-bold transition-colors shadow-sm"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl font-bold border border-red-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>लॉगआउट</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl font-bold transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>लॉगिन</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-xl font-bold shadow-sm transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>नोंदणी</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

            {/* Mobile nav links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-black'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span className="flex items-center gap-2.5">
                  {link.icon} {link.label}
                </span>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </NavLink>
            ))}

            {/* Mobile auth */}
            <div className="border-t border-slate-100 pt-3 mt-2 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">{user.name}</span>
                    <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-lg ${
                      isAdmin ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {isAdmin ? 'प्रशासक' : 'नागरिक'}
                    </span>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm"
                    >
                      <ShieldAlert className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-sm border border-red-200 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> लॉगआउट करा
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-sm"
                  >
                    <LogIn className="w-4 h-4" /> लॉगिन
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" /> नोंदणी
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
