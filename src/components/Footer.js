import { Container, Row, Col, Image, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom"; // Fixed import
import "../styles/components/footer/footer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import skullImage from "../assets/images/skull.png";

library.add(fab, fas);

const Footer = () => {
  return (
    <Container
      fluid
      className="footer position-relative d-flex flex-column align-items-center w-100 p-0"
    >
      <Image
        className="skull-image position-absolute opacity-25 z-0"
        src={skullImage}
        alt="skull and bones with hard hat"
      />
      <Row className="footer-row w-100 p-2 z-1">
        <Col xs={12} className="explore-list mb-3">
          <ListGroup className="explore text-center">
            <h3 className="footer-subtitle">Explore</h3>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Tool Rental</ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Tool Repair</ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Power Tools</ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Accessories</ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Services</ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Site Map</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col xs={12} className="social-links mb-3">
          <ListGroup horizontal className="social justify-content-center gap-3">
            <h3 className="footer-subtitle w-100">Social</h3>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-0">
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
            </ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-0">
              <FontAwesomeIcon icon={["fab", "twitter"]} size="lg" />
            </ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-0">
              <FontAwesomeIcon icon={["fab", "instagram"]} size="lg" />
            </ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-0">
              <FontAwesomeIcon icon={["fab", "facebook"]} size="lg" />
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col xs={12} className="legal-list mb-3">
          <ListGroup className="legal text-center">
            <h3 className="footer-subtitle">Legal</h3>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Terms of Service</ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">User Agreement</ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Warranties</ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Safety</ListGroup.Item>
            <ListGroup.Item as={Link} className="border-0 bg-transparent p-1">Privacy Policy</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col xs={12} className="d-flex flex-column gap-2 location mb-3 text-center">
          <h3 className="address">Location</h3>
          <p className="physical-location m-0">777 W Esplanade Ave <br/> San Jacinto, CA 92582</p>
          <p className="phone m-0">(951) 654-1034</p>
        </Col>
        <Col xs={12} className="copyright text-center">
          <h4 className="developer m-0">Site by CloudDropDesigns LLC.</h4>
          <p className="listing m-0">© 2025 Copyright CloudDropDesigns.com</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;