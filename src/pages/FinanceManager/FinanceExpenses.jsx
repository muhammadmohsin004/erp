import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Plus,
  Download,
  Filter,
  Search,
  CreditCard,
  DollarSign,
  Calendar,
  Check,
  X,
  Clock,
  MoreVertical,
  Upload,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Container from "../../components/elements/container/Container";
import BodyHeader from "../../components/elements/bodyHeader/BodyHeader";
import Card from "../../components/elements/card/Card";
import Skeleton from "../../components/elements/skeleton/Skeleton";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import Table from "../../components/elements/table/Table";
import Thead from "../../components/elements/thead/Thead";
import TR from "../../components/elements/tr/TR";
import TH from "../../components/elements/th/TH";
import TD from "../../components/elements/td/TD";
import Dropdown from "../../components/elements/dropdown/Dropdown";
import Pagination from "../../components/elements/Pagination/Pagination";
import InputField from "../../components/elements/inputField/InputField";
import CheckboxField from "../../components/elements/checkbox/CheckboxField";
import Tbody from "../../components/elements/tbody/Tbody";
import { Modal } from "antd";
import { useFinanceIncomes } from "../../Contexts/FinanceContext/FinanceIncomeContext";

// Badge component
const Badge = ({ variant, children }) => {
  const variants = {
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    secondary: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        variants[variant] || variants.secondary
      }`}
    >
      {children}
    </span>
  );
};

// Modal component
const Modall = ({
  title,
  okAction,
  cancelAction,
  body,
  okText,
  cancelText,
  open,
  onCancel,
  okButtonDisabled = false,
  cancelButtonDisabled = false,
  width = 550,
}) => {
  return (
    <Modal
      title={title}
      centered
      open={open}
      okText={okText}
      cancelText={cancelText}
      onOk={okAction}
      onCancel={onCancel || cancelAction}
      width={width}
      okButtonProps={{
        style: {
          backgroundColor: "#0077b6",
          borderColor: "#0077b6",
          color: "white",
        },
        disabled: okButtonDisabled,
      }}
      cancelButtonProps={{
        style: {
          backgroundColor: "transparent",
          borderColor: "#0077b6",
          color: "#0077b6",
          border: "2px solid",
        },
        disabled: cancelButtonDisabled,
      }}
    >
      {body}
    </Modal>
  );
};

const FinanceIncome = () => {
  const {
    incomes,
    statistics,
    trends,
    categories,
    pagination,
    filters,
    loading,
    error,
    getIncomes,
    getIncomeStatistics,
    getIncomeTrends,
    getIncomeCategories,
    createIncome,
    updateIncome,
    deleteIncome,
    approveIncome,
    rejectIncome,
    searchIncomes,
    filterByStatus,
    filterByCategory,
    filterByDateRange,
    changePage,
    changePageSize,
  } = useFinanceIncomes();

  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [approvingIncome, setApprovingIncome] = useState(null);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [incomeForm, setIncomeForm] = useState({
    description: "",
    amount: "",
    incomeDate: "",
    categoryId: "",
    customerId: "",
    paymentMethod: "",
    isRecurring: false,
    notes: "",
    currency: "USD",
    exchangeRate: 1,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: "",
    referenceNumber: "",
    recurringPattern: "",
    recurringInterval: 0,
    nextRecurringDate: "",
    items: [],
  });

  useEffect(() => {
    getIncomes();
    getIncomeStatistics();
    getIncomeCategories();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchValue) {
        searchIncomes(searchValue);
      } else {
        getIncomes();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchValue]);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    filterByCategory(categoryId);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    filterByStatus(status);
  };

  const handleDateRangeFilter = () => {
    if (dateRange.start && dateRange.end) {
      filterByDateRange(dateRange.start, dateRange.end);
    }
  };

  const handleAddIncome = async () => {
    // Add validation
    if (
      !incomeForm.description ||
      !incomeForm.amount ||
      !incomeForm.incomeDate ||
      !incomeForm.categoryId
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      console.log("Submitting income form:", incomeForm); // Debug log
      await createIncome(incomeForm);
      setShowAddModal(false);
      resetForm();
      getIncomes();
      // Add success message
      alert("Income added successfully!");
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Error adding income: " + (error.message || "Unknown error"));
    }
  };

  const handleEditIncome = async () => {
    try {
      await updateIncome(editingIncome.id, incomeForm);
      setShowEditModal(false);
      setEditingIncome(null);
      resetForm();
      getIncomes();
    } catch (error) {
      console.error("Error updating income:", error);
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        await deleteIncome(incomeId);
        getIncomes();
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    }
  };

  const handleApprovalAction = async () => {
    try {
      if (approvalAction === "approve") {
        await approveIncome(approvingIncome.id, approvalNotes);
      } else if (approvalAction === "reject") {
        await rejectIncome(approvingIncome.id, approvalNotes);
      }
      setShowApprovalModal(false);
      setApprovingIncome(null);
      setApprovalAction("");
      setApprovalNotes("");
      getIncomes();
    } catch (error) {
      console.error("Error processing approval:", error);
    }
  };

  const resetForm = () => {
    setIncomeForm({
      description: "",
      amount: "",
      incomeDate: "",
      categoryId: "",
      customerId: "",
      paymentMethod: "",
      isRecurring: false,
      notes: "",
      currency: "USD",
      exchangeRate: 1,
      taxRate: 0,
      taxAmount: 0,
      totalAmount: "",
      referenceNumber: "",
      recurringPattern: "",
      recurringInterval: 0,
      nextRecurringDate: "",
      items: [],
    });
  };

  const openEditModal = (income) => {
    setEditingIncome(income);
    setIncomeForm({
      description: income.Description,
      amount: income.Amount,
      incomeDate: income.IncomeDate.split("T")[0],
      categoryId: income.CategoryId,
      customerId: income.CustomerId || "",
      paymentMethod: income.PaymentMethod || "",
      isRecurring: income.IsRecurring || false,
      notes: income.Notes || "",
      currency: income.Currency || "USD",
      exchangeRate: income.ExchangeRate || 1,
      taxRate: income.TaxRate || 0,
      taxAmount: income.TaxAmount || 0,
      totalAmount: income.TotalAmount || income.Amount,
      referenceNumber: income.ReferenceNumber || "",
      recurringPattern: income.RecurringPattern || "",
      recurringInterval: income.RecurringInterval || 0,
      nextRecurringDate: income.NextRecurringDate
        ? income.NextRecurringDate.split("T")[0]
        : "",
      items: income.Items || [],
    });
    setShowEditModal(true);
  };

  const openApprovalModal = (income, action) => {
    setApprovingIncome(income);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const handleFormChange = (field, value) => {
    console.log("Form field changed:", field, value); // Debug log

    setIncomeForm((prev) => {
      const newForm = {
        ...prev,
        [field]: value,
      };

      // Calculate tax and total when amount or tax rate changes
      if (field === "amount" || field === "taxRate") {
        const amount =
          field === "amount"
            ? parseFloat(value) || 0
            : parseFloat(newForm.amount) || 0;
        const taxRate =
          field === "taxRate"
            ? parseFloat(value) || 0
            : parseFloat(newForm.taxRate) || 0;
        const taxAmount = (amount * taxRate) / 100;
        const totalAmount = amount + taxAmount;

        newForm.taxAmount = taxAmount;
        newForm.totalAmount = totalAmount.toFixed(2);
      }

      return newForm;
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "draft":
        return <Badge variant="info">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCurrentMonthAmount = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const monthlyTrend = statistics?.MonthlyTrend?.$values || [];
    const currentMonthData = monthlyTrend.find(
      (trend) => trend.Year === currentYear && trend.Month === currentMonth
    );

    return currentMonthData?.Amount || 0;
  };

  const getPendingApprovalCount = () => {
    const statusBreakdown = statistics?.StatusBreakdown?.$values || [];
    const draftStatus = statusBreakdown.find(
      (status) =>
        status.Status.toLowerCase() === "draft" ||
        status.Status.toLowerCase() === "pending"
    );

    return draftStatus?.Count || 0;
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const handleAddModalClose = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingIncome(null);
    resetForm();
  };

  const handleApprovalModalClose = () => {
    setShowApprovalModal(false);
    setApprovingIncome(null);
    setApprovalAction("");
    setApprovalNotes("");
  };

  const handleDropdownSelect = (income, item) => {
    switch (item.action) {
      case "edit":
        openEditModal(income);
        break;
      case "approve":
        openApprovalModal(income, "approve");
        break;
      case "reject":
        openApprovalModal(income, "reject");
        break;
      case "delete":
        handleDeleteIncome(income.Id);
        break;
      default:
        break;
    }
  };

  const getDropdownItems = (income) => {
    const items = [{ label: "Edit", action: "edit" }];

    if (income.Status === "pending") {
      items.push(
        { label: "Approve", action: "approve" },
        { label: "Reject", action: "reject" }
      );
    }

    items.push({ label: "Delete", action: "delete" });
    return items;
  };

  if (loading) {
    return (
      <Container>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <BodyHeader
          title="Income Management"
          subtitle="Track and manage your business income"
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Amount
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statistics?.TotalAmount
                      ? formatCurrency(statistics.TotalAmount)
                      : "$0.00"}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Draft Incomes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {getPendingApprovalCount()}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(getCurrentMonthAmount())}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Income
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statistics?.AverageIncomeAmount
                      ? formatCurrency(statistics.AverageIncomeAmount)
                      : "$0.00"}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Status Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Status Breakdown
            </h3>
            <div className="space-y-3">
              {statistics?.StatusBreakdown?.$values?.map((status) => (
                <div
                  key={status.$id}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-gray-600 capitalize">
                    {status.Status}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {status.Count} incomes
                    </span>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(status.Amount)}
                    </div>
                  </div>
                </div>
              )) || []}
            </div>
          </Card>

          {/* Monthly Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Monthly Trend
            </h3>
            <div className="space-y-3">
              {statistics?.MonthlyTrend?.$values?.map((trend) => (
                <div
                  key={trend.$id}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-gray-600">
                    {new Date(trend.Year, trend.Month - 1).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {trend.Count} incomes
                    </span>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(trend.Amount)}
                    </div>
                  </div>
                </div>
              )) || []}
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search incomes..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <SelectBox
                value={selectedCategory}
                onChange={handleCategoryFilter}
                placeholder="Category"
                options={
                  categories?.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  })) || []
                }
              />
              <SelectBox
                value={selectedStatus}
                onChange={handleStatusFilter}
                placeholder="Status"
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "draft", label: "Draft" },
                ]}
              />
              <OutlineButton onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </OutlineButton>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-4 mb-6">
            <InputField
              type="date"
              label="Start Date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
            />
            <InputField
              type="date"
              label="End Date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
            />
            <FilledButton onClick={handleDateRangeFilter} className="mt-6">
              Apply Filter
            </FilledButton>
          </div>

          {/* Incomes Table */}
          <Table>
            <Thead>
              <TR>
                <TH>Description</TH>
                <TH>Amount</TH>
                <TH>Category</TH>
                <TH>Date</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </Thead>
            <Tbody>
              {incomes?.map((income) => (
                <TR key={income.Id}>
                  <TD>{income.Description}</TD>
                  <TD>{formatCurrency(income.Amount, income.Currency)}</TD>
                  <TD>{income.CategoryName}</TD>
                  <TD>{new Date(income.IncomeDate).toLocaleDateString()}</TD>
                  <TD>{getStatusBadge(income.Status)}</TD>
                  <TD>
                    <Dropdown
                      buttonText=""
                      icon={MoreVertical}
                      items={getDropdownItems(income)}
                      onSelect={(item) => handleDropdownSelect(income, item)}
                      buttonClassName="p-2 hover:bg-gray-100 rounded-md border-none shadow-none"
                    />
                  </TD>
                </TR>
              ))}
            </Tbody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            totalItems={pagination?.totalItems || 0}
            onPageChange={changePage}
            onPageSizeChange={changePageSize}
          />
        </Card>

        {/* Add Income Modal */}
        <Modall
          title="Add New Income"
          okText="Add Income"
          cancelText="Cancel"
          okAction={handleAddIncome}
          cancelAction={handleAddModalClose}
          width={800}
          open={showAddModal}
          onCancel={handleAddModalClose}
          okButtonDisabled={
            !incomeForm.description ||
            !incomeForm.amount ||
            !incomeForm.incomeDate ||
            !incomeForm.categoryId
          }
          body={
            <div className="space-y-4">
              <InputField
                label="Description"
                value={incomeForm.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Amount"
                  type="number"
                  value={incomeForm.amount}
                  onChange={(e) => handleFormChange("amount", e.target.value)}
                  required
                />
                <InputField
                  label="Income Date"
                  type="date"
                  value={incomeForm.incomeDate}
                  onChange={(e) =>
                    handleFormChange("incomeDate", e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectBox
                  label="Category"
                  value={incomeForm.categoryId}
                  onChange={(value) => {
                    console.log("Category selected:", value); // Debug log
                    handleFormChange("categoryId", value);
                  }}
                  options={
                    categories?.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    })) || []
                  }
                  required
                />
                <SelectBox
                  label="Payment Method"
                  value={incomeForm.paymentMethod}
                  onChange={(value) => handleFormChange("paymentMethod", value)}
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "credit_card", label: "Credit Card" },
                    { value: "debit_card", label: "Debit Card" },
                    { value: "bank_transfer", label: "Bank Transfer" },
                    { value: "check", label: "Check" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <SelectBox
                  label="Currency"
                  value={incomeForm.currency}
                  onChange={(value) => handleFormChange("currency", value)}
                  options={[
                    { value: "USD", label: "USD" },
                    { value: "EUR", label: "EUR" },
                    { value: "GBP", label: "GBP" },
                    { value: "JPY", label: "JPY" },
                  ]}
                />
                <InputField
                  label="Tax Rate (%)"
                  type="number"
                  value={incomeForm.taxRate}
                  onChange={(e) => handleFormChange("taxRate", e.target.value)}
                />
                <InputField
                  label="Total Amount"
                  type="number"
                  value={incomeForm.totalAmount}
                  readOnly
                />
              </div>

              <InputField
                label="Reference Number"
                value={incomeForm.referenceNumber}
                onChange={(e) =>
                  handleFormChange("referenceNumber", e.target.value)
                }
              />

              <CheckboxField
                label="Recurring Income"
                checked={incomeForm.isRecurring}
                onChange={(checked) => handleFormChange("isRecurring", checked)}
              />

              {incomeForm.isRecurring && (
                <div className="grid grid-cols-2 gap-4">
                  <SelectBox
                    label="Recurring Pattern"
                    value={incomeForm.recurringPattern}
                    onChange={(value) =>
                      handleFormChange("recurringPattern", value)
                    }
                    options={[
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "yearly", label: "Yearly" },
                    ]}
                  />
                  <InputField
                    label="Next Recurring Date"
                    type="date"
                    value={incomeForm.nextRecurringDate}
                    onChange={(e) =>
                      handleFormChange("nextRecurringDate", e.target.value)
                    }
                  />
                </div>
              )}

              <InputField
                label="Notes"
                as="textarea"
                rows={3}
                value={incomeForm.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
              />
            </div>
          }
        />

        {/* Edit Income Modal */}
        <Modall
          title="Edit Income"
          okText="Update Income"
          cancelText="Cancel"
          okAction={handleEditIncome}
          cancelAction={handleEditModalClose}
          width={800}
          open={showEditModal}
          onCancel={handleEditModalClose}
          body={
            <div className="space-y-4">
              <InputField
                label="Description"
                value={incomeForm.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Amount"
                  type="number"
                  value={incomeForm.amount}
                  onChange={(e) => handleFormChange("amount", e.target.value)}
                  required
                />
                <InputField
                  label="Income Date"
                  type="date"
                  value={incomeForm.incomeDate}
                  onChange={(e) =>
                    handleFormChange("incomeDate", e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectBox
                  label="Category"
                  value={incomeForm.categoryId}
                  onChange={(value) => handleFormChange("categoryId", value)}
                  options={
                    categories?.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    })) || []
                  }
                  required
                />
                <SelectBox
                  label="Payment Method"
                  value={incomeForm.paymentMethod}
                  onChange={(value) => handleFormChange("paymentMethod", value)}
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "credit_card", label: "Credit Card" },
                    { value: "debit_card", label: "Debit Card" },
                    { value: "bank_transfer", label: "Bank Transfer" },
                    { value: "check", label: "Check" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <SelectBox
                  label="Currency"
                  value={incomeForm.currency}
                  onChange={(value) => handleFormChange("currency", value)}
                  options={[
                    { value: "USD", label: "USD" },
                    { value: "EUR", label: "EUR" },
                    { value: "GBP", label: "GBP" },
                    { value: "JPY", label: "JPY" },
                  ]}
                />
                <InputField
                  label="Tax Rate (%)"
                  type="number"
                  value={incomeForm.taxRate}
                  onChange={(e) => handleFormChange("taxRate", e.target.value)}
                />
                <InputField
                  label="Total Amount"
                  type="number"
                  value={incomeForm.totalAmount}
                  readOnly
                />
              </div>

              <InputField
                label="Reference Number"
                value={incomeForm.referenceNumber}
                onChange={(e) =>
                  handleFormChange("referenceNumber", e.target.value)
                }
              />

              <CheckboxField
                label="Recurring Income"
                checked={incomeForm.isRecurring}
                onChange={(checked) => handleFormChange("isRecurring", checked)}
              />

              {incomeForm.isRecurring && (
                <div className="grid grid-cols-2 gap-4">
                  <SelectBox
                    label="Recurring Pattern"
                    value={incomeForm.recurringPattern}
                    onChange={(value) =>
                      handleFormChange("recurringPattern", value)
                    }
                    options={[
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "yearly", label: "Yearly" },
                    ]}
                  />
                  <InputField
                    label="Next Recurring Date"
                    type="date"
                    value={incomeForm.nextRecurringDate}
                    onChange={(e) =>
                      handleFormChange("nextRecurringDate", e.target.value)
                    }
                  />
                </div>
              )}

              <InputField
                label="Notes"
                as="textarea"
                rows={3}
                value={incomeForm.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
              />
            </div>
          }
        />

        {/* Approval Modal */}
        <Modall
          title={`${
            approvalAction === "approve" ? "Approve" : "Reject"
          } Income`}
          okText={approvalAction === "approve" ? "Approve" : "Reject"}
          cancelText="Cancel"
          okAction={handleApprovalAction}
          cancelAction={handleApprovalModalClose}
          width={600}
          open={showApprovalModal}
          onCancel={handleApprovalModalClose}
          body={
            <div className="space-y-4">
              {approvingIncome && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Income Details
                  </h4>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Description:</strong>{" "}
                      {approvingIncome.Description}
                    </p>
                    <p>
                      <strong>Amount:</strong>{" "}
                      {formatCurrency(approvingIncome.Amount)}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(
                        approvingIncome.IncomeDate
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Category:</strong> {approvingIncome.CategoryName}
                    </p>
                  </div>
                </div>
              )}

              <InputField
                label={`${
                  approvalAction === "approve" ? "Approval" : "Rejection"
                } Notes`}
                as="textarea"
                rows={4}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder={`Enter notes for ${approvalAction}...`}
              />
            </div>
          }
        />
      </div>
    </Container>
  );
};

export default FinanceIncome;
