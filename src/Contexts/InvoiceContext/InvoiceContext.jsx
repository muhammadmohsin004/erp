import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Initial state for comprehensive invoice management
const initialState = {
  // Invoices
  invoices: [],
  currentInvoice: null,

  // Statistics and Reports
  invoiceStatistics: null,
  agingReport: null,

  // Common states
  loading: false,
  error: null,

  // Pagination
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false,
  },

  // Advanced Filters
  filters: {
    page: 1,
    pageSize: 25,
    search: "",
    status: "",
    clientId: null,
    startDate: null,
    endDate: null,
    dueDateStart: null,
    dueDateEnd: null,
    minAmount: null,
    maxAmount: null,
    currency: "",
    isOverdue: null,
    sortBy: "InvoiceNumber",
    sortAscending: false,
  },
};

// Action types
const actionTypes = {
  // Common actions
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_STATE: "RESET_STATE",

  // Invoice actions
  SET_INVOICES: "SET_INVOICES",
  SET_CURRENT_INVOICE: "SET_CURRENT_INVOICE",
  ADD_INVOICE: "ADD_INVOICE",
  UPDATE_INVOICE: "UPDATE_INVOICE",
  DELETE_INVOICE: "DELETE_INVOICE",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",

  // Analytics actions
  SET_STATISTICS: "SET_STATISTICS",
  SET_AGING_REPORT: "SET_AGING_REPORT",
};

