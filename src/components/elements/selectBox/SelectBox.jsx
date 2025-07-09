import { Select } from "antd";
import Container from "../container/Container";
import Span from "../span/Span";

const SelectBox = ({
  register,
  name,
  placeholder,
  errors = {}, // Default empty object if errors are not passed
  validationRules = {}, // Default empty object if validationRules are not passed
  width,
  marginBottom,
  handleChange = () => {},
  optionList = [], // Default empty array
  value,
  mode = "single",
  disabled = false,
  label,
  onSearch = () => {},
}) => {
  // Handle change with proper value passing
  const handleSelectChange = (selectedValue, option) => {
    console.log("SelectBox onChange:", selectedValue, option);

    // For single mode, pass the value directly
    if (mode === "single") {
      handleChange(selectedValue);
    } else {
      // For multiple mode, pass the array of values
      handleChange(selectedValue, option);
    }
  };

  return (
    <Container className={marginBottom}>
      {label !== undefined && (
        <p className="py-1 text-md font-semibold px-0.5">{label}</p>
      )}
      <Select
        onSearch={onSearch}
        disabled={disabled}
        mode={mode}
        {...(register ? register(name, validationRules) : {})} // Only use register if provided
        className={`min-h-[38px] border-[1px] border-secondary rounded-md ${width}`}
        showSearch
        placeholder={placeholder}
        value={value || undefined} // Handle empty string as undefined
        optionFilterProp="children"
        filterOption={(input, option) => {
          return (option?.label ?? "")
            .toLowerCase()
            .includes(input.toLowerCase());
        }}
        onChange={handleSelectChange}
        options={optionList}
        allowClear // Allow clearing selection
        notFoundContent={
          optionList.length === 0 ? "No options available" : "No match found"
        }
      />
      {errors[name] && (
        <Span className="text-red-500 text-sm">{errors[name].message}</Span>
      )}
    </Container>
  );
};

export default SelectBox;
