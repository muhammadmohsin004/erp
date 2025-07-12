import React, { useEffect } from "react";
import { useSelector } from "react-redux";
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
import { translations } from "../../../translations/Superdashboard";

const SuperDashboard = () => {
  const { language: currentLanguage } = useSelector((state) => state.language);
  const isArabic = currentLanguage === "ar";
  const t = translations[currentLanguage] || translations.en;

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
      <div className={`bg-white rounded-lg shadow-md p-6 h-full ${isArabic ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div
            className={`flex items-center text-sm font-medium ${getGrowthColor(
              change
            )} ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            {isPositive ? (
              <HiArrowUp className={`w-4 h-4 ${isArabic ? 'ml-1' : 'mr-1'}`} />
            ) : (
              <HiArrowDown className={`w-4 h-4 ${isArabic ? 'ml-1' : 'mr-1'}`} />
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
          {t.errorLoadingDashboard}
        </h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          {t.tryAgain}
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
    <div className={`max-w-7xl mx-auto p-6 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t.superAdminDashboard}
            </h1>
            <p className="text-gray-600 mt-1">
              {t.comprehensivePlatformOverview}
            </p>
          </div>
          <div className={`flex items-center space-x-4 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                {t.lastUpdated}: {formatDate(lastUpdated)}
              </span>
            )}
            <button
              onClick={refreshDashboard}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <HiRefresh
                className={`w-4 h-4 ${isArabic ? 'ml-2' : 'mr-2'} ${isLoading ? "animate-spin" : ""}`}
              />
              {t.refresh}
            </button>
          </div>
        </div>

        {/* Data staleness indicator */}
        {isDataStale() && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className={`flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
              <HiExclamation className={`w-5 h-5 text-yellow-400 ${isArabic ? 'ml-2' : 'mr-2'}`} />
              <span className="text-sm text-yellow-800">
                {t.dataOutdated}
              </span>
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                <HiExclamation className={`w-5 h-5 text-red-400 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                <span className="text-sm text-red-800">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                {t.dismiss}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title={t.totalCompanies}
          value={stats.TotalCompanies}
          change={stats.CompanyGrowthPercentage}
          icon={HiOfficeBuilding}
          color="blue"
          isLoading={isLoading}
        />
        <MetricCard
          title={t.totalUsers}
          value={stats.TotalUsers}
          change={stats.UserGrowthPercentage}
          icon={HiUsers}
          color="green"
          isLoading={isLoading}
        />
        <MetricCard
          title={t.monthlyRevenue}
          value={formatCurrency(stats.MonthlyRevenue)}
          change={stats.RevenueGrowthPercentage}
          icon={HiCreditCard}
          color="yellow"
          isLoading={isLoading}
        />
        <MetricCard
          title={t.openTickets}
          value={stats.OpenTickets}
          change={0}
          icon={HiBell}
          color="red"
          isLoading={isLoading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`bg-white rounded-lg shadow-md p-6 ${isArabic ? 'text-right' : 'text-left'}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.storageApiUsage}
          </h3>
          <div className="space-y-3">
            <div className={`flex justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
              <span className="text-gray-600">{t.storageUsed}:</span>
              <span className="font-medium">{stats.StorageUsedGB} {t.gb}</span>
            </div>
            <div className={`flex justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
              <span className="text-gray-600">{t.totalApiCalls}:</span>
              <span className="font-medium">
                {stats.TotalApiCalls?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow-md p-6 ${isArabic ? 'text-right' : 'text-left'}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.subscriptionOverview}
          </h3>
          <div className="space-y-3">
            <div className={`flex justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
              <span className="text-gray-600">{t.activeCompanies}:</span>
              <span className="font-medium">{stats.ActiveCompanies}</span>
            </div>
            <div className={`flex justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
              <span className="text-gray-600">{t.newThisMonth}:</span>
              <span className="font-medium">{stats.NewCompaniesThisMonth}</span>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow-md p-6 ${isArabic ? 'text-right' : 'text-left'}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.userActivity}
          </h3>
          <div className="space-y-3">
            <div className={`flex justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
              <span className="text-gray-600">{t.activeUsers}:</span>
              <span className="font-medium">{stats.ActiveUsers}</span>
            </div>
            <div className={`flex justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
              <span className="text-gray-600">{t.yearlyRevenue}:</span>
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
        <div className={`bg-white rounded-lg shadow-md ${isArabic ? 'text-right' : 'text-left'}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {t.recentCompanies}
            </h3>
          </div>
          <div className="p-0">
            {recentCompanies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t.name}
                      </th>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t.plan}
                      </th>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t.users}
                      </th>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t.joined}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentCompanies.map((company) => (
                      <tr key={company.Id} className="hover:bg-gray-50">
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${isArabic ? 'text-right' : 'text-left'}`}>
                          {company.Name}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${isArabic ? 'text-right' : 'text-left'}`}>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              company.SubscriptionPlan
                            )}`}
                          >
                            {company.SubscriptionPlan}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${isArabic ? 'text-right' : 'text-left'}`}>
                          {company.UserCount}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isArabic ? 'text-right' : 'text-left'}`}>
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
                <p className="text-gray-500">{t.noRecentCompanies}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className={`bg-white rounded-lg shadow-md ${isArabic ? 'text-right' : 'text-left'}`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {t.recentTickets}
            </h3>
          </div>
          <div className="p-0">
            {recentTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t.ticketNumber}
                      </th>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t.subject}
                      </th>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t.company}
                      </th>
                      <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>
                        {t.status}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTickets.map((ticket) => (
                      <tr key={ticket.Id} className="hover:bg-gray-50">
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${isArabic ? 'text-right' : 'text-left'}`}>
                          {ticket.TicketNumber}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${isArabic ? 'text-right' : 'text-left'}`}>
                          {ticket.Subject}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${isArabic ? 'text-right' : 'text-left'}`}>
                          {ticket.CompanyName}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${isArabic ? 'text-right' : 'text-left'}`}>
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
                <p className="text-gray-500">{t.noRecentTickets}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className={`bg-white rounded-lg shadow-md mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
        <div className={`p-6 border-b border-gray-200 flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-900">{t.systemAlerts}</h3>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              getActiveAlertsCount() > 0
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {getActiveAlertsCount()} {t.active}
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
                  <div className={`flex items-start ${isArabic ? 'flex-row-reverse' : ''}`}>
                    {alert.IsResolved ? (
                      <HiCheckCircle className={`h-5 w-5 text-green-500 mt-0.5 ${isArabic ? 'ml-3' : 'mr-3'}`} />
                    ) : (
                      <HiExclamation className={`h-5 w-5 text-yellow-500 mt-0.5 ${isArabic ? 'ml-3' : 'mr-3'}`} />
                    )}
                    <div className="flex-1">
                      <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <h4 className="text-sm font-medium">{alert.Type}</h4>
                        {!alert.IsResolved && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            {t.active}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.Message}
                      </p>
                      <div className={`mt-2 flex items-center text-xs text-gray-500 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <HiClock className={`h-3 w-3 ${isArabic ? 'ml-1' : 'mr-1'}`} />
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
                {t.allSystemsOperational}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;