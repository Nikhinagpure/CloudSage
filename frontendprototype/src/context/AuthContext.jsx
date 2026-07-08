import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token on mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: mockUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsLoading(false);
      return mockUser;
    } catch (error) {
      setIsLoading(false);
      throw new Error(error.response?.data?.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { id: 2, name, email };
        const mockToken = 'mock-jwt-token-456';
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsLoading(false);
        resolve(mockUser);
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
