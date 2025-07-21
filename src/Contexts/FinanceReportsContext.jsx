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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("company");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Report types supported by the backend
export const REPORT_TYPES = {
  PROFIT_LOSS: "profitloss",
  CASH_FLOW: "cashflow",
  EXPENSE_ANALYSIS: "expenseanalysis",
  INCOME_ANALYSIS: "incomeanalysis",
  VENDOR_ANALYSIS: "vendoranalysis",
  CATEGORY_BREAKDOWN: "categorybreakdown",
  BALANCE_SHEET: "balancesheet",
};

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.PROFIT_LOSS]: "Profit & Loss",
  [REPORT_TYPES.CASH_FLOW]: "Cash Flow",
  [REPORT_TYPES.EXPENSE_ANALYSIS]: "Expense Analysis",
  [REPORT_TYPES.INCOME_ANALYSIS]: "Income Analysis",
  [REPORT_TYPES.VENDOR_ANALYSIS]: "Vendor Analysis",
  [REPORT_TYPES.CATEGORY_BREAKDOWN]: "Category Breakdown",
  [REPORT_TYPES.BALANCE_SHEET]: "Balance Sheet",
};

// Initial state structure
const initialState = {
  reports: [],
  currentReport: null,
  currentReportData: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 25,
    totalItems: 0,
    totalPages: 0,
  },
  filters: {
    search: "",
    reportType: "",
    startDate: null,
    endDate: null,
  },
  sorting: {
    sortBy: "GeneratedAt",
    sortAscending: false,
  },
  // Quick report cache
  quickReports: {
    profitLoss: null,
    cashFlow: null,
    expenseAnalysis: null,
  },
  lastFetchOptions: null,
  // Generation state
  isGenerating: false,
  generationProgress: null,
};

// Action types
const FINANCE_REPORTS_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_GENERATING: "SET_GENERATING", 
  SET_GENERATION_PROGRESS: "SET_GENERATION_PROGRESS",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_REPORTS: "SET_REPORTS",
  SET_CURRENT_REPORT: "SET_CURRENT_REPORT",
  SET_CURRENT_REPORT_DATA: "SET_CURRENT_REPORT_DATA",
  CLEAR_CURRENT_REPORT: "CLEAR_CURRENT_REPORT",
  ADD_REPORT: "ADD_REPORT",
  DELETE_REPORT: "DELETE_REPORT",
  SET_FILTERS: "SET_FILTERS",
  SET_SORTING: "SET_SORTING",
  SET_PAGINATION: "SET_PAGINATION",
  RESET_FILTERS: "RESET_FILTERS",
  SET_LAST_FETCH_OPTIONS: "SET_LAST_FETCH_OPTIONS",
  SET_QUICK_REPORT: "SET_QUICK_REPORT",
  CLEAR_QUICK_REPORTS: "CLEAR_QUICK_REPORTS",
};

