import { useState } from "react";
import { Container, Row, Button, Card } from "react-bootstrap";
import "../styles/components/repair/repair.scss";
import { Link } from "react-router-dom";
import toolDB from "../utils/toolDb.json";

const ToolRepair = ({ link, setLink }) => {
  const [hoverState, setHoverState] = useState({});

  const handleMouseEnter = (id) => {
    setHoverState((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id) => {
    setHoverState((prev) => ({ ...prev, [id]: false }));
  };

  const handleNav = (id) => {
    if (id && toolDB.rentalEquipment) {
      const toolLink = toolDB.rentalEquipment.find((obj) => obj.id === id)?.link || "";
      setLink(toolLink);
    }
  };

  return (
    <Container
      fluid
      className="repair-container py-3"
    >
      <Row className="tool-cards flex-column g-0">
        <h2 className="tool-repair-title px-3 py-2">Tool & <br /> Equipment Repair</h2>
        {toolDB.toolRepair.map((tool) =>
          tool ? (
            <Card
              key={tool.id}
              role="button"
              className="tool"
              onMouseEnter={() => handleMouseEnter(tool.id)}
              onMouseLeave={() => handleMouseLeave(tool.id)}
            >
              <Card.Img
                src={tool.image}
                className="tool-image"
                alt={tool.description}
              />
              <Card.Body className="tool-body p-3">
                <Card.Text className="tool-title">{tool.name}</Card.Text>
                <Button
                  as={Link}
                  to="/repairs"
                  onClick={() => handleNav(tool.id)}
                  className={`repair-btn py-3 px-5 ${hoverState[tool.id] ? "visible" : ""}`}
                >
                  Repair Now
                </Button>
              </Card.Body>
            </Card>
          ) : null
        )}
      </Row>
    </Container>
  );
};

export default ToolRepair;