import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'https://api.speed-erp.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Initial state
const initialState = {
  priceLists: [],
  currentPriceList: null,
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
  },
  statistics: {
    totalPriceLists: 0,
    activePriceLists: 0,
    inactivePriceLists: 0,
    totalItems: 0
  }
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_PRICE_LISTS: 'SET_PRICE_LISTS',
  SET_CURRENT_PRICE_LIST: 'SET_CURRENT_PRICE_LIST',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  SET_STATISTICS: 'SET_STATISTICS',
  ADD_PRICE_LIST: 'ADD_PRICE_LIST',
  UPDATE_PRICE_LIST: 'UPDATE_PRICE_LIST',
  DELETE_PRICE_LIST: 'DELETE_PRICE_LIST'
};

// Reducer
const priceListReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case actionTypes.SET_PRICE_LISTS:
      return { 
        ...state, 
        priceLists: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_PRICE_LIST:
      return { 
        ...state, 
        currentPriceList: action.payload, 
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
    
    case actionTypes.ADD_PRICE_LIST:
      return { 
        ...state, 
        priceLists: [action.payload, ...state.priceLists],
        loading: false,
        error: null
      };
    
    case actionTypes.UPDATE_PRICE_LIST:
      return {
        ...state,
        priceLists: state.priceLists.map(priceList =>
          priceList.Id === action.payload.Id ? action.payload : priceList
        ),
        currentPriceList: state.currentPriceList?.Id === action.payload.Id 
          ? action.payload 
          : state.currentPriceList,
        loading: false,
        error: null
      };
    
    case actionTypes.DELETE_PRICE_LIST:
      return {
        ...state,
        priceLists: state.priceLists.filter(priceList => priceList.Id !== action.payload),
        currentPriceList: state.currentPriceList?.Id === action.payload 
          ? null 
          : state.currentPriceList,
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const PriceListContext = createContext();

// Context Provider
export const PriceListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(priceListReducer, initialState);

  const handleError = useCallback((error) => {
  let errorMessage = 'An error occurred';
  
  if (error.response?.data?.Message) {
    errorMessage = error.response.data.Message;
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.response?.data?.errors) {
    // Handle validation errors from .NET Core
    const validationErrors = error.response.data.errors;
    const errorMessages = [];
    
    for (const [field, messages] of Object.entries(validationErrors)) {
      if (Array.isArray(messages)) {
        errorMessages.push(`${field}: ${messages.join(', ')}`);
      }
    }
    
    if (errorMessages.length > 0) {
      errorMessage = errorMessages.join('\n');
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
  console.error('API Error:', error);
  console.error('Processed error message:', errorMessage);
}, []);

  // Get price lists
  const getPriceLists = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortAscending !== undefined) queryParams.append('sortAscending', params.sortAscending);

      const response = await apiClient.get(`/PriceList?${queryParams}`);
      
      if (response.data.Success) {
        // Extract data from nested response
        const priceListsData = response.data.Data?.$values || response.data.Data || [];
        
        dispatch({ type: actionTypes.SET_PRICE_LISTS, payload: priceListsData });
        
        // Update pagination if provided
        if (response.data.TotalItems !== undefined) {
          const currentPage = params.page || 1;
          const pageSize = params.pageSize || 10;
          const totalItems = response.data.TotalItems;
          const totalPages = Math.ceil(totalItems / pageSize);
          
          dispatch({ 
            type: actionTypes.SET_PAGINATION, 
            payload: {
              CurrentPage: currentPage,
              PageNumber: currentPage,
              PageSize: pageSize,
              TotalItems: totalItems,
              TotalPages: totalPages,
              HasPreviousPage: currentPage > 1,
              HasNextPage: currentPage < totalPages
            }
          });
        }
        
        return response.data;
      } else {
        throw new Error(response.data.Message || 'Failed to fetch price lists');
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  // Get single price list
  const getPriceList = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await apiClient.get(`/PriceList/${id}`);
      
      if (response.data.Success) {
        const priceListData = response.data.Data;
        dispatch({ type: actionTypes.SET_CURRENT_PRICE_LIST, payload: priceListData });
        return response.data;
      } else {
        throw new Error(response.data.Message || 'Failed to fetch price list');
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

 // Add these debug methods to your PriceListContext

// Create price list - with debug logging
const createPriceList = useCallback(async (priceListData) => {
  try {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    
    console.log('Creating price list with data:', JSON.stringify(priceListData, null, 2));
    
    const response = await apiClient.post('/PriceList', priceListData);
    
    console.log('API Response:', response.data);
    
    if (response.data.Success) {
      const newPriceList = response.data.Data;
      dispatch({ type: actionTypes.ADD_PRICE_LIST, payload: newPriceList });
      return response.data;
    } else {
      throw new Error(response.data.Message || 'Failed to create price list');
    }
  } catch (error) {
    console.error('Create price list error:', error);
    console.error('Error response:', error.response?.data);
    handleError(error);
    throw error;
  }
}, [handleError]);

// Update price list - with debug logging
const updatePriceList = useCallback(async (id, priceListData) => {
  try {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    
    console.log(`Updating price list ${id} with data:`, JSON.stringify(priceListData, null, 2));
    
    const response = await apiClient.put(`/PriceList/${id}`, priceListData);
    
    console.log('API Response:', response.data);
    
    if (response.data.Success) {
      const updatedPriceList = response.data.Data;
      dispatch({ type: actionTypes.UPDATE_PRICE_LIST, payload: updatedPriceList });
      return response.data;
    } else {
      throw new Error(response.data.Message || 'Failed to update price list');
    }
  } catch (error) {
    console.error('Update price list error:', error);
    console.error('Error response:', error.response?.data);
    handleError(error);
    throw error;
  }
}, [handleError]);

// Enhanced error handler


  // Delete price list
  const deletePriceList = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await apiClient.delete(`/PriceList/${id}`);
      
      if (response.data.Success) {
        dispatch({ type: actionTypes.DELETE_PRICE_LIST, payload: id });
        return response.data;
      } else {
        throw new Error(response.data.Message || 'Failed to delete price list');
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  // Copy price list
  const copyPriceList = useCallback(async (id, copyData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await apiClient.post(`/PriceList/${id}/copy`, copyData);
      
      if (response.data.Success) {
        const copiedPriceList = response.data.Data;
        dispatch({ type: actionTypes.ADD_PRICE_LIST, payload: copiedPriceList });
        return response.data;
      } else {
        throw new Error(response.data.Message || 'Failed to copy price list');
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  // Get statistics
  const getStatistics = useCallback(async () => {
    try {
      const response = await apiClient.get('/PriceList/statistics');
      
      if (response.data.Success) {
        dispatch({ type: actionTypes.SET_STATISTICS, payload: response.data.Data });
        return response.data;
      } else {
        // Calculate from current price lists if API fails
        const stats = {
          totalPriceLists: state.priceLists.length,
          activePriceLists: state.priceLists.filter(p => p.Status === 'Active').length,
          inactivePriceLists: state.priceLists.filter(p => p.Status === 'Inactive').length,
          totalItems: state.priceLists.reduce((sum, p) => {
            const items = p.Items?.$values || p.Items || [];
            return sum + items.length;
          }, 0)
        };
        dispatch({ type: actionTypes.SET_STATISTICS, payload: stats });
        return { data: stats };
      }
    } catch (error) {
      // Calculate from current price lists if API fails
      const stats = {
        totalPriceLists: state.priceLists.length,
        activePriceLists: state.priceLists.filter(p => p.Status === 'Active').length,
        inactivePriceLists: state.priceLists.filter(p => p.Status === 'Inactive').length,
        totalItems: state.priceLists.reduce((sum, p) => {
          const items = p.Items?.$values || p.Items || [];
          return sum + items.length;
        }, 0)
      };
      dispatch({ type: actionTypes.SET_STATISTICS, payload: stats });
      return { data: stats };
    }
  }, [state.priceLists]);

  // Search price lists
  const searchPriceLists = useCallback(async (searchTerm) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: { searchTerm } });
    return await getPriceLists({ searchTerm, page: 1 });
  }, [getPriceLists]);

  // Filter by status
  const filterPriceListsByStatus = useCallback(async (status) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: { status } });
    return await getPriceLists({ status, page: 1 });
  }, [getPriceLists]);

  // Sort price lists
  const sortPriceLists = useCallback(async (sortBy, sortAscending = false) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: { sortBy, sortAscending } });
    return await getPriceLists({ sortBy, sortAscending, page: 1 });
  }, [getPriceLists]);

  // Change page
  const changePage = useCallback(async (page) => {
    dispatch({ type: actionTypes.SET_PAGINATION, payload: { CurrentPage: page, PageNumber: page } });
    return await getPriceLists({ page });
  }, [getPriceLists]);

  // Simple utility functions
  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
  }, []);

  // Context value
  const value = {
    // State
    priceLists: state.priceLists,
    currentPriceList: state.currentPriceList,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    statistics: state.statistics,
    
    // Actions
    getPriceLists,
    getPriceList,
    createPriceList,
    updatePriceList,
    deletePriceList,
    copyPriceList,
    getStatistics,
    searchPriceLists,
    filterPriceListsByStatus,
    sortPriceLists,
    changePage,
    setFilters,
    clearError,
    setLoading
  };

  return (
    <PriceListContext.Provider value={value}>
      {children}
    </PriceListContext.Provider>
  );
};

// Custom hook
export const usePriceList = () => {
  const context = useContext(PriceListContext);
  if (!context) {
    throw new Error('usePriceList must be used within a PriceListProvider');
  }
  return context;
};

// Export context
export { PriceListContext };