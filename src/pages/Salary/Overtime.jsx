import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
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
import overtimeTransation from "../../translations/overtimeTransation";
const EmployeeSelect = ({
  employees,
  selectedEmployeeId,
  onEmployeeChange,
  placeholder = "Select Employee",
}) => {
  const { language: currentLanguage } = useSelector((state) => state.language);
  const t = (key) => overtimeTransation[currentLanguage][key] || key;

  return (
    <SelectBox
      name="employeeId"
      placeholder={t(placeholder)}
      value={selectedEmployeeId}
      handleChange={onEmployeeChange}
      optionList={employees.map((employee) => ({
        value: employee.Id,
        label: `${employee.F_Name} ${employee.M_Name} ${employee.L_Name} - ${employee.Email}`,
      }))}
      width="w-full"
    />
  );
};

const Overtime = () => {
  const { language: currentLanguage } = useSelector((state) => state.language);
  const t = (key) => overtimeTransation[currentLanguage][key] || key;

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

  // Format date based on language
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      calendar: currentLanguage === "ar" ? "gregory" : undefined,
    };
    return new Date(dateString).toLocaleDateString(
      currentLanguage === "ar" ? "ar-EG" : "en-US",
      options
    );
  };

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

  const handleExport = () => {
    try {
      if (!overtimeRecords || overtimeRecords.length === 0) {
        alert(t("noRecordsFound"));
        return;
      }

      const exportData = overtimeRecords.map((overtime) => ({
        [t("employee")]: overtime.EmployeeName || t("unknownEmployee"),
        [t("date")]: formatDate(overtime.Date),
        [t("startTime")]: formatTime(overtime.StartTime),
        [t("endTime")]: formatTime(overtime.EndTime),
        [t("duration")]: formatDuration(overtime.Duration),
        [t("reason")]: overtime.Reason || "",
        [t("description")]: overtime.Description || "",
        [t("status")]: overtime.Status || "",
        [t("amount")]: overtime.CalculatedAmount?.toFixed(2) || "0.00",
        [t("overtimeRate")]: overtime.OvertimeRate || "",
        [t("createdDate")]: overtime.CreatedDate
          ? formatDate(overtime.CreatedDate)
          : "",
      }));

      const csvContent = [
        Object.keys(exportData[0]).join(","),
        ...exportData.map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(",")
        ),
      ].join("\n");

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
      getOvertimeRecords(
        filterEmployee || null,
        filterStatus !== "all" ? filterStatus : null,
        null,
        null,
        currentPage,
        itemsPerPage
      );
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
      getOvertimeRecords(
        filterEmployee || null,
        filterStatus !== "all" ? filterStatus : null,
        null,
        null,
        currentPage,
        itemsPerPage
      );
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
    if (!startTime || !endTime) return t("invalidTimeRange");
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end > start) {
      const diff = (end - start) / (1000 * 60 * 60);
      return `${diff.toFixed(1)} ${t("hours")}`;
    }
    return t("invalidTimeRange");
  };

  const getDropdownItems = (overtime) => [
    {
      label: t("viewDetails"),
      onClick: () => handleViewDetails(overtime),
    },
    {
      label: t("edit"),
      onClick: () => handleEditOvertime(overtime),
    },
    ...(overtime.Status === "Pending"
      ? [
          {
            label: t("approve"),
            onClick: () => {
              setSelectedOvertimeId(overtime.Id);
              setShowApproveModal(true);
            },
            className: "text-green-600",
          },
          {
            label: t("reject"),
            onClick: () => {
              setSelectedOvertimeId(overtime.Id);
              setShowRejectModal(true);
            },
            className: "text-yellow-600",
          },
        ]
      : []),
    {
      label: t("delete"),
      onClick: () => handleDeleteOvertime(overtime.Id),
      className: "text-red-600",
    },
  ];

  return (
    <div dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
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
                  <h3 className="font-bold text-gray-800">
                    {t("overtimeManagement")}
                  </h3>
                  <p className="text-gray-500 text-sm">{t("trackAndManage")}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <OutlineButton
                  buttonText={t("export")}
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
                  buttonText={t("addOvertime")}
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
              <small className="text-gray-500">{t("totalRecords")}</small>
            </div>
          </Card>
          <Card className="shadow-sm">
            <div className="text-center p-4">
              <AlertCircle size={28} className="text-yellow-600 mb-2" />
              <h4 className="font-bold text-yellow-600">{stats.pending}</h4>
              <small className="text-gray-500">{t("pendingApproval")}</small>
            </div>
          </Card>
          <Card className="shadow-sm">
            <div className="text-center p-4">
              <CheckCircle size={28} className="text-green-600 mb-2" />
              <h4 className="font-bold text-green-600">{stats.approved}</h4>
              <small className="text-gray-500">{t("approved")}</small>
            </div>
          </Card>
          <Card className="shadow-sm">
            <div className="text-center p-4">
              <DollarSign size={28} className="text-teal-600 mb-2" />
              <h4 className="font-bold text-teal-600">
                ${stats.totalAmount.toFixed(2)}
              </h4>
              <small className="text-gray-500">{t("totalAmount")}</small>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-4 shadow-sm">
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h5 className="font-bold">{t("quickActions")}</h5>
                <small className="text-gray-500">{t("manageRequests")}</small>
              </div>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <FilledButton
                  buttonText={`${t("pending")} (${stats.pending})`}
                  bgColor="bg-yellow-500"
                  icon={AlertCircle}
                  isIcon
                  isIconLeft
                  onClick={() => setShowPendingModal(true)}
                  fontSize="text-xs"
                />
                <FilledButton
                  buttonText={t("summary")}
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
            placeholder={t("searchPlaceholder")}
            isFocused={true}
          />
          <SelectBox
            name="status"
            placeholder={t("allStatus")}
            value={filterStatus}
            handleChange={(value) => {
              setFilterStatus(value);
              setCurrentPage(1);
            }}
            optionList={[
              { value: "all", label: t("allStatus") },
              { value: "Pending", label: t("pending") },
              { value: "Approved", label: t("approved") },
              { value: "Rejected", label: t("rejected") },
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
            placeholder={t("allEmployees")}
          />
        </div>

        {/* Main Overtime Table */}
        <Card className="shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold">{t("overtimeRecords")}</h5>
              <small className="text-gray-500">
                {t("showing")} {filteredOvertimeData.length} {t("of")}{" "}
                {overtimeRecords?.pagination?.totalItems || 0} {t("records")}
              </small>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <Skeleton height="40px" width="100%" marginBottom="10px" />
              <p className="text-gray-500">{t("loadingRecords")}</p>
            </div>
          ) : filteredOvertimeData.length === 0 ? (
            <div className="text-center py-5">
              <Timer size={48} className="text-gray-500 mb-3" />
              <h5 className="text-gray-500">{t("noRecordsFound")}</h5>
              <p className="text-gray-500 mb-3">
                {searchTerm || filterStatus !== "all" || filterEmployee
                  ? t("tryAdjusting")
                  : t("addFirstRecord")}
              </p>
              {!searchTerm && filterStatus === "all" && !filterEmployee && (
                <FilledButton
                  buttonText={t("addFirstRecord")}
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
              {/* Responsive table wrapper with horizontal scroll */}
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <Thead className="bg-gray-50">
                    <TR>
                      <TH className="min-w-[200px]">{t("employee")}</TH>
                      <TH className="min-w-[160px]">{t("dateTime")}</TH>
                      <TH className="min-w-[100px]">{t("duration")}</TH>
                      <TH className="min-w-[150px]">{t("reason")}</TH>
                      <TH className="min-w-[120px]">{t("amount")}</TH>
                      <TH className="min-w-[100px]">{t("status")}</TH>
                      <TH className="min-w-[120px] text-center">
                        {t("actions")}
                      </TH>
                    </TR>
                  </Thead>
                  <Tbody>
                    {filteredOvertimeData.map((overtime) => (
                      <TR key={overtime.Id}>
                        <TD className="min-w-[200px]">
                          <div className="flex items-center">
                            <div className="mr-2 flex items-center justify-center bg-blue-600 text-white rounded-full w-8 h-8 text-xs flex-shrink-0">
                              {overtime.EmployeeName
                                ? overtime.EmployeeName.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "N/A"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">
                                {overtime.EmployeeName || t("unknownEmployee")}
                              </div>
                              <small className="text-gray-500 truncate block">
                                {t("id")}: {overtime.EmployeeId}
                              </small>
                            </div>
                          </div>
                        </TD>
                        <TD className="min-w-[160px]">
                          <div className="flex items-center">
                            <Calendar
                              size={16}
                              className="text-gray-500 mr-2 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="truncate">
                                {formatDate(overtime.Date)}
                              </div>
                              <small className="text-gray-500 truncate block">
                                {formatTime(overtime.StartTime)} -{" "}
                                {formatTime(overtime.EndTime)}
                              </small>
                            </div>
                          </div>
                        </TD>
                        <TD className="min-w-[100px]">
                          <div className="flex items-center">
                            <Clock
                              size={16}
                              className="text-green-600 mr-2 flex-shrink-0"
                            />
                            <span className="font-medium">
                              {formatDuration(overtime.Duration)}
                            </span>
                          </div>
                        </TD>
                        <TD className="min-w-[150px]">
                          <div>
                            <div className="font-medium truncate">
                              {overtime.Reason}
                            </div>
                            {overtime.Description && (
                              <small className="text-gray-500 truncate block">
                                {overtime.Description.substring(0, 50)}...
                              </small>
                            )}
                          </div>
                        </TD>
                        <TD className="min-w-[120px]">
                          <div className="flex items-center">
                            <DollarSign
                              size={16}
                              className="text-teal-600 mr-1 flex-shrink-0"
                            />
                            <span className="font-medium">
                              ${overtime.CalculatedAmount?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <small className="text-gray-500 truncate block">
                            {t("overtimeRate")}: {overtime.OvertimeRate}x
                          </small>
                        </TD>
                        <TD className="min-w-[100px]">
                          {getStatusBadge(overtime.Status)}
                        </TD>
                        <TD className="min-w-[120px] text-center">
                          <Dropdown
                            buttonText={t("actions")}
                            buttonClassName="border-gray-300 text-gray-700 hover:bg-gray-50"
                            items={getDropdownItems(overtime)}
                            onSelect={(item) => item.onClick && item.onClick()}
                          />
                        </TD>
                      </TR>
                    ))}
                  </Tbody>
                </Table>
              </div>

              {/* Pagination */}
              {overtimeRecords?.pagination?.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center py-3 px-4 border-t gap-3">
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
              {editOvertimeId ? t("updateOvertime") : t("addOvertime")}
            </div>
          }
          modalOpen={showAddModal}
          setModalOpen={setShowAddModal}
          okText={editOvertimeId ? t("updateOvertime") : t("addOvertime")}
          cancelText={t("cancel")}
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
                  placeholder={t("selectEmployee")}
                />
                <InputField
                  name="date"
                  type="date"
                  placeholder={t("selectDate")}
                  value={formData.date}
                  onChange={handleInputChange}
                  label={`${t("date")} *`}
                  width="w-full"
                />
                <InputField
                  name="startTime"
                  type="time"
                  placeholder={t("startTime")}
                  value={formData.startTime}
                  onChange={handleInputChange}
                  label={`${t("startTime")} *`}
                  width="w-full"
                />
                <InputField
                  name="endTime"
                  type="time"
                  placeholder={t("endTime")}
                  value={formData.endTime}
                  onChange={handleInputChange}
                  label={`${t("endTime")} *`}
                  width="w-full"
                />
              </div>
              {formData.startTime && formData.endTime && (
                <Alert variant="info" className="my-3">
                  <Info size={16} className="mr-2" />
                  {t("duration")}:{" "}
                  {calculateDuration(formData.startTime, formData.endTime)}
                </Alert>
              )}
              <InputField
                name="reason"
                type="text"
                placeholder={t("reasonRequired")}
                value={formData.reason}
                onChange={handleInputChange}
                label={t("reasonRequired")}
                width="w-full"
                marginBottom="mb-3"
              />
              <InputField
                name="description"
                type="textarea"
                placeholder={t("additionalDetails")}
                value={formData.description}
                onChange={handleInputChange}
                label={t("description")}
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
              {t("overtimeDetails")}
            </div>
          }
          modalOpen={showDetailsModal}
          setModalOpen={setShowDetailsModal}
          okText={t("close")}
          cancelText=""
          okAction={() => setShowDetailsModal(false)}
          cancelButtonDisabled={true}
          width={800}
          body={
            selectedOvertime && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>{t("employee")}:</strong>
                    <p>{selectedOvertime.EmployeeName}</p>
                  </div>
                  <div>
                    <strong>{t("date")}:</strong>
                    <p>{formatDate(selectedOvertime.Date)}</p>
                  </div>
                  <div>
                    <strong>{t("startTime")}:</strong>
                    <p>{formatTime(selectedOvertime.StartTime)}</p>
                  </div>
                  <div>
                    <strong>{t("endTime")}:</strong>
                    <p>{formatTime(selectedOvertime.EndTime)}</p>
                  </div>
                  <div>
                    <strong>{t("duration")}:</strong>
                    <p>{formatDuration(selectedOvertime.Duration)}</p>
                  </div>
                  <div>
                    <strong>{t("status")}:</strong>
                    <p>{getStatusBadge(selectedOvertime.Status)}</p>
                  </div>
                  <div>
                    <strong>{t("overtimeRate")}:</strong>
                    <p>{selectedOvertime.OvertimeRate}x</p>
                  </div>
                  <div>
                    <strong>{t("calculatedAmount")}:</strong>
                    <p>
                      ${selectedOvertime.CalculatedAmount?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
                <div>
                  <strong>{t("reason")}:</strong>
                  <p>{selectedOvertime.Reason}</p>
                </div>
                {selectedOvertime.Description && (
                  <div>
                    <strong>{t("description")}:</strong>
                    <p>{selectedOvertime.Description}</p>
                  </div>
                )}
                {selectedOvertime.ApprovalComments && (
                  <div>
                    <strong>{t("approvalComments")}:</strong>
                    <p>{selectedOvertime.ApprovalComments}</p>
                  </div>
                )}
                {selectedOvertime.RejectionReason && (
                  <div>
                    <strong>{t("rejectionReason")}:</strong>
                    <p>{selectedOvertime.RejectionReason}</p>
                  </div>
                )}
                {selectedOvertime.ApprovedBy && (
                  <div>
                    <strong>{t("approvedBy")}:</strong>
                    <p>{selectedOvertime.ApprovedBy}</p>
                  </div>
                )}
                {selectedOvertime.ApprovalDate && (
                  <div>
                    <strong>{t("approvalDate")}:</strong>
                    <p>{formatDate(selectedOvertime.ApprovalDate)}</p>
                  </div>
                )}
                {selectedOvertime.CreatedDate && (
                  <div>
                    <strong>{t("createdDate")}:</strong>
                    <p>{formatDate(selectedOvertime.CreatedDate)}</p>
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
              {t("approveOvertime")}
            </div>
          }
          modalOpen={showApproveModal}
          setModalOpen={setShowApproveModal}
          okText={t("approve")}
          cancelText={t("cancel")}
          okAction={handleApproveOvertime}
          cancelAction={() => setShowApproveModal(false)}
          okButtonDisabled={loading}
          width={600}
          body={
            <div className="space-y-4">
              <Alert variant="info" className="mb-4">
                <Info size={16} className="mr-2" />
                {t("approveConfirmation")}
              </Alert>
              <InputField
                name="approvalComments"
                type="textarea"
                placeholder={t("approvalComments")}
                value={formData.approvalComments}
                onChange={handleInputChange}
                label={t("approvalComments")}
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
              {t("rejectOvertime")}
            </div>
          }
          modalOpen={showRejectModal}
          setModalOpen={setShowRejectModal}
          okText={t("reject")}
          cancelText={t("cancel")}
          okAction={handleRejectOvertime}
          cancelAction={() => setShowRejectModal(false)}
          okButtonDisabled={loading || !formData.rejectionReason}
          width={600}
          body={
            <div className="space-y-4">
              <Alert variant="warning" className="mb-4">
                <AlertCircle size={16} className="mr-2" />
                {t("rejectConfirmation")}
              </Alert>
              <InputField
                name="rejectionReason"
                type="textarea"
                placeholder={t("rejectionReason")}
                value={formData.rejectionReason}
                onChange={handleInputChange}
                label={`${t("rejectionReason")} *`}
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
              {t("pendingApprovals")}
            </div>
          }
          modalOpen={showPendingModal}
          setModalOpen={setShowPendingModal}
          okText={t("close")}
          cancelText=""
          okAction={() => setShowPendingModal(false)}
          cancelButtonDisabled={true}
          width={1000}
          body={
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-5">
                  <Skeleton height="40px" width="100%" marginBottom="10px" />
                  <p className="text-gray-500">{t("loadingApprovals")}</p>
                </div>
              ) : pendingOvertimeApprovals?.length === 0 ? (
                <div className="text-center py-5">
                  <CheckCircle size={48} className="text-green-500 mb-3" />
                  <h5 className="text-gray-500">{t("noPendingApprovals")}</h5>
                  <p className="text-gray-500">{t("allProcessed")}</p>
                </div>
              ) : (
                <Table className="min-w-full ">
                  <Thead className="bg-gray-50">
                    <TR>
                      <TH>{t("employee")}</TH>
                      <TH>{t("date")}</TH>
                      <TH>{t("duration")}</TH>
                      <TH>{t("reason")}</TH>
                      <TH>{t("amount")}</TH>
                      <TH className="text-center">{t("actions")}</TH>
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
                                {overtime.EmployeeName || t("unknownEmployee")}
                              </div>
                              <small className="text-gray-500">
                                {t("id")}: {overtime.EmployeeId}
                              </small>
                            </div>
                          </div>
                        </TD>
                        <TD>
                          <div>
                            <div>{formatDate(overtime.Date)}</div>
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
                              buttonText={t("approve")}
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
                              buttonText={t("reject")}
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
              {t("employeeSummary")}
            </div>
          }
          modalOpen={showSummaryModal}
          setModalOpen={setShowSummaryModal}
          okText={t("close")}
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
                    setFormData((prev) => ({
                      ...prev,
                      summaryEmployeeId: value,
                    }))
                  }
                  placeholder={t("selectEmployeeSummary")}
                />
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Skeleton height="40px" width="100%" marginBottom="10px" />
                  <p className="text-gray-500">{t("loadingSummary")}</p>
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
                        <small className="text-gray-500">
                          {t("totalHours")}
                        </small>
                      </div>
                    </Card>
                    <Card className="shadow-sm">
                      <div className="text-center p-4">
                        <DollarSign size={24} className="text-green-600 mb-2" />
                        <h4 className="font-bold text-green-600">
                          ${overtimeSummary.totalAmount?.toFixed(2) || "0.00"}
                        </h4>
                        <small className="text-gray-500">
                          {t("totalAmount")}
                        </small>
                      </div>
                    </Card>
                    <Card className="shadow-sm">
                      <div className="text-center p-4">
                        <FileText size={24} className="text-purple-600 mb-2" />
                        <h4 className="font-bold text-purple-600">
                          {overtimeSummary.totalRecords || 0}
                        </h4>
                        <small className="text-gray-500">
                          {t("totalRecords")}
                        </small>
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
                      <small className="text-gray-500">{t("pending")}</small>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle size={20} className="text-green-600 mb-1" />
                      <div className="font-bold text-green-600">
                        {overtimeSummary.approvedCount || 0}
                      </div>
                      <small className="text-gray-500">{t("approved")}</small>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <XCircle size={20} className="text-red-600 mb-1" />
                      <div className="font-bold text-red-600">
                        {overtimeSummary.rejectedCount || 0}
                      </div>
                      <small className="text-gray-500">{t("rejected")}</small>
                    </div>
                  </div>

                  {/* Recent Records */}
                  {overtimeSummary.recentRecords &&
                    overtimeSummary.recentRecords.length > 0 && (
                      <div>
                        <h6 className="font-bold mb-3">{t("recentRecords")}</h6>
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
                                    {formatDate(record.Date)}
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
                  <h5 className="text-gray-500">{t("noSummaryRecords")}</h5>
                  <p className="text-gray-500">{t("noSummaryRecords")}</p>
                </div>
              ) : (
                <div className="text-center py-5">
                  <Users size={48} className="text-gray-500 mb-3" />
                  <h5 className="text-gray-500">{t("noEmployeeSelected")}</h5>
                  <p className="text-gray-500">{t("selectEmployeePrompt")}</p>
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
              {t("confirmDelete")}
            </div>
          }
          modalOpen={showConfirmDelete}
          setModalOpen={setShowConfirmDelete}
          okText={t("delete")}
          cancelText={t("cancel")}
          okAction={confirmDelete}
          cancelAction={() => setShowConfirmDelete(false)}
          okButtonDisabled={loading}
          width={500}
          body={
            <div className="space-y-4">
              <Alert variant="danger" className="mb-4">
                <AlertCircle size={16} className="mr-2" />
                {t("deleteConfirmation")}
              </Alert>
              <p className="text-gray-600">{t("recordWillBeRemoved")}</p>
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
    </div>
  );
};

export default Overtime;
