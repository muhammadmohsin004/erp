import React, { forwardRef, useRef } from "react";

// Using forwardRef to forward ref properly and use fallback ref if none passed
const TD = forwardRef(
  (
    {
      onClick = undefined,
      style = {},
      className = "",
      children = null,
      colspan = "0",
    },
    ref
  ) => {
    // Create a fallback ref if none is passed
    const internalRef = useRef(null);
    const finalRef = ref || internalRef; // Use the passed `ref`, or fallback to `internalRef`

    return (
      <td
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={className}
        colspan={colspan}
      >
        {children}
      </td>
    );
  }
);

TD.displayName = 'TD';

export default TD;
