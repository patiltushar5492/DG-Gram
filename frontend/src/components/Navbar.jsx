import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  FileText, 
  Briefcase, 
  FileCheck, 
  AlertCircle, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert, 
  PhoneCall, 
  Landmark,
  Home
} from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'मुख्यपृष्ठ (Home)', path: '/' },
    { name: 'नागरी सेवा व दाखले (Services)', path: '/services' },
    { name: 'शासन निर्णय व जीआर (Government GRs)', path: '/government-grs', highlight: true },
    { name: 'विकासकामे (Development)', path: '/development' },
    { name: 'तक्रार निवारण (Grievances)', path: '/grievances' },
    { name: 'गावाविषयी (About Village)', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Marathi Government Ribbon */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>महाराष्ट्र शासन | जिल्हा परिषद जळगाव | पंचायत समिती पाचोरा</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden sm:inline">हेल्पलाइन: ०२५९६-२४५००१</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-amber-400 font-medium">डिजिटल ग्रामपंचायत पोर्टल</span>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          {/* Authentic Emblem / Seal Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Landmark className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              ग्रामपंचायत गाळण बुद्रुक
            </div>
            <div className="text-xs sm:text-sm text-slate-600 font-medium">
              ता. पाचोरा, जि. जळगाव, महाराष्ट्र - ४२४२०१
            </div>
          </div>
        </Link>

        {/* User Account / Auth Actions for Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-800">{user.name}</div>
                <div className="text-[10px] uppercase font-semibold text-orange-600 tracking-wider">
                  {isAdmin ? 'प्रशासक (Admin)' : 'नागरिक (Citizen)'}
                </div>
              </div>

              {isAdmin ? (
                <Link
                  to="/admin"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  प्रशासक डॅशबोर्ड
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  माझे खाते
                </Link>
              )}

              <button
                onClick={handleLogout}
                title="लॉगआउट करा"
                className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-orange-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                लॉगिन (Login)
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors shadow-xs"
              >
                नवीन नोंदणी (Register)
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-orange-600 rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation Bar Links (Desktop) */}
      <nav className="border-t border-slate-100 bg-slate-50/70 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap
                ${item.highlight 
                  ? (isActive 
                      ? 'bg-amber-600 text-white shadow-xs font-semibold' 
                      : 'text-amber-800 bg-amber-100/70 hover:bg-amber-200/80 font-semibold ring-1 ring-amber-300') 
                  : (isActive 
                      ? 'bg-orange-600 text-white shadow-xs font-semibold' 
                      : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50')
                }
              `}
            >
              {item.name}
            </NavLink>
          ))}
          <Link
            to="/track-application"
            className="ml-auto text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            अर्ज स्थिती तपासा (Track Application)
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                block px-3 py-2.5 rounded-lg text-sm font-medium
                ${item.highlight 
                  ? (isActive ? 'bg-amber-600 text-white font-semibold' : 'text-amber-900 bg-amber-50 font-semibold')
                  : (isActive ? 'bg-orange-600 text-white font-semibold' : 'text-slate-800 hover:bg-slate-100')
                }
              `}
            >
              {item.name}
            </NavLink>
          ))}

          <Link
            to="/track-application"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50"
          >
            🔍 अर्ज स्थिती तपासा (Track Application)
          </Link>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <>
                <div className="text-xs font-semibold text-slate-500 px-1">
                  लॉगिन केलेला वापरकर्ता: {user.name} ({isAdmin ? 'Admin' : 'Citizen'})
                </div>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-orange-600 text-white font-semibold py-2 rounded-lg text-sm"
                  >
                    प्रशासक डॅशबोर्ड (Admin Dashboard)
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-lg text-sm"
                  >
                    माझे नागरिक खाते (Citizen Portal)
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-2 rounded-lg text-sm"
                >
                  लॉगआउट करा
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 border border-slate-300 text-slate-800 rounded-lg text-sm font-semibold"
                >
                  लॉगिन
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold"
                >
                  नोंदणी
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
