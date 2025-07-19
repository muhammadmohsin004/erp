import React, { useEffect, useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Plus, Download, Filter, Search, CreditCard, DollarSign, Calendar, Check, X, Clock, MoreVertical, Upload, Eye, Edit, Trash2 } from 'lucide-react';
import { useFinanceExpenses } from '../../Contexts/FinanceContext/FinanceExpensesContext';
import Container from '../../components/elements/container/Container';
import BodyHeader from '../../components/elements/bodyHeader/BodyHeader';
import Card from '../../components/elements/card/Card';
import Skeleton from '../../components/elements/skeleton/Skeleton';
import OutlineButton from '../../components/elements/elements/buttons/OutlineButton/OutlineButton';
import FilledButton from '../../components/elements/elements/buttons/filledButton/FilledButton';
import SearchAndFilters from '../../components/elements/searchAndFilters/SearchAndFilters';
import SelectBox from '../../components/elements/selectBox/SelectBox';
import Table from '../../components/elements/table/Table';
import Thead from '../../components/elements/thead/Thead';
import TR from '../../components/elements/tr/TR';
import TH from '../../components/elements/th/TH';
import TD from '../../components/elements/td/TD';
import Dropdown from '../../components/elements/dropdown/Dropdown';
import Pagination from '../../components/elements/Pagination/Pagination';
import Modall from '../../components/elements/modal/Modal';
import InputField from '../../components/elements/inputField/InputField';
import CheckboxField from '../../components/elements/checkbox/CheckboxField';
import Tbody from '../../components/elements/tbody/Tbody';

