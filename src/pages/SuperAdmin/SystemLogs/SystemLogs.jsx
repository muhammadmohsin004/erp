import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import systemLogsTranslations from "../../../translations/SystemLogstranslation";

const SystemLogs = () => {
  const {
    systemLogs,
    systemLogsPagination,
    isLogsLoading,
    getSystemLogs,
    error,
    clearError,
  } = useSuperAdmin();

  // Get current language from Redux
  const { language: currentLanguage } = useSelector((state) => state.language);
  const isArabic = currentLanguage === "ar";
  const t = systemLogsTranslations[currentLanguage] || systemLogsTranslations.en;

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

  // Filter options with translations
  const levelOptions = [
    { value: "", label: t.allLevels },
    { value: "Info", label: t.info },
    { value: "Warning", label: t.warning },
    { value: "Error", label: t.error },
    { value: "Debug", label: t.debug },
  ];

  const actionOptions = [
    { value: "", label: t.allActions },
    { value: "ImpersonateUser", label: t.impersonateUser },
    { value: "Login", label: t.login },
    { value: "Logout", label: t.logout },
    { value: "Create", label: t.create },
    { value: "Update", label: t.update },
    { value: "Delete", label: t.delete },
    { value: "Export", label: t.export },
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
      setSuccessMessage(t.successRefresh);
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
    if (!dateString) return t.notAvailable;
    const date = new Date(dateString);
    return date.toLocaleString(isArabic ? "ar-SA" : "en-US");
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Get all logs for export
      const exportData = await getSystemLogs(
        1,
        10000,
        levelFilter,
        actionFilter,
        startDate,
        endDate
      );

      const csvData = exportData.items.map((log) => ({
        [t.id]: log.id,
        [t.level]: log.level,
        [t.action]: log.action,
        [t.message]: log.message,
        [t.company]: log.companyName || t.notAvailable,
        [t.userEmail]: log.userEmail || t.notAvailable,
        [t.adminEmail]: log.adminEmail || t.notAvailable,
        [t.ipAddress]: log.ipAddress || t.notAvailable,
        [t.createdAt]: formatDate(log.createdAt),
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

      setSuccessMessage(t.exportSuccess);
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
    <Container className={`py-6 px-4 max-w-7xl ${isArabic ? 'rtl' : 'ltr'}`}>
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
        heading={t.systemLogs}
        subHeading={t.subHeading}
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
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={`w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isArabic ? 'text-right' : 'text-left'
                  }`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <FiSearch className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
              </Container>
            </Container>

            <Container className="flex gap-2">
              <FilledButton
                isIcon={true}
                icon={FiRefreshCw}
                isIconLeft={!isArabic}
                buttonText={t.refresh}
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
                isIconLeft={!isArabic}
                buttonText={t.export}
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
                label={t.level}
                name="level"
                placeholder={t.selectLevel}
                optionList={levelOptions}
                value={levelFilter}
                handleChange={handleLevelChange}
                width="w-full"
              />
            </Container>

            <Container className="flex-1">
              <SelectBox
                label={t.action}
                name="action"
                placeholder={t.selectAction}
                optionList={actionOptions}
                value={actionFilter}
                handleChange={handleActionChange}
                width="w-full"
              />
            </Container>

            <Container className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.startDate}
              </label>
              <Container className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  className={`w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isArabic ? 'text-right' : 'text-left'
                  }`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <FiCalendar className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
              </Container>
            </Container>

            <Container className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.endDate}
              </label>
              <Container className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  className={`w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isArabic ? 'text-right' : 'text-left'
                  }`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <FiCalendar className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
              </Container>
            </Container>
          </Container>

          {/* Clear Filters and Results Count */}
          <Container className="flex justify-between items-center">
            <OutlineButton
              isIcon={true}
              icon={FiFilter}
              isIconLeft={!isArabic}
              buttonText={t.clearFilters}
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
                {t.showing}{" "}
                {(systemLogsPagination.page - 1) *
                  systemLogsPagination.pageSize +
                  1}
                -
                {Math.min(
                  systemLogsPagination.page * systemLogsPagination.pageSize,
                  systemLogsPagination.totalCount
                )}{" "}
                {t.of} {systemLogsPagination.totalCount} {t.logs}
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
                <TH className="w-16">{t.id}</TH>
                <TH className="w-24">{t.level}</TH>
                <TH className="w-32">{t.action}</TH>
                <TH className="w-80">{t.message}</TH>
                <TH className="w-40">{t.company}</TH>
                <TH className="w-48">{t.userEmail}</TH>
                <TH className="w-48">{t.adminEmail}</TH>
                <TH className="w-32">{t.ipAddress}</TH>
                <TH className="w-40">{t.createdAt}</TH>
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
                      {log.companyName || t.notAvailable}
                    </TD>
                    <TD className="text-gray-600">{log.UserEmail || t.notAvailable}</TD>
                    <TD className="text-gray-600">{log.AdminEmail || t.notAvailable}</TD>
                    <TD className="text-gray-600">{log.IpAddress || t.notAvailable}</TD>
                    <TD className="text-gray-600">
                      {formatDate(log.CreatedAt)}
                    </TD>
                  </TR>
                ))
              ) : (
                <TR>
                  <TD colSpan={9} className="text-center py-8 text-gray-500">
                    {t.noLogsFound}
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