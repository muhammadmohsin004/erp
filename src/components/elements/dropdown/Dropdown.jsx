// components/dropdown/Dropdown.jsx
import { useState, useRef, useEffect } from "react";

const Dropdown = ({
  buttonText,
  icon: Icon,
  items = [],
  onSelect,
  className = "",
  buttonClassName = "",
  menuClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none ${buttonClassName}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {buttonText}
      </button>

      {isOpen && (
        <div
          className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${menuClassName}`}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
