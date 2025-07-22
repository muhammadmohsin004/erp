import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Phone,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Building,
  User,
  RefreshCw,
  X,
} from "lucide-react";
import { notification } from "antd";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import OutlineButton from "../../components/elements/elements/buttons/outlineButton/OutlineButton";
import Table from "../../components/elements/table/Table";
import InputField from "../../components/elements/inputField/InputField";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import { useVendor } from "../../Contexts/VendorContext/VendorContext";

const VendorManagement = () => {
  const navigate = useNavigate();
  const {
    vendors,
    loading,
    error,
    pagination,
    filters,
    getVendors,
    getVendor,
    deleteVendor,
    toggleVendorStatus,
    searchVendors,
    filterVendorsByCurrency,
    filterVendorsByCountry,
    filterVendorsByStatus,
    setFilters,
    clearError,
    changePage,
    changePageSize,
    bulkDeleteVendors,
  } = useVendor();

  // Local state
  const [apiNotification, contextHolder] = notification.useNotification();
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Filter options
  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "PKR", label: "PKR - Pakistani Rupee" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
    { value: "JPY", label: "JPY - Japanese Yen" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const countryOptions = [
    { value: "", label: "All Countries" },
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "PK", label: "Pakistan" },
    { value: "IN", label: "India" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "JP", label: "Japan" },
    { value: "CN", label: "China" },
  ];

  // Initialize data
  useEffect(() => {
    getVendors();
  }, []);

  // Handle API errors
  useEffect(() => {
    if (error) {
      showNotification("error", "Error", error);
      clearError();
    }
  }, [error, clearError]);

  // Update selectAll state based on selectedVendors
  useEffect(() => {
    if (vendors && vendors.length > 0) {
      setSelectAll(selectedVendors.length === vendors.length);
    } else {
      setSelectAll(false);
    }
  }, [selectedVendors, vendors]);

  // Show notification
  const showNotification = (type, message, description) => {
    apiNotification[type]({
      message,
      description,
      placement: "bottomRight",
      duration: type === "error" ? 6 : 4,
    });
  };

  // Handle vendor selection
  const handleVendorSelection = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(vendors?.map((vendor) => vendor.Id) || []);
    }
  };

  // Navigation handlers


  const handleEditVendor = async (vendorId) => {
    try {
      const vendorData = await getVendor(vendorId);
      if (vendorData) {
        navigate("/admin/add-vendors", {
          state: {
            editData: vendorData,
            isEditing: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching vendor for edit:", error);
      showNotification("error", "Error", "Failed to fetch vendor details for editing");
    }
  };

  const handleCreateVendor = () => {
    navigate("/admin/add-vendors");
  };

  const handleCloneVendor = async (vendorId) => {
    try {
      const vendorData = await getVendor(vendorId);
      if (vendorData) {
        navigate("/admin/add-vendors", {
          state: {
            cloneData: {
              ...vendorData,
              Name: `${vendorData.Name || "Vendor"} (Copy)`,
              Id: undefined,
              IsDefault: false,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error cloning vendor:", error);
      showNotification("error", "Error", "Failed to clone vendor");
    }
  };

  // Delete handlers
  const handleDeleteVendor = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) {
      setIsDeleting(vendorId);
      try {
        const success = await deleteVendor(vendorId);
        if (success) {
          showNotification("success", "Success", "Vendor deleted successfully");
          setSelectedVendors((prev) => prev.filter((id) => id !== vendorId));
        }
      } catch (err) {
        showNotification("error", "Error", err.message || "Failed to delete vendor");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVendors.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedVendors.length} selected vendor(s)? This action cannot be undone.`)) {
      setIsBulkDeleting(true);
      try {
        const success = await bulkDeleteVendors(selectedVendors);
        if (success) {
          showNotification("success", "Success", `${selectedVendors.length} vendor(s) deleted successfully`);
          setSelectedVendors([]);
        }
      } catch (err) {
        showNotification("error", "Error", err.message || "Failed to delete vendors");
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };

  // Toggle status handler
  const handleToggleStatus = async (vendorId) => {
    setIsTogglingStatus(vendorId);
    try {
      const success = await toggleVendorStatus(vendorId);
      if (success) {
        showNotification("success", "Success", "Vendor status updated successfully");
      }
    } catch (err) {
      showNotification("error", "Error", err.message || "Failed to update vendor status");
    } finally {
      setIsTogglingStatus(null);
    }
  };

  // Filter handlers
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    searchVendors(searchTerm);
  };

  const handleCurrencyFilter = (value) => {
    filterVendorsByCurrency(value);
  };

  const handleCountryFilter = (value) => {
    filterVendorsByCountry(value);
  };

  const handleStatusFilter = (value) => {
    const status = value === "" ? null : value === "true";
    filterVendorsByStatus(status);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      currency: "",
      country: "",
      isActive: null,
      sortBy: "name",
      sortAscending: true,
    });
    getVendors();
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (pagination.pageNumber > 1) {
      changePage(pagination.pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
    if (pagination.pageNumber < totalPages) {
      changePage(pagination.pageNumber + 1);
    }
  };

  const handlePageSizeChange = (value) => {
    changePageSize(Number(value));
  };

  // Format display data
  const formatAddress = (vendor) => {
    const addressParts = [];
    if (vendor.City) addressParts.push(vendor.City);
    if (vendor.State) addressParts.push(vendor.State);
    if (vendor.Country) addressParts.push(vendor.Country);
    return addressParts.join(", ") || "N/A";
  };

  const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);

  return (
    <Container className="p-6 bg-gray-50 min-h-screen">
      {contextHolder}

      {/* Header */}
      <Container className="bg-white shadow-sm rounded-lg mb-6">
        <Container className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
                <Span className="text-sm text-gray-500">
                  {pagination.totalItems || 0} total vendors
                </Span>
              </div>
            </div>

            <div className="flex gap-3">
              <OutlineButton
                buttonText={showFilters ? "Hide Filters" : "Show Filters"}
                onClick={() => setShowFilters(!showFilters)}
                borderColor="border-gray-300"
                borderWidth="border"
                rounded="rounded-lg"
                bgColor={showFilters ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-gray-50"}
                textColor={showFilters ? "text-blue-700" : "text-gray-700"}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                icon={showFilters ? X : Filter}
                iconSize="w-4 h-4"
                isIconLeft={true}
              />
              <FilledButton
                isIcon={true}
                icon={Plus}
                iconSize="w-4 h-4"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText="New Vendor"
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={handleCreateVendor}
              />
            </div>
          </div>
        </Container>

        {/* Filters */}
        {showFilters && (
          <Container className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InputField
                name="search"
                placeholder="Search vendors..."
                type="text"
                value={filters.search || ""}
                onChange={handleSearch}
                label="Search"
                icon={Search}
                disabled={loading}
              />

              <SelectBox
                name="currencyFilter"
                placeholder="All Currencies"
                value={filters.currency || ""}
                handleChange={handleCurrencyFilter}
                optionList={[{ value: "", label: "All Currencies" }, ...currencyOptions]}
                label="Currency"
                disabled={loading}
              />

              <SelectBox
                name="countryFilter"
                placeholder="All Countries"
                value={filters.country || ""}
                handleChange={handleCountryFilter}
                optionList={countryOptions}
                label="Country"
                disabled={loading}
              />

              <SelectBox
                name="statusFilter"
                placeholder="All Status"
                value={filters.isActive === null ? "" : String(filters.isActive)}
                handleChange={handleStatusFilter}
                optionList={statusOptions}
                label="Status"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end mt-4">
              <OutlineButton
                buttonText="Clear Filters"
                onClick={handleClearFilters}
                borderColor="border-blue-600"
                borderWidth="border"
                rounded="rounded-lg"
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                icon={RefreshCw}
                iconSize="w-4 h-4"
                isIconLeft={true}
                disabled={loading}
              />
            </div>
          </Container>
        )}

        {/* Bulk Actions */}
        {selectedVendors.length > 0 && (
          <Container className="px-6 py-3 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Span className="text-sm text-blue-800 font-medium">
                {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''} selected
              </Span>
              <div className="flex gap-2">
                <OutlineButton
                  buttonText={isBulkDeleting ? "Deleting..." : "Delete Selected"}
                  onClick={handleBulkDelete}
                  borderColor="border-red-600"
                  borderWidth="border"
                  rounded="rounded-lg"
                  bgColor="bg-red-600 hover:bg-red-700"
                  textColor="text-white"
                  height="h-8"
                  px="px-3"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  icon={Trash2}
                  iconSize="w-4 h-4"
                  isIconLeft={true}
                  disabled={isBulkDeleting}
                />
              </div>
            </div>
          </Container>
        )}
      </Container>

      {/* Table */}
      <Container className="bg-white shadow-sm rounded-lg">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading vendors...</span>
            </div>
          </div>
        )}

        <Container className="overflow-x-auto">
          <Table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    disabled={!vendors || vendors.length === 0 || loading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!loading && (!vendors || vendors.length === 0) ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Building className="w-12 h-12 text-gray-300" />
                      <div>
                        <Span className="text-lg font-medium text-gray-500">No vendors found</Span>
                        <p className="text-sm text-gray-400 mt-1">
                          {filters.search || filters.currency || filters.country || filters.isActive !== null
                            ? "Try adjusting your filters or search terms"
                            : "Get started by creating your first vendor"}
                        </p>
                      </div>
                      {!filters.search && !filters.currency && !filters.country && filters.isActive === null && (
                        <FilledButton
                          buttonText="Create First Vendor"
                          onClick={handleCreateVendor}
                          bgColor="bg-blue-600 hover:bg-blue-700"
                          textColor="text-white"
                          rounded="rounded-lg"
                          height="h-10"
                          px="px-4"
                          fontWeight="font-medium"
                          fontSize="text-sm"
                          icon={Plus}
                          iconSize="w-4 h-4"
                          isIconLeft={true}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                vendors?.map((vendor) => (
                  <tr key={vendor.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.Id)}
                        onChange={() => handleVendorSelection(vendor.Id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Span className="text-sm font-medium text-gray-900 truncate">
                              {vendor.Name || "Unnamed Vendor"}
                            </Span>
                          </div>
                          {vendor.ContactPerson && (
                            <div className="flex items-center gap-1 mt-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <Span className="text-xs text-gray-600">
                                {vendor.ContactPerson}
                              </Span>
                            </div>
                          )}
                          {vendor.Currency && (
                            <Span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mt-2">
                              {vendor.Currency}
                            </Span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        {vendor.Email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={`mailto:${vendor.Email}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
                            >
                              {vendor.Email}
                            </a>
                          </div>
                        ) : (
                          <Span className="text-sm text-gray-500">No email</Span>
                        )}
                        {vendor.Phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={`tel:${vendor.Phone}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {vendor.Phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-900">
                          <Span className="block">{formatAddress(vendor)}</Span>
                          {vendor.PostalCode && (
                            <Span className="text-xs text-gray-500">{vendor.PostalCode}</Span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {vendor.IsActive ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <Span className="text-sm text-green-600 font-medium">Active</Span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <Span className="text-sm text-red-600 font-medium">Inactive</Span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {/* View Button */}
                        <button
                          onClick={() => handleViewVendor(vendor.Id)}
                          className="flex items-center justify-center h-8 w-8 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900"
                          title="View Vendor"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditVendor(vendor.Id)}
                          className="flex items-center justify-center h-8 w-8 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 text-green-600"
                          title="Edit Vendor"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Clone Button */}
                        <button
                          onClick={() => handleCloneVendor(vendor.Id)}
                          className="flex items-center justify-center h-8 w-8 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600"
                          title="Clone Vendor"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteVendor(vendor.Id)}
                          className={`flex items-center justify-center h-8 w-8 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 ${isDeleting === vendor.Id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          disabled={isDeleting === vendor.Id}
                          title="Delete Vendor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Container>

        {/* Pagination */}
        {vendors && vendors.length > 0 && (
          <Container className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Span className="text-sm text-gray-700">Show</Span>
                <SelectBox
                  name="pageSize"
                  value={pagination.pageSize}
                  handleChange={handlePageSizeChange}
                  optionList={[
                    { value: 10, label: "10" },
                    { value: 25, label: "25" },
                    { value: 50, label: "50" },
                    { value: 100, label: "100" },
                  ]}
                  width="w-20"
                  marginBottom="mb-0"
                  disabled={loading}
                />
                <Span className="text-sm text-gray-700">per page</Span>
              </div>

              <div className="flex items-center gap-4">
                <Span className="text-sm text-gray-700">
                  Showing {((pagination.pageNumber - 1) * pagination.pageSize) + 1} to{" "}
                  {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalItems)} of{" "}
                  {pagination.totalItems} vendors
                </Span>

                <div className="flex items-center gap-2">
                  <OutlineButton
                    buttonText=""
                    onClick={handlePreviousPage}
                    borderColor="border-gray-300"
                    borderWidth="border"
                    rounded="rounded-lg"
                    bgColor="bg-white hover:bg-gray-50"
                    textColor="text-gray-700"
                    height="h-9"
                    width="w-9"
                    icon={ChevronLeft}
                    iconSize="w-4 h-4"
                    disabled={pagination.pageNumber === 1 || loading}
                    title="Previous Page"
                  />

                  <Span className="text-sm text-gray-700 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                    {pagination.pageNumber} of {totalPages}
                  </Span>

                  <OutlineButton
                    buttonText=""
                    onClick={handleNextPage}
                    borderColor="border-gray-300"
                    borderWidth="border"
                    rounded="rounded-lg"
                    bgColor="bg-white hover:bg-gray-50"
                    textColor="text-gray-700"
                    height="h-9"
                    width="w-9"
                    icon={ChevronRight}
                    iconSize="w-4 h-4"
                    disabled={pagination.pageNumber >= totalPages || loading}
                    title="Next Page"
                  />
                </div>
              </div>
            </div>
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default VendorManagement;