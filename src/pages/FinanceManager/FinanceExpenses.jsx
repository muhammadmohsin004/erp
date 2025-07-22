import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Plus, Search, Eye, Edit, Trash2, MoreVertical, AlertCircle,
  CreditCard, Banknote, Smartphone, RefreshCw, FileText, X, Filter, 
  CheckCircle, XCircle, Info, AlertTriangle, Download, Printer,
  ArrowLeft, Copy, ChevronDown, Mail
} from 'lucide-react';

import { useFinanceExpenses } from '../../Contexts/FinanceContext/FinanceExpensesContext';
import { useExpenseCategory } from '../../Contexts/ExpenseCategoryContext/ExpenseCategoryContext';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
  
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg border ${colors[type]} p-4`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const ToastContainer = useCallback(() => (
    <>
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </>
  ), [toasts, removeToast]);

  return { showToast, ToastContainer };
};

// UI Components
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", size = "md", icon: Icon, disabled, className = "", loading, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500"
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : (Icon && <Icon className="w-4 h-4 mr-2" />)}
      {children}
    </button>
  );
};

const Input = ({ label, error, className = "", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-600 flex items-center mt-1"><AlertCircle className="w-4 h-4 mr-1" />{error}</p>}
  </div>
);

const Select = ({ label, error, children, className = "", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select
      className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-sm text-red-600 flex items-center mt-1"><AlertCircle className="w-4 h-4 mr-1" />{error}</p>}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children, footer, size = "lg" }) => {
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl", full: "max-w-7xl" };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} transform transition-all duration-200 max-h-[90vh] flex flex-col`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">{children}</div>
          {footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex-shrink-0">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

const Dropdown = ({ trigger, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1 ${className}`}>
          {children}
        </div>
      )}
    </div>
  );
};

// Expense Details Page
const ExpenseDetailsPage = ({ expenseId, onBack, onEdit, onDelete, onClone }) => {
  const { showToast, ToastContainer } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [detailsLoaded, setDetailsLoaded] = useState(false); // Prevent multiple loads
  const { currentExpense, loading, error, getExpense, deleteExpense, createExpense } = useFinanceExpenses();

  useEffect(() => {
    console.log('Details useEffect triggered:', { expenseId, detailsLoaded, loading });
    if (expenseId && !detailsLoaded && !loading) {
      console.log('Loading expense details for ID:', expenseId);
      setDetailsLoaded(true);
      getExpense(expenseId);
    }
  }, [expenseId, detailsLoaded, loading]); // Controlled dependencies

  // Reset when expenseId changes
  useEffect(() => {
    console.log('ExpenseId changed, resetting details loaded:', expenseId);
    setDetailsLoaded(false);
  }, [expenseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ToastContainer />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expense details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentExpense) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ToastContainer />
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 mb-2 text-red-600" />
          <p className="text-lg font-medium">Error loading expense details</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const handleClone = async () => {
    try {
      const cloneData = {
        description: `Copy of ${currentExpense.Description}`,
        amount: currentExpense.Amount,
        expenseDate: new Date().toISOString().split('T')[0],
        categoryId: currentExpense.CategoryId,
        vendorId: currentExpense.VendorId || 1,
        paymentMethod: currentExpense.PaymentMethod,
        notes: currentExpense.Notes ? `${currentExpense.Notes} (Cloned)` : 'Cloned expense',
        currency: currentExpense.Currency || 'SAR',
        status: 'Pending'
      };

      await createExpense(cloneData);
      showToast('Expense cloned successfully', 'success');
      if (onClone) onClone();
    } catch (error) {
      console.error('Clone error:', error);
      showToast('Error cloning expense', 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        showToast('Expense deleted successfully', 'success');
        setTimeout(() => onBack(), 1500);
      } catch (error) {
        showToast('Error deleting expense', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" icon={ArrowLeft} onClick={onBack} className="bg-white text-red-600 hover:bg-gray-50">
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Expense #{currentExpense.CodeNumber || currentExpense.Id}</h1>
              </div>
              <Badge variant={currentExpense.Status === 'Approved' ? 'success' : 'warning'}>
                {currentExpense.Status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border-x border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Button icon={Edit} onClick={() => onEdit(currentExpense)}>Edit</Button>
            <Button variant="outline" icon={Copy} onClick={handleClone}>Clone</Button>
            <Button variant="danger" icon={Trash2} onClick={handleDelete}>Delete</Button>
          </div>
        </div>

        {/* Expense Details */}
        <div className="bg-white border border-gray-200 rounded-b-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Information</h3>
              <div className="space-y-3">
                <div><strong>Description:</strong> {currentExpense.Description}</div>
                <div><strong>Amount:</strong> {currentExpense.Currency} {currentExpense.Amount?.toLocaleString()}</div>
                <div><strong>Date:</strong> {new Date(currentExpense.ExpenseDate).toLocaleDateString()}</div>
                <div><strong>Payment Method:</strong> {currentExpense.PaymentMethod}</div>
                <div><strong>Status:</strong> {currentExpense.Status}</div>
                {currentExpense.Notes && <div><strong>Notes:</strong> {currentExpense.Notes}</div>}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
              <div className="space-y-3">
                <div><strong>Reference:</strong> {currentExpense.ReferenceNumber || 'N/A'}</div>
                <div><strong>Currency:</strong> {currentExpense.Currency}</div>
                <div><strong>Tax Amount:</strong> {currentExpense.TaxAmount || 0}</div>
                <div><strong>Total Amount:</strong> {currentExpense.TotalAmount || currentExpense.Amount}</div>
                <div><strong>Created:</strong> {new Date(currentExpense.CreatedDate || currentExpense.CreatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const FinanceExpense = () => {
  const { showToast, ToastContainer } = useToast();
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // Prevent multiple loads
  
  const {
    expenses, statistics, loading, error, getExpenses, getExpenseStatistics,
    createExpense, updateExpense, deleteExpense
  } = useFinanceExpenses();

  const { getExpenseCategories, expenseCategories } = useExpenseCategory();

  // Form state
  const [form, setForm] = useState({
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    categoryId: '',
    vendorId: 1,
    paymentMethod: '',
    notes: '',
    referenceNumber: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('Main useEffect triggered:', { currentPage, dataLoaded, loading });
    if (currentPage === 'list' && !dataLoaded && !loading) {
      console.log('Loading data...');
      setDataLoaded(true);
      const loadData = async () => {
        try {
          await Promise.all([
            getExpenses(),
            getExpenseCategories(),
            getExpenseStatistics()
          ]);
          console.log('Data loaded successfully');
        } catch (error) {
          console.error('Error loading data:', error);
          setDataLoaded(false); // Reset on error so user can retry
          if (showToast) {
            showToast('Error loading data', 'error');
          }
        }
      };
      loadData();
    }
  }, [currentPage, dataLoaded, loading]); 

  // Get expenses array safely
  const getExpensesArray = () => {
    if (Array.isArray(expenses)) return expenses;
    if (expenses?.Data?.$values) return expenses.Data.$values;
    if (expenses?.$values) return expenses.$values;
    return [];
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!form.expenseDate) newErrors.expenseDate = 'Date is required';
    if (!form.categoryId) newErrors.categoryId = 'Category is required';
    if (!form.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      description: '',
      amount: '',
      expenseDate: new Date().toISOString().split('T')[0],
      categoryId: '',
      vendorId: 1,
      paymentMethod: '',
      notes: '',
      referenceNumber: ''
    });
    setErrors({});
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      showToast('Please fix the form errors', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await createExpense({
        ...form,
        codeNumber: `EXP-${Date.now()}`,
        currency: 'SAR',
        status: 'Pending'
      });
      
      setShowAddModal(false);
      resetForm();
      
      // Refresh data
      setDataLoaded(false);
      showToast('Expense added successfully', 'success');
    } catch (error) {
      console.error('Add error:', error);
      showToast('Error adding expense', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!validateForm()) {
      showToast('Please fix the form errors', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateExpense(editingExpense.Id, {
        ...form,
        codeNumber: editingExpense.CodeNumber,
        currency: editingExpense.Currency || 'SAR',
        status: editingExpense.Status
      });
      
      setShowEditModal(false);
      setEditingExpense(null);
      resetForm();
      
      // Refresh data
      setDataLoaded(false);
      showToast('Expense updated successfully', 'success');
    } catch (error) {
      console.error('Edit error:', error);
      showToast('Error updating expense', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        
        // Refresh data
        setDataLoaded(false);
        showToast('Expense deleted successfully', 'success');
      } catch (error) {
        console.error('Delete error:', error);
        showToast('Error deleting expense', 'error');
      }
    }
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setForm({
      description: expense.Description || '',
      amount: expense.Amount || '',
      expenseDate: expense.ExpenseDate ? expense.ExpenseDate.split('T')[0] : '',
      categoryId: expense.CategoryId || '',
      vendorId: expense.VendorId || 1,
      paymentMethod: expense.PaymentMethod || '',
      notes: expense.Notes || '',
      referenceNumber: expense.ReferenceNumber || ''
    });
    setErrors({});
    setShowEditModal(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Main component unmounting');
      setDataLoaded(false);
    };
  }, []);

  // Show details page
  if (currentPage === 'details' && selectedExpenseId) {
    return (
      <ExpenseDetailsPage 
        expenseId={selectedExpenseId}
        onBack={() => setCurrentPage('list')}
        onEdit={(expense) => {
          setCurrentPage('list');
          openEditModal(expense);
        }}
        onDelete={() => setCurrentPage('list')}
        onClone={() => setCurrentPage('list')}
      />
    );
  }
  const getCategoryName = (categoryId) => {
  const category = expenseCategories?.$values?.find(cat => cat.Id === categoryId);
  return category?.Name || 'Unknown';
};

  const expensesList = getExpensesArray();

  if (loading && expensesList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ToastContainer />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-red-600 text-white">
            <div className="p-6">
              <h3 className="text-sm font-medium opacity-90">Last 7 Days</h3>
              <p className="text-2xl font-bold mt-2">SAR {statistics?.last7Days?.toLocaleString() || '0'}</p>
            </div>
          </Card>
          <Card className="bg-red-600 text-white">
            <div className="p-6">
              <h3 className="text-sm font-medium opacity-90">Last 30 Days</h3>
              <p className="text-2xl font-bold mt-2">SAR {statistics?.last30Days?.toLocaleString() || '0'}</p>
            </div>
          </Card>
          <Card className="bg-red-600 text-white">
            <div className="p-6">
              <h3 className="text-sm font-medium opacity-90">Last 365 Days</h3>
              <p className="text-2xl font-bold mt-2">SAR {statistics?.last365Days?.toLocaleString() || '0'}</p>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Expenses</h3>
              <Button icon={Plus} onClick={() => setShowAddModal(true)}>Add Expense</Button>
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
                {expensesList.map((expense) => (
                  <tr key={expense.Id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                    setSelectedExpenseId(expense.Id);
                    setCurrentPage('details');
                  }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {expense.CodeNumber} - {new Date(expense.ExpenseDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{expense.Description}</div>
                      {expense.Notes && <div className="text-xs text-gray-500">{expense.Notes}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">{getCategoryName(expense.CategoryId)}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-red-600">
                        {expense.Currency} {expense.Amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={expense.Status === 'Approved' ? 'success' : 'warning'}>
                        {expense.Status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Dropdown trigger={<MoreVertical className="w-4 h-4 text-gray-400" />}>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => { e.stopPropagation(); setSelectedExpenseId(expense.Id); setCurrentPage('details'); }}>
                          <Eye className="w-4 h-4 mr-2" />View Details
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => { e.stopPropagation(); openEditModal(expense); }}>
                          <Edit className="w-4 h-4 mr-2" />Edit
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          onClick={(e) => { e.stopPropagation(); handleDelete(expense.Id); }}>
                          <Trash2 className="w-4 h-4 mr-2" />Delete
                        </button>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {expensesList.length === 0 && (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">No expenses found</h3>
              <p className="text-sm text-gray-500">Get started by adding a new expense.</p>
              <Button className="mt-4" onClick={() => setShowAddModal(true)}>Add Expense</Button>
            </div>
          )}
        </Card>

        {/* Add Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Expense"
          footer={
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAdd} loading={isSubmitting}>Add Expense</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input label="Description *" placeholder="Enter expense description" value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})} error={errors.description} />
            
            <Input label="Amount *" type="number" step="0.01" placeholder="Enter amount" value={form.amount}
              onChange={(e) => setForm({...form, amount: e.target.value})} error={errors.amount} />
            
            <Input label="Date *" type="date" value={form.expenseDate}
              onChange={(e) => setForm({...form, expenseDate: e.target.value})} error={errors.expenseDate} />
            
            <Select label="Category *" value={form.categoryId}
              onChange={(e) => setForm({...form, categoryId: e.target.value})} error={errors.categoryId}>
              <option value="">Select category</option>
              {expenseCategories?.$values?.map(cat => (
                <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
              ))}
            </Select>
            
            <Select label="Payment Method *" value={form.paymentMethod}
              onChange={(e) => setForm({...form, paymentMethod: e.target.value})} error={errors.paymentMethod}>
              <option value="">Select payment method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Check">Check</option>
            </Select>
            
            <Input label="Reference Number" placeholder="Reference number (optional)" value={form.referenceNumber}
              onChange={(e) => setForm({...form, referenceNumber: e.target.value})} />
            
            <Input label="Notes" placeholder="Additional notes (optional)" value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})} />
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Expense"
          footer={
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button onClick={handleEdit} loading={isSubmitting}>Update Expense</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input label="Description *" placeholder="Enter expense description" value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})} error={errors.description} />
            
            <Input label="Amount *" type="number" step="0.01" placeholder="Enter amount" value={form.amount}
              onChange={(e) => setForm({...form, amount: e.target.value})} error={errors.amount} />
            
            <Input label="Date *" type="date" value={form.expenseDate}
              onChange={(e) => setForm({...form, expenseDate: e.target.value})} error={errors.expenseDate} />
            
            <Select label="Category *" value={form.categoryId}
              onChange={(e) => setForm({...form, categoryId: e.target.value})} error={errors.categoryId}>
              <option value="">Select category</option>
              {expenseCategories?.$values?.map(cat => (
                <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
              ))}
            </Select>
            
            <Select label="Payment Method *" value={form.paymentMethod}
              onChange={(e) => setForm({...form, paymentMethod: e.target.value})} error={errors.paymentMethod}>
              <option value="">Select payment method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Check">Check</option>
            </Select>
            
            <Input label="Reference Number" placeholder="Reference number (optional)" value={form.referenceNumber}
              onChange={(e) => setForm({...form, referenceNumber: e.target.value})} />
            
            <Input label="Notes" placeholder="Additional notes (optional)" value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FinanceExpense;