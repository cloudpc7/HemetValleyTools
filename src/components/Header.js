import {  Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";

const Header = () => {
    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Toggle 
                     aria-controls="offcanvasNavbar-expand-lg"
                />
                <Navbar.Offcanvas
                    placement=""
                    show=""
                    onHide=""
                    aria-labelledby="offcanvasnavbar-expand-lg"
                >
                    <Offcanvas.Header></Offcanvas.Header>
                    <Offcanvas.Body></Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
};

export default Header;