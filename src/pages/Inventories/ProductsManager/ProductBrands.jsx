import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  X,
  Star,
  ArrowLeft,
  AlertTriangle,
  Package,
  Search,
  Building,
  Tag,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineCopy,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineFilter,
  AiOutlineDownload,
} from "react-icons/ai";
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../../components/elements/modal/Modal";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../../components/elements/table/Table";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const ProductBrands = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const translations = {
    "Product Brands":
      language === "ar" ? "علامات المنتجات التجارية" : "Product Brands",
    "Back to Products":
      language === "ar" ? "العودة للمنتجات" : "Back to Products",
    "Add Brand": language === "ar" ? "إضافة علامة تجارية" : "Add Brand",
    Brands: language === "ar" ? "العلامات التجارية" : "Brands",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No Brands":
      language === "ar" ? "لا يوجد علامات تجارية" : "No brands found",
    Name: language === "ar" ? "الاسم" : "Name",
    Description: language === "ar" ? "الوصف" : "Description",
    Product: language === "ar" ? "المنتج" : "Product",
    "Created At": language === "ar" ? "تاريخ الإنشاء" : "Created At",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    Active: language === "ar" ? "نشط" : "Active",
    Inactive: language === "ar" ? "غير نشط" : "Inactive",
    Total: language === "ar" ? "المجموع" : "Total",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Brand": language === "ar" ? "حذف العلامة التجارية" : "Delete Brand",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Brand Details":
      language === "ar" ? "تفاصيل العلامة التجارية" : "Brand Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "All Status": language === "ar" ? "جميع الحالات" : "All Status",
    "Sort by": language === "ar" ? "ترتيب حسب" : "Sort by",
    "Sort Ascending": language === "ar" ? "ترتيب تصاعدي" : "Sort Ascending",
    "Date Created": language === "ar" ? "تاريخ الإنشاء" : "Date Created",
    "Brand Management":
      language === "ar" ? "إدارة العلامات التجارية" : "Brand Management",
    "No Description": language === "ar" ? "بدون وصف" : "No Description",
    "No Product": language === "ar" ? "بدون منتج" : "No Product",
    "Recently Added": language === "ar" ? "مضاف حديثاً" : "Recently Added",
    "Popular Brands":
      language === "ar" ? "العلامات التجارية الشائعة" : "Popular Brands",
    "New Brands": language === "ar" ? "علامات تجارية جديدة" : "New Brands",
    Retry: language === "ar" ? "إعادة المحاولة" : "Retry",
    "Basic Information":
      language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Brand Statistics":
      language === "ar" ? "إحصائيات العلامة التجارية" : "Brand Statistics",
    "Associated Products":
      language === "ar" ? "المنتجات المرتبطة" : "Associated Products",
    "Brand Performance":
      language === "ar" ? "أداء العلامة التجارية" : "Brand Performance",
    "Market Share": language === "ar" ? "حصة السوق" : "Market Share",
    "Growth Rate": language === "ar" ? "معدل النمو" : "Growth Rate",
    Revenue: language === "ar" ? "الإيرادات" : "Revenue",
    "Products Count": language === "ar" ? "عدد المنتجات" : "Products Count",
    "Average Price": language === "ar" ? "متوسط السعر" : "Average Price",
    "Top Performing": language === "ar" ? "الأفضل أداءً" : "Top Performing",
    Trending: language === "ar" ? "الأكثر رواجاً" : "Trending",
    Premium: language === "ar" ? "مميزة" : "Premium",
    Budget: language === "ar" ? "اقتصادية" : "Budget",
    Luxury: language === "ar" ? "فاخرة" : "Luxury",
    Popular: language === "ar" ? "شائعة" : "Popular",
    Status: language === "ar" ? "الحالة" : "Status",
    "Product ID": language === "ar" ? "معرف المنتج" : "Product ID",
    "Created By": language === "ar" ? "أنشأ بواسطة" : "Created By",
    "Updated At": language === "ar" ? "تاريخ التحديث" : "Updated At",
    "Brand Value": language === "ar" ? "قيمة العلامة التجارية" : "Brand Value",
    "Total Value": language === "ar" ? "القيمة الإجمالية" : "Total Value",
    "Average Rating": language === "ar" ? "متوسط التقييم" : "Average Rating",
    "Customer Satisfaction":
      language === "ar" ? "رضا العملاء" : "Customer Satisfaction",
    "Market Position": language === "ar" ? "موقع السوق" : "Market Position",
    "Competitive Analysis":
      language === "ar" ? "تحليل المنافسة" : "Competitive Analysis",
    "Brand Loyalty":
      language === "ar" ? "ولاء العلامة التجارية" : "Brand Loyalty",
    "Brand Recognition":
      language === "ar" ? "تميز العلامة التجارية" : "Brand Recognition",
    Save: language === "ar" ? "حفظ" : "Save",
    Saving: language === "ar" ? "جارٍ الحفظ" : "Saving",
    Required: language === "ar" ? "مطلوب" : "Required",
    Optional: language === "ar" ? "اختياري" : "Optional",
    "Select Product": language === "ar" ? "اختر منتج" : "Select Product",
    "Brand name is required":
      language === "ar"
        ? "اسم العلامة التجارية مطلوب"
        : "Brand name is required",
    "Brand name already exists":
      language === "ar"
        ? "اسم العلامة التجارية موجود بالفعل"
        : "Brand name already exists",
    "Failed to save brand":
      language === "ar"
        ? "فشل في حفظ العلامة التجارية"
        : "Failed to save brand",
    "Brand saved successfully":
      language === "ar"
        ? "تم حفظ العلامة التجارية بنجاح"
        : "Brand saved successfully",
    "Failed to delete brand":
      language === "ar"
        ? "فشل في حذف العلامة التجارية"
        : "Failed to delete brand",
    "Brand deleted successfully":
      language === "ar"
        ? "تم حذف العلامة التجارية بنجاح"
        : "Brand deleted successfully",
    "Failed to fetch brand details":
      language === "ar"
        ? "فشل في جلب تفاصيل العلامة التجارية"
        : "Failed to fetch brand details",
    "Brand Management Dashboard":
      language === "ar"
        ? "لوحة تحكم إدارة العلامات التجارية"
        : "Brand Management Dashboard",
    "Brand Overview":
      language === "ar" ? "نظرة عامة على العلامة التجارية" : "Brand Overview",
    "Performance Metrics":
      language === "ar" ? "مقاييس الأداء" : "Performance Metrics",
    "Quick Stats": language === "ar" ? "إحصائيات سريعة" : "Quick Stats",
    "Brand Analytics":
      language === "ar" ? "تحليلات العلامة التجارية" : "Brand Analytics",
    items: language === "ar" ? "عناصر" : "items",
    pages: language === "ar" ? "صفحات" : "pages",
    "Go to page": language === "ar" ? "انتقل إلى الصفحة" : "Go to page",
    "items per page": language === "ar" ? "عنصر في الصفحة" : "items per page",
    Previous: language === "ar" ? "السابق" : "Previous",
    Next: language === "ar" ? "التالي" : "Next",
    First: language === "ar" ? "الأول" : "First",
    Last: language === "ar" ? "الأخير" : "Last",
    Page: language === "ar" ? "صفحة" : "Page",
  };

  // Get products context
  const {
    productBrands,
    currentProductBrand,
    products,
    dropdowns,
    loading: brandsLoading,
    error,
    pagination,
    getProductBrands,
    getProductBrand,
    createProductBrand,
    updateProductBrand,
    deleteProductBrand,
    getProductsDropdown,
    changePage,
    changePageSize,
    setFilters,
  } = useProductsManager();

  // Process brands data from API response
  const brandsData = Array.isArray(productBrands?.Data?.$values)
    ? productBrands.Data.$values
    : [];
  const productsDropdown = Array.isArray(dropdowns?.products)
    ? dropdowns.products
    : [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    sortBy: "name",
    sortAscending: true,
  });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productId: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalBrands: 0,
    popularBrands: 0,
    newBrands: 0,
    topPerforming: 0,
    recentlyAdded: 0,
    averageProducts: 0,
  });

  // Fetch brands on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getProductBrands();
        await getProductsDropdown();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token]);

  // Update statistics when brands change
  useEffect(() => {
    if (Array.isArray(brandsData) && brandsData.length > 0) {
      const now = new Date();
      const stats = {
        totalBrands: brandsData.length,
        popularBrands: brandsData.filter((b) => b.ProductId).length,
        newBrands: brandsData.filter((b) => {
          const createdDate = new Date(b.CreatedAt);
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
        topPerforming: Math.floor(brandsData.length * 0.2), // Top 20%
        recentlyAdded: brandsData.filter((b) => {
          const createdDate = new Date(b.CreatedAt);
          const daysDiff = (now - createdDate) / (1000 * 3600 * 24);
          return daysDiff <= 7; // Last 7 days
        }).length,
        averageProducts:
          brandsData.length > 0
            ? brandsData.filter((b) => b.ProductId).length / brandsData.length
            : 0,
      };
      setStatistics(stats);
    }
  }, [brandsData]);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchBrands();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Check authentication
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Search function
  const handleSearchBrands = async () => {
    try {
      await getProductBrands({
        page: 1,
        search: searchTerm.trim(),
        status: filterOptions.status,
        sortBy: filterOptions.sortBy,
        sortAscending: filterOptions.sortAscending,
      });
    } catch (error) {
      console.error("Error searching brands:", error);
    }
  };

  // Brand selection
  const handleBrandSelection = (brandId) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter((id) => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBrands([]);
    } else {
      const brandIds = Array.isArray(brandsData)
        ? brandsData.map((brand) => brand.Id)
        : [];
      setSelectedBrands(brandIds);
    }
    setSelectAll(!selectAll);
  };

  // Brand actions
  const handleViewBrand = async (brandId) => {
    try {
      const brandData = await getProductBrand(brandId);
      if (brandData) {
        setSelectedBrand(brandData);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching brand details:", error);
      alert(translations["Failed to fetch brand details"]);
    }
  };

  const handleAddBrand = () => {
    setFormData({
      name: "",
      description: "",
      productId: null,
    });
    setIsEditing(false);
    setShowAddModal(true);
  };

  const handleEditBrand = async (brandId) => {
    try {
      const brandData = await getProductBrand(brandId);
      if (brandData) {
        setFormData({
          name: brandData.Name || "",
          description: brandData.Description || "",
          productId: brandData.ProductId || null,
        });
        setSelectedBrand(brandData);
        setIsEditing(true);
        setShowAddModal(true);
      }
    } catch (error) {
      console.error("Error fetching brand for edit:", error);
      alert(translations["Failed to fetch brand details"]);
    }
  };

  const handleCloneBrand = async (brandId) => {
    try {
      const brandData = await getProductBrand(brandId);
      if (brandData) {
        setFormData({
          name: `${brandData.Name || ""} (Copy)`,
          description: brandData.Description || "",
          productId: brandData.ProductId || null,
        });
        setIsEditing(false);
        setShowAddModal(true);
      }
    } catch (error) {
      console.error("Error cloning brand:", error);
      alert("Failed to clone brand");
    }
  };

  const handleDeleteBrand = (brandId) => {
    const brand = Array.isArray(brandsData)
      ? brandsData.find((b) => b.Id === brandId)
      : null;
    if (brand) {
      setBrandToDelete(brand);
      setShowDeleteModal(true);
    } else {
      alert("Brand not found");
    }
  };

  const confirmDeleteBrand = async () => {
    if (!brandToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProductBrand(brandToDelete.Id);
      setShowDeleteModal(false);
      setBrandToDelete(null);
      await getProductBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert(translations["Failed to delete brand"]);
    } finally {
      setIsDeleting(false);
    }
  };

  // Form submission
  const handleSubmitBrand = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert(translations["Brand name is required"]);
      return;
    }

    setIsSubmitting(true);
    try {
      const brandData = {
        Name: formData.name.trim(),
        Description: formData.description.trim(),
        ProductId: formData.productId || null,
      };

      if (isEditing) {
        await updateProductBrand(selectedBrand.Id, brandData);
      } else {
        await createProductBrand(brandData);
      }

      setShowAddModal(false);
      await getProductBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      alert(translations["Failed to save brand"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility functions
  const getProductName = (productId) => {
    if (!productId) return translations["No Product"];
    const product = productsDropdown.find((p) => p.Id === productId);
    return product?.Name || translations["No Product"];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Statistics Card Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor,
    isPercentage = false,
  }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <Container className="flex items-center justify-between">
        <Container>
          <Span className="text-gray-500 text-sm font-medium">{title}</Span>
          <Span className="text-2xl font-bold text-gray-900 mt-1 block">
            {isPercentage ? `${(value * 100).toFixed(1)}%` : value || 0}
          </Span>
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
              <FilledButton
                isIcon={true}
                icon={ArrowLeft}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText=""
                height="h-8"
                width="w-8"
                onClick={() => navigate("/admin/products")}
                title={translations["Back to Products"]}
              />
              <Star className="w-6 h-6 text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {translations["Product Brands"]}
              </h1>
            </Container>
            {selectedBrands.length > 0 && (
              <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedBrands.length} {translations.Selected}
              </Span>
            )}
          </Container>

          <Container className="flex gap-3 flex-wrap">
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
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Export}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => console.log("Export brands")}
            />

            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Brand"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleAddBrand}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Brands}`}
            value={statistics?.totalBrands || 0}
            icon={Star}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations["Popular Brands"]}
            value={statistics?.popularBrands || 0}
            icon={TrendingUp}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations["New Brands"]}
            value={statistics?.newBrands || 0}
            icon={Plus}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatCard
            title={translations["Top Performing"]}
            value={statistics?.topPerforming || 0}
            icon={BarChart3}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            title={translations["Recently Added"]}
            value={statistics?.recentlyAdded || 0}
            icon={Calendar}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            title={translations["Average Products"]}
            value={statistics?.averageProducts || 0}
            icon={Package}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            isPercentage={true}
          />
        </Container>

        {/* Search Bar */}
        <Container className="mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
            <SearchAndFilters
              isFocused={isFocused}
              searchValue={searchTerm}
              setSearchValue={setSearchTerm}
              placeholder={`${
                translations.Search
              } ${translations.Brands.toLowerCase()}...`}
            />
          </Container>
        </Container>

        {/* Brands Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {brandsLoading ? (
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
                onClick={() => getProductBrands()}
              />
            </Container>
          ) : !Array.isArray(brandsData) || brandsData.length === 0 ? (
            <Container className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterOptions.status
                  ? translations["No results found"]
                  : translations["No Brands"]}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterOptions.status
                  ? "Try adjusting your filters or search terms"
                  : "Get started by adding your first brand"}
              </p>
              <Container className="flex gap-3 justify-center">
                {(searchTerm || filterOptions.status) && (
                  <FilledButton
                    bgColor="bg-gray-100 hover:bg-gray-200"
                    textColor="text-gray-700"
                    rounded="rounded-lg"
                    buttonText={`${translations["Clear All"]} ${translations.Filters}`}
                    height="h-10"
                    px="px-4"
                    fontWeight="font-medium"
                    fontSize="text-sm"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterOptions({
                        status: "",
                        sortBy: "name",
                        sortAscending: true,
                      });
                      getProductBrands();
                    }}
                  />
                )}
                <FilledButton
                  isIcon={true}
                  icon={Plus}
                  iconSize="w-4 h-4"
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={translations["Add Brand"]}
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={handleAddBrand}
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
                        {translations.Description}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations.Product}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations["Created At"]}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brandsData.map((brand) => (
                      <tr
                        key={brand.Id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand.Id)}
                            onChange={() => handleBrandSelection(brand.Id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex items-center gap-3">
                            <Container className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                              <Star className="w-5 h-5 text-white" />
                            </Container>
                            <Container>
                              <Span className="text-sm font-medium text-gray-900">
                                {brand.Name || "N/A"}
                              </Span>
                              {brand.ProductId && (
                                <Container className="flex items-center gap-1 mt-1">
                                  <Tag className="w-3 h-3 text-blue-500" />
                                  <Span className="text-xs text-blue-600">
                                    {getProductName(brand.ProductId)}
                                  </Span>
                                </Container>
                              )}
                            </Container>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Span className="text-sm text-gray-900 max-w-xs truncate">
                            {brand.Description ||
                              translations["No Description"]}
                          </Span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <Container className="flex items-center gap-1">
                            <Package className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {getProductName(brand.ProductId)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <Container className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {formatDate(brand.CreatedAt)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-1">
                            <button
                              onClick={() => handleViewBrand(brand.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              title={translations.View}
                            >
                              <AiOutlineEye className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleEditBrand(brand.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                              title={translations.Edit}
                            >
                              <AiOutlineEdit className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleCloneBrand(brand.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                              title={translations.Clone}
                            >
                              <AiOutlineCopy className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleDeleteBrand(brand.Id)}
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
                            changePageSize(parseInt(e.target.value))
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
                        onClick={() => changePage(1)}
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
                        onClick={() => changePage(pagination.PageNumber - 1)}
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
                        onClick={() => changePage(pagination.PageNumber + 1)}
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
                        onClick={() => changePage(pagination.TotalPages)}
                        title={translations.Last}
                      />
                    </Container>
                  </Container>
                )}
            </>
          )}
        </Container>
      </Container>

      {/* Add/Edit Brand Modal */}
      <Modall
        modalOpen={showAddModal}
        setModalOpen={setShowAddModal}
        title={
          <Container className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <Span>
              {isEditing ? translations.Edit : translations["Add Brand"]}
            </Span>
          </Container>
        }
        width={600}
        okText={
          isSubmitting
            ? translations.Saving
            : isEditing
            ? translations.Edit
            : translations["Add Brand"]
        }
        cancelText={translations.Cancel}
        okAction={handleSubmitBrand}
        cancelAction={() => setShowAddModal(false)}
        okButtonDisabled={isSubmitting}
        body={
          <form onSubmit={handleSubmitBrand} className="space-y-4">
            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`${translations.Name}...`}
                required
              />
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Description}{" "}
                <span className="text-gray-400">({translations.Optional})</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`${translations.Description}...`}
              />
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Product}{" "}
                <span className="text-gray-400">({translations.Optional})</span>
              </label>
              <select
                value={formData.productId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{translations["Select Product"]}</option>
                {productsDropdown.map((product) => (
                  <option key={product.Id} value={product.Id}>
                    {product.Name}
                  </option>
                ))}
              </select>
            </Container>
          </form>
        }
      />

      {/* View Brand Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Brand Details"]}</Span>
          </Container>
        }
        width={800}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditBrand(selectedBrand?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedBrand && (
            <Container className="space-y-6">
              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                    {translations["Basic Information"]}
                  </h3>
                  <Container className="space-y-4">
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Name}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedBrand.Name || "N/A"}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Description}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedBrand.Description ||
                          translations["No Description"]}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Product}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {getProductName(selectedBrand.ProductId)}
                      </Span>
                    </Container>
                  </Container>
                </Container>

                <Container>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                    {translations["Brand Statistics"]}
                  </h3>
                  <Container className="space-y-4">
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Created At"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {formatDate(selectedBrand.CreatedAt)}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Product ID"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedBrand.ProductId || "N/A"}
                      </Span>
                    </Container>
                  </Container>
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
            <Span>{translations["Delete Brand"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteBrand}
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
              permanently delete the brand{" "}
              <strong>"{brandToDelete?.Name}"</strong> and all associated data.
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
                  onClick={() => {
                    setShowFilters(false);
                    getProductBrands({
                      page: 1,
                      search: searchTerm.trim(),
                      sortBy: filterOptions.sortBy,
                      sortAscending: filterOptions.sortAscending,
                    });
                  }}
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
                  onClick={() => {
                    setSearchTerm("");
                    setFilterOptions({
                      status: "",
                      sortBy: "name",
                      sortAscending: true,
                    });
                    setShowFilters(false);
                    getProductBrands();
                  }}
                />
              </Container>
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default ProductBrands;
