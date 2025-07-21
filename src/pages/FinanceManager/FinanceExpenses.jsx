import React, { useEffect, useState, useRef } from 'react';
import { 
  Plus, Search, Calendar, 
  Eye, Edit, Trash2, MoreVertical, AlertCircle,
  CreditCard, Banknote, Smartphone, 
  RefreshCw, FileText, X, Filter, CheckCircle,
  XCircle, Info, AlertTriangle, Download, Printer,
  ArrowLeft, Copy, ChevronDown, Mail
} from 'lucide-react';

// Import your real contexts
import { useFinanceExpenses } from '../../Contexts/FinanceContext/FinanceExpensesContext';
import { useExpenseCategory } from '../../Contexts/ExpenseCategoryContext/ExpenseCategoryContext';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  };
  
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const Icon = icons[type];

  useEffect(() => {
    // Fetch expense details when component mounts
    if (expenseId) {
      getExpense(expenseId);
    }

    // Cleanup function to clear current expense when component unmounts
    return () => {
      clearCurrentExpense();
    };
  }, [expenseId, getExpense, clearCurrentExpense]);

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg border ${colors[type]} p-4 transform transition-all duration-300 ease-in-out`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
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
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  ), [toasts, removeToast]);

  return { showToast, ToastContainer };
};

// Enhanced UI Components
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
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 mr-2" />
      )}
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
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} transform transition-all duration-200 max-h-[90vh] flex flex-col`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
            >
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

