import React,{Component} from "react";
import Select from "react-select";

class CountSelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
            counts:[],
        }


    }
    componentDidMount() {
        let newCounts = [];
        newCounts.push({value:5,label:5});
        newCounts.push({value:10,label:10});
        newCounts.push({value:20,label:20});
        newCounts.push({value:50,label:50});
        newCounts.push({value:100,label:100});
        newCounts.push({value:250,label:250});
        newCounts.push({value:2500,label:"All"});
        this.setState({counts:newCounts});
    }

    handleChange=(e)=>{
        this.props.change(e.value);
    }

    render() {return(
        <div style={{width:'35%',margin:'auto'}}>
            <Select
                placeholder="10"
                options={this.state.counts} // set list of the data
                onChange={this.handleChange} // assign onChange function
            />

        </div>
    )
    }
}

export default CountSelector;