import React, { createContext, useContext, useReducer } from "react";
import axios from "axios";

// Base URL configuration
const BASE_URL = "https://api.speed-erp.com/api";

// Create axios instance with default configuration
const leaveAttendanceApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
leaveAttendanceApiClient.interceptors.request.use(
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
leaveAttendanceApiClient.interceptors.response.use(
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
  // Leave Types
  leaveTypes: [],

  // Leave Requests
  leaveRequests: [],
  leaveRequestDetail: null,
  leaveRequestsPagination: null,

  // Leave Balance
  leaveBalance: null,

  // Attendance
  attendances: [],
  attendanceDetail: null,
  attendancesPagination: null,
  attendanceSummary: null,

  // Attendance Policies
  attendancePolicies: [],
  attendancePolicyDetail: null,
  activePolicies: [],

  // Loading states
  isLoading: false,
  isLeaveRequestsLoading: false,
  isAttendanceLoading: false,
  isPoliciesLoading: false,
  isProcessing: false,

  // Error state
  error: null,
};

// Action types
const LEAVE_ATTENDANCE_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_LEAVE_REQUESTS_LOADING: "SET_LEAVE_REQUESTS_LOADING",
  SET_ATTENDANCE_LOADING: "SET_ATTENDANCE_LOADING",
  SET_POLICIES_LOADING: "SET_POLICIES_LOADING",
  SET_PROCESSING: "SET_PROCESSING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",

  // Leave Types
  SET_LEAVE_TYPES: "SET_LEAVE_TYPES",

  // Leave Requests
  SET_LEAVE_REQUESTS: "SET_LEAVE_REQUESTS",
  SET_LEAVE_REQUEST_DETAIL: "SET_LEAVE_REQUEST_DETAIL",
  ADD_LEAVE_REQUEST: "ADD_LEAVE_REQUEST",
  UPDATE_LEAVE_REQUEST: "UPDATE_LEAVE_REQUEST",
  REMOVE_LEAVE_REQUEST: "REMOVE_LEAVE_REQUEST",

  // Leave Balance
  SET_LEAVE_BALANCE: "SET_LEAVE_BALANCE",

  // Attendance
  SET_ATTENDANCES: "SET_ATTENDANCES",
  SET_ATTENDANCE_DETAIL: "SET_ATTENDANCE_DETAIL",
  ADD_ATTENDANCE: "ADD_ATTENDANCE",
  UPDATE_ATTENDANCE: "UPDATE_ATTENDANCE",
  SET_ATTENDANCE_SUMMARY: "SET_ATTENDANCE_SUMMARY",

  // Attendance Policies
  SET_ATTENDANCE_POLICIES: "SET_ATTENDANCE_POLICIES",
  SET_ATTENDANCE_POLICY_DETAIL: "SET_ATTENDANCE_POLICY_DETAIL",
  SET_ACTIVE_POLICIES: "SET_ACTIVE_POLICIES",
  ADD_ATTENDANCE_POLICY: "ADD_ATTENDANCE_POLICY",
  UPDATE_ATTENDANCE_POLICY: "UPDATE_ATTENDANCE_POLICY",
  REMOVE_ATTENDANCE_POLICY: "REMOVE_ATTENDANCE_POLICY",
};

