// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Plus,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Building,
//   Users,
//   Calendar,
//   TrendingUp,
//   Activity,
//   AlertCircle,
//   RefreshCw,
//   Eye,
//   Edit,
//   Copy,
//   Trash2,
// } from "lucide-react";
// import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
// import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
// import Container from "../../components/elements/container/Container";
// import Span from "../../components/elements/span/Span";
// import Modall from "../../components/elements/modal/Modal";
// import { AiOutlineDelete } from "react-icons/ai";

// const DynamicClientDashboard = () => {
//   const navigate = useNavigate();
//   const language = useSelector((state) => state.language?.language || "en");
//   const token = useSelector((state) => state.auth?.token);

//   const {
//     clients,
//     deleteClient,
//     loading,
//     error,
//     statistics,
//     getClients,
//     getClientStatistics,
//     getBasicClientStatistics,
//     getClientTypeStatistics,
//   } = useClients();

//   const translations = React.useMemo(
//     () => ({
//       "Add Client": language === "ar" ? "إضافة عميل" : "Add Client",
//       "Clients Overview":
//         language === "ar" ? "نظرة عامة على العملاء" : "Clients Overview",
//       Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
//       "Total Clients": language === "ar" ? "إجمالي العملاء" : "Total Clients",
//       Individual: language === "ar" ? "فردي" : "Individual",
//       Business: language === "ar" ? "تجاري" : "Business",
//       "This Month": language === "ar" ? "هذا الشهر" : "This Month",
//       "Recent Clients": language === "ar" ? "العملاء الجدد" : "Recent Clients",
//       "View All Clients":
//         language === "ar" ? "عرض جميع العملاء" : "View All Clients",
//       "No clients found":
//         language === "ar" ? "لم يتم العثور على عملاء" : "No clients found",
//       "Error loading data":
//         language === "ar" ? "خطأ في تحميل البيانات" : "Error loading data",
//       Retry: language === "ar" ? "المحاولة مرة أخرى" : "Retry",
//       View: language === "ar" ? "عرض" : "View",
//       Edit: language === "ar" ? "تعديل" : "Edit",
//       Clone: language === "ar" ? "نسخ" : "Clone",
//       "Get started by adding your first client":
//         language === "ar"
//           ? "ابدأ بإضافة عميلك الأول"
//           : "Get started by adding your first client",
//       "Manage and view your client information":
//         language === "ar"
//           ? "إدارة ومشاهدة معلومات عملائك"
//           : "Manage and view your client information",
//       "Failed to load some data":
//         language === "ar"
//           ? "فشل في تحميل بعض البيانات"
//           : "Failed to load some data",
//       "Partial data loaded":
//         language === "ar" ? "تم تحميل البيانات جزئياً" : "Partial data loaded",
//     }),
//     [language]
//   );

//   // Simplified local state - NO INITIAL LOADING STATE
//   const [hasError, setHasError] = useState(null);
//   const [hasFetched, setHasFetched] = useState(false);
//   const [dataRefreshing, setDataRefreshing] = useState(false);

//   // Check authentication (but don't block UI)
//   useEffect(() => {
//     if (!token && !localStorage.getItem("token")) {
//       navigate("/admin-Login");
//       return;
//     }
//   }, [token, navigate]);

//   // Background data fetching - NO LOADING STATE BLOCKING
//   useEffect(() => {
//     let mounted = true;

//     const fetchDataInBackground = async () => {
//       if (hasFetched || !mounted) return;

//       const hasToken = token || localStorage.getItem("token");
//       if (!hasToken) return;

//       try {
//         setHasFetched(true);
//         setHasError(null);

//         // Try to fetch statistics (silently fail if needed)
//         try {
//           await getClientStatistics();
//         } catch (statsError) {
//           try {
//             await getBasicClientStatistics();
//           } catch (basicStatsError) {
//             try {
//               await getClientTypeStatistics();
//             } catch (typeStatsError) {
//               console.warn("All statistics endpoints failed");
//             }
//           }
//         }

//         // Try to fetch clients (silently fail if needed)
//         try {
//           await getClients({ page: 1, pageSize: 6 });
//         } catch (clientsError) {
//           console.warn("Failed to fetch clients:", clientsError);
//         }
//       } catch (error) {
//         console.error("Background fetch error:", error);
//         setHasError(error.message);
//         setHasFetched(false);
//       }
//     };

//     if ((token || localStorage.getItem("token")) && !hasFetched) {
//       fetchDataInBackground();
//     }

//     return () => {
//       mounted = false;
//     };
//   }, [
//     token,
//     hasFetched,
//     getClients,
//     getClientStatistics,
//     getBasicClientStatistics,
//     getClientTypeStatistics,
//   ]);

