import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  branches: [],
  currentBranch: null,
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
    searchTerm: '',
    sortBy: 'BranchName',
    sortAscending: true
  },
  statistics: {
    totalBranches: 0,
    activeBranches: 0,
    headOfficeBranches: 0,
    branchesThisMonth: 0
  }
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BRANCHES: 'SET_BRANCHES',
  SET_CURRENT_BRANCH: 'SET_CURRENT_BRANCH',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  SET_STATISTICS: 'SET_STATISTICS',
  ADD_BRANCH: 'ADD_BRANCH',
  UPDATE_BRANCH: 'UPDATE_BRANCH',
  DELETE_BRANCH: 'DELETE_BRANCH',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const branchReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_BRANCHES:
      return { 
        ...state, 
        branches: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_BRANCH:
      return { 
        ...state, 
        currentBranch: action.payload, 
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
    
    case actionTypes.ADD_BRANCH:
      // Handle adding branch to the nested structure
      { const currentBranchesAdd = state.branches?.Data?.$values || [];
      const updatedBranchesAdd = [...currentBranchesAdd, action.payload];
      return { 
        ...state, 
        branches: {
          ...state.branches,
          Data: {
            ...state.branches?.Data,
            $values: updatedBranchesAdd
          }
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.UPDATE_BRANCH:
      // Handle updating branch in the nested structure
      { const currentBranchesUpdate = state.branches?.Data?.$values || [];
      const updatedBranchesUpdate = currentBranchesUpdate.map(branch =>
        branch.Id === action.payload.Id ? action.payload : branch
      );
      return {
        ...state,
        branches: {
          ...state.branches,
          Data: {
            ...state.branches?.Data,
            $values: updatedBranchesUpdate
          }
        },
        currentBranch: state.currentBranch?.Id === action.payload.Id 
          ? action.payload 
          : state.currentBranch,
        loading: false,
        error: null
      }; }
    
    case actionTypes.DELETE_BRANCH:
      // Handle deleting branch from the nested structure
      { const currentBranchesDelete = state.branches?.Data?.$values || [];
      const updatedBranchesDelete = currentBranchesDelete.filter(
        branch => branch.Id !== action.payload
      );
      return {
        ...state,
        branches: {
          ...state.branches,
          Data: {
            ...state.branches?.Data,
            $values: updatedBranchesDelete
          }
        },
        currentBranch: state.currentBranch?.Id === action.payload 
          ? null 
          : state.currentBranch,
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
const CompanyBranchContext = createContext();

// API base URL
const API_BASE_URL = 'https://api.speed-erp.com/api/CompanyBranches';

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

// Helper function to calculate statistics
const calculateStatistics = (branchesData) => {
  if (!Array.isArray(branchesData)) return {};
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return {
    totalBranches: branchesData.length,
    activeBranches: branchesData.filter(branch => branch.IsActive === true).length,
    headOfficeBranches: branchesData.filter(branch => branch.IsHeadOffice === true).length,
    branchesThisMonth: branchesData.filter(branch => {
      const createdDate = new Date(branch.CreatedAt);
      return createdDate.getMonth() === currentMonth && 
             createdDate.getFullYear() === currentYear;
    }).length
  };
};

// Context Provider
export const CompanyBranchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(branchReducer, initialState);

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

  // Get branches with pagination and filters
  const getBranches = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', params.page || state.pagination.PageNumber || 1);
      queryParams.append('pageSize', params.pageSize || state.pagination.PageSize || 25);
      
      // Add search parameter
      if (params.search || state.filters.searchTerm) {
        queryParams.append('search', params.search || state.filters.searchTerm);
      }
      
      // Add sorting parameters
      queryParams.append('sortBy', params.sortBy || state.filters.sortBy || 'BranchName');
      queryParams.append('sortAscending', params.sortAscending ?? state.filters.sortAscending ?? true);

      const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);
      
      if (response.Success) {
        // Store the complete response to maintain the API structure
        dispatch({ type: actionTypes.SET_BRANCHES, payload: response });
        
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
        
        // Calculate and set statistics
        const branchesData = response.Data?.$values || [];
        const statistics = calculateStatistics(branchesData);
        dispatch({ type: actionTypes.SET_STATISTICS, payload: statistics });
        
      } else {
        throw new Error(response.Message || 'Failed to fetch branches');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, [state.pagination.PageNumber, state.pagination.PageSize, state.filters]);

  // Get single branch
  const getBranch = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_BRANCH, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch branch');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Get company balance
  const getCompanyBalance = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/GetCompanyBalance`);
      
      if (response.Success) {
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch company balance');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  }, []);

  // Create branch
  const createBranch = useCallback(async (branchData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(branchData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_BRANCH, payload: response.Data });
        
        // Update statistics
        const currentBranches = state.branches?.Data?.$values || [];
        const updatedBranches = [...currentBranches, response.Data];
        const statistics = calculateStatistics(updatedBranches);
        dispatch({ type: actionTypes.SET_STATISTICS, payload: statistics });
        
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create branch');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, [state.branches]);

  // Update branch
  const updateBranch = useCallback(async (id, branchData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(branchData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_BRANCH, payload: response.Data });
        
        // Update statistics
        const currentBranches = state.branches?.Data?.$values || [];
        const updatedBranches = currentBranches.map(branch =>
          branch.Id === id ? response.Data : branch
        );
        const statistics = calculateStatistics(updatedBranches);
        dispatch({ type: actionTypes.SET_STATISTICS, payload: statistics });
        
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update branch');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, [state.branches]);

  // Delete branch
  const deleteBranch = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_BRANCH, payload: id });
        
        // Update statistics
        const currentBranches = state.branches?.Data?.$values || [];
        const updatedBranches = currentBranches.filter(branch => branch.Id !== id);
        const statistics = calculateStatistics(updatedBranches);
        dispatch({ type: actionTypes.SET_STATISTICS, payload: statistics });
        
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete branch');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, [state.branches]);

  // Search branches
  const searchBranches = useCallback(async (searchTerm) => {
    const updatedFilters = { ...state.filters, searchTerm };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    // Use server-side search since the API supports it
    await getBranches({ 
      search: searchTerm, 
      page: 1,
      sortBy: state.filters.sortBy,
      sortAscending: state.filters.sortAscending
    });
  }, [state.filters, getBranches]);

  // Sort branches
  const sortBranches = useCallback(async (sortBy, sortAscending = true) => {
    const updatedFilters = { ...state.filters, sortBy, sortAscending };
    dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
    
    // Use server-side sorting since the API supports it
    await getBranches({ 
      search: state.filters.searchTerm,
      sortBy, 
      sortAscending,
      page: state.pagination.PageNumber
    });
  }, [state.filters, state.pagination.PageNumber, getBranches]);

  // Change page
  const changePage = useCallback(async (page) => {
    const updatedPagination = { ...state.pagination, CurrentPage: page, PageNumber: page };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    
    await getBranches({ 
      page,
      search: state.filters.searchTerm,
      sortBy: state.filters.sortBy,
      sortAscending: state.filters.sortAscending
    });
  }, [state.pagination, state.filters, getBranches]);

  // Change page size
  const changePageSize = useCallback(async (pageSize) => {
    const updatedPagination = { 
      ...state.pagination, 
      PageSize: pageSize, 
      CurrentPage: 1, 
      PageNumber: 1 
    };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    
    await getBranches({ 
      pageSize, 
      page: 1,
      search: state.filters.searchTerm,
      sortBy: state.filters.sortBy,
      sortAscending: state.filters.sortAscending
    });
  }, [state.filters, getBranches]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Clear filters and reset
  const clearFilters = useCallback(async () => {
    const resetFilters = {
      searchTerm: '',
      sortBy: 'BranchName',
      sortAscending: true
    };
    
    dispatch({ type: actionTypes.SET_FILTERS, payload: resetFilters });
    
    await getBranches({ 
      page: 1,
      search: '',
      sortBy: 'BranchName',
      sortAscending: true
    });
  }, [getBranches]);

  // Context value
  const value = {
    // State
    branches: state.branches,
    currentBranch: state.currentBranch,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    statistics: state.statistics,
    
    // Actions
    getBranches,
    getBranch,
    getCompanyBalance,
    createBranch,
    updateBranch,
    deleteBranch,
    searchBranches,
    sortBranches,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState,
    clearFilters
  };

  return (
    <CompanyBranchContext.Provider value={value}>
      {children}
    </CompanyBranchContext.Provider>
  );
};

// Custom hook to use the company branch context
export const useCompanyBranch = () => {
  const context = useContext(CompanyBranchContext);
  if (!context) {
    throw new Error('useCompanyBranch must be used within a CompanyBranchProvider');
  }
  return context;
};

// Export context for direct access if needed
export { CompanyBranchContext };