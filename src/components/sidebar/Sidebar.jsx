// components/layout/Sidebar.jsx - Role-based navigation
import React, { useMemo } from 'react';
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
  User,
  Building
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  // Get user role from localStorage
  const userRole = localStorage.getItem('role');
  
  // Define all menu items with their role restrictions (no permission checks)
  const allMenuItems = [
    { 
      icon: BarChart3, 
      label: 'Dashboard', 
      path: getDashboardPath(userRole),
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee', 'User', 'Viewer']
    },
    { 
      icon: Building, 
      label: 'Companies', 
      path: '/companies-management',
      roles: ['SuperAdmin']
    },
    { 
      icon: Users, 
      label: 'Clients', 
      path: '/clients',
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee']
    },
    { 
      icon: Package, 
      label: 'Inventory', 
      path: '/inventory',
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee']
    },
    { 
      icon: DollarSign, 
      label: 'Sales', 
      path: '/sales',
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee']
    },
    { 
      icon: FileText, 
      label: 'Bills', 
      path: '/bills',
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee']
    },
    { 
      icon: Calculator, 
      label: 'Finance', 
      path: '/finance',
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: Calculator, 
      label: 'Accounting', 
      path: '/accounting',
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: Users, 
      label: 'Employees', 
      path: '/employees',
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: FileText, 
      label: 'Reports', 
      path: '/reports',
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: FileText, 
      label: 'Templates', 
      path: '/templates',
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings',
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: DollarSign, 
      label: 'Salary Components', 
      path: '/salary-components',
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: Key, 
      label: 'Permissions', 
      path: '/permissions',
      roles: ['SuperAdmin', 'Admin']
    }
  ];

  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => 
      item.roles.includes(userRole)
    );
  }, [userRole]);

  // Get user info for display
  const getUserInfo = () => {
    const role = userRole || 'Guest';
    const displayName = localStorage.getItem('username') || 'User';
    
    return { role, displayName };
  };

  const { role, displayName } = getUserInfo();

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
              <div className="font-medium text-sm">{displayName}</div>
              <div className="text-xs text-slate-400">{role}</div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => {
              // Check if current path matches any of the dashboard variants
              const isDashboardActive = item.label === 'Dashboard' && (
                location.pathname === '/dashboard' || 
                location.pathname === '/admin/dashboard' || 
                location.pathname === '/admin/superadmin/dashboard'
              );
              
              return `flex items-center px-4 py-3 text-sm hover:bg-slate-800 transition-colors ${
                isActive || isDashboardActive ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`;
            }}
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            {isOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section - Role indicator */}
      {isOpen && (
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            Logged in as: <span className="text-blue-400 font-medium">{role}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get dashboard path based on role
function getDashboardPath(userRole) {
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
      return '/dashboard';
  }
}

export default Sidebar;