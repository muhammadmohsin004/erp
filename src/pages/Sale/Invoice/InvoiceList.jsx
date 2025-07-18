// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
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
//   Receipt,
//   TrendingUp,
//   Users,
//   Clock,
//   Search,
//   Mail,
// } from "lucide-react";
// import {
//   AiOutlineEye,
//   AiOutlineEdit,
//   AiOutlineCopy,
//   AiOutlineDelete,
//   AiOutlineFilePdf,
//   AiOutlinePrinter,
//   AiOutlineMail,
// } from "react-icons/ai";
// import { useInvoices } from "../../../Contexts/InvoiceContext/InvoiceContext";
// import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
// import Modall from "../../../components/elements/modal/Modal";
// import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
// import Table from "../../../components/elements/table/Table";
// import Container from "../../../components/elements/container/Container";
// import Span from "../../../components/elements/span/Span";

// const InvoiceList = () => {
//   const navigate = useNavigate();
//   const language = useSelector((state) => state.language?.language || "en");
//   const token = useSelector((state) => state.auth?.token);

//   const translations = {
//     Invoices: language === "ar" ? "الفواتير" : "Invoices",
//     "Add Invoice": language === "ar" ? "إضافة فاتورة" : "Add Invoice",
//     "Create Invoice": language === "ar" ? "إنشاء فاتورة" : "Create Invoice",
//     "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
//     Search: language === "ar" ? "بحث" : "Search",
//     Filters: language === "ar" ? "الفلاتر" : "Filters",
//     Export: language === "ar" ? "تصدير" : "Export",
//     Selected: language === "ar" ? "محدد" : "Selected",
//     Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
//     "No Invoices": language === "ar" ? "لا توجد فواتير" : "No invoices found",
//     "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
//     Customer: language === "ar" ? "العميل" : "Customer",
//     "Invoice Date": language === "ar" ? "تاريخ الفاتورة" : "Invoice Date",
//     "Due Date": language === "ar" ? "تاريخ الاستحقاق" : "Due Date",
//     Amount: language === "ar" ? "المبلغ" : "Amount",
//     Status: language === "ar" ? "الحالة" : "Status",
//     Actions: language === "ar" ? "الإجراءات" : "Actions",
//     Showing: language === "ar" ? "عرض" : "Showing",
//     Of: language === "ar" ? "من" : "of",
//     Items: language === "ar" ? "عناصر" : "Items",
//     Draft: language === "ar" ? "مسودة" : "Draft",
//     Sent: language === "ar" ? "مرسلة" : "Sent",
//     Paid: language === "ar" ? "مدفوعة" : "Paid",
//     Overdue: language === "ar" ? "متأخرة" : "Overdue",
//     Cancelled: language === "ar" ? "ملغاة" : "Cancelled",
//     Total: language === "ar" ? "المجموع" : "Total",
//     "This Month": language === "ar" ? "هذا الشهر" : "This Month",
//     Outstanding: language === "ar" ? "المستحقة" : "Outstanding",
//     Revenue: language === "ar" ? "الإيرادات" : "Revenue",
//     View: language === "ar" ? "عرض" : "View",
//     Edit: language === "ar" ? "تعديل" : "Edit",
//     Clone: language === "ar" ? "نسخ" : "Clone",
//     Delete: language === "ar" ? "حذف" : "Delete",
//     Print: language === "ar" ? "طباعة" : "Print",
//     Email: language === "ar" ? "إرسال بريد" : "Email",
//     PDF: language === "ar" ? "PDF" : "PDF",
//     "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
//     "Delete Invoice": language === "ar" ? "حذف الفاتورة" : "Delete Invoice",
//     "This action cannot be undone":
//       language === "ar"
//         ? "لا يمكن التراجع عن هذا الإجراء"
//         : "This action cannot be undone",
//     Cancel: language === "ar" ? "إلغاء" : "Cancel",
//     "Invoice Details":
//       language === "ar" ? "تفاصيل الفاتورة" : "Invoice Details",
//     Close: language === "ar" ? "إغلاق" : "Close",
//     "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
//     "No results found":
//       language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
//     "All Status": language === "ar" ? "جميع الحالات" : "All Status",
//     "Customer Name": language === "ar" ? "اسم العميل" : "Customer Name",
//     Description: language === "ar" ? "الوصف" : "Description",
//     "Sub Total": language === "ar" ? "المجموع الفرعي" : "Sub Total",
//     "Tax Amount": language === "ar" ? "مبلغ الضريبة" : "Tax Amount",
//     "Total Amount": language === "ar" ? "المبلغ الإجمالي" : "Total Amount",
//     Notes: language === "ar" ? "ملاحظات" : "Notes",
//     Created: language === "ar" ? "تم الإنشاء" : "Created",
//     Updated: language === "ar" ? "تم التحديث" : "Updated",
//   };

