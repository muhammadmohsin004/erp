import React, { useState, useEffect } from "react";
import { useHR } from "../../Contexts/HrContext/HrContext";
import Container from "../../components/elements/container/Container";
import Alert from "../../components/elements/Alert/Alert";
import Card from "../../components/elements/card/Card";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import Badge from "../../components/elements/Badge/Badge";
import Modall from "../../components/elements/modal/Modal";
import InputField from "../../components/elements/inputField/InputField";
import CheckboxField from "../../components/elements/checkbox/CheckboxField";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import { FiRefreshCw } from "react-icons/fi";
import { Plus } from "lucide-react";

const EmployeeSalary = () => {
  const {
    fetchEmployeeSalaries,
    fetchSalaryComponents,
    createEmployeeSalary,
    updateEmployeeSalary,
    deleteEmployeeSalary,
    fetchEmployees,
    employees,
    employeeSalaries,
    salaryComponents,
    loading,
    error,
    clearError,
    formatCurrency,
    formatDate,
  } = useHR();

  const [showModal, setShowModal] = useState(false);
  const [currentSalary, setCurrentSalary] = useState({
    Id: 0,
    EmployeeId: "",
    SalaryComponentId: "",
    Amount: "",
    EffectiveFrom: "",
    EffectiveTo: "",
    IsActive: true,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch employees first
        await fetchEmployees();

        // Fetch salary components
        await fetchSalaryComponents();

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing data:", error);
        setAlert({
          show: true,
          message: "Failed to load initial data",
          variant: "danger",
        });
      }
    };

    initializeData();
  }, []);

  // Fetch employee salaries when employee is selected
  useEffect(() => {
    if (selectedEmployee && isInitialized) {
      handleFetchEmployeeSalaries(selectedEmployee);
    }
  }, [selectedEmployee, isInitialized]);

  // Handle fetching employee salaries
  const handleFetchEmployeeSalaries = async (employeeId) => {
    try {
      await fetchEmployeeSalaries(employeeId);
    } catch (error) {
      console.error("Error fetching employee salaries:", error);
      setAlert({
        show: true,
        message: "Failed to fetch employee salary components",
        variant: "danger",
      });
    }
  };

  // Handle employee selection
  const handleSelectEmployee = (value) => {
    setSelectedEmployee(value);
    // Reset current salary form when employee changes
    setCurrentSalary({
      Id: 0,
      EmployeeId: value,
      SalaryComponentId: "",
      Amount: "",
      EffectiveFrom: "",
      EffectiveTo: "",
      IsActive: true,
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentSalary({
      ...currentSalary,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle salary component selection
  const handleSalaryComponentChange = (value) => {
    setCurrentSalary({
      ...currentSalary,
      SalaryComponentId: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      setAlert({
        show: true,
        message: "Please select an employee first",
        variant: "danger",
      });
      return;
    }

    try {
      // Find selected component details
      const selectedComponent = salaryComponents.find(
        (c) => c.Id === parseInt(currentSalary.SalaryComponentId)
      );

      const payload = {
        EmployeeId: parseInt(selectedEmployee),
        SalaryComponentId: parseInt(currentSalary.SalaryComponentId),
        Amount: parseFloat(currentSalary.Amount),
        EffectiveFrom: new Date(currentSalary.EffectiveFrom).toISOString(),
        EffectiveTo: currentSalary.EffectiveTo
          ? new Date(currentSalary.EffectiveTo).toISOString()
          : null,
        IsActive: currentSalary.IsActive,
      };

      // Add component details if available
      if (selectedComponent) {
        payload.SalaryComponentName = selectedComponent.Name;
        payload.SalaryComponentType = selectedComponent.Type;
      }

      let result;
      if (isEditMode) {
        result = await updateEmployeeSalary(currentSalary.Id, payload);
      } else {
        result = await createEmployeeSalary(payload);
      }

      setAlert({
        show: true,
        message: `Salary component ${
          isEditMode ? "updated" : "added"
        } successfully!`,
        variant: "success",
      });

      // Refresh the employee salaries after successful operation
      await handleFetchEmployeeSalaries(selectedEmployee);

      // Close modal and reset form
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving salary component:", error);
      setAlert({
        show: true,
        message:
          error.message ||
          `Failed to ${isEditMode ? "update" : "add"} salary component`,
        variant: "danger",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentSalary({
      Id: 0,
      EmployeeId: selectedEmployee,
      SalaryComponentId: "",
      Amount: "",
      EffectiveFrom: "",
      EffectiveTo: "",
      IsActive: true,
    });
    setIsEditMode(false);
  };

  // Handle edit salary
  const handleEdit = (salary) => {
    setCurrentSalary({
      ...salary,
      EmployeeId: selectedEmployee,
      SalaryComponentId: salary.SalaryComponentId.toString(),
      Amount: salary.Amount.toString(),
      EffectiveFrom: salary.EffectiveFrom
        ? new Date(salary.EffectiveFrom).toISOString().split("T")[0]
        : "",
      EffectiveTo: salary.EffectiveTo
        ? new Date(salary.EffectiveTo).toISOString().split("T")[0]
        : "",
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  // Handle delete salary
  const handleDelete = async (salaryId) => {
    if (
      !window.confirm("Are you sure you want to delete this salary component?")
    ) {
      return;
    }

    try {
      await deleteEmployeeSalary(salaryId);

      setAlert({
        show: true,
        message: "Salary component deleted successfully!",
        variant: "success",
      });

      // Refresh the employee salaries after successful deletion
      await handleFetchEmployeeSalaries(selectedEmployee);
    } catch (error) {
      console.error("Error deleting salary component:", error);
      setAlert({
        show: true,
        message: error.message || "Failed to delete salary component",
        variant: "danger",
      });
    }
  };

  // Handle add new salary component
  const handleAddNew = () => {
    if (!selectedEmployee) {
      setAlert({
        show: true,
        message: "Please select an employee first",
        variant: "danger",
      });
      return;
    }
    console.log("object ==ohh yes");
    resetForm();
    setShowModal(true);
  };

  // Handle cancel modal
  const handleCancel = () => {
    setShowModal(false);
    resetForm();
  };

  // Close alert
  const closeAlert = () => {
    setAlert({ ...alert, show: false });
    clearError();
  };

  // Handle global error
  useEffect(() => {
    if (error) {
      setAlert({ show: true, message: error, variant: "danger" });
    }
  }, [error]);

  // Get selected employee name
  const getSelectedEmployeeName = () => {
    if (!selectedEmployee) return "";
    const employee = employees.find(
      (emp) => emp.Id === parseInt(selectedEmployee)
    );
    return employee ? `${employee.F_Name} ${employee.L_Name}` : "";
  };

  if (!isInitialized) {
    return (
      <Container className="py-4">
        <div className="p-8 text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {alert.show && (
        <Alert
          variant={alert.variant}
          message={alert.message}
          onClose={closeAlert}
          className="mb-4"
        />
      )}

      <Card>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Employee Salary Components
          </h2>
          <button
            onClick={handleAddNew}
            disabled={!selectedEmployee || loading}
            className="bg-gray-600 hover:bg-gray-700 text-white h-10 px-4 flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Component
          </button>
        </div>

        <div className="p-4">
          {/* Employee Selection */}
          <div className="mb-6">
            <div className="w-full md:w-1/2">
              <SelectBox
                name="EmployeeId"
                label="Select Employee"
                value={selectedEmployee}
                handleChange={handleSelectEmployee}
                optionList={employees.map((emp) => ({
                  value: emp.Id,
                  label: `${emp.F_Name} ${emp.L_Name} (${emp.Code || emp.Id})`,
                }))}
                required
                placeholder="Choose an employee..."
              />
            </div>
            {selectedEmployee && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {getSelectedEmployeeName()}
              </div>
            )}
          </div>

          {/* Salary Components Table */}
          {selectedEmployee ? (
            loading ? (
              <div className="p-8 text-center">
                <div className="text-lg">Loading salary components...</div>
              </div>
            ) : employeeSalaries.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500">
                  No salary components found for this employee.
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Click "Add New Component" to add salary components.
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Component Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Effective From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Effective To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employeeSalaries.map((salary) => (
                      <tr key={salary.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {salary.SalaryComponentName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {salary.SalaryComponentType || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(salary.Amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(salary.EffectiveFrom)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {salary.EffectiveTo
                            ? formatDate(salary.EffectiveTo)
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={salary.IsActive ? "success" : "secondary"}
                          >
                            {salary.IsActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(salary)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(salary.Id)}
                              className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md bg-white text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-500">
                Please select an employee to view their salary components.
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}

      <Modall
        modalOpen={showModal}
        setModalOpen={setShowModal}
        title={`${isEditMode ? "Edit" : "Add New"} Salary Component`}
        okAction={handleSubmit}
        cancelAction={handleCancel}
        okText={isEditMode ? "Update" : "Save"}
        cancelText="Cancel"
        okButtonDisabled={loading}
        width={600}
        body={
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee Display (Read-only in modal) */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
              <div className="text-sm text-gray-900">
                {getSelectedEmployeeName()}
              </div>
            </div>

            {/* Salary Component Selection */}
            <SelectBox
              name="SalaryComponentId"
              label="Salary Component"
              value={currentSalary.SalaryComponentId}
              handleChange={handleSalaryComponentChange}
              optionList={salaryComponents.map((comp) => ({
                value: comp.Id,
                label: `${comp.Name} (${comp.Type})`,
              }))}
              required
              placeholder="Select a salary component..."
            />

            {/* Amount and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="Amount"
                label="Amount"
                type="number"
                value={currentSalary.Amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />

              <div className="flex items-center pt-6">
                <CheckboxField
                  name="IsActive"
                  label="Active"
                  checked={currentSalary.IsActive}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Effective Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="EffectiveFrom"
                label="Effective From"
                type="date"
                value={currentSalary.EffectiveFrom}
                onChange={handleInputChange}
                required
              />

              <InputField
                name="EffectiveTo"
                label="Effective To (Optional)"
                type="date"
                value={currentSalary.EffectiveTo}
                onChange={handleInputChange}
              />
            </div>
          </form>
        }
      />
    </Container>
  );
};

export default EmployeeSalary;
