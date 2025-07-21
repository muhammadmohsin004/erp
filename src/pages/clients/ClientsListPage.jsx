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
  MapPin,
  Edit,
  Eye,
  Trash2,
  Copy,
  RefreshCw,
  X,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  Download,
  ChevronDown
} from "lucide-react";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

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
    deleteClient
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
    "Next": language === "ar" ? "التالي" : "Next"
  }), [language]);

  // Local state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [selectedClients, setSelectedClients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [openActionMenus, setOpenActionMenus] = useState({});

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
      getClients({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters
      });
    } catch (error) {
      console.error("Delete failed:", error);
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

  // Get client initials for avatar
  const getClientInitials = (client) => {
    if (client.ClientType === "Business" && client.BusinessName) {
      return client.BusinessName.charAt(0).toUpperCase();
    }
    if (client.FullName) {
      const names = client.FullName.split(' ');
      return names.length > 1 ? names[0].charAt(0) + names[1].charAt(0) : names[0].charAt(0);
    }
    return client.FirstName ? client.FirstName.charAt(0).toUpperCase() : "C";
  };

  // Get avatar color based on client type
  const getAvatarColor = (client) => {
    if (client.ClientType === "Individual") {
      return "bg-blue-500";
    } else {
      return "bg-pink-500";
    }
  };

  // Get country code from country string
  const getCountryCode = (country) => {
    if (!country) return "";
    const match = country.match(/\(([^)]+)\)/);
    return match ? match[1] : country.slice(0, 2).toUpperCase();
  };

  // Get country color
  const getCountryColor = (country) => {
    if (!country) return "bg-gray-100 text-gray-600";
    const code = getCountryCode(country);
    const colors = {
      "SA": "bg-red-100 text-red-700",
      "US": "bg-blue-100 text-blue-700", 
      "AU": "bg-orange-100 text-orange-700",
      "AE": "bg-green-100 text-green-700",
      "GB": "bg-purple-100 text-purple-700"
    };
    return colors[code] || "bg-gray-100 text-gray-600";
  };

  // Client Row Component
  const ClientRow = React.memo(({ client, isSelected, onSelect }) => (
    <Container className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <Container className="px-4 py-4">
        <Container className="flex items-center gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(client.Id);
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />

          {/* Avatar and Client Info */}
          <Container className="flex items-center gap-3 flex-1 min-w-0">
            <Container className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(client)} shadow-sm`}>
              {getClientInitials(client)}
            </Container>
            
            <Container className="min-w-0 flex-1">
              <Container className="flex items-start flex-col gap-1">
                <Container className="flex items-center gap-2">
                  <h3 
                    className="font-semibold text-gray-900 text-base cursor-pointer hover:text-blue-600 transition-colors leading-tight"
                    onClick={() => navigate(`/admin/ViewClients-Details/${client.Id}`)}
                  >
                    {client.ClientType === "Business" ? client.BusinessName : client.FullName}
                  </h3>
                  {client.ClientType === "Business" && (
                    <Building className="w-4 h-4 text-gray-400" />
                  )}
                </Container>
                
                <Span className="text-sm text-gray-500 leading-tight">
                  {client.ClientType === "Business" ? 
                    `${client.FullName || client.FirstName + " " + client.LastName} #${client.CodeNumber || client.Id}` : 
                    `#${client.CodeNumber || client.Id}`
                  }
                </Span>
              </Container>
            </Container>
          </Container>

          {/* Contact Information */}
          <Container className="hidden lg:flex items-center gap-8 flex-1 max-w-md">
            {/* Phone Numbers - Horizontal Layout */}
            <Container className="flex items-center gap-4 min-w-0">
              {client.Mobile && (
                <Container className="flex items-center gap-1 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <Span className="text-sm font-medium">{client.Mobile}</Span>
                </Container>
              )}
              {client.Telephone && client.Telephone !== client.Mobile && (
                <Container className="flex items-center gap-1 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <Span className="text-sm">{client.Telephone}</Span>
                </Container>
              )}
            </Container>
          </Container>

          {/* Email */}
          <Container className="hidden xl:flex items-center flex-1 min-w-0 max-w-xs">
            {client.Email && (
              <Container className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Span className="text-sm text-gray-600 truncate">{client.Email}</Span>
              </Container>
            )}
          </Container>

          {/* Country Badge */}
          <Container className="hidden md:flex items-center">
            {client.Country && (
              <Span className={`text-xs font-semibold px-2 py-1 rounded ${getCountryColor(client.Country)}`}>
                {getCountryCode(client.Country)}
              </Span>
            )}
          </Container>

          {/* Category/Description */}
          <Container className="hidden lg:flex items-center flex-1 max-w-48">
            {client.Category && (
              <Span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium truncate">
                {client.Category.length > 20 ? client.Category.slice(0, 20) + "..." : client.Category}
              </Span>
            )}
          </Container>

          {/* Currency */}
          <Container className="hidden lg:flex items-center">
            {client.Currency && (
              <Span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {client.Currency}
              </Span>
            )}
          </Container>

          {/* Created By */}
          <Container className="hidden xl:flex items-center gap-2 min-w-max">
            <Span className="text-xs text-gray-500">By:</Span>
            <Container className="flex items-center gap-2">
              <Container className="w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">
                A
              </Container>
              <Span className="text-sm font-medium text-gray-700">Adnan Pro</Span>
            </Container>
          </Container>

          {/* Actions Menu */}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(client.Email || client.Mobile || client.FullName);
                      setOpenActionMenus({});
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Info
                  </button>
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
        </Container>
      </Container>
    </Container>
  ));

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
                <ChevronDown className="w-4 h-4 text-gray-400" />
                <Span className="text-sm font-medium text-gray-700">
                  {selectedClients.length > 0 
                    ? `${selectedClients.length} selected`
                    : `${((pagination.page - 1) * pagination.pageSize) + 1}-${Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of ${pagination.totalItems}`
                  }
                </Span>
              </Container>

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
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  showAdvancedFilters
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
                    setFilters({ search: "", clientType: "", category: "", currency: "", country: "" });
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

      {/* Content Header */}
      <Container className="bg-white border-b border-gray-200">
        <Container className="px-6 py-3">
          <Container className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Client
            </h3>
            <Container className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
              <Span className="text-sm font-medium text-gray-600">{translations.Sort}</Span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Clients List */}
      <Container className="bg-white">
        {loading ? (
          <Container className="p-6">
            <Container className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <Container key={index} className="flex items-center gap-4 py-4 animate-pulse">
                  <Container className="w-4 h-4 bg-gray-200 rounded"></Container>
                  <Container className="w-12 h-12 bg-gray-200 rounded-full"></Container>
                  <Container className="flex-1 space-y-2">
                    <Container className="h-4 bg-gray-200 rounded w-1/3"></Container>
                    <Container className="h-3 bg-gray-200 rounded w-1/4"></Container>
                  </Container>
                  <Container className="w-24 h-3 bg-gray-200 rounded"></Container>
                  <Container className="w-32 h-3 bg-gray-200 rounded"></Container>
                  <Container className="w-16 h-6 bg-gray-200 rounded"></Container>
                  <Container className="w-8 h-8 bg-gray-200 rounded"></Container>
                </Container>
              ))}
            </Container>
          </Container>
        ) : error ? (
          <Container className="text-center py-12">
            <Container className="text-red-600 mb-4">
              <Span>Error: {error}</Span>
            </Container>
            <FilledButton
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText="Retry"
              height="h-10"
              px="px-4"
              onClick={() => getClients({ page: pagination.page, ...filters })}
            />
          </Container>
        ) : clientsArray.length === 0 ? (
          <Container className="text-center py-16">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {translations["No clients found"]}
            </h3>
            <Span className="text-gray-500 mb-6">
              {filters.search || filters.clientType
                ? "Try adjusting your search or filters"
                : "Get started by adding your first client"}
            </Span>
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
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/new-clients")}
            />
          </Container>
        ) : (
          <Container className="divide-y divide-gray-100">
            {clientsArray.map((client) => (
              <ClientRow 
                key={client.Id} 
                client={client}
                isSelected={selectedClients.includes(client.Id)}
                onSelect={handleSelectClient}
              />
            ))}
          </Container>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Container className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
    </Container>
  );
};

export default ClientsListPage;