// Reducer function
const leaveAttendanceReducer = (state, action) => {
  switch (action.type) {
    case LEAVE_ATTENDANCE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_REQUESTS_LOADING:
      return {
        ...state,
        isLeaveRequestsLoading: action.payload,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_LOADING:
      return {
        ...state,
        isAttendanceLoading: action.payload,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_POLICIES_LOADING:
      return {
        ...state,
        isPoliciesLoading: action.payload,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_PROCESSING:
      return {
        ...state,
        isProcessing: action.payload,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isLeaveRequestsLoading: false,
        isAttendanceLoading: false,
        isPoliciesLoading: false,
        isProcessing: false,
      };

    case LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    // Leave Types
    case LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_TYPES:
      return {
        ...state,
        leaveTypes: action.payload,
        isLoading: false,
        error: null,
      };

    // Leave Requests
    case LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_REQUESTS:
      return {
        ...state,
        leaveRequests: action.payload.requests || action.payload,
        leaveRequestsPagination: action.payload.pagination,
        isLeaveRequestsLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_REQUEST_DETAIL:
      return {
        ...state,
        leaveRequestDetail: action.payload,
        isLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.ADD_LEAVE_REQUEST:
      return {
        ...state,
        leaveRequests: [action.payload, ...state.leaveRequests],
        isLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.UPDATE_LEAVE_REQUEST:
      return {
        ...state,
        leaveRequests: state.leaveRequests.map((request) =>
          request.id === action.payload.id
            ? { ...request, ...action.payload }
            : request
        ),
        leaveRequestDetail:
          state.leaveRequestDetail?.id === action.payload.id
            ? { ...state.leaveRequestDetail, ...action.payload }
            : state.leaveRequestDetail,
        isLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.REMOVE_LEAVE_REQUEST:
      return {
        ...state,
        leaveRequests: state.leaveRequests.filter(
          (request) => request.id !== action.payload
        ),
        leaveRequestDetail:
          state.leaveRequestDetail?.id === action.payload
            ? null
            : state.leaveRequestDetail,
        isLoading: false,
        error: null,
      };

    // Leave Balance
    case LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_BALANCE:
      return {
        ...state,
        leaveBalance: action.payload,
        isLoading: false,
        error: null,
      };

    // Attendance
    case LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCES:
      return {
        ...state,
        attendances: action.payload.attendances || action.payload,
        attendancesPagination: action.payload.pagination,
        isAttendanceLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_DETAIL:
      return {
        ...state,
        attendanceDetail: action.payload,
        isLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.ADD_ATTENDANCE:
      return {
        ...state,
        attendances: [action.payload, ...state.attendances],
        isLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.UPDATE_ATTENDANCE:
      return {
        ...state,
        attendances: state.attendances.map((attendance) =>
          attendance.id === action.payload.id
            ? { ...attendance, ...action.payload }
            : attendance
        ),
        attendanceDetail:
          state.attendanceDetail?.id === action.payload.id
            ? { ...state.attendanceDetail, ...action.payload }
            : state.attendanceDetail,
        isLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_SUMMARY:
      return {
        ...state,
        attendanceSummary: action.payload,
        isLoading: false,
        error: null,
      };

    // Attendance Policies
    case LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_POLICIES:
      return {
        ...state,
        attendancePolicies: action.payload,
        isPoliciesLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_POLICY_DETAIL:
      return {
        ...state,
        attendancePolicyDetail: action.payload,
        isLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.SET_ACTIVE_POLICIES:
      return {
        ...state,
        activePolicies: action.payload,
        isPoliciesLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.ADD_ATTENDANCE_POLICY:
      return {
        ...state,
        attendancePolicies: [action.payload, ...state.attendancePolicies],
        isLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.UPDATE_ATTENDANCE_POLICY:
      return {
        ...state,
        attendancePolicies: state.attendancePolicies.map((policy) =>
          policy.id === action.payload.id
            ? { ...policy, ...action.payload }
            : policy
        ),
        attendancePolicyDetail:
          state.attendancePolicyDetail?.id === action.payload.id
            ? { ...state.attendancePolicyDetail, ...action.payload }
            : state.attendancePolicyDetail,
        isLoading: false,
        error: null,
      };

    case LEAVE_ATTENDANCE_ACTIONS.REMOVE_ATTENDANCE_POLICY:
      return {
        ...state,
        attendancePolicies: state.attendancePolicies.filter(
          (policy) => policy.id !== action.payload
        ),
        attendancePolicyDetail:
          state.attendancePolicyDetail?.id === action.payload
            ? null
            : state.attendancePolicyDetail,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const LeaveAttendanceContext = createContext();

// LeaveAttendanceProvider component
export const LeaveAttendanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leaveAttendanceReducer, initialState);

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
      type: LEAVE_ATTENDANCE_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  };

  // Leave and Attendance API methods
  const leaveAttendanceApi = {
    // ========== LEAVE TYPES ==========
    getLeaveTypes: async () => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.get(
          "/EmployeeLeave/types"
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_TYPES,
          payload: response.data.data || response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== LEAVE BALANCE ==========
    getLeaveBalance: async (employeeId, year = null) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams();
        if (year) params.append("year", year.toString());

        const response = await leaveAttendanceApiClient.get(
          `/EmployeeLeave/balance/${employeeId}?${params}`
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_BALANCE,
          payload: response.data.data || response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== LEAVE REQUESTS ==========
    getLeaveRequests: async (
      employeeId = null,
      status = null,
      leaveType = null,
      year = null
    ) => {
      try {
        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_REQUESTS_LOADING,
          payload: true,
        });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams();
        if (employeeId) params.append("employeeId", employeeId.toString());
        if (status) params.append("status", status);
        if (leaveType) params.append("leaveType", leaveType);
        if (year) params.append("year", year.toString());

        const response = await leaveAttendanceApiClient.get(
          `/EmployeeLeave/requests?${params}`
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_REQUESTS,
          payload: response.data.data || response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getLeaveRequest: async (id) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.get(
          `/EmployeeLeave/requests/${id}`
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_REQUEST_DETAIL,
          payload: response.data.data || response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    createLeaveRequest: async (requestData) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.post(
          "/EmployeeLeave/requests",
          requestData
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.ADD_LEAVE_REQUEST,
          payload: response.data.data || response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    updateLeaveRequest: async (id, requestData) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.put(
          `/EmployeeLeave/requests/${id}`,
          requestData
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.UPDATE_LEAVE_REQUEST,
          payload: { id, ...(response.data.data || response.data) },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    approveLeaveRequest: async (id, approvalData = {}) => {
      try {
        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_PROCESSING,
          payload: true,
        });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.put(
          `/EmployeeLeave/requests/${id}/approve`,
          approvalData
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.UPDATE_LEAVE_REQUEST,
          payload: { id, status: "Approved", ...(response.data.data || {}) },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    rejectLeaveRequest: async (id, rejectionData) => {
      try {
        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_PROCESSING,
          payload: true,
        });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.put(
          `/EmployeeLeave/requests/${id}/reject`,
          rejectionData
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.UPDATE_LEAVE_REQUEST,
          payload: { id, status: "Rejected", ...(response.data.data || {}) },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    deleteLeaveRequest: async (id) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.delete(
          `/EmployeeLeave/requests/${id}`
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.REMOVE_LEAVE_REQUEST,
          payload: id,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== ATTENDANCE ==========
    getAttendances: async (
      fromDate = null,
      toDate = null,
      employeeId = null,
      status = null
    ) => {
      try {
        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_LOADING,
          payload: true,
        });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams();
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate) params.append("toDate", toDate);
        if (employeeId) params.append("employeeId", employeeId.toString());
        if (status) params.append("status", status);

        const response = await leaveAttendanceApiClient.get(
          `/Attendance?${params}`
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCES,
          payload: response.data?.$values,
        });

        return response.data?.$values;
      } catch (error) {
        handleApiError(error);
      }
    },

    getAttendance: async (id) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.get(
          `/Attendance/${id}`
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_DETAIL,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    checkIn: async (checkInData) => {
      try {
        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_PROCESSING,
          payload: true,
        });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.post(
          "/Attendance/checkin",
          checkInData
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.ADD_ATTENDANCE,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    checkOut: async (checkOutData) => {
      try {
        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_PROCESSING,
          payload: true,
        });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.post(
          "/Attendance/checkout",
          checkOutData
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.UPDATE_ATTENDANCE,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getEmployeeAttendanceSummary: async (employeeId, month = 0, year = 0) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());

        const response = await leaveAttendanceApiClient.get(
          `/Attendance/employee/${employeeId}/summary?${params}`
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_SUMMARY,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== ATTENDANCE POLICIES ==========
    getAttendancePolicies: async () => {
      try {
        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_POLICIES_LOADING,
          payload: true,
        });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.get(
          "/AttendancePolicy"
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_POLICIES,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getActivePolicies: async () => {
      try {
        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_POLICIES_LOADING,
          payload: true,
        });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.get(
          "/AttendancePolicy/active"
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_ACTIVE_POLICIES,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    getAttendancePolicy: async (id) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.get(
          `/AttendancePolicy/${id}`
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_POLICY_DETAIL,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    createAttendancePolicy: async (policyData) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.post(
          "/AttendancePolicy",
          policyData
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.ADD_ATTENDANCE_POLICY,
          payload: response.data,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    updateAttendancePolicy: async (id, policyData) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.put(
          `/AttendancePolicy/${id}`,
          policyData
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.UPDATE_ATTENDANCE_POLICY,
          payload: { id, ...response.data },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    deleteAttendancePolicy: async (id) => {
      try {
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });

        const response = await leaveAttendanceApiClient.delete(
          `/AttendancePolicy/${id}`
        );

        dispatch({
          type: LEAVE_ATTENDANCE_ACTIONS.REMOVE_ATTENDANCE_POLICY,
          payload: id,
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // ========== UTILITY METHODS ==========
    clearError: () => {
      dispatch({ type: LEAVE_ATTENDANCE_ACTIONS.CLEAR_ERROR });
    },

    clearLeaveRequestDetail: () => {
      dispatch({
        type: LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_REQUEST_DETAIL,
        payload: null,
      });
    },

    clearAttendanceDetail: () => {
      dispatch({
        type: LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_DETAIL,
        payload: null,
      });
    },

    clearAttendancePolicyDetail: () => {
      dispatch({
        type: LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_POLICY_DETAIL,
        payload: null,
      });
    },

    clearLeaveBalance: () => {
      dispatch({
        type: LEAVE_ATTENDANCE_ACTIONS.SET_LEAVE_BALANCE,
        payload: null,
      });
    },

    clearAttendanceSummary: () => {
      dispatch({
        type: LEAVE_ATTENDANCE_ACTIONS.SET_ATTENDANCE_SUMMARY,
        payload: null,
      });
    },
  };

  // Context value
  const contextValue = {
    // State
    ...state,

    // API methods
    ...leaveAttendanceApi,
  };

  return (
    <LeaveAttendanceContext.Provider value={contextValue}>
      {children}
    </LeaveAttendanceContext.Provider>
  );
};

// Custom hook to use LeaveAttendance context
export const useLeaveAttendance = () => {
  const context = useContext(LeaveAttendanceContext);
  if (!context) {
    throw new Error(
      "useLeaveAttendance must be used within a LeaveAttendanceProvider"
    );
  }
  return context;
};

// Export context for advanced usage
export { LeaveAttendanceContext };

// Export API client for direct usage if needed
export { leaveAttendanceApiClient };
