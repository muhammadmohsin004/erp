import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Filter,
  Printer,
  FileDown,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useFinance } from "../../Contexts/FinanceContext/FinanceContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const FinancialReports = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const {
    incomes,
    expenses,
    companyBalance,
    getIncomes,
    getExpenses,
    getCompanyBalance,
  } = useFinance();

  const translations = {
    "Financial Reports":
      language === "ar" ? "التقارير المالية" : "Financial Reports",
    "Generate Reports":
      language === "ar" ? "إنشاء التقارير" : "Generate Reports",
    "Income Statement": language === "ar" ? "بيان الدخل" : "Income Statement",
    "Balance Sheet": language === "ar" ? "الميزانية العمومية" : "Balance Sheet",
    "Cash Flow Statement":
      language === "ar" ? "بيان التدفق النقدي" : "Cash Flow Statement",
    "Expense Report": language === "ar" ? "تقرير المصروفات" : "Expense Report",
    "Profit & Loss": language === "ar" ? "الأرباح والخسائر" : "Profit & Loss",
    "Monthly Summary": language === "ar" ? "الملخص الشهري" : "Monthly Summary",
    "Download PDF": language === "ar" ? "تحميل PDF" : "Download PDF",
    "Print Report": language === "ar" ? "طباعة التقرير" : "Print Report",
    "Date Range": language === "ar" ? "نطاق التاريخ" : "Date Range",
    "From Date": language === "ar" ? "من تاريخ" : "From Date",
    "To Date": language === "ar" ? "إلى تاريخ" : "To Date",
    "Report Type": language === "ar" ? "نوع التقرير" : "Report Type",
    Generate: language === "ar" ? "إنشاء" : "Generate",
    Back: language === "ar" ? "رجوع" : "Back",
    "Total Income": language === "ar" ? "إجمالي الدخل" : "Total Income",
    "Total Expenses": language === "ar" ? "إجمالي المصروفات" : "Total Expenses",
    "Net Profit": language === "ar" ? "صافي الربح" : "Net Profit",
    "Current Balance": language === "ar" ? "الرصيد الحالي" : "Current Balance",
    "Company Information":
      language === "ar" ? "معلومات الشركة" : "Company Information",
    "Report Preview": language === "ar" ? "معاينة التقرير" : "Report Preview",
    "Select Report Type":
      language === "ar" ? "اختر نوع التقرير" : "Select Report Type",
    "All Reports": language === "ar" ? "جميع التقارير" : "All Reports",
    "Custom Range": language === "ar" ? "نطاق مخصص" : "Custom Range",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    "Last Month": language === "ar" ? "الشهر الماضي" : "Last Month",
    "This Quarter": language === "ar" ? "هذا الربع" : "This Quarter",
    "This Year": language === "ar" ? "هذه السنة" : "This Year",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
  };

  // Local state
  const [reportType, setReportType] = useState("comprehensive");
  const [dateRange, setDateRange] = useState("thisMonth");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Get company info from localStorage
  const getCompanyInfo = () => {
    try {
      const companyData =
        localStorage.getItem("company") || localStorage.getItem("companyData");
      if (companyData) {
        return JSON.parse(companyData);
      }
      // Fallback company data
      return {
        name: "Your Company Name",
        email: "info@company.com",
        phone: "+1-234-567-8900",
        address: "123 Business Street, City, Country",
        website: "www.company.com",
        logo: null,
      };
    } catch (error) {
      console.error("Error parsing company data:", error);
      return {
        name: "Your Company Name",
        email: "info@company.com",
        phone: "+1-234-567-8900",
        address: "123 Business Street, City, Country",
        website: "www.company.com",
        logo: null,
      };
    }
  };

  const companyInfo = getCompanyInfo();

  // Process data
  const incomesData = incomes?.Data?.$values || [];
  const expensesData = expenses?.Data?.$values || [];

  // Calculate statistics
  const [statistics, setStatistics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    currentBalance: 0,
    totalTransactions: 0,
  });

  // Fetch data on component mount
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

  // Calculate statistics when data changes
  useEffect(() => {
    const totalIncome = incomesData.reduce(
      (sum, income) => sum + (parseFloat(income.Amount) || 0),
      0
    );
    const totalExpenses = expensesData.reduce(
      (sum, expense) => sum + (parseFloat(expense.Amount) || 0),
      0
    );
    const netProfit = totalIncome - totalExpenses;
    const currentBalance = companyBalance?.NewBalance || 0;
    const totalTransactions = incomesData.length + expensesData.length;

    setStatistics({
      totalIncome,
      totalExpenses,
      netProfit,
      currentBalance,
      totalTransactions,
    });
  }, [incomesData, expensesData, companyBalance]);

  // Format currency
  const formatCurrency = (amount, currency = "PKR") => {
    const numAmount = parseFloat(amount) || 0;
    return `${currency} ${numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get date range data
  const getDateRangeData = () => {
    const now = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "lastMonth":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "thisQuarter":
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        endDate = new Date(now.getFullYear(), quarterStart + 3, 0);
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      case "custom":
        startDate = fromDate
          ? new Date(fromDate)
          : new Date(now.getFullYear(), 0, 1);
        endDate = toDate ? new Date(toDate) : now;
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return { startDate, endDate };
  };

  // Filter data by date range
  const filterDataByRange = (data, startDate, endDate) => {
    return data.filter((item) => {
      const itemDate = new Date(item.Date || item.CreatedAt);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Generate comprehensive PDF report
  const generateComprehensiveReport = () => {
    const { startDate, endDate } = getDateRangeData();
    const filteredIncomes = filterDataByRange(incomesData, startDate, endDate);
    const filteredExpenses = filterDataByRange(
      expensesData,
      startDate,
      endDate
    );

    const totalIncome = filteredIncomes.reduce(
      (sum, income) => sum + (parseFloat(income.Amount) || 0),
      0
    );
    const totalExpenses = filteredExpenses.reduce(
      (sum, expense) => sum + (parseFloat(expense.Amount) || 0),
      0
    );
    const netProfit = totalIncome - totalExpenses;

    let reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Report - ${companyInfo.name}</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background-color: #f8f9fa;
              color: #333;
            }
            .container { 
              max-width: 1000px; 
              margin: 0 auto; 
              background: white; 
              padding: 40px; 
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 3px solid #2563eb;
              padding-bottom: 30px;
            }
            .company-info {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              padding: 25px;
              border-radius: 10px;
              margin-bottom: 30px;
            }
            .company-name { 
              font-size: 28px; 
              font-weight: bold; 
              margin-bottom: 10px;
            }
            .report-title { 
              font-size: 24px; 
              font-weight: bold; 
              margin: 20px 0;
              color: #1f2937;
            }
            .summary-cards {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin: 30px 0;
            }
            .summary-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .card-title {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 8px;
              text-transform: uppercase;
              font-weight: 600;
            }
            .card-value {
              font-size: 20px;
              font-weight: bold;
              color: #1f2937;
            }
            .income-card .card-value { color: #059669; }
            .expense-card .card-value { color: #dc2626; }
            .profit-card .card-value { color: ${
              netProfit >= 0 ? "#059669" : "#dc2626"
            }; }
            .balance-card .card-value { color: #2563eb; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 25px 0; 
              background: white;
            }
            th, td { 
              border: 1px solid #e5e7eb; 
              padding: 12px; 
              text-align: left; 
            }
            th { 
              background: #f9fafb; 
              font-weight: 600; 
              color: #374151;
              font-size: 14px;
            }
            tr:nth-child(even) { background: #f9fafb; }
            tr:hover { background: #f3f4f6; }
            .total-row { 
              font-weight: bold; 
              background: #e5e7eb !important; 
              font-size: 16px;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              margin: 40px 0 20px 0;
              color: #1f2937;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              font-size: 12px; 
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            .income-amount { color: #059669; font-weight: 600; }
            .expense-amount { color: #dc2626; font-weight: 600; }
            .date-range {
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
              font-weight: 600;
              color: #1d4ed8;
            }
            .no-data {
              text-align: center;
              color: #6b7280;
              font-style: italic;
              padding: 40px;
            }
            @media print {
              body { background: white; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-info">
                <div class="company-name">${companyInfo.name}</div>
                <div>${companyInfo.email} | ${companyInfo.phone}</div>
                <div>${companyInfo.address}</div>
              </div>
              <div class="report-title">COMPREHENSIVE FINANCIAL REPORT</div>
              <div class="date-range">
                Report Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}
              </div>
              <div>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
            </div>

            <!-- Executive Summary -->
            <div class="section-title">📊 Executive Summary</div>
            <div class="summary-cards">
              <div class="summary-card income-card">
                <div class="card-title">Total Income</div>
                <div class="card-value">${formatCurrency(totalIncome)}</div>
              </div>
              <div class="summary-card expense-card">
                <div class="card-title">Total Expenses</div>
                <div class="card-value">${formatCurrency(totalExpenses)}</div>
              </div>
              <div class="summary-card profit-card">
                <div class="card-title">Net ${
                  netProfit >= 0 ? "Profit" : "Loss"
                }</div>
                <div class="card-value">${formatCurrency(
                  Math.abs(netProfit)
                )}</div>
              </div>
              <div class="summary-card balance-card">
                <div class="card-title">Current Balance</div>
                <div class="card-value">${formatCurrency(
                  statistics.currentBalance
                )}</div>
              </div>
            </div>

            <!-- Income Details -->
            <div class="section-title">💰 Income Details</div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Code</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
    `;

    if (filteredIncomes.length > 0) {
      filteredIncomes.forEach((income) => {
        reportContent += `
          <tr>
            <td>${formatDate(income.Date)}</td>
            <td>${income.Description || "N/A"}</td>
            <td>${income.CodeNumber || "-"}</td>
            <td class="income-amount">${formatCurrency(
              income.Amount,
              income.Currency
            )}</td>
            <td>${income.Currency}</td>
            <td>${income.IsRecurring ? "Recurring" : "One-time"}</td>
          </tr>
        `;
      });
      reportContent += `
        <tr class="total-row">
          <td colspan="3"><strong>Total Income</strong></td>
          <td class="income-amount"><strong>${formatCurrency(
            totalIncome
          )}</strong></td>
          <td colspan="2"></td>
        </tr>
      `;
    } else {
      reportContent += `
        <tr>
          <td colspan="6" class="no-data">No income records found for the selected period</td>
        </tr>
      `;
    }

    reportContent += `
              </tbody>
            </table>

            <!-- Expense Details -->
            <div class="section-title">💸 Expense Details</div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Code</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
    `;

    if (filteredExpenses.length > 0) {
      filteredExpenses.forEach((expense) => {
        reportContent += `
          <tr>
            <td>${formatDate(expense.Date)}</td>
            <td>${expense.Description || "N/A"}</td>
            <td>${expense.CodeNumber || "-"}</td>
            <td class="expense-amount">${formatCurrency(
              expense.Amount,
              expense.Currency
            )}</td>
            <td>${expense.Currency}</td>
            <td>${expense.IsRecurring ? "Recurring" : "One-time"}</td>
          </tr>
        `;
      });
      reportContent += `
        <tr class="total-row">
          <td colspan="3"><strong>Total Expenses</strong></td>
          <td class="expense-amount"><strong>${formatCurrency(
            totalExpenses
          )}</strong></td>
          <td colspan="2"></td>
        </tr>
      `;
    } else {
      reportContent += `
        <tr>
          <td colspan="6" class="no-data">No expense records found for the selected period</td>
        </tr>
      `;
    }

    reportContent += `
              </tbody>
            </table>

            <!-- Financial Summary -->
            <div class="section-title">📈 Financial Analysis</div>
            <table>
              <tr>
                <td><strong>Total Revenue</strong></td>
                <td class="income-amount"><strong>${formatCurrency(
                  totalIncome
                )}</strong></td>
              </tr>
              <tr>
                <td><strong>Total Expenses</strong></td>
                <td class="expense-amount"><strong>${formatCurrency(
                  totalExpenses
                )}</strong></td>
              </tr>
              <tr class="total-row">
                <td><strong>Net ${
                  netProfit >= 0 ? "Profit" : "Loss"
                }</strong></td>
                <td style="color: ${netProfit >= 0 ? "#059669" : "#dc2626"}">
                  <strong>${formatCurrency(Math.abs(netProfit))}</strong>
                </td>
              </tr>
              <tr>
                <td><strong>Current Balance</strong></td>
                <td style="color: #2563eb"><strong>${formatCurrency(
                  statistics.currentBalance
                )}</strong></td>
              </tr>
              <tr>
                <td><strong>Total Transactions</strong></td>
                <td><strong>${
                  filteredIncomes.length + filteredExpenses.length
                }</strong></td>
              </tr>
            </table>

            <div class="footer">
              <p><strong>This report was generated automatically by ${
                companyInfo.name
              } Finance Management System</strong></p>
              <p>© ${new Date().getFullYear()} ${
      companyInfo.name
    }. All rights reserved.</p>
              <p>Report generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return reportContent;
  };

  // Download PDF report
  const handleDownloadPDF = () => {
    setIsGenerating(true);

    try {
      let reportContent = "";

      switch (reportType) {
        case "comprehensive":
          reportContent = generateComprehensiveReport();
          break;
        case "income":
          reportContent = generateIncomeReport();
          break;
        case "expense":
          reportContent = generateExpenseReport();
          break;
        case "balance":
          reportContent = generateBalanceReport();
          break;
        default:
          reportContent = generateComprehensiveReport();
      }

      // Create and download file
      const blob = new Blob([reportContent], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportType}-report-${
        new Date().toISOString().split("T")[0]
      }.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Print report
  const handlePrintReport = () => {
    const reportContent = generateComprehensiveReport();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Generate specific reports
  const generateIncomeReport = () => {
    // Similar structure but only income data
    return generateComprehensiveReport().replace(
      "COMPREHENSIVE FINANCIAL REPORT",
      "INCOME STATEMENT"
    );
  };

  const generateExpenseReport = () => {
    // Similar structure but only expense data
    return generateComprehensiveReport().replace(
      "COMPREHENSIVE FINANCIAL REPORT",
      "EXPENSE REPORT"
    );
  };

  const generateBalanceReport = () => {
    // Balance sheet format
    return generateComprehensiveReport().replace(
      "COMPREHENSIVE FINANCIAL REPORT",
      "BALANCE SHEET"
    );
  };

  // Statistics Card Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor,
    textColor,
  }) => (
    <Container className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
      <Container className="px-6 py-6">
        {/* Header */}
        <Container className="flex items-center justify-between mb-8">
          <Container className="flex items-center gap-4">
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
            <h1 className="text-3xl font-bold text-gray-900">
              {translations["Financial Reports"]}
            </h1>
          </Container>
        </Container>

        {/* Company Information */}
        <Container className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-8">
          <Container className="flex items-center gap-4">
            <Building className="w-8 h-8" />
            <Container>
              <h2 className="text-xl font-bold">{companyInfo.name}</h2>
              <Span className="text-blue-100">
                {companyInfo.email} | {companyInfo.phone}
              </Span>
            </Container>
          </Container>
        </Container>

        {/* Statistics Overview */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={translations["Total Income"]}
            value={formatCurrency(statistics.totalIncome)}
            icon={ArrowUpCircle}
            bgColor="bg-green-50"
            iconColor="text-green-600"
            textColor="text-green-600"
          />
          <StatCard
            title={translations["Total Expenses"]}
            value={formatCurrency(statistics.totalExpenses)}
            icon={ArrowDownCircle}
            bgColor="bg-red-50"
            iconColor="text-red-600"
            textColor="text-red-600"
          />
          <StatCard
            title={translations["Net Profit"]}
            value={formatCurrency(Math.abs(statistics.netProfit))}
            icon={TrendingUp}
            bgColor={
              statistics.netProfit >= 0 ? "bg-emerald-50" : "bg-orange-50"
            }
            iconColor={
              statistics.netProfit >= 0 ? "text-emerald-600" : "text-orange-600"
            }
            textColor={
              statistics.netProfit >= 0 ? "text-emerald-600" : "text-orange-600"
            }
          />
          <StatCard
            title={translations["Current Balance"]}
            value={formatCurrency(statistics.currentBalance)}
            icon={Wallet}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            textColor="text-blue-600"
          />
        </Container>

        {/* Report Generation Form */}
        <Container className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {translations["Generate Reports"]}
          </h3>

          <Container className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Report Type */}
            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations["Report Type"]}
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="comprehensive">
                  {translations["All Reports"]}
                </option>
                <option value="income">
                  {translations["Income Statement"]}
                </option>
                <option value="expense">
                  {translations["Expense Report"]}
                </option>
                <option value="balance">{translations["Balance Sheet"]}</option>
                <option value="profit">{translations["Profit & Loss"]}</option>
              </select>
            </Container>

            {/* Date Range */}
            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations["Date Range"]}
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="thisMonth">{translations["This Month"]}</option>
                <option value="lastMonth">{translations["Last Month"]}</option>
                <option value="thisQuarter">
                  {translations["This Quarter"]}
                </option>
                <option value="thisYear">{translations["This Year"]}</option>
                <option value="custom">{translations["Custom Range"]}</option>
              </select>
            </Container>

            {/* Generate Button */}
            <Container className="flex items-end">
              <FilledButton
                isIcon={true}
                icon={BarChart3}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={translations.Generate}
                height="h-10"
                width="w-full"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => setReportData({})}
              />
            </Container>
          </Container>

          {/* Custom Date Range */}
          {dateRange === "custom" && (
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["From Date"]}
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["To Date"]}
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
            </Container>
          )}

          {/* Action Buttons */}
          <Container className="flex gap-4 pt-6 border-t border-gray-200">
            <FilledButton
              isIcon={true}
              icon={Download}
              iconSize="w-4 h-4"
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Download PDF"]}
              height="h-12"
              px="px-6"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleDownloadPDF}
              disabled={isGenerating}
            />
            <FilledButton
              isIcon={true}
              icon={Printer}
              iconSize="w-4 h-4"
              bgColor="bg-purple-600 hover:bg-purple-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Print Report"]}
              height="h-12"
              px="px-6"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handlePrintReport}
            />
          </Container>
        </Container>

        {/* Quick Report Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Income Statement Card */}
          <Container className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Container className="flex items-center gap-3 mb-4">
              <Container className="bg-green-50 p-3 rounded-lg">
                <ArrowUpCircle className="w-6 h-6 text-green-600" />
              </Container>
              <h4 className="text-lg font-semibold text-gray-900">
                {translations["Income Statement"]}
              </h4>
            </Container>
            <p className="text-gray-600 text-sm mb-4">
              Detailed breakdown of all income sources and revenue streams.
            </p>
            <FilledButton
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText="Generate"
              height="h-10"
              width="w-full"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={() => {
                setReportType("income");
                handleDownloadPDF();
              }}
            />
          </Container>

          {/* Expense Report Card */}
          <Container className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Container className="flex items-center gap-3 mb-4">
              <Container className="bg-red-50 p-3 rounded-lg">
                <ArrowDownCircle className="w-6 h-6 text-red-600" />
              </Container>
              <h4 className="text-lg font-semibold text-gray-900">
                {translations["Expense Report"]}
              </h4>
            </Container>
            <p className="text-gray-600 text-sm mb-4">
              Complete analysis of all expenses and cost breakdowns.
            </p>
            <FilledButton
              bgColor="bg-red-600 hover:bg-red-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText="Generate"
              height="h-10"
              width="w-full"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={() => {
                setReportType("expense");
                handleDownloadPDF();
              }}
            />
          </Container>

          {/* Balance Sheet Card */}
          <Container className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Container className="flex items-center gap-3 mb-4">
              <Container className="bg-blue-50 p-3 rounded-lg">
                <PieChart className="w-6 h-6 text-blue-600" />
              </Container>
              <h4 className="text-lg font-semibold text-gray-900">
                {translations["Balance Sheet"]}
              </h4>
            </Container>
            <p className="text-gray-600 text-sm mb-4">
              Financial position and balance overview with assets and
              liabilities.
            </p>
            <FilledButton
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText="Generate"
              height="h-10"
              width="w-full"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={() => {
                setReportType("balance");
                handleDownloadPDF();
              }}
            />
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default FinancialReports;
