import {useState} from 'react';
import { Container,Row, Col, Button, Card} from "react-bootstrap";
import "../styles/components/rentals/rentals.scss";
import { Link } from "react-router";
import toolDB from "../utils/toolDb.json";


const ToolRentals = ({link, setLink}) => {
    const [hoverState, setHoverState] = useState({});

    const handleMouseEnter = (id) => {
        setHoverState((prev)=> ({...prev, [id]: true}));
    }

    const handleMouseLeave = (id) => {
        setHoverState((prev)=> ({...prev, [id]: false}));
    }

    const handleNav = (id) => {
        if(id && toolDB.rentalEquipment) {
            const toolLink = toolDB.rentalEquipment.find((obj) => obj.id === id)?.link || "";
            setLink(toolLink);
        }
      };

    return (
        <Container fluid className="d-flex justify-content-center w-100 p-0 rental-container">
            <Row className="
                flex-column
                w-100
                rental-cards
            "
            >
                <Col className="rental-col">
                    <h2 className="p-3 rental-title">Tool Rental</h2>
                </Col>
                <Col className="d-flex gap-3 flex-column p-3 card-col">  
                    {toolDB.rentalEquipment.map((rentals) => {
                        
                        return (
                            rentals &&
                            <Card
                                role="button" 
                                key={rentals.id} 
                                className="
                                    justify-content-center
                                    align-items-center
                                    p-3
                                    rental-card 
                                "
                                onMouseEnter={() => handleMouseEnter(rentals.id)}
                                onMouseLeave={() => handleMouseLeave(rentals.id)}
                            >
                            <Card.Img 
                                src={ `${rentals.image}`} 
                                className="tool-image" 
                                alt="power tools"
                            />
                            <Card.ImgOverlay 
                                className="
                                    p-0
                                    tool-overlay 
                                "
                            >
                                <Card.Body 
                                    className="
                                    d-flex
                                    flex-column
                                    align-items-center 
                                    justify-content-between
                                    w-100
                                    h-100
                                    p-2
                                    tool-body 
                                    "
                                >
                                    <Card.Text 
                                        className="tool-title"
                                    >
                                        {rentals.name}
                                    </Card.Text>
                                    {
                                        hoverState[rentals.id] && (
                                            <>
                                                <Button 
                                                    as={Link} 
                                                    onClick={() => handleNav(rentals.id)}
                                                    to="/rentals"
                                                    className="
                                                        py-2
                                                        px-5
                                                        border-0
                                                        rental-btn
                                                    "
                                                >
                                                    Rent
                                                </Button>
                                            </>
                                        )
                                    }
                                </Card.Body>
                            </Card.ImgOverlay>
                        </Card>
                        )
                    })}
                </Col>
            </Row>
        </Container>
    );
};

export default ToolRentals;