import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Plus, Download, Filter, Search, TrendingUp, DollarSign, Calendar, Eye, Edit, Trash2, MoreVertical, AlertCircle } from 'lucide-react';

import { useFinanceIncomes } from '../../Contexts/FinanceContext/FinanceIncomeContext';
import { useIncomeCategory } from '../../Contexts/IncomeCategoryContext/IncomeCategoryContext';
import Container from '../../components/elements/container/Container';
import BodyHeader from '../../components/elements/bodyHeader/BodyHeader';
import FilledButton from '../../components/elements/elements/buttons/filledButton/FilledButton';
import Card from '../../components/elements/card/Card';
import SelectBox from '../../components/elements/selectBox/SelectBox';
import InputField from '../../components/elements/inputField/InputField';
import Dropdown from '../../components/elements/dropdown/Dropdown';
import Table from '../../components/elements/table/Table';
import Thead from '../../components/elements/thead/Thead';
import TR from '../../components/elements/tr/TR';
import TH from '../../components/elements/th/TH';
import Tbody from '../../components/elements/tbody/Tbody';
import TD from '../../components/elements/td/TD';
import Badge from '../../components/elements/Badge/Badge';
import Pagination from '../../components/elements/Pagination/Pagination';
import Modall from '../../components/elements/modal/Modal';
import OutlineButton from '../../components/elements/elements/buttons/OutlineButton/OutlineButton';
import SearchAndFilters from '../../components/elements/searchAndFilters/SearchAndFilters';
import Skeleton from '../../components/elements/skeleton/Skeleton';

