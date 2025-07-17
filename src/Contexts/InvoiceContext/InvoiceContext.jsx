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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('company');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Initial state
const initialState = {
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 25,
    totalItems: 0,
    totalPages: 0,
  },
  // Filter states
  searchTerm: '',
  status: '',
  clientId: null,
  startDate: null,
  endDate: null,
  dueDateStart: null,
  dueDateEnd: null,
  minAmount: null,
  maxAmount: null,
  currency: '',
  isOverdue: null,
  sortBy: 'InvoiceNumber',
  sortAscending: false,
  // Statistics
  statistics: {
    totalInvoices: 0,
    draftInvoices: 0,
    sentInvoices: 0,
    paidInvoices: 0,
    voidedInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
    outstandingAmount: 0,
    averageInvoiceValue: 0,
    collectionRate: 0,
  },
  agingReport: {
    current: 0,
    days1to30: 0,
    days31to60: 0,
    days61to90: 0,
    over90Days: 0,
    totalOutstanding: 0,
    generatedAt: null,
  },
  clientDetails: null,
};

// Action types
const INVOICES_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_INVOICES: 'SET_INVOICES',
  SET_CURRENT_INVOICE: 'SET_CURRENT_INVOICE',
  CLEAR_CURRENT_INVOICE: 'CLEAR_CURRENT_INVOICE',
  ADD_INVOICE: 'ADD_INVOICE',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  DELETE_INVOICE: 'DELETE_INVOICE',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_STATUS: 'SET_STATUS',
  SET_CLIENT_ID: 'SET_CLIENT_ID',
  SET_DATE_RANGE: 'SET_DATE_RANGE',
  SET_DUE_DATE_RANGE: 'SET_DUE_DATE_RANGE',
  SET_AMOUNT_RANGE: 'SET_AMOUNT_RANGE',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_OVERDUE: 'SET_OVERDUE',
  SET_SORT: 'SET_SORT',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_STATISTICS: 'SET_STATISTICS',
  SET_AGING_REPORT: 'SET_AGING_REPORT',
  SET_CLIENT_DETAILS: 'SET_CLIENT_DETAILS',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Reducer function
const invoicesReducer = (state, action) => {
  switch (action.type) {
    case INVOICES_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case INVOICES_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case INVOICES_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case INVOICES_ACTIONS.SET_INVOICES:
      const invoicesData = action.payload.Data || action.payload.data || action.payload;
      return {
        ...state,
        invoices: Array.isArray(invoicesData) ? invoicesData : [],
        pagination: {
          page: action.payload.Paginations?.CurrentPage || action.payload.page || state.pagination.page,
          pageSize: action.payload.Paginations?.PageSize || action.payload.pageSize || state.pagination.pageSize,
          totalItems: action.payload.Paginations?.TotalItems || action.payload.totalItems || invoicesData.length,
          totalPages: action.payload.Paginations?.TotalPages || action.payload.totalPages || Math.ceil((action.payload.Paginations?.TotalItems || invoicesData.length) / (action.payload.Paginations?.PageSize || state.pagination.pageSize)),
        },
        isLoading: false,
        error: null,
      };

    case INVOICES_ACTIONS.SET_CURRENT_INVOICE:
      return {
        ...state,
        currentInvoice: action.payload,
        isLoading: false,
        error: null,
      };

    case INVOICES_ACTIONS.CLEAR_CURRENT_INVOICE:
      return {
        ...state,
        currentInvoice: null,
      };

    case INVOICES_ACTIONS.ADD_INVOICE:
      return {
        ...state,
        invoices: [action.payload, ...state.invoices],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1,
        },
        isLoading: false,
        error: null,
      };

    case INVOICES_ACTIONS.UPDATE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.Id === action.payload.Id ? action.payload : invoice
        ),
        currentInvoice: state.currentInvoice?.Id === action.payload.Id ? action.payload : state.currentInvoice,
        isLoading: false,
        error: null,
      };

    case INVOICES_ACTIONS.DELETE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.filter(invoice => invoice.Id !== action.payload),
        currentInvoice: state.currentInvoice?.Id === action.payload ? null : state.currentInvoice,
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - 1,
        },
        isLoading: false,
        error: null,
      };

    case INVOICES_ACTIONS.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
        pagination: { ...state.pagination, page: 1 },
      };

    case INVOICES_ACTIONS.SET_STATUS:
      return {
        ...state,
        status: action.payload,
        pagination: { ...state.pagination, page: 1 },
      };

    case INVOICES_ACTIONS.SET_CLIENT_ID:
      return {
        ...state,
        clientId: action.payload,
        pagination: { ...state.pagination, page: 1 },
      };

    case INVOICES_ACTIONS.SET_DATE_RANGE:
      return {
        ...state,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        pagination: { ...state.pagination, page: 1 },
      };

    case INVOICES_ACTIONS.SET_DUE_DATE_RANGE:
      return {
        ...state,
        dueDateStart: action.payload.dueDateStart,
        dueDateEnd: action.payload.dueDateEnd,
        pagination: { ...state.pagination, page: 1 },
      };

    case INVOICES_ACTIONS.SET_AMOUNT_RANGE:
      return {
        ...state,
        minAmount: action.payload.minAmount,
        maxAmount: action.payload.maxAmount,
        pagination: { ...state.pagination, page: 1 },
      };

    case INVOICES_ACTIONS.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload,
        pagination: { ...state.pagination, page: 1 },
      };

    case INVOICES_ACTIONS.SET_OVERDUE:
      return {
        ...state,
        isOverdue: action.payload,
        pagination: { ...state.pagination, page: 1 },
      };

    case INVOICES_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortAscending: action.payload.sortAscending,
        pagination: { ...state.pagination, page: 1 },
      };

    case INVOICES_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case INVOICES_ACTIONS.SET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
        isLoading: false,
        error: null,
      };

    case INVOICES_ACTIONS.SET_AGING_REPORT:
      return {
        ...state,
        agingReport: action.payload,
        isLoading: false,
        error: null,
      };

    case INVOICES_ACTIONS.SET_CLIENT_DETAILS:
      return {
        ...state,
        clientDetails: action.payload,
        isLoading: false,
        error: null,
      };

    case INVOICES_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        searchTerm: '',
        status: '',
        clientId: null,
        startDate: null,
        endDate: null,
        dueDateStart: null,
        dueDateEnd: null,
        minAmount: null,
        maxAmount: null,
        currency: '',
        isOverdue: null,
        sortBy: 'InvoiceNumber',
        sortAscending: false,
        pagination: { ...state.pagination, page: 1 },
      };

    default:
      return state;
  }
};

