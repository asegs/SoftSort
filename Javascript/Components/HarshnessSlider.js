import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: 300,
    },
});


export default function HarshnessSlider(props) {
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
                Harshness
            </Typography>
            <Slider
                valueLabelDisplay="auto"
                value={value}
                onChange={handleChange}
                onChangeCommitted={handleDragStop}
                min={0}
                max={10}
                step={1}
                marks={true}
            />
        </div>
    );
}