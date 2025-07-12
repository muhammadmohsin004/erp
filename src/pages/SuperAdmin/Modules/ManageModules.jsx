import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import { getTranslation } from "../../../translations/ManageModulestranslation";

const ManageModules = () => {
  // Redux state for language
  const { language: currentLanguage } = useSelector((state) => state.language);
  const isArabic = currentLanguage === "ar";

  // Helper function to get translated text
  const t = (key) => getTranslation(key, currentLanguage);

  // Sample modules data with translations
  const getInitialModules = () => [
    {
      id: 1,
      name: t("userManagement"),
      description: t("userManagementDesc"),
      status: "active",
      created: "2023-05-15",
    },
    {
      id: 2,
      name: t("contentManagement"),
      description: t("contentManagementDesc"),
      status: "inactive",
      created: "2023-06-20",
    },
    {
      id: 3,
      name: t("analyticsDashboard"),
      description: t("analyticsDashboardDesc"),
      status: "active",
      created: "2023-07-10",
    },
    {
      id: 4,
      name: t("billingSystem"),
      description: t("billingSystemDesc"),
      status: "active",
      created: "2023-08-05",
    },
    {
      id: 5,
      name: t("notificationCenter"),
      description: t("notificationCenterDesc"),
      status: "inactive",
      created: "2023-09-12",
    },
  ];

  const [modules, setModules] = useState(getInitialModules());
  const [filteredModules, setFilteredModules] = useState(getInitialModules());
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

  // Update modules when language changes
  useEffect(() => {
    const updatedModules = getInitialModules();
    setModules(updatedModules);
    setFilteredModules(updatedModules);
  }, [currentLanguage]);

  // Status options for SelectBox with translations
  const statusOptions = [
    { value: "active", label: t("active") },
    { value: "inactive", label: t("inactive") },
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
      message: t("moduleStatusUpdated"),
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
          message: t("moduleUpdated"),
        });
      } else {
        // Add new module
        const newModule = {
          ...currentModule,
          id: Date.now(),
          created: new Date().toISOString().split("T")[0],
        };
        setModules([...modules, newModule]);
        setAlert({
          show: true,
          variant: "success",
          message: t("moduleAdded"),
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
        message: t("moduleDeleted"),
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
    <Container className={`py-6 px-4 max-w-7xl ${isArabic ? 'rtl' : 'ltr'}`}>
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
        heading={t("manageModules")}
        subHeading={t("manageModulesSubheading")}
      />

      {/* Search and Add Button */}
      <Container className="flex flex-col md:flex-row gap-4 mb-6 mt-6">
        <Container className="flex-1">
          <Container className="relative">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <FiSearch className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
          </Container>
        </Container>
        <Container className="flex justify-end">
          <FilledButton
            isIcon={true}
            icon={FiPlus}
            isIconLeft={!isArabic}
            buttonText={t("addNewModule")}
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
                <TH>{t("moduleName")}</TH>
                <TH>{t("description")}</TH>
                <TH>{t("status")}</TH>
                <TH>{t("created")}</TH>
                <TH>{t("actions")}</TH>
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
                        {module.status === "active" ? t("active") : t("inactive")}
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
                    {t("noModulesFound")}
                  </TD>
                </TR>
              )}
            </Tbody>
          </Table>
        </Container>
      </Card>

      {/* Add/Edit Module Modal */}
      <Modall
        title={isEditing ? t("editModule") : t("addModule")}
        modalOpen={showModal}
        setModalOpen={setShowModal}
        okText={isEditing ? t("updateModule") : t("addModuleBtn")}
        cancelText={t("cancel")}
        okAction={handleSubmit}
        cancelAction={handleCancelModal}
        okButtonDisabled={isLoading}
        width={600}
        body={
          <Container className="space-y-4">
            <InputField
              label={t("moduleNameLabel")}
              name="name"
              placeholder={t("moduleNamePlaceholder")}
              type="text"
              value={currentModule.name}
              onChange={handleInputChange}
              width="w-full"
              marginBottom="mb-4"
            />

            <Container className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("descriptionLabel")}
              </label>
              <textarea
                name="description"
                value={currentModule.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t("descriptionPlaceholder")}
              />
            </Container>

            <SelectBox
              label={t("statusLabel")}
              name="status"
              placeholder={t("statusPlaceholder")}
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
        title={t("confirmDeletion")}
        modalOpen={showDeleteModal}
        setModalOpen={setShowDeleteModal}
        okText={t("deleteModule")}
        cancelText={t("cancel")}
        okAction={confirmDelete}
        cancelAction={handleCancelDeleteModal}
        okButtonDisabled={isLoading}
        width={500}
        body={
          <Container>
            <p className="text-gray-700">
              {t("deleteConfirmation")}{" "}
              <span className="font-semibold text-gray-900">
                {moduleToDelete?.name}
              </span>
              {t("deleteWarning")}
            </p>
          </Container>
        }
      />
    </Container>
  );
};

export default ManageModules;