//   // Get invoice context
//   const {
//     invoices,
//     loading: invoicesLoading,
//     error,
//     invoicesPagination,
//     getInvoices,
//     getInvoice,
//     deleteInvoice,
//   } = useInvoices();

//   // Process invoices data from API response
//   const invoicesData = invoices?.Data?.$values || [];

//   // Local state management
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isFocused] = useState(false);
//   const [filterOptions, setFilterOptions] = useState({
//     status: "",
//     sortBy: "InvoiceNumber",
//     sortAscending: true,
//   });
//   const [selectedInvoices, setSelectedInvoices] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [invoiceToDelete, setInvoiceToDelete] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Statistics state
//   const [statistics, setStatistics] = useState({
//     totalInvoices: 0,
//     totalRevenue: 0,
//     outstandingAmount: 0,
//     thisMonthInvoices: 0,
//   });

//   // Fetch invoices on component mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         await getInvoices({ page: 1, pageSize: 25 });
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//       }
//     };

//     if (token) {
//       fetchInitialData();
//     }
//   }, [token, getInvoices]);

//   // Update statistics when invoices change
//   useEffect(() => {
//     if (Array.isArray(invoicesData) && invoicesData.length > 0) {
//       const stats = {
//         totalInvoices: invoicesPagination?.TotalItems || invoicesData.length,
//         totalRevenue: invoicesData.reduce((sum, invoice) => {
//           return sum + (parseFloat(invoice.TotalAmount) || 0);
//         }, 0),
//         outstandingAmount: invoicesData
//           .filter(
//             (invoice) =>
//               invoice.Status === "Sent" ||
//               invoice.Status === "Overdue" ||
//               invoice.Status === "Unpaid" ||
//               invoice.Status === "Partially Paid"
//           )
//           .reduce((sum, invoice) => {
//             return sum + (parseFloat(invoice.TotalAmount) || 0);
//           }, 0),
//         thisMonthInvoices: invoicesData.filter((invoice) => {
//           const invoiceDate = new Date(invoice.InvoiceDate);
//           const now = new Date();
//           return (
//             invoiceDate.getMonth() === now.getMonth() &&
//             invoiceDate.getFullYear() === now.getFullYear()
//           );
//         }).length,
//       };
//       setStatistics(stats);
//     }
//   }, [invoicesData, invoicesPagination]);

//   // Handle search when searchTerm changes (with debounce)
//   useEffect(() => {
//     const delayedSearch = setTimeout(() => {
//       if (searchTerm !== undefined) {
//         handleSearchInvoices();
//       }
//     }, 500);

//     return () => clearTimeout(delayedSearch);
//   }, [searchTerm]);

//   // Handle filters change
//   useEffect(() => {
//     setSelectedInvoices([]);
//     setSelectAll(false);
//   }, [invoicesData]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/admin-Login");
//     }
//   }, [token, navigate]);

//   // Search function
//   const handleSearchInvoices = async () => {
//     try {
//       if (searchTerm.trim() === "") {
//         await getInvoices({ page: 1, pageSize: 25 });
//       } else {
//         await getInvoices({
//           page: 1,
//           pageSize: 25,
//           search: searchTerm,
//         });
//       }
//     } catch (error) {
//       console.error("Error searching invoices:", error);
//     }
//   };

