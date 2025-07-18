import React, { useState, useEffect } from "react";
import {
  Plus,
  Building2,
  CreditCard,
  DollarSign,
  Search,
  Filter,
  Edit2,
  Trash2,
  Star,
  StarOff,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Settings,
  Calendar,
  TrendingUp,
  ArrowUpDown,
  ChevronDown,
  Banknote,
  Wallet,
  Target,
  Activity,
} from "lucide-react";

// Import your reusable components
import Container from "../../components/elements/container/Container";
import Alert from "../../components/elements/Alert/Alert";
import Card from "../../components/elements/card/Card";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import InputField from "../../components/elements/inputField/InputField";
import Table from "../../components/elements/table/Table";
import Thead from "../../components/elements/thead/Thead";
import TR from "../../components/elements/tr/TR";
import TH from "../../components/elements/th/TH";
import Tbody from "../../components/elements/tbody/Tbody";
import TD from "../../components/elements/td/TD";
import Dropdown from "../../components/elements/dropdown/Dropdown";
import Pagination from "../../components/elements/Pagination/Pagination";
import Modall from "../../components/elements/modal/Modal";
import Skeleton from "../../components/elements/skeleton/Skeleton";
import Badge from "../../components/elements/Badge/Badge";
import { useBankAccount } from "../../Contexts/BankAccountContext/BankAccountContext";

// Translations
const translations = {
  "Bank Account Management": "Bank Account Management",
  "Add New Account": "Add New Account",
  "Edit Bank Account": "Edit Bank Account",
  "Bank Name": "Bank Name",
  "Account Number": "Account Number",
  "Account Type": "Account Type",
  Currency: "Currency",
  Balance: "Balance",
  Status: "Status",
  Default: "Default",
  Actions: "Actions",
  Active: "Active",
  Inactive: "Inactive",
  "Search bank accounts": "Search bank accounts",
  "Filter by account type": "Filter by account type",
  "Filter by currency": "Filter by currency",
  "Filter by status": "Filter by status",
  All: "All",
  Savings: "Savings",
  Checking: "Checking",
  Business: "Business",
  Edit: "Edit",
  Delete: "Delete",
  "Set as Default": "Set as Default",
  "View Details": "View Details",
  "View Transactions": "View Transactions",
  "Toggle Status": "Toggle Status",
  "Create Account": "Create Account",
  "Update Account": "Update Account",
  Cancel: "Cancel",
  Save: "Save",
  Loading: "Loading",
  "No accounts found": "No accounts found",
  "Create your first bank account": "Create your first bank account",
  Branch: "Branch",
  IBAN: "IBAN",
  "Swift Code": "Swift Code",
  Description: "Description",
  "Enter bank name": "Enter bank name",
  "Enter account number": "Enter account number",
  "Enter branch name": "Enter branch name",
  "Enter IBAN": "Enter IBAN",
  "Enter Swift code": "Enter Swift code",
  "Enter description": "Enter description",
  "Enter balance": "Enter balance",
  "Select account type": "Select account type",
  "Select currency": "Select currency",
  "Account Information": "Account Information",
  "Additional Details": "Additional Details",
  "Are you sure?": "Are you sure?",
  "This action cannot be undone": "This action cannot be undone",
  "Recent Transactions": "Recent Transactions",
  "Balance History": "Balance History",
  Export: "Export",
  Import: "Import",
  Refresh: "Refresh",
  "Sort by": "Sort by",
  Name: "Name",
  "Created Date": "Created Date",
  "Updated Date": "Updated Date",
  "Default Account": "Default Account",
  "Total Accounts": "Total Accounts",
  "Active Accounts": "Active Accounts",
  "Total Balance": "Total Balance",
};

