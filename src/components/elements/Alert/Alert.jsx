// components/alert/Alert.jsx
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

const Alert = ({
  variant = "success",
  message,
  onClose,
  dismissible = true,
  className = "",
}) => {
  const [show, setShow] = useState(true);

  const variantClasses = {
    success: "bg-green-50 border-green-400 text-green-700",
    danger: "bg-red-50 border-red-400 text-red-700",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-700",
    info: "bg-blue-50 border-blue-400 text-blue-700",
  };

  useEffect(() => {
    if (!show && onClose) {
      onClose();
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`border-l-4 p-4 mb-4 ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm">{message}</p>
        </div>
        {dismissible && (
          <button
            type="button"
            className="ml-2 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => setShow(false)}
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
