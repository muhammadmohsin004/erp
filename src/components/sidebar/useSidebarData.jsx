import { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
  TrendingDown,
} from "lucide-react";
import { sidebarTranslations } from "../../translations/sidebarTranslations";
import { PiInvoiceFill } from "react-icons/pi";

export const useSidebarData = () => {
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

  // Load company information
  useEffect(() => {
    const loadCompanyData = () => {
      try {
        const companyData = {
          Name: t.defaultCompanyName,
          LogoUrl: null,
        };
        setCompany(companyData);
      } catch (error) {
        console.error("Error loading company data:", error);
        setCompany({
          Name: t.defaultCompanyName,
          LogoUrl: null,
        });
      }
    };

    loadCompanyData();
  }, [t.defaultCompanyName]);

  // Get user role
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
            label: t.ManageInvoices,
            path: getRoleBasedPath("/invoices/All-Invoices-list-with description"),
            icon: PiInvoiceFill,
          },
          {
            label: t.allInvoices,
            path: getRoleBasedPath("/invoices/list"),
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
            label: t.bankAccount,
            path: getRoleBasedPath("/bank-accounts"),
            icon: BarChart3,
          },
          {
            label: t.incomes,
            path: getRoleBasedPath("/finance/incomes"),
            icon: TrendingUp,
          },
          {
            label: t.incomescatagories,
            path: getRoleBasedPath("/finance/incomes/categories"),
            icon: TrendingUp,
          },
          {
            label: t.expenses,
            path: getRoleBasedPath("/finance/expenses"),
            icon: TrendingDown,
          },
          {
            label: t.expensescatagories,
            path: getRoleBasedPath("/finance/expenses/catagories"),
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
        icon: Building,
        label: t.vendor,
        path: getRoleBasedPath("/vendors"),
        roles: ["Admin"],
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

  // Toggle submenu expansion
  const toggleSubmenu = useCallback((menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  }, []);

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

  return {
    // State
    expandedMenus,
    company,
    isMobile,
    currentLanguage,
    location,

    // Data
    menuItems,
    userInfo,
    t,

    // Functions
    toggleSubmenu,
    isPathActive,
    isSubmenuActive,
  };
};
