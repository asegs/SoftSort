import React, { Component } from "react";
import {Button, Popover, PopoverHeader, PopoverBody, UncontrolledPopover} from "reactstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import NormalRangeAlgo from "./NormalRangeAlgo";
import NormalTargetAlgo from "./NormalTargetAlgo";
import Haversine from "./Haversine";

class DetailPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "React",
            popoverOpen: false
        };
        this.togglePopover = this.togglePopover.bind(this);

    }


    togglePopover() {
        this.setState({ popoverOpen: !this.state.popoverOpen })
    }

    render() {
        const { popoverOpen } = this.state;
        let pairs=[];
        for (let step=0;step<this.props.schema.length;step++){
            let schemaName = this.props.schema[step];
            let valueName = this.props.values[step];
            let color = "green";
            if (schemaName.includes("<M>")){
                schemaName = schemaName.replaceAll("<M>","");
                let choiceRow = this.props.choices[step].replaceAll("<M>","");
                let numerics = choiceRow.split("n");
                let match = NormalRangeAlgo(parseFloat(valueName),parseFloat(numerics[0]),parseFloat(numerics[1]),parseFloat(numerics[2]),parseInt(numerics[3]),this.props.minMax[step][0],this.props.minMax[step][1]);
                match = Math.round(match*1000)/10;

                if (match<80){
                    color="goldenrod";
                }
                if (match<65){
                    color="chocolate";
                }
                if (match <50 || isNaN(match)){
                    color="red";
                }
                if (isNaN(match)){
                    match = 0;
                }
                valueName+=" ("+match+"%)";
            }

            else if (schemaName.includes("<L>")){
                schemaName = schemaName.replaceAll("<L>","");
                let choiceRow = this.props.choices[step].replaceAll("<L>","");
                let numerics = choiceRow.split(":");
                let values = valueName.split(":");
                let haversineDist = Haversine(values[0],values[1],numerics[0],numerics[1]);
                let toleratedRange = numerics[2];
                let outsideDist = haversineDist-toleratedRange>=0 ? haversineDist-toleratedRange : 0;
                let match = NormalTargetAlgo(0,outsideDist,1,false,numerics[2]);
                match = Math.round(match*1000)/10;
                valueName+=" ("+match+"%)";
                if (match<80){
                    color="goldenrod";
                }
                if (match<65){
                    color="chocolate";
                }
                if (match <50){
                    color="red";
                }
            }
            else if(!this.props.choices[step].includes(valueName)&&!this.props.choices[step].includes("<*3")){
                color="red";
            }
            pairs.push(<p style={{color:color}}>{schemaName}: {valueName}</p>)
        }
        let color = 'green';
        let match = parseFloat(this.props.values[this.props.values.length-1]);
        if (match<80){
            color="goldenrod";
        }
        if (match<65){
            color="chocolate";
        }
        if (match <50){
            color="red";
        }
        let f_id = this.props.id.replaceAll(".","");
        let popoverID = "mypopover"+f_id;
        popoverID = popoverID.replaceAll(" ","");
        let companyInfo = []
        let link="";
        if (this.props.company==="General"){
            companyInfo.push(<p style={{color:color}}>Company: {this.props.values[this.props.values.length-2]}</p>);
            popoverID+=this.props.values[this.props.values.length-2].replaceAll(" ","");
            let urls = {}
            let lastRow = this.props.url[this.props.url.length-1];
            lastRow = lastRow.split("!*!");
            for(let step=0;step<this.props.url.length-1;step++){
                urls[lastRow[step]] = this.props.url[step];
            }
            console.log(urls);
            if (urls[this.props.values[this.props.values.length-2]].includes("<I>")){
                let newUrl = urls[this.props.values[this.props.values.length-2]].replaceAll("<I>",this.props.id);
                link= <Button color={"link"} title={newUrl} className="action primary tocart"
                              onClick= {()=>window.open(newUrl, '_blank')}>Link</Button>;
            }

        }
        else{
            if (this.props.url[0].includes("<I>")){
                let newUrl = this.props.url[0].replaceAll("<I>",this.props.id);
                link= <Button color={"link"} title={newUrl} className="action primary tocart"
                              onClick= {()=>window.open(newUrl, '_blank')}>Link</Button>;
            }
        }



        return (
            <div>
                <Button color='danger' onClick={()=>this.props.remove(this.props.num)}>x</Button><Button id={popoverID} type="button" style={{minWidth:'35%'}} onClick={(e)=>e.target.focus()}>
                    {this.props.name}: {this.props.values[this.props.values.length-1]}
                </Button>
                {link}
                <UncontrolledPopover placement="bottom"
                                     isOpen={popoverOpen} toggle={this.togglePopover} trigger="focus" placement="bottom" target={popoverID}>
                    <PopoverHeader>{this.props.name}</PopoverHeader>
                    <PopoverBody>
                        {pairs}
                        {companyInfo}
                        <p style={{color:color}}>Match: {this.props.values[this.props.values.length-1]}</p>
                    </PopoverBody>
                </UncontrolledPopover>
                <br/><br/>
            </div>
        );
    }
}

export default DetailPopover;
