import {useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/pages/rental/rental.scss";

const RepairPage = ({link}) => {
    console.log(link);
    return (
        <Container>
            {link === "powertools" &&
                <Row>
                    <h1>Power Tools</h1>
                </Row>
            }
            {link === "construction" && 
                <Row>
                </Row>
            }
            {link === "landscaping" &&
                <Row>
                </Row>
            }
            {link === "accessories" &&
                <Row>
                </Row>
            }
            {!link && <h1>Not Available</h1>}
        </Container>
    );
};

export default RepairPage;