import React,{ useState }from 'react';
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
        background: "purple",
    },
    mark: {
        background: "black"
    },
    rail: {
        background: "purple"
    },
    valueLabel: {
        "&>*": {
            background: "purple"
        }
    }
}));


export default function WeightSlider(props) {
    const marks = [
        {
            value: 0,
            label: 0,
        },
        {
            value: 13,
            label: 7,
        },
    ];
    const classes = useStyles();
    const [value, setValue] = React.useState([5]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDragStop=(event,newValue)=>{
        setValue(newValue);
        props.change(newValue);
    }

    return (
        <div>
            <Typography id="range-slider" gutterBottom>
                Weight
            </Typography>
            <Slider
                valueLabelDisplay="auto"
                classes={{
                    thumb: classes.thumb,
                    rail: classes.rail,
                    track: classes.track,
                    valueLabel: classes.valueLabel,
                    mark: classes.mark
                }}
                value={value}
                onChange={handleChange}
                onChangeCommitted={handleDragStop}
                scale={(x) => x<=8 ? Math.round((x*0.2 + Number.EPSILON) * 100) / 100
                    : Math.round((x-6 + Number.EPSILON) * 100) / 100}
                min={0}
                max={13}
                step={0.01}
                marks={marks}
            />
        </div>
    );
}