// routes/Route.jsx - Dynamic Routes Version
import React from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import Clients from "../pages/clients/Clients";
import LoginPage from "../pages/Auth/LoginPage";
import Signup from "../pages/Auth/Signup";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import NotFound from "../pages/error/NotFound";
import CompaniesManagement from "../pages/SuperAdmin/CompaniesManagement";
import ProtectedRoute from "./ProtectedRoute";
import NewClient from "../pages/clients/NewClient";
import WarehouseList from "../pages/WarehouseList/WarehouseList";
import NewWarehouse from "../pages/WarehouseList/NewWarehouse";
import DefaultWarehouseList from "../pages/WarehouseList/DefaultWarehouseList";
import SupplierList from "../pages/Inventories/Supplier/SupplierList";
import NewSupplier from "../pages/Inventories/Supplier/NewSupplier";
import SuperDashboard from "../pages/SuperAdmin/SuperDashboard";
import SuperAnalytics from "../pages/SuperAdmin/SuperDashboard/SuperAnalytics";
import AddCompany from "../pages/SuperAdmin/CompaniesManagement/AddCompany";
import ManageUsers from "../pages/SuperAdmin/UserManagement/ManageUsers";
import ServiceList from "../pages/Inventories/Service/ServiceList";
import NewService from "../pages/Inventories/Service/NewService";
import ProductsList from "../pages/Inventories/ProductsManager/ProductsList";
import ProductCategories from "../pages/Inventories/ProductsManager/ProductCategories";
import ProductBrands from "../pages/Inventories/ProductsManager/ProductBrands";
import ProductStatistics from "../pages/Inventories/ProductsManager/ProductStatistics";
import ProductImages from "../pages/Inventories/ProductsManager/ProductImages";
import ManagePlans from "../pages/SuperAdmin/Plans/ManagePlans";
import Subscription from "../pages/SuperAdmin/Plans/Subscription";
import SubscriptionReports from "../pages/SuperAdmin/Plans/SubscriptionReports";
import PaymentTransactions from "../pages/SuperAdmin/PaymentTransactions/PaymentTransactions";
import CreateInvoice from "../pages/SuperAdmin/ManageInvoices/CreateInvoice";
import Refunds from "../pages/SuperAdmin/Refunds/Refunds";
import ManageInvoices from "../pages/SuperAdmin/ManageInvoices/ManageInvoices";
import ManageModules from "../pages/SuperAdmin/Modules/ManageModules";
import ManageTickets from "../pages/SuperAdmin/ManageTickets";
import SystemLogs from "../pages/SuperAdmin/SystemLogs/SystemLogs";
import SystemSettings from "../pages/SuperAdmin/Settings/SystemSettings";
import AccountSettings from "../pages/SuperAdmin/Settings/AccountSettings";
import SmtpSettings from "../pages/SuperAdmin/Settings/SmtpSettings";
import NewProduct from "../pages/Inventories/ProductsManager/NewProduct";
import InvoiceDashboard from "../pages/Sale/Invoice/InvoiceDashboard";
// import InvoiceList from "../pages/Sale/Invoice/InvoiceList";
// import InvoiceView from "../pages/Sale/Invoice/InvoiceView";
import RequisitionList from "../pages/Inventories/Requisition/RequisitionList";
import NewRequisition from "../pages/Inventories/Requisition/NewRequisition";
import NewPriceList from "../pages/Inventories/PriceList/NewPriceList";
import PriceListList from "../pages/Inventories/PriceList/PriceListList";
import NewInvoice from "../pages/Sale/Invoice/NewInvoice";
import InvoicesList from "../pages/Sale/InvoicesList";
import DaftraInvoiceForm from "../pages/Sale/InvoiceForm";
import InvoiceDetails from "../pages/Sale/Invoice/InvoiceDetails";
import PaymentTracking from "../pages/Sale/Invoice/Components/PaymentTracking";
import ManageEmployees from "../pages/Employee/ManageEmployees";
import CreateNewEmployee from "../pages/Employee/CreateNewEmployee";
import EmployeeSalary from "../pages/Employee/EmployeeSalary";
import Salary from "../pages/Salary/Salary";
import CompanyBranchList from "../pages/CompanyManager/CompanyBranchList";
import CompanyBranchForm from "../pages/CompanyManager/CompanyBranchForm";
import CompanyBranchDetails from "../pages/CompanyManager/CompanyBranchDetails";
import StockMovementsList from "../pages/Inventories/StockManager/StockMovementsList";
import StockTransactionForm from "../pages/Inventories/StockManager/StockTransactionForm";
import StockMovementsReportView from "../pages/Inventories/StockManager/StockMovementsReportView";
import FinanceDashboard from "../pages/FinanceManager/FinanceDashboard";
// import IncomeList from "../pages/FinanceManager/IncomeList";
import ExpenseList from "../pages/FinanceManager/ExpenseList";
import FinancialReports from "../pages/FinanceManager/FinancialReports";
import BalanceSheet from "../pages/FinanceManager/BalanceSheet";
// import NewExpense from "../pages/FinanceManager/NewExpense";
// import NewIncome from "../pages/FinanceManager/NewIncome";
import SalaryComponent from "../pages/Salary/SalaryComponent";
import Overtime from "../pages/Salary/Overtime";
import AttendanceModule from "../pages/HRModule/Attendance/AttendanceModule";
import AttendancePolicyPage from "../pages/HRModule/AttendancePolicy/AttendancePolicyPage";
import AdminLeaveManagement from "../pages/HRModule/LeaveMangement/AdminLeaveManagement";
import EmployeeLeaveManagement from "../pages/HRModule/LeaveMangement/EmployeeLeaveManagement";
import VendorsManagement from "../pages/Vendors/VendorsManagement";
import BankAccountManagement from "../pages/BankAccountManagement/BankAccountManagement";
import FinanceIncome from "../pages/FinanceManager/FinanceIncome";
import FinanceExpenses from "../pages/FinanceManager/FinanceExpenses";
import ExpenseCategories from "../pages/FinanceManager/ExpenseCategories";
import IncomeCategories from "../pages/FinanceManager/IncomeCategories";
import InvoiceManagementPage from "../pages/Sale/Invoice/InvoiceManagementPage";
import InvoiceDemoApp from "../pages/Sale/Invoice/InvoiceDetailsPage";
import ClientsListPage from "../pages/clients/ClientsListPage";
import ClientDetailPage from "../pages/clients/ClientDetailPage";
import FinanceSettings from "../pages/FinanceManager/FinanceSettings";
import IncomeDetailsPage from "../pages/FinanceManager/IncomeDetails/IncomeDetailsPage";
import FinanceReports from "../pages/FinanceManager/Reports/FinanceReports";
// import InvoiceApp from "../pages/Sale/InvoiceApp/InvoiceApp";
// Helper function to get role-based dashboard path
const getDashboardPath = (userRole) => {
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
};

