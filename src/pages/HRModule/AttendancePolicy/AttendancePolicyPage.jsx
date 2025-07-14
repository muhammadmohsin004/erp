import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";
import { useLeaveAttendance } from "../../../Contexts/LeaveContext/LeaveContext";
import InputField from "../../../components/elements/inputField/InputField";
import SelectBox from "../../../components/elements/selectBox/SelectBox";
import CheckboxField from "../../../components/elements/checkbox/CheckboxField";
import Container from "../../../components/elements/container/Container";
import BodyHeader from "../../../components/elements/bodyHeader/BodyHeader";
import Alert from "../../../components/elements/Alert/Alert";
import Card from "../../../components/elements/card/Card";
import SearchAndFilters from "../../../components/elements/searchAndFilters/SearchAndFilters";
import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
import Skeleton from "../../../components/elements/skeleton/Skeleton";
import Table from "../../../components/elements/table/Table";
import Thead from "../../../components/elements/thead/Thead";
import TR from "../../../components/elements/tr/TR";
import TH from "../../../components/elements/th/TH";
import Tbody from "../../../components/elements/tbody/Tbody";
import TD from "../../../components/elements/td/TD";
import Badge from "../../../components/elements/Badge/Badge";
import Dropdown from "../../../components/elements/dropdown/Dropdown";
import Modall from "../../../components/elements/modal/Modal";

