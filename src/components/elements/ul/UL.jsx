import React from "react";

const UL = ({
  onClick = undefined,
  style = {},
  className = "",
  children = null,
}) => {
  return (
    <div onClick={onClick} style={style} className={className}>
      {children}
    </div>
  );
};

export default UL;
