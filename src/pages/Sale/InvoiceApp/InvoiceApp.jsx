// import React, { useState, useEffect } from 'react';
// import { 
//   ChevronDownIcon, 
//   ChevronLeftIcon,
//   EyeIcon,
//   PlusIcon,
//   TrashIcon,
//   DocumentTextIcon,
//   CalendarIcon,
//   UserIcon,
//   CurrencyDollarIcon,
//   QuestionMarkCircleIcon,
//   MagnifyingGlassIcon,
//   AdjustmentsHorizontalIcon,
//   PrinterIcon,
//   PaperAirplaneIcon,
//   BellIcon,
//   ChatBubbleLeftIcon,
//   ArrowUpTrayIcon,
//   ChartBarIcon,
//   EllipsisHorizontalIcon,
//   PencilIcon,
//   DocumentDuplicateIcon
// } from '@heroicons/react/24/outline';

// // Import contexts
// import { useInvoices } from '../../../Contexts/InvoiceContext/InvoiceContext';
// import { useClients } from '../../../Contexts/apiClientContext/apiClientContext';
// import { useProductsManager } from '../../../Contexts/ProductsManagerContext/ProductsManagerContext';
// import { useService } from '../../../Contexts/ServiceContext/ServiceContext';

// // Dynamic Modal Component
// const DynamicModal = ({ isOpen, onClose, entityType, onSave, loading = false }) => {
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});
  
//   const entityConfigs = {
//     client: {
//       title: 'Add New Client',
//       fields: [
//         { name: 'FullName', label: 'Full Name', type: 'text', required: true },
//         { name: 'BusinessName', label: 'Business Name', type: 'text' },
//         { name: 'Email', label: 'Email', type: 'email', required: true },
//         { name: 'Mobile', label: 'Mobile', type: 'tel', required: true },
//         { name: 'Telephone', label: 'Phone', type: 'tel' },
//         { name: 'Address', label: 'Address', type: 'textarea' },
//         { name: 'City', label: 'City', type: 'text' },
//         { name: 'Country', label: 'Country', type: 'text' },
//         { name: 'ClientType', label: 'Client Type', type: 'select', options: ['Individual', 'Business'], required: true },
//         { name: 'Currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'PKR', 'INR'] },
//         { name: 'TaxNumber', label: 'Tax Number', type: 'text' },
//         { name: 'PaymentTerms', label: 'Payment Terms', type: 'text' }
//       ]
//     },
//     product: {
//       title: 'Add New Product',
//       fields: [
//         { name: 'Name', label: 'Product Name', type: 'text', required: true },
//         { name: 'Description', label: 'Description', type: 'textarea' },
//         { name: 'UnitPrice', label: 'Unit Price', type: 'number', required: true },
//         { name: 'SKU', label: 'SKU', type: 'text' },
//         { name: 'Barcode', label: 'Barcode', type: 'text' },
//         { name: 'CategoryId', label: 'Category', type: 'select', options: [] }, // Will be populated dynamically
//         { name: 'BrandId', label: 'Brand', type: 'select', options: [] }, // Will be populated dynamically
//         { name: 'Status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }
//       ]
//     },
//     service: {
//       title: 'Add New Service',
//       fields: [
//         { name: 'Name', label: 'Service Name', type: 'text', required: true },
//         { name: 'Description', label: 'Description', type: 'textarea' },
//         { name: 'UnitPrice', label: 'Unit Price', type: 'number', required: true },
//         { name: 'ServiceCode', label: 'Service Code', type: 'text' },
//         { name: 'Duration', label: 'Duration (hours)', type: 'number' },
//         { name: 'Status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }
//       ]
//     }
//   };

//   const config = entityConfigs[entityType] || entityConfigs.client;

//   const validateForm = () => {
//     const newErrors = {};
//     config.fields.forEach(field => {
//       if (field.required && !formData[field.name]) {
//         newErrors[field.name] = `${field.label} is required`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
    
//     try {
//       await onSave(formData);
//       setFormData({});
//       setErrors({});
//       onClose();
//     } catch (error) {
//       console.error('Error saving entity:', error);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-2xl"
//           >
//             ×
//           </button>
//         </div>
        
//         <div className="p-6 space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {config.fields.map((field) => (
//               <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {field.label}
//                   {field.required && <span className="text-red-500 ml-1">*</span>}
//                 </label>
                
//                 {field.type === 'textarea' ? (
//                   <textarea
//                     value={formData[field.name] || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
//                       errors[field.name] ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     rows={3}
//                   />
//                 ) : field.type === 'select' ? (
//                   <select
//                     value={formData[field.name] || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
//                       errors[field.name] ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                   >
//                     <option value="">Select {field.label}</option>
//                     {field.options?.map(option => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                 ) : (
//                   <input
//                     type={field.type}
//                     value={formData[field.name] || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
//                       errors[field.name] ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                   />
//                 )}
                
//                 {errors[field.name] && (
//                   <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
//                 )}
//               </div>
//             ))}
//           </div>
          
//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={loading}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
//             >
//               {loading ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Invoice Creation Component
// const InvoiceCreation = ({ onBack, editingInvoice = null }) => {
//   const { 
//     createInvoice, 
//     updateInvoice, 
//     getClientDetails, 
//     clientDetails,
//     isLoading, 
//     error, 
//     clearError 
//   } = useInvoices();
  
//   const { 
//     clients, 
//     getClients, 
//     createClient,
//     isLoading: clientsLoading 
//   } = useClients();
  
