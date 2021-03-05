import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles(theme => ({
    root: {
        width: 300
    },
    margin: {
        height: theme.spacing(3)
    },
    thumb: {
        background: "mediumseagreen",
    },
    mark: {
        background: "black"
    },
    rail: {
        background: "mediumseagreen"
    },
    valueLabel: {
        "&>*": {
            background: "mediumseagreen",
            width:"30px",
            height:"30px"
        }
    }
}));
export default function NumSlider(props) {
    const marks = [
        {
            value: props.min,
            label: props.min,
        },
        {
            value: props.max,
            label: props.max,
        },
    ];
    const classes = useStyles();
    const [value, setValue] = React.useState([props.min, props.max]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDragStop=(event,newValue)=>{
        setValue(newValue);
        props.change(newValue);
    }

    return (
        <div>
            <Slider
                classes={{
                    thumb: classes.thumb,
                    rail: classes.rail,
                    track: classes.track,
                    valueLabel: classes.valueLabel,
                    mark: classes.mark
                }}
                valueLabelDisplay="auto"
                value={value}
                onChange={handleChange}
                onChangeCommitted={handleDragStop}
                min={props.min}
                max={props.max}
                step={0.01}
                marks={marks}
            />
            <p>{value[0]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{value[1]}</p>
        </div>
    );
}