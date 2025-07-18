import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

// Base URL configuration
const BASE_URL = "https://api.speed-erp.com/api";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("company");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Initial state
const initialState = {
  clients: [],
  currentClient: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 25,
    totalItems: 0,
    totalPages: 0,
  },
  searchTerm: "",
  clientType: "",
  sortBy: "Id",
  sortAscending: false,
  statistics: {
    totalClients: 0,
    individualClients: 0,
    businessClients: 0,
    clientsThisMonth: 0,
  },
};

// Action types
const CLIENTS_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_CLIENTS: "SET_CLIENTS",
  SET_CURRENT_CLIENT: "SET_CURRENT_CLIENT",
  CLEAR_CURRENT_CLIENT: "CLEAR_CURRENT_CLIENT",
  ADD_CLIENT: "ADD_CLIENT",
  UPDATE_CLIENT: "UPDATE_CLIENT",
  DELETE_CLIENT: "DELETE_CLIENT",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_CLIENT_TYPE: "SET_CLIENT_TYPE",
  SET_SORT: "SET_SORT",
  SET_PAGINATION: "SET_PAGINATION",
  SET_STATISTICS: "SET_STATISTICS",
  RESET_FILTERS: "RESET_FILTERS",
};

  // Reducer function
  const clientsReducer = (state, action) => {
    switch (action.type) {
      case CLIENTS_ACTIONS.SET_LOADING:
        return {
          ...state,
          isLoading: action.payload,
        };

      case CLIENTS_ACTIONS.SET_ERROR:
        return {
          ...state,
          error: action.payload,
          isLoading: false,
        };

      case CLIENTS_ACTIONS.CLEAR_ERROR:
        return {
          ...state,
          error: null,
        };

    case CLIENTS_ACTIONS.SET_CLIENTS:
      // Handle the API response format - Updated to match backend response
      const clientsData =
        action.payload.Data || action.payload.data || action.payload;
      return {
        ...state,
        clients: Array.isArray(clientsData) ? clientsData : [],
        pagination: {
          page:
            action.payload.Page || action.payload.page || state.pagination.page,
          pageSize:
            action.payload.PageSize ||
            action.payload.pageSize ||
            state.pagination.pageSize,
          totalItems:
            action.payload.TotalItems ||
            action.payload.totalItems ||
            (Array.isArray(clientsData) ? clientsData.length : 0),
          totalPages:
            action.payload.Paginations?.TotalPages ||
            action.payload.totalPages ||
            Math.ceil(
              (action.payload.TotalItems ||
                action.payload.totalItems ||
                (Array.isArray(clientsData) ? clientsData.length : 0)) /
                (action.payload.PageSize ||
                  action.payload.pageSize ||
                  state.pagination.pageSize)
            ),
        },
        isLoading: false,
        error: null,
      };

      case CLIENTS_ACTIONS.SET_CURRENT_CLIENT:
        return {
          ...state,
          currentClient: action.payload,
          isLoading: false,
          error: null,
        };

      case CLIENTS_ACTIONS.CLEAR_CURRENT_CLIENT:
        return {
          ...state,
          currentClient: null,
        };

      case CLIENTS_ACTIONS.ADD_CLIENT:
        return {
          ...state,
          clients: [action.payload, ...state.clients],
          pagination: {
            ...state.pagination,
            totalItems: state.pagination.totalItems + 1,
          },
          isLoading: false,
          error: null,
        };

    case CLIENTS_ACTIONS.UPDATE_CLIENT:
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.Id === action.payload.Id ? action.payload : client
        ),
        currentClient:
          state.currentClient?.Id === action.payload.Id
            ? action.payload
            : state.currentClient,
        isLoading: false,
        error: null,
      };

    case CLIENTS_ACTIONS.DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter((client) => client.Id !== action.payload),
        currentClient:
          state.currentClient?.Id === action.payload
            ? null
            : state.currentClient,
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - 1,
        },
        isLoading: false,
        error: null,
      };

      case CLIENTS_ACTIONS.SET_SEARCH_TERM:
        return {
          ...state,
          searchTerm: action.payload,
          pagination: { ...state.pagination, page: 1 },
        };

      case CLIENTS_ACTIONS.SET_CLIENT_TYPE:
        return {
          ...state,
          clientType: action.payload,
          pagination: { ...state.pagination, page: 1 },
        };

      case CLIENTS_ACTIONS.SET_SORT:
        return {
          ...state,
          sortBy: action.payload.sortBy,
          sortAscending: action.payload.sortAscending,
          pagination: { ...state.pagination, page: 1 },
        };

      case CLIENTS_ACTIONS.SET_PAGINATION:
        return {
          ...state,
          pagination: { ...state.pagination, ...action.payload },
        };

      case CLIENTS_ACTIONS.SET_STATISTICS:
        return {
          ...state,
          statistics: action.payload,
          isLoading: false,
          error: null,
        };

    case CLIENTS_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        searchTerm: "",
        clientType: "",
        sortBy: "Id",
        sortAscending: false,
        pagination: { ...state.pagination, page: 1 },
      };

      default:
        return state;
    }
  };

  // Create context
  const ClientsContext = createContext();

  // ClientsProvider component
  export const ClientsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(clientsReducer, initialState);

  // Helper function to handle API errors - Updated to match backend error format
  const handleApiError = useCallback((error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response?.data?.Message) {
      errorMessage = error.response.data.Message;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.ValidationErrors) {
      errorMessage = error.response.data.ValidationErrors.join(", ");
    } else if (error.response?.data?.validationErrors) {
      errorMessage = error.response.data.validationErrors.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

      dispatch({
        type: CLIENTS_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });

      throw new Error(errorMessage);
    }, []);

  // Calculate statistics from client data
  const calculateStatisticsFromClients = useCallback((clients) => {
    if (!Array.isArray(clients))
      return {
        totalClients: 0,
        individualClients: 0,
        businessClients: 0,
        clientsThisMonth: 0,
      };

    const total = clients.length;
    const individual = clients.filter(
      (c) => c.ClientType?.toLowerCase() === "individual"
    ).length;
    const business = clients.filter(
      (c) => c.ClientType?.toLowerCase() === "business"
    ).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = clients.filter((c) => {
      if (c.CreatedAt) {
        const clientDate = new Date(c.CreatedAt);
        return (
          clientDate.getMonth() === currentMonth &&
          clientDate.getFullYear() === currentYear
        );
      }
      return false;
    }).length;

      return {
        totalClients: total,
        individualClients: individual,
        businessClients: business,
        clientsThisMonth: thisMonth,
      };
    }, []);

  // Ensure required fields are strings (to match backend requirements)
  const sanitizeClientData = useCallback((clientData) => {
    return {
      ...clientData,
      // Ensure required NOT NULL fields are strings
      MobileNumber: clientData.Mobile || clientData.MobileNumber || "",
      PaymentTerms: clientData.PaymentTerms || "",
      Phone: clientData.Telephone || clientData.Phone || "",
      TaxNumber: clientData.TaxNumber || "",
      Address: clientData.Address || "",
      Currency: clientData.Currency || "USD",
      ClientType: clientData.ClientType || "Individual",
      DisplayLanguage: clientData.DisplayLanguage || "en",
    };
  }, []);

    // Clients API methods
    const clientsApi = {
      // Get clients with pagination, search, and filters
      getClients: async (options = {}) => {
        try {
          dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
          dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        const params = {
          page: options.page || state.pagination.page,
          pageSize: options.pageSize || state.pagination.pageSize,
          search:
            options.searchTerm !== undefined
              ? options.searchTerm
              : state.searchTerm,
          clientType:
            options.clientType !== undefined
              ? options.clientType
              : state.clientType,
          sortBy: options.sortBy || state.sortBy,
          sortAscending:
            options.sortAscending !== undefined
              ? options.sortAscending
              : state.sortAscending,
          // Add other filter options to match backend
          category: options.category || "",
          currency: options.currency || "",
          country: options.country || "",
          city: options.city || "",
          startDate: options.startDate || null,
          endDate: options.endDate || null,
        };

        // Remove empty params
        Object.keys(params).forEach((key) => {
          if (
            params[key] === "" ||
            params[key] === null ||
            params[key] === undefined
          ) {
            delete params[key];
          }
        });

        const response = await apiClient.get("/clients", { params });

        dispatch({
          type: CLIENTS_ACTIONS.SET_CLIENTS,
          payload: response.data.Data.$values,
        });

        // Calculate and set statistics from the received data
        const clientsData =
          response.data.Data.$values || response.data.data || response.data;
        if (Array.isArray(clientsData)) {
          const stats = calculateStatisticsFromClients(clientsData);
          dispatch({
            type: CLIENTS_ACTIONS.SET_STATISTICS,
            payload: stats,
          });
        }

          return response.data;
        } catch (error) {
          handleApiError(error);
        }
      },

      // Get single client by ID
      getClient: async (clientId) => {
        try {
          dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
          dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(`/clients/${clientId}`);

        const clientData =
          response.data.Data || response.data.data || response.data;

        dispatch({
          type: CLIENTS_ACTIONS.SET_CURRENT_CLIENT,
          payload: clientData,
        });

          return { data: clientData };
        } catch (error) {
          handleApiError(error);
        }
      },

      // Create new client - Updated to match backend FormData expectations
      createClient: async (clientData, attachments = []) => {
        try {
          dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
          dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        const formData = new FormData();

        // Sanitize and append client data
        const sanitizedData = sanitizeClientData(clientData);

        Object.keys(sanitizedData).forEach((key) => {
          if (
            sanitizedData[key] !== null &&
            sanitizedData[key] !== undefined &&
            sanitizedData[key] !== ""
          ) {
            if (key === "contacts" && Array.isArray(sanitizedData[key])) {
              // Handle contacts array - match backend expected format
              sanitizedData[key].forEach((contact, index) => {
                Object.keys(contact).forEach((contactKey) => {
                  if (
                    contact[contactKey] !== null &&
                    contact[contactKey] !== undefined &&
                    contact[contactKey] !== ""
                  ) {
                    formData.append(
                      `Contacts[${index}].${contactKey}`,
                      contact[contactKey]
                    );
                  }
                });
              });
            } else {
              // Use PascalCase for backend compatibility
              const backendKey = key.charAt(0).toUpperCase() + key.slice(1);
              formData.append(backendKey, sanitizedData[key]);
            }
          }
        });

        // Append attachments
        attachments.forEach((file) => {
          formData.append("Attachments", file);
        });

        const response = await apiClient.post("/clients", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const newClient =
          response.data.Data || response.data.data || response.data;

          dispatch({
            type: CLIENTS_ACTIONS.ADD_CLIENT,
            payload: newClient,
          });

          return response.data;
        } catch (error) {
          handleApiError(error);
        }
      },

      // Update existing client - Updated to match backend FormData expectations
    // Update existing client - Fixed to include AttachmentsToRemove field
// Update existing client - Updated to include required AttachmentsToRemove field
updateClient: async (clientId, clientData, attachments = []) => {
  try {
    dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        const formData = new FormData();

        // Sanitize and append client data
        const sanitizedData = sanitizeClientData(clientData);

        Object.keys(sanitizedData).forEach((key) => {
          if (
            sanitizedData[key] !== null &&
            sanitizedData[key] !== undefined &&
            sanitizedData[key] !== ""
          ) {
            if (key === "contacts" && Array.isArray(sanitizedData[key])) {
              // Handle contacts array - match backend expected format
              sanitizedData[key].forEach((contact, index) => {
                Object.keys(contact).forEach((contactKey) => {
                  if (
                    contact[contactKey] !== null &&
                    contact[contactKey] !== undefined &&
                    contact[contactKey] !== ""
                  ) {
                    formData.append(
                      `Contacts[${index}].${contactKey}`,
                      contact[contactKey]
                    );
                  }
                });
              });
            } else {
              // Use PascalCase for backend compatibility
              const backendKey = key.charAt(0).toUpperCase() + key.slice(1);
              formData.append(backendKey, sanitizedData[key]);
            }
          }
        });

        // Append new attachments
        attachments.forEach((file) => {
          formData.append("Attachments", file);
        });

        const response = await apiClient.put(`/clients/${clientId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const updatedClient =
          response.data.Data || response.data.data || response.data;

    dispatch({
      type: CLIENTS_ACTIONS.UPDATE_CLIENT,
      payload: updatedClient,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
},
      // Delete client - Updated to match backend signature
      deleteClient: async (clientId, hardDelete = false) => {
        try {
          dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
          dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        const params = hardDelete ? { hardDelete: true } : {};
        const response = await apiClient.delete(`/clients/${clientId}`, {
          params,
        });

        dispatch({
          type: CLIENTS_ACTIONS.DELETE_CLIENT,
          payload: clientId,
        });

          return response.data;
        } catch (error) {
          handleApiError(error);
        }
      },

      // Get client statistics - Updated to match backend response
      getStatistics: async (options = {}) => {
        try {
          const params = {};
          if (options.startDate) params.startDate = options.startDate;
          if (options.endDate) params.endDate = options.endDate;

        // If we have clients data, calculate statistics from it first
        if (
          state.clients.length > 0 &&
          !options.startDate &&
          !options.endDate
        ) {
          const stats = calculateStatisticsFromClients(state.clients);
          dispatch({
            type: CLIENTS_ACTIONS.SET_STATISTICS,
            payload: stats,
          });
          return { data: stats };
        }

          // Otherwise try to fetch from API
          dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
          dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        try {
          const response = await apiClient.get("/clients/statistics", {
            params,
          });
          const statsData =
            response.data.Data || response.data.data || response.data;

          dispatch({
            type: CLIENTS_ACTIONS.SET_STATISTICS,
            payload: statsData,
          });

          return response.data;
        } catch (error) {
          // If statistics endpoint doesn't exist, calculate from clients
          const allClientsResponse = await apiClient.get("/clients");
          const allClients =
            allClientsResponse.data.Data || allClientsResponse.data.data || [];
          const stats = calculateStatisticsFromClients(allClients);

          dispatch({
            type: CLIENTS_ACTIONS.SET_STATISTICS,
            payload: stats,
          });

            return { data: stats };
          }
        } catch (error) {
          // Fallback to calculating from current state
          const stats = calculateStatisticsFromClients(state.clients);
          dispatch({
            type: CLIENTS_ACTIONS.SET_STATISTICS,
            payload: stats,
          });
          return { data: stats };
        }
      },

      // Clear current client
      clearCurrentClient: () => {
        dispatch({ type: CLIENTS_ACTIONS.CLEAR_CURRENT_CLIENT });
      },

      // Clear error manually
      clearError: () => {
        dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });
      },

      // Set search term
      setSearchTerm: (searchTerm) => {
        dispatch({
          type: CLIENTS_ACTIONS.SET_SEARCH_TERM,
          payload: searchTerm,
        });
      },

      // Set client type filter
      setClientType: (clientType) => {
        dispatch({
          type: CLIENTS_ACTIONS.SET_CLIENT_TYPE,
          payload: clientType,
        });
      },

      // Set sorting
      setSort: (sortBy, sortAscending) => {
        dispatch({
          type: CLIENTS_ACTIONS.SET_SORT,
          payload: { sortBy, sortAscending },
        });
      },

      // Set pagination
      setPagination: (paginationData) => {
        dispatch({
          type: CLIENTS_ACTIONS.SET_PAGINATION,
          payload: paginationData,
        });
      },

      // Reset all filters
      resetFilters: () => {
        dispatch({ type: CLIENTS_ACTIONS.RESET_FILTERS });
      },

      // Refresh clients (reload with current filters)
      refreshClients: async () => {
        return await clientsApi.getClients();
      },

      // Search clients (convenience method)
      searchClients: async (searchTerm) => {
        clientsApi.setSearchTerm(searchTerm);
        return await clientsApi.getClients({ searchTerm, page: 1 });
      },

      // Filter by client type (convenience method)
      filterByClientType: async (clientType) => {
        clientsApi.setClientType(clientType);
        return await clientsApi.getClients({ clientType, page: 1 });
      },

      // Sort clients (convenience method)
      sortClients: async (sortBy, sortAscending = true) => {
        clientsApi.setSort(sortBy, sortAscending);
        return await clientsApi.getClients({ sortBy, sortAscending, page: 1 });
      },

      // Go to specific page
      goToPage: async (page) => {
        clientsApi.setPagination({ page });
        return await clientsApi.getClients({ page });
      },

      // Change page size
      changePageSize: async (pageSize) => {
        clientsApi.setPagination({ pageSize, page: 1 });
        return await clientsApi.getClients({ pageSize, page: 1 });
      },
    };

  // Context value
  const contextValue = {
    // State
    ...state,

    // API methods
    ...clientsApi,

    // Utility methods
    getTotalPages: () =>
      Math.ceil(state.pagination.totalItems / state.pagination.pageSize),
    hasNextPage: () =>
      state.pagination.page <
      Math.ceil(state.pagination.totalItems / state.pagination.pageSize),
    hasPrevPage: () => state.pagination.page > 1,
    getClientById: (clientId) =>
      state.clients.find((client) => client.Id === clientId),
    isClientLoaded: (clientId) =>
      state.clients.some((client) => client.Id === clientId),

    // Filter helpers
    hasFilters: () => state.searchTerm || state.clientType,
    getActiveFiltersCount: () => {
      let count = 0;
      if (state.searchTerm) count++;
      if (state.clientType) count++;
      return count;
    },
  };

    return (
      <ClientsContext.Provider value={contextValue}>
        {children}
      </ClientsContext.Provider>
    );
  };

// Custom hook to use clients context
export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
};

  // Export context for advanced usage
  export { ClientsContext };

// Export API client for direct usage if needed
export { apiClient };