//   // Invoice selection
//   const handleInvoiceSelection = (invoiceId) => {
//     setSelectedInvoices((prev) => {
//       if (prev.includes(invoiceId)) {
//         return prev.filter((id) => id !== invoiceId);
//       } else {
//         return [...prev, invoiceId];
//       }
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedInvoices([]);
//     } else {
//       const invoiceIds = Array.isArray(invoicesData)
//         ? invoicesData.map((invoice) => invoice.Id)
//         : [];
//       setSelectedInvoices(invoiceIds);
//     }
//     setSelectAll(!selectAll);
//   };

//   // Invoice actions
//   const handleViewInvoice = async (invoiceId) => {
//     try {
//       const invoiceData = await getInvoice(invoiceId);
//       if (invoiceData) {
//         setSelectedInvoice(invoiceData);
//         setShowViewModal(true);
//       }
//     } catch (error) {
//       console.error("Error fetching invoice details:", error);
//       alert("Failed to fetch invoice details");
//     }
//   };

//   const handleEditInvoice = async (invoiceId) => {
//     try {
//       const invoiceData = await getInvoice(invoiceId);
//       if (invoiceData) {
//         navigate("/admin/new-invoice", {
//           state: {
//             editData: invoiceData,
//             isEditing: true,
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching invoice for edit:", error);
//       alert("Failed to fetch invoice details for editing");
//     }
//   };

//   const handleCloneInvoice = async (invoiceId) => {
//     try {
//       const invoiceData = await getInvoice(invoiceId);
//       if (invoiceData) {
//         navigate("/admin/new-invoice", {
//           state: {
//             cloneData: {
//               ...invoiceData,
//               InvoiceNumber: `${invoiceData.InvoiceNumber || ""} (Copy)`,
//               Id: undefined,
//             },
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error cloning invoice:", error);
//       alert("Failed to clone invoice");
//     }
//   };

//   const handleDeleteInvoice = (invoiceId) => {
//     const invoice = Array.isArray(invoicesData)
//       ? invoicesData.find((inv) => inv.Id === invoiceId)
//       : null;
//     if (invoice) {
//       setInvoiceToDelete(invoice);
//       setShowDeleteModal(true);
//     } else {
//       alert("Invoice not found");
//     }
//   };

//   const handlePrintInvoice = (invoiceId) => {
//     navigate(`/admin/invoice-view/${invoiceId}`, {
//       state: { action: "print" },
//     });
//   };

//   const handleEmailInvoice = (invoiceId) => {
//     // Implement email functionality
//     console.log("Email invoice:", invoiceId);
//     alert("Email functionality to be implemented");
//   };

//   const handlePDFInvoice = (invoiceId) => {
//     navigate(`/admin/invoice-view/${invoiceId}`, {
//       state: { action: "pdf" },
//     });
//   };

//   const confirmDeleteInvoice = async () => {
//     if (!invoiceToDelete) return;

//     setIsDeleting(true);
//     try {
//       await deleteInvoice(invoiceToDelete.Id);
//       setShowDeleteModal(false);
//       setInvoiceToDelete(null);
//       // Refresh the invoice list
//       await getInvoices({ page: 1, pageSize: 25 });
//     } catch (error) {
//       console.error("Error deleting invoice:", error);
//       alert("Failed to delete invoice");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Pagination
//   const handlePageChange = async (newPage) => {
//     if (newPage < 1 || newPage > invoicesPagination.TotalPages) return;

//     try {
//       await getInvoices({
//         page: newPage,
//         pageSize: invoicesPagination.PageSize,
//         search: searchTerm,
//         sortBy: filterOptions.sortBy,
//         sortAscending: filterOptions.sortAscending,
//       });
//     } catch (error) {
//       console.error("Error changing page:", error);
//     }
//   };

