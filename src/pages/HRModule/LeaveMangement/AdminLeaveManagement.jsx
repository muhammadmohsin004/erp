import React, { useState, useEffect } from "react";
import { FiCheck, FiX, FiEye, FiFilter, FiDownload } from "react-icons/fi";
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
import Pagination from "../../../components/elements/pagination/Pagination";

const AdminLeaveManagement = () => {
  const {
    leaveRequests,
    leaveRequestDetail,
    leaveTypes,
    leaveRequestsPagination,
    isLeaveRequestsLoading,
    isLoading,
    isProcessing,
    error,
    getLeaveRequests,
    getLeaveRequest,
    getLeaveTypes,
    approveLeaveRequest,
    rejectLeaveRequest,
    deleteLeaveRequest,
    clearLeaveRequestDetail,
    clearError,
  } = useLeaveAttendance();

  // Local state
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [filters, setFilters] = useState({
    employeeId: "",
    status: "",
    leaveType: "",
    year: new Date().getFullYear(),
    fromDate: "",
    toDate: "",
  });

  // Approval/Rejection data
  const [approvalData, setApprovalData] = useState({
    remarks: "",
  });

  const [rejectionData, setRejectionData] = useState({
    remarks: "",
    reason: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Load data on component mount
  useEffect(() => {
    getLeaveTypes();
    loadLeaveRequests();
  }, [filters]);

  // Load leave requests with filters
  const loadLeaveRequests = () => {
    getLeaveRequests(
      filters.employeeId || null,
      filters.status || null,
      filters.leaveType || null,
      filters.year || null
    );
  };

  // Filter leave requests based on search
  const filteredRequests = leaveRequests.filter((request) =>
    request.employeeName?.toLowerCase().includes(searchValue.toLowerCase()) ||
    request.leaveType?.toLowerCase().includes(searchValue.toLowerCase()) ||
    request.reason?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for approval/rejection
  const handleApprovalChange = (e) => {
    const { name, value } = e.target;
    setApprovalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRejectionChange = (e) => {
    const { name, value } = e.target;
    setRejectionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // View leave request details
  const handleViewRequest = async (request) => {
    setSelectedRequest(request);
    await getLeaveRequest(request.id);
    setShowViewModal(true);
  };

  // Open approve modal
  const openApproveModal = (request) => {
    setSelectedRequest(request);
    setApprovalData({ remarks: "" });
    setFormErrors({});
    setShowApproveModal(true);
  };

  // Open reject modal
  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectionData({ remarks: "", reason: "" });
    setFormErrors({});
    setShowRejectModal(true);
  };

  // Handle approve leave request
  const handleApproveRequest = async () => {
    const errors = {};
    if (!approvalData.remarks.trim()) {
      errors.remarks = { message: "Approval remarks are required" };
    }
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await approveLeaveRequest(selectedRequest.id, approvalData);
      setShowApproveModal(false);
      setApprovalData({ remarks: "" });
      setSelectedRequest(null);
      loadLeaveRequests();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  // Handle reject leave request
  const handleRejectRequest = async () => {
    const errors = {};
    if (!rejectionData.reason.trim()) {
      errors.reason = { message: "Rejection reason is required" };
    }
    if (!rejectionData.remarks.trim()) {
      errors.remarks = { message: "Rejection remarks are required" };
    }
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await rejectLeaveRequest(selectedRequest.id, rejectionData);
      setShowRejectModal(false);
      setRejectionData({ remarks: "", reason: "" });
      setSelectedRequest(null);
      loadLeaveRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
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

  // Leave type options for filter
  const leaveTypeOptions = [
    { label: "All Types", value: "" },
    ...leaveTypes.map(type => ({
      label: type.name || type.typeName,
      value: type.id || type.name
    }))
  ];

  // Year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { label: `${currentYear}`, value: currentYear },
    { label: `${currentYear - 1}`, value: currentYear - 1 },
    { label: `${currentYear - 2}`, value: currentYear - 2 },
  ];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate leave duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <Container className="p-6">
      <BodyHeader 
        heading="Leave Management (Admin)" 
        subHeading="Manage employee leave requests and approvals"
      />

      {error && (
        <Alert
          variant="danger"
          message={error}
          onClose={clearError}
          className="mb-4"
        />
      )}

      {/* Filters */}
      <Card className="mt-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SelectBox
              label="Status"
              name="status"
              placeholder="Select status"
              optionList={statusOptions}
              value={filters.status}
              handleChange={(value) => handleFilterChange("status", value)}
              width="w-full"
            />

            <SelectBox
              label="Leave Type"
              name="leaveType"
              placeholder="Select leave type"
              optionList={leaveTypeOptions}
              value={filters.leaveType}
              handleChange={(value) => handleFilterChange("leaveType", value)}
              width="w-full"
            />

            <SelectBox
              label="Year"
              name="year"
              placeholder="Select year"
              optionList={yearOptions}
              value={filters.year}
              handleChange={(value) => handleFilterChange("year", value)}
              width="w-full"
            />

            <InputField
              label="Employee ID"
              name="employeeId"
              placeholder="Enter employee ID"
              type="text"
              value={filters.employeeId}
              onChange={(e) => handleFilterChange("employeeId", e.target.value)}
              width="w-full"
            />
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <SearchAndFilters
              isFocused={isFocused}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search by employee, leave type, or reason..."
            />
            <div className="flex space-x-2">
              <OutlineButton
                buttonText="Export"
                isIcon={true}
                icon={FiDownload}
                isIconLeft={true}
                onClick={() => {/* Handle export */}}
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
                buttonText="Refresh"
                onClick={loadLeaveRequests}
                disabled={isLeaveRequestsLoading}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLeaveRequestsLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <Skeleton width="150px" height="20px" />
                  <Skeleton width="120px" height="20px" />
                  <Skeleton width="100px" height="20px" />
                  <Skeleton width="100px" height="20px" />
                  <Skeleton width="200px" height="20px" />
                  <Skeleton width="80px" height="20px" />
                  <Skeleton width="150px" height="20px" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <Thead className="bg-gray-50">
                <TR>
                  <TH>Employee</TH>
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
                        {request.employeeName || request.employeeId || "N/A"}
                      </TD>
                      <TD>{request.leaveType || "N/A"}</TD>
                      <TD>{formatDate(request.startDate)}</TD>
                      <TD>{formatDate(request.endDate)}</TD>
                      <TD>{calculateDuration(request.startDate, request.endDate)}</TD>
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
                          <button
                            onClick={() => handleViewRequest(request)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          {request.status?.toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() => openApproveModal(request)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Approve"
                              >
                                <FiCheck className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openRejectModal(request)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Reject"
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </TD>
                    </TR>
                  ))
                ) : (
                  <TR>
                    <TD colSpan={9} className="text-center py-8 text-gray-500">
                      {searchValue ? "No leave requests found matching your search." : "No leave requests found."}
                    </TD>
                  </TR>
                )}
              </Tbody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {leaveRequestsPagination && (
          <div className="px-6 py-3 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={leaveRequestsPagination.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* View Request Details Modal */}
      <Modall
        title="Leave Request Details"
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        okText="Close"
        cancelText=""
        okAction={() => setShowViewModal(false)}
        cancelAction={() => setShowViewModal(false)}
        body={
          leaveRequestDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee</label>
                  <p className="mt-1 text-sm text-gray-900">{leaveRequestDetail.employeeName || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                  <p className="mt-1 text-sm text-gray-900">{leaveRequestDetail.leaveType || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(leaveRequestDetail.startDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(leaveRequestDetail.endDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {calculateDuration(leaveRequestDetail.startDate, leaveRequestDetail.endDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(leaveRequestDetail.status)}>
                      {leaveRequestDetail.status || "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <p className="mt-1 text-sm text-gray-900">{leaveRequestDetail.reason || "N/A"}</p>
              </div>
              {leaveRequestDetail.remarks && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Remarks</label>
                  <p className="mt-1 text-sm text-gray-900">{leaveRequestDetail.remarks}</p>
                </div>
              )}
            </div>
          )
        }
        width={800}
      />

      {/* Approve Request Modal */}
      <Modall
        title="Approve Leave Request"
        modalOpen={showApproveModal}
        setModalOpen={setShowApproveModal}
        okText="Approve"
        cancelText="Cancel"
        okAction={handleApproveRequest}
        cancelAction={() => {
          setShowApproveModal(false);
          setApprovalData({ remarks: "" });
          setFormErrors({});
        }}
        body={
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to approve the leave request for{" "}
                <span className="font-medium">{selectedRequest?.employeeName}</span>?
              </p>
            </div>
            <InputField
              label="Approval Remarks"
              name="remarks"
              placeholder="Enter approval remarks..."
              type="text"
              value={approvalData.remarks}
              onChange={handleApprovalChange}
              errors={formErrors}
              width="w-full"
            />
          </div>
        }
        width={500}
        okButtonDisabled={isProcessing}
      />

      {/* Reject Request Modal */}
      <Modall
        title="Reject Leave Request"
        modalOpen={showRejectModal}
        setModalOpen={setShowRejectModal}
        okText="Reject"
        cancelText="Cancel"
        okAction={handleRejectRequest}
        cancelAction={() => {
          setShowRejectModal(false);
          setRejectionData({ remarks: "", reason: "" });
          setFormErrors({});
        }}
        body={
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to reject the leave request for{" "}
                <span className="font-medium">{selectedRequest?.employeeName}</span>?
              </p>
            </div>
            <InputField
              label="Rejection Reason"
              name="reason"
              placeholder="Enter rejection reason..."
              type="text"
              value={rejectionData.reason}
              onChange={handleRejectionChange}
              errors={formErrors}
              width="w-full"
            />
            <InputField
              label="Rejection Remarks"
              name="remarks"
              placeholder="Enter additional remarks..."
              type="text"
              value={rejectionData.remarks}
              onChange={handleRejectionChange}
              errors={formErrors}
              width="w-full"
            />
          </div>
        }
        width={500}
        okButtonDisabled={isProcessing}
      />
    </Container>
  );
};

export default AdminLeaveManagement;