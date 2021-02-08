import React,{Component} from "react";

class Title extends Component{
    constructor(props) {
        super(props);
    }

    handleChange = (e) =>{
        this.props.editTitle(this.props.num,e.target.value);
    }

    render() {
        return(
          <div>
              <form>
                  eg. {this.props.title}  <input type="text" placeholder="Title" onChange={this.handleChange}/>
              </form>
          </div>
        );
    }

}
export default Title;