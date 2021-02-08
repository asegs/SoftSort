import React,{Component} from 'react';
import Select from 'react-select';

class TopicSelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
            topics:this.props.topics
        }


    }

    handleChange = e =>{
        this.props.setTopic(e.value);
    }


    render() {
            return (
                <div style={{width:'50%',margin:'auto'}}>
                    <Select
                        placeholder="Select topic"
                        options={this.props.topics} // set list of the data
                        onChange={this.handleChange} // assign onChange function
                    />

                </div>
            );
    }
}
export default TopicSelector