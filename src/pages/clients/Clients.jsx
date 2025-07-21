import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Users,
  Calendar,
  TrendingUp,
  Activity,
  AlertCircle,
  RefreshCw,
  Eye,
  Edit,
  Copy
} from "lucide-react";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const DynamicClientDashboard = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  // UPDATED: Use the updated context with new methods
  const {
    clients,
    loading,
    error,
    statistics,
    getClients,
    getClientStatistics,
    getBasicClientStatistics,
    getClientTypeStatistics
  } = useClients();

  const translations = React.useMemo(() => ({
    "Add Client": language === "ar" ? "إضافة عميل" : "Add Client",
    "Clients Overview": language === "ar" ? "نظرة عامة على العملاء" : "Clients Overview",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "Total Clients": language === "ar" ? "إجمالي العملاء" : "Total Clients",
    "Individual": language === "ar" ? "فردي" : "Individual",
    "Business": language === "ar" ? "تجاري" : "Business",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "Recent Clients": language === "ar" ? "العملاء الجدد" : "Recent Clients",
    "View All Clients": language === "ar" ? "عرض جميع العملاء" : "View All Clients",
    "No clients found": language === "ar" ? "لم يتم العثور على عملاء" : "No clients found",
    "Error loading data": language === "ar" ? "خطأ في تحميل البيانات" : "Error loading data",
    "Retry": language === "ar" ? "المحاولة مرة أخرى" : "Retry",
    "View": language === "ar" ? "عرض" : "View",
    "Edit": language === "ar" ? "تعديل" : "Edit",
    "Clone": language === "ar" ? "نسخ" : "Clone",
    "Get started by adding your first client": language === "ar" ? "ابدأ بإضافة عميلك الأول" : "Get started by adding your first client",
    "Manage and view your client information": language === "ar" ? "إدارة ومشاهدة معلومات عملائك" : "Manage and view your client information",
    "Failed to load some data": language === "ar" ? "فشل في تحميل بعض البيانات" : "Failed to load some data",
    "Partial data loaded": language === "ar" ? "تم تحميل البيانات جزئياً" : "Partial data loaded"
  }), [language]);

  // Local state
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [partialDataLoaded, setPartialDataLoaded] = useState(false);

  // Check authentication like in your NewClient component
  useEffect(() => {
    if (!token) {
      const localToken = localStorage.getItem("token");
      if (!localToken) {
        navigate("/admin-Login");
        return;
      }
    }
  }, [token, navigate]);

  // UPDATED: Enhanced fetch logic with fallback endpoints
  useEffect(() => {
    let mounted = true;
    
    const fetchInitialData = async () => {
      // Prevent multiple calls
      if (hasFetched || !mounted) return;
      
      console.log("🚀 Starting dashboard data fetch...");
      console.log("Token:", token ? "Present" : "Missing");
      
      try {
        if (!mounted) return;
        setIsInitialLoading(true);
        setHasError(null);
        setHasFetched(true);
        setPartialDataLoaded(false);
        
        // Try to fetch comprehensive statistics first
        console.log("📊 Fetching comprehensive client statistics...");
        try {
          await getClientStatistics();
          console.log("✅ Comprehensive statistics fetched successfully");
        } catch (statsError) {
          console.warn("⚠️ Comprehensive statistics failed, trying basic stats...", statsError);
          
          try {
            // Fallback to basic statistics
            await getBasicClientStatistics();
            console.log("✅ Basic statistics fetched as fallback");
            setPartialDataLoaded(true);
          } catch (basicStatsError) {
            console.warn("⚠️ Basic statistics also failed, trying type stats...", basicStatsError);
            
            try {
              // Last fallback to type statistics
              await getClientTypeStatistics();
              console.log("✅ Type statistics fetched as last fallback");
              setPartialDataLoaded(true);
            } catch (typeStatsError) {
              console.error("❌ All statistics endpoints failed:", typeStatsError);
              // Continue without statistics
            }
          }
        }
        
        if (!mounted) return;
        
        console.log("👥 Fetching recent clients...");
        try {
          await getClients({ page: 1, pageSize: 6 });
          console.log("✅ Clients fetched successfully");
        } catch (clientsError) {
          console.error("❌ Failed to fetch clients:", clientsError);
          throw clientsError; // This is more critical, so throw
        }
        
        if (!mounted) return;
        console.log("✅ Dashboard data loaded successfully");
        
      } catch (error) {
        if (!mounted) return;
        console.error("❌ Error fetching dashboard data:", error);
        setHasError(error.message || "Failed to load dashboard data");
        setHasFetched(false); // Reset on error so user can retry
      } finally {
        if (mounted) {
          setIsInitialLoading(false);
        }
      }
    };

    // Only fetch if we have a token and haven't fetched yet
    if ((token || localStorage.getItem("token")) && !hasFetched) {
      fetchInitialData();
    }

    return () => {
      mounted = false;
    };
  }, [token, hasFetched, getClients, getClientStatistics, getBasicClientStatistics, getClientTypeStatistics]);

  // UPDATED: Enhanced refresh with fallback logic
  const handleRefresh = useCallback(async () => {
    try {
      setHasError(null);
      setHasFetched(false); // Reset to allow refetch
      setIsInitialLoading(true);
      setPartialDataLoaded(false);
      
      console.log("🔄 Refreshing dashboard data...");
      
      // Try comprehensive statistics first, with fallbacks
      try {
        await getClientStatistics();
        console.log("✅ Comprehensive statistics refreshed");
      } catch (error) {
        console.warn("⚠️ Comprehensive stats refresh failed, trying basic...");
        try {
          await getBasicClientStatistics();
          setPartialDataLoaded(true);
          console.log("✅ Basic statistics refreshed as fallback");
        } catch (basicError) {
          console.warn("⚠️ Basic stats refresh failed, trying type stats...");
          try {
            await getClientTypeStatistics();
            setPartialDataLoaded(true);
            console.log("✅ Type statistics refreshed as fallback");
          } catch (typeError) {
            console.error("❌ All statistics refresh failed");
          }
        }
      }
      
      // Refresh clients
      await getClients({ page: 1, pageSize: 6 });
      console.log("✅ Dashboard data refreshed successfully");
      
      setHasFetched(true);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setHasError(error.message || "Failed to refresh data");
      setHasFetched(false);
    } finally {
      setIsInitialLoading(false);
    }
  }, [getClients, getClientStatistics, getBasicClientStatistics, getClientTypeStatistics]);

  // Statistics Card Component
  const StatCard = React.memo(({ title, value, icon: Icon, bgColor, iconColor, trend }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <Container className="flex items-center justify-between">
        <Container>
          <Span className="text-gray-500 text-sm font-medium">{title}</Span>
          <Span className="text-2xl font-bold text-gray-900 mt-1 block">
            {value || 0}
          </Span>
          {trend && (
            <Container className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <Span className="text-sm text-green-600">{trend}</Span>
            </Container>
          )}
        </Container>
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
      </Container>
    </Container>
  ));

  // Client Card Component
  const ClientCard = React.memo(({ client }) => (
    <Container className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <Container className="flex items-start justify-between">
        <Container className="flex-1">
          <Container className="flex items-center gap-2 mb-2">
            <Span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                client.ClientType === "Individual"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {translations[client.ClientType] || client.ClientType}
            </Span>
          </Container>
          
          <h3 className="font-medium text-gray-900 mb-1">
            {client.ClientType === "Business"
              ? client.BusinessName || client.FullName || "N/A"
              : client.FullName || "N/A"}
          </h3>
          
          {client.Email && (
            <Container className="flex items-center text-sm text-gray-600 mb-1">
              <Mail className="w-4 h-4 mr-2" />
              <Span>{client.Email}</Span>
            </Container>
          )}
          
          {(client.Mobile || client.Telephone) && (
            <Container className="flex items-center text-sm text-gray-600 mb-1">
              <Phone className="w-4 h-4 mr-2" />
              <Span>{client.Mobile || client.Telephone}</Span>
            </Container>
          )}
          
          {(client.City || client.Country) && (
            <Container className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              <Span>
                {[client.City, client.Country].filter(Boolean).join(", ")}
              </Span>
            </Container>
          )}

          {/* Quick Actions */}
          <Container className="flex gap-1 mt-3">
            <button
              onClick={() => navigate(`/admin/clients/${client.Id}`)}
              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
              title={translations.View}
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              onClick={() => navigate("/admin/new-clients", { 
                state: { editData: client, isEditing: true } 
              })}
              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
              title={translations.Edit}
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={() => navigate("/admin/new-clients", { 
                state: { 
                  cloneData: {
                    ...client,
                    FullName: `${client.FullName || ""} (Copy)`,
                    Email: "",
                    CodeNumber: "",
                    Id: undefined,
                  } 
                } 
              })}
              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
              title={translations.Clone}
            >
              <Copy className="w-3 h-3" />
            </button>
          </Container>
        </Container>
      </Container>
    </Container>
  ));

  // Loading state
  if (isInitialLoading) {
    return (
      <Container className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container className="text-center">
          <Container className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></Container>
          <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
          {partialDataLoaded && (
            <Span className="text-yellow-600 text-sm block mt-2">
              {translations["Partial data loaded"]}
            </Span>
          )}
        </Container>
      </Container>
    );
  }

  // Error state
  if (hasError || error) {
    return (
      <Container className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container className="text-center">
          <Container className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Activity className="w-8 h-8 text-red-600" />
          </Container>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {translations["Error loading data"]}
          </h3>
          <Span className="text-gray-500 mb-4 block">{hasError || error}</Span>
          <FilledButton
            isIcon={true}
            icon={RefreshCw}
            iconSize="w-4 h-4"
            bgColor="bg-blue-600 hover:bg-blue-700"
            textColor="text-white"
            rounded="rounded-lg"
            buttonText={translations.Retry}
            height="h-10"
            px="px-4"
            fontWeight="font-medium"
            fontSize="text-sm"
            isIconLeft={true}
            onClick={handleRefresh}
          />
        </Container>
      </Container>
    );
  }

  // Get safe array from clients data
  const clientsArray = Array.isArray(clients) ? clients : [];

  // Debug log for statistics
  console.log('📊 Current statistics:', statistics);

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <Container className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {translations["Clients Overview"]}
            </h1>
            <Span className="text-gray-600 mt-1">
              {translations["Manage and view your client information"]}
            </Span>
            {partialDataLoaded && (
              <Span className="text-yellow-600 text-xs block mt-1">
                ⚠️ {translations["Failed to load some data"]}
              </Span>
            )}
          </Container>
          <Container className="flex gap-3">
            <FilledButton
              isIcon={true}
              icon={RefreshCw}
              iconSize="w-4 h-4"
              bgColor={loading ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"}
              textColor={loading ? "text-gray-500" : "text-gray-700"}
              rounded="rounded-lg"
              buttonText=""
              height="h-10"
              width="w-10"
              onClick={handleRefresh}
              disabled={loading}
            />
            <FilledButton
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations["View All Clients"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={() => navigate("/admin/clients")}
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

        {/* UPDATED: Statistics Cards with proper data mapping */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={translations["Total Clients"]}
            value={statistics?.totalClients || 0}
            icon={Users}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            trend={statistics?.clientsThisMonth ? `+${statistics.clientsThisMonth} this month` : null}
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

        {/* Recent Clients */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Container className="px-6 py-4 border-b border-gray-200">
            <Container className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {translations["Recent Clients"]}
              </h2>
              <FilledButton
                bgColor="bg-transparent hover:bg-gray-50"
                textColor="text-blue-600 hover:text-blue-800"
                rounded="rounded-md"
                buttonText={translations["View All Clients"]}
                height="h-8"
                px="px-3"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => navigate("/admin/clients")}
              />
            </Container>
          </Container>
          
          <Container className="p-6">
            {loading ? (
              <Container className="text-center py-8">
                <Container className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></Container>
                <Span className="text-gray-500">{translations.Loading}</Span>
              </Container>
            ) : clientsArray.length === 0 ? (
              <Container className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {translations["No clients found"]}
                </h3>
                <Span className="text-gray-500 mb-4 block">
                  {translations["Get started by adding your first client"]}
                </Span>
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
            ) : (
              <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientsArray.slice(0, 6).map((client) => (
                  <ClientCard key={client.Id} client={client} />
                ))}
              </Container>
            )}
          </Container>
        </Container>

        {/* UPDATED: Additional Stats Section with better error handling */}
        <Container className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Distribution */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Client Distribution</h3>
            <Container className="space-y-4">
              <Container className="flex items-center justify-between">
                <Container className="flex items-center">
                  <Container className="w-3 h-3 bg-blue-500 rounded-full mr-3"></Container>
                  <Span className="text-sm text-gray-600">Individual Clients</Span>
                </Container>
                <Span className="text-sm font-medium text-gray-900">
                  {statistics?.individualClients || 0}
                </Span>
              </Container>
              <Container className="flex items-center justify-between">
                <Container className="flex items-center">
                  <Container className="w-3 h-3 bg-green-500 rounded-full mr-3"></Container>
                  <Span className="text-sm text-gray-600">Business Clients</Span>
                </Container>
                <Span className="text-sm font-medium text-gray-900">
                  {statistics?.businessClients || 0}
                </Span>
              </Container>
              {statistics?.otherClients > 0 && (
                <Container className="flex items-center justify-between">
                  <Container className="flex items-center">
                    <Container className="w-3 h-3 bg-gray-500 rounded-full mr-3"></Container>
                    <Span className="text-sm text-gray-600">Other Clients</Span>
                  </Container>
                  <Span className="text-sm font-medium text-gray-900">
                    {statistics.otherClients}
                  </Span>
                </Container>
              )}
              <Container className="pt-2 border-t border-gray-200">
                <Container className="flex items-center justify-between">
                  <Span className="text-sm font-medium text-gray-900">Total</Span>
                  <Span className="text-sm font-bold text-gray-900">
                    {statistics?.totalClients || 0}
                  </Span>
                </Container>
              </Container>
            </Container>
          </Container>

          {/* Quick Actions */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <Container className="space-y-3">
              <button 
                onClick={() => navigate("/admin/new-clients")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Container className="flex items-center">
                  <Plus className="w-5 h-5 text-blue-600 mr-3" />
                  <Container>
                    <Span className="text-sm font-medium text-gray-900 block">Add New Client</Span>
                    <Span className="text-xs text-gray-500">Create a new client profile</Span>
                  </Container>
                </Container>
              </button>
              
              <button 
                onClick={() => navigate("/admin/clients")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Container className="flex items-center">
                  <Users className="w-5 h-5 text-green-600 mr-3" />
                  <Container>
                    <Span className="text-sm font-medium text-gray-900 block">View All Clients</Span>
                    <Span className="text-xs text-gray-500">Browse complete client list</Span>
                  </Container>
                </Container>
              </button>
              
              <button 
                onClick={handleRefresh}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Container className="flex items-center">
                  <Activity className="w-5 h-5 text-purple-600 mr-3" />
                  <Container>
                    <Span className="text-sm font-medium text-gray-900 block">Refresh Statistics</Span>
                    <Span className="text-xs text-gray-500">Update dashboard data</Span>
                  </Container>
                </Container>
              </button>
            </Container>
          </Container>
        </Container>

        {/* ADDED: Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && statistics && (
          <Container className="mt-8 bg-gray-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(statistics, null, 2)}
            </pre>
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default DynamicClientDashboard;