import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Send,
  Download,
  Eye,
  EyeOff,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Truck,
  Tag,
  Calculator,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Star,
  StarOff,
  Printer,
} from "lucide-react";

// Context imports
import { useInvoices } from "../../../Contexts/InvoiceContext/InvoiceContext";
// Component imports
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";
import Modall from "../../../components/elements/modal/Modal";

const InvoiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Invoice Details": language === "ar" ? "تفاصيل الفاتورة" : "Invoice Details",
    "Back to Invoices": language === "ar" ? "العودة للفواتير" : "Back to Invoices",
    "Edit": language === "ar" ? "تعديل" : "Edit",
    "Clone": language === "ar" ? "نسخ" : "Clone",
    "Delete": language === "ar" ? "حذف" : "Delete",
    "Send": language === "ar" ? "إرسال" : "Send",
    "Download": language === "ar" ? "تحميل" : "Download",
    "Print": language === "ar" ? "طباعة" : "Print",
    "Share": language === "ar" ? "مشاركة" : "Share",
    "Mark as Paid": language === "ar" ? "تعيين كمدفوع" : "Mark as Paid",
    "Invoice Information": language === "ar" ? "معلومات الفاتورة" : "Invoice Information",
    "Client Information": language === "ar" ? "معلومات العميل" : "Client Information",
    "Invoice Items": language === "ar" ? "عناصر الفاتورة" : "Invoice Items",
    "Payment Summary": language === "ar" ? "ملخص الدفع" : "Payment Summary",
    "Payment History": language === "ar" ? "سجل الدفع" : "Payment History",
    "Activity Log": language === "ar" ? "سجل النشاط" : "Activity Log",
    "Invoice Number": language === "ar" ? "رقم الفاتورة" : "Invoice Number",
    "Invoice Date": language === "ar" ? "تاريخ الفاتورة" : "Invoice Date",
    "Due Date": language === "ar" ? "تاريخ الاستحقاق" : "Due Date",
    "Status": language === "ar" ? "الحالة" : "Status",
    "Currency": language === "ar" ? "العملة" : "Currency",
    "Exchange Rate": language === "ar" ? "سعر الصرف" : "Exchange Rate",
    "Payment Terms": language === "ar" ? "شروط الدفع" : "Payment Terms",
    "Notes": language === "ar" ? "ملاحظات" : "Notes",
    "Internal Notes": language === "ar" ? "ملاحظات داخلية" : "Internal Notes",
    "PO Number": language === "ar" ? "رقم أمر الشراء" : "PO Number",
    "Client Name": language === "ar" ? "اسم العميل" : "Client Name",
    "Email": language === "ar" ? "البريد الإلكتروني" : "Email",
    "Phone": language === "ar" ? "الهاتف" : "Phone",
    "Address": language === "ar" ? "العنوان" : "Address",
    "Item": language === "ar" ? "العنصر" : "Item",
    "Description": language === "ar" ? "الوصف" : "Description",
    "Quantity": language === "ar" ? "الكمية" : "Quantity",
    "Unit Price": language === "ar" ? "سعر الوحدة" : "Unit Price",
    "Discount": language === "ar" ? "الخصم" : "Discount",
    "Tax": language === "ar" ? "الضريبة" : "Tax",
    "Total": language === "ar" ? "المجموع" : "Total",
    "Subtotal": language === "ar" ? "المجموع الفرعي" : "Subtotal",
    "Tax Amount": language === "ar" ? "مبلغ الضريبة" : "Tax Amount",
    "Discount Amount": language === "ar" ? "مبلغ الخصم" : "Discount Amount",
    "Shipping": language === "ar" ? "الشحن" : "Shipping",
    "Grand Total": language === "ar" ? "المجموع الكلي" : "Grand Total",
    "Paid Amount": language === "ar" ? "المبلغ المدفوع" : "Paid Amount",
    "Balance Due": language === "ar" ? "الرصيد المستحق" : "Balance Due",
    "Draft": language === "ar" ? "مسودة" : "Draft",
    "Sent": language === "ar" ? "مرسل" : "Sent",
    "Paid": language === "ar" ? "مدفوع" : "Paid",
    "Overdue": language === "ar" ? "متأخر" : "Overdue",
    "Voided": language === "ar" ? "ملغي" : "Voided",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "Invoice not found": language === "ar" ? "لم يتم العثور على الفاتورة" : "Invoice not found",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "This action cannot be undone": language === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone",
    "Cancel": language === "ar" ? "إلغاء" : "Cancel",
    "Confirm": language === "ar" ? "تأكيد" : "Confirm",
    "Created": language === "ar" ? "تم الإنشاء" : "Created",
    "Updated": language === "ar" ? "تم التحديث" : "Updated",
    "Show Internal Notes": language === "ar" ? "إظهار الملاحظات الداخلية" : "Show Internal Notes",
    "Hide Internal Notes": language === "ar" ? "إخفاء الملاحظات الداخلية" : "Hide Internal Notes",
    "No items found": language === "ar" ? "لم يتم العثور على عناصر" : "No items found",
    "No notes": language === "ar" ? "لا توجد ملاحظات" : "No notes",
    "Payment Method": language === "ar" ? "طريقة الدفع" : "Payment Method",
    "Payment Date": language === "ar" ? "تاريخ الدفع" : "Payment Date",
    "Reference": language === "ar" ? "المرجع" : "Reference",
    "Amount": language === "ar" ? "المبلغ" : "Amount",
    "No payments recorded": language === "ar" ? "لم يتم تسجيل مدفوعات" : "No payments recorded",
    "View Client": language === "ar" ? "عرض العميل" : "View Client",
    "Contact Client": language === "ar" ? "اتصل بالعميل" : "Contact Client",
  };

  // Context hooks
  const {
    currentInvoice,
    loading,
    error,
    getInvoice,
    sendInvoice,
    deleteInvoice,
    duplicateInvoice,
    markInvoiceAsPaid,
    voidInvoice,
    clearCurrentInvoice,
  } = useInvoices();

  // Local state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInternalNotes, setShowInternalNotes] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [actionDropdown, setActionDropdown] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: "Cash",
    paymentDate: new Date().toISOString().split('T')[0],
    reference: "",
    notes: "",
  });

  // Fetch invoice data on component mount
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
      return;
    }

    const fetchInvoice = async () => {
      if (id) {
        try {
          await getInvoice(parseInt(id));
        } catch (error) {
          console.error("Error fetching invoice:", error);
        }
      }
    };

    fetchInvoice();

    // Cleanup on unmount
    return () => {
      clearCurrentInvoice();
    };
  }, [id, token, getInvoice, navigate, clearCurrentInvoice]);

  // Update payment amount when invoice changes
  useEffect(() => {
    if (currentInvoice) {
      setPaymentData(prev => ({
        ...prev,
        amount: currentInvoice.BalanceAmount || currentInvoice.TotalAmount || 0,
      }));
    }
  }, [currentInvoice]);

  // Handle actions
  const handleEdit = () => {
    navigate(`/admin/invoices/edit/${id}`, {
      state: { editData: currentInvoice, isEditing: true }
    });
  };

  const handleClone = () => {
    navigate("/admin/invoices/new", {
      state: {
        cloneData: {
          ...currentInvoice,
          InvoiceNumber: `${currentInvoice.InvoiceNumber}-Copy`,
          Id: undefined,
          Status: "Draft",
          InvoiceDate: new Date().toISOString().split('T')[0],
        }
      }
    });
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(currentInvoice.Id);
      navigate("/admin/invoices", {
        state: {
          message: "Invoice deleted successfully",
          type: "success"
        }
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleSend = async () => {
    try {
      await sendInvoice(currentInvoice.Id);
      setShowSendModal(false);
      // Refresh invoice data
      await getInvoice(parseInt(id));
    } catch (error) {
      console.error("Error sending invoice:", error);
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await markInvoiceAsPaid(currentInvoice.Id, paymentData);
      setShowPaymentModal(false);
      // Refresh invoice data
      await getInvoice(parseInt(id));
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
    }
  };

  const handleVoid = async () => {
    try {
      await voidInvoice(currentInvoice.Id, { reason: "Voided by user" });
      // Refresh invoice data
      await getInvoice(parseInt(id));
    } catch (error) {
      console.error("Error voiding invoice:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download
    console.log("Download PDF");
  };

  const handleShare = () => {
    // Implement share functionality
    console.log("Share invoice");
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <FileText className="w-5 h-5" />,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
        };
      case 'sent':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Send className="w-5 h-5" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
        };
      case 'paid':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
        };
      case 'overdue':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-red-50',
          textColor: 'text-red-600',
        };
      case 'voided':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <XCircle className="w-5 h-5" />,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock className="w-5 h-5" />,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
        };
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Check if invoice is overdue
  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'Paid') return false;
    return new Date(dueDate) < new Date();
  };

  // Loading state
  if (loading) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <Span className="text-blue-500 text-lg ml-4">{translations.Loading}</Span>
      </Container>
    );
  }

  // Error state
  if (error || !currentInvoice) {
    return (
      <Container className="min-h-screen bg-gray-50 px-6 py-6">
        <Container className="max-w-md mx-auto">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {translations["Invoice not found"]}
            </h3>
            <Span className="text-gray-500 mb-4 block">
              {error || "The requested invoice could not be found."}
            </Span>
            <FilledButton
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Back to Invoices"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={() => navigate("/admin/invoices")}
            />
          </Container>
        </Container>
      </Container>
    );
  }

  const statusDisplay = getStatusDisplay(currentInvoice.Status);

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
                {translations["Invoice Details"]}
              </h1>
              <Span className="text-sm text-gray-500">
                {currentInvoice.InvoiceNumber}
              </Span>
            </Container>
          </Container>

          <Container className="flex gap-3">
            <FilledButton
              isIcon={true}
              icon={Printer}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Print}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handlePrint}
            />

            <FilledButton
              isIcon={true}
              icon={Download}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Download}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleDownload}
            />

            <FilledButton
              isIcon={true}
              icon={Copy}
              iconSize="w-4 h-4"
              bgColor="bg-yellow-600 hover:bg-yellow-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Clone}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleClone}
            />

            <FilledButton
              isIcon={true}
              icon={Edit}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Edit}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleEdit}
            />

            <Container className="relative">
              <FilledButton
                isIcon={true}
                icon={MoreHorizontal}
                iconSize="w-4 h-4"
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText=""
                height="h-10"
                width="w-10"
                onClick={() => setActionDropdown(!actionDropdown)}
              />
              {actionDropdown && (
                <Container className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <Container className="py-1">
                    {currentInvoice.Status !== 'Sent' && (
                      <button
                        onClick={() => { setShowSendModal(true); setActionDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {translations.Send}
                      </button>
                    )}
                    {currentInvoice.Status !== 'Paid' && (
                      <button
                        onClick={() => { setShowPaymentModal(true); setActionDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        {translations["Mark as Paid"]}
                      </button>
                    )}
                    <button
                      onClick={() => { handleShare(); setActionDropdown(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      {translations.Share}
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => { setShowDeleteModal(true); setActionDropdown(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {translations.Delete}
                    </button>
                  </Container>
                </Container>
              )}
            </Container>
          </Container>
        </Container>

        {/* Status Banner */}
        <Container className={`rounded-lg p-4 mb-6 ${statusDisplay.bgColor}`}>
          <Container className="flex items-center justify-between">
            <Container className="flex items-center gap-3">
              <Container className={`p-2 rounded-full ${statusDisplay.color}`}>
                {statusDisplay.icon}
              </Container>
              <Container>
                <h3 className="text-lg font-medium text-gray-900">
                  Invoice {currentInvoice.Status}
                </h3>
                <Span className={`text-sm ${statusDisplay.textColor}`}>
                  {currentInvoice.Status === 'Draft' && "This invoice is still in draft mode"}
                  {currentInvoice.Status === 'Sent' && "This invoice has been sent to the client"}
                  {currentInvoice.Status === 'Paid' && "This invoice has been paid in full"}
                  {currentInvoice.Status === 'Overdue' && "This invoice is overdue"}
                  {currentInvoice.Status === 'Voided' && "This invoice has been voided"}
                </Span>
              </Container>
            </Container>
            
            {isOverdue(currentInvoice.DueDate, currentInvoice.Status) && (
              <Container className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <Span className="text-sm font-medium">
                  Overdue by {Math.ceil((new Date() - new Date(currentInvoice.DueDate)) / (1000 * 60 * 60 * 24))} days
                </Span>
              </Container>
            )}
          </Container>
        </Container>

        {/* Main Content */}
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Invoice Details */}
          <Container className="lg:col-span-2 space-y-6">
            
            {/* Invoice Information */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {translations["Invoice Information"]}
              </h3>

              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Invoice Number"]}
                  </Span>
                  <Span className="text-lg font-semibold text-gray-900">
                    {currentInvoice.InvoiceNumber}
                  </Span>
                </Container>

                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Status}
                  </Span>
                  <Span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}>
                    {statusDisplay.icon}
                    {currentInvoice.Status}
                  </Span>
                </Container>

                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Invoice Date"]}
                  </Span>
                  <Container className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <Span className="text-gray-900">
                      {formatDate(currentInvoice.InvoiceDate)}
                    </Span>
                  </Container>
                </Container>

                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Due Date"]}
                  </Span>
                  <Container className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <Span className="text-gray-900">
                      {currentInvoice.DueDate ? formatDate(currentInvoice.DueDate) : "Not set"}
                    </Span>
                  </Container>
                </Container>

                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Currency}
                  </Span>
                  <Container className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <Span className="text-gray-900">
                      {currentInvoice.Currency}
                    </Span>
                  </Container>
                </Container>

                {currentInvoice.PurchaseOrderNumber && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500 block mb-1">
                      {translations["PO Number"]}
                    </Span>
                    <Span className="text-gray-900">
                      {currentInvoice.PurchaseOrderNumber}
                    </Span>
                  </Container>
                )}
              </Container>

              {currentInvoice.PaymentTerms && (
                <Container className="mt-6">
                  <Span className="text-sm font-medium text-gray-500 block mb-2">
                    {translations["Payment Terms"]}
                  </Span>
                  <Span className="text-gray-900 text-sm">
                    {currentInvoice.PaymentTerms}
                  </Span>
                </Container>
              )}

              {currentInvoice.Notes && (
                <Container className="mt-6">
                  <Span className="text-sm font-medium text-gray-500 block mb-2">
                    {translations.Notes}
                  </Span>
                  <Span className="text-gray-900 text-sm whitespace-pre-wrap">
                    {currentInvoice.Notes}
                  </Span>
                </Container>
              )}

              {currentInvoice.InternalNotes && (
                <Container className="mt-6">
                  <Container className="flex items-center justify-between mb-2">
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Internal Notes"]}
                    </Span>
                    <button
                      onClick={() => setShowInternalNotes(!showInternalNotes)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {showInternalNotes ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          {translations["Hide Internal Notes"]}
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          {translations["Show Internal Notes"]}
                        </>
                      )}
                    </button>
                  </Container>
                  {showInternalNotes && (
                    <Container className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <Span className="text-gray-900 text-sm whitespace-pre-wrap">
                        {currentInvoice.InternalNotes}
                      </Span>
                    </Container>
                  )}
                </Container>
              )}
            </Container>

            {/* Client Information */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {translations["Client Information"]}
              </h3>

              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Client Name"]}
                  </Span>
                  <Span className="text-lg font-semibold text-gray-900">
                    {currentInvoice.ClientName}
                  </Span>
                </Container>

                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Email}
                  </Span>
                  <Container className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Span className="text-gray-900">
                      {currentInvoice.ClientEmail}
                    </Span>
                  </Container>
                </Container>

                {currentInvoice.ClientPhone && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500 block mb-1">
                      {translations.Phone}
                    </Span>
                    <Container className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <Span className="text-gray-900">
                        {currentInvoice.ClientPhone}
                      </Span>
                    </Container>
                  </Container>
                )}

                {currentInvoice.ClientAddress && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500 block mb-1">
                      {translations.Address}
                    </Span>
                    <Container className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <Span className="text-gray-900">
                        {currentInvoice.ClientAddress}
                      </Span>
                    </Container>
                  </Container>
                )}
              </Container>

              <Container className="mt-6 flex gap-3">
                <FilledButton
                  isIcon={true}
                  icon={User}
                  iconSize="w-4 h-4"
                  bgColor="bg-blue-100 hover:bg-blue-200"
                  textColor="text-blue-700"
                  rounded="rounded-lg"
                  buttonText={translations["View Client"]}
                  height="h-9"
                  px="px-3"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={() => {/* Navigate to client details */}}
                />
                <FilledButton
                  isIcon={true}
                  icon={Mail}
                  iconSize="w-4 h-4"
                  bgColor="bg-green-100 hover:bg-green-200"
                  textColor="text-green-700"
                  rounded="rounded-lg"
                  buttonText={translations["Contact Client"]}
                  height="h-9"
                  px="px-3"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  isIconLeft={true}
                  onClick={() => window.open(`mailto:${currentInvoice.ClientEmail}`)}
                />
              </Container>
            </Container>

            {/* Invoice Items */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                {translations["Invoice Items"]}
              </h3>

              <Container className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        {translations.Item}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        {translations.Description}
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">
                        {translations.Quantity}
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        {translations["Unit Price"]}
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        {translations.Discount}
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        {translations.Tax}
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        {translations.Total}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.Items && currentInvoice.Items.length > 0 ? (
                      currentInvoice.Items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-4 px-4">
                            <Container className="flex items-center gap-3">
                              <Container className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-green-600" />
                              </Container>
                              <Container>
                                <Span className="font-medium text-gray-900">
                                  {item.ItemName}
                                </Span>
                              </Container>
                            </Container>
                          </td>
                          <td className="py-4 px-4">
                            <Span className="text-gray-600 text-sm">
                              {item.Description || "-"}
                            </Span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Span className="text-gray-900">
                              {item.Quantity}
                            </Span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Span className="text-gray-900">
                              {formatCurrency(item.UnitPrice, currentInvoice.Currency)}
                            </Span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Span className="text-gray-900">
                              {item.Discount > 0 ? (
                                item.DiscountType === 'percentage' ? 
                                  `${item.Discount}%` : 
                                  formatCurrency(item.Discount, currentInvoice.Currency)
                              ) : '-'}
                            </Span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Span className="text-gray-900">
                              {item.TaxRate > 0 ? `${item.TaxRate}%` : '-'}
                            </Span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Span className="font-medium text-gray-900">
                              {formatCurrency(item.TotalAmount, currentInvoice.Currency)}
                            </Span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-gray-500">
                          {translations["No items found"]}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Container>
            </Container>
          </Container>

          {/* Right Column - Payment Summary */}
          <Container className="lg:col-span-1">
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {translations["Payment Summary"]}
              </h3>

              <Container className="space-y-4">
                {/* Subtotal */}
                <Container className="flex justify-between">
                  <Span className="text-gray-600">{translations.Subtotal}:</Span>
                  <Span className="font-medium">
                    {formatCurrency(currentInvoice.SubTotal, currentInvoice.Currency)}
                  </Span>
                </Container>

                {/* Discount */}
                {currentInvoice.DiscountAmount > 0 && (
                  <Container className="flex justify-between">
                    <Span className="text-gray-600">{translations["Discount Amount"]}:</Span>
                    <Span className="font-medium text-red-600">
                      -{formatCurrency(currentInvoice.DiscountAmount, currentInvoice.Currency)}
                    </Span>
                  </Container>
                )}

                {/* Tax */}
                {currentInvoice.TaxAmount > 0 && (
                  <Container className="flex justify-between">
                    <Span className="text-gray-600">{translations["Tax Amount"]}:</Span>
                    <Span className="font-medium">
                      {formatCurrency(currentInvoice.TaxAmount, currentInvoice.Currency)}
                    </Span>
                  </Container>
                )}

                {/* Shipping */}
                {currentInvoice.ShippingAmount > 0 && (
                  <Container className="flex justify-between">
                    <Span className="text-gray-600">{translations.Shipping}:</Span>
                    <Span className="font-medium">
                      {formatCurrency(currentInvoice.ShippingAmount, currentInvoice.Currency)}
                    </Span>
                  </Container>
                )}

                <hr className="border-gray-200" />

                {/* Total */}
                <Container className="flex justify-between">
                  <Span className="text-lg font-semibold text-gray-900">
                    {translations["Grand Total"]}:
                  </Span>
                  <Span className="text-xl font-bold text-gray-900">
                    {formatCurrency(currentInvoice.TotalAmount, currentInvoice.Currency)}
                  </Span>
                </Container>

                {/* Paid Amount */}
                {currentInvoice.PaidAmount > 0 && (
                  <Container className="flex justify-between">
                    <Span className="text-green-600">{translations["Paid Amount"]}:</Span>
                    <Span className="font-medium text-green-600">
                      {formatCurrency(currentInvoice.PaidAmount, currentInvoice.Currency)}
                    </Span>
                  </Container>
                )}

                {/* Balance Due */}
                {currentInvoice.BalanceAmount > 0 && (
                  <Container className="flex justify-between">
                    <Span className="text-red-600">{translations["Balance Due"]}:</Span>
                    <Span className="font-medium text-red-600">
                      {formatCurrency(currentInvoice.BalanceAmount, currentInvoice.Currency)}
                    </Span>
                  </Container>
                )}

                <hr className="border-gray-200" />

                {/* Actions */}
                <Container className="space-y-3">
                  {currentInvoice.Status !== 'Paid' && (
                    <FilledButton
                      isIcon={true}
                      icon={CreditCard}
                      iconSize="w-4 h-4"
                      bgColor="bg-green-600 hover:bg-green-700"
                      textColor="text-white"
                      rounded="rounded-lg"
                      buttonText={translations["Mark as Paid"]}
                      height="h-10"
                      width="w-full"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      isIconLeft={true}
                      onClick={() => setShowPaymentModal(true)}
                    />
                  )}

                  {currentInvoice.Status === 'Draft' && (
                    <FilledButton
                      isIcon={true}
                      icon={Send}
                      iconSize="w-4 h-4"
                      bgColor="bg-blue-600 hover:bg-blue-700"
                      textColor="text-white"
                      rounded="rounded-lg"
                      buttonText={translations.Send}
                      height="h-10"
                      width="w-full"
                      fontWeight="font-medium"
                      fontSize="text-sm"
                      isIconLeft={true}
                      onClick={() => setShowSendModal(true)}
                    />
                  )}
                </Container>

                {/* Meta Information */}
                <Container className="pt-4 border-t border-gray-200 space-y-2">
                  <Container className="flex justify-between text-sm">
                    <Span className="text-gray-500">{translations.Created}:</Span>
                    <Span className="text-gray-900">
                      {formatDate(currentInvoice.CreatedAt)}
                    </Span>
                  </Container>
                  {currentInvoice.UpdatedAt && (
                    <Container className="flex justify-between text-sm">
                      <Span className="text-gray-500">{translations.Updated}:</Span>
                      <Span className="text-gray-900">
                        {formatDate(currentInvoice.UpdatedAt)}
                      </Span>
                    </Container>
                  )}
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Delete Confirmation Modal */}
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
              {translations["Are you sure?"]}
            </h3>
            <Span className="text-gray-500 mb-4 block">
              {translations["This action cannot be undone"]}. This will permanently delete the invoice{" "}
              <strong>"{currentInvoice.InvoiceNumber}"</strong> and all associated data.
            </Span>
          </Container>
        }
      />

      {/* Send Invoice Modal */}
      <Modall
        modalOpen={showSendModal}
        setModalOpen={setShowSendModal}
        title={
          <Container className="flex items-center gap-2 text-blue-600">
            <Send className="w-5 h-5" />
            <Span>Send Invoice</Span>
          </Container>
        }
        width={500}
        okText={translations.Send}
        cancelText={translations.Cancel}
        okAction={handleSend}
        cancelAction={() => setShowSendModal(false)}
        body={
          <Container className="py-4">
            <Container className="text-center mb-4">
              <Container className="bg-blue-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Send className="w-8 h-8 text-blue-600" />
              </Container>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Send Invoice to Client
              </h3>
              <Span className="text-gray-500">
                This will send the invoice to <strong>{currentInvoice.ClientEmail}</strong> and mark it as sent.
              </Span>
            </Container>
          </Container>
        }
      />

      {/* Mark as Paid Modal */}
      <Modall
        modalOpen={showPaymentModal}
        setModalOpen={setShowPaymentModal}
        title={
          <Container className="flex items-center gap-2 text-green-600">
            <CreditCard className="w-5 h-5" />
            <Span>Mark as Paid</Span>
          </Container>
        }
        width={500}
        okText={translations.Confirm}
        cancelText={translations.Cancel}
        okAction={handleMarkAsPaid}
        cancelAction={() => setShowPaymentModal(false)}
        body={
          <Container className="py-4 space-y-4">
            <Container className="grid grid-cols-2 gap-4">
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.Amount}
                </label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </Container>
              
              <Container>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations["Payment Method"]}
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                </select>
              </Container>
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations["Payment Date"]}
              </label>
              <input
                type="date"
                value={paymentData.paymentDate}
                onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Reference}
              </label>
              <input
                type="text"
                value={paymentData.reference}
                onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})}
                placeholder="Transaction ID, Check number, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </Container>

            <Container>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.Notes}
              </label>
              <textarea
                value={paymentData.notes}
                onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Additional notes about the payment..."
              />
            </Container>
          </Container>
        }
      />
    </Container>
  );
};

export default InvoiceDetails;