import React, { useState, useEffect, useCallback } from 'react';
import { useFinanceReports, REPORT_TYPES, REPORT_TYPE_LABELS } from '../../../Contexts/FinanceReportsContext';

// Toast notification component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 min-w-[300px] animate-slide-in`}>
      <span className="text-lg font-bold">{icon}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200 ml-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Quick Reports Dashboard Component
const QuickReportsDashboard = () => {
  const { 
    quickReports, 
    getQuickProfitLoss, 
    getQuickCashFlow, 
    getQuickExpenseAnalysis,
    loading 
  } = useFinanceReports();

  const [activeQuickReport, setActiveQuickReport] = useState(null);

  const quickReportCards = [
    {
      id: 'profitLoss',
      title: 'Quick Profit & Loss',
      description: 'Current month P&L summary',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: '📊',
      action: getQuickProfitLoss
    },
    {
      id: 'cashFlow', 
      title: 'Quick Cash Flow',
      description: 'Last 30 days cash flow',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: '💰',
      action: getQuickCashFlow
    },
    {
      id: 'expenseAnalysis',
      title: 'Quick Expense Analysis', 
      description: 'Current month expenses',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: '📈',
      action: getQuickExpenseAnalysis
    }
  ];

  const handleQuickReport = async (reportData) => {
    try {
      setActiveQuickReport(reportData.id);
      await reportData.action();
    } catch (error) {
      console.error('Quick report error:', error);
    } finally {
      setActiveQuickReport(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {quickReportCards.map((card) => (
        <div key={card.id} className={`${card.color} rounded-xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">{card.icon}</span>
            <button
              onClick={() => handleQuickReport(card)}
              disabled={loading || activeQuickReport === card.id}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {activeQuickReport === card.id ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Loading...
                </div>
              ) : (
                'Generate'
              )}
            </button>
          </div>
          <h3 className="text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-white text-opacity-90 mb-4">{card.description}</p>
          
          {quickReports[card.id] && (
            <div className="bg-white bg-opacity-10 rounded-lg p-3 mt-4">
              <div className="text-sm opacity-90">Last generated:</div>
              <div className="font-semibold">Just now</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Report Generation Modal
const ReportGenerationModal = ({ isOpen, onClose, onSuccess }) => {
  const { generateReport, generating } = useFinanceReports();
  const [formData, setFormData] = useState({
    reportName: '',
    reportType: '',
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Set default dates (current month)
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setFormData(prev => ({
        ...prev,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reportName.trim()) newErrors.reportName = 'Report name is required';
    if (!formData.reportType) newErrors.reportType = 'Report type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await generateReport({
        reportName: formData.reportName.trim(),
        reportType: formData.reportType,
        startDate: formData.startDate,
        endDate: formData.endDate
      });
      
      onSuccess('Report generated successfully!');
      onClose();
      setFormData({ reportName: '', reportType: '', startDate: '', endDate: '' });
    } catch (error) {
      console.error('Generate report error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Generate Financial Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Name *
              </label>
              <input
                type="text"
                value={formData.reportName}
                onChange={(e) => setFormData(prev => ({ ...prev, reportName: e.target.value }))}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.reportName ? 'border-red-500' : ''}`}
                placeholder="Enter report name"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              {errors.reportName && <p className="text-red-500 text-sm mt-1">{errors.reportName}</p>}
            </div>

            {/* Report Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Type *
              </label>
              <select
                value={formData.reportType}
                onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value }))}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.reportType ? 'border-red-500' : ''}`}
              >
                <option value="">Select report type</option>
                {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {errors.reportType && <p className="text-red-500 text-sm mt-1">{errors.reportType}</p>}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.startDate ? 'border-red-500' : ''}`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.endDate ? 'border-red-500' : ''}`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={generating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reports Table Component
const ReportsTable = ({ onViewReport, onDeleteReport }) => {
  const {
    reports,
    loading,
    pagination,
    filters,
    sorting,
    setPagination,
    setFilters,
    setSorting,
    getReports
  } = useFinanceReports();

  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput });
        getReports({ search: searchInput });
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchInput, filters.search]); // Removed setFilters, getReports to prevent loops

  const handleSort = (column) => {
    const newSortAscending = sorting.sortBy === column ? !sorting.sortAscending : false;
    setSorting(column, newSortAscending);
    getReports({ sortBy: column, sortAscending: newSortAscending });
  };

  const handlePageChange = (newPage) => {
    setPagination({ page: newPage });
    getReports({ page: newPage });
  };

  const handleReportTypeFilter = (reportType) => {
    setFilters({ reportType });
    getReports({ reportType });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Generated: 'bg-green-100 text-green-800',
      Processing: 'bg-yellow-100 text-yellow-800',
      Failed: 'bg-red-100 text-red-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Financial Reports</h3>
          
          {/* Search and Filters */}
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <select
              value={filters.reportType || ''}
              onChange={(e) => handleReportTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleSort('ReportName')}>
                <div className="flex items-center gap-2">
                  Report Name
                  <svg className={`w-4 h-4 transform transition-transform duration-200 ${sorting.sortBy === 'ReportName' ? (sorting.sortAscending ? 'rotate-180' : '') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleSort('ReportType')}>
                <div className="flex items-center gap-2">
                  Type
                  <svg className={`w-4 h-4 transform transition-transform duration-200 ${sorting.sortBy === 'ReportType' ? (sorting.sortAscending ? 'rotate-180' : '') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Period</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleSort('GeneratedAt')}>
                <div className="flex items-center gap-2">
                  Generated
                  <svg className={`w-4 h-4 transform transition-transform duration-200 ${sorting.sortBy === 'GeneratedAt' ? (sorting.sortAscending ? 'rotate-180' : '') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="ml-3 text-gray-600">Loading reports...</span>
                  </div>
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">No reports found</p>
                    <p>Generate your first financial report to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.Id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-800">{report.ReportName}</div>
                    <div className="text-sm text-gray-600">by {report.GeneratedByUserName}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {REPORT_TYPE_LABELS[report.ReportType] || report.ReportType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <div className="text-sm">
                      {formatDate(report.StartDate)} - {formatDate(report.EndDate)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(report.Status)}`}>
                      {report.Status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <div className="text-sm">{formatDate(report.GeneratedAt)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewReport(report)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="View Report"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteReport(report)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete Report"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && reports.length > 0 && (
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.totalItems)} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} reports
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === pagination.page;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Finance Reports Component
const FinanceReports = () => {
  const { getReports, deleteReport, getReport, error, clearError } = useFinanceReports();
  
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Load reports on component mount - FIXED: Remove getReports from dependencies
  useEffect(() => {
    getReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  // Handle API errors with toast
  useEffect(() => {
    if (error) {
      addToast(error, 'error');
      clearError();
    }
  }, [error, clearError]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleViewReport = async (report) => {
    try {
      await getReport(report.Id);
      setSelectedReport(report);
    } catch (error) {
      addToast('Failed to load report details', 'error');
    }
  };

  const handleDeleteReport = async (report) => {
    try {
      await deleteReport(report.Id);
      addToast('Report deleted successfully', 'success');
      setShowDeleteConfirm(null);
      // Refresh the list after deletion
      getReports(); 
    } catch (error) {
      addToast('Failed to delete report', 'error');
    }
  };

  const handleGenerateSuccess = (message) => {
    addToast(message, 'success');
    // Refresh the list after generation
    getReports(); 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Reports</h1>
            <p className="text-gray-600">Generate and manage comprehensive financial reports for your business</p>
          </div>
          
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Generate Report
          </button>
        </div>
      </div>

      {/* Quick Reports Dashboard */}
      <QuickReportsDashboard />

      {/* Reports Table */}
      <ReportsTable
        onViewReport={handleViewReport}
        onDeleteReport={(report) => setShowDeleteConfirm(report)}
      />

      {/* Report Generation Modal */}
      <ReportGenerationModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onSuccess={handleGenerateSuccess}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 mx-4 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Report</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{showDeleteConfirm.ReportName}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReport(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report View Modal - Basic implementation */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{selectedReport.ReportName}</h2>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-blue-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Report Details</h3>
                <p className="text-gray-600 mb-4">
                  Type: {REPORT_TYPE_LABELS[selectedReport.ReportType] || selectedReport.ReportType}
                </p>
                <p className="text-gray-600 mb-4">
                  Period: {new Date(selectedReport.StartDate).toLocaleDateString()} - {new Date(selectedReport.EndDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Generated: {new Date(selectedReport.GeneratedAt).toLocaleString()}
                </p>
                {/* Add detailed report visualization here based on report type */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FinanceReports;