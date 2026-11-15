import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // अ‍ॅप लोड झाल्यावर किंवा पेज रिफ्रेश झाल्यावर localStorage मधून युझर डेटा तपासा
  useEffect(() => {
    try {
      const token = localStorage.getItem('dg_gram_token') || localStorage.getItem('token');
      const savedUser = localStorage.getItem('dg_gram_user');

      if (token && savedUser && savedUser !== 'undefined') {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Auth load error:', err);
      localStorage.removeItem('dg_gram_token');
      localStorage.removeItem('token');
      localStorage.removeItem('dg_gram_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // लॉगिन फंक्शन: टोकन आणि युझर डेटा दोन्ही सेव्ह करा
  const login = (userData, token) => {
    if (token) {
      localStorage.setItem('dg_gram_token', token);
      localStorage.setItem('token', token); // compatibility backup
    }
    if (userData) {
      localStorage.setItem('dg_gram_user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  // लॉगआउट फंक्शन: सर्व डेटा क्लियर करा
  const logout = () => {
    localStorage.removeItem('dg_gram_token');
    localStorage.removeItem('token');
    localStorage.removeItem('dg_gram_user');
    setUser(null);
    window.location.href = '/login'; // रिफ्रेश करून लॉगिन पेजवर पाठवा
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, login: () => {}, logout: () => {}, loading: false };
  }
  return context;
}