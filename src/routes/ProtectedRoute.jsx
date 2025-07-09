// routes/ProtectedRoute.jsx - Simplified role-based version
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Helper function to check if user has required role
const hasRequiredRole = (userRole, requiredRoles) => {
  // If no roles are required, allow access
  if (!requiredRoles || requiredRoles.length === 0) return true;
  
  // If no user role, deny access
  if (!userRole) return false;
  
  // Convert single role to array for consistent handling
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  // Check if user role is in the required roles
  return rolesArray.includes(userRole);
};

// Helper function to get role-based redirect path
const getRoleBasedRedirect = (userRole) => {
  switch (userRole) {
    case 'SuperAdmin':
      return '/admin/superadmin/dashboard';
    case 'Admin':
    case 'Manager':
    case 'Employee':
      return '/admin/dashboard';
    case 'User':
    case 'Viewer':
      return '/dashboard';
    default:
      return '/login';
  }
};

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/login',
  fallbackComponent = null 
}) => {
  const location = useLocation();
  
  // Get authentication data from localStorage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  // Debug information
  console.log('ProtectedRoute Debug:', {
    path: location.pathname,
    token: !!token,
    userRole,
    requiredRoles,
    hasAccess: hasRequiredRole(userRole, requiredRoles)
  });
  
  // Check if user is authenticated
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Check role-based access
  if (requiredRoles.length > 0 && !hasRequiredRole(userRole, requiredRoles)) {
    console.log('Access denied - insufficient role. Required:', requiredRoles, 'User has:', userRole);
    
    // For dashboard routes, redirect to appropriate dashboard instead of unauthorized
    if (location.pathname.includes('/dashboard')) {
      const roleBasedRedirect = getRoleBasedRedirect(userRole);
      console.log('Dashboard route access denied, redirecting to:', roleBasedRedirect);
      return <Navigate to={roleBasedRedirect} replace />;
    }
    
    // Return fallback component or redirect to unauthorized page
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    console.log('Redirecting to unauthorized page');
    return <Navigate to="/unauthorized" replace />;
  }
  
  console.log('Access granted, rendering protected component');
  // User has access, render the protected component
  return children;
};

export default ProtectedRoute;