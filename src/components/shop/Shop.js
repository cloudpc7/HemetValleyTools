import {useState, useEffect} from "react";
import { Container, Row, Card, Col, Button} from "react-bootstrap";
import AccessoriesList from "../accessories/AccessoriesList";
import EquipmentList from "../equipment/EquipmentList";
import ToolList from "../tools/ToolList";
import Search from "../Search";


const Shop = () => {
    return (
        <Container>
            <h2>Shop Power Tools & more</h2>
            <Search />
            <ToolList />
            <EquipmentList />
            <AccessoriesList />
        </Container>
    );
};

export default Shop;