import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Initial state
const initialState = {
  bankAccounts: [],
  currentBankAccount: null,
  bankAccountTransactions: [],
  balanceHistory: null,
  recentTransactions: [],
  loading: false,
  error: null,
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false,
  },
  filters: {
    search: "",
    accountType: "",
    currency: "",
    isActive: null,
    sortBy: "BankName",
    sortAscending: true,
  },
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_BANK_ACCOUNTS: "SET_BANK_ACCOUNTS",
  SET_CURRENT_BANK_ACCOUNT: "SET_CURRENT_BANK_ACCOUNT",
  SET_BANK_ACCOUNT_TRANSACTIONS: "SET_BANK_ACCOUNT_TRANSACTIONS",
  SET_BALANCE_HISTORY: "SET_BALANCE_HISTORY",
  SET_RECENT_TRANSACTIONS: "SET_RECENT_TRANSACTIONS",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  ADD_BANK_ACCOUNT: "ADD_BANK_ACCOUNT",
  UPDATE_BANK_ACCOUNT: "UPDATE_BANK_ACCOUNT",
  DELETE_BANK_ACCOUNT: "DELETE_BANK_ACCOUNT",
  TOGGLE_BANK_ACCOUNT_STATUS: "TOGGLE_BANK_ACCOUNT_STATUS",
  SET_DEFAULT_BANK_ACCOUNT: "SET_DEFAULT_BANK_ACCOUNT",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_STATE: "RESET_STATE",
};

