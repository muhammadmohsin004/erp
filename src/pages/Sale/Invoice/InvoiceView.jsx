import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Mail,
  Edit,
  Eye,
  Printer,
  FileText,
  Share2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { usePDF } from "react-to-pdf";
import { useInvoice } from "../../../Contexts/InvoiceContext/InvoiceContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const InvoiceView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const { getInvoice, getInvoiceItems, loading } = useInvoice();

  // PDF generation hook
  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${id}.pdf`,
    page: {
      margin: 20,
      format: 'A4',
      orientation: 'portrait',
    }
  });

  const translations = {
    "Invoice": language === "ar" ? "فاتورة" : "Invoice",
    "Back": language === "ar" ? "رجوع" : "Back",
    "Download PDF": language === "ar" ? "تحميل PDF" : "Download PDF",
    "Print": language === "ar" ? "طباعة" : "Print",
    "Email": language === "ar" ? "إرسال بريد" : "Email",
    "Edit": language === "ar" ? "تعديل" : "Edit",
    "Share": language === "ar" ? "مشاركة" : "Share",
    "Zoom In": language === "ar" ? "تكبير" : "Zoom In",
    "Zoom Out": language === "ar" ? "تصغير" : "Zoom Out",
    "Reset View": language === "ar" ? "إعادة تعيين العرض" : "Reset View",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
    "Invoice Date": language === "ar" ? "تاريخ الفاتورة" : "Invoice Date",
    "Due Date": language === "ar" ? "تاريخ الاستحقاق" : "Due Date",
    "Bill To": language === "ar" ? "إرسال إلى" : "Bill To",
    "From": language === "ar" ? "من" : "From",
    "Description": language === "ar" ? "الوصف" : "Description",
    "Quantity": language === "ar" ? "الكمية" : "Quantity",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    "Total": language === "ar" ? "المجموع" : "Total",
    "Sub Total": language === "ar" ? "المجموع الفرعي" : "Sub Total",
    "Tax": language === "ar" ? "الضريبة" : "Tax",
    "Total Amount": language === "ar" ? "المبلغ الإجمالي" : "Total Amount",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Notes": language === "ar" ? "ملاحظات" : "Notes",
    "Draft": language === "ar" ? "مسودة" : "Draft",
    "Sent": language === "ar" ? "مرسلة" : "Sent",
    "Paid": language === "ar" ? "مدفوعة" : "Paid",
    "Overdue": language === "ar" ? "متأخرة" : "Overdue",
    "Cancelled": language === "ar" ? "ملغاة" : "Cancelled",
    "Invoice not found": language === "ar" ? "الفاتورة غير موجودة" : "Invoice not found",
    "Company Name": language === "ar" ? "اسم الشركة" : "Company Name",
    "Company Address": language === "ar" ? "عنوان الشركة" : "Company Address",
    "Company Phone": language === "ar" ? "هاتف الشركة" : "Company Phone",
    "Company Email": language === "ar" ? "بريد الشركة" : "Company Email",
  };

  // State management
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  // Check for action from navigation state
  const actionFromState = location.state?.action;

  // Fetch invoice data on component mount
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!id) {
        setError("Invoice ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch invoice details
        const invoice = await getInvoice(id);
        if (!invoice) {
          setError(translations["Invoice not found"]);
          return;
        }
        
        setInvoiceData(invoice);
        
        // Fetch invoice items
        const items = await getInvoiceItems({ invoiceId: id });
        setInvoiceItems(items?.Data || []);
        
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError("Failed to load invoice");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInvoiceData();
    }
  }, [id, token, getInvoice, getInvoiceItems]);

  // Handle automatic actions based on navigation state
  useEffect(() => {
    if (actionFromState && invoiceData && !isLoading) {
      setTimeout(() => {
        if (actionFromState === 'print') {
          handlePrint();
        } else if (actionFromState === 'pdf') {
          handleDownloadPDF();
        }
      }, 1000); // Small delay to ensure PDF is rendered
    }
  }, [actionFromState, invoiceData, isLoading]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // PDF and Print handlers
  const handleDownloadPDF = () => {
    if (targetRef.current) {
      toPDF();
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleEmail = () => {
    // Implementation for email functionality
    const subject = `Invoice ${invoiceData?.InvoiceNumber}`;
    const body = `Please find attached invoice ${invoiceData?.InvoiceNumber} dated ${formatDate(invoiceData?.InvoiceDate)}.`;
    const mailtoLink = `mailto:${invoiceData?.CustomerEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoiceData?.InvoiceNumber}`,
          text: `Invoice ${invoiceData?.InvoiceNumber} - ${formatCurrency(invoiceData?.TotalAmount)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Invoice link copied to clipboard!");
    }
  };

  const handleEdit = () => {
    navigate("/admin/new-invoice", {
      state: {
        editData: invoiceData,
        isEditing: true,
      },
    });
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toFixed(2);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'text-gray-600';
      case 'sent':
        return 'text-blue-600';
      case 'paid':
        return 'text-green-600';
      case 'overdue':
        return 'text-red-600';
      case 'cancelled':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <Span className="text-blue-500 text-lg block">{translations.Loading}</Span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
          <FilledButton
            bgColor="bg-blue-600 hover:bg-blue-700"
            textColor="text-white"
            rounded="rounded-lg"
            buttonText={translations.Back}
            height="h-10"
            px="px-4"
            fontWeight="font-medium"
            fontSize="text-sm"
            onClick={() => navigate("/admin/invoices")}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="bg-white border-b border-gray-200 px-6 py-4 print:hidden">
        <Container className="flex items-center justify-between">
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
              <h1 className="text-xl font-bold text-gray-900">
                {translations.Invoice} #{invoiceData?.InvoiceNumber}
              </h1>
              <Span className={`text-sm font-medium ${getStatusColor(invoiceData?.Status)}`}>
                {translations[invoiceData?.Status] || invoiceData?.Status}
              </Span>
            </Container>
          </Container>

          <Container className="flex items-center gap-2">
            {/* Zoom Controls */}
            <Container className="flex items-center gap-1 mr-4">
              <FilledButton
                isIcon={true}
                icon={ZoomOut}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-md"
                buttonText=""
                height="h-8"
                width="w-8"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                title={translations["Zoom Out"]}
              />
              <Span className="text-sm text-gray-600 px-2">
                {Math.round(zoomLevel * 100)}%
              </Span>
              <FilledButton
                isIcon={true}
                icon={ZoomIn}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-md"
                buttonText=""
                height="h-8"
                width="w-8"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2}
                title={translations["Zoom In"]}
              />
              <FilledButton
                isIcon={true}
                icon={RotateCcw}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-md"
                buttonText=""
                height="h-8"
                width="w-8"
                onClick={handleResetZoom}
                title={translations["Reset View"]}
              />
            </Container>

            {/* Action Buttons */}
            <FilledButton
              isIcon={true}
              icon={Edit}
              iconSize="w-4 h-4"
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Edit}
              height="h-9"
              px="px-3"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleEdit}
            />

            <FilledButton
              isIcon={true}
              icon={Mail}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Email}
              height="h-9"
              px="px-3"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleEmail}
            />

            <FilledButton
              isIcon={true}
              icon={Printer}
              iconSize="w-4 h-4"
              bgColor="bg-purple-600 hover:bg-purple-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Print}
              height="h-9"
              px="px-3"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handlePrint}
              disabled={isPrinting}
            />

            <FilledButton
              isIcon={true}
              icon={Download}
              iconSize="w-4 h-4"
              bgColor="bg-red-600 hover:bg-red-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Download PDF"]}
              height="h-9"
              px="px-3"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleDownloadPDF}
            />

            <FilledButton
              isIcon={true}
              icon={Share2}
              iconSize="w-4 h-4"
              bgColor="bg-gray-600 hover:bg-gray-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Share}
              height="h-9"
              px="px-3"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleShare}
            />
          </Container>
        </Container>
      </Container>

      {/* PDF Content */}
      <Container className="flex justify-center py-8 print:py-0">
        <Container 
          className="bg-white shadow-lg max-w-4xl w-full print:shadow-none print:max-w-none"
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease'
          }}
        >
          <Container ref={targetRef} className="p-8 print:p-6">
            {/* Invoice Header */}
            <Container className="flex justify-between items-start mb-8">
              <Container>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {translations.Invoice}
                </h1>
                <Container className="text-gray-600">
                  <Container className="mb-1">
                    <strong>{translations["Company Name"]}:</strong> Speed ERP Solutions
                  </Container>
                  <Container className="mb-1">
                    <strong>{translations["Company Address"]}:</strong> 123 Business St, City, State 12345
                  </Container>
                  <Container className="mb-1">
                    <strong>{translations["Company Phone"]}:</strong> +1 (555) 123-4567
                  </Container>
                  <Container>
                    <strong>{translations["Company Email"]}:</strong> info@speed-erp.com
                  </Container>
                </Container>
              </Container>

              <Container className="text-right">
                <Container className="text-2xl font-bold text-blue-600 mb-4">
                  #{invoiceData?.InvoiceNumber}
                </Container>
                <Container className="text-gray-600 space-y-1">
                  <Container>
                    <strong>{translations["Invoice Date"]}:</strong> {formatDate(invoiceData?.InvoiceDate)}
                  </Container>
                  <Container>
                    <strong>{translations["Due Date"]}:</strong> {formatDate(invoiceData?.DueDate)}
                  </Container>
                  <Container>
                    <strong>{translations.Status}:</strong> 
                    <Span className={`ml-1 font-semibold ${getStatusColor(invoiceData?.Status)}`}>
                      {translations[invoiceData?.Status] || invoiceData?.Status}
                    </Span>
                  </Container>
                </Container>
              </Container>
            </Container>

            {/* Customer Information */}
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Container>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                  {translations["Bill To"]}
                </h3>
                <Container className="text-gray-700 space-y-1">
                  <Container className="font-medium text-gray-900">
                    {invoiceData?.CustomerName}
                  </Container>
                  {invoiceData?.CustomerEmail && (
                    <Container>{invoiceData.CustomerEmail}</Container>
                  )}
                  {invoiceData?.CustomerPhone && (
                    <Container>{invoiceData.CustomerPhone}</Container>
                  )}
                  {invoiceData?.CustomerAddress && (
                    <Container className="whitespace-pre-line">
                      {invoiceData.CustomerAddress}
                    </Container>
                  )}
                </Container>
              </Container>

              {invoiceData?.Description && (
                <Container>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                    {translations.Description}
                  </h3>
                  <Container className="text-gray-700">
                    {invoiceData.Description}
                  </Container>
                </Container>
              )}
            </Container>

            {/* Invoice Items Table */}
            <Container className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                      {translations.Description}
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                      {translations.Quantity}
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {translations["Unit Price"]}
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {translations.Tax} (%)
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {translations.Total}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.length > 0 ? (
                    invoiceItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-gray-900">
                          {item.ItemName || item.Description || "Service Item"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-gray-900">
                          {item.Quantity || 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                          ${formatCurrency(item.UnitPrice)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                          {formatCurrency(item.TaxRate || 0)}%
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900">
                          ${formatCurrency(item.LineTotal || (item.Quantity * item.UnitPrice))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                        No items found for this invoice
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Container>

            {/* Totals Section */}
            <Container className="flex justify-end mb-8">
              <Container className="w-full max-w-sm">
                <Container className="space-y-2">
                  <Container className="flex justify-between py-2 border-b border-gray-200">
                    <Span className="font-medium text-gray-700">{translations["Sub Total"]}:</Span>
                    <Span className="font-medium text-gray-900">${formatCurrency(invoiceData?.SubTotal)}</Span>
                  </Container>
                  <Container className="flex justify-between py-2 border-b border-gray-200">
                    <Span className="font-medium text-gray-700">{translations.Tax}:</Span>
                    <Span className="font-medium text-gray-900">${formatCurrency(invoiceData?.TaxAmount)}</Span>
                  </Container>
                  <Container className="flex justify-between py-3 border-t-2 border-gray-900">
                    <Span className="text-lg font-bold text-gray-900">{translations["Total Amount"]}:</Span>
                    <Span className="text-lg font-bold text-gray-900">${formatCurrency(invoiceData?.TotalAmount)}</Span>
                  </Container>
                </Container>
              </Container>
            </Container>

            {/* Notes Section */}
            {invoiceData?.Notes && (
              <Container className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                  {translations.Notes}
                </h3>
                <Container className="text-gray-700 whitespace-pre-line">
                  {invoiceData.Notes}
                </Container>
              </Container>
            )}

            {/* Footer */}
            <Container className="text-center text-gray-500 text-sm border-t border-gray-200 pt-4">
              <Container className="mb-2">
                Thank you for your business!
              </Container>
              <Container>
                This invoice was generated on {new Date().toLocaleDateString()} | 
                Questions? Contact us at info@speed-erp.com
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:max-w-none {
            max-width: none !important;
          }
          
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default InvoiceView;