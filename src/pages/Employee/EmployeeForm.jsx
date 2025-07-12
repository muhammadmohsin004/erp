import React, { useState } from "react";
import { useSelector } from "react-redux";
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
import employeeTranslations from "../../translations/employeeTranslations";

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

  // Get current language from Redux store
  const { language: currentLanguage } = useSelector((state) => state.language);
  
  // Get translations based on current language
  const t = employeeTranslations[currentLanguage] || employeeTranslations.en;
  
  // Check if current language is Arabic for RTL support
  const isArabic = currentLanguage === "ar";

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
    { value: "Active", label: t.active },
    { value: "Inactive", label: t.inactive },
    { value: "On Leave", label: t.onLeave },
    { value: "Terminated", label: t.terminated },
  ];

  const branchOptions = [
    { value: "Main Branch", label: t.mainBranch },
    { value: "North Branch", label: t.northBranch },
    { value: "South Branch", label: t.southBranch },
  ];

  const languageOptions = [
    { value: "English", label: t.english },
    { value: "Urdu", label: t.urdu },
    { value: "Arabic", label: t.arabic },
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
    if (!formData.F_Name) newErrors.F_Name = t.firstNameRequired;
    if (!formData.Code) newErrors.Code = t.employeeCodeRequired;
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
    <Container className="py-4" dir={isArabic ? "rtl" : "ltr"}>
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isCreateMode
              ? t.addNewEmployee
              : isEditMode
              ? t.editEmployee
              : t.employeeDetails}
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
              {t.employeeInformation}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                name="F_Name"
                placeholder={t.firstNamePlaceholder}
                type="text"
                value={formData.F_Name}
                onChange={handleInputChange}
                errors={errors}
                disabled={isViewMode}
                label={`${t.firstName} ${t.required}`}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Surname"
                placeholder={t.surnamePlaceholder}
                type="text"
                value={formData.Surname}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.surname}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="M_Name"
                placeholder={t.middleNamePlaceholder}
                type="text"
                value={formData.M_Name}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.middleName}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Code"
                placeholder={t.employeeCodePlaceholder}
                type="text"
                value={formData.Code}
                onChange={handleInputChange}
                errors={errors}
                disabled={isViewMode}
                label={`${t.employeeCode} ${t.required}`}
                width="w-full"
                marginBottom="mb-0"
              />

              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.employeePicture}
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
                          {isViewMode ? t.noImage : t.uploadImage}
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
                          className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 ${
                            isArabic ? "mr-4" : "ml-4"
                          }`}
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
                  placeholder={t.notesPlaceholder}
                  type="text"
                  value={formData.Notes}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  label={t.notes}
                  width="w-full"
                  marginBottom="mb-0"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              {t.contactInformation}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="MobileNumber"
                placeholder={t.mobileNumberPlaceholder}
                type="tel"
                value={formData.MobileNumber}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.mobileNumber}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="PhoneNumber"
                placeholder={t.phoneNumberPlaceholder}
                type="tel"
                value={formData.PhoneNumber}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.phoneNumber}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Email"
                placeholder={t.emailPlaceholder}
                type="email"
                value={formData.Email}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.emailAddress}
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="Status"
                placeholder={t.selectStatus}
                value={formData.Status}
                handleChange={(value) => handleSelectChange("Status", value)}
                optionList={statusOptions}
                disabled={isViewMode}
                label={t.status}
                width="w-full"
                marginBottom="mb-0"
              />
            </div>
          </div>

          {/* Address Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              {t.addressInformation}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="AddressLine1"
                placeholder={t.addressLine1Placeholder}
                type="text"
                value={formData.AddressLine1}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.addressLine1}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="AddressLine2"
                placeholder={t.addressLine2Placeholder}
                type="text"
                value={formData.AddressLine2}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.addressLine2}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="City"
                placeholder={t.cityPlaceholder}
                type="text"
                value={formData.City}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.city}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="State"
                placeholder={t.statePlaceholder}
                type="text"
                value={formData.State}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.state}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="PostalCode"
                placeholder={t.postalCodePlaceholder}
                type="text"
                value={formData.PostalCode}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.postalCode}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Country"
                placeholder={t.countryPlaceholder}
                type="text"
                value={formData.Country}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.country}
                width="w-full"
                marginBottom="mb-0"
              />

              <InputField
                name="Citizenship"
                placeholder={t.citizenshipPlaceholder}
                type="text"
                value={formData.Citizenship}
                onChange={handleInputChange}
                disabled={isViewMode}
                label={t.citizenship}
                width="w-full"
                marginBottom="mb-0"
              />
            </div>
          </div>

          {/* Account Information Section */}
          <div className="px-6 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              {t.accountInformation}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectBox
                name="Role"
                placeholder={t.selectRole}
                value={formData.Role}
                handleChange={(value) => handleSelectChange("Role", value)}
                disabled={isViewMode}
                label={t.role}
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="DisplayLanguage"
                placeholder={t.selectLanguage}
                value={formData.DisplayLanguage}
                handleChange={(value) =>
                  handleSelectChange("DisplayLanguage", value)
                }
                optionList={languageOptions}
                disabled={isViewMode}
                label={t.displayLanguage}
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="Branch"
                placeholder={t.selectBranch}
                value={formData.Branch}
                handleChange={(value) => handleSelectChange("Branch", value)}
                optionList={branchOptions}
                disabled={isViewMode}
                label={t.branch}
                width="w-full"
                marginBottom="mb-0"
              />

              <SelectBox
                name="AccessibleBranches"
                placeholder={t.selectAccessibleBranches}
                value={formData.AccessibleBranches}
                handleChange={(values) =>
                  handleMultiSelectChange("AccessibleBranches", values)
                }
                optionList={branchOptions}
                disabled={isViewMode}
                label={t.accessibleBranches}
                width="w-full"
                marginBottom="mb-0"
                mode="multiple"
              />

              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CheckboxField
                    name="allow_access"
                    label={t.allowAccess}
                    checked={formData.allow_access}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />

                  <CheckboxField
                    name="send_credentials"
                    label={t.sendCredentials}
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
            <div className={`px-6 py-4 bg-gray-50 flex space-x-3 ${
              isArabic ? "justify-start" : "justify-end"
            }`}>
              <OutlineButton
                buttonText={t.cancel}
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
                buttonText={loading ? t.saving : t.save}
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