import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  AlertTriangle,
  Star,
  Layers,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Activity,
  Target,
  Award,
  ShoppingCart,
  Users,
  Building,
  Tag,
  Image,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const ProductStatistics = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Product Statistics":
      language === "ar" ? "إحصائيات المنتجات" : "Product Statistics",
    "Back to Products":
      language === "ar" ? "العودة للمنتجات" : "Back to Products",
    Dashboard: language === "ar" ? "لوحة التحكم" : "Dashboard",
    Overview: language === "ar" ? "نظرة عامة" : "Overview",
    Analytics: language === "ar" ? "التحليلات" : "Analytics",
    Reports: language === "ar" ? "التقارير" : "Reports",
    Export: language === "ar" ? "تصدير" : "Export",
    Refresh: language === "ar" ? "تحديث" : "Refresh",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "Total Products": language === "ar" ? "إجمالي المنتجات" : "Total Products",
    "Active Products":
      language === "ar" ? "المنتجات النشطة" : "Active Products",
    "Inactive Products":
      language === "ar" ? "المنتجات غير النشطة" : "Inactive Products",
    "Inventory Value": language === "ar" ? "قيمة المخزون" : "Inventory Value",
    "Average Price": language === "ar" ? "متوسط السعر" : "Average Price",
    "Low Stock Items":
      language === "ar" ? "عناصر مخزون منخفض" : "Low Stock Items",
    "Out of Stock": language === "ar" ? "نفد المخزون" : "Out of Stock",
    "Recently Added": language === "ar" ? "مضاف حديثاً" : "Recently Added",
    Categories: language === "ar" ? "الفئات" : "Categories",
    Brands: language === "ar" ? "العلامات التجارية" : "Brands",
    Images: language === "ar" ? "الصور" : "Images",
    "Products without Images":
      language === "ar" ? "منتجات بدون صور" : "Products without Images",
    "Products with Images":
      language === "ar" ? "منتجات مع صور" : "Products with Images",
    "Top Categories": language === "ar" ? "أفضل الفئات" : "Top Categories",
    "Top Brands": language === "ar" ? "أفضل العلامات التجارية" : "Top Brands",
    "Top Products": language === "ar" ? "أفضل المنتجات" : "Top Products",
    "Price Analysis": language === "ar" ? "تحليل الأسعار" : "Price Analysis",
    "Stock Analysis": language === "ar" ? "تحليل المخزون" : "Stock Analysis",
    "Performance Metrics":
      language === "ar" ? "مقاييس الأداء" : "Performance Metrics",
    "Product Trends": language === "ar" ? "اتجاهات المنتجات" : "Product Trends",
    "Monthly Trends":
      language === "ar" ? "الاتجاهات الشهرية" : "Monthly Trends",
    "Category Distribution":
      language === "ar" ? "توزيع الفئات" : "Category Distribution",
    "Brand Performance":
      language === "ar" ? "أداء العلامات التجارية" : "Brand Performance",
    "Pricing Distribution":
      language === "ar" ? "توزيع الأسعار" : "Pricing Distribution",
    "Stock Status": language === "ar" ? "حالة المخزون" : "Stock Status",
    "Product Alerts": language === "ar" ? "تنبيهات المنتجات" : "Product Alerts",
    "Quick Actions": language === "ar" ? "إجراءات سريعة" : "Quick Actions",
    "View All Products":
      language === "ar" ? "عرض جميع المنتجات" : "View All Products",
    "Manage Categories":
      language === "ar" ? "إدارة الفئات" : "Manage Categories",
    "Manage Brands":
      language === "ar" ? "إدارة العلامات التجارية" : "Manage Brands",
    "Add New Product":
      language === "ar" ? "إضافة منتج جديد" : "Add New Product",
    "Export Data": language === "ar" ? "تصدير البيانات" : "Export Data",
    "High Value Products":
      language === "ar" ? "منتجات عالية القيمة" : "High Value Products",
    "Low Value Products":
      language === "ar" ? "منتجات منخفضة القيمة" : "Low Value Products",
    "Products without Prices":
      language === "ar" ? "منتجات بدون أسعار" : "Products without Prices",
    "Stale Products": language === "ar" ? "منتجات قديمة" : "Stale Products",
    "Need Attention": language === "ar" ? "تحتاج انتباه" : "Need Attention",
    "All Good": language === "ar" ? "كل شيء على ما يرام" : "All Good",
    Warning: language === "ar" ? "تحذير" : "Warning",
    Critical: language === "ar" ? "حرج" : "Critical",
    products: language === "ar" ? "منتجات" : "products",
    items: language === "ar" ? "عناصر" : "items",
    categories: language === "ar" ? "فئات" : "categories",
    brands: language === "ar" ? "علامات تجارية" : "brands",
    images: language === "ar" ? "صور" : "images",
    "No data available":
      language === "ar" ? "لا توجد بيانات متاحة" : "No data available",
    "Data updated": language === "ar" ? "تم تحديث البيانات" : "Data updated",
    "Failed to load statistics":
      language === "ar"
        ? "فشل في تحميل الإحصائيات"
        : "Failed to load statistics",
    Retry: language === "ar" ? "إعادة المحاولة" : "Retry",
    "Last updated": language === "ar" ? "آخر تحديث" : "Last updated",
    "minutes ago": language === "ar" ? "دقائق مضت" : "minutes ago",
    "hours ago": language === "ar" ? "ساعات مضت" : "hours ago",
    "days ago": language === "ar" ? "أيام مضت" : "days ago",
    "Just now": language === "ar" ? "الآن" : "Just now",
    "Key Performance Indicators":
      language === "ar"
        ? "مؤشرات الأداء الرئيسية"
        : "Key Performance Indicators",
    "Inventory Management":
      language === "ar" ? "إدارة المخزون" : "Inventory Management",
    "Product Distribution":
      language === "ar" ? "توزيع المنتجات" : "Product Distribution",
    "Quality Metrics": language === "ar" ? "مقاييس الجودة" : "Quality Metrics",
    "Business Intelligence":
      language === "ar" ? "ذكاء الأعمال" : "Business Intelligence",
    "Operational Metrics":
      language === "ar" ? "المقاييس التشغيلية" : "Operational Metrics",
    "Financial Metrics":
      language === "ar" ? "المقاييس المالية" : "Financial Metrics",
    "Product Health": language === "ar" ? "صحة المنتج" : "Product Health",
    "Market Analysis": language === "ar" ? "تحليل السوق" : "Market Analysis",
    "Growth Indicators":
      language === "ar" ? "مؤشرات النمو" : "Growth Indicators",
    "Efficiency Metrics":
      language === "ar" ? "مقاييس الكفاءة" : "Efficiency Metrics",
    Revenue: language === "ar" ? "الإيرادات" : "Revenue",
    Cost: language === "ar" ? "التكلفة" : "Cost",
    Profit: language === "ar" ? "الربح" : "Profit",
    Margin: language === "ar" ? "الهامش" : "Margin",
    ROI: language === "ar" ? "عائد الاستثمار" : "ROI",
    Turnover: language === "ar" ? "معدل الدوران" : "Turnover",
    Velocity: language === "ar" ? "السرعة" : "Velocity",
    Conversion: language === "ar" ? "التحويل" : "Conversion",
    Engagement: language === "ar" ? "المشاركة" : "Engagement",
    Satisfaction: language === "ar" ? "الرضا" : "Satisfaction",
    Retention: language === "ar" ? "الاحتفاظ" : "Retention",
    Acquisition: language === "ar" ? "الاستحواذ" : "Acquisition",
    Churn: language === "ar" ? "معدل الانخفاض" : "Churn",
    "Lifetime Value":
      language === "ar" ? "القيمة مدى الحياة" : "Lifetime Value",
    "Customer Segment":
      language === "ar" ? "شريحة العملاء" : "Customer Segment",
    "Market Share": language === "ar" ? "حصة السوق" : "Market Share",
    "Competitive Position":
      language === "ar" ? "الموقع التنافسي" : "Competitive Position",
    "Product Lifecycle":
      language === "ar" ? "دورة حياة المنتج" : "Product Lifecycle",
    "Innovation Index":
      language === "ar" ? "مؤشر الابتكار" : "Innovation Index",
    "Quality Score": language === "ar" ? "نقاط الجودة" : "Quality Score",
    "Compliance Rate": language === "ar" ? "معدل الامتثال" : "Compliance Rate",
    "Risk Assessment": language === "ar" ? "تقييم المخاطر" : "Risk Assessment",
    "Opportunity Analysis":
      language === "ar" ? "تحليل الفرص" : "Opportunity Analysis",
  };

  // Get products context
  const {
    statistics,
    loading: statsLoading,
    error,
    getStatisticsOverview,
    getStatisticsCategories,
    getStatisticsPricing,
    getStatisticsTopProducts,
    getStatisticsBrands,
    getStatisticsTrends,
    getStatisticsAlerts,
    getStatisticsCounts,
  } = useProductsManager();

  // Local state
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch statistics on component mount
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        await Promise.all([
          getStatisticsOverview(),
          getStatisticsCategories(),
          getStatisticsPricing(),
          getStatisticsTopProducts(),
          getStatisticsBrands(),
          getStatisticsTrends(),
          getStatisticsAlerts(),
          getStatisticsCounts(),
        ]);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    if (token) {
      fetchStatistics();
    }
  }, [token]);

  // Check authentication
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Refresh statistics
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        getStatisticsOverview(),
        getStatisticsCategories(),
        getStatisticsPricing(),
        getStatisticsTopProducts(),
        getStatisticsBrands(),
        getStatisticsTrends(),
        getStatisticsAlerts(),
        getStatisticsCounts(),
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing statistics:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return translations["Just now"];
    if (diffInMinutes < 60)
      return `${diffInMinutes} ${translations["minutes ago"]}`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} ${translations["hours ago"]}`;
    return `${Math.floor(diffInMinutes / 1440)} ${translations["days ago"]}`;
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format number
  const formatNumber = (value) => {
    if (!value) return "0";
    return new Intl.NumberFormat().format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (!value) return "0%";
    return `${value.toFixed(1)}%`;
  };

  // Statistics Card Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor,
    trend,
    trendValue,
    isCurrency = false,
    isPercentage = false,
    size = "normal",
  }) => (
    <Container
      className={`bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${
        size === "large" ? "p-8" : "p-6"
      }`}
    >
      <Container className="flex items-center justify-between">
        <Container>
          <Span
            className={`text-gray-500 font-medium ${
              size === "large" ? "text-base" : "text-sm"
            }`}
          >
            {title}
          </Span>
          <Container className="flex items-center gap-2 mt-1">
            <Span
              className={`font-bold text-gray-900 ${
                size === "large" ? "text-3xl" : "text-2xl"
              }`}
            >
              {isCurrency
                ? formatCurrency(value)
                : isPercentage
                ? formatPercentage(value)
                : formatNumber(value)}
            </Span>
            {trend && (
              <Container className="flex items-center gap-1">
                {trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : trend === "down" ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Activity className="w-4 h-4 text-gray-500" />
                )}
                <Span
                  className={`text-sm ${
                    trend === "up"
                      ? "text-green-600"
                      : trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {trendValue}
                </Span>
              </Container>
            )}
          </Container>
        </Container>
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
      </Container>
    </Container>
  );

  // Alert Card Component
  const AlertCard = ({ type, title, count, items, icon: Icon }) => {
    const getAlertColor = () => {
      switch (type) {
        case "critical":
          return "border-red-200 bg-red-50";
        case "warning":
          return "border-yellow-200 bg-yellow-50";
        case "info":
          return "border-blue-200 bg-blue-50";
        default:
          return "border-gray-200 bg-gray-50";
      }
    };

    const getIconColor = () => {
      switch (type) {
        case "critical":
          return "text-red-600";
        case "warning":
          return "text-yellow-600";
        case "info":
          return "text-blue-600";
        default:
          return "text-gray-600";
      }
    };

    return (
      <Container className={`border-2 rounded-lg p-4 ${getAlertColor()}`}>
        <Container className="flex items-center justify-between mb-2">
          <Container className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${getIconColor()}`} />
            <Span className="font-medium text-gray-900">{title}</Span>
          </Container>
          <Span className={`text-sm font-bold ${getIconColor()}`}>{count}</Span>
        </Container>
        {items && items.length > 0 && (
          <Container className="space-y-1">
            {items.slice(0, 3).map((item, index) => (
              <Container
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <Span className="text-gray-700 truncate">{item.name}</Span>
                <Span className="text-gray-500 ml-2">{item.value}</Span>
              </Container>
            ))}
            {items.length > 3 && (
              <Span className="text-xs text-gray-500">
                +{items.length - 3} more
              </Span>
            )}
          </Container>
        )}
      </Container>
    );
  };

  // Top Items List Component
  const TopItemsList = ({ title, items, icon: Icon, valueKey = "value" }) => (
    <Container className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <Container className="flex items-center justify-between mb-4">
        <Container className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </Container>
        <FilledButton
          isIcon={true}
          icon={Eye}
          iconSize="w-4 h-4"
          bgColor="bg-blue-100 hover:bg-blue-200"
          textColor="text-blue-700"
          rounded="rounded-md"
          buttonText=""
          height="h-8"
          width="w-8"
        />
      </Container>
      <Container className="space-y-3">
        {items && items.length > 0 ? (
          items.slice(0, 5).map((item, index) => (
            <Container
              key={index}
              className="flex items-center justify-between"
            >
              <Container className="flex items-center gap-3">
                <Container className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Span className="text-blue-600 font-bold text-sm">
                    {index + 1}
                  </Span>
                </Container>
                <Container>
                  <Span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </Span>
                  {item.description && (
                    <Span className="text-xs text-gray-500 block">
                      {item.description}
                    </Span>
                  )}
                </Container>
              </Container>
              <Span className="text-sm font-medium text-gray-900">
                {typeof item[valueKey] === "number"
                  ? formatNumber(item[valueKey])
                  : item[valueKey]}
              </Span>
            </Container>
          ))
        ) : (
          <Container className="text-center py-8">
            <Span className="text-gray-500">
              {translations["No data available"]}
            </Span>
          </Container>
        )}
      </Container>
    </Container>
  );

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Container className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
        </Container>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <Container className="flex items-center gap-4 mb-4 lg:mb-0">
            <Container className="flex items-center gap-2">
              <FilledButton
                isIcon={true}
                icon={ArrowLeft}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText=""
                height="h-8"
                width="w-8"
                onClick={() => navigate("/admin/products")}
                title={translations["Back to Products"]}
              />
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {translations["Product Statistics"]}
              </h1>
            </Container>
            {lastUpdated && (
              <Span className="text-sm text-gray-500">
                {translations["Last updated"]} {formatTimeAgo(lastUpdated)}
              </Span>
            )}
          </Container>

          <Container className="flex gap-3 flex-wrap">
            <Container className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedTimeRange("7d")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeRange === "7d"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                7d
              </button>
              <button
                onClick={() => setSelectedTimeRange("30d")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeRange === "30d"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                30d
              </button>
              <button
                onClick={() => setSelectedTimeRange("90d")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeRange === "90d"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                90d
              </button>
            </Container>

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
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Export}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => console.log("Export statistics")}
            />
          </Container>
        </Container>

        {/* Tab Navigation */}
        <Container className="mb-6">
          <Container className="border-b border-gray-200">
            <Container className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {translations.Overview}
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "performance"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {translations["Performance Metrics"]}
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {translations.Analytics}
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "alerts"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {translations["Product Alerts"]}
              </button>
            </Container>
          </Container>
        </Container>

        {/* Loading State */}
        {statsLoading && (
          <Container className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <Span className="text-blue-500 text-lg block mt-4">
              {translations.Loading}
            </Span>
          </Container>
        )}

        {/* Error State */}
        {error && (
          <Container className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <Span className="text-red-500 text-lg block mb-4">
              {translations["Failed to load statistics"]}
            </Span>
            <FilledButton
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Retry}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={handleRefresh}
            />
          </Container>
        )}

        {/* Tab Content */}
        {!statsLoading && !error && (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <Container className="space-y-6">
                {/* Key Metrics */}
                <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title={translations["Total Products"]}
                    value={statistics?.overview?.TotalProducts || 0}
                    icon={Package}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                    trend="up"
                    trendValue="+5.2%"
                  />
                  <StatCard
                    title={translations["Active Products"]}
                    value={statistics?.overview?.ActiveProducts || 0}
                    icon={CheckCircle}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                    trend="up"
                    trendValue="+3.1%"
                  />
                  <StatCard
                    title={translations["Total Inventory Value"]}
                    value={statistics?.overview?.TotalInventoryValue || 0}
                    icon={DollarSign}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-600"
                    trend="up"
                    trendValue="+12.5%"
                    isCurrency={true}
                  />
                  <StatCard
                    title={translations["Low Stock Items"]}
                    value={
                      statistics?.alerts?.ProductsWithoutPrices?.length || 0
                    }
                    icon={AlertTriangle}
                    bgColor="bg-red-50"
                    iconColor="text-red-600"
                    trend="down"
                    trendValue="-8.3%"
                  />
                </Container>

                {/* Secondary Metrics */}
                <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title={translations["Average Price"]}
                    value={statistics?.overview?.AverageUnitPrice || 0}
                    icon={Target}
                    bgColor="bg-yellow-50"
                    iconColor="text-yellow-600"
                    isCurrency={true}
                  />
                  <StatCard
                    title={translations["Products with Images"]}
                    value={statistics?.overview?.ProductsWithImages || 0}
                    icon={Image}
                    bgColor="bg-indigo-50"
                    iconColor="text-indigo-600"
                  />
                  <StatCard
                    title={translations["Recently Added"]}
                    value={statistics?.overview?.RecentlyAdded || 0}
                    icon={Plus}
                    bgColor="bg-teal-50"
                    iconColor="text-teal-600"
                  />
                  <StatCard
                    title={translations["Total Images"]}
                    value={statistics?.overview?.TotalImages || 0}
                    icon={Image}
                    bgColor="bg-orange-50"
                    iconColor="text-orange-600"
                  />
                </Container>

                {/* Charts and Lists */}
                <Container className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TopItemsList
                    title={translations["Top Categories"]}
                    items={
                      Array.isArray(statistics?.categories)
                        ? statistics.categories.slice(0, 5).map((cat) => ({
                            name: cat.Category,
                            value: cat.Count,
                            description: `${cat.Count} ${translations.products}`,
                          })) || []
                        : []
                    }
                    icon={Layers}
                    valueKey="value"
                  />

                  <TopItemsList
                    title={translations["Top Products"]}
                    items={
                      Array.isArray(statistics?.topProducts)
                        ? statistics.topProducts.slice(0, 5).map((product) => ({
                            name: product.Name,
                            value: formatCurrency(product.UnitPrice),
                            description: product.Category,
                          }))
                        : []
                    }
                    icon={Award}
                    valueKey="value"
                  />
                </Container>
              </Container>
            )}

            {/* Performance Tab */}
            {activeTab === "performance" && (
              <Container className="space-y-6">
                <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard
                    title={translations["Average Selling Price"]}
                    value={statistics?.pricing?.AverageSellingPrice || 0}
                    icon={DollarSign}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                    size="large"
                    isCurrency={true}
                  />
                  <StatCard
                    title={translations["Average Margin"]}
                    value={statistics?.pricing?.AverageMarginPercent || 0}
                    icon={TrendingUp}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                    size="large"
                    isPercentage={true}
                  />
                  <StatCard
                    title={translations["High Margin Products"]}
                    value={statistics?.pricing?.MarginAnalysis?.HighMargin || 0}
                    icon={Award}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-600"
                    size="large"
                  />
                </Container>

                <Container className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Container className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      {translations["Pricing Distribution"]}
                    </h3>
                    <Container className="space-y-4">
                      <Container className="flex items-center justify-between">
                        <Span className="text-sm text-gray-600">Under $50</Span>
                        <Span className="text-sm font-medium text-gray-900">
                          {statistics?.pricing?.PriceRanges?.Under50 || 0}
                        </Span>
                      </Container>
                      <Container className="flex items-center justify-between">
                        <Span className="text-sm text-gray-600">
                          $50 - $200
                        </Span>
                        <Span className="text-sm font-medium text-gray-900">
                          {statistics?.pricing?.PriceRanges?.Range50To200 || 0}
                        </Span>
                      </Container>
                      <Container className="flex items-center justify-between">
                        <Span className="text-sm text-gray-600">
                          $200 - $500
                        </Span>
                        <Span className="text-sm font-medium text-gray-900">
                          {statistics?.pricing?.PriceRanges?.Range200To500 || 0}
                        </Span>
                      </Container>
                      <Container className="flex items-center justify-between">
                        <Span className="text-sm text-gray-600">
                          Over $1000
                        </Span>
                        <Span className="text-sm font-medium text-gray-900">
                          {statistics?.pricing?.PriceRanges?.Over1000 || 0}
                        </Span>
                      </Container>
                    </Container>
                  </Container>

                  <Container className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      {translations["Margin Analysis"]}
                    </h3>
                    <Container className="space-y-4">
                      <Container className="flex items-center justify-between">
                        <Span className="text-sm text-gray-600">
                          High Margin (&gt;50%)
                        </Span>
                        <Span className="text-sm font-medium text-green-600">
                          {statistics?.pricing?.MarginAnalysis?.HighMargin || 0}
                        </Span>
                      </Container>
                      <Container className="flex items-center justify-between">
                        <Span className="text-sm text-gray-600">
                          Good Margin (20-50%)
                        </Span>
                        <Span className="text-sm font-medium text-blue-600">
                          {statistics?.pricing?.MarginAnalysis?.GoodMargin || 0}
                        </Span>
                      </Container>
                      <Container className="flex items-center justify-between">
                        <Span className="text-sm text-gray-600">
                          Low Margin (0-20%)
                        </Span>
                        <Span className="text-sm font-medium text-yellow-600">
                          {statistics?.pricing?.MarginAnalysis?.LowMargin || 0}
                        </Span>
                      </Container>
                      <Container className="flex items-center justify-between">
                        <Span className="text-sm text-gray-600">No Margin</Span>
                        <Span className="text-sm font-medium text-red-600">
                          {statistics?.pricing?.MarginAnalysis?.NoMargin || 0}
                        </Span>
                      </Container>
                    </Container>
                  </Container>
                </Container>
              </Container>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <Container className="space-y-6">
                <Container className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TopItemsList
                    title={translations["Brand Performance"]}
                    items={
                      Array.isArray(statistics?.brands)
                        ? statistics.brands.map((brand) => ({
                            name: brand.Brand,
                            value: brand.ProductCount,
                            description: `${formatCurrency(brand.TotalValue)} ${
                              translations.Revenue
                            }`,
                          })) || []
                        : []
                    }
                    icon={Star}
                    valueKey="value"
                  />

                  <Container className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      {translations["Monthly Trends"]}
                    </h3>
                    <Container className="space-y-4">
                      {Array.isArray(statistics?.trends?.ProductCreation) ? (
                        statistics.trends.ProductCreation.map(
                          (trend, index) => (
                            <Container
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <Span className="text-sm text-gray-600">
                                {trend.Month}/{trend.Year}
                              </Span>
                              <Container className="flex items-center gap-2">
                                <Span className="text-sm font-medium text-gray-900">
                                  {trend.Count}
                                </Span>
                                <Span className="text-sm text-gray-500">
                                  {formatCurrency(trend.TotalValue)}
                                </Span>
                              </Container>
                            </Container>
                          )
                        )
                      ) : (
                        <Container className="text-center py-8">
                          <Span className="text-gray-500">
                            {translations["No data available"]}
                          </Span>
                        </Container>
                      )}
                    </Container>
                  </Container>
                </Container>
              </Container>
            )}

            {/* Alerts Tab */}
            {activeTab === "alerts" && (
              <Container className="space-y-6">
                <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AlertCard
                    type="critical"
                    title={translations["Products without Prices"]}
                    count={
                      Array.isArray(statistics?.alerts?.ProductsWithoutPrices)
                        ? statistics.alerts.ProductsWithoutPrices.length
                        : 0
                    }
                    items={
                      Array.isArray(statistics?.alerts?.ProductsWithoutPrices)
                        ? statistics.alerts.ProductsWithoutPrices.map((p) => ({
                            name: p.Name,
                            value: p.ItemCode,
                          }))
                        : []
                    }
                    icon={DollarSign}
                  />

                  <AlertCard
                    type="warning"
                    title={translations["Products without Images"]}
                    count={
                      statistics?.alerts?.ProductsWithoutImages?.length || 0
                    }
                    items={
                      statistics?.alerts?.ProductsWithoutImages?.map((p) => ({
                        name: p.Name,
                        value: p.ItemCode,
                      })) || []
                    }
                    icon={Image}
                  />

                  <AlertCard
                    type="info"
                    title={translations["High Value Products"]}
                    count={statistics?.alerts?.HighValueProducts?.length || 0}
                    items={
                      statistics?.alerts?.HighValueProducts?.map((p) => ({
                        name: p.Name,
                        value: formatCurrency(p.UnitPrice),
                      })) || []
                    }
                    icon={Award}
                  />
                </Container>

                <Container className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    {translations["Quick Actions"]}
                  </h3>
                  <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FilledButton
                      isIcon={true}
                      icon={Package}
                      iconSize="w-4 h-4"
                      bgColor="bg-blue-600 hover:bg-blue-700"
                      textColor="text-white"
                      rounded="rounded-lg"
                      buttonText={translations["View All Products"]}
                      height="h-10"
                      px="px-4"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      isIconLeft={true}
                      onClick={() => navigate("/admin/products")}
                    />

                    <FilledButton
                      isIcon={true}
                      icon={Plus}
                      iconSize="w-4 h-4"
                      bgColor="bg-green-600 hover:bg-green-700"
                      textColor="text-white"
                      rounded="rounded-lg"
                      buttonText={translations["Add New Product"]}
                      height="h-10"
                      px="px-4"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      isIconLeft={true}
                      onClick={() => navigate("/admin/new-product")}
                    />

                    <FilledButton
                      isIcon={true}
                      icon={Layers}
                      iconSize="w-4 h-4"
                      bgColor="bg-purple-600 hover:bg-purple-700"
                      textColor="text-white"
                      rounded="rounded-lg"
                      buttonText={translations["Manage Categories"]}
                      height="h-10"
                      px="px-4"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      isIconLeft={true}
                      onClick={() => navigate("/admin/product-categories")}
                    />

                    <FilledButton
                      isIcon={true}
                      icon={Star}
                      iconSize="w-4 h-4"
                      bgColor="bg-yellow-600 hover:bg-yellow-700"
                      textColor="text-white"
                      rounded="rounded-lg"
                      buttonText={translations["Manage Brands"]}
                      height="h-10"
                      px="px-4"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      isIconLeft={true}
                      onClick={() => navigate("/admin/product-brands")}
                    />
                  </Container>
                </Container>
              </Container>
            )}
          </>
        )}
      </Container>
    </Container>
  );
};

export default ProductStatistics;
