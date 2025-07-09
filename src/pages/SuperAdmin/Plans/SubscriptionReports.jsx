import React, { useState, useEffect } from "react";
import { usePDF } from "react-to-pdf";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { GET_ALL_SUPERADMIN_SUBSCRIPTION } from "../../../services/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../../services/apiService";

Chart.register(...registerables);

const SubscriptionReports = () => {
  // State for reports data
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30days");
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const token = localStorage.getItem("authToken");

  // PDF Generation Setup
  const { toPDF, targetRef } = usePDF({
    filename: "subscription-reports.pdf",
    page: {
      margin: 20,
      format: "a4",
      orientation: "portrait",
    },
  });

  const {
    data: subscriptionData,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      try {
        const response = await get(GET_ALL_SUPERADMIN_SUBSCRIPTION, token);
        return response.$values || [];
      } catch (err) {
        console.error("API Error:", err);
        throw err;
      }
    },
    onError: (err) => {
      console.error("Query Error:", err);
      setError(err.message || "Failed to load subscription plans");
    },
  });

  useEffect(() => {
    if (subscriptionData) {
      generateReports(subscriptionData);
    }
  }, [subscriptionData, filter]);

  const generateReports = (data) => {
    setLoading(true);

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
    setLoading(false);
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

  // Custom styles
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: "2rem",
      fontSize: "28px",
      fontWeight: "bold",
      color: "#333",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      marginBottom: "2rem",
      overflow: "hidden",
    },
    cardBody: {
      padding: "1.5rem",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    toolbarLeft: {
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap",
    },
    toolbarRight: {
      display: "flex",
      gap: "0.5rem",
    },
    button: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      textDecoration: "none",
    },
    buttonPrimary: {
      backgroundColor: "#007bff",
      color: "white",
    },
    buttonSecondary: {
      backgroundColor: "#6c757d",
      color: "white",
    },
    buttonOutlineSecondary: {
      backgroundColor: "transparent",
      border: "1px solid #6c757d",
      color: "#6c757d",
    },
    dropdown: {
      position: "relative",
      display: "inline-block",
    },
    dropdownMenu: {
      position: "absolute",
      top: "100%",
      left: "0",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      border: "1px solid #e3e6f0",
      minWidth: "200px",
      zIndex: 1000,
      padding: "8px 0",
    },
    dropdownItem: {
      display: "block",
      width: "100%",
      padding: "8px 16px",
      fontSize: "14px",
      color: "#495057",
      textDecoration: "none",
      border: "none",
      background: "none",
      textAlign: "left",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    tabs: {
      display: "flex",
      borderBottom: "2px solid #e9ecef",
      marginBottom: "2rem",
    },
    tab: {
      padding: "12px 24px",
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "2px solid transparent",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      color: "#6c757d",
      transition: "all 0.2s",
    },
    activeTab: {
      color: "#007bff",
      borderBottomColor: "#007bff",
    },
    row: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      marginBottom: "1rem",
    },
    col3: {
      flex: "0 0 calc(25% - 0.75rem)",
      minWidth: "250px",
    },
    col4: {
      flex: "0 0 calc(33.33% - 0.67rem)",
      minWidth: "300px",
    },
    col6: {
      flex: "0 0 calc(50% - 0.5rem)",
      minWidth: "400px",
    },
    col8: {
      flex: "0 0 calc(66.67% - 0.67rem)",
      minWidth: "500px",
    },
    col12: {
      flex: "1",
      minWidth: "300px",
    },
    statCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statIcon: {
      backgroundColor: "rgba(0, 123, 255, 0.1)",
      padding: "12px",
      borderRadius: "8px",
      color: "#007bff",
    },
    chartContainer: {
      height: "300px",
      position: "relative",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },
    th: {
      backgroundColor: "#f8f9fa",
      padding: "12px",
      textAlign: "left",
      fontWeight: "600",
      color: "#495057",
      borderBottom: "2px solid #dee2e6",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #dee2e6",
      verticalAlign: "middle",
    },
    tableStriped: {
      backgroundColor: "#f8f9fa",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto",
    },
    alert: {
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "3rem",
    },
  };

  return (
    <>
      <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .dropdown-item:hover {
                    background-color: #f8f9fa !important;
                }
                .button:hover {
                    transform: translateY(-1px);
                    opacity: 0.9;
                }
                .tab:hover {
                    color: #007bff !important;
                }
                tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                tr:hover {
                    background-color: #e8f4fd;
                }
            `}</style>

      <div style={styles.container}>
        <h2 style={styles.header}>📊 Subscription Reports</h2>

        {error && (
          <div style={styles.alert}>
            {error}
            <button
              style={{
                background: "none",
                border: "none",
                float: "right",
                fontSize: "20px",
                cursor: "pointer",
                color: "#721c24",
              }}
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={styles.toolbar}>
              <div style={styles.toolbarLeft}>
                <div style={styles.dropdown}>
                  <button
                    style={{
                      ...styles.button,
                      ...styles.buttonOutlineSecondary,
                    }}
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                  >
                    📅{" "}
                    {dateRange === "30days"
                      ? "Last 30 Days"
                      : dateRange === "90days"
                      ? "Last 90 Days"
                      : "Last 12 Months"}
                  </button>
                  {showDateDropdown && (
                    <div style={styles.dropdownMenu}>
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          setDateRange("30days");
                          setShowDateDropdown(false);
                        }}
                      >
                        Last 30 Days
                      </button>
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          setDateRange("90days");
                          setShowDateDropdown(false);
                        }}
                      >
                        Last 90 Days
                      </button>
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          setDateRange("12months");
                          setShowDateDropdown(false);
                        }}
                      >
                        Last 12 Months
                      </button>
                    </div>
                  )}
                </div>

                <div style={styles.dropdown}>
                  <button
                    style={{
                      ...styles.button,
                      ...styles.buttonOutlineSecondary,
                    }}
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    🔍 {filter === "all" ? "All Plans" : filter}
                  </button>
                  {showFilterDropdown && (
                    <div style={styles.dropdownMenu}>
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          setFilter("all");
                          setShowFilterDropdown(false);
                        }}
                      >
                        All Plans
                      </button>
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          setFilter("Free");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Free Only
                      </button>
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          setFilter("Basic");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Basic Only
                      </button>
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          setFilter("Professional");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Professional Only
                      </button>
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          setFilter("Enterprise");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Enterprise Only
                      </button>
                      <button
                        style={styles.dropdownItem}
                        onClick={() => {
                          setFilter("Standard");
                          setShowFilterDropdown(false);
                        }}
                      >
                        Standard Only
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.toolbarRight}>
                <button
                  style={{ ...styles.button, ...styles.buttonOutlineSecondary }}
                  onClick={() => refetch()}
                >
                  🔄 Refresh
                </button>
                <button
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                  onClick={handleExportPDF}
                  disabled={exporting || !reports}
                >
                  📥 {exporting ? "Exporting..." : "Export PDF"}
                </button>
              </div>
            </div>

            {loading || isLoading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={{ marginTop: "1rem", color: "#6c757d" }}>
                  Loading reports...
                </p>
              </div>
            ) : (
              <>
                <div style={styles.tabs}>
                  <button
                    style={{
                      ...styles.tab,
                      ...(activeTab === "overview" ? styles.activeTab : {}),
                    }}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    style={{
                      ...styles.tab,
                      ...(activeTab === "trends" ? styles.activeTab : {}),
                    }}
                    onClick={() => setActiveTab("trends")}
                  >
                    Analysis
                  </button>
                  <button
                    style={{
                      ...styles.tab,
                      ...(activeTab === "detailed" ? styles.activeTab : {}),
                    }}
                    onClick={() => setActiveTab("detailed")}
                  >
                    Detailed Data
                  </button>
                </div>

                {/* PDF Content - Hidden from view but used for PDF generation */}
                <div
                  ref={targetRef}
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "-9999px",
                  }}
                >
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "white",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <div style={{ textAlign: "center", marginBottom: "30px" }}>
                      <h1
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#333",
                          marginBottom: "10px",
                        }}
                      >
                        Subscription Plans Report
                      </h1>
                      <p style={{ color: "#666", marginBottom: "20px" }}>
                        Generated on: {new Date().toLocaleDateString()}
                      </p>
                    </div>

                    {reports && (
                      <>
                        <div style={{ marginBottom: "30px" }}>
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              marginBottom: "15px",
                            }}
                          >
                            Summary Statistics
                          </h3>
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              marginBottom: "20px",
                            }}
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Total Plans
                                </td>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {reports.overview.totalPlans}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Popular Plans
                                </td>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {reports.overview.popularPlans}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Average Monthly Price
                                </td>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {formatCurrency(
                                    reports.overview.avgMonthlyPrice
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Average Yearly Price
                                </td>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {formatCurrency(
                                    reports.overview.avgYearlyPrice
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              marginBottom: "15px",
                            }}
                          >
                            Detailed Plan Information
                          </h3>
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: "12px",
                            }}
                          >
                            <thead>
                              <tr style={{ backgroundColor: "#f8f9fa" }}>
                                <th
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "left",
                                  }}
                                >
                                  Name
                                </th>
                                <th
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "left",
                                  }}
                                >
                                  Type
                                </th>
                                <th
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "left",
                                  }}
                                >
                                  Monthly
                                </th>
                                <th
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "left",
                                  }}
                                >
                                  Yearly
                                </th>
                                <th
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "left",
                                  }}
                                >
                                  Users
                                </th>
                                <th
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "left",
                                  }}
                                >
                                  Popular
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {reports.detailed.map((plan, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      border: "1px solid #ddd",
                                      padding: "6px",
                                    }}
                                  >
                                    {plan.Name}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #ddd",
                                      padding: "6px",
                                    }}
                                  >
                                    {plan.PlanType}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #ddd",
                                      padding: "6px",
                                    }}
                                  >
                                    {formatCurrency(plan.MonthlyPrice)}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #ddd",
                                      padding: "6px",
                                    }}
                                  >
                                    {formatCurrency(plan.YearlyPrice)}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #ddd",
                                      padding: "6px",
                                    }}
                                  >
                                    {plan.MaxUsers}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #ddd",
                                      padding: "6px",
                                    }}
                                  >
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
                {activeTab === "overview" && (
                  <div>
                    <div style={styles.row}>
                      <div style={styles.col3}>
                        <div style={styles.statCard}>
                          <div>
                            <h6
                              style={{
                                color: "#6c757d",
                                marginBottom: "8px",
                                fontSize: "14px",
                              }}
                            >
                              Total Plans
                            </h6>
                            <h3
                              style={{
                                margin: "0",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              {reports.overview.totalPlans}
                            </h3>
                          </div>
                          <div style={styles.statIcon}>👥</div>
                        </div>
                      </div>

                      <div style={styles.col3}>
                        <div style={styles.statCard}>
                          <div>
                            <h6
                              style={{
                                color: "#6c757d",
                                marginBottom: "8px",
                                fontSize: "14px",
                              }}
                            >
                              Popular Plans
                            </h6>
                            <h3
                              style={{
                                margin: "0",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              {reports.overview.popularPlans}
                            </h3>
                            <small style={{ color: "#6c757d" }}>
                              out of {reports.overview.totalPlans}
                            </small>
                          </div>
                          <div
                            style={{
                              ...styles.statIcon,
                              backgroundColor: "rgba(255, 193, 7, 0.1)",
                              color: "#ffc107",
                            }}
                          >
                            ⭐
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={styles.row}>
                      <div style={styles.col8}>
                        <div style={styles.card}>
                          <div style={styles.cardBody}>
                            <h5
                              style={{
                                marginBottom: "1rem",
                                fontSize: "18px",
                                fontWeight: "bold",
                              }}
                            >
                              Plan Pricing Comparison
                            </h5>
                            <div style={styles.chartContainer}>
                              <Bar
                                data={pricingChartData}
                                options={chartOptions}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={styles.col4}>
                        <div style={styles.card}>
                          <div style={styles.cardBody}>
                            <h5
                              style={{
                                marginBottom: "1rem",
                                fontSize: "18px",
                                fontWeight: "bold",
                              }}
                            >
                              Plan Type Distribution
                            </h5>
                            <div style={styles.chartContainer}>
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
                                          const total =
                                            context.dataset.data.reduce(
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
                      </div>
                      <div style={styles.col6}>
                        <div style={styles.card}>
                          <div style={styles.cardBody}>
                            <h5
                              style={{
                                marginBottom: "1rem",
                                fontSize: "18px",
                                fontWeight: "bold",
                              }}
                            >
                              Average Pricing
                            </h5>
                            <div style={styles.chartContainer}>
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
                    </div>
                  </div>
                )}

                {activeTab === "detailed" && (
                  <div>
                    <div style={styles.row}>
                      <div style={styles.col12}>
                        <div style={styles.card}>
                          <div style={styles.cardBody}>
                            <h5
                              style={{
                                marginBottom: "1rem",
                                fontSize: "18px",
                                fontWeight: "bold",
                              }}
                            >
                              All Subscription Plans
                            </h5>
                            <div style={{ overflowX: "auto" }}>
                              <table style={styles.table}>
                                <thead>
                                  <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Description</th>
                                    <th style={styles.th}>Monthly Price</th>
                                    <th style={styles.th}>Yearly Price</th>
                                    <th style={styles.th}>Max Users</th>
                                    <th style={styles.th}>Max Employees</th>
                                    <th style={styles.th}>Max Products</th>
                                    <th style={styles.th}>Popular</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {reports.detailed.map((plan, index) => (
                                    <tr
                                      key={index}
                                      style={
                                        index % 2 === 1
                                          ? styles.tableStriped
                                          : {}
                                      }
                                    >
                                      <td style={styles.td}>{plan.Name}</td>
                                      <td style={styles.td}>
                                        <span
                                          style={{
                                            padding: "4px 8px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            backgroundColor:
                                              plan.PlanType === "Free"
                                                ? "#e7f3ff"
                                                : plan.PlanType === "Basic"
                                                ? "#fff3cd"
                                                : plan.PlanType ===
                                                  "Professional"
                                                ? "#d4edda"
                                                : plan.PlanType === "Enterprise"
                                                ? "#f8d7da"
                                                : "#e2e3e5",
                                            color:
                                              plan.PlanType === "Free"
                                                ? "#004085"
                                                : plan.PlanType === "Basic"
                                                ? "#856404"
                                                : plan.PlanType ===
                                                  "Professional"
                                                ? "#155724"
                                                : plan.PlanType === "Enterprise"
                                                ? "#721c24"
                                                : "#383d41",
                                          }}
                                        >
                                          {plan.PlanType}
                                        </span>
                                      </td>
                                      <td style={styles.td}>
                                        <div
                                          style={{
                                            maxWidth: "200px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {plan.Description}
                                        </div>
                                      </td>
                                      <td style={styles.td}>
                                        <span
                                          style={{
                                            fontWeight: "bold",
                                            color: "#28a745",
                                          }}
                                        >
                                          {formatCurrency(plan.MonthlyPrice)}
                                        </span>
                                      </td>
                                      <td style={styles.td}>
                                        <span
                                          style={{
                                            fontWeight: "bold",
                                            color: "#007bff",
                                          }}
                                        >
                                          {formatCurrency(plan.YearlyPrice)}
                                        </span>
                                      </td>
                                      <td style={styles.td}>{plan.MaxUsers}</td>
                                      <td style={styles.td}>
                                        {plan.MaxEmployees}
                                      </td>
                                      <td style={styles.td}>
                                        {plan.MaxProducts}
                                      </td>
                                      <td style={styles.td}>
                                        {plan.IsPopular ? (
                                          <span
                                            style={{
                                              padding: "4px 8px",
                                              borderRadius: "12px",
                                              fontSize: "12px",
                                              backgroundColor: "#fff3cd",
                                              color: "#856404",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            ⭐ Yes
                                          </span>
                                        ) : (
                                          <span
                                            style={{
                                              padding: "4px 8px",
                                              borderRadius: "12px",
                                              fontSize: "12px",
                                              backgroundColor: "#e2e3e5",
                                              color: "#6c757d",
                                            }}
                                          >
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
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handlers */}
      {(showDateDropdown || showFilterDropdown) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
          onClick={() => {
            setShowDateDropdown(false);
            setShowFilterDropdown(false);
          }}
        />
      )}
    </>
  );
};
export default SubscriptionReports;
