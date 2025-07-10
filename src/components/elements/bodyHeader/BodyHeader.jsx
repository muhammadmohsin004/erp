import Container from "../container/Container";

const BodyHeader = ({ heading, subHeading }) => {
  return (
    <Container className="flex flex-col">
      <h2 className="font-bold">{heading}</h2>
      <h5 className="text-primary">{subHeading}</h5>
    </Container>
  );
};

export default BodyHeader;
