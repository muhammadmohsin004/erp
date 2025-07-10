import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiDownload,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiCalendar,
} from "react-icons/fi";
import Container from "../../../components/elements/container/Container";
import Alert from "../../../components/elements/alert/Alert";
import Card from "../../../components/elements/card/Card";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import OutlineButton from "../../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import Table from "../../../components/elements/table/Table";
import Thead from "../../../components/elements/thead/Thead";
import Tbody from "../../../components/elements/tbody/Tbody";
import TH from "../../../components/elements/th/TH";
import TR from "../../../components/elements/tr/TR";
import TD from "../../../components/elements/td/TD";
import Skeleton from "../../../components/elements/skeleton/Skeleton";
import Badge from "../../../components/elements/badge/Badge";
import { useSuperAdmin } from "../../../Contexts/superAdminApiClient/superAdminApiClient";
import BodyHeader from "../../../components/elements/bodyHeader/BodyHeader";

const SystemLogs = () => {
  const {
    systemLogs,
    systemLogsPagination,
    isLogsLoading,
    getSystemLogs,
    error,
    clearError,
  } = useSuperAdmin();
  //   console.log

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [successMessage, setSuccessMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Filter options
  const levelOptions = [
    { value: "", label: "All Levels" },
    { value: "Info", label: "Info" },
    { value: "Warning", label: "Warning" },
    { value: "Error", label: "Error" },
    { value: "Debug", label: "Debug" },
  ];

  const actionOptions = [
    { value: "", label: "All Actions" },
    { value: "ImpersonateUser", label: "Impersonate User" },
    { value: "Login", label: "Login" },
    { value: "Logout", label: "Logout" },
    { value: "Create", label: "Create" },
    { value: "Update", label: "Update" },
    { value: "Delete", label: "Delete" },
    { value: "Export", label: "Export" },
  ];

  // Load logs on component mount and when filters change
  useEffect(() => {
    loadLogs();
  }, [currentPage, levelFilter, actionFilter, startDate, endDate]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {
        setCurrentPage(1);
        loadLogs();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadLogs = async () => {
    try {
      await getSystemLogs(
        currentPage,
        pageSize,
        levelFilter,
        actionFilter,
        startDate,
        endDate
      );
    } catch (err) {
      console.error("Error loading logs:", err);
    }
  };

  const handleRefresh = async () => {
    try {
      await loadLogs();
      setSuccessMessage("System logs refreshed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error refreshing logs:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLevelChange = (value) => {
    setLevelFilter(value);
    setCurrentPage(1);
  };

  const handleActionChange = (value) => {
    setActionFilter(value);
    setCurrentPage(1);
  };

  const handleDateChange = (type, value) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLevelFilter("");
    setActionFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const getBadgeVariant = (level) => {
    switch (level) {
      case "Error":
        return "danger";
      case "Warning":
        return "warning";
      case "Info":
        return "info";
      case "Debug":
        return "secondary";
      default:
        return "primary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Get all logs for export (you might want to implement a separate export endpoint)
      const exportData = await getSystemLogs(
        1,
        10000,
        levelFilter,
        actionFilter,
        startDate,
        endDate
      );

      const csvData = exportData.items.map((log) => ({
        Id: log.id,
        Level: log.level,
        Action: log.action,
        Message: log.message,
        CompanyName: log.companyName || "N/A",
        UserEmail: log.userEmail || "N/A",
        AdminEmail: log.adminEmail || "N/A",
        IPAddress: log.ipAddress || "N/A",
        CreatedAt: formatDate(log.createdAt),
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(","),
        ...csvData.map((row) =>
          Object.values(row)
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `system_logs_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccessMessage("Logs exported successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error exporting logs:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    if (!systemLogsPagination || systemLogsPagination.totalPages <= 1)
      return null;

    const { page, totalPages } = systemLogsPagination;
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Container className="flex justify-center items-center mt-6">
        <Container className="flex items-center space-x-2">
          <OutlineButton
            isIcon={true}
            icon={FiChevronsLeft}
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            borderColor="border-gray-300"
            textColor="text-gray-500"
            bgColor="bg-white"
            height="h-8"
            width="w-8"
            px="px-0"
          />
          <OutlineButton
            isIcon={true}
            icon={FiChevronLeft}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            borderColor="border-gray-300"
            textColor="text-gray-500"
            bgColor="bg-white"
            height="h-8"
            width="w-8"
            px="px-0"
          />

          {pages.map((pageNum) => (
            <FilledButton
              key={pageNum}
              buttonText={pageNum.toString()}
              onClick={() => handlePageChange(pageNum)}
              bgColor={pageNum === page ? "bg-blue-600" : "bg-white"}
              textColor={pageNum === page ? "text-white" : "text-gray-700"}
              borderColor={
                pageNum === page ? "border-blue-600" : "border-gray-300"
              }
              height="h-8"
              width="w-8"
              px="px-0"
              fontSize="text-sm"
            />
          ))}

          <OutlineButton
            isIcon={true}
            icon={FiChevronRight}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            borderColor="border-gray-300"
            textColor="text-gray-500"
            bgColor="bg-white"
            height="h-8"
            width="w-8"
            px="px-0"
          />
          <OutlineButton
            isIcon={true}
            icon={FiChevronsRight}
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            borderColor="border-gray-300"
            textColor="text-gray-500"
            bgColor="bg-white"
            height="h-8"
            width="w-8"
            px="px-0"
          />
        </Container>
      </Container>
    );
  };

  return (
    <Container className="py-6 px-4 max-w-7xl">
      {/* Success Message */}
      {successMessage && (
        <Container className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {successMessage}
        </Container>
      )}

      {/* Error Message */}
      {error && (
        <Container className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <Container className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </Container>
        </Container>
      )}

      {/* Header */}
      <BodyHeader
        heading="System Logs"
        subHeading="Monitor and analyze system activities and events"
        icon={FiActivity}
      />

      {/* Controls */}
      <Card className="mb-6 mt-6">
        <Container className="p-4">
          {/* Top Row - Search and Actions */}
          <Container className="flex flex-col lg:flex-row gap-4 mb-4">
            <Container className="flex-1">
              <Container className="relative">
                <input
                  type="text"
                  placeholder="Search logs by message, email, company, or IP..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </Container>
            </Container>

            <Container className="flex gap-2">
              <FilledButton
                isIcon={true}
                icon={FiRefreshCw}
                isIconLeft={true}
                buttonText="Refresh"
                onClick={handleRefresh}
                bgColor="bg-gray-600"
                textColor="text-white"
                height="h-10"
                px="px-4"
                disabled={isLogsLoading}
              />
              <FilledButton
                isIcon={true}
                icon={FiDownload}
                isIconLeft={true}
                buttonText="Export"
                onClick={exportToCSV}
                bgColor="bg-green-600"
                textColor="text-white"
                height="h-10"
                px="px-4"
                disabled={isExporting}
              />
            </Container>
          </Container>

          {/* Filters Row */}
          <Container className="flex flex-col lg:flex-row gap-4 mb-4">
            <Container className="flex-1">
              <SelectBox
                label="Level"
                name="level"
                placeholder="Select level"
                optionList={levelOptions}
                value={levelFilter}
                handleChange={handleLevelChange}
                width="w-full"
              />
            </Container>

            <Container className="flex-1">
              <SelectBox
                label="Action"
                name="action"
                placeholder="Select action"
                optionList={actionOptions}
                value={actionFilter}
                handleChange={handleActionChange}
                width="w-full"
              />
            </Container>

            <Container className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Container className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </Container>
            </Container>

            <Container className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Container className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </Container>
            </Container>
          </Container>

          {/* Clear Filters and Results Count */}
          <Container className="flex justify-between items-center">
            <OutlineButton
              isIcon={true}
              icon={FiFilter}
              isIconLeft={true}
              buttonText="Clear Filters"
              onClick={clearFilters}
              borderColor="border-gray-300"
              textColor="text-gray-600"
              bgColor="bg-white"
              height="h-8"
              px="px-3"
              fontSize="text-sm"
            />

            {systemLogsPagination && (
              <Container className="text-sm text-gray-600">
                Showing{" "}
                {(systemLogsPagination.page - 1) *
                  systemLogsPagination.pageSize +
                  1}
                -
                {Math.min(
                  systemLogsPagination.page * systemLogsPagination.pageSize,
                  systemLogsPagination.totalCount
                )}{" "}
                of {systemLogsPagination.totalCount} logs
              </Container>
            )}
          </Container>
        </Container>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <Container className="overflow-x-auto">
          <Table>
            <Thead className="bg-gray-50">
              <TR>
                <TH className="w-16">ID</TH>
                <TH className="w-24">Level</TH>
                <TH className="w-32">Action</TH>
                <TH className="w-80">Message</TH>
                <TH className="w-40">Company</TH>
                <TH className="w-48">User Email</TH>
                <TH className="w-48">Admin Email</TH>
                <TH className="w-32">IP Address</TH>
                <TH className="w-40">Created At</TH>
              </TR>
            </Thead>
            <Tbody>
              {isLogsLoading ? (
                // Loading skeletons
                Array.from({ length: 10 }).map((_, index) => (
                  <TR key={index}>
                    <TD>
                      <Skeleton height="20px" width="40px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="60px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="80px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="200px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="100px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="150px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="150px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="100px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="120px" />
                    </TD>
                  </TR>
                ))
              ) : systemLogs && systemLogs.length > 0 ? (
                systemLogs.map((log) => (
                  <TR key={log.id}>
                    <TD className="font-medium">{log.Id}</TD>
                    <TD>
                      <Badge variant={getBadgeVariant(log.Level)}>
                        {log.level}
                      </Badge>
                    </TD>
                    <TD>
                      <Badge variant="secondary">{log.Action}</Badge>
                    </TD>
                    <TD>
                      <Container
                        className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                        title={log.Message}
                      >
                        {log.Message}
                      </Container>
                    </TD>
                    <TD className="text-gray-600">
                      {log.companyName || "N/A"}
                    </TD>
                    <TD className="text-gray-600">{log.UserEmail || "N/A"}</TD>
                    <TD className="text-gray-600">{log.AdminEmail || "N/A"}</TD>
                    <TD className="text-gray-600">{log.IpAddress || "N/A"}</TD>
                    <TD className="text-gray-600">
                      {formatDate(log.CreatedAt)}
                    </TD>
                  </TR>
                ))
              ) : (
                <TR>
                  <TD colSpan={9} className="text-center py-8 text-gray-500">
                    No system logs found matching your criteria
                  </TD>
                </TR>
              )}
            </Tbody>
          </Table>
        </Container>
      </Card>

      {/* Pagination */}
      {renderPagination()}
    </Container>
  );
};

export default SystemLogs;
