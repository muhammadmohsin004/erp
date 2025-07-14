import Span from "../../../span/Span";

const OutlineButton = ({
  isIcon,
  icon: Icon,
  isIconLeft,
  isIconRight,
  borderColor,
  borderWidth,
  rounded,
  bgColor,
  textColor,
  buttonText,
  height,
  width,
  fontWeight,
  fontSize,
  type,
  onClick,
  px,
  hover,
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`${bgColor} ${textColor} ${height} ${width} ${fontWeight} ${fontSize} ${borderColor} ${borderWidth}  ${rounded} ${
        px !== undefined && px
      } ${
        hover !== undefined && hover
      } text-center flex justify-center items-center pointer`}
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
      {/* Handle case when only isIcon is true (no left/right specified) */}
      {isIcon && !isIconLeft && !isIconRight && (
        <Span>
          <Icon className={`${fontSize} ${textColor}`} />
        </Span>
      )}
    </button>
  );
};

export default OutlineButton;
