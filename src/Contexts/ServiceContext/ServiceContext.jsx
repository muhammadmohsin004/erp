import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  services: [],
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
    HasNextPage: false
  },
  filters: {
    searchTerm: '',
    status: '',
    sortBy: 'Id',
    sortAscending: false
  }
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SERVICES: 'SET_SERVICES',
  SET_CURRENT_SERVICE: 'SET_CURRENT_SERVICE',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  ADD_SERVICE: 'ADD_SERVICE',
  UPDATE_SERVICE: 'UPDATE_SERVICE',
  DELETE_SERVICE: 'DELETE_SERVICE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
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
        error: null 
      };
    
    case actionTypes.SET_CURRENT_SERVICE:
      return { 
        ...state, 
        currentService: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_PAGINATION:
      return { 
        ...state, 
        pagination: { ...state.pagination, ...action.payload } 
      };
    
    case actionTypes.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    
    case actionTypes.ADD_SERVICE:
      // Handle adding service to the nested structure
      { const currentServicesAdd = state.services?.Data || [];
      const updatedServicesAdd = [...currentServicesAdd, action.payload];
      return { 
        ...state, 
        services: {
          ...state.services,
          Data: updatedServicesAdd 
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.UPDATE_SERVICE:
      // Handle updating service in the nested structure
      { const currentServicesUpdate = state.services?.Data || [];
      const updatedServicesUpdate = currentServicesUpdate.map(service =>
        service.Id === action.payload.Id ? action.payload : service
      );
      return {
        ...state,
        services: {
          ...state.services,
          Data: updatedServicesUpdate
        },
        currentService: state.currentService?.Id === action.payload.Id 
          ? action.payload 
          : state.currentService,
        loading: false,
        error: null
      }; }
    
    case actionTypes.DELETE_SERVICE:
      // Handle deleting service from the nested structure
      { const currentServicesDelete = state.services?.Data || [];
      const updatedServicesDelete = currentServicesDelete.filter(
        service => service.Id !== action.payload
      );
      return {
        ...state,
        services: {
          ...state.services,
          Data: updatedServicesDelete
        },
        currentService: state.currentService?.Id === action.payload 
          ? null 
          : state.currentService,
        loading: false,
        error: null
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
const API_BASE_URL = 'https://api.speed-erp.com/api/Service';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to make API calls with better error handling
const makeApiCall = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    console.log('Making API call to:', url); // Debug log
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('API call failed:', error); // Debug log
    
    // Handle specific network errors
    if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      throw new Error('Cannot connect to API server. Please check your internet connection or contact administrator.');
    }
    if (error.message.includes('ERR_NETWORK')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    if (error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('Connection refused. The API server might be down.');
    }
    
    throw error;
  }
};

// Context Provider
export const ServiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(serviceReducer, initialState);

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

  // Get services with pagination and filters
  const getServices = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      // Only add non-empty parameters
      if (params.page || state.pagination.PageNumber) {
        queryParams.append('page', params.page || state.pagination.PageNumber);
      }
      if (params.pageSize || state.pagination.PageSize) {
        queryParams.append('pageSize', params.pageSize || state.pagination.PageSize);
      }

      const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);
      
      if (response.Success) {
        // Store the complete response to maintain the API structure
        dispatch({ type: actionTypes.SET_SERVICES, payload: response });
        
        // Handle pagination from response
        if (response.Pagination) {
          dispatch({ type: actionTypes.SET_PAGINATION, payload: {
            CurrentPage: response.Pagination.PageNumber,
            PageNumber: response.Pagination.PageNumber,
            PageSize: response.Pagination.PageSize,
            TotalItems: response.Pagination.TotalItems,
            TotalPages: response.Pagination.TotalPages,
            HasPreviousPage: response.Pagination.PageNumber > 1,
            HasNextPage: response.Pagination.PageNumber < response.Pagination.TotalPages
          }});
        } else {
          // Calculate pagination from data if no pagination info from API
          const servicesData = response.Data || [];
          const currentPage = params.page || state.pagination.PageNumber || 1;
          const pageSize = params.pageSize || state.pagination.PageSize || 10;
          
          dispatch({ type: actionTypes.SET_PAGINATION, payload: {
            CurrentPage: currentPage,
            PageNumber: currentPage,
            PageSize: pageSize,
            TotalItems: servicesData.length,
            TotalPages: Math.ceil(servicesData.length / pageSize),
            HasPreviousPage: currentPage > 1,
            HasNextPage: currentPage < Math.ceil(servicesData.length / pageSize)
          }});
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch services');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, [state.pagination.PageNumber, state.pagination.PageSize, state.filters]);

  // Get single service
  const getService = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_SERVICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch service');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Create service
  const createService = useCallback(async (serviceData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(serviceData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_SERVICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create service');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Update service
  const updateService = useCallback(async (id, serviceData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(serviceData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_SERVICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update service');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Delete service
  const deleteService = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_SERVICE, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete service');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Search services - client-side filtering since API doesn't support search parameters
  const searchServices = useCallback(async (searchTerm) => {
    const updatedFilters = { ...state.filters, searchTerm };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    // Since the API doesn't support search, we'll filter client-side
    if (!searchTerm.trim()) {
      // If empty search, get fresh data
      await getServices({ page: 1 });
    } else {
      // Filter current data
      const allServices = state.services?.Data || [];
      const filteredServices = allServices.filter(service =>
        service.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.ServiceCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.DiscountType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      dispatch({ type: actionTypes.SET_SERVICES, payload: {
        ...state.services,
        Data: filteredServices
      }});
    }
  }, [state.filters, state.services, getServices]);

  // Filter services by status - client-side filtering
  const filterServicesByStatus = useCallback(async (status) => {
    const updatedFilters = { ...state.filters, status };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    if (!status) {
      // If no status filter, get fresh data
      await getServices({ page: 1 });
    } else {
      // Filter current data by status
      const allServices = state.services?.Data || [];
      const filteredServices = allServices.filter(service => service.Status === status);
      
      dispatch({ type: actionTypes.SET_SERVICES, payload: {
        ...state.services,
        Data: filteredServices
      }});
    }
  }, [state.filters, state.services, getServices]);

  // Sort services - client-side sorting
  const sortServices = useCallback(async (sortBy, sortAscending = false) => {
    const updatedFilters = { ...state.filters, sortBy, sortAscending };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    // Sort current data
    const servicesToSort = [...(state.services?.Data || [])];
    servicesToSort.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle different data types
      if (sortBy === 'CreatedAt' || sortBy === 'UpdatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'PurchasePrice' || sortBy === 'UnitPrice' || sortBy === 'MinimumPrice' || sortBy === 'Discount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }
      
      if (sortAscending) {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    dispatch({ type: actionTypes.SET_SERVICES, payload: {
      ...state.services,
      Data: servicesToSort
    }});
  }, [state.filters, state.services]);

  // Change page
  const changePage = useCallback(async (page) => {
    const updatedPagination = { ...state.pagination, CurrentPage: page, PageNumber: page };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getServices({ page });
  }, [state.pagination, state.filters, getServices]);

  // Change page size
  const changePageSize = useCallback(async (pageSize) => {
    const updatedPagination = { ...state.pagination, PageSize: pageSize, CurrentPage: 1, PageNumber: 1 };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getServices({ pageSize, page: 1 });
  }, [state.pagination, state.filters, getServices]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // State
    services: state.services,
    currentService: state.currentService,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    
    // Actions
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    searchServices,
    filterServicesByStatus,
    sortServices,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

// Custom hook to use the service context
export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};

// Export context for direct access if needed
export { ServiceContext };