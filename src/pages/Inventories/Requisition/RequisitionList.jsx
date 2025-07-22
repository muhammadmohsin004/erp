import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  DollarSign,
  Hash,
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
  Paperclip,
  Upload,
  Search,
} from "lucide-react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineCopy,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineFilter,
  AiOutlineDownload,
  AiOutlineFileText,
  AiOutlinePaperClip,
} from "react-icons/ai";
import { useRequisition } from "../../../Contexts/RequisitionContext/RequisitionContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../../components/elements/modal/Modal";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../../components/elements/table/Table";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const RequisitionList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const translations = {
    "Add Requisition": language === "ar" ? "إضافة طلب" : "Add Requisition",
    Requisitions: language === "ar" ? "الطلبات" : "Requisitions",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    NoRequisitions:
      language === "ar" ? "لا يوجد طلبات" : "No requisitions found",
    Number: language === "ar" ? "الرقم" : "Number",
    Type: language === "ar" ? "النوع" : "Type",
    Date: language === "ar" ? "التاريخ" : "Date",
    "Journal Account": language === "ar" ? "حساب اليومية" : "Journal Account",
    Notes: language === "ar" ? "الملاحظات" : "Notes",
    Supplier: language === "ar" ? "المورد" : "Supplier",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    Total: language === "ar" ? "المجموع" : "Total",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Requisition":
      language === "ar" ? "حذف الطلب" : "Delete Requisition",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Requisition Details":
      language === "ar" ? "تفاصيل الطلب" : "Requisition Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "All Types": language === "ar" ? "جميع الأنواع" : "All Types",
    Purchase: language === "ar" ? "شراء" : "Purchase",
    Sale: language === "ar" ? "بيع" : "Sale",
    Return: language === "ar" ? "إرجاع" : "Return",
    Transfer: language === "ar" ? "تحويل" : "Transfer",
    "Created At": language === "ar" ? "تاريخ الإنشاء" : "Created At",
    "Updated At": language === "ar" ? "تاريخ التحديث" : "Updated At",
    Attachments: language === "ar" ? "المرفقات" : "Attachments",
    "Basic Information":
      language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Additional Information":
      language === "ar" ? "معلومات إضافية" : "Additional Information",
    "No attachments": language === "ar" ? "لا توجد مرفقات" : "No attachments",
    "No items": language === "ar" ? "لا توجد عناصر" : "No items",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    Quantity: language === "ar" ? "الكمية" : "Quantity",
    "Stock on Hand": language === "ar" ? "المخزون المتاح" : "Stock on Hand",
    "New Stock": language === "ar" ? "المخزون الجديد" : "New Stock",
  };

  // Get requisition context
  const {
    requisitions,
    loading: requisitionsLoading,
    error,
    pagination,
    getRequisitions,
    getRequisition,
    deleteRequisition,
    searchRequisitions,
    filterRequisitionsByType,
    sortRequisitions,
    changePage,
    setFilters,
  } = useRequisition();

  // Process requisitions data from API response
  const requisitionsData = requisitions?.Data?.$values || [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    type: "",
    sortBy: "CreatedAt",
    sortAscending: false,
  });
  const [selectedRequisitions, setSelectedRequisitions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [requisitionToDelete, setRequisitionToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalRequisitions: 0,
    purchaseRequisitions: 0,
    requisitionsThisMonth: 0,
    totalWithAttachments: 0,
  });

  // Fetch requisitions on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getRequisitions();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token, getRequisitions]);

  // Update statistics when requisitions change
  useEffect(() => {
    if (Array.isArray(requisitionsData) && requisitionsData.length > 0) {
      const stats = {
        totalRequisitions: pagination?.TotalItems || requisitionsData.length,
        purchaseRequisitions: requisitionsData.filter(
          (r) => r.Type === "Purchase"
        ).length,
        requisitionsThisMonth: requisitionsData.filter((r) => {
          const createdDate = new Date(r.CreatedAt);
          const now = new Date();
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
        totalWithAttachments: requisitionsData.filter(
          (r) => r.Attachments && r.Attachments.length > 0
        ).length,
      };
      setStatistics(stats);
    }
  }, [requisitionsData, pagination]);

  // Handle search when searchTerm changes (with debounce)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchRequisitions();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Handle filters change
  useEffect(() => {
    setSelectedRequisitions([]);
    setSelectAll(false);
  }, [requisitionsData]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Search function
  const handleSearchRequisitions = async () => {
    try {
      if (searchTerm.trim() === "") {
        // If search term is empty, fetch fresh data
        await getRequisitions();
      } else {
        await searchRequisitions(searchTerm);
      }
    } catch (error) {
      console.error("Error searching requisitions:", error);
    }
  };

  // Requisition selection
  const handleRequisitionSelection = (requisitionId) => {
    setSelectedRequisitions((prev) => {
      if (prev.includes(requisitionId)) {
        return prev.filter((id) => id !== requisitionId);
      } else {
        return [...prev, requisitionId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRequisitions([]);
    } else {
      const requisitionIds = Array.isArray(requisitionsData)
        ? requisitionsData.map((requisition) => requisition.Id)
        : [];
      setSelectedRequisitions(requisitionIds);
    }
    setSelectAll(!selectAll);
  };

  // Requisition actions
  const handleViewRequisition = async (requisitionId) => {
    try {
      const requisitionData = await getRequisition(requisitionId);
      if (requisitionData) {
        setSelectedRequisition(requisitionData);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching requisition details:", error);
      alert("Failed to fetch requisition details");
    }
  };

  const handleEditRequisition = async (requisitionId) => {
    try {
      const requisitionData = await getRequisition(requisitionId);
      if (requisitionData) {
        navigate("/admin/new-requisition", {
          state: {
            editData: requisitionData,
            isEditing: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching requisition for edit:", error);
      alert("Failed to fetch requisition details for editing");
    }
  };

  const handleCloneRequisition = async (requisitionId) => {
    try {
      const requisitionData = await getRequisition(requisitionId);
      if (requisitionData) {
        navigate("/admin/new-requisition", {
          state: {
            cloneData: {
              ...requisitionData,
              Number: "",
              Id: undefined,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error cloning requisition:", error);
      alert("Failed to clone requisition");
    }
  };

  const handleDeleteRequisition = (requisitionId) => {
    const requisition = Array.isArray(requisitionsData)
      ? requisitionsData.find((r) => r.Id === requisitionId)
      : null;
    if (requisition) {
      setRequisitionToDelete(requisition);
      setShowDeleteModal(true);
    } else {
      alert("Requisition not found");
    }
  };

  const confirmDeleteRequisition = async () => {
    if (!requisitionToDelete) return;

    setIsDeleting(true);
    try {
      await deleteRequisition(requisitionToDelete.Id);
      setShowDeleteModal(false);
      setRequisitionToDelete(null);
      // Refresh the requisition list
      await getRequisitions();
    } catch (error) {
      console.error("Error deleting requisition:", error);
      alert("Failed to delete requisition");
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
      if (filterOptions.type) {
        await filterRequisitionsByType(filterOptions.type);
      }
      if (filterOptions.sortBy) {
        await sortRequisitions(
          filterOptions.sortBy,
          filterOptions.sortAscending
        );
      }
      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm("");
    setFilterOptions({
      type: "",
      sortBy: "CreatedAt",
      sortAscending: false,
    });
    setShowFilters(false);

    try {
      // Reset filters in context and fetch fresh data
      setFilters({
        searchTerm: "",
        type: "",
        sortBy: "CreatedAt",
        sortAscending: false,
      });
      await getRequisitions();
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Get requisition type color
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "purchase":
        return "bg-blue-100 text-blue-800";
      case "sale":
        return "bg-green-100 text-green-800";
      case "return":
        return "bg-orange-100 text-orange-800";
      case "transfer":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
      </Container>
    );
  }
  // CSV Export functionality
  const handleExport = async () => {
    try {
      // Determine which requisitions to export
      const requisitionsToExport =
        selectedRequisitions.length > 0
          ? requisitionsData.filter((r) => selectedRequisitions.includes(r.Id))
          : requisitionsData;

      if (!requisitionsToExport || requisitionsToExport.length === 0) {
        alert(translations["No requisitions to export"]);
        return;
      }

      // Prepare CSV headers
      const headers = [
        translations.Number,
        translations.Type,
        translations.Date,
        translations["Journal Account"],
        translations.Notes,
        translations["Created At"],
        translations["Updated At"],
      ];

      // Prepare CSV rows
      const rows = requisitionsToExport.map((requisition) => [
        `"${requisition.Number || ""}"`,
        `"${translations[requisition.Type] || requisition.Type || ""}"`,
        `"${formatDate(requisition.Date) || ""}"`,
        `"${requisition.JournalAccount || ""}"`,
        `"${requisition.Notes || ""}"`,
        `"${formatDate(requisition.CreatedAt) || ""}"`,
        `"${requisition.UpdatedAt ? formatDate(requisition.UpdatedAt) : ""}"`,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `requisitions_export_${new Date().toISOString().slice(0, 10)}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting requisitions:", error);
      alert("Failed to export requisitions");
    }
  };

  // Add this to your translations object
  translations["No requisitions to export"] =
    language === "ar" ? "لا توجد طلبات للتصدير" : "No requisitions to export";

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {translations.Requisitions}
            </h1>
            {selectedRequisitions.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedRequisitions.length} {translations.Selected}
              </span>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            <FilledButton
              isIcon
              icon={Filter}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              rounded="rounded-lg"
              buttonText={translations.Filters}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft
              onClick={() => setShowFilters(true)}
            />

            <FilledButton
              isIcon
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
              isIconLeft
              onClick={handleExport}
              disabled={
                (!Array.isArray(requisitionsData) ||
                  requisitionsData.length === 0) &&
                selectedRequisitions.length === 0
              }
            />

            <FilledButton
              isIcon
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Requisition"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft
              onClick={() => navigate("/admin/new-requisition")}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Requisitions}`}
            value={statistics?.totalRequisitions || 0}
            icon={FileText}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations.Purchase}
            value={statistics?.purchaseRequisitions || 0}
            icon={Package}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations["This Month"]}
            value={statistics?.requisitionsThisMonth || 0}
            icon={Calendar}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatCard
            title={`${translations.Total} ${translations.Attachments}`}
            value={statistics?.totalWithAttachments || 0}
            icon={Paperclip}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
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

        {/* Requisition Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {requisitionsLoading ? (
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
                onClick={() => getRequisitions()}
              />
            </Container>
          ) : !Array.isArray(requisitionsData) ||
            requisitionsData.length === 0 ? (
            <Container className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterOptions.type
                  ? translations["No results found"]
                  : translations.NoRequisitions}
              </h3>
              {(searchTerm || filterOptions.type) && (
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
                        {translations.Number}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Type}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        {translations.Date}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations["Journal Account"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations.Notes}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requisitionsData.map((requisition) => (
                      <tr key={requisition.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedRequisitions.includes(
                              requisition.Id
                            )}
                            onChange={() =>
                              handleRequisitionSelection(requisition.Id)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <Span className="text-sm font-medium text-gray-900">
                              {requisition.Number || "N/A"}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4">
                          <Span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                              requisition.Type
                            )}`}
                          >
                            {translations[requisition.Type] || requisition.Type}
                          </Span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Container className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {formatDate(requisition.Date)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <Span className="text-sm text-gray-900">
                            {requisition.JournalAccount || "-"}
                          </Span>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <Span className="text-sm text-gray-500 truncate max-w-xs block">
                            {requisition.Notes || "-"}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-1">
                            {/* View Button */}
                            <button
                              onClick={() =>
                                handleViewRequisition(requisition.Id)
                              }
                              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              title={translations.View}
                            >
                              <AiOutlineEye className="w-3 h-3" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() =>
                                handleEditRequisition(requisition.Id)
                              }
                              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                              title={translations.Edit}
                            >
                              <AiOutlineEdit className="w-3 h-3" />
                            </button>

                            {/* Clone Button */}
                            <button
                              onClick={() =>
                                handleCloneRequisition(requisition.Id)
                              }
                              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                              title={translations.Clone}
                            >
                              <AiOutlineCopy className="w-3 h-3" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() =>
                                handleDeleteRequisition(requisition.Id)
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

      {/* View Requisition Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Requisition Details"]}</Span>
          </Container>
        }
        width={900}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditRequisition(selectedRequisition?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedRequisition && (
            <Container className="max-h-96 overflow-y-auto">
              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    {translations["Basic Information"]}
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Number}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedRequisition.Number || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Type}
                    </Span>
                    <Span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getTypeColor(
                        selectedRequisition.Type
                      )}`}
                    >
                      {translations[selectedRequisition.Type] ||
                        selectedRequisition.Type}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Date}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {formatDate(selectedRequisition.Date)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Journal Account"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedRequisition.JournalAccount || "N/A"}
                    </Span>
                  </Container>
                </Container>

                {/* Additional Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    {translations["Additional Information"]}
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Notes}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedRequisition.Notes || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Created At"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {formatDate(selectedRequisition.CreatedAt)}
                    </Span>
                  </Container>

                  {selectedRequisition.UpdatedAt && (
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Updated At"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {formatDate(selectedRequisition.UpdatedAt)}
                      </Span>
                    </Container>
                  )}
                </Container>
              </Container>

              {/* Items Section */}
              {selectedRequisition.Items &&
                selectedRequisition.Items.length > 0 && (
                  <Container className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {translations.Items} ({selectedRequisition.Items.length})
                    </h3>
                    <Container className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left">Product ID</th>
                            <th className="px-3 py-2 text-left">
                              {translations["Unit Price"]}
                            </th>
                            <th className="px-3 py-2 text-left">
                              {translations.Quantity}
                            </th>
                            <th className="px-3 py-2 text-left">
                              {translations["Stock on Hand"]}
                            </th>
                            <th className="px-3 py-2 text-left">
                              {translations["New Stock"]}
                            </th>
                            <th className="px-3 py-2 text-left">
                              {translations.Total}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedRequisition.Items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2">{item.ProductId}</td>
                              <td className="px-3 py-2">${item.UnitPrice}</td>
                              <td className="px-3 py-2">{item.Qty}</td>
                              <td className="px-3 py-2">{item.StockOnHand}</td>
                              <td className="px-3 py-2">
                                {item.NewStockOnHand}
                              </td>
                              <td className="px-3 py-2">${item.Total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Container>
                  </Container>
                )}

              {/* Attachments Section */}
              <Container className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {translations.Attachments} (
                  {selectedRequisition.Attachments?.length || 0})
                </h3>
                {selectedRequisition.Attachments &&
                selectedRequisition.Attachments.length > 0 ? (
                  <Container className="space-y-2">
                    {selectedRequisition.Attachments.map(
                      (attachment, index) => (
                        <Container
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <Container className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {attachment.OriginalFileName || attachment.File}
                            </Span>
                          </Container>
                          <Span className="text-xs text-gray-500">
                            {formatDate(attachment.CreatedAt)}
                          </Span>
                        </Container>
                      )
                    )}
                  </Container>
                ) : (
                  <Span className="text-sm text-gray-500">
                    {translations["No attachments"]}
                  </Span>
                )}
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
            <Span>{translations["Delete Requisition"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteRequisition}
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
              permanently delete the requisition{" "}
              <strong>"{requisitionToDelete?.Number}"</strong> and all
              associated data.
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
                    {translations.Type}
                  </label>
                  <select
                    value={filterOptions.type}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{translations["All Types"]}</option>
                    <option value="Purchase">{translations.Purchase}</option>
                    <option value="Sale">{translations.Sale}</option>
                    <option value="Return">{translations.Return}</option>
                    <option value="Transfer">{translations.Transfer}</option>
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
                    <option value="Number">Requisition Number</option>
                    <option value="Type">Type</option>
                    <option value="Date">Requisition Date</option>
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

export default RequisitionList;
