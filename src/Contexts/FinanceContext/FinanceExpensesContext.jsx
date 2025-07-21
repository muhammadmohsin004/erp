import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Types/Interfaces
const initialState = {
  expenses: [],
  currentExpense: null,
  categories: [],
  statistics: null,
  trends: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 25,
    search: "",
    status: "",
    categoryId: null,
    vendorId: null,
    startDate: null,
    endDate: null,
    minAmount: null,
    maxAmount: null,
    currency: "",
    paymentMethod: "",
    isRecurring: null,
    sortBy: "ExpenseDate",
    sortAscending: false,
  },
  pagination: {
    currentPage: 1,
    pageNumber: 1,
    pageSize: 25,
    totalItems: 0,
    totalPages: 0,
  },
};

// Action Types
const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_EXPENSES: "SET_EXPENSES",
  SET_CURRENT_EXPENSE: "SET_CURRENT_EXPENSE",
  SET_CATEGORIES: "SET_CATEGORIES",
  SET_STATISTICS: "SET_STATISTICS",
  SET_TRENDS: "SET_TRENDS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  ADD_EXPENSE: "ADD_EXPENSE",
  UPDATE_EXPENSE: "UPDATE_EXPENSE",
  DELETE_EXPENSE: "DELETE_EXPENSE",
  APPROVE_EXPENSE: "APPROVE_EXPENSE",
  REJECT_EXPENSE: "REJECT_EXPENSE",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_STATE: "RESET_STATE",
};

// Reducer
const financeExpensesReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ActionTypes.SET_EXPENSES:
      return {
        ...state,
        expenses: action.payload.data || [],
        pagination: action.payload.pagination || state.pagination,
        loading: false,
        error: null,
      };

    case ActionTypes.SET_CURRENT_EXPENSE:
      return { ...state, currentExpense: action.payload, loading: false };

    case ActionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload, loading: false };

    case ActionTypes.SET_STATISTICS:
      return { ...state, statistics: action.payload, loading: false };

    case ActionTypes.SET_TRENDS:
      return { ...state, trends: action.payload, loading: false };

    case ActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case ActionTypes.ADD_EXPENSE:
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        loading: false,
      };

    case ActionTypes.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.Id === action.payload.Id ? action.payload : expense
        ),
        currentExpense:
          state.currentExpense?.Id === action.payload.Id
            ? action.payload
            : state.currentExpense,
        loading: false,
      };

    case ActionTypes.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.Id !== action.payload
        ),
        currentExpense:
          state.currentExpense?.Id === action.payload
            ? null
            : state.currentExpense,
        loading: false,
      };

    case ActionTypes.APPROVE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.Id === action.payload.id
            ? { ...expense, Status: "Approved", ...action.payload.data }
            : expense
        ),
        currentExpense:
          state.currentExpense?.Id === action.payload.id
            ? {
                ...state.currentExpense,
                Status: "Approved",
                ...action.payload.data,
              }
            : state.currentExpense,
        loading: false,
      };

    case ActionTypes.REJECT_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.Id === action.payload.id
            ? { ...expense, Status: "Rejected", ...action.payload.data }
            : expense
        ),
        currentExpense:
          state.currentExpense?.Id === action.payload.id
            ? {
                ...state.currentExpense,
                Status: "Rejected",
                ...action.payload.data,
              }
            : state.currentExpense,
        loading: false,
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
const FinanceExpensesContext = createContext();

// API Base URL
const API_BASE_URL = "https://api.speed-erp.com/api/FinanceExpenses";

