import React, { useEffect, useState } from "react";
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

  return (
    <Container className="py-4">
      <BodyHeader
        heading="Employee Management"
        subHeading="View and manage all employees"
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
          <div className="p-8 text-center">Loading employees...</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center">No employees found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <Thead>
                  <TR>
                    <TH>Employee</TH>
                    <TH>Code</TH>
                    <TH>Contact</TH>
                    <TH>Status</TH>
                    <TH>Branch</TH>
                    <TH>Role</TH>
                    <TH>Actions</TH>
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
                              className="w-10 h-10 rounded-full object-cover mr-3"
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
                          {employee.Status}
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
                            borderColor="border-gray-300"
                            borderWidth="border"
                            rounded="rounded-md"
                            bgColor="bg-white"
                            textColor="text-gray-700"
                            height="h-8"
                            width="w-8"
                            px="px-0"
                          />
                          <OutlineButton
                            isIcon
                            icon={Pencil}
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setFormMode("edit");
                            }}
                            borderColor="border-gray-300"
                            borderWidth="border"
                            rounded="rounded-md"
                            bgColor="bg-white"
                            textColor="text-gray-700"
                            height="h-8"
                            width="w-8"
                            px="px-0"
                          />
                          <OutlineButton
                            isIcon
                            icon={Trash2}
                            onClick={() => handleDelete(employee.Id)}
                            borderColor="border-gray-300"
                            borderWidth="border"
                            rounded="rounded-md"
                            bgColor="bg-white"
                            textColor="text-gray-700"
                            height="h-8"
                            width="w-8"
                            px="px-0"
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
