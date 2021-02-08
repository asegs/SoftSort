import React,{Component} from "react";
import {Button} from "reactstrap";
import {Link} from "react-router-dom";

class Validator extends Component{
    constructor(props) {
        super(props);
        this.state = {
            code:this.props.match.params.verification,
            success:false
        }
    }

    async componentDidMount() {
        let url = "/verifyemail/" + this.state.code;
        const response = await fetch(url);
        const body = await response.json();
        this.setState({success:body});
    }

    render() {
        return(
            <div>
                <h2>{this.state.success ? "Verification successful!" : "Verification failed."}</h2>
                <Link to={'/'}><Button color='primary'>Home</Button></Link>
            </div>
        );
    }

}

export default Validator;