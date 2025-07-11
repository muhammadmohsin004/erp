import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  ArrowDownCircle,
  DollarSign,
  FileText,
  Calendar,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { useFinance } from "../../Contexts/FinanceContext/FinanceContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const NewExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const { createExpense, updateExpense, expenseLoading } = useFinance();

  // Check if we're editing or cloning
  const editData = location.state?.editData;
  const cloneData = location.state?.cloneData;
  const isEditing = location.state?.isEditing || false;
  const isCloning = !!cloneData;

  const translations = {
    "Add Expense": language === "ar" ? "إضافة مصروف" : "Add Expense",
    "Edit Expense": language === "ar" ? "تعديل مصروف" : "Edit Expense",
    "Clone Expense": language === "ar" ? "نسخ مصروف" : "Clone Expense",
    Back: language === "ar" ? "رجوع" : "Back",
    Save: language === "ar" ? "حفظ" : "Save",
    "Save Changes": language === "ar" ? "حفظ التغييرات" : "Save Changes",
    "Basic Information": language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Financial Information": language === "ar" ? "المعلومات المالية" : "Financial Information",
    "Additional Information": language === "ar" ? "معلومات إضافية" : "Additional Information",
    "Recurring Settings": language === "ar" ? "إعدادات التكرار" : "Recurring Settings",
    Description: language === "ar" ? "الوصف" : "Description",
    "Code Number": language === "ar" ? "رقم الكود" : "Code Number",
    Amount: language === "ar" ? "المبلغ" : "Amount",
    Currency: language === "ar" ? "العملة" : "Currency",
    Date: language === "ar" ? "التاريخ" : "Date",
    "Vendor ID": language === "ar" ? "معرف البائع" : "Vendor ID",
    "Category ID": language === "ar" ? "معرف الفئة" : "Category ID",
    "Journal Account ID": language === "ar" ? "معرف حساب اليومية" : "Journal Account ID",
    "Supplier ID": language === "ar" ? "معرف المورد" : "Supplier ID",
    "Is Recurring": language === "ar" ? "متكرر" : "Is Recurring",
    "Recurring Frequency": language === "ar" ? "تكرار التكرار" : "Recurring Frequency",
    "Recurring End Date": language === "ar" ? "تاريخ انتهاء التكرار" : "Recurring End Date",
    "Attachment": language === "ar" ? "المرفق" : "Attachment",
    "Enter description": language === "ar" ? "أدخل الوصف" : "Enter description",
    "Enter code number": language === "ar" ? "أدخل رقم الكود" : "Enter code number",
    "Enter amount": language === "ar" ? "أدخل المبلغ" : "Enter amount",
    "Select date": language === "ar" ? "اختر التاريخ" : "Select date",
    "Select currency": language === "ar" ? "اختر العملة" : "Select currency",
    "Enter vendor ID": language === "ar" ? "أدخل معرف البائع" : "Enter vendor ID",
    "Enter category ID": language === "ar" ? "أدخل معرف الفئة" : "Enter category ID",
    "Enter journal account ID": language === "ar" ? "أدخل معرف حساب اليومية" : "Enter journal account ID",
    "Enter supplier ID": language === "ar" ? "أدخل معرف المورد" : "Enter supplier ID",
    "Select frequency": language === "ar" ? "اختر التكرار" : "Select frequency",
    "Select end date": language === "ar" ? "اختر تاريخ الانتهاء" : "Select end date",
    "Upload file": language === "ar" ? "رفع ملف" : "Upload file",
    "Description is required": language === "ar" ? "الوصف مطلوب" : "Description is required",
    "Amount is required": language === "ar" ? "المبلغ مطلوب" : "Amount is required",
    "Invalid amount format": language === "ar" ? "تنسيق المبلغ غير صحيح" : "Invalid amount format",
    "Date is required": language === "ar" ? "التاريخ مطلوب" : "Date is required",
    "Expense created successfully": language === "ar" ? "تم إنشاء المصروف بنجاح" : "Expense created successfully",
    "Expense updated successfully": language === "ar" ? "تم تحديث المصروف بنجاح" : "Expense updated successfully",
    "Failed to create expense": language === "ar" ? "فشل في إنشاء المصروف" : "Failed to create expense",
    "Failed to update expense": language === "ar" ? "فشل في تحديث المصروف" : "Failed to update expense",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    Daily: language === "ar" ? "يومي" : "Daily",
    Weekly: language === "ar" ? "أسبوعي" : "Weekly",
    Monthly: language === "ar" ? "شهري" : "Monthly",
    Quarterly: language === "ar" ? "ربع سنوي" : "Quarterly",
    Yearly: language === "ar" ? "سنوي" : "Yearly",
    PKR: "PKR",
    USD: "USD",
    EUR: "EUR",
    "File uploaded": language === "ar" ? "تم رفع الملف" : "File uploaded",
    "Remove file": language === "ar" ? "إزالة الملف" : "Remove file",
    "Expense Category": language === "ar" ? "فئة المصروف" : "Expense Category",
    "Office Supplies": language === "ar" ? "مستلزمات المكتب" : "Office Supplies",
    "Travel & Transportation": language === "ar" ? "السفر والنقل" : "Travel & Transportation",
    "Marketing & Advertising": language === "ar" ? "التسويق والإعلان" : "Marketing & Advertising",
    "Utilities": language === "ar" ? "المرافق" : "Utilities",
    "Rent": language === "ar" ? "الإيجار" : "Rent",
    "Professional Services": language === "ar" ? "الخدمات المهنية" : "Professional Services",
    "Equipment": language === "ar" ? "المعدات" : "Equipment",
    "Software & Subscriptions": language === "ar" ? "البرمجيات والاشتراكات" : "Software & Subscriptions",
    "Meals & Entertainment": language === "ar" ? "الوجبات والترفيه" : "Meals & Entertainment",
    "Other": language === "ar" ? "أخرى" : "Other",
  };

  // Form state
  const [formData, setFormData] = useState({
    Amount: "",
    Currency: "PKR",
    Description: "",
    CodeNumber: "",
    Date: new Date().toISOString().split('T')[0],
    VendorId: "",
    CategoryId: "",
    JournalAccountId: "",
    SupplierId: "",
    IsRecurring: false,
    RecurringFrequency: "",
    RecurringEndDate: "",
    AttachmentPath: "",
    IsExpense: true, // This field indicates it's an expense
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [expenseCategory, setExpenseCategory] = useState("");

  // Initialize form data
  useEffect(() => {
    if (editData && isEditing) {
      setFormData({
        Amount: editData.Amount || "",
        Currency: editData.Currency || "PKR",
        Description: editData.Description || "",
        CodeNumber: editData.CodeNumber || "",
        Date: editData.Date ? editData.Date.split('T')[0] : new Date().toISOString().split('T')[0],
        VendorId: editData.VendorId || "",
        CategoryId: editData.CategoryId || "",
        JournalAccountId: editData.JournalAccountId || "",
        SupplierId: editData.SupplierId || "",
        IsRecurring: editData.IsRecurring || false,
        RecurringFrequency: editData.RecurringFrequency || "",
        RecurringEndDate: editData.RecurringEndDate ? editData.RecurringEndDate.split('T')[0] : "",
        AttachmentPath: editData.AttachmentPath || "",
        IsExpense: true,
      });
    } else if (cloneData && isCloning) {
      setFormData({
        Amount: cloneData.Amount || "",
        Currency: cloneData.Currency || "PKR",
        Description: cloneData.Description || "",
        CodeNumber: "", // Reset code number for clone
        Date: new Date().toISOString().split('T')[0], // Use current date for clone
        VendorId: cloneData.VendorId || "",
        CategoryId: cloneData.CategoryId || "",
        JournalAccountId: cloneData.JournalAccountId || "",
        SupplierId: cloneData.SupplierId || "",
        IsRecurring: cloneData.IsRecurring || false,
        RecurringFrequency: cloneData.RecurringFrequency || "",
        RecurringEndDate: cloneData.RecurringEndDate ? cloneData.RecurringEndDate.split('T')[0] : "",
        AttachmentPath: "", // Reset attachment for clone
        IsExpense: true,
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

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // For now, we'll just store the file name
      setUploadedFile(file);
      setFormData(prev => ({
        ...prev,
        AttachmentPath: `/uploads/expense/${file.name}`
      }));
    }
  };

  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({
      ...prev,
      AttachmentPath: ""
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.Description.trim()) {
      newErrors.Description = translations["Description is required"];
    }

    if (!formData.Amount || formData.Amount.trim() === "") {
      newErrors.Amount = translations["Amount is required"];
    } else {
      const amount = parseFloat(formData.Amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.Amount = translations["Invalid amount format"];
      }
    }

    if (!formData.Date) {
      newErrors.Date = translations["Date is required"];
    }

    // Validate recurring settings
    if (formData.IsRecurring) {
      if (!formData.RecurringFrequency) {
        newErrors.RecurringFrequency = "Recurring frequency is required";
      }
      if (!formData.RecurringEndDate) {
        newErrors.RecurringEndDate = "Recurring end date is required";
      }
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
      
      // Prepare form data for API
      const apiData = {
        ...formData,
        Amount: parseFloat(formData.Amount),
        VendorId: formData.VendorId ? parseInt(formData.VendorId) : null,
        CategoryId: formData.CategoryId ? parseInt(formData.CategoryId) : null,
        JournalAccountId: formData.JournalAccountId ? parseInt(formData.JournalAccountId) : null,
        SupplierId: formData.SupplierId ? parseInt(formData.SupplierId) : null,
        Date: new Date(formData.Date).toISOString(),
        RecurringEndDate: formData.RecurringEndDate ? new Date(formData.RecurringEndDate).toISOString() : null,
      };
      
      if (isEditing && editData) {
        // Update existing expense
        result = await updateExpense(editData.Id, apiData);
        if (result) {
          alert(translations["Expense updated successfully"]);
          navigate("/admin/finance/expenses");
        } else {
          alert(translations["Failed to update expense"]);
        }
      } else {
        // Create new expense
        result = await createExpense(apiData);
        if (result) {
          alert(translations["Expense created successfully"]);
          navigate("/admin/finance/expenses");
        } else {
          alert(translations["Failed to create expense"]);
        }
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert(isEditing ? translations["Failed to update expense"] : translations["Failed to create expense"]);
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
    if (isEditing) return translations["Edit Expense"];
    if (isCloning) return translations["Clone Expense"];
    return translations["Add Expense"];
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
              onClick={() => navigate("/admin/finance/expenses")}
            />
            <h1 className="text-2xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
          </Container>
          <FilledButton
            isIcon={true}
            icon={Save}
            iconSize="w-4 h-4"
            bgColor="bg-red-600 hover:bg-red-700"
            textColor="text-white"
            rounded="rounded-lg"
            buttonText={getSaveButtonText()}
            height="h-10"
            px="px-4"
            fontWeight="font-medium"
            fontSize="text-sm"
            isIconLeft={true}
            onClick={handleSubmit}
            disabled={isSubmitting || expenseLoading}
          />
        </Container>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <ArrowDownCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Basic Information"]}
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <Container className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Description} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => handleInputChange("Description", e.target.value)}
                  placeholder={translations["Enter description"]}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500 ${
                    errors.Description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.Description && (
                  <Span className="text-red-500 text-sm mt-1">{errors.Description}</Span>
                )}
              </Container>

              {/* Code Number */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Code Number"]}
                </label>
                <input
                  type="text"
                  value={formData.CodeNumber}
                  onChange={(e) => handleInputChange("CodeNumber", e.target.value)}
                  placeholder={translations["Enter code number"]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </Container>

              {/* Date */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Date} <span className="text-red-500">*</span>
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="date"
                    value={formData.Date}
                    onChange={(e) => handleInputChange("Date", e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500 ${
                      errors.Date ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </Container>
                {errors.Date && (
                  <Span className="text-red-500 text-sm mt-1">{errors.Date}</Span>
                )}
              </Container>

              {/* Expense Category */}
              <Container className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Expense Category"]}
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Category</option>
                  <option value="office-supplies">{translations["Office Supplies"]}</option>
                  <option value="travel">{translations["Travel & Transportation"]}</option>
                  <option value="marketing">{translations["Marketing & Advertising"]}</option>
                  <option value="utilities">{translations.Utilities}</option>
                  <option value="rent">{translations.Rent}</option>
                  <option value="professional">{translations["Professional Services"]}</option>
                  <option value="equipment">{translations.Equipment}</option>
                  <option value="software">{translations["Software & Subscriptions"]}</option>
                  <option value="meals">{translations["Meals & Entertainment"]}</option>
                  <option value="other">{translations.Other}</option>
                </select>
              </Container>
            </Container>
          </Container>

          {/* Financial Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Financial Information"]}
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Amount} <span className="text-red-500">*</span>
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-red-600" />
                  </Container>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.Amount}
                    onChange={(e) => handleInputChange("Amount", e.target.value)}
                    placeholder={translations["Enter amount"]}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500 ${
                      errors.Amount ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </Container>
                {errors.Amount && (
                  <Span className="text-red-500 text-sm mt-1">{errors.Amount}</Span>
                )}
              </Container>

              {/* Currency */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Currency}
                </label>
                <select
                  value={formData.Currency}
                  onChange={(e) => handleInputChange("Currency", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="PKR">{translations.PKR}</option>
                  <option value="USD">{translations.USD}</option>
                  <option value="EUR">{translations.EUR}</option>
                </select>
              </Container>
            </Container>
          </Container>

          {/* Additional Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Additional Information"]}
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Vendor ID */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Vendor ID"]}
                </label>
                <input
                  type="number"
                  value={formData.VendorId}
                  onChange={(e) => handleInputChange("VendorId", e.target.value)}
                  placeholder={translations["Enter vendor ID"]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </Container>

              {/* Category ID */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Category ID"]}
                </label>
                <input
                  type="number"
                  value={formData.CategoryId}
                  onChange={(e) => handleInputChange("CategoryId", e.target.value)}
                  placeholder={translations["Enter category ID"]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </Container>

              {/* Journal Account ID */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Journal Account ID"]}
                </label>
                <input
                  type="number"
                  value={formData.JournalAccountId}
                  onChange={(e) => handleInputChange("JournalAccountId", e.target.value)}
                  placeholder={translations["Enter journal account ID"]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </Container>

              {/* Supplier ID */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Supplier ID"]}
                </label>
                <input
                  type="number"
                  value={formData.SupplierId}
                  onChange={(e) => handleInputChange("SupplierId", e.target.value)}
                  placeholder={translations["Enter supplier ID"]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </Container>
            </Container>
          </Container>

          {/* Recurring Settings */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Recurring Settings"]}
              </h2>
            </Container>

            <Container className="space-y-4">
              {/* Is Recurring */}
              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.IsRecurring}
                    onChange={(e) => handleInputChange("IsRecurring", e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <Span className="ml-2 text-sm font-medium text-gray-700">
                    {translations["Is Recurring"]}
                  </Span>
                </label>
              </Container>

              {/* Recurring options - only show if recurring is enabled */}
              {formData.IsRecurring && (
                <Container className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  {/* Recurring Frequency */}
                  <Container>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Recurring Frequency"]}
                    </label>
                    <select
                      value={formData.RecurringFrequency}
                      onChange={(e) => handleInputChange("RecurringFrequency", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500 ${
                        errors.RecurringFrequency ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">{translations["Select frequency"]}</option>
                      <option value="Daily">{translations.Daily}</option>
                      <option value="Weekly">{translations.Weekly}</option>
                      <option value="Monthly">{translations.Monthly}</option>
                      <option value="Quarterly">{translations.Quarterly}</option>
                      <option value="Yearly">{translations.Yearly}</option>
                    </select>
                    {errors.RecurringFrequency && (
                      <Span className="text-red-500 text-sm mt-1">{errors.RecurringFrequency}</Span>
                    )}
                  </Container>

                  {/* Recurring End Date */}
                  <Container>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Recurring End Date"]}
                    </label>
                    <Container className="relative">
                      <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </Container>
                      <input
                        type="date"
                        value={formData.RecurringEndDate}
                        onChange={(e) => handleInputChange("RecurringEndDate", e.target.value)}
                        min={formData.Date} // End date should be after start date
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500 ${
                          errors.RecurringEndDate ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </Container>
                    {errors.RecurringEndDate && (
                      <Span className="text-red-500 text-sm mt-1">{errors.RecurringEndDate}</Span>
                    )}
                  </Container>
                </Container>
              )}
            </Container>
          </Container>

          {/* File Attachment */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations.Attachment}
              </h2>
            </Container>

            <Container className="space-y-4">
              {/* File Upload */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Upload file"]}
                </label>
                <Container className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <Container className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <Span className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </Span>
                      <Span className="text-xs text-gray-500">
                        PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, GIF up to 10MB
                      </Span>
                    </Container>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
                    />
                  </label>
                </Container>
              </Container>

              {/* Uploaded File Display */}
              {(uploadedFile || formData.AttachmentPath) && (
                <Container className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Container className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <Span className="text-sm text-red-800">
                      {uploadedFile ? uploadedFile.name : formData.AttachmentPath.split('/').pop()}
                    </Span>
                    <Span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                      {translations["File uploaded"]}
                    </Span>
                  </Container>
                  <FilledButton
                    isIcon={true}
                    icon={X}
                    iconSize="w-3 h-3"
                    bgColor="bg-red-100 hover:bg-red-200"
                    textColor="text-red-600"
                    rounded="rounded-md"
                    buttonText=""
                    height="h-6"
                    width="w-6"
                    onClick={removeFile}
                    title={translations["Remove file"]}
                  />
                </Container>
              )}
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
              onClick={() => navigate("/admin/finance/expenses")}
            />
            <FilledButton
              isIcon={true}
              icon={Save}
              iconSize="w-4 h-4"
              bgColor="bg-red-600 hover:bg-red-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={getSaveButtonText()}
              height="h-10"
              px="px-6"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              type="submit"
              disabled={isSubmitting || expenseLoading}
            />
          </Container>
        </form>
      </Container>
    </Container>
  );
};

export default NewExpense;