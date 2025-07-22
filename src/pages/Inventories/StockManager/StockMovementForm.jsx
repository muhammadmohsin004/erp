import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const StockMovementForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const isEdit = Boolean(id);
  const formType = location.state?.formType || "transaction"; // transaction, adjust, transfer

  const translations = {
    "Add Stock Movement":
      language === "ar" ? "إضافة حركة مخزون" : "Add Stock Movement",
    "Edit Stock Movement":
      language === "ar" ? "تعديل حركة مخزون" : "Edit Stock Movement",
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
    "Movement Information":
      language === "ar" ? "معلومات الحركة" : "Movement Information",
    "Product Information":
      language === "ar" ? "معلومات المنتج" : "Product Information",
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
    "Processing...": language === "ar" ? "جارٍ المعالجة..." : "Processing...",
    "Loading...": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    Purchase: language === "ar" ? "شراء" : "Purchase",
    Sale: language === "ar" ? "بيع" : "Sale",
    "Stock Adjustment +":
      language === "ar" ? "تعديل مخزون +" : "Stock Adjustment +",
    "Stock Adjustment -":
      language === "ar" ? "تعديل مخزون -" : "Stock Adjustment -",
    "Transfer In": language === "ar" ? "نقل داخل" : "Transfer In",
    "Transfer Out": language === "ar" ? "نقل خارج" : "Transfer Out",
  };

  // Context hooks
  const {
    stockMovements,
    loading: stockLoading,
    error,
    addStockTransaction,
    updateStockMovement,
    getStockMovements,
    clearError,
  } = useStock();

  const { getProductsDropdown } = useProductsManager();
  const { getWarehousesDropdown } = useWarehouse();

  // State
  const [currentMovement, setCurrentMovement] = useState(null);
  const [productsDropdown, setProductsDropdown] = useState([]);
  const [warehousesDropdown, setWarehousesDropdown] = useState([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productId: "",
    movementType: "",
    quantity: "",
    unitPrice: "",
    warehouseId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    referenceNumber: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setDropdownsLoading(true);

        // Fetch products dropdown
        const productsData = await getProductsDropdown();
        let productsArray = [];
        if (productsData?.$values) {
          productsArray = productsData.$values;
        } else if (productsData?.Data?.$values) {
          productsArray = productsData.Data.$values;
        } else if (Array.isArray(productsData)) {
          productsArray = productsData;
        }
        setProductsDropdown(productsArray);

        // Fetch warehouses dropdown
        const warehousesData = await getWarehousesDropdown();
        let warehousesArray = [];
        if (warehousesData?.$values) {
          warehousesArray = warehousesData.$values;
        } else if (warehousesData?.Data?.$values) {
          warehousesArray = warehousesData.Data.$values;
        } else if (Array.isArray(warehousesData)) {
          warehousesArray = warehousesData;
        }
        setWarehousesDropdown(warehousesArray);
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

  // Find movement for editing
  useEffect(() => {
    if (isEdit && stockMovements?.Data?.$values && id) {
      const movement = stockMovements.Data.$values.find(
        (m) => m.Id === parseInt(id)
      );
      if (movement) {
        setCurrentMovement(movement);
        setFormData({
          productId: movement.ProductId || "",
          movementType: movement.MovementType || "",
          quantity: Math.abs(movement.QuantityChange) || "",
          unitPrice: "",
          warehouseId: movement.WarehouseId || "",
          fromWarehouseId: "",
          toWarehouseId: "",
          date: movement.CreatedAt
            ? new Date(movement.CreatedAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          notes: movement.Notes || "",
          referenceNumber: movement.Reference || "",
        });
      }
    } else if (isEdit && token && id) {
      getStockMovements();
    }
  }, [isEdit, stockMovements, id, token, getStockMovements]);

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
  }, [clearError]);

  // Get transaction types
  const getTransactionTypes = () => {
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
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

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

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Common validations
    if (!formData.productId) {
      errors.productId = translations["This field is required"];
    }

    if (!formData.movementType) {
      errors.movementType = translations["This field is required"];
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      errors.quantity = translations["Quantity must be greater than 0"];
    }

    if (!formData.warehouseId) {
      errors.warehouseId = translations["This field is required"];
    }

    // Price validation for Purchase and Sale
    if (
      (formData.movementType === "Purchase" ||
        formData.movementType === "Sale") &&
      (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0)
    ) {
      errors.unitPrice = translations["Price must be greater than 0"];
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine quantity change based on movement type
      let quantityChange = parseInt(formData.quantity);
      if (
        formData.movementType === "Sale" ||
        formData.movementType === "Stock Adjustment -" ||
        formData.movementType === "Transfer Out"
      ) {
        quantityChange = -quantityChange;
      }

      const transactionData = {
        ProductId: parseInt(formData.productId),
        MovementType: formData.movementType,
        QuantityChange: quantityChange,
        ...(formData.unitPrice && {
          UnitPrice: parseFloat(formData.unitPrice),
        }),
        WarehouseId: parseInt(formData.warehouseId),
        Date: formData.date,
        Notes: formData.notes,
        Reference: formData.referenceNumber,
      };

      let result;
      if (isEdit) {
        result = await updateStockMovement(parseInt(id), transactionData);
      } else {
        result = await addStockTransaction(
          parseInt(formData.productId),
          transactionData
        );
      }

      if (result) {
        navigate("/admin/stock/movements", {
          state: {
            message: isEdit
              ? "Stock movement updated successfully"
              : "Stock movement created successfully",
            type: "success",
          },
        });
      } else {
        alert(
          `Failed to ${
            isEdit ? "update" : "create"
          } movement. Please try again.`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEdit ? "updating" : "creating"} movement:`,
        error
      );
      alert(
        `Error: ${
          error.message || `Failed to ${isEdit ? "update" : "create"} movement`
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isEdit) {
      navigate(`/admin/stock/movements/${id}`);
    } else {
      navigate("/admin/stock/movements");
    }
  };

  // Get page title
  const getPageTitle = () => {
    return isEdit
      ? translations["Edit Stock Movement"]
      : translations["Add Stock Movement"];
  };

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">
          {translations["Loading..."]}
        </Span>
      </Container>
    );
  }

  if (stockLoading || dropdownsLoading) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <Span className="text-blue-500 text-lg ml-4">
          {translations["Loading..."]}
        </Span>
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
              onClick={handleCancel}
            />
            <Container>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6" />
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
                      disabled={isSubmitting}
                    >
                      <option value="">{translations["Select product"]}</option>
                      {productsDropdown.map((product) => (
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

                  {/* Movement Type */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations["Transaction Type"]} *
                    </label>
                    <select
                      name="movementType"
                      value={formData.movementType}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.movementType
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
                    {formErrors.movementType && (
                      <Span className="text-red-500 text-sm mt-1 block">
                        {formErrors.movementType}
                      </Span>
                    )}
                  </Container>

                  {/* Warehouse Selection */}
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
                        disabled={isSubmitting}
                      >
                        <option value="">
                          {translations["Select warehouse"]}
                        </option>
                        {warehousesDropdown.map((warehouse) => (
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
                </Container>
              </Container>

              {/* Movement Details */}
              <Container className="space-y-6">
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {translations["Movement Information"]}
                  </h3>

                  {/* Quantity */}
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

                  {/* Unit Price (for Purchase and Sale only) */}
                  {(formData.movementType === "Purchase" ||
                    formData.movementType === "Sale") && (
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
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.Reference}
                    </label>
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

                  {/* Notes */}
                  <Container className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.Notes}
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder={translations["Enter notes"]}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={isSubmitting}
                    />
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

export default StockMovementForm;