// Helper function to get role-based path prefix
const getRoleBasedPath = (basePath, userRole) => {
  switch (userRole) {
    case "SuperAdmin":
      return basePath.startsWith("/superadmin")
        ? basePath
        : `/superadmin${basePath}`;
    case "Admin":
      return basePath.startsWith("/admin") ? basePath : `/admin${basePath}`;
    case "Manager":
      return basePath.startsWith("/manager") ? basePath : `/manager${basePath}`;
    case "Employee":
      return basePath.startsWith("/employee")
        ? basePath
        : `/employee${basePath}`;
    case "User":
      return basePath;
    case "Viewer":
      return basePath;
    default:
      return basePath;
  }
};

// Helper component to handle role-based dashboard redirection
const DashboardRedirect = () => {
  const userRole = localStorage.getItem("role");
  const dashboardPath = getDashboardPath(userRole);

  console.log(
    "DashboardRedirect - Role:",
    userRole,
    "Redirecting to:",
    dashboardPath
  );

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={dashboardPath} replace />;
};

// Unauthorized component
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-4">
        You don't have permission to access this page.
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors mr-4"
      >
        Go Back
      </button>
      <button
        onClick={() => {
          const userRole = localStorage.getItem("role");
          const dashboardPath = getDashboardPath(userRole);
          window.location.href = dashboardPath;
        }}
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

