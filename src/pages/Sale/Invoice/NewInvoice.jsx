import React, { useState, useEffect, useCallback } from "react";
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
  Building,
  Package,
  Wrench,
} from "lucide-react";

import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";
import { useInvoices } from "../../../Contexts/InvoiceContext/InvoiceContext";
import { useClients } from "../../../Contexts/apiClientContext/apiClientContext";
import { useService } from "../../../Contexts/ServiceContext/ServiceContext";
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";

const NewInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const { createInvoice, updateInvoice, loading } = useInvoices();

  // Context hooks for dropdowns
  const {
    clients,
    isLoading: clientsLoading,
    error: clientsError,
    getClients,
  } = useClients();

  const { services, loading: servicesLoading, getServices } = useService();

  const {
    products,
    loading: productsLoading,
    getProducts,
  } = useProductsManager();

  // Check if we're editing or cloning
  const editData = location.state?.editData;
  const cloneData = location.state?.cloneData;
  const isEditing = location.state?.isEditing || false;
  const isCloning = !!cloneData;

  // Form state
  const [formData, setFormData] = useState({
    ClientId: "", // FIXED: Use correct field name
    InvoiceDate: new Date().toISOString().split("T")[0], // FIXED: Use correct field name
    DueDate: "",
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
      ItemType: "",
      ProductId: "",
      ServiceId: "",
      Quantity: 1,
      UnitPrice: 0,
      TaxRate: 0,
      LineTotal: 0,
    },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // FIXED: Extract data according to your exact API structure
  const productsData = products?.Data?.$values || [];
  const servicesData = services?.Data?.$values || [];
  const clientsData = clients || []; // Clients seem to be already processed

  // Debug logging - remove in production
  console.log("=== DROPDOWN DEBUG INFO ===");
  console.log("Raw products:", products);
  console.log("Raw services:", services);
  console.log("Raw clients:", clients);
  console.log("Processed productsData:", productsData);
  console.log("Processed servicesData:", servicesData);
  console.log("Processed clientsData:", clientsData);
  console.log("Products loading:", productsLoading);
  console.log("Services loading:", servicesLoading);
  console.log("Clients loading:", clientsLoading);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      console.log("Loading initial data...");
      // Load all data in parallel
      await Promise.all([getClients(), getServices(), getProducts()]);

      setInitialLoadComplete(true);
      console.log("Initial data load complete");
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, [getClients, getServices, getProducts]);

  // Load initial data only once when component mounts and token is available
  useEffect(() => {
    if (token && !initialLoadComplete) {
      loadInitialData();
    }
  }, [token, initialLoadComplete, loadInitialData]);

  // Initialize form data
  useEffect(() => {
    if (initialLoadComplete && (editData || cloneData)) {
      const dataToUse = editData || cloneData;

      setFormData({
        InvoiceNumber: dataToUse.InvoiceNumber || "",
        InvoiceDate: dataToUse.InvoiceDate
          ? dataToUse.InvoiceDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        DueDate: dataToUse.DueDate ? dataToUse.DueDate.split("T")[0] : "",
        ClientId: dataToUse.ClientId || "",
        Description: dataToUse.Description || "",
        Notes: dataToUse.Notes || "",
        Status: isEditing ? dataToUse.Status || "Draft" : "Draft",
        SubTotal: isEditing ? dataToUse.SubTotal || 0 : 0,
        TaxAmount: isEditing ? dataToUse.TaxAmount || 0 : 0,
        TotalAmount: isEditing ? dataToUse.TotalAmount || 0 : 0,
      });

      // Set invoice items if available
      if (dataToUse.InvoiceItems && dataToUse.InvoiceItems.length > 0) {
        const items = dataToUse.InvoiceItems.map((item) => ({
          id: item.Id || Date.now() + Math.random(),
          ItemType: item.ProductId ? "Product" : "Service",
          ProductId: item.ProductId || "",
          ServiceId: item.ServiceId || "",
          Quantity: item.Quantity || 1,
          UnitPrice: item.UnitPrice || 0,
          TaxRate: item.TaxRate || 0,
          LineTotal: isEditing ? item.LineTotal || 0 : 0,
        }));

        setInvoiceItems(items);

        // If cloning, we need to reset the line totals
        if (isCloning) {
          setTimeout(() => {
            calculateTotals();
          }, 100);
        }
      }
    }
  }, [editData, cloneData, isEditing, isCloning, initialLoadComplete]);

  // Calculate totals function
  const calculateTotals = useCallback(() => {
    const subTotal = invoiceItems.reduce((sum, item) => {
      return sum + (parseFloat(item.LineTotal) || 0);
    }, 0);

    const taxAmount = invoiceItems.reduce((sum, item) => {
      const lineTotal = parseFloat(item.LineTotal) || 0;
      const taxRate = parseFloat(item.TaxRate) || 0;
      return sum + (lineTotal * taxRate) / 100;
    }, 0);

    const totalAmount = subTotal + taxAmount;

    setFormData((prev) => ({
      ...prev,
      SubTotal: subTotal,
      TaxAmount: taxAmount,
      TotalAmount: totalAmount,
    }));
  }, [invoiceItems]);

  // Calculate totals when items change
  useEffect(() => {
    if (initialLoadComplete) {
      calculateTotals();
    }
  }, [invoiceItems, initialLoadComplete, calculateTotals]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Handle input changes
  const handleInputChange = (field, value) => {
  console.log(`=== INPUT CHANGE: ${field} ===`);
  console.log("New value:", value);
  console.log("Value type:", typeof value);
  console.log("Current formData before update:", formData);

  setFormData((prev) => {
    const updated = {
      ...prev,
      [field]: value,
    };
    console.log("Updated formData:", updated);
    return updated;
  });

  // Clear error when user starts typing
  if (errors[field]) {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  // If client is selected, log additional info and validate
  if (field === "ClientId" && value) {
    console.log("Client selection changed to:", value);
    const selectedClient = clientsData.find(client => client.Id === parseInt(value));
    console.log("Selected client details:", selectedClient);
    
    if (!selectedClient) {
      console.warn("Selected client not found in clientsData!");
      setErrors(prev => ({
        ...prev,
        ClientId: "Selected client is invalid"
      }));
    } else {
      console.log("Valid client selected:", selectedClient.FullName || selectedClient.BusinessName);
    }
  }
};

  // Handle item changes
  const handleItemChange = async (index, field, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Handle item type change
    if (field === "ItemType") {
      updatedItems[index].ProductId = "";
      updatedItems[index].ServiceId = "";
      updatedItems[index].UnitPrice = 0;
    }

    // Auto-populate price when product is selected
    if (field === "ProductId" && value) {
      try {
        const product = productsData.find((p) => p.Id === parseInt(value));
        console.log("Selected product:", product);
        if (product && product.UnitPrice) {
          // Convert string price to number
          updatedItems[index].UnitPrice = parseFloat(product.UnitPrice) || 0;
          console.log("Set price to:", updatedItems[index].UnitPrice);
        }
      } catch (error) {
        console.error("Error finding product:", error);
      }
    }

    // Auto-populate price when service is selected
    if (field === "ServiceId" && value) {
      try {
        const service = servicesData.find((s) => s.Id === parseInt(value));
        console.log("Selected service:", service);
        if (service && service.UnitPrice) {
          // Convert string price to number
          updatedItems[index].UnitPrice = parseFloat(service.UnitPrice) || 0;
          console.log("Set price to:", updatedItems[index].UnitPrice);
        }
      } catch (error) {
        console.error("Error finding service:", error);
      }
    }

    // Calculate line total
    if (
      field === "Quantity" ||
      field === "UnitPrice" ||
      field === "ProductId" ||
      field === "ServiceId"
    ) {
      const quantity = parseFloat(updatedItems[index].Quantity) || 0;
      const unitPrice = parseFloat(updatedItems[index].UnitPrice) || 0;
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
        ItemType: "",
        ProductId: "",
        ServiceId: "",
        Quantity: 1,
        UnitPrice: 0,
        TaxRate: 0,
        LineTotal: 0,
      },
    ]);
  };

  // Remove item
  const removeItem = (index) => {
    if (invoiceItems.length > 1) {
      const updatedItems = invoiceItems.filter((_, i) => i !== index);
      setInvoiceItems(updatedItems);
    }
  };

