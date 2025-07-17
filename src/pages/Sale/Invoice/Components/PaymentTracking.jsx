import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Building,
  FileText,
  Receipt,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Banknote,
  Wallet,
  Target,
  PieChart,
  BarChart3,
  RefreshCw,
  Send,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Context imports
import { useInvoices } from "../../../../Contexts/InvoiceContext/InvoiceContext";
import { useClients } from "../../../../Contexts/apiClientContext/apiClientContext";

// Component imports
import FilledButton from "../../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../../components/elements/container/Container";
import Span from "../../../../components/elements/span/Span";
import Modall from "../../../../components/elements/modal/Modal";

const PaymentTracking = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Payment Tracking": language === "ar" ? "تتبع المدفوعات" : "Payment Tracking",
    "Record Payment": language === "ar" ? "تسجيل دفعة" : "Record Payment",
    "Payment History": language === "ar" ? "سجل المدفوعات" : "Payment History",
    "Payment Overview": language === "ar" ? "نظرة عامة على المدفوعات" : "Payment Overview",
    "Total Received": language === "ar" ? "إجمالي المستلم" : "Total Received",
    "Outstanding": language === "ar" ? "المستحق" : "Outstanding",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "Average Payment": language === "ar" ? "متوسط الدفع" : "Average Payment",
    "Payment Methods": language === "ar" ? "طرق الدفع" : "Payment Methods",
    "Recent Payments": language === "ar" ? "المدفوعات الأخيرة" : "Recent Payments",
    "Overdue Payments": language === "ar" ? "المدفوعات المتأخرة" : "Overdue Payments",
    "Payment Trends": language === "ar" ? "اتجاهات الدفع" : "Payment Trends",
    "Payment Number": language === "ar" ? "رقم الدفع" : "Payment Number",
    "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
    "Client": language === "ar" ? "العميل" : "Client",
    "Amount": language === "ar" ? "المبلغ" : "Amount",
    "Payment Date": language === "ar" ? "تاريخ الدفع" : "Payment Date",
    "Payment Method": language === "ar" ? "طريقة الدفع" : "Payment Method",
    "Reference": language === "ar" ? "المرجع" : "Reference",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Actions": language === "ar" ? "الإجراءات" : "Actions",
    "View": language === "ar" ? "عرض" : "View",
    "Edit": language === "ar" ? "تعديل" : "Edit",
    "Delete": language === "ar" ? "حذف" : "Delete",
    "Download Receipt": language === "ar" ? "تحميل الإيصال" : "Download Receipt",
    "Send Receipt": language === "ar" ? "إرسال الإيصال" : "Send Receipt",
    "Cash": language === "ar" ? "نقدي" : "Cash",
    "Credit Card": language === "ar" ? "بطاقة ائتمان" : "Credit Card",
    "Bank Transfer": language === "ar" ? "حوالة بنكية" : "Bank Transfer",
    "Check": language === "ar" ? "شيك" : "Check",
    "PayPal": language === "ar" ? "باي بال" : "PayPal",
    "Other": language === "ar" ? "أخرى" : "Other",
    "Completed": language === "ar" ? "مكتمل" : "Completed",
    "Pending": language === "ar" ? "قيد الانتظار" : "Pending",
    "Failed": language === "ar" ? "فشل" : "Failed",
    "Refunded": language === "ar" ? "مستردة" : "Refunded",
    "Search payments...": language === "ar" ? "البحث في المدفوعات..." : "Search payments...",
    "Filter by method": language === "ar" ? "تصفية حسب الطريقة" : "Filter by method",
    "Filter by status": language === "ar" ? "تصفية حسب الحالة" : "Filter by status",
    "Date Range": language === "ar" ? "نطاق التاريخ" : "Date Range",
    "From": language === "ar" ? "من" : "From",
    "To": language === "ar" ? "إلى" : "To",
    "Apply Filters": language === "ar" ? "تطبيق المرشحات" : "Apply Filters",
    "Clear Filters": language === "ar" ? "مسح المرشحات" : "Clear Filters",
    "Export": language === "ar" ? "تصدير" : "Export",
    "Refresh": language === "ar" ? "تحديث" : "Refresh",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No payments found": language === "ar" ? "لم يتم العثور على مدفوعات" : "No payments found",
    "Payment Details": language === "ar" ? "تفاصيل الدفع" : "Payment Details",
    "Invoice Details": language === "ar" ? "تفاصيل الفاتورة" : "Invoice Details",
    "Client Details": language === "ar" ? "تفاصيل العميل" : "Client Details",
    "Payment Notes": language === "ar" ? "ملاحظات الدفع" : "Payment Notes",
    "Created": language === "ar" ? "تم الإنشاء" : "Created",
    "Updated": language === "ar" ? "تم التحديث" : "Updated",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "This action cannot be undone": language === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone",
    "Cancel": language === "ar" ? "إلغاء" : "Cancel",
    "Confirm": language === "ar" ? "تأكيد" : "Confirm",
    "Previous": language === "ar" ? "السابق" : "Previous",
    "Next": language === "ar" ? "التالي" : "Next",
    "Showing": language === "ar" ? "عرض" : "Showing",
    "of": language === "ar" ? "من" : "of",
    "results": language === "ar" ? "نتائج" : "results",
    "vs last month": language === "ar" ? "مقابل الشهر الماضي" : "vs last month",
    "Payment Success Rate": language === "ar" ? "معدل نجاح الدفع" : "Payment Success Rate",
    "All Methods": language === "ar" ? "جميع الطرق" : "All Methods",
    "All Statuses": language === "ar" ? "جميع الحالات" : "All Statuses",
    "View All": language === "ar" ? "عرض الكل" : "View All",
    "days ago": language === "ar" ? "أيام مضت" : "days ago",
    "today": language === "ar" ? "اليوم" : "today",
    "yesterday": language === "ar" ? "أمس" : "yesterday",
  };

  // Context hooks
  const {
    invoices,
    loading,
    getInvoices,
    markInvoiceAsPaid,
  } = useInvoices();

  const { clients, getClients } = useClients();

  // Mock payment data - in real app this would come from a payments context
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [actionDropdown, setActionDropdown] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Payment statistics
  const [paymentStats, setPaymentStats] = useState({
    totalReceived: 0,
    thisMonth: 0,
    outstanding: 0,
    averagePayment: 0,
    successRate: 0,
    methodDistribution: {},
    monthlyTrends: [],
  });

  // Load data on mount
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
      return;
    }

    loadPaymentData();
  }, [token]);

  const loadPaymentData = async () => {
    try {
      setLoading2(true);
      await Promise.all([
        getInvoices(),
        getClients(),
      ]);
      generateMockPaymentData();
    } catch (error) {
      console.error("Error loading payment data:", error);
    } finally {
      setLoading2(false);
    }
  };

  // Generate mock payment data from invoices
  const generateMockPaymentData = () => {
    const mockPayments = [];
    let paymentId = 1;

    invoices.forEach(invoice => {
      if (invoice.Status === 'Paid' || invoice.PaidAmount > 0) {
        // Generate payment records for paid invoices
        const paymentMethods = ['Cash', 'Credit Card', 'Bank Transfer', 'Check', 'PayPal'];
        const statuses = ['Completed', 'Pending', 'Failed'];
        
        mockPayments.push({
          id: paymentId++,
          paymentNumber: `PAY-${new Date().getFullYear()}-${paymentId.toString().padStart(4, '0')}`,
          invoiceId: invoice.Id,
          invoiceNumber: invoice.InvoiceNumber,
          clientId: invoice.ClientId,
          clientName: invoice.ClientName,
          clientEmail: invoice.ClientEmail,
          amount: invoice.PaidAmount || invoice.TotalAmount,
          paymentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          reference: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          notes: Math.random() > 0.5 ? "Payment received successfully" : "",
          currency: invoice.Currency || 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
    calculatePaymentStats(mockPayments);
    
    // Update pagination
    setPagination(prev => ({
      ...prev,
      totalItems: mockPayments.length,
      totalPages: Math.ceil(mockPayments.length / prev.pageSize),
    }));
  };

  // Calculate payment statistics
  const calculatePaymentStats = (paymentData) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const completedPayments = paymentData.filter(p => p.status === 'Completed');
    const totalReceived = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const thisMonthPayments = completedPayments.filter(p => new Date(p.paymentDate) >= thisMonth);
    const thisMonthTotal = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const averagePayment = completedPayments.length > 0 ? totalReceived / completedPayments.length : 0;
    const successRate = paymentData.length > 0 ? (completedPayments.length / paymentData.length) * 100 : 0;
    
    // Method distribution
    const methodDistribution = {};
    paymentData.forEach(payment => {
      methodDistribution[payment.paymentMethod] = (methodDistribution[payment.paymentMethod] || 0) + 1;
    });
    
    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthPayments = completedPayments.filter(p => {
        const paymentDate = new Date(p.paymentDate);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });
      
      monthlyTrends.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        amount: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        count: monthPayments.length,
      });
    }
    
    setPaymentStats({
      totalReceived,
      thisMonth: thisMonthTotal,
      outstanding: invoices.reduce((sum, inv) => sum + (inv.BalanceAmount || 0), 0),
      averagePayment,
      successRate,
      methodDistribution,
      monthlyTrends,
    });
  };

  // Filter payments
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMethod) {
      filtered = filtered.filter(payment => payment.paymentMethod === selectedMethod);
    }

    if (selectedStatus) {
      filtered = filtered.filter(payment => payment.status === selectedStatus);
    }

    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= new Date(dateRange.from) && paymentDate <= new Date(dateRange.to);
      });
    }

    setFilteredPayments(filtered);
    setPagination(prev => ({
      ...prev,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.pageSize),
      page: 1,
    }));
  }, [searchTerm, selectedMethod, selectedStatus, dateRange, payments]);

  // Get paginated payments
  const getPaginatedPayments = () => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredPayments.slice(startIndex, endIndex);
  };

  // Handle actions
  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handleEditPayment = (payment) => {
    // Navigate to edit payment form
    console.log("Edit payment:", payment);
  };

  const handleDeletePayment = (payment) => {
    setPaymentToDelete(payment);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (paymentToDelete) {
      setPayments(payments.filter(p => p.id !== paymentToDelete.id));
      setShowDeleteModal(false);
      setPaymentToDelete(null);
    }
  };

  const handleDownloadReceipt = (payment) => {
    // Generate and download receipt
    console.log("Download receipt for:", payment);
  };

  const handleSendReceipt = (payment) => {
    // Send receipt to client
    console.log("Send receipt for:", payment);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMethod("");
    setSelectedStatus("");
    setDateRange({ from: "", to: "" });
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> };
      case 'failed':
        return { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> };
      case 'refunded':
        return { color: 'bg-gray-100 text-gray-800', icon: <ArrowDownRight className="w-4 h-4" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4" /> };
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'cash':
        return <Banknote className="w-4 h-4" />;
      case 'credit card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank transfer':
        return <Building className="w-4 h-4" />;
      case 'check':
        return <Receipt className="w-4 h-4" />;
      case 'paypal':
        return <Wallet className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
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

  // Get relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const paymentDate = new Date(date);
    const diffInDays = Math.floor((now - paymentDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return translations.today;
    if (diffInDays === 1) return translations.yesterday;
    return `${diffInDays} ${translations["days ago"]}`;
  };

  // Loading state
  if (loading || loading2) {
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
              {translations["Payment Tracking"]}
            </h1>
            <Span className="text-sm text-gray-500">
              Monitor and manage all payment transactions
            </Span>
          </Container>

          <Container className="flex gap-3">
            <FilledButton
              isIcon={true}
              icon={RefreshCw}
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
              onClick={loadPaymentData}
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
              onClick={() => {/* Handle export */}}
            />

            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Record Payment"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/payments/new")}
            />
          </Container>
        </Container>

        {/* Stats Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Total Received"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {formatCurrency(paymentStats.totalReceived)}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <Span className="text-sm text-green-600">
                    +15% {translations["vs last month"]}
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
                  {translations["This Month"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {formatCurrency(paymentStats.thisMonth)}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <Span className="text-sm text-blue-600">
                    +8% {translations["vs last month"]}
                  </Span>
                </Container>
              </Container>
              <Container className="bg-blue-100 rounded-full p-3">
                <Calendar className="w-6 h-6 text-blue-600" />
              </Container>
            </Container>
          </Container>

          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <Span className="text-sm font-medium text-gray-500">
                  {translations["Average Payment"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {formatCurrency(paymentStats.averagePayment)}
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <Span className="text-sm text-red-600">
                    -2% {translations["vs last month"]}
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
                  {translations["Payment Success Rate"]}
                </Span>
                <Span className="text-2xl font-bold text-gray-900 block">
                  {paymentStats.successRate.toFixed(1)}%
                </Span>
                <Container className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <Span className="text-sm text-green-600">
                    +3% {translations["vs last month"]}
                  </Span>
                </Container>
              </Container>
              <Container className="bg-orange-100 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </Container>
            </Container>
          </Container>
        </Container>

        {/* Charts */}
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payment Trends */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {translations["Payment Trends"]}
            </h3>
            <Container className="space-y-4">
              {paymentStats.monthlyTrends.map((month, index) => (
                <Container key={index} className="space-y-2">
                  <Container className="flex items-center justify-between">
                    <Span className="text-sm font-medium text-gray-700">{month.month}</Span>
                    <Span className="text-sm text-gray-500">{formatCurrency(month.amount)}</Span>
                  </Container>
                  <Container className="w-full bg-gray-200 rounded-full h-2">
                    <Container
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((month.amount / Math.max(...paymentStats.monthlyTrends.map(m => m.amount))) * 100, 100)}%` }}
                    />
                  </Container>
                </Container>
              ))}
            </Container>
          </Container>

          {/* Payment Methods */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {translations["Payment Methods"]}
            </h3>
            <Container className="space-y-4">
              {Object.entries(paymentStats.methodDistribution).map(([method, count]) => (
                <Container key={method} className="flex items-center justify-between">
                  <Container className="flex items-center gap-3">
                    <Container className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getPaymentMethodIcon(method)}
                    </Container>
                    <Span className="text-sm font-medium text-gray-700">{method}</Span>
                  </Container>
                  <Span className="text-sm text-gray-500">{count} payments</Span>
                </Container>
              ))}
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
                  placeholder={translations["Search payments..."]}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>

              {/* Method Filter */}
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{translations["All Methods"]}</option>
                <option value="Cash">{translations.Cash}</option>
                <option value="Credit Card">{translations["Credit Card"]}</option>
                <option value="Bank Transfer">{translations["Bank Transfer"]}</option>
                <option value="Check">{translations.Check}</option>
                <option value="PayPal">{translations.PayPal}</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{translations["All Statuses"]}</option>
                <option value="Completed">{translations.Completed}</option>
                <option value="Pending">{translations.Pending}</option>
                <option value="Failed">{translations.Failed}</option>
                <option value="Refunded">{translations.Refunded}</option>
              </select>

              {/* Date Range */}
              <Container className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Span className="text-gray-500">to</Span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
            </Container>

            {/* Clear Filters */}
            {(searchTerm || selectedMethod || selectedStatus || dateRange.from || dateRange.to) && (
              <FilledButton
                isIcon={true}
                icon={XCircle}
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
                onClick={clearFilters}
              />
            )}
          </Container>
        </Container>

        {/* Payments Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Container className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations["Payment Number"]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations["Invoice"]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.Client}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.Amount}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations["Payment Method"]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations["Payment Date"]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.Status}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.Actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedPayments().map((payment) => {
                  const statusDisplay = getStatusDisplay(payment.status);
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container className="flex items-center gap-3">
                          <Container className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-blue-600" />
                          </Container>
                          <Container>
                            <Span className="text-sm font-medium text-gray-900">
                              {payment.paymentNumber}
                            </Span>
                            <Span className="text-xs text-gray-500 block">
                              {payment.reference}
                            </Span>
                          </Container>
                        </Container>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <Span className="text-sm text-gray-900">
                            {payment.invoiceNumber}
                          </Span>
                        </Container>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <Container>
                            <Span className="text-sm font-medium text-gray-900">
                              {payment.clientName}
                            </Span>
                            <Span className="text-xs text-gray-500 block">
                              {payment.clientEmail}
                            </Span>
                          </Container>
                        </Container>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Span className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </Span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <Span className="text-sm text-gray-900">
                            {payment.paymentMethod}
                          </Span>
                        </Container>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container>
                          <Span className="text-sm text-gray-900">
                            {formatDate(payment.paymentDate)}
                          </Span>
                          <Span className="text-xs text-gray-500 block">
                            {getRelativeTime(payment.paymentDate)}
                          </Span>
                        </Container>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                          {statusDisplay.icon}
                          {payment.status}
                        </Span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Container className="flex items-center gap-2">
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
                            onClick={() => handleViewPayment(payment)}
                          />
                          <Container className="relative">
                            <FilledButton
                              isIcon={true}
                              icon={MoreVertical}
                              iconSize="w-4 h-4"
                              bgColor="bg-gray-100 hover:bg-gray-200"
                              textColor="text-gray-700"
                              rounded="rounded-lg"
                              buttonText=""
                              height="h-8"
                              width="w-8"
                              onClick={() => setActionDropdown(actionDropdown === payment.id ? null : payment.id)}
                            />
                            {actionDropdown === payment.id && (
                              <Container className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <Container className="py-1">
                                  <button
                                    onClick={() => { handleEditPayment(payment); setActionDropdown(null); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    {translations.Edit}
                                  </button>
                                  <button
                                    onClick={() => { handleDownloadReceipt(payment); setActionDropdown(null); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Download className="w-4 h-4" />
                                    {translations["Download Receipt"]}
                                  </button>
                                  <button
                                    onClick={() => { handleSendReceipt(payment); setActionDropdown(null); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Send className="w-4 h-4" />
                                    {translations["Send Receipt"]}
                                  </button>
                                  <hr className="my-1" />
                                  <button
                                    onClick={() => { handleDeletePayment(payment); setActionDropdown(null); }}
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
          {getPaginatedPayments().length === 0 && (
            <Container className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {translations["No payments found"]}
              </h3>
              <Span className="text-gray-500 mb-4">
                No payments match your current filters.
              </Span>
            </Container>
          )}
        </Container>

        {/* Pagination */}
        {filteredPayments.length > 0 && (
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
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              />

              <Container className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === pagination.page;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNumber }))}
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
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
              />
            </Container>
          </Container>
        )}
      </Container>

      {/* Payment Details Modal */}
      <Modall
        modalOpen={showPaymentModal}
        setModalOpen={setShowPaymentModal}
        title={
          <Container className="flex items-center gap-2 text-blue-600">
            <Receipt className="w-5 h-5" />
            <Span>{translations["Payment Details"]}</Span>
          </Container>
        }
        width={600}
        okText="Close"
        cancelText=""
        okAction={() => setShowPaymentModal(false)}
        body={
          selectedPayment && (
            <Container className="py-4 space-y-6">
              <Container className="grid grid-cols-2 gap-4">
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Payment Number"]}
                  </Span>
                  <Span className="text-lg font-semibold text-gray-900">
                    {selectedPayment.paymentNumber}
                  </Span>
                </Container>
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Amount}
                  </Span>
                  <Span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </Span>
                </Container>
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Payment Method"]}
                  </Span>
                  <Container className="flex items-center gap-2">
                    {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                    <Span className="text-gray-900">{selectedPayment.paymentMethod}</Span>
                  </Container>
                </Container>
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Status}
                  </Span>
                  <Container className="flex items-center gap-2">
                    {getStatusDisplay(selectedPayment.status).icon}
                    <Span className="text-gray-900">{selectedPayment.status}</Span>
                  </Container>
                </Container>
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Payment Date"]}
                  </Span>
                  <Span className="text-gray-900">
                    {formatDate(selectedPayment.paymentDate)}
                  </Span>
                </Container>
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Reference}
                  </Span>
                  <Span className="text-gray-900">{selectedPayment.reference}</Span>
                </Container>
              </Container>

              <hr className="border-gray-200" />

              <Container className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {translations["Invoice Details"]}
                </h4>
                <Container className="grid grid-cols-2 gap-4">
                  <Container>
                    <Span className="text-sm font-medium text-gray-500 block mb-1">
                      {translations["Invoice Number"]}
                    </Span>
                    <Span className="text-gray-900">{selectedPayment.invoiceNumber}</Span>
                  </Container>
                  <Container>
                    <Span className="text-sm font-medium text-gray-500 block mb-1">
                      {translations["Client Name"]}
                    </Span>
                    <Span className="text-gray-900">{selectedPayment.clientName}</Span>
                  </Container>
                </Container>
              </Container>

              {selectedPayment.notes && (
                <Container className="space-y-2">
                  <Span className="text-sm font-medium text-gray-500 block">
                    {translations["Payment Notes"]}
                  </Span>
                  <Span className="text-gray-900">{selectedPayment.notes}</Span>
                </Container>
              )}
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
            <Span>Delete Payment</Span>
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
              {translations["This action cannot be undone"]}. This will permanently delete the payment record{" "}
              <strong>"{paymentToDelete?.paymentNumber}"</strong>.
            </Span>
          </Container>
        }
      />
    </Container>
  );
};

export default PaymentTracking;