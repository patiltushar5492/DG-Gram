import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dg_gram_user');
      const savedToken = localStorage.getItem('dg_gram_token');
      if (savedUser && savedUser !== 'undefined' && savedToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // Corrupted storage — clear it
      localStorage.removeItem('dg_gram_user');
      localStorage.removeItem('dg_gram_token');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    if (token) {
      // Store under a single consistent key; api.js reads 'dg_gram_token'
      localStorage.setItem('dg_gram_token', token);
    }
    if (userData) {
      localStorage.setItem('dg_gram_user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('dg_gram_token');
    localStorage.removeItem('dg_gram_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    // Called outside provider — return safe defaults instead of throwing
    console.warn('useAuth() called outside <AuthProvider>');
    return { user: null, login: () => {}, logout: () => {}, isAdmin: false, authLoading: false };
  }
  return ctx;
}
