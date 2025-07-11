import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Filter,
  Download,
  X,
  Calendar,
  BarChart3,
  Warehouse,
  Eye,
  Activity,
  FileText,
  Edit,
} from "lucide-react";
import { useStock } from "../../../Contexts/StockContext/StockContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../../components/elements/modal/Modal";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../../components/elements/table/Table";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const StockMovementsList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Stock Movements": language === "ar" ? "حركات المخزون" : "Stock Movements",
    "Add Transaction": language === "ar" ? "إضافة معاملة" : "Add Transaction",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No Movements": language === "ar" ? "لا توجد حركات" : "No movements found",
    Product: language === "ar" ? "المنتج" : "Product",
    Warehouse: language === "ar" ? "المستودع" : "Warehouse",
    "Movement Type": language === "ar" ? "نوع الحركة" : "Movement Type",
    Quantity: language === "ar" ? "الكمية" : "Quantity",
    Reference: language === "ar" ? "المرجع" : "Reference",
    Date: language === "ar" ? "التاريخ" : "Date",
    Notes: language === "ar" ? "ملاحظات" : "Notes",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    Total: language === "ar" ? "المجموع" : "Total",
    "In Stock": language === "ar" ? "في المخزون" : "In Stock",
    "Out of Stock": language === "ar" ? "نفد من المخزون" : "Out of Stock",
    "Low Stock": language === "ar" ? "مخزون منخفض" : "Low Stock",
    "Stock Value": language === "ar" ? "قيمة المخزون" : "Stock Value",
    View: language === "ar" ? "عرض" : "View",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "Movement Details":
      language === "ar" ? "تفاصيل الحركة" : "Movement Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Date From": language === "ar" ? "من تاريخ" : "Date From",
    "Date To": language === "ar" ? "إلى تاريخ" : "Date To",
    "All Types": language === "ar" ? "جميع الأنواع" : "All Types",
    "All Warehouses": language === "ar" ? "جميع المستودعات" : "All Warehouses",
    Products: language === "ar" ? "المنتجات" : "Products",
    Today: language === "ar" ? "اليوم" : "Today",
    "This Week": language === "ar" ? "هذا الأسبوع" : "This Week",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
  };

  // Get stock context
  const {
    stockMovements,
    loading: stockLoading,
    error,
    pagination,
    statistics,
    getStockMovements,
    getStockSummary,
    filterStockMovements,
    searchMovements,
    changePage,
    setFilters,
    clearFilters,
  } = useStock();

  // Process movements data from API response
  const movementsData = stockMovements?.Data?.$values || [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    dateFrom: "",
    dateTo: "",
    transactionType: "",
    warehouseId: null,
  });
  const [selectedMovements, setSelectedMovements] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([getStockMovements(), getStockSummary()]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token, getStockMovements, getStockSummary]);

  // Handle search when searchTerm changes (with debounce)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchMovements();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Handle filters change
  useEffect(() => {
    setSelectedMovements([]);
    setSelectAll(false);
  }, [movementsData]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Search function
  const handleSearchMovements = async () => {
    try {
      if (searchTerm.trim() === "") {
        await getStockMovements();
      } else {
        await searchMovements(searchTerm);
      }
    } catch (error) {
      console.error("Error searching movements:", error);
    }
  };

  // Movement selection
  const handleMovementSelection = (movementId) => {
    setSelectedMovements((prev) => {
      if (prev.includes(movementId)) {
        return prev.filter((id) => id !== movementId);
      } else {
        return [...prev, movementId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMovements([]);
    } else {
      const movementIds = Array.isArray(movementsData)
        ? movementsData.map((movement) => movement.Id)
        : [];
      setSelectedMovements(movementIds);
    }
    setSelectAll(!selectAll);
  };

  // Movement actions
  const handleViewMovement = (movement) => {
    setSelectedMovement(movement);
    setShowViewModal(true);
    // navigate(`/admin/stock/movements/${movement.Id}`);
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
      await filterStockMovements(filterOptions);
      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm("");
    setFilterOptions({
      dateFrom: "",
      dateTo: "",
      transactionType: "",
      warehouseId: null,
    });
    setShowFilters(false);

    try {
      await clearFilters();
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  // Export functionality
  const handleExport = () => {
    console.log(
      "Export movements:",
      selectedMovements.length > 0 ? selectedMovements : "all"
    );
    alert("Export functionality to be implemented");
  };

  // Format currency
  const formatCurrency = (value) => {
    const numValue = parseFloat(value) || 0;
    return numValue.toFixed(2);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get movement type icon and color
  const getMovementTypeStyle = (type) => {
    const lowerType = type?.toLowerCase() || "";

    if (
      lowerType.includes("in") ||
      lowerType.includes("purchase") ||
      lowerType.includes("adjustment +")
    ) {
      return {
        icon: TrendingUp,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        iconColor: "text-green-600",
      };
    } else if (
      lowerType.includes("out") ||
      lowerType.includes("sale") ||
      lowerType.includes("adjustment -")
    ) {
      return {
        icon: TrendingDown,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        iconColor: "text-red-600",
      };
    } else if (lowerType.includes("transfer")) {
      return {
        icon: ArrowUpDown,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        iconColor: "text-blue-600",
      };
    } else {
      return {
        icon: Activity,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        iconColor: "text-gray-600",
      };
    }
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
            {isCurrency ? `${formatCurrency(value)}` : value || 0}
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
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <Container className="flex items-center gap-4 mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {translations["Stock Movements"]}
            </h1>
            {selectedMovements.length > 0 && (
              <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedMovements.length} {translations.Selected}
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
              onClick={handleExport}
            />
            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Transaction"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/stock/transactions/new")}
            />

            <FilledButton
              isIcon={true}
              icon={FileText}
              iconSize="w-4 h-4"
              bgColor="bg-purple-600 hover:bg-purple-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText="View Report"
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/stock/movements/report")}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Products}`}
            value={statistics?.totalProducts || 0}
            icon={Package}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations["In Stock"]}
            value={statistics?.inStockProducts || 0}
            icon={TrendingUp}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations["Out of Stock"]}
            value={statistics?.outOfStockProducts || 0}
            icon={TrendingDown}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            title={translations["Stock Value"]}
            value={statistics?.totalStockValue || 0}
            icon={BarChart3}
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

        {/* Stock Movements Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {stockLoading ? (
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
                onClick={() => getStockMovements()}
              />
            </Container>
          ) : !Array.isArray(movementsData) || movementsData.length === 0 ? (
            <Container className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || Object.values(filterOptions).some((v) => v)
                  ? translations["No results found"]
                  : translations["No Movements"]}
              </h3>
              {(searchTerm || Object.values(filterOptions).some((v) => v)) && (
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
                        {translations.Product}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        {translations.Warehouse}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations["Movement Type"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations.Quantity}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations.Date}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movementsData.map((movement) => {
                      const typeStyle = getMovementTypeStyle(
                        movement.MovementType
                      );
                      const TypeIcon = typeStyle.icon;

                      return (
                        <tr key={movement.Id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedMovements.includes(movement.Id)}
                              onChange={() =>
                                handleMovementSelection(movement.Id)
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <Container>
                              <Container className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-gray-400" />
                                <Span className="text-sm font-medium text-gray-900">
                                  {movement.ProductName || "N/A"}
                                </Span>
                              </Container>
                              {movement.Reference && (
                                <Span className="text-sm text-gray-500 block">
                                  Ref: {movement.Reference}
                                </Span>
                              )}
                            </Container>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <Container className="flex items-center gap-1">
                              <Warehouse className="w-3 h-3 text-gray-400" />
                              <Span className="text-sm text-gray-900">
                                {movement.WarehouseName || "-"}
                              </Span>
                            </Container>
                          </td>
                          <td className="px-6 py-4">
                            <Container className="flex items-center gap-2">
                              <Container
                                className={`${typeStyle.bgColor} p-2 rounded-md`}
                              >
                                <TypeIcon
                                  className={`w-4 h-4 ${typeStyle.iconColor}`}
                                />
                              </Container>
                              <Container>
                                <Span
                                  className={`text-sm font-medium ${typeStyle.textColor}`}
                                >
                                  {movement.MovementType || "N/A"}
                                </Span>
                                {movement.Notes && (
                                  <Span className="text-xs text-gray-500 block truncate max-w-xs">
                                    {movement.Notes}
                                  </Span>
                                )}
                              </Container>
                            </Container>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <Span
                              className={`text-sm font-medium ${
                                movement.QuantityChange > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {movement.QuantityChange > 0 ? "+" : ""}
                              {movement.QuantityChange}
                            </Span>
                          </td>
                          <td className="px-6 py-4 hidden xl:table-cell">
                            <Container className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <Span className="text-sm text-gray-900">
                                {formatDate(movement.CreatedAt)}
                              </Span>
                            </Container>
                          </td>
                          <td className="px-6 py-4">
                            <Container className="flex justify-center gap-1">
                              {/* View Button */}
                              <button
                                onClick={() => handleViewMovement(movement)}
                                className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                title={translations.View}
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/stock/movements/${movement.Id}/edit`
                                  )
                                }
                                className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ml-1"
                                title="Edit"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </Container>
                          </td>
                        </tr>
                      );
                    })}
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

      {/* View Movement Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Movement Details"]}</Span>
          </Container>
        }
        width={700}
        cancelText={translations.Close}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedMovement && (
            <Container className="max-h-96 overflow-y-auto">
              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Movement Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Movement Information
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Product}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedMovement.ProductName || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Warehouse}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedMovement.WarehouseName || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Movement Type"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedMovement.MovementType || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Quantity}
                    </Span>
                    <Span
                      className={`text-sm font-medium block mt-1 ${
                        selectedMovement.QuantityChange > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedMovement.QuantityChange > 0 ? "+" : ""}
                      {selectedMovement.QuantityChange}
                    </Span>
                  </Container>
                </Container>

                {/* Additional Details */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Additional Details
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Reference}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedMovement.Reference || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Notes}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedMovement.Notes || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Date}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {formatDate(selectedMovement.CreatedAt)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      Created By User ID
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedMovement.CreatedByUserId || "N/A"}
                    </Span>
                  </Container>
                </Container>
              </Container>
            </Container>
          )
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
                    {translations["Date From"]}
                  </label>
                  <input
                    type="date"
                    value={filterOptions.dateFrom}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateFrom: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Date To"]}
                  </label>
                  <input
                    type="date"
                    value={filterOptions.dateTo}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateTo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Movement Type"]}
                  </label>
                  <select
                    value={filterOptions.transactionType}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        transactionType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{translations["All Types"]}</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Sale">Sale</option>
                    <option value="Transfer In">Transfer In</option>
                    <option value="Transfer Out">Transfer Out</option>
                    <option value="Stock Adjustment +">
                      Stock Adjustment +
                    </option>
                    <option value="Stock Adjustment -">
                      Stock Adjustment -
                    </option>
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Warehouse}
                  </label>
                  <select
                    value={filterOptions.warehouseId || ""}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        warehouseId: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{translations["All Warehouses"]}</option>
                    {/* TODO: Add warehouse options from API */}
                  </select>
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

export default StockMovementsList;