// Enhanced reducer function
const financeReportsReducer = (state, action) => {
  switch (action.type) {
    case FINANCE_REPORTS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case FINANCE_REPORTS_ACTIONS.SET_GENERATING:
      return {
        ...state,
        isGenerating: action.payload,
      };

    case FINANCE_REPORTS_ACTIONS.SET_GENERATION_PROGRESS:
      return {
        ...state,
        generationProgress: action.payload,
      };

    case FINANCE_REPORTS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isGenerating: false,
      };

    case FINANCE_REPORTS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case FINANCE_REPORTS_ACTIONS.SET_REPORTS:
      {
        const responseData = action.payload;
        
        // Handle nested response structure
        let reportsData = [];
        
        if (responseData.Data && Array.isArray(responseData.Data)) {
          reportsData = responseData.Data;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          reportsData = responseData.data;
        } else if (Array.isArray(responseData)) {
          reportsData = responseData;
        }

        console.log('🔧 Context SET_REPORTS Debug:');
        console.log('Response structure:', responseData);
        console.log('Extracted reports array:', reportsData);
        console.log('Reports count:', reportsData.length);

        return {
          ...state,
          reports: reportsData,
          pagination: {
            page: responseData.Paginations?.CurrentPage || responseData.Paginations?.PageNumber || state.pagination.page,
            pageSize: responseData.Paginations?.PageSize || state.pagination.pageSize,
            totalItems: responseData.Paginations?.TotalItems || reportsData.length,
            totalPages: responseData.Paginations?.TotalPages ||
              Math.ceil((responseData.Paginations?.TotalItems || reportsData.length) /
                (responseData.Paginations?.PageSize || state.pagination.pageSize)),
          },
          isLoading: false,
          error: null,
        };
      }

    case FINANCE_REPORTS_ACTIONS.SET_CURRENT_REPORT:
      return {
        ...state,
        currentReport: action.payload,
        isLoading: false,
        error: null,
      };

    case FINANCE_REPORTS_ACTIONS.SET_CURRENT_REPORT_DATA:
      return {
        ...state,
        currentReportData: action.payload,
        isLoading: false,
        error: null,
      };

    case FINANCE_REPORTS_ACTIONS.CLEAR_CURRENT_REPORT:
      return {
        ...state,
        currentReport: null,
        currentReportData: null,
      };

    case FINANCE_REPORTS_ACTIONS.ADD_REPORT:
      return {
        ...state,
        reports: [action.payload, ...state.reports],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1,
        },
        isLoading: false,
        isGenerating: false,
        error: null,
      };

    case FINANCE_REPORTS_ACTIONS.DELETE_REPORT:
      return {
        ...state,
        reports: state.reports.filter((report) => report.Id !== action.payload),
        currentReport:
          state.currentReport?.Id === action.payload
            ? null
            : state.currentReport,
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - 1,
        },
        isLoading: false,
        error: null,
      };

    case FINANCE_REPORTS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };

    case FINANCE_REPORTS_ACTIONS.SET_SORTING:
      return {
        ...state,
        sorting: action.payload,
        pagination: { ...state.pagination, page: 1 },
      };

    case FINANCE_REPORTS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case FINANCE_REPORTS_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: {
          search: "",
          reportType: "",
          startDate: null,
          endDate: null,
        },
        sorting: {
          sortBy: "GeneratedAt",
          sortAscending: false,
        },
        pagination: { ...state.pagination, page: 1 },
      };

    case FINANCE_REPORTS_ACTIONS.SET_LAST_FETCH_OPTIONS:
      return {
        ...state,
        lastFetchOptions: action.payload,
      };

    case FINANCE_REPORTS_ACTIONS.SET_QUICK_REPORT:
      return {
        ...state,
        quickReports: {
          ...state.quickReports,
          [action.payload.type]: action.payload.data,
        },
        isLoading: false,
        error: null,
      };

    case FINANCE_REPORTS_ACTIONS.CLEAR_QUICK_REPORTS:
      return {
        ...state,
        quickReports: {
          profitLoss: null,
          cashFlow: null,
          expenseAnalysis: null,
        },
      };

    default:
      return state;
  }
};

// Create context
const FinanceReportsContext = createContext();

