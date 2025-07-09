import React from "react";

const LI = ({
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

export default LI;
