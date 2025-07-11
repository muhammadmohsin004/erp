import React, { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import axios from "axios";

// Base URL configuration
const BASE_URL = "https://api.speed-erp.com/api";

// Create axios instance with default configuration
const dashboardApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
dashboardApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
dashboardApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("company");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Initial state
const initialState = {
  // Dashboard Overview
  overview: null,
  
  // Company Statistics
  companyStats: null,
  
  // Analytics Data
  attendanceAnalytics: null,
  leaveAnalytics: null,
  
  // Widget Data
  widgets: {
    employees: null,
    attendance: null,
    leaves: null,
    payroll: null,
    reports: null,
    notifications: null,
  },
  
  // Individual Components
  employeeMetrics: null,
  attendanceToday: null,
  periodStats: null,
  pendingActions: [],
  recentActivity: [],
  upcomingEvents: [],
  
  // Loading states
  isLoading: false,
  isOverviewLoading: false,
  isAnalyticsLoading: false,
  isWidgetLoading: false,
  isStatsLoading: false,
  
  // Error state
  error: null,
  
  // Cache timestamps for data freshness
  lastUpdated: {
    overview: null,
    stats: null,
    analytics: null,
  },
};

// Action types
const DASHBOARD_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_OVERVIEW_LOADING: "SET_OVERVIEW_LOADING",
  SET_ANALYTICS_LOADING: "SET_ANALYTICS_LOADING",
  SET_WIDGET_LOADING: "SET_WIDGET_LOADING",
  SET_STATS_LOADING: "SET_STATS_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",

  // Dashboard Overview
  SET_OVERVIEW: "SET_OVERVIEW",
  SET_EMPLOYEE_METRICS: "SET_EMPLOYEE_METRICS",
  SET_ATTENDANCE_TODAY: "SET_ATTENDANCE_TODAY",
  SET_PERIOD_STATS: "SET_PERIOD_STATS",
  SET_PENDING_ACTIONS: "SET_PENDING_ACTIONS",
  SET_RECENT_ACTIVITY: "SET_RECENT_ACTIVITY",
  SET_UPCOMING_EVENTS: "SET_UPCOMING_EVENTS",

  // Statistics
  SET_COMPANY_STATS: "SET_COMPANY_STATS",

  // Analytics
  SET_ATTENDANCE_ANALYTICS: "SET_ATTENDANCE_ANALYTICS",
  SET_LEAVE_ANALYTICS: "SET_LEAVE_ANALYTICS",

  // Widgets
  SET_WIDGET_DATA: "SET_WIDGET_DATA",
  CLEAR_WIDGET_DATA: "CLEAR_WIDGET_DATA",

  // Cache Management
  UPDATE_LAST_UPDATED: "UPDATE_LAST_UPDATED",
};

// Helper function to extract data from .NET response format
const extractData = (response) => {
  if (response?.data) {
    return response.data;
  }
  return response;
};

// Helper function to extract array data from .NET response format
const extractArrayData = (data) => {
  if (data?.$values) {
    return data.$values;
  }
  return Array.isArray(data) ? data : [];
};

