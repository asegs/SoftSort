import React,{Component} from "react";
import Label, {Button, PopoverHeader} from "reactstrap";
import Title from './Title';
import TopicSelector from "./TopicSelector";
import GeneralPopover from "./GeneralPopover";
import SchemaClarification from './SchemaClarification';
import {Input} from "reactstrap";
class DataUpload extends Component{
    constructor(props) {
        super(props);
        this.state={
            title:"",
            file:undefined,
            uploadKey:"",
            info:"",
            titles:[],
            examples:[],
            generalUp:false,
            generalTopics:[],
            generalTopic:"",
            schemaString:"",
            matchHeader:false,
            successful:0,
            columnNamesShowing:false,
            myTopics:[],
            myCurrentTopic:"",
            company:"",
            schemaArr:[],
            minMax:[],
            advancedSchema:[],
            format:"",
            privateSet:false,
            privatePass:""
        }
        this.upload = this.upload.bind(this);
        this.counter = this.counter.bind(this);
        this.editTitle = this.editTitle.bind(this);
        this.submitAuto = this.submitAuto.bind(this);
        this.submitGeneral = this.submitGeneral.bind(this);
        this.getTopicsFromKey = this.getTopicsFromKey.bind(this);
        this.getMySchema = this.getMySchema.bind(this);
        this.getMinMax = this.getMinMax.bind(this);
        this.submitNewAdvancedSchema = this.submitNewAdvancedSchema.bind(this);
        this.dbUpdate = this.dbUpdate.bind(this);
    }

    updateTitle = (e) =>{
        this.setState({title:e.target.value});
    }

    updateFile = (e) =>{
        this.setState({file:e.target.files[0],info:"Get required titles"});
    }

    changeKey = (e) =>{
        this.setState({uploadKey:e.target.value});
    }

    changePrivatePass = (e) =>{
        this.setState({privatePass:e.target.value});
    }

