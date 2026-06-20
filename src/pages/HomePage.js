import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ToolRentals from "../components/ToolRental";
import ToolRepair from "../components/ToolRepair";
import Footer from '../components/Footer';
import "../styles/pages/home/home.scss";
import Shop from "../components/shop/Shop";

const HomePage = ({link,setLink}) => {
  return (
    <Container fluid className="
        d-flex 
        flex-column 
        home-container 
        align-items-center 
        justify-content-center 
        p-0 
        w-100
      "
    >
      <Row className="w-100 p-0 flex-column">
        <Col className="w-100 p-0">
          <Header />
        </Col>
        <Col className="w-100 p-0">
          <Hero />
        </Col>
        <Col className="w-100 p-0">
          <ToolRentals 
          link={link}
          setLink={setLink}
          />
        </Col>
        <Col className="w-100 p-0">
          <ToolRepair 
          link={link}
          setLink={setLink}
          />
        </Col>
        <Col className="w-100 p-0">
          <Shop />
        </Col>
        <Col className="w-100 p-0">
          <Footer /> 
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;