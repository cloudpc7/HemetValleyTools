import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../styles/components/accessories/accessory.scss";
import tools from "../../utils/toolDb.json";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fas);

const ToolList = () => {
  const [displayedProducts, setDisplayedProducts] = useState([tools.products[0]]);

  const handleFilter = (criteria) => {
    const filtered = tools.products.filter((product) =>
      product.name.toLowerCase().includes(criteria.toLowerCase())
    );
    setDisplayedProducts(filtered.length > 0 ? filtered : [tools.products[0]]);
  };

  return (
    <Container fluid className="list-container">
      <Row className="list-row flex-column g-0">
        <Col className="title-col px-3 py-2">
          <h3 className="tool-list-title">Landscaping Equipment</h3>
        </Col>
        <Col className="filter px-3 py-1">
          <FontAwesomeIcon
            icon={["fas", "filter"]}
            onClick={() => handleFilter("")}
            style={{ cursor: "pointer" }}
          />
        </Col>
        <Col className="tool-col px-3 py-2">
          {displayedProducts.map((product) => (
            <Card key={product.id} className="tool-card">
              <Card.Img
                src={product.image}
                alt={product.name}
                className="tool-image"
              />
              <Card.Body className="tool-body p-3">
                <Card.Title className="tool-name">{product.name}</Card.Title>
                <Card.Text className="spec">{product.brand}</Card.Text>
                <Card.Text className="spec">{product.specs}</Card.Text>
                <Card.Text className="spec">${product.price}</Card.Text>
                <Card.Text className="spec">{product.quantity}</Card.Text>
                <Card.Text className="spec">{product.availability}</Card.Text>
                <Button className="tool-btn py-2 px-4 my-2">Shop Now</Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ToolList;