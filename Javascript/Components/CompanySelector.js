import React,{Component} from 'react';
import Select from 'react-select';

class CompanySelector extends Component{
    constructor(props) {
        super(props);
        this.state = {
            companies:[],
            isLoading: true
        }


    }

    handleChange = e =>{
        this.props.setCompany(e.value);
    }

    async componentDidMount(){
        const response = await fetch('/softsort/companies');
        const body = await response.json();
        let dbComps = [];
        for (let step=0;step<body.length;step++){
            dbComps.push({value:body[step],label:body[step]})
        }
        this.setState({companies:dbComps,isLoading:false})

    }

    render() {
        if (!this.state.isLoading) {
            return (
                <div style={{width:'50%',margin:'auto'}}>
                    <Select
                        placeholder={this.props.company==="" ? "Select option" : this.props.company}
                        options={this.state.companies} // set list of the data
                        onChange={this.handleChange} // assign onChange function
                    />

                </div>
            );
        }
        else{
            return (
                <p>Loading...</p>
            )
        }
    }
}
export default CompanySelector;