//   // Manual refresh
//   const handleRefresh = useCallback(async () => {
//     setDataRefreshing(true);
//     setHasError(null);
//     setHasFetched(false);

//     // Let the useEffect handle the actual fetching
//     setTimeout(() => {
//       setDataRefreshing(false);
//     }, 2000); // Stop refreshing indicator after 2 seconds
//   }, []);
//   const [warehouseToDelete, setWarehouseToDelete] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const confirmDeleteWarehouse = async () => {
//     if (!warehouseToDelete) return;

//     setIsDeleting(true);
//     try {
//       await deleteClient(warehouseToDelete.Id);
//       setShowDeleteModal(false);
//       setWarehouseToDelete(null);
//       // Refresh the warehouse list
//       await getClients();
//     } catch (error) {
//       console.error("Error deleting Client:", error);
//       alert("Failed to delete Client");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleDeleteClient = (ClientId) => {
//     const warehouse = Array.isArray(clients)
//       ? clients.find((w) => w.Id === ClientId)
//       : null;
//     if (warehouse) {
//       setWarehouseToDelete(warehouse);
//       setShowDeleteModal(true);
//     } else {
//       alert("Client not found");
//     }
//   };

//   // Statistics Card Component
//   const StatCard = React.memo(
//     ({ title, value, icon: Icon, bgColor, iconColor, trend, isLoading }) => (
//       <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//         <Container className="flex items-center justify-between">
//           <Container>
//             <Span className="text-gray-500 text-sm font-medium">{title}</Span>
//             {isLoading ? (
//               <Container className="w-16 h-8 bg-gray-200 animate-pulse rounded mt-1"></Container>
//             ) : (
//               <Span className="text-2xl font-bold text-gray-900 mt-1 block">
//                 {value || 0}
//               </Span>
//             )}
//             {trend && !isLoading && (
//               <Container className="flex items-center mt-2">
//                 <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
//                 <Span className="text-sm text-green-600">{trend}</Span>
//               </Container>
//             )}
//           </Container>
//           <Container className={`${bgColor} p-3 rounded-lg`}>
//             <Icon className={`w-6 h-6 ${iconColor}`} />
//           </Container>
//         </Container>
//       </Container>
//     )
//   );

//   // Client Card Component
//   const ClientCard = React.memo(({ client }) => (
//     <Container className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
//       <Container className="flex items-start justify-between">
//         <Container className="flex-1">
//           <Container className="flex items-center gap-2 mb-2">
//             <Span
//               className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                 client.ClientType === "Individual"
//                   ? "bg-blue-100 text-blue-800"
//                   : "bg-green-100 text-green-800"
//               }`}
//             >
//               {translations[client.ClientType] || client.ClientType}
//             </Span>
//           </Container>

//           <h3 className="font-medium text-gray-900 mb-1">
//             {client.ClientType === "Business"
//               ? client.BusinessName || client.FullName || "N/A"
//               : client.FullName || "N/A"}
//           </h3>

//           {client.Email && (
//             <Container className="flex items-center text-sm text-gray-600 mb-1">
//               <Mail className="w-4 h-4 mr-2" />
//               <Span>{client.Email}</Span>
//             </Container>
//           )}

//           {(client.Mobile || client.Telephone) && (
//             <Container className="flex items-center text-sm text-gray-600 mb-1">
//               <Phone className="w-4 h-4 mr-2" />
//               <Span>{client.Mobile || client.Telephone}</Span>
//             </Container>
//           )}

//           {(client.City || client.Country) && (
//             <Container className="flex items-center text-sm text-gray-600 mb-2">
//               <MapPin className="w-4 h-4 mr-2" />
//               <Span>
//                 {[client.City, client.Country].filter(Boolean).join(", ")}
//               </Span>
//             </Container>
//           )}

//           <Container className="flex gap-1 mt-3">
//             <button
//               onClick={() => navigate(`/admin/clients/${client.Id}`)}
//               className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
//               title={translations.View}
//             >
//               <Eye className="w-3 h-3" />
//             </button>
//             <button
//               onClick={() =>
//                 navigate("/admin/new-clients", {
//                   state: { editData: client, isEditing: true },
//                 })
//               }
//               className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
//               title={translations.Edit}
//             >
//               <Edit className="w-3 h-3" />
//             </button>
//             <button
//               onClick={() =>
//                 navigate("/admin/new-clients", {
//                   state: {
//                     cloneData: {
//                       ...client,
//                       FullName: `${client.FullName || ""} (Copy)`,
//                       Email: "",
//                       CodeNumber: "",
//                       Id: undefined,
//                     },
//                   },
//                 })
//               }
//               className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
//               title={translations.Clone}
//             >
//               <Copy className="w-3 h-3" />
//             </button>
//             <button
//               onClick={() => handleDeleteClient(client.Id)}
//               className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
//               title={translations.Delete}
//             >
//               <AiOutlineDelete className="w-3 h-3" />
//             </button>
//           </Container>
//         </Container>
//       </Container>
//     </Container>
//   ));

