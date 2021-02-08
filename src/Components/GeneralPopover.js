import React from "react";
import {Button, PopoverBody, PopoverHeader, UncontrolledPopover} from "reactstrap";

function generalExplainPopover(props){
    let buttonID = "generalPopover"+props.code;
    return(
        <div>
            <Button color="info" id={buttonID} type="button" onClick={(e)=>e.target.focus()}>
                ?
            </Button>
            <UncontrolledPopover placement="bottom"
                                 trigger="focus" placement="bottom" target={buttonID}>
                <PopoverHeader>{props.title}</PopoverHeader>
                <PopoverBody>
                    {props.body}
                </PopoverBody>
            </UncontrolledPopover>
            <br/><br/>
        </div>
    )
}

export default generalExplainPopover;