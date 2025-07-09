import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  // Products
  products: [],
  currentProduct: null,
  
  // Product Brands
  productBrands: [],
  currentProductBrand: null,
  
  // Product Categories
  productCategories: [],
  currentProductCategory: null,
  categoriesTree: [],
  
  // Product Images
  productImages: [],
  currentProductImages: [],
  
  // Statistics
  statistics: {
    overview: null,
    categories: null,
    pricing: null,
    topProducts: null,
    brands: null,
    trends: null,
    alerts: null,
    counts: null
  },
  
  // UI State
  loading: false,
  error: null,
  
  // Pagination
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  },
  
  // Filters
  filters: {
    searchTerm: '',
    status: '',
    categoryId: null,
    sortBy: 'name',
    sortAscending: true,
    lowStockOnly: false
  },
  
  // Dropdowns
  dropdowns: {
    products: [],
    categories: [],
    brands: []
  }
};

// Action types
const actionTypes = {
  // Loading and Error
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Products
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  
  // Product Brands
  SET_PRODUCT_BRANDS: 'SET_PRODUCT_BRANDS',
  SET_CURRENT_PRODUCT_BRAND: 'SET_CURRENT_PRODUCT_BRAND',
  ADD_PRODUCT_BRAND: 'ADD_PRODUCT_BRAND',
  UPDATE_PRODUCT_BRAND: 'UPDATE_PRODUCT_BRAND',
  DELETE_PRODUCT_BRAND: 'DELETE_PRODUCT_BRAND',
  
  // Product Categories
  SET_PRODUCT_CATEGORIES: 'SET_PRODUCT_CATEGORIES',
  SET_CURRENT_PRODUCT_CATEGORY: 'SET_CURRENT_PRODUCT_CATEGORY',
  SET_CATEGORIES_TREE: 'SET_CATEGORIES_TREE',
  ADD_PRODUCT_CATEGORY: 'ADD_PRODUCT_CATEGORY',
  UPDATE_PRODUCT_CATEGORY: 'UPDATE_PRODUCT_CATEGORY',
  DELETE_PRODUCT_CATEGORY: 'DELETE_PRODUCT_CATEGORY',
  
  // Product Images
  SET_PRODUCT_IMAGES: 'SET_PRODUCT_IMAGES',
  SET_CURRENT_PRODUCT_IMAGES: 'SET_CURRENT_PRODUCT_IMAGES',
  ADD_PRODUCT_IMAGE: 'ADD_PRODUCT_IMAGE',
  ADD_MULTIPLE_PRODUCT_IMAGES: 'ADD_MULTIPLE_PRODUCT_IMAGES',
  DELETE_PRODUCT_IMAGE: 'DELETE_PRODUCT_IMAGE',
  
  // Statistics
  SET_STATISTICS: 'SET_STATISTICS',
  
  // Pagination and Filters
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  
  // Dropdowns
  SET_DROPDOWNS: 'SET_DROPDOWNS',
  
  // Utility
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const productsManagerReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    // Products
    case actionTypes.SET_PRODUCTS:
      return { 
        ...state, 
        products: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_PRODUCT:
      return { 
        ...state, 
        currentProduct: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.ADD_PRODUCT:
      { const currentProductsAdd = state.products?.Data || [];
      const updatedProductsAdd = [...currentProductsAdd, action.payload];
      return { 
        ...state, 
        products: {
          ...state.products,
          Data: updatedProductsAdd 
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.UPDATE_PRODUCT:
      { const currentProductsUpdate = state.products?.Data?.$values || [];
      const updatedProductsUpdate = currentProductsUpdate.map(product =>
        product.Id === action.payload.Id ? action.payload : product
      );
      return {
        ...state,
        products: {
          ...state.products,
          Data: updatedProductsUpdate
        },
        currentProduct: state.currentProduct?.Id === action.payload.Id 
          ? action.payload 
          : state.currentProduct,
        loading: false,
        error: null
      }; }
    
    case actionTypes.DELETE_PRODUCT:
      { const currentProductsDelete = state.products?.Data?.$values || [];
      const updatedProductsDelete = currentProductsDelete.filter(
        product => product.Id !== action.payload
      );
      return {
        ...state,
        products: {
          ...state.products,
          Data: updatedProductsDelete
        },
        currentProduct: state.currentProduct?.Id === action.payload 
          ? null 
          : state.currentProduct,
        loading: false,
        error: null
      }; }
    
    // Product Brands
    case actionTypes.SET_PRODUCT_BRANDS:
      return { 
        ...state, 
        productBrands: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_PRODUCT_BRAND:
      return { 
        ...state, 
        currentProductBrand: action.payload, 
        loading: false, 
        error: null 
      };
    
    // For ADD_PRODUCT_BRAND (around line 160):
case actionTypes.ADD_PRODUCT_BRAND:
  { const currentBrandsAdd = state.productBrands?.Data?.$values || [];
  const updatedBrandsAdd = [...currentBrandsAdd, action.payload];
  return { 
    ...state, 
    productBrands: {
      ...state.productBrands,
      Data: {
        ...state.productBrands.Data,
        $values: updatedBrandsAdd 
      }
    },
    loading: false,
    error: null
  }; }

// For UPDATE_PRODUCT_BRAND (around line 175):
case actionTypes.UPDATE_PRODUCT_BRAND:
  { const currentBrandsUpdate = state.productBrands?.Data?.$values || [];
  const updatedBrandsUpdate = currentBrandsUpdate.map(brand =>
    brand.Id === action.payload.Id ? action.payload : brand
  );
  return {
    ...state,
    productBrands: {
      ...state.productBrands,
      Data: {
        ...state.productBrands.Data,
        $values: updatedBrandsUpdate
      }
    },
    currentProductBrand: state.currentProductBrand?.Id === action.payload.Id 
      ? action.payload 
      : state.currentProductBrand,
    loading: false,
    error: null
  }; }

// For DELETE_PRODUCT_BRAND (around line 195):
case actionTypes.DELETE_PRODUCT_BRAND:
  { const currentBrandsDelete = state.productBrands?.Data?.$values || [];
  const updatedBrandsDelete = currentBrandsDelete.filter(
    brand => brand.Id !== action.payload
  );
  return {
    ...state,
    productBrands: {
      ...state.productBrands,
      Data: {
        ...state.productBrands.Data,
        $values: updatedBrandsDelete
      }
    },
    currentProductBrand: state.currentProductBrand?.Id === action.payload 
      ? null 
      : state.currentProductBrand,
    loading: false,
    error: null
  }; }
    // Product Categories
    case actionTypes.SET_PRODUCT_CATEGORIES:
      return { 
        ...state, 
        productCategories: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_PRODUCT_CATEGORY:
      return { 
        ...state, 
        currentProductCategory: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CATEGORIES_TREE:
      return { 
        ...state, 
        categoriesTree: action.payload, 
        loading: false, 
        error: null 
      };
      // For ADD_PRODUCT_CATEGORY (around line 220):
case actionTypes.ADD_PRODUCT_CATEGORY:
  { const currentCategoriesAdd = state.productCategories?.Data?.$values || [];
  const updatedCategoriesAdd = [...currentCategoriesAdd, action.payload];
  return { 
    ...state, 
    productCategories: {
      ...state.productCategories,
      Data: {
        ...state.productCategories.Data,
        $values: updatedCategoriesAdd 
      }
    },
    loading: false,
    error: null
  }; }

// For UPDATE_PRODUCT_CATEGORY (around line 235):
case actionTypes.UPDATE_PRODUCT_CATEGORY:
  { const currentCategoriesUpdate = state.productCategories?.Data?.$values || [];
  const updatedCategoriesUpdate = currentCategoriesUpdate.map(category =>
    category.Id === action.payload.Id ? action.payload : category
  );
  return {
    ...state,
    productCategories: {
      ...state.productCategories,
      Data: {
        ...state.productCategories.Data,
        $values: updatedCategoriesUpdate
      }
    },
    currentProductCategory: state.currentProductCategory?.Id === action.payload.Id 
      ? action.payload 
      : state.currentProductCategory,
    loading: false,
    error: null
  }; }

// For DELETE_PRODUCT_CATEGORY (around line 255):
case actionTypes.DELETE_PRODUCT_CATEGORY:
  { const currentCategoriesDelete = state.productCategories?.Data?.$values || [];
  const updatedCategoriesDelete = currentCategoriesDelete.filter(
    category => category.Id !== action.payload
  );
  return {
    ...state,
    productCategories: {
      ...state.productCategories,
      Data: {
        ...state.productCategories.Data,
        $values: updatedCategoriesDelete
      }
    },
    currentProductCategory: state.currentProductCategory?.Id === action.payload 
      ? null 
      : state.currentProductCategory,
    loading: false,
    error: null
  }; }
    // Product Images
    case actionTypes.SET_PRODUCT_IMAGES:
      return { 
        ...state, 
        productImages: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.SET_CURRENT_PRODUCT_IMAGES:
      return { 
        ...state, 
        currentProductImages: action.payload, 
        loading: false, 
        error: null 
      };
    
    case actionTypes.ADD_PRODUCT_IMAGE:
      { const currentImagesAdd = state.productImages?.Data?.$values || [];
      const updatedImagesAdd = [...currentImagesAdd, action.payload];
      return { 
        ...state, 
        productImages: {
          ...state.productImages,
          Data: updatedImagesAdd 
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.ADD_MULTIPLE_PRODUCT_IMAGES:
      { const currentImagesAddMultiple = state.productImages?.Data?.$values || [];
      const updatedImagesAddMultiple = [...currentImagesAddMultiple, ...action.payload];
      return { 
        ...state, 
        productImages: {
          ...state.productImages,
          Data: updatedImagesAddMultiple 
        },
        loading: false,
        error: null
      }; }
    
    case actionTypes.DELETE_PRODUCT_IMAGE:
      { const currentImagesDelete = state.productImages?.Data?.$values || [];
      const updatedImagesDelete = currentImagesDelete.filter(
        image => image.Id !== action.payload
      );
      return {
        ...state,
        productImages: {
          ...state.productImages,
          Data: updatedImagesDelete
        },
        currentProductImages: state.currentProductImages.filter(
          image => image.Id !== action.payload
        ),
        loading: false,
        error: null
      }; }
    
    // Statistics
    case actionTypes.SET_STATISTICS:
      return { 
        ...state, 
        statistics: { ...state.statistics, ...action.payload }, 
        loading: false, 
        error: null 
      };
    
    // Pagination
    case actionTypes.SET_PAGINATION:
      return { 
        ...state, 
        pagination: { ...state.pagination, ...action.payload } 
      };
    
    // Filters
    case actionTypes.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    
    // Dropdowns
    case actionTypes.SET_DROPDOWNS:
      return { 
        ...state, 
        dropdowns: { ...state.dropdowns, ...action.payload } 
      };
    
    // Utility
    case actionTypes.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Create context
const ProductsManagerContext = createContext();

// API base URLs
const API_BASE_URLS = {
  products: 'https://api.speed-erp.com/api/Products',
  productBrands: 'https://api.speed-erp.com/api/ProductBrands',
  productCategories: 'https://api.speed-erp.com/api/ProductCategories',
  productImages: 'https://api.speed-erp.com/api/ProductImages',
  statistics: 'https://api.speed-erp.com/api/products/statistics'
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to make API calls
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
export const ProductsManagerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsManagerReducer, initialState);

  // Utility Functions
  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
  }, []);

  // Products CRUD Operations
  const getProducts = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      if (params.page || state.pagination.PageNumber) {
        queryParams.append('page', params.page || state.pagination.PageNumber);
      }
      if (params.pageSize || state.pagination.PageSize) {
        queryParams.append('pageSize', params.pageSize || state.pagination.PageSize);
      }
      if (params.search || state.filters.searchTerm) {
        queryParams.append('search', params.search || state.filters.searchTerm);
      }
      if (params.status || state.filters.status) {
        queryParams.append('status', params.status || state.filters.status);
      }
      if (params.categoryId || state.filters.categoryId) {
        queryParams.append('categoryId', params.categoryId || state.filters.categoryId);
      }
      if (params.sortBy || state.filters.sortBy) {
        queryParams.append('sortBy', params.sortBy || state.filters.sortBy);
      }
      if (params.sortAscending !== undefined) {
        queryParams.append('sortAscending', params.sortAscending);
      } else {
        queryParams.append('sortAscending', state.filters.sortAscending);
      }
      if (params.lowStockOnly || state.filters.lowStockOnly) {
        queryParams.append('lowStockOnly', params.lowStockOnly || state.filters.lowStockOnly);
      }

      const response = await makeApiCall(`${API_BASE_URLS.products}?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_PRODUCTS, payload: response });
        
        if (response.Paginations) {
          dispatch({ type: actionTypes.SET_PAGINATION, payload: {
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
        throw new Error(response.Message || 'Failed to fetch products');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, [state.pagination, state.filters]);

  const getProduct = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.products}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_PRODUCT, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch product');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URLS.products, {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_PRODUCT, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create product');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.products}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update product');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.products}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_PRODUCT, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete product');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Product Brands CRUD Operations
  const getProductBrands = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortAscending !== undefined) queryParams.append('sortAscending', params.sortAscending);

      const response = await makeApiCall(`${API_BASE_URLS.productBrands}?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_PRODUCT_BRANDS, payload: response });
      } else {
        throw new Error(response.Message || 'Failed to fetch product brands');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  const getProductBrand = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.productBrands}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_PRODUCT_BRAND, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch product brand');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createProductBrand = useCallback(async (brandData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URLS.productBrands, {
        method: 'POST',
        body: JSON.stringify(brandData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_PRODUCT_BRAND, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create product brand');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateProductBrand = useCallback(async (id, brandData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.productBrands}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(brandData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_PRODUCT_BRAND, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update product brand');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteProductBrand = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.productBrands}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_PRODUCT_BRAND, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete product brand');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Product Categories CRUD Operations
  const getProductCategories = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortAscending !== undefined) queryParams.append('sortAscending', params.sortAscending);

      const response = await makeApiCall(`${API_BASE_URLS.productCategories}?${queryParams}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_PRODUCT_CATEGORIES, payload: response });
      } else {
        throw new Error(response.Message || 'Failed to fetch product categories');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  const getProductCategory = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.productCategories}/${id}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_PRODUCT_CATEGORY, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch product category');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createProductCategory = useCallback(async (categoryData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URLS.productCategories, {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_PRODUCT_CATEGORY, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create product category');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const updateProductCategory = useCallback(async (id, categoryData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.productCategories}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_PRODUCT_CATEGORY, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to update product category');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteProductCategory = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.productCategories}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_PRODUCT_CATEGORY, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete product category');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  const getCategoriesTree = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.productCategories}/tree`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CATEGORIES_TREE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch categories tree');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Product Images Operations
  const getProductImages = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(API_BASE_URLS.productImages);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_PRODUCT_IMAGES, payload: response });
      } else {
        throw new Error(response.Message || 'Failed to fetch product images');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  const getProductImagesByProductId = useCallback(async (productId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.productImages}/ByProduct/${productId}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_PRODUCT_IMAGES, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch product images');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createProductImage = useCallback(async (imageData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const formData = new FormData();
      Object.keys(imageData).forEach(key => {
        formData.append(key, imageData[key]);
      });
      
      const response = await makeApiCall(API_BASE_URLS.productImages, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          // Don't set Content-Type for FormData
        },
        body: formData
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_PRODUCT_IMAGE, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create product image');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createMultipleProductImages = useCallback(async (imagesData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const formData = new FormData();
      formData.append('ProductId', imagesData.ProductId);
      formData.append('AltText', imagesData.AltText || '');
      
      imagesData.ImageFiles.forEach((file) => {
        formData.append(`ImageFiles`, file);
      });
      
      const response = await makeApiCall(`${API_BASE_URLS.productImages}/Multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          // Don't set Content-Type for FormData
        },
        body: formData
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.ADD_MULTIPLE_PRODUCT_IMAGES, payload: response.Data.UploadedImages });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to create multiple product images');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteProductImage = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.productImages}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_PRODUCT_IMAGE, payload: id });
        return true;
      } else {
        throw new Error(response.Message || 'Failed to delete product image');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Statistics Operations
  const getStatisticsOverview = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.statistics}/overview`);
      
      dispatch({ type: actionTypes.SET_STATISTICS, payload: { overview: response } });
      return response;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getStatisticsCategories = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.statistics}/categories`);
      
      dispatch({ type: actionTypes.SET_STATISTICS, payload: { categories: response } });
      return response;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getStatisticsPricing = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.statistics}/pricing`);
      
      dispatch({ type: actionTypes.SET_STATISTICS, payload: { pricing: response } });
      return response;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getStatisticsTopProducts = useCallback(async (metric = 'price', limit = 10) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.statistics}/top-products?metric=${metric}&limit=${limit}`);
      
      dispatch({ type: actionTypes.SET_STATISTICS, payload: { topProducts: response } });
      return response;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getStatisticsBrands = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.statistics}/brands`);
      
      dispatch({ type: actionTypes.SET_STATISTICS, payload: { brands: response } });
      return response;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getStatisticsTrends = useCallback(async (months = 6) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.statistics}/trends?months=${months}`);
      
      dispatch({ type: actionTypes.SET_STATISTICS, payload: { trends: response } });
      return response;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getStatisticsAlerts = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.statistics}/alerts`);
      
      dispatch({ type: actionTypes.SET_STATISTICS, payload: { alerts: response } });
      return response;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getStatisticsCounts = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.statistics}/counts`);
      
      dispatch({ type: actionTypes.SET_STATISTICS, payload: { counts: response } });
      return response;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Dropdown Operations
  const getProductsDropdown = useCallback(async () => {
    try {
      const response = await makeApiCall(`${API_BASE_URLS.products}/dropdown`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_DROPDOWNS, payload: { products: response.Data } });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch products dropdown');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getCategoriesDropdown = useCallback(async () => {
    try {
      const response = await makeApiCall(`${API_BASE_URLS.productCategories}/dropdown`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_DROPDOWNS, payload: { categories: response.Data } });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch categories dropdown');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getBrandsDropdown = useCallback(async () => {
    try {
      const response = await makeApiCall(`${API_BASE_URLS.productBrands}/dropdown`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_DROPDOWNS, payload: { brands: response.Data } });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch brands dropdown');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Search Operations
  const searchProducts = useCallback(async (query = '', limit = 10) => {
    try {
      const response = await makeApiCall(`${API_BASE_URLS.products}/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      
      if (response.Success) {
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to search products');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getProductByBarcode = useCallback(async (barcode) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await makeApiCall(`${API_BASE_URLS.products}/barcode/${encodeURIComponent(barcode)}`);
      
      if (response.Success) {
        dispatch({ type: actionTypes.SET_CURRENT_PRODUCT, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || 'Failed to fetch product by barcode');
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Pagination Operations
  const changePage = useCallback(async (page) => {
    const updatedPagination = { ...state.pagination, CurrentPage: page, PageNumber: page };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getProducts({ page });
  }, [state.pagination, getProducts]);

  const changePageSize = useCallback(async (pageSize) => {
    const updatedPagination = { ...state.pagination, PageSize: pageSize, CurrentPage: 1, PageNumber: 1 };
    dispatch({ type: actionTypes.SET_PAGINATION, payload: updatedPagination });
    await getProducts({ pageSize, page: 1 });
  }, [state.pagination, getProducts]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: actionTypes.RESET_STATE });
  }, []);

  // Context value
  const value = {
    // State
    products: state.products,
    currentProduct: state.currentProduct,
    productBrands: state.productBrands,
    currentProductBrand: state.currentProductBrand,
    productCategories: state.productCategories,
    currentProductCategory: state.currentProductCategory,
    categoriesTree: state.categoriesTree,
    productImages: state.productImages,
    currentProductImages: state.currentProductImages,
    statistics: state.statistics,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    dropdowns: state.dropdowns,
    
    // Products Operations
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductByBarcode,
    
    // Product Brands Operations
    getProductBrands,
    getProductBrand,
    createProductBrand,
    updateProductBrand,
    deleteProductBrand,
    
    // Product Categories Operations
    getProductCategories,
    getProductCategory,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    getCategoriesTree,
    
    // Product Images Operations
    getProductImages,
    getProductImagesByProductId,
    createProductImage,
    createMultipleProductImages,
    deleteProductImage,
    
    // Statistics Operations
    getStatisticsOverview,
    getStatisticsCategories,
    getStatisticsPricing,
    getStatisticsTopProducts,
    getStatisticsBrands,
    getStatisticsTrends,
    getStatisticsAlerts,
    getStatisticsCounts,
    
    // Dropdown Operations
    getProductsDropdown,
    getCategoriesDropdown,
    getBrandsDropdown,
    
    // Pagination Operations
    changePage,
    changePageSize,
    
    // Utility Operations
    setFilters,
    clearError,
    setLoading,
    resetState
  };

  return (
    <ProductsManagerContext.Provider value={value}>
      {children}
    </ProductsManagerContext.Provider>
  );
};

// Custom hook to use the products manager context
export const useProductsManager = () => {
  const context = useContext(ProductsManagerContext);
  if (!context) {
    throw new Error('useProductsManager must be used within a ProductsManagerProvider');
  }
  return context;
};

// Export context for direct access if needed
export { ProductsManagerContext };