//   // Filter functions
//   const handleApplyFilters = async () => {
//     try {
//       await getInvoices({
//         page: 1,
//         pageSize: 25,
//         search: searchTerm,
//         sortBy: filterOptions.sortBy,
//         sortAscending: filterOptions.sortAscending,
//       });
//       setShowFilters(false);
//     } catch (error) {
//       console.error("Error applying filters:", error);
//     }
//   };

//   const handleClearFilters = async () => {
//     setSearchTerm("");
//     setFilterOptions({
//       status: "",
//       sortBy: "InvoiceNumber",
//       sortAscending: true,
//     });
//     setShowFilters(false);

//     try {
//       await getInvoices({ page: 1, pageSize: 25 });
//     } catch (error) {
//       console.error("Error clearing filters:", error);
//     }
//   };

//   // Export functionality
//   const handleExport = () => {
//     console.log(
//       "Export invoices:",
//       selectedInvoices.length > 0 ? selectedInvoices : "all"
//     );
//     alert("Export functionality to be implemented");
//   };

//   // Format currency
//   const formatCurrency = (value) => {
//     const numValue = parseFloat(value) || 0;
//     return numValue.toFixed(2);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString();
//   };

//   // Get status badge color
//   // Get status badge color
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "draft":
//         return "bg-gray-100 text-gray-800";
//       case "sent":
//         return "bg-blue-100 text-blue-800";
//       case "paid":
//         return "bg-green-100 text-green-800";
//       case "partially paid":
//         return "bg-orange-100 text-orange-800";
//       case "unpaid":
//         return "bg-red-100 text-red-800";
//       case "overdue":
//         return "bg-red-100 text-red-800";
//       case "cancelled":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
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
//             {isCurrency ? `$${formatCurrency(value)}` : value || 0}
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
//             <h1 className="text-2xl font-bold text-gray-900">
//               {translations.Invoices}
//             </h1>
//             {selectedInvoices.length > 0 && (
//               <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                 {selectedInvoices.length} {translations.Selected}
//               </Span>
//             )}
//           </Container>
//           <Container className="flex gap-3 flex-wrap">
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
//             <FilledButton
//               isIcon={true}
//               icon={Download}
//               iconSize="w-4 h-4"
//               bgColor="bg-gray-100 hover:bg-gray-200"
//               textColor="text-gray-700"
//               rounded="rounded-lg"
//               buttonText={translations.Export}
//               height="h-10"
//               px="px-4"
//               fontWeight="font-medium"
//               fontSize="text-sm"
//               isIconLeft={true}
//               onClick={handleExport}
//             />
//             <FilledButton
//               isIcon={true}
//               icon={Plus}
//               iconSize="w-4 h-4"
//               bgColor="bg-blue-600 hover:bg-blue-700"
//               textColor="text-white"
//               rounded="rounded-lg"
//               buttonText={translations["Create Invoice"]}
//               height="h-10"
//               px="px-4"
//               fontWeight="font-medium"
//               fontSize="text-sm"
//               isIconLeft={true}
//               onClick={() => navigate("/admin/new-invoice")}
//             />
//           </Container>
//         </Container>

//         {/* Statistics Cards */}
//         <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <StatCard
//             title={`${translations.Total} ${translations.Invoices}`}
//             value={statistics?.totalInvoices || 0}
//             icon={Receipt}
//             bgColor="bg-blue-50"
//             iconColor="text-blue-600"
//           />
//           <StatCard
//             title={translations.Revenue}
//             value={statistics?.totalRevenue || 0}
//             icon={DollarSign}
//             bgColor="bg-green-50"
//             iconColor="text-green-600"
//             isCurrency={true}
//           />
//           <StatCard
//             title={translations.Outstanding}
//             value={statistics?.outstandingAmount || 0}
//             icon={Clock}
//             bgColor="bg-yellow-50"
//             iconColor="text-yellow-600"
//             isCurrency={true}
//           />
//           <StatCard
//             title={translations["This Month"]}
//             value={statistics?.thisMonthInvoices || 0}
//             icon={Calendar}
//             bgColor="bg-purple-50"
//             iconColor="text-purple-600"
//           />
//         </Container>

