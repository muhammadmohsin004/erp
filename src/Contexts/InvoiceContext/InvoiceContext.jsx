import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state for comprehensive invoice management
const initialState = {
  // Invoices
  invoices: [],
  currentInvoice: null,
  
  // Invoice Items
  invoiceItems: [],
  currentInvoiceItem: null,
  
  // Invoice Taxes
  invoiceTaxes: [],
  currentInvoiceTax: null,
  
  // Invoice Item Taxes
  invoiceItemTaxes: [],
  currentInvoiceItemTax: null,
  
  // Common states
  loading: false,
  error: null,
  
  // Pagination for each entity
  invoicesPagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  },
  invoiceItemsPagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  },
  invoiceTaxesPagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  },
  invoiceItemTaxesPagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  },
  
  // Filters for each entity
  invoicesFilters: {
    searchTerm: '',
    sortBy: 'InvoiceNumber',
    sortAscending: true
  },
  invoiceItemsFilters: {
    searchTerm: '',
    sortBy: 'ItemName',
    sortAscending: true
  },
  invoiceTaxesFilters: {
    searchTerm: '',
    sortBy: 'TaxName',
    sortAscending: true
  },
  invoiceItemTaxesFilters: {
    searchTerm: '',
    sortBy: 'Id',
    sortAscending: true
  }
};

// Action types
const actionTypes = {
  // Common actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
  
  // Invoice actions
  SET_INVOICES: 'SET_INVOICES',
  SET_CURRENT_INVOICE: 'SET_CURRENT_INVOICE',
  ADD_INVOICE: 'ADD_INVOICE',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  DELETE_INVOICE: 'DELETE_INVOICE',
  SET_INVOICES_PAGINATION: 'SET_INVOICES_PAGINATION',
  SET_INVOICES_FILTERS: 'SET_INVOICES_FILTERS',
  
  // Invoice Items actions
  SET_INVOICE_ITEMS: 'SET_INVOICE_ITEMS',
  SET_CURRENT_INVOICE_ITEM: 'SET_CURRENT_INVOICE_ITEM',
  ADD_INVOICE_ITEM: 'ADD_INVOICE_ITEM',
  UPDATE_INVOICE_ITEM: 'UPDATE_INVOICE_ITEM',
  DELETE_INVOICE_ITEM: 'DELETE_INVOICE_ITEM',
  SET_INVOICE_ITEMS_PAGINATION: 'SET_INVOICE_ITEMS_PAGINATION',
  SET_INVOICE_ITEMS_FILTERS: 'SET_INVOICE_ITEMS_FILTERS',
  
  // Invoice Taxes actions
  SET_INVOICE_TAXES: 'SET_INVOICE_TAXES',
  SET_CURRENT_INVOICE_TAX: 'SET_CURRENT_INVOICE_TAX',
  ADD_INVOICE_TAX: 'ADD_INVOICE_TAX',
  UPDATE_INVOICE_TAX: 'UPDATE_INVOICE_TAX',
  DELETE_INVOICE_TAX: 'DELETE_INVOICE_TAX',
  SET_INVOICE_TAXES_PAGINATION: 'SET_INVOICE_TAXES_PAGINATION',
  SET_INVOICE_TAXES_FILTERS: 'SET_INVOICE_TAXES_FILTERS',
  
  // Invoice Item Taxes actions
  SET_INVOICE_ITEM_TAXES: 'SET_INVOICE_ITEM_TAXES',
  SET_CURRENT_INVOICE_ITEM_TAX: 'SET_CURRENT_INVOICE_ITEM_TAX',
  ADD_INVOICE_ITEM_TAX: 'ADD_INVOICE_ITEM_TAX',
  UPDATE_INVOICE_ITEM_TAX: 'UPDATE_INVOICE_ITEM_TAX',
  DELETE_INVOICE_ITEM_TAX: 'DELETE_INVOICE_ITEM_TAX',
  SET_INVOICE_ITEM_TAXES_PAGINATION: 'SET_INVOICE_ITEM_TAXES_PAGINATION',
  SET_INVOICE_ITEM_TAXES_FILTERS: 'SET_INVOICE_ITEM_TAXES_FILTERS'
};

