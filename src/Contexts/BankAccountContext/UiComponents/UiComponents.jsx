import React, { useState } from "react";
import { X } from "lucide-react";

// Card Component
export const Card = ({ children, className = "", ...props }) => (
  <div 
    className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Button Component
export const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  loading = false,
  disabled = false,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg focus:ring-blue-500 transform hover:scale-105",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500 hover:border-gray-400 hover:shadow-md",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg focus:ring-red-500 transform hover:scale-105",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500 hover:shadow-md",
    success: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg focus:ring-green-500 transform hover:scale-105",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </button>
  );
};

// Badge Component
export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800 ring-1 ring-green-200",
    danger: "bg-red-100 text-red-800 ring-1 ring-red-200",
    warning: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
    info: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
    purple: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, footer, size = "default" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm" 
          onClick={onClose} 
        />
        <div className={`relative bg-white rounded-xl shadow-2xl ${sizeClasses[size]} w-full max-h-screen overflow-y-auto transform transition-all`}>
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
          {footer && (
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Input Component
export const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = "", 
  required = false,
  ...props 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 inline mr-1" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      className={`w-full px-3 py-2 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 ${
        error ? "border-red-500" : "border-gray-300"
      } ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

// TextArea Component
export const TextArea = ({ 
  label, 
  error, 
  className = "", 
  required = false,
  rows = 3,
  ...props 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      rows={rows}
      className={`w-full px-3 py-2 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 resize-none ${
        error ? "border-red-500" : "border-gray-300"
      } ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

// Select Component
export const Select = ({ 
  label, 
  error, 
  children, 
  className = "", 
  required = false,
  ...props 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      className={`w-full px-3 py-2 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 ${
        error ? "border-red-500" : "border-gray-300"
      } ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

// Checkbox Component
export const Checkbox = ({ 
  label, 
  error, 
  className = "", 
  ...props 
}) => (
  <div className="space-y-1">
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
        {...props}
      />
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

// Dropdown Component
export const Dropdown = ({ trigger, children, align = "right" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className={`absolute z-20 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 transform transition-all ${
            align === "right" ? "right-0" : "left-0"
          }`}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

// DropdownItem Component
export const DropdownItem = ({ children, onClick, className = "", ...props }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Alert Component
export const Alert = ({ 
  type = "info", 
  title, 
  message, 
  onClose, 
  className = "" 
}) => {
  const variants = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  return (
    <div className={`p-4 border rounded-lg ${variants[type]} ${className}`}>
      <div className="flex">
        <div className="flex-1">
          {title && <h4 className="text-sm font-medium mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 ${iconColors[type]} hover:opacity-75`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`border-4 border-blue-600 border-t-transparent rounded-full animate-spin ${sizes[size]} ${className}`} />
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = "" 
}) => (
  <div className={`text-center py-12 ${className}`}>
    {Icon && <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
    <h3 className="text-lg font-medium text-gray-500 mb-2">{title}</h3>
    {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}
    {action}
  </div>
);

// Pagination Component
export const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) => {
  const pageSizeOptions = [10, 25, 50, 100];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center text-sm text-gray-700">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="mx-2 border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span>
          of {totalItems} results
        </span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

// Table Components
export const Table = ({ children, className = "", ...props }) => (
  <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props}>
    {children}
  </table>
);

export const TableHead = ({ children, className = "", ...props }) => (
  <thead className={`bg-gray-50 ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = "", ...props }) => (
  <tbody className={`bg-white divide-y divide-gray-200 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = "", hover = true, ...props }) => (
  <tr className={`${hover ? 'hover:bg-gray-50' : ''} ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHeader = ({ children, className = "", sortable = false, onClick, ...props }) => (
  <th 
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:bg-gray-100' : ''} ${className}`}
    onClick={sortable ? onClick : undefined}
    {...props}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = "", ...props }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`} {...props}>
    {children}
  </td>
);

// Skeleton Loading Component
export const Skeleton = ({ className = "", width, height }) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    style={{ width, height }}
  />
);

// Utility function for currency formatting
export const formatCurrency = (amount, currency = "USD") => {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};