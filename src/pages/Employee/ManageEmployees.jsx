import React, { useState } from "react";
import EmployeesList from "./EmployeesList";
import EmployeeForm from "./EmployeeForm";
import { Plus } from "lucide-react";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import { useHR } from "../../Contexts/HrContext/HrContext";

const ManageEmployees = () => {
  const { formMode, setFormMode, setSelectedEmployee } = useHR();
  const [showForm, setShowForm] = useState(false);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setFormMode("create");
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
  };

  return (
    <div>
      {!showForm && formMode !== "view" && formMode !== "edit" ? (
        <>
          <div className="flex justify-end mb-4">
            <FilledButton
              isIcon
              icon={Plus}
              isIconLeft
              buttonText="Add Employee"
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
          <div className="flex justify-start mb-4">
            <FilledButton
              buttonText="Back to List"
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
