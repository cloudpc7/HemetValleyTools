import { Navbar, Nav, Offcanvas, Container, Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import skullIcon from "../assets/images/hemetValleyIcon.png";
import skullImage from '../assets/images/skull.png';
import "../styles/components/header/header.scss";

library.add(fab, fas);

const Header = () => {
  const [showNav, setShowNav] = useState(false);

  return (
    <Navbar expand="lg" className="flex-column p-2">
      <Container fluid className="d-flex justify-content-between align-items-center p-0">
        <Navbar.Toggle
          onClick={() => setShowNav(true)}
          aria-controls="offcanvasNavbar-expand-lg"
          className="rounded-0 ms-auto"
        />
        <Navbar.Offcanvas
          placement="start"
          show={showNav}
          onHide={() => setShowNav(false)}
          aria-labelledby="offcanvasNavbar-expand-lg"
        >
          <Offcanvas.Header className="text-start" closeButton>
            <Link to="/">
                <Image src={skullIcon} className="skull-icon img-fluid" alt="skull and bones with hard hat" />
            </Link>
            <h3 className="business-title h3 m-0">Hemet Valley Tools & Supply</h3>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column gap-3">
                <Button  as={Link} to="/rental" className="rental-btn">Rentals</Button>
                <Nav.Link as={Link} to="/account">
                    SignUp/Login
                </Nav.Link>
                <Nav.Link as={Link} to="/repair">
                    Tool Repair
                </Nav.Link>
                <Nav.Link as={Link} to="/shop">
                    Power Tools
                </Nav.Link>
              <Nav.Link className="font-nav" href="tel:+19516541034">
                <FontAwesomeIcon icon={['fas', 'phone']} size="2x" /> 
              </Nav.Link>
              <Nav.Link className="font-nav" href="https://goo.gl/maps/your-location" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={['fas', 'map-marker-alt']} size="2x" /> 
              </Nav.Link>
              <Nav.Link className="font-nav" href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={['fab', 'facebook']} size="2x" />
              </Nav.Link>
              <Nav.Link className="font-nav" href="https://x.com/yourhandle" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={['fab', 'x-twitter']} size="2x" />
              </Nav.Link>
              <Nav.Link className="font-nav" href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={['fab', 'instagram']} size="2x" /> 
              </Nav.Link>
              
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
      <Row className="flex-column position-relative w-100 text-center gap-2 justify-content-center">
        <Col xs={12} className="image-container position-absolute z-n1 opacity-50">
          <Image src={skullImage} alt="skull & crossbones with hardhat" className="skull-image img-fluid" />
        </Col>
        <Col xs={12} className="d-flex flex-column p-0">
          <h3 className="hero-title h3 mt-3 mb-3">#1 Rated Tool Rental & Supply Shop</h3>
          <Button as={Link} to="/repair" className="repair-btn m-auto">Tool Repair</Button>
        </Col>
      </Row>
    </Navbar>
  );
};

export default Header;