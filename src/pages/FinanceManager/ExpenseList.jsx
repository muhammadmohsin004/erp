import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowDownCircle,
  DollarSign,
  Calendar,
  FileText,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  X,
  RefreshCw,
  Search,
  ArrowLeft,
  FileDown,
} from "lucide-react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineCopy,
  AiOutlineDelete,
  AiOutlineDownload,
} from "react-icons/ai";
import { useFinance } from "../../Contexts/FinanceContext/FinanceContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import Modall from "../../components/elements/modal/Modal";
import Table from "../../components/elements/table/Table";

const ExpenseList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  // Translations object
  const translations = {
    "Expense Management": language === "ar" ? "إدارة المصروفات" : "Expense Management",
    "Add Expense": language === "ar" ? "إضافة مصروف" : "Add Expense",
    "Back to Dashboard": language === "ar" ? "العودة للوحة التحكم" : "Back to Dashboard",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    "Export PDF": language === "ar" ? "تصدير PDF" : "Export PDF",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No expenses found": language === "ar" ? "لا يوجد مصروفات" : "No expenses found",
    Amount: language === "ar" ? "المبلغ" : "Amount",
    Currency: language === "ar" ? "العملة" : "Currency",
    Description: language === "ar" ? "الوصف" : "Description",
    "Code Number": language === "ar" ? "رقم الكود" : "Code Number",
    Date: language === "ar" ? "التاريخ" : "Date",
    "Created At": language === "ar" ? "تاريخ الإنشاء" : "Created At",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Expense": language === "ar" ? "حذف المصروف" : "Delete Expense",
    "This action cannot be undone": language === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Expense Details": language === "ar" ? "تفاصيل المصروف" : "Expense Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found": language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "Total Expenses": language === "ar" ? "إجمالي المصروفات" : "Total Expenses",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "Total Amount": language === "ar" ? "إجمالي المبلغ" : "Total Amount",
    "Is Recurring": language === "ar" ? "متكرر" : "Is Recurring",
    "Recurring Frequency": language === "ar" ? "تكرار التكرار" : "Recurring Frequency",
    "Recurring End Date": language === "ar" ? "تاريخ انتهاء التكرار" : "Recurring End Date",
    "Vendor ID": language === "ar" ? "معرف البائع" : "Vendor ID",
    "Category ID": language === "ar" ? "معرف الفئة" : "Category ID",
    "Attachment": language === "ar" ? "المرفق" : "Attachment",
    Yes: language === "ar" ? "نعم" : "Yes",
    No: language === "ar" ? "لا" : "No",
    "Download Attachment": language === "ar" ? "تحميل المرفق" : "Download Attachment",
    Refresh: language === "ar" ? "تحديث" : "Refresh",
    "Average Amount": language === "ar" ? "متوسط المبلغ" : "Average Amount",
    "Expense Type": language === "ar" ? "نوع المصروف" : "Expense Type",
    "One-time": language === "ar" ? "مرة واحدة" : "One-time",
    "Recurring": language === "ar" ? "متكرر" : "Recurring",
  };

  // Get finance context
  const {
    expenses,
    expenseLoading,
    expenseError,
    expensePagination,
    getExpenses,
    getExpense,
    deleteExpense,
    searchExpenses,
    changeExpensePage,
    setExpenseFilters,
  } = useFinance();

  // Process expenses data from API response
  const expensesData = expenses?.Data?.$values || [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    currency: "",
    sortBy: "Id",
    sortAscending: false,
    dateFrom: "",
    dateTo: "",
    isRecurring: null,
  });
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    thisMonth: 0,
    averageAmount: 0,
  });

  // Utility functions
  const formatCurrency = (value, currency = "PKR") => {
    const numValue = parseFloat(value) || 0;
    return `${currency} ${numValue.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Statistics Card Component
  const StatCard = ({ title, value, icon: Icon, bgColor, iconColor, isCurrency = false }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <Container className="flex items-center justify-between">
        <Container>
          <Span className="text-gray-500 text-sm font-medium">{title}</Span>
          <Span className="text-2xl font-bold text-gray-900 mt-1 block">
            {isCurrency ? formatCurrency(value) : (value || 0)}
          </Span>
        </Container>
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
      </Container>
    </Container>
  );

  // Effects
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
      return;
    }

    const fetchInitialData = async () => {
      try {
        await getExpenses();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [token, getExpenses, navigate]);

  useEffect(() => {
    if (Array.isArray(expensesData) && expensesData.length > 0) {
      const stats = {
        totalExpenses: expensePagination?.TotalItems || expensesData.length,
        totalAmount: expensesData.reduce((sum, expense) => sum + (parseFloat(expense.Amount) || 0), 0),
        thisMonth: expensesData.filter(expense => {
          const createdDate = new Date(expense.CreatedAt);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() && 
                 createdDate.getFullYear() === now.getFullYear();
        }).length,
        averageAmount: expensesData.length > 0 
          ? expensesData.reduce((sum, expense) => sum + (parseFloat(expense.Amount) || 0), 0) / expensesData.length 
          : 0,
      };
      setStatistics(stats);
    }
  }, [expensesData, expensePagination]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchExpenses();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  useEffect(() => {
    setSelectedExpenses([]);
    setSelectAll(false);
  }, [expensesData]);

  // Event handlers
  const handleSearchExpenses = async () => {
    try {
      if (searchTerm.trim() === "") {
        await getExpenses();
      } else {
        await searchExpenses(searchTerm);
      }
    } catch (error) {
      console.error("Error searching expenses:", error);
    }
  };

  const handleExpenseSelection = (expenseId) => {
    setSelectedExpenses((prev) => {
      if (prev.includes(expenseId)) {
        return prev.filter((id) => id !== expenseId);
      } else {
        return [...prev, expenseId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedExpenses([]);
    } else {
      const expenseIds = Array.isArray(expensesData)
        ? expensesData.map((expense) => expense.Id)
        : [];
      setSelectedExpenses(expenseIds);
    }
    setSelectAll(!selectAll);
  };

  const handleViewExpense = async (expenseId) => {
    try {
      const expenseData = await getExpense(expenseId);
      if (expenseData) {
        setSelectedExpense(expenseData);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching expense details:", error);
      alert("Failed to fetch expense details");
    }
  };

  const handleEditExpense = async (expenseId) => {
    try {
      const expenseData = await getExpense(expenseId);
      if (expenseData) {
        navigate("/admin/finance/expense/new", {
          state: {
            editData: expenseData,
            isEditing: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching expense for edit:", error);
      alert("Failed to fetch expense details for editing");
    }
  };

  const handleCloneExpense = async (expenseId) => {
    try {
      const expenseData = await getExpense(expenseId);
      if (expenseData) {
        navigate("/admin/finance/expense/new", {
          state: {
            cloneData: {
              ...expenseData,
              Description: `${expenseData.Description || ""} (Copy)`,
              CodeNumber: "",
              Id: undefined,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error cloning expense:", error);
      alert("Failed to clone expense");
    }
  };

  const handleDeleteExpense = (expenseId) => {
    const expense = Array.isArray(expensesData)
      ? expensesData.find((e) => e.Id === expenseId)
      : null;
    if (expense) {
      setExpenseToDelete(expense);
      setShowDeleteModal(true);
    } else {
      alert("Expense not found");
    }
  };

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;

    setIsDeleting(true);
    try {
      await deleteExpense(expenseToDelete.Id);
      setShowDeleteModal(false);
      setExpenseToDelete(null);
      await getExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > expensePagination.TotalPages) return;

    try {
      await changeExpensePage(newPage);
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };

  const handleApplyFilters = async () => {
    try {
      setExpenseFilters(filterOptions);
      setShowFilters(false);
      await getExpenses();
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm("");
    setFilterOptions({
      currency: "",
      sortBy: "Id",
      sortAscending: false,
      dateFrom: "",
      dateTo: "",
      isRecurring: null,
    });
    setShowFilters(false);

    try {
      setExpenseFilters({
        searchTerm: '',
        currency: '',
        sortBy: 'Id',
        sortAscending: false,
        dateFrom: '',
        dateTo: '',
        isRecurring: null,
      });
      await getExpenses();
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  // Export functionality - PDF generation
  const handleExportPDF = () => {
    const selectedData = selectedExpenses.length > 0 
      ? expensesData.filter(expense => selectedExpenses.includes(expense.Id))
      : expensesData;

    if (selectedData.length === 0) {
      alert("No data to export");
      return;
    }

    // Create PDF content
    let pdfContent = `
      <html>
        <head>
          <title>Expense Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .total { font-weight: bold; background-color: #e9ecef; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Expense Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Records: ${selectedData.length}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Amount:</strong> ${formatCurrency(selectedData.reduce((sum, expense) => sum + (parseFloat(expense.Amount) || 0), 0))}</p>
            <p><strong>Average Amount:</strong> ${formatCurrency(selectedData.reduce((sum, expense) => sum + (parseFloat(expense.Amount) || 0), 0) / selectedData.length)}</p>
            <p><strong>Date Range:</strong> ${selectedData.length > 0 ? `${formatDate(Math.min(...selectedData.map(e => e.Date)))} - ${formatDate(Math.max(...selectedData.map(e => e.Date)))}` : 'N/A'}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Code Number</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
    `;

    selectedData.forEach(expense => {
      pdfContent += `
        <tr>
          <td>${formatDate(expense.Date)}</td>
          <td>${expense.Description || 'N/A'}</td>
          <td>${expense.CodeNumber || '-'}</td>
          <td>${formatCurrency(expense.Amount, expense.Currency)}</td>
          <td>${expense.Currency}</td>
          <td>${expense.IsRecurring ? 'Recurring' : 'One-time'}</td>
        </tr>
      `;
    });

    const totalAmount = selectedData.reduce((sum, expense) => sum + (parseFloat(expense.Amount) || 0), 0);

    pdfContent += `
            <tr class="total">
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>${formatCurrency(totalAmount)}</strong></td>
              <td colspan="2"></td>
            </tr>
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report was generated automatically by the Finance Management System</p>
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Regular export functionality
  const handleExport = () => {
    console.log(
      "Export expenses:",
      selectedExpenses.length > 0 ? selectedExpenses : "all"
    );
    alert("Export functionality to be implemented");
  };

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <Container className="flex items-center gap-4 mb-4 lg:mb-0">
            <FilledButton
              isIcon={true}
              icon={ArrowLeft}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText=""
              height="h-10"
              width="w-10"
              onClick={() => navigate("/admin/finance")}
            />
            <h1 className="text-2xl font-bold text-gray-900">
              {translations["Expense Management"]}
            </h1>
            {selectedExpenses.length > 0 && (
              <Span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedExpenses.length} {translations.Selected}
              </Span>
            )}
          </Container>
          <Container className="flex gap-3 flex-wrap">
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
              onClick={() => getExpenses()}
            />
            <FilledButton
              isIcon={true}
              icon={Filter}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Filters}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => setShowFilters(true)}
            />
            <FilledButton
              isIcon={true}
              icon={FileDown}
              iconSize="w-4 h-4"
              bgColor="bg-purple-600 hover:bg-purple-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Export PDF"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleExportPDF}
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
              onClick={handleExport}
            />
            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-red-600 hover:bg-red-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Expense"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/finance/expense/new")}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={translations["Total Expenses"]}
            value={statistics?.totalExpenses || 0}
            icon={ArrowDownCircle}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            title={translations["Total Amount"]}
            value={statistics?.totalAmount || 0}
            icon={DollarSign}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            isCurrency={true}
          />
          <StatCard
            title={translations["This Month"]}
            value={statistics?.thisMonth || 0}
            icon={Calendar}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            title={translations["Average Amount"]}
            value={statistics?.averageAmount || 0}
            icon={FileText}
            bgColor="bg-orange-50"
            iconColor="text-orange-600"
            isCurrency={true}
          />
        </Container>

        {/* Search Bar */}
        <Container className="mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
            <SearchAndFilters
              isFocused={false}
              searchValue={searchTerm}
              setSearchValue={setSearchTerm}
            />
          </Container>
        </Container>

        {/* Expense Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {expenseLoading ? (
            <Container className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <Span className="text-red-500 text-lg block mt-4">
                {translations.Loading}
              </Span>
            </Container>
          ) : expenseError ? (
            <Container className="text-center py-12">
              <Span className="text-red-500 text-lg block mb-4">
                Error: {expenseError}
              </Span>
              <FilledButton
                bgColor="bg-red-600 hover:bg-red-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText="Retry"
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => getExpenses()}
              />
            </Container>
          ) : !Array.isArray(expensesData) || expensesData.length === 0 ? (
            <Container className="text-center py-12">
              <ArrowDownCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterOptions.currency
                  ? translations["No results found"]
                  : translations["No expenses found"]}
              </h3>
              {(searchTerm || filterOptions.currency) && (
                <FilledButton
                  bgColor="bg-red-600 hover:bg-red-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={`${translations["Clear All"]} ${translations.Filters}`}
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={handleClearFilters}
                />
              )}
            </Container>
          ) : (
            <>
              <Container className="overflow-x-auto">
                <Table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Description}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        {translations["Code Number"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Amount}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations.Date}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations["Expense Type"]}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expensesData.map((expense) => (
                      <tr key={expense.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedExpenses.includes(expense.Id)}
                            onChange={() => handleExpenseSelection(expense.Id)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Container>
                            <Span className="text-sm font-medium text-gray-900">
                              {expense.Description || "N/A"}
                            </Span>
                            <Span className="text-sm text-gray-500 block">
                              Created: {formatDate(expense.CreatedAt)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Span className="text-sm text-gray-900">
                            {expense.CodeNumber || "-"}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-red-600" />
                            <Span className="text-sm font-medium text-red-600">
                              {formatCurrency(expense.Amount, expense.Currency)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <Container className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {formatDate(expense.Date)}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <Span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              expense.IsRecurring
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {expense.IsRecurring ? translations.Recurring : translations["One-time"]}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-1">
                            {/* View Button */}
                            <button
                              onClick={() => handleViewExpense(expense.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              title={translations.View}
                            >
                              <AiOutlineEye className="w-3 h-3" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditExpense(expense.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                              title={translations.Edit}
                            >
                              <AiOutlineEdit className="w-3 h-3" />
                            </button>

                            {/* Clone Button */}
                            <button
                              onClick={() => handleCloneExpense(expense.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                              title={translations.Clone}
                            >
                              <AiOutlineCopy className="w-3 h-3" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteExpense(expense.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                              title={translations.Delete}
                            >
                              <AiOutlineDelete className="w-3 h-3" />
                            </button>
                          </Container>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>

              {/* Pagination */}
              {expensePagination && expensePagination.TotalPages && expensePagination.TotalPages > 1 && (
                <Container className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                  <Span className="text-sm text-gray-500">
                    {translations.Showing}{" "}
                    {(expensePagination.CurrentPage - 1) * expensePagination.PageSize + 1} -{" "}
                    {Math.min(
                      expensePagination.CurrentPage * expensePagination.PageSize,
                      expensePagination.TotalItems
                    )}{" "}
                    {translations.Of} {expensePagination.TotalItems}{" "}
                    {translations.Items}
                  </Span>
                  <Container className="flex gap-2">
                    <FilledButton
                      isIcon={true}
                      icon={ChevronsLeft}
                      iconSize="w-4 h-4"
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-md"
                      buttonText=""
                      height="h-8"
                      width="w-8"
                      disabled={!expensePagination.HasPreviousPage}
                      onClick={() => handlePageChange(1)}
                    />
                    <FilledButton
                      isIcon={true}
                      icon={ChevronLeft}
                      iconSize="w-4 h-4"
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-md"
                      buttonText=""
                      height="h-8"
                      width="w-8"
                      disabled={!expensePagination.HasPreviousPage}
                      onClick={() => handlePageChange(expensePagination.CurrentPage - 1)}
                    />
                    <Span className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center">
                      {expensePagination.CurrentPage} / {expensePagination.TotalPages}
                    </Span>
                    <FilledButton
                      isIcon={true}
                      icon={ChevronRight}
                      iconSize="w-4 h-4"
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-md"
                      buttonText=""
                      height="h-8"
                      width="w-8"
                      disabled={!expensePagination.HasNextPage}
                      onClick={() => handlePageChange(expensePagination.CurrentPage + 1)}
                    />
                    <FilledButton
                      isIcon={true}
                      icon={ChevronsRight}
                      iconSize="w-4 h-4"
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-md"
                      buttonText=""
                      height="h-8"
                      width="w-8"
                      disabled={!expensePagination.HasNextPage}
                      onClick={() => handlePageChange(expensePagination.TotalPages)}
                    />
                  </Container>
                </Container>
              )}
            </>
          )}
        </Container>
      </Container>

      {/* View Expense Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Expense Details"]}</Span>
          </Container>
        }
        width={900}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditExpense(selectedExpense?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedExpense && (
            <Container className="max-h-96 overflow-y-auto">
              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Description}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedExpense.Description || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Code Number"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedExpense.CodeNumber || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Amount}
                    </Span>
                    <Span className="text-sm text-red-600 font-medium block mt-1">
                      {formatCurrency(selectedExpense.Amount, selectedExpense.Currency)}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Date}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {formatDate(selectedExpense.Date)}
                    </Span>
                  </Container>
                </Container>

                {/* Additional Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Additional Information</h3>
                  
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Expense Type"]}
                    </Span>
                    <Span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedExpense.IsRecurring
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {selectedExpense.IsRecurring ? translations.Recurring : translations["One-time"]}
                    </Span>
                  </Container>

                  {selectedExpense.IsRecurring && (
                    <>
                      <Container>
                        <Span className="text-sm font-medium text-gray-500">
                          {translations["Recurring Frequency"]}
                        </Span>
                        <Span className="text-sm text-gray-900 block mt-1">
                          {selectedExpense.RecurringFrequency || "N/A"}
                        </Span>
                      </Container>

                      <Container>
                        <Span className="text-sm font-medium text-gray-500">
                          {translations["Recurring End Date"]}
                        </Span>
                        <Span className="text-sm text-gray-900 block mt-1">
                          {formatDate(selectedExpense.RecurringEndDate)}
                        </Span>
                      </Container>
                    </>
                  )}

                  {selectedExpense.AttachmentPath && (
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Attachment}
                      </Span>
                      <FilledButton
                        isIcon={true}
                        icon={Download}
                        iconSize="w-3 h-3"
                        bgColor="bg-blue-600 hover:bg-blue-700"
                        textColor="text-white"
                        rounded="rounded-md"
                        buttonText={translations["Download Attachment"]}
                        height="h-8"
                        px="px-3"
                        fontWeight="font-medium"
                        fontSize="text-xs"
                        isIconLeft={true}
                        onClick={() => window.open(selectedExpense.AttachmentPath, '_blank')}
                      />
                    </Container>
                  )}

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Vendor ID"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedExpense.VendorId || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Category ID"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedExpense.CategoryId || "N/A"}
                    </Span>
                  </Container>
                </Container>
              </Container>

              <Container className="mt-6 pt-4 border-t border-gray-200">
                <Container className="text-xs text-gray-500 space-y-1">
                  <Container>
                    Created: {formatDate(selectedExpense.CreatedAt)}
                  </Container>
                  {selectedExpense.UpdatedAt && (
                    <Container>
                      Updated: {formatDate(selectedExpense.UpdatedAt)}
                    </Container>
                  )}
                </Container>
              </Container>
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
            <Span>{translations["Delete Expense"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteExpense}
        cancelAction={() => setShowDeleteModal(false)}
        okButtonDisabled={isDeleting}
        body={
          <Container className="text-center py-4">
            <Container className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </Container>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {translations["Are you sure?"]}
            </h3>
            <Span className="text-gray-500 mb-4 block">
              {translations["This action cannot be undone"]}. This will
              permanently delete the expense{" "}
              <strong>"{expenseToDelete?.Description}"</strong>{" "}
              and all associated data.
            </Span>
          </Container>
        }
      />

      {/* Filters Sidebar/Offcanvas */}
      {showFilters && (
        <Container className="fixed inset-0 z-50 overflow-hidden">
          <Container
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowFilters(false)}
          />
          <Container className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <Container className="p-6">
              <Container className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {translations.Filters}
                </h3>
                <FilledButton
                  isIcon={true}
                  icon={X}
                  iconSize="w-4 h-4"
                  bgColor="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  rounded="rounded-md"
                  buttonText=""
                  height="h-8"
                  width="w-8"
                  onClick={() => setShowFilters(false)}
                />
              </Container>

              <Container className="space-y-4">
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Currency}
                  </label>
                  <select
                    value={filterOptions.currency}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        currency: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Currencies</option>
                    <option value="PKR">PKR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Expense Type"]}
                  </label>
                  <select
                    value={filterOptions.isRecurring || ""}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        isRecurring: e.target.value === "" ? null : e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Types</option>
                    <option value="false">{translations["One-time"]}</option>
                    <option value="true">{translations.Recurring}</option>
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filterOptions.dateFrom}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateFrom: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filterOptions.dateTo}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateTo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filterOptions.sortBy}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        sortBy: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="Id">Date Created</option>
                    <option value="Amount">Amount</option>
                    <option value="Date">Date</option>
                    <option value="Description">Description</option>
                    <option value="CodeNumber">Code Number</option>
                  </select>
                </Container>

                <Container>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterOptions.sortAscending}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          sortAscending: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <Span className="ml-2 text-sm text-gray-700">
                      Sort Ascending
                    </Span>
                  </label>
                </Container>
              </Container>

              <Container className="flex gap-3 mt-6">
                <FilledButton
                  bgColor="bg-red-600 hover:bg-red-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={translations["Apply Filters"]}
                  height="h-10"
                  width="flex-1"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={handleApplyFilters}
                />
                <FilledButton
                  bgColor="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  rounded="rounded-lg"
                  buttonText={translations["Clear All"]}
                  height="h-10"
                  width="flex-1"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={handleClearFilters}
                />
              </Container>
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default ExpenseList;