import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success && response.data?.data?.user) {
        setUser(response.data.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success && response.data?.data?.user) {
        setUser(response.data.data.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'Login failed';
      return { success: false, message: msg };
    }
  };

  const register = async ({ fullname, email, password, phone_number }) => {
    try {
      const response = await api.post('/auth/register', {
        fullname,
        email,
        password,
        phone_number,
      });
      if (response.data?.success && response.data?.data?.user) {
        setUser(response.data.data.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
