import { forwardRef, useRef } from "react";

const Table = forwardRef(
  (
    
    { onClick = undefined, style = {}, className = "", children = null },
    ref
  ) => {
    // Create a fallback ref if none is passed
    const internalRef = useRef(null);
    const finalRef = ref || internalRef; // Use the passed `ref`, or fallback to `internalReff`

    return (
      <table
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={className}
      >
        {children}
      </table>
    );
  }
);

// Add a displayName for debugging purposes
Table.displayName = "Table";

export default Table;
