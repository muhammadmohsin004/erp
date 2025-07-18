import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  FileText,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Tag,
  FileIcon,
} from "lucide-react";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
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
  as = "input"
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
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : ''}`}
        />
      ) : as === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : ''}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {name === "ClientType" && (
            <>
              <option value="Individual">Individual</option>
              <option value="Business">Business</option>
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
          {name === "InvoicingMethod" && (
            <>
              <option value="Email">Email</option>
              <option value="Print">Print</option>
              <option value="Both">Both</option>
            </>
          )}
          {name === "Country" && (
            <>
              <option value="United States (US)">United States (US)</option>
              <option value="Germany (DE)">Germany (DE)</option>
              <option value="Australia (AU)">Australia (AU)</option>
              <option value="Saudi Arabia (SA)">Saudi Arabia (SA)</option>
              <option value="UAE (AE)">UAE (AE)</option>
              <option value="Pakistan (PK)">Pakistan (PK)</option>
              <option value="Denmark">Denmark</option>
            </>
          )}
          {name === "DisplayLanguage" && (
            <>
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
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
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : ''}`}
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

const NewClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);
  
  const { createClient, updateClient } = useClients();

  // Memoize translations to prevent re-creation
  const translations = React.useMemo(() => ({
    "New Client": language === "ar" ? "عميل جديد" : "New Client",
    "Edit Client": language === "ar" ? "تعديل العميل" : "Edit Client",
    "Client Information": language === "ar" ? "معلومات العميل" : "Client Information",
    "Contact Information": language === "ar" ? "معلومات الاتصال" : "Contact Information",
    "Address Information": language === "ar" ? "معلومات العنوان" : "Address Information",
    "Additional Information": language === "ar" ? "معلومات إضافية" : "Additional Information",
    "Additional Contacts": language === "ar" ? "جهات اتصال إضافية" : "Additional Contacts",
    "Attachments": language === "ar" ? "المرفقات" : "Attachments",
    "Client Type": language === "ar" ? "نوع العميل" : "Client Type",
    "Individual": language === "ar" ? "فردي" : "Individual",
    "Business": language === "ar" ? "تجاري" : "Business",
    "Full Name": language === "ar" ? "الاسم الكامل" : "Full Name",
    "Business Name": language === "ar" ? "اسم النشاط التجاري" : "Business Name",
    "Contact Person": language === "ar" ? "الشخص المسؤول" : "Contact Person",
    "Email": language === "ar" ? "البريد الإلكتروني" : "Email",
    "Mobile": language === "ar" ? "الهاتف المحمول" : "Mobile",
    "Telephone": language === "ar" ? "الهاتف الثابت" : "Telephone",
    "Website": language === "ar" ? "الموقع الإلكتروني" : "Website",
    "Street Address 1": language === "ar" ? "العنوان الأول" : "Street Address 1",
    "Street Address 2": language === "ar" ? "العنوان الثاني" : "Street Address 2",
    "City": language === "ar" ? "المدينة" : "City",
    "State": language === "ar" ? "الولاية/المنطقة" : "State/Province",
    "Postal Code": language === "ar" ? "الرمز البريدي" : "Postal Code",
    "Country": language === "ar" ? "البلد" : "Country",
    "VAT Number": language === "ar" ? "الرقم الضريبي" : "VAT Number",
    "Tax Number": language === "ar" ? "الرقم الضريبي" : "Tax Number",
    "Code Number": language === "ar" ? "رقم الكود" : "Code Number",
    "Currency": language === "ar" ? "العملة" : "Currency",
    "Category": language === "ar" ? "الفئة" : "Category",
    "Payment Terms": language === "ar" ? "شروط الدفع" : "Payment Terms",
    "Invoicing Method": language === "ar" ? "طريقة الفوترة" : "Invoicing Method",
    "Notes": language === "ar" ? "ملاحظات" : "Notes",
    "First Name": language === "ar" ? "الاسم الأول" : "First Name",
    "Last Name": language === "ar" ? "اسم العائلة" : "Last Name",
    "Add Contact": language === "ar" ? "إضافة جهة اتصال" : "Add Contact",
    "Upload Files": language === "ar" ? "رفع الملفات" : "Upload Files",
    "Save Client": language === "ar" ? "حفظ العميل" : "Save Client",
    "Update Client": language === "ar" ? "تحديث العميل" : "Update Client",
    "Cancel": language === "ar" ? "إلغاء" : "Cancel",
    "Back": language === "ar" ? "رجوع" : "Back",
    "Required": language === "ar" ? "مطلوب" : "Required",
    "Optional": language === "ar" ? "اختياري" : "Optional",
    "Remove": language === "ar" ? "إزالة" : "Remove",
    "Choose Files": language === "ar" ? "اختر الملفات" : "Choose Files",
    "No files selected": language === "ar" ? "لم يتم اختيار ملفات" : "No files selected",
  }), [language]);

  // Check if editing (from location state or URL)
  const isEditing = location.state?.isEditing || false;
  const cloneData = location.state?.cloneData;
  const editData = location.state?.editData;

  // Form state - Updated with required backend fields
  const [formData, setFormData] = useState({
    ClientType: "Individual",
    FullName: "",
    BusinessName: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Mobile: "",
    Telephone: "",
    Website: "",
    StreetAddress1: "",
    StreetAddress2: "",
    City: "",
    State: "",
    PostalCode: "",
    Country: "",
    VatNumber: "",
    TaxNumber: "", // Added for backend compatibility
    CodeNumber: "",
    Currency: "USD",
    Category: "",
    PaymentTerms: "", // Added for backend compatibility
    InvoicingMethod: "Email",
    Notes: "",
    DisplayLanguage: "en",
    HasSecondaryAddress: false,
  });

  const [contacts, setContacts] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data if editing or cloning
  useEffect(() => {
    if (cloneData) {
      // Ensure all required fields are strings when cloning
      const sanitizedCloneData = {
        ...cloneData,
        Id: undefined,
        CodeNumber: "",
        Email: "",
        // Ensure required NOT NULL fields are strings
        Mobile: cloneData.Mobile || "",
        Telephone: cloneData.Telephone || "",
        TaxNumber: cloneData.TaxNumber || "",
        PaymentTerms: cloneData.PaymentTerms || "",
        Currency: cloneData.Currency || "USD",
        ClientType: cloneData.ClientType || "Individual",
        DisplayLanguage: cloneData.DisplayLanguage || "en",
      };
      
      setFormData(sanitizedCloneData);
      
      if (cloneData.Contacts && Array.isArray(cloneData.Contacts.$values)) {
        setContacts(cloneData.Contacts.$values);
      } else if (cloneData.Contacts && Array.isArray(cloneData.Contacts)) {
        setContacts(cloneData.Contacts);
      }
    } else if (editData) {
      // Ensure all required fields are strings when editing
      const sanitizedEditData = {
        ...editData,
        // Ensure required NOT NULL fields are strings
        Mobile: editData.Mobile || "",
        Telephone: editData.Telephone || "",
        TaxNumber: editData.TaxNumber || "",
        PaymentTerms: editData.PaymentTerms || "",
        Currency: editData.Currency || "USD",
        ClientType: editData.ClientType || "Individual",
        DisplayLanguage: editData.DisplayLanguage || "en",
      };
      
      setFormData(sanitizedEditData);
      
      if (editData.Contacts && Array.isArray(editData.Contacts.$values)) {
        setContacts(editData.Contacts.$values);
      } else if (editData.Contacts && Array.isArray(editData.Contacts)) {
        setContacts(editData.Contacts);
      }

      // Handle existing attachments
      if (editData.Attachments && Array.isArray(editData.Attachments.$values)) {
        setExistingAttachments(editData.Attachments.$values);
      } else if (editData.Attachments && Array.isArray(editData.Attachments)) {
        setExistingAttachments(editData.Attachments);
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
      [field]: value || "" // Ensure values are never null/undefined
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

  // Handle contact changes
  const handleContactChange = useCallback((index, field, value) => {
    setContacts(prev => {
      const newContacts = [...prev];
      newContacts[index] = {
        ...newContacts[index],
        [field]: value || "" // Ensure values are never null/undefined
      };
      return newContacts;
    });
  }, []);

  // Add new contact
  const addContact = useCallback(() => {
    setContacts(prev => [...prev, {
      FirstName: "",
      LastName: "",
      Email: "",
      Mobile: "",
      Telephone: ""
    }]);
  }, []);

  // Remove contact
  const removeContact = useCallback((index) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle file uploads
  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 
        'application/pdf', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} has invalid type. Allowed types: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX, TXT`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds size limit of 10MB`);
        return false;
      }
      
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  }, []);

  // Remove new attachment
  const removeAttachment = useCallback((index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Remove existing attachment
  const removeExistingAttachment = useCallback((attachment) => {
    setExistingAttachments(prev => prev.filter(att => att.Id !== attachment.Id));
    setAttachmentsToRemove(prev => [...prev, attachment.Id]);
  }, []);

  // Validate form - Updated to match backend requirements
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required field validation based on client type
    if (formData.ClientType === "Individual") {
      if (!formData.FullName?.trim()) {
        newErrors.FullName = translations.Required;
      }
    } else if (formData.ClientType === "Business") {
      if (!formData.BusinessName?.trim()) {
        newErrors.BusinessName = translations.Required;
      }
    }

    // Email validation
    if (formData.Email && !/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = "Invalid email format";
    }

    // Website validation
    if (formData.Website && !/^https?:\/\/.+/.test(formData.Website)) {
      newErrors.Website = "Website must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, translations]);

  // Sanitize form data before submission - Match backend expectations
  const sanitizeFormData = useCallback(() => {
    const sanitized = {
      ...formData,
      // Ensure all required NOT NULL fields are strings
      Mobile: formData.Mobile || "",
      Telephone: formData.Telephone || "",
      TaxNumber: formData.TaxNumber || "",
      PaymentTerms: formData.PaymentTerms || "",
      Currency: formData.Currency || "USD",
      ClientType: formData.ClientType || "Individual",
      DisplayLanguage: formData.DisplayLanguage || "en",
      
      // Clean up optional fields
      Email: formData.Email?.trim() || "",
      Website: formData.Website?.trim() || "",
      StreetAddress1: formData.StreetAddress1?.trim() || "",
      StreetAddress2: formData.StreetAddress2?.trim() || "",
      City: formData.City?.trim() || "",
      State: formData.State?.trim() || "",
      PostalCode: formData.PostalCode?.trim() || "",
      Country: formData.Country?.trim() || "",
      VatNumber: formData.VatNumber?.trim() || "",
      CodeNumber: formData.CodeNumber?.trim() || "",
      Category: formData.Category?.trim() || "",
      Notes: formData.Notes?.trim() || "",
      
      // Handle names based on client type
      FullName: formData.ClientType === "Individual" ? formData.FullName?.trim() || "" : formData.FullName?.trim() || "",
      BusinessName: formData.ClientType === "Business" ? formData.BusinessName?.trim() || "" : formData.BusinessName?.trim() || "",
      FirstName: formData.FirstName?.trim() || "",
      LastName: formData.LastName?.trim() || "",
      
      // Boolean fields
      HasSecondaryAddress: Boolean(formData.HasSecondaryAddress),
    };

    // Filter out empty strings for optional fields to avoid unnecessary data
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === "" && !['Mobile', 'Telephone', 'TaxNumber', 'PaymentTerms', 'Currency', 'ClientType', 'DisplayLanguage'].includes(key)) {
        // Keep required fields as empty strings, set others to null
        sanitized[key] = null;
      }
    });

    return sanitized;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const sanitizedData = sanitizeFormData();
      
      // Filter contacts to only include those with at least one field filled
      const validContacts = contacts.filter(contact => 
        contact.FirstName?.trim() || contact.LastName?.trim() || contact.Email?.trim() || contact.Mobile?.trim() || contact.Telephone?.trim()
      ).map(contact => ({
        FirstName: contact.FirstName?.trim() || "",
        LastName: contact.LastName?.trim() || "",
        Email: contact.Email?.trim() || "",
        Mobile: contact.Mobile?.trim() || "",
        Telephone: contact.Telephone?.trim() || "",
      }));

      const submitData = {
        ...sanitizedData,
        contacts: validContacts,
        // Include attachments to remove only for updates
        ...(isEditing && { attachmentsToRemove: attachmentsToRemove })
      };

      console.log('Submitting data:', submitData);
      console.log('Attachments:', attachments);
      console.log('Attachments to remove:', attachmentsToRemove);

      let response;
      if (isEditing && editData?.Id) {
        response = await updateClient(editData.Id, submitData, attachments);
      } else {
        response = await createClient(submitData, attachments);
      }

      if (response && response.Success !== false) {
        navigate("/admin/clients");
      } else {
        throw new Error(response?.Message || "Failed to save client");
      }
    } catch (error) {
      console.error("Error saving client:", error);
      
      // Show specific error message if available
      const errorMessage = error.message || "Failed to save client. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [formData, contacts, attachments, attachmentsToRemove, isEditing, editData, validateForm, sanitizeFormData, updateClient, createClient, navigate]);

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
                onClick={() => navigate("/admin/clients")}
              />
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? translations["Edit Client"] : translations["New Client"]}
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
                onClick={() => navigate("/admin/clients")}
              />
              <FilledButton
                isIcon={true}
                icon={Save}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={isSaving ? "Saving..." : (isEditing ? translations["Update Client"] : translations["Save Client"])}
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
          {/* Client Information */}
          <Section title={translations["Client Information"]} icon={User}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Client Type"]}
                name="ClientType"
                as="select"
                required
                value={formData.ClientType}
                onChange={handleInputChange}
                error={errors.ClientType}
                icon={formData.ClientType === "Individual" ? User : Building}
              />
              
              {formData.ClientType === "Individual" ? (
                <>
                  <InputField
                    label={translations["Full Name"]}
                    name="FullName"
                    required
                    placeholder="Enter full name"
                    value={formData.FullName}
                    onChange={handleInputChange}
                    error={errors.FullName}
                    icon={User}
                  />
                  <InputField
                    label={translations["First Name"]}
                    name="FirstName"
                    placeholder="Enter first name"
                    value={formData.FirstName}
                    onChange={handleInputChange}
                    icon={User}
                  />
                  <InputField
                    label={translations["Last Name"]}
                    name="LastName"
                    placeholder="Enter last name"
                    value={formData.LastName}
                    onChange={handleInputChange}
                    icon={User}
                  />
                </>
              ) : (
                <>
                  <InputField
                    label={translations["Business Name"]}
                    name="BusinessName"
                    required
                    placeholder="Enter business name"
                    value={formData.BusinessName}
                    onChange={handleInputChange}
                    error={errors.BusinessName}
                    icon={Building}
                  />
                  <InputField
                    label={translations["Contact Person"]}
                    name="FullName"
                    placeholder="Enter contact person name"
                    value={formData.FullName}
                    onChange={handleInputChange}
                    icon={User}
                  />
                  <InputField
                    label={translations["First Name"]}
                    name="FirstName"
                    placeholder="Enter first name"
                    value={formData.FirstName}
                    onChange={handleInputChange}
                    icon={User}
                  />
                  <InputField
                    label={translations["Last Name"]}
                    name="LastName"
                    placeholder="Enter last name"
                    value={formData.LastName}
                    onChange={handleInputChange}
                    icon={User}
                  />
                </>
              )}
              
              <InputField
                label={translations["Code Number"]}
                name="CodeNumber"
                placeholder="Auto-generated if left empty"
                value={formData.CodeNumber}
                onChange={handleInputChange}
                icon={Tag}
              />
            </Container>
          </Section>

          {/* Contact Information */}
          <Section title={translations["Contact Information"]} icon={Mail}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <InputField
                label={translations["Mobile"]}
                name="Mobile"
                type="tel"
                placeholder="Enter mobile number"
                value={formData.Mobile}
                onChange={handleInputChange}
                icon={Phone}
              />
              <InputField
                label={translations["Telephone"]}
                name="Telephone"
                type="tel"
                placeholder="Enter telephone number"
                value={formData.Telephone}
                onChange={handleInputChange}
                icon={Phone}
              />
              <InputField
                label={translations["Website"]}
                name="Website"
                type="url"
                placeholder="https://example.com"
                value={formData.Website}
                onChange={handleInputChange}
                error={errors.Website}
              />
            </Container>
          </Section>

          {/* Address Information */}
          <Section title={translations["Address Information"]} icon={MapPin}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Street Address 1"]}
                name="StreetAddress1"
                placeholder="Enter street address"
                value={formData.StreetAddress1}
                onChange={handleInputChange}
                icon={MapPin}
              />
              <InputField
                label={translations["Street Address 2"]}
                name="StreetAddress2"
                placeholder="Apartment, suite, etc."
                value={formData.StreetAddress2}
                onChange={handleInputChange}
              />
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
                label={translations["Postal Code"]}
                name="PostalCode"
                placeholder="Enter postal code"
                value={formData.PostalCode}
                onChange={handleInputChange}
              />
              <InputField
                label={translations["Country"]}
                name="Country"
                as="select"
                placeholder="Select country"
                value={formData.Country}
                onChange={handleInputChange}
              />
              <Container className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.HasSecondaryAddress || false}
                    onChange={(e) => handleInputChange("HasSecondaryAddress", e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">Has Secondary Address</Span>
                </label>
              </Container>
            </Container>
          </Section>

          {/* Additional Information */}
          <Section title={translations["Additional Information"]} icon={CreditCard}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["VAT Number"]}
                name="VatNumber"
                placeholder="Enter VAT number"
                value={formData.VatNumber}
                onChange={handleInputChange}
                icon={CreditCard}
              />
              <InputField
                label={translations["Tax Number"]}
                name="TaxNumber"
                placeholder="Enter tax number"
                value={formData.TaxNumber}
                onChange={handleInputChange}
                icon={CreditCard}
              />
              <InputField
                label={translations["Currency"]}
                name="Currency"
                as="select"
                value={formData.Currency}
                onChange={handleInputChange}
              />
              <InputField
                label={translations["Category"]}
                name="Category"
                placeholder="Enter category (e.g., Premium, Corporate)"
                value={formData.Category}
                onChange={handleInputChange}
              />
              <InputField
                label={translations["Payment Terms"]}
                name="PaymentTerms"
                placeholder="Enter payment terms (e.g., Net 30)"
                value={formData.PaymentTerms}
                onChange={handleInputChange}
              />
              <InputField
                label={translations["Invoicing Method"]}
                name="InvoicingMethod"
                as="select"
                value={formData.InvoicingMethod}
                onChange={handleInputChange}
              />
              <InputField
                label="Display Language"
                name="DisplayLanguage"
                as="select"
                value={formData.DisplayLanguage}
                onChange={handleInputChange}
              />
              <Container></Container>
              <Container className="md:col-span-2">
                <InputField
                  label={translations["Notes"]}
                  name="Notes"
                  as="textarea"
                  placeholder="Enter any additional notes"
                  value={formData.Notes}
                  onChange={handleInputChange}
                />
              </Container>
            </Container>
          </Section>

          {/* Additional Contacts */}
          <Section title={translations["Additional Contacts"]} icon={User}>
            <Container className="space-y-4">
              {contacts.map((contact, index) => (
                <Container key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Container className="flex justify-between items-center mb-4">
                    <Span className="font-medium text-gray-900">Contact {index + 1}</Span>
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
                      onClick={() => removeContact(index)}
                    />
                  </Container>
                  <Container className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label={translations["First Name"]}
                      name="FirstName"
                      placeholder="Enter first name"
                      value={contact.FirstName || ""}
                      onChange={(field, value) => handleContactChange(index, field, value)}
                    />
                    <InputField
                      label={translations["Last Name"]}
                      name="LastName"
                      placeholder="Enter last name"
                      value={contact.LastName || ""}
                      onChange={(field, value) => handleContactChange(index, field, value)}
                    />
                    <InputField
                      label={translations["Email"]}
                      name="Email"
                      type="email"
                      placeholder="Enter email"
                      value={contact.Email || ""}
                      onChange={(field, value) => handleContactChange(index, field, value)}
                    />
                    <InputField
                      label={translations["Mobile"]}
                      name="Mobile"
                      type="tel"
                      placeholder="Enter mobile"
                      value={contact.Mobile || ""}
                      onChange={(field, value) => handleContactChange(index, field, value)}
                    />
                    <InputField
                      label={translations["Telephone"]}
                      name="Telephone"
                      type="tel"
                      placeholder="Enter telephone"
                      value={contact.Telephone || ""}
                      onChange={(field, value) => handleContactChange(index, field, value)}
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
                buttonText={translations["Add Contact"]}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={addContact}
              />
            </Container>
          </Section>

          {/* Attachments */}
          <Section title={translations["Attachments"]} icon={FileText}>
            <Container className="space-y-4">
              <Container>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                />
                <label htmlFor="file-upload">
                  <Container className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Span className="text-gray-600">{translations["Choose Files"]}</Span>
                    <Span className="text-sm text-gray-400 block">PDF, DOC, XLS, Images (Max 10MB each)</Span>
                  </Container>
                </label>
              </Container>

              {/* Existing Attachments (for editing) */}
              {existingAttachments.length > 0 && (
                <Container className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Existing Attachments</h4>
                  {existingAttachments.map((attachment) => (
                    <Container key={attachment.Id} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <Container className="flex items-center gap-3">
                        <FileIcon className="w-5 h-5 text-blue-400" />
                        <Span className="text-sm text-gray-900">{attachment.FileName || attachment.File}</Span>
                        <Span className="text-xs text-blue-600">(Existing)</Span>
                      </Container>
                      <FilledButton
                        isIcon={true}
                        icon={X}
                        iconSize="w-4 h-4"
                        bgColor="bg-red-100 hover:bg-red-200"
                        textColor="text-red-600"
                        rounded="rounded-md"
                        buttonText=""
                        height="h-8"
                        width="w-8"
                        onClick={() => removeExistingAttachment(attachment)}
                      />
                    </Container>
                  ))}
                </Container>
              )}

              {/* New Attachments */}
              {attachments.length > 0 && (
                <Container className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">New Attachments</h4>
                  {attachments.map((file, index) => (
                    <Container key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                      <Container className="flex items-center gap-3">
                        <FileIcon className="w-5 h-5 text-green-400" />
                        <Span className="text-sm text-gray-900">{file.name}</Span>
                        <Span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </Span>
                        <Span className="text-xs text-green-600">(New)</Span>
                      </Container>
                      <FilledButton
                        isIcon={true}
                        icon={X}
                        iconSize="w-4 h-4"
                        bgColor="bg-red-100 hover:bg-red-200"
                        textColor="text-red-600"
                        rounded="rounded-md"
                        buttonText=""
                        height="h-8"
                        width="w-8"
                        onClick={() => removeAttachment(index)}
                      />
                    </Container>
                  ))}
                </Container>
              )}
            </Container>
          </Section>
        </form>
      </Container>
    </Container>
  );
};

export default NewClient;