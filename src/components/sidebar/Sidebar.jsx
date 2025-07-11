import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  Wallet,
  PlusCircle,
  TrendingDown,
  X,
  Menu,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [company, setCompany] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Load company information from localStorage
  useEffect(() => {
    const loadCompanyData = () => {
      try {
        const companyData = localStorage.getItem("company");
        if (companyData) {
          const parsedCompany = JSON.parse(companyData);
          setCompany(parsedCompany);
        }
      } catch (error) {
        console.error("Error loading company data:", error);
        // Fallback company data
        setCompany({
          Name: "ESolution ERP",
          LogoUrl: null
        });
      }
    };

    loadCompanyData();
  }, []);

  // Get user role from localStorage with error handling
  const userRole = useMemo(() => {
    try {
      return localStorage.getItem("role") || "User";
    } catch (error) {
      console.error("Error getting user role:", error);
      return "User";
    }
  }, []);

  // Helper function to get role-based path prefix
  const getRoleBasedPath = useCallback((basePath) => {
    const rolePathMap = {
      SuperAdmin: `/superadmin${basePath}`,
      Admin: `/admin${basePath}`,
      Manager: `/manager${basePath}`,
      Employee: `/employee${basePath}`,
      User: `/user${basePath}`,
      Viewer: `/viewer${basePath}`,
    };
    return rolePathMap[userRole] || basePath;
  }, [userRole]);

  // Helper function to get dashboard path based on role
  const getDashboardPath = useCallback(() => {
    const dashboardPaths = {
      SuperAdmin: "/superadmin/dashboard",
      Admin: "/admin/dashboard", 
      Manager: "/manager/dashboard",
      Employee: "/employee/dashboard",
      User: "/user/dashboard",
      Viewer: "/viewer/dashboard",
    };
    return dashboardPaths[userRole] || "/dashboard";
  }, [userRole]);

  // Toggle submenu expansion
  const toggleSubmenu = useCallback((menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  }, []);

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = useCallback(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [isMobile, onClose]);

  // SuperAdmin menu configuration
  const superAdminMenuItems = useMemo(() => [
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
          icon: Building,
        },
        {
          label: "Add New Company",
          path: "/superadmin/add-company",
          icon: Plus,
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
          icon: Users,
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
          icon: Settings,
        },
        {
          label: "Subscriptions",
          path: "/superadmin/subscription",
          icon: CreditCard,
        },
        {
          label: "Subscription Reports",
          path: "/superadmin/subscription-report",
          icon: FileText,
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
          icon: DollarSign,
        },
        {
          label: "Manage Invoices",
          path: "/superadmin/manage-invoices",
          icon: FileText,
        },
        {
          label: "Create Invoice",
          path: "/superadmin/create-invoices",
          icon: Plus,
        },
        {
          label: "Refunds",
          path: "/superadmin/refunds",
          icon: TrendingDown,
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
          icon: Package,
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
          icon: MessageSquarePlus,
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
          icon: Archive,
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
          icon: Settings,
        },
        {
          label: "Account Settings",
          path: "/superadmin/settings/account",
          icon: User,
        },
        {
          label: "SMTP Settings",
          path: "/superadmin/settings/smtp",
          icon: MessageSquarePlus,
        },
      ],
    },
  ], []);

  // Regular menu items for other roles
  const regularMenuItems = useMemo(() => [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: getDashboardPath(),
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
          label: "Requisition Manager",
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
          path: getRoleBasedPath("/stock/movements"),
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
      icon: Calculator,
      label: "Finance",
      submenu: true,
      key: "finance-management",
      roles: ["Admin", "Manager", "Employee"],
      submenuItems: [
        {
          label: "Dashboard",
          path: getRoleBasedPath("/finance"),
          icon: BarChart3,
        },
        {
          label: "Incomes",
          path: getRoleBasedPath("/finance/incomes"),
          icon: TrendingUp,
        },
        {
          label: "Expenses",
          path: getRoleBasedPath("/finance/expenses"),
          icon: TrendingDown,
        },
        {
          label: "Balance Sheet",
          path: getRoleBasedPath("/finance/balance"),
          icon: Wallet,
        },
        {
          label: "Reports",
          path: getRoleBasedPath("/finance/reports"),
          icon: FileText,
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
      label: "Accounting",
      path: getRoleBasedPath("/accounting"),
      roles: ["Admin", "Manager"],
    },
    {
      icon: Users,
      label: "Employees",
      submenu: true,
      key: "employee-management", 
      roles: ["Admin", "Manager", "Employee"],
      submenuItems: [
        {
          label: "Manage Employees",
          path: getRoleBasedPath("/manage-employee"),
          icon: Users,
        },
        {
          label: "Add Employee",
          path: getRoleBasedPath("/add-employee"),
          icon: Plus,
        },
        {
          label: "Employee Salary",
          path: getRoleBasedPath("/employee-salary"),
          icon: DollarSign,
        },
      ],
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
      label: "Salary Management",
      submenu: true,
      key: "salary-management",
      roles: ["Admin", "Manager", "Employee"],
      submenuItems: [
        {
          label: "Salary",
          path: getRoleBasedPath("/salary"),
          icon: Receipt,
        },
        {
          label: "Salary Components",
          path: getRoleBasedPath("/salary-components"),
          icon: FileText,
        },
        {
          label: "Overtime",
          path: getRoleBasedPath("/overtime"),
          icon: Plus,
        },
      ],
    },
    {
      icon: Key,
      label: "Permissions",
      path: getRoleBasedPath("/permissions"),
      roles: ["Admin"],
    },
  ], [getRoleBasedPath, getDashboardPath]);

  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    if (userRole === "SuperAdmin") {
      return superAdminMenuItems;
    }
    return regularMenuItems.filter((item) => item.roles?.includes(userRole));
  }, [userRole, superAdminMenuItems, regularMenuItems]);

  // Get user info for display
  const userInfo = useMemo(() => {
    try {
      const role = userRole || "Guest";
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const displayName = userData.F_Name && userData.L_Name 
                         ? `${userData.F_Name} ${userData.L_Name}`
                         : userData.F_Name || 
                           localStorage.getItem("username") || 
                           "User";
      
      return { 
        role, 
        displayName,
        email: userData.Email || "",
        companyName: userData.CompanyName || "",
        fullUserData: userData
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      return { 
        role: "Guest", 
        displayName: "User",
        email: "",
        companyName: "",
        fullUserData: {}
      };
    }
  }, [userRole]);

  // Helper function to check if current path is active
  const isPathActive = useCallback((itemPath, currentPath) => {
    if (itemPath.includes("/dashboard")) {
      return currentPath === itemPath;
    }
    return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
  }, []);

  // Check if any submenu item is active
  const isSubmenuActive = useCallback((submenuItems, currentPath) => {
    return submenuItems.some((item) => isPathActive(item.path, currentPath));
  }, [isPathActive]);

  // Auto-expand submenu if any of its items are active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.submenu && isSubmenuActive(item.submenuItems, location.pathname)) {
        setExpandedMenus((prev) => ({
          ...prev,
          [item.key]: true,
        }));
      }
    });
  }, [location.pathname, menuItems, isSubmenuActive]);

  // Company logo/initial component
  const CompanyLogo = useMemo(() => {
    if (!company) return null;

    const companyInitial = company.Name?.charAt(0)?.toUpperCase() || "E";
    
    return (
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
        {company.LogoUrl ? (
          <img 
            src={company.LogoUrl} 
            alt={company.Name}
            className="w-6 h-6 rounded object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <span 
          className={`text-white font-bold text-sm ${company.LogoUrl ? 'hidden' : 'flex'}`}
          style={{ display: company.LogoUrl ? 'none' : 'flex' }}
        >
          {companyInitial}
        </span>
      </div>
    );
  }, [company]);

  // Render menu item
  const renderMenuItem = useCallback((item, index) => {
    if (item.submenu) {
      const isExpanded = expandedMenus[item.key];
      const hasActiveSubmenu = isSubmenuActive(item.submenuItems, location.pathname);

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
            {!isOpen && !isMobile && (
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                {item.label}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}

            {/* Submenu for collapsed sidebar */}
            {!isOpen && !isMobile && (
              <div className="absolute left-16 top-0 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto min-w-48">
                <div className="p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                {item.submenuItems.map((subItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subItem.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) => {
                      const isCurrentActive = isActive || isPathActive(subItem.path, location.pathname);
                      return `flex items-center px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-50 transition-all duration-200 ${
                        isCurrentActive
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                          : "text-gray-600 hover:text-purple-700"
                      } ${subIndex === item.submenuItems.length - 1 ? "rounded-b-lg" : ""}`;
                    }}
                  >
                    {subItem.icon && <subItem.icon className="w-4 h-4 mr-2 flex-shrink-0" />}
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
                  onClick={handleLinkClick}
                  className={({ isActive }) => {
                    const isCurrentActive = isActive || isPathActive(subItem.path, location.pathname);
                    return `flex items-center px-8 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-50 transition-all duration-200 ${
                      isCurrentActive
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                        : "text-gray-600 hover:text-purple-700"
                    }`;
                  }}
                >
                  {subItem.icon && <subItem.icon className="w-4 h-4 mr-2 flex-shrink-0" />}
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
          onClick={handleLinkClick}
          className={({ isActive }) => {
            const isCurrentActive = isActive || isPathActive(item.path, location.pathname);
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
          {!isOpen && !isMobile && (
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
              {item.label}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </NavLink>
      );
    }
  }, [isOpen, isMobile, expandedMenus, toggleSubmenu, isSubmenuActive, location.pathname, isPathActive, handleLinkClick]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white text-gray-700 transition-all duration-300 z-50 shadow-2xl border-r border-gray-200 ${
          isMobile 
            ? `w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : isOpen 
            ? "w-64" 
            : "w-16"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            {CompanyLogo}
            {isOpen && (
              <span className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent truncate">
                {company?.Name || "ESolution ERP"}
              </span>
            )}
          </div>
          
          {/* Close button for mobile */}
          {isMobile && isOpen && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm text-gray-800 truncate">
                  {userInfo.displayName}
                </div>
                <div className="text-xs text-purple-600 font-medium truncate">{userInfo.role}</div>
                {userInfo.email && (
                  <div className="text-xs text-gray-500 truncate">{userInfo.email}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-160px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <nav className="mt-4">
            {menuItems.map(renderMenuItem)}
          </nav>
        </div>

        {/* Bottom Section - Role indicator */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Access Level:{" "}
              <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-medium">
                {userInfo.role}
              </span>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 mt-1 truncate">
                Current: {location.pathname}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;