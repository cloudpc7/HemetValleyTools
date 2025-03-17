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
        <Container className="bg-black repair-container" fluid>
            <Row className="tool-cards p-0 flex-column p-3 gap-4">
                <h2 className="tool-repair-title h2 m-0 p-0">Tool & Equipment Repair</h2>
                {toolDB.toolRepair.map((tool) => {
                    
                    return (
                        tool &&
                        <Card
                            role="button" 
                            key={tool.id} 
                            className="
                                tool 
                                flex-column 
                                align-items-center
                                rounded-3 
                                border-1
                                p-3
                            "
                            onMouseEnter={() => handleMouseEnter(tool.id)}
                            onMouseLeave={() => handleMouseLeave(tool.id)}
                        >
                        <Card.Img 
                            src={ `${tool.image}`} 
                            className="tool-image border-0 rounded-0 mt-3" 
                            alt={tool.description}
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
                                                    d-flex }
                                                    bg-black 
                                                    border-0 
                                                    justify-content-center 
                                                    align-items-center 
                                                    px-5 
                                                    py-2 
                                                    text-center 
                                                    repair-btn"
                                            >
                                                Request Repair
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