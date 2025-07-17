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
  FileText,
} from "lucide-react";
import {
  AiOutlineEye, // Eye icon for view
  AiOutlineEdit, // Edit icon for edit
  AiOutlineCopy, // Copy icon for clone
  AiOutlineDelete, // Delete icon for delete
  AiOutlinePlus, // Plus icon for add
  AiOutlineFilter, // Filter icon
  AiOutlineDownload, // Download icon for export
} from "react-icons/ai";
import { useWarehouse } from "../../Contexts/WarehouseContext/WarehouseContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../components/elements/modal/Modal";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../components/elements/table/Table";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const WarehouseList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Add Warehouse": language === "ar" ? "إضافة مستودع" : "Add Warehouse",
    Warehouses: language === "ar" ? "المستودعات" : "Warehouses",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    "Export CSV": language === "ar" ? "تصدير CSV" : "Export CSV",
    "Export All": language === "ar" ? "تصدير الكل" : "Export All",
    "Export Selected": language === "ar" ? "تصدير المحدد" : "Export Selected",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "Exporting": language === "ar" ? "جاري التصدير..." : "Exporting...",
    NoWarehouses: language === "ar" ? "لا يوجد مستودعات" : "No warehouses found",
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
    "Create Invoice Permission": language === "ar" ? "صلاحية إنشاء الفاتورة" : "Create Invoice Permission",
    "Update Stock Permission": language === "ar" ? "صلاحية تحديث المخزون" : "Update Stock Permission",
    "Export successful": language === "ar" ? "تم التصدير بنجاح" : "Export successful",
    "Export failed": language === "ar" ? "فشل التصدير" : "Export failed",
    "No data to export": language === "ar" ? "لا توجد بيانات للتصدير" : "No data to export",
    "Select warehouses to export": language === "ar" ? "اختر المستودعات للتصدير" : "Select warehouses to export",
  };

  // Get warehouse context
  const {
    warehouses,
    loading: warehousesLoading,
    error,
    pagination,
    getWarehouses,
    getWarehouse,
    deleteWarehouse,
    toggleWarehouseStatus,
    searchWarehouses,
    filterWarehousesByStatus,
    sortWarehouses,
    changePage,
    setFilters,
  } = useWarehouse();

  // Process warehouses data from API response
  const warehousesData = warehouses?.Data?.$values || warehouses || [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    sortBy: "CreatedAt",
    sortAscending: false,
  });
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(null);

  // Mock statistics - you can replace this with actual API call
  const [statistics, setStatistics] = useState({
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

  // Update statistics when warehouses change
  useEffect(() => {
    if (Array.isArray(warehousesData) && warehousesData.length > 0) {
      const stats = {
        totalWarehouses: pagination?.TotalItems || warehousesData.length,
        activeWarehouses: warehousesData.filter((w) => w.Status === "Active")
          .length,
        primaryWarehouses: warehousesData.filter(
          (w) => w.Primary === "1" || w.Primary === "Yes"
        ).length,
        warehousesThisMonth: warehousesData.filter((w) => {
          const createdDate = new Date(w.CreatedAt);
          const now = new Date();
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
      };
      setStatistics(stats);
    }
  }, [warehousesData, pagination]);

  // Handle search when searchTerm changes (with debounce)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchWarehouses();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Handle filters change
  useEffect(() => {
    setSelectedWarehouses([]);
    setSelectAll(false);
  }, [warehousesData]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // CSV Export functionality
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';

    // Define the headers for CSV
    const headers = [
      'ID',
      'Name',
      'Code',
      'Description',
      'Manager Name',
      'Email',
      'Phone',
      'Address',
      'Shipping Address',
      'City',
      'State',
      'Postal Code',
      'Country',
      'Status',
      'Primary',
      'Default',
      'View Permission',
      'Create Invoice Permission',
      'Update Stock Permission',
      'Created At',
      'Updated At'
    ];

    // Convert data to CSV format
    const csvRows = [headers.join(',')];
    
    data.forEach(warehouse => {
      const values = [
        warehouse.Id || '',
        `"${(warehouse.Name || '').replace(/"/g, '""')}"`,
        `"${(warehouse.Code || '').replace(/"/g, '""')}"`,
        `"${(warehouse.Description || '').replace(/"/g, '""')}"`,
        `"${(warehouse.ManagerName || '').replace(/"/g, '""')}"`,
        `"${(warehouse.Email || '').replace(/"/g, '""')}"`,
        `"${(warehouse.Phone || '').replace(/"/g, '""')}"`,
        `"${(warehouse.Address || '').replace(/"/g, '""')}"`,
        `"${(warehouse.ShippingAddress || '').replace(/"/g, '""')}"`,
        `"${(warehouse.City || '').replace(/"/g, '""')}"`,
        `"${(warehouse.State || '').replace(/"/g, '""')}"`,
        `"${(warehouse.PostalCode || '').replace(/"/g, '""')}"`,
        `"${(warehouse.Country || '').replace(/"/g, '""')}"`,
        `"${(warehouse.Status || '').replace(/"/g, '""')}"`,
        warehouse.Primary === "1" || warehouse.Primary === "Yes" ? "Yes" : "No",
        warehouse.IsDefault ? "Yes" : "No",
        warehouse.ViewPermission === "1" ? "Yes" : "No",
        warehouse.CreateInvoicePermission === "1" ? "Yes" : "No",
        warehouse.UpdateStockPermission === "1" ? "Yes" : "No",
        warehouse.CreatedAt ? new Date(warehouse.CreatedAt).toLocaleDateString() : '',
        warehouse.UpdatedAt ? new Date(warehouse.UpdatedAt).toLocaleDateString() : ''
      ];
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      if (!Array.isArray(warehousesData) || warehousesData.length === 0) {
        alert(translations["No data to export"]);
        return;
      }

      const csvContent = convertToCSV(warehousesData);
      const filename = `warehouses_all_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      
      setShowExportModal(false);
      // You can add a success notification here
    } catch (error) {
      console.error("Error exporting all warehouses:", error);
      alert(translations["Export failed"]);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSelected = async () => {
    setIsExporting(true);
    try {
      if (selectedWarehouses.length === 0) {
        alert(translations["Select warehouses to export"]);
        return;
      }

      const selectedData = warehousesData.filter(warehouse => 
        selectedWarehouses.includes(warehouse.Id)
      );

      if (selectedData.length === 0) {
        alert(translations["No data to export"]);
        return;
      }

      const csvContent = convertToCSV(selectedData);
      const filename = `warehouses_selected_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      
      setShowExportModal(false);
      // You can add a success notification here
    } catch (error) {
      console.error("Error exporting selected warehouses:", error);
      alert(translations["Export failed"]);
    } finally {
      setIsExporting(false);
    }
  };

  // Search function
  const handleSearchWarehouses = async () => {
    try {
      await searchWarehouses(searchTerm);
    } catch (error) {
      console.error("Error searching warehouses:", error);
    }
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
      const warehouseIds = Array.isArray(warehousesData)
        ? warehousesData.map((warehouse) => warehouse.Id)
        : [];
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
    const warehouse = Array.isArray(warehousesData)
      ? warehousesData.find((w) => w.Id === warehouseId)
      : null;
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

  const confirmDeleteWarehouse = async () => {
    if (!warehouseToDelete) return;

    setIsDeleting(true);
    try {
      await deleteWarehouse(warehouseToDelete.Id);
      setShowDeleteModal(false);
      setWarehouseToDelete(null);
      // Refresh the warehouse list
      await getWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      alert("Failed to delete warehouse");
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination
  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    try {
      await changePage(newPage);
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };

  // Filter functions
  const handleApplyFilters = async () => {
    try {
      setFilters(filterOptions);
      if (filterOptions.status) {
        await filterWarehousesByStatus(filterOptions.status);
      }
      if (filterOptions.sortBy) {
        await sortWarehouses(filterOptions.sortBy, filterOptions.sortAscending);
      }
      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm("");
    setFilterOptions({
      status: "",
      sortBy: "CreatedAt",
      sortAscending: false,
    });
    setShowFilters(false);

    try {
      await getWarehouses();
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  // Export functionality
  const handleExport = () => {
    setShowExportModal(true);
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
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <Container className="flex items-center gap-4 mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {translations.Warehouses}
            </h1>
            {selectedWarehouses.length > 0 && (
              <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedWarehouses.length} {translations.Selected}
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
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Export}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleExport}
              disabled={
                isExporting ||
                !Array.isArray(warehousesData) ||
                warehousesData.length === 0
              }
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
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Warehouses}`}
            value={statistics?.totalWarehouses || 0}
            icon={Warehouse}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations.Active}
            value={statistics?.activeWarehouses || 0}
            icon={Package}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations.Primary}
            value={statistics?.primaryWarehouses || 0}
            icon={Building}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            title={translations["This Month"]}
            value={statistics?.warehousesThisMonth || 0}
            icon={Calendar}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
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

        {/* Warehouse Table */}
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
          ) : !Array.isArray(warehousesData) || warehousesData.length === 0 ? (
            <Container className="text-center py-12">
              <Warehouse className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                    {warehousesData.map((warehouse) => (
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
                              {(warehouse.Primary === "1" ||
                                warehouse.Primary === "Yes") && (
                                <Span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  {translations.Primary}
                                </Span>
                              )}
                              {warehouse.IsDefault && (
                                <Span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Default
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
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              warehouse.Status === "Active"
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

              {/* Pagination */}
              {pagination && pagination.TotalPages > 1 && (
                <Container className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                  <Span className="text-sm text-gray-500">
                    {translations.Showing}{" "}
                    {(pagination.CurrentPage - 1) * pagination.PageSize + 1} -{" "}
                    {Math.min(
                      pagination.CurrentPage * pagination.PageSize,
                      pagination.TotalItems
                    )}{" "}
                    {translations.Of} {pagination.TotalItems}{" "}
                    {translations.Items}
                  </Span>
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
                      disabled={pagination.CurrentPage === 1}
                      onClick={() => handlePageChange(1)}
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
                      disabled={pagination.CurrentPage === 1}
                      onClick={() =>
                        handlePageChange(pagination.CurrentPage - 1)
                      }
                    />
                    <Span className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center">
                      {pagination.CurrentPage} / {pagination.TotalPages}
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
                      disabled={
                        pagination.CurrentPage === pagination.TotalPages
                      }
                      onClick={() =>
                        handlePageChange(pagination.CurrentPage + 1)
                      }
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
                      disabled={
                        pagination.CurrentPage === pagination.TotalPages
                      }
                      onClick={() => handlePageChange(pagination.TotalPages)}
                    />
                  </Container>
                </Container>
              )}
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
                  <Span className="text-sm text-gray-900 block mt-1">
                    {selectedWarehouse.Name || "N/A"}
                  </Span>
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
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedWarehouse.Status === "Active"
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
                    <Span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 bg-yellow-100 text-yellow-800">
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
                        className={`px-2 py-1 text-xs rounded-full ${
                          selectedWarehouse.ViewPermission === "1"
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
                        className={`px-2 py-1 text-xs rounded-full ${
                          selectedWarehouse.CreateInvoicePermission === "1"
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
                        className={`px-2 py-1 text-xs rounded-full ${
                          selectedWarehouse.UpdateStockPermission === "1"
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
              permanently delete the warehouse{" "}
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
                    <option value="city">City</option>
                    <option value="managername">Manager Name</option>
                    <option value="primary">Primary</option>
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

export default WarehouseList;