//         {/* Search Bar */}
//         <Container className="mb-6">
//           <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <SearchAndFilters
//               isFocused={isFocused}
//               searchValue={searchTerm}
//               setSearchValue={setSearchTerm}
//             />
//           </Container>
//         </Container>

//         {/* Invoice Table */}
//         <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
//           {invoicesLoading ? (
//             <Container className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <Span className="text-blue-500 text-lg block mt-4">
//                 {translations.Loading}
//               </Span>
//             </Container>
//           ) : error ? (
//             <Container className="text-center py-12">
//               <Span className="text-red-500 text-lg block mb-4">
//                 Error: {error}
//               </Span>
//               <FilledButton
//                 bgColor="bg-blue-600 hover:bg-blue-700"
//                 textColor="text-white"
//                 rounded="rounded-lg"
//                 buttonText="Retry"
//                 height="h-10"
//                 px="px-4"
//                 fontWeight="font-medium"
//                 fontSize="text-sm"
//                 onClick={() => getInvoices({ page: 1, pageSize: 25 })}
//               />
//             </Container>
//           ) : !Array.isArray(invoicesData) || invoicesData.length === 0 ? (
//             <Container className="text-center py-12">
//               <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 {searchTerm || filterOptions.status
//                   ? translations["No results found"]
//                   : translations["No Invoices"]}
//               </h3>
//               {(searchTerm || filterOptions.status) && (
//                 <FilledButton
//                   bgColor="bg-blue-600 hover:bg-blue-700"
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
//                           className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         />
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {translations["Invoice Number"]}
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
//                         {translations.Customer}
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
//                         {translations["Invoice Date"]}
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {translations.Amount}
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {translations.Status}
//                       </th>
//                       <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {translations.Actions}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {invoicesData.map((invoice) => (
//                       <tr key={invoice.Id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4">
//                           <input
//                             type="checkbox"
//                             checked={selectedInvoices.includes(invoice.Id)}
//                             onChange={() => handleInvoiceSelection(invoice.Id)}
//                             className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                           />
//                         </td>
//                         <td className="px-6 py-4">
//                           <Container>
//                             <Span className="text-sm font-medium text-gray-900">
//                               {invoice.InvoiceNumber || "N/A"}
//                             </Span>
//                             {invoice.Description && (
//                               <Span className="text-sm text-gray-500 block truncate max-w-xs">
//                                 {invoice.Description}
//                               </Span>
//                             )}
//                           </Container>
//                         </td>
//                         <td className="px-6 py-4 hidden md:table-cell">
//                           <Span className="text-sm text-gray-900">
//                             {invoice.CustomerName ||
//                               invoice.CustomerId ||
//                               "N/A"}
//                           </Span>
//                         </td>
//                         <td className="px-6 py-4 hidden lg:table-cell">
//                           <Container className="flex items-center gap-1">
//                             <Calendar className="w-3 h-3 text-gray-400" />
//                             <Span className="text-sm text-gray-900">
//                               {formatDate(invoice.InvoiceDate)}
//                             </Span>
//                           </Container>
//                         </td>
//                         <td className="px-6 py-4">
//                           <Container className="flex items-center gap-1">
//                             <DollarSign className="w-3 h-3 text-green-600" />
//                             <Span className="text-sm font-medium text-green-600">
//                               {formatCurrency(invoice.TotalAmount)}
//                             </Span>
//                           </Container>
//                         </td>
//                         <td className="px-6 py-4">
//                           <Span
//                             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
//                               invoice.Status
//                             )}`}
//                           >
//                             {translations[invoice.Status] ||
//                               invoice.Status ||
//                               "N/A"}
//                           </Span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <Container className="flex justify-center gap-1">
//                             {/* View Button */}
//                             <button
//                               onClick={() => handleViewInvoice(invoice.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
//                               title={translations.View}
//                             >
//                               <AiOutlineEye className="w-3 h-3" />
//                             </button>

