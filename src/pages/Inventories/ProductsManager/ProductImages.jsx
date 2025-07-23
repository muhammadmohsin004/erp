import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  X,
  Image as ImageIcon,
  ArrowLeft,
  AlertTriangle,
  Package,
  Upload,
  Grid,
  List,
  Maximize,
  Minimize,
  Star,
  Calendar,
  FileImage,
  ImagePlus,
  Images,
  Camera,
  Folder,
  FolderOpen,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  Settings,
  Palette,
  Layers,
  Scissors,
  Paintbrush,
  Sparkles,
  Zap,
  Target,
  Award,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  CloudUpload,
  HardDrive,
  Globe,
  Link,
  Share,
  Download as DownloadIcon,
  ExternalLink,
  Copy as CopyIcon,
  Trash,
  MoreHorizontal,
  FileText,
  Database,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../../components/elements/modal/Modal";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../../components/elements/table/Table";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";
import { useProductsManager } from "../../../Contexts/ProductsManagerContext/ProductsManagerContext";

const ProductImages = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const translations = {
    "Product Images": language === "ar" ? "صور المنتجات" : "Product Images",
    "Back to Products":
      language === "ar" ? "العودة للمنتجات" : "Back to Products",
    "Upload Image": language === "ar" ? "رفع صورة" : "Upload Image",
    "Upload Multiple": language === "ar" ? "رفع متعدد" : "Upload Multiple",
    Images: language === "ar" ? "الصور" : "Images",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No Images": language === "ar" ? "لا يوجد صور" : "No images found",
    Image: language === "ar" ? "الصورة" : "Image",
    Product: language === "ar" ? "المنتج" : "Product",
    "Alt Text": language === "ar" ? "النص البديل" : "Alt Text",
    "Main Image": language === "ar" ? "الصورة الرئيسية" : "Main Image",
    "File Size": language === "ar" ? "حجم الملف" : "File Size",
    Dimensions: language === "ar" ? "الأبعاد" : "Dimensions",
    Format: language === "ar" ? "الصيغة" : "Format",
    "Upload Date": language === "ar" ? "تاريخ الرفع" : "Upload Date",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Image": language === "ar" ? "حذف الصورة" : "Delete Image",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Image Details": language === "ar" ? "تفاصيل الصورة" : "Image Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "Grid View": language === "ar" ? "عرض شبكي" : "Grid View",
    "List View": language === "ar" ? "عرض قائمة" : "List View",
    "Total Images": language === "ar" ? "إجمالي الصور" : "Total Images",
    "Main Images": language === "ar" ? "الصور الرئيسية" : "Main Images",
    "Gallery Images": language === "ar" ? "صور المعرض" : "Gallery Images",
    "Recently Uploaded":
      language === "ar" ? "مرفوعة حديثاً" : "Recently Uploaded",
    "Large Images": language === "ar" ? "صور كبيرة" : "Large Images",
    "Small Images": language === "ar" ? "صور صغيرة" : "Small Images",
    Uploading: language === "ar" ? "جارٍ الرفع" : "Uploading",
    "Upload Failed": language === "ar" ? "فشل الرفع" : "Upload Failed",
    "File too large": language === "ar" ? "الملف كبير جداً" : "File too large",
    "Invalid file type":
      language === "ar" ? "نوع ملف غير صالح" : "Invalid file type",
    Retry: language === "ar" ? "إعادة المحاولة" : "Retry",
    Save: language === "ar" ? "حفظ" : "Save",
    Saving: language === "ar" ? "جارٍ الحفظ" : "Saving",
    Saved: language === "ar" ? "تم الحفظ" : "Saved",
    Required: language === "ar" ? "مطلوب" : "Required",
    Optional: language === "ar" ? "اختياري" : "Optional",
    "Select Product": language === "ar" ? "اختر منتج" : "Select Product",
    "No Product Selected":
      language === "ar" ? "لم يتم اختيار منتج" : "No Product Selected",
    Yes: language === "ar" ? "نعم" : "Yes",
    No: language === "ar" ? "لا" : "No",
    Main: language === "ar" ? "رئيسي" : "Main",
    Upload: language === "ar" ? "رفع" : "Upload",
  };

  // Get products context
  const {
    productImages,
    products,
    loading: imagesLoading,
    error,
    getProductImages,
    getProducts,
    createProductImage,
    createMultipleProductImages,
    deleteProductImage,
  } = useProductsManager();

  // Process images data from API response
  const imagesData = productImages?.Data?.$values || [];
  const productsDropdown = products?.Data?.$values || [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMultipleUploadModal, setShowMultipleUploadModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Upload state
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    productId: null,
    altText: "",
    isMain: false,
  });

  // Multiple upload state
  const [multipleUploadData, setMultipleUploadData] = useState({
    productId: null,
    altText: "",
    files: [],
  });

  // Filter state
  const [filterOptions, setFilterOptions] = useState({
    productId: null,
    isMain: null,
    sortBy: "uploadDate",
    sortAscending: false,
  });

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalImages: 0,
    mainImages: 0,
    galleryImages: 0,
    recentlyUploaded: 0,
    largeImages: 0,
    smallImages: 0,
    totalFileSize: 0,
    averageFileSize: 0,
  });

  // Fetch images on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getProductImages();
        await getProducts();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token, getProductImages, getProducts]);

  // Update statistics when images change
  useEffect(() => {
    if (Array.isArray(imagesData) && imagesData.length > 0) {
      const now = new Date();
      const stats = {
        totalImages: imagesData.length,
        mainImages: imagesData.filter((img) => img.IsMain).length,
        galleryImages: imagesData.filter((img) => !img.IsMain).length,
        recentlyUploaded: imagesData.filter((img) => {
          const uploadDate = new Date(img.CreatedAt || img.UploadDate);
          return (
            uploadDate.getMonth() === now.getMonth() &&
            uploadDate.getFullYear() === now.getFullYear()
          );
        }).length,
        largeImages: imagesData.filter((img) => (img.FileSize || 0) > 1000000)
          .length,
        smallImages: imagesData.filter((img) => (img.FileSize || 0) <= 1000000)
          .length,
        totalFileSize: imagesData.reduce(
          (sum, img) => sum + (img.FileSize || 0),
          0
        ),
        averageFileSize:
          imagesData.length > 0
            ? imagesData.reduce((sum, img) => sum + (img.FileSize || 0), 0) /
              imagesData.length
            : 0,
      };
      setStatistics(stats);
    }
  }, [imagesData]);

  // Check authentication
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setUploadFiles(imageFiles);
    setShowUploadModal(true);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Image selection
  const handleImageSelection = (imageId) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedImages([]);
    } else {
      const imageIds = Array.isArray(imagesData)
        ? imagesData.map((image) => image.Id)
        : [];
      setSelectedImages(imageIds);
    }
    setSelectAll(!selectAll);
  };

  // Image actions
  const handleViewImage = (imageId) => {
    const image = imagesData.find((img) => img.Id === imageId);
    if (image) {
      setSelectedImage(image);
      setShowViewModal(true);
    }
  };

  const handleDeleteImage = (imageId) => {
    const image = imagesData.find((img) => img.Id === imageId);
    if (image) {
      setImageToDelete(image);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProductImage(imageToDelete.Id);
      setShowDeleteModal(false);
      setImageToDelete(null);
      await getProductImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  // File validation function
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      alert(
        `Invalid file type: ${file.name}. Please select JPEG, PNG, GIF, or WebP images.`
      );
      return false;
    }

    if (file.size > maxSize) {
      alert(`File too large: ${file.name}. Maximum size is 10MB.`);
      return false;
    }

    return true;
  };

  // Upload handlers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const validFiles = imageFiles.filter(validateFile);
    setUploadFiles(validFiles);
    console.log("Selected files:", validFiles);
  };

  const handleMultipleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const validFiles = imageFiles.filter(validateFile);

    setMultipleUploadData({
      ...multipleUploadData,
      files: validFiles,
    });
    console.log("Selected multiple files:", validFiles);
  };

  // FIXED: Single Upload Handler - Pass object to context, not FormData
  const handleSingleUpload = async () => {
    console.log("=== SINGLE UPLOAD DEBUG START ===");
    console.log("Upload files:", uploadFiles);
    console.log("Upload form data:", uploadFormData);

    // Validate required fields
    if (!uploadFiles.length) {
      console.error("No files selected");
      alert("Please select a file");
      return;
    }

    if (!uploadFormData.productId) {
      console.error("No product selected");
      alert("Please select a product");
      return;
    }

    setIsUploading(true);
    try {
      // Create data object for context function - NOT FormData
      const imageData = {
        productId: uploadFormData.productId,
        isMain: uploadFormData.isMain,
        altText: uploadFormData.altText || "",
        imageFile: uploadFiles[0], // Pass the actual file object
      };

      console.log("=== Sending to context ===");
      console.log("Image data:", imageData);

      console.log("Calling createProductImage...");
      const result = await createProductImage(imageData);
      console.log("Upload successful:", result);

      // Reset form after successful upload
      setShowUploadModal(false);
      setUploadFiles([]);
      setUploadFormData({ productId: null, altText: "", isMain: false });
      await getProductImages();
    } catch (error) {
      console.error("=== UPLOAD ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      alert("Failed to upload image: " + (error.message || "Unknown error"));
    } finally {
      setIsUploading(false);
      console.log("=== SINGLE UPLOAD DEBUG END ===");
    }
  };

  // FIXED: Multiple Upload Handler - Pass object to context, not FormData
  const handleMultipleUpload = async () => {
    console.log("=== MULTIPLE UPLOAD DEBUG START ===");
    console.log("Multiple upload data:", multipleUploadData);

    // Validate required fields
    if (!multipleUploadData.files.length) {
      console.error("No files selected");
      alert("Please select files");
      return;
    }

    if (!multipleUploadData.productId) {
      console.error("No product selected");
      alert("Please select a product");
      return;
    }

    setIsUploading(true);
    try {
      // Create data object for context function - NOT FormData
      const imagesData = {
        productId: multipleUploadData.productId,
        altText: multipleUploadData.altText || "",
        imageFiles: multipleUploadData.files, // Pass array of file objects
      };

      console.log("=== Sending to context ===");
      console.log("Images data:", imagesData);

      console.log("Calling createMultipleProductImages...");
      const result = await createMultipleProductImages(imagesData);
      console.log("Multiple upload successful:", result);

      // Reset form after successful upload
      setShowMultipleUploadModal(false);
      setMultipleUploadData({ productId: null, altText: "", files: [] });
      await getProductImages();
    } catch (error) {
      console.error("=== MULTIPLE UPLOAD ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      alert("Failed to upload images: " + (error.message || "Unknown error"));
    } finally {
      setIsUploading(false);
      console.log("=== MULTIPLE UPLOAD DEBUG END ===");
    }
  };

  // Utility functions
  const getProductName = (productId) => {
    if (!productId) return translations["No Product Selected"];
    const product = productsDropdown.find((p) => p.Id === productId);
    return product?.Name || translations["No Product Selected"];
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-image.jpg";
    return imagePath.startsWith("http") ? imagePath : `/uploads/${imagePath}`;
  };

  // Statistics Card Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor,
    formatter,
  }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <Container className="flex items-center justify-between">
        <Container>
          <Span className="text-gray-500 text-sm font-medium">{title}</Span>
          <Span className="text-2xl font-bold text-gray-900 mt-1 block">
            {formatter ? formatter(value) : value || 0}
          </Span>
        </Container>
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
      </Container>
    </Container>
  );

  // Image Grid Item Component
  const ImageGridItem = ({ image }) => (
    <Container className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <Container className="relative">
        <Container className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={getImageUrl(image.Image)}
            alt={image.AltText || "Product image"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <Container className="w-full h-full flex items-center justify-center hidden">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </Container>
        </Container>

        <Container className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={selectedImages.includes(image.Id)}
            onChange={() => handleImageSelection(image.Id)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </Container>

        {image.IsMain && (
          <Container className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
            {translations.Main}
          </Container>
        )}

        <Container className="absolute bottom-2 right-2 flex gap-1">
          <button
            onClick={() => handleViewImage(image.Id)}
            className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            title={translations.View}
          >
            <AiOutlineEye className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleDeleteImage(image.Id)}
            className="inline-flex items-center justify-center w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
            title={translations.Delete}
          >
            <AiOutlineDelete className="w-3 h-3" />
          </button>
        </Container>
      </Container>

      <Container className="p-4">
        <Container className="flex items-center justify-between mb-2">
          <Span className="text-sm font-medium text-gray-900 truncate">
            {getProductName(image.ProductId)}
          </Span>
          <Span className="text-xs text-gray-500">
            {formatFileSize(image.FileSize)}
          </Span>
        </Container>

        {image.AltText && (
          <Span className="text-xs text-gray-500 block truncate">
            {image.AltText}
          </Span>
        )}

        <Container className="flex items-center justify-between mt-2">
          <Span className="text-xs text-gray-500">
            {formatDate(image.CreatedAt || image.UploadDate)}
          </Span>
          {image.Dimensions && (
            <Span className="text-xs text-gray-500">{image.Dimensions}</Span>
          )}
        </Container>
      </Container>
    </Container>
  );

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Container className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
        </Container>
      </Container>
    );
  }

  return (
    <Container
      className="min-h-screen bg-gray-50"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Header */}
      <Container className="px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          {/* Header Left Section */}
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="flex items-center gap-2">
              <FilledButton
                isIcon={true}
                icon={ArrowLeft}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText=""
                height="h-8"
                width="w-8"
                onClick={() => navigate("/admin/Products-Manager")}
                title={translations["Back to Products"]}
              />
              <ImageIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {translations["Product Images"]}
              </h1>
            </div>

            {/* Selected Images Badge */}
            {selectedImages.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedImages.length} {translations.Selected}
              </span>
            )}
          </div>

          {/* Header Right Actions */}
          <div className="flex gap-3 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 w-auto rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid className="w-4 h-4" />
                {translations["Grid View"]}
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
                {translations["List View"]}
              </button>
            </div>

            {/* Filter Button */}
            <FilledButton
              isIcon={true}
              icon={Filter}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              rounded="rounded-lg"
              buttonText={translations["Filters"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => setShowFilters(true)}
            />

            {/* Upload Multiple Images */}
            <FilledButton
              isIcon={true}
              icon={Upload}
              iconSize="w-4 h-4"
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Upload Multiple"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => setShowMultipleUploadModal(true)}
            />

            {/* Upload Single Image */}
            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Upload Image"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => setShowUploadModal(true)}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            title={translations["Total Images"]}
            value={statistics?.totalImages || 0}
            icon={ImageIcon}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations["Main Images"]}
            value={statistics?.mainImages || 0}
            icon={Star}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatCard
            title={translations["Gallery Images"]}
            value={statistics?.galleryImages || 0}
            icon={Images}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations["Recently Uploaded"]}
            value={statistics?.recentlyUploaded || 0}
            icon={Clock}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            title={translations["Large Images"]}
            value={statistics?.largeImages || 0}
            icon={Maximize}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            title={translations["Small Images"]}
            value={statistics?.smallImages || 0}
            icon={Minimize}
            bgColor="bg-teal-50"
            iconColor="text-teal-600"
          />
          <StatCard
            title="Total Size"
            value={statistics?.totalFileSize || 0}
            icon={HardDrive}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            formatter={formatFileSize}
          />
          <StatCard
            title="Avg Size"
            value={statistics?.averageFileSize || 0}
            icon={BarChart3}
            bgColor="bg-orange-50"
            iconColor="text-orange-600"
            formatter={formatFileSize}
          />
        </Container>

        {/* Search Bar */}
        <Container className="mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
            <SearchAndFilters
              isFocused={isFocused}
              searchValue={searchTerm}
              setSearchValue={setSearchTerm}
              placeholder={`${
                translations.Search
              } ${translations.Images.toLowerCase()}...`}
            />
          </Container>
        </Container>

        {/* Images Content */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {imagesLoading ? (
            <Container className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <Span className="text-blue-500 text-lg block mt-4">
                {translations.Loading}
              </Span>
            </Container>
          ) : error ? (
            <Container className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <Span className="text-red-500 text-lg block mb-4">
                Error: {error}
              </Span>
              <FilledButton
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={translations.Retry}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => getProductImages()}
              />
            </Container>
          ) : !Array.isArray(imagesData) || imagesData.length === 0 ? (
            <Container className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {translations["No Images"]}
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by uploading your first image
              </p>
              <Container className="flex gap-3 justify-center">
                <FilledButton
                  isIcon={true}
                  icon={Upload}
                  iconSize="w-4 h-4"
                  bgColor="bg-green-600 hover:bg-green-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={translations["Upload Multiple"]}
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={() => setShowMultipleUploadModal(true)}
                />
                <FilledButton
                  isIcon={true}
                  icon={Plus}
                  iconSize="w-4 h-4"
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={translations["Upload Image"]}
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={() => setShowUploadModal(true)}
                />
              </Container>
            </Container>
          ) : (
            <>
              {viewMode === "grid" ? (
                <Container className="p-6">
                  <Container className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {imagesData.map((image) => (
                      <ImageGridItem key={image.Id} image={image} />
                    ))}
                  </Container>
                </Container>
              ) : (
                <Container className="overflow-x-auto">
                  <Table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.Image}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.Product}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          {translations["Alt Text"]}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          {translations["File Size"]}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                          {translations["Upload Date"]}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.Actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {imagesData.map((image) => (
                        <tr
                          key={image.Id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(image.Id)}
                              onChange={() => handleImageSelection(image.Id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <Container className="flex items-center gap-3">
                              <Container className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={getImageUrl(image.Image)}
                                  alt={image.AltText || "Product image"}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                <Container className="w-full h-full flex items-center justify-center hidden">
                                  <ImageIcon className="w-5 h-5 text-gray-400" />
                                </Container>
                              </Container>
                              <Container>
                                {image.IsMain && (
                                  <Container className="flex items-center gap-1 mb-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <Span className="text-xs text-yellow-600 font-medium">
                                      {translations["Main Image"]}
                                    </Span>
                                  </Container>
                                )}
                                {image.Dimensions && (
                                  <Span className="text-xs text-gray-500">
                                    {image.Dimensions}
                                  </Span>
                                )}
                              </Container>
                            </Container>
                          </td>
                          <td className="px-6 py-4">
                            <Container className="flex items-center gap-1">
                              <Package className="w-3 h-3 text-gray-400" />
                              <Span className="text-sm text-gray-900">
                                {getProductName(image.ProductId)}
                              </Span>
                            </Container>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <Span className="text-sm text-gray-900 max-w-xs truncate">
                              {image.AltText || "-"}
                            </Span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <Span className="text-sm text-gray-900">
                              {formatFileSize(image.FileSize)}
                            </Span>
                          </td>
                          <td className="px-6 py-4 hidden xl:table-cell">
                            <Container className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <Span className="text-sm text-gray-900">
                                {formatDate(
                                  image.CreatedAt || image.UploadDate
                                )}
                              </Span>
                            </Container>
                          </td>
                          <td className="px-6 py-4">
                            <Container className="flex justify-center gap-1">
                              <button
                                onClick={() => handleViewImage(image.Id)}
                                className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                title={translations.View}
                              >
                                <AiOutlineEye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteImage(image.Id)}
                                className="inline-flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                title={translations.Delete}
                              >
                                <AiOutlineDelete className="w-3 h-3" />
                              </button>
                            </Container>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Container>
              )}
            </>
          )}
        </Container>
      </Container>

      {/* Upload Single Image Modal */}
      <Modall
        modalOpen={showUploadModal}
        setModalOpen={setShowUploadModal}
        title={
          <Container className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <Span>{translations["Upload Image"]}</Span>
          </Container>
        }
        width={600}
        okText={isUploading ? translations.Uploading : translations.Upload}
        cancelText={translations.Cancel}
        okAction={handleSingleUpload}
        cancelAction={() => {
          setShowUploadModal(false);
          setUploadFiles([]);
          setUploadFormData({ productId: null, altText: "", isMain: false });
        }}
        okButtonDisabled={
          isUploading || !uploadFiles.length || !uploadFormData.productId
        }
        body={
          <Container className="space-y-4">
            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Product} <span className="text-red-500">*</span>
              </label>
              <select
                value={uploadFormData.productId || ""}
                onChange={(e) =>
                  setUploadFormData({
                    ...uploadFormData,
                    productId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">{translations["Select Product"]}</option>
                {productsDropdown.map((product) => (
                  <option key={product.Id} value={product.Id}>
                    {product.Name}
                  </option>
                ))}
              </select>
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Image} <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {uploadFiles.length > 0 && (
                <Container className="mt-2 text-sm text-gray-600">
                  Selected: {uploadFiles[0].name} (
                  {formatFileSize(uploadFiles[0].size)})
                </Container>
              )}
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations["Alt Text"]}{" "}
                <span className="text-gray-400">({translations.Optional})</span>
              </label>
              <input
                type="text"
                value={uploadFormData.altText}
                onChange={(e) =>
                  setUploadFormData({
                    ...uploadFormData,
                    altText: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`${translations["Alt Text"]}...`}
              />
            </Container>

            <Container>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={uploadFormData.isMain}
                  onChange={(e) =>
                    setUploadFormData({
                      ...uploadFormData,
                      isMain: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Span className="ml-2 text-sm text-gray-700">
                  {translations["Main Image"]}
                </Span>
              </label>
            </Container>
          </Container>
        }
      />

      {/* Upload Multiple Images Modal */}
      <Modall
        modalOpen={showMultipleUploadModal}
        setModalOpen={setShowMultipleUploadModal}
        title={
          <Container className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            <Span>{translations["Upload Multiple"]}</Span>
          </Container>
        }
        width={600}
        okText={isUploading ? translations.Uploading : translations.Upload}
        cancelText={translations.Cancel}
        okAction={handleMultipleUpload}
        cancelAction={() => {
          setShowMultipleUploadModal(false);
          setMultipleUploadData({ productId: null, altText: "", files: [] });
        }}
        okButtonDisabled={
          isUploading ||
          !multipleUploadData.files.length ||
          !multipleUploadData.productId
        }
        body={
          <Container className="space-y-4">
            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Product} <span className="text-red-500">*</span>
              </label>
              <select
                value={multipleUploadData.productId || ""}
                onChange={(e) =>
                  setMultipleUploadData({
                    ...multipleUploadData,
                    productId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">{translations["Select Product"]}</option>
                {productsDropdown.map((product) => (
                  <option key={product.Id} value={product.Id}>
                    {product.Name}
                  </option>
                ))}
              </select>
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Images} <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                multiple
                onChange={handleMultipleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {multipleUploadData.files.length > 0 && (
                <Container className="mt-2 space-y-1">
                  <Container className="text-sm text-gray-600">
                    Selected: {multipleUploadData.files.length} files
                  </Container>
                  <Container className="max-h-32 overflow-y-auto">
                    {multipleUploadData.files.map((file, index) => (
                      <Container
                        key={index}
                        className="text-xs text-gray-500 flex justify-between"
                      >
                        <span>{file.name}</span>
                        <span>{formatFileSize(file.size)}</span>
                      </Container>
                    ))}
                  </Container>
                </Container>
              )}
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations["Alt Text"]}{" "}
                <span className="text-gray-400">({translations.Optional})</span>
              </label>
              <input
                type="text"
                value={multipleUploadData.altText}
                onChange={(e) =>
                  setMultipleUploadData({
                    ...multipleUploadData,
                    altText: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`${translations["Alt Text"]}...`}
              />
              <Container className="mt-1 text-xs text-gray-500">
                This alt text will be applied to all uploaded images
              </Container>
            </Container>
          </Container>
        }
      />

      {/* View Image Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Image Details"]}</Span>
          </Container>
        }
        width={800}
        okText={translations.Close}
        cancelText=""
        okAction={() => setShowViewModal(false)}
        body={
          selectedImage && (
            <Container className="space-y-6">
              <Container className="text-center">
                <img
                  src={getImageUrl(selectedImage.Image)}
                  alt={selectedImage.AltText || "Product image"}
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <Container className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg hidden">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </Container>
              </Container>

              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Container>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                    Basic Information
                  </h3>
                  <Container className="space-y-3">
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Product}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {getProductName(selectedImage.ProductId)}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Alt Text"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedImage.AltText || "-"}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Main Image"]}
                      </Span>
                      <Span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                          selectedImage.IsMain
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedImage.IsMain
                          ? translations.Yes
                          : translations.No}
                      </Span>
                    </Container>
                  </Container>
                </Container>

                <Container>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                    File Information
                  </h3>
                  <Container className="space-y-3">
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["File Size"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {formatFileSize(selectedImage.FileSize)}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations.Dimensions}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {selectedImage.Dimensions || "-"}
                      </Span>
                    </Container>
                    <Container>
                      <Span className="text-sm font-medium text-gray-500">
                        {translations["Upload Date"]}
                      </Span>
                      <Span className="text-sm text-gray-900 block mt-1">
                        {formatDate(
                          selectedImage.CreatedAt || selectedImage.UploadDate
                        )}
                      </Span>
                    </Container>
                  </Container>
                </Container>
              </Container>
            </Container>
          )
        }
      />

      {/* Delete Confirmation Modal */}
      <Modall
        modalOpen={showDeleteModal}
        setModalOpen={setShowDeleteModal}
        title={
          <Container className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <Span>{translations["Delete Image"]}</Span>
          </Container>
        }
        width={500}
        okText={isDeleting ? translations.Loading : translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteImage}
        cancelAction={() => {
          setShowDeleteModal(false);
          setImageToDelete(null);
        }}
        okButtonDisabled={isDeleting}
        body={
          <Container className="text-center py-4">
            <Container className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </Container>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {translations["Are you sure?"]}
            </h3>
            <Span className="text-gray-500 mb-4 block">
              {translations["This action cannot be undone"]}. This will
              permanently delete the image and all associated data.
            </Span>
            {imageToDelete && (
              <Container className="bg-gray-50 rounded-lg p-4 mb-4">
                <img
                  src={getImageUrl(imageToDelete.Image)}
                  alt={imageToDelete.AltText || "Product image"}
                  className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                />
                <Span className="text-sm text-gray-600">
                  {getProductName(imageToDelete.ProductId)}
                </Span>
              </Container>
            )}
          </Container>
        }
      />

      {/* Filters Sidebar */}
      {showFilters && (
        <Container className="fixed inset-0 z-50 overflow-hidden">
          <Container
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowFilters(false)}
          />
          <Container className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <Container className="p-6 h-full flex flex-col">
              <Container className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {translations.Filters}
                </h3>
                <FilledButton
                  isIcon={true}
                  icon={X}
                  iconSize="w-4 h-4"
                  bgColor="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  rounded="rounded-md"
                  buttonText=""
                  height="h-8"
                  width="w-8"
                  onClick={() => setShowFilters(false)}
                />
              </Container>

              <Container className="space-y-4 flex-1">
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Product}
                  </label>
                  <select
                    value={filterOptions.productId || ""}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        productId: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Products</option>
                    {productsDropdown.map((product) => (
                      <option key={product.Id} value={product.Id}>
                        {product.Name}
                      </option>
                    ))}
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations["Main Image"]}
                  </label>
                  <select
                    value={
                      filterOptions.isMain === null
                        ? ""
                        : filterOptions.isMain.toString()
                    }
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        isMain:
                          e.target.value === ""
                            ? null
                            : e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Images</option>
                    <option value="true">Main Images Only</option>
                    <option value="false">Gallery Images Only</option>
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={filterOptions.sortBy}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        sortBy: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="uploadDate">Upload Date</option>
                    <option value="fileSize">File Size</option>
                    <option value="product">Product</option>
                  </select>
                </Container>

                <Container>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterOptions.sortAscending}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          sortAscending: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Span className="ml-2 text-sm text-gray-700">
                      Sort Ascending
                    </Span>
                  </label>
                </Container>
              </Container>

              <Container className="flex gap-3 mt-6">
                <FilledButton
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={translations["Apply Filters"]}
                  height="h-10"
                  width="flex-1"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={() => {
                    setShowFilters(false);
                    // Apply filters logic here
                    // You can implement filtering based on filterOptions state
                  }}
                />
                <FilledButton
                  bgColor="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  rounded="rounded-lg"
                  buttonText={translations["Clear All"]}
                  height="h-10"
                  width="flex-1"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={() => {
                    setFilterOptions({
                      productId: null,
                      isMain: null,
                      sortBy: "uploadDate",
                      sortAscending: false,
                    });
                    setShowFilters(false);
                  }}
                />
              </Container>
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default ProductImages;