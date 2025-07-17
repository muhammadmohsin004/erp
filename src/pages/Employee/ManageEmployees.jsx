import React, { useState } from "react";
import { useSelector } from "react-redux";
import EmployeesList from "./EmployeesList";
import EmployeeForm from "./EmployeeForm";
import { Plus } from "lucide-react";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import { useHR } from "../../Contexts/HrContext/HrContext";
import employeeTranslations from "../../translations/employeeTranslations";

const ManageEmployees = () => {
  const { formMode, setFormMode, setSelectedEmployee } = useHR();
  const [showForm, setShowForm] = useState(false);

  // Get current language from Redux store
  const { language: currentLanguage } = useSelector((state) => state.language);

  // Get translations based on current language
  const t = employeeTranslations[currentLanguage] || employeeTranslations.en;

  // Check if current language is Arabic for RTL support
  const isArabic = currentLanguage === "ar";

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setFormMode("create");
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
    setFormMode("list"); // Reset form mode to a neutral state
    setSelectedEmployee(null); // Clear selected employee
  };

  // Show form when explicitly set to show or when in view/edit/create modes
  const shouldShowForm =
    showForm ||
    formMode === "view" ||
    formMode === "edit" ||
    formMode === "create";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={isArabic ? "font-arabic" : ""}
    >
      {!shouldShowForm ? (
        <>
          <div
            className={`flex mb-4 ${
              isArabic ? "justify-start" : "justify-end"
            }`}
          >
            <FilledButton
              isIcon
              icon={Plus}
              isIconLeft={!isArabic}
              isIconRight={isArabic}
              buttonText={t.addEmployee}
              onClick={handleAddEmployee}
              bgColor="bg-primary"
              textColor="text-white"
              rounded="rounded-md"
              height="h-10"
              width="w-40"
            />
          </div>
          <EmployeesList />
        </>
      ) : (
        <>
          <div
            className={`flex mb-4 ${
              isArabic ? "justify-end" : "justify-start"
            }`}
          >
            <FilledButton
              buttonText={t.backToList}
              onClick={handleBackToList}
              bgColor="bg-gray-500"
              textColor="text-white"
              rounded="rounded-md"
              height="h-10"
              width="w-32"
            />
          </div>
          <EmployeeForm />
        </>
      )}
    </div>
  );
};

export default ManageEmployees;
