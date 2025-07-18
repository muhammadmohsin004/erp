import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Plus, Download, Filter, Search, Tag, TrendingUp, DollarSign, Calendar, Eye, Edit, Trash2, MoreVertical, ToggleLeft, ToggleRight, Palette, Users } from 'lucide-react';
import { useIncomeCategory } from '../../Contexts/IncomeCategoryContext/IncomeCategoryContext';
import Badge from '../../components/elements/Badge/Badge';
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
import Tbody from '../../components/elements/tbody/Tbody';
import Dropdown from '../../components/elements/dropdown/Dropdown';
import Pagination from '../../components/elements/Pagination/Pagination';
import Modall from '../../components/elements/modal/Modal';
import InputField from '../../components/elements/inputField/InputField';
import CheckboxField from '../../components/elements/checkbox/CheckboxField';

const IncomeCategories = () => {
  const {
    incomeCategories,
    currentIncomeCategory,
    categoryStatistics,
    categoryPerformance,
    recentIncomes,
    loading,
    error,
    pagination,
    filters,
    getIncomeCategories,
    getIncomeCategory,
    createIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
    toggleIncomeCategoryStatus,
    getCategoryStatistics,
    getCategoryPerformance,
    searchIncomeCategories,
    filterIncomeCategoriesByStatus,
    changePage,
    changePageSize,
    clearError
  } = useIncomeCategory();

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
    Color: '#3B82F6',
    Icon: '',
    IsActive: true,
    DisplayOrder: 0
  });

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    getIncomeCategories();
    getCategoryPerformance();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchValue.trim()) {
        searchIncomeCategories(searchValue);
      } else {
        getIncomeCategories();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchValue]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status === '') {
      getIncomeCategories();
    } else {
      filterIncomeCategoriesByStatus(status === 'active');
    }
  };

  const handleAddCategory = async () => {
    try {
      await createIncomeCategory(categoryForm);
      setShowAddModal(false);
      resetForm();
      getIncomeCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = async () => {
    try {
      await updateIncomeCategory(editingCategory.Id, categoryForm);
      setShowEditModal(false);
      setEditingCategory(null);
      resetForm();
      getIncomeCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteIncomeCategory(id);
        getIncomeCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleIncomeCategoryStatus(id);
      getIncomeCategories();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      Name: category.Name || '',
      Description: category.Description || '',
      Color: category.Color || '#3B82F6',
      Icon: category.Icon || '',
      IsActive: category.IsActive || true,
      DisplayOrder: category.DisplayOrder || 0
    });
    setShowEditModal(true);
  };

  const openDetailsModal = async (category) => {
    setViewingCategory(category);
    setShowDetailsModal(true);
    await getIncomeCategory(category.Id);
    await getCategoryStatistics(category.Id, dateRange.startDate, dateRange.endDate);
  };

  const resetForm = () => {
    setCategoryForm({
      Name: '',
      Description: '',
      Color: '#3B82F6',
      Icon: '',
      IsActive: true,
      DisplayOrder: 0
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

  const categories = incomeCategories?.Data || [];
  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.IsActive).length;
  const totalIncomeFromCategories = categoryPerformance?.TotalIncome || 0;
  const topPerformingCategory = categoryPerformance?.TopCategory?.Name || 'N/A';

  if (loading && categories.length === 0) {
    return (
      <Container className="p-6 space-y-6">
        <BodyHeader heading="Income Categories" subHeading="Manage and organize your income categories" />
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
        <BodyHeader heading="Income Categories" subHeading="Manage and organize your income categories" />
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
            <div className="p-3 rounded-full bg-blue-500">
              <Tag size={24} className="text-white" />
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
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalIncomeFromCategories.toLocaleString()}
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
              <p className="text-lg font-bold text-gray-900">{topPerformingCategory}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance?.CategoryBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoryName" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Income']} />
              <Bar dataKey="totalIncome" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryPerformance?.CategoryBreakdown || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="totalIncome"
              >
                {(categoryPerformance?.CategoryBreakdown || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Income']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income Trends by Category</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={categoryPerformance?.MonthlyTrends || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Income']} />
            {(categoryPerformance?.CategoryBreakdown || []).map((category, index) => (
              <Line
                key={category.categoryName}
                type="monotone"
                dataKey={category.categoryName}
                stroke={category.color || COLORS[index % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

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
              getIncomeCategories();
              getCategoryPerformance();
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
                <TH>Total Income</TH>
                <TH>Income Count</TH>
                <TH>Status</TH>
                <TH>Display Order</TH>
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
                        style={{ backgroundColor: category.Color || '#3B82F6' }}
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
                        style={{ backgroundColor: category.Color || '#3B82F6' }}
                      />
                      <span className="text-sm text-gray-500">{category.Color}</span>
                    </div>
                  </TD>
                  <TD className="font-semibold text-green-600">
                    ${category.TotalIncome?.toLocaleString() || '0'}
                  </TD>
                  <TD className="text-center">
                    <Badge variant="info">{category.IncomeCount || 0}</Badge>
                  </TD>
                  <TD>{getStatusBadge(category.IsActive)}</TD>
                  <TD className="text-center">{category.DisplayOrder || 0}</TD>
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
        
        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Tag size={48} className="mx-auto mb-4 opacity-50" />
            <p>No income categories found</p>
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
        title="Add New Income Category"
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
            />
            <InputField
              label="Description"
              placeholder="Enter category description"
              value={categoryForm.Description}
              onChange={(e) => setCategoryForm({...categoryForm, Description: e.target.value})}
              width="w-full"
            />
            <div className="grid grid-cols-2 gap-4">
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
                    placeholder="#3B82F6"
                    value={categoryForm.Color}
                    onChange={(e) => setCategoryForm({...categoryForm, Color: e.target.value})}
                    width="w-full"
                  />
                </div>
              </div>
              <InputField
                label="Display Order"
                type="number"
                placeholder="0"
                value={categoryForm.DisplayOrder}
                onChange={(e) => setCategoryForm({...categoryForm, DisplayOrder: parseInt(e.target.value) || 0})}
                width="w-full"
              />
            </div>
            <InputField
              label="Icon (Optional)"
              placeholder="Icon name or unicode"
              value={categoryForm.Icon}
              onChange={(e) => setCategoryForm({...categoryForm, Icon: e.target.value})}
              width="w-full"
            />
            <div className="flex items-center space-x-3">
              <CheckboxField
                name="IsActive"
                label="Active Category"
                checked={categoryForm.IsActive}
                onChange={(e) => setCategoryForm({...categoryForm, IsActive: e.target.checked})}
                errors={{}}
              />
            </div>
          </div>
        }
      />

      {/* Edit Category Modal */}
      <Modall
        title="Edit Income Category"
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
            />
            <InputField
              label="Description"
              placeholder="Enter category description"
              value={categoryForm.Description}
              onChange={(e) => setCategoryForm({...categoryForm, Description: e.target.value})}
              width="w-full"
            />
            <div className="grid grid-cols-2 gap-4">
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
                    placeholder="#3B82F6"
                    value={categoryForm.Color}
                    onChange={(e) => setCategoryForm({...categoryForm, Color: e.target.value})}
                    width="w-full"
                  />
                </div>
              </div>
              <InputField
                label="Display Order"
                type="number"
                placeholder="0"
                value={categoryForm.DisplayOrder}
                onChange={(e) => setCategoryForm({...categoryForm, DisplayOrder: parseInt(e.target.value) || 0})}
                width="w-full"
              />
            </div>
            <InputField
              label="Icon (Optional)"
              placeholder="Icon name or unicode"
              value={categoryForm.Icon}
              onChange={(e) => setCategoryForm({...categoryForm, Icon: e.target.value})}
              width="w-full"
            />
            <div className="flex items-center space-x-3">
              <CheckboxField
                name="IsActive"
                label="Active Category"
                checked={categoryForm.IsActive}
                onChange={(e) => setCategoryForm({...categoryForm, IsActive: e.target.checked})}
                errors={{}}
              />
            </div>
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
            {currentIncomeCategory && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Category Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: currentIncomeCategory.Color }}
                        />
                        <span className="font-medium">{currentIncomeCategory.Name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{currentIncomeCategory.Description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>Status: {getStatusBadge(currentIncomeCategory.IsActive)}</span>
                        <span>Order: {currentIncomeCategory.DisplayOrder}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Statistics</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Income:</span>
                        <span className="font-semibold text-green-600">
                          ${categoryStatistics?.TotalIncome?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Income Count:</span>
                        <span className="font-semibold">{categoryStatistics?.IncomeCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Income:</span>
                        <span className="font-semibold">
                          ${categoryStatistics?.AverageIncome?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {recentIncomes && recentIncomes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recent Income Records</h4>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {recentIncomes.slice(0, 5).map((income, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{income.Description}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(income.IncomeDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="font-semibold text-green-600">
                              ${income.Amount?.toLocaleString()}
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

export default IncomeCategories;