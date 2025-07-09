import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

// Base URL configuration
const BASE_URL = "https://api.speed-erp.com/api";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
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
  stats: {
    TotalCompanies: 0,
    CompanyGrowthPercentage: 0,
    TotalUsers: 0,
    UserGrowthPercentage: 0,
    MonthlyRevenue: 0,
    RevenueGrowthPercentage: 0,
    OpenTickets: 0,
    StorageUsedGB: 0,
    TotalApiCalls: 0,
    ActiveCompanies: 0,
    NewCompaniesThisMonth: 0,
    ActiveUsers: 0,
    YearlyRevenue: 0,
  },
  recentCompanies: [],
  recentTickets: [],
  systemAlerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Action types
const SUPERADMIN_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_DASHBOARD_DATA: "SET_DASHBOARD_DATA",
  SET_STATS: "SET_STATS",
  SET_RECENT_COMPANIES: "SET_RECENT_COMPANIES",
  SET_RECENT_TICKETS: "SET_RECENT_TICKETS",
  SET_SYSTEM_ALERTS: "SET_SYSTEM_ALERTS",
  REFRESH_DATA: "REFRESH_DATA",
};

// Reducer function
const superAdminReducer = (state, action) => {
  switch (action.type) {
    case SUPERADMIN_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case SUPERADMIN_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case SUPERADMIN_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_DASHBOARD_DATA:
      return {
        ...state,
        stats: action.payload.Stats || initialState.stats,
        recentCompanies: action.payload.RecentCompanies?.$values || [],
        recentTickets: action.payload.RecentTickets?.$values || [],
        systemAlerts: action.payload.SystemAlerts?.$values || [],
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      };

    case SUPERADMIN_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: { ...state.stats, ...action.payload },
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_RECENT_COMPANIES:
      return {
        ...state,
        recentCompanies: action.payload,
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_RECENT_TICKETS:
      return {
        ...state,
        recentTickets: action.payload,
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_SYSTEM_ALERTS:
      return {
        ...state,
        systemAlerts: action.payload,
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.REFRESH_DATA:
      return {
        ...state,
        lastUpdated: new Date(),
      };

    default:
      return state;
  }
};

// Create context
const SuperAdminContext = createContext();

// SuperAdminProvider component
export const SuperDashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(superAdminReducer, initialState);

  // Helper function to handle API errors
  const handleApiError = useCallback((error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.Message) {
      errorMessage = error.response.data.Message;
    } else if (error.response?.data?.validationErrors) {
      errorMessage = error.response.data.validationErrors.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: SUPERADMIN_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }, []);

  // SuperAdmin API methods
  const superAdminApi = {
    // Get dashboard statistics
    getDashboardStats: async () => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get("/superadmin/dashboard");

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_DASHBOARD_DATA,
          payload: response.data || {},
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get specific stats only
    getStats: async () => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get("/superadmin/stats");

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_STATS,
          payload: response.data.Data || {},
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get recent companies
    getRecentCompanies: async (limit = 10) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(
          `/superadmin/companies/recent?limit=${limit}`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_RECENT_COMPANIES,
          payload: response.data.Data?.$values || response.data.Data || [],
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get recent tickets
    getRecentTickets: async (limit = 10) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(
          `/superadmin/tickets/recent?limit=${limit}`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_RECENT_TICKETS,
          payload: response.data.Data?.$values || response.data.Data || [],
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get system alerts
    getSystemAlerts: async () => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get("/superadmin/alerts");

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_SYSTEM_ALERTS,
          payload: response.data.Data?.$values || response.data.Data || [],
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Resolve system alert
    resolveAlert: async (alertId) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.patch(
          `/superadmin/alerts/${alertId}/resolve`
        );

        // Update the alert in state
        const updatedAlerts = state.systemAlerts.map((alert) =>
          alert.Id === alertId ? { ...alert, IsResolved: true } : alert
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_SYSTEM_ALERTS,
          payload: updatedAlerts,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Refresh all dashboard data
    refreshDashboard: async () => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get("/superadmin/dashboard");

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_DASHBOARD_DATA,
          payload: response.data || {},
        });

        dispatch({ type: SUPERADMIN_ACTIONS.REFRESH_DATA });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Clear error manually
    clearError: () => {
      dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });
    },

    // Get company details
    getCompanyDetails: async (companyId) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(
          `/superadmin/companies/${companyId}`
        );

        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: false });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Update company status
    updateCompanyStatus: async (companyId, status) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.patch(
          `/superadmin/companies/${companyId}/status`,
          {
            status: status,
          }
        );

        // Update company in recent companies list if it exists
        const updatedCompanies = state.recentCompanies.map((company) =>
          company.Id === companyId ? { ...company, Status: status } : company
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_RECENT_COMPANIES,
          payload: updatedCompanies,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get revenue analytics
    getRevenueAnalytics: async (period = "month") => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(
          `/superadmin/analytics/revenue?period=${period}`
        );

        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: false });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get user analytics
    getUserAnalytics: async (period = "month") => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(
          `/superadmin/analytics/users?period=${period}`
        );

        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: false });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
  };

  // Context value
  const contextValue = {
    // State
    ...state,

    // API methods
    ...superAdminApi,

    // Utility methods
    getActiveAlertsCount: () =>
      state.systemAlerts.filter((alert) => !alert.IsResolved).length,
    getCompanyById: (companyId) =>
      state.recentCompanies.find((company) => company.Id === companyId),
    getTicketById: (ticketId) =>
      state.recentTickets.find((ticket) => ticket.Id === ticketId),
    formatDate: (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    formatCurrency: (amount) => `$${amount.toLocaleString()}`,
    getGrowthColor: (percentage) =>
      percentage >= 0 ? "text-green-600" : "text-red-600",
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
    isDataStale: () => {
      if (!state.lastUpdated) return true;
      const now = new Date();
      const diff = now - state.lastUpdated;
      return diff > 5 * 60 * 1000; // 5 minutes
    },
  };

  return (
    <SuperAdminContext.Provider value={contextValue}>
      {children}
    </SuperAdminContext.Provider>
  );
};

// Custom hook to use SuperAdmin context
export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error("useSuperAdmin must be used within a SuperAdminProvider");
  }
  return context;
};

// Export context for advanced usage
export { SuperAdminContext };

// Export API client for direct usage if needed
export { apiClient };
