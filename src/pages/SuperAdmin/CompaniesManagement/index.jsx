import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  Building,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Users,
  Calendar,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Table from "../../../components/elements/table/Table";
import { useSuperAdmin } from "../../../Contexts/superAdminApiClient/superAdminApiClient";
import { companiesManagementTranslations } from "../../../translations/CompaniesManagementtranslation";
// import { companiesManagementTranslations } from "./companiesManagementTranslations";

const CompaniesManagement = () => {
  const navigate = useNavigate();
  const { language: currentLanguage } = useSelector((state) => state.language);
  const isArabic = currentLanguage === "ar";
  const t = companiesManagementTranslations[currentLanguage] || companiesManagementTranslations.en;

  const {
    companies,
    companiesPagination,
    getCompanies,
    deleteCompany,
    suspendCompany,
    activateCompany,
    isCompaniesLoading,
    error,
    clearError,
  } = useSuperAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [itemsPerPage] = useState(10);

  // Load companies on component mount and when filters change
  useEffect(() => {
    loadCompanies();
  }, [currentPage, searchTerm, statusFilter, planFilter]);

  const loadCompanies = async () => {
    try {
      await getCompanies(
        currentPage,
        itemsPerPage,
        searchTerm,
        statusFilter === "all" ? "" : statusFilter,
        planFilter
      );
    } catch (error) {
      console.error("Error loading companies:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
    setShowActionDropdown(null);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await deleteCompany(companyToDelete.id);
        setShowDeleteModal(false);
        setCompanyToDelete(null);
        loadCompanies();
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  const handleStatusToggle = async (company) => {
    try {
      if (company.isActive) {
        await suspendCompany(company.id, {
          reason: "Suspended by admin",
          notifyUsers: true,
        });
      } else {
        await activateCompany(company.id);
      }
      setShowActionDropdown(null);
      loadCompanies();
    } catch (error) {
      console.error("Error toggling company status:", error);
    }
  };

  const handleAddCompany = () => {
    navigate("/superadmin/companies/add");
  };

  const handleViewCompany = (companyId) => {
    navigate(`/superadmin/companies/${companyId}`);
    setShowActionDropdown(null);
  };

  const handleEditCompany = (companyId) => {
    navigate(`/superadmin/companies/${companyId}/edit`);
    setShowActionDropdown(null);
  };

  // Pagination calculation
  const totalPages = companiesPagination?.totalPages || 0;
  const totalItems = companiesPagination?.totalCount || 0;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-3 py-2 text-sm font-medium border ${
              number === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } ${number === 1 ? (isArabic ? "rounded-r-md" : "rounded-l-md") : ""} ${
              number === totalPages ? (isArabic ? "rounded-l-md" : "rounded-r-md") : ""
            }`}
          >
            {number}
          </button>
        );
      }
    } else {
      // Complex pagination with ellipsis
      items.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-2 text-sm font-medium border ${isArabic ? "rounded-r-md" : "rounded-l-md"} ${
            1 === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        items.push(
          <span
            key="start-ellipsis"
            className="px-3 py-2 text-sm text-gray-500 border border-gray-300 bg-white"
          >
            ...
          </span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let number = start; number <= end; number++) {
        items.push(
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-3 py-2 text-sm font-medium border ${
              number === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {number}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <span
            key="end-ellipsis"
            className="px-3 py-2 text-sm text-gray-500 border border-gray-300 bg-white"
          >
            ...
          </span>
        );
      }

      if (totalPages > 1) {
        items.push(
          <button
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className={`px-3 py-2 text-sm font-medium border ${isArabic ? "rounded-l-md" : "rounded-r-md"} ${
              totalPages === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    return items;
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building className={`${isArabic ? 'ml-3' : 'mr-3'} text-blue-600`} size={32} />
              {t.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {t.total}: {totalItems}
            </div>
            <button
              onClick={handleAddCompany}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <Plus className={`${isArabic ? 'ml-2' : 'mr-2'}`} size={18} />
              {t.addCompany}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className={`${isArabic ? 'ml-2' : 'mr-2'}`} size={18} />
                <span>{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className={`absolute inset-y-0 ${isArabic ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
                className={`block w-full ${isArabic ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t.allStatus}</option>
                <option value="active">{t.active}</option>
                <option value="inactive">{t.inactive}</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div className="relative">
              <input
                type="text"
                placeholder={t.filterByPlan}
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isCompaniesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className={`${isArabic ? 'mr-3' : 'ml-3'} text-gray-600`}>{t.loadingCompanies}</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        onClick={() => handleSort("name")}
                        className={`px-6 py-3 ${isArabic ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100`}
                      >
                        <div className="flex items-center">
                          {t.companyName}
                          {sortConfig.key === "name" &&
                            (sortConfig.direction === "asc" ? (
                              <ArrowUp className={`${isArabic ? 'mr-1' : 'ml-1'}`} size={14} />
                            ) : (
                              <ArrowDown className={`${isArabic ? 'mr-1' : 'ml-1'}`} size={14} />
                            ))}
                        </div>
                      </th>
                      <th className={`px-6 py-3 ${isArabic ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        {t.contactInfo}
                      </th>
                      <th className={`px-6 py-3 ${isArabic ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        {t.status}
                      </th>
                      <th className={`px-6 py-3 ${isArabic ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        {t.subscription}
                      </th>
                      <th
                        onClick={() => handleSort("userCount")}
                        className={`px-6 py-3 ${isArabic ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100`}
                      >
                        <div className="flex items-center">
                          {t.users}
                          {sortConfig.key === "userCount" &&
                            (sortConfig.direction === "asc" ? (
                              <ArrowUp className={`${isArabic ? 'mr-1' : 'ml-1'}`} size={14} />
                            ) : (
                              <ArrowDown className={`${isArabic ? 'mr-1' : 'ml-1'}`} size={14} />
                            ))}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("createdAt")}
                        className={`px-6 py-3 ${isArabic ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100`}
                      >
                        <div className="flex items-center">
                          {t.created}
                          {sortConfig.key === "createdAt" &&
                            (sortConfig.direction === "asc" ? (
                              <ArrowUp className={`${isArabic ? 'mr-1' : 'ml-1'}`} size={14} />
                            ) : (
                              <ArrowDown className={`${isArabic ? 'mr-1' : 'ml-1'}`} size={14} />
                            ))}
                        </div>
                      </th>
                      <th className={`px-6 py-3 ${isArabic ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        {t.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companies && companies.length > 0 ? (
                      companies.map((company) => (
                        <tr key={company.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`bg-blue-100 rounded-lg p-2 ${isArabic ? 'ml-3' : 'mr-3'}`}>
                                <Building className="text-blue-600" size={20} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {company.Name || t.notAvailable}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {t.id}: {company.Id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center mb-1">
                                <Mail
                                  className={`${isArabic ? 'ml-2' : 'mr-2'} text-gray-400`}
                                  size={14}
                                />
                                {company.Email || t.notAvailable}
                              </div>
                              <div className="flex items-center">
                                <Phone
                                  className={`${isArabic ? 'ml-2' : 'mr-2'} text-gray-400`}
                                  size={14}
                                />
                                {company.Phone || t.notAvailable}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                company.IsActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {company.IsActive ? t.active : t.inactive}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {company.SubscriptionPlan || t.free}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${company.MonthlyRevenue || 0}/{t.month}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className={`${isArabic ? 'ml-2' : 'mr-2'} text-gray-400`} size={14} />
                              <span className="text-sm text-gray-900">
                                {company.UserCount || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar
                                className={`${isArabic ? 'ml-2' : 'mr-2'} text-gray-400`}
                                size={14}
                              />
                              {company.createdAt
                                ? new Date(
                                    company.createdAt
                                  ).toLocaleDateString()
                                : t.notAvailable}
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${isArabic ? 'text-left' : 'text-right'} text-sm font-medium`}>
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setShowActionDropdown(
                                    showActionDropdown === company.id
                                      ? null
                                      : company.id
                                  )
                                }
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {showActionDropdown === company.id && (
                                <div className={`absolute ${isArabic ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200`}>
                                  <div className="py-1">
                                    <button
                                      onClick={() =>
                                        handleViewCompany(company.id)
                                      }
                                      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${isArabic ? 'text-right' : 'text-left'}`}
                                    >
                                      <Eye className={`${isArabic ? 'ml-2' : 'mr-2'}`} size={14} />
                                      {t.viewDetails}
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleEditCompany(company.id)
                                      }
                                      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${isArabic ? 'text-right' : 'text-left'}`}
                                    >
                                      <Edit className={`${isArabic ? 'ml-2' : 'mr-2'}`} size={14} />
                                      {t.editCompany}
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusToggle(company)
                                      }
                                      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${isArabic ? 'text-right' : 'text-left'}`}
                                    >
                                      {company.isActive ? (
                                        <>
                                          <XCircle className={`${isArabic ? 'ml-2' : 'mr-2'}`} size={14} />
                                          {t.suspend}
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle
                                            className={`${isArabic ? 'ml-2' : 'mr-2'}`}
                                            size={14}
                                          />
                                          {t.activate}
                                        </>
                                      )}
                                    </button>
                                    <hr className="my-1" />
                                    <button
                                      onClick={() => handleDeleteClick(company)}
                                      className={`flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full ${isArabic ? 'text-right' : 'text-left'}`}
                                    >
                                      <Trash2 className={`${isArabic ? 'ml-2' : 'mr-2'}`} size={14} />
                                      {t.delete}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <Building
                              size={48}
                              className="mx-auto mb-4 text-gray-300"
                            />
                            <p className="text-lg font-medium">
                              {t.noCompaniesFound}
                            </p>
                            <p className="text-sm">
                              {t.noCompaniesSubtext}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {t.showing} {startItem} {t.to} {endItem} {t.of} {totalItems} {t.results}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 ${isArabic ? 'rounded-r-md' : 'rounded-l-md'} hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {t.first}
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t.previous}
                    </button>

                    {generatePaginationItems()}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t.next}
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 ${isArabic ? 'rounded-l-md' : 'rounded-r-md'} hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {t.last}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                {t.confirmDelete}
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                {t.deleteConfirmation}{" "}
                <strong>{companyToDelete?.name}</strong>? {t.deleteWarning}
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  {t.deleteCompany}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showActionDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionDropdown(null)}
        ></div>
      )}
    </div>
  );
};

export default CompaniesManagement;