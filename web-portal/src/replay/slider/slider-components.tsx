import React, { Fragment } from 'react';
import { styled } from '@mui/material';
import {
    GetRailProps,
    GetHandleProps,
    GetTrackProps,
} from 'react-compound-slider';

interface HandleProps {
    handle: {
        id: string;
        value: number;
        percent: number;
    };
    getHandleProps: (id: string) => {};
}

const HandleContent = styled("div")({
    position: 'absolute',
    // marginLeft: -15,
    // marginTop: 25,
    zIndex: 2,
    width: 30,
    height: 30,
    border: 0,
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '50%',
    backgroundColor: '#2C4870',
    color: '#333',
    transform: 'translate(-50%, -50%)',

})

const TrackContent = styled("div")({
    position: 'absolute',
    height: 10,
    zIndex: 1,
    marginTop: 35,
    borderRadius: 5,
    cursor: 'pointer',
    transform: 'translate(0%, -50%)',
})

export const Handle: React.FC<HandleProps> = ({ handle: { id, value, percent }, getHandleProps }) => (
    <HandleContent
        sx={{
            left: `${percent}%`,
        }}
        {...getHandleProps(id)}
    >
        {/* <div style={{ fontFamily: 'Roboto', fontSize: 32, marginTop: -35 }}> */}
            {/* {value} */}
        {/* </div> */}
    </HandleContent>
);

interface TrackProps {
    source: {
        value: number;
        percent: number;
    };
    target: {
        value: number;
        percent: number;
    };
    getTrackProps: () => {};
    color: string;
}

export const Track: React.FC<TrackProps> = ({ source, target, getTrackProps, color }) => (
    <TrackContent
        sx={{
            backgroundColor: color,
            left: `${source.percent}%`,
            width: `${target.percent - source.percent}%`,
        }}
        {...getTrackProps()}
    />
);


interface RailComponentProps {
    getRailProps: GetRailProps;
}


const RailOuterComponent = styled("div")({
    position: 'absolute' as 'absolute',
    width: '100%',
    transform: 'translate(0%, -50%)',
    height: 42,
    borderRadius: 21,
    cursor: 'pointer',
    border: '1px solid white',
});

const RailInnerComponent = styled("div")({
    position: 'absolute' as 'absolute',
    width: '100%',
    transform: 'translate(0%, -50%)',
    height: 4,
    borderRadius: 2,
    pointerEvents: 'none' as 'none',
    backgroundColor: 'rgb(155,155,155)',
});

const RailComponent: React.FC<RailComponentProps> = ({
    getRailProps,
}) => (
    <Fragment>
        <RailOuterComponent />
        <RailInnerComponent />
    </Fragment>
);

export const SliderRail = RailComponent;