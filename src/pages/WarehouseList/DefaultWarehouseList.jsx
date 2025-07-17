import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  MapPin,
  Building,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  X,
  Warehouse,
  Package,
  Calendar,
  Users,
  ToggleLeft,
  ToggleRight,
  Star,
  CheckCircle,
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
import { useWarehouse } from "../../Contexts/WarehouseContext/WarehouseContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../components/elements/modal/Modal";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../components/elements/table/Table";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const DefaultWarehouseList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Add Warehouse": language === "ar" ? "إضافة مستودع" : "Add Warehouse",
    "Default Warehouses":
      language === "ar" ? "المستودعات الافتراضية" : "Default Warehouses",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    NoWarehouses:
      language === "ar"
        ? "لا يوجد مستودعات افتراضية"
        : "No default warehouses found",
    Name: language === "ar" ? "الاسم" : "Name",
    Code: language === "ar" ? "الكود" : "Code",
    Manager: language === "ar" ? "المدير" : "Manager",
    Phone: language === "ar" ? "الهاتف" : "Phone",
    Address: language === "ar" ? "العنوان" : "Address",
    Status: language === "ar" ? "الحالة" : "Status",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    Active: language === "ar" ? "نشط" : "Active",
    Inactive: language === "ar" ? "غير نشط" : "Inactive",
    Primary: language === "ar" ? "أساسي" : "Primary",
    Default: language === "ar" ? "افتراضي" : "Default",
    Total: language === "ar" ? "المجموع" : "Total",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    Toggle: language === "ar" ? "تبديل الحالة" : "Toggle Status",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Warehouse": language === "ar" ? "حذف المستودع" : "Delete Warehouse",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Warehouse Details":
      language === "ar" ? "تفاصيل المستودع" : "Warehouse Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    Description: language === "ar" ? "الوصف" : "Description",
    Email: language === "ar" ? "البريد الإلكتروني" : "Email",
    "Shipping Address": language === "ar" ? "عنوان الشحن" : "Shipping Address",
    City: language === "ar" ? "المدينة" : "City",
    Country: language === "ar" ? "البلد" : "Country",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "All Status": language === "ar" ? "جميع الحالات" : "All Status",
    Permissions: language === "ar" ? "الصلاحيات" : "Permissions",
    "View Permission": language === "ar" ? "صلاحية العرض" : "View Permission",
    "Create Invoice Permission":
      language === "ar" ? "صلاحية إنشاء الفاتورة" : "Create Invoice Permission",
    "Update Stock Permission":
      language === "ar" ? "صلاحية تحديث المخزون" : "Update Stock Permission",
    "Set as Default": language === "ar" ? "تعيين كافتراضي" : "Set as Default",
    "Remove Default": language === "ar" ? "إزالة الافتراضي" : "Remove Default",
    "Export Success": language === "ar" ? "تم التصدير بنجاح" : "Export Success",
    "Export Failed": language === "ar" ? "فشل التصدير" : "Export Failed",
  };

  // Get warehouse context
  const {
    warehouses,
    loading: warehousesLoading,
    error,
    pagination,
    filters,
    statistics,
    getWarehouses,
    getWarehouse,
    deleteWarehouse,
    toggleWarehouseStatus,
    updateWarehouse,
    searchWarehouses,
    filterWarehousesByStatus,
    sortWarehouses,
    changePage,
    changePageSize,
    clearError,
    setFilters,
  } = useWarehouse();

  // Filter only default warehouses from the main warehouses list
  const defaultWarehouses = React.useMemo(() => {
    let warehousesList = [];

    if (Array.isArray(warehouses)) {
      warehousesList = warehouses;
    } else if (
      warehouses &&
      warehouses.Data &&
      Array.isArray(warehouses.Data.$values)
    ) {
      warehousesList = warehouses.Data.$values;
    } else if (warehouses && Array.isArray(warehouses.Data)) {
      warehousesList = warehouses.Data;
    }

    return warehousesList.filter((warehouse) => warehouse.IsDefault === true);
  }, [warehouses]);

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    sortBy: "CreatedAt",
    sortAscending: false,
    managerName: "",
    city: "",
    country: "",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(null);
  const [isTogglingDefault, setIsTogglingDefault] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Calculate statistics for default warehouses only
  const [defaultStatistics, setDefaultStatistics] = useState({
    totalWarehouses: 0,
    activeWarehouses: 0,
    primaryWarehouses: 0,
    warehousesThisMonth: 0,
  });

  // Fetch warehouses on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getWarehouses();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token, getWarehouses]);

  // Update statistics when default warehouses change
  useEffect(() => {
    if (Array.isArray(defaultWarehouses) && defaultWarehouses.length >= 0) {
      const stats = {
        totalWarehouses: defaultWarehouses.length,
        activeWarehouses: defaultWarehouses.filter((w) => w.Status === "Active")
          .length,
        primaryWarehouses: defaultWarehouses.filter(
          (w) => w.Primary === "1" || w.Primary === "Yes"
        ).length,
        warehousesThisMonth: defaultWarehouses.filter((w) => {
          const createdDate = new Date(w.CreatedAt);
          const now = new Date();
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
      };
      setDefaultStatistics(stats);
    }
  }, [defaultWarehouses]);

  // Enhanced filter and search default warehouses locally
  const filteredDefaultWarehouses = React.useMemo(() => {
    let filtered = [...defaultWarehouses];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          (w.Name && w.Name.toLowerCase().includes(search)) ||
          (w.Code && w.Code.toLowerCase().includes(search)) ||
          (w.Address && w.Address.toLowerCase().includes(search)) ||
          (w.ManagerName && w.ManagerName.toLowerCase().includes(search)) ||
          (w.Email && w.Email.toLowerCase().includes(search)) ||
          (w.Phone && w.Phone.toLowerCase().includes(search))
      );
    }

    // Apply status filter
    if (filterOptions.status && filterOptions.status !== "All") {
      filtered = filtered.filter((w) => w.Status === filterOptions.status);
    }

    // Apply manager name filter
    if (filterOptions.managerName) {
      const managerSearch = filterOptions.managerName.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.ManagerName && w.ManagerName.toLowerCase().includes(managerSearch)
      );
    }

    // Apply city filter
    if (filterOptions.city) {
      const citySearch = filterOptions.city.toLowerCase();
      filtered = filtered.filter(
        (w) => w.City && w.City.toLowerCase().includes(citySearch)
      );
    }

    // Apply country filter
    if (filterOptions.country) {
      const countrySearch = filterOptions.country.toLowerCase();
      filtered = filtered.filter(
        (w) => w.Country && w.Country.toLowerCase().includes(countrySearch)
      );
    }

    // Apply date range filter
    if (filterOptions.dateFrom) {
      const fromDate = new Date(filterOptions.dateFrom);
      filtered = filtered.filter((w) => {
        const createdDate = new Date(w.CreatedAt);
        return createdDate >= fromDate;
      });
    }

    if (filterOptions.dateTo) {
      const toDate = new Date(filterOptions.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((w) => {
        const createdDate = new Date(w.CreatedAt);
        return createdDate <= toDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filterOptions.sortBy.toLowerCase()) {
        case "name":
          aValue = a.Name || "";
          bValue = b.Name || "";
          break;
        case "code":
          aValue = a.Code || "";
          bValue = b.Code || "";
          break;
        case "status":
          aValue = a.Status || "";
          bValue = b.Status || "";
          break;
        case "managername":
          aValue = a.ManagerName || "";
          bValue = b.ManagerName || "";
          break;
        case "city":
          aValue = a.City || "";
          bValue = b.City || "";
          break;
        case "country":
          aValue = a.Country || "";
          bValue = b.Country || "";
          break;
        default:
          aValue = new Date(a.CreatedAt || 0);
          bValue = new Date(b.CreatedAt || 0);
      }

      if (typeof aValue === "string") {
        return filterOptions.sortAscending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return filterOptions.sortAscending ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [defaultWarehouses, searchTerm, filterOptions]);

  // Handle search when searchTerm changes (with debounce)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      // Search is handled locally, no API call needed
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Handle filters change
  useEffect(() => {
    setSelectedWarehouses([]);
    setSelectAll(false);
  }, [filteredDefaultWarehouses]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // CSV Export functionality
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    const headers = [
      "Name",
      "Code",
      "Status",
      "Manager Name",
      "Email",
      "Phone",
      "Address",
      "City",
      "State",
      "Country",
      "Postal Code",
      "Shipping Address",
      "Description",
      "Primary",
      "Default",
      "View Permission",
      "Create Invoice Permission",
      "Update Stock Permission",
      "Created At",
      "Updated At",
    ];

    const csvData = data.map((warehouse) => [
      warehouse.Name || "",
      warehouse.Code || "",
      warehouse.Status || "",
      warehouse.ManagerName || "",
      warehouse.Email || "",
      warehouse.Phone || "",
      warehouse.Address || "",
      warehouse.City || "",
      warehouse.State || "",
      warehouse.Country || "",
      warehouse.PostalCode || "",
      warehouse.ShippingAddress || "",
      warehouse.Description || "",
      warehouse.Primary === "1" || warehouse.Primary === "Yes" ? "Yes" : "No",
      warehouse.IsDefault ? "Yes" : "No",
      warehouse.ViewPermission === "1" ? "Yes" : "No",
      warehouse.CreateInvoicePermission === "1" ? "Yes" : "No",
      warehouse.UpdateStockPermission === "1" ? "Yes" : "No",
      warehouse.CreatedAt
        ? new Date(warehouse.CreatedAt).toLocaleDateString()
        : "",
      warehouse.UpdatedAt
        ? new Date(warehouse.UpdatedAt).toLocaleDateString()
        : "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

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
  };

  // Warehouse selection
  const handleWarehouseSelection = (warehouseId) => {
    setSelectedWarehouses((prev) => {
      if (prev.includes(warehouseId)) {
        return prev.filter((id) => id !== warehouseId);
      } else {
        return [...prev, warehouseId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedWarehouses([]);
    } else {
      const warehouseIds = filteredDefaultWarehouses.map(
        (warehouse) => warehouse.Id
      );
      setSelectedWarehouses(warehouseIds);
    }
    setSelectAll(!selectAll);
  };

  // Warehouse actions
  const handleViewWarehouse = async (warehouseId) => {
    try {
      const warehouseData = await getWarehouse(warehouseId);
      if (warehouseData) {
        setSelectedWarehouse(warehouseData);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching warehouse details:", error);
      alert("Failed to fetch warehouse details");
    }
  };

  const handleEditWarehouse = async (warehouseId) => {
    try {
      const warehouseData = await getWarehouse(warehouseId);
      if (warehouseData) {
        navigate("/admin/new-warehouse", {
          state: {
            editData: warehouseData,
            isEditing: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching warehouse for edit:", error);
      alert("Failed to fetch warehouse details for editing");
    }
  };

  const handleCloneWarehouse = async (warehouseId) => {
    try {
      const warehouseData = await getWarehouse(warehouseId);
      if (warehouseData) {
        navigate("/admin/new-warehouse", {
          state: {
            cloneData: {
              ...warehouseData,
              Name: `${warehouseData.Name || ""} (Copy)`,
              Code: "",
              Primary: "0",
              IsDefault: false,
              Id: undefined,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error cloning warehouse:", error);
      alert("Failed to clone warehouse");
    }
  };

  const handleDeleteWarehouse = (warehouseId) => {
    const warehouse = filteredDefaultWarehouses.find(
      (w) => w.Id === warehouseId
    );
    if (warehouse) {
      setWarehouseToDelete(warehouse);
      setShowDeleteModal(true);
    } else {
      alert("Warehouse not found");
    }
  };

  const handleToggleStatus = async (warehouseId) => {
    setIsTogglingStatus(warehouseId);
    try {
      await toggleWarehouseStatus(warehouseId);
    } catch (error) {
      console.error("Error toggling warehouse status:", error);
      alert("Failed to toggle warehouse status");
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const handleToggleDefault = async (warehouseId) => {
    setIsTogglingDefault(warehouseId);
    try {
      const warehouse = filteredDefaultWarehouses.find(
        (w) => w.Id === warehouseId
      );
      if (warehouse) {
        await updateWarehouse(warehouseId, {
          ...warehouse,
          IsDefault: !warehouse.IsDefault,
        });
        await getWarehouses();
      }
    } catch (error) {
      console.error("Error toggling default status:", error);
      alert("Failed to toggle default status");
    } finally {
      setIsTogglingDefault(null);
    }
  };

  const confirmDeleteWarehouse = async () => {
    if (!warehouseToDelete) return;

    setIsDeleting(true);
    try {
      await deleteWarehouse(warehouseToDelete.Id);
      setShowDeleteModal(false);
      setWarehouseToDelete(null);
      await getWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      alert("Failed to delete warehouse");
    } finally {
      setIsDeleting(false);
    }
  };

  // Enhanced filter functions
  const handleApplyFilters = () => {
    setShowFilters(false);
    // Filters are applied automatically through the filteredDefaultWarehouses useMemo
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterOptions({
      status: "",
      sortBy: "CreatedAt",
      sortAscending: false,
      managerName: "",
      city: "",
      country: "",
      dateFrom: "",
      dateTo: "",
    });
    setShowFilters(false);
  };

  // Enhanced export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      let dataToExport = [];

      if (selectedWarehouses.length > 0) {
        // Export selected warehouses
        dataToExport = filteredDefaultWarehouses.filter((warehouse) =>
          selectedWarehouses.includes(warehouse.Id)
        );
      } else {
        // Export all filtered warehouses
        dataToExport = filteredDefaultWarehouses;
      }

      if (dataToExport.length === 0) {
        alert("No data to export");
        return;
      }

      const csvContent = convertToCSV(dataToExport);
      const filename = `default-warehouses-${new Date().toISOString().split("T")[0]
        }.csv`;

      downloadCSV(csvContent, filename);

      // Show success message
      alert(
        `${translations["Export Success"]} - ${dataToExport.length} warehouses exported`
      );
    } catch (error) {
      console.error("Error exporting data:", error);
      alert(translations["Export Failed"]);
    } finally {
      setIsExporting(false);
    }
  };

  // Statistics Card Component
  const StatCard = ({ title, value, icon: Icon, bgColor, iconColor }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">Loading...</Span>
      </Container>
    );
  }
  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {translations["Default Warehouses"]}
            </h1>
            {selectedWarehouses.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedWarehouses.length} {translations.Selected}
              </span>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            <FilledButton
              isIcon={true}
              icon={Filter}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"

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
              icon={
                isExporting
                  ? () => (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )
                  : Download
              }
              iconSize="w-4 h-4"
              bgColor={
                isExporting ? "bg-gray-400" : "bg-gray-100 hover:bg-gray-200"
              }

              rounded="rounded-lg"
              buttonText={isExporting ? "Exporting..." : translations.Export}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              disabled={isExporting}
              onClick={handleExport}
            />

            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Warehouse"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/new-warehouse")}
            />
          </div>
        </div>


        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Default}`}
            value={defaultStatistics?.totalWarehouses || 0}
            icon={Star}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatCard
            title={translations.Active}
            value={defaultStatistics?.activeWarehouses || 0}
            icon={CheckCircle}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations.Primary}
            value={defaultStatistics?.primaryWarehouses || 0}
            icon={Building}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            title={translations["This Month"]}
            value={defaultStatistics?.warehousesThisMonth || 0}
            icon={Calendar}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
        </Container>

        {/* Search Bar */}
        <Container className="mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
            <SearchAndFilters
              isFocused={isFocused}
              searchValue={searchTerm}
              setSearchValue={setSearchTerm}
            />
          </Container>
        </Container>

        {/* Default Warehouse Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {warehousesLoading ? (
            <Container className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <Span className="text-blue-500 text-lg block mt-4">
                {translations.Loading}
              </Span>
            </Container>
          ) : error ? (
            <Container className="text-center py-12">
              <Span className="text-red-500 text-lg block mb-4">
                Error: {error}
              </Span>
              <FilledButton
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText="Retry"
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => getWarehouses()}
              />
            </Container>
          ) : filteredDefaultWarehouses.length === 0 ? (
            <Container className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterOptions.status
                  ? translations["No results found"]
                  : translations.NoWarehouses}
              </h3>
              {(searchTerm || filterOptions.status) && (
                <FilledButton
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={`${translations["Clear All"]} ${translations.Filters}`}
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={handleClearFilters}
                />
              )}
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
                        {translations.Code}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations.Manager}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations.Address}
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
                    {filteredDefaultWarehouses.map((warehouse) => (
                      <tr key={warehouse.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedWarehouses.includes(warehouse.Id)}
                            onChange={() =>
                              handleWarehouseSelection(warehouse.Id)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Container>
                            <Container className="flex items-center gap-2">
                              <Span className="text-sm font-medium text-gray-900">
                                {warehouse.Name || "N/A"}
                              </Span>
                              <Span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                {translations.Default}
                              </Span>
                              {(warehouse.Primary === "1" ||
                                warehouse.Primary === "Yes") && (
                                  <Span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                    {translations.Primary}
                                  </Span>
                                )}
                            </Container>
                            {warehouse.Description && (
                              <Span className="text-sm text-gray-500 block">
                                {warehouse.Description}
                              </Span>
                            )}
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Span className="text-sm text-gray-900">
                            {warehouse.Code || "-"}
                          </Span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <Container>
                            {warehouse.ManagerName ? (
                              <Container>
                                <Span className="text-sm text-gray-900 block">
                                  {warehouse.ManagerName}
                                </Span>
                                {warehouse.Phone && (
                                  <a
                                    href={`tel:${warehouse.Phone}`}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    {warehouse.Phone}
                                  </a>
                                )}
                                {warehouse.Email && (
                                  <a
                                    href={`mailto:${warehouse.Email}`}
                                    className="text-xs text-blue-600 hover:text-blue-800 block"
                                  >
                                    {warehouse.Email}
                                  </a>
                                )}
                              </Container>
                            ) : (
                              <Span className="text-sm text-gray-500">-</Span>
                            )}
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          {warehouse.Address ||
                            warehouse.ShippingAddress ||
                            warehouse.City ? (
                            <Container className="flex items-start">
                              <MapPin className="w-4 h-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                              <Container className="text-sm text-gray-900">
                                {warehouse.Address && (
                                  <Span className="block">
                                    {warehouse.Address}
                                  </Span>
                                )}
                                {warehouse.ShippingAddress &&
                                  warehouse.ShippingAddress !==
                                  warehouse.Address && (
                                    <Span className="block text-gray-600">
                                      Ship: {warehouse.ShippingAddress}
                                    </Span>
                                  )}
                                <Span className="block">
                                  {[
                                    warehouse.City,
                                    warehouse.State,
                                    warehouse.PostalCode,
                                    warehouse.Country,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </Span>
                              </Container>
                            </Container>
                          ) : (
                            <Span className="text-sm text-gray-500">-</Span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${warehouse.Status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {translations[warehouse.Status] || warehouse.Status}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-1">
                            {/* View Button */}
                            <button
                              onClick={() => handleViewWarehouse(warehouse.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              title={translations.View}
                            >
                              <AiOutlineEye className="w-3 h-3" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditWarehouse(warehouse.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                              title={translations.Edit}
                            >
                              <AiOutlineEdit className="w-3 h-3" />
                            </button>

                            {/* Clone Button */}
                            <button
                              onClick={() => handleCloneWarehouse(warehouse.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                              title={translations.Clone}
                            >
                              <AiOutlineCopy className="w-3 h-3" />
                            </button>

                            {/* Toggle Default Button */}
                            <button
                              onClick={() => handleToggleDefault(warehouse.Id)}
                              disabled={isTogglingDefault === warehouse.Id}
                              className="inline-flex items-center justify-center w-7 h-7 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 disabled:opacity-50"
                              title={
                                warehouse.IsDefault
                                  ? translations["Remove Default"]
                                  : translations["Set as Default"]
                              }
                            >
                              {isTogglingDefault === warehouse.Id ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Star className="w-3 h-3" />
                              )}
                            </button>

                            {/* Toggle Status Button */}
                            <button
                              onClick={() => handleToggleStatus(warehouse.Id)}
                              disabled={isTogglingStatus === warehouse.Id}
                              className="inline-flex items-center justify-center w-7 h-7 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 disabled:opacity-50"
                              title={translations.Toggle}
                            >
                              {isTogglingStatus === warehouse.Id ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                              ) : warehouse.Status === "Active" ? (
                                <ToggleRight className="w-3 h-3" />
                              ) : (
                                <ToggleLeft className="w-3 h-3" />
                              )}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() =>
                                handleDeleteWarehouse(warehouse.Id)
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
            </>
          )}
        </Container>
      </Container>

      {/* View Warehouse Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Warehouse Details"]}</Span>
          </Container>
        }
        width={800}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditWarehouse(selectedWarehouse?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedWarehouse && (
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <Container className="space-y-4">
                <Container>
                  <Span className="text-sm font-medium text-gray-500">
                    {translations.Name}
                  </Span>
                  <Container className="flex items-center gap-2 mt-1">
                    <Span className="text-sm text-gray-900">
                      {selectedWarehouse.Name || "N/A"}
                    </Span>
                    <Span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      {translations.Default}
                    </Span>
                  </Container>
                </Container>

                <Container>
                  <Span className="text-sm font-medium text-gray-500">
                    {translations.Code}
                  </Span>
                  <Span className="text-sm text-gray-900 block mt-1">
                    {selectedWarehouse.Code || "N/A"}
                  </Span>
                </Container>

                <Container>
                  <Span className="text-sm font-medium text-gray-500">
                    {translations.Status}
                  </Span>
                  <Span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${selectedWarehouse.Status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {translations[selectedWarehouse.Status] ||
                      selectedWarehouse.Status}
                  </Span>
                </Container>

                {(selectedWarehouse.Primary === "1" ||
                  selectedWarehouse.Primary === "Yes") && (
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        Type
                      </Span>
                      <Span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 bg-purple-100 text-purple-800">
                        {translations.Primary}
                      </Span>
                    </Container>
                  )}

                {selectedWarehouse.Description && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Description}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedWarehouse.Description}
                    </Span>
                  </Container>
                )}

                {selectedWarehouse.ManagerName && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Manager}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedWarehouse.ManagerName}
                    </Span>
                  </Container>
                )}

                {selectedWarehouse.Email && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Email}
                    </Span>
                    <a
                      href={`mailto:${selectedWarehouse.Email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 block mt-1"
                    >
                      {selectedWarehouse.Email}
                    </a>
                  </Container>
                )}

                {selectedWarehouse.Phone && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Phone}
                    </Span>
                    <a
                      href={`tel:${selectedWarehouse.Phone}`}
                      className="text-sm text-blue-600 hover:text-blue-800 block mt-1"
                    >
                      {selectedWarehouse.Phone}
                    </a>
                  </Container>
                )}
              </Container>

              <Container className="space-y-4">
                {(selectedWarehouse.Address ||
                  selectedWarehouse.City ||
                  selectedWarehouse.Country) && (
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Address}
                      </Span>
                      <Container className="mt-1">
                        {selectedWarehouse.Address && (
                          <Span className="text-sm text-gray-900 block">
                            {selectedWarehouse.Address}
                          </Span>
                        )}
                        <Span className="text-sm text-gray-900 block">
                          {[
                            selectedWarehouse.City,
                            selectedWarehouse.State,
                            selectedWarehouse.PostalCode,
                            selectedWarehouse.Country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </Span>
                      </Container>
                    </Container>
                  )}

                {selectedWarehouse.ShippingAddress &&
                  selectedWarehouse.ShippingAddress !==
                  selectedWarehouse.Address && (
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Shipping Address"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedWarehouse.ShippingAddress}
                      </Span>
                    </Container>
                  )}

                <Container>
                  <Span className="text-sm font-medium text-gray-500 mb-2 block">
                    {translations.Permissions}
                  </Span>
                  <Container className="space-y-2">
                    <Container className="flex items-center justify-between">
                      <Span className="text-sm text-gray-600">
                        {translations["View Permission"]}
                      </Span>
                      <Span
                        className={`px-2 py-1 text-xs rounded-full ${selectedWarehouse.ViewPermission === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {selectedWarehouse.ViewPermission === "1"
                          ? "Yes"
                          : "No"}
                      </Span>
                    </Container>
                    <Container className="flex items-center justify-between">
                      <Span className="text-sm text-gray-600">
                        {translations["Create Invoice Permission"]}
                      </Span>
                      <Span
                        className={`px-2 py-1 text-xs rounded-full ${selectedWarehouse.CreateInvoicePermission === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {selectedWarehouse.CreateInvoicePermission === "1"
                          ? "Yes"
                          : "No"}
                      </Span>
                    </Container>
                    <Container className="flex items-center justify-between">
                      <Span className="text-sm text-gray-600">
                        {translations["Update Stock Permission"]}
                      </Span>
                      <Span
                        className={`px-2 py-1 text-xs rounded-full ${selectedWarehouse.UpdateStockPermission === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {selectedWarehouse.UpdateStockPermission === "1"
                          ? "Yes"
                          : "No"}
                      </Span>
                    </Container>
                  </Container>
                </Container>
              </Container>

              <Container className="md:col-span-2 pt-4 border-t border-gray-200">
                <Container className="text-xs text-gray-500 space-y-1">
                  <Container>
                    Created:{" "}
                    {selectedWarehouse.CreatedAt
                      ? new Date(
                        selectedWarehouse.CreatedAt
                      ).toLocaleDateString()
                      : "N/A"}
                  </Container>
                  {selectedWarehouse.UpdatedAt && (
                    <Container>
                      Updated:{" "}
                      {new Date(
                        selectedWarehouse.UpdatedAt
                      ).toLocaleDateString()}
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
            <Span>{translations["Delete Warehouse"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteWarehouse}
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
              permanently delete the default warehouse{" "}
              <strong>"{warehouseToDelete?.Name}"</strong> and all associated
              data.
            </Span>
          </Container>
        }
      />

      {/* Filters Sidebar/Offcanvas */}
      {showFilters && (
        <Container className="fixed inset-0 z-50 overflow-hidden">
          <Container
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowFilters(false)}
          />
          <Container className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <Container className="p-6">
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

              <Container className="space-y-4">
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
                    Sort By
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
                    <option value="CreatedAt">Date Created</option>
                    <option value="name">Name</option>
                    <option value="code">Code</option>
                    <option value="status">Status</option>
                    <option value="managername">Manager Name</option>
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
                      Sort Ascending
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

export default DefaultWarehouseList;
