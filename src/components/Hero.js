import {Card, Button} from "react-bootstrap";
import skullImage from '../assets/images/skull.png';
import "../styles/components/hero/hero.scss";
const Hero = () => {
    return (
        <Card className="hero-card">
            <Card.Img className="opacity-50 p-3 skull-image" src={skullImage} alt="skull and bones with hard hat"/>
            <Card.ImgOverlay className="hero-overlay">
                <Card.Body className="call-action d-flex flex-column align-items-center gap-3">
                    <Card.Text className="h1 call-text">
                        #1 Rated Tool Rental & Supply Shop
                    </Card.Text>
                    <Button className="call-btn">Tool Repair</Button>
                </Card.Body>
            </Card.ImgOverlay>
        </Card>
    );
};

export default Hero;