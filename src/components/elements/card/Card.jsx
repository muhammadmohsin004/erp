const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white shadow overflow-hidden sm:rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
