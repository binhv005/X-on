import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('xon_token');
    if (token) {
      api.getCurrentUser()
        .then(res => {
          if (res.user) setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('xon_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (usernameOrEmail, password) => {
    const res = await api.login({ usernameOrEmail, password });
    if (res.token) {
      localStorage.setItem('xon_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (data) => {
    const res = await api.register(data);
    if (res.token) {
      localStorage.setItem('xon_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('xon_token');
    setUser(null);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
