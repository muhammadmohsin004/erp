import { Input } from "antd";
import Container from "../container/Container";
import Span from "../span/Span";

const { TextArea: AntdTextArea } = Input;

const TextArea = ({
  name,
  placeholder,
  errors = {},
  width = "w-full",
  marginBottom = "mb-4",
  onChange = () => {},
  value = "",
  disabled = false,
  label,
  rows = 4,
  showCount = false,
  maxLength,
  required = false,
}) => {
  return (
    <Container className={marginBottom}>
      {label && (
        <p className="py-1 text-md font-semibold px-0.5">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </p>
      )}
      <AntdTextArea
        name={name}
        className={`border-[1px] border-secondary rounded-md ${width}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        showCount={showCount}
        maxLength={maxLength}
      />
      {errors[name] && (
        <Span className="text-red-500 text-sm">{errors[name].message}</Span>
      )}
    </Container>
  );
};

export default TextArea;