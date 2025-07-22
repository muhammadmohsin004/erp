import Span from "../../../span/Span";

const OutlineButton = ({
  isIcon,
  icon: Icon,
  isIconLeft,
  isIconRight,
  borderColor = "border-primary-border",
  borderWidth = "border",
  rounded = "rounded-md",
  bgColor = "bg-transparent",
  textColor = "text-primary-text",
  buttonText = "",
  height = "h-10",
  width = "w-auto",
  fontWeight = "font-medium",
  fontSize = "text-sm",
  type = "button",
  onClick,
  px = "px-4",
  hover = "hover:bg-primary-hover",
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`${bgColor} ${textColor} ${height} ${width} ${fontWeight} ${fontSize} ${borderColor} ${borderWidth} ${rounded} ${px} ${hover} text-center flex justify-center items-center pointer`}
      type={type}
      onClick={onClick}
    >
      {isIconLeft && isIcon && (
        <Span className={`${buttonText !== "" ? "mr-3" : "mr-0"}`}>
          <Icon className={`${fontSize} ${textColor}`} />
        </Span>
      )}
      {buttonText !== "" && <Span>{buttonText}</Span>}
      {isIconRight && isIcon && (
        <Span className={`${buttonText !== "" ? "ml-3" : "ml-0"}`}>
          <Icon className={`${fontSize} ${textColor}`} />
        </Span>
      )}
      {isIcon && !isIconLeft && !isIconRight && (
        <Span>
          <Icon className={`${fontSize} ${textColor}`} />
        </Span>
      )}
    </button>
  );
};

export default OutlineButton;
