import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVendor } from '../../Contexts/VendorContext/VendorContext';
import { notification } from 'antd';
import {
    Save,
    X,
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    User,
    Globe,
    CreditCard,
    Building,
    Calendar,
    Info,
    RefreshCw,
    Eye,
} from 'lucide-react';
import Container from '../../components/elements/container/Container';
import Span from '../../components/elements/span/Span';
import FilledButton from '../../components/elements/elements/buttons/filledButton/FilledButton';
import OutlineButton from '../../components/elements/elements/buttons/outlineButton/OutlineButton';
import InputField from '../../components/elements/inputField/InputField';
import SelectBox from '../../components/elements/selectBox/SelectBox';
import TextArea from '../../components/elements/textArea/TextArea';

// Constants moved outside component to prevent recreation
const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'PKR', label: 'PKR - Pakistani Rupee' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
];

const COUNTRY_OPTIONS = [
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'IN', label: 'India' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'CN', label: 'China' },
];

const PAYMENT_TERMS_OPTIONS = [
    { value: 'NET15', label: 'NET 15 - Payment due in 15 days' },
    { value: 'NET30', label: 'NET 30 - Payment due in 30 days' },
    { value: 'NET45', label: 'NET 45 - Payment due in 45 days' },
    { value: 'NET60', label: 'NET 60 - Payment due in 60 days' },
    { value: 'NET90', label: 'NET 90 - Payment due in 90 days' },
    { value: 'IMMEDIATE', label: 'Immediate Payment' },
    { value: 'COD', label: 'Cash on Delivery' },
    { value: 'ADVANCE', label: 'Advance Payment' },
    { value: 'CUSTOM', label: 'Custom Terms' },
];

const DEFAULT_FORM_DATA = {
    Name: '',
    ContactPerson: '',
    Email: '',
    Phone: '',
    Address: '',
    City: '',
    State: '',
    PostalCode: '',
    Country: '',
    TaxNumber: '',
    Currency: 'USD',
    PaymentTerms: '',
    IsActive: true,
    Notes: ''
};

