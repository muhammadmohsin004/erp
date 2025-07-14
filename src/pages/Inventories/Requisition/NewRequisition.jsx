import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  FileText,
  Calculator,
  AlertCircle,
  CheckCircle,
  Building,
  Package,
  Calendar,
  Hash,
  FileX,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { useRequisition } from "../../../Contexts/RequisitionContext/RequisitionContext";
import { useSupplier } from "../../../Contexts/SupplierContext/SupplierContext";
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const NewRequisition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "New Requisition": language === "ar" ? "طلب جديد" : "New Requisition",
    "Edit Requisition": language === "ar" ? "تعديل الطلب" : "Edit Requisition",
    "Clone Requisition": language === "ar" ? "نسخ الطلب" : "Clone Requisition",
    Save: language === "ar" ? "حفظ" : "Save",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Requisition Number":
      language === "ar" ? "رقم الطلب" : "Requisition Number",
    Type: language === "ar" ? "النوع" : "Type",
    Date: language === "ar" ? "التاريخ" : "Date",
    "Journal Account": language === "ar" ? "حساب اليومية" : "Journal Account",
    Supplier: language === "ar" ? "المورد" : "Supplier",
    Notes: language === "ar" ? "الملاحظات" : "Notes",
    "Select Supplier": language === "ar" ? "اختر المورد" : "Select Supplier",
    "Select Type": language === "ar" ? "اختر النوع" : "Select Type",
    Purchase: language === "ar" ? "شراء" : "Purchase",
    Sale: language === "ar" ? "بيع" : "Sale",
    Return: language === "ar" ? "إرجاع" : "Return",
    Transfer: language === "ar" ? "تحويل" : "Transfer",
    Items: language === "ar" ? "العناصر" : "Items",
    "Add Item": language === "ar" ? "إضافة عنصر" : "Add Item",
    Product: language === "ar" ? "المنتج" : "Product",
    "Select Product": language === "ar" ? "اختر المنتج" : "Select Product",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    Quantity: language === "ar" ? "الكمية" : "Quantity",
    "Stock on Hand": language === "ar" ? "المخزون المتاح" : "Stock on Hand",
    "New Stock": language === "ar" ? "المخزون الجديد" : "New Stock",
    Total: language === "ar" ? "المجموع" : "Total",
    Remove: language === "ar" ? "إزالة" : "Remove",
    Attachments: language === "ar" ? "المرفقات" : "Attachments",
    "Upload Files": language === "ar" ? "رفع الملفات" : "Upload Files",
    "No files selected":
      language === "ar" ? "لم يتم اختيار ملفات" : "No files selected",
    "Basic Information":
      language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Additional Information":
      language === "ar" ? "معلومات إضافية" : "Additional Information",
    "Grand Total": language === "ar" ? "المجموع الإجمالي" : "Grand Total",
    "Total Items": language === "ar" ? "إجمالي العناصر" : "Total Items",
    "Please fill in all required fields":
      language === "ar"
        ? "يرجى ملء جميع الحقول المطلوبة"
        : "Please fill in all required fields",
    "Requisition saved successfully":
      language === "ar"
        ? "تم حفظ الطلب بنجاح"
        : "Requisition saved successfully",
    "Error saving requisition":
      language === "ar" ? "خطأ في حفظ الطلب" : "Error saving requisition",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "Required field": language === "ar" ? "حقل مطلوب" : "Required field",
    Optional: language === "ar" ? "اختياري" : "Optional",
    "Calculate Total": language === "ar" ? "احسب المجموع" : "Calculate Total",
    "Auto Calculate": language === "ar" ? "حساب تلقائي" : "Auto Calculate",
    "File uploaded successfully":
      language === "ar" ? "تم رفع الملف بنجاح" : "File uploaded successfully",
    "Error uploading file":
      language === "ar" ? "خطأ في رفع الملف" : "Error uploading file",
    "Remove file": language === "ar" ? "إزالة الملف" : "Remove file",
    "Download file": language === "ar" ? "تحميل الملف" : "Download file",
    "Supported formats":
      language === "ar" ? "الصيغ المدعومة" : "Supported formats",
  };

  // Get contexts
  const {
    createRequisition,
    updateRequisition,
    uploadAttachments,
    downloadAttachment,
    deleteAttachment,
    loading: requisitionLoading,
    error: requisitionError,
  } = useRequisition();

  const { getSuppliers, suppliers } = useSupplier
    ? useSupplier()
    : { getSuppliers: null, suppliers: null };

  const { dropdowns, getProductsDropdown } = useProductsManager();

  // Process data from contexts
  const productsDropdown = Array.isArray(dropdowns?.products)
    ? dropdowns.products
    : [];
  const suppliersData = Array.isArray(suppliers?.Data?.$values)
    ? suppliers.Data.$values
    : [];

  // Form state
  const [formData, setFormData] = useState({
    Number: "",
    Type: "",
    Date: new Date().toISOString().split("T")[0],
    JournalAccount: "",
    SupplierId: null,
    Notes: "",
  });

  // Items state
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    ProductId: "",
    UnitPrice: "",
    Qty: "",
    StockOnHand: "",
    NewStockOnHand: "",
    Total: "",
  });

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // UI state
  const [validationErrors, setValidationErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

  // Determine mode based on location state
  const editData = location.state?.editData;
  const cloneData = location.state?.cloneData;
  const isEditing = location.state?.isEditing && editData;
  const isCloning = cloneData && !isEditing;

  // Page title
  const pageTitle = isEditing
    ? translations["Edit Requisition"]
    : isCloning
    ? translations["Clone Requisition"]
    : translations["New Requisition"];

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        if (getSuppliers) {
          await getSuppliers();
        }
        if (getProductsDropdown) {
          await getProductsDropdown();
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    if (token) {
      loadData();
    }
  }, [token, getSuppliers, getProductsDropdown]);

  // Load edit/clone data
  useEffect(() => {
    if (editData) {
      setFormData({
        Number: editData.Number || "",
        Type: editData.Type || "",
        Date: editData.Date || new Date().toISOString().split("T")[0],
        JournalAccount: editData.JournalAccount || "",
        SupplierId: editData.SupplierId || null,
        Notes: editData.Notes || "",
      });

      if (editData.Items) {
        setItems(editData.Items);
      }

      if (editData.Attachments) {
        setUploadedAttachments(editData.Attachments);
      }
    } else if (cloneData) {
      setFormData({
        Number: "", // Clear number for clone
        Type: cloneData.Type || "",
        Date: new Date().toISOString().split("T")[0], // Use current date
        JournalAccount: cloneData.JournalAccount || "",
        SupplierId: cloneData.SupplierId || null,
        Notes: cloneData.Notes || "",
      });

      if (cloneData.Items) {
        setItems(cloneData.Items);
      }
      // Don't clone attachments
    }
  }, [editData, cloneData]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Item handlers
  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate total when unit price or quantity changes
      if (field === "UnitPrice" || field === "Qty") {
        const unitPrice =
          parseFloat(field === "UnitPrice" ? value : updated.UnitPrice) || 0;
        const qty = parseFloat(field === "Qty" ? value : updated.Qty) || 0;
        updated.Total = (unitPrice * qty).toFixed(2);
      }

      // Auto-calculate new stock when quantity changes
      if (field === "Qty" || field === "StockOnHand") {
        const stockOnHand =
          parseFloat(field === "StockOnHand" ? value : updated.StockOnHand) ||
          0;
        const qty = parseFloat(field === "Qty" ? value : updated.Qty) || 0;
        updated.NewStockOnHand = (stockOnHand + qty).toFixed(2);
      }

      return updated;
    });
  };

  const addItem = () => {
    const errors = {};

    if (!newItem.ProductId) errors.ProductId = translations["Required field"];
    if (!newItem.UnitPrice || parseFloat(newItem.UnitPrice) <= 0)
      errors.UnitPrice = translations["Required field"];
    if (!newItem.Qty || parseFloat(newItem.Qty) <= 0)
      errors.Qty = translations["Required field"];

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Check if product already exists in items
    const existingItemIndex = items.findIndex(
      (item) => item.ProductId === parseInt(newItem.ProductId)
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...items];
      const existingItem = updatedItems[existingItemIndex];
      const newQty = parseFloat(existingItem.Qty) + parseFloat(newItem.Qty);
      const newTotal = parseFloat(existingItem.UnitPrice) * newQty;

      updatedItems[existingItemIndex] = {
        ...existingItem,
        Qty: newQty.toString(),
        Total: newTotal.toFixed(2),
        NewStockOnHand: (parseFloat(existingItem.StockOnHand) + newQty).toFixed(
          2
        ),
      };

      setItems(updatedItems);
    } else {
      // Add new item
      setItems((prev) => [
        ...prev,
        {
          ...newItem,
          ProductId: parseInt(newItem.ProductId),
          Id: Date.now(), // Temporary ID for new items
        },
      ]);
    }

    // Reset form
    setNewItem({
      ProductId: "",
      UnitPrice: "",
      Qty: "",
      StockOnHand: "",
      NewStockOnHand: "",
      Total: "",
    });
    setShowItemForm(false);
    setValidationErrors({});
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // File handlers
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (requisitionId) => {
    if (selectedFiles.length === 0) return true;

    setUploadingFiles(true);
    try {
      const result = await uploadAttachments(requisitionId, selectedFiles);
      if (result && result.UploadedAttachments) {
        setUploadedAttachments((prev) => [
          ...prev,
          ...result.UploadedAttachments,
        ]);
        setSelectedFiles([]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error uploading files:", error);
      return false;
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDownloadAttachment = async (attachment) => {
    try {
      await downloadAttachment(
        editData?.Id,
        attachment.File,
        attachment.OriginalFileName
      );
    } catch (error) {
      console.error("Error downloading attachment:", error);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      const success = await deleteAttachment(editData?.Id, attachmentId);
      if (success) {
        setUploadedAttachments((prev) =>
          prev.filter((att) => att.Id !== attachmentId)
        );
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
  };

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!formData.Number.trim()) errors.Number = translations["Required field"];
    if (!formData.Type) errors.Type = translations["Required field"];
    if (!formData.Date) errors.Date = translations["Required field"];

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Calculate totals
  const calculateTotals = () => {
    // Ensure items is always an array
    const itemsArray = Array.isArray(items) ? items : [];
    const totalItems = itemsArray.length;
    const grandTotal = itemsArray.reduce((sum, item) => {
      return sum + parseFloat(item.Total || 0);
    }, 0);

    return { totalItems, grandTotal };
  };

  // Save requisition
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Structure the data exactly as shown in the curl command
      const requisitionData = {
        SupplierId: formData.SupplierId || undefined,
        Type: formData.Type,
        Date: formData.Date,
        JournalAccount: formData.JournalAccount || undefined,
        Number: formData.Number,
        Notes: formData.Notes || undefined,
        Items: items.map((item) => ({
          ProductId: item.ProductId,
          UnitPrice: parseFloat(item.UnitPrice),
          Qty: item.Qty.toString(), // Keep as string as expected by API
          StockOnHand: item.StockOnHand?.toString() || "0",
          NewStockOnHand: item.NewStockOnHand?.toString() || "0",
          Total: parseFloat(item.Total),
        })),
      };

      // Remove undefined values to clean the payload
      const cleanedData = Object.fromEntries(
        Object.entries(requisitionData).filter(
          ([_, value]) => value !== undefined
        )
      );

      let result;
      if (isEditing) {
        result = await updateRequisition(editData.Id, cleanedData);
      } else {
        result = await createRequisition(cleanedData);
      }

      if (result) {
        // Upload files if any
        if (selectedFiles.length > 0) {
          await uploadFiles(result.Id);
        }

        // alert(translations["Requisition saved successfully"]);
        navigate("/admin/Requsition-Manager");
      } else {
        alert(translations["Error saving requisition"]);
      }
    } catch (error) {
      console.error("Error saving requisition:", error);
      alert(translations["Error saving requisition"]);
    } finally {
      setSaving(false);
    }
  };

  // Get product name by ID
  const getProductName = (productId) => {
    const product = productsDropdown.find((p) => p.Id === productId);
    return product?.Name || `Product #${productId}`;
  };

  // Get supplier name by ID
  const getSupplierName = (supplierId) => {
    const supplier = suppliersData.find((s) => s.Id === supplierId);
    return supplier?.Name || `Supplier #${supplierId}`;
  };

  const { totalItems, grandTotal } = calculateTotals();

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
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
              onClick={() => navigate("/admin/new-requisition")}
            />
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            {isCloning && (
              <Span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Clone Mode
              </Span>
            )}
          </Container>
          <Container className="flex gap-3">
            <FilledButton
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Cancel}
              height="h-10"
              px="px-6"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={() => navigate("/admin/new-requisition")}
            />
            <FilledButton
              isIcon={true}
              icon={Save}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Save}
              height="h-10"
              px="px-6"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleSave}
              disabled={saving || requisitionLoading}
            />
          </Container>
        </Container>

        {/* Main Content */}
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <Container className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {translations["Basic Information"]}
              </h2>

              <Container className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requisition Number */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Requisition Number"]} *
                  </label>
                  <Container className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.Number}
                      onChange={(e) =>
                        handleInputChange("Number", e.target.value)
                      }
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.Number
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter requisition number"
                    />
                  </Container>
                  {validationErrors.Number && (
                    <Span className="text-red-500 text-sm mt-1">
                      {validationErrors.Number}
                    </Span>
                  )}
                </Container>

                {/* Type */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Type} *
                  </label>
                  <select
                    value={formData.Type}
                    onChange={(e) => handleInputChange("Type", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.Type
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">{translations["Select Type"]}</option>
                    <option value="Purchase">{translations.Purchase}</option>
                    <option value="Sale">{translations.Sale}</option>
                    <option value="Return">{translations.Return}</option>
                    <option value="Transfer">{translations.Transfer}</option>
                  </select>
                  {validationErrors.Type && (
                    <Span className="text-red-500 text-sm mt-1">
                      {validationErrors.Type}
                    </Span>
                  )}
                </Container>

                {/* Date */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Date} *
                  </label>
                  <Container className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.Date}
                      onChange={(e) =>
                        handleInputChange("Date", e.target.value)
                      }
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.Date
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                  </Container>
                  {validationErrors.Date && (
                    <Span className="text-red-500 text-sm mt-1">
                      {validationErrors.Date}
                    </Span>
                  )}
                </Container>

                {/* Supplier */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Supplier} ({translations.Optional})
                  </label>
                  <Container className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.SupplierId || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "SupplierId",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">
                        {translations["Select Supplier"]}
                      </option>
                      {suppliersData.map((supplier) => (
                        <option key={supplier.Id} value={supplier.Id}>
                          {supplier.Name}
                        </option>
                      ))}
                    </select>
                  </Container>
                </Container>
              </Container>

              {/* Journal Account & Notes */}
              <Container className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Journal Account"]} ({translations.Optional})
                  </label>
                  <input
                    type="text"
                    value={formData.JournalAccount}
                    onChange={(e) =>
                      handleInputChange("JournalAccount", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter journal account"
                  />
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Notes} ({translations.Optional})
                  </label>
                  <textarea
                    value={formData.Notes}
                    onChange={(e) => handleInputChange("Notes", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter notes"
                  />
                </Container>
              </Container>
            </Container>

            {/* Items Section */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Container className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {translations.Items}
                </h2>
                <FilledButton
                  isIcon={true}
                  icon={Plus}
                  iconSize="w-4 h-4"
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={translations["Add Item"]}
                  height="h-9"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={() => setShowItemForm(true)}
                />
              </Container>

              {/* Add Item Form */}
              {showItemForm && (
                <Container className="bg-gray-50 rounded-lg p-4 mb-4">
                  <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Product */}
                    <Container className="md:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.Product} *
                      </label>
                      <select
                        value={newItem.ProductId}
                        onChange={(e) =>
                          handleNewItemChange("ProductId", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.ProductId
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">
                          {translations["Select Product"]}
                        </option>
                        {productsDropdown.map((product) => (
                          <option key={product.Id} value={product.Id}>
                            {product.Name}
                          </option>
                        ))}
                      </select>
                      {validationErrors.ProductId && (
                        <Span className="text-red-500 text-sm mt-1">
                          {validationErrors.ProductId}
                        </Span>
                      )}
                    </Container>

                    {/* Unit Price */}
                    <Container>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["Unit Price"]} *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newItem.UnitPrice}
                        onChange={(e) =>
                          handleNewItemChange("UnitPrice", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.UnitPrice
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                      {validationErrors.UnitPrice && (
                        <Span className="text-red-500 text-sm mt-1">
                          {validationErrors.UnitPrice}
                        </Span>
                      )}
                    </Container>

                    {/* Quantity */}
                    <Container>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.Quantity} *
                      </label>
                      <input
                        type="number"
                        value={newItem.Qty}
                        onChange={(e) =>
                          handleNewItemChange("Qty", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.Qty
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="1"
                      />
                      {validationErrors.Qty && (
                        <Span className="text-red-500 text-sm mt-1">
                          {validationErrors.Qty}
                        </Span>
                      )}
                    </Container>

                    {/* Stock on Hand */}
                    <Container>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["Stock on Hand"]}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newItem.StockOnHand}
                        onChange={(e) =>
                          handleNewItemChange("StockOnHand", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </Container>

                    {/* New Stock */}
                    <Container>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["New Stock"]}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newItem.NewStockOnHand}
                        onChange={(e) =>
                          handleNewItemChange("NewStockOnHand", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </Container>

                    {/* Total */}
                    <Container>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.Total}
                      </label>
                      <Container className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={newItem.Total}
                          onChange={(e) =>
                            handleNewItemChange("Total", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                        />
                        <Calculator className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </Container>
                    </Container>
                  </Container>

                  <Container className="flex gap-3 mt-4">
                    <FilledButton
                      isIcon={true}
                      icon={CheckCircle}
                      iconSize="w-4 h-4"
                      bgColor="bg-green-600 hover:bg-green-700"
                      textColor="text-white"
                      rounded="rounded-lg"
                      buttonText={translations["Add Item"]}
                      height="h-9"
                      px="px-4"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      isIconLeft={true}
                      onClick={addItem}
                    />
                    <FilledButton
                      isIcon={true}
                      icon={X}
                      iconSize="w-4 h-4"
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-lg"
                      buttonText={translations.Cancel}
                      height="h-9"
                      px="px-4"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      isIconLeft={true}
                      onClick={() => {
                        setShowItemForm(false);
                        setValidationErrors({});
                      }}
                    />
                  </Container>
                </Container>
              )}

              {/* Items List */}
              {items.length > 0 ? (
                <Container className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.Product}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations["Unit Price"]}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.Quantity}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations["Stock on Hand"]}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations["New Stock"]}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.Total}
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.Actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Container>
                              <Span className="text-sm font-medium text-gray-900">
                                {getProductName(item.ProductId)}
                              </Span>
                              <Span className="text-xs text-gray-500 block">
                                ID: {item.ProductId}
                              </Span>
                            </Container>
                          </td>
                          <td className="px-4 py-3">
                            <Span className="text-sm text-gray-900">
                              ${item.UnitPrice}
                            </Span>
                          </td>
                          <td className="px-4 py-3">
                            <Span className="text-sm text-gray-900">
                              {item.Qty}
                            </Span>
                          </td>
                          <td className="px-4 py-3">
                            <Span className="text-sm text-gray-900">
                              {item.StockOnHand || "0"}
                            </Span>
                          </td>
                          <td className="px-4 py-3">
                            <Span className="text-sm text-gray-900">
                              {item.NewStockOnHand || "0"}
                            </Span>
                          </td>
                          <td className="px-4 py-3">
                            <Span className="text-sm font-medium text-green-600">
                              ${item.Total}
                            </Span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => removeItem(index)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                              title={translations.Remove}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Container>
              ) : (
                <Container className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Span className="text-gray-500">No items added yet</Span>
                </Container>
              )}
            </Container>

            {/* Attachments Section */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {translations.Attachments}
              </h2>

              {/* File Upload */}
              <Container className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Upload Files"]} ({translations.Optional})
                </label>
                <Container className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Span className="text-sm text-gray-600 block mb-1">
                      Click to upload files or drag and drop
                    </Span>
                    <Span className="text-xs text-gray-500">
                      {translations["Supported formats"]}: PDF, DOC, DOCX, JPG,
                      PNG (Max 10MB)
                    </Span>
                  </label>
                </Container>
              </Container>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <Container className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Files:
                  </h4>
                  <Container className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <Container
                        key={index}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <Container className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <Span className="text-sm text-gray-900">
                            {file.name}
                          </Span>
                          <Span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </Span>
                        </Container>
                        <button
                          onClick={() => removeSelectedFile(index)}
                          className="text-red-500 hover:text-red-700"
                          title={translations["Remove file"]}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Container>
                    ))}
                  </Container>
                </Container>
              )}

              {/* Uploaded Attachments (for edit mode) */}
              {uploadedAttachments.length > 0 && (
                <Container>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Attachments:
                  </h4>
                  <Container className="space-y-2">
                    {uploadedAttachments.map((attachment, index) => (
                      <Container
                        key={index}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                      >
                        <Container className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-500" />
                          <Span className="text-sm text-gray-900">
                            {attachment.OriginalFileName || attachment.File}
                          </Span>
                        </Container>
                        <Container className="flex items-center gap-1">
                          {isEditing && (
                            <>
                              <button
                                onClick={() =>
                                  handleDownloadAttachment(attachment)
                                }
                                className="p-1 text-blue-500 hover:text-blue-700"
                                title={translations["Download file"]}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteAttachment(attachment.Id)
                                }
                                className="p-1 text-red-500 hover:text-red-700"
                                title={translations["Remove file"]}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </Container>
                      </Container>
                    ))}
                  </Container>
                </Container>
              )}

              {selectedFiles.length === 0 &&
                uploadedAttachments.length === 0 && (
                  <Container className="text-center py-4">
                    <FileX className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Span className="text-gray-500 text-sm">
                      {translations["No files selected"]}
                    </Span>
                  </Container>
                )}
            </Container>
          </Container>

          {/* Right Column - Summary */}
          <Container className="space-y-6">
            {/* Summary Card */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Summary
              </h3>

              <Container className="space-y-4">
                <Container className="flex justify-between items-center py-2 border-b border-gray-200">
                  <Span className="text-sm text-gray-600">
                    {translations["Total Items"]}
                  </Span>
                  <Span className="text-sm font-medium text-gray-900">
                    {totalItems}
                  </Span>
                </Container>

                <Container className="flex justify-between items-center py-2">
                  <Span className="text-base font-medium text-gray-900">
                    {translations["Grand Total"]}
                  </Span>
                  <Span className="text-lg font-bold text-green-600">
                    ${grandTotal.toFixed(2)}
                  </Span>
                </Container>
              </Container>

              {formData.SupplierId && (
                <Container className="mt-4 pt-4 border-t border-gray-200">
                  <Span className="text-sm text-gray-600">
                    Selected Supplier:
                  </Span>
                  <Span className="text-sm font-medium text-gray-900 block">
                    {getSupplierName(formData.SupplierId)}
                  </Span>
                </Container>
              )}
            </Container>

            {/* Quick Actions */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>

              <Container className="space-y-3">
                <FilledButton
                  isIcon={true}
                  icon={Plus}
                  iconSize="w-4 h-4"
                  bgColor="bg-blue-50 hover:bg-blue-100"
                  textColor="text-blue-700"
                  rounded="rounded-lg"
                  buttonText={translations["Add Item"]}
                  height="h-9"
                  width="w-full"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={() => setShowItemForm(true)}
                />

                <FilledButton
                  isIcon={true}
                  icon={Upload}
                  iconSize="w-4 h-4"
                  bgColor="bg-purple-50 hover:bg-purple-100"
                  textColor="text-purple-700"
                  rounded="rounded-lg"
                  buttonText={translations["Upload Files"]}
                  height="h-9"
                  width="w-full"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={() => document.getElementById("file-upload").click()}
                />
              </Container>
            </Container>

            {/* Form Status */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Form Status
              </h3>

              <Container className="space-y-3">
                <Container className="flex items-center gap-2">
                  {formData.Number && formData.Type && formData.Date ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                  <Span className="text-sm text-gray-600">
                    Basic Information
                  </Span>
                </Container>

                <Container className="flex items-center gap-2">
                  {items.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <Span className="text-sm text-gray-600">
                    Items ({items.length})
                  </Span>
                </Container>

                <Container className="flex items-center gap-2">
                  {selectedFiles.length > 0 ||
                  uploadedAttachments.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <Span className="text-sm text-gray-600">
                    Attachments (
                    {selectedFiles.length + uploadedAttachments.length})
                  </Span>
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>

        {/* Error Display */}
        {requisitionError && (
          <Container className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Container className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <Span className="text-red-700">{requisitionError}</Span>
            </Container>
          </Container>
        )}

        {/* Loading Overlay */}
        {(saving || requisitionLoading || uploadingFiles) && (
          <Container className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Container className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <Span className="text-gray-900">
                {saving
                  ? "Saving requisition..."
                  : uploadingFiles
                  ? "Uploading files..."
                  : translations.Loading}
              </Span>
            </Container>
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default NewRequisition;
