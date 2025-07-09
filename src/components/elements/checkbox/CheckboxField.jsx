import React from "react";
import { AlertCircle } from "lucide-react";

const CheckboxField = ({ name, label, checked, onChange, errors }) => {
  return (
    <div className="flex items-center">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>
      {errors[name] && (
        <div className="ml-2 flex items-center text-red-600 text-sm">
          <AlertCircle size={16} className="mr-1" />
          {errors[name].message}
        </div>
      )}
    </div>
  );
};

export default CheckboxField;
