// components/layout/Layout.jsx - Debug version
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log('Layout rendering with children:', children);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug info */}
      {/* <div className="fixed top-0 right-0 z-50 bg-red-500 text-white p-2 text-xs">
        Layout Debug: {children ? 'Has Children' : 'No Children'}
      </div> */}
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-16'
      } pt-16`}>
        <div className="p-4 lg:p-6">
          {/* Debug content */}
          {/* <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded">
            <h3 className="font-bold text-blue-800">Layout Debug Info:</h3>
            <p>Children prop: {children ? 'Present' : 'Missing'}</p>
            <p>Sidebar open: {sidebarOpen ? 'Yes' : 'No'}</p>
          </div> */}
          
          {/* Render children if passed as prop */}
          {children}
          
          {/* Render Outlet if using nested routing */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;