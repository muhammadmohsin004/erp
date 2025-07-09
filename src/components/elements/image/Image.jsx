import React, { forwardRef, useRef } from "react";

// Using forwardRef to forward ref properly and use fallback ref if none passed
const Image = forwardRef(
  ({ alt, src, onClick = undefined, style = {}, className = "" }, ref) => {
    // Create a fallback ref if none is passed
    const internalRef = useRef(null);
    const finalRef = ref || internalRef; // Use the passed `ref`, or fallback to `internalRef`

    return (
      <img
        alt={alt}
        src={src}
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={className}
      />
    );
  }
);

export default Image;