// FinanceReportsProvider component
export const FinanceReportsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReportsReducer, initialState);

  // Enhanced error handler
  const handleApiError = useCallback((error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response?.data?.Message) {
      errorMessage = error.response.data.Message;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.ValidationErrors) {
      errorMessage = Array.isArray(error.response.data.ValidationErrors)
        ? error.response.data.ValidationErrors.join(", ")
        : error.response.data.ValidationErrors;
    } else if (error.response?.data?.validationErrors) {
      errorMessage = Array.isArray(error.response.data.validationErrors)
        ? error.response.data.validationErrors.join(", ")
        : error.response.data.validationErrors;
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = [];
      Object.keys(errors).forEach(key => {
        if (Array.isArray(errors[key])) {
          errorMessages.push(...errors[key]);
        } else {
          errorMessages.push(errors[key]);
        }
      });
      errorMessage = errorMessages.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: FINANCE_REPORTS_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }, []);

  // Get all reports with filtering and pagination
  const getReports = useCallback(async (options = {}) => {
    try {
      dispatch({ type: FINANCE_REPORTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_ERROR });

      const params = {
        page: options.page || state.pagination.page,
        pageSize: options.pageSize || state.pagination.pageSize,
        search: options.search || state.filters.search,
        reportType: options.reportType || state.filters.reportType,
        startDate: options.startDate || state.filters.startDate,
        endDate: options.endDate || state.filters.endDate,
      };

      // Remove empty params
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      // Store fetch options for refresh
      dispatch({
        type: FINANCE_REPORTS_ACTIONS.SET_LAST_FETCH_OPTIONS,
        payload: params,
      });

      console.log('🚀 Fetching reports with params:', params);

      const response = await apiClient.get("/financereports", { params });

      console.log('✅ Raw API response:', response.data);

      dispatch({
        type: FINANCE_REPORTS_ACTIONS.SET_REPORTS,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      console.error('❌ getReports error:', error);
      handleApiError(error);
    }
  }, [state.pagination, state.filters, handleApiError]);

  // Get single report by ID
  const getReport = useCallback(async (reportId) => {
    try {
      dispatch({ type: FINANCE_REPORTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_ERROR });

      const response = await apiClient.get(`/financereports/${reportId}`);

      console.log('📊 Report response:', response.data);

      const reportData = response.data.Data || response.data.data || response.data;
      
      dispatch({
        type: FINANCE_REPORTS_ACTIONS.SET_CURRENT_REPORT,
        payload: reportData.Report,
      });

      dispatch({
        type: FINANCE_REPORTS_ACTIONS.SET_CURRENT_REPORT_DATA,
        payload: reportData.ParsedData,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // Generate comprehensive financial report
  const generateReport = useCallback(async (reportData) => {
    try {
      dispatch({ type: FINANCE_REPORTS_ACTIONS.SET_GENERATING, payload: true });
      dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_ERROR });

      // Validate required fields
      if (!reportData.reportName?.trim()) {
        throw new Error("Report name is required");
      }
      if (!reportData.reportType) {
        throw new Error("Report type is required");
      }
      if (!reportData.startDate) {
        throw new Error("Start date is required");
      }
      if (!reportData.endDate) {
        throw new Error("End date is required");
      }

      const payload = {
        ReportName: reportData.reportName.trim(),
        ReportType: reportData.reportType,
        StartDate: reportData.startDate,
        EndDate: reportData.endDate,
      };

      console.log('=== REPORT GENERATION DEBUG INFO ===');
      console.log('Payload being sent:', payload);

      const response = await apiClient.post("/financereports/generate", payload, {
        timeout: 120000, // 2 minutes for complex reports
      });

      console.log('✅ Report generation response:', response.data);

      const newReport = response.data.Data || response.data.data || response.data;

      dispatch({
        type: FINANCE_REPORTS_ACTIONS.ADD_REPORT,
        payload: newReport,
      });

      return response.data;
    } catch (error) {
      console.error('❌ REPORT GENERATION ERROR:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      handleApiError(error);
    }
  }, [handleApiError]);

  // Delete report
  const deleteReport = useCallback(async (reportId) => {
    try {
      dispatch({ type: FINANCE_REPORTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_ERROR });

      const response = await apiClient.delete(`/financereports/${reportId}`);

      dispatch({
        type: FINANCE_REPORTS_ACTIONS.DELETE_REPORT,
        payload: reportId,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // Quick report methods
  const getQuickProfitLoss = useCallback(async (startDate = null, endDate = null) => {
    try {
      dispatch({ type: FINANCE_REPORTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_ERROR });

      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('📊 Calling quick profit-loss with params:', params);

      const response = await apiClient.get("/financereports/quick/profit-loss", { params });

      console.log('📊 Quick profit-loss response:', response.data);

      const reportData = response.data.Data || response.data.data || response.data;

      dispatch({
        type: FINANCE_REPORTS_ACTIONS.SET_QUICK_REPORT,
        payload: { type: 'profitLoss', data: reportData },
      });

      return response.data;
    } catch (error) {
      console.error('❌ Quick profit-loss error:', error);
      handleApiError(error);
    }
  }, [handleApiError]);

  const getQuickCashFlow = useCallback(async (startDate = null, endDate = null) => {
    try {
      dispatch({ type: FINANCE_REPORTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_ERROR });

      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('📊 Calling quick cash-flow with params:', params);

      const response = await apiClient.get("/financereports/quick/cash-flow", { params });

      console.log('📊 Quick cash-flow response:', response.data);

      const reportData = response.data.Data || response.data.data || response.data;

      dispatch({
        type: FINANCE_REPORTS_ACTIONS.SET_QUICK_REPORT,
        payload: { type: 'cashFlow', data: reportData },
      });

      return response.data;
    } catch (error) {
      console.error('❌ Quick cash-flow error:', error);
      handleApiError(error);
    }
  }, [handleApiError]);

  const getQuickExpenseAnalysis = useCallback(async (startDate = null, endDate = null) => {
    try {
      dispatch({ type: FINANCE_REPORTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_ERROR });

      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('📊 Calling quick expense-analysis with params:', params);

      const response = await apiClient.get("/financereports/quick/expense-analysis", { params });

      console.log('📊 Quick expense-analysis response:', response.data);

      const reportData = response.data.Data || response.data.data || response.data;

      dispatch({
        type: FINANCE_REPORTS_ACTIONS.SET_QUICK_REPORT,
        payload: { type: 'expenseAnalysis', data: reportData },
      });

      return response.data;
    } catch (error) {
      console.error('❌ Quick expense-analysis error:', error);
      handleApiError(error);
    }
  }, [handleApiError]);

  // Filter and sorting methods
  const setFilters = useCallback((filters) => {
    dispatch({
      type: FINANCE_REPORTS_ACTIONS.SET_FILTERS,
      payload: filters,
    });
  }, []);

  const setSorting = useCallback((sortBy, sortAscending) => {
    dispatch({
      type: FINANCE_REPORTS_ACTIONS.SET_SORTING,
      payload: { sortBy, sortAscending },
    });
  }, []);

  const setPagination = useCallback((paginationData) => {
    dispatch({
      type: FINANCE_REPORTS_ACTIONS.SET_PAGINATION,
      payload: paginationData,
    });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: FINANCE_REPORTS_ACTIONS.RESET_FILTERS });
  }, []);

  const clearCurrentReport = useCallback(() => {
    dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_CURRENT_REPORT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_ERROR });
  }, []);

  const clearQuickReports = useCallback(() => {
    dispatch({ type: FINANCE_REPORTS_ACTIONS.CLEAR_QUICK_REPORTS });
  }, []);

  // Refresh current data
  const refreshReports = useCallback(async () => {
    if (state.lastFetchOptions) {
      return await getReports(state.lastFetchOptions);
    } else {
      return await getReports();
    }
  }, [state.lastFetchOptions, getReports]);

  // Context value with all methods
  const contextValue = {
    // State
    reports: state.reports,
    currentReport: state.currentReport,
    currentReportData: state.currentReportData,
    loading: state.isLoading,
    generating: state.isGenerating,
    generationProgress: state.generationProgress,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    sorting: state.sorting,
    quickReports: state.quickReports,

    // Core operations
    getReports,
    getReport,
    generateReport,
    deleteReport,

    // Quick reports
    getQuickProfitLoss,
    getQuickCashFlow,
    getQuickExpenseAnalysis,

    // State management
    setFilters,
    setSorting,
    setPagination,
    resetFilters,
    clearCurrentReport,
    clearError,
    clearQuickReports,
    refreshReports,

    // Utility methods
    getTotalPages: () =>
      Math.ceil(state.pagination.totalItems / state.pagination.pageSize),
    hasNextPage: () =>
      state.pagination.page <
      Math.ceil(state.pagination.totalItems / state.pagination.pageSize),
    hasPrevPage: () => state.pagination.page > 1,
    getReportById: (reportId) =>
      state.reports.find((report) => report.Id === reportId),
    isReportLoaded: (reportId) =>
      state.reports.some((report) => report.Id === reportId),

    // Filter helpers
    setSearchFilter: (search) => setFilters({ search }),
    setReportTypeFilter: (reportType) => setFilters({ reportType }),
    setDateRangeFilter: (startDate, endDate) => setFilters({ startDate, endDate }),

    // Quick actions
    searchReports: (searchTerm) => {
      setFilters({ search: searchTerm });
      return getReports({ search: searchTerm });
    },
    filterByReportType: (reportType) => {
      setFilters({ reportType });
      return getReports({ reportType });
    },
    sortReports: (sortBy, sortAscending = true) => {
      setSorting(sortBy, sortAscending);
      return getReports({ sortBy, sortAscending });
    },

    // Report type utilities
    getReportTypeLabel: (reportType) => 
      REPORT_TYPE_LABELS[reportType] || reportType,
    getAllReportTypes: () => Object.entries(REPORT_TYPE_LABELS),
    isValidReportType: (reportType) => 
      Object.values(REPORT_TYPES).includes(reportType),

    // Date utilities
    getDefaultStartDate: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1);
    },
    getDefaultEndDate: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0);
    },
    getCurrentMonthRange: () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { startDate, endDate };
    },
    getLastMonthRange: () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate, endDate };
    },
    getLast30DaysRange: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      return { startDate, endDate };
    },

    // Quick report helpers
    hasQuickReport: (type) => state.quickReports[type] !== null,
    getQuickReport: (type) => state.quickReports[type],

    // Statistics helpers (for dashboard summaries)
    getTotalReportsGenerated: () => state.pagination.totalItems,
    getReportsThisMonth: () => {
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return state.reports.filter(report => 
        new Date(report.GeneratedAt) >= thisMonthStart
      ).length;
    },
    getReportsByType: () => {
      const reportsByType = {};
      state.reports.forEach(report => {
        const type = report.ReportType;
        reportsByType[type] = (reportsByType[type] || 0) + 1;
      });
      return reportsByType;
    },
  };

  return (
    <FinanceReportsContext.Provider value={contextValue}>
      {children}
    </FinanceReportsContext.Provider>
  );
};

// Custom hook to use finance reports context
export const useFinanceReports = () => {
  const context = useContext(FinanceReportsContext);
  if (!context) {
    throw new Error("useFinanceReports must be used within a FinanceReportsProvider");
  }
  return context;
};

// Export context for advanced usage
export { FinanceReportsContext };

// Export API client for direct usage if needed
export { apiClient };