// Reducer
const invoiceReducer = (state, action) => {
  switch (action.type) {
    // Common actions
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case actionTypes.RESET_STATE:
      return initialState;
    
    // Invoice actions
    case actionTypes.SET_INVOICES:
      return { 
        ...state, 
        invoices: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_INVOICE:
      return { 
        ...state, 
        currentInvoice: action.payload, 
        loading: false, 
        error: null 
      };
    
  case actionTypes.ADD_INVOICE:
  { const currentData = state.invoices?.Data?.$values || [];
  const updatedData = [...currentData, action.payload];
  return { 
    ...state, 
    invoices: {
      ...state.invoices,
      Data: {
        ...state.invoices?.Data,
        $values: updatedData 
      }
    },
    loading: false,
    error: null
  }; }
    
    case actionTypes.UPDATE_INVOICE:
  { const currentData = state.invoices?.Data?.$values || [];
  const updatedData = currentData.map(item =>
    item.Id === action.payload.Id ? action.payload : item
  );
  return {
    ...state,
    invoices: {
      ...state.invoices,
      Data: {
        ...state.invoices?.Data,
        $values: updatedData
      }
    },
    currentInvoice: state.currentInvoice?.Id === action.payload.Id 
      ? action.payload 
      : state.currentInvoice,
    loading: false,
    error: null
  }; }
    
   case actionTypes.DELETE_INVOICE:
  { const currentData = state.invoices?.Data?.$values || [];
  const updatedData = currentData.filter(
    item => item.Id !== action.payload
  );
  return {
    ...state,
    invoices: {
      ...state.invoices,
      Data: {
        ...state.invoices?.Data,
        $values: updatedData
      }
    },
    currentInvoice: state.currentInvoice?.Id === action.payload 
      ? null 
      : state.currentInvoice,
    loading: false,
    error: null
  }; }
    
    case actionTypes.SET_INVOICES_PAGINATION:
      return { 
        ...state, 
        invoicesPagination: { ...state.invoicesPagination, ...action.payload } 
      };
    
    case actionTypes.SET_INVOICES_FILTERS:
      return { 
        ...state, 
        invoicesFilters: { ...state.invoicesFilters, ...action.payload } 
      };
    
    // Invoice Items actions
    case actionTypes.SET_INVOICE_ITEMS:
      return { 
        ...state, 
        invoiceItems: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_INVOICE_ITEM:
      return { 
        ...state, 
        currentInvoiceItem: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.ADD_INVOICE_ITEM:
      { const currentData = state.invoiceItems?.Data || [];
      const updatedData = [...currentData, action.payload];
      return { 
        ...state, 
        invoiceItems: {
          ...state.invoiceItems,
          Data: updatedData 
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.UPDATE_INVOICE_ITEM:
      { const currentData = state.invoiceItems?.Data || [];
      const updatedData = currentData.map(item =>
        item.Id === action.payload.Id ? action.payload : item
      );
      return {
        ...state,
        invoiceItems: {
          ...state.invoiceItems,
          Data: updatedData
        },
        currentInvoiceItem: state.currentInvoiceItem?.Id === action.payload.Id 
          ? action.payload 
          : state.currentInvoiceItem,
        loading: false,
        error: null
      }; }
    
    case actionTypes.DELETE_INVOICE_ITEM:
      { const currentData = state.invoiceItems?.Data || [];
      const updatedData = currentData.filter(
        item => item.Id !== action.payload
      );
      return {
        ...state,
        invoiceItems: {
          ...state.invoiceItems,
          Data: updatedData
        },
        currentInvoiceItem: state.currentInvoiceItem?.Id === action.payload 
          ? null 
          : state.currentInvoiceItem,
        loading: false,
        error: null
      }; }
    
    case actionTypes.SET_INVOICE_ITEMS_PAGINATION:
      return { 
        ...state, 
        invoiceItemsPagination: { ...state.invoiceItemsPagination, ...action.payload } 
      };
    
    case actionTypes.SET_INVOICE_ITEMS_FILTERS:
      return { 
        ...state, 
        invoiceItemsFilters: { ...state.invoiceItemsFilters, ...action.payload } 
      };
    
    // Invoice Taxes actions
    case actionTypes.SET_INVOICE_TAXES:
      return { 
        ...state, 
        invoiceTaxes: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_INVOICE_TAX:
      return { 
        ...state, 
        currentInvoiceTax: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.ADD_INVOICE_TAX:
      { const currentData = state.invoiceTaxes?.Data || [];
      const updatedData = [...currentData, action.payload];
      return { 
        ...state, 
        invoiceTaxes: {
          ...state.invoiceTaxes,
          Data: updatedData 
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.UPDATE_INVOICE_TAX:
      { const currentData = state.invoiceTaxes?.Data || [];
      const updatedData = currentData.map(item =>
        item.Id === action.payload.Id ? action.payload : item
      );
      return {
        ...state,
        invoiceTaxes: {
          ...state.invoiceTaxes,
          Data: updatedData
        },
        currentInvoiceTax: state.currentInvoiceTax?.Id === action.payload.Id 
          ? action.payload 
          : state.currentInvoiceTax,
        loading: false,
        error: null
      }; }
    
    case actionTypes.DELETE_INVOICE_TAX:
      { const currentData = state.invoiceTaxes?.Data || [];
      const updatedData = currentData.filter(
        item => item.Id !== action.payload
      );
      return {
        ...state,
        invoiceTaxes: {
          ...state.invoiceTaxes,
          Data: updatedData
        },
        currentInvoiceTax: state.currentInvoiceTax?.Id === action.payload 
          ? null 
          : state.currentInvoiceTax,
        loading: false,
        error: null
      }; }
    
    case actionTypes.SET_INVOICE_TAXES_PAGINATION:
      return { 
        ...state, 
        invoiceTaxesPagination: { ...state.invoiceTaxesPagination, ...action.payload } 
      };
    
    case actionTypes.SET_INVOICE_TAXES_FILTERS:
      return { 
        ...state, 
        invoiceTaxesFilters: { ...state.invoiceTaxesFilters, ...action.payload } 
      };
    
    // Invoice Item Taxes actions
    case actionTypes.SET_INVOICE_ITEM_TAXES:
      return { 
        ...state, 
        invoiceItemTaxes: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_INVOICE_ITEM_TAX:
      return { 
        ...state, 
        currentInvoiceItemTax: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.ADD_INVOICE_ITEM_TAX:
      { const currentData = state.invoiceItemTaxes?.Data || [];
      const updatedData = [...currentData, action.payload];
      return { 
        ...state, 
        invoiceItemTaxes: {
          ...state.invoiceItemTaxes,
          Data: updatedData 
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.UPDATE_INVOICE_ITEM_TAX:
      { const currentData = state.invoiceItemTaxes?.Data || [];
      const updatedData = currentData.map(item =>
        item.Id === action.payload.Id ? action.payload : item
      );
      return {
        ...state,
        invoiceItemTaxes: {
          ...state.invoiceItemTaxes,
          Data: updatedData
        },
        currentInvoiceItemTax: state.currentInvoiceItemTax?.Id === action.payload.Id 
          ? action.payload 
          : state.currentInvoiceItemTax,
        loading: false,
        error: null
      }; }
    
    case actionTypes.DELETE_INVOICE_ITEM_TAX:
      { const currentData = state.invoiceItemTaxes?.Data || [];
      const updatedData = currentData.filter(
        item => item.Id !== action.payload
      );
      return {
        ...state,
        invoiceItemTaxes: {
          ...state.invoiceItemTaxes,
          Data: updatedData
        },
        currentInvoiceItemTax: state.currentInvoiceItemTax?.Id === action.payload 
          ? null 
          : state.currentInvoiceItemTax,
        loading: false,
        error: null
      }; }
    
    case actionTypes.SET_INVOICE_ITEM_TAXES_PAGINATION:
      return { 
        ...state, 
        invoiceItemTaxesPagination: { ...state.invoiceItemTaxesPagination, ...action.payload } 
      };
    
    case actionTypes.SET_INVOICE_ITEM_TAXES_FILTERS:
      return { 
        ...state, 
        invoiceItemTaxesFilters: { ...state.invoiceItemTaxesFilters, ...action.payload } 
      };
    
    default:
      return state;
  }
};

// Create context
const InvoiceContext = createContext();

// API base URLs
const API_BASE_URLS = {
  invoices: 'https://api.speed-erp.com/api/Invoices',
  invoiceItems: 'https://api.speed-erp.com/api/InvoiceItems',
  invoiceTaxes: 'https://api.speed-erp.com/api/InvoiceTaxes',
  invoiceItemTaxes: 'https://api.speed-erp.com/api/InvoiceItemTaxes'
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to make API calls with better error handling
const makeApiCall = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    console.log('Making API call to:', url);
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.Message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    
    // Handle specific network errors
    if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      throw new Error('Cannot connect to API server. Please check your internet connection or contact administrator.');
    }
    if (error.message.includes('ERR_NETWORK')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    if (error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('Connection refused. The API server might be down.');
    }
    
    throw error;
  }
};

// Context Provider
export const InvoiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  // Common actions
  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // ============ INVOICES METHODS ============
  
  const getInvoices = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortAscending !== undefined) queryParams.append('sortAscending', params.sortAscending);

      const response = await makeApiCall(`${API_BASE_URLS.invoices}?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_INVOICES, payload: response });
        
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_INVOICES_PAGINATION, payload: {
            CurrentPage: response.Paginations.PageNumber,
            PageNumber: response.Paginations.PageNumber,
            PageSize: response.Paginations.PageSize,
            TotalItems: response.Paginations.TotalItems,
            TotalPages: response.Paginations.TotalPages,
            HasPreviousPage: response.Paginations.PageNumber > 1,
            HasNextPage: response.Paginations.PageNumber < response.Paginations.TotalPages
          }});
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch invoices');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  const getInvoice = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoices}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_INVOICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch invoice');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createInvoice = useCallback(async (invoiceData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URLS.invoices, {
        method: 'POST',
        body: JSON.stringify(invoiceData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_INVOICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create invoice');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateInvoice = useCallback(async (id, invoiceData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoices}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(invoiceData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_INVOICE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update invoice');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteInvoice = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoices}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_INVOICE, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete invoice');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // ============ INVOICE ITEMS METHODS ============
  
  const getInvoiceItems = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortAscending !== undefined) queryParams.append('sortAscending', params.sortAscending);

      const response = await makeApiCall(`${API_BASE_URLS.invoiceItems}?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_INVOICE_ITEMS, payload: response });
        
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_INVOICE_ITEMS_PAGINATION, payload: {
            CurrentPage: response.Paginations.PageNumber,
            PageNumber: response.Paginations.PageNumber,
            PageSize: response.Paginations.PageSize,
            TotalItems: response.Paginations.TotalItems,
            TotalPages: response.Paginations.TotalPages,
            HasPreviousPage: response.Paginations.PageNumber > 1,
            HasNextPage: response.Paginations.PageNumber < response.Paginations.TotalPages
          }});
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch invoice items');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  const getInvoiceItem = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoiceItems}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_INVOICE_ITEM, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch invoice item');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createInvoiceItem = useCallback(async (invoiceItemData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URLS.invoiceItems, {
        method: 'POST',
        body: JSON.stringify(invoiceItemData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_INVOICE_ITEM, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create invoice item');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateInvoiceItem = useCallback(async (id, invoiceItemData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoiceItems}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(invoiceItemData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_INVOICE_ITEM, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update invoice item');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteInvoiceItem = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoiceItems}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_INVOICE_ITEM, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete invoice item');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // ============ INVOICE TAXES METHODS ============
  
  const getInvoiceTaxes = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortAscending !== undefined) queryParams.append('sortAscending', params.sortAscending);

      const response = await makeApiCall(`${API_BASE_URLS.invoiceTaxes}?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_INVOICE_TAXES, payload: response });
        
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_INVOICE_TAXES_PAGINATION, payload: {
            CurrentPage: response.Paginations.PageNumber,
            PageNumber: response.Paginations.PageNumber,
            PageSize: response.Paginations.PageSize,
            TotalItems: response.Paginations.TotalItems,
            TotalPages: response.Paginations.TotalPages,
            HasPreviousPage: response.Paginations.PageNumber > 1,
            HasNextPage: response.Paginations.PageNumber < response.Paginations.TotalPages
          }});
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch invoice taxes');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  const getInvoiceTax = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoiceTaxes}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_INVOICE_TAX, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch invoice tax');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createInvoiceTax = useCallback(async (invoiceTaxData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URLS.invoiceTaxes, {
        method: 'POST',
        body: JSON.stringify(invoiceTaxData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_INVOICE_TAX, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create invoice tax');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateInvoiceTax = useCallback(async (id, invoiceTaxData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoiceTaxes}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(invoiceTaxData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_INVOICE_TAX, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update invoice tax');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteInvoiceTax = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoiceTaxes}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_INVOICE_TAX, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete invoice tax');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // ============ INVOICE ITEM TAXES METHODS ============
  
  const getInvoiceItemTaxes = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);

      const response = await makeApiCall(`${API_BASE_URLS.invoiceItemTaxes}?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_INVOICE_ITEM_TAXES, payload: response });
        
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_INVOICE_ITEM_TAXES_PAGINATION, payload: {
            CurrentPage: response.Paginations.PageNumber,
            PageNumber: response.Paginations.PageNumber,
            PageSize: response.Paginations.PageSize,
            TotalItems: response.Paginations.TotalItems,
            TotalPages: response.Paginations.TotalPages,
            HasPreviousPage: response.Paginations.PageNumber > 1,
            HasNextPage: response.Paginations.PageNumber < response.Paginations.TotalPages
          }});
        }
      } else {
        throw new Error(response.Message || 'Failed to fetch invoice item taxes');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  const getInvoiceItemTax = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoiceItemTaxes}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_INVOICE_ITEM_TAX, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch invoice item tax');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createInvoiceItemTax = useCallback(async (invoiceItemTaxData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URLS.invoiceItemTaxes, {
        method: 'POST',
        body: JSON.stringify(invoiceItemTaxData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_INVOICE_ITEM_TAX, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create invoice item tax');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateInvoiceItemTax = useCallback(async (id, invoiceItemTaxData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoiceItemTaxes}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(invoiceItemTaxData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_INVOICE_ITEM_TAX, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update invoice item tax');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteInvoiceItemTax = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.invoiceItemTaxes}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_INVOICE_ITEM_TAX, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete invoice item tax');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Context value with all methods and state
  const value = {
    // Common state
    loading: state.loading,
    error: state.error,
    
    // Invoices
    invoices: state.invoices,
    currentInvoice: state.currentInvoice,
    invoicesPagination: state.invoicesPagination,
    invoicesFilters: state.invoicesFilters,
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    
    // Invoice Items
    invoiceItems: state.invoiceItems,
    currentInvoiceItem: state.currentInvoiceItem,
    invoiceItemsPagination: state.invoiceItemsPagination,
    invoiceItemsFilters: state.invoiceItemsFilters,
    getInvoiceItems,
    getInvoiceItem,
    createInvoiceItem,
    updateInvoiceItem,
    deleteInvoiceItem,
    
    // Invoice Taxes
    invoiceTaxes: state.invoiceTaxes,
    currentInvoiceTax: state.currentInvoiceTax,
    invoiceTaxesPagination: state.invoiceTaxesPagination,
    invoiceTaxesFilters: state.invoiceTaxesFilters,
    getInvoiceTaxes,
    getInvoiceTax,
    createInvoiceTax,
    updateInvoiceTax,
    deleteInvoiceTax,
    
    // Invoice Item Taxes
    invoiceItemTaxes: state.invoiceItemTaxes,
    currentInvoiceItemTax: state.currentInvoiceItemTax,
    invoiceItemTaxesPagination: state.invoiceItemTaxesPagination,
    invoiceItemTaxesFilters: state.invoiceItemTaxesFilters,
    getInvoiceItemTaxes,
    getInvoiceItemTax,
    createInvoiceItemTax,
    updateInvoiceItemTax,
    deleteInvoiceItemTax,
    
    // Common actions
    clearError,
    setLoading,
    resetState
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

// Custom hook to use the invoice context
export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

// Export context for direct access if needed
export { InvoiceContext };