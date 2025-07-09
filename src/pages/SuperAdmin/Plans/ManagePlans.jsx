import React, { useState, useEffect } from "react";
import { FiCreditCard, FiRefreshCw, FiZap, FiDownload } from "react-icons/fi";
import { useSuperAdmin } from "../../../Contexts/superAdminApiClient/superAdminApiClient";

const ManagePlans = () => {
  const {
    subscriptionPlans,
    isLoading,
    error,
    getSubscriptionPlans,
    clearError,
  } = useSuperAdmin();

  const [filteredPlans, setFilteredPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const plansPerPage = 5;

  useEffect(() => {
    getSubscriptionPlans();
  }, []);

  useEffect(() => {
    if (subscriptionPlans) {
      setFilteredPlans(subscriptionPlans);
    }
  }, [subscriptionPlans]);

  // Export data to CSV function
  const exportToCSV = () => {
    if (!filteredPlans || filteredPlans.length === 0) return;

    // Prepare CSV header
    const headers = [
      "Name",
      "Description",
      "Monthly Price",
      "Yearly Price",
      "Plan Type",
      "Max Users",
      "Max Employees",
      "Max Products",
      "Max Warehouses",
      "Storage Limit (GB)",
      "Is Popular",
      "Features",
    ].join(",");

    // Prepare CSV rows
    const rows = filteredPlans.map((plan) => {
      const features = [
        plan.EnableInventory && "Inventory",
        plan.EnableHR && "HR",
        plan.EnableAccounting && "Accounting",
        plan.EnableReports && "Reports",
        plan.EnableAPI && "API",
        plan.EnableCustomBranding && "Custom Branding",
        plan.EnableAdvancedReports && "Advanced Reports",
        plan.EnableMultiCurrency && "Multi-Currency",
      ]
        .filter(Boolean)
        .join("; ");

      return [
        `"${plan.Name}"`,
        `"${plan.Description}"`,
        plan.MonthlyPrice,
        plan.YearlyPrice,
        plan.PlanType,
        plan.MaxUsers,
        plan.MaxEmployees,
        plan.MaxProducts,
        plan.MaxWarehouses,
        plan.StorageLimitGB,
        plan.IsPopular ? "Yes" : "No",
        `"${features}"`,
      ].join(",");
    });

    // Combine header and rows
    const csvContent = [headers, ...rows].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "subscription_plans.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination logic
  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans =
    filteredPlans?.slice(indexOfFirstPlan, indexOfLastPlan) || [];
  const totalPages = Math.ceil((filteredPlans?.length || 0) / plansPerPage);

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

  const getEnabledFeatures = (plan) => {
    const features = [];
    if (plan.EnableInventory) features.push("Inventory");
    if (plan.EnableHR) features.push("HR");
    if (plan.EnableAccounting) features.push("Accounting");
    if (plan.EnableReports) features.push("Reports");
    if (plan.EnableAPI) features.push("API");
    if (plan.EnableCustomBranding) features.push("Custom Branding");
    if (plan.EnableAdvancedReports) features.push("Advanced Reports");
    if (plan.EnableMultiCurrency) features.push("Multi-Currency");
    return features;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
          <FiCreditCard className="mr-2" />
          Manage Subscription Plans
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
            <button
              onClick={exportToCSV}
              disabled={isLoading || filteredPlans.length === 0}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isLoading || filteredPlans.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <FiDownload className="mr-2" />
              Export Data
            </button>

            <button
              onClick={getSubscriptionPlans}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isLoading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              <FiRefreshCw
                className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {isLoading && !subscriptionPlans ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Monthly
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Yearly
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Features
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Popular
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Users
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPlans.length > 0 ? (
                      currentPlans.map((plan) => {
                        const features = getEnabledFeatures(plan);
                        return (
                          <tr key={plan.Id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">
                                {plan.Name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {plan.Description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${plan.MonthlyPrice?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${plan.YearlyPrice?.toFixed(2)}
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {features.slice(0, 3).map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {features.length > 3 && (
                                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                    +{features.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {plan.IsPopular && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                                  <FiZap className="mr-1" /> Popular
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {plan.MaxUsers}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          {filteredPlans.length === 0
                            ? "No subscription plans available"
                            : "No plans match current page"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded border ${
                          currentPage === i + 1
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePlans;
