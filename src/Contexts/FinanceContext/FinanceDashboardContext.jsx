import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';

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
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_BALANCE:
      return { 
        ...state, 
        balance: action.payload, 
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_CASH_FLOW:
      return { 
        ...state, 
        cashFlow: action.payload, 
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_PROFIT_LOSS:
      return { 
        ...state, 
        profitLoss: action.payload, 
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_EXPENSE_ANALYSIS:
      return { 
        ...state, 
        expenseAnalysis: action.payload, 
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_INCOME_ANALYSIS:
      return { 
        ...state, 
        incomeAnalysis: action.payload, 
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_TRENDS:
      return { 
        ...state, 
        trends: action.payload, 
        error: null,
        lastUpdated: new Date()
      };
    
    case ActionTypes.SET_PENDING_APPROVALS:
      return { 
        ...state, 
        pendingApprovals: action.payload, 
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

// API Base URL - Fixed to match actual API
const API_BASE_URL = 'https://api.speed-erp.com/api/FinanceDashboard';

// Token storage in memory - Fixed to initialize with your token
let authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI0IiwiQ29tcGFueUlkIjoiMjMiLCJ1c2VyX2lkIjoiNCIsImNvbXBhbnlfaWQiOiIyMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiRmF5eWF6QGdtYWlsLmNvbSIsImNvbXBhbnlfbmFtZSI6IkNvZGVzaW5jIiwianRpIjoiYmQ5YjMxNGUtY2EwZC00MmEyLTlkNDQtMTcwNTFmODQwMjFlIiwiaWF0IjoxNzUzMDgzMDcwLCJleHAiOjE3NTMxNjk0NzAsImlzcyI6IkVzb2x1dGlvbkFwaSIsImF1ZCI6IkVzb2x1dGlvbkNsaWVudCJ9.QDCtkHWafFwjNumEGPikZ0-gaG7NPD-vTeNnLYjRL7E';

// Set token function for authentication
export const setAuthToken = (token) => {
  authToken = token;
};

// Utility function for API calls with enhanced error handling
const apiCall = async (url, options = {}) => {
  console.log('🔗 API Call:', url);
  
  console.log('🔑 Token exists:', !!authToken);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    },
    ...options
  };

  try {
    console.log('📤 Making request to:', url);
    const response = await fetch(url, defaultOptions);
    
    console.log('📥 Response status:', response.status, response.statusText);
    
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      if (response.status === 404) {
        throw new Error(`API endpoint not found: ${url}`);
      }
      if (response.status >= 500) {
        throw new Error(`Server error (${response.status}). Please try again later.`);
      }
    }
    
    // If response is HTML instead of JSON, it means the endpoint doesn't exist
    if (contentType && contentType.includes('text/html')) {
      throw new Error(`API endpoint returned HTML instead of JSON. Check if the endpoint ${url} exists.`);
    }
    
    let result;
    try {
      const text = await response.text();
      console.log('📄 Raw response:', text.substring(0, 200) + '...');
      result = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      throw new Error(`Invalid JSON response from server. The API might be returning HTML or malformed data.`);
    }
    
    console.log('✅ Parsed response:', result);
    
    // Handle the backend response structure {Success, Message, Data}
    if (result.Success === false) {
      throw new Error(result.Message || 'API request failed');
    }
    
    return result;
  } catch (error) {
    console.error('❌ API Call Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Check if the API server is running and accessible.');
    }
    
    throw error;
  }
};

// Data transformation utilities
const transformCashFlowData = (data) => {
  if (!data || !data.DailyBreakdown) return null;
  
  const chartData = data.DailyBreakdown.$values?.map(day => ({
    period: new Date(day.Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    income: day.Inflows || 0,
    expenses: day.Outflows || 0,
    netFlow: day.NetFlow || 0
  })) || [];
  
  return {
    ...data,
    chartData
  };
};

const transformTrendsData = (data) => {
  if (!data || !data.Trends) return null;
  
  const monthlyComparison = data.Trends.$values?.map(trend => ({
    month: trend.Period,
    income: trend.Income || 0,
    expenses: trend.Expenses || 0,
    profit: trend.Profit || 0
  })) || [];
  
  return {
    ...data,
    monthlyComparison
  };
};

const transformExpenseAnalysis = (data) => {
  if (!data || !data.CategoryBreakdown) return null;
  
  const topCategories = data.CategoryBreakdown.$values?.map(category => ({
    name: category.CategoryName,
    amount: category.Amount,
    percentage: category.Percentage
  })) || [];
  
  return {
    ...data,
    topCategories
  };
};

const transformPendingApprovals = (data) => {
  if (!data) return null;
  
  const items = data.PendingExpenses.$values?.map(expense => ({
    description: expense.Description,
    amount: expense.Amount,
    date: new Date(expense.CreatedAt).toLocaleDateString(),
    id: expense.Id
  })) || [];
  
  return {
    total: data.PendingCount || 0,
    totalAmount: data.TotalPendingAmount || 0,
    items
  };
};

// Provider Component
export const FinanceDashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeDashboardReducer, initialState);
  const isLoadingRef = useRef(false);

  // Helper functions
  const setLoading = (loading) => {
    isLoadingRef.current = loading;
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    console.error('Dashboard Error:', error);
    setLoading(false);
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
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/overview${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiCall(url);
      
      // Transform the data to match frontend expectations
      const transformedData = {
        monthlyIncome: response.Data?.TotalIncome || 0,
        monthlyExpenses: response.Data?.TotalExpenses || 0,
        incomeChange: response.Data?.IncomeGrowth || 0,
        expenseChange: response.Data?.ExpenseGrowth || 0,
        netProfit: response.Data?.NetProfit || 0,
        profitChange: response.Data?.ProfitGrowth || 0
      };
      
      dispatch({ type: ActionTypes.SET_OVERVIEW, payload: transformedData });
      return transformedData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Current Balance
  const getCurrentBalance = useCallback(async () => {
    try {
      const response = await apiCall(`${API_BASE_URL}/balance`);
      
      const transformedData = {
        totalBalance: response.Data?.TotalBankBalance || response.Data?.CurrentBalance || 0,
        balanceChange: response.Data?.BalanceChange || 0,
        bankAccounts: response.Data?.BankAccounts?.$values || [],
        lastUpdated: response.Data?.LastUpdated
      };
      
      dispatch({ type: ActionTypes.SET_BALANCE, payload: transformedData });
      return transformedData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Cash Flow Analysis
  const getCashFlowAnalysis = useCallback(async (startDate = null, endDate = null, period = 'daily') => {
    try {
      const params = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/cash-flow?${queryString}`;
      
      const response = await apiCall(url);
      const transformedData = transformCashFlowData(response.Data);
      
      dispatch({ type: ActionTypes.SET_CASH_FLOW, payload: transformedData });
      return transformedData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Profit & Loss Summary
  const getProfitLossSummary = useCallback(async (startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/profit-loss${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiCall(url);
      
      const transformedData = {
        netProfit: response.Data?.NetProfit || 0,
        profitChange: 0, // Calculate if needed
        totalIncome: response.Data?.TotalIncome || 0,
        totalExpenses: response.Data?.TotalExpenses || 0,
        profitMargin: response.Data?.ProfitMargin || 0
      };
      
      dispatch({ type: ActionTypes.SET_PROFIT_LOSS, payload: transformedData });
      return transformedData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Expense Analysis
  const getExpenseAnalysis = useCallback(async (startDate = null, endDate = null, topCategories = 10) => {
    try {
      const params = { topCategories };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/expense-analysis?${queryString}`;
      
      const response = await apiCall(url);
      const transformedData = transformExpenseAnalysis(response.Data);
      
      dispatch({ type: ActionTypes.SET_EXPENSE_ANALYSIS, payload: transformedData });
      return transformedData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Income Analysis
  const getIncomeAnalysis = useCallback(async (startDate = null, endDate = null, topCategories = 10) => {
    try {
      const params = { topCategories };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/income-analysis?${queryString}`;
      
      const response = await apiCall(url);
      const transformedData = transformExpenseAnalysis(response.Data); // Same structure
      
      dispatch({ type: ActionTypes.SET_INCOME_ANALYSIS, payload: transformedData });
      return transformedData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Financial Trends
  const getFinancialTrends = useCallback(async (period = 'monthly', periods = 12) => {
    try {
      const params = { period, periods };
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/trends?${queryString}`;
      
      const response = await apiCall(url);
      const transformedData = transformTrendsData(response.Data);
      
      dispatch({ type: ActionTypes.SET_TRENDS, payload: transformedData });
      return transformedData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Pending Approvals
  const getPendingApprovals = useCallback(async () => {
    try {
      const response = await apiCall(`${API_BASE_URL}/pending-approvals`);
      const transformedData = transformPendingApprovals(response.Data);
      
      dispatch({ type: ActionTypes.SET_PENDING_APPROVALS, payload: transformedData });
      return transformedData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Comprehensive Dashboard Refresh with better error handling
  const refreshDashboard = useCallback(async (customFilters = {}) => {
    if (isLoadingRef.current) {
      console.log('⚠️ Refresh already in progress, skipping...');
      return;
    }

    try {
      setLoading(true);
      clearError();
      
      const filters = { ...state.filters, ...customFilters };
      console.log('🔄 Refreshing dashboard with filters:', filters);
      
      // Fetch all dashboard data in parallel with individual error handling
      const promises = [
        getFinanceOverview(filters.startDate, filters.endDate).catch(err => ({ error: err.message, type: 'overview' })),
        getCurrentBalance().catch(err => ({ error: err.message, type: 'balance' })),
        getCashFlowAnalysis(filters.startDate, filters.endDate, filters.period).catch(err => ({ error: err.message, type: 'cashFlow' })),
        getProfitLossSummary(filters.startDate, filters.endDate).catch(err => ({ error: err.message, type: 'profitLoss' })),
        getExpenseAnalysis(filters.startDate, filters.endDate, filters.topCategories).catch(err => ({ error: err.message, type: 'expenseAnalysis' })),
        getIncomeAnalysis(filters.startDate, filters.endDate, filters.topCategories).catch(err => ({ error: err.message, type: 'incomeAnalysis' })),
        getFinancialTrends(filters.period, filters.periods).catch(err => ({ error: err.message, type: 'trends' })),
        getPendingApprovals().catch(err => ({ error: err.message, type: 'pendingApprovals' }))
      ];
      
      const results = await Promise.allSettled(promises);
      
      // Check for errors in individual requests
      const errors = [];
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          errors.push(`Request ${index} failed: ${result.reason?.message || result.reason}`);
        } else if (result.value?.error) {
          errors.push(`${result.value.type}: ${result.value.error}`);
        }
      });
      
      if (errors.length > 0) {
        const errorMessage = `Some requests failed:\n${errors.join('\n')}`;
        setError(errorMessage);
        console.error('🚨 Dashboard errors:', errors);
      } else {
        console.log('✅ Dashboard refresh completed successfully');
        dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
      }
      
    } catch (error) {
      console.error('🚨 Dashboard refresh failed:', error);
      setError(error.message || 'Failed to refresh dashboard');
    } finally {
      setLoading(false);
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