const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Utility function for API calls
const apiCall = async (url, options = {}) => {
  const token = getAuthToken();

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Handle FormData for file uploads
  if (options.body instanceof FormData) {
    delete defaultOptions.headers["Content-Type"];
  }

  const response = await fetch(url, { ...defaultOptions });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.Message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Provider Component
export const FinanceExpensesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeExpensesReducer, initialState);

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
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    return params.toString();
  };

  // Core CRUD Operations
  const getExpenses = useCallback(
    async (customFilters = {}) => {
      try {
        setLoading(true);
        clearError();

        const filters = { ...state.filters, ...customFilters };
        const queryString = buildQueryString(filters);
        const url = `${API_BASE_URL}?${queryString}`;

        const response = await apiCall(url);

        if (response.Success) {
          // Handle both single object and array responses
          const expenseData = response?.Data?.$values || [];

          console.log("Expense Data:", expenseData);

          dispatch({
            type: ActionTypes.SET_EXPENSES,
            payload: {
              data: expenseData,
              pagination: response.Pagination || state.pagination,
            },
          });
          dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
        } else {
          throw new Error(response.Message || "Failed to fetch expenses");
        }
      } catch (error) {
        setError(error.message);
      }
    },
    [state.filters]
  );

  const getExpense = useCallback(async (id) => {
    try {
      setLoading(true);
      clearError();

      const response = await apiCall(`${API_BASE_URL}/${id}`);

      console.log("This is hte new data ", response);

      if (response.Success) {
        dispatch({
          type: ActionTypes.SET_CURRENT_EXPENSE,
          payload: response.Data,
        });
      } else {
        throw new Error(response.Message || "Failed to fetch expense");
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const createExpense = useCallback(async (expenseData) => {
    try {
      setLoading(true);
      clearError();

      // Prepare the data according to API structure
      const payload = {
        CompanyId: expenseData.companyId || 0,
        CodeNumber: expenseData.codeNumber || "",
        ExpenseDate: expenseData.expenseDate,
        CategoryId: parseInt(expenseData.categoryId) || 0,
        VendorId: parseInt(expenseData.vendorId) || 0,
        Description: expenseData.description,
        Amount: parseFloat(expenseData.amount) || 0,
        Currency: expenseData.currency || "USD",
        ExchangeRate: parseFloat(expenseData.exchangeRate) || 1,
        PaymentMethod: expenseData.paymentMethod,
        BankAccountId: parseInt(expenseData.bankAccountId) || 0,
        Status: expenseData.status || "Pending",
        TaxAmount: parseFloat(expenseData.taxAmount) || 0,
        TaxRate: parseFloat(expenseData.taxRate) || 0,
        TotalAmount:
          parseFloat(expenseData.totalAmount) ||
          parseFloat(expenseData.amount) ||
          0,
        Notes: expenseData.notes || "",
        ReferenceNumber: expenseData.referenceNumber || "",
        IsRecurring: expenseData.isRecurring || false,
        RecurringPattern: expenseData.recurringPattern || "",
        RecurringInterval: parseInt(expenseData.recurringInterval) || 0,
        NextRecurringDate: expenseData.nextRecurringDate || null,
        Items: expenseData.items || [],
      };

      const response = await apiCall(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.Success) {
        dispatch({ type: ActionTypes.ADD_EXPENSE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to create expense");
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      setLoading(true);
      clearError();

      // Prepare the data according to API structure
      const payload = {
        Id: id,
        CompanyId: expenseData.companyId || 0,
        CodeNumber: expenseData.codeNumber || "",
        ExpenseDate: expenseData.expenseDate,
        CategoryId: parseInt(expenseData.categoryId) || 0,
        VendorId: parseInt(expenseData.vendorId) || 0,
        Description: expenseData.description,
        Amount: parseFloat(expenseData.amount) || 0,
        Currency: expenseData.currency || "USD",
        ExchangeRate: parseFloat(expenseData.exchangeRate) || 1,
        PaymentMethod: expenseData.paymentMethod,
        BankAccountId: parseInt(expenseData.bankAccountId) || 0,
        Status: expenseData.status || "Pending",
        TaxAmount: parseFloat(expenseData.taxAmount) || 0,
        TaxRate: parseFloat(expenseData.taxRate) || 0,
        TotalAmount:
          parseFloat(expenseData.totalAmount) ||
          parseFloat(expenseData.amount) ||
          0,
        Notes: expenseData.notes || "",
        ReferenceNumber: expenseData.referenceNumber || "",
        IsRecurring: expenseData.isRecurring || false,
        RecurringPattern: expenseData.recurringPattern || "",
        RecurringInterval: parseInt(expenseData.recurringInterval) || 0,
        NextRecurringDate: expenseData.nextRecurringDate || null,
        Items: expenseData.items || [],
      };

      const response = await apiCall(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response.Success) {
        dispatch({ type: ActionTypes.UPDATE_EXPENSE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to update expense");
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const deleteExpense = useCallback(async (id, hardDelete = false) => {
    try {
      setLoading(true);
      clearError();

      const url = `${API_BASE_URL}/${id}${
        hardDelete ? "?hardDelete=true" : ""
      }`;
      const response = await apiCall(url, { method: "DELETE" });

      if (response.Success) {
        dispatch({ type: ActionTypes.DELETE_EXPENSE, payload: id });
      } else {
        throw new Error(response.Message || "Failed to delete expense");
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  // Expense Status Management
  const approveExpense = useCallback(async (id, notes = "") => {
    try {
      setLoading(true);
      clearError();

      const response = await apiCall(`${API_BASE_URL}/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({ notes }),
      });

      if (response.Success) {
        dispatch({
          type: ActionTypes.APPROVE_EXPENSE,
          payload: {
            id,
            data: {
              ApprovalNotes: notes,
              ApprovedDate: new Date().toISOString(),
            },
          },
        });
      } else {
        throw new Error(response.Message || "Failed to approve expense");
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const rejectExpense = useCallback(async (id, reason) => {
    try {
      setLoading(true);
      clearError();

      const response = await apiCall(`${API_BASE_URL}/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });

      if (response.Success) {
        dispatch({
          type: ActionTypes.REJECT_EXPENSE,
          payload: {
            id,
            data: {
              RejectionReason: reason,
              RejectedDate: new Date().toISOString(),
            },
          },
        });
      } else {
        throw new Error(response.Message || "Failed to reject expense");
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  // Analytics and Reports
  const getExpenseStatistics = useCallback(
    async (startDate = null, endDate = null) => {
      try {
        setLoading(true);
        clearError();

        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const url = `${API_BASE_URL}/statistics?${params.toString()}`;
        const response = await apiCall(url);

        if (response.Success) {
          dispatch({
            type: ActionTypes.SET_STATISTICS,
            payload: response.Data,
          });
        } else {
          throw new Error(response.Message || "Failed to fetch statistics");
        }
      } catch (error) {
        setError(error.message);
      }
    },
    []
  );

  const getExpenseTrends = useCallback(
    async (period = "monthly", months = 12) => {
      try {
        setLoading(true);
        clearError();

        const params = new URLSearchParams();
        params.append("period", period);
        params.append("months", months.toString());

        const url = `${API_BASE_URL}/trends?${params.toString()}`;
        const response = await apiCall(url);

        if (response.Success) {
          dispatch({ type: ActionTypes.SET_TRENDS, payload: response.Data });
        } else {
          throw new Error(response.Message || "Failed to fetch trends");
        }
      } catch (error) {
        setError(error.message);
      }
    },
    []
  );

  // Categories Management
  const getExpenseCategories = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      const response = await apiCall(`${API_BASE_URL}/categories`);

      if (response.Success) {
        const categoriesData = Array.isArray(response.Data)
          ? response.Data
          : [response.Data];
        dispatch({ type: ActionTypes.SET_CATEGORIES, payload: categoriesData });
      } else {
        throw new Error(response.Message || "Failed to fetch categories");
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

  const changePage = useCallback(
    (newPage) => {
      const newFilters = { ...state.filters, page: newPage };
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
      getExpenses(newFilters);
    },
    [state.filters, getExpenses]
  );

  const changePageSize = useCallback(
    (newPageSize) => {
      const newFilters = { ...state.filters, pageSize: newPageSize, page: 1 };
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
      getExpenses(newFilters);
    },
    [state.filters, getExpenses]
  );

  // Search and filter methods
  const searchExpenses = useCallback(
    (searchTerm) => {
      const newFilters = { ...state.filters, search: searchTerm, page: 1 };
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
      getExpenses(newFilters);
    },
    [state.filters, getExpenses]
  );

  const filterByStatus = useCallback(
    (status) => {
      const newFilters = { ...state.filters, status, page: 1 };
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
      getExpenses(newFilters);
    },
    [state.filters, getExpenses]
  );

  const filterByCategory = useCallback(
    (categoryId) => {
      const newFilters = { ...state.filters, categoryId, page: 1 };
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
      getExpenses(newFilters);
    },
    [state.filters, getExpenses]
  );

  const filterByVendor = useCallback(
    (vendorId) => {
      const newFilters = { ...state.filters, vendorId, page: 1 };
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
      getExpenses(newFilters);
    },
    [state.filters, getExpenses]
  );

  const filterByDateRange = useCallback(
    (startDate, endDate) => {
      const newFilters = { ...state.filters, startDate, endDate, page: 1 };
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
      getExpenses(newFilters);
    },
    [state.filters, getExpenses]
  );

  const filterByAmountRange = useCallback(
    (minAmount, maxAmount) => {
      const newFilters = { ...state.filters, minAmount, maxAmount, page: 1 };
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
      getExpenses(newFilters);
    },
    [state.filters, getExpenses]
  );

  const sortExpenses = useCallback(
    (sortBy, sortAscending = true) => {
      const newFilters = { ...state.filters, sortBy, sortAscending };
      dispatch({ type: ActionTypes.SET_FILTERS, payload: newFilters });
      getExpenses(newFilters);
    },
    [state.filters, getExpenses]
  );

  // Utility methods
  const clearCurrentExpense = useCallback(() => {
    dispatch({ type: ActionTypes.SET_CURRENT_EXPENSE, payload: null });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // State
    ...state,

    // Core CRUD operations
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,

    // Expense Status Management
    approveExpense,
    rejectExpense,

    // Analytics and reports
    getExpenseStatistics,
    getExpenseTrends,

    // Categories
    getExpenseCategories,

    // Filtering and pagination
    setFilters,
    resetFilters,
    setPagination,
    changePage,
    changePageSize,

    // Search and filter helpers
    searchExpenses,
    filterByStatus,
    filterByCategory,
    filterByVendor,
    filterByDateRange,
    filterByAmountRange,
    sortExpenses,

    // Utility methods
    clearError,
    clearCurrentExpense,
    resetState,
  };

  return (
    <FinanceExpensesContext.Provider value={value}>
      {children}
    </FinanceExpensesContext.Provider>
  );
};

// Custom hook to use the context
export const useFinanceExpenses = () => {
  const context = useContext(FinanceExpensesContext);
  if (!context) {
    throw new Error(
      "useFinanceExpenses must be used within a FinanceExpensesProvider"
    );
  }
  return context;
};

// Additional custom hooks for specific functionality
export const useExpenseList = () => {
  const {
    expenses,
    pagination,
    loading,
    error,
    getExpenses,
    changePage,
    changePageSize,
  } = useFinanceExpenses();

  return {
    expenses,
    pagination,
    loading,
    error,
    getExpenses,
    changePage,
    changePageSize,
  };
};

export const useExpenseDetails = (id) => {
  const { currentExpense, loading, error, getExpense, clearCurrentExpense } =
    useFinanceExpenses();

  React.useEffect(() => {
    if (id) {
      getExpense(id);
    }

    return () => {
      clearCurrentExpense();
    };
  }, [id, getExpense, clearCurrentExpense]);

  return {
    expense: currentExpense,
    loading,
    error,
  };
};

export const useExpenseSearch = () => {
  const {
    filters,
    loading,
    searchExpenses,
    filterByStatus,
    filterByCategory,
    filterByVendor,
    filterByDateRange,
    filterByAmountRange,
    sortExpenses,
    resetFilters,
  } = useFinanceExpenses();

  return {
    filters,
    loading,
    searchExpenses,
    filterByStatus,
    filterByCategory,
    filterByVendor,
    filterByDateRange,
    filterByAmountRange,
    sortExpenses,
    resetFilters,
  };
};

export const useExpenseAnalytics = () => {
  const {
    statistics,
    trends,
    loading,
    error,
    getExpenseStatistics,
    getExpenseTrends,
  } = useFinanceExpenses();

  return {
    statistics,
    trends,
    loading,
    error,
    getExpenseStatistics,
    getExpenseTrends,
  };
};

export const useExpenseApproval = () => {
  const { loading, error, approveExpense, rejectExpense } =
    useFinanceExpenses();

  return {
    loading,
    error,
    approveExpense,
    rejectExpense,
  };
};
