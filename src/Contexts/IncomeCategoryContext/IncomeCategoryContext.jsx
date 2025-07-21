import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Initial state
const initialState = {
  incomeCategories: [],
  currentIncomeCategory: null,
  categoryIncomes: [],
  categoryStatistics: null,
  categoryPerformance: null,
  recentIncomes: [],
  loading: false,
  error: null,
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 50,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false,
  },
  filters: {
    search: "",
    isActive: undefined,
    sortBy: "Name",
    sortAscending: true,
  },
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_INCOME_CATEGORIES: "SET_INCOME_CATEGORIES",
  SET_CURRENT_INCOME_CATEGORY: "SET_CURRENT_INCOME_CATEGORY",
  SET_CATEGORY_INCOMES: "SET_CATEGORY_INCOMES",
  SET_CATEGORY_STATISTICS: "SET_CATEGORY_STATISTICS",
  SET_CATEGORY_PERFORMANCE: "SET_CATEGORY_PERFORMANCE",
  SET_RECENT_INCOMES: "SET_RECENT_INCOMES",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  ADD_INCOME_CATEGORY: "ADD_INCOME_CATEGORY",
  UPDATE_INCOME_CATEGORY: "UPDATE_INCOME_CATEGORY",
  DELETE_INCOME_CATEGORY: "DELETE_INCOME_CATEGORY",
  TOGGLE_INCOME_CATEGORY_STATUS: "TOGGLE_INCOME_CATEGORY_STATUS",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_STATE: "RESET_STATE",
};

// Helper function to safely get categories array from different possible structures
const getSafeCategoriesArray = (state) => {
  if (state.incomeCategories?.Data) {
    if (Array.isArray(state.incomeCategories.Data)) {
      return state.incomeCategories.Data;
    } else if (
      state.incomeCategories.Data.$values &&
      Array.isArray(state.incomeCategories.Data.$values)
    ) {
      return state.incomeCategories.Data.$values;
    }
  } else if (state.incomeCategories?.data?.Data) {
    if (Array.isArray(state.incomeCategories.data.Data)) {
      return state.incomeCategories.data.Data;
    } else if (
      state.incomeCategories.data.Data.$values &&
      Array.isArray(state.incomeCategories.data.Data.$values)
    ) {
      return state.incomeCategories.data.Data.$values;
    }
  }
  return [];
};

// Helper function to update categories data while maintaining structure
const updateCategoriesData = (state, newCategoriesArray) => {
  const hasValuesStructure =
    state.incomeCategories?.Data?.$values ||
    state.incomeCategories?.data?.Data?.$values;

  return {
    ...state.incomeCategories,
    Data: hasValuesStructure
      ? { $values: newCategoriesArray }
      : newCategoriesArray,
  };
};

