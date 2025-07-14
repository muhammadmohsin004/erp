import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Clock,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Filter,
  Download,
} from "lucide-react";
import { useLeaveAttendance } from "../../../Contexts/LeaveContext/LeaveContext";
import { useHR } from "../../../Contexts/HRContext/HRContext";
import Container from "../../../components/elements/container/Container";
import Card from "../../../components/elements/card/Card";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import OutlineButton from "../../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Skeleton from "../../../components/elements/skeleton/Skeleton";
import Table from "../../../components/elements/table/Table";
import Thead from "../../../components/elements/thead/Thead";
import TR from "../../../components/elements/tr/TR";
import TH from "../../../components/elements/th/TH";
import Tbody from "../../../components/elements/tbody/Tbody";
import TD from "../../../components/elements/td/TD";
import Pagination from "../../../components/elements/Pagination/Pagination";
import BodyHeader from "../../../components/elements/bodyHeader/BodyHeader";
import Alert from "../../../components/elements/Alert/Alert";
import Modall from "../../../components/elements/modal/Modal";
import Badge from "../../../components/elements/Badge/Badge";
import { AttendanceModuleTranslation } from "../../../translations/AttendanceModuleTranslation";

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

const AttendanceModule = () => {
  const { language: currentLanguage } = useSelector((state) => state.language);
  const t = (key) =>
    AttendanceModuleTranslation[currentLanguage || "en"][key] || key;

  const {
    attendances,
    attendanceDetail,
    attendancesPagination,
    attendanceSummary,
    isAttendanceLoading,
    isProcessing,
    error,
    getAttendances,
    getAttendance,
    checkIn,
    checkOut,
    getEmployeeAttendanceSummary,
    clearError,
    clearAttendanceDetail,
    clearAttendanceSummary,
  } = useLeaveAttendance();

  const { fetchEmployees, employees } = useHR();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    employeeId: "",
    status: "",
  });
  const [checkInModal, setCheckInModal] = useState(false);
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [summaryModal, setSummaryModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [checkInData, setCheckInData] = useState({
    location: "",
    notes: "",
  });
  const [checkOutData, setCheckOutData] = useState({
    location: "",
    notes: "",
  });

  const monthOptions = (t) => [
    { label: t("January"), value: 1 },
    { label: t("February"), value: 2 },
    { label: t("March"), value: 3 },
    { label: t("April"), value: 4 },
    { label: t("May"), value: 5 },
    { label: t("June"), value: 6 },
    { label: t("July"), value: 7 },
    { label: t("August"), value: 8 },
    { label: t("September"), value: 9 },
    { label: t("October"), value: 10 },
    { label: t("November"), value: 11 },
    { label: t("December"), value: 12 },
  ];

  const [summaryFilters, setSummaryFilters] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    loadAttendances();
    loadEmployees();
  }, [filters, currentPage]);

  const loadAttendances = async () => {
    try {
      await getAttendances(
        filters.fromDate,
        filters.toDate,
        filters.employeeId,
        filters.status
      );
    } catch (error) {
      console.error("Error loading attendances:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      await fetchEmployees();
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const handleCheckIn = async () => {
    try {
      await checkIn(checkInData);
      setCheckInModal(false);
      setCheckInData({ location: "", notes: "" });
      loadAttendances();
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut(checkOutData);
      setCheckOutModal(false);
      setCheckOutData({ location: "", notes: "" });
      loadAttendances();
    } catch (error) {
      console.error("Check-out failed:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      await getAttendance(id);
      setDetailModal(true);
    } catch (error) {
      console.error("Error fetching attendance details:", error);
    }
  };

  const handleViewSummary = async () => {
    try {
      await getEmployeeAttendanceSummary(
        summaryFilters.employeeId,
        summaryFilters.month,
        summaryFilters.year
      );
      setSummaryModal(true);
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      employeeId: "",
      status: "",
    });
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(
      currentLanguage === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString(
      currentLanguage === "ar" ? "ar-EG" : "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Present: { variant: "success", text: t("present") },
      Absent: { variant: "danger", text: t("absent") },
      Late: { variant: "warning", text: t("late") },
      "Half Day": { variant: "info", text: t("halfDay") },
    };

    const statusInfo = statusMap[status] || {
      variant: "secondary",
      text: status,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const filteredAttendances = attendances.filter(
    (attendance) =>
      attendance.employeeName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      attendance.status?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const statusOptions = [
    { value: "", label: t("allStatus") },
    { value: "Present", label: t("present") },
    { value: "Absent", label: t("absent") },
    { value: "Late", label: t("late") },
    { value: "Half Day", label: t("halfDay") },
  ];

  const tabs = [
    { id: "dashboard", label: t("dashboard"), icon: BarChart3 },
    { id: "attendance", label: t("attendanceRecords"), icon: Calendar },
    { id: "checkin", label: t("checkInOut"), icon: Clock },
  ];

  const renderDashboard = () => (
    <Container className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("totalRecords")}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {attendances.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("presentToday")}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {attendances.filter((a) => a.status === "Present").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("lateArrivals")}
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {attendances.filter((a) => a.status === "Late").length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("absent")}</p>
              <p className="text-2xl font-bold text-red-600">
                {attendances.filter((a) => a.status === "Absent").length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("quickActions")}
          </h3>
          <div className="space-y-3">
            <FilledButton
              buttonText={t("checkIn")}
              icon={Clock}
              isIcon={true}
              isIconLeft={true}
              onClick={() => setCheckInModal(true)}
              width="w-full"
            />
            <OutlineButton
              buttonText={t("checkOut")}
              icon={Clock}
              isIcon={true}
              isIconLeft={true}
              onClick={() => setCheckOutModal(true)}
              width="w-full"
              borderColor="border-primary"
              borderWidth="border-2"
              textColor="text-primary"
              bgColor="bg-white"
              height="h-10"
              rounded="rounded-md"
              fontWeight="font-medium"
              fontSize="text-sm"
              px="px-4"
              hover="hover:bg-blue-50"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("attendanceSummary")}
          </h3>
          <div className="space-y-4">
            <EmployeeSelect
              employees={employees}
              selectedEmployeeId={summaryFilters.employeeId}
              onEmployeeChange={(value) =>
                setSummaryFilters((prev) => ({
                  ...prev,
                  employeeId: value,
                }))
              }
              placeholder={t("selectEmployee")}
            />
            <div className="grid grid-cols-2 gap-4">
              <SelectBox
                placeholder={t("month")}
                value={summaryFilters.month}
                handleChange={(value) =>
                  setSummaryFilters((prev) => ({ ...prev, month: value }))
                }
                optionList={monthOptions(t)}
                width="w-full"
              />

              <InputField
                type="number"
                placeholder={t("year")}
                value={summaryFilters.year}
                onChange={(e) =>
                  setSummaryFilters((prev) => ({
                    ...prev,
                    year: e.target.value,
                  }))
                }
                width="w-full"
              />
            </div>
            <FilledButton
              buttonText={t("viewSummary")}
              icon={BarChart3}
              isIcon={true}
              isIconLeft={true}
              onClick={handleViewSummary}
              width="w-full"
            />
          </div>
        </Card>
      </div>
    </Container>
  );

  const renderAttendanceRecords = () => (
    <Container className="space-y-6">
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <SearchAndFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder={t("searchPlaceholder")}
              isFocused={isFocused}
            />
            <div className="flex items-center gap-3">
              <FilledButton
                buttonText={t("clearFilters")}
                icon={Filter}
                isIcon={true}
                isIconLeft={true}
                onClick={clearFilters}
                bgColor="bg-gray-500"
              />
              <FilledButton
                buttonText={t("export")}
                icon={Download}
                isIcon={true}
                isIconLeft={true}
                onClick={() => console.log("Export functionality")}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              type="date"
              placeholder={t("fromDate")}
              value={filters.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              width="w-full"
            />
            <InputField
              type="date"
              placeholder={t("toDate")}
              value={filters.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
              width="w-full"
            />
            <EmployeeSelect
              employees={employees}
              selectedEmployeeId={filters.employeeId}
              onEmployeeChange={(value) =>
                handleFilterChange("employeeId", value)
              }
              placeholder={t("selectEmployee")}
            />
            <SelectBox
              placeholder={t("status")}
              value={filters.status}
              handleChange={(value) => handleFilterChange("status", value)}
              optionList={statusOptions}
              width="w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isAttendanceLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} height="60px" width="100%" />
              ))}
            </div>
          ) : (
            <Table>
              <Thead className="bg-gray-50">
                <TR>
                  <TH>{t("employee")}</TH>
                  <TH>{t("date")}</TH>
                  <TH>{t("checkInTime")}</TH>
                  <TH>{t("checkOutTime")}</TH>
                  <TH>{t("status")}</TH>
                  <TH>{t("workingHours")}</TH>
                  <TH>{t("actions")}</TH>
                </TR>
              </Thead>
              <Tbody>
                {filteredAttendances.length === 0 ? (
                  <TR>
                    <TD colSpan={7} className="text-center py-8 text-gray-500">
                      {t("noRecords")}
                    </TD>
                  </TR>
                ) : (
                  filteredAttendances.map((attendance) => (
                    <TR key={attendance.id}>
                      <TD>
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {attendance.employeeName || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {attendance.employeeId}
                            </p>
                          </div>
                        </div>
                      </TD>
                      <TD>{formatDate(attendance.date)}</TD>
                      <TD>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-green-500 mr-1" />
                          {formatTime(attendance.checkInTime)}
                        </div>
                      </TD>
                      <TD>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-red-500 mr-1" />
                          {formatTime(attendance.checkOutTime)}
                        </div>
                      </TD>
                      <TD>{getStatusBadge(attendance.status)}</TD>
                      <TD>
                        <span className="text-sm text-gray-900">
                          {attendance.workingHours || "-"}
                        </span>
                      </TD>
                      <TD>
                        <FilledButton
                          buttonText=""
                          icon={Eye}
                          isIcon={true}
                          onClick={() => handleViewDetails(attendance.id)}
                          width="w-8"
                          height="h-8"
                          px="px-0"
                          fontSize="text-xs"
                        />
                      </TD>
                    </TR>
                  ))
                )}
              </Tbody>
            </Table>
          )}
        </div>

        {attendancesPagination && (
          <div className="p-6 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={attendancesPagination.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>
    </Container>
  );

  const renderCheckInOut = () => (
    <Container className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <Clock className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("checkIn")}
            </h3>
            <p className="text-sm text-gray-600 mb-6">{t("startYourDay")}</p>
            <FilledButton
              buttonText={t("checkInNow")}
              icon={CheckCircle}
              isIcon={true}
              isIconLeft={true}
              onClick={() => setCheckInModal(true)}
              width="w-full"
              bgColor="bg-green-500"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <Clock className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("checkOut")}
            </h3>
            <p className="text-sm text-gray-600 mb-6">{t("endYourDay")}</p>
            <FilledButton
              buttonText={t("checkOutNow")}
              icon={XCircle}
              isIcon={true}
              isIconLeft={true}
              onClick={() => setCheckOutModal(true)}
              width="w-full"
              bgColor="bg-red-500"
            />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t("todaysActivity")}
        </h3>
        <div className="space-y-4">
          {attendances.slice(0, 5).map((attendance) => (
            <div
              key={attendance.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {attendance.employeeName}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {attendance.employeeId}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(attendance.checkInTime)}
                  </p>
                  <p className="text-xs text-gray-500">{t("checkInTime")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(attendance.checkOutTime)}
                  </p>
                  <p className="text-xs text-gray-500">{t("checkOutTime")}</p>
                </div>
                {getStatusBadge(attendance.status)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Container>
  );

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        currentLanguage === "ar" ? "rtl" : ""
      }`}
    >
      <Container className="py-8">
        <BodyHeader
          heading={t("attendanceManagement")}
          subHeading={t("trackAndManage")}
        />

        {error && (
          <Alert
            variant="danger"
            message={error}
            onClose={clearError}
            className="mb-6"
          />
        )}

        {/* Tab Navigation */}
        <Card className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </Card>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "attendance" && renderAttendanceRecords()}
          {activeTab === "checkin" && renderCheckInOut()}
        </div>

        {/* Check In Modal */}
        <Modall
          title={t("checkIn")}
          modalOpen={checkInModal}
          setModalOpen={setCheckInModal}
          okText={t("checkIn")}
          cancelText={t("cancel")}
          okAction={handleCheckIn}
          cancelAction={() => setCheckInModal(false)}
          okButtonDisabled={isProcessing}
          body={
            <div className="space-y-4">
              <InputField
                placeholder={t("location")}
                value={checkInData.location}
                onChange={(e) =>
                  setCheckInData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                width="w-full"
                icon={MapPin}
              />
              <InputField
                placeholder={t("notesOptional")}
                value={checkInData.notes}
                onChange={(e) =>
                  setCheckInData((prev) => ({ ...prev, notes: e.target.value }))
                }
                width="w-full"
              />
            </div>
          }
        />

        {/* Check Out Modal */}
        <Modall
          title={t("checkOut")}
          modalOpen={checkOutModal}
          setModalOpen={setCheckOutModal}
          okText={t("checkOut")}
          cancelText={t("cancel")}
          okAction={handleCheckOut}
          cancelAction={() => setCheckOutModal(false)}
          // okButtonDisabled={isProcessing}
          body={
            <div className="space-y-4">
              <InputField
                placeholder={t("location")}
                value={checkOutData.location}
                onChange={(e) =>
                  setCheckOutData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                width="w-full"
                icon={MapPin}
              />
              <InputField
                placeholder={t("notesOptional")}
                value={checkOutData.notes}
                onChange={(e) =>
                  setCheckOutData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                width="w-full"
              />
            </div>
          }
        />

        {/* Attendance Detail Modal */}
        <Modall
          title={t("attendanceDetails")}
          modalOpen={detailModal}
          setModalOpen={setDetailModal}
          okText={t("close")}
          cancelText=""
          okAction={() => setDetailModal(false)}
          width={600}
          body={
            attendanceDetail && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("employee")}
                    </label>
                    <p className="text-sm text-gray-900">
                      {attendanceDetail.employeeName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("date")}
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(attendanceDetail.date)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("checkInTime")}
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatTime(attendanceDetail.checkInTime)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("checkOutTime")}
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatTime(attendanceDetail.checkOutTime)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("status")}
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(attendanceDetail.status)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("workingHours")}
                    </label>
                    <p className="text-sm text-gray-900">
                      {attendanceDetail.workingHours || "-"}
                    </p>
                  </div>
                </div>
                {attendanceDetail.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("notes")}
                    </label>
                    <p className="text-sm text-gray-900">
                      {attendanceDetail.notes}
                    </p>
                  </div>
                )}
              </div>
            )
          }
        />

        {/* Attendance Summary Modal */}
        <Modall
          title={t("attendanceSummary")}
          modalOpen={summaryModal}
          setModalOpen={setSummaryModal}
          okText={t("close")}
          cancelText=""
          okAction={() => setSummaryModal(false)}
          width={700}
          body={
            attendanceSummary && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">
                      {t("totalPresent")}
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {attendanceSummary.totalPresent || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600">{t("totalAbsent")}</p>
                    <p className="text-2xl font-bold text-red-700">
                      {attendanceSummary.totalAbsent || 0}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600">{t("lateDays")}</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {attendanceSummary.lateDays || 0}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">{t("workingDays")}</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {attendanceSummary.workingDays || 0}
                    </p>
                  </div>
                </div>

                {attendanceSummary.details && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {t("dailyBreakdown")}
                    </h4>
                    <div className="max-h-60 overflow-y-auto">
                      <Table>
                        <Thead className="bg-gray-50">
                          <TR>
                            <TH>{t("date")}</TH>
                            <TH>{t("checkInTime")}</TH>
                            <TH>{t("checkOutTime")}</TH>
                            <TH>{t("status")}</TH>
                            <TH>{t("workingHours")}</TH>
                          </TR>
                        </Thead>
                        <Tbody>
                          {attendanceSummary.details.map((detail, index) => (
                            <TR key={index}>
                              <TD>{formatDate(detail.date)}</TD>
                              <TD>{formatTime(detail.checkInTime)}</TD>
                              <TD>{formatTime(detail.checkOutTime)}</TD>
                              <TD>{getStatusBadge(detail.status)}</TD>
                              <TD>{detail.workingHours || "-"}</TD>
                            </TR>
                          ))}
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                )}

                {attendanceSummary.attendanceRate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {t("attendanceRate")}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {attendanceSummary.attendanceRate}%
                      </span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${attendanceSummary.attendanceRate}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          }
        />
      </Container>
    </div>
  );
};

export default AttendanceModule;