//   const { 
//     products, 
//     getProducts, 
//     createProduct,
//     loading: productsLoading 
//   } = useProductsManager();
  
//   const { 
//     services, 
//     getServices, 
//     createService,
//     loading: servicesLoading 
//   } = useService();

//   const [invoice, setInvoice] = useState({
//     clientId: editingInvoice?.clientId || '',
//     invoiceNumber: editingInvoice?.invoiceNumber || '',
//     invoiceDate: editingInvoice?.invoiceDate || new Date().toISOString().split('T')[0],
//     dueDate: editingInvoice?.dueDate || '',
//     status: editingInvoice?.status || 'Draft',
//     currency: editingInvoice?.currency || 'USD',
//     exchangeRate: editingInvoice?.exchangeRate || 1,
//     paymentTerms: editingInvoice?.paymentTerms || '',
//     notes: editingInvoice?.notes || '',
//     internalNotes: editingInvoice?.internalNotes || '',
//     purchaseOrderNumber: editingInvoice?.purchaseOrderNumber || '',
//     discountAmount: editingInvoice?.discountAmount || 0,
//     shippingAmount: editingInvoice?.shippingAmount || 0,
//     isRecurring: editingInvoice?.isRecurring || false,
//     items: editingInvoice?.items || [{
//       id: 1,
//       productId: null,
//       serviceId: null,
//       description: '',
//       quantity: 1,
//       unitPrice: 0,
//       discount: 0,
//       discountType: 'percentage',
//       taxRate: 0
//     }]
//   });

//   const [activeTab, setActiveTab] = useState('discount');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalEntityType, setModalEntityType] = useState('client');
//   const [modalLoading, setModalLoading] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     method: true,
//     client: true,
//     items: true,
//     additional: true
//   });

//   // Load initial data
//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         await Promise.all([
//           getClients(),
//           getProducts(),
//           getServices()
//         ]);
//       } catch (error) {
//         console.error('Error loading initial data:', error);
//       }
//     };

//     loadInitialData();
//   }, []);

