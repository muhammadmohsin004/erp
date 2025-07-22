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
import { usePriceList } from "../../../Contexts/PriceListContext/PriceListContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

// Move InputField component outside to prevent re-creation
const InputField = React.memo(
  ({
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
    step,
    options = [],
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
            className={`block w-full ${
              Icon ? "pl-10" : "pl-3"
            } pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        ) : as === "select" ? (
          <select
            name={name}
            value={value || ""}
            onChange={(e) => onChange(name, e.target.value)}
            disabled={disabled}
            className={`block w-full ${
              Icon ? "pl-10" : "pl-3"
            } pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
            {name === "CustomerGroups" && (
              <>
                <option value="All Customers">All Customers</option>
                <option value="VIP Customers">VIP Customers</option>
                <option value="Wholesale Customers">Wholesale Customers</option>
                <option value="Retail Customers">Retail Customers</option>
              </>
            )}
            {name === "PriorityLevel" && (
              <>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </>
            )}
            {name === "RoundingRules" && (
              <>
                <option value="Round Up">Round Up</option>
                <option value="Round Down">Round Down</option>
                <option value="Round to Nearest">Round to Nearest</option>
                <option value="No Rounding">No Rounding</option>
              </>
            )}
            {/* Custom options for product selection */}
            {name === "Item" &&
              options.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
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
            className={`block w-full ${
              Icon ? "pl-10" : "pl-3"
            } pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        )}
      </Container>
      {error && <Span className="text-red-500 text-sm">{error}</Span>}
    </Container>
  )
);

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
  const token = localStorage.getItem("token");

  const { createPriceList, updatePriceList } = usePriceList();

  // Memoize translations to prevent re-creation
  const translations = React.useMemo(
    () => ({
      "New Price List":
        language === "ar" ? "قائمة أسعار جديدة" : "New Price List",
      "Edit Price List":
        language === "ar" ? "تعديل قائمة الأسعار" : "Edit Price List",
      "Price List Information":
        language === "ar" ? "معلومات قائمة الأسعار" : "Price List Information",
      "Pricing Rules": language === "ar" ? "قواعد التسعير" : "Pricing Rules",
      "Customer & Region Settings":
        language === "ar"
          ? "إعدادات العملاء والمناطق"
          : "Customer & Region Settings",
      "Product Pricing":
        language === "ar" ? "تسعير المنتجات" : "Product Pricing",
      Items: language === "ar" ? "العناصر" : "Items",
      "Validity & Schedule":
        language === "ar" ? "الصلاحية والجدولة" : "Validity & Schedule",
      "Additional Settings":
        language === "ar" ? "إعدادات إضافية" : "Additional Settings",
      "Price List Name":
        language === "ar" ? "اسم قائمة الأسعار" : "Price List Name",
      "Price List Code":
        language === "ar" ? "كود قائمة الأسعار" : "Price List Code",
      Description: language === "ar" ? "الوصف" : "Description",
      "Price List Type":
        language === "ar" ? "نوع قائمة الأسعار" : "Price List Type",
      Currency: language === "ar" ? "العملة" : "Currency",
      Status: language === "ar" ? "الحالة" : "Status",
      "Default Discount":
        language === "ar" ? "الخصم الافتراضي" : "Default Discount",
      "Discount Type": language === "ar" ? "نوع الخصم" : "Discount Type",
      "Markup Percentage":
        language === "ar" ? "نسبة الربح" : "Markup Percentage",
      "Minimum Order Amount":
        language === "ar" ? "الحد الأدنى لمبلغ الطلب" : "Minimum Order Amount",
      "Maximum Discount":
        language === "ar" ? "الحد الأقصى للخصم" : "Maximum Discount",
      "Customer Groups":
        language === "ar" ? "مجموعات العملاء" : "Customer Groups",
      "Applicable Region":
        language === "ar" ? "المنطقة المطبقة" : "Applicable Region",
      "Warehouse Specific":
        language === "ar" ? "خاص بالمستودع" : "Warehouse Specific",
      "Target Customers":
        language === "ar" ? "العملاء المستهدفون" : "Target Customers",
      "Valid From": language === "ar" ? "صالح من" : "Valid From",
      "Valid Until": language === "ar" ? "صالح حتى" : "Valid Until",
      "Auto Apply": language === "ar" ? "تطبيق تلقائي" : "Auto Apply",
      "Priority Level": language === "ar" ? "مستوى الأولوية" : "Priority Level",
      "Approval Required":
        language === "ar" ? "يتطلب موافقة" : "Approval Required",
      "Tax Inclusive": language === "ar" ? "شامل الضريبة" : "Tax Inclusive",
      "Rounding Rules": language === "ar" ? "قواعد التقريب" : "Rounding Rules",
      "Internal Notes": language === "ar" ? "ملاحظات داخلية" : "Internal Notes",
      "Save Price List":
        language === "ar" ? "حفظ قائمة الأسعار" : "Save Price List",
      "Update Price List":
        language === "ar" ? "تحديث قائمة الأسعار" : "Update Price List",
      Cancel: language === "ar" ? "إلغاء" : "Cancel",
      Back: language === "ar" ? "رجوع" : "Back",
      Required: language === "ar" ? "مطلوب" : "Required",
      Item: language === "ar" ? "العنصر" : "Item",
      "Selling Price": language === "ar" ? "سعر البيع" : "Selling Price",
      "Add Item": language === "ar" ? "إضافة عنصر" : "Add Item",
      Remove: language === "ar" ? "إزالة" : "Remove",
      "Select Item": language === "ar" ? "اختر العنصر" : "Select Item",
      "Enter item name":
        language === "ar" ? "أدخل اسم العنصر" : "Enter item name",
      "Enter selling price":
        language === "ar" ? "أدخل سعر البيع" : "Enter selling price",
      "Enter description":
        language === "ar" ? "أدخل الوصف" : "Enter description",
      "All Customers": language === "ar" ? "جميع العملاء" : "All Customers",
      "VIP Customers": language === "ar" ? "عملاء VIP" : "VIP Customers",
      "Wholesale Customers":
        language === "ar" ? "عملاء الجملة" : "Wholesale Customers",
      "Retail Customers":
        language === "ar" ? "عملاء التجزئة" : "Retail Customers",
      High: language === "ar" ? "عالي" : "High",
      Medium: language === "ar" ? "متوسط" : "Medium",
      Low: language === "ar" ? "منخفض" : "Low",
      "Round Up": language === "ar" ? "تقريب لأعلى" : "Round Up",
      "Round Down": language === "ar" ? "تقريب لأسفل" : "Round Down",
      "Round to Nearest":
        language === "ar" ? "تقريب لأقرب" : "Round to Nearest",
      "No Rounding": language === "ar" ? "بدون تقريب" : "No Rounding",
      Active: language === "ar" ? "نشط" : "Active",
      Inactive: language === "ar" ? "غير نشط" : "Inactive",
      Draft: language === "ar" ? "مسودة" : "Draft",
      Standard: language === "ar" ? "قياسي" : "Standard",
      Wholesale: language === "ar" ? "جملة" : "Wholesale",
      Retail: language === "ar" ? "تجزئة" : "Retail",
      VIP: language === "ar" ? "VIP" : "VIP",
      Promotional: language === "ar" ? "ترويجي" : "Promotional",
      "Price list saved successfully":
        language === "ar"
          ? "تم حفظ قائمة الأسعار بنجاح"
          : "Price list saved successfully",
      "Price list updated successfully":
        language === "ar"
          ? "تم تحديث قائمة الأسعار بنجاح"
          : "Price list updated successfully",
      "Failed to save price list":
        language === "ar"
          ? "فشل في حفظ قائمة الأسعار"
          : "Failed to save price list",
    }),
    [language]
  );

  // Check if editing (from location state or URL)
  const isEditing = location.state?.isEditing || false;
  const cloneData = location.state?.cloneData;
  const editData = location.state?.editData;

  // Form state - Updated to match API structure
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Status: "Active",
  });

  // Items state - matching API structure
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data if editing or cloning
  useEffect(() => {
    if (cloneData) {
      // Handle cloning - extract data from API response structure
      const actualData = cloneData.Data || cloneData;
      setFormData({
        Name: `${actualData.Name || ""} (Copy)`,
        Description: actualData.Description || "",
        Status: "Draft",
      });

      // Handle items - check for nested structure
      const itemsData = actualData.Items;
      if (itemsData) {
        const itemsArray = itemsData.$values || itemsData || [];
        setItems(
          itemsArray.map((item) => ({
            Item: item.Item || "",
            SellingPrice: item.SellingPrice || "",
            Description: item.Description || "",
          }))
        );
      }
    } else if (editData) {
      // Handle editing - extract data from API response structure
      const actualData = editData.Data || editData;
      setFormData({
        Name: actualData.Name || "",
        Description: actualData.Description || "",
        Status: actualData.Status || "Active",
      });

      // Handle items - check for nested structure
      const itemsData = actualData.Items;
      if (itemsData) {
        const itemsArray = itemsData.$values || itemsData || [];
        setItems(
          itemsArray.map((item) => ({
            Item: item.Item || "",
            SellingPrice: item.SellingPrice || "",
            Description: item.Description || "",
          }))
        );
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Handle item changes
  const handleItemChange = useCallback((index, field, value) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
      return newItems;
    });
  }, []);

  // Add new item
  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      {
        Item: "",
        SellingPrice: "",
        Description: "",
      },
    ]);
  }, []);

  // Remove item
  const removeItem = useCallback((index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = translations.Required;
    }

    if (!formData.Status) {
      newErrors.Status = translations.Required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, translations]);

  // Handle form submission
  // Handle form submission - CORRECT VERSION based on working curl
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSaving(true);
      try {
        const submitData = {
          Name: formData.Name.trim(),
          Description: formData.Description?.trim() || null,
          Status: formData.Status,
          // Only include items that have at least an Item name
          Items: items
            .filter((item) => item.Item?.trim())
            .map((item) => ({
              Item: item.Item.trim(),
              // Keep SellingPrice as string - this matches your working curl
              SellingPrice: item.SellingPrice?.toString() || null,
              Description: item.Description?.trim() || null,
            })),
        };

        console.log("Submitting data:", JSON.stringify(submitData, null, 2)); // Debug log

        let result;
        if (isEditing && editData?.Id) {
          result = await updatePriceList(editData.Id, submitData);
        } else {
          result = await createPriceList(submitData);
        }

        // Show success message
        if (result && result.Success) {
          alert(
            isEditing
              ? translations["Price list updated successfully"]
              : translations["Price list saved successfully"]
          );
        }

        // Navigate back to price lists
        navigate("/admin/Price-List-Manager");
      } catch (error) {
        console.error("Error saving price list:", error);

        // Better error handling
        let errorMessage = translations["Failed to save price list"];
        if (error.response?.data?.Message) {
          errorMessage = error.response.data.Message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          // Handle validation errors
          const validationErrors = error.response.data.errors;
          const errorMessages = [];

          for (const [field, messages] of Object.entries(validationErrors)) {
            if (Array.isArray(messages)) {
              errorMessages.push(...messages);
            }
          }

          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join("\n");
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        alert(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [
      formData,
      items,
      isEditing,
      editData,
      validateForm,
      updatePriceList,
      createPriceList,
      navigate,
      translations,
    ]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate("/admin/Price-List-Manager");
  }, [navigate]);

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
                onClick={handleBack}
              />
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing
                  ? translations["Edit Price List"]
                  : translations["New Price List"]}
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
                onClick={handleBack}
              />
              <FilledButton
                isIcon={true}
                icon={Save}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={
                  isSaving
                    ? "Saving..."
                    : isEditing
                    ? translations["Update Price List"]
                    : translations["Save Price List"]
                }
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
          <Section
            title={translations["Price List Information"]}
            icon={FileText}
          >
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
                label={translations["Status"]}
                name="Status"
                as="select"
                required
                value={formData.Status}
                onChange={handleInputChange}
                error={errors.Status}
                icon={Settings}
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
            </Container>
          </Section>

          {/* Items Section */}
          <Section title={translations["Items"]} icon={Package}>
            <Container className="space-y-4">
              {items.map((item, index) => (
                <Container
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <Container className="flex justify-between items-center mb-4">
                    <Span className="font-medium text-gray-900">
                      {translations.Item} {index + 1}
                    </Span>
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
                      onClick={() => removeItem(index)}
                    />
                  </Container>
                  <Container className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      label={translations["Item"]}
                      name="Item"
                      placeholder={translations["Enter item name"]}
                      value={item.Item || ""}
                      onChange={(field, value) =>
                        handleItemChange(index, field, value)
                      }
                      icon={Package}
                    />
                    <InputField
                      label={translations["Selling Price"]}
                      name="SellingPrice"
                      type="number"
                      placeholder={translations["Enter selling price"]}
                      value={item.SellingPrice || ""}
                      onChange={(field, value) =>
                        handleItemChange(index, field, value)
                      }
                      icon={DollarSign}
                      step="0.01"
                      min="0"
                    />
                    <InputField
                      label={translations["Description"]}
                      name="Description"
                      placeholder={translations["Enter description"]}
                      value={item.Description || ""}
                      onChange={(field, value) =>
                        handleItemChange(index, field, value)
                      }
                      icon={FileText}
                    />
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
                buttonText={translations["Add Item"]}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={addItem}
              />

              {items.length === 0 && (
                <Container className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No items added to this price list yet.</p>
                  <p className="text-sm">Click "Add Item" to get started.</p>
                </Container>
              )}
            </Container>
          </Section>

          {/* Guidelines Section */}
          <Container className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <Container className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <Container>
                <Span className="text-sm font-medium text-blue-900">
                  Price List Guidelines
                </Span>
                <Span className="text-sm text-blue-700 block mt-1">
                  • Price list name should be descriptive and unique.
                </Span>
                <Span className="text-sm text-blue-700 block">
                  • Items can have optional selling prices and descriptions.
                </Span>
                <Span className="text-sm text-blue-700 block">
                  • Set status to "Active" to make the price list available for
                  use.
                </Span>
                <Span className="text-sm text-blue-700 block">
                  • Use "Draft" status while you're still working on the price
                  list.
                </Span>
              </Container>
            </Container>
          </Container>
        </form>
      </Container>
    </Container>
  );
};

export default NewPriceList;
