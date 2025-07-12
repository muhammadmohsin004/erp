import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FiDollarSign,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiCheck,
  FiX,
  FiClock,
  FiDownload,
} from "react-icons/fi";


// Import reusable components
import Container from "../../../components/elements/container/Container";
import Alert from "../../../components/elements/alert/Alert";
import Card from "../../../components/elements/card/Card";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import OutlineButton from "../../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import Badge from "../../../components/elements/badge/Badge";
import Table from "../../../components/elements/table/Table";
import Thead from "../../../components/elements/thead/Thead";
import Tbody from "../../../components/elements/tbody/Tbody";
import TH from "../../../components/elements/th/TH";
import TR from "../../../components/elements/tr/TR";
import TD from "../../../components/elements/td/TD";
import Pagination from "../../../components/elements/pagination/Pagination";
import Modall from "../../../components/elements/modal/Modal";
import Skeleton from "../../../components/elements/skeleton/Skeleton";
import Span from "../../../components/elements/span/Span";
import { paymentTransactionsTranslations } from "../../../translations/PaymentTransactiontranslation";

const PaymentTransactions = () => {
  // Get current language from Redux store
  const { language: currentLanguage } = useSelector((state) => state.language);
  const isArabic = currentLanguage === "ar";
  
  // Get translations based on current language
  const t = paymentTransactionsTranslations[currentLanguage] || paymentTransactionsTranslations.en;

  // State for transactions data
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Status filter options with translations
  const statusOptions = [
    { value: "all", label: t.allStatuses },
    { value: "completed", label: t.completed },
    { value: "pending", label: t.pending },
    { value: "failed", label: t.failed },
    { value: "refunded", label: t.refunded },
  ];

  // Translation function for dynamic content
  const translatePaymentMethod = (method) => {
    switch (method) {
      case "Credit Card":
        return t.creditCard;
      case "PayPal":
        return t.paypal;
      case "Bank Transfer":
        return t.bankTransfer;
      default:
        return method;
    }
  };

  const translatePlan = (plan) => {
    switch (plan) {
      case "Starter":
        return t.starter;
      case "Professional":
        return t.professional;
      case "Enterprise":
        return t.enterprise;
      default:
        return plan;
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "completed":
        return t.completed;
      case "pending":
        return t.pending;
      case "failed":
        return t.failed;
      case "refunded":
        return t.refunded;
      default:
        return status;
    }
  };

  // Mock data
  const mockTransactions = [
    {
      id: "TXN_1001",
      customer: "John Doe",
      email: "john@example.com",
      amount: 29.99,
      date: "2023-05-15",
      paymentMethod: "Credit Card",
      status: "completed",
      plan: "Professional",
      invoiceId: "INV_20230515_001",
    },
    {
      id: "TXN_1002",
      customer: "Jane Smith",
      email: "jane@example.com",
      amount: 99.99,
      date: "2023-05-14",
      paymentMethod: "PayPal",
      status: "completed",
      plan: "Enterprise",
      invoiceId: "INV_20230514_002",
    },
    {
      id: "TXN_1003",
      customer: "Robert Johnson",
      email: "robert@example.com",
      amount: 9.99,
      date: "2023-05-13",
      paymentMethod: "Credit Card",
      status: "failed",
      plan: "Starter",
      invoiceId: "INV_20230513_003",
    },
    {
      id: "TXN_1004",
      customer: "Emily Davis",
      email: "emily@example.com",
      amount: 29.99,
      date: "2023-05-12",
      paymentMethod: "Bank Transfer",
      status: "pending",
      plan: "Professional",
      invoiceId: "INV_20230512_004",
    },
    {
      id: "TXN_1005",
      customer: "Michael Wilson",
      email: "michael@example.com",
      amount: 99.99,
      date: "2023-05-11",
      paymentMethod: "Credit Card",
      status: "refunded",
      plan: "Enterprise",
      invoiceId: "INV_20230511_005",
    },
    {
      id: "TXN_1006",
      customer: "Sarah Brown",
      email: "sarah@example.com",
      amount: 9.99,
      date: "2023-05-10",
      paymentMethod: "PayPal",
      status: "completed",
      plan: "Starter",
      invoiceId: "INV_20230510_006",
    },
    {
      id: "TXN_1007",
      customer: "David Taylor",
      email: "david@example.com",
      amount: 29.99,
      date: "2023-05-09",
      paymentMethod: "Credit Card",
      status: "completed",
      plan: "Professional",
      invoiceId: "INV_20230509_007",
    },
  ];

  // Fetch transactions data (simulated)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setTransactions(mockTransactions);
          setFilteredTransactions(mockTransactions);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(t.fetchError);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [t.fetchError]);

  // Filter transactions based on search and status
  useEffect(() => {
    let results = transactions;

    if (searchTerm) {
      results = results.filter(
        (txn) =>
          txn.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      results = results.filter((txn) => txn.status === statusFilter);
    }

    setFilteredTransactions(results);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, transactions]);

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  // Handle view details
  const handleViewDetails = (transaction) => {
    setCurrentTransaction(transaction);
    setShowDetailsModal(true);
  };

  // Refresh transactions
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setLoading(false);
      setSuccessMessage(t.refreshedSuccessfully);
    }, 800);
  };

  // Export transactions
  const handleExport = () => {
    setSuccessMessage(t.exportStarted);
  };

  // Get badge variant based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FiCheck className="w-3 h-3 mr-1" />;
      case "pending":
        return <FiClock className="w-3 h-3 mr-1" />;
      case "failed":
        return <FiX className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(isArabic ? "ar-SA" : "en-US", options);
  };

  // Format amount
  const formatAmount = (amount) => {
    return new Intl.NumberFormat(isArabic ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4">
          <Skeleton width="100px" height="20px" />
          <Skeleton width="150px" height="20px" />
          <Skeleton width="80px" height="20px" />
          <Skeleton width="100px" height="20px" />
          <Skeleton width="120px" height="20px" />
          <Skeleton width="80px" height="20px" />
          <Skeleton width="100px" height="20px" />
          <Skeleton width="60px" height="20px" />
        </div>
      ))}
    </div>
  );

  // Modal body content
  const renderModalContent = () => {
    if (!currentTransaction) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {t.transactionInformation}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{t.transactionId}:</span>
                <span className="text-gray-600">{currentTransaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.invoiceId}:</span>
                <span className="text-gray-600">
                  {currentTransaction.invoiceId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.date}:</span>
                <span className="text-gray-600">
                  {formatDate(currentTransaction.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.status}:</span>
                <Badge variant={getStatusBadge(currentTransaction.status)}>
                  {getStatusIcon(currentTransaction.status)}
                  {translateStatus(currentTransaction.status)}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">{t.customerInformation}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{t.name}:</span>
                <span className="text-gray-600">
                  {currentTransaction.customer}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t.email}:</span>
                <span className="text-gray-600">
                  {currentTransaction.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">{t.paymentDetails}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{t.amount}:</span>
              <span className="text-gray-600 font-semibold">
                {formatAmount(currentTransaction.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t.paymentMethod}:</span>
              <span className="text-gray-600">
                {translatePaymentMethod(currentTransaction.paymentMethod)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t.plan}:</span>
              <span className="text-gray-600">{translatePlan(currentTransaction.plan)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container className={`py-8 px-4 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiDollarSign className={`text-blue-600 ${isArabic ? 'ml-3' : 'mr-3'}`} />
          {t.pageTitle}
        </h1>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <Alert
          variant="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
          className="mb-6"
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          message={error}
          onClose={() => setError("")}
          className="mb-6"
        />
      )}

      <Card className="mb-6">
        <div className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <InputField
                icon={FiSearch}
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width="w-80"
              />

              <SelectBox
                placeholder={t.filterByStatus}
                value={statusFilter}
                handleChange={setStatusFilter}
                optionList={statusOptions}
                width="w-48"
              />
            </div>

            <div className="flex gap-3">
              <FilledButton
                isIcon={true}
                isIconLeft={true}
                icon={FiRefreshCw}
                buttonText={t.refresh}
                onClick={handleRefresh}
                bgColor="bg-purple-500"
                textColor="text-white"
                disabled={loading}
              />
              <OutlineButton
                isIcon={true}
                isIconLeft={true}
                icon={FiDownload}
                buttonText={t.export}
                onClick={handleExport}
                borderColor="bg-purple"
                borderWidth="border-2"
                textColor="bg-purple-500"
                bgColor="bg-white"
                hover="hover:bg-purple-400"
                rounded="rounded-md"
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
              />
            </div>
          </div>

          {/* Transactions Table */}
          {loading ? (
            renderLoadingSkeleton()
          ) : (
            <div className="overflow-x-auto">
              <Table className="border border-gray-200 rounded-lg overflow-hidden">
                <Thead className="bg-gray-50">
                  <TR>
                    <TH>{t.transactionId}</TH>
                    <TH>{t.customer}</TH>
                    <TH>{t.amount}</TH>
                    <TH>{t.date}</TH>
                    <TH>{t.paymentMethod}</TH>
                    <TH>{t.status}</TH>
                    <TH>{t.plan}</TH>
                    <TH>{t.actions}</TH>
                  </TR>
                </Thead>
                <Tbody>
                  {currentTransactions.length > 0 ? (
                    currentTransactions.map((txn) => (
                      <TR key={txn.id}>
                        <TD>
                          <Span className="text-xs text-gray-500">
                            {txn.id}
                          </Span>
                        </TD>
                        <TD>
                          <div>
                            <div className="font-medium text-gray-900">
                              {txn.customer}
                            </div>
                            <div className="text-sm text-gray-500">
                              {txn.email}
                            </div>
                          </div>
                        </TD>
                        <TD>
                          <span className="font-semibold text-gray-900">
                            {formatAmount(txn.amount)}
                          </span>
                        </TD>
                        <TD>{formatDate(txn.date)}</TD>
                        <TD>{translatePaymentMethod(txn.paymentMethod)}</TD>
                        <TD>
                          <Badge variant={getStatusBadge(txn.status)}>
                            {getStatusIcon(txn.status)}
                            {translateStatus(txn.status)}
                          </Badge>
                        </TD>
                        <TD>{translatePlan(txn.plan)}</TD>
                        <TD>
                          <FilledButton
                            isIcon={true}
                            icon={FiEye}
                            buttonText=""
                            onClick={() => handleViewDetails(txn)}
                            bgColor="bg-blue-600"
                            textColor="text-white"
                            height="h-8"
                            width="w-8"
                            px="px-0"
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
                        {t.noTransactionsFound}
                      </TD>
                    </TR>
                  )}
                </Tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filteredTransactions.length > transactionsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Transaction Details Modal */}
      <Modall
        title={t.transactionDetails}
        modalOpen={showDetailsModal}
        setModalOpen={setShowDetailsModal}
        body={renderModalContent()}
        okText={t.resendReceipt}
        cancelText={t.close}
        okAction={() => {
          setSuccessMessage(t.receiptResent);
          setShowDetailsModal(false);
        }}
        cancelAction={() => setShowDetailsModal(false)}
        width={800}
      />
    </Container>
  );
};

export default PaymentTransactions;