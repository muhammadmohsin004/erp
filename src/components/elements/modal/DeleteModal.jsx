import { Loader, Trash2, X } from "lucide-react";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  isDeleting = false,
  variant = "danger", // danger, warning
}) => {
  if (!isOpen) return null;

  const variants = {
    danger: {
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      icon: "text-red-600",
      accent: "text-red-600",
    },
    warning: {
      button: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
      icon: "text-orange-600",
      accent: "text-orange-600",
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-transparent bg-opacity-90 transition-opacity "
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-red-100 mr-3`}
              >
                <Trash2 className={`h-5 w-5 ${currentVariant.icon}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p className="text-sm text-gray-500 mb-4">{message}</p>

            {itemName && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Item:</span>{" "}
                  <span className={`font-semibold ${currentVariant.accent}`}>
                    {itemName}
                  </span>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 ${currentVariant.button}`}
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;