    async upload(){
        if (this.state.file.size>75000000){
            this.setState({successful:1});
        }
        else {
            let formData = new FormData;
            let formattedName = this.state.title.replaceAll("/","");
            formattedName = formattedName.replaceAll(".","");
            formData.append("dataFile", this.state.file);
            formData.append("name",formattedName);
            formData.append("key", this.state.uploadKey);
            let response = await fetch('/softsort/upload', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: formData,
            });
            let body = await response.json();
            if (body) {
                this.setState({successful: 2});
            } else {
                this.setState({successful: 1});
            }
        }


    }

    async getGeneralTopics(){
        let response = await fetch('/softsort/generalcats');
        let body = await response.json();
        let newTopics = [];
        for (let step=0;step<body.length;step++){
            newTopics.push(({value:body[step],label:body[step]}));
        }
        this.setState({generalTopics:newTopics});
    }

    async dbUpdate(){
        let data = {};
        data['password'] = this.state.privatePass;
        data['key'] = this.state.uploadKey;
        data['name'] =this.state.title;
        data['general'] = this.state.generalUp
        await fetch('/adddataset',{
            method:'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data),
        });
    }

    async counter(){
        let formData = new FormData;
        formData.append("dataFile",this.state.file);
        let response = await fetch('/softsort/titlescount',{
            method:'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:formData,
        });
        let body = await response.json();
        this.setTitles(body);
    }

    editTitle(num,text){
        let newTitles = this.state.titles;
        newTitles[num] = text;
        this.setState({titles:newTitles});
    }
    setTitles = (body) =>{
        let blankTitles = [];
        let exampleTitles = [];
        for (let i=0;i<body.length;i++){
            blankTitles.push("");
            exampleTitles.push(body[i]);
        }
        this.setState({titles:blankTitles,examples:exampleTitles});
    }

    async submitAuto(){
        let formData = new FormData;
        formData.append("dataFile",this.state.file);
        formData.append("name",this.state.title);
        formData.append("key",this.state.uploadKey);
        formData.append("titles",this.state.titles);
        formData.append("headers",this.state.columnNamesShowing)
        formData.append("format",this.state.format);
        let response = await fetch('/softsort/autoschema',{
            method:'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:formData,
        });
        let body = await response.json();
        if (body){
            this.setState({successful:2});
        }
        else{
            this.setState({successful:1});
        }
        await this.dbUpdate();
    }

    toggleGeneralHeader=()=>{
        this.setState({generalUp:!this.state.generalUp},()=>{
            if (this.state.generalUp){this.getGeneralTopics();
            this.setState({privateSet:false})}
        });
    }

    selectGeneralTopic=(topic)=>{
        this.setState({generalTopic:topic},()=>{
            this.getGeneralSchemaForTopic();
        });
    }

    async getMinMax(){
        let url = '/softsort/getminmax/'+this.state.company+'/'+this.state.myCurrentTopic;
        const response = await fetch(url);
        const body = await response.json();
        this.setState({minMax:body});
    }

    selectMyCurrentTopic=(topic)=>{
        this.setState({myCurrentTopic:topic},()=>{
            this.getMySchema();
            this.getMinMax();
        });
    }

    async getGeneralSchemaForTopic(){
        if (this.state.generalTopic===""||this.state.generalTopic===undefined){
            return;
        }
        let url = '/softsort/generalschema/'+this.state.generalTopic;
        let response = await fetch(url);
        let body = await response.json();
        let schema = "ID, Name, "+body.join(", ")
        this.setState({schemaString:schema});
    }

    toggleMatchHeader=()=>{
        this.setState({matchHeader:!this.state.matchHeader});
    }

    async submitGeneral(){
        let formData = new FormData;
        formData.append("dataFile",this.state.file);
        formData.append("name",this.state.generalTopic);
        formData.append("key",this.state.uploadKey);
        formData.append("headers",this.state.columnNamesShowing)
        formData.append("format",this.state.format);
        let response = await fetch('/softsort/generaldata',{
            method:'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:formData,
        });
        let body = await response.json();
        if (body){
            this.setState({successful:2});
        }
        else{
            this.setState({successful:1});
        }
        await this.dbUpdate();
    }

    toggleColumnNames=()=>{
        this.setState({columnNamesShowing:!this.state.columnNamesShowing});
    }

    async getTopicsFromKey(){
        let url = "/softsort/gettopicsbykey/"+this.state.uploadKey;
        const response = await fetch(url);
        const body = await response.json();
        let newTopics = [];
        for (let step=0;step<body[0].length;step++){
            newTopics.push(({value:body[0][step],label:body[0][step]}));
        }
        this.setState({myTopics:newTopics,company:body[1][0]});
    }

    async getMySchema(){
        let url = '/softsort/schema/'+this.state.company+'/'+this.state.myCurrentTopic;
        let blankArrWeights = [];
        let blankArrOptions = [];
        const response = await fetch(url);
        const body = await response.json();
        this.setState({schemaArr:body});
    }

    changeAPIFormat=(e)=>{
        this.setState({format:e.target.value});
    }

    changeAdvancedAtIndex=(num,newValue,index)=>{
        let newAdvanced = [];
        for (let step=0;step<this.state.advancedSchema.length;step++){
            let row = this.state.advancedSchema[step];
            if (step===num){
                row[index] = newValue;
            }
            newAdvanced.push(row);
        }
        this.setState({advancedSchema:newAdvanced})
    }

    async submitNewAdvancedSchema(){
        let url = "/softsort/uploadadvancedschema/"+this.state.myCurrentTopic;
        let data = {};
        data['schema'] = this.state.advancedSchema;
        data['key'] = this.state.uploadKey;
        data['format'] = this.state.format;
        let response = await fetch(url,{
            method:'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data),
        });
    }

    togglePrivateSet=()=>{
        this.setState({privateSet:!this.state.privateSet})
    }





    render() {
        let generalSection = [];
        let feedback = [];
        if (this.state.generalUp){
            if (this.state.generalTopics.length>0){
                generalSection.push(<p>Generalized for:</p>)
                generalSection.push(<TopicSelector topics={this.state.generalTopics} setTopic={this.selectGeneralTopic}/>);
            }
            if (this.state.generalTopic!==""){
                generalSection.push(<p>This is the official schema for {this.state.generalTopic}:</p>)
                generalSection.push(<p>{this.state.schemaString}</p>)
                generalSection.push(<div><form>My data matches this form: <input type="checkbox" onChange={this.toggleMatchHeader}/></form></div>)
            }
            if (this.state.matchHeader){
                generalSection.push(<Button color="info" onClick={this.submitGeneral}>Submit general data to {this.state.generalTopic}</Button>)
            }
        }
        if (this.state.successful===2){
            feedback.push(<p style={{color:"green"}}>Uploaded!</p>);
        }
        if (this.state.successful===1){
            feedback.push(<p style={{color:"red"}}>Failed!</p>);
        }
        let autoGenSection = this.state.info!=="" ? <div><p>Autogenerate schema</p><GeneralPopover code={"Autogen"} title={"What is autogeneration?"} body={"Autogeneration allows the computer to create schema for your data just by reading it!  It will be added to your company schema and data log immediately upon upload."}/><Button color="info" onClick={this.counter}>{this.state.info}</Button></div> : "";
        let titles = [];
        if (this.state.titles.length>0){
            titles.push(<p>Tag math elements with a &lt;M>, this will not be shown to sorters!</p>);
        }
        for (let step=0;step<this.state.titles.length;step++){
            titles.push(<div><Title title={this.state.examples[step]} editTitle={this.editTitle} num={step}/><br/></div>);
        }
        let titlesAllFull = this.state.titles.length > 0;
        for (let step=0;step<this.state.titles.length;step++){
            if (this.state.titles[step]===""){
                titlesAllFull = false;
            }
        }
        if (this.state.columnNamesShowing){
            titles = [];
            autoGenSection = this.state.info!=="" ? <div><p>Autogenerate schema</p><GeneralPopover code={"Autogen"} title={"What is autogeneration?"} body={"Autogeneration allows the computer to create schema for your data just by reading it!  It will be added to your company schema and data log immediately upon upload."}/></div> : "";


        }
        let privacyCheck = [];
        if (!this.state.generalUp){
            privacyCheck.push(<div>Private: <Input addon type="checkbox" aria-label="Checkbox for following text input"  onChange={this.togglePrivateSet}/></div>)
            privacyCheck.push(<br/>);
        }
        let privacyKey = [];
        if (!this.state.generalUp&&this.state.privateSet){
            privacyCheck.push(<div>Password: <Input style={{width:'80%',margin:'auto'}} type={"text"} value={this.state.privatePass} onChange={this.changePrivatePass}/></div>)
            privacyCheck.push(<br/>);
        }
    let autoSubmit = <p> </p>;
        if (titlesAllFull || this.state.columnNamesShowing){
            autoSubmit = <Button color="info" onClick={this.submitAuto}>Autogenerate schema and upload!</Button>
        }
        let upgradeInfo = <p>Enter your key to see your schema</p>;
        if (this.state.uploadKey.length>0&&this.state.myTopics.length===0){
            this.getTopicsFromKey();
        }
        if(this.state.myTopics.length>0){
            upgradeInfo = <TopicSelector topics={this.state.myTopics} setTopic={this.selectMyCurrentTopic}/>
        }

        return(
          <div>
              <h5>Data must be formatted exactly this way:</h5>
              <p>ID1,Name1,Attrib1,Attrib2,Attrib3....</p>
              <p>ID2,Name2,Attrib4,Attrib5,Attrib6....</p>
              <p>ID3,Name3,Attrib7,Attrib8,Attrib9....</p>
              <p>etc....</p>
              <form>
                  Topic:<Input style={{width:'50%',margin:'auto'}} type={"text"} onChange={this.updateTitle}/><br/>
                  <input type={"file"} onChange={this.updateFile}/><br/>
                  This has column names already written in:&nbsp;
                  <Input addon type="checkbox" aria-label="Checkbox for following text input"  onChange={this.toggleColumnNames}/><br/>
                  Key: <Input style={{width:'80%',margin:'auto'}} type={"text"} onChange={this.changeKey}/><br/><br/>
                  {privacyCheck}
                  {privacyKey}
                  {/*<Button color="info" onClick={this.upload}>Upload data</Button><br/>*/}
                  This is generalized data:
                  <input type="checkbox" onChange={this.toggleGeneralHeader}/>
                  <GeneralPopover code={"Generals"} title={"What is general data?"} body={"General data is formatted specifically by Softsort, with standardized column names for a certain type of product.\n" +
                  "                    For example, the standardized data for computers requires a certain order (ID,Name,CPU,RAM,GPU..etc).\n" +
                  "                    If you format your data as general, it will be tagged in a special way by our system and shown to customers searching these general categories, not just your store!"}/>
                  {generalSection}
              </form>
              API Format Instructions (optional): <Input style={{width:'40%',margin:'auto'}} type={"text"} onChange={this.changeAPIFormat}/>
              <GeneralPopover code={"Format"} body={"If you already have a website with postings of your inventory accessible by ID, you can use that here!  Enter an example link to one of your items in this category, where <I> represents the place of the items ID. For example www.companyname/products/<I>"} title={"What does this mean?"}/>
              {autoGenSection}
              {titles}
              {autoSubmit}
              {feedback}
              {/*<p>Upgrade my schemas:</p>*/}
              {/*{upgradeInfo}*/}
              {/*{schemaRefinements}*/}
          </div>
        );
    }
}

export default DataUpload;
