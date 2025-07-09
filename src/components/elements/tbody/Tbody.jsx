// components/table/Tbody.jsx
import { forwardRef, useRef } from "react";

const Tbody = forwardRef(
  (
    { onClick = undefined, style = {}, className = "", children = null },
    ref
  ) => {
    const internalRef = useRef(null);
    const finalRef = ref || internalRef;

    return (
      <tbody
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={`bg-white divide-y divide-gray-200 ${className}`}
      >
        {children}
      </tbody>
    );
  }
);

Tbody.displayName = "Tbody";
export default Tbody;
