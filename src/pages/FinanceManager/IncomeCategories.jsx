import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Plus,
  Download,
  Filter,
  Search,
  Tag,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Palette,
  Users,
  AlertCircle,
} from "lucide-react";
import { useIncomeCategory } from "../../Contexts/IncomeCategoryContext/IncomeCategoryContext";
import Badge from "../../components/elements/Badge/Badge";
import Container from "../../components/elements/container/Container";
import BodyHeader from "../../components/elements/bodyHeader/BodyHeader";
import Card from "../../components/elements/card/Card";
import Skeleton from "../../components/elements/skeleton/Skeleton";
import OutlineButton from "../../components/elements/elements/buttons/OutlineButton/OutlineButton";
import FilledButton from "../../components/elements/elements/buttons/filledButton/FilledButton";
import SearchAndFilters from "../../components/elements/searchAndFilters/SearchAndFilters";
import SelectBox from "../../components/elements/selectBox/SelectBox";
import Table from "../../components/elements/table/Table";
import Thead from "../../components/elements/thead/Thead";
import TR from "../../components/elements/tr/TR";
import TH from "../../components/elements/th/TH";
import TD from "../../components/elements/td/TD";
import Tbody from "../../components/elements/tbody/Tbody";
import Dropdown from "../../components/elements/dropdown/Dropdown";
import Pagination from "../../components/elements/Pagination/Pagination";
import Modall from "../../components/elements/modal/Modal";
import InputField from "../../components/elements/inputField/InputField";
import CheckboxField from "../../components/elements/checkbox/CheckboxField";