// Reducer
const bankAccountReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.SET_BANK_ACCOUNTS:
      return {
        ...state,
        bankAccounts: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CURRENT_BANK_ACCOUNT:
      return {
        ...state,
        currentBankAccount: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_BANK_ACCOUNT_TRANSACTIONS:
      return {
        ...state,
        bankAccountTransactions: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_BALANCE_HISTORY:
      return {
        ...state,
        balanceHistory: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_RECENT_TRANSACTIONS:
      return {
        ...state,
        recentTransactions: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case actionTypes.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case actionTypes.ADD_BANK_ACCOUNT: {
      // Handle adding bank account to the nested structure
      const currentBankAccounts = state.bankAccounts?.Data || [];
      const updatedBankAccountsAdd = [...currentBankAccounts, action.payload];
      return {
        ...state,
        bankAccounts: {
          ...state.bankAccounts,
          Data: updatedBankAccountsAdd,
        },
        loading: false,
        error: null,
      };
    }

    case actionTypes.UPDATE_BANK_ACCOUNT: {
      // Handle updating bank account in the nested structure
      const currentBankAccountsUpdate = state.bankAccounts?.Data || [];
      const updatedBankAccountsUpdate = currentBankAccountsUpdate.map(
        (account) =>
          account.Id === action.payload.Id ? action.payload : account
      );
      return {
        ...state,
        bankAccounts: {
          ...state.bankAccounts,
          Data: updatedBankAccountsUpdate,
        },
        currentBankAccount:
          state.currentBankAccount?.Id === action.payload.Id
            ? action.payload
            : state.currentBankAccount,
        loading: false,
        error: null,
      };
    }

    case actionTypes.DELETE_BANK_ACCOUNT: {
      // Handle deleting bank account from the nested structure
      const currentBankAccountsDelete = state.bankAccounts?.Data || [];
      const updatedBankAccountsDelete = currentBankAccountsDelete.filter(
        (account) => account.Id !== action.payload
      );
      return {
        ...state,
        bankAccounts: {
          ...state.bankAccounts,
          Data: updatedBankAccountsDelete,
        },
        currentBankAccount:
          state.currentBankAccount?.Id === action.payload
            ? null
            : state.currentBankAccount,
        loading: false,
        error: null,
      };
    }

    case actionTypes.TOGGLE_BANK_ACCOUNT_STATUS: {
      // Handle toggling bank account status
      const currentBankAccountsToggle = state.bankAccounts?.Data || [];
      const updatedBankAccountsToggle = currentBankAccountsToggle.map(
        (account) =>
          account.Id === action.payload.id
            ? { ...account, IsActive: action.payload.isActive }
            : account
      );
      return {
        ...state,
        bankAccounts: {
          ...state.bankAccounts,
          Data: updatedBankAccountsToggle,
        },
        currentBankAccount:
          state.currentBankAccount?.Id === action.payload.id
            ? { ...state.currentBankAccount, IsActive: action.payload.isActive }
            : state.currentBankAccount,
        loading: false,
        error: null,
      };
    }

    case actionTypes.SET_DEFAULT_BANK_ACCOUNT: {
      // Handle setting default bank account
      const currentBankAccountsDefault = state.bankAccounts?.Data || [];
      const updatedBankAccountsDefault = currentBankAccountsDefault.map(
        (account) => ({
          ...account,
          IsDefault: account.Id === action.payload,
        })
      );
      return {
        ...state,
        bankAccounts: {
          ...state.bankAccounts,
          Data: updatedBankAccountsDefault,
        },
        currentBankAccount:
          state.currentBankAccount?.Id === action.payload
            ? { ...state.currentBankAccount, IsDefault: true }
            : state.currentBankAccount,
        loading: false,
        error: null,
      };
    }

    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    case actionTypes.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Create context
const BankAccountContext = createContext();

// API base URL - Update this with your correct API URL
const API_BASE_URL = "https://api.speed-erp.com/api/BankAccounts";

// Alternative API URLs to try if the main one doesn't work
// const API_BASE_URL = 'http://localhost:5000/api/BankAccounts';
// const API_BASE_URL = 'https://speed-erp-api.herokuapp.com/api/BankAccounts';
// const API_BASE_URL = 'https://your-actual-domain.com/api/BankAccounts';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Helper function to make API calls with better error handling
const makeApiCall = async (url, options = {}) => {
  const token = getAuthToken();

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    console.log("Making API call to:", url); // Debug log
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.Message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("API response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("API call failed:", error); // Debug log

    // Handle specific network errors
    if (error.message.includes("ERR_NAME_NOT_RESOLVED")) {
      throw new Error(
        "Cannot connect to API server. Please check your internet connection or contact administrator."
      );
    }
    if (error.message.includes("ERR_NETWORK")) {
      throw new Error("Network error. Please check your internet connection.");
    }
    if (error.message.includes("ERR_CONNECTION_REFUSED")) {
      throw new Error("Connection refused. The API server might be down.");
    }

    throw error;
  }
};

// Context Provider
export const BankAccountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bankAccountReducer, initialState);

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

  // Get bank accounts with pagination and filters (removed isActive query)
  const getBankAccounts = useCallback(
    async (params = {}) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();

        // Only add non-empty parameters
        if (params.page || state.pagination.CurrentPage) {
          queryParams.append(
            "page",
            params.page || state.pagination.CurrentPage
          );
        }
        if (params.pageSize || state.pagination.PageSize) {
          queryParams.append(
            "pageSize",
            params.pageSize || state.pagination.PageSize
          );
        }
        if (params.search || state.filters.search) {
          queryParams.append("search", params.search || state.filters.search);
        }
        if (params.accountType || state.filters.accountType) {
          queryParams.append(
            "accountType",
            params.accountType || state.filters.accountType
          );
        }
        if (params.currency || state.filters.currency) {
          queryParams.append(
            "currency",
            params.currency || state.filters.currency
          );
        }
        // Removed isActive parameter completely
        if (params.sortBy || state.filters.sortBy) {
          queryParams.append("sortBy", params.sortBy || state.filters.sortBy);
        }
        if (
          params.sortAscending !== undefined ||
          state.filters.sortAscending !== undefined
        ) {
          queryParams.append(
            "sortAscending",
            params.sortAscending !== undefined
              ? params.sortAscending
              : state.filters.sortAscending
          );
        }

        const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);

        if (response.Success) {
          // Store the complete response to maintain the API structure
          dispatch({
            type: actionTypes.SET_BANK_ACCOUNTS,
            payload: response.Data.$values,
          });
          if (response.Paginations) {
            dispatch({
              type: actionTypes.SET_PAGINATION,
              payload: response.Paginations,
            });
          }
        } else {
          throw new Error(response.Message || "Failed to fetch bank accounts");
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      }
    },
    [state.pagination.CurrentPage, state.pagination.PageSize, state.filters]
  );

  // Get single bank account
  const getBankAccount = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`);

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CURRENT_BANK_ACCOUNT,
          payload: response.Data.BankAccount,
        });
        if (response.Data.RecentTransactions) {
          dispatch({
            type: actionTypes.SET_RECENT_TRANSACTIONS,
            payload: response.Data.RecentTransactions,
          });
        }
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch bank account");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Create bank account
  const createBankAccount = useCallback(async (bankAccountData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(bankAccountData),
      });

      if (response.Success) {
        dispatch({
          type: actionTypes.ADD_BANK_ACCOUNT,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to create bank account");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Update bank account
  const updateBankAccount = useCallback(async (id, bankAccountData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(bankAccountData),
      });

      if (response.Success) {
        dispatch({
          type: actionTypes.UPDATE_BANK_ACCOUNT,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to update bank account");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Delete bank account
  const deleteBankAccount = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_BANK_ACCOUNT, payload: id });
        return true;
      } else {
        throw new Error(response.Message || "Failed to delete bank account");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Set default bank account
  const setDefaultBankAccount = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}/set-default`, {
        method: "POST",
      });

      if (response.Success) {
        dispatch({ type: actionTypes.SET_DEFAULT_BANK_ACCOUNT, payload: id });
        return true;
      } else {
        throw new Error(
          response.Message || "Failed to set default bank account"
        );
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Toggle bank account status
  const toggleBankAccountStatus = useCallback(
    async (id) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const response = await makeApiCall(
          `${API_BASE_URL}/${id}/toggle-status`,
          {
            method: "POST",
          }
        );

        if (response.Success) {
          // Get the current account to determine new status
          const currentAccount = state.bankAccounts?.Data?.find(
            (acc) => acc.Id === id
          );
          const newStatus = !currentAccount?.IsActive;

          dispatch({
            type: actionTypes.TOGGLE_BANK_ACCOUNT_STATUS,
            payload: { id, isActive: newStatus },
          });
          return true;
        } else {
          throw new Error(
            response.Message || "Failed to toggle bank account status"
          );
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return false;
      }
    },
    [state.bankAccounts]
  );

  // Get bank account balance history
  const getBalanceHistory = useCallback(
    async (id, startDate = null, endDate = null) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);

        const response = await makeApiCall(
          `${API_BASE_URL}/${id}/balance-history?${queryParams}`
        );

        if (response.Success) {
          dispatch({
            type: actionTypes.SET_BALANCE_HISTORY,
            payload: response.Data,
          });
          return response.Data;
        } else {
          throw new Error(
            response.Message || "Failed to fetch balance history"
          );
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return null;
      }
    },
    []
  );

  // Get bank account transactions
  const getBankAccountTransactions = useCallback(async (id, params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.type) queryParams.append("type", params.type);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);

      const response = await makeApiCall(
        `${API_BASE_URL}/${id}/transactions?${queryParams}`
      );

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_BANK_ACCOUNT_TRANSACTIONS,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(
          response.Message || "Failed to fetch bank account transactions"
        );
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Search bank accounts
  const searchBankAccounts = useCallback(
    async (searchTerm) => {
      const updatedFilters = { ...state.filters, search: searchTerm };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getBankAccounts({ search: searchTerm, page: 1 });
    },
    [state.filters, getBankAccounts]
  );

  // Filter bank accounts by account type
  const filterBankAccountsByType = useCallback(
    async (accountType) => {
      const updatedFilters = { ...state.filters, accountType };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getBankAccounts({ accountType, page: 1 });
    },
    [state.filters, getBankAccounts]
  );

  // Filter bank accounts by currency
  const filterBankAccountsByCurrency = useCallback(
    async (currency) => {
      const updatedFilters = { ...state.filters, currency };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getBankAccounts({ currency, page: 1 });
    },
    [state.filters, getBankAccounts]
  );

  // Filter bank accounts by status (kept for backward compatibility but doesn't affect API query)
  const filterBankAccountsByStatus = useCallback(
    async (isActive) => {
      const updatedFilters = { ...state.filters, isActive };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getBankAccounts({ page: 1 });
    },
    [state.filters, getBankAccounts]
  );

  // Sort bank accounts
  const sortBankAccounts = useCallback(
    async (sortBy, sortAscending = true) => {
      const updatedFilters = { ...state.filters, sortBy, sortAscending };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getBankAccounts({ sortBy, sortAscending, page: 1 });
    },
    [state.filters, getBankAccounts]
  );

  // Change page
  const changePage = useCallback(
    async (page) => {
      const updatedPagination = { ...state.pagination, CurrentPage: page };
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: updatedPagination,
      });
      await getBankAccounts({ page });
    },
    [state.pagination, state.filters, getBankAccounts]
  );

  // Change page size
  const changePageSize = useCallback(
    async (pageSize) => {
      const updatedPagination = {
        ...state.pagination,
        PageSize: pageSize,
        CurrentPage: 1,
      };
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: updatedPagination,
      });
      await getBankAccounts({ pageSize, page: 1 });
    },
    [state.pagination, state.filters, getBankAccounts]
  );

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Get active bank accounts (helper function)
  const getActiveBankAccounts = useCallback(() => {
    return state.bankAccounts?.filter((account) => account.IsActive) || [];
  }, [state.bankAccounts]);

  // Get default bank account (helper function)
  const getDefaultBankAccount = useCallback(() => {
    return state.bankAccounts?.find((account) => account.IsDefault) || null;
  }, [state.bankAccounts]);

  // Context value
  const value = {
    // State
    bankAccounts: state.bankAccounts,
    currentBankAccount: state.currentBankAccount,
    bankAccountTransactions: state.bankAccountTransactions,
    balanceHistory: state.balanceHistory,
    recentTransactions: state.recentTransactions,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,

    // Actions
    getBankAccounts,
    getBankAccount,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setDefaultBankAccount,
    toggleBankAccountStatus,
    getBalanceHistory,
    getBankAccountTransactions,
    searchBankAccounts,
    filterBankAccountsByType,
    filterBankAccountsByCurrency,
    filterBankAccountsByStatus,
    sortBankAccounts,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState,

    // Helper functions
    getActiveBankAccounts,
    getDefaultBankAccount,
  };

  return (
    <BankAccountContext.Provider value={value}>
      {children}
    </BankAccountContext.Provider>
  );
};

// Custom hook to use the bank account context
export const useBankAccount = () => {
  const context = useContext(BankAccountContext);
  if (!context) {
    throw new Error("useBankAccount must be used within a BankAccountProvider");
  }
  return context;
};

// Export context for direct access if needed
export { BankAccountContext };
