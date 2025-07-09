import mcLogo from "../../assets/logo/Adobe Express - file.png";
import Image from "../image/Image";
import Container from "../container/Container";

const Logo = () => {
  return (
    <Container className="w-[220px]">
      <Image src={mcLogo} alt="Logo" className="w-full" />
    </Container>
  );
};

export default Logo;
