import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Copy,
  Trash2,
  Plus,
  X,
  User,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Package,
  Settings,
  Calculator,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronDown,
  Percent,
  Hash,
} from "lucide-react";

// Context imports
import { useInvoices } from "../../Contexts/InvoiceContext/InvoiceContext";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
import { useService } from "../../Contexts/ServiceContext/ServiceContext";
import { useProductsManager } from "../../Contexts/ProductsManagerContext/ProductsManagerContext";

// Component imports
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";
import Modall from "../../components/elements/modal/Modal";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  // Determine if we're editing or creating
  const isEditing = !!id;
  const editData = location.state?.editData;
  const cloneData = location.state?.cloneData;
  console.log("editData---->", editData);

  const translations = {
    "Create Invoice": language === "ar" ? "إنشاء فاتورة" : "Create Invoice",
    "Edit Invoice": language === "ar" ? "تعديل فاتورة" : "Edit Invoice",
    "Invoice Details":
      language === "ar" ? "تفاصيل الفاتورة" : "Invoice Details",
    "Client Information":
      language === "ar" ? "معلومات العميل" : "Client Information",
    "Invoice Items": language === "ar" ? "عناصر الفاتورة" : "Invoice Items",
    "Payment & Terms": language === "ar" ? "الدفع والشروط" : "Payment & Terms",
    "Invoice Summary": language === "ar" ? "ملخص الفاتورة" : "Invoice Summary",
    "Select Client": language === "ar" ? "اختر العميل" : "Select Client",
    "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
    "Invoice Date": language === "ar" ? "تاريخ الفاتورة" : "Invoice Date",
    "Due Date": language === "ar" ? "تاريخ الاستحقاق" : "Due Date",
    Status: language === "ar" ? "الحالة" : "Status",
    Currency: language === "ar" ? "العملة" : "Currency",
    "Add Item": language === "ar" ? "إضافة عنصر" : "Add Item",
    "Product/Service": language === "ar" ? "منتج/خدمة" : "Product/Service",
    Description: language === "ar" ? "الوصف" : "Description",
    Quantity: language === "ar" ? "الكمية" : "Quantity",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    Discount: language === "ar" ? "الخصم" : "Discount",
    Tax: language === "ar" ? "الضريبة" : "Tax",
    Total: language === "ar" ? "المجموع" : "Total",
    Subtotal: language === "ar" ? "المجموع الفرعي" : "Subtotal",
    "Tax Amount": language === "ar" ? "مبلغ الضريبة" : "Tax Amount",
    "Discount Amount": language === "ar" ? "مبلغ الخصم" : "Discount Amount",
    "Grand Total": language === "ar" ? "المجموع الكلي" : "Grand Total",
    "Payment Terms": language === "ar" ? "شروط الدفع" : "Payment Terms",
    Notes: language === "ar" ? "ملاحظات" : "Notes",
    "Internal Notes": language === "ar" ? "ملاحظات داخلية" : "Internal Notes",
    "Save Draft": language === "ar" ? "حفظ المسودة" : "Save Draft",
    "Save & Send": language === "ar" ? "حفظ وإرسال" : "Save & Send",
    Preview: language === "ar" ? "معاينة" : "Preview",
    Delete: language === "ar" ? "حذف" : "Delete",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "Search clients...":
      language === "ar" ? "البحث عن العملاء..." : "Search clients...",
    "Search products...":
      language === "ar" ? "البحث عن المنتجات..." : "Search products...",
    Draft: language === "ar" ? "مسودة" : "Draft",
    Sent: language === "ar" ? "مرسل" : "Sent",
    Paid: language === "ar" ? "مدفوع" : "Paid",
    Overdue: language === "ar" ? "متأخر" : "Overdue",
    "Back to Invoices":
      language === "ar" ? "العودة للفواتير" : "Back to Invoices",
    Required: language === "ar" ? "مطلوب" : "Required",
    Invalid: language === "ar" ? "غير صالح" : "Invalid",
    Success: language === "ar" ? "نجح" : "Success",
    Error: language === "ar" ? "خطأ" : "Error",
    Percentage: language === "ar" ? "نسبة مئوية" : "Percentage",
    Fixed: language === "ar" ? "ثابت" : "Fixed",
    "Auto Generate": language === "ar" ? "توليد تلقائي" : "Auto Generate",
    "PO Number": language === "ar" ? "رقم أمر الشراء" : "PO Number",
    "Exchange Rate": language === "ar" ? "سعر الصرف" : "Exchange Rate",
    Item: language === "ar" ? "عنصر" : "Item",
    Remove: language === "ar" ? "إزالة" : "Remove",
    "Line Total": language === "ar" ? "إجمالي الخط" : "Line Total",
  };

  // Context hooks
  const {
    currentInvoice,
    loading: invoiceLoading,
    error: invoiceError,
    createInvoice,
    updateInvoice,
    getInvoice,
    sendInvoice,
    duplicateInvoice,
    deleteInvoice,
    getClientDetails,
    clientDetails,
    clearCurrentInvoice,
    clearError,
  } = useInvoices();

  const {
    clients,
    searchClients,
    getClients,
    loading: clientsLoading,
  } = useClients();

  // Services context
  const {
    services,
    getServices,
    searchServices,
    loading: servicesLoading,
  } = useService();

  // Products context
  const {
    products,
    getProducts,
    searchProducts,
    loading: productsLoading,
  } = useProductsManager();

  // Form state
  const [formData, setFormData] = useState({
    clientId: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "Draft",
    currency: "USD",
    exchangeRate: 1,
    paymentTerms: "",
    notes: "",
    internalNotes: "",
    purchaseOrderNumber: "",
    items: [],
    discountAmount: 0,
    shippingAmount: 0,
  });

  // UI state
  const [activeTab, setActiveTab] = useState("details");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(null);
  const [clientSearch, setClientSearch] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [totals, setTotals] = useState({
    subtotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    grandTotal: 0,
  });

  // Mock data for products/services (replace with actual context)
  const [allItems, setAllItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");

  // Load initial data
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
      return;
    }

    const loadInitialData = async () => {
      try {
        // Load clients
        await getClients();

        // Load services
        await getServices();

        // Load products
        await getProducts();

        // If editing, load invoice data
        if (isEditing && id) {
          await getInvoice(parseInt(id));
        }

        // If cloning, set form data
        if (cloneData) {
          setFormData({
            ...cloneData,
            id: undefined,
            invoiceNumber: "",
            status: "Draft",
            invoiceDate: new Date().toISOString().split("T")[0],
          });
        }

        // If editing, populate form
        if (editData) {
          setFormData(editData);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [token, id, isEditing, cloneData, editData]);

  // Update form when invoice data changes
  useEffect(() => {
    if (currentInvoice && isEditing) {
      setFormData({
        clientId: currentInvoice.ClientId || "",
        invoiceNumber: currentInvoice.InvoiceNumber || "",
        invoiceDate: currentInvoice.InvoiceDate
          ? new Date(currentInvoice.InvoiceDate).toISOString().split("T")[0]
          : "",
        dueDate: currentInvoice.DueDate
          ? new Date(currentInvoice.DueDate).toISOString().split("T")[0]
          : "",
        status: currentInvoice.Status || "Draft",
        currency: currentInvoice.Currency || "USD",
        exchangeRate: currentInvoice.ExchangeRate || 1,
        paymentTerms: currentInvoice.PaymentTerms || "",
        notes: currentInvoice.Notes || "",
        internalNotes: currentInvoice.InternalNotes || "",
        purchaseOrderNumber: currentInvoice.PurchaseOrderNumber || "",
        items: currentInvoice.Items || [],
        discountAmount: currentInvoice.DiscountAmount || 0,
        shippingAmount: currentInvoice.ShippingAmount || 0,
      });
    }
  }, [currentInvoice, isEditing]);

  // Combine products and services into unified items array
  useEffect(() => {
    const productItems = (products?.Data?.$values || []).map((product) => ({
      id: product.Id,
      name: product.Name,
      price: product.UnitPrice || 0,
      type: "product",
      taxRate: product.TaxRate || 0,
      description: product.Description || "",
    }));

    const serviceItems = (services?.Data?.$values || []).map((service) => ({
      id: service.Id,
      name: service.Name,
      price: service.UnitPrice || 0,
      type: "service",
      taxRate: service.TaxRate || 0,
      description: service.Description || "",
    }));

    setAllItems([...productItems, ...serviceItems]);
  }, [products, services]);

  // Calculate totals whenever items change
  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.discountAmount, formData.shippingAmount]);

  // Get selected client info
  useEffect(() => {
    if (formData.clientId) {
      const client = clients.find((c) => c.Id === parseInt(formData.clientId));
      setSelectedClient(client);
      if (client) {
        getClientDetails(client.Id);
      }
    }
  }, [formData.clientId, clients]);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = formData?.items?.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const totalDiscount = formData?.items?.reduce((sum, item) => {
      const lineAmount = item.quantity * item.unitPrice;
      const discountAmount =
        item.discountType === "percentage"
          ? (lineAmount * (item.discount || 0)) / 100
          : item.discount || 0;
      return sum + discountAmount;
    }, 0);

    const afterDiscount = subtotal - totalDiscount;

    const totalTax = formData?.items?.reduce((sum, item) => {
      const lineAmount = item.quantity * item.unitPrice;
      const itemDiscount =
        item.discountType === "percentage"
          ? (lineAmount * (item.discount || 0)) / 100
          : item.discount || 0;
      const taxableAmount = lineAmount - itemDiscount;
      return sum + (taxableAmount * (item.taxRate || 0)) / 100;
    }, 0);

    const grandTotal =
      afterDiscount +
      totalTax +
      (formData.shippingAmount || 0) -
      (formData.discountAmount || 0);

    setTotals({
      subtotal,
      totalTax,
      totalDiscount,
      grandTotal,
    });
  }, [formData.items, formData.discountAmount, formData.shippingAmount]);

  // Handle form input changes
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

  // Handle client selection
  const handleClientSelect = (client) => {
    setFormData((prev) => ({
      ...prev,
      clientId: client.Id,
      currency: client.Currency || "USD",
      paymentTerms: client.PaymentTerms || "",
    }));
    setShowClientDropdown(false);
    setClientSearch("");
  };

  // Add new item
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      productId: null,
      serviceId: null,
      itemName: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: "percentage",
      taxRate: 0,
      lineTotal: 0,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Update item
  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Calculate line total
    const item = updatedItems[index];
    const lineAmount = item.quantity * item.unitPrice;
    const discountAmount =
      item.discountType === "percentage"
        ? (lineAmount * (item.discount || 0)) / 100
        : item.discount || 0;
    const taxableAmount = lineAmount - discountAmount;
    const taxAmount = (taxableAmount * (item.taxRate || 0)) / 100;
    item.lineTotal = taxableAmount + taxAmount;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Remove item
  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Select product/service for item
  const selectItem = (index, item) => {
    if (item.type === "product") {
      updateItem(index, "productId", item.id);
      updateItem(index, "serviceId", null);
    } else {
      updateItem(index, "serviceId", item.id);
      updateItem(index, "productId", null);
    }
    updateItem(index, "itemName", item.name);
    updateItem(index, "description", item.description);
    updateItem(index, "unitPrice", item.price);
    updateItem(index, "taxRate", item.taxRate);
    setShowProductDropdown(null);
    setItemSearch("");
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.clientId) {
      errors.clientId = translations.Required;
    }

    if (!formData.invoiceDate) {
      errors.invoiceDate = translations.Required;
    }

    if (formData.items.length === 0) {
      errors.items = "At least one item is required";
    }

    formData.items.forEach((item, index) => {
      if (!item.itemName) {
        errors[`item_${index}_name`] = translations.Required;
      }
      if (item.quantity <= 0) {
        errors[`item_${index}_quantity`] = "Quantity must be greater than 0";
      }
      if (item.unitPrice < 0) {
        errors[`item_${index}_price`] = "Price cannot be negative";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (action = "draft") => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        status: action === "send" ? "Sent" : formData.status,
        items: formData?.items?.map((item) => ({
          productId: item.productId,
          serviceId: item.serviceId,
          itemName: item.itemName,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          discountType: item.discountType,
          taxRate: item.taxRate,
        })),
      };

      let result;
      if (isEditing) {
        result = await updateInvoice(id, submitData);
      } else {
        result = await createInvoice(submitData);
      }

      if (result) {
        // If sending invoice, also send it
        if (action === "send" && result.data?.Id) {
          await sendInvoice(result.data.Id);
        }

        navigate("/admin/invoices", {
          state: {
            message: isEditing
              ? "Invoice updated successfully"
              : "Invoice created successfully",
            type: "success",
          },
        });
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!currentInvoice?.Id) return;

    try {
      await deleteInvoice(currentInvoice.Id);
      navigate("/admin/invoices", {
        state: {
          message: "Invoice deleted successfully",
          type: "success",
        },
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  // Filtered clients for search
  const filteredClients = clients.filter(
    (client) =>
      client.FullName?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.BusinessName?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.Email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Filtered items for search
  const filteredItems = allItems.filter(
    (item) =>
      item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(itemSearch.toLowerCase())
  );

  // Loading state
  if (invoiceLoading && isEditing) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <Span className="text-blue-500 text-lg ml-4">
          {translations.Loading}
        </Span>
      </Container>
    );
  }

  console.log("This is the form data ", formData);

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
            <Container>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing
                  ? translations["Edit Invoice"]
                  : translations["Create Invoice"]}
              </h1>
              <Span className="text-sm text-gray-500">
                {isEditing && formData.invoiceNumber
                  ? `#${formData.invoiceNumber}`
                  : translations["Invoice Details"]}
              </Span>
            </Container>
          </Container>

          <Container className="flex gap-3">
            <FilledButton
              isIcon={true}
              icon={Eye}
              iconSize="w-4 h-4"
              bgColor="bg-gray-600 hover:bg-gray-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Preview}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => {
                /* Handle preview */
              }}
            />

            <FilledButton
              isIcon={true}
              icon={Save}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Save Draft"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
            />

            <FilledButton
              isIcon={true}
              icon={Send}
              iconSize="w-4 h-4"
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Save & Send"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => handleSubmit("send")}
              disabled={isSubmitting}
            />

            {isEditing && (
              <FilledButton
                isIcon={true}
                icon={Trash2}
                iconSize="w-4 h-4"
                bgColor="bg-red-600 hover:bg-red-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={translations.Delete}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={() => setShowDeleteModal(true)}
              />
            )}
          </Container>
        </Container>

        {/* Main Content */}
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <Container className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {translations["Client Information"]}
              </h3>

              <Container className="space-y-4">
                {/* Client Selection */}
                <Container className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Select Client"]} *
                  </label>
                  <Container className="relative">
                    <button
                      type="button"
                      onClick={() => setShowClientDropdown(!showClientDropdown)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {selectedClient ? (
                        <Span className="block truncate">
                          {selectedClient.FullName ||
                            selectedClient.BusinessName}{" "}
                          ({selectedClient.Email})
                        </Span>
                      ) : (
                        <Span className="block truncate text-gray-500">
                          {translations["Select Client"]}
                        </Span>
                      )}
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </button>

                    {showClientDropdown && (
                      <Container className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        <Container className="p-3">
                          <Container className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder={translations["Search clients..."]}
                              value={clientSearch}
                              onChange={(e) => setClientSearch(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </Container>
                        </Container>
                        {filteredClients.map((client) => (
                          <button
                            key={client.Id}
                            onClick={() => handleClientSelect(client)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                          >
                            <Container className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </Container>
                            <Container className="flex-1 min-w-0">
                              <Span className="block text-sm font-medium text-gray-900 truncate">
                                {client.FullName || client.BusinessName}
                              </Span>
                              <Span className="block text-xs text-gray-500 truncate">
                                {client.Email}
                              </Span>
                            </Container>
                          </button>
                        ))}
                      </Container>
                    )}
                  </Container>
                  {validationErrors.clientId && (
                    <Span className="text-red-500 text-sm mt-1">
                      {validationErrors.clientId}
                    </Span>
                  )}
                </Container>

                {/* Client Details Preview */}
                {selectedClient && (
                  <Container className="bg-gray-50 rounded-lg p-4">
                    <Container className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Container>
                        <Span className="text-sm text-gray-500">Name</Span>
                        <Span className="block font-medium text-gray-900">
                          {selectedClient.FullName ||
                            selectedClient.BusinessName}
                        </Span>
                      </Container>
                      <Container>
                        <Span className="text-sm text-gray-500">Email</Span>
                        <Span className="block font-medium text-gray-900">
                          {selectedClient.Email}
                        </Span>
                      </Container>
                      {selectedClient.Phone && (
                        <Container>
                          <Span className="text-sm text-gray-500">Phone</Span>
                          <Span className="block font-medium text-gray-900">
                            {selectedClient.Phone}
                          </Span>
                        </Container>
                      )}
                      {selectedClient.Address && (
                        <Container>
                          <Span className="text-sm text-gray-500">Address</Span>
                          <Span className="block font-medium text-gray-900">
                            {selectedClient.Address}
                          </Span>
                        </Container>
                      )}
                    </Container>
                  </Container>
                )}
              </Container>
            </Container>

            {/* Invoice Details */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {translations["Invoice Details"]}
              </h3>

              <Container className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Invoice Number */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Invoice Number"]}
                  </label>
                  <Container className="relative">
                    <input
                      type="text"
                      value={formData.invoiceNumber}
                      onChange={(e) =>
                        handleInputChange("invoiceNumber", e.target.value)
                      }
                      placeholder={translations["Auto Generate"]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Hash className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </Container>
                </Container>

                {/* Status */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Status}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Draft">{translations.Draft}</option>
                    <option value="Sent">{translations.Sent}</option>
                    <option value="Paid">{translations.Paid}</option>
                  </select>
                </Container>

                {/* Invoice Date */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Invoice Date"]} *
                  </label>
                  <Container className="relative">
                    <input
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) =>
                        handleInputChange("invoiceDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Calendar className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </Container>
                  {validationErrors.invoiceDate && (
                    <Span className="text-red-500 text-sm mt-1">
                      {validationErrors.invoiceDate}
                    </Span>
                  )}
                </Container>

                {/* Due Date */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Due Date"]}
                  </label>
                  <Container className="relative">
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Calendar className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </Container>
                </Container>

                {/* Currency */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Currency}
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="SAR">SAR</option>
                  </select>
                </Container>

                {/* PO Number */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["PO Number"]}
                  </label>
                  <input
                    type="text"
                    value={formData.purchaseOrderNumber}
                    onChange={(e) =>
                      handleInputChange("purchaseOrderNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>
              </Container>
            </Container>

            {/* Invoice Items */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Container className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {translations["Invoice Items"]}
                </h3>
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

              <Container className="space-y-4">
                {formData?.items?.length === 0 && (
                  <Container className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <Span className="text-gray-500">
                      No items added yet. Click "Add Item" to get started.
                    </Span>
                  </Container>
                )}
              </Container>
            </Container>

            {/* Additional Information */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {translations["Payment & Terms"]}
              </h3>

              <Container className="space-y-4">
                {/* Payment Terms */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Payment Terms"]}
                  </label>
                  <textarea
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      handleInputChange("paymentTerms", e.target.value)
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Payment terms and conditions..."
                  />
                </Container>

                {/* Notes */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Notes}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Notes visible to client..."
                  />
                </Container>

                {/* Internal Notes */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Internal Notes"]}
                  </label>
                  <textarea
                    value={formData.internalNotes}
                    onChange={(e) =>
                      handleInputChange("internalNotes", e.target.value)
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Internal notes (not visible to client)..."
                  />
                </Container>
              </Container>
            </Container>
          </Container>

          {/* Right Column - Summary */}
          <Container className="lg:col-span-1">
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {translations["Invoice Summary"]}
              </h3>

              <Container className="space-y-4">
                {/* Subtotal */}
                <Container className="flex justify-between">
                  <Span className="text-gray-600">
                    {translations.Subtotal}:
                  </Span>
                  <Span className="font-medium">
                    {formData.currency} {totals.subtotal}
                  </Span>
                </Container>

                {/* Discount */}
                <Container className="flex justify-between">
                  <Span className="text-gray-600">
                    {translations.Discount}:
                  </Span>
                  <Span className="font-medium text-red-600">
                    -{formData.currency} {totals.totalDiscount}
                  </Span>
                </Container>

                {/* Tax */}
                <Container className="flex justify-between">
                  <Span className="text-gray-600">
                    {translations["Tax Amount"]}:
                  </Span>
                  <Span className="font-medium">
                    {formData.currency} {totals.totalTax}
                  </Span>
                </Container>

                {/* Additional Discount */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Discount Amount"]}
                  </label>
                  <Container className="relative">
                    <input
                      type="number"
                      value={formData.discountAmount}
                      onChange={(e) =>
                        handleInputChange(
                          "discountAmount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <DollarSign className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </Container>
                </Container>

                {/* Shipping */}
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Amount
                  </label>
                  <Container className="relative">
                    <input
                      type="number"
                      value={formData.shippingAmount}
                      onChange={(e) =>
                        handleInputChange(
                          "shippingAmount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <DollarSign className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </Container>
                </Container>

                <hr className="border-gray-200" />

                {/* Grand Total */}
                <Container className="flex justify-between items-center">
                  <Span className="text-lg font-semibold text-gray-900">
                    {translations["Grand Total"]}:
                  </Span>
                  <Span className="text-xl font-bold text-blue-600">
                    {formData.currency} {totals.grandTotal}
                  </Span>
                </Container>

                <hr className="border-gray-200" />

                {/* Action Buttons */}
                <Container className="space-y-3">
                  <FilledButton
                    isIcon={true}
                    icon={Save}
                    iconSize="w-4 h-4"
                    bgColor="bg-blue-600 hover:bg-blue-700"
                    textColor="text-white"
                    rounded="rounded-lg"
                    buttonText={translations["Save Draft"]}
                    height="h-10"
                    width="w-full"
                    fontWeight="font-medium"
                    fontSize="text-sm"
                    isIconLeft={true}
                    onClick={() => handleSubmit("draft")}
                    disabled={isSubmitting}
                  />

                  <FilledButton
                    isIcon={true}
                    icon={Send}
                    iconSize="w-4 h-4"
                    bgColor="bg-green-600 hover:bg-green-700"
                    textColor="text-white"
                    rounded="rounded-lg"
                    buttonText={translations["Save & Send"]}
                    height="h-10"
                    width="w-full"
                    fontWeight="font-medium"
                    fontSize="text-sm"
                    isIconLeft={true}
                    onClick={() => handleSubmit("send")}
                    disabled={isSubmitting}
                  />
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Delete Confirmation Modal */}
      {isEditing && (
        <Modall
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          title={
            <Container className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              <Span>Delete Invoice</Span>
            </Container>
          }
          width={500}
          okText={translations.Delete}
          cancelText={translations.Cancel}
          okAction={handleDelete}
          cancelAction={() => setShowDeleteModal(false)}
          body={
            <Container className="text-center py-4">
              <Container className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </Container>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Are you sure?
              </h3>
              <Span className="text-gray-500 mb-4 block">
                This action cannot be undone. This will permanently delete the
                invoice <strong>"{formData.invoiceNumber}"</strong> and all
                associated data.
              </Span>
            </Container>
          }
        />
      )}
    </Container>
  );
};

export default InvoiceForm;
