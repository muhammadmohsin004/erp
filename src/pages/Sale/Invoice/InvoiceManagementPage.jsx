import React, { useState, useEffect } from "react";
import { useInvoices } from "../../../Contexts/InvoiceContext/InvoiceContext";
import { useClients } from "../../../Contexts/apiClientContext/apiClientContext";
import {
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Send,
  DollarSign,
  User,
  Calendar,
  FileText,
  Clock,
  Printer,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';


const InvoiceManagementPage = () => {
  // Destructure with fallbacks to prevent crashes
  const navigate = useNavigate();

  const {
    invoices = [],
    loading = false,
    error = null,
    pagination = { page: 1, pageSize: 25, totalItems: 0, totalPages: 0 },
    searchTerm = "",
    status = "",
    clientId = null,
    statistics = {
      totalInvoices: 0,
      paidInvoices: 0,
      draftInvoices: 0,
      sentInvoices: 0,
      overdueInvoices: 0,
    },
    getInvoices,
    setSearchTerm,
    setStatus,
    setClientId,
    resetFilters,
    goToPage,
    changePageSize,
    refreshInvoices,
    getStatistics,
    sendInvoice,
    markInvoiceAsPaid,
    voidInvoice,
    deleteInvoice,
    duplicateInvoice,
    sortBy = "InvoiceNumber",
    sortAscending = false,
    setSort,
  } = useInvoices() || {};

  const {
    clients = [],
    loading: clientsLoading = false,
    getClients,
  } = useClients() || {};

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [localInvoiceNo, setLocalInvoiceNo] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedClient, setSelectedClient] = useState(clientId || "");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });

  // Get current user info
  const getCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        name:
          user.Name || user.FirstName + " " + user.LastName || "Unknown User",
        id: user.Id || "Unknown ID",
      };
    } catch {
      return { name: "Unknown User", id: "Unknown ID" };
    }
  };

  const currentUser = getCurrentUser();

  // Navigation handlers
  const handleInvoiceClick = (invoiceId, event) => {
    // Prevent navigation if clicking on action menu or its children
    if (event && (
      event.target.closest('.action-menu') || 
      event.target.closest('[data-action-menu]')
    )) {
      return;
    }
    navigate(`/admin/showinvoices/Details/${invoiceId}`);
  };

  const handleCreateNewInvoice = () => {
    navigate('/admin/showinvoices/create');
  };

  // Dynamic status tabs with real counts
  const statusTabs = [
    {
      key: "",
      label: "All",
      count: statistics.totalInvoices,
      color: "bg-slate-100 text-slate-700",
    },
    {
      key: "Overdue",
      label: "Overdue",
      count: statistics.overdueInvoices,
      color: "bg-red-50 text-red-600",
    },
    {
      key: "Due",
      label: "Due",
      count: invoices.filter((inv) => {
        const today = new Date();
        const dueDate = new Date(inv.DueDate);
        return inv.Status !== "Paid" && dueDate <= today && dueDate >= today;
      }).length,
      color: "bg-orange-50 text-orange-600",
    },
    {
      key: "Sent",
      label: "Unpaid",
      count: statistics.sentInvoices,
      color: "bg-blue-50 text-blue-600",
    },
    {
      key: "Draft",
      label: "Draft",
      count: statistics.draftInvoices,
      color: "bg-gray-50 text-gray-600",
    },
    {
      key: "Paid",
      label: "Paid",
      count: statistics.paidInvoices,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("Loading initial invoice data...");

        // Load invoices and statistics in parallel
        const invoicePromises = [getInvoices(), getStatistics()];

        // Load clients if the function exists
        if (getClients && typeof getClients === "function") {
          invoicePromises.push(getClients({ pageSize: 100 }));
        }

        await Promise.all(invoicePromises);
        console.log("Initial data loaded successfully");
      } catch (error) {
        console.error("Failed to load initial data:", error);
        // Don't break the component if data loading fails
      }
    };

    loadInitialData();
  }, []); // Empty dependency array - we want this to run once on mount

  // Get client names for dropdown
  const clientOptions = React.useMemo(() => {
    if (!clients || !Array.isArray(clients)) return [];

    return clients.map((client) => ({
      id: client.Id,
      name:
        client.FullName ||
        client.BusinessName ||
        `${client.FirstName || ""} ${client.LastName || ""}`.trim() ||
        "Unnamed Client",
      company: client.BusinessName || null,
    }));
  }, [clients]);

  const handleSearch = async () => {
    if (!getInvoices) return;

    try {
      if (localSearchTerm !== searchTerm && setSearchTerm) {
        setSearchTerm(localSearchTerm);
      }

      if (selectedClient !== clientId && setClientId) {
        setClientId(selectedClient || null);
      }

      await getInvoices({
        search: localSearchTerm,
        clientId: selectedClient || null,
        invoiceNumber: localInvoiceNo,
        page: 1,
      });
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleReset = async () => {
    if (!resetFilters || !getInvoices) return;

    setLocalSearchTerm("");
    setLocalInvoiceNo("");
    setSelectedClient("");
    setDateRange({ start: "", end: "" });
    setAmountRange({ min: "", max: "" });

    try {
      await resetFilters();
      await getInvoices();
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  const handleStatusTab = async (statusKey) => {
    if (!setStatus || !getInvoices) return;

    try {
      setStatus(statusKey);
      await getInvoices({ status: statusKey, page: 1 });
    } catch (error) {
      console.error("Status filter failed:", error);
    }
  };

  const handleSort = async (field) => {
    if (!setSort || !getInvoices) return;

    const newOrder = sortBy === field && sortAscending ? false : true;
    try {
      setSort(field, newOrder);
      await getInvoices({ sortBy: field, sortAscending: newOrder, page: 1 });
    } catch (error) {
      console.error("Sort failed:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatCurrencyAmount = (amount, currency = "USD") => {
    if (!amount || isNaN(amount)) return "$0.00";
    const numAmount = Number(amount);
    const symbol =
      currency === "USD" ? "$" : currency === "PKR" ? "Rs. " : `${currency} `;
    return `${symbol}${numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadge = (invoiceStatus) => {
    const statusStyles = {
      Draft: "bg-gray-100 text-gray-700 border-gray-200",
      Sent: "bg-blue-100 text-blue-700 border-blue-200",
      Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Overdue: "bg-red-100 text-red-700 border-red-200",
      Voided: "bg-gray-100 text-gray-500 border-gray-200",
      Partial: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          statusStyles[invoiceStatus] || statusStyles["Draft"]
        }`}
      >
        {invoiceStatus}
      </span>
    );
  };

  const getClientName = (invoice) => {
    // First check if invoice has client name directly
    if (invoice.ClientName) return invoice.ClientName;
    if (invoice.FullName) return invoice.FullName;
    if (invoice.BusinessName) return invoice.BusinessName;

    // Then look in clientOptions
    const client = clientOptions.find((c) => c.id === invoice.ClientId);
    if (client) return client.name;

    // Fallback to client ID
    return `Client #${invoice.ClientId || "Unknown"}`;
  };

  const getInvoiceDescription = (invoice) => {
    if (invoice.Notes) return invoice.Notes;
    if (invoice.Items && invoice.Items.length > 0) {
      return invoice.Items.map(
        (item) => item.Description || item.ItemName || "Item"
      ).join(", ");
    }
    return "No description available";
  };

  const handleInvoiceAction = async (action, invoiceId, invoice, event) => {
    // Stop event propagation to prevent card click
    if (event) {
      event.stopPropagation();
    }

    try {
      switch (action) {
        case "view":
          navigate(`/admin/showinvoices/Details/${invoiceId}`);
          break;
        case "edit":
          navigate(`/admin/showinvoices/edit/${invoiceId}`);
          break;
        case "send":
          if (sendInvoice) {
            await sendInvoice(invoiceId, {
              to: invoice.ClientEmail || "",
              subject: `Invoice ${invoice.InvoiceNumber}`,
              message: "Please find attached invoice.",
            });
          }
          break;
        case "markPaid":
          if (markInvoiceAsPaid) {
            await markInvoiceAsPaid(invoiceId, {
              amount: invoice.TotalAmount,
              paymentDate: new Date().toISOString(),
              paymentMethod: "Manual",
            });
          }
          break;
        case "void":
          if (
            voidInvoice &&
            window.confirm("Are you sure you want to void this invoice?")
          ) {
            await voidInvoice(invoiceId, {
              reason: "Manual void",
              voidDate: new Date().toISOString(),
            });
          }
          break;
        case "duplicate":
          if (duplicateInvoice) {
            await duplicateInvoice(invoiceId, {
              newInvoiceDate: new Date().toISOString(),
              copyNotes: true,
            });
          }
          break;
        case "delete":
          if (
            deleteInvoice &&
            window.confirm(
              "Are you sure you want to delete this invoice? This action cannot be undone."
            )
          ) {
            await deleteInvoice(invoiceId);
          }
          break;
        default:
          console.log("Unknown action:", action);
      }
      setShowActionMenu(null);

      // Refresh data if functions are available
      if (refreshInvoices) await refreshInvoices();
      if (getStatistics) await getStatistics();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const isOverdue = (invoice) => {
    if (invoice.Status === "Paid" || !invoice.DueDate) return false;
    return new Date(invoice.DueDate) < new Date();
  };

  // Early return if contexts are not available
  if (!getInvoices) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 font-medium mb-2">
            Invoice Context Not Available
          </div>
          <div className="text-gray-500 text-sm">
            Please ensure the InvoiceProvider is properly configured.
          </div>
        </div>
      </div>
    );
  }

  if (loading && invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading invoices...</span>
      </div>
    );
  }

  // Debug info (remove in production)
  console.log("Invoice Management Debug:", {
    invoices: invoices?.length || 0,
    loading,
    error,
    statistics,
    pagination,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                Non Completed (
                {statistics.totalInvoices - statistics.paidInvoices})
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                <Download className="w-4 h-4 mr-2" />
                Import
              </button>
              <button
                onClick={refreshInvoices && (() => refreshInvoices())}
                disabled={loading || !refreshInvoices}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button 
                onClick={handleCreateNewInvoice}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                placeholder="Search invoices..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={clientsLoading}
              >
                <option value="">Any Client</option>
                {clientOptions && clientOptions.length > 0 ? (
                  clientOptions.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company && `(${client.company})`}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading clients...</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice No.
              </label>
              <input
                type="text"
                value={localInvoiceNo}
                onChange={(e) => setLocalInvoiceNo(e.target.value)}
                placeholder="Enter invoice number..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          {/* Advanced Search Section */}
          {showAdvancedSearch && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Range
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={amountRange.min}
                    onChange={(e) =>
                      setAmountRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                    placeholder="Min amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    value={amountRange.max}
                    onChange={(e) =>
                      setAmountRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                    placeholder="Max amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Search
              <ChevronDown
                className={`w-4 h-4 ml-2 transform transition-transform ${
                  showAdvancedSearch ? "rotate-180" : ""
                }`}
              />
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                Reset
              </button>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleStatusTab(tab.key)}
                disabled={loading}
                className={`py-4 border-b-2 transition-colors whitespace-nowrap disabled:opacity-50 text-sm font-medium ${
                  status === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${tab.color}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Results</span>
              <span className="ml-2">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} invoices
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                disabled={loading}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="InvoiceDate">Date</option>
                <option value="InvoiceNumber">Invoice Number</option>
                <option value="TotalAmount">Amount</option>
                <option value="Status">Status</option>
                <option value="ClientName">Client</option>
                <option value="DueDate">Due Date</option>
              </select>
              <button
                onClick={() => handleSort(sortBy)}
                disabled={loading}
                className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {sortAscending ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice List - Compact Card Layout */}
      <div className="bg-white">
        {error && (
          <div className="p-6 border-b border-red-200 bg-red-50">
            <div className="text-red-800 font-medium">
              Error loading invoices
            </div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {invoices.length === 0 && !loading ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-400 text-lg">No invoices found</div>
            <p className="text-gray-500 mt-2">
              {searchTerm || status || clientId
                ? "Try adjusting your search criteria"
                : "Create your first invoice to get started"}
            </p>
            {!searchTerm && !status && !clientId && (
              <button 
                onClick={handleCreateNewInvoice}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Create First Invoice
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.Id}
                  onClick={(e) => handleInvoiceClick(invoice.Id, e)}
                  className={`bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 cursor-pointer ${
                    isOverdue(invoice) ? "border-l-4 border-l-red-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    {/* Left Section - Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          #{invoice.InvoiceNumber || "Draft"}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(invoice.InvoiceDate)}
                        </span>
                        {getStatusBadge(invoice.Status)}
                        {isOverdue(invoice) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                            OVERDUE
                          </span>
                        )}
                      </div>

                      {/* Client Info */}
                      <div className="mb-3">
                        <div className="text-base font-medium text-gray-900">
                          {getClientName(invoice)}
                        </div>
                        <div className="text-sm text-blue-600">
                          Leone Fruit #{invoice.Id?.toString().padStart(6, "0")}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="text-sm text-gray-600 mb-3 max-w-2xl">
                        {getInvoiceDescription(invoice)}
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          By: {invoice.CreatedBy || currentUser.name}
                        </span>
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          Sold by: {invoice.SoldBy || currentUser.name}
                        </span>
                        {invoice.DueDate && (
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Due: {formatDate(invoice.DueDate)}
                          </span>
                        )}
                        {invoice.PaymentTerms && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                            {invoice.PaymentTerms}
                          </span>
                        )}
                        {invoice.PurchaseOrderNumber && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-700 border border-gray-200">
                            PO: {invoice.PurchaseOrderNumber}
                          </span>
                        )}
                      </div>

                      {/* Activity Indicators */}
                      {(invoice.EmailSent || invoice.PrintCount > 0) && (
                        <div className="flex items-center mt-3 space-x-4">
                          {invoice.EmailSent && (
                            <div className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                              <Send className="w-3 h-3 mr-1" />
                              Sent via Email
                            </div>
                          )}
                          {invoice.PrintCount > 0 && (
                            <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                              <Printer className="w-3 h-3 mr-1" />
                              Printed ({invoice.PrintCount}x)
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Section - Amount & Actions */}
                    <div className="flex items-start space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrencyAmount(
                            invoice.TotalAmount,
                            invoice.Currency
                          )}
                        </div>
                        {invoice.Status === "Paid" && (
                          <div className="text-sm text-emerald-600 font-medium">
                            Paid in Full
                          </div>
                        )}
                        {invoice.BalanceAmount > 0 &&
                          invoice.Status !== "Paid" && (
                            <div className="text-sm text-red-600">
                              Balance:{" "}
                              {formatCurrencyAmount(
                                invoice.BalanceAmount,
                                invoice.Currency
                              )}
                            </div>
                          )}
                        {invoice.PaidAmount > 0 &&
                          invoice.Status !== "Paid" && (
                            <div className="text-sm text-emerald-600">
                              Paid:{" "}
                              {formatCurrencyAmount(
                                invoice.PaidAmount,
                                invoice.Currency
                              )}
                            </div>
                          )}
                      </div>

                      {/* Action Menu */}
                      <div className="relative action-menu" data-action-menu>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionMenu(
                              showActionMenu === invoice.Id ? null : invoice.Id
                            );
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>

                        {showActionMenu === invoice.Id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={(e) =>
                                  handleInvoiceAction(
                                    "view",
                                    invoice.Id,
                                    invoice,
                                    e
                                  )
                                }
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Invoice
                              </button>
                              <button
                                onClick={(e) =>
                                  handleInvoiceAction(
                                    "edit",
                                    invoice.Id,
                                    invoice,
                                    e
                                  )
                                }
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Invoice
                              </button>
                              <button
                                onClick={(e) =>
                                  handleInvoiceAction(
                                    "duplicate",
                                    invoice.Id,
                                    invoice,
                                    e
                                  )
                                }
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Duplicate
                              </button>
                              {invoice.Status === "Draft" && (
                                <button
                                  onClick={(e) =>
                                    handleInvoiceAction(
                                      "send",
                                      invoice.Id,
                                      invoice,
                                      e
                                    )
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Invoice
                                </button>
                              )}
                              {invoice.Status !== "Paid" &&
                                invoice.Status !== "Voided" && (
                                  <button
                                    onClick={(e) =>
                                      handleInvoiceAction(
                                        "markPaid",
                                        invoice.Id,
                                        invoice,
                                        e
                                      )
                                    }
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Mark as Paid
                                  </button>
                                )}
                              {invoice.Status !== "Voided" &&
                                invoice.Status !== "Paid" && (
                                  <button
                                    onClick={(e) =>
                                      handleInvoiceAction(
                                        "void",
                                        invoice.Id,
                                        invoice,
                                        e
                                      )
                                    }
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Void Invoice
                                  </button>
                                )}
                              <hr className="my-1" />
                              <button
                                onClick={(e) =>
                                  handleInvoiceAction(
                                    "delete",
                                    invoice.Id,
                                    invoice,
                                    e
                                  )
                                }
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Invoice
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={pagination.pageSize}
                onChange={(e) =>
                  changePageSize && changePageSize(parseInt(e.target.value))
                }
                disabled={loading || !changePageSize}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => goToPage && goToPage(pagination.page - 1)}
                disabled={!pagination.HasPreviousPage || loading || !goToPage}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {generatePageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && goToPage && goToPage(page)
                  }
                  disabled={page === "..." || loading || !goToPage}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors disabled:cursor-default ${
                    page === pagination.page
                      ? "bg-blue-600 text-white"
                      : page === "..."
                      ? "cursor-default"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage && goToPage(pagination.page + 1)}
                disabled={!pagination.HasNextPage || loading || !goToPage}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && invoices.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Updating...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex">
            <div className="flex-1">
              <span className="block sm:inline">{error}</span>
            </div>
            <button
              onClick={() => {
                /* clear error */
              }}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagementPage;