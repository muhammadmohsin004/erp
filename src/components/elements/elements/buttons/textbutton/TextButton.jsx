import React from "react";

const TextButton = ({
  buttonText,
  onClick,
  color,
  fontWeight,
  fontSize,
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`bg-transparent p-0 m-0 flex justify-start ${color} ${fontWeight} ${fontSize}`}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};

export default TextButton;
