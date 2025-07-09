import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Settings,
  User,
  MoreVertical,
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
  Search,
  Filter,
  Download,
  X,
  FileText,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../components/elements/modal/Modal";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../components/elements/table/Table";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const ClientList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Add Client": language === "ar" ? "إضافة عميل" : "Add Client",
    Clients: language === "ar" ? "العملاء" : "Clients",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    NoClients: language === "ar" ? "لا يوجد عملاء" : "No clients found",
    Name: language === "ar" ? "الاسم" : "Name",
    Email: language === "ar" ? "البريد الإلكتروني" : "Email",
    Phone: language === "ar" ? "الهاتف" : "Phone",
    Location: language === "ar" ? "الموقع" : "Location",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    Individual: language === "ar" ? "فردي" : "Individual",
    Business: language === "ar" ? "تجاري" : "Business",
    Total: language === "ar" ? "المجموع" : "Total",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Client": language === "ar" ? "حذف العميل" : "Delete Client",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Client Details": language === "ar" ? "تفاصيل العميل" : "Client Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Client Type": language === "ar" ? "نوع العميل" : "Client Type",
    "Business Name": language === "ar" ? "اسم النشاط التجاري" : "Business Name",
    Address: language === "ar" ? "العنوان" : "Address",
    "VAT Number": language === "ar" ? "الرقم الضريبي" : "VAT Number",
    "Code Number": language === "ar" ? "رقم الكود" : "Code Number",
    Notes: language === "ar" ? "ملاحظات" : "Notes",
    "All Types": language === "ar" ? "جميع الأنواع" : "All Types",
    Country: language === "ar" ? "البلد" : "Country",
    City: language === "ar" ? "المدينة" : "City",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
  };

  // Get clients context
  const {
    clients,
    isLoading: clientsLoading,
    error,
    pagination,
    statistics,
    getClients,
    getClient,
    deleteClient,
    getStatistics,
  } = useClients();

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    clientType: "",
    country: "",
    city: "",
    sortBy: "CreatedAt",
    sortAscending: false,
  });
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch clients on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getClients();
        await getStatistics();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token]);

  // Handle search when searchTerm changes (with debounce)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchClients();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Handle filters change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        await getClients({
          page: 1,
          searchTerm: searchTerm,
          ...filterOptions,
        });
      } catch (error) {
        console.error("Error applying filters:", error);
      }
    };

    // Only apply filters if any filter is set
    if (filterOptions.clientType || filterOptions.country || filterOptions.city || 
        filterOptions.sortBy !== "CreatedAt" || filterOptions.sortAscending) {
      applyFilters();
    }
  }, [filterOptions]);

  // Reset selections when clients change
  useEffect(() => {
    setSelectedClients([]);
    setSelectAll(false);
  }, [clients]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Search function
  const handleSearchClients = async () => {
    try {
      await getClients({
        page: 1,
        searchTerm: searchTerm,
        ...filterOptions,
      });
    } catch (error) {
      console.error("Error searching clients:", error);
    }
  };

  // Client selection
  const handleClientSelection = (clientId) => {
    setSelectedClients((prev) => {
      if (prev.includes(clientId)) {
        return prev.filter((id) => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      const clientIds = Array.isArray(clients) ? clients.map((client) => client.Id) : [];
      setSelectedClients(clientIds);
    }
    setSelectAll(!selectAll);
  };

  // Client actions
  const handleViewClient = async (clientId) => {
    try {
      const clientData = await getClient(clientId);
      if (clientData && clientData.data) {
        setSelectedClient(clientData.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
      alert("Failed to fetch client details");
    }
  };

  const handleEditClient = (clientId) => {
    navigate(`/admin/new-clients`, {
      state: {
        editData: clients.find(c => c.Id === clientId),
        isEditing: true
      }
    });
  };

  const handleCloneClient = async (clientId) => {
    try {
      const clientData = await getClient(clientId);
      if (clientData && clientData.data) {
        navigate("/admin/new-clients", {
          state: {
            cloneData: {
              ...clientData.data,
              FullName: `${clientData.data.FullName || ''} (Copy)`,
              Email: "",
              CodeNumber: "",
              Id: undefined,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error cloning client:", error);
      alert("Failed to clone client");
    }
  };

  const handleDeleteClient = (clientId) => {
    const client = Array.isArray(clients)
      ? clients.find((c) => c.Id === clientId)
      : null;
    if (client) {
      setClientToDelete(client);
      setShowDeleteModal(true);
    } else {
      alert("Client not found");
    }
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      await deleteClient(clientToDelete.Id);
      setShowDeleteModal(false);
      setClientToDelete(null);
      // Refresh the client list
      await getClients({
        searchTerm: searchTerm,
        ...filterOptions,
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete client");
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination
  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    try {
      await getClients({
        page: newPage,
        searchTerm: searchTerm,
        ...filterOptions,
      });
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };

  // Filter functions
  const handleApplyFilters = async () => {
    try {
      await getClients({
        page: 1,
        searchTerm: searchTerm,
        ...filterOptions,
      });
      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm("");
    setFilterOptions({
      clientType: "",
      country: "",
      city: "",
      sortBy: "CreatedAt",
      sortAscending: false,
    });
    setShowFilters(false);
    
    try {
      await getClients({ page: 1 });
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  // Export functionality
  const handleExport = () => {
    console.log(
      "Export clients:",
      selectedClients.length > 0 ? selectedClients : "all"
    );
    alert("Export functionality to be implemented");
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
              {translations.Clients}
            </h1>
            {selectedClients.length > 0 && (
              <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedClients.length} {translations.Selected}
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
              buttonText={translations["Add Client"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/new-clients")}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Clients}`}
            value={statistics?.totalClients || 0}
            icon={Users}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations.Individual}
            value={statistics?.individualClients || 0}
            icon={User}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations.Business}
            value={statistics?.businessClients || 0}
            icon={Building}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            title={translations["This Month"]}
            value={statistics?.clientsThisMonth || 0}
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

        {/* Client Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {clientsLoading ? (
            <Container className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <Span className="text-blue-500 text-lg block mt-4">
                {translations.Loading}
              </Span>
            </Container>
          ) : error ? (
            <Container className="text-center py-12">
              <Span className="text-red-500 text-lg block mb-4">Error: {error}</Span>
              <FilledButton
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText="Retry"
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => getClients()}
              />
            </Container>
          ) : !Array.isArray(clients) || clients.length === 0 ? (
            <Container className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ||
                filterOptions.clientType ||
                filterOptions.country ||
                filterOptions.city
                  ? translations["No results found"]
                  : translations.NoClients}
              </h3>
              {(searchTerm ||
                filterOptions.clientType ||
                filterOptions.country ||
                filterOptions.city) && (
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
                        {translations["Client Type"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Name}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        {translations.Email}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations.Phone}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations.Location}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                      <tr key={client.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.Id)}
                            onChange={() => handleClientSelection(client.Id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              client.ClientType === "Individual"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {translations[client.ClientType] ||
                              client.ClientType}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Container>
                            <Span className="text-sm font-medium text-gray-900">
                              {client.ClientType === "Business"
                                ? client.BusinessName ||
                                  client.FullName ||
                                  "N/A"
                                : client.FullName || "N/A"}
                            </Span>
                            {client.ClientType === "Business" &&
                              client.FullName &&
                              client.BusinessName && (
                                <Span className="text-sm text-gray-500 block">
                                  {client.FullName}
                                </Span>
                              )}
                            {client.CodeNumber && (
                              <Span className="text-sm text-gray-500 block">
                                Code: {client.CodeNumber}
                              </Span>
                            )}
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {client.Email ? (
                            <a
                              href={`mailto:${client.Email}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {client.Email}
                            </a>
                          ) : (
                            <Span className="text-sm text-gray-500">-</Span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          {client.Mobile || client.Telephone ? (
                            <Container>
                              {client.Mobile && (
                                <Container>
                                  <a
                                    href={`tel:${client.Mobile}`}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                  >
                                    {client.Mobile}
                                  </a>
                                  <Span className="text-xs text-gray-500">
                                    {" "}
                                    (Mobile)
                                  </Span>
                                </Container>
                              )}
                              {client.Telephone && (
                                <Container>
                                  <a
                                    href={`tel:${client.Telephone}`}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                  >
                                    {client.Telephone}
                                  </a>
                                  <Span className="text-xs text-gray-500">
                                    {" "}
                                    (Tel)
                                  </Span>
                                </Container>
                              )}
                            </Container>
                          ) : (
                            <Span className="text-sm text-gray-500">-</Span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          {client.City || client.Country ? (
                            <Container className="flex items-center">
                              <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                              <Span className="text-sm text-gray-900">
                                {[client.City, client.Country]
                                  .filter(Boolean)
                                  .join(", ")}
                              </Span>
                            </Container>
                          ) : (
                            <Span className="text-sm text-gray-500">-</Span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-2">
                            <FilledButton
                              isIcon={true}
                              icon={Eye}
                              iconSize="w-4 h-4"
                              bgColor="bg-blue-600 hover:bg-blue-700"
                              textColor="text-white"
                              rounded="rounded-md"
                              buttonText=""
                              height="h-8"
                              width="w-8"
                              onClick={() => handleViewClient(client.Id)}
                            />
                            <FilledButton
                              isIcon={true}
                              icon={Edit}
                              iconSize="w-4 h-4"
                              bgColor="bg-green-600 hover:bg-green-700"
                              textColor="text-white"
                              rounded="rounded-md"
                              buttonText=""
                              height="h-8"
                              width="w-8"
                              onClick={() => handleEditClient(client.Id)}
                            />
                            <FilledButton
                              isIcon={true}
                              icon={Copy}
                              iconSize="w-4 h-4"
                              bgColor="bg-yellow-600 hover:bg-yellow-700"
                              textColor="text-white"
                              rounded="rounded-md"
                              buttonText=""
                              height="h-8"
                              width="w-8"
                              onClick={() => handleCloneClient(client.Id)}
                            />
                            <FilledButton
                              isIcon={true}
                              icon={Trash2}
                              iconSize="w-4 h-4"
                              bgColor="bg-red-600 hover:bg-red-700"
                              textColor="text-white"
                              rounded="rounded-md"
                              buttonText=""
                              height="h-8"
                              width="w-8"
                              onClick={() => handleDeleteClient(client.Id)}
                            />
                          </Container>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Container className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                  <Span className="text-sm text-gray-500">
                    {translations.Showing}{" "}
                    {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
                    {Math.min(
                      pagination.page * pagination.pageSize,
                      pagination.totalItems
                    )}{" "}
                    {translations.Of} {pagination.totalItems}{" "}
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
                      disabled={pagination.page === 1}
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
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    />
                    <Span className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center">
                      {pagination.page} / {pagination.totalPages}
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
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.page + 1)}
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
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.totalPages)}
                    />
                  </Container>
                </Container>
              )}
            </>
          )}
        </Container>
      </Container>

      {/* View Client Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Client Details"]}</Span>
          </Container>
        }
        width={800}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditClient(selectedClient?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedClient && (
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <Container className="space-y-4">
                <Container>
                  <Span className="text-sm font-medium text-gray-500">
                    {translations["Client Type"]}
                  </Span>
                  <Span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedClient.ClientType === "Individual"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {translations[selectedClient.ClientType] ||
                      selectedClient.ClientType}
                  </Span>
                </Container>

                {selectedClient.ClientType === "Individual" ? (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Name}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedClient.FullName || "N/A"}
                    </Span>
                  </Container>
                ) : (
                  <>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Business Name"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedClient.BusinessName || "N/A"}
                      </Span>
                    </Container>
                    {selectedClient.FullName && (
                      <Container>
                        <Span className="text-sm font-medium text-gray-500">
                          Contact Person
                        </Span>
                        <Span className="text-sm text-gray-900 block mt-1">
                          {selectedClient.FullName}
                        </Span>
                      </Container>
                    )}
                  </>
                )}

                {selectedClient.CodeNumber && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Code Number"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedClient.CodeNumber}
                    </Span>
                  </Container>
                )}

                {selectedClient.Email && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Email}
                    </Span>
                    <a
                      href={`mailto:${selectedClient.Email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 block mt-1"
                    >
                      {selectedClient.Email}
                    </a>
                  </Container>
                )}

                {(selectedClient.Mobile || selectedClient.Telephone) && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Phone}
                    </Span>
                    <Container className="mt-1">
                      {selectedClient.Mobile && (
                        <Container>
                          <a
                            href={`tel:${selectedClient.Mobile}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {selectedClient.Mobile}
                          </a>
                          <Span className="text-xs text-gray-500"> (Mobile)</Span>
                        </Container>
                      )}
                      {selectedClient.Telephone && (
                        <Container>
                          <a
                            href={`tel:${selectedClient.Telephone}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {selectedClient.Telephone}
                          </a>
                          <Span className="text-xs text-gray-500"> (Telephone)</Span>
                        </Container>
                      )}
                    </Container>
                  </Container>
                )}
              </Container>

              <Container className="space-y-4">
                {(selectedClient.StreetAddress1 ||
                  selectedClient.City ||
                  selectedClient.Country) && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Address}
                    </Span>
                    <Container className="mt-1">
                      {selectedClient.StreetAddress1 && (
                        <Span className="text-sm text-gray-900 block">
                          {selectedClient.StreetAddress1}
                        </Span>
                      )}
                      {selectedClient.StreetAddress2 && (
                        <Span className="text-sm text-gray-900 block">
                          {selectedClient.StreetAddress2}
                        </Span>
                      )}
                      <Span className="text-sm text-gray-900 block">
                        {[
                          selectedClient.City,
                          selectedClient.State,
                          selectedClient.PostalCode,
                          selectedClient.Country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Span>
                    </Container>
                  </Container>
                )}

                {selectedClient.VatNumber && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["VAT Number"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedClient.VatNumber}
                    </Span>
                  </Container>
                )}

                {selectedClient.Currency && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      Currency
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedClient.Currency}
                    </Span>
                  </Container>
                )}

                {selectedClient.Category && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      Category
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedClient.Category}
                    </Span>
                  </Container>
                )}

                {selectedClient.InvoicingMethod && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      Invoicing Method
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedClient.InvoicingMethod}
                    </Span>
                  </Container>
                )}
              </Container>

              {selectedClient.Notes && (
                <Container className="md:col-span-2">
                  <Span className="text-sm font-medium text-gray-500">
                    {translations.Notes}
                  </Span>
                  <Span className="text-sm text-gray-900 block mt-1">
                    {selectedClient.Notes}
                  </Span>
                </Container>
              )}

              {/* Contacts Section */}
              {selectedClient.Contacts &&
                Array.isArray(selectedClient.Contacts.$values) &&
                selectedClient.Contacts.$values.length > 0 && (
                  <Container className="md:col-span-2">
                    <Span className="text-sm font-medium text-gray-500 mb-2 block">
                      Additional Contacts
                    </Span>
                    <Container className="border border-gray-200 rounded-lg p-4 space-y-3">
                      {selectedClient.Contacts.$values.map((contact, index) => (
                        <Container
                          key={contact.Id || index}
                          className={index > 0 ? "border-t border-gray-200 pt-3" : ""}
                        >
                          <Container className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <Container>
                              <Span className="text-sm font-medium text-gray-900">
                                {[contact.FirstName, contact.LastName]
                                  .filter(Boolean)
                                  .join(" ")}
                              </Span>
                            </Container>
                            <Container>
                              {contact.Email && (
                                <a
                                  href={`mailto:${contact.Email}`}
                                  className="text-sm text-blue-600 hover:text-blue-800 block"
                                >
                                  {contact.Email}
                                </a>
                              )}
                              {(contact.Mobile || contact.Telephone) && (
                                <Span className="text-xs text-gray-500">
                                  {contact.Mobile && `Mobile: ${contact.Mobile}`}
                                  {contact.Mobile && contact.Telephone && " | "}
                                  {contact.Telephone && `Tel: ${contact.Telephone}`}
                                </Span>
                              )}
                            </Container>
                          </Container>
                        </Container>
                      ))}
                    </Container>
                  </Container>
                )}

              {/* Attachments Section */}
              {selectedClient.Attachments &&
                Array.isArray(selectedClient.Attachments.$values) &&
                selectedClient.Attachments.$values.length > 0 && (
                  <Container className="md:col-span-2">
                    <Span className="text-sm font-medium text-gray-500 mb-2 block">
                      Attachments
                    </Span>
                    <Container className="flex flex-wrap gap-2">
                      {selectedClient.Attachments.$values.map((attachment, index) => (
                        <Container
                          key={attachment.Id || index}
                          className="border border-gray-200 rounded-lg p-2 flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 text-gray-400" />
                          <Span className="text-sm text-gray-900">
                            {attachment.File || "Attachment"}
                          </Span>
                        </Container>
                      ))}
                    </Container>
                  </Container>
                )}

              <Container className="md:col-span-2 pt-4 border-t border-gray-200">
                <Container className="text-xs text-gray-500 space-y-1">
                  <Container>
                    Created: {selectedClient.CreatedAt ? new Date(selectedClient.CreatedAt).toLocaleDateString() : "N/A"}
                  </Container>
                  {selectedClient.UpdatedAt && (
                    <Container>
                      Updated: {new Date(selectedClient.UpdatedAt).toLocaleDateString()}
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
            <Span>{translations["Delete Client"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteClient}
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
              {translations["This action cannot be undone"]}. This will permanently
              delete the client{" "}
              <strong>
                "{clientToDelete?.FullName || clientToDelete?.BusinessName}"
              </strong>{" "}
              and all associated data.
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
                    {translations["Client Type"]}
                  </label>
                  <select
                    value={filterOptions.clientType}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        clientType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{translations["All Types"]}</option>
                    <option value="Individual">{translations.Individual}</option>
                    <option value="Business">{translations.Business}</option>
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Country}
                  </label>
                  <input
                    type="text"
                    placeholder={`${translations.Search} ${translations.Country}...`}
                    value={filterOptions.country}
                    onChange={(e) =>
                      setFilterOptions({ ...filterOptions, country: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.City}
                  </label>
                  <input
                    type="text"
                    placeholder={`${translations.Search} ${translations.City}...`}
                    value={filterOptions.city}
                    onChange={(e) =>
                      setFilterOptions({ ...filterOptions, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filterOptions.sortBy}
                    onChange={(e) =>
                      setFilterOptions({ ...filterOptions, sortBy: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="CreatedAt">Date Created</option>
                    <option value="FullName">Name</option>
                    <option value="BusinessName">Business Name</option>
                    <option value="Email">Email</option>
                    <option value="ClientType">Client Type</option>
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
                    <Span className="ml-2 text-sm text-gray-700">Sort Ascending</Span>
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

export default ClientList;