//   // Loading skeleton for client cards
//   const ClientCardSkeleton = () => (
//     <Container className="bg-white p-4 rounded-lg border border-gray-200">
//       <Container className="animate-pulse">
//         <Container className="w-16 h-5 bg-gray-200 rounded mb-2"></Container>
//         <Container className="w-32 h-6 bg-gray-200 rounded mb-2"></Container>
//         <Container className="w-40 h-4 bg-gray-200 rounded mb-1"></Container>
//         <Container className="w-36 h-4 bg-gray-200 rounded mb-1"></Container>
//         <Container className="w-28 h-4 bg-gray-200 rounded mb-3"></Container>
//         <Container className="flex gap-1">
//           <Container className="w-7 h-7 bg-gray-200 rounded"></Container>
//           <Container className="w-7 h-7 bg-gray-200 rounded"></Container>
//           <Container className="w-7 h-7 bg-gray-200 rounded"></Container>
//         </Container>
//       </Container>
//     </Container>
//   );

//   // Get safe array from clients data - handle nested API response structure
//   const clientsArray = React.useMemo(() => {
//     if (!clients) return [];

//     // Handle different possible response structures
//     if (Array.isArray(clients)) {
//       return clients;
//     }

//     // Handle nested response structure: { Data: { $values: [...] } }
//     if (clients.Data && Array.isArray(clients.Data.$values)) {
//       return clients.Data.$values;
//     }

//     // Handle direct $values structure: { $values: [...] }
//     if (Array.isArray(clients.$values)) {
//       return clients.$values;
//     }

//     console.warn("Unexpected clients data structure:", clients);
//     return [];
//   }, [clients]);
//   const isDataLoading = loading || (!hasFetched && !hasError);

//   // Debug logging for clients data
//   React.useEffect(() => {
//     console.log("🔍 CLIENTS DATA DEBUG:");
//     console.log("Raw clients from context:", clients);
//     console.log("Processed clientsArray:", clientsArray);
//     console.log("Array length:", clientsArray.length);
//     console.log("Is loading:", isDataLoading);
//   }, [clients, clientsArray, isDataLoading]);

//   // SHOW DASHBOARD IMMEDIATELY - NO LOADING SCREEN
//   return (
//     <Container className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <Container className="px-6 py-6">
//         <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
//           <Container className="mb-4 lg:mb-0">
//             <h1 className="text-2xl font-bold text-gray-900">
//               {translations["Clients Overview"]}
//             </h1>
//             <Span className="text-gray-600 mt-1">
//               {translations["Manage and view your client information"]}
//             </Span>
//             {hasError && (
//               <Span className="text-red-600 text-xs block mt-1">
//                 ⚠️ {hasError}
//               </Span>
//             )}
//           </Container>
//           <Container className="flex gap-3">
//             <FilledButton
//               isIcon={true}
//               icon={RefreshCw}
//               iconSize="w-4 h-4"
//               bgColor={
//                 dataRefreshing ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"
//               }
//               textColor={dataRefreshing ? "text-gray-500" : "text-gray-700"}
//               rounded="rounded-lg"
//               buttonText=""
//               height="h-10"
//               width="w-10"
//               onClick={handleRefresh}
//               disabled={dataRefreshing}
//             />
//             <FilledButton
//               bgColor="bg-gray-100 hover:bg-gray-200"
//               textColor="text-gray-700"
//               rounded="rounded-lg"
//               buttonText={translations["View All Clients"]}
//               height="h-10"
//               px="px-4"
//               fontWeight="font-medium"
//               fontSize="text-sm"
//               onClick={() => navigate("/admin/clients")}
//             />
//             <FilledButton
//               isIcon={true}
//               icon={Plus}
//               iconSize="w-4 h-4"
//               bgColor="bg-blue-600 hover:bg-blue-700"
//               textColor="text-white"
//               rounded="rounded-lg"
//               buttonText={translations["Add Client"]}
//               height="h-10"
//               px="px-4"
//               fontWeight="font-medium"
//               fontSize="text-sm"
//               isIconLeft={true}
//               onClick={() => navigate("/admin/new-clients")}
//             />
//           </Container>
//         </Container>

