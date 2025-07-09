import React, { useState, useEffect } from 'react';
import Table from '../../components/elements/table/Table';
import Modal from '../../components/elements/modal/Modal';
import SearchAndFilter from '../../components/elements/searchAndFilters/SearchAndFilters';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Building2, 
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Download,
  Upload,
  X,
  Save,
  User,
  Building,
} from 'lucide-react';
import { useClients } from '../../Contexts/apiClientContext/apiClientContext';

const Clients = () => {
  const {
    clients,
    currentClient,
    isLoading,
    error,
    pagination,
    statistics,
    searchTerm,
    clientType,
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    getStatistics,
    setSearchTerm,
    setClientType,
    clearCurrentClient,
    clearError,
    goToPage,
    changePageSize
  } = useClients();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    clientType: 'Individual',
    fullName: '',
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    mobile: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    vatNumber: '',
    codeNumber: '',
    invoicingMethod: '',
    currency: 'USD',
    category: '',
    notes: '',
    displayLanguage: 'English',
    hasSecondaryAddress: false,
    contacts: [],
    attachments: []
  });

  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    mobile: ''
  });

  const [attachmentFiles, setAttachmentFiles] = useState([]);

  // Load data on component mount
  useEffect(() => {
    getClients();
    getStatistics();
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: 'codeNumber',
      label: 'Code',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {value || 'N/A'}
        </span>
      )
    },
    {
      key: 'clientType',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Individual' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {value === 'Individual' ? <User className="w-3 h-3 mr-1" /> : <Building className="w-3 h-3 mr-1" />}
          {value}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {row.clientType === 'Individual' ? row.fullName : row.businessName}
          </span>
          {row.clientType === 'Business' && row.fullName && (
            <span className="text-sm text-gray-500">{row.fullName}</span>
          )}
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          {value ? (
            <>
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm">{value}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">No email</span>
          )}
        </div>
      )
    },
    {
      key: 'mobile',
      label: 'Phone',
      render: (value, row) => (
        <div className="flex items-center">
          {value || row.telephone ? (
            <>
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm">{value || row.telephone}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">No phone</span>
          )}
        </div>
      )
    },
    {
      key: 'city',
      label: 'Location',
      render: (value, row) => (
        <div className="flex items-center">
          {value || row.country ? (
            <>
              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm">{value}{value && row.country ? ', ' : ''}{row.country}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">No location</span>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(row.id)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row.id)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Search and filter configuration
  const searchAndFilterConfig = {
    searchPlaceholder: "Search clients...",
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
    filters: [
      {
        key: 'clientType',
        label: 'Client Type',
        type: 'select',
        value: clientType,
        onChange: setClientType,
        options: [
          { value: '', label: 'All Types' },
          { value: 'Individual', label: 'Individual' },
          { value: 'Business', label: 'Business' }
        ]
      }
    ],
    onApplyFilters: () => getClients({ page: 1 }),
    onClearFilters: () => {
      setSearchTerm('');
      setClientType('');
      getClients({ page: 1, searchTerm: '', clientType: '' });
    }
  };

  // Event handlers
  const handleView = async (clientId) => {
    setSelectedClientId(clientId);
    await getClient(clientId);
    setShowViewModal(true);
  };

  const handleEdit = async (clientId) => {
    setSelectedClientId(clientId);
    await getClient(clientId);
    if (currentClient) {
      setFormData({
        ...currentClient,
        contacts: currentClient.contacts || [],
        attachments: currentClient.attachments || []
      });
      setShowEditModal(true);
    }
  };

  const handleDelete = (clientId) => {
    setSelectedClientId(clientId);
    setShowDeleteModal(true);
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      clientType: 'Individual',
      fullName: '',
      businessName: '',
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      mobile: '',
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      vatNumber: '',
      codeNumber: '',
      invoicingMethod: '',
      currency: 'USD',
      category: '',
      notes: '',
      displayLanguage: 'English',
      hasSecondaryAddress: false,
      contacts: [],
      attachments: []
    });
    setAttachmentFiles([]);
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      mobile: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEditModal) {
        await updateClient(selectedClientId, formData, attachmentFiles);
        setShowEditModal(false);
      } else {
        await createClient(formData, attachmentFiles);
        setShowCreateModal(false);
      }
      resetForm();
      getClients();
      getStatistics();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteClient(selectedClientId);
      setShowDeleteModal(false);
      getClients();
      getStatistics();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const addContact = () => {
    if (newContact.firstName || newContact.lastName || newContact.email) {
      setFormData(prev => ({
        ...prev,
        contacts: [...prev.contacts, { ...newContact, id: Date.now() }]
      }));
      setNewContact({
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
        mobile: ''
      });
    }
  };

  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachmentFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Statistics cards - FIXED: Now accepts icon as a prop
  const StatCard = ({ title, value, icon: IconComponent, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
        <p className="text-gray-600">Manage your client database</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value={statistics?.totalClients || 0}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Individual Clients"
          value={statistics?.individualClients || 0}
          icon={User}
          color="bg-green-500"
        />
        <StatCard
          title="Business Clients"
          value={statistics?.businessClients || 0}
          icon={Building2}
          color="bg-purple-500"
        />
        <StatCard
          title="This Month"
          value={statistics?.clientsThisMonth || 0}
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <SearchAndFilter {...searchAndFilterConfig} />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Client List</h2>
            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={clients || []}
          loading={isLoading}
          pagination={{
            currentPage: pagination?.page || 1,
            totalPages: Math.ceil((pagination?.totalItems || 0) / (pagination?.pageSize || 10)),
            pageSize: pagination?.pageSize || 10,
            totalItems: pagination?.totalItems || 0,
            onPageChange: goToPage,
            onPageSizeChange: changePageSize
          }}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          resetForm();
        }}
        title={showEditModal ? 'Edit Client' : 'Create New Client'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Type *
            </label>
            <select
              value={formData.clientType}
              onChange={(e) => setFormData(prev => ({ ...prev, clientType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Individual">Individual</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.clientType === 'Individual' ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Number *
              </label>
              <input
                type="text"
                value={formData.codeNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, codeNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telephone
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address 1
                </label>
                <input
                  type="text"
                  value={formData.streetAddress1}
                  onChange={(e) => setFormData(prev => ({ ...prev, streetAddress1: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address 2
                </label>
                <input
                  type="text"
                  value={formData.streetAddress2}
                  onChange={(e) => setFormData(prev => ({ ...prev, streetAddress2: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Number
                </label>
                <input
                  type="text"
                  value={formData.vatNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, vatNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Language
                </label>
                <select
                  value={formData.displayLanguage}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayLanguage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Contacts</h3>
            
            {/* Add Contact Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Add New Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={newContact.firstName}
                  onChange={(e) => setNewContact(prev => ({ ...prev, firstName: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={newContact.mobile}
                  onChange={(e) => setNewContact(prev => ({ ...prev, mobile: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addContact}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            </div>

            {/* Contacts List */}
            {formData.contacts.length > 0 && (
              <div className="space-y-2">
                {formData.contacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                      <span><strong>Name:</strong> {contact.firstName} {contact.lastName}</span>
                      <span><strong>Email:</strong> {contact.email}</span>
                      <span><strong>Tel:</strong> {contact.telephone}</span>
                      <span><strong>Mobile:</strong> {contact.mobile}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Attachments */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">File Attachments</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, PDF, DOC, DOCX, TXT (Max 10MB each)
              </p>
            </div>

            {/* Selected Files */}
            {attachmentFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Selected Files:</h4>
                {attachmentFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Existing Attachments (for edit mode) */}
            {showEditModal && formData.attachments && formData.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Existing Attachments:</h4>
                <div className="space-y-2">
                  {formData.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-sm">{attachment.file || attachment.fileName}</span>
                      </div>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : showEditModal ? 'Update Client' : 'Create Client'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          clearCurrentClient();
        }}
        title="Client Details"
        size="lg"
      >
        {currentClient && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      currentClient.clientType === 'Individual' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {currentClient.clientType === 'Individual' ? <User className="w-3 h-3 mr-1" /> : <Building className="w-3 h-3 mr-1" />}
                      {currentClient.clientType}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Code Number</p>
                    <p className="font-medium">{currentClient.codeNumber || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">
                      {currentClient.clientType === 'Individual' ? 'Full Name' : 'Business Name'}
                    </p>
                    <p className="font-medium">
                      {currentClient.clientType === 'Individual' 
                        ? currentClient.fullName 
                        : currentClient.businessName}
                    </p>
                  </div>

                  {currentClient.clientType === 'Business' && currentClient.fullName && (
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium">{currentClient.fullName}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{currentClient.email || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="font-medium">{currentClient.mobile || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Telephone</p>
                    <p className="font-medium">{currentClient.telephone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Street Address</p>
                    <p className="font-medium">
                      {currentClient.streetAddress1 || 'N/A'}
                      {currentClient.streetAddress2 && (
                        <><br />{currentClient.streetAddress2}</>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium">{currentClient.city || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">State/Province</p>
                    <p className="font-medium">{currentClient.state || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Postal Code</p>
                    <p className="font-medium">{currentClient.postalCode || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium">{currentClient.country || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">VAT Number</p>
                  <p className="font-medium">{currentClient.vatNumber || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="font-medium">{currentClient.currency || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{currentClient.category || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Display Language</p>
                  <p className="font-medium">{currentClient.displayLanguage || 'N/A'}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="font-medium">{currentClient.notes || 'No notes'}</p>
                </div>
              </div>
            </div>

            {/* Contacts */}
            {currentClient.contacts && currentClient.contacts.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Contacts</h3>
                <div className="space-y-3">
                  {currentClient.contacts.map((contact, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{contact.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Telephone</p>
                          <p className="font-medium">{contact.telephone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Mobile</p>
                          <p className="font-medium">{contact.mobile || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {currentClient.attachments && currentClient.attachments.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                <div className="space-y-2">
                  {currentClient.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">{attachment.file || attachment.fileName}</p>
                          <p className="text-sm text-gray-600">
                            Uploaded: {new Date(attachment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">{new Date(currentClient.createdAt).toLocaleString()}</p>
                </div>
                {currentClient.updatedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{new Date(currentClient.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(currentClient.id);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Client</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Client"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Delete Client</h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this client? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clients; 