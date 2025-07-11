import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  Building,
  User,
  CreditCard,
  Activity,
  BarChart3,
  X,
  FileText,
} from "lucide-react";
import { useFinance } from "../../Contexts/FinanceContext/FinanceContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";
import Table from "../../components/elements/table/Table";

const BalanceSheet = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const {
    incomes,
    expenses,
    companyBalance,
    incomeLoading,
    expenseLoading,
    balanceLoading,
    getIncomes,
    getExpenses,
    getCompanyBalance,
  } = useFinance();

  const translations = {
    "Balance Sheet": language === "ar" ? "الميزانية العمومية" : "Balance Sheet",
    "Account Information": language === "ar" ? "معلومات الحساب" : "Account Information",
    "Current Balance": language === "ar" ? "الرصيد الحالي" : "Current Balance",
    "System Transactions": language === "ar" ? "معاملات النظام" : "System Transactions",
    "Transaction History": language === "ar" ? "تاريخ المعاملات" : "Transaction History",
    "Search & Filters": language === "ar" ? "البحث والمرشحات" : "Search & Filters",
    "Main Treasury": language === "ar" ? "الخزينة الرئيسية" : "Main Treasury",
    "Primary": language === "ar" ? "أساسي" : "Primary",
    "Active": language === "ar" ? "نشط" : "Active",
    "Deposit": language === "ar" ? "إيداع" : "Deposit",
    "Withdraw": language === "ar" ? "سحب" : "Withdraw",
    "Balance After": language === "ar" ? "الرصيد بعد" : "Balance After",
    "Transaction": language === "ar" ? "المعاملة" : "Transaction",
    "Amount": language === "ar" ? "المبلغ" : "Amount",
    "Date": language === "ar" ? "التاريخ" : "Date",
    "Type": language === "ar" ? "النوع" : "Type",
    "Description": language === "ar" ? "الوصف" : "Description",
    "Reference": language === "ar" ? "المرجع" : "Reference",
    "Income": language === "ar" ? "دخل" : "Income",
    "Expense": language === "ar" ? "مصروف" : "Expense",
    "Transfer": language === "ar" ? "تحويل" : "Transfer",
    "From Date": language === "ar" ? "من تاريخ" : "From Date",
    "To Date": language === "ar" ? "إلى تاريخ" : "To Date",
    "Filter by Status": language === "ar" ? "تصفية حسب الحالة" : "Filter by Status",
    "All Transactions": language === "ar" ? "جميع المعاملات" : "All Transactions",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    "Apply Filters": language === "ar" ? "تطبيق المرشحات" : "Apply Filters",
    "Export": language === "ar" ? "تصدير" : "Export",
    "Refresh": language === "ar" ? "تحديث" : "Refresh",
    "Back": language === "ar" ? "رجوع" : "Back",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No transactions found": language === "ar" ? "لم يتم العثور على معاملات" : "No transactions found",
    "Balance Before": language === "ar" ? "الرصيد قبل" : "Balance Before",
    "Total Deposits": language === "ar" ? "إجمالي الإيداعات" : "Total Deposits",
    "Total Withdrawals": language === "ar" ? "إجمالي السحوبات" : "Total Withdrawals",
    "Net Change": language === "ar" ? "صافي التغيير" : "Net Change",
    "Account Details": language === "ar" ? "تفاصيل الحساب" : "Account Details",
    "Account Type": language === "ar" ? "نوع الحساب" : "Account Type",
    "Treasury": language === "ar" ? "خزينة" : "Treasury",
    "Permissions": language === "ar" ? "الصلاحيات" : "Permissions",
    "Everyone": language === "ar" ? "الجميع" : "Everyone",
    "PKR": "PKR",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Advanced": language === "ar" ? "متقدم" : "Advanced",
    "Hide": language === "ar" ? "إخفاء" : "Hide",
    "Search": language === "ar" ? "بحث" : "Search",
  };

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    fromDate: "",
    toDate: "",
    type: "",
    status: "",
  });
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Get company info
  const getCompanyInfo = () => {
    try {
      const companyData = localStorage.getItem('company') || localStorage.getItem('companyData');
      if (companyData) {
        return JSON.parse(companyData);
      }
      return {
        name: "Your Company Name",
        ledgerAccount: "Main Treasury #120101"
      };
    } catch (error) {
      return {
        name: "Your Company Name",
        ledgerAccount: "Main Treasury #120101"
      };
    }
  };

  const companyInfo = getCompanyInfo();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          await Promise.all([
            getIncomes({ pageSize: 1000 }),
            getExpenses({ pageSize: 1000 }),
            getCompanyBalance(),
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [token]);

  // Process transactions when data changes
  useEffect(() => {
    const incomesData = incomes?.Data?.$values || [];
    const expensesData = expenses?.Data?.$values || [];

    // Combine and sort transactions
    const transactions = [
      ...incomesData.map(income => ({
        ...income,
        type: 'Income',
        isDeposit: true,
        transactionType: 'Deposit',
        icon: 'income'
      })),
      ...expensesData.map(expense => ({
        ...expense,
        type: 'Expense',
        isDeposit: false,
        transactionType: 'Withdraw',
        icon: 'expense'
      }))
    ].sort((a, b) => new Date(b.Date || b.CreatedAt) - new Date(a.Date || a.CreatedAt));

    // Calculate running balance
    let runningBalance = 0;
    const transactionsWithBalance = transactions.map((transaction, index) => {
      const amount = parseFloat(transaction.Amount) || 0;
      
      if (transaction.isDeposit) {
        runningBalance += amount;
      } else {
        runningBalance -= amount;
      }

      return {
        ...transaction,
        balanceAfter: runningBalance,
        balanceBefore: transaction.isDeposit ? runningBalance - amount : runningBalance + amount,
        sequenceNumber: transactions.length - index
      };
    }).reverse(); // Reverse to show oldest first with correct balance calculation

    setAllTransactions(transactionsWithBalance);
    setFilteredTransactions(transactionsWithBalance);
  }, [incomes, expenses]);

  // Handle search
  useEffect(() => {
    let filtered = allTransactions;

    if (searchTerm.trim()) {
      filtered = filtered.filter(transaction =>
        transaction.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.CodeNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filterOptions.fromDate) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.Date || transaction.CreatedAt) >= new Date(filterOptions.fromDate)
      );
    }

    if (filterOptions.toDate) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.Date || transaction.CreatedAt) <= new Date(filterOptions.toDate)
      );
    }

    if (filterOptions.type) {
      filtered = filtered.filter(transaction => transaction.type === filterOptions.type);
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterOptions, allTransactions]);

  // Calculate statistics
  const calculateStats = () => {
    const totalDeposits = filteredTransactions
      .filter(t => t.isDeposit)
      .reduce((sum, t) => sum + (parseFloat(t.Amount) || 0), 0);
    
    const totalWithdrawals = filteredTransactions
      .filter(t => !t.isDeposit)
      .reduce((sum, t) => sum + (parseFloat(t.Amount) || 0), 0);

    const netChange = totalDeposits - totalWithdrawals;

    return {
      totalDeposits,
      totalWithdrawals,
      netChange,
      currentBalance: companyBalance?.NewBalance || 0,
      transactionCount: filteredTransactions.length
    };
  };

  const stats = calculateStats();

  // Format currency
  const formatCurrency = (amount, currency = "PKR") => {
    const numAmount = parseFloat(amount) || 0;
    return `${currency} ${numAmount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Handle filter operations
  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilterOptions({
      fromDate: "",
      toDate: "",
      type: "",
      status: "",
    });
    setSearchTerm("");
    setShowFilters(false);
  };

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ['Date', 'Type', 'Description', 'Reference', 'Amount', 'Balance After'],
      ...filteredTransactions.map(transaction => [
        formatDate(transaction.Date || transaction.CreatedAt),
        transaction.type,
        transaction.Description || 'N/A',
        transaction.CodeNumber || '-',
        `${transaction.isDeposit ? '+' : '-'}${transaction.Amount}`,
        transaction.balanceAfter
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `balance-sheet-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Statistics Card Component
  const StatCard = ({ title, value, icon: Icon, bgColor, iconColor, textColor }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <Container className="flex items-center justify-between">
        <Container>
          <Span className="text-gray-500 text-sm font-medium">{title}</Span>
          <Span className={`text-2xl font-bold ${textColor} mt-1 block`}>
            {value}
          </Span>
        </Container>
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
      </Container>
    </Container>
  );

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
      <Container className="bg-blue-600 text-white px-6 py-4">
        <Container className="flex items-center justify-between">
          <Container className="flex items-center gap-4">
            <FilledButton
              isIcon={true}
              icon={ArrowLeft}
              iconSize="w-4 h-4"
              bgColor="bg-blue-700 hover:bg-blue-800"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText=""
              height="h-10"
              width="w-10"
              onClick={() => navigate("/admin/finance")}
            />
            <Container className="flex items-center gap-3">
              <Building className="w-6 h-6" />
              <Container>
                <h1 className="text-xl font-bold">{translations["Main Treasury"]}</h1>
                <Span className="text-blue-100 text-sm">
                  Ledger Account: {companyInfo.ledgerAccount}
                </Span>
              </Container>
            </Container>
            <Container className="flex items-center gap-2">
              <Span className="bg-blue-500 text-blue-100 px-2 py-1 rounded text-xs">
                {translations.Primary}
              </Span>
              <Container className="flex items-center gap-1">
                <Container className="w-2 h-2 bg-green-400 rounded-full"></Container>
                <Span className="text-sm">{translations.Active}</Span>
              </Container>
            </Container>
          </Container>
          <Container className="text-right">
            <Span className="text-blue-100 text-sm">{translations["Current Balance"]}</Span>
            <Container className="text-2xl font-bold">
              {formatCurrency(stats.currentBalance)}
            </Container>
          </Container>
        </Container>
      </Container>

      <Container className="px-6 py-6">
        {/* Action Buttons */}
        <Container className="flex gap-3 mb-6">
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
            onClick={() => {
              getIncomes({ pageSize: 1000 });
              getExpenses({ pageSize: 1000 });
              getCompanyBalance();
            }}
          />
          <FilledButton
            isIcon={true}
            icon={Filter}
            iconSize="w-4 h-4"
            bgColor="bg-gray-100 hover:bg-gray-200"
            textColor="text-gray-700"
            rounded="rounded-lg"
            buttonText={translations["Search & Filters"]}
            height="h-10"
            px="px-4"
            fontWeight="font-medium"
            fontSize="text-sm"
            isIconLeft={true}
            onClick={() => setShowFilters(!showFilters)}
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
            onClick={handleExport}
          />
        </Container>

        {/* Account Information */}
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Account Details */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {translations["Account Information"]}
            </h3>
            <Container className="space-y-4">
              <Container className="grid grid-cols-2 gap-4">
                <Container>
                  <Span className="text-sm text-gray-500">Name</Span>
                  <Span className="text-sm font-medium text-gray-900 block">
                    {translations["Main Treasury"]}
                  </Span>
                </Container>
                <Container>
                  <Span className="text-sm text-gray-500">{translations.Amount}</Span>
                  <Span className="text-lg font-bold text-green-600 block">
                    {formatCurrency(stats.currentBalance)}
                  </Span>
                </Container>
              </Container>
              <Container className="grid grid-cols-2 gap-4">
                <Container>
                  <Span className="text-sm text-gray-500">{translations.Status}</Span>
                  <Container className="flex items-center gap-2 mt-1">
                    <Container className="w-2 h-2 bg-green-500 rounded-full"></Container>
                    <Span className="text-sm text-green-600 font-medium">{translations.Active}</Span>
                    <Span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {translations.Primary}
                    </Span>
                  </Container>
                </Container>
                <Container>
                  <Span className="text-sm text-gray-500">{translations.Type}</Span>
                  <Container className="flex items-center gap-2 mt-1">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <Span className="text-sm font-medium">{translations.Treasury}</Span>
                  </Container>
                </Container>
              </Container>
            </Container>
          </Container>

          {/* Permissions */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {translations.Permissions}
            </h3>
            <Container className="space-y-4">
              <Container className="grid grid-cols-2 gap-4">
                <Container>
                  <Span className="text-sm text-gray-500">{translations.Deposit}</Span>
                  <Span className="text-sm font-medium text-gray-900 block">
                    {translations.Everyone}
                  </Span>
                </Container>
                <Container>
                  <Span className="text-sm text-gray-500">{translations.Withdraw}</Span>
                  <Span className="text-sm font-medium text-gray-900 block">
                    {translations.Everyone}
                  </Span>
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={translations["Current Balance"]}
            value={formatCurrency(stats.currentBalance)}
            icon={Wallet}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            textColor="text-blue-600"
          />
          <StatCard
            title={translations["Total Deposits"]}
            value={formatCurrency(stats.totalDeposits)}
            icon={ArrowUpCircle}
            bgColor="bg-green-50"
            iconColor="text-green-600"
            textColor="text-green-600"
          />
          <StatCard
            title={translations["Total Withdrawals"]}
            value={formatCurrency(stats.totalWithdrawals)}
            icon={ArrowDownCircle}
            bgColor="bg-red-50"
            iconColor="text-red-600"
            textColor="text-red-600"
          />
          <StatCard
            title={translations["Net Change"]}
            value={formatCurrency(Math.abs(stats.netChange))}
            icon={TrendingUp}
            bgColor={stats.netChange >= 0 ? "bg-emerald-50" : "bg-orange-50"}
            iconColor={stats.netChange >= 0 ? "text-emerald-600" : "text-orange-600"}
            textColor={stats.netChange >= 0 ? "text-emerald-600" : "text-orange-600"}
          />
        </Container>

        {/* Search and Filters */}
        {showFilters && (
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <Container className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{translations["Search & Filters"]}</h3>
              <Container className="flex items-center gap-2">
                <Span className="text-sm text-blue-600 cursor-pointer">
                  {translations.Advanced}
                </Span>
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
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Container>
                <input
                  type="text"
                  placeholder={translations.Search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
              <Container>
                <input
                  type="date"
                  placeholder={translations["From Date"]}
                  value={filterOptions.fromDate}
                  onChange={(e) => setFilterOptions(prev => ({ ...prev, fromDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
              <Container>
                <input
                  type="date"
                  placeholder={translations["To Date"]}
                  value={filterOptions.toDate}
                  onChange={(e) => setFilterOptions(prev => ({ ...prev, toDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
              <Container>
                <select
                  value={filterOptions.type}
                  onChange={(e) => setFilterOptions(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{translations["Filter by Status"]}</option>
                  <option value="Income">{translations.Income}</option>
                  <option value="Expense">{translations.Expense}</option>
                </select>
              </Container>
            </Container>

            <Container className="flex gap-3">
              <FilledButton
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={translations["Apply Filters"]}
                height="h-10"
                px="px-4"
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
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={handleClearFilters}
              />
            </Container>
          </Container>
        )}

        {/* Transaction History */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Container className="p-6 border-b border-gray-200">
            <Container className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {translations["System Transactions"]}
              </h3>
              <Span className="text-sm text-gray-500">
                Sort by Date ↓
              </Span>
            </Container>
          </Container>

          {incomeLoading || expenseLoading || balanceLoading ? (
            <Container className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <Span className="text-blue-500 text-lg block mt-4">
                {translations.Loading}
              </Span>
            </Container>
          ) : filteredTransactions.length === 0 ? (
            <Container className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {translations["No transactions found"]}
              </h3>
            </Container>
          ) : (
            <Container className="overflow-x-auto">
              <Table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.Transaction}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.Deposit}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.Withdraw}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations["Balance After"]}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sort ↓
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={transaction.Id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Container className="flex items-start gap-3">
                          <Container className="flex-shrink-0">
                            <Container className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                              transaction.isDeposit ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {transaction.isDeposit ? '+' : '-'}
                            </Container>
                          </Container>
                          <Container className="min-w-0 flex-1">
                            <Container className="text-sm font-medium text-gray-900 mb-1">
                              {formatDate(transaction.Date || transaction.CreatedAt)} (#{transaction.CodeNumber || `#${transaction.Id}`})
                            </Container>
                            <Container className="text-sm text-gray-600">
                              {transaction.type === 'Income' ? 'Income' : 'Expense'} #{transaction.CodeNumber || transaction.Id} {transaction.Description || 'No description'}
                            </Container>
                            <Container className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              transaction.isDeposit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              Ch Hassan
                            </Container>
                          </Container>
                        </Container>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {transaction.isDeposit ? (
                          <Span className="text-green-600 font-semibold">
                            {transaction.Amount}
                          </Span>
                        ) : (
                          <Span className="text-gray-300">-</Span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {!transaction.isDeposit ? (
                          <Span className="text-red-600 font-semibold">
                            {transaction.Amount}
                          </Span>
                        ) : (
                          <Span className="text-gray-300">-</Span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Span className="text-gray-900 font-semibold">
                          {formatCurrency(transaction.balanceAfter).replace('PKR ', '')}
                        </Span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-gray-400 hover:text-gray-600">
                          <span className="text-lg">⋯</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          )}

          {/* Balance Before Footer */}
          <Container className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Container className="flex justify-between items-center">
              <Span className="text-sm font-medium text-gray-700">{translations["Balance Before"]}</Span>
              <Span className="text-sm font-semibold text-gray-900">0</Span>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default BalanceSheet;