import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Plus, Download, Filter, Search, CreditCard, TrendingDown, DollarSign, Calendar, Eye, Edit, Trash2, MoreVertical, ToggleLeft, ToggleRight, Palette, Users, AlertCircle, Target } from 'lucide-react';
import { useExpenseCategory } from '../../Contexts/ExpenseCategoryContext/ExpenseCategoryContext';
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
import Tbody from '../../components/elements/tbody/Tbody';
import TD from '../../components/elements/td/TD';
import Badge from '../../components/elements/Badge/Badge';
import Dropdown from '../../components/elements/dropdown/Dropdown';
import Pagination from '../../components/elements/Pagination/Pagination';
import Modall from '../../components/elements/modal/Modal';
import InputField from '../../components/elements/inputField/InputField';
import CheckboxField from '../../components/elements/checkbox/CheckboxField';

const ExpenseCategories = () => {
  const {
    expenseCategories,
    currentExpenseCategory,
    categoryStatistics,
    recentExpenses,
    loading,
    error,
    pagination,
    filters,
    getExpenseCategories,
    getExpenseCategory,
    createExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    toggleExpenseCategoryStatus,
    getCategoryStatistics,
    searchExpenseCategories,
    filterExpenseCategoriesByStatus,
    changePage,
    changePageSize,
    clearError
  } = useExpenseCategory();

  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    Name: '',
    Description: '',
    Color: '#EF4444',
    IsActive: true // Default to true to avoid null validation error
  });

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Mock performance data for charts (replace with actual API call)
  const [categoryPerformance, setCategoryPerformance] = useState({
    TotalExpenses: 0,
    TopCategory: { Name: 'N/A' },
    CategoryBreakdown: [],
    MonthlyTrends: []
  });

  useEffect(() => {
    getExpenseCategories();
    // Mock performance data - replace with actual API call
    generateMockPerformanceData();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchValue.trim()) {
        searchExpenseCategories(searchValue);
      } else {
        getExpenseCategories();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchValue]);

  // Mock data generator - replace with actual API call
  const generateMockPerformanceData = () => {
    const categories = expenseCategories?.Data?.$values || [];
    const mockBreakdown = categories.slice(0, 6).map((cat, index) => ({
      categoryName: cat.Name,
      totalExpenses: Math.floor(Math.random() * 50000) + 10000,
      color: cat.Color || `#${Math.floor(Math.random()*16777215).toString(16)}`
    }));
    
    const mockMonthlyTrends = [
      { month: 'Jan', Office: 15000, Travel: 8000, Marketing: 12000, Utilities: 5000 },
      { month: 'Feb', Office: 16000, Travel: 9000, Marketing: 11000, Utilities: 5200 },
      { month: 'Mar', Office: 14000, Travel: 12000, Marketing: 15000, Utilities: 4800 },
      { month: 'Apr', Office: 18000, Travel: 7000, Marketing: 13000, Utilities: 5100 },
      { month: 'May', Office: 17000, Travel: 10000, Marketing: 14000, Utilities: 5300 },
      { month: 'Jun', Office: 19000, Travel: 11000, Marketing: 16000, Utilities: 5000 }
    ];

    setCategoryPerformance({
      TotalExpenses: mockBreakdown.reduce((sum, cat) => sum + cat.totalExpenses, 0),
      TopCategory: { Name: mockBreakdown[0]?.categoryName || 'N/A' },
      CategoryBreakdown: mockBreakdown,
      MonthlyTrends: mockMonthlyTrends
    });
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status === '') {
      getExpenseCategories();
    } else {
      filterExpenseCategoriesByStatus(status === 'active');
    }
  };

  const handleAddCategory = async () => {
    try {
      await createExpenseCategory({
        Name: categoryForm.Name,
        Description: categoryForm.Description,
        Color: categoryForm.Color,
        IsActive: categoryForm.IsActive !== null ? categoryForm.IsActive : true // Ensure IsActive is never null
      });
      setShowAddModal(false);
      resetForm();
      getExpenseCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = async () => {
    try {
      if (!editingCategory?.Id) return;
      
      await updateExpenseCategory(editingCategory.Id, {
        Name: categoryForm.Name,
        Description: categoryForm.Description,
        Color: categoryForm.Color,
        IsActive: categoryForm.IsActive !== null ? categoryForm.IsActive : true // Ensure IsActive is never null
      });
      setShowEditModal(false);
      setEditingCategory(null);
      resetForm();
      getExpenseCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense category? This action cannot be undone.')) {
      try {
        await deleteExpenseCategory(id);
        getExpenseCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleExpenseCategoryStatus(id);
      getExpenseCategories();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      Name: category.Name || '',
      Description: category.Description || '',
      Color: category.Color || '#EF4444',
      IsActive: category.IsActive !== undefined ? category.IsActive : true // Ensure IsActive is never undefined
    });
    setShowEditModal(true);
  };

  const openDetailsModal = async (category) => {
    setViewingCategory(category);
    setShowDetailsModal(true);
    await getExpenseCategory(category.Id);
    await getCategoryStatistics(category.Id, dateRange.startDate, dateRange.endDate);
  };

  const resetForm = () => {
    setCategoryForm({
      Name: '',
      Description: '',
      Color: '#EF4444',
      IsActive: true // Reset to true to avoid null validation error
    });
  };

  const statusOptions = [
    { value: '', label: 'All Categories' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' }
  ];

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? 'success' : 'danger'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const categories = expenseCategories?.Data?.$values || [];
  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.IsActive).length;
  const totalExpensesFromCategories = categoryPerformance?.TotalExpenses || 0;
  const topExpenseCategory = categoryPerformance?.TopCategory?.Name || 'N/A';

  if (loading && categories.length === 0) {
    return (
      <Container className="p-6 space-y-6">
        <BodyHeader heading="Expense Categories" subHeading="Manage and organize your expense categories" />
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
        <BodyHeader heading="Expense Categories" subHeading="Manage and organize your expense categories" />
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
            onClick={() => console.log('Export categories')}
          />
          <FilledButton
            icon={Plus}
            isIcon
            isIconLeft
            buttonText="Add Category"
            onClick={() => setShowAddModal(true)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
            </div>
            <div className="p-3 rounded-full bg-red-500">
              <CreditCard size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">{activeCategories}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalExpensesFromCategories.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <DollarSign size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Category</p>
              <p className="text-lg font-bold text-gray-900">{topExpenseCategory}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500">
              <TrendingDown size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <SearchAndFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search categories..."
            />
          </div>
          
          <SelectBox
            placeholder="Filter by Status"
            value={selectedStatus}
            handleChange={handleStatusFilter}
            optionList={statusOptions}
            width="w-full"
          />
          
          <FilledButton
            buttonText="Refresh Data"
            onClick={() => {
              getExpenseCategories();
              generateMockPerformanceData();
            }}
            height="h-10"
          />
        </div>
      </Card>

      {/* Categories Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <Thead className="bg-gray-50">
              <TR>
                <TH>Category</TH>
                <TH>Description</TH>
                <TH>Color</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </Thead>
            <Tbody>
              {categories.map((category) => (
                <TR key={category.Id}>
                  <TD className="font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.Color || '#EF4444' }}
                      />
                      <span>{category.Name}</span>
                    </div>
                  </TD>
                  <TD className="text-gray-600 max-w-xs truncate">
                    {category.Description || 'No description'}
                  </TD>
                  <TD>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded-md border" 
                        style={{ backgroundColor: category.Color || '#EF4444' }}
                      />
                      <span className="text-sm text-gray-500">{category.Color}</span>
                    </div>
                  </TD>
                  <TD>{getStatusBadge(category.IsActive)}</TD>
                  <TD>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(category.Id)}
                        className={`p-1 rounded ${
                          category.IsActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={category.IsActive ? 'Deactivate' : 'Activate'}
                      >
                        {category.IsActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <Dropdown
                        buttonText=""
                        icon={MoreVertical}
                        items={[
                          { label: 'View Details', action: () => openDetailsModal(category) },
                          { label: 'Edit Category', action: () => openEditModal(category) },
                          { label: 'Delete Category', action: () => handleDeleteCategory(category.Id) }
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
        
        {categories.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
            <p>No expense categories found</p>
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={pagination.CurrentPage}
            totalPages={pagination.TotalPages}
            onPageChange={changePage}
          />
        </div>
      </Card>

      {/* Add Category Modal */}
      <Modall
        title="Add New Expense Category"
        modalOpen={showAddModal}
        setModalOpen={setShowAddModal}
        okText="Add Category"
        cancelText="Cancel"
        okAction={handleAddCategory}
        cancelAction={() => setShowAddModal(false)}
        width={600}
        body={
          <div className="space-y-4">
            <InputField
              label="Category Name"
              placeholder="Enter category name"
              value={categoryForm.Name}
              onChange={(e) => setCategoryForm({...categoryForm, Name: e.target.value})}
              width="w-full"
              required
            />
            <InputField
              label="Description"
              placeholder="Enter category description"
              value={categoryForm.Description}
              onChange={(e) => setCategoryForm({...categoryForm, Description: e.target.value})}
              width="w-full"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={categoryForm.Color}
                  onChange={(e) => setCategoryForm({...categoryForm, Color: e.target.value})}
                  className="w-12 h-10 border border-gray-300 rounded-md"
                />
                <InputField
                  placeholder="#EF4444"
                  value={categoryForm.Color}
                  onChange={(e) => setCategoryForm({...categoryForm, Color: e.target.value})}
                  width="w-full"
                />
              </div>
            </div>
            <CheckboxField
              name="IsActive"
              label="Active Category"
              checked={categoryForm.IsActive}
              onChange={(e) => setCategoryForm({...categoryForm, IsActive: e.target.checked})}
              errors={{}}
            />
          </div>
        }
      />

      {/* Edit Category Modal */}
      <Modall
        title="Edit Expense Category"
        modalOpen={showEditModal}
        setModalOpen={setShowEditModal}
        okText="Update Category"
        cancelText="Cancel"
        okAction={handleEditCategory}
        cancelAction={() => setShowEditModal(false)}
        width={600}
        body={
          <div className="space-y-4">
            <InputField
              label="Category Name"
              placeholder="Enter category name"
              value={categoryForm.Name}
              onChange={(e) => setCategoryForm({...categoryForm, Name: e.target.value})}
              width="w-full"
              required
            />
            <InputField
              label="Description"
              placeholder="Enter category description"
              value={categoryForm.Description}
              onChange={(e) => setCategoryForm({...categoryForm, Description: e.target.value})}
              width="w-full"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={categoryForm.Color}
                  onChange={(e) => setCategoryForm({...categoryForm, Color: e.target.value})}
                  className="w-12 h-10 border border-gray-300 rounded-md"
                />
                <InputField
                  placeholder="#EF4444"
                  value={categoryForm.Color}
                  onChange={(e) => setCategoryForm({...categoryForm, Color: e.target.value})}
                  width="w-full"
                />
              </div>
            </div>
            <CheckboxField
              name="IsActive"
              label="Active Category"
              checked={categoryForm.IsActive}
              onChange={(e) => setCategoryForm({...categoryForm, IsActive: e.target.checked})}
              errors={{}}
            />
          </div>
        }
      />

      {/* Category Details Modal */}
      <Modall
        title={`Category Details: ${viewingCategory?.Name || ''}`}
        modalOpen={showDetailsModal}
        setModalOpen={setShowDetailsModal}
        okText="Close"
        cancelText=""
        okAction={() => setShowDetailsModal(false)}
        cancelAction={() => setShowDetailsModal(false)}
        width={800}
        body={
          <div className="space-y-6">
            {currentExpenseCategory && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Category Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: currentExpenseCategory.Color }}
                        />
                        <span className="font-medium">{currentExpenseCategory.Name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{currentExpenseCategory.Description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>Status: {getStatusBadge(currentExpenseCategory.IsActive)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Statistics</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Expenses:</span>
                        <span className="font-semibold text-red-600">
                          ${categoryStatistics?.TotalExpenses?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expense Count:</span>
                        <span className="font-semibold">{categoryStatistics?.ExpenseCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Expense:</span>
                        <span className="font-semibold">
                          ${categoryStatistics?.AverageExpense?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {recentExpenses && recentExpenses.$values && recentExpenses.$values.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recent Expense Records</h4>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {recentExpenses.$values.slice(0, 5).map((expense, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{expense.Description}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(expense.ExpenseDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="font-semibold text-red-600">
                              ${expense.Amount?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        }
      />
    </Container>
  );
};

export default ExpenseCategories;