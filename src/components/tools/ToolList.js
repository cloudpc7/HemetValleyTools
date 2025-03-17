import { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import "../../styles/components/accessories/accessory.scss";
import tools from "../../utils/toolDb.json";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fas);

const ToolList = () => {
  const [displayedProducts, setDisplayedProducts] = useState([tools.products[0]]); // Start with first item

  // Example filter function
  const handleFilter = (criteria) => {
    const filtered = tools.products.filter((product) =>
      product.name.toLowerCase().includes(criteria.toLowerCase())
    );
    setDisplayedProducts(filtered.length > 0 ? filtered : [tools.products[0]]); // Fallback to first item
  };

  return (
    <Container>
      <h1>Power Tools</h1>
      <FontAwesomeIcon
        icon={["fas", "filter"]}
        onClick={() => handleFilter("")} // Reset or trigger filter
        style={{ cursor: "pointer" }}
      />
      {displayedProducts.map((product) => (
        <Card key={product.id}>
          <Card.Title>{product.name}</Card.Title>
          <Card.Img src={product.image} alt={product.name} />
          <Card.Body>
            <Card.Text>{product.brand}</Card.Text>
            <Card.Text>{product.specs}</Card.Text>
            <Card.Text>{product.price}</Card.Text>
            <Card.Text>{product.quantity}</Card.Text>
            <Card.Text>{product.availability}</Card.Text>
            <Button>Shop Now</Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default ToolList;