const validateForm = () => {
  const newErrors = {};

  // FIXED: More robust client validation with detailed logging
  console.log("=== FORM VALIDATION DEBUG ===");
  console.log("FormData ClientId:", formData.ClientId);
  console.log("FormData ClientId type:", typeof formData.ClientId);
  console.log("Available clients:", clientsData.map(c => ({id: c.Id, name: c.FullName || c.BusinessName})));

  if (!formData.ClientId || formData.ClientId === "" || formData.ClientId === "0") {
    newErrors.ClientId = "Client is required";
    console.log("Client validation failed: No client selected");
  } else {
    // Check if client exists in the list
    const clientExists = clientsData.find(client => client.Id === parseInt(formData.ClientId));
    console.log("Selected client exists:", clientExists);
    if (!clientExists) {
      newErrors.ClientId = "Selected client is invalid";
      console.log("Client validation failed: Selected client not found in list");
    }
  }

  // FIXED: More detailed invoice date validation
  if (!formData.InvoiceDate) {
    newErrors.InvoiceDate = "Invoice date is required";
  }

  // FIXED: Better items validation with detailed logging
  const validItems = invoiceItems.filter(item => {
    const hasType = item.ItemType;
    const hasProduct = item.ItemType === "Product" && item.ProductId;
    const hasService = item.ItemType === "Service" && item.ServiceId;
    const hasQuantity = parseFloat(item.Quantity) > 0;
    const hasPrice = parseFloat(item.UnitPrice) >= 0;
    
    const isValid = hasType && (hasProduct || hasService) && hasQuantity && hasPrice;
    
    console.log(`Item validation - Type: ${hasType}, Product: ${hasProduct}, Service: ${hasService}, Qty: ${hasQuantity}, Price: ${hasPrice}, Valid: ${isValid}`);
    
    return isValid;
  });

  console.log("Valid items count:", validItems.length);
  console.log("Total items count:", invoiceItems.length);

  if (validItems.length === 0) {
    newErrors.items = "At least one complete item is required";
  }

  // Validate individual items
  invoiceItems.forEach((item, index) => {
    if (item.ItemType) {
      if (!item.ItemType) {
        newErrors[`item_${index}_type`] = "Item type is required";
      }

      if (item.ItemType === "Product" && !item.ProductId) {
        newErrors[`item_${index}_product`] = "Product is required";
      }

      if (item.ItemType === "Service" && !item.ServiceId) {
        newErrors[`item_${index}_service`] = "Service is required";
      }

      const quantity = parseFloat(item.Quantity);
      const unitPrice = parseFloat(item.UnitPrice);
      const taxRate = parseFloat(item.TaxRate);

      if (isNaN(quantity) || quantity <= 0) {
        newErrors[`item_${index}_quantity`] = "Quantity must be greater than 0";
      }

      if (isNaN(unitPrice) || unitPrice < 0) {
        newErrors[`item_${index}_price`] = "Unit price must be 0 or greater";
      }

      if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
        newErrors[`item_${index}_tax`] = "Tax rate must be between 0 and 100";
      }
    }
  });

  console.log("=== FORM VALIDATION RESULTS ===");
  console.log("Form data:", formData);
  console.log("Selected ClientId:", formData.ClientId);
  console.log("Validation errors:", newErrors);

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // Handle form submission
// Fixed handleSubmit method in your NewInvoice component
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    // FIXED: Prepare invoice data with correct field names matching backend DTO
    const invoiceData = {
      // Basic invoice information - Use exact field names from backend DTO
      ClientId: parseInt(formData.ClientId), // FIXED: Ensure it's an integer
      InvoiceNumber: formData.InvoiceNumber || null, // API might auto-generate if null
      InvoiceDate: formData.InvoiceDate, // FIXED: Use InvoiceDate (capital I)
      DueDate: formData.DueDate || null, // FIXED: Use DueDate (capital D)
      Status: formData.Status || "Draft",
      Description: formData.Description || null,
      Notes: formData.Notes || null,
      
      // Financial fields
      Currency: "SAR", // Default currency
      ExchangeRate: 1,
      DiscountAmount: parseFloat(formData.discountAmount) || 0,
      ShippingAmount: parseFloat(formData.shippingAmount) || 0,
      
      // Additional fields that might be expected
      PaymentTerms: formData.paymentTerms || null,
      InternalNotes: formData.internalNotes || null,
      PurchaseOrderNumber: formData.purchaseOrderNumber || null,
      IsRecurring: false,
      
      // FIXED: Invoice items with correct structure - ensure field name matches context expectation
      InvoiceItems: invoiceItems
        .filter((item) => item.ItemType && (item.ProductId || item.ServiceId))
        .map((item) => ({
          ItemType: item.ItemType,
          ProductId: item.ItemType === "Product" ? parseInt(item.ProductId) : null,
          ServiceId: item.ItemType === "Service" ? parseInt(item.ServiceId) : null,
          Quantity: parseFloat(item.Quantity) || 1,
          UnitPrice: parseFloat(item.UnitPrice) || 0,
          TaxRate: parseFloat(item.TaxRate) || 0,
          LineTotal: parseFloat(item.LineTotal) || 0,
          Description: item.Description || item.ItemName || "",
          Discount: parseFloat(item.Discount) || 0,
          DiscountType: item.DiscountType || "percentage",
        })),
      
      // Calculated totals
      SubTotal: parseFloat(formData.SubTotal) || 0,
      TaxAmount: parseFloat(formData.TaxAmount) || 0,
      TotalAmount: parseFloat(formData.TotalAmount) || 0,
    };

    console.log("=== SUBMITTING INVOICE DATA ===");
    console.log("Prepared invoice data:", invoiceData);
    console.log("Client ID:", invoiceData.ClientId);
    console.log("Invoice Items:", invoiceData.InvoiceItems);
    console.log("Items count:", invoiceData.InvoiceItems.length);

    // FIXED: Additional validation before submission
    if (!invoiceData.ClientId || invoiceData.ClientId <= 0) {
      alert("Please select a valid client before submitting the invoice.");
      return;
    }

    if (!invoiceData.InvoiceItems || invoiceData.InvoiceItems.length === 0) {
      alert("Please add at least one invoice item before submitting.");
      return;
    }

    let result;

    if (isEditing && editData) {
      // Update existing invoice
      console.log("Updating invoice with ID:", editData.Id);
      result = await updateInvoice(editData.Id, invoiceData);
      if (result) {
        alert("Invoice updated successfully");
        navigate("/admin/invoices/list");
      } else {
        alert("Failed to update invoice");
      }
    } else {
      // Create new invoice
      console.log("Creating new invoice...");
      result = await createInvoice(invoiceData);
      if (result) {
        alert("Invoice created successfully");
        navigate("/admin/invoices/list");
      } else {
        alert("Failed to create invoice");
      }
    }
  } catch (error) {
    console.error("Error submitting invoice:", error);
    
    // More detailed error handling
    if (error.message.includes("Invalid client ID")) {
      alert("Please select a valid client before submitting the invoice.");
    } else if (error.message.includes("validation")) {
      alert("Please check all required fields and try again.");
    } else {
      alert(
        `${isEditing ? "Failed to update" : "Failed to create"} invoice: ${error.message}`
      );
    }
  } finally {
    setIsSubmitting(false);
  }
};

  // Loading state
  if (!token || !initialLoadComplete) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <Span className="text-blue-500 text-lg ml-4">Loading...</Span>
      </Container>
    );
  }

  const getPageTitle = () => {
    if (isEditing) return "Edit Invoice";
    if (isCloning) return "Clone Invoice";
    return "Add Invoice";
  };

  const getSaveButtonText = () => {
    if (isEditing) return "Save Changes";
    return "Save";
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toFixed(2);
  };

  const getSelectedClient = () => {
    return clientsData.find((client) => client.Id === parseInt(formData.ClientId));
  };

  return (
    <Container className="min-h-screen bg-gray-50">
      <Container className="px-6 py-6">
        {/* Debug Info Panel - Remove this in production */}
        <Container className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Debug Info (Remove in production):</h4>
          <div className="text-sm text-yellow-700 grid grid-cols-3 gap-4">
            <div>
              <p><strong>Products:</strong></p>
              <p>Loading: {productsLoading ? 'Yes' : 'No'}</p>
              <p>Count: {productsData.length}</p>
              <p>Available: {productsData.length > 0 ? 'Yes' : 'No'}</p>
              {productsData.length > 0 && (
                <>
                  <p>First product: {productsData[0]?.Name || 'No name'}</p>
                  <p>Price: ${productsData[0]?.UnitPrice || 'No price'}</p>
                </>
              )}
            </div>
            <div>
              <p><strong>Services:</strong></p>
              <p>Loading: {servicesLoading ? 'Yes' : 'No'}</p>
              <p>Count: {servicesData.length}</p>
              <p>Available: {servicesData.length > 0 ? 'Yes' : 'No'}</p>
              {servicesData.length > 0 && (
                <>
                  <p>First service: {servicesData[0]?.Name || 'No name'}</p>
                  <p>Price: ${servicesData[0]?.UnitPrice || 'No price'}</p>
                </>
              )}
            </div>
            <div>
              <p><strong>Clients:</strong></p>
              <p>Loading: {clientsLoading ? 'Yes' : 'No'}</p>
              <p>Count: {clientsData.length}</p>
              <p>Available: {clientsData.length > 0 ? 'Yes' : 'No'}</p>
              {clientsData.length > 0 && (
                <p>First client: {clientsData[0]?.FullName || clientsData[0]?.BusinessName || 'No name'}</p>
              )}
            </div>
          </div>
        </Container>

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
                Invoice Information
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Invoice Date */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Date
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="date"
                    value={formData.InvoiceDate}
                    onChange={(e) =>
                      handleInputChange("InvoiceDate", e.target.value)
                    }
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.InvoiceDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </Container>
                {errors.InvoiceDate && (
                  <Span className="text-red-500 text-sm mt-1">
                    {errors.InvoiceDate}
                  </Span>
                )}
              </Container>

              {/* Due Date */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <Container className="relative">
                  <Container className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </Container>
                  <input
                    type="date"
                    value={formData.DueDate}
                    onChange={(e) =>
                      handleInputChange("DueDate", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>
              </Container>

              {/* Status */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.Status}
                  onChange={(e) => handleInputChange("Status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </Container>

              {/* Description */}
              <Container className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) =>
                    handleInputChange("Description", e.target.value)
                  }
                  placeholder="Enter description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>
            </Container>
          </Container>

          {/* Client Information */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Client Information
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Selection */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.ClientId || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log("Client dropdown changed to:", value);
                    handleInputChange("ClientId", value);
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ClientId ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={clientsLoading}
                >
                  <option value="">
                    {clientsLoading ? "Loading clients..." : "Select Client"}
                  </option>
                  {clientsData.map((client) => (
                    <option key={client.Id} value={client.Id}>
                      {client.FullName || client.BusinessName} - {client.Email}
                    </option>
                  ))}
                  {!clientsLoading && clientsData.length === 0 && (
                    <option value="" disabled>No clients available</option>
                  )}
                </select>
                {errors.ClientId && (
                  <Span className="text-red-500 text-sm mt-1">
                    {errors.ClientId}
                  </Span>
                )}
                {clientsError && (
                  <Span className="text-red-500 text-sm mt-1">
                    Error loading clients
                  </Span>
                )}
              </Container>

              {/* Client Details Display */}
              {formData.ClientId && (
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Details
                  </label>
                  <Container className="p-3 bg-gray-50 rounded-md">
                    {(() => {
                      const selectedClient = getSelectedClient();
                      if (selectedClient) {
                        return (
                          <Container className="space-y-1">
                            <Span className="text-sm font-medium text-gray-900">
                              {selectedClient.FullName || selectedClient.BusinessName}
                            </Span>
                            {selectedClient.Email && (
                              <Span className="text-sm text-gray-600 block">
                                {selectedClient.Email}
                              </Span>
                            )}
                            {(selectedClient.Mobile || selectedClient.Telephone) && (
                              <Span className="text-sm text-gray-600 block">
                                {selectedClient.Mobile || selectedClient.Telephone}
                              </Span>
                            )}
                            {selectedClient.Currency && (
                              <Span className="text-sm text-blue-600 block">
                                Currency: {selectedClient.Currency}
                              </Span>
                            )}
                          </Container>
                        );
                      }
                      return null;
                    })()}
                  </Container>
                </Container>
              )}
            </Container>
          </Container>

          {/* Invoice Items */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center justify-between mb-4">
              <Container className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Invoice Items
                </h2>
              </Container>
              <FilledButton
                isIcon={true}
                icon={Plus}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText="Add Item"
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
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <Container className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Item Type */}
                    <Container className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={item.ItemType}
                        onChange={(e) =>
                          handleItemChange(index, "ItemType", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${
                          errors[`item_${index}_type`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Type</option>
                        <option value="Product">Product</option>
                        <option value="Service">Service</option>
                      </select>
                      {errors[`item_${index}_type`] && (
                        <Span className="text-red-500 text-xs mt-1">
                          {errors[`item_${index}_type`]}
                        </Span>
                      )}
                    </Container>

                    {/* Product/Service Selection */}
                    <Container className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {item.ItemType === "Product" ? "Product" : "Service"}
                        {item.ItemType && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {item.ItemType === "Product" ? (
                        <select
                          value={item.ProductId}
                          onChange={(e) =>
                            handleItemChange(index, "ProductId", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${
                            errors[`item_${index}_product`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={!item.ItemType || productsLoading}
                        >
                          <option value="">
                            {productsLoading ? "Loading products..." : "Select Product"}
                          </option>
                          {productsData.map((product) => (
                            <option key={product.Id} value={product.Id}>
                              {product.Name} - ${parseFloat(product.UnitPrice || 0).toFixed(2)}
                            </option>
                          ))}
                          {!productsLoading && productsData.length === 0 && (
                            <option value="" disabled>No products available</option>
                          )}
                        </select>
                      ) : item.ItemType === "Service" ? (
                        <select
                          value={item.ServiceId}
                          onChange={(e) =>
                            handleItemChange(index, "ServiceId", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${
                            errors[`item_${index}_service`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={!item.ItemType || servicesLoading}
                        >
                          <option value="">
                            {servicesLoading ? "Loading services..." : "Select Service"}
                          </option>
                          {servicesData.map((service) => (
                            <option key={service.Id} value={service.Id}>
                              {service.Name} - ${parseFloat(service.UnitPrice || 0).toFixed(2)}
                            </option>
                          ))}
                          {!servicesLoading && servicesData.length === 0 && (
                            <option value="" disabled>No services available</option>
                          )}
                        </select>
                      ) : (
                        <Container className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm">
                          Select Item Type First
                        </Container>
                      )}
                      {errors[`item_${index}_product`] && (
                        <Span className="text-red-500 text-xs mt-1">
                          {errors[`item_${index}_product`]}
                        </Span>
                      )}
                      {errors[`item_${index}_service`] && (
                        <Span className="text-red-500 text-xs mt-1">
                          {errors[`item_${index}_service`]}
                        </Span>
                      )}
                    </Container>

                    {/* Quantity */}
                    <Container className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.Quantity}
                        onChange={(e) =>
                          handleItemChange(index, "Quantity", e.target.value)
                        }
                        placeholder="Enter quantity"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${
                          errors[`item_${index}_quantity`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors[`item_${index}_quantity`] && (
                        <Span className="text-red-500 text-xs mt-1">
                          {errors[`item_${index}_quantity`]}
                        </Span>
                      )}
                    </Container>

                    {/* Unit Price */}
                    <Container className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.UnitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "UnitPrice", e.target.value)
                        }
                        placeholder="Enter unit price"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${
                          errors[`item_${index}_price`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors[`item_${index}_price`] && (
                        <Span className="text-red-500 text-xs mt-1">
                          {errors[`item_${index}_price`]}
                        </Span>
                      )}
                    </Container>

                    {/* Tax Rate */}
                    <Container className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.TaxRate}
                        onChange={(e) =>
                          handleItemChange(index, "TaxRate", e.target.value)
                        }
                        placeholder="0.00"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${
                          errors[`item_${index}_tax`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors[`item_${index}_tax`] && (
                        <Span className="text-red-500 text-xs mt-1">
                          {errors[`item_${index}_tax`]}
                        </Span>
                      )}
                    </Container>

                    {/* Line Total */}
                    <Container className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total
                      </label>
                      <Container className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 text-sm font-medium">
                        ${formatCurrency(item.LineTotal)}
                      </Container>
                    </Container>

                    {/* Remove Button */}
                    <Container className="md:col-span-12 flex justify-end">
                      <FilledButton
                        isIcon={true}
                        icon={Trash2}
                        iconSize="w-4 h-4"
                        bgColor="bg-red-100 hover:bg-red-200"
                        textColor="text-red-600"
                        rounded="rounded-lg"
                        buttonText="Remove Item"
                        height="h-8"
                        px="px-3"
                        fontWeight="font-medium"
                        fontSize="text-sm"
                        isIconLeft={true}
                        onClick={() => removeItem(index)}
                        disabled={invoiceItems.length === 1}
                      />
                    </Container>
                  </Container>
                </Container>
              ))}
            </Container>
          </Container>

          {/* Totals Section */}
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Container className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Invoice Summary
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notes */}
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.Notes}
                  onChange={(e) => handleInputChange("Notes", e.target.value)}
                  placeholder="Enter notes"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Container>

              {/* Summary */}
              <Container className="space-y-4">
                <Container className="bg-gray-50 rounded-lg p-4">
                  <Container className="space-y-3">
                    <Container className="flex justify-between items-center">
                      <Span className="text-sm font-medium text-gray-700">
                        Sub Total:
                      </Span>
                      <Span className="text-sm font-bold text-gray-900">
                        ${formatCurrency(formData.SubTotal)}
                      </Span>
                    </Container>

                    <Container className="flex justify-between items-center">
                      <Span className="text-sm font-medium text-gray-700">
                        Tax Amount:
                      </Span>
                      <Span className="text-sm font-bold text-gray-900">
                        ${formatCurrency(formData.TaxAmount)}
                      </Span>
                    </Container>

                    <Container className="border-t border-gray-200 pt-3">
                      <Container className="flex justify-between items-center">
                        <Span className="text-lg font-bold text-gray-900">
                          Total Amount:
                        </Span>
                        <Span className="text-lg font-bold text-blue-600">
                          ${formatCurrency(formData.TotalAmount)}
                        </Span>
                      </Container>
                    </Container>
                  </Container>
                </Container>
              </Container>
            </Container>
          </Container>

          {/* Action Buttons */}
          <Container className="flex justify-end gap-4">
            <FilledButton
              isIcon={false}
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText="Back"
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