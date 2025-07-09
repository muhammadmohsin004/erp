
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/dashboard/Dashboard';
import Clients from '../pages/clients/Clients';
import NotFound from '../pages/error/NotFound';

export const Routes = () => {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      {/* <Route path="/login" element={<Login />} /> */}
      
      {/* Protected Routes with Layout */}
      <Route path="/" element={<Layout />}>
        {/* Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Main Navigation Routes */}
        <Route path="clients" element={<Clients  />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};