// utils/ProtectedRoute.jsx (Optional - for authentication)
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Add your authentication logic here
  const isAuthenticated = true; // Replace with actual auth check
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

// hooks/useAuth.js (Optional - for authentication management)
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Fetch user data
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Login logic
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, loading, login, logout };
};