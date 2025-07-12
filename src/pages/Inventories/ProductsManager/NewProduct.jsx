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
  Package,
  DollarSign,
  Barcode,
  Tag,
  Image,
  FileText,
  Settings,
  Layers,
  Star,
  AlertTriangle,
  TrendingUp,
  Calculator,
  Percent,
  Building,
  Users,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";
import { useSupplier } from "../../../Contexts/SupplierContext/SupplierContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

// Move InputField component outside to prevent re-creation
const InputField = React.memo(
  ({
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
    disabled = false,
    min,
    max,
    step,
    options = [],
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
            className={`block w-full ${
              Icon ? "pl-10" : "pl-3"
            } pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        ) : as === "select" ? (
          <select
            name={name}
            value={value || ""}
            onChange={(e) => onChange(name, e.target.value)}
            disabled={disabled}
            className={`block w-full ${
              Icon ? "pl-10" : "pl-3"
            } pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {name === "Status" && (
              <>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Draft">Draft</option>
              </>
            )}
            {name === "TrackingType" && (
              <>
                <option value="None">No Tracking</option>
                <option value="Simple">Simple Tracking</option>
                <option value="Batch">Batch Tracking</option>
                <option value="Serial">Serial Number Tracking</option>
              </>
            )}
            {name === "UnitOfMeasure" && (
              <>
                <option value="piece">Piece</option>
                <option value="kg">Kilogram</option>
                <option value="lbs">Pounds</option>
                <option value="meter">Meter</option>
                <option value="liter">Liter</option>
                <option value="box">Box</option>
                <option value="carton">Carton</option>
                <option value="dozen">Dozen</option>
              </>
            )}
            {name === "TaxRate" && (
              <>
                <option value="0">Tax Free</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
              </>
            )}
            {name === "CategoryId" &&
              options.length > 0 &&
              options.map((option) => (
                <option key={option.Id} value={option.Id}>
                  {option.Name}
                </option>
              ))}
            {name === "BrandId" &&
              options.length > 0 &&
              options.map((option) => (
                <option key={option.Id} value={option.Id}>
                  {option.Name}
                </option>
              ))}
            {name === "SupplierId" &&
              options.length > 0 &&
              options.map((option) => (
                <option key={option.Id} value={option.Id}>
                  {option.Name || option.CompanyName}
                </option>
              ))}
            {name === "DiscountType" && (
              <>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
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
            min={min}
            max={max}
            step={step}
            className={`block w-full ${
              Icon ? "pl-10" : "pl-3"
            } pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        )}
      </Container>
      {error && <Span className="text-red-500 text-sm">{error}</Span>}
    </Container>
  )
);

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

const NewProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const {
    createProduct,
    updateProduct,
    getCategoriesDropdown,
    getBrandsDropdown,
    createProductImage,
    dropdowns,
    loading,
    error,
  } = useProductsManager();

  // Import supplier context separately since it's not part of ProductsManager
  const { getSuppliers, suppliers } = useSupplier
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useSupplier()
    : { getSuppliers: null, suppliers: null };

  // Memoize translations to prevent re-creation
  const translations = React.useMemo(
    () => ({
      "New Product": language === "ar" ? "منتج جديد" : "New Product",
      "Edit Product": language === "ar" ? "تعديل المنتج" : "Edit Product",
      "Basic Information":
        language === "ar" ? "المعلومات الأساسية" : "Basic Information",
      "Pricing Information":
        language === "ar" ? "معلومات التسعير" : "Pricing Information",
      "Inventory Information":
        language === "ar" ? "معلومات المخزون" : "Inventory Information",
      "Product Images": language === "ar" ? "صور المنتج" : "Product Images",
      "Categories & Classification":
        language === "ar" ? "الفئات والتصنيف" : "Categories & Classification",
      "Additional Information":
        language === "ar" ? "معلومات إضافية" : "Additional Information",
      "Product Name": language === "ar" ? "اسم المنتج" : "Product Name",
      "Item Code": language === "ar" ? "كود المنتج" : "Item Code",
      Barcode: language === "ar" ? "الباركود" : "Barcode",
      Description: language === "ar" ? "الوصف" : "Description",
      "Short Description":
        language === "ar" ? "وصف مختصر" : "Short Description",
      Status: language === "ar" ? "الحالة" : "Status",
      "Purchase Price": language === "ar" ? "سعر الشراء" : "Purchase Price",
      "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
      "Minimum Price":
        language === "ar" ? "الحد الأدنى للسعر" : "Minimum Price",
      Discount: language === "ar" ? "الخصم" : "Discount",
      "Discount Type": language === "ar" ? "نوع الخصم" : "Discount Type",
      "Tax Rate": language === "ar" ? "معدل الضريبة" : "Tax Rate",
      "Current Stock": language === "ar" ? "المخزون الحالي" : "Current Stock",
      "Minimum Stock":
        language === "ar" ? "الحد الأدنى للمخزون" : "Minimum Stock",
      "Maximum Stock":
        language === "ar" ? "الحد الأقصى للمخزون" : "Maximum Stock",
      "Unit of Measure": language === "ar" ? "وحدة القياس" : "Unit of Measure",
      "Tracking Type": language === "ar" ? "نوع التتبع" : "Tracking Type",
      "Reorder Point": language === "ar" ? "نقطة إعادة الطلب" : "Reorder Point",
      Category: language === "ar" ? "الفئة" : "Category",
      Brand: language === "ar" ? "العلامة التجارية" : "Brand",
      Supplier: language === "ar" ? "المورد" : "Supplier",
      Tags: language === "ar" ? "العلامات" : "Tags",
      Weight: language === "ar" ? "الوزن" : "Weight",
      Dimensions: language === "ar" ? "الأبعاد" : "Dimensions",
      Length: language === "ar" ? "الطول" : "Length",
      Width: language === "ar" ? "العرض" : "Width",
      Height: language === "ar" ? "الارتفاع" : "Height",
      Manufacturer: language === "ar" ? "الشركة المصنعة" : "Manufacturer",
      "Model Number": language === "ar" ? "رقم الموديل" : "Model Number",
      "Warranty Period": language === "ar" ? "فترة الضمان" : "Warranty Period",
      "Internal Notes": language === "ar" ? "ملاحظات داخلية" : "Internal Notes",
      "Save Product": language === "ar" ? "حفظ المنتج" : "Save Product",
      "Update Product": language === "ar" ? "تحديث المنتج" : "Update Product",
      Cancel: language === "ar" ? "إلغاء" : "Cancel",
      Back: language === "ar" ? "رجوع" : "Back",
      Required: language === "ar" ? "مطلوب" : "Required",
      "Upload Images": language === "ar" ? "رفع الصور" : "Upload Images",
      "Choose Images": language === "ar" ? "اختر الصور" : "Choose Images",
      "Remove Image": language === "ar" ? "إزالة الصورة" : "Remove Image",
      "Primary Image": language === "ar" ? "الصورة الأساسية" : "Primary Image",
      "Set as Primary": language === "ar" ? "تعيين كأساسي" : "Set as Primary",
      "No images selected":
        language === "ar" ? "لم يتم اختيار صور" : "No images selected",
      Active: language === "ar" ? "نشط" : "Active",
      Inactive: language === "ar" ? "غير نشط" : "Inactive",
      Draft: language === "ar" ? "مسودة" : "Draft",
      "Featured Product": language === "ar" ? "منتج مميز" : "Featured Product",
      "Track Inventory": language === "ar" ? "تتبع المخزون" : "Track Inventory",
      "Allow Backorders":
        language === "ar" ? "السماح بالطلبات المؤجلة" : "Allow Backorders",
      "Sell when out of stock":
        language === "ar" ? "البيع عند نفاد المخزون" : "Sell when out of stock",
      "SEO Title": language === "ar" ? "عنوان SEO" : "SEO Title",
      "SEO Description": language === "ar" ? "وصف SEO" : "SEO Description",
      "Generate Barcode":
        language === "ar" ? "توليد الباركود" : "Generate Barcode",
      "Auto-generate if empty":
        language === "ar"
          ? "توليد تلقائي إذا كان فارغ"
          : "Auto-generate if empty",
      "Select Category": language === "ar" ? "اختر الفئة" : "Select Category",
      "Select Brand":
        language === "ar" ? "اختر العلامة التجارية" : "Select Brand",
      "Select Supplier": language === "ar" ? "اختر المورد" : "Select Supplier",
      "Enter tags separated by commas":
        language === "ar"
          ? "أدخل العلامات مفصولة بفاصلات"
          : "Enter tags separated by commas",
      "Product variants":
        language === "ar" ? "متغيرات المنتج" : "Product variants",
      "Add Variant": language === "ar" ? "إضافة متغير" : "Add Variant",
      "Variant Name": language === "ar" ? "اسم المتغير" : "Variant Name",
      "Variant Price": language === "ar" ? "سعر المتغير" : "Variant Price",
      "Variant Stock": language === "ar" ? "مخزون المتغير" : "Variant Stock",
      "Remove Variant": language === "ar" ? "إزالة المتغير" : "Remove Variant",
      months: language === "ar" ? "شهر" : "months",
      kg: language === "ar" ? "كيلو" : "kg",
      cm: language === "ar" ? "سم" : "cm",
      "Cost Price": language === "ar" ? "سعر التكلفة" : "Cost Price",
      "Profit Margin": language === "ar" ? "هامش الربح" : "Profit Margin",
      "Show on website":
        language === "ar" ? "عرض على الموقع" : "Show on website",
      "Require approval":
        language === "ar" ? "يتطلب موافقة" : "Require approval",
    }),
    [language]
  );

  // Check if editing (from location state or URL)
  const isEditing = location.state?.isEditing || false;
  const cloneData = location.state?.cloneData;
  const editData = location.state?.editData;

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    ItemCode: "",
    Barcode: "",
    Description: "",
    ShortDescription: "",
    Status: "Active",
    PurchasePrice: "",
    UnitPrice: "",
    MinimumPrice: "",
    CostPrice: "",
    Discount: "",
    DiscountType: "percentage",
    TaxRate: "0",
    CurrentStock: "",
    MinimumStock: "",
    MaximumStock: "",
    ReorderPoint: "",
    UnitOfMeasure: "piece",
    TrackingType: "Simple",
    CategoryId: "",
    BrandId: "",
    SupplierId: "",
    Tags: "",
    Weight: "",
    Length: "",
    Width: "",
    Height: "",
    Manufacturer: "",
    ModelNumber: "",
    WarrantyPeriod: "",
    InternalNotes: "",
    SEOTitle: "",
    SEODescription: "",
    IsFeatured: false,
    TrackInventory: true,
    AllowBackorders: false,
    SellWhenOutOfStock: false,
    ShowOnWebsite: true,
    RequireApproval: false,
  });

  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  // Initialize form data if editing or cloning
  useEffect(() => {
    if (cloneData) {
      setFormData({
        ...cloneData,
        Id: undefined,
        Name: `${cloneData.Name || ""} (Copy)`,
        ItemCode: "",
        Barcode: "",
        Status: "Draft",
      });
      if (cloneData.Images && Array.isArray(cloneData.Images)) {
        setImages(cloneData.Images);
      }
      if (cloneData.Variants && Array.isArray(cloneData.Variants)) {
        setVariants(cloneData.Variants);
      }
    } else if (editData) {
      setFormData(editData);
      if (editData.Images && Array.isArray(editData.Images)) {
        setImages(editData.Images);
      }
      if (editData.Variants && Array.isArray(editData.Variants)) {
        setVariants(editData.Variants);
      }
    }
  }, [cloneData, editData]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        console.log("Fetching dropdown data...");
        await getCategoriesDropdown();
        await getBrandsDropdown();

        // Fetch suppliers if available
        if (getSuppliers) {
          await getSuppliers();
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    if (token) {
      fetchDropdownData();
    }
  }, [token, getCategoriesDropdown, getBrandsDropdown, getSuppliers]);

  // Debug: Log dropdowns whenever it changes
  useEffect(() => {
    console.log("Dropdowns updated:", dropdowns);
    console.log("Suppliers updated:", suppliers);
  }, [dropdowns, suppliers]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Debug effects
  useEffect(() => {
    console.log("Current form data:", formData);
  }, [formData]);

  useEffect(() => {
    console.log("Loading state:", loading);
    console.log("Error state:", error);
  }, [loading, error]);

  // Memoize event handlers to prevent re-creation
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Auto-calculate profit margin when cost price or unit price changes
      if (field === "CostPrice" || field === "UnitPrice") {
        const costPrice =
          parseFloat(field === "CostPrice" ? value : formData.CostPrice) || 0;
        const unitPrice =
          parseFloat(field === "UnitPrice" ? value : formData.UnitPrice) || 0;

        if (costPrice > 0 && unitPrice > 0) {
          const profitMargin = (
            ((unitPrice - costPrice) / costPrice) *
            100
          ).toFixed(2);
          setFormData((prev) => ({
            ...prev,
            [field]: value,
            ProfitMargin: profitMargin,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [field]: value,
          }));
        }
      }

      // Clear error when user starts typing
      setErrors((prev) => {
        if (prev[field]) {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        }
        return prev;
      });
    },
    [formData.CostPrice, formData.UnitPrice]
  );

  // Handle image uploads
  const handleImageUpload = useCallback(
    (event) => {
      const files = Array.from(event.target.files);
      const newImages = files.map((file, index) => ({
        id: Date.now() + index,
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 && index === 0,
      }));
      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length]
  );

  // Remove image
  const removeImage = useCallback(
    (index) => {
      setImages((prev) => {
        const newImages = prev.filter((_, i) => i !== index);
        // If removed image was primary, set first image as primary
        if (index === primaryImageIndex && newImages.length > 0) {
          setPrimaryImageIndex(0);
        } else if (index < primaryImageIndex) {
          setPrimaryImageIndex(primaryImageIndex - 1);
        }
        return newImages;
      });
    },
    [primaryImageIndex]
  );

  // Set primary image
  const setPrimaryImage = useCallback((index) => {
    setPrimaryImageIndex(index);
  }, []);

  // Handle variants
  const addVariant = useCallback(() => {
    setVariants((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        price: "",
        stock: "",
      },
    ]);
  }, []);

  const removeVariant = useCallback((index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleVariantChange = useCallback((index, field, value) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value,
      };
      return newVariants;
    });
  }, []);

  // Generate barcode
  const generateBarcode = useCallback(() => {
    const barcode = "PRD" + Date.now().toString().slice(-8);
    handleInputChange("Barcode", barcode);
  }, [handleInputChange]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields validation
    if (!formData.Name?.trim()) {
      newErrors.Name = translations.Required;
    }

    if (
      !formData.UnitPrice ||
      isNaN(parseFloat(formData.UnitPrice)) ||
      parseFloat(formData.UnitPrice) <= 0
    ) {
      newErrors.UnitPrice = "Valid unit price is required";
    }

    // Optional numeric field validation
    if (formData.PurchasePrice && isNaN(parseFloat(formData.PurchasePrice))) {
      newErrors.PurchasePrice = "Invalid number format";
    }

    if (formData.CurrentStock && isNaN(parseInt(formData.CurrentStock))) {
      newErrors.CurrentStock = "Invalid number format";
    }

    if (formData.MinimumStock && isNaN(parseInt(formData.MinimumStock))) {
      newErrors.MinimumStock = "Invalid number format";
    }

    // Business logic validation
    if (formData.MinimumPrice && formData.UnitPrice) {
      const minPrice = parseFloat(formData.MinimumPrice);
      const unitPrice = parseFloat(formData.UnitPrice);
      if (minPrice > unitPrice) {
        newErrors.MinimumPrice =
          "Minimum price cannot be higher than unit price";
      }
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, translations]);

  // Helper function to upload images after product creation
  const handleProductImages = async (productId) => {
    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // Only upload if it's a new file (has 'file' property)
        if (image.file) {
          const imageFormData = new FormData();
          imageFormData.append("ImageFile", image.file);
          imageFormData.append("ProductId", productId.toString());
          imageFormData.append("AltText", `Product image ${i + 1}`);
          imageFormData.append("IsMain", (i === primaryImageIndex).toString());

          console.log(`Uploading image ${i + 1}...`);
          await createProductImage(imageFormData);
        }
      }
      console.log("All images uploaded successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
      // Don't throw error here, product is already created
      alert(
        "Product created but some images failed to upload. You can add them later."
      );
    }
  };

  // Helper function to get brand name
  const getBrandName = (brandId) => {
    const brand = dropdowns?.brands?.find((b) => b.Id === parseInt(brandId));
    return brand?.Name || "";
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("event triger");
      // if (!validateForm()) {
      //   return;
      // }

      setIsSaving(true);
      try {
        // FIXED: Structure the data to match your backend's CreateProductDto expectations
        const submitData = {
          Name: formData.Name,
          ItemCode: formData.ItemCode || "",
          Description: formData.Description || "",
          Barcode: formData.Barcode || "",
          PurchasePrice: formData.PurchasePrice || "0.00",
          UnitPrice: formData.UnitPrice || "0.00",
          MinimumPrice: formData.MinimumPrice || "0.00",
          Discount: formData.Discount || "0",
          DiscountType: formData.DiscountType || "percentage",
          InternalNotes: formData.InternalNotes || "",
          Status: formData.Status || "Active",
          PriceListId: null, // or your actual value
          CategoryId: formData.CategoryId
            ? parseInt(formData.CategoryId)
            : null,
          Cost: formData.CostPrice ? parseFloat(formData.CostPrice) : 0,
          Categories: [],
          Brands: [],
          Taxes: [],
          Tags: [],
          AllowNegativeStock: Boolean(formData.AllowBackorders),
          InitialStock: formData.CurrentStock
            ? parseInt(formData.CurrentStock)
            : 0,
          MinimumStock: formData.MinimumStock
            ? parseInt(formData.MinimumStock)
            : 0,
          MaximumStock: formData.MaximumStock
            ? parseInt(formData.MaximumStock)
            : null,
          TrackingType: formData.TrackingType || "Simple",
          SupplierId: formData.SupplierId
            ? parseInt(formData.SupplierId)
            : null,
          ManufacturerId: formData.ManufacturerId
            ? parseInt(formData.ManufacturerId)
            : null,
        };

        console.log("=== SUBMITTING PRODUCT DATA ===");
        console.log("Submit data:", submitData);

        let savedProduct;
        if (isEditing && editData?.Id) {
          savedProduct = await updateProduct(editData.Id, submitData);
        } else {
          savedProduct = await createProduct(submitData);
        }

        console.log("Product saved:", savedProduct);

        // Get the product ID from the response
        const productId = savedProduct?.Id || savedProduct?.Data?.Id;

        // Handle image uploads after product creation
        if (productId && images.length > 0) {
          console.log("Uploading product images...");
          await handleProductImages(productId);
        }

        // Show success message
        alert(`Product ${isEditing ? "updated" : "created"} successfully!`);

        // Navigate back to products list
        navigate("/admin/Products-Manager");
      } catch (error) {
        console.log("Error saving product:", error);
        navigate;
        // let errorMessage = `Failed to ${
        //   isEditing ? "update" : "create"
        // } product: `;

        // if (error.message) {
        //   errorMessage += error.message;
        // } else if (typeof error === "string") {
        //   errorMessage += error;
        // }
        // alert(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [
      formData,
      images,
      variants,
      primaryImageIndex,
      isEditing,
      editData,
      validateForm,
      updateProduct,
      createProduct,
      createProductImage,
      navigate,
      getBrandName,
    ]
  );

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
                onClick={() => navigate("/admin/Products-Manager")}
              />
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing
                  ? translations["Edit Product"]
                  : translations["New Product"]}
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
                onClick={() => navigate("/admin/Products-Manager")}
              />
              <FilledButton
                isIcon={true}
                icon={Save}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={
                  isSaving
                    ? "Saving..."
                    : isEditing
                    ? translations["Update Product"]
                    : translations["Save Product"]
                }
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
          {/* Basic Information */}
          <Section title={translations["Basic Information"]} icon={Package}>
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Product Name"]}
                name="Name"
                required
                placeholder="Enter product name"
                value={formData.Name}
                onChange={handleInputChange}
                error={errors.Name}
                icon={Package}
              />

              <InputField
                label={translations["Item Code"]}
                name="ItemCode"
                placeholder={translations["Auto-generate if empty"]}
                value={formData.ItemCode}
                onChange={handleInputChange}
                icon={Tag}
              />

              <Container>
                <InputField
                  label={translations["Barcode"]}
                  name="Barcode"
                  placeholder="Enter or generate barcode"
                  value={formData.Barcode}
                  onChange={handleInputChange}
                  icon={Barcode}
                />
                <FilledButton
                  isIcon={true}
                  icon={Calculator}
                  iconSize="w-3 h-3"
                  bgColor="bg-blue-100 hover:bg-blue-200"
                  textColor="text-blue-700"
                  rounded="rounded-md"
                  buttonText={translations["Generate Barcode"]}
                  height="h-8"
                  px="px-2"
                  fontWeight="font-medium"
                  fontSize="text-xs"
                  isIconLeft={true}
                  onClick={generateBarcode}
                  className="mt-2"
                />
              </Container>

              <InputField
                label={translations["Status"]}
                name="Status"
                as="select"
                required
                value={formData.Status}
                onChange={handleInputChange}
                icon={Settings}
              />

              <Container className="md:col-span-2">
                <InputField
                  label={translations["Short Description"]}
                  name="ShortDescription"
                  placeholder="Brief product description"
                  value={formData.ShortDescription}
                  onChange={handleInputChange}
                />
              </Container>

              <Container className="md:col-span-2">
                <InputField
                  label={translations["Description"]}
                  name="Description"
                  as="textarea"
                  placeholder="Detailed product description"
                  value={formData.Description}
                  onChange={handleInputChange}
                />
              </Container>

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.IsFeatured || false}
                    onChange={(e) =>
                      handleInputChange("IsFeatured", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">
                    {translations["Featured Product"]}
                  </Span>
                </label>
              </Container>

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ShowOnWebsite || false}
                    onChange={(e) =>
                      handleInputChange("ShowOnWebsite", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">
                    {translations["Show on website"]}
                  </Span>
                </label>
              </Container>
            </Container>
          </Section>

          {/* Pricing Information */}
          <Section
            title={translations["Pricing Information"]}
            icon={DollarSign}
          >
            <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                label={translations["Cost Price"]}
                name="CostPrice"
                type="number"
                placeholder="0.00"
                value={formData.CostPrice}
                onChange={handleInputChange}
                icon={DollarSign}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Purchase Price"]}
                name="PurchasePrice"
                type="number"
                placeholder="0.00"
                value={formData.PurchasePrice}
                onChange={handleInputChange}
                error={errors.PurchasePrice}
                icon={DollarSign}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Unit Price"]}
                name="UnitPrice"
                type="number"
                required
                placeholder="0.00"
                value={formData.UnitPrice}
                onChange={handleInputChange}
                error={errors.UnitPrice}
                icon={DollarSign}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Minimum Price"]}
                name="MinimumPrice"
                type="number"
                placeholder="0.00"
                value={formData.MinimumPrice}
                onChange={handleInputChange}
                icon={DollarSign}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Discount"]}
                name="Discount"
                type="number"
                placeholder="0"
                value={formData.Discount}
                onChange={handleInputChange}
                icon={Percent}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Discount Type"]}
                name="DiscountType"
                as="select"
                value={formData.DiscountType}
                onChange={handleInputChange}
                icon={Percent}
              />

              <InputField
                label={translations["Tax Rate"]}
                name="TaxRate"
                as="select"
                value={formData.TaxRate}
                onChange={handleInputChange}
                icon={Calculator}
              />

              {formData.ProfitMargin && (
                <Container className="md:col-span-2 lg:col-span-3">
                  <Container className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <Container className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <Span className="text-sm font-medium text-green-800">
                        {translations["Profit Margin"]}: {formData.ProfitMargin}
                        %
                      </Span>
                    </Container>
                  </Container>
                </Container>
              )}
            </Container>
          </Section>

          {/* Inventory Information */}
          <Section
            title={translations["Inventory Information"]}
            icon={Building}
          >
            <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                label={translations["Current Stock"]}
                name="CurrentStock"
                type="number"
                placeholder="0"
                value={formData.CurrentStock}
                onChange={handleInputChange}
                error={errors.CurrentStock}
                icon={Package}
                min="0"
              />

              <InputField
                label={translations["Minimum Stock"]}
                name="MinimumStock"
                type="number"
                placeholder="0"
                value={formData.MinimumStock}
                onChange={handleInputChange}
                error={errors.MinimumStock}
                icon={AlertTriangle}
                min="0"
              />

              <InputField
                label={translations["Maximum Stock"]}
                name="MaximumStock"
                type="number"
                placeholder="0"
                value={formData.MaximumStock}
                onChange={handleInputChange}
                icon={Package}
                min="0"
              />

              <InputField
                label={translations["Reorder Point"]}
                name="ReorderPoint"
                type="number"
                placeholder="0"
                value={formData.ReorderPoint}
                onChange={handleInputChange}
                icon={AlertTriangle}
                min="0"
              />

              <InputField
                label={translations["Unit of Measure"]}
                name="UnitOfMeasure"
                as="select"
                value={formData.UnitOfMeasure}
                onChange={handleInputChange}
                icon={Calculator}
              />

              <InputField
                label={translations["Tracking Type"]}
                name="TrackingType"
                as="select"
                value={formData.TrackingType}
                onChange={handleInputChange}
                icon={Settings}
              />

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.TrackInventory || false}
                    onChange={(e) =>
                      handleInputChange("TrackInventory", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">
                    {translations["Track Inventory"]}
                  </Span>
                </label>
              </Container>

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.AllowBackorders || false}
                    onChange={(e) =>
                      handleInputChange("AllowBackorders", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">
                    {translations["Allow Backorders"]}
                  </Span>
                </label>
              </Container>

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.SellWhenOutOfStock || false}
                    onChange={(e) =>
                      handleInputChange("SellWhenOutOfStock", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">
                    {translations["Sell when out of stock"]}
                  </Span>
                </label>
              </Container>
            </Container>
          </Section>

          {/* Categories & Classification */}
          <Section
            title={translations["Categories & Classification"]}
            icon={Layers}
          >
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={translations["Category"]}
                name="CategoryId"
                as="select"
                placeholder={translations["Select Category"]}
                value={formData.CategoryId}
                onChange={handleInputChange}
                icon={Layers}
                options={dropdowns?.categories || []}
              />

              <InputField
                label={translations["Brand"]}
                name="BrandId"
                as="select"
                placeholder={translations["Select Brand"]}
                value={formData.BrandId}
                onChange={handleInputChange}
                icon={Star}
                options={dropdowns?.brands || []}
              />

              <InputField
                label={translations["Supplier"]}
                name="SupplierId"
                as="select"
                placeholder={translations["Select Supplier"]}
                value={formData.SupplierId}
                onChange={handleInputChange}
                icon={Users}
                options={suppliers?.Data?.$values || []}
              />

              <InputField
                label={translations["Tags"]}
                name="Tags"
                placeholder={translations["Enter tags separated by commas"]}
                value={formData.Tags}
                onChange={handleInputChange}
                icon={Tag}
              />
            </Container>
          </Section>

          {/* Product Images */}
          <Section title={translations["Product Images"]} icon={Image}>
            <Container className="space-y-4">
              <Container>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Container className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Span className="text-gray-600">
                      {translations["Choose Images"]}
                    </Span>
                    <Span className="text-sm text-gray-400 block">
                      JPG, PNG, GIF up to 5MB each
                    </Span>
                  </Container>
                </label>
              </Container>

              {images.length > 0 ? (
                <Container className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <Container
                      key={image.id || index}
                      className="relative group"
                    >
                      <Container className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image.preview || image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </Container>

                      <Container className="absolute top-2 right-2 flex gap-1">
                        {index === primaryImageIndex ? (
                          <Container className="bg-green-500 text-white p-1 rounded text-xs">
                            <Star className="w-3 h-3" />
                          </Container>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="bg-gray-500 hover:bg-green-500 text-white p-1 rounded text-xs transition-colors"
                            title={translations["Set as Primary"]}
                          >
                            <Star className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs transition-colors"
                          title={translations["Remove Image"]}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Container>

                      {index === primaryImageIndex && (
                        <Container className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          {translations["Primary Image"]}
                        </Container>
                      )}
                    </Container>
                  ))}
                </Container>
              ) : (
                <Container className="text-center py-8 text-gray-500">
                  <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{translations["No images selected"]}</p>
                </Container>
              )}
            </Container>
          </Section>

          {/* Product Variants */}
          <Section title={translations["Product variants"]} icon={Settings}>
            <Container className="space-y-4">
              {variants.map((variant, index) => (
                <Container
                  key={variant.id || index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <Container className="flex justify-between items-center mb-4">
                    <Span className="font-medium text-gray-900">
                      Variant {index + 1}
                    </Span>
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
                      onClick={() => removeVariant(index)}
                    />
                  </Container>
                  <Container className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      label={translations["Variant Name"]}
                      name="name"
                      placeholder="e.g., Size S, Color Red"
                      value={variant.name || ""}
                      onChange={(field, value) =>
                        handleVariantChange(index, field, value)
                      }
                    />
                    <InputField
                      label={translations["Variant Price"]}
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={variant.price || ""}
                      onChange={(field, value) =>
                        handleVariantChange(index, field, value)
                      }
                      step="0.01"
                      min="0"
                    />
                    <InputField
                      label={translations["Variant Stock"]}
                      name="stock"
                      type="number"
                      placeholder="0"
                      value={variant.stock || ""}
                      onChange={(field, value) =>
                        handleVariantChange(index, field, value)
                      }
                      min="0"
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
                buttonText={translations["Add Variant"]}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={addVariant}
              />

              {variants.length === 0 && (
                <Container className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No variants added yet.</p>
                  <p className="text-sm">
                    Add variants for products with different sizes, colors, etc.
                  </p>
                </Container>
              )}
            </Container>
          </Section>

          {/* Additional Information */}
          <Section
            title={translations["Additional Information"]}
            icon={FileText}
          >
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={`${translations["Weight"]} (${translations["kg"]})`}
                name="Weight"
                type="number"
                placeholder="0.00"
                value={formData.Weight}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Manufacturer"]}
                name="Manufacturer"
                placeholder="Enter manufacturer name"
                value={formData.Manufacturer}
                onChange={handleInputChange}
              />

              <InputField
                label={`${translations["Length"]} (${translations["cm"]})`}
                name="Length"
                type="number"
                placeholder="0.00"
                value={formData.Length}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />

              <InputField
                label={translations["Model Number"]}
                name="ModelNumber"
                placeholder="Enter model number"
                value={formData.ModelNumber}
                onChange={handleInputChange}
              />

              <InputField
                label={`${translations["Width"]} (${translations["cm"]})`}
                name="Width"
                type="number"
                placeholder="0.00"
                value={formData.Width}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />

              <InputField
                label={`${translations["Warranty Period"]} (${translations["months"]})`}
                name="WarrantyPeriod"
                type="number"
                placeholder="0"
                value={formData.WarrantyPeriod}
                onChange={handleInputChange}
                min="0"
              />

              <InputField
                label={`${translations["Height"]} (${translations["cm"]})`}
                name="Height"
                type="number"
                placeholder="0.00"
                value={formData.Height}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />

              <Container>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.RequireApproval || false}
                    onChange={(e) =>
                      handleInputChange("RequireApproval", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Span className="ml-2 text-sm text-gray-700">
                    {translations["Require approval"]}
                  </Span>
                </label>
              </Container>

              <Container className="md:col-span-2">
                <InputField
                  label={translations["SEO Title"]}
                  name="SEOTitle"
                  placeholder="SEO optimized title for search engines"
                  value={formData.SEOTitle}
                  onChange={handleInputChange}
                />
              </Container>

              <Container className="md:col-span-2">
                <InputField
                  label={translations["SEO Description"]}
                  name="SEODescription"
                  as="textarea"
                  placeholder="SEO description for search engines"
                  value={formData.SEODescription}
                  onChange={handleInputChange}
                />
              </Container>

              <Container className="md:col-span-2">
                <InputField
                  label={translations["Internal Notes"]}
                  name="InternalNotes"
                  as="textarea"
                  placeholder="Internal notes for team use only"
                  value={formData.InternalNotes}
                  onChange={handleInputChange}
                />
              </Container>
            </Container>

            <Container className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Container className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <Container>
                  <Span className="text-sm font-medium text-yellow-900">
                    Product Guidelines
                  </Span>
                  <Span className="text-sm text-yellow-700 block mt-1">
                    • Ensure all required fields are filled before saving the
                    product.
                  </Span>
                  <Span className="text-sm text-yellow-700 block">
                    • Upload high-quality images for better customer experience.
                  </Span>
                  <Span className="text-sm text-yellow-700 block">
                    • Set appropriate stock levels and reorder points for
                    inventory management.
                  </Span>
                  <Span className="text-sm text-yellow-700 block">
                    • Use relevant tags and categories for better product
                    discoverability.
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

export default NewProduct;
