import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CloudUpload, Check, X } from "lucide-react";
import { useHR } from "../../Contexts/HrContext/HrContext";
import Container from "../../components/elements/container/Container";
import BodyHeader from "../../components/elements/bodyHeader/BodyHeader";
import Alert from "../../components/elements/Alert/Alert";
import Card from "../../components/elements/card/Card";
import InputField from "../../components/elements/inputField/InputField";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import CheckboxField from "../../components/elements/checkbox/CheckboxField";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";

const CreateNewEmployee = () => {
  const language = useSelector((state) => state.language.language);
  const { Id } = localStorage.getItem("user");
  const userId = Id;
  const { createEmployee, loading, error, clearError, formMode, setFormMode } =
    useHR();

  // Translations
  const text = {
    en: {
      employeeInformation: "Employee Information",
      firstName: "First Name",
      surname: "Surname",
      middleName: "Middle Name",
      employeeCode: "Employee Code",
      employeePicture: "Employee Picture",
      uploadImage: "Upload Image",
      imageInstructions: "Drag image here or select from your computer.",
      notes: "Notes",
      mobileNumber: "Mobile Number",
      phoneNumber: "Phone Number",
      accountInformation: "Account Information",
      emailAddress: "Email Address",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      onLeave: "On Leave",
      terminated: "Terminated",
      allowAccess: "Allow access to the system",
      sendCredentials: "Send credentials to employee by email",
      role: "Role",
      displayLanguage: "Display Language",
      english: "English",
      urdu: "Urdu",
      arabic: "Arabic",
      branch: "Branch",
      selectBranch: "Select Branch",
      mainBranch: "Main Branch",
      northBranch: "North Branch",
      southBranch: "South Branch",
      accessibleBranches: "Accessible Branches",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      successMessage: "Employee information saved successfully!",
      requiredField: "*",
      pleaseProvideFirstName: "Please provide a first name.",
      pleaseProvideEmployeeCode: "Please provide an employee code.",
      country: "Country",
      citizenship: "Citizenship",
      addressLine1: "Address Line 1",
      addressLine2: "Address Line 2",
      city: "City",
      state: "State",
      postalCode: "Postal Code",
    },
    ar: {
      // Arabic translations...
    },
  }[language === "ar" ? "ar" : "en"];

  // Form state
  const [formData, setFormData] = useState({
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
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Options for selects
  const statusOptions = [
    { value: "Active", label: text.active },
    { value: "Inactive", label: text.inactive },
    { value: "On Leave", label: text.onLeave },
    { value: "Terminated", label: text.terminated },
  ];

  const branchOptions = [
    { value: "Main Branch", label: text.mainBranch },
    { value: "North Branch", label: text.northBranch },
    { value: "South Branch", label: text.southBranch },
  ];

  const languageOptions = [
    { value: "English", label: text.english },
    { value: "Urdu", label: text.urdu },
    { value: "Arabic", label: text.arabic },
  ];

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (name, values) => {
    setFormData({
      ...formData,
      [name]: values,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, Image: file });

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.F_Name) newErrors.F_Name = text.pleaseProvideFirstName;
    if (!formData.Code) newErrors.Code = text.pleaseProvideEmployeeCode;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = { ...formData, UserId: userId };
      const result = await createEmployee(submitData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        if (formMode === "create") {
          // Reset form if in create mode
          setFormData({
            ...formData,
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
            Email: "",
            Role: "",
            AccessibleBranches: [],
            allow_access: false,
            send_credentials: false,
          });
          setImagePreview(null);
        }
      }
    } catch (err) {
      console.error("Error creating employee:", err);
    }
  };

  const handleCancel = () => {
    setFormMode("view");
  };

  return (
    <Container
      className={`py-4 ${language === "ar" ? "text-right" : "text-left"}`}
    >
      <BodyHeader
        heading={text.employeeInformation}
        subHeading={
          formMode === "create"
            ? "Add a new employee"
            : formMode === "edit"
            ? "Edit employee details"
            : "View employee details"
        }
      />

      {error && (
        <Alert
          variant="danger"
          message={error}
          onClose={clearError}
          className="mb-4"
        />
      )}

      {success && (
        <Alert
          variant="success"
          message={text.successMessage}
          onClose={() => setSuccess(false)}
          className="mb-4"
        />
      )}

      <Card className="mb-4">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          {/* Employee Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              {text.employeeInformation}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                name="F_Name"
                placeholder={text.firstName}
                type="text"
                value={formData.F_Name}
                onChange={handleInputChange}
                errors={errors}
                disabled={formMode === "view"}
                label={`${text.firstName} *`}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Surname"
                placeholder={text.surname}
                type="text"
                value={formData.Surname}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.surname}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="M_Name"
                placeholder={text.middleName}
                type="text"
                value={formData.M_Name}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.middleName}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Code"
                placeholder={text.employeeCode}
                type="text"
                value={formData.Code}
                onChange={handleInputChange}
                errors={errors}
                disabled={formMode === "view"}
                label={`${text.employeeCode} *`}
                width="w-full"
                marginBottom="mb-0"
              />

              <div className="col-span-1 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.employeePicture}
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer ${
                      formMode === "view"
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
                          {formMode === "view" ? "No image" : text.uploadImage}
                        </p>
                      </div>
                    )}
                  </label>
                  {formMode !== "view" && (
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
                            setFormData({ ...formData, Image: null });
                          }}
                          className="ml-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      )}
                    </>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {text.imageInstructions}
                </p>
              </div>

              <div className="col-span-1 md:col-span-3">
                <InputField
                  name="Notes"
                  placeholder={text.notes}
                  type="text"
                  value={formData.Notes}
                  onChange={handleInputChange}
                  disabled={formMode === "view"}
                  label={text.notes}
                  width="w-full"
                  marginBottom="mb-0"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              {text.accountInformation}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="MobileNumber"
                placeholder={text.mobileNumber}
                type="tel"
                value={formData.MobileNumber}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.mobileNumber}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="PhoneNumber"
                placeholder={text.phoneNumber}
                type="tel"
                value={formData.PhoneNumber}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.phoneNumber}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Email"
                placeholder={text.emailAddress}
                type="email"
                value={formData.Email}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.emailAddress}
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="Status"
                placeholder={text.status}
                value={formData.Status}
                handleChange={(value) => handleSelectChange("Status", value)}
                optionList={statusOptions}
                disabled={formMode === "view"}
                label={text.status}
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
                placeholder={text.addressLine1}
                type="text"
                value={formData.AddressLine1}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.addressLine1}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="AddressLine2"
                placeholder={text.addressLine2}
                type="text"
                value={formData.AddressLine2}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.addressLine2}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="City"
                placeholder={text.city}
                type="text"
                value={formData.City}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.city}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="State"
                placeholder={text.state}
                type="text"
                value={formData.State}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.state}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="PostalCode"
                placeholder={text.postalCode}
                type="text"
                value={formData.PostalCode}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.postalCode}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Country"
                placeholder={text.country}
                type="text"
                value={formData.Country}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.country}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Citizenship"
                placeholder={text.citizenship}
                type="text"
                value={formData.Citizenship}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.citizenship}
                width="w-full"
                marginBottom="mb-0"
              />
            </div>
          </div>

          {/* Account Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              {text.accountInformation}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="Role"
                placeholder={text.role}
                type="text"
                value={formData.Role}
                onChange={handleInputChange}
                disabled={formMode === "view"}
                label={text.role}
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="DisplayLanguage"
                placeholder={text.displayLanguage}
                value={formData.DisplayLanguage}
                handleChange={(value) =>
                  handleSelectChange("DisplayLanguage", value)
                }
                optionList={languageOptions}
                disabled={formMode === "view"}
                label={text.displayLanguage}
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="Branch"
                placeholder={text.selectBranch}
                value={formData.Branch}
                handleChange={(value) => handleSelectChange("Branch", value)}
                optionList={branchOptions}
                disabled={formMode === "view"}
                label={text.branch}
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="AccessibleBranches"
                placeholder={text.accessibleBranches}
                value={formData.AccessibleBranches}
                handleChange={(values) =>
                  handleMultiSelectChange("AccessibleBranches", values)
                }
                optionList={branchOptions}
                disabled={formMode === "view"}
                label={text.accessibleBranches}
                width="w-full"
                marginBottom="mb-0"
                mode="multiple"
              />

              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CheckboxField
                    name="allow_access"
                    label={text.allowAccess}
                    checked={formData.allow_access}
                    onChange={handleInputChange}
                    disabled={formMode === "view"}
                  />

                  <CheckboxField
                    name="send_credentials"
                    label={text.sendCredentials}
                    checked={formData.send_credentials}
                    onChange={handleInputChange}
                    disabled={formMode === "view"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {formMode !== "view" && (
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <OutlineButton
                buttonText={text.cancel}
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
                buttonText={loading ? text.saving : text.save}
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

export default CreateNewEmployee;
