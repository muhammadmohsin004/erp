import React, { createContext, useContext, useReducer } from "react";
import axios from "axios";

// Base URL configuration
const BASE_URL = "https://api.speed-erp.com/api";

// Create axios instance with default configuration
const superAdminApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
superAdminApiClient.interceptors.request.use(
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
superAdminApiClient.interceptors.response.use(
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
  // Dashboard
  dashboard: null,

  // Companies
  companies: [],
  companyDetail: null,
  companiesPagination: null,

  // Users
  allUsers: [],
  usersPagination: null,

  // Subscription Plans
  subscriptionPlans: [],

  // Analytics
  systemAnalytics: null,

  // Support Tickets
  supportTickets: [],
  ticketsPagination: null,

  // System Logs
  systemLogs: [],
  logsPagination: null,

  // Loading states
  isLoading: false,
  isDashboardLoading: false,
  isCompaniesLoading: false,
  isUsersLoading: false,
  isAnalyticsLoading: false,
  isTicketsLoading: false,
  isLogsLoading: false,

  // Error state
  error: null,
};

// Action types
const SUPERADMIN_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_DASHBOARD_LOADING: "SET_DASHBOARD_LOADING",
  SET_COMPANIES_LOADING: "SET_COMPANIES_LOADING",
  SET_USERS_LOADING: "SET_USERS_LOADING",
  SET_ANALYTICS_LOADING: "SET_ANALYTICS_LOADING",
  SET_TICKETS_LOADING: "SET_TICKETS_LOADING",
  SET_LOGS_LOADING: "SET_LOGS_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",

  // Dashboard
  SET_DASHBOARD: "SET_DASHBOARD",

  // Companies
  SET_COMPANIES: "SET_COMPANIES",
  SET_COMPANY_DETAIL: "SET_COMPANY_DETAIL",
  ADD_COMPANY: "ADD_COMPANY",
  UPDATE_COMPANY: "UPDATE_COMPANY",
  REMOVE_COMPANY: "REMOVE_COMPANY",

  // Users
  SET_ALL_USERS: "SET_ALL_USERS",

  // Subscription Plans
  SET_SUBSCRIPTION_PLANS: "SET_SUBSCRIPTION_PLANS",
  ADD_SUBSCRIPTION_PLAN: "ADD_SUBSCRIPTION_PLAN",

  // Analytics
  SET_SYSTEM_ANALYTICS: "SET_SYSTEM_ANALYTICS",

  // Support Tickets
  SET_SUPPORT_TICKETS: "SET_SUPPORT_TICKETS",

  // System Logs
  SET_SYSTEM_LOGS: "SET_SYSTEM_LOGS",
};

