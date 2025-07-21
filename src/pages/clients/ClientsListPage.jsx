import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  User,
  Building,
  Mail,
  Phone,
  Edit,
  Eye,
  Trash2,
  Copy,
  RefreshCw,
  Check,
  Ban,
  AlertCircle,
  Download
} from "lucide-react";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";
import Table from "../../components/elements/table/Table";
import Thead from "../../components/elements/thead/Thead";
import TR from "../../components/elements/tr/TR";
import TH from "../../components/elements/th/TH";
import Tbody from "../../components/elements/tbody/Tbody";
import TD from "../../components/elements/td/TD";
import Dropdown from "../../components/elements/dropdown/Dropdown";
import Pagination from "../../components/elements/Pagination/Pagination";
import Badge from "../../components/elements/Badge/Badge";
import { toast } from "react-toastify";

const ClientsListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const {
    clients: clientsResponse,
    loading,
    error,
    pagination,
    filters,
    getClients,
    setFilters,
    setPagination,
    deleteClient,
    updateClientStatus
  } = useClients();

  // Extract clients array from response
  const clientsArray = React.useMemo(() => {
    if (!clientsResponse) return [];

    if (Array.isArray(clientsResponse)) {
      return clientsResponse;
    }

    if (clientsResponse.Data && Array.isArray(clientsResponse.Data.$values)) {
      return clientsResponse.Data.$values;
    }

    if (Array.isArray(clientsResponse.$values)) {
      return clientsResponse.$values;
    }

    return [];
  }, [clientsResponse]);

  const translations = React.useMemo(() => ({
    "All Clients": language === "ar" ? "جميع العملاء" : "All Clients",
    "Add Client": language === "ar" ? "إضافة عميل" : "Add Client",
    "Search & Filters": language === "ar" ? "البحث والفلاتر" : "Search & Filters",
    "Search by name": language === "ar" ? "البحث بالاسم" : "Name",
    "Search": language === "ar" ? "بحث" : "Search",
    "Advanced": language === "ar" ? "متقدم" : "Advanced",
    "Hide": language === "ar" ? "إخفاء" : "Hide",
    "Client Type": language === "ar" ? "نوع العميل" : "Client",
    "All Types": language === "ar" ? "جميع الأنواع" : "All Types",
    "Individual": language === "ar" ? "فردي" : "Individual",
    "Business": language === "ar" ? "تجاري" : "Business",
    "Category": language === "ar" ? "الفئة" : "Category",
    "Currency": language === "ar" ? "العملة" : "Currency",
    "Country": language === "ar" ? "البلد" : "Country",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    "Sort": language === "ar" ? "ترتيب" : "Sort",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No clients found": language === "ar" ? "لم يتم العثور على عملاء" : "No clients found",
    "View": language === "ar" ? "عرض" : "View",
    "Edit": language === "ar" ? "تعديل" : "Edit",
    "Delete": language === "ar" ? "حذف" : "Delete",
    "Clone": language === "ar" ? "نسخ" : "Clone",
    "Showing": language === "ar" ? "عرض" : "Showing",
    "of": language === "ar" ? "من" : "of",
    "Previous": language === "ar" ? "السابق" : "Previous",
    "Next": language === "ar" ? "التالي" : "Next",
    "Approve": language === "ar" ? "موافقة" : "Approve",
    "Reject": language === "ar" ? "رفض" : "Reject",
    "Active": language === "ar" ? "نشط" : "Active",
    "Inactive": language === "ar" ? "غير نشط" : "Inactive",
    "Pending": language === "ar" ? "قيد الانتظار" : "Pending",
    "Client Name": language === "ar" ? "اسم العميل" : "Client Name",
    "Email": language === "ar" ? "البريد الإلكتروني" : "Email",
    "Phone": language === "ar" ? "الهاتف" : "Phone",
    "Type": language === "ar" ? "النوع" : "Type",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Last Activity": language === "ar" ? "آخر نشاط" : "Last Activity",
    "Actions": language === "ar" ? "الإجراءات" : "Actions"
  }), [language]);

  // Local state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [selectedClients, setSelectedClients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [openActionMenus, setOpenActionMenus] = useState({});
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [clientToUpdateStatus, setClientToUpdateStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Initialize from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const clientType = searchParams.get("type") || "";

    setLocalSearch(search);
    setFilters({ search, clientType });
    setPagination({ page });
  }, []);

  // Fetch clients when filters or pagination change
  useEffect(() => {
    if (token || localStorage.getItem("token")) {
      getClients({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters
      });
    }
  }, [pagination.page, pagination.pageSize, filters, token]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (pagination.page > 1) params.set("page", pagination.page);
    if (filters.search) params.set("search", filters.search);
    if (filters.clientType) params.set("type", filters.clientType);

    setSearchParams(params);
  }, [pagination.page, filters, setSearchParams]);

  // Handle search
  const handleSearch = useCallback((searchTerm) => {
    setFilters({ search: searchTerm });
    setPagination({ page: 1 });
  }, [setFilters, setPagination]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters({ [filterName]: value });
    setPagination({ page: 1 });
  }, [setFilters, setPagination]);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setPagination({ page: newPage });
    window.scrollTo(0, 0);
  }, [setPagination]);

  // Handle delete
  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
    setOpenActionMenus({});
  };

  const confirmDelete = async () => {
    try {
      await deleteClient(clientToDelete.Id);
      setShowDeleteModal(false);
      setClientToDelete(null);
      toast.success("Client deleted successfully");
      getClients({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete client");
    }
  };

  // Handle status change
  const handleStatusChangeClick = (client, status) => {
    setClientToUpdateStatus(client);
    setNewStatus(status);
    setShowStatusModal(true);
    setOpenActionMenus({});
  };

  const confirmStatusChange = async () => {
    try {
      await updateClientStatus(clientToUpdateStatus.Id, newStatus);
      setShowStatusModal(false);
      setClientToUpdateStatus(null);
      setNewStatus("");
      toast.success(`Client status updated to ${newStatus}`);
      getClients({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters
      });
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update client status");
    }
  };

  // Toggle action menu
  const toggleActionMenu = (clientId, event) => {
    event.stopPropagation();
    setOpenActionMenus(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "danger";
      case "Pending":
        return "warning";
      default:
        return "info";
    }
  };

  // Close action menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionMenus({});
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Select all functionality
  const isAllSelected = clientsArray.length > 0 && selectedClients.length === clientsArray.length;
  const isIndeterminate = selectedClients.length > 0 && selectedClients.length < clientsArray.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clientsArray.map(client => client.Id));
    }
  };

  const handleSelectClient = (clientId) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  // Bulk actions
  const handleBulkStatusChange = async (status) => {
    if (selectedClients.length === 0) {
      toast.warning("No clients selected");
      return;
    }

    try {
      for (const clientId of selectedClients) {
        await updateClientStatus(clientId, status);
      }
      toast.success(`Updated ${selectedClients.length} clients to ${status}`);
      setSelectedClients([]);
      getClients({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters
      });
    } catch (error) {
      console.error("Bulk status update failed:", error);
      toast.error("Failed to update some clients");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedClients.length === 0) {
      toast.warning("No clients selected");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedClients.length} clients? This action cannot be undone.`)) {
      return;
    }

    try {
      for (const clientId of selectedClients) {
        await deleteClient(clientId);
      }
      toast.success(`Deleted ${selectedClients.length} clients`);
      setSelectedClients([]);
      getClients({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters
      });
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast.error("Failed to delete some clients");
    }
  };

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Container className="bg-white border-b border-gray-200">
        <Container className="px-6 py-4">
          <Container className="flex items-center justify-between">
            <Container className="flex items-center gap-6">
              {/* Checkbox and Selection Info */}
              <Container className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={checkbox => {
                    if (checkbox) checkbox.indeterminate = isIndeterminate;
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Span className="text-sm font-medium text-gray-700">
                  {selectedClients.length > 0
                    ? `${selectedClients.length} selected`
                    : `${((pagination.page - 1) * pagination.pageSize) + 1}-${Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of ${pagination.totalItems}`
                  }
                </Span>
              </Container>

              {/* Bulk Actions */}
              {selectedClients.length > 0 && (
                <Container className="flex items-center gap-2">
                  <Dropdown
                    buttonText="Change Status"
                    buttonClassName="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
                    items={[
                      { label: "Set to Active", action: () => handleBulkStatusChange("Active") },
                      { label: "Set to Inactive", action: () => handleBulkStatusChange("Inactive") },
                      { label: "Set to Pending", action: () => handleBulkStatusChange("Pending") }
                    ]}
                    onSelect={(item) => item.action()}
                  />
                  <button
                    onClick={handleBulkDelete}
                    className="text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                </Container>
              )}

              {/* Pagination Controls */}
              <Container className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <Span className="text-sm font-medium text-gray-700 px-2">
                  Page {pagination.page} of {pagination.totalPages}
                </Span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Container>
            </Container>

            {/* Right side actions */}
            <Container className="flex items-center gap-3">
              <button
                onClick={() => getClients({ page: pagination.page, ...filters })}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <FilledButton
                isIcon={true}
                icon={Plus}
                iconSize="w-4 h-4"
                bgColor="bg-purple-600 hover:bg-purple-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={translations["Add Client"]}
                height="h-10"
                px="px-4"
                fontWeight="font-semibold"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => navigate("/admin/new-clients")}
              />
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Search & Filters */}
      <Container className="bg-white border-b border-gray-200">
        <Container className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {translations["Search & Filters"]}
          </h3>

          <Container className="flex items-center gap-4">
            {/* Client Type Filter */}
            <Container className="relative">
              <select
                value={filters.clientType || ""}
                onChange={(e) => handleFilterChange("clientType", e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-32"
              >
                <option value="">{translations["Client Type"]}</option>
                <option value="Individual">{translations.Individual}</option>
                <option value="Business">{translations.Business}</option>
              </select>
            </Container>

            {/* Status Filter */}
            <Container className="relative">
              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-32"
              >
                <option value="">All Statuses</option>
                <option value="Active">{translations.Active}</option>
                <option value="Inactive">{translations.Inactive}</option>
                <option value="Pending">{translations.Pending}</option>
              </select>
            </Container>

            {/* Search Input */}
            <Container className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(localSearch)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </Container>

            {/* Right side buttons */}
            <Container className="flex items-center gap-3 ml-auto">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${showAdvancedFilters
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Filter className="w-4 h-4" />
                {showAdvancedFilters ? translations.Hide : translations.Advanced}
              </button>

              <FilledButton
                bgColor="bg-purple-600 hover:bg-purple-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={translations.Search}
                height="h-10"
                px="px-6"
                fontWeight="font-semibold"
                fontSize="text-sm"
                onClick={() => handleSearch(localSearch)}
              />
            </Container>
          </Container>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <Container className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <Container className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Category}
                  </label>
                  <input
                    type="text"
                    value={filters.category || ""}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Currency}
                  </label>
                  <select
                    value={filters.currency || ""}
                    onChange={(e) => handleFilterChange("currency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Currencies</option>
                    <option value="USD">USD</option>
                    <option value="SAR">SAR</option>
                    <option value="AED">AED</option>
                    <option value="EUR">EUR</option>
                    <option value="PKR">PKR</option>
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Country}
                  </label>
                  <input
                    type="text"
                    value={filters.country || ""}
                    onChange={(e) => handleFilterChange("country", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </Container>
              </Container>

              <Container className="flex items-center gap-3 mt-4">
                <FilledButton
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText="Apply Filters"
                  height="h-9"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={() => console.log("Apply filters")}
                />

                <button
                  onClick={() => {
                    setFilters({ search: "", clientType: "", status: "", category: "", currency: "", country: "" });
                    setLocalSearch("");
                    setPagination({ page: 1 });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {translations["Clear All"]}
                </button>
              </Container>
            </Container>
          )}
        </Container>
      </Container>

      

      {/* Clients Table */}
      <Container className="bg-white rounded-lg border border-gray-200 mx-6 my-6 overflow-hidden">
        <Container className="bg-white rounded-lg border border-gray-200 mx-6 my-6 overflow-x-auto">
          <Table>
            <Thead className="bg-gray-50">
              <TR>
                <TH>{translations["Client Name"]}</TH>
                <TH>{translations.Email}</TH>
                <TH>{translations.Phone}</TH>
                <TH>{translations.Type}</TH>
                <TH>{translations.Status}</TH>
                <TH>{translations["Last Activity"]}</TH>
                <TH>{translations.Actions}</TH>
              </TR>
            </Thead>
            <Tbody>
              {loading ? (
                <TR>
                  <TD colSpan={7} className="py-8 text-center">
                    <Container className="flex justify-center">
                      <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                    </Container>
                  </TD>
                </TR>
              ) : error ? (
                <TR>
                  <TD colSpan={7} className="py-12 text-center">
                    <Container className="flex flex-col items-center gap-4">
                      <AlertCircle className="w-12 h-12 text-red-400" />
                      <Span className="text-lg font-medium text-gray-700">
                        Error loading clients
                      </Span>
                      <Span className="text-sm text-gray-500 mb-4">
                        {error.message || "Failed to load clients"}
                      </Span>
                      <FilledButton
                        bgColor="bg-blue-600 hover:bg-blue-700"
                        textColor="text-white"
                        buttonText="Retry"
                        onClick={() => getClients({ page: pagination.page, ...filters })}
                      />
                    </Container>
                  </TD>
                </TR>
              ) : clientsArray.length === 0 ? (
                <TR>
                  <TD colSpan={7} className="py-16 text-center">
                    <Container className="flex flex-col items-center gap-4">
                      <User className="w-12 h-12 text-gray-300" />
                      <Span className="text-lg font-medium text-gray-500">
                        {translations["No clients found"]}
                      </Span>
                      <Span className="text-sm text-gray-400">
                        {filters.search || filters.clientType
                          ? "Try adjusting your search or filters"
                          : "Get started by adding your first client"}
                      </Span>
                      <FilledButton
                        isIcon={true}
                        icon={Plus}
                        iconSize="w-4 h-4"
                        bgColor="bg-blue-600 hover:bg-blue-700"
                        textColor="text-white"
                        buttonText={translations["Add Client"]}
                        onClick={() => navigate("/admin/new-clients")}
                      />
                    </Container>
                  </TD>
                </TR>
              ) : (
                clientsArray.map((client) => (
                  <TR key={client.Id} className="hover:bg-gray-50">
                    <TD className="whitespace-nowrap">
                      <Container className="flex items-center gap-3">
                        <Container className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${client.ClientType === "Individual" ? "bg-blue-500" : "bg-pink-500"
                          }`}>
                          {client.ClientType === "Business" && client.BusinessName
                            ? client.BusinessName.charAt(0).toUpperCase()
                            : client.FullName
                              ? client.FullName.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
                              : "C"}
                        </Container>
                        <Container>
                          <Span className="font-medium text-gray-900 block">
                            {client.ClientType === "Business" ? client.BusinessName : client.FullName}
                          </Span>
                          <Span className="text-sm text-gray-500">
                            #{client.CodeNumber || client.Id}
                          </Span>
                        </Container>
                      </Container>
                    </TD>
                    <TD className="whitespace-nowrap">
                      <Span className="text-gray-600">
                        {client.Email || "-"}
                      </Span>
                    </TD>
                    <TD className="whitespace-nowrap">
                      <Span className="text-gray-600">
                        {client.Mobile || client.Telephone || "-"}
                      </Span>
                    </TD>
                    <TD className="whitespace-nowrap">
                      <Badge variant="info">
                        {client.ClientType === "Business"
                          ? translations.Business
                          : translations.Individual}
                      </Badge>
                    </TD>
                    <TD className="whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(client.Status)}>
                        {translations[client.Status] || client.Status}
                      </Badge>
                    </TD>
                    <TD className="whitespace-nowrap">
                      <Span className="text-sm text-gray-500">
                        {client.UpdatedAt
                          ? new Date(client.UpdatedAt).toLocaleDateString()
                          : "-"}
                      </Span>
                    </TD>
                    <TD className="whitespace-nowrap">
                      <Container className="relative">
                        <button
                          onClick={(e) => toggleActionMenu(client.Id, e)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        {openActionMenus[client.Id] && (
                          <Container className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <Container className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/admin/ViewClients-Details/${client.Id}`);
                                  setOpenActionMenus({});
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                {translations.View}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate("/admin/new-clients", {
                                    state: { editData: client, isEditing: true }
                                  });
                                  setOpenActionMenus({});
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                {translations.Edit}
                              </button>

                              {client.Status !== "Active" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChangeClick(client, "Active");
                                    setOpenActionMenus({});
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                >
                                  <Check className="w-4 h-4" />
                                  {translations.Approve}
                                </button>
                              )}

                              {client.Status !== "Inactive" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChangeClick(client, "Inactive");
                                    setOpenActionMenus({});
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Ban className="w-4 h-4" />
                                  {translations.Reject}
                                </button>
                              )}

                              <hr className="my-1" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(client);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                {translations.Delete}
                              </button>
                            </Container>
                          </Container>
                        )}
                      </Container>
                    </TD>
                  </TR>
                ))
              )}
            </Tbody>
          </Table>

          {pagination.totalPages > 1 && (
            <Container className="px-6 py-4 border-t border-gray-200">
              <Container className="flex items-center justify-between">
                <Span className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} entries
                </Span>
                <Container className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {translations.Previous}
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {translations.Next}
                  </button>
                </Container>
              </Container>
            </Container>
          )}
        </Container>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Container className="px-6 py-4 border-t border-gray-200">
            <Container className="flex items-center justify-between">
              <Span className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} entries
              </Span>
              <Container className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {translations.Previous}
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {translations.Next}
                </button>
              </Container>
            </Container>
          </Container>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Container className="fixed inset-0  flex items-center justify-center z-50">
          <Container className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Client
            </h3>
            <Span className="text-gray-600 mb-6 block">
              Are you sure you want to delete "{clientToDelete?.FullName || clientToDelete?.BusinessName}"?
              This action cannot be undone.
            </Span>
            <Container className="flex justify-end gap-3">
              <FilledButton
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText="Cancel"
                height="h-10"
                px="px-4"
                onClick={() => setShowDeleteModal(false)}
              />
              <FilledButton
                bgColor="bg-red-600 hover:bg-red-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText="Delete"
                height="h-10"
                px="px-4"
                onClick={confirmDelete}
              />
            </Container>
          </Container>
        </Container>
      )}

      {/* Status Change Confirmation Modal */}
      {showStatusModal && (
        <Container className="fixed inset-0  flex items-center justify-center z-50">
          <Container className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {newStatus === "Active" ? "Approve Client" : "Deactivate Client"}
            </h3>
            <Span className="text-gray-600 mb-6 block">
              Are you sure you want to {newStatus === "Active" ? "approve" : "deactivate"} "
              {clientToUpdateStatus?.FullName || clientToUpdateStatus?.BusinessName}"?
            </Span>
            <Container className="flex justify-end gap-3">
              <FilledButton
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText="Cancel"
                height="h-10"
                px="px-4"
                onClick={() => setShowStatusModal(false)}
              />
              <FilledButton
                bgColor={newStatus === "Active" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={newStatus === "Active" ? "Approve" : "Deactivate"}
                height="h-10"
                px="px-4"
                onClick={confirmStatusChange}
              />
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default ClientsListPage;