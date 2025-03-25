import { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "../styles/components/rentals/rentals.scss";
import { Link } from "react-router-dom";
import toolDB from "../utils/toolDb.json";

const ToolRentals = ({ link, setLink }) => {
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
    <Container fluid className="rental-container py-3">
      <Row className="rental-cards flex-column g-0">
        <Col className="rental-col px-3 py-2">
          <h2 className="rental-title">Tool Rentals</h2>
        </Col>
        <Col className="card-col px-3 pb-3">
          {toolDB.rentalEquipment.map((rental) =>
            rental ? (
              <Card
                key={rental.id}
                role="button"
                className="rental-card"
                onMouseEnter={() => handleMouseEnter(rental.id)}
                onMouseLeave={() => handleMouseLeave(rental.id)}
              >
                <Card.Img
                  src={rental.image}
                  className="tool-image"
                  alt={rental.name}
                />
                <Card.Body className="tool-body p-3">
                  <Card.Text className="tool-title">{rental.name}</Card.Text>
                  <Button
                    as={Link}
                    to="/rentals"
                    onClick={() => handleNav(rental.id)}
                    className={`rental-btn py-3 px-5 ${hoverState[rental.id] ? "visible" : ""}`}
                  >
                    Rent Now
                  </Button>
                </Card.Body>
              </Card>
            ) : null
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ToolRentals;