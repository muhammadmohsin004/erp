// pages/users/ManageUsers.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
  FiDownload,
} from "react-icons/fi";
import Table from "../../../components/elements/table/Table";
import Tbody from "../../../components/elements/tbody/Tbody";
import TH from "../../../components/elements/th/TH";
import TR from "../../../components/elements/tr/TR";
import TD from "../../../components/elements/td/TD";
import FilledButton from "../../../components/elements//elements/buttons/filledButton/FilledButton";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Badge from "../../../components/elements/Badge/Badge";
import Dropdown from "../../../components/elements/dropdown/Dropdown";
import Alert from "../../../components/elements/Alert/Alert";
import Pagination from "../../../components/elements/Pagination/Pagination";
import Container from "../../../components/elements/container/Container";
import Card from "../../../components/elements/card/Card";
import { useSuperAdmin } from "../../../Contexts/superAdminApiClient/superAdminApiClient";
import manageUsersTranslations from "../../../translations/ManageUserstranslation";

const ManageUsers = () => {
  // Redux state for language
  const { language: currentLanguage } = useSelector((state) => state.language);
  
  // Get current translations based on language
  const t = manageUsersTranslations[currentLanguage] || manageUsersTranslations.en;
  
  // Check if Arabic is selected
  const isArabic = currentLanguage === "ar";

  // State for users data
  const {
    allUsers,
    getAllUsers,
  } = useSuperAdmin();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "FirstName",
    direction: "asc",
  });
  const users = allUsers;

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          (user.FirstName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (user.LastName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (user.Email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.Role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (user) => user.IsActive === (statusFilter === "active")
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle null/undefined values
        if (aValue == null) aValue = "";
        if (bValue == null) bValue = "";

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, roleFilter, statusFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Available roles and statuses for filters - now using translations
  const roles = [
    { label: t.allRoles, value: "all" },
    { label: t.admin, value: "Admin" },
    { label: t.user, value: "User" },
    { label: t.manager, value: "Manager" },
  ];

  const statuses = [
    { label: t.allStatuses, value: "all" },
    { label: t.active, value: "active" },
    { label: t.inactive, value: "inactive" },
  ];

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return "danger";
      case "Manager":
        return "warning";
      default:
        return "primary";
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? "success" : "secondary";
  };

  const getStatusText = (isActive) => {
    return isActive ? t.active : t.inactive;
  };

  const getRoleText = (role) => {
    switch (role) {
      case "Admin":
        return t.admin;
      case "Manager":
        return t.manager;
      case "User":
        return t.user;
      default:
        return role;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t.neverLoggedIn;
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Export data function
  const exportToCSV = () => {
    const csvData = filteredUsers.map((user) => ({
      [t.exportName]: `${user.FirstName} ${user.LastName}`,
      [t.exportEmail]: user.Email,
      [t.exportRole]: getRoleText(user.Role),
      [t.exportStatus]: getStatusText(user.IsActive),
      [t.exportLastLogin]: formatDate(user.LastLoginAt),
      [t.exportCompany]: user.CompanyName || t.notApplicable,
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
      `users_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessMessage(t.dataExportedSuccessfully);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Refresh users
  const handleRefresh = () => {
    setLoading(true);
    getAllUsers().then(() => {
      setSuccessMessage(t.usersRefreshedSuccessfully);
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    });
  };

  return (
    <Container className={`py-4 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="mb-4">
        <h2 className={`text-2xl font-bold text-gray-800 flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
          <FiUsers className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
          {t.pageTitle}
        </h2>
      </div>

      {successMessage && (
        <Alert
          variant="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {error && (
        <Alert variant="danger" message={error} onClose={() => setError("")} />
      )}

      <Card className="mb-4">
        <div className="p-6">
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2">
              <FilledButton
                buttonText={t.refresh}
                isIcon
                icon={FiRefreshCw}
                isIconLeft
                bgColor="bg-gray-100"
                textColor="text-gray-700"
                onClick={handleRefresh}
              />
              <FilledButton
                buttonText={t.exportData}
                isIcon
                icon={FiDownload}
                isIconLeft
                bgColor="bg-green-100"
                textColor="text-green-700"
                onClick={exportToCSV}
              />
            </div>

            <div className="w-full md:w-auto">
              <SearchAndFilters
                searchValue={searchTerm}
                setSearchValue={setSearchTerm}
                placeholder={t.searchPlaceholder}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2">
              <Dropdown
                buttonText={`${t.roleFilter}: ${
                  roleFilter === "all" ? t.allRoles : getRoleText(roleFilter)
                }`}
                items={roles}
                onSelect={(item) => setRoleFilter(item.value)}
              />
              <Dropdown
                buttonText={`${t.statusFilter}: ${
                  statusFilter === "all" ? t.allStatuses : 
                  statusFilter === "active" ? t.active : t.inactive
                }`}
                items={statuses}
                onSelect={(item) => setStatusFilter(item.value)}
              />
            </div>

            <div className="text-sm text-gray-500">
              {t.showing} {indexOfFirstUser + 1}-
              {Math.min(indexOfLastUser, filteredUsers.length)} {t.of}{" "}
              {filteredUsers.length} {t.users}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">{t.loadingUsers}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <thead className="bg-gray-50">
                    <TR>
                      <TH
                        onClick={() => requestSort("FirstName")}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          {t.name}
                          {sortConfig.key === "FirstName" &&
                            (sortConfig.direction === "asc" ? (
                              <FiChevronUp className="ml-1" />
                            ) : (
                              <FiChevronDown className="ml-1" />
                            ))}
                        </div>
                      </TH>
                      <TH
                        onClick={() => requestSort("Email")}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          {t.email}
                          {sortConfig.key === "Email" &&
                            (sortConfig.direction === "asc" ? (
                              <FiChevronUp className="ml-1" />
                            ) : (
                              <FiChevronDown className="ml-1" />
                            ))}
                        </div>
                      </TH>
                      <TH
                        onClick={() => requestSort("Role")}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          {t.role}
                          {sortConfig.key === "Role" &&
                            (sortConfig.direction === "asc" ? (
                              <FiChevronUp className="ml-1" />
                            ) : (
                              <FiChevronDown className="ml-1" />
                            ))}
                        </div>
                      </TH>
                      <TH
                        onClick={() => requestSort("IsActive")}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          {t.status}
                          {sortConfig.key === "IsActive" &&
                            (sortConfig.direction === "asc" ? (
                              <FiChevronUp className="ml-1" />
                            ) : (
                              <FiChevronDown className="ml-1" />
                            ))}
                        </div>
                      </TH>
                      <TH
                        onClick={() => requestSort("LastLoginAt")}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          {t.lastLogin}
                          {sortConfig.key === "LastLoginAt" &&
                            (sortConfig.direction === "asc" ? (
                              <FiChevronUp className="ml-1" />
                            ) : (
                              <FiChevronDown className="ml-1" />
                            ))}
                        </div>
                      </TH>
                      <TH
                        onClick={() => requestSort("CompanyName")}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          {t.company}
                          {sortConfig.key === "CompanyName" &&
                            (sortConfig.direction === "asc" ? (
                              <FiChevronUp className="ml-1" />
                            ) : (
                              <FiChevronDown className="ml-1" />
                            ))}
                        </div>
                      </TH>
                    </TR>
                  </thead>
                  <Tbody>
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <TR key={user.Id}>
                          <TD>
                            {user.FirstName} {user.LastName}
                          </TD>
                          <TD>{user.Email}</TD>
                          <TD>
                            <Badge variant={getRoleBadge(user.Role)}>
                              {getRoleText(user.Role)}
                            </Badge>
                          </TD>
                          <TD>
                            <Badge variant={getStatusBadge(user.IsActive)}>
                              {getStatusText(user.IsActive)}
                            </Badge>
                          </TD>
                          <TD>{formatDate(user.LastLoginAt)}</TD>
                          <TD>{user.CompanyName || t.notApplicable}</TD>
                        </TR>
                      ))
                    ) : (
                      <TR>
                        <TD colSpan={6} className="text-center py-8">
                          {t.noUsersFound}
                        </TD>
                      </TR>
                    )}
                  </Tbody>
                </Table>
              </div>

              {filteredUsers.length > usersPerPage && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default ManageUsers;