import { Container } from "react-bootstrap";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ToolRentals from "../components/ToolRental";
import ToolRepair from "../components/ToolRepair";
import Footer from '../components/Footer';
import "../styles/pages/home/home.scss";
import Shop from "../components/shop/Shop";

const HomePage = ({link,setLink}) => {
  return (
    <Container className="d-flex flex-column p">
      <Header />
      <Hero />
      <ToolRentals 
        link={link}
        setLink={setLink}
      />
      <ToolRepair 
        link={link}
        setLink={setLink}
      />
      <Shop />
      <Footer /> 
    </Container>
  );
};

export default HomePage;