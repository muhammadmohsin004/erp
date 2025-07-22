import React, { useState, useEffect } from "react";
import { X, Trash2, CheckCircle, AlertCircle, Loader } from "lucide-react";

// Alert Component for API responses
const CustomAlert = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose]);

  if (!isVisible) return null;

  const alertStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const iconStyles = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
  };

  const IconComponent = icons[type];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div
        className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm ${alertStyles[type]} animate-in slide-in-from-top-2 duration-300`}
      >
        <div className="flex items-start">
          <IconComponent
            className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${iconStyles[type]}`}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium">{title}</h4>
            {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
          </div>
          <button
            onClick={onClose}
            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;

// Delete Confirmation Modal

// Demo Component
// const Demo = () => {
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [alert, setAlert] = useState({ isVisible: false, type: 'success', title: '', message: '' });

//   const showAlert = (type, title, message) => {
//     setAlert({ isVisible: true, type, title, message });
//   };

//   const handleDelete = async () => {
//     setIsDeleting(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsDeleting(false);
//       setShowDeleteModal(false);

//       // Simulate success or failure
//       const isSuccess = Math.random() > 0.3;

//       if (isSuccess) {
//         showAlert('success', 'Successfully deleted!', 'The item has been removed from your account.');
//       } else {
//         showAlert('error', 'Delete failed', 'Something went wrong. Please try again.');
//       }
//     }, 2000);
//   };

//   const simulateApiCall = (type) => {
//     const messages = {
//       success: { title: 'Success!', message: 'Your changes have been saved successfully.' },
//       error: { title: 'Error occurred', message: 'Failed to save changes. Please check your connection.' },
//       warning: { title: 'Warning', message: 'Some fields were not updated due to validation errors.' }
//     };

//     showAlert(type, messages[type].title, messages[type].message);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-2xl mx-auto space-y-8">
//         <div className="bg-white rounded-xl shadow-sm p-8">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             Modal & Alert Components
//           </h1>
//           <p className="text-gray-600 mb-8">
//             Clean, modern UI components for delete confirmations and API alerts.
//           </p>

//           <div className="space-y-6">
//             {/* Delete Modal Demo */}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Delete Modal</h2>
//               <button
//                 onClick={() => setShowDeleteModal(true)}
//                 className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Delete Item
//               </button>
//             </div>

//             {/* Alert Demos */}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">API Alerts</h2>
//               <div className="flex flex-wrap gap-3">
//                 <button
//                   onClick={() => simulateApiCall('success')}
//                   className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
//                 >
//                   Show Success Alert
//                 </button>
//                 <button
//                   onClick={() => simulateApiCall('error')}
//                   className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
//                 >
//                   Show Error Alert
//                 </button>
//                 <button
//                   onClick={() => simulateApiCall('warning')}
//                   className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
//                 >
//                   Show Warning Alert
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Usage Examples */}
//         <div className="bg-white rounded-xl shadow-sm p-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Examples</h2>

//           <div className="space-y-4 text-sm">
//             <div>
//               <h3 className="font-medium text-gray-900 mb-2">Delete Modal:</h3>
//               <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
//                 <div className="text-gray-700">
//                   {`<DeleteModal
//   isOpen={showModal}
//   onClose={() => setShowModal(false)}
//   onConfirm={handleDelete}
//   title="Delete User"
//   message="Are you sure you want to delete this user?"
//   itemName="john@example.com"
//   isDeleting={isDeleting}
// />`}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="font-medium text-gray-900 mb-2">Alert:</h3>
//               <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
//                 <div className="text-gray-700">
//                   {`<Alert
//   type="success"
//   title="Success!"
//   message="Data saved successfully"
//   isVisible={alert.isVisible}
//   onClose={() => setAlert({...alert, isVisible: false})}
// />`}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Components */}
//       <DeleteModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onConfirm={handleDelete}
//         title="Delete Item"
//         message="Are you sure you want to delete this item? This action cannot be undone."
//         itemName="example-file.pdf"
//         isDeleting={isDeleting}
//       />

//       <Alert
//         type={alert.type}
//         title={alert.title}
//         message={alert.message}
//         isVisible={alert.isVisible}
//         onClose={() => setAlert({ ...alert, isVisible: false })}
//       />
//     </div>
//   );
// };

// export default Demo;