const AddVendors = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        createVendor,
        updateVendor,
        getVendor,
        loading,
        error,
        clearError,
        currentVendor,
        resetState
    } = useVendor();

    // State management
    const [apiNotification, contextHolder] = notification.useNotification();
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Memoized values
    const isEditMode = useMemo(() => !!id, [id]);
    const hasRequiredFields = useMemo(() => 
        formData.Name.trim() && formData.ContactPerson.trim(), 
        [formData.Name, formData.ContactPerson]
    );

    // Utility functions
    const showNotification = useCallback((type, message, description) => {
        apiNotification[type]({
            message,
            description,
            placement: 'bottomRight',
            duration: type === 'error' ? 6 : 4,
        });
    }, [apiNotification]);

    const validateForm = useCallback(() => {
        const errors = [];
        
        if (!formData.Name.trim()) {
            errors.push('Vendor name is required');
        }
        
        if (!formData.ContactPerson.trim()) {
            errors.push('Contact person is required');
        }
        
        if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (errors.length > 0) {
            showNotification('error', 'Validation Error', errors.join(', '));
            return false;
        }
        
        return true;
    }, [formData.Name, formData.ContactPerson, formData.Email, showNotification]);

    const createFormDataFromVendor = useCallback((vendor) => ({
        Name: vendor.Name || '',
        ContactPerson: vendor.ContactPerson || '',
        Email: vendor.Email || '',
        Phone: vendor.Phone || '',
        Address: vendor.Address || '',
        City: vendor.City || '',
        State: vendor.State || '',
        PostalCode: vendor.PostalCode || '',
        Country: vendor.Country || '',
        TaxNumber: vendor.TaxNumber || '',
        Currency: vendor.Currency || 'USD',
        PaymentTerms: vendor.PaymentTerms || '',
        IsActive: vendor.IsActive !== undefined ? vendor.IsActive : true,
        Notes: vendor.Notes || ''
    }), []);

    // Event handlers
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    }, []);

    const handleTextAreaChange = useCallback((name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSelectChange = useCallback((name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e, saveAndContinue = false) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        clearError();

        try {
            const submitData = {
                ...formData,
                IsActive: Boolean(formData.IsActive),
            };

            if (isEditMode) {
                await updateVendor(id, submitData);
                showNotification('success', 'Success', 'Vendor updated successfully');
                if (!saveAndContinue) {
                    navigate(`/admin/vendors/${id}`);
                }
            } else {
                const result = await createVendor(submitData);
                showNotification('success', 'Success', 'Vendor created successfully');
                if (saveAndContinue) {
                    navigate(`/admin/add-vendors/${result.Id}`);
                } else {
                    navigate('/admin/vendors');
                }
            }
        } catch (err) {
            console.error('Error saving vendor:', err);
            showNotification('error', 'Error', err.message || 'Failed to save vendor. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, isEditMode, id, validateForm, updateVendor, createVendor, navigate, clearError, showNotification]);

    const handleSaveAndContinue = useCallback((e) => {
        handleSubmit(e, true);
    }, [handleSubmit]);

    const handleCancel = useCallback(() => {
        const destination = isEditMode ? `/admin/vendors/${id}` : '/admin/vendors';
        
        if (hasUnsavedChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                navigate(destination);
            }
        } else {
            navigate(destination);
        }
    }, [hasUnsavedChanges, isEditMode, id, navigate]);

    const handleResetForm = useCallback(() => {
        if (window.confirm('Are you sure you want to reset all fields? This will lose all current changes.')) {
            if (isEditMode && currentVendor) {
                setFormData(createFormDataFromVendor(currentVendor));
            } else {
                setFormData(DEFAULT_FORM_DATA);
            }
        }
    }, [isEditMode, currentVendor, createFormDataFromVendor]);

    const handleViewVendor = useCallback(() => {
        navigate(`/admin/vendors/${id}`);
    }, [navigate, id]);

    const handleBackNavigation = useCallback(() => {
        navigate(isEditMode ? `/admin/vendors/${id}` : '/admin/vendors');
    }, [navigate, isEditMode, id]);

    // Effects
    useEffect(() => {
        if (isEditMode) {
            const fetchVendorData = async () => {
                try {
                    const vendor = await getVendor(id);
                    if (vendor) {
                        setFormData(createFormDataFromVendor(vendor));
                    }
                } catch (err) {
                    showNotification('error', 'Error', err.message || 'Failed to fetch vendor data');
                }
            };
            fetchVendorData();
        }
    }, [id, isEditMode, getVendor, createFormDataFromVendor, showNotification]);

    useEffect(() => {
        if (isEditMode && currentVendor && currentVendor.Id === parseInt(id)) {
            setFormData(createFormDataFromVendor(currentVendor));
        }
    }, [currentVendor, id, isEditMode, createFormDataFromVendor]);

    useEffect(() => {
        if (error) {
            showNotification('error', 'Error', error);
            clearError();
        }
    }, [error, clearError, showNotification]);

    useEffect(() => {
        const hasChanges = Object.keys(formData).some(key => {
            if (isEditMode && currentVendor) {
                return formData[key] !== (currentVendor[key] || DEFAULT_FORM_DATA[key]);
            }
            return formData[key] !== DEFAULT_FORM_DATA[key];
        });

        setHasUnsavedChanges(hasChanges);
    }, [formData, isEditMode, currentVendor]);

    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    return (
        <Container className="p-6 bg-gray-50 min-h-screen">
            {contextHolder}
            <Container className="bg-white shadow-sm rounded-lg mb-6 relative">
                {/* Header */}
                <Container className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBackNavigation}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={isSubmitting}
                                type="button"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isEditMode ? 'Edit Vendor' : 'Add New Vendor'}
                                </h1>
                                {hasUnsavedChanges && (
                                    <Span className="text-sm text-orange-600 font-medium">
                                        • Unsaved changes
                                    </Span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {isEditMode && (
                                <OutlineButton
                                    buttonText="View Vendor"
                                    onClick={handleViewVendor}
                                    borderColor="border-blue-300"
                                    borderWidth="border"
                                    rounded="rounded-lg"
                                    bgColor="bg-blue-50 hover:bg-blue-100"
                                    textColor="text-blue-700"
                                    height="h-10"
                                    px="px-4"
                                    fontWeight="font-medium"
                                    fontSize="text-sm"
                                    icon={Eye}
                                    iconSize="w-4 h-4"
                                    isIconLeft={true}
                                    disabled={isSubmitting}
                                />
                            )}
                            <OutlineButton
                                buttonText="Reset"
                                onClick={handleResetForm}
                                borderColor="border-gray-300"
                                borderWidth="border"
                                rounded="rounded-lg"
                                bgColor="bg-white hover:bg-gray-50"
                                textColor="text-gray-700"
                                height="h-10"
                                px="px-4"
                                fontWeight="font-medium"
                                fontSize="text-sm"
                                icon={RefreshCw}
                                iconSize="w-4 h-4"
                                isIconLeft={true}
                                disabled={isSubmitting}
                            />
                            <OutlineButton
                                buttonText="Cancel"
                                onClick={handleCancel}
                                borderColor="border-gray-300"
                                borderWidth="border"
                                rounded="rounded-lg"
                                bgColor="bg-white hover:bg-gray-50"
                                textColor="text-gray-700"
                                height="h-10"
                                px="px-4"
                                fontWeight="font-medium"
                                fontSize="text-sm"
                                icon={X}
                                iconSize="w-4 h-4"
                                isIconLeft={true}
                                disabled={isSubmitting}
                            />
                            <FilledButton
                                isIcon={true}
                                icon={Save}
                                iconSize="w-4 h-4"
                                bgColor={hasRequiredFields && !isSubmitting ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"}
                                textColor="text-white"
                                rounded="rounded-lg"
                                buttonText={
                                    isSubmitting
                                        ? (isEditMode ? 'Saving...' : 'Creating...')
                                        : (isEditMode ? 'Save Changes' : 'Create Vendor')
                                }
                                height="h-10"
                                px="px-4"
                                fontWeight="font-medium"
                                fontSize="text-sm"
                                isIconLeft={true}
                                onClick={handleSubmit}
                                disabled={!hasRequiredFields || isSubmitting || loading}
                            />
                        </div>
                    </div>
                </Container>

                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                        <div className="flex items-center gap-2 text-blue-600">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Loading...</span>
                        </div>
                    </div>
                )}

                {/* Form */}
                <Container className="p-6">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Basic Information
                                </h2>
                                <div className="space-y-4">
                                    <InputField
                                        name="Name"
                                        label="Vendor Name"
                                        placeholder="Enter vendor name"
                                        value={formData.Name}
                                        onChange={handleChange}
                                        required
                                        icon={Building}
                                        disabled={isSubmitting}
                                    />
                                    <InputField
                                        name="ContactPerson"
                                        label="Contact Person"
                                        placeholder="Enter contact person name"
                                        value={formData.ContactPerson}
                                        onChange={handleChange}
                                        required
                                        icon={User}
                                        disabled={isSubmitting}
                                    />
                                    <InputField
                                        name="Email"
                                        label="Email"
                                        placeholder="Enter email address"
                                        type="email"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        icon={Mail}
                                        disabled={isSubmitting}
                                    />
                                    <InputField
                                        name="Phone"
                                        label="Phone"
                                        placeholder="Enter phone number"
                                        value={formData.Phone}
                                        onChange={handleChange}
                                        icon={Phone}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    Address Information
                                </h2>
                                <div className="space-y-4">
                                    <TextArea
                                        name="Address"
                                        label="Address"
                                        placeholder="Enter full address"
                                        value={formData.Address}
                                        onChange={(value) => handleTextAreaChange('Address', value)}
                                        rows={3}
                                        disabled={isSubmitting}
                                        showCount
                                        maxLength={500}
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            name="City"
                                            label="City"
                                            placeholder="Enter city"
                                            value={formData.City}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                        <InputField
                                            name="State"
                                            label="State/Province"
                                            placeholder="Enter state or province"
                                            value={formData.State}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <SelectBox
                                            name="Country"
                                            label="Country"
                                            placeholder="Select country"
                                            value={formData.Country}
                                            handleChange={(value) => handleSelectChange('Country', value)}
                                            optionList={COUNTRY_OPTIONS}
                                            disabled={isSubmitting}
                                        />
                                        <InputField
                                            name="PostalCode"
                                            label="Postal Code"
                                            placeholder="Enter postal code"
                                            value={formData.PostalCode}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Financial Information */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                    Financial Information
                                </h2>
                                <div className="space-y-4">
                                    <InputField
                                        name="TaxNumber"
                                        label="Tax Number"
                                        placeholder="Enter tax identification number"
                                        value={formData.TaxNumber}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                    <SelectBox
                                        name="Currency"
                                        label="Currency"
                                        placeholder="Select currency"
                                        value={formData.Currency}
                                        handleChange={(value) => handleSelectChange('Currency', value)}
                                        optionList={CURRENCY_OPTIONS}
                                        disabled={isSubmitting}
                                    />
                                    <SelectBox
                                        name="PaymentTerms"
                                        label="Payment Terms"
                                        placeholder="Select payment terms"
                                        value={formData.PaymentTerms}
                                        handleChange={(value) => handleSelectChange('PaymentTerms', value)}
                                        optionList={PAYMENT_TERMS_OPTIONS}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Status & Notes */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                    <Info className="w-5 h-5 text-blue-600" />
                                    Status & Notes
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <input
                                            type="checkbox"
                                            id="IsActive"
                                            name="IsActive"
                                            checked={formData.IsActive}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                        <label
                                            htmlFor="IsActive"
                                            className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                        >
                                            Active Vendor
                                        </label>
                                        <Span className="ml-2 text-xs text-gray-500">
                                            (Inactive vendors won't appear in selections)
                                        </Span>
                                    </div>
                                    <TextArea
                                        name="Notes"
                                        label="Notes"
                                        placeholder="Enter any additional notes or comments about this vendor"
                                        value={formData.Notes}
                                        onChange={(value) => handleTextAreaChange('Notes', value)}
                                        rows={4}
                                        disabled={isSubmitting}
                                        showCount
                                        maxLength={1000}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions - Mobile Responsive */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                <OutlineButton
                                    buttonText="Cancel"
                                    onClick={handleCancel}
                                    borderColor="border-gray-300"
                                    borderWidth="border"
                                    rounded="rounded-lg"
                                    bgColor="bg-white hover:bg-gray-50"
                                    textColor="text-gray-700"
                                    height="h-11"
                                    px="px-6"
                                    fontWeight="font-medium"
                                    fontSize="text-sm"
                                    icon={X}
                                    iconSize="w-4 h-4"
                                    isIconLeft={true}
                                    disabled={isSubmitting}
                                />
                                <FilledButton
                                    isIcon={true}
                                    icon={Save}
                                    iconSize="w-4 h-4"
                                    bgColor="bg-green-600 hover:bg-green-700"
                                    textColor="text-white"
                                    rounded="rounded-lg"
                                    buttonText={
                                        isSubmitting
                                            ? 'Saving...'
                                            : 'Save & Continue'
                                    }
                                    height="h-11"
                                    px="px-6"
                                    fontWeight="font-medium"
                                    fontSize="text-sm"
                                    isIconLeft={true}
                                    onClick={handleSaveAndContinue}
                                    disabled={!hasRequiredFields || isSubmitting || loading}
                                />
                                <FilledButton
                                    isIcon={true}
                                    icon={Save}
                                    iconSize="w-4 h-4"
                                    bgColor={hasRequiredFields && !isSubmitting ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"}
                                    textColor="text-white"
                                    rounded="rounded-lg"
                                    buttonText={
                                        isSubmitting
                                            ? (isEditMode ? 'Saving Changes...' : 'Creating Vendor...')
                                            : (isEditMode ? 'Save Changes' : 'Create Vendor')
                                    }
                                    height="h-11"
                                    px="px-6"
                                    fontWeight="font-medium"
                                    fontSize="text-sm"
                                    isIconLeft={true}
                                    onClick={handleSubmit}
                                    disabled={!hasRequiredFields || isSubmitting || loading}
                                />
                            </div>
                        </div>
                    </form>
                </Container>
            </Container>
        </Container>
    );
};

export default AddVendors;