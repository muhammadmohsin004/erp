import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Types/Interfaces
const initialState = {
  incomes: [],
  currentIncome: null,
  categories: [],
  statistics: null,
  comparison: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 25,
    search: '',
    status: '',
    categoryId: null,
    customerId: null,
    startDate: null,
    endDate: null,
    minAmount: null,
    maxAmount: null,
    currency: '',
    paymentMethod: '',
    isRecurring: null,
    sortBy: 'IncomeDate',
    sortAscending: false
  },
  pagination: {
    currentPage: 1,
    pageNumber: 1,
    pageSize: 25,
    totalItems: 0,
    totalPages: 0
  }
};

// Action Types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_INCOMES: 'SET_INCOMES',
  SET_CURRENT_INCOME: 'SET_CURRENT_INCOME',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_STATISTICS: 'SET_STATISTICS',
  SET_COMPARISON: 'SET_COMPARISON',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_INCOME: 'ADD_INCOME',
  UPDATE_INCOME: 'UPDATE_INCOME',
  DELETE_INCOME: 'DELETE_INCOME',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const financeIncomesReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_INCOMES:
      return { 
        ...state, 
        incomes: action.payload.data || [], 
        pagination: action.payload.pagination || state.pagination,
        loading: false,
        error: null
      };
    
    case ActionTypes.SET_CURRENT_INCOME:
      return { ...state, currentIncome: action.payload, loading: false };
    
    case ActionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload, loading: false };
    
    case ActionTypes.SET_STATISTICS:
      return { ...state, statistics: action.payload, loading: false };
    
    case ActionTypes.SET_COMPARISON:
      return { ...state, comparison: action.payload, loading: false };
    
    case ActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case ActionTypes.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case ActionTypes.ADD_INCOME:
      return { 
        ...state, 
        incomes: [action.payload, ...state.incomes],
        loading: false
      };
    
    case ActionTypes.UPDATE_INCOME:
      return {
        ...state,
        incomes: state.incomes.map(income => 
          income.id === action.payload.id ? action.payload : income
        ),
        currentIncome: state.currentIncome?.id === action.payload.id ? action.payload : state.currentIncome,
        loading: false
      };
    
    case ActionTypes.DELETE_INCOME:
      return {
        ...state,
        incomes: state.incomes.filter(income => income.id !== action.payload),
        currentIncome: state.currentIncome?.id === action.payload ? null : state.currentIncome,
        loading: false
      };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Context
const FinanceIncomesContext = createContext();

// API Base URL - adjust according to your setup
const API_BASE_URL = 'https://api.speed-erp.com/api/FinanceIncomes';
const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

