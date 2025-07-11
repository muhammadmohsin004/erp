import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Download,
  Plus,
  Eye,
  Filter,
  RefreshCw,
  CreditCard,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  FileText,
  Settings,
  AlertCircle,
} from "lucide-react";
import { useFinance } from "../../Contexts/FinanceContext/FinanceContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  // Finance context
  const {
    incomes,
    expenses,
    companyBalance,
    incomeLoading,
    expenseLoading,
    balanceLoading,
    incomeError,
    expenseError,
    balanceError,
    getIncomes,
    getExpenses,
    getCompanyBalance,
  } = useFinance();

  // Local state
  const [timeRange, setTimeRange] = useState("thisMonth");
  const [selectedCurrency, setSelectedCurrency] = useState("PKR");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Translations
  const translations = useMemo(() => ({
    "Finance Dashboard": language === "ar" ? "لوحة التحكم المالية" : "Finance Dashboard",
    "Current Balance": language === "ar" ? "الرصيد الحالي" : "Current Balance",
    "Total Balance": language === "ar" ? "الرصيد الإجمالي" : "Total Balance",
    "Total Income": language === "ar" ? "إجمالي الدخل" : "Total Income",
    "Total Expenses": language === "ar" ? "إجمالي المصروفات" : "Total Expenses",
    "Net Profit": language === "ar" ? "صافي الربح" : "Net Profit",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "This Week": language === "ar" ? "هذا الأسبوع" : "This Week",
    "Today": language === "ar" ? "اليوم" : "Today",
    "Custom Range": language === "ar" ? "نطاق مخصص" : "Custom Range",
    "Add Income": language === "ar" ? "إضافة دخل" : "Add Income",
    "Add Expense": language === "ar" ? "إضافة مصروف" : "Add Expense",
    "View Reports": language === "ar" ? "عرض التقارير" : "View Reports",
    "Export Data": language === "ar" ? "تصدير البيانات" : "Export Data",
    "Recent Transactions": language === "ar" ? "المعاملات الأخيرة" : "Recent Transactions",
    "Income vs Expenses": language === "ar" ? "الدخل مقابل المصروفات" : "Income vs Expenses",
    "Cash Flow": language === "ar" ? "التدفق النقدي" : "Cash Flow",
    "Monthly Trends": language === "ar" ? "الاتجاهات الشهرية" : "Monthly Trends",
    "Financial Overview": language === "ar" ? "نظرة مالية عامة" : "Financial Overview",
    "Quick Actions": language === "ar" ? "إجراءات سريعة" : "Quick Actions",
    "Manage Incomes": language === "ar" ? "إدارة الدخل" : "Manage Incomes",
    "Manage Expenses": language === "ar" ? "إدارة المصروفات" : "Manage Expenses",
    "Financial Reports": language === "ar" ? "التقارير المالية" : "Financial Reports",
    "Settings": language === "ar" ? "الإعدادات" : "Settings",
    "Refresh": language === "ar" ? "تحديث" : "Refresh",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "PKR": "PKR",
    "USD": "USD",
    "EUR": "EUR",
    "Income": language === "ar" ? "دخل" : "Income",
    "Expense": language === "ar" ? "مصروف" : "Expense",
    "Amount": language === "ar" ? "المبلغ" : "Amount",
    "Date": language === "ar" ? "التاريخ" : "Date",
    "Description": language === "ar" ? "الوصف" : "Description",
    "No transactions found": language === "ar" ? "لم يتم العثور على معاملات" : "No transactions found",
    "View All": language === "ar" ? "عرض الكل" : "View All",
    "Balance Sheet": language === "ar" ? "الميزانية العمومية" : "Balance Sheet",
    "Track and control your expenses": language === "ar" ? "تتبع وتحكم في مصروفاتك" : "Track and control your expenses",
    "View and manage all income sources": language === "ar" ? "عرض وإدارة جميع مصادر الدخل" : "View and manage all income sources",
    "Generate detailed financial reports": language === "ar" ? "إنشاء تقارير مالية مفصلة" : "Generate detailed financial reports",
    "View account balance and transactions": language === "ar" ? "عرض رصيد الحساب والمعاملات" : "View account balance and transactions",
    "Export financial data to PDF/Excel": language === "ar" ? "تصدير البيانات المالية إلى PDF/Excel" : "Export financial data to PDF/Excel",
    "Track your income, expenses, and financial performance": language === "ar" ? "تتبع دخلك ومصروفاتك وأدائك المالي" : "Track your income, expenses, and financial performance",
    "Chart coming soon": language === "ar" ? "الرسم البياني قريباً..." : "Chart coming soon...",
    "No description": language === "ar" ? "لا يوجد وصف" : "No description",
    "Error loading data": language === "ar" ? "خطأ في تحميل البيانات" : "Error loading data",
    "Retry": language === "ar" ? "إعادة المحاولة" : "Retry",
  }), [language]);

  // Utility functions
  const formatCurrency = useCallback((amount, currency = selectedCurrency) => {
    const numAmount = parseFloat(amount) || 0;
    return `${currency} ${numAmount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }, [selectedCurrency]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }, []);

  // Process data from API responses
  const incomesData = useMemo(() => incomes?.Data?.$values || [], [incomes]);
  const expensesData = useMemo(() => expenses?.Data?.$values || [], [expenses]);

  // Calculate statistics with proper error handling
  const statistics = useMemo(() => {
    try {
      const totalIncome = incomesData.reduce((sum, income) => {
        const amount = parseFloat(income.Amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      const totalExpenses = expensesData.reduce((sum, expense) => {
        const amount = parseFloat(expense.Amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      const netProfit = totalIncome - totalExpenses;
      const transactionCount = incomesData.length + expensesData.length;
      const currentBalance = parseFloat(companyBalance?.NewBalance) || 0;

      // Calculate trends (simplified calculation)
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
      const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

      return {
        totalIncome,
        totalExpenses,
        netProfit,
        transactionCount,
        currentBalance,
        profitMargin,
        expenseRatio,
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        transactionCount: 0,
        currentBalance: 0,
        profitMargin: 0,
        expenseRatio: 0,
      };
    }
  }, [incomesData, expensesData, companyBalance]);

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    try {
      const allTransactions = [
        ...incomesData.map(income => ({ 
          ...income, 
          type: 'Income', 
          isIncome: true,
          displayDate: income.Date || income.CreatedAt
        })),
        ...expensesData.map(expense => ({ 
          ...expense, 
          type: 'Expense', 
          isIncome: false,
          displayDate: expense.Date || expense.CreatedAt
        }))
      ];

      return allTransactions
        .sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate))
        .slice(0, 5);
    } catch (error) {
      console.error('Error processing transactions:', error);
      return [];
    }
  }, [incomesData, expensesData]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!token) return;

    setRefreshing(true);
    setError(null);
    
    try {
      await Promise.all([
        getIncomes({ pageSize: 50 }),
        getExpenses({ pageSize: 50 }),
        getCompanyBalance(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, [token, getIncomes, getExpenses, getCompanyBalance]);

  // Effects
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchData();
  }, [token, fetchData, navigate]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Navigation handlers
  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  // Components
  const StatCard = ({ title, value, icon: Icon, bgColor, iconColor, textColor, trend, trendValue }) => (
    <Container className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <Container className="flex items-center justify-between mb-4">
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
        {trend && trendValue && (
          <Container className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <Span className="text-sm font-medium">{trendValue}</Span>
          </Container>
        )}
      </Container>
      <Container>
        <Span className="text-gray-500 text-sm font-medium">{title}</Span>
        <Span className={`text-2xl font-bold ${textColor} mt-1 block`}>
          {value}
        </Span>
      </Container>
    </Container>
  );

  const QuickActionCard = ({ title, description, icon: Icon, bgColor, textColor, onClick }) => (
    <Container 
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <Container className="flex items-center gap-4">
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </Container>
        <Container>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <Span className="text-sm text-gray-500">{description}</Span>
        </Container>
      </Container>
    </Container>
  );

  const ErrorDisplay = ({ message, onRetry }) => (
    <Container className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <Container className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <Container>
          <Span className="text-red-800 font-medium">{message}</Span>
          {onRetry && (
            <FilledButton
              bgColor="bg-red-600 hover:bg-red-700"
              textColor="text-white"
              rounded="rounded-md"
              buttonText={translations.Retry}
              height="h-8"
              px="px-3"
              fontSize="text-sm"
              onClick={onRetry}
              className="mt-2"
            />
          )}
        </Container>
      </Container>
    </Container>
  );

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <Span className="text-blue-500 text-lg ml-3">{translations.Loading}</Span>
      </Container>
    );
  }

  const isLoading = incomeLoading || expenseLoading || balanceLoading;
  const hasError = error || incomeError || expenseError || balanceError;

  return (
    <Container className="min-h-screen bg-gray-50">
      <Container className="px-6 py-6">
        {/* Header */}
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <Container>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {translations["Finance Dashboard"]}
            </h1>
            <Span className="text-gray-600">
              {translations["Track your income, expenses, and financial performance"]}
            </Span>
          </Container>
          
          <Container className="flex items-center gap-3 mt-4 lg:mt-0 flex-wrap">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="today">{translations.Today}</option>
              <option value="thisWeek">{translations["This Week"]}</option>
              <option value="thisMonth">{translations["This Month"]}</option>
              <option value="custom">{translations["Custom Range"]}</option>
            </select>

            {/* Currency Selector */}
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="PKR">{translations.PKR}</option>
              <option value="USD">{translations.USD}</option>
              <option value="EUR">{translations.EUR}</option>
            </select>

            {/* Refresh Button */}
            <FilledButton
              isIcon={true}
              icon={RefreshCw}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText=""
              height="h-10"
              width="w-10"
              onClick={handleRefresh}
              disabled={refreshing}
              className={refreshing ? 'animate-spin' : ''}
            />

            {/* Add Income Button */}
            <FilledButton
              isIcon={true}
              icon={ArrowUpCircle}
              iconSize="w-4 h-4"
              bgColor="bg-emerald-600 hover:bg-emerald-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Income"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => handleNavigate("/admin/finance/income/new")}
            />

            {/* Add Expense Button */}
            <FilledButton
              isIcon={true}
              icon={ArrowDownCircle}
              iconSize="w-4 h-4"
              bgColor="bg-rose-600 hover:bg-rose-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Expense"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => handleNavigate("/admin/finance/expense/new")}
            />

            {/* Balance Sheet Button */}
            <FilledButton
              isIcon={true}
              icon={Wallet}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Balance Sheet"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => handleNavigate("/admin/finance/balance")}
            />
          </Container>
        </Container>

        {/* Error Display */}
        {hasError && (
          <ErrorDisplay 
            message={error || incomeError || expenseError || balanceError || translations["Error loading data"]}
            onRetry={handleRefresh}
          />
        )}

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={translations["Current Balance"]}
            value={formatCurrency(statistics.currentBalance)}
            icon={Wallet}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            textColor="text-blue-600"
            trend="up"
            trendValue="+2.5%"
          />
          <StatCard
            title={translations["Total Income"]}
            value={formatCurrency(statistics.totalIncome)}
            icon={TrendingUp}
            bgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            textColor="text-emerald-600"
            trend="up"
            trendValue="+12.3%"
          />
          <StatCard
            title={translations["Total Expenses"]}
            value={formatCurrency(statistics.totalExpenses)}
            icon={TrendingDown}
            bgColor="bg-rose-50"
            iconColor="text-rose-600"
            textColor="text-rose-600"
            trend="down"
            trendValue="-5.2%"
          />
          <StatCard
            title={translations["Net Profit"]}
            value={formatCurrency(statistics.netProfit)}
            icon={DollarSign}
            bgColor={statistics.netProfit >= 0 ? "bg-emerald-50" : "bg-amber-50"}
            iconColor={statistics.netProfit >= 0 ? "text-emerald-600" : "text-amber-600"}
            textColor={statistics.netProfit >= 0 ? "text-emerald-600" : "text-amber-600"}
            trend={statistics.netProfit >= 0 ? "up" : "down"}
            trendValue={statistics.netProfit >= 0 ? `+${statistics.profitMargin.toFixed(1)}%` : `${statistics.profitMargin.toFixed(1)}%`}
          />
        </Container>

        {/* Main Content Grid */}
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Container className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {translations["Quick Actions"]}
            </h2>
            <Container className="space-y-4">
              <QuickActionCard
                title={translations["Manage Incomes"]}
                description={translations["View and manage all income sources"]}
                icon={ArrowUpCircle}
                bgColor="bg-emerald-50"
                textColor="text-emerald-600"
                onClick={() => handleNavigate("/admin/finance/incomes")}
              />
              <QuickActionCard
                title={translations["Manage Expenses"]}
                description={translations["Track and control your expenses"]}
                icon={ArrowDownCircle}
                bgColor="bg-rose-50"
                textColor="text-rose-600"
                onClick={() => handleNavigate("/admin/finance/expenses")}
              />
              <QuickActionCard
                title={translations["Financial Reports"]}
                description={translations["Generate detailed financial reports"]}
                icon={BarChart3}
                bgColor="bg-violet-50"
                textColor="text-violet-600"
                onClick={() => handleNavigate("/admin/finance/reports")}
              />
              <QuickActionCard
                title={translations["Balance Sheet"]}
                description={translations["View account balance and transactions"]}
                icon={Wallet}
                bgColor="bg-blue-50"
                textColor="text-blue-600"
                onClick={() => handleNavigate("/admin/finance/balance")}
              />
              <QuickActionCard
                title={translations["Export Data"]}
                description={translations["Export financial data to PDF/Excel"]}
                icon={Download}
                bgColor="bg-slate-50"
                textColor="text-slate-600"
                onClick={() => handleNavigate("/admin/finance/reports")}
              />
            </Container>
          </Container>

          {/* Recent Transactions */}
          <Container className="lg:col-span-2">
            <Container className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {translations["Recent Transactions"]}
              </h2>
              <FilledButton
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText={translations["View All"]}
                height="h-8"
                px="px-3"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => handleNavigate("/admin/finance/transactions")}
              />
            </Container>

            <Container className="bg-white rounded-xl shadow-sm border border-gray-100">
              {isLoading ? (
                <Container className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <Span className="text-gray-500 text-sm block mt-2">
                    {translations.Loading}
                  </Span>
                </Container>
              ) : recentTransactions.length === 0 ? (
                <Container className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Span className="text-gray-500">
                    {translations["No transactions found"]}
                  </Span>
                </Container>
              ) : (
                <Container className="divide-y divide-gray-100">
                  {recentTransactions.map((transaction, index) => (
                    <Container key={`${transaction.Id}-${index}`} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <Container className="flex items-center justify-between">
                        <Container className="flex items-center gap-3">
                          <Container className={`p-2 rounded-lg ${
                            transaction.isIncome 
                              ? 'bg-green-50' 
                              : 'bg-red-50'
                          }`}>
                            {transaction.isIncome ? (
                              <ArrowUpCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowDownCircle className="w-5 h-5 text-red-600" />
                            )}
                          </Container>
                          <Container>
                            <Span className="font-medium text-gray-900">
                              {transaction.Description || translations["No description"]}
                            </Span>
                            <Span className="text-sm text-gray-500 block">
                              {transaction.CodeNumber && `${transaction.CodeNumber} • `}
                              {formatDate(transaction.displayDate)}
                            </Span>
                          </Container>
                        </Container>
                        <Container className="text-right">
                          <Span className={`font-semibold ${
                            transaction.isIncome ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.isIncome ? '+' : '-'}{formatCurrency(transaction.Amount, transaction.Currency)}
                          </Span>
                          <Span className="text-sm text-gray-500 block">
                            {transaction.isIncome ? translations.Income : translations.Expense}
                          </Span>
                        </Container>
                      </Container>
                    </Container>
                  ))}
                </Container>
              )}
            </Container>
          </Container>
        </Container>

        {/* Charts Section */}
        <Container className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {translations["Financial Overview"]}
          </h2>
          <Container className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expenses Chart Placeholder */}
            <Container className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                {translations["Income vs Expenses"]}
              </h3>
              <Container className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <Container className="text-center">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <Span className="text-gray-500">{translations["Chart coming soon"]}</Span>
                </Container>
              </Container>
            </Container>

            {/* Monthly Trends Chart Placeholder */}
            <Container className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {translations["Monthly Trends"]}
              </h3>
              <Container className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <Container className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <Span className="text-gray-500">{translations["Chart coming soon"]}</Span>
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default FinanceDashboard;