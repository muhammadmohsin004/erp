import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useInvoice } from "../../../Contexts/InvoiceContext/InvoiceContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const InvoiceDashboard = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const { 
    invoices, 
    loading, 
    getInvoices,
    getInvoice 
  } = useInvoice();

  const translations = {
    "Invoice Dashboard": language === "ar" ? "لوحة تحكم الفواتير" : "Invoice Dashboard",
    "Create Invoice": language === "ar" ? "إنشاء فاتورة" : "Create Invoice",
    "View All": language === "ar" ? "عرض الكل" : "View All",
    "Total Revenue": language === "ar" ? "إجمالي الإيرادات" : "Total Revenue",
    "Total Invoices": language === "ar" ? "إجمالي الفواتير" : "Total Invoices",
    "Paid Invoices": language === "ar" ? "الفواتير المدفوعة" : "Paid Invoices",
    "Outstanding": language === "ar" ? "المستحقة" : "Outstanding",
    "Overdue": language === "ar" ? "المتأخرة" : "Overdue",
    "Draft": language === "ar" ? "المسودات" : "Draft",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "Recent Invoices": language === "ar" ? "الفواتير الحديثة" : "Recent Invoices",
    "Quick Stats": language === "ar" ? "إحصائيات سريعة" : "Quick Stats",
    "Revenue Trend": language === "ar" ? "اتجاه الإيرادات" : "Revenue Trend",
    "Invoice Status": language === "ar" ? "حالة الفواتير" : "Invoice Status",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No invoices": language === "ar" ? "لا توجد فواتير" : "No invoices",
    "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
    "Customer": language === "ar" ? "العميل" : "Customer",
    "Amount": language === "ar" ? "المبلغ" : "Amount",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Date": language === "ar" ? "التاريخ" : "Date",
    "Actions": language === "ar" ? "الإجراءات" : "Actions",
    "View": language === "ar" ? "عرض" : "View",
    "Edit": language === "ar" ? "تعديل" : "Edit",
    "Sent": language === "ar" ? "مرسلة" : "Sent",
    "Paid": language === "ar" ? "مدفوعة" : "Paid",
    "Cancelled": language === "ar" ? "ملغاة" : "Cancelled",
    "Growth": language === "ar" ? "النمو" : "Growth",
    "vs last month": language === "ar" ? "مقارنة بالشهر الماضي" : "vs last month",
    "Average Invoice": language === "ar" ? "متوسط الفاتورة" : "Average Invoice",
    "Collection Rate": language === "ar" ? "معدل التحصيل" : "Collection Rate",
    "Top Customers": language === "ar" ? "أهم العملاء" : "Top Customers",
    "Payment Status": language === "ar" ? "حالة الدفع" : "Payment Status",
  };

  // State management
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
      cancelled: 0
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Process invoices data from API response
  const invoicesData = invoices?.Data || [];

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        await getInvoices({ page: 1, pageSize: 100 }); // Get more invoices for better analytics
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token, getInvoices]);

  // Calculate dashboard statistics when invoices change
  useEffect(() => {
    if (Array.isArray(invoicesData) && invoicesData.length > 0) {
      calculateDashboardStats();
    }
  }, [invoicesData]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  const calculateDashboardStats = () => {
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
      cancelled: 0
    };

    invoicesData.forEach(invoice => {
      const amount = parseFloat(invoice.TotalAmount) || 0;
      const invoiceDate = new Date(invoice.InvoiceDate);
      const invoiceMonth = invoiceDate.getMonth();
      const invoiceYear = invoiceDate.getFullYear();

      // Total revenue (all invoices)
      totalRevenue += amount;

      // Status breakdown
      const status = invoice.Status?.toLowerCase() || 'draft';
      if (statusBreakdown.hasOwnProperty(status)) {
        statusBreakdown[status] += 1;
      }

      // Paid invoices
      if (status === 'paid') {
        paidInvoices += 1;
      }

      // Outstanding (sent but not paid)
      if (status === 'sent') {
        outstandingAmount += amount;
      }

      // Overdue
      if (status === 'overdue') {
        overdueAmount += amount;
        outstandingAmount += amount; // Overdue is also outstanding
      }

      // This month revenue
      if (invoiceMonth === currentMonth && invoiceYear === currentYear) {
        thisMonthRevenue += amount;
      }

      // Last month revenue
      if (invoiceMonth === lastMonth && invoiceYear === lastMonthYear) {
        lastMonthRevenue += amount;
      }
    });

    // Recent invoices (last 5)
    const recentInvoices = [...invoicesData]
      .sort((a, b) => new Date(b.InvoiceDate) - new Date(a.InvoiceDate))
      .slice(0, 5);

    // Calculate derived metrics
    const averageInvoice = invoicesData.length > 0 ? totalRevenue / invoicesData.length : 0;
    const collectionRate = invoicesData.length > 0 ? (paidInvoices / invoicesData.length) * 100 : 0;

    setDashboardData({
      totalRevenue,
      totalInvoices: invoicesData.length,
      paidInvoices,
      outstandingAmount,
      overdueAmount,
      draftCount: statusBreakdown.draft,
      thisMonthRevenue,
      lastMonthRevenue,
      averageInvoice,
      collectionRate,
      recentInvoices,
      statusBreakdown
    });
  };

  // Handle invoice actions
  const handleViewInvoice = (invoiceId) => {
    navigate(`/admin/invoice-view/${invoiceId}`);
  };

  const handleEditInvoice = async (invoiceId) => {
    try {
      const invoiceData = await getInvoice(invoiceId);
      if (invoiceData) {
        navigate("/admin/new-invoice", {
          state: {
            editData: invoiceData,
            isEditing: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching invoice for edit:", error);
    }
  };

  // Utility functions
  const formatCurrency = (value) => {
    return parseFloat(value || 0).toFixed(2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateGrowth = () => {
    if (dashboardData.lastMonthRevenue === 0) return 0;
    return ((dashboardData.thisMonthRevenue - dashboardData.lastMonthRevenue) / dashboardData.lastMonthRevenue) * 100;
  };

  // Dashboard Card Component
  const DashboardCard = ({ title, value, icon: Icon, bgColor, iconColor, isCurrency = false, growth = null, subtitle = null }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <Container className="flex items-center justify-between mb-4">
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
        {growth !== null && (
          <Container className={`flex items-center gap-1 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <Span className="text-sm font-medium">
              {Math.abs(growth).toFixed(1)}%
            </Span>
          </Container>
        )}
      </Container>
      
      <Container>
        <Span className="text-2xl font-bold text-gray-900 block">
          {isCurrency ? `$${formatCurrency(value)}` : value}
        </Span>
        <Span className="text-gray-500 text-sm font-medium">{title}</Span>
        {subtitle && (
          <Span className="text-gray-400 text-xs block mt-1">{subtitle}</Span>
        )}
      </Container>
    </Container>
  );

  // Quick Action Card Component
  const QuickActionCard = ({ title, description, icon: Icon, bgColor, onClick }) => (
    <Container 
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
      onClick={onClick}
    >
      <Container className="flex items-center gap-4">
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </Container>
        <Container>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Span className="text-gray-500 text-sm">{description}</Span>
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

  const growth = calculateGrowth();

  return (
    <Container className="min-h-screen bg-gray-50">
      <Container className="px-6 py-6">
        {/* Header */}
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <Container>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {translations["Invoice Dashboard"]}
            </h1>
            <Span className="text-gray-500">
              Monitor your invoice performance and revenue trends
            </Span>
          </Container>
          <Container className="flex gap-3 mt-4 lg:mt-0">
            <FilledButton
              isIcon={true}
              icon={Eye}
              iconSize="w-4 h-4"
              bgColor="bg-gray-600 hover:bg-gray-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["View All"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/invoices")}
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
              onClick={() => navigate("/admin/new-invoice")}
            />
          </Container>
        </Container>

        {/* Quick Actions */}
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
        </Container>

        {/* Main Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title={translations["Total Revenue"]}
            value={dashboardData.totalRevenue}
            icon={DollarSign}
            bgColor="bg-green-50"
            iconColor="text-green-600"
            isCurrency={true}
            growth={growth}
            subtitle={translations["vs last month"]}
          />
          <DashboardCard
            title={translations["Total Invoices"]}
            value={dashboardData.totalInvoices}
            icon={Receipt}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <DashboardCard
            title={translations["Paid Invoices"]}
            value={dashboardData.paidInvoices}
            icon={CheckCircle}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <DashboardCard
            title={translations.Outstanding}
            value={dashboardData.outstandingAmount}
            icon={Clock}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
            isCurrency={true}
          />
        </Container>

        {/* Secondary Statistics */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title={translations.Overdue}
            value={dashboardData.overdueAmount}
            icon={AlertCircle}
            bgColor="bg-red-50"
            iconColor="text-red-600"
            isCurrency={true}
          />
          <DashboardCard
            title={translations.Draft}
            value={dashboardData.draftCount}
            icon={FileText}
            bgColor="bg-gray-50"
            iconColor="text-gray-600"
          />
          <DashboardCard
            title={translations["Average Invoice"]}
            value={dashboardData.averageInvoice}
            icon={Target}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
            isCurrency={true}
          />
          <DashboardCard
            title={translations["Collection Rate"]}
            value={`${dashboardData.collectionRate.toFixed(1)}%`}
            icon={TrendingUp}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
          />
        </Container>

        {/* Charts and Recent Activity */}
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Breakdown */}
          <Container className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Container className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {translations["Invoice Status"]}
              </h3>
            </Container>
            
            <Container className="space-y-4">
              {Object.entries(dashboardData.statusBreakdown).map(([status, count]) => (
                <Container key={status} className="flex items-center justify-between">
                  <Container className="flex items-center gap-3">
                    <Container className={`w-3 h-3 rounded-full ${
                      status === 'paid' ? 'bg-green-500' :
                      status === 'sent' ? 'bg-blue-500' :
                      status === 'overdue' ? 'bg-red-500' :
                      status === 'draft' ? 'bg-gray-500' :
                      'bg-yellow-500'
                    }`}></Container>
                    <Span className="text-sm font-medium text-gray-700 capitalize">
                      {translations[status.charAt(0).toUpperCase() + status.slice(1)] || status}
                    </Span>
                  </Container>
                  <Span className="text-sm font-bold text-gray-900">{count}</Span>
                </Container>
              ))}
            </Container>
          </Container>

          {/* Recent Invoices */}
          <Container className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Container className="flex items-center justify-between mb-6">
              <Container className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {translations["Recent Invoices"]}
                </h3>
              </Container>
              <FilledButton
                bgColor="bg-blue-100 hover:bg-blue-200"
                textColor="text-blue-700"
                rounded="rounded-lg"
                buttonText={translations["View All"]}
                height="h-8"
                px="px-3"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => navigate("/admin/invoices")}
              />
            </Container>

            {isLoading ? (
              <Container className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <Span className="text-gray-500 text-sm block mt-2">{translations.Loading}</Span>
              </Container>
            ) : dashboardData.recentInvoices.length === 0 ? (
              <Container className="text-center py-8">
                <Receipt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <Span className="text-gray-500 text-sm">{translations["No invoices"]}</Span>
              </Container>
            ) : (
              <Container className="space-y-3">
                {dashboardData.recentInvoices.map((invoice) => (
                  <Container
                    key={invoice.Id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Container className="flex items-center gap-3">
                      <Container>
                        <Span className="text-sm font-medium text-gray-900">
                          {invoice.InvoiceNumber}
                        </Span>
                        <Span className="text-xs text-gray-500 block">
                          {invoice.CustomerName || "Unknown Customer"}
                        </Span>
                      </Container>
                    </Container>

                    <Container className="flex items-center gap-4">
                      <Container className="text-right">
                        <Span className="text-sm font-medium text-gray-900">
                          ${formatCurrency(invoice.TotalAmount)}
                        </Span>
                        <Span className="text-xs text-gray-500 block">
                          {formatDate(invoice.InvoiceDate)}
                        </Span>
                      </Container>

                      <Span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.Status)}`}
                      >
                        {translations[invoice.Status] || invoice.Status}
                      </Span>

                      <Container className="flex gap-1">
                        <button
                          onClick={() => handleViewInvoice(invoice.Id)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                          title={translations.View}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice.Id)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                          title={translations.Edit}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </Container>
                    </Container>
                  </Container>
                ))}
              </Container>
            )}
          </Container>
        </Container>

        {/* Monthly Revenue Trend */}
        <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <Container className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {translations["Revenue Trend"]}
            </h3>
          </Container>

          <Container className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Container className="text-center">
              <Span className="text-3xl font-bold text-blue-600 block">
                ${formatCurrency(dashboardData.thisMonthRevenue)}
              </Span>
              <Span className="text-gray-500 text-sm">{translations["This Month"]}</Span>
            </Container>
            <Container className="text-center">
              <Span className="text-3xl font-bold text-gray-600 block">
                ${formatCurrency(dashboardData.lastMonthRevenue)}
              </Span>
              <Span className="text-gray-500 text-sm">Last Month</Span>
            </Container>
          </Container>

          {growth !== 0 && (
            <Container className="mt-4 text-center">
              <Container className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(growth).toFixed(1)}% {translations.Growth}
              </Container>
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  );
};

export default InvoiceDashboard;