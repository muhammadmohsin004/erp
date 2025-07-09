import Container from "../container/Container";
import H2 from "../headings/h2/H2";
import H5 from "../headings/h5/H5";


const BodyHeader = ({ heading, subHeading }) => {
  return (
    <Container className="flex flex-col">
      <H2 className="font-bold">{heading}</H2>
      <H5 className="text-primary">{subHeading}</H5>
    </Container>
  );
};

export default BodyHeader;
