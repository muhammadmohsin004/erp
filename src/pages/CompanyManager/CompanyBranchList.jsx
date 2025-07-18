import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  Building,
  MapPin,
  Phone,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  X,
  Calendar,
  Home,
  Globe,
} from "lucide-react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineCopy,
  AiOutlineDelete,
} from "react-icons/ai";
import { useCompanyBranch } from "../../Contexts/CompanyBranchContext/CompanyBranchContext";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Modall from "../../components/elements/modal/Modal";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../components/elements/table/Table";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";

const CompanyBranchList = () => {
  const navigate = useNavigate();
  const language = useSelector((state) => state.language?.language || "en");
  const token = localStorage.getItem("token");

  const translations = {
    //somethings is here
    "Add Branch": language === "ar" ? "إضافة فرع" : "Add Branch",
    "Company Branches": language === "ar" ? "فروع الشركة" : "Company Branches",
    "Clear All": language === "ar" ? "مسح الكل" : "Clear All",
    Search: language === "ar" ? "بحث" : "Search",
    Filters: language === "ar" ? "الفلاتر" : "Filters",
    Export: language === "ar" ? "تصدير" : "Export",
    Selected: language === "ar" ? "محدد" : "Selected",
    Loading: language === "ar" ? "جارٍ التحميل..." : "Loading...",
    "No Branches": language === "ar" ? "لا يوجد فروع" : "No branches found",
    "Branch Name": language === "ar" ? "اسم الفرع" : "Branch Name",
    Address: language === "ar" ? "العنوان" : "Address",
    City: language === "ar" ? "المدينة" : "City",
    State: language === "ar" ? "الولاية" : "State",
    Country: language === "ar" ? "الدولة" : "Country",
    "Phone Number": language === "ar" ? "رقم الهاتف" : "Phone Number",
    "Head Office": language === "ar" ? "المكتب الرئيسي" : "Head Office",
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
    "Delete Branch": language === "ar" ? "حذف الفرع" : "Delete Branch",
    "This action cannot be undone":
      language === "ar"
        ? "لا يمكن التراجع عن هذا الإجراء"
        : "This action cannot be undone",
    Cancel: language === "ar" ? "إلغاء" : "Cancel",
    "Branch Details": language === "ar" ? "تفاصيل الفرع" : "Branch Details",
    Close: language === "ar" ? "إغلاق" : "Close",
    "Apply Filters": language === "ar" ? "تطبيق الفلاتر" : "Apply Filters",
    "No results found":
      language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    "All Status": language === "ar" ? "جميع الحالات" : "All Status",
    "Zip Code": language === "ar" ? "الرمز البريدي" : "Zip Code",
    Yes: language === "ar" ? "نعم" : "Yes",
    No: language === "ar" ? "لا" : "No",
    Branches: language === "ar" ? "الفروع" : "Branches",
  };

  // Get branch context
  const {
    branches,
    loading: branchesLoading,
    error,
    pagination,
    statistics,
    getBranches,
    getBranch,
    deleteBranch,
    searchBranches,
    sortBranches,
    changePage,
    setFilters,
    clearFilters,
  } = useCompanyBranch();

  // Process branches data from API response
  const branchesData = branches?.Data?.$values || [];

  // Local state management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    sortBy: "BranchName",
    sortAscending: true,
  });
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch branches on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getBranches();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token, getBranches]);

  // Handle search when searchTerm changes (with debounce)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        handleSearchBranches();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Handle filters change
  useEffect(() => {
    setSelectedBranches([]);
    setSelectAll(false);
  }, [branchesData]);

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/admin-Login");
  //   }
  // }, [token, navigate]);

  // Search function
  const handleSearchBranches = async () => {
    try {
      if (searchTerm.trim() === "") {
        await getBranches();
      } else {
        await searchBranches(searchTerm);
      }
    } catch (error) {
      console.error("Error searching branches:", error);
    }
  };

  // Branch selection
  const handleBranchSelection = (branchId) => {
    setSelectedBranches((prev) => {
      if (prev.includes(branchId)) {
        return prev.filter((id) => id !== branchId);
      } else {
        return [...prev, branchId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBranches([]);
    } else {
      const branchIds = Array.isArray(branchesData)
        ? branchesData.map((branch) => branch.Id)
        : [];
      setSelectedBranches(branchIds);
    }
    setSelectAll(!selectAll);
  };

  // Branch actions
  const handleViewBranch = async (branchId) => {
    try {
      const branchData = await getBranch(branchId);
      if (branchData) {
        setSelectedBranch(branchData);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching branch details:", error);
      alert("Failed to fetch branch details");
    }
  };

  const handleEditBranch = async (branchId) => {
    try {
      const branchData = await getBranch(branchId);
      if (branchData) {
        navigate("/admin/company-branches/new", {
          state: {
            editData: branchData,
            isEditing: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching branch for edit:", error);
      alert("Failed to fetch branch details for editing");
    }
  };

  const handleCloneBranch = async (branchId) => {
    try {
      const branchData = await getBranch(branchId);
      if (branchData) {
        navigate("/admin/company-branches/new", {
          state: {
            cloneData: {
              ...branchData,
              BranchName: `${branchData.BranchName || ""} (Copy)`,
              Id: undefined,
              IsHeadOffice: false, // Clone should not be head office
            },
          },
        });
      }
    } catch (error) {
      console.error("Error cloning branch:", error);
      alert("Failed to clone branch");
    }
  };

  const handleDeleteBranch = (branchId) => {
    const branch = Array.isArray(branchesData)
      ? branchesData.find((b) => b.Id === branchId)
      : null;
    if (branch) {
      setBranchToDelete(branch);
      setShowDeleteModal(true);
    } else {
      alert("Branch not found");
    }
  };

  const confirmDeleteBranch = async () => {
    if (!branchToDelete) return;

    setIsDeleting(true);
    try {
      await deleteBranch(branchToDelete.Id);
      setShowDeleteModal(false);
      setBranchToDelete(null);
      // Refresh the branch list
      await getBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
      alert("Failed to delete branch");
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
      if (filterOptions.sortBy) {
        await sortBranches(filterOptions.sortBy, filterOptions.sortAscending);
      }
      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm("");
    setFilterOptions({
      sortBy: "BranchName",
      sortAscending: true,
    });
    setShowFilters(false);

    try {
      await clearFilters();
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  // Export functionality
  const handleExport = () => {
    console.log(
      "Export branches:",
      selectedBranches.length > 0 ? selectedBranches : "all"
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
        <Span className="text-blue-500 text-lg">{translations.Loading}</Span>
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
              {translations["Company Branches"]}
            </h1>
            {selectedBranches.length > 0 && (
              <Span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedBranches.length} {translations.Selected}
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
              buttonText={translations["Add Branch"]}
              height="h-10"
              px="px-4"
              fontWeight="font-medium"
              fontSize="text-sm"
              isIconLeft={true}
              onClick={() => navigate("/admin/company-branches/new")}
            />
          </Container>
        </Container>

        {/* Statistics Cards */}
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={`${translations.Total} ${translations.Branches}`}
            value={statistics?.totalBranches || 0}
            icon={Building}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title={translations.Active}
            value={statistics?.activeBranches || 0}
            icon={Settings}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            title={translations["Head Office"]}
            value={statistics?.headOfficeBranches || 0}
            icon={Home}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            title={translations["This Month"]}
            value={statistics?.branchesThisMonth || 0}
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

        {/* Branch Table */}
        <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
          {branchesLoading ? (
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
                onClick={() => getBranches()}
              />
            </Container>
          ) : !Array.isArray(branchesData) || branchesData.length === 0 ? (
            <Container className="text-center py-12">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm
                  ? translations["No results found"]
                  : translations["No Branches"]}
              </h3>
              {searchTerm && (
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
                        {translations["Branch Name"]}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        {translations.City}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        {translations.Country}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        {translations["Phone Number"]}
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
                    {branchesData.map((branch) => (
                      <tr key={branch.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedBranches.includes(branch.Id)}
                            onChange={() => handleBranchSelection(branch.Id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Container>
                            <Container className="flex items-center gap-2">
                              <Span className="text-sm font-medium text-gray-900">
                                {branch.BranchName || "N/A"}
                              </Span>
                              {branch.IsHeadOffice && (
                                <Span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <Home className="w-3 h-3 mr-1" />
                                  HQ
                                </Span>
                              )}
                            </Container>
                            {branch.Address && (
                              <Span className="text-sm text-gray-500 block truncate max-w-xs">
                                {branch.Address}
                              </Span>
                            )}
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Container className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {branch.City || "-"}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <Container className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-gray-400" />
                            <Span className="text-sm text-gray-900">
                              {branch.Country || "-"}
                            </Span>
                          </Container>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          {branch.PhoneNumber ? (
                            <Container className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <Span className="text-sm text-gray-900">
                                {branch.PhoneNumber}
                              </Span>
                            </Container>
                          ) : (
                            <Span className="text-sm text-gray-500">-</Span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              branch.IsActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {branch.IsActive
                              ? translations.Active
                              : translations.Inactive}
                          </Span>
                        </td>
                        <td className="px-6 py-4">
                          <Container className="flex justify-center gap-1">
                            {/* View Button */}
                            <button
                              onClick={() => handleViewBranch(branch.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              title={translations.View}
                            >
                              <AiOutlineEye className="w-3 h-3" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditBranch(branch.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                              title={translations.Edit}
                            >
                              <AiOutlineEdit className="w-3 h-3" />
                            </button>

                            {/* Clone Button */}
                            <button
                              onClick={() => handleCloneBranch(branch.Id)}
                              className="inline-flex items-center justify-center w-7 h-7 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                              title={translations.Clone}
                            >
                              <AiOutlineCopy className="w-3 h-3" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteBranch(branch.Id)}
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
              {pagination &&
                pagination.TotalPages &&
                pagination.TotalPages > 1 && (
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
                        disabled={!pagination.HasPreviousPage}
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
                        disabled={!pagination.HasPreviousPage}
                        onClick={() =>
                          handlePageChange(pagination.PageNumber - 1)
                        }
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
                        disabled={!pagination.HasNextPage}
                        onClick={() =>
                          handlePageChange(pagination.PageNumber + 1)
                        }
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
                        disabled={!pagination.HasNextPage}
                        onClick={() => handlePageChange(pagination.TotalPages)}
                      />
                    </Container>
                  </Container>
                )}
            </>
          )}
        </Container>
      </Container>

      {/* View Branch Modal */}
      <Modall
        modalOpen={showViewModal}
        setModalOpen={setShowViewModal}
        title={
          <Container className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <Span>{translations["Branch Details"]}</Span>
          </Container>
        }
        width={900}
        okText={translations.Edit}
        cancelText={translations.Close}
        okAction={() => {
          setShowViewModal(false);
          handleEditBranch(selectedBranch?.Id);
        }}
        cancelAction={() => setShowViewModal(false)}
        body={
          selectedBranch && (
            <Container className="max-h-96 overflow-y-auto">
              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Branch Name"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedBranch.BranchName || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Address}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedBranch.Address || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.City}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedBranch.City || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.State}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedBranch.State || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Country}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedBranch.Country || "N/A"}
                    </Span>
                  </Container>
                </Container>

                {/* Contact & Status Information */}
                <Container className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Contact & Status
                  </h3>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Zip Code"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedBranch.ZipCode || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Phone Number"]}
                    </Span>
                    <Span className="text-sm text-gray-900 block mt-1">
                      {selectedBranch.PhoneNumber || "N/A"}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations["Head Office"]}
                    </Span>
                    <Span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                        selectedBranch.IsHeadOffice
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedBranch.IsHeadOffice
                        ? translations.Yes
                        : translations.No}
                    </Span>
                  </Container>

                  <Container>
                    <Span className="text-sm font-medium text-gray-500">
                      {translations.Status}
                    </Span>
                    <Span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                        selectedBranch.IsActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedBranch.IsActive
                        ? translations.Active
                        : translations.Inactive}
                    </Span>
                  </Container>
                </Container>
              </Container>

              {/* Additional Information */}
              <Container className="mt-6 pt-4 border-t border-gray-200">
                <Container className="text-xs text-gray-500 space-y-1">
                  <Container>
                    Created:{" "}
                    {selectedBranch.CreatedAt
                      ? new Date(selectedBranch.CreatedAt).toLocaleDateString()
                      : "N/A"}
                  </Container>
                  {selectedBranch.UpdatedAt && (
                    <Container>
                      Updated:{" "}
                      {new Date(selectedBranch.UpdatedAt).toLocaleDateString()}
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
            <Span>{translations["Delete Branch"]}</Span>
          </Container>
        }
        width={500}
        okText={translations.Delete}
        cancelText={translations.Cancel}
        okAction={confirmDeleteBranch}
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
              <strong>"{branchToDelete?.BranchName}"</strong> and all associated
              data.
            </Span>
          </Container>
        }
      />

      {/* Filters Sidebar/Offcanvas */}
      {showFilters && (
        <Container className="fixed inset-0 z-50 overflow-hidden">
          <Container
            className="absolute inset-0 "
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
                    <option value="BranchName">Branch Name</option>
                    <option value="City">City</option>
                    <option value="Country">Country</option>
                    <option value="CreatedAt">Date Created</option>
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

export default CompanyBranchList;
