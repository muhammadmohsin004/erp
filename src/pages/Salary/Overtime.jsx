import { useState, useMemo, useEffect } from "react";
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
  Download,
  Timer,
  DollarSign,
  FileText,
  TrendingUp,
  Activity,
} from "lucide-react";
import Badge from "../../components/elements/Badge/Badge";
import Container from "../../components/elements/container/Container";
import Card from "../../components/elements/card/Card";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import Skeleton from "../../components/elements/skeleton/Skeleton";
import Table from "../../components/elements/table/Table";
import Thead from "../../components/elements/thead/Thead";
import TR from "../../components/elements/tr/TR";
import TH from "../../components/elements/th/TH";
import Tbody from "../../components/elements/tbody/Tbody";
import TD from "../../components/elements/td/TD";
import Dropdown from "../../components/elements/dropdown/Dropdown";
import Pagination from "../../components/elements/Pagination/Pagination";
import Modall from "../../components/elements/modal/Modal";
import InputField from "../../components/elements/inputField/InputField";
import Alert from "../../components/elements/Alert/Alert";
import { useSalary } from "../../Contexts/SalaryManagementContext/SalaryManagementContext";
import { useHR } from "../../Contexts/HrContext/HrContext";

const EmployeeSelect = ({
  employees,
  selectedEmployeeId,
  onEmployeeChange,
  placeholder = "Select Employee",
}) => (
  <SelectBox
    name="employeeId"
    placeholder={placeholder}
    value={selectedEmployeeId}
    handleChange={onEmployeeChange}
    optionList={employees.map((employee) => ({
      value: employee.Id,
      label: `${employee.F_Name} ${employee.M_Name} ${employee.L_Name} - ${employee.Email}`,
    }))}
    width="w-full"
  />
);