// Bank Account Form Component
const BankAccountForm = React.forwardRef(({ account, onSubmit, isEditing = false }, ref) => {
  const [formData, setFormData] = useState({
    BankName: "",
    AccountNumber: "",
    AccountType: "",
    Currency: "",
    Branch: "",
    IBAN: "",
    SwiftCode: "",
    Description: "",
    Balance: "",
    IsActive: true,
    IsDefault: false,
    ...account,
  });

  const [errors, setErrors] = useState({});

  const accountTypes = [
    { value: "Savings", label: translations.Savings },
    { value: "Checking", label: translations.Checking },
    { value: "Business", label: translations.Business },
  ];

  const currencies = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "PKR", label: "PKR" },
  ];

  // Handle input change for regular inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle select change for dropdowns
  const handleSelectChange = (value) => {
    const name = arguments[1]?.name || arguments[1]; // Handle different select implementations
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user makes selection
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.BankName.trim()) {
      newErrors.BankName = "Bank name is required";
    }

    if (!formData.AccountNumber.trim()) {
      newErrors.AccountNumber = "Account number is required";
    }

    if (!formData.AccountType) {
      newErrors.AccountType = "Account type is required";
    }

    if (!formData.Currency) {
      newErrors.Currency = "Currency is required";
    }

    if (formData.Balance && isNaN(parseFloat(formData.Balance))) {
      newErrors.Balance = "Balance must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return false;
    onSubmit(formData);
    return true;
  };

  // Expose the handleFormSubmit function to parent component
  React.useImperativeHandle(ref, () => ({
    handleFormSubmit,
  }));

  return (
    <Container className="space-y-6">
      {/* Account Information Section */}
      <Container>
        <Container className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {translations["Account Information"]}
          </h3>
        </Container>

        <Container className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={translations["Bank Name"]}
            name="BankName"
            placeholder={translations["Enter bank name"]}
            value={formData.BankName}
            onChange={handleInputChange}
            errors={errors}
            icon={Building2}
          />

          <InputField
            label={translations["Account Number"]}
            name="AccountNumber"
            placeholder={translations["Enter account number"]}
            value={formData.AccountNumber}
            onChange={handleInputChange}
            errors={errors}
            icon={CreditCard}
          />

          <SelectBox
            label={translations["Account Type"]}
            name="AccountType"
            value={formData.AccountType}
            handleChange={(value) => handleSelectChange(value, "AccountType")}
            errors={errors}
            optionList={accountTypes}
            placeholder={translations["Select account type"]}
          />

          <SelectBox
            label={translations["Currency"]}
            name="Currency"
            value={formData.Currency}
            handleChange={(value) => handleSelectChange(value, "Currency")}
            errors={errors}
            optionList={currencies}
            placeholder={translations["Select currency"]}
          />

          <InputField
            label={translations["Balance"]}
            name="Balance"
            type="number"
            placeholder={translations["Enter balance"]}
            value={formData.Balance}
            onChange={handleInputChange}
            errors={errors}
            icon={DollarSign}
          />
        </Container>
      </Container>

      {/* Additional Details Section */}
      <Container>
        <Container className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {translations["Additional Details"]}
          </h3>
        </Container>

        <Container className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={translations["Branch"]}
            name="Branch"
            placeholder={translations["Enter branch name"]}
            value={formData.Branch}
            onChange={handleInputChange}
            errors={errors}
          />

          <InputField
            label={translations["IBAN"]}
            name="IBAN"
            placeholder={translations["Enter IBAN"]}
            value={formData.IBAN}
            onChange={handleInputChange}
            errors={errors}
          />

          <InputField
            label={translations["Swift Code"]}
            name="SwiftCode"
            placeholder={translations["Enter Swift code"]}
            value={formData.SwiftCode}
            onChange={handleInputChange}
            errors={errors}
          />

          <Container className="md:col-span-2">
            <InputField
              label={translations["Description"]}
              name="Description"
              as="textarea"
              placeholder={translations["Enter description"]}
              value={formData.Description}
              onChange={handleInputChange}
              errors={errors}
            />
          </Container>
        </Container>
      </Container>
    </Container>
  );
});