// Utility function for API calls
const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if needed
      'Authorization': `Bearer ${getAuthToken()}`
    },
    ...options
  };

  // Handle FormData for file uploads
  if (options.body instanceof FormData) {
    delete defaultOptions.headers['Content-Type'];
  }

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Provider Component
export const FinanceIncomesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeIncomesReducer, initialState);

  // Helper functions
  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Build query string from filters
  const buildQueryString = (filters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return params.toString();
  };

  // API Methods
  const getIncomes = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true);
      clearError();
      
      const filters = { ...state.filters, ...customFilters };
      const queryString = buildQueryString(filters);
      const url = `${API_BASE_URL}?${queryString}`;
      
      const response = await apiCall(url);
      
      if (response.success) {
        dispatch({ 
          type: ActionTypes.SET_INCOMES, 
          payload: {
            data: response.data,
            pagination: response.paginations
          }
        });
        dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
      } else {
        throw new Error(response.message || 'Failed to fetch incomes');
      }
    } catch (error) {
      setError(error.message);
    }
  }, [state.filters]);

  const getIncome = useCallback(async (id) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await apiCall(`${API_BASE_URL}/${id}`);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_CURRENT_INCOME, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch income');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const createIncome = useCallback(async (incomeData) => {
    try {
      setLoading(true);
      clearError();
      
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.entries(incomeData).forEach(([key, value]) => {
        if (key === 'attachments' && value) {
          Array.from(value).forEach(file => {
            formData.append('attachments', file);
          });
        } else if (key === 'items' && Array.isArray(value)) {
          value.forEach((item, index) => {
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              formData.append(`items[${index}].${itemKey}`, itemValue);
            });
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      const response = await apiCall(API_BASE_URL, {
        method: 'POST',
        body: formData
      });
      
      if (response.success) {
        dispatch({ type: ActionTypes.ADD_INCOME, payload: response.data });
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create income');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const updateIncome = useCallback(async (id, incomeData) => {
    try {
      setLoading(true);
      clearError();
      
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.entries(incomeData).forEach(([key, value]) => {
        if (key === 'attachments' && value) {
          Array.from(value).forEach(file => {
            formData.append('attachments', file);
          });
        } else if (key === 'items' && Array.isArray(value)) {
          value.forEach((item, index) => {
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              formData.append(`items[${index}].${itemKey}`, itemValue);
            });
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      const response = await apiCall(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (response.success) {
        dispatch({ type: ActionTypes.UPDATE_INCOME, payload: response.data });
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update income');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const deleteIncome = useCallback(async (id, hardDelete = false) => {
    try {
      setLoading(true);
      clearError();
      
      const url = `${API_BASE_URL}/${id}${hardDelete ? '?hardDelete=true' : ''}`;
      const response = await apiCall(url, { method: 'DELETE' });
      
      if (response.success) {
        dispatch({ type: ActionTypes.DELETE_INCOME, payload: id });
      } else {
        throw new Error(response.message || 'Failed to delete income');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const getIncomeStatistics = useCallback(async (startDate = null, endDate = null) => {
    try {
      setLoading(true);
      clearError();
      
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const url = `${API_BASE_URL}/statistics?${params.toString()}`;
      const response = await apiCall(url);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_STATISTICS, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const getIncomeVsExpenseComparison = useCallback(async (startDate = null, endDate = null) => {
    try {
      setLoading(true);
      clearError();
      
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const url = `${API_BASE_URL}/vs-expenses?${params.toString()}`;
      const response = await apiCall(url);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_COMPARISON, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch comparison');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const getIncomeCategories = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      const response = await apiCall(`${API_BASE_URL}/categories`);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_CATEGORIES, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Filter and pagination methods
  const setFilters = useCallback((newFilters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: initialState.filters });
  }, []);

  const setPagination = useCallback((newPagination) => {
    dispatch({ type: ActionTypes.SET_PAGINATION, payload: newPagination });
  }, []);

  const changePage = useCallback((newPage) => {
    const newFilters = { ...state.filters, page: newPage };
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
    getIncomes(newFilters);
  }, [state.filters, getIncomes]);

  const changePageSize = useCallback((newPageSize) => {
    const newFilters = { ...state.filters, pageSize: newPageSize, page: 1 };
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
    getIncomes(newFilters);
  }, [state.filters, getIncomes]);

  // Search and filter methods
  const searchIncomes = useCallback((searchTerm) => {
    const newFilters = { ...state.filters, search: searchTerm, page: 1 };
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
    getIncomes(newFilters);
  }, [state.filters, getIncomes]);

  const filterByStatus = useCallback((status) => {
    const newFilters = { ...state.filters, status, page: 1 };
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
    getIncomes(newFilters);
  }, [state.filters, getIncomes]);

  const filterByCategory = useCallback((categoryId) => {
    const newFilters = { ...state.filters, categoryId, page: 1 };
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
    getIncomes(newFilters);
  }, [state.filters, getIncomes]);

  const filterByDateRange = useCallback((startDate, endDate) => {
    const newFilters = { ...state.filters, startDate, endDate, page: 1 };
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
    getIncomes(newFilters);
  }, [state.filters, getIncomes]);

  const filterByAmountRange = useCallback((minAmount, maxAmount) => {
    const newFilters = { ...state.filters, minAmount, maxAmount, page: 1 };
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
    getIncomes(newFilters);
  }, [state.filters, getIncomes]);

  const sortIncomes = useCallback((sortBy, sortAscending = true) => {
    const newFilters = { ...state.filters, sortBy, sortAscending };
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
    getIncomes(newFilters);
  }, [state.filters, getIncomes]);

  // Utility methods
  const clearCurrentIncome = useCallback(() => {
    dispatch({ type: ActionTypes.SET_CURRENT_INCOME, payload: null });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // State
    ...state,
    
    // Core CRUD operations
    getIncomes,
    getIncome,
    createIncome,
    updateIncome,
    deleteIncome,
    
    // Analytics and reports
    getIncomeStatistics,
    getIncomeVsExpenseComparison,
    
    // Categories
    getIncomeCategories,
    
    // Filtering and pagination
    setFilters,
    resetFilters,
    setPagination,
    changePage,
    changePageSize,
    
    // Search and filter helpers
    searchIncomes,
    filterByStatus,
    filterByCategory,
    filterByDateRange,
    filterByAmountRange,
    sortIncomes,
    
    // Utility methods
    clearError,
    clearCurrentIncome,
    resetState
  };

  return (
    <FinanceIncomesContext.Provider value={value}>
      {children}
    </FinanceIncomesContext.Provider>
  );
};

// Custom hook to use the context
export const useFinanceIncomes = () => {
  const context = useContext(FinanceIncomesContext);
  if (!context) {
    throw new Error('useFinanceIncomes must be used within a FinanceIncomesProvider');
  }
  return context;
};

// Additional custom hooks for specific functionality
export const useIncomeList = () => {
  const { incomes, pagination, loading, error, getIncomes, changePage, changePageSize } = useFinanceIncomes();
  
  return {
    incomes,
    pagination,
    loading,
    error,
    getIncomes,
    changePage,
    changePageSize
  };
};

export const useIncomeDetails = (id) => {
  const { currentIncome, loading, error, getIncome, clearCurrentIncome } = useFinanceIncomes();
  
  React.useEffect(() => {
    if (id) {
      getIncome(id);
    }
    
    return () => {
      clearCurrentIncome();
    };
  }, [id, getIncome, clearCurrentIncome]);
  
  return {
    income: currentIncome,
    loading,
    error
  };
};

export const useIncomeSearch = () => {
  const { 
    filters, 
    loading, 
    searchIncomes, 
    filterByStatus, 
    filterByCategory, 
    filterByDateRange, 
    filterByAmountRange, 
    sortIncomes,
    resetFilters 
  } = useFinanceIncomes();
  
  return {
    filters,
    loading,
    searchIncomes,
    filterByStatus,
    filterByCategory,
    filterByDateRange,
    filterByAmountRange,
    sortIncomes,
    resetFilters
  };
};

export const useIncomeAnalytics = () => {
  const { 
    statistics, 
    comparison, 
    loading, 
    error, 
    getIncomeStatistics, 
    getIncomeVsExpenseComparison 
  } = useFinanceIncomes();
  
  return {
    statistics,
    comparison,
    loading,
    error,
    getIncomeStatistics,
    getIncomeVsExpenseComparison
  };
};