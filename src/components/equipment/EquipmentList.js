import { useState } from "react";
import {Container, Row, Col, Card, Button } from "react-bootstrap";
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
    <Container fluid className="
      d-flex
      justify-content-center
      w-100 
      p-0
      list-container
      "
    >
      <Row className="list-row flex-column p-0 w-100 ">
        <Col className="d-flex w-100 justify-content-center title-col">
          <h3 className="tool-list-title">Construction Equipment</h3>
        </Col>
        <Col className="w-100 p-0 filter">
          <FontAwesomeIcon
              icon={["fas", "filter"]}
              onClick={() => handleFilter("")} 
              style={{ cursor: "pointer", alignSelf: "flex-start" }}
              className="py-3"
            />
        </Col>
        <Col className="
          d-flex 
          w-100
          align-items-center
          justify-content-center
          p-2 
          tool-col
          "
        >
          {displayedProducts.map((product) => (
            <Card 
                key={product.id} 
                className="
                    flex-column
                    w-100
                    align-items-center
                    tool-card 
                  "
                >
              <Card.Title className="text-center p-2 m-0 tool-name">{product.name}</Card.Title>
              <Card.Img 
                src={product.image} 
                alt={product.name} 
                className="tool-image"
                />
              <Card.Body 
                className="
                    d-flex
                    w-100
                    justify-content-center
                    align-items-center
                    flex-column
                    gap-2
                    tool-body
                  "
                >
                <Card.Text className="spec">{product.brand}</Card.Text>
                <Card.Text className="spec">{product.specs}</Card.Text>
                <Card.Text className="spec">{`$${product.price}`}</Card.Text>
                <Card.Text className="spec" >{product.quantity}</Card.Text>
                <Card.Text className="spec">{product.availability}</Card.Text>
                <Button className="py-2 px-4 tool-btn">Shop Now</Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ToolList;