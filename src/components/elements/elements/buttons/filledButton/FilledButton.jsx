// components/buttons/FilledButton.jsx
import Span from "../../../span/Span";

const FilledButton = ({
  isIcon,
  icon: Icon,
  isIconLeft,
  isIconRight,
  iconSize = "w-4 h-4",
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
      className={`bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 ${textColor} ${height} ${width} ${fontWeight} ${fontSize} text-center ${rounded} ${px} ${
        disabled
          ? "opacity-60 cursor-not-allowed hover:from-purple-500 hover:to-purple-700"
          : "cursor-pointer"
      } flex justify-center items-center transition-all duration-200 transform hover:scale-105 active:scale-95`}
      type={type}
      onClick={onClick}
    >
      {isIconLeft && isIcon && (
        <Span className={`${buttonText ? "mr-2" : "mr-0"}`}>
          <Icon className={`${iconSize}`} />
        </Span>
      )}
      {buttonText && <Span>{buttonText}</Span>}
      {isIconRight && isIcon && (
        <Span className={`${buttonText ? "ml-2" : "ml-0"}`}>
          <Icon className={`${iconSize}`} />
        </Span>
      )}
    </button>
  );
};

export default FilledButton;
