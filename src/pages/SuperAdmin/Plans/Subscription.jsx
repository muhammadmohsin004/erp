import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  RefreshCw,
  Plus,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import CheckboxField from "../../../components/elements/checkbox/CheckboxField";
import { useSuperAdmin } from "../../../Contexts/superAdminApiClient/superAdminApiClient";

const initialPlanState = {
  Name: "",
  Description: "",
  PlanType: "Enterprise",
  MonthlyPrice: 0,
  YearlyPrice: 0,
  MaxUsers: 0,
  MaxEmployees: 0,
  MaxProducts: 0,
  MaxWarehouses: 0,
  StorageLimitGB: 0,
  EnableInventory: true,
  EnableHR: true,
  EnableAccounting: true,
  EnableReports: true,
  EnableAPI: true,
  EnableCustomBranding: true,
  EnableAdvancedReports: true,
  EnableMultiCurrency: true,
  IsActive: true,
  IsPopular: false,
  SortOrder: 0,
};

const planTypes = [
  { label: "Basic", value: "Basic" },
  { label: "Standard", value: "Standard" },
  { label: "Premium", value: "Premium" },
  { label: "Enterprise", value: "Enterprise" },
];

const featureGroups = [
  {
    features: [
      { name: "EnableInventory", label: "Enable Inventory" },
      { name: "EnableHR", label: "Enable HR" },
      { name: "EnableAccounting", label: "Enable Accounting" },
      { name: "EnableReports", label: "Enable Reports" },
    ],
  },
  {
    features: [
      { name: "EnableAPI", label: "Enable API" },
      { name: "EnableCustomBranding", label: "Enable Custom Branding" },
      { name: "EnableAdvancedReports", label: "Enable Advanced Reports" },
      { name: "EnableMultiCurrency", label: "Enable Multi-Currency" },
    ],
  },
];

