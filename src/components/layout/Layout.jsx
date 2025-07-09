import { Sidebar } from 'lucide-react';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';


const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className=" bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <main className={`transition-all duration-300  ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
