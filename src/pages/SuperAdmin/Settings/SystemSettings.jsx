import { useState } from "react";
import Container from "../../../components/elements/container/Container";
import Alert from "../../../components/elements/alert/Alert";
import Card from "../../../components/elements/card/Card";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import CheckboxField from "../../../components/elements/checkbox/CheckboxField";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";

const SystemSettings = () => {
  const [formData, setFormData] = useState({
    appName: "ERP Solution",
    timezone: "UTC",
    maintenanceMode: false,
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [errors, setErrors] = useState({});

  const timezoneOptions = [
    { value: "UTC", label: "UTC" },
    { value: "EST", label: "EST" },
    { value: "PST", label: "PST" },
    { value: "CST", label: "CST" },
    { value: "MST", label: "MST" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      timezone: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.appName.trim()) {
      newErrors.appName = { message: "Application name is required" };
    }

    if (!formData.timezone) {
      newErrors.timezone = { message: "Timezone is required" };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("System settings saved:", formData);
      setAlert({
        show: true,
        message: "System settings updated successfully!",
        variant: "success",
      });

      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, message: "", variant: "success" });
      }, 3000);
    } else {
      setAlert({
        show: true,
        message: "Please fix the errors below",
        variant: "danger",
      });
    }
  };

  return (
    <Container className="max-w-2xl mx-auto p-6">
      {alert.show && (
        <Alert
          variant={alert.variant}
          message={alert.message}
          onClose={() =>
            setAlert({ show: false, message: "", variant: "success" })
          }
          dismissible={true}
        />
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          System Settings
        </h2>

        <div className="space-y-6">
          <InputField
            name="appName"
            label="Application Name"
            placeholder="Enter application name"
            type="text"
            value={formData.appName}
            onChange={handleInputChange}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
          />

          <SelectBox
            name="timezone"
            label="Timezone"
            placeholder="Select timezone"
            value={formData.timezone}
            handleChange={handleSelectChange}
            optionList={timezoneOptions}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
          />

          <Container className="mb-6">
            <CheckboxField
              name="maintenanceMode"
              label="Enable Maintenance Mode"
              checked={formData.maintenanceMode}
              onChange={handleCheckboxChange}
              errors={errors}
            />
            <p className="text-sm text-gray-500 mt-2 ml-6">
              When enabled, the system will be in maintenance mode and users
              will see a maintenance page.
            </p>
          </Container>

          <Container className="flex justify-end pt-4">
            <FilledButton
              buttonText="Save Changes"
              type="submit"
              bgColor="bg-blue-600"
              textColor="text-white"
              height="h-10"
              px="px-6"
              fontSize="text-sm"
              fontWeight="font-medium"
              rounded="rounded-md"
              onClick={handleSubmit}
            />
          </Container>
        </div>
      </Card>
    </Container>
  );
};

export default SystemSettings;
