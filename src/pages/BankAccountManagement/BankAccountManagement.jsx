import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Building2,
  Search,
  Edit2,
  Trash2,
  Star,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  X,
  Wallet,
  Activity,
  ArrowUpDown,
} from "lucide-react";

// Import context and components
import { useBankAccount } from "../../Contexts/BankAccountContext/BankAccountContext";
import BankAccountForm from "../../Contexts/BankAccountContext/UiComponents/BankAccountForm";

// New component imports
import Container from "../../components/elements/container/Container";
import Alert from "../../components/elements/Alert/Alert";
import Card from "../../components/elements/card/Card";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
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

// Keep some original imports for components not replaced
import {
  Input,
  Select,
  DropdownItem,
  LoadingSpinner,
  EmptyState,
  formatCurrency,
} from "../../Contexts/BankAccountContext/UiComponents/UiComponents";

import { useBankAccount } from "../../Contexts/BankAccountContext/BankAccountContext";

// Mock translations object
const translations = {
  "Account Information": "Account Information",
  "Account Name": "Account Name",
  "Enter account name": "Enter account name",
  "Bank Name": "Bank Name",
  "Enter bank name": "Enter bank name",
  "Account Number": "Account Number",
  "Enter account number": "Enter account number",
  "Account Type": "Account Type",
  "Select account type": "Select account type",
  Currency: "Currency",
  "Select currency": "Select currency",
  Balance: "Balance",
  "Enter balance": "Enter balance",
  "Additional Details": "Additional Details",
  Branch: "Branch",
  "Enter branch name": "Enter branch name",
  IBAN: "IBAN",
  "Enter IBAN": "Enter IBAN",
  "Swift Code": "Swift Code",
  "Enter Swift code": "Enter Swift code",
  Description: "Description",
  "Enter description": "Enter description",
  Savings: "Savings",
  Checking: "Checking",
  Business: "Business",
};

// InputField Component
const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  errors,
  icon: Icon,
  as = "input",
}) => {
  console.log(`InputField ${name} - Current value:`, value);

  const inputProps = {
    name,
    type,
    placeholder,
    value: value || "",
    onChange,
    className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? "border-red-500" : "border-gray-300"
      }`,
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 inline mr-1" />}
        {label}
      </label>
      {as === "textarea" ? (
        <textarea {...inputProps} rows={3} />
      ) : (
        <input {...inputProps} />
      )}
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
    </div>
  );
};

// SelectBox Component
const SelectBox = ({
  label,
  name,
  value,
  handleChange,
  errors,
  optionList,
  placeholder,
}) => {
  console.log(`SelectBox ${name} - Current value:`, value);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={(e) => {
          console.log(`SelectBox ${name} - Selected:`, e.target.value);
          handleChange(e.target.value);
        }}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? "border-red-500" : "border-gray-300"
          }`}
      >
        <option value="">{placeholder}</option>
        {optionList.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
    </div>
  );
};

