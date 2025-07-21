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

// UPDATED: Initial state to match backend response structure
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
  // Enhanced filters to match controller
  filters: {
    search: "",
    clientType: "",
    category: "",
    currency: "",
    country: "",
    city: "",
    startDate: null,
    endDate: null,
  },
  sorting: {
    sortBy: "Id",
    sortAscending: false,
  },
  // UPDATED: Statistics state to match backend structure
  statistics: {
    totalClients: 0,
    individualClients: 0,
    businessClients: 0,
    otherClients: 0,
    clientsThisMonth: 0,
    categories: [],
    currencies: [],
    monthlyGrowth: [],
    dateRange: null,
    generatedAt: null,
    companyId: null,
  },
  lastFetchOptions: null,
};

// Enhanced action types
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
  SET_FILTERS: "SET_FILTERS",
  SET_SORTING: "SET_SORTING",
  SET_PAGINATION: "SET_PAGINATION",
  SET_STATISTICS: "SET_STATISTICS",
  RESET_FILTERS: "RESET_FILTERS",
  SET_LAST_FETCH_OPTIONS: "SET_LAST_FETCH_OPTIONS",
};

// UPDATED: Enhanced reducer function to handle backend statistics structure
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

   // REPLACE this case in your clientsReducer:

case CLIENTS_ACTIONS.SET_CLIENTS:
  {
    const responseData = action.payload;
    
    // FIXED: Handle nested $values structure properly
    let clientsData = [];
    
    if (responseData.Data && responseData.Data.$values && Array.isArray(responseData.Data.$values)) {
      // Handle: { Data: { $values: [...] } }
      clientsData = responseData.Data.$values;
    } else if (responseData.Data && Array.isArray(responseData.Data)) {
      // Handle: { Data: [...] }
      clientsData = responseData.Data;
    } else if (responseData.data && responseData.data.$values && Array.isArray(responseData.data.$values)) {
      // Handle: { data: { $values: [...] } }
      clientsData = responseData.data.$values;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      // Handle: { data: [...] }
      clientsData = responseData.data;
    } else if (Array.isArray(responseData)) {
      // Handle: [...]
      clientsData = responseData;
    }
    
    console.log('🔧 Context SET_CLIENTS Debug:');
    console.log('Response structure:', responseData);
    console.log('Extracted clients array:', clientsData);
    console.log('Clients count:', clientsData.length);
    
    return {
      ...state,
      clients: clientsData,
      pagination: {
        page: responseData.Page || state.pagination.page,
        pageSize: responseData.PageSize || state.pagination.pageSize,
        totalItems: responseData.TotalItems || clientsData.length,
        totalPages: responseData.Paginations?.TotalPages || 
                   Math.ceil((responseData.TotalItems || clientsData.length) / 
                            (responseData.PageSize || state.pagination.pageSize)),
      },
      isLoading: false,
      error: null,
    };
  }

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

    case CLIENTS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };

    case CLIENTS_ACTIONS.SET_SORTING:
      return {
        ...state,
        sorting: action.payload,
        pagination: { ...state.pagination, page: 1 },
      };

    case CLIENTS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    // UPDATED: Handle backend statistics structure correctly
    case CLIENTS_ACTIONS.SET_STATISTICS:
      {
        const statsData = action.payload;
        
        // Map backend response to frontend state structure
        const mappedStats = {
          totalClients: statsData.TotalClients || 0,
          individualClients: statsData.ClientTypes?.Individual || 0,
          businessClients: statsData.ClientTypes?.Business || 0,
          otherClients: statsData.ClientTypes?.Other || 0,
          clientsThisMonth: statsData.ClientsThisMonth || 0,
          categories: statsData.Categories || [],
          currencies: statsData.Currencies || [],
          monthlyGrowth: statsData.MonthlyGrowth || [],
          dateRange: statsData.DateRange || null,
          generatedAt: statsData.GeneratedAt || null,
          companyId: statsData.CompanyId || null,
        };

        return {
          ...state,
          statistics: mappedStats,
          isLoading: false,
          error: null,
        };
      }

    case CLIENTS_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: {
          search: "",
          clientType: "",
          category: "",
          currency: "",
          country: "",
          city: "",
          startDate: null,
          endDate: null,
        },
        sorting: {
          sortBy: "Id",
          sortAscending: false,
        },
        pagination: { ...state.pagination, page: 1 },
      };

    case CLIENTS_ACTIONS.SET_LAST_FETCH_OPTIONS:
      return {
        ...state,
        lastFetchOptions: action.payload,
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

  // Enhanced error handler to match controller error responses
  const handleApiError = useCallback((error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response?.data?.Message) {
      errorMessage = error.response.data.Message;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.ValidationErrors) {
      errorMessage = Array.isArray(error.response.data.ValidationErrors) 
        ? error.response.data.ValidationErrors.join(", ")
        : error.response.data.ValidationErrors;
    } else if (error.response?.data?.validationErrors) {
      errorMessage = Array.isArray(error.response.data.validationErrors)
        ? error.response.data.validationErrors.join(", ")
        : error.response.data.validationErrors;
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
  }, []);

  // REPLACE your getClients method with this:

const getClients = useCallback(async (options = {}) => {
  try {
    dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

    const params = {
      page: options.page || state.pagination.page,
      pageSize: options.pageSize || state.pagination.pageSize,
      search: options.search || state.filters.search,
      clientType: options.clientType || state.filters.clientType,
      category: options.category || state.filters.category,
      currency: options.currency || state.filters.currency,
      startDate: options.startDate || state.filters.startDate,
      endDate: options.endDate || state.filters.endDate,
      sortBy: options.sortBy || state.sorting.sortBy,
      sortAscending: options.sortAscending !== undefined ? options.sortAscending : state.sorting.sortAscending,
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

    // Store fetch options for refresh
    dispatch({
      type: CLIENTS_ACTIONS.SET_LAST_FETCH_OPTIONS,
      payload: params,
    });

    console.log('🚀 Fetching clients with params:', params);

    const response = await apiClient.get("/clients", { params });

    console.log('✅ Raw API response:', response.data);
    console.log('📦 Response structure check:');
    console.log('- Has Data:', !!response.data.Data);
    console.log('- Has Data.$values:', !!response.data.Data?.$values);
    console.log('- $values is array:', Array.isArray(response.data.Data?.$values));
    console.log('- $values length:', response.data.Data?.$values?.length || 0);

    // CRITICAL: Pass the complete response to reducer
    dispatch({
      type: CLIENTS_ACTIONS.SET_CLIENTS,
      payload: response.data, // Pass complete response, let reducer handle extraction
    });

    return response.data;
  } catch (error) {
    console.error('❌ getClients error:', error);
    handleApiError(error);
  }
}, [state.pagination, state.filters, state.sorting, handleApiError]);

  // Get single client with full details
  const getClient = useCallback(async (clientId) => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const response = await apiClient.get(`/clients/${clientId}`);

      const clientData = response.data.Data || response.data.data || response.data;

      dispatch({
        type: CLIENTS_ACTIONS.SET_CURRENT_CLIENT,
        payload: clientData,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // FIXED: Enhanced createClient - Remove language conversion causing issues
  const createClient = useCallback(async (clientData, attachments = []) => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const formData = new FormData();

      // CRITICAL: Build FullName exactly as controller validation expects
      let fullName = "";
      if (clientData.ClientType === "Business") {
        fullName = clientData.BusinessName?.trim() || "";
      } else {
        // For Individual, use FullName directly or build from FirstName + LastName
        fullName = clientData.FullName?.trim() || 
                  `${clientData.FirstName?.trim() || ""} ${clientData.LastName?.trim() || ""}`.trim();
      }

      // FIXED: Build complete client data matching controller model exactly
      const completeClientData = {
        // CRITICAL: Required core fields with controller defaults
        ClientType: clientData.ClientType || "Individual",
        Currency: clientData.Currency || "USD",
        InvoicingMethod: clientData.InvoicingMethod || "Email",
        DisplayLanguage: clientData.DisplayLanguage || "English", // FIXED: Send directly, no conversion
        
        // CRITICAL: Required NOT NULL fields - ensure string.Empty for nulls
        Mobile: clientData.Mobile?.trim() || "",
        Telephone: clientData.Telephone?.trim() || "",
        TaxNumber: clientData.TaxNumber?.trim() || "",
        PaymentTerms: clientData.PaymentTerms?.trim() || "",
        
        // CRITICAL: Name fields - exact mapping to controller
        FullName: fullName,
        BusinessName: clientData.BusinessName?.trim() || "",
        FirstName: clientData.FirstName?.trim() || "",
        LastName: clientData.LastName?.trim() || "",
        
        // Contact fields
        Email: clientData.Email?.trim() || "",
        
        // Address fields  
        StreetAddress1: clientData.StreetAddress1?.trim() || "",
        StreetAddress2: clientData.StreetAddress2?.trim() || "",
        City: clientData.City?.trim() || "",
        State: clientData.State?.trim() || "",
        PostalCode: clientData.PostalCode?.trim() || "",
        Country: clientData.Country?.trim() || "",
        
        // Optional fields
        VatNumber: clientData.VatNumber?.trim() || "",
        CodeNumber: clientData.CodeNumber?.trim() || "",
        Category: clientData.Category?.trim() || "",
        Notes: clientData.Notes?.trim() || "",
        
        // Boolean fields
        HasSecondaryAddress: Boolean(clientData.HasSecondaryAddress),
        
        // CRITICAL: Backend expected duplicate fields
        MobileNumber: clientData.Mobile?.trim() || "",
        Phone: clientData.Telephone?.trim() || "",
        Address: "", // Will be built by controller
      };

      // CRITICAL: Add all client fields to FormData in exact order expected
      Object.keys(completeClientData).forEach((key) => {
        const value = completeClientData[key];
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value || "");
        }
      });

      // CRITICAL: Add contacts - ONLY if they have meaningful data
      if (clientData.contacts && Array.isArray(clientData.contacts)) {
        let contactIndex = 0;
        clientData.contacts.forEach((contact) => {
          // Only add contacts that have at least a name or email
          const hasData = contact.FirstName?.trim() || contact.LastName?.trim() || contact.Email?.trim();
          if (hasData) {
            formData.append(`Contacts[${contactIndex}].FirstName`, contact.FirstName?.trim() || "");
            formData.append(`Contacts[${contactIndex}].LastName`, contact.LastName?.trim() || "");
            formData.append(`Contacts[${contactIndex}].Email`, contact.Email?.trim() || "");
            formData.append(`Contacts[${contactIndex}].Telephone`, contact.Telephone?.trim() || "");
            formData.append(`Contacts[${contactIndex}].Mobile`, contact.Mobile?.trim() || "");
            contactIndex++;
          }
        });
      }

      // CRITICAL: Add attachments - only real files
      if (attachments && attachments.length > 0) {
        attachments.forEach((file) => {
          if (file instanceof File) {
            formData.append("Attachments", file);
          }
        });
      }

      // ENHANCED: Debug logging with validation checks
      console.log('=== CLIENT CREATION DEBUG INFO ===');
      console.log('ClientType:', completeClientData.ClientType);
      console.log('FullName:', completeClientData.FullName);
      console.log('BusinessName:', completeClientData.BusinessName);
      console.log('Email:', completeClientData.Email);
      console.log('DisplayLanguage:', completeClientData.DisplayLanguage);
      
      // Validate critical fields before sending
      if (completeClientData.ClientType === "Individual" && !completeClientData.FullName) {
        throw new Error("FullName is required for Individual clients");
      }
      if (completeClientData.ClientType === "Business" && !completeClientData.BusinessName) {
        throw new Error("BusinessName is required for Business clients");
      }
      
      console.log('=== FormData being sent ===');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      console.log('=== End FormData ===');

      const response = await apiClient.post("/clients", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // Increase timeout for debugging
      });

      console.log('✅ SUCCESS Response:', response.data);

      const newClient = response.data.Data || response.data.data || response.data;

      dispatch({
        type: CLIENTS_ACTIONS.ADD_CLIENT,
        payload: newClient,
      });

      return response.data;
    } catch (error) {
      console.error('❌ DETAILED ERROR:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });

      // Enhanced error handling
      if (error.response?.status === 500) {
        console.error('🚨 SERVER ERROR: Check server logs for detailed error information');
      }
      
      handleApiError(error);
    }
  }, [handleApiError]);

  // FIXED: Enhanced updateClient to match controller expectations
  const updateClient = useCallback(async (clientId, clientData, attachments = []) => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const formData = new FormData();
      
      // FIXED: Build complete update data with proper defaults
      const completeData = {
        // Required core fields
        ClientType: clientData.ClientType || "Individual",
        Currency: clientData.Currency || "USD", // FIXED: Use USD as controller default
        InvoicingMethod: clientData.InvoicingMethod || "Email",
        DisplayLanguage: clientData.DisplayLanguage || "English", // FIXED: Use full name as controller expects
        
        // FIXED: Required NOT NULL fields with proper defaults
        Mobile: clientData.Mobile?.trim() || "",
        Telephone: clientData.Telephone?.trim() || "",
        TaxNumber: clientData.TaxNumber?.trim() || "", // FIXED: Empty string as controller expects
        PaymentTerms: clientData.PaymentTerms?.trim() || "", // FIXED: Empty string as controller expects
        
        // Name fields
        FullName: clientData.FullName?.trim() || "",
        BusinessName: clientData.BusinessName?.trim() || "",
        FirstName: clientData.FirstName?.trim() || "",
        LastName: clientData.LastName?.trim() || "",
        
        // Contact fields
        Email: clientData.Email?.trim() || "",
        
        // Address fields
        StreetAddress1: clientData.StreetAddress1?.trim() || "",
        StreetAddress2: clientData.StreetAddress2?.trim() || "",
        City: clientData.City?.trim() || "",
        State: clientData.State?.trim() || "",
        PostalCode: clientData.PostalCode?.trim() || "",
        Country: clientData.Country?.trim() || "",
        
        // Optional fields
        VatNumber: clientData.VatNumber?.trim() || "",
        CodeNumber: clientData.CodeNumber?.trim() || "",
        Category: clientData.Category?.trim() || "",
        Notes: clientData.Notes?.trim() || "",
        
        // Boolean fields
        HasSecondaryAddress: Boolean(clientData.HasSecondaryAddress),
        
        // FIXED: Backend expected duplicate fields
        MobileNumber: clientData.Mobile?.trim() || "",
        Phone: clientData.Telephone?.trim() || "",
      };

      // Add all fields to FormData
      Object.keys(completeData).forEach(key => {
        const value = completeData[key];
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value || "");
        }
      });

      // Add contacts
      if (clientData.contacts && Array.isArray(clientData.contacts)) {
        clientData.contacts.forEach((contact, index) => {
          formData.append(`Contacts[${index}].FirstName`, contact.FirstName?.trim() || "");
          formData.append(`Contacts[${index}].LastName`, contact.LastName?.trim() || "");
          formData.append(`Contacts[${index}].Email`, contact.Email?.trim() || "");
          formData.append(`Contacts[${index}].Mobile`, contact.Mobile?.trim() || "");
          formData.append(`Contacts[${index}].Telephone`, contact.Telephone?.trim() || "");
        });
      }

      // Add new attachments
      if (attachments && attachments.length > 0) {
        attachments.forEach((file) => {
          if (file instanceof File) {
            formData.append('Attachments', file);
          }
        });
      }

      // ADDED: Debug logging for update
      console.log('=== FormData Contents for Client Update ===');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      console.log('=== End FormData Contents ===');

      const response = await apiClient.put(`/clients/${clientId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update client response:', response.data);

      const updatedClient = response.data.Data || response.data.data || response.data;

      dispatch({
        type: CLIENTS_ACTIONS.UPDATE_CLIENT,
        payload: updatedClient,
      });

      return response.data;
    } catch (error) {
      console.error('Update client error:', error.response?.data || error.message);
      handleApiError(error);
    }
  }, [handleApiError]);

  // Delete client method to match controller
  const deleteClient = useCallback(async (clientId, hardDelete = false) => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const params = hardDelete ? { hardDelete: true } : {};

      const response = await apiClient.delete(`/clients/${clientId}`, { params });

      dispatch({
        type: CLIENTS_ACTIONS.DELETE_CLIENT,
        payload: clientId,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // UPDATED: Get client statistics to match backend endpoints
  const getClientStatistics = useCallback(async (startDate = null, endDate = null) => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('📊 Calling statistics endpoint with params:', params);

      const response = await apiClient.get("/clients/statistics", { params });

      console.log('📊 Statistics response:', response.data);

      // Extract the data based on backend response structure
      const statisticsData = response.data.Data || response.data.data || response.data;

      dispatch({
        type: CLIENTS_ACTIONS.SET_STATISTICS,
        payload: statisticsData,
      });

      return response.data;
    } catch (error) {
      console.error('❌ Statistics API error:', error);
      
      // Try fallback to basic statistics if main endpoint fails
      try {
        console.log('🔄 Trying basic statistics endpoint...');
        const basicResponse = await apiClient.get("/clients/statistics/basic");
        console.log('📊 Basic statistics response:', basicResponse.data);
        
        const basicData = basicResponse.data.Data || basicResponse.data.data || basicResponse.data;
        
        // Map basic response to expected structure
        const mappedBasicStats = {
          TotalClients: basicData.TotalClients || 0,
          ClientTypes: {
            Individual: 0,
            Business: 0,
            Other: 0
          },
          ClientsThisMonth: basicData.ClientsThisMonth || 0,
          Categories: [],
          Currencies: [],
          MonthlyGrowth: [],
          DateRange: null,
          GeneratedAt: basicData.GeneratedAt || new Date().toISOString(),
          CompanyId: basicData.CompanyId || null,
        };

        dispatch({
          type: CLIENTS_ACTIONS.SET_STATISTICS,
          payload: mappedBasicStats,
        });

        return basicResponse.data;
      } catch (basicError) {
        console.error('❌ Basic statistics also failed:', basicError);
        handleApiError(error); // Use original error
      }
    }
  }, [handleApiError]);

  // ADDED: Get basic client statistics (fallback)
  const getBasicClientStatistics = useCallback(async () => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const response = await apiClient.get("/clients/statistics/basic");
      const basicData = response.data.Data || response.data.data || response.data;
      
      // Map basic response to expected structure
      const mappedBasicStats = {
        TotalClients: basicData.TotalClients || 0,
        ClientTypes: {
          Individual: 0,
          Business: 0,
          Other: 0
        },
        ClientsThisMonth: basicData.ClientsThisMonth || 0,
        Categories: [],
        Currencies: [],
        MonthlyGrowth: [],
        DateRange: null,
        GeneratedAt: basicData.GeneratedAt || new Date().toISOString(),
        CompanyId: basicData.CompanyId || null,
      };

      dispatch({
        type: CLIENTS_ACTIONS.SET_STATISTICS,
        payload: mappedBasicStats,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // ADDED: Get client type statistics
  const getClientTypeStatistics = useCallback(async () => {
    try {
      dispatch({ type: CLIENTS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });

      const response = await apiClient.get("/clients/statistics/types");
      const typeData = response.data.Data || response.data.data || response.data;
      
      // Map type response to expected structure
      const mappedTypeStats = {
        TotalClients: typeData.TotalClients || 0,
        ClientTypes: {
          Individual: typeData.Individual || 0,
          Business: typeData.Business || 0,
          Other: typeData.Other || 0
        },
        ClientsThisMonth: 0,
        Categories: [],
        Currencies: [],
        MonthlyGrowth: [],
        DateRange: null,
        GeneratedAt: typeData.GeneratedAt || new Date().toISOString(),
        CompanyId: typeData.CompanyId || null,
      };

      dispatch({
        type: CLIENTS_ACTIONS.SET_STATISTICS,
        payload: mappedTypeStats,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // Enhanced filter and sorting methods
  const setFilters = useCallback((filters) => {
    dispatch({
      type: CLIENTS_ACTIONS.SET_FILTERS,
      payload: filters,
    });
  }, []);

  const setSorting = useCallback((sortBy, sortAscending) => {
    dispatch({
      type: CLIENTS_ACTIONS.SET_SORTING,
      payload: { sortBy, sortAscending },
    });
  }, []);

  const setPagination = useCallback((paginationData) => {
    dispatch({
      type: CLIENTS_ACTIONS.SET_PAGINATION,
      payload: paginationData,
    });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: CLIENTS_ACTIONS.RESET_FILTERS });
  }, []);

  const clearCurrentClient = useCallback(() => {
    dispatch({ type: CLIENTS_ACTIONS.CLEAR_CURRENT_CLIENT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: CLIENTS_ACTIONS.CLEAR_ERROR });
  }, []);

  // Refresh current data
  const refreshClients = useCallback(async () => {
    if (state.lastFetchOptions) {
      return await getClients(state.lastFetchOptions);
    } else {
      return await getClients();
    }
  }, [state.lastFetchOptions, getClients]);

  // Context value with all methods
  const contextValue = {
    // State
    clients: state.clients,
    currentClient: state.currentClient,
    loading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    sorting: state.sorting,
    statistics: state.statistics,
    
    // Core CRUD operations
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    
    // UPDATED: Statistics with multiple endpoints
    getClientStatistics,
    getBasicClientStatistics,
    getClientTypeStatistics,
    
    // State management
    setFilters,
    setSorting,
    setPagination,
    resetFilters,
    clearCurrentClient,
    clearError,
    refreshClients,
    
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
    setSearchFilter: (search) => setFilters({ search }),
    setClientTypeFilter: (clientType) => setFilters({ clientType }),
    setCategoryFilter: (category) => setFilters({ category }),
    setCurrencyFilter: (currency) => setFilters({ currency }),
    setDateRangeFilter: (startDate, endDate) => setFilters({ startDate, endDate }),
    
    // Quick actions
    searchClients: (searchTerm) => {
      setFilters({ search: searchTerm });
      return getClients({ search: searchTerm });
    },
    filterByType: (clientType) => {
      setFilters({ clientType });
      return getClients({ clientType });
    },
    sortClients: (sortBy, sortAscending = true) => {
      setSorting(sortBy, sortAscending);
      return getClients({ sortBy, sortAscending });
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