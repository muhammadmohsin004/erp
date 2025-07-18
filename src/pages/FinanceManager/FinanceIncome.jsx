
import React, { useEffect, useState } from 'react';
import { useFinanceIncomes } from '../contexts/FinanceIncomesContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Plus, Download, Filter, Search, TrendingUp, DollarSign, Calendar, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
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

const FinanceIncome = () => {
  const {
    incomes,
    statistics,
    comparison,
    categories,
    pagination,
    filters,
    loading,
    error,
    getIncomes,
    getIncomeStatistics,
    getIncomeVsExpenseComparison,
    getIncomeCategories,
    createIncome,
    updateIncome,
    deleteIncome,
    searchIncomes,
    filterByStatus,
    filterByCategory,
    filterByDateRange,
    changePage,
    changePageSize
  } = useFinanceIncomes();

  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [incomeForm, setIncomeForm] = useState({
    description: '',
    amount: '',
    incomeDate: '',
    categoryId: '',
    customerId: '',
    paymentMethod: '',
    isRecurring: false,
    notes: ''
  });

  useEffect(() => {
    getIncomes();
    getIncomeStatistics();
    getIncomeVsExpenseComparison();
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
    try {
      await createIncome(incomeForm);
      setShowAddModal(false);
      setIncomeForm({
        description: '',
        amount: '',
        incomeDate: '',
        categoryId: '',
        customerId: '',
        paymentMethod: '',
        isRecurring: false,
        notes: ''
      });
      getIncomes();
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleEditIncome = async () => {
    try {
      await updateIncome(editingIncome.id, incomeForm);
      setShowEditModal(false);
      setEditingIncome(null);
      setIncomeForm({
        description: '',
        amount: '',
        incomeDate: '',
        categoryId: '',
        customerId: '',
        paymentMethod: '',
        isRecurring: false,
        notes: ''
      });
      getIncomes();
    } catch (error) {
      console.error('Error updating income:', error);
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await deleteIncome(id);
        getIncomes();
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  const openEditModal = (income) => {
    setEditingIncome(income);
    setIncomeForm({
      description: income.description || '',
      amount: income.amount || '',
      incomeDate: income.incomeDate || '',
      categoryId: income.categoryId || '',
      customerId: income.customerId || '',
      paymentMethod: income.paymentMethod || '',
      isRecurring: income.isRecurring || false,
      notes: income.notes || ''
    });
    setShowEditModal(true);
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  const paymentMethodOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Check', label: 'Check' },
    { value: 'Digital Wallet', label: 'Digital Wallet' }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'Confirmed': 'success',
      'Pending': 'warning',
      'Cancelled': 'danger'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading && incomes.length === 0) {
    return (
      <Container className="p-6 space-y-6">
        <BodyHeader heading="Income Management" subHeading="Track and manage your income sources" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
        <BodyHeader heading="Income Management" subHeading="Track and manage your income sources" />
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
            buttonText="Add Income"
            onClick={() => setShowAddModal(true)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${statistics?.totalIncome?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <DollarSign size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                ${statistics?.monthlyIncome?.toLocaleString() || '0'}
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
              <p className="text-sm font-medium text-gray-600">Average Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${statistics?.averageIncome?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics?.growthRate ? `${statistics.growthRate}%` : '0%'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-indigo-500">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparison?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Amount']} />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h3>
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

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-2">
            <SearchAndFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search income records..."
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

      {/* Income Table */}
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
              {incomes.map((income) => (
                <TR key={income.id}>
                  <TD className="font-medium text-gray-900">{income.description}</TD>
                  <TD className="font-semibold text-green-600">
                    ${income.amount?.toLocaleString()}
                  </TD>
                  <TD>{new Date(income.incomeDate).toLocaleDateString()}</TD>
                  <TD>
                    <Badge variant="info">{income.categoryName || 'Uncategorized'}</Badge>
                  </TD>
                  <TD>{income.paymentMethod}</TD>
                  <TD>{getStatusBadge(income.status)}</TD>
                  <TD>
                    <Dropdown
                      buttonText=""
                      icon={MoreVertical}
                      items={[
                        { label: 'View Details', action: () => console.log('View', income.id) },
                        { label: 'Edit', action: () => openEditModal(income) },
                        { label: 'Delete', action: () => handleDeleteIncome(income.id) }
                      ]}
                      onSelect={(item) => item.action()}
                      buttonClassName="p-2 rounded-md hover:bg-gray-100"
                    />
                  </TD>
                </TR>
              ))}
            </Tbody>
          </Table>
        </div>
        
        {incomes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
            <p>No income records found</p>
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

      {/* Add Income Modal */}
      <Modall
        title="Add New Income"
        modalOpen={showAddModal}
        setModalOpen={setShowAddModal}
        okText="Add Income"
        cancelText="Cancel"
        okAction={handleAddIncome}
        cancelAction={() => setShowAddModal(false)}
        width={600}
        body={
          <div className="space-y-4">
            <InputField
              label="Description"
              placeholder="Enter income description"
              value={incomeForm.description}
              onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
              width="w-full"
            />
            <InputField
              label="Amount"
              type="number"
              placeholder="Enter amount"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
              width="w-full"
            />
            <InputField
              label="Date"
              type="date"
              value={incomeForm.incomeDate}
              onChange={(e) => setIncomeForm({...incomeForm, incomeDate: e.target.value})}
              width="w-full"
            />
            <SelectBox
              label="Category"
              placeholder="Select category"
              value={incomeForm.categoryId}
              handleChange={(value) => setIncomeForm({...incomeForm, categoryId: value})}
              optionList={categoryOptions.filter(opt => opt.value !== '')}
              width="w-full"
            />
            <SelectBox
              label="Payment Method"
              placeholder="Select payment method"
              value={incomeForm.paymentMethod}
              handleChange={(value) => setIncomeForm({...incomeForm, paymentMethod: value})}
              optionList={paymentMethodOptions}
              width="w-full"
            />
            <InputField
              label="Notes"
              placeholder="Additional notes (optional)"
              value={incomeForm.notes}
              onChange={(e) => setIncomeForm({...incomeForm, notes: e.target.value})}
              width="w-full"
            />
          </div>
        }
      />

      {/* Edit Income Modal */}
      <Modall
        title="Edit Income"
        modalOpen={showEditModal}
        setModalOpen={setShowEditModal}
        okText="Update Income"
        cancelText="Cancel"
        okAction={handleEditIncome}
        cancelAction={() => setShowEditModal(false)}
        width={600}
        body={
          <div className="space-y-4">
            <InputField
              label="Description"
              placeholder="Enter income description"
              value={incomeForm.description}
              onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
              width="w-full"
            />
            <InputField
              label="Amount"
              type="number"
              placeholder="Enter amount"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
              width="w-full"
            />
            <InputField
              label="Date"
              type="date"
              value={incomeForm.incomeDate}
              onChange={(e) => setIncomeForm({...incomeForm, incomeDate: e.target.value})}
              width="w-full"
            />
            <SelectBox
              label="Category"
              placeholder="Select category"
              value={incomeForm.categoryId}
              handleChange={(value) => setIncomeForm({...incomeForm, categoryId: value})}
              optionList={categoryOptions.filter(opt => opt.value !== '')}
              width="w-full"
            />
            <SelectBox
              label="Payment Method"
              placeholder="Select payment method"
              value={incomeForm.paymentMethod}
              handleChange={(value) => setIncomeForm({...incomeForm, paymentMethod: value})}
              optionList={paymentMethodOptions}
              width="w-full"
            />
            <InputField
              label="Notes"
              placeholder="Additional notes (optional)"
              value={incomeForm.notes}
              onChange={(e) => setIncomeForm({...incomeForm, notes: e.target.value})}
              width="w-full"
            />
          </div>
        }
      />
    </Container>
  );
};

export default FinanceIncome;
