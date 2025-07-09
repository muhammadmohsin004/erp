// routes/Route.jsx - Fixed version
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

// Helper component to handle role-based dashboard redirection
const DashboardRedirect = () => {
  const userRole = localStorage.getItem('role');
  
  switch (userRole) {
    case 'SuperAdmin':
      return <Navigate to="/admin/superadmin/dashboard" replace />;
    case 'Admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'Manager':
      return <Navigate to="/admin/dashboard" replace />;
    case 'Employee':
      return <Navigate to="/admin/dashboard" replace />;
    case 'User':
      return <Navigate to="/dashboard" replace />;
    case 'Viewer':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
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
        onClick={() => window.location.href = '/'} 
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

export const Routes = () => {
  return (
    <RouterRoutes>
      {/* Public Routes - Auth Pages (Outside of Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Unauthorized access page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* SuperAdmin Routes */}
      <Route 
        path="/admin/superadmin/dashboard" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin']}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/companies-management" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin']}>
            <Layout>
              <CompaniesManagement />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes (Admin, Manager, Employee) */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requiredRoles={['Admin', 'Manager', 'Employee']}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Regular User Routes (User, Viewer) */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRoles={['User', 'Viewer']}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Shared Routes with Role-Based Access - No permissions required */}
      <Route 
        path="/clients" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager', 'Employee']}>
            <Layout>
              <Clients />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager', 'Employee']}>
            <Layout>
              <div>Inventory Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/sales" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager', 'Employee']}>
            <Layout>
              <div>Sales Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/bills" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager', 'Employee']}>
            <Layout>
              <div>Bills Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/finance" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager']}>
            <Layout>
              <div>Finance Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/accounting" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager']}>
            <Layout>
              <div>Accounting Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager']}>
            <Layout>
              <div>Employees Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager']}>
            <Layout>
              <div>Reports Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/templates" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager']}>
            <Layout>
              <div>Templates Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager']}>
            <Layout>
              <div>Settings Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/salary-components" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin', 'Manager']}>
            <Layout>
              <div>Salary Components Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/permissions" 
        element={
          <ProtectedRoute requiredRoles={['SuperAdmin', 'Admin']}>
            <Layout>
              <div>Permission Settings Page</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
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