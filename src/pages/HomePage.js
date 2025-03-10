import { Container } from "react-bootstrap";
import Header from "../components/Header";
import Footer from '../components/Footer';
import "../styles/pages/home/home.scss";

const HomePage = () => {
  return (
    <Container className="d-flex flex-column p-2">
      <Header />
      <Footer /> 
    </Container>
  );
};

export default HomePage;