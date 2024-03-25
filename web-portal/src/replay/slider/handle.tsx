import React, { Fragment } from 'react';
import { styled } from '@mui/material';
import {
    GetRailProps,
    GetHandleProps,
    GetTrackProps,
    SliderItem
} from 'react-compound-slider';


interface HandleComponentProps {
    domain: number[];
    handle: SliderItem;
    getHandleProps: GetHandleProps;
    disabled?: boolean;
    activeHandleID: string;
}

const HandleOuterComponent = styled("div")({
    position: 'absolute' as 'absolute',
    width: '100%',
    transform: 'translate(0%, -50%)',
    height: 42,
    borderRadius: 21,
    cursor: 'pointer',
    border: '1px solid white',
});
const HandleInnerComponent = styled("div")({
    position: 'absolute' as 'absolute',
    width: '100%',
    transform: 'translate(0%, -50%)',
    height: 4,
    borderRadius: 2,
    pointerEvents: 'none' as 'none',
    backgroundColor: 'rgb(155,155,155)',
})

export const HandleComponent: React.FC<HandleComponentProps> = ({
    domain: [min, max],
    handle: { id, value, percent },
    activeHandleID,
    getHandleProps,
}) => {
    const active = activeHandleID === id;

    return (
        <Fragment>
            <HandleOuterComponent
                //   className={clsx(classes.common, classes.outer)}
                style={{ left: `${percent}%` }}
                {...getHandleProps(id)}
            />
            <HandleInnerComponent
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                //   className={clsx(
                //     classes.common,
                //     classes.inner,
                //     active && classes.active
                //   )}
                sx={{ left: `${percent}%` }}
            />
        </Fragment>
    );
};


export const Handle = HandleComponent;

// *******************************************************
// TRACK COMPONENT
// *******************************************************
