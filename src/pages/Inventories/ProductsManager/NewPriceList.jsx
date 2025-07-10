import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  DollarSign,
  Package,
  Calendar,
  Users,
  MapPin,
  Tag,
  Percent,
  Calculator,
  Settings,
  AlertTriangle,
  FileText,
  TrendingUp,
} from "lucide-react";
import { usePriceList } from "../../Contexts/PriceListContext/PriceListContext"; // You'll need to create this context
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

// Move InputField component outside to prevent re-creation
const InputField = React.memo(({ 
  label, 
  name, 
  type = "text", 
  required = false, 
  placeholder = "", 
  value, 
  onChange, 
  error,
  icon: Icon,
  as = "input",
  disabled = false,
  min,
  max,
  step
}) => (
  <Container className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <Span className="text-red-500 ml-1">*</Span>}
    </label>
    <Container className="relative">
      {Icon && (
        <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </Container>
      )}
      {as === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={4}
          disabled={disabled}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      ) : as === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {name === "PriceListType" && (
            <>
              <option value="Standard">Standard</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Retail">Retail</option>
              <option value="VIP">VIP</option>
              <option value="Promotional">Promotional</option>
            </>
          )}
          {name === "Status" && (
            <>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
            </>
          )}
          {name === "Currency" && (
            <>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="SAR">SAR - Saudi Riyal</option>
              <option value="AED">AED - UAE Dirham</option>
              <option value="PKR">PKR - Pakistani Rupee</option>
            </>
          )}
          {name === "DiscountType" && (
            <>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </>
          )}
          {name === "ApplicableRegion" && (
            <>
              <option value="Global">Global</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Middle East">Middle East</option>
              <option value="Custom">Custom</option>
            </>
          )}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      )}
    </Container>
    {error && <Span className="text-red-500 text-sm">{error}</Span>}
  </Container>
));

// Move Section component outside to prevent re-creation
const Section = React.memo(({ title, children, icon: Icon }) => (
  <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <Container className="flex items-center gap-3 mb-6">
      {Icon && <Icon className="w-5 h-5 text-blue-600" />}
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </Container>
    {children}
  </Container>
));

const NewPriceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);
  
  const { createPriceList, updatePriceList } = usePriceList();

  // Memoize translations to prevent re-creation
  const translations = React.useMemo(() => ({
    "New Price List": language === "ar" ? "قائمة أسعار جديدة" : "New Price List",
    "Edit Price List": language === "ar" ? "تعديل قائمة الأسعار" : "Edit Price List",
    "Price List Information": language === "ar" ? "معلومات قائمة الأسعار" : "Price List Information",
    "Pricing Rules": language === "ar" ? "قواعد التسعير" : "Pricing Rules",
    "Customer & Region Settings": language === "ar" ? "إعدادات العملاء والمناطق" : "Customer & Region Settings",
    "Product Pricing": language === "ar" ? "تسعير المنتجات" : "Product Pricing",
    "Validity & Schedule": language === "ar" ? "الصلاحية والجدولة" : "Validity & Schedule",
    "Additional Settings": language === "ar" ? "إعدادات إضافية" : "Additional Settings",
    "Price List Name": language === "ar" ? "اسم قائمة الأسعار" : "Price List Name",
    "Price List Code": language === "ar" ? "كود قائمة الأسعار" : "Price List Code",
    "Description": language === "ar" ? "الوصف" : "Description",
    "Price List Type": language === "ar" ? "نوع قائمة الأسعار" : "Price List Type",
    "Currency": language === "ar" ? "العملة" : "Currency",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Default Discount": language === "ar" ? "الخصم الافتراضي" : "Default Discount",
    "Discount Type": language === "ar" ? "نوع الخصم" : "Discount Type",
    "Markup Percentage": language === "ar" ? "نسبة الربح" : "Markup Percentage",
    "Minimum Order Amount": language === "ar" ? "الحد الأدنى لمبلغ الطلب" : "Minimum Order Amount",
    "Maximum Discount": language === "ar" ? "الحد الأقصى للخصم" : "Maximum Discount",
    "Customer Groups": language === "ar" ? "مجموعات العملاء" : "Customer Groups",
    "Applicable Region": language === "ar" ? "المنطقة المطبقة" : "Applicable Region",
    "Warehouse Specific": language === "ar" ? "خاص بالمستودع" : "Warehouse Specific",
    "Target Customers": language === "ar" ? "العملاء المستهدفون" : "Target Customers",
    "Valid From": language === "ar" ? "صالح من" : "Valid From",
    "Valid Until": language === "ar" ? "صالح حتى" : "Valid Until",
    "Auto Apply": language === "ar" ? "تطبيق تلقائي" : "Auto Apply",
    "Priority Level": language === "ar" ? "مستوى الأولوية" : "Priority Level",
    "Approval Required": language === "ar" ? "يتطلب موافقة" : "Approval Required",
    "Tax Inclusive": language === "ar" ? "شامل الضريبة" : "Tax Inclusive",
    "Rounding Rules": language === "ar" ? "قواعد التقريب" : "Rounding Rules",
    "Internal Notes": language === "ar" ? "ملاحظات داخلية" : "Internal Notes",
    "Save Price List": language === "ar" ? "حفظ قائمة الأسعار" : "Save Price List",
    "Update Price List": language === "ar" ? "تحديث قائمة الأسعار" : "Update Price List",
    "Cancel": language === "ar" ? "إلغاء" : "Cancel",
    "Back": language === "ar" ? "رجوع" : "Back",
    "Required": language === "ar" ? "مطلوب" : "Required",
    "Product": language === "ar" ? "المنتج" : "Product",
    "Base Price": language === "ar" ? "السعر الأساسي" : "Base Price",
    "Special Price": language === "ar" ? "السعر الخاص" : "Special Price",
    "Discount": language === "ar" ? "الخصم" : "Discount",
    "Final Price": language === "ar" ? "السعر النهائي" : "Final Price",
    "Add Product": language === "ar" ? "إضافة منتج" : "Add Product",
    "Remove": language === "ar" ? "إزالة" : "Remove",
    "Select Product": language === "ar" ? "اختر المنتج" : "Select Product",
    "Enter base price": language === "ar" ? "أدخل السعر الأساسي" : "Enter base price",
    "Enter special price": language === "ar" ? "أدخل السعر الخاص" : "Enter special price",
    "Enter discount": language === "ar" ? "أدخل الخصم" : "Enter discount",
    "All Customers": language === "ar" ? "جميع العملاء" : "All Customers",
    "VIP Customers": language === "ar" ? "عملاء VIP" : "VIP Customers",
    "Wholesale Customers": language === "ar" ? "عملاء الجملة" : "Wholesale Customers",
    "Retail Customers": language === "ar" ? "عملاء التجزئة" : "Retail Customers",
    "High": language === "ar" ? "عالي" : "High",
    "Medium": language === "ar" ? "متوسط" : "Medium",
    "Low": language === "ar" ? "منخفض" : "Low",
    "Round Up": language === "ar" ? "تقريب لأعلى" : "Round Up",
    "Round Down": language === "ar" ? "تقريب لأسفل" : "Round Down",
    "Round to Nearest": language === "ar" ? "تقريب لأقرب" : "Round to Nearest",
    "No Rounding": language === "ar" ? "بدون تقريب" : "No Rounding",
    "Active": language === "ar" ? "نشط" : "Active",
    "Inactive": language === "ar" ? "غير نشط" : "Inactive",
    "Draft": language === "ar" ? "مسودة" : "Draft",
    "Standard": language === "ar" ? "قياسي" : "Standard",
    "Wholesale": language === "ar" ? "جملة" : "Wholesale",
    "Retail": language === "ar" ? "تجزئة" : "Retail",
    "VIP": language === "ar" ? "VIP" : "VIP",
    "Promotional": language === "ar" ? "ترويجي" : "Promotional",
  }), [language]);

  // Check if editing (from location state or URL)
  const isEditing = location.state?.isEditing || false;
  const cloneData = location.state?.cloneData;
  const editData = location.state?.editData;

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    Code: "",
    Description: "",
    PriceListType: "Standard",
    Currency: "USD",
    Status: "Active",
    DefaultDiscount: "",
    DiscountType: "percentage",
    MarkupPercentage: "",
    MinimumOrderAmount: "",
    MaximumDiscount: "",
    CustomerGroups: "All Customers",
    ApplicableRegion: "Global",
    WarehouseSpecific: false,
    TargetCustomers: "",
    ValidFrom: "",
    ValidUntil: "",
    AutoApply: false,
    PriorityLevel: "Medium",
    ApprovalRequired: false,
    TaxInclusive: false,
    RoundingRules: "Round to Nearest",
    InternalNotes: "",
  });

  const [productPricing, setProductPricing] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data if editing or cloning
  useEffect(() => {
    if (cloneData) {
      setFormData({
        ...cloneData,
        Id: undefined,
        Name: `${cloneData.Name || ""} (Copy)`,
        Code: "",
        Status: "Draft",
      });
      if (cloneData.ProductPricing && Array.isArray(cloneData.ProductPricing)) {
        setProductPricing(cloneData.ProductPricing);
      }
    } else if (editData) {
      setFormData(editData);
      if (editData.ProductPricing && Array.isArray(editData.ProductPricing)) {
        setProductPricing(editData.ProductPricing);
      }
    }
  }, [cloneData, editData]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Memoize event handlers to prevent re-creation
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Handle product pricing changes
  const handleProductPricingChange = useCallback((index, field, value) => {
    setProductPricing(prev => {
      const newPricing = [...prev];
      newPricing[index] = {
        ...newPricing[index],
        [field]: value
      };
      
      // Auto-calculate final price if base price and discount are provided
      if (field === 'BasePrice' || field === 'Discount' || field === 'SpecialPrice') {
        const item = newPricing[index];
        const basePrice = parseFloat(item.BasePrice) || 0;
        const specialPrice = parseFloat(item.SpecialPrice) || 0;
        const discount = parseFloat(item.Discount) || 0;
        
        if (specialPrice > 0) {
          newPricing[index].FinalPrice = specialPrice;
        } else if (basePrice > 0 && discount > 0) {
          if (formData.DiscountType === 'percentage') {
            newPricing[index].FinalPrice = basePrice - (basePrice * discount / 100);
          } else {
            newPricing[index].FinalPrice = basePrice - discount;
          }
        } else {
          newPricing[index].FinalPrice = basePrice;
        }
      }
      
      return newPricing;
    });
  }, [formData.DiscountType]);

  // Add new product pricing
  const addProductPricing = useCallback(() => {
    setProductPricing(prev => [...prev, {
      ProductId: "",
      ProductName: "",
      BasePrice: "",
      SpecialPrice: "",
      Discount: "",
      FinalPrice: "",
    }]);
  }, []);

  // Remove product pricing
  const removeProductPricing = useCallback((index) => {
    setProductPricing(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = translations.Required;
    }

    if (!formData.PriceListType) {
      newErrors.PriceListType = translations.Required;
    }

    if (!formData.Currency) {
      newErrors.Currency = translations.Required;
    }

    if (formData.DefaultDiscount && isNaN(parseFloat(formData.DefaultDiscount))) {
      newErrors.DefaultDiscount = "Invalid number format";
    }

    if (formData.MarkupPercentage && isNaN(parseFloat(formData.MarkupPercentage))) {
      newErrors.MarkupPercentage = "Invalid number format";
    }

    if (formData.MinimumOrderAmount && isNaN(parseFloat(formData.MinimumOrderAmount))) {
      newErrors.MinimumOrderAmount = "Invalid number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, translations]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const submitData = {
        ...formData,
        ProductPricing: productPricing.filter(item => 
          item.ProductId && item.BasePrice
        ),
        // Ensure proper data types
        AutoApply: Boolean(formData.AutoApply),
        ApprovalRequired: Boolean(formData.ApprovalRequired),
        TaxInclusive: Boolean(formData.TaxInclusive),
        WarehouseSpecific: Boolean(formData.WarehouseSpecific),
      };

      if (isEditing && editData?.Id) {
        await updatePriceList(editData.Id, submitData);
      } else {
        await createPriceList(submitData);
      }

      navigate("/admin/price-lists");
    } catch (error) {
      console.error("Error saving price list:", error);
      alert("Failed to save price list. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [formData, productPricing, isEditing, editData, validateForm, updatePriceList, createPriceList, navigate]);

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <Container className="px-6 py-4">
          <Container className="flex items-center justify-between">
            <Container className="flex items-center gap-4">
              <FilledButton
                isIcon={true}
                icon={ArrowLeft}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-md"
                buttonText=""
                height="h-10"
                width="w-10"
                onClick={() => navigate("/admin/price-lists")}
              />
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? translations["Edit Price List"] : translations["New Price List"]}
              </h1>
            </Container>
            <Container className="flex gap-3">
              <FilledButton
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText={translations.Cancel}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => navigate("/admin/price-lists")}
              />
              <FilledButton
                isIcon={true}
                icon={Save}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={isSaving ? "Saving..." : (isEditing ? translations["Update Price List"] : translations["Save Price List"])}
                height="h-10"
                px="px-6"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                disabled={isSaving}
                onClick={handleSubmit}
              />
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Form Content */}
      <Container className="px-6 py-6 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price List Information */}
          <Section title={translations["Price List Information"]} icon={FileText}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Price List Name"]}
                name="Name"
                required
                placeholder="Enter price list name"
                value={formData.Name}
                onChange={handleInputChange}
                error={errors.Name}
                icon={Tag}
              />
              
              <InputField
                label={translations["Price List Code"]}
                name="Code"
                placeholder="Auto-generated if left empty"
                value={formData.Code}
                onChange={handleInputChange}
                icon={Tag}
              />

              <Container className="md:col-span-2">
                <InputField
                  label={translations["Description"]}
                  name="Description"
                  as="textarea"
                  placeholder="Enter price list description"
                  value={formData.Description}
                  onChange={handleInputChange}
                />
              </Container>

              <InputField
                label={translations["Price List Type"]}
                name="PriceListType"
                as="select"
                required
                value={formData.PriceListType}
                onChange={handleInputChange}
                error={errors.PriceListType}
                icon={Settings}
              />

              <InputField
                label={translations["Currency"]}
                name="Currency"
                as="select"
                required
                value={formData.Currency}
                onChange={handleInputChange}
                error={errors.Currency}
                icon={DollarSign}
              />

              <InputField
                label={translations["Status"]}
                name="Status"
                as="select"
                required
                value={formData.Status}
                onChange={handleInputChange}
                icon={Settings}
              />

              <InputField
                label={translations["Priority Level"]}
                name="PriorityLevel"
                as="select"
                value={formData.PriorityLevel}
                onChange={handleInputChange}
                icon={TrendingUp}
              />
            </Container>
          </Section>

          {/* Pricing Rules */}
          <Section title={translations["Pricing Rules"]} icon={Calculator}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Default Discount"]}
                name="DefaultDiscount"
                type="number"
                placeholder="0.00"
                value={formData.DefaultDiscount}
                onChange={handleInputChange}
                error={errors.DefaultDiscount}
                icon={Percent}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Discount Type"]}
                name="DiscountType"
                as="select"
                value={formData.DiscountType}
                onChange={handleInputChange}
                icon={Percent}
              />

              <InputField
                label={translations["Markup Percentage"]}
                name="MarkupPercentage"
                type="number"
                placeholder="0.00"
                value={formData.MarkupPercentage}
                onChange={handleInputChange}
                error={errors.MarkupPercentage}
                icon={TrendingUp}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Maximum Discount"]}
                name="MaximumDiscount"
                type="number"
                placeholder="0.00"
                value={formData.MaximumDiscount}
                onChange={handleInputChange}
                icon={Percent}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Minimum Order Amount"]}
                name="MinimumOrderAmount"
                type="number"
                placeholder="0.00"
                value={formData.MinimumOrderAmount}
                onChange={handleInputChange}
                error={errors.MinimumOrderAmount}
                icon={DollarSign}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Rounding Rules"]}
                name="RoundingRules"
                as="select"
                value={formData.RoundingRules}
                onChange={handleInputChange}
                icon={Calculator}
              />
            </Container>
          </Section>

          {/* Customer & Region Settings */}
          <Section title={translations["Customer & Region Settings"]} icon={Users}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Customer Groups"]}
                name="CustomerGroups"
                as="select"
                value={formData.CustomerGroups}
                onChange={handleInputChange}
                icon={Users}
              />

              <InputField
                label={translations["Applicable Region"]}
                name="ApplicableRegion"
                as="select"
                value={formData.ApplicableRegion}
                onChange={handleInputChange}
                icon={MapPin}
              />

              <Container className="md:col-span-2">
                <InputField
                  label={translations["Target Customers"]}
                  name="TargetCustomers"
                  as="textarea"
                  placeholder="Specify target customer criteria or groups"
                  value={formData.TargetCustomers}
                  onChange={handleInputChange}
                />
              </Container>

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.WarehouseSpecific || false}
                    onChange={(e) => handleInputChange("WarehouseSpecific", e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">{translations["Warehouse Specific"]}</Span>
                </label>
              </Container>
            </Container>
          </Section>

          {/* Validity & Schedule */}
          <Section title={translations["Validity & Schedule"]} icon={Calendar}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Valid From"]}
                name="ValidFrom"
                type="datetime-local"
                value={formData.ValidFrom}
                onChange={handleInputChange}
                icon={Calendar}
              />

              <InputField
                label={translations["Valid Until"]}
                name="ValidUntil"
                type="datetime-local"
                value={formData.ValidUntil}
                onChange={handleInputChange}
                icon={Calendar}
              />

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.AutoApply || false}
                    onChange={(e) => handleInputChange("AutoApply", e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">{translations["Auto Apply"]}</Span>
                </label>
              </Container>

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ApprovalRequired || false}
                    onChange={(e) => handleInputChange("ApprovalRequired", e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">{translations["Approval Required"]}</Span>
                </label>
              </Container>
            </Container>
          </Section>

          {/* Product Pricing */}
          <Section title={translations["Product Pricing"]} icon={Package}>
            <Container className="space-y-4">
              {productPricing.map((pricing, index) => (
                <Container key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Container className="flex justify-between items-center mb-4">
                    <Span className="font-medium text-gray-900">Product {index + 1}</Span>
                    <FilledButton
                      isIcon={true}
                      icon={Trash2}
                      iconSize="w-4 h-4"
                      bgColor="bg-red-100 hover:bg-red-200"
                      textColor="text-red-600"
                      rounded="rounded-md"
                      buttonText=""
                      height="h-8"
                      width="w-8"
                      onClick={() => removeProductPricing(index)}
                    />
                  </Container>
                  <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <InputField
                      label={translations["Product"]}
                      name="ProductId"
                      as="select"
                      placeholder={translations["Select Product"]}
                      value={pricing.ProductId || ""}
                      onChange={(field, value) => handleProductPricingChange(index, field, value)}
                      icon={Package}
                    />
                    <InputField
                      label={translations["Base Price"]}
                      name="BasePrice"
                      type="number"
                      placeholder={translations["Enter base price"]}
                      value={pricing.BasePrice || ""}
                      onChange={(field, value) => handleProductPricingChange(index, field, value)}
                      icon={DollarSign}
                      step="0.01"
                      min="0"
                    />
                    <InputField
                      label={translations["Special Price"]}
                      name="SpecialPrice"
                      type="number"
                      placeholder={translations["Enter special price"]}
                      value={pricing.SpecialPrice || ""}
                      onChange={(field, value) => handleProductPricingChange(index, field, value)}
                      icon={DollarSign}
                      step="0.01"
                      min="0"
                    />
                    <InputField
                      label={translations["Discount"]}
                      name="Discount"
                      type="number"
                      placeholder={translations["Enter discount"]}
                      value={pricing.Discount || ""}
                      onChange={(field, value) => handleProductPricingChange(index, field, value)}
                      icon={Percent}
                      step="0.01"
                      min="0"
                    />
                    <Container className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {translations["Final Price"]}
                      </label>
                      <Container className="relative">
                        <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </Container>
                        <input
                          type="number"
                          value={pricing.FinalPrice || ""}
                          disabled
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-600"
                          step="0.01"
                        />
                      </Container>
                    </Container>
                  </Container>
                </Container>
              ))}
              
              <FilledButton
                isIcon={true}
                icon={Plus}
                iconSize="w-4 h-4"
                bgColor="bg-blue-100 hover:bg-blue-200"
                textColor="text-blue-700"
                rounded="rounded-lg"
                buttonText={translations["Add Product"]}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={addProductPricing}
              />

              {productPricing.length === 0 && (
                <Container className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No products added to this price list yet.</p>
                  <p className="text-sm">Click "Add Product" to get started.</p>
                </Container>
              )}
            </Container>
          </Section>

          {/* Additional Settings */}
          <Section title={translations["Additional Settings"]} icon={Settings}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.TaxInclusive || false}
                    onChange={(e) => handleInputChange("TaxInclusive", e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">{translations["Tax Inclusive"]}</Span>
                </label>
              </Container>

              <Container></Container>

              <Container className="md:col-span-2">
                <InputField
                  label={translations["Internal Notes"]}
                  name="InternalNotes"
                  as="textarea"
                  placeholder="Add any internal notes or comments about this price list"
                  value={formData.InternalNotes}
                  onChange={handleInputChange}
                />
              </Container>
            </Container>

            <Container className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Container className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <Container>
                  <Span className="text-sm font-medium text-blue-900">Price List Guidelines</Span>
                  <Span className="text-sm text-blue-700 block mt-1">
                    • Priority levels determine which price list takes precedence when multiple lists apply to a customer.
                  </Span>
                  <Span className="text-sm text-blue-700 block">
                    • Auto-apply will automatically use this price list for qualifying customers without manual intervention.
                  </Span>
                  <Span className="text-sm text-blue-700 block">
                    • Final prices are calculated automatically based on base price, special price, and discount rules.
                  </Span>
                </Container>
              </Container>
            </Container>
          </Section>
        </form>
      </Container>
    </Container>
  );
};

export default NewPriceList;