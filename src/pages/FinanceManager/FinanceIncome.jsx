import React, { useEffect, useState, useRef } from 'react';
import { 
  Plus, Search, Calendar, 
  Eye, Edit, Trash2, MoreVertical, AlertCircle,
  CreditCard, Banknote, Smartphone, 
  RefreshCw, FileText, X, Filter
} from 'lucide-react';

// Import your real contexts
import { useFinanceIncomes } from '../../Contexts/FinanceContext/FinanceIncomeContext';
import { useIncomeCategory } from '../../Contexts/IncomeCategoryContext/IncomeCategoryContext';

// Simple UI Components
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", size = "md", icon: Icon, disabled, className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

const Input = ({ label, error, className = "", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-300' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const Select = ({ label, error, children, className = "", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
          {footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

const Dropdown = ({ trigger, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 ${className}`}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

// Main Component
const FinanceIncome = () => {
  // Finance Income Context
  const {
    incomes,
    statistics,
    pagination,
    filters,
    loading,
    error,
    getIncomes,
    getIncomeStatistics,
    createIncome,
    updateIncome,
    deleteIncome,
    searchIncomes,
    filterByStatus,
    filterByCategory,
    filterByDateRange,
    changePage,
    resetFilters
  } = useFinanceIncomes();

  // Income Category Context
  const {
    getActiveIncomeCategories
  } = useIncomeCategory();

  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('Custom');
  const [selectedSortBy, setSelectedSortBy] = useState('Date (Newest First)');
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
    const loadData = async () => {
      try {
        await getIncomes();
        await getIncomeStatistics();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, []);

  // Helper function to safely get incomes array
  const getIncomesArray = () => {
    if (Array.isArray(incomes)) {
      return incomes;
    }
    if (incomes?.Data?.$values) {
      return incomes.Data.$values;
    }
    if (incomes?.$values) {
      return incomes.$values;
    }
    return [];
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

  const handleSearch = () => {
    if (searchValue.trim()) {
      searchIncomes(searchValue);
    } else {
      getIncomes();
    }
  };

  const handleReset = () => {
    setSearchValue('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedDateRange('Custom');
    setSelectedSortBy('Date (Newest First)');
    setDateRange({ start: '', end: '' });
    resetFilters();
    getIncomes();
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      filterByCategory(categoryId);
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status) {
      filterByStatus(status);
    }
  };

  const handleDateRangeFilter = () => {
    if (dateRange.start && dateRange.end) {
      filterByDateRange(dateRange.start, dateRange.end);
    }
  };

  const handleSortChange = (sortOption) => {
    setSelectedSortBy(sortOption);
    // You can implement sorting logic here based on the selected option
  };

  const handleAddIncome = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createIncome(incomeForm);
      setShowAddModal(false);
      resetForm();
      await getIncomes();
    } catch (error) {
      console.error('Error adding income:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditIncome = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateIncome(editingIncome.Id, incomeForm);
      setShowEditModal(false);
      setEditingIncome(null);
      resetForm();
      await getIncomes();
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
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  const openEditModal = (income) => {
    setEditingIncome(income);
    setIncomeForm({
      description: income.Description || '',
      amount: income.Amount || '',
      incomeDate: income.IncomeDate ? income.IncomeDate.split('T')[0] : '',
      categoryId: income.CategoryId || '',
      customerId: income.CustomerId || '',
      paymentMethod: income.PaymentMethod || '',
      isRecurring: income.IsRecurring || false,
      notes: income.Notes || ''
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

  const getStatusBadge = (status) => {
    const variants = {
      'Received': 'success',
      'Pending': 'warning',
      'Cancelled': 'danger',
      'Confirmed': 'success'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'Cash': Banknote,
      'Bank Transfer': CreditCard,
      'Credit Card': CreditCard,
      'Digital Wallet': Smartphone,
      'Check': FileText
    };
    const Icon = icons[method] || CreditCard;
    return <Icon className="w-4 h-4" />;
  };

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'Received', label: 'Received' },
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

  const dateRangeOptions = [
    { value: 'Custom', label: 'Custom' },
    { value: 'Today', label: 'Today' },
    { value: 'Week', label: 'This Week' },
    { value: 'Month', label: 'This Month' }
  ];

  const sortOptions = [
    'Date (Newest First)',
    'Date (Oldest First)',
    'Amount (High to Low)',
    'Amount (Low to High)'
  ];

  const incomesList = getIncomesArray();

  if (loading && incomesList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Statistics Cards - Simple 3 column layout like your reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-600 text-black">
            <div className="p-6">
              <h3 className="text-sm font-medium opacity-90">Last 7 Days</h3>
              <p className="text-2xl font-bold mt-2">
                Rs. {statistics?.last7Days?.toLocaleString() || '0'}
              </p>
            </div>
          </Card>
          
          <Card className="bg-blue-600 text-black">
            <div className="p-6">
              <h3 className="text-sm font-medium opacity-90">Last 30 Days</h3>
              <p className="text-2xl font-bold mt-2">
                Rs. {statistics?.last30Days?.toLocaleString() || '0'}
              </p>
            </div>
          </Card>
          
          <Card className="bg-blue-600 text-black">
            <div className="p-6">
              <h3 className="text-sm font-medium opacity-90">Last 365 Days</h3>
              <p className="text-2xl font-bold mt-2">
                Rs. {statistics?.last365Days?.toLocaleString() || '0'}
              </p>
            </div>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <Input
                type="text"
                placeholder="Search by code..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="flex space-x-2">
                <Select 
                  value={selectedDateRange} 
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="text-sm"
                >
                  {dateRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
                <Input
                  type="date"
                  placeholder="From"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="text-sm"
                />
                <Input
                  type="date"
                  placeholder="To"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
              >
                <option value="">Any category</option>
                {getActiveIncomeCategories()?.map(cat => (
                  <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={selectedStatus}
                onChange={(e) => handleStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button icon={Filter} onClick={() => {
              handleSearch();
              handleDateRangeFilter();
            }}>
              Advanced Search
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button 
              variant="success" 
              icon={Search}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Results</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Sort By: 
                  <select 
                    className="ml-2 text-sm border-gray-300 rounded"
                    value={selectedSortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    {sortOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </p>
              </div>
              <Button icon={Plus} onClick={() => setShowAddModal(true)}>
                Add Income
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code & Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomesList.map((income) => (
                  <tr key={income.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {income.CodeNumber} - {new Date(income.IncomeDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{income.Description}</div>
                      {income.Notes && <div className="text-xs text-gray-500">{income.Notes}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">
                        {income.CategoryName || getCategoryNameById(income.CategoryId)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        Rs. {income.Amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(income.Status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Dropdown
                        trigger={<MoreVertical className="w-4 h-4 text-gray-400" />}
                      >
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => console.log('View', income.Id)}
                          role="menuitem"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => openEditModal(income)}
                          role="menuitem"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteIncome(income.Id)}
                          role="menuitem"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {incomesList.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No income records found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search criteria or add a new income record.</p>
                <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                  Add Income
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {incomesList.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                Showing {((pagination?.CurrentPage - 1) * pagination?.PageSize) + 1} to{' '}
                {Math.min(pagination?.CurrentPage * pagination?.PageSize, pagination?.TotalItems)} of{' '}
                {pagination?.TotalItems} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination?.CurrentPage === 1}
                  onClick={() => changePage(pagination?.CurrentPage - 1)}
                >
                  Previous
                </Button>
                {[...Array(Math.min(5, pagination?.TotalPages || 1))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={pagination?.CurrentPage === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => changePage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination?.CurrentPage === pagination?.TotalPages}
                  onClick={() => changePage(pagination?.CurrentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Add Income Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Income"
          footer={
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddIncome} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Income'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Description *"
              placeholder="Enter income description"
              value={incomeForm.description}
              onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
              error={formErrors.description}
            />

            <Input
              label="Amount *"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
              error={formErrors.amount}
            />

            <Input
              label="Date *"
              type="date"
              value={incomeForm.incomeDate}
              onChange={(e) => setIncomeForm({...incomeForm, incomeDate: e.target.value})}
              error={formErrors.incomeDate}
            />

            <Select
              label="Category *"
              value={incomeForm.categoryId}
              onChange={(e) => setIncomeForm({...incomeForm, categoryId: e.target.value})}
              error={formErrors.categoryId}
            >
              <option value="">Select category</option>
              {getActiveIncomeCategories()?.map(cat => (
                <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
              ))}
            </Select>

            <Select
              label="Payment Method *"
              value={incomeForm.paymentMethod}
              onChange={(e) => setIncomeForm({...incomeForm, paymentMethod: e.target.value})}
              error={formErrors.paymentMethod}
            >
              <option value="">Select payment method</option>
              {paymentMethodOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>

            <Input
              label="Notes"
              placeholder="Additional notes (optional)"
              value={incomeForm.notes}
              onChange={(e) => setIncomeForm({...incomeForm, notes: e.target.value})}
            />
          </div>
        </Modal>

        {/* Edit Income Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Income"
          footer={
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditIncome} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Income'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Description *"
              placeholder="Enter income description"
              value={incomeForm.description}
              onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
              error={formErrors.description}
            />

            <Input
              label="Amount *"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
              error={formErrors.amount}
            />

            <Input
              label="Date *"
              type="date"
              value={incomeForm.incomeDate}
              onChange={(e) => setIncomeForm({...incomeForm, incomeDate: e.target.value})}
              error={formErrors.incomeDate}
            />

            <Select
              label="Category *"
              value={incomeForm.categoryId}
              onChange={(e) => setIncomeForm({...incomeForm, categoryId: e.target.value})}
              error={formErrors.categoryId}
            >
              <option value="">Select category</option>
              {getActiveIncomeCategories()?.map(cat => (
                <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
              ))}
            </Select>

            <Select
              label="Payment Method *"
              value={incomeForm.paymentMethod}
              onChange={(e) => setIncomeForm({...incomeForm, paymentMethod: e.target.value})}
              error={formErrors.paymentMethod}
            >
              <option value="">Select payment method</option>
              {paymentMethodOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>

            <Input
              label="Notes"
              placeholder="Additional notes (optional)"
              value={incomeForm.notes}
              onChange={(e) => setIncomeForm({...incomeForm, notes: e.target.value})}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FinanceIncome;