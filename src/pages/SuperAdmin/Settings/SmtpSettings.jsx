import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Mail, Server, Shield, Key, User, TestTube } from "lucide-react";
import Container from "../../../components/elements/container/Container";
import Alert from "../../../components/elements/alert/Alert";
import Card from "../../../components/elements/card/Card";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import OutlineButton from "../../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import { translations } from "../../../translations/SmtpSettingstranslation";

const SmtpSettings = () => {
  // Get current language from Redux
  const { language: currentLanguage } = useSelector((state) => state.language);
  
  // Get translations for current language
  const t = translations[currentLanguage] || translations.en;
  const isArabic = currentLanguage === "ar";

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
    { value: "tls", label: t.smtpSettings.encryptionTLS },
    { value: "ssl", label: t.smtpSettings.encryptionSSL },
    { value: "none", label: t.smtpSettings.encryptionNone },
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
      newErrors.smtpHost = { message: t.smtpSettings.smtpHostRequired };
    }

    if (!formData.smtpPort.trim()) {
      newErrors.smtpPort = { message: t.smtpSettings.smtpPortRequired };
    } else if (isNaN(formData.smtpPort) || parseInt(formData.smtpPort) <= 0) {
      newErrors.smtpPort = { message: t.smtpSettings.portMustBeNumber };
    }

    if (!formData.smtpUsername.trim()) {
      newErrors.smtpUsername = { message: t.smtpSettings.usernameRequired };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.smtpUsername)) {
      newErrors.smtpUsername = {
        message: t.smtpSettings.validEmailRequired,
      };
    }

    if (!formData.smtpPassword.trim()) {
      newErrors.smtpPassword = { message: t.smtpSettings.passwordRequired };
    }

    if (!formData.encryption) {
      newErrors.encryption = { message: t.smtpSettings.encryptionRequired };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTest = () => {
    if (!validateForm()) {
      setAlert({
        show: true,
        message: t.smtpSettings.fillRequiredFields,
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
          ? t.smtpSettings.smtpConnectionSuccess
          : t.smtpSettings.smtpConnectionFailed,
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
        message: t.smtpSettings.settingsUpdated,
        variant: "success",
      });

      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, message: "", variant: "success" });
      }, 3000);
    } else {
      setAlert({
        show: true,
        message: t.smtpSettings.fixErrors,
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
    <Container className={`max-w-2xl mx-auto p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
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
          <Mail className={`h-6 w-6 text-blue-600 ${isArabic ? 'ml-3' : 'mr-3'}`} />
          <h2 className="text-xl font-semibold text-gray-900">
            {t.smtpSettings.title}
          </h2>
        </Container>

        <Container className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-center">
            <Server className={`h-5 w-5 text-blue-600 ${isArabic ? 'ml-3' : 'mr-3'}`} />
            <div>
              <p className="text-sm text-blue-700 font-medium">
                {t.smtpSettings.emailServerConfig}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {t.smtpSettings.emailServerConfigDesc}
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
            label={t.smtpSettings.smtpHost}
            placeholder={t.smtpSettings.smtpHostPlaceholder}
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
            label={t.smtpSettings.smtpPort}
            placeholder={t.smtpSettings.smtpPortPlaceholder}
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
            label={t.smtpSettings.username}
            placeholder={t.smtpSettings.usernamePlaceholder}
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
            label={t.smtpSettings.password}
            placeholder={t.smtpSettings.passwordPlaceholder}
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
            label={t.smtpSettings.encryptionMethod}
            placeholder={t.smtpSettings.encryptionPlaceholder}
            value={formData.encryption}
            handleChange={handleSelectChange}
            optionList={encryptionOptions}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
          />

          <Container className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center">
              <Shield className={`h-5 w-5 text-yellow-600 ${isArabic ? 'ml-3' : 'mr-3'}`} />
              <div>
                <p className="text-sm text-yellow-700 font-medium">
                  {t.smtpSettings.securityRecommendations}
                </p>
                <ul className="text-xs text-yellow-600 mt-1 space-y-1">
                  <li>{t.smtpSettings.securityTip1}</li>
                  <li>{t.smtpSettings.securityTip2}</li>
                  <li>{t.smtpSettings.securityTip3}</li>
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
              {t.smtpSettings.resetForm}
            </button>

            <Container className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <OutlineButton
                buttonText={
                  isTestingConnection ? t.smtpSettings.testing : t.smtpSettings.testConnection
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
                buttonText={t.smtpSettings.saveSettings}
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