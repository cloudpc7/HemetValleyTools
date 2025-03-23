import { Navbar, Nav, Offcanvas, Container, Row, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import skullIcon from "../assets/images/hemetValleyIcon.png";
import Search from "../utils/Search";
import "../styles/components/header/header.scss";

library.add(fab, fas);

const Header = () => {
  const [showNav, setShowNav] = useState(false);
  return (
    <Navbar expand="lg" className="flex-column p-3">
      <Container className="nav-container justify-content-center w-100">
        <Row className="nav-icon-section w-100 align-items-cneter justify-content-center">
          <Image className="p-0 skull-image" src={skullIcon} alt="skull and bones with hard hat"/>
          <FontAwesomeIcon className="p-0 ms-auto" icon={['fas', 'cart-shopping']} size="1x" />   
          <Navbar.Toggle
            onClick={() => setShowNav(true)}
            aria-controls="offcanvasNavbar-expand-lg"
            className="w-100 p-0"
          />
        </Row>
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
            <Offcanvas.Title className="business-title ms-auto ps-3">Hemet Valley Tools & Supply</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column gap-3">
                <Button as={Link} to="/rental" className="rental-btn">Rentals</Button>
                <Nav.Link as={Link} to="/account">
                    SignUp/Login
                </Nav.Link>
                <Nav.Link as={Link} to="/repair">
                    Tool Repair
                </Nav.Link>
                <Nav.Link as={Link} to="/shop">
                    Power Tools
                </Nav.Link>
                <Search />
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
    </Navbar>
  );
};

export default Header;