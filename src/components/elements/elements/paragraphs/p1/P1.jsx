import React from "react";

const P1 = ({ children ,className}) => {
  return <p className={`${className} text-normal`}>{children}</p>;
};

export default P1;
