import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  Activity,
  Globe,
  MapPin,
  Phone,
  Mail,
  Building,
  Package,
  Percent,
} from "lucide-react";

// Context imports
import { useInvoices } from "../../Contexts/InvoicesContext/InvoicesContext";
import { useClients } from "../../Contexts/ClientsContext/ClientsContext";

// Component imports
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const InvoiceAnalytics = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Invoice Analytics": language === "ar" ? "تحليلات الفواتير" : "Invoice Analytics",
    "Reports": language === "ar" ? "التقارير" : "Reports",
    "Performance Overview": language === "ar" ? "نظرة عامة على الأداء" : "Performance Overview",
    "Revenue Analysis": language === "ar" ? "تحليل الإيرادات" : "Revenue Analysis",
    "Client Analysis": language === "ar" ? "تحليل العملاء" : "Client Analysis",
    "Invoice Status": language === "ar" ? "حالة الفاتورة" : "Invoice Status",
    "Payment Trends": language === "ar" ? "اتجاهات الدفع" : "Payment Trends",
    "Geographic Distribution": language === "ar" ? "التوزيع الجغرافي" : "Geographic Distribution",
    "Time Period": language === "ar" ? "الفترة الزمنية" : "Time Period",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "Last Month": language === "ar" ? "الشهر الماضي" : "Last Month",
    "This Quarter": language === "ar" ? "هذا الربع" : "This Quarter",
    "This Year": language === "ar" ? "هذا العام" : "This Year",
    "Custom Range": language === "ar" ? "نطاق مخصص" : "Custom Range",
    "Total Revenue": language === "ar" ? "إجمالي الإيرادات" : "Total Revenue",
    "Average Invoice": language === "ar" ? "متوسط الفاتورة" : "Average Invoice",
    "Collection Rate": language === "ar" ? "معدل التحصيل" : "Collection Rate",
    "Outstanding Amount": language === "ar" ? "المبلغ المستحق" : "Outstanding Amount",
    "Total Invoices": language === "ar" ? "إجمالي الفواتير" : "Total Invoices",
    "Paid Invoices": language === "ar" ? "الفواتير المدفوعة" : "Paid Invoices",
    "Pending Invoices": language === "ar" ? "الفواتير المعلقة" : "Pending Invoices",
    "Overdue Invoices": language === "ar" ? "الفواتير المتأخرة" : "Overdue Invoices",
    "Top Performing Clients": language === "ar" ? "أفضل العملاء أداءً" : "Top Performing Clients",
    "Payment Methods": language === "ar" ? "طرق الدفع" : "Payment Methods",
    "Monthly Revenue": language === "ar" ? "الإيرادات الشهرية" : "Monthly Revenue",
    "Quarterly Growth": language === "ar" ? "النمو الربعي" : "Quarterly Growth",
    "Sales by Region": language === "ar" ? "المبيعات حسب المنطقة" : "Sales by Region",
    "Export Report": language === "ar" ? "تصدير التقرير" : "Export Report",
    "Generate Report": language === "ar" ? "إنشاء تقرير" : "Generate Report",
    "Print Report": language === "ar" ? "طباعة التقرير" : "Print Report",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "vs previous period": language === "ar" ? "مقابل الفترة السابقة" : "vs previous period",
    "Growth Rate": language === "ar" ? "معدل النمو" : "Growth Rate",
    "Client Count": language === "ar" ? "عدد العملاء" : "Client Count",
    "Average Days to Pay": language === "ar" ? "متوسط أيام الدفع" : "Average Days to Pay",
    "Conversion Rate": language === "ar" ? "معدل التحويل" : "Conversion Rate",
    "Revenue per Client": language === "ar" ? "الإيرادات لكل عميل" : "Revenue per Client",
    "Invoice Frequency": language === "ar" ? "تكرار الفواتير" : "Invoice Frequency",
    "Seasonal Trends": language === "ar" ? "الاتجاهات الموسمية" : "Seasonal Trends",
    "Top Products/Services": language === "ar" ? "أفضل المنتجات/الخدمات" : "Top Products/Services",
    "Client Lifetime Value": language === "ar" ? "القيمة الحياتية للعميل" : "Client Lifetime Value",
    "Aging Report": language === "ar" ? "تقرير الشيخوخة" : "Aging Report",
    "Cash Flow": language === "ar" ? "التدفق النقدي" : "Cash Flow",
    "Current": language === "ar" ? "الحالي" : "Current",
    "1-30 Days": language === "ar" ? "1-30 يوم" : "1-30 Days",
    "31-60 Days": language === "ar" ? "31-60 يوم" : "31-60 Days",
    "61-90 Days": language === "ar" ? "61-90 يوم" : "61-90 Days",
    "Over 90 Days": language === "ar" ? "أكثر من 90 يوم" : "Over 90 Days",
    "days": language === "ar" ? "أيام" : "days",
    "Refresh": language === "ar" ? "تحديث" : "Refresh",
    "View Details": language === "ar" ? "عرض التفاصيل" : "View Details",
    "No data available": language === "ar" ? "لا توجد بيانات متاحة" : "No data available",
    "Cash": language === "ar" ? "نقدي" : "Cash",
    "Credit Card": language === "ar" ? "بطاقة ائتمان" : "Credit Card",
    "Bank Transfer": language === "ar" ? "حوالة بنكية" : "Bank Transfer",
    "Check": language === "ar" ? "شيك" : "Check",
    "Draft": language === "ar" ? "مسودة" : "Draft",
    "Sent": language === "ar" ? "مرسل" : "Sent",
    "Paid": language === "ar" ? "مدفوع" : "Paid",
    "Overdue": language === "ar" ? "متأخر" : "Overdue",
    "Voided": language === "ar" ? "ملغي" : "Voided",
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
  } = useInvoices();

  const { clients, getClients } = useClients();

  // Local state
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [analyticsData, setAnalyticsData] = useState({
    revenue: {
      current: 0,
      previous: 0,
      growth: 0,
      monthlyData: [],
    },
    invoices: {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0,
      statusDistribution: {},
    },
    clients: {
      total: 0,
      active: 0,
      topClients: [],
      geographicDistribution: {},
    },
    payments: {
      averageDays: 0,
      collectionRate: 0,
      methodDistribution: {},
    },
    products: {
      topProducts: [],
      revenueByCategory: {},
    },
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load data on mount
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
      return;
    }

    loadAnalyticsData();
  }, [token, selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        getInvoices({ pageSize: 1000 }),
        getClients(),
        getStatistics(),
        getAgingReport(),
      ]);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Process analytics data when invoices change
  useEffect(() => {
    if (invoices.length > 0) {
      processAnalyticsData();
    }
  }, [invoices, clients, selectedPeriod]);

  const processAnalyticsData = () => {
    const currentDate = new Date();
    const periodData = getPeriodData(selectedPeriod, currentDate);

    // Revenue Analysis
    const revenueData = processRevenueData(periodData);
    
    // Invoice Analysis
    const invoiceData = processInvoiceData(periodData);
    
    // Client Analysis
    const clientData = processClientData(periodData);
    
    // Payment Analysis
    const paymentData = processPaymentData(periodData);
    
    // Product Analysis
    const productData = processProductData(periodData);

    setAnalyticsData({
      revenue: revenueData,
      invoices: invoiceData,
      clients: clientData,
      payments: paymentData,
      products: productData,
    });
  };

  const getPeriodData = (period, currentDate) => {
    let startDate, endDate, previousStartDate, previousEndDate;

    switch (period) {
      case "thisMonth":
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        previousStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        previousEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        break;
      case "lastMonth":
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        previousStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
        previousEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
        break;
      case "thisQuarter":
        const currentQuarter = Math.floor(currentDate.getMonth() / 3);
        startDate = new Date(currentDate.getFullYear(), currentQuarter * 3, 1);
        endDate = new Date(currentDate.getFullYear(), (currentQuarter + 1) * 3, 0);
        previousStartDate = new Date(currentDate.getFullYear(), (currentQuarter - 1) * 3, 1);
        previousEndDate = new Date(currentDate.getFullYear(), currentQuarter * 3, 0);
        break;
      case "thisYear":
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        previousStartDate = new Date(currentDate.getFullYear() - 1, 0, 1);
        previousEndDate = new Date(currentDate.getFullYear() - 1, 11, 31);
        break;
      default:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        previousStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        previousEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    }

    return {
      current: { startDate, endDate },
      previous: { startDate: previousStartDate, endDate: previousEndDate },
    };
  };

  const processRevenueData = (periodData) => {
    const currentInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.InvoiceDate);
      return invoiceDate >= periodData.current.startDate && invoiceDate <= periodData.current.endDate;
    });

    const previousInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.InvoiceDate);
      return invoiceDate >= periodData.previous.startDate && invoiceDate <= periodData.previous.endDate;
    });

    const currentRevenue = currentInvoices
      .filter(inv => inv.Status === 'Paid')
      .reduce((sum, inv) => sum + inv.TotalAmount, 0);

    const previousRevenue = previousInvoices
      .filter(inv => inv.Status === 'Paid')
      .reduce((sum, inv) => sum + inv.TotalAmount, 0);

    const growth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Monthly data for the last 12 months
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() - i + 1, 0);
      
      const monthInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.InvoiceDate);
        return invoiceDate >= monthStart && invoiceDate <= monthEnd && invoice.Status === 'Paid';
      });

      const monthRevenue = monthInvoices.reduce((sum, inv) => sum + inv.TotalAmount, 0);
      
      monthlyData.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        revenue: monthRevenue,
        count: monthInvoices.length,
      });
    }

    return {
      current: currentRevenue,
      previous: previousRevenue,
      growth,
      monthlyData,
    };
  };

  const processInvoiceData = (periodData) => {
    const currentInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.InvoiceDate);
      return invoiceDate >= periodData.current.startDate && invoiceDate <= periodData.current.endDate;
    });

    const statusDistribution = {};
    currentInvoices.forEach(invoice => {
      statusDistribution[invoice.Status] = (statusDistribution[invoice.Status] || 0) + 1;
    });

    return {
      total: currentInvoices.length,
      paid: currentInvoices.filter(inv => inv.Status === 'Paid').length,
      pending: currentInvoices.filter(inv => inv.Status === 'Sent').length,
      overdue: currentInvoices.filter(inv => {
        const dueDate = new Date(inv.DueDate);
        return inv.Status !== 'Paid' && dueDate < new Date();
      }).length,
      statusDistribution,
    };
  };

  const processClientData = (periodData) => {
    const currentInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.InvoiceDate);
      return invoiceDate >= periodData.current.startDate && invoiceDate <= periodData.current.endDate;
    });

    // Top clients by revenue
    const clientRevenue = {};
    currentInvoices.forEach(invoice => {
      if (invoice.Status === 'Paid') {
        clientRevenue[invoice.ClientId] = (clientRevenue[invoice.ClientId] || 0) + invoice.TotalAmount;
      }
    });

    const topClients = Object.entries(clientRevenue)
      .map(([clientId, revenue]) => {
        const client = clients.find(c => c.Id === parseInt(clientId));
        return {
          clientId: parseInt(clientId),
          clientName: client?.FullName || client?.BusinessName || 'Unknown',
          revenue,
          invoiceCount: currentInvoices.filter(inv => inv.ClientId === parseInt(clientId)).length,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Geographic distribution
    const geographicDistribution = {};
    clients.forEach(client => {
      const country = client.Country || 'Unknown';
      geographicDistribution[country] = (geographicDistribution[country] || 0) + 1;
    });

    const activeClients = [...new Set(currentInvoices.map(inv => inv.ClientId))].length;

    return {
      total: clients.length,
      active: activeClients,
      topClients,
      geographicDistribution,
    };
  };

  const processPaymentData = (periodData) => {
    const paidInvoices = invoices.filter(invoice => invoice.Status === 'Paid');
    
    // Calculate average days to pay
    let totalDays = 0;
    let paidCount = 0;
    
    paidInvoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.InvoiceDate);
      const paidDate = new Date(invoice.UpdatedAt); // Assuming this is when it was marked as paid
      const daysDiff = Math.ceil((paidDate - invoiceDate) / (1000 * 60 * 60 * 24));
      totalDays += daysDiff;
      paidCount++;
    });

    const averageDays = paidCount > 0 ? totalDays / paidCount : 0;
    const collectionRate = invoices.length > 0 ? (paidInvoices.length / invoices.length) * 100 : 0;

    // Mock payment method distribution
    const methodDistribution = {
      'Credit Card': Math.floor(Math.random() * 40) + 30,
      'Bank Transfer': Math.floor(Math.random() * 30) + 20,
      'Cash': Math.floor(Math.random() * 20) + 10,
      'Check': Math.floor(Math.random() * 10) + 5,
    };

    return {
      averageDays,
      collectionRate,
      methodDistribution,
    };
  };

  const processProductData = (periodData) => {
    const currentInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.InvoiceDate);
      return invoiceDate >= periodData.current.startDate && invoiceDate <= periodData.current.endDate;
    });

    // Mock product data
    const topProducts = [
      { name: 'Website Design', revenue: 15000, count: 12 },
      { name: 'Mobile App Development', revenue: 25000, count: 8 },
      { name: 'SEO Services', revenue: 8000, count: 20 },
      { name: 'Consulting', revenue: 12000, count: 15 },
      { name: 'Maintenance', revenue: 6000, count: 25 },
    ];

    const revenueByCategory = {
      'Web Development': 35000,
      'Mobile Development': 25000,
      'Marketing': 15000,
      'Consulting': 12000,
      'Other': 8000,
    };

    return {
      topProducts,
      revenueByCategory,
    };
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

  // Get growth indicator
  const getGrowthIndicator = (value) => {
    if (value > 0) {
      return {
        icon: <TrendingUp className="w-4 h-4 text-green-500" />,
        color: "text-green-600",
        prefix: "+",
      };
    } else if (value < 0) {
      return {
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
        color: "text-red-600",
        prefix: "",
      };
    }
    return {
      icon: <ArrowUpRight className="w-4 h-4 text-gray-500" />,
      color: "text-gray-600",
      prefix: "",
    };
  };

  // Export report
  const handleExportReport = () => {
    const reportData = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue: analyticsData.revenue.current,
        totalInvoices: analyticsData.invoices.total,
        collectionRate: analyticsData.payments.collectionRate,
        averageDaysToPay: analyticsData.payments.averageDays,
      },
      details: analyticsData,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `invoice-analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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

  return (
    <Container className="min-h-screen bg-gray-50">
      <Container className="px-6 py-6">
        {/* Header */}
        <Container className="flex items-center justify-between mb-6">
          <Container>
            <h1 className="text-2xl font-bold text-gray-900">
              {translations["Invoice Analytics"]}
            </h1>
            <Span className="text-sm text-gray-500">
              Detailed insights and performance metrics
            </Span>
          </Container>

          <Container className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="thisMonth">{translations["This Month"]}</option>
              <option value="lastMonth">{translations["Last Month"]}</option>
              <option value="thisQuarter">{translations["This Quarter"]}</option>
              <option value="thisYear">{translations["This Year"]}</option>
            </select>

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
              onClick={loadAnalyticsData}
              disabled={isRefreshing}
              className={isRefreshing ? "animate-spin" : ""}
            />

            <FilledButton
              isIcon={true}
              icon={Download}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Export Report"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleExportReport}
            />
          </Container>
        </Container>

        {/* Key Metrics */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Total Revenue"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {formatCurrency(analyticsData.revenue.current)}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  {getGrowthIndicator(analyticsData.revenue.growth).icon}
                  <Span className={`text-sm ${getGrowthIndicator(analyticsData.revenue.growth).color}`}>
                    {getGrowthIndicator(analyticsData.revenue.growth).prefix}{analyticsData.revenue.growth.toFixed(1)}% {translations["vs previous period"]}
                  </Span>
                </Container>
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
                  {translations["Total Invoices"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {analyticsData.invoices.total}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <Span className="text-sm text-blue-600">
                    {analyticsData.invoices.paid} {translations["Paid"]}
                  </Span>
                </Container>
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
                  {translations["Collection Rate"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {analyticsData.payments.collectionRate.toFixed(1)}%
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <Span className="text-sm text-purple-600">
                    {analyticsData.payments.averageDays.toFixed(0)} {translations["days"]} avg
                  </Span>
                </Container>
              </Container>
              <Container className="bg-purple-100 rounded-full p-3">
                <Target className="w-6 h-6 text-purple-600" />
              </Container>
            </Container>
          </Container>

          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Active Clients"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {analyticsData.clients.active}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <Span className="text-sm text-orange-600">
                    of {analyticsData.clients.total} total
                  </Span>
                </Container>
              </Container>
              <Container className="bg-orange-100 rounded-full p-3">
                <Users className="w-6 h-6 text-orange-600" />
              </Container>
            </Container>
          </Container>
        </Container>

        {/* Charts and Analytics */}
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {translations["Monthly Revenue"]}
              </h3>
              <Container className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <Span className="text-sm text-gray-500">Last 12 months</Span>
              </Container>
            </Container>
            <Container className="space-y-3">
              {analyticsData.revenue.monthlyData.map((month, index) => (
                <Container key={index} className="space-y-1">
                  <Container className="flex items-center justify-between">
                    <Span className="text-sm font-medium text-gray-700">{month.month}</Span>
                    <Container className="text-right">
                      <Span className="text-sm font-medium text-gray-900">
                        {formatCurrency(month.revenue)}
                      </Span>
                      <Span className="text-xs text-gray-500 block">
                        {month.count} invoices
                      </Span>
                    </Container>
                  </Container>
                  <Container className="w-full bg-gray-200 rounded-full h-2">
                    <Container
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((month.revenue / Math.max(...analyticsData.revenue.monthlyData.map(m => m.revenue))) * 100, 100)}%` 
                      }}
                    />
                  </Container>
                </Container>
              ))}
            </Container>
          </Container>

          {/* Invoice Status Distribution */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {translations["Invoice Status"]}
              </h3>
              <PieChart className="w-4 h-4 text-green-500" />
            </Container>
            <Container className="space-y-4">
              {Object.entries(analyticsData.invoices.statusDistribution).map(([status, count]) => {
                const percentage = analyticsData.invoices.total > 0 ? (count / analyticsData.invoices.total) * 100 : 0;
                const statusColors = {
                  'Draft': 'bg-gray-400',
                  'Sent': 'bg-blue-400',
                  'Paid': 'bg-green-400',
                  'Overdue': 'bg-red-400',
                  'Voided': 'bg-gray-400',
                };
                
                return (
                  <Container key={status} className="flex items-center justify-between">
                    <Container className="flex items-center gap-3">
                      <Container className={`w-3 h-3 rounded-full ${statusColors[status] || 'bg-gray-400'}`} />
                      <Span className="text-sm font-medium text-gray-700">
                        {translations[status] || status}
                      </Span>
                    </Container>
                    <Container className="text-right">
                      <Span className="text-sm font-medium text-gray-900">{count}</Span>
                      <Span className="text-xs text-gray-500 block">
                        {percentage.toFixed(1)}%
                      </Span>
                    </Container>
                  </Container>
                );
              })}
            </Container>
          </Container>
        </Container>

        {/* Detailed Analytics */}
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Clients */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {translations["Top Performing Clients"]}
              </h3>
              <FilledButton
                isIcon={true}
                icon={ArrowUpRight}
                iconSize="w-4 h-4"
                bgColor="bg-blue-100 hover:bg-blue-200"
                textColor="text-blue-700"
                rounded="rounded-lg"
                buttonText={translations["View Details"]}
                height="h-8"
                px="px-3"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => navigate("/admin/clients")}
              />
            </Container>
            <Container className="space-y-4">
              {analyticsData.clients.topClients.slice(0, 5).map((client, index) => (
                <Container key={client.clientId} className="flex items-center justify-between">
                  <Container className="flex items-center gap-3">
                    <Container className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
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
                  <Span className="text-sm font-medium text-gray-900">
                    {formatCurrency(client.revenue)}
                  </Span>
                </Container>
              ))}
            </Container>
          </Container>

          {/* Payment Methods */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {translations["Payment Methods"]}
              </h3>
              <CreditCard className="w-4 h-4 text-purple-500" />
            </Container>
            <Container className="space-y-4">
              {Object.entries(analyticsData.payments.methodDistribution).map(([method, percentage]) => (
                <Container key={method} className="space-y-2">
                  <Container className="flex items-center justify-between">
                    <Span className="text-sm font-medium text-gray-700">
                      {translations[method] || method}
                    </Span>
                    <Span className="text-sm text-gray-900">{percentage}%</Span>
                  </Container>
                  <Container className="w-full bg-gray-200 rounded-full h-2">
                    <Container
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </Container>
                </Container>
              ))}
            </Container>
          </Container>

          {/* Top Products/Services */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {translations["Top Products/Services"]}
              </h3>
              <Package className="w-4 h-4 text-green-500" />
            </Container>
            <Container className="space-y-4">
              {analyticsData.products.topProducts.map((product, index) => (
                <Container key={product.name} className="flex items-center justify-between">
                  <Container className="flex items-center gap-3">
                    <Container className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-600" />
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-900">
                        {product.name}
                      </Span>
                      <Span className="text-xs text-gray-500 block">
                        {product.count} sold
                      </Span>
                    </Container>
                  </Container>
                  <Span className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.revenue)}
                  </Span>
                </Container>
              ))}
            </Container>
          </Container>
        </Container>

        {/* Aging Report */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Container className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {translations["Aging Report"]}
            </h3>
            <Container className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <Span className="text-sm text-gray-500">Outstanding invoices by age</Span>
            </Container>
          </Container>
          
          <Container className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {agingReport && Object.entries(agingReport).map(([category, amount]) => {
              if (category === 'generatedAt' || category === 'totalOutstanding') return null;
              
              const categoryLabels = {
                'current': translations.Current,
                'days1to30': translations["1-30 Days"],
                'days31to60': translations["31-60 Days"],
                'days61to90': translations["61-90 Days"],
                'over90Days': translations["Over 90 Days"],
              };
              
              const categoryColors = {
                'current': 'bg-green-100 text-green-800',
                'days1to30': 'bg-yellow-100 text-yellow-800',
                'days31to60': 'bg-orange-100 text-orange-800',
                'days61to90': 'bg-red-100 text-red-800',
                'over90Days': 'bg-red-200 text-red-900',
              };
              
              return (
                <Container key={category} className={`p-4 rounded-lg ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
                  <Span className="text-sm font-medium block mb-1">
                    {categoryLabels[category] || category}
                  </Span>
                  <Span className="text-lg font-bold">
                    {formatCurrency(amount)}
                  </Span>
                </Container>
              );
            })}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default InvoiceAnalytics;