import {Button, Input} from "reactstrap";
import React from "react";

const ButtonComment = (props) => {
    return (
        <div>
            <Button color={props.nameComment==="" ? "warning" : "success"}  style={{ marginBottom: '1rem',width:'25%'}}>{props.name}<Input type={"text"} id={'schema'+props.schemaNum+'attr'+props.columnNum} onChange={()=>props.change(props.schemaNum,props.columnNum,document.getElementById('schema'+props.schemaNum+'attr'+props.columnNum).value)} value={props.nameComment} placeholder={props.nameComment==="" ? "A description of this category" : ""}/></Button>
        </div>
    )
}

export default ButtonComment;