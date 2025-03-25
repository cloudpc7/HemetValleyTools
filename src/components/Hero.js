import { Container, Button } from "react-bootstrap";
import "../styles/components/hero/hero.scss";
import { Link } from "react-router";

const Hero = () => {
  return (
    <Container fluid className="hero-card">
      <div className="call-action">
        <h1 className="call-text">
          #1 Rated <br />Tool & Supply Shop
        </h1>
        <Button as={Link} href="/repair" className="btn call-btn">
          Tool Repair
        </Button>
      </div>
    </Container>
  );
};

export default Hero;