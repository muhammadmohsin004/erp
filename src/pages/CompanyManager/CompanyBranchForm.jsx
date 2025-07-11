import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Building,
  MapPin,
  Phone,
  Mail,
  Home,
  Globe,
  Hash,
} from "lucide-react";
import { useCompanyBranch } from "../../Contexts/CompanyBranchContext/CompanyBranchContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const CompanyBranchForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Add Branch": language === "ar" ? "إضافة فرع" : "Add Branch",
    "Edit Branch": language === "ar" ? "تعديل فرع" : "Edit Branch",
    "Clone Branch": language === "ar" ? "نسخ فرع" : "Clone Branch",
    "Company Branches": language === "ar" ? "فروع الشركة" : "Company Branches",
    "Branch Name": language === "ar" ? "اسم الفرع" : "Branch Name",
    Address: language === "ar" ? "العنوان" : "Address",
    City: language === "ar" ? "المدينة" : "City",
    State: language === "ar" ? "الولاية" : "State",
    Country: language === "ar" ? "الدولة" : "Country",
    "Zip Code": language === "ar" ? "الرمز البريدي" : "Zip Code",
    "Phone Number": language === "ar" ? "رقم الهاتف" : "Phone Number",
    "Head Office": language === "ar" ? "المكتب الرئيسي" : "Head Office",
    "Is Active": language === "ar" ? "نشط" : "Is Active",
    Save: language === "ar" ? "حفظ" : "Save",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Back to List": language === "ar" ? "العودة للقائمة" : "Back to List",
    "Basic Information": language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Contact Information": language === "ar" ? "معلومات الاتصال" : "Contact Information",
    "Settings": language === "ar" ? "الإعدادات" : "Settings",
    "Enter branch name": language === "ar" ? "أدخل اسم الفرع" : "Enter branch name",
    "Enter address": language === "ar" ? "أدخل العنوان" : "Enter address",
    "Enter city": language === "ar" ? "أدخل المدينة" : "Enter city",
    "Enter state": language === "ar" ? "أدخل الولاية" : "Enter state",
    "Enter country": language === "ar" ? "أدخل الدولة" : "Enter country",
    "Enter zip code": language === "ar" ? "أدخل الرمز البريدي" : "Enter zip code",
    "Enter phone number": language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number",
    "This field is required": language === "ar" ? "هذا الحقل مطلوب" : "This field is required",
    "Saving...": language === "ar" ? "جارٍ الحفظ..." : "Saving...",
    "Creating...": language === "ar" ? "جارٍ الإنشاء..." : "Creating...",
    "Updating...": language === "ar" ? "جارٍ التحديث..." : "Updating...",
    "Success": language === "ar" ? "نجح" : "Success",
    "Error": language === "ar" ? "خطأ" : "Error",
  };

  // Get branch context
  const {
    createBranch,
    updateBranch,
    loading,
    error,
    clearError,
  } = useCompanyBranch();

  // Determine mode based on location state
  const { editData, cloneData, isEditing } = location.state || {};
  const isCloning = !!cloneData;
  const isEditMode = isEditing && !!editData;

  // Form state
  const [formData, setFormData] = useState({
    BranchName: "",
    Address: "",
    City: "",
    State: "",
    Country: "",
    ZipCode: "",
    PhoneNumber: "",
    IsHeadOffice: false,
    IsActive: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);



  // Initialize form data based on mode
  useEffect(() => {
    console.log("useEffect triggered - isEditMode:", isEditMode, "isCloning:", isCloning);
    
    if (isEditMode && editData) {
      console.log("Setting edit data:", editData);
      setFormData({
        BranchName: editData.BranchName || "",
        Address: editData.Address || "",
        City: editData.City || "",
        State: editData.State || "",
        Country: editData.Country || "",
        ZipCode: editData.ZipCode || "",
        PhoneNumber: editData.PhoneNumber || "",
        IsHeadOffice: editData.IsHeadOffice || false,
        IsActive: editData.IsActive !== undefined ? editData.IsActive : true,
      });
    } else if (isCloning && cloneData) {
      console.log("Setting clone data:", cloneData);
      setFormData({
        BranchName: cloneData.BranchName || "",
        Address: cloneData.Address || "",
        City: cloneData.City || "",
        State: cloneData.State || "",
        Country: cloneData.Country || "",
        ZipCode: cloneData.ZipCode || "",
        PhoneNumber: cloneData.PhoneNumber || "",
        IsHeadOffice: cloneData.IsHeadOffice || false,
        IsActive: cloneData.IsActive !== undefined ? cloneData.IsActive : true,
      });
    }
    
    // Clear any existing errors when mode changes
    if (clearError) {
      clearError();
    }
  }, [isEditMode, editData, isCloning, cloneData, clearError]);

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
    
    console.log("Input change:", { name, value: fieldValue, type });

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    console.log("Validating form with data:", formData);
    const errors = {};

    if (!formData.BranchName.trim()) {
      errors.BranchName = translations["This field is required"];
    }

    if (!formData.Address.trim()) {
      errors.Address = translations["This field is required"];
    }

    if (!formData.City.trim()) {
      errors.City = translations["This field is required"];
    }

    if (!formData.Country.trim()) {
      errors.Country = translations["This field is required"];
    }

    console.log("Validation errors:", errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    console.log("handleSubmit called");
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Form data before validation:", formData);
    console.log("Is submitting:", isSubmitting);

    if (isSubmitting) {
      console.log("Already submitting, returning early");
      return;
    }

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsSubmitting(true);
    console.log("Starting submission...");

    try {
      let result;
      
      if (isEditMode) {
        console.log("Updating branch with ID:", editData.Id, "and data:", formData);
        result = await updateBranch(editData.Id, formData);
      } else {
        console.log("Creating new branch with data:", formData);
        result = await createBranch(formData);
      }

      console.log("API result:", result);

      if (result) {
        console.log("Success! Navigating back to list");
        // Success - navigate back to list
        navigate("/admin/company-branches", {
          state: {
            message: isEditMode 
              ? "Branch updated successfully" 
              : "Branch created successfully",
            type: "success"
          }
        });
      } else {
        console.log("No result returned from API");
        alert("Failed to save branch. Please try again.");
      }
    } catch (error) {
      console.error("Error saving branch:", error);
      alert(`Error: ${error.message || "Failed to save branch"}`);
    } finally {
      setIsSubmitting(false);
      console.log("Submission completed");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/admin/company-branches");
  };

  // Get page title
  const getPageTitle = () => {
    if (isEditMode) return translations["Edit Branch"];
    if (isCloning) return translations["Clone Branch"];
    return translations["Add Branch"];
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
                {translations["Company Branches"]}
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
                    <Building className="w-5 h-5" />
                    {translations["Basic Information"]}
                  </h3>
                  
                  {/* Branch Name */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Branch Name"]} *
                    </label>
                    <input
                      type="text"
                      name="BranchName"
                      value={formData.BranchName}
                      onChange={handleInputChange}
                      placeholder={translations["Enter branch name"]}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.BranchName ? "border-red-300" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.BranchName && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.BranchName}
                      </Span>
                    )}
                  </Container>

                  {/* Address */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.Address} *
                    </label>
                    <textarea
                      name="Address"
                      value={formData.Address}
                      onChange={handleInputChange}
                      placeholder={translations["Enter address"]}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.Address ? "border-red-300" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.Address && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.Address}
                      </Span>
                    )}
                  </Container>

                  {/* City */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.City} *
                    </label>
                    <Container className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="City"
                        value={formData.City}
                        onChange={handleInputChange}
                        placeholder={translations["Enter city"]}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.City ? "border-red-300" : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                    </Container>
                    {formErrors.City && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.City}
                      </Span>
                    )}
                  </Container>

                  {/* State */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.State}
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

                  {/* Country */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.Country} *
                    </label>
                    <Container className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="Country"
                        value={formData.Country}
                        onChange={handleInputChange}
                        placeholder={translations["Enter country"]}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.Country ? "border-red-300" : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                    </Container>
                    {formErrors.Country && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.Country}
                      </Span>
                    )}
                  </Container>
                </Container>
              </Container>

              {/* Contact Information & Settings */}
              <Container className="space-y-6">
                {/* Contact Information */}
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    {translations["Contact Information"]}
                  </h3>

                  {/* Zip Code */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Zip Code"]}
                    </label>
                    <Container className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="ZipCode"
                        value={formData.ZipCode}
                        onChange={handleInputChange}
                        placeholder={translations["Enter zip code"]}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </Container>
                  </Container>

                  {/* Phone Number */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Phone Number"]}
                    </label>
                    <Container className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="PhoneNumber"
                        value={formData.PhoneNumber}
                        onChange={handleInputChange}
                        placeholder={translations["Enter phone number"]}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </Container>
                  </Container>
                </Container>

                {/* Settings */}
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    {translations.Settings}
                  </h3>

                  {/* Is Head Office */}
                  <Container className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="IsHeadOffice"
                        checked={formData.IsHeadOffice}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                      <Span className="ml-2 text-sm text-gray-700">
                        {translations["Head Office"]}
                      </Span>
                    </label>
                    <Span className="text-xs text-gray-500 mt-1 block">
                      Mark this branch as the company's head office
                    </Span>
                  </Container>

                  {/* Is Active */}
                  <Container className="mb-4">
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
                      Active branches are available for operations
                    </Span>
                  </Container>
                </Container>

                {/* Additional Info for Edit Mode */}
                {isEditMode && editData && (
                  <Container className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Information</h4>
                    <Container className="text-xs text-gray-500 space-y-1">
                      <Container>
                        <strong>Created:</strong>{" "}
                        {editData.CreatedAt
                          ? new Date(editData.CreatedAt).toLocaleDateString()
                          : "N/A"}
                      </Container>
                      {editData.UpdatedAt && (
                        <Container>
                          <strong>Last Updated:</strong>{" "}
                          {new Date(editData.UpdatedAt).toLocaleDateString()}
                        </Container>
                      )}
                      <Container>
                        <strong>Branch ID:</strong> {editData.Id}
                      </Container>
                    </Container>
                  </Container>
                )}
              </Container>
            </Container>

            {/* Submit button inside form */}
            <Container className="mt-8 pt-6 border-t border-gray-200">
              <Container className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  {translations.Cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting 
                    ? (isEditMode ? translations["Updating..."] : translations["Creating..."])
                    : translations.Save
                  }
                </button>
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

export default CompanyBranchForm;