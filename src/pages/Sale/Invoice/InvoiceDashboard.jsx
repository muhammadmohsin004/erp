import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  Calendar,
  Eye,
  Edit,
  Send,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Receipt,
  Target,
} from "lucide-react";

// Context imports
import { useInvoices } from "../../../Contexts/InvoiceContext/InvoiceContext";
import { useClients } from "../../../Contexts/apiClientContext/apiClientContext";
// Component imports
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const InvoiceDashboard = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Invoice Dashboard": language === "ar" ? "لوحة معلومات الفواتير" : "Invoice Dashboard",
    "Create Invoice": language === "ar" ? "إنشاء فاتورة" : "Create Invoice",
    "View All": language === "ar" ? "عرض الكل" : "View All",
    "Total Revenue": language === "ar" ? "إجمالي الإيرادات" : "Total Revenue",
    "Outstanding": language === "ar" ? "المستحق" : "Outstanding",
    "Total Invoices": language === "ar" ? "إجمالي الفواتير" : "Total Invoices",
    "Paid This Month": language === "ar" ? "مدفوع هذا الشهر" : "Paid This Month",
    "Recent Invoices": language === "ar" ? "الفواتير الأخيرة" : "Recent Invoices",
    "Quick Actions": language === "ar" ? "إجراءات سريعة" : "Quick Actions",
    "Revenue Overview": language === "ar" ? "نظرة عامة على الإيرادات" : "Revenue Overview",
    "Invoice Status": language === "ar" ? "حالة الفاتورة" : "Invoice Status",
    "Top Clients": language === "ar" ? "أفضل العملاء" : "Top Clients",
    "Overdue Invoices": language === "ar" ? "الفواتير المتأخرة" : "Overdue Invoices",
    "Monthly Performance": language === "ar" ? "الأداء الشهري" : "Monthly Performance",
    "Draft": language === "ar" ? "مسودة" : "Draft",
    "Sent": language === "ar" ? "مرسل" : "Sent",
    "Paid": language === "ar" ? "مدفوع" : "Paid",
    "Overdue": language === "ar" ? "متأخر" : "Overdue",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "vs last month": language === "ar" ? "مقابل الشهر الماضي" : "vs last month",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "Last Month": language === "ar" ? "الشهر الماضي" : "Last Month",
    "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
    "Client": language === "ar" ? "العميل" : "Client",
    "Amount": language === "ar" ? "المبلغ" : "Amount",
    "Due Date": language === "ar" ? "تاريخ الاستحقاق" : "Due Date",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Actions": language === "ar" ? "الإجراءات" : "Actions",
    "View": language === "ar" ? "عرض" : "View",
    "Edit": language === "ar" ? "تعديل" : "Edit",
    "Send": language === "ar" ? "إرسال" : "Send",
    "No invoices found": language === "ar" ? "لم يتم العثور على فواتير" : "No invoices found",
    "No overdue invoices": language === "ar" ? "لا توجد فواتير متأخرة" : "No overdue invoices",
    "Collection Rate": language === "ar" ? "معدل التحصيل" : "Collection Rate",
    "Average Invoice": language === "ar" ? "متوسط الفاتورة" : "Average Invoice",
    "days": language === "ar" ? "أيام" : "days",
    "ago": language === "ar" ? "منذ" : "ago",
    "due in": language === "ar" ? "مستحق في" : "due in",
    "overdue by": language === "ar" ? "متأخر بـ" : "overdue by",
    "Export Report": language === "ar" ? "تصدير التقرير" : "Export Report",
    "Refresh": language === "ar" ? "تحديث" : "Refresh",
    "Filter": language === "ar" ? "تصفية" : "Filter",
    "Settings": language === "ar" ? "الإعدادات" : "Settings",
  };

  // Context hooks
  const {
    invoices,
    loading,
    statistics,
    agingReport,
    getInvoices,
    getStatistics,
    getAgingReport,
    refreshInvoices,
    getOverdueInvoices,
    getTotalInvoiceAmount,
    getTotalPaidAmount,
    getTotalOutstandingAmount,
    getInvoicesByStatus,
  } = useInvoices();

  const { clients, getClients } = useClients();

  // Local state
  const [dateRange, setDateRange] = useState("thisMonth");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Load data on mount
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
      return;
    }

    loadDashboardData();
  }, [token]);

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        getInvoices({ pageSize: 50 }),
        getClients(),
        getStatistics(),
        getAgingReport(),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  // Process data when invoices change
  useEffect(() => {
    if (invoices.length > 0) {
      processInvoiceData();
    }
  }, [invoices]);

  const processInvoiceData = () => {
    // Get recent invoices (last 5)
    const recent = invoices
      .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
      .slice(0, 5);
    setRecentInvoices(recent);

    // Get overdue invoices
    const overdue = getOverdueInvoices();
    setOverdueInvoices(overdue);

    // Calculate top clients
    const clientInvoices = {};
    invoices.forEach(invoice => {
      if (!clientInvoices[invoice.ClientId]) {
        clientInvoices[invoice.ClientId] = {
          clientName: invoice.ClientName,
          clientEmail: invoice.ClientEmail,
          totalAmount: 0,
          invoiceCount: 0,
        };
      }
      clientInvoices[invoice.ClientId].totalAmount += invoice.TotalAmount;
      clientInvoices[invoice.ClientId].invoiceCount++;
    });

    const topClientsList = Object.values(clientInvoices)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);
    setTopClients(topClientsList);

    // Generate monthly data (last 6 months)
    const monthlyStats = generateMonthlyData(invoices);
    setMonthlyData(monthlyStats);
  };

  const generateMonthlyData = (invoices) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      const monthInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.InvoiceDate);
        return invoiceDate.getMonth() === date.getMonth() && 
               invoiceDate.getFullYear() === date.getFullYear();
      });

      const totalAmount = monthInvoices.reduce((sum, inv) => sum + inv.TotalAmount, 0);
      const paidAmount = monthInvoices.filter(inv => inv.Status === 'Paid').reduce((sum, inv) => sum + inv.TotalAmount, 0);
      
      months.push({
        month: monthName,
        total: totalAmount,
        paid: paidAmount,
        count: monthInvoices.length,
      });
    }
    
    return months;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return { color: 'bg-gray-100 text-gray-800', icon: <FileText className="w-4 h-4" /> };
      case 'sent':
        return { color: 'bg-blue-100 text-blue-800', icon: <Send className="w-4 h-4" /> };
      case 'paid':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
      case 'overdue':
        return { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4" /> };
    }
  };

  // Calculate days difference
  const getDaysDifference = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  const draftCount = getInvoicesByStatus('Draft').length;
  const sentCount = getInvoicesByStatus('Sent').length;
  const paidCount = getInvoicesByStatus('Paid').length;
  const overdueCount = overdueInvoices.length;

  return (
    <Container className="min-h-screen bg-gray-50">
      <Container className="px-6 py-6">
        {/* Header */}
        <Container className="flex items-center justify-between mb-6">
          <Container>
            <h1 className="text-2xl font-bold text-gray-900">
              {translations["Invoice Dashboard"]}
            </h1>
            <Span className="text-sm text-gray-500">
              Overview of your invoice management
            </Span>
          </Container>

          <Container className="flex gap-3">
            <FilledButton
              isIcon={true}
              icon={isRefreshing ? RefreshCw : RefreshCw}
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
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={isRefreshing ? "animate-spin" : ""}
            />

            <FilledButton
              isIcon={true}
              icon={Download}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations["Export Report"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => {/* Handle export */}}
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

        {/* Stats Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Revenue */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Total Revenue"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {formatCurrency(statistics.totalRevenue || 0)}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <Span className="text-sm text-green-600">
                    +12% {translations["vs last month"]}
                  </Span>
                </Container>
              </Container>
              <Container className="bg-green-100 rounded-full p-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </Container>
            </Container>
          </Container>

          {/* Outstanding Amount */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations.Outstanding}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {formatCurrency(statistics.outstandingAmount || 0)}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <Span className="text-sm text-red-600">
                    -5% {translations["vs last month"]}
                  </Span>
                </Container>
              </Container>
              <Container className="bg-orange-100 rounded-full p-3">
                <Clock className="w-6 h-6 text-orange-600" />
              </Container>
            </Container>
          </Container>

          {/* Total Invoices */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Total Invoices"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {statistics.totalInvoices || 0}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <Span className="text-sm text-blue-600">
                    +8% {translations["vs last month"]}
                  </Span>
                </Container>
              </Container>
              <Container className="bg-blue-100 rounded-full p-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </Container>
            </Container>
          </Container>

          {/* Collection Rate */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Collection Rate"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {statistics.collectionRate ? `${statistics.collectionRate.toFixed(1)}%` : '0%'}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <Span className="text-sm text-green-600">
                    +3% {translations["vs last month"]}
                  </Span>
                </Container>
              </Container>
              <Container className="bg-purple-100 rounded-full p-3">
                <Target className="w-6 h-6 text-purple-600" />
              </Container>
            </Container>
          </Container>
        </Container>

        {/* Charts and Lists */}
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Performance Chart */}
          <Container className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {translations["Monthly Performance"]}
              </h3>
              <Container className="flex items-center gap-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="thisMonth">This Month</option>
                  <option value="last3Months">Last 3 Months</option>
                  <option value="last6Months">Last 6 Months</option>
                  <option value="thisYear">This Year</option>
                </select>
              </Container>
            </Container>

            {/* Simple bar chart representation */}
            <Container className="space-y-4">
              {monthlyData.map((month, index) => (
                <Container key={index} className="space-y-2">
                  <Container className="flex items-center justify-between">
                    <Span className="text-sm font-medium text-gray-700">{month.month}</Span>
                    <Span className="text-sm text-gray-500">{formatCurrency(month.total)}</Span>
                  </Container>
                  <Container className="w-full bg-gray-200 rounded-full h-2">
                    <Container
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((month.total / Math.max(...monthlyData.map(m => m.total))) * 100, 100)}%` }}
                    />
                  </Container>
                </Container>
              ))}
            </Container>
          </Container>

          {/* Invoice Status Distribution */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {translations["Invoice Status"]}
            </h3>
            
            <Container className="space-y-4">
              <Container className="flex items-center justify-between">
                <Container className="flex items-center gap-2">
                  <Container className="w-3 h-3 bg-gray-400 rounded-full"></Container>
                  <Span className="text-sm text-gray-700">{translations.Draft}</Span>
                </Container>
                <Span className="text-sm font-medium text-gray-900">{draftCount}</Span>
              </Container>
              
              <Container className="flex items-center justify-between">
                <Container className="flex items-center gap-2">
                  <Container className="w-3 h-3 bg-blue-400 rounded-full"></Container>
                  <Span className="text-sm text-gray-700">{translations.Sent}</Span>
                </Container>
                <Span className="text-sm font-medium text-gray-900">{sentCount}</Span>
              </Container>
              
              <Container className="flex items-center justify-between">
                <Container className="flex items-center gap-2">
                  <Container className="w-3 h-3 bg-green-400 rounded-full"></Container>
                  <Span className="text-sm text-gray-700">{translations.Paid}</Span>
                </Container>
                <Span className="text-sm font-medium text-gray-900">{paidCount}</Span>
              </Container>
              
              <Container className="flex items-center justify-between">
                <Container className="flex items-center gap-2">
                  <Container className="w-3 h-3 bg-red-400 rounded-full"></Container>
                  <Span className="text-sm text-gray-700">{translations.Overdue}</Span>
                </Container>
                <Span className="text-sm font-medium text-gray-900">{overdueCount}</Span>
              </Container>
            </Container>
          </Container>
        </Container>

        {/* Recent Invoices and Top Clients */}
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Invoices */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {translations["Recent Invoices"]}
              </h3>
              <FilledButton
                isIcon={true}
                icon={ArrowUpRight}
                iconSize="w-4 h-4"
                bgColor="bg-blue-100 hover:bg-blue-200"
                textColor="text-blue-700"
                rounded="rounded-lg"
                buttonText={translations["View All"]}
                height="h-8"
                px="px-3"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => navigate("/admin/invoices")}
              />
            </Container>

            <Container className="space-y-4">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => {
                  const statusDisplay = getStatusDisplay(invoice.Status);
                  return (
                    <Container key={invoice.Id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <Container className="flex items-center gap-3">
                        <Container className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </Container>
                        <Container>
                          <Span className="text-sm font-medium text-gray-900">
                            {invoice.InvoiceNumber}
                          </Span>
                          <Span className="text-xs text-gray-500 block">
                            {invoice.ClientName}
                          </Span>
                        </Container>
                      </Container>
                      <Container className="text-right">
                        <Span className="text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.TotalAmount, invoice.Currency)}
                        </Span>
                        <Span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                          {statusDisplay.icon}
                          {invoice.Status}
                        </Span>
                      </Container>
                    </Container>
                  );
                })
              ) : (
                <Container className="text-center py-8">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <Span className="text-sm text-gray-500">
                    {translations["No invoices found"]}
                  </Span>
                </Container>
              )}
            </Container>
          </Container>

          {/* Top Clients */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {translations["Top Clients"]}
              </h3>
              <FilledButton
                isIcon={true}
                icon={ArrowUpRight}
                iconSize="w-4 h-4"
                bgColor="bg-green-100 hover:bg-green-200"
                textColor="text-green-700"
                rounded="rounded-lg"
                buttonText={translations["View All"]}
                height="h-8"
                px="px-3"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => navigate("/admin/clients")}
              />
            </Container>

            <Container className="space-y-4">
              {topClients.length > 0 ? (
                topClients.map((client, index) => (
                  <Container key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <Container className="flex items-center gap-3">
                      <Container className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </Container>
                      <Container>
                        <Span className="text-sm font-medium text-gray-900">
                          {client.clientName}
                        </Span>
                        <Span className="text-xs text-gray-500 block">
                          {client.invoiceCount} invoices
                        </Span>
                      </Container>
                    </Container>
                    <Container className="text-right">
                      <Span className="text-sm font-medium text-gray-900">
                        {formatCurrency(client.totalAmount)}
                      </Span>
                    </Container>
                  </Container>
                ))
              ) : (
                <Container className="text-center py-8">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <Span className="text-sm text-gray-500">
                    No client data available
                  </Span>
                </Container>
              )}
            </Container>
          </Container>
        </Container>

        {/* Overdue Invoices */}
        {overdueInvoices.length > 0 && (
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                {translations["Overdue Invoices"]}
              </h3>
              <Span className="text-sm text-red-600 font-medium">
                {overdueInvoices.length} overdue
              </Span>
            </Container>

            <Container className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      {translations["Invoice Number"]}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      {translations.Client}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      {translations["Due Date"]}
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      {translations.Amount}
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      {translations.Actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {overdueInvoices.map((invoice) => {
                    const daysOverdue = Math.abs(getDaysDifference(invoice.DueDate));
                    return (
                      <tr key={invoice.Id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Span className="text-sm font-medium text-gray-900">
                            {invoice.InvoiceNumber}
                          </Span>
                        </td>
                        <td className="py-3 px-4">
                          <Span className="text-sm text-gray-900">
                            {invoice.ClientName}
                          </Span>
                        </td>
                        <td className="py-3 px-4">
                          <Container>
                            <Span className="text-sm text-gray-900">
                              {formatDate(invoice.DueDate)}
                            </Span>
                            <Span className="text-xs text-red-600 block">
                              {daysOverdue} {translations.days} overdue
                            </Span>
                          </Container>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Span className="text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.TotalAmount, invoice.Currency)}
                          </Span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Container className="flex items-center gap-2 justify-end">
                            <FilledButton
                              isIcon={true}
                              icon={Eye}
                              iconSize="w-4 h-4"
                              bgColor="bg-gray-100 hover:bg-gray-200"
                              textColor="text-gray-700"
                              rounded="rounded-lg"
                              buttonText=""
                              height="h-8"
                              width="w-8"
                              onClick={() => navigate(`/admin/invoices/${invoice.Id}`)}
                            />
                            <FilledButton
                              isIcon={true}
                              icon={Send}
                              iconSize="w-4 h-4"
                              bgColor="bg-blue-100 hover:bg-blue-200"
                              textColor="text-blue-700"
                              rounded="rounded-lg"
                              buttonText=""
                              height="h-8"
                              width="w-8"
                              onClick={() => {/* Handle send reminder */}}
                            />
                          </Container>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Container>
          </Container>
        )}

        {/* Quick Actions */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {translations["Quick Actions"]}
          </h3>
          <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-5 h-5"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Create Invoice"]}
              height="h-12"
              width="w-full"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/invoices/new")}
            />
            <FilledButton
              isIcon={true}
              icon={Users}
              iconSize="w-5 h-5"
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText="Manage Clients"
              height="h-12"
              width="w-full"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/clients")}
            />
            <FilledButton
              isIcon={true}
              icon={BarChart3}
              iconSize="w-5 h-5"
              bgColor="bg-purple-600 hover:bg-purple-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText="View Reports"
              height="h-12"
              width="w-full"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/reports")}
            />
            <FilledButton
              isIcon={true}
              icon={Receipt}
              iconSize="w-5 h-5"
              bgColor="bg-orange-600 hover:bg-orange-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText="Settings"
              height="h-12"
              width="w-full"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/settings")}
            />
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default InvoiceDashboard;