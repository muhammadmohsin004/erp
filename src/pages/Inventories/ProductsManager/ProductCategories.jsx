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
  Layers,
  ArrowLeft,
  TreePine,
  FolderOpen,
  Folder,
  AlertTriangle,
  Package,
  Search,
  List,
  Grid,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
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

const ProductCategories = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const translations = {
    "Product Categories":
      language === "ar" ? "فئات المنتجات" : "Product Categories",
    "Back to Products":
      language === "ar" ? "العودة للمنتجات" : "Back to Products",
    "Add Category": language === "ar" ? "إضافة فئة" : "Add Category",
    Categories: language === "ar" ? "الفئات" : "Categories",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No Categories": language === "ar" ? "لا يوجد فئات" : "No categories found",
    Name: language === "ar" ? "الاسم" : "Name",
    Description: language === "ar" ? "الوصف" : "Description",
    "Parent Category": language === "ar" ? "الفئة الأب" : "Parent Category",
    "Product Count": language === "ar" ? "عدد المنتجات" : "Product Count",
    Status: language === "ar" ? "الحالة" : "Status",
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
    "Delete Category": language === "ar" ? "حذف الفئة" : "Delete Category",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Category Details": language === "ar" ? "تفاصيل الفئة" : "Category Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "All Status": language === "ar" ? "جميع الحالات" : "All Status",
    "Root Category": language === "ar" ? "فئة جذر" : "Root Category",
    "Sub Category": language === "ar" ? "فئة فرعية" : "Sub Category",
    "Created At": language === "ar" ? "تاريخ الإنشاء" : "Created At",
    "Updated At": language === "ar" ? "تاريخ التحديث" : "Updated At",
    "Sort by": language === "ar" ? "ترتيب حسب" : "Sort by",
    "Sort Ascending": language === "ar" ? "ترتيب تصاعدي" : "Sort Ascending",
    "Date Created": language === "ar" ? "تاريخ الإنشاء" : "Date Created",
    "Tree View": language === "ar" ? "عرض شجري" : "Tree View",
    "List View": language === "ar" ? "عرض قائمة" : "List View",
    "Category Tree": language === "ar" ? "شجرة الفئات" : "Category Tree",
    "Category Management":
      language === "ar" ? "إدارة الفئات" : "Category Management",
    Hierarchy: language === "ar" ? "التسلسل الهرمي" : "Hierarchy",
    "Top Level": language === "ar" ? "المستوى الأعلى" : "Top Level",
    "Sub Categories": language === "ar" ? "الفئات الفرعية" : "Sub Categories",
    "No Description": language === "ar" ? "بدون وصف" : "No Description",
    "No Parent": language === "ar" ? "بدون فئة أب" : "No Parent",
    "Main Categories":
      language === "ar" ? "الفئات الرئيسية" : "Main Categories",
    "Sub-Categories": language === "ar" ? "الفئات الفرعية" : "Sub-Categories",
    "Empty Categories": language === "ar" ? "فئات فارغة" : "Empty Categories",
    "Categories with Products":
      language === "ar" ? "فئات تحتوي على منتجات" : "Categories with Products",
    "Recently Added": language === "ar" ? "مضاف حديثاً" : "Recently Added",
    Retry: language === "ar" ? "إعادة المحاولة" : "Retry",
    "Basic Information":
      language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Category Structure":
      language === "ar" ? "هيكل الفئة" : "Category Structure",
    Statistics: language === "ar" ? "الإحصائيات" : "Statistics",
    "Cannot delete category with products":
      language === "ar"
        ? "لا يمكن حذف فئة تحتوي على منتجات"
        : "Cannot delete category with products",
    "Cannot delete category with sub-categories":
      language === "ar"
        ? "لا يمكن حذف فئة تحتوي على فئات فرعية"
        : "Cannot delete category with sub-categories",
    Level: language === "ar" ? "المستوى" : "Level",
    Expand: language === "ar" ? "توسيع" : "Expand",
    Collapse: language === "ar" ? "طي" : "Collapse",
    "Expand All": language === "ar" ? "توسيع الكل" : "Expand All",
    "Collapse All": language === "ar" ? "طي الكل" : "Collapse All",
    "Show Empty": language === "ar" ? "عرض الفارغة" : "Show Empty",
    "Hide Empty": language === "ar" ? "إخفاء الفارغة" : "Hide Empty",
    products: language === "ar" ? "منتجات" : "products",
    subcategories: language === "ar" ? "فئات فرعية" : "subcategories",
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
    productCategories,
    categoriesTree,
    currentProductCategory,
    loading: categoriesLoading,
    error,
    pagination,
    getProductCategories,
    getProductCategory,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    getCategoriesTree,
    changePage,
    changePageSize,
    setFilters,
  } = useProductsManager();

  // Process categories data from API response
  const categoriesData = Array.isArray(productCategories?.Data?.$values)
    ? productCategories.Data.$values
    : [];
  const treeData = categoriesTree || [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "tree"
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    sortBy: "name",
    sortAscending: true,
    showEmpty: true,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategoryId: null,
    status: "Active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalCategories: 0,
    mainCategories: 0,
    subCategories: 0,
    emptyCategories: 0,
    categoriesWithProducts: 0,
    recentlyAdded: 0,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getProductCategories();
        await getCategoriesTree();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token]);

  // Update statistics when categories change
  // Replace the entire useEffect block with:
  useEffect(() => {
    if (Array.isArray(categoriesData) && categoriesData.length > 0) {
      const now = new Date();
      const stats = {
        totalCategories: categoriesData.length,
        mainCategories: categoriesData.filter((c) => !c.ParentCategoryId)
          .length,
        subCategories: categoriesData.filter((c) => c.ParentCategoryId).length,
        emptyCategories: categoriesData.filter(
          (c) => (c.ProductCount || 0) === 0
        ).length,
        categoriesWithProducts: categoriesData.filter(
          (c) => (c.ProductCount || 0) > 0
        ).length,
        recentlyAdded: categoriesData.filter((c) => {
          const createdDate = new Date(c.CreatedAt);
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
      };
      setStatistics(stats);
    } else {
      // Reset statistics if no valid data
      setStatistics({
        totalCategories: 0,
        mainCategories: 0,
        subCategories: 0,
        emptyCategories: 0,
        categoriesWithProducts: 0,
        recentlyAdded: 0,
      });
    }
  }, [categoriesData]);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchCategories();
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
  const handleSearchCategories = async () => {
    try {
      await getProductCategories({
        page: 1,
        search: searchTerm.trim(),
        status: filterOptions.status,
        sortBy: filterOptions.sortBy,
        sortAscending: filterOptions.sortAscending,
      });
    } catch (error) {
      console.error("Error searching categories:", error);
    }
  };

  // Category selection
  const handleCategorySelection = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCategories([]);
    } else {
      const categoryIds = Array.isArray(categoriesData)
        ? categoriesData.map((category) => category.Id)
        : [];
      setSelectedCategories(categoryIds);
    }
    setSelectAll(!selectAll);
  };

  // Category actions
  const handleViewCategory = async (categoryId) => {
    try {
      const categoryData = await getProductCategory(categoryId);
      if (categoryData) {
        setSelectedCategory(categoryData);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
      alert("Failed to fetch category details");
    }
  };

  const handleAddCategory = () => {
    setFormData({
      name: "",
      description: "",
      parentCategoryId: null,
      status: "Active",
    });
    setIsEditing(false);
    setShowAddModal(true);
  };

  const handleEditCategory = async (categoryId) => {
    try {
      const categoryData = await getProductCategory(categoryId);
      if (categoryData) {
        setFormData({
          name: categoryData.Name || "",
          description: categoryData.Description || "",
          parentCategoryId: categoryData.ParentCategoryId || null,
          status: categoryData.Status || "Active",
        });
        setSelectedCategory(categoryData);
        setIsEditing(true);
        setShowAddModal(true);
      }
    } catch (error) {
      console.error("Error fetching category for edit:", error);
      alert("Failed to fetch category details for editing");
    }
  };

  const handleCloneCategory = async (categoryId) => {
    try {
      const categoryData = await getProductCategory(categoryId);
      if (categoryData) {
        setFormData({
          name: `${categoryData.Name || ""} (Copy)`,
          description: categoryData.Description || "",
          parentCategoryId: categoryData.ParentCategoryId || null,
          status: categoryData.Status || "Active",
        });
        setIsEditing(false);
        setShowAddModal(true);
      }
    } catch (error) {
      console.error("Error cloning category:", error);
      alert("Failed to clone category");
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const category = Array.isArray(categoriesData)
      ? categoriesData.find((c) => c.Id === categoryId)
      : null;
    if (category) {
      setCategoryToDelete(category);
      setShowDeleteModal(true);
    } else {
      alert("Category not found");
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProductCategory(categoryToDelete.Id);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      await getProductCategories();
      await getCategoriesTree();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  // Form submission
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryData = {
        Name: formData.name.trim(),
        Description: formData.description.trim(),
        ParentCategoryId: formData.parentCategoryId || null,
        Status: formData.status,
      };

      if (isEditing) {
        await updateProductCategory(selectedCategory.Id, categoryData);
      } else {
        await createProductCategory(categoryData);
      }

      setShowAddModal(false);
      await getProductCategories();
      await getCategoriesTree();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tree view functions
  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const getAllIds = (nodes) => {
      const ids = [];
      nodes.forEach((node) => {
        ids.push(node.Id);
        if (node.Children && node.Children.length > 0) {
          ids.push(...getAllIds(node.Children));
        }
      });
      return ids;
    };
    setExpandedNodes(new Set(getAllIds(treeData)));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Utility functions
  const getParentCategoryName = (parentId) => {
    if (!parentId) return translations["No Parent"];
    const parent = categoriesData.find((c) => c.Id === parentId);
    return parent?.Name || translations["No Parent"];
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  // Statistics Card Component
  const StatCard = ({ title, value, icon: Icon, bgColor, iconColor }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <Container className="flex items-center justify-between">
        <Container>
          <Span className="text-gray-500 text-sm font-medium">{title}</Span>
          <Span className="text-2xl font-bold text-gray-900 mt-1 block">
            {value || 0}
          </Span>
        </Container>
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
      </Container>
    </Container>
  );

  // Tree Node Component
  const TreeNode = ({ node, level = 0 }) => {
    const isExpanded = expandedNodes.has(node.Id);
    const hasChildren = node.Children && node.Children.length > 0;

    return (
      <Container className="select-none">
        <Container
          className={`flex items-center gap-2 p-3 hover:bg-gray-50 border-b border-gray-100 ${
            level > 0 ? "border-l-2 border-blue-200" : ""
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.Id)}
              className="flex items-center justify-center w-5 h-5 rounded hover:bg-gray-200"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <Container className="w-5 h-5" />
          )}

          <Container className="flex items-center gap-2">
            {hasChildren ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-gray-500" />
            )}
            <Span className="text-sm font-medium text-gray-900">
              {node.Name}
            </Span>
          </Container>

          <Container className="flex items-center gap-2 ml-auto">
            <Span className="text-xs text-gray-500">
              {node.ProductCount || 0} {translations.products}
            </Span>
            {hasChildren && (
              <Span className="text-xs text-blue-500">
                {node.Children.length} {translations.subcategories}
              </Span>
            )}

            <Container className="flex gap-1">
              <button
                onClick={() => handleViewCategory(node.Id)}
                className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                title={translations.View}
              >
                <AiOutlineEye className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleEditCategory(node.Id)}
                className="inline-flex items-center justify-center w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                title={translations.Edit}
              >
                <AiOutlineEdit className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDeleteCategory(node.Id)}
                className="inline-flex items-center justify-center w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                title={translations.Delete}
              >
                <AiOutlineDelete className="w-3 h-3" />
              </button>
            </Container>
          </Container>
        </Container>

        {hasChildren && isExpanded && (
          <Container>
            {node.Children.map((child) => (
              <TreeNode key={child.Id} node={child} level={level + 1} />
            ))}
          </Container>
        )}
      </Container>
    );
  };

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
              <Layers className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {translations["Product Categories"]}
              </h1>
            </Container>
            {selectedCategories.length > 0 && (
              <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedCategories.length} {translations.Selected}
              </Span>
            )}
          </Container>

          <Container className="flex gap-3 flex-wrap">
            {/* View Mode Toggle */}
            <Container className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
                {translations["List View"]}
              </button>
              <button
                onClick={() => setViewMode("tree")}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "tree"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <TreePine className="w-4 h-4" />
                {translations["Tree View"]}
              </button>
            </Container>

            {/* Tree View Controls */}
            {viewMode === "tree" && (
              <>
                <FilledButton
                  isIcon={true}
                  icon={ChevronDown}
                  iconSize="w-4 h-4"
                  bgColor="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  rounded="rounded-lg"
                  buttonText={translations["Expand All"]}
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={expandAll}
                />
                <FilledButton
                  isIcon={true}
                  icon={ChevronRightIcon}
                  iconSize="w-4 h-4"
                  bgColor="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  rounded="rounded-lg"
                  buttonText={translations["Collapse All"]}
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={collapseAll}
                />
              </>
            )}

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
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Export}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => console.log("Export categories")}
            />

            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Category"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleAddCategory}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Categories}`}
            value={statistics?.totalCategories || 0}
            icon={Layers}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations["Main Categories"]}
            value={statistics?.mainCategories || 0}
            icon={FolderOpen}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations["Sub-Categories"]}
            value={statistics?.subCategories || 0}
            icon={Folder}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatCard
            title={translations["Categories with Products"]}
            value={statistics?.categoriesWithProducts || 0}
            icon={Package}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            title={translations["Empty Categories"]}
            value={statistics?.emptyCategories || 0}
            icon={AlertTriangle}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            title={translations["Recently Added"]}
            value={statistics?.recentlyAdded || 0}
            icon={Plus}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
          />
        </Container>

        {/* Search Bar */}
        {viewMode === "list" && (
          <Container className="mb-6">
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
              <SearchAndFilters
                isFocused={isFocused}
                searchValue={searchTerm}
                setSearchValue={setSearchTerm}
                placeholder={`${
                  translations.Search
                } ${translations.Categories.toLowerCase()}...`}
              />
            </Container>
          </Container>
        )}

        {/* Categories Content */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {categoriesLoading ? (
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
                onClick={() => getProductCategories()}
              />
            </Container>
          ) : viewMode === "tree" ? (
            // Tree View
            <Container>
              <Container className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-blue-600" />
                  {translations["Category Tree"]}
                </h3>
              </Container>
              {treeData.length === 0 ? (
                <Container className="text-center py-12">
                  <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {translations["No Categories"]}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by adding your first category
                  </p>
                  <FilledButton
                    isIcon={true}
                    icon={Plus}
                    iconSize="w-4 h-4"
                    bgColor="bg-blue-600 hover:bg-blue-700"
                    textColor="text-white"
                    rounded="rounded-lg"
                    buttonText={translations["Add Category"]}
                    height="h-10"
                    px="px-4"
                    fontWeight="font-medium"
                    fontSize="text-sm"
                    isIconLeft={true}
                    onClick={handleAddCategory}
                  />
                </Container>
              ) : (
                <Container className="max-h-96 overflow-y-auto">
                  {treeData.map((node) => (
                    <TreeNode key={node.Id} node={node} />
                  ))}
                </Container>
              )}
            </Container>
          ) : (
            // List View
            <>
              {!Array.isArray(categoriesData) || categoriesData.length === 0 ? (
                <Container className="text-center py-12">
                  <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || filterOptions.status
                      ? translations["No results found"]
                      : translations["No Categories"]}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || filterOptions.status
                      ? "Try adjusting your filters or search terms"
                      : "Get started by adding your first category"}
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
                            showEmpty: true,
                          });
                          getProductCategories();
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
                      buttonText={translations["Add Category"]}
                      height="h-10"
                      px="px-4"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      isIconLeft={true}
                      onClick={handleAddCategory}
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
                            {translations["Parent Category"]}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            {translations["Product Count"]}
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
                        {categoriesData.map((category) => (
                          <tr
                            key={category.Id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(
                                  category.Id
                                )}
                                onChange={() =>
                                  handleCategorySelection(category.Id)
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <Container className="flex items-center gap-3">
                                <Container className="flex-shrink-0">
                                  {category.ParentCategoryId ? (
                                    <Folder className="w-5 h-5 text-gray-500" />
                                  ) : (
                                    <FolderOpen className="w-5 h-5 text-blue-500" />
                                  )}
                                </Container>
                                <Container>
                                  <Span className="text-sm font-medium text-gray-900">
                                    {category.Name || "N/A"}
                                  </Span>
                                  {category.Description && (
                                    <Span className="text-sm text-gray-500 block truncate max-w-xs">
                                      {category.Description}
                                    </Span>
                                  )}
                                </Container>
                              </Container>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <Span className="text-sm text-gray-900">
                                {getParentCategoryName(
                                  category.ParentCategoryId
                                )}
                              </Span>
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell">
                              <Container className="flex items-center gap-1">
                                <Package className="w-3 h-3 text-gray-400" />
                                <Span className="text-sm text-gray-900">
                                  {category.ProductCount || 0}
                                </Span>
                              </Container>
                            </td>
                            <td className="px-6 py-4">
                              <Span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  category.Status
                                )}`}
                              >
                                {translations[category.Status] ||
                                  category.Status}
                              </Span>
                            </td>
                            <td className="px-6 py-4">
                              <Container className="flex justify-center gap-1">
                                <button
                                  onClick={() =>
                                    handleViewCategory(category.Id)
                                  }
                                  className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                  title={translations.View}
                                >
                                  <AiOutlineEye className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleEditCategory(category.Id)
                                  }
                                  className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                  title={translations.Edit}
                                >
                                  <AiOutlineEdit className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleCloneCategory(category.Id)
                                  }
                                  className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                                  title={translations.Clone}
                                >
                                  <AiOutlineCopy className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteCategory(category.Id)
                                  }
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
                            {(pagination.PageNumber - 1) * pagination.PageSize +
                              1}{" "}
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
                            onClick={() =>
                              changePage(pagination.PageNumber - 1)
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
                              changePage(pagination.PageNumber + 1)
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
                            onClick={() => changePage(pagination.TotalPages)}
                            title={translations.Last}
                          />
                        </Container>
                      </Container>
                    )}
                </>
              )}
            </>
          )}
        </Container>
      </Container>

      {/* Add/Edit Category Modal */}
      <Modall
        modalOpen={showAddModal}
        setModalOpen={setShowAddModal}
        title={
          <Container className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <Span>
              {isEditing ? translations.Edit : translations["Add Category"]}
            </Span>
          </Container>
        }
        width={600}
        okText={isEditing ? translations.Edit : translations["Add Category"]}
        cancelText={translations.Cancel}
        okAction={handleSubmitCategory}
        cancelAction={() => setShowAddModal(false)}
        okButtonDisabled={isSubmitting}
        body={
          <form onSubmit={handleSubmitCategory} className="space-y-4">
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
                {translations.Description}
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
                {translations["Parent Category"]}
              </label>
              <select
                value={formData.parentCategoryId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentCategoryId: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{translations["No Parent"]}</option>
                {Array.isArray(categoriesData)
                  ? categoriesData
                      .filter((c) =>
                        isEditing ? c.Id !== selectedCategory?.Id : true
                      )
                      .map((category) => (
                        <option key={category.Id} value={category.Id}>
                          {category.Name}
                        </option>
                      ))
                  : null}
              </select>
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Status}
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Active">{translations.Active}</option>
                <option value="Inactive">{translations.Inactive}</option>
              </select>
            </Container>
          </form>
        }
      />

      {/* View Category Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Category Details"]}</Span>
          </Container>
        }
        width={800}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditCategory(selectedCategory?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedCategory && (
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
                        {selectedCategory.Name || "N/A"}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Description}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedCategory.Description ||
                          translations["No Description"]}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Parent Category"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {getParentCategoryName(
                          selectedCategory.ParentCategoryId
                        )}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Status}
                      </Span>
                      <Span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
                          selectedCategory.Status
                        )}`}
                      >
                        {translations[selectedCategory.Status] ||
                          selectedCategory.Status}
                      </Span>
                    </Container>
                  </Container>
                </Container>

                <Container>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                    {translations.Statistics}
                  </h3>
                  <Container className="space-y-4">
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Product Count"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedCategory.ProductCount || 0}{" "}
                        {translations.products}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Created At"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedCategory.CreatedAt
                          ? new Date(
                              selectedCategory.CreatedAt
                            ).toLocaleDateString()
                          : "N/A"}
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
            <Span>{translations["Delete Category"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteCategory}
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
              permanently delete the category{" "}
              <strong>"{categoryToDelete?.Name}"</strong> and all associated
              data.
            </Span>
            {categoryToDelete?.ProductCount > 0 && (
              <Container className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <Container className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <Span className="text-sm text-yellow-800">
                    {translations["Cannot delete category with products"]}
                  </Span>
                </Container>
              </Container>
            )}
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
                      checked={filterOptions.showEmpty}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          showEmpty: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Span className="ml-2 text-sm text-gray-700">
                      {translations["Show Empty"]}
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
                    getProductCategories({
                      page: 1,
                      search: searchTerm.trim(),
                      status: filterOptions.status,
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
                      showEmpty: true,
                    });
                    setShowFilters(false);
                    getProductCategories();
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

export default ProductCategories;
