import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import Container from "../../../components/elements/container/Container";
import BodyHeader from "../../../components/elements/bodyHeader/BodyHeader";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Card from "../../../components/elements/card/Card";
import Table from "../../../components/elements/table/Table";
import Thead from "../../../components/elements/thead/Thead";
import TR from "../../../components/elements/tr/TR";
import TH from "../../../components/elements/th/TH";
import Tbody from "../../../components/elements/tbody/Tbody";
import Skeleton from "../../../components/elements/skeleton/Skeleton";
import TD from "../../../components/elements/td/TD";
import OutlineButton from "../../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import Modall from "../../../components/elements/modal/Modal";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import Badge from "../../../components/elements/badge/Badge";

const ManageModules = () => {
  // Sample modules data
  const initialModules = [
    {
      id: 1,
      name: "User Management",
      description: "Manage system users and permissions",
      status: "active",
      created: "2023-05-15",
    },
    {
      id: 2,
      name: "Content Management",
      description: "Create and manage website content",
      status: "inactive",
      created: "2023-06-20",
    },
    {
      id: 3,
      name: "Analytics Dashboard",
      description: "View system analytics and reports",
      status: "active",
      created: "2023-07-10",
    },
    {
      id: 4,
      name: "Billing System",
      description: "Manage subscriptions and payments",
      status: "active",
      created: "2023-08-05",
    },
    {
      id: 5,
      name: "Notification Center",
      description: "Configure and send notifications",
      status: "inactive",
      created: "2023-09-12",
    },
  ];

  const [modules, setModules] = useState(initialModules);
  const [filteredModules, setFilteredModules] = useState(initialModules);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentModule, setCurrentModule] = useState({
    id: "",
    name: "",
    description: "",
    status: "active",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    variant: "success",
    message: "",
  });

  // Status options for SelectBox
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Filter modules based on search term
  useEffect(() => {
    const results = modules.filter(
      (module) =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredModules(results);
  }, [searchTerm, modules]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusToggle = (moduleId) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              status: module.status === "active" ? "inactive" : "active",
            }
          : module
      )
    );
    setAlert({
      show: true,
      variant: "success",
      message: "Module status updated successfully!",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentModule({ ...currentModule, [name]: value });
  };

  const handleSelectChange = (value) => {
    setCurrentModule({ ...currentModule, status: value });
  };

  const handleSubmit = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isEditing) {
        // Update existing module
        setModules(
          modules.map((module) =>
            module.id === currentModule.id ? currentModule : module
          )
        );
        setAlert({
          show: true,
          variant: "success",
          message: "Module updated successfully!",
        });
      } else {
        // Add new module
        const newModule = {
          ...currentModule,
          id: Date.now(), // Better ID generation
          created: new Date().toISOString().split("T")[0],
        };
        setModules([...modules, newModule]);
        setAlert({
          show: true,
          variant: "success",
          message: "Module added successfully!",
        });
      }

      setIsLoading(false);
      setShowModal(false);
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setCurrentModule({ id: "", name: "", description: "", status: "active" });
    setIsEditing(false);
  };

  const handleEdit = (module) => {
    setCurrentModule(module);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (module) => {
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setModules(modules.filter((module) => module.id !== moduleToDelete.id));
      setAlert({
        show: true,
        variant: "success",
        message: "Module deleted successfully!",
      });
      setIsLoading(false);
      setShowDeleteModal(false);
      setModuleToDelete(null);
    }, 800);
  };

  const handleCancelModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCancelDeleteModal = () => {
    setShowDeleteModal(false);
    setModuleToDelete(null);
  };

  return (
    <Container className="py-6 px-4 max-w-7xl">
      {/* Alert */}
      {alert.show && (
        <Alert
          variant={alert.variant}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
          className="mb-4"
        />
      )}

      {/* Header */}
      <BodyHeader
        heading="Manage Modules"
        subHeading="View, add, edit, and manage system modules"
      />

      {/* Search and Add Button */}
      <Container className="flex flex-col md:flex-row gap-4 mb-6 mt-6">
        <Container className="flex-1">
          <Container className="relative">
            <input
              type="text"
              placeholder="Search modules by name or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </Container>
        </Container>
        <Container className="flex justify-end">
          <FilledButton
            isIcon={true}
            icon={FiPlus}
            isIconLeft={true}
            buttonText="Add New Module"
            onClick={() => setShowModal(true)}
            bgColor="bg-blue-600"
            textColor="text-white"
            height="h-10"
            px="px-4"
          />
        </Container>
      </Container>

      {/* Table */}
      <Card className="shadow-sm">
        <Container className="overflow-x-auto">
          <Table>
            <Thead className="bg-gray-50">
              <TR>
                <TH>Module Name</TH>
                <TH>Description</TH>
                <TH>Status</TH>
                <TH>Created</TH>
                <TH>Actions</TH>
              </TR>
            </Thead>
            <Tbody>
              {isLoading && filteredModules.length === 0 ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <TR key={index}>
                    <TD>
                      <Skeleton height="20px" width="120px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="200px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="80px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="100px" />
                    </TD>
                    <TD>
                      <Skeleton height="20px" width="120px" />
                    </TD>
                  </TR>
                ))
              ) : filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                  <TR key={module.id}>
                    <TD className="font-semibold text-gray-900">
                      {module.name}
                    </TD>
                    <TD className="text-gray-600">{module.description}</TD>
                    <TD>
                      <Badge
                        variant={
                          module.status === "active" ? "success" : "secondary"
                        }
                      >
                        {module.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TD>
                    <TD className="text-gray-600">{module.created}</TD>
                    <TD>
                      <Container className="flex gap-2">
                        <OutlineButton
                          isIcon={true}
                          icon={FiEdit2}
                          borderColor="border-blue-500"
                          borderWidth="border"
                          textColor="text-blue-500"
                          bgColor="bg-white"
                          rounded="rounded-md"
                          height="h-8"
                          width="w-8"
                          fontSize="text-sm"
                          hover="hover:bg-blue-50"
                          onClick={() => handleEdit(module)}
                          px="px-0"
                        />
                        <OutlineButton
                          isIcon={true}
                          icon={FiTrash2}
                          borderColor="border-red-500"
                          borderWidth="border"
                          textColor="text-red-500"
                          bgColor="bg-white"
                          rounded="rounded-md"
                          height="h-8"
                          width="w-8"
                          fontSize="text-sm"
                          hover="hover:bg-red-50"
                          onClick={() => handleDeleteClick(module)}
                          px="px-0"
                        />
                        <OutlineButton
                          isIcon={true}
                          icon={
                            module.status === "active"
                              ? FiToggleLeft
                              : FiToggleRight
                          }
                          borderColor={
                            module.status === "active"
                              ? "border-green-500"
                              : "border-gray-500"
                          }
                          borderWidth="border"
                          textColor={
                            module.status === "active"
                              ? "text-green-500"
                              : "text-gray-500"
                          }
                          bgColor="bg-white"
                          rounded="rounded-md"
                          height="h-8"
                          width="w-8"
                          fontSize="text-sm"
                          hover={
                            module.status === "active"
                              ? "hover:bg-green-50"
                              : "hover:bg-gray-50"
                          }
                          onClick={() => handleStatusToggle(module.id)}
                          px="px-0"
                        />
                      </Container>
                    </TD>
                  </TR>
                ))
              ) : (
                <TR>
                  <TD colSpan={5} className="text-center py-8 text-gray-500">
                    No modules found. Try a different search or add a new
                    module.
                  </TD>
                </TR>
              )}
            </Tbody>
          </Table>
        </Container>
      </Card>

      {/* Add/Edit Module Modal */}
      <Modall
        title={isEditing ? "Edit Module" : "Add New Module"}
        modalOpen={showModal}
        setModalOpen={setShowModal}
        okText={isEditing ? "Update Module" : "Add Module"}
        cancelText="Cancel"
        okAction={handleSubmit}
        cancelAction={handleCancelModal}
        okButtonDisabled={isLoading}
        width={600}
        body={
          <Container className="space-y-4">
            <InputField
              label="Module Name"
              name="name"
              placeholder="Enter module name"
              type="text"
              value={currentModule.name}
              onChange={handleInputChange}
              width="w-full"
              marginBottom="mb-4"
            />

            <Container className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={currentModule.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter module description"
              />
            </Container>

            <SelectBox
              label="Status"
              name="status"
              placeholder="Select status"
              optionList={statusOptions}
              value={currentModule.status}
              handleChange={handleSelectChange}
              width="w-full"
              marginBottom="mb-4"
            />
          </Container>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modall
        title="Confirm Deletion"
        modalOpen={showDeleteModal}
        setModalOpen={setShowDeleteModal}
        okText="Delete Module"
        cancelText="Cancel"
        okAction={confirmDelete}
        cancelAction={handleCancelDeleteModal}
        okButtonDisabled={isLoading}
        width={500}
        body={
          <Container>
            <p className="text-gray-700">
              Are you sure you want to delete the module{" "}
              <span className="font-semibold text-gray-900">
                {moduleToDelete?.name}
              </span>
              ? This action cannot be undone.
            </p>
          </Container>
        }
      />
    </Container>
  );
};

export default ManageModules;
