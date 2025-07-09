import { forwardRef, useRef } from "react";

// Using forwardRef to forward ref properly and use fallback ref if none passed
const Container = forwardRef(
  (
    // eslint-disable-next-line react/prop-types
    { onClick = undefined, style = {}, className = "", children = null },
    ref
  ) => {
    // Create a fallback ref if none is passed
    const internalRef = useRef(null);
    const finalRef = ref || internalRef; // Use the passed `ref`, or fallback to `internalRef`

    return (
      <div onClick={onClick} ref={finalRef} style={style} className={className}>
        {children}
      </div>
    );
  }
);

// Set the display name for easier debugging
Container.displayName = "Container";

export default Container;
