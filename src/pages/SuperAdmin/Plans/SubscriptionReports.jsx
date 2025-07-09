import React, { useState, useEffect } from "react";
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

Chart.register(...registerables);

const SubscriptionReports = () => {
  const {
    subscriptionPlans,
    isLoading,
    error,
    getSubscriptionPlans,
    clearError,
  } = useSuperAdmin();

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

  useEffect(() => {
    getSubscriptionPlans();
  }, []);

  useEffect(() => {
    if (subscriptionPlans) {
      generateReports(subscriptionPlans);
    }
  }, [subscriptionPlans, filter]);

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

  // Handle export to PDF
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Chart data and options
  const pricingChartData = {
    labels: reports?.pricing.planNames || [],
    datasets: [
      {
        label: "Monthly Price",
        data: reports?.pricing.monthlyPrices || [],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Yearly Price",
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
    labels: ["Popular Plans", "Non-Popular Plans"],
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
          <FiPieChart className="mr-2" />
          Subscription Reports
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <button
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                >
                  <FiCalendar className="mr-2" />
                  {dateRange === "30days"
                    ? "Last 30 Days"
                    : dateRange === "90days"
                    ? "Last 90 Days"
                    : "Last 12 Months"}
                </button>
                {showDateDropdown && (
                  <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <div className="py-1">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDateRange("30days");
                          setShowDateDropdown(false);
                        }}
                      >
                        Last 30 Days
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDateRange("90days");
                          setShowDateDropdown(false);
                        }}
                      >
                        Last 90 Days
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDateRange("12months");
                          setShowDateDropdown(false);
                        }}
                      >
                        Last 12 Months
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <FiFilter className="mr-2" />
                  {filter === "all" ? "All Plans" : filter}
                </button>
                {showFilterDropdown && (
                  <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <div className="py-1">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setFilter("all");
                          setShowFilterDropdown(false);
                        }}
                      >
                        All Plans
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setFilter("Free");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Free Only
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setFilter("Basic");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Basic Only
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setFilter("Professional");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Professional Only
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setFilter("Enterprise");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Enterprise Only
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setFilter("Standard");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Standard Only
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={getSubscriptionPlans}
                disabled={isLoading}
              >
                <FiRefreshCw
                  className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={handleExportPDF}
                disabled={exporting || !reports || isLoading}
              >
                <FiDownload className="mr-2" />
                {exporting ? "Exporting..." : "Export PDF"}
              </button>
            </div>
          </div>

          {(showDateDropdown || showFilterDropdown) && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => {
                setShowDateDropdown(false);
                setShowFilterDropdown(false);
              }}
            />
          )}

          {isLoading && !reports ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex -mb-px">
                  <button
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === "overview"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <FiPieChart className="mr-2" />
                    Overview
                  </button>
                  <button
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === "trends"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("trends")}
                  >
                    <FiBarChart2 className="mr-2" />
                    Analysis
                  </button>
                  <button
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === "detailed"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("detailed")}
                  >
                    <FiList className="mr-2" />
                    Detailed Data
                  </button>
                </nav>
              </div>

              {/* PDF Content - Hidden from view but used for PDF generation */}
              <div ref={targetRef} className="absolute -left-full -top-full">
                <div className="p-5 bg-white font-sans">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      Subscription Plans Report
                    </h1>
                    <p className="text-gray-600">
                      Generated on: {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  {reports && (
                    <>
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-4">
                          Summary Statistics
                        </h3>
                        <table className="w-full border-collapse mb-4">
                          <tbody>
                            <tr>
                              <td className="p-2 border border-gray-300 font-bold">
                                Total Plans
                              </td>
                              <td className="p-2 border border-gray-300">
                                {reports.overview.totalPlans}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border border-gray-300 font-bold">
                                Popular Plans
                              </td>
                              <td className="p-2 border border-gray-300">
                                {reports.overview.popularPlans}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border border-gray-300 font-bold">
                                Average Monthly Price
                              </td>
                              <td className="p-2 border border-gray-300">
                                {formatCurrency(
                                  reports.overview.avgMonthlyPrice
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border border-gray-300 font-bold">
                                Average Yearly Price
                              </td>
                              <td className="p-2 border border-gray-300">
                                {formatCurrency(
                                  reports.overview.avgYearlyPrice
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-4">
                          Detailed Plan Information
                        </h3>
                        <table className="w-full border-collapse text-xs">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 p-2 text-left">
                                Name
                              </th>
                              <th className="border border-gray-300 p-2 text-left">
                                Type
                              </th>
                              <th className="border border-gray-300 p-2 text-left">
                                Monthly
                              </th>
                              <th className="border border-gray-300 p-2 text-left">
                                Yearly
                              </th>
                              <th className="border border-gray-300 p-2 text-left">
                                Users
                              </th>
                              <th className="border border-gray-300 p-2 text-left">
                                Popular
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.detailed.map((plan, index) => (
                              <tr key={index}>
                                <td className="border border-gray-300 p-1">
                                  {plan.Name}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  {plan.PlanType}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  {formatCurrency(plan.MonthlyPrice)}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  {formatCurrency(plan.YearlyPrice)}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  {plan.MaxUsers}
                                </td>
                                <td className="border border-gray-300 p-1">
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

              {/* Tab Content */}
              {activeTab === "overview" && reports && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                      <div>
                        <h6 className="text-gray-500 text-sm font-medium mb-1">
                          Total Plans
                        </h6>
                        <h3 className="text-2xl font-bold">
                          {reports.overview.totalPlans}
                        </h3>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-blue-500">
                        <FiUsers className="text-xl" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                      <div>
                        <h6 className="text-gray-500 text-sm font-medium mb-1">
                          Popular Plans
                        </h6>
                        <h3 className="text-2xl font-bold">
                          {reports.overview.popularPlans}
                        </h3>
                        <p className="text-xs text-gray-500">
                          out of {reports.overview.totalPlans}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg text-yellow-500">
                        <FiStar className="text-xl" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                      <div>
                        <h6 className="text-gray-500 text-sm font-medium mb-1">
                          Avg Monthly
                        </h6>
                        <h3 className="text-2xl font-bold">
                          {formatCurrency(reports.overview.avgMonthlyPrice)}
                        </h3>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-green-500">
                        <FiDollarSign className="text-xl" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                      <div>
                        <h6 className="text-gray-500 text-sm font-medium mb-1">
                          Avg Yearly
                        </h6>
                        <h3 className="text-2xl font-bold">
                          {formatCurrency(reports.overview.avgYearlyPrice)}
                        </h3>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-purple-500">
                        <FiDollarSign className="text-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                      <h5 className="text-lg font-bold mb-4">
                        Plan Pricing Comparison
                      </h5>
                      <div className="h-80">
                        <Bar data={pricingChartData} options={chartOptions} />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <h5 className="text-lg font-bold mb-4">
                        Plan Type Distribution
                      </h5>
                      <div className="h-80">
                        <Pie
                          data={planDistributionData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "right",
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    const label = context.label || "";
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce(
                                      (a, b) => a + b,
                                      0
                                    );
                                    const percentage = Math.round(
                                      (value / total) * 100
                                    );
                                    return `${label}: ${value} (${percentage}%)`;
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h5 className="text-lg font-bold mb-4">
                        Average Pricing
                      </h5>
                      <div className="h-80">
                        <Bar
                          data={{
                            labels: ["Monthly", "Yearly"],
                            datasets: [
                              {
                                label: "Average Price",
                                data: [
                                  reports.overview.avgMonthlyPrice,
                                  reports.overview.avgYearlyPrice,
                                ],
                                backgroundColor: [
                                  "rgba(54, 162, 235, 0.7)",
                                  "rgba(75, 192, 192, 0.7)",
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }}
                          options={chartOptions}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "detailed" && reports && (
                <div>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      <h5 className="text-lg font-bold mb-4">
                        All Subscription Plans
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Monthly Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Yearly Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Max Users
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Max Employees
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Max Products
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Popular
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reports.detailed.map((plan, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {plan.Name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getPlanTypeBadge(
                                      plan.PlanType
                                    )}`}
                                  >
                                    {plan.PlanType}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                  {plan.Description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                  {formatCurrency(plan.MonthlyPrice)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                  {formatCurrency(plan.YearlyPrice)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {plan.MaxUsers}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {plan.MaxEmployees}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {plan.MaxProducts}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {plan.IsPopular ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      ⭐ Yes
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      No
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionReports;