//   // Load client details when client is selected
//   useEffect(() => {
//     if (invoice.clientId) {
//       getClientDetails(parseInt(invoice.clientId));
//     }
//   }, [invoice.clientId]);

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const openCreateModal = (entityType) => {
//     setModalEntityType(entityType);
//     setIsModalOpen(true);
//   };

//   const handleModalSave = async (data) => {
//     setModalLoading(true);
//     try {
//       switch (modalEntityType) {
//         case 'client':
//           const newClient = await createClient(data);
//           if (newClient) {
//             setInvoice(prev => ({ ...prev, clientId: newClient.Id }));
//             await getClients(); // Refresh clients list
//           }
//           break;
//         case 'product':
//           await createProduct(data);
//           await getProducts(); // Refresh products list
//           break;
//         case 'service':
//           await createService(data);
//           await getServices(); // Refresh services list
//           break;
//       }
//     } catch (error) {
//       console.error(`Error creating ${modalEntityType}:`, error);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const addInvoiceItem = () => {
//     const newItem = {
//       id: Date.now(),
//       productId: null,
//       serviceId: null,
//       description: '',
//       quantity: 1,
//       unitPrice: 0,
//       discount: 0,
//       discountType: 'percentage',
//       taxRate: 0
//     };
//     setInvoice(prev => ({
//       ...prev,
//       items: [...prev.items, newItem]
//     }));
//   };

//   const removeInvoiceItem = (itemId) => {
//     setInvoice(prev => ({
//       ...prev,
//       items: prev.items.filter(item => item.id !== itemId)
//     }));
//   };

//   const updateInvoiceItem = (itemId, field, value) => {
//     setInvoice(prev => ({
//       ...prev,
//       items: prev.items.map(item => {
//         if (item.id === itemId) {
//           const updatedItem = { ...item, [field]: value };
          
//           // Auto-populate item details when product/service is selected
//           if (field === 'productId' && value) {
//             const selectedProduct = products?.Data?.$values?.find(p => p.Id === parseInt(value));
//             if (selectedProduct) {
//               updatedItem.description = selectedProduct.Description || selectedProduct.Name;
//               updatedItem.unitPrice = selectedProduct.UnitPrice || 0;
//               updatedItem.serviceId = null; // Clear service if product selected
//             }
//           } else if (field === 'serviceId' && value) {
//             const selectedService = services?.Data?.$values?.find(s => s.Id === parseInt(value));
//             if (selectedService) {
//               updatedItem.description = selectedService.Description || selectedService.Name;
//               updatedItem.unitPrice = selectedService.UnitPrice || 0;
//               updatedItem.productId = null; // Clear product if service selected
//             }
//           }
          
//           return updatedItem;
//         }
//         return item;
//       })
//     }));
//   };

//   const calculateItemSubtotal = (item) => {
//     const lineAmount = item.quantity * item.unitPrice;
//     const discountAmount = item.discountType === 'percentage' 
//       ? lineAmount * (item.discount / 100)
//       : item.discount;
//     const afterDiscount = lineAmount - discountAmount;
//     const taxAmount = afterDiscount * (item.taxRate / 100);
//     return afterDiscount + taxAmount;
//   };

//   const calculateTotal = () => {
//     const itemsTotal = invoice.items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
//     return itemsTotal + (invoice.shippingAmount || 0) - (invoice.discountAmount || 0);
//   };

//   const handleSaveInvoice = async (status = 'Draft') => {
//     try {
//       clearError();
      
//       if (!invoice.clientId) {
//         alert('Please select a client');
//         return;
//       }

//       const invoiceData = {
//         ...invoice,
//         clientId: parseInt(invoice.clientId),
//         status,
//         items: invoice.items.map(item => ({
//           productId: item.productId ? parseInt(item.productId) : null,
//           serviceId: item.serviceId ? parseInt(item.serviceId) : null,
//           description: item.description,
//           quantity: item.quantity,
//           unitPrice: item.unitPrice,
//           discount: item.discount,
//           discountType: item.discountType,
//           taxRate: item.taxRate
//         }))
//       };

//       let result;
//       if (editingInvoice) {
//         result = await updateInvoice(editingInvoice.id, invoiceData);
//       } else {
//         result = await createInvoice(invoiceData);
//       }

//       if (result) {
//         onBack();
//       }
//     } catch (error) {
//       console.error('Error saving invoice:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between py-4">
//             <div className="flex items-center space-x-4">
//               <button onClick={onBack} className="p-2 hover:bg-blue-700 rounded-lg">
//                 <ChevronLeftIcon className="h-5 w-5" />
//               </button>
//               <nav className="flex items-center space-x-2 text-sm">
//                 <span>Invoices</span>
//                 <ChevronDownIcon className="h-4 w-4" />
//                 <span>{editingInvoice ? 'Edit' : 'Add'}</span>
//               </nav>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button className="p-2 hover:bg-blue-700 rounded-lg">
//                 <QuestionMarkCircleIcon className="h-5 w-5" />
//                 <span className="ml-1 text-sm">Help</span>
//               </button>
//               <div className="flex items-center space-x-2">
//                 <BellIcon className="h-5 w-5" />
//                 <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-medium">
//                   A
//                 </div>
//                 <div className="text-sm">
//                   <div className="font-medium">Adnan Pro</div>
//                   <div className="text-blue-200 text-xs">19/07/2025 11:26</div>
//                 </div>
//                 <ChevronDownIcon className="h-4 w-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Bar */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between py-3">
//             <div className="flex items-center space-x-3">
//               <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//                 <EyeIcon className="h-4 w-4 mr-2" />
//                 Preview
//                 <ChevronDownIcon className="h-4 w-4 ml-2" />
//               </button>
//               <button 
//                 onClick={() => handleSaveInvoice('Draft')}
//                 disabled={isLoading}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//               >
//                 {isLoading ? 'Saving...' : 'Save as Draft'}
//               </button>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="text-sm text-gray-600">
//                 Invoice Layout
//               </div>
//               <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
//                 <option>Default Invoice Layout</option>
//               </select>
//               <button 
//                 onClick={() => handleSaveInvoice('Sent')}
//                 disabled={isLoading}
//                 className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
//               >
//                 {isLoading ? 'Saving...' : 'Save & Send Email'}
//                 <ChevronDownIcon className="h-4 w-4 ml-2" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex">
//               <div className="text-red-800">
//                 <strong>Error:</strong> {error}
//               </div>
//               <button
//                 onClick={clearError}
//                 className="ml-auto text-red-600 hover:text-red-800"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Method Section */}
//             <div className="bg-white rounded-lg shadow-sm border">
//               <button
//                 onClick={() => toggleSection('method')}
//                 className="w-full flex items-center justify-between p-4 text-left"
//               >
//                 <span className="font-medium text-gray-900">Method:</span>
//                 <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${expandedSections.method ? 'rotate-180' : ''}`} />
//               </button>
//               {expandedSections.method && (
//                 <div className="px-4 pb-4">
//                   <div className="flex items-center space-x-4">
//                     <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
//                       <option>Send via Email</option>
//                       <option>Send via SMS</option>
//                       <option>Print</option>
//                     </select>
//                     <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Client Section */}
//             <div className="bg-white rounded-lg shadow-sm border">
//               <button
//                 onClick={() => toggleSection('client')}
//                 className="w-full flex items-center justify-between p-4 text-left"
//               >
//                 <span className="font-medium text-gray-900">
//                   Client <span className="text-red-500">*</span>
//                 </span>
//                 <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${expandedSections.client ? 'rotate-180' : ''}`} />
//               </button>
//               {expandedSections.client && (
//                 <div className="px-4 pb-4">
//                   <div className="flex items-center space-x-4">
//                     <select 
//                       value={invoice.clientId}
//                       onChange={(e) => setInvoice(prev => ({ ...prev, clientId: e.target.value }))}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       disabled={clientsLoading}
//                     >
//                       <option value="">(Select Client)</option>
//                       {clients?.map(client => (
//                         <option key={client.Id} value={client.Id}>
//                           {client.FullName || client.BusinessName}
//                         </option>
//                       ))}
//                     </select>
//                     <button 
//                       onClick={() => openCreateModal('client')}
//                       className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 text-sm font-medium"
//                     >
//                       New
//                     </button>
//                     <div className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
//                       {clientDetails?.Currency || 'USD'}
//                       <ChevronDownIcon className="h-4 w-4 inline ml-1" />
//                     </div>
//                   </div>
                  
//                   {/* Client Details Preview */}
//                   {clientDetails && (
//                     <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
//                       <div className="font-medium">{clientDetails.DisplayName}</div>
//                       {clientDetails.Email && <div className="text-gray-600">{clientDetails.Email}</div>}
//                       {clientDetails.Phone && <div className="text-gray-600">{clientDetails.Phone}</div>}
//                       {clientDetails.Address && <div className="text-gray-600">{clientDetails.Address}</div>}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Items Section */}
//             <div className="bg-white rounded-lg shadow-sm border">
//               <div className="p-4 border-b">
//                 <div className="flex items-center justify-center">
//                   <PlusIcon className="h-8 w-8 text-cyan-500 border-2 border-cyan-500 rounded-full p-1" />
//                 </div>
//               </div>
              
//               {/* Items Table Header */}
//               <div className="bg-gray-50 px-4 py-3">
//                 <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
//                   <div className="col-span-2">Item</div>
//                   <div className="col-span-3">Description</div>
//                   <div className="col-span-1">Unit Price</div>
//                   <div className="col-span-1">Quantity</div>
//                   <div className="col-span-1">Discount</div>
//                   <div className="col-span-1">Tax 1</div>
//                   <div className="col-span-2">Subtotal</div>
//                   <div className="col-span-1"></div>
//                 </div>
//               </div>

//               {/* Items */}
//               {invoice.items.map((item, index) => (
//                 <div key={item.id} className="px-4 py-3 border-b">
//                   <div className="grid grid-cols-12 gap-4 items-center">
//                     <div className="col-span-2">
//                       <select 
//                         value={item.productId || item.serviceId || ''}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           if (value.startsWith('product-')) {
//                             updateInvoiceItem(item.id, 'productId', value.replace('product-', ''));
//                           } else if (value.startsWith('service-')) {
//                             updateInvoiceItem(item.id, 'serviceId', value.replace('service-', ''));
//                           }
//                         }}
//                         className="w-full px-3 py-2 bg-yellow-50 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       >
//                         <option value="">Item</option>
//                         <optgroup label="Products">
//                           {products?.Data?.$values?.map(product => (
//                             <option key={`product-${product.Id}`} value={`product-${product.Id}`}>
//                               {product.Name}
//                             </option>
//                           ))}
//                         </optgroup>
//                         <optgroup label="Services">
//                           {services?.Data?.$values?.map(service => (
//                             <option key={`service-${service.Id}`} value={`service-${service.Id}`}>
//                               {service.Name}
//                             </option>
//                           ))}
//                         </optgroup>
//                       </select>
//                     </div>
//                     <div className="col-span-3">
//                       <input
//                         type="text"
//                         value={item.description}
//                         onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
//                         placeholder="Description"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       />
//                     </div>
//                     <div className="col-span-1">
//                       <input
//                         type="number"
//                         value={item.unitPrice}
//                         onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
//                         className="w-full px-2 py-1 text-sm border-0 bg-transparent text-center"
//                         placeholder="Unit Price"
//                         min="0"
//                         step="0.01"
//                       />
//                     </div>
//                     <div className="col-span-1">
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
//                         className="w-full px-2 py-1 text-sm border-0 bg-transparent text-center"
//                         min="1"
//                       />
//                     </div>
//                     <div className="col-span-1">
//                       <div className="flex">
//                         <input
//                           type="number"
//                           value={item.discount}
//                           onChange={(e) => updateInvoiceItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
//                           className="w-12 px-1 py-1 text-sm border-0 bg-transparent text-center"
//                           placeholder="Disc."
//                           min="0"
//                         />
//                         <select 
//                           value={item.discountType}
//                           onChange={(e) => updateInvoiceItem(item.id, 'discountType', e.target.value)}
//                           className="w-8 text-xs border-0 bg-transparent"
//                         >
//                           <option value="percentage">%</option>
//                           <option value="fixed">₹</option>
//                         </select>
//                       </div>
//                     </div>
//                     <div className="col-span-1">
//                       <select 
//                         value={item.taxRate}
//                         onChange={(e) => updateInvoiceItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
//                         className="w-full px-2 py-1 text-sm border-0 bg-transparent"
//                       >
//                         <option value={0}>0%</option>
//                         <option value={5}>5%</option>
//                         <option value={10}>10%</option>
//                         <option value={18}>18%</option>
//                       </select>
//                     </div>
//                     <div className="col-span-2 text-right">
//                       <span className="text-sm">Rs. {calculateItemSubtotal(item).toFixed(2)}</span>
//                     </div>
//                     <div className="col-span-1">
//                       {invoice.items.length > 1 && (
//                         <button
//                           onClick={() => removeInvoiceItem(item.id)}
//                           className="p-1 text-red-500 hover:bg-red-50 rounded"
//                         >
//                           <TrashIcon className="h-4 w-4" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Add Item Button */}
//               <div className="px-4 py-3">
//                 <button
//                   onClick={addInvoiceItem}
//                   className="flex items-center text-cyan-600 hover:text-cyan-700 text-sm"
//                 >
//                   <PlusIcon className="h-4 w-4 mr-1" />
//                   Add
//                   <ChevronDownIcon className="h-4 w-4 ml-1" />
//                 </button>
//               </div>

//               {/* Items Total */}
//               <div className="px-4 py-3 bg-gray-50 border-t">
//                 <div className="flex justify-end">
//                   <div className="text-sm">
//                     <span className="text-gray-600">Items Total</span>
//                     <span className="ml-4 font-medium">Rs. {calculateTotal().toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Additional Options Tabs */}
//             <div className="bg-white rounded-lg shadow-sm border">
//               <div className="border-b">
//                 <nav className="flex space-x-8 px-4">
//                   {[
//                     { id: 'discount', label: 'Discount & Adjustment' },
//                     { id: 'deposit', label: 'Deposit' },
//                     { id: 'shipping', label: 'Shipping Details' },
//                     { id: 'documents', label: 'Attach Documents' },
//                     { id: 'reminders', label: 'Automatic Reminders' },
//                     { id: 'terms', label: 'Terms & Conditions' }
//                   ].map((tab) => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                         activeTab === tab.id
//                           ? 'border-purple-500 text-purple-600'
//                           : 'border-transparent text-gray-500 hover:text-gray-700'
//                       }`}
//                     >
//                       {tab.label}
//                       <QuestionMarkCircleIcon className="h-4 w-4 inline ml-1" />
//                     </button>
//                   ))}
//                 </nav>
//               </div>

//               <div className="p-6">
//                 {activeTab === 'discount' && (
//                   <div className="grid grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Discount
//                       </label>
//                       <div className="flex space-x-2">
//                         <input
//                           type="number"
//                           value={invoice.discountAmount}
//                           onChange={(e) => setInvoice(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
//                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                           placeholder="0"
//                           min="0"
//                         />
//                         <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
//                           <option>Percentage (%)</option>
//                           <option>Fixed Amount</option>
//                         </select>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Shipping Amount
//                         <QuestionMarkCircleIcon className="h-4 w-4 inline ml-1" />
//                       </label>
//                       <input
//                         type="number"
//                         value={invoice.shippingAmount}
//                         onChange={(e) => setInvoice(prev => ({ ...prev, shippingAmount: parseFloat(e.target.value) || 0 }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         placeholder="0.00"
//                         min="0"
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === 'terms' && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Notes / Terms
//                       <QuestionMarkCircleIcon className="h-4 w-4 inline ml-1" />
//                     </label>
                    
//                     {/* Rich Text Editor Toolbar */}
//                     <div className="border border-gray-300 rounded-t-lg bg-gray-50 px-3 py-2 flex items-center space-x-2">
//                       <button className="p-1 hover:bg-gray-200 rounded">
//                         <strong>B</strong>
//                       </button>
//                       <button className="p-1 hover:bg-gray-200 rounded">
//                         <em>I</em>
//                       </button>
//                       <button className="p-1 hover:bg-gray-200 rounded">
//                         <u>U</u>
//                       </button>
//                       <button className="p-1 hover:bg-gray-200 rounded">
//                         <s>S</s>
//                       </button>
//                       <div className="w-px h-4 bg-gray-300"></div>
//                       <select className="text-sm border-0 bg-transparent">
//                         <option>13</option>
//                       </select>
//                       <button className="p-1 hover:bg-gray-200 rounded text-yellow-500">
//                         A
//                       </button>
//                     </div>
                    
//                     <textarea
//                       value={invoice.notes}
//                       onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
//                       className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       rows={4}
//                       placeholder="Enter notes or terms..."
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Invoice Details */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <label className="text-sm font-medium text-gray-700">Invoice Number</label>
//                   <input
//                     type="text"
//                     value={invoice.invoiceNumber}
//                     onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
//                     className="px-3 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     placeholder="Auto-generated"
//                   />
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <label className="text-sm font-medium text-gray-700">Invoice Date</label>
//                   <input
//                     type="date"
//                     value={invoice.invoiceDate}
//                     onChange={(e) => setInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))}
//                     className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <label className="text-sm font-medium text-gray-700">Due Date</label>
//                   <input
//                     type="date"
//                     value={invoice.dueDate}
//                     onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
//                     className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <label className="text-sm font-medium text-gray-700">
//                     Payment Terms
//                     <QuestionMarkCircleIcon className="h-4 w-4 inline ml-1" />
//                   </label>
//                   <input
//                     type="text"
//                     value={invoice.paymentTerms}
//                     onChange={(e) => setInvoice(prev => ({ ...prev, paymentTerms: e.target.value }))}
//                     className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     placeholder="e.g., Net 30"
//                   />
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <label className="text-sm font-medium text-gray-700">Currency</label>
//                   <select 
//                     value={invoice.currency}
//                     onChange={(e) => setInvoice(prev => ({ ...prev, currency: e.target.value }))}
//                     className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="USD">USD</option>
//                     <option value="EUR">EUR</option>
//                     <option value="PKR">PKR</option>
//                     <option value="INR">INR</option>
//                   </select>
//                 </div>

//                 <div className="pt-4 border-t">
//                   <div className="flex justify-between text-sm">
//                     <span>Total Amount:</span>
//                     <span className="font-medium">Rs. {calculateTotal().toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Help Button */}
//       <button className="fixed bottom-6 right-6 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 flex items-center">
//         <QuestionMarkCircleIcon className="h-6 w-6" />
//         <span className="ml-2 text-sm font-medium hidden md:block">Have a Question</span>
//       </button>

//       {/* Dynamic Modal */}
//       <DynamicModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         entityType={modalEntityType}
//         onSave={handleModalSave}
//         loading={modalLoading}
//       />
//     </div>
//   );
// };

// // Invoice List Component
// const InvoiceList = ({ onCreateNew, onViewInvoice }) => {
//   const { 
//     invoices, 
//     getInvoices, 
//     deleteInvoice,
//     searchTerm,
//     setSearchTerm,
//     status,
//     setStatus,
//     clientId,
//     setClientId,
//     pagination,
//     goToPage,
//     isLoading,
//     error
//   } = useInvoices();

//   const { clients, getClients } = useClients();

//   const [invoiceNumber, setInvoiceNumber] = useState('');
//   const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

//   const filterTabs = [
//     { id: '', label: 'All' },
//     { id: 'Overdue', label: 'Overdue' },
//     { id: 'Due', label: 'Due' },
//     { id: 'Unpaid', label: 'Unpaid' },
//     { id: 'Draft', label: 'Draft' },
//     { id: 'Paid', label: 'Paid' }
//   ];

//   useEffect(() => {
//     getInvoices();
//     getClients();
//   }, []);

//   const handleSearch = () => {
//     getInvoices({
//       search: searchTerm,
//       status: status,
//       clientId: clientId || null,
//       page: 1
//     });
//   };

//   const handleFilterTab = (filterStatus) => {
//     setStatus(filterStatus);
//     getInvoices({ status: filterStatus, page: 1 });
//   };

//   const handleDeleteInvoice = async (invoiceId) => {
//     if (window.confirm('Are you sure you want to delete this invoice?')) {
//       try {
//         await deleteInvoice(invoiceId);
//         getInvoices(); // Refresh list
//       } catch (error) {
//         console.error('Error deleting invoice:', error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between py-4">
//             <div className="flex items-center space-x-4">
//               <button className="p-2 hover:bg-blue-700 rounded-lg">
//                 <ChevronLeftIcon className="h-5 w-5" />
//               </button>
//               <h1 className="text-lg font-semibold">Invoices</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button className="p-2 hover:bg-blue-700 rounded-lg">
//                 <QuestionMarkCircleIcon className="h-5 w-5" />
//                 <span className="ml-1 text-sm">Help</span>
//               </button>
//               <div className="relative">
//                 <BellIcon className="h-5 w-5" />
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-medium">
//                   A
//                 </div>
//                 <div className="text-sm">
//                   <div className="font-medium">Adnan Pro</div>
//                   <div className="text-blue-200 text-xs">19/07/2025 11:28</div>
//                 </div>
//                 <ChevronDownIcon className="h-4 w-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Action Bar */}
//         <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <select className="px-3 py-2 border border-gray-300 rounded-lg">
//                 <option>📄</option>
//               </select>
//               <ChevronDownIcon className="h-4 w-4 text-gray-400" />
//             </div>
//             <div className="flex items-center space-x-3">
//               <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
//                 Non Completed (1)
//               </button>
//               <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
//                 <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
//                 Import
//               </button>
//               <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
//                 <ChartBarIcon className="h-4 w-4 mr-2" />
//               </button>
//               <button 
//                 onClick={onCreateNew}
//                 className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//               >
//                 <PlusIcon className="h-4 w-4 mr-2" />
//                 New Invoice
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Search Section */}
//         <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search invoices..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
//               <select
//                 value={clientId || ''}
//                 onChange={(e) => setClientId(e.target.value || null)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               >
//                 <option value="">Any Client</option>
//                 {clients?.map(client => (
//                   <option key={client.Id} value={client.Id}>
//                     {client.FullName || client.BusinessName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Invoice No.</label>
//               <input
//                 type="text"
//                 value={invoiceNumber}
//                 onChange={(e) => setInvoiceNumber(e.target.value)}
//                 placeholder="Invoice number..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//           </div>
          
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
//               className="flex items-center text-gray-600 hover:text-gray-800"
//             >
//               <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
//               Advanced Search
//             </button>
//             <div className="flex space-x-3">
//               <button 
//                 onClick={() => {
//                   setSearchTerm('');
//                   setClientId(null);
//                   setInvoiceNumber('');
//                   setStatus('');
//                   getInvoices();
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Reset
//               </button>
//               <button 
//                 onClick={handleSearch}
//                 disabled={isLoading}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
//               >
//                 {isLoading ? 'Searching...' : 'Search'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Results Section */}
//         <div className="bg-white rounded-lg shadow-sm border">
//           {/* Filter Tabs */}
//           <div className="border-b px-6 pt-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-medium">Results</h3>
//               <select className="px-3 py-1 border border-gray-300 rounded text-sm">
//                 <option>Sort By</option>
//                 <option>Invoice Date</option>
//                 <option>Due Date</option>
//                 <option>Amount</option>
//                 <option>Client</option>
//               </select>
//             </div>
            
