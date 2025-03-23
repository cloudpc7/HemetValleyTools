import { Container, Row, Col} from "react-bootstrap";
import AccessoriesList from "../accessories/AccessoriesList";
import EquipmentList from "../equipment/EquipmentList";
import ToolList from "../tools/ToolList";
import LandscapingTools from "../landscape/Landscaping";
import "../../styles/components/shop/shop.scss"
import ToolSearch from "../../utils/ToolSearch";
const Shop = () => {
    return (
        <Container fluid className="
            d-flex 
            w-100 
            p-0 
            justify-content-center
            shop-container
        "
        >
            <Row className="flex-column w-100 p-3 gap-3 shop">
                <Col className="w-100 p-3 shop-col">
                    <h2 className="px-5 shop-title">Shop Power Tools & more</h2>
                </Col>
                <Col className="w-100 p-0">
                    <ToolSearch />
                </Col>
                <Col className="w-100 p-0">
                    <ToolList />
                </Col>
                <Col className="w-100 p-0">
                    <EquipmentList />
                </Col>
                <Col className="w-100 p-0">
                    <LandscapingTools />
                </Col>
                <Col className="w-100 p-0">
                    <AccessoriesList /> 
                </Col> 
            </Row>
        </Container>
    );
};

export default Shop;