import React from "react";
import LocationPicker from "react-leaflet-location-picker";

const LocPicker = (props) => {
    let pointVals = [
        props.value.replaceAll("<L>","").split(":").slice(0,2)
    ];
    let circleVals = [];
    const pointMode = {
        banner: true,
        control: {
            values: pointVals,
            onClick: (point) => {
                pointVals.pop();
                pointVals.push(point);
                props.change(point);
            }
            ,
            onRemove: point =>
                console.log("Click somewhere else to remove!"),
        }
    };
    const circleMode = {
        banner: false,

        control:{
            onClick:()=>{
                console.log("Sought.")
            },
            onRemove:()=>{
                console.log("Deleted.")
            }
        }

    };
    return <LocationPicker mapStyle={{height:"600px",width:"auto"}} pointMode={pointMode} showInputs={false} overlayAll={false}/>;
};

export default LocPicker;