//             <nav className="flex space-x-8">
//               {filterTabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => handleFilterTab(tab.id)}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                     status === tab.id
//                       ? 'border-blue-500 text-blue-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Invoice List */}
//           <div className="p-6">
//             {isLoading ? (
//               <div className="text-center py-8">
//                 <div className="text-gray-500">Loading invoices...</div>
//               </div>
//             ) : error ? (
//               <div className="text-center py-8">
//                 <div className="text-red-600">Error: {error}</div>
//               </div>
//             ) : invoices?.length === 0 ? (
//               <div className="text-center py-8">
//                 <div className="text-gray-500">No invoices found</div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {invoices?.map((invoice) => (
//                   <div key={invoice.Id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-4">
//                           <div>
//                             <div className="font-medium text-blue-600">
//                               #{invoice.InvoiceNumber} - {new Date(invoice.InvoiceDate).toLocaleDateString()}
//                             </div>
//                             <div className="text-sm text-gray-600 mt-1">
//                               <strong>{invoice.ClientName}</strong>
//                             </div>
//                             {invoice.ClientEmail && (
//                               <div className="text-sm text-gray-500">{invoice.ClientEmail}</div>
//                             )}
//                           </div>
//                         </div>
                        
//                         {invoice.ClientAddress && (
//                           <div className="mt-2 text-sm text-gray-600">
//                             {invoice.ClientAddress}
//                           </div>
//                         )}
                        
