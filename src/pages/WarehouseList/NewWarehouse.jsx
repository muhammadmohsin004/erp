import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Warehouse,
  Building,
  Mail,
  Phone,
  MapPin,
  User,
  Settings,
  Package,
  Shield,
  Tag,
} from "lucide-react";
import { useWarehouse } from "../../Contexts/WarehouseContext/WarehouseContext";
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
  disabled = false
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
          {name === "Status" && (
            <>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </>
          )}
          {name === "Primary" && (
            <>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </>
          )}
          {name === "ViewPermission" && (
            <>
              <option value="1">Enabled</option>
              <option value="0">Disabled</option>
            </>
          )}
          {name === "CreateInvoicePermission" && (
            <>
              <option value="1">Enabled</option>
              <option value="0">Disabled</option>
            </>
          )}
          {name === "UpdateStockPermission" && (
            <>
              <option value="1">Enabled</option>
              <option value="0">Disabled</option>
            </>
          )}
          {name === "Country" && (
            <>
              <option value="USA">United States</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="UAE">United Arab Emirates</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Germany">Germany</option>
              <option value="Australia">Australia</option>
              <option value="Denmark">Denmark</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
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

const NewWarehouse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);
  
  const { createWarehouse, updateWarehouse } = useWarehouse();

  // Memoize translations to prevent re-creation
  const translations = React.useMemo(() => ({
    "New Warehouse": language === "ar" ? "مستودع جديد" : "New Warehouse",
    "Edit Warehouse": language === "ar" ? "تعديل المستودع" : "Edit Warehouse",
    "Warehouse Information": language === "ar" ? "معلومات المستودع" : "Warehouse Information",
    "Contact Information": language === "ar" ? "معلومات الاتصال" : "Contact Information",
    "Address Information": language === "ar" ? "معلومات العنوان" : "Address Information",
    "Permissions & Settings": language === "ar" ? "الصلاحيات والإعدادات" : "Permissions & Settings",
    "Warehouse Name": language === "ar" ? "اسم المستودع" : "Warehouse Name",
    "Warehouse Code": language === "ar" ? "كود المستودع" : "Warehouse Code",
    "Description": language === "ar" ? "الوصف" : "Description",
    "Manager Name": language === "ar" ? "اسم المدير" : "Manager Name",
    "Email": language === "ar" ? "البريد الإلكتروني" : "Email",
    "Phone": language === "ar" ? "الهاتف" : "Phone",
    "Address": language === "ar" ? "العنوان" : "Address",
    "Shipping Address": language === "ar" ? "عنوان الشحن" : "Shipping Address",
    "City": language === "ar" ? "المدينة" : "City",
    "State": language === "ar" ? "الولاية/المنطقة" : "State/Province",
    "Country": language === "ar" ? "البلد" : "Country",
    "Postal Code": language === "ar" ? "الرمز البريدي" : "Postal Code",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Active": language === "ar" ? "نشط" : "Active",
    "Inactive": language === "ar" ? "غير نشط" : "Inactive",
    "Primary Warehouse": language === "ar" ? "مستودع أساسي" : "Primary Warehouse",
    "Default Warehouse": language === "ar" ? "مستودع افتراضي" : "Default Warehouse",
    "View Permission": language === "ar" ? "صلاحية العرض" : "View Permission",
    "Create Invoice Permission": language === "ar" ? "صلاحية إنشاء الفاتورة" : "Create Invoice Permission",
    "Update Stock Permission": language === "ar" ? "صلاحية تحديث المخزون" : "Update Stock Permission",
    "Save Warehouse": language === "ar" ? "حفظ المستودع" : "Save Warehouse",
    "Update Warehouse": language === "ar" ? "تحديث المستودع" : "Update Warehouse",
    "Cancel": language === "ar" ? "إلغاء" : "Cancel",
    "Back": language === "ar" ? "رجوع" : "Back",
    "Required": language === "ar" ? "مطلوب" : "Required",
    "Optional": language === "ar" ? "اختياري" : "Optional",
    "Enabled": language === "ar" ? "مفعل" : "Enabled",
    "Disabled": language === "ar" ? "معطل" : "Disabled",
    "Yes": language === "ar" ? "نعم" : "Yes",
    "No": language === "ar" ? "لا" : "No",
    "Same as main address": language === "ar" ? "نفس العنوان الرئيسي" : "Same as main address",
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
    ManagerName: "",
    Phone: "",
    Email: "",
    Address: "",
    City: "",
    State: "",
    Country: "USA",
    PostalCode: "",
    ShippingAddress: "",
    Status: "Active",
    Primary: "0",
    IsDefault: false,
    ViewPermission: "1",
    CreateInvoicePermission: "1",
    UpdateStockPermission: "1",
    IsActive: true,
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [sameAsMainAddress, setSameAsMainAddress] = useState(true);

  // Initialize form data if editing or cloning
  useEffect(() => {
    if (cloneData) {
      setFormData({
        ...cloneData,
        Id: undefined,
        Name: `${cloneData.Name || ""} (Copy)`,
        Code: "",
        Primary: "0",
        IsDefault: false,
      });
    } else if (editData) {
      setFormData(editData);
      setSameAsMainAddress(editData.ShippingAddress === editData.Address || !editData.ShippingAddress);
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

  // Handle input change with address auto-update
  const handleInputChangeWithAddress = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Auto-update shipping address if same as main address
      ...(field === "Address" && sameAsMainAddress ? { ShippingAddress: value } : {})
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
  }, [sameAsMainAddress]);

  // Handle same address checkbox
  const handleSameAddressChange = useCallback((checked) => {
    setSameAsMainAddress(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        ShippingAddress: prev.Address
      }));
    }
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = translations.Required;
    }

    if (formData.Email && !/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = "Invalid email format";
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
        // Ensure proper data types
        IsDefault: Boolean(formData.IsDefault),
        IsActive: Boolean(formData.IsActive),
      };

      if (isEditing && editData?.Id) {
        await updateWarehouse(editData.Id, submitData);
      } else {
        await createWarehouse(submitData);
      }

      navigate("/admin/WareHouse");
    } catch (error) {
      console.error("Error saving warehouse:", error);
      alert("Failed to save warehouse. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [formData, isEditing, editData, validateForm, updateWarehouse, createWarehouse, navigate]);

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
                onClick={() => navigate("/admin/WareHouse")}
              />
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? translations["Edit Warehouse"] : translations["New Warehouse"]}
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
                onClick={() => navigate("/admin/WareHouse")}
              />
              <FilledButton
                isIcon={true}
                icon={Save}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={isSaving ? "Saving..." : (isEditing ? translations["Update Warehouse"] : translations["Save Warehouse"])}
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
          {/* Warehouse Information */}
          <Section title={translations["Warehouse Information"]} icon={Warehouse}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Warehouse Name"]}
                name="Name"
                required
                placeholder="Enter warehouse name"
                value={formData.Name}
                onChange={handleInputChange}
                error={errors.Name}
                icon={Warehouse}
              />
              
              <InputField
                label={translations["Warehouse Code"]}
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
                  placeholder="Enter warehouse description"
                  value={formData.Description}
                  onChange={handleInputChange}
                />
              </Container>

              <InputField
                label={translations["Status"]}
                name="Status"
                as="select"
                required
                value={formData.Status}
                onChange={handleInputChange}
                icon={Package}
              />

              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Primary Warehouse"]}
                </label>
                <Container className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="Primary"
                      value="1"
                      checked={formData.Primary === "1"}
                      onChange={(e) => handleInputChange("Primary", e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Span className="ml-2 text-sm text-gray-700">{translations.Yes}</Span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="Primary"
                      value="0"
                      checked={formData.Primary === "0"}
                      onChange={(e) => handleInputChange("Primary", e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Span className="ml-2 text-sm text-gray-700">{translations.No}</Span>
                  </label>
                </Container>
              </Container>

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.IsDefault || false}
                    onChange={(e) => handleInputChange("IsDefault", e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">{translations["Default Warehouse"]}</Span>
                </label>
              </Container>
            </Container>
          </Section>

          {/* Contact Information */}
          <Section title={translations["Contact Information"]} icon={User}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Manager Name"]}
                name="ManagerName"
                placeholder="Enter manager name"
                value={formData.ManagerName}
                onChange={handleInputChange}
                icon={User}
              />
              
              <InputField
                label={translations["Phone"]}
                name="Phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.Phone}
                onChange={handleInputChange}
                icon={Phone}
              />
              
              <InputField
                label={translations["Email"]}
                name="Email"
                type="email"
                placeholder="Enter email address"
                value={formData.Email}
                onChange={handleInputChange}
                error={errors.Email}
                icon={Mail}
              />
            </Container>
          </Section>

          {/* Address Information */}
          <Section title={translations["Address Information"]} icon={MapPin}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Container className="md:col-span-2">
                <InputField
                  label={translations["Address"]}
                  name="Address"
                  placeholder="Enter warehouse address"
                  value={formData.Address}
                  onChange={handleInputChangeWithAddress}
                  icon={MapPin}
                />
              </Container>
              
              <InputField
                label={translations["City"]}
                name="City"
                placeholder="Enter city"
                value={formData.City}
                onChange={handleInputChange}
              />
              
              <InputField
                label={translations["State"]}
                name="State"
                placeholder="Enter state/province"
                value={formData.State}
                onChange={handleInputChange}
              />
              
              <InputField
                label={translations["Country"]}
                name="Country"
                as="select"
                value={formData.Country}
                onChange={handleInputChange}
              />
              
              <InputField
                label={translations["Postal Code"]}
                name="PostalCode"
                placeholder="Enter postal code"
                value={formData.PostalCode}
                onChange={handleInputChange}
              />

              <Container className="md:col-span-2">
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={sameAsMainAddress}
                    onChange={(e) => handleSameAddressChange(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">{translations["Same as main address"]}</Span>
                </label>
                
                <InputField
                  label={translations["Shipping Address"]}
                  name="ShippingAddress"
                  placeholder="Enter shipping address"
                  value={formData.ShippingAddress}
                  onChange={handleInputChange}
                  disabled={sameAsMainAddress}
                  icon={MapPin}
                />
              </Container>
            </Container>
          </Section>

          {/* Permissions & Settings */}
          <Section title={translations["Permissions & Settings"]} icon={Shield}>
            <Container className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label={translations["View Permission"]}
                name="ViewPermission"
                as="select"
                value={formData.ViewPermission}
                onChange={handleInputChange}
                icon={Settings}
              />
              
              <InputField
                label={translations["Create Invoice Permission"]}
                name="CreateInvoicePermission"
                as="select"
                value={formData.CreateInvoicePermission}
                onChange={handleInputChange}
                icon={Settings}
              />
              
              <InputField
                label={translations["Update Stock Permission"]}
                name="UpdateStockPermission"
                as="select"
                value={formData.UpdateStockPermission}
                onChange={handleInputChange}
                icon={Settings}
              />
            </Container>
            
            <Container className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Container className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <Container>
                  <Span className="text-sm font-medium text-blue-900">Permission Settings</Span>
                  <Span className="text-sm text-blue-700 block mt-1">
                    These permissions control what actions users can perform in this warehouse. 
                    View permission allows seeing warehouse data, Create Invoice permission enables invoice creation, 
                    and Update Stock permission allows inventory modifications.
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

export default NewWarehouse;