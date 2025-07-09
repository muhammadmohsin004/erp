import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  suppliers: [],
  currentSupplier: null,
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
  SET_SUPPLIERS: 'SET_SUPPLIERS',
  SET_CURRENT_SUPPLIER: 'SET_CURRENT_SUPPLIER',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  ADD_SUPPLIER: 'ADD_SUPPLIER',
  UPDATE_SUPPLIER: 'UPDATE_SUPPLIER',
  DELETE_SUPPLIER: 'DELETE_SUPPLIER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const supplierReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_SUPPLIERS:
      return { 
        ...state, 
        suppliers: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_SUPPLIER:
      return { 
        ...state, 
        currentSupplier: action.payload, 
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
    
    case actionTypes.ADD_SUPPLIER:
      // Handle adding supplier to the nested structure
      const currentSuppliersAdd = state.suppliers?.Data?.$values || [];
      const updatedSuppliersAdd = [...currentSuppliersAdd, action.payload];
      return { 
        ...state, 
        suppliers: {
          ...state.suppliers,
          Data: {
            ...state.suppliers?.Data,
            $values: updatedSuppliersAdd 
          }
        },
        loading: false,
        error: null
      };
    
    case actionTypes.UPDATE_SUPPLIER:
      // Handle updating supplier in the nested structure
      const currentSuppliersUpdate = state.suppliers?.Data?.$values || [];
      const updatedSuppliersUpdate = currentSuppliersUpdate.map(supplier =>
        supplier.Id === action.payload.Id ? action.payload : supplier
      );
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          Data: {
            ...state.suppliers?.Data,
            $values: updatedSuppliersUpdate
          }
        },
        currentSupplier: state.currentSupplier?.Id === action.payload.Id 
          ? action.payload 
          : state.currentSupplier,
        loading: false,
        error: null
      };
    
    case actionTypes.DELETE_SUPPLIER:
      // Handle deleting supplier from the nested structure
      const currentSuppliersDelete = state.suppliers?.Data?.$values || [];
      const updatedSuppliersDelete = currentSuppliersDelete.filter(
        supplier => supplier.Id !== action.payload
      );
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          Data: {
            ...state.suppliers?.Data,
            $values: updatedSuppliersDelete
          }
        },
        currentSupplier: state.currentSupplier?.Id === action.payload 
          ? null 
          : state.currentSupplier,
        loading: false,
        error: null
      };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case actionTypes.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Create context
const SupplierContext = createContext();

// API base URL
const API_BASE_URL = 'https://api.speed-erp.com/api/Suppliers';

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
export const SupplierProvider = ({ children }) => {
  const [state, dispatch] = useReducer(supplierReducer, initialState);

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

  // Get suppliers with pagination and filters
  const getSuppliers = useCallback(async (params = {}) => {
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
        dispatch({ type: actionTypes.SET_SUPPLIERS, payload: response });
        
        // Handle pagination - if no Pagination object in response, calculate from data
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
          const suppliersData = response.Data?.$values || [];
          const currentPage = params.page || state.pagination.PageNumber || 1;
          const pageSize = params.pageSize || state.pagination.PageSize || 10;
          
          dispatch({ type: actionTypes.SET_PAGINATION, payload: {
            CurrentPage: currentPage,
            PageNumber: currentPage,
            PageSize: pageSize,
            TotalItems: suppliersData.length,
            TotalPages: Math.ceil(suppliersData.length / pageSize),
            HasPreviousPage: currentPage > 1,
            HasNextPage: currentPage < Math.ceil(suppliersData.length / pageSize)
          }});
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch suppliers');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, [state.pagination.PageNumber, state.pagination.PageSize, state.filters]);

  // Get single supplier
  const getSupplier = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_SUPPLIER, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch supplier');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Create supplier
  const createSupplier = useCallback(async (supplierData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(supplierData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_SUPPLIER, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create supplier');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Update supplier
  const updateSupplier = useCallback(async (id, supplierData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(supplierData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_SUPPLIER, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update supplier');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Delete supplier
  const deleteSupplier = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_SUPPLIER, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete supplier');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Search suppliers - client-side filtering since API doesn't support search parameters
  const searchSuppliers = useCallback(async (searchTerm) => {
    const updatedFilters = { ...state.filters, searchTerm };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    // Since the API doesn't support search, we'll filter client-side
    if (!searchTerm.trim()) {
      // If empty search, get fresh data
      await getSuppliers({ page: 1 });
    } else {
      // Filter current data
      const allSuppliers = state.suppliers?.Data?.$values || [];
      const filteredSuppliers = allSuppliers.filter(supplier =>
        supplier.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.ContactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.Phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.City?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.Country?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      dispatch({ type: actionTypes.SET_SUPPLIERS, payload: {
        ...state.suppliers,
        Data: {
          ...state.suppliers?.Data,
          $values: filteredSuppliers
        }
      }});
    }
  }, [state.filters, state.suppliers, getSuppliers]);

  // Filter suppliers by status - client-side filtering
  const filterSuppliersByStatus = useCallback(async (status) => {
    const updatedFilters = { ...state.filters, status };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    if (!status) {
      // If no status filter, get fresh data
      await getSuppliers({ page: 1 });
    } else {
      // Filter current data by status
      const allSuppliers = state.suppliers?.Data?.$values || [];
      const filteredSuppliers = allSuppliers.filter(supplier => supplier.Status === status);
      
      dispatch({ type: actionTypes.SET_SUPPLIERS, payload: {
        ...state.suppliers,
        Data: {
          ...state.suppliers?.Data,
          $values: filteredSuppliers
        }
      }});
    }
  }, [state.filters, state.suppliers, getSuppliers]);

  // Sort suppliers - client-side sorting
  const sortSuppliers = useCallback(async (sortBy, sortAscending = false) => {
    const updatedFilters = { ...state.filters, sortBy, sortAscending };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    // Sort current data
    const suppliersToSort = [...(state.suppliers?.Data?.$values || [])];
    suppliersToSort.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle different data types
      if (sortBy === 'CreatedAt' || sortBy === 'UpdatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
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
    
    dispatch({ type: actionTypes.SET_SUPPLIERS, payload: {
      ...state.suppliers,
      Data: {
        ...state.suppliers?.Data,
        $values: suppliersToSort
      }
    }});
  }, [state.filters, state.suppliers]);

  // Change page
  const changePage = useCallback(async (page) => {
    const updatedPagination = { ...state.pagination, CurrentPage: page, PageNumber: page };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getSuppliers({ page });
  }, [state.pagination, state.filters, getSuppliers]);

  // Change page size
  const changePageSize = useCallback(async (pageSize) => {
    const updatedPagination = { ...state.pagination, PageSize: pageSize, CurrentPage: 1, PageNumber: 1 };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getSuppliers({ pageSize, page: 1 });
  }, [state.pagination, state.filters, getSuppliers]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // State
    suppliers: state.suppliers,
    currentSupplier: state.currentSupplier,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    
    // Actions
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
    filterSuppliersByStatus,
    sortSuppliers,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState
  };

  return (
    <SupplierContext.Provider value={value}>
      {children}
    </SupplierContext.Provider>
  );
};

// Custom hook to use the supplier context
export const useSupplier = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplier must be used within a SupplierProvider');
  }
  return context;
};

// Export context for direct access if needed
export { SupplierContext };