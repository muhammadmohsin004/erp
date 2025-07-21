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
  Upload as UploadIcon,
} from "lucide-react";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

// InputField component with enhanced styling
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
  options = [],
  className = ""
}) => (
  <Container className={`space-y-1.5 ${className}`}>
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <Span className="text-red-500 ml-1">*</Span>}
    </label>
    <Container className="relative">
      {Icon && (
        <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Icon className="h-4 w-4 text-gray-400" />
        </Container>
      )}
      {as === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${error ? 'border-red-500' : ''}`}
        />
      ) : as === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white ${error ? 'border-red-500' : ''}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
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
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${error ? 'border-red-500' : ''}`}
        />
      )}
      {as === "select" && (
        <Container className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Container>
      )}
    </Container>
    {error && <Span className="text-red-500 text-xs">{error}</Span>}
  </Container>
));

// Radio Button Group Component
const RadioGroup = React.memo(({ label, name, options, value, onChange, error, required = false }) => (
  <Container className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <Span className="text-red-500 ml-1">*</Span>}
    </label>
    <Container className="flex gap-6">
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(name, e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <Container className="ml-2 flex items-center gap-2">
            {option.icon && <option.icon className="w-4 h-4 text-gray-500" />}
            <Span className="text-sm text-gray-700">{option.label}</Span>
          </Container>
        </label>
      ))}
    </Container>
    {error && <Span className="text-red-500 text-xs">{error}</Span>}
  </Container>
));

const NewClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);
  
  const { createClient, updateClient } = useClients();

  // Translations
  const translations = React.useMemo(() => ({
    "Add Client": language === "ar" ? "إضافة عميل" : "Add Client",
    "Edit Client": language === "ar" ? "تعديل العميل" : "Edit Client",
    "Client Details": language === "ar" ? "تفاصيل العميل" : "Client Details",
    "Account Details": language === "ar" ? "تفاصيل الحساب" : "Account Details",
    "Client Type": language === "ar" ? "نوع العميل" : "Client Type",
    "Individual": language === "ar" ? "فردي" : "Individual",
    "Business": language === "ar" ? "تجاري" : "Business",
    "Business Name": language === "ar" ? "اسم النشاط التجاري" : "Business Name",
    "First Name": language === "ar" ? "الاسم الأول" : "First Name",
    "Last Name": language === "ar" ? "اسم العائلة" : "Last Name",
    "Telephone": language === "ar" ? "الهاتف الثابت" : "Telephone",
    "Mobile": language === "ar" ? "الهاتف المحمول" : "Mobile",
    "Street Address 1": language === "ar" ? "العنوان الأول" : "Street Address 1",
    "Street Address 2": language === "ar" ? "العنوان الثاني" : "Street Address 2",
    "City": language === "ar" ? "المدينة" : "City",
    "State": language === "ar" ? "الولاية/المنطقة" : "State",
    "Postal Code": language === "ar" ? "الرمز البريدي" : "Postal Code",
    "Country": language === "ar" ? "البلد" : "Country",
    "Vat number": language === "ar" ? "الرقم الضريبي" : "Vat number",
    "Add Secondary Address": language === "ar" ? "إضافة عنوان ثانوي" : "Add Secondary Address",
    "Contacts List": language === "ar" ? "قائمة جهات الاتصال" : "Contacts List",
    "Add": language === "ar" ? "إضافة" : "Add",
    "Code Number": language === "ar" ? "رقم الكود" : "Code Number",
    "Invoicing Method": language === "ar" ? "طريقة الفوترة" : "Invoicing Method",
    "Currency": language === "ar" ? "العملة" : "Currency",
    "Email": language === "ar" ? "البريد الإلكتروني" : "Email",
    "Category": language === "ar" ? "الفئة" : "Category",
    "Notes": language === "ar" ? "ملاحظات" : "Notes",
    "Attachments": language === "ar" ? "المرفقات" : "Attachments",
    "Display Language": language === "ar" ? "لغة العرض" : "Display Language",
    "Tax Number": language === "ar" ? "الرقم الضريبي" : "Tax Number",
    "Payment Terms": language === "ar" ? "شروط الدفع" : "Payment Terms",
    "Save": language === "ar" ? "حفظ" : "Save",
    "Cancel": language === "ar" ? "إلغاء" : "Cancel",
    "Required": language === "ar" ? "مطلوب" : "Required",
    "Drop file here or select from your computer": language === "ar" ? "اسحب الملف هنا أو اختر من جهاز الكمبيوتر" : "Drop file here or select from your computer",
  }), [language]);

  // Form state - Updated to match controller defaults exactly
  const [formData, setFormData] = useState({
    ClientType: "Individual",
    BusinessName: "",
    FirstName: "",
    LastName: "",
    Telephone: "",
    Mobile: "",
    StreetAddress1: "",
    StreetAddress2: "",
    City: "",
    State: "",
    PostalCode: "",
    Country: "",
    VatNumber: "",
    HasSecondaryAddress: false,
    CodeNumber: "",
    InvoicingMethod: "Email", // Controller default
    Currency: "USD", // FIXED: Controller defaults to USD
    Email: "",
    Category: "",
    Notes: "",
    DisplayLanguage: "en", // Form uses "en", will convert to "English" for controller
    // Required backend fields - match controller expectations
    FullName: "",
    TaxNumber: "", // FIXED: Empty string as controller expects
    PaymentTerms: "", // FIXED: Empty string as controller expects
  });

  const [contacts, setContacts] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Check if editing
  const isEditing = location.state?.isEditing || false;
  const cloneData = location.state?.cloneData;
  const editData = location.state?.editData;

  // Currency options - FIXED: USD first to match controller default
  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "PKR", label: "PKR - Pakistani Rupee" },
    { value: "SAR", label: "SAR - Saudi Riyal" },
    { value: "AED", label: "AED - UAE Dirham" },
  ];

  // Country options
  const countryOptions = [
    { value: "", label: "Select Country" },
    { value: "Pakistan (PK)", label: "Pakistan (PK)" },
    { value: "United States (US)", label: "United States (US)" },
    { value: "Germany (DE)", label: "Germany (DE)" },
    { value: "Australia (AU)", label: "Australia (AU)" },
    { value: "Saudi Arabia (SA)", label: "Saudi Arabia (SA)" },
    { value: "UAE (AE)", label: "UAE (AE)" },
    { value: "Denmark", label: "Denmark" },
  ];

  // Invoicing method options
  const invoicingOptions = [
    { value: "Email", label: "Email" },
    { value: "Print", label: "Print (Offline)" },
    { value: "Both", label: "Both" },
  ];

  // Language options
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
  ];

  // Client type options
  const clientTypeOptions = [
    { value: "Individual", label: translations["Individual"], icon: User },
    { value: "Business", label: translations["Business"], icon: Building },
  ];

  // Initialize form data - Fixed to match controller defaults
  useEffect(() => {
    if (cloneData) {
      const sanitizedCloneData = {
        ...cloneData,
        Id: undefined,
        CodeNumber: "",
        Email: "",
        // FIXED: Ensure required fields match controller expectations
        Mobile: cloneData.Mobile || "",
        Telephone: cloneData.Telephone || "",
        TaxNumber: cloneData.TaxNumber || "",
        PaymentTerms: cloneData.PaymentTerms || "",
        Currency: cloneData.Currency || "USD", // FIXED: Controller default
        ClientType: cloneData.ClientType || "Individual",
        DisplayLanguage: cloneData.DisplayLanguage || "en",
        InvoicingMethod: cloneData.InvoicingMethod || "Email",
      };
      
      setFormData(sanitizedCloneData);
      
      if (cloneData.Contacts && Array.isArray(cloneData.Contacts.$values)) {
        setContacts(cloneData.Contacts.$values);
      } else if (cloneData.Contacts && Array.isArray(cloneData.Contacts)) {
        setContacts(cloneData.Contacts);
      }
    } else if (editData) {
      const sanitizedEditData = {
        ...editData,
        // FIXED: Ensure required fields match controller expectations
        Mobile: editData.Mobile || "",
        Telephone: editData.Telephone || "",
        TaxNumber: editData.TaxNumber || "",
        PaymentTerms: editData.PaymentTerms || "",
        Currency: editData.Currency || "USD", // FIXED: Controller default
        ClientType: editData.ClientType || "Individual",
        DisplayLanguage: editData.DisplayLanguage || "en",
        InvoicingMethod: editData.InvoicingMethod || "Email",
      };
      
      setFormData(sanitizedEditData);
      
      if (editData.Contacts && Array.isArray(editData.Contacts.$values)) {
        setContacts(editData.Contacts.$values);
      } else if (editData.Contacts && Array.isArray(editData.Contacts)) {
        setContacts(editData.Contacts);
      }

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

  // Event handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || ""
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleContactChange = useCallback((index, field, value) => {
    setContacts(prev => {
      const newContacts = [...prev];
      newContacts[index] = {
        ...newContacts[index],
        [field]: value || ""
      };
      return newContacts;
    });
  }, []);

  const addContact = useCallback(() => {
    setContacts(prev => [...prev, {
      FirstName: "",
      LastName: "",
      Email: "",
      Mobile: "",
      Telephone: ""
    }]);
  }, []);

  const removeContact = useCallback((index) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  }, []);

  // File handling
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  }, []);

  const processFiles = useCallback((files) => {
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

  const removeAttachment = useCallback((index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const removeExistingAttachment = useCallback((attachment) => {
    setExistingAttachments(prev => prev.filter(att => att.Id !== attachment.Id));
    setAttachmentsToRemove(prev => [...prev, attachment.Id]);
  }, []);

  // Validation - Updated to match controller validation exactly
  const validateForm = useCallback(() => {
    const newErrors = {};

    // CRITICAL: Match controller validation logic exactly
    if (formData.ClientType === "Individual") {
      // Controller checks: dto.ClientType == "Individual" && string.IsNullOrWhiteSpace(dto.FullName)
      const fullName = formData.FullName?.trim() || 
                      `${formData.FirstName?.trim() || ""} ${formData.LastName?.trim() || ""}`.trim();
      if (!fullName) {
        newErrors.FirstName = "Full Name is required for Individual clients";
      }
    } else if (formData.ClientType === "Business") {
      // Controller checks: dto.ClientType == "Business" && string.IsNullOrWhiteSpace(dto.BusinessName)
      if (!formData.BusinessName?.trim()) {
        newErrors.BusinessName = "Business Name is required for Business clients";
      }
    }

    // Email validation - match controller logic exactly
    if (formData.Email && formData.Email.trim()) {
      // Controller uses System.Net.Mail.MailAddress for validation
      if (!/\S+@\S+\.\S+/.test(formData.Email)) {
        newErrors.Email = "Invalid email format";
      }
    }

    // Remove frontend-only validations that controller doesn't enforce
    // TaxNumber and PaymentTerms can be empty per controller logic

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Sanitize form data - FIXED to send DisplayLanguage correctly
  const sanitizeFormData = useCallback(() => {
    // CRITICAL: Map DisplayLanguage from form codes to full names
    let displayLanguage = "English"; // Default
    if (formData.DisplayLanguage === "ar") displayLanguage = "Arabic";
    else if (formData.DisplayLanguage === "fr") displayLanguage = "French"; 
    else if (formData.DisplayLanguage === "de") displayLanguage = "German";
    else if (formData.DisplayLanguage === "en") displayLanguage = "English";

    // CRITICAL: Build FullName correctly based on ClientType per controller validation
    let fullName = "";
    if (formData.ClientType === "Business") {
      fullName = formData.BusinessName?.trim() || "";
    } else {
      // For Individual clients, controller validates FullName is required
      fullName = formData.FullName?.trim() || 
                `${formData.FirstName?.trim() || ""} ${formData.LastName?.trim() || ""}`.trim();
    }

    const sanitized = {
      // CRITICAL: Controller validation requires these exact values
      ClientType: formData.ClientType || "Individual",
      Currency: formData.Currency || "USD", // Controller defaults to USD
      InvoicingMethod: formData.InvoicingMethod || "Email",
      DisplayLanguage: displayLanguage, // FIXED: Send full language name
      
      // CRITICAL: Required NOT NULL fields - must match controller expectations
      Mobile: formData.Mobile?.trim() || "",
      Telephone: formData.Telephone?.trim() || "",
      TaxNumber: formData.TaxNumber?.trim() || "", // Empty string as controller expects
      PaymentTerms: formData.PaymentTerms?.trim() || "", // Empty string as controller expects
      
      // CRITICAL: Name fields - exact mapping to controller
      FullName: fullName,
      BusinessName: formData.BusinessName?.trim() || "",
      FirstName: formData.FirstName?.trim() || "",
      LastName: formData.LastName?.trim() || "",
      
      // Contact and Address fields
      Email: formData.Email?.trim() || "",
      StreetAddress1: formData.StreetAddress1?.trim() || "",
      StreetAddress2: formData.StreetAddress2?.trim() || "",
      City: formData.City?.trim() || "",
      State: formData.State?.trim() || "",
      PostalCode: formData.PostalCode?.trim() || "",
      Country: formData.Country?.trim() || "",
      
      // Optional fields
      VatNumber: formData.VatNumber?.trim() || "",
      CodeNumber: formData.CodeNumber?.trim() || "",
      Category: formData.Category?.trim() || "",
      Notes: formData.Notes?.trim() || "",
      
      // Boolean field
      HasSecondaryAddress: Boolean(formData.HasSecondaryAddress),
      
      // CRITICAL: Backend duplicate fields - exact names expected
      MobileNumber: formData.Mobile?.trim() || "",
      Phone: formData.Telephone?.trim() || "",
      Address: "", // Controller builds this automatically
    };

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
        ...(isEditing && { attachmentsToRemove: attachmentsToRemove })
      };

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
      alert(error.message || "Failed to save client. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [formData, contacts, attachments, attachmentsToRemove, isEditing, editData, validateForm, sanitizeFormData, updateClient, createClient, navigate]);

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="bg-gray-100 rounded-full sticky top-0 z-50">
        <Container className="px-4 py-3 ">
          <Container className="flex">
            <Container className="flex items-center gap-4">
              <FilledButton
                isIcon={true}
                icon={ArrowLeft}
                iconSize="w-4 h-4"
                bgColor="bg-white/10 hover:bg-white/20"
                textColor="text-white"
                rounded="rounded-md"
                buttonText=""
                height="h-8"
                width="w-8"
                onClick={() => navigate("/admin/clients")}
              />
              <nav className="flex items-center gap-2 text-sm">
                <Span className="opacity-80">Clients</Span>
                <Span className="opacity-60">›</Span>
                <Span className="font-medium">
                  {isEditing ? translations["Edit Client"] : translations["Add Client"]}
                </Span>
              </nav>
            </Container>
            <div className="flex text-end gap-2">
              <FilledButton
                isIcon={true}
                icon={X}
                iconSize="w-4 h-4"
                bgColor="bg-white/10 hover:bg-white/20"
                textColor="text-white"
                rounded="rounded-md"
                buttonText={translations.Cancel}
                height="h-8"
                px="px-3"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => navigate("/admin/clients")}
              />
              <FilledButton
                isIcon={true}
                icon={Save}
                iconSize="w-4 h-4"
                bgColor="bg-green-600 hover:bg-green-700"
                textColor="text-white"
                rounded="rounded-md"
                buttonText={isSaving ? "Saving..." : translations.Save}
                height="h-8"
                px="px-4"
                fontSize="text-sm"
                isIconLeft={true}
                disabled={isSaving}
                onClick={handleSubmit}
              />
            </div>
          </Container>
        </Container>
      </Container>

      {/* Main Content */}
      <Container className="p-4 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Container className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Details - Left Column */}
            <Container className="space-y-6">
              <Container className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                  {translations["Client Details"]}
                </h2>
                
                <Container className="space-y-5">
                  {/* Client Type */}
                  <RadioGroup
                    label={translations["Client Type"]}
                    name="ClientType"
                    options={clientTypeOptions}
                    value={formData.ClientType}
                    onChange={handleInputChange}
                    error={errors.ClientType}
                    required
                  />

                  {/* Business Name */}
                  {formData.ClientType === "Business" && (
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
                  )}

                  {/* Name Fields */}
                  <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label={translations["First Name"]}
                      name="FirstName"
                      placeholder="Enter first name"
                      value={formData.FirstName}
                      onChange={handleInputChange}
                      error={errors.FirstName}
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
                  </Container>

                  {/* Phone Fields */}
                  <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label={translations["Telephone"]}
                      name="Telephone"
                      type="tel"
                      placeholder="Enter telephone"
                      value={formData.Telephone}
                      onChange={handleInputChange}
                      icon={Phone}
                    />
                    <InputField
                      label={translations["Mobile"]}
                      name="Mobile"
                      type="tel"
                      placeholder="Enter mobile"
                      value={formData.Mobile}
                      onChange={handleInputChange}
                      icon={Phone}
                    />
                  </Container>

                  {/* Address Fields */}
                  <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label={translations["Street Address 1"]}
                      name="StreetAddress1"
                      placeholder="Enter address"
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
                  </Container>

                  <Container className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      placeholder="Enter state"
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
                  </Container>

                  <InputField
                    label={translations["Country"]}
                    name="Country"
                    as="select"
                    options={countryOptions}
                    value={formData.Country}
                    onChange={handleInputChange}
                  />

                  <InputField
                    label={translations["Vat number"]}
                    name="VatNumber"
                    placeholder="(optional)"
                    value={formData.VatNumber}
                    onChange={handleInputChange}
                    icon={CreditCard}
                  />

                  {/* Secondary Address Checkbox */}
                  <Container className="flex items-center">
                    <input
                      type="checkbox"
                      id="HasSecondaryAddress"
                      checked={formData.HasSecondaryAddress || false}
                      onChange={(e) => handleInputChange("HasSecondaryAddress", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="HasSecondaryAddress" className="ml-2 text-sm text-gray-700 cursor-pointer">
                      {translations["Add Secondary Address"]}
                    </label>
                  </Container>

                  {/* Contacts List */}
                  {/* <Container className="space-y-4">
                    <Container className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700">{translations["Contacts List"]}</h3>
                      <FilledButton
                        isIcon={true}
                        icon={Plus}
                        iconSize="w-4 h-4"
                        bgColor="bg-blue-50 hover:bg-blue-100"
                        textColor="text-blue-600"
                        rounded="rounded-md"
                        buttonText={translations["Add"]}
                        height="h-7"
                        px="px-3"
                        fontSize="text-xs"
                        isIconLeft={true}
                        onClick={addContact}
                      />
                    </Container>

                    {contacts.map((contact, index) => (
                      <Container key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <Container className="flex justify-between items-center mb-3">
                          <Span className="text-sm font-medium text-gray-900">Contact {index + 1}</Span>
                          <FilledButton
                            isIcon={true}
                            icon={Trash2}
                            iconSize="w-3 h-3"
                            bgColor="bg-red-100 hover:bg-red-200"
                            textColor="text-red-600"
                            rounded="rounded-md"
                            buttonText=""
                            height="h-6"
                            width="w-6"
                            onClick={() => removeContact(index)}
                          />
                        </Container>
                        <Container className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <InputField
                            label={translations["First Name"]}
                            name="FirstName"
                            placeholder="First name"
                            value={contact.FirstName || ""}
                            onChange={(field, value) => handleContactChange(index, field, value)}
                          />
                          <InputField
                            label={translations["Last Name"]}
                            name="LastName"
                            placeholder="Last name"
                            value={contact.LastName || ""}
                            onChange={(field, value) => handleContactChange(index, field, value)}
                          />
                          <InputField
                            label={translations["Email"]}
                            name="Email"
                            type="email"
                            placeholder="Email"
                            value={contact.Email || ""}
                            onChange={(field, value) => handleContactChange(index, field, value)}
                          />
                          <InputField
                            label={translations["Mobile"]}
                            name="Mobile"
                            type="tel"
                            placeholder="Mobile"
                            value={contact.Mobile || ""}
                            onChange={(field, value) => handleContactChange(index, field, value)}
                          />
                        </Container>
                      </Container>
                    ))}
                  </Container> */}
                </Container>
              </Container>
            </Container>

            {/* Account Details - Right Column */}
            <Container className="space-y-6">
              <Container className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                  {translations["Account Details"]}
                </h2>
                
                <Container className="space-y-5">
                  <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label={translations["Code Number"]}
                      name="CodeNumber"
                      placeholder="000002"
                      value={formData.CodeNumber}
                      onChange={handleInputChange}
                      icon={Tag}
                    />
                    <InputField
                      label={translations["Invoicing Method"]}
                      name="InvoicingMethod"
                      as="select"
                      options={invoicingOptions}
                      value={formData.InvoicingMethod}
                      onChange={handleInputChange}
                    />
                  </Container>

                  <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label={translations["Currency"]}
                      name="Currency"
                      as="select"
                      options={currencyOptions}
                      value={formData.Currency}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label={translations["Tax Number"]}
                      name="TaxNumber"
                      placeholder="Enter tax number"
                      value={formData.TaxNumber}
                      onChange={handleInputChange}
                      error={errors.TaxNumber}
                      icon={CreditCard}
                    />
                  </Container>

                  <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label={translations["Payment Terms"]}
                      name="PaymentTerms"
                      placeholder="e.g., Net 30, Cash on Delivery"
                      value={formData.PaymentTerms}
                      onChange={handleInputChange}
                      error={errors.PaymentTerms}
                    />
                    <InputField
                      label={translations["Email"]}
                      name="Email"
                      type="email"
                      placeholder="Enter email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      error={errors.Email}
                      icon={Mail}
                    />
                  </Container>

                  <InputField
                    label={translations["Category"]}
                    name="Category"
                    placeholder="Enter category"
                    value={formData.Category}
                    onChange={handleInputChange}
                  />

                  <InputField
                    label={translations["Notes"]}
                    name="Notes"
                    as="textarea"
                    placeholder="Enter notes"
                    value={formData.Notes}
                    onChange={handleInputChange}
                  />

                  {/* Attachments */}
                  <Container className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {translations["Attachments"]}
                    </label>
                    
                    <Container
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        dragOver 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Span className="text-sm text-gray-600">
                        {translations["Drop file here or select from your computer"]}
                      </Span>
                    </Container>

                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                    />

                    {/* File Lists */}
                    {existingAttachments.length > 0 && (
                      <Container className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-600">Existing Files</h4>
                        {existingAttachments.map((attachment) => (
                          <Container key={attachment.Id} className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-200">
                            <Container className="flex items-center gap-2">
                              <FileIcon className="w-4 h-4 text-blue-400" />
                              <Span className="text-xs text-gray-900 truncate">
                                {attachment.FileName || attachment.File}
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
                              onClick={() => removeExistingAttachment(attachment)}
                            />
                          </Container>
                        ))}
                      </Container>
                    )}

                    {attachments.length > 0 && (
                      <Container className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-600">New Files</h4>
                        {attachments.map((file, index) => (
                          <Container key={index} className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200">
                            <Container className="flex items-center gap-2">
                              <FileIcon className="w-4 h-4 text-green-400" />
                              <Span className="text-xs text-gray-900 truncate">{file.name}</Span>
                              <Span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(1)} MB)
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
                              onClick={() => removeAttachment(index)}
                            />
                          </Container>
                        ))}
                      </Container>
                    )}
                  </Container>

                  <InputField
                    label={translations["Display Language"]}
                    name="DisplayLanguage"
                    as="select"
                    options={languageOptions}
                    value={formData.DisplayLanguage}
                    onChange={handleInputChange}
                  />
                </Container>
              </Container>
            </Container>
          </Container>
        </form>
      </Container>
    </Container>
  );
};

export default NewClient;