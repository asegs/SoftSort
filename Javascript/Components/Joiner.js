import React,{Component} from "react";
import {Button, Input} from "reactstrap";
import {saveAs} from 'file-saver';

class Joiner extends Component{
    constructor(props) {
        super(props);
        this.state={
            files:[],
            titles:[],
            merges:[],
            selectedKey: undefined,
            selectedLock:undefined,
            selectedChild: []
        }
        this.sendFiles = this.sendFiles.bind(this);
        this.submitMerges = this.submitMerges.bind(this);
    }



    updateFile=(e)=>{
        let newFiles = this.state.files;
        let prevNames = [];
        for (let step=0;step<this.state.files.length;step++){
            prevNames.push(this.state.files[step].name);
        }
        for (let step=0;step<e.target.files.length;step++){
            if (!prevNames.includes(e.target.files[step].name)){
                newFiles.push(e.target.files[step]);
                prevNames.push(e.target.files[step].name);
            }
        }
        this.setState({files:newFiles});
    }

    removeFile=(i)=>{
        let newFiles = this.state.files;
        newFiles.splice(i,1);
        this.setState({files:newFiles});
    }

    async sendFiles(){
        let formData = new FormData;
        for (let step=0;step<this.state.files.length;step++){
            formData.append("file"+step,this.state.files[step])
        }
        let response = await fetch('/firstlines', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData,
        });
        let body = await response.json();
        this.setState({titles:body['lines']});
    }

    select=(fileNum,index)=>{
        let location = this.foundInSelectedChildren(fileNum,index);
        if (this.state.selectedKey===undefined){
            this.setState({selectedKey:{'file':fileNum,'index':index}});
        }
        else if (this.state.selectedKey['file']===fileNum && this.state.selectedKey['index']===index){
            this.cancel();
        }
        else if(this.state.selectedLock===undefined){
          this.setState({selectedLock:{'file':fileNum,'index':index}})  ;
        } else if (this.state.selectedLock['file']===fileNum && this.state.selectedLock['index']===index){
            this.setState({selectedLock:undefined,selectedChild:[]});
        }
        else if (location!==-1){
            let newChildren = this.state.selectedChild;
            newChildren.splice(location,1);
            this.setState({selectedChild:newChildren});
        }else{
            let newChildren = this.state.selectedChild;
            newChildren.push({'file':fileNum,'index':index});
            this.setState({selectedChild:newChildren});
        }
    }

    cancel =()=>{
        this.setState({selectedKey:undefined,selectedLock:undefined,selectedChild:[]});
    }

    foundInSelectedChildren=(fileNum,index)=>{
        for (let step=0;step<this.state.selectedChild.length;step++){
            if (this.state.selectedChild[step]['file']===fileNum && this.state.selectedChild[step]['index']===index){
                return step;
            }
        }
        return -1;
    }

    finalizeMerge=()=>{
        if (this.state.selectedKey!==undefined && this.state.selectedLock!==undefined && this.state.selectedChild.length>0){
            let merge = {'key':this.state.selectedKey,'lock':this.state.selectedLock,'children':this.state.selectedChild}
            let merges = this.state.merges;
            merges.push(merge);
            this.setState({merges:merges,selectedKey:undefined,selectedLock:undefined,selectedChild:[]});
        }
    }

    removeMerge=(i)=>{
        let newMerges = this.state.merges;
        newMerges.splice(i,1);
        this.setState({merges:newMerges});
    }

    flatten=(merge)=>{
        let arr = [];
        arr.push(merge['key']['file']);
        arr.push(merge['key']['index']);
        arr.push(merge['lock']['file']);
        arr.push(merge['lock']['index']);
        let children = merge['children'];
        for (let step=0;step<children.length;step++){
            arr.push(children[step]['file']);
            arr.push(children[step]['index']);
        }
        return arr;
    }

    async submitMerges(){
        let merges = [];
        for (let step=0;step<this.state.merges.length;step++){
            merges.push(this.flatten(this.state.merges[step]));
        }
        let formData = new FormData;
        for (let step=0;step<this.state.files.length;step++){
            formData.append("file"+step,this.state.files[step])
        }
        formData.append("merges",JSON.stringify(merges));
        const response = await fetch('/merge', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData,
        });
        const blob = await response.blob();
        saveAs(blob,"merged.txt");

    }

    render() {
        let fileDisplay = [];
        for (let step=0;step<this.state.files.length;step++){
            fileDisplay.push(<p>{this.state.files[step].name}<Button color="link" onClick={()=>this.removeFile(step)}>x</Button> </p>)
        }
        let selection = [<hr/>];
        if (this.state.files.length===this.state.titles.length){
            for (let step=0;step<this.state.titles.length;step++){
                selection.push(<p>{this.state.files[step].name}</p>);
                let buttons = [];
                for (let n=0;n<this.state.titles[step].length;n++){
                    let color = "secondary";
                    if (this.state.selectedKey !== undefined){
                        if (this.state.selectedKey['file']===step && this.state.selectedKey['index']===n){
                            color="primary";
                        }else if (this.state.selectedLock!==undefined&&this.state.selectedLock['file']===step && this.state.selectedLock['index']===n){
                            color="danger"
                        }
                        else if (this.foundInSelectedChildren(step,n)!==-1){
                            color="success"
                        }
                    }
                    buttons.push(<Button color={color} style={{marginRight:'3px',marginLeft:'3px',marginTop:'3px'}} onClick={()=>this.select(step,n)}>{this.state.titles[step][n]}</Button>)
                }
                selection.push(buttons);
                buttons.push(<hr/>)

            }
        }

        let merges = [];
        for (let step=0;step<this.state.merges.length;step++){
            let keyFileNum = this.state.merges[step]['key']['file'];
            let keyIndex = this.state.merges[step]['key']['index'];
            let lockFileNum = this.state.merges[step]['lock']['file'];
            let lockIndex = this.state.merges[step]['lock']['index'];
            let children = this.state.merges[step]['children'];
            merges.push(<hr/>);
            merges.push(<h6>{"Merge:"}</h6>)
            for (let child=0;child<children.length;child++){
                let fn = children[child]['file'];
                let idx = children[child]['index'];
                merges.push(<p>{this.state.files[fn].name+"."+this.state.titles[fn][idx]}</p>);
            }
            merges.push(<p>{"On: "+this.state.files[keyFileNum].name+"."+this.state.titles[keyFileNum][keyIndex]+" = "+this.state.files[lockFileNum].name+"."+this.state.titles[lockFileNum][lockIndex]}</p>);
            merges.push(<Button color={"link"} onClick={()=>this.removeMerge(step)}>Delete merge</Button> );
        }
        merges.push(<hr/>);
        return(
            <div>
                <h5>Upload text files that reference each other to build one merged file.</h5>
                <Input type={"file"} multiple={true} onChange={this.updateFile}/>
                {fileDisplay}
                <Button color={this.state.files.length>0 ? "primary" : "secondary"} onClick={this.sendFiles}>Get column names!</Button>
                <br/><br/><br/>
                <p>Merges:</p>
                <Button color={this.state.selectedKey!==undefined && this.state.selectedChild.length>0 ? "primary" :"secondary"} onClick={this.cancel}>Cancel current merge</Button>
                {merges}
                <Button color={this.state.merges.length>0 ? "primary" : "secondary"} onClick={this.submitMerges}>MERGE!</Button>
                <br/><br/><br/>
                <p>Columns:</p>
                {selection}
                <Button color={this.state.selectedKey!==undefined && this.state.selectedChild.length>0 ? "primary" :"secondary"} onClick={this.finalizeMerge}>Add merge</Button>
            </div>
        )
    }
}

export default Joiner;