//                         <div className="mt-2 flex items-center space-x-4 text-sm">
//                           <div className="flex items-center text-gray-500">
//                             <UserIcon className="h-4 w-4 mr-1" />
//                             By: You
//                           </div>
//                           {invoice.Status && (
//                             <span className="px-2 py-1 bg-gray-100 rounded text-xs">
//                               {invoice.Status}
//                             </span>
//                           )}
//                         </div>
//                       </div>
                      
//                       <div className="text-right">
//                         <div className="text-sm text-gray-600 mb-1">
//                           {invoice.UpdatedAt && (
//                             <div>Updated: {new Date(invoice.UpdatedAt).toLocaleString()}</div>
//                           )}
//                         </div>
//                         <div className="text-lg font-semibold">
//                           Rs. {invoice.TotalAmount}
//                         </div>
//                         <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
//                           invoice.Status === 'Paid' ? 'bg-green-100 text-green-800' :
//                           invoice.Status === 'Sent' ? 'bg-blue-100 text-blue-800' :
//                           invoice.Status === 'Draft' ? 'bg-gray-100 text-gray-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {invoice.Status}
//                         </span>
//                       </div>
                      
//                       <div className="ml-4">
//                         <button
//                           onClick={() => onViewInvoice(invoice)}
//                           className="p-2 text-gray-400 hover:text-gray-600"
//                         >
//                           <EllipsisHorizontalIcon className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Pagination */}
//             {pagination && pagination.TotalPages > 1 && (
//               <div className="flex items-center justify-between mt-6">
//                 <div className="text-sm text-gray-700">
//                   Showing {((pagination.CurrentPage - 1) * pagination.PageSize) + 1} to{' '}
//                   {Math.min(pagination.CurrentPage * pagination.PageSize, pagination.TotalItems)} of{' '}
//                   {pagination.TotalItems} results
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => goToPage(pagination.CurrentPage - 1)}
//                     disabled={pagination.CurrentPage === 1 || isLoading}
//                     className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, pagination.TotalPages) }, (_, i) => {
//                     const page = i + 1;
//                     return (
//                       <button
//                         key={page}
//                         onClick={() => goToPage(page)}
//                         className={`px-3 py-1 border rounded ${
//                           pagination.CurrentPage === page
//                             ? 'bg-blue-500 text-white border-blue-500'
//                             : 'border-gray-300 hover:bg-gray-50'
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => goToPage(pagination.CurrentPage + 1)}
//                     disabled={pagination.CurrentPage === pagination.TotalPages || isLoading}
//                     className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Help Button */}
//       <button className="fixed bottom-6 right-6 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 flex items-center">
//         <QuestionMarkCircleIcon className="h-6 w-6" />
//         <span className="ml-2 text-sm font-medium hidden md:block">Have a Question</span>
//       </button>
//     </div>
//   );
// };

