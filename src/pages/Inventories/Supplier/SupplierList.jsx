import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  MapPin,
  Building,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  X,
  Users,
  Calendar,
  Package,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  AiOutlineEye, // Eye icon for view
  AiOutlineEdit, // Edit icon for edit
  AiOutlineCopy, // Copy icon for clone
  AiOutlineDelete, // Delete icon for delete
  AiOutlinePlus, // Plus icon for add
  AiOutlineFilter, // Filter icon
  AiOutlineDownload, // Download icon for export
} from "react-icons/ai";
import { useSupplier } from "../../../Contexts/SupplierContext/SupplierContext";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../../components/elements/modal/Modal";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../../components/elements/table/Table";
import Container from "../../../components/elements/container/Container";
import Span from "../../../components/elements/span/Span";

const SupplierList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = useSelector((state) => state.auth?.token);

  const translations = {
    "Add Supplier": language === "ar" ? "إضافة مورد" : "Add Supplier",
    Suppliers: language === "ar" ? "الموردين" : "Suppliers",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    NoSuppliers: language === "ar" ? "لا يوجد موردين" : "No suppliers found",
    Name: language === "ar" ? "الاسم" : "Name",
    ContactPerson: language === "ar" ? "الشخص المسؤول" : "Contact Person",
    Email: language === "ar" ? "البريد الإلكتروني" : "Email",
    Phone: language === "ar" ? "الهاتف" : "Phone",
    Address: language === "ar" ? "العنوان" : "Address",
    City: language === "ar" ? "المدينة" : "City",
    Status: language === "ar" ? "الحالة" : "Status",
    Actions: language === "ar" ? "الإجراءات" : "Actions",
    Showing: language === "ar" ? "عرض" : "Showing",
    Of: language === "ar" ? "من" : "of",
    Items: language === "ar" ? "عناصر" : "Items",
    Active: language === "ar" ? "نشط" : "Active",
    Inactive: language === "ar" ? "غير نشط" : "Inactive",
    Total: language === "ar" ? "المجموع" : "Total",
    "This Month": language === "ar" ? "هذا الشهر" : "This Month",
    View: language === "ar" ? "عرض" : "View",
    Edit: language === "ar" ? "تعديل" : "Edit",
    Clone: language === "ar" ? "نسخ" : "Clone",
    Delete: language === "ar" ? "حذف" : "Delete",
    "Are you sure?": language === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
    "Delete Supplier": language === "ar" ? "حذف المورد" : "Delete Supplier",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Supplier Details": language === "ar" ? "تفاصيل المورد" : "Supplier Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    Notes: language === "ar" ? "ملاحظات" : "Notes",
    "Tax ID": language === "ar" ? "الرقم الضريبي" : "Tax ID",
    Country: language === "ar" ? "البلد" : "Country",
    State: language === "ar" ? "الولاية" : "State",
    "Zip Code": language === "ar" ? "الرمز البريدي" : "Zip Code",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "All Status": language === "ar" ? "جميع الحالات" : "All Status",
  };

  // Get supplier context
  const {
    suppliers,
    loading: suppliersLoading,
    error,
    pagination,
    getSuppliers,
    getSupplier,
    deleteSupplier,
    searchSuppliers,
    filterSuppliersByStatus,
    sortSuppliers,
    changePage,
    setFilters,
  } = useSupplier();

  // Process suppliers data from API response
  const suppliersData = suppliers?.Data.$values || suppliers || [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    sortBy: "CreatedAt",
    sortAscending: false,
  });
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock statistics - you can replace this with actual API call
  const [statistics, setStatistics] = useState({
    totalSuppliers: 0,
    activeSuppliers: 0,
    suppliersThisMonth: 0,
  });

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getSuppliers();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token, getSuppliers]);

  // Update statistics when suppliers change
  useEffect(() => {
    if (Array.isArray(suppliersData) && suppliersData.length > 0) {
      const stats = {
        totalSuppliers: pagination?.TotalItems || suppliersData.length,
        activeSuppliers: suppliersData.filter(s => s.Status === "Active").length,
        suppliersThisMonth: suppliersData.filter(s => {
          const createdDate = new Date(s.CreatedAt);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() && 
                 createdDate.getFullYear() === now.getFullYear();
        }).length,
      };
      setStatistics(stats);
    }
  }, [suppliersData, pagination]);

  // Handle search when searchTerm changes (with debounce)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchSuppliers();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Handle filters change
  useEffect(() => {
    setSelectedSuppliers([]);
    setSelectAll(false);
  }, [suppliersData]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-Login");
    }
  }, [token, navigate]);

  // Search function
  const handleSearchSuppliers = async () => {
    try {
      await searchSuppliers(searchTerm);
    } catch (error) {
      console.error("Error searching suppliers:", error);
    }
  };

  // Supplier selection
  const handleSupplierSelection = (supplierId) => {
    setSelectedSuppliers((prev) => {
      if (prev.includes(supplierId)) {
        return prev.filter((id) => id !== supplierId);
      } else {
        return [...prev, supplierId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSuppliers([]);
    } else {
      const supplierIds = Array.isArray(suppliersData)
        ? suppliersData.map((supplier) => supplier.Id)
        : [];
      setSelectedSuppliers(supplierIds);
    }
    setSelectAll(!selectAll);
  };

  // Supplier actions
  const handleViewSupplier = async (supplierId) => {
    try {
      const supplierData = await getSupplier(supplierId);
      if (supplierData) {
        setSelectedSupplier(supplierData);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      alert("Failed to fetch supplier details");
    }
  };

  const handleEditSupplier = async (supplierId) => {
    try {
      const supplierData = await getSupplier(supplierId);
      if (supplierData) {
        navigate("/admin/new-supplier", {
          state: {
            editData: supplierData,
            isEditing: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching supplier for edit:", error);
      alert("Failed to fetch supplier details for editing");
    }
  };

  const handleCloneSupplier = async (supplierId) => {
    try {
      const supplierData = await getSupplier(supplierId);
      if (supplierData) {
        navigate("/admin/new-supplier", {
          state: {
            cloneData: {
              ...supplierData,
              Name: `${supplierData.Name || ""} (Copy)`,
              Id: undefined,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error cloning supplier:", error);
      alert("Failed to clone supplier");
    }
  };

  const handleDeleteSupplier = (supplierId) => {
    const supplier = Array.isArray(suppliersData)
      ? suppliersData.find((s) => s.Id === supplierId)
      : null;
    if (supplier) {
      setSupplierToDelete(supplier);
      setShowDeleteModal(true);
    } else {
      alert("Supplier not found");
    }
  };

  const confirmDeleteSupplier = async () => {
    if (!supplierToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSupplier(supplierToDelete.Id);
      setShowDeleteModal(false);
      setSupplierToDelete(null);
      // Refresh the supplier list
      await getSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier");
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination
  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > pagination.TotalPages) return;

    try {
      await changePage(newPage);
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };

  // Filter functions
  const handleApplyFilters = async () => {
    try {
      setFilters(filterOptions);
      if (filterOptions.status) {
        await filterSuppliersByStatus(filterOptions.status);
      }
      if (filterOptions.sortBy) {
        await sortSuppliers(filterOptions.sortBy, filterOptions.sortAscending);
      }
      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm("");
    setFilterOptions({
      status: "",
      sortBy: "CreatedAt",
      sortAscending: false,
    });
    setShowFilters(false);

    try {
      await getSuppliers();
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  // Export functionality
  const handleExport = () => {
    console.log(
      "Export suppliers:",
      selectedSuppliers.length > 0 ? selectedSuppliers : "all"
    );
    alert("Export functionality to be implemented");
  };

  // Statistics Card Component
  const StatCard = ({ title, value, icon: Icon, bgColor, iconColor }) => (
    <Container className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <Container className="flex items-center justify-between">
        <Container>
          <Span className="text-gray-500 text-sm font-medium">{title}</Span>
          <Span className="text-2xl font-bold text-gray-900 mt-1 block">
            {value || 0}
          </Span>
        </Container>
        <Container className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </Container>
      </Container>
    </Container>
  );

  // Loading state
  if (!token) {
    return (
      <Container className="flex justify-center items-center min-h-screen">
        <Span className="text-blue-500 text-lg">Loading...</Span>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50">
      {/* Header */}
      <Container className="px-6 py-6">
        <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <Container className="flex items-center gap-4 mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {translations.Suppliers}
            </h1>
            {selectedSuppliers.length > 0 && (
              <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedSuppliers.length} {translations.Selected}
              </Span>
            )}
          </Container>
          <Container className="flex gap-3 flex-wrap">
            <FilledButton
              isIcon={true}
              icon={Filter}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Filters}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => setShowFilters(true)}
            />
            <FilledButton
              isIcon={true}
              icon={Download}
              iconSize="w-4 h-4"
              bgColor="bg-gray-100 hover:bg-gray-200"
              textColor="text-gray-700"
              rounded="rounded-lg"
              buttonText={translations.Export}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={handleExport}
            />
            <FilledButton
              isIcon={true}
              icon={Plus}
              iconSize="w-4 h-4"
              bgColor="bg-blue-600 hover:bg-blue-700"
              textColor="text-white"
              rounded="rounded-lg"
              buttonText={translations["Add Supplier"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/new-supplier")}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Suppliers}`}
            value={statistics?.totalSuppliers || 0}
            icon={Building}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations.Active}
            value={statistics?.activeSuppliers || 0}
            icon={Users}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations["This Month"]}
            value={statistics?.suppliersThisMonth || 0}
            icon={Calendar}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
        </Container>

        {/* Search Bar */}
        <Container className="mb-6">
          <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
            <SearchAndFilters
              isFocused={isFocused}
              searchValue={searchTerm}
              setSearchValue={setSearchTerm}
            />
          </Container>
        </Container>

        {/* Supplier Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {suppliersLoading ? (
            <Container className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <Span className="text-blue-500 text-lg block mt-4">
                {translations.Loading}
              </Span>
            </Container>
          ) : error ? (
            <Container className="text-center py-12">
              <Span className="text-red-500 text-lg block mb-4">
                Error: {error}
              </Span>
              <FilledButton
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText="Retry"
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                onClick={() => getSuppliers()}
              />
            </Container>
          ) : !Array.isArray(suppliersData) || suppliersData.length === 0 ? (
            <Container className="text-center py-12">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterOptions.status
                  ? translations["No results found"]
                  : translations.NoSuppliers}
              </h3>
              {(searchTerm || filterOptions.status) && (
                <FilledButton
                  bgColor="bg-blue-600 hover:bg-blue-700"
                  textColor="text-white"
                  rounded="rounded-lg"
                  buttonText={`${translations["Clear All"]} ${translations.Filters}`}
                  height="h-10"
                  px="px-4"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  onClick={handleClearFilters}
                />
              )}
            </Container>
          ) : (
            <>
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
                        {translations.Name}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        {translations.ContactPerson}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations.Email}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations.Phone}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Status}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {translations.Actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {suppliersData.map((supplier) => (
                      <tr key={supplier.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSuppliers.includes(supplier.Id)}
                            onChange={() => handleSupplierSelection(supplier.Id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Container>
                            <Container className="flex items-center gap-2">
                              <Span className="text-sm font-medium text-gray-900">
                                {supplier.Name || "N/A"}
                              </Span>
                            </Container>
                            {supplier.Notes && (
                              <Span className="text-sm text-gray-500 block">
                                {supplier.Notes}
                              </Span>
                            )}
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Span className="text-sm text-gray-900">
                            {supplier.ContactPerson || "-"}
                          </Span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          {supplier.Email ? (
                            <a
                              href={`mailto:${supplier.Email}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {supplier.Email}
                            </a>
                          ) : (
                            <Span className="text-sm text-gray-500">-</Span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          {supplier.Phone ? (
                            <a
                              href={`tel:${supplier.Phone}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {supplier.Phone}
                            </a>
                          ) : (
                            <Span className="text-sm text-gray-500">-</Span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              supplier.Status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {translations[supplier.Status] || supplier.Status}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-1">
                            {/* View Button */}
                            <button
                              onClick={() => handleViewSupplier(supplier.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              title={translations.View}
                            >
                              <AiOutlineEye className="w-3 h-3" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditSupplier(supplier.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                              title={translations.Edit}
                            >
                              <AiOutlineEdit className="w-3 h-3" />
                            </button>

                            {/* Clone Button */}
                            <button
                              onClick={() => handleCloneSupplier(supplier.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                              title={translations.Clone}
                            >
                              <AiOutlineCopy className="w-3 h-3" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteSupplier(supplier.Id)}
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

              {/* Pagination */}
              {pagination && pagination.TotalPages > 1 && (
                <Container className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                  <Span className="text-sm text-gray-500">
                    {translations.Showing}{" "}
                    {(pagination.PageNumber - 1) * pagination.PageSize + 1} -{" "}
                    {Math.min(
                      pagination.PageNumber * pagination.PageSize,
                      pagination.TotalItems
                    )}{" "}
                    {translations.Of} {pagination.TotalItems}{" "}
                    {translations.Items}
                  </Span>
                  <Container className="flex gap-2">
                    <FilledButton
                      isIcon={true}
                      icon={ChevronsLeft}
                      iconSize="w-4 h-4"
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-md"
                      buttonText=""
                      height="h-8"
                      width="w-8"
                      disabled={pagination.PageNumber === 1}
                      onClick={() => handlePageChange(1)}
                    />
                    <FilledButton
                      isIcon={true}
                      icon={ChevronLeft}
                      iconSize="w-4 h-4"
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-md"
                      buttonText=""
                      height="h-8"
                      width="w-8"
                      disabled={pagination.PageNumber === 1}
                      onClick={() => handlePageChange(pagination.PageNumber - 1)}
                    />
                    <Span className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center">
                      {pagination.PageNumber} / {pagination.TotalPages}
                    </Span>
                    <FilledButton
                      isIcon={true}
                      icon={ChevronRight}
                      iconSize="w-4 h-4"
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-md"
                      buttonText=""
                      height="h-8"
                      width="w-8"
                      disabled={pagination.PageNumber === pagination.TotalPages}
                      onClick={() => handlePageChange(pagination.PageNumber + 1)}
                    />
                    <FilledButton
                      isIcon={true}
                      icon={ChevronsRight}
                      iconSize="w-4 h-4"
                      bgColor="bg-gray-100 hover:bg-gray-200"
                      textColor="text-gray-700"
                      rounded="rounded-md"
                      buttonText=""
                      height="h-8"
                      width="w-8"
                      disabled={pagination.PageNumber === pagination.TotalPages}
                      onClick={() => handlePageChange(pagination.TotalPages)}
                    />
                  </Container>
                </Container>
              )}
            </>
          )}
        </Container>
      </Container>

      {/* View Supplier Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Supplier Details"]}</Span>
          </Container>
        }
        width={800}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditSupplier(selectedSupplier?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedSupplier && (
            <Container className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <Container className="space-y-4">
                <Container>
                  <Span className="text-sm font-medium text-gray-500">
                    {translations.Name}
                  </Span>
                  <Span className="text-sm text-gray-900 block mt-1">
                    {selectedSupplier.Name || "N/A"}
                  </Span>
                </Container>

                <Container>
                  <Span className="text-sm font-medium text-gray-500">
                    {translations.ContactPerson}
                  </Span>
                  <Span className="text-sm text-gray-900 block mt-1">
                    {selectedSupplier.ContactPerson || "N/A"}
                  </Span>
                </Container>

                <Container>
                  <Span className="text-sm font-medium text-gray-500">
                    {translations.Status}
                  </Span>
                  <Span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedSupplier.Status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {translations[selectedSupplier.Status] || selectedSupplier.Status}
                  </Span>
                </Container>

                {selectedSupplier.Email && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Email}
                    </Span>
                    <a
                      href={`mailto:${selectedSupplier.Email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 block mt-1"
                    >
                      {selectedSupplier.Email}
                    </a>
                  </Container>
                )}

                {selectedSupplier.Phone && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Phone}
                    </Span>
                    <a
                      href={`tel:${selectedSupplier.Phone}`}
                      className="text-sm text-blue-600 hover:text-blue-800 block mt-1"
                    >
                      {selectedSupplier.Phone}
                    </a>
                  </Container>
                )}

                {selectedSupplier.TaxId && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Tax ID"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedSupplier.TaxId}
                    </Span>
                  </Container>
                )}
              </Container>

              <Container className="space-y-4">
                {(selectedSupplier.Address ||
                  selectedSupplier.City ||
                  selectedSupplier.Country) && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Address}
                    </Span>
                    <Container className="mt-1">
                      {selectedSupplier.Address && (
                        <Span className="text-sm text-gray-900 block">
                          {selectedSupplier.Address}
                        </Span>
                      )}
                      <Span className="text-sm text-gray-900 block">
                        {[
                          selectedSupplier.City,
                          selectedSupplier.State,
                          selectedSupplier.ZipCode,
                          selectedSupplier.Country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Span>
                    </Container>
                  </Container>
                )}

                {selectedSupplier.Notes && (
                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Notes}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedSupplier.Notes}
                    </Span>
                  </Container>
                )}
              </Container>

              <Container className="md:col-span-2 pt-4 border-t border-gray-200">
                <Container className="text-xs text-gray-500 space-y-1">
                  <Container>
                    Created:{" "}
                    {selectedSupplier.CreatedAt
                      ? new Date(selectedSupplier.CreatedAt).toLocaleDateString()
                      : "N/A"}
                  </Container>
                  {selectedSupplier.UpdatedAt && (
                    <Container>
                      Updated:{" "}
                      {new Date(selectedSupplier.UpdatedAt).toLocaleDateString()}
                    </Container>
                  )}
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
            <Span>{translations["Delete Supplier"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteSupplier}
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
              permanently delete the supplier{" "}
              <strong>"{supplierToDelete?.Name}"</strong>{" "}
              and all associated data.
            </Span>
          </Container>
        }
      />

      {/* Filters Sidebar/Offcanvas */}
      {showFilters && (
        <Container className="fixed inset-0 z-50 overflow-hidden">
          <Container
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowFilters(false)}
          />
          <Container className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <Container className="p-6">
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

              <Container className="space-y-4">
                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.Status}
                  </label>
                  <select
                    value={filterOptions.status}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{translations["All Status"]}</option>
                    <option value="Active">{translations.Active}</option>
                    <option value="Inactive">{translations.Inactive}</option>
                  </select>
                </Container>

                <Container>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
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
                    <option value="CreatedAt">Date Created</option>
                    <option value="Name">Name</option>
                    <option value="ContactPerson">Contact Person</option>
                    <option value="Status">Status</option>
                    <option value="City">City</option>
                    <option value="Country">Country</option>
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
                  onClick={handleApplyFilters}
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
                  onClick={handleClearFilters}
                />
              </Container>
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default SupplierList;