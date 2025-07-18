import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  expenseCategories: [],
  currentExpenseCategory: null,
  categoryExpenses: [],
  categoryStatistics: null,
  recentExpenses: [],
  loading: false,
  error: null,
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 50,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  },
  filters: {
    search: '',
    isActive: null,
    sortBy: 'Name',
    sortAscending: true
  }
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_EXPENSE_CATEGORIES: 'SET_EXPENSE_CATEGORIES',
  SET_CURRENT_EXPENSE_CATEGORY: 'SET_CURRENT_EXPENSE_CATEGORY',
  SET_CATEGORY_EXPENSES: 'SET_CATEGORY_EXPENSES',
  SET_CATEGORY_STATISTICS: 'SET_CATEGORY_STATISTICS',
  SET_RECENT_EXPENSES: 'SET_RECENT_EXPENSES',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  ADD_EXPENSE_CATEGORY: 'ADD_EXPENSE_CATEGORY',
  UPDATE_EXPENSE_CATEGORY: 'UPDATE_EXPENSE_CATEGORY',
  DELETE_EXPENSE_CATEGORY: 'DELETE_EXPENSE_CATEGORY',
  TOGGLE_EXPENSE_CATEGORY_STATUS: 'TOGGLE_EXPENSE_CATEGORY_STATUS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const expenseCategoryReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_EXPENSE_CATEGORIES:
      return { 
        ...state, 
        expenseCategories: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_EXPENSE_CATEGORY:
      return { 
        ...state, 
        currentExpenseCategory: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CATEGORY_EXPENSES:
      return { 
        ...state, 
        categoryExpenses: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CATEGORY_STATISTICS:
      return { 
        ...state, 
        categoryStatistics: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_RECENT_EXPENSES:
      return { 
        ...state, 
        recentExpenses: action.payload, 
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
    
    case actionTypes.ADD_EXPENSE_CATEGORY:
      // Handle adding expense category to the nested structure
      { const currentCategories = state.expenseCategories?.Data || [];
      const updatedCategoriesAdd = [...currentCategories, action.payload];
      return { 
        ...state, 
        expenseCategories: {
          ...state.expenseCategories,
          Data: updatedCategoriesAdd
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.UPDATE_EXPENSE_CATEGORY:
      // Handle updating expense category in the nested structure
      { const currentCategoriesUpdate = state.expenseCategories?.Data || [];
      const updatedCategoriesUpdate = currentCategoriesUpdate.map(category =>
        category.Id === action.payload.Id ? action.payload : category
      );
      return {
        ...state,
        expenseCategories: {
          ...state.expenseCategories,
          Data: updatedCategoriesUpdate
        },
        currentExpenseCategory: state.currentExpenseCategory?.Id === action.payload.Id 
          ? action.payload 
          : state.currentExpenseCategory,
        loading: false,
        error: null
      }; }
    
    case actionTypes.DELETE_EXPENSE_CATEGORY:
      // Handle deleting expense category from the nested structure
      { const currentCategoriesDelete = state.expenseCategories?.Data || [];
      const updatedCategoriesDelete = currentCategoriesDelete.filter(
        category => category.Id !== action.payload
      );
      return {
        ...state,
        expenseCategories: {
          ...state.expenseCategories,
          Data: updatedCategoriesDelete
        },
        currentExpenseCategory: state.currentExpenseCategory?.Id === action.payload 
          ? null 
          : state.currentExpenseCategory,
        loading: false,
        error: null
      }; }
    
    case actionTypes.TOGGLE_EXPENSE_CATEGORY_STATUS:
      // Handle toggling expense category status
      { const currentCategoriesToggle = state.expenseCategories?.Data || [];
      const updatedCategoriesToggle = currentCategoriesToggle.map(category =>
        category.Id === action.payload.id 
          ? { ...category, IsActive: action.payload.isActive }
          : category
      );
      return {
        ...state,
        expenseCategories: {
          ...state.expenseCategories,
          Data: updatedCategoriesToggle
        },
        currentExpenseCategory: state.currentExpenseCategory?.Id === action.payload.id 
          ? { ...state.currentExpenseCategory, IsActive: action.payload.isActive }
          : state.currentExpenseCategory,
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
const ExpenseCategoryContext = createContext();

// API base URL - Update this with your correct API URL
const API_BASE_URL = 'https://api.speed-erp.com/api/ExpenseCategories';

// Alternative API URLs to try if the main one doesn't work
// const API_BASE_URL = 'http://localhost:5000/api/ExpenseCategories';
// const API_BASE_URL = 'https://speed-erp-api.herokuapp.com/api/ExpenseCategories';
// const API_BASE_URL = 'https://your-actual-domain.com/api/ExpenseCategories';

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
export const ExpenseCategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseCategoryReducer, initialState);

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

  // Get expense categories with pagination and filters
  const getExpenseCategories = useCallback(async (params = {}) => {
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
      if (params.search || state.filters.search) {
        queryParams.append('search', params.search || state.filters.search);
      }
      if (params.isActive !== undefined || state.filters.isActive !== undefined) {
        queryParams.append('isActive', params.isActive !== undefined ? params.isActive : state.filters.isActive);
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
        dispatch({ type: actionTypes.SET_EXPENSE_CATEGORIES, payload: response });
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_PAGINATION, payload: response.Paginations });
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch expense categories');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, [state.pagination.CurrentPage, state.pagination.PageSize, state.filters]);

  // Get single expense category
  const getExpenseCategory = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_EXPENSE_CATEGORY, payload: response.Data.Category });
        if (response.Data.RecentExpenses) {
          dispatch({ type: actionTypes.SET_RECENT_EXPENSES, payload: response.Data.RecentExpenses });
        }
        if (response.Data.Statistics) {
          dispatch({ type: actionTypes.SET_CATEGORY_STATISTICS, payload: response.Data.Statistics });
        }
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch expense category');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Create expense category
  const createExpenseCategory = useCallback(async (categoryData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_EXPENSE_CATEGORY, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create expense category');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Update expense category
  const updateExpenseCategory = useCallback(async (id, categoryData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_EXPENSE_CATEGORY, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update expense category');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Delete expense category
  const deleteExpenseCategory = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_EXPENSE_CATEGORY, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete expense category');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Toggle expense category status
  const toggleExpenseCategoryStatus = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}/toggle-status`, {
        method: 'POST'
      });
      
      if (response.Success) {
        // Get the current category to determine new status
        const currentCategory = state.expenseCategories?.Data?.find(cat => cat.Id === id);
        const newStatus = !currentCategory?.IsActive;
        
        dispatch({ 
          type: actionTypes.TOGGLE_EXPENSE_CATEGORY_STATUS, 
          payload: { id, isActive: newStatus } 
        });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to toggle expense category status');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, [state.expenseCategories]);

  // Get category statistics
  const getCategoryStatistics = useCallback(async (id, startDate = null, endDate = null) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}/statistics?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CATEGORY_STATISTICS, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch category statistics');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Get category expenses
  const getCategoryExpenses = useCallback(async (id, params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}/expenses?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CATEGORY_EXPENSES, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch category expenses');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Search expense categories
  const searchExpenseCategories = useCallback(async (searchTerm) => {
    const updatedFilters = { ...state.filters, search: searchTerm };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    await getExpenseCategories({ search: searchTerm, page: 1 });
  }, [state.filters, getExpenseCategories]);

  // Filter expense categories by status
  const filterExpenseCategoriesByStatus = useCallback(async (isActive) => {
    const updatedFilters = { ...state.filters, isActive };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    await getExpenseCategories({ isActive, page: 1 });
  }, [state.filters, getExpenseCategories]);

  // Sort expense categories
  const sortExpenseCategories = useCallback(async (sortBy, sortAscending = true) => {
    const updatedFilters = { ...state.filters, sortBy, sortAscending };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    await getExpenseCategories({ sortBy, sortAscending, page: 1 });
  }, [state.filters, getExpenseCategories]);

  // Change page
  const changePage = useCallback(async (page) => {
    const updatedPagination = { ...state.pagination, CurrentPage: page };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getExpenseCategories({ page });
  }, [state.pagination, state.filters, getExpenseCategories]);

  // Change page size
  const changePageSize = useCallback(async (pageSize) => {
    const updatedPagination = { ...state.pagination, PageSize: pageSize, CurrentPage: 1 };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getExpenseCategories({ pageSize, page: 1 });
  }, [state.pagination, state.filters, getExpenseCategories]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Get active expense categories (helper function)
  const getActiveExpenseCategories = useCallback(() => {
    return state.expenseCategories?.Data?.filter(category => category.IsActive) || [];
  }, [state.expenseCategories]);

  // Get expense categories dropdown (helper function)
  const getExpenseCategoriesDropdown = useCallback(() => {
    return state.expenseCategories?.Data?.filter(category => category.IsActive)
      .map(category => ({
        Id: category.Id,
        Name: category.Name,
        Color: category.Color
      })) || [];
  }, [state.expenseCategories]);

  // Get category by ID (helper function)
  const getCategoryById = useCallback((id) => {
    return state.expenseCategories?.Data?.find(category => category.Id === id) || null;
  }, [state.expenseCategories]);

  // Context value
  const value = {
    // State
    expenseCategories: state.expenseCategories,
    currentExpenseCategory: state.currentExpenseCategory,
    categoryExpenses: state.categoryExpenses,
    categoryStatistics: state.categoryStatistics,
    recentExpenses: state.recentExpenses,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    
    // Actions
    getExpenseCategories,
    getExpenseCategory,
    createExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    toggleExpenseCategoryStatus,
    getCategoryStatistics,
    getCategoryExpenses,
    searchExpenseCategories,
    filterExpenseCategoriesByStatus,
    sortExpenseCategories,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState,
    
    // Helper functions
    getActiveExpenseCategories,
    getExpenseCategoriesDropdown,
    getCategoryById
  };

  return (
    <ExpenseCategoryContext.Provider value={value}>
      {children}
    </ExpenseCategoryContext.Provider>
  );
};

// Custom hook to use the expense category context
export const useExpenseCategory = () => {
  const context = useContext(ExpenseCategoryContext);
  if (!context) {
    throw new Error('useExpenseCategory must be used within an ExpenseCategoryProvider');
  }
  return context;
};

// Export context for direct access if needed
export { ExpenseCategoryContext };