import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { useLeaveAttendance } from "../../../Contexts/LeaveContext/LeaveContext";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import Container from "../../../components/elements/container/Container";
import BodyHeader from "../../../components/elements/bodyHeader/BodyHeader";
import Alert from "../../../components/elements/Alert/Alert";
import Card from "../../../components/elements/card/Card";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import OutlineButton from "../../../components/elements/elements/buttons/outlineButton/OutlineButton";
import Skeleton from "../../../components/elements/skeleton/Skeleton";
import Table from "../../../components/elements/table/Table";
import Thead from "../../../components/elements/thead/Thead";
import TR from "../../../components/elements/tr/TR";
import TH from "../../../components/elements/th/TH";
import Tbody from "../../../components/elements/tbody/Tbody";
import TD from "../../../components/elements/td/TD";
import Badge from "../../../components/elements/Badge/Badge";
import Modall from "../../../components/elements/modal/Modal";

const EmployeeLeaveManagement = () => {
  const {
    leaveRequests,
    leaveTypes,
    leaveBalance,
    isLeaveRequestsLoading,
    isLoading,
    isProcessing,
    error,
    getLeaveRequests,
    getLeaveTypes,
    getLeaveBalance,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    clearError,
  } = useLeaveAttendance();

  // Get current user's employee ID - you should get this from your auth context
  const currentEmployeeId = 1; // Replace with actual employee ID from auth

  // Local state
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("requests"); // "requests", "balance", "apply"

  // Form data for leave request
  const [formData, setFormData] = useState({
    employeeId: currentEmployeeId,
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    notes: "",
    halfDay: false,
    emergencyContact: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // Load data on component mount
  useEffect(() => {
    getLeaveTypes();
    loadEmployeeLeaveRequests();
    loadLeaveBalance();
  }, [statusFilter, yearFilter]);

  // Load employee's leave requests
  const loadEmployeeLeaveRequests = () => {
    getLeaveRequests(
      currentEmployeeId,
      statusFilter || null,
      null,
      yearFilter
    );
  };

  // Load leave balance
  const loadLeaveBalance = () => {
    getLeaveBalance(currentEmployeeId, yearFilter);
  };

  // Filter leave requests based on search
  const filteredRequests = leaveRequests.filter((request) =>
    request.leaveType?.toLowerCase().includes(searchValue.toLowerCase()) ||
    request.reason?.toLowerCase().includes(searchValue.toLowerCase()) ||
    request.status?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.leaveTypeId) {
      errors.leaveTypeId = { message: "Leave type is required" };
    }
    
    if (!formData.startDate) {
      errors.startDate = { message: "Start date is required" };
    }
    
    if (!formData.endDate) {
      errors.endDate = { message: "End date is required" };
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate > endDate) {
        errors.endDate = { message: "End date must be after start date" };
      }
      
      // Check if start date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        errors.startDate = { message: "Start date cannot be in the past" };
      }
    }

    if (!formData.reason.trim()) {
      errors.reason = { message: "Reason is required" };
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      employeeId: currentEmployeeId,
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
      notes: "",
      halfDay: false,
      emergencyContact: "",
    });
    setFormErrors({});
  };

  // Handle create leave request
  const handleCreateRequest = async () => {
    if (!validateForm()) return;

    try {
      await createLeaveRequest(formData);
      setShowCreateModal(false);
      resetForm();
      loadEmployeeLeaveRequests();
      loadLeaveBalance(); // Refresh balance after request
    } catch (error) {
      console.error("Error creating leave request:", error);
    }
  };

  // Handle edit leave request
  const handleEditRequest = async () => {
    if (!validateForm()) return;

    try {
      await updateLeaveRequest(selectedRequest.id, formData);
      setShowEditModal(false);
      resetForm();
      setSelectedRequest(null);
      loadEmployeeLeaveRequests();
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  };

  // Handle delete leave request
  const handleDeleteRequest = async () => {
    try {
      await deleteLeaveRequest(selectedRequest.id);
      setShowDeleteModal(false);
      setSelectedRequest(null);
      loadEmployeeLeaveRequests();
      loadLeaveBalance(); // Refresh balance after deletion
    } catch (error) {
      console.error("Error deleting leave request:", error);
    }
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (request) => {
    setSelectedRequest(request);
    setFormData({
      employeeId: currentEmployeeId,
      leaveTypeId: request.leaveTypeId || "",
      startDate: request.startDate ? request.startDate.split('T')[0] : "",
      endDate: request.endDate ? request.endDate.split('T')[0] : "",
      reason: request.reason || "",
      notes: request.notes || "",
      halfDay: request.halfDay || false,
      emergencyContact: request.emergencyContact || "",
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (request) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  // Status options for filter
  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];

  // Leave type options
  const leaveTypeOptions = leaveTypes.map(type => ({
    label: type.name || type.typeName,
    value: type.id
  }));

  // Year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { label: `${currentYear}`, value: currentYear },
    { label: `${currentYear - 1}`, value: currentYear - 1 },
  ];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate leave duration
  const calculateDuration = (startDate, endDate, halfDay = false) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (halfDay && diffDays === 1) {
      return "0.5 day";
    }
    
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  // Get leave balance for specific type
  const getLeaveBalanceForType = (leaveTypeId) => {
    if (!leaveBalance || !Array.isArray(leaveBalance)) return 0;
    const balance = leaveBalance.find(b => b.leaveTypeId === leaveTypeId);
    return balance ? balance.remainingDays : 0;
  };

  // Render leave balance cards
  const renderLeaveBalanceCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leaveTypes.map(type => {
        const balance = getLeaveBalanceForType(type.id);
        const used = leaveBalance?.find(b => b.leaveTypeId === type.id)?.usedDays || 0;
        const total = leaveBalance?.find(b => b.leaveTypeId === type.id)?.totalDays || 0;
        
        return (
          <Card key={type.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-500">Available Days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{balance}</p>
                <p className="text-xs text-gray-500">{used}/{total} used</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${total > 0 ? (used / total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  // Render form fields
  const renderRequestForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectBox
          label="Leave Type"
          name="leaveTypeId"
          placeholder="Select leave type"
          optionList={leaveTypeOptions}
          value={formData.leaveTypeId}
          handleChange={(value) => handleSelectChange("leaveTypeId", value)}
          errors={formErrors}
          width="w-full"
        />

        <InputField
          label="Emergency Contact"
          name="emergencyContact"
          placeholder="Emergency contact number"
          type="tel"
          value={formData.emergencyContact}
          onChange={handleInputChange}
          errors={formErrors}
          width="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleInputChange}
          errors={formErrors}
          width="w-full"
        />

        <InputField
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleInputChange}
          errors={formErrors}
          width="w-full"
        />
      </div>

      <InputField
        label="Reason"
        name="reason"
        placeholder="Enter reason for leave"
        type="text"
        value={formData.reason}
        onChange={handleInputChange}
        errors={formErrors}
        width="w-full"
      />

      <InputField
        label="Additional Notes"
        name="notes"
        placeholder="Any additional notes (optional)"
        type="text"
        value={formData.notes}
        onChange={handleInputChange}
        errors={formErrors}
        width="w-full"
      />

      {formData.leaveTypeId && (
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            Available balance: <span className="font-medium">{getLeaveBalanceForType(formData.leaveTypeId)} days</span>
          </p>
          {formData.startDate && formData.endDate && (
            <p className="text-sm text-blue-800 mt-1">
              Requested duration: <span className="font-medium">
                {calculateDuration(formData.startDate, formData.endDate, formData.halfDay)}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Container className="p-6">
      <BodyHeader 
        heading="My Leave Requests" 
        subHeading="Manage your leave requests and check balances"
      />

      {error && (
        <Alert
          variant="danger"
          message={error}
          onClose={clearError}
          className="mb-4"
        />
      )}

      {/* Tab Navigation */}
      <div className="mt-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "requests"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("balance")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "balance"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Leave Balance
          </button>
          <button
            onClick={() => setActiveTab("apply")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "apply"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Apply for Leave
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "requests" && (
        <Card className="mt-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <SearchAndFilters
                  isFocused={isFocused}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  placeholder="Search requests..."
                />
                <SelectBox
                  name="statusFilter"
                  placeholder="Filter by status"
                  optionList={statusOptions}
                  value={statusFilter}
                  handleChange={(value) => setStatusFilter(value)}
                  width="w-40"
                />
                <SelectBox
                  name="yearFilter"
                  placeholder="Select year"
                  optionList={yearOptions}
                  value={yearFilter}
                  handleChange={(value) => setYearFilter(value)}
                  width="w-32"
                />
              </div>
              <FilledButton
                buttonText="Apply Leave"
                isIcon={true}
                icon={FiPlus}
                isIconLeft={true}
                onClick={() => setActiveTab("apply")}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLeaveRequestsLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex space-x-4">
                    <Skeleton width="120px" height="20px" />
                    <Skeleton width="100px" height="20px" />
                    <Skeleton width="100px" height="20px" />
                    <Skeleton width="80px" height="20px" />
                    <Skeleton width="200px" height="20px" />
                    <Skeleton width="80px" height="20px" />
                    <Skeleton width="100px" height="20px" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <Thead className="bg-gray-50">
                  <TR>
                    <TH>Leave Type</TH>
                    <TH>Start Date</TH>
                    <TH>End Date</TH>
                    <TH>Duration</TH>
                    <TH>Reason</TH>
                    <TH>Status</TH>
                    <TH>Applied Date</TH>
                    <TH>Actions</TH>
                  </TR>
                </Thead>
                <Tbody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <TR key={request.id}>
                        <TD className="font-medium text-gray-900">
                          {request.leaveType || "N/A"}
                        </TD>
                        <TD>{formatDate(request.startDate)}</TD>
                        <TD>{formatDate(request.endDate)}</TD>
                        <TD>{calculateDuration(request.startDate, request.endDate, request.halfDay)}</TD>
                        <TD className="max-w-xs truncate">
                          {request.reason || "N/A"}
                        </TD>
                        <TD>
                          <Badge variant={getStatusBadgeVariant(request.status)}>
                            {request.status || "Pending"}
                          </Badge>
                        </TD>
                        <TD>{formatDate(request.appliedDate || request.createdAt)}</TD>
                        <TD>
                          <div className="flex space-x-1">
                            {request.status?.toLowerCase() === 'pending' && (
                              <>
                                <button
                                  onClick={() => openEditModal(request)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Edit"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => openDeleteModal(request)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </TD>
                      </TR>
                    ))
                  ) : (
                    <TR>
                      <TD colSpan={8} className="text-center py-8 text-gray-500">
                        {searchValue ? "No leave requests found matching your search." : "No leave requests found."}
                      </TD>
                    </TR>
                  )}
                </Tbody>
              </Table>
            )}
          </div>
        </Card>
      )}

      {activeTab === "balance" && (
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="p-6">
                  <Skeleton width="100%" height="100px" />
                </Card>
              ))}
            </div>
          ) : (
            renderLeaveBalanceCards()
          )}
        </div>
      )}

      {activeTab === "apply" && (
        <Card className="mt-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Apply for Leave</h3>
            {renderRequestForm()}
            <div className="mt-6 flex justify-end space-x-3">
              <OutlineButton
                buttonText="Reset"
                onClick={resetForm}
                borderColor="border-gray-300"
                borderWidth="border"
                rounded="rounded-md"
                bgColor="bg-white"
                textColor="text-gray-700"
                height="h-10"
                width="w-auto"
                fontWeight="font-medium"
                fontSize="text-sm"
                px="px-4"
                hover="hover:bg-gray-50"
              />
              <FilledButton
                buttonText="Submit Request"
                onClick={handleCreateRequest}
                disabled={isProcessing}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Edit Request Modal */}
      <Modall
        title="Edit Leave Request"
        modalOpen={showEditModal}
        setModalOpen={setShowEditModal}
        okText="Update Request"
        cancelText="Cancel"
        okAction={handleEditRequest}
        cancelAction={() => {
          setShowEditModal(false);
          resetForm();
          setSelectedRequest(null);
        }}
        body={renderRequestForm()}
        width={800}
        okButtonDisabled={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modall
        title="Delete Leave Request"
        modalOpen={showDeleteModal}
        setModalOpen={setShowDeleteModal}
        okText="Delete"
        cancelText="Cancel"
        okAction={handleDeleteRequest}
        cancelAction={() => {
          setShowDeleteModal(false);
          setSelectedRequest(null);
        }}
        body={
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete this leave request? This action cannot be undone.
            </p>
          </div>
        }
        width={500}
        okButtonDisabled={isProcessing}
      />
    </Container>
  );
};

export default EmployeeLeaveManagement;