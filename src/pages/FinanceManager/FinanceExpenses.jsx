import React, { useEffect, useState } from 'react';
import { useFinanceExpenses } from '../contexts/FinanceExpensesContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Plus, Download, Filter, Search, CreditCard, DollarSign, Calendar, Check, X, Clock, MoreVertical, Upload, Eye, Edit, Trash2 } from 'lucide-react';
import Container from '../components/elements/container/Container';
import Card from '../components/elements/card/Card';
import BodyHeader from '../components/elements/BodyHeader';
import FilledButton from '../components/elements/buttons/FilledButton';
import OutlineButton from '../components/elements/buttons/OutlineButton';
import Badge from '../components/elements/badge/Badge';
import Table from '../components/elements/table/Table';
import Thead from '../components/elements/table/Thead';
import Tbody from '../components/elements/table/Tbody';
import TH from '../components/elements/table/TH';
import TD from '../components/elements/table/TD';
import TR from '../components/elements/table/TR';
import Pagination from '../components/elements/pagination/Pagination';
import SearchAndFilters from '../components/elements/search/SearchAndFilters';
import SelectBox from '../components/elements/SelectBox';
import InputField from '../components/elements/InputField';
import Modall from '../components/elements/Modall';
import Dropdown from '../components/elements/dropdown/Dropdown';
import Skeleton from '../components/elements/skeleton/Skeleton';
import CheckboxField from '../components/elements/CheckboxField';

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
    attachments: null
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

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
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

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      description: expense.description || '',
      amount: expense.amount || '',
      expenseDate: expense.expenseDate || '',
      categoryId: expense.categoryId || '',
      vendorId: expense.vendorId || '',
      paymentMethod: expense.paymentMethod || '',
      isRecurring: expense.isRecurring || false,
      notes: expense.notes || '',
      attachments: null
    });
    setShowEditModal(true);
  };

  const openApprovalModal = (expense, action) => {
    setApprovingExpense(expense);
    setApprovalAction(action);
    setShowApprovalModal(true);
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
      attachments: null
    });
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Paid', label: 'Paid' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  const paymentMethodOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Check', label: 'Check' },
    { value: 'Digital Wallet', label: 'Digital Wallet' }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'danger',
      'Paid': 'info'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading && expenses.length === 0) {
    return (
      <Container className="p-6 space-y-6">
        <BodyHeader heading="Expense Management" subHeading="Track and manage your business expenses" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton height="100px" width="100%" />
            </Card>
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <BodyHeader heading="Expense Management" subHeading="Track and manage your business expenses" />
        <div className="flex items-center space-x-3">
          <OutlineButton
            icon={Download}
            isIcon
            isIconLeft
            buttonText="Export"
            borderColor="border-gray-300"
            borderWidth="border"
            rounded="rounded-md"
            bgColor="bg-white"
            textColor="text-gray-700"
            height="h-10"
            px="px-4"
            hover="hover:bg-gray-50"
            onClick={() => console.log('Export data')}
          />
          <FilledButton
            icon={Plus}
            isIcon
            isIconLeft
            buttonText="Add Expense"
            onClick={() => setShowAddModal(true)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                ${statistics?.totalExpenses?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-500">
              <CreditCard size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                ${statistics?.monthlyExpenses?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <Calendar size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics?.pendingCount || '0'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Expense</p>
              <p className="text-2xl font-bold text-gray-900">
                ${statistics?.averageExpense?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <DollarSign size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expense Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Amount']} />
              <Line type="monotone" dataKey="amount" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statistics?.categoryBreakdown || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="amount"
              >
                {(statistics?.categoryBreakdown || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statistics?.statusBreakdown || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Amount']} />
            <Bar dataKey="amount" fill="#8884D8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-2">
            <SearchAndFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search expenses..."
            />
          </div>
          
          <SelectBox
            placeholder="Filter by Category"
            value={selectedCategory}
            handleChange={handleCategoryFilter}
            optionList={categoryOptions}
            width="w-full"
          />
          
          <SelectBox
            placeholder="Filter by Status"
            value={selectedStatus}
            handleChange={handleStatusFilter}
            optionList={statusOptions}
            width="w-full"
          />
          
          <InputField
            type="date"
            placeholder="Start Date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            width="w-full"
          />
          
          <FilledButton
            buttonText="Apply Filters"
            onClick={handleDateRangeFilter}
            height="h-10"
          />
        </div>
      </Card>

      {/* Expense Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <Thead className="bg-gray-50">
              <TR>
                <TH>Description</TH>
                <TH>Amount</TH>
                <TH>Date</TH>
                <TH>Category</TH>
                <TH>Payment Method</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </Thead>
            <Tbody>
              {expenses.map((expense) => (
                <TR key={expense.id}>
                  <TD className="font-medium text-gray-900">{expense.description}</TD>
                  <TD className="font-semibold text-red-600">
                    ${expense.amount?.toLocaleString()}
                  </TD>
                  <TD>{new Date(expense.expenseDate).toLocaleDateString()}</TD>
                  <TD>
                    <Badge variant="info">{expense.categoryName || 'Uncategorized'}</Badge>
                  </TD>
                  <TD>{expense.paymentMethod}</TD>
                  <TD>{getStatusBadge(expense.status)}</TD>
                  <TD>
                    <div className="flex items-center space-x-2">
                      {expense.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => openApprovalModal(expense, 'approve')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => openApprovalModal(expense, 'reject')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <Dropdown
                        buttonText=""
                        icon={MoreVertical}
                        items={[
                          { label: 'View Details', action: () => console.log('View', expense.id) },
                          { label: 'Edit', action: () => openEditModal(expense) },
                          { label: 'Delete', action: () => handleDeleteExpense(expense.id) }
                        ]}
                        onSelect={(item) => item.action()}
                        buttonClassName="p-2 rounded-md hover:bg-gray-100"
                      />
                    </div>
                  </TD>
                </TR>
              ))}
            </Tbody>
          </Table>
        </div>
        
        {expenses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
            <p>No expense records found</p>
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={changePage}
          />
        </div>
      </Card>

      {/* Add Expense Modal */}
      <Modall
        title="Add New Expense"
        modalOpen={showAddModal}
        setModalOpen={setShowAddModal}
        okText="Add Expense"
        cancelText="Cancel"
        okAction={handleAddExpense}
        cancelAction={() => setShowAddModal(false)}
        width={600}
        body={
          <div className="space-y-4">
            <InputField
              label="Description"
              placeholder="Enter expense description"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
              width="w-full"
            />
            <InputField
              label="Amount"
              type="number"
              placeholder="Enter amount"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
              width="w-full"
            />
            <InputField
              label="Date"
              type="date"
              value={expenseForm.expenseDate}
              onChange={(e) => setExpenseForm({...expenseForm, expenseDate: e.target.value})}
              width="w-full"
            />
            <SelectBox
              label="Category"
              placeholder="Select category"
              value={expenseForm.categoryId}
              handleChange={(value) => setExpenseForm({...expenseForm, categoryId: value})}
              optionList={categoryOptions.filter(opt => opt.value !== '')}
              width="w-full"
            />
            <SelectBox
              label="Payment Method"
              placeholder="Select payment method"
              value={expenseForm.paymentMethod}
              handleChange={(value) => setExpenseForm({...expenseForm, paymentMethod: value})}
              optionList={paymentMethodOptions}
              width="w-full"
            />
            <div className="flex items-center space-x-3">
              <CheckboxField
                name="isRecurring"
                label="Recurring Expense"
                checked={expenseForm.isRecurring}
                onChange={(e) => setExpenseForm({...expenseForm, isRecurring: e.target.checked})}
                errors={{}}
              />
            </div>
            <InputField
              label="Notes"
              placeholder="Additional notes (optional)"
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
              width="w-full"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Receipts)
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => setExpenseForm({...expenseForm, attachments: e.target.files})}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        }
      />

      {/* Edit Expense Modal */}
      <Modall
        title="Edit Expense"
        modalOpen={showEditModal}
        setModalOpen={setShowEditModal}
        okText="Update Expense"
        cancelText="Cancel"
        okAction={handleEditExpense}
        cancelAction={() => setShowEditModal(false)}
        width={600}
        body={
          <div className="space-y-4">
            <InputField
              label="Description"
              placeholder="Enter expense description"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
              width="w-full"
            />
            <InputField
              label="Amount"
              type="number"
              placeholder="Enter amount"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
              width="w-full"
            />
            <InputField
              label="Date"
              type="date"
              value={expenseForm.expenseDate}
              onChange={(e) => setExpenseForm({...expenseForm, expenseDate: e.target.value})}
              width="w-full"
            />
            <SelectBox
              label="Category"
              placeholder="Select category"
              value={expenseForm.categoryId}
              handleChange={(value) => setExpenseForm({...expenseForm, categoryId: value})}
              optionList={categoryOptions.filter(opt => opt.value !== '')}
              width="w-full"
            />
            <SelectBox
              label="Payment Method"
              placeholder="Select payment method"
              value={expenseForm.paymentMethod}
              handleChange={(value) => setExpenseForm({...expenseForm, paymentMethod: value})}
              optionList={paymentMethodOptions}
              width="w-full"
            />
            <div className="flex items-center space-x-3">
              <CheckboxField
                name="isRecurring"
                label="Recurring Expense"
                checked={expenseForm.isRecurring}
                onChange={(e) => setExpenseForm({...expenseForm, isRecurring: e.target.checked})}
                errors={{}}
              />
            </div>
            <InputField
              label="Notes"
              placeholder="Additional notes (optional)"
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
              width="w-full"
            />
          </div>
        }
      />

      {/* Approval Modal */}
      <Modall
        title={approvalAction === 'approve' ? 'Approve Expense' : 'Reject Expense'}
        modalOpen={showApprovalModal}
        setModalOpen={setShowApprovalModal}
        okText={approvalAction === 'approve' ? 'Approve' : 'Reject'}
        cancelText="Cancel"
        okAction={handleApprovalAction}
        cancelAction={() => setShowApprovalModal(false)}
        width={500}
        body={
          <div className="space-y-4">
            {approvingExpense && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{approvingExpense.description}</h4>
                <p className="text-sm text-gray-600">
                  Amount: <span className="font-semibold">${approvingExpense.amount?.toLocaleString()}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(approvingExpense.expenseDate).toLocaleDateString()}
                </p>
              </div>
            )}
            <InputField
              label={approvalAction === 'approve' ? 'Approval Notes' : 'Rejection Reason'}
              placeholder={approvalAction === 'approve' ? 'Add approval notes (optional)' : 'Please provide reason for rejection'}
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              width="w-full"
            />
          </div>
        }
      />
    </Container>
  );
};

export default FinanceExpenses;