// Reducer
const invoiceReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    case actionTypes.RESET_STATE:
      return initialState;

    case actionTypes.SET_INVOICES:
      return {
        ...state,
        invoices: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CURRENT_INVOICE:
      return {
        ...state,
        currentInvoice: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.ADD_INVOICE: {
      const currentData = state.invoices?.Data || [];
      const updatedData = [...currentData, action.payload];
      return {
        ...state,
        invoices: {
          ...state.invoices,
          Data: updatedData,
        },
        loading: false,
        error: null,
      };
    }

    case actionTypes.UPDATE_INVOICE: {
      const currentData = state.invoices?.Data || [];
      const updatedData = currentData.map((item) =>
        item.Id === action.payload.Id ? action.payload : item
      );
      return {
        ...state,
        invoices: {
          ...state.invoices,
          Data: updatedData,
        },
        currentInvoice:
          state.currentInvoice?.Id === action.payload.Id
            ? action.payload
            : state.currentInvoice,
        loading: false,
        error: null,
      };
    }

    case actionTypes.DELETE_INVOICE: {
      const currentData = state.invoices?.Data || [];
      const updatedData = currentData.filter(
        (item) => item.Id !== action.payload
      );
      return {
        ...state,
        invoices: {
          ...state.invoices,
          Data: updatedData,
        },
        currentInvoice:
          state.currentInvoice?.Id === action.payload
            ? null
            : state.currentInvoice,
        loading: false,
        error: null,
      };
    }

    case actionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case actionTypes.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case actionTypes.SET_STATISTICS:
      return {
        ...state,
        invoiceStatistics: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_AGING_REPORT:
      return {
        ...state,
        agingReport: action.payload,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const InvoiceContext = createContext();

// API base URL
const API_BASE_URL = "https://api.speed-erp.com/api/Invoices";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Helper function to make API calls with better error handling
const makeApiCall = async (url, options = {}) => {
  const token = getAuthToken();

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    console.log("Making API call to:", url);
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.Message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("API call failed:", error);

    // Handle specific network errors
    if (error.message.includes("ERR_NAME_NOT_RESOLVED")) {
      throw new Error(
        "Cannot connect to API server. Please check your internet connection or contact administrator."
      );
    }
    if (error.message.includes("ERR_NETWORK")) {
      throw new Error("Network error. Please check your internet connection.");
    }
    if (error.message.includes("ERR_CONNECTION_REFUSED")) {
      throw new Error("Connection refused. The API server might be down.");
    }

    throw error;
  }
};

// Context Provider
export const InvoiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  // Common actions
  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
  }, []);

  // ============ CORE CRUD OPERATIONS ============

  const getInvoices = useCallback(
    async (filterParams = {}) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        // Merge with current filters
        const params = { ...state.filters, ...filterParams };

        const queryParams = new URLSearchParams();

        // Add all possible filter parameters
        if (params.page) queryParams.append("page", params.page);
        if (params.pageSize) queryParams.append("pageSize", params.pageSize);
        if (params.search) queryParams.append("search", params.search);
        if (params.status) queryParams.append("status", params.status);
        if (params.clientId) queryParams.append("clientId", params.clientId);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.dueDateStart)
          queryParams.append("dueDateStart", params.dueDateStart);
        if (params.dueDateEnd)
          queryParams.append("dueDateEnd", params.dueDateEnd);
        if (params.minAmount) queryParams.append("minAmount", params.minAmount);
        if (params.maxAmount) queryParams.append("maxAmount", params.maxAmount);
        if (params.currency) queryParams.append("currency", params.currency);
        if (params.isOverdue !== null && params.isOverdue !== undefined) {
          queryParams.append("isOverdue", params.isOverdue);
        }
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortAscending !== undefined)
          queryParams.append("sortAscending", params.sortAscending);

        const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);

        if (response.Success) {
          dispatch({
            type: actionTypes.SET_INVOICES,
            payload: response.data.Data.$values,
          });

          if (response.Paginations) {
            dispatch({
              type: actionTypes.SET_PAGINATION,
              payload: {
                CurrentPage: response.Paginations.PageNumber,
                PageNumber: response.Paginations.PageNumber,
                PageSize: response.Paginations.PageSize,
                TotalItems: response.Paginations.TotalItems,
                TotalPages: response.Paginations.TotalPages,
                HasPreviousPage: response.Paginations.PageNumber > 1,
                HasNextPage:
                  response.Paginations.PageNumber <
                  response.Paginations.TotalPages,
              },
            });
          }

          // Update filters with used parameters
          dispatch({ type: actionTypes.SET_FILTERS, payload: params });
        } else {
          throw new Error(response.Message || "Failed to fetch invoices");
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      }
    },
    [state.filters]
  );

  const getInvoice = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`);

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CURRENT_INVOICE,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch invoice");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createInvoice = useCallback(async (invoiceData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(invoiceData),
      });

      if (response.Success) {
        dispatch({ type: actionTypes.ADD_INVOICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to create invoice");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateInvoice = useCallback(async (id, invoiceData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(invoiceData),
      });

      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_INVOICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to update invoice");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteInvoice = useCallback(async (id, hardDelete = false) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = hardDelete ? "?hardDelete=true" : "";
      const response = await makeApiCall(
        `${API_BASE_URL}/${id}${queryParams}`,
        {
          method: "DELETE",
        }
      );

      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_INVOICE, payload: id });
        return true;
      } else {
        throw new Error(response.Message || "Failed to delete invoice");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // ============ INVOICE STATUS MANAGEMENT ============

  const sendInvoice = useCallback(
    async (id, sendData) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const response = await makeApiCall(`${API_BASE_URL}/${id}/send`, {
          method: "POST",
          body: JSON.stringify(sendData),
        });

        if (response.Success) {
          // Refresh the current invoice if it's the one being sent
          if (state.currentInvoice?.Id === id) {
            await getInvoice(id);
          }
          // Refresh the invoices list to show updated status
          await getInvoices();

          dispatch({ type: actionTypes.SET_LOADING, payload: false });
          return true;
        } else {
          throw new Error(response.Message || "Failed to send invoice");
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return false;
      }
    },
    [state.currentInvoice, getInvoice, getInvoices]
  );

  const markInvoiceAsPaid = useCallback(
    async (id, paymentData) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const response = await makeApiCall(`${API_BASE_URL}/${id}/mark-paid`, {
          method: "POST",
          body: JSON.stringify(paymentData),
        });

        if (response.Success) {
          // Refresh the current invoice if it's the one being marked as paid
          if (state.currentInvoice?.Id === id) {
            await getInvoice(id);
          }
          // Refresh the invoices list to show updated status
          await getInvoices();

          dispatch({ type: actionTypes.SET_LOADING, payload: false });
          return true;
        } else {
          throw new Error(response.Message || "Failed to mark invoice as paid");
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return false;
      }
    },
    [state.currentInvoice, getInvoice, getInvoices]
  );

  const voidInvoice = useCallback(
    async (id, voidData) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const response = await makeApiCall(`${API_BASE_URL}/${id}/void`, {
          method: "POST",
          body: JSON.stringify(voidData),
        });

        if (response.Success) {
          // Refresh the current invoice if it's the one being voided
          if (state.currentInvoice?.Id === id) {
            await getInvoice(id);
          }
          // Refresh the invoices list to show updated status
          await getInvoices();

          dispatch({ type: actionTypes.SET_LOADING, payload: false });
          return true;
        } else {
          throw new Error(response.Message || "Failed to void invoice");
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return false;
      }
    },
    [state.currentInvoice, getInvoice, getInvoices]
  );

  // ============ ANALYTICS AND REPORTS ============

  const getInvoiceStatistics = useCallback(
    async (startDate = null, endDate = null) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);

        const response = await makeApiCall(
          `${API_BASE_URL}/statistics?${queryParams}`
        );

        if (response.Success) {
          dispatch({
            type: actionTypes.SET_STATISTICS,
            payload: response.Data,
          });
          return response.Data;
        } else {
          throw new Error(
            response.Message || "Failed to fetch invoice statistics"
          );
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return null;
      }
    },
    []
  );

  const getAgingReport = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/aging-report`);

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_AGING_REPORT,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch aging report");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // ============ ADDITIONAL FEATURES ============

  const duplicateInvoice = useCallback(async (id, duplicateData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}/duplicate`, {
        method: "POST",
        body: JSON.stringify(duplicateData),
      });

      if (response.Success) {
        dispatch({ type: actionTypes.ADD_INVOICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to duplicate invoice");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // ============ UTILITY METHODS ============

  const refreshInvoices = useCallback(async () => {
    await getInvoices(state.filters);
  }, [getInvoices, state.filters]);

  const clearCurrentInvoice = useCallback(() => {
    dispatch({ type: actionTypes.SET_CURRENT_INVOICE, payload: null });
  }, []);

  const updateFilters = useCallback(
    (newFilters) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      return updatedFilters;
    },
    [state.filters]
  );

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      page: 1,
      pageSize: 25,
      search: "",
      status: "",
      clientId: null,
      startDate: null,
      endDate: null,
      dueDateStart: null,
      dueDateEnd: null,
      minAmount: null,
      maxAmount: null,
      currency: "",
      isOverdue: null,
      sortBy: "InvoiceNumber",
      sortAscending: false,
    };
    dispatch({ type: actionTypes.SET_FILTERS, payload: defaultFilters });
    return defaultFilters;
  }, []);

  // Context value with all methods and state
  const value = {
    // State
    loading: state.loading,
    error: state.error,
    invoices: state.invoices,
    currentInvoice: state.currentInvoice,
    pagination: state.pagination,
    filters: state.filters,
    invoiceStatistics: state.invoiceStatistics,
    agingReport: state.agingReport,

    // Core CRUD Operations
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,

    // Status Management
    sendInvoice,
    markInvoiceAsPaid,
    voidInvoice,

    // Analytics and Reports
    getInvoiceStatistics,
    getAgingReport,

    // Additional Features
    duplicateInvoice,

    // Utility Methods
    refreshInvoices,
    clearCurrentInvoice,
    updateFilters,
    resetFilters,

    // Common Actions
    clearError,
    setLoading,
    resetState,
    setFilters,
  };

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};

// Custom hook to use the invoice context
export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
};

// Export context for direct access if needed
export { InvoiceContext };
