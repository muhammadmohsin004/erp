import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { usePDF } from "react-to-pdf";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  FiDownload,
  FiRefreshCw,
  FiCalendar,
  FiFilter,
  FiUsers,
  FiStar,
  FiDollarSign,
  FiPieChart,
  FiBarChart2,
  FiList,
} from "react-icons/fi";
import { useSuperAdmin } from "../../../Contexts/superAdminApiClient/superAdminApiClient";
import subscriptionReportsTranslations from "../../../translations/SubscriptionReportstranslation";

Chart.register(...registerables);

const SubscriptionReports = () => {
  const { language: currentLanguage } = useSelector((state) => state.language);
  const isArabic = currentLanguage === "ar";
  const t = subscriptionReportsTranslations[currentLanguage] || subscriptionReportsTranslations.en;

  const {
    subscriptionPlans,
    isLoading,
    error,
    getSubscriptionPlans,
    clearError,
  } = useSuperAdmin();

  // State management
  const [reports, setReports] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30days");
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // PDF Generation Setup
  const { toPDF, targetRef } = usePDF({
    filename: "subscription-reports.pdf",
    page: {
      margin: 20,
      format: "a4",
      orientation: "portrait",
    },
  });

  // Effects
  useEffect(() => {
    getSubscriptionPlans();
  }, []);

  useEffect(() => {
    if (subscriptionPlans) {
      generateReports(subscriptionPlans);
    }
  }, [subscriptionPlans, filter]);

  // Report generation logic
  const generateReports = (data) => {
    // Filter data based on selected filter
    let filteredData = data;
    if (filter !== "all") {
      filteredData = data.filter((plan) => plan.PlanType === filter);
    }

    // Calculate summary statistics
    const totalPlans = filteredData.length;
    const totalMonthlyRevenue = filteredData.reduce(
      (sum, plan) => sum + plan.MonthlyPrice,
      0
    );
    const totalYearlyRevenue = filteredData.reduce(
      (sum, plan) => sum + plan.YearlyPrice,
      0
    );
    const avgMonthlyPrice = totalMonthlyRevenue / totalPlans;
    const avgYearlyPrice = totalYearlyRevenue / totalPlans;

    // Count plans by type
    const planTypeCounts = {};
    filteredData.forEach((plan) => {
      planTypeCounts[plan.PlanType] = (planTypeCounts[plan.PlanType] || 0) + 1;
    });

    // Prepare data for charts
    const planTypes = Object.keys(planTypeCounts);
    const planCounts = Object.values(planTypeCounts);

    const popularPlans = filteredData.filter((plan) => plan.IsPopular);
    const nonPopularPlans = filteredData.filter((plan) => !plan.IsPopular);

    const mockReports = {
      overview: {
        totalPlans: totalPlans,
        totalMonthlyRevenue: totalMonthlyRevenue,
        totalYearlyRevenue: totalYearlyRevenue,
        avgMonthlyPrice: avgMonthlyPrice,
        avgYearlyPrice: avgYearlyPrice,
        popularPlans: popularPlans.length,
        nonPopularPlans: nonPopularPlans.length,
      },
      pricing: {
        monthlyPrices: filteredData.map((plan) => plan.MonthlyPrice),
        yearlyPrices: filteredData.map((plan) => plan.YearlyPrice),
        planNames: filteredData.map((plan) => plan.Name),
      },
      distribution: {
        planTypes: planTypes,
        planCounts: planCounts,
        popularVsNonPopular: [popularPlans.length, nonPopularPlans.length],
      },
      detailed: filteredData,
    };

    setReports(mockReports);
  };

  // Event handlers
  const handleExportPDF = () => {
    setExporting(true);
    try {
      toPDF();
      setTimeout(() => {
        setExporting(false);
      }, 1000);
    } catch (error) {
      console.error("PDF Export Error:", error);
      setExporting(false);
    }
  };

  const closeDropdowns = () => {
    setShowDateDropdown(false);
    setShowFilterDropdown(false);
  };

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getDateRangeText = () => {
    switch (dateRange) {
      case "30days":
        return t.dateRanges.last30Days;
      case "90days":
        return t.dateRanges.last90Days;
      case "12months":
        return t.dateRanges.last12Months;
      default:
        return t.dateRanges.last30Days;
    }
  };

  const getFilterText = () => {
    switch (filter) {
      case "all":
        return t.filters.allPlans;
      case "Free":
        return t.filters.freeOnly;
      case "Basic":
        return t.filters.basicOnly;
      case "Professional":
        return t.filters.professionalOnly;
      case "Enterprise":
        return t.filters.enterpriseOnly;
      case "Standard":
        return t.filters.standardOnly;
      default:
        return t.filters.allPlans;
    }
  };

  const getPlanTypeBadge = (planType) => {
    switch ((planType || "").toLowerCase()) {
      case "free":
        return "bg-gray-200 text-gray-800";
      case "basic":
        return "bg-blue-100 text-blue-800";
      case "professional":
        return "bg-indigo-100 text-indigo-800";
      case "enterprise":
        return "bg-green-100 text-green-800";
      case "standard":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Chart configurations
  const pricingChartData = {
    labels: reports?.pricing.planNames || [],
    datasets: [
      {
        label: t.charts.monthlyPrice,
        data: reports?.pricing.monthlyPrices || [],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: t.charts.yearlyPrice,
        data: reports?.pricing.yearlyPrices || [],
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const planDistributionData = {
    labels: reports?.distribution.planTypes || [],
    datasets: [
      {
        data: reports?.distribution.planCounts || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const popularityData = {
    labels: [t.charts.popularPlans, t.charts.nonPopularPlans],
    datasets: [
      {
        data: reports?.distribution.popularVsNonPopular || [],
        backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 99, 132, 0.7)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  // Component renders
  const renderDateRangeDropdown = () => (
    <div className="relative">
      <button
        className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        onClick={() => setShowDateDropdown(!showDateDropdown)}
      >
        <FiCalendar className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
        {getDateRangeText()}
      </button>
      {showDateDropdown && (
        <div className={`absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 ${isArabic ? 'right-0' : 'left-0'}`}>
          <div className="py-1">
            {["30days", "90days", "12months"].map((range) => (
              <button
                key={range}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setDateRange(range);
                  setShowDateDropdown(false);
                }}
              >
                {range === "30days" ? t.dateRanges.last30Days :
                 range === "90days" ? t.dateRanges.last90Days :
                 t.dateRanges.last12Months}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFilterDropdown = () => (
    <div className="relative">
      <button
        className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
      >
        <FiFilter className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
        {getFilterText()}
      </button>
      {showFilterDropdown && (
        <div className={`absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 ${isArabic ? 'right-0' : 'left-0'}`}>
          <div className="py-1">
            {[
              { value: "all", label: t.filters.allPlans },
              { value: "Free", label: t.filters.freeOnly },
              { value: "Basic", label: t.filters.basicOnly },
              { value: "Professional", label: t.filters.professionalOnly },
              { value: "Enterprise", label: t.filters.enterpriseOnly },
              { value: "Standard", label: t.filters.standardOnly },
            ].map((option) => (
              <button
                key={option.value}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setFilter(option.value);
                  setShowFilterDropdown(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">{t.overview.totalPlans}</p>
            <p className="text-2xl font-bold">{reports?.overview.totalPlans || 0}</p>
          </div>
          <FiUsers className="h-8 w-8 text-blue-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">{t.overview.popularPlans}</p>
            <p className="text-2xl font-bold">{reports?.overview.popularPlans || 0}</p>
          </div>
          <FiStar className="h-8 w-8 text-green-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">{t.overview.avgMonthly}</p>
            <p className="text-2xl font-bold">
              {reports ? formatCurrency(reports.overview.avgMonthlyPrice) : '$0'}
            </p>
          </div>
          <FiDollarSign className="h-8 w-8 text-purple-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">{t.overview.avgYearly}</p>
            <p className="text-2xl font-bold">
              {reports ? formatCurrency(reports.overview.avgYearlyPrice) : '$0'}
            </p>
          </div>
          <FiDollarSign className="h-8 w-8 text-orange-200" />
        </div>
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">{t.charts.pricingComparison}</h3>
        <div className="h-64">
          <Bar data={pricingChartData} options={chartOptions} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">{t.charts.planDistribution}</h3>
        <div className="h-64">
          <Pie data={planDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">{t.charts.popularityBreakdown}</h3>
        <div className="h-64">
          <Pie data={popularityData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );

  const renderDetailedTab = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">{t.tabs.detailedData}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.table.name}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.table.type}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.charts.monthlyPrice}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.charts.yearlyPrice}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.table.popular}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports?.detailed.map((plan, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plan.Name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPlanTypeBadge(plan.PlanType)}`}>
                    {plan.PlanType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(plan.MonthlyPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(plan.YearlyPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plan.IsPopular ? (
                    <FiStar className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPDFContent = () => (
    <div ref={targetRef} className="absolute -left-full -top-full">
      <div className="p-5 bg-white font-sans">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t.pdf.title}
          </h1>
          <p className="text-gray-600">
            {t.pdf.generatedOn} {new Date().toLocaleDateString()}
          </p>
        </div>

        {reports && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">
                {t.pdf.summaryStatistics}
              </h3>
              <table className="w-full border-collapse mb-4">
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-300 font-bold">
                      {t.overview.totalPlans}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {reports.overview.totalPlans}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300 font-bold">
                      {t.overview.popularPlans}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {reports.overview.popularPlans}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300 font-bold">
                      {t.overview.avgMonthly}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {formatCurrency(reports.overview.avgMonthlyPrice)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300 font-bold">
                      {t.overview.avgYearly}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {formatCurrency(reports.overview.avgYearlyPrice)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">
                {t.pdf.detailedPlanInfo}
              </h3>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">
                      {t.table.name}
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      {t.table.type}
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      {t.charts.monthlyPrice}
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      {t.charts.yearlyPrice}
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      {t.table.popular}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.detailed.map((plan, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {plan.Name}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {plan.PlanType}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {formatCurrency(plan.MonthlyPrice)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {formatCurrency(plan.YearlyPrice)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {plan.IsPopular ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={`container mx-auto px-4 py-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
          <FiPieChart className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
          {t.title}
        </h2>

        {/* Error Alert */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={clearError}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              {renderDateRangeDropdown()}
              {renderFilterDropdown()}
            </div>

            <div className="flex gap-2">
              <button
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={getSubscriptionPlans}
                disabled={isLoading}
              >
                <FiRefreshCw
                  className={`${isArabic ? 'ml-2' : 'mr-2'} ${isLoading ? "animate-spin" : ""}`}
                />
                {t.buttons.refresh}
              </button>
              <button
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={handleExportPDF}
                disabled={exporting || !reports || isLoading}
              >
                <FiDownload className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
                {exporting ? t.buttons.exporting : t.buttons.exportPDF}
              </button>
            </div>
          </div>

          {/* Dropdown Overlay */}
          {(showDateDropdown || showFilterDropdown) && (
            <div
              className="fixed inset-0 z-0"
              onClick={closeDropdowns}
            />
          )}

          {/* Loading State */}
          {isLoading && !reports ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex -mb-px">
                  {[
                    { key: "overview", icon: FiPieChart, label: t.tabs.overview },
                    { key: "trends", icon: FiBarChart2, label: t.tabs.analysis },
                    { key: "detailed", icon: FiList, label: t.tabs.detailedData },
                  ].map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      className={`${isArabic ? 'ml-8' : 'mr-8'} py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === key
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setActiveTab(key)}
                    >
                      <Icon className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mb-6">
                {activeTab === "overview" && renderOverviewTab()}
                {activeTab === "trends" && renderAnalysisTab()}
                {activeTab === "detailed" && renderDetailedTab()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* PDF Content */}
      {renderPDFContent()}
    </div>
  );
};

export default SubscriptionReports;