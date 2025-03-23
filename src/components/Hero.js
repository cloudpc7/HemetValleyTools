import { Card, Button } from "react-bootstrap";
import skullImage from "../assets/images/skull.png";
import "../styles/components/hero/hero.scss";

const Hero = () => {
  return (
    <Card className="hero-card rounded-0 border-0">
      <Card.Img
        className="skull-image opacity-50 z-0"
        src={skullImage}
        alt="skull and bones with hard hat"
      />
        <Card.Body className="d-flex flex-column align-items-center justify-content-between w-100 h-100 call-action z-1">
          <Card.Text className="call-text h1">
            #1 Rated <br />Tool & Supply
          </Card.Text>
          <Button as="a" href="/repair" className="call-btn">
            Tool Repair
          </Button>
        </Card.Body>
    </Card>
  );
};

export default Hero;