const BankAccountForm = forwardRef(
  ({ account, onSubmit, isEditing = false }, ref) => {
    console.log("BankAccountForm - Initial props:", { account, isEditing });

    const [formData, setFormData] = useState({
      AccountName: "",
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

    console.log("BankAccountForm - Current formData:", formData);

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
      console.log(`handleInputChange - Field: ${name}, Value: ${value}`);

      setFormData((prev) => {
        const newFormData = {
          ...prev,
          [name]: value,
        };
        console.log("handleInputChange - Updated formData:", newFormData);
        return newFormData;
      });

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    };

    // Handle select change for dropdowns
    const handleSelectChange = (value, fieldName) => {
      console.log(`handleSelectChange - Field: ${fieldName}, Value: ${value}`);

      setFormData((prev) => {
        const newFormData = {
          ...prev,
          [fieldName]: value,
        };
        console.log("handleSelectChange - Updated formData:", newFormData);
        return newFormData;
      });

      // Clear error when user makes selection
      if (errors[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
      }
    };

    const validateForm = () => {
      console.log(
        "validateForm - Starting validation with formData:",
        formData
      );
      const newErrors = {};

      if (!formData.AccountName?.trim()) {
        newErrors.AccountName = "Account name is required";
      }

      if (!formData.BankName?.trim()) {
        newErrors.BankName = "Bank name is required";
      }

      if (!formData.AccountNumber?.trim()) {
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

      console.log("validateForm - Errors found:", newErrors);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = () => {
      console.log("handleFormSubmit - Starting submission");
      console.log("handleFormSubmit - Current formData:", formData);

      if (!validateForm()) {
        console.log("handleFormSubmit - Validation failed");
        return false;
      }

      console.log("handleFormSubmit - Validation passed, calling onSubmit");
      if (onSubmit) {
        onSubmit(formData);
        console.log("handleFormSubmit - onSubmit called successfully");
      } else {
        console.log("handleFormSubmit - No onSubmit function provided");
      }
      return true;
    };

    // Expose the handleFormSubmit function to parent component
    useImperativeHandle(ref, () => ({
      handleFormSubmit,
    }));

    console.log("BankAccountForm - Render with formData:", formData);

    return (
      <Container className="space-y-6 p-6 rounded-lg  max-w-4xl mx-auto">
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
              label={translations["Account Name"]}
              name="AccountName"
              placeholder={translations["Enter account name"]}
              value={formData.AccountName}
              onChange={handleInputChange}
              errors={errors}
              icon={Building2}
            />

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

        {/* Submit Button for Testing */}
        <Container className="flex justify-end space-x-4">
          <FilledButton
            buttonText={isEditing ? "Update Account" : "Create Account"}
            icon={Plus}
            onClick={() => {
              console.log("Submit button clicked");
              handleFormSubmit();
            }}

          >

          </FilledButton>
        </Container>
      </Container>
    );
  }
);

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

  // Local state
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
  const [viewMode, setViewMode] = useState("table"); // table or cards
  const [openDropdowns, setOpenDropdowns] = useState({}); // Track which dropdowns are open
  const formRef = useRef();

  // Load bank accounts on component mount
  useEffect(() => {
    getBankAccounts();
  }, [getBankAccounts]);

  // Filter options
  const accountTypeOptions = [
    { value: "", label: "All Types" },
    { value: "Savings", label: "Savings" },
    { value: "Checking", label: "Checking" },
    { value: "Business", label: "Business" },
    { value: "Investment", label: "Investment" },
    { value: "MoneyMarket", label: "Money Market" },
    { value: "", label: "All" },
    { value: "Savings", label: "Savings" },
    { value: "Checking", label: "Checking" },
    { value: "Business", label: "Business" },
  ];

  const currencyOptions = [
    { value: "", label: "All Currencies" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "PKR", label: "PKR" },
    { value: "SAR", label: "SAR" },
    { value: "AED", label: "AED" },
    { value: "CAD", label: "CAD" },
    { value: "AUD", label: "AUD" },
    { value: "JPY", label: "JPY" },
    { value: "CNY", label: "CNY" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  // Event handlers
  const handleFormSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (isEditing) {
        await updateBankAccount(selectedAccount.Id, formData);
      } else {
        await createBankAccount(formData);
      }
      await getBankAccounts(); // Refresh the list
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error is handled by the context
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalOk = () => {
    if (formRef.current?.handleFormSubmit) {
      formRef.current.handleFormSubmit();
    }
  };

  const closeModal = () => {
    setIsFormModalOpen(false);
    setSelectedAccount(null);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setIsEditing(true);
    setIsFormModalOpen(true);
    setOpenDropdowns({}); // Close all dropdowns
  };

  const handleDelete = async (accountId) => {
    if (window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      const success = await deleteBankAccount(accountId);
      if (success) {
        await getBankAccounts(); // Refresh the list
      }
    }
    setOpenDropdowns({}); // Close all dropdowns
  };

  const handleSetDefault = async (accountId) => {
    const success = await setDefaultBankAccount(accountId);
    if (success) {
      await getBankAccounts(); // Refresh the list
    }
    setOpenDropdowns({}); // Close all dropdowns
  };

  const handleToggleStatus = async (accountId) => {
    const success = await toggleBankAccountStatus(accountId);
    if (success) {
      await getBankAccounts(); // Refresh the list
    }
    setOpenDropdowns({}); // Close all dropdowns
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    searchBankAccounts(term);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({ ...prev, [filterType]: value }));
    
    switch (filterType) {
      case "accountType":
        filterBankAccountsByType(value);
        break;
      case "currency":
        filterBankAccountsByCurrency(value);
        break;
      case "status":
        filterBankAccountsByStatus(value);
        break;
    }
  };

  const handleSort = (field) => {
    const isAscending = filters.sortBy === field ? !filters.sortAscending : true;
    sortBankAccounts(field, isAscending);
  };

  // Dropdown toggle handler
  const toggleDropdown = (accountId) => {
    setOpenDropdowns(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}), // Close all others
      [accountId]: !prev[accountId] // Toggle current one
    }));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdowns({});
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Helper functions
  const getStatusBadge = (isActive) => (
    <Badge variant={isActive ? "success" : "danger"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  // Custom Dropdown Component (fallback if your Dropdown doesn't work)
  const CustomDropdown = ({ children, trigger, account }) => {
    const isOpen = openDropdowns[account.Id];
    
    return (
      <div className="relative inline-block text-left">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(account.Id);
          }}
        >
          {trigger}
        </div>
        
        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(account);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </button>
              
              {!account.IsDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetDefault(account.Id);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Set as Default
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(account.Id);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {account.IsActive ? (
                  <XCircle className="w-4 h-4 mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {account.IsActive ? "Deactivate" : "Activate"}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(account.Id);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Data calculations
  const activeBankAccounts = getActiveBankAccounts();
  const defaultBankAccount = getDefaultBankAccount();
  const accountData = Array.isArray(bankAccounts) ? bankAccounts : [];
  const totalAccounts = accountData.length;
  const activeAccounts = activeBankAccounts.length;
  const totalBalance = accountData.reduce((sum, account) => sum + (account.Balance || 0), 0);

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  // Render account card for mobile view
  const renderAccountCard = (account) => (
    <Card key={account.Id} className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{account.BankName}</h3>
            <p className="text-sm text-gray-500">{account.AccountName}</p>
          </div>
        </div>
        
        {/* Try your Dropdown component first, fallback to custom */}
        {typeof Dropdown === 'function' ? (
          <Dropdown
            trigger={
              <OutlineButton size="sm" className="flex items-center">
                <MoreVertical className="w-4 h-4" />
              </OutlineButton>
            }
          >
            <DropdownItem onClick={() => handleEdit(account)} className="flex items-center">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownItem>
            {!account.IsDefault && (
              <DropdownItem onClick={() => handleSetDefault(account.Id)} className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Set as Default
              </DropdownItem>
            )}
            <DropdownItem onClick={() => handleToggleStatus(account.Id)} className="flex items-center">
              {account.IsActive ? (
                <XCircle className="w-4 h-4 mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {account.IsActive ? "Deactivate" : "Activate"}
            </DropdownItem>
            <DropdownItem 
              onClick={() => handleDelete(account.Id)}
              className="text-red-600 hover:text-red-700 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownItem>
          </Dropdown>
        ) : (
          <CustomDropdown
            account={account}
            trigger={
              <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Account Number:</span>
          <span className="font-mono">{account.AccountNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Type:</span>
          <Badge variant="info">{account.AccountType}</Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Balance:</span>
          <span className="font-medium text-green-600">
            {formatCurrency(account.Balance, account.Currency)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Status:</span>
          <div className="flex items-center gap-2">
            {getStatusBadge(account.IsActive)}
            {account.IsDefault && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 hidden sm:block">
                  Bank Account Management
                </h1>
                <h1 className="text-lg font-bold text-gray-900 sm:hidden">
                  Accounts
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <OutlineButton size="sm" className="hidden sm:inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </OutlineButton>
              <OutlineButton size="sm" className="hidden sm:inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </OutlineButton>
      <Container className="bg-white border-b border-gray-200">
        <Container className="px-6 py-4">
          <Container className="flex items-center justify-around">

            <Container className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {"Bank Account Management"}
              </h1>
            </Container>


            <Container className="flex text-end  gap-2">
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
                buttonText={"Add New Account"}
                icon={Plus}
                isIcon={true}
                isIconLeft={true}
                onClick={() => {
                  setSelectedAccount(null);
                  setIsEditing(false);
                  setIsFormModalOpen(true);
                }}
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Account</span>
                <span className="sm:hidden">Add</span>
              </FilledButton>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Accounts</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalAccounts}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Active</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{activeAccounts}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Total Balance</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Default Account</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {defaultBankAccount?.BankName || "None"}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 sm:p-6 mb-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bank accounts..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <FilledButton
                  variant={viewMode === "table" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="hidden lg:inline-flex"
                >
                  Table
                </FilledButton>
                <OutlineButton
                  variant={viewMode === "cards" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="hidden lg:inline-flex"
                >
                  Cards
                </OutlineButton>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                value={selectedFilters.accountType}
                onChange={(e) => handleFilterChange("accountType", e.target.value)}
              >
                {accountTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>

              <Select
                value={selectedFilters.currency}
                onChange={(e) => handleFilterChange("currency", e.target.value)}
              >
                {currencyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>

              <Select
                value={selectedFilters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </div>
          </div>
        <Card className="p-6 mb-6">
         
            <SearchAndFilters
              searchPlaceholder="Search bank accounts"
              onSearch={handleSearch}
              searchValue={searchTerm}
              filters={[
                {
                  label: "Account type",
                  options: accountTypeOptions,
                  value: selectedFilters.accountType,
                  onChange: (value) => handleFilterChange("accountType", value),
                },
                {
                  label: "Currency",
                  options: currencyOptions,
                  value: selectedFilters.currency,
                  onChange: (value) => handleFilterChange("currency", value),
                },
                {
                  label: "Status",
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

        {/* Bank Accounts Content */}
        <Card>
          {loading ? (
            <div className="p-8">
              <div className="flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading accounts...</p>
              </div>
            </div>
          ) : accountData.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No accounts found"
              description="Create your first bank account to get started"
              action={
                <FilledButton
                  onClick={() => {
                    setSelectedAccount(null);
                    setIsEditing(false);
                    setIsFormModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Account</span>
                </FilledButton>
              }
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <Thead>
                    <TR>
                      <TH 
                        sortable 
                        onClick={() => handleSort("BankName")}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          Bank Details
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TH>
                      <TH>Account Info</TH>
                      <TH>Type & Currency</TH>
                      <TH 
                        sortable 
                        onClick={() => handleSort("Balance")}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          Balance
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TH>
                      <TH>Status</TH>
                      <TH className="text-center">Actions</TH>
                    </TR>
                  </Thead>
                  <Tbody>
                    {accountData.map((account) => (
                      <TR key={account.Id}>
                        <TD>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{account.BankName}</div>
                              {account.BranchCode && (
                                <div className="text-sm text-gray-500">Branch: {account.BranchCode}</div>
                              )}
                            </div>
                          </div>
                        </TD>
                        <TD>
                          <div className="text-sm font-medium text-gray-900">{account.AccountName}</div>
                          <div className="text-sm text-gray-500 font-mono">{account.AccountNumber}</div>
                        </TD>
                        <TD>
                          <Badge variant="info">{account.AccountType}</Badge>
                          <div className="text-xs text-gray-500 mt-1">{account.Currency}</div>
                        </TD>
                        <TD>
                          <div className="text-sm font-medium text-green-600">
                            {formatCurrency(account.Balance, account.Currency)}
                          </div>
                        </TD>
                        <TD>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(account.IsActive)}
                            {account.IsDefault && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </TD>
                        <TD className="text-center">
                          {/* Try your Dropdown component first, fallback to custom */}
                          {typeof Dropdown === 'function' ? (
                            <Dropdown
                              trigger={
                                <OutlineButton size="sm" className="flex items-center justify-center">
                                  <MoreVertical className="w-4 h-4" />
                                </OutlineButton>
                              }
                            >
                              <DropdownItem onClick={() => handleEdit(account)} className="flex items-center">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownItem>
                              {!account.IsDefault && (
                                <DropdownItem onClick={() => handleSetDefault(account.Id)} className="flex items-center">
                                  <Star className="w-4 h-4 mr-2" />
                                  Set as Default
                                </DropdownItem>
                              )}
                              <DropdownItem onClick={() => handleToggleStatus(account.Id)} className="flex items-center">
                                {account.IsActive ? (
                                  <XCircle className="w-4 h-4 mr-2" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                {account.IsActive ? "Deactivate" : "Activate"}
                              </DropdownItem>
                              <DropdownItem 
                                onClick={() => handleDelete(account.Id)}
                                className="text-red-600 hover:text-red-700 flex items-center"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownItem>
                            </Dropdown>
                          ) : (
                            <CustomDropdown
                              account={account}
                              trigger={
                                <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              }
                            />
                          )}
                        </TD>
                      </TR>
                    ))}
                  </Tbody>
                </Table>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="lg:hidden">
                <div className="divide-y divide-gray-200">
                  {accountData.map((account) => renderAccountCard(account))}
                </div>
              </div>
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
                          buttonText={'Actions'}
                          buttonClassName="text-sm "
                          items={[

                            {
                              label: "Edit",
                              icon: Edit2,
                              action: () => handleEdit(account),
                            },

                            ...(!account.IsDefault
                              ? [
                                {
                                  label: "Set as Default",
                                  icon: Star,
                                  action: () => handleSetDefault(account.Id),
                                },
                              ]
                              : []),
                            {
                              label: "Toggle Status",
                              icon: account.IsActive ? XCircle : CheckCircle,
                              action: () => handleToggleStatus(account.Id),
                            },
                            {
                              label: "Delete",
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
                <Pagination
                  currentPage={pagination.CurrentPage}
                  totalPages={pagination.TotalPages}
                  totalItems={pagination.TotalItems}
                  pageSize={pagination.PageSize}
                  onPageChange={changePage}
                  onPageSizeChange={changePageSize}
                />
              )}
            </>
          )}
        </Card>
      </div>

      {/* Form Modal */}
      <Modall
        isOpen={isFormModalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit Bank Account" : "Add New Account"}
        size="lg"
        footer={
          <>
            <OutlineButton onClick={closeModal} disabled={isSaving} className="inline-flex items-center">
              Cancel
            </OutlineButton>
            <FilledButton onClick={handleModalOk} loading={isSaving} disabled={isSaving} className="inline-flex items-center">
              {isEditing ? "Update Account" : "Create Account"}
            </FilledButton>
          </>
        }
      >
        <BankAccountForm
          ref={formRef}
          account={selectedAccount}
          onSubmit={handleFormSubmit}
          isEditing={isEditing}
        />
      </Modall>
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