// Badge component if not imported
const Badge = ({ variant, children }) => {
  const variants = {
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-200'
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${variants[variant] || variants.secondary}`}>
      {children}
    </span>
  );
};

const FinanceExpenses = () => {
  const {
    expenses,
    statistics,
    trends,
    categories,
    pagination,
    filters,
    loading,
    error,
    getExpenses,
    getExpenseStatistics,
    getExpenseTrends,
    getExpenseCategories,
    createExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense,
    searchExpenses,
    filterByStatus,
    filterByCategory,
    filterByDateRange,
    changePage,
    changePageSize
  } = useFinanceExpenses();

  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [approvingExpense, setApprovingExpense] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    expenseDate: '',
    categoryId: '',
    vendorId: '',
    paymentMethod: '',
    isRecurring: false,
    notes: '',
    currency: 'USD',
    exchangeRate: 1,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: '',
    referenceNumber: '',
    recurringPattern: '',
    recurringInterval: 0,
    nextRecurringDate: '',
    items: []
  });

  useEffect(() => {
    getExpenses();
    getExpenseStatistics();
    getExpenseTrends();
    getExpenseCategories();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchValue) {
        searchExpenses(searchValue);
      } else {
        getExpenses();
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

  const handleAddExpense = async () => {
    try {
      await createExpense(expenseForm);
      setShowAddModal(false);
      resetForm();
      getExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async () => {
    try {
      await updateExpense(editingExpense.id, expenseForm);
      setShowEditModal(false);
      setEditingExpense(null);
      resetForm();
      getExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        getExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleApprovalAction = async () => {
    try {
      if (approvalAction === 'approve') {
        await approveExpense(approvingExpense.id, approvalNotes);
      } else if (approvalAction === 'reject') {
        await rejectExpense(approvingExpense.id, approvalNotes);
      }
      setShowApprovalModal(false);
      setApprovingExpense(null);
      setApprovalAction('');
      setApprovalNotes('');
      getExpenses();
    } catch (error) {
      console.error('Error processing approval:', error);
    }
  };

  const resetForm = () => {
    setExpenseForm({
      description: '',
      amount: '',
      expenseDate: '',
      categoryId: '',
      vendorId: '',
      paymentMethod: '',
      isRecurring: false,
      notes: '',
      currency: 'USD',
      exchangeRate: 1,
      taxRate: 0,
      taxAmount: 0,
      totalAmount: '',
      referenceNumber: '',
      recurringPattern: '',
      recurringInterval: 0,
      nextRecurringDate: '',
      items: []
    });
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      description: expense.description,
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      categoryId: expense.categoryId,
      vendorId: expense.vendorId,
      paymentMethod: expense.paymentMethod,
      isRecurring: expense.isRecurring,
      notes: expense.notes,
      currency: expense.currency,
      exchangeRate: expense.exchangeRate,
      taxRate: expense.taxRate,
      taxAmount: expense.taxAmount,
      totalAmount: expense.totalAmount,
      referenceNumber: expense.referenceNumber,
      recurringPattern: expense.recurringPattern,
      recurringInterval: expense.recurringInterval,
      nextRecurringDate: expense.nextRecurringDate,
      items: expense.items || []
    });
    setShowEditModal(true);
  };

  const openApprovalModal = (expense, action) => {
    setApprovingExpense(expense);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const handleFormChange = (field, value) => {
    setExpenseForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Calculate total amount when amount or tax changes
    if (field === 'amount' || field === 'taxRate') {
      const amount = field === 'amount' ? parseFloat(value) || 0 : parseFloat(expenseForm.amount) || 0;
      const taxRate = field === 'taxRate' ? parseFloat(value) || 0 : parseFloat(expenseForm.taxRate) || 0;
      const taxAmount = (amount * taxRate) / 100;
      const totalAmount = amount + taxAmount;
      
      setExpenseForm(prev => ({
        ...prev,
        taxAmount,
        totalAmount: totalAmount.toFixed(2)
      }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'draft':
        return <Badge variant="info">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
          title="Expense Management"
          subtitle="Track and manage your business expenses"
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
                    Total Expenses
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statistics?.totalExpenses ? formatCurrency(statistics.totalExpenses) : '$0.00'}
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
                    Pending Approval
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statistics?.pendingApproval || 0}
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
                    {statistics?.thisMonth ? formatCurrency(statistics.thisMonth) : '$0.00'}
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
                    Average Expense
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statistics?.averageExpense ? formatCurrency(statistics.averageExpense) : '$0.00'}
                  </dd>
                </dl>
              </div>
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
                  placeholder="Search expenses..."
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
                options={categories?.map(cat => ({ value: cat.id, label: cat.name })) || []}
              />
              <SelectBox
                value={selectedStatus}
                onChange={handleStatusFilter}
                placeholder="Status"
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' },
                  { value: 'draft', label: 'Draft' }
                ]}
              />
              <OutlineButton onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 mt-22 w-4 mr-2" />
                Add Expense
              </OutlineButton>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-4 mb-6">
            <InputField
              type="date"
              label="Start Date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <InputField
              type="date"
              label="End Date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
            <FilledButton onClick={handleDateRangeFilter} className="mt-6">
              Apply Filter
            </FilledButton>
          </div>

          {/* Expenses Table */}
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
              {expenses?.map((expense) => (
                <TR key={expense.id}>
                  <TD>{expense.description}</TD>
                  <TD>{formatCurrency(expense.amount, expense.currency)}</TD>
                  <TD>{expense.categoryName}</TD>
                  <TD>{new Date(expense.expenseDate).toLocaleDateString()}</TD>
                  <TD>{getStatusBadge(expense.status)}</TD>
                  <TD>
                    <Dropdown
                      trigger={
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      }
                    >
                      <div className="py-1">
                        <button
                          onClick={() => openEditModal(expense)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        {expense.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openApprovalModal(expense, 'approve')}
                              className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => openApprovalModal(expense, 'reject')}
                              className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </Dropdown>
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

        {/* Add/Edit Expense Modal */}
        <Modall
          show={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setEditingExpense(null);
            resetForm();
          }}
          title={showAddModal ? 'Add New Expense' : 'Edit Expense'}
          size="lg"
        >
          <div className="space-y-4">
            <InputField
              label="Description"
              value={expenseForm.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Amount"
                type="number"
                value={expenseForm.amount}
                onChange={(e) => handleFormChange('amount', e.target.value)}
                required
              />
              <InputField
                label="Expense Date"
                type="date"
                value={expenseForm.expenseDate}
                onChange={(e) => handleFormChange('expenseDate', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SelectBox
                label="Category"
                value={expenseForm.categoryId}
                onChange={(value) => handleFormChange('categoryId', value)}
                options={categories?.map(cat => ({ value: cat.id, label: cat.name })) || []}
                required
              />
              <SelectBox
                label="Payment Method"
                value={expenseForm.paymentMethod}
                onChange={(value) => handleFormChange('paymentMethod', value)}
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'credit_card', label: 'Credit Card' },
                  { value: 'debit_card', label: 'Debit Card' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'check', label: 'Check' }
                ]}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <SelectBox
                label="Currency"
                value={expenseForm.currency}
                onChange={(value) => handleFormChange('currency', value)}
                options={[
                  { value: 'USD', label: 'USD' },
                  { value: 'EUR', label: 'EUR' },
                  { value: 'GBP', label: 'GBP' },
                  { value: 'JPY', label: 'JPY' }
                ]}
              />
              <InputField
                label="Tax Rate (%)"
                type="number"
                value={expenseForm.taxRate}
                onChange={(e) => handleFormChange('taxRate', e.target.value)}
              />
              <InputField
                label="Total Amount"
                type="number"
                value={expenseForm.totalAmount}
                readOnly
              />
            </div>

            <InputField
              label="Reference Number"
              value={expenseForm.referenceNumber}
              onChange={(e) => handleFormChange('referenceNumber', e.target.value)}
            />

            <CheckboxField
              label="Recurring Expense"
              checked={expenseForm.isRecurring}
              onChange={(checked) => handleFormChange('isRecurring', checked)}
            />

            {expenseForm.isRecurring && (
              <div className="grid grid-cols-2 gap-4">
                <SelectBox
                  label="Recurring Pattern"
                  value={expenseForm.recurringPattern}
                  onChange={(value) => handleFormChange('recurringPattern', value)}
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: 'Yearly' }
                  ]}
                />
                <InputField
                  label="Next Recurring Date"
                  type="date"
                  value={expenseForm.nextRecurringDate}
                  onChange={(e) => handleFormChange('nextRecurringDate', e.target.value)}
                />
              </div>
            )}

            <InputField
              label="Notes"
              as="textarea"
              rows={3}
              value={expenseForm.notes}
              onChange={(e) => handleFormChange('notes', e.target.value)}
            />

            <div className="flex justify-end space-x-3">
              <OutlineButton
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingExpense(null);
                  resetForm();
                }}
              >
                Cancel
              </OutlineButton>
              <FilledButton
                onClick={showAddModal ? handleAddExpense : handleEditExpense}
              >
                {showAddModal ? 'Add Expense' : 'Update Expense'}
              </FilledButton>
            </div>
          </div>
        </Modall>

        {/* Approval Modal */}
        <Modall
          show={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setApprovingExpense(null);
            setApprovalAction('');
            setApprovalNotes('');
          }}
          title={`${approvalAction === 'approve' ? 'Approve' : 'Reject'} Expense`}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to {approvalAction} this expense?
            </p>
            
            {approvingExpense && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Description:</strong> {approvingExpense.description}</p>
                <p><strong>Amount:</strong> {formatCurrency(approvingExpense.amount)}</p>
                <p><strong>Date:</strong> {new Date(approvingExpense.expenseDate).toLocaleDateString()}</p>
              </div>
            )}

            <InputField
              label="Notes (Optional)"
              as="textarea"
              rows={3}
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Add any comments or notes..."
            />

            <div className="flex justify-end space-x-3">
              <OutlineButton
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovingExpense(null);
                  setApprovalAction('');
                  setApprovalNotes('');
                }}
              >
                Cancel
              </OutlineButton>
              <FilledButton
                onClick={handleApprovalAction}
                variant={approvalAction === 'approve' ? 'success' : 'danger'}
              >
                {approvalAction === 'approve' ? 'Approve' : 'Reject'}
              </FilledButton>
            </div>
          </div>
        </Modall>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <X className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default FinanceExpenses;