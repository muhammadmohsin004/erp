import React, { useEffect } from "react";
import {
  HiOfficeBuilding,
  HiUsers,
  HiCreditCard,
  HiBell,
  HiArrowUp,
  HiArrowDown,
  HiClock,
  HiExclamation,
  HiCheckCircle,
  HiRefresh,
} from "react-icons/hi";
import { useSuperAdmin } from "../../../Contexts/superAdminDashborad/SuperAdminContext";

const SuperDashboard = () => {
  const {
    stats,
    recentCompanies,
    recentTickets,
    systemAlerts,
    isLoading,
    error,
    lastUpdated,
    getDashboardStats,
    refreshDashboard,
    clearError,
    getActiveAlertsCount,
    formatDate,
    formatCurrency,
    getGrowthColor,
    getStatusColor,
    isDataStale,
  } = useSuperAdmin();

  useEffect(() => {
    getDashboardStats();
  }, []);

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    color,
    isLoading,
  }) => {
    const isPositive = change >= 0;
    const colorClasses = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      yellow: "bg-yellow-500 text-white",
      red: "bg-red-500 text-white",
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div
            className={`flex items-center text-sm font-medium ${getGrowthColor(
              change
            )}`}
          >
            {isPositive ? (
              <HiArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <HiArrowDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">
          {isLoading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : typeof value === "number" ? (
            value.toLocaleString()
          ) : (
            value
          )}
        </p>
        <div className="mt-3 h-1 bg-gray-200 rounded-full">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isPositive ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ width: `${Math.min(Math.abs(change) * 2, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <HiExclamation className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Dashboard
        </h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (isLoading && !lastUpdated) {
    return <LoadingSpinner />;
  }

  if (error && !lastUpdated) {
    return <ErrorMessage message={error} onRetry={getDashboardStats} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive platform overview
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {formatDate(lastUpdated)}
              </span>
            )}
            <button
              onClick={refreshDashboard}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <HiRefresh
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Data staleness indicator */}
        {isDataStale() && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-center">
              <HiExclamation className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm text-yellow-800">
                Data may be outdated. Consider refreshing for the latest
                information.
              </span>
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HiExclamation className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Companies"
          value={stats.TotalCompanies}
          change={stats.CompanyGrowthPercentage}
          icon={HiOfficeBuilding}
          color="blue"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Users"
          value={stats.TotalUsers}
          change={stats.UserGrowthPercentage}
          icon={HiUsers}
          color="green"
          isLoading={isLoading}
        />
        <MetricCard
          title="Monthly Revenue"
          value={formatCurrency(stats.MonthlyRevenue)}
          change={stats.RevenueGrowthPercentage}
          icon={HiCreditCard}
          color="yellow"
          isLoading={isLoading}
        />
        <MetricCard
          title="Open Tickets"
          value={stats.OpenTickets}
          change={0}
          icon={HiBell}
          color="red"
          isLoading={isLoading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Storage & API Usage
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Storage Used:</span>
              <span className="font-medium">{stats.StorageUsedGB} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total API Calls:</span>
              <span className="font-medium">
                {stats.TotalApiCalls?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subscription Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Companies:</span>
              <span className="font-medium">{stats.ActiveCompanies}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">New This Month:</span>
              <span className="font-medium">{stats.NewCompaniesThisMonth}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Users:</span>
              <span className="font-medium">{stats.ActiveUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yearly Revenue:</span>
              <span className="font-medium">
                {formatCurrency(stats.YearlyRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Companies */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Companies
            </h3>
          </div>
          <div className="p-0">
            {recentCompanies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentCompanies.map((company) => (
                      <tr key={company.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {company.Name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              company.SubscriptionPlan
                            )}`}
                          >
                            {company.SubscriptionPlan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.UserCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(company.CreatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <HiOfficeBuilding className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent companies found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Tickets
            </h3>
          </div>
          <div className="p-0">
            {recentTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTickets.map((ticket) => (
                      <tr key={ticket.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ticket.TicketNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ticket.Subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ticket.CompanyName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
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
            ) : (
              <div className="text-center py-12">
                <HiBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent tickets found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              getActiveAlertsCount() > 0
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {getActiveAlertsCount()} Active
          </span>
        </div>
        <div className="p-6">
          {systemAlerts.length > 0 ? (
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.Id}
                  className={`p-4 rounded-lg border ${
                    alert.IsResolved
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-start">
                    {alert.IsResolved ? (
                      <HiCheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    ) : (
                      <HiExclamation className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{alert.Type}</h4>
                        {!alert.IsResolved && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.Message}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <HiClock className="h-3 w-3 mr-1" />
                        {formatDate(alert.CreatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No system alerts - All systems operational
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;