//         {/* Statistics Cards - Show immediately with loading states */}
//         <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             title={translations["Total Clients"]}
//             value={statistics?.totalClients}
//             icon={Users}
//             bgColor="bg-blue-50"
//             iconColor="text-blue-600"
//             trend={
//               statistics?.clientsThisMonth
//                 ? `+${statistics.clientsThisMonth} this month`
//                 : null
//             }
//             isLoading={isDataLoading}
//           />
//           <StatCard
//             title={translations.Individual}
//             value={statistics?.individualClients}
//             icon={User}
//             bgColor="bg-green-50"
//             iconColor="text-green-600"
//             isLoading={isDataLoading}
//           />
//           <StatCard
//             title={translations.Business}
//             value={statistics?.businessClients}
//             icon={Building}
//             bgColor="bg-purple-50"
//             iconColor="text-purple-600"
//             isLoading={isDataLoading}
//           />
//           <StatCard
//             title={translations["This Month"]}
//             value={statistics?.clientsThisMonth}
//             icon={Calendar}
//             bgColor="bg-yellow-50"
//             iconColor="text-yellow-600"
//             isLoading={isDataLoading}
//           />
//         </Container>

//         {/* Recent Clients - Show immediately */}
//         <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <Container className="px-6 py-4 border-b border-gray-200">
//             <Container className="flex items-center justify-between">
//               <h2 className="text-lg font-medium text-gray-900">
//                 {translations["Recent Clients"]}
//               </h2>
//               <FilledButton
//                 bgColor="bg-transparent hover:bg-gray-50"
//                 textColor="text-blue-600 hover:text-blue-800"
//                 rounded="rounded-md"
//                 buttonText={translations["View All Clients"]}
//                 height="h-8"
//                 px="px-3"
//                 fontWeight="font-medium"
//                 fontSize="text-sm"
//                 onClick={() => navigate("/admin/clients")}
//               />
//             </Container>
//           </Container>

//           <Container className="p-6">
//             {isDataLoading ? (
//               // Show skeleton loading instead of blocking
//               <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {[...Array(6)].map((_, index) => (
//                   <ClientCardSkeleton key={index} />
//                 ))}
//               </Container>
//             ) : clientsArray.length === 0 ? (
//               <Container className="text-center py-8">
//                 <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   {translations["No clients found"]}
//                 </h3>
//                 <Span className="text-gray-500 mb-4 block">
//                   {translations["Get started by adding your first client"]}
//                 </Span>
//                 <FilledButton
//                   isIcon={true}
//                   icon={Plus}
//                   iconSize="w-4 h-4"
//                   bgColor="bg-blue-600 hover:bg-blue-700"
//                   textColor="text-white"
//                   rounded="rounded-lg"
//                   buttonText={translations["Add Client"]}
//                   height="h-10"
//                   px="px-4"
//                   fontWeight="font-medium"
//                   fontSize="text-sm"
//                   isIconLeft={true}
//                   onClick={() => navigate("/admin/new-clients")}
//                 />
//               </Container>
//             ) : (
//               <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {clientsArray.slice(0, 6).map((client) => (
//                   <ClientCard key={client.Id} client={client} />
//                 ))}
//               </Container>
//             )}
//           </Container>
//         </Container>

//         {/* Additional Stats and Quick Actions */}
//         <Container className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Client Distribution */}
//           <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Client Distribution
//             </h3>
//             <Container className="space-y-4">
//               <Container className="flex items-center justify-between">
//                 <Container className="flex items-center">
//                   <Container className="w-3 h-3 bg-blue-500 rounded-full mr-3"></Container>
//                   <Span className="text-sm text-gray-600">
//                     Individual Clients
//                   </Span>
//                 </Container>
//                 {isDataLoading ? (
//                   <Container className="w-8 h-4 bg-gray-200 animate-pulse rounded"></Container>
//                 ) : (
//                   <Span className="text-sm font-medium text-gray-900">
//                     {statistics?.individualClients || 0}
//                   </Span>
//                 )}
//               </Container>
//               <Container className="flex items-center justify-between">
//                 <Container className="flex items-center">
//                   <Container className="w-3 h-3 bg-green-500 rounded-full mr-3"></Container>
//                   <Span className="text-sm text-gray-600">
//                     Business Clients
//                   </Span>
//                 </Container>
//                 {isDataLoading ? (
//                   <Container className="w-8 h-4 bg-gray-200 animate-pulse rounded"></Container>
//                 ) : (
//                   <Span className="text-sm font-medium text-gray-900">
//                     {statistics?.businessClients || 0}
//                   </Span>
//                 )}
//               </Container>
//               <Container className="pt-2 border-t border-gray-200">
//                 <Container className="flex items-center justify-between">
//                   <Span className="text-sm font-medium text-gray-900">
//                     Total
//                   </Span>
//                   {isDataLoading ? (
//                     <Container className="w-8 h-4 bg-gray-200 animate-pulse rounded"></Container>
//                   ) : (
//                     <Span className="text-sm font-bold text-gray-900">
//                       {statistics?.totalClients || 0}
//                     </Span>
//                   )}
//                 </Container>
//               </Container>
//             </Container>
//           </Container>

