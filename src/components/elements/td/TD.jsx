// components/table/TD.jsx
import { forwardRef, useRef } from "react";

const TD = forwardRef(
  (
    {
      onClick = undefined,
      style = {},
      className = "",
      children = null,
      colSpan = 1,
    },
    ref
  ) => {
    const internalRef = useRef(null);
    const finalRef = ref || internalRef;

    return (
      <td
        onClick={onClick}
        ref={finalRef}
        style={style}
        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`}
        colSpan={colSpan}
      >
        {children}
      </td>
    );
  }
);

TD.displayName = "TD";
export default TD;
