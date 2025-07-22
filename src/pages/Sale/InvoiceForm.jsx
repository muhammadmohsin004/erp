import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  X,
  User,
  Package,
  Search,
  ChevronDown,
  Calendar,
  DollarSign,
  FileText,
  Calculator,
  AlertCircle,
  CheckCircle,
  Loader2,
  Building2,
  Hash,
  Percent,
  Trash2,
} from "lucide-react";

// Context imports
import { useInvoices } from "../../Contexts/InvoiceContext/InvoiceContext";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
import { useService } from "../../Contexts/ServiceContext/ServiceContext";
import { useProductsManager } from "../../Contexts/ProductsManagerContext/ProductsManagerContext";

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && value.$values && Array.isArray(value.$values)) {
    return value.$values;
  }
  if (value && value.Data && Array.isArray(value.Data)) {
    return value.Data;
  }
  if (value && value.data && Array.isArray(value.data)) {
    return value.data;
  }
  return [];
};

const DaftraInvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const isEditing = !!id;
  const editData = location.state?.editData;
  const cloneData = location.state?.cloneData;
  console.log("editData---->", editData);

  const translations = {
    "Create Invoice": language === "ar" ? "إنشاء فاتورة" : "Create Invoice",
    "Edit Invoice": language === "ar" ? "تعديل فاتورة" : "Edit Invoice",
    Client: language === "ar" ? "العميل" : "Client",
    "Select Client": language === "ar" ? "اختر العميل" : "Select Client",
    "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
    "Issue Date": language === "ar" ? "تاريخ الإصدار" : "Issue Date",
    "Due Date": language === "ar" ? "تاريخ الاستحقاق" : "Due Date",
    Status: language === "ar" ? "الحالة" : "Status",
    Item: language === "ar" ? "العنصر" : "Item",
    Description: language === "ar" ? "الوصف" : "Description",
    Qty: language === "ar" ? "الكمية" : "Qty",
    Price: language === "ar" ? "السعر" : "Price",
    Discount: language === "ar" ? "الخصم" : "Discount",
    Tax: language === "ar" ? "الضريبة" : "Tax",
    Amount: language === "ar" ? "المبلغ" : "Amount",
    Draft: language === "ar" ? "مسودة" : "Draft",
    Sent: language === "ar" ? "مرسل" : "Sent",
    Paid: language === "ar" ? "مدفوع" : "Paid",
    "Save Invoice": language === "ar" ? "حفظ الفاتورة" : "Save Invoice",
    "Add Item": language === "ar" ? "إضافة عنصر" : "Add Item",
    Subtotal: language === "ar" ? "المجموع الفرعي" : "Subtotal",
    "Grand Total": language === "ar" ? "المجموع الكلي" : "Grand Total",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    Required: language === "ar" ? "مطلوب" : "Required",
    "Search items...":
      language === "ar" ? "البحث في العناصر..." : "Search items...",
    "Search clients...":
      language === "ar" ? "البحث في العملاء..." : "Search clients...",
    "No items found":
      language === "ar" ? "لم يتم العثور على عناصر" : "No items found",
    "Select item": language === "ar" ? "اختر عنصر" : "Select item",
    "Auto-generated":
      language === "ar" ? "يتم إنشاؤه تلقائياً" : "Auto-generated",
    "Select Items": language === "ar" ? "اختيار العناصر" : "Select Items",
    "Add Selected Items":
      language === "ar" ? "إضافة العناصر المحددة" : "Add Selected Items",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    Products: language === "ar" ? "المنتجات" : "Products",
    Services: language === "ar" ? "الخدمات" : "Services",
    All: language === "ar" ? "الكل" : "All",
  };

  // Context hooks
  const {
    currentInvoice,
    loading: invoiceLoading,
    createInvoice,
    updateInvoice,
    getInvoice,
    sendInvoice,
    clearCurrentInvoice,
  } = useInvoices();

  const { clients = [], getClients, loading: clientsLoading } = useClients();

  const { services = [], getServices, loading: servicesLoading } = useService();

  const {
    products = [],
    getProducts,
    loading: productsLoading,
  } = useProductsManager();

  const [formData, setFormData] = useState({
    ClientId: "",
    InvoiceNumber: "",
    InvoiceDate: new Date().toISOString().split("T")[0],
    DueDate: "",
    Status: "Draft",
    Currency: "SAR",
    ExchangeRate: 1,
    PaymentTerms: "",
    Notes: "",
    InternalNotes: "",
    PurchaseOrderNumber: "",
    Items: [], // Always initialize as empty array
    DiscountAmount: 0,
    ShippingAmount: 0,
  });

  // UI state
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [selectedItemCategory, setSelectedItemCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  // Totals calculation
  const [totals, setTotals] = useState({
    subtotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    grandTotal: 0,
  });

  // Load initial data
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
      return;
    }

    if (dataLoaded) {
      return;
    }

    const loadInitialData = async () => {
      try {
        console.log("🔄 Loading initial data...");
        setDataLoaded(true);

        await Promise.all([getClients(), getServices(), getProducts()]);

        if (isEditing && id) {
          await getInvoice(parseInt(id));
        }
      } catch (error) {
        console.error("❌ Error loading initial data:", error);
        setDataLoaded(false); // Reset on error to allow retry
      }
    };

    loadInitialData();
  }, [token, navigate, id, isEditing]);

  // Handle clone and edit data separately
  useEffect(() => {
    if (cloneData && dataLoaded) {
      setFormData((prev) => ({
        ...prev,
        ...cloneData,
        id: undefined,
        InvoiceNumber: "",
        Status: "Draft",
        InvoiceDate: new Date().toISOString().split("T")[0],
        Items: ensureArray(cloneData.Items), // Ensure Items is an array
      }));
    }
  }, [cloneData, dataLoaded]);

  // Fix the useEffect that handles editData
  useEffect(() => {
    if (editData && dataLoaded) {
      setFormData((prev) => ({
        ...prev,
        ...editData,
        Items: ensureArray(editData.Items), // Ensure Items is an array
      }));
    }
  }, [editData, dataLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setDataLoaded(false);
      if (clearCurrentInvoice) {
        clearCurrentInvoice();
      }
    };
  }, [clearCurrentInvoice]);

  useEffect(() => {
    if (currentInvoice && isEditing) {
      setFormData({
        ClientId: currentInvoice.ClientId || "",
        InvoiceNumber: currentInvoice.InvoiceNumber || "",
        InvoiceDate: currentInvoice.InvoiceDate
          ? new Date(currentInvoice.InvoiceDate).toISOString().split("T")[0]
          : "",
        DueDate: currentInvoice.DueDate
          ? new Date(currentInvoice.DueDate).toISOString().split("T")[0]
          : "",
        Status: currentInvoice.Status || "Draft",
        Currency: currentInvoice.Currency || "SAR",
        ExchangeRate: currentInvoice.ExchangeRate || 1,
        PaymentTerms: currentInvoice.PaymentTerms || "",
        Notes: currentInvoice.Notes || "",
        InternalNotes: currentInvoice.InternalNotes || "",
        PurchaseOrderNumber: currentInvoice.PurchaseOrderNumber || "",
        Items: ensureArray(currentInvoice.Items), // Ensure Items is an array
        DiscountAmount: currentInvoice.DiscountAmount || 0,
        ShippingAmount: currentInvoice.ShippingAmount || 0,
      });
    }
  }, [currentInvoice, isEditing]);

  // Process products and services into unified items list
  useEffect(() => {
    // Only process if we have data and it's loaded
    if (!dataLoaded || (!products && !services)) {
      return;
    }

    console.log("🔄 Processing items...");
    console.log("Raw Products:", products);
    console.log("Raw Services:", services);

    let combinedItems = [];

    try {
      // Process products with better error handling
      if (products) {
        let productArray = [];

        // Handle different data structures
        if (Array.isArray(products)) {
          productArray = products;
        } else if (products.Data && Array.isArray(products.Data)) {
          productArray = products.Data;
        } else if (
          products.Data &&
          products.Data.$values &&
          Array.isArray(products.Data.$values)
        ) {
          productArray = products.Data.$values;
        } else if (products.data && Array.isArray(products.data)) {
          productArray = products.data;
        } else if (
          products.data &&
          products.data.$values &&
          Array.isArray(products.data.$values)
        ) {
          productArray = products.data.$values;
        } else if (products.$values && Array.isArray(products.$values)) {
          productArray = products.$values;
        }

        console.log("📦 Product Array:", productArray);

        const processedProducts = productArray
          .filter((product) => product && (product.Id || product.id))
          .map((product) => {
            try {
              return {
                id: product.Id || product.id,
                name: product.Name || product.name || "Unnamed Product",
                price: parseFloat(
                  product.UnitPrice ||
                    product.unitPrice ||
                    product.Price ||
                    product.price ||
                    0
                ),
                type: "product",
                taxRate: parseFloat(product.TaxRate || product.taxRate || 15),
                description: product.Description || product.description || "",
                category: "Product",
                itemCode:
                  product.ItemCode || product.itemCode || product.Code || "",
                icon: Package,
              };
            } catch (err) {
              console.error("Error processing product:", product, err);
              return null;
            }
          })
          .filter(Boolean);

        combinedItems = [...combinedItems, ...processedProducts];
        console.log("✅ Processed products:", processedProducts.length);
      }

      // Process services with better error handling
      if (services) {
        let serviceArray = [];

        // Handle different data structures
        if (Array.isArray(services)) {
          serviceArray = services;
        } else if (services.Data && Array.isArray(services.Data)) {
          serviceArray = services.Data;
        } else if (
          services.Data &&
          services.Data.$values &&
          Array.isArray(services.Data.$values)
        ) {
          serviceArray = services.Data.$values;
        } else if (services.data && Array.isArray(services.data)) {
          serviceArray = services.data;
        } else if (
          services.data &&
          services.data.$values &&
          Array.isArray(services.data.$values)
        ) {
          serviceArray = services.data.$values;
        } else if (services.$values && Array.isArray(services.$values)) {
          serviceArray = services.$values;
        }

        console.log("🛠️ Service Array:", serviceArray);

        const processedServices = serviceArray
          .filter((service) => service && (service.Id || service.id))
          .map((service) => {
            try {
              return {
                id: service.Id || service.id,
                name: service.Name || service.name || "Unnamed Service",
                price: parseFloat(
                  service.UnitPrice ||
                    service.unitPrice ||
                    service.Price ||
                    service.price ||
                    0
                ),
                type: "service",
                taxRate: parseFloat(service.TaxRate || service.taxRate || 15),
                description: service.Description || service.description || "",
                category: "Service",
                icon: FileText,
              };
            } catch (err) {
              console.error("Error processing service:", service, err);
              return null;
            }
          })
          .filter(Boolean);

        combinedItems = [...combinedItems, ...processedServices];
        console.log("✅ Processed services:", processedServices.length);
      }
    } catch (error) {
      console.error("❌ Error processing items:", error);
    }

    console.log("✅ Final combined items:", combinedItems.length);
    setAllItems(combinedItems);
  }, [products, services, dataLoaded]);

  // Calculate totals whenever items change
  useEffect(() => {
    calculateTotals();
  }, [formData.Items, formData.DiscountAmount, formData.ShippingAmount]);

  // Get selected client details
  useEffect(() => {
    if (formData.ClientId && Array.isArray(clients)) {
      const client = clients.find((c) => c.Id === parseInt(formData.ClientId));
      setSelectedClient(client);
    }
  }, [formData.ClientId, clients]);

  const calculateTotals = useCallback(() => {
    const items = ensureArray(formData.Items); // Ensure it's an array

    const subtotal = items.reduce((sum, item) => {
      return sum + (item.Quantity || 0) * (item.UnitPrice || 0);
    }, 0);

    const totalDiscount = items.reduce((sum, item) => {
      const lineAmount = (item.Quantity || 0) * (item.UnitPrice || 0);
      const discountAmount =
        item.DiscountType === "percentage"
          ? lineAmount * ((item.Discount || 0) / 100)
          : item.Discount || 0;
      return sum + discountAmount;
    }, 0);

    const afterDiscount = subtotal - totalDiscount;

    const totalTax = items.reduce((sum, item) => {
      const lineAmount = (item.Quantity || 0) * (item.UnitPrice || 0);
      const itemDiscount =
        item.DiscountType === "percentage"
          ? lineAmount * ((item.Discount || 0) / 100)
          : item.Discount || 0;
      const taxableAmount = lineAmount - itemDiscount;
      return sum + taxableAmount * ((item.TaxRate || 0) / 100);
    }, 0);

    const grandTotal =
      afterDiscount +
      totalTax +
      (formData.ShippingAmount || 0) -
      (formData.DiscountAmount || 0);

    setTotals({
      subtotal: Math.max(0, subtotal),
      totalTax: Math.max(0, totalTax),
      totalDiscount: Math.max(0, totalDiscount),
      grandTotal: Math.max(0, grandTotal),
    });
  }, [formData.Items, formData.DiscountAmount, formData.ShippingAmount]);

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

    // Clear submit messages
    setSubmitError("");
    setSubmitSuccess("");
  };

  const handleClientSelect = (client) => {
    console.log("👤 Selecting client:", client);
    setFormData((prev) => ({
      ...prev,
      ClientId: client.Id,
      Currency: client.Currency || "SAR",
      PaymentTerms: client.PaymentTerms || "",
    }));
    setShowClientDropdown(false);
    setClientSearch("");
  };

  // Modal functions
  const openItemModal = () => {
    setShowItemModal(true);
    setSelectedItems([]);
    setItemSearch("");
    setSelectedItemCategory("all");
  };

  const closeItemModal = () => {
    setShowItemModal(false);
    setSelectedItems([]);
    setItemSearch("");
    setSelectedItemCategory("all");
  };

  const toggleItemSelection = (item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.find(
        (i) => i.id === item.id && i.type === item.type
      );
      if (isSelected) {
        return prev.filter((i) => !(i.id === item.id && i.type === item.type));
      } else {
        return [...prev, item];
      }
    });
  };

  const addSelectedItems = () => {
    const newItems = selectedItems.map((item) => ({
      id: Date.now() + Math.random(),
      ProductId: item.type === "product" ? item.id : null,
      ServiceId: item.type === "service" ? item.id : null,
      ItemName: item.name,
      Description: item.description,
      Quantity: 1,
      UnitPrice: item.price,
      Discount: 0,
      DiscountType: "percentage",
      TaxRate: item.taxRate,
      LineTotal: item.price + item.price * (item.taxRate / 100),
    }));

    const currentItems = ensureArray(formData.Items);
    setFormData((prev) => ({
      ...prev,
      Items: [...currentItems, ...newItems],
    }));

    closeItemModal();
  };

  const updateItem = (index, field, value) => {
    const currentItems = ensureArray(formData.Items);
    const updatedItems = [...currentItems];

    if (updatedItems[index]) {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      // Recalculate line total
      const item = updatedItems[index];
      const lineAmount = (item.Quantity || 0) * (item.UnitPrice || 0);
      const discountAmount =
        item.DiscountType === "percentage"
          ? lineAmount * ((item.Discount || 0) / 100)
          : item.Discount || 0;
      const taxableAmount = lineAmount - discountAmount;
      const taxAmount = taxableAmount * ((item.TaxRate || 0) / 100);
      item.LineTotal = taxableAmount + taxAmount;

      setFormData((prev) => ({
        ...prev,
        Items: updatedItems,
      }));
    }
  };

  const removeItem = (index) => {
    const currentItems = ensureArray(formData.Items);
    setFormData((prev) => ({
      ...prev,
      Items: currentItems.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.ClientId) {
      errors.ClientId = translations.Required;
    }

    if (!formData.InvoiceDate) {
      errors.InvoiceDate = translations.Required;
    }

    const items = ensureArray(formData.Items);
    if (items.length === 0) {
      errors.Items = "At least one item is required";
    }

    // Validate items
    items.forEach((item, index) => {
      if (!item.ItemName && !item.ProductId && !item.ServiceId) {
        errors[`item_${index}_name`] = "Item name is required";
      }
      if (!item.Quantity || item.Quantity <= 0) {
        errors[`item_${index}_qty`] = "Quantity must be greater than 0";
      }
      if (item.UnitPrice < 0) {
        errors[`item_${index}_price`] = "Price cannot be negative";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (action = "draft") => {
    console.log("🚀 Submitting invoice with action:", action);

    setSubmitError("");
    setSubmitSuccess("");

    if (!validateForm()) {
      setSubmitError("Please fix the validation errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const items = ensureArray(formData.Items);

      // Format data to match backend DTO
      const submitData = {
        ClientId: parseInt(formData.ClientId),
        InvoiceNumber: formData.InvoiceNumber || null,
        InvoiceDate: formData.InvoiceDate,
        DueDate: formData.DueDate || null,
        Status: action === "send" ? "Sent" : formData.Status,
        Currency: formData.Currency,
        ExchangeRate: formData.ExchangeRate,
        PaymentTerms: formData.PaymentTerms || null,
        Notes: formData.Notes || null,
        InternalNotes: formData.InternalNotes || null,
        PurchaseOrderNumber: formData.PurchaseOrderNumber || null,
        DiscountAmount: formData.DiscountAmount || 0,
        ShippingAmount: formData.ShippingAmount || 0,
        Items: items.map((item) => ({
          ProductId:
            item.ProductId && item.ProductId > 0
              ? parseInt(item.ProductId)
              : null,
          ServiceId:
            item.ServiceId && item.ServiceId > 0
              ? parseInt(item.ServiceId)
              : null,
          Description: item.Description || item.ItemName || "",
          Quantity: parseFloat(item.Quantity) || 1,
          UnitPrice: parseFloat(item.UnitPrice) || 0,
          Discount: parseFloat(item.Discount) || 0,
          DiscountType: item.DiscountType || "percentage",
          TaxRate: parseFloat(item.TaxRate) || 0,
        })),
      };

      console.log("📤 Submitting data:", submitData);

      let result;
      if (isEditing) {
        result = await updateInvoice(id, submitData);
      } else {
        result = await createInvoice(submitData);
      }

      if (result) {
        if (action === "send" && result.data?.Id) {
          await sendInvoice(result.data.Id);
        }

        setSubmitSuccess(
          `Invoice ${isEditing ? "updated" : "created"} successfully!`
        );

        // Navigate after a brief delay to show success message
        setTimeout(() => {
          navigate("/admin/invoice-dashboard", {
            state: {
              message: isEditing
                ? "Invoice updated successfully"
                : "Invoice created successfully",
              type: "success",
            },
          });
        }, 1000);
      }
    } catch (error) {
      console.error("❌ Error saving invoice:", error);
      setSubmitError(
        error.message || "Failed to save invoice. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter functions
  const filteredClients = Array.isArray(clients)
    ? clients.filter(
        (client) =>
          (client.FullName?.toLowerCase() || "").includes(
            clientSearch.toLowerCase()
          ) ||
          (client.BusinessName?.toLowerCase() || "").includes(
            clientSearch.toLowerCase()
          ) ||
          (client.Email?.toLowerCase() || "").includes(
            clientSearch.toLowerCase()
          )
      )
    : [];

  const filteredItems = Array.isArray(allItems)
    ? allItems.filter((item) => {
        const matchesSearch =
          (item.name?.toLowerCase() || "").includes(itemSearch.toLowerCase()) ||
          (item.description?.toLowerCase() || "").includes(
            itemSearch.toLowerCase()
          ) ||
          (item.itemCode?.toLowerCase() || "").includes(
            itemSearch.toLowerCase()
          );

        const matchesCategory =
          selectedItemCategory === "all" ||
          (selectedItemCategory === "products" && item.type === "product") ||
          (selectedItemCategory === "services" && item.type === "service");

        return matchesSearch && matchesCategory;
      })
    : [];

  // Loading state
  if (
    (invoiceLoading && isEditing) ||
    (!dataLoaded && (productsLoading || servicesLoading || clientsLoading))
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{translations.Loading}</p>
          <p className="text-sm text-gray-500 mt-2">
            {!dataLoaded ? "Loading initial data..." : "Loading invoice..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/invoice-dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEditing
                    ? translations["Edit Invoice"]
                    : translations["Create Invoice"]}
                </h1>
                <p className="text-sm text-gray-500">
                  {isEditing
                    ? `Invoice #${formData.InvoiceNumber}`
                    : "Create a new invoice"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Draft
              </button>

              <button
                onClick={() => handleSubmit("send")}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Save & Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800">{submitSuccess}</p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800">{submitError}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Invoice Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Invoice Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Selection */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.Client} *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowClientDropdown(!showClientDropdown)
                        }
                        className={`w-full px-3 py-3 border rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          validationErrors.ClientId
                            ? "border-red-300"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {selectedClient ? (
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {selectedClient.FullName ||
                                  selectedClient.BusinessName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {selectedClient.Email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <Building2 className="w-4 h-4 mr-3" />
                            <span>{translations["Select Client"]}</span>
                          </div>
                        )}
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </button>

                      {showClientDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                placeholder={translations["Search clients..."]}
                                value={clientSearch}
                                onChange={(e) =>
                                  setClientSearch(e.target.value)
                                }
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>
                          </div>
                          <div className="max-h-48 overflow-auto">
                            {clientsLoading ? (
                              <div className="p-4 text-center">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                  Loading clients...
                                </p>
                              </div>
                            ) : filteredClients.length === 0 ? (
                              <div className="p-4 text-center text-gray-500">
                                <p className="text-sm">No clients found</p>
                              </div>
                            ) : (
                              filteredClients.map((client) => (
                                <button
                                  key={client.Id}
                                  onClick={() => handleClientSelect(client)}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                                >
                                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {client.FullName || client.BusinessName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {client.Email}
                                    </p>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {validationErrors.ClientId && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.ClientId}
                      </p>
                    )}
                  </div>

                  {/* Invoice Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Invoice Number"]}
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.InvoiceNumber}
                        onChange={(e) =>
                          handleInputChange("InvoiceNumber", e.target.value)
                        }
                        placeholder={translations["Auto-generated"]}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Issue Date"]} *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.InvoiceDate}
                        onChange={(e) =>
                          handleInputChange("InvoiceDate", e.target.value)
                        }
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.InvoiceDate
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {validationErrors.InvoiceDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.InvoiceDate}
                      </p>
                    )}
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Due Date"]}
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.DueDate}
                        onChange={(e) =>
                          handleInputChange("DueDate", e.target.value)
                        }
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.Status}
                    </label>
                    <select
                      value={formData.Status}
                      onChange={(e) =>
                        handleInputChange("Status", e.target.value)
                      }
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Draft">{translations.Draft}</option>
                      <option value="Sent">{translations.Sent}</option>
                      <option value="Paid">{translations.Paid}</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.Currency}
                        onChange={(e) =>
                          handleInputChange("Currency", e.target.value)
                        }
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="SAR">SAR - Saudi Riyal</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="AED">AED - UAE Dirham</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Invoice Items
                  </h2>
                  <button
                    onClick={openItemModal}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {translations["Add Item"]}
                  </button>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                          {translations.Item}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                          {translations.Description}
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                          {translations.Qty}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          {translations.Price}
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          {translations.Discount}
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                          {translations.Tax} %
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          {translations.Amount}
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.Items.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          {/* Item Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Package className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {item.ItemName}
                              </span>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.Description || ""}
                              onChange={(e) =>
                                updateItem(index, "Description", e.target.value)
                              }
                              placeholder={translations.Description}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </td>

                          {/* Quantity */}
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.Quantity}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "Quantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min="0"
                              step="0.01"
                              className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                            />
                          </td>

                          {/* Price */}
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.UnitPrice}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "UnitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min="0"
                              step="0.01"
                              className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-right"
                            />
                          </td>

                          {/* Discount */}
                          <td className="px-4 py-3">
                            <div className="flex">
                              <input
                                type="number"
                                value={item.Discount}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    "Discount",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                min="0"
                                step="0.01"
                                className="flex-1 px-2 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                              />
                              <select
                                value={item.DiscountType}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    "DiscountType",
                                    e.target.value
                                  )
                                }
                                className="px-2 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                              >
                                <option value="percentage">%</option>
                                <option value="fixed">Fixed</option>
                              </select>
                            </div>
                          </td>

                          {/* Tax */}
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.TaxRate}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "TaxRate",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min="0"
                              max="100"
                              step="0.01"
                              className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                            />
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-3">
                            <div className="text-right font-medium text-gray-900">
                              {formData.Currency}{" "}
                              {(item.LineTotal || 0).toFixed(2)}
                            </div>
                          </td>

                          {/* Remove */}
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {formData.Items.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No items added yet. Click "Add Item" to get started.
                      </p>
                    </div>
                  )}
                </div>

                {validationErrors.Items && (
                  <p className="text-red-500 text-sm mt-2">
                    {validationErrors.Items}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Additional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice Level Discount
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={formData.DiscountAmount}
                        onChange={(e) =>
                          handleInputChange(
                            "DiscountAmount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Charges
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={formData.ShippingAmount}
                        onChange={(e) =>
                          handleInputChange(
                            "ShippingAmount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes / Terms
                  </label>
                  <textarea
                    value={formData.Notes}
                    onChange={(e) => handleInputChange("Notes", e.target.value)}
                    rows="4"
                    placeholder="Enter notes or terms..."
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Panel - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                  Invoice Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formData.Currency} {totals.subtotal.toFixed(2)}
                    </span>
                  </div>

                  {totals.totalDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Item Discounts:</span>
                      <span className="font-medium text-red-600">
                        -{formData.Currency} {totals.totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {totals.totalTax > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">
                        {formData.Currency} {totals.totalTax.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {formData.DiscountAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Invoice Discount:</span>
                      <span className="font-medium text-red-600">
                        -{formData.Currency}{" "}
                        {formData.DiscountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {formData.ShippingAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">
                        {formData.Currency} {formData.ShippingAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {formData.Currency} {totals.grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => handleSubmit("draft")}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Draft
                  </button>

                  <button
                    onClick={() => handleSubmit("send")}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Save & Send
                  </button>
                </div>

                {/* Debug Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer font-medium">
                      Debug Info
                    </summary>
                    <div className="mt-2 space-y-1">
                      <p>Data Loaded: {dataLoaded ? "Y" : "N"}</p>
                      <p>
                        Products:{" "}
                        {allItems.filter((i) => i.type === "product").length}
                      </p>
                      <p>
                        Services:{" "}
                        {allItems.filter((i) => i.type === "service").length}
                      </p>
                      <p>Total Items: {allItems.length}</p>
                      <p>Form Items: {formData.Items.length}</p>
                      <p>Client ID: {formData.ClientId}</p>
                      <p>
                        Loading: P:{productsLoading ? "Y" : "N"} S:
                        {servicesLoading ? "Y" : "N"} C:
                        {clientsLoading ? "Y" : "N"}
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Selection Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {translations["Select Items"]}
                </h2>
                <button
                  onClick={closeItemModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col h-[calc(90vh-180px)]">
              {/* Search and Filter */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={translations["Search items..."]}
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setSelectedItemCategory("all")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        selectedItemCategory === "all"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {translations.All}
                    </button>
                    <button
                      onClick={() => setSelectedItemCategory("products")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        selectedItemCategory === "products"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {translations.Products}
                    </button>
                    <button
                      onClick={() => setSelectedItemCategory("services")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        selectedItemCategory === "services"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {translations.Services}
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-auto px-6 py-4">
                {productsLoading || servicesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-3" />
                    <p className="text-gray-500">Loading items...</p>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {translations["No items found"]}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => {
                      const isSelected = selectedItems.find(
                        (i) => i.id === item.id && i.type === item.type
                      );
                      return (
                        <div
                          key={`${item.type}-${item.id}`}
                          onClick={() => toggleItemSelection(item)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {item.icon && (
                                <item.icon className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.category} • {formData.Currency}{" "}
                                {item.price?.toFixed(2) || "0.00"}
                              </p>
                              {item.itemCode && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Code: {item.itemCode}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center mt-2">
                                <span className="text-xs font-medium text-gray-600">
                                  Tax: {item.taxRate}%
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {selectedItems.length} item(s) selected
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={closeItemModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {translations.Cancel}
                  </button>
                  <button
                    onClick={addSelectedItems}
                    disabled={selectedItems.length === 0}
                    className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {translations["Add Selected Items"]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftraInvoiceForm;