// Reducer function
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case DASHBOARD_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case DASHBOARD_ACTIONS.SET_OVERVIEW_LOADING:
      return {
        ...state,
        isOverviewLoading: action.payload,
      };

    case DASHBOARD_ACTIONS.SET_ANALYTICS_LOADING:
      return {
        ...state,
        isAnalyticsLoading: action.payload,
      };

    case DASHBOARD_ACTIONS.SET_WIDGET_LOADING:
      return {
        ...state,
        isWidgetLoading: action.payload,
      };

    case DASHBOARD_ACTIONS.SET_STATS_LOADING:
      return {
        ...state,
        isStatsLoading: action.payload,
      };

    case DASHBOARD_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isOverviewLoading: false,
        isAnalyticsLoading: false,
        isWidgetLoading: false,
        isStatsLoading: false,
      };

    case DASHBOARD_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    // Dashboard Overview
    case DASHBOARD_ACTIONS.SET_OVERVIEW:
      const overviewData = action.payload;
      return {
        ...state,
        overview: overviewData,
        employeeMetrics: overviewData?.Employees,
        attendanceToday: overviewData?.AttendanceToday,
        periodStats: overviewData?.PeriodStats,
        pendingActions: extractArrayData(overviewData?.PendingActions),
        recentActivity: extractArrayData(overviewData?.RecentActivity),
        upcomingEvents: extractArrayData(overviewData?.UpcomingEvents),
        isOverviewLoading: false,
        error: null,
      };

    case DASHBOARD_ACTIONS.SET_EMPLOYEE_METRICS:
      return {
        ...state,
        employeeMetrics: action.payload,
        isLoading: false,
        error: null,
      };

    case DASHBOARD_ACTIONS.SET_ATTENDANCE_TODAY:
      return {
        ...state,
        attendanceToday: action.payload,
        isLoading: false,
        error: null,
      };

    case DASHBOARD_ACTIONS.SET_PERIOD_STATS:
      return {
        ...state,
        periodStats: action.payload,
        isLoading: false,
        error: null,
      };

    case DASHBOARD_ACTIONS.SET_PENDING_ACTIONS:
      return {
        ...state,
        pendingActions: extractArrayData(action.payload),
        isLoading: false,
        error: null,
      };

    case DASHBOARD_ACTIONS.SET_RECENT_ACTIVITY:
      return {
        ...state,
        recentActivity: extractArrayData(action.payload),
        isLoading: false,
        error: null,
      };

    case DASHBOARD_ACTIONS.SET_UPCOMING_EVENTS:
      return {
        ...state,
        upcomingEvents: extractArrayData(action.payload),
        isLoading: false,
        error: null,
      };

    // Statistics
    case DASHBOARD_ACTIONS.SET_COMPANY_STATS:
      return {
        ...state,
        companyStats: action.payload,
        isStatsLoading: false,
        error: null,
      };

    // Analytics
    case DASHBOARD_ACTIONS.SET_ATTENDANCE_ANALYTICS:
      return {
        ...state,
        attendanceAnalytics: action.payload,
        isAnalyticsLoading: false,
        error: null,
      };

    case DASHBOARD_ACTIONS.SET_LEAVE_ANALYTICS:
      return {
        ...state,
        leaveAnalytics: action.payload,
        isAnalyticsLoading: false,
        error: null,
      };

    // Widgets
    case DASHBOARD_ACTIONS.SET_WIDGET_DATA:
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.widgetName]: action.payload.data,
        },
        isWidgetLoading: false,
        error: null,
      };

    case DASHBOARD_ACTIONS.CLEAR_WIDGET_DATA:
      return {
        ...state,
        widgets: {
          employees: null,
          attendance: null,
          leaves: null,
          payroll: null,
          reports: null,
          notifications: null,
        },
      };

    // Cache Management
    case DASHBOARD_ACTIONS.UPDATE_LAST_UPDATED:
      return {
        ...state,
        lastUpdated: {
          ...state.lastUpdated,
          [action.payload.key]: action.payload.timestamp,
        },
      };

    default:
      return state;
  }
};

// Create context
const DashboardContext = createContext();

