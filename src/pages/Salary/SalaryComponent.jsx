import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, DollarSign, Filter } from "lucide-react";
import Badge from "../../components/elements/Badge/Badge";
import InputField from "../../components/elements/inputField/InputField";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import CheckboxField from "../../components/elements/checkbox/CheckboxField";
import Container from "../../components/elements/container/Container";
import Alert from "../../components/elements/Alert/Alert";
import BodyHeader from "../../components/elements/bodyHeader/BodyHeader";
import Card from "../../components/elements/card/Card";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import Table from "../../components/elements/table/Table";
import Thead from "../../components/elements/thead/Thead";
import TR from "../../components/elements/tr/TR";
import TH from "../../components/elements/th/TH";
import Tbody from "../../components/elements/tbody/Tbody";
import TD from "../../components/elements/td/TD";
import Skeleton from "../../components/elements/skeleton/Skeleton";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import Pagination from "../../components/elements/Pagination/Pagination";
import Modall from "../../components/elements/modal/Modal";
import { useSalary } from "../../Contexts/SalaryManagementContext/SalaryManagementContext";

const SalaryComponent = () => {
  const {
    // State from context
    salaryComponents,
    salaryComponentsPagination,
    componentTypes,
    calculationTypes,
    isSalaryComponentsLoading,
    isLoading,
    error,

    // API methods
    getSalaryComponents,
    createSalaryComponent,
    updateSalaryComponent,
    deleteSalaryComponent,
    getComponentTypes,
    getCalculationTypes,
    clearError,
  } = useSalary();

  const [showModal, setShowModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    Type: "Deduction",
    Description: "",
    CalculationType: "Amount",
    DefaultAmount: "",
    DefaultPercentage: "",
    DisplayOrder: 1,
    IsActive: true,
    IsTaxable: false,
    IsMandatory: false,
    IsStatutory: false,
  });

  const pageSize = 10;

  // Load data on component mount
  useEffect(() => {
    loadSalaryComponents();
    loadComponentTypes();
    loadCalculationTypes();
  }, [currentPage, typeFilter, statusFilter]);

  // Load salary components
  const loadSalaryComponents = async () => {
    try {
      const activeFilter = statusFilter === "" ? null : statusFilter === "true";
      const typeParam = typeFilter === "" ? null : typeFilter;

      await getSalaryComponents(typeParam, activeFilter, currentPage, pageSize);
    } catch (error) {
      console.error("Error loading salary components:", error);
    }
  };

  // Load component types
  const loadComponentTypes = async () => {
    try {
      await getComponentTypes();
    } catch (error) {
      console.error("Error loading component types:", error);
    }
  };

  // Load calculation types
  const loadCalculationTypes = async () => {
    try {
      await getCalculationTypes();
    } catch (error) {
      console.error("Error loading calculation types:", error);
    }
  };

  // Filter components based on search - add null check
  const filteredComponents = (salaryComponents || []).filter((component) => {
    // Additional safety check for component object
    if (!component || typeof component !== "object") {
      return false;
    }

    const matchesSearch =
      component.Name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      component.Description?.toLowerCase().includes(searchValue.toLowerCase());

    return matchesSearch;
  });

  // Dynamic options based on loaded data - add null checks
  const typeOptions = [
    { value: "", label: "All Types" },
    ...(componentTypes || []).map((type) => ({
      value: type.Value || type.value || type,
      label: type.Label || type.label || type.Value || type.value || type,
    })),
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  // Fixed calculation type options with proper null check
  const calculationTypeOptions =
    calculationTypes && calculationTypes.length > 0
      ? calculationTypes.map((type) => ({
          value: type.Value || type.value || type,
          label: type.Label || type.label || type.Value || type.value || type,
        }))
      : [
          { value: "Amount", label: "Fixed Amount" },
          { value: "Percentage", label: "Percentage" },
          { value: "Formula", label: "Formula" },
        ];

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAdd = () => {
    setEditingComponent(null);
    setFormData({
      Name: "",
      Type: "Deduction",
      Description: "",
      CalculationType: "Amount",
      DefaultAmount: "",
      DefaultPercentage: "",
      DisplayOrder: 1,
      IsActive: true,
      IsTaxable: false,
      IsMandatory: false,
      IsStatutory: false,
    });
    setShowModal(true);
  };

  const handleEdit = (component) => {
    setEditingComponent(component);
    setFormData({
      Name: component.Name || "",
      Type: component.Type || "Deduction",
      Description: component.Description || "",
      CalculationType: component.CalculationType || "Amount",
      DefaultAmount: component.DefaultAmount?.toString() || "",
      DefaultPercentage: component.DefaultPercentage
        ? (component.DefaultPercentage * 100).toString()
        : "",
      DisplayOrder: component.DisplayOrder || 1,
      IsActive: component.IsActive !== undefined ? component.IsActive : true,
      IsTaxable: component.IsTaxable || false,
      IsMandatory: component.IsMandatory || false,
      IsStatutory: component.IsStatutory || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      try {
        await deleteSalaryComponent(id);
        setAlert({
          show: true,
          message: "Component deleted successfully!",
          variant: "success",
        });
        // Reload data after deletion
        await loadSalaryComponents();
      } catch (error) {
        setAlert({
          show: true,
          message: error.message || "Failed to delete component",
          variant: "error",
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for API
      const apiData = {
        Name: formData.Name,
        Type: formData.Type,
        Description: formData.Description,
        CalculationType: formData.CalculationType,
        DefaultAmount:
          formData.CalculationType === "Amount"
            ? parseFloat(formData.DefaultAmount) || 0
            : 0,
        DefaultPercentage:
          formData.CalculationType === "Percentage"
            ? parseFloat(formData.DefaultPercentage) / 100 || 0
            : 0,
        DisplayOrder: parseInt(formData.DisplayOrder) || 1,
        IsActive: formData.IsActive,
        IsTaxable: formData.IsTaxable,
        IsMandatory: formData.IsMandatory,
        IsStatutory: formData.IsStatutory,
      };

      if (editingComponent) {
        await updateSalaryComponent(
          editingComponent.Id || editingComponent.id,
          apiData
        );
        setAlert({
          show: true,
          message: "Component updated successfully!",
          variant: "success",
        });
      } else {
        await createSalaryComponent(apiData);
        setAlert({
          show: true,
          message: "Component added successfully!",
          variant: "success",
        });
      }

      setShowModal(false);
      setEditingComponent(null);

      // Reset form data
      setFormData({
        Name: "",
        Type: "Deduction",
        Description: "",
        CalculationType: "Amount",
        DefaultAmount: "",
        DefaultPercentage: "",
        DisplayOrder: 1,
        IsActive: true,
        IsTaxable: false,
        IsMandatory: false,
        IsStatutory: false,
      });

      // Small delay before reloading to ensure API has processed
      setTimeout(() => {
        loadSalaryComponents();
      }, 100);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setAlert({
        show: true,
        message: error.message || "Failed to save component",
        variant: "error",
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "type") {
      setTypeFilter(value);
    } else if (filterType === "status") {
      setStatusFilter(value);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear error when component unmounts or when needed
  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  // Show error alert if there's an error from context
  useEffect(() => {
    if (error) {
      setAlert({
        show: true,
        message: error,
        variant: "error",
      });
    }
  }, [error]);

  // Debug logs
  console.log("SalaryComponents:", salaryComponents);
  console.log("Filtered components:", filteredComponents);

  const getStatusBadge = (IsActive) => (
    <Badge variant={IsActive ? "success" : "secondary"}>
      {IsActive ? "Active" : "Inactive"}
    </Badge>
  );

  const getTypeBadge = (type) => (
    <Badge variant={type === "Deduction" ? "danger" : "success"}>{type}</Badge>
  );

  const getTaxableBadge = (IsTaxable) => (
    <Badge variant={IsTaxable ? "warning" : "info"}>
      {IsTaxable ? "Taxable" : "Non-Taxable"}
    </Badge>
  );

  const totalPages = salaryComponentsPagination?.totalPages || 1;

  const modalBody = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Component Name"
          name="Name"
          placeholder="e.g. Health Insurance, Basic Salary"
          value={formData.Name}
          onChange={(e) => handleInputChange("Name", e.target.value)}
          width="w-full"
        />
        <SelectBox
          label="Type"
          name="Type"
          placeholder="Select type"
          value={formData.Type}
          handleChange={(value) => handleInputChange("Type", value)}
          optionList={[
            { value: "Earning", label: "Earning" },
            { value: "Deduction", label: "Deduction" },
          ]}
          width="w-full"
        />
      </div>

      <InputField
        label="Description"
        name="Description"
        placeholder="Enter description"
        value={formData.Description}
        onChange={(e) => handleInputChange("Description", e.target.value)}
        width="w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectBox
          label="Calculation Type"
          name="CalculationType"
          placeholder="Select calculation type"
          value={formData.CalculationType}
          handleChange={(value) => handleInputChange("CalculationType", value)}
          optionList={calculationTypeOptions}
          width="w-full"
        />
        {formData.CalculationType === "Amount" && (
          <InputField
            label="Default Amount"
            name="DefaultAmount"
            type="number"
            placeholder="0.00"
            value={formData.DefaultAmount}
            onChange={(e) => handleInputChange("DefaultAmount", e.target.value)}
            width="w-full"
          />
        )}
        {formData.CalculationType === "Percentage" && (
          <InputField
            label="Default Percentage"
            name="DefaultPercentage"
            type="number"
            placeholder="0.00"
            value={formData.DefaultPercentage}
            onChange={(e) =>
              handleInputChange("DefaultPercentage", e.target.value)
            }
            width="w-full"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Display Order"
          name="DisplayOrder"
          type="number"
          placeholder="1"
          value={formData.DisplayOrder}
          onChange={(e) =>
            handleInputChange("DisplayOrder", parseInt(e.target.value))
          }
          width="w-full"
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          <div className="space-y-2">
            <CheckboxField
              name="IsActive"
              label="Active"
              checked={formData.IsActive}
              onChange={(e) =>
                handleCheckboxChange("IsActive", e.target.checked)
              }
            />
            <CheckboxField
              name="IsTaxable"
              label="Taxable"
              checked={formData.IsTaxable}
              onChange={(e) =>
                handleCheckboxChange("IsTaxable", e.target.checked)
              }
            />
            <CheckboxField
              name="IsMandatory"
              label="Mandatory"
              checked={formData.IsMandatory}
              onChange={(e) =>
                handleCheckboxChange("IsMandatory", e.target.checked)
              }
            />
            <CheckboxField
              name="IsStatutory"
              label="Statutory"
              checked={formData.IsStatutory}
              onChange={(e) =>
                handleCheckboxChange("IsStatutory", e.target.checked)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Container className="p-6 space-y-6">
      {/* Alert */}
      {alert.show && (
        <Alert
          variant={alert.variant}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      {/* Header */}
      <div className="flex">
        <BodyHeader
          heading="Salary Components"
          subHeading="Manage all salary components and deductions"
        />
        <FilledButton
          buttonText="Add Component"
          icon={Plus}
          isIcon={true}
          isIconLeft={true}
          onClick={handleAdd}
          iconSize="w-4 h-4"
          bgColor="bg-gray-100 hover:bg-gray-200"
          textColor="text-gray-700"
          rounded="rounded-lg"
          height="h-10"
          px="px-4"
          fontWeight="font-medium"
          fontSize="text-sm"
        />
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchAndFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search components..."
              isFocused={false}
            />
          </div>

          <div className="flex gap-2">
            <SelectBox
              placeholder="Filter by type"
              value={typeFilter}
              handleChange={(value) => handleFilterChange("type", value)}
              optionList={typeOptions}
              width="w-32"
            />
            <SelectBox
              placeholder="Filter by status"
              value={statusFilter}
              handleChange={(value) => handleFilterChange("status", value)}
              optionList={statusOptions}
              width="w-32"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <Thead className="bg-gray-50">
              <TR>
                <TH>Name & Description</TH>
                <TH>Type</TH>
                <TH>Calculation</TH>
                <TH>Status</TH>
                <TH>Taxable</TH>
                <TH>Actions</TH>
              </TR>
            </Thead>
            <Tbody>
              {isSalaryComponentsLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TR key={index}>
                    <TD colSpan={6}>
                      <Skeleton height="20px" width="100%" />
                    </TD>
                  </TR>
                ))
              ) : filteredComponents.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-center text-gray-500">
                    No salary components found
                  </TD>
                </TR>
              ) : (
                filteredComponents.map((component) => (
                  <TR key={component.Id || component.id}>
                    <TD>
                      <div>
                        <div className="font-medium text-gray-900">
                          {component.Name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {component.Description}
                        </div>
                      </div>
                    </TD>
                    <TD>{getTypeBadge(component.Type)}</TD>
                    <TD>
                      <div>
                        <div className="font-medium">
                          {component.CalculationType === "Amount"
                            ? `$${
                                component.DefaultAmount?.toFixed(2) || "0.00"
                              }`
                            : component.CalculationType === "Percentage"
                            ? `${
                                (component.DefaultPercentage * 100)?.toFixed(
                                  2
                                ) || "0.00"
                              }%`
                            : "Formula"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {component.CalculationType}
                        </div>
                      </div>
                    </TD>
                    <TD>{getStatusBadge(component.IsActive)}</TD>
                    <TD>{getTaxableBadge(component.IsTaxable)}</TD>
                    <TD>
                      <div className="flex gap-2">
                        <OutlineButton
                          buttonText=""
                          icon={Edit}
                          isIcon={true}
                          isIconLeft={true}
                          onClick={() => handleEdit(component)}
                          bgColor="bg-transparent"
                          textColor="text-blue-600"
                          borderColor="border-blue-300"
                          borderWidth="border"
                          rounded="rounded-md"
                          height="h-8"
                          width="w-8"
                          hover="hover:bg-blue-50"
                          px="px-0"
                        />
                        <OutlineButton
                          buttonText=""
                          icon={Trash2}
                          isIcon={true}
                          isIconLeft={true}
                          onClick={() =>
                            handleDelete(component.Id || component.id)
                          }
                          bgColor="bg-transparent"
                          textColor="text-red-600"
                          borderColor="border-red-300"
                          borderWidth="border"
                          rounded="rounded-md"
                          height="h-8"
                          width="w-8"
                          hover="hover:bg-red-50"
                          px="px-0"
                        />
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </Tbody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal */}
      <Modall
        title={
          editingComponent
            ? "Edit Salary Component"
            : "Add New Salary Component"
        }
        modalOpen={showModal}
        setModalOpen={setShowModal}
        body={modalBody}
        okText={editingComponent ? "Update Component" : "Add Component"}
        cancelText="Cancel"
        okAction={handleSubmit}
        cancelAction={() => setShowModal(false)}
        okButtonDisabled={isLoading}
        width={800}
      />
    </Container>
  );
};

export default SalaryComponent;
