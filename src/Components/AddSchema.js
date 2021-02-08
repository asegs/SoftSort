import React,{Component} from "react";
import SchemaElement from "./SchemaElement";
import {Button, Input} from "reactstrap";
import GeneralPopover from './GeneralPopover';

class AddSchema extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            options:[[false,"",[]],[true,"",[]]],
            uploadKey:"",
            apiFormat:""
        }
        this.sendSchema = this.sendSchema.bind(this);
    }

    add = () =>{
        let newOptions = [];
        for (let i=0;i<this.state.options.length;i++){
            newOptions.push(this.state.options[i]);
        }
        newOptions.push([false,"",[""]]);
        this.setState({options:newOptions});

    }

    remove = (id)=>{
        let newOptions = [];
        for (let i=0;i<this.state.options.length;i++){
            if (i!==id) {
                newOptions.push(this.state.options[i]);
            }
        }
        this.setState({options:newOptions});
    }

    swap = (id)=>{
        let newOptions = [];
        for (let i=0;i<this.state.options.length;i++){
            if (i!==id) {
                newOptions.push(this.state.options[i]);
            }
            else{
                newOptions.push([!this.state.options[i][0],this.state.options[i][1],this.state.options[i][2]]);
            }
        }
        this.setState({options:newOptions});
    }

    edit = (id,text) =>{
        let newOptions = [];
        for (let i=0;i<this.state.options.length;i++){
            if (i!==id) {
                newOptions.push(this.state.options[i]);
            }
            else{
                newOptions.push([this.state.options[i][0],text,this.state.options[i][2]]);
            }
        }
        this.setState({options:newOptions});
    }

    editTopic =(event)=>{
        this.setState({name:event.target.value});
    }

    deleteRow = (id,subID) =>{
        let newOptions = [];
        for (let i=0;i<this.state.options.length;i++){
            if (i!==id) {
                newOptions.push(this.state.options[i]);
            }
            else{
                let newRow = [this.state.options[i][0],this.state.options[i][1]];
                let newPicks = [];
                for (let step=0;step<this.state.options[i][2].length;step++){
                    if (step!==subID){
                        newPicks.push(this.state.options[i][2][step]);
                    }
                }
                newRow.push(newPicks);
                newOptions.push(newRow);
            }
        }
        this.setState({options:newOptions});
    }

    addRow = (id,name)=>{
        if (name===""){
            return;
        }
        let newOptions = [];
        for (let i=0;i<this.state.options.length;i++){
            if (i!==id) {
                newOptions.push(this.state.options[i]);
            }
            else{
                let newRow = this.state.options[i];
                let newPicks = [];
                for (let step=0;step<this.state.options[i][2].length;step++){
                    newPicks.push(this.state.options[i][2][step]);
                }
                newPicks.push(name);
                newRow[2] = newPicks;
                newOptions.push(newRow);
            }
        }
        this.setState({options:newOptions});
    }

    changeKey = (e) =>{
        this.setState({uploadKey:e.target.value});
    }

    changeAPIFormat=(e)=>{
        this.setState({apiFormat:e.target.value});
    }

    async sendSchema(){
        let data = {};
        data['format'] = this.state.apiFormat;
        data['schema'] = this.state.options;
        data['name'] = this.state.name;
        data['key'] = this.state.uploadKey;
        await fetch('/softsort/schema',{
            method:'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data),
        });
    }


    render() {
        let elements = [];
        for (let step=0;step<this.state.options.length;step++){
            if (this.state.options[step][0]){
                elements.push(<div><SchemaElement addRow={this.addRow} deleteRow={this.deleteRow} edit={this.edit} swap={this.swap} remove={this.remove} id={step} numeric={true} title={this.state.options[step][1]} items={this.state.options[step][2]}/><br/></div>);
            }
            else{
                elements.push(<div><SchemaElement addRow={this.addRow} deleteRow={this.deleteRow} edit={this.edit} swap={this.swap} remove={this.remove} id={step} numeric={false} title={this.state.options[step][1]} items={this.state.options[step][2]}/><br/></div>);
            }
        }
        return (
            <div>
                <div style={{width:'30%',margin:'auto'}}>
                Title:<Input type={"text"} onChange={this.editTopic}/><br/>
                </div>
                {elements}
                <Button color="info" onClick={this.add}>+</Button>
                <br/><br/><br/>
                <form>
                    Key: <input style={{width:'90%'}} type={"text"} onChange={this.changeKey}/><br/><br/>
                    API Format Instructions (optional): <input style={{width:'40%'}} type={"text"} onChange={this.changeAPIFormat}/>
                    <GeneralPopover code={"Format"} body={"If you already have a website with postings of your inventory accessible by ID, you can use that here!  Enter an example link to one of your items in this category, where <I> represents the place of the items ID. For example www.companyname/products/<I>"} title={"What does this mean?"}/>
                </form>

                <Button color="info" onClick={this.sendSchema}>SUBMIT</Button>
            </div>
        );
    }

}

export default AddSchema;