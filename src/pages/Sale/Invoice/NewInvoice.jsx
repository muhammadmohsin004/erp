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
import { useInvoice } from "../../../Contexts/InvoiceContext/InvoiceContext";
import { useClients } from "../../../Contexts/apiClientContext/apiClientContext";
import { useService } from "../../../Contexts/ServiceContext/ServiceContext";
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";

const NewInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const { createInvoice, updateInvoice, loading } = useInvoice();

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
    InvoiceDate: new Date().toISOString().split("T")[0],
    DueDate: "",
    ClientId: "",
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

  // FIXED: Remove the dependencies that were causing the infinite loop
  const loadInitialData = useCallback(async () => {
    try {
      // Load clients first since they're most critical
      await getClients();

      // Then load services and products in parallel
      await Promise.all([getServices(), getProducts()]);

      setInitialLoadComplete(true);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, []); // FIXED: Empty dependency array to prevent infinite loop

  const productsData = products?.Data?.$values || [];

  // FIXED: Load initial data only once when component mounts and token is available
  useEffect(() => {
    getProducts();
    if (token && !initialLoadComplete) {
      loadInitialData();
    }
  }, [token, initialLoadComplete]); // FIXED: Removed loadInitialData from dependencies

  // Initialize form data

  console.log("services===>", services);
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

  // FIXED: Calculate totals function - moved outside useEffect to prevent dependencies issue
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
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

    // Auto-populate price when product or service is selected
    if (field === "ProductId" && value) {
      try {
        const product = productsData.find((p) => p.Id === value);
        if (product && product.Price) {
          updatedItems[index].UnitPrice = product.Price;
        }
      } catch (error) {
        console.error("Error finding product:", error);
      }
    }

    if (field === "ServiceId" && value) {
      const service = services.find((s) => s.Id === value);
      if (service && service.Price) {
        updatedItems[index].UnitPrice = service.Price;
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.ClientId) {
      newErrors.ClientId = "Client is required";
    }

    // Validate items
    if (
      invoiceItems.length === 0 ||
      invoiceItems.every((item) => !item.ItemType)
    ) {
      newErrors.items = "At least one item is required";
    }

    // Validate item data
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
          newErrors[`item_${index}_quantity`] = "Invalid quantity";
        }

        if (isNaN(unitPrice) || unitPrice < 0) {
          newErrors[`item_${index}_price`] = "Invalid price format";
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
      // Prepare invoice data
      const invoiceData = {
        ...formData,
        InvoiceItems: invoiceItems
          .filter((item) => item.ItemType)
          .map((item) => ({
            ItemType: item.ItemType,
            ProductId: item.ItemType === "Product" ? item.ProductId : null,
            ServiceId: item.ItemType === "Service" ? item.ServiceId : null,
            Quantity: parseFloat(item.Quantity),
            UnitPrice: parseFloat(item.UnitPrice),
            TaxRate: parseFloat(item.TaxRate),
            LineTotal: parseFloat(item.LineTotal),
          })),
      };

      let result;

      if (isEditing && editData) {
        // Update existing invoice
        result = await updateInvoice(editData.Id, invoiceData);
        if (result) {
          alert("Invoice updated successfully");
          navigate("/admin/invoices");
        } else {
          alert("Failed to update invoice");
        }
      } else {
        // Create new invoice
        result = await createInvoice(invoiceData);
        if (result) {
          alert("Invoice created successfully");
          navigate("/admin/invoices");
        } else {
          alert("Failed to create invoice");
        }
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert(
        isEditing ? "Failed to update invoice" : "Failed to create invoice"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (!token || !initialLoadComplete) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">Loading...</Span>
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
    return clients.find((client) => client.Id === formData.ClientId);
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
                Invoice Information
              </h2>
            </Container>

            <Container className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Invoice Number */}
              {/* <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.InvoiceNumber}
                  onChange={(e) =>
                    handleInputChange("InvoiceNumber", e.target.value)
                  }
                  placeholder="Enter invoice number"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.InvoiceNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.InvoiceNumber && (
                  <Span className="text-red-500 text-sm mt-1">
                    {errors.InvoiceNumber}
                  </Span>
                )}
              </Container> */}

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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </Container>
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
                  value={formData.ClientId}
                  onChange={(e) =>
                    handleInputChange("ClientId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ClientId ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={clientsLoading}
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.Id} value={client.Id}>
                      {client.Name || client.CompanyName}
                    </option>
                  ))}
                </select>
                {errors.ClientId && (
                  <Span className="text-red-500 text-sm mt-1">
                    {errors.ClientId}
                  </Span>
                )}
                {clientsLoading && (
                  <Span className="text-gray-500 text-sm mt-1">
                    Loading clients...
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
                              {selectedClient.Name ||
                                selectedClient.CompanyName}
                            </Span>
                            {selectedClient.Email && (
                              <Span className="text-sm text-gray-600 block">
                                {selectedClient.Email}
                              </Span>
                            )}
                            {selectedClient.Phone && (
                              <Span className="text-sm text-gray-600 block">
                                {selectedClient.Phone}
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
                          <option value="">Select Product</option>
                          {productsData.map((product) => (
                            <option key={product.Id} value={product.Id}>
                              {product.Name}
                            </option>
                          ))}
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
                          <option value="">Select Service</option>
                          {services.map((service) => (
                            <option key={service.Id} value={service.Id}>
                              {service.Name}
                            </option>
                          ))}
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
