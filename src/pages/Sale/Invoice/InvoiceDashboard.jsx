import React, { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  PieChart,
  Eye,
  Edit,
  FileText,
  Users,
  Target,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInvoice } from "../../../Contexts/InvoiceContext/InvoiceContext";

const InvoiceDashboard = () => {
  const navigate = useNavigate();
  const {
    // State from context
    loading,
    error,
    invoices,
    invoiceStatistics,

    // Methods from context
    getInvoices,
    getInvoiceStatistics,
    clearError,
    updateFilters,
    resetFilters,
  } = useInvoice();

  const [language, setLanguage] = useState("en");
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    outstandingAmount: 0,
    overdueAmount: 0,
    draftCount: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    averageInvoice: 0,
    collectionRate: 0,
    recentInvoices: [],
    statusBreakdown: {
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
      unpaid: 0,
      cancelled: 0,
    },
  });

  // Translations
  const translations = {
    "Invoice Dashboard":
      language === "ar" ? "لوحة تحكم الفواتير" : "Invoice Dashboard",
    "Create Invoice": language === "ar" ? "إنشاء فاتورة" : "Create Invoice",
    "View All": language === "ar" ? "عرض الكل" : "View All",
    "Total Revenue": language === "ar" ? "إجمالي الإيرادات" : "Total Revenue",
    "Total Invoices": language === "ar" ? "إجمالي الفواتير" : "Total Invoices",
    "Paid Invoices": language === "ar" ? "الفواتير المدفوعة" : "Paid Invoices",
    Outstanding: language === "ar" ? "المستحقة" : "Outstanding",
    Overdue: language === "ar" ? "المتأخرة" : "Overdue",
    Draft: language === "ar" ? "المسودات" : "Draft",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "Recent Invoices":
      language === "ar" ? "الفواتير الحديثة" : "Recent Invoices",
    "Invoice Status": language === "ar" ? "حالة الفواتير" : "Invoice Status",
    "Revenue Trend": language === "ar" ? "اتجاه الإيرادات" : "Revenue Trend",
    "vs last month":
      language === "ar" ? "مقارنة بالشهر الماضي" : "vs last month",
    "Average Invoice": language === "ar" ? "متوسط الفاتورة" : "Average Invoice",
    "Collection Rate": language === "ar" ? "معدل التحصيل" : "Collection Rate",
    Growth: language === "ar" ? "النمو" : "Growth",
    Paid: language === "ar" ? "مدفوعة" : "Paid",
    Unpaid: language === "ar" ? "غير مدفوعة" : "Unpaid",
    Sent: language === "ar" ? "مرسلة" : "Sent",
    Cancelled: language === "ar" ? "ملغاة" : "Cancelled",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Refresh: language === "ar" ? "تحديث" : "Refresh",
    "No invoices found":
      language === "ar" ? "لا توجد فواتير" : "No invoices found",
    "Error loading data":
      language === "ar" ? "خطأ في تحميل البيانات" : "Error loading data",
    Retry: language === "ar" ? "إعادة المحاولة" : "Retry",
  };

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Recalculate dashboard stats when invoices data changes
  useEffect(() => {
    if (invoices?.Data) {
      calculateDashboardStats();
    }
  }, [invoices]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      // Reset filters to get all invoices for dashboard
      resetFilters();

      // Get invoices with a larger page size to get more data for calculations
      await getInvoices({ pageSize: 100 });

      // Get invoice statistics if available
      await getInvoiceStatistics();
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  // Calculate dashboard statistics from invoice data
  const calculateDashboardStats = () => {
    const invoiceData = invoices?.Data || [];

    if (invoiceData.length === 0) {
      setDashboardData({
        totalRevenue: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        outstandingAmount: 0,
        overdueAmount: 0,
        draftCount: 0,
        thisMonthRevenue: 0,
        lastMonthRevenue: 0,
        averageInvoice: 0,
        collectionRate: 0,
        recentInvoices: [],
        statusBreakdown: {
          draft: 0,
          sent: 0,
          paid: 0,
          overdue: 0,
          unpaid: 0,
          cancelled: 0,
        },
      });
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let totalRevenue = 0;
    let paidInvoices = 0;
    let outstandingAmount = 0;
    let overdueAmount = 0;
    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;
    let statusBreakdown = {
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
      unpaid: 0,
      cancelled: 0,
    };

    invoiceData.forEach((invoice) => {
      const amount = parseFloat(invoice.TotalAmount) || 0;
      const paidAmount = parseFloat(invoice.PaidAmount) || 0;
      const balanceAmount = parseFloat(invoice.BalanceAmount) || 0;
      const invoiceDate = new Date(invoice.InvoiceDate);
      const invoiceMonth = invoiceDate.getMonth();
      const invoiceYear = invoiceDate.getFullYear();
      const dueDate = new Date(invoice.DueDate);

      // Total revenue calculation (sum of all invoice amounts)
      totalRevenue += amount;

      // Status breakdown
      const status = invoice.Status?.toLowerCase() || "draft";
      if (statusBreakdown.hasOwnProperty(status)) {
        statusBreakdown[status] += 1;
      } else {
        statusBreakdown.draft += 1;
      }

      // Paid invoices count
      if (status === "paid") {
        paidInvoices += 1;
      }

      // Outstanding amount calculation
      if (status === "unpaid" || status === "sent") {
        outstandingAmount +=
          balanceAmount > 0 ? balanceAmount : amount - paidAmount;
      }

      // Overdue amount calculation
      if (status === "overdue" || (status === "unpaid" && dueDate < now)) {
        const overdueAmountForInvoice =
          balanceAmount > 0 ? balanceAmount : amount - paidAmount;
        overdueAmount += overdueAmountForInvoice;
        if (status !== "overdue") {
          // If it's unpaid but overdue, add to outstanding as well
          outstandingAmount += overdueAmountForInvoice;
        }
      }

      // Monthly revenue calculations (based on invoice date)
      if (invoiceMonth === currentMonth && invoiceYear === currentYear) {
        thisMonthRevenue += amount;
      }

      if (invoiceMonth === lastMonth && invoiceYear === lastMonthYear) {
        lastMonthRevenue += amount;
      }
    });

    // Recent invoices (last 5, sorted by date)
    const recentInvoices = [...invoiceData]
      .sort((a, b) => new Date(b.InvoiceDate) - new Date(a.InvoiceDate))
      .slice(0, 5);

    // Calculate derived metrics
    const averageInvoice =
      invoiceData.length > 0 ? totalRevenue / invoiceData.length : 0;
    const collectionRate =
      invoiceData.length > 0 ? (paidInvoices / invoiceData.length) * 100 : 0;

    setDashboardData({
      totalRevenue,
      totalInvoices: invoiceData.length,
      paidInvoices,
      outstandingAmount,
      overdueAmount,
      draftCount: statusBreakdown.draft,
      thisMonthRevenue,
      lastMonthRevenue,
      averageInvoice,
      collectionRate,
      recentInvoices,
      statusBreakdown,
    });
  };

  // Utility functions
  const formatCurrency = (value, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateGrowth = () => {
    if (dashboardData.lastMonthRevenue === 0) return 0;
    return (
      ((dashboardData.thisMonthRevenue - dashboardData.lastMonthRevenue) /
        dashboardData.lastMonthRevenue) *
      100
    );
  };

  // Handle refresh
  const handleRefresh = async () => {
    await loadDashboardData();
  };

  // Handle view invoice
  const handleViewInvoice = (invoiceId) => {
    navigate(`/admin/invoices/${invoiceId}`);
  };

  // Handle edit invoice
  const handleEditInvoice = (invoiceId) => {
    navigate(`/admin/invoices/edit/${invoiceId}`);
  };

  // Dashboard Card Component
  const DashboardCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor,
    isCurrency = false,
    growth = null,
    subtitle = null,
    isLoading = false,
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {growth !== null && (
          <div
            className={`flex items-center gap-1 ${
              growth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {growth >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(growth).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            <span className="text-2xl font-bold text-gray-400">--</span>
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-900 block">
            {isCurrency ? formatCurrency(value) : value}
          </span>
        )}
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        {subtitle && (
          <span className="text-gray-400 text-xs block mt-1">{subtitle}</span>
        )}
      </div>
    </div>
  );

  // Quick Action Card Component
  const QuickActionCard = ({
    title,
    description,
    icon: Icon,
    bgColor,
    onClick,
  }) => (
    <div
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-gray-500 text-sm">{description}</span>
        </div>
      </div>
    </div>
  );

  // Error Component
  const ErrorDisplay = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        {translations["Error loading data"]}
      </h3>
      <p className="text-red-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {translations.Retry}
      </button>
    </div>
  );

  const growth = calculateGrowth();

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <ErrorDisplay message={error} onRetry={handleRefresh} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {translations["Invoice Dashboard"]}
            </h1>
            <span className="text-gray-500">
              Monitor your invoice performance and revenue trends
            </span>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              {translations.Refresh}
            </button>
            <button
              onClick={() => navigate("/admin/invoices")}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Eye className="w-4 h-4" />
              {translations["View All"]}
            </button>
            <button
              onClick={() => navigate("/admin/new-invoice")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              {translations["Create Invoice"]}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <QuickActionCard
            title={translations["Create Invoice"]}
            description="Generate a new invoice for your customers"
            icon={Receipt}
            bgColor="bg-blue-600"
            onClick={() => navigate("/admin/new-invoice")}
          />
          <QuickActionCard
            title="Manage Invoices"
            description="View, edit, and track all your invoices"
            icon={FileText}
            bgColor="bg-green-600"
            onClick={() => navigate("/admin/invoices")}
          />
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title={translations["Total Revenue"]}
            value={dashboardData.totalRevenue}
            icon={DollarSign}
            bgColor="bg-green-50"
            iconColor="text-green-600"
            isCurrency={true}
            growth={growth}
            subtitle={translations["vs last month"]}
            isLoading={loading}
          />
          <DashboardCard
            title={translations["Total Invoices"]}
            value={dashboardData.totalInvoices}
            icon={Receipt}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            isLoading={loading}
          />
          <DashboardCard
            title={translations["Paid Invoices"]}
            value={dashboardData.paidInvoices}
            icon={CheckCircle}
            bgColor="bg-green-50"
            iconColor="text-green-600"
            isLoading={loading}
          />
          <DashboardCard
            title={translations.Outstanding}
            value={dashboardData.outstandingAmount}
            icon={Clock}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
            isCurrency={true}
            isLoading={loading}
          />
        </div>

        {/* Secondary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title={translations.Overdue}
            value={dashboardData.overdueAmount}
            icon={AlertCircle}
            bgColor="bg-red-50"
            iconColor="text-red-600"
            isCurrency={true}
            isLoading={loading}
          />
          <DashboardCard
            title={translations.Draft}
            value={dashboardData.draftCount}
            icon={FileText}
            bgColor="bg-gray-50"
            iconColor="text-gray-600"
            isLoading={loading}
          />
          <DashboardCard
            title={translations["Average Invoice"]}
            value={dashboardData.averageInvoice}
            icon={Target}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
            isCurrency={true}
            isLoading={loading}
          />
          <DashboardCard
            title={translations["Collection Rate"]}
            value={`${dashboardData.collectionRate.toFixed(1)}%`}
            icon={TrendingUp}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            isLoading={loading}
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Breakdown */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {translations["Invoice Status"]}
              </h3>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(dashboardData.statusBreakdown).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status === "paid"
                              ? "bg-green-500"
                              : status === "sent"
                              ? "bg-blue-500"
                              : status === "overdue"
                              ? "bg-red-500"
                              : status === "unpaid"
                              ? "bg-yellow-500"
                              : status === "draft"
                              ? "bg-gray-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {translations[
                            status.charAt(0).toUpperCase() + status.slice(1)
                          ] || status}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {translations["Recent Invoices"]}
                </h3>
              </div>
              <button
                onClick={() => navigate("/admin/invoices")}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                {translations["View All"]}
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : dashboardData.recentInvoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {translations["No invoices found"]}
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.recentInvoices.map((invoice) => (
                  <div
                    key={invoice.Id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {invoice.InvoiceNumber}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          {invoice.CustomerName ||
                            invoice.BillingName ||
                            "Unknown Customer"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(
                            invoice.TotalAmount,
                            invoice.Currency
                          )}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          {formatDate(invoice.InvoiceDate)}
                        </span>
                      </div>

                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          invoice.Status
                        )}`}
                      >
                        {translations[invoice.Status] || invoice.Status}
                      </span>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleViewInvoice(invoice.Id)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                          title={translations.View}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice.Id)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                          title={translations.Edit}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {translations["Revenue Trend"]}
            </h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <span className="text-3xl font-bold text-blue-600 block">
                  {formatCurrency(dashboardData.thisMonthRevenue)}
                </span>
                <span className="text-gray-500 text-sm">
                  {translations["This Month"]}
                </span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-600 block">
                  {formatCurrency(dashboardData.lastMonthRevenue)}
                </span>
                <span className="text-gray-500 text-sm">Last Month</span>
              </div>
            </div>
          )}

          {!loading && growth !== 0 && (
            <div className="mt-4 text-center">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  growth >= 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {growth >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(growth).toFixed(1)}% {translations.Growth}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