//           {/* Quick Actions */}
//           <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Quick Actions
//             </h3>
//             <Container className="space-y-3">
//               <button
//                 onClick={() => navigate("/admin/new-clients")}
//                 className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//               >
//                 <Container className="flex items-center">
//                   <Plus className="w-5 h-5 text-blue-600 mr-3" />
//                   <Container>
//                     <Span className="text-sm font-medium text-gray-900 block">
//                       Add New Client
//                     </Span>
//                     <Span className="text-xs text-gray-500">
//                       Create a new client profile
//                     </Span>
//                   </Container>
//                 </Container>
//               </button>

//               <button
//                 onClick={() => navigate("/admin/clients")}
//                 className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//               >
//                 <Container className="flex items-center">
//                   <Users className="w-5 h-5 text-green-600 mr-3" />
//                   <Container>
//                     <Span className="text-sm font-medium text-gray-900 block">
//                       View All Clients
//                     </Span>
//                     <Span className="text-xs text-gray-500">
//                       Browse complete client list
//                     </Span>
//                   </Container>
//                 </Container>
//               </button>

//               <button
//                 onClick={handleRefresh}
//                 className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//               >
//                 <Container className="flex items-center">
//                   <Activity className="w-5 h-5 text-purple-600 mr-3" />
//                   <Container>
//                     <Span className="text-sm font-medium text-gray-900 block">
//                       Refresh Statistics
//                     </Span>
//                     <Span className="text-xs text-gray-500">
//                       Update dashboard data
//                     </Span>
//                   </Container>
//                 </Container>
//               </button>
//             </Container>
//           </Container>
//         </Container>

//         <Modall
//           modalOpen={showDeleteModal}
//           setModalOpen={setShowDeleteModal}
//           title={
//             <Container className="flex items-center gap-2 text-red-600">
//               <Trash2 className="w-5 h-5" />
//               <Span>{translations["Delete Warehouse"]}</Span>
//             </Container>
//           }
//           width={500}
//           okText={translations.Delete}
//           cancelText={translations.Cancel}
//           okAction={confirmDeleteWarehouse}
//           cancelAction={() => setShowDeleteModal(false)}
//           okButtonDisabled={isDeleting}
//           body={
//             <Container className="text-center py-4">
//               <Container className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//                 <Trash2 className="w-8 h-8 text-red-600" />
//               </Container>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 {translations["Are you sure?"]}
//               </h3>
//               <Span className="text-gray-500 mb-4 block">
//                 {translations["This action cannot be undone"]}. This will
//                 permanently delete the Client{" "}
//                 <strong>"{warehouseToDelete?.Name}"</strong> and all associated
//                 data.
//               </Span>
//             </Container>
//           }
//         />
//       </Container>
//     </Container>
//   );
// };

// export default DynamicClientDashboard;
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
  Copy,
  Trash2,
} from "lucide-react";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";
import { AiOutlineDelete } from "react-icons/ai";

// Import the reusable components
import DeleteModal from "../../components/elements/modal/DeleteModal"; // Adjust path as needed
import CustomAlert from "../../components/elements/Alert/CustomAlerts"; // Adjust path as needed

