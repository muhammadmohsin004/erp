// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   ArrowUpCircle,
//   DollarSign,
//   Calendar,
//   FileText,
//   Eye,
//   Edit,
//   Copy,
//   Trash2,
//   Filter,
//   Download,
//   X,
//   RefreshCw,
//   Search,
//   ArrowLeft,
// } from "lucide-react";
// import {
//   AiOutlineEye,
//   AiOutlineEdit,
//   AiOutlineCopy,
//   AiOutlineDelete,
//   AiOutlineDownload,
// } from "react-icons/ai";
// import { useFinance } from "../../Contexts/FinanceContext/FinanceContext";
// import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
// import Modall from "../../components/elements/modal/Modal";
// import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
// import Table from "../../components/elements/table/Table";
// import Container from "../../components/elements/container/Container";
// import Span from "../../components/elements/span/Span";

// const IncomeList = () => {
//   const navigate = useNavigate();
//   const language = useSelector((state) => state.language?.language || "en");
//   const token = useSelector((state) => state.auth?.token);

//   const translations = {
//     "Income Management":
//       language === "ar" ? "إدارة الدخل" : "Income Management",
//     "Add Income": language === "ar" ? "إضافة دخل" : "Add Income",
//     "Back to Dashboard":
//       language === "ar" ? "العودة للوحة التحكم" : "Back to Dashboard",
//     "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
//     Search: language === "ar" ? "بحث" : "Search",
//     Filters: language === "ar" ? "الفلاتر" : "Filters",
//     Export: language === "ar" ? "تصدير" : "Export",
//     "Export All": language === "ar" ? "تصدير الكل" : "Export All",
//     "Export Selected": language === "ar" ? "تصدير المحدد" : "Export Selected",
//     Selected: language === "ar" ? "محدد" : "Selected",
//     Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
//     "No incomes found": language === "ar" ? "لا يوجد دخل" : "No incomes found",
//     Amount: language === "ar" ? "المبلغ" : "Amount",
//     Currency: language === "ar" ? "العملة" : "Currency",
//     Description: language === "ar" ? "الوصف" : "Description",
//     "Code Number": language === "ar" ? "رقم الكود" : "Code Number",
//     Date: language === "ar" ? "التاريخ" : "Date",
//     "Created At": language === "ar" ? "تاريخ الإنشاء" : "Created At",
//     Actions: language === "ar" ? "الإجراءات" : "Actions",
//     Showing: language === "ar" ? "عرض" : "Showing",
//     Of: language === "ar" ? "من" : "of",
//     Items: language === "ar" ? "عناصر" : "Items",
//     View: language === "ar" ? "عرض" : "View",
//     Edit: language === "ar" ? "تعديل" : "Edit",
//     Clone: language === "ar" ? "نسخ" : "Clone",
//     Delete: language === "ar" ? "حذف" : "Delete",
//     "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
//     "Delete Income": language === "ar" ? "حذف الدخل" : "Delete Income",
//     "This action cannot be undone":
//       language === "ar"
//         ? "لا يمكن التراجع عن هذا الإجراء"
//         : "This action cannot be undone",
//     Cancel: language === "ar" ? "إلغاء" : "Cancel",
//     "Income Details": language === "ar" ? "تفاصيل الدخل" : "Income Details",
//     Close: language === "ar" ? "إغلاق" : "Close",
//     "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
//     "No results found":
//       language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
//     "Total Incomes": language === "ar" ? "إجمالي الدخل" : "Total Incomes",
//     "This Month": language === "ar" ? "هذا الشهر" : "This Month",
//     "Total Amount": language === "ar" ? "إجمالي المبلغ" : "Total Amount",
//     "Is Recurring": language === "ar" ? "متكرر" : "Is Recurring",
//     "Recurring Frequency":
//       language === "ar" ? "تكرار التكرار" : "Recurring Frequency",
//     "Recurring End Date":
//       language === "ar" ? "تاريخ انتهاء التكرار" : "Recurring End Date",
//     "Vendor ID": language === "ar" ? "معرف البائع" : "Vendor ID",
//     "Category ID": language === "ar" ? "معرف الفئة" : "Category ID",
//     "Journal Account ID":
//       language === "ar" ? "معرف حساب اليومية" : "Journal Account ID",
//     "Supplier ID": language === "ar" ? "معرف المورد" : "Supplier ID",
//     Attachment: language === "ar" ? "المرفق" : "Attachment",
//     Yes: language === "ar" ? "نعم" : "Yes",
//     No: language === "ar" ? "لا" : "No",
//     "Download Attachment":
//       language === "ar" ? "تحميل المرفق" : "Download Attachment",
//     Refresh: language === "ar" ? "تحديث" : "Refresh",
//     "Export successful":
//       language === "ar" ? "تم التصدير بنجاح" : "Export successful",
//     "Export failed": language === "ar" ? "فشل التصدير" : "Export failed",
//     "No data to export":
//       language === "ar" ? "لا توجد بيانات للتصدير" : "No data to export",
//     "Exporting...": language === "ar" ? "جاري التصدير..." : "Exporting...",
//   };

