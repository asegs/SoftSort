import React,{Component} from "react";
import {Form, Input} from "reactstrap";

class Option extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name:this.props.name,
            desc:""
        }
    }
    changeName=(e)=>{
        this.setState({name:e.target.value},()=>{
            let newPair = [this.state.name,this.state.desc];
            this.props.edit(this.props.mainNum,newPair,this.props.num+2);
        });
    }
    changeDesc=(e)=>{
        this.setState({desc:e.target.value},()=>{
            let newPair = [this.state.name,this.state.desc];
            this.props.edit(this.props.mainNum,newPair,this.props.num+2);
        });
    }
    render() {
        return(
          <div>
              <Form>
                Item name: <Input type={"text"} value={this.state.name} onChange={this.changeName}/>
                Item description: <Input type={"text"} placeholder={"A dark red."} onChange={this.changeDesc}/>
              </Form>
          </div>
        );
    }
}

export default Option;