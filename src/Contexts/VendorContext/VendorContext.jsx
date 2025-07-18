import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Initial state
const initialState = {
  vendors: [],
  currentVendor: null,
  vendorExpenses: [],
  vendorStatistics: null,
  vendorPaymentSummary: null,
  vendorComparison: null,
  loading: false,
  error: null,
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false,
  },
  filters: {
    search: "",
    currency: "",
    country: "",
    isActive: null,
    startDate: null,
    endDate: null,
    sortBy: "Name",
    sortAscending: true,
  },
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_VENDORS: "SET_VENDORS",
  SET_CURRENT_VENDOR: "SET_CURRENT_VENDOR",
  SET_VENDOR_EXPENSES: "SET_VENDOR_EXPENSES",
  SET_VENDOR_STATISTICS: "SET_VENDOR_STATISTICS",
  SET_VENDOR_PAYMENT_SUMMARY: "SET_VENDOR_PAYMENT_SUMMARY",
  SET_VENDOR_COMPARISON: "SET_VENDOR_COMPARISON",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  ADD_VENDOR: "ADD_VENDOR",
  UPDATE_VENDOR: "UPDATE_VENDOR",
  DELETE_VENDOR: "DELETE_VENDOR",
  TOGGLE_VENDOR_STATUS: "TOGGLE_VENDOR_STATUS",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_STATE: "RESET_STATE",
};

