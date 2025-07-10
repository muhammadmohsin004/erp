// components/layout/Sidebar.jsx - Updated with Warehouse as submenu under Inventory
import React, { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  Building,
  Home,
  BarChart2,
  CreditCard,
  Shield,
  Headphones,
  Calendar,
  ChevronDown,
  ChevronRight,
  Warehouse,
  ArrowDownLeftFromCircleIcon,
  ShieldUser,
  ServerCrashIcon,
MessageSquarePlus,
ImagePlay,
TableProperties,
  Archive,
  Boxes,
  BadgeDollarSign,
  TrendingUp,
  MessageSquareQuote,
  Plus,
  Receipt,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  // Get user role from localStorage
  const userRole = localStorage.getItem("role");

  // Helper function to get role-based path prefix
  const getRoleBasedPath = (basePath) => {
    switch (userRole) {
      case "SuperAdmin":
        return `/superadmin${basePath}`;
      case "Admin":
        return `/admin${basePath}`;
      case "Manager":
        return `/manager${basePath}`;
      case "Employee":
        return `/employee${basePath}`;
      case "User":
        return `/user${basePath}`;
      case "Viewer":
        return `/viewer${basePath}`;
      default:
        return basePath;
    }
  };

  // Toggle submenu expansion
  const toggleSubmenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // SuperAdmin menu items based on your menu data
  const superAdminMenuItems = [
    {
      icon: Home,
      label: "Dashboard",
      submenu: true,
      key: "superadmin-dashboard",
      submenuItems: [
        {
          label: "Overview",
          path: "/superadmin/dashboard",
          icon: FileText,
        },
        {
          label: "Analytics",
          path: "/superadmin/super-analytics",
          icon: BarChart2,
        },
      ],
    },
    {
      icon: Package,
      label: "Companies Management",
      submenu: true,
      key: "companies-management",
      submenuItems: [
        {
          label: "Manage Companies",
          path: "/superadmin/companies",
        },
        {
          label: "Add New Company",
          path: "/superadmin/add-company",
        },
      ],
    },
    {
      icon: Users,
      label: "User Management",
      submenu: true,
      key: "user-management",
      submenuItems: [
        {
          label: "Manage Users",
          path: "/superadmin/manage-users",
        },
      ],
    },
    {
      icon: DollarSign,
      label: "Plans & Subscriptions",
      submenu: true,
      key: "plans-subscriptions",
      submenuItems: [
        {
          label: "Manage subscription",
          path: "/superadmin/manage-plan",
        },
        {
          label: "Subscriptions",
          path: "/superadmin/subscription",
        },
        {
          label: "Subscription Reports",
          path: "/superadmin/subscription-report",
        },
      ],
    },
    {
      icon: CreditCard,
      label: "Payments & Invoices",
      submenu: true,
      key: "payments-invoices",
      submenuItems: [
        {
          label: "Payment Transactions",
          path: "/superadmin/Payment-transactions",
        },
        {
          label: "Manage Invoices",
          path: "/superadmin/manage-invoices",
        },
        {
          label: "Create Invoice",
          path: "/superadmin/create-invoices",
        },
        {
          label: "Refunds",
          path: "/superadmin/refunds",
        },
      ],
    },
    {
      icon: Shield,
      label: "Modules & Permissions",
      submenu: true,
      key: "modules-permissions",
      submenuItems: [
        {
          label: "Manage Modules",
          path: "/superadmin/manage-modules",
        },
      ],
    },
    {
      icon: Headphones,
      label: "Support / Tickets",
      submenu: true,
      key: "support-tickets",
      submenuItems: [
        {
          label: "Manage Tickets",
          path: "/superadmin/manage-ticket",
        },
      ],
    },
    {
      icon: FileText,
      label: "Activity Logs",
      submenu: true,
      key: "activity-logs",
      submenuItems: [
        {
          label: "System Logs",
          path: "/superadmin/system-logs",
        },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      submenu: true,
      key: "superadmin-settings",
      submenuItems: [
        {
          label: "System Settings",
          path: "/superadmin/settings/system",
        },
        {
          label: "Account Settings",
          path: "/superadmin/settings/account",
        },
        {
          label: "SMTP Settings",
          path: "/superadmin/settings/smtp",
        },
      ],
    },
  ];

  // Regular menu items for other roles (updated with Inventory submenu)
  const regularMenuItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: getDashboardPath(userRole),
      roles: ["Admin", "Manager", "Employee", "User", "Viewer"],
    },
    {
      icon: Building,
      label: "Company Branches",
      path: getRoleBasedPath("/company-branches"),
      roles: ["Admin"],
    },
    {
      icon: Users,
      label: "Clients",
      path: getRoleBasedPath("/clients"),
      roles: ["Admin", "Manager", "Employee"],
    },
    // Updated Inventory with submenu including Warehouse
    {
      icon: Package,
      label: "Inventory",
      submenu: true,
      key: "inventory-management",
      roles: ["Admin", "Manager", "Employee"],
      submenuItems: [
        {
          label: "Inventory Overview",
          path: getRoleBasedPath("/inventory"),
          icon: Archive,
        },
        {
          label: "Warehouses",
          path: getRoleBasedPath("/WareHouse"),
          icon: Warehouse,
        },
        {
          label: "Default Warehouse",
          path: getRoleBasedPath("/Defualt-WareHouse"),
          icon: ArrowDownLeftFromCircleIcon,
        },
        {
          label: "Suppliers",
          path: getRoleBasedPath("/Manage-Suppliers"),
          icon: ShieldUser,
        },
        {
          label: "Services",
          path: getRoleBasedPath("/Services-Manager"),
          icon: ServerCrashIcon,
        },
         {
          label: "Products Manager",
          path: getRoleBasedPath("/Products-Manager"),
          icon: MessageSquarePlus,
        },
        {
          label: "Products Images Manager",
          path: getRoleBasedPath("/product-Images-Manager"),
          icon: ImagePlay,
        },
        {
          label: "Requition Manager",
          path: getRoleBasedPath("/Requsition-Manager"),
          icon: TableProperties,
        },
        {
          label: "PriceList Manager",
          path: getRoleBasedPath("/Price-List-Manager"),
          icon: BadgeDollarSign,
        },
        {
          label: "Stock Management",
          path: getRoleBasedPath("/stock"),
          icon: Boxes,
        },
      ],
    },
    {
  icon: DollarSign,
  label: "Sales",
  submenu: true,
  key: "sales-management",
  roles: ["Admin", "Manager", "Employee"],
  submenuItems: [
    
    {
      label: "Invoice Dashboard",
      path: getRoleBasedPath("/invoice-dashboard"),
      icon: Receipt,
    },
    {
      label: "All Invoices",
      path: getRoleBasedPath("/invoices"),
      icon: FileText,
    },
    {
      label: "Create Invoice",
      path: getRoleBasedPath("/new-invoice"),
      icon: Plus,
    },
    
  ],
},
    {
      icon: FileText,
      label: "Bills",
      path: getRoleBasedPath("/bills"),
      roles: ["Admin", "Manager", "Employee"],
    },
    {
      icon: Calculator,
      label: "Finance",
      path: getRoleBasedPath("/finance"),
      roles: ["Admin", "Manager"],
    },
    {
      icon: Calculator,
      label: "Accounting",
      path: getRoleBasedPath("/accounting"),
      roles: ["Admin", "Manager"],
    },
    {
      icon: Users,
      label: "Employees",
      path: getRoleBasedPath("/employees"),
      roles: ["Admin", "Manager"],
    },
    {
      icon: FileText,
      label: "Reports",
      path: getRoleBasedPath("/reports"),
      roles: ["Admin", "Manager"],
    },
    {
      icon: FileText,
      label: "Templates",
      path: getRoleBasedPath("/templates"),
      roles: ["Admin", "Manager"],
    },
    {
      icon: Settings,
      label: "Settings",
      path: getRoleBasedPath("/settings"),
      roles: ["Admin", "Manager"],
    },
    {
      icon: DollarSign,
      label: "Salary Components",
      path: getRoleBasedPath("/salary-components"),
      roles: ["Admin", "Manager"],
    },
    {
      icon: Key,
      label: "Permissions",
      path: getRoleBasedPath("/permissions"),
      roles: ["Admin"],
    },
  ];

  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    if (userRole === "SuperAdmin") {
      return superAdminMenuItems;
    }
    return regularMenuItems.filter((item) => item.roles.includes(userRole));
  }, [userRole]);

  // Get user info for display
  const getUserInfo = () => {
    const role = userRole || "Guest";
    const displayName =
      localStorage.getItem("username") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.firstName ||
      "User";

    return { role, displayName };
  };

  const { role, displayName } = getUserInfo();

  // Helper function to check if current path is active
  const isPathActive = (itemPath, currentPath) => {
    if (itemPath.includes("/dashboard")) {
      return currentPath === itemPath;
    }
    return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
  };

  // Check if any submenu item is active
  const isSubmenuActive = (submenuItems, currentPath) => {
    return submenuItems.some((item) => isPathActive(item.path, currentPath));
  };

  // Auto-expand submenu if any of its items are active
  React.useEffect(() => {
    menuItems.forEach((item) => {
      if (item.submenu && isSubmenuActive(item.submenuItems, location.pathname)) {
        setExpandedMenus((prev) => ({
          ...prev,
          [item.key]: true,
        }));
      }
    });
  }, [location.pathname, menuItems]);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white text-gray-700 transition-all duration-300 z-50 shadow-2xl border-r border-gray-200 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        {isOpen && (
          <span className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
            ESolution ERP
          </span>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <div>
              <div className="font-medium text-sm text-gray-800">
                {displayName}
              </div>
              <div className="text-xs text-gray-500">{role}</div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          if (item.submenu) {
            const isExpanded = expandedMenus[item.key];
            const hasActiveSubmenu = isSubmenuActive(
              item.submenuItems,
              location.pathname
            );

            return (
              <div key={index}>
                {/* Main menu item with submenu */}
                <div
                  className={`flex items-center px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-50 hover:border-r-2 hover:border-purple-300 transition-all duration-200 cursor-pointer group relative ${
                    hasActiveSubmenu
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-r-4 border-purple-400 shadow-lg"
                      : "text-gray-700 hover:text-purple-700"
                  }`}
                  onClick={() => toggleSubmenu(item.key)}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {isOpen && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 ml-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 ml-2" />
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed sidebar */}
                  {!isOpen && (
                    <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}

                  {/* Submenu for collapsed sidebar */}
                  {!isOpen && (
                    <div className="absolute left-16 top-0 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto min-w-48">
                      <div className="p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      {item.submenuItems.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          className={({ isActive }) => {
                            const isCurrentActive =
                              isActive ||
                              isPathActive(subItem.path, location.pathname);

                            return `flex items-center px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-50 transition-all duration-200 ${
                              isCurrentActive
                                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                                : "text-gray-600 hover:text-purple-700"
                            } ${subIndex === item.submenuItems.length - 1 ? 'rounded-b-lg' : ''}`;
                          }}
                        >
                          {subItem.icon && (
                            <subItem.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                          )}
                          <span className="truncate">{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submenu items for expanded sidebar */}
                {isOpen && isExpanded && (
                  <div className="bg-gray-50">
                    {item.submenuItems.map((subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subItem.path}
                        className={({ isActive }) => {
                          const isCurrentActive =
                            isActive ||
                            isPathActive(subItem.path, location.pathname);

                          return `flex items-center px-8 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-50 transition-all duration-200 ${
                            isCurrentActive
                              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                              : "text-gray-600 hover:text-purple-700"
                          }`;
                        }}
                      >
                        {subItem.icon && (
                          <subItem.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">{subItem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            // Regular menu item without submenu
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => {
                  const isCurrentActive =
                    isActive || isPathActive(item.path, location.pathname);

                  return `flex items-center px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-50 hover:border-r-2 hover:border-purple-300 transition-all duration-200 group relative ${
                    isCurrentActive
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-r-4 border-purple-400 shadow-lg"
                      : "text-gray-700 hover:text-purple-700"
                  }`;
                }}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
                
                {/* Tooltip for collapsed sidebar */}
                {!isOpen && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </NavLink>
            );
          }
        })}
      </nav>

      {/* Bottom Section - Role indicator */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Access Level:{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-medium">
              {role}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
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
    case "SuperAdmin":
      return "/superadmin/dashboard";
    case "Admin":
      return "/admin/dashboard";
    case "Manager":
      return "/manager/dashboard";
    case "Employee":
      return "/employee/dashboard";
    case "User":
      return "/user/dashboard";
    case "Viewer":
      return "/viewer/dashboard";
    default:
      return "/dashboard";
  }
}

export default Sidebar;