import React,{Component} from "react";
import { Button,Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap';
import DeleteModal from "./DeleteModal";
import DatafileCollapse from "./DatafileCollapse";

class UploadKey extends Component{
    constructor(props) {
        super(props);
        this.state={
            mode:0,
            emailText:"",
            passwordText:"",
            nameText:"",
            keyValue:"",
            validEmail:false,
            validName:false,
            files:[],
            sizes:[],
            schema:[],
            comments:[],
            topics:[],
        }
        this.getPass = this.getPass.bind(this);
        this.makeAcc = this.makeAcc.bind(this);
        this.newKey = this.newKey.bind(this);
        this.checkIfEmailValid = this.checkIfEmailValid.bind(this);
        this.checkIfNameValid = this.checkIfNameValid.bind(this);
        this.editCreateEmail = this.editCreateEmail.bind(this);
        this.editCreateName = this.editCreateName.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.getSizes = this.getSizes.bind(this);

    }

    editEmail = (e) =>{
        this.setState({emailText:e.target.value});
    }

    editPass = (e) =>{
        this.setState({passwordText:e.target.value});
    }

    editName = (e) =>{
        this.setState({nameText:e.target.value});
    }

    async checkIfEmailValid(){
        let url = '/emailvalidate/'+this.state.emailText;
        let response = await fetch(url);
        let body = await response.json();
        this.setState({validEmail:body});
    }

    async checkIfNameValid(){
        let url = '/companyvalidate/'+this.state.nameText;
        let response = await fetch(url);
        let body = await response.json();
        this.setState({validName:body});
    }

    async editCreateEmail (e) {
        this.setState({emailText:e.target.value},()=>{
            this.checkIfEmailValid();
        });
    }


    async editCreateName (e) {
        this.setState({nameText:e.target.value},()=>{
            this.checkIfNameValid();
        });
    }

    async getPass() {
        let data = {};
        data['email'] = this.state.emailText;
        data['password'] = this.state.passwordText;
        let response = await fetch('/users',{
            method:'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data),
        });
        let body = await response.json();
        this.setState({keyValue:body},()=>{
            if (this.state.keyValue!=="") {
                this.getFiles();
                this.getSizes();
                this.loadAllSchema();
                this.loadAllComments();
                this.getAllTopics();
            }
        });
    }

    async makeAcc (){
        let data = {};
        data['email'] = this.state.emailText;
        data['password'] = this.state.passwordText;
        data['name'] =this.state.nameText;
        let response = await fetch('/users',{
            method:'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data),
        });
        let body = await response.json();
        this.setState({keyValue:body});
    }

    async newKey (){
        let data = {};
        data['email'] = this.state.emailText;
        data['password'] = this.state.passwordText;
        let response = await fetch('/change',{
            method:'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data),
        });
        let body = await response.json();
        this.setState({keyValue:body});
    }

    changeMode = (e) =>{
        this.setState({mode:parseInt(e.target.value)});
    }

    async getFiles(){
        let url="/softsort/getmysets/"+this.state.keyValue;
        let response = await fetch(url);
        let body = await response.json();
        this.setState({files:body});
    }

    async getSizes(){
        let url = "/getsizes/"+this.state.keyValue;
        let response = await fetch(url);
        let body = await response.json();
        this.setState({sizes:body});
    }

    async deleteFile(name){
        let url="/softsort/deletefile/"+this.state.keyValue+"/"+name.substring(0,name.indexOf(" ("));
        await fetch(url);
        let data = {}
        data['key'] = this.state.keyValue;
        data['name'] = name.substring(0,name.indexOf(" ("));
        data['general'] = name.substring(name.indexOf(" (")+2,name.indexOf(")"));
        await fetch("/adddataset",{
            method:'DELETE',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data),
        });
        await this.getFiles();
        await this.getSizes();
        await this.loadAllSchema();
        await this.loadAllComments();
        await this.getAllTopics();
    }



async loadAllSchema(){
    let url = "/softsort/loadallschema/"+this.state.keyValue;
    const response = await fetch(url);
    const body = await response.json();
    this.setState({schema:body});

}


async loadAllComments(){
    let url = "/softsort/loadallcomments/"+this.state.keyValue;
    const response = await fetch(url);
    const body = await response.json();
    this.setState({comments:body});
}

async getAllTopics(){
        let url = "/softsort/loadalltopics/"+this.state.keyValue;
        const response = await fetch(url);
        const body = await response.json();
        this.setState({topics:body});
}

    render() {
        let keyText = this.state.keyValue!=="" ? this.state.keyValue : ""
        if (this.state.mode===0){
            let files = [];
            if (this.state.files.length===this.state.sizes.length){
                for (let step=0;step<this.state.files.length;step++){
                    let general = this.state.files[step].includes("General");
                    let name = this.state.files[step].substring(0,this.state.files[step].indexOf(" ("));
                    let size = 0;
                    for (let i=0;i<this.state.sizes.length;i++){
                        let sizeArr = this.state.sizes[i];
                        if (sizeArr[2]===general && sizeArr[0]===name){
                            size = sizeArr[1];
                            break;
                        }
                    }
                    files.push(<DeleteModal deleteFile={this.deleteFile} name={this.state.files[step]} size={size}/>);

                }
            }
            let collapses = [];
            if (this.state.schema.length===this.state.comments.length && this.state.schema.length===this.state.topics.length){
                for (let step=0;step<this.state.topics.length;step++){
                    collapses.push(<DatafileCollapse load={this.loadAllComments()} keyText={this.state.keyValue} name={this.state.topics[step]} schemaNames={this.state.schema[step][this.state.schema[step].length-1]} schema={this.state.schema[step].slice(0,this.state.schema[step].length-1)} comments={this.state.comments[step]}/>);
                }
            }
            return (
              <div>
                  <Button color="info" onClick={this.changeMode} value={0}>Account info</Button>{' '}
                  <Button color="info" onClick={this.changeMode} value={1}>Create account</Button>{' '}
                  <Button color="info" onClick={this.changeMode} value={2}>Get new key</Button><br/><br/>
                  <Form>
                      Email: <Input type={"text"} onChange={this.editEmail}/><br/>
                      Password: <Input type={"password"} onChange={this.editPass}/><br/>
                      <Button color="info" onClick={this.getPass}>Load info!</Button>
                  </Form>
                  <p>Your key:</p>
                  <p>{keyText}</p>
                  <p>Your files:</p>
                  {files}
                  <p>Clarify your datasets below:</p>
                  {collapses}
              </div>
            );
        }
        if (this.state.mode===1){
            let validEmailFeedback = this.state.validEmail ?<div><Input onChange={this.editCreateEmail}  valid /><FormFeedback valid>Sweet! That email is available</FormFeedback></div> : <div><Input onChange={this.editCreateEmail} invalid /><FormFeedback invalid>Sorry, that email is taken</FormFeedback></div>;
            let validNameFeedback = this.state.validName ?<div><Input onChange={this.editCreateName} valid /><FormFeedback valid>Sweet! That name is available</FormFeedback></div> : <div><Input onChange={this.editCreateName} invalid /><FormFeedback invalid>Sorry, that name is taken</FormFeedback></div>;
            return (
              <div>
                  <Button color="info" onClick={this.changeMode} value={0}>Account info</Button>{' '}
                  <Button color="info" onClick={this.changeMode} value={1}>Create account</Button>{' '}
                  <Button color="info" onClick={this.changeMode} value={2}>Get new key</Button><br/><br/>
                  <Form>
                      <FormGroup>
                          <Label>Company name:</Label>
                          {validNameFeedback}
                      </FormGroup>
                      <FormGroup>
                          <Label for="exampleEmail">Email:</Label>
                          {validEmailFeedback}
                      </FormGroup>
                      <FormGroup>
                          <Label for="password">Password:</Label>
                          <Input
                              onChange={this.editPass}
                              type="password"
                              name="password"
                              id="password"
                          />
                      </FormGroup>
                      <FormGroup>
                          <Button color="info" onClick={this.makeAcc}>Make account and get key!</Button>
                      </FormGroup>
                  </Form>
                  <p>Your key:</p>
                  <p>{keyText}</p>
              </div>
            );
        }
        if (this.state.mode===2){
            return (
                <div>
                    <Button color="info" onClick={this.changeMode} value={0}>Account info</Button>
                    <Button color="info" onClick={this.changeMode} value={1}>Create account</Button>
                    <Button color="info" onClick={this.changeMode} value={2}>Get new key</Button><br/><br/>
                    <Form>
                        Email: <Input type={"text"} onChange={this.editEmail}/><br/>
                        Password: <Input type={"password"} onChange={this.editPass}/><br/>
                        <Button color="info" onClick={this.newKey}>Get a new key!</Button>
                    </Form>
                    <p>Your key:</p>
                    <p>{keyText}</p>
                </div>
            );
        }
    }
}

export default UploadKey;