// DashboardProvider component
export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Helper function to handle API errors - memoized
  const handleApiError = useCallback((error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data) {
      errorMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: DASHBOARD_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }, []);

  // ========== MEMOIZED API METHODS ==========
  
  // Dashboard Overview
  const getOverview = useCallback(async (days = 30) => {
    try {
      dispatch({
        type: DASHBOARD_ACTIONS.SET_OVERVIEW_LOADING,
        payload: true,
      });
      dispatch({ type: DASHBOARD_ACTIONS.CLEAR_ERROR });

      const params = new URLSearchParams({
        days: days.toString(),
      });

      const response = await dashboardApiClient.get(
        `/Dashboard/overview?${params}`
      );

      const overviewData = extractData(response.data);

      dispatch({
        type: DASHBOARD_ACTIONS.SET_OVERVIEW,
        payload: overviewData,
      });

      dispatch({
        type: DASHBOARD_ACTIONS.UPDATE_LAST_UPDATED,
        payload: { key: "overview", timestamp: Date.now() },
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // Company Statistics
  const getCompanyStats = useCallback(async () => {
    try {
      dispatch({
        type: DASHBOARD_ACTIONS.SET_STATS_LOADING,
        payload: true,
      });
      dispatch({ type: DASHBOARD_ACTIONS.CLEAR_ERROR });

      const response = await dashboardApiClient.get("/Dashboard/stats");

      const statsData = extractData(response.data);

      dispatch({
        type: DASHBOARD_ACTIONS.SET_COMPANY_STATS,
        payload: statsData,
      });

      dispatch({
        type: DASHBOARD_ACTIONS.UPDATE_LAST_UPDATED,
        payload: { key: "stats", timestamp: Date.now() },
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // Widget Data
  const getWidget = useCallback(async (widgetName, days = 30) => {
    try {
      dispatch({
        type: DASHBOARD_ACTIONS.SET_WIDGET_LOADING,
        payload: true,
      });
      dispatch({ type: DASHBOARD_ACTIONS.CLEAR_ERROR });

      const params = new URLSearchParams({
        days: days.toString(),
      });

      const response = await dashboardApiClient.get(
        `/Dashboard/widget/${widgetName}?${params}`
      );

      const widgetData = extractData(response.data);

      dispatch({
        type: DASHBOARD_ACTIONS.SET_WIDGET_DATA,
        payload: {
          widgetName: widgetName.toLowerCase(),
          data: widgetData,
        },
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // Analytics
  const getAttendanceAnalytics = useCallback(async (startDate = null, endDate = null) => {
    try {
      dispatch({
        type: DASHBOARD_ACTIONS.SET_ANALYTICS_LOADING,
        payload: true,
      });
      dispatch({ type: DASHBOARD_ACTIONS.CLEAR_ERROR });

      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await dashboardApiClient.get(
        `/Dashboard/analytics/attendance?${params}`
      );

      const analyticsData = extractData(response.data);

      dispatch({
        type: DASHBOARD_ACTIONS.SET_ATTENDANCE_ANALYTICS,
        payload: analyticsData,
      });

      dispatch({
        type: DASHBOARD_ACTIONS.UPDATE_LAST_UPDATED,
        payload: { key: "analytics", timestamp: Date.now() },
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  const getLeaveAnalytics = useCallback(async (startDate = null, endDate = null) => {
    try {
      dispatch({
        type: DASHBOARD_ACTIONS.SET_ANALYTICS_LOADING,
        payload: true,
      });
      dispatch({ type: DASHBOARD_ACTIONS.CLEAR_ERROR });

      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await dashboardApiClient.get(
        `/Dashboard/analytics/leaves?${params}`
      );

      const analyticsData = extractData(response.data);

      dispatch({
        type: DASHBOARD_ACTIONS.SET_LEAVE_ANALYTICS,
        payload: analyticsData,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // Bulk Data Loading
  const loadDashboardData = useCallback(async (options = {}) => {
    const {
      days = 30,
      includeAnalytics = false,
      includeWidgets = [],
      startDate = null,
      endDate = null,
    } = options;

    try {
      dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: DASHBOARD_ACTIONS.CLEAR_ERROR });

      const promises = [];

      // Always load overview
      promises.push(getOverview(days));

      // Always load company stats
      promises.push(getCompanyStats());

      // Load analytics if requested
      if (includeAnalytics) {
        promises.push(getAttendanceAnalytics(startDate, endDate));
        promises.push(getLeaveAnalytics(startDate, endDate));
      }

      // Load specific widgets if requested
      includeWidgets.forEach((widgetName) => {
        promises.push(getWidget(widgetName, days));
      });

      await Promise.allSettled(promises);

      dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: false });
      console.error("Error loading dashboard data:", error);
    }
  }, [getOverview, getCompanyStats, getAttendanceAnalytics, getLeaveAnalytics, getWidget]);

  // Real-time Updates
  const refreshOverview = useCallback(async (days = 30) => {
    try {
      const response = await dashboardApiClient.get(
        `/Dashboard/overview?days=${days}`
      );

      const overviewData = extractData(response.data);

      dispatch({
        type: DASHBOARD_ACTIONS.SET_OVERVIEW,
        payload: overviewData,
      });

      dispatch({
        type: DASHBOARD_ACTIONS.UPDATE_LAST_UPDATED,
        payload: { key: "overview", timestamp: Date.now() },
      });

      return response.data;
    } catch (error) {
      console.error("Error refreshing overview:", error);
      // Don't throw error for background refresh
    }
  }, []);

  // Individual widget methods - memoized
  const getEmployeesWidget = useCallback(async (days = 30) => {
    return await getWidget("employees", days);
  }, [getWidget]);

  const getAttendanceWidget = useCallback(async (days = 30) => {
    return await getWidget("attendance", days);
  }, [getWidget]);

  const getLeavesWidget = useCallback(async (days = 30) => {
    return await getWidget("leaves", days);
  }, [getWidget]);

  const getPayrollWidget = useCallback(async () => {
    return await getWidget("payroll");
  }, [getWidget]);

  const getReportsWidget = useCallback(async (days = 30) => {
    return await getWidget("reports", days);
  }, [getWidget]);

  const getNotificationsWidget = useCallback(async () => {
    return await getWidget("notifications");
  }, [getWidget]);

  // Utility methods - memoized
  const clearError = useCallback(() => {
    dispatch({ type: DASHBOARD_ACTIONS.CLEAR_ERROR });
  }, []);

  const clearWidgets = useCallback(() => {
    dispatch({ type: DASHBOARD_ACTIONS.CLEAR_WIDGET_DATA });
  }, []);

  const isDataStale = useCallback((dataType, maxAgeMinutes = 5) => {
    const lastUpdated = state.lastUpdated[dataType];
    if (!lastUpdated) return true;

    const ageInMinutes = (Date.now() - lastUpdated) / (1000 * 60);
    return ageInMinutes > maxAgeMinutes;
  }, [state.lastUpdated]);

  // Format helpers - memoized
  const formatters = useMemo(() => ({
    formatAttendanceRate: (rate) => {
      return `${Math.round(rate || 0)}%`;
    },

    formatCurrency: (amount) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount || 0);
    },

    formatDate: (date) => {
      return new Date(date).toLocaleDateString();
    },

    formatDateTime: (dateTime) => {
      return new Date(dateTime).toLocaleString();
    },

    formatPendingActionPriority: (priority) => {
      const priorities = {
        High: { color: "red", weight: 3 },
        Medium: { color: "orange", weight: 2 },
        Low: { color: "green", weight: 1 },
      };
      return priorities[priority] || priorities.Low;
    },
  }), []);

  // Data transformation helpers - memoized
  const transformers = useMemo(() => ({
    getDepartmentWithNames: async (departmentData) => {
      // This would require department names from another context/API
      return departmentData;
    },

    getAttendanceTrendData: (dailyTrend) => {
      return extractArrayData(dailyTrend).map((day) => ({
        date: day.Date,
        present: day.Present,
        late: day.Late,
        total: day.Total,
        attendanceRate: day.Total > 0 ? (day.Present / day.Total) * 100 : 0,
      }));
    },

    getLeaveTypeChartData: (leaveTypes) => {
      return extractArrayData(leaveTypes).map((type) => ({
        name: type.LeaveType,
        value: type.Count,
        approved: type.ApprovedCount,
        days: type.TotalDays,
      }));
    },
  }), []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // State
    ...state,

    // API methods
    getOverview,
    getCompanyStats,
    getWidget,
    getEmployeesWidget,
    getAttendanceWidget,
    getLeavesWidget,
    getPayrollWidget,
    getReportsWidget,
    getNotificationsWidget,
    getAttendanceAnalytics,
    getLeaveAnalytics,
    loadDashboardData,
    refreshOverview,

    // Utility methods
    clearError,
    clearWidgets,
    isDataStale,

    // Helpers
    formatters,
    transformers,
  }), [
    state,
    getOverview,
    getCompanyStats,
    getWidget,
    getEmployeesWidget,
    getAttendanceWidget,
    getLeavesWidget,
    getPayrollWidget,
    getReportsWidget,
    getNotificationsWidget,
    getAttendanceAnalytics,
    getLeaveAnalytics,
    loadDashboardData,
    refreshOverview,
    clearError,
    clearWidgets,
    isDataStale,
    formatters,
    transformers,
  ]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use Dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

// Export context for advanced usage
export { DashboardContext };

// Export API client for direct usage if needed
export { dashboardApiClient };