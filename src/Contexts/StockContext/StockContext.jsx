import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  stockTransactions: [],
  stockMovements: [],
  stockSummary: null,
  currentTransaction: null,
  loading: false,
  error: null,
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  },
  filters: {
    dateFrom: '',
    dateTo: '',
    transactionType: '',
    warehouseId: null,
    productId: null,
    searchTerm: ''
  },
  statistics: {
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    totalStockValue: 0,
    totalStockQuantity: 0
  }
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_STOCK_TRANSACTIONS: 'SET_STOCK_TRANSACTIONS',
  SET_STOCK_MOVEMENTS: 'SET_STOCK_MOVEMENTS',
  SET_STOCK_SUMMARY: 'SET_STOCK_SUMMARY',
  SET_CURRENT_TRANSACTION: 'SET_CURRENT_TRANSACTION',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  SET_STATISTICS: 'SET_STATISTICS',
  ADD_STOCK_TRANSACTION: 'ADD_STOCK_TRANSACTION',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const stockReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_STOCK_TRANSACTIONS:
      return { 
        ...state, 
        stockTransactions: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_STOCK_MOVEMENTS:
      return { 
        ...state, 
        stockMovements: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_STOCK_SUMMARY:
      return { 
        ...state, 
        stockSummary: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_TRANSACTION:
      return { 
        ...state, 
        currentTransaction: action.payload, 
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
    
    case actionTypes.SET_STATISTICS:
      return { 
        ...state, 
        statistics: { ...state.statistics, ...action.payload } 
      };
    
    case actionTypes.ADD_STOCK_TRANSACTION:
      // Handle adding transaction to the nested structure
      { const currentTransactions = state.stockTransactions?.Data?.$values || [];
      const updatedTransactions = [action.payload, ...currentTransactions];
      return { 
        ...state, 
        stockTransactions: {
          ...state.stockTransactions,
          Data: {
            ...state.stockTransactions?.Data,
            $values: updatedTransactions
          }
        },
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
const StockContext = createContext();

// API base URL
const API_BASE_URL = 'https://api.speed-erp.com/api/Stock';

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

// Helper function to format date for API
const formatDateForApi = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

// Context Provider
export const StockProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stockReducer, initialState);

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

  // Get stock transactions for a specific product
  const getProductStockTransactions = useCallback(async (productId, params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', params.page || state.pagination.PageNumber || 1);
      queryParams.append('pageSize', params.pageSize || state.pagination.PageSize || 25);
      
      // Add filter parameters
      if (params.dateFrom || state.filters.dateFrom) {
        queryParams.append('dateFrom', formatDateForApi(params.dateFrom || state.filters.dateFrom));
      }
      if (params.dateTo || state.filters.dateTo) {
        queryParams.append('dateTo', formatDateForApi(params.dateTo || state.filters.dateTo));
      }
      if (params.transactionType || state.filters.transactionType) {
        queryParams.append('transactionType', params.transactionType || state.filters.transactionType);
      }
      if (params.warehouseId || state.filters.warehouseId) {
        queryParams.append('warehouseId', params.warehouseId || state.filters.warehouseId);
      }

      const response = await makeApiCall(`${API_BASE_URL}/product/${productId}/transactions?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_STOCK_TRANSACTIONS, payload: response });
        
        // Handle pagination from response
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_PAGINATION, payload: {
            CurrentPage: response.Paginations.PageNumber,
            PageNumber: response.Paginations.PageNumber,
            PageSize: response.Paginations.PageSize,
            TotalItems: response.Paginations.TotalItems,
            TotalPages: response.Paginations.TotalPages,
            HasPreviousPage: response.Paginations.PageNumber > 1,
            HasNextPage: response.Paginations.PageNumber < response.Paginations.TotalPages
          }});
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch stock transactions');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, [state.pagination.PageNumber, state.pagination.PageSize, state.filters]);

  // Get stock movements (all transactions)
  const getStockMovements = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', params.page || state.pagination.PageNumber || 1);
      queryParams.append('pageSize', params.pageSize || state.pagination.PageSize || 25);
      
      // Add filter parameters
      if (params.dateFrom || state.filters.dateFrom) {
        queryParams.append('dateFrom', formatDateForApi(params.dateFrom || state.filters.dateFrom));
      }
      if (params.dateTo || state.filters.dateTo) {
        queryParams.append('dateTo', formatDateForApi(params.dateTo || state.filters.dateTo));
      }
      if (params.transactionType || state.filters.transactionType) {
        queryParams.append('transactionType', params.transactionType || state.filters.transactionType);
      }
      if (params.warehouseId || state.filters.warehouseId) {
        queryParams.append('warehouseId', params.warehouseId || state.filters.warehouseId);
      }

      const response = await makeApiCall(`${API_BASE_URL}/movements?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_STOCK_MOVEMENTS, payload: response });
        
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
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch stock movements');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, [state.pagination.PageNumber, state.pagination.PageSize, state.filters]);

  // Get stock summary
  const getStockSummary = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/summary`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_STOCK_SUMMARY, payload: response.Data });
        
        // Also update statistics
        dispatch({ type: actionTypes.SET_STATISTICS, payload: {
          totalProducts: response.Data.TotalProducts || 0,
          inStockProducts: response.Data.InStockProducts || 0,
          outOfStockProducts: response.Data.OutOfStockProducts || 0,
          lowStockProducts: response.Data.LowStockProducts || 0,
          totalStockValue: response.Data.TotalStockValue || 0,
          totalStockQuantity: response.Data.TotalStockQuantity || 0
        }});
      } else {
        throw new Error(response.Message || 'Failed to fetch stock summary');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  // Add stock transaction
  const addStockTransaction = useCallback(async (productId, transactionData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/product/${productId}/transactions`, {
        method: 'POST',
        body: JSON.stringify(transactionData)
      });
      
      if (response.Success) {
        // Refresh the transactions list
        await getProductStockTransactions(productId);
        return true;
      } else {
        throw new Error(response.Message || 'Failed to add stock transaction');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, [getProductStockTransactions]);

  // Adjust stock
  const adjustStock = useCallback(async (productId, adjustmentData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/product/${productId}/adjust`, {
        method: 'POST',
        body: JSON.stringify(adjustmentData)
      });
      
      if (response.Success) {
        // Refresh the transactions list
        await getProductStockTransactions(productId);
        return true;
      } else {
        throw new Error(response.Message || 'Failed to adjust stock');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, [getProductStockTransactions]);

  // Transfer stock
  const transferStock = useCallback(async (productId, transferData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/product/${productId}/transfer`, {
        method: 'POST',
        body: JSON.stringify(transferData)
      });
      
      if (response.Success) {
        // Refresh the transactions list
        await getProductStockTransactions(productId);
        return true;
      } else {
        throw new Error(response.Message || 'Failed to transfer stock');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, [getProductStockTransactions]);

  // Filter stock movements
  const filterStockMovements = useCallback(async (filters) => {
    const updatedFilters = { ...state.filters, ...filters };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    await getStockMovements({ 
      ...filters,
      page: 1
    });
  }, [state.filters, getStockMovements]);

  // Change page
  const changePage = useCallback(async (page) => {
    const updatedPagination = { ...state.pagination, CurrentPage: page, PageNumber: page };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    
    if (state.filters.productId) {
      await getProductStockTransactions(state.filters.productId, { page });
    } else {
      await getStockMovements({ page });
    }
  }, [state.pagination, state.filters, getProductStockTransactions, getStockMovements]);

  // Change page size
  const changePageSize = useCallback(async (pageSize) => {
    const updatedPagination = { 
      ...state.pagination, 
      PageSize: pageSize, 
      CurrentPage: 1, 
      PageNumber: 1 
    };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    
    if (state.filters.productId) {
      await getProductStockTransactions(state.filters.productId, { pageSize, page: 1 });
    } else {
      await getStockMovements({ pageSize, page: 1 });
    }
  }, [state.filters, getProductStockTransactions, getStockMovements]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Clear filters and reset
  const clearFilters = useCallback(async () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      transactionType: '',
      warehouseId: null,
      productId: null,
      searchTerm: ''
    };
    
    dispatch({ type: actionTypes.SET_FILTERS, payload: resetFilters });
    
    await getStockMovements({ 
      page: 1,
      dateFrom: '',
      dateTo: '',
      transactionType: '',
      warehouseId: null
    });
  }, [getStockMovements]);

  // Search movements (client-side filtering since API doesn't support search)
  const searchMovements = useCallback(async (searchTerm) => {
    const updatedFilters = { ...state.filters, searchTerm };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    // For now, just filter the current data client-side
    // In a real app, you might want to implement server-side search
    if (!searchTerm.trim()) {
      await getStockMovements({ page: 1 });
    } else {
      // Filter current movements
      const allMovements = state.stockMovements?.Data || [];
      const filteredMovements = allMovements.filter(movement =>
        movement.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.WarehouseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.MovementType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.Reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.Notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      dispatch({ type: actionTypes.SET_STOCK_MOVEMENTS, payload: {
        ...state.stockMovements,
        Data: filteredMovements
      }});
    }
  }, [state.filters, state.stockMovements, getStockMovements]);

  // Context value
  const value = {
    // State
    stockTransactions: state.stockTransactions,
    stockMovements: state.stockMovements,
    stockSummary: state.stockSummary,
    currentTransaction: state.currentTransaction,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    statistics: state.statistics,
    
    // Actions
    getProductStockTransactions,
    getStockMovements,
    getStockSummary,
    addStockTransaction,
    adjustStock,
    transferStock,
    filterStockMovements,
    searchMovements,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState,
    clearFilters
  };

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
};

// Custom hook to use the stock context
export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};

// Export context for direct access if needed
export { StockContext };