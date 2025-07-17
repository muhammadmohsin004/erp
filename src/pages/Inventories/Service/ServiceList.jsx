import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  DollarSign,
  Code,
  Building,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  X,
  Calendar,
  Package,
  Layers,
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
import { useService } from "../../../Contexts/ServiceContext/ServiceContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../../components/elements/modal/Modal";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../../components/elements/table/Table";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const ServiceList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Add Service": language === "ar" ? "إضافة خدمة" : "Add Service",
    Services: language === "ar" ? "الخدمات" : "Services",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    NoServices: language === "ar" ? "لا يوجد خدمات" : "No services found",
    Name: language === "ar" ? "الاسم" : "Name",
    "Service Code": language === "ar" ? "كود الخدمة" : "Service Code",
    Description: language === "ar" ? "الوصف" : "Description",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    "Purchase Price": language === "ar" ? "سعر الشراء" : "Purchase Price",
    "Minimum Price": language === "ar" ? "الحد الأدنى للسعر" : "Minimum Price",
    Discount: language === "ar" ? "الخصم" : "Discount",
    "Discount Type": language === "ar" ? "نوع الخصم" : "Discount Type",
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
    "Delete Service": language === "ar" ? "حذف الخدمة" : "Delete Service",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Service Details": language === "ar" ? "تفاصيل الخدمة" : "Service Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Internal Notes": language === "ar" ? "ملاحظات داخلية" : "Internal Notes",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "All Status": language === "ar" ? "جميع الحالات" : "All Status",
    Categories: language === "ar" ? "الفئات" : "Categories",
    Taxes: language === "ar" ? "الضرائب" : "Taxes",
    Tags: language === "ar" ? "العلامات" : "Tags",
    Images: language === "ar" ? "الصور" : "Images",
    Price: language === "ar" ? "السعر" : "Price",
    "Export All": language === "ar" ? "تصدير الكل" : "Export All",
    "Export Selected": language === "ar" ? "تصدير المحدد" : "Export Selected",
    "Exporting...": language === "ar" ? "جاري التصدير..." : "Exporting...",
    "Export Successful":
      language === "ar" ? "تم التصدير بنجاح" : "Export Successful",
    "Export Failed": language === "ar" ? "فشل التصدير" : "Export Failed",
  };

  // Get service context
  const {
    services,
    loading: servicesLoading,
    error,
    pagination,
    getServices,
    getService,
    deleteService,
    searchServices,
    filterServicesByStatus,
    sortServices,
    changePage,
    setFilters,
  } = useService();

  // Process services data from API response
  console.log("services================>", services);
  const servicesData = services || [];
  console.log("ServicesData", servicesData);

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    sortBy: "Id",
    sortAscending: false,
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalServices: 0,
    activeServices: 0,
    servicesThisMonth: 0,
    totalRevenue: 0,
  });

  // Fetch services on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getServices();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token, getServices]);

  // Update statistics when services change
  useEffect(() => {
    if (Array.isArray(servicesData) && servicesData.length > 0) {
      const stats = {
        totalServices: pagination?.TotalItems || servicesData.length,
        activeServices: servicesData.filter((s) => s.Status === "Active")
          .length,
        servicesThisMonth: servicesData.filter((s) => {
          const createdDate = new Date(s.CreatedAt);
          const now = new Date();
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
        totalRevenue: servicesData.reduce((sum, s) => {
          const unitPrice = parseFloat(s.UnitPrice) || 0;
          return sum + unitPrice;
        }, 0),
      };
      setStatistics(stats);
    }
  }, [servicesData, pagination]);

  // Handle search when searchTerm changes (with debounce)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchServices();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // CSV Export Functionality
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    // Define headers
    const headers = [
      "ID",
      "Name",
      "Service Code",
      "Description",
      "Unit Price",
      "Purchase Price",
      "Minimum Price",
      "Discount",
      "Discount Type",
      "Status",
      "Internal Notes",
      "Categories Count",
      "Taxes Count",
      "Tags Count",
      "Images Count",
      "Created At",
      "Updated At",
    ];

    // Convert data to CSV format
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(","));

    // Add data rows
    data.forEach((service) => {
      const row = [
        service.Id || "",
        `"${(service.Name || "").replace(/"/g, '""')}"`,
        service.ServiceCode || "",
        `"${(service.Description || "").replace(/"/g, '""')}"`,
        formatCurrency(service.UnitPrice),
        formatCurrency(service.PurchasePrice),
        formatCurrency(service.MinimumPrice),
        formatCurrency(service.Discount),
        service.DiscountType || "",
        service.Status || "",
        `"${(service.InternalNotes || "").replace(/"/g, '""')}"`,
        service.Categories?.length || 0,
        service.Taxes?.length || 0,
        service.Tags?.length || 0,
        service.Images?.length || 0,
        service.CreatedAt
          ? new Date(service.CreatedAt).toLocaleDateString()
          : "",
        service.UpdatedAt
          ? new Date(service.UpdatedAt).toLocaleDateString()
          : "",
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    setShowExportDropdown(false);

    try {
      // If we have all services data, use it; otherwise fetch all
      let allServicesData = servicesData;

      if (pagination && pagination.TotalItems > servicesData.length) {
        // Fetch all services if we don't have all data
        // This would require an API call to get all services without pagination
        // For now, we'll use the current data
        console.log("Exporting current page data only");
      }

      const csvContent = convertToCSV(allServicesData);
      const filename = `services_export_${new Date().toISOString().split("T")[0]
        }.csv`;

      downloadCSV(csvContent, filename);

      // Show success message
      alert(translations["Export Successful"]);
    } catch (error) {
      console.error("Export error:", error);
      alert(translations["Export Failed"]);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSelected = async () => {
    if (selectedServices.length === 0) {
      alert("Please select services to export");
      return;
    }

    setIsExporting(true);
    setShowExportDropdown(false);

    try {
      // Get selected services data
      const selectedServicesData = servicesData.filter((service) =>
        selectedServices.includes(service.Id)
      );

      const csvContent = convertToCSV(selectedServicesData);
      const filename = `selected_services_export_${new Date().toISOString().split("T")[0]
        }.csv`;

      downloadCSV(csvContent, filename);

      // Show success message
      alert(translations["Export Successful"]);
    } catch (error) {
      console.error("Export error:", error);
      alert(translations["Export Failed"]);
    } finally {
      setIsExporting(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportDropdown && !event.target.closest(".export-dropdown")) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportDropdown]);

  // Search function
  const handleSearchServices = async () => {
    try {
      if (searchTerm.trim() === "") {
        // If search term is empty, fetch fresh data
        await getServices();
      } else {
        await searchServices(searchTerm);
      }
    } catch (error) {
      console.error("Error searching services:", error);
    }
  };

  // Service selection
  const handleServiceSelection = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedServices([]);
    } else {
      const serviceIds = Array.isArray(servicesData)
        ? servicesData.map((service) => service.Id)
        : [];
      setSelectedServices(serviceIds);
    }
    setSelectAll(!selectAll);
  };

  // Service actions
  const handleViewService = async (serviceId) => {
    try {
      const serviceData = await getService(serviceId);
      if (serviceData) {
        setSelectedService(serviceData);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      alert("Failed to fetch service details");
    }
  };

  const handleEditService = async (serviceId) => {
    try {
      const serviceData = await getService(serviceId);
      if (serviceData) {
        navigate("/admin/new-service", {
          state: {
            editData: serviceData,
            isEditing: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching service for edit:", error);
      alert("Failed to fetch service details for editing");
    }
  };

  const handleCloneService = async (serviceId) => {
    try {
      const serviceData = await getService(serviceId);
      if (serviceData) {
        navigate("/admin/new-service", {
          state: {
            cloneData: {
              ...serviceData,
              Name: `${serviceData.Name || ""} (Copy)`,
              ServiceCode: "",
              Id: undefined,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error cloning service:", error);
      alert("Failed to clone service");
    }
  };

  const handleDeleteService = (serviceId) => {
    const service = Array.isArray(servicesData)
      ? servicesData.find((s) => s.Id === serviceId)
      : null;
    if (service) {
      setServiceToDelete(service);
      setShowDeleteModal(true);
    } else {
      alert("Service not found");
    }
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    try {
      await deleteService(serviceToDelete.Id);
      setShowDeleteModal(false);
      setServiceToDelete(null);
      // Refresh the service list
      await getServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
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

  // Filter functions
  const handleApplyFilters = async () => {
    try {
      setFilters(filterOptions);
      if (filterOptions.status) {
        await filterServicesByStatus(filterOptions.status);
      }
      if (filterOptions.sortBy) {
        await sortServices(filterOptions.sortBy, filterOptions.sortAscending);
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
      sortBy: "Id",
      sortAscending: false,
    });
    setShowFilters(false);

    try {
      // Reset filters in context and fetch fresh data
      setFilters({
        searchTerm: "",
        status: "",
        sortBy: "Id",
        sortAscending: false,
      });
      await getServices();
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    const numValue = parseFloat(value) || 0;
    return numValue.toFixed(2);
  };

  // Statistics Card Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor,
    isCurrency = false,
  }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <Container className="flex items-center justify-between">
        <Container>
          <Span className="text-gray-500 text-sm font-medium">{title}</Span>
          <Span className="text-2xl font-bold text-gray-900 mt-1 block">
            {isCurrency ? `$${formatCurrency(value)}` : value || 0}
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
        <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
      </Container>
    );
  }
  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 relative">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {translations.Services}
            </h1>
            {selectedServices.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedServices.length} {translations.Selected}
              </span>
            )}
          </div>

          <div className="flex gap-3 flex-wrap relative">
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
              icon={Download}
              iconSize="w-4 h-4"
              bgColor={isExporting ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"}

              rounded="rounded-lg"
              buttonText={
                isExporting
                  ? translations["Exporting..."]
                  : translations.Export
              }
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              disabled={isExporting}
              onClick={() => setShowExportDropdown(!showExportDropdown)}
            />

            {/* Export Dropdown Menu */}
            {showExportDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={handleExportAll}
                    disabled={isExporting || servicesData.length === 0}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {translations["Export All"]} ({servicesData.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleExportSelected}
                    disabled={isExporting || selectedServices.length === 0}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {translations["Export Selected"]} ({selectedServices.length})
                  </button>
                </div>
              </div>
            )}

            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Service"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/new-service")}
            />
          </div>
        </div>


        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Services}`}
            value={statistics?.totalServices || 0}
            icon={Layers}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations.Active}
            value={statistics?.activeServices || 0}
            icon={Settings}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations["This Month"]}
            value={statistics?.servicesThisMonth || 0}
            icon={Calendar}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatCard
            title={`${translations.Total} ${translations.Price}`}
            value={statistics?.totalRevenue || 0}
            icon={DollarSign}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
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
            />
          </Container>
        </Container>

        {/* Service Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {servicesLoading ? (
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
                onClick={() => getServices()}
              />
            </Container>
          ) : !Array.isArray(servicesData) || servicesData.length === 0 ? (
            <Container className="text-center py-12">
              <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterOptions.status
                  ? translations["No results found"]
                  : translations.NoServices}
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
                        {translations["Service Code"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations["Unit Price"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations.Discount}
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
                    {servicesData.map((service) => (
                      <tr key={service.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.Id)}
                            onChange={() => handleServiceSelection(service.Id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Container>
                            <Container className="flex items-center gap-2">
                              <Span className="text-sm font-medium text-gray-900">
                                {service.Name || "N/A"}
                              </Span>
                            </Container>
                            {service.Description && (
                              <Span className="text-sm text-gray-500 block truncate max-w-xs">
                                {service.Description}
                              </Span>
                            )}
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Container className="flex items-center gap-1">
                            <Code className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {service.ServiceCode || "-"}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <Container className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <Span className="text-sm font-medium text-green-600">
                              {formatCurrency(service.UnitPrice)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          {service.Discount &&
                            parseFloat(service.Discount) > 0 ? (
                            <Container className="flex items-center gap-1">
                              <Span className="text-sm text-orange-600">
                                {formatCurrency(service.Discount)}
                                {service.DiscountType && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({service.DiscountType})
                                  </span>
                                )}
                              </Span>
                            </Container>
                          ) : (
                            <Span className="text-sm text-gray-500">-</Span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${service.Status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {translations[service.Status] || service.Status}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-1">
                            {/* View Button */}
                            <button
                              onClick={() => handleViewService(service.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              title={translations.View}
                            >
                              <AiOutlineEye className="w-3 h-3" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditService(service.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                              title={translations.Edit}
                            >
                              <AiOutlineEdit className="w-3 h-3" />
                            </button>

                            {/* Clone Button */}
                            <button
                              onClick={() => handleCloneService(service.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                              title={translations.Clone}
                            >
                              <AiOutlineCopy className="w-3 h-3" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteService(service.Id)}
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
                  <Container className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                    <Span className="text-sm text-gray-500">
                      {translations.Showing}{" "}
                      {(pagination.PageNumber - 1) * pagination.PageSize + 1} -{" "}
                      {Math.min(
                        pagination.PageNumber * pagination.PageSize,
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
                        disabled={!pagination.HasPreviousPage}
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
                        disabled={!pagination.HasPreviousPage}
                        onClick={() =>
                          handlePageChange(pagination.PageNumber - 1)
                        }
                      />
                      <Span className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center">
                        {pagination.PageNumber} / {pagination.TotalPages}
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
                      />
                    </Container>
                  </Container>
                )}
            </>
          )}
        </Container>
      </Container>

      {/* View Service Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Service Details"]}</Span>
          </Container>
        }
        width={900}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditService(selectedService?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedService && (
            <Container className="max-h-96 overflow-y-auto">
              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Name}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedService.Name || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Service Code"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedService.ServiceCode || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Description}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedService.Description || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Status}
                    </Span>
                    <Span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${selectedService.Status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {translations[selectedService.Status] ||
                        selectedService.Status}
                    </Span>
                  </Container>
                </Container>

                {/* Pricing Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Pricing Information
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Purchase Price"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      ${formatCurrency(selectedService.PurchasePrice)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Unit Price"]}
                    </Span>
                    <Span className="text-sm text-green-600 font-medium block mt-1">
                      ${formatCurrency(selectedService.UnitPrice)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Minimum Price"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      ${formatCurrency(selectedService.MinimumPrice)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Discount}
                    </Span>
                    <Span className="text-sm text-orange-600 block mt-1">
                      ${formatCurrency(selectedService.Discount)}
                      {selectedService.DiscountType && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({selectedService.DiscountType})
                        </span>
                      )}
                    </Span>
                  </Container>
                </Container>
              </Container>

              {/* Additional Information */}
              <Container className="mt-6 pt-4 border-t border-gray-200">
                {selectedService.InternalNotes && (
                  <Container className="mb-4">
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Internal Notes"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedService.InternalNotes}
                    </Span>
                  </Container>
                )}

                {/* Related Data Counts */}
                <Container className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Container className="text-center">
                    <Span className="text-lg font-bold text-blue-600">
                      {selectedService.Categories?.length || 0}
                    </Span>
                    <Span className="text-xs text-gray-500 block">
                      {translations.Categories}
                    </Span>
                  </Container>
                  <Container className="text-center">
                    <Span className="text-lg font-bold text-green-600">
                      {selectedService.Taxes?.length || 0}
                    </Span>
                    <Span className="text-xs text-gray-500 block">
                      {translations.Taxes}
                    </Span>
                  </Container>
                  <Container className="text-center">
                    <Span className="text-lg font-bold text-purple-600">
                      {selectedService.Tags?.length || 0}
                    </Span>
                    <Span className="text-xs text-gray-500 block">
                      {translations.Tags}
                    </Span>
                  </Container>
                  <Container className="text-center">
                    <Span className="text-lg font-bold text-orange-600">
                      {selectedService.Images?.length || 0}
                    </Span>
                    <Span className="text-xs text-gray-500 block">
                      {translations.Images}
                    </Span>
                  </Container>
                </Container>

                <Container className="text-xs text-gray-500 space-y-1 mt-4">
                  <Container>
                    Created:{" "}
                    {selectedService.CreatedAt
                      ? new Date(selectedService.CreatedAt).toLocaleDateString()
                      : "N/A"}
                  </Container>
                  {selectedService.UpdatedAt && (
                    <Container>
                      Updated:{" "}
                      {new Date(selectedService.UpdatedAt).toLocaleDateString()}
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
            <Span>{translations["Delete Service"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteService}
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
              permanently delete the service{" "}
              <strong>"{serviceToDelete?.Name}"</strong> and all associated
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
                    <option value="Id">Date Created</option>
                    <option value="Name">Name</option>
                    <option value="ServiceCode">Service Code</option>
                    <option value="UnitPrice">Unit Price</option>
                    <option value="PurchasePrice">Purchase Price</option>
                    <option value="Discount">Discount</option>
                    <option value="Status">Status</option>
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

export default ServiceList;