// Reducer
const vendorReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.SET_VENDORS:
      return {
        ...state,
        vendors: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CURRENT_VENDOR:
      return {
        ...state,
        currentVendor: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_VENDOR_EXPENSES:
      return {
        ...state,
        vendorExpenses: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_VENDOR_STATISTICS:
      return {
        ...state,
        vendorStatistics: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_VENDOR_PAYMENT_SUMMARY:
      return {
        ...state,
        vendorPaymentSummary: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_VENDOR_COMPARISON:
      return {
        ...state,
        vendorComparison: action.payload,
        loading: false,
        error: null,
      };

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

    case actionTypes.ADD_VENDOR: { // Handle adding vendor to the list
      const currentVendors = state.vendors?.Data || [];
      const updatedVendorsAdd = [...currentVendors, action.payload];
      return {
        ...state,
        vendors: {
          ...state.vendors,
          Data: updatedVendorsAdd,
        },
        loading: false,
        error: null,
      };
    }

    case actionTypes.UPDATE_VENDOR: { // Handle updating vendor in the list
      const currentVendorsUpdate = state.vendors?.Data || [];
      const updatedVendorsUpdate = currentVendorsUpdate.map((vendor) =>
        vendor.Id === action.payload.Id ? action.payload : vendor
      );
      return {
        ...state,
        vendors: {
          ...state.vendors,
          Data: updatedVendorsUpdate,
        },
        currentVendor:
          state.currentVendor?.Id === action.payload.Id
            ? action.payload
            : state.currentVendor,
        loading: false,
        error: null,
      };
    }

    case actionTypes.DELETE_VENDOR: { // Handle deleting vendor from the list
      const currentVendorsDelete = state.vendors?.Data || [];
      const updatedVendorsDelete = currentVendorsDelete.filter(
        (vendor) => vendor.Id !== action.payload
      );
      return {
        ...state,
        vendors: {
          ...state.vendors,
          Data: updatedVendorsDelete,
        },
        currentVendor:
          state.currentVendor?.Id === action.payload
            ? null
            : state.currentVendor,
        loading: false,
        error: null,
      };
    }

    case actionTypes.TOGGLE_VENDOR_STATUS: { // Handle toggling vendor status
      const currentVendorsToggle = state.vendors?.Data || [];
      const updatedVendorsToggle = currentVendorsToggle.map((vendor) =>
        vendor.Id === action.payload
          ? { ...vendor, IsActive: !vendor.IsActive }
          : vendor
      );
      return {
        ...state,
        vendors: {
          ...state.vendors,
          Data: updatedVendorsToggle,
        },
        currentVendor:
          state.currentVendor?.Id === action.payload
            ? {
                ...state.currentVendor,
                IsActive: !state.currentVendor.IsActive,
              }
            : state.currentVendor,
        loading: false,
        error: null,
      };
    }

    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    case actionTypes.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Create context
const VendorContext = createContext();

// API base URL - Update this with your correct API URL
const API_BASE_URL = "https://api.speed-erp.com/api/Vendors";

// Alternative API URLs to try if the main one doesn't work
// const API_BASE_URL = 'http://localhost:5000/api/Vendors';
// const API_BASE_URL = 'https://speed-erp-api.herokuapp.com/api/Vendors';
// const API_BASE_URL = 'https://your-actual-domain.com/api/Vendors';

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
    console.log("Making API call to:", url); // Debug log
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.Message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("API response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("API call failed:", error); // Debug log

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

// Helper function to format date for API
const formatDateForApi = (date) => {
  if (!date) return null;
  return date instanceof Date ? date.toISOString() : date;
};

// Context Provider
export const VendorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(vendorReducer, initialState);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  // Set loading
  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
  }, []);

  // Get vendors with pagination and filters
  const getVendors = useCallback(
    async (params = {}) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();

        // Add pagination parameters
        if (params.page || state.pagination.CurrentPage) {
          queryParams.append(
            "page",
            params.page || state.pagination.CurrentPage
          );
        }
        if (params.pageSize || state.pagination.PageSize) {
          queryParams.append(
            "pageSize",
            params.pageSize || state.pagination.PageSize
          );
        }

        // Add filter parameters
        if (params.search || state.filters.search) {
          queryParams.append("search", params.search || state.filters.search);
        }
        if (params.currency || state.filters.currency) {
          queryParams.append(
            "currency",
            params.currency || state.filters.currency
          );
        }
        if (params.country || state.filters.country) {
          queryParams.append(
            "country",
            params.country || state.filters.country
          );
        }
        if (params.isActive !== undefined || state.filters.isActive !== null) {
          queryParams.append(
            "isActive",
            params.isActive !== undefined
              ? params.isActive
              : state.filters.isActive
          );
        }
        if (params.startDate || state.filters.startDate) {
          queryParams.append(
            "startDate",
            formatDateForApi(params.startDate || state.filters.startDate)
          );
        }
        if (params.endDate || state.filters.endDate) {
          queryParams.append(
            "endDate",
            formatDateForApi(params.endDate || state.filters.endDate)
          );
        }
        if (params.sortBy || state.filters.sortBy) {
          queryParams.append("sortBy", params.sortBy || state.filters.sortBy);
        }
        if (
          params.sortAscending !== undefined ||
          state.filters.sortAscending !== undefined
        ) {
          queryParams.append(
            "sortAscending",
            params.sortAscending !== undefined
              ? params.sortAscending
              : state.filters.sortAscending
          );
        }

        const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);

        if (response.Success) {
          dispatch({
            type: actionTypes.SET_VENDORS,
            payload: response.Data?.$values,
          });
          if (response.Paginations) {
            dispatch({
              type: actionTypes.SET_PAGINATION,
              payload: response.Paginations,
            });
          }
        } else {
          throw new Error(response.Message || "Failed to fetch vendors");
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      }
    },
    [state.pagination.CurrentPage, state.pagination.PageSize, state.filters]
  );

  // Get single vendor
  const getVendor = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`);

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CURRENT_VENDOR,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch vendor");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Create vendor
  const createVendor = useCallback(async (vendorData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(vendorData),
      });

      if (response.Success) {
        dispatch({ type: actionTypes.ADD_VENDOR, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to create vendor");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Update vendor
  const updateVendor = useCallback(async (id, vendorData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(vendorData),
      });

      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_VENDOR, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to update vendor");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Delete vendor
  const deleteVendor = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_VENDOR, payload: id });
        return true;
      } else {
        throw new Error(response.Message || "Failed to delete vendor");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Toggle vendor status
  const toggleVendorStatus = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(
        `${API_BASE_URL}/${id}/toggle-status`,
        {
          method: "POST",
        }
      );

      if (response.Success) {
        dispatch({ type: actionTypes.TOGGLE_VENDOR_STATUS, payload: id });
        return true;
      } else {
        throw new Error(response.Message || "Failed to toggle vendor status");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Get vendor expenses
  const getVendorExpenses = useCallback(async (id, params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.startDate)
        queryParams.append("startDate", formatDateForApi(params.startDate));
      if (params.endDate)
        queryParams.append("endDate", formatDateForApi(params.endDate));
      if (params.status) queryParams.append("status", params.status);

      const response = await makeApiCall(
        `${API_BASE_URL}/${id}/expenses?${queryParams}`
      );

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_VENDOR_EXPENSES,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch vendor expenses");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Get vendor statistics
  const getVendorStatistics = useCallback(async (id, params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();

      if (params.startDate)
        queryParams.append("startDate", formatDateForApi(params.startDate));
      if (params.endDate)
        queryParams.append("endDate", formatDateForApi(params.endDate));

      const response = await makeApiCall(
        `${API_BASE_URL}/${id}/statistics?${queryParams}`
      );

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_VENDOR_STATISTICS,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(
          response.Message || "Failed to fetch vendor statistics"
        );
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Get vendor payment summary
  const getVendorPaymentSummary = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(
        `${API_BASE_URL}/${id}/payment-summary`
      );

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_VENDOR_PAYMENT_SUMMARY,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(
          response.Message || "Failed to fetch vendor payment summary"
        );
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Get vendor comparison
  const getVendorComparison = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();

      if (params.startDate)
        queryParams.append("startDate", formatDateForApi(params.startDate));
      if (params.endDate)
        queryParams.append("endDate", formatDateForApi(params.endDate));
      if (params.topVendors)
        queryParams.append("topVendors", params.topVendors);

      const response = await makeApiCall(
        `${API_BASE_URL}/comparison?${queryParams}`
      );

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_VENDOR_COMPARISON,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(
          response.Message || "Failed to fetch vendor comparison"
        );
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Search vendors
  const searchVendors = useCallback(
    async (searchTerm) => {
      const updatedFilters = { ...state.filters, search: searchTerm };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getVendors({ search: searchTerm, page: 1 });
    },
    [state.filters, getVendors]
  );

  // Filter vendors by currency
  const filterVendorsByCurrency = useCallback(
    async (currency) => {
      const updatedFilters = { ...state.filters, currency };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getVendors({ currency, page: 1 });
    },
    [state.filters, getVendors]
  );

  // Filter vendors by country
  const filterVendorsByCountry = useCallback(
    async (country) => {
      const updatedFilters = { ...state.filters, country };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getVendors({ country, page: 1 });
    },
    [state.filters, getVendors]
  );

  // Filter vendors by active status
  const filterVendorsByStatus = useCallback(
    async (isActive) => {
      const updatedFilters = { ...state.filters, isActive };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getVendors({ isActive, page: 1 });
    },
    [state.filters, getVendors]
  );

  // Filter vendors by date range
  const filterVendorsByDateRange = useCallback(
    async (startDate, endDate) => {
      const updatedFilters = { ...state.filters, startDate, endDate };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getVendors({ startDate, endDate, page: 1 });
    },
    [state.filters, getVendors]
  );

  // Sort vendors
  const sortVendors = useCallback(
    async (sortBy, sortAscending = true) => {
      const updatedFilters = { ...state.filters, sortBy, sortAscending };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getVendors({ sortBy, sortAscending, page: 1 });
    },
    [state.filters, getVendors]
  );

  // Change page
  const changePage = useCallback(
    async (page) => {
      const updatedPagination = { ...state.pagination, CurrentPage: page };
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: updatedPagination,
      });
      await getVendors({ page });
    },
    [state.pagination, getVendors]
  );

  // Change page size
  const changePageSize = useCallback(
    async (pageSize) => {
      const updatedPagination = {
        ...state.pagination,
        PageSize: pageSize,
        CurrentPage: 1,
      };
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: updatedPagination,
      });
      await getVendors({ pageSize, page: 1 });
    },
    [state.pagination, getVendors]
  );

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // State
    vendors: state.vendors,
    currentVendor: state.currentVendor,
    vendorExpenses: state.vendorExpenses,
    vendorStatistics: state.vendorStatistics,
    vendorPaymentSummary: state.vendorPaymentSummary,
    vendorComparison: state.vendorComparison,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,

    // Actions
    getVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    toggleVendorStatus,
    getVendorExpenses,
    getVendorStatistics,
    getVendorPaymentSummary,
    getVendorComparison,
    searchVendors,
    filterVendorsByCurrency,
    filterVendorsByCountry,
    filterVendorsByStatus,
    filterVendorsByDateRange,
    sortVendors,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState,
  };

  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  );
};

// Custom hook to use the vendor context
export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendor must be used within a VendorProvider");
  }
  return context;
};

// Export context for direct access if needed
export { VendorContext };