const AttendancePolicyPage = () => {
  const {
    attendancePolicies,
    attendancePolicyDetail,
    isPoliciesLoading,
    isLoading,
    isProcessing,
    error,
    getAttendancePolicies,
    getAttendancePolicy,
    createAttendancePolicy,
    updateAttendancePolicy,
    deleteAttendancePolicy,
    clearAttendancePolicyDetail,
    clearError,
  } = useLeaveAttendance();

  // Local state
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    StandardWorkingHours: "",
    StartTime: "",
    EndTime: "",
    BreakDuration: "",
    LateGracePeriodMinutes: 0,
    EarlyGracePeriodMinutes: 0,
    MondayWorkingDay: true,
    TuesdayWorkingDay: true,
    WednesdayWorkingDay: true,
    ThursdayWorkingDay: true,
    FridayWorkingDay: true,
    SaturdayWorkingDay: false,
    SundayWorkingDay: false,
    AllowOvertime: false,
    OvertimeRate: 0,
    MinimumOvertimeMinutes: 0,
    MaximumOvertimeHoursPerDay: 0,
    MaximumOvertimeHoursPerWeek: 0,
    RequireCheckIn: true,
    RequireCheckOut: true,
    AllowMobileCheckIn: false,
    RequireLocationTracking: false,
    AllowedLocationRadiusMeters: 0,
    AnnualLeaveEntitlement: 0,
    SickLeaveEntitlement: 0,
    CasualLeaveEntitlement: 0,
    IsActive: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // Load policies on component mount
  useEffect(() => {
    getAttendancePolicies();
  }, []);

  // Filter policies based on search
  const filteredPolicies = attendancePolicies.filter(
    (policy) =>
      policy.Name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      policy.Description?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.Name.trim()) {
      errors.Name = { message: "Policy name is required" };
    }

    if (!formData.StandardWorkingHours) {
      errors.StandardWorkingHours = {
        message: "Standard working hours is required",
      };
    }

    if (!formData.StartTime) {
      errors.StartTime = { message: "Start time is required" };
    }

    if (!formData.EndTime) {
      errors.EndTime = { message: "End time is required" };
    }

    if (!formData.BreakDuration) {
      errors.BreakDuration = { message: "Break duration is required" };
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      Name: "",
      Description: "",
      StandardWorkingHours: "",
      StartTime: "",
      EndTime: "",
      BreakDuration: "",
      LateGracePeriodMinutes: 0,
      EarlyGracePeriodMinutes: 0,
      MondayWorkingDay: true,
      TuesdayWorkingDay: true,
      WednesdayWorkingDay: true,
      ThursdayWorkingDay: true,
      FridayWorkingDay: true,
      SaturdayWorkingDay: false,
      SundayWorkingDay: false,
      AllowOvertime: false,
      OvertimeRate: 0,
      MinimumOvertimeMinutes: 0,
      MaximumOvertimeHoursPerDay: 0,
      MaximumOvertimeHoursPerWeek: 0,
      RequireCheckIn: true,
      RequireCheckOut: true,
      AllowMobileCheckIn: false,
      RequireLocationTracking: false,
      AllowedLocationRadiusMeters: 0,
      AnnualLeaveEntitlement: 0,
      SickLeaveEntitlement: 0,
      CasualLeaveEntitlement: 0,
      IsActive: true,
    });
    setFormErrors({});
  };

  // Handle create policy
  const handleCreatePolicy = async () => {
    if (!validateForm()) return;

    try {
      await createAttendancePolicy(formData);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating policy:", error);
    }
  };

  // Handle edit policy
  const handleEditPolicy = async () => {
    if (!validateForm()) return;

    try {
      await updateAttendancePolicy(selectedPolicy.Id, formData);
      setShowEditModal(false);
      resetForm();
      setSelectedPolicy(null);
    } catch (error) {
      console.error("Error updating policy:", error);
    }
  };

  // Handle delete policy
  const handleDeletePolicy = async () => {
    try {
      await deleteAttendancePolicy(selectedPolicy.Id);
      setShowDeleteModal(false);
      setSelectedPolicy(null);
    } catch (error) {
      console.error("Error deleting policy:", error);
    }
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (policy) => {
    setSelectedPolicy(policy);
    setFormData({
      Name: policy.Name || "",
      Description: policy.Description || "",
      StandardWorkingHours: policy.StandardWorkingHours || "",
      StartTime: policy.StartTime || "",
      EndTime: policy.EndTime || "",
      BreakDuration: policy.BreakDuration || "",
      LateGracePeriodMinutes: policy.LateGracePeriodMinutes || 0,
      EarlyGracePeriodMinutes: policy.EarlyGracePeriodMinutes || 0,
      MondayWorkingDay: policy.MondayWorkingDay || false,
      TuesdayWorkingDay: policy.TuesdayWorkingDay || false,
      WednesdayWorkingDay: policy.WednesdayWorkingDay || false,
      ThursdayWorkingDay: policy.ThursdayWorkingDay || false,
      FridayWorkingDay: policy.FridayWorkingDay || false,
      SaturdayWorkingDay: policy.SaturdayWorkingDay || false,
      SundayWorkingDay: policy.SundayWorkingDay || false,
      AllowOvertime: policy.AllowOvertime || false,
      OvertimeRate: policy.OvertimeRate || 0,
      MinimumOvertimeMinutes: policy.MinimumOvertimeMinutes || 0,
      MaximumOvertimeHoursPerDay: policy.MaximumOvertimeHoursPerDay || 0,
      MaximumOvertimeHoursPerWeek: policy.MaximumOvertimeHoursPerWeek || 0,
      RequireCheckIn: policy.RequireCheckIn || false,
      RequireCheckOut: policy.RequireCheckOut || false,
      AllowMobileCheckIn: policy.AllowMobileCheckIn || false,
      RequireLocationTracking: policy.RequireLocationTracking || false,
      AllowedLocationRadiusMeters: policy.AllowedLocationRadiusMeters || 0,
      AnnualLeaveEntitlement: policy.AnnualLeaveEntitlement || 0,
      SickLeaveEntitlement: policy.SickLeaveEntitlement || 0,
      CasualLeaveEntitlement: policy.CasualLeaveEntitlement || 0,
      IsActive: policy.IsActive !== undefined ? policy.IsActive : true,
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (policy) => {
    setSelectedPolicy(policy);
    setShowDeleteModal(true);
  };

  // Get dropdown items for each policy
  const getDropdownItems = (policy) => [
    { label: "Edit", value: "edit", action: () => openEditModal(policy) },
    { label: "Delete", value: "delete", action: () => openDeleteModal(policy) },
  ];

  // Handle dropdown selection
  const handleDropdownSelect = (item) => {
    item.action();
  };

  // Standard working hours options
  const workingHoursOptions = [
    { label: "6:00", value: "6:00" },
    { label: "7:00", value: "7:00" },
    { label: "7:30", value: "7:30" },
    { label: "8:00", value: "8:00" },
    { label: "8:30", value: "8:30" },
    { label: "9:00", value: "9:00" },
  ];

  // Break duration options
  const breakDurationOptions = [
    { label: "30 minutes", value: "00:30" },
    { label: "45 minutes", value: "00:45" },
    { label: "1 hour", value: "01:00" },
    { label: "1.5 hours", value: "01:30" },
    { label: "2 hours", value: "02:00" },
  ];

  console.log("filteredPolicies", filteredPolicies);

  // Render form fields
  const renderPolicyForm = () => (
    <div className="space-y-6 max-h-[600px] overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <InputField
            label="Policy Name"
            name="Name"
            placeholder="Enter policy name"
            type="text"
            value={formData.Name}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />

          <InputField
            label="Description"
            name="Description"
            placeholder="Enter policy description"
            type="text"
            value={formData.Description}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />
        </div>
      </div>

      {/* Working Hours */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectBox
            label="Standard Working Hours"
            name="StandardWorkingHours"
            placeholder="Select hours"
            optionList={workingHoursOptions}
            value={formData.StandardWorkingHours}
            handleChange={(value) =>
              handleSelectChange("StandardWorkingHours", value)
            }
            errors={formErrors}
            width="w-full"
          />

          <InputField
            label="Start Time"
            name="StartTime"
            placeholder="09:00"
            type="time"
            value={formData.StartTime}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />

          <InputField
            label="End Time"
            name="EndTime"
            placeholder="17:00"
            type="time"
            value={formData.EndTime}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectBox
            label="Break Duration"
            name="BreakDuration"
            placeholder="Select break duration"
            optionList={breakDurationOptions}
            value={formData.BreakDuration}
            handleChange={(value) => handleSelectChange("BreakDuration", value)}
            errors={formErrors}
            width="w-full"
          />

          <InputField
            label="Late Grace Period (minutes)"
            name="LateGracePeriodMinutes"
            placeholder="15"
            type="number"
            value={formData.LateGracePeriodMinutes}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />

          <InputField
            label="Early Grace Period (minutes)"
            name="EarlyGracePeriodMinutes"
            placeholder="15"
            type="number"
            value={formData.EarlyGracePeriodMinutes}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />
        </div>
      </div>

      {/* Working Days */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Working Days</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CheckboxField
            name="MondayWorkingDay"
            label="Monday"
            checked={formData.MondayWorkingDay}
            onChange={handleInputChange}
            errors={formErrors}
          />
          <CheckboxField
            name="TuesdayWorkingDay"
            label="Tuesday"
            checked={formData.TuesdayWorkingDay}
            onChange={handleInputChange}
            errors={formErrors}
          />
          <CheckboxField
            name="WednesdayWorkingDay"
            label="Wednesday"
            checked={formData.WednesdayWorkingDay}
            onChange={handleInputChange}
            errors={formErrors}
          />
          <CheckboxField
            name="ThursdayWorkingDay"
            label="Thursday"
            checked={formData.ThursdayWorkingDay}
            onChange={handleInputChange}
            errors={formErrors}
          />
          <CheckboxField
            name="FridayWorkingDay"
            label="Friday"
            checked={formData.FridayWorkingDay}
            onChange={handleInputChange}
            errors={formErrors}
          />
          <CheckboxField
            name="SaturdayWorkingDay"
            label="Saturday"
            checked={formData.SaturdayWorkingDay}
            onChange={handleInputChange}
            errors={formErrors}
          />
          <CheckboxField
            name="SundayWorkingDay"
            label="Sunday"
            checked={formData.SundayWorkingDay}
            onChange={handleInputChange}
            errors={formErrors}
          />
        </div>
      </div>

      {/* Overtime Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Overtime Settings</h3>
        <div className="space-y-4">
          <CheckboxField
            name="AllowOvertime"
            label="Allow Overtime"
            checked={formData.AllowOvertime}
            onChange={handleInputChange}
            errors={formErrors}
          />

          {formData.AllowOvertime && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Overtime Rate"
                name="OvertimeRate"
                placeholder="1.5"
                type="number"
                step="0.1"
                value={formData.OvertimeRate}
                onChange={handleInputChange}
                errors={formErrors}
                width="w-full"
              />
              <InputField
                label="Minimum Overtime Minutes"
                name="MinimumOvertimeMinutes"
                placeholder="30"
                type="number"
                value={formData.MinimumOvertimeMinutes}
                onChange={handleInputChange}
                errors={formErrors}
                width="w-full"
              />
              <InputField
                label="Max Overtime Hours Per Day"
                name="MaximumOvertimeHoursPerDay"
                placeholder="4"
                type="number"
                value={formData.MaximumOvertimeHoursPerDay}
                onChange={handleInputChange}
                errors={formErrors}
                width="w-full"
              />
              <InputField
                label="Max Overtime Hours Per Week"
                name="MaximumOvertimeHoursPerWeek"
                placeholder="20"
                type="number"
                value={formData.MaximumOvertimeHoursPerWeek}
                onChange={handleInputChange}
                errors={formErrors}
                width="w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Check-in/Check-out Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Check-in/Check-out Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxField
            name="RequireCheckIn"
            label="Require Check-in"
            checked={formData.RequireCheckIn}
            onChange={handleInputChange}
            errors={formErrors}
          />
          <CheckboxField
            name="RequireCheckOut"
            label="Require Check-out"
            checked={formData.RequireCheckOut}
            onChange={handleInputChange}
            errors={formErrors}
          />
          <CheckboxField
            name="AllowMobileCheckIn"
            label="Allow Mobile Check-in"
            checked={formData.AllowMobileCheckIn}
            onChange={handleInputChange}
            errors={formErrors}
          />
          <CheckboxField
            name="RequireLocationTracking"
            label="Require Location Tracking"
            checked={formData.RequireLocationTracking}
            onChange={handleInputChange}
            errors={formErrors}
          />
        </div>

        {formData.RequireLocationTracking && (
          <InputField
            label="Allowed Location Radius (meters)"
            name="AllowedLocationRadiusMeters"
            placeholder="100"
            type="number"
            value={formData.AllowedLocationRadiusMeters}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />
        )}
      </div>

      {/* Leave Entitlements */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Leave Entitlements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Annual Leave (days)"
            name="AnnualLeaveEntitlement"
            placeholder="25"
            type="number"
            value={formData.AnnualLeaveEntitlement}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />
          <InputField
            label="Sick Leave (days)"
            name="SickLeaveEntitlement"
            placeholder="10"
            type="number"
            value={formData.SickLeaveEntitlement}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />
          <InputField
            label="Casual Leave (days)"
            name="CasualLeaveEntitlement"
            placeholder="5"
            type="number"
            value={formData.CasualLeaveEntitlement}
            onChange={handleInputChange}
            errors={formErrors}
            width="w-full"
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Status</h3>
        <CheckboxField
          name="IsActive"
          label="Active Policy"
          checked={formData.IsActive}
          onChange={handleInputChange}
          errors={formErrors}
        />
      </div>
    </div>
  );

  return (
    <Container className="p-6">
      <BodyHeader
        heading="Attendance Policies"
        subHeading="Manage your organization's attendance policies"
      />

      {error && (
        <Alert
          variant="danger"
          message={error}
          onClose={clearError}
          className="mb-4"
        />
      )}

      <Card className="mt-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <SearchAndFilters
              isFocused={isFocused}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search policies..."
            />
            <FilledButton
              buttonText="Add Policy"
              isIcon={true}
              icon={FiPlus}
              isIconLeft={true}
              onClick={openCreateModal}
              // disabled={isProcessing}
              isIconRight={false}
              iconSize={`text-lg`}
              bgColor={`bg-purple-500`}
              textColor={`text-white`}
              height={`h-[36px]`}
              width={`w-[150px]`}
              rounded={`rounded-md`}
              fontWeight={`font-semibold`}
              fontSize={`text-sm`}
              type={`button`}
              px="px-4"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isPoliciesLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <Skeleton width="200px" height="20px" />
                  <Skeleton width="300px" height="20px" />
                  <Skeleton width="100px" height="20px" />
                  <Skeleton width="80px" height="20px" />
                  <Skeleton width="50px" height="20px" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <Thead className="bg-gray-50">
                <TR>
                  <TH>Policy Name</TH>
                  <TH>Description</TH>
                  <TH>Working Hours</TH>
                  <TH>Break Duration</TH>
                  <TH>Early Grace Minutes</TH>
                  <TH>Status</TH>
                  <TH>Actions</TH>
                </TR>
              </Thead>
              <Tbody>
                {filteredPolicies.length > 0 ? (
                  filteredPolicies.map((policy) => (
                    <TR key={policy.Id}>
                      <TD className="font-medium text-gray-900">
                        {policy.Name}
                      </TD>
                      <TD className="max-w-xs truncate">
                        {policy.Description || "N/A"}
                      </TD>
                      <TD>
                        {policy.StandardWorkingHours
                          ? `${policy.StandardWorkingHours}`
                          : "N/A"}
                      </TD>
                      <TD>{policy.BreakDuration || "N/A"}</TD>
                      <TD>
                        {policy.EarlyGracePeriodMinutes
                          ? `${policy.EarlyGracePeriodMinutes} min`
                          : "N/A"}
                      </TD>
                      <TD>
                        <Badge variant={policy.IsActive ? "success" : "danger"}>
                          {policy.IsActive ? "Active" : "Inactive"}
                        </Badge>
                      </TD>
                      <TD>
                        <Dropdown
                          buttonText=""
                          icon={FiMoreVertical}
                          items={getDropdownItems(policy)}
                          onSelect={handleDropdownSelect}
                          buttonClassName="p-2"
                        />
                      </TD>
                    </TR>
                  ))
                ) : (
                  <TR>
                    <TD colSpan={7} className="text-center py-8 text-gray-500">
                      {searchValue
                        ? "No policies found matching your search."
                        : "No attendance policies found."}
                    </TD>
                  </TR>
                )}
              </Tbody>
            </Table>
          )}
        </div>
      </Card>

      {/* Create Policy Modal */}
      <Modall
        title="Create Attendance Policy"
        modalOpen={showCreateModal}
        setModalOpen={setShowCreateModal}
        okText="Create Policy"
        cancelText="Cancel"
        okAction={handleCreatePolicy}
        cancelAction={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        body={renderPolicyForm()}
        width={1000}
        okButtonDisabled={isLoading}
      />

      {/* Edit Policy Modal */}
      <Modall
        title="Edit Attendance Policy"
        modalOpen={showEditModal}
        setModalOpen={setShowEditModal}
        okText="Update Policy"
        cancelText="Cancel"
        okAction={handleEditPolicy}
        cancelAction={() => {
          setShowEditModal(false);
          resetForm();
          setSelectedPolicy(null);
        }}
        body={renderPolicyForm()}
        width={1000}
        okButtonDisabled={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modall
        title="Delete Attendance Policy"
        modalOpen={showDeleteModal}
        setModalOpen={setShowDeleteModal}
        okText="Delete"
        cancelText="Cancel"
        okAction={handleDeletePolicy}
        cancelAction={() => {
          setShowDeleteModal(false);
          setSelectedPolicy(null);
        }}
        body={
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete the policy "{selectedPolicy?.Name}
              "? This action cannot be undone.
            </p>
          </div>
        }
        width={500}
        okButtonDisabled={isProcessing}
      />
    </Container>
  );
};

export default AttendancePolicyPage;
