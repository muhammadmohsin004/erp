// components/table/TH.jsx
import { forwardRef, useRef } from "react";

const TH = forwardRef(
  (
    { onClick = undefined, style = {}, className = "", children = null },
    ref
  ) => {
    const internalRef = useRef(null);
    const finalRef = ref || internalRef;

    return (
      <th
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      >
        {children}
      </th>
    );
  }
);

TH.displayName = "TH";
export default TH;
