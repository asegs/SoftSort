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
        background: "brown",
    },
    mark: {
        background: "black"
    },
    rail: {
        background: "brown"
    },
    valueLabel: {
        "&>*": {
            background: "brown"
        }
    }
}));


export default function DistSlider(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState([55]);

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
                Accepted range (km)
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
                scale={(x) => Math.round(Math.pow(x/6,4))}
                min={0}
                max={55}
                step={0.01}
            />
        </div>
    );
}