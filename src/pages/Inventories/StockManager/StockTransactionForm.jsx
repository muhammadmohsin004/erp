import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Warehouse,
  DollarSign,
  Calendar,
  FileText,
  Hash,
} from "lucide-react";
import { useStock } from "../../../Contexts/StockContext/StockContext";
import { useWarehouse } from "../../../Contexts/WarehouseContext/WarehouseContext";

import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";

const StockTransactionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const translations = {
    "Add Stock Transaction":
      language === "ar" ? "إضافة معاملة مخزون" : "Add Stock Transaction",
    "Adjust Stock": language === "ar" ? "تعديل المخزون" : "Adjust Stock",
    "Transfer Stock": language === "ar" ? "نقل المخزون" : "Transfer Stock",
    "Stock Management":
      language === "ar" ? "إدارة المخزون" : "Stock Management",
    Product: language === "ar" ? "المنتج" : "Product",
    "Transaction Type": language === "ar" ? "نوع المعاملة" : "Transaction Type",
    Quantity: language === "ar" ? "الكمية" : "Quantity",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    Warehouse: language === "ar" ? "المستودع" : "Warehouse",
    "From Warehouse": language === "ar" ? "من المستودع" : "From Warehouse",
    "To Warehouse": language === "ar" ? "إلى المستودع" : "To Warehouse",
    "New Quantity": language === "ar" ? "الكمية الجديدة" : "New Quantity",
    Date: language === "ar" ? "التاريخ" : "Date",
    Notes: language === "ar" ? "ملاحظات" : "Notes",
    Reference: language === "ar" ? "المرجع" : "Reference",
    Reason: language === "ar" ? "السبب" : "Reason",
    Save: language === "ar" ? "حفظ" : "Save",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Back to List": language === "ar" ? "العودة للقائمة" : "Back to List",
    "Transaction Information":
      language === "ar" ? "معلومات المعاملة" : "Transaction Information",
    "Product Information":
      language === "ar" ? "معلومات المنتج" : "Product Information",
    "Additional Details":
      language === "ar" ? "تفاصيل إضافية" : "Additional Details",
    "Select product": language === "ar" ? "اختر المنتج" : "Select product",
    "Select transaction type":
      language === "ar" ? "اختر نوع المعاملة" : "Select transaction type",
    "Select warehouse":
      language === "ar" ? "اختر المستودع" : "Select warehouse",
    "Enter quantity": language === "ar" ? "أدخل الكمية" : "Enter quantity",
    "Enter price": language === "ar" ? "أدخل السعر" : "Enter price",
    "Enter notes": language === "ar" ? "أدخل الملاحظات" : "Enter notes",
    "Enter reference": language === "ar" ? "أدخل المرجع" : "Enter reference",
    "Enter reason": language === "ar" ? "أدخل السبب" : "Enter reason",
    "This field is required":
      language === "ar" ? "هذا الحقل مطلوب" : "This field is required",
    "Quantity must be greater than 0":
      language === "ar"
        ? "يجب أن تكون الكمية أكبر من 0"
        : "Quantity must be greater than 0",
    "Price must be greater than 0":
      language === "ar"
        ? "يجب أن يكون السعر أكبر من 0"
        : "Price must be greater than 0",
    "Saving...": language === "ar" ? "جارٍ الحفظ..." : "Saving...",
    "Creating...": language === "ar" ? "جارٍ الإنشاء..." : "Creating...",
    "Processing...": language === "ar" ? "جارٍ المعالجة..." : "Processing...",
    Success: language === "ar" ? "نجح" : "Success",
    Error: language === "ar" ? "خطأ" : "Error",
    Purchase: language === "ar" ? "شراء" : "Purchase",
    Sale: language === "ar" ? "بيع" : "Sale",
    "Stock Adjustment +":
      language === "ar" ? "تعديل مخزون +" : "Stock Adjustment +",
    "Stock Adjustment -":
      language === "ar" ? "تعديل مخزون -" : "Stock Adjustment -",
    "Transfer In": language === "ar" ? "نقل داخل" : "Transfer In",
    "Transfer Out": language === "ar" ? "نقل خارج" : "Transfer Out",
  };

  // Get stock context
  const {
    addStockTransaction,
    adjustStock,
    transferStock,
    loading,
    error,
    clearError,
  } = useStock();

  const { getProductsDropdown } = useProductsManager();

  const { getWarehousesDropdown } = useWarehouse();

  // Determine form type based on location state or path
  const { formType, productId } = location.state || {};
  const currentFormType = formType || "transaction"; // transaction, adjust, transfer
  const [productsDropdown, setProductsDropdown] = useState([]);
  const [warehousesDropdown, setWarehousesDropdown] = useState([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setDropdownsLoading(true);

        // Fetch products dropdown
        const productsData = await getProductsDropdown();
        console.log("Products raw response:", productsData);

        // Extract products array regardless of response structure
        let productsArray = [];
        if (productsData?.$values) {
          productsArray = productsData.$values;
        } else if (productsData?.Data?.$values) {
          productsArray = productsData.Data.$values;
        } else if (Array.isArray(productsData)) {
          productsArray = productsData;
        }

        setProductsDropdown(productsArray);
        console.log("Products dropdown set to:", productsArray);

        // Fetch warehouses dropdown
        const warehousesData = await getWarehousesDropdown();
        console.log("Warehouses raw response:", warehousesData);

        // Extract warehouses array regardless of response structure
        let warehousesArray = [];
        if (warehousesData?.$values) {
          warehousesArray = warehousesData.$values;
        } else if (warehousesData?.Data?.$values) {
          warehousesArray = warehousesData.Data.$values;
        } else if (Array.isArray(warehousesData)) {
          warehousesArray = warehousesData;
        }

        setWarehousesDropdown(warehousesArray);
        console.log("Warehouses dropdown set to:", warehousesArray);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setProductsDropdown([]);
        setWarehousesDropdown([]);
      } finally {
        setDropdownsLoading(false);
      }
    };

    fetchDropdownData();
  }, [getProductsDropdown, getWarehousesDropdown]);

  // Form state
  const [formData, setFormData] = useState({
    productId: productId || "",
    transactionType: "",
    quantity: "",
    unitPrice: "",
    warehouseId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    newQuantity: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    referenceNumber: "",
    reason: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transaction types based on form type
  const getTransactionTypes = () => {
    switch (currentFormType) {
      case "adjust":
        return [
          {
            value: "Stock Adjustment +",
            label: translations["Stock Adjustment +"],
          },
          {
            value: "Stock Adjustment -",
            label: translations["Stock Adjustment -"],
          },
        ];
      case "transfer":
        return [{ value: "Transfer", label: "Transfer" }];
      default:
        return [
          { value: "Purchase", label: translations.Purchase },
          { value: "Sale", label: translations.Sale },
          {
            value: "Stock Adjustment +",
            label: translations["Stock Adjustment +"],
          },
          {
            value: "Stock Adjustment -",
            label: translations["Stock Adjustment -"],
          },
          { value: "Transfer In", label: translations["Transfer In"] },
          { value: "Transfer Out", label: translations["Transfer Out"] },
        ];
    }
  };

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Clear errors when form type changes
  useEffect(() => {
    if (clearError) {
      clearError();
    }
  }, [currentFormType, clearError]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    console.log("Input change:", { name, value });

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form based on form type
  const validateForm = () => {
    console.log("Validating form with data:", formData);
    const errors = {};

    // Common validations
    if (!formData.productId) {
      errors.productId = translations["This field is required"];
    }

    if (currentFormType === "transfer") {
      // Transfer validations
      if (!formData.fromWarehouseId) {
        errors.fromWarehouseId = translations["This field is required"];
      }
      if (!formData.toWarehouseId) {
        errors.toWarehouseId = translations["This field is required"];
      }
      if (formData.fromWarehouseId === formData.toWarehouseId) {
        errors.toWarehouseId = "Cannot transfer to the same warehouse";
      }
      if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
        errors.quantity = translations["Quantity must be greater than 0"];
      }
    } else if (currentFormType === "adjust") {
      // Adjustment validations
      if (!formData.warehouseId) {
        errors.warehouseId = translations["This field is required"];
      }
      if (!formData.newQuantity || parseFloat(formData.newQuantity) < 0) {
        errors.newQuantity = "New quantity must be 0 or greater";
      }
      if (!formData.reason) {
        errors.reason = translations["This field is required"];
      }
    } else {
      // Regular transaction validations
      if (!formData.transactionType) {
        errors.transactionType = translations["This field is required"];
      }
      if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
        errors.quantity = translations["Quantity must be greater than 0"];
      }
      if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
        errors.unitPrice = translations["Price must be greater than 0"];
      }
      if (!formData.warehouseId) {
        errors.warehouseId = translations["This field is required"];
      }
    }

    console.log("Validation errors:", errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    console.log("handleSubmit called");

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSubmitting) {
      console.log("Already submitting, returning early");
      return;
    }

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsSubmitting(true);
    console.log("Starting submission...");

    try {
      let result;

      if (currentFormType === "transfer") {
        const transferData = {
          FromWarehouseId: parseInt(formData.fromWarehouseId),
          ToWarehouseId: parseInt(formData.toWarehouseId),
          Quantity: parseInt(formData.quantity),
          Date: formData.date,
          Notes: formData.notes,
          ReferenceNumber: formData.referenceNumber,
        };

        console.log("Transferring stock with data:", transferData);
        result = await transferStock(
          parseInt(formData.productId),
          transferData
        );
      } else if (currentFormType === "adjust") {
        const adjustData = {
          WarehouseId: parseInt(formData.warehouseId),
          NewQuantity: parseInt(formData.newQuantity),
          Reason: formData.reason,
        };

        console.log("Adjusting stock with data:", adjustData);
        result = await adjustStock(parseInt(formData.productId), adjustData);
      } else {
        const transactionData = {
          TransactionType: formData.transactionType,
          Quantity: parseInt(formData.quantity),
          UnitPrice: parseFloat(formData.unitPrice),
          WarehouseId: parseInt(formData.warehouseId),
          Date: formData.date,
          Notes: formData.notes,
          ReferenceNumber: formData.referenceNumber,
        };

        console.log("Adding transaction with data:", transactionData);
        result = await addStockTransaction(
          parseInt(formData.productId),
          transactionData
        );
      }

      console.log("API result:", result);

      if (result) {
        console.log("Success! Navigating back to list");
        navigate("/admin/stock/movements", {
          state: {
            message: getSuccessMessage(),
            type: "success",
          },
        });
      } else {
        console.log("No result returned from API");
        alert("Failed to process transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      alert(`Error: ${error.message || "Failed to process transaction"}`);
    } finally {
      setIsSubmitting(false);
      console.log("Submission completed");
    }
  };

  // Get success message based on form type
  const getSuccessMessage = () => {
    switch (currentFormType) {
      case "transfer":
        return "Stock transferred successfully";
      case "adjust":
        return "Stock adjusted successfully";
      default:
        return "Transaction added successfully";
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/admin/stock/movements");
  };

  // Get page title
  const getPageTitle = () => {
    switch (currentFormType) {
      case "transfer":
        return translations["Transfer Stock"];
      case "adjust":
        return translations["Adjust Stock"];
      default:
        return translations["Add Stock Transaction"];
    }
  };

  // Get form icon
  const getFormIcon = () => {
    switch (currentFormType) {
      case "transfer":
        return ArrowUpDown;
      case "adjust":
        return TrendingUp;
      default:
        return Package;
    }
  };

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">Loading...</Span>
      </Container>
    );
  }

  const FormIcon = getFormIcon();

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
              onClick={handleCancel}
            />
            <Container>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FormIcon className="w-6 h-6" />
                {getPageTitle()}
              </h1>
              <Span className="text-sm text-gray-500">
                {translations["Stock Management"]}
              </Span>
            </Container>
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
              onClick={handleCancel}
              disabled={isSubmitting}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? translations["Processing..."] : translations.Save}
            </button>
          </Container>
        </Container>

        {/* Error Display */}
        {error && (
          <Container className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Span className="text-red-800 text-sm">{error}</Span>
          </Container>
        )}

        {/* Form */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <Container className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Information */}
              <Container className="space-y-6">
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {translations["Product Information"]}
                  </h3>

                  {/* Product Selection */}
                  {/* Product Selection */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.Product} *
                    </label>
                    <select
                      name="productId"
                      value={formData.productId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.productId
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting || dropdownsLoading}
                    >
                      <option value="">
                        {dropdownsLoading
                          ? "Loading products..."
                          : translations["Select product"]}
                      </option>
                      {!dropdownsLoading &&
                        productsDropdown.map((product) => (
                          <option key={product.Id} value={product.Id}>
                            {product.Name} ({product.ItemCode})
                          </option>
                        ))}
                    </select>
                    {formErrors.productId && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.productId}
                      </Span>
                    )}
                  </Container>

                  {/* Transaction Type (for regular transactions) */}
                  {currentFormType === "transaction" && (
                    <Container className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["Transaction Type"]} *
                      </label>
                      <select
                        name="transactionType"
                        value={formData.transactionType}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.transactionType
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      >
                        <option value="">
                          {translations["Select transaction type"]}
                        </option>
                        {getTransactionTypes().map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {formErrors.transactionType && (
                        <Span className="text-red-500 text-sm mt-1 block">
                          {formErrors.transactionType}
                        </Span>
                      )}
                    </Container>
                  )}

                  {/* Warehouse Selection (for transaction and adjust) */}
                  {/* Warehouse Selection (for transaction and adjust) */}
                  {currentFormType !== "transfer" && (
                    <Container className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.Warehouse} *
                      </label>
                      <Container className="relative">
                        <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="warehouseId"
                          value={formData.warehouseId}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.warehouseId
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          disabled={isSubmitting || dropdownsLoading}
                        >
                          <option value="">
                            {dropdownsLoading
                              ? "Loading warehouses..."
                              : translations["Select warehouse"]}
                          </option>
                          {!dropdownsLoading &&
                            warehousesDropdown.map((warehouse) => (
                              <option key={warehouse.Id} value={warehouse.Id}>
                                {warehouse.Name}
                              </option>
                            ))}
                        </select>
                      </Container>
                      {formErrors.warehouseId && (
                        <Span className="text-red-500 text-sm mt-1 block">
                          {formErrors.warehouseId}
                        </Span>
                      )}
                    </Container>
                  )}
                  {/* Transfer Warehouses */}
                  {currentFormType === "transfer" && (
                    <>
                      <Container className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {translations["From Warehouse"]} *
                        </label>
                        <Container className="relative">
                          <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            name="fromWarehouseId"
                            value={formData.fromWarehouseId}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors.fromWarehouseId
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                            disabled={isSubmitting || dropdownsLoading}
                          >
                            <option value="">
                              {dropdownsLoading
                                ? "Loading warehouses..."
                                : translations["Select warehouse"]}
                            </option>
                            {!dropdownsLoading &&
                              warehousesDropdown.map((warehouse) => (
                                <option key={warehouse.Id} value={warehouse.Id}>
                                  {warehouse.Name}
                                </option>
                              ))}
                          </select>
                        </Container>
                        {formErrors.fromWarehouseId && (
                          <Span className="text-red-500 text-sm mt-1 block">
                            {formErrors.fromWarehouseId}
                          </Span>
                        )}
                      </Container>

                      <Container className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {translations["To Warehouse"]} *
                        </label>
                        <Container className="relative">
                          <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            name="toWarehouseId"
                            value={formData.toWarehouseId}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors.toWarehouseId
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                            disabled={isSubmitting || dropdownsLoading}
                          >
                            <option value="">
                              {dropdownsLoading
                                ? "Loading warehouses..."
                                : translations["Select warehouse"]}
                            </option>
                            {!dropdownsLoading &&
                              warehousesDropdown.map((warehouse) => (
                                <option key={warehouse.Id} value={warehouse.Id}>
                                  {warehouse.Name}
                                </option>
                              ))}
                          </select>
                        </Container>
                        {formErrors.toWarehouseId && (
                          <Span className="text-red-500 text-sm mt-1 block">
                            {formErrors.toWarehouseId}
                          </Span>
                        )}
                      </Container>
                    </>
                  )}
                </Container>
              </Container>

              {/* Transaction Details */}
              <Container className="space-y-6">
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {translations["Transaction Information"]}
                  </h3>

                  {/* Quantity (for transaction and transfer) */}
                  {currentFormType !== "adjust" && (
                    <Container className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.Quantity} *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder={translations["Enter quantity"]}
                        min="1"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.quantity
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                      {formErrors.quantity && (
                        <Span className="text-red-500 text-sm mt-1 block">
                          {formErrors.quantity}
                        </Span>
                      )}
                    </Container>
                  )}

                  {/* New Quantity (for adjust) */}
                  {currentFormType === "adjust" && (
                    <Container className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["New Quantity"]} *
                      </label>
                      <input
                        type="number"
                        name="newQuantity"
                        value={formData.newQuantity}
                        onChange={handleInputChange}
                        placeholder={translations["Enter quantity"]}
                        min="0"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.newQuantity
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                      {formErrors.newQuantity && (
                        <Span className="text-red-500 text-sm mt-1 block">
                          {formErrors.newQuantity}
                        </Span>
                      )}
                    </Container>
                  )}

                  {/* Unit Price (for regular transactions) */}
                  {currentFormType === "transaction" && (
                    <Container className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations["Unit Price"]} *
                      </label>
                      <Container className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          name="unitPrice"
                          value={formData.unitPrice}
                          onChange={handleInputChange}
                          placeholder={translations["Enter price"]}
                          step="0.01"
                          min="0.01"
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.unitPrice
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          disabled={isSubmitting}
                        />
                      </Container>
                      {formErrors.unitPrice && (
                        <Span className="text-red-500 text-sm mt-1 block">
                          {formErrors.unitPrice}
                        </Span>
                      )}
                    </Container>
                  )}

                  {/* Date */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.Date}
                    </label>
                    <Container className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </Container>
                  </Container>

                  {/* Reference Number */}
                  {currentFormType !== "adjust" && (
                    <Container className="mb-4">
                      <Container className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="referenceNumber"
                          value={formData.referenceNumber}
                          onChange={handleInputChange}
                          placeholder={translations["Enter reference"]}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          disabled={isSubmitting}
                        />
                      </Container>
                    </Container>
                  )}

                  {/* Notes or Reason */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentFormType === "adjust"
                        ? translations.Reason
                        : translations.Notes}
                      {currentFormType === "adjust" && " *"}
                    </label>
                    <textarea
                      name={currentFormType === "adjust" ? "reason" : "notes"}
                      value={
                        currentFormType === "adjust"
                          ? formData.reason
                          : formData.notes
                      }
                      onChange={handleInputChange}
                      placeholder={
                        currentFormType === "adjust"
                          ? translations["Enter reason"]
                          : translations["Enter notes"]
                      }
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.reason || formErrors.notes
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {(formErrors.reason || formErrors.notes) && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.reason || formErrors.notes}
                      </Span>
                    )}
                  </Container>
                </Container>
              </Container>
            </Container>

            {/* Submit button inside form */}
            <Container className="mt-8 pt-6 border-t border-gray-200">
              <Container className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  {translations.Cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting
                    ? translations["Processing..."]
                    : translations.Save}
                </button>
              </Container>
            </Container>
          </form>
        </Container>

        {/* Back to List Link */}
        <Container className="mt-6">
          <FilledButton
            isIcon={true}
            icon={ArrowLeft}
            iconSize="w-4 h-4"
            bgColor="bg-transparent hover:bg-gray-100"
            textColor="text-blue-600 hover:text-blue-700"
            rounded="rounded-lg"
            buttonText={translations["Back to List"]}
            height="h-10"
            px="px-4"
            fontWeight="font-medium"
            fontSize="text-sm"
            isIconLeft={true}
            onClick={handleCancel}
          />
        </Container>
      </Container>
    </Container>
  );
};

export default StockTransactionForm;
