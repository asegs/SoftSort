import React,{Component} from 'react';
import TopicSelector from './TopicSelector.js';
import FormElement from "./FormElement";
import DetailPopover from "./DetailPopover";
import CompanySelector from "./CompanySelector";
import GeneralPopover from "./GeneralPopover";
import LocPicker from "./LocPicker";
import {Button, Input} from "reactstrap";
import CountSelector from "./CountSelector";

//Add a 'last queried' option so match percentages don't auto update

class Form extends Component{
    constructor(props) {
        super(props);
        this.state = {
            company:"",
            topics:[],
            topic:"",
            titles:[],
            options:[],
            isLoading:true,
            choices:[],
            weights:[],
            count:"10",
            results:[],
            isQuerying:false,
            form:[],
            counts:[],
            urlString:"",
            minMax:[],
            comments:[],
            choicesAssigned:false,
            validName:true,
            hideDuplicateNames:false,
            isPrivate:false,
            unlocked:true,
            enteredPass:"",
            unlockMessage:""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitGo = this.handleSubmitGo.bind(this);
        this.generalQuery = this.generalQuery.bind(this);
        this.generalHandler = this.generalHandler.bind(this);
        this.setIsPrivate = this.setIsPrivate.bind(this);
        this.unlock = this.unlock.bind(this);
        this.ultimateLoader = this.ultimateLoader.bind(this);

    }

    async handleSubmitGo(event) {
        this.setState({isQuerying:true})
        event.preventDefault();
        let countValid = !isNaN(this.state.count) && this.state.count<= 2500 && this.state.count!=="";
        let data = {};
        let formattedChoices = [];
        for (let step=0;step<this.state.choices.length;step++){
            if (Array.isArray(this.state.choices[step])){
                formattedChoices.push(this.state.choices[step])
            }
            else if (this.state.choices[step].includes("<M>")){
                let replace = this.state.choices[step].replaceAll("<M>","");
                formattedChoices.push(replace.split("n"));
            }
            else{
                let replace = this.state.choices[step].replaceAll("<L>","");
                formattedChoices.push(replace.split(":"));
            }
        }
        data['topic'] = this.state.topic;
        data['choices'] = formattedChoices;
        data['weights'] = this.state.weights;
        data['count'] = countValid ? parseInt(this.state.count) : 10;
        data['company'] = this.state.company;
        data['duplicates'] = this.state.hideDuplicateNames.toString();
        const response = await fetch('/query', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        let newResults = [];
        for (let step=0;step<body.length;step++){
            newResults.push(body[step]);
        }
        this.setState({results:newResults,isQuerying:false},()=>{
            window.scrollBy(0, 0.8*window.innerHeight);
        });
    }

    async handleSubmit(event) {
        this.setState({isQuerying:true})
        event.preventDefault();
        let countValid = !isNaN(this.state.count) && this.state.count<2500 && this.state.count!=="";
        let data = {};

        data['topic'] = this.state.topic;
        data['choices'] = this.state.choices;
        data['weights'] = this.state.weights;
        data['count'] = countValid ? this.state.count : '10';
        data['company'] = this.state.company;
        data['duplicates'] = this.state.hideDuplicateNames.toString();
        const response = await fetch('/softsort/query', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        let newResults = [];
        for (let step=0;step<body.length;step++){
            newResults.push(body[step]);
        }
        this.setState({results:newResults,isQuerying:false},()=>{
            window.scrollBy(0, 0.8*window.innerHeight);
        });
    }

    async topicsDidMount(){
        if (this.state.company!==""){
            let url = '/softsort/topics/'+this.state.company;
            const response = await fetch(url);
            const body = await response.json();
            let dbTopics = [];
            for (let step=0;step<body.length;step++){
                dbTopics.push({value:body[step],label:body[step]})
            }
            this.setState({topics:dbTopics},()=>{
                if (this.state.topics.length===0){
                    this.setState({validName:false,company:""});
                }
            })
        }
    }

    async setIsPrivate(){
        let url = "/isprivate/"+this.state.company+"/"+this.state.topic;
        const response = await fetch(url);
        let body = await response.json();
        this.setState({isPrivate:body},()=>{
            if (!this.state.isPrivate){
                this.loadTopic();
                this.setState({unlocked:true});
            }
            else{
                this.setState({unlocked:false});
            }
        });
    }

    async countsDidMount(){
        let url = '/softsort/schemacount/'+this.state.company+'/'+this.state.topic;
        let newCountOptions = [];
        const response = await fetch(url);
        const body = await response.json();
        for (let i=0;i<body.length;i++){
            newCountOptions.push([]);
            for (let b=0;b<body[i].length;b++){
                newCountOptions[i].push(body[i][b]);
            }
        }
        this.setState({counts:newCountOptions});
    }

    async schemaDidMount() {
        let url = '/softsort/schema/'+this.state.company+'/'+this.state.topic;
        let blankArrWeights = [];
        let blankArrOptions = [];
            const response = await fetch(url);
            const body = await response.json();
            let headers = body[body.length-1];
            let dbOptions = [];
        for (let step=0;step<body.length-1;step++){
            let tempArr = [];
            for (let subStep=0;subStep<body[step].length;subStep++){
                tempArr.push(body[step][subStep]);
            }

            dbOptions.push(tempArr);
        }
        let headerOptions = [];
        if (headers!=null) {
            for (let step = 0; step < headers.length; step++) {
                headerOptions.push(headers[step]);
                blankArrWeights.push(1);
                if (headers[step].includes("<M>")){
                    blankArrOptions.push("<M>1n1n1n3<M>");
                }
                else {
                    blankArrOptions.push(["<*3"]);
                }

            }
        }
        this.setState({titles:headerOptions,options:dbOptions,isLoading:false,choices:blankArrOptions,weights:blankArrWeights,comments:[]});
    }

    async urlDidMount(){
        let urlUrl = '/softsort/url/'+this.state.company+'/'+this.state.topic;
        const urlResponse = await fetch(urlUrl);
        const urlBody = await urlResponse.json();
        this.setState({urlString:urlBody});
    }

    async ultimateLoader(){
        let topicUrl = '/softsort/loadtopic/'+this.state.company+'/'+this.state.topic;
        const response = await fetch(topicUrl,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(this.state.enteredPass),
        });
        const body = await response.json();
        if(body.length===0){
            this.setState({unlockMessage:"Incorrect password."});
            return;
        }
        let typeCount = -1;
        let newSchema = [];
        let newCount = [];
        let newMinMax = [];
        let newUrl = "";
        let newComments = [];
        for (let step=0;step<body.length;step++){
            if (!Array.isArray(body[step])){
                typeCount++;
            }
            else{
                switch (typeCount){
                    case 0:
                        newSchema.push(body[step]);
                        break;
                    case 1:
                        newCount.push(body[step]);
                        break;
                    case 2:
                        newMinMax.push(body[step]);
                        break;
                    case 3:
                        newUrl=body[step];
                        break;
                    case 4:
                        newComments.push(body[step]);
                        break;
                }
            }
        }
        let blankArrWeights = [];
        let blankArrOptions = [];
        let headers = newSchema[newSchema.length-1];
        let dbOptions = [];
        for (let step=0;step<newSchema.length-1;step++){
            let tempArr = [];
            for (let subStep=0;subStep<newSchema[step].length;subStep++){
                tempArr.push(newSchema[step][subStep]);
            }

            dbOptions.push(tempArr);
        }
        let headerOptions = [];
        if (headers!=null) {
            for (let step = 0; step < headers.length; step++) {
                headerOptions.push(headers[step]);
                blankArrWeights.push(1);
                if (headers[step].includes("<M>")){
                    blankArrOptions.push("<M>1n1n1n3<M>");
                }
                else {
                    blankArrOptions.push(["<*3"]);
                }

            }
        }
        let newCountOptions = [];
        for (let i=0;i<newCount.length;i++){
            newCountOptions.push([]);
            for (let b=0;b<newCount[i].length;b++){
                newCountOptions[i].push(newCount[i][b]);
            }
        }
        this.setState({counts:newCountOptions,minMax:newMinMax,urlString:newUrl,titles:headerOptions,options:dbOptions,isLoading:false,choices:blankArrOptions,weights:blankArrWeights,comments:this.state.company==="General" ? [] : newComments[0],unlocked:true});

    }

    loadTopic=()=>{
        this.ultimateLoader();
    }

    setTopic = (topic) => {
        this.setState({topic:topic,counts:[],minMax:[],urlString:"",results:[]}, function () {
            this.setIsPrivate();
        });
    }

    updatePass = (e) =>{
        this.setState({enteredPass:e.target.value});
    }

    async unlock(){
        let url = "/datasetlogin/"+this.state.company+"/"+this.state.topic;
        let data = {};
        data['password'] = this.state.enteredPass;
        let response = await fetch(url,{
            method:'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data),
        });
        let body = await response.json();
        this.setState({unlocked:body},()=>{
            if (this.state.unlocked){
                this.loadTopic();
                this.setState({unlockMessage:""})
            }
            else{
                this.setState({unlockMessage:"Incorrect password."})
            }
        });
    }

    changeWeight = (id,newWeight)=>{
        let newWeights = this.state.weights;
        newWeights[id] = parseFloat(newWeight);
        this.setState({weights:newWeights});
    }

    handleCountChange = e =>{
        this.setState({count:e});
    }

    changeOption = (id,newOption)=>{
        let newOptions = this.state.choices;
        if (Array.isArray(newOption)&&newOption.length===0){
            newOption=["<*3"];
        }
        newOptions[id] = newOption;
        this.setState({choices:newOptions});
    }

    changeCompany = (company)=>{
        this.setState({company:company,titles:[],topic:"",topics:[]},()=>{
            this.topicsDidMount();
        });
    }

    async generalQuery(event){
        this.setState({isQuerying:true})
        event.preventDefault();
        let countValid = !isNaN(this.state.count) && this.state.count<2500 && this.state.count!=="";
        let data = {};
        data['topic'] = this.state.topic;
        data['choices'] = this.state.choices;
        data['weights'] = this.state.weights;
        data['count'] = countValid ? this.state.count : '10';
        data['company'] = "General";
        data['duplicates'] = false
        const response = await fetch('/softsort/generalquery', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        let newResults = [];
        for (let step=0;step<body.length;step++){
            newResults.push(body[step]);
        }
        this.setState({results:newResults,isQuerying:false});
    }

    async generalHandler(event){
        if (this.state.company==="General"){
            await this.generalQuery(event);
        }
        else{
            await this.handleSubmitGo(event);
        }
    }

    async getMinMax(){
        let url = '/softsort/getminmax/'+this.state.company+'/'+this.state.topic;
        const response = await fetch(url);
        const body = await response.json();
        this.setState({minMax:body});
    }

    handleShowDuplicatesChange=(e)=>{
        let oldBool =
        this.setState({hideDuplicateNames:!this.state.hideDuplicateNames});
    }

    removeDetail=(num)=>{
        let newResults = this.state.results;
        newResults.splice(num,1);
        this.setState({results:newResults});
    }

    render() {
        const isMobile = window.innerWidth <= 500;
        let width = isMobile ? 100 : 60;
        try{
            if (this.state.company.length===0&&this.state.validName&&this.props.match.params.company.length>0) {
                this.changeCompany(this.props.match.params.company.replaceAll("$"," "));
            }
        }
        catch (e){
            ;
        }
        let checkbox = [];
        if (this.state.company!=="General"){
            checkbox.push(" ");
            checkbox.push(<input type={"checkbox"} onChange={this.handleShowDuplicatesChange}/>);
            checkbox.push("  Hide duplicates")
        }
        if (this.state.company===""){
            return (<div>
                <h3>Search from:</h3>
                <CompanySelector company={this.state.company} setCompany={this.changeCompany}/>
                <br/>
                <GeneralPopover code={"All"} title={"What does this mean?"} body={"Choose the company to search subtopics (ie. Laptops, Shoes, etc.) of.  Select 'general' to view topics from every company at once."}/>
            </div>)
        }
        if (this.state.topic==="") {
            return (
                <div>
                <h3>Search from:</h3>
                    <CompanySelector company={this.state.company} setCompany={this.changeCompany}/><br/>
                    <h3>Find your perfect:</h3>
                    <br/>
                <TopicSelector topics={this.state.topics} setTopic={this.setTopic}/>
                <br/>
                    <GeneralPopover code={"Topic"} title={"What does this mean?"} body={"Choose a topic that this company has posted to Softsort.  Alternatively, select another company to view their topics."}/>
                </div>
            )
        }
        else if(this.state.counts.length>0&&this.state.minMax.length>0&&(this.state.comments.length>0||this.state.company==="General")){
            const items = [];
            let choicesCount = 0;
            let newBlankArrOptions = [];
            for (let step=0;step<this.state.titles.length;step++){
                let nameComment = "";
                let comments = [];
                if (this.state.company!=="General"){
                    nameComment = this.state.comments[this.state.comments.length-1][step];
                }
                if (this.state.titles[step].includes("<M>")){
                    if (!this.state.choicesAssigned) {
                        newBlankArrOptions.push("<M>"+this.state.minMax[step][0]+"n"+this.state.minMax[step][1]+"n5n3<M>");
                    }
                    items.push(<div><FormElement general={this.state.company==="General"} nameComment={nameComment} minMax={this.state.minMax[step]} counts = {this.state.counts[step]} changeOption = {this.changeOption} changeWeight = {this.changeWeight} num={step} options={undefined} name={this.state.titles[step]} text={0}/></div>);
                }
                else if (this.state.titles[step].includes("<L>")){
                    if (!this.state.choicesAssigned) {
                        newBlankArrOptions.push("<L>0:0:6000<L>");
                    }
                    items.push(<div><FormElement general={this.state.company==="General"} nameComment={nameComment} minMax={this.state.minMax[step]} counts = {this.state.counts[step]} changeOption = {this.changeOption} changeWeight = {this.changeWeight} num={step} options={undefined} name={this.state.titles[step]} text={2}/></div>);
                }
                else {
                    let comments =[];
                    if (this.state.company!=="General"){
                        comments = this.state.comments[step];
                    }
                    newBlankArrOptions.push(this.state.choices[step]);
                    items.push(<div><FormElement general={this.state.company==="General"} nameComment={nameComment} comments={comments} minMax={this.state.minMax[step]} counts = {this.state.counts[step]} changeOption = {this.changeOption} changeWeight = {this.changeWeight} num={step} options={this.state.options[choicesCount]} name={this.state.titles[step]} text={1}/></div>);
                    choicesCount++;
                }
                if (!this.state.choicesAssigned){
                    this.setState({choices:newBlankArrOptions,choicesAssigned:true});
                }


            }
            let resultsDisplay = [];
            //look at file size first to est query time!
            if (this.state.isQuerying){
                    resultsDisplay = [<p>Querying engine...</p>];
            }
            else {
                resultsDisplay = [];
                for (let step = 0; step < this.state.results.length; step++) {
                    resultsDisplay.push(<DetailPopover remove={this.removeDetail} num={step} minMax={this.state.minMax} url={this.state.urlString} company={this.state.company} choices = {this.state.choices} name={this.state.results[step][1]} id={this.state.results[step][0]} values={this.state.results[step].slice(2)} schema={this.state.titles}/>);
                }
            }
            return (
                <div>
                    <h3>Search from:</h3>
                    <CompanySelector company={this.state.company} setCompany={this.changeCompany}/><br/>
                    <h3>Find your perfect:</h3><br/>
                    <TopicSelector topics={this.state.topics} setTopic={this.setTopic}/>
                    <br/>
                    <GeneralPopover code={"Selection"} title={"What's all this?"} body={"Choose your preferred value from drop down categories, and select a weight.  This represents the percentage you want to value this choice at.  For example, a weight of 1 means 100% of the normal value, a weight of 0.25 means 25% of the normal value, and a weight of 2.5 means 250% of the normal value.  For numeric inputs, choose the minimum value you would consider 100% satisfied, the maximum value that you would consider 100% satisfied, the harshness of how you accept values outside of your range, and if you prefer values higher than, lower than, or just inside of your range.  Then, select the number of results you want and click Go!"}/>
                    {items}
                    <label htmlFor={"count"}>Results wanted:</label>
                    <CountSelector change={this.handleCountChange}/>
                    {checkbox}<br/><br/>
                    <input type={"submit"} value={"Go!"} onClick={this.generalHandler} style={{backgroundColor: '#85bcea',padding: '10px 32px',cursor: 'pointer',borderRadius:"10px"}}/>
                    <br/><br/>
                    {resultsDisplay}

                </div>
            )
        }
        else if(!this.state.unlocked){
            let passwordEntry = <Input style={{width:'80%',margin:'auto'}} type={"text"} value={this.state.enteredPass} onChange={this.updatePass}/>;
            let passwordSubmit = <Button color="info" onClick={this.ultimateLoader}>Unlock</Button>
            let unlockMsg = this.state.unlockMessage.length>0 ? <p style={{color:"red"}}>{this.state.unlockMessage}</p> : ""
            return (
                <div>
                    <h3>Search from:</h3>
                    <CompanySelector company={this.state.company} setCompany={this.changeCompany}/><br/>
                    <h3>Find your perfect:</h3>
                    <br/>
                    <TopicSelector topics={this.state.topics} setTopic={this.setTopic}/>
                    <br/>
                    <GeneralPopover code={"Selector"} title={"What does this mean?"} body={"Choose a topic that this company has posted to Softsort.  Alternatively, select another company to view their topics."}/>
                    <p style={{color:"red"}}>This dataset is locked by the company that uploaded it.  Please enter your password below.</p>
                    {passwordEntry}<br/>
                    {passwordSubmit}
                    {unlockMsg}
                </div>
            );
        }
        else{
            return (
                <div>
                    <h3>Search from:</h3>
                    <CompanySelector company={this.state.company} setCompany={this.changeCompany}/><br/>
                    <h3>Find your perfect:</h3>
                    <br/>
                    <TopicSelector topics={this.state.topics} setTopic={this.setTopic}/>
                    <br/>
                    <GeneralPopover code={"Selector"} title={"What does this mean?"} body={"Choose a topic that this company has posted to Softsort.  Alternatively, select another company to view their topics."}/>
                </div>
            );
        }
    }
}


export default Form;