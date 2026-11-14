import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dg_gram_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dg_gram_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate session if token exists
    if (token) {
      apiRequest('/auth/me')
        .then(res => {
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('dg_gram_user', JSON.stringify(res.user));
          } else {
            logout();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('dg_gram_user', JSON.stringify(userData));
    localStorage.setItem('dg_gram_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dg_gram_user');
    localStorage.removeItem('dg_gram_token');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
