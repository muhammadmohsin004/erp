import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  // Income state
  incomes: [],
  currentIncome: null,
  incomeLoading: false,
  incomeError: null,
  incomePagination: {
    CurrentPage: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  },
  
  // Expense state
  expenses: [],
  currentExpense: null,
  expenseLoading: false,
  expenseError: null,
  expensePagination: {
    CurrentPage: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  },
  
  // Balance state
  companyBalance: null,
  balanceLoading: false,
  balanceError: null,
  
  // Filters state
  incomeFilters: {
    searchTerm: '',
    sortBy: 'Id',
    sortAscending: false,
    dateFrom: '',
    dateTo: '',
    currency: '',
    categoryId: '',
    isRecurring: null
  },
  expenseFilters: {
    searchTerm: '',
    sortBy: 'Id', 
    sortAscending: false,
    dateFrom: '',
    dateTo: '',
    currency: '',
    categoryId: '',
    isRecurring: null
  }
};

// Action types
const actionTypes = {
  // Income actions
  SET_INCOME_LOADING: 'SET_INCOME_LOADING',
  SET_INCOME_ERROR: 'SET_INCOME_ERROR',
  SET_INCOMES: 'SET_INCOMES',
  SET_CURRENT_INCOME: 'SET_CURRENT_INCOME',
  SET_INCOME_PAGINATION: 'SET_INCOME_PAGINATION',
  SET_INCOME_FILTERS: 'SET_INCOME_FILTERS',
  ADD_INCOME: 'ADD_INCOME',
  UPDATE_INCOME: 'UPDATE_INCOME',
  DELETE_INCOME: 'DELETE_INCOME',
  
  // Expense actions
  SET_EXPENSE_LOADING: 'SET_EXPENSE_LOADING',
  SET_EXPENSE_ERROR: 'SET_EXPENSE_ERROR',
  SET_EXPENSES: 'SET_EXPENSES',
  SET_CURRENT_EXPENSE: 'SET_CURRENT_EXPENSE',
  SET_EXPENSE_PAGINATION: 'SET_EXPENSE_PAGINATION',
  SET_EXPENSE_FILTERS: 'SET_EXPENSE_FILTERS',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  
  // Balance actions
  SET_BALANCE_LOADING: 'SET_BALANCE_LOADING',
  SET_BALANCE_ERROR: 'SET_BALANCE_ERROR',
  SET_COMPANY_BALANCE: 'SET_COMPANY_BALANCE',
  
  // General actions
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const financeReducer = (state, action) => {
  switch (action.type) {
    // Income reducers
    case actionTypes.SET_INCOME_LOADING:
      return { ...state, incomeLoading: action.payload };
    
    case actionTypes.SET_INCOME_ERROR:
      return { ...state, incomeError: action.payload, incomeLoading: false };
    
    case actionTypes.SET_INCOMES:
      return { 
        ...state, 
        incomes: action.payload, 
        incomeLoading: false, 
        incomeError: null 
      };
    
    case actionTypes.SET_CURRENT_INCOME:
      return { 
        ...state, 
        currentIncome: action.payload, 
        incomeLoading: false, 
        incomeError: null 
      };
    
    case actionTypes.SET_INCOME_PAGINATION:
      return { 
        ...state, 
        incomePagination: { ...state.incomePagination, ...action.payload } 
      };
    
    case actionTypes.SET_INCOME_FILTERS:
      return { 
        ...state, 
        incomeFilters: { ...state.incomeFilters, ...action.payload } 
      };
    
    case actionTypes.ADD_INCOME:
      const currentIncomes = state.incomes?.Data?.$values || [];
      const updatedIncomes = [...currentIncomes, action.payload];
      return { 
        ...state, 
        incomes: {
          ...state.incomes,
          Data: { $values: updatedIncomes }
        },
        incomeLoading: false,
        incomeError: null
      };
    
    case actionTypes.UPDATE_INCOME:
      const currentIncomesUpdate = state.incomes?.Data?.$values || [];
      const updatedIncomesUpdate = currentIncomesUpdate.map(income =>
        income.Id === action.payload.Id ? action.payload : income
      );
      return {
        ...state,
        incomes: {
          ...state.incomes,
          Data: { $values: updatedIncomesUpdate }
        },
        currentIncome: state.currentIncome?.Id === action.payload.Id 
          ? action.payload 
          : state.currentIncome,
        incomeLoading: false,
        incomeError: null
      };
    
    case actionTypes.DELETE_INCOME:
      const currentIncomesDelete = state.incomes?.Data?.$values || [];
      const updatedIncomesDelete = currentIncomesDelete.filter(
        income => income.Id !== action.payload
      );
      return {
        ...state,
        incomes: {
          ...state.incomes,
          Data: { $values: updatedIncomesDelete }
        },
        currentIncome: state.currentIncome?.Id === action.payload 
          ? null 
          : state.currentIncome,
        incomeLoading: false,
        incomeError: null
      };

    // Expense reducers
    case actionTypes.SET_EXPENSE_LOADING:
      return { ...state, expenseLoading: action.payload };
    
    case actionTypes.SET_EXPENSE_ERROR:
      return { ...state, expenseError: action.payload, expenseLoading: false };
    
    case actionTypes.SET_EXPENSES:
      return { 
        ...state, 
        expenses: action.payload, 
        expenseLoading: false, 
        expenseError: null 
      };
    
    case actionTypes.SET_CURRENT_EXPENSE:
      return { 
        ...state, 
        currentExpense: action.payload, 
        expenseLoading: false, 
        expenseError: null 
      };
    
    case actionTypes.SET_EXPENSE_PAGINATION:
      return { 
        ...state, 
        expensePagination: { ...state.expensePagination, ...action.payload } 
      };
    
    case actionTypes.SET_EXPENSE_FILTERS:
      return { 
        ...state, 
        expenseFilters: { ...state.expenseFilters, ...action.payload } 
      };
    
    case actionTypes.ADD_EXPENSE:
      const currentExpenses = state.expenses?.Data?.$values || [];
      const updatedExpenses = [...currentExpenses, action.payload];
      return { 
        ...state, 
        expenses: {
          ...state.expenses,
          Data: { $values: updatedExpenses }
        },
        expenseLoading: false,
        expenseError: null
      };
    
    case actionTypes.UPDATE_EXPENSE:
      const currentExpensesUpdate = state.expenses?.Data?.$values || [];
      const updatedExpensesUpdate = currentExpensesUpdate.map(expense =>
        expense.Id === action.payload.Id ? action.payload : expense
      );
      return {
        ...state,
        expenses: {
          ...state.expenses,
          Data: { $values: updatedExpensesUpdate }
        },
        currentExpense: state.currentExpense?.Id === action.payload.Id 
          ? action.payload 
          : state.currentExpense,
        expenseLoading: false,
        expenseError: null
      };
    
    case actionTypes.DELETE_EXPENSE:
      const currentExpensesDelete = state.expenses?.Data?.$values || [];
      const updatedExpensesDelete = currentExpensesDelete.filter(
        expense => expense.Id !== action.payload
      );
      return {
        ...state,
        expenses: {
          ...state.expenses,
          Data: { $values: updatedExpensesDelete }
        },
        currentExpense: state.currentExpense?.Id === action.payload 
          ? null 
          : state.currentExpense,
        expenseLoading: false,
        expenseError: null
      };

    // Balance reducers
    case actionTypes.SET_BALANCE_LOADING:
      return { ...state, balanceLoading: action.payload };
    
    case actionTypes.SET_BALANCE_ERROR:
      return { ...state, balanceError: action.payload, balanceLoading: false };
    
    case actionTypes.SET_COMPANY_BALANCE:
      return { 
        ...state, 
        companyBalance: action.payload, 
        balanceLoading: false, 
        balanceError: null 
      };

    // General reducers
    case actionTypes.CLEAR_ERRORS:
      return { 
        ...state, 
        incomeError: null, 
        expenseError: null, 
        balanceError: null 
      };
    
    case actionTypes.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Create context
const FinanceContext = createContext();

// API base URLs
const INCOME_API_BASE_URL = 'https://api.speed-erp.com/api/FinanceIncomes';
const EXPENSE_API_BASE_URL = 'https://api.speed-erp.com/api/FinanceExpenses';
const BALANCE_API_BASE_URL = 'https://api.speed-erp.com/api/CompanyBranches/GetCompanyBalance';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to make API calls
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
    console.log('Making API call to:', url);
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    
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
export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
  }, []);

  // Set filters
  const setIncomeFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_INCOME_FILTERS, payload: filters });
  }, []);

  const setExpenseFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_EXPENSE_FILTERS, payload: filters });
  }, []);

  // Income functions
  const getIncomes = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_INCOME_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      if (params.page || state.incomePagination.CurrentPage) {
        queryParams.append('page', params.page || state.incomePagination.CurrentPage);
      }
      if (params.pageSize || state.incomePagination.PageSize) {
        queryParams.append('pageSize', params.pageSize || state.incomePagination.PageSize);
      }
      if (params.search || state.incomeFilters.searchTerm) {
        queryParams.append('search', params.search || state.incomeFilters.searchTerm);
      }

      const response = await makeApiCall(`${INCOME_API_BASE_URL}?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_INCOMES, payload: response });
        
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_INCOME_PAGINATION, payload: {
            CurrentPage: response.Paginations.CurrentPage,
            PageSize: response.Paginations.PageSize,
            TotalItems: response.Paginations.TotalItems,
            TotalPages: response.Paginations.TotalPages,
            HasPreviousPage: response.Paginations.CurrentPage > 1,
            HasNextPage: response.Paginations.CurrentPage < response.Paginations.TotalPages
          }});
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch incomes');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_INCOME_ERROR, payload: error.message });
    }
  }, [state.incomePagination.CurrentPage, state.incomePagination.PageSize, state.incomeFilters.searchTerm]);

  const getIncome = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_INCOME_LOADING, payload: true });
      
      const response = await makeApiCall(`${INCOME_API_BASE_URL}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_INCOME, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch income');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_INCOME_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createIncome = useCallback(async (incomeData) => {
    try {
      dispatch({ type: actionTypes.SET_INCOME_LOADING, payload: true });
      
      const response = await makeApiCall(INCOME_API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(incomeData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_INCOME, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create income');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_INCOME_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateIncome = useCallback(async (id, incomeData) => {
    try {
      dispatch({ type: actionTypes.SET_INCOME_LOADING, payload: true });
      
      const response = await makeApiCall(`${INCOME_API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(incomeData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_INCOME, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update income');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_INCOME_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteIncome = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_INCOME_LOADING, payload: true });
      
      const response = await makeApiCall(`${INCOME_API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_INCOME, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete income');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_INCOME_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Expense functions
  const getExpenses = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_EXPENSE_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      if (params.page || state.expensePagination.CurrentPage) {
        queryParams.append('page', params.page || state.expensePagination.CurrentPage);
      }
      if (params.pageSize || state.expensePagination.PageSize) {
        queryParams.append('pageSize', params.pageSize || state.expensePagination.PageSize);
      }
      if (params.search || state.expenseFilters.searchTerm) {
        queryParams.append('search', params.search || state.expenseFilters.searchTerm);
      }

      const response = await makeApiCall(`${EXPENSE_API_BASE_URL}?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_EXPENSES, payload: response });
        
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_EXPENSE_PAGINATION, payload: {
            CurrentPage: response.Paginations.CurrentPage,
            PageSize: response.Paginations.PageSize,
            TotalItems: response.Paginations.TotalItems,
            TotalPages: response.Paginations.TotalPages,
            HasPreviousPage: response.Paginations.CurrentPage > 1,
            HasNextPage: response.Paginations.CurrentPage < response.Paginations.TotalPages
          }});
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch expenses');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_EXPENSE_ERROR, payload: error.message });
    }
  }, [state.expensePagination.CurrentPage, state.expensePagination.PageSize, state.expenseFilters.searchTerm]);

  const getExpense = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_EXPENSE_LOADING, payload: true });
      
      const response = await makeApiCall(`${EXPENSE_API_BASE_URL}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_EXPENSE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch expense');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_EXPENSE_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createExpense = useCallback(async (expenseData) => {
    try {
      dispatch({ type: actionTypes.SET_EXPENSE_LOADING, payload: true });
      
      const response = await makeApiCall(EXPENSE_API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(expenseData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_EXPENSE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create expense');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_EXPENSE_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      dispatch({ type: actionTypes.SET_EXPENSE_LOADING, payload: true });
      
      const response = await makeApiCall(`${EXPENSE_API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(expenseData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_EXPENSE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update expense');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_EXPENSE_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_EXPENSE_LOADING, payload: true });
      
      const response = await makeApiCall(`${EXPENSE_API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_EXPENSE, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete expense');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_EXPENSE_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Balance functions
  const getCompanyBalance = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_BALANCE_LOADING, payload: true });
      
      const response = await makeApiCall(BALANCE_API_BASE_URL);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_COMPANY_BALANCE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch company balance');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_BALANCE_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Search functions
  const searchIncomes = useCallback(async (searchTerm) => {
    const updatedFilters = { ...state.incomeFilters, searchTerm };
    dispatch({ type: actionTypes.SET_INCOME_FILTERS, payload: updatedFilters });
    await getIncomes({ search: searchTerm, page: 1 });
  }, [state.incomeFilters, getIncomes]);

  const searchExpenses = useCallback(async (searchTerm) => {
    const updatedFilters = { ...state.expenseFilters, searchTerm };
    dispatch({ type: actionTypes.SET_EXPENSE_FILTERS, payload: updatedFilters });
    await getExpenses({ search: searchTerm, page: 1 });
  }, [state.expenseFilters, getExpenses]);

  // Pagination functions
  const changeIncomePage = useCallback(async (page) => {
    const updatedPagination = { ...state.incomePagination, CurrentPage: page };
    dispatch({ type: actionTypes.SET_INCOME_PAGINATION, payload: updatedPagination });
    await getIncomes({ page });
  }, [state.incomePagination, getIncomes]);

  const changeExpensePage = useCallback(async (page) => {
    const updatedPagination = { ...state.expensePagination, CurrentPage: page };
    dispatch({ type: actionTypes.SET_EXPENSE_PAGINATION, payload: updatedPagination });
    await getExpenses({ page });
  }, [state.expensePagination, getExpenses]);

  const changeIncomePageSize = useCallback(async (pageSize) => {
    const updatedPagination = { ...state.incomePagination, PageSize: pageSize, CurrentPage: 1 };
    dispatch({ type: actionTypes.SET_INCOME_PAGINATION, payload: updatedPagination });
    await getIncomes({ pageSize, page: 1 });
  }, [getIncomes]);

  const changeExpensePageSize = useCallback(async (pageSize) => {
    const updatedPagination = { ...state.expensePagination, PageSize: pageSize, CurrentPage: 1 };
    dispatch({ type: actionTypes.SET_EXPENSE_PAGINATION, payload: updatedPagination });
    await getExpenses({ pageSize, page: 1 });
  }, [getExpenses]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // Income state
    incomes: state.incomes,
    currentIncome: state.currentIncome,
    incomeLoading: state.incomeLoading,
    incomeError: state.incomeError,
    incomePagination: state.incomePagination,
    incomeFilters: state.incomeFilters,
    
    // Expense state
    expenses: state.expenses,
    currentExpense: state.currentExpense,
    expenseLoading: state.expenseLoading,
    expenseError: state.expenseError,
    expensePagination: state.expensePagination,
    expenseFilters: state.expenseFilters,
    
    // Balance state
    companyBalance: state.companyBalance,
    balanceLoading: state.balanceLoading,
    balanceError: state.balanceError,
    
    // Income actions
    getIncomes,
    getIncome,
    createIncome,
    updateIncome,
    deleteIncome,
    searchIncomes,
    changeIncomePage,
    changeIncomePageSize,
    setIncomeFilters,
    
    // Expense actions
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    searchExpenses,
    changeExpensePage,
    changeExpensePageSize,
    setExpenseFilters,
    
    // Balance actions
    getCompanyBalance,
    
    // General actions
    clearErrors,
    resetState
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

// Export context for direct access if needed
export { FinanceContext };