import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Synchronous initialization prevents any "null user" flicker or race conditions on page load/navigation
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('dg_gram_user');
      const savedToken = localStorage.getItem('dg_gram_token') || localStorage.getItem('token');
      if (savedUser && savedUser !== 'undefined' && savedToken) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
    return null;
  });

  const [authLoading, setAuthLoading] = useState(false);

  // Synchronize on mount and handle storage events
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dg_gram_user');
      const savedToken = localStorage.getItem('dg_gram_token') || localStorage.getItem('token');
      if (savedUser && savedUser !== 'undefined' && savedToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // Clear corrupt storage
      localStorage.removeItem('dg_gram_user');
      localStorage.removeItem('dg_gram_token');
      localStorage.removeItem('token');
    }
  }, []);

  const login = (userData, token) => {
    if (token) {
      // Consistent storage across both keys to guarantee compatibility
      localStorage.setItem('dg_gram_token', token);
      localStorage.setItem('token', token);
    }
    if (userData) {
      localStorage.setItem('dg_gram_user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('dg_gram_token');
    localStorage.removeItem('token');
    localStorage.removeItem('dg_gram_user');
    setUser(null);
  };

  const isAdmin = Boolean(user && (user.role === 'admin' || user.isAdmin === true));

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    return {
      user: null,
      login: () => {},
      logout: () => {},
      isAdmin: false,
      authLoading: false
    };
  }
  return ctx;
}
