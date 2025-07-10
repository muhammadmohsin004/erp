import React, { createContext, useContext, useReducer } from "react";
import axios from "axios";

// Base URL configuration
const BASE_URL = "https://api.speed-erp.com/api";

// Create axios instance with default configuration
const salaryApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
salaryApiClient.interceptors.request.use(
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
salaryApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("company");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Initial state
const initialState = {
  // Salary Components
  salaryComponents: [],
  salaryComponentDetail: null,
  salaryComponentsPagination: null,
  componentTypes: [],
  calculationTypes: [],

  // Salaries
  salaries: [],
  salaryDetail: null,
  salariesPagination: null,
  payslipData: null,

  // Overtime
  overtimeRecords: [],
  overtimeDetail: null,
  overtimePagination: null,
  pendingOvertimeApprovals: [],
  overtimeSummary: null,

  // Loading states
  isLoading: false,
  isSalaryComponentsLoading: false,
  isSalariesLoading: false,
  isOvertimeLoading: false,
  isProcessing: false,

  // Error state
  error: null,
};

// Action types
const SALARY_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_SALARY_COMPONENTS_LOADING: "SET_SALARY_COMPONENTS_LOADING",
  SET_SALARIES_LOADING: "SET_SALARIES_LOADING",
  SET_OVERTIME_LOADING: "SET_OVERTIME_LOADING",
  SET_PROCESSING: "SET_PROCESSING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",

  // Salary Components
  SET_SALARY_COMPONENTS: "SET_SALARY_COMPONENTS",
  SET_SALARY_COMPONENT_DETAIL: "SET_SALARY_COMPONENT_DETAIL",
  ADD_SALARY_COMPONENT: "ADD_SALARY_COMPONENT",
  UPDATE_SALARY_COMPONENT: "UPDATE_SALARY_COMPONENT",
  REMOVE_SALARY_COMPONENT: "REMOVE_SALARY_COMPONENT",
  SET_COMPONENT_TYPES: "SET_COMPONENT_TYPES",
  SET_CALCULATION_TYPES: "SET_CALCULATION_TYPES",

  // Salaries
  SET_SALARIES: "SET_SALARIES",
  SET_SALARY_DETAIL: "SET_SALARY_DETAIL",
  ADD_SALARY: "ADD_SALARY",
  UPDATE_SALARY: "UPDATE_SALARY",
  REMOVE_SALARY: "REMOVE_SALARY",
  SET_PAYSLIP_DATA: "SET_PAYSLIP_DATA",

  // Overtime
  SET_OVERTIME_RECORDS: "SET_OVERTIME_RECORDS",
  SET_OVERTIME_DETAIL: "SET_OVERTIME_DETAIL",
  ADD_OVERTIME_RECORD: "ADD_OVERTIME_RECORD",
  UPDATE_OVERTIME_RECORD: "UPDATE_OVERTIME_RECORD",
  REMOVE_OVERTIME_RECORD: "REMOVE_OVERTIME_RECORD",
  SET_PENDING_OVERTIME_APPROVALS: "SET_PENDING_OVERTIME_APPROVALS",
  SET_OVERTIME_SUMMARY: "SET_OVERTIME_SUMMARY",
};

