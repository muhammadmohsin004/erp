import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiCheck,
  FiX,
  FiClock,
  FiArrowLeft,
  FiArrowRight,
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
import Dropdown from "../../../components/elements/dropdown/Dropdown";
import Skeleton from "../../../components/elements/skeleton/Skeleton";
import Badge from "../../../components/elements/badge/Badge";

const Refunds = () => {
  // State for refunds data
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [refundsPerPage] = useState(8);

  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentRefund, setCurrentRefund] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processNotes, setProcessNotes] = useState("");

  // Fetch refunds data (simulated)
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const mockRefunds = [
            {
              id: "REF-2023-001",
              transactionId: "TXN-1001",
              customer: "John Doe",
              email: "john@example.com",
              amount: 29.99,
              dateRequested: "2023-06-15",
              dateProcessed: "2023-06-16",
              status: "completed",
              reason: "Duplicate charge",
              paymentMethod: "Credit Card",
              originalInvoice: "INV-2023-001",
            },
            {
              id: "REF-2023-002",
              transactionId: "TXN-1002",
              customer: "Jane Smith",
              email: "jane@example.com",
              amount: 99.99,
              dateRequested: "2023-06-14",
              dateProcessed: "",
              status: "pending",
              reason: "Service not as described",
              paymentMethod: "PayPal",
              originalInvoice: "INV-2023-002",
            },
            {
              id: "REF-2023-003",
              transactionId: "TXN-1003",
              customer: "Robert Johnson",
              email: "robert@example.com",
              amount: 9.99,
              dateRequested: "2023-06-13",
              dateProcessed: "",
              status: "rejected",
              reason: "Change of mind",
              paymentMethod: "Credit Card",
              originalInvoice: "INV-2023-003",
            },
            {
              id: "REF-2023-004",
              transactionId: "TXN-1004",
              customer: "Emily Davis",
              email: "emily@example.com",
              amount: 29.99,
              dateRequested: "2023-06-12",
              dateProcessed: "2023-06-13",
              status: "completed",
              reason: "Cancelled subscription",
              paymentMethod: "Bank Transfer",
              originalInvoice: "INV-2023-004",
            },
            {
              id: "REF-2023-005",
              transactionId: "TXN-1005",
              customer: "Michael Wilson",
              email: "michael@example.com",
              amount: 99.99,
              dateRequested: "2023-06-11",
              dateProcessed: "",
              status: "pending",
              reason: "Technical issues",
              paymentMethod: "Credit Card",
              originalInvoice: "INV-2023-005",
            },
            {
              id: "REF-2023-006",
              transactionId: "TXN-1006",
              customer: "Sarah Brown",
              email: "sarah@example.com",
              amount: 9.99,
              dateRequested: "2023-06-10",
              dateProcessed: "2023-06-11",
              status: "completed",
              reason: "Duplicate charge",
              paymentMethod: "PayPal",
              originalInvoice: "INV-2023-006",
            },
            {
              id: "REF-2023-007",
              transactionId: "TXN-1007",
              customer: "David Taylor",
              email: "david@example.com",
              amount: 29.99,
              dateRequested: "2023-06-09",
              dateProcessed: "",
              status: "pending",
              reason: "Billing error",
              paymentMethod: "Credit Card",
              originalInvoice: "INV-2023-007",
            },
          ];
          setRefunds(mockRefunds);
          setFilteredRefunds(mockRefunds);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch refunds. Please try again later.");
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  // Filter refunds based on search and status
  useEffect(() => {
    let results = refunds;

    if (searchTerm) {
      results = results.filter(
        (refund) =>
          refund.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          refund.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          refund.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      results = results.filter((refund) => refund.status === statusFilter);
    }

    setFilteredRefunds(results);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, refunds]);

  // Pagination logic
  const indexOfLastRefund = currentPage * refundsPerPage;
  const indexOfFirstRefund = indexOfLastRefund - refundsPerPage;
  const currentRefunds = filteredRefunds.slice(
    indexOfFirstRefund,
    indexOfLastRefund
  );
  const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);

  // Handle view details
  const handleViewDetails = (refund) => {
    setCurrentRefund(refund);
    setShowDetailsModal(true);
  };

  // Handle process refund
  const handleProcessRefund = (refund) => {
    setCurrentRefund(refund);
    setShowProcessModal(true);
  };

  // Confirm process refund
  const confirmProcessRefund = () => {
    setLoading(true);
    setTimeout(() => {
      setRefunds(
        refunds.map((r) =>
          r.id === currentRefund.id
            ? {
                ...r,
                status: "completed",
                dateProcessed: new Date().toISOString().split("T")[0],
              }
            : r
        )
      );
      setShowProcessModal(false);
      setSuccessMessage(`Refund ${currentRefund.id} processed successfully!`);
      setProcessNotes("");
      setLoading(false);
    }, 1000);
  };

  // Handle reject refund
  const handleRejectRefund = (refund) => {
    setLoading(true);
    setTimeout(() => {
      setRefunds(
        refunds.map((r) =>
          r.id === refund.id ? { ...r, status: "rejected" } : r
        )
      );
      setSuccessMessage(`Refund ${refund.id} rejected.`);
      setLoading(false);
    }, 1000);
  };

  // Refresh refunds
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Refunds refreshed successfully!");
    }, 800);
  };

  // Get badge variant based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format amount
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Status filter options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];

  // Dropdown actions
  const getDropdownActions = (refund) => {
    const actions = [
      { label: "View Details", onClick: () => handleViewDetails(refund) },
    ];

    if (refund.status === "pending") {
      actions.push(
        { label: "Process Refund", onClick: () => handleProcessRefund(refund) },
        { label: "Reject Request", onClick: () => handleRejectRefund(refund) }
      );
    }

    return actions;
  };

  return (
    <Container className="py-4 max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FiArrowLeft className="mr-2" />
          Refund Management
        </h2>
      </div>

      {successMessage && (
        <Alert
          variant="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
          dismissible
          className="mb-4"
        />
      )}

      {error && (
        <Alert
          variant="danger"
          message={error}
          onClose={() => setError("")}
          dismissible
          className="mb-4"
        />
      )}

      <Card className="mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <InputField
                type="text"
                placeholder="Search refunds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={FiSearch}
                width="w-full sm:w-64"
              />

              <SelectBox
                placeholder="Filter by status"
                value={statusFilter}
                handleChange={setStatusFilter}
                optionList={statusOptions}
                width="w-full sm:w-48"
              />
            </div>

            <OutlineButton
              buttonText="Refresh"
              isIcon={true}
              icon={FiRefreshCw}
              isIconLeft={true}
              onClick={handleRefresh}
              borderColor="border-gray-300"
              borderWidth="border"
              rounded="rounded-md"
              bgColor="bg-white"
              textColor="text-gray-700"
              height="h-10"
              fontWeight="font-medium"
              fontSize="text-sm"
              px="px-4"
              hover="hover:bg-gray-50"
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <Skeleton width="100%" height="40px" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <Thead className="bg-gray-50">
                    <TR>
                      <TH>Refund ID</TH>
                      <TH>Customer</TH>
                      <TH>Amount</TH>
                      <TH>Request Date</TH>
                      <TH>Processed Date</TH>
                      <TH>Status</TH>
                      <TH>Reason</TH>
                      <TH>Actions</TH>
                    </TR>
                  </Thead>
                  <Tbody>
                    {currentRefunds.length > 0 ? (
                      currentRefunds.map((refund) => (
                        <TR key={refund.id}>
                          <TD>
                            <div className="text-sm text-gray-900">
                              {refund.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              TXN: {refund.transactionId}
                            </div>
                          </TD>
                          <TD>
                            <div className="text-sm text-gray-900">
                              {refund.customer}
                            </div>
                            <div className="text-sm text-gray-500">
                              {refund.email}
                            </div>
                          </TD>
                          <TD className="text-sm text-gray-900">
                            {formatAmount(refund.amount)}
                          </TD>
                          <TD className="text-sm text-gray-500">
                            {formatDate(refund.dateRequested)}
                          </TD>
                          <TD className="text-sm text-gray-500">
                            {formatDate(refund.dateProcessed)}
                          </TD>
                          <TD>
                            <Badge
                              variant={getStatusBadge(refund.status)}
                              className="inline-flex items-center"
                            >
                              {refund.status === "pending" && (
                                <FiClock className="mr-1 h-3 w-3" />
                              )}
                              {refund.status === "completed" && (
                                <FiCheck className="mr-1 h-3 w-3" />
                              )}
                              {refund.status === "rejected" && (
                                <FiX className="mr-1 h-3 w-3" />
                              )}
                              {refund.status}
                            </Badge>
                          </TD>
                          <TD className="text-sm text-gray-500">
                            {refund.reason}
                          </TD>
                          <TD>
                            <Dropdown
                              buttonText="Actions"
                              items={getDropdownActions(refund)}
                              onSelect={(item) => item.onClick()}
                              className="relative"
                            />
                          </TD>
                        </TR>
                      ))
                    ) : (
                      <TR>
                        <TD
                          colSpan={8}
                          className="text-center py-8 text-gray-500"
                        >
                          No refunds found
                        </TD>
                      </TR>
                    )}
                  </Tbody>
                </Table>
              </div>

              {filteredRefunds.length > refundsPerPage && (
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

      {/* Refund Details Modal */}
      <Modall
        title={`Refund Details - ${currentRefund?.id}`}
        modalOpen={showDetailsModal}
        setModalOpen={setShowDetailsModal}
        okText="Close"
        cancelText=""
        okAction={() => setShowDetailsModal(false)}
        cancelAction={() => setShowDetailsModal(false)}
        width={800}
        body={
          currentRefund && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Refund Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Refund ID:
                      </span>
                      <span className="text-sm text-gray-900">
                        {currentRefund.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Transaction ID:
                      </span>
                      <span className="text-sm text-gray-900">
                        {currentRefund.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Invoice:
                      </span>
                      <span className="text-sm text-gray-900">
                        {currentRefund.originalInvoice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Request Date:
                      </span>
                      <span className="text-sm text-gray-900">
                        {formatDate(currentRefund.dateRequested)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Processed Date:
                      </span>
                      <span className="text-sm text-gray-900">
                        {formatDate(currentRefund.dateProcessed) || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Status:
                      </span>
                      <Badge variant={getStatusBadge(currentRefund.status)}>
                        {currentRefund.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Name:
                      </span>
                      <span className="text-sm text-gray-900">
                        {currentRefund.customer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Email:
                      </span>
                      <span className="text-sm text-gray-900">
                        {currentRefund.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Payment Method:
                      </span>
                      <span className="text-sm text-gray-900">
                        {currentRefund.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Amount:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {formatAmount(currentRefund.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Refund Reason
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {currentRefund.reason}
                  </p>
                </div>
              </div>

              {currentRefund.status === "pending" && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <OutlineButton
                    buttonText="Reject"
                    isIcon={true}
                    icon={FiX}
                    isIconLeft={true}
                    onClick={() => {
                      handleRejectRefund(currentRefund);
                      setShowDetailsModal(false);
                    }}
                    borderColor="border-red-300"
                    borderWidth="border"
                    rounded="rounded-md"
                    bgColor="bg-white"
                    textColor="text-red-600"
                    height="h-10"
                    fontWeight="font-medium"
                    fontSize="text-sm"
                    px="px-4"
                    hover="hover:bg-red-50"
                  />
                  <FilledButton
                    buttonText="Process Refund"
                    isIcon={true}
                    icon={FiCheck}
                    isIconLeft={true}
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleProcessRefund(currentRefund);
                    }}
                    bgColor="bg-green-600"
                    textColor="text-white"
                    height="h-10"
                    fontWeight="font-medium"
                    fontSize="text-sm"
                    px="px-4"
                  />
                </div>
              )}
            </div>
          )
        }
      />

      {/* Process Refund Modal */}
      <Modall
        title={`Process Refund - ${currentRefund?.id}`}
        modalOpen={showProcessModal}
        setModalOpen={setShowProcessModal}
        okText={loading ? "Processing..." : "Confirm Refund"}
        cancelText="Cancel"
        okAction={confirmProcessRefund}
        cancelAction={() => setShowProcessModal(false)}
        okButtonDisabled={loading}
        width={600}
        body={
          currentRefund && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  You are about to process a refund of{" "}
                  <strong>{formatAmount(currentRefund.amount)}</strong> to{" "}
                  <strong>{currentRefund.customer}</strong>.
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Payment method: {currentRefund.paymentMethod}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any notes about this refund..."
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                />
              </div>

              <Alert
                variant="warning"
                message="This action cannot be undone. The refund will be processed immediately."
                dismissible={false}
              />
            </div>
          )
        }
      />
    </Container>
  );
};

export default Refunds;
