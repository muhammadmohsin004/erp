// components/layout/Sidebar.jsx - Role-based navigation with proper paths
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
  
  // Helper function to get role-based path prefix
  const getRoleBasedPath = (basePath) => {
    switch (userRole) {
      case 'SuperAdmin':
        return `/superadmin${basePath}`;
      case 'Admin':
        return `/admin${basePath}`;
      case 'Manager':
        return `/manager${basePath}`;
      case 'Employee':
        return `/employee${basePath}`;
      case 'User':
        return `/user${basePath}`;
      case 'Viewer':
        return `/viewer${basePath}`;
      default:
        return basePath;
    }
  };

  // Define all menu items with their role restrictions and role-based paths
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
      path: getRoleBasedPath('/companies'),
      roles: ['SuperAdmin']
    },
    { 
      icon: Users, 
      label: 'Clients', 
      path: getRoleBasedPath('/clients'),
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee']
    },
    { 
      icon: Package, 
      label: 'Inventory', 
      path: getRoleBasedPath('/inventory'),
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee']
    },
    { 
      icon: DollarSign, 
      label: 'Sales', 
      path: getRoleBasedPath('/sales'),
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee']
    },
    { 
      icon: FileText, 
      label: 'Bills', 
      path: getRoleBasedPath('/bills'),
      roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee']
    },
    { 
      icon: Calculator, 
      label: 'Finance', 
      path: getRoleBasedPath('/finance'),
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: Calculator, 
      label: 'Accounting', 
      path: getRoleBasedPath('/accounting'),
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: Users, 
      label: 'Employees', 
      path: getRoleBasedPath('/employees'),
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: FileText, 
      label: 'Reports', 
      path: getRoleBasedPath('/reports'),
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: FileText, 
      label: 'Templates', 
      path: getRoleBasedPath('/templates'),
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: getRoleBasedPath('/settings'),
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: DollarSign, 
      label: 'Salary Components', 
      path: getRoleBasedPath('/salary-components'),
      roles: ['SuperAdmin', 'Admin', 'Manager']
    },
    { 
      icon: Key, 
      label: 'Permissions', 
      path: getRoleBasedPath('/permissions'),
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
    const displayName = localStorage.getItem('username') || 
                       JSON.parse(localStorage.getItem('user') || '{}')?.firstName || 
                       'User';
    
    return { role, displayName };
  };

  const { role, displayName } = getUserInfo();

  // Helper function to check if current path is active
  const isPathActive = (itemPath, currentPath) => {
    // Special handling for dashboard routes
    if (itemPath.includes('/dashboard')) {
      return currentPath === itemPath;
    }
    // For other routes, check if current path starts with the item path
    return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        {isOpen && <span className="font-semibold text-lg">ESolution ERP</span>}
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
              // Check if current path matches the item path
              const isCurrentActive = isActive || isPathActive(item.path, location.pathname);
              
              return `flex items-center px-4 py-3 text-sm hover:bg-slate-800 transition-colors ${
                isCurrentActive ? 'bg-blue-600 text-white border-r-2 border-blue-400' : 'text-slate-300'
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
            Access Level: <span className="text-blue-400 font-medium">{role}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Current Path: {location.pathname}
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
      return '/superadmin/dashboard';
    case 'Admin':
      return '/admin/dashboard';
    case 'Manager':
      return '/manager/dashboard';
    case 'Employee':
      return '/employee/dashboard';
    case 'User':
      return '/user/dashboard';
    case 'Viewer':
      return '/viewer/dashboard';
    default:
      return '/dashboard';
  }
}

export default Sidebar;