// Reducer function
const salaryReducer = (state, action) => {
  switch (action.type) {
    case SALARY_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case SALARY_ACTIONS.SET_SALARY_COMPONENTS_LOADING:
      return {
        ...state,
        isSalaryComponentsLoading: action.payload,
      };

    case SALARY_ACTIONS.SET_SALARIES_LOADING:
      return {
        ...state,
        isSalariesLoading: action.payload,
      };

    case SALARY_ACTIONS.SET_OVERTIME_LOADING:
      return {
        ...state,
        isOvertimeLoading: action.payload,
      };

    case SALARY_ACTIONS.SET_PROCESSING:
      return {
        ...state,
        isProcessing: action.payload,
      };

    case SALARY_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isSalaryComponentsLoading: false,
        isSalariesLoading: false,
        isOvertimeLoading: false,
        isProcessing: false,
      };

    case SALARY_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    // Salary Components
    case SALARY_ACTIONS.SET_SALARY_COMPONENTS:
      return {
        ...state,
        salaryComponents: action.payload.components,
        salaryComponentsPagination: action.payload.pagination,
        isSalaryComponentsLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.SET_SALARY_COMPONENT_DETAIL:
      return {
        ...state,
        salaryComponentDetail: action.payload,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.ADD_SALARY_COMPONENT:
      return {
        ...state,
        salaryComponents: [action.payload, ...state.salaryComponents],
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.UPDATE_SALARY_COMPONENT:
      return {
        ...state,
        salaryComponents: state.salaryComponents.map((component) =>
          component.id === action.payload.id
            ? { ...component, ...action.payload }
            : component
        ),
        salaryComponentDetail:
          state.salaryComponentDetail?.id === action.payload.id
            ? { ...state.salaryComponentDetail, ...action.payload }
            : state.salaryComponentDetail,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.REMOVE_SALARY_COMPONENT:
      return {
        ...state,
        salaryComponents: state.salaryComponents.filter(
          (component) => component.id !== action.payload
        ),
        salaryComponentDetail:
          state.salaryComponentDetail?.id === action.payload
            ? null
            : state.salaryComponentDetail,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.SET_COMPONENT_TYPES:
      return {
        ...state,
        componentTypes: action.payload,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.SET_CALCULATION_TYPES:
      return {
        ...state,
        calculationTypes: action.payload,
        isLoading: false,
        error: null,
      };

    // Salaries
    case SALARY_ACTIONS.SET_SALARIES:
      return {
        ...state,
        salaries: action.payload.salaries,
        salariesPagination: action.payload.pagination,
        isSalariesLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.SET_SALARY_DETAIL:
      return {
        ...state,
        salaryDetail: action.payload,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.ADD_SALARY:
      return {
        ...state,
        salaries: [action.payload, ...state.salaries],
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.UPDATE_SALARY:
      return {
        ...state,
        salaries: state.salaries.map((salary) =>
          salary.id === action.payload.id
            ? { ...salary, ...action.payload }
            : salary
        ),
        salaryDetail:
          state.salaryDetail?.id === action.payload.id
            ? { ...state.salaryDetail, ...action.payload }
            : state.salaryDetail,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.REMOVE_SALARY:
      return {
        ...state,
        salaries: state.salaries.filter(
          (salary) => salary.id !== action.payload
        ),
        salaryDetail:
          state.salaryDetail?.id === action.payload
            ? null
            : state.salaryDetail,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.SET_PAYSLIP_DATA:
      return {
        ...state,
        payslipData: action.payload,
        isLoading: false,
        error: null,
      };

    // Overtime
    case SALARY_ACTIONS.SET_OVERTIME_RECORDS:
      return {
        ...state,
        overtimeRecords: action.payload.records,
        overtimePagination: action.payload.pagination,
        isOvertimeLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.SET_OVERTIME_DETAIL:
      return {
        ...state,
        overtimeDetail: action.payload,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.ADD_OVERTIME_RECORD:
      return {
        ...state,
        overtimeRecords: [action.payload, ...state.overtimeRecords],
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.UPDATE_OVERTIME_RECORD:
      return {
        ...state,
        overtimeRecords: state.overtimeRecords.map((record) =>
          record.id === action.payload.id
            ? { ...record, ...action.payload }
            : record
        ),
        overtimeDetail:
          state.overtimeDetail?.id === action.payload.id
            ? { ...state.overtimeDetail, ...action.payload }
            : state.overtimeDetail,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.REMOVE_OVERTIME_RECORD:
      return {
        ...state,
        overtimeRecords: state.overtimeRecords.filter(
          (record) => record.id !== action.payload
        ),
        overtimeDetail:
          state.overtimeDetail?.id === action.payload
            ? null
            : state.overtimeDetail,
        isLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.SET_PENDING_OVERTIME_APPROVALS:
      return {
        ...state,
        pendingOvertimeApprovals: action.payload,
        isOvertimeLoading: false,
        error: null,
      };

    case SALARY_ACTIONS.SET_OVERTIME_SUMMARY:
      return {
        ...state,
        overtimeSummary: action.payload,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const SalaryContext = createContext();

// SalaryProvider component
export const SalaryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(salaryReducer, initialState);

  // Helper function to handle API errors
  const handleApiError = (error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data) {
      errorMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: SALARY_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  };

  // Salary API methods
  const salaryApi = {
    // ========== SALARY COMPONENTS ==========
    getSalaryComponents: async (
      type = null,
      isActive = null,
      page = 1,
      pageSize = 50
    ) => {
      try {
        dispatch({
          type: SALARY_ACTIONS.SET_SALARY_COMPONENTS_LOADING,
          payload: true,
        });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (type) params.append("type", type);
        if (isActive !== null) params.append("isActive", isActive.toString());

        const response = await salaryApiClient.get(
          `/SalaryComponent?${params}`
        );

        dispatch({
          type: SALARY_ACTIONS.SET_SALARY_COMPONENTS,
          payload: {
            components: response.data.data?.items || [],
            pagination: {
              totalItems: response.data.data?.totalItems || 0,
              page: response.data.data?.page || page,
              pageSize: response.data.data?.pageSize || pageSize,
              totalPages: response.data.data?.totalPages || 0,
            },
          },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getSalaryComponent: async (id) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.get(`/SalaryComponent/${id}`);

        dispatch({
          type: SALARY_ACTIONS.SET_SALARY_COMPONENT_DETAIL,
          payload: response.data.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    createSalaryComponent: async (componentData) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.post(
          "/SalaryComponent",
          componentData
        );

        dispatch({
          type: SALARY_ACTIONS.ADD_SALARY_COMPONENT,
          payload: response.data.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    updateSalaryComponent: async (id, componentData) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.put(
          `/SalaryComponent/${id}`,
          componentData
        );

        dispatch({
          type: SALARY_ACTIONS.UPDATE_SALARY_COMPONENT,
          payload: { id, ...response.data.data },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    deleteSalaryComponent: async (id) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.delete(`/SalaryComponent/${id}`);

        dispatch({
          type: SALARY_ACTIONS.REMOVE_SALARY_COMPONENT,
          payload: id,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getComponentTypes: async () => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.get("/SalaryComponent/types");

        dispatch({
          type: SALARY_ACTIONS.SET_COMPONENT_TYPES,
          payload: response.data.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getCalculationTypes: async () => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.get(
          "/SalaryComponent/calculation-types"
        );

        dispatch({
          type: SALARY_ACTIONS.SET_CALCULATION_TYPES,
          payload: response.data.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== SALARIES ==========
    getSalaries: async (
      employeeId = null,
      month = null,
      year = null,
      status = null,
      page = 1,
      pageSize = 20
    ) => {
      try {
        dispatch({
          type: SALARY_ACTIONS.SET_SALARIES_LOADING,
          payload: true,
        });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (employeeId) params.append("employeeId", employeeId.toString());
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        if (status) params.append("status", status);

        const response = await salaryApiClient.get(`/Salary?${params}`);

        dispatch({
          type: SALARY_ACTIONS.SET_SALARIES,
          payload: {
            salaries: response.data.data || [],
            pagination: {
              totalItems: response.data.totalItems || 0,
              page: response.data.page || page,
              pageSize: response.data.pageSize || pageSize,
              totalPages: response.data.totalPages || 0,
            },
          },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getSalary: async (id) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.get(`/Salary/${id}`);

        dispatch({
          type: SALARY_ACTIONS.SET_SALARY_DETAIL,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    generateSalary: async (salaryData) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_PROCESSING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.post(
          "/Salary/generate",
          salaryData
        );

        dispatch({
          type: SALARY_ACTIONS.ADD_SALARY,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    processSalary: async (id) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_PROCESSING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.put(`/Salary/${id}/process`);

        dispatch({
          type: SALARY_ACTIONS.UPDATE_SALARY,
          payload: { id, status: "Processed" },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    markSalaryAsPaid: async (id, paymentData) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_PROCESSING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.put(
          `/Salary/${id}/pay`,
          paymentData
        );

        dispatch({
          type: SALARY_ACTIONS.UPDATE_SALARY,
          payload: { id, status: "Paid", ...paymentData },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getPayslip: async (id) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.get(`/Salary/payslip/${id}`);

        dispatch({
          type: SALARY_ACTIONS.SET_PAYSLIP_DATA,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    bulkGenerateSalaries: async (bulkData) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_PROCESSING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.post(
          "/Salary/bulk-generate",
          bulkData
        );

        dispatch({ type: SALARY_ACTIONS.SET_PROCESSING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    deleteSalary: async (id) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.delete(`/Salary/${id}`);

        dispatch({
          type: SALARY_ACTIONS.REMOVE_SALARY,
          payload: id,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== OVERTIME ==========
    getOvertimeRecords: async (
      employeeId = null,
      status = null,
      fromDate = null,
      toDate = null,
      page = 1,
      pageSize = 10
    ) => {
      try {
        dispatch({
          type: SALARY_ACTIONS.SET_OVERTIME_LOADING,
          payload: true,
        });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (employeeId) params.append("employeeId", employeeId.toString());
        if (status) params.append("status", status);
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate) params.append("toDate", toDate);

        const response = await salaryApiClient.get(`/Overtime?${params}`);

        dispatch({
          type: SALARY_ACTIONS.SET_OVERTIME_RECORDS,
          payload: {
            records: response.data.data || [],
            pagination: {
              totalItems: response.data.totalItems || 0,
              page: response.data.page || page,
              pageSize: response.data.pageSize || pageSize,
              totalPages: response.data.totalPages || 0,
            },
          },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getOvertimeRecord: async (id) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.get(`/Overtime/${id}`);

        dispatch({
          type: SALARY_ACTIONS.SET_OVERTIME_DETAIL,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    createOvertimeRecord: async (overtimeData) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.post("/Overtime", overtimeData);

        dispatch({
          type: SALARY_ACTIONS.ADD_OVERTIME_RECORD,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    updateOvertimeRecord: async (id, overtimeData) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.put(
          `/Overtime/${id}`,
          overtimeData
        );

        dispatch({
          type: SALARY_ACTIONS.UPDATE_OVERTIME_RECORD,
          payload: { id, ...response.data },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    approveOvertimeRecord: async (id, approvalData) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_PROCESSING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.put(
          `/Overtime/${id}/approve`,
          approvalData
        );

        dispatch({
          type: SALARY_ACTIONS.UPDATE_OVERTIME_RECORD,
          payload: { id, status: "Approved" },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    rejectOvertimeRecord: async (id, rejectionData) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_PROCESSING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.put(
          `/Overtime/${id}/reject`,
          rejectionData
        );

        dispatch({
          type: SALARY_ACTIONS.UPDATE_OVERTIME_RECORD,
          payload: { id, status: "Rejected" },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    deleteOvertimeRecord: async (id) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.delete(`/Overtime/${id}`);

        dispatch({
          type: SALARY_ACTIONS.REMOVE_OVERTIME_RECORD,
          payload: id,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getPendingOvertimeApprovals: async () => {
      try {
        dispatch({
          type: SALARY_ACTIONS.SET_OVERTIME_LOADING,
          payload: true,
        });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const response = await salaryApiClient.get("/Overtime/pending-approvals");

        dispatch({
          type: SALARY_ACTIONS.SET_PENDING_OVERTIME_APPROVALS,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getEmployeeOvertimeSummary: async (employeeId, month = 0, year = 0) => {
      try {
        dispatch({ type: SALARY_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());

        const response = await salaryApiClient.get(
          `/Overtime/employee/${employeeId}/summary?${params}`
        );

        dispatch({
          type: SALARY_ACTIONS.SET_OVERTIME_SUMMARY,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== UTILITY METHODS ==========
    clearError: () => {
      dispatch({ type: SALARY_ACTIONS.CLEAR_ERROR });
    },

    clearSalaryComponentDetail: () => {
      dispatch({
        type: SALARY_ACTIONS.SET_SALARY_COMPONENT_DETAIL,
        payload: null,
      });
    },

    clearSalaryDetail: () => {
      dispatch({ type: SALARY_ACTIONS.SET_SALARY_DETAIL, payload: null });
    },

    clearOvertimeDetail: () => {
      dispatch({ type: SALARY_ACTIONS.SET_OVERTIME_DETAIL, payload: null });
    },

    clearPayslipData: () => {
      dispatch({ type: SALARY_ACTIONS.SET_PAYSLIP_DATA, payload: null });
    },

    clearOvertimeSummary: () => {
      dispatch({ type: SALARY_ACTIONS.SET_OVERTIME_SUMMARY, payload: null });
    },
  };

  // Context value
  const contextValue = {
    // State
    ...state,

    // API methods
    ...salaryApi,
  };

  return (
    <SalaryContext.Provider value={contextValue}>
      {children}
    </SalaryContext.Provider>
  );
};

// Custom hook to use Salary context
export const useSalary = () => {
  const context = useContext(SalaryContext);
  if (!context) {
    throw new Error("useSalary must be used within a SalaryProvider");
  }
  return context;
};

// Export context for advanced usage
export { SalaryContext };

// Export API client for direct usage if needed
export { salaryApiClient };