//                             {/* PDF Button */}
//                             <button
//                               onClick={() => handlePDFInvoice(invoice.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
//                               title={translations.PDF}
//                             >
//                               <AiOutlineFilePdf className="w-3 h-3" />
//                             </button>

//                             {/* Print Button */}
//                             <button
//                               onClick={() => handlePrintInvoice(invoice.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200"
//                               title={translations.Print}
//                             >
//                               <AiOutlinePrinter className="w-3 h-3" />
//                             </button>

//                             {/* Edit Button */}
//                             <button
//                               onClick={() => handleEditInvoice(invoice.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
//                               title={translations.Edit}
//                             >
//                               <AiOutlineEdit className="w-3 h-3" />
//                             </button>

//                             {/* Clone Button */}
//                             <button
//                               onClick={() => handleCloneInvoice(invoice.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
//                               title={translations.Clone}
//                             >
//                               <AiOutlineCopy className="w-3 h-3" />
//                             </button>

//                             {/* Delete Button */}
//                             <button
//                               onClick={() => handleDeleteInvoice(invoice.Id)}
//                               className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
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
//               {invoicesPagination &&
//                 invoicesPagination.TotalPages &&
//                 invoicesPagination.TotalPages > 1 && (
//                   <Container className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
//                     <Span className="text-sm text-gray-500">
//                       {translations.Showing}{" "}
//                       {(invoicesPagination.PageNumber - 1) *
//                         invoicesPagination.PageSize +
//                         1}{" "}
//                       -{" "}
//                       {Math.min(
//                         invoicesPagination.PageNumber *
//                           invoicesPagination.PageSize,
//                         invoicesPagination.TotalItems
//                       )}{" "}
//                       {translations.Of} {invoicesPagination.TotalItems}{" "}
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
//                         disabled={!invoicesPagination.HasPreviousPage}
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
//                         disabled={!invoicesPagination.HasPreviousPage}
//                         onClick={() =>
//                           handlePageChange(invoicesPagination.PageNumber - 1)
//                         }
//                       />
//                       <Span className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center">
//                         {invoicesPagination.PageNumber} /{" "}
//                         {invoicesPagination.TotalPages}
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
//                         disabled={!invoicesPagination.HasNextPage}
//                         onClick={() =>
//                           handlePageChange(invoicesPagination.PageNumber + 1)
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
//                         disabled={!invoicesPagination.HasNextPage}
//                         onClick={() =>
//                           handlePageChange(invoicesPagination.TotalPages)
//                         }
//                       />
//                     </Container>
//                   </Container>
//                 )}
//             </>
//           )}
//         </Container>
//       </Container>

//       {/* View Invoice Modal */}
//       <Modall
//         modalOpen={showViewModal}
//         setModalOpen={setShowViewModal}
//         title={
//           <Container className="flex items-center gap-2">
//             <Eye className="w-5 h-5" />
//             <Span>{translations["Invoice Details"]}</Span>
//           </Container>
//         }
//         width={900}
//         okText={translations.Edit}
//         cancelText={translations.Close}
//         okAction={() => {
//           setShowViewModal(false);
//           handleEditInvoice(selectedInvoice?.Id);
//         }}
//         cancelAction={() => setShowViewModal(false)}
//         body={
//           selectedInvoice && (
//             <Container className="max-h-96 overflow-y-auto">
//               <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Basic Information */}
//                 <Container className="space-y-4">
//                   <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
//                     Invoice Information
//                   </h3>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations["Invoice Number"]}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       {selectedInvoice.InvoiceNumber || "N/A"}
//                     </Span>
//                   </Container>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations.Customer}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       {selectedInvoice.CustomerName ||
//                         selectedInvoice.CustomerId ||
//                         "N/A"}
//                     </Span>
//                   </Container>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations.Description}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       {selectedInvoice.Description || "N/A"}
//                     </Span>
//                   </Container>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations.Status}
//                     </Span>
//                     <Span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
//                         selectedInvoice.Status
//                       )}`}
//                     >
//                       {translations[selectedInvoice.Status] ||
//                         selectedInvoice.Status ||
//                         "N/A"}
//                     </Span>
//                   </Container>
//                 </Container>

