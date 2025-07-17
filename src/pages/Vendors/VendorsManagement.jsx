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
  Mail,
  Building,
  Calendar,
  User,
  ArrowLeft,
  Save,
  Filter,
  Search,
  X,
} from "lucide-react";
import Container from "../../components/elements/container/Container";
import Span from "../../components/elements/span/Span";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import OutlineButton from "../../components/elements/elements/buttons/outlineButton/OutlineButton";
import Table from "../../components/elements/table/Table";
import { useVendor } from "../../Contexts/VendorContext/VendorContext";
import Modall from "../../components/elements/modal/Modal";
import InputField from "../../components/elements/inputField/InputField";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import { notification } from "antd";

const VendorManagement = () => {
  const navigate = useNavigate();
  const {
    vendors,
    currentVendor,
    loading,
    error,
    pagination,
    filters,
    getVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    toggleVendorStatus,
    searchVendors,
    filterVendorsByCurrency,
    filterVendorsByCountry,
    filterVendorsByStatus,
    filterVendorsByDateRange,
    sortVendors,
    changePage,
    changePageSize,
    setFilters,
    clearError,
    resetState,
  } = useVendor();

  // State for modals and forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiNotification, contextHolder] = notification.useNotification();

  // Form state - Updated to match API expected format
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    currency: "USD",
    paymentTerms: "",
    contactPerson: "",
    taxNumber: "",
    bankDetails: "",
    isActive: true,
    description: "",
  });

  // Translations
  const translations = {
    Vendors: "Vendors",
    "New Vendor": "New Vendor",
    "Edit Vendor": "Edit Vendor",
    "View Vendor": "View Vendor",
    "Vendor Details": "Vendor Details",
    Name: "Name",
    Code: "Code",
    Email: "Email",
    Phone: "Phone",
    Address: "Address",
    City: "City",
    State: "State",
    Country: "Country",
    "Postal Code": "Postal Code",
    Currency: "Currency",
    "Payment Terms": "Payment Terms",
    "Contact Person": "Contact Person",
    "Tax Number": "Tax Number",
    "Bank Details": "Bank Details",
    Status: "Status",
    Active: "Active",
    Inactive: "Inactive",
    Description: "Description",
    Actions: "Actions",
    View: "View",
    Edit: "Edit",
    Delete: "Delete",
    Clone: "Clone",
    Toggle: "Toggle",
    Save: "Save",
    Cancel: "Cancel",
    Close: "Close",
    Search: "Search",
    Filters: "Filters",
    "Clear All": "Clear All",
    Apply: "Apply",
    "Select All": "Select All",
    "Delete Selected": "Delete Selected",
    Export: "Export",
    Import: "Import",
    Created: "Created",
    Updated: "Updated",
    Loading: "Loading",
    "No vendors found": "No vendors found",
    "Are you sure you want to delete this vendor?":
      "Are you sure you want to delete this vendor?",
    "Are you sure you want to delete selected vendors?":
      "Are you sure you want to delete selected vendors?",
    Success: "Success",
    Error: "Error",
    "Vendor created successfully": "Vendor created successfully",
    "Vendor updated successfully": "Vendor updated successfully",
    "Vendor deleted successfully": "Vendor deleted successfully",
    "Status toggled successfully": "Status toggled successfully",
    "Required field": "This field is required",
    "Invalid email": "Please enter a valid email address",
  };

  // Currency options
  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "PKR", label: "PKR" },
  ];

  // Status options
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  // Initialize data
  useEffect(() => {
    getVendors();
  }, []);

  // Show notification
  const showNotification = (type, message, description) => {
    apiNotification[type]({
      message,
      description,
      placement: "bottomRight",
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle select box changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user selects
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = translations["Required field"];
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = translations["Invalid email"];
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle vendor selection
  const handleVendorSelection = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(vendors?.Data?.map((vendor) => vendor.id) || []);
    }
    setSelectAll(!selectAll);
  };

  // Handle view vendor
  const handleViewVendor = async (vendorId) => {
    try {
      const vendor = await getVendor(vendorId);
      if (vendor) {
        setSelectedVendor(vendor);
        setShowViewModal(true);
      }
    } catch (err) {
      showNotification("error", translations.Error, err.message);
    }
  };

  const handleOpenCreateModal = () => {
    resetFormData();
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetFormData();
  };

  // Handle edit vendor
  const handleEditVendor = async (vendorId) => {
    try {
      const vendor = await getVendor(vendorId);
      if (vendor) {
        setSelectedVendor(vendor);
        setFormData({
          name: vendor.name || "",
          code: vendor.code || "",
          email: vendor.email || "",
          phone: vendor.phone || "",
          address: vendor.address || "",
          city: vendor.city || "",
          state: vendor.state || "",
          country: vendor.country || "",
          postalCode: vendor.postalCode || "",
          currency: vendor.currency || "USD",
          paymentTerms: vendor.paymentTerms || "",
          contactPerson: vendor.contactPerson || "",
          taxNumber: vendor.taxNumber || "",
          bankDetails: vendor.bankDetails || "",
          isActive: vendor.isActive !== undefined ? vendor.isActive : true,
          description: vendor.description || "",
        });
        setShowEditModal(true);
      }
    } catch (err) {
      showNotification("error", translations.Error, err.message);
    }
  };

  // Handle clone vendor
  const handleCloneVendor = async (vendorId) => {
    try {
      const vendor = await getVendor(vendorId);
      if (vendor) {
        setFormData({
          name: `${vendor.name} (Copy)` || "",
          code: `${vendor.code}_COPY` || "",
          email: vendor.email || "",
          phone: vendor.phone || "",
          address: vendor.address || "",
          city: vendor.city || "",
          state: vendor.state || "",
          country: vendor.country || "",
          postalCode: vendor.postalCode || "",
          currency: vendor.currency || "USD",
          paymentTerms: vendor.paymentTerms || "",
          contactPerson: vendor.contactPerson || "",
          taxNumber: vendor.taxNumber || "",
          bankDetails: vendor.bankDetails || "",
          isActive: true,
          description: vendor.description || "",
        });
        setShowCreateModal(true);
      }
    } catch (err) {
      showNotification("error", translations.Error, err.message);
    }
  };

  // Handle delete vendor
  const handleDeleteVendor = async (vendorId) => {
    if (
      window.confirm(
        translations["Are you sure you want to delete this vendor?"]
      )
    ) {
      setIsDeleting(vendorId);
      try {
        const success = await deleteVendor(vendorId);
        if (success) {
          showNotification(
            "success",
            translations.Success,
            translations["Vendor deleted successfully"]
          );
        }
      } catch (err) {
        showNotification("error", translations.Error, err.message);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (vendorId) => {
    setIsTogglingStatus(vendorId);
    try {
      const success = await toggleVendorStatus(vendorId);
      if (success) {
        showNotification(
          "success",
          translations.Success,
          translations["Status toggled successfully"]
        );
      }
    } catch (err) {
      showNotification("error", translations.Error, err.message);
    } finally {
      setIsTogglingStatus(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (selectedVendor) {
        // Update existing vendor
        const success = await updateVendor(selectedVendor.id, formData);
        if (success) {
          setShowEditModal(false);
          setSelectedVendor(null);
          resetFormData();
          showNotification(
            "success",
            translations.Success,
            translations["Vendor updated successfully"]
          );
        }
      } else {
        // Create new vendor
        const success = await createVendor(formData);
        if (success) {
          setShowCreateModal(false);
          resetFormData();
          showNotification(
            "success",
            translations.Success,
            translations["Vendor created successfully"]
          );
        }
      }
    } catch (err) {
      showNotification("error", translations.Error, err.message);
    }
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      code: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      currency: "USD",
      paymentTerms: "",
      contactPerson: "",
      taxNumber: "",
      bankDetails: "",
      isActive: true,
      description: "",
    });
    setFormErrors({});
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    searchVendors(searchTerm);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      currency: "",
      country: "",
      isActive: null,
      startDate: null,
      endDate: null,
      sortBy: "name",
      sortAscending: true,
    });
    getVendors();
  };

  // Get vendors data
  const vendorsData = vendors?.Data || [];

  // Render vendor form
  const renderVendorForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6" id="vendor-form">
      {contextHolder}
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Container className="space-y-4">
          <InputField
            name="name"
            placeholder="Enter vendor name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            label={`${translations.Name} *`}
            width="w-full"
            marginBottom="mb-0"
            error={formErrors.name}
          />

          <InputField
            name="code"
            placeholder="Enter vendor code"
            type="text"
            value={formData.code}
            onChange={handleInputChange}
            label={translations.Code}
            width="w-full"
            marginBottom="mb-0"
          />

          <InputField
            name="email"
            placeholder="Enter email address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            label={translations.Email}
            width="w-full"
            marginBottom="mb-0"
            error={formErrors.email}
          />

          <InputField
            name="phone"
            placeholder="Enter phone number"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            label={translations.Phone}
            width="w-full"
            marginBottom="mb-0"
          />

          <InputField
            name="contactPerson"
            placeholder="Enter contact person name"
            type="text"
            value={formData.contactPerson}
            onChange={handleInputChange}
            label={translations["Contact Person"]}
            width="w-full"
            marginBottom="mb-0"
          />

          <SelectBox
            name="currency"
            placeholder="Select currency"
            value={formData.currency}
            handleChange={(value) => handleSelectChange("currency", value)}
            optionList={currencyOptions}
            label={translations.Currency}
            width="w-full"
            marginBottom="mb-0"
          />
        </Container>

        <Container className="space-y-4">
          <InputField
            name="address"
            placeholder="Enter address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            label={translations.Address}
            width="w-full"
            marginBottom="mb-0"
            isTextArea={true}
            rows={3}
          />

          <Container className="grid grid-cols-2 gap-4">
            <InputField
              name="city"
              placeholder="Enter city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              label={translations.City}
              width="w-full"
              marginBottom="mb-0"
            />

            <InputField
              name="state"
              placeholder="Enter state"
              type="text"
              value={formData.state}
              onChange={handleInputChange}
              label={translations.State}
              width="w-full"
              marginBottom="mb-0"
            />
          </Container>

          <Container className="grid grid-cols-2 gap-4">
            <InputField
              name="country"
              placeholder="Enter country"
              type="text"
              value={formData.country}
              onChange={handleInputChange}
              label={translations.Country}
              width="w-full"
              marginBottom="mb-0"
            />

            <InputField
              name="postalCode"
              placeholder="Enter postal code"
              type="text"
              value={formData.postalCode}
              onChange={handleInputChange}
              label={translations["Postal Code"]}
              width="w-full"
              marginBottom="mb-0"
            />
          </Container>

          <InputField
            name="paymentTerms"
            placeholder="Enter payment terms"
            type="text"
            value={formData.paymentTerms}
            onChange={handleInputChange}
            label={translations["Payment Terms"]}
            width="w-full"
            marginBottom="mb-0"
          />

          <InputField
            name="taxNumber"
            placeholder="Enter tax number"
            type="text"
            value={formData.taxNumber}
            onChange={handleInputChange}
            label={translations["Tax Number"]}
            width="w-full"
            marginBottom="mb-0"
          />

          <InputField
            name="bankDetails"
            placeholder="Enter bank details"
            type="text"
            value={formData.bankDetails}
            onChange={handleInputChange}
            label={translations["Bank Details"]}
            width="w-full"
            marginBottom="mb-0"
            isTextArea={true}
            rows={3}
          />
        </Container>
      </Container>

      <InputField
        name="description"
        placeholder="Enter description"
        type="text"
        value={formData.description}
        onChange={handleInputChange}
        label={translations.Description}
        width="w-full"
        marginBottom="mb-0"
        isTextArea={true}
        rows={3}
      />

      <Container className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleInputChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 text-sm text-gray-700">
          {translations.Active}
        </label>
      </Container>
    </form>
  );

  return (
    <Container className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Container className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <Container className="px-6 py-4 border-b border-gray-200">
          <Container className="flex items-center justify-between">
            <Container className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {translations.Vendors}
              </h1>
              <Span className="text-sm text-gray-500">
                {pagination.totalItems} total vendors
              </Span>
            </Container>
            <Container className="flex gap-3">
              <OutlineButton
                buttonText={translations.Filters}
                onClick={() => setShowFilters(!showFilters)}
                borderColor="border-gray-300"
                borderWidth="border"
                rounded="rounded-lg"
                bgColor="bg-white"
                textColor="text-gray-700"
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                icon={Filter}
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
                buttonText={translations["New Vendor"]}
                height="h-10"
                px="px-4"
                fontWeight="font-medium"
                fontSize="text-sm"
                isIconLeft={true}
                onClick={handleOpenCreateModal}
              />
            </Container>
          </Container>
        </Container>

        {/* Filters */}
        {showFilters && (
          <Container className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <Container className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Container>
                <InputField
                  name="search"
                  placeholder="Search vendors..."
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  label={translations.Search}
                  width="w-full"
                  marginBottom="mb-0"
                />
              </Container>

              <Container>
                <SelectBox
                  name="currencyFilter"
                  placeholder="All Currencies"
                  value={filters.currency}
                  handleChange={(value) => filterVendorsByCurrency(value)}
                  optionList={[
                    { value: "", label: "All Currencies" },
                    ...currencyOptions,
                  ]}
                  label={translations.Currency}
                  width="w-full"
                  marginBottom="mb-0"
                />
              </Container>

              <Container>
                <InputField
                  name="countryFilter"
                  placeholder="Filter by country..."
                  type="text"
                  value={filters.country}
                  onChange={(e) => filterVendorsByCountry(e.target.value)}
                  label={translations.Country}
                  width="w-full"
                  marginBottom="mb-0"
                />
              </Container>

              <Container>
                <SelectBox
                  name="statusFilter"
                  placeholder="All Status"
                  value={
                    filters.isActive === null ? "" : String(filters.isActive)
                  }
                  handleChange={(value) =>
                    filterVendorsByStatus(
                      value === "" ? null : value === "true"
                    )
                  }
                  optionList={statusOptions}
                  label={translations.Status}
                  width="w-full"
                  marginBottom="mb-0"
                />
              </Container>
            </Container>

            <Container className="flex justify-end mt-4">
              <OutlineButton
                buttonText={translations["Clear All"]}
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
              />
            </Container>
          </Container>
        )}

        {/* Bulk Actions */}
        {selectedVendors.length > 0 && (
          <Container className="px-6 py-3 bg-blue-50 border-b border-gray-200">
            <Container className="flex items-center justify-between">
              <Span className="text-sm text-blue-800">
                {selectedVendors.length} vendors selected
              </Span>
              <Container className="flex gap-2">
                <OutlineButton
                  buttonText={translations["Delete Selected"]}
                  onClick={() => {
                    if (
                      window.confirm(
                        translations[
                          "Are you sure you want to delete selected vendors?"
                        ]
                      )
                    ) {
                      // Handle bulk delete
                      selectedVendors.forEach((id) => deleteVendor(id));
                      setSelectedVendors([]);
                    }
                  }}
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
                />
              </Container>
            </Container>
          </Container>
        )}
      </Container>

      {/* Table */}
      <Container className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  {translations.Code}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  {translations["Contact Person"]}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  {translations.Address}
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <Span className="text-gray-500">
                      {translations.Loading}...
                    </Span>
                  </td>
                </tr>
              ) : vendorsData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <Span className="text-gray-500">
                      {translations["No vendors found"]}
                    </Span>
                  </td>
                </tr>
              ) : (
                vendorsData.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => handleVendorSelection(vendor.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Container>
                        <Container className="flex items-center gap-2">
                          <Span className="text-sm font-medium text-gray-900">
                            {vendor.name || "N/A"}
                          </Span>
                        </Container>
                        {vendor.email && (
                          <a
                            href={`mailto:${vendor.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {vendor.email}
                          </a>
                        )}
                      </Container>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Span className="text-sm text-gray-900">
                        {vendor.code || "-"}
                      </Span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <Container>
                        {vendor.contactPerson ? (
                          <Container>
                            <Span className="text-sm text-gray-900 block">
                              {vendor.contactPerson}
                            </Span>
                            {vendor.phone && (
                              <a
                                href={`tel:${vendor.phone}`}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                {vendor.phone}
                              </a>
                            )}
                          </Container>
                        ) : (
                          <Span className="text-sm text-gray-500">-</Span>
                        )}
                      </Container>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      {vendor.address || vendor.city ? (
                        <Container className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                          <Container className="text-sm text-gray-900">
                            {vendor.address && (
                              <>
                                <Span className="block"></Span>
                                <Span className="block">{vendor.address}</Span>
                              </>
                            )}
                            {vendor.city && (
                              <Span className="block text-gray-600">
                                {vendor.city}
                                {vendor.state && `, ${vendor.state}`}
                              </Span>
                            )}
                          </Container>
                        </Container>
                      ) : (
                        <Span className="text-sm text-gray-500">-</Span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Container className="flex items-center">
                        {vendor.isActive ? (
                          <Container className="flex items-center gap-2">
                            <Container className="w-2 h-2 bg-green-500 rounded-full"></Container>
                            <Span className="text-sm text-green-600 font-medium">
                              {translations.Active}
                            </Span>
                          </Container>
                        ) : (
                          <Container className="flex items-center gap-2">
                            <Container className="w-2 h-2 bg-red-500 rounded-full"></Container>
                            <Span className="text-sm text-red-600 font-medium">
                              {translations.Inactive}
                            </Span>
                          </Container>
                        )}
                      </Container>
                    </td>
                    <td className="px-6 py-4">
                      <Container className="flex items-center justify-center gap-2">
                        <OutlineButton
                          buttonText=""
                          onClick={() => handleViewVendor(vendor.id)}
                          borderColor="border-blue-200"
                          borderWidth="border"
                          rounded="rounded-lg"
                          bgColor="bg-blue-50 hover:bg-blue-100"
                          textColor="text-blue-600"
                          height="h-8"
                          width="w-8"
                          icon={Eye}
                          iconSize="w-4 h-4"
                          title={translations.View}
                        />
                        <OutlineButton
                          buttonText=""
                          onClick={() => handleEditVendor(vendor.id)}
                          borderColor="border-green-200"
                          borderWidth="border"
                          rounded="rounded-lg"
                          bgColor="bg-green-50 hover:bg-green-100"
                          textColor="text-green-600"
                          height="h-8"
                          width="w-8"
                          icon={Edit}
                          iconSize="w-4 h-4"
                          title={translations.Edit}
                        />
                        <OutlineButton
                          buttonText=""
                          onClick={() => handleCloneVendor(vendor.id)}
                          borderColor="border-purple-200"
                          borderWidth="border"
                          rounded="rounded-lg"
                          bgColor="bg-purple-50 hover:bg-purple-100"
                          textColor="text-purple-600"
                          height="h-8"
                          width="w-8"
                          icon={Copy}
                          iconSize="w-4 h-4"
                          title={translations.Clone}
                        />
                        <OutlineButton
                          buttonText=""
                          onClick={() => handleToggleStatus(vendor.id)}
                          borderColor={
                            vendor.isActive
                              ? "border-orange-200"
                              : "border-gray-200"
                          }
                          borderWidth="border"
                          rounded="rounded-lg"
                          bgColor={
                            vendor.isActive
                              ? "bg-orange-50 hover:bg-orange-100"
                              : "bg-gray-50 hover:bg-gray-100"
                          }
                          textColor={
                            vendor.isActive
                              ? "text-orange-600"
                              : "text-gray-600"
                          }
                          height="h-8"
                          width="w-8"
                          icon={vendor.isActive ? ToggleRight : ToggleLeft}
                          iconSize="w-4 h-4"
                          disabled={isTogglingStatus === vendor.id}
                          title={translations.Toggle}
                        />
                        <OutlineButton
                          buttonText=""
                          onClick={() => handleDeleteVendor(vendor.id)}
                          borderColor="border-red-200"
                          borderWidth="border"
                          rounded="rounded-lg"
                          bgColor="bg-red-50 hover:bg-red-100"
                          textColor="text-red-600"
                          height="h-8"
                          width="w-8"
                          icon={Trash2}
                          iconSize="w-4 h-4"
                          disabled={isDeleting === vendor.id}
                          title={translations.Delete}
                        />
                      </Container>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Container>

        {/* Pagination */}
        <Container className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <Container className="flex items-center justify-between">
            <Span className="text-sm text-gray-700">
              Showing{" "}
              {pagination.pageNumber * pagination.pageSize -
                pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                pagination.pageNumber * pagination.pageSize,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} results
            </Span>
            <Container className="flex items-center gap-2">
              <SelectBox
                name="pageSize"
                value={pagination.pageSize}
                handleChange={(value) => changePageSize(Number(value))}
                optionList={[
                  { value: 10, label: "10" },
                  { value: 25, label: "25" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                ]}
                width="w-20"
                marginBottom="mb-0"
              />
              <Container className="flex gap-1">
                <OutlineButton
                  buttonText="Previous"
                  onClick={() => changePage(pagination.pageNumber - 1)}
                  borderColor="border-gray-300"
                  borderWidth="border"
                  rounded="rounded-lg"
                  bgColor="bg-white hover:bg-gray-50"
                  textColor="text-gray-700"
                  height="h-8"
                  px="px-3"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  disabled={pagination.pageNumber === 1}
                />
                <OutlineButton
                  buttonText="Next"
                  onClick={() => changePage(pagination.pageNumber + 1)}
                  borderColor="border-gray-300"
                  borderWidth="border"
                  rounded="rounded-lg"
                  bgColor="bg-white hover:bg-gray-50"
                  textColor="text-gray-700"
                  height="h-8"
                  px="px-3"
                  fontWeight="font-medium"
                  fontSize="text-sm"
                  disabled={
                    pagination.pageNumber >=
                    Math.ceil(pagination.totalItems / pagination.pageSize)
                  }
                />
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Create Vendor Modal */}
      <Modall
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title={translations["New Vendor"]}
        size="lg"
        body={renderVendorForm()}
        okText={translations.Save}
        cancelText={translations.Cancel}
        okAction={handleSubmit}
        cancelAction={handleCloseCreateModal}
        okButtonDisabled={loading}
      />

      {/* Edit Vendor Modal */}
      <Modall
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedVendor(null);
          resetFormData();
        }}
        title={translations["Edit Vendor"]}
        size="lg"
        body={renderVendorForm()}
        okText={translations.Save}
        cancelText={translations.Cancel}
        okAction={handleSubmit}
        cancelAction={() => {
          setShowEditModal(false);
          setSelectedVendor(null);
          resetFormData();
        }}
        okButtonDisabled={loading}
      />

      {/* View Vendor Modal */}
      <Modall
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedVendor(null);
        }}
        title={translations["Vendor Details"]}
        size="lg"
        okText={translations.Close}
        cancelText={null}
        okAction={() => {
          setShowViewModal(false);
          setSelectedVendor(null);
        }}
        body={
          selectedVendor && (
            <Container className="space-y-6">
              <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Container className="space-y-4">
                  <Container className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <Container>
                      <Span className="text-sm font-medium text-gray-900 block">
                        {selectedVendor.name || "N/A"}
                      </Span>
                      <Span className="text-xs text-gray-500">
                        {translations.Name}
                      </Span>
                    </Container>
                  </Container>

                  {selectedVendor.code && (
                    <Container className="flex items-center gap-3">
                      <Container className="w-5 h-5 flex items-center justify-center">
                        <Span className="text-xs font-bold text-gray-400">
                          #
                        </Span>
                      </Container>
                      <Container>
                        <Span className="text-sm font-medium text-gray-900 block">
                          {selectedVendor.code}
                        </Span>
                        <Span className="text-xs text-gray-500">
                          {translations.Code}
                        </Span>
                      </Container>
                    </Container>
                  )}

                  {selectedVendor.email && (
                    <Container className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <Container>
                        <a
                          href={`mailto:${selectedVendor.email}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 block"
                        >
                          {selectedVendor.email}
                        </a>
                        <Span className="text-xs text-gray-500">
                          {translations.Email}
                        </Span>
                      </Container>
                    </Container>
                  )}

                  {selectedVendor.phone && (
                    <Container className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <Container>
                        <a
                          href={`tel:${selectedVendor.phone}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 block"
                        >
                          {selectedVendor.phone}
                        </a>
                        <Span className="text-xs text-gray-500">
                          {translations.Phone}
                        </Span>
                      </Container>
                    </Container>
                  )}

                  {selectedVendor.contactPerson && (
                    <Container className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <Container>
                        <Span className="text-sm font-medium text-gray-900 block">
                          {selectedVendor.contactPerson}
                        </Span>
                        <Span className="text-xs text-gray-500">
                          {translations["Contact Person"]}
                        </Span>
                      </Container>
                    </Container>
                  )}

                  {selectedVendor.currency && (
                    <Container className="flex items-center gap-3">
                      <Container className="w-5 h-5 flex items-center justify-center">
                        <Span className="text-xs font-bold text-gray-400">
                          $
                        </Span>
                      </Container>
                      <Container>
                        <Span className="text-sm font-medium text-gray-900 block">
                          {selectedVendor.currency}
                        </Span>
                        <Span className="text-xs text-gray-500">
                          {translations.Currency}
                        </Span>
                      </Container>
                    </Container>
                  )}
                </Container>

                <Container className="space-y-4">
                  {(selectedVendor.address || selectedVendor.city) && (
                    <Container className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <Container>
                        <Container className="text-sm font-medium text-gray-900">
                          {selectedVendor.address && (
                            <Span className="block">
                              {selectedVendor.address}
                            </Span>
                          )}
                          {selectedVendor.city && (
                            <Span className="block">
                              {selectedVendor.city}
                              {selectedVendor.state &&
                                `, ${selectedVendor.state}`}
                              {selectedVendor.postalCode &&
                                ` ${selectedVendor.postalCode}`}
                            </Span>
                          )}
                          {selectedVendor.country && (
                            <Span className="block text-gray-600">
                              {selectedVendor.country}
                            </Span>
                          )}
                        </Container>
                        <Span className="text-xs text-gray-500">
                          {translations.Address}
                        </Span>
                      </Container>
                    </Container>
                  )}

                  {selectedVendor.paymentTerms && (
                    <Container className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <Container>
                        <Span className="text-sm font-medium text-gray-900 block">
                          {selectedVendor.paymentTerms}
                        </Span>
                        <Span className="text-xs text-gray-500">
                          {translations["Payment Terms"]}
                        </Span>
                      </Container>
                    </Container>
                  )}

                  {selectedVendor.taxNumber && (
                    <Container className="flex items-center gap-3">
                      <Container className="w-5 h-5 flex items-center justify-center">
                        <Span className="text-xs font-bold text-gray-400">
                          TAX
                        </Span>
                      </Container>
                      <Container>
                        <Span className="text-sm font-medium text-gray-900 block">
                          {selectedVendor.taxNumber}
                        </Span>
                        <Span className="text-xs text-gray-500">
                          {translations["Tax Number"]}
                        </Span>
                      </Container>
                    </Container>
                  )}

                  <Container className="flex items-center gap-3">
                    <Container className="w-5 h-5 flex items-center justify-center">
                      <Container
                        className={`w-2 h-2 rounded-full ${
                          selectedVendor.isActive
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></Container>
                    </Container>
                    <Container>
                      <Span
                        className={`text-sm font-medium block ${
                          selectedVendor.isActive
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedVendor.isActive
                          ? translations.Active
                          : translations.Inactive}
                      </Span>
                      <Span className="text-xs text-gray-500">
                        {translations.Status}
                      </Span>
                    </Container>
                  </Container>
                </Container>
              </Container>

              {selectedVendor.bankDetails && (
                <Container className="border-t border-gray-200 pt-4">
                  <Container className="space-y-2">
                    <Span className="text-sm font-medium text-gray-900">
                      {translations["Bank Details"]}
                    </Span>
                    <Container className="bg-gray-50 p-3 rounded-md">
                      <Span className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedVendor.bankDetails}
                      </Span>
                    </Container>
                  </Container>
                </Container>
              )}

              {selectedVendor.description && (
                <Container className="border-t border-gray-200 pt-4">
                  <Container className="space-y-2">
                    <Span className="text-sm font-medium text-gray-900">
                      {translations.Description}
                    </Span>
                    <Container className="bg-gray-50 p-3 rounded-md">
                      <Span className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedVendor.description}
                      </Span>
                    </Container>
                  </Container>
                </Container>
              )}
            </Container>
          )
        }
      />
    </Container>
  );
};

export default VendorManagement;
