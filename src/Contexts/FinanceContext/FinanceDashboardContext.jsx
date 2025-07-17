import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Types/Interfaces
const initialState = {
  overview: null,
  balance: null,
  cashFlow: null,
  profitLoss: null,
  expenseAnalysis: null,
  incomeAnalysis: null,
  trends: null,
  pendingApprovals: null,
  loading: false,
  error: null,
  lastUpdated: null,
  filters: {
    startDate: null,
    endDate: null,
    period: 'monthly',
    periods: 12,
    topCategories: 10
  }
};

// Action Types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_OVERVIEW: 'SET_OVERVIEW',
  SET_BALANCE: 'SET_BALANCE',
  SET_CASH_FLOW: 'SET_CASH_FLOW',
  SET_PROFIT_LOSS: 'SET_PROFIT_LOSS',
  SET_EXPENSE_ANALYSIS: 'SET_EXPENSE_ANALYSIS',
  SET_INCOME_ANALYSIS: 'SET_INCOME_ANALYSIS',
  SET_TRENDS: 'SET_TRENDS',
  SET_PENDING_APPROVALS: 'SET_PENDING_APPROVALS',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
  UPDATE_LAST_UPDATED: 'UPDATE_LAST_UPDATED'
};

// Reducer
const financeDashboardReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_OVERVIEW:
      return { 
        ...state, 
        overview: action.payload, 
        loading: false,
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_BALANCE:
      return { 
        ...state, 
        balance: action.payload, 
        loading: false,
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_CASH_FLOW:
      return { 
        ...state, 
        cashFlow: action.payload, 
        loading: false,
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_PROFIT_LOSS:
      return { 
        ...state, 
        profitLoss: action.payload, 
        loading: false,
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_EXPENSE_ANALYSIS:
      return { 
        ...state, 
        expenseAnalysis: action.payload, 
        loading: false,
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_INCOME_ANALYSIS:
      return { 
        ...state, 
        incomeAnalysis: action.payload, 
        loading: false,
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_TRENDS:
      return { 
        ...state, 
        trends: action.payload, 
        loading: false,
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_PENDING_APPROVALS:
      return { 
        ...state, 
        pendingApprovals: action.payload, 
        loading: false,
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.UPDATE_LAST_UPDATED:
      return { ...state, lastUpdated: new Date() };
    
    case ActionTypes.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Context
const FinanceDashboardContext = createContext();

// API Base URL - adjust according to your setup
const API_BASE_URL = '/api/financedashboard';

// Utility function for API calls
const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if needed
      // 'Authorization': `Bearer ${getAuthToken()}`
    },
    ...options
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Provider Component
export const FinanceDashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeDashboardReducer, initialState);

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

  // Build query string from parameters
  const buildQueryString = (params) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    return queryParams.toString();
  };

  // Dashboard Overview
  const getFinanceOverview = useCallback(async (startDate = null, endDate = null) => {
    try {
      setLoading(true);
      clearError();
      
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/overview${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiCall(url);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_OVERVIEW, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch finance overview');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Current Balance
  const getCurrentBalance = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      const response = await apiCall(`${API_BASE_URL}/balance`);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_BALANCE, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch current balance');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Cash Flow Analysis
  const getCashFlowAnalysis = useCallback(async (startDate = null, endDate = null, period = 'daily') => {
    try {
      setLoading(true);
      clearError();
      
      const params = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/cash-flow?${queryString}`;
      
      const response = await apiCall(url);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_CASH_FLOW, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch cash flow analysis');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Profit & Loss Summary
  const getProfitLossSummary = useCallback(async (startDate = null, endDate = null) => {
    try {
      setLoading(true);
      clearError();
      
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/profit-loss${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiCall(url);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_PROFIT_LOSS, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch profit & loss summary');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Expense Analysis
  const getExpenseAnalysis = useCallback(async (startDate = null, endDate = null, topCategories = 10) => {
    try {
      setLoading(true);
      clearError();
      
      const params = { topCategories };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/expense-analysis?${queryString}`;
      
      const response = await apiCall(url);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_EXPENSE_ANALYSIS, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch expense analysis');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Income Analysis
  const getIncomeAnalysis = useCallback(async (startDate = null, endDate = null, topCategories = 10) => {
    try {
      setLoading(true);
      clearError();
      
      const params = { topCategories };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/income-analysis?${queryString}`;
      
      const response = await apiCall(url);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_INCOME_ANALYSIS, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch income analysis');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Financial Trends
  const getFinancialTrends = useCallback(async (period = 'monthly', periods = 12) => {
    try {
      setLoading(true);
      clearError();
      
      const params = { period, periods };
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/trends?${queryString}`;
      
      const response = await apiCall(url);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_TRENDS, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch financial trends');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Pending Approvals
  const getPendingApprovals = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      const response = await apiCall(`${API_BASE_URL}/pending-approvals`);
      
      if (response.success) {
        dispatch({ type: ActionTypes.SET_PENDING_APPROVALS, payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch pending approvals');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Comprehensive Dashboard Refresh
  const refreshDashboard = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true);
      clearError();
      
      const filters = { ...state.filters, ...customFilters };
      
      // Fetch all dashboard data in parallel
      const promises = [
        getFinanceOverview(filters.startDate, filters.endDate),
        getCurrentBalance(),
        getCashFlowAnalysis(filters.startDate, filters.endDate, filters.period),
        getProfitLossSummary(filters.startDate, filters.endDate),
        getExpenseAnalysis(filters.startDate, filters.endDate, filters.topCategories),
        getIncomeAnalysis(filters.startDate, filters.endDate, filters.topCategories),
        getFinancialTrends(filters.period, filters.periods),
        getPendingApprovals()
      ];
      
      // Wait for all promises to resolve
      await Promise.allSettled(promises);
      
      // Update filters
      dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
      
    } catch (error) {
      setError(error.message);
    }
  }, [
    state.filters,
    getFinanceOverview,
    getCurrentBalance,
    getCashFlowAnalysis,
    getProfitLossSummary,
    getExpenseAnalysis,
    getIncomeAnalysis,
    getFinancialTrends,
    getPendingApprovals
  ]);

  // Quick refresh for specific data
  const quickRefresh = useCallback(async (sections = []) => {
    try {
      setLoading(true);
      clearError();
      
      const promises = [];
      
      sections.forEach(section => {
        switch (section) {
          case 'overview':
            promises.push(getFinanceOverview(state.filters.startDate, state.filters.endDate));
            break;
          case 'balance':
            promises.push(getCurrentBalance());
            break;
          case 'cashFlow':
            promises.push(getCashFlowAnalysis(state.filters.startDate, state.filters.endDate, state.filters.period));
            break;
          case 'profitLoss':
            promises.push(getProfitLossSummary(state.filters.startDate, state.filters.endDate));
            break;
          case 'expenseAnalysis':
            promises.push(getExpenseAnalysis(state.filters.startDate, state.filters.endDate, state.filters.topCategories));
            break;
          case 'incomeAnalysis':
            promises.push(getIncomeAnalysis(state.filters.startDate, state.filters.endDate, state.filters.topCategories));
            break;
          case 'trends':
            promises.push(getFinancialTrends(state.filters.period, state.filters.periods));
            break;
          case 'pendingApprovals':
            promises.push(getPendingApprovals());
            break;
        }
      });
      
      await Promise.allSettled(promises);
      
    } catch (error) {
      setError(error.message);
    }
  }, [
    state.filters,
    getFinanceOverview,
    getCurrentBalance,
    getCashFlowAnalysis,
    getProfitLossSummary,
    getExpenseAnalysis,
    getIncomeAnalysis,
    getFinancialTrends,
    getPendingApprovals
  ]);

  // Filter management
  const setFilters = useCallback((newFilters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
  }, []);

  const setDateRange = useCallback((startDate, endDate) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: { startDate, endDate } });
  }, []);

  const setPeriod = useCallback((period, periods = null) => {
    const newFilters = { period };
    if (periods) newFilters.periods = periods;
    dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: initialState.filters });
  }, []);

  // Utility methods
  const resetState = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_STATE });
  }, []);

  const updateLastUpdated = useCallback(() => {
    dispatch({ type: ActionTypes.UPDATE_LAST_UPDATED });
  }, []);

  // Helper methods for common date ranges
  const setCurrentMonth = useCallback(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setDateRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  }, [setDateRange]);

  const setCurrentYear = useCallback(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1);
    const endDate = new Date(now.getFullYear(), 11, 31);
    setDateRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  }, [setDateRange]);

  const setLast30Days = useCallback(() => {
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    setDateRange(startDate.toISOString().split('T')[0], now.toISOString().split('T')[0]);
  }, [setDateRange]);

  const setLast90Days = useCallback(() => {
    const now = new Date();
    const startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    setDateRange(startDate.toISOString().split('T')[0], now.toISOString().split('T')[0]);
  }, [setDateRange]);

  // Context value
  const value = {
    // State
    ...state,
    
    // Core dashboard methods
    getFinanceOverview,
    getCurrentBalance,
    getCashFlowAnalysis,
    getProfitLossSummary,
    getExpenseAnalysis,
    getIncomeAnalysis,
    getFinancialTrends,
    getPendingApprovals,
    
    // Refresh methods
    refreshDashboard,
    quickRefresh,
    
    // Filter management
    setFilters,
    setDateRange,
    setPeriod,
    resetFilters,
    
    // Date range helpers
    setCurrentMonth,
    setCurrentYear,
    setLast30Days,
    setLast90Days,
    
    // Utility methods
    clearError,
    resetState,
    updateLastUpdated
  };

  return (
    <FinanceDashboardContext.Provider value={value}>
      {children}
    </FinanceDashboardContext.Provider>
  );
};

// Custom hook to use the context
export const useFinanceDashboard = () => {
  const context = useContext(FinanceDashboardContext);
  if (!context) {
    throw new Error('useFinanceDashboard must be used within a FinanceDashboardProvider');
  }
  return context;
};

// Additional custom hooks for specific functionality
export const useDashboardOverview = () => {
  const { 
    overview, 
    loading, 
    error, 
    getFinanceOverview, 
    setDateRange,
    setCurrentMonth,
    setCurrentYear
  } = useFinanceDashboard();
  
  return {
    overview,
    loading,
    error,
    getFinanceOverview,
    setDateRange,
    setCurrentMonth,
    setCurrentYear
  };
};

export const useBalanceInfo = () => {
  const { 
    balance, 
    loading, 
    error, 
    getCurrentBalance 
  } = useFinanceDashboard();
  
  return {
    balance,
    loading,
    error,
    getCurrentBalance
  };
};

export const useCashFlowAnalysis = () => {
  const { 
    cashFlow, 
    loading, 
    error, 
    getCashFlowAnalysis,
    setPeriod 
  } = useFinanceDashboard();
  
  return {
    cashFlow,
    loading,
    error,
    getCashFlowAnalysis,
    setPeriod
  };
};

export const useProfitLossReport = () => {
  const { 
    profitLoss, 
    loading, 
    error, 
    getProfitLossSummary,
    setDateRange 
  } = useFinanceDashboard();
  
  return {
    profitLoss,
    loading,
    error,
    getProfitLossSummary,
    setDateRange
  };
};

export const useExpenseAnalysis = () => {
  const { 
    expenseAnalysis, 
    loading, 
    error, 
    getExpenseAnalysis 
  } = useFinanceDashboard();
  
  return {
    expenseAnalysis,
    loading,
    error,
    getExpenseAnalysis
  };
};

export const useIncomeAnalysis = () => {
  const { 
    incomeAnalysis, 
    loading, 
    error, 
    getIncomeAnalysis 
  } = useFinanceDashboard();
  
  return {
    incomeAnalysis,
    loading,
    error,
    getIncomeAnalysis
  };
};

export const useFinancialTrends = () => {
  const { 
    trends, 
    loading, 
    error, 
    getFinancialTrends,
    setPeriod 
  } = useFinanceDashboard();
  
  return {
    trends,
    loading,
    error,
    getFinancialTrends,
    setPeriod
  };
};

export const usePendingApprovals = () => {
  const { 
    pendingApprovals, 
    loading, 
    error, 
    getPendingApprovals 
  } = useFinanceDashboard();
  
  return {
    pendingApprovals,
    loading,
    error,
    getPendingApprovals
  };
};

export const useDashboardRefresh = () => {
  const { 
    loading, 
    error, 
    refreshDashboard, 
    quickRefresh,
    lastUpdated 
  } = useFinanceDashboard();
  
  return {
    loading,
    error,
    refreshDashboard,
    quickRefresh,
    lastUpdated
  };
};