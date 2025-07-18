import React, { createContext, useContext, useReducer, useEffect } from 'react';
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
    const token = localStorage.getItem('authToken');
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
  user: null,
  company: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  users: [],
  pagination: null,
  requirePasswordChange: false,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  UPDATE_USER: 'UPDATE_USER',
  SET_USERS: 'SET_USERS',
  UPDATE_COMPANY: 'UPDATE_COMPANY',
  REQUIRE_PASSWORD_CHANGE: 'REQUIRE_PASSWORD_CHANGE',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        company: action.payload.company,
        token: action.payload.token,
        isAuthenticated: true,
        requirePasswordChange: action.payload.requirePasswordChange || false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
      };

    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload.users,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_COMPANY:
      return {
        ...state,
        company: { ...state.company, ...action.payload },
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.REQUIRE_PASSWORD_CHANGE:
      return {
        ...state,
        requirePasswordChange: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        const company = localStorage.getItem('company');

        if (token && user) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              token,
              user: JSON.parse(user),
              company: company ? JSON.parse(company) : null,
              requirePasswordChange: JSON.parse(user).requirePasswordChange === '1',
            },
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('company');
      }
    };

    initializeAuth();
  }, []);

  // Helper function to handle API errors
  const handleApiError = (error) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.validationErrors) {
      errorMessage = error.response.data.validationErrors.join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: AUTH_ACTIONS.SET_ERROR,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  };

  // Auth API methods
  const authApi = {
    // Company Registration
    registerCompany: async (companyData) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post('/auth/register-company', companyData);
        
        dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // User Registration (within company)
    registerUser: async (userData) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post('/auth/register-user', userData);
        
        dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Login
    login: async (credentials) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post('/auth/login', credentials);
        const { token, user, company, requirePasswordChange } = response.data;

        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        if (company) {
          localStorage.setItem('company', JSON.stringify(company));
        }

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            token,
            user,
            company,
            requirePasswordChange,
          },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Logout
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('company');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    },

    // Get Company Users
    getCompanyUsers: async (page = 1, pageSize = 10) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(`/auth/company-users?page=${page}&pageSize=${pageSize}`);
        
        dispatch({
          type: AUTH_ACTIONS.SET_USERS,
          payload: {
            users: response.data.data,
            pagination: response.data.pagination,
          },
        });

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Update User Role
    updateUserRole: async (userId, role) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.put(`/auth/user/${userId}/role`, { role });
        
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Update User Status (Activate/Deactivate)
    updateUserStatus: async (userId, isActive) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.put(`/auth/user/${userId}/status`, { isActive });
        
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Update User Profile
    updateUserProfile: async (userId, profileData, profilePicture = null) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const formData = new FormData();
        
        // Append all profile data
        Object.keys(profileData).forEach(key => {
          if (profileData[key] !== null && profileData[key] !== undefined) {
            formData.append(key, profileData[key]);
          }
        });

        // Append profile picture if provided
        if (profilePicture) {
          formData.append('profilePicture', profilePicture);
        }

        const response = await apiClient.put(`/auth/update/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Update current user if updating own profile
        if (userId === state.user?.id) {
          dispatch({
            type: AUTH_ACTIONS.UPDATE_USER,
            payload: response.data.user,
          });
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Delete User
    deleteUser: async (userId) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.delete(`/auth/delete/${userId}`);
        
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get User Profile
    getUserProfile: async (userId) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(`/auth/profile/${userId}`);
        
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Change Password
    changePassword: async (passwordData, userId = null) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const url = userId ? `/auth/change-password?userId=${userId}` : '/auth/change-password';
        const response = await apiClient.post(url, passwordData);
        
        // Clear password change requirement if successful
        if (state.requirePasswordChange) {
          dispatch({
            type: AUTH_ACTIONS.REQUIRE_PASSWORD_CHANGE,
            payload: false,
          });
        }

        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Forgot Password
    forgotPassword: async (email) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post('/auth/forgot-password', { email });
        
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Reset Password
    resetPassword: async (resetData) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.post('/auth/reset-password', resetData);
        
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Verify Email
    verifyEmail: async (token) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get(`/auth/verify-email?token=${token}`);
        
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Get Company Info
    getCompanyInfo: async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await apiClient.get('/auth/company-info');
        
        dispatch({
          type: AUTH_ACTIONS.UPDATE_COMPANY,
          payload: response.data.data,
        });

        // Update localStorage
        localStorage.setItem('company', JSON.stringify(response.data.data));
        

        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Update Company Info
    updateCompanyInfo: async (companyData, logoFile = null) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const formData = new FormData();
        
        // Append all company data
        Object.keys(companyData).forEach(key => {
          if (companyData[key] !== null && companyData[key] !== undefined) {
            formData.append(key, companyData[key]);
          }
        });

        // Append logo file if provided
        if (logoFile) {
          formData.append('logoFile', logoFile);
        }

        const response = await apiClient.put('/auth/company-info', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },

    // Clear error manually
    clearError: () => {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    },
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // API methods
    ...authApi,

    // Utility methods
    isAdmin: () => state.user?.role === 'Admin' || state.user?.isAdmin === 1,
    isManager: () => state.user?.role === 'Manager',
    isEmployee: () => state.user?.role === 'Employee',
    hasPermission: (permission) => {
      // Basic permission check based on role
      const userRole = state.user?.role;
      if (userRole === 'Admin') return true;
      if (userRole === 'Manager' && !permission.includes('delete')) return true;
      if (userRole === 'Employee' && permission.includes('read')) return true;
      return false;
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export context for advanced usage
export { AuthContext };

// Export API client for direct usage if needed
export { apiClient };