const FinanceIncome = () => {
  // Finance Income Context
  const {
    incomes,
    statistics,
    comparison,
    pagination,
    filters,
    loading,
    error,
    getIncomes,
    getIncomeStatistics,
    getIncomeVsExpenseComparison,
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

  // Income Category Context
  const {
    incomeCategories,
    loading: categoriesLoading,
    error: categoriesError,
    getIncomeCategories,
    getIncomeCategoriesDropdown,
    getActiveIncomeCategories
  } = useIncomeCategory();

  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
    // Load both income data and categories
    const loadData = async () => {
      try {
        console.log("Loading income data and categories...");
        await getIncomes();
        await getIncomeStatistics();
        await getIncomeVsExpenseComparison();
        await getIncomeCategories(); // Load income categories from IncomeCategoryContext
        console.log("Data loading completed");
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, []);

  // Debug useEffect to monitor category changes
  useEffect(() => {
    console.log("Categories updated:", incomeCategories);
    console.log("Categories loading:", categoriesLoading);
    console.log("Categories error:", categoriesError);
  }, [incomeCategories, categoriesLoading, categoriesError]);

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

  // Get categories for dropdown from IncomeCategoryContext
  const getCategoryOptions = () => {
    const activeCategories = getActiveIncomeCategories();
    return [
      { value: '', label: 'All Categories' },
      ...activeCategories.map(cat => ({ 
        value: cat.Id, 
        label: cat.Name,
        color: cat.Color 
      }))
    ];
  };

  // Get categories for form selection (excluding "All Categories" option)
  const getFormCategoryOptions = () => {
    const activeCategories = getActiveIncomeCategories();
    return activeCategories.map(cat => ({ 
      value: cat.Id, 
      label: cat.Name,
      color: cat.Color 
    }));
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId) => {
    const activeCategories = getActiveIncomeCategories();
    const category = activeCategories.find(cat => cat.Id === categoryId);
    return category ? category.Name : 'Uncategorized';
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!incomeForm.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!incomeForm.amount || parseFloat(incomeForm.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!incomeForm.incomeDate) {
      errors.incomeDate = 'Date is required';
    }
    
    if (!incomeForm.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    if (!incomeForm.paymentMethod) {
      errors.paymentMethod = 'Payment method is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createIncome(incomeForm);
      setShowAddModal(false);
      resetForm();
      await getIncomes();
      console.log('Income added successfully!');
    } catch (error) {
      console.error('Error adding income:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditIncome = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateIncome(editingIncome.id, incomeForm);
      setShowEditModal(false);
      setEditingIncome(null);
      resetForm();
      await getIncomes();
      console.log('Income updated successfully!');
    } catch (error) {
      console.error('Error updating income:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await deleteIncome(id);
        await getIncomes();
        console.log('Income deleted successfully!');
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
    setFormErrors({});
    setShowEditModal(true);
  };

  const resetForm = () => {
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
    setFormErrors({});
  };

  const handleModalClose = (modalType) => {
    if (modalType === 'add') {
      setShowAddModal(false);
    } else if (modalType === 'edit') {
      setShowEditModal(false);
      setEditingIncome(null);
    }
    resetForm();
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' }
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
      {/* Error Display */}
      {(error || categoriesError) && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle size={20} />
            <span className="font-medium">Error:</span>
            <span>{error || categoriesError}</span>
          </div>
        </Card>
      )}

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
            optionList={getCategoryOptions()}
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
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: income.categoryColor || '#6B7280' }}
                      />
                      <Badge variant="info">
                        {income.categoryName || getCategoryNameById(income.categoryId)}
                      </Badge>
                    </div>
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
        setModalOpen={() => handleModalClose('add')}
        okText={isSubmitting ? "Adding..." : "Add Income"}
        cancelText="Cancel"
        okAction={handleAddIncome}
        cancelAction={() => handleModalClose('add')}
        okDisabled={isSubmitting}
        width={600}
        body={
          <div className="space-y-4">
            <div>
              <InputField
                label="Description *"
                placeholder="Enter income description"
                value={incomeForm.description}
                onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                width="w-full"
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>

            <div>
              <InputField
                label="Amount *"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                width="w-full"
              />
              {formErrors.amount && (
                <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
              )}
            </div>

            <div>
              <InputField
                label="Date *"
                type="date"
                value={incomeForm.incomeDate}
                onChange={(e) => setIncomeForm({...incomeForm, incomeDate: e.target.value})}
                width="w-full"
              />
              {formErrors.incomeDate && (
                <p className="text-red-500 text-sm mt-1">{formErrors.incomeDate}</p>
              )}
            </div>

            <div>
              <SelectBox
                label="Category *"
                placeholder={categoriesLoading ? "Loading categories..." : "Select category"}
                value={incomeForm.categoryId}
                handleChange={(value) => setIncomeForm({...incomeForm, categoryId: value})}
                optionList={categoriesLoading ? [] : getFormCategoryOptions()}
                width="w-full"
                disabled={categoriesLoading}
              />
              {formErrors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>
              )}
              {categoriesLoading && (
                <p className="text-blue-500 text-sm mt-1">Loading categories...</p>
              )}
              {!categoriesLoading && getFormCategoryOptions().length === 0 && (
                <p className="text-yellow-600 text-sm mt-1">No active categories found. Please create categories first.</p>
              )}
            </div>

            <div>
              <SelectBox
                label="Payment Method *"
                placeholder="Select payment method"
                value={incomeForm.paymentMethod}
                handleChange={(value) => setIncomeForm({...incomeForm, paymentMethod: value})}
                optionList={paymentMethodOptions}
                width="w-full"
              />
              {formErrors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">{formErrors.paymentMethod}</p>
              )}
            </div>

            <InputField
              label="Notes"
              placeholder="Additional notes (optional)"
              value={incomeForm.notes}
              onChange={(e) => setIncomeForm({...incomeForm, notes: e.target.value})}
              width="w-full"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* Edit Income Modal */}
      <Modall
        title="Edit Income"
        modalOpen={showEditModal}
        setModalOpen={() => handleModalClose('edit')}
        okText={isSubmitting ? "Updating..." : "Update Income"}
        cancelText="Cancel"
        okAction={handleEditIncome}
        cancelAction={() => handleModalClose('edit')}
        okDisabled={isSubmitting}
        width={600}
        body={
          <div className="space-y-4">
            <div>
              <InputField
                label="Description *"
                placeholder="Enter income description"
                value={incomeForm.description}
                onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                width="w-full"
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>

            <div>
              <InputField
                label="Amount *"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                width="w-full"
              />
              {formErrors.amount && (
                <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
              )}
            </div>

            <div>
              <InputField
                label="Date *"
                type="date"
                value={incomeForm.incomeDate}
                onChange={(e) => setIncomeForm({...incomeForm, incomeDate: e.target.value})}
                width="w-full"
              />
              {formErrors.incomeDate && (
                <p className="text-red-500 text-sm mt-1">{formErrors.incomeDate}</p>
              )}
            </div>

            <div>
              <SelectBox
                label="Category *"
                placeholder={categoriesLoading ? "Loading categories..." : "Select category"}
                value={incomeForm.categoryId}
                handleChange={(value) => setIncomeForm({...incomeForm, categoryId: value})}
                optionList={categoriesLoading ? [] : getFormCategoryOptions()}
                width="w-full"
                disabled={categoriesLoading}
              />
              {formErrors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>
              )}
              {categoriesLoading && (
                <p className="text-blue-500 text-sm mt-1">Loading categories...</p>
              )}
              {!categoriesLoading && getFormCategoryOptions().length === 0 && (
                <p className="text-yellow-600 text-sm mt-1">No active categories found. Please create categories first.</p>
              )}
            </div>

            <div>
              <SelectBox
                label="Payment Method *"
                placeholder="Select payment method"
                value={incomeForm.paymentMethod}
                handleChange={(value) => setIncomeForm({...incomeForm, paymentMethod: value})}
                optionList={paymentMethodOptions}
                width="w-full"
              />
              {formErrors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">{formErrors.paymentMethod}</p>
              )}
            </div>

            <InputField
              label="Notes"
              placeholder="Additional notes (optional)"
              value={incomeForm.notes}
              onChange={(e) => setIncomeForm({...incomeForm, notes: e.target.value})}
              width="w-full"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>
        }
      />
    </Container>
  );
};

export default FinanceIncome;