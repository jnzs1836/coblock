import React from 'react';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider';
import { Handle, Track, SliderRail } from './slider/slider-components';
import { MinecraftWorldAgent, MinecraftWorldAgentAction } from '../types/minecraft';
import styled from '@emotion/styled';

const Container = styled("div")({
    display: 'flex',
    paddingTop: "30px",
    paddingLeft: "30px",
    paddingRight: "30px"
    // height: "300px",

})

const RailItem = styled("div")(({
}))
interface ReplaySliderProps {
    step: number;
    totalSteps: number;
    setStep: (step: number) => void;
    actionHistory: Array<MinecraftWorldAgentAction>;
}

const ReplaySlider: React.FC<ReplaySliderProps> = ({ step, totalSteps, setStep, actionHistory }) => {
    const domain = [0, totalSteps - 1];
    const [values, setValues] = React.useState([step]);

    const updateValues = (values: ReadonlyArray<number>): void => {
        setValues(values.slice());
        setStep(values[0]);
    };

    const getColorForRange = (source: any, target: any) => {
        const agentName = actionHistory[source.value]?.agentName;
        return agentName === 'Human' ? 'red' : 'blue';
    };

    const sliderStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
    };

    return (
        <Container>

            <Slider
                mode={1}
                step={1}
                domain={domain}
                rootStyle={sliderStyle}
                onUpdate={updateValues}
                values={values}
            >
                <Rail
                >
                    {/* {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />} */}

                    {({ getRailProps }) => <SliderRail {...getRailProps()} />}
                </Rail>
                <Handles>
                    {({ handles, getHandleProps }) => (
                        <div>
                            {handles.map(handle => (
                                <Handle
                                    key={handle.id}
                                    handle={handle}
                                    getHandleProps={getHandleProps}
                                />
                            ))}
                        </div>
                    )}
                </Handles>
                <Tracks left={false} right={false}>
                    {({ tracks, getTrackProps }) => (
                        <div>
                            {tracks.map(({ id, source, target }) => (
                                <Track
                                    key={id}
                                    source={source}
                                    target={target}
                                    getTrackProps={getTrackProps}
                                    color={getColorForRange(source, target)}
                                />
                            ))}
                        </div>
                    )}
                </Tracks>
            </Slider>

        </Container>
    );
};

export default ReplaySlider;