// Main Bank Account Management Component
const BankAccountManagement = () => {
  const {
    bankAccounts,
    loading,
    error,
    pagination,
    filters,
    getBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setDefaultBankAccount,
    toggleBankAccountStatus,
    searchBankAccounts,
    filterBankAccountsByType,
    filterBankAccountsByCurrency,
    filterBankAccountsByStatus,
    sortBankAccounts,
    changePage,
    changePageSize,
    clearError,
    getActiveBankAccounts,
    getDefaultBankAccount,
  } = useBankAccount();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    accountType: "",
    currency: "",
    status: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const formRef = React.useRef();

  // Load bank accounts on component mount
  useEffect(() => {
    getBankAccounts();
  }, [getBankAccounts]);

  // Filter and search options
  const accountTypeOptions = [
    { value: "", label: translations.All },
    { value: "Savings", label: translations.Savings },
    { value: "Checking", label: translations.Checking },
    { value: "Business", label: translations.Business },
  ];

  const currencyOptions = [
    { value: "", label: translations.All },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "PKR", label: "PKR" },
  ];

  const statusOptions = [
    { value: "", label: translations.All },
    { value: "true", label: translations.Active },
    { value: "false", label: translations.Inactive },
  ];

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (isEditing) {
        await updateBankAccount(selectedAccount.Id, formData);
      } else {
        await createBankAccount(formData);
      }

      // Refresh the list
      await getBankAccounts();

      // Close modal and reset state
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle modal OK button click
  const handleModalOk = () => {
    if (formRef.current && formRef.current.handleFormSubmit) {
      const isValid = formRef.current.handleFormSubmit();
      if (!isValid) return; // Don't close modal if validation fails
    }
  };

  // Handle modal cancel/close
  const handleModalCancel = () => {
    closeModal();
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsFormModalOpen(false);
    setSelectedAccount(null);
    setIsEditing(false);
    setIsSaving(false);
  };

  // Handle edit action
  const handleEdit = (account) => {
    setSelectedAccount(account);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  // Handle delete action
  const handleDelete = async (accountId) => {
    if (window.confirm(translations["Are you sure?"])) {
      await deleteBankAccount(accountId);
      await getBankAccounts();
    }
  };

  // Handle set default action
  const handleSetDefault = async (accountId) => {
    await setDefaultBankAccount(accountId);
    await getBankAccounts();
  };

  // Handle toggle status action
  const handleToggleStatus = async (accountId) => {
    await toggleBankAccountStatus(accountId);
    await getBankAccounts();
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    searchBankAccounts(term);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));

    switch (filterType) {
      case "accountType":
        filterBankAccountsByType(value);
        break;
      case "currency":
        filterBankAccountsByCurrency(value);
        break;
      case "status":
        filterBankAccountsByStatus(value === "" ? null : value === "true");
        break;
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    const isAscending =
      filters.sortBy === field ? !filters.sortAscending : true;
    sortBankAccounts(field, isAscending);
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    return (
      <Badge
        variant={isActive ? "success" : "danger"}
        text={isActive ? translations.Active : translations.Inactive}
      />
    );
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  // Get account data safely - handle both array and nested object structure
  const accountData = Array.isArray(bankAccounts) 
    ? bankAccounts 
    : (bankAccounts?.Data?.$values || bankAccounts?.Data || []);
  
  const activeBankAccounts = getActiveBankAccounts();
  const defaultBankAccount = getDefaultBankAccount();

  // Calculate statistics
  const totalAccounts = accountData.length;
  const activeAccounts = activeBankAccounts.length;
  const totalBalance = accountData.reduce(
    (sum, account) => sum + (account.Balance || 0),
    0
  );

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="bg-white border-b border-gray-200">
        <Container className="px-6 py-4">
          <Container className="flex items-center justify-between">
            <Container className="flex items-center gap-4">
              <Container className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  {translations["Bank Account Management"]}
                </h1>
              </Container>
            </Container>

            <Container className="flex gap-3">
              <OutlineButton
                buttonText={translations.Export}
                icon={Download}
                isIcon={true}
                isIconLeft={true}
                bgColor="bg-white"
                textColor="text-gray-700"
                borderColor="border-gray-300"
                borderWidth="border"
                rounded="rounded-md"
                height="h-10"
                px="px-4"
                fontSize="text-sm"
                fontWeight="font-medium"
                hover="hover:bg-gray-50"
                onClick={() => console.log("Export")}
              />
              <OutlineButton
                buttonText={translations.Import}
                icon={Upload}
                isIcon={true}
                isIconLeft={true}
                bgColor="bg-white"
                textColor="text-gray-700"
                borderColor="border-gray-300"
                borderWidth="border"
                rounded="rounded-md"
                height="h-10"
                px="px-4"
                fontSize="text-sm"
                fontWeight="font-medium"
                hover="hover:bg-gray-50"
                onClick={() => console.log("Import")}
              />
              <FilledButton
                buttonText={translations["Add New Account"]}
                icon={Plus}
                isIcon={true}
                isIconLeft={true}
                onClick={() => {
                  setSelectedAccount(null);
                  setIsEditing(false);
                  setIsFormModalOpen(true);
                }}
              />
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Statistics Cards */}
      <Container className="px-6 py-6">
        <Container className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <p className="text-sm text-gray-600">
                  {translations["Total Accounts"]}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalAccounts}
                </p>
              </Container>
              <Container className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </Container>
            </Container>
          </Card>

          <Card className="p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <p className="text-sm text-gray-600">
                  {translations["Active Accounts"]}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {activeAccounts}
                </p>
              </Container>
              <Container className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </Container>
            </Container>
          </Card>

          <Card className="p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <p className="text-sm text-gray-600">
                  {translations["Total Balance"]}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalBalance)}
                </p>
              </Container>
              <Container className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-600" />
              </Container>
            </Container>
          </Card>

          <Card className="p-6">
            <Container className="flex items-center justify-between">
              <Container>
                <p className="text-sm text-gray-600">
                  {translations["Default Account"]}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {defaultBankAccount?.BankName || "None"}
                </p>
              </Container>
              <Container className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </Container>
            </Container>
          </Card>
        </Container>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <SearchAndFilters
            searchPlaceholder={translations["Search bank accounts"]}
            onSearch={handleSearch}
            searchValue={searchTerm}
            filters={[
              {
                label: translations["Filter by account type"],
                options: accountTypeOptions,
                value: selectedFilters.accountType,
                onChange: (value) => handleFilterChange("accountType", value),
              },
              {
                label: translations["Filter by currency"],
                options: currencyOptions,
                value: selectedFilters.currency,
                onChange: (value) => handleFilterChange("currency", value),
              },
              {
                label: translations["Filter by status"],
                options: statusOptions,
                value: selectedFilters.status,
                onChange: (value) => handleFilterChange("status", value),
              },
            ]}
          />
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={clearError}
            className="mb-6"
          />
        )}

        {/* Bank Accounts Table */}
        <Card>
          <Container className="overflow-x-auto">
            <Table className="min-w-full">
              <Thead className="bg-gray-50">
                <TR>
                  <TH
                    className="cursor-pointer"
                    onClick={() => handleSort("BankName")}
                  >
                    <Container className="flex items-center gap-2">
                      {translations["Bank Name"]}
                      <ArrowUpDown className="w-4 h-4" />
                    </Container>
                  </TH>
                  <TH>{translations["Account Number"]}</TH>
                  <TH>{translations["Account Type"]}</TH>
                  <TH>{translations["Currency"]}</TH>
                  <TH>{translations["Balance"]}</TH>
                  <TH>{translations["Status"]}</TH>
                  <TH>{translations["Default"]}</TH>
                  <TH className="text-center">{translations["Actions"]}</TH>
                </TR>
              </Thead>
              <Tbody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TR key={index}>
                      <TD>
                        <Skeleton className="h-4 w-32" />
                      </TD>
                      <TD>
                        <Skeleton className="h-4 w-24" />
                      </TD>
                      <TD>
                        <Skeleton className="h-4 w-20" />
                      </TD>
                      <TD>
                        <Skeleton className="h-4 w-16" />
                      </TD>
                      <TD>
                        <Skeleton className="h-4 w-24" />
                      </TD>
                      <TD>
                        <Skeleton className="h-4 w-16" />
                      </TD>
                      <TD>
                        <Skeleton className="h-4 w-16" />
                      </TD>
                      <TD>
                        <Skeleton className="h-4 w-20" />
                      </TD>
                    </TR>
                  ))
                ) : accountData.length === 0 ? (
                  // Empty state
                  <TR>
                    <TD colSpan="8" className="text-center py-12">
                      <Container className="flex flex-col items-center gap-4">
                        <Building2 className="w-16 h-16 text-gray-300" />
                        <Container className="text-center">
                          <p className="text-lg font-medium text-gray-500">
                            {translations["No accounts found"]}
                          </p>
                          <p className="text-sm text-gray-400">
                            {translations["Create your first bank account"]}
                          </p>
                        </Container>
                        <FilledButton
                          buttonText={translations["Add New Account"]}
                          icon={Plus}
                          isIcon={true}
                          isIconLeft={true}
                          onClick={() => {
                            setSelectedAccount(null);
                            setIsEditing(false);
                            setIsFormModalOpen(true);
                          }}
                        />
                      </Container>
                    </TD>
                  </TR>
                ) : (
                  // Account data
                  accountData.map((account) => (
                    <TR key={account.Id}>
                      <TD>
                        <Container className="flex items-center gap-3">
                          <Container className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </Container>
                          <Container>
                            <p className="font-medium text-gray-900">
                              {account.BankName}
                            </p>
                            {account.Branch && (
                              <p className="text-sm text-gray-500">
                                {account.Branch}
                              </p>
                            )}
                          </Container>
                        </Container>
                      </TD>
                      <TD>
                        <Container className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm">
                            {account.AccountNumber}
                          </span>
                        </Container>
                      </TD>
                      <TD>
                        <Badge variant="info" text={account.AccountType} />
                      </TD>
                      <TD>
                        <Container className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            {account.Currency}
                          </span>
                        </Container>
                      </TD>
                      <TD>
                        <span className="font-medium text-green-600">
                          {formatCurrency(account.Balance, account.Currency)}
                        </span>
                      </TD>
                      <TD>{getStatusBadge(account.IsActive)}</TD>
                      <TD>
                        {account.IsDefault && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </TD>
                      <TD className="text-center">
                        <Dropdown
                          buttonText={translations.Actions}
                          buttonClassName="text-sm"
                          items={[
                            {
                              label: translations["View Details"],
                              icon: Eye,
                              action: () =>
                                console.log("View details", account.Id),
                            },
                            {
                              label: translations["Edit"],
                              icon: Edit2,
                              action: () => handleEdit(account),
                            },
                            {
                              label: translations["View Transactions"],
                              icon: Activity,
                              action: () =>
                                console.log("View transactions", account.Id),
                            },
                            ...(!account.IsDefault
                              ? [
                                  {
                                    label: translations["Set as Default"],
                                    icon: Star,
                                    action: () => handleSetDefault(account.Id),
                                  },
                                ]
                              : []),
                            {
                              label: translations["Toggle Status"],
                              icon: account.IsActive ? XCircle : CheckCircle,
                              action: () => handleToggleStatus(account.Id),
                            },
                            {
                              label: translations["Delete"],
                              icon: Trash2,
                              action: () => handleDelete(account.Id),
                              className: "text-red-600 hover:text-red-700",
                            },
                          ]}
                          onSelect={(item) => item.action()}
                        />
                      </TD>
                    </TR>
                  ))
                )}
              </Tbody>
            </Table>
          </Container>

          {/* Pagination */}
          {pagination.TotalPages > 1 && (
            <Container className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={pagination.CurrentPage}
                totalPages={pagination.TotalPages}
                totalItems={pagination.TotalItems}
                pageSize={pagination.PageSize}
                onPageChange={changePage}
                onPageSizeChange={changePageSize}
              />
            </Container>
          )}
        </Card>
      </Container>

      {/* Form Modal */}
      <Modall
        modalOpen={isFormModalOpen}
        setModalOpen={setIsFormModalOpen}
        title={
          isEditing
            ? translations["Edit Bank Account"]
            : translations["Add New Account"]
        }
        okText={
          isSaving
            ? translations.Loading
            : isEditing
            ? translations["Update Account"]
            : translations["Create Account"]
        }
        cancelText={translations.Cancel}
        okAction={handleModalOk}
        cancelAction={handleModalCancel}
        okButtonDisabled={isSaving}
        cancelButtonDisabled={isSaving}
        width={800}
        body={
          <BankAccountForm
            ref={formRef}
            account={selectedAccount}
            onSubmit={handleFormSubmit}
            isEditing={isEditing}
          />
        }
      />
    </Container>
  );
};

export default BankAccountManagement;