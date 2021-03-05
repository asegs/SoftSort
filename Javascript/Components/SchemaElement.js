import React,{Component} from "react";
import {Button, Form, Input, ListGroup, ListGroupItem} from 'reactstrap';

class SchemaElement extends Component{
    constructor(props) {
        super(props);
        this.state = {
            preparedName:""
        }
    }
    handleLocalChange = e =>{
        this.setState({preparedName:e.target.value})
    }

    render() {
        const handleChange = e => {
            this.props.edit(this.props.id,e.target.value);
        }



        if (this.props.numeric){
            return (
                <div>
                    <Form>
                        <Button color="info" onClick={()=>this.props.swap(this.props.id)}>SWAP</Button>
                        Numeric attribute name:<input type="text" placeholder="Price" onChange={handleChange}/>
                        <Button color="info" onClick={()=>this.props.remove(this.props.id)}>x</Button>
                    </Form>
                </div>
            );
        }
        else{
            let optionsArr = [];
            for (let step=0;step<this.props.items.length;step++){
                if (this.props.items[step]!=="") {
                    optionsArr.push(<div><p>{this.props.items[step]}<Button
                        onClick={() => this.props.deleteRow(this.props.id, step)}>x</Button></p></div>);
                }
            }
            return(
                <div>
                    <Form>
                        <Button color="info" onClick={()=>this.props.swap(this.props.id)}>SWAP</Button>
                        Select attribute name:<input type="text" placeholder="Type" onChange={handleChange}/>
                        <Button color="info" onClick={()=>this.props.remove(this.props.id)}>x</Button>
                    </Form>
                    <div style={{width:'20%',margin:'auto'}}>
                        <ListGroup>
                            {optionsArr}
                        </ListGroup>
                        <Form>
                            <input type="text" placeholder="New option" id={this.props.id} onChange={this.handleLocalChange}/>
                        <Button color="info" onClick={()=>{
                            document.getElementById(this.props.id).value="";
                            this.setState({preparedName:""})
                            this.props.addRow(this.props.id,this.state.preparedName);
                        }}>+</Button>
                        </Form>

                    </div>
                </div>
            );
        }
    }
}

export default SchemaElement;