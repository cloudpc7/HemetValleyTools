import {useState} from 'react';
import { Container,Row, Button, Card} from "react-bootstrap";
import "../styles/components/repair/repair.scss";
import { Link } from "react-router";
import toolDB from "../utils/toolDb.json";


const ToolRepair = ({link, setLink}) => {
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
        <Container className="
            d-flex
            w-100 
            p-0
            justify-content-center
            align-items-center
            repair-container
        " 
            fluid
        >
            <Row className="
                w-100
                p-3
                gap-3
                tool-cards
                "
            >
                <h2 className="tool-repair-title p-2">Tool & Equipment Repair</h2>
                {toolDB.toolRepair.map((tool) => {
                    
                    return (
                        tool &&
                        <Card
                            role="button" 
                            key={tool.id} 
                            className="
                                p-3
                                align-items-center
                                tool 
                            "
                            onMouseEnter={() => handleMouseEnter(tool.id)}
                            onMouseLeave={() => handleMouseLeave(tool.id)}
                        >
                        <Card.Img 
                            src={ `${tool.image}`} 
                            className="
                                tool-image
                            " 
                            alt={tool.description}
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
                                    tool-body
                                "
                            >
                                <Card.Text 
                                    className="tool-title"
                                >
                                    {tool.name}
                                </Card.Text>
                                {
                                    hoverState[tool.id] && (
                                        <>
                                            <Button 
                                                as={Link} 
                                                onClick={() => handleNav(tool.id)}
                                                to="/repairs"
                                                className="
                                                    py-2
                                                    px-3
                                                    border-0
                                                    repair-btn"
                                            >
                                                Repair
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

export default ToolRepair;