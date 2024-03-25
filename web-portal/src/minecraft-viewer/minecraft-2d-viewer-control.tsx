import styled from "@emotion/styled"
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { Grid } from "@mui/material";
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';


interface Props {
    sx?: Record<string, unknown>;
    scaleRatio: number;
    onScaleRatioChange: (value: number) => void;
    verticalOffset: number;
    onVerticalOffsetChange: (value: number) => void;
    horizontalOffset: number;
    onHorizontalOffsetChange: (value: number) => void;
}


const Container = styled("div")({
    flexDirection: "column",
});

const offsetMarks = [
    {
        value: -10,
        label: '-10',
    },
    {
        value: 0,
        label: '0',
    },
    {
        value: 10,
        label: '10',
    },

];

const scaleMarks = [
    {
        value: 0,
        label: '0%',
    },
    {
        value: 100,
        label: '100%',
    },
]



export default function Minecraft2DViewerControl({
    scaleRatio,
    onScaleRatioChange,
    verticalOffset,
    onVerticalOffsetChange,

    horizontalOffset,
    onHorizontalOffsetChange,

    sx

}: Props) {


    const handleScaleRatioChange = (event: Event, newValue: number | number[]) => {
        onScaleRatioChange(newValue as number);
    };


    const handleHorizontalOffsetChange = (event: Event, newValue: number | number[]) => {
        onHorizontalOffsetChange(newValue as number);
    };

    const handleVerticalOffsetChange = (event: Event, newValue: number | number[]) => {
        onVerticalOffsetChange(newValue as number);
    };


    return (
           
            <Box 
             sx={{
                flexBasis: "100px",
                flexShrink: 0,
                flexGrow: 10,
                ...sx}}>
                <Grid container spacing={2} alignItems="center"
                >
                    <Grid item>
                        <CenterFocusStrongIcon />
                    </Grid>
                    <Grid item xs>
                        <Slider
                            marks={scaleMarks}
                            aria-label="Scale" value={scaleRatio}

                            onChange={handleScaleRatioChange} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <SwapHorizIcon />
                    </Grid>
                    <Grid item xs>
                        <Slider aria-label="Horizontal" value={horizontalOffset}
                            marks={offsetMarks}
                            min={-10}
                            max={10}
                            onChange={handleHorizontalOffsetChange} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <SwapVertIcon />
                    </Grid>
                    <Grid item xs>
                        <Slider aria-label="Vertical"
                            marks={offsetMarks}
                            min={-10}
                            max={10}
                            value={verticalOffset} onChange={handleVerticalOffsetChange} />
                    </Grid>
                </Grid>
            </Box>
    )
}