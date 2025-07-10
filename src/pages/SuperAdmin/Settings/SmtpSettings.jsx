import React, { useState } from "react";

import { Mail, Server, Shield, Key, User, TestTube } from "lucide-react";
import Container from "../../../components/elements/container/Container";
import Alert from "../../../components/elements/alert/Alert";
import Card from "../../../components/elements/card/Card";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import OutlineButton from "../../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";

const SmtpSettings = () => {
  const [formData, setFormData] = useState({
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "user@example.com",
    smtpPassword: "",
    encryption: "tls",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [testResult, setTestResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const encryptionOptions = [
    { value: "tls", label: "TLS" },
    { value: "ssl", label: "SSL" },
    { value: "none", label: "None" },
  ];

  const handleChange = (e) => {
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
      encryption: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.smtpHost.trim()) {
      newErrors.smtpHost = { message: "SMTP Host is required" };
    }

    if (!formData.smtpPort.trim()) {
      newErrors.smtpPort = { message: "SMTP Port is required" };
    } else if (isNaN(formData.smtpPort) || parseInt(formData.smtpPort) <= 0) {
      newErrors.smtpPort = { message: "Port must be a valid number" };
    }

    if (!formData.smtpUsername.trim()) {
      newErrors.smtpUsername = { message: "Username is required" };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.smtpUsername)) {
      newErrors.smtpUsername = {
        message: "Please enter a valid email address",
      };
    }

    if (!formData.smtpPassword.trim()) {
      newErrors.smtpPassword = { message: "Password is required" };
    }

    if (!formData.encryption) {
      newErrors.encryption = { message: "Encryption method is required" };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTest = () => {
    if (!validateForm()) {
      setAlert({
        show: true,
        message: "Please fill in all required fields correctly before testing",
        variant: "danger",
      });
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    // Simulate SMTP test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResult({
        success: success,
        message: success
          ? "SMTP connection successful! Email configuration is working properly."
          : "SMTP connection failed. Please check your settings and try again.",
      });
      setIsTestingConnection(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("SMTP settings saved:", formData);
      setAlert({
        show: true,
        message: "SMTP settings updated successfully!",
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

  const resetForm = () => {
    setFormData({
      smtpHost: "",
      smtpPort: "",
      smtpUsername: "",
      smtpPassword: "",
      encryption: "tls",
    });
    setErrors({});
    setTestResult(null);
    setAlert({ show: false, message: "", variant: "success" });
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
        <Container className="flex items-center mb-6">
          <Mail className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">SMTP Settings</h2>
        </Container>

        <Container className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-center">
            <Server className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-700 font-medium">
                Email Server Configuration
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Configure your SMTP server settings to enable email
                notifications and communications.
              </p>
            </div>
          </div>
        </Container>

        {testResult && (
          <Container className="mb-6">
            <Alert
              variant={testResult.success ? "success" : "danger"}
              message={testResult.message}
              dismissible={true}
              onClose={() => setTestResult(null)}
            />
          </Container>
        )}

        <div className="space-y-6">
          <InputField
            name="smtpHost"
            label="SMTP Host"
            placeholder="e.g., smtp.gmail.com"
            type="text"
            value={formData.smtpHost}
            onChange={handleChange}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
            icon={Server}
          />

          <InputField
            name="smtpPort"
            label="SMTP Port"
            placeholder="e.g., 587, 465, 25"
            type="number"
            value={formData.smtpPort}
            onChange={handleChange}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
            icon={Server}
          />

          <InputField
            name="smtpUsername"
            label="Username (Email Address)"
            placeholder="your-email@example.com"
            type="email"
            value={formData.smtpUsername}
            onChange={handleChange}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
            icon={User}
          />

          <InputField
            name="smtpPassword"
            label="Password"
            placeholder="Enter your email password or app password"
            type="password"
            value={formData.smtpPassword}
            onChange={handleChange}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
            icon={Key}
            isVisible={passwordVisible}
            setIsVisible={setPasswordVisible}
          />

          <SelectBox
            name="encryption"
            label="Encryption Method"
            placeholder="Select encryption method"
            value={formData.encryption}
            handleChange={handleSelectChange}
            optionList={encryptionOptions}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
          />

          <Container className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-yellow-700 font-medium">
                  Security Recommendations
                </p>
                <ul className="text-xs text-yellow-600 mt-1 space-y-1">
                  <li>• Use TLS encryption for secure email transmission</li>
                  <li>
                    • For Gmail, use App Passwords instead of your regular
                    password
                  </li>
                  <li>• Port 587 is recommended for most SMTP servers</li>
                </ul>
              </div>
            </div>
          </Container>

          <Container className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Reset Form
            </button>

            <Container className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <OutlineButton
                buttonText={
                  isTestingConnection ? "Testing..." : "Test Connection"
                }
                type="button"
                onClick={handleTest}
                disabled={isTestingConnection}
                bgColor="bg-white"
                textColor="text-blue-600"
                borderColor="border-blue-600"
                borderWidth="border-2"
                height="h-10"
                px="px-4"
                fontSize="text-sm"
                fontWeight="font-medium"
                rounded="rounded-md"
                hover="hover:bg-blue-50"
                isIcon={true}
                icon={TestTube}
                isIconLeft={true}
              />

              <FilledButton
                buttonText="Save Settings"
                type="submit"
                bgColor="bg-blue-600"
                textColor="text-white"
                height="h-10"
                px="px-6"
                fontSize="text-sm"
                fontWeight="font-medium"
                rounded="rounded-md"
                onClick={handleSubmit}
                icon={Mail}
                isIcon={true}
                isIconLeft={true}
              />
            </Container>
          </Container>
        </div>
      </Card>
    </Container>
  );
};

export default SmtpSettings;
