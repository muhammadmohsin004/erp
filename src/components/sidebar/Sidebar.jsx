import React, { useMemo, useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { sidebarTranslations } from "../../translations/sidebarTranslations";

const Sidebar = ({ isOpen, onClose, isRTL }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [company, setCompany] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Get current language from Redux store
  const { language: currentLanguage } = useSelector((state) => state.language);

  // Get translations for current language
  const t = sidebarTranslations[currentLanguage] || sidebarTranslations.en;

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Load company information - using state instead of localStorage
  useEffect(() => {
    const loadCompanyData = () => {
      try {
        // Simulating company data - replace with your actual data source
        const companyData = {
          Name: t.defaultCompanyName,
          LogoUrl: null,
        };
        setCompany(companyData);
      } catch (error) {
        console.error("Error loading company data:", error);
        // Fallback company data
        setCompany({
          Name: t.defaultCompanyName,
          LogoUrl: null,
        });
      }
    };

    loadCompanyData();
  }, [t.defaultCompanyName]);

  // Get user role - using state instead of localStorage
  const userRole = useMemo(() => {
    try {
      const role = localStorage.getItem("role");
      return role;
    } catch (error) {
      console.error("Error getting user role:", error);
      return "User";
    }
  }, []);

  // Helper function to get role-based path prefix
  const getRoleBasedPath = useCallback(
    (basePath) => {
      const rolePathMap = {
        SuperAdmin: `/superadmin${basePath}`,
        Admin: `/admin${basePath}`,
        Manager: `/manager${basePath}`,
        Employee: `/employee${basePath}`,
        User: `/user${basePath}`,
        Viewer: `/viewer${basePath}`,
      };
      return rolePathMap[userRole] || basePath;
    },
    [userRole]
  );

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
  const superAdminMenuItems = useMemo(
    () => [
      {
        icon: Home,
        label: t.dashboard,
        submenu: true,
        key: "superadmin-dashboard",
        submenuItems: [
          {
            label: t.overview,
            path: "/superadmin/dashboard",
            icon: FileText,
          },
          {
            label: t.analytics,
            path: "/superadmin/super-analytics",
            icon: BarChart2,
          },
        ],
      },
      {
        icon: Package,
        label: t.companiesManagement,
        submenu: true,
        key: "companies-management",
        submenuItems: [
          {
            label: t.manageCompanies,
            path: "/superadmin/companies",
            icon: Building,
          },
          {
            label: t.addNewCompany,
            path: "/superadmin/add-company",
            icon: Plus,
          },
        ],
      },
      {
        icon: Users,
        label: t.userManagement,
        submenu: true,
        key: "user-management",
        submenuItems: [
          {
            label: t.manageUsers,
            path: "/superadmin/manage-users",
            icon: Users,
          },
        ],
      },
      {
        icon: DollarSign,
        label: t.plansSubscriptions,
        submenu: true,
        key: "plans-subscriptions",
        submenuItems: [
          {
            label: t.manageSubscription,
            path: "/superadmin/manage-plan",
            icon: Settings,
          },
          {
            label: t.subscriptions,
            path: "/superadmin/subscription",
            icon: CreditCard,
          },
          {
            label: t.subscriptionReports,
            path: "/superadmin/subscription-report",
            icon: FileText,
          },
        ],
      },
      {
        icon: CreditCard,
        label: t.paymentsInvoices,
        submenu: true,
        key: "payments-invoices",
        submenuItems: [
          {
            label: t.paymentTransactions,
            path: "/superadmin/Payment-transactions",
            icon: DollarSign,
          },
          {
            label: t.manageInvoices,
            path: "/superadmin/manage-invoices",
            icon: FileText,
          },
          {
            label: t.createInvoice,
            path: "/superadmin/create-invoices",
            icon: Plus,
          },
          {
            label: t.refunds,
            path: "/superadmin/refunds",
            icon: TrendingDown,
          },
        ],
      },
      {
        icon: Shield,
        label: t.modulesPermissions,
        submenu: true,
        key: "modules-permissions",
        submenuItems: [
          {
            label: t.manageModules,
            path: "/superadmin/manage-modules",
            icon: Package,
          },
        ],
      },
      {
        icon: Headphones,
        label: t.supportTickets,
        submenu: true,
        key: "support-tickets",
        submenuItems: [
          {
            label: t.manageTickets,
            path: "/superadmin/manage-ticket",
            icon: MessageSquarePlus,
          },
        ],
      },
      {
        icon: FileText,
        label: t.activityLogs,
        submenu: true,
        key: "activity-logs",
        submenuItems: [
          {
            label: t.systemLogs,
            path: "/superadmin/system-logs",
            icon: Archive,
          },
        ],
      },
      {
        icon: Settings,
        label: t.settings,
        submenu: true,
        key: "superadmin-settings",
        submenuItems: [
          {
            label: t.systemSettings,
            path: "/superadmin/settings/system",
            icon: Settings,
          },
          {
            label: t.accountSettings,
            path: "/superadmin/settings/account",
            icon: User,
          },
          {
            label: t.smtpSettings,
            path: "/superadmin/settings/smtp",
            icon: MessageSquarePlus,
          },
        ],
      },
    ],
    [t]
  );

  // Regular menu items for other roles
  const regularMenuItems = useMemo(
    () => [
      {
        icon: BarChart3,
        label: t.dashboard,
        path: getDashboardPath(),
        roles: ["Admin", "Manager", "Employee", "User", "Viewer"],
      },
      {
        icon: Building,
        label: t.companyBranches,
        path: getRoleBasedPath("/company-branches"),
        roles: ["Admin"],
      },
      {
        icon: Users,
        label: t.clients,
        path: getRoleBasedPath("/clients"),
        roles: ["Admin", "Manager", "Employee"],
      },
      {
        icon: Package,
        label: t.inventory,
        submenu: true,
        key: "inventory-management",
        roles: ["Admin", "Manager", "Employee"],
        submenuItems: [
          // {
          //   label: t.inventoryOverview,
          //   path: getRoleBasedPath("/inventory"),
          //   icon: Archive,
          // },
          {
            label: t.warehouses,
            path: getRoleBasedPath("/WareHouse"),
            icon: Warehouse,
          },
          {
            label: t.defaultWarehouse,
            path: getRoleBasedPath("/Defualt-WareHouse"),
            icon: ArrowDownLeftFromCircleIcon,
          },
          {
            label: t.suppliers,
            path: getRoleBasedPath("/Manage-Suppliers"),
            icon: ShieldUser,
          },
          {
            label: t.services,
            path: getRoleBasedPath("/Services-Manager"),
            icon: ServerCrashIcon,
          },
          {
            label: t.productsManager,
            path: getRoleBasedPath("/Products-Manager"),
            icon: MessageSquarePlus,
          },
          {
            label: t.productImagesManager,
            path: getRoleBasedPath("/product-Images-Manager"),
            icon: ImagePlay,
          },
          {
            label: t.requisitionManager,
            path: getRoleBasedPath("/Requsition-Manager"),
            icon: TableProperties,
          },
          {
            label: t.pricelistManager,
            path: getRoleBasedPath("/Price-List-Manager"),
            icon: BadgeDollarSign,
          },
          {
            label: t.stockManagement,
            path: getRoleBasedPath("/stock/movements"),
            icon: Boxes,
          },
        ],
      },
      {
        icon: Users,
        label: t.hrModule,
        submenu: true,
        key: "hr-module",
        roles: ["Admin", "Manager", "Employee"],
        submenuItems: [
          {
            label: t.manageEmployees,
            path: getRoleBasedPath("/manage-employee"),
            icon: Archive,
          },
          {
            label: t.addEmployee,
            path: getRoleBasedPath("/add-employee"),
            icon: Warehouse,
          },
          {
            label: t.employeeSalary,
            path: getRoleBasedPath("/employee-salary"),
            icon: ArrowDownLeftFromCircleIcon,
          },
          {
            label: t.salary,
            path: getRoleBasedPath("/salary"),
            icon: Receipt,
          },
          {
            label: t.salaryComponents,
            path: getRoleBasedPath("/salary-components"),
            icon: FileText,
          },
          {
            label: t.overtime,
            path: getRoleBasedPath("/overtime"),
            icon: Plus,
          },
          {
            label: t.attendance,
            path: getRoleBasedPath("/attendance"),
            icon: Plus,
          },
          {
            label: t.attendancePolicy,
            path: getRoleBasedPath("/attendance-policy"),
            icon: Plus,
          },
          {
            label: t.leaveManagement,
            path: getRoleBasedPath("/leave-management"),
            icon: Plus,
          },
        ],
      },
      {
        icon: DollarSign,
        label: t.sales,
        submenu: true,
        key: "sales-management",
        roles: ["Admin", "Manager", "Employee"],
        submenuItems: [
          {
            label: t.invoiceDashboard,
            path: getRoleBasedPath("/invoice-dashboard"),
            icon: Receipt,
          },
          {
            label: t.allInvoices,
            path: getRoleBasedPath("/invoices"),
            icon: FileText,
          },
          {
            label: t.createInvoice,
            path: getRoleBasedPath("/new-invoice"),
            icon: Plus,
          },
        ],
      },
      {
        icon: Calculator,
        label: t.finance,
        submenu: true,
        key: "finance-management",
        roles: ["Admin", "Manager", "Employee"],
        submenuItems: [
          {
            label: t.dashboard,
            path: getRoleBasedPath("/finance"),
            icon: BarChart3,
          },
          {
            label: t.incomes,
            path: getRoleBasedPath("/finance/incomes"),
            icon: TrendingUp,
          },
          {
            label: t.expenses,
            path: getRoleBasedPath("/finance/expenses"),
            icon: TrendingDown,
          },
          {
            label: t.balanceSheet,
            path: getRoleBasedPath("/finance/balance"),
            icon: Wallet,
          },
          {
            label: t.reports,
            path: getRoleBasedPath("/finance/reports"),
            icon: FileText,
          },
        ],
      },
      {
        icon: FileText,
        label: t.bills,
        path: getRoleBasedPath("/bills"),
        roles: ["Admin", "Manager", "Employee"],
      },
      {
        icon: Calculator,
        label: t.accounting,
        path: getRoleBasedPath("/accounting"),
        roles: ["Admin", "Manager"],
      },
      {
        icon: FileText,
        label: t.reports,
        path: getRoleBasedPath("/reports"),
        roles: ["Admin", "Manager"],
      },
      {
        icon: FileText,
        label: t.templates,
        path: getRoleBasedPath("/templates"),
        roles: ["Admin", "Manager"],
      },
      {
        icon: Settings,
        label: t.settings,
        path: getRoleBasedPath("/settings"),
        roles: ["Admin", "Manager"],
      },
      {
        icon: Key,
        label: t.permissions,
        path: getRoleBasedPath("/permissions"),
        roles: ["Admin"],
      },
    ],
    [getRoleBasedPath, getDashboardPath, t]
  );

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
      // Simulating user data - replace with your actual data source
      const userData = {
        F_Name: "John",
        L_Name: "Doe",
        Email: "john.doe@example.com",
        CompanyName: t.defaultCompanyName,
      };
      const displayName =
        userData.F_Name && userData.L_Name
          ? `${userData.F_Name} ${userData.L_Name}`
          : userData.F_Name || "User";

      return {
        role,
        displayName,
        email: userData.Email || "",
        companyName: userData.CompanyName || "",
        fullUserData: userData,
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      return {
        role: "Guest",
        displayName: "User",
        email: "",
        companyName: "",
        fullUserData: {},
      };
    }
  }, [userRole, t.defaultCompanyName]);

  // Helper function to check if current path is active
  const isPathActive = useCallback((itemPath, currentPath) => {
    if (itemPath.includes("/dashboard")) {
      return currentPath === itemPath;
    }
    return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
  }, []);

  // Check if any submenu item is active
  const isSubmenuActive = useCallback(
    (submenuItems, currentPath) => {
      return submenuItems.some((item) => isPathActive(item.path, currentPath));
    },
    [isPathActive]
  );

  // Auto-expand submenu if any of its items are active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.submenu &&
        isSubmenuActive(item.submenuItems, location.pathname)
      ) {
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
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}
        <span
          className={`text-white font-bold text-sm ${
            company.LogoUrl ? "hidden" : "flex"
          }`}
          style={{ display: company.LogoUrl ? "none" : "flex" }}
        >
          {companyInitial}
        </span>
      </div>
    );
  }, [company]);

  // Render menu item
  const renderMenuItem = useCallback(
    (item, index) => {
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
              className={`flex items-center px-4 py-3 text-sm  hover:border-r-2 hover:border-purple-300 transition-all duration-200 cursor-pointer group relative ${
                hasActiveSubmenu
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 border-r-4 border-purple-400 shadow-lg"
                  : "text-gray-700"
              } ${currentLanguage === "ar" ? "flex-row-reverse" : ""}`}
              onClick={() => toggleSubmenu(item.key)}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 ${
                  hasActiveSubmenu
                    ? "text-white"
                    : "text-gray-700 group-hover:text-black"
                } ${currentLanguage === "ar" ? "ml-3" : "mr-3"}`}
              />
              {isOpen && (
                <>
                  <span
                    className={`truncate flex-1 ${
                      hasActiveSubmenu ? "text-white" : "group-hover:text-black"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isExpanded ? (
                    <ChevronDown
                      className={`w-4 h-4 ${
                        hasActiveSubmenu
                          ? "text-white"
                          : "text-gray-700 group-hover:text-black"
                      } ${currentLanguage === "ar" ? "mr-2" : "ml-2"}`}
                    />
                  ) : (
                    <ChevronRight
                      className={`w-4 h-4 ${
                        hasActiveSubmenu
                          ? "text-white"
                          : "text-gray-700 group-hover:text-black"
                      } ${currentLanguage === "ar" ? "mr-2" : "ml-2"}`}
                    />
                  )}
                </>
              )}

              {/* Tooltip for collapsed sidebar */}
              {!isOpen && !isMobile && (
                <div
                  className={`absolute ${
                    currentLanguage === "ar" ? "right-16" : "left-16"
                  } top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none`}
                >
                  {item.label}
                  <div
                    className={`absolute ${
                      currentLanguage === "ar" ? "right-0" : "left-0"
                    } top-1/2 transform -translate-y-1/2 ${
                      currentLanguage === "ar"
                        ? "translate-x-1"
                        : "-translate-x-1"
                    } w-2 h-2 bg-gray-900 rotate-45`}
                  ></div>
                </div>
              )}

              {/* Submenu for collapsed sidebar */}
              {!isOpen && !isMobile && (
                <div
                  className={`absolute ${
                    currentLanguage === "ar" ? "right-16" : "left-16"
                  } top-0 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto min-w-48`}
                >
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
                        const isCurrentActive =
                          isActive ||
                          isPathActive(subItem.path, location.pathname);
                        return `flex items-center px-3 py-2 text-sm  transition-all duration-200 ${
                          isCurrentActive
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                            : "text-gray-600 hover:text-black"
                        } ${
                          currentLanguage === "ar" ? "flex-row-reverse" : ""
                        } ${subIndex === 0 ? "rounded-t-none" : ""} ${
                          subIndex === item.submenuItems.length - 1
                            ? "rounded-b-lg"
                            : ""
                        }`;
                      }}
                    >
                      <subItem.icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          currentLanguage === "ar" ? "ml-2" : "mr-2"
                        }`}
                      />
                      <span className="truncate">{subItem.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Submenu items for expanded sidebar */}
            {isOpen && isExpanded && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-r-4 border-purple-200">
                {item.submenuItems.map((subItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subItem.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) => {
                      const isCurrentActive =
                        isActive ||
                        isPathActive(subItem.path, location.pathname);
                      return `flex items-center px-8 py-2 text-sm  hover:border-r-2 hover:border-purple-300 transition-all duration-200 ${
                        isCurrentActive
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-r-4 border-purple-400 shadow-lg"
                          : "text-gray-600 hover:text-black"
                      } ${currentLanguage === "ar" ? "flex-row-reverse" : ""}`;
                    }}
                  >
                    <subItem.icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        currentLanguage === "ar" ? "ml-2" : "mr-2"
                      }`}
                    />
                    <span className="truncate">{subItem.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Regular menu item without submenu
      return (
        <NavLink
          key={index}
          to={item.path}
          onClick={handleLinkClick}
          className={({ isActive }) => {
            const isCurrentActive =
              isActive || isPathActive(item.path, location.pathname);
            return `flex items-center px-4 py-3 text-sm  hover:border-r-2 hover:border-purple-300 transition-all duration-200 group relative ${
              isCurrentActive
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-r-4 border-purple-400 shadow-lg"
                : "text-gray-700 hover:text-black"
            } ${currentLanguage === "ar" ? "flex-row-reverse" : ""}`;
          }}
        >
          <item.icon
            className={`w-5 h-5 flex-shrink-0 ${
              currentLanguage === "ar" ? "ml-3" : "mr-3"
            } ${
              isPathActive(item.path, location.pathname)
                ? "text-white"
                : "group-hover:text-black"
            }`}
          />
          {isOpen && (
            <span
              className={`truncate ${
                isPathActive(item.path, location.pathname)
                  ? "text-white"
                  : "group-hover:text-black"
              }`}
            >
              {item.label}
            </span>
          )}

          {/* Tooltip for collapsed sidebar */}
          {!isOpen && !isMobile && (
            <div
              className={`absolute ${
                currentLanguage === "ar" ? "right-16" : "left-16"
              } top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none`}
            >
              {item.label}
              <div
                className={`absolute ${
                  currentLanguage === "ar" ? "right-0" : "left-0"
                } top-1/2 transform -translate-y-1/2 ${
                  currentLanguage === "ar" ? "translate-x-1" : "-translate-x-1"
                } w-2 h-2 bg-gray-900 rotate-45`}
              ></div>
            </div>
          )}
        </NavLink>
      );
    },
    [
      expandedMenus,
      isSubmenuActive,
      location.pathname,
      toggleSubmenu,
      handleLinkClick,
      isPathActive,
      isOpen,
      isMobile,
      currentLanguage,
    ]
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed ${
          currentLanguage === "ar" ? "right-0" : "left-0 add-scroll"
        } top-0 h-full bg-white shadow-2xl border-r border-gray-200 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-60" : "w-16"
        } ${
          isMobile
            ? isOpen
              ? "translate-x-0"
              : currentLanguage === "ar"
              ? "translate-x-full"
              : "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700">
          {isOpen && (
            <div className="flex items-center">
              {CompanyLogo}
              <div className="min-w-0 flex-1">
                <h2 className="text-white font-bold text-lg truncate">
                  {company?.Name || t.defaultCompanyName}
                </h2>
              </div>
            </div>
          )}

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* User Info */}
        {isOpen && (
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userInfo.displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userInfo.email}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-purple-600 font-medium">
                    {t.accessLevel}: {userInfo.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div className="space-y-1">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          {isOpen ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                {t.current} {userInfo.role}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Online</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
