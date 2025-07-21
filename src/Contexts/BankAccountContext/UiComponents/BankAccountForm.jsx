import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Building2, CreditCard, DollarSign, Settings } from "lucide-react";
import { Input, Select, TextArea, Checkbox } from "./UIComponents";

const BankAccountForm = forwardRef(({ account, onSubmit, isEditing = false }, ref) => {
  const [formData, setFormData] = useState({
    BankName: "",
    AccountName: "",
    AccountNumber: "",
    AccountType: "",
    Currency: "",
    Balance: "",
    CreditLimit: "",
    BranchCode: "",
    SwiftCode: "",
    IbanNumber: "",
    Notes: "",
    IsActive: true,
    IsDefault: false,
    ...account, // Spread existing account data if editing
  });

  const [errors, setErrors] = useState({});

  // Form options
  const accountTypes = [
    { value: "Savings", label: "Savings" },
    { value: "Checking", label: "Checking" },
    { value: "Business", label: "Business" },
    { value: "Investment", label: "Investment" },
    { value: "MoneyMarket", label: "Money Market" },
  ];

  const currencies = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "PKR", label: "PKR - Pakistani Rupee" },
    { value: "SAR", label: "SAR - Saudi Riyal" },
    { value: "AED", label: "AED - UAE Dirham" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "CNY", label: "CNY - Chinese Yuan" },
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
    
    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.BankName?.trim()) {
      newErrors.BankName = "Bank name is required";
    }
    if (!formData.AccountName?.trim()) {
      newErrors.AccountName = "Account name is required";
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

    // Numeric fields validation
    if (formData.Balance && isNaN(parseFloat(formData.Balance))) {
      newErrors.Balance = "Balance must be a valid number";
    }
    if (formData.CreditLimit && isNaN(parseFloat(formData.CreditLimit))) {
      newErrors.CreditLimit = "Credit limit must be a valid number";
    }

    // Length validations
    if (formData.BankName && formData.BankName.length > 100) {
      newErrors.BankName = "Bank name cannot exceed 100 characters";
    }
    if (formData.AccountName && formData.AccountName.length > 100) {
      newErrors.AccountName = "Account name cannot exceed 100 characters";
    }
    if (formData.AccountNumber && formData.AccountNumber.length > 50) {
      newErrors.AccountNumber = "Account number cannot exceed 50 characters";
    }
    if (formData.BranchCode && formData.BranchCode.length > 20) {
      newErrors.BranchCode = "Branch code cannot exceed 20 characters";
    }
    if (formData.SwiftCode && formData.SwiftCode.length > 20) {
      newErrors.SwiftCode = "Swift code cannot exceed 20 characters";
    }
    if (formData.IbanNumber && formData.IbanNumber.length > 50) {
      newErrors.IbanNumber = "IBAN number cannot exceed 50 characters";
    }
    if (formData.Notes && formData.Notes.length > 500) {
      newErrors.Notes = "Notes cannot exceed 500 characters";
    }

    // Business logic validations
    if (formData.Balance && parseFloat(formData.Balance) < 0) {
      newErrors.Balance = "Balance cannot be negative";
    }
    if (formData.CreditLimit && parseFloat(formData.CreditLimit) < 0) {
      newErrors.CreditLimit = "Credit limit cannot be negative";
    }

    // IBAN validation (basic)
    if (formData.IbanNumber && formData.IbanNumber.trim()) {
      const iban = formData.IbanNumber.replace(/\s/g, '').toUpperCase();
      if (iban.length < 15 || iban.length > 34) {
        newErrors.IbanNumber = "IBAN must be between 15 and 34 characters";
      } else if (!/^[A-Z0-9]+$/.test(iban)) {
        newErrors.IbanNumber = "IBAN contains invalid characters";
      }
    }

    // Swift code validation (basic)
    if (formData.SwiftCode && formData.SwiftCode.trim()) {
      const swift = formData.SwiftCode.replace(/\s/g, '').toUpperCase();
      if (swift.length !== 8 && swift.length !== 11) {
        newErrors.SwiftCode = "Swift code must be 8 or 11 characters long";
      } else if (!/^[A-Z0-9]+$/.test(swift)) {
        newErrors.SwiftCode = "Swift code contains invalid characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = () => {
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return false;
    }
    
    // Prepare data for API
    const apiData = {
      ...formData,
      Balance: parseFloat(formData.Balance) || 0,
      CreditLimit: parseFloat(formData.CreditLimit) || 0,
      // Clean up string fields
      BankName: formData.BankName?.trim(),
      AccountName: formData.AccountName?.trim(),
      AccountNumber: formData.AccountNumber?.trim(),
      BranchCode: formData.BranchCode?.trim() || null,
      SwiftCode: formData.SwiftCode?.trim() || null,
      IbanNumber: formData.IbanNumber?.trim() || null,
      Notes: formData.Notes?.trim() || null,
    };
    
    console.log("Submitting form data:", apiData);
    onSubmit(apiData);
    return true;
  };

  // Expose form submission to parent component
  useImperativeHandle(ref, () => ({
    handleFormSubmit,
    resetForm: () => {
      setFormData({
        BankName: "",
        AccountName: "",
        AccountNumber: "",
        AccountType: "",
        Currency: "",
        Balance: "",
        CreditLimit: "",
        BranchCode: "",
        SwiftCode: "",
        IbanNumber: "",
        Notes: "",
        IsActive: true,
        IsDefault: false,
      });
      setErrors({});
    },
    getFormData: () => formData,
    setFormData,
    validateForm,
  }));

  return (
    <div className="space-y-8">
      {/* Account Information Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bank Name"
            name="BankName"
            placeholder="Enter bank name"
            value={formData.BankName}
            onChange={handleInputChange}
            error={errors.BankName}
            icon={Building2}
            required
          />

          <Input
            label="Account Name"
            name="AccountName"
            placeholder="Enter account name"
            value={formData.AccountName}
            onChange={handleInputChange}
            error={errors.AccountName}
            icon={Building2}
            required
          />

          <Input
            label="Account Number"
            name="AccountNumber"
            placeholder="Enter account number"
            value={formData.AccountNumber}
            onChange={handleInputChange}
            error={errors.AccountNumber}
            icon={CreditCard}
            required
          />

          <Select
            label="Account Type"
            name="AccountType"
            value={formData.AccountType}
            onChange={handleInputChange}
            error={errors.AccountType}
            required
          >
            <option value="">Select account type</option>
            {accountTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>

          <Select
            label="Currency"
            name="Currency"
            value={formData.Currency}
            onChange={handleInputChange}
            error={errors.Currency}
            required
          >
            <option value="">Select currency</option>
            {currencies.map(currency => (
              <option key={currency.value} value={currency.value}>{currency.label}</option>
            ))}
          </Select>

          <Input
            label="Initial Balance"
            name="Balance"
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter initial balance"
            value={formData.Balance}
            onChange={handleInputChange}
            error={errors.Balance}
            icon={DollarSign}
          />

          <div className="md:col-span-2">
            <Input
              label="Credit Limit"
              name="CreditLimit"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter credit limit (optional)"
              value={formData.CreditLimit}
              onChange={handleInputChange}
              error={errors.CreditLimit}
              icon={DollarSign}
            />
          </div>
        </div>
      </div>

      {/* Banking Details Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Banking Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Branch Code"
            name="BranchCode"
            placeholder="Enter branch code (optional)"
            value={formData.BranchCode}
            onChange={handleInputChange}
            error={errors.BranchCode}
          />

          <Input
            label="Swift Code"
            name="SwiftCode"
            placeholder="Enter Swift code (optional)"
            value={formData.SwiftCode}
            onChange={handleInputChange}
            error={errors.SwiftCode}
          />

          <div className="md:col-span-2">
            <Input
              label="IBAN Number"
              name="IbanNumber"
              placeholder="Enter IBAN number (optional)"
              value={formData.IbanNumber}
              onChange={handleInputChange}
              error={errors.IbanNumber}
            />
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
        </div>

        <div className="space-y-4">
          <TextArea
            label="Notes"
            name="Notes"
            placeholder="Enter additional notes or comments (optional)"
            value={formData.Notes}
            onChange={handleInputChange}
            error={errors.Notes}
            rows={4}
          />
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Active Account"
            name="IsActive"
            checked={formData.IsActive}
            onChange={handleInputChange}
          />

          <Checkbox
            label="Set as Default Account"
            name="IsDefault"
            checked={formData.IsDefault}
            onChange={handleInputChange}
          />

          {formData.IsDefault && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Setting this as the default account will automatically unset any other default account.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Form Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

BankAccountForm.displayName = "BankAccountForm";

export default BankAccountForm;