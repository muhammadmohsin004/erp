import "./Skeleton.css";

const Skeleton = ({
  height,
  width,
  marginBottom,
  marginRight,
  marginTop,
  marginLeft,
  borderRadius,
}) => {
  return (
    <div
      style={{
        height: height,
        width: width,
        marginBottom: marginBottom,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginTop: marginTop,
        borderRadius,
      }}
      className="skeleton-component"
    ></div>
  );
};

export default Skeleton;
