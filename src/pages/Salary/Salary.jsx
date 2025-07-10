import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Search,
  Filter,
  Download,
  DollarSign,
  FileText,
  TrendingUp,
  Activity,
  CreditCard,
  Receipt,
  Zap,
  UserCheck,
  Building
} from 'lucide-react';
import { useSalary } from '../../Contexts/SalaryManagementContext/SalaryManagementContext';
import Container from '../../components/elements/container/Container';
import Alert from '../../components/elements/Alert/Alert';
import Card from '../../components/elements/card/Card';
import OutlineButton from '../../components/elements/elements/buttons/OutlineButton/OutlineButton';
import FilledButton from '../../components/elements/elements/buttons/filledButton/FilledButton';
import SearchAndFilters from '../../components/elements/searchAndFilters/SearchAndFilters';
import SelectBox from '../../components/elements/selectBox/SelectBox';
import InputField from '../../components/elements/inputField/InputField';
import Table from '../../components/elements/table/Table';
import Thead from '../../components/elements/thead/Thead';
import TR from '../../components/elements/tr/TR';
import TH from '../../components/elements/th/TH';
import Tbody from '../../components/elements/tbody/Tbody';
import TD from '../../components/elements/td/TD';
import Dropdown from '../../components/elements/dropdown/Dropdown';
import Pagination from '../../components/elements/Pagination/Pagination';
import Modall from '../../components/elements/modal/Modal';


