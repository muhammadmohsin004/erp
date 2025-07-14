import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useHR } from "../../Contexts/HrContext/HrContext";
import Container from "../../components/elements/container/Container";
import BodyHeader from "../../components/elements/bodyHeader/BodyHeader";
import Alert from "../../components/elements/Alert/Alert";
import Card from "../../components/elements/card/Card";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import Table from "../../components/elements/table/Table";
import Thead from "../../components/elements/thead/Thead";
import TR from "../../components/elements/tr/TR";
import TH from "../../components/elements/th/TH";
import Tbody from "../../components/elements/tbody/Tbody";
import TD from "../../components/elements/td/TD";
import Badge from "../../components/elements/Badge/Badge";
import Pagination from "../../components/elements/Pagination/Pagination";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import employeeTranslations from "../../translations/employeeTranslations";

const EmployeesList = () => {
  const {
    employees,
    loading,
    error,
    pagination,
    fetchEmployees,
    deleteEmployee,
    setSelectedEmployee,
    setFormMode,
    goToPage,
    clearError,
  } = useHR();

  // Get current language from Redux store
  const { language: currentLanguage } = useSelector((state) => state.language);

  // Get translations based on current language
  const t = employeeTranslations[currentLanguage] || employeeTranslations.en;

  // Check if current language is Arabic for RTL support
  const isArabic = currentLanguage === "ar";

  // Remove search and filter related states and functions since we're not using them
  const [sortConfig, setSortConfig] = useState({
    sortBy: "CreatedAt",
    sortAscending: false,
  });

  useEffect(() => {
    fetchEmployees(pagination.currentPage, sortConfig);
  }, [fetchEmployees, pagination.currentPage, sortConfig]);

  const handleDelete = async (id) => {
    const { success } = await deleteEmployee(id);
    if (success) {
      fetchEmployees(pagination.currentPage, sortConfig);
    }
  };

  const statusVariant = {
    Active: "success",
    Inactive: "warning",
    "On Leave": "info",
    Terminated: "danger",
  };

  // Translate status based on current language
  const getTranslatedStatus = (status) => {
    const statusMap = {
      Active: t.active,
      Inactive: t.inactive,
      "On Leave": t.onLeave,
      Terminated: t.terminated,
    };
    return statusMap[status] || status;
  };

  return (
    <Container className="py-4" dir={isArabic ? "rtl" : "ltr"}>
      <BodyHeader
        heading={t.employeeManagement}
        subHeading={t.viewAndManageEmployees}
      />

      {error && (
        <Alert
          variant="danger"
          message={error}
          onClose={clearError}
          className="mb-4"
        />
      )}

      <Card>
        {loading ? (
          <div className="p-8 text-center">{t.loadingEmployees}</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center">{t.noEmployeesFound}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <Thead>
                  <TR>
                    <TH>{t.employee}</TH>
                    <TH>{t.code}</TH>
                    <TH>{t.contact}</TH>
                    <TH>{t.status}</TH>
                    <TH>{t.branch}</TH>
                    <TH>{t.role}</TH>
                    <TH>{t.actions}</TH>
                  </TR>
                </Thead>
                <Tbody>
                  {employees.map((employee) => (
                    <TR key={employee.Id}>
                      <TD>
                        <div className="flex items-center">
                          {employee.Image && (
                            <img
                              src={employee.Image}
                              alt={employee.F_Name}
                              className={`w-10 h-10 rounded-full object-cover ${
                                isArabic ? "ml-3" : "mr-3"
                              }`}
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {employee.F_Name} {employee.Surname}
                            </div>
                            <div className="text-gray-500">
                              {employee.Email}
                            </div>
                          </div>
                        </div>
                      </TD>
                      <TD>{employee.Code}</TD>
                      <TD>
                        <div className="text-gray-900">
                          {employee.MobileNumber}
                        </div>
                        <div className="text-gray-500">
                          {employee.PhoneNumber}
                        </div>
                      </TD>
                      <TD>
                        <Badge variant={statusVariant[employee.Status]}>
                          {getTranslatedStatus(employee.Status)}
                        </Badge>
                      </TD>
                      <TD>{employee.Branch}</TD>
                      <TD>{employee.Role}</TD>
                      <TD>
                        <div className="flex gap-2">
                          <OutlineButton
                            isIcon
                            icon={Eye}
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setFormMode("view");
                            }}
                            borderColor="border-blue-300"
                            borderWidth="border"
                            rounded="rounded-md"
                            bgColor="bg-blue-50"
                            textColor="text-blue-600"
                            height="h-8"
                            width="w-8"
                            px="px-0"
                            hover="hover:bg-blue-100 hover:border-blue-400"
                          />
                          <OutlineButton
                            isIcon
                            icon={Pencil}
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setFormMode("edit");
                            }}
                            borderColor="border-green-300"
                            borderWidth="border"
                            rounded="rounded-md"
                            bgColor="bg-green-50"
                            textColor="text-green-600"
                            height="h-8"
                            width="w-8"
                            px="px-0"
                            hover="hover:bg-green-100 hover:border-green-400"
                          />
                          <OutlineButton
                            isIcon
                            icon={Trash2}
                            onClick={() => handleDelete(employee.Id)}
                            borderColor="border-red-300"
                            borderWidth="border"
                            rounded="rounded-md"
                            bgColor="bg-red-50"
                            textColor="text-red-600"
                            height="h-8"
                            width="w-8"
                            px="px-0"
                            hover="hover:bg-red-100 hover:border-red-400"
                          />
                        </div>
                      </TD>
                    </TR>
                  ))}
                </Tbody>
              </Table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={goToPage}
              />
            </div>
          </>
        )}
      </Card>
    </Container>
  );
};

export default EmployeesList;
