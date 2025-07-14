import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Initial state
const initialState = {
  requisitions: {
    Data: [],
    Success: false,
    Message: null,
  },
  currentRequisition: null,
  loading: false,
  error: null,
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 10,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false,
  },
  filters: {
    searchTerm: "",
    type: "",
    sortBy: "CreatedAt",
    sortAscending: false,
  },
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_REQUISITIONS: "SET_REQUISITIONS",
  SET_CURRENT_REQUISITION: "SET_CURRENT_REQUISITION",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  ADD_REQUISITION: "ADD_REQUISITION",
  UPDATE_REQUISITION: "UPDATE_REQUISITION",
  DELETE_REQUISITION: "DELETE_REQUISITION",
  ADD_ITEM: "ADD_ITEM",
  ADD_ATTACHMENTS: "ADD_ATTACHMENTS",
  DELETE_ATTACHMENT: "DELETE_ATTACHMENT",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_STATE: "RESET_STATE",
};

// Reducer
const requisitionReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.SET_REQUISITIONS:
      return {
        ...state,
        requisitions: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CURRENT_REQUISITION:
      return {
        ...state,
        currentRequisition: action.payload,
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

    case actionTypes.ADD_REQUISITION:
      // Ensure we have a proper array structure
      const currentRequisitionsAdd = Array.isArray(state.requisitions?.Data)
        ? state.requisitions.Data
        : [];

      const updatedRequisitionsAdd = [
        ...currentRequisitionsAdd,
        action.payload,
      ];

      return {
        ...state,
        requisitions: {
          ...state.requisitions,
          Data: updatedRequisitionsAdd,
        },
        loading: false,
        error: null,
      };

    case actionTypes.UPDATE_REQUISITION:
      // Ensure we have a proper array structure
      const currentRequisitionsUpdate = Array.isArray(state.requisitions?.Data)
        ? state.requisitions.Data
        : [];

      const updatedRequisitionsUpdate = currentRequisitionsUpdate.map(
        (requisition) =>
          requisition.Id === action.payload.Id ? action.payload : requisition
      );

      return {
        ...state,
        requisitions: {
          ...state.requisitions,
          Data: updatedRequisitionsUpdate,
        },
        currentRequisition:
          state.currentRequisition?.Id === action.payload.Id
            ? action.payload
            : state.currentRequisition,
        loading: false,
        error: null,
      };

    case actionTypes.DELETE_REQUISITION:
      // Ensure we have a proper array structure
      const currentRequisitionsDelete = Array.isArray(state.requisitions?.Data)
        ? state.requisitions.Data
        : [];

      const updatedRequisitionsDelete = currentRequisitionsDelete.filter(
        (requisition) => requisition.Id !== action.payload
      );

      return {
        ...state,
        requisitions: {
          ...state.requisitions,
          Data: updatedRequisitionsDelete,
        },
        currentRequisition:
          state.currentRequisition?.Id === action.payload
            ? null
            : state.currentRequisition,
        loading: false,
        error: null,
      };

    case actionTypes.ADD_ITEM:
      return {
        ...state,
        currentRequisition: state.currentRequisition
          ? {
              ...state.currentRequisition,
              Items: [
                ...(state.currentRequisition.Items || []),
                action.payload,
              ],
            }
          : state.currentRequisition,
        loading: false,
        error: null,
      };

    case actionTypes.ADD_ATTACHMENTS:
      return {
        ...state,
        currentRequisition: state.currentRequisition
          ? {
              ...state.currentRequisition,
              Attachments: [
                ...(state.currentRequisition.Attachments || []),
                ...action.payload,
              ],
            }
          : state.currentRequisition,
        loading: false,
        error: null,
      };

    case actionTypes.DELETE_ATTACHMENT:
      return {
        ...state,
        currentRequisition: state.currentRequisition
          ? {
              ...state.currentRequisition,
              Attachments: (state.currentRequisition.Attachments || []).filter(
                (attachment) => attachment.Id !== action.payload
              ),
            }
          : state.currentRequisition,
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
const RequisitionContext = createContext();

// API base URL
const API_BASE_URL = "https://api.speed-erp.com/api/Requisition";

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

// Helper function for file uploads
const makeFileUploadCall = async (url, formData) => {
  const token = getAuthToken();

  try {
    console.log("Making file upload call to:", url);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.Message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("File upload response:", data);
    return data;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

// Context Provider
export const RequisitionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(requisitionReducer, initialState);

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

  // Get requisitions with pagination and filters
  const getRequisitions = useCallback(
    async (params = {}) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const queryParams = new URLSearchParams();

        // Add pagination parameters
        if (params.page || state.pagination.PageNumber) {
          queryParams.append(
            "page",
            params.page || state.pagination.PageNumber
          );
        }
        if (params.pageSize || state.pagination.PageSize) {
          queryParams.append(
            "pageSize",
            params.pageSize || state.pagination.PageSize
          );
        }

        // Add filter parameters
        if (params.searchTerm || state.filters.searchTerm) {
          queryParams.append(
            "searchTerm",
            params.searchTerm || state.filters.searchTerm
          );
        }
        if (params.type || state.filters.type) {
          queryParams.append("type", params.type || state.filters.type);
        }
        if (params.sortBy || state.filters.sortBy) {
          queryParams.append("sortBy", params.sortBy || state.filters.sortBy);
        }
        if (
          params.sortAscending !== undefined ||
          state.filters.sortAscending !== undefined
        ) {
          queryParams.append(
            "sortAscending",
            params.sortAscending ?? state.filters.sortAscending
          );
        }

        const response = await makeApiCall(`${API_BASE_URL}?${queryParams}`);

        if (response.Success) {
          // Store the complete response to maintain the API structure
          dispatch({ type: actionTypes.SET_REQUISITIONS, payload: response });

          // Handle pagination from response
          if (response.Pagination) {
            dispatch({
              type: actionTypes.SET_PAGINATION,
              payload: {
                CurrentPage: response.Pagination.PageNumber,
                PageNumber: response.Pagination.PageNumber,
                PageSize: response.Pagination.PageSize,
                TotalItems: response.Pagination.TotalItems,
                TotalPages: response.Pagination.TotalPages,
                HasPreviousPage: response.Pagination.PageNumber > 1,
                HasNextPage:
                  response.Pagination.PageNumber <
                  response.Pagination.TotalPages,
              },
            });
          } else {
            // Calculate pagination from data if no pagination info from API
            const requisitionsData = Array.isArray(response.Data)
              ? response.Data
              : [];
            const currentPage = params.page || state.pagination.PageNumber || 1;
            const pageSize = params.pageSize || state.pagination.PageSize || 10;

            dispatch({
              type: actionTypes.SET_PAGINATION,
              payload: {
                CurrentPage: currentPage,
                PageNumber: currentPage,
                PageSize: pageSize,
                TotalItems: requisitionsData.length,
                TotalPages: Math.ceil(requisitionsData.length / pageSize),
                HasPreviousPage: currentPage > 1,
                HasNextPage:
                  currentPage < Math.ceil(requisitionsData.length / pageSize),
              },
            });
          }
        } else {
          throw new Error(response.Message || "Failed to fetch requisitions");
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      }
    },
    [state.pagination.PageNumber, state.pagination.PageSize, state.filters]
  );

  // Get single requisition
  const getRequisition = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`);

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CURRENT_REQUISITION,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch requisition");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Create requisition
  const createRequisition = useCallback(async (requisitionData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(requisitionData),
      });

      if (response.Success) {
        dispatch({ type: actionTypes.ADD_REQUISITION, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to create requisition");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Update requisition
  const updateRequisition = useCallback(async (id, requisitionData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(requisitionData),
      });

      if (response.Success) {
        dispatch({
          type: actionTypes.UPDATE_REQUISITION,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to update requisition");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Delete requisition
  const deleteRequisition = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_REQUISITION, payload: id });
        return true;
      } else {
        throw new Error(response.Message || "Failed to delete requisition");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Add item to requisition
  const addItemToRequisition = useCallback(async (requisitionId, itemData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(
        `${API_BASE_URL}/${requisitionId}/items`,
        {
          method: "POST",
          body: JSON.stringify(itemData),
        }
      );

      if (response.Success) {
        dispatch({ type: actionTypes.ADD_ITEM, payload: itemData });
        return true;
      } else {
        throw new Error(response.Message || "Failed to add item");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Upload attachments
  const uploadAttachments = useCallback(async (requisitionId, files) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await makeFileUploadCall(
        `${API_BASE_URL}/${requisitionId}/attachments`,
        formData
      );

      if (response.Success && response.Data?.UploadedAttachments) {
        dispatch({
          type: actionTypes.ADD_ATTACHMENTS,
          payload: response.Data.UploadedAttachments,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to upload attachments");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Download attachment
  const downloadAttachment = useCallback(
    async (requisitionId, fileName, originalFileName) => {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `${API_BASE_URL}/${requisitionId}/attachments/${fileName}`,
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = originalFileName || fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return true;
        } else {
          throw new Error("Failed to download attachment");
        }
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return false;
      }
    },
    []
  );

  // Delete attachment
  const deleteAttachment = useCallback(async (requisitionId, attachmentId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(
        `${API_BASE_URL}/${requisitionId}/attachments/${attachmentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.Success) {
        dispatch({
          type: actionTypes.DELETE_ATTACHMENT,
          payload: attachmentId,
        });
        return true;
      } else {
        throw new Error(response.Message || "Failed to delete attachment");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Search requisitions - server-side filtering
  const searchRequisitions = useCallback(
    async (searchTerm) => {
      const updatedFilters = { ...state.filters, searchTerm };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getRequisitions({ searchTerm, page: 1 });
    },
    [state.filters, getRequisitions]
  );

  // Filter requisitions by type - server-side filtering
  const filterRequisitionsByType = useCallback(
    async (type) => {
      const updatedFilters = { ...state.filters, type };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getRequisitions({ type, page: 1 });
    },
    [state.filters, getRequisitions]
  );

  // Sort requisitions - server-side sorting
  const sortRequisitions = useCallback(
    async (sortBy, sortAscending = false) => {
      const updatedFilters = { ...state.filters, sortBy, sortAscending };
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      await getRequisitions({ sortBy, sortAscending, page: 1 });
    },
    [state.filters, getRequisitions]
  );

  // Change page
  const changePage = useCallback(
    async (page) => {
      const updatedPagination = {
        ...state.pagination,
        CurrentPage: page,
        PageNumber: page,
      };
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: updatedPagination,
      });
      await getRequisitions({ page });
    },
    [state.pagination, state.filters, getRequisitions]
  );

  // Change page size
  const changePageSize = useCallback(
    async (pageSize) => {
      const updatedPagination = {
        ...state.pagination,
        PageSize: pageSize,
        CurrentPage: 1,
        PageNumber: 1,
      };
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: updatedPagination,
      });
      await getRequisitions({ pageSize, page: 1 });
    },
    [state.pagination, state.filters, getRequisitions]
  );

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // State
    requisitions: state.requisitions,
    currentRequisition: state.currentRequisition,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,

    // Actions
    getRequisitions,
    getRequisition,
    createRequisition,
    updateRequisition,
    deleteRequisition,
    addItemToRequisition,
    uploadAttachments,
    downloadAttachment,
    deleteAttachment,
    searchRequisitions,
    filterRequisitionsByType,
    sortRequisitions,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    setLoading,
    resetState,
  };

  return (
    <RequisitionContext.Provider value={value}>
      {children}
    </RequisitionContext.Provider>
  );
};

// Custom hook to use the requisition context
export const useRequisition = () => {
  const context = useContext(RequisitionContext);
  if (!context) {
    throw new Error("useRequisition must be used within a RequisitionProvider");
  }
  return context;
};

// Export context for direct access if needed
export { RequisitionContext };
