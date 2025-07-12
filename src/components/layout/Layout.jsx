import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; // <== Make sure this is imported
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { language: currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar"; // <- determine sidebar side

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isRTL={isRTL} // pass RTL info to sidebar
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main
          className={`flex-1 overflow-y-auto p-4 pt-20 transition-all duration-300 ${
            isRTL
              ? sidebarOpen
                ? "mr-64"
                : "mr-16"
              : sidebarOpen
              ? "ml-64"
              : "ml-16"
          }`}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
