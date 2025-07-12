import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiEye,
  FiUser,
  FiClock,
  FiFlag,
  FiFilter,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import Container from "../../../components/elements/container/Container";
import Alert from "../../../components/elements/alert/Alert";
import Card from "../../../components/elements/card/Card";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import OutlineButton from "../../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import Table from "../../../components/elements/table/Table";
import Thead from "../../../components/elements/thead/Thead";
import Tbody from "../../../components/elements/tbody/Tbody";
import TH from "../../../components/elements/th/TH";
import TR from "../../../components/elements/tr/TR";
import TD from "../../../components/elements/td/TD";
import Modall from "../../../components/elements/modal/Modal";
import Skeleton from "../../../components/elements/skeleton/Skeleton";
import Badge from "../../../components/elements/badge/Badge";
import BodyHeader from "../../../components/elements/bodyHeader/BodyHeader";
import manageTicketsTranslations from "../../../translations/indextranslation"

const ManageTickets = () => {
  // Get current language from Redux
  const { language: currentLanguage } = useSelector((state) => state.language);
  const isArabic = currentLanguage === "ar";
  const t = manageTicketsTranslations[currentLanguage] || manageTicketsTranslations.en;

  // Sample tickets data
  const initialTickets = [
    {
      id: 1,
      title: "Login Issue - Cannot Access Dashboard",
      description: "User unable to login after password reset",
      customer: "John Doe",
      customerEmail: "john@example.com",
      priority: "high",
      status: "open",
      category: "technical",
      assignedTo: "Sarah Wilson",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T14:20:00Z",
      department: "IT Support",
    },
    {
      id: 2,
      title: "Payment Processing Error",
      description: "Transaction failed during checkout process",
      customer: "Jane Smith",
      customerEmail: "jane@example.com",
      priority: "critical",
      status: "in-progress",
      category: "billing",
      assignedTo: "Mike Johnson",
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-15T11:45:00Z",
      department: "Finance",
    },
    {
      id: 3,
      title: "Feature Request - Dark Mode",
      description: "Customer requesting dark mode theme option",
      customer: "Alex Brown",
      customerEmail: "alex@example.com",
      priority: "low",
      status: "pending",
      category: "feature-request",
      assignedTo: "Emma Davis",
      createdAt: "2024-01-13T16:00:00Z",
      updatedAt: "2024-01-14T10:30:00Z",
      department: "Product",
    },
    {
      id: 4,
      title: "Data Export Issue",
      description: "Unable to export customer data to CSV",
      customer: "Robert Wilson",
      customerEmail: "robert@example.com",
      priority: "medium",
      status: "resolved",
      category: "technical",
      assignedTo: "David Lee",
      createdAt: "2024-01-12T14:20:00Z",
      updatedAt: "2024-01-13T09:15:00Z",
      department: "IT Support",
    },
    {
      id: 5,
      title: "Account Suspension Query",
      description: "Customer inquiry about account suspension reasons",
      customer: "Lisa Garcia",
      customerEmail: "lisa@example.com",
      priority: "medium",
      status: "closed",
      category: "account",
      assignedTo: "Tom Anderson",
      createdAt: "2024-01-11T11:45:00Z",
      updatedAt: "2024-01-12T16:30:00Z",
      department: "Customer Service",
    },
  ];

  // State management
  const [tickets, setTickets] = useState(initialTickets);
  const [filteredTickets, setFilteredTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    variant: "success",
    message: "",
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form state
  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    customer: "",
    customerEmail: "",
    priority: "medium",
    status: "open",
    category: "technical",
    assignedTo: "",
    department: "IT Support",
  });

  // Options for dropdowns with translations
  const statusOptions = [
    { value: "all", label: t.allStatus },
    { value: "open", label: t.open },
    { value: "in-progress", label: t.inProgress },
    { value: "pending", label: t.pending },
    { value: "resolved", label: t.resolved },
    { value: "closed", label: t.closed },
  ];

  const priorityOptions = [
    { value: "all", label: t.allPriority },
    { value: "low", label: t.low },
    { value: "medium", label: t.medium },
    { value: "high", label: t.high },
    { value: "critical", label: t.critical },
  ];

  const categoryOptions = [
    { value: "all", label: t.allCategories },
    { value: "technical", label: t.technical },
    { value: "billing", label: t.billing },
    { value: "account", label: t.account },
    { value: "feature-request", label: t.featureRequest },
    { value: "general", label: t.general },
  ];

  const departmentOptions = [
    { value: "all", label: t.allDepartments },
    { value: "IT Support", label: t.itSupport },
    { value: "Customer Service", label: t.customerService },
    { value: "Finance", label: t.finance },
    { value: "Product", label: t.product },
    { value: "Sales", label: t.sales },
  ];

  const assigneeOptions = [
    { value: "Sarah Wilson", label: t.assignees.sarahWilson },
    { value: "Mike Johnson", label: t.assignees.mikeJohnson },
    { value: "Emma Davis", label: t.assignees.emmaDavis },
    { value: "David Lee", label: t.assignees.davidLee },
    { value: "Tom Anderson", label: t.assignees.tomAnderson },
  ];

  // Helper function to get translated status
  const getTranslatedStatus = (status) => {
    const statusMap = {
      open: t.open,
      'in-progress': t.inProgress,
      pending: t.pending,
      resolved: t.resolved,
      closed: t.closed,
    };
    return statusMap[status] || status;
  };

  // Helper function to get translated priority
  const getTranslatedPriority = (priority) => {
    const priorityMap = {
      low: t.low,
      medium: t.medium,
      high: t.high,
      critical: t.critical,
    };
    return priorityMap[priority] || priority;
  };

  // Helper function to get translated category
  const getTranslatedCategory = (category) => {
    const categoryMap = {
      technical: t.technical,
      billing: t.billing,
      account: t.account,
      'feature-request': t.featureRequest,
      general: t.general,
    };
    return categoryMap[category] || category;
  };

  // Helper function to get translated department
  const getTranslatedDepartment = (department) => {
    const departmentMap = {
      'IT Support': t.itSupport,
      'Customer Service': t.customerService,
      'Finance': t.finance,
      'Product': t.product,
      'Sales': t.sales,
    };
    return departmentMap[department] || department;
  };

  // Helper function to get translated assignee
  const getTranslatedAssignee = (assignee) => {
    const assigneeMap = {
      'Sarah Wilson': t.assignees.sarahWilson,
      'Mike Johnson': t.assignees.mikeJohnson,
      'Emma Davis': t.assignees.emmaDavis,
      'David Lee': t.assignees.davidLee,
      'Tom Anderson': t.assignees.tomAnderson,
    };
    return assigneeMap[assignee] || assignee;
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "all" || ticket.category === categoryFilter;
      const matchesDepartment =
        departmentFilter === "all" || ticket.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory &&
        matchesDepartment
      );
    });

    setFilteredTickets(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    departmentFilter,
    tickets,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "info";
      case "medium":
        return "warning";
      case "high":
        return "danger";
      case "critical":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "primary";
      case "in-progress":
        return "warning";
      case "pending":
        return "info";
      case "resolved":
        return "success";
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Event handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTicketForm({
      title: ticket.title,
      description: ticket.description,
      customer: ticket.customer,
      customerEmail: ticket.customerEmail,
      priority: ticket.priority,
      status: ticket.status,
      category: ticket.category,
      assignedTo: ticket.assignedTo,
      department: ticket.department,
    });
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleDeleteTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTickets(tickets.filter((ticket) => ticket.id !== selectedTicket.id));
      setAlert({
        show: true,
        variant: "success",
        message: t.ticketDeleted,
      });
      setIsLoading(false);
      setShowDeleteModal(false);
      setSelectedTicket(null);
    }, 800);
  };

  const handleCreateTicket = () => {
    setTicketForm({
      title: "",
      description: "",
      customer: "",
      customerEmail: "",
      priority: "medium",
      status: "open",
      category: "technical",
      assignedTo: "",
      department: "IT Support",
    });
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const handleFormSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (isEditing) {
        setTickets(
          tickets.map((ticket) =>
            ticket.id === selectedTicket.id
              ? {
                  ...ticket,
                  ...ticketForm,
                  updatedAt: new Date().toISOString(),
                }
              : ticket
          )
        );
        setAlert({
          show: true,
          variant: "success",
          message: t.ticketUpdated,
        });
      } else {
        const newTicket = {
          ...ticketForm,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTickets([newTicket, ...tickets]);
        setAlert({
          show: true,
          variant: "success",
          message: t.ticketCreated,
        });
      }
      setIsLoading(false);
      setShowCreateModal(false);
      setSelectedTicket(null);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm({ ...ticketForm, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setTicketForm({ ...ticketForm, [name]: value });
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setDepartmentFilter("all");
    setSearchTerm("");
  };

  const exportTickets = () => {
    setAlert({
      show: true,
      variant: "info",
      message: t.exportMessage,
    });
  };

  return (
    <Container className={`py-6 px-4 max-w-7xl ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Alert */}
      {alert.show && (
        <Alert
          variant={alert.variant}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
          className="mb-4"
        />
      )}

      {/* Header */}
      <BodyHeader
        heading={t.pageTitle}
        subHeading={t.pageSubtitle}
      />

      {/* Stats Cards */}
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 mt-6">
        <Card className="p-4 bg-blue-50 border-l-4 border-blue-500">
          <Container className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tickets.filter((t) => t.status === "open").length}
            </div>
            <div className="text-sm text-blue-700">{t.open}</div>
          </Container>
        </Card>
        <Card className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
          <Container className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tickets.filter((t) => t.status === "in-progress").length}
            </div>
            <div className="text-sm text-yellow-700">{t.inProgress}</div>
          </Container>
        </Card>
        <Card className="p-4 bg-purple-50 border-l-4 border-purple-500">
          <Container className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {tickets.filter((t) => t.status === "pending").length}
            </div>
            <div className="text-sm text-purple-700">{t.pending}</div>
          </Container>
        </Card>
        <Card className="p-4 bg-green-50 border-l-4 border-green-500">
          <Container className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter((t) => t.status === "resolved").length}
            </div>
            <div className="text-sm text-green-700">{t.resolved}</div>
          </Container>
        </Card>
        <Card className="p-4 bg-gray-50 border-l-4 border-gray-500">
          <Container className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {tickets.filter((t) => t.status === "closed").length}
            </div>
            <div className="text-sm text-gray-700">{t.closed}</div>
          </Container>
        </Card>
      </Container>

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <Container className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <Container className="flex-1">
            <Container className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <FiSearch className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
            </Container>
          </Container>

          {/* Filters */}
          <Container className="flex flex-wrap gap-2">
            <SelectBox
              placeholder={t.allStatus}
              optionList={statusOptions}
              value={statusFilter}
              handleChange={setStatusFilter}
              width="w-32"
            />
            <SelectBox
              placeholder={t.allPriority}
              optionList={priorityOptions}
              value={priorityFilter}
              handleChange={setPriorityFilter}
              width="w-32"
            />
            <SelectBox
              placeholder={t.allCategories}
              optionList={categoryOptions}
              value={categoryFilter}
              handleChange={setCategoryFilter}
              width="w-40"
            />
            <SelectBox
              placeholder={t.allDepartments}
              optionList={departmentOptions}
              value={departmentFilter}
              handleChange={setDepartmentFilter}
              width="w-40"
            />
            <OutlineButton
              isIcon={true}
              icon={FiRefreshCw}
              borderColor="border-gray-300"
              borderWidth="border"
              textColor="text-gray-600"
              bgColor="bg-white"
              rounded="rounded-md"
              height="h-10"
              width="w-10"
              hover="hover:bg-gray-50"
              onClick={resetFilters}
              px="px-0"
            />
          </Container>
        </Container>
      </Card>

      {/* Action Buttons */}
      <Container className="flex justify-between items-center mb-6">
        <Container className="flex gap-2">
          <FilledButton
            isIcon={true}
            icon={FiPlus}
            isIconLeft={true}
            buttonText={t.createTicket}
            onClick={handleCreateTicket}
            bgColor="bg-blue-600"
            textColor="text-white"
            height="h-10"
            px="px-4"
          />
          <OutlineButton
            isIcon={true}
            icon={FiDownload}
            isIconLeft={true}
            buttonText={t.export}
            borderColor="border-green-500"
            borderWidth="border"
            textColor="text-green-600"
            bgColor="bg-white"
            rounded="rounded-md"
            height="h-10"
            hover="hover:bg-green-50"
            onClick={exportTickets}
            px="px-4"
          />
        </Container>
        <Container className="text-sm text-gray-600">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of{" "}
          {filteredTickets.length} tickets
        </Container>
      </Container>

      {/* Tickets Table */}
      <Card className="shadow-sm">
        <Container className="overflow-x-auto">
          <Table>
            <Thead className="bg-gray-50">
              <TR>
                <TH>ID</TH>
                <TH>Title</TH>
                <TH>Customer</TH>
                <TH>Priority</TH>
                <TH>Status</TH>
                <TH>Category</TH>
                <TH>Assigned To</TH>
                <TH>Department</TH>
                <TH>Created</TH>
                <TH>Actions</TH>
              </TR>
            </Thead>
            <Tbody>
              {isLoading && paginatedTickets.length === 0 ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TR key={index}>
                    <TD>
                      <Skeleton height="20px" width="40px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="200px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="120px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="80px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="80px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="100px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="100px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="100px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="100px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="120px" />
                    </TD>
                  </TR>
                ))
              ) : paginatedTickets.length > 0 ? (
                paginatedTickets.map((ticket) => (
                  <TR key={ticket.id}>
                    <TD className="font-mono text-sm">#{ticket.id}</TD>
                    <TD className="font-medium text-gray-900 max-w-xs">
                      <div className="truncate" title={ticket.title}>
                        {ticket.title}
                      </div>
                    </TD>
                    <TD>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {ticket.customer}
                        </div>
                        <div className="text-gray-500">
                          {ticket.customerEmail}
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        <FiFlag className="mr-1" />
                        {ticket.priority.charAt(0).toUpperCase() +
                          ticket.priority.slice(1)}
                      </Badge>
                    </TD>
                    <TD>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status
                          .replace("-", " ")
                          .charAt(0)
                          .toUpperCase() +
                          ticket.status.replace("-", " ").slice(1)}
                      </Badge>
                    </TD>
                    <TD className="text-sm text-gray-600 capitalize">
                      {ticket.category.replace("-", " ")}
                    </TD>
                    <TD className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <FiUser className="mr-1 text-gray-400" />
                        {ticket.assignedTo}
                      </div>
                    </TD>
                    <TD className="text-sm text-gray-600">
                      {ticket.department}
                    </TD>
                    <TD className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiClock className="mr-1 text-gray-400" />
                        {formatDate(ticket.createdAt)}
                      </div>
                    </TD>
                    <TD>
                      <Container className="flex gap-1">
                        <OutlineButton
                          isIcon={true}
                          icon={FiEye}
                          borderColor="border-blue-500"
                          borderWidth="border"
                          textColor="text-blue-500"
                          bgColor="bg-white"
                          rounded="rounded-md"
                          height="h-8"
                          width="w-8"
                          fontSize="text-sm"
                          hover="hover:bg-blue-50"
                          onClick={() => handleViewTicket(ticket)}
                          px="px-0"
                        />
                        <OutlineButton
                          isIcon={true}
                          icon={FiEdit2}
                          borderColor="border-green-500"
                          borderWidth="border"
                          textColor="text-green-500"
                          bgColor="bg-white"
                          rounded="rounded-md"
                          height="h-8"
                          width="w-8"
                          fontSize="text-sm"
                          hover="hover:bg-green-50"
                          onClick={() => handleEditTicket(ticket)}
                          px="px-0"
                        />
                        <OutlineButton
                          isIcon={true}
                          icon={FiTrash2}
                          borderColor="border-red-500"
                          borderWidth="border"
                          textColor="text-red-500"
                          bgColor="bg-white"
                          rounded="rounded-md"
                          height="h-8"
                          width="w-8"
                          fontSize="text-sm"
                          hover="hover:bg-red-50"
                          onClick={() => handleDeleteTicket(ticket)}
                          px="px-0"
                        />
                      </Container>
                    </TD>
                  </TR>
                ))
              ) : (
                <TR>
                  <TD colSpan={10} className="text-center py-8 text-gray-500">
                    No tickets found matching your criteria.
                  </TD>
                </TR>
              )}
            </Tbody>
          </Table>
        </Container>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Container className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Container>
      )}

      {/* View Ticket Modal */}
      <Modall
        title={`Ticket #${selectedTicket?.id} - ${selectedTicket?.title}`}
        modalOpen={showTicketModal}
        setModalOpen={setShowTicketModal}
        okText="Close"
        cancelText=""
        okAction={() => setShowTicketModal(false)}
        cancelAction={() => setShowTicketModal(false)}
        width={800}
        body={
          selectedTicket && (
            <Container className="space-y-4">
              <Container className="grid grid-cols-2 gap-4">
                <Container>
                  <strong>Customer:</strong> {selectedTicket.customer}
                </Container>
                <Container>
                  <strong>Email:</strong> {selectedTicket.customerEmail}
                </Container>
                <Container>
                  <strong>Priority:</strong>
                  <Badge
                    variant={getPriorityColor(selectedTicket.priority)}
                    className="ml-2"
                  >
                    {selectedTicket.priority.charAt(0).toUpperCase() +
                      selectedTicket.priority.slice(1)}
                  </Badge>
                </Container>
                <Container>
                  <strong>Status:</strong>
                  <Badge
                    variant={getStatusColor(selectedTicket.status)}
                    className="ml-2"
                  >
                    {selectedTicket.status
                      .replace("-", " ")
                      .charAt(0)
                      .toUpperCase() +
                      selectedTicket.status.replace("-", " ").slice(1)}
                  </Badge>
                </Container>
                <Container>
                  <strong>Category:</strong>{" "}
                  {selectedTicket.category.replace("-", " ")}
                </Container>
                <Container>
                  <strong>Department:</strong> {selectedTicket.department}
                </Container>
                <Container>
                  <strong>Assigned To:</strong> {selectedTicket.assignedTo}
                </Container>
                <Container>
                  <strong>Created:</strong>{" "}
                  {formatDate(selectedTicket.createdAt)}
                </Container>
              </Container>
              <Container>
                <strong>Description:</strong>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  {selectedTicket.description}
                </div>
              </Container>
            </Container>
          )
        }
      />

      {/* Create/Edit Ticket Modal */}
      <Modall
        title={isEditing ? "Edit Ticket" : "Create New Ticket"}
        modalOpen={showCreateModal}
        setModalOpen={setShowCreateModal}
        okText={isEditing ? "Update Ticket" : "Create Ticket"}
        cancelText="Cancel"
        okAction={handleFormSubmit}
        cancelAction={() => setShowCreateModal(false)}
        okButtonDisabled={isLoading}
        width={700}
        body={
          <Container className="space-y-4">
            <InputField
              label="Title"
              name="title"
              placeholder="Enter ticket title"
              type="text"
              value={ticketForm.title}
              onChange={handleInputChange}
              width="w-full"
              marginBottom="mb-4"
            />

            <Container className="grid grid-cols-2 gap-4">
              <InputField
                label="Customer Name"
                name="customer"
                placeholder="Enter customer name"
                type="text"
                value={ticketForm.customer}
                onChange={handleInputChange}
                width="w-full"
                marginBottom="mb-4"
              />
              <InputField
                label="Customer Email"
                name="customerEmail"
                placeholder="Enter customer email"
                type="email"
                value={ticketForm.customerEmail}
                onChange={handleInputChange}
                width="w-full"
                marginBottom="mb-4"
              />
            </Container>

            <Container className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={ticketForm.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter ticket description"
              />
            </Container>

            <Container className="grid grid-cols-2 gap-4">
              <SelectBox
                label="Priority"
                placeholder="Select priority"
                optionList={priorityOptions.filter((p) => p.value !== "all")}
                value={ticketForm.priority}
                handleChange={(value) => handleSelectChange("priority", value)}
                width="w-full"
                marginBottom="mb-4"
              />
              <SelectBox
                label="Status"
                placeholder="Select status"
                optionList={statusOptions.filter((s) => s.value !== "all")}
                value={ticketForm.status}
                handleChange={(value) => handleSelectChange("status", value)}
                width="w-full"
                marginBottom="mb-4"
              />
            </Container>

            <Container className="grid grid-cols-2 gap-4">
              <SelectBox
                label="Category"
                placeholder="Select category"
                optionList={categoryOptions.filter((c) => c.value !== "all")}
                value={ticketForm.category}
                handleChange={(value) => handleSelectChange("category", value)}
                width="w-full"
                marginBottom="mb-4"
              />
              <SelectBox
                label="Department"
                placeholder="Select department"
                optionList={departmentOptions.filter((d) => d.value !== "all")}
                value={ticketForm.department}
                handleChange={(value) =>
                  handleSelectChange("department", value)
                }
                width="w-full"
                marginBottom="mb-4"
              />
            </Container>

            <SelectBox
              label="Assigned To"
              placeholder="Select assignee"
              optionList={assigneeOptions}
              value={ticketForm.assignedTo}
              handleChange={(value) => handleSelectChange("assignedTo", value)}
              width="w-full"
              marginBottom="mb-4"
            />
          </Container>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modall
        title="Confirm Deletion"
        modalOpen={showDeleteModal}
        setModalOpen={setShowDeleteModal}
        okText="Delete"
        cancelText="Cancel"
        okAction={confirmDelete}
        cancelAction={() => setShowDeleteModal(false)}
        okButtonDisabled={isLoading}
        okButtonVariant="danger"
        width={500}
        body={
          selectedTicket && (
            <Container className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete ticket{" "}
                <strong>#{selectedTicket.id}</strong> - {selectedTicket.title}?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. All data related to this ticket
                will be permanently removed.
              </p>
            </Container>
          )
        }
      />
    </Container>
  );
};

export default ManageTickets;
