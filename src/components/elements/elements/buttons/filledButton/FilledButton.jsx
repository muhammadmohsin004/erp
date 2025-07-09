import Span from "../../span/Span";

const FilledButton = ({
  isIcon,
  icon: Icon,
  isIconLeft,
  isIconRight,
  iconSize,
  bgColor,
  textColor,
  rounded,
  buttonText,
  height,
  width,
  fontWeight,
  fontSize,
  type,
  onClick,
  px,
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`${bgColor} ${textColor} ${height} ${width} ${fontWeight} ${fontSize} text-center ${rounded} cursor-pointer ${
        px !== undefined && px
      } ${disabled ? "opacity-60" : ""} flex justify-center items-center`}
      type={type}
      onClick={onClick}
    >
      {isIconLeft && isIcon && (
        <Span className={`${buttonText !== "" ? "mr-3" : "mr-0"}`}>
          <Icon className={`${iconSize}`} />
        </Span>
      )}
      {buttonText !== "" && <Span>{buttonText}</Span>}
      {isIconRight && isIcon && (
        <Span className={`${buttonText !== "" ? "mr-3" : "mr-0"}`}>
          <Icon className={`${iconSize}`} />
        </Span>
      )}
    </button>
  );
};

export default FilledButton;
