import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  DollarSign,
  Package,
  Building,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  X,
  Calendar,
  Layers,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Search,
  Tag,
  Image,
  ShoppingCart,
  Star,
} from "lucide-react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineCopy,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineFilter,
  AiOutlineDownload,
  AiOutlineBarcode,
} from "react-icons/ai";
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../../components/elements/modal/Modal";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../../components/elements/table/Table";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const ProductsList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  // Get products context
  const {
    products,
    currentProduct,
    loading: productsLoading,
    error,
    pagination,
    filters,
    dropdowns,
    getProducts,
    getProduct,
    deleteProduct,
    changePage,
    changePageSize,
    setFilters,
    getCategoriesDropdown,
    getBrandsDropdown,
    getProductsDropdown,
    getStatisticsOverview,
  } = useProductsManager();

  // Process products data from API response
  const productsData = products?.Data?.$values || [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    categoryId: null,
    sortBy: "name",
    sortAscending: true,
    lowStockOnly: false,
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const location = useLocation();
  // Statistics state
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    activeProducts: 0,
    productsThisMonth: 0,
    lowStockItems: 0,
    totalInventoryValue: 0,
    totalStockValue: 0,
  });
  const translations = {
    "Add Product": language === "ar" ? "إضافة منتج" : "Add Product",
    Products: language === "ar" ? "المنتجات" : "Products",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    NoProducts: language === "ar" ? "لا يوجد منتجات" : "No products found",
    Name: language === "ar" ? "الاسم" : "Name",
    "Item Code": language === "ar" ? "كود المنتج" : "Item Code",
    Barcode: language === "ar" ? "الباركود" : "Barcode",
    Description: language === "ar" ? "الوصف" : "Description",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    "Purchase Price": language === "ar" ? "سعر الشراء" : "Purchase Price",
    "Current Stock": language === "ar" ? "المخزون الحالي" : "Current Stock",
    "Stock Status": language === "ar" ? "حالة المخزون" : "Stock Status",
    Status: language === "ar" ? "الحالة" : "Status",
    Category: language === "ar" ? "الفئة" : "Category",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    Active: language === "ar" ? "نشط" : "Active",
    Inactive: language === "ar" ? "غير نشط" : "Inactive",
    Total: language === "ar" ? "المجموع" : "Total",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "Low Stock": language === "ar" ? "مخزون منخفض" : "Low Stock",
    "Out of Stock": language === "ar" ? "نفد المخزون" : "Out of Stock",
    "In Stock": language === "ar" ? "متوفر" : "In Stock",
    "Stock Value": language === "ar" ? "قيمة المخزون" : "Stock Value",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Product": language === "ar" ? "حذف المنتج" : "Delete Product",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Product Details": language === "ar" ? "تفاصيل المنتج" : "Product Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "All Status": language === "ar" ? "جميع الحالات" : "All Status",
    "All Categories": language === "ar" ? "جميع الفئات" : "All Categories",
    Categories: language === "ar" ? "الفئات" : "Categories",
    Brands: language === "ar" ? "العلامات التجارية" : "Brands",
    Tags: language === "ar" ? "العلامات" : "Tags",
    Images: language === "ar" ? "الصور" : "Images",
    Taxes: language === "ar" ? "الضرائب" : "Taxes",
    "Minimum Stock":
      language === "ar" ? "الحد الأدنى للمخزون" : "Minimum Stock",
    "Tracking Type": language === "ar" ? "نوع التتبع" : "Tracking Type",
    "Product Statistics":
      language === "ar" ? "إحصائيات المنتجات" : "Product Statistics",
    "Inventory Value": language === "ar" ? "قيمة المخزون" : "Inventory Value",
    "Low Stock Items":
      language === "ar" ? "عناصر مخزون منخفض" : "Low Stock Items",
    "Show Low Stock Only":
      language === "ar" ? "عرض المخزون المنخفض فقط" : "Show Low Stock Only",
    "Basic Information":
      language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Pricing Information":
      language === "ar" ? "معلومات التسعير" : "Pricing Information",
    "Inventory Information":
      language === "ar" ? "معلومات المخزون" : "Inventory Information",
    "Additional Information":
      language === "ar" ? "معلومات إضافية" : "Additional Information",
    "Created At": language === "ar" ? "تاريخ الإنشاء" : "Created At",
    "Updated At": language === "ar" ? "تاريخ التحديث" : "Updated At",
    "Sort by": language === "ar" ? "ترتيب حسب" : "Sort by",
    "Sort Ascending": language === "ar" ? "ترتيب تصاعدي" : "Sort Ascending",
    "Date Created": language === "ar" ? "تاريخ الإنشاء" : "Date Created",
    Management: language === "ar" ? "إدارة" : "Management",
    "Manage Categories":
      language === "ar" ? "إدارة الفئات" : "Manage Categories",
    "Manage Brands":
      language === "ar" ? "إدارة العلامات التجارية" : "Manage Brands",
    "Manage Images": language === "ar" ? "إدارة الصور" : "Manage Images",
    "View Statistics": language === "ar" ? "عرض الإحصائيات" : "View Statistics",
    Uncategorized: language === "ar" ? "غير مصنف" : "Uncategorized",
    "No Category": language === "ar" ? "بدون فئة" : "No Category",
    "No Brand": language === "ar" ? "بدون علامة تجارية" : "No Brand",
    "No Image": language === "ar" ? "بدون صورة" : "No Image",
    "Multiple Images": language === "ar" ? "صور متعددة" : "Multiple Images",
    Quantity: language === "ar" ? "الكمية" : "Quantity",
    "No Description": language === "ar" ? "بدون وصف" : "No Description",
    "Recently Added": language === "ar" ? "مضاف حديثاً" : "Recently Added",
    Featured: language === "ar" ? "مميز" : "Featured",
    Discount: language === "ar" ? "خصم" : "Discount",
    "Minimum Price": language === "ar" ? "الحد الأدنى للسعر" : "Minimum Price",
    "Internal Notes": language === "ar" ? "ملاحظات داخلية" : "Internal Notes",
    Supplier: language === "ar" ? "المورد" : "Supplier",
    Manufacturer: language === "ar" ? "الشركة المصنعة" : "Manufacturer",
    "Price List": language === "ar" ? "قائمة الأسعار" : "Price List",
    "Related Data": language === "ar" ? "البيانات المرتبطة" : "Related Data",
    "Stock Alert": language === "ar" ? "تنبيه المخزون" : "Stock Alert",
    "Stock Alerts": language === "ar" ? "تنبيهات المخزون" : "Stock Alerts",
    "items need attention":
      language === "ar" ? "عناصر تحتاج لانتباه" : "items need attention",
    Retry: language === "ar" ? "إعادة المحاولة" : "Retry",
    "Go to Dashboard":
      language === "ar" ? "انتقل إلى لوحة التحكم" : "Go to Dashboard",
    "Quick Actions": language === "ar" ? "إجراءات سريعة" : "Quick Actions",
    "Inventory Management":
      language === "ar" ? "إدارة المخزون" : "Inventory Management",
    "Advanced Options":
      language === "ar" ? "خيارات متقدمة" : "Advanced Options",
    "Bulk Actions": language === "ar" ? "الإجراءات المجمعة" : "Bulk Actions",
    "Export Selected": language === "ar" ? "تصدير المحدد" : "Export Selected",
    "Export All": language === "ar" ? "تصدير الكل" : "Export All",
    "Delete Selected": language === "ar" ? "حذف المحدد" : "Delete Selected",
    "Update Status": language === "ar" ? "تحديث الحالة" : "Update Status",
    "Batch Edit": language === "ar" ? "تحرير مجمع" : "Batch Edit",
    "Import Products":
      language === "ar" ? "استيراد المنتجات" : "Import Products",
    "Product Templates":
      language === "ar" ? "قوالب المنتجات" : "Product Templates",
    "Pricing Rules": language === "ar" ? "قواعد التسعير" : "Pricing Rules",
    "Stock Movements": language === "ar" ? "حركات المخزون" : "Stock Movements",
    Popular: language === "ar" ? "شائع" : "Popular",
    New: language === "ar" ? "جديد" : "New",
    Sale: language === "ar" ? "تخفيض" : "Sale",
    Hot: language === "ar" ? "مطلوب" : "Hot",
    pages: language === "ar" ? "صفحات" : "pages",
    "Go to page": language === "ar" ? "انتقل إلى الصفحة" : "Go to page",
    "items per page": language === "ar" ? "عنصر في الصفحة" : "items per page",
    Previous: language === "ar" ? "السابق" : "Previous",
    Next: language === "ar" ? "التالي" : "Next",
    First: language === "ar" ? "الأول" : "First",
    Last: language === "ar" ? "الأخير" : "Last",
    Page: language === "ar" ? "صفحة" : "Page",
  };

  // Fetch products on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getProducts();
        await getCategoriesDropdown();
        await getBrandsDropdown();
        await getStatisticsOverview();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token, location]);

  // Update local statistics when products change
  useEffect(() => {
    if (Array.isArray(productsData) && productsData.length > 0) {
      const now = new Date();
      const stats = {
        totalProducts: pagination?.TotalItems || productsData.length,
        activeProducts: productsData.filter((p) => p.Status === "Active")
          .length,
        productsThisMonth: productsData.filter((p) => {
          const createdDate = new Date(p.CreatedAt);
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
        lowStockItems: productsData.filter(
          (p) =>
            p.StockStatus === "Low Stock" || p.StockStatus === "Out of Stock"
        ).length,
        totalInventoryValue: productsData.reduce(
          (sum, p) => sum + (p.StockValue || 0),
          0
        ),
        totalStockValue: productsData.reduce(
          (sum, p) => sum + (parseFloat(p.UnitPrice) || 0),
          0
        ),
      };
      setStatistics(stats);
    }
  }, [productsData, pagination]);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchProducts();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Handle selection changes
  useEffect(() => {
    setSelectedProducts([]);
    setSelectAll(false);
  }, [productsData]);

  // Check authentication
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Search function
  const handleSearchProducts = async () => {
    try {
      const newFilters = {
        ...filters,
        searchTerm: searchTerm.trim(),
      };
      setFilters(newFilters);

      await getProducts({
        page: 1,
        search: searchTerm.trim(),
        status: filterOptions.status,
        categoryId: filterOptions.categoryId,
        sortBy: filterOptions.sortBy,
        sortAscending: filterOptions.sortAscending,
        lowStockOnly: filterOptions.lowStockOnly,
      });
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  // Product selection
  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      const productIds = Array.isArray(productsData)
        ? productsData.map((product) => product.Id)
        : [];
      setSelectedProducts(productIds);
    }
    setSelectAll(!selectAll);
  };

  // Product actions
  const handleViewProduct = async (productId) => {
    try {
      const productData = await getProduct(productId);
      if (productData) {
        setSelectedProduct(productData);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Failed to fetch product details");
    }
  };

  const handleEditProduct = async (productId) => {
    try {
      const productData = await getProduct(productId);
      if (productData) {
        navigate("/admin/new-product", {
          state: {
            editData: productData,
            isEditing: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      alert("Failed to fetch product details for editing");
    }
  };

  const handleCloneProduct = async (productId) => {
    try {
      const productData = await getProduct(productId);
      if (productData) {
        navigate("/admin/new-product", {
          state: {
            cloneData: {
              ...productData,
              Name: `${productData.Name || ""} (Copy)`,
              ItemCode: "",
              Barcode: "",
              Id: undefined,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error cloning product:", error);
      alert("Failed to clone product");
    }
  };

  const handleDeleteProduct = (productId) => {
    const product = Array.isArray(productsData)
      ? productsData.find((p) => p.Id === productId)
      : null;
    if (product) {
      setProductToDelete(product);
      setShowDeleteModal(true);
    } else {
      alert("Product not found");
    }
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.Id);
      setShowDeleteModal(false);
      setProductToDelete(null);
      await getProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination
  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > pagination.TotalPages) return;

    try {
      await changePage(newPage);
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };

  const handlePageSizeChange = async (newPageSize) => {
    try {
      await changePageSize(newPageSize);
    } catch (error) {
      console.error("Error changing page size:", error);
    }
  };

  // Filter functions
  const handleApplyFilters = async () => {
    try {
      const newFilters = {
        ...filters,
        status: filterOptions.status,
        categoryId: filterOptions.categoryId,
        sortBy: filterOptions.sortBy,
        sortAscending: filterOptions.sortAscending,
        lowStockOnly: filterOptions.lowStockOnly,
      };
      setFilters(newFilters);

      await getProducts({
        page: 1,
        search: searchTerm.trim(),
        status: filterOptions.status,
        categoryId: filterOptions.categoryId,
        sortBy: filterOptions.sortBy,
        sortAscending: filterOptions.sortAscending,
        lowStockOnly: filterOptions.lowStockOnly,
      });

      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm("");
    setFilterOptions({
      status: "",
      categoryId: null,
      sortBy: "name",
      sortAscending: true,
      lowStockOnly: false,
    });
    setShowFilters(false);

    try {
      const newFilters = {
        searchTerm: "",
        status: "",
        categoryId: null,
        sortBy: "name",
        sortAscending: true,
        lowStockOnly: false,
      };
      setFilters(newFilters);
      await getProducts({ page: 1 });
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  // CSV Export functionality
  const convertToCSV = (data) => {
    const headers = [
      "ID",
      "Name",
      "Item Code",
      "Barcode",
      "Description",
      "Category",
      "Brand",
      "Unit Price",
      "Purchase Price",
      "Minimum Price",
      "Current Stock",
      "Minimum Stock",
      "Stock Status",
      "Status",
      "Discount",
      "Discount Type",
      "Stock Value",
      "Created At",
      "Updated At",
    ];

    const csvContent = [
      headers.join(","),
      ...data.map((product) =>
        [
          product.Id || "",
          `"${(product.Name || "").replace(/"/g, '""')}"`,
          product.ItemCode || "",
          product.Barcode || "",
          `"${(product.Description || "").replace(/"/g, '""')}"`,
          `"${getCategoryName(product.CategoryId)}"`,
          `"${getBrandName(product.BrandId)}"`,
          formatCurrency(product.UnitPrice),
          formatCurrency(product.PurchasePrice),
          formatCurrency(product.MinimumPrice),
          formatStock(product.CurrentStock),
          formatStock(product.MinimumStock),
          product.StockStatus || "",
          product.Status || "",
          product.Discount || "",
          product.DiscountType || "",
          formatCurrency(product.StockValue),
          product.CreatedAt
            ? new Date(product.CreatedAt).toLocaleDateString()
            : "",
          product.UpdatedAt
            ? new Date(product.UpdatedAt).toLocaleDateString()
            : "",
        ].join(",")
      ),
    ].join("\n");

    return csvContent;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fetchAllProductsForExport = async () => {
    try {
      // Fetch all products without pagination
      const allProductsResponse = await getProducts({
        page: 1,
        pageSize: 999999, // Large number to get all products
        search: searchTerm.trim(),
        status: filterOptions.status,
        categoryId: filterOptions.categoryId,
        sortBy: filterOptions.sortBy,
        sortAscending: filterOptions.sortAscending,
        lowStockOnly: filterOptions.lowStockOnly,
      });

      return allProductsResponse?.Data?.$values || productsData;
    } catch (error) {
      console.error("Error fetching all products:", error);
      return productsData; // Fallback to current page data
    }
  };

  // Export functionality
  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      let dataToExport = [];

      if (selectedProducts.length > 0) {
        // Export selected products
        dataToExport = productsData.filter((product) =>
          selectedProducts.includes(product.Id)
        );
      } else {
        // Export all products (fetch all pages)
        dataToExport = await fetchAllProductsForExport();
      }

      if (dataToExport.length === 0) {
        alert("No products to export");
        return;
      }

      const csvContent = convertToCSV(dataToExport);
      const timestamp = new Date().toISOString().split("T")[0];
      const filename =
        selectedProducts.length > 0
          ? `selected_products_${timestamp}.csv`
          : `all_products_${timestamp}.csv`;

      downloadCSV(csvContent, filename);

      // Show success message
      alert(`Successfully exported ${dataToExport.length} products to CSV`);
    } catch (error) {
      console.error("Error exporting products:", error);
      alert("Failed to export products. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Utility functions
  const formatCurrency = (value) => {
    const numValue = parseFloat(value) || 0;
    return numValue.toFixed(2);
  };

  const formatStock = (stock) => {
    return stock?.toString() || "0";
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return translations["No Category"];

    // Ensure categories is an array before calling find
    const categories = Array.isArray(dropdowns?.categories)
      ? dropdowns.categories
      : [];
    const category = categories.find((c) => c.Id === categoryId);
    return category?.Name || translations["Uncategorized"];
  };

  const getBrandName = (brandId) => {
    if (!brandId) return translations["No Brand"];

    // Ensure brands is an array before calling find
    const brands = Array.isArray(dropdowns?.brands) ? dropdowns.brands : [];
    const brand = brands.find((b) => b.Id === brandId);
    return brand?.Name || translations["No Brand"];
  };

  // Statistics Card Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor,
    isCurrency = false,
    isAlert = false,
  }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <Container className="flex items-center justify-between">
        <Container>
          <Span className="text-gray-500 text-sm font-medium">{title}</Span>
          <Container className="flex items-center gap-2 mt-1">
            <Span
              className={`text-2xl font-bold ${isAlert && value > 0 ? "text-red-600" : "text-gray-900"
                }`}
            >
              {isCurrency ? `$${formatCurrency(value)}` : value || 0}
            </Span>
            {isAlert && value > 0 && (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
          </Container>
        </Container>
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
      </Container>
    </Container>
  );

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Container className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
        </Container>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <Container className="flex items-center gap-4 mb-4 lg:mb-0">
            <Container className="flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {translations.Products}
              </h1>
            </Container>
            {selectedProducts.length > 0 && (
              <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedProducts.length} {translations.Selected}
              </Span>
            )}
          </Container>

          <Container className="flex gap-3 flex-wrap">
            {/* Management Buttons */}
            <FilledButton
              isIcon={true}
              icon={Layers}
              iconSize="w-4 h-4"
              bgColor="bg-purple-100 hover:bg-purple-200"
              textColor="text-purple-700"
              rounded="rounded-lg"
              buttonText={translations["Manage Categories"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/product-categories")}
            />

            <FilledButton
              isIcon={true}
              icon={Star}
              iconSize="w-4 h-4"
              bgColor="bg-yellow-100 hover:bg-yellow-200"
              textColor="text-yellow-700"
              rounded="rounded-lg"
              buttonText={translations["Manage Brands"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/product-brands")}
            />

            <FilledButton
              isIcon={true}
              icon={BarChart3}
              iconSize="w-4 h-4"
              bgColor="bg-green-100 hover:bg-green-200"
              textColor="text-green-700"
              rounded="rounded-lg"
              buttonText={translations["View Statistics"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/product-statistics")}
            />

            {/* Action Buttons */}
            <FilledButton
              isIcon={true}
              icon={Filter}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Filters}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => setShowFilters(true)}
            />

            <FilledButton
              isIcon={true}
              icon={Download}
              iconSize="w-4 h-4"
              bgColor={
                isExporting ? "bg-gray-400" : "bg-gray-100 hover:bg-gray-200"
              }
              textColor={isExporting ? "text-gray-600" : "text-gray-700"}
              rounded="rounded-lg"
              buttonText={
                isExporting ? translations.Exporting : translations.Export
              }
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleExport}
              disabled={isExporting}
            />

            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Product"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/new-product")}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Products}`}
            value={statistics?.totalProducts || 0}
            icon={Package}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations.Active}
            value={statistics?.activeProducts || 0}
            icon={Settings}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations["This Month"]}
            value={statistics?.productsThisMonth || 0}
            icon={Calendar}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatCard
            title={translations["Low Stock Items"]}
            value={statistics?.lowStockItems || 0}
            icon={AlertTriangle}
            bgColor="bg-red-50"
            iconColor="text-red-600"
            isAlert={true}
          />
          <StatCard
            title={translations["Inventory Value"]}
            value={statistics?.totalInventoryValue || 0}
            icon={DollarSign}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
            isCurrency={true}
          />
          <StatCard
            title={translations["Stock Value"]}
            value={statistics?.totalStockValue || 0}
            icon={TrendingUp}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            isCurrency={true}
          />
        </Container>

        {/* Search Bar */}
        <Container className="mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
            <SearchAndFilters
              isFocused={isFocused}
              searchValue={searchTerm}
              setSearchValue={setSearchTerm}
              placeholder={`${translations.Search
                } ${translations.Products.toLowerCase()}...`}
            />
          </Container>
        </Container>

        {/* Product Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {productsLoading ? (
            <Container className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <Span className="text-blue-500 text-lg block mt-4">
                {translations.Loading}
              </Span>
            </Container>
          ) : error ? (
            <Container className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <Span className="text-red-500 text-lg block mb-4">
                Error: {error}
              </Span>
              <FilledButton
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={translations.Retry}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => getProducts()}
              />
            </Container>
          ) : !Array.isArray(productsData) || productsData.length === 0 ? (
            <Container className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ||
                  filterOptions.status ||
                  filterOptions.categoryId ||
                  filterOptions.lowStockOnly
                  ? translations["No results found"]
                  : translations.NoProducts}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ||
                  filterOptions.status ||
                  filterOptions.categoryId ||
                  filterOptions.lowStockOnly
                  ? "Try adjusting your filters or search terms"
                  : "Get started by adding your first product"}
              </p>
              <Container className="flex gap-3 justify-center">
                {(searchTerm ||
                  filterOptions.status ||
                  filterOptions.categoryId ||
                  filterOptions.lowStockOnly) && (
                    <FilledButton
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-lg"
                      buttonText={`${translations["Clear All"]} ${translations.Filters}`}
                      height="h-10"
                      px="px-4"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      onClick={handleClearFilters}
                    />
                  )}
                <FilledButton
                  isIcon={true}
                  icon={Plus}
                  iconSize="w-4 h-4"
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={translations["Add Product"]}
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={() => navigate("/admin/new-product")}
                />
              </Container>
            </Container>
          ) : (
            <>
              <Container className="overflow-x-auto">
                <Table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Name}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        {translations["Item Code"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations.Category}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations["Unit Price"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations["Current Stock"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Status}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productsData.map((product) => (
                      <tr
                        key={product.Id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.Id)}
                            onChange={() => handleProductSelection(product.Id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex items-center gap-3">
                            {product.Images && product.Images.length > 0 ? (
                              <Container className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={product.Images[0].Image}
                                  alt={product.Name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                <Container className="w-full h-full flex items-center justify-center hidden">
                                  <Image className="w-5 h-5 text-gray-400" />
                                </Container>
                              </Container>
                            ) : (
                              <Container className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Image className="w-5 h-5 text-gray-400" />
                              </Container>
                            )}
                            <Container>
                              <Container className="flex items-center gap-2">
                                <Span className="text-sm font-medium text-gray-900">
                                  {product.Name || "N/A"}
                                </Span>
                                {product.StockStatus === "Low Stock" && (
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                )}
                                {product.StockStatus === "Out of Stock" && (
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                              </Container>
                              {product.Description && (
                                <Span className="text-sm text-gray-500 block truncate max-w-xs">
                                  {product.Description}
                                </Span>
                              )}
                              {product.Barcode && (
                                <Container className="flex items-center gap-1 mt-1">
                                  <AiOutlineBarcode className="w-3 h-3 text-gray-400" />
                                  <Span className="text-xs text-gray-500">
                                    {product.Barcode}
                                  </Span>
                                </Container>
                              )}
                            </Container>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Container className="flex items-center gap-1">
                            <Package className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {product.ItemCode || "-"}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <Container className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {getCategoryName(product.CategoryId)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <Container className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <Span className="text-sm font-medium text-green-600">
                              {formatCurrency(product.UnitPrice)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <Container className="flex items-center gap-2">
                            <Span className="text-sm text-gray-900">
                              {formatStock(product.CurrentStock)}
                            </Span>
                            <Span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(
                                product.StockStatus
                              )}`}
                            >
                              {translations[product.StockStatus] ||
                                product.StockStatus}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4">
                          <Span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              product.Status
                            )}`}
                          >
                            {translations[product.Status] || product.Status}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-1">
                            <button
                              onClick={() => handleViewProduct(product.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              title={translations.View}
                            >
                              <AiOutlineEye className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleEditProduct(product.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                              title={translations.Edit}
                            >
                              <AiOutlineEdit className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleCloneProduct(product.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                              title={translations.Clone}
                            >
                              <AiOutlineCopy className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                              title={translations.Delete}
                            >
                              <AiOutlineDelete className="w-3 h-3" />
                            </button>
                          </Container>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>

              {/* Pagination */}
              {pagination &&
                pagination.TotalPages &&
                pagination.TotalPages > 1 && (
                  <Container className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 gap-4">
                    <Container className="flex items-center gap-4">
                      <Span className="text-sm text-gray-500">
                        {translations.Showing}{" "}
                        {(pagination.PageNumber - 1) * pagination.PageSize + 1}{" "}
                        -{" "}
                        {Math.min(
                          pagination.PageNumber * pagination.PageSize,
                          pagination.TotalItems
                        )}{" "}
                        {translations.Of} {pagination.TotalItems}{" "}
                        {translations.Items}
                      </Span>

                      <Container className="flex items-center gap-2">
                        <Span className="text-sm text-gray-500">
                          {translations["items per page"]}:
                        </Span>
                        <select
                          value={pagination.PageSize}
                          onChange={(e) =>
                            handlePageSizeChange(parseInt(e.target.value))
                          }
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </Container>
                    </Container>

                    <Container className="flex gap-2">
                      <FilledButton
                        isIcon={true}
                        icon={ChevronsLeft}
                        iconSize="w-4 h-4"
                        bgColor="bg-gray-100 hover:bg-gray-200"
                        textColor="text-gray-700"
                        rounded="rounded-md"
                        buttonText=""
                        height="h-8"
                        width="w-8"
                        disabled={!pagination.HasPreviousPage}
                        onClick={() => handlePageChange(1)}
                        title={translations.First}
                      />
                      <FilledButton
                        isIcon={true}
                        icon={ChevronLeft}
                        iconSize="w-4 h-4"
                        bgColor="bg-gray-100 hover:bg-gray-200"
                        textColor="text-gray-700"
                        rounded="rounded-md"
                        buttonText=""
                        height="h-8"
                        width="w-8"
                        disabled={!pagination.HasPreviousPage}
                        onClick={() =>
                          handlePageChange(pagination.PageNumber - 1)
                        }
                        title={translations.Previous}
                      />
                      <Span className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center">
                        {translations.Page} {pagination.PageNumber}{" "}
                        {translations.Of} {pagination.TotalPages}
                      </Span>
                      <FilledButton
                        isIcon={true}
                        icon={ChevronRight}
                        iconSize="w-4 h-4"
                        bgColor="bg-gray-100 hover:bg-gray-200"
                        textColor="text-gray-700"
                        rounded="rounded-md"
                        buttonText=""
                        height="h-8"
                        width="w-8"
                        disabled={!pagination.HasNextPage}
                        onClick={() =>
                          handlePageChange(pagination.PageNumber + 1)
                        }
                        title={translations.Next}
                      />
                      <FilledButton
                        isIcon={true}
                        icon={ChevronsRight}
                        iconSize="w-4 h-4"
                        bgColor="bg-gray-100 hover:bg-gray-200"
                        textColor="text-gray-700"
                        rounded="rounded-md"
                        buttonText=""
                        height="h-8"
                        width="w-8"
                        disabled={!pagination.HasNextPage}
                        onClick={() => handlePageChange(pagination.TotalPages)}
                        title={translations.Last}
                      />
                    </Container>
                  </Container>
                )}
            </>
          )}
        </Container>
      </Container>

      {/* View Product Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Product Details"]}</Span>
          </Container>
        }
        width={1000}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditProduct(selectedProduct?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedProduct && (
            <Container className="max-h-96 overflow-y-auto">
              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    {translations["Basic Information"]}
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Name}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedProduct.Name || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Item Code"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedProduct.ItemCode || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Barcode}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedProduct.Barcode || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Description}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedProduct.Description ||
                        translations["No Description"]}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Status}
                    </Span>
                    <Span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
                        selectedProduct.Status
                      )}`}
                    >
                      {translations[selectedProduct.Status] ||
                        selectedProduct.Status}
                    </Span>
                  </Container>
                </Container>

                {/* Pricing Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    {translations["Pricing Information"]}
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Purchase Price"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      ${formatCurrency(selectedProduct.PurchasePrice)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Unit Price"]}
                    </Span>
                    <Span className="text-sm text-green-600 font-medium block mt-1">
                      ${formatCurrency(selectedProduct.UnitPrice)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Minimum Price"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      ${formatCurrency(selectedProduct.MinimumPrice)}
                    </Span>
                  </Container>

                  {selectedProduct.Discount && (
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Discount}
                      </Span>
                      <Span className="text-sm text-orange-600 block mt-1">
                        {selectedProduct.DiscountType === "percentage"
                          ? `${selectedProduct.Discount}%`
                          : `$${formatCurrency(selectedProduct.Discount)}`}
                      </Span>
                    </Container>
                  )}
                </Container>
              </Container>

              {/* Inventory Information */}
              <Container className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  {translations["Inventory Information"]}
                </h3>

                <Container className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Current Stock"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {formatStock(selectedProduct.CurrentStock)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Minimum Stock"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {formatStock(selectedProduct.MinimumStock)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Stock Status"]}
                    </Span>
                    <Span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStockStatusColor(
                        selectedProduct.StockStatus
                      )}`}
                    >
                      {translations[selectedProduct.StockStatus] ||
                        selectedProduct.StockStatus}
                    </Span>
                  </Container>
                </Container>
              </Container>

              {/* Related Data */}
              <Container className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  {translations["Related Data"]}
                </h3>

                <Container className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Container className="text-center">
                    <Span className="text-lg font-bold text-blue-600">
                      {selectedProduct.Categories?.length || 0}
                    </Span>
                    <Span className="text-xs text-gray-500 block">
                      {translations.Categories}
                    </Span>
                  </Container>
                  <Container className="text-center">
                    <Span className="text-lg font-bold text-yellow-600">
                      {selectedProduct.Brands?.length || 0}
                    </Span>
                    <Span className="text-xs text-gray-500 block">
                      {translations.Brands}
                    </Span>
                  </Container>
                  <Container className="text-center">
                    <Span className="text-lg font-bold text-purple-600">
                      {selectedProduct.Tags?.length || 0}
                    </Span>
                    <Span className="text-xs text-gray-500 block">
                      {translations.Tags}
                    </Span>
                  </Container>
                  <Container className="text-center">
                    <Span className="text-lg font-bold text-green-600">
                      {selectedProduct.Images?.length || 0}
                    </Span>
                    <Span className="text-xs text-gray-500 block">
                      {translations.Images}
                    </Span>
                  </Container>
                </Container>

                <Container className="text-xs text-gray-500 space-y-1 mt-4">
                  <Container>
                    {translations["Created At"]}:{" "}
                    {selectedProduct.CreatedAt
                      ? new Date(selectedProduct.CreatedAt).toLocaleDateString()
                      : "N/A"}
                  </Container>
                  {selectedProduct.UpdatedAt && (
                    <Container>
                      {translations["Updated At"]}:{" "}
                      {new Date(selectedProduct.UpdatedAt).toLocaleDateString()}
                    </Container>
                  )}
                </Container>
              </Container>
            </Container>
          )
        }
      />

      {/* Delete Confirmation Modal */}
      <Modall
        modalOpen={showDeleteModal}
        setModalOpen={setShowDeleteModal}
        title={
          <Container className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <Span>{translations["Delete Product"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteProduct}
        cancelAction={() => setShowDeleteModal(false)}
        okButtonDisabled={isDeleting}
        body={
          <Container className="text-center py-4">
            <Container className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </Container>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {translations["Are you sure?"]}
            </h3>
            <Span className="text-gray-500 mb-4 block">
              {translations["This action cannot be undone"]}. This will
              permanently delete the product{" "}
              <strong>"{productToDelete?.Name}"</strong> and all associated
              data.
            </Span>
          </Container>
        }
      />

      {/* Filters Sidebar */}
      {showFilters && (
        <Container className="fixed inset-0 z-50 overflow-hidden">
          <Container
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowFilters(false)}
          />
          <Container className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <Container className="p-6 h-full flex flex-col">
              <Container className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {translations.Filters}
                </h3>
                <FilledButton
                  isIcon={true}
                  icon={X}
                  iconSize="w-4 h-4"
                  bgColor="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  rounded="rounded-md"
                  buttonText=""
                  height="h-8"
                  width="w-8"
                  onClick={() => setShowFilters(false)}
                />
              </Container>

              <Container className="space-y-4 flex-1">
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Status}
                  </label>
                  <select
                    value={filterOptions.status}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{translations["All Status"]}</option>
                    <option value="Active">{translations.Active}</option>
                    <option value="Inactive">{translations.Inactive}</option>
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Category}
                  </label>
                  <select
                    value={filterOptions.categoryId || ""}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        categoryId: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{translations["All Categories"]}</option>
                    {dropdowns?.categories?.map((category) => (
                      <option key={category.Id} value={category.Id}>
                        {category.Name}
                      </option>
                    ))}
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Sort by"]}
                  </label>
                  <select
                    value={filterOptions.sortBy}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        sortBy: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="name">{translations.Name}</option>
                    <option value="itemcode">
                      {translations["Item Code"]}
                    </option>
                    <option value="unitprice">
                      {translations["Unit Price"]}
                    </option>
                    <option value="currentstock">
                      {translations["Current Stock"]}
                    </option>
                    <option value="status">{translations.Status}</option>
                    <option value="createdat">
                      {translations["Date Created"]}
                    </option>
                  </select>
                </Container>

                <Container>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterOptions.sortAscending}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          sortAscending: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Span className="ml-2 text-sm text-gray-700">
                      {translations["Sort Ascending"]}
                    </Span>
                  </label>
                </Container>

                <Container>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterOptions.lowStockOnly}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          lowStockOnly: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Span className="ml-2 text-sm text-gray-700">
                      {translations["Show Low Stock Only"]}
                    </Span>
                  </label>
                </Container>
              </Container>

              <Container className="flex gap-3 mt-6">
                <FilledButton
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={translations["Apply Filters"]}
                  height="h-10"
                  width="flex-1"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={handleApplyFilters}
                />
                <FilledButton
                  bgColor="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  rounded="rounded-lg"
                  buttonText={translations["Clear All"]}
                  height="h-10"
                  width="flex-1"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={handleClearFilters}
                />
              </Container>
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default ProductsList;
