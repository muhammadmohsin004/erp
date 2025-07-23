import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Initial state (same as your original)
const initialState = {
  products: [],
  currentProduct: null,
  productBrands: [],
  currentProductBrand: null,
  productCategories: [],
  currentProductCategory: null,
  categoriesTree: [],
  productImages: [],
  currentProductImages: [],
  statistics: {
    overview: null,
    categories: null,
    pricing: null,
    topProducts: null,
    brands: null,
    trends: null,
    alerts: null,
    counts: null,
  },
  loading: false,
  error: null,
  pagination: {
    CurrentPage: 1,
    PageNumber: 1,
    PageSize: 25,
    TotalItems: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false,
  },
  filters: {
    searchTerm: "",
    status: "",
    categoryId: null,
    sortBy: "name",
    sortAscending: true,
    lowStockOnly: false,
  },
  dropdowns: {
    products: [],
    categories: [],
    brands: [],
  },
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_CURRENT_PRODUCT: "SET_CURRENT_PRODUCT",
  ADD_PRODUCT: "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  SET_PRODUCT_BRANDS: "SET_PRODUCT_BRANDS",
  SET_CURRENT_PRODUCT_BRAND: "SET_CURRENT_PRODUCT_BRAND",
  ADD_PRODUCT_BRAND: "ADD_PRODUCT_BRAND",
  UPDATE_PRODUCT_BRAND: "UPDATE_PRODUCT_BRAND",
  DELETE_PRODUCT_BRAND: "DELETE_PRODUCT_BRAND",
  SET_PRODUCT_CATEGORIES: "SET_PRODUCT_CATEGORIES",
  SET_CURRENT_PRODUCT_CATEGORY: "SET_CURRENT_PRODUCT_CATEGORY",
  SET_CATEGORIES_TREE: "SET_CATEGORIES_TREE",
  ADD_PRODUCT_CATEGORY: "ADD_PRODUCT_CATEGORY",
  UPDATE_PRODUCT_CATEGORY: "UPDATE_PRODUCT_CATEGORY",
  DELETE_PRODUCT_CATEGORY: "DELETE_PRODUCT_CATEGORY",
  SET_PRODUCT_IMAGES: "SET_PRODUCT_IMAGES",
  SET_CURRENT_PRODUCT_IMAGES: "SET_CURRENT_PRODUCT_IMAGES",
  ADD_PRODUCT_IMAGE: "ADD_PRODUCT_IMAGE",
  ADD_MULTIPLE_PRODUCT_IMAGES: "ADD_MULTIPLE_PRODUCT_IMAGES",
  DELETE_PRODUCT_IMAGE: "DELETE_PRODUCT_IMAGE",
  SET_STATISTICS: "SET_STATISTICS",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  SET_DROPDOWNS: "SET_DROPDOWNS",
  RESET_STATE: "RESET_STATE",
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

    case actionTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.ADD_PRODUCT: {
      const currentProductsAdd = state.products?.Data?.$values || [];
      const updatedProductsAdd = [...currentProductsAdd, action.payload];
      return {
        ...state,
        products: {
          ...state.products,
          Data: {
            ...state.products?.Data,
            $values: updatedProductsAdd,
          },
        },
        loading: false,
        error: null,
      };
    }

    case actionTypes.UPDATE_PRODUCT: {
      const currentProductsUpdate = state.products?.Data?.$values || [];
      const updatedProductsUpdate = currentProductsUpdate.map((product) =>
        product.Id === action.payload.Id ? action.payload : product
      );
      return {
        ...state,
        products: {
          ...state.products,
          Data: {
            ...state.products?.Data,
            $values: updatedProductsUpdate,
          },
        },
        currentProduct:
          state.currentProduct?.Id === action.payload.Id
            ? action.payload
            : state.currentProduct,
        loading: false,
        error: null,
      };
    }

    case actionTypes.DELETE_PRODUCT: {
      const currentProductsDelete = state.products?.Data?.$values || [];
      const updatedProductsDelete = currentProductsDelete.filter(
        (product) => product.Id !== action.payload
      );
      return {
        ...state,
        products: {
          ...state.products,
          Data: {
            ...state.products?.Data,
            $values: updatedProductsDelete,
          },
        },
        currentProduct:
          state.currentProduct?.Id === action.payload
            ? null
            : state.currentProduct,
        loading: false,
        error: null,
      };
    }

    case actionTypes.SET_PRODUCT_IMAGES:
      return {
        ...state,
        productImages: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CURRENT_PRODUCT_IMAGES:
      return {
        ...state,
        currentProductImages: action.payload,
        loading: false,
        error: null,
      };

    case actionTypes.ADD_PRODUCT_IMAGE: {
      const currentImages = state.productImages?.Data?.$values || [];
      const updatedImages = [...currentImages, action.payload];
      return {
        ...state,
        productImages: {
          ...state.productImages,
          Data: {
            ...state.productImages?.Data,
            $values: updatedImages,
          },
        },
        loading: false,
        error: null,
      };
    }

    case actionTypes.ADD_MULTIPLE_PRODUCT_IMAGES: {
      const currentImages = state.productImages?.Data?.$values || [];
      const updatedImages = [...currentImages, ...action.payload];
      return {
        ...state,
        productImages: {
          ...state.productImages,
          Data: {
            ...state.productImages?.Data,
            $values: updatedImages,
          },
        },
        loading: false,
        error: null,
      };
    }

    case actionTypes.DELETE_PRODUCT_IMAGE: {
      const currentImages = state.productImages?.Data?.$values || [];
      const updatedImages = currentImages.filter(
        (image) => image.Id !== action.payload
      );
      return {
        ...state,
        productImages: {
          ...state.productImages,
          Data: {
            ...state.productImages?.Data,
            $values: updatedImages,
          },
        },
        loading: false,
        error: null,
      };
    }

    // ... other cases for brands, categories, statistics, etc.

    default:
      return state;
  }
};

