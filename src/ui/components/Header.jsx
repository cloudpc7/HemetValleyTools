import { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Header = () => {
    return (
        <Container>
            <Row>
                <Column>
                    <Navbar />
                </Column>
            </Row>
        </Container>
    );
};

export default Header;