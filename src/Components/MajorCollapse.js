import React, { useState } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

const MajorCollapse = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = (e) => {
        if (e.clientX===0&&e.clientY===0){
            return
        }
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <Button color="primary" onClick={toggle} style={{ marginBottom: '1rem',width:'50%',marginTop:"5px",}}>{props.name}</Button>
            <Collapse isOpen={isOpen}>
                {props.subCollapses}
                <Button onClick={props.submit} color='primary' style={{ marginBottom: '1rem',width:'45%',marginTop:"5px",}}>Submit!</Button>
            </Collapse>
        </div>
    );
}

export default MajorCollapse;