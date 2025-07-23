import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import { KpiCard } from "../../components/cards/KpiCard";
import { ChartSection } from "../../components/cards/ChartSection";
import { useDashboard } from "../../Contexts/DashboardContext/DashboardContext";
const Dashboard = () => {
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [company, setCompany] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Refs for cleanup
  const refreshIntervalRef = useRef(null);

  // Get dashboard data and methods from context
  const {
    overview,
    employeeMetrics,
    attendanceToday,
    periodStats,
    companyStats,
    pendingActions,
    isOverviewLoading,
    isStatsLoading,
    error,
    loadDashboardData,
    refreshOverview,
    formatters,
    clearError,
  } = useDashboard();

  // Load company info from localStorage - only once
  useEffect(() => {
    const loadCompanyData = () => {
      try {
        const companyData = localStorage.getItem("company");
        if (companyData) {
          const parsedCompany = JSON.parse(companyData);
          setCompany(parsedCompany);
        }
      } catch (error) {
        console.error("Error loading company data from localStorage:", error);
      }
    };

    loadCompanyData();
  }, []); // Empty dependency array - runs only once

  // Load dashboard data on component mount - only once
  useEffect(() => {
    const initializeDashboard = async () => {
      if (dataLoaded) return; // Prevent multiple loads

      try {
        await loadDashboardData({
          days: 30,
          includeAnalytics: false,
          includeWidgets: ['employees', 'attendance']
        });
        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    initializeDashboard();
  }, [loadDashboardData, dataLoaded]); // Include dataLoaded to prevent multiple calls

  // Setup auto-refresh - properly managed
  useEffect(() => {
    if (!dataLoaded) return; // Don't start refresh until initial load is complete

    const setupRefresh = () => {
      // Clear existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      // Set up new interval
      refreshIntervalRef.current = setInterval(() => {
        refreshOverview(30);
      }, 5 * 60 * 1000); // 5 minutes
    };

    setupRefresh();

    // Cleanup function
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [refreshOverview, dataLoaded]); // Proper dependencies

  // Memoized sidebar toggle to prevent unnecessary re-renders
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Memoized error retry function
  const handleRetry = useCallback(() => {
    clearError();
    setDataLoaded(false); // Reset data loaded state to trigger reload
  }, [clearError]);

  // Memoized KPI calculation to prevent recalculation on every render
  const kpiData = useMemo(() => {
    const defaultKpi = {
      totalEmployees: { value: "0", change: "0%", changeType: "neutral", percentage: "0%" },
      attendanceRate: { value: "0%", change: "0%", changeType: "neutral", percentage: "0%" },
      activeEmployees: { value: "0", change: "0%", changeType: "neutral", percentage: "0%" },
      pendingActions: { value: "0", change: "0%", changeType: "neutral", percentage: "100%" }
    };

    if (!overview && !companyStats) return defaultKpi;

    try {
      // Total Employees KPI - prefer overview data, fallback to companyStats
      const totalEmployees = employeeMetrics?.Total || companyStats?.TotalEmployees || 0;
      const newHiresThisMonth = employeeMetrics?.NewHiresThisMonth || companyStats?.ThisMonthJoiners || 0;
      const employeeGrowth = totalEmployees > 0 ? ((newHiresThisMonth / totalEmployees) * 100).toFixed(2) : 0;

      // Attendance Rate KPI - prefer overview data, fallback to companyStats overall rate
      const attendanceRate = attendanceToday?.AttendanceRate || (companyStats?.OverallAttendanceRate * 100) || 0;
      const attendanceRateFormatted = formatters.formatAttendanceRate(attendanceRate);

      // Active Employees KPI - prefer overview data, fallback to companyStats
      const activeEmployees = employeeMetrics?.Active || companyStats?.ActiveEmployees || 0;
      const activePercentage = totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(1) : 0;

      // Pending Actions KPI - combine different pending items
      const pendingCount = pendingActions?.length || 0;
      const pendingLeaves = companyStats?.PendingLeaves || 0;
      const totalPending = pendingCount + pendingLeaves;
      const highPriorityCount = pendingActions?.filter(action =>
        action.Priority === "High"
      ).length || 0;

      return {
        totalEmployees: {
          value: totalEmployees.toLocaleString(),
          change: newHiresThisMonth > 0 ? `+${employeeGrowth}%` : "0%",
          changeType: newHiresThisMonth > 0 ? "positive" : "neutral",
          percentage: "100%",
          subtitle: `${newHiresThisMonth} new this month`
        },
        attendanceRate: {
          value: attendanceRateFormatted,
          change: attendanceRate >= 90 ? "+Good" : attendanceRate >= 75 ? "Average" : "-Low",
          changeType: attendanceRate >= 90 ? "positive" : attendanceRate >= 75 ? "neutral" : "negative",
          percentage: `${Math.round(attendanceRate)}%`,
          subtitle: `${attendanceToday?.Present || companyStats?.TodayPresent || 0} present today`
        },
        activeEmployees: {
          value: activeEmployees.toLocaleString(),
          change: `${activePercentage}%`,
          changeType: activePercentage >= 95 ? "positive" : activePercentage >= 85 ? "neutral" : "negative",
          percentage: `${activePercentage}%`,
          subtitle: `Out of ${totalEmployees} total`
        },
        pendingActions: {
          value: totalPending.toString(),
          change: highPriorityCount > 0 ? `${highPriorityCount} High` : pendingLeaves > 0 ? `${pendingLeaves} Leaves` : "Normal",
          changeType: highPriorityCount > 0 ? "negative" : totalPending > 5 ? "neutral" : "positive",
          percentage: "100%",
          subtitle: totalPending > 0 ? "Require attention" : "All clear"
        }
      };
    } catch (error) {
      console.error("Error calculating KPI data:", error);
      return defaultKpi;
    }
  }, [overview, companyStats, employeeMetrics, attendanceToday, pendingActions, formatters]);

  // Memoized company header component
  const CompanyHeader = useMemo(() => {
    if (!company) return null;

    return (
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {company.LogoUrl ? (
                <img
                  src={company.LogoUrl}
                  alt={company.Name}
                  className="h-8 w-8 rounded"
                />
              ) : (
                <span className="text-blue-600 font-semibold text-lg">
                  {company.Name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{company.Name}</h1>
              <p className="text-sm text-gray-600">
                {company.Address && `${company.Address} • `}
                {company.Email && `${company.Email} • `}
                {company.SubscriptionPlan} Plan
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm font-medium text-gray-900">
              {formatters.formatDateTime(new Date())}
            </p>
          </div>
        </div>
      </div>
    );
  }, [company, formatters]);

  // Memoized loading component
  const LoadingComponent = useMemo(() => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your information</p>
      </div>
    </div>
  ), []);

  // Memoized error component
  const ErrorComponent = useMemo(() => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  ), [error, handleRetry]);

  // Memoized today's snapshot component
  const TodaysSnapshot = useMemo(() => {
    // Use either attendanceToday from overview or fallback to companyStats
    const todayData = attendanceToday || {};
    const fallbackData = companyStats || {};

    const snapshots = [
      {
        label: "Present",
        value: todayData.Present ?? fallbackData.TodayPresent ?? 0,
        color: "blue"
      },
      {
        label: "Absent",
        value: todayData.Absent ?? (fallbackData.TotalEmployees - fallbackData.TodayPresent) ?? 0,
        color: "red"
      },
      {
        label: "Late",
        value: todayData.Late ?? 0,
        color: "yellow"
      },
      {
        label: "Checked In",
        value: todayData.CheckedIn ?? fallbackData.TodayPresent ?? 0,
        color: "green"
      },
      {
        label: "Checked Out",
        value: todayData.CheckedOut ?? 0,
        color: "purple"
      },
      {
        label: "Rate",
        value: formatters.formatAttendanceRate(
          todayData.AttendanceRate ?? (fallbackData.OverallAttendanceRate * 100) ?? 0
        ),
        color: "indigo"
      },
    ];

    return (
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Snapshot</h2>
          {!attendanceToday && companyStats && (
            <span className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded">
              Using overall stats
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {snapshots.map((snapshot, index) => (
            <div key={index} className="text-center">
              <p className={`text-2xl font-bold text-${snapshot.color}-600`}>
                {snapshot.value}
              </p>
              <p className="text-sm text-gray-600">{snapshot.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }, [attendanceToday, companyStats, formatters]);

  // Memoized company statistics component
  const CompanyStatistics = useMemo(() => {
    if (!companyStats) return null;

    const stats = [
      {
        label: "Total Employees",
        value: companyStats.TotalEmployees?.toLocaleString() || "0",
        sublabel: "in the company",
        color: "blue"
      },
      {
        label: "Active Employees",
        value: companyStats.ActiveEmployees?.toLocaleString() || "0",
        sublabel: `${companyStats.TotalEmployees > 0 ? Math.round((companyStats.ActiveEmployees / companyStats.TotalEmployees) * 100) : 0}% of total`,
        color: "green"
      },
      {
        label: "Departments",
        value: companyStats.DepartmentsCount?.toLocaleString() || "0",
        sublabel: "departments setup",
        color: "purple"
      },
      {
        label: "Present Today",
        value: companyStats.TodayPresent?.toLocaleString() || "0",
        sublabel: "employees checked in",
        color: "emerald"
      },
      {
        label: "Pending Leaves",
        value: companyStats.PendingLeaves?.toLocaleString() || "0",
        sublabel: "awaiting approval",
        color: "orange"
      },
      {
        label: "Attendance Rate",
        value: companyStats.OverallAttendanceRate ? `${(companyStats.OverallAttendanceRate * 100).toFixed(1)}%` : "0%",
        sublabel: "overall performance",
        color: "indigo"
      }
    ];

    return (
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className={`text-xl font-bold text-${stat.color}-600 mb-1`}>
                {stat.value}
              </p>
              <p className="text-sm font-medium text-gray-900 mb-1">{stat.label}</p>
              <p className="text-xs text-gray-600">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }, [companyStats]);
  const PendingActionsSection = useMemo(() => {
    if (!pendingActions?.length) return null;

    const getPriorityStyles = (priority) => {
      const styles = {
        High: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-800' },
        Medium: { dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
        Low: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-800' }
      };
      return styles[priority] || styles.Low;
    };

    return (
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h2>
        <div className="space-y-3">
          {pendingActions.map((action, index) => {
            const styles = getPriorityStyles(action.Priority);
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${styles.dot}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{action.Title}</p>
                    <p className="text-sm text-gray-600">{action.Count} items</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${styles.badge}`}>
                    {action.Priority}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    View →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [pendingActions]);

  // Show loading state
  if (isOverviewLoading || isStatsLoading || !dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="transition-all duration-300">
          <div className="p-6">
            {LoadingComponent}
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="transition-all duration-300">
          <div className="p-6">
            {ErrorComponent}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <main className="transition-all duration-300">
        <div className="p-6">

          {/* Company Header */}
          {CompanyHeader}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard
              title="Total Employees"
              value={kpiData.totalEmployees.value}
              change={kpiData.totalEmployees.change}
              changeType={kpiData.totalEmployees.changeType}
              percentage={kpiData.totalEmployees.percentage}
              color="bg-blue-500"
              subtitle={kpiData.totalEmployees.subtitle}
            />
            <KpiCard
              title="Attendance Rate"
              value={kpiData.attendanceRate.value}
              change={kpiData.attendanceRate.change}
              changeType={kpiData.attendanceRate.changeType}
              percentage={kpiData.attendanceRate.percentage}
              color="bg-purple-500"
              subtitle={kpiData.attendanceRate.subtitle}
            />
            <KpiCard
              title="Active Employees"
              value={kpiData.activeEmployees.value}
              change={kpiData.activeEmployees.change}
              changeType={kpiData.activeEmployees.changeType}
              percentage={kpiData.activeEmployees.percentage}
              color="bg-green-500"
              subtitle={kpiData.activeEmployees.subtitle}
            />
            <KpiCard
              title="Pending Actions"
              value={kpiData.pendingActions.value}
              change={kpiData.pendingActions.change}
              changeType={kpiData.pendingActions.changeType}
              percentage={kpiData.pendingActions.percentage}
              color="bg-orange-500"
              subtitle={kpiData.pendingActions.subtitle}
            />
          </div>

          {/* Today's Snapshot */}
          {TodaysSnapshot}

          {/* Company Statistics */}
          {CompanyStatistics}

          {/* Pending Actions */}
          {PendingActionsSection}

          {/* Chart Section */}
          <div className="mb-8">
            <ChartSection />
          </div>

         
        </div>
      </main>
    </div>
  );
};

export default Dashboard;