import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Initial state
const initialState = {
  expenseCategories: {
    Data: [],
    Paginations: {
      CurrentPage: 1,
      PageNumber: 1,
      PageSize: 50,
      TotalItems: 0,
      TotalPages: 0,
      HasPreviousPage: false,
      HasNextPage: false,
    },
  },
  currentExpenseCategory: null,
  categoryExpenses: [],
  categoryStatistics: null,
  recentExpenses: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    isActive: null,
    sortBy: "Name",
    sortAscending: true,
  },
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_EXPENSE_CATEGORIES: "SET_EXPENSE_CATEGORIES",
  SET_CURRENT_EXPENSE_CATEGORY: "SET_CURRENT_EXPENSE_CATEGORY",
  SET_CATEGORY_EXPENSES: "SET_CATEGORY_EXPENSES",
  SET_CATEGORY_STATISTICS: "SET_CATEGORY_STATISTICS",
  SET_RECENT_EXPENSES: "SET_RECENT_EXPENSES",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  ADD_EXPENSE_CATEGORY: "ADD_EXPENSE_CATEGORY",
  UPDATE_EXPENSE_CATEGORY: "UPDATE_EXPENSE_CATEGORY",
  DELETE_EXPENSE_CATEGORY: "DELETE_EXPENSE_CATEGORY",
  TOGGLE_EXPENSE_CATEGORY_STATUS: "TOGGLE_EXPENSE_CATEGORY_STATUS",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_STATE: "RESET_STATE",
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
        error: null,
      };

    case actionTypes.SET_CURRENT_EXPENSE_CATEGORY:
      return {
        ...state,
        currentExpenseCategory: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CATEGORY_EXPENSES:
      return {
        ...state,
        categoryExpenses: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CATEGORY_STATISTICS:
      return {
        ...state,
        categoryStatistics: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_RECENT_EXPENSES:
      return {
        ...state,
        recentExpenses: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_PAGINATION:
      return {
        ...state,
        expenseCategories: {
          ...state.expenseCategories,
          Paginations: {
            ...state.expenseCategories.Paginations,
            ...action.payload,
          },
        },
      };

    case actionTypes.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case actionTypes.ADD_EXPENSE_CATEGORY:
      return {
        ...state,
        expenseCategories: {
          ...state.expenseCategories,
          Data: [...state.expenseCategories.Data.$values, action.payload],
        },
        loading: false,
        error: null,
      };

    case actionTypes.UPDATE_EXPENSE_CATEGORY:
      return {
        ...state,
        expenseCategories: {
          ...state.expenseCategories,
          Data: state.expenseCategories.Data.map((category) =>
            category.Id === action.payload.Id ? action.payload : category
          ),
        },
        currentExpenseCategory:
          state.currentExpenseCategory?.Id === action.payload.Id
            ? action.payload
            : state.currentExpenseCategory,
        loading: false,
        error: null,
      };

    case actionTypes.DELETE_EXPENSE_CATEGORY:
      return {
        ...state,
        expenseCategories: {
          ...state.expenseCategories,
          Data: state.expenseCategories.Data.filter(
            (category) => category.Id !== action.payload
          ),
        },
        currentExpenseCategory:
          state.currentExpenseCategory?.Id === action.payload
            ? null
            : state.currentExpenseCategory,
        loading: false,
        error: null,
      };

    case actionTypes.TOGGLE_EXPENSE_CATEGORY_STATUS:
      return {
        ...state,
        expenseCategories: {
          ...state.expenseCategories,
          Data: state.expenseCategories.Data.map((category) =>
            category.Id === action.payload.id
              ? { ...category, IsActive: action.payload.isActive }
              : category
          ),
        },
        currentExpenseCategory:
          state.currentExpenseCategory?.Id === action.payload.id
            ? {
                ...state.currentExpenseCategory,
                IsActive: action.payload.isActive,
              }
            : state.currentExpenseCategory,
        loading: false,
        error: null,
      };

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
const API_BASE_URL = "https://api.speed-erp.com/api/ExpenseCategories";

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
    console.log("Making API call to:", url, options); // Debug log
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
    console.error("API call failed:", error);
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
  const getExpenseCategories = useCallback(
    async (params = {}) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();

        // Add parameters with proper naming (PascalCase as per your API)
        if (params.page || state.expenseCategories.Paginations.CurrentPage) {
          queryParams.append(
            "Page",
            params.page || state.expenseCategories.Paginations.CurrentPage
          );
        }
        if (params.pageSize || state.expenseCategories.Paginations.PageSize) {
          queryParams.append(
            "PageSize",
            params.pageSize || state.expenseCategories.Paginations.PageSize
          );
        }
        if (params.search || state.filters.search) {
          queryParams.append("Search", params.search || state.filters.search);
        }
        // if (params.isActive !== undefined || state.filters.isActive !== undefined) {
        //   queryParams.append('IsActive', params.isActive !== undefined ? params.isActive : state.filters.isActive);
        // }
        if (params.sortBy || state.filters.sortBy) {
          queryParams.append("SortBy", params.sortBy || state.filters.sortBy);
        }
        if (
          params.sortAscending !== undefined ||
          state.filters.sortAscending !== undefined
        ) {
          queryParams.append(
            "SortAscending",
            params.sortAscending !== undefined
              ? params.sortAscending
              : state.filters.sortAscending
          );
        }

        const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);

        if (response.Success) {
          dispatch({
            type: actionTypes.SET_EXPENSE_CATEGORIES,
            payload: {
              Data: response.Data || [],
              Paginations: response.Paginations || {
                CurrentPage: 1,
                PageSize: 10,
                TotalItems: 0,
                TotalPages: 0,
              },
            },
          });
        } else {
          throw new Error(
            response.Message || "Failed to fetch expense categories"
          );
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      }
    },
    [state.expenseCategories.Paginations, state.filters]
  );

  // Get single expense category
  const getExpenseCategory = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`);

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CURRENT_EXPENSE_CATEGORY,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch expense category");
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

      // Send only the 4 required fields (PascalCase)
      const payload = {
        Name: categoryData.name,
        Description: categoryData.description,
        Color: categoryData.color,
        IsActive: categoryData.isActive
      };

      const response = await makeApiCall(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.Success) {
        dispatch({
          type: actionTypes.ADD_EXPENSE_CATEGORY,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(
          response.Message || "Failed to create expense category"
        );
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

      // Send only the 4 required fields (PascalCase)
      const payload = {
        Name: categoryData.name,
        Description: categoryData.description,
        Color: categoryData.color,
        IsActive: categoryData.isActive
      };

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response.Success) {
        dispatch({
          type: actionTypes.UPDATE_EXPENSE_CATEGORY,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(
          response.Message || "Failed to update expense category"
        );
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
        method: "DELETE",
      });

      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_EXPENSE_CATEGORY, payload: id });
        return true;
      } else {
        throw new Error(
          response.Message || "Failed to delete expense category"
        );
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

      const response = await makeApiCall(
        `${API_BASE_URL}/${id}/toggle-status`,
        {
          method: "PATCH",
        }
      );

      if (response.Success) {
        dispatch({
          type: actionTypes.TOGGLE_EXPENSE_CATEGORY_STATUS,
          payload: {
            id,
            isActive: response.Data.IsActive,
          },
        });
        return true;
      } else {
        throw new Error(
          response.Message || "Failed to toggle expense category status"
        );
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Get category statistics
  const getCategoryStatistics = useCallback(
    async (id, startDate = null, endDate = null) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("StartDate", startDate);
        if (endDate) queryParams.append("EndDate", endDate);

        const response = await makeApiCall(
          `${API_BASE_URL}/${id}/statistics?${queryParams}`
        );

        if (response.Success) {
          dispatch({
            type: actionTypes.SET_CATEGORY_STATISTICS,
            payload: response.Data,
          });
          return response.Data;
        } else {
          throw new Error(
            response.Message || "Failed to fetch category statistics"
          );
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return null;
      }
    },
    []
  );

  // Get category expenses
  const getCategoryExpenses = useCallback(async (id, params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("Page", params.page);
      if (params.pageSize) queryParams.append("PageSize", params.pageSize);
      if (params.startDate) queryParams.append("StartDate", params.startDate);
      if (params.endDate) queryParams.append("EndDate", params.endDate);
      if (params.status) queryParams.append("Status", params.status);

      const response = await makeApiCall(
        `${API_BASE_URL}/${id}/expenses?${queryParams}`
      );

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CATEGORY_EXPENSES,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(
          response.Message || "Failed to fetch category expenses"
        );
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Search expense categories
  const searchExpenseCategories = useCallback(
    async (searchTerm) => {
      const updatedFilters = { ...state.filters, search: searchTerm };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getExpenseCategories({ search: searchTerm, page: 1 });
    },
    [state.filters, getExpenseCategories]
  );

  // Filter expense categories by status
  const filterExpenseCategoriesByStatus = useCallback(
    async (isActive) => {
      const updatedFilters = { ...state.filters, isActive };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getExpenseCategories({ isActive, page: 1 });
    },
    [state.filters, getExpenseCategories]
  );

  // Sort expense categories
  const sortExpenseCategories = useCallback(
    async (sortBy, sortAscending = true) => {
      const updatedFilters = { ...state.filters, sortBy, sortAscending };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getExpenseCategories({ sortBy, sortAscending, page: 1 });
    },
    [state.filters, getExpenseCategories]
  );

  // Change page
  const changePage = useCallback(
    async (page) => {
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: { CurrentPage: page },
      });
      await getExpenseCategories({ page });
    },
    [getExpenseCategories]
  );

  // Change page size
  const changePageSize = useCallback(
    async (pageSize) => {
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: { PageSize: pageSize, CurrentPage: 1 },
      });
      await getExpenseCategories({ pageSize, page: 1 });
    },
    [getExpenseCategories]
  );

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Get active expense categories (helper function)
  const getActiveExpenseCategories = useCallback(() => {
    return (
      state.expenseCategories.Data.filter((category) => category.IsActive) || []
    );
  }, [state.expenseCategories]);

  // Context value
  const value = {
    // State
    expenseCategories: state.expenseCategories.Data,
    currentExpenseCategory: state.currentExpenseCategory,
    categoryExpenses: state.categoryExpenses,
    categoryStatistics: state.categoryStatistics,
    recentExpenses: state.recentExpenses,
    loading: state.loading,
    error: state.error,
    pagination: state.expenseCategories.Paginations,
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
    throw new Error(
      "useExpenseCategory must be used within an ExpenseCategoryProvider"
    );
  }
  return context;
};

export { ExpenseCategoryContext };