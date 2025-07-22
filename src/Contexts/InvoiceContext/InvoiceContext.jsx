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
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 25,
    totalItems: 0,
    totalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false,
  },
  // Filter states
  searchTerm: "",
  status: "",
  clientId: null,
  startDate: null,
  endDate: null,
  dueDateStart: null,
  dueDateEnd: null,
  minAmount: null,
  maxAmount: null,
  currency: "",
  isOverdue: null,
  sortBy: "InvoiceNumber",
  sortAscending: false,
  // Statistics - Updated to match API response structure
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
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_INVOICES: "SET_INVOICES",
  SET_CURRENT_INVOICE: "SET_CURRENT_INVOICE",
  CLEAR_CURRENT_INVOICE: "CLEAR_CURRENT_INVOICE",
  ADD_INVOICE: "ADD_INVOICE",
  UPDATE_INVOICE: "UPDATE_INVOICE",
  DELETE_INVOICE: "DELETE_INVOICE",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_STATUS: "SET_STATUS",
  SET_CLIENT_ID: "SET_CLIENT_ID",
  SET_DATE_RANGE: "SET_DATE_RANGE",
  SET_DUE_DATE_RANGE: "SET_DUE_DATE_RANGE",
  SET_AMOUNT_RANGE: "SET_AMOUNT_RANGE",
  SET_CURRENCY: "SET_CURRENCY",
  SET_OVERDUE: "SET_OVERDUE",
  SET_SORT: "SET_SORT",
  SET_PAGINATION: "SET_PAGINATION",
  SET_STATISTICS: "SET_STATISTICS",
  SET_AGING_REPORT: "SET_AGING_REPORT",
  SET_CLIENT_DETAILS: "SET_CLIENT_DETAILS",
  RESET_FILTERS: "RESET_FILTERS",
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

    case INVOICES_ACTIONS.SET_INVOICES: {
      const invoicesData =
        action.payload.Data || action.payload.data || action.payload;
      const paginationData =
        action.payload.Paginations || action.payload.pagination;

      return {
        ...state,
        invoices: Array.isArray(invoicesData)
          ? invoicesData
          : invoicesData?.$values || [],
        pagination: {
          page:
            paginationData?.CurrentPage ||
            paginationData?.PageNumber ||
            paginationData?.page ||
            state.pagination.page,
          pageSize:
            paginationData?.PageSize ||
            paginationData?.pageSize ||
            state.pagination.pageSize,
          totalItems:
            paginationData?.TotalItems || paginationData?.totalItems || 0,
          totalPages:
            paginationData?.TotalPages || paginationData?.totalPages || 0,
          HasPreviousPage: paginationData?.HasPreviousPage || false,
          HasNextPage: paginationData?.HasNextPage || false,
        },
        isLoading: false,
        error: null,
      };
    }

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
        invoices: state.invoices.map((invoice) =>
          invoice.Id === action.payload.Id ? action.payload : invoice
        ),
        currentInvoice:
          state.currentInvoice?.Id === action.payload.Id
            ? action.payload
            : state.currentInvoice,
        isLoading: false,
        error: null,
      };

    case INVOICES_ACTIONS.DELETE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.filter(
          (invoice) => invoice.Id !== action.payload
        ),
        currentInvoice:
          state.currentInvoice?.Id === action.payload
            ? null
            : state.currentInvoice,
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

    case INVOICES_ACTIONS.SET_STATISTICS: {
      // Convert PascalCase API response to camelCase for component usage
      const apiStats = action.payload.Data || action.payload;
      return {
        ...state,
        statistics: {
          totalInvoices: apiStats.TotalInvoices || 0,
          draftInvoices: apiStats.DraftInvoices || 0,
          sentInvoices: apiStats.SentInvoices || 0,
          paidInvoices: apiStats.PaidInvoices || 0,
          voidedInvoices: apiStats.VoidedInvoices || 0,
          overdueInvoices: apiStats.OverdueInvoices || 0,
          totalRevenue: apiStats.TotalRevenue || 0,
          outstandingAmount: apiStats.OutstandingAmount || 0,
          averageInvoiceValue: apiStats.AverageInvoiceValue || 0,
          collectionRate: apiStats.CollectionRate || 0,
        },
        isLoading: false,
        error: null,
      };
    }

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
        searchTerm: "",
        status: "",
        clientId: null,
        startDate: null,
        endDate: null,
        dueDateStart: null,
        dueDateEnd: null,
        minAmount: null,
        maxAmount: null,
        currency: "",
        isOverdue: null,
        sortBy: "InvoiceNumber",
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

  // Create stable functions that don't change on every render
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
      type: INVOICES_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }, []);

  // Build query parameters for API calls - FIXED: Remove unnecessary dependencies
  const buildQueryParams = useCallback((currentState, options = {}) => {
    const params = {
      page: options.page || currentState.pagination.page,
      pageSize: options.pageSize || currentState.pagination.pageSize,
      search:
        options.search !== undefined ? options.search : currentState.searchTerm,
      status:
        options.status !== undefined ? options.status : currentState.status,
      clientId:
        options.clientId !== undefined
          ? options.clientId
          : currentState.clientId,
      startDate:
        options.startDate !== undefined
          ? options.startDate
          : currentState.startDate,
      endDate:
        options.endDate !== undefined ? options.endDate : currentState.endDate,
      dueDateStart:
        options.dueDateStart !== undefined
          ? options.dueDateStart
          : currentState.dueDateStart,
      dueDateEnd:
        options.dueDateEnd !== undefined
          ? options.dueDateEnd
          : currentState.dueDateEnd,
      minAmount:
        options.minAmount !== undefined
          ? options.minAmount
          : currentState.minAmount,
      maxAmount:
        options.maxAmount !== undefined
          ? options.maxAmount
          : currentState.maxAmount,
      currency:
        options.currency !== undefined
          ? options.currency
          : currentState.currency,
      isOverdue:
        options.isOverdue !== undefined
          ? options.isOverdue
          : currentState.isOverdue,
      sortBy: options.sortBy || currentState.sortBy,
      sortAscending:
        options.sortAscending !== undefined
          ? options.sortAscending
          : currentState.sortAscending,
    };

    // Remove null/undefined values
    Object.keys(params).forEach((key) => {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === ""
      ) {
        delete params[key];
      }
    });

    return params;
  }, []);

  // FIXED: Remove state from dependency array to prevent infinite loops
  const getInvoices = useCallback(
    async (options = {}) => {
      try {
        console.log("=== GET INVOICES DEBUG START ===");
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        // Get current state at the time of function call instead of using state in dependencies
        const currentState = {
          pagination: state.pagination,
          searchTerm: state.searchTerm,
          status: state.status,
          clientId: state.clientId,
          startDate: state.startDate,
          endDate: state.endDate,
          dueDateStart: state.dueDateStart,
          dueDateEnd: state.dueDateEnd,
          minAmount: state.minAmount,
          maxAmount: state.maxAmount,
          currency: state.currency,
          isOverdue: state.isOverdue,
          sortBy: state.sortBy,
          sortAscending: state.sortAscending,
        };

        const params = buildQueryParams(currentState, options);
        console.log("API call params:", params);

        const response = await apiClient.get("/invoices", { params });
        console.log("Raw API response:", response.data);

        // Handle the response structure with $values
        const invoicesData =
          response.data.Data?.$values || response.data.Data || [];

        dispatch({
          type: INVOICES_ACTIONS.SET_INVOICES,
          payload: {
            Data: invoicesData,
            Paginations: response.data.Paginations,
          },
        });

        console.log("=== GET INVOICES DEBUG END ===");
        return invoicesData;
      } catch (error) {
        console.error("=== GET INVOICES ERROR ===", error);
        handleApiError(error);
      }
    },
    [buildQueryParams, handleApiError]
  ); // REMOVED 'state' from dependency array

  const getInvoice = useCallback(
    async (invoiceId) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(`/invoices/${invoiceId}`);
        const invoiceData =
          response.data.Data || response.data.data || response.data;

        dispatch({
          type: INVOICES_ACTIONS.SET_CURRENT_INVOICE,
          payload: invoiceData,
        });

        return { data: invoiceData };
      } catch (error) {
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  const createInvoice = useCallback(
    async (invoiceData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        console.log("=== CREATE INVOICE DEBUG ===");
        console.log("Raw invoice data received:", invoiceData);

        const formattedData = {
          ClientId: parseInt(invoiceData.ClientId),
          InvoiceNumber: invoiceData.InvoiceNumber || null,
          InvoiceDate: invoiceData.InvoiceDate,
          DueDate: invoiceData.DueDate || null,
          Status: invoiceData.Status || "Draft",
          Currency: invoiceData.Currency || "USD",
          ExchangeRate: invoiceData.ExchangeRate || 1,
          PaymentTerms: invoiceData.PaymentTerms || null,
          Notes: invoiceData.Notes || null,
          InternalNotes: invoiceData.InternalNotes || null,
          PurchaseOrderNumber: invoiceData.PurchaseOrderNumber || null,
          DiscountAmount: invoiceData.DiscountAmount || 0,
          ShippingAmount: invoiceData.ShippingAmount || 0,
          IsRecurring: invoiceData.IsRecurring || false,
          Items:
            invoiceData.Items?.map((item) => ({
              ProductId:
                item.ProductId && item.ProductId > 0
                  ? parseInt(item.ProductId)
                  : null,
              ServiceId:
                item.ServiceId && item.ServiceId > 0
                  ? parseInt(item.ServiceId)
                  : null,
              Description: item.Description || item.ItemName || "",
              Quantity: parseFloat(item.Quantity) || 1,
              UnitPrice: parseFloat(item.UnitPrice) || 0,
              Discount: parseFloat(item.Discount) || 0,
              DiscountType: item.DiscountType || "percentage",
              TaxRate: parseFloat(item.TaxRate) || 0,
            })) || [],
        };

        console.log("Formatted data for API:", formattedData);

        if (!formattedData.ClientId || formattedData.ClientId <= 0) {
          throw new Error("Client ID is required and must be valid");
        }

        // if (!formattedData.Items || formattedData.Items.length === 0) {
        //   throw new Error("At least one invoice item is required");
        // }

        const response = await apiClient.post("/invoices", formattedData);
        const newInvoice =
          response.data.Data || response.data.data || response.data;

        dispatch({
          type: INVOICES_ACTIONS.ADD_INVOICE,
          payload: newInvoice,
        });

        return response.data;
      } catch (error) {
        console.error("Create invoice error:", error);
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  const updateInvoice = useCallback(
    async (invoiceId, invoiceData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const formattedData = {
          clientId: invoiceData.clientId,
          invoiceNumber: invoiceData.invoiceNumber,
          invoiceDate: invoiceData.invoiceDate,
          dueDate: invoiceData.dueDate || null,
          status: invoiceData.status,
          currency: invoiceData.currency,
          exchangeRate: invoiceData.exchangeRate,
          paymentTerms: invoiceData.paymentTerms || null,
          notes: invoiceData.notes || null,
          internalNotes: invoiceData.internalNotes || null,
          purchaseOrderNumber: invoiceData.purchaseOrderNumber || null,
          discountAmount: invoiceData.discountAmount || 0,
          shippingAmount: invoiceData.shippingAmount || 0,
          items:
            invoiceData.items?.map((item) => ({
              productId: item.productId > 0 ? item.productId : null,
              serviceId: item.serviceId > 0 ? item.serviceId : null,
              description: item.description || item.itemName,
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice || 0,
              discount: item.discount || 0,
              discountType: item.discountType || "percentage",
              taxRate: item.taxRate || 0,
            })) || [],
        };

        const response = await apiClient.put(
          `/invoices/${invoiceId}`,
          formattedData
        );
        const updatedInvoice =
          response.data.Data || response.data.data || response.data;

        dispatch({
          type: INVOICES_ACTIONS.UPDATE_INVOICE,
          payload: updatedInvoice,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  const deleteInvoice = useCallback(
    async (invoiceId, hardDelete = false) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.delete(`/invoices/${invoiceId}`, {
          params: { hardDelete },
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
    [handleApiError]
  );

  const sendInvoice = useCallback(
    async (invoiceId, sendData = {}) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post(
          `/invoices/${invoiceId}/send`,
          sendData
        );

        // Update the invoice status in the list if we have it
        const currentInvoice = state.invoices.find(
          (inv) => inv.Id === invoiceId
        );
        if (currentInvoice) {
          const updatedInvoice = {
            ...currentInvoice,
            Status: "Sent",
            EmailSent: true,
          };
          dispatch({
            type: INVOICES_ACTIONS.UPDATE_INVOICE,
            payload: updatedInvoice,
          });
        }

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  const markInvoiceAsPaid = useCallback(
    async (invoiceId, paymentData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post(
          `/invoices/${invoiceId}/mark-paid`,
          paymentData
        );

        // Update the invoice status in the list
        const currentInvoice = state.invoices.find(
          (inv) => inv.Id === invoiceId
        );
        if (currentInvoice) {
          const updatedInvoice = {
            ...currentInvoice,
            Status: "Paid",
            PaidAmount: paymentData.amount,
            BalanceAmount: 0,
          };
          dispatch({
            type: INVOICES_ACTIONS.UPDATE_INVOICE,
            payload: updatedInvoice,
          });
        }

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  const voidInvoice = useCallback(
    async (invoiceId, voidData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post(
          `/invoices/${invoiceId}/void`,
          voidData
        );

        // Update the invoice status in the list
        const currentInvoice = state.invoices.find(
          (inv) => inv.Id === invoiceId
        );
        if (currentInvoice) {
          const updatedInvoice = {
            ...currentInvoice,
            Status: "Voided",
            IsVoided: true,
          };
          dispatch({
            type: INVOICES_ACTIONS.UPDATE_INVOICE,
            payload: updatedInvoice,
          });
        }

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  const getStatistics = useCallback(
    async (startDate = null, endDate = null) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await apiClient.get("/invoices/statistics", {
          params,
        });
        console.log("Statistics API response:", response.data);

        dispatch({
          type: INVOICES_ACTIONS.SET_STATISTICS,
          payload: response.data, // This should contain the Data property
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  const getAgingReport = useCallback(async () => {
    try {
      dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

      const response = await apiClient.get("/invoices/aging-report");
      const agingData =
        response.data.Data || response.data.data || response.data;

      dispatch({
        type: INVOICES_ACTIONS.SET_AGING_REPORT,
        payload: agingData,
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  const duplicateInvoice = useCallback(
    async (invoiceId, duplicateData) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post(
          `/invoices/${invoiceId}/duplicate`,
          duplicateData
        );
        const duplicatedInvoice =
          response.data.Data || response.data.data || response.data;

        dispatch({
          type: INVOICES_ACTIONS.ADD_INVOICE,
          payload: duplicatedInvoice,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  const getClientDetails = useCallback(
    async (clientId) => {
      try {
        dispatch({ type: INVOICES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(
          `/invoices/client-details/${clientId}`
        );
        const clientData =
          response.data.Data || response.data.data || response.data;

        dispatch({
          type: INVOICES_ACTIONS.SET_CLIENT_DETAILS,
          payload: clientData,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    [handleApiError]
  );

  // Clear current invoice
  const clearCurrentInvoice = useCallback(() => {
    dispatch({ type: INVOICES_ACTIONS.CLEAR_CURRENT_INVOICE });
  }, []);

  // Clear error manually
  const clearError = useCallback(() => {
    dispatch({ type: INVOICES_ACTIONS.CLEAR_ERROR });
  }, []);

  // Set search term
  const setSearchTerm = useCallback((searchTerm) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_SEARCH_TERM,
      payload: searchTerm,
    });
  }, []);

  // Set status filter
  const setStatus = useCallback((status) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_STATUS,
      payload: status,
    });
  }, []);

  // Set client ID filter
  const setClientId = useCallback((clientId) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_CLIENT_ID,
      payload: clientId,
    });
  }, []);

  // Set date range filter
  const setDateRange = useCallback((startDate, endDate) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_DATE_RANGE,
      payload: { startDate, endDate },
    });
  }, []);

  // Set due date range filter
  const setDueDateRange = useCallback((dueDateStart, dueDateEnd) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_DUE_DATE_RANGE,
      payload: { dueDateStart, dueDateEnd },
    });
  }, []);

  // Set amount range filter
  const setAmountRange = useCallback((minAmount, maxAmount) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_AMOUNT_RANGE,
      payload: { minAmount, maxAmount },
    });
  }, []);

  // Set currency filter
  const setCurrency = useCallback((currency) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_CURRENCY,
      payload: currency,
    });
  }, []);

  // Set overdue filter
  const setOverdue = useCallback((isOverdue) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_OVERDUE,
      payload: isOverdue,
    });
  }, []);

  // Set sorting
  const setSort = useCallback((sortBy, sortAscending) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_SORT,
      payload: { sortBy, sortAscending },
    });
  }, []);

  // Set pagination
  const setPagination = useCallback((paginationData) => {
    dispatch({
      type: INVOICES_ACTIONS.SET_PAGINATION,
      payload: paginationData,
    });
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    dispatch({ type: INVOICES_ACTIONS.RESET_FILTERS });
  }, []);

  // Refresh invoices (reload with current filters) - FIXED: Remove state dependency
  const refreshInvoices = useCallback(async () => {
    return await getInvoices();
  }, [getInvoices]);

  // Search invoices (convenience method)
  const searchInvoices = useCallback(
    async (searchTerm) => {
      setSearchTerm(searchTerm);
      return await getInvoices({ search: searchTerm, page: 1 });
    },
    [getInvoices, setSearchTerm]
  );

  // Filter by status (convenience method)
  const filterByStatus = useCallback(
    async (status) => {
      setStatus(status);
      return await getInvoices({ status, page: 1 });
    },
    [getInvoices, setStatus]
  );

  // Filter by client (convenience method)
  const filterByClient = useCallback(
    async (clientId) => {
      setClientId(clientId);
      return await getInvoices({ clientId, page: 1 });
    },
    [getInvoices, setClientId]
  );

  // Sort invoices (convenience method)
  const sortInvoices = useCallback(
    async (sortBy, sortAscending = true) => {
      setSort(sortBy, sortAscending);
      return await getInvoices({ sortBy, sortAscending, page: 1 });
    },
    [getInvoices, setSort]
  );

  // Go to specific page
  const goToPage = useCallback(
    async (page) => {
      setPagination({ page });
      return await getInvoices({ page });
    },
    [getInvoices, setPagination]
  );

  // Change page size
  const changePageSize = useCallback(
    async (pageSize) => {
      setPagination({ pageSize, page: 1 });
      return await getInvoices({ pageSize, page: 1 });
    },
    [getInvoices, setPagination]
  );

  // Context value with stable functions
  const contextValue = {
    // State
    invoices: state.invoices,
    currentInvoice: state.currentInvoice,
    loading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    searchTerm: state.searchTerm,
    status: state.status,
    clientId: state.clientId,
    startDate: state.startDate,
    endDate: state.endDate,
    dueDateStart: state.dueDateStart,
    dueDateEnd: state.dueDateEnd,
    minAmount: state.minAmount,
    maxAmount: state.maxAmount,
    currency: state.currency,
    isOverdue: state.isOverdue,
    sortBy: state.sortBy,
    sortAscending: state.sortAscending,
    statistics: state.statistics,
    agingReport: state.agingReport,
    clientDetails: state.clientDetails,

    // API methods
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    markInvoiceAsPaid,
    voidInvoice,
    getStatistics,
    getAgingReport,
    duplicateInvoice,
    getClientDetails,
    clearCurrentInvoice,
    clearError,

    // Filter methods
    setSearchTerm,
    setStatus,
    setClientId,
    setDateRange,
    setDueDateRange,
    setAmountRange,
    setCurrency,
    setOverdue,
    setSort,
    setPagination,
    resetFilters,

    // Convenience methods
    refreshInvoices,
    searchInvoices,
    filterByStatus,
    filterByClient,
    sortInvoices,
    goToPage,
    changePageSize,

    // Utility methods
    getTotalPages: () =>
      Math.ceil(state.pagination.totalItems / state.pagination.pageSize),
    hasNextPage: () => state.pagination.HasNextPage,
    hasPrevPage: () => state.pagination.HasPreviousPage,
    getInvoiceById: (invoiceId) =>
      state.invoices.find((invoice) => invoice.Id === invoiceId),
    isInvoiceLoaded: (invoiceId) =>
      state.invoices.some((invoice) => invoice.Id === invoiceId),

    // Filter helpers
    hasFilters: () => {
      return (
        state.searchTerm ||
        state.status ||
        state.clientId ||
        state.startDate ||
        state.endDate ||
        state.dueDateStart ||
        state.dueDateEnd ||
        state.minAmount ||
        state.maxAmount ||
        state.currency ||
        state.isOverdue !== null
      );
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
    getInvoicesByStatus: (status) =>
      state.invoices.filter((invoice) => invoice.Status === status),
    getOverdueInvoices: () => {
      const today = new Date();
      return state.invoices.filter(
        (invoice) =>
          invoice.Status !== "Paid" &&
          invoice.DueDate &&
          new Date(invoice.DueDate) < today
      );
    },

    // Calculate totals - these now calculate from current invoices list
    getTotalInvoiceAmount: () =>
      state.invoices.reduce(
        (total, invoice) => total + (invoice.TotalAmount || 0),
        0
      ),
    getTotalPaidAmount: () =>
      state.invoices.reduce(
        (total, invoice) => total + (invoice.PaidAmount || 0),
        0
      ),
    getTotalOutstandingAmount: () =>
      state.invoices.reduce(
        (total, invoice) => total + (invoice.BalanceAmount || 0),
        0
      ),
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
    throw new Error("useInvoices must be used within an InvoicesProvider");
  }
  return context;
};

// Export context for advanced usage
export { InvoicesContext };

// Export API client for direct usage if needed
export { apiClient };
