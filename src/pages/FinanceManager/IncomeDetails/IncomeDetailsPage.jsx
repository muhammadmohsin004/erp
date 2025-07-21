import React, { useEffect, useState, useRef } from 'react';
import { 
  Edit, Copy, Trash2, ChevronDown, 
  Printer, FileText, Mail, ArrowLeft,
  Download, CheckCircle, XCircle, AlertTriangle, Info, X
} from 'lucide-react';

// Import the actual contexts
import { useFinanceIncomes, useIncomeDetails } from '../../../Contexts/FinanceContext/FinanceIncomeContext';

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

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
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
  );

  return { showToast, ToastContainer };
};

// Button Component
const Button = ({ children, variant = "primary", size = "md", icon: Icon, disabled, className = "", loading, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
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
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

// Badge Component
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

// Dropdown Component
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
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
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

// Income Receipt Component
const IncomeReceipt = ({ income, company }) => {
  const formatCurrency = (amount) => {
    return `Rs. ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-GB');
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const convertNumberToWords = (amount) => {
    if (!amount) return 'zero Pakistani Rupees';
    
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

    if (amount === 0) return 'zero Pakistani Rupees';
    
    let result = '';
    const crores = Math.floor(amount / 10000000);
    const lakhs = Math.floor((amount % 10000000) / 100000);
    const thousands = Math.floor((amount % 100000) / 1000);
    const hundreds = amount % 1000;

    if (crores > 0) result += convertHundreds(crores) + 'crore ';
    if (lakhs > 0) result += convertHundreds(lakhs) + 'lakh ';
    if (thousands > 0) result += convertHundreds(thousands) + 'thousand ';
    if (hundreds > 0) result += convertHundreds(hundreds);

    return result.trim() + ' Pakistani Rupees';
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
          <h2 className="text-lg font-bold text-black">Income Receipt</h2>
          <p className="text-sm mt-1"><strong>NO:</strong> {income?.CodeNumber || '000001'}</p>
        </div>
      </div>

      {/* Receipt Details */}
      <div className="space-y-3 mb-8">
        <div>
          <strong>Received From:</strong> {income?.CustomerName || income?.Customer?.Name || '...........................'}
        </div>
        <div className="flex justify-between">
          <div>
            <strong>Amount:</strong> {formatCurrency(income?.Amount)}
          </div>
          <div>
            <strong>Spelled:</strong> {convertNumberToWords(Math.floor(income?.Amount || 0))}
          </div>
        </div>
        <div>
          <strong>Date:</strong> {formatDate(income?.IncomeDate)}
        </div>
        <div>
          <strong>For:</strong> {income?.Description || 'Service provided'}
        </div>
        {income?.PaymentMethod && (
          <div>
            <strong>Payment Method:</strong> {income.PaymentMethod}
          </div>
        )}
        {income?.CategoryName && (
          <div>
            <strong>Category:</strong> {income.CategoryName}
          </div>
        )}
        {income?.Notes && (
          <div>
            <strong>Notes:</strong> {income.Notes}
          </div>
        )}
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-8 mt-16">
        <div className="text-center">
          <div className="border-b border-black mb-2 pb-8"></div>
          <p className="text-sm font-medium">Received Sig.</p>
          <p className="text-xs text-gray-500 mt-2">...........................</p>
        </div>
        <div className="text-center">
          <div className="border-b border-black mb-2 pb-8"></div>
          <p className="text-sm font-medium">Cashier Sig</p>
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
const ActivityLog = ({ income }) => {
  const activities = [];
  
  // Add creation activity
  if (income?.CreatedAt || income?.CreatedDate) {
    activities.push({
      id: 1,
      action: 'Created',
      user: 'System User',
      timestamp: income.CreatedAt || income.CreatedDate,
      details: 'Income record created'
    });
  }

  // Add update activity if different from creation
  if (income?.UpdatedAt && income.UpdatedAt !== income.CreatedAt) {
    activities.push({
      id: 2,
      action: 'Updated',
      user: 'System User',
      timestamp: income.UpdatedAt,
      details: 'Income record updated'
    });
  }

  // Add status activity
  if (income?.Status) {
    activities.push({
      id: 3,
      action: 'Status Updated',
      user: 'System User',
      timestamp: income.UpdatedAt || income.CreatedAt || new Date().toISOString(),
      details: `Status set to ${income.Status}`
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

// Main Income Details Component
const IncomeDetailsPage = ({ 
  incomeId, 
  onBack, 
  onEdit, 
  onDelete, 
  onClone 
}) => {
  const { showToast, ToastContainer } = useToast();
  const [activeTab, setActiveTab] = useState('voucher');
  const [company, setCompany] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const receiptRef = useRef();

  // Use the actual API context
  const { 
    updateIncome, 
    deleteIncome: contextDeleteIncome,
    createIncome,
    getIncomes 
  } = useFinanceIncomes();

  // Use the income details hook
  const { income, loading, error } = useIncomeDetails(incomeId);

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
  }, []);

  useEffect(() => {
    if (income) {
      showToast('Income details loaded successfully', 'success');
      setIsDraft(income.Status === 'Draft' || income.IsDraft);
    }
  }, [income]);

  useEffect(() => {
    if (error) {
      showToast(`Error: ${error}`, 'error');
    }
  }, [error]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const receiptHTML = receiptRef.current.outerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Income Receipt - ${income?.CodeNumber}</title>
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
          ${receiptHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    showToast('Printing initiated', 'info');
  };

  const handleDownloadPDF = async () => {
    try {
      showToast('Generating PDF...', 'info');
      
      // Dynamic import for PDF generation
      const jsPDF = (await import('jspdf')).jsPDF;
      const html2canvas = (await import('html2canvas')).default;
      
      const element = receiptRef.current;
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
      
      pdf.save(`Income_Receipt_${income?.CodeNumber}.pdf`);
      showToast('PDF downloaded successfully', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Error generating PDF. Please try again.', 'error');
    }
  };

  const handleSendEmail = () => {
    // Implement email sending logic with your email service
    showToast('Email feature coming soon', 'info');
  };

  const handleEdit = () => {
    if (onEdit && income) {
      onEdit(income);
    } else {
      showToast('Edit functionality not available', 'warning');
    }
  };

  const handleClone = async () => {
    if (!income) {
      showToast('No income data to clone', 'error');
      return;
    }

    try {
      showToast('Cloning income record...', 'info');
      
      // Create a new income based on the current one
      const cloneData = {
        description: `Copy of ${income.Description}`,
        amount: income.Amount,
        incomeDate: new Date().toISOString().split('T')[0], // Today's date
        categoryId: income.CategoryId,
        customerId: income.CustomerId,
        paymentMethod: income.PaymentMethod,
        isRecurring: income.IsRecurring,
        notes: income.Notes ? `${income.Notes} (Cloned)` : 'Cloned from original record'
      };

      await createIncome(cloneData);
      await getIncomes(); // Refresh the list
      
      if (onClone) {
        onClone(income);
      }
      
      showToast('Income record cloned successfully', 'success');
    } catch (error) {
      console.error('Error cloning income:', error);
      showToast('Error cloning income record', 'error');
    }
  };

  const handleDelete = async () => {
    if (!income) {
      showToast('No income data to delete', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this income record? This action cannot be undone.')) {
      try {
        showToast('Deleting income record...', 'info');
        
        await contextDeleteIncome(income.Id || income.id);
        
        if (onDelete) {
          onDelete(income.Id || income.id);
        }
        
        showToast('Income record deleted successfully', 'success');
        
        // Navigate back after successful deletion
        setTimeout(() => {
          if (onBack) onBack();
        }, 1500);
        
      } catch (error) {
        console.error('Error deleting income:', error);
        showToast('Error deleting income record', 'error');
      }
    }
  };

  const handleMarkAsDraft = async () => {
    if (!income) return;

    try {
      showToast('Updating status...', 'info');
      
      const updateData = {
        ...income,
        status: isDraft ? 'Confirmed' : 'Draft'
      };

      await updateIncome(income.Id || income.id, updateData);
      setIsDraft(!isDraft);
      
      showToast(`Income marked as ${isDraft ? 'Confirmed' : 'Draft'}`, 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Error updating status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Received': 'success',
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
        <ToastContainer />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading income details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ToastContainer />
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <XCircle className="mx-auto h-12 w-12 mb-2" />
            <p className="text-lg font-medium">Error loading income details</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  if (!income) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ToastContainer />
        <div className="text-center">
          <p className="text-gray-600">Income not found</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                icon={ArrowLeft} 
                onClick={onBack}
                className="bg-white text-blue-600 hover:bg-gray-50"
              >
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  Income #{income.CodeNumber || income.Id}
                </h1>
                {income.JournalNumber && (
                  <p className="text-sm opacity-90">
                    Journal #{income.JournalNumber}
                  </p>
                )}
              </div>
              {getStatusBadge(income.Status)}
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
                  View Receipt
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
              {/* Action Buttons for Receipt */}
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

              {/* Receipt */}
              <div ref={receiptRef}>
                <IncomeReceipt income={income} company={company} />
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h3>
              <ActivityLog income={income} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeDetailsPage;