// components/table/Table.jsx
import { forwardRef, useRef } from "react";

const Table = forwardRef(
  (
    { onClick = undefined, style = {}, className = "", children = null },
    ref
  ) => {
    const internalRef = useRef(null);
    const finalRef = ref || internalRef;

    return (
      <table
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={`min-w-full divide-y divide-gray-200 ${className}`}
      >
        {children}
      </table>
    );
  }
);

Table.displayName = "Table";
export default Table;
