import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  Send,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Building,
  TrendingUp,
  TrendingDown,
  Settings,
  X,
  RefreshCcw,
} from "lucide-react";

// Context imports
import { useInvoices } from "../../Contexts/InvoiceContext/InvoiceContext";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
// Component imports
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";
import Modall from "../../components/elements/modal/Modal";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";

const InvoicesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Invoices": language === "ar" ? "الفواتير" : "Invoices",
    "Create Invoice": language === "ar" ? "إنشاء فاتورة" : "Create Invoice",
    "Search invoices...": language === "ar" ? "البحث في الفواتير..." : "Search invoices...",
    "Filter": language === "ar" ? "تصفية" : "Filter",
    "Status": language === "ar" ? "الحالة" : "Status",
    "All Statuses": language === "ar" ? "جميع الحالات" : "All Statuses",
    "Client": language === "ar" ? "العميل" : "Client",
    "All Clients": language === "ar" ? "جميع العملاء" : "All Clients",
    "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
    "Invoice Date": language === "ar" ? "تاريخ الفاتورة" : "Invoice Date",
    "Due Date": language === "ar" ? "تاريخ الاستحقاق" : "Due Date",
    "Amount": language === "ar" ? "المبلغ" : "Amount",
    "Actions": language === "ar" ? "الإجراءات" : "Actions",
    "View": language === "ar" ? "عرض" : "View",
    "Edit": language === "ar" ? "تعديل" : "Edit",
    "Clone": language === "ar" ? "نسخ" : "Clone",
    "Delete": language === "ar" ? "حذف" : "Delete",
    "Send": language === "ar" ? "إرسال" : "Send",
    "Download": language === "ar" ? "تحميل" : "Download",
    "Draft": language === "ar" ? "مسودة" : "Draft",
    "Sent": language === "ar" ? "مرسل" : "Sent",
    "Paid": language === "ar" ? "مدفوع" : "Paid",
    "Overdue": language === "ar" ? "متأخر" : "Overdue",
    "Voided": language === "ar" ? "ملغي" : "Voided",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No invoices found": language === "ar" ? "لم يتم العثور على فواتير" : "No invoices found",
    "Total Invoices": language === "ar" ? "إجمالي الفواتير" : "Total Invoices",
    "Total Amount": language === "ar" ? "إجمالي المبلغ" : "Total Amount",
    "Paid Amount": language === "ar" ? "المبلغ المدفوع" : "Paid Amount",
    "Outstanding": language === "ar" ? "المستحق" : "Outstanding",
    "Previous": language === "ar" ? "السابق" : "Previous",
    "Next": language === "ar" ? "التالي" : "Next",
    "Showing": language === "ar" ? "عرض" : "Showing",
    "of": language === "ar" ? "من" : "of",
    "results": language === "ar" ? "نتائج" : "results",
    "Clear Filters": language === "ar" ? "مسح المرشحات" : "Clear Filters",
    "Apply Filters": language === "ar" ? "تطبيق المرشحات" : "Apply Filters",
    "Export": language === "ar" ? "تصدير" : "Export",
    "Refresh": language === "ar" ? "تحديث" : "Refresh",
    "Settings": language === "ar" ? "الإعدادات" : "Settings",
    "Date Range": language === "ar" ? "نطاق التاريخ" : "Date Range",
    "From": language === "ar" ? "من" : "From",
    "To": language === "ar" ? "إلى" : "To",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "This action cannot be undone": language === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone",
    "Cancel": language === "ar" ? "إلغاء" : "Cancel",
    "Confirm": language === "ar" ? "تأكيد" : "Confirm",
    "Success": language === "ar" ? "نجح" : "Success",
    "Error": language === "ar" ? "خطأ" : "Error",
  };

  // Context hooks
  const {
    invoices,
    loading,
    error,
    pagination,
    statistics,
    getInvoices,
    searchInvoices,
    filterByStatus,
    filterByClient,
    deleteInvoice,
    sendInvoice,
    duplicateInvoice,
    getStatistics,
    setSearchTerm,
    setStatus,
    setClientId,
    setDateRange,
    resetFilters,
    goToPage,
    changePageSize,
    refreshInvoices,
    hasFilters,
    getActiveFiltersCount,
    getTotalInvoiceAmount,
    getTotalPaidAmount,
    getTotalOutstandingAmount,
  } = useInvoices();

  const {
    clients,
    getClients,
  } = useClients();

  // Local state
  const [searchTerm, setSearchTermLocal] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedClient, setSelectedClientLocal] = useState("");
  const [dateRange, setDateRangeLocal] = useState({ from: "", to: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [actionDropdown, setActionDropdown] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or table

  // Load data on mount
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([
          getInvoices(),
          getClients(),
          getStatistics(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [token]);

  // Handle search
  const handleSearch = async (value) => {
    setSearchTermLocal(value);
    if (value.trim()) {
      await searchInvoices(value);
    } else {
      await getInvoices();
    }
  };

  // Handle status filter
  const handleStatusFilter = async (status) => {
    setSelectedStatus(status);
    if (status) {
      await filterByStatus(status);
    } else {
      await getInvoices();
    }
  };

  // Handle client filter
  const handleClientFilter = async (clientId) => {
    setSelectedClientLocal(clientId);
    if (clientId) {
      await filterByClient(clientId);
    } else {
      await getInvoices();
    }
  };

  // Handle date range filter
  const handleDateRangeFilter = async () => {
    if (dateRange.from && dateRange.to) {
      await setDateRange(dateRange.from, dateRange.to);
      await getInvoices();
    }
  };

  // Clear all filters
  const handleClearFilters = async () => {
    setSearchTermLocal("");
    setSelectedStatus("");
    setSelectedClientLocal("");
    setDateRangeLocal({ from: "", to: "" });
    await resetFilters();
    await getInvoices();
  };

  // Handle actions
  const handleView = (invoice) => {
    navigate(`/admin/invoices/${invoice.Id}`);
  };

  const handleEdit = (invoice) => {
    navigate(`/admin/invoices/edit/${invoice.Id}`, {
      state: { editData: invoice, isEditing: true }
    });
  };

  const handleClone = (invoice) => {
    navigate("/admin/invoices/new", {
      state: {
        cloneData: {
          ...invoice,
          InvoiceNumber: `${invoice.InvoiceNumber}-Copy`,
          Id: undefined,
          Status: "Draft",
        }
      }
    });
  };

  const handleDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (invoiceToDelete) {
      try {
        await deleteInvoice(invoiceToDelete.Id);
        setShowDeleteModal(false);
        setInvoiceToDelete(null);
        // Show success message
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const handleSend = async (invoice) => {
    try {
      await sendInvoice(invoice.Id);
      // Show success message
    } catch (error) {
      console.error("Error sending invoice:", error);
    }
  };

  // Handle bulk actions
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedInvoices(invoices.map(invoice => invoice.Id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId, checked) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <FileText className="w-4 h-4" />,
        };
      case 'sent':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Send className="w-4 h-4" />,
        };
      case 'paid':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case 'overdue':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="w-4 h-4" />,
        };
      case 'voided':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <XCircle className="w-4 h-4" />,
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <Span className="text-blue-500 text-lg ml-4">{translations.Loading}</Span>
      </Container>
    );
  }


  console.log('invoices================>>>>', invoices)

  return (
    <Container className="min-h-screen bg-gray-50">
      <Container className="px-6 py-6">
        {/* Header */}
        <Container className="flex items-center justify-between mb-6">
          <Container>
            <h1 className="text-2xl font-bold text-gray-900">
              {translations.Invoices}
            </h1>
            <Span className="text-sm text-gray-500">
              {translations.Showing} {invoices.length} {translations.of} {pagination.totalItems} {translations.results}
            </Span>
          </Container>

          <Container className="flex gap-3">
            <FilledButton
              isIcon={true}
              icon={RefreshCcw}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Refresh}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={refreshInvoices}
            />

            <FilledButton
              isIcon={true}
              icon={Settings}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Settings}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => {/* Handle settings */}}
            />

            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Create Invoice"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/invoices/new")}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Total Invoices"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {statistics.totalInvoices || 0}
                </Span>
              </Container>
              <Container className="bg-blue-100 rounded-full p-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </Container>
            </Container>
          </Container>

          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Total Amount"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {formatCurrency(statistics.totalRevenue || 0)}
                </Span>
              </Container>
              <Container className="bg-green-100 rounded-full p-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </Container>
            </Container>
          </Container>

          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Paid Amount"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {formatCurrency(statistics.totalRevenue || 0)}
                </Span>
              </Container>
              <Container className="bg-green-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </Container>
            </Container>
          </Container>

          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations.Outstanding}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {formatCurrency(statistics.outstandingAmount || 0)}
                </Span>
              </Container>
              <Container className="bg-orange-100 rounded-full p-3">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </Container>
            </Container>
          </Container>
        </Container>

        {/* Filters */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <Container className="flex items-center justify-between mb-4">
            <Container className="flex items-center gap-4">
              {/* Search */}
              <Container className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={translations["Search invoices..."]}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{translations["All Statuses"]}</option>
                <option value="Draft">{translations.Draft}</option>
                <option value="Sent">{translations.Sent}</option>
                <option value="Paid">{translations.Paid}</option>
                <option value="Overdue">{translations.Overdue}</option>
                <option value="Voided">{translations.Voided}</option>
              </select>

              {/* Client Filter */}
              <select
                value={selectedClient}
                onChange={(e) => handleClientFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{translations["All Clients"]}</option>
                {clients.map((client) => (
                  <option key={client.Id} value={client.Id}>
                    {client.FullName || client.BusinessName}
                  </option>
                ))}
              </select>

              {/* Date Range */}
              <Container className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRangeLocal({ ...dateRange, from: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Span className="text-gray-500">to</Span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRangeLocal({ ...dateRange, to: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FilledButton
                  isIcon={true}
                  icon={Filter}
                  iconSize="w-4 h-4"
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText=""
                  height="h-10"
                  width="w-10"
                  onClick={handleDateRangeFilter}
                />
              </Container>
            </Container>

            {/* Clear Filters */}
            {hasFilters() && (
              <FilledButton
                isIcon={true}
                icon={X}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText={translations["Clear Filters"]}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={handleClearFilters}
              />
            )}
          </Container>
        </Container>

        {/* Invoices Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <Container className="px-6 py-4 border-b border-gray-200">
            <Container className="flex items-center justify-between">
              <Container className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedInvoices.length === invoices.length && invoices.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Span className="text-sm font-medium text-gray-700">
                  {selectedInvoices.length > 0 ? `${selectedInvoices.length} selected` : "Select all"}
                </Span>
              </Container>

              {selectedInvoices.length > 0 && (
                <Container className="flex items-center gap-2">
                  <FilledButton
                    isIcon={true}
                    icon={Send}
                    iconSize="w-4 h-4"
                    bgColor="bg-blue-600 hover:bg-blue-700"
                    textColor="text-white"
                    rounded="rounded-lg"
                    buttonText="Send Selected"
                    height="h-9"
                    px="px-3"
                    fontWeight="font-medium"
                    fontSize="text-sm"
                    isIconLeft={true}
                    onClick={() => {/* Handle bulk send */}}
                  />
                  <FilledButton
                    isIcon={true}
                    icon={Trash2}
                    iconSize="w-4 h-4"
                    bgColor="bg-red-600 hover:bg-red-700"
                    textColor="text-white"
                    rounded="rounded-lg"
                    buttonText="Delete Selected"
                    height="h-9"
                    px="px-3"
                    fontWeight="font-medium"
                    fontSize="text-sm"
                    isIconLeft={true}
                    onClick={() => {/* Handle bulk delete */}}
                  />
                </Container>
              )}
            </Container>
          </Container>

          {/* Table Content */}
          <Container className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations["Invoice Number"]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.Client}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations["Invoice Date"]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations["Due Date"]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.Status}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.Amount}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.Actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => {
                  const statusDisplay = getStatusDisplay(invoice.Status);
                  return (
                    <tr key={invoice.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.Id)}
                          onChange={(e) => handleSelectInvoice(invoice.Id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container className="flex items-center gap-3">
                          <Container className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </Container>
                          <Container>
                            <Span className="text-sm font-medium text-gray-900">
                              {invoice.InvoiceNumber}
                            </Span>
                          </Container>
                        </Container>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container className="flex items-center gap-2">
                          <Container className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-600" />
                          </Container>
                          <Container>
                            <Span className="text-sm font-medium text-gray-900">
                              {invoice.ClientName}
                            </Span>
                            <Span className="text-xs text-gray-500 block">
                              {invoice.ClientEmail}
                            </Span>
                          </Container>
                        </Container>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Span className="text-sm text-gray-900">
                          {formatDate(invoice.InvoiceDate)}
                        </Span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Span className="text-sm text-gray-900">
                          {invoice.DueDate ? formatDate(invoice.DueDate) : "-"}
                        </Span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                          {statusDisplay.icon}
                          {invoice.Status}
                        </Span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container>
                          <Span className="text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.TotalAmount, invoice.Currency)}
                          </Span>
                          {invoice.PaidAmount > 0 && (
                            <Span className="text-xs text-green-600 block">
                              {formatCurrency(invoice.PaidAmount, invoice.Currency)} paid
                            </Span>
                          )}
                        </Container>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container className="flex items-center gap-2">
                          <OutlineButton
                            isIcon={true}
                            icon={Eye}
                            iconSize="w-4 h-4"
                            bgColor="bg-gray-100 hover:bg-gray-200"
                            textColor="text-gray-700"
                            rounded="rounded-lg"
                            buttonText=""
                            height="h-8"
                            width="w-8"
                            onClick={() => handleView(invoice)}
                          />
                          <OutlineButton
                            isIcon={true}
                            icon={Edit}
                            iconSize="w-10 h-10"
                            bgColor="bg-blue-100 hover:bg-blue-200"
                            textColor="text-blue-700"
                            rounded="rounded-lg"
                            buttonText=""

                            height="h-8"
                            width="w-8"
                            onClick={() => handleEdit(invoice)}
                          />
                          <Container className="relative">
                            <OutlineButton
                              isIcon={true}
                              icon={MoreVertical}
                              iconSize="w-4 h-4"
                              bgColor="bg-gray-100 hover:bg-gray-200"
                              textColor="text-gray-700"
                              rounded="rounded-lg"
                              buttonText=""
                              height="h-8"
                              width="w-8"
                              onClick={() => setActionDropdown(actionDropdown === invoice.Id ? null : invoice.Id)}
                            />
                            {actionDropdown === invoice.Id && (
                              <Container className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <Container className="py-1">
                                  <button
                                    onClick={() => { handleClone(invoice); setActionDropdown(null); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Copy className="w-4 h-4" />
                                    {translations.Clone}
                                  </button>
                                  {invoice.Status !== 'Sent' && (
                                    <button
                                      onClick={() => { handleSend(invoice); setActionDropdown(null); }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Send className="w-4 h-4" />
                                      {translations.Send}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => { /* Handle download */ setActionDropdown(null); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Download className="w-4 h-4" />
                                    {translations.Download}
                                  </button>
                                  <hr className="my-1" />
                                  <button
                                    onClick={() => { handleDelete(invoice); setActionDropdown(null); }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    {translations.Delete}
                                  </button>
                                </Container>
                              </Container>
                            )}
                          </Container>
                        </Container>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Container>

          {/* Empty State */}
          {invoices.length === 0 && (
            <Container className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {translations["No invoices found"]}
              </h3>
              <Span className="text-gray-500 mb-4">
                Get started by creating your first invoice.
              </Span>
              <FilledButton
                isIcon={true}
                icon={Plus}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={translations["Create Invoice"]}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => navigate("/admin/invoices/new")}
              />
            </Container>
          )}
        </Container>

        {/* Pagination */}
        {invoices.length > 0 && (
          <Container className="flex items-center justify-between mt-6">
            <Container className="flex items-center gap-2">
              <Span className="text-sm text-gray-700">
                {translations.Showing} {((pagination.page - 1) * pagination.pageSize) + 1} to{" "}
                {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} {translations.of}{" "}
                {pagination.totalItems} {translations.results}
              </Span>
            </Container>

            <Container className="flex items-center gap-2">
              <FilledButton
                isIcon={true}
                icon={ChevronLeft}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText={translations.Previous}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.HasPreviousPage}
              />

              <Container className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === pagination.page;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </Container>

              <FilledButton
                isIcon={true}
                icon={ChevronRight}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText={translations.Next}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.HasNextPage}
              />
            </Container>
          </Container>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modall
        modalOpen={showDeleteModal}
        setModalOpen={setShowDeleteModal}
        title={
          <Container className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <Span>Delete Invoice</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDelete}
        cancelAction={() => setShowDeleteModal(false)}
        body={
          <Container className="text-center py-4">
            <Container className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </Container>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {translations["Are you sure?"]}
            </h3>
            <Span className="text-gray-500 mb-4 block">
              {translations["This action cannot be undone"]}. This will permanently delete the invoice{" "}
              <strong>"{invoiceToDelete?.InvoiceNumber}"</strong> and all associated data.
            </Span>
          </Container>
        }
      />
    </Container>
  );
};

export default InvoicesList;