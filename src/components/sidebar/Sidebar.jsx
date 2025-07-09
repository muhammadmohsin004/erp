// components/layout/Sidebar.jsx (Updated with Navigation)
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Package, 
  DollarSign, 
  FileText, 
  Calculator, 
  Settings, 
  Key,
  User
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: DollarSign, label: 'Sales', path: '/sales' },
    { icon: FileText, label: 'Bills', path: '/bills' },
    { icon: Calculator, label: 'Finance', path: '/finance' },
    { icon: Calculator, label: 'Accounting', path: '/accounting' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: FileText, label: 'Templates', path: '/templates' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: DollarSign, label: 'Salary Components', path: '/salary-components' },
    { icon: Key, label: 'Permission Settings', path: '/permissions' }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        {isOpen && <span className="font-semibold text-lg">SPEEDERP</span>}
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <User className="w-5 h-5" />
          </div>
          {isOpen && (
            <div>
              <div className="font-medium">AdminPanel</div>
              <div className="text-sm text-slate-400">Management System</div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm hover:bg-slate-800 transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile */}
      {/* <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-xs font-bold">FA</span>
          </div>
          {isOpen && (
            <div>
              <div className="text-sm font-medium">Fayyaz Ali</div>
              <div className="text-xs text-slate-400">Administrator</div>
            </div>
          )}
        </div>
        {isOpen && (
          <button className="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
            Live View
          </button>
        )}
      </div> */}
    </div>
  );
};

export default Sidebar;