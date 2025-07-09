import React, { forwardRef, useRef } from "react";

// Using forwardRef to forward ref properly and use fallback ref if none passed
const Span = forwardRef(
  (
    { onClick = undefined, style = {}, className = "", children = null },
    ref
  ) => {
    // Create a fallback ref if none is passed
    const internalRef = useRef(null);
    const finalRef = ref || internalRef; // Use the passed `ref`, or fallback to `internalRef`

    return (
      <span
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={className}
      >
        {children}
      </span>
    );
  }
);

export default Span;
