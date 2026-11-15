import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo / Title */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center font-black justify-center shadow-md">
            गा.बु.
          </div>
          <div>
            <h1 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
              ग्रामपंचायत गाळण बुद्रुक
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold">ता. पाचोरा, जि. जळगाव</p>
          </div>
        </Link>

        {/* Navigation & Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/dashboard" 
                className="hidden sm:flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-200 hover:bg-orange-100 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{user.name || 'डॅशबोर्ड'}</span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉगआउट</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>लॉगिन</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>नोंदणी</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}