// pages/users/ManageUsers.jsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { GET_ALL_USERS } from "../../services/apiRoutes";
import { get } from "../../services/apiService";
import Table from "../../components/table/Table";
import Tbody from "../../components/table/Tbody";
import TH from "../../components/table/TH";
import TR from "../../components/table/TR";
import TD from "../../components/table/TD";
import FilledButton from "../../components/buttons/FilledButton";
import SearchAndFilters from "../../components/search/SearchAndFilters";
import Badge from "../../components/badge/Badge";
import Dropdown from "../../components/dropdown/Dropdown";
import Alert from "../../components/alert/Alert";
import Pagination from "../../components/pagination/Pagination";
import Container from "../../components/container/Container";
import Card from "../../components/card/Card";

const ManageUsers = () => {
  // State for users data
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const token = localStorage.getItem("authToken");

  // Fetch users
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await get(GET_ALL_USERS, token);
      return res.Items.$values || [];
    },
    onError: (err) => {
      console.error("Query Error", err);
      setError(err.message || "Failed to load users");
    },
    onSuccess: () => {
      setLoading(false);
    },
    refetchOnWindowFocus: false,
  });

  // Filter and sort users
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

  // Available roles and statuses for filters
  const roles = [
    { label: "All Roles", value: "all" },
    { label: "Admin", value: "Admin" },
    { label: "User", value: "User" },
    { label: "Manager", value: "Manager" },
  ];

  const statuses = [
    { label: "All Statuses", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
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
    return isActive ? "Active" : "Inactive";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never logged in";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Export data function
  const exportToCSV = () => {
    const csvData = filteredUsers.map((user) => ({
      Name: `${user.FirstName} ${user.LastName}`,
      Email: user.Email,
      Role: user.Role,
      Status: getStatusText(user.IsActive),
      LastLogin: formatDate(user.LastLoginAt),
      Company: user.CompanyName || "N/A",
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

    setSuccessMessage("Data exported successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Refresh users
  const handleRefresh = () => {
    setLoading(true);
    refetch().then(() => {
      setSuccessMessage("Users refreshed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    });
  };

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiUsers className="mr-2" />
          Manage Users
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
                buttonText="Refresh"
                isIcon
                icon={FiRefreshCw}
                isIconLeft
                bgColor="bg-gray-100"
                textColor="text-gray-700"
                onClick={handleRefresh}
              />
              <FilledButton
                buttonText="Export Data"
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
                placeholder="Search by name or email..."
              />
            </div>
          </div>

          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2">
              <Dropdown
                buttonText={`Role: ${
                  roleFilter === "all" ? "All" : roleFilter
                }`}
                items={roles}
                onSelect={(item) => setRoleFilter(item.value)}
              />
              <Dropdown
                buttonText={`Status: ${
                  statusFilter === "all" ? "All" : statusFilter
                }`}
                items={statuses}
                onSelect={(item) => setStatusFilter(item.value)}
              />
            </div>

            <div className="text-sm text-gray-500">
              Showing {indexOfFirstUser + 1}-
              {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
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
                          Name
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
                          Email
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
                          Role
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
                          Status
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
                          Last Login
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
                          Company
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
                              {user.Role}
                            </Badge>
                          </TD>
                          <TD>
                            <Badge variant={getStatusBadge(user.IsActive)}>
                              {getStatusText(user.IsActive)}
                            </Badge>
                          </TD>
                          <TD>{formatDate(user.LastLoginAt)}</TD>
                          <TD>{user.CompanyName || "N/A"}</TD>
                        </TR>
                      ))
                    ) : (
                      <TR>
                        <TD colSpan={6} className="text-center py-8">
                          No users found matching your criteria
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