const DynamicClientDashboard = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const {
    clients,
    deleteClient,
    loading,
    error,
    statistics,
    getClients,
    getClientStatistics,
    getBasicClientStatistics,
    getClientTypeStatistics,
  } = useClients();

  const translations = React.useMemo(
    () => ({
      "Add Client": language === "ar" ? "إضافة عميل" : "Add Client",
      "Clients Overview":
        language === "ar" ? "نظرة عامة على العملاء" : "Clients Overview",
      Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
      "Total Clients": language === "ar" ? "إجمالي العملاء" : "Total Clients",
      Individual: language === "ar" ? "فردي" : "Individual",
      Business: language === "ar" ? "تجاري" : "Business",
      "This Month": language === "ar" ? "هذا الشهر" : "This Month",
      "Recent Clients": language === "ar" ? "العملاء الجدد" : "Recent Clients",
      "View All Clients":
        language === "ar" ? "عرض جميع العملاء" : "View All Clients",
      "No clients found":
        language === "ar" ? "لم يتم العثور على عملاء" : "No clients found",
      "Error loading data":
        language === "ar" ? "خطأ في تحميل البيانات" : "Error loading data",
      Retry: language === "ar" ? "المحاولة مرة أخرى" : "Retry",
      View: language === "ar" ? "عرض" : "View",
      Edit: language === "ar" ? "تعديل" : "Edit",
      Clone: language === "ar" ? "نسخ" : "Clone",
      Delete: language === "ar" ? "حذف" : "Delete",
      Cancel: language === "ar" ? "إلغاء" : "Cancel",
      "Get started by adding your first client":
        language === "ar"
          ? "ابدأ بإضافة عميلك الأول"
          : "Get started by adding your first client",
      "Manage and view your client information":
        language === "ar"
          ? "إدارة ومشاهدة معلومات عملائك"
          : "Manage and view your client information",
      "Failed to load some data":
        language === "ar"
          ? "فشل في تحميل بعض البيانات"
          : "Failed to load some data",
      "Partial data loaded":
        language === "ar" ? "تم تحميل البيانات جزئياً" : "Partial data loaded",
      "Delete Client": language === "ar" ? "حذف العميل" : "Delete Client",
      "Are you sure you want to delete this client?":
        language === "ar"
          ? "هل أنت متأكد من حذف هذا العميل؟"
          : "Are you sure you want to delete this client?",
      "This action cannot be undone.":
        language === "ar"
          ? "لا يمكن التراجع عن هذا الإجراء."
          : "This action cannot be undone.",
      "Client deleted successfully":
        language === "ar"
          ? "تم حذف العميل بنجاح"
          : "Client deleted successfully",
      "Failed to delete client":
        language === "ar" ? "فشل في حذف العميل" : "Failed to delete client",
      "Client not found":
        language === "ar" ? "العميل غير موجود" : "Client not found",
    }),
    [language]
  );

  // Simplified local state - NO INITIAL LOADING STATE
  const [hasError, setHasError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [dataRefreshing, setDataRefreshing] = useState(false);

  // Delete Modal State
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert State
  const [alert, setAlert] = useState({
    isVisible: false,
    type: "success", // success, error, warning
    title: "",
    message: "",
  });

  // Check authentication (but don't block UI)
  useEffect(() => {
    if (!token && !localStorage.getItem("token")) {
      navigate("/admin-Login");
      return;
    }
  }, [token, navigate]);

  // Background data fetching - NO LOADING STATE BLOCKING
  useEffect(() => {
    let mounted = true;

    const fetchDataInBackground = async () => {
      if (hasFetched || !mounted) return;

      const hasToken = token || localStorage.getItem("token");
      if (!hasToken) return;

      try {
        setHasFetched(true);
        setHasError(null);

        // Try to fetch statistics (silently fail if needed)
        try {
          await getClientStatistics();
        } catch (statsError) {
          try {
            await getBasicClientStatistics();
          } catch (basicStatsError) {
            try {
              await getClientTypeStatistics();
            } catch (typeStatsError) {
              console.warn("All statistics endpoints failed");
            }
          }
        }

        // Try to fetch clients (silently fail if needed)
        try {
          await getClients({ page: 1, pageSize: 6 });
        } catch (clientsError) {
          console.warn("Failed to fetch clients:", clientsError);
        }
      } catch (error) {
        console.error("Background fetch error:", error);
        setHasError(error.message);
        setHasFetched(false);
      }
    };

    if ((token || localStorage.getItem("token")) && !hasFetched) {
      fetchDataInBackground();
    }

    return () => {
      mounted = false;
    };
  }, [
    token,
    hasFetched,
    getClients,
    getClientStatistics,
    getBasicClientStatistics,
    getClientTypeStatistics,
  ]);

  // Manual refresh
  const handleRefresh = useCallback(async () => {
    setDataRefreshing(true);
    setHasError(null);
    setHasFetched(false);

    // Let the useEffect handle the actual fetching
    setTimeout(() => {
      setDataRefreshing(false);
    }, 2000); // Stop refreshing indicator after 2 seconds
  }, []);

  // Show alert helper function
  const showAlert = (type, title, message = "") => {
    setAlert({
      isVisible: true,
      type,
      title,
      message,
    });
  };

  // Hide alert
  const hideAlert = () => {
    setAlert({
      ...alert,
      isVisible: false,
    });
  };

  // Handle delete client confirmation
  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      await deleteClient(clientToDelete.Id);
      setShowDeleteModal(false);
      setClientToDelete(null);

      // Show success alert
      showAlert(
        "success",
        translations["Client deleted successfully"],
        `${
          clientToDelete.FullName || clientToDelete.BusinessName
        } has been removed from your client list.`
      );

      // Refresh the clients list
      await getClients({ page: 1, pageSize: 6 });
    } catch (error) {
      console.error("Error deleting client:", error);

      // Show error alert
      showAlert(
        "error",
        translations["Failed to delete client"],
        error.message || "An error occurred while trying to delete the client."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete client button click
  const handleDeleteClient = (clientId) => {
    const client = Array.isArray(clientsArray)
      ? clientsArray.find((c) => c.Id === clientId)
      : null;

    if (client) {
      setClientToDelete(client);
      setShowDeleteModal(true);
    } else {
      showAlert(
        "error",
        translations["Client not found"],
        "The client you're trying to delete could not be found."
      );
    }
  };

  // Statistics Card Component
  const StatCard = React.memo(
    ({ title, value, icon: Icon, bgColor, iconColor, trend, isLoading }) => (
      <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <Container className="flex items-center justify-between">
          <Container>
            <Span className="text-gray-500 text-sm font-medium">{title}</Span>
            {isLoading ? (
              <Container className="w-16 h-8 bg-gray-200 animate-pulse rounded mt-1"></Container>
            ) : (
              <Span className="text-2xl font-bold text-gray-900 mt-1 block">
                {value || 0}
              </Span>
            )}
            {trend && !isLoading && (
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
    )
  );

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

          <Container className="flex gap-1 mt-3">
            <button
              onClick={() => navigate(`/admin/ViewClients-Details/${client.Id}`)}
              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
              title={translations.View}
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              onClick={() =>
                navigate("/admin/new-clients", {
                  state: { editData: client, isEditing: true },
                })
              }
              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
              title={translations.Edit}
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={() =>
                navigate("/admin/new-clients", {
                  state: {
                    cloneData: {
                      ...client,
                      FullName: `${client.FullName || ""} (Copy)`,
                      Email: "",
                      CodeNumber: "",
                      Id: undefined,
                    },
                  },
                })
              }
              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
              title={translations.Clone}
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleDeleteClient(client.Id)}
              className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              title={translations.Delete}
            >
              <AiOutlineDelete className="w-3 h-3" />
            </button>
          </Container>
        </Container>
      </Container>
    </Container>
  ));

  // Loading skeleton for client cards
  const ClientCardSkeleton = () => (
    <Container className="bg-white p-4 rounded-lg border border-gray-200">
      <Container className="animate-pulse">
        <Container className="w-16 h-5 bg-gray-200 rounded mb-2"></Container>
        <Container className="w-32 h-6 bg-gray-200 rounded mb-2"></Container>
        <Container className="w-40 h-4 bg-gray-200 rounded mb-1"></Container>
        <Container className="w-36 h-4 bg-gray-200 rounded mb-1"></Container>
        <Container className="w-28 h-4 bg-gray-200 rounded mb-3"></Container>
        <Container className="flex gap-1">
          <Container className="w-7 h-7 bg-gray-200 rounded"></Container>
          <Container className="w-7 h-7 bg-gray-200 rounded"></Container>
          <Container className="w-7 h-7 bg-gray-200 rounded"></Container>
        </Container>
      </Container>
    </Container>
  );

  // Get safe array from clients data - handle nested API response structure
  const clientsArray = React.useMemo(() => {
    if (!clients) return [];

    // Handle different possible response structures
    if (Array.isArray(clients)) {
      return clients;
    }

    // Handle nested response structure: { Data: { $values: [...] } }
    if (clients.Data && Array.isArray(clients.Data.$values)) {
      return clients.Data.$values;
    }

    // Handle direct $values structure: { $values: [...] }
    if (Array.isArray(clients.$values)) {
      return clients.$values;
    }

    console.warn("Unexpected clients data structure:", clients);
    return [];
  }, [clients]);

  const isDataLoading = loading || (!hasFetched && !hasError);

  // Debug logging for clients data
  React.useEffect(() => {
    console.log("🔍 CLIENTS DATA DEBUG:");
    console.log("Raw clients from context:", clients);
    console.log("Processed clientsArray:", clientsArray);
    console.log("Array length:", clientsArray.length);
    console.log("Is loading:", isDataLoading);
  }, [clients, clientsArray, isDataLoading]);

  // SHOW DASHBOARD IMMEDIATELY - NO LOADING SCREEN
  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Custom Alert */}
      <CustomAlert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        autoClose={true}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!isDeleting) {
            setShowDeleteModal(false);
            setClientToDelete(null);
          }
        }}
        onConfirm={confirmDeleteClient}
        title={translations["Delete Client"]}
        message={
          translations["Are you sure you want to delete this client?"] +
          " " +
          translations["This action cannot be undone."]
        }
        itemName={
          clientToDelete
            ? clientToDelete.FullName || clientToDelete.BusinessName
            : ""
        }
        isDeleting={isDeleting}
        variant="danger"
      />

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
            {hasError && (
              <Span className="text-red-600 text-xs block mt-1">
                ⚠️ {hasError}
              </Span>
            )}
          </Container>
          <Container className="flex gap-3">
            <FilledButton
              isIcon={true}
              icon={RefreshCw}
              iconSize="w-4 h-4"
              bgColor={
                dataRefreshing ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"
              }
              textColor={dataRefreshing ? "text-gray-500" : "text-gray-700"}
              rounded="rounded-lg"
              buttonText=""
              height="h-10"
              width="w-10"
              onClick={handleRefresh}
              disabled={dataRefreshing}
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

        {/* Statistics Cards - Show immediately with loading states */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={translations["Total Clients"]}
            value={statistics?.totalClients}
            icon={Users}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            trend={
              statistics?.clientsThisMonth
                ? `+${statistics.clientsThisMonth} this month`
                : null
            }
            isLoading={isDataLoading}
          />
          <StatCard
            title={translations.Individual}
            value={statistics?.individualClients}
            icon={User}
            bgColor="bg-green-50"
            iconColor="text-green-600"
            isLoading={isDataLoading}
          />
          <StatCard
            title={translations.Business}
            value={statistics?.businessClients}
            icon={Building}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
            isLoading={isDataLoading}
          />
          <StatCard
            title={translations["This Month"]}
            value={statistics?.clientsThisMonth}
            icon={Calendar}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
            isLoading={isDataLoading}
          />
        </Container>

        {/* Recent Clients - Show immediately */}
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
            {isDataLoading ? (
              // Show skeleton loading instead of blocking
              <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <ClientCardSkeleton key={index} />
                ))}
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

        {/* Additional Stats and Quick Actions */}
        <Container className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Distribution */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Client Distribution
            </h3>
            <Container className="space-y-4">
              <Container className="flex items-center justify-between">
                <Container className="flex items-center">
                  <Container className="w-3 h-3 bg-blue-500 rounded-full mr-3"></Container>
                  <Span className="text-sm text-gray-600">
                    Individual Clients
                  </Span>
                </Container>
                {isDataLoading ? (
                  <Container className="w-8 h-4 bg-gray-200 animate-pulse rounded"></Container>
                ) : (
                  <Span className="text-sm font-medium text-gray-900">
                    {statistics?.individualClients || 0}
                  </Span>
                )}
              </Container>
              <Container className="flex items-center justify-between">
                <Container className="flex items-center">
                  <Container className="w-3 h-3 bg-green-500 rounded-full mr-3"></Container>
                  <Span className="text-sm text-gray-600">
                    Business Clients
                  </Span>
                </Container>
                {isDataLoading ? (
                  <Container className="w-8 h-4 bg-gray-200 animate-pulse rounded"></Container>
                ) : (
                  <Span className="text-sm font-medium text-gray-900">
                    {statistics?.businessClients || 0}
                  </Span>
                )}
              </Container>
              <Container className="pt-2 border-t border-gray-200">
                <Container className="flex items-center justify-between">
                  <Span className="text-sm font-medium text-gray-900">
                    Total
                  </Span>
                  {isDataLoading ? (
                    <Container className="w-8 h-4 bg-gray-200 animate-pulse rounded"></Container>
                  ) : (
                    <Span className="text-sm font-bold text-gray-900">
                      {statistics?.totalClients || 0}
                    </Span>
                  )}
                </Container>
              </Container>
            </Container>
          </Container>

          {/* Quick Actions */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <Container className="space-y-3">
              <button
                onClick={() => navigate("/admin/new-clients")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Container className="flex items-center">
                  <Plus className="w-5 h-5 text-blue-600 mr-3" />
                  <Container>
                    <Span className="text-sm font-medium text-gray-900 block">
                      Add New Client
                    </Span>
                    <Span className="text-xs text-gray-500">
                      Create a new client profile
                    </Span>
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
                    <Span className="text-sm font-medium text-gray-900 block">
                      View All Clients
                    </Span>
                    <Span className="text-xs text-gray-500">
                      Browse complete client list
                    </Span>
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
                    <Span className="text-sm font-medium text-gray-900 block">
                      Refresh Statistics
                    </Span>
                    <Span className="text-xs text-gray-500">
                      Update dashboard data
                    </Span>
                  </Container>
                </Container>
              </button>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default DynamicClientDashboard;
