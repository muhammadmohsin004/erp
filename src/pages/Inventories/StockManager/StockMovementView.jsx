import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Building,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Activity,
  Warehouse,
  User,
  Hash,
  StickyNote,
  Printer,
  Edit,
  Trash2
} from "lucide-react";
import { useStock } from "../../../Contexts/StockContext/StockContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const StockMovementView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Stock Movement Details": language === "ar" ? "تفاصيل حركة المخزون" : "Stock Movement Details",
    "Back to List": language === "ar" ? "العودة للقائمة" : "Back to List",
    "Download PDF": language === "ar" ? "تحميل PDF" : "Download PDF",
    "Print Report": language === "ar" ? "طباعة التقرير" : "Print Report",
    "Edit Movement": language === "ar" ? "تعديل الحركة" : "Edit Movement",
    "Delete Movement": language === "ar" ? "حذف الحركة" : "Delete Movement",
    "Company Information": language === "ar" ? "معلومات الشركة" : "Company Information",
    "Movement Information": language === "ar" ? "معلومات الحركة" : "Movement Information",
    "Additional Details": language === "ar" ? "تفاصيل إضافية" : "Additional Details",
    Product: language === "ar" ? "المنتج" : "Product",
    Warehouse: language === "ar" ? "المستودع" : "Warehouse",
    "Movement Type": language === "ar" ? "نوع الحركة" : "Movement Type",
    Quantity: language === "ar" ? "الكمية" : "Quantity",
    Reference: language === "ar" ? "المرجع" : "Reference",
    Date: language === "ar" ? "التاريخ" : "Date",
    Notes: language === "ar" ? "ملاحظات" : "Notes",
    "Created By": language === "ar" ? "أنشئ بواسطة" : "Created By",
    "Movement ID": language === "ar" ? "معرف الحركة" : "Movement ID",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    Address: language === "ar" ? "العنوان" : "Address",
    Phone: language === "ar" ? "الهاتف" : "Phone",
    Email: language === "ar" ? "البريد الإلكتروني" : "Email",
    "Tax Number": language === "ar" ? "الرقم الضريبي" : "Tax Number",
    "Not Available": language === "ar" ? "غير متوفر" : "Not Available",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Confirmation": language === "ar" ? "تأكيد الحذف" : "Delete Confirmation",
    "This action cannot be undone": language === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone"
  };

  // Get stock context
  const {
    stockMovements,
    loading: stockLoading,
    error,
    getStockMovements,
    deleteStockMovement
  } = useStock();

  // Get company data from localStorage
  const getCompanyData = () => {
    try {
      const companyData = localStorage.getItem('company');
      return companyData ? JSON.parse(companyData) : null;
    } catch (error) {
      console.error('Error parsing company data:', error);
      return null;
    }
  };

  const companyInfo = getCompanyData();
  const [currentMovement, setCurrentMovement] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Find the specific movement
  useEffect(() => {
    if (stockMovements?.Data?.$values && id) {
      const movement = stockMovements.Data.$values.find(m => m.Id === parseInt(id));
      setCurrentMovement(movement);
    } else if (token && id) {
      // If movements not loaded yet, fetch them
      getStockMovements();
    }
  }, [stockMovements, id, token, getStockMovements]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return translations["Not Available"];
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return translations["Not Available"];
    return new Date(dateString).toLocaleDateString();
  };

  // Get movement type icon and style
  const getMovementTypeStyle = (type) => {
    const lowerType = type?.toLowerCase() || "";
    
    if (lowerType.includes("in") || lowerType.includes("purchase") || lowerType.includes("adjustment +")) {
      return {
        icon: TrendingUp,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        iconColor: "text-green-600"
      };
    } else if (lowerType.includes("out") || lowerType.includes("sale") || lowerType.includes("adjustment -")) {
      return {
        icon: TrendingDown,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        iconColor: "text-red-600"
      };
    } else if (lowerType.includes("transfer")) {
      return {
        icon: ArrowUpDown,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        iconColor: "text-blue-600"
      };
    } else {
      return {
        icon: Activity,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        iconColor: "text-gray-600"
      };
    }
  };

  // Generate PDF
  const generatePDF = () => {
    if (!currentMovement) return;

    const typeStyle = getMovementTypeStyle(currentMovement.MovementType);
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stock Movement Details - ${currentMovement.Id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20mm;
            }
            
            .header {
              text-align: center;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 10px;
            }
            
            .company-details {
              font-size: 12px;
              color: #6b7280;
              line-height: 1.4;
            }
            
            .document-title {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 30px;
            }
            
            .movement-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            
            .info-section {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
            }
            
            .info-section h3 {
              font-size: 18px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 15px;
              border-bottom: 1px solid #d1d5db;
              padding-bottom: 5px;
            }
            
            .info-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 14px;
              align-items: flex-start;
            }
            
            .info-label {
              font-weight: 500;
              color: #6b7280;
              flex: 0 0 40%;
            }
            
            .info-value {
              font-weight: 600;
              color: #1f2937;
              flex: 1;
              text-align: right;
            }
            
            .movement-type {
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              text-align: center;
            }
            
            .type-in {
              background: #dcfce7;
              color: #166534;
            }
            
            .type-out {
              background: #fee2e2;
              color: #991b1b;
            }
            
            .type-transfer {
              background: #dbeafe;
              color: #1e40af;
            }
            
            .quantity-positive {
              color: #059669;
              font-weight: bold;
            }
            
            .quantity-negative {
              color: #dc2626;
              font-weight: bold;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
            
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
                margin: 0;
                padding: 15mm;
              }
            }
          </style>
        </head>
        <body>
          <!-- Company Header -->
          <div class="header">
            <div class="company-name">${companyInfo?.Name || 'Company Name'}</div>
            <div class="company-details">
              ${companyInfo?.Address ? `${companyInfo.Address}` : ''}
              ${companyInfo?.Phone ? ` | Phone: ${companyInfo.Phone}` : ''}
              ${companyInfo?.Email ? ` | Email: ${companyInfo.Email}` : ''}
              ${companyInfo?.TaxNumber ? ` | Tax Number: ${companyInfo.TaxNumber}` : ''}
            </div>
          </div>
          
          <!-- Document Title -->
          <div class="document-title">Stock Movement Details</div>
          
          <!-- Movement Information -->
          <div class="movement-info">
            <div class="info-section">
              <h3>Movement Information</h3>
              
              <div class="info-item">
                <span class="info-label">Movement ID:</span>
                <span class="info-value">#${currentMovement.Id}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Product:</span>
                <span class="info-value">${currentMovement.ProductName || 'N/A'}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Warehouse:</span>
                <span class="info-value">${currentMovement.WarehouseName || 'N/A'}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Movement Type:</span>
                <span class="info-value">
                  <span class="movement-type ${currentMovement.QuantityChange > 0 ? 'type-in' : 
                    currentMovement.QuantityChange < 0 ? 'type-out' : 'type-transfer'}">
                    ${currentMovement.MovementType || 'N/A'}
                  </span>
                </span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Quantity Change:</span>
                <span class="info-value ${currentMovement.QuantityChange > 0 ? 'quantity-positive' : 'quantity-negative'}">
                  ${currentMovement.QuantityChange > 0 ? '+' : ''}${currentMovement.QuantityChange || 0}
                </span>
              </div>
            </div>
            
            <div class="info-section">
              <h3>Additional Details</h3>
              
              <div class="info-item">
                <span class="info-label">Reference:</span>
                <span class="info-value">${currentMovement.Reference || 'N/A'}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Date:</span>
                <span class="info-value">${formatDate(currentMovement.CreatedAt)}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Created By:</span>
                <span class="info-value">User ID: ${currentMovement.CreatedByUserId || 'N/A'}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Notes:</span>
                <span class="info-value">${currentMovement.Notes || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>This document was generated automatically by the Stock Management System.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const success = await deleteStockMovement(currentMovement.Id);
      if (success) {
        navigate("/admin/stock/movements", {
          state: {
            message: "Stock movement deleted successfully",
            type: "success"
          }
        });
      }
    } catch (error) {
      console.error("Error deleting movement:", error);
      alert("Failed to delete movement. Please try again.");
    }
    setShowDeleteModal(false);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/admin/stock/movements");
  };

  // Handle edit
  const handleEdit = () => {
    navigate(`/admin/stock/movements/${id}/edit`);
  };

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
      </Container>
    );
  }

  if (stockLoading) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <Span className="text-blue-500 text-lg ml-4">{translations.Loading}</Span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-red-500 text-lg">Error: {error}</Span>
      </Container>
    );
  }

  if (!currentMovement) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-gray-500 text-lg">Movement not found</Span>
      </Container>
    );
  }

  const typeStyle = getMovementTypeStyle(currentMovement.MovementType);
  const TypeIcon = typeStyle.icon;

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <Container className="flex items-center gap-4 mb-4 lg:mb-0">
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
              onClick={handleBack}
            />
            <Container>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                {translations["Stock Movement Details"]}
              </h1>
              <Span className="text-sm text-gray-500">
                {translations["Movement ID"]}: #{currentMovement.Id}
              </Span>
            </Container>
          </Container>
          
          <Container className="flex gap-3 flex-wrap">
            <FilledButton
              isIcon={true}
              icon={Edit}
              iconSize="w-4 h-4"
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Edit Movement"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleEdit}
            />
            <FilledButton
              isIcon={true}
              icon={Trash2}
              iconSize="w-4 h-4"
              bgColor="bg-red-600 hover:bg-red-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Delete Movement"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => setShowDeleteModal(true)}
            />
            <FilledButton
              isIcon={true}
              icon={Printer}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations["Print Report"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => window.print()}
            />
            <FilledButton
              isIcon={true}
              icon={Download}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Download PDF"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={generatePDF}
            />
          </Container>
        </Container>

        {/* Movement Details Content */}
        <Container id="movement-content" className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Container className="p-8">
            {/* Company Information */}
            {companyInfo && (
              <Container className="text-center border-b border-gray-200 pb-6 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {companyInfo.Name}
                </h2>
                <Container className="text-sm text-gray-600 space-y-1">
                  {companyInfo.Address && (
                    <Span className="block">{companyInfo.Address}</Span>
                  )}
                  <Container className="flex justify-center gap-4 flex-wrap">
                    {companyInfo.Phone && (
                      <Span>{translations.Phone}: {companyInfo.Phone}</Span>
                    )}
                    {companyInfo.Email && (
                      <Span>{translations.Email}: {companyInfo.Email}</Span>
                    )}
                  </Container>
                  {companyInfo.TaxNumber && (
                    <Span className="block">{translations["Tax Number"]}: {companyInfo.TaxNumber}</Span>
                  )}
                </Container>
              </Container>
            )}

            {/* Document Title */}
            <Container className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {translations["Stock Movement Details"]}
              </h1>
            </Container>

            {/* Movement Information Grid */}
            <Container className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Movement Information */}
              <Container className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2 border-b pb-2">
                  <Package className="w-5 h-5" />
                  {translations["Movement Information"]}
                </h3>
                
                <Container className="space-y-4">
                  <Container className="flex justify-between items-start">
                    <Span className="text-gray-600 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      {translations["Movement ID"]}:
                    </Span>
                    <Span className="font-semibold">#{currentMovement.Id}</Span>
                  </Container>

                  <Container className="flex justify-between items-start">
                    <Span className="text-gray-600 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {translations.Product}:
                    </Span>
                    <Span className="font-semibold text-right">{currentMovement.ProductName || translations["Not Available"]}</Span>
                  </Container>

                  <Container className="flex justify-between items-start">
                    <Span className="text-gray-600 flex items-center gap-2">
                      <Warehouse className="w-4 h-4" />
                      {translations.Warehouse}:
                    </Span>
                    <Span className="font-semibold text-right">{currentMovement.WarehouseName || translations["Not Available"]}</Span>
                  </Container>

                  <Container className="flex justify-between items-start">
                    <Span className="text-gray-600 flex items-center gap-2">
                      <TypeIcon className="w-4 h-4" />
                      {translations["Movement Type"]}:
                    </Span>
                    <Container className="text-right">
                      <Container className={`inline-flex items-center gap-2 ${typeStyle.bgColor} px-3 py-1 rounded-lg`}>
                        <TypeIcon className={`w-4 h-4 ${typeStyle.iconColor}`} />
                        <Span className={`font-medium ${typeStyle.textColor}`}>
                          {currentMovement.MovementType || translations["Not Available"]}
                        </Span>
                      </Container>
                    </Container>
                  </Container>

                  <Container className="flex justify-between items-start">
                    <Span className="text-gray-600 flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      {translations.Quantity}:
                    </Span>
                    <Span className={`font-bold text-lg ${currentMovement.QuantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currentMovement.QuantityChange > 0 ? '+' : ''}{currentMovement.QuantityChange || 0}
                    </Span>
                  </Container>
                </Container>
              </Container>

              {/* Additional Details */}
              <Container className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2 border-b pb-2">
                  <FileText className="w-5 h-5" />
                  {translations["Additional Details"]}
                </h3>
                
                <Container className="space-y-4">
                  <Container className="flex justify-between items-start">
                    <Span className="text-gray-600 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      {translations.Reference}:
                    </Span>
                    <Span className="font-semibold text-right">{currentMovement.Reference || translations["Not Available"]}</Span>
                  </Container>

                  <Container className="flex justify-between items-start">
                    <Span className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {translations.Date}:
                    </Span>
                    <Container className="text-right">
                      <Span className="font-semibold block">{formatDateOnly(currentMovement.CreatedAt)}</Span>
                      <Span className="text-sm text-gray-500">{new Date(currentMovement.CreatedAt).toLocaleTimeString()}</Span>
                    </Container>
                  </Container>

                  <Container className="flex justify-between items-start">
                    <Span className="text-gray-600 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {translations["Created By"]}:
                    </Span>
                    <Span className="font-semibold text-right">User ID: {currentMovement.CreatedByUserId || translations["Not Available"]}</Span>
                  </Container>

                  <Container className="flex justify-between items-start">
                    <Span className="text-gray-600 flex items-center gap-2">
                      <StickyNote className="w-4 h-4" />
                      {translations.Notes}:
                    </Span>
                    <Span className="font-semibold text-right max-w-xs">{currentMovement.Notes || translations["Not Available"]}</Span>
                  </Container>
                </Container>
              </Container>
            </Container>

            {/* Document Footer */}
            <Container className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
              <p>This document was generated automatically by the Stock Management System.</p>
              <p>Generated on {new Date().toLocaleString()}</p>
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Container className="fixed inset-0 z-50 overflow-y-auto">
          <Container className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Container className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></Container>
            
            <Container className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <Container className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <Container className="sm:flex sm:items-start">
                  <Container className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </Container>
                  <Container className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {translations["Delete Confirmation"]}
                    </h3>
                    <Container className="mt-2">
                      <p className="text-sm text-gray-500">
                        {translations["Are you sure?"]} {translations["This action cannot be undone"]}.
                      </p>
                    </Container>
                  </Container>
                </Container>
              </Container>
              <Container className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <FilledButton
                  bgColor="bg-red-600 hover:bg-red-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText="Delete"
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={handleDelete}
                />
                <FilledButton
                  bgColor="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  rounded="rounded-lg"
                  buttonText="Cancel"
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={() => setShowDeleteModal(false)}
                />
              </Container>
            </Container>
          </Container>
        </Container>
      )}

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          #movement-content {
            box-shadow: none !important;
          }
        }
      `}</style>
    </Container>
  );
}

export default StockMovementView;