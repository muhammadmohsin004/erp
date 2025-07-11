import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Building,
  MapPin,
  Phone,
  Globe,
  Hash,
  Home,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useCompanyBranch } from "../../Contexts/CompanyBranchContext/CompanyBranchContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const CompanyBranchDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Branch Details": language === "ar" ? "تفاصيل الفرع" : "Branch Details",
    "Company Branches": language === "ar" ? "فروع الشركة" : "Company Branches",
    "Branch Name": language === "ar" ? "اسم الفرع" : "Branch Name",
    Address: language === "ar" ? "العنوان" : "Address",
    City: language === "ar" ? "المدينة" : "City",
    State: language === "ar" ? "الولاية" : "State",
    Country: language === "ar" ? "الدولة" : "Country",
    "Zip Code": language === "ar" ? "الرمز البريدي" : "Zip Code",
    "Phone Number": language === "ar" ? "رقم الهاتف" : "Phone Number",
    "Head Office": language === "ar" ? "المكتب الرئيسي" : "Head Office",
    Status: language === "ar" ? "الحالة" : "Status",
    Active: language === "ar" ? "نشط" : "Active",
    Inactive: language === "ar" ? "غير نشط" : "Inactive",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    "Back to List": language === "ar" ? "العودة للقائمة" : "Back to List",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Branch": language === "ar" ? "حذف الفرع" : "Delete Branch",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    Yes: language === "ar" ? "نعم" : "Yes",
    No: language === "ar" ? "لا" : "No",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "Branch not found": language === "ar" ? "لم يتم العثور على الفرع" : "Branch not found",
    "Basic Information": language === "ar" ? "المعلومات الأساسية" : "Basic Information",
    "Contact Information": language === "ar" ? "معلومات الاتصال" : "Contact Information",
    "System Information": language === "ar" ? "معلومات النظام" : "System Information",
    Created: language === "ar" ? "تاريخ الإنشاء" : "Created",
    "Last Updated": language === "ar" ? "آخر تحديث" : "Last Updated",
    "Branch ID": language === "ar" ? "معرف الفرع" : "Branch ID",
    "Company ID": language === "ar" ? "معرف الشركة" : "Company ID",
  };

  // Get branch context
  const {
    currentBranch,
    loading,
    error,
    getBranch,
    deleteBranch,
  } = useCompanyBranch();

  // Local state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch branch data on component mount
  useEffect(() => {
    const fetchBranch = async () => {
      if (id && token) {
        try {
          await getBranch(parseInt(id));
        } catch (error) {
          console.error("Error fetching branch:", error);
        }
      }
    };

    fetchBranch();
  }, [id, token, getBranch]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Handle actions
  const handleEdit = () => {
    if (currentBranch) {
      navigate("/admin/company-branches/new", {
        state: {
          editData: currentBranch,
          isEditing: true,
        },
      });
    }
  };

  const handleClone = () => {
    if (currentBranch) {
      navigate("/admin/company-branches/new", {
        state: {
          cloneData: {
            ...currentBranch,
            BranchName: `${currentBranch.BranchName || ""} (Copy)`,
            Id: undefined,
            IsHeadOffice: false, // Clone should not be head office
          },
        },
      });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!currentBranch) return;

    setIsDeleting(true);
    try {
      const success = await deleteBranch(currentBranch.Id);
      if (success) {
        navigate("/admin/company-branches", {
          state: {
            message: "Branch deleted successfully",
            type: "success"
          }
        });
      }
    } catch (error) {
      console.error("Error deleting branch:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleBackToList = () => {
    navigate("/admin/company-branches");
  };

  // Loading state
  if (!token || loading) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <Span className="text-blue-500 text-lg ml-4">{translations.Loading}</Span>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="min-h-screen bg-gray-50 px-6 py-6">
        <Container className="max-w-md mx-auto">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {translations["Branch not found"]}
            </h3>
            <Span className="text-gray-500 mb-4 block">{error}</Span>
            <FilledButton
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Back to List"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={handleBackToList}
            />
          </Container>
        </Container>
      </Container>
    );
  }

  // No branch data
  if (!currentBranch) {
    return (
      <Container className="min-h-screen bg-gray-50 px-6 py-6">
        <Container className="max-w-md mx-auto">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {translations["Branch not found"]}
            </h3>
            <Span className="text-gray-500 mb-4 block">
              The requested branch could not be found.
            </Span>
            <FilledButton
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Back to List"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              onClick={handleBackToList}
            />
          </Container>
        </Container>
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
              onClick={handleBackToList}
            />
            <Container>
              <h1 className="text-2xl font-bold text-gray-900">
                {translations["Branch Details"]}
              </h1>
              <Span className="text-sm text-gray-500">
                {translations["Company Branches"]}
              </Span>
            </Container>
          </Container>

          <Container className="flex gap-3">
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
              bgColor="bg-green-600 hover:bg-green-700"
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
            <FilledButton
              isIcon={true}
              icon={Trash2}
              iconSize="w-4 h-4"
              bgColor="bg-red-600 hover:bg-red-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations.Delete}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleDeleteClick}
            />
          </Container>
        </Container>

        {/* Branch Details Cards */}
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Container className="lg:col-span-2">
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5" />
                {translations["Basic Information"]}
              </h3>

              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Branch Name */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Branch Name"]}
                  </Span>
                  <Container className="flex items-center gap-2">
                    <Span className="text-lg font-semibold text-gray-900">
                      {currentBranch.BranchName || "N/A"}
                    </Span>
                    {currentBranch.IsHeadOffice && (
                      <Span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Home className="w-3 h-3 mr-1" />
                        {translations["Head Office"]}
                      </Span>
                    )}
                  </Container>
                </Container>

                {/* Status */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Status}
                  </Span>
                  <Container className="flex items-center gap-2">
                    {currentBranch.IsActive ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <Span
                      className={`text-lg font-medium ${
                        currentBranch.IsActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {currentBranch.IsActive ? translations.Active : translations.Inactive}
                    </Span>
                  </Container>
                </Container>

                {/* Address */}
                <Container className="md:col-span-2">
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Address}
                  </Span>
                  <Container className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <Span className="text-gray-900">
                      {currentBranch.Address || "N/A"}
                    </Span>
                  </Container>
                </Container>

                {/* City */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.City}
                  </Span>
                  <Span className="text-gray-900 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {currentBranch.City || "N/A"}
                  </Span>
                </Container>

                {/* State */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.State}
                  </Span>
                  <Span className="text-gray-900">
                    {currentBranch.State || "N/A"}
                  </Span>
                </Container>

                {/* Country */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Country}
                  </Span>
                  <Span className="text-gray-900 flex items-center gap-1">
                    <Globe className="w-4 h-4 text-gray-400" />
                    {currentBranch.Country || "N/A"}
                  </Span>
                </Container>

                {/* Zip Code */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Zip Code"]}
                  </Span>
                  <Span className="text-gray-900 flex items-center gap-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    {currentBranch.ZipCode || "N/A"}
                  </Span>
                </Container>
              </Container>
            </Container>
          </Container>

          {/* Contact Information & System Info */}
          <Container className="space-y-6">
            {/* Contact Information */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {translations["Contact Information"]}
              </h3>

              <Container className="space-y-4">
                {/* Phone Number */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Phone Number"]}
                  </Span>
                  <Container className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Span className="text-gray-900">
                      {currentBranch.PhoneNumber || "N/A"}
                    </Span>
                  </Container>
                </Container>
              </Container>
            </Container>

            {/* System Information */}
            <Container className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {translations["System Information"]}
              </h3>

              <Container className="space-y-4">
                {/* Branch ID */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Branch ID"]}
                  </Span>
                  <Span className="text-gray-900 font-mono">
                    {currentBranch.Id}
                  </Span>
                </Container>

                {/* Company ID */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations["Company ID"]}
                  </Span>
                  <Span className="text-gray-900 font-mono">
                    {currentBranch.CompanyId}
                  </Span>
                </Container>

                {/* Created */}
                <Container>
                  <Span className="text-sm font-medium text-gray-500 block mb-1">
                    {translations.Created}
                  </Span>
                  <Span className="text-gray-900">
                    {currentBranch.CreatedAt
                      ? new Date(currentBranch.CreatedAt).toLocaleDateString()
                      : "N/A"}
                  </Span>
                </Container>

                {/* Last Updated */}
                {currentBranch.UpdatedAt && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500 block mb-1">
                      {translations["Last Updated"]}
                    </Span>
                    <Span className="text-gray-900">
                      {new Date(currentBranch.UpdatedAt).toLocaleDateString()}
                    </Span>
                  </Container>
                )}
              </Container>
            </Container>
          </Container>
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
            onClick={handleBackToList}
          />
        </Container>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modall
        modalOpen={showDeleteModal}
        setModalOpen={setShowDeleteModal}
        title={
          <Container className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <Span>{translations["Delete Branch"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDelete}
        cancelAction={() => setShowDeleteModal(false)}
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
              permanently delete the branch{" "}
              <strong>"{currentBranch?.BranchName}"</strong>{" "}
              and all associated data.
            </Span>
          </Container>
        }
      />
    </Container>
  );
};

export default CompanyBranchDetails;