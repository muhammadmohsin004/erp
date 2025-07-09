// routes/Route.jsx - Dynamic Routes Version
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/dashboard/Dashboard';
import Clients from '../pages/clients/Clients';
import LoginPage from '../pages/Auth/LoginPage';
import Signup from '../pages/Auth/Signup';
import ResetPassword from '../pages/Auth/ResetPassword';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import NotFound from '../pages/error/NotFound';
import CompaniesManagement from '../pages/SuperAdmin/CompaniesManagement';
import ProtectedRoute from './ProtectedRoute';

// Helper function to get role-based dashboard path
const getDashboardPath = (userRole) => {
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
      return '/dashboard';
  }
};

// Helper function to get role-based path prefix
const getRoleBasedPath = (basePath, userRole) => {
  switch (userRole) {
    case 'SuperAdmin':
      return basePath.startsWith('/admin/superadmin') ? basePath : `/admin/superadmin${basePath}`;
    case 'Admin':
      return basePath.startsWith('/admin') ? basePath : `/admin${basePath}`;
    case 'Manager':
      return basePath.startsWith('/admin') ? basePath : `/admin${basePath}`;
    case 'Employee':
      return basePath.startsWith('/admin') ? basePath : `/admin${basePath}`;
    case 'User':
      return basePath;
    case 'Viewer':
      return basePath;
    default:
      return basePath;
  }
};

// Helper component to handle role-based dashboard redirection
const DashboardRedirect = () => {
  const userRole = localStorage.getItem('role');
  const dashboardPath = getDashboardPath(userRole);
  
  console.log('DashboardRedirect - Role:', userRole, 'Redirecting to:', dashboardPath);
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to={dashboardPath} replace />;
};

// Unauthorized component
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-4">You don't have permission to access this page.</p>
      <button 
        onClick={() => window.history.back()} 
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors mr-4"
      >
        Go Back
      </button>
      <button 
        onClick={() => {
          const userRole = localStorage.getItem('role');
          const dashboardPath = getDashboardPath(userRole);
          window.location.href = dashboardPath;
        }} 
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

// Route configuration with dynamic paths
const getRouteConfig = () => {
  return [
    // Dashboard Routes - Role-specific paths
    {
      path: '/admin/superadmin/dashboard',
      component: Dashboard,
      roles: ['SuperAdmin'],
      layout: true
    },
    {
      path: '/admin/dashboard',
      component: Dashboard,
      roles: ['Admin', 'Manager', 'Employee'],
      layout: true
    },
    {
      path: '/dashboard',
      component: Dashboard,
      roles: ['User', 'Viewer'],
      layout: true
    },
    
    // SuperAdmin specific routes
    {
      path: '/admin/superadmin/companies',
      component: CompaniesManagement,
      roles: ['SuperAdmin'],
      layout: true
    },
    {
      path: '/companies-management', // Legacy support
      component: CompaniesManagement,
      roles: ['SuperAdmin'],
      layout: true
    },
    
    // Admin/Manager/Employee routes with dynamic paths
    {
      path: '/admin/clients',
      component: Clients,
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee'],
      layout: true
    },
    {
      path: '/clients', // Legacy support
      component: Clients,
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee'],
      layout: true
    },
    {
      path: '/admin/inventory',
      component: () => <div>Inventory Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee'],
      layout: true
    },
    {
      path: '/inventory', // Legacy support
      component: () => <div>Inventory Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee'],
      layout: true
    },
    {
      path: '/admin/sales',
      component: () => <div>Sales Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee'],
      layout: true
    },
    {
      path: '/sales', // Legacy support
      component: () => <div>Sales Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee'],
      layout: true
    },
    {
      path: '/admin/bills',
      component: () => <div>Bills Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee'],
      layout: true
    },
    {
      path: '/bills', // Legacy support
      component: () => <div>Bills Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee'],
      layout: true
    },
    
    // Manager+ only routes
    {
      path: '/admin/finance',
      component: () => <div>Finance Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/finance', // Legacy support
      component: () => <div>Finance Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/admin/accounting',
      component: () => <div>Accounting Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/accounting', // Legacy support
      component: () => <div>Accounting Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/admin/employees',
      component: () => <div>Employees Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/employees', // Legacy support
      component: () => <div>Employees Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/admin/reports',
      component: () => <div>Reports Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/reports', // Legacy support
      component: () => <div>Reports Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/admin/templates',
      component: () => <div>Templates Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/templates', // Legacy support
      component: () => <div>Templates Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/admin/settings',
      component: () => <div>Settings Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/settings', // Legacy support
      component: () => <div>Settings Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/admin/salary-components',
      component: () => <div>Salary Components Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    {
      path: '/salary-components', // Legacy support
      component: () => <div>Salary Components Page</div>,
      roles: ['SuperAdmin', 'Admin', 'Manager'],
      layout: true
    },
    
    // Admin+ only routes
    {
      path: '/admin/permissions',
      component: () => <div>Permission Settings Page</div>,
      roles: ['SuperAdmin', 'Admin'],
      layout: true
    },
    {
      path: '/permissions', // Legacy support
      component: () => <div>Permission Settings Page</div>,
      roles: ['SuperAdmin', 'Admin'],
      layout: true
    }
  ];
};

export const Routes = () => {
  const routeConfig = getRouteConfig();

  return (
    <RouterRoutes>
      {/* Public Routes - Auth Pages (Outside of Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Unauthorized access page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Dynamic Protected Routes */}
      {routeConfig.map((route, index) => {
        const RouteComponent = route.component;
        const element = route.layout ? (
          <Layout>
            <RouteComponent />
          </Layout>
        ) : (
          <RouteComponent />
        );

        return (
          <Route
            key={`${route.path}-${index}`}
            path={route.path}
            element={
              <ProtectedRoute requiredRoles={route.roles}>
                {element}
              </ProtectedRoute>
            }
          />
        );
      })}
      
      {/* Root redirect based on user role */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};