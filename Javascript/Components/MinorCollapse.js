import React, { useState } from 'react';
import {Collapse, Button, CardBody, Card, Input} from 'reactstrap';
import ButtonComment from "./ButtonComment";

const MinorCollapse = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = (e) => {
        if (e.clientX===0&&e.clientY===0){
            return
        }
        setIsOpen(!isOpen);
    };

    let buttons = [];

    for (let step=0;step<props.attributes.length;step++){
        buttons.push(<ButtonComment schemaNum={props.schemaNum} columnNum={step} change={props.changeAttr} name={props.attributes[step]} nameComment={props.attributeComments[step]}/>);
    }

    return (
        <div>
            <Button color={props.nameComment==="" ? "warning" : "success"} onClick={toggle} style={{ marginBottom: '1rem',width:'40%'}}>{props.name}<Input id={'schema'+props.schemaNum} type={"text"} onChange={()=>props.changeName(props.schemaNum,document.getElementById('schema'+props.schemaNum).value)} value={props.nameComment} placeholder={props.nameComment==="" ? "A description of this category" : ""}/></Button>
            <Collapse isOpen={isOpen}>
                {buttons}
            </Collapse>
        </div>
    );
}

export default MinorCollapse;