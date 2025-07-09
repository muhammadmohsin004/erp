// components/card/Card.jsx
const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow overflow-hidden sm:rounded-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
