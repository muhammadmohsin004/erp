import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Initial state (same as your original)
const initialState = {
  services: {
    Data: {
      $values: [],
    },
    Pagination: null,
    Success: false,
    Message: null,
    ValidationErrors: {
      $values: [],
    },
  },
  currentService: null,
  loading: false,
  error: null,
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 10,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false,
  },
  filters: {
    searchTerm: "",
    status: "",
    sortBy: "Id",
    sortAscending: false,
  },
};

// Action types (same as your original)
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_SERVICES: "SET_SERVICES",
  SET_CURRENT_SERVICE: "SET_CURRENT_SERVICE",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  ADD_SERVICE: "ADD_SERVICE",
  UPDATE_SERVICE: "UPDATE_SERVICE",
  DELETE_SERVICE: "DELETE_SERVICE",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_STATE: "RESET_STATE",
};

// Reducer (same as your original)
const serviceReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.SET_SERVICES:
      return {
        ...state,
        services: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CURRENT_SERVICE:
      return {
        ...state,
        currentService: action.payload,
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

    case actionTypes.ADD_SERVICE:
      { const currentServicesAdd = Array.isArray(state.services?.Data?.$values)
        ? state.services.Data.$values
        : [];
      const updatedServicesAdd = [...currentServicesAdd, action.payload];
      return {
        ...state,
        services: {
          ...state.services,
          Data: {
            ...state.services.Data,
            $values: updatedServicesAdd,
          },
          Success: true,
        },
        loading: false,
        error: null,
      }; }

    case actionTypes.UPDATE_SERVICE:
      { const currentServicesUpdate = Array.isArray(state.services?.Data?.$values)
        ? state.services.Data.$values
        : [];
      const updatedServicesUpdate = currentServicesUpdate.map((service) =>
        service.Id === action.payload.Id ? action.payload : service
      );
      return {
        ...state,
        services: {
          ...state.services,
          Data: {
            ...state.services.Data,
            $values: updatedServicesUpdate,
          },
          Success: true,
        },
        currentService:
          state.currentService?.Id === action.payload.Id
            ? action.payload
            : state.currentService,
        loading: false,
        error: null,
      }; }

    case actionTypes.DELETE_SERVICE:
      { const currentServicesDelete = Array.isArray(state.services?.Data?.$values)
        ? state.services.Data.$values
        : [];
      const updatedServicesDelete = currentServicesDelete.filter(
        (service) => service.Id !== action.payload
      );
      return {
        ...state,
        services: {
          ...state.services,
          Data: {
            ...state.services.Data,
            $values: updatedServicesDelete,
          },
          Success: true,
        },
        currentService:
          state.currentService?.Id === action.payload
            ? null
            : state.currentService,
        loading: false,
        error: null,
      }; }

    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    case actionTypes.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Create context
const ServiceContext = createContext();

// API base URL
const API_BASE_URL = "https://api.speed-erp.com/api/Service";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Helper function to make API calls
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
export const ServiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(serviceReducer, initialState);

  // FIXED: Stable utility functions
  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []); // FIXED: No dependencies

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []); // FIXED: No dependencies

  const setFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
  }, []); // FIXED: No dependencies

  // FIXED: Stable API functions
  const getServices = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();

      if (params.page) {
        queryParams.append("page", params.page);
      }
      if (params.pageSize) {
        queryParams.append("pageSize", params.pageSize);
      }

      const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);

      if (response.Success) {
        const servicesResponse = response?.Data?.$values;

        dispatch({
          type: actionTypes.SET_SERVICES,
          payload: servicesResponse,
        });

        if (response.Pagination) {
          dispatch({
            type: actionTypes.SET_PAGINATION,
            payload: {
              CurrentPage: response.Pagination.PageNumber,
              PageNumber: response.Pagination.PageNumber,
              PageSize: response.Pagination.PageSize,
              TotalItems: response.Pagination.TotalItems,
              TotalPages: response.Pagination.TotalPages,
              HasPreviousPage: response.Pagination.PageNumber > 1,
              HasNextPage:
                response.Pagination.PageNumber <
                response.Pagination.TotalPages,
            },
          });
        } else {
          const servicesData = servicesResponse.Data.$values;
          const currentPage = params.page || 1;
          const pageSize = params.pageSize || 10;

          dispatch({
            type: actionTypes.SET_PAGINATION,
            payload: {
              CurrentPage: currentPage,
              PageNumber: currentPage,
              PageSize: pageSize,
              TotalItems: servicesData.length,
              TotalPages: Math.ceil(servicesData.length / pageSize),
              HasPreviousPage: currentPage > 1,
              HasNextPage:
                currentPage < Math.ceil(servicesData.length / pageSize),
            },
          });
        }
      } else {
        throw new Error(response.Message || "Failed to fetch services");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []); // FIXED: No dependencies

  const getService = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`);

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CURRENT_SERVICE,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch service");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []); // FIXED: No dependencies

  const createService = useCallback(async (serviceData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(serviceData),
      });

      if (response.Success) {
        dispatch({ type: actionTypes.ADD_SERVICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to create service");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []); // FIXED: No dependencies

  const updateService = useCallback(async (id, serviceData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(serviceData),
      });

      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_SERVICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to update service");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []); // FIXED: No dependencies

  const deleteService = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_SERVICE, payload: id });
        return true;
      } else {
        throw new Error(response.Message || "Failed to delete service");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []); // FIXED: No dependencies

  const searchServices = useCallback(async (searchTerm) => {
    // Update filters without depending on state
    dispatch({ 
      type: actionTypes.SET_FILTERS, 
      payload: { searchTerm } 
    });

    if (!searchTerm.trim()) {
      await getServices({ page: 1 });
    } else {
      // For search, we'll need to make an API call with search params
      // This is a simplified version - you might want to implement proper API search
      await getServices({ page: 1, search: searchTerm });
    }
  }, [getServices]); // FIXED: Only depends on stable getServices

  const filterServicesByStatus = useCallback(async (status) => {
    dispatch({ 
      type: actionTypes.SET_FILTERS, 
      payload: { status } 
    });

    if (!status) {
      await getServices({ page: 1 });
    } else {
      await getServices({ page: 1, status });
    }
  }, [getServices]); // FIXED: Only depends on stable getServices

  const changePage = useCallback(async (page) => {
    dispatch({
      type: actionTypes.SET_PAGINATION,
      payload: { CurrentPage: page, PageNumber: page },
    });
    await getServices({ page });
  }, [getServices]); // FIXED: Only depends on stable getServices

  const changePageSize = useCallback(async (pageSize) => {
    dispatch({
      type: actionTypes.SET_PAGINATION,
      payload: { PageSize: pageSize, CurrentPage: 1, PageNumber: 1 },
    });
    await getServices({ pageSize, page: 1 });
  }, [getServices]); // FIXED: Only depends on stable getServices

  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []); // FIXED: No dependencies

  // Context value with stable functions
  const value = {
    // State
    services: state.services,
    currentService: state.currentService,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,

    // Stable API methods
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    searchServices,
    filterServicesByStatus,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState,
  };

  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
};

// Custom hook to use the service context
export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useService must be used within a ServiceProvider");
  }
  return context;
};

// Export context for direct access if needed
export { ServiceContext };