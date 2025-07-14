import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Building,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Globe,
  Hash,
  Users,
} from "lucide-react";
import { useSupplier } from "../../../Contexts/SupplierContext/SupplierContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const NewSupplier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const { createSupplier, updateSupplier, loading } = useSupplier();

  // Check if we're editing or cloning
  const editData = location.state?.editData;
  const cloneData = location.state?.cloneData;
  const isEditing = location.state?.isEditing || false;
  const isCloning = !!cloneData;

  const translations = {
    "Add Supplier": language === "ar" ? "إضافة مورد" : "Add Supplier",
    "Edit Supplier": language === "ar" ? "تعديل مورد" : "Edit Supplier",
    "Clone Supplier": language === "ar" ? "نسخ مورد" : "Clone Supplier",
    Back: language === "ar" ? "رجوع" : "Back",
    Save: language === "ar" ? "حفظ" : "Save",
    "Save Changes": language === "ar" ? "حفظ التغييرات" : "Save Changes",
    "Basic Information":
      language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Contact Information":
      language === "ar" ? "معلومات الاتصال" : "Contact Information",
    "Address Information":
      language === "ar" ? "معلومات العنوان" : "Address Information",
    "Additional Information":
      language === "ar" ? "معلومات إضافية" : "Additional Information",
    "Supplier Name": language === "ar" ? "اسم المورد" : "Supplier Name",
    "Contact Person": language === "ar" ? "الشخص المسؤول" : "Contact Person",
    Email: language === "ar" ? "البريد الإلكتروني" : "Email",
    Phone: language === "ar" ? "الهاتف" : "Phone",
    Address: language === "ar" ? "العنوان" : "Address",
    City: language === "ar" ? "المدينة" : "City",
    State: language === "ar" ? "الولاية" : "State",
    Country: language === "ar" ? "البلد" : "Country",
    "Zip Code": language === "ar" ? "الرمز البريدي" : "Zip Code",
    "Tax ID": language === "ar" ? "الرقم الضريبي" : "Tax ID",
    Notes: language === "ar" ? "ملاحظات" : "Notes",
    Status: language === "ar" ? "الحالة" : "Status",
    Active: language === "ar" ? "نشط" : "Active",
    Inactive: language === "ar" ? "غير نشط" : "Inactive",
    "Enter supplier name":
      language === "ar" ? "أدخل اسم المورد" : "Enter supplier name",
    "Enter contact person name":
      language === "ar"
        ? "أدخل اسم الشخص المسؤول"
        : "Enter contact person name",
    "Enter email address":
      language === "ar" ? "أدخل البريد الإلكتروني" : "Enter email address",
    "Enter phone number":
      language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number",
    "Enter address": language === "ar" ? "أدخل العنوان" : "Enter address",
    "Enter city": language === "ar" ? "أدخل المدينة" : "Enter city",
    "Enter state": language === "ar" ? "أدخل الولاية" : "Enter state",
    "Enter country": language === "ar" ? "أدخل البلد" : "Enter country",
    "Enter zip code":
      language === "ar" ? "أدخل الرمز البريدي" : "Enter zip code",
    "Enter tax ID": language === "ar" ? "أدخل الرقم الضريبي" : "Enter tax ID",
    "Enter notes": language === "ar" ? "أدخل ملاحظات" : "Enter notes",
    "Name is required": language === "ar" ? "الاسم مطلوب" : "Name is required",
    "Invalid email format":
      language === "ar"
        ? "تنسيق البريد الإلكتروني غير صحيح"
        : "Invalid email format",
    "Supplier created successfully":
      language === "ar"
        ? "تم إنشاء المورد بنجاح"
        : "Supplier created successfully",
    "Supplier updated successfully":
      language === "ar"
        ? "تم تحديث المورد بنجاح"
        : "Supplier updated successfully",
    "Failed to create supplier":
      language === "ar" ? "فشل في إنشاء المورد" : "Failed to create supplier",
    "Failed to update supplier":
      language === "ar" ? "فشل في تحديث المورد" : "Failed to update supplier",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
  };

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
    ZipCode: "",
    TaxId: "",
    Notes: "",
    Status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (editData && isEditing) {
      setFormData({
        Name: editData.Name || "",
        ContactPerson: editData.ContactPerson || "",
        Email: editData.Email || "",
        Phone: editData.Phone || "",
        Address: editData.Address || "",
        City: editData.City || "",
        State: editData.State || "",
        Country: editData.Country || "",
        ZipCode: editData.ZipCode || "",
        TaxId: editData.TaxId || "",
        Notes: editData.Notes || "",
        Status: editData.Status || "Active",
      });
    } else if (cloneData && isCloning) {
      setFormData({
        Name: cloneData.Name || "",
        ContactPerson: cloneData.ContactPerson || "",
        Email: cloneData.Email || "",
        Phone: cloneData.Phone || "",
        Address: cloneData.Address || "",
        City: cloneData.City || "",
        State: cloneData.State || "",
        Country: cloneData.Country || "",
        ZipCode: cloneData.ZipCode || "",
        TaxId: cloneData.TaxId || "",
        Notes: cloneData.Notes || "",
        Status: cloneData.Status || "Active",
      });
    }
  }, [editData, cloneData, isEditing, isCloning]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.Name.trim()) {
      newErrors.Name = translations["Name is required"];
    }

    // Email validation
    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = translations["Invalid email format"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isEditing && editData) {
        // Update existing supplier
        result = await updateSupplier(editData.Id, formData);
        if (result) {
          alert(translations["Supplier updated successfully"]);
          navigate("/admin/Manage-Suppliers");
        } else {
          alert(translations["Failed to update supplier"]);
        }
      } else {
        // Create new supplier
        result = await createSupplier(formData);
        if (result) {
          alert(translations["Supplier created successfully"]);
          navigate("/admin/Manage-Suppliers");
        } else {
          alert(translations["Failed to create supplier"]);
        }
      }
    } catch (error) {
      console.error("Error submitting supplier:", error);
      alert(
        isEditing
          ? translations["Failed to update supplier"]
          : translations["Failed to create supplier"]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
      </Container>
    );
  }

  const getPageTitle = () => {
    if (isEditing) return translations["Edit Supplier"];
    if (isCloning) return translations["Clone Supplier"];
    return translations["Add Supplier"];
  };

  const getSaveButtonText = () => {
    if (isEditing) return translations["Save Changes"];
    return translations.Save;
  };

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
              onClick={() => navigate("/admin/suppliers")}
            />
            <h1 className="text-2xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
          </Container>
          <FilledButton
            isIcon={true}
            icon={Save}
            iconSize="w-4 h-4"
            bgColor="bg-blue-600 hover:bg-blue-700"
            textColor="text-white"
            rounded="rounded-lg"
            buttonText={getSaveButtonText()}
            height="h-10"
            px="px-4"
            fontWeight="font-medium"
            fontSize="text-sm"
            isIconLeft={true}
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
          />
        </Container>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Basic Information"]}
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supplier Name */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Supplier Name"]}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => handleInputChange("Name", e.target.value)}
                  placeholder={translations["Enter supplier name"]}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.Name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.Name && (
                  <Span className="text-red-500 text-sm mt-1">
                    {errors.Name}
                  </Span>
                )}
              </Container>

              {/* Status */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Status}
                </label>
                <select
                  value={formData.Status}
                  onChange={(e) => handleInputChange("Status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">{translations.Active}</option>
                  <option value="Inactive">{translations.Inactive}</option>
                </select>
              </Container>
            </Container>
          </Container>

          {/* Contact Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Contact Information"]}
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Person */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Contact Person"]}
                </label>
                <input
                  type="text"
                  value={formData.ContactPerson}
                  onChange={(e) =>
                    handleInputChange("ContactPerson", e.target.value)
                  }
                  placeholder={translations["Enter contact person name"]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>

              {/* Email */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Email}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="email"
                    value={formData.Email}
                    onChange={(e) => handleInputChange("Email", e.target.value)}
                    placeholder={translations["Enter email address"]}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.Email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </Container>
                {errors.Email && (
                  <Span className="text-red-500 text-sm mt-1">
                    {errors.Email}
                  </Span>
                )}
              </Container>

              {/* Phone */}
              <Container className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Phone}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="tel"
                    value={formData.Phone}
                    onChange={(e) => handleInputChange("Phone", e.target.value)}
                    placeholder={translations["Enter phone number"]}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>
              </Container>
            </Container>
          </Container>

          {/* Address Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Address Information"]}
              </h2>
            </Container>

            <Container className="space-y-4">
              {/* Address */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Address}
                </label>
                <textarea
                  value={formData.Address}
                  onChange={(e) => handleInputChange("Address", e.target.value)}
                  placeholder={translations["Enter address"]}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>

              <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* City */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.City}
                  </label>
                  <input
                    type="text"
                    value={formData.City}
                    onChange={(e) => handleInputChange("City", e.target.value)}
                    placeholder={translations["Enter city"]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>

                {/* State */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.State}
                  </label>
                  <input
                    type="text"
                    value={formData.State}
                    onChange={(e) => handleInputChange("State", e.target.value)}
                    placeholder={translations["Enter state"]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>

                {/* Zip Code */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Zip Code"]}
                  </label>
                  <input
                    type="text"
                    value={formData.ZipCode}
                    onChange={(e) =>
                      handleInputChange("ZipCode", e.target.value)
                    }
                    placeholder={translations["Enter zip code"]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>

                {/* Country */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Country}
                  </label>
                  <input
                    type="text"
                    value={formData.Country}
                    onChange={(e) =>
                      handleInputChange("Country", e.target.value)
                    }
                    placeholder={translations["Enter country"]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>
              </Container>
            </Container>
          </Container>

          {/* Additional Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Additional Information"]}
              </h2>
            </Container>

            <Container className="space-y-4">
              {/* Tax ID */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Tax ID"]}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="text"
                    value={formData.TaxId}
                    onChange={(e) => handleInputChange("TaxId", e.target.value)}
                    placeholder={translations["Enter tax ID"]}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>
              </Container>

              {/* Notes */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Notes}
                </label>
                <textarea
                  value={formData.Notes}
                  onChange={(e) => handleInputChange("Notes", e.target.value)}
                  placeholder={translations["Enter notes"]}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
            </Container>
          </Container>

          {/* Form Actions */}
          <Container className="flex justify-end gap-4 pt-6">
            <FilledButton
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Back}
              height="h-10"
              px="px-6"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={() => navigate("/admin/suppliers")}
            />
            <FilledButton
              isIcon={true}
              icon={Save}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={getSaveButtonText()}
              height="h-10"
              px="px-6"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              type="submit"
              disabled={isSubmitting || loading}
            />
          </Container>
        </form>
      </Container>
    </Container>
  );
};

export default NewSupplier;
