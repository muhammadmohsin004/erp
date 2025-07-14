import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  List,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  X,
  Calendar,
  Package,
  Tags,
  BarChart3,
} from "lucide-react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineCopy,
  AiOutlineDelete,
} from "react-icons/ai";
import { usePriceList } from "../../../Contexts/PriceListContext/PriceListContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../../components/elements/modal/Modal";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../../components/elements/table/Table";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const PriceListList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Add Price List":
      language === "ar" ? "إضافة قائمة أسعار" : "Add Price List",
    "Price Lists": language === "ar" ? "قوائم الأسعار" : "Price Lists",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No Price Lists":
      language === "ar" ? "لا توجد قوائم أسعار" : "No price lists found",
    Name: language === "ar" ? "الاسم" : "Name",
    Description: language === "ar" ? "الوصف" : "Description",
    Status: language === "ar" ? "الحالة" : "Status",
    "Total Items": language === "ar" ? "إجمالي العناصر" : "Total Items",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    Active: language === "ar" ? "نشط" : "Active",
    Inactive: language === "ar" ? "غير نشط" : "Inactive",
    Total: language === "ar" ? "المجموع" : "Total",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    Copy: language === "ar" ? "نسخ" : "Copy",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Price List":
      language === "ar" ? "حذف قائمة الأسعار" : "Delete Price List",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Price List Details":
      language === "ar" ? "تفاصيل قائمة الأسعار" : "Price List Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "All Status": language === "ar" ? "جميع الحالات" : "All Status",
    "Created At": language === "ar" ? "تاريخ الإنشاء" : "Created At",
    "Updated At": language === "ar" ? "تاريخ التحديث" : "Updated At",
    "Basic Information":
      language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "No description": language === "ar" ? "لا يوجد وصف" : "No description",
    "No items": language === "ar" ? "لا توجد عناصر" : "No items",
    Item: language === "ar" ? "العنصر" : "Item",
    "Selling Price": language === "ar" ? "سعر البيع" : "Selling Price",
  };

  // Get price list context
  const {
    priceLists,
    loading,
    error,
    pagination,
    statistics,
    getPriceLists,
    getPriceList,
    deletePriceList,
    copyPriceList,
    getStatistics,
    searchPriceLists,
    filterPriceListsByStatus,
    sortPriceLists,
    changePage,
    setFilters,
    clearError,
  } = usePriceList();

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    sortBy: "CreatedAt",
    sortAscending: false,
  });
  const [selectedPriceLists, setSelectedPriceLists] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceList, setSelectedPriceList] = useState(null);
  const [priceListToDelete, setPriceListToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data only once
  useEffect(() => {
    const initializeData = async () => {
      if (token && !isInitialized) {
        try {
          await getPriceLists();
          await getStatistics();
          setIsInitialized(true);
        } catch (error) {
          console.error("Error initializing data:", error);
        }
      }
    };

    initializeData();
  }, [token]); // Only depend on token

  // Handle search with debounce
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() === "") {
        getPriceLists();
      } else {
        searchPriceLists(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isInitialized]);

  // Clear selection when data changes
  useEffect(() => {
    setSelectedPriceLists([]);
    setSelectAll(false);
  }, [priceLists]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Price list selection handlers
  const handlePriceListSelection = useCallback((priceListId) => {
    setSelectedPriceLists((prev) => {
      if (prev.includes(priceListId)) {
        return prev.filter((id) => id !== priceListId);
      } else {
        return [...prev, priceListId];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedPriceLists([]);
    } else {
      const priceListIds = Array.isArray(priceLists)
        ? priceLists.map((priceList) => priceList.Id)
        : [];
      setSelectedPriceLists(priceListIds);
    }
    setSelectAll(!selectAll);
  }, [selectAll, priceLists]);

  // Price list actions
  const handleViewPriceList = useCallback(
    async (priceListId) => {
      try {
        const priceListData = await getPriceList(priceListId);
        if (priceListData && priceListData.Data) {
          setSelectedPriceList(priceListData.Data);
          setShowViewModal(true);
        }
      } catch (error) {
        console.error("Error fetching price list details:", error);
        alert("Failed to fetch price list details");
      }
    },
    [getPriceList]
  );

  const handleEditPriceList = useCallback(
    async (priceListId) => {
      try {
        const priceListData = await getPriceList(priceListId);
        if (priceListData && priceListData.Data) {
          navigate("/admin/new-price-list", {
            state: {
              editData: priceListData.Data,
              isEditing: true,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching price list for edit:", error);
        alert("Failed to fetch price list details for editing");
      }
    },
    [getPriceList, navigate]
  );

  const handleCopyPriceList = useCallback(
    async (priceListId) => {
      try {
        const priceListData = await getPriceList(priceListId);
        if (priceListData && priceListData.Data) {
          navigate("/admin/new-price-list", {
            state: {
              cloneData: priceListData.Data,
              isCloning: true,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching price list for copy:", error);
        alert("Failed to fetch price list details for copying");
      }
    },
    [getPriceList, navigate]
  );
  const priceListsData = Array.isArray(priceLists) ? priceLists : [];

  const handleDeletePriceList = useCallback(
    (priceListId) => {
      const priceList = Array.isArray(priceLists)
        ? priceLists.find((pl) => pl.Id === priceListId)
        : null;
      if (priceList) {
        setPriceListToDelete(priceList);
        setShowDeleteModal(true);
      } else {
        alert("Price list not found");
      }
    },
    [priceLists]
  );

  const confirmDeletePriceList = useCallback(async () => {
    if (!priceListToDelete) return;

    setIsDeleting(true);
    try {
      await deletePriceList(priceListToDelete.Id);
      setShowDeleteModal(false);
      setPriceListToDelete(null);
      // Refresh data
      await getPriceLists();
      await getStatistics();
    } catch (error) {
      console.error("Error deleting price list:", error);
      alert("Failed to delete price list");
    } finally {
      setIsDeleting(false);
    }
  }, [priceListToDelete, deletePriceList, getPriceLists, getStatistics]);

  // Pagination handler
  const handlePageChange = useCallback(
    async (newPage) => {
      if (!pagination || newPage < 1 || newPage > pagination.TotalPages) return;

      try {
        await changePage(newPage);
      } catch (error) {
        console.error("Error changing page:", error);
      }
    },
    [pagination, changePage]
  );

  // Filter handlers
  const handleApplyFilters = useCallback(async () => {
    try {
      setFilters(filterOptions);
      if (filterOptions.status) {
        await filterPriceListsByStatus(filterOptions.status);
      }
      if (filterOptions.sortBy) {
        await sortPriceLists(filterOptions.sortBy, filterOptions.sortAscending);
      }
      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  }, [filterOptions, setFilters, filterPriceListsByStatus, sortPriceLists]);

  const handleClearFilters = useCallback(async () => {
    setSearchTerm("");
    setFilterOptions({
      status: "",
      sortBy: "CreatedAt",
      sortAscending: false,
    });
    setShowFilters(false);

    try {
      setFilters({
        searchTerm: "",
        status: "",
        sortBy: "CreatedAt",
        sortAscending: false,
      });
      await getPriceLists();
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  }, [setFilters, getPriceLists]);

  // Utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const getItemCount = useCallback((priceList) => {
    if (!priceList.Items) return 0;

    if (priceList.Items.$values) {
      return priceList.Items.$values.length;
    }

    if (Array.isArray(priceList.Items)) {
      return priceList.Items.length;
    }

    return 0;
  }, []);

  const getItemsArray = useCallback((priceList) => {
    if (!priceList.Items) return [];

    if (priceList.Items.$values) {
      return priceList.Items.$values;
    }

    if (Array.isArray(priceList.Items)) {
      return priceList.Items;
    }

    return [];
  }, []);

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

  // Filter function to apply all active filters
  const applyAllFilters = useCallback(() => {
    let filteredData = [...priceListsData];

    // Apply status filter
    if (filterOptions.status) {
      filteredData = filteredData.filter(
        (priceList) => priceList.Status === filterOptions.status
      );
    }

    // Apply sorting
    if (filterOptions.sortBy) {
      filteredData.sort((a, b) => {
        let comparison = 0;
        if (filterOptions.sortBy === "CreatedAt") {
          comparison =
            new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime();
        } else if (filterOptions.sortBy === "Name") {
          comparison = a.Name.localeCompare(b.Name);
        } else if (filterOptions.sortBy === "Status") {
          comparison = a.Status.localeCompare(b.Status);
        }

        return filterOptions.sortAscending ? comparison : -comparison;
      });
    }

    return filteredData;
  }, [priceListsData, filterOptions]);

  // Get filtered price lists
  const filteredPriceLists = applyAllFilters();

  // Function to export to CSV
  const handleExportToCSV = useCallback(() => {
    if (filteredPriceLists.length === 0) {
      alert(translations["No Price Lists to export"]);
      return;
    }

    // Prepare CSV headers
    const headers = [
      translations.Name,
      translations.Description,
      translations.Status,
      translations["Total Items"],
      translations["Created At"],
      translations["Updated At"],
    ];

    // Prepare CSV rows
    const rows = filteredPriceLists.map((priceList) => [
      `"${priceList.Name || ""}"`,
      `"${priceList.Description || ""}"`,
      `"${priceList.Status || ""}"`,
      `"${getItemCount(priceList)}"`,
      `"${formatDate(priceList.CreatedAt)}"`,
      `"${formatDate(priceList.UpdatedAt)}"`,
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
      `price_lists_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredPriceLists, translations]);

  // Function to export selected items to CSV
  const handleExportSelectedToCSV = useCallback(() => {
    if (selectedPriceLists.length === 0) {
      alert(translations["No items selected to export"]);
      return;
    }

    const selectedData = priceListsData.filter((priceList) =>
      selectedPriceLists.includes(priceList.Id)
    );

    // Prepare CSV headers
    const headers = [
      translations.Name,
      translations.Description,
      translations.Status,
      translations["Total Items"],
      translations["Created At"],
      translations["Updated At"],
    ];

    // Prepare CSV rows
    const rows = selectedData.map((priceList) => [
      `"${priceList.Name || ""}"`,
      `"${priceList.Description || ""}"`,
      `"${priceList.Status || ""}"`,
      `"${getItemCount(priceList)}"`,
      `"${formatDate(priceList.CreatedAt)}"`,
      `"${formatDate(priceList.UpdatedAt)}"`,
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
      `selected_price_lists_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedPriceLists, priceListsData, translations]);

  // Ensure priceLists is an array

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <Container className="flex items-center gap-4 mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {translations["Price Lists"]}
            </h1>
            {selectedPriceLists.length > 0 && (
              <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedPriceLists.length} {translations.Selected}
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
              onClick={() => {
                if (selectedPriceLists.length > 0) {
                  handleExportSelectedToCSV();
                } else {
                  handleExportToCSV();
                }
              }}
            />
            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Price List"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/new-price-list")}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={`${translations.Total} ${translations["Price Lists"]}`}
            value={statistics?.totalPriceLists || 0}
            icon={List}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations.Active}
            value={statistics?.activePriceLists || 0}
            icon={BarChart3}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations.Inactive}
            value={statistics?.inactivePriceLists || 0}
            icon={Package}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            title={`${translations.Total} ${translations.Items}`}
            value={statistics?.totalItems || 0}
            icon={Tags}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </Container>

        {/* Search Bar */}
        <Container className="mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
            <SearchAndFilters
              isFocused={false}
              searchValue={searchTerm}
              setSearchValue={setSearchTerm}
            />
          </Container>
        </Container>

        {/* Price List Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
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
                onClick={() => {
                  clearError();
                  getPriceLists();
                }}
              />
            </Container>
          ) : priceListsData.length === 0 ? (
            <Container className="text-center py-12">
              <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterOptions.status
                  ? translations["No results found"]
                  : translations["No Price Lists"]}
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
                        {translations.Description}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Status}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations["Total Items"]}
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
                    {priceListsData.map((priceList) => (
                      <tr key={priceList.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPriceLists.includes(priceList.Id)}
                            onChange={() =>
                              handlePriceListSelection(priceList.Id)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex items-center gap-2">
                            <List className="w-4 h-4 text-blue-500" />
                            <Span className="text-sm font-medium text-gray-900">
                              {priceList.Name || "N/A"}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Span className="text-sm text-gray-500 truncate max-w-xs block">
                            {priceList.Description ||
                              translations["No description"]}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              priceList.Status
                            )}`}
                          >
                            {translations[priceList.Status] || priceList.Status}
                          </Span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <Container className="flex items-center gap-1">
                            <Package className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {getItemCount(priceList)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <Container className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {formatDate(priceList.CreatedAt)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-1">
                            <button
                              onClick={() => handleViewPriceList(priceList.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                              title={translations.View}
                            >
                              <AiOutlineEye className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleEditPriceList(priceList.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                              title={translations.Edit}
                            >
                              <AiOutlineEdit className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleCopyPriceList(priceList.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
                              title={translations.Copy}
                            >
                              <AiOutlineCopy className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() =>
                                handleDeletePriceList(priceList.Id)
                              }
                              className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
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

      {/* View Price List Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Price List Details"]}</Span>
          </Container>
        }
        width={900}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          if (selectedPriceList?.Id) {
            handleEditPriceList(selectedPriceList.Id);
          }
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedPriceList && (
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
                      {selectedPriceList.Name || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Status}
                    </Span>
                    <Span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
                        selectedPriceList.Status
                      )}`}
                    >
                      {translations[selectedPriceList.Status] ||
                        selectedPriceList.Status}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Description}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedPriceList.Description ||
                        translations["No description"]}
                    </Span>
                  </Container>
                </Container>

                {/* Additional Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Additional Information
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Total Items"]}
                    </Span>
                    <Span className="text-sm font-medium text-blue-600 block mt-1">
                      {getItemCount(selectedPriceList)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Created At"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {formatDate(selectedPriceList.CreatedAt)}
                    </Span>
                  </Container>

                  {selectedPriceList.UpdatedAt && (
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Updated At"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {formatDate(selectedPriceList.UpdatedAt)}
                      </Span>
                    </Container>
                  )}
                </Container>
              </Container>

              {/* Items Section */}
              {getItemsArray(selectedPriceList).length > 0 && (
                <Container className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {translations.Items} ({getItemCount(selectedPriceList)})
                  </h3>
                  <Container className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">
                            {translations.Item}
                          </th>
                          <th className="px-3 py-2 text-left">
                            {translations["Selling Price"]}
                          </th>
                          <th className="px-3 py-2 text-left">
                            {translations.Description}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {getItemsArray(selectedPriceList).map((item, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2">
                              <Span className="text-sm font-medium text-gray-900">
                                {item.Item}
                              </Span>
                            </td>
                            <td className="px-3 py-2">
                              <Span className="text-sm text-green-600 font-medium">
                                {item.SellingPrice
                                  ? `${item.SellingPrice}`
                                  : "-"}
                              </Span>
                            </td>
                            <td className="px-3 py-2">
                              <Span className="text-sm text-gray-500">
                                {item.Description || "-"}
                              </Span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Container>
                </Container>
              )}

              {getItemCount(selectedPriceList) === 0 && (
                <Container className="mt-6 pt-4 border-t border-gray-200 text-center py-4">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <Span className="text-gray-500 text-sm">
                    {translations["No items"]}
                  </Span>
                </Container>
              )}
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
            <Span>{translations["Delete Price List"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeletePriceList}
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
              permanently delete the price list{" "}
              <strong>"{priceListToDelete?.Name}"</strong> and all associated
              items.
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
                    <option value="Name">Name</option>
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

export default PriceListList;
