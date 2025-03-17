import { Container,Row, Col, Card} from "react-bootstrap";
import "../styles/components/shop/shop.scss";
import powertool from "../assets/images/PowerTools.png";
import accessory from "../assets/images/accessory.webp";
import landscape from "../assets/images/lawnmower.avif";
import lift from "../assets/images/sunbelt.webp";
import { Link } from "react-router";
import toolDB from "../utils/toolDb.json";

const toolRentals = () => {
    return (
        <Container className="shop-container" fluid>
            <Row className="shop-cards p-0 flex-column gap-2 p-3">
                <h2 className="h2 m-0 p-0">Tool Rental</h2>
                <Col className="card-container">
                    <Link to="/power-tools">
                    <Card className="rounded-0 border-0 p-0">
                        <Card.Img src={powertool} alt="power tools"/>
                        <Card.ImgOverlay className="tool-card">
                            <Card.Body className="tool-info">
                                <Card.Text></Card.Text>
                            </Card.Body>
                        </Card.ImgOverlay>
                    </Card>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default toolRentals;