// Create context
const InvoicesContext = createContext();

// InvoicesProvider component
export const InvoicesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(invoicesReducer, initialState);

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
      type: INVOICES_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }, []);

  // Build query parameters for API calls
  const buildQueryParams = useCallback((options = {}) => {
    const params = {
      page: options.page || state.pagination.page,
      pageSize: options.pageSize || state.pagination.pageSize,
      search: options.search !== undefined ? options.search : state.searchTerm,
      status: options.status !== undefined ? options.status : state.status,
      clientId: options.clientId !== undefined ? options.clientId : state.clientId,
      startDate: options.startDate !== undefined ? options.startDate : state.startDate,
      endDate: options.endDate !== undefined ? options.endDate : state.endDate,
      dueDateStart: options.dueDateStart !== undefined ? options.dueDateStart : state.dueDateStart,
      dueDateEnd: options.dueDateEnd !== undefined ? options.dueDateEnd : state.dueDateEnd,
      minAmount: options.minAmount !== undefined ? options.minAmount : state.minAmount,
      maxAmount: options.maxAmount !== undefined ? options.maxAmount : state.maxAmount,
      currency: options.currency !== undefined ? options.currency : state.currency,
      isOverdue: options.isOverdue !== undefined ? options.isOverdue : state.isOverdue,
      sortBy: options.sortBy || state.sortBy,
      sortAscending: options.sortAscending !== undefined ? options.sortAscending : state.sortAscending,
    };

    // Remove null/undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    return params;
  }, [state]);

  // Invoices API methods
  const invoicesApi = {
    // Get invoices with advanced filtering
    getInvoices: async (options = {}) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const params = buildQueryParams(options);
        const response = await apiClient.get('/invoices', { params });
        
        dispatch({
          type: INVOICES_ACTIONS.SET_INVOICES,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get single invoice by ID
    getInvoice: async (invoiceId) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(`/invoices/${invoiceId}`);
        
        const invoiceData = response.data.Data || response.data.data || response.data;
        
        dispatch({
          type: INVOICES_ACTIONS.SET_CURRENT_INVOICE,
          payload: invoiceData,
        });

        return { data: invoiceData };
      } catch (error) {
        handleApiError(error);
      }
    },

    // Create new invoice
    createInvoice: async (invoiceData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post('/invoices', invoiceData);

        const newInvoice = response.data.Data || response.data.data || response.data;

        dispatch({
          type: INVOICES_ACTIONS.ADD_INVOICE,
          payload: newInvoice,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Update existing invoice
    updateInvoice: async (invoiceId, invoiceData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.put(`/invoices/${invoiceId}`, invoiceData);

        const updatedInvoice = response.data.Data || response.data.data || response.data;

        dispatch({
          type: INVOICES_ACTIONS.UPDATE_INVOICE,
          payload: updatedInvoice,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Delete invoice
    deleteInvoice: async (invoiceId, hardDelete = false) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.delete(`/invoices/${invoiceId}`, {
          params: { hardDelete }
        });
        
        dispatch({
          type: INVOICES_ACTIONS.DELETE_INVOICE,
          payload: invoiceId,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Send invoice to client
    sendInvoice: async (invoiceId, sendData = {}) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post(`/invoices/${invoiceId}/send`, sendData);

        // Update the invoice status in the list
        const updatedInvoice = { ...state.currentInvoice, Status: 'Sent', EmailSent: true };
        dispatch({
          type: INVOICES_ACTIONS.UPDATE_INVOICE,
          payload: updatedInvoice,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Mark invoice as paid
    markInvoiceAsPaid: async (invoiceId, paymentData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post(`/invoices/${invoiceId}/mark-paid`, paymentData);

        // Update the invoice status in the list
        const updatedInvoice = { 
          ...state.currentInvoice, 
          Status: 'Paid', 
          PaidAmount: paymentData.amount,
          BalanceAmount: 0 
        };
        dispatch({
          type: INVOICES_ACTIONS.UPDATE_INVOICE,
          payload: updatedInvoice,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Void invoice
    voidInvoice: async (invoiceId, voidData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post(`/invoices/${invoiceId}/void`, voidData);

        // Update the invoice status in the list
        const updatedInvoice = { ...state.currentInvoice, Status: 'Voided', IsVoided: true };
        dispatch({
          type: INVOICES_ACTIONS.UPDATE_INVOICE,
          payload: updatedInvoice,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get invoice statistics
    getStatistics: async (startDate = null, endDate = null) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get('/invoices/statistics', { params });
        
        const statsData = response.data.Data || response.data.data || response.data;
        
        dispatch({
          type: INVOICES_ACTIONS.SET_STATISTICS,
          payload: statsData,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get aging report
    getAgingReport: async () => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get('/invoices/aging-report');
        
        const agingData = response.data.Data || response.data.data || response.data;
        
        dispatch({
          type: INVOICES_ACTIONS.SET_AGING_REPORT,
          payload: agingData,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Duplicate invoice
    duplicateInvoice: async (invoiceId, duplicateData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post(`/invoices/${invoiceId}/duplicate`, duplicateData);

        const duplicatedInvoice = response.data.Data || response.data.data || response.data;

        dispatch({
          type: INVOICES_ACTIONS.ADD_INVOICE,
          payload: duplicatedInvoice,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get client details for invoice creation
    getClientDetails: async (clientId) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(`/invoices/client-details/${clientId}`);
        
        const clientData = response.data.Data || response.data.data || response.data;
        
        dispatch({
          type: INVOICES_ACTIONS.SET_CLIENT_DETAILS,
          payload: clientData,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Clear current invoice
    clearCurrentInvoice: () => {
      dispatch({ type: INVOICES_ACTIONS.CLEAR_CURRENT_INVOICE });
    },

    // Clear error manually
    clearError: () => {
      dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });
    },

    // Set search term
    setSearchTerm: (searchTerm) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_SEARCH_TERM,
        payload: searchTerm,
      });
    },

    // Set status filter
    setStatus: (status) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_STATUS,
        payload: status,
      });
    },

    // Set client ID filter
    setClientId: (clientId) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_CLIENT_ID,
        payload: clientId,
      });
    },

    // Set date range filter
    setDateRange: (startDate, endDate) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_DATE_RANGE,
        payload: { startDate, endDate },
      });
    },

    // Set due date range filter
    setDueDateRange: (dueDateStart, dueDateEnd) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_DUE_DATE_RANGE,
        payload: { dueDateStart, dueDateEnd },
      });
    },

    // Set amount range filter
    setAmountRange: (minAmount, maxAmount) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_AMOUNT_RANGE,
        payload: { minAmount, maxAmount },
      });
    },

    // Set currency filter
    setCurrency: (currency) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_CURRENCY,
        payload: currency,
      });
    },

    // Set overdue filter
    setOverdue: (isOverdue) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_OVERDUE,
        payload: isOverdue,
      });
    },

    // Set sorting
    setSort: (sortBy, sortAscending) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_SORT,
        payload: { sortBy, sortAscending },
      });
    },

    // Set pagination
    setPagination: (paginationData) => {
      dispatch({
        type: INVOICES_ACTIONS.SET_PAGINATION,
        payload: paginationData,
      });
    },

    // Reset all filters
    resetFilters: () => {
      dispatch({ type: INVOICES_ACTIONS.RESET_FILTERS });
    },

    // Refresh invoices (reload with current filters)
    refreshInvoices: async () => {
      return await invoicesApi.getInvoices();
    },

    // Search invoices (convenience method)
    searchInvoices: async (searchTerm) => {
      invoicesApi.setSearchTerm(searchTerm);
      return await invoicesApi.getInvoices({ searchTerm, page: 1 });
    },

    // Filter by status (convenience method)
    filterByStatus: async (status) => {
      invoicesApi.setStatus(status);
      return await invoicesApi.getInvoices({ status, page: 1 });
    },

    // Filter by client (convenience method)
    filterByClient: async (clientId) => {
      invoicesApi.setClientId(clientId);
      return await invoicesApi.getInvoices({ clientId, page: 1 });
    },

    // Sort invoices (convenience method)
    sortInvoices: async (sortBy, sortAscending = true) => {
      invoicesApi.setSort(sortBy, sortAscending);
      return await invoicesApi.getInvoices({ sortBy, sortAscending, page: 1 });
    },

    // Go to specific page
    goToPage: async (page) => {
      invoicesApi.setPagination({ page });
      return await invoicesApi.getInvoices({ page });
    },

    // Change page size
    changePageSize: async (pageSize) => {
      invoicesApi.setPagination({ pageSize, page: 1 });
      return await invoicesApi.getInvoices({ pageSize, page: 1 });
    },
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // API methods
    ...invoicesApi,

    // Utility methods
    getTotalPages: () => Math.ceil(state.pagination.totalItems / state.pagination.pageSize),
    hasNextPage: () => state.pagination.page < Math.ceil(state.pagination.totalItems / state.pagination.pageSize),
    hasPrevPage: () => state.pagination.page > 1,
    getInvoiceById: (invoiceId) => state.invoices.find(invoice => invoice.Id === invoiceId),
    isInvoiceLoaded: (invoiceId) => state.invoices.some(invoice => invoice.Id === invoiceId),
    
    // Filter helpers
    hasFilters: () => {
      return state.searchTerm || state.status || state.clientId || 
             state.startDate || state.endDate || state.dueDateStart || state.dueDateEnd ||
             state.minAmount || state.maxAmount || state.currency || state.isOverdue !== null;
    },
    getActiveFiltersCount: () => {
      let count = 0;
      if (state.searchTerm) count++;
      if (state.status) count++;
      if (state.clientId) count++;
      if (state.startDate || state.endDate) count++;
      if (state.dueDateStart || state.dueDateEnd) count++;
      if (state.minAmount || state.maxAmount) count++;
      if (state.currency) count++;
      if (state.isOverdue !== null) count++;
      return count;
    },

    // Status helpers
    getInvoicesByStatus: (status) => state.invoices.filter(invoice => invoice.Status === status),
    getOverdueInvoices: () => {
      const today = new Date();
      return state.invoices.filter(invoice => 
        invoice.Status !== 'Paid' && 
        invoice.DueDate && 
        new Date(invoice.DueDate) < today
      );
    },
    
    // Calculate totals
    getTotalInvoiceAmount: () => state.invoices.reduce((total, invoice) => total + (invoice.TotalAmount || 0), 0),
    getTotalPaidAmount: () => state.invoices.reduce((total, invoice) => total + (invoice.PaidAmount || 0), 0),
    getTotalOutstandingAmount: () => state.invoices.reduce((total, invoice) => total + (invoice.BalanceAmount || 0), 0),
  };

  return (
    <InvoicesContext.Provider value={contextValue}>
      {children}
    </InvoicesContext.Provider>
  );
};

// Custom hook to use invoices context
export const useInvoices = () => {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
};

// Export context for advanced usage
export { InvoicesContext };

// Export API client for direct usage if needed
export { apiClient };