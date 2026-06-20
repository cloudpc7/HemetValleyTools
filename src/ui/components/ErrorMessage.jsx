import { useState } from 'react';
import { Toast  } from 'react-bootstrap';

const ErrorMessage = ({props}) => {
    return (
        <Toast>
            <Toast.Header></Toast.Header>
            <Toast.Body></Toast.Body>
        </Toast>
    );

};