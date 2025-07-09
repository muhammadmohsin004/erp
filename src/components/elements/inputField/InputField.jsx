import Container from "../container/Container";
import Span from "../span/Span";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  register = null, // Make it nullable to detect if RHF is being used
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

  // Determine if we're using React Hook Form or regular state
  const isUsingRHF = register !== null && typeof register === "function";

  // Get input props based on the mode
  const getInputProps = () => {
    if (isUsingRHF) {
      return register(name, validationRules);
    } else {
      return {
        value: value || "",
        onChange: onChange,
        name: name,
      };
    }
  };

  const inputProps = getInputProps();

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
        {/* Icon on the left */}
        {Icon && type !== "password" && (
          <Icon className="text-xl text-primary mr-2" />
        )}

        <input
          disabled={disabled}
          className="outline-none border-none w-full bg-transparent"
          type={isVisible ? "text" : type}
          placeholder={placeholder}
          {...inputProps}
        />

        {/* Password visibility toggle */}
        {type === "password" && (
          <Span onClick={toggleVisibility} className="cursor-pointer">
            {isVisible ? (
              <EyeOff className="text-xl text-primary" />
            ) : (
              <Eye className="text-xl text-primary" />
            )}
          </Span>
        )}
      </Container>

      {/* Error message */}
      {errors[name] && (
        <Span className="text-red-500 text-sm">{errors[name].message}</Span>
      )}
    </Container>
  );
};

export default InputField;
