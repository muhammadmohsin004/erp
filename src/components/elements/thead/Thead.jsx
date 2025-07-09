import  { forwardRef, useRef } from "react";

// Using forwardRef to forward ref properly and use fallback ref if none passed
const Thead = forwardRef(
  (
    { onClick = undefined, style = {}, className = "", children = null },
    ref
  ) => {
    // Create a fallback ref if none is passed
    const internalRef = useRef(null);
    const finalRef = ref || internalRef; // Use the passed `ref`, or fallback to `internalRef`

    return (
      <thead
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={className}
      >
        {children}
      </thead>
    );
  }
);

// Add a displayName for debugging purposes
Thead.displayName = "Thead";

export default Thead;
