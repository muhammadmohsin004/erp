import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Building,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Lock,
  AlertCircle,
  User,
  MapPin,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { useSuperAdmin } from "../../../Contexts/superAdminApiClient/superAdminApiClient";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import addCompanyTranslations from "../../../translations/AddCompanytranslation";


const AddCompany = () => {
  const navigate = useNavigate();
  const { language: currentLanguage } = useSelector((state) => state.language);
  const isArabic = currentLanguage === "ar";
  const t = addCompanyTranslations[currentLanguage] || addCompanyTranslations.en;

  const {
    createCompany,
    getSubscriptionPlans,
    subscriptionPlans,
    isLoading,
    error,
    clearError,
  } = useSuperAdmin();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    website: "",
    taxNumber: "",
    subscriptionPlanId: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    SubscriptionPlan: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Load subscription plans on component mount
  useEffect(() => {
    getSubscriptionPlans();
  }, []);

  // Clear errors when user starts typing
  useEffect(() => {
    if (error) clearError();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.name.trim())
      errors.name = { message: t.validation.companyNameRequired };
    if (!formData.email.trim())
      errors.email = { message: t.validation.companyEmailRequired };
    if (!formData.address.trim())
      errors.address = { message: t.validation.addressRequired };
    if (!formData.city.trim()) 
      errors.city = { message: t.validation.cityRequired };
    if (!formData.state.trim())
      errors.state = { message: t.validation.stateRequired };
    if (!formData.country.trim())
      errors.country = { message: t.validation.countryRequired };
    if (!formData.adminFirstName.trim())
      errors.adminFirstName = { message: t.validation.adminFirstNameRequired };
    if (!formData.adminLastName.trim())
      errors.adminLastName = { message: t.validation.adminLastNameRequired };
    if (!formData.adminEmail.trim())
      errors.adminEmail = { message: t.validation.adminEmailRequired };
    if (!formData.adminPassword.trim())
      errors.adminPassword = { message: t.validation.adminPasswordRequired };
    if (!formData.subscriptionPlanId)
      errors.subscriptionPlanId = { message: t.validation.subscriptionPlanRequired };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = { message: t.validation.validEmail };
    }
    if (formData.adminEmail && !emailRegex.test(formData.adminEmail)) {
      errors.adminEmail = { message: t.validation.validAdminEmail };
    }

    // Password validation
    if (formData.adminPassword && formData.adminPassword.length < 8) {
      errors.adminPassword = { message: t.validation.passwordLength };
    }

    // Website validation
    if (formData.website && !formData.website.startsWith("http")) {
      errors.website = { message: t.validation.websiteFormat };
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    console.log("Form data before validation:", formData);
    console.log("SubscriptionPlanId:", formData.subscriptionPlanId);

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure subscriptionPlanId is a valid number
      const subscriptionPlanId = parseInt(formData.subscriptionPlanId);

      if (isNaN(subscriptionPlanId)) {
        setFormErrors((prev) => ({
          ...prev,
          subscriptionPlanId: {
            message: t.validation.validSubscriptionPlan,
          },
        }));
        setIsSubmitting(false);
        return;
      }

      // Prepare payload with API field names
      const payload = {
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone || null,
        Address: formData.address,
        City: formData.city,
        State: formData.state,
        Country: formData.country,
        Website: formData.website || null,
        TaxNumber: formData.taxNumber || null,
        SubscriptionPlanId: subscriptionPlanId,
        AdminFirstName: formData.adminFirstName,
        AdminLastName: formData.adminLastName,
        AdminEmail: formData.adminEmail,
        AdminPhone: formData.adminPhone || null,
        AdminPassword: formData.adminPassword,
        SubscriptionPlan: "plan",
      };

      console.log("Payload being sent:", payload);

      const result = await createCompany(payload);

      if (result) {
        // Success - navigate back to companies list
        navigate("/superadmin/companies");
      }
    } catch (err) {
      console.error("Error creating company:", err);
      // Don't reset the form on error, let user see their input
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/superadmin/companies");
  };

  const subscriptionPlansList = subscriptionPlans || [];

  // Prepare subscription plan options for SelectBox
  const subscriptionPlanOptions = subscriptionPlansList.map((plan) => ({
    label: `${plan.Name} - $${plan.MonthlyPrice}/month`,
    value: plan.Id.toString(), // Convert to string for consistency
  }));

  const handleSelectChange = (value) => {
    console.log("Select change:", value);
    setFormData((prev) => ({
      ...prev,
      subscriptionPlanId: value,
    }));

    // Clear field error when user makes selection
    if (formErrors.subscriptionPlanId) {
      setFormErrors((prev) => ({
        ...prev,
        subscriptionPlanId: "",
      }));
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className={`inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200 ${
              isArabic ? 'flex-row-reverse' : ''
            }`}
          >
            <ArrowLeft className={`${isArabic ? 'ml-2 rotate-180' : 'mr-2'}`} size={20} />
            {t.backToCompanies}
          </button>

          <div className={`flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-blue-100 rounded-lg p-3 ${isArabic ? 'ml-4' : 'mr-4'}`}>
              <Building className="text-blue-600" size={24} />
            </div>
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <h1 className="text-3xl font-bold text-gray-900">
                {t.addNewCompany}
              </h1>
              <p className="text-gray-600">
                {t.createCompanyDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className={`flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className={`${isArabic ? 'ml-2' : 'mr-2'}`} size={18} />
              <span>{error}</span>
              <button
                onClick={clearError}
                className={`${isArabic ? 'mr-auto' : 'ml-auto'} text-red-600 hover:text-red-800`}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className={`text-xl font-semibold text-gray-900 flex items-center ${
                isArabic ? 'flex-row-reverse' : ''
              }`}>
                <Building className={`text-blue-600 ${isArabic ? 'ml-2' : 'mr-2'}`} size={20} />
                {t.companyDetails}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <InputField
                  name="name"
                  label={`${t.companyName} *`}
                  type="text"
                  placeholder={t.placeholders.companyName}
                  value={formData.name}
                  onChange={handleChange}
                  errors={formErrors}
                />

                {/* Company Email */}
                <InputField
                  name="email"
                  label={`${t.companyEmail} *`}
                  type="email"
                  placeholder={t.placeholders.companyEmail}
                  value={formData.email}
                  onChange={handleChange}
                  errors={formErrors}
                  icon={Mail}
                />

                {/* Phone */}
                <InputField
                  name="phone"
                  label={t.phoneNumber}
                  type="tel"
                  placeholder={t.placeholders.phoneNumber}
                  value={formData.phone}
                  onChange={handleChange}
                  errors={formErrors}
                  icon={Phone}
                />

                {/* Website */}
                <InputField
                  name="website"
                  label={t.website}
                  type="url"
                  placeholder={t.placeholders.website}
                  value={formData.website}
                  onChange={handleChange}
                  errors={formErrors}
                  icon={Globe}
                />

                {/* Tax Number */}
                <div className="md:col-span-2">
                  <InputField
                    name="taxNumber"
                    label={t.taxNumber}
                    type="text"
                    placeholder={t.placeholders.taxNumber}
                    value={formData.taxNumber}
                    onChange={handleChange}
                    errors={formErrors}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className={`text-xl font-semibold text-gray-900 flex items-center ${
                isArabic ? 'flex-row-reverse' : ''
              }`}>
                <MapPin className={`text-blue-600 ${isArabic ? 'ml-2' : 'mr-2'}`} size={20} />
                {t.addressInformation}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Street Address */}
              <InputField
                name="address"
                label={`${t.streetAddress} *`}
                type="text"
                placeholder={t.placeholders.streetAddress}
                value={formData.address}
                onChange={handleChange}
                errors={formErrors}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* City */}
                <InputField
                  name="city"
                  label={`${t.city} *`}
                  type="text"
                  placeholder={t.placeholders.city}
                  value={formData.city}
                  onChange={handleChange}
                  errors={formErrors}
                />

                {/* State */}
                <InputField
                  name="state"
                  label={`${t.stateProvince} *`}
                  type="text"
                  placeholder={t.placeholders.stateProvince}
                  value={formData.state}
                  onChange={handleChange}
                  errors={formErrors}
                />

                {/* Country */}
                <InputField
                  name="country"
                  label={`${t.country} *`}
                  type="text"
                  placeholder={t.placeholders.country}
                  value={formData.country}
                  onChange={handleChange}
                  errors={formErrors}
                />
              </div>
            </div>
          </div>

          {/* Admin Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className={`text-xl font-semibold text-gray-900 flex items-center ${
                isArabic ? 'flex-row-reverse' : ''
              }`}>
                <User className={`text-blue-600 ${isArabic ? 'ml-2' : 'mr-2'}`} size={20} />
                {t.administratorAccount}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin First Name */}
                <InputField
                  name="adminFirstName"
                  label={`${t.firstName} *`}
                  type="text"
                  placeholder={t.placeholders.firstName}
                  value={formData.adminFirstName}
                  onChange={handleChange}
                  errors={formErrors}
                />

                {/* Admin Last Name */}
                <InputField
                  name="adminLastName"
                  label={`${t.lastName} *`}
                  type="text"
                  placeholder={t.placeholders.lastName}
                  value={formData.adminLastName}
                  onChange={handleChange}
                  errors={formErrors}
                />

                {/* Admin Email */}
                <InputField
                  name="adminEmail"
                  label={`${t.emailAddress} *`}
                  type="email"
                  placeholder={t.placeholders.adminEmail}
                  value={formData.adminEmail}
                  onChange={handleChange}
                  errors={formErrors}
                  icon={Mail}
                />

                {/* Admin Phone */}
                <InputField
                  name="adminPhone"
                  label={t.phoneNumber}
                  type="tel"
                  placeholder={t.placeholders.adminPhone}
                  value={formData.adminPhone}
                  onChange={handleChange}
                  errors={formErrors}
                  icon={Phone}
                />

                {/* Admin Password */}
                <div className="md:col-span-2">
                  <InputField
                    name="adminPassword"
                    label={`${t.password} *`}
                    type="password"
                    placeholder={t.placeholders.password}
                    value={formData.adminPassword}
                    onChange={handleChange}
                    errors={formErrors}
                    icon={Lock}
                    isVisible={isPasswordVisible}
                    setIsVisible={setIsPasswordVisible}
                  />
                  <p className={`mt-1 text-sm text-gray-600 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {t.passwordHint}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plan Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className={`text-xl font-semibold text-gray-900 flex items-center ${
                isArabic ? 'flex-row-reverse' : ''
              }`}>
                <CreditCard className={`text-blue-600 ${isArabic ? 'ml-2' : 'mr-2'}`} size={20} />
                {t.subscriptionPlan}
              </h2>
            </div>

            <div className="p-6">
              <div className="max-w-md">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className={`text-gray-600 ${isArabic ? 'mr-2' : 'ml-2'}`}>
                      {t.loadingPlans}
                    </span>
                  </div>
                ) : (
                  <SelectBox
                    name="subscriptionPlanId"
                    label={`${t.selectPlan} *`}
                    placeholder={t.selectSubscriptionPlan}
                    value={formData.subscriptionPlanId}
                    handleChange={handleSelectChange}
                    optionList={subscriptionPlanOptions}
                    errors={formErrors}
                    disabled={isLoading || isSubmitting}
                    width="w-full"
                  />
                )}

                {/* Debug information */}
                {!isLoading && subscriptionPlansList.length === 0 && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className={`text-sm text-yellow-800 ${isArabic ? 'text-right' : 'text-left'}`}>
                      {t.noPlansAvailable}
                    </p>
                  </div>
                )}

                {/* Show selected plan details */}
                {formData.subscriptionPlanId && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    {(() => {
                      const selectedPlan = subscriptionPlansList.find(
                        (plan) =>
                          plan.Id.toString() === formData.subscriptionPlanId
                      );
                      return selectedPlan ? (
                        <div className={isArabic ? 'text-right' : 'text-left'}>
                          <p className="text-sm font-medium text-blue-800">
                            {t.selected}: {selectedPlan.Name}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {selectedPlan.Description}
                          </p>
                          <p className="text-xs text-blue-600">
                            ${selectedPlan.MonthlyPrice}/month • {t.maxUsers}:{" "}
                            {selectedPlan.MaxUsers} • {t.maxProducts}:{" "}
                            {selectedPlan.MaxProducts}
                          </p>
                        </div>
                      ) : (
                        <p className={`text-sm text-red-600 ${isArabic ? 'text-right' : 'text-left'}`}>
                          {t.planNotFound}
                        </p>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={`flex justify-end space-x-4 pt-6 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
              disabled={isSubmitting}
            />

            <FilledButton
              isIcon={true}
              icon={Save}
              isIconLeft={true}
              iconSize="w-5 h-5"
              buttonText={
                isSubmitting ? t.creatingCompany : t.createCompany
              }
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
        </form>
      </div>
    </div>
  );
};

export default AddCompany;