//   // Get finance context
//   const {
//     incomes,
//     incomeLoading,
//     incomeError,
//     incomePagination,
//     getIncomes,
//     getIncome,
//     deleteIncome,
//     searchIncomes,
//     changeIncomePage,
//     setIncomeFilters,
//     getAllIncomes, // Assuming this function exists to get all incomes for export
//   } = useFinance();

//   // Process incomes data from API response
//   const incomesData = incomes?.Data?.$values || [];

//   // Local state management
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterOptions, setFilterOptions] = useState({
//     currency: "",
//     sortBy: "Id",
//     sortAscending: false,
//     dateFrom: "",
//     dateTo: "",
//     isRecurring: null,
//   });
//   const [selectedIncomes, setSelectedIncomes] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedIncome, setSelectedIncome] = useState(null);
//   const [incomeToDelete, setIncomeToDelete] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);

//   // Statistics state
//   const [statistics, setStatistics] = useState({
//     totalIncomes: 0,
//     totalAmount: 0,
//     thisMonth: 0,
//     averageAmount: 0,
//   });

//   // Fetch incomes on component mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         await getIncomes();
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//       }
//     };

//     if (token) {
//       fetchInitialData();
//     }
//   }, [token, getIncomes]);

//   // Update statistics when incomes change
//   useEffect(() => {
//     if (Array.isArray(incomesData) && incomesData.length > 0) {
//       const stats = {
//         totalIncomes: incomePagination?.TotalItems || incomesData.length,
//         totalAmount: incomesData.reduce(
//           (sum, income) => sum + (parseFloat(income.Amount) || 0),
//           0
//         ),
//         thisMonth: incomesData.filter((income) => {
//           const createdDate = new Date(income.CreatedAt);
//           const now = new Date();
//           return (
//             createdDate.getMonth() === now.getMonth() &&
//             createdDate.getFullYear() === now.getFullYear()
//           );
//         }).length,
//         averageAmount:
//           incomesData.length > 0
//             ? incomesData.reduce(
//                 (sum, income) => sum + (parseFloat(income.Amount) || 0),
//                 0
//               ) / incomesData.length
//             : 0,
//       };
//       setStatistics(stats);
//     }
//   }, [incomesData, incomePagination]);

//   // Handle search when searchTerm changes (with debounce)
//   useEffect(() => {
//     const delayedSearch = setTimeout(() => {
//       if (searchTerm !== undefined) {
//         handleSearchIncomes();
//       }
//     }, 500); // 500ms debounce

//     return () => clearTimeout(delayedSearch);
//   }, [searchTerm]);

//   // Handle filters change
//   useEffect(() => {
//     setSelectedIncomes([]);
//     setSelectAll(false);
//   }, [incomesData]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/admin-Login");
//     }
//   }, [token, navigate]);

//   // CSV Export functionality
//   const convertToCSV = (data) => {
//     if (!data || data.length === 0) return "";

//     const headers = [
//       "ID",
//       "Description",
//       "Code Number",
//       "Amount",
//       "Currency",
//       "Date",
//       "Is Recurring",
//       "Recurring Frequency",
//       "Recurring End Date",
//       "Vendor ID",
//       "Category ID",
//       "Journal Account ID",
//       "Supplier ID",
//       "Attachment Path",
//       "Created At",
//       "Updated At",
//     ];

//     const csvRows = [];

//     // Add headers
//     csvRows.push(headers.join(","));

//     // Add data rows
//     data.forEach((income) => {
//       const row = [
//         income.Id || "",
//         `"${(income.Description || "").replace(/"/g, '""')}"`,
//         income.CodeNumber || "",
//         income.Amount || "",
//         income.Currency || "",
//         income.Date || "",
//         income.IsRecurring ? "Yes" : "No",
//         income.RecurringFrequency || "",
//         income.RecurringEndDate || "",
//         income.VendorId || "",
//         income.CategoryId || "",
//         income.JournalAccountId || "",
//         income.SupplierId || "",
//         income.AttachmentPath || "",
//         income.CreatedAt || "",
//         income.UpdatedAt || "",
//       ];
//       csvRows.push(row.join(","));
//     });

//     return csvRows.join("\n");
//   };

//   const downloadCSV = (csvContent, filename) => {
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");

//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", filename);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     }
//   };

//   const handleExport = async (exportType = "all") => {
//     setIsExporting(true);

//     try {
//       let dataToExport = [];
//       let filename = "";

//       if (exportType === "selected" && selectedIncomes.length > 0) {
//         // Export selected incomes
//         dataToExport = incomesData.filter((income) =>
//           selectedIncomes.includes(income.Id)
//         );
//         filename = `selected_incomes_${
//           new Date().toISOString().split("T")[0]
//         }.csv`;
//       } else if (exportType === "all") {
//         // For exporting all, we might need to fetch all data if pagination is involved
//         if (incomePagination && incomePagination.TotalPages > 1) {
//           // If there are multiple pages, we need to get all data
//           try {
//             const allIncomesResponse = await getAllIncomes?.(); // Assuming this function exists
//             dataToExport = allIncomesResponse?.Data?.$values || incomesData;
//           } catch (error) {
//             console.warn(
//               "Could not fetch all incomes, exporting current page only"
//             );
//             dataToExport = incomesData;
//           }
//         } else {
//           dataToExport = incomesData;
//         }
//         filename = `all_incomes_${new Date().toISOString().split("T")[0]}.csv`;
//       }

//       if (dataToExport.length === 0) {
//         alert(translations["No data to export"]);
//         return;
//       }

//       const csvContent = convertToCSV(dataToExport);
//       downloadCSV(csvContent, filename);

//       // Show success message
//       alert(
//         `${translations["Export successful"]} - ${dataToExport.length} ${translations.Items}`
//       );
//     } catch (error) {
//       console.error("Export error:", error);
//       alert(translations["Export failed"]);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   // Search function
//   const handleSearchIncomes = async () => {
//     try {
//       if (searchTerm.trim() === "") {
//         await getIncomes();
//       } else {
//         await searchIncomes(searchTerm);
//       }
//     } catch (error) {
//       console.error("Error searching incomes:", error);
//     }
//   };

//   // Income selection
//   const handleIncomeSelection = (incomeId) => {
//     setSelectedIncomes((prev) => {
//       if (prev.includes(incomeId)) {
//         return prev.filter((id) => id !== incomeId);
//       } else {
//         return [...prev, incomeId];
//       }
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedIncomes([]);
//     } else {
//       const incomeIds = Array.isArray(incomesData)
//         ? incomesData.map((income) => income.Id)
//         : [];
//       setSelectedIncomes(incomeIds);
//     }
//     setSelectAll(!selectAll);
//   };

//   // Income actions
//   const handleViewIncome = async (incomeId) => {
//     try {
//       const incomeData = await getIncome(incomeId);
//       if (incomeData) {
//         setSelectedIncome(incomeData);
//         setShowViewModal(true);
//       }
//     } catch (error) {
//       console.error("Error fetching income details:", error);
//       alert("Failed to fetch income details");
//     }
//   };

//   const handleEditIncome = async (incomeId) => {
//     try {
//       const incomeData = await getIncome(incomeId);
//       if (incomeData) {
//         navigate("/admin/finance/income/new", {
//           state: {
//             editData: incomeData,
//             isEditing: true,
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching income for edit:", error);
//       alert("Failed to fetch income details for editing");
//     }
//   };

//   const handleCloneIncome = async (incomeId) => {
//     try {
//       const incomeData = await getIncome(incomeId);
//       if (incomeData) {
//         navigate("/admin/finance/income/new", {
//           state: {
//             cloneData: {
//               ...incomeData,
//               Description: `${incomeData.Description || ""} (Copy)`,
//               CodeNumber: "",
//               Id: undefined,
//             },
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error cloning income:", error);
//       alert("Failed to clone income");
//     }
//   };

//   const handleDeleteIncome = (incomeId) => {
//     const income = Array.isArray(incomesData)
//       ? incomesData.find((i) => i.Id === incomeId)
//       : null;
//     if (income) {
//       setIncomeToDelete(income);
//       setShowDeleteModal(true);
//     } else {
//       alert("Income not found");
//     }
//   };

//   const confirmDeleteIncome = async () => {
//     if (!incomeToDelete) return;

//     setIsDeleting(true);
//     try {
//       await deleteIncome(incomeToDelete.Id);
//       setShowDeleteModal(false);
//       setIncomeToDelete(null);
//       await getIncomes();
//     } catch (error) {
//       console.error("Error deleting income:", error);
//       alert("Failed to delete income");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Pagination
//   const handlePageChange = async (newPage) => {
//     if (newPage < 1 || newPage > incomePagination.TotalPages) return;

//     try {
//       await changeIncomePage(newPage);
//     } catch (error) {
//       console.error("Error changing page:", error);
//     }
//   };

//   // Filter functions
//   const handleApplyFilters = async () => {
//     try {
//       setIncomeFilters(filterOptions);
//       setShowFilters(false);
//       await getIncomes();
//     } catch (error) {
//       console.error("Error applying filters:", error);
//     }
//   };

//   const handleClearFilters = async () => {
//     setSearchTerm("");
//     setFilterOptions({
//       currency: "",
//       sortBy: "Id",
//       sortAscending: false,
//       dateFrom: "",
//       dateTo: "",
//       isRecurring: null,
//     });
//     setShowFilters(false);

//     try {
//       setIncomeFilters({
//         searchTerm: "",
//         currency: "",
//         sortBy: "Id",
//         sortAscending: false,
//         dateFrom: "",
//         dateTo: "",
//         isRecurring: null,
//       });
//       await getIncomes();
//     } catch (error) {
//       console.error("Error clearing filters:", error);
//     }
//   };

//   // Format currency
//   const formatCurrency = (value, currency = "PKR") => {
//     const numValue = parseFloat(value) || 0;
//     return `${currency} ${numValue.toFixed(2)}`;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString();
//   };

//   // Statistics Card Component
//   const StatCard = ({
//     title,
//     value,
//     icon: Icon,
//     bgColor,
//     iconColor,
//     isCurrency = false,
//   }) => (
//     <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//       <Container className="flex items-center justify-between">
//         <Container>
//           <Span className="text-gray-500 text-sm font-medium">{title}</Span>
//           <Span className="text-2xl font-bold text-gray-900 mt-1 block">
//             {isCurrency ? formatCurrency(value) : value || 0}
//           </Span>
//         </Container>
//         <Container className={`${bgColor} p-3 rounded-lg`}>
//           <Icon className={`w-6 h-6 ${iconColor}`} />
//         </Container>
//       </Container>
//     </Container>
//   );

//   // Loading state
//   if (!token) {
//     return (
//       <Container className="flex justify-center items-center min-h-screen">
//         <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
//       </Container>
//     );
//   }

//   return (
//     <Container className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <Container className="px-6 py-6">
//         <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
//           <Container className="flex items-center gap-4 mb-4 lg:mb-0">
//             <FilledButton
//               isIcon={true}
//               icon={ArrowLeft}
//               iconSize="w-4 h-4"
//               bgColor="bg-gray-100 hover:bg-gray-200"
//               textColor="text-gray-700"
//               rounded="rounded-lg"
//               buttonText=""
//               height="h-10"
//               width="w-10"
//               onClick={() => navigate("/admin/finance")}
//             />
//             <h1 className="text-2xl font-bold text-gray-900">
//               {translations["Income Management"]}
//             </h1>
//             {selectedIncomes.length > 0 && (
//               <Span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                 {selectedIncomes.length} {translations.Selected}
//               </Span>
//             )}
//           </Container>
//           <Container className="flex gap-3 flex-wrap">
//             <FilledButton
//               isIcon={true}
//               icon={RefreshCw}
//               iconSize="w-4 h-4"
//               bgColor="bg-gray-100 hover:bg-gray-200"
//               textColor="text-gray-700"
//               rounded="rounded-lg"
//               buttonText={translations.Refresh}
//               height="h-10"
//               px="px-4"
//               fontWeight="font-medium"
//               fontSize="text-sm"
//               isIconLeft={true}
//               onClick={() => getIncomes()}
//             />
//             <FilledButton
//               isIcon={true}
//               icon={Filter}
//               iconSize="w-4 h-4"
//               bgColor="bg-gray-100 hover:bg-gray-200"
//               textColor="text-gray-700"
//               rounded="rounded-lg"
//               buttonText={translations.Filters}
//               height="h-10"
//               px="px-4"
//               fontWeight="font-medium"
//               fontSize="text-sm"
//               isIconLeft={true}
//               onClick={() => setShowFilters(true)}
//             />
//             <Container className="relative">
//               {selectedIncomes.length > 0 ? (
//                 <Container className="flex gap-2">
//                   <FilledButton
//                     isIcon={true}
//                     icon={Download}
//                     iconSize="w-4 h-4"
//                     bgColor="bg-blue-600 hover:bg-blue-700"
//                     textColor="text-white"
//                     rounded="rounded-lg"
//                     buttonText={`${translations["Export Selected"]} (${selectedIncomes.length})`}
//                     height="h-10"
//                     px="px-4"
//                     fontWeight="font-medium"
//                     fontSize="text-sm"
//                     isIconLeft={true}
//                     disabled={isExporting}
//                     onClick={() => handleExport("selected")}
//                   />
//                   <FilledButton
//                     isIcon={true}
//                     icon={Download}
//                     iconSize="w-4 h-4"
//                     bgColor="bg-gray-600 hover:bg-gray-700"
//                     textColor="text-white"
//                     rounded="rounded-lg"
//                     buttonText={translations["Export All"]}
//                     height="h-10"
//                     px="px-4"
//                     fontWeight="font-medium"
//                     fontSize="text-sm"
//                     isIconLeft={true}
//                     disabled={isExporting}
//                     onClick={() => handleExport("all")}
//                   />
//                 </Container>
//               ) : (
//                 <FilledButton
//                   isIcon={true}
//                   icon={Download}
//                   iconSize="w-4 h-4"
//                   bgColor="bg-gray-600 hover:bg-gray-700"
//                   textColor="text-white"
//                   rounded="rounded-lg"
//                   buttonText={
//                     isExporting
//                       ? translations["Exporting..."]
//                       : translations["Export All"]
//                   }
//                   height="h-10"
//                   px="px-4"
//                   fontWeight="font-medium"
//                   fontSize="text-sm"
//                   isIconLeft={true}
//                   disabled={isExporting}
//                   onClick={() => handleExport("all")}
//                 />
//               )}
//             </Container>
//             <FilledButton
//               isIcon={true}
//               icon={Plus}
//               iconSize="w-4 h-4"
//               bgColor="bg-green-600 hover:bg-green-700"
//               textColor="text-white"
//               rounded="rounded-lg"
//               buttonText={translations["Add Income"]}
//               height="h-10"
//               px="px-4"
//               fontWeight="font-medium"
//               fontSize="text-sm"
//               isIconLeft={true}
//               onClick={() => navigate("/admin/finance/income/new")}
//             />
//           </Container>
//         </Container>

//         {/* Statistics Cards */}
//         <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <StatCard
//             title={translations["Total Incomes"]}
//             value={statistics?.totalIncomes || 0}
//             icon={ArrowUpCircle}
//             bgColor="bg-green-50"
//             iconColor="text-green-600"
//           />
//           <StatCard
//             title={translations["Total Amount"]}
//             value={statistics?.totalAmount || 0}
//             icon={DollarSign}
//             bgColor="bg-blue-50"
//             iconColor="text-blue-600"
//             isCurrency={true}
//           />
//           <StatCard
//             title={translations["This Month"]}
//             value={statistics?.thisMonth || 0}
//             icon={Calendar}
//             bgColor="bg-purple-50"
//             iconColor="text-purple-600"
//           />
//           <StatCard
//             title="Average Amount"
//             value={statistics?.averageAmount || 0}
//             icon={FileText}
//             bgColor="bg-orange-50"
//             iconColor="text-orange-600"
//             isCurrency={true}
//           />
//         </Container>

//         {/* Search Bar */}
//         <Container className="mb-6">
//           <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <SearchAndFilters
//               isFocused={false}
//               searchValue={searchTerm}
//               setSearchValue={setSearchTerm}
//             />
//           </Container>
//         </Container>

//         {/* Income Table */}
//         <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
//           {incomeLoading ? (
//             <Container className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//               <Span className="text-green-500 text-lg block mt-4">
//                 {translations.Loading}
//               </Span>
//             </Container>
//           ) : incomeError ? (
//             <Container className="text-center py-12">
//               <Span className="text-red-500 text-lg block mb-4">
//                 Error: {incomeError}
//               </Span>
//               <FilledButton
//                 bgColor="bg-green-600 hover:bg-green-700"
//                 textColor="text-white"
//                 rounded="rounded-lg"
//                 buttonText="Retry"
//                 height="h-10"
//                 px="px-4"
//                 fontWeight="font-medium"
//                 fontSize="text-sm"
//                 onClick={() => getIncomes()}
//               />
//             </Container>
//           ) : !Array.isArray(incomesData) || incomesData.length === 0 ? (
//             <Container className="text-center py-12">
//               <ArrowUpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 {searchTerm || filterOptions.currency
//                   ? translations["No results found"]
//                   : translations["No incomes found"]}
//               </h3>
//               {(searchTerm || filterOptions.currency) && (
//                 <FilledButton
//                   bgColor="bg-green-600 hover:bg-green-700"
//                   textColor="text-white"
//                   rounded="rounded-lg"
//                   buttonText={`${translations["Clear All"]} ${translations.Filters}`}
//                   height="h-10"
//                   px="px-4"
//                   fontWeight="font-medium"
//                   fontSize="text-sm"
//                   onClick={handleClearFilters}
//                 />
//               )}
//             </Container>
//           ) : (
//             <>
//               <Container className="overflow-x-auto">
//                 <Table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-3 text-left">
//                         <input
//                           type="checkbox"
//                           checked={selectAll}
//                           onChange={handleSelectAll}
//                           className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                         />
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {translations.Description}
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
//                         {translations["Code Number"]}
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {translations.Amount}
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
//                         {translations.Date}
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
//                         {translations["Is Recurring"]}
//                       </th>
//                       <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {translations.Actions}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {incomesData.map((income) => (
//                       <tr key={income.Id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4">
//                           <input
//                             type="checkbox"
//                             checked={selectedIncomes.includes(income.Id)}
//                             onChange={() => handleIncomeSelection(income.Id)}
//                             className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                           />
//                         </td>
//                         <td className="px-6 py-4">
//                           <Container>
//                             <Span className="text-sm font-medium text-gray-900">
//                               {income.Description || "N/A"}
//                             </Span>
//                             <Span className="text-sm text-gray-500 block">
//                               Created: {formatDate(income.CreatedAt)}
//                             </Span>
//                           </Container>
//                         </td>
//                         <td className="px-6 py-4 hidden md:table-cell">
//                           <Span className="text-sm text-gray-900">
//                             {income.CodeNumber || "-"}
//                           </Span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <Container className="flex items-center gap-1">
//                             <DollarSign className="w-3 h-3 text-green-600" />
//                             <Span className="text-sm font-medium text-green-600">
//                               {formatCurrency(income.Amount, income.Currency)}
//                             </Span>
//                           </Container>
//                         </td>
//                         <td className="px-6 py-4 hidden lg:table-cell">
//                           <Container className="flex items-center gap-1">
//                             <Calendar className="w-3 h-3 text-gray-400" />
//                             <Span className="text-sm text-gray-900">
//                               {formatDate(income.Date)}
//                             </Span>
//                           </Container>
//                         </td>
//                         <td className="px-6 py-4 hidden xl:table-cell">
//                           <Span
//                             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               income.IsRecurring
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-gray-100 text-gray-800"
//                             }`}
//                           >
//                             {income.IsRecurring
//                               ? translations.Yes
//                               : translations.No}
//                           </Span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <Container className="flex justify-center gap-1">
//                             {/* View Button */}
//                             <button
//                               onClick={() => handleViewIncome(income.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
//                               title={translations.View}
//                             >
//                               <AiOutlineEye className="w-3 h-3" />
//                             </button>

//                             {/* Edit Button */}
//                             <button
//                               onClick={() => handleEditIncome(income.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
//                               title={translations.Edit}
//                             >
//                               <AiOutlineEdit className="w-3 h-3" />
//                             </button>

//                             {/* Clone Button */}
//                             <button
//                               onClick={() => handleCloneIncome(income.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
//                               title={translations.Clone}
//                             >
//                               <AiOutlineCopy className="w-3 h-3" />
//                             </button>

//                             {/* Delete Button */}
//                             <button
//                               onClick={() => handleDeleteIncome(income.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
//                               title={translations.Delete}
//                             >
//                               <AiOutlineDelete className="w-3 h-3" />
//                             </button>
//                           </Container>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Container>

//               {/* Pagination */}
//               {incomePagination &&
//                 incomePagination.TotalPages &&
//                 incomePagination.TotalPages > 1 && (
//                   <Container className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
//                     <Span className="text-sm text-gray-500">
//                       {translations.Showing}{" "}
//                       {(incomePagination.CurrentPage - 1) *
//                         incomePagination.PageSize +
//                         1}{" "}
//                       -{" "}
//                       {Math.min(
//                         incomePagination.CurrentPage *
//                           incomePagination.PageSize,
//                         incomePagination.TotalItems
//                       )}{" "}
//                       {translations.Of} {incomePagination.TotalItems}{" "}
//                       {translations.Items}
//                     </Span>
//                     <Container className="flex gap-2">
//                       <FilledButton
//                         isIcon={true}
//                         icon={ChevronsLeft}
//                         iconSize="w-4 h-4"
//                         bgColor="bg-gray-100 hover:bg-gray-200"
//                         textColor="text-gray-700"
//                         rounded="rounded-md"
//                         buttonText=""
//                         height="h-8"
//                         width="w-8"
//                         disabled={!incomePagination.HasPreviousPage}
//                         onClick={() => handlePageChange(1)}
//                       />
//                       <FilledButton
//                         isIcon={true}
//                         icon={ChevronLeft}
//                         iconSize="w-4 h-4"
//                         bgColor="bg-gray-100 hover:bg-gray-200"
//                         textColor="text-gray-700"
//                         rounded="rounded-md"
//                         buttonText=""
//                         height="h-8"
//                         width="w-8"
//                         disabled={!incomePagination.HasPreviousPage}
//                         onClick={() =>
//                           handlePageChange(incomePagination.CurrentPage - 1)
//                         }
//                       />
//                       <Span className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center">
//                         {incomePagination.CurrentPage} /{" "}
//                         {incomePagination.TotalPages}
//                       </Span>
//                       <FilledButton
//                         isIcon={true}
//                         icon={ChevronRight}
//                         iconSize="w-4 h-4"
//                         bgColor="bg-gray-100 hover:bg-gray-200"
//                         textColor="text-gray-700"
//                         rounded="rounded-md"
//                         buttonText=""
//                         height="h-8"
//                         width="w-8"
//                         disabled={!incomePagination.HasNextPage}
//                         onClick={() =>
//                           handlePageChange(incomePagination.CurrentPage + 1)
//                         }
//                       />
//                       <FilledButton
//                         isIcon={true}
//                         icon={ChevronsRight}
//                         iconSize="w-4 h-4"
//                         bgColor="bg-gray-100 hover:bg-gray-200"
//                         textColor="text-gray-700"
//                         rounded="rounded-md"
//                         buttonText=""
//                         height="h-8"
//                         width="w-8"
//                         disabled={!incomePagination.HasNextPage}
//                         onClick={() =>
//                           handlePageChange(incomePagination.TotalPages)
//                         }
//                       />
//                     </Container>
//                   </Container>
//                 )}
//             </>
//           )}
//         </Container>
//       </Container>

//       {/* View Income Modal */}
//       <Modall
//         modalOpen={showViewModal}
//         setModalOpen={setShowViewModal}
//         title={
//           <Container className="flex items-center gap-2">
//             <Eye className="w-5 h-5" />
//             <Span>{translations["Income Details"]}</Span>
//           </Container>
//         }
//         width={900}
//         okText={translations.Edit}
//         cancelText={translations.Close}
//         okAction={() => {
//           setShowViewModal(false);
//           handleEditIncome(selectedIncome?.Id);
//         }}
//         cancelAction={() => setShowViewModal(false)}
//         body={
//           selectedIncome && (
//             <Container className="max-h-96 overflow-y-auto">
//               <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Basic Information */}
//                 <Container className="space-y-4">
//                   <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
//                     Basic Information
//                   </h3>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations.Description}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       {selectedIncome.Description || "N/A"}
//                     </Span>
//                   </Container>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations["Code Number"]}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       {selectedIncome.CodeNumber || "N/A"}
//                     </Span>
//                   </Container>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations.Amount}
//                     </Span>
//                     <Span className="text-sm text-green-600 font-medium block mt-1">
//                       {formatCurrency(
//                         selectedIncome.Amount,
//                         selectedIncome.Currency
//                       )}
//                     </Span>
//                   </Container>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations.Date}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       {formatDate(selectedIncome.Date)}
//                     </Span>
//                   </Container>
//                 </Container>

//                 {/* Additional Information */}
//                 <Container className="space-y-4">
//                   <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
//                     Additional Information
//                   </h3>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations["Is Recurring"]}
//                     </Span>
//                     <Span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
//                         selectedIncome.IsRecurring
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {selectedIncome.IsRecurring
//                         ? translations.Yes
//                         : translations.No}
//                     </Span>
//                   </Container>

//                   {selectedIncome.IsRecurring && (
//                     <>
//                       <Container>
//                         <Span className="text-sm font-medium text-gray-500">
//                           {translations["Recurring Frequency"]}
//                         </Span>
//                         <Span className="text-sm text-gray-900 block mt-1">
//                           {selectedIncome.RecurringFrequency || "N/A"}
//                         </Span>
//                       </Container>

//                       <Container>
//                         <Span className="text-sm font-medium text-gray-500">
//                           {translations["Recurring End Date"]}
//                         </Span>
//                         <Span className="text-sm text-gray-900 block mt-1">
//                           {formatDate(selectedIncome.RecurringEndDate)}
//                         </Span>
//                       </Container>
//                     </>
//                   )}

//                   {selectedIncome.AttachmentPath && (
//                     <Container>
//                       <Span className="text-sm font-medium text-gray-500">
//                         {translations.Attachment}
//                       </Span>
//                       <FilledButton
//                         isIcon={true}
//                         icon={Download}
//                         iconSize="w-3 h-3"
//                         bgColor="bg-blue-600 hover:bg-blue-700"
//                         textColor="text-white"
//                         rounded="rounded-md"
//                         buttonText={translations["Download Attachment"]}
//                         height="h-8"
//                         px="px-3"
//                         fontWeight="font-medium"
//                         fontSize="text-xs"
//                         isIconLeft={true}
//                         onClick={() =>
//                           window.open(selectedIncome.AttachmentPath, "_blank")
//                         }
//                       />
//                     </Container>
//                   )}

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations["Vendor ID"]}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       {selectedIncome.VendorId || "N/A"}
//                     </Span>
//                   </Container>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations["Category ID"]}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       {selectedIncome.CategoryId || "N/A"}
//                     </Span>
//                   </Container>
//                 </Container>
//               </Container>

//               <Container className="mt-6 pt-4 border-t border-gray-200">
//                 <Container className="text-xs text-gray-500 space-y-1">
//                   <Container>
//                     Created: {formatDate(selectedIncome.CreatedAt)}
//                   </Container>
//                   {selectedIncome.UpdatedAt && (
//                     <Container>
//                       Updated: {formatDate(selectedIncome.UpdatedAt)}
//                     </Container>
//                   )}
//                 </Container>
//               </Container>
//             </Container>
//           )
//         }
//       />

//       {/* Delete Confirmation Modal */}
//       <Modall
//         modalOpen={showDeleteModal}
//         setModalOpen={setShowDeleteModal}
//         title={
//           <Container className="flex items-center gap-2 text-red-600">
//             <Trash2 className="w-5 h-5" />
//             <Span>{translations["Delete Income"]}</Span>
//           </Container>
//         }
//         width={500}
//         okText={translations.Delete}
//         cancelText={translations.Cancel}
//         okAction={confirmDeleteIncome}
//         cancelAction={() => setShowDeleteModal(false)}
//         okButtonDisabled={isDeleting}
//         body={
//           <Container className="text-center py-4">
//             <Container className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <Trash2 className="w-8 h-8 text-red-600" />
//             </Container>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               {translations["Are you sure?"]}
//             </h3>
//             <Span className="text-gray-500 mb-4 block">
//               {translations["This action cannot be undone"]}. This will
//               permanently delete the income{" "}
//               <strong>"{incomeToDelete?.Description}"</strong> and all
//               associated data.
//             </Span>
//           </Container>
//         }
//       />

//       {/* Filters Sidebar/Offcanvas */}
//       {showFilters && (
//         <Container className="fixed inset-0 z-50 overflow-hidden">
//           <Container
//             className="absolute inset-0 bg-black bg-opacity-50"
//             onClick={() => setShowFilters(false)}
//           />
//           <Container className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
//             <Container className="p-6">
//               <Container className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   {translations.Filters}
//                 </h3>
//                 <FilledButton
//                   isIcon={true}
//                   icon={X}
//                   iconSize="w-4 h-4"
//                   bgColor="bg-gray-100 hover:bg-gray-200"
//                   textColor="text-gray-700"
//                   rounded="rounded-md"
//                   buttonText=""
//                   height="h-8"
//                   width="w-8"
//                   onClick={() => setShowFilters(false)}
//                 />
//               </Container>

//               <Container className="space-y-4">
//                 <Container>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     {translations.Currency}
//                   </label>
//                   <select
//                     value={filterOptions.currency}
//                     onChange={(e) =>
//                       setFilterOptions({
//                         ...filterOptions,
//                         currency: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
//                   >
//                     <option value="">All Currencies</option>
//                     <option value="PKR">PKR</option>
//                     <option value="USD">USD</option>
//                     <option value="EUR">EUR</option>
//                   </select>
//                 </Container>

//                 <Container>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     {translations["Is Recurring"]}
//                   </label>
//                   <select
//                     value={filterOptions.isRecurring || ""}
//                     onChange={(e) =>
//                       setFilterOptions({
//                         ...filterOptions,
//                         isRecurring:
//                           e.target.value === ""
//                             ? null
//                             : e.target.value === "true",
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
//                   >
//                     <option value="">All Types</option>
//                     <option value="true">{translations.Yes}</option>
//                     <option value="false">{translations.No}</option>
//                   </select>
//                 </Container>

//                 <Container>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date From
//                   </label>
//                   <input
//                     type="date"
//                     value={filterOptions.dateFrom}
//                     onChange={(e) =>
//                       setFilterOptions({
//                         ...filterOptions,
//                         dateFrom: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
//                   />
//                 </Container>

//                 <Container>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date To
//                   </label>
//                   <input
//                     type="date"
//                     value={filterOptions.dateTo}
//                     onChange={(e) =>
//                       setFilterOptions({
//                         ...filterOptions,
//                         dateTo: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
//                   />
//                 </Container>

//                 <Container>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Sort By
//                   </label>
//                   <select
//                     value={filterOptions.sortBy}
//                     onChange={(e) =>
//                       setFilterOptions({
//                         ...filterOptions,
//                         sortBy: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
//                   >
//                     <option value="Id">Date Created</option>
//                     <option value="Amount">Amount</option>
//                     <option value="Date">Date</option>
//                     <option value="Description">Description</option>
//                     <option value="CodeNumber">Code Number</option>
//                   </select>
//                 </Container>

//                 <Container>
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={filterOptions.sortAscending}
//                       onChange={(e) =>
//                         setFilterOptions({
//                           ...filterOptions,
//                           sortAscending: e.target.checked,
//                         })
//                       }
//                       className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                     />
//                     <Span className="ml-2 text-sm text-gray-700">
//                       Sort Ascending
//                     </Span>
//                   </label>
//                 </Container>
//               </Container>

//               <Container className="flex gap-3 mt-6">
//                 <FilledButton
//                   bgColor="bg-green-600 hover:bg-green-700"
//                   textColor="text-white"
//                   rounded="rounded-lg"
//                   buttonText={translations["Apply Filters"]}
//                   height="h-10"
//                   width="flex-1"
//                   fontWeight="font-medium"
//                   fontSize="text-sm"
//                   onClick={handleApplyFilters}
//                 />
//                 <FilledButton
//                   bgColor="bg-gray-100 hover:bg-gray-200"
//                   textColor="text-gray-700"
//                   rounded="rounded-lg"
//                   buttonText={translations["Clear All"]}
//                   height="h-10"
//                   width="flex-1"
//                   fontWeight="font-medium"
//                   fontSize="text-sm"
//                   onClick={handleClearFilters}
//                 />
//               </Container>
//             </Container>
//           </Container>
//         </Container>
//       )}
//     </Container>
//   );
// };

// export default IncomeList;