//                 {/* Financial Information */}
//                 <Container className="space-y-4">
//                   <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
//                     Financial Information
//                   </h3>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations["Sub Total"]}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       ${formatCurrency(selectedInvoice.SubTotal)}
//                     </Span>
//                   </Container>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations["Tax Amount"]}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       ${formatCurrency(selectedInvoice.TaxAmount)}
//                     </Span>
//                   </Container>

//                   <Container>
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations["Total Amount"]}
//                     </Span>
//                     <Span className="text-sm text-green-600 font-medium block mt-1">
//                       ${formatCurrency(selectedInvoice.TotalAmount)}
//                     </Span>
//                   </Container>
//                 </Container>
//               </Container>

//               {/* Dates */}
//               <Container className="mt-6 pt-4 border-t border-gray-200">
//                 <Container className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <Container className="text-center">
//                     <Span className="text-lg font-bold text-blue-600">
//                       {formatDate(selectedInvoice.InvoiceDate)}
//                     </Span>
//                     <Span className="text-xs text-gray-500 block">
//                       {translations["Invoice Date"]}
//                     </Span>
//                   </Container>
//                   <Container className="text-center">
//                     <Span className="text-lg font-bold text-orange-600">
//                       {formatDate(selectedInvoice.DueDate)}
//                     </Span>
//                     <Span className="text-xs text-gray-500 block">
//                       {translations["Due Date"]}
//                     </Span>
//                   </Container>
//                 </Container>

//                 {selectedInvoice.Notes && (
//                   <Container className="mt-4">
//                     <Span className="text-sm font-medium text-gray-500">
//                       {translations.Notes}
//                     </Span>
//                     <Span className="text-sm text-gray-900 block mt-1">
//                       {selectedInvoice.Notes}
//                     </Span>
//                   </Container>
//                 )}

//                 <Container className="text-xs text-gray-500 space-y-1 mt-4">
//                   <Container>
//                     {translations.Created}:{" "}
//                     {formatDate(selectedInvoice.CreatedAt)}
//                   </Container>
//                   {selectedInvoice.UpdatedAt && (
//                     <Container>
//                       {translations.Updated}:{" "}
//                       {formatDate(selectedInvoice.UpdatedAt)}
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
//             <Span>{translations["Delete Invoice"]}</Span>
//           </Container>
//         }
//         width={500}
//         okText={translations.Delete}
//         cancelText={translations.Cancel}
//         okAction={confirmDeleteInvoice}
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
//               permanently delete invoice{" "}
//               <strong>"{invoiceToDelete?.InvoiceNumber}"</strong> and all
//               associated data.
//             </Span>
//           </Container>
//         }
//       />

//       {/* Filters Sidebar */}
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
//                     {translations.Status}
//                   </label>
//                   <select
//                     value={filterOptions.status}
//                     onChange={(e) =>
//                       setFilterOptions({
//                         ...filterOptions,
//                         status: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">{translations["All Status"]}</option>
//                     <option value="Draft">{translations.Draft}</option>
//                     <option value="Sent">{translations.Sent}</option>
//                     <option value="Paid">{translations.Paid}</option>
//                     <option value="Overdue">{translations.Overdue}</option>
//                     <option value="Cancelled">{translations.Cancelled}</option>
//                   </select>
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
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="InvoiceNumber">Invoice Number</option>
//                     <option value="InvoiceDate">Invoice Date</option>
//                     <option value="TotalAmount">Amount</option>
//                     <option value="Status">Status</option>
//                     <option value="CreatedAt">Date Created</option>
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
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <Span className="ml-2 text-sm text-gray-700">
//                       Sort Ascending
//                     </Span>
//                   </label>
//                 </Container>
//               </Container>

//               <Container className="flex gap-3 mt-6">
//                 <FilledButton
//                   bgColor="bg-blue-600 hover:bg-blue-700"
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

// export default InvoiceList;
