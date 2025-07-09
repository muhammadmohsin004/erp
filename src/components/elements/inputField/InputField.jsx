/* eslint-disable react/prop-types */
import Container from "../container/Container";
import Span from "../span/Span";

const InputField = ({
  register = () => ({}), // Default function to prevent errors
  name = "",
  placeholder,
  type,
  errors = {},
  validationRules = {},
  width,
  marginBottom,
  icon: Icon,
  isVisible,
  setIsVisible,
  disabled = false,
  onChange = () => {},
  value = null,
  label,
}) => {
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Container className={marginBottom}>
      {label !== undefined && (
        <p className="py-1 text-md font-semibold px-0.5">{label}</p>
      )}
      <Container
        className={`h-[38px] border-[1px] border-secondary rounded-md ${width} px-2 flex items-center ${
          disabled ? "bg-[#f2f2f2]" : "bg-transparent"
        }`}
      >
        <input
          disabled={disabled}
          className="outline-none border-none w-full bg-transparent"
          type={isVisible ? "text" : type} // Toggle input type based on visibility
          placeholder={placeholder}
          {...(register ? register(name, validationRules) : {})} // Ensure register is not called if not provided
          onChange={onChange}
          value={value}
        />
        {type === "password" && (
          <Span onClick={toggleVisibility} className="cursor-pointer">
            {isVisible ? (
              <Icon className="text-xl text-primary" />
            ) : (
              <Icon className="text-xl text-primary" />
            )}
          </Span>
        )}
      </Container>

      {/* Only render error message if errors exist for the given field */}
      {errors[name] && (
        <Span className="text-red-500 text-sm">{errors[name].message}</Span>
      )}
    </Container>
  );
};

export default InputField;
