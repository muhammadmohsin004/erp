// routes/Route.jsx - Updated with SuperAdmin routes
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
      component: Dashboard,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/super-analytics",
      component: () => <div>Super Analytics Page</div>,
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
      component: () => <div>Add New Company Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin User Management Routes
    {
      path: "/superadmin/manage-users",
      component: () => <div>Manage Users Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Plans & Subscriptions Routes
    {
      path: "/superadmin/manage-plan",
      component: () => <div>Manage Subscription Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/subscription",
      component: () => <div>Subscriptions Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/subscription-report",
      component: () => <div>Subscription Reports Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Payments & Invoices Routes
    {
      path: "/superadmin/Payment-transactions",
      component: () => <div>Payment Transactions Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/manage-invoices",
      component: () => <div>Manage Invoices Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/create-invoices",
      component: () => <div>Create Invoice Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/refunds",
      component: () => <div>Refunds Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Modules & Permissions Routes
    {
      path: "/superadmin/manage-modules",
      component: () => <div>Manage Modules Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Support / Tickets Routes
    {
      path: "/superadmin/manage-ticket",
      component: () => <div>Manage Tickets Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Activity Logs Routes
    {
      path: "/superadmin/system-logs",
      component: () => <div>System Logs Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },

    // SuperAdmin Settings Routes
    {
      path: "/superadmin/settings/system",
      component: () => <div>System Settings Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/settings/account",
      component: () => <div>Account Settings Page</div>,
      roles: ["SuperAdmin"],
      layout: true,
    },
    {
      path: "/superadmin/settings/smtp",
      component: () => <div>SMTP Settings Page</div>,
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
    {
      path: "/admin/company-branches",
      component: () => <div>Company Branches Page</div>,
      roles: ["Admin"],
      layout: true,
    },

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
      path: "/manager/clients",
      component: Clients,
      roles: ["Manager", "Employee"],
      layout: true,
    },
    {
      path: "/employee/clients",
      component: Clients,
      roles: ["Employee"],
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
      component: () => <div>Finance Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/manager/finance",
      component: () => <div>Finance Page</div>,
      roles: ["Manager"],
      layout: true,
    },
    {
      path: "/finance", // Legacy support
      component: () => <div>Finance Page</div>,
      roles: ["Admin", "Manager"],
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
      path: "/admin/employees",
      component: () => <div>Employees Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/manager/employees",
      component: () => <div>Employees Page</div>,
      roles: ["Manager"],
      layout: true,
    },
    {
      path: "/employees", // Legacy support
      component: () => <div>Employees Page</div>,
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
      path: "/admin/salary-components",
      component: () => <div>Salary Components Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },
    {
      path: "/manager/salary-components",
      component: () => <div>Salary Components Page</div>,
      roles: ["Manager"],
      layout: true,
    },
    {
      path: "/salary-components", // Legacy support
      component: () => <div>Salary Components Page</div>,
      roles: ["Admin", "Manager"],
      layout: true,
    },

    // Admin+ only routes
    {
      path: "/admin/permissions",
      component: () => <div>Permission Settings Page</div>,
      roles: ["Admin"],
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