const Salary = () => {
  // Context
  const {
    // State
    salaries,
    salariesPagination,
    payslipData,
    isSalariesLoading,
    isLoading,
    isProcessing,
    error,
    
    // Methods
    getSalaries,
    getSalary,
    generateSalary,
    processSalary,
    markSalaryAsPaid,
    getPayslip,
    bulkGenerateSalaries,
    deleteSalary,
    clearError,
    clearSalaryDetail,
    clearPayslipData
  } = useSalary();

  // Local state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedSalaryId, setSelectedSalaryId] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [deleteSalaryId, setDeleteSalaryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form data
  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    year: '',
    paymentMethod: '',
    paymentReference: '',
    bulkEmployeeIds: []
  });

  // Mock employee data (replace with actual employee context)
  const [employeeData, setEmployeeData] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadSalaries();
    // Load employees from your employee context
    // getEmployees();
  }, [currentPage, itemsPerPage, filterStatus, filterEmployee, filterMonth, filterYear]);

  const loadSalaries = async () => {
    try {
      await getSalaries(
        filterEmployee || null,
        filterMonth || null,
        filterYear || null,
        filterStatus || null,
        currentPage,
        itemsPerPage
      );
    } catch (error) {
      console.error('Failed to load salaries:', error);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = salaries.length;
    const draft = salaries.filter(s => s.status === 'Draft').length;
    const processed = salaries.filter(s => s.status === 'Processed').length;
    const paid = salaries.filter(s => s.status === 'Paid').length;
    const totalAmount = salaries
      .filter(s => s.status === 'Paid')
      .reduce((sum, s) => sum + (s.netSalary || 0), 0);

    return { total, draft, processed, paid, totalAmount };
  }, [salaries]);

  // Filter salary data based on search term
  const filteredSalaryData = useMemo(() => {
    if (!searchTerm) return salaries;
    return salaries.filter(salary =>
      salary.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [salaries, searchTerm]);

  // Handlers
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      month: '',
      year: '',
      paymentMethod: '',
      paymentReference: '',
      bulkEmployeeIds: []
    });
  };

  const handleAddSalary = async () => {
    try {
      await generateSalary({
        employeeId: parseInt(formData.employeeId),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
      });
      setShowAddModal(false);
      resetForm();
      loadSalaries();
    } catch (error) {
      console.error('Failed to generate salary:', error);
    }
  };

  const handleBulkSalary = async () => {
    try {
      await bulkGenerateSalaries({
        employeeIds: formData.bulkEmployeeIds.map(id => parseInt(id)),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
      });
      setShowBulkModal(false);
      resetForm();
      loadSalaries();
    } catch (error) {
      console.error('Failed to generate bulk salaries:', error);
    }
  };

  const handlePaySalary = async () => {
    try {
      await markSalaryAsPaid(selectedSalaryId, {
        paymentMethod: formData.paymentMethod,
        paymentReference: formData.paymentReference,
      });
      setShowPayModal(false);
      setFormData(prev => ({ ...prev, paymentMethod: '', paymentReference: '' }));
      loadSalaries();
    } catch (error) {
      console.error('Failed to mark salary as paid:', error);
    }
  };

  const handleProcessSalary = async (id) => {
    try {
      await processSalary(id);
      loadSalaries();
    } catch (error) {
      console.error('Failed to process salary:', error);
    }
  };

  const handleViewDetails = async (salary) => {
    setSelectedSalary(salary);
    setShowDetailsModal(true);
  };

  const handleViewPayslip = async (salaryId) => {
    try {
      setSelectedSalaryId(salaryId);
      await getPayslip(salaryId);
      setShowPayslipModal(true);
    } catch (error) {
      console.error('Failed to load payslip:', error);
    }
  };

  const handleMarkAsPaid = (salaryId) => {
    setSelectedSalaryId(salaryId);
    setShowPayModal(true);
  };

  const handleDeleteSalary = (id) => {
    setDeleteSalaryId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSalary(deleteSalaryId);
      setShowConfirmDelete(false);
      loadSalaries();
    } catch (error) {
      console.error('Failed to delete salary:', error);
    }
  };

  const handleBulkEmployeeChange = (employeeId) => {
    setFormData(prev => ({
      ...prev,
      bulkEmployeeIds: prev.bulkEmployeeIds.includes(employeeId)
        ? prev.bulkEmployeeIds.filter(id => id !== employeeId)
        : [...prev.bulkEmployeeIds, employeeId],
    }));
  };

  // Utility functions
  const getStatusBadge = (status) => {
    const variants = {
      'Draft': 'secondary',
      'Processed': 'warning',
      'Paid': 'success'
    };
    
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || month;
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1)
  }));

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Processed', label: 'Processed' },
    { value: 'Paid', label: 'Paid' }
  ];

  const paymentMethodOptions = [
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Cheque', label: 'Cheque' },
    { value: 'Direct Deposit', label: 'Direct Deposit' },
    { value: 'Mobile Payment', label: 'Mobile Payment' }
  ];

  const employeeOptions = employeeData.map(emp => ({
    value: emp.id,
    label: `${emp.firstName} ${emp.lastName} - ${emp.email}`
  }));

  return (
    <Container className="py-6 px-4 max-w-7xl mx-auto">
      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          message={error}
          onClose={clearError}
          className="mb-4"
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
                <p className="text-gray-600">Generate, process, and manage employee salaries</p>
              </div>
            </div>
            <div className="flex gap-2">
              <OutlineButton
                buttonText="Export"
                icon={Download}
                isIcon={true}
                isIconLeft={true}
                borderColor="border-gray-300"
                borderWidth="border"
                rounded="rounded-lg"
                bgColor="bg-white"
                textColor="text-gray-700"
                height="h-10"
                fontWeight="font-medium"
                fontSize="text-sm"
                px="px-4"
                hover="hover:bg-gray-50"
              />
              <FilledButton
                buttonText="Bulk Generate"
                icon={Users}
                isIcon={true}
                isIconLeft={true}
                bgColor="bg-blue-600"
                textColor="text-white"
                height="h-10"
                fontWeight="font-medium"
                fontSize="text-sm"
                px="px-4"
                onClick={() => setShowBulkModal(true)}
              />
              <FilledButton
                buttonText="Generate Salary"
                icon={Plus}
                isIcon={true}
                isIconLeft={true}
                bgColor="bg-blue-600"
                textColor="text-white"
                height="h-10"
                fontWeight="font-medium"
                fontSize="text-sm"
                px="px-4"
                onClick={() => setShowAddModal(true)}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 text-center">
          <div className="text-blue-600 mb-2 flex justify-center">
            <Activity size={28} />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">{salariesPagination?.totalItems || 0}</h3>
          <p className="text-sm text-gray-600">Total Records</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-yellow-600 mb-2 flex justify-center">
            <Clock size={28} />
          </div>
          <h3 className="text-2xl font-bold text-yellow-600">{stats.processed}</h3>
          <p className="text-sm text-gray-600">Processed</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-green-600 mb-2 flex justify-center">
            <CheckCircle size={28} />
          </div>
          <h3 className="text-2xl font-bold text-green-600">{stats.paid}</h3>
          <p className="text-sm text-gray-600">Paid</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-indigo-600 mb-2 flex justify-center">
            <DollarSign size={28} />
          </div>
          <h3 className="text-2xl font-bold text-indigo-600">{formatCurrency(stats.totalAmount)}</h3>
          <p className="text-sm text-gray-600">Total Paid</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <SearchAndFilters
              searchValue={searchTerm}
              setSearchValue={setSearchTerm}
              placeholder="Search by employee name..."
              isFocused={false}
            />
          </div>
          <SelectBox
            placeholder="Filter by Status"
            optionList={statusOptions}
            value={filterStatus}
            handleChange={(value) => {
              setFilterStatus(value);
              setCurrentPage(1);
            }}
            width="w-full"
          />
          <SelectBox
            placeholder="Filter by Employee"
            optionList={employeeOptions}
            value={filterEmployee}
            handleChange={(value) => {
              setFilterEmployee(value);
              setCurrentPage(1);
            }}
            width="w-full"
          />
          <SelectBox
            placeholder="Filter by Month"
            optionList={monthOptions}
            value={filterMonth}
            handleChange={(value) => {
              setFilterMonth(value);
              setCurrentPage(1);
            }}
            width="w-full"
          />
        </div>
        <div className="mt-4">
          <InputField
            placeholder="Filter by Year"
            type="number"
            value={filterYear}
            onChange={(e) => {
              setFilterYear(e.target.value);
              setCurrentPage(1);
            }}
            width="w-full md:w-48"
          />
        </div>
      </Card>

      {/* Main Salary Table */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Salary Records</h2>
          <p className="text-sm text-gray-600">
            Showing {filteredSalaryData.length} of {salariesPagination?.totalItems || 0} records
          </p>
        </div>

        {isSalariesLoading ? (
          <div className="p-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 mb-4">
                <Skeleton width="60px" height="40px" borderRadius="8px" />
                <Skeleton width="200px" height="20px" borderRadius="4px" />
                <Skeleton width="150px" height="20px" borderRadius="4px" />
                <Skeleton width="100px" height="20px" borderRadius="4px" />
                <Skeleton width="80px" height="20px" borderRadius="4px" />
              </div>
            ))}
          </div>
        ) : filteredSalaryData.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No salary records found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus || filterEmployee || filterMonth || filterYear
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by generating your first salary record'
              }
            </p>
            {!searchTerm && !filterStatus && !filterEmployee && !filterMonth && !filterYear && (
              <FilledButton
                buttonText="Generate First Salary"
                icon={Plus}
                isIcon={true}
                isIconLeft={true}
                bgColor="bg-blue-600"
                onClick={() => setShowAddModal(true)}
              />
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <Thead className="bg-gray-50">
                <TR>
                  <TH>Employee</TH>
                  <TH>Period</TH>
                  <TH>Basic Salary</TH>
                  <TH>Net Salary</TH>
                  <TH>Status</TH>
                  <TH>Payment</TH>
                  <TH className="text-center">Actions</TH>
                </TR>
              </Thead>
              <Tbody>
                {filteredSalaryData.map(salary => (
                  <TR key={salary.id}>
                    <TD>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-xs font-medium">
                          {salary.employeeName ?
                            salary.employeeName.split(' ').map(n => n[0]).join('') :
                            'N/A'
                          }
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{salary.employeeName || 'Unknown Employee'}</div>
                          <div className="text-sm text-gray-500">ID: {salary.employeeId}</div>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium">{getMonthName(salary.month)} {salary.year}</div>
                          <div className="text-sm text-gray-500">{salary.workingDays} working days</div>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="font-medium">{formatCurrency(salary.basicSalary)}</div>
                      <div className="text-sm text-gray-500">Gross: {formatCurrency(salary.grossSalary)}</div>
                    </TD>
                    <TD>
                      <div className="font-bold text-green-600">{formatCurrency(salary.netSalary)}</div>
                      <div className="text-sm text-gray-500">Deductions: {formatCurrency(salary.totalDeductions)}</div>
                    </TD>
                    <TD>
                      {getStatusBadge(salary.status)}
                    </TD>
                    <TD>
                      {salary.paymentMethod ? (
                        <div>
                          <div className="font-medium">{salary.paymentMethod}</div>
                          {salary.paymentReference && (
                            <div className="text-sm text-gray-500">Ref: {salary.paymentReference}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">Not paid</span>
                      )}
                    </TD>
                    <TD className="text-center">
                      <Dropdown
                        buttonText="Actions"
                        buttonClassName="text-sm"
                        items={[
                          { label: 'View Details', action: () => handleViewDetails(salary) },
                          { label: 'View Payslip', action: () => handleViewPayslip(salary.id) },
                          ...(salary.status === 'Draft' ? [
                            { label: 'Process', action: () => handleProcessSalary(salary.id) },
                            { label: 'Delete', action: () => handleDeleteSalary(salary.id) }
                          ] : []),
                          ...(salary.status === 'Processed' ? [
                            { label: 'Mark as Paid', action: () => handleMarkAsPaid(salary.id) }
                          ] : [])
                        ]}
                        onSelect={(item) => item.action()}
                      />
                    </TD>
                  </TR>
                ))}
              </Tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {salariesPagination?.totalPages > 1 && (
          <div className="p-6 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={salariesPagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Generate Salary Modal */}
      <Modall
        title="Generate Salary"
        modalOpen={showAddModal}
        setModalOpen={setShowAddModal}
        okText="Generate Salary"
        cancelText="Cancel"
        okAction={handleAddSalary}
        cancelAction={() => setShowAddModal(false)}
        okButtonDisabled={isProcessing || !formData.employeeId || !formData.month || !formData.year}
        body={
          <div className="space-y-4">
            <SelectBox
              label="Employee *"
              placeholder="Select Employee"
              optionList={employeeOptions}
              value={formData.employeeId}
              handleChange={(value) => handleInputChange('employeeId', value)}
              width="w-full"
            />
            <div className="grid grid-cols-2 gap-4">
              <SelectBox
                label="Month *"
                placeholder="Select Month"
                optionList={monthOptions}
                value={formData.month}
                handleChange={(value) => handleInputChange('month', value)}
                width="w-full"
              />
              <InputField
                label="Year *"
                type="number"
                placeholder="Enter Year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                width="w-full"
              />
            </div>
          </div>
        }
      />

      {/* Bulk Generate Modal */}
      <Modall
        title="Bulk Generate Salaries"
        modalOpen={showBulkModal}
        setModalOpen={setShowBulkModal}
        okText={`Generate ${formData.bulkEmployeeIds.length} Salaries`}
        cancelText="Cancel"
        okAction={handleBulkSalary}
        cancelAction={() => setShowBulkModal(false)}
        okButtonDisabled={isProcessing || formData.bulkEmployeeIds.length === 0 || !formData.month || !formData.year}
        width={700}
        body={
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Employees *</label>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                <div className="mb-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.bulkEmployeeIds.length === employeeData.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('bulkEmployeeIds', employeeData.map(emp => emp.id.toString()));
                        } else {
                          handleInputChange('bulkEmployeeIds', []);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </label>
                  <hr className="my-2" />
                </div>
                {employeeData.map(employee => (
                  <label key={employee.id} className="flex items-center space-x-2 mb-1">
                    <input
                      type="checkbox"
                      checked={formData.bulkEmployeeIds.includes(employee.id.toString())}
                      onChange={() => handleBulkEmployeeChange(employee.id.toString())}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">{employee.firstName} {employee.lastName}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {formData.bulkEmployeeIds.length} employee(s) selected
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectBox
                label="Month *"
                placeholder="Select Month"
                optionList={monthOptions}
                value={formData.month}
                handleChange={(value) => handleInputChange('month', value)}
                width="w-full"
              />
              <InputField
                label="Year *"
                type="number"
                placeholder="Enter Year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                width="w-full"
              />
            </div>
          </div>
        }
      />

      {/* Mark as Paid Modal */}
      <Modall
        title="Mark Salary as Paid"
        modalOpen={showPayModal}
        setModalOpen={setShowPayModal}
        okText="Mark as Paid"
        cancelText="Cancel"
        okAction={handlePaySalary}
        cancelAction={() => setShowPayModal(false)}
        okButtonDisabled={isProcessing || !formData.paymentMethod || !formData.paymentReference}
        body={
          <div className="space-y-4">
            <SelectBox
              label="Payment Method *"
              placeholder="Select Payment Method"
              optionList={paymentMethodOptions}
              value={formData.paymentMethod}
              handleChange={(value) => handleInputChange('paymentMethod', value)}
              width="w-full"
            />
            <InputField
              label="Payment Reference *"
              placeholder="Enter Payment Reference (Transaction ID, Check Number, etc.)"
              value={formData.paymentReference}
              onChange={(e) => handleInputChange('paymentReference', e.target.value)}
              width="w-full"
            />
          </div>
        }
      />

      {/* View Details Modal */}
      <Modall
        title="Salary Details"
        modalOpen={showDetailsModal}
        setModalOpen={setShowDetailsModal}
        okText="Close"
        cancelText=""
        okAction={() => setShowDetailsModal(false)}
        cancelAction={() => setShowDetailsModal(false)}
        width={800}
        body={
          selectedSalary && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Employee Information</h3>
                  <p><strong>Name:</strong> {selectedSalary.employeeName}</p>
                  <p><strong>Period:</strong> {getMonthName(selectedSalary.month)} {selectedSalary.year}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Attendance Summary</h3>
                  <p><strong>Working Days:</strong> {selectedSalary.workingDays}</p>
                  <p><strong>Present Days:</strong> {selectedSalary.presentDays}</p>
                  <p><strong>Leave Days:</strong> {selectedSalary.leaveDays}</p>
                  <p><strong>Overtime Hours:</strong> {selectedSalary.overtimeHours}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Salary Breakdown</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p><strong>Basic Salary:</strong> {formatCurrency(selectedSalary.basicSalary)}</p>
                    <p><strong>Total Earnings:</strong> {formatCurrency(selectedSalary.totalEarnings)}</p>
                    <p><strong>Gross Salary:</strong> {formatCurrency(selectedSalary.grossSalary)}</p>
                  </div>
                  <div>
                    <p><strong>Total Deductions:</strong> {formatCurrency(selectedSalary.totalDeductions)}</p>
                    <p><strong>Taxable Income:</strong> {formatCurrency(selectedSalary.taxableIncome)}</p>
                    <p className="text-lg font-bold text-green-600">
                      <strong>Net Salary:</strong> {formatCurrency(selectedSalary.netSalary)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedSalary.paymentMethod && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                  <p><strong>Payment Method:</strong> {selectedSalary.paymentMethod}</p>
                  <p><strong>Payment Reference:</strong> {selectedSalary.paymentReference}</p>
                </div>
              )}
            </div>
          )
        }
      />

      {/* Payslip Modal */}
      <Modall
        title="Employee Payslip"
        modalOpen={showPayslipModal}
        setModalOpen={setShowPayslipModal}
        okText="Close"
        cancelText="Download PDF"
        okAction={() => setShowPayslipModal(false)}
        cancelAction={() => {/* Implement PDF download */}}
        width={900}
        body={
          payslipData ? (
            <div className="space-y-6">
              {/* Company Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold">{payslipData.company?.name}</h2>
                <p className="text-gray-600">{payslipData.company?.address}</p>
                <p className="text-gray-600">{payslipData.company?.email}</p>
              </div>

              {/* Employee & Period Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Employee Information</h3>
                  <p><strong>Name:</strong> {payslipData.employee?.fullName}</p>
                  <p><strong>Code:</strong> {payslipData.employee?.employeeCode}</p>
                  <p><strong>Position:</strong> {payslipData.employee?.jobTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pay Period</h3>
                  <p><strong>Period:</strong> {payslipData.salaryPeriod?.period}</p>
                  <p><strong>Generated:</strong> {new Date(payslipData.generatedOn).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Attendance Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Attendance Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center border rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">{payslipData.attendance?.workingDays}</div>
                    <div className="text-sm text-gray-600">Working Days</div>
                  </div>
                  <div className="text-center border rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">{payslipData.attendance?.presentDays}</div>
                    <div className="text-sm text-gray-600">Present Days</div>
                  </div>
                  <div className="text-center border rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">{payslipData.attendance?.leaveDays}</div>
                    <div className="text-sm text-gray-600">Leave Days</div>
                  </div>
                  <div className="text-center border rounded-lg p-3">
                    <div className="text-2xl font-bold text-indigo-600">{payslipData.attendance?.overtimeHours}</div>
                    <div className="text-sm text-gray-600">Overtime Hours</div>
                  </div>
                </div>
              </div>

              {/* Earnings and Deductions */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">Earnings</h3>
                  <div className="border rounded-lg p-4 bg-green-50">
                    {payslipData.earnings?.map((earning, index) => (
                      <div key={index} className="flex justify-between mb-2">
                        <span>{earning.componentName}</span>
                        <span className="font-medium">{formatCurrency(earning.amount)}</span>
                      </div>
                    )) || <p className="text-gray-600">No earnings data</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">Deductions</h3>
                  <div className="border rounded-lg p-4 bg-red-50">
                    {payslipData.deductions?.map((deduction, index) => (
                      <div key={index} className="flex justify-between mb-2">
                        <span>{deduction.componentName}</span>
                        <span className="font-medium">{formatCurrency(deduction.amount)}</span>
                      </div>
                    )) || <p className="text-gray-600">No deductions</p>}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Salary Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span className="font-medium">{formatCurrency(payslipData.summary?.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Earnings:</span>
                        <span className="font-medium text-green-600">{formatCurrency(payslipData.summary?.totalEarnings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Deductions:</span>
                        <span className="font-medium text-red-600">{formatCurrency(payslipData.summary?.totalDeductions)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Gross Salary:</span>
                        <span className="font-medium">{formatCurrency(payslipData.summary?.grossSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxable Income:</span>
                        <span className="font-medium">{formatCurrency(payslipData.summary?.taxableIncome)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Net Salary:</span>
                        <span className="text-green-600">{formatCurrency(payslipData.summary?.netSalary)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading payslip...</p>
            </div>
          )
        }
      />

      {/* Delete Confirmation Modal */}
      <Modall
        title="Confirm Delete"
        modalOpen={showConfirmDelete}
        setModalOpen={setShowConfirmDelete}
        okText="Delete"
        cancelText="Cancel"
        okAction={confirmDelete}
        cancelAction={() => setShowConfirmDelete(false)}
        okButtonDisabled={isLoading}
        body={
          <div className="text-center">
            <Trash2 size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Salary Record?</h3>
            <p className="text-gray-600">
              This action cannot be undone. Are you sure you want to delete this salary record?
            </p>
          </div>
        }
      />
    </Container>
  );
};

export default Salary;