// Create context
const ProductsManagerContext = createContext();

// API base URLs
const API_BASE_URLS = {
  products: "https://api.speed-erp.com/api/Products",
  productBrands: "https://api.speed-erp.com/api/ProductBrands",
  productCategories: "https://api.speed-erp.com/api/ProductCategories",
  productImages: "https://api.speed-erp.com/api/ProductImages",
  productImagesMultiple: "https://api.speed-erp.com/api/ProductImages/Multiple",
  statistics: "https://api.speed-erp.com/api/products/statistics",
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Helper function to make API calls
const makeApiCall = async (url, options = {}) => {
  const token = getAuthToken();

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    console.log("Making API call to:", url);
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        const errorText = await response.text();
        console.error("Non-JSON error response:", errorText);
        errorData = { message: errorText };
      }

      console.error("Detailed error response:", errorData);

      let errorMessage = `HTTP ${response.status} ${response.statusText}`;

      if (errorData.Message) {
        errorMessage += `: ${errorData.Message}`;
      } else if (errorData.message) {
        errorMessage += `: ${errorData.message}`;
      } else if (errorData.title) {
        errorMessage += `: ${errorData.title}`;
      }

      if (errorData.errors || errorData.ValidationErrors) {
        const validationErrors = errorData.errors || errorData.ValidationErrors;
        console.error("Validation errors:", validationErrors);

        if (Array.isArray(validationErrors)) {
          errorMessage += ` | Validation errors: ${validationErrors.join(
            ", "
          )}`;
        } else if (typeof validationErrors === "object") {
          const validationErrorString = Object.entries(validationErrors)
            .map(([key, values]) => {
              const errorList = Array.isArray(values)
                ? values.join(", ")
                : values;
              return `${key}: ${errorList}`;
            })
            .join("; ");
          errorMessage += ` | Validation errors: ${validationErrorString}`;
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("API call failed:", error);

    if (error.message.includes("ERR_NAME_NOT_RESOLVED")) {
      throw new Error(
        "Cannot connect to API server. Please check your internet connection or contact administrator."
      );
    }
    if (error.message.includes("ERR_NETWORK")) {
      throw new Error("Network error. Please check your internet connection.");
    }
    if (error.message.includes("ERR_CONNECTION_REFUSED")) {
      throw new Error("Connection refused. The API server might be down.");
    }
    if (error.message.includes("Failed to fetch")) {
      throw new Error(
        "Network error: Failed to connect to the server. Please check your internet connection."
      );
    }

    throw error;
  }
};

// FIXED: Helper function for multipart form data API calls
const makeMultipartApiCall = async (url, formData) => {
  const token = getAuthToken();

  try {
    console.log("=== CONTEXT: Making multipart API call ===");
    console.log("URL:", url);
    
    // Log FormData contents for debugging
    console.log("=== FormData Contents ===");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
      if (value instanceof File) {
        console.log(`  File name: ${value.name}`);
        console.log(`  File size: ${value.size}`);
        console.log(`  File type: ${value.type}`);
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "text/plain",
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        const errorText = await response.text();
        console.error("Non-JSON error response:", errorText);
        errorData = { message: errorText };
      }

      console.error("Detailed error response:", errorData);

      let errorMessage = `HTTP ${response.status} ${response.statusText}`;

      if (errorData.Message) {
        errorMessage += `: ${errorData.Message}`;
      } else if (errorData.message) {
        errorMessage += `: ${errorData.message}`;
      } else if (errorData.title) {
        errorMessage += `: ${errorData.title}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Multipart API response:", data);
    return data;
  } catch (error) {
    console.error("Multipart API call failed:", error);
    throw error;
  }
};

// Context Provider
export const ProductsManagerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsManagerReducer, initialState);

  // Stable utility functions
  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
  }, []);

  // Product API functions
  const getProducts = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();

      if (params.page) {
        queryParams.append("page", params.page);
      }
      if (params.pageSize) {
        queryParams.append("pageSize", params.pageSize);
      }
      if (params.search) {
        queryParams.append("search", params.search);
      }
      if (params.status) {
        queryParams.append("status", params.status);
      }
      if (params.categoryId) {
        queryParams.append("categoryId", params.categoryId);
      }
      if (params.sortBy) {
        queryParams.append("sortBy", params.sortBy);
      }
      if (params.sortAscending !== undefined) {
        queryParams.append("sortAscending", params.sortAscending);
      }
      if (params.lowStockOnly) {
        queryParams.append("lowStockOnly", params.lowStockOnly);
      }

      const response = await makeApiCall(
        `${API_BASE_URLS.products}?${queryParams}`
      );

      if (response.Success) {
        console.log("products===in context", response);
        dispatch({ type: actionTypes.SET_PRODUCTS, payload: response });

        if (response.Paginations) {
          dispatch({
            type: actionTypes.SET_PAGINATION,
            payload: {
              CurrentPage: response.Paginations.PageNumber,
              PageNumber: response.Paginations.PageNumber,
              PageSize: response.Paginations.PageSize,
              TotalItems: response.Paginations.TotalItems,
              TotalPages: response.Paginations.TotalPages,
              HasPreviousPage: response.Paginations.PageNumber > 1,
              HasNextPage:
                response.Paginations.PageNumber <
                response.Paginations.TotalPages,
            },
          });
        }
      } else {
        throw new Error(response.Message || "Failed to fetch products");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  const getProduct = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URLS.products}/${id}`);

      if (response.Success) {
        dispatch({
          type: actionTypes.SET_CURRENT_PRODUCT,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch product");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      console.log("=== CONTEXT: Creating product ===");
      console.log("Product data:", productData);

      const token = getAuthToken();

      const responseData = await makeApiCall(API_BASE_URLS.products, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          accept: "text/plain",
        },
        body: JSON.stringify(productData),
      });

      console.log("Create product response:", responseData);

      if (responseData.Success) {
        dispatch({ type: actionTypes.ADD_PRODUCT, payload: responseData.Data });
        return responseData.Data;
      } else {
        throw new Error(responseData.Message || "Failed to create product");
      }
    } catch (error) {
      console.error("Context create product error:", error);

      if (error.message.includes("401")) {
        console.error("Authentication error - possible token issue");
      }

      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(`${API_BASE_URLS.products}/${id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      });

      if (response.Success) {
        dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: response.Data });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to update product");
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
        method: "DELETE",
      });

      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_PRODUCT, payload: id });
        return true;
      } else {
        throw new Error(response.Message || "Failed to delete product");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Product Images API functions
  const getProductImages = useCallback(async (params = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const queryParams = new URLSearchParams();

      // Add query parameters if provided
      if (params.productId) {
        queryParams.append("productId", params.productId);
      }
      if (params.isMain !== undefined) {
        queryParams.append("isMain", params.isMain);
      }
      if (params.page) {
        queryParams.append("page", params.page);
      }
      if (params.pageSize) {
        queryParams.append("pageSize", params.pageSize);
      }

      const url = queryParams.toString()
        ? `${API_BASE_URLS.productImages}?${queryParams}`
        : API_BASE_URLS.productImages;

      const response = await makeApiCall(url);

      if (response.Success) {
        console.log("product images===in context", response);
        dispatch({ type: actionTypes.SET_PRODUCT_IMAGES, payload: response });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to fetch product images");
      }
    } catch (error) {
      console.error("Get product images error:", error);
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  const getProductImagesByProductId = useCallback(
    async (productId) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        const response = await getProductImages({ productId });

        if (response && response.$values) {
          const productImages = response.$values.filter(
            (image) => image.ProductId === parseInt(productId)
          );

          dispatch({
            type: actionTypes.SET_CURRENT_PRODUCT_IMAGES,
            payload: productImages,
          });

          return productImages;
        }

        return [];
      } catch (error) {
        console.error("Get product images by product ID error:", error);
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return [];
      }
    },
    [getProductImages]
  );

  // FIXED: Single Product Image Upload - Construct FormData according to CURL
  const createProductImage = useCallback(async (imageData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      console.log("=== CONTEXT: Creating single product image ===");
      console.log("Image data received:", imageData);

      // Validate required fields
      if (!imageData.productId) {
        throw new Error("ProductId is required");
      }
      if (!imageData.imageFile) {
        throw new Error("ImageFile is required");
      }

      // Create FormData exactly as per CURL specification
      const formData = new FormData();
      
      // CRITICAL: Add fields in the EXACT order and format as CURL
      formData.append("IsMain", imageData.isMain ? "true" : "false");
      formData.append("ProductId", imageData.productId.toString());
      formData.append("AltText", imageData.altText || "");
      formData.append("ImageFile", imageData.imageFile, imageData.imageFile.name);

      console.log("=== Single Image FormData created ===");

      const response = await makeMultipartApiCall(
        API_BASE_URLS.productImages,
        formData
      );

      console.log("Create single product image response:", response);

      if (response.Success) {
        dispatch({
          type: actionTypes.ADD_PRODUCT_IMAGE,
          payload: response.Data,
        });
        return response.Data;
      } else {
        throw new Error(response.Message || "Failed to create product image");
      }
    } catch (error) {
      console.error("=== CONTEXT: Create product image error ===", error);
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  }, []);

  // FIXED: Multiple Product Images Upload - Construct FormData according to CURL
  const createMultipleProductImages = useCallback(async (imagesData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      console.log("=== CONTEXT: Creating multiple product images ===");
      console.log("Images data received:", imagesData);

      // Validate required fields
      if (!imagesData.productId) {
        throw new Error("ProductId is required");
      }
      if (!imagesData.imageFiles || !Array.isArray(imagesData.imageFiles) || imagesData.imageFiles.length === 0) {
        throw new Error("ImageFiles array is required and must not be empty");
      }

      // Create FormData exactly as per CURL specification
      const formData = new FormData();
      
      // CRITICAL: Add fields in the EXACT order and format as CURL
      formData.append("ProductId", imagesData.productId.toString());
      
      // Add all image files with the EXACT field name from CURL
      imagesData.imageFiles.forEach((file) => {
        formData.append("ImageFiles", file, file.name);
      });
      
      formData.append("AltText", imagesData.altText || "");

      console.log("=== Multiple Images FormData created ===");

      const response = await makeMultipartApiCall(
        API_BASE_URLS.productImagesMultiple,
        formData
      );

      console.log("Create multiple product images response:", response);

      if (response.Success) {
        // Handle different response formats
        let createdImages;
        if (Array.isArray(response.Data)) {
          createdImages = response.Data;
        } else if (response.Data?.$values && Array.isArray(response.Data.$values)) {
          createdImages = response.Data.$values;
        } else {
          createdImages = [response.Data]; // Single image in array format
        }

        dispatch({
          type: actionTypes.ADD_MULTIPLE_PRODUCT_IMAGES,
          payload: createdImages,
        });
        return createdImages;
      } else {
        throw new Error(
          response.Message || "Failed to create multiple product images"
        );
      }
    } catch (error) {
      console.error("=== CONTEXT: Create multiple product images error ===", error);
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  }, []);

  const deleteProductImage = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const response = await makeApiCall(
        `${API_BASE_URLS.productImages}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.Success) {
        dispatch({ type: actionTypes.DELETE_PRODUCT_IMAGE, payload: id });
        return true;
      } else {
        throw new Error(response.Message || "Failed to delete product image");
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Context value with stable functions
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

    // Product API methods
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,

    // Product Images API methods
    getProductImages,
    getProductImagesByProductId,
    createProductImage,
    createMultipleProductImages,
    deleteProductImage,

    // Utility methods
    setFilters,
    clearError,
    setLoading,
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
    throw new Error(
      "useProductsManager must be used within a ProductsManagerProvider"
    );
  }
  return context;
};

// Export context for direct access if needed
export { ProductsManagerContext };