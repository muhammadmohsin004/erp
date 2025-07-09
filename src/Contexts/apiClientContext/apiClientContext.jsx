import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';

// Base URL configuration
const BASE_URL = 'https://api.speed-erp.com/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('company');
      window.location.href = '/login';
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
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  },
  searchTerm: '',
  clientType: '',
  sortBy: 'Id',
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
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_CLIENTS: 'SET_CLIENTS',
  SET_CURRENT_CLIENT: 'SET_CURRENT_CLIENT',
  CLEAR_CURRENT_CLIENT: 'CLEAR_CURRENT_CLIENT',
  ADD_CLIENT: 'ADD_CLIENT',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  DELETE_CLIENT: 'DELETE_CLIENT',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_CLIENT_TYPE: 'SET_CLIENT_TYPE',
  SET_SORT: 'SET_SORT',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_STATISTICS: 'SET_STATISTICS',
  RESET_FILTERS: 'RESET_FILTERS',
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
      return {
        ...state,
        clients: action.payload.data,
        pagination: {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalItems: action.payload.totalItems,
          totalPages: Math.ceil(action.payload.totalItems / action.payload.pageSize),
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
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        ),
        currentClient: state.currentClient?.id === action.payload.id ? action.payload : state.currentClient,
        isLoading: false,
        error: null,
      };

    case CLIENTS_ACTIONS.DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
        currentClient: state.currentClient?.id === action.payload ? null : state.currentClient,
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
        pagination: { ...state.pagination, page: 1 }, // Reset to first page
      };

    case CLIENTS_ACTIONS.SET_CLIENT_TYPE:
      return {
        ...state,
        clientType: action.payload,
        pagination: { ...state.pagination, page: 1 }, // Reset to first page
      };

    case CLIENTS_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortAscending: action.payload.sortAscending,
        pagination: { ...state.pagination, page: 1 }, // Reset to first page
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
        searchTerm: '',
        clientType: '',
        sortBy: 'Id',
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

  // Helper function to handle API errors
  const handleApiError = useCallback((error) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.validationErrors) {
      errorMessage = error.response.data.validationErrors.join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: CLIENTS_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
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
          searchTerm: options.searchTerm !== undefined ? options.searchTerm : state.searchTerm,
          clientType: options.clientType !== undefined ? options.clientType : state.clientType,
          sortBy: options.sortBy || state.sortBy,
          sortAscending: options.sortAscending !== undefined ? options.sortAscending : state.sortAscending,
        };

        const response = await apiClient.get('/clients', { params });
        
        dispatch({
          type: CLIENTS_ACTIONS.SET_CLIENTS,
          payload: response.data,
        });

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
        
        dispatch({
          type: CLIENTS_ACTIONS.SET_CURRENT_CLIENT,
          payload: response.data.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Create new client
    createClient: async (clientData, attachments = []) => {
      try {
        dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        const formData = new FormData();
        
        // Append client data
        Object.keys(clientData).forEach(key => {
          if (clientData[key] !== null && clientData[key] !== undefined) {
            if (key === 'contacts' && Array.isArray(clientData[key])) {
              // Handle contacts array
              clientData[key].forEach((contact, index) => {
                Object.keys(contact).forEach(contactKey => {
                  if (contact[contactKey] !== null && contact[contactKey] !== undefined) {
                    formData.append(`contacts[${index}].${contactKey}`, contact[contactKey]);
                  }
                });
              });
            } else {
              formData.append(key, clientData[key]);
            }
          }
        });

        // Append attachments
        attachments.forEach((file) => {
          formData.append('attachments', file);
        });

        const response = await apiClient.post('/clients', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        dispatch({
          type: CLIENTS_ACTIONS.ADD_CLIENT,
          payload: response.data.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Update existing client
    updateClient: async (clientId, clientData, attachments = []) => {
      try {
        dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        const formData = new FormData();
        
        // Append client data
        Object.keys(clientData).forEach(key => {
          if (clientData[key] !== null && clientData[key] !== undefined) {
            if (key === 'contacts' && Array.isArray(clientData[key])) {
              // Handle contacts array
              clientData[key].forEach((contact, index) => {
                Object.keys(contact).forEach(contactKey => {
                  if (contact[contactKey] !== null && contact[contactKey] !== undefined) {
                    formData.append(`contacts[${index}].${contactKey}`, contact[contactKey]);
                  }
                });
              });
            } else {
              formData.append(key, clientData[key]);
            }
          }
        });

        // Append new attachments
        attachments.forEach((file) => {
          formData.append('attachments', file);
        });

        const response = await apiClient.put(`/clients/${clientId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        dispatch({
          type: CLIENTS_ACTIONS.UPDATE_CLIENT,
          payload: response.data.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Delete client
    deleteClient: async (clientId) => {
      try {
        dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.delete(`/clients/${clientId}`);
        
        dispatch({
          type: CLIENTS_ACTIONS.DELETE_CLIENT,
          payload: clientId,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get client statistics
    getStatistics: async () => {
      try {
        dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get('/clients/statistics');
        
        dispatch({
          type: CLIENTS_ACTIONS.SET_STATISTICS,
          payload: response.data.data || {
            totalClients: 0,
            individualClients: 0,
            businessClients: 0,
            clientsThisMonth: 0,
          },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
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
    getTotalPages: () => Math.ceil(state.pagination.totalItems / state.pagination.pageSize),
    hasNextPage: () => state.pagination.page < Math.ceil(state.pagination.totalItems / state.pagination.pageSize),
    hasPrevPage: () => state.pagination.page > 1,
    getClientById: (clientId) => state.clients.find(client => client.id === clientId),
    isClientLoaded: (clientId) => state.clients.some(client => client.id === clientId),
    
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
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};

// Export context for advanced usage
export { ClientsContext };

// Export API client for direct usage if needed
export { apiClient };