import React, { useState } from "react";

import { Lock, Eye, EyeOff } from "lucide-react";
import Container from "../../../components/elements/container/Container";
import Alert from "../../../components/elements/alert/Alert";
import Card from "../../../components/elements/card/Card";
import InputField from "../../../components/elements/inputField/InputField";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";

const AccountSettings = () => {
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
      newErrors.oldPassword = { message: "Current password is required" };
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = { message: "New password is required" };
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = {
        message: "New password must be at least 6 characters",
      };
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = {
        message: "Please confirm your new password",
      };
    }

    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.passwordMatch = { message: "Passwords do not match!" };
    }

    if (
      formData.oldPassword &&
      formData.newPassword &&
      formData.oldPassword === formData.newPassword
    ) {
      newErrors.samePassword = {
        message: "New password must be different from current password",
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
        message: "Password updated successfully!",
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
        message: "Please fix the errors below",
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
          Account Settings
        </h2>

        <div className="space-y-6">
          <Container className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Password Security
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Use a strong password with at least 6 characters, including
                  letters, numbers, and special characters.
                </p>
              </div>
            </div>
          </Container>

          <InputField
            name="oldPassword"
            label="Current Password"
            placeholder="Enter your current password"
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
            label="New Password"
            placeholder="Enter your new password"
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
            label="Confirm New Password"
            placeholder="Confirm your new password"
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
            <Container className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
              <p className="text-sm text-red-700">
                {errors.passwordMatch.message}
              </p>
            </Container>
          )}

          {/* Display same password error */}
          {errors.samePassword && (
            <Container className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
              <p className="text-sm text-red-700">
                {errors.samePassword.message}
              </p>
            </Container>
          )}

          <Container className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Reset Form
            </button>

            <Container className="flex space-x-3">
              <FilledButton
                buttonText="Change Password"
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
                isIconLeft={true}
              />
            </Container>
          </Container>
        </div>
      </Card>
    </Container>
  );
};

export default AccountSettings;
