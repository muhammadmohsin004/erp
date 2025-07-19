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

// Reducer function (same as your original)
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
      { const clientsData =
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
      }; }

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

  // FIXED: Stable error handler
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
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = [];
      Object.keys(errors).forEach(key => {
        if (Array.isArray(errors[key])) {
          errorMessages.push(...errors[key]);
        } else {
          errorMessages.push(errors[key]);
        }
      });
      errorMessage = errorMessages.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: CLIENTS_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }, []); // FIXED: Empty dependency array

  // FIXED: Stable API functions
  const getClients = useCallback(async (options = {}) => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const params = {
        page: options.page || 1,
        pageSize: options.pageSize || 25,
        search: options.searchTerm || "",
        clientType: options.clientType || "",
        sortBy: options.sortBy || "Id",
        sortAscending: options.sortAscending !== undefined ? options.sortAscending : false,
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

      return response.data.Data.$values;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]); // FIXED: Only depends on stable handleApiError

  const getClient = useCallback(async (clientId) => {
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
  }, [handleApiError]); // FIXED: Only depends on stable handleApiError

  const createClient = useCallback(async (clientData, attachments = []) => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const formData = new FormData();

      // Process client data
      const sanitizedData = {
        ...clientData,
        MobileNumber: clientData.Mobile || clientData.MobileNumber || "",
        PaymentTerms: clientData.PaymentTerms || "",
        Phone: clientData.Telephone || clientData.Phone || "",
        TaxNumber: clientData.TaxNumber || "",
        Address: clientData.Address || "",
        Currency: clientData.Currency || "USD",
        ClientType: clientData.ClientType || "Individual",
        DisplayLanguage: clientData.DisplayLanguage || "en",
      };

      Object.keys(sanitizedData).forEach((key) => {
        if (
          sanitizedData[key] !== null &&
          sanitizedData[key] !== undefined &&
          sanitizedData[key] !== ""
        ) {
          if (key === "contacts" && Array.isArray(sanitizedData[key])) {
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
            const backendKey = key.charAt(0).toUpperCase() + key.slice(1);
            formData.append(backendKey, sanitizedData[key]);
          }
        }
      });

      if (attachments && attachments.length > 0) {
        attachments.forEach((file) => {
          formData.append("Attachments", file);
        });
      }

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
  }, [handleApiError]); // FIXED: Only depends on stable handleApiError

  const updateClient = useCallback(async (clientId, clientData, attachments = []) => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const formData = new FormData();
      
      const completeData = {
        ClientType: clientData.ClientType || "Individual",
        FullName: clientData.FullName || "",
        BusinessName: clientData.BusinessName || "",
        FirstName: clientData.FirstName || "",
        LastName: clientData.LastName || "",
        Email: clientData.Email || "",
        Mobile: clientData.Mobile || "",
        Telephone: clientData.Telephone || "",
        Website: clientData.Website || "",
        StreetAddress1: clientData.StreetAddress1 || "",
        StreetAddress2: clientData.StreetAddress2 || "",
        City: clientData.City || "",
        State: clientData.State || "",
        PostalCode: clientData.PostalCode || "",
        Country: clientData.Country || "",
        VatNumber: clientData.VatNumber || "",
        TaxNumber: clientData.TaxNumber || "",
        CodeNumber: clientData.CodeNumber || "",
        Currency: clientData.Currency || "USD",
        Category: clientData.Category || "",
        PaymentTerms: clientData.PaymentTerms || "",
        InvoicingMethod: clientData.InvoicingMethod || "Email",
        Notes: clientData.Notes || "",
        DisplayLanguage: clientData.DisplayLanguage || "en",
        HasSecondaryAddress: Boolean(clientData.HasSecondaryAddress),
        MobileNumber: clientData.Mobile || "",
        Phone: clientData.Telephone || "",
        Address: "",
      };

      Object.keys(completeData).forEach(key => {
        const value = completeData[key];
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value || "");
        }
      });

      if (clientData.contacts && Array.isArray(clientData.contacts)) {
        clientData.contacts.forEach((contact, index) => {
          formData.append(`Contacts[${index}].FirstName`, contact.FirstName || "");
          formData.append(`Contacts[${index}].LastName`, contact.LastName || "");
          formData.append(`Contacts[${index}].Email`, contact.Email || "");
          formData.append(`Contacts[${index}].Mobile`, contact.Mobile || "");
          formData.append(`Contacts[${index}].Telephone`, contact.Telephone || "");
        });
      }

      if (attachments && attachments.length > 0) {
        attachments.forEach((file) => {
          if (file instanceof File) {
            formData.append('Attachments', file);
          }
        });
      }

      const attachmentsToRemove = clientData.attachmentsToRemove || [];
      if (attachmentsToRemove.length > 0) {
        attachmentsToRemove.forEach((attachmentId, index) => {
          if (attachmentId && parseInt(attachmentId) > 0) {
            formData.append(`AttachmentsToRemove[${index}]`, attachmentId.toString());
          }
        });
      }

      const response = await apiClient.put(`/clients/${clientId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedClient = response.data.Data || response.data.data || response.data;

      dispatch({
        type: CLIENTS_ACTIONS.UPDATE_CLIENT,
        payload: updatedClient,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]); // FIXED: Only depends on stable handleApiError

  const clearCurrentClient = useCallback(() => {
    dispatch({ type: CLIENTS_ACTIONS.CLEAR_CURRENT_CLIENT });
  }, []); // FIXED: No dependencies

  const clearError = useCallback(() => {
    dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });
  }, []); // FIXED: No dependencies

  // Context value with stable functions
  const contextValue = {
    // State
    clients: state.clients,
    currentClient: state.currentClient,
    loading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    
    // Stable API methods
    getClients,
    getClient,
    createClient,
    updateClient,
    clearCurrentClient,
    clearError,
    
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