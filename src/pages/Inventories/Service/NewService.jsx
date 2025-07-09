import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Layers,
  Code,
  DollarSign,
  FileText,
  Settings,
  Percent,
  Package,
} from "lucide-react";
import { useService } from "../../../Contexts/ServiceContext/ServiceContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const NewService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const { createService, updateService, loading } = useService();

  // Check if we're editing or cloning
  const editData = location.state?.editData;
  const cloneData = location.state?.cloneData;
  const isEditing = location.state?.isEditing || false;
  const isCloning = !!cloneData;

  const translations = {
    "Add Service": language === "ar" ? "إضافة خدمة" : "Add Service",
    "Edit Service": language === "ar" ? "تعديل خدمة" : "Edit Service",
    "Clone Service": language === "ar" ? "نسخ خدمة" : "Clone Service",
    Back: language === "ar" ? "رجوع" : "Back",
    Save: language === "ar" ? "حفظ" : "Save",
    "Save Changes": language === "ar" ? "حفظ التغييرات" : "Save Changes",
    "Basic Information": language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Pricing Information": language === "ar" ? "معلومات التسعير" : "Pricing Information",
    "Additional Information": language === "ar" ? "معلومات إضافية" : "Additional Information",
    "Service Name": language === "ar" ? "اسم الخدمة" : "Service Name",
    "Service Code": language === "ar" ? "كود الخدمة" : "Service Code",
    Description: language === "ar" ? "الوصف" : "Description",
    "Purchase Price": language === "ar" ? "سعر الشراء" : "Purchase Price",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    "Minimum Price": language === "ar" ? "الحد الأدنى للسعر" : "Minimum Price",
    Discount: language === "ar" ? "الخصم" : "Discount",
    "Discount Type": language === "ar" ? "نوع الخصم" : "Discount Type",
    "Internal Notes": language === "ar" ? "ملاحظات داخلية" : "Internal Notes",
    Status: language === "ar" ? "الحالة" : "Status",
    Active: language === "ar" ? "نشط" : "Active",
    Inactive: language === "ar" ? "غير نشط" : "Inactive",
    "Enter service name": language === "ar" ? "أدخل اسم الخدمة" : "Enter service name",
    "Enter service code": language === "ar" ? "أدخل كود الخدمة" : "Enter service code",
    "Enter description": language === "ar" ? "أدخل الوصف" : "Enter description",
    "Enter purchase price": language === "ar" ? "أدخل سعر الشراء" : "Enter purchase price",
    "Enter unit price": language === "ar" ? "أدخل سعر الوحدة" : "Enter unit price",
    "Enter minimum price": language === "ar" ? "أدخل الحد الأدنى للسعر" : "Enter minimum price",
    "Enter discount amount": language === "ar" ? "أدخل مبلغ الخصم" : "Enter discount amount",
    "Enter internal notes": language === "ar" ? "أدخل ملاحظات داخلية" : "Enter internal notes",
    "Name is required": language === "ar" ? "الاسم مطلوب" : "Name is required",
    "Invalid price format": language === "ar" ? "تنسيق السعر غير صحيح" : "Invalid price format",
    "Service created successfully": language === "ar" ? "تم إنشاء الخدمة بنجاح" : "Service created successfully",
    "Service updated successfully": language === "ar" ? "تم تحديث الخدمة بنجاح" : "Service updated successfully",
    "Failed to create service": language === "ar" ? "فشل في إنشاء الخدمة" : "Failed to create service",
    "Failed to update service": language === "ar" ? "فشل في تحديث الخدمة" : "Failed to update service",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    Percentage: language === "ar" ? "نسبة مئوية" : "Percentage",
    Fixed: language === "ar" ? "مبلغ ثابت" : "Fixed Amount",
    "Select discount type": language === "ar" ? "اختر نوع الخصم" : "Select discount type",
  };

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    ServiceCode: "",
    Description: "",
    PurchasePrice: "",
    UnitPrice: "",
    MinimumPrice: "",
    Discount: "",
    DiscountType: "",
    InternalNotes: "",
    Status: "Active",
    PriceListId: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (editData && isEditing) {
      setFormData({
        Name: editData.Name || "",
        ServiceCode: editData.ServiceCode || "",
        Description: editData.Description || "",
        PurchasePrice: editData.PurchasePrice || "",
        UnitPrice: editData.UnitPrice || "",
        MinimumPrice: editData.MinimumPrice || "",
        Discount: editData.Discount || "",
        DiscountType: editData.DiscountType || "",
        InternalNotes: editData.InternalNotes || "",
        Status: editData.Status || "Active",
        PriceListId: editData.PriceListId || null,
      });
    } else if (cloneData && isCloning) {
      setFormData({
        Name: cloneData.Name || "",
        ServiceCode: cloneData.ServiceCode || "",
        Description: cloneData.Description || "",
        PurchasePrice: cloneData.PurchasePrice || "",
        UnitPrice: cloneData.UnitPrice || "",
        MinimumPrice: cloneData.MinimumPrice || "",
        Discount: cloneData.Discount || "",
        DiscountType: cloneData.DiscountType || "",
        InternalNotes: cloneData.InternalNotes || "",
        Status: cloneData.Status || "Active",
        PriceListId: cloneData.PriceListId || null,
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
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

    // Price validation
    const priceFields = ['PurchasePrice', 'UnitPrice', 'MinimumPrice', 'Discount'];
    priceFields.forEach(field => {
      if (formData[field] && formData[field].trim()) {
        const value = parseFloat(formData[field]);
        if (isNaN(value) || value < 0) {
          newErrors[field] = translations["Invalid price format"];
        }
      }
    });

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
        // Update existing service
        result = await updateService(editData.Id, formData);
        if (result) {
          alert(translations["Service updated successfully"]);
          navigate("/admin/Services-Manager");
        } else {
          alert(translations["Failed to update service"]);
        }
      } else {
        // Create new service
        result = await createService(formData);
        if (result) {
          alert(translations["Service created successfully"]);
          navigate("/admin/Services-Manager");
        } else {
          alert(translations["Failed to create service"]);
        }
      }
    } catch (error) {
      console.error("Error submitting service:", error);
      alert(isEditing ? translations["Failed to update service"] : translations["Failed to create service"]);
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
    if (isEditing) return translations["Edit Service"];
    if (isCloning) return translations["Clone Service"];
    return translations["Add Service"];
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
              onClick={() => navigate("/admin/Services-Manager")}
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
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Basic Information"]}
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Name */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Service Name"]} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => handleInputChange("Name", e.target.value)}
                  placeholder={translations["Enter service name"]}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.Name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.Name && (
                  <Span className="text-red-500 text-sm mt-1">{errors.Name}</Span>
                )}
              </Container>

              {/* Service Code */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Service Code"]}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Code className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="text"
                    value={formData.ServiceCode}
                    onChange={(e) => handleInputChange("ServiceCode", e.target.value)}
                    placeholder={translations["Enter service code"]}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>
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

              {/* Description */}
              <Container className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Description}
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => handleInputChange("Description", e.target.value)}
                  placeholder={translations["Enter description"]}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
            </Container>
          </Container>

          {/* Pricing Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Pricing Information"]}
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Purchase Price */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Purchase Price"]}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.PurchasePrice}
                    onChange={(e) => handleInputChange("PurchasePrice", e.target.value)}
                    placeholder={translations["Enter purchase price"]}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.PurchasePrice ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </Container>
                {errors.PurchasePrice && (
                  <Span className="text-red-500 text-sm mt-1">{errors.PurchasePrice}</Span>
                )}
              </Container>

              {/* Unit Price */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Unit Price"]}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </Container>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.UnitPrice}
                    onChange={(e) => handleInputChange("UnitPrice", e.target.value)}
                    placeholder={translations["Enter unit price"]}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.UnitPrice ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </Container>
                {errors.UnitPrice && (
                  <Span className="text-red-500 text-sm mt-1">{errors.UnitPrice}</Span>
                )}
              </Container>

              {/* Minimum Price */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Minimum Price"]}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.MinimumPrice}
                    onChange={(e) => handleInputChange("MinimumPrice", e.target.value)}
                    placeholder={translations["Enter minimum price"]}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.MinimumPrice ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </Container>
                {errors.MinimumPrice && (
                  <Span className="text-red-500 text-sm mt-1">{errors.MinimumPrice}</Span>
                )}
              </Container>

              {/* Discount */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Discount}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Percent className="h-4 w-4 text-orange-600" />
                  </Container>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.Discount}
                    onChange={(e) => handleInputChange("Discount", e.target.value)}
                    placeholder={translations["Enter discount amount"]}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.Discount ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </Container>
                {errors.Discount && (
                  <Span className="text-red-500 text-sm mt-1">{errors.Discount}</Span>
                )}
              </Container>

              {/* Discount Type */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Discount Type"]}
                </label>
                <select
                  value={formData.DiscountType}
                  onChange={(e) => handleInputChange("DiscountType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{translations["Select discount type"]}</option>
                  <option value="Percentage">{translations.Percentage}</option>
                  <option value="Fixed">{translations.Fixed}</option>
                </select>
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
              {/* Internal Notes */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Internal Notes"]}
                </label>
                <textarea
                  value={formData.InternalNotes}
                  onChange={(e) => handleInputChange("InternalNotes", e.target.value)}
                  placeholder={translations["Enter internal notes"]}
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
              onClick={() => navigate("/admin/Services-Manager")}
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

export default NewService;