import React, { useState } from "react";
import { CloudUpload, X } from "lucide-react";
import { useHR } from "../../Contexts/HrContext/HrContext";
import InputField from "../../components/elements/inputField/InputField";
import Container from "../../components/elements/container/Container";
import Card from "../../components/elements/card/Card";
import Alert from "../../components/elements/Alert/Alert";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import CheckboxField from "../../components/elements/checkbox/CheckboxField";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";

const EmployeeForm = () => {
  const {
    selectedEmployee,
    formMode,
    loading,
    error,
    createEmployee,
    updateEmployee,
    setSelectedEmployee,
    setFormMode,
    clearError,
  } = useHR();

  const isViewMode = formMode === "view";
  const isEditMode = formMode === "edit";
  const isCreateMode = formMode === "create";

  const initialFormData = {
    F_Name: "",
    Surname: "",
    M_Name: "",
    Code: "",
    Image: null,
    Notes: "",
    MobileNumber: "",
    PhoneNumber: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "",
    PostalCode: "",
    Country: "Pakistan",
    Citizenship: "",
    Email: "",
    Status: "Active",
    Role: "",
    DisplayLanguage: "English",
    Branch: "",
    AccessibleBranches: [],
    allow_access: false,
    send_credentials: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Set form data when selected employee changes
  React.useEffect(() => {
    if (selectedEmployee) {
      setFormData(selectedEmployee);
      if (selectedEmployee.Image) {
        setImagePreview(selectedEmployee.Image);
      }
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
    }
  }, [selectedEmployee]);

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "On Leave", label: "On Leave" },
    { value: "Terminated", label: "Terminated" },
  ];

  const branchOptions = [
    { value: "Main Branch", label: "Main Branch" },
    { value: "North Branch", label: "North Branch" },
    { value: "South Branch", label: "South Branch" },
  ];

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Urdu", label: "Urdu" },
    { value: "Arabic", label: "Arabic" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (name, values) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, Image: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.F_Name) newErrors.F_Name = "First name is required";
    if (!formData.Code) newErrors.Code = "Employee code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let result;
      if (isCreateMode) {
        result = await createEmployee(formData);
      } else if (isEditMode) {
        result = await updateEmployee(selectedEmployee.Id, formData);
      }

      if (result?.success) {
        setFormMode("view");
        setSelectedEmployee(result.data);
      }
    } catch (err) {
      console.error("Error saving employee:", err);
    }
  };

  const handleCancel = () => {
    if (selectedEmployee) {
      setFormMode("view");
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isCreateMode
              ? "Add New Employee"
              : isEditMode
              ? "Edit Employee"
              : "Employee Details"}
          </h2>
        </div>

        {error && (
          <Alert
            variant="danger"
            message={error}
            onClose={clearError}
            className="mx-6 mt-4"
          />
        )}

        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          {/* Employee Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Employee Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                name="F_Name"
                placeholder="First Name"
                type="text"
                value={formData.F_Name}
                onChange={handleInputChange}
                errors={errors}
                disabled={isViewMode}
                label="First Name *"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Surname"
                placeholder="Surname"
                type="text"
                value={formData.Surname}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Surname"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="M_Name"
                placeholder="Middle Name"
                type="text"
                value={formData.M_Name}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Middle Name"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Code"
                placeholder="Employee Code"
                type="text"
                value={formData.Code}
                onChange={handleInputChange}
                errors={errors}
                disabled={isViewMode}
                label="Employee Code *"
                width="w-full"
                marginBottom="mb-0"
              />

              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Picture
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer ${
                      isViewMode
                        ? "bg-gray-100 border-gray-300"
                        : "border-gray-300 hover:border-primary"
                    }`}
                    style={{ width: "150px", height: "150px" }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Employee"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <CloudUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {isViewMode ? "No image" : "Upload Image"}
                        </p>
                      </div>
                    )}
                  </label>
                  {!isViewMode && (
                    <>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({ ...prev, Image: null }));
                          }}
                          className="ml-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-3">
                <InputField
                  name="Notes"
                  placeholder="Notes"
                  type="text"
                  value={formData.Notes}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  label="Notes"
                  width="w-full"
                  marginBottom="mb-0"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="MobileNumber"
                placeholder="Mobile Number"
                type="tel"
                value={formData.MobileNumber}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Mobile Number"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="PhoneNumber"
                placeholder="Phone Number"
                type="tel"
                value={formData.PhoneNumber}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Phone Number"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Email"
                placeholder="Email Address"
                type="email"
                value={formData.Email}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Email Address"
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="Status"
                placeholder="Select Status"
                value={formData.Status}
                handleChange={(value) => handleSelectChange("Status", value)}
                optionList={statusOptions}
                disabled={isViewMode}
                label="Status"
                width="w-full"
                marginBottom="mb-0"
              />
            </div>
          </div>

          {/* Address Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Address Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="AddressLine1"
                placeholder="Address Line 1"
                type="text"
                value={formData.AddressLine1}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Address Line 1"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="AddressLine2"
                placeholder="Address Line 2"
                type="text"
                value={formData.AddressLine2}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Address Line 2"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="City"
                placeholder="City"
                type="text"
                value={formData.City}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="City"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="State"
                placeholder="State"
                type="text"
                value={formData.State}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="State"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="PostalCode"
                placeholder="Postal Code"
                type="text"
                value={formData.PostalCode}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Postal Code"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Country"
                placeholder="Country"
                type="text"
                value={formData.Country}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Country"
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Citizenship"
                placeholder="Citizenship"
                type="text"
                value={formData.Citizenship}
                onChange={handleInputChange}
                disabled={isViewMode}
                label="Citizenship"
                width="w-full"
                marginBottom="mb-0"
              />
            </div>
          </div>

          {/* Account Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectBox
                name="Role"
                placeholder="Select Role"
                value={formData.Role}
                handleChange={(value) => handleSelectChange("Role", value)}
                disabled={isViewMode}
                label="Role"
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="DisplayLanguage"
                placeholder="Select Language"
                value={formData.DisplayLanguage}
                handleChange={(value) =>
                  handleSelectChange("DisplayLanguage", value)
                }
                optionList={languageOptions}
                disabled={isViewMode}
                label="Display Language"
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="Branch"
                placeholder="Select Branch"
                value={formData.Branch}
                handleChange={(value) => handleSelectChange("Branch", value)}
                optionList={branchOptions}
                disabled={isViewMode}
                label="Branch"
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="AccessibleBranches"
                placeholder="Select Accessible Branches"
                value={formData.AccessibleBranches}
                handleChange={(values) =>
                  handleMultiSelectChange("AccessibleBranches", values)
                }
                optionList={branchOptions}
                disabled={isViewMode}
                label="Accessible Branches"
                width="w-full"
                marginBottom="mb-0"
                mode="multiple"
              />

              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CheckboxField
                    name="allow_access"
                    label="Allow access to the system"
                    checked={formData.allow_access}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />

                  <CheckboxField
                    name="send_credentials"
                    label="Send credentials to employee by email"
                    checked={formData.send_credentials}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {!isViewMode && (
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <OutlineButton
                buttonText="Cancel"
                onClick={handleCancel}
                borderColor="border-gray-300"
                borderWidth="border"
                rounded="rounded-md"
                bgColor="bg-white"
                textColor="text-gray-700"
                height="h-10"
                width="w-24"
                disabled={loading}
              />

              <FilledButton
                buttonText={loading ? "Saving..." : "Save"}
                bgColor="bg-primary"
                textColor="text-white"
                rounded="rounded-md"
                height="h-10"
                width="w-24"
                type="submit"
                disabled={loading}
              />
            </div>
          )}
        </form>
      </Card>
    </Container>
  );
};

export default EmployeeForm;
