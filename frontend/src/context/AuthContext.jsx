import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Synchronous initialization prevents any "null user" flicker or race conditions on page load/navigation
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('dg_gram_user');
      const savedToken = localStorage.getItem('dg_gram_token') || localStorage.getItem('token');
      if (savedUser && savedUser !== 'undefined' && savedToken) {
        const parsed = JSON.parse(savedUser);
        console.log('[AUTH] Synchronous initial user restore:', parsed.email, 'Role:', parsed.role);
        return parsed;
      }
    } catch (e) {
      console.error('[AUTH] Error parsing stored user on init:', e);
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
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      }
    } catch (e) {
      console.error('[AUTH] Storage sync error:', e);
      localStorage.removeItem('dg_gram_user');
      localStorage.removeItem('dg_gram_token');
      localStorage.removeItem('token');
    }
  }, []);

  const login = (userData, token) => {
    console.log('[AUTH] login() called in AuthContext:', { email: userData?.email, role: userData?.role });
    if (token) {
      localStorage.setItem('dg_gram_token', token);
      localStorage.setItem('token', token);
    }
    if (userData) {
      localStorage.setItem('dg_gram_user', JSON.stringify(userData));
      setUser(userData);
    }
    console.log('[AUTH] Session keys successfully written to localStorage');
  };

  const logout = () => {
    console.log('[AUTH] logout() called. Clearing session keys.');
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
    console.error('[AUTH CRITICAL] useAuth() used outside of <AuthProvider>! Ensure AuthProvider is in main.jsx');
    return {
      user: null,
      login: () => console.error('[AUTH ERROR] Cannot login: AuthProvider missing'),
      logout: () => {},
      isAdmin: false,
      authLoading: false
    };
  }
  return ctx;
}
