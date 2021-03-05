import React,{Component} from "react";
import APIUploader from "./APIUploader";

class APIWrapper extends Component{
    constructor(props) {
        super(props);

    }
    render() {
        return(
            <p>{APIUploader(undefined,"Test","0xc254a30c6d0e27ef1ab1a7b04ff0319bc34b0f3dc4cae671a3063067c97a4c5a","noformat",[],true,false)}</p>
        )
    }
}

export default APIWrapper;