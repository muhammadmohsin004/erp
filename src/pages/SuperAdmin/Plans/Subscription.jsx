import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import subscriptionTranslations from "../../../translations/Subscriptiontranslation";

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

const Subscription = () => {
  const navigate = useNavigate();
  const { language: currentLanguage } = useSelector((state) => state.language);
  const { createSubscriptionPlan, error, clearError, isLoading } = useSuperAdmin();
  const [formData, setFormData] = useState(initialPlanState);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get translations based on current language
  const t = subscriptionTranslations[currentLanguage] || subscriptionTranslations.en;
  const isRTL = currentLanguage === "ar";

  // Dynamic plan types based on language
  const planTypes = [
    { label: t.basic, value: "Basic" },
    { label: t.standard, value: "Standard" },
    { label: t.premium, value: "Premium" },
    { label: t.enterprise, value: "Enterprise" },
  ];

  const featureGroups = [
    {
      features: [
        { name: "EnableInventory", label: t.enableInventory },
        { name: "EnableHR", label: t.enableHR },
        { name: "EnableAccounting", label: t.enableAccounting },
        { name: "EnableReports", label: t.enableReports },
      ],
    },
    {
      features: [
        { name: "EnableAPI", label: t.enableAPI },
        { name: "EnableCustomBranding", label: t.enableCustomBranding },
        { name: "EnableAdvancedReports", label: t.enableAdvancedReports },
        { name: "EnableMultiCurrency", label: t.enableMultiCurrency },
      ],
    },
  ];

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
      errors.Name = { message: t.planNameRequired };
    if (!formData.Description.trim())
      errors.Description = { message: t.descriptionRequired };
    if (formData.MonthlyPrice < 0)
      errors.MonthlyPrice = { message: t.monthlyPriceNegative };
    if (formData.YearlyPrice < 0)
      errors.YearlyPrice = { message: t.yearlyPriceNegative };
    if (formData.MaxUsers < 0)
      errors.MaxUsers = { message: t.maxUsersNegative };
    if (formData.MaxEmployees < 0)
      errors.MaxEmployees = { message: t.maxEmployeesNegative };
    if (formData.MaxProducts < 0)
      errors.MaxProducts = { message: t.maxProductsNegative };
    if (formData.MaxWarehouses < 0)
      errors.MaxWarehouses = { message: t.maxWarehousesNegative };
    if (formData.StorageLimitGB < 0)
      errors.StorageLimitGB = { message: t.storageLimitNegative };
    if (formData.SortOrder < 0)
      errors.SortOrder = { message: t.sortOrderNegative };

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
      setSuccessMessage(response.message || t.planCreatedSuccess);
      setFormData(initialPlanState);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setFormErrors({
        general: { message: err.message || t.failedToCreatePlan },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setSuccessMessage(t.subscriptionsRefreshed);
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(""), 5000);
    }, 800);
  };

  const handleBack = () => {
    navigate("/superadmin/subscriptions");
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className={`inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} size={20} />
            {t.backToSubscriptions}
          </button>

          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-blue-100 rounded-lg p-3 ${isRTL ? 'ml-4' : 'mr-4'}`}>
              <CreditCard className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t.createSubscriptionPlan}
              </h1>
              <p className="text-gray-600">
                {t.createSubscriptionPlanDesc}
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
                className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-green-600 hover:text-green-800`}
              >
                ×
              </button>
            </div>
          </div>
        )}
        {(error || formErrors.general) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertCircle className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={18} />
              <span>{error || formErrors.general?.message}</span>
              <button
                onClick={() => {
                  clearError();
                  setFormErrors((prev) => ({ ...prev, general: "" }));
                }}
                className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-red-600 hover:text-red-800`}
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
              <h2 className={`text-xl font-semibold text-gray-900 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CreditCard className={`${isRTL ? 'ml-2' : 'mr-2'} text-blue-600`} size={20} />
                {t.planDetails}
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="Name"
                  label={`${t.planName} *`}
                  type="text"
                  placeholder={t.planNamePlaceholder}
                  value={formData.Name}
                  onChange={handleChange}
                  errors={formErrors}
                />
                <SelectBox
                  name="PlanType"
                  label={`${t.planType} *`}
                  placeholder={t.planTypePlaceholder}
                  value={formData.PlanType}
                  handleChange={handleSelectChange}
                  optionList={planTypes}
                  errors={formErrors}
                  width="w-full"
                />
              </div>
              <InputField
                name="Description"
                label={`${t.description} *`}
                type="textarea"
                placeholder={t.descriptionPlaceholder}
                value={formData.Description}
                onChange={handleChange}
                errors={formErrors}
                rows={3}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="MonthlyPrice"
                  label={`${t.monthlyPrice} *`}
                  type="number"
                  placeholder={t.monthlyPricePlaceholder}
                  value={formData.MonthlyPrice}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                  step="0.01"
                />
                <InputField
                  name="YearlyPrice"
                  label={`${t.yearlyPrice} *`}
                  type="number"
                  placeholder={t.yearlyPricePlaceholder}
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
              <h2 className={`text-xl font-semibold text-gray-900 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CreditCard className={`${isRTL ? 'ml-2' : 'mr-2'} text-blue-600`} size={20} />
                {t.planLimits}
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  name="MaxUsers"
                  label={`${t.maxUsers} *`}
                  type="number"
                  placeholder={t.maxUsersPlaceholder}
                  value={formData.MaxUsers}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="MaxEmployees"
                  label={`${t.maxEmployees} *`}
                  type="number"
                  placeholder={t.maxEmployeesPlaceholder}
                  value={formData.MaxEmployees}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="MaxProducts"
                  label={`${t.maxProducts} *`}
                  type="number"
                  placeholder={t.maxProductsPlaceholder}
                  value={formData.MaxProducts}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="MaxWarehouses"
                  label={`${t.maxWarehouses} *`}
                  type="number"
                  placeholder={t.maxWarehousesPlaceholder}
                  value={formData.MaxWarehouses}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="StorageLimitGB"
                  label={`${t.storageLimit} *`}
                  type="number"
                  placeholder={t.storageLimitPlaceholder}
                  value={formData.StorageLimitGB}
                  onChange={handleChange}
                  errors={formErrors}
                  min="0"
                />
                <InputField
                  name="SortOrder"
                  label={`${t.sortOrder} *`}
                  type="number"
                  placeholder={t.sortOrderPlaceholder}
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
              <h2 className={`text-xl font-semibold text-gray-900 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CreditCard className={`${isRTL ? 'ml-2' : 'mr-2'} text-blue-600`} size={20} />
                {t.features}
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
                  label={t.isActive}
                  checked={formData.IsActive}
                  onChange={handleChange}
                  errors={formErrors}
                />
                <CheckboxField
                  name="IsPopular"
                  label={t.isPopular}
                  checked={formData.IsPopular}
                  onChange={handleChange}
                  errors={formErrors}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={`flex justify-between space-x-4 pt-6 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <FilledButton
              buttonText={t.refreshSubscriptions}
              isIcon={true}
              icon={RefreshCw}
              isIconLeft={!isRTL}
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
            <div className={`flex space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <FilledButton
                buttonText={t.cancel}
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
                isIconLeft={!isRTL}
                iconSize="w-5 h-5"
                buttonText={isSubmitting ? t.creatingPlan : t.createPlan}
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