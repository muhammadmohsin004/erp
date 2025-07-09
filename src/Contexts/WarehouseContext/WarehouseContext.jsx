import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  warehouses: [],
  currentWarehouse: null,
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
    sortBy: 'CreatedAt',
    sortAscending: false
  }
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_WAREHOUSES: 'SET_WAREHOUSES',
  SET_CURRENT_WAREHOUSE: 'SET_CURRENT_WAREHOUSE',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  ADD_WAREHOUSE: 'ADD_WAREHOUSE',
  UPDATE_WAREHOUSE: 'UPDATE_WAREHOUSE',
  DELETE_WAREHOUSE: 'DELETE_WAREHOUSE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const warehouseReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_WAREHOUSES:
      return { 
        ...state, 
        warehouses: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_WAREHOUSE:
      return { 
        ...state, 
        currentWarehouse: action.payload, 
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
    
    case actionTypes.ADD_WAREHOUSE:
      // Handle adding warehouse to the nested structure
      { const currentWarehouses = state.warehouses?.Data?.$values || [];
      const updatedWarehousesAdd = [...currentWarehouses, action.payload];
      return { 
        ...state, 
        warehouses: {
          ...state.warehouses,
          Data: { 
            ...state.warehouses?.Data,
            $values: updatedWarehousesAdd 
          }
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.UPDATE_WAREHOUSE:
      // Handle updating warehouse in the nested structure
      { const currentWarehousesUpdate = state.warehouses?.Data?.$values || [];
      const updatedWarehousesUpdate = currentWarehousesUpdate.map(warehouse =>
        warehouse.Id === action.payload.Id ? action.payload : warehouse
      );
      return {
        ...state,
        warehouses: {
          ...state.warehouses,
          Data: {
            ...state.warehouses?.Data,
            $values: updatedWarehousesUpdate
          }
        },
        currentWarehouse: state.currentWarehouse?.Id === action.payload.Id 
          ? action.payload 
          : state.currentWarehouse,
        loading: false,
        error: null
      }; }
    
    case actionTypes.DELETE_WAREHOUSE:
      // Handle deleting warehouse from the nested structure
      { const currentWarehousesDelete = state.warehouses?.Data?.$values || [];
      const updatedWarehousesDelete = currentWarehousesDelete.filter(
        warehouse => warehouse.Id !== action.payload
      );
      return {
        ...state,
        warehouses: {
          ...state.warehouses,
          Data: {
            ...state.warehouses?.Data,
            $values: updatedWarehousesDelete
          }
        },
        currentWarehouse: state.currentWarehouse?.Id === action.payload 
          ? null 
          : state.currentWarehouse,
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
const WarehouseContext = createContext();

// API base URL - Update this with your correct API URL
const API_BASE_URL = 'https://api.speed-erp.com/api/Warehouses';

// Alternative API URLs to try if the main one doesn't work
// const API_BASE_URL = 'http://localhost:5000/api/Warehouses';
// const API_BASE_URL = 'https://speed-erp-api.herokuapp.com/api/Warehouses';
// const API_BASE_URL = 'https://your-actual-domain.com/api/Warehouses';

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
export const WarehouseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

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

  // Get warehouses with pagination and filters
  const getWarehouses = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      // Only add non-empty parameters
      if (params.page || state.pagination.CurrentPage) {
        queryParams.append('page', params.page || state.pagination.CurrentPage);
      }
      if (params.pageSize || state.pagination.PageSize) {
        queryParams.append('pageSize', params.pageSize || state.pagination.PageSize);
      }
      if (params.searchTerm || state.filters.searchTerm) {
        queryParams.append('searchTerm', params.searchTerm || state.filters.searchTerm);
      }
      if (params.status || state.filters.status) {
        queryParams.append('status', params.status || state.filters.status);
      }
      if (params.sortBy || state.filters.sortBy) {
        queryParams.append('sortBy', params.sortBy || state.filters.sortBy);
      }
      if (params.sortAscending !== undefined || state.filters.sortAscending !== undefined) {
        queryParams.append('sortAscending', params.sortAscending !== undefined ? params.sortAscending : state.filters.sortAscending);
      }

      const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);
      
      if (response.Success) {
        // Store the complete response to maintain the API structure
        dispatch({ type: actionTypes.SET_WAREHOUSES, payload: response });
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_PAGINATION, payload: response.Paginations });
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch warehouses');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, [state.pagination.CurrentPage, state.pagination.PageSize, state.filters]);

  // Get single warehouse
  const getWarehouse = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_WAREHOUSE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch warehouse');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Create warehouse
  const createWarehouse = useCallback(async (warehouseData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(warehouseData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_WAREHOUSE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create warehouse');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Update warehouse
  const updateWarehouse = useCallback(async (id, warehouseData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(warehouseData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_WAREHOUSE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update warehouse');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Delete warehouse
  const deleteWarehouse = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_WAREHOUSE, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete warehouse');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Get warehouses dropdown
  const getWarehousesDropdown = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/dropdown`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch warehouses dropdown');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return [];
    }
  }, []);

  // Toggle warehouse status
  const toggleWarehouseStatus = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}/toggle-status`, {
        method: 'PUT'
      });
      
      if (response.Success) {
        // Refresh the warehouse list to get updated status
        await getWarehouses();
        return true;
      } else {
        throw new Error(response.Message || 'Failed to toggle warehouse status');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, [getWarehouses]);

  // Search warehouses
  const searchWarehouses = useCallback(async (searchTerm) => {
    const updatedFilters = { ...state.filters, searchTerm };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    await getWarehouses({ searchTerm, page: 1 });
  }, [state.filters, getWarehouses]);

  // Filter warehouses by status
  const filterWarehousesByStatus = useCallback(async (status) => {
    const updatedFilters = { ...state.filters, status };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    await getWarehouses({ status, page: 1 });
  }, [state.filters, getWarehouses]);

  // Sort warehouses
  const sortWarehouses = useCallback(async (sortBy, sortAscending = false) => {
    const updatedFilters = { ...state.filters, sortBy, sortAscending };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    await getWarehouses({ sortBy, sortAscending, page: 1 });
  }, [state.filters, getWarehouses]);

  // Change page
  const changePage = useCallback(async (page) => {
    const updatedPagination = { ...state.pagination, CurrentPage: page };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getWarehouses({ page });
  }, [state.pagination, state.filters, getWarehouses]);

  // Change page size
  const changePageSize = useCallback(async (pageSize) => {
    const updatedPagination = { ...state.pagination, PageSize: pageSize, CurrentPage: 1 };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getWarehouses({ pageSize, page: 1 });
  }, [state.pagination, state.filters, getWarehouses]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // State
    warehouses: state.warehouses,
    currentWarehouse: state.currentWarehouse,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    
    // Actions
    getWarehouses,
    getWarehouse,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWarehousesDropdown,
    toggleWarehouseStatus,
    searchWarehouses,
    filterWarehousesByStatus,
    sortWarehouses,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState
  };

  return (
    <WarehouseContext.Provider value={value}>
      {children}
    </WarehouseContext.Provider>
  );
};

// Custom hook to use the warehouse context
export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};

// Export context for direct access if needed
export { WarehouseContext };