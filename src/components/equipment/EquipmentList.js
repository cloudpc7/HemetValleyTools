import { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import "../../styles/components/accessories/accessory.scss";
import tools from "../../utils/toolDb.json";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fas);

const EquipmentList = () => {
  const [displayedProducts, setDisplayedProducts] = useState([tools.products[0]]); // Start with first item

  // Example filter function (modify as needed)
  const handleFilter = (criteria) => {
    const filtered = tools.products.filter((product) => {
      // Example: filter by name or other criteria
      return product.name.toLowerCase().includes(criteria.toLowerCase());
    });
    setDisplayedProducts(filtered);
  };

  return (
    <Container>
      <h1>Construction Equipment</h1>
      <FontAwesomeIcon
        icon={["fas", "filter"]}
        onClick={() => handleFilter("")} // Example: reset or trigger filter
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

export default EquipmentList;