// // Invoice View Component
// const InvoiceView = ({ invoice, onBack, onEdit }) => {
//   const { sendInvoice, markInvoiceAsPaid, voidInvoice, duplicateInvoice } = useInvoices();
//   const [showActions, setShowActions] = useState(false);

//   const handleSendInvoice = async () => {
//     try {
//       await sendInvoice(invoice.Id, { method: 'email' });
//       // Refresh or show success message
//     } catch (error) {
//       console.error('Error sending invoice:', error);
//     }
//   };

//   const handleMarkAsPaid = async () => {
//     try {
//       await markInvoiceAsPaid(invoice.Id, {
//         amount: invoice.TotalAmount,
//         paymentDate: new Date().toISOString(),
//         paymentMethod: 'Cash'
//       });
//       // Refresh or show success message
//     } catch (error) {
//       console.error('Error marking invoice as paid:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between py-4">
//             <div className="flex items-center space-x-4">
//               <button onClick={onBack} className="p-2 hover:bg-blue-700 rounded-lg">
//                 <ChevronLeftIcon className="h-5 w-5" />
//               </button>
//               <nav className="flex items-center space-x-2 text-sm">
//                 <span>Invoices</span>
//                 <ChevronDownIcon className="h-4 w-4" />
//                 <span>Invoice #{invoice.InvoiceNumber}</span>
//               </nav>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button className="p-2 hover:bg-blue-700 rounded-lg">
//                 <QuestionMarkCircleIcon className="h-5 w-5" />
//                 <span className="ml-1 text-sm">Help</span>
//               </button>
//               <div className="flex items-center space-x-2">
//                 <BellIcon className="h-5 w-5" />
//                 <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-medium">
//                   A
//                 </div>
//                 <div className="text-sm">
//                   <div className="font-medium">Adnan Pro</div>
//                   <div className="text-blue-200 text-xs">19/07/2025 11:28</div>
//                 </div>
//                 <ChevronDownIcon className="h-4 w-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Invoice Header */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Invoice #{invoice.InvoiceNumber}
//                 <span className={`ml-3 inline-block px-2 py-1 rounded text-sm font-medium ${
//                   invoice.Status === 'Paid' ? 'bg-green-100 text-green-800' :
//                   invoice.Status === 'Sent' ? 'bg-blue-100 text-blue-800' :
//                   invoice.Status === 'Draft' ? 'bg-gray-100 text-gray-800' :
//                   'bg-red-100 text-red-800'
//                 }`}>
//                   {invoice.Status}
//                 </span>
//               </h1>
//               <div className="text-sm text-gray-600 mt-1">
//                 Recipient: {invoice.ClientName} • Added By: Adnan
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <button 
//                 onClick={handleMarkAsPaid}
//                 className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 <CurrencyDollarIcon className="h-4 w-4 mr-2" />
//                 Add Payment
//               </button>
//               <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                 <PrinterIcon className="h-4 w-4 mr-2" />
//                 Print Invoice
//               </button>
//               <button
//                 onClick={() => setShowActions(!showActions)}
//                 className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 <EllipsisHorizontalIcon className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={onEdit}
//               className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded"
//             >
//               <PencilIcon className="h-4 w-4 mr-2" />
//               Edit
//             </button>
//             <button className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded">
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print
//             </button>
//             <button className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded">
//               <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
//               PDF
//             </button>
//             <button 
//               onClick={handleSendInvoice}
//               className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded"
//             >
//               <PaperAirplaneIcon className="h-4 w-4 mr-2" />
//               Send Via
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Invoice Content */}
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-lg">
//           {/* Invoice Preview */}
//           <div className="p-8">
//             <div className="border-4 border-gray-300 p-8">
//               {/* Header */}
//               <div className="flex justify-between items-start mb-8">
//                 <div>
//                   <h2 className="text-2xl font-bold">AdnanPro</h2>
//                   <div className="text-sm text-gray-600">
//                     Hazaifa town<br />
//                     Rahim yar khan, punjab 6420
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <h1 className="text-3xl font-bold">Invoice</h1>
//                 </div>
//               </div>

