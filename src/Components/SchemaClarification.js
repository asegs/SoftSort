import React,{Component} from "react";
import Option from './Option';
import {Form, Input} from "reactstrap";

class SchemaClarification extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.title,
            min: this.props.min,
            max: this.props.max,
            desc: "",
            units: ""
        }
    }

    changeName=(e)=>{
        this.setState({name:e.target.value},()=>{
            this.props.edit(this.props.num,this.state.name,0);
        });
    }
    changeMin=(e)=>{
        this.setState({min:e.target.value},()=>{
            this.props.edit(this.props.num,this.state.min,2);
        });
    }
    changeMax=(e)=>{
        this.setState({max:e.target.value},()=>{
            this.props.edit(this.props.num,this.state.max,3);
        });
    }
    changeDesc=(e)=>{
        this.setState({desc:e.target.value},()=>{
            this.props.edit(this.props.num,this.state.desc,1);
        });
    }
    changeUnits=(e)=>{
        this.setState({units:e.target.value},()=>{
            this.props.edit(this.props.num,this.state.units,4);
        });
    }

    render() {
        if (this.props.numerical){
            return (
                <div style={{width:"30%",margin:'auto'}}>
                <Form>
                    Column name: <Input type={"text"} value={this.state.name} onChange={this.changeName}/>
                    Minimum value: <Input type={"text"} value={this.state.min} onChange={this.changeMin}/>
                    Maximum value: <Input type={"text"} value={this.state.max} onChange={this.changeMax}/>
                    Column description: <Input type={"text"} placeholder={"The price of the item."} onChange={this.changeDesc}/>
                    Units: <Input type={"text"} onChange={this.changeUnits}/>
                </Form>
                </div>
            )
        }
        let options = [];
        for (let step=0;step<this.props.options.length;step++){
            options.push(<div><br/><br/></div>)
            options.push(<Option edit={this.props.edit} mainNum={this.props.num} name={this.props.options[step]} num={step}/>);
        }
        return(
          <div style={{width:"30%",margin:'auto'}}>
              <Form>
                  Column name: <Input type={"text"} value={this.state.name} onChange={this.changeName}/>
                  Column description: <Input type={"text"} placeholder={"The item's color."} onChange={this.changeDesc}/>
              </Form>
              {options}
          </div>
        );
    }

}
export default SchemaClarification;