const IncomeCategories = () => {
  const {
    incomeCategories,
    currentIncomeCategory,
    categoryStatistics,
    categoryPerformance,
    recentIncomes,
    loading,
    error,
    pagination,
    filters,
    getIncomeCategories,
    getIncomeCategory,
    createIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
    toggleIncomeCategoryStatus,
    getCategoryStatistics,
    getCategoryPerformance,
    searchIncomeCategories,
    filterIncomeCategoriesByStatus,
    changePage,
    changePageSize,
    clearError,
  } = useIncomeCategory();

  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Simplified form state to match API payload
  const [categoryForm, setCategoryForm] = useState({
    Name: "",
    Description: "",
    Color: "#3498db",
    IsActive: true,
  });

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    getIncomeCategories();
    getCategoryPerformance();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchValue.trim()) {
        searchIncomeCategories(searchValue);
      } else {
        getIncomeCategories();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchValue]);

  // Clear error when component unmounts or modals close
  useEffect(() => {
    if (!showAddModal && !showEditModal && error) {
      clearError();
    }
  }, [showAddModal, showEditModal, error, clearError]);

  const validateForm = () => {
    const errors = {};

    if (!categoryForm.Name.trim()) {
      errors.Name = "Category name is required";
    }

    if (!categoryForm.Color.trim()) {
      errors.Color = "Color is required";
    }

    // Validate color format (should be hex color)
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (categoryForm.Color && !colorRegex.test(categoryForm.Color)) {
      errors.Color = "Please enter a valid hex color (e.g., #3498db)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status === "") {
      getIncomeCategories();
    } else {
      filterIncomeCategoriesByStatus(status === "active");
    }
  };

  const handleAddCategory = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createIncomeCategory(categoryForm);
      setShowAddModal(false);
      resetForm();
      await getIncomeCategories(); // Refresh the list

      // Show success message (you might want to implement a toast notification)
      console.log("Category created successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      // Error is already handled in context, so it will show in the error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateIncomeCategory(editingCategory.Id, categoryForm);
      setShowEditModal(false);
      setEditingCategory(null);
      resetForm();
      await getIncomeCategories(); // Refresh the list

      // Show success message
      console.log("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      // Error is already handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      try {
        const success = await deleteIncomeCategory(id);
        if (success) {
          await getIncomeCategories(); // Refresh the list
          console.log("Category deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const success = await toggleIncomeCategoryStatus(id);
      if (success) {
        await getIncomeCategories(); // Refresh the list
        console.log("Category status updated successfully!");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      Name: category.Name || "",
      Description: category.Description || "",
      Color: category.Color || "#3498db",
      IsActive: category.IsActive !== undefined ? category.IsActive : true,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const openDetailsModal = async (category) => {
    setViewingCategory(category);
    setShowDetailsModal(true);
    await getIncomeCategory(category.Id);
    await getCategoryStatistics(
      category.Id,
      dateRange.startDate,
      dateRange.endDate
    );
  };

  const resetForm = () => {
    setCategoryForm({
      Name: "",
      Description: "",
      Color: "#3498db",
      IsActive: true,
    });
    setFormErrors({});
  };

  const handleModalClose = (modalType) => {
    if (modalType === "add") {
      setShowAddModal(false);
      resetForm();
    } else if (modalType === "edit") {
      setShowEditModal(false);
      setEditingCategory(null);
      resetForm();
    } else if (modalType === "details") {
      setShowDetailsModal(false);
      setViewingCategory(null);
    }
    clearError();
  };

  const statusOptions = [
    { value: "", label: "All Categories" },
    { value: "active", label: "Active Only" },
    { value: "inactive", label: "Inactive Only" },
  ];

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? "success" : "danger"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#8DD1E1",
  ];
  console.log("incomeCategoriesobject", incomeCategories);
  const categories = incomeCategories.Data?.$values || [];
  console.log("categories", categories);
  const totalCategories = categories.length;
  const activeCategories = categories.filter((cat) => cat.IsActive).length;
  const totalIncomeFromCategories = categoryPerformance?.TotalIncome || 0;
  const topPerformingCategory = categoryPerformance?.TopCategory?.Name || "N/A";

  if (loading && categories.length === 0) {
    return (
      <Container className="p-6 space-y-6">
        <BodyHeader
          heading="Income Categories"
          subHeading="Manage and organize your income categories"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton height="100px" width="100%" />
            </Card>
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container className="p-6 space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle size={20} />
            <span className="font-medium">Error:</span>
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <BodyHeader
          heading="Income Categories"
          subHeading="Manage and organize your income categories"
        />
        <div className="flex items-center space-x-3">
          <OutlineButton
            icon={Download}
            isIcon
            isIconLeft
            buttonText="Export"
            borderColor="border-gray-300"
            borderWidth="border"
            rounded="rounded-md"
            bgColor="bg-white"
            textColor="text-gray-700"
            height="h-10"
            px="px-4"
            hover="hover:bg-gray-50"
            onClick={() => console.log("Export categories")}
          />
          <FilledButton
            icon={Plus}
            isIcon
            isIconLeft
            buttonText="Add Category"
            onClick={() => setShowAddModal(true)}
          />
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <SearchAndFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search categories..."
            />
          </div>

          <SelectBox
            placeholder="Filter by Status"
            value={selectedStatus}
            handleChange={handleStatusFilter}
            optionList={statusOptions}
            width="w-full"
          />

          <FilledButton
            buttonText="Refresh Data"
            onClick={() => {
              getIncomeCategories();
              getCategoryPerformance();
            }}
            height="h-10"
          />
        </div>
      </Card>

      {/* Categories Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <Thead className="bg-gray-50">
              <TR>
                <TH>Category</TH>
                <TH>Description</TH>
                <TH>Color</TH>
                <TH>Total Income</TH>
                <TH>Income Count</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </Thead>
            <Tbody>
              {categories.map((category) => (
                <TR key={category.Id}>
                  <TD className="font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.Color || "#3498db" }}
                      />
                      <span>{category.Name}</span>
                    </div>
                  </TD>
                  <TD className="text-gray-600 max-w-xs truncate">
                    {category.Description || "No description"}
                  </TD>
                  <TD>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-md border"
                        style={{ backgroundColor: category.Color || "#3498db" }}
                      />
                      <span className="text-sm text-gray-500">
                        {category.Color}
                      </span>
                    </div>
                  </TD>
                  <TD className="font-semibold text-green-600">
                    ${category.TotalIncome?.toLocaleString() || "0"}
                  </TD>
                  <TD className="text-center">
                    <Badge variant="info">{category.IncomeCount || 0}</Badge>
                  </TD>
                  <TD>{getStatusBadge(category.IsActive)}</TD>
                  <TD>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(category.Id)}
                        className={`p-1 rounded ${
                          category.IsActive
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={category.IsActive ? "Deactivate" : "Activate"}
                      >
                        {category.IsActive ? (
                          <ToggleRight size={16} />
                        ) : (
                          <ToggleLeft size={16} />
                        )}
                      </button>
                      <Dropdown
                        buttonText=""
                        icon={MoreVertical}
                        items={[
                          {
                            label: "View Details",
                            action: () => openDetailsModal(category),
                          },
                          {
                            label: "Edit Category",
                            action: () => openEditModal(category),
                          },
                          {
                            label: "Delete Category",
                            action: () => handleDeleteCategory(category.Id),
                          },
                        ]}
                        onSelect={(item) => item.action()}
                        buttonClassName="p-2 rounded-md hover:bg-gray-100"
                      />
                    </div>
                  </TD>
                </TR>
              ))}
            </Tbody>
          </Table>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Tag size={48} className="mx-auto mb-4 opacity-50" />
            <p>No income categories found</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={pagination.CurrentPage}
            totalPages={pagination.TotalPages}
            onPageChange={changePage}
          />
        </div>
      </Card>

      {/* Add Category Modal */}
      <Modall
        title="Add New Income Category"
        modalOpen={showAddModal}
        setModalOpen={() => handleModalClose("add")}
        okText={isSubmitting ? "Creating..." : "Add Category"}
        cancelText="Cancel"
        okAction={handleAddCategory}
        cancelAction={() => handleModalClose("add")}
        okDisabled={isSubmitting}
        width={600}
        body={
          <div className="space-y-4">
            <div>
              <InputField
                label="Category Name *"
                placeholder="Enter category name"
                value={categoryForm.Name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, Name: e.target.value })
                }
                width="w-full"
                error={formErrors.Name}
              />
              {formErrors.Name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.Name}</p>
              )}
            </div>

            <InputField
              label="Description"
              placeholder="Enter category description (optional)"
              value={categoryForm.Description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  Description: e.target.value,
                })
              }
              width="w-full"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Color *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={categoryForm.Color}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, Color: e.target.value })
                  }
                  className="w-12 h-10 border border-gray-300 rounded-md"
                />
                <InputField
                  placeholder="#3498db"
                  value={categoryForm.Color}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, Color: e.target.value })
                  }
                  width="w-full"
                  error={formErrors.Color}
                />
              </div>
              {formErrors.Color && (
                <p className="text-red-500 text-sm mt-1">{formErrors.Color}</p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <CheckboxField
                name="IsActive"
                label="Active Category"
                checked={categoryForm.IsActive}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    IsActive: e.target.checked,
                  })
                }
                errors={{}}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* Edit Category Modal */}
      <Modall
        title="Edit Income Category"
        modalOpen={showEditModal}
        setModalOpen={() => handleModalClose("edit")}
        okText={isSubmitting ? "Updating..." : "Update Category"}
        cancelText="Cancel"
        okAction={handleEditCategory}
        cancelAction={() => handleModalClose("edit")}
        okDisabled={isSubmitting}
        width={600}
        body={
          <div className="space-y-4">
            <div>
              <InputField
                label="Category Name *"
                placeholder="Enter category name"
                value={categoryForm.Name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, Name: e.target.value })
                }
                width="w-full"
                error={formErrors.Name}
              />
              {formErrors.Name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.Name}</p>
              )}
            </div>

            <InputField
              label="Description"
              placeholder="Enter category description (optional)"
              value={categoryForm.Description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  Description: e.target.value,
                })
              }
              width="w-full"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Color *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={categoryForm.Color}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, Color: e.target.value })
                  }
                  className="w-12 h-10 border border-gray-300 rounded-md"
                />
                <InputField
                  placeholder="#3498db"
                  value={categoryForm.Color}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, Color: e.target.value })
                  }
                  width="w-full"
                  error={formErrors.Color}
                />
              </div>
              {formErrors.Color && (
                <p className="text-red-500 text-sm mt-1">{formErrors.Color}</p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <CheckboxField
                name="IsActive"
                label="Active Category"
                checked={categoryForm.IsActive}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    IsActive: e.target.checked,
                  })
                }
                errors={{}}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* Category Details Modal */}
      <Modall
        title={`Category Details: ${viewingCategory?.Name || ""}`}
        modalOpen={showDetailsModal}
        setModalOpen={() => handleModalClose("details")}
        okText="Close"
        cancelText=""
        okAction={() => handleModalClose("details")}
        cancelAction={() => handleModalClose("details")}
        width={800}
        body={
          <div className="space-y-6">
            {currentIncomeCategory && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Category Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: currentIncomeCategory.Color,
                          }}
                        />
                        <span className="font-medium">
                          {currentIncomeCategory.Name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {currentIncomeCategory.Description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>
                          Status:{" "}
                          {getStatusBadge(currentIncomeCategory.IsActive)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Statistics
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Total Income:
                        </span>
                        <span className="font-semibold text-green-600">
                          $
                          {categoryStatistics?.TotalIncome?.toLocaleString() ||
                            "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Income Count:
                        </span>
                        <span className="font-semibold">
                          {categoryStatistics?.IncomeCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Average Income:
                        </span>
                        <span className="font-semibold">
                          $
                          {categoryStatistics?.AverageIncome?.toLocaleString() ||
                            "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {recentIncomes && recentIncomes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Recent Income Records
                    </h4>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {recentIncomes.slice(0, 5).map((income, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {income.Description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  income.IncomeDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="font-semibold text-green-600">
                              ${income.Amount?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        }
      />
    </Container>
  );
};

export default IncomeCategories;
