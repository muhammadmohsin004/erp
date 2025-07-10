import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Receipt,
  User,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Trash2,
  Calculator,
  Percent,
  Tags,
} from "lucide-react";
import { useInvoice } from "../../../Contexts/InvoiceContext/InvoiceContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const NewInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const { createInvoice, updateInvoice, createInvoiceItem, loading } = useInvoice();

  // Check if we're editing or cloning
  const editData = location.state?.editData;
  const cloneData = location.state?.cloneData;
  const isEditing = location.state?.isEditing || false;
  const isCloning = !!cloneData;

  const translations = {
    "Add Invoice": language === "ar" ? "إضافة فاتورة" : "Add Invoice",
    "Edit Invoice": language === "ar" ? "تعديل فاتورة" : "Edit Invoice",
    "Clone Invoice": language === "ar" ? "نسخ فاتورة" : "Clone Invoice",
    "Back": language === "ar" ? "رجوع" : "Back",
    "Save": language === "ar" ? "حفظ" : "Save",
    "Save Changes": language === "ar" ? "حفظ التغييرات" : "Save Changes",
    "Invoice Information": language === "ar" ? "معلومات الفاتورة" : "Invoice Information",
    "Customer Information": language === "ar" ? "معلومات العميل" : "Customer Information",
    "Invoice Items": language === "ar" ? "عناصر الفاتورة" : "Invoice Items",
    "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
    "Invoice Date": language === "ar" ? "تاريخ الفاتورة" : "Invoice Date",
    "Due Date": language === "ar" ? "تاريخ الاستحقاق" : "Due Date",
    "Customer Name": language === "ar" ? "اسم العميل" : "Customer Name",
    "Customer Email": language === "ar" ? "بريد العميل الإلكتروني" : "Customer Email",
    "Customer Phone": language === "ar" ? "هاتف العميل" : "Customer Phone",
    "Customer Address": language === "ar" ? "عنوان العميل" : "Customer Address",
    "Description": language === "ar" ? "الوصف" : "Description",
    "Notes": language === "ar" ? "ملاحظات" : "Notes",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Draft": language === "ar" ? "مسودة" : "Draft",
    "Sent": language === "ar" ? "مرسلة" : "Sent",
    "Paid": language === "ar" ? "مدفوعة" : "Paid",
    "Overdue": language === "ar" ? "متأخرة" : "Overdue",
    "Cancelled": language === "ar" ? "ملغاة" : "Cancelled",
    "Item Name": language === "ar" ? "اسم العنصر" : "Item Name",
    "Quantity": language === "ar" ? "الكمية" : "Quantity",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    "Tax Rate": language === "ar" ? "معدل الضريبة" : "Tax Rate",
    "Total": language === "ar" ? "المجموع" : "Total",
    "Add Item": language === "ar" ? "إضافة عنصر" : "Add Item",
    "Remove Item": language === "ar" ? "إزالة العنصر" : "Remove Item",
    "Sub Total": language === "ar" ? "المجموع الفرعي" : "Sub Total",
    "Tax Amount": language === "ar" ? "مبلغ الضريبة" : "Tax Amount",
    "Total Amount": language === "ar" ? "المبلغ الإجمالي" : "Total Amount",
    "Enter invoice number": language === "ar" ? "أدخل رقم الفاتورة" : "Enter invoice number",
    "Enter customer name": language === "ar" ? "أدخل اسم العميل" : "Enter customer name",
    "Enter customer email": language === "ar" ? "أدخل بريد العميل" : "Enter customer email",
    "Enter customer phone": language === "ar" ? "أدخل هاتف العميل" : "Enter customer phone",
    "Enter customer address": language === "ar" ? "أدخل عنوان العميل" : "Enter customer address",
    "Enter description": language === "ar" ? "أدخل الوصف" : "Enter description",
    "Enter notes": language === "ar" ? "أدخل الملاحظات" : "Enter notes",
    "Enter item name": language === "ar" ? "أدخل اسم العنصر" : "Enter item name",
    "Enter quantity": language === "ar" ? "أدخل الكمية" : "Enter quantity",
    "Enter unit price": language === "ar" ? "أدخل سعر الوحدة" : "Enter unit price",
    "Invoice number is required": language === "ar" ? "رقم الفاتورة مطلوب" : "Invoice number is required",
    "Customer name is required": language === "ar" ? "اسم العميل مطلوب" : "Customer name is required",
    "At least one item is required": language === "ar" ? "مطلوب عنصر واحد على الأقل" : "At least one item is required",
    "Invalid price format": language === "ar" ? "تنسيق السعر غير صحيح" : "Invalid price format",
    "Invalid quantity": language === "ar" ? "كمية غير صحيحة" : "Invalid quantity",
    "Invoice created successfully": language === "ar" ? "تم إنشاء الفاتورة بنجاح" : "Invoice created successfully",
    "Invoice updated successfully": language === "ar" ? "تم تحديث الفاتورة بنجاح" : "Invoice updated successfully",
    "Failed to create invoice": language === "ar" ? "فشل في إنشاء الفاتورة" : "Failed to create invoice",
    "Failed to update invoice": language === "ar" ? "فشل في تحديث الفاتورة" : "Failed to update invoice",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
  };

  // Form state
  const [formData, setFormData] = useState({
    InvoiceNumber: "",
    InvoiceDate: new Date().toISOString().split('T')[0],
    DueDate: "",
    CustomerName: "",
    CustomerEmail: "",
    CustomerPhone: "",
    CustomerAddress: "",
    Description: "",
    Notes: "",
    Status: "Draft",
    SubTotal: 0,
    TaxAmount: 0,
    TotalAmount: 0,
  });

  const [invoiceItems, setInvoiceItems] = useState([
    {
      id: Date.now(),
      ItemName: "",
      Quantity: 1,
      UnitPrice: 0,
      TaxRate: 0,
      LineTotal: 0,
    }
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (editData && isEditing) {
      setFormData({
        InvoiceNumber: editData.InvoiceNumber || "",
        InvoiceDate: editData.InvoiceDate ? editData.InvoiceDate.split('T')[0] : new Date().toISOString().split('T')[0],
        DueDate: editData.DueDate ? editData.DueDate.split('T')[0] : "",
        CustomerName: editData.CustomerName || "",
        CustomerEmail: editData.CustomerEmail || "",
        CustomerPhone: editData.CustomerPhone || "",
        CustomerAddress: editData.CustomerAddress || "",
        Description: editData.Description || "",
        Notes: editData.Notes || "",
        Status: editData.Status || "Draft",
        SubTotal: editData.SubTotal || 0,
        TaxAmount: editData.TaxAmount || 0,
        TotalAmount: editData.TotalAmount || 0,
      });
    } else if (cloneData && isCloning) {
      setFormData({
        InvoiceNumber: cloneData.InvoiceNumber || "",
        InvoiceDate: new Date().toISOString().split('T')[0],
        DueDate: cloneData.DueDate ? cloneData.DueDate.split('T')[0] : "",
        CustomerName: cloneData.CustomerName || "",
        CustomerEmail: cloneData.CustomerEmail || "",
        CustomerPhone: cloneData.CustomerPhone || "",
        CustomerAddress: cloneData.CustomerAddress || "",
        Description: cloneData.Description || "",
        Notes: cloneData.Notes || "",
        Status: "Draft",
        SubTotal: 0,
        TaxAmount: 0,
        TotalAmount: 0,
      });
    }
  }, [editData, cloneData, isEditing, isCloning]);

  // Calculate totals when items change
  useEffect(() => {
    calculateTotals();
  }, [invoiceItems]);

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

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Calculate line total
    if (field === 'Quantity' || field === 'UnitPrice') {
      const quantity = field === 'Quantity' ? parseFloat(value) || 0 : parseFloat(updatedItems[index].Quantity) || 0;
      const unitPrice = field === 'UnitPrice' ? parseFloat(value) || 0 : parseFloat(updatedItems[index].UnitPrice) || 0;
      updatedItems[index].LineTotal = quantity * unitPrice;
    }

    setInvoiceItems(updatedItems);
  };

  // Add new item
  const addItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        id: Date.now(),
        ItemName: "",
        Quantity: 1,
        UnitPrice: 0,
        TaxRate: 0,
        LineTotal: 0,
      }
    ]);
  };

  // Remove item
  const removeItem = (index) => {
    if (invoiceItems.length > 1) {
      const updatedItems = invoiceItems.filter((_, i) => i !== index);
      setInvoiceItems(updatedItems);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const subTotal = invoiceItems.reduce((sum, item) => {
      return sum + (parseFloat(item.LineTotal) || 0);
    }, 0);

    const taxAmount = invoiceItems.reduce((sum, item) => {
      const lineTotal = parseFloat(item.LineTotal) || 0;
      const taxRate = parseFloat(item.TaxRate) || 0;
      return sum + (lineTotal * taxRate / 100);
    }, 0);

    const totalAmount = subTotal + taxAmount;

    setFormData(prev => ({
      ...prev,
      SubTotal: subTotal,
      TaxAmount: taxAmount,
      TotalAmount: totalAmount,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.InvoiceNumber.trim()) {
      newErrors.InvoiceNumber = translations["Invoice number is required"];
    }

    if (!formData.CustomerName.trim()) {
      newErrors.CustomerName = translations["Customer name is required"];
    }

    // Validate items
    if (invoiceItems.length === 0 || invoiceItems.every(item => !item.ItemName.trim())) {
      newErrors.items = translations["At least one item is required"];
    }

    // Validate item data
    invoiceItems.forEach((item, index) => {
      if (item.ItemName.trim()) {
        const quantity = parseFloat(item.Quantity);
        const unitPrice = parseFloat(item.UnitPrice);
        const taxRate = parseFloat(item.TaxRate);

        if (isNaN(quantity) || quantity < 0) {
          newErrors[`item_${index}_quantity`] = translations["Invalid quantity"];
        }

        if (isNaN(unitPrice) || unitPrice < 0) {
          newErrors[`item_${index}_price`] = translations["Invalid price format"];
        }

        if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
          newErrors[`item_${index}_tax`] = "Invalid tax rate";
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
        // Update existing invoice
        result = await updateInvoice(editData.Id, formData);
        if (result) {
          alert(translations["Invoice updated successfully"]);
          navigate("/admin/invoices");
        } else {
          alert(translations["Failed to update invoice"]);
        }
      } else {
        // Create new invoice
        result = await createInvoice(formData);
        if (result) {
          // Create invoice items
          for (const item of invoiceItems) {
            if (item.ItemName.trim()) {
              await createInvoiceItem({
                InvoiceId: result.Id,
                ...item
              });
            }
          }
          
          alert(translations["Invoice created successfully"]);
          navigate("/admin/invoices");
        } else {
          alert(translations["Failed to create invoice"]);
        }
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert(isEditing ? translations["Failed to update invoice"] : translations["Failed to create invoice"]);
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
    if (isEditing) return translations["Edit Invoice"];
    if (isCloning) return translations["Clone Invoice"];
    return translations["Add Invoice"];
  };

  const getSaveButtonText = () => {
    if (isEditing) return translations["Save Changes"];
    return translations.Save;
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toFixed(2);
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
              onClick={() => navigate("/admin/invoices")}
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
          {/* Invoice Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Invoice Information"]}
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Invoice Number */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Invoice Number"]} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.InvoiceNumber}
                  onChange={(e) => handleInputChange("InvoiceNumber", e.target.value)}
                  placeholder={translations["Enter invoice number"]}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.InvoiceNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.InvoiceNumber && (
                  <Span className="text-red-500 text-sm mt-1">{errors.InvoiceNumber}</Span>
                )}
              </Container>

              {/* Invoice Date */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Invoice Date"]}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="date"
                    value={formData.InvoiceDate}
                    onChange={(e) => handleInputChange("InvoiceDate", e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>
              </Container>

              {/* Due Date */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Due Date"]}
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="date"
                    value={formData.DueDate}
                    onChange={(e) => handleInputChange("DueDate", e.target.value)}
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
                  <option value="Draft">{translations.Draft}</option>
                  <option value="Sent">{translations.Sent}</option>
                  <option value="Paid">{translations.Paid}</option>
                  <option value="Overdue">{translations.Overdue}</option>
                  <option value="Cancelled">{translations.Cancelled}</option>
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
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
            </Container>
          </Container>

          {/* Customer Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {translations["Customer Information"]}
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Name */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Customer Name"]} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.CustomerName}
                  onChange={(e) => handleInputChange("CustomerName", e.target.value)}
                  placeholder={translations["Enter customer name"]}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.CustomerName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.CustomerName && (
                  <Span className="text-red-500 text-sm mt-1">{errors.CustomerName}</Span>
                )}
              </Container>

              {/* Customer Email */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Customer Email"]}
                </label>
                <input
                  type="email"
                  value={formData.CustomerEmail}
                  onChange={(e) => handleInputChange("CustomerEmail", e.target.value)}
                  placeholder={translations["Enter customer email"]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>

              {/* Customer Phone */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Customer Phone"]}
                </label>
                <input
                  type="tel"
                  value={formData.CustomerPhone}
                  onChange={(e) => handleInputChange("CustomerPhone", e.target.value)}
                  placeholder={translations["Enter customer phone"]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>

              {/* Customer Address */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Customer Address"]}
                </label>
                <textarea
                  value={formData.CustomerAddress}
                  onChange={(e) => handleInputChange("CustomerAddress", e.target.value)}
                  placeholder={translations["Enter customer address"]}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
            </Container>
          </Container>

          {/* Invoice Items */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <Container className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {translations["Invoice Items"]}
                </h2>
              </Container>
              <FilledButton
                isIcon={true}
                icon={Plus}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={translations["Add Item"]}
                height="h-9"
                px="px-3"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={addItem}
              />
            </Container>

            {errors.items && (
              <Container className="mb-4">
                <Span className="text-red-500 text-sm">{errors.items}</Span>
              </Container>
            )}

            <Container className="space-y-4">
              {invoiceItems.map((item, index) => (
                <Container
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  {/* Item Name */}
                  <Container className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translations["Item Name"]}
                    </label>
                    <input
                      type="text"
                      value={item.ItemName}
                      onChange={(e) => handleItemChange(index, "ItemName", e.target.value)}
                      placeholder={translations["Enter item name"]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </Container>

                  {/* Quantity */}
                  <Container>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.Quantity}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.Quantity}
                      onChange={(e) => handleItemChange(index, "Quantity", e.target.value)}
                      placeholder={translations["Enter quantity"]}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`item_${index}_quantity`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`item_${index}_quantity`] && (
                      <Span className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</Span>
                    )}
                  </Container>

                  {/* Unit Price */}
                  <Container>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translations["Unit Price"]}
                    </label>
                    <Container className="relative">
                      <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                      </Container>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.UnitPrice}
                        onChange={(e) => handleItemChange(index, "UnitPrice", e.target.value)}
                        placeholder={translations["Enter unit price"]}
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`item_${index}_price`] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </Container>
                    {errors[`item_${index}_price`] && (
                      <Span className="text-red-500 text-xs mt-1">{errors[`item_${index}_price`]}</Span>
                    )}
                  </Container>

                  {/* Tax Rate */}
                  <Container>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translations["Tax Rate"]} (%)
                    </label>
                    <Container className="relative">
                      <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Percent className="h-3 w-3 text-gray-400" />
                      </Container>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.TaxRate}
                        onChange={(e) => handleItemChange(index, "TaxRate", e.target.value)}
                        placeholder="0.00"
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`item_${index}_tax`] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </Container>
                    {errors[`item_${index}_tax`] && (
                      <Span className="text-red-500 text-xs mt-1">{errors[`item_${index}_tax`]}</Span>
                    )}
                  </Container>

                  {/* Line Total & Remove Button */}
                  <Container className="flex items-end gap-2">
                    <Container className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translations.Total}
                      </label>
                      <Container className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                        <Span className="text-sm font-medium text-gray-900">
                          ${formatCurrency(item.LineTotal)}
                        </Span>
                      </Container>
                    </Container>
                    {invoiceItems.length > 1 && (
                      <FilledButton
                        isIcon={true}
                        icon={Trash2}
                        iconSize="w-4 h-4"
                        bgColor="bg-red-600 hover:bg-red-700"
                        textColor="text-white"
                        rounded="rounded-md"
                        buttonText=""
                        height="h-9"
                        width="w-9"
                        onClick={() => removeItem(index)}
                        title={translations["Remove Item"]}
                      />
                    )}
                  </Container>
                </Container>
              ))}
            </Container>
          </Container>

          {/* Totals Summary */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Invoice Summary
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Container className="bg-blue-50 p-4 rounded-lg">
                <Span className="text-sm font-medium text-blue-600 block">
                  {translations["Sub Total"]}
                </Span>
                <Span className="text-2xl font-bold text-blue-900">
                  ${formatCurrency(formData.SubTotal)}
                </Span>
              </Container>

              <Container className="bg-yellow-50 p-4 rounded-lg">
                <Span className="text-sm font-medium text-yellow-600 block">
                  {translations["Tax Amount"]}
                </Span>
                <Span className="text-2xl font-bold text-yellow-900">
                  ${formatCurrency(formData.TaxAmount)}
                </Span>
              </Container>

              <Container className="bg-green-50 p-4 rounded-lg">
                <Span className="text-sm font-medium text-green-600 block">
                  {translations["Total Amount"]}
                </Span>
                <Span className="text-2xl font-bold text-green-900">
                  ${formatCurrency(formData.TotalAmount)}
                </Span>
              </Container>
            </Container>
          </Container>

          {/* Notes */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Additional Information
              </h2>
            </Container>

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
              onClick={() => navigate("/admin/invoices")}
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

export default NewInvoice;