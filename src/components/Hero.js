import {Card, Button} from "react-bootstrap";
const Hero = () => {
    return (
        <Card>
            <Card.Img />
            <Card.ImgOverlay>
                <Card.Body>
                    <Card.Text>
                        #1 Rated Tool Rental & Supply Shop
                    </Card.Text>
                    <Button>Tool Repair</Button>
                </Card.Body>
            </Card.ImgOverlay>
        </Card>
    );
};

export default Hero;