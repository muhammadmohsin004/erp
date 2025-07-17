import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building, Globe, Shield, Check, User } from 'lucide-react';
import { useAuth } from '../../Contexts/AuthContexts/AuthContextsApi';

function Signup() {
    const navigate = useNavigate();
    const { registerCompany, isLoading, error, clearError } = useAuth();
    
    const [validated, setValidated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        taxNumber: '',
        companyAddress: '',
        companyCity: '',
        companyState: '',
        companyCountry: '',
        companyPostalCode: '',
        companyPhone: '',
        companyEmail: '',
        companyWebsite: '',
        currency: '',
        timeZone: '',
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPassword: ''
    });

    const currencies = [
        { value: '', label: 'Select currency' },
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound' },
        { value: 'CAD', label: 'CAD - Canadian Dollar' },
        { value: 'AUD', label: 'AUD - Australian Dollar' },
        { value: 'JPY', label: 'JPY - Japanese Yen' },
        { value: 'CNY', label: 'CNY - Chinese Yuan' },
        { value: 'INR', label: 'INR - Indian Rupee' }
    ];

    const timeZones = [
        { value: '', label: 'Select timezone' },
        { value: 'UTC-12:00', label: 'UTC-12:00 - Baker Island' },
        { value: 'UTC-11:00', label: 'UTC-11:00 - American Samoa' },
        { value: 'UTC-10:00', label: 'UTC-10:00 - Hawaii' },
        { value: 'UTC-09:00', label: 'UTC-09:00 - Alaska' },
        { value: 'UTC-08:00', label: 'UTC-08:00 - Pacific Time' },
        { value: 'UTC-07:00', label: 'UTC-07:00 - Mountain Time' },
        { value: 'UTC-06:00', label: 'UTC-06:00 - Central Time' },
        { value: 'UTC-05:00', label: 'UTC-05:00 - Eastern Time' },
        { value: 'UTC-04:00', label: 'UTC-04:00 - Atlantic Time' },
        { value: 'UTC-03:00', label: 'UTC-03:00 - Argentina' },
        { value: 'UTC-02:00', label: 'UTC-02:00 - South Georgia' },
        { value: 'UTC-01:00', label: 'UTC-01:00 - Azores' },
        { value: 'UTC+00:00', label: 'UTC+00:00 - London/Dublin' },
        { value: 'UTC+01:00', label: 'UTC+01:00 - Central Europe' },
        { value: 'UTC+02:00', label: 'UTC+02:00 - Eastern Europe' },
        { value: 'UTC+03:00', label: 'UTC+03:00 - Moscow' },
        { value: 'UTC+04:00', label: 'UTC+04:00 - Dubai' },
        { value: 'UTC+05:00', label: 'UTC+05:00 - Pakistan' },
        { value: 'UTC+05:30', label: 'UTC+05:30 - India' },
        { value: 'UTC+06:00', label: 'UTC+06:00 - Bangladesh' },
        { value: 'UTC+07:00', label: 'UTC+07:00 - Thailand' },
        { value: 'UTC+08:00', label: 'UTC+08:00 - China/Singapore' },
        { value: 'UTC+09:00', label: 'UTC+09:00 - Japan' },
        { value: 'UTC+10:00', label: 'UTC+10:00 - Australia East' },
        { value: 'UTC+11:00', label: 'UTC+11:00 - Solomon Islands' },
        { value: 'UTC+12:00', label: 'UTC+12:00 - New Zealand' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear errors when user starts typing
        if (formError) setFormError('');
        if (error) clearError();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError('');

        // Validate current step
        if (!validateCurrentStep()) {
            setValidated(true);
            setFormError('Please fill in all required fields.');
            return;
        }

        try {
            // Convert form data to API format
            const companyData = {
                CompanyName: formData.companyName,
                TaxNumber: formData.taxNumber,
                CompanyAddress: formData.companyAddress,
                CompanyCity: formData.companyCity,
                CompanyState: formData.companyState,
                CompanyCountry: formData.companyCountry,
                CompanyPostalCode: formData.companyPostalCode,
                CompanyPhone: formData.companyPhone,
                CompanyEmail: formData.companyEmail,
                CompanyWebsite: formData.companyWebsite,
                Currency: formData.currency,
                TimeZone: formData.timeZone,
                AdminFirstName: formData.adminFirstName,
                AdminLastName: formData.adminLastName,
                AdminEmail: formData.adminEmail,
                AdminPassword: formData.adminPassword
            };

            const result = await registerCompany(companyData);
            
            if (result) {
                // Show success message and redirect
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error("Error creating company:", err);
            setFormError(err.message || "Something went wrong while registering company");
        }

        setValidated(true);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getProgressPercentage = () => {
        const requiredFields = [
            'companyName', 'companyAddress', 'companyCity', 
            'companyState', 'companyCountry', 'companyPostalCode', 'companyPhone',
            'companyEmail', 'currency', 'timeZone', 'adminFirstName', 
            'adminLastName', 'adminEmail', 'adminPassword'
        ];
        
        const filledFields = requiredFields.filter(field => formData[field] !== '').length;
        return (filledFields / requiredFields.length) * 100;
    };

    const validateCurrentStep = () => {
        switch(currentStep) {
            case 1:
                return formData.companyName && formData.taxNumber && formData.companyAddress && 
                       formData.companyCity && formData.companyState && formData.companyCountry && 
                       formData.companyPostalCode && formData.companyPhone;
            case 2:
                return formData.companyEmail && formData.currency && formData.timeZone;
            case 3:
                return formData.adminFirstName && formData.adminLastName && 
                       formData.adminEmail && formData.adminPassword && formData.adminPassword.length >= 8;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (currentStep < 3 && validateCurrentStep()) {
            setCurrentStep(currentStep + 1);
            setValidated(false);
        } else {
            setValidated(true);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setValidated(false);
        }
    };

    const renderStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                                <Building size={32} className="text-blue-600" />
                            </div>
                            <h4 className="text-2xl font-bold text-blue-600 mb-2">Company Information</h4>
                            <p className="text-gray-600">Tell us about your company</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                placeholder="Enter your company name"
                                className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.companyName ? 'ring-2 ring-red-500' : ''}`}
                                required
                            />
                            {validated && !formData.companyName && (
                                <p className="mt-1 text-sm text-red-600">Please enter your company name.</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Number *</label>
                                <input
                                    type="text"
                                    name="taxNumber"
                                    value={formData.taxNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter tax number"
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.taxNumber ? 'ring-2 ring-red-500' : ''}`}
                                />
                                {validated && !formData.taxNumber && (
                                    <p className="mt-1 text-sm text-red-600">Please enter your tax number.</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Phone *</label>
                                <input
                                    type="tel"
                                    name="companyPhone"
                                    value={formData.companyPhone}
                                    onChange={handleInputChange}
                                    placeholder="Enter company phone"
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.companyPhone ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                />
                                {validated && !formData.companyPhone && (
                                    <p className="mt-1 text-sm text-red-600">Please enter company phone number.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Address *</label>
                            <input
                                type="text"
                                name="companyAddress"
                                value={formData.companyAddress}
                                onChange={handleInputChange}
                                placeholder="Enter company address"
                                className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.companyAddress ? 'ring-2 ring-red-500' : ''}`}
                                required
                            />
                            {validated && !formData.companyAddress && (
                                <p className="mt-1 text-sm text-red-600">Please enter company address.</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                                <input
                                    type="text"
                                    name="companyCity"
                                    value={formData.companyCity}
                                    onChange={handleInputChange}
                                    placeholder="Enter city"
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.companyCity ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                />
                                {validated && !formData.companyCity && (
                                    <p className="mt-1 text-sm text-red-600">Please enter city.</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">State/Province *</label>
                                <input
                                    type="text"
                                    name="companyState"
                                    value={formData.companyState}
                                    onChange={handleInputChange}
                                    placeholder="Enter state/province"
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.companyState ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                />
                                {validated && !formData.companyState && (
                                    <p className="mt-1 text-sm text-red-600">Please enter state/province.</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                                <input
                                    type="text"
                                    name="companyCountry"
                                    value={formData.companyCountry}
                                    onChange={handleInputChange}
                                    placeholder="Enter country"
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.companyCountry ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                />
                                {validated && !formData.companyCountry && (
                                    <p className="mt-1 text-sm text-red-600">Please enter country.</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code *</label>
                                <input
                                    type="text"
                                    name="companyPostalCode"
                                    value={formData.companyPostalCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter postal code"
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.companyPostalCode ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                />
                                {validated && !formData.companyPostalCode && (
                                    <p className="mt-1 text-sm text-red-600">Please enter postal code.</p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="bg-green-100 rounded-full p-4 inline-flex mb-4">
                                <Globe size={32} className="text-green-600" />
                            </div>
                            <h4 className="text-2xl font-bold text-green-600 mb-2">Business Details</h4>
                            <p className="text-gray-600">Configure your business settings</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Email *</label>
                                <input
                                    type="email"
                                    name="companyEmail"
                                    value={formData.companyEmail}
                                    onChange={handleInputChange}
                                    placeholder="Enter company email"
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.companyEmail ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                />
                                {validated && !formData.companyEmail && (
                                    <p className="mt-1 text-sm text-red-600">Please enter a valid company email.</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Website</label>
                                <input
                                    type="url"
                                    name="companyWebsite"
                                    value={formData.companyWebsite}
                                    onChange={handleInputChange}
                                    placeholder="https://www.example.com"
                                    className="w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Currency *</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.currency ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                >
                                    {currencies.map((currency, index) => (
                                        <option key={index} value={currency.value}>
                                            {currency.label}
                                        </option>
                                    ))}
                                </select>
                                {validated && !formData.currency && (
                                    <p className="mt-1 text-sm text-red-600">Please select a currency.</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Time Zone *</label>
                                <select
                                    name="timeZone"
                                    value={formData.timeZone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.timeZone ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                >
                                    {timeZones.map((timeZone, index) => (
                                        <option key={index} value={timeZone.value}>
                                            {timeZone.label}
                                        </option>
                                    ))}
                                </select>
                                {validated && !formData.timeZone && (
                                    <p className="mt-1 text-sm text-red-600">Please select a time zone.</p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="bg-yellow-100 rounded-full p-4 inline-flex mb-4">
                                <User size={32} className="text-yellow-600" />
                            </div>
                            <h4 className="text-2xl font-bold text-yellow-600 mb-2">Administrator Account</h4>
                            <p className="text-gray-600">Create your admin account</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Admin First Name *</label>
                                <input
                                    type="text"
                                    name="adminFirstName"
                                    value={formData.adminFirstName}
                                    onChange={handleInputChange}
                                    placeholder="Enter admin first name"
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.adminFirstName ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                />
                                {validated && !formData.adminFirstName && (
                                    <p className="mt-1 text-sm text-red-600">Please enter admin first name.</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Last Name *</label>
                                <input
                                    type="text"
                                    name="adminLastName"
                                    value={formData.adminLastName}
                                    onChange={handleInputChange}
                                    placeholder="Enter admin last name"
                                    className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.adminLastName ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                />
                                {validated && !formData.adminLastName && (
                                    <p className="mt-1 text-sm text-red-600">Please enter admin last name.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email *</label>
                            <input
                                type="email"
                                name="adminEmail"
                                value={formData.adminEmail}
                                onChange={handleInputChange}
                                placeholder="Enter admin email address"
                                className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && !formData.adminEmail ? 'ring-2 ring-red-500' : ''}`}
                                required
                            />
                            {validated && !formData.adminEmail && (
                                <p className="mt-1 text-sm text-red-600">Please enter a valid admin email address.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Password *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="adminPassword"
                                    value={formData.adminPassword}
                                    onChange={handleInputChange}
                                    placeholder="Create admin password"
                                    minLength="8"
                                    className={`w-full px-4 py-3 pr-12 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 ${validated && formData.adminPassword.length < 8 ? 'ring-2 ring-red-500' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {validated && formData.adminPassword.length < 8 && (
                                <p className="mt-1 text-sm text-red-600">Password must be at least 8 characters long.</p>
                            )}
                            <p className="mt-1 text-sm text-gray-600">Password must be at least 8 characters long.</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <div className="flex items-start">
                                <Shield className="mr-2 mt-0.5 text-blue-600" size={18} />
                                <div>
                                    <strong className="text-blue-800">Security Notice:</strong>
                                    <p className="text-blue-700 text-sm mt-1">This will be your main administrator account. Keep your credentials secure.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen py-8"
             style={{
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
             }}>
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-center">
                    <div className="w-full max-w-6xl">
                        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
                            <div className="flex flex-col lg:flex-row">
                                
                                {/* Left Side - Hero Section */}
                                <div className="hidden lg:flex lg:w-2/5 flex-col justify-center items-center text-white relative p-12"
                                     style={{
                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                     }}>
                                    <div className="text-center">
                                        <div className="mb-8">
                                            <h1 className="text-4xl font-bold mb-4">
                                                <span className="text-yellow-400">E</span>Solution
                                            </h1>
                                            <div className="bg-white/20 text-gray-900 px-4 py-2 rounded-full inline-block text-lg font-medium mb-6">
                                                Business Management Platform
                                            </div>
                                        </div>
                                        
                                        <h2 className="text-2xl mb-6 font-semibold">Join Thousands of Businesses</h2>
                                        <p className="text-lg mb-8 opacity-90 leading-relaxed">
                                            Streamline your operations, manage integrations, and grow your business with our comprehensive platform.
                                        </p>
                                        
                                        <div className="space-y-4 text-left max-w-sm mx-auto">
                                            <div className="flex items-center">
                                                <Check className="mr-4 bg-green-500/20 p-2 rounded-full" size={40} />
                                                <span className="text-lg">Advanced API Integrations</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Check className="mr-4 bg-green-500/20 p-2 rounded-full" size={40} />
                                                <span className="text-lg">Real-time Analytics</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Check className="mr-4 bg-green-500/20 p-2 rounded-full" size={40} />
                                                <span className="text-lg">Secure & Scalable</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Form */}
                                <div className="w-full lg:w-3/5 p-6 md:p-12">
                                    
                                    {/* Mobile Hero */}
                                    <div className="lg:hidden text-center mb-8">
                                        <h1 className="text-2xl font-bold mb-2">
                                            <span className="text-blue-600">E</span>Solution
                                        </h1>
                                        <p className="text-gray-600">Business Management Platform</p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600 font-semibold">Registration Progress</span>
                                            <span className="text-sm text-gray-600 font-semibold">{Math.round(getProgressPercentage())}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${getProgressPercentage()}%` }}
                                            ></div>
                                        </div>
                                        
                                        {/* Step Indicators */}
                                        <div className="flex justify-between">
                                            {[1, 2, 3].map(step => (
                                                <div key={step} className="flex flex-col items-center">
                                                    <div className={`rounded-full flex items-center justify-center w-10 h-10 ${
                                                        currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                                    } transition-all duration-300`}>
                                                        {currentStep > step ? <Check size={20} /> : step}
                                                    </div>
                                                    <span className={`mt-2 text-sm ${currentStep >= step ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                                                        {step === 1 ? 'Company' : step === 2 ? 'Business' : 'Admin'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Error Alert */}
                                    {(formError || error) && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                                            <div className="flex items-center">
                                                <Shield className="mr-2" size={18} />
                                                <span>{formError || error}</span>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {renderStepContent()}

                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                disabled={currentStep === 1}
                                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                Previous
                                            </button>

                                            {currentStep < 3 ? (
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    disabled={!validateCurrentStep()}
                                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                >
                                                    Next Step
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    disabled={isLoading || !validateCurrentStep()}
                                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                >
                                                    {isLoading ? (
                                                        <div className="flex items-center">
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                            Creating Company...
                                                        </div>
                                                    ) : (
                                                        'Register Company'
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </form>

                                    <div className="text-center mt-6 pt-4 border-t border-gray-200">
                                        <p className="text-gray-600">
                                            Already have an account?{' '}
                                            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-500 transition-colors duration-200">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;