import React,{Component,useState} from "react";
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import MajorCollapse from "./MajorCollapse";
import MinorCollapse from "./MinorCollapse";
class DatafileCollapse extends Component{
    constructor(props) {
        super(props);
        this.state = {
            open:false,
            nameComments:this.props.comments[this.props.comments.length-1],
            attrComments:this.props.comments.slice(0,this.props.comments.length-1),
            uploadSuccess:2
        }
        this.uploadComments = this.uploadComments.bind(this);
    }

    async uploadComments(){
        let data = {};
        let newNameComments = [];
        data['keyText'] = this.props.keyText;
        data['nameComments'] = this.state.nameComments;
        data['attrComments'] = this.state.attrComments;
        const response = await fetch('/softsort/uploadadvancedschema/'+this.props.name,{
            method:'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data),
        });
        const body = response.json();
        this.setState({uploadSuccess: body ? 1 : 0});
        await this.props.load;
    }

    changeNameComment=(schemaIdx,newValue)=>{
        let newNameComments = this.state.nameComments;
        newNameComments[schemaIdx] = newValue;
        this.setState({nameComments:newNameComments});
    }

    changeAttrComment=(schemaIdx,columnIdx,newValue)=>{
        let newAttrComments = this.state.attrComments;
        newAttrComments[schemaIdx][columnIdx] = newValue;
        this.setState({attrComments:newAttrComments});
    }




    render() {
        let subCollapses = [];
        let counter = 0;
        for (let step=0;step<this.props.schemaNames.length;step++){
            let schemaEntries = []
            if (!this.props.schemaNames[step].includes("<M>")&&!this.props.schemaNames[step].includes("<L>")){
                schemaEntries = this.props.schema[counter];
                counter++;
            }
            subCollapses.push(<MinorCollapse schemaNum={step} changeName={this.changeNameComment} changeAttr={this.changeAttrComment} name={this.props.schemaNames[step]} attributes={schemaEntries} nameComment={this.state.nameComments[step]} attributeComments={this.state.attrComments[step]}/>);
        }
        let text = this.state.uploadSuccess<1 ? "Update failed." : "Update successful!";
        let message = "";
        if (this.state.uploadSuccess===0){
            message = <p style={{color:"red"}}>Update failed.</p>;
        }
        else if(this.state.uploadSuccess===1){
            message = <p style={{color:"green"}}>Update successful!</p>;
        }
        return(
            <div>
                <MajorCollapse submit={this.uploadComments} name={this.props.name} subCollapses={subCollapses}/>
                {message}
            </div>
        )
    }
}
export default DatafileCollapse;
