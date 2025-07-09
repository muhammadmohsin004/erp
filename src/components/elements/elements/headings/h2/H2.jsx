import React from "react";

const H2 = ({ children, className }) => {
  return <h2 className={`${className} text-2xl`}>{children}</h2>;
};

export default H2;