//               {/* Invoice Details */}
//               <div className="flex justify-between mb-8">
//                 <div>
//                   <h3 className="font-semibold mb-2">Bill to:</h3>
//                   <div className="text-sm">
//                     <div className="font-medium">{invoice.ClientName}</div>
//                     {invoice.ClientEmail && <div>{invoice.ClientEmail}</div>}
//                     {invoice.ClientAddress && (
//                       <div className="mt-1 whitespace-pre-line">{invoice.ClientAddress}</div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="text-right text-sm">
//                   <div><strong>Invoice #:</strong> {invoice.InvoiceNumber}</div>
//                   <div><strong>Invoice Date:</strong> {new Date(invoice.InvoiceDate).toLocaleDateString()}</div>
//                   {invoice.DueDate && (
//                     <div><strong>Due Date:</strong> {new Date(invoice.DueDate).toLocaleDateString()}</div>
//                   )}
//                 </div>
//               </div>

//               {/* Items Table */}
//               <table className="w-full border-collapse border border-gray-300 mb-6">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
//                     <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
//                     <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
//                     <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
//                     <th className="border border-gray-300 px-4 py-2 text-center">Discount</th>
//                     <th className="border border-gray-300 px-4 py-2 text-right">Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {invoice.Items?.map((item, index) => (
//                     <tr key={index}>
//                       <td className="border border-gray-300 px-4 py-2">{item.ItemName}</td>
//                       <td className="border border-gray-300 px-4 py-2">{item.Description}</td>
//                       <td className="border border-gray-300 px-4 py-2 text-right">Rs. {item.UnitPrice}</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">{item.Quantity}</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">{item.Discount}%</td>
//                       <td className="border border-gray-300 px-4 py-2 text-right">Rs. {item.TotalAmount}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Totals */}
//               <div className="flex justify-end">
//                 <div className="w-64">
//                   <div className="flex justify-between py-1">
//                     <span>Subtotal:</span>
//                     <span>Rs. {invoice.SubTotal}</span>
//                   </div>
//                   {invoice.DiscountAmount > 0 && (
//                     <div className="flex justify-between py-1">
//                       <span>Discount:</span>
//                       <span>-Rs. {invoice.DiscountAmount}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between py-1">
//                     <span>Tax ({invoice.TaxAmount > 0 ? '10%' : '0%'}):</span>
//                     <span>Rs. {invoice.TaxAmount}</span>
//                   </div>
//                   <div className="flex justify-between py-1 font-bold border-t">
//                     <span>Total:</span>
//                     <span>Rs. {invoice.TotalAmount}</span>
//                   </div>
//                   {invoice.PaidAmount > 0 && (
//                     <div className="flex justify-between py-1">
//                       <span>Paid:</span>
//                       <span>Rs. {invoice.PaidAmount}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between py-1 font-bold">
//                     <span>Balance Due:</span>
//                     <span>Rs. {invoice.BalanceAmount}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Help Button */}
//       <button className="fixed bottom-6 right-6 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 flex items-center">
//         <QuestionMarkCircleIcon className="h-6 w-6" />
//         <span className="ml-2 text-sm font-medium hidden md:block">Have a Question</span>
//       </button>
//     </div>
//   );
// };

// // Main App Component
// const InvoiceApp = () => {
//   const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'view', 'edit'
//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   const navigateToCreate = () => {
//     setSelectedInvoice(null);
//     setCurrentView('create');
//   };
  
//   const navigateToList = () => {
//     setSelectedInvoice(null);
//     setCurrentView('list');
//   };
  
//   const navigateToView = (invoice) => {
//     setSelectedInvoice(invoice);
//     setCurrentView('view');
//   };

//   const navigateToEdit = (invoice = null) => {
//     setSelectedInvoice(invoice || selectedInvoice);
//     setCurrentView('edit');
//   };

//   if (currentView === 'create') {
//     return <InvoiceCreation onBack={navigateToList} />;
//   }
  
//   if (currentView === 'edit' && selectedInvoice) {
//     return <InvoiceCreation onBack={navigateToList} editingInvoice={selectedInvoice} />;
//   }
  
//   if (currentView === 'view' && selectedInvoice) {
//     return <InvoiceView invoice={selectedInvoice} onBack={navigateToList} onEdit={() => navigateToEdit()} />;
//   }

//   return <InvoiceList onCreateNew={navigateToCreate} onViewInvoice={navigateToView} />;
// };

// export default InvoiceApp;