const Subscription = () => {
  const navigate = useNavigate();
  const { createSubscriptionPlan, error, clearError, isLoading } =
    useSuperAdmin();
  const [formData, setFormData] = useState(initialPlanState);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) clearError();
  }, [formData, error, clearError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, PlanType: value }));
    if (formErrors.PlanType) {
      setFormErrors((prev) => ({ ...prev, PlanType: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.Name.trim())
      errors.Name = { message: "Plan name is required" };
    if (!formData.Description.trim())
      errors.Description = { message: "Description is required" };
    if (formData.MonthlyPrice < 0)
      errors.MonthlyPrice = { message: "Monthly price cannot be negative" };
    if (formData.YearlyPrice < 0)
      errors.YearlyPrice = { message: "Yearly price cannot be negative" };
    if (formData.MaxUsers < 0)
      errors.MaxUsers = { message: "Max users cannot be negative" };
    if (formData.MaxEmployees < 0)
      errors.MaxEmployees = { message: "Max employees cannot be negative" };
    if (formData.MaxProducts < 0)
      errors.MaxProducts = { message: "Max products cannot be negative" };
    if (formData.MaxWarehouses < 0)
      errors.MaxWarehouses = { message: "Max warehouses cannot be negative" };
    if (formData.StorageLimitGB < 0)
      errors.StorageLimitGB = { message: "Storage limit cannot be negative" };
    if (formData.SortOrder < 0)
      errors.SortOrder = { message: "Sort order cannot be negative" };

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await createSubscriptionPlan(formData);
      setSuccessMessage(response.message || "Plan created successfully");
      setFormData(initialPlanState);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setFormErrors({
        general: { message: err.message || "Failed to create plan" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setSuccessMessage("Subscriptions refreshed successfully!");
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(""), 5000);
    }, 800);
  };

  const handleBack = () => {
    navigate("/superadmin/subscriptions");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Subscriptions
          </button>

          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <CreditCard className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create Subscription Plan
              </h1>
              <p className="text-gray-600">
                Create a new subscription plan with custom features
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage("")}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {(error || formErrors.general) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={18} />
              <span>{error || formErrors.general?.message}</span>
              <button
                onClick={() => {
                  clearError();
                  setFormErrors((prev) => ({ ...prev, general: "" }));
                }}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Plan Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCard className="mr-2 text-blue-600" size={20} />
                Plan Details
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="Name"
                  label="Plan Name *"
                  type="text"
                  placeholder="Enter plan name"
                  value={formData.Name}
                  onChange={handleChange}
                  errors={formErrors}
                />
                <SelectBox
                  name="PlanType"
                  label="Plan Type *"
                  placeholder="Select a plan type"
                  value={formData.PlanType}
                  handleChange={handleSelectChange}
                  optionList={planTypes}
                  errors={formErrors}
                  width="w-full"
                />
              </div>
              <InputField
                name="Description"
                label="Description *"
                type="textarea"
                placeholder="Enter plan description"
                value={formData.Description}
                onChange={handleChange}
                errors={formErrors}
                rows={3}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="MonthlyPrice"
                  label="Monthly Price ($) *"
                  type="number"
                  placeholder="Enter monthly price"
                  value={formData.MonthlyPrice}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                  step="0.01"
                />
                <InputField
                  name="YearlyPrice"
                  label="Yearly Price ($) *"
                  type="number"
                  placeholder="Enter yearly price"
                  value={formData.YearlyPrice}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Limits Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCard className="mr-2 text-blue-600" size={20} />
                Plan Limits
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  name="MaxUsers"
                  label="Max Users *"
                  type="number"
                  placeholder="Enter max users"
                  value={formData.MaxUsers}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="MaxEmployees"
                  label="Max Employees *"
                  type="number"
                  placeholder="Enter max employees"
                  value={formData.MaxEmployees}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="MaxProducts"
                  label="Max Products *"
                  type="number"
                  placeholder="Enter max products"
                  value={formData.MaxProducts}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="MaxWarehouses"
                  label="Max Warehouses *"
                  type="number"
                  placeholder="Enter max warehouses"
                  value={formData.MaxWarehouses}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="StorageLimitGB"
                  label="Storage Limit (GB) *"
                  type="number"
                  placeholder="Enter storage limit"
                  value={formData.StorageLimitGB}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="SortOrder"
                  label="Sort Order *"
                  type="number"
                  placeholder="Enter sort order"
                  value={formData.SortOrder}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
              </div>
            </div>
          </div>
          {/* Features Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCard className="mr-2 text-blue-600" size={20} />
                Features
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureGroups.map((group, index) => (
                  <div key={index} className="space-y-4">
                    {group.features.map((feature) => (
                      <CheckboxField
                        key={feature.name}
                        name={feature.name}
                        label={feature.label}
                        checked={formData[feature.name]}
                        onChange={handleChange}
                        errors={formErrors}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <CheckboxField
                  name="IsActive"
                  label="Is Active"
                  checked={formData.IsActive}
                  onChange={handleChange}
                  errors={formErrors}
                />
                <CheckboxField
                  name="IsPopular"
                  label="Is Popular (Featured)"
                  checked={formData.IsPopular}
                  onChange={handleChange}
                  errors={formErrors}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between space-x-4 pt-6">
            <FilledButton
              buttonText="Refresh Subscriptions"
              isIcon={true}
              icon={RefreshCw}
              isIconLeft={true}
              iconSize="w-5 h-5"
              bgColor="bg-white"
              textColor="text-gray-700"
              rounded="rounded-lg"
              height="h-auto"
              width="w-auto"
              fontWeight="font-medium"
              fontSize="text-base"
              type="button"
              onClick={handleRefresh}
              px="px-6 py-3"
              disabled={isSubmitting || isLoading}
            />
            <div className="flex space-x-4">
              <FilledButton
                buttonText="Cancel"
                bgColor="bg-white"
                textColor="text-gray-700"
                rounded="rounded-lg"
                height="h-auto"
                width="w-auto"
                fontWeight="font-medium"
                fontSize="text-base"
                type="button"
                onClick={handleBack}
                px="px-6 py-3"
                disabled={isSubmitting || isLoading}
              />
              <FilledButton
                isIcon={true}
                icon={Plus}
                isIconLeft={true}
                iconSize="w-5 h-5"
                buttonText={isSubmitting ? "Creating Plan..." : "Create Plan"}
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                height="h-auto"
                width="w-auto"
                fontWeight="font-medium"
                fontSize="text-base"
                type="submit"
                onClick={() => {}}
                px="px-6 py-3"
                disabled={isSubmitting || isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Subscription;
