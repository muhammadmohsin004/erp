import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

const API_BASE_URL = "https://api.speed-erp.com/api";

// API Routes
const ADD_EMPLOYEE = "/Employee";
const GET_EMPLOYEES = "/Employee";
const UPDATE_EMPLOYEE = "/Employee";
const DELETE_EMPLOYEE = "/Employee";

// API Routes - Salary Management
const GET_ALL_SALARY_COMPONENTS = "/SalaryComponent";
const GET_SALARY_COMPONENTS_PAGINATED = "/SalaryComponent"; // New paginated endpoint
const GET_EMPLOYEE_SALARY_BY_EMP_ID = (employeeId) =>
  `/EmployeeSalaryComponent/employee/${employeeId}`;
const GET_EMPLOYEE_SALARY_BY_ID = (id) => `/EmployeeSalaryComponent/${id}`;
const ADD_EMPLOYEE_SALARY = "/EmployeeSalaryComponent";
const UPDATE_EMPLOYEE_SALARY = (id) => `/EmployeeSalaryComponent/${id}`;
const DELETE_EMPLOYEE_SALARY = (id) => `/EmployeeSalaryComponent/${id}`;

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage
    .getItem("token")
    ?.trim()
    ?.replace(/^["']|["']$/g, "");
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }
  return token;
};

