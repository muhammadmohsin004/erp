// routes/ProtectedRoute.jsx - Enhanced role-based version with dynamic paths
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

// Helper function to get role-based dashboard redirect path
const getRoleBasedDashboard = (userRole) => {
  switch (userRole) {
    case 'SuperAdmin':
      return '/admin/superadmin/dashboard';
    case 'Admin':
      return '/admin/dashboard';
    case 'Manager':
      return '/admin/dashboard';
    case 'Employee':
      return '/admin/dashboard';
    case 'User':
      return '/dashboard';
    case 'Viewer':
      return '/dashboard';
    default:
      return '/login';
  }
};

// Helper function to get appropriate redirect path for role-based access
const getRoleBasedRedirectPath = (userRole, currentPath, requiredRoles) => {
  // If accessing a dashboard route with wrong role, redirect to correct dashboard
  if (currentPath.includes('/dashboard')) {
    return getRoleBasedDashboard(userRole);
  }
  
  // For other routes, try to redirect to a role-appropriate version
  const pathSegments = currentPath.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  // Get role-based path for the same feature
  switch (userRole) {
    case 'SuperAdmin':
      // SuperAdmin can access admin routes or their own routes
      if (currentPath.startsWith('/admin/superadmin/')) return currentPath;
      return `/admin/superadmin/${lastSegment}`;
      
    case 'Admin':
    case 'Manager':
    case 'Employee':
      // These roles use admin paths
      if (currentPath.startsWith('/admin/') && !currentPath.startsWith('/admin/superadmin/')) {
        return currentPath;
      }
      return `/admin/${lastSegment}`;
      
    case 'User':
    case 'Viewer':
      // Regular users use base paths
      if (!currentPath.startsWith('/admin/')) return currentPath;
      return `/${lastSegment}`;
      
    default:
      return '/unauthorized';
  }
};

// Helper function to check if user is properly authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  
  return !!(token && user && role);
};

// Helper function to validate token (basic check)
const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Basic token validation - check if it's not expired
    // You can add more sophisticated validation here
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (tokenData.exp && tokenData.exp < currentTime) {
      console.log('Token expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('Invalid token format');
    return false;
  }
};

// Helper function to clear authentication data
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  localStorage.removeItem('permissions');
  localStorage.removeItem('company');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('requirePasswordChange');
};

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/login',
  fallbackComponent = null,
  allowPartialAccess = false 
}) => {
  const location = useLocation();
  
  // Get authentication data from localStorage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const currentPath = location.pathname;
  
  // Debug information
  console.log('ProtectedRoute Debug:', {
    path: currentPath,
    token: !!token,
    userRole,
    requiredRoles,
    hasAccess: hasRequiredRole(userRole, requiredRoles),
    isAuthenticated: isAuthenticated(),
    isTokenValid: token ? isTokenValid() : false
  });
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    clearAuthData(); // Clear any invalid data
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Check token validity
  if (!isTokenValid()) {
    console.log('Invalid or expired token, redirecting to login');
    clearAuthData();
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Check role-based access
  if (requiredRoles.length > 0 && !hasRequiredRole(userRole, requiredRoles)) {
    console.log('Access denied - insufficient role. Required:', requiredRoles, 'User has:', userRole);
    
    // If partial access is allowed, try to redirect to role-appropriate path
    if (allowPartialAccess) {
      const redirectPath = getRoleBasedRedirectPath(userRole, currentPath, requiredRoles);
      console.log('Partial access allowed, redirecting to:', redirectPath);
      
      if (redirectPath !== currentPath && redirectPath !== '/unauthorized') {
        return <Navigate to={redirectPath} replace />;
      }
    }
    
    // For dashboard routes, redirect to appropriate dashboard instead of unauthorized
    if (currentPath.includes('/dashboard')) {
      const roleBasedDashboard = getRoleBasedDashboard(userRole);
      console.log('Dashboard route access denied, redirecting to:', roleBasedDashboard);
      return <Navigate to={roleBasedDashboard} replace />;
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

// Higher-order component for role-based route protection
export const withRoleProtection = (Component, requiredRoles = []) => {
  return (props) => (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Hook to check user permissions
export const usePermissions = () => {
  const userRole = localStorage.getItem('role');
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
  
  const hasRole = (roles) => {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(userRole);
  };
  
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };
  
  const canAccess = (requiredRoles = [], requiredPermissions = []) => {
    const roleCheck = requiredRoles.length === 0 || hasRole(requiredRoles);
    const permissionCheck = requiredPermissions.length === 0 || 
                           requiredPermissions.some(permission => hasPermission(permission));
    
    return roleCheck && permissionCheck;
  };
  
  return {
    userRole,
    permissions,
    hasRole,
    hasPermission,
    canAccess
  };
};

export default ProtectedRoute;