// Reducer function
const superAdminReducer = (state, action) => {
  switch (action.type) {
    case SUPERADMIN_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case SUPERADMIN_ACTIONS.SET_DASHBOARD_LOADING:
      return {
        ...state,
        isDashboardLoading: action.payload,
      };

    case SUPERADMIN_ACTIONS.SET_COMPANIES_LOADING:
      return {
        ...state,
        isCompaniesLoading: action.payload,
      };

    case SUPERADMIN_ACTIONS.SET_USERS_LOADING:
      return {
        ...state,
        isUsersLoading: action.payload,
      };

    case SUPERADMIN_ACTIONS.SET_ANALYTICS_LOADING:
      return {
        ...state,
        isAnalyticsLoading: action.payload,
      };

    case SUPERADMIN_ACTIONS.SET_TICKETS_LOADING:
      return {
        ...state,
        isTicketsLoading: action.payload,
      };

    case SUPERADMIN_ACTIONS.SET_LOGS_LOADING:
      return {
        ...state,
        isLogsLoading: action.payload,
      };

    case SUPERADMIN_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isDashboardLoading: false,
        isCompaniesLoading: false,
        isUsersLoading: false,
        isAnalyticsLoading: false,
        isTicketsLoading: false,
        isLogsLoading: false,
      };

    case SUPERADMIN_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_DASHBOARD:
      return {
        ...state,
        dashboard: action.payload,
        isDashboardLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_COMPANIES:
      return {
        ...state,
        companies: action.payload.companies,
        companiesPagination: action.payload.pagination,
        isCompaniesLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_COMPANY_DETAIL:
      return {
        ...state,
        companyDetail: action.payload,
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.ADD_COMPANY:
      return {
        ...state,
        companies: [action.payload, ...state.companies],
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.UPDATE_COMPANY:
      return {
        ...state,
        companies: state.companies.map((company) =>
          company.id === action.payload.id
            ? { ...company, ...action.payload }
            : company
        ),
        companyDetail:
          state.companyDetail?.id === action.payload.id
            ? { ...state.companyDetail, ...action.payload }
            : state.companyDetail,
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.REMOVE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(
          (company) => company.id !== action.payload
        ),
        companyDetail:
          state.companyDetail?.id === action.payload
            ? null
            : state.companyDetail,
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload.users,
        usersPagination: action.payload.pagination,
        isUsersLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_SUBSCRIPTION_PLANS:
      return {
        ...state,
        subscriptionPlans: action.payload,
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.ADD_SUBSCRIPTION_PLAN:
      return {
        ...state,
        subscriptionPlans: [...state.subscriptionPlans, action.payload],
        isLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_SYSTEM_ANALYTICS:
      return {
        ...state,
        systemAnalytics: action.payload,
        isAnalyticsLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_SUPPORT_TICKETS:
      return {
        ...state,
        supportTickets: action.payload.tickets,
        ticketsPagination: action.payload.pagination,
        isTicketsLoading: false,
        error: null,
      };

    case SUPERADMIN_ACTIONS.SET_SYSTEM_LOGS:
      return {
        ...state,
        systemLogs: action.payload.logs,
        logsPagination: action.payload.pagination,
        isLogsLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const SuperAdminContext = createContext();

// SuperAdminProvider component
export const SuperAdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(superAdminReducer, initialState);

  // Helper function to handle API errors
  const handleApiError = (error) => {
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
      type: SUPERADMIN_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  };

  // SuperAdmin API methods
  const superAdminApi = {
    // ========== DASHBOARD ==========
    getDashboard: async () => {
      try {
        dispatch({
          type: SUPERADMIN_ACTIONS.SET_DASHBOARD_LOADING,
          payload: true,
        });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await superAdminApiClient.get("/superadmin/dashboard");

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_DASHBOARD,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== COMPANY MANAGEMENT ==========
    getCompanies: async (
      page = 1,
      pageSize = 10,
      search = "",
      status = "",
      plan = ""
    ) => {
      try {
        dispatch({
          type: SUPERADMIN_ACTIONS.SET_COMPANIES_LOADING,
          payload: true,
        });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (plan) params.append("plan", plan);

        const response = await superAdminApiClient.get(
          `/superadmin/companies?${params}`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_COMPANIES,
          payload: {
            companies: response.data.Items?.$values,
            pagination: {
              totalCount: response.data.totalCount,
              page: response.data.page,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
            },
          },
        });

        return response.data?.$values;
      } catch (error) {
        handleApiError(error);
      }
    },

    getCompanyDetail: async (id) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await superAdminApiClient.get(
          `/superadmin/companies/${id}`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_COMPANY_DETAIL,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    createCompany: async (companyData) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await superAdminApiClient.post(
          "/superadmin/companies",
          companyData
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.ADD_COMPANY,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    suspendCompany: async (id, suspendData) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await superAdminApiClient.put(
          `/superadmin/companies/${id}/suspend`,
          suspendData
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.UPDATE_COMPANY,
          payload: { id, isActive: false },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    activateCompany: async (id) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await superAdminApiClient.put(
          `/superadmin/companies/${id}/activate`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.UPDATE_COMPANY,
          payload: { id, isActive: true },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    deleteCompany: async (id) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await superAdminApiClient.delete(
          `/superadmin/companies/${id}`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.REMOVE_COMPANY,
          payload: id,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== USER MANAGEMENT ==========
    getAllUsers: async (
      page = 1,
      pageSize = 10,
      search = "",
      companyId = null,
      role = "",
      isActive = null
    ) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_USERS_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (search) params.append("search", search);
        if (companyId) params.append("companyId", companyId.toString());
        if (role) params.append("role", role);
        if (isActive !== null) params.append("isActive", isActive.toString());

        const response = await superAdminApiClient.get(
          `/superadmin/users?${params}`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_ALL_USERS,
          payload: {
            users: response.data.Items.$values,
            pagination: {
              totalCount: response.data.totalCount,
              page: response.data.page,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
            },
          },
        });

        return response.data.Items.$values;
      } catch (error) {
        handleApiError(error);
      }
    },

    impersonateUser: async (userId) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await superAdminApiClient.post(
          `/superadmin/users/${userId}/impersonate`
        );

        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== SUBSCRIPTION PLANS ==========
    getSubscriptionPlans: async () => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await superAdminApiClient.get(
          "/superadmin/subscription-plans"
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_SUBSCRIPTION_PLANS,
          payload: response.data?.$values,
        });

        return response.data?.$values;
      } catch (error) {
        handleApiError(error);
      }
    },

    createSubscriptionPlan: async (planData) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const response = await superAdminApiClient.post(
          "/superadmin/subscription-plans",
          planData
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.ADD_SUBSCRIPTION_PLAN,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== SYSTEM ANALYTICS ==========
    getSystemAnalytics: async (startDate = null, endDate = null) => {
      try {
        dispatch({
          type: SUPERADMIN_ACTIONS.SET_ANALYTICS_LOADING,
          payload: true,
        });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response = await superAdminApiClient.get(
          `/superadmin/analytics?${params}`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_SYSTEM_ANALYTICS,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== SUPPORT TICKETS ==========
    getSupportTickets: async (
      page = 1,
      pageSize = 10,
      status = "",
      priority = "",
      companyId = null
    ) => {
      try {
        dispatch({
          type: SUPERADMIN_ACTIONS.SET_TICKETS_LOADING,
          payload: true,
        });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (status) params.append("status", status);
        if (priority) params.append("priority", priority);
        if (companyId) params.append("companyId", companyId.toString());

        const response = await superAdminApiClient.get(
          `/superadmin/support-tickets?${params}`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_SUPPORT_TICKETS,
          payload: {
            tickets: response.data.items,
            pagination: {
              totalCount: response.data.totalCount,
              page: response.data.page,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
            },
          },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== SYSTEM LOGS ==========
    getSystemLogs: async (
      page = 1,
      pageSize = 50,
      level = "",
      action = "",
      startDate = null,
      endDate = null
    ) => {
      try {
        dispatch({ type: SUPERADMIN_ACTIONS.SET_LOGS_LOADING, payload: true });
        dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (level) params.append("level", level);
        if (action) params.append("action", action);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response = await superAdminApiClient.get(
          `/superadmin/system-logs?${params}`
        );

        dispatch({
          type: SUPERADMIN_ACTIONS.SET_SYSTEM_LOGS,
          payload: {
            logs: response.data.items,
            pagination: {
              totalCount: response.data.totalCount,
              page: response.data.page,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
            },
          },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== UTILITY METHODS ==========
    clearError: () => {
      dispatch({ type: SUPERADMIN_ACTIONS.CLEAR_ERROR });
    },

    clearCompanyDetail: () => {
      dispatch({ type: SUPERADMIN_ACTIONS.SET_COMPANY_DETAIL, payload: null });
    },
  };

  // Context value
  const contextValue = {
    // State
    ...state,

    // API methods
    ...superAdminApi,
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
export { superAdminApiClient };
