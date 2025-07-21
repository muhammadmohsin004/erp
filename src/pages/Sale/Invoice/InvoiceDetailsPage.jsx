import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../../../Contexts/InvoiceContext/InvoiceContext';
import { useClients } from '../../../Contexts/apiClientContext/apiClientContext';
import { usePDF } from 'react-to-pdf';
import { 
  Edit, 
  Printer, 
  FileText, 
  CreditCard, 
  MoreHorizontal, 
  Send, 
  Download,
  ArrowLeft,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  X,
  Check,
  Plus,
  RefreshCw,
  Filter,
  ChevronDown,
  Eye,
  Trash2,
  DollarSign,
  AlertCircle,
  Loader
} from 'lucide-react';

const InvoiceDetailsPage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const pdfRef = useRef();
  
  // PDF hook setup with better configuration for compatibility
  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${invoiceId}.pdf`,
    page: {
      margin: 20,
      format: 'a4',
      orientation: 'portrait',
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1
    },
    overrides: {
      // Override problematic styles
      pdf: {
        compress: true
      },
      canvas: {
        useCORS: true
      }
    }
  });
  
  // Context hooks
  const {
    currentInvoice,
    loading: invoiceLoading,
    error: invoiceError,
    getInvoice,
    sendInvoice,
    markInvoiceAsPaid,
    refreshInvoices
  } = useInvoices() || {};

  const {
    clients = [],
    loading: clientsLoading,
    getClients,
    getClient
  } = useClients() || {};

  // Local state
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('invoice');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    notes: ''
  });

  // Get company info from localStorage
  const getCompanyFromStorage = () => {
    try {
      const companyData = localStorage.getItem('company');
      if (companyData) {
        return JSON.parse(companyData);
      }
      return null;
    } catch (error) {
      console.error('Error parsing company data from localStorage:', error);
      return null;
    }
  };

  // Load initial data
  useEffect(() => {
    // Load company info from localStorage
    const companyInfo = getCompanyFromStorage();
    setCompany(companyInfo);
  }, []);

  // Load invoice and client data
  useEffect(() => {
    const loadInvoiceData = async () => {
      console.log('=== Loading Invoice Data ===');
      console.log('Invoice ID:', invoiceId);
      console.log('getInvoice available:', !!getInvoice);
      console.log('getClient available:', !!getClient);
      
      if (!invoiceId || !getInvoice) {
        console.error('Missing required parameters:', { invoiceId, getInvoice: !!getInvoice });
        setError('Invoice ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get invoice details
        console.log('Fetching invoice details...');
        const invoiceResponse = await getInvoice(invoiceId);
        console.log('Invoice response:', invoiceResponse);
        
        const invoiceData = invoiceResponse?.data;
        
        if (!invoiceData) {
          console.error('No invoice data received');
          setError('Invoice not found');
          setLoading(false);
          return;
        }

        console.log('Invoice data loaded:', invoiceData);
        setInvoice(invoiceData);
        
        // Set initial payment amount to balance amount
        setPaymentData(prev => ({
          ...prev,
          amount: invoiceData.BalanceAmount || invoiceData.TotalAmount || 0
        }));

        // Get client details if clientId exists
        if (invoiceData.ClientId && getClient) {
          try {
            console.log('Fetching client details for ID:', invoiceData.ClientId);
            const clientResponse = await getClient(invoiceData.ClientId);
            console.log('Client response:', clientResponse);
            
            const clientData = clientResponse?.data;
            setClient(clientData);
          } catch (clientError) {
            console.warn('Could not load client details:', clientError);
            // Don't fail the entire page if client loading fails
          }
        }

      } catch (err) {
        console.error('Failed to load invoice:', err);
        setError(err.message || 'Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    loadInvoiceData();
  }, [invoiceId, getInvoice, getClient]);

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount || isNaN(amount)) return '0.00';
    const numAmount = Number(amount);
    const symbol = currency === 'USD' ? '$' : currency === 'PKR' ? 'Rs. ' : `${currency} `;
    return `${symbol}${numAmount.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getClientName = () => {
    if (client?.FullName) return client.FullName;
    if (client?.BusinessName) return client.BusinessName;
    if (client?.FirstName || client?.LastName) {
      return `${client.FirstName || ''} ${client.LastName || ''}`.trim();
    }
    if (invoice?.ClientName) return invoice.ClientName;
    return `Client #${invoice?.ClientId || 'Unknown'}`;
  };

  // Action handlers
  const handleBackToList = () => {
    navigate('/admin/showinvoices');
  };

  const handleEdit = () => {
    navigate(`/admin/showinvoices/edit/${invoiceId}`);
  };

  const handlePrint = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Generate PDF and open print dialog
      await toPDF({
        method: 'open', // This will open the PDF in a new window where user can print
        filename: `invoice-${invoice.InvoiceNumber}.pdf`
      });
    } catch (error) {
      console.error('Error generating PDF for print:', error);
      alert('Failed to generate PDF for printing. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Generate and download PDF
      await toPDF({
        method: 'save',
        filename: `invoice-${invoice.InvoiceNumber}.pdf`
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!sendInvoice || !invoice) return;

    try {
      await sendInvoice(invoiceId, {
        to: client?.Email || invoice.ClientEmail || '',
        subject: `Invoice ${invoice.InvoiceNumber}`,
        message: 'Please find attached invoice.'
      });
      
      // Refresh invoice data
      const invoiceResponse = await getInvoice(invoiceId);
      const updatedInvoice = invoiceResponse?.data;
      if (updatedInvoice) {
        setInvoice(updatedInvoice);
      }
      
      alert('Invoice sent successfully!');
    } catch (error) {
      console.error('Failed to send invoice:', error);
      alert('Failed to send invoice. Please try again.');
    }
  };

  const handleAddPayment = async () => {
    if (!markInvoiceAsPaid || !invoice) return;

    try {
      // For now, we'll use markInvoiceAsPaid if the payment amount equals the balance
      // In a real implementation, you might want a separate addPayment API endpoint
      const paymentAmount = parseFloat(paymentData.amount);
      const balanceAmount = invoice.BalanceAmount || 0;
      
      if (paymentAmount >= balanceAmount) {
        // Mark as fully paid
        await markInvoiceAsPaid(invoiceId, {
          amount: paymentAmount,
          paymentDate: paymentData.paymentDate,
          paymentMethod: paymentData.paymentMethod,
          notes: paymentData.notes
        });
      } else {
        // For partial payments, you might need a different API endpoint
        // For now, we'll show a message
        alert('Partial payment functionality needs to be implemented with a specific API endpoint.');
        return;
      }

      // Refresh invoice data
      const invoiceResponse = await getInvoice(invoiceId);
      const updatedInvoice = invoiceResponse?.data;
      if (updatedInvoice) {
        setInvoice(updatedInvoice);
      }
      
      setShowPaymentModal(false);
      alert(`Payment of ${formatCurrency(paymentAmount, invoice.Currency)} added successfully!`);
    } catch (error) {
      console.error('Failed to add payment:', error);
      alert('Failed to add payment. Please try again.');
    }
  };

  const calculateItemSubtotal = (item) => {
    const quantity = item.Quantity || 1;
    const unitPrice = item.UnitPrice || 0;
    const subtotal = quantity * unitPrice;
    
    let discountAmount = 0;
    if (item.Discount) {
      discountAmount = item.DiscountType === 'percentage' 
        ? subtotal * (item.Discount / 100)
        : item.Discount;
    }
    
    return subtotal - discountAmount;
  };

  // PDF-compatible styles
  const pdfStyles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '32px',
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      lineHeight: '1.4'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '32px'
    },
    companyInfo: {
      flex: 1
    },
    companyName: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#000000'
    },
    invoiceTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#000000',
      textAlign: 'right'
    },
    invoiceDetails: {
      textAlign: 'right',
      fontSize: '14px'
    },
    billToSection: {
      marginBottom: '32px'
    },
    billToTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '12px',
      color: '#000000'
    },
    billToBox: {
      backgroundColor: '#f5f5f5',
      padding: '16px',
      borderRadius: '4px',
      border: '1px solid #e0e0e0'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '32px',
      border: '1px solid #d1d5db'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      fontWeight: 'bold'
    },
    tableCell: {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      fontSize: '14px'
    },
    summary: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    summaryBox: {
      width: '256px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #e5e7eb'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '2px solid #000000',
      fontWeight: 'bold',
      fontSize: '18px'
    },
    balanceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      fontWeight: 'bold',
      fontSize: '18px'
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading invoice details...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Invoice</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={handleBackToList}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Invoices
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No invoice found
  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-4">The requested invoice could not be found.</p>
          <button
            onClick={handleBackToList}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Invoices
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Invoice #{invoice.InvoiceNumber}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                invoice.Status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                invoice.Status === 'Sent' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                invoice.Status === 'Draft' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                invoice.Status === 'Overdue' ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {invoice.Status}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handlePrint}
                disabled={isGeneratingPDF}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Printer className="w-4 h-4 mr-2" />
                )}
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                PDF
              </button>
              {invoice.Status !== 'Paid' && invoice.Status !== 'Voided' && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment
                </button>
              )}
              <button
                onClick={handleSendInvoice}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Via Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('invoice')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'invoice' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Invoice
            </button>
            <button 
              onClick={() => setActiveTab('payments')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payments' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payments
            </button>
            <button 
              onClick={() => setActiveTab('activity')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'activity' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Activity Log
            </button>
            <button 
              onClick={() => setActiveTab('stock')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'stock' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Stock
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      {activeTab === 'invoice' && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              {/* Regular Display Invoice (Tailwind CSS) */}
              <div className="block print:hidden">
                {/* Company Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {company?.Name || 'Your Company'}
                    </h2>
                    <div className="text-gray-600 space-y-1">
                      {company?.Address && <div>{company.Address}</div>}
                      {company?.City && company?.State && (
                        <div>{company.City}, {company.State}</div>
                      )}
                      {company?.PostalCode && <div>{company.PostalCode}</div>}
                      {company?.Country && <div>{company.Country}</div>}
                      {company?.Phone && <div>Phone: {company.Phone}</div>}
                      {company?.Email && <div>Email: {company.Email}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Invoice</h1>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between min-w-[200px]">
                        <span className="font-medium">Invoice #:</span>
                        <span>{invoice.InvoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Invoice Date:</span>
                        <span>{formatDate(invoice.InvoiceDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Due Date:</span>
                        <span>{formatDate(invoice.DueDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bill To Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill to:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900 mb-2">
                      {getClientName()}
                    </div>
                    {client && (
                      <div className="text-gray-600 space-y-1 text-sm">
                        {client.Email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {client.Email}
                          </div>
                        )}
                        {client.Mobile && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {client.Mobile}
                          </div>
                        )}
                        {client.StreetAddress1 && (
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                            <div>
                              <div>{client.StreetAddress1}</div>
                              {(client.City || client.State || client.PostalCode) && (
                                <div>
                                  {client.City}{client.State && `, ${client.State}`}{client.PostalCode && ` ${client.PostalCode}`}
                                </div>
                              )}
                              {client.Country && <div>{client.Country}</div>}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {invoice.Notes && (
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="font-medium mb-1">Description:</div>
                        <div>{invoice.Notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Item</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Description</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900">Unit Price</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900">Qty</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900">Discount</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.Items && invoice.Items.length > 0 ? (
                        invoice.Items.map((item, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-3">
                              {item.ItemName || item.ProductName || `Item ${index + 1}`}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              {item.Description || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right">
                              {formatCurrency(item.UnitPrice, invoice.Currency)}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right">
                              {item.Quantity || 1}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right">
                              {item.Discount ? (
                                item.DiscountType === 'percentage' 
                                  ? `${item.Discount}%`
                                  : formatCurrency(item.Discount, invoice.Currency)
                              ) : '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                              {formatCurrency(calculateItemSubtotal(item), invoice.Currency)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="border border-gray-300 px-4 py-3 text-center text-gray-500">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium">Subtotal:</span>
                        <span>{formatCurrency(invoice.SubtotalAmount || invoice.TotalAmount, invoice.Currency)}</span>
                      </div>
                      
                      {invoice.TaxAmount > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium">Tax:</span>
                          <span>{formatCurrency(invoice.TaxAmount, invoice.Currency)}</span>
                        </div>
                      )}
                      
                      {invoice.DiscountAmount > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium">Discount:</span>
                          <span className="text-red-600">-{formatCurrency(invoice.DiscountAmount, invoice.Currency)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between py-2 border-b-2 border-gray-900 font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(invoice.TotalAmount, invoice.Currency)}</span>
                      </div>
                      
                      {invoice.PaidAmount > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-200 text-emerald-600">
                          <span className="font-medium">Paid:</span>
                          <span>-{formatCurrency(invoice.PaidAmount, invoice.Currency)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between py-2 font-bold text-lg">
                        <span>Balance Due:</span>
                        <span className={invoice.BalanceAmount > 0 ? 'text-red-600' : 'text-emerald-600'}>
                          {formatCurrency(invoice.BalanceAmount || 0, invoice.Currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF-Optimized Version (Hidden, only for PDF generation) */}
              <div ref={targetRef} style={pdfStyles.container} className="hidden">
                {/* Company Header */}
                <div style={pdfStyles.header}>
                  <div style={pdfStyles.companyInfo}>
                    <h2 style={pdfStyles.companyName}>
                      {company?.Name || 'Your Company'}
                    </h2>
                    <div style={{ color: '#666666', fontSize: '14px' }}>
                      {company?.Address && <div>{company.Address}</div>}
                      {company?.City && company?.State && (
                        <div>{company.City}, {company.State}</div>
                      )}
                      {company?.PostalCode && <div>{company.PostalCode}</div>}
                      {company?.Country && <div>{company.Country}</div>}
                      {company?.Phone && <div>Phone: {company.Phone}</div>}
                      {company?.Email && <div>Email: {company.Email}</div>}
                    </div>
                  </div>
                  <div>
                    <h1 style={pdfStyles.invoiceTitle}>Invoice</h1>
                    <div style={pdfStyles.invoiceDetails}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '200px', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold' }}>Invoice #:</span>
                        <span>{invoice.InvoiceNumber}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold' }}>Invoice Date:</span>
                        <span>{formatDate(invoice.InvoiceDate)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>Due Date:</span>
                        <span>{formatDate(invoice.DueDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bill To Section */}
                <div style={pdfStyles.billToSection}>
                  <h3 style={pdfStyles.billToTitle}>Bill to:</h3>
                  <div style={pdfStyles.billToBox}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000000' }}>
                      {getClientName()}
                    </div>
                    {client && (
                      <div style={{ color: '#666666', fontSize: '14px' }}>
                        {client.Email && <div>✉ {client.Email}</div>}
                        {client.Mobile && <div>📞 {client.Mobile}</div>}
                        {client.StreetAddress1 && (
                          <div>
                            📍 {client.StreetAddress1}
                            {(client.City || client.State || client.PostalCode) && (
                              <div style={{ marginLeft: '16px' }}>
                                {client.City}{client.State && `, ${client.State}`}{client.PostalCode && ` ${client.PostalCode}`}
                              </div>
                            )}
                            {client.Country && <div style={{ marginLeft: '16px' }}>{client.Country}</div>}
                          </div>
                        )}
                      </div>
                    )}
                    {invoice.Notes && (
                      <div style={{ marginTop: '12px', fontSize: '14px', color: '#666666' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Description:</div>
                        <div>{invoice.Notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <table style={pdfStyles.table}>
                  <thead>
                    <tr style={pdfStyles.tableHeader}>
                      <td style={pdfStyles.tableCell}>Item</td>
                      <td style={pdfStyles.tableCell}>Description</td>
                      <td style={{ ...pdfStyles.tableCell, textAlign: 'right' }}>Unit Price</td>
                      <td style={{ ...pdfStyles.tableCell, textAlign: 'right' }}>Qty</td>
                      <td style={{ ...pdfStyles.tableCell, textAlign: 'right' }}>Discount</td>
                      <td style={{ ...pdfStyles.tableCell, textAlign: 'right' }}>Subtotal</td>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.Items && invoice.Items.length > 0 ? (
                      invoice.Items.map((item, index) => (
                        <tr key={index}>
                          <td style={pdfStyles.tableCell}>
                            {item.ItemName || item.ProductName || `Item ${index + 1}`}
                          </td>
                          <td style={pdfStyles.tableCell}>
                            {item.Description || '-'}
                          </td>
                          <td style={{ ...pdfStyles.tableCell, textAlign: 'right' }}>
                            {formatCurrency(item.UnitPrice, invoice.Currency)}
                          </td>
                          <td style={{ ...pdfStyles.tableCell, textAlign: 'right' }}>
                            {item.Quantity || 1}
                          </td>
                          <td style={{ ...pdfStyles.tableCell, textAlign: 'right' }}>
                            {item.Discount ? (
                              item.DiscountType === 'percentage' 
                                ? `${item.Discount}%`
                                : formatCurrency(item.Discount, invoice.Currency)
                            ) : '-'}
                          </td>
                          <td style={{ ...pdfStyles.tableCell, textAlign: 'right', fontWeight: 'bold' }}>
                            {formatCurrency(calculateItemSubtotal(item), invoice.Currency)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ ...pdfStyles.tableCell, textAlign: 'center', color: '#999999' }}>
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Summary */}
                <div style={pdfStyles.summary}>
                  <div style={pdfStyles.summaryBox}>
                    <div style={pdfStyles.summaryRow}>
                      <span style={{ fontWeight: 'bold' }}>Subtotal:</span>
                      <span>{formatCurrency(invoice.SubtotalAmount || invoice.TotalAmount, invoice.Currency)}</span>
                    </div>
                    
                    {invoice.TaxAmount > 0 && (
                      <div style={pdfStyles.summaryRow}>
                        <span style={{ fontWeight: 'bold' }}>Tax:</span>
                        <span>{formatCurrency(invoice.TaxAmount, invoice.Currency)}</span>
                      </div>
                    )}
                    
                    {invoice.DiscountAmount > 0 && (
                      <div style={pdfStyles.summaryRow}>
                        <span style={{ fontWeight: 'bold' }}>Discount:</span>
                        <span style={{ color: '#dc2626' }}>-{formatCurrency(invoice.DiscountAmount, invoice.Currency)}</span>
                      </div>
                    )}
                    
                    <div style={pdfStyles.totalRow}>
                      <span>Total:</span>
                      <span>{formatCurrency(invoice.TotalAmount, invoice.Currency)}</span>
                    </div>
                    
                    {invoice.PaidAmount > 0 && (
                      <div style={pdfStyles.summaryRow}>
                        <span style={{ fontWeight: 'bold', color: '#059669' }}>Paid:</span>
                        <span style={{ color: '#059669' }}>-{formatCurrency(invoice.PaidAmount, invoice.Currency)}</span>
                      </div>
                    )}
                    
                    <div style={pdfStyles.balanceRow}>
                      <span>Balance Due:</span>
                      <span style={{ color: invoice.BalanceAmount > 0 ? '#dc2626' : '#059669' }}>
                        {formatCurrency(invoice.BalanceAmount || 0, invoice.Currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content - placeholder for now */}
      {activeTab === 'payments' && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
            <p className="text-gray-500">Payment history functionality will be implemented here.</p>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
            <p className="text-gray-500">Activity log functionality will be implemented here.</p>
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Information</h3>
            <p className="text-gray-500">Stock information functionality will be implemented here.</p>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Outstanding balance: {formatCurrency(invoice.BalanceAmount || invoice.TotalAmount, invoice.Currency)}
                </p>
                {parseFloat(paymentData.amount) < (invoice.BalanceAmount || 0) && (
                  <p className="text-xs text-orange-600 mt-1">
                    Note: This is a partial payment. Full payment functionality may be limited.
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentData.paymentDate}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, paymentDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Check">Check</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Payment notes..."
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailsPage;