import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  FileText,
  Calendar,
  DollarSign,
  Users,
} from "lucide-react";
import BodyHeader from "../../../components/elements/bodyHeader/BodyHeader";
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
import Badge from "../../../components/elements/badge/Badge";
import Container from "../../../components/elements/container/Container";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import translations from "../../../translations/ManageInvoicestranslation";

// Dummy Components (since we don't have the actual ones)
const Span = ({ children, className = "", onClick }) => (
  <span className={className} onClick={onClick}>
    {children}
  </span>
);

const H2 = ({ children, className = "" }) => (
  <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>
);

const H5 = ({ children, className = "" }) => (
  <h5 className={`text-lg ${className}`}>{children}</h5>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center space-x-2">
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => onPageChange(i + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === i + 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
);

const ManageInvoices = () => {
  // Get current language from Redux store
  const { language: currentLanguage } = useSelector((state) => state.language);
  const t = translations[currentLanguage] || translations.en;
  const isArabic = currentLanguage === "ar";

  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deleteInvoice, setDeleteInvoice] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // Form state
  const [formData, setFormData] = useState({
    invoiceNo: "",
    client: "",
    date: "",
    dueDate: "",
    amount: "",
    status: "pending",
    description: "",
  });

  // Sample data
  useEffect(() => {
    const sampleInvoices = [
      {
        id: 1,
        invoiceNo: "INV-2024-001",
        client: "Acme Corporation",
        date: "2024-01-15",
        dueDate: "2024-02-15",
        amount: 2500.0,
        status: "paid",
        description: "Website development services",
      },
      {
        id: 2,
        invoiceNo: "INV-2024-002",
        client: "Tech Solutions Inc",
        date: "2024-01-20",
        dueDate: "2024-02-20",
        amount: 1800.5,
        status: "pending",
        description: "Mobile app development",
      },
      {
        id: 3,
        invoiceNo: "INV-2024-003",
        client: "Global Enterprises",
        date: "2024-01-25",
        dueDate: "2024-02-25",
        amount: 3200.75,
        status: "overdue",
        description: "E-commerce platform setup",
      },
      {
        id: 4,
        invoiceNo: "INV-2024-004",
        client: "StartUp Hub",
        date: "2024-02-01",
        dueDate: "2024-03-01",
        amount: 1500.0,
        status: "draft",
        description: "Brand identity design",
      },
      {
        id: 5,
        invoiceNo: "INV-2024-005",
        client: "Digital Marketing Co",
        date: "2024-02-05",
        dueDate: "2024-03-05",
        amount: 2800.25,
        status: "paid",
        description: "SEO optimization services",
      },
    ];
    setInvoices(sampleInvoices);
    setFilteredInvoices(sampleInvoices);
  }, []);

  // Filter invoices based on search and filters
  useEffect(() => {
    let filtered = invoices;

    // Search filter
    if (searchValue) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNo.toLowerCase().includes(searchValue.toLowerCase()) ||
          invoice.client.toLowerCase().includes(searchValue.toLowerCase()) ||
          invoice.description.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (invoice) => invoice.status === selectedStatus
      );
    }

    // Date range filter
    if (selectedDateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (selectedDateRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }

      if (selectedDateRange !== "all") {
        filtered = filtered.filter(
          (invoice) => new Date(invoice.date) >= filterDate
        );
      }
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchValue, selectedStatus, selectedDateRange, invoices]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Status options
  const statusOptions = [
    { value: "all", label: t.allStatus },
    { value: "draft", label: t.draft },
    { value: "pending", label: t.pending },
    { value: "paid", label: t.paid },
    { value: "overdue", label: t.overdue },
  ];

  // Date range options
  const dateRangeOptions = [
    { value: "all", label: t.allTime },
    { value: "week", label: t.lastWeek },
    { value: "month", label: t.lastMonth },
    { value: "quarter", label: t.lastQuarter },
  ];

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.invoiceNo || !formData.client || !formData.amount) {
      showAlertMessage(t.fillRequiredFields, "danger");
      return;
    }

    if (editingInvoice) {
      // Update existing invoice
      const updatedInvoices = invoices.map((inv) =>
        inv.id === editingInvoice.id
          ? { ...formData, id: editingInvoice.id }
          : inv
      );
      setInvoices(updatedInvoices);
      showAlertMessage(t.invoiceUpdatedSuccess, "success");
    } else {
      // Add new invoice
      const newInvoice = {
        ...formData,
        id: Date.now(),
        amount: parseFloat(formData.amount),
      };
      setInvoices([...invoices, newInvoice]);
      showAlertMessage(t.invoiceCreatedSuccess, "success");
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      invoiceNo: "",
      client: "",
      date: "",
      dueDate: "",
      amount: "",
      status: "pending",
      description: "",
    });
    setEditingInvoice(null);
    setShowModal(false);
  };

  // Handle edit
  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoiceNo: invoice.invoiceNo,
      client: invoice.client,
      date: invoice.date,
      dueDate: invoice.dueDate,
      amount: invoice.amount.toString(),
      status: invoice.status,
      description: invoice.description,
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (deleteInvoice) {
      const updatedInvoices = invoices.filter(
        (inv) => inv.id !== deleteInvoice.id
      );
      setInvoices(updatedInvoices);
      setDeleteInvoice(null);
      showAlertMessage(t.invoiceDeletedSuccess, "success");
    }
  };

  // Show alert message
  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Get badge variant based on status
  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      pending: "warning",
      paid: "success",
      overdue: "danger",
    };
    return variants[status] || "secondary";
  };

  // Get translated status
  const getTranslatedStatus = (status) => {
    const statusMap = {
      draft: t.draft,
      pending: t.pending,
      paid: t.paid,
      overdue: t.overdue,
    };
    return statusMap[status] || status;
  };

  // Calculate statistics
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Export dropdown items
  const exportItems = [
    { label: t.exportCSV, value: "csv" },
    { label: t.exportPDF, value: "pdf" },
    { label: t.exportExcel, value: "excel" },
  ];

  const handleExport = (item) => {
    showAlertMessage(
      `${t.exportingInvoices} ${item.value.toUpperCase()}...`,
      "info"
    );
  };

  return (
    <Container className={`max-w-7xl mx-auto py-8 px-4 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="mb-8">
        <BodyHeader
          heading={t.manageInvoices}
          subHeading={t.createEditTrackInvoices}
        />
      </div>

      {/* Alert */}
      {showAlert && (
        <Alert
          variant={alertType}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          className="mb-6"
        />
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.totalAmount}</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.paid}</p>
              <p className="text-2xl font-bold text-green-600">
                ${paidAmount.toFixed(2)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.pending}</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${pendingAmount.toFixed(2)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.overdue}</p>
              <p className="text-2xl font-bold text-red-600">
                ${overdueAmount.toFixed(2)}
              </p>
            </div>
            <Users className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <div className="p-6">
          {/* Header Actions */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t.invoiceList}
              </h3>
              <p className="text-sm text-gray-600">
                {t.manageInvoicesTrackPayments}
              </p>
            </div>
            <div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <Dropdown
                buttonText={t.export}
                icon={Download}
                items={exportItems}
                onSelect={handleExport}
                buttonClassName="bg-gray-100 hover:bg-gray-200"
              />
              <FilledButton
                isIcon={true}
                icon={Plus}
                isIconLeft={!isArabic}
                buttonText={t.createInvoice}
                bgColor="bg-blue-600"
                textColor="text-white"
                onClick={() => setShowModal(true)}
              />
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <SearchAndFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder={t.searchInvoices}
            />

            <div className={`flex flex-col sm:flex-row gap-4 mt-4 px-6 ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
              <SelectBox
                placeholder={t.filterByStatus}
                value={selectedStatus}
                handleChange={setSelectedStatus}
                optionList={statusOptions}
                width="w-48"
              />
              <SelectBox
                placeholder={t.filterByDate}
                value={selectedDateRange}
                handleChange={setSelectedDateRange}
                optionList={dateRangeOptions}
                width="w-48"
              />
            </div>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <Table>
              <Thead className="bg-gray-50">
                <TR>
                  <TH>{t.invoiceNo}</TH>
                  <TH>{t.client}</TH>
                  <TH>{t.date}</TH>
                  <TH>{t.dueDate}</TH>
                  <TH>{t.amount}</TH>
                  <TH>{t.status}</TH>
                  <TH>{t.actions}</TH>
                </TR>
              </Thead>
              <Tbody>
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice) => (
                    <TR key={invoice.id}>
                      <TD className="font-medium text-gray-900">
                        {invoice.invoiceNo}
                      </TD>
                      <TD>{invoice.client}</TD>
                      <TD>{new Date(invoice.date).toLocaleDateString()}</TD>
                      <TD>{new Date(invoice.dueDate).toLocaleDateString()}</TD>
                      <TD className="font-medium">
                        ${invoice.amount.toFixed(2)}
                      </TD>
                      <TD>
                        <Badge variant={getStatusBadge(invoice.status)}>
                          {getTranslatedStatus(invoice.status)}
                        </Badge>
                      </TD>
                      <TD>
                        <div className={`flex gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                          <OutlineButton
                            isIcon={true}
                            icon={Edit}
                            buttonText=""
                            borderColor="border-blue-300"
                            borderWidth="border"
                            rounded="rounded-md"
                            bgColor="bg-white"
                            textColor="text-blue-600"
                            height="h-8"
                            width="w-8"
                            px="px-2"
                            hover="hover:bg-blue-50"
                            onClick={() => handleEdit(invoice)}
                          />
                          <OutlineButton
                            isIcon={true}
                            icon={Trash2}
                            buttonText=""
                            borderColor="border-red-300"
                            borderWidth="border"
                            rounded="rounded-md"
                            bgColor="bg-white"
                            textColor="text-red-600"
                            height="h-8"
                            width="w-8"
                            px="px-2"
                            hover="hover:bg-red-50"
                            onClick={() => setDeleteInvoice(invoice)}
                          />
                        </div>
                      </TD>
                    </TR>
                  ))
                ) : (
                  <TR>
                    <TD colSpan={7} className="text-center py-8 text-gray-500">
                      {t.noInvoicesFound}
                    </TD>
                  </TR>
                )}
              </Tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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

      {/* Create/Edit Invoice Modal */}
      <Modall
        title={editingInvoice ? t.editInvoice : t.createNewInvoice}
        modalOpen={showModal}
        setModalOpen={setShowModal}
        okText={editingInvoice ? t.update : t.create}
        cancelText={t.cancel}
        okAction={handleSubmit}
        cancelAction={resetForm}
        width={600}
        body={
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label={t.invoiceNumber}
                placeholder={t.invoiceNumberPlaceholder}
                value={formData.invoiceNo}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceNo: e.target.value })
                }
                width="w-full"
              />
              <InputField
                label={t.clientName}
                placeholder={t.clientNamePlaceholder}
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                width="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label={t.issueDate}
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                width="w-full"
              />
              <InputField
                label={t.dueDate}
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                width="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label={t.amount}
                type="number"
                placeholder={t.amountPlaceholder}
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                width="w-full"
              />
              <SelectBox
                label={t.status}
                value={formData.status}
                handleChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                optionList={statusOptions.filter((opt) => opt.value !== "all")}
                width="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.description}
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder={t.descriptionPlaceholder}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modall
        title={t.deleteInvoice}
        modalOpen={deleteInvoice !== null}
        setModalOpen={() => setDeleteInvoice(null)}
        okText={t.delete}
        cancelText={t.cancel}
        okAction={handleDelete}
        cancelAction={() => setDeleteInvoice(null)}
        width={400}
        body={
          <div className="text-center">
            <Trash2 className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <p className="text-gray-600">
              {t.deleteConfirmation}{" "}
              <strong>{deleteInvoice?.invoiceNo}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {t.actionCannotBeUndone}
            </p>
          </div>
        }
      />
    </Container>
  );
};

export default ManageInvoices;