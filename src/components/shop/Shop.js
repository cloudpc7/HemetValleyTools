import { Container, Row, Col } from "react-bootstrap";
import AccessoriesList from "../accessories/AccessoriesList";
import EquipmentList from "../equipment/EquipmentList";
import ToolList from "../tools/ToolList";
import LandscapingTools from "../landscape/Landscaping";
import "../../styles/components/shop/shop.scss";
import ToolSearch from "../../utils/ToolSearch";

const Shop = () => {
  return (
    <Container fluid className="shop-container py-3">
      <Row className="shop flex-column g-0">
        <Col className="shop-col px-3 py-2">
          <h2 className="shop-title">Shop Power Tools <br /> & More</h2>
        </Col>
        <Col className="search-card px-3 py-2">
          <ToolSearch />
        </Col>
        <Col className="shop-card px-3 py-2">
          <ToolList />
        </Col>
        <Col className="shop-card px-3 py-2">
          <EquipmentList />
        </Col>
        <Col className="shop-card px-3 py-2">
          <LandscapingTools />
        </Col>
        <Col className="shop-card px-3 py-2">
          <AccessoriesList />
        </Col>
      </Row>
    </Container>
  );
};

export default Shop;