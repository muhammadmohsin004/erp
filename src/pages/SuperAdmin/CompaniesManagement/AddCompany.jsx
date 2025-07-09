import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  CreditCard, 
  Lock, 
  AlertCircle,
  User,
  MapPin,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';

const AddCompany = () => {
  const navigate = useNavigate();
  const { 
    createCompany, 
    getSubscriptionPlans, 
    subscriptionPlans, 
    isLoading, 
    error, 
    clearError 
  } = useSuperAdmin();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    website: '',
    taxNumber: '',
    subscriptionPlanId: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load subscription plans on component mount
  useEffect(() => {
    getSubscriptionPlans();
  }, []);

  // Clear errors when user starts typing
  useEffect(() => {
    if (error) clearError();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.name.trim()) errors.name = 'Company name is required';
    if (!formData.email.trim()) errors.email = 'Company email is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State/Province is required';
    if (!formData.country.trim()) errors.country = 'Country is required';
    if (!formData.adminFirstName.trim()) errors.adminFirstName = 'Admin first name is required';
    if (!formData.adminLastName.trim()) errors.adminLastName = 'Admin last name is required';
    if (!formData.adminEmail.trim()) errors.adminEmail = 'Admin email is required';
    if (!formData.adminPassword.trim()) errors.adminPassword = 'Admin password is required';
    if (!formData.subscriptionPlanId) errors.subscriptionPlanId = 'Subscription plan is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formData.adminEmail && !emailRegex.test(formData.adminEmail)) {
      errors.adminEmail = 'Please enter a valid admin email address';
    }

    // Password validation
    if (formData.adminPassword && formData.adminPassword.length < 8) {
      errors.adminPassword = 'Password must be at least 8 characters';
    }

    // Website validation
    if (formData.website && !formData.website.startsWith('http')) {
      errors.website = 'Website must start with http:// or https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare payload with API field names
      const payload = {
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone || null,
        Address: formData.address,
        City: formData.city,
        State: formData.state,
        Country: formData.country,
        Website: formData.website || null,
        TaxNumber: formData.taxNumber || null,
        SubscriptionPlanId: parseInt(formData.subscriptionPlanId),
        AdminFirstName: formData.adminFirstName,
        AdminLastName: formData.adminLastName,
        AdminEmail: formData.adminEmail,
        AdminPhone: formData.adminPhone || null,
        AdminPassword: formData.adminPassword
      };

      const result = await createCompany(payload);
      
      if (result) {
        // Success - navigate back to companies list
        navigate('/superadmin/companies');
      }
    } catch (err) {
      console.error('Error creating company:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/superadmin/companies');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Companies
          </button>
          
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <Building className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Company</h1>
              <p className="text-gray-600">Create a new company with admin account and subscription</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={18} />
              <span>{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Company Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Building className="mr-2 text-blue-600" size={20} />
                Company Details
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      formErrors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="Enter company name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Company Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                      }`}
                      placeholder="company@example.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.website ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                      }`}
                      placeholder="https://www.example.com"
                    />
                  </div>
                  {formErrors.website && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.website}</p>
                  )}
                </div>

                {/* Tax Number */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Number
                  </label>
                  <input
                    type="text"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter tax identification number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MapPin className="mr-2 text-blue-600" size={20} />
                Address Information
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    formErrors.address ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="Enter street address"
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      formErrors.city ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="Enter city"
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      formErrors.state ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="Enter state/province"
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      formErrors.country ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="Enter country"
                  />
                  {formErrors.country && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="mr-2 text-blue-600" size={20} />
                Administrator Account
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Admin First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="adminFirstName"
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      formErrors.adminFirstName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {formErrors.adminFirstName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.adminFirstName}</p>
                  )}
                </div>

                {/* Admin Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="adminLastName"
                    value={formData.adminLastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      formErrors.adminLastName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {formErrors.adminLastName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.adminLastName}</p>
                  )}
                </div>

                {/* Admin Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.adminEmail ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                      }`}
                      placeholder="admin@example.com"
                    />
                  </div>
                  {formErrors.adminEmail && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.adminEmail}</p>
                  )}
                </div>

                {/* Admin Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="adminPhone"
                      value={formData.adminPhone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.adminPassword ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                      }`}
                      placeholder="Enter password (minimum 8 characters)"
                      minLength="8"
                    />
                  </div>
                  {formErrors.adminPassword && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.adminPassword}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-600">
                    Password must be at least 8 characters long
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plan Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCard className="mr-2 text-blue-600" size={20} />
                Subscription Plan
              </h2>
            </div>
            
            <div className="p-6">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Plan *
                </label>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading plans...</span>
                  </div>
                ) : (
                  <select
                    name="subscriptionPlanId"
                    value={formData.subscriptionPlanId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      formErrors.subscriptionPlanId ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a subscription plan</option>
                    {subscriptionPlans?.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.monthlyPrice}/month
                      </option>
                    ))}
                  </select>
                )}
                
                {formErrors.subscriptionPlanId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.subscriptionPlanId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Company...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="mr-2" size={18} />
                  Create Company
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;