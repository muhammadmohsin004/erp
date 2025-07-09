// components/buttons/FilledButton.jsx
import Span from "../span/Span";

const FilledButton = ({
  isIcon,
  icon: Icon,
  isIconLeft,
  isIconRight,
  iconSize = "w-4 h-4",
  bgColor = "bg-primary",
  textColor = "text-white",
  rounded = "rounded-md",
  buttonText,
  height = "h-10",
  width = "w-auto",
  fontWeight = "font-medium",
  fontSize = "text-sm",
  type = "button",
  onClick,
  px = "px-4",
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`${bgColor} ${textColor} ${height} ${width} ${fontWeight} ${fontSize} text-center ${rounded} cursor-pointer ${
        px !== undefined && px
      } ${
        disabled ? "opacity-60" : "hover:opacity-90"
      } flex justify-center items-center transition-opacity duration-200`}
      type={type}
      onClick={onClick}
    >
      {isIconLeft && isIcon && (
        <Span className={`${buttonText !== "" ? "mr-2" : "mr-0"}`}>
          <Icon className={`${iconSize}`} />
        </Span>
      )}
      {buttonText !== "" && <Span>{buttonText}</Span>}
      {isIconRight && isIcon && (
        <Span className={`${buttonText !== "" ? "ml-2" : "ml-0"}`}>
          <Icon className={`${iconSize}`} />
        </Span>
      )}
    </button>
  );
};

export default FilledButton;
