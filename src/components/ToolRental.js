import {useState} from 'react';
import { Container,Row, Button, Card} from "react-bootstrap";
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
        <Container className="rental-container" fluid>
            <Row className="rental-cards p-0 flex-column p-3 gap-4">
                <h2 className="tool-rental-title h2 m-0 p-0">Tool Rental</h2>
                {toolDB.rentalEquipment.map((rentals) => {
                    
                    return (
                        rentals &&
                        <Card
                            role="button" 
                            key={rentals.id} 
                            className="
                                rental-card 
                                flex-column 
                                align-items-center
                                rounded-3 
                                border-1
                                p-3
                            "
                            onMouseEnter={() => handleMouseEnter(rentals.id)}
                            onMouseLeave={() => handleMouseLeave(rentals.id)}
                        >
                        <Card.Img 
                            src={ `${rentals.image}`} 
                            className="tool-image border-0 rounded-0 mt-3" 
                            alt="power tools"
                        />
                        <Card.ImgOverlay 
                            className="
                                tool-overlay 
                                d-flex 
                                flex-column 
                                w-100
                                p-0
                            "
                        >
                            <Card.Body 
                                className="
                                tool-body 
                                d-flex 
                                flex-column 
                                align-items-center 
                                justify-content-start 
                                w-100 
                                p-2
                                gap-3"
                            >
                                <Card.Text 
                                    className="tool-title h3"
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
                                                    d-flex }
                                                    bg-black 
                                                    border-0 
                                                    justify-content-center 
                                                    align-items-center 
                                                    px-5 
                                                    py-2 
                                                    text-center 
                                                    rental-btn"
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
            </Row>
        </Container>
    );
};

export default ToolRentals;