// Expense Voucher Component
const ExpenseVoucher = ({ expense, company }) => {
  const formatCurrency = (amount) => {
    return `SAR. ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-GB');
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const convertNumberToWords = (amount) => {
    if (!amount) return 'zero Saudi Riyals';
    
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    
    const convertHundreds = (num) => {
      let result = '';
      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' hundred ';
        num %= 100;
      }
      if (num >= 20) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      } else if (num >= 10) {
        result += teens[num - 10] + ' ';
        return result;
      }
      if (num > 0) {
        result += ones[num] + ' ';
      }
      return result;
    };

    if (amount === 0) return 'zero Saudi Riyals';
    
    let result = '';
    const millions = Math.floor(amount / 1000000);
    const thousands = Math.floor((amount % 1000000) / 1000);
    const hundreds = amount % 1000;

    if (millions > 0) result += convertHundreds(millions) + 'million ';
    if (thousands > 0) result += convertHundreds(thousands) + 'thousand ';
    if (hundreds > 0) result += convertHundreds(hundreds);

    return result.trim() + ' Saudi Riyals';
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-xl font-bold text-black">{company?.Name || 'Company Name'}</h1>
          {company?.Address && <p className="text-sm mt-1">{company.Address}</p>}
          {company?.City && <p className="text-sm">{company.City}</p>}
          {company?.Phone && <p className="text-sm">Phone: {company.Phone}</p>}
          {company?.Email && <p className="text-sm">Email: {company.Email}</p>}
        </div>
        <div className="text-center border border-black px-4 py-2">
          <h2 className="text-lg font-bold text-black">Expense Voucher</h2>
          <p className="text-sm mt-1"><strong>NO:</strong> {expense?.CodeNumber || '000001'}</p>
        </div>
      </div>

      {/* Voucher Details */}
      <div className="space-y-3 mb-8">
        <div>
          <strong>Paid To:</strong> {expense?.VendorName || expense?.Vendor?.Name || '...........................'}
        </div>
        <div className="flex justify-between">
          <div>
            <strong>Amount:</strong> {formatCurrency(expense?.Amount)}
          </div>
          <div>
            <strong>Spelled:</strong> {convertNumberToWords(Math.floor(expense?.Amount || 0))}
          </div>
        </div>
        <div>
          <strong>Date:</strong> {formatDate(expense?.ExpenseDate)}
        </div>
        <div>
          <strong>For:</strong> {expense?.Description || 'Business expense'}
        </div>
        {expense?.PaymentMethod && (
          <div>
            <strong>Payment Method:</strong> {expense.PaymentMethod}
          </div>
        )}
        {expense?.CategoryName && (
          <div>
            <strong>Category:</strong> {expense.CategoryName}
          </div>
        )}
        {expense?.Notes && (
          <div>
            <strong>Notes:</strong> {expense.Notes}
          </div>
        )}
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-8 mt-16">
        <div className="text-center">
          <div className="border-b border-black mb-2 pb-8"></div>
          <p className="text-sm font-medium">Approved By</p>
          <p className="text-xs text-gray-500 mt-2">...........................</p>
        </div>
        <div className="text-center">
          <div className="border-b border-black mb-2 pb-8"></div>
          <p className="text-sm font-medium">Paid By</p>
          <p className="text-xs text-gray-500 mt-2">...........................</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Generated on {new Date().toLocaleDateString()} | {company?.Name || 'Company'}</p>
      </div>
    </div>
  );
};

// Activity Log Component
const ActivityLog = ({ expense }) => {
  const activities = [];
  
  // Add creation activity
  if (expense?.CreatedAt || expense?.CreatedDate) {
    activities.push({
      id: 1,
      action: 'Created',
      user: 'System User',
      timestamp: expense.CreatedAt || expense.CreatedDate,
      details: 'Expense record created'
    });
  }

  // Add update activity if different from creation
  if (expense?.UpdatedAt && expense.UpdatedAt !== expense.CreatedAt) {
    activities.push({
      id: 2,
      action: 'Updated',
      user: 'System User',
      timestamp: expense.UpdatedAt,
      details: 'Expense record updated'
    });
  }

  // Add status activity
  if (expense?.Status) {
    activities.push({
      id: 3,
      action: 'Status Updated',
      user: 'System User',
      timestamp: expense.UpdatedAt || expense.CreatedAt || new Date().toISOString(),
      details: `Status set to ${expense.Status}`
    });
  }

  return (
    <div className="space-y-4">
      {activities.length > 0 ? activities.map((activity) => (
        <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">{activity.action}</h4>
              <p className="text-sm text-gray-600">{activity.details}</p>
              <p className="text-xs text-gray-500">by {activity.user}</p>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      )) : (
        <div className="text-center py-8 text-gray-500">
          <p>No activity logs available</p>
        </div>
      )}
    </div>
  );
};

// Expense Details Page Component
const ExpenseDetailsPage = ({ 
  expenseId, 
  onBack, 
  onEdit, 
  onDelete, 
  onClone 
}) => {
  const { showToast, ToastContainer } = useToast();
  const [activeTab, setActiveTab] = useState('voucher');
  const [company, setCompany] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const voucherRef = useRef();

  // Use the actual API context
  const { 
    currentExpense,
    loading,
    error,
    getExpense,
    updateExpense, 
    deleteExpense: contextDeleteExpense,
    createExpense,
    getExpenses,
    clearCurrentExpense
  } = useFinanceExpenses();

  // Get the expense details
  const expense = currentExpense;

  useEffect(() => {
    // Load company data from localStorage
    try {
      const companyData = localStorage.getItem('company');
      if (companyData) {
        setCompany(JSON.parse(companyData));
      }
    } catch (error) {
      console.error('Error loading company data:', error);
      showToast('Error loading company data', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    if (expense) {
      showToast('Expense details loaded successfully', 'success');
      setIsDraft(expense.Status === 'Draft' || expense.IsDraft);
    }
  }, [expense, showToast]);

  useEffect(() => {
    if (error) {
      showToast(`Error: ${error}`, 'error');
    }
  }, [error, showToast]);

  // Early return if no expenseId provided
  if (!expenseId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ToastContainer />
        <div className="text-center">
          <p className="text-gray-600">No expense ID provided</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const voucherHTML = voucherRef.current.outerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Expense Voucher - ${expense?.CodeNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            @media print { body { margin: 0; } }
            .bg-white { background-color: white; }
            .border { border: 1px solid #ccc; }
            .border-black { border-color: black; }
            .p-8 { padding: 2rem; }
            .text-xl { font-size: 1.25rem; }
            .font-bold { font-weight: bold; }
            .text-center { text-align: center; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .gap-8 { gap: 2rem; }
            .border-b { border-bottom: 1px solid; }
            .pb-8 { padding-bottom: 2rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mt-16 { margin-top: 4rem; }
          </style>
        </head>
        <body>
          ${voucherHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    notify.info('Printing initiated');
  };

  const handleDownloadPDF = async () => {
    try {
      notify.info('Generating PDF...');
      
      // Dynamic import for PDF generation
      const jsPDF = (await import('jspdf')).jsPDF;
      const html2canvas = (await import('html2canvas')).default;
      
      const element = voucherRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Expense_Voucher_${expense?.CodeNumber}.pdf`);
      notify.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      notify.error('Error generating PDF. Please try again.');
    }
  };

  const handleSendEmail = () => {
    notify.info('Email feature coming soon');
  };

  const handleEdit = () => {
    if (onEdit && expense) {
      onEdit(expense);
    } else {
      notify.warning('Edit functionality not available');
    }
  };

  const handleClone = async () => {
    if (!expense) {
      notify.error('No expense data to clone');
      return;
    }

    try {
      notify.info('Cloning expense record...');
      
      const cloneData = {
        description: `Copy of ${expense.Description}`,
        amount: expense.Amount,
        expenseDate: new Date().toISOString().split('T')[0],
        categoryId: expense.CategoryId,
        vendorId: expense.VendorId,
        paymentMethod: expense.PaymentMethod,
        isRecurring: expense.IsRecurring,
        notes: expense.Notes ? `${expense.Notes} (Cloned)` : 'Cloned from original record'
      };

      await createExpense(cloneData);
      await getExpenses();
      
      if (onClone) {
        onClone(expense);
      }
      
      notify.success('Expense record cloned successfully');
    } catch (error) {
      console.error('Error cloning expense:', error);
      notify.error('Error cloning expense record');
    }
  };

  const handleDelete = async () => {
    if (!expense) {
      notify.error('No expense data to delete');
      return;
    }

    if (window.confirm('Are you sure you want to delete this expense record? This action cannot be undone.')) {
      try {
        notify.info('Deleting expense record...');
        
        await contextDeleteExpense(expense.Id || expense.id);
        
        if (onDelete) {
          onDelete(expense.Id || expense.id);
        }
        
        notify.success('Expense record deleted successfully');
        
        setTimeout(() => {
          if (onBack) onBack();
        }, 1500);
        
      } catch (error) {
        console.error('Error deleting expense:', error);
        notify.error('Error deleting expense record');
      }
    }
  };

  const handleMarkAsDraft = async () => {
    if (!expense) return;

    try {
      notify.info('Updating status...');
      
      const updateData = {
        ...expense,
        status: isDraft ? 'Confirmed' : 'Draft'
      };

      await updateExpense(expense.Id || expense.id, updateData);
      setIsDraft(!isDraft);
      
      notify.success(`Expense marked as ${isDraft ? 'Confirmed' : 'Draft'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      notify.error('Error updating status');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Paid': 'success',
      'Confirmed': 'success',
      'Pending': 'warning',
      'Cancelled': 'danger',
      'Draft': 'secondary'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expense details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <XCircle className="mx-auto h-12 w-12 mb-2" />
            <p className="text-lg font-medium">Error loading expense details</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Expense not found</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                icon={ArrowLeft} 
                onClick={onBack}
                className="bg-white text-red-600 hover:bg-gray-50"
              >
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  Expense #{expense.CodeNumber || expense.Id}
                </h1>
                {expense.JournalNumber && (
                  <p className="text-sm opacity-90">
                    Journal #{expense.JournalNumber}
                  </p>
                )}
              </div>
              {getStatusBadge(expense.Status)}
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="markAsDraft" 
                className="rounded" 
                checked={isDraft}
                onChange={handleMarkAsDraft}
              />
              <label htmlFor="markAsDraft" className="text-sm">Mark as Draft</label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border-x border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button icon={Edit} onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="outline" icon={Copy} onClick={handleClone}>
                Clone
              </Button>
              <Button variant="danger" icon={Trash2} onClick={handleDelete}>
                Delete
              </Button>
              <Dropdown
                trigger={
                  <Button variant="outline">
                    Voucher <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                }
              >
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setActiveTab('voucher')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Voucher
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleDownloadPDF}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-x border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('voucher')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'voucher'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Voucher
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activity Log
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-gray-200 rounded-b-lg">
          {activeTab === 'voucher' && (
            <div className="p-6">
              {/* Action Buttons for Voucher */}
              <div className="flex justify-end space-x-2 mb-6">
                <Button variant="outline" icon={Printer} onClick={handlePrint}>
                  Print
                </Button>
                <Button variant="outline" icon={FileText} onClick={handleDownloadPDF}>
                  PDF
                </Button>
                <Button variant="outline" icon={Mail} onClick={handleSendEmail}>
                  Send Email
                </Button>
              </div>

              {/* Voucher */}
              <div ref={voucherRef}>
                <ExpenseVoucher expense={expense} company={company} />
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h3>
              <ActivityLog expense={expense} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component - Expense List & Details Management
const FinanceExpense = () => {
  // Page state management
  const [currentPage, setCurrentPage] = useState('list'); // 'list' or 'details'
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  
  // Finance Expense Context
  const {
    expenses,
    statistics,
    pagination,
    filters,
    loading,
    error,
    getExpenses,
    getExpenseStatistics,
    createExpense,
    updateExpense,
    deleteExpense,
    searchExpenses,
    filterByStatus,
    filterByCategory,
    filterByDateRange,
    changePage,
    resetFilters
  } = useFinanceExpenses();

  // Expense Category Context
  const { getActiveExpenseCategories } = useExpenseCategory();

  // State for list page
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('Custom');
  const [selectedSortBy, setSelectedSortBy] = useState('Date (Newest First)');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    expenseDate: '',
    categoryId: '',
    vendorId: '',
    paymentMethod: '',
    isRecurring: false,
    notes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await getExpenses();
        await getExpenseStatistics();
        notify.success('Data loaded successfully');
      } catch (error) {
        console.error("Error loading data:", error);
        notify.error('Error loading data');
      }
    };
    
    if (currentPage === 'list') {
      loadData();
    }
  }, [currentPage]);

  // Helper function to safely get expenses array
  const getExpensesArray = () => {
    if (Array.isArray(expenses)) {
      return expenses;
    }
    if (expenses?.Data?.$values) {
      return expenses.Data.$values;
    }
    if (expenses?.$values) {
      return expenses.$values;
    }
    return [];
  };

  // Navigation functions
  const handleViewDetails = (expense) => {
    setSelectedExpenseId(expense.Id || expense.id);
    setCurrentPage('details');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedExpenseId(null);
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId) => {
    const activeCategories = getActiveExpenseCategories();
    const category = activeCategories.find(cat => cat.Id === categoryId);
    return category ? category.Name : 'Uncategorized';
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!expenseForm.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!expenseForm.amount || parseFloat(expenseForm.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!expenseForm.expenseDate) {
      errors.expenseDate = 'Date is required';
    }
    
    if (!expenseForm.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    if (!expenseForm.paymentMethod) {
      errors.paymentMethod = 'Payment method is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      searchExpenses(searchValue);
      notify.info('Search completed');
    } else {
      getExpenses();
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
    getExpenses();
    notify.info('Filters reset');
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
      notify.info('Date filter applied');
    }
  };

  const handleSortChange = (sortOption) => {
    setSelectedSortBy(sortOption);
  };

  const handleAddExpense = async () => {
    if (!validateForm()) {
      notify.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    try {
      await createExpense(expenseForm);
      setShowAddModal(false);
      resetForm();
      await getExpenses();
      notify.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      notify.error('Error adding expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditExpense = async () => {
    if (!validateForm()) {
      notify.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateExpense(editingExpense.Id, expenseForm);
      setShowEditModal(false);
      setEditingExpense(null);
      resetForm();
      await getExpenses();
      notify.success('Expense updated successfully');
    } catch (error) {
      console.error('Error updating expense:', error);
      notify.error('Error updating expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await deleteExpense(id);
        await getExpenses();
        notify.success('Expense deleted successfully');
      } catch (error) {
        console.error('Error deleting expense:', error);
        notify.error('Error deleting expense');
      }
    }
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      description: expense.Description || '',
      amount: expense.Amount || '',
      expenseDate: expense.ExpenseDate ? expense.ExpenseDate.split('T')[0] : '',
      categoryId: expense.CategoryId || '',
      vendorId: expense.VendorId || '',
      paymentMethod: expense.PaymentMethod || '',
      isRecurring: expense.IsRecurring || false,
      notes: expense.Notes || ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
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
      notes: ''
    });
    setFormErrors({});
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Paid': 'success',
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
    { value: 'Paid', label: 'Paid' },
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

  // Show details page if viewing expense details
  if (currentPage === 'details' && selectedExpenseId) {
    return (
      <ExpenseDetailsPage 
        expenseId={selectedExpenseId}
        onBack={handleBackToList}
        onEdit={(expense) => {
          setCurrentPage('list');
          openEditModal(expense);
        }}
        onDelete={(id) => {
          handleDeleteExpense(id);
          handleBackToList();
        }}
        onClone={(expense) => {
          setCurrentPage('list');
          showToast('Navigate to list to see cloned record', 'info');
        }}
      />
    );
  }

  const expensesList = getExpensesArray();

  if (loading && expensesList.length === 0) {
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-red-600 text-white">
            <div className="p-6">
              <h3 className="text-sm font-medium opacity-90">Last 7 Days</h3>
              <p className="text-2xl font-bold mt-2">
                SAR. {statistics?.last7Days?.toLocaleString() || '0'}
              </p>
            </div>
          </Card>
          
          <Card className="bg-red-600 text-white">
            <div className="p-6">
              <h3 className="text-sm font-medium opacity-90">Last 30 Days</h3>
              <p className="text-2xl font-bold mt-2">
                SAR. {statistics?.last30Days?.toLocaleString() || '0'}
              </p>
            </div>
          </Card>
          
          <Card className="bg-red-600 text-white">
            <div className="p-6">
              <h3 className="text-sm font-medium opacity-90">Last 365 Days</h3>
              <p className="text-2xl font-bold mt-2">
                SAR. {statistics?.last365Days?.toLocaleString() || '0'}
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
                {getActiveExpenseCategories()?.map(cat => (
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
              <Button icon={Plus} onClick={openAddModal}>
                Add Expense
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
                {expensesList.map((expense) => (
                  <tr 
                    key={expense.Id || expense.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetails(expense)}
                  >
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
                      <Badge variant="info">
                        {expense.CategoryName || getCategoryNameById(expense.CategoryId)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-red-600">
                        SAR. {expense.Amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(expense.Status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Dropdown
                        trigger={<MoreVertical className="w-4 h-4 text-gray-400" />}
                      >
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(expense);
                          }}
                          role="menuitem"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(expense);
                          }}
                          role="menuitem"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExpense(expense.Id || expense.id);
                          }}
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

          {expensesList.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No expense records found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search criteria or add a new expense record.</p>
                <Button className="mt-4" onClick={openAddModal}>
                  Add Expense
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {expensesList.length > 0 && (
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

        {/* Add Expense Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Expense"
          footer={
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense} loading={isSubmitting}>
                Add Expense
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Description *"
              placeholder="Enter expense description"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
              error={formErrors.description}
            />

            <Input
              label="Amount *"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
              error={formErrors.amount}
            />

            <Input
              label="Date *"
              type="date"
              value={expenseForm.expenseDate}
              onChange={(e) => setExpenseForm({...expenseForm, expenseDate: e.target.value})}
              error={formErrors.expenseDate}
            />

            <Select
              label="Category *"
              value={expenseForm.categoryId}
              onChange={(e) => setExpenseForm({...expenseForm, categoryId: e.target.value})}
              error={formErrors.categoryId}
            >
              <option value="">Select category</option>
              {getActiveExpenseCategories()?.map(cat => (
                <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
              ))}
            </Select>

            <Select
              label="Payment Method *"
              value={expenseForm.paymentMethod}
              onChange={(e) => setExpenseForm({...expenseForm, paymentMethod: e.target.value})}
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
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
            />
          </div>
        </Modal>

        {/* Edit Expense Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Expense"
          footer={
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditExpense} loading={isSubmitting}>
                Update Expense
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Description *"
              placeholder="Enter expense description"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
              error={formErrors.description}
            />

            <Input
              label="Amount *"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
              error={formErrors.amount}
            />

            <Input
              label="Date *"
              type="date"
              value={expenseForm.expenseDate}
              onChange={(e) => setExpenseForm({...expenseForm, expenseDate: e.target.value})}
              error={formErrors.expenseDate}
            />

            <Select
              label="Category *"
              value={expenseForm.categoryId}
              onChange={(e) => setExpenseForm({...expenseForm, categoryId: e.target.value})}
              error={formErrors.categoryId}
            >
              <option value="">Select category</option>
              {getActiveExpenseCategories()?.map(cat => (
                <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
              ))}
            </Select>

            <Select
              label="Payment Method *"
              value={expenseForm.paymentMethod}
              onChange={(e) => setExpenseForm({...expenseForm, paymentMethod: e.target.value})}
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
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FinanceExpense;