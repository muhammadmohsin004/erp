import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Copy,
  FileText,
  Calculator,
  CreditCard,
  Receipt,
  Plus,
  Eye,
  Download,
  MoreVertical,
  MapPin,
  Building,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Trash2,
  Star,
  MessageSquare,
  Activity,
  Filter,
  Search,
  ChevronDown,
  FileImage,
  Paperclip,
  Globe,
  Hash,
  CreditCard as CurrencyIcon,
  Languages,
  Briefcase,
  Home,
  Users,
  Settings
} from "lucide-react";
import { useClients } from "../../Contexts/apiClientContext/apiClientContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const ClientDetailPage = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const language = useSelector((state) => state.language?.language || "en");

  const {
    currentClient,
    loading,
    error,
    getClient,
    clearCurrentClient,
    deleteClient
  } = useClients();

  const [activeTab, setActiveTab] = useState("details");
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const translations = React.useMemo(() => ({
    "Client Details": language === "ar" ? "تفاصيل العميل" : "Client Details",
    "Ledger Account": language === "ar" ? "حساب دفتر الأستاذ" : "Ledger Account",
    "Edit": language === "ar" ? "تعديل" : "Edit",
    "Delete": language === "ar" ? "حذف" : "Delete",
    "Send Email": language === "ar" ? "إرسال بريد إلكتروني" : "Send Email",
    "Create Invoice": language === "ar" ? "إنشاء فاتورة" : "Create Invoice",
    "Create Estimate": language === "ar" ? "إنشاء تقدير" : "Create Estimate",
    "Create Credit Note": language === "ar" ? "إنشاء مذكرة ائتمان" : "Create Credit Note",
    "Statement": language === "ar" ? "كشف حساب" : "Statement",
    "Add Payment Credit": language === "ar" ? "إضافة ائتمان الدفع" : "Add Payment Credit",
    "More Actions": language === "ar" ? "المزيد من الإجراءات" : "More Actions",
    "Details": language === "ar" ? "التفاصيل" : "Details",
    "Timeline": language === "ar" ? "الجدول الزمني" : "Timeline",
    "Loading": language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "Client not found": language === "ar" ? "العميل غير موجود" : "Client not found",
    "VAT Number": language === "ar" ? "رقم ضريبة القيمة المضافة" : "VAT number",
    "Country Code": language === "ar" ? "رمز البلد" : "Country Code",
    "Notes": language === "ar" ? "الملاحظات" : "Notes",
    "Category": language === "ar" ? "الفئة" : "Category",
    "Contacts List": language === "ar" ? "قائمة جهات الاتصال" : "Contacts List",
    "Add Contact": language === "ar" ? "إضافة جهة اتصال" : "Add Contact",
    "Quick Information": language === "ar" ? "معلومات سريعة" : "Quick Information",
    "Count of invoices": language === "ar" ? "عدد الفواتير" : "Count of invoices ",
    "Count of due invoices": language === "ar" ? "عدد الفواتير المستحقة" : "Count of due invoices",
    "Last invoice": language === "ar" ? "آخر فاتورة" : "Last invoice",
    "Last payment": language === "ar" ? "آخر دفعة" : "Last payment",
    "Last login": language === "ar" ? "آخر تسجيل دخول" : "Last login",
    "Last email notification": language === "ar" ? "آخر إشعار بريد إلكتروني" : "Last email notification",
    "No issued invoices": language === "ar" ? "لا توجد فواتير صادرة" : "No issued invoices",
    "No due invoices": language === "ar" ? "لا توجد فواتير مستحقة" : "No due invoices",
    "No payments have been made": language === "ar" ? "لم يتم إجراء أي مدفوعات" : "No payments have been made",
    "No Login": language === "ar" ? "لا يوجد تسجيل دخول" : "No Login",
    "No notifications have been sent": language === "ar" ? "لم يتم إرسال إشعارات" : "No notifications have been sent"
  }), [language]);

  // Fetch client data when component mounts
  useEffect(() => {
    if (clientId) {
      getClient(clientId);
    }

    return () => {
      clearCurrentClient();
    };
  }, [clientId, getClient, clearCurrentClient]);

  // Handle copy to clipboard
  const handleCopyToClipboard = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`${label} copied to clipboard`);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, []);

  // Handle client deletion
  const handleDeleteClient = useCallback(async () => {
    try {
      await deleteClient(clientId);
      setShowDeleteModal(false);
      navigate("/admin/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      setShowDeleteModal(false);
    }
  }, [clientId, deleteClient, navigate]);

  // Get display name based on client type
  const getDisplayName = useCallback(() => {
    if (!currentClient) return "";

    if (currentClient.ClientType === "Business") {
      return currentClient.BusinessName || currentClient.FullName || "Unknown Business";
    }
    return currentClient.FullName || `${currentClient.FirstName || ""} ${currentClient.LastName || ""}`.trim() || "Unknown Client";
  }, [currentClient]);

  // Get country code from country string
  const getCountryCode = useCallback((country) => {
    if (!country) return "";
    const match = country.match(/\(([^)]+)\)/);
    return match ? match[1] : country.slice(0, 2).toUpperCase();
  }, []);

  // Details Tab Component
  const DetailsTab = () => (
    <Container className="space-y-6">
      {/* Basic Info Row */}
      <Container className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {currentClient?.VatNumber && (
          <Container className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm text-gray-600 mb-1">{translations["VAT Number"]}:</label>
            <Span className="text-sm font-medium text-gray-900">{currentClient.VatNumber}</Span>
          </Container>
        )}

        {currentClient?.Country && (
          <Container className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm text-gray-600 mb-1">{translations["Country Code"]}:</label>
            <Span className="text-sm font-medium text-gray-900">{getCountryCode(currentClient.Country) || "N/A"}</Span>
          </Container>
        )}

        {currentClient?.Category && (
          <Container className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm text-gray-600 mb-1">{translations.Category}:</label>
            <Span className="text-sm font-medium text-gray-900">{currentClient.Category}</Span>
          </Container>
        )}

        {currentClient?.Currency && (
          <Container className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm text-gray-600 mb-1">Currency:</label>
            <Span className="text-sm font-medium text-gray-900">{currentClient.Currency}</Span>
          </Container>
        )}
      </Container>

      {currentClient?.Notes && (
        <Container className="bg-white p-4 rounded-lg border border-gray-200">
          <label className="block text-sm text-gray-600 mb-2">{translations.Notes}:</label>
          <Span className="text-sm text-gray-900">{currentClient.Notes}</Span>
        </Container>
      )}

      {/* Contacts List */}
      {/* <Container className="bg-white rounded-lg border border-gray-200">
        <Container className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{translations["Contacts List"]}</h3>
          <FilledButton
            isIcon={true}
            icon={Plus}
            iconSize="w-4 h-4"
            bgColor="bg-purple-600 hover:bg-purple-700"
            textColor="text-white"
            rounded="rounded-lg"
            buttonText={translations["Add Contact"]}
            height="h-8"
            px="px-3"
            fontSize="text-sm"
            isIconLeft={true}
            onClick={() => console.log("Add contact")}
          />
        </Container>

        <Container className="p-4">
          {currentClient?.Contacts && currentClient.Contacts.length > 0 ? (
            <Container className="space-y-3">
              {currentClient.Contacts.map((contact, index) => (
                <Container key={contact.Id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <Container>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {`${contact.FirstName || ""} ${contact.LastName || ""}`.trim() || `Contact ${index + 1}`}
                    </h4>
                    <Container className="flex items-center gap-4 mt-1">
                      {contact.Email && (
                        <Container className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <Span>{contact.Email}</Span>
                        </Container>
                      )}
                      {contact.Mobile && (
                        <Container className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <Span>{contact.Mobile}</Span>
                        </Container>
                      )}
                      {contact.Telephone && contact.Telephone !== contact.Mobile && (
                        <Container className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <Span>{contact.Telephone}</Span>
                        </Container>
                      )}
                    </Container>
                  </Container>
                  <Container className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-red-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </Container>
                </Container>
              ))}
            </Container>
          ) : (
            <Container className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <Span className="text-gray-500">No contacts found</Span>
            </Container>
          )}
        </Container>
      </Container> */}

      {/* Quick Information */}
      <Container className="bg-white rounded-lg border border-gray-200">
        <Container className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{translations["Quick Information"]}</h3>
        </Container>

        <Container className="p-4">
          <Container className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Container className="space-y-3">
              <Container className="flex justify-between">
                <Span className="text-sm text-gray-600">{translations["Count of invoices"]}:</Span>
                <Span className="text-sm font-medium text-gray-900">{translations["No issued invoices"]}</Span>
              </Container>

              <Container className="flex justify-between">
                <Span className="text-sm text-gray-600">{translations["Count of due invoices"]}:</Span>
                <Span className="text-sm font-medium text-gray-900">{translations["No due invoices"]}</Span>
              </Container>

              <Container className="flex justify-between">
                <Span className="text-sm text-gray-600">{translations["Last invoice"]}:</Span>
                <Span className="text-sm font-medium text-gray-900">{translations["No issued invoices"]}</Span>
              </Container>
            </Container>

            <Container className="space-y-3">
              <Container className="flex justify-between">
                <Span className="text-sm text-gray-600">{translations["Last payment"]}:</Span>
                <Span className="text-sm font-medium text-gray-900">{translations["No payments have been made"]}</Span>
              </Container>

              <Container className="flex justify-between">
                <Span className="text-sm text-gray-600">{translations["Last login"]}:</Span>
                <Span className="text-sm font-medium text-gray-900">{translations["No Login"]}</Span>
              </Container>

              <Container className="flex justify-between">
                <Span className="text-sm text-gray-600">{translations["Last email notification"]}:</Span>
                <Span className="text-sm font-medium text-gray-900">{translations["No notifications have been sent"]}</Span>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );

  // Timeline Tab Component
  const TimelineTab = () => (
    <Container className="bg-white rounded-lg border border-gray-200 p-6">
      <Container className="space-y-4">
        <Container className="flex items-start gap-3">
          <Container className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </Container>
          <Container>
            <h4 className="text-sm font-medium text-gray-900">Client Created</h4>
            <Span className="text-sm text-gray-600">
              Client account was created and added to the system
            </Span>
            <Span className="text-xs text-gray-500 block mt-1">
              {currentClient?.CreatedAt ? new Date(currentClient.CreatedAt).toLocaleDateString() : "N/A"}
            </Span>
          </Container>
        </Container>

        {currentClient?.UpdatedAt && currentClient.UpdatedAt !== currentClient.CreatedAt && (
          <Container className="flex items-start gap-3">
            <Container className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Edit className="w-4 h-4 text-green-600" />
            </Container>
            <Container>
              <h4 className="text-sm font-medium text-gray-900">Client Updated</h4>
              <Span className="text-sm text-gray-600">
                Client information was modified
              </Span>
              <Span className="text-xs text-gray-500 block mt-1">
                {new Date(currentClient.UpdatedAt).toLocaleDateString()}
              </Span>
            </Container>
          </Container>
        )}
      </Container>
    </Container>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return <DetailsTab />;
      case "timeline":
        return <TimelineTab />;
      default:
        return <DetailsTab />;
    }
  };

  if (loading) {
    return (
      <Container className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container className="text-center">
          <Container className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></Container>
          <Span className="text-gray-500">{translations.Loading}</Span>
        </Container>
      </Container>
    );
  }

  if (error || !currentClient) {
    return (
      <Container className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container className="text-center">
          <Container className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </Container>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {translations["Client not found"]}
          </h3>
          <Span className="text-gray-500 mb-4 block">
            {error || "The requested client could not be found."}
          </Span>
          <FilledButton
            isIcon={true}
            icon={ArrowLeft}
            iconSize="w-4 h-4"
            bgColor="bg-blue-600 hover:bg-blue-700"
            textColor="text-white"
            rounded="rounded-lg"
            buttonText="Back to Clients"
            height="h-10"
            px="px-4"
            fontWeight="font-medium"
            fontSize="text-sm"
            isIconLeft={true}
            onClick={() => navigate("/admin/clients")}
          />
        </Container>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="bg-white border-b border-gray-200">
        <Container className="px-6 py-4">
          {/* Top Row with Back Button and Title */}
          <Container className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/admin/clients")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            <Container className="flex items-center gap-3">
              <Container className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${currentClient.ClientType === "Individual" ? "bg-blue-500" : "bg-green-500"
                }`}>
                {currentClient.ClientType === "Individual" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Building className="w-5 h-5" />
                )}
              </Container>

              <Container>
                <Container className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">
                    {getDisplayName()}
                  </h1>
                  <Span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                    Active
                  </Span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Container>
                <Span className="text-sm text-gray-600">
                  {translations["Ledger Account"]}: {getDisplayName()} #{currentClient.CodeNumber || currentClient.Id}
                </Span>
              </Container>
            </Container>
          </Container>

          {/* Client Info and Contact Details Row */}
          <Container className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Side - Client Description */}
            <Container className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{currentClient.FullName}</h2>
              <Container className="text-sm text-gray-600 leading-relaxed">
                <Span>
                  {currentClient.StreetAddress1 && (
                    <>
                      {currentClient.StreetAddress1}
                      {currentClient.StreetAddress2 && `, ${currentClient.StreetAddress2}`}
                      {(currentClient.City || currentClient.State || currentClient.PostalCode) && <br />}
                    </>
                  )}
                  {[currentClient.City, currentClient.State, currentClient.PostalCode].filter(Boolean).join(", ")}
                  {currentClient.Country && (
                    <>
                      {currentClient.City || currentClient.State || currentClient.PostalCode ? <br /> : ""}
                      {currentClient.Country}
                    </>
                  )}
                </Span>
              </Container>

              {currentClient?.Category && (
                <Container className="mt-3 flex items-center gap-2">
                  <Span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                    Client Category: {currentClient.Category}
                  </Span>
                  <Span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
                    Client Type: {currentClient.ClientType}
                  </Span>
                </Container>
              )}
            </Container>

            {/* Right Side - Contact Info */}
            <Container className="flex flex-col gap-3 min-w-80">
              {currentClient.Email && (
                <Container className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <Span className="text-sm text-gray-900 flex-1">{currentClient.Email}</Span>
                  <button
                    onClick={() => handleCopyToClipboard(currentClient.Email, "Email")}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </Container>
              )}

              {currentClient.Mobile && (
                <Container className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <Span className="text-sm text-gray-900 flex-1">{currentClient.Mobile}</Span>
                  <button
                    onClick={() => handleCopyToClipboard(currentClient.Mobile, "Mobile")}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </Container>
              )}

              {currentClient.Telephone && currentClient.Telephone !== currentClient.Mobile && (
                <Container className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <Span className="text-sm text-gray-900 flex-1">{currentClient.Telephone}</Span>
                  <button
                    onClick={() => handleCopyToClipboard(currentClient.Telephone, "Telephone")}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </Container>
              )}

              {currentClient.Country && (
                <Container className="flex items-center gap-2">
                  <Span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
                    {getCountryCode(currentClient.Country)}
                  </Span>
                </Container>
              )}
            </Container>
          </Container>

          {/* Action Buttons Row */}
          <Container className="flex flex-wrap items-center gap-2">
            <FilledButton
              isIcon={true}
              icon={Edit}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Edit}
              height="h-9"
              px="px-3"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/new-clients", {
                state: { editData: currentClient, isEditing: true }
              })}
            />

            <FilledButton
              isIcon={true}
              icon={Mail}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations["Send Email"]}
              height="h-9"
              px="px-3"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => currentClient.Email && window.open(`mailto:${currentClient.Email}`)}
              disabled={!currentClient.Email}
            />

            <FilledButton
              isIcon={true}
              icon={FileText}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations["Create Invoice"]}
              height="h-9"
              px="px-3"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/new-invoice")}
            />

            <FilledButton
              isIcon={true}
              icon={CreditCard}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations["Create Credit Note"]}
              height="h-9"
              px="px-3"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => console.log("Create credit note")}
            />

            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations["Add Payment Credit"]}
              height="h-9"
              px="px-3"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => console.log("Add payment credit")}
            />

            <Container className="relative"> 
              <button
                onClick={() => setShowMoreActions(!showMoreActions)}
                className="px-3 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                {translations["More Actions"]}
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown positioned below the button */}
              {showMoreActions && (
                <Container className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <Container className="py-1">
                    <button
                      onClick={() => {
                        console.log("Export client data");
                        setShowMoreActions(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
      </Container>

      {/* Content */}
      <Container className="px-6 py-6">
        <Container className="max-w-7xl mx-auto">
          {/* Tabs */}
          <Container className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Container className="border-b border-gray-200">
              <Container className="flex">
                {[
                  { id: "details", label: translations.Details },
                  { id: "timeline", label: translations.Timeline }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </Container>
            </Container>

            <Container className="p-6">
              {renderTabContent()}
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Container className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Container className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <Container className="flex items-center gap-3 mb-4">
              <Container className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </Container>
              <Container>
                <h3 className="text-lg font-semibold text-gray-900">Delete Client</h3>
                <Span className="text-sm text-gray-600">This action cannot be undone</Span>
              </Container>
            </Container>

            <Span className="text-gray-600 mb-6 block">
              Are you sure you want to delete "{getDisplayName()}"? All associated data will be permanently removed.
            </Span>

            <Container className="flex justify-end gap-3">
              <FilledButton
                bgColor="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                rounded="rounded-lg"
                buttonText="Cancel"
                height="h-10"
                px="px-4"
                onClick={() => setShowDeleteModal(false)}
              />
              <FilledButton
                isIcon={true}
                icon={Trash2}
                iconSize="w-4 h-4"
                bgColor="bg-red-600 hover:bg-red-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText="Delete Client"
                height="h-10"
                px="px-4"
                isIconLeft={true}
                onClick={handleDeleteClient}
              />
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default ClientDetailPage;