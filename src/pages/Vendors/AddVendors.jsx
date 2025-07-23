import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Globe,
  CreditCard,
  Calendar,
  Info,
  RefreshCw,
  Eye,
  Copy,
  X,
} from 'lucide-react';
import { useVendor } from '../../Contexts/VendorContext/VendorContext';
import FilledButton from '../../components/elements/elements/buttons/filledButton/FilledButton';
import OutlineButton from '../../components/elements/elements/buttons/outlineButton/OutlineButton';
import Container from '../../components/elements/container/Container';
import Span from '../../components/elements/span/Span';
import CustomAlert from '../../components/elements/Alert/CustomAlerts';
import InputField from '../../components/elements/inputField/InputField';
import SelectBox from '../../components/elements/selectBox/SelectBox';
import TextArea from '../../components/elements/textArea/TextArea';

const AddVendors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const translations = {
    "Add Vendor": language === "ar" ? "إضافة مورد" : "Add Vendor",
    "Edit Vendor": language === "ar" ? "تعديل مورد" : "Edit Vendor",
    "Clone Vendor": language === "ar" ? "نسخ مورد" : "Clone Vendor",
    "Vendors": language === "ar" ? "الموردين" : "Vendors",
    "Vendor Name": language === "ar" ? "اسم المورد" : "Vendor Name",
    "Contact Person": language === "ar" ? "الشخص المسؤول" : "Contact Person",
    "Email": language === "ar" ? "البريد الإلكتروني" : "Email",
    "Phone Number": language === "ar" ? "رقم الهاتف" : "Phone Number",
    "Address": language === "ar" ? "العنوان" : "Address",
    "City": language === "ar" ? "المدينة" : "City",
    "State": language === "ar" ? "الولاية" : "State",
    "Country": language === "ar" ? "الدولة" : "Country",
    "Postal Code": language === "ar" ? "الرمز البريدي" : "Postal Code",
    "Tax Number": language === "ar" ? "الرقم الضريبي" : "Tax Number",
    "Currency": language === "ar" ? "العملة" : "Currency",
    "Payment Terms": language === "ar" ? "شروط الدفع" : "Payment Terms",
    "Is Active": language === "ar" ? "نشط" : "Is Active",
    "Notes": language === "ar" ? "ملاحظات" : "Notes",
    "Save": language === "ar" ? "حفظ" : "Save",
    "Cancel": language === "ar" ? "إلغاء" : "Cancel",
    "Back to List": language === "ar" ? "العودة للقائمة" : "Back to List",
    "Basic Information": language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Address Information": language === "ar" ? "معلومات العنوان" : "Address Information",
    "Financial Information": language === "ar" ? "المعلومات المالية" : "Financial Information",
    "Status & Notes": language === "ar" ? "الحالة والملاحظات" : "Status & Notes",
    "Enter vendor name": language === "ar" ? "أدخل اسم المورد" : "Enter vendor name",
    "Enter contact person": language === "ar" ? "أدخل اسم الشخص المسؤول" : "Enter contact person",
    "Enter email": language === "ar" ? "أدخل البريد الإلكتروني" : "Enter email",
    "Enter phone number": language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number",
    "Enter address": language === "ar" ? "أدخل العنوان" : "Enter address",
    "Enter city": language === "ar" ? "أدخل المدينة" : "Enter city",
    "Enter state": language === "ar" ? "أدخل الولاية" : "Enter state",
    "Enter postal code": language === "ar" ? "أدخل الرمز البريدي" : "Enter postal code",
    "Enter tax number": language === "ar" ? "أدخل الرقم الضريبي" : "Enter tax number",
    "This field is required": language === "ar" ? "هذا الحقل مطلوب" : "This field is required",
    "Saving...": language === "ar" ? "جارٍ الحفظ..." : "Saving...",
    "Creating...": language === "ar" ? "جارٍ الإنشاء..." : "Creating...",
    "Updating...": language === "ar" ? "جارٍ التحديث..." : "Updating...",
    "Success": language === "ar" ? "نجاح" : "Success",
    "Error": language === "ar" ? "خطأ" : "Error",
    "Vendor created successfully": language === "ar" ? "تم إنشاء المورد بنجاح" : "Vendor created successfully",
    "Vendor updated successfully": language === "ar" ? "تم تحديث المورد بنجاح" : "Vendor updated successfully",
    "Failed to save vendor": language === "ar" ? "فشل في حفظ المورد" : "Failed to save vendor",
    "Please try again": language === "ar" ? "يرجى المحاولة مرة أخرى" : "Please try again",
  
    "Reset": language === "ar" ? "إعادة تعيين" : "Reset",
    "Active Vendor": language === "ar" ? "مورد نشط" : "Active Vendor",
    "Save & Continue": language === "ar" ? "حفظ والمتابعة" : "Save & Continue",
  };

  // Constants
  const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'PKR', label: 'PKR - Pakistani Rupee' },
  ];

  const COUNTRY_OPTIONS = [
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'AE', label: 'United Arab Emirates' },
  ];

  const PAYMENT_TERMS_OPTIONS = [
    { value: 'NET15', label: 'NET 15' },
    { value: 'NET30', label: 'NET 30' },
    { value: 'NET45', label: 'NET 45' },
    { value: 'NET60', label: 'NET 60' },
  ];

  // Get vendor context
  const { createVendor, updateVendor, loading, error, clearError } = useVendor();

  // Determine mode based on location state
  const { editData, isEditing } = location.state || {};

  const editFields = editData?.Vendor || {};
  

  
  console.log("editing vendor", editFields, isEditing)
 
  const isEditMode = isEditing && !!editFields;

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    ContactPerson: "",
    Email: "",
    Phone: "",
    Address: "",
    City: "",
    State: "",
    Country: "",
    PostalCode: "",
    TaxNumber: "",
    Currency: "USD",
    PaymentTerms: "",
    IsActive: true,
    Notes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({
    isVisible: false,
    type: "success",
    title: "",
    message: "",
  });

  // Alert functions
  const showAlert = (type, title, message) => {
    setAlert({
      isVisible: true,
      type,
      title,
      message,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  // Initialize form data based on mode
  useEffect(() => {
    if (isEditMode && editFields) {
      setFormData({
        Name: editFields.Name || "",
        ContactPerson: editFields.ContactPerson || "",
        Email: editFields.Email || "",
        Phone: editFields.Phone || "",
        Address: editFields.Address || "",
        City: editFields.City || "",
        State: editFields.State || "",
        Country: editFields.Country || "",
        PostalCode: editFields.PostalCode || "",
        TaxNumber: editFields.TaxNumber || "",
        Currency: editFields.Currency || "USD",
        PaymentTerms: editFields.PaymentTerms || "",
        IsActive: editFields.IsActive !== undefined ? editFields.IsActive : true,
        Notes: editFields.Notes || "",
      });
    } 
    // Clear any existing errors when mode changes
    if (clearError) {
      clearError();
    }
  }, [isEditMode, editFields, clearError]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle textarea changes
  const handleTextAreaChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.Name.trim()) {
      errors.Name = translations["This field is required"];
    }

    if (!formData.ContactPerson.trim()) {
      errors.ContactPerson = translations["This field is required"];
    }

    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      errors.Email = translations["Please enter a valid email address"];
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e, saveAndContinue = false) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert(
        "error",
        translations.Error,
        translations["Please fill in all required fields"]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isEditMode) {
        result = await updateVendor(editFields.Id, formData);
      } else {
        result = await createVendor(formData);
      }

      if (result) {
        // Show success alert
        const successMessage = isEditMode
          ? translations["Vendor updated successfully"]
          : translations["Vendor created successfully"];

        showAlert("success", translations.Success, successMessage);
        
        if (!saveAndContinue) {
          // Navigate back to list after a short delay to show the alert
          setTimeout(() => {
            navigate("/admin/vendors", {
              state: {
                message: successMessage,
                type: "success",
              },
            });
          }, 1500);
        } else if (isEditMode) {
          // For edit mode with save and continue, just show success
          setTimeout(hideAlert, 1500);
        } else {
          // For create mode with save and continue, navigate to edit page
          setTimeout(() => {
            navigate(`/admin/vendors`, {
              state: {
                isEditing: true,
                editFields: result,
              },
            });
          }, 1500);
        }
      } else {
        showAlert(
          "error",
          translations.Error,
          `${translations["Failed to save vendor"]}. ${translations["Please try again"]}`
        );
      }
      navigate('/admin/vendors')

    } catch (error) {
      console.error("Error saving vendor:", error);
      showAlert(
        "error",
        translations.Error,
        error.message || translations["Failed to save vendor"]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save and continue
  const handleSaveAndContinue = (e) => {
    handleSubmit(e, true);
    navigate('/admin/vendors')
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/admin/vendors");
  };

  // Handle reset form
  const handleResetForm = () => {
    if (window.confirm(translations["Are you sure you want to reset all fields?"])) {
      if (isEditMode && editFields) {
        setFormData({
          Name: editFields.Name || "",
          ContactPerson: editFields.ContactPerson || "",
          Email: editFields.Email || "",
          Phone: editFields.Phone || "",
          Address: editFields.Address || "",
          City: editFields.City || "",
          State: editFields.State || "",
          Country: editFields.Country || "",
          PostalCode: editFields.PostalCode || "",
          TaxNumber: editFields.TaxNumber || "",
          Currency: editFields.Currency || "USD",
          PaymentTerms: editFields.PaymentTerms || "",
          IsActive: editFields.IsActive !== undefined ? editFields.IsActive : true,
          Notes: editFields.Notes || "",
        });
      } else {
        setFormData({
          Name: "",
          ContactPerson: "",
          Email: "",
          Phone: "",
          Address: "",
          City: "",
          State: "",
          Country: "",
          PostalCode: "",
          TaxNumber: "",
          Currency: "USD",
          PaymentTerms: "",
          IsActive: true,
          Notes: "",
        });
      }
      setFormErrors({});
    }
  };

  // Handle view vendor
  const handleViewVendor = () => {
    if (isEditMode && editFields?.Id) {
      navigate(`/admin/vendors/${editFields.Id}`);
    }
  };

  // Get page title
  const getPageTitle = () => {
    if (isEditMode) return translations["Edit Vendor"];
   
    return translations["Add Vendor"];
  };

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">Loading...</Span>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Custom Alert */}
      <CustomAlert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        autoClose={true}
      />

      <Container className="px-6 py-6">
        {/* Header */}
        <Container className="flex items-center justify-between mb-6">
          <Container className="flex items-center gap-4">
            <FilledButton
              isIcon={true}
              icon={ArrowLeft}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText=""
              height="h-10"
              width="w-10"
              onClick={handleCancel}
            />
            <Container>
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle()}
               
              </h1>
              <Span className="text-sm text-gray-500">
                {translations["Vendors"]}
              </Span>
            </Container>
          </Container>
        </Container>

        {/* Error Display */}
        {error && (
          <Container className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Span className="text-red-800 text-sm">{error}</Span>
          </Container>
        )}

        {/* Form */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <Container className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <Container className="space-y-6">
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {translations["Basic Information"]}
                  </h3>

                  {/* Vendor Name */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Vendor Name"]} *
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      placeholder={translations["Enter vendor name"]}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.Name ? "border-red-300" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.Name && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.Name}
                      </Span>
                    )}
                  </Container>

                  {/* Contact Person */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Contact Person"]} *
                    </label>
                    <input
                      type="text"
                      name="ContactPerson"
                      value={formData.ContactPerson}
                      onChange={handleInputChange}
                      placeholder={translations["Enter contact person"]}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.ContactPerson ? "border-red-300" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.ContactPerson && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.ContactPerson}
                      </Span>
                    )}
                  </Container>

                  {/* Email */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Email"]}
                    </label>
                    <Container className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        placeholder={translations["Enter email"]}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.Email ? "border-red-300" : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                    </Container>
                    {formErrors.Email && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.Email}
                      </Span>
                    )}
                  </Container>

                  {/* Phone */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Phone Number"]}
                    </label>
                    <Container className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="Phone"
                        value={formData.Phone}
                        onChange={handleInputChange}
                        placeholder={translations["Enter phone number"]}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </Container>
                  </Container>
                </Container>
              </Container>

              {/* Address Information */}
              <Container className="space-y-6">
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {translations["Address Information"]}
                  </h3>

                  {/* Address */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Address"]}
                    </label>
                    <textarea
                      name="Address"
                      value={formData.Address}
                      onChange={(e) => handleTextAreaChange("Address", e.target.value)}
                      placeholder={translations["Enter address"]}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={isSubmitting}
                    />
                  </Container>

                  {/* City and State */}
                  <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Container>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["City"]}
                      </label>
                      <input
                        type="text"
                        name="City"
                        value={formData.City}
                        onChange={handleInputChange}
                        placeholder={translations["Enter city"]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </Container>
                    <Container>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["State"]}
                      </label>
                      <input
                        type="text"
                        name="State"
                        value={formData.State}
                        onChange={handleInputChange}
                        placeholder={translations["Enter state"]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </Container>
                  </Container>

                  {/* Country and Postal Code */}
                  <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Container>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["Country"]}
                      </label>
                      <SelectBox
                        name="Country"
                        value={formData.Country}
                        handleChange={(value) => handleSelectChange("Country", value)}
                        optionList={COUNTRY_OPTIONS}
                        placeholder={translations["Select country"]}
                        disabled={isSubmitting}
                      />
                    </Container>
                    <Container>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["Postal Code"]}
                      </label>
                      <input
                        type="text"
                        name="PostalCode"
                        value={formData.PostalCode}
                        onChange={handleInputChange}
                        placeholder={translations["Enter postal code"]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </Container>
                  </Container>
                </Container>
              </Container>

              {/* Financial Information */}
              <Container className="space-y-6">
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {translations["Financial Information"]}
                  </h3>

                  {/* Tax Number */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Tax Number"]}
                    </label>
                    <input
                      type="text"
                      name="TaxNumber"
                      value={formData.TaxNumber}
                      onChange={handleInputChange}
                      placeholder={translations["Enter tax number"]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={isSubmitting}
                    />
                  </Container>

                  {/* Currency */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Currency"]}
                    </label>
                    <SelectBox
                      name="Currency"
                      value={formData.Currency}
                      handleChange={(value) => handleSelectChange("Currency", value)}
                      optionList={CURRENCY_OPTIONS}
                      placeholder={translations["Select currency"]}
                      disabled={isSubmitting}
                    />
                  </Container>

                  {/* Payment Terms */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Payment Terms"]}
                    </label>
                    <SelectBox
                      name="PaymentTerms"
                      value={formData.PaymentTerms}
                      handleChange={(value) => handleSelectChange("PaymentTerms", value)}
                      optionList={PAYMENT_TERMS_OPTIONS}
                      placeholder={translations["Select payment terms"]}
                      disabled={isSubmitting}
                    />
                  </Container>
                </Container>
              </Container>

              {/* Status & Notes */}
              <Container className="space-y-6">
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    {translations["Status & Notes"]}
                  </h3>

                  {/* Is Active */}
                  <Container className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="IsActive"
                        checked={formData.IsActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                      <Span className="ml-2 text-sm text-gray-700">
                        {translations["Is Active"]}
                      </Span>
                    </label>
                    <Span className="text-xs text-gray-500 mt-1 block">
                      {translations["Inactive vendors won't appear in selections"]}
                    </Span>
                  </Container>

                  {/* Notes */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Notes"]}
                    </label>
                    <textarea
                      name="Notes"
                      value={formData.Notes}
                      onChange={(e) => handleTextAreaChange("Notes", e.target.value)}
                      placeholder={translations["Enter any additional notes"]}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={isSubmitting}
                    />
                  </Container>
                </Container>
              </Container>
            </Container>

            {/* Form Actions */}
            <Container className="mt-8 pt-6 border-t border-gray-200">
              <Container className="flex flex-col sm:flex-row gap-3 justify-end">
                <OutlineButton
                  buttonText={translations["Cancel"]}
                  onClick={handleCancel}
                  borderColor="border-gray-300"
                  borderWidth="border"
                  rounded="rounded-lg"
                  bgColor="bg-white hover:bg-gray-50"
                  textColor="text-gray-700"
                  height="h-11"
                  px="px-6"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  icon={X}
                  iconSize="w-4 h-4"
                  isIconLeft={true}
                  disabled={isSubmitting}
                />
                
                <OutlineButton
                  buttonText={translations["Reset"]}
                  onClick={handleResetForm}
                  borderColor="border-gray-300"
                  borderWidth="border"
                  rounded="rounded-lg"
                  bgColor="bg-white hover:bg-gray-50"
                  textColor="text-gray-700"
                  height="h-11"
                  px="px-6"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  icon={RefreshCw}
                  iconSize="w-4 h-4"
                  isIconLeft={true}
                  disabled={isSubmitting}
                />
                
                <FilledButton
                  isIcon={true}
                  icon={Save}
                  iconSize="w-4 h-4"
                  bgColor="bg-green-600 hover:bg-green-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={translations["Save & Continue"]}
                  height="h-11"
                  px="px-6"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={handleSaveAndContinue}
                  disabled={isSubmitting || loading}
                />
                
              </Container>
            </Container>
          </form>
        </Container>

        {/* Back to List Link */}
        <Container className="mt-6">
          <FilledButton
            isIcon={true}
            icon={ArrowLeft}
            iconSize="w-4 h-4"
            bgColor="bg-transparent hover:bg-gray-100"
            textColor="text-blue-600 hover:text-blue-700"
            rounded="rounded-lg"
            buttonText={translations["Back to List"]}
            height="h-10"
            px="px-4"
            fontWeight="font-medium"
            fontSize="text-sm"
            isIconLeft={true}
            onClick={handleCancel}
          />
        </Container>
      </Container>
    </Container>
  );
};

export default AddVendors;