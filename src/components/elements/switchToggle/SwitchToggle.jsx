/* eslint-disable react/prop-types */
const SwitchToggle = ({ value, onChange }) => {
  return (
    <div
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        value ? "bg-primary" : "bg-gray-300"
      }`}
      onClick={() => onChange(!value)}
    >
      <div
        className={`items-center bg-white w-4 h-4 rounded-full shadow-md transform ${
          value ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </div>
  );
};

export default SwitchToggle;
