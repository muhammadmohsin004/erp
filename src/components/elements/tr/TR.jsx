// components/table/TR.jsx
import { forwardRef, useRef } from "react";

const TR = forwardRef(
  (
    { onClick = undefined, style = {}, className = "", children = null },
    ref
  ) => {
    const internalRef = useRef(null);
    const finalRef = ref || internalRef;

    return (
      <tr
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={`hover:bg-gray-50 ${className}`}
      >
        {children}
      </tr>
    );
  }
);

TR.displayName = "TR";
export default TR;