// Route configuration with dynamic paths
const getRouteConfig = () => {
  return [
    // SuperAdmin Dashboard Routes
    {
      path: "/superadmin/dashboard",
      component: SuperDashboard,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/super-analytics",
      component: SuperAnalytics,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Companies Management Routes
    {
      path: "/superadmin/companies",
      component: CompaniesManagement,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/add-company",
      component: AddCompany,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin User Management Routes
    {
      path: "/superadmin/manage-users",
      component: ManageUsers,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Plans & Subscriptions Routes
    {
      path: "/superadmin/manage-plan",
      component: ManagePlans,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/subscription",
      component: Subscription,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/subscription-report",
      component: SubscriptionReports,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Payments & Invoices Routes
    {
      path: "/superadmin/Payment-transactions",
      component: PaymentTransactions,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/manage-invoices",
      component: ManageInvoices,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/create-invoices",
      component: CreateInvoice,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/refunds",
      component: Refunds,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Modules & Permissions Routes
    {
      path: "/superadmin/manage-modules",
      component: ManageModules,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Support / Tickets Routes
    {
      path: "/superadmin/manage-ticket",
      component: ManageTickets,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Activity Logs Routes
    {
      path: "/superadmin/system-logs",
      component: SystemLogs,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Settings Routes
    {
      path: "/superadmin/settings/system",
      component: SystemSettings,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/settings/account",
      component: AccountSettings,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/settings/smtp",
      component: SmtpSettings,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // Admin Dashboard Routes
    {
      path: "/admin/dashboard",
      component: Dashboard,
      roles: ["Admin"],
      layout: true,
    },
    {
      path: "/admin/v2/dashboard",
      component: Dashboard,
      roles: ["Admin"],
      layout: true,
    },

    // Admin Company Branches Routes

    // Manager Dashboard Routes
    {
      path: "/manager/dashboard",
      component: Dashboard,
      roles: ["Manager"],
      layout: true,
    },

    // Employee Dashboard Routes
    {
      path: "/employee/dashboard",
      component: Dashboard,
      roles: ["Employee"],
      layout: true,
    },

    // User Dashboard Routes
    {
      path: "/user/dashboard",
      component: Dashboard,
      roles: ["User"],
      layout: true,
    },

    // Viewer Dashboard Routes
    {
      path: "/viewer/dashboard",
      component: Dashboard,
      roles: ["Viewer"],
      layout: true,
    },

    // Legacy dashboard route
    {
      path: "/dashboard",
      component: Dashboard,
      roles: ["Admin", "Manager", "Employee", "User", "Viewer"],
      layout: true,
    },

    // Admin/Manager/Employee routes with dynamic paths
    {
      path: "/admin/clients",
      component: Clients,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/ManageClients",
      component: ClientsListPage,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/ViewClients-Details/:clientId",
      component: ClientDetailPage,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/new-clients",
      component: NewClient,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/manager/clients",
      component: Clients,
      roles: ["Manager", "Employee"],
      layout: true,
    },
    {
      path: "/employee/clients",
      component: Clients,
      roles: ["SuperAdmin", "Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/clients", // Legacy support
      component: Clients,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/inventory",
      component: () => <div>Inventory Page</div>,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/WareHouse",
      component: WarehouseList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/new-warehouse",
      component: NewWarehouse,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/Defualt-WareHouse",
      component: DefaultWarehouseList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },

    {
      path: "/admin/Manage-Suppliers",
      component: SupplierList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/new-supplier",
      component: NewSupplier,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/Services-Manager",
      component: ServiceList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/new-service",
      component: NewService,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/Products-Manager",
      component: ProductsList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/new-product",
      component: NewProduct,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/product-categories",
      component: ProductCategories,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/product-brands",
      component: ProductBrands,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/product-statistics",
      component: ProductStatistics,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/product-Images-Manager",
      component: ProductImages,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/Requsition-Manager",
      component: RequisitionList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/new-requisition",
      component: NewRequisition,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/Price-List-Manager",
      component: PriceListList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/new-price-list",
      component: NewPriceList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/invoice-dashboard",
      component: InvoiceDashboard,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/invoices",
      component: InvoicesList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },

    {
      path: "/admin/invoices/All-Invoices-list-with description",
      component: InvoiceManagementPage,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },

    {
      path: "/admin/invoices/new",
      component: DaftraInvoiceForm,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },

    //  {
    //   path: "/admin/invoices/Test",
    //   component: InvoiceApp,
    //   roles: ["Admin", "Manager", "Employee"],
    //   layout: true,
    // },
    {
      path: "/admin/invoices/edit/:id",
      component: DaftraInvoiceForm,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/showinvoices/Details/:invoiceId",
      component: InvoiceDemoApp,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/invoices/:id",
      component: InvoiceDetails,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/payments",
      component: PaymentTracking,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },

    {
      path: "/admin/new-invoice",
      component: NewInvoice,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    // {
    //   path: "/admin/invoice-view/:id",
    //   component: InvoiceView,
    //   roles: ["Admin", "Manager", "Employee"],
    //   layout: true,
    // },
    //update new
    {
      path: "/admin/company-branches",
      component: CompanyBranchList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/company-branches/new",
      component: CompanyBranchForm,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/stock/movements",
      component: StockMovementsList,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/stock/movements/report",
      component: StockMovementsReportView,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/stock/transactions/new",
      component: StockTransactionForm,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },

    {
      path: "/admin/company-branches/:id",
      component: CompanyBranchDetails,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/manager/inventory",
      component: () => <div>Inventory Page</div>,
      roles: ["Manager", "Employee"],
      layout: true,
    },
    {
      path: "/employee/inventory",
      component: () => <div>Inventory Page</div>,
      roles: ["Employee"],
      layout: true,
    },
    {
      path: "/inventory", // Legacy support
      component: () => <div>Inventory Page</div>,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/sales",
      component: () => <div>Sales Page</div>,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/manager/sales",
      component: () => <div>Sales Page</div>,
      roles: ["Manager", "Employee"],
      layout: true,
    },
    {
      path: "/employee/sales",
      component: () => <div>Sales Page</div>,
      roles: ["Employee"],
      layout: true,
    },
    {
      path: "/sales", // Legacy support
      component: () => <div>Sales Page</div>,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/bills",
      component: () => <div>Bills Page</div>,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/manager/bills",
      component: () => <div>Bills Page</div>,
      roles: ["Manager", "Employee"],
      layout: true,
    },
    {
      path: "/employee/bills",
      component: () => <div>Bills Page</div>,
      roles: ["Employee"],
      layout: true,
    },
    {
      path: "/bills", // Legacy support
      component: () => <div>Bills Page</div>,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },

    // Manager+ only routes
    {
      path: "/admin/finance",
      component: FinanceDashboard,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/bank-accounts",
      component: BankAccountManagement,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/finance/incomes",
      component: FinanceIncome,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/finance/incomes/categories",
      component: IncomeCategories,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },

    {
      path: "/admin/finance/incomes/Income Details /:id",
      component: IncomeDetailsPage,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },

    {
      path: "/admin/finance/Reports/Manager",
      component: FinanceReports,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },


    // {
    //   path: "/admin/finance/income/new",
    //   component: NewIncome,
    //   roles: ["Admin", "Manager", "Employee"],
    //   layout: true,
    // },
    {
      path: "/admin/finance/expenses",
      component: FinanceExpenses,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/finance/settings",
      component: FinanceSettings,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/finance/expenses/catagories",
      component: ExpenseCategories,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/finance/expenses",
      component: FinanceExpenses,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    // {
    //   path: "/admin/finance/expense/new",
    //   component: NewExpense,
    //   roles: ["Admin", "Manager", "Employee"],
    //   layout: true,
    // },
    {
      path: "/admin/finance/balance",
      component: BalanceSheet,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/finance/reports",
      component: FinancialReports,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/vendors",
      component: VendorsManagement,
      roles: ["Admin", "Manager", "Employee"],
      layout: true,
    },
    {
      path: "/admin/accounting",
      component: () => <div>Accounting Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/manager/accounting",
      component: () => <div>Accounting Page</div>,
      roles: ["Manager"],
      layout: true,
    },
    {
      path: "/accounting", // Legacy support
      component: () => <div>Accounting Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/admin/manage-employee",
      component: ManageEmployees,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/admin/add-employee",
      component: CreateNewEmployee,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/admin/employee-salary", // Legacy support
      component: EmployeeSalary,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/admin/reports",
      component: () => <div>Reports Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/manager/reports",
      component: () => <div>Reports Page</div>,
      roles: ["Manager"],
      layout: true,
    },
    {
      path: "/reports", // Legacy support
      component: () => <div>Reports Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/admin/templates",
      component: () => <div>Templates Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/manager/templates",
      component: () => <div>Templates Page</div>,
      roles: ["Manager"],
      layout: true,
    },
    {
      path: "/templates", // Legacy support
      component: () => <div>Templates Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/admin/settings",
      component: () => <div>Settings Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/manager/settings",
      component: () => <div>Settings Page</div>,
      roles: ["Manager"],
      layout: true,
    },
    {
      path: "/settings", // Legacy support
      component: () => <div>Settings Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/admin/salary",
      component: Salary,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/admin/salary-components", // Legacy support
      component: SalaryComponent,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/admin/overtime", // Legacy support
      component: Overtime,
      roles: ["Admin", "Manager"],
      layout: true,
    },

    // Admin+ only routes
    {
      path: "/admin/attendance",
      component: AttendanceModule,
      roles: ["Admin"],
      layout: true,
    },
    {
      path: "/admin/attendance-policy",
      component: AttendancePolicyPage,
      roles: ["Admin"],
      layout: true,
    },
    {
      path: "/admin/leave-management",
      component: AdminLeaveManagement,
      roles: ["Admin"],
      layout: true,
    },
    {
      path: "/employee/leave-management",
      component: EmployeeLeaveManagement,
      roles: ["Employee"],
      layout: true,
    },
    {
      path: "/permissions", // Legacy support
      component: () => <div>Permission Settings Page</div>,
      roles: ["Admin"],
      layout: true,
    },
  ];
};

export const Routes = () => {
  const routeConfig = getRouteConfig();

  return (
    <RouterRoutes>
      {/* Public Routes - Auth Pages (Outside of Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Unauthorized access page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Dynamic Protected Routes */}
      {routeConfig.map((route, index) => {
        const RouteComponent = route.component;
        const element = route.layout ? (
          <Layout>
            <RouteComponent />
          </Layout>
        ) : (
          <RouteComponent />
        );

        return (
          <Route
            key={`${route.path}-${index}`}
            path={route.path}
            element={
              <ProtectedRoute requiredRoles={route.roles}>
                {element}
              </ProtectedRoute>
            }
          />
        );
      })}

      {/* Root redirect based on user role */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
