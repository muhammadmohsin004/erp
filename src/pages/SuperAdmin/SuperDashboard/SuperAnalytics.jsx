import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Building,
  Users,
  TrendingUp,
  Activity,
  Ticket,
  AlertTriangle,
  Clock,
  DollarSign,
  HardDrive,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";

// Mock context hook (replace with your actual context)
const useSuperAdmin = () => {
  const [state, setState] = useState({
    stats: {
      TotalCompanies: 150,
      CompanyGrowthPercentage: 12.5,
      TotalUsers: 1250,
      UserGrowthPercentage: 8.3,
      MonthlyRevenue: 45000,
      RevenueGrowthPercentage: 15.2,
      OpenTickets: 23,
      StorageUsedGB: 1250,
      TotalApiCalls: 850000,
      ActiveCompanies: 142,
      NewCompaniesThisMonth: 15,
      ActiveUsers: 1180,
      YearlyRevenue: 540000,
      ResolvedTickets: 187,
      TotalLogins: 3450,
      ApiCallsCount: 850000,
      SuspendedCompanies: 8,
      NewUsersThisMonth: 95,
    },
    recentCompanies: [
      { Id: 1, Name: "Tech Corp", Status: "Active", CreatedAt: "2024-01-15" },
      { Id: 2, Name: "Start Inc", Status: "Pending", CreatedAt: "2024-01-14" },
      {
        Id: 3,
        Name: "Digital Solutions",
        Status: "Active",
        CreatedAt: "2024-01-13",
      },
      {
        Id: 4,
        Name: "Innovation Labs",
        Status: "Inactive",
        CreatedAt: "2024-01-12",
      },
      {
        Id: 5,
        Name: "Future Systems",
        Status: "Active",
        CreatedAt: "2024-01-11",
      },
    ],
    recentTickets: [
      {
        Id: 1,
        TicketNumber: "TK-001",
        Subject: "Login Issues",
        Priority: "High",
        Status: "Open",
        CreatedAt: "2024-01-15",
      },
      {
        Id: 2,
        TicketNumber: "TK-002",
        Subject: "Payment Gateway Error",
        Priority: "Critical",
        Status: "In Progress",
        CreatedAt: "2024-01-14",
      },
      {
        Id: 3,
        TicketNumber: "TK-003",
        Subject: "Feature Request",
        Priority: "Low",
        Status: "Resolved",
        CreatedAt: "2024-01-13",
      },
      {
        Id: 4,
        TicketNumber: "TK-004",
        Subject: "Database Connection",
        Priority: "Medium",
        Status: "Closed",
        CreatedAt: "2024-01-12",
      },
      {
        Id: 5,
        TicketNumber: "TK-005",
        Subject: "UI Bug Report",
        Priority: "Medium",
        Status: "Open",
        CreatedAt: "2024-01-11",
      },
    ],
    systemAlerts: [
      {
        Id: 1,
        Message: "Server load is high",
        Type: "warning",
        IsResolved: false,
        CreatedAt: "2024-01-15",
      },
      {
        Id: 2,
        Message: "Database backup completed",
        Type: "success",
        IsResolved: true,
        CreatedAt: "2024-01-14",
      },
      {
        Id: 3,
        Message: "Security update required",
        Type: "error",
        IsResolved: false,
        CreatedAt: "2024-01-13",
      },
    ],
    isLoading: false,
    error: null,
    lastUpdated: new Date(),
  });

  const refreshDashboard = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    // Simulate API call
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date(),
      }));
    }, 1000);
  };

  return {
    ...state,
    refreshDashboard,
    formatCurrency: (amount) => `$${amount.toLocaleString()}`,
    formatDate: (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    getStatusColor: (status) => {
      switch (status?.toLowerCase()) {
        case "active":
          return "bg-green-100 text-green-800";
        case "inactive":
          return "bg-red-100 text-red-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "open":
          return "bg-blue-100 text-blue-800";
        case "closed":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    },
    getPriorityColor: (priority) => {
      switch (priority?.toLowerCase()) {
        case "low":
          return "bg-green-100 text-green-800";
        case "medium":
          return "bg-blue-100 text-blue-800";
        case "high":
          return "bg-orange-100 text-orange-800";
        case "critical":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    },
  };
};

const SuperAnalytics = () => {
  const {
    stats,
    recentCompanies,
    recentTickets,
    systemAlerts,
    isLoading,
    error,
    lastUpdated,
    refreshDashboard,
    formatCurrency,
    formatDate,
    getStatusColor,
    getPriorityColor,
  } = useSuperAdmin();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshDashboard();
    setRefreshing(false);
  };

  // Generate sample data for charts
  const generateRevenueData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month, index) => ({
      month,
      revenue: Math.round(stats.MonthlyRevenue * (0.7 + Math.random() * 0.6)),
      users: Math.round((stats.TotalUsers * (0.8 + Math.random() * 0.4)) / 12),
    }));
  };

  const revenueData = generateRevenueData();

  const companyData = [
    { name: "Total Companies", value: stats.TotalCompanies, color: "#3B82F6" },
    {
      name: "Active Companies",
      value: stats.ActiveCompanies,
      color: "#10B981",
    },
    {
      name: "New This Month",
      value: stats.NewCompaniesThisMonth,
      color: "#F59E0B",
    },
    { name: "Suspended", value: stats.SuspendedCompanies, color: "#EF4444" },
  ];

  const ticketStatusData = [
    { name: "Open", value: stats.OpenTickets, color: "#EF4444" },
    { name: "Resolved", value: stats.ResolvedTickets, color: "#10B981" },
  ];

  const activityData = [
    { name: "Total Logins", value: stats.TotalLogins, color: "#8B5CF6" },
    {
      name: "API Calls",
      value: Math.round(stats.ApiCallsCount / 1000),
      color: "#3B82F6",
    },
    { name: "Storage (GB)", value: stats.StorageUsedGB, color: "#F59E0B" },
  ];

  const priorityData = recentTickets.reduce((acc, ticket) => {
    acc[ticket.Priority] = (acc[ticket.Priority] || 0) + 1;
    return acc;
  }, {});

  const priorityChartData = Object.entries(priorityData).map(
    ([priority, count]) => ({
      name: priority,
      value: count,
      color:
        priority === "Critical"
          ? "#EF4444"
          : priority === "High"
          ? "#F59E0B"
          : priority === "Medium"
          ? "#3B82F6"
          : "#10B981",
    })
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-600">
            Please wait while we gather your analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-900">
              Error Loading Data
            </h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Last updated: {formatDate(lastUpdated)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Activity className="h-4 w-4 mr-1" />
              Live Data
            </span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Companies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.TotalCompanies}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{stats.CompanyGrowthPercentage}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.TotalUsers}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{stats.UserGrowthPercentage}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.MonthlyRevenue)}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{stats.RevenueGrowthPercentage}%
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Open Tickets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.OpenTickets}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.ResolvedTickets} resolved
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Ticket className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Company Metrics
              </h3>
              <span className="text-sm text-gray-500">
                {stats.TotalCompanies} Total
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Trends
              </h3>
              <span className="text-sm text-gray-500">Monthly</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ticket Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ticket Status
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ticketStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Priority Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Overview
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Companies */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Companies
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentCompanies.map((company) => (
                    <tr key={company.Id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {company.Name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            company.Status
                          )}`}
                        >
                          {company.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(company.CreatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Tickets
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.Id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{ticket.TicketNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {ticket.Subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            ticket.Priority
                          )}`}
                        >
                          {ticket.Priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            ticket.Status
                          )}`}
                        >
                          {ticket.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Performance Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Storage Used
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.StorageUsedGB} GB
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <HardDrive className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.ApiCallsCount / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Logins
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.TotalLogins}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAnalytics;