// API service functions with token handling
const apiGet = async (endpoint, config = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const apiPost = async (endpoint, data, config = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const apiPut = async (endpoint, data, config = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const apiDelete = async (endpoint, config = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Initial state
const initialState = {
  employees: [],
  salaryComponents: [],
  employeeSalaries: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  // New pagination state for salary components
  salaryComponentsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50,
  },
  filters: {
    search: "",
    status: "all",
    branch: "all",
    role: "all",
  },
  selectedEmployee: null,
  formMode: "create", // 'create', 'edit', 'view'
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_EMPLOYEES: "SET_EMPLOYEES",
  SET_SALARY_COMPONENTS: "SET_SALARY_COMPONENTS",
  SET_EMPLOYEE_SALARIES: "SET_EMPLOYEE_SALARIES",
  ADD_EMPLOYEE: "ADD_EMPLOYEE",
  UPDATE_EMPLOYEE: "UPDATE_EMPLOYEE",
  DELETE_EMPLOYEE: "DELETE_EMPLOYEE",
  ADD_EMPLOYEE_SALARY: "ADD_EMPLOYEE_SALARY",
  UPDATE_EMPLOYEE_SALARY: "UPDATE_EMPLOYEE_SALARY",
  DELETE_EMPLOYEE_SALARY: "DELETE_EMPLOYEE_SALARY",
  SET_PAGINATION: "SET_PAGINATION",
  SET_SALARY_COMPONENTS_PAGINATION: "SET_SALARY_COMPONENTS_PAGINATION", // New action
  SET_FILTERS: "SET_FILTERS",
  SET_SELECTED_EMPLOYEE: "SET_SELECTED_EMPLOYEE",
  SET_FORM_MODE: "SET_FORM_MODE",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const hrReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.SET_EMPLOYEES:
      return { ...state, employees: action.payload, loading: false };

    case actionTypes.SET_SALARY_COMPONENTS:
      return { ...state, salaryComponents: action.payload, loading: false };

    case actionTypes.SET_EMPLOYEE_SALARIES:
      return { ...state, employeeSalaries: action.payload, loading: false };

    case actionTypes.ADD_EMPLOYEE:
      return {
        ...state,
        employees: [action.payload, ...state.employees],
        loading: false,
      };

    case actionTypes.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map((emp) =>
          emp.id === action.payload.id ? action.payload : emp
        ),
        loading: false,
      };

    case actionTypes.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter((emp) => emp.id !== action.payload),
        loading: false,
      };

    case actionTypes.ADD_EMPLOYEE_SALARY:
      return {
        ...state,
        employeeSalaries: [action.payload, ...state.employeeSalaries],
        loading: false,
      };

    case actionTypes.UPDATE_EMPLOYEE_SALARY:
      return {
        ...state,
        employeeSalaries: state.employeeSalaries.map((salary) =>
          salary.Id === action.payload.Id ? action.payload : salary
        ),
        loading: false,
      };

    case actionTypes.DELETE_EMPLOYEE_SALARY:
      return {
        ...state,
        employeeSalaries: state.employeeSalaries.filter(
          (salary) => salary.Id !== action.payload
        ),
        loading: false,
      };

    case actionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case actionTypes.SET_SALARY_COMPONENTS_PAGINATION:
      return {
        ...state,
        salaryComponentsPagination: {
          ...state.salaryComponentsPagination,
          ...action.payload,
        },
      };

    case actionTypes.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case actionTypes.SET_SELECTED_EMPLOYEE:
      return { ...state, selectedEmployee: action.payload };

    case actionTypes.SET_FORM_MODE:
      return { ...state, formMode: action.payload };

    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// Create context
const HRContext = createContext();

// Provider component
export const HRProvider = ({ children }) => {
  const [state, dispatch] = useReducer(hrReducer, initialState);

  // Helper functions
  const setLoading = (loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  const fetchEmployees = useCallback(
    async (page = 1, filters = {}) => {
      try {
        setLoading(true);

        const params = {
          page,
          limit: state.pagination.itemsPerPage,
          ...filters,
        };

        const response = await apiGet(GET_EMPLOYEES, { params });

        if (response.data?.Success) {
          const employees = response.data.Data?.$values || [];
          const pagination = response.data.Paginations;

          dispatch({
            type: actionTypes.SET_EMPLOYEES,
            payload: employees,
          });

          dispatch({
            type: actionTypes.SET_PAGINATION,
            payload: {
              currentPage: pagination?.CurrentPage || 1,
              totalPages: pagination?.TotalPages || 1,
              totalItems: pagination?.TotalItems || 0,
            },
          });
        } else {
          throw new Error(
            response.data?.Message || "Failed to fetch employees"
          );
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    },
    [state.pagination.itemsPerPage]
  );

  const createEmployee = useCallback(async (employeeData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Append form data
      Object.entries(employeeData).forEach(([key, value]) => {
        if (key === "Image" && value instanceof File) {
          formData.append("Image", value);
        } else if (key === "AccessibleBranches" && Array.isArray(value)) {
          value.forEach((branch) =>
            formData.append("AccessibleBranches", branch)
          );
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await apiPost(ADD_EMPLOYEE, formData);

      // Fix: Check for Success field instead of Status
      if (response.data?.Success === true && response.data?.Data?.Id) {
        dispatch({
          type: actionTypes.ADD_EMPLOYEE,
          payload: response.data.Data,
        });
        return { success: true, data: response.data.Data };
      } else {
        throw new Error(response.data?.Message || "Failed to create employee");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error creating employee:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false); // Don't forget to set loading to false
    }
  }, []);

  const updateEmployee = useCallback(async (employeeId, employeeData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Append form data
      Object.entries(employeeData).forEach(([key, value]) => {
        if (key === "Image" && value instanceof File) {
          formData.append("Image", value);
        } else if (key === "AccessibleBranches" && Array.isArray(value)) {
          value.forEach((branch) =>
            formData.append("AccessibleBranches", branch)
          );
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await apiPut(
        `${UPDATE_EMPLOYEE}/${employeeId}`,
        formData
      );

      // Fix: Check for Success field instead of Status
      if (response.data?.Success === true) {
        dispatch({
          type: actionTypes.UPDATE_EMPLOYEE,
          payload: response.data.Data,
        });
        return { success: true, data: response.data.Data };
      } else {
        throw new Error(response.data?.Message || "Failed to update employee");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error updating employee:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false); // Don't forget to set loading to false
    }
  }, []);

  const deleteEmployee = useCallback(async (employeeId) => {
    try {
      setLoading(true);

      const response = await apiDelete(`${DELETE_EMPLOYEE}/${employeeId}`);

      if (response.data?.Status === 200) {
        dispatch({
          type: actionTypes.DELETE_EMPLOYEE,
          payload: employeeId,
        });
        return { success: true };
      } else {
        throw new Error(response.data?.Message || "Failed to delete employee");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error deleting employee:", error);
      return { success: false, error: error.message };
    }
  }, []);

  // Filter and pagination functions
  const setFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
  }, []);

  const setPagination = useCallback((pagination) => {
    dispatch({ type: actionTypes.SET_PAGINATION, payload: pagination });
  }, []);

  const setSalaryComponentsPagination = useCallback((pagination) => {
    dispatch({
      type: actionTypes.SET_SALARY_COMPONENTS_PAGINATION,
      payload: pagination,
    });
  }, []);

  const setSelectedEmployee = useCallback((employee) => {
    dispatch({ type: actionTypes.SET_SELECTED_EMPLOYEE, payload: employee });
  }, []);

  const setFormMode = useCallback((mode) => {
    dispatch({ type: actionTypes.SET_FORM_MODE, payload: mode });
  }, []);

  // Search and filter employees
  const searchEmployees = useCallback(
    (searchTerm) => {
      setFilters({ search: searchTerm });
      fetchEmployees(1, { ...state.filters, search: searchTerm });
    },
    [fetchEmployees, state.filters]
  );

  const filterEmployees = useCallback(
    (filterType, filterValue) => {
      const newFilters = { ...state.filters, [filterType]: filterValue };
      setFilters(newFilters);
      fetchEmployees(1, newFilters);
    },
    [fetchEmployees, state.filters]
  );

  // Salary Component Functions
  const fetchEmployeeSalaries = useCallback(async (employeeId) => {
    try {
      setLoading(true);
      const response = await apiGet(GET_EMPLOYEE_SALARY_BY_EMP_ID(employeeId));

      if (response.data?.Success) {
        const salaries = response.data.Data?.$values || [];
        dispatch({
          type: actionTypes.SET_EMPLOYEE_SALARIES,
          payload: salaries,
        });
        return salaries;
      } else {
        throw new Error(
          response.data?.Message || "Failed to fetch employee salaries"
        );
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching employee salaries:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSalaryComponents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet(GET_ALL_SALARY_COMPONENTS);

      if (response.data?.Success) {
        const components =
          response.data.Data?.Items?.$values ||
          response.data.Data?.$values ||
          [];
        dispatch({
          type: actionTypes.SET_SALARY_COMPONENTS,
          payload: components,
        });
        return components;
      } else {
        throw new Error(
          response.data?.Message || "Failed to fetch salary components"
        );
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching salary components:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // New function for paginated salary components
  const fetchSalaryComponentsPaginated = useCallback(
    async (page = 1, pageSize = 50) => {
      try {
        setLoading(true);

        const params = {
          page,
          pageSize,
        };

        const response = await apiGet(GET_SALARY_COMPONENTS_PAGINATED, {
          params,
        });

        if (response.data?.Success) {
          const components = response.data.Data?.Items?.$values || [];
          const pagination = response.data.Data;

          dispatch({
            type: actionTypes.SET_SALARY_COMPONENTS,
            payload: components,
          });

          dispatch({
            type: actionTypes.SET_SALARY_COMPONENTS_PAGINATION,
            payload: {
              currentPage: pagination?.Page || 1,
              totalPages: pagination?.TotalPages || 1,
              totalItems: pagination?.TotalItems || 0,
              itemsPerPage: pagination?.PageSize || 50,
            },
          });

          return {
            components,
            pagination: {
              currentPage: pagination?.Page || 1,
              totalPages: pagination?.TotalPages || 1,
              totalItems: pagination?.TotalItems || 0,
              itemsPerPage: pagination?.PageSize || 50,
            },
          };
        } else {
          throw new Error(
            response.data?.Message || "Failed to fetch salary components"
          );
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching salary components:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createEmployeeSalary = useCallback(async (salaryData) => {
    try {
      setLoading(true);
      const response = await apiPost(ADD_EMPLOYEE_SALARY, salaryData);

      if (response.data?.Success) {
        const newSalary = response.data.Data;
        dispatch({
          type: actionTypes.ADD_EMPLOYEE_SALARY,
          payload: newSalary,
        });
        return newSalary;
      } else {
        throw new Error(
          response.data?.Message || "Failed to create employee salary"
        );
      }
    } catch (error) {
      setError(error.message);
      console.error("Error creating employee salary:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployeeSalary = useCallback(async (id, salaryData) => {
    try {
      setLoading(true);
      const response = await apiPut(UPDATE_EMPLOYEE_SALARY(id), salaryData);

      if (response.data?.Success) {
        const updatedSalary = response.data.Data;
        dispatch({
          type: actionTypes.UPDATE_EMPLOYEE_SALARY,
          payload: updatedSalary,
        });
        return updatedSalary;
      } else {
        throw new Error(
          response.data?.Message || "Failed to update employee salary"
        );
      }
    } catch (error) {
      setError(error.message);
      console.error("Error updating employee salary:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployeeSalary = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await apiDelete(DELETE_EMPLOYEE_SALARY(id));

      if (response.data?.Success) {
        dispatch({
          type: actionTypes.DELETE_EMPLOYEE_SALARY,
          payload: id,
        });
        return { success: true };
      } else {
        throw new Error(
          response.data?.Message || "Failed to delete employee salary"
        );
      }
    } catch (error) {
      setError(error.message);
      console.error("Error deleting employee salary:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Pagination handlers
  const goToPage = useCallback(
    (page) => {
      setPagination({ currentPage: page });
      fetchEmployees(page, state.filters);
    },
    [fetchEmployees, state.filters]
  );

  const goToNextPage = useCallback(() => {
    if (state.pagination.currentPage < state.pagination.totalPages) {
      const nextPage = state.pagination.currentPage + 1;
      goToPage(nextPage);
    }
  }, [state.pagination.currentPage, state.pagination.totalPages, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (state.pagination.currentPage > 1) {
      const prevPage = state.pagination.currentPage - 1;
      goToPage(prevPage);
    }
  }, [state.pagination.currentPage, goToPage]);

  // New pagination handlers for salary components
  const goToSalaryComponentsPage = useCallback(
    (page) => {
      setSalaryComponentsPagination({ currentPage: page });
      fetchSalaryComponentsPaginated(
        page,
        state.salaryComponentsPagination.itemsPerPage
      );
    },
    [
      fetchSalaryComponentsPaginated,
      state.salaryComponentsPagination.itemsPerPage,
    ]
  );

  const goToNextSalaryComponentsPage = useCallback(() => {
    if (
      state.salaryComponentsPagination.currentPage <
      state.salaryComponentsPagination.totalPages
    ) {
      const nextPage = state.salaryComponentsPagination.currentPage + 1;
      goToSalaryComponentsPage(nextPage);
    }
  }, [
    state.salaryComponentsPagination.currentPage,
    state.salaryComponentsPagination.totalPages,
    goToSalaryComponentsPage,
  ]);

  const goToPreviousSalaryComponentsPage = useCallback(() => {
    if (state.salaryComponentsPagination.currentPage > 1) {
      const prevPage = state.salaryComponentsPagination.currentPage - 1;
      goToSalaryComponentsPage(prevPage);
    }
  }, [state.salaryComponentsPagination.currentPage, goToSalaryComponentsPage]);

  // Utility functions
  const formatCurrency = useCallback((amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  }, []);

  // Context value
  const value = {
    // State
    ...state,

    // API functions
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,

    // Salary functions
    fetchEmployeeSalaries,
    fetchSalaryComponents,
    fetchSalaryComponentsPaginated, // New function
    createEmployeeSalary,
    updateEmployeeSalary,
    deleteEmployeeSalary,

    // Utility functions
    setFilters,
    setPagination,
    setSalaryComponentsPagination, // New function
    setSelectedEmployee,
    setFormMode,
    searchEmployees,
    filterEmployees,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToSalaryComponentsPage, // New function
    goToNextSalaryComponentsPage, // New function
    goToPreviousSalaryComponentsPage, // New function
    clearError,
    formatCurrency,
    formatDate,

    // Helper functions
    setLoading,
    setError,
  };

  return <HRContext.Provider value={value}>{children}</HRContext.Provider>;
};

// Custom hook to use HR context
export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error("useHR must be used within an HRProvider");
  }
  return context;
};

export default HRContext;
