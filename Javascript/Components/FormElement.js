import React, {Component, useState} from 'react';
import Select from "react-select";
import { Button,Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap';
import NumSlider from './NumSlider';
import HarshnessSlider from "./HarshnessSlider";
import WeightSlider from "./WeightSlider";
import LocPicker from "./LocPicker";
import DistSlider from "./DistSlider";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from '@fortawesome/free-brands-svg-icons';
import {faInfo,faCoffee} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
library.add(fab, faInfo, faCoffee);

class FormElement extends Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            values:this.props.text===2 ? "<L>0:0:6000<L>" : [],
            weight:1,
            numerics:[this.props.minMax[0],this.props.minMax[1],5,3],
            range:true
        }


    }


    handleChange = e =>{
        this.setState({weight:e.target.value},()=>{
            this.props.changeWeight(this.props.num,this.state.weight);
        })
    }

    handleOptionChange = e =>{
        let newValues = [];
        if (e!==null) {
            for (let step = 0; step < e.length; step++) {
                newValues.push(e[step]['value']);
            }
        }
        this.setState({values:newValues},()=>{
            this.props.changeOption(this.props.num,this.state.values);
        })
    }

    handleNumericChange = (e) =>{
        let index = 0;
        try {
            index = e.target.id === "softMin" ? 0 : e.target.id === "softMax" ? 1 : 2;
        }
        catch (e){
            index = 3;
        }
        let newNums = [];
        for (let i=0;i<this.state.numerics.length;i++){
            if (i===index){
                newNums.push(index!==3 ? e.target.value : e.value);
            }
            else{
                newNums.push(this.state.numerics[i]);
            }
        }

        this.setState({numerics:newNums},()=>{
            let f_numerics = "<M>"+this.state.numerics.join("n")+"<M>";
            this.props.changeOption(this.props.num,f_numerics);
        })

    }

    handleLocChange = (pair) =>{
        let f_loc = "<L>"+pair.join(":")+":"+this.state.values.split(":")[2];
        this.setState({values:f_loc},()=>{
            this.props.changeOption(this.props.num,this.state.values);
        })
    }

    handleSliderChange=(value)=>{
        let newNumerics = [value[0],value[1]];
        for (let step=2;step<this.state.numerics.length;step++){
            newNumerics.push(this.state.numerics[step]);
        }
        this.setState({numerics:newNumerics},()=>{
            let f_numerics = "<M>"+this.state.numerics.join("n")+"<M>";
            this.props.changeOption(this.props.num,f_numerics);
        });
    }

    handleHarshnessChange=(value)=>{
        let newNumerics = [this.state.numerics[0],this.state.numerics[1],value[0],this.state.numerics[3]];
        this.setState({numerics:newNumerics},()=>{
            let f_numerics = "<M>"+this.state.numerics.join("n")+"<M>";
            this.props.changeOption(this.props.num,f_numerics);
        });
    }

    handleWeightChange = (value) =>{
        value = value[0];
        value = value<=8 ? Math.round((value*0.2 + Number.EPSILON) * 100) / 100
            : Math.round((value-6 + Number.EPSILON) * 100) / 100
        this.setState({weight:value},()=>{
            this.props.changeWeight(this.props.num,this.state.weight);
        })
    }

    handleDistanceChange=(value)=>{
        value = Math.round(Math.pow(value/6,4));
        let pair = this.state.values.split(":").slice(0,2);
        let f_loc = pair.join(":")+":"+value+"<L>";
        this.setState({values:f_loc},()=>{
            this.props.changeOption(this.props.num,f_loc);
        });
    }





    render() {
        const selectStyle={
            width: "250px"
        }
        const isMobile = window.innerWidth <= 500;
        let width = isMobile ? "85%" : "40%";
        let mapWidth = isMobile ? "90%" : "60%";
        let icon = this.props.nameComment==="" ? "" : <FontAwesomeIcon icon="info" title={this.props.nameComment} />
        if (this.props.name!==undefined) {
            if (this.props.text===1) {
                let propOptions = [];
                for (let step=0;step<this.props.options.length;step++){
                    let tempIcon = (this.props.comments[step]==="" || this.props.general) ? "" : <FontAwesomeIcon icon="info" title={this.props.comments[step]} />
                    propOptions.push({value:this.props.options[step],label:(
                            <>
                                <span style={{ paddingRight: "5px" }}>{this.props.options[step]+" ("+this.props.counts[step]+")"}</span>
                                {tempIcon}
                            </>
                        )});
                }

                return (
                    <div>
                    <h4>{this.props.name}{'  '}{icon}</h4>
                        <div style={{width:width,margin:'auto'}}>
                <Select
                    isMulti
                    placeholder="No preference"
                    options={propOptions} // set list of the data
                    onChange={this.handleOptionChange} // assign onChange function

                />
                            <WeightSlider change={this.handleWeightChange}/>
                        </div>
                    </div>
                )
            } else if (this.props.text===0){
                let tfOptions = [];
                tfOptions.push({value:1,label:"Prefer above"});
                tfOptions.push({value:2,label:"Prefer below"});
                tfOptions.push({value:3,label:"No preference"});
                let harshness = "";
                let skew = "";
                if (this.props.showNumericsDetails){
                    harshness = <HarshnessSlider change={this.handleHarshnessChange}/>
                    skew = <Form>
                        <div style={{width:'40%',margin:'auto'}}>
                            <label htmlFor={"direction"}>Skew:</label>
                            <Select
                                placeholder="Select direction"
                                options={tfOptions}
                                id="direction"
                                onChange={this.handleNumericChange}
                            /><br/>
                        </div>
                    </Form>
                }

                return (
                    <div>
                        <br/><br/>
                        <div style={{width:'100%',margin:'auto'}}>
                            <div style={{width:width,margin:'auto'}}>
                                <h4>{this.props.name.substr(0,this.props.name.length-3)}{'  '}{icon}</h4>
                                <NumSlider change={this.handleSliderChange} min={this.props.minMax[0]} max={this.props.minMax[1]} title={this.props.name.substr(0,this.props.name.length-3)}/>
                                {harshness}
                                <WeightSlider change={this.handleWeightChange}/>



                            </div>
                            {skew}

                            <br/><br/>
                        </div>
                            </div>


                )
            }
            else if(this.props.text===2){
                // let distOptions = [];
                // distOptions.push({value:5,label:"Same neighborhood"});
                // distOptions.push({value:15,label:"Same town"});
                // distOptions.push({value:40,label:"Same county"});
                // distOptions.push({value:50,label:"Same region"});
                // distOptions.push({value:250,label:"Same state"});
                // distOptions.push({value:2500,label:"Same country"});
                // distOptions.push({value:6000,label:"Global"});
                return (
                    <div style={{width:mapWidth,margin:'auto'}}>
                        <h4>{this.props.name.substr(0,this.props.name.length-3)}{'  '}{icon}</h4>
                        <LocPicker change={this.handleLocChange} value={this.state.values}/>
                        <div style={{width:'66%',margin:'auto'}}>
                            <p>Distance scale</p>
                            {/*<Select*/}
                            {/*    placeholder="Select direction"*/}
                            {/*    options={distOptions}*/}
                            {/*    id="distances"*/}
                            {/*    onChange={this.handleDistanceChange}*/}
                            {/*/>*/}
                            <DistSlider change={this.handleDistanceChange}/>
                        <WeightSlider change={this.handleWeightChange}/>
                        </div>
                    </div>
                );
            }
        }
        else{
            return (
                <p>Loading...</p>
            )
        }
    }
}

export default FormElement;