const Overtime = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editOvertimeId, setEditOvertimeId] = useState(null);
  const [deleteOvertimeId, setDeleteOvertimeId] = useState(null);
  const [selectedOvertimeId, setSelectedOvertimeId] = useState(null);
  const [selectedOvertime, setSelectedOvertime] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
    description: "",
    approvalComments: "",
    rejectionReason: "",
    summaryEmployeeId: "",
  });

  const {
    getOvertimeRecords,
    getPendingOvertimeApprovals,
    getEmployeeOvertimeSummary,
    createOvertimeRecord,
    updateOvertimeRecord,
    deleteOvertimeRecord,
    approveOvertimeRecord,
    rejectOvertimeRecord,
    clearError,
    overtimeRecords,
    pendingOvertimeApprovals,
    overtimeSummary,
    loading,
    error,
  } = useSalary();
  const { fetchEmployees, employees } = useHR();

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch overtime records when page, itemsPerPage, filterStatus, or filterEmployee changes
  useEffect(() => {
    getOvertimeRecords(
      filterEmployee || null,
      filterStatus !== "all" ? filterStatus : null,
      null,
      null,
      currentPage,
      itemsPerPage
    );
  }, [currentPage, itemsPerPage, filterStatus, filterEmployee]);

  // Fetch pending approvals when pending modal is opened
  useEffect(() => {
    if (showPendingModal) {
      getPendingOvertimeApprovals();
    }
  }, [showPendingModal]);

  // Fetch overtime summary when summary modal is opened and employee is selected
  useEffect(() => {
    if (showSummaryModal && formData.summaryEmployeeId) {
      getEmployeeOvertimeSummary(formData.summaryEmployeeId);
    }
  }, [showSummaryModal, formData.summaryEmployeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      date: "",
      startTime: "",
      endTime: "",
      reason: "",
      description: "",
      approvalComments: "",
      rejectionReason: "",
      summaryEmployeeId: "",
    });
  };

  // Fixed: Export function
  const handleExport = () => {
    try {
      if (!overtimeRecords || overtimeRecords.length === 0) {
        alert("No data to export");
        return;
      }

      // Prepare data for export
      const exportData = overtimeRecords.map((overtime) => ({
        Employee: overtime.EmployeeName || "Unknown",
        Date: new Date(overtime.Date).toLocaleDateString(),
        StartTime: formatTime(overtime.StartTime),
        EndTime: formatTime(overtime.EndTime),
        Duration: formatDuration(overtime.Duration),
        Reason: overtime.Reason || "",
        Description: overtime.Description || "",
        Status: overtime.Status || "",
        Amount: overtime.CalculatedAmount?.toFixed(2) || "0.00",
        OvertimeRate: overtime.OvertimeRate || "",
        CreatedDate: overtime.CreatedDate
          ? new Date(overtime.CreatedDate).toLocaleDateString()
          : "",
      }));

      // Convert to CSV
      const csvContent = [
        Object.keys(exportData[0]).join(","),
        ...exportData.map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `overtime_records_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting data. Please try again.");
    }
  };

  const handleAddOvertime = async () => {
    const data = {
      EmployeeId: parseInt(formData.employeeId),
      Date: formData.date,
      StartTime: formData.startTime,
      EndTime: formData.endTime,
      Reason: formData.reason,
      Description: formData.description,
    };

    try {
      if (editOvertimeId) {
        await updateOvertimeRecord(editOvertimeId, data);
        setEditOvertimeId(null);
      } else {
        await createOvertimeRecord(data);
      }
      setShowAddModal(false);
      resetForm();
      // Refresh the records
      getOvertimeRecords(
        filterEmployee || null,
        filterStatus !== "all" ? filterStatus : null,
        null,
        null,
        currentPage,
        itemsPerPage
      );
    } catch (error) {
      console.error("Error saving overtime:", error);
    }
  };

  const handleEditOvertime = (overtime) => {
    setEditOvertimeId(overtime.Id);
    setFormData({
      ...formData,
      employeeId: overtime.EmployeeId.toString(),
      date: overtime.Date.split("T")[0],
      startTime: overtime.StartTime,
      endTime: overtime.EndTime,
      reason: overtime.Reason || "",
      description: overtime.Description || "",
    });
    setShowAddModal(true);
  };

  const handleDeleteOvertime = (id) => {
    setDeleteOvertimeId(id);
    setShowConfirmDelete(true);
  };

  const handleViewDetails = (overtime) => {
    setSelectedOvertime(overtime);
    setShowDetailsModal(true);
  };

  const handleShowAddModal = () => {
    setEditOvertimeId(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleApproveOvertime = async () => {
    try {
      await approveOvertimeRecord(selectedOvertimeId, {
        Comments: formData.approvalComments,
      });
      setShowApproveModal(false);
      setSelectedOvertimeId(null);
      setFormData((prev) => ({ ...prev, approvalComments: "" }));
      // Refresh the records
      getOvertimeRecords(
        filterEmployee || null,
        filterStatus !== "all" ? filterStatus : null,
        null,
        null,
        currentPage,
        itemsPerPage
      );
      // Also refresh pending approvals if modal is open
      if (showPendingModal) {
        getPendingOvertimeApprovals();
      }
    } catch (error) {
      console.error("Error approving overtime:", error);
    }
  };

  const handleRejectOvertime = async () => {
    try {
      await rejectOvertimeRecord(selectedOvertimeId, {
        Reason: formData.rejectionReason,
      });
      setShowRejectModal(false);
      setSelectedOvertimeId(null);
      setFormData((prev) => ({ ...prev, rejectionReason: "" }));
      // Refresh the records
      getOvertimeRecords(
        filterEmployee || null,
        filterStatus !== "all" ? filterStatus : null,
        null,
        null,
        currentPage,
        itemsPerPage
      );
      // Also refresh pending approvals if modal is open
      if (showPendingModal) {
        getPendingOvertimeApprovals();
      }
    } catch (error) {
      console.error("Error rejecting overtime:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteOvertimeRecord(deleteOvertimeId);
      setShowConfirmDelete(false);
      setDeleteOvertimeId(null);
      // Refresh the records
      getOvertimeRecords(
        filterEmployee || null,
        filterStatus !== "all" ? filterStatus : null,
        null,
        null,
        currentPage,
        itemsPerPage
      );
    } catch (error) {
      console.error("Error deleting overtime:", error);
    }
  };

  console.log("overtimeRecords", overtimeRecords);

  // Filter overtime data based on search term
  const filteredOvertimeData = useMemo(() => {
    if (!searchTerm) return overtimeRecords || [];
    return (overtimeRecords || []).filter(
      (overtime) =>
        overtime.EmployeeName?.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ||
        overtime.Reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        overtime.Description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [overtimeRecords, searchTerm]);

  console.log("filteredOvertimeData", filteredOvertimeData);

  // Statistics
  const stats = useMemo(() => {
    const total = overtimeRecords?.length || 0;
    const pending =
      overtimeRecords?.filter((ot) => ot.Status === "Pending").length || 0;
    const approved =
      overtimeRecords?.filter((ot) => ot.Status === "Approved").length || 0;
    const rejected =
      overtimeRecords?.filter((ot) => ot.Status === "Rejected").length || 0;
    const totalAmount =
      overtimeRecords
        ?.filter((ot) => ot.Status === "Approved")
        .reduce((sum, ot) => sum + (ot.CalculatedAmount || 0), 0) || 0;

    return { total, pending, approved, rejected, totalAmount };
  }, [overtimeRecords]);

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      Approved: "success",
      Rejected: "danger",
    };
    const icons = {
      Pending: AlertCircle,
      Approved: CheckCircle,
      Rejected: XCircle,
    };
    const Icon = icons[status] || AlertCircle;

    return (
      <Badge
        variant={variants[status] || "secondary"}
        className="flex items-center"
      >
        <Icon size={12} className="mr-1" />
        {status}
      </Badge>
    );
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const formatDuration = (duration) => {
    if (!duration) return "";
    if (typeof duration === "string") {
      return duration.substring(0, 5);
    }
    if (duration.hours !== undefined) {
      return `${duration.hours.toString().padStart(2, "0")}:${duration.minutes
        .toString()
        .padStart(2, "0")}`;
    }
    return duration.toString();
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "";
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end > start) {
      const diff = (end - start) / (1000 * 60 * 60);
      return `${diff.toFixed(1)} hours`;
    }
    return "Invalid time range";
  };

  // Fixed: Dropdown items with proper event handling
  const getDropdownItems = (overtime) => [
    {
      label: "View Details",
      onClick: () => {
        handleViewDetails(overtime);
      },
    },
    {
      label: "Edit",
      onClick: () => {
        handleEditOvertime(overtime);
      },
    },
    ...(overtime.Status === "Pending"
      ? [
          {
            label: "Approve",
            onClick: () => {
              setSelectedOvertimeId(overtime.Id);
              setShowApproveModal(true);
            },
            className: "text-green-600",
          },
          {
            label: "Reject",
            onClick: () => {
              setSelectedOvertimeId(overtime.Id);
              setShowRejectModal(true);
            },
            className: "text-yellow-600",
          },
        ]
      : []),
    {
      label: "Delete",
      onClick: () => {
        handleDeleteOvertime(overtime.Id);
      },
      className: "text-red-600",
    },
  ];

  return (
    <Container className="py-4">
      {/* Header Section */}
      <Card className="mb-4 shadow-sm">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-3 md:mb-0">
              <div className="mr-3 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-400 rounded-xl">
                <Timer size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Overtime Management</h3>
                <p className="text-gray-500 text-sm">
                  Track and manage employee overtime hours and approvals
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <OutlineButton
                buttonText="Export"
                borderColor="border-gray-300"
                borderWidth="border-2"
                textColor="text-gray-700"
                hover="hover:bg-gray-50"
                icon={Download}
                isIcon
                isIconLeft
                fontSize="text-xs"
                onClick={handleExport}
              />
              <FilledButton
                buttonText="Add Overtime"
                bgColor="bg-green-500"
                icon={Plus}
                isIcon
                isIconLeft
                onClick={handleShowAddModal}
                fontSize="text-xs"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card className="shadow-sm">
          <div className="text-center p-4">
            <Activity size={28} className="text-blue-600 mb-2" />
            <h4 className="font-bold text-blue-600">{stats.total}</h4>
            <small className="text-gray-500">Total Records</small>
          </div>
        </Card>
        <Card className="shadow-sm">
          <div className="text-center p-4">
            <AlertCircle size={28} className="text-yellow-600 mb-2" />
            <h4 className="font-bold text-yellow-600">{stats.pending}</h4>
            <small className="text-gray-500">Pending Approval</small>
          </div>
        </Card>
        <Card className="shadow-sm">
          <div className="text-center p-4">
            <CheckCircle size={28} className="text-green-600 mb-2" />
            <h4 className="font-bold text-green-600">{stats.approved}</h4>
            <small className="text-gray-500">Approved</small>
          </div>
        </Card>
        <Card className="shadow-sm">
          <div className="text-center p-4">
            <DollarSign size={28} className="text-teal-600 mb-2" />
            <h4 className="font-bold text-teal-600">
              ${stats.totalAmount.toFixed(2)}
            </h4>
            <small className="text-gray-500">Total Amount</small>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-4 shadow-sm">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h5 className="font-bold">Quick Actions</h5>
              <small className="text-gray-500">
                Manage overtime requests and approvals
              </small>
            </div>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <FilledButton
                buttonText={`Pending (${stats.pending})`}
                bgColor="bg-yellow-500"
                icon={AlertCircle}
                isIcon
                isIconLeft
                onClick={() => setShowPendingModal(true)}
                fontSize="text-xs"
              />
              <FilledButton
                buttonText="Summary"
                bgColor="bg-blue-500"
                icon={TrendingUp}
                isIcon
                isIconLeft
                onClick={() => setShowSummaryModal(true)}
                fontSize="text-xs"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <SearchAndFilters
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
          placeholder="Search by employee name or reason..."
          isFocused={true}
        />
        <SelectBox
          name="status"
          placeholder="All Status"
          value={filterStatus}
          handleChange={(value) => {
            setFilterStatus(value);
            setCurrentPage(1);
          }}
          optionList={[
            { value: "all", label: "All Status" },
            { value: "Pending", label: "Pending" },
            { value: "Approved", label: "Approved" },
            { value: "Rejected", label: "Rejected" },
          ]}
          width="w-full"
        />
        <EmployeeSelect
          employees={employees || []}
          selectedEmployeeId={filterEmployee}
          onEmployeeChange={(value) => {
            setFilterEmployee(value);
            setCurrentPage(1);
          }}
          placeholder="All Employees"
        />
      </div>

      {/* Main Overtime Table */}
      <Card className="shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-bold">Overtime Records</h5>
            <small className="text-gray-500">
              Showing {filteredOvertimeData.length} of{" "}
              {overtimeRecords?.pagination?.totalItems || 0} records
            </small>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <Skeleton height="40px" width="100%" marginBottom="10px" />
            <p className="text-gray-500">Loading overtime records...</p>
          </div>
        ) : filteredOvertimeData.length === 0 ? (
          <div className="text-center py-5">
            <Timer size={48} className="text-gray-500 mb-3" />
            <h5 className="text-gray-500">No overtime records found</h5>
            <p className="text-gray-500 mb-3">
              {searchTerm || filterStatus !== "all" || filterEmployee
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first overtime record"}
            </p>
            {!searchTerm && filterStatus === "all" && !filterEmployee && (
              <FilledButton
                buttonText="Add First Overtime Record"
                bgColor="bg-green-500"
                icon={Plus}
                isIcon
                isIconLeft
                onClick={handleShowAddModal}
                fontSize="text-xs"
              />
            )}
          </div>
        ) : (
          <>
            <Table className="min-w-full">
              <Thead className="bg-gray-50">
                <TR>
                  <TH>Employee</TH>
                  <TH>Date & Time</TH>
                  <TH>Duration</TH>
                  <TH>Reason</TH>
                  <TH>Amount</TH>
                  <TH>Status</TH>
                  <TH className="text-center">Actions</TH>
                </TR>
              </Thead>
              <Tbody>
                {filteredOvertimeData.map((overtime) => (
                  <TR key={overtime.Id}>
                    <TD>
                      <div className="flex items-center">
                        <div className="mr-2 flex items-center justify-center bg-blue-600 text-white rounded-full w-8 h-8 text-xs">
                          {overtime.EmployeeName
                            ? overtime.EmployeeName.split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "N/A"}
                        </div>
                        <div>
                          <div className="font-medium">
                            {overtime.EmployeeName || "Unknown Employee"}
                          </div>
                          <small className="text-gray-500">
                            ID: {overtime.EmployeeId}
                          </small>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <div>
                          <div>
                            {new Date(overtime.Date).toLocaleDateString()}
                          </div>
                          <small className="text-gray-500">
                            {formatTime(overtime.StartTime)} -{" "}
                            {formatTime(overtime.EndTime)}
                          </small>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center">
                        <Clock size={16} className="text-green-600 mr-2" />
                        <span className="font-medium">
                          {formatDuration(overtime.Duration)}
                        </span>
                      </div>
                    </TD>
                    <TD>
                      <div>
                        <div className="font-medium">{overtime.Reason}</div>
                        {overtime.Description && (
                          <small className="text-gray-500">
                            {overtime.Description.substring(0, 50)}...
                          </small>
                        )}
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center">
                        <DollarSign size={16} className="text-teal-600 mr-1" />
                        <span className="font-medium">
                          ${overtime.CalculatedAmount?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <small className="text-gray-500">
                        Rate: {overtime.OvertimeRate}x
                      </small>
                    </TD>
                    <TD>{getStatusBadge(overtime.Status)}</TD>
                    <TD className="text-center">
                      <Dropdown
                        buttonText="Actions"
                        buttonClassName="border-gray-300 text-gray-700 hover:bg-gray-50"
                        items={getDropdownItems(overtime)}
                        onSelect={(item) => item.onClick && item.onClick()}
                      />
                    </TD>
                  </TR>
                ))}
              </Tbody>
            </Table>

            {/* Pagination */}
            {overtimeRecords?.pagination?.totalPages > 1 && (
              <div className="flex justify-between items-center py-3 px-4 border-t">
                <SelectBox
                  name="itemsPerPage"
                  value={itemsPerPage}
                  handleChange={(value) => setItemsPerPage(parseInt(value))}
                  optionList={[
                    { value: 10, label: "10 per page" },
                    { value: 25, label: "25 per page" },
                    { value: 50, label: "50 per page" },
                    { value: 100, label: "100 per page" },
                  ]}
                  width="w-32"
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={overtimeRecords?.pagination?.totalPages || 1}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Add/Edit Overtime Modal */}
      <Modall
        title={
          <div className="flex items-center">
            <Timer size={20} className="mr-2" />
            {editOvertimeId ? "Edit Overtime" : "Add New Overtime"}
          </div>
        }
        modalOpen={showAddModal}
        setModalOpen={setShowAddModal}
        okText={editOvertimeId ? "Update Overtime" : "Add Overtime"}
        cancelText="Cancel"
        okAction={handleAddOvertime}
        cancelAction={() => setShowAddModal(false)}
        okButtonDisabled={
          loading ||
          !formData.employeeId ||
          !formData.date ||
          !formData.startTime ||
          !formData.endTime ||
          !formData.reason
        }
        width={800}
        body={
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EmployeeSelect
                employees={employees || []}
                selectedEmployeeId={formData.employeeId}
                onEmployeeChange={(value) =>
                  setFormData((prev) => ({ ...prev, employeeId: value }))
                }
                placeholder="Select Employee"
              />
              <InputField
                name="date"
                type="date"
                placeholder="Select Date"
                value={formData.date}
                onChange={handleInputChange}
                label="Date *"
                width="w-full"
              />
              <InputField
                name="startTime"
                type="time"
                placeholder="Start Time"
                value={formData.startTime}
                onChange={handleInputChange}
                label="Start Time *"
                width="w-full"
              />
              <InputField
                name="endTime"
                type="time"
                placeholder="End Time"
                value={formData.endTime}
                onChange={handleInputChange}
                label="End Time *"
                width="w-full"
              />
            </div>
            {formData.startTime && formData.endTime && (
              <Alert variant="info" className="my-3">
                <Info size={16} className="mr-2" />
                Duration:{" "}
                {calculateDuration(formData.startTime, formData.endTime)}
              </Alert>
            )}
            <InputField
              name="reason"
              type="text"
              placeholder="Enter reason for overtime"
              value={formData.reason}
              onChange={handleInputChange}
              label="Reason *"
              width="w-full"
              marginBottom="mb-3"
            />
            <InputField
              name="description"
              type="textarea"
              placeholder="Additional details about the overtime work"
              value={formData.description}
              onChange={handleInputChange}
              label="Description"
              width="w-full"
              marginBottom="mb-3"
            />
          </div>
        }
      />

      {/* View Details Modal */}
      <Modall
        title={
          <div className="flex items-center">
            <Eye size={20} className="mr-2" />
            Overtime Details
          </div>
        }
        modalOpen={showDetailsModal}
        setModalOpen={setShowDetailsModal}
        okText="Close"
        cancelText=""
        okAction={() => setShowDetailsModal(false)}
        cancelButtonDisabled={true}
        width={800}
        body={
          selectedOvertime && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Employee:</strong>
                  <p>{selectedOvertime.EmployeeName}</p>
                </div>
                <div>
                  <strong>Date:</strong>
                  <p>{new Date(selectedOvertime.Date).toLocaleDateString()}</p>
                </div>
                <div>
                  <strong>Start Time:</strong>
                  <p>{formatTime(selectedOvertime.StartTime)}</p>
                </div>
                <div>
                  <strong>End Time:</strong>
                  <p>{formatTime(selectedOvertime.EndTime)}</p>
                </div>
                <div>
                  <strong>Duration:</strong>
                  <p>{formatDuration(selectedOvertime.Duration)}</p>
                </div>
                <div>
                  <strong>Status:</strong>
                  <p>{getStatusBadge(selectedOvertime.Status)}</p>
                </div>
                <div>
                  <strong>Overtime Rate:</strong>
                  <p>{selectedOvertime.OvertimeRate}x</p>
                </div>
                <div>
                  <strong>Calculated Amount:</strong>
                  <p>
                    ${selectedOvertime.CalculatedAmount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
              <div>
                <strong>Reason:</strong>
                <p>{selectedOvertime.Reason}</p>
              </div>
              {selectedOvertime.Description && (
                <div>
                  <strong>Description:</strong>
                  <p>{selectedOvertime.Description}</p>
                </div>
              )}
              {selectedOvertime.ApprovalComments && (
                <div>
                  <strong>Approval Comments:</strong>
                  <p>{selectedOvertime.ApprovalComments}</p>
                </div>
              )}
              {selectedOvertime.RejectionReason && (
                <div>
                  <strong>Rejection Reason:</strong>
                  <p>{selectedOvertime.RejectionReason}</p>
                </div>
              )}
              {selectedOvertime.ApprovedBy && (
                <div>
                  <strong>Approved By:</strong>
                  <p>{selectedOvertime.ApprovedBy}</p>
                </div>
              )}
              {selectedOvertime.ApprovalDate && (
                <div>
                  <strong>Approval Date:</strong>
                  <p>
                    {new Date(
                      selectedOvertime.ApprovalDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
              {selectedOvertime.CreatedDate && (
                <div>
                  <strong>Created Date:</strong>
                  <p>
                    {new Date(
                      selectedOvertime.CreatedDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )
        }
      />

      {/* Approve Overtime Modal */}
      <Modall
        title={
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2 text-green-600" />
            Approve Overtime
          </div>
        }
        modalOpen={showApproveModal}
        setModalOpen={setShowApproveModal}
        okText="Approve"
        cancelText="Cancel"
        okAction={handleApproveOvertime}
        cancelAction={() => setShowApproveModal(false)}
        okButtonDisabled={loading}
        width={600}
        body={
          <div className="space-y-4">
            <Alert variant="info" className="mb-4">
              <Info size={16} className="mr-2" />
              You are about to approve this overtime request. This action cannot
              be undone.
            </Alert>
            <InputField
              name="approvalComments"
              type="textarea"
              placeholder="Enter approval comments (optional)"
              value={formData.approvalComments}
              onChange={handleInputChange}
              label="Approval Comments"
              width="w-full"
              marginBottom="mb-3"
            />
          </div>
        }
      />

      {/* Reject Overtime Modal */}
      <Modall
        title={
          <div className="flex items-center">
            <XCircle size={20} className="mr-2 text-red-600" />
            Reject Overtime
          </div>
        }
        modalOpen={showRejectModal}
        setModalOpen={setShowRejectModal}
        okText="Reject"
        cancelText="Cancel"
        okAction={handleRejectOvertime}
        cancelAction={() => setShowRejectModal(false)}
        okButtonDisabled={loading || !formData.rejectionReason}
        width={600}
        body={
          <div className="space-y-4">
            <Alert variant="warning" className="mb-4">
              <AlertCircle size={16} className="mr-2" />
              You are about to reject this overtime request. Please provide a
              reason for rejection.
            </Alert>
            <InputField
              name="rejectionReason"
              type="textarea"
              placeholder="Enter reason for rejection (required)"
              value={formData.rejectionReason}
              onChange={handleInputChange}
              label="Rejection Reason *"
              width="w-full"
              marginBottom="mb-3"
            />
          </div>
        }
      />

      {/* Pending Approvals Modal */}
      <Modall
        title={
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2 text-yellow-600" />
            Pending Overtime Approvals
          </div>
        }
        modalOpen={showPendingModal}
        setModalOpen={setShowPendingModal}
        okText="Close"
        cancelText=""
        okAction={() => setShowPendingModal(false)}
        cancelButtonDisabled={true}
        width={1000}
        body={
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-5">
                <Skeleton height="40px" width="100%" marginBottom="10px" />
                <p className="text-gray-500">Loading pending approvals...</p>
              </div>
            ) : pendingOvertimeApprovals?.length === 0 ? (
              <div className="text-center py-5">
                <CheckCircle size={48} className="text-green-500 mb-3" />
                <h5 className="text-gray-500">No pending approvals</h5>
                <p className="text-gray-500">
                  All overtime requests are processed
                </p>
              </div>
            ) : (
              <Table className="min-w-full">
                <Thead className="bg-gray-50">
                  <TR>
                    <TH>Employee</TH>
                    <TH>Date</TH>
                    <TH>Duration</TH>
                    <TH>Reason</TH>
                    <TH>Amount</TH>
                    <TH className="text-center">Actions</TH>
                  </TR>
                </Thead>
                <Tbody>
                  {pendingOvertimeApprovals?.map((overtime) => (
                    <TR key={overtime.Id}>
                      <TD>
                        <div className="flex items-center">
                          <div className="mr-2 flex items-center justify-center bg-blue-600 text-white rounded-full w-8 h-8 text-xs">
                            {overtime.EmployeeName
                              ? overtime.EmployeeName.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "N/A"}
                          </div>
                          <div>
                            <div className="font-medium">
                              {overtime.EmployeeName || "Unknown Employee"}
                            </div>
                            <small className="text-gray-500">
                              ID: {overtime.EmployeeId}
                            </small>
                          </div>
                        </div>
                      </TD>
                      <TD>
                        <div>
                          <div>
                            {new Date(overtime.Date).toLocaleDateString()}
                          </div>
                          <small className="text-gray-500">
                            {formatTime(overtime.StartTime)} -{" "}
                            {formatTime(overtime.EndTime)}
                          </small>
                        </div>
                      </TD>
                      <TD>
                        <div className="flex items-center">
                          <Clock size={16} className="text-green-600 mr-2" />
                          <span className="font-medium">
                            {formatDuration(overtime.Duration)}
                          </span>
                        </div>
                      </TD>
                      <TD>
                        <div>
                          <div className="font-medium">{overtime.Reason}</div>
                          {overtime.Description && (
                            <small className="text-gray-500">
                              {overtime.Description.substring(0, 30)}...
                            </small>
                          )}
                        </div>
                      </TD>
                      <TD>
                        <div className="flex items-center">
                          <DollarSign
                            size={16}
                            className="text-teal-600 mr-1"
                          />
                          <span className="font-medium">
                            ${overtime.CalculatedAmount?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </TD>
                      <TD className="text-center">
                        <div className="flex space-x-2 justify-center">
                          <OutlineButton
                            buttonText="Approve"
                            borderColor="border-green-500"
                            borderWidth="border-2"
                            textColor="text-green-500"
                            hover="hover:bg-green-50"
                            icon={CheckCircle}
                            isIcon
                            isIconLeft
                            onClick={() => {
                              setSelectedOvertimeId(overtime.Id);
                              setShowApproveModal(true);
                            }}
                            fontSize="text-xs"
                          />
                          <OutlineButton
                            buttonText="Reject"
                            borderColor="border-red-500"
                            borderWidth="border-2"
                            textColor="text-red-500"
                            hover="hover:bg-red-50"
                            icon={XCircle}
                            isIcon
                            isIconLeft
                            onClick={() => {
                              setSelectedOvertimeId(overtime.Id);
                              setShowRejectModal(true);
                            }}
                            fontSize="text-xs"
                          />
                        </div>
                      </TD>
                    </TR>
                  ))}
                </Tbody>
              </Table>
            )}
          </div>
        }
      />

      {/* Employee Overtime Summary Modal */}
      <Modall
        title={
          <div className="flex items-center">
            <TrendingUp size={20} className="mr-2 text-blue-600" />
            Employee Overtime Summary
          </div>
        }
        modalOpen={showSummaryModal}
        setModalOpen={setShowSummaryModal}
        okText="Close"
        cancelText=""
        okAction={() => setShowSummaryModal(false)}
        cancelButtonDisabled={true}
        width={800}
        body={
          <div className="space-y-4">
            <div className="mb-4">
              <EmployeeSelect
                employees={employees || []}
                selectedEmployeeId={formData.summaryEmployeeId}
                onEmployeeChange={(value) =>
                  setFormData((prev) => ({ ...prev, summaryEmployeeId: value }))
                }
                placeholder="Select Employee for Summary"
              />
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Skeleton height="40px" width="100%" marginBottom="10px" />
                <p className="text-gray-500">Loading overtime summary...</p>
              </div>
            ) : formData.summaryEmployeeId && overtimeSummary ? (
              <div className="space-y-4">
                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="shadow-sm">
                    <div className="text-center p-4">
                      <Clock size={24} className="text-blue-600 mb-2" />
                      <h4 className="font-bold text-blue-600">
                        {overtimeSummary.totalHours || 0}
                      </h4>
                      <small className="text-gray-500">Total Hours</small>
                    </div>
                  </Card>
                  <Card className="shadow-sm">
                    <div className="text-center p-4">
                      <DollarSign size={24} className="text-green-600 mb-2" />
                      <h4 className="font-bold text-green-600">
                        ${overtimeSummary.totalAmount?.toFixed(2) || "0.00"}
                      </h4>
                      <small className="text-gray-500">Total Amount</small>
                    </div>
                  </Card>
                  <Card className="shadow-sm">
                    <div className="text-center p-4">
                      <FileText size={24} className="text-purple-600 mb-2" />
                      <h4 className="font-bold text-purple-600">
                        {overtimeSummary.totalRecords || 0}
                      </h4>
                      <small className="text-gray-500">Total Records</small>
                    </div>
                  </Card>
                </div>

                {/* Status Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle size={20} className="text-yellow-600 mb-1" />
                    <div className="font-bold text-yellow-600">
                      {overtimeSummary.pendingCount || 0}
                    </div>
                    <small className="text-gray-500">Pending</small>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle size={20} className="text-green-600 mb-1" />
                    <div className="font-bold text-green-600">
                      {overtimeSummary.approvedCount || 0}
                    </div>
                    <small className="text-gray-500">Approved</small>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <XCircle size={20} className="text-red-600 mb-1" />
                    <div className="font-bold text-red-600">
                      {overtimeSummary.rejectedCount || 0}
                    </div>
                    <small className="text-gray-500">Rejected</small>
                  </div>
                </div>

                {/* Recent Records */}
                {overtimeSummary.recentRecords &&
                  overtimeSummary.recentRecords.length > 0 && (
                    <div>
                      <h6 className="font-bold mb-3">
                        Recent Overtime Records
                      </h6>
                      <div className="space-y-2">
                        {overtimeSummary.recentRecords.map((record) => (
                          <div
                            key={record.Id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <Calendar
                                size={16}
                                className="text-gray-500 mr-2"
                              />
                              <div>
                                <div className="font-medium">
                                  {new Date(record.Date).toLocaleDateString()}
                                </div>
                                <small className="text-gray-500">
                                  {formatTime(record.StartTime)} -{" "}
                                  {formatTime(record.EndTime)}
                                </small>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="font-medium">
                                  {formatDuration(record.Duration)}
                                </div>
                                <small className="text-gray-500">
                                  $
                                  {record.CalculatedAmount?.toFixed(2) ||
                                    "0.00"}
                                </small>
                              </div>
                              {getStatusBadge(record.Status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : formData.summaryEmployeeId ? (
              <div className="text-center py-5">
                <FileText size={48} className="text-gray-500 mb-3" />
                <h5 className="text-gray-500">No overtime records found</h5>
                <p className="text-gray-500">
                  This employee has no overtime records yet
                </p>
              </div>
            ) : (
              <div className="text-center py-5">
                <Users size={48} className="text-gray-500 mb-3" />
                <h5 className="text-gray-500">Select an employee</h5>
                <p className="text-gray-500">
                  Choose an employee from the dropdown to view their overtime
                  summary
                </p>
              </div>
            )}
          </div>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modall
        title={
          <div className="flex items-center">
            <Trash2 size={20} className="mr-2 text-red-600" />
            Confirm Delete
          </div>
        }
        modalOpen={showConfirmDelete}
        setModalOpen={setShowConfirmDelete}
        okText="Delete"
        cancelText="Cancel"
        okAction={confirmDelete}
        cancelAction={() => setShowConfirmDelete(false)}
        okButtonDisabled={loading}
        width={500}
        body={
          <div className="space-y-4">
            <Alert variant="danger" className="mb-4">
              <AlertCircle size={16} className="mr-2" />
              This action cannot be undone. Are you sure you want to delete this
              overtime record?
            </Alert>
            <p className="text-gray-600">
              The overtime record will be permanently removed from the system.
            </p>
          </div>
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          className="fixed bottom-4 right-4 max-w-md z-50"
        >
          <AlertCircle size={16} className="mr-2" />
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-800 hover:text-red-900"
          >
            <XCircle size={16} />
          </button>
        </Alert>
      )}
    </Container>
  );
};

export default Overtime;
