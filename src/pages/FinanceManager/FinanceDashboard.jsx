import React, { useEffect, useState } from "react";
import { useFinanceDashboard } from "../../Contexts/FinanceContext/FinanceDashboardContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Target,
  Users,
  ArrowRight,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/elements/card/Card";
import Skeleton from "../../components/elements/skeleton/Skeleton";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Badge from "../../components/elements/Badge/Badge";
import Container from "../../components/elements/container/Container";
import BodyHeader from "../../components/elements/bodyHeader/BodyHeader";
import { useNavigate } from "react-router-dom";

const FinanceDashboard = () => {
  const {
    overview,
    balance,
    cashFlow,
    profitLoss,
    expenseAnalysis,
    incomeAnalysis,
    trends,
    pendingApprovals,
    loading,
    error,
    refreshDashboard,
    setCurrentMonth,
    setCurrentYear,
    setLast30Days,
    clearError,
  } = useFinanceDashboard();

  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const navigate = useNavigate();

  useEffect(() => {
    refreshDashboard();
  }, []);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    switch (period) {
      case "month":
        setCurrentMonth();
        break;
      case "year":
        setCurrentYear();
        break;
      case "30days":
        setLast30Days();
        break;
      default:
        setCurrentMonth();
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const MetricCard = ({ title, value, change, icon: Icon, color, onClick }) => (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && change !== null && (
            <div
              className={`flex items-center mt-2 ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="ml-1 text-sm font-medium">
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );

  const QuickAction = ({ title, description, icon: Icon, onClick, color }) => (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Card clicked!");
        if (onClick) {
          onClick(e);
        }
      }}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <ArrowRight size={16} className="text-gray-400" />
      </div>
    </Card>
  );

  const ErrorDisplay = ({ error, onRetry }) => (
    <Card className="p-6 bg-red-50 border-red-200">
      <div className="flex items-center space-x-3">
        <AlertCircle className="text-red-500" size={24} />
        <div className="flex-1">
          <h4 className="font-medium text-red-900">Error Loading Dashboard</h4>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
        <FilledButton
          buttonText="Retry"
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700"
        />
      </div>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Container className="p-6 space-y-6">
      <BodyHeader
        heading="Finance Dashboard"
        subHeading="Overview of your financial performance"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton height="100px" width="100%" />
          </Card>
        ))}
      </div>
    </Container>
  );

  if (loading && !overview) {
    return <LoadingSkeleton />;
  }

  return (
    <Container className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BodyHeader
          heading="Finance Dashboard"
          subHeading="Overview of your financial performance"
        />
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: "30days", label: "30D" },
              { key: "month", label: "Month" },
              { key: "year", label: "Year" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handlePeriodChange(key)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <FilledButton
            icon={RefreshCw}
            isIcon
            isIconLeft
            buttonText="Refresh"
            onClick={() => {
              clearError();
              refreshDashboard();
            }}
            isLoading={loading}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorDisplay
          error={error}
          onRetry={() => {
            clearError();
            refreshDashboard();
          }}
        />
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Balance"
          value={
            balance ? `$${balance.totalBalance?.toLocaleString() || "0"}` : "$0"
          }
          change={balance?.balanceChange}
          icon={DollarSign}
          color="bg-blue-500"
        />
        <MetricCard
          title="Monthly Income"
          value={
            overview
              ? `$${overview.monthlyIncome?.toLocaleString() || "0"}`
              : "$0"
          }
          change={overview?.incomeChange}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <MetricCard
          title="Monthly Expenses"
          value={
            overview
              ? `$${overview.monthlyExpenses?.toLocaleString() || "0"}`
              : "$0"
          }
          change={overview?.expenseChange}
          icon={CreditCard}
          color="bg-red-500"
        />
        <MetricCard
          title="Net Profit"
          value={
            profitLoss
              ? `$${profitLoss.netProfit?.toLocaleString() || "0"}`
              : "$0"
          }
          change={profitLoss?.profitChange}
          icon={Target}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Cash Flow Trend
            </h3>
            <Badge variant="info">Daily View</Badge>
          </div>
          {cashFlow?.chartData && cashFlow.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashFlow.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `$${value?.toLocaleString()}`,
                    "Amount",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="netFlow"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Net Flow"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                <p>No cash flow data available</p>
              </div>
            </div>
          )}
        </Card>

        {/* Expense Categories */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Categories
            </h3>
            <Badge variant="warning">Top 5</Badge>
          </div>
          {expenseAnalysis?.topCategories &&
          expenseAnalysis.topCategories.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseAnalysis.topCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {expenseAnalysis.topCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `$${value?.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {expenseAnalysis.topCategories
                  .slice(0, 5)
                  .map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-gray-600">{category.name}</span>
                      </div>
                      <span className="font-medium">
                        ${category.amount?.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <CreditCard size={48} className="mx-auto mb-2 opacity-50" />
                <p>No expense data available</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Income vs Expenses Comparison */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Comparison
          </h3>
          <Badge variant="primary">Income vs Expenses</Badge>
        </div>
        {trends?.monthlyComparison && trends.monthlyComparison.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends.monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`$${value?.toLocaleString()}`, "Amount"]}
              />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Target size={48} className="mx-auto mb-2 opacity-50" />
              <p>No trend data available</p>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Actions & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickAction
              title="Manage Income"
              description="View and add income records"
              icon={TrendingUp}
              color="bg-green-500"
              onClick={() => {
                console.log("Testing navigation to root");
                navigate("/admin/finance/incomes");
              }}
            />

            <QuickAction
              title="Manage Expenses"
              description="Track and categorize expenses"
              icon={CreditCard}
              color="bg-red-500"
              onClick={() => navigate("/admin/finance/expenses")}
            />
            <QuickAction
              title="Financial Reports"
              description="Generate detailed reports"
              icon={Target}
              color="bg-blue-500"
              onClick={() => navigate("/admin/finance/reports")}
            />
            <QuickAction
              title="Budget Planning"
              description="Plan and track budgets"
              icon={Calendar}
              color="bg-purple-500"
              onClick={() => navigate("/admin/finance/balance")}
            />
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Approvals
            </h3>
            <Badge variant="danger">{pendingApprovals?.total || 0}</Badge>
          </div>
          <div className="space-y-3">
            {(pendingApprovals?.items || []).slice(0, 5).map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    ${item.amount?.toLocaleString()}
                  </p>
                  <Badge variant="warning" className="text-xs">
                    Pending
                  </Badge>
                </div>
              </div>
            ))}
            {(!pendingApprovals?.items ||
              pendingApprovals.items.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <Users size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pending approvals</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default FinanceDashboard;
