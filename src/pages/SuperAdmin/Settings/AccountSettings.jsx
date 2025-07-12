import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Lock, Eye, EyeOff } from "lucide-react";
import Container from "../../../components/elements/container/Container";
import Alert from "../../../components/elements/alert/Alert";
import Card from "../../../components/elements/card/Card";
import InputField from "../../../components/elements/inputField/InputField";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import { translations } from "../../../translations/AccountSettingtranslation";

const AccountSettings = () => {
  // Get current language from Redux
  const { language: currentLanguage } = useSelector((state) => state.language);
  
  // Get translations for current language
  const t = translations[currentLanguage] || translations.en;
  const isArabic = currentLanguage === "ar";

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [errors, setErrors] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }

    // Clear password match error when user modifies password fields
    if (name === "newPassword" || name === "confirmPassword") {
      if (errors.passwordMatch) {
        setErrors({
          ...errors,
          passwordMatch: null,
        });
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = { message: t.accountSettings.currentPasswordRequired };
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = { message: t.accountSettings.newPasswordRequired };
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = {
        message: t.accountSettings.newPasswordMinLength,
      };
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = {
        message: t.accountSettings.confirmPasswordRequired,
      };
    }

    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.passwordMatch = { message: t.accountSettings.passwordsDoNotMatch };
    }

    if (
      formData.oldPassword &&
      formData.newPassword &&
      formData.oldPassword === formData.newPassword
    ) {
      newErrors.samePassword = {
        message: t.accountSettings.newPasswordMustBeDifferent,
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Password changed:", formData);
      setAlert({
        show: true,
        message: t.accountSettings.passwordUpdatedSuccess,
        variant: "success",
      });

      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, message: "", variant: "success" });
      }, 3000);
    } else {
      setAlert({
        show: true,
        message: t.accountSettings.fixErrorsBelow,
        variant: "danger",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
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
        <h2 className={`text-xl font-semibold text-gray-900 mb-6 ${isArabic ? 'text-right' : 'text-left'}`}>
          {t.accountSettings.title}
        </h2>

        <div className="space-y-6">
          <Container className={`bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 ${isArabic ? 'border-r-4 border-l-0' : ''}`}>
            <div className={`flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
              <Lock className={`h-5 w-5 text-blue-600 ${isArabic ? 'ml-3' : 'mr-3'}`} />
              <div className={isArabic ? 'text-right' : 'text-left'}>
                <p className="text-sm text-blue-700 font-medium">
                  {t.accountSettings.passwordSecurity}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {t.accountSettings.passwordSecurityDesc}
                </p>
              </div>
            </div>
          </Container>

          <InputField
            name="oldPassword"
            label={t.accountSettings.currentPassword}
            placeholder={t.accountSettings.currentPasswordPlaceholder}
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
            icon={Lock}
            isVisible={passwordVisibility.oldPassword}
            setIsVisible={() => togglePasswordVisibility("oldPassword")}
          />

          <InputField
            name="newPassword"
            label={t.accountSettings.newPassword}
            placeholder={t.accountSettings.newPasswordPlaceholder}
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
            icon={Lock}
            isVisible={passwordVisibility.newPassword}
            setIsVisible={() => togglePasswordVisibility("newPassword")}
          />

          <InputField
            name="confirmPassword"
            label={t.accountSettings.confirmPassword}
            placeholder={t.accountSettings.confirmPasswordPlaceholder}
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            errors={errors}
            width="w-full"
            marginBottom="mb-4"
            icon={Lock}
            isVisible={passwordVisibility.confirmPassword}
            setIsVisible={() => togglePasswordVisibility("confirmPassword")}
          />

          {/* Display password match error */}
          {errors.passwordMatch && (
            <Container className={`bg-red-50 border-l-4 border-red-400 p-3 mb-4 ${isArabic ? 'border-r-4 border-l-0 text-right' : ''}`}>
              <p className="text-sm text-red-700">
                {errors.passwordMatch.message}
              </p>
            </Container>
          )}

          {/* Display same password error */}
          {errors.samePassword && (
            <Container className={`bg-red-50 border-l-4 border-red-400 p-3 mb-4 ${isArabic ? 'border-r-4 border-l-0 text-right' : ''}`}>
              <p className="text-sm text-red-700">
                {errors.samePassword.message}
              </p>
            </Container>
          )}

          <Container className={`flex justify-between items-center pt-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              {t.accountSettings.resetForm}
            </button>

            <Container className={`flex space-x-3 ${isArabic ? 'space-x-reverse' : ''}`}>
              <FilledButton
                buttonText={t.accountSettings.changePassword}
                type="submit"
                bgColor="bg-blue-600"
                textColor="text-white"
                height="h-10"
                px="px-6"
                fontSize="text-sm"
                fontWeight="font-medium"
                rounded="rounded-md"
                onClick={handleSubmit}
                icon={Lock}
                isIcon={true}
                isIconLeft={!isArabic} // For Arabic, put icon on the right
              />
            </Container>
          </Container>
        </div>
      </Card>
    </Container>
  );
};

export default AccountSettings;