// Reducer
const incomeCategoryReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.SET_INCOME_CATEGORIES:
      return {
        ...state,
        incomeCategories: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CURRENT_INCOME_CATEGORY:
      return {
        ...state,
        currentIncomeCategory: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CATEGORY_INCOMES:
      return {
        ...state,
        categoryIncomes: action.payload,
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

    case actionTypes.SET_CATEGORY_PERFORMANCE:
      return {
        ...state,
        categoryPerformance: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_RECENT_INCOMES:
      return {
        ...state,
        recentIncomes: action.payload,
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

    case actionTypes.ADD_INCOME_CATEGORY:
      const currentCategories = getSafeCategoriesArray(state);
      const updatedCategoriesAdd = [...currentCategories, action.payload];
      return {
        ...state,
        incomeCategories: updateCategoriesData(state, updatedCategoriesAdd),
        loading: false,
        error: null,
      };

    case actionTypes.UPDATE_INCOME_CATEGORY:
      const currentCategoriesUpdate = getSafeCategoriesArray(state);
      const updatedCategoriesUpdate = currentCategoriesUpdate.map((category) =>
        category.Id === action.payload.Id ? action.payload : category
      );
      return {
        ...state,
        incomeCategories: updateCategoriesData(state, updatedCategoriesUpdate),
        currentIncomeCategory:
          state.currentIncomeCategory?.Id === action.payload.Id
            ? action.payload
            : state.currentIncomeCategory,
        loading: false,
        error: null,
      };

    case actionTypes.DELETE_INCOME_CATEGORY:
      const currentCategoriesDelete = getSafeCategoriesArray(state);
      const updatedCategoriesDelete = currentCategoriesDelete.filter(
        (category) => category.Id !== action.payload
      );
      return {
        ...state,
        incomeCategories: updateCategoriesData(state, updatedCategoriesDelete),
        currentIncomeCategory:
          state.currentIncomeCategory?.Id === action.payload
            ? null
            : state.currentIncomeCategory,
        loading: false,
        error: null,
      };

    case actionTypes.TOGGLE_INCOME_CATEGORY_STATUS:
      const currentCategoriesToggle = getSafeCategoriesArray(state);
      const updatedCategoriesToggle = currentCategoriesToggle.map((category) =>
        category.Id === action.payload.id
          ? { ...category, IsActive: action.payload.isActive }
          : category
      );
      return {
        ...state,
        incomeCategories: updateCategoriesData(state, updatedCategoriesToggle),
        currentIncomeCategory:
          state.currentIncomeCategory?.Id === action.payload.id
            ? {
                ...state.currentIncomeCategory,
                IsActive: action.payload.isActive,
              }
            : state.currentIncomeCategory,
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
const IncomeCategoryContext = createContext();

// API base URL
const API_BASE_URL = "https://api.speed-erp.com/api/IncomeCategories";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Helper function to prepare payload for API
const prepareApiPayload = (categoryData) => {
  // Only send the fields that the API expects
  return {
    Name: categoryData.Name || "",
    Description: categoryData.Description || "",
    Color: categoryData.Color || "#3498db",
    IsActive:
      categoryData.IsActive !== undefined ? categoryData.IsActive : true,
  };
};

// Helper function to make API calls with better error handling
const makeApiCall = async (url, options = {}) => {
  const token = getAuthToken();

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      accept: "text/plain",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    console.log("Making API call to:", url);
    console.log("Request options:", { ...defaultOptions, ...options });

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.Message || errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse the error response, use the default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("API call failed:", error);

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
export const IncomeCategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(incomeCategoryReducer, initialState);

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

  // Get income categories with pagination and filters
  const getIncomeCategories = useCallback(
    async (params = {}) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();

        // Helper function to safely add query parameters
        const addQueryParam = (key, value, fallbackValue) => {
          const finalValue = value !== undefined ? value : fallbackValue;
          if (
            finalValue !== null &&
            finalValue !== undefined &&
            finalValue !== ""
          ) {
            queryParams.append(key, finalValue);
          }
        };

        // Add parameters with proper null checking
        addQueryParam("page", params.page, state.pagination.CurrentPage);
        addQueryParam("pageSize", params.pageSize, state.pagination.PageSize);
        addQueryParam("search", params.search, state.filters.search);

        // Special handling for isActive
        const isActiveValue =
          params.isActive !== undefined
            ? params.isActive
            : state.filters.isActive;
        if (isActiveValue === true || isActiveValue === false) {
          queryParams.append("isActive", isActiveValue);
        }

        addQueryParam("sortBy", params.sortBy, state.filters.sortBy);

        // Special handling for sortAscending
        const sortAscendingValue =
          params.sortAscending !== undefined
            ? params.sortAscending
            : state.filters.sortAscending;
        if (sortAscendingValue === true || sortAscendingValue === false) {
          queryParams.append("sortAscending", sortAscendingValue);
        }

        console.log("API URL:", `${API_BASE_URL}?${queryParams}`);

        const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);

        // Debug: Log the complete response structure
        console.log("Complete API Response:", response);
        console.log("Response Success:", response.Success);
        console.log("Response Data:", response.data);

        if (response.Success) {
          // Try different possible data structures
          console.log("=== DEBUGGING DATA STRUCTURE ===");

          // Check if data exists
          if (response.data) {
            console.log("response.data exists:", response.data);

            // Check for Data property
            if (response.data.Data) {
              console.log("response.data.Data:", response.data.Data);

              // Check for $values
              if (response.data.Data.$values) {
                console.log(
                  "Received income categories (Data.$values):",
                  response.data.Data.$values
                );
              } else {
                console.log("No $values found in response.data.Data");
                // Maybe it's directly an array
                if (Array.isArray(response.data.Data)) {
                  console.log(
                    "response.data.Data is an array:",
                    response.data.Data
                  );
                }
              }
            } else {
              console.log("No Data property found in response.data");
              // Maybe data is directly the array
              if (response.data.$values) {
                console.log(
                  "Received income categories (data.$values):",
                  response.data.$values
                );
              } else if (Array.isArray(response.data)) {
                console.log(
                  "response.data is directly an array:",
                  response.data
                );
              }
            }
          } else {
            console.log("No data property found in response");
            // Check if response itself has $values
            if (response.$values) {
              console.log(
                "Received income categories (response.$values):",
                response.$values
              );
            }
          }

          console.log("=== END DEBUGGING ===");

          dispatch({
            type: actionTypes.SET_INCOME_CATEGORIES,
            payload: response,
          });

          if (response.Paginations) {
            dispatch({
              type: actionTypes.SET_PAGINATION,
              payload: response.Paginations,
            });
          }
        } else {
          console.log("API Response Success is false");
          throw new Error(
            response.Message || "Failed to fetch income categories"
          );
        }
      } catch (error) {
        console.error("Error in getIncomeCategories:", error);
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      } finally {
        // Make sure to set loading to false
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },
    [state.pagination.CurrentPage, state.pagination.PageSize, state.filters]
  );

  // Get single income category
  const getIncomeCategory = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`);

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CURRENT_INCOME_CATEGORY,
          payload: response.Data.Category,
        });
        if (response.Data.RecentIncomes) {
          dispatch({
            type: actionTypes.SET_RECENT_INCOMES,
            payload: response.Data.RecentIncomes,
          });
        }
        if (response.Data.Statistics) {
          dispatch({
            type: actionTypes.SET_CATEGORY_STATISTICS,
            payload: response.Data.Statistics,
          });
        }
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch income category");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Create income category
  const createIncomeCategory = useCallback(async (categoryData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      // Prepare the payload according to API specification
      const apiPayload = prepareApiPayload(categoryData);

      console.log("Creating income category with payload:", apiPayload);

      const response = await makeApiCall(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(apiPayload),
      });

      if (response.Success) {
        dispatch({
          type: actionTypes.ADD_INCOME_CATEGORY,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to create income category");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error; // Re-throw to handle in component
    }
  }, []);

  // Update income category
  const updateIncomeCategory = useCallback(async (id, categoryData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      // Prepare the payload according to API specification
      const apiPayload = prepareApiPayload(categoryData);

      console.log("Updating income category with payload:", apiPayload);

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(apiPayload),
      });

      if (response.Success) {
        dispatch({
          type: actionTypes.UPDATE_INCOME_CATEGORY,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to update income category");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error; // Re-throw to handle in component
    }
  }, []);

  // Delete income category
  const deleteIncomeCategory = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_INCOME_CATEGORY, payload: id });
        return true;
      } else {
        throw new Error(response.Message || "Failed to delete income category");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Toggle income category status
  const toggleIncomeCategoryStatus = useCallback(
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
          // Get the current category to determine new status
          const currentCategories = getSafeCategoriesArray(state);
          const currentCategory = currentCategories.find(
            (cat) => cat.Id === id
          );
          const newStatus = !currentCategory?.IsActive;

          dispatch({
            type: actionTypes.TOGGLE_INCOME_CATEGORY_STATUS,
            payload: { id, isActive: newStatus },
          });
          return true;
        } else {
          throw new Error(
            response.Message || "Failed to toggle income category status"
          );
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return false;
      }
    },
    [state]
  );

  // Get category statistics
  const getCategoryStatistics = useCallback(
    async (id, startDate = null, endDate = null) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);

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

  // Get category incomes
  const getCategoryIncomes = useCallback(async (id, params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.status) queryParams.append("status", params.status);

      const response = await makeApiCall(
        `${API_BASE_URL}/${id}/incomes?${queryParams}`
      );

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CATEGORY_INCOMES,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch category incomes");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Get category performance
  const getCategoryPerformance = useCallback(
    async (startDate = null, endDate = null) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);

        const response = await makeApiCall(
          `${API_BASE_URL}/performance?${queryParams}`
        );

        if (response.Success) {
          dispatch({
            type: actionTypes.SET_CATEGORY_PERFORMANCE,
            payload: response.Data,
          });
          return response.Data;
        } else {
          throw new Error(
            response.Message || "Failed to fetch category performance"
          );
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return null;
      }
    },
    []
  );

  // Search income categories
  const searchIncomeCategories = useCallback(
    async (searchTerm) => {
      const updatedFilters = { ...state.filters, search: searchTerm };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getIncomeCategories({ search: searchTerm, page: 1 });
    },
    [state.filters, getIncomeCategories]
  );

  // Filter income categories by status
  const filterIncomeCategoriesByStatus = useCallback(
    async (isActive) => {
      const updatedFilters = { ...state.filters, isActive };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getIncomeCategories({ isActive, page: 1 });
    },
    [state.filters, getIncomeCategories]
  );

  // Sort income categories
  const sortIncomeCategories = useCallback(
    async (sortBy, sortAscending = true) => {
      const updatedFilters = { ...state.filters, sortBy, sortAscending };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getIncomeCategories({ sortBy, sortAscending, page: 1 });
    },
    [state.filters, getIncomeCategories]
  );

  // Change page
  const changePage = useCallback(
    async (page) => {
      const updatedPagination = { ...state.pagination, CurrentPage: page };
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: updatedPagination,
      });
      await getIncomeCategories({ page });
    },
    [state.pagination, state.filters, getIncomeCategories]
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
      await getIncomeCategories({ pageSize, page: 1 });
    },
    [state.pagination, state.filters, getIncomeCategories]
  );

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Get active income categories (helper function)
  const getActiveIncomeCategories = useCallback(() => {
    const categories = getSafeCategoriesArray(state);
    return categories.filter((category) => category.IsActive);
  }, [state.incomeCategories]);

  // Get income categories dropdown (helper function)
  const getIncomeCategoriesDropdown = useCallback(() => {
    const categories = getSafeCategoriesArray(state);
    return categories
      .filter((category) => category.IsActive)
      .map((category) => ({
        Id: category.Id,
        Name: category.Name,
        Color: category.Color,
      }));
  }, [state.incomeCategories]);

  // Get category by ID (helper function)
  const getCategoryById = useCallback(
    (id) => {
      const categories = getSafeCategoriesArray(state);
      return categories.find((category) => category.Id === id) || null;
    },
    [state.incomeCategories]
  );

  // Context value
  const value = {
    // State
    incomeCategories: state.incomeCategories,
    currentIncomeCategory: state.currentIncomeCategory,
    categoryIncomes: state.categoryIncomes,
    categoryStatistics: state.categoryStatistics,
    categoryPerformance: state.categoryPerformance,
    recentIncomes: state.recentIncomes,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,

    // Actions
    getIncomeCategories,
    getIncomeCategory,
    createIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
    toggleIncomeCategoryStatus,
    getCategoryStatistics,
    getCategoryIncomes,
    getCategoryPerformance,
    searchIncomeCategories,
    filterIncomeCategoriesByStatus,
    sortIncomeCategories,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState,

    // Helper functions
    getActiveIncomeCategories,
    getIncomeCategoriesDropdown,
    getCategoryById,
  };

  return (
    <IncomeCategoryContext.Provider value={value}>
      {children}
    </IncomeCategoryContext.Provider>
  );
};

// Custom hook to use the income category context
export const useIncomeCategory = () => {
  const context = useContext(IncomeCategoryContext);
  if (!context) {
    throw new Error(
      "useIncomeCategory must be used within an IncomeCategoryProvider"
    );
  }
  return context;
};

// Export context for direct access if needed
export { IncomeCategoryContext };
