import React from 'react';
import ReplaySlider from './replay-slider';
import {useReplay, ReplayControls} from './hooks';
import { MinecraftWorldAgentAction } from '../types/minecraft';
import { Typography } from '@mui/material';


//... Other imports ...
interface ReplayControllerProps {
    progress: number;
    step: number;
    totalSteps: number;
    speed: number;
    autoPlay: boolean;
    setStep: (step: number) => void;
    next: () => void;
    previous: () => void;
    speedUp: () => void;
    speedDown: () => void;
    toggleAutoPlay: () => void;
    actionHistory: Array<MinecraftWorldAgentAction>;

}

const ReplayController: React.FC<ReplayControllerProps> = ({
    progress,
    step,
    totalSteps,
    speed,
    autoPlay,
    setStep,
    next,
    previous,
    speedUp,
    speedDown,
    toggleAutoPlay,
    actionHistory
}) => {
    return (
        <div>
            <Typography variant='h5'>Step: {step + 1} / {totalSteps}</Typography>
            <ReplaySlider
                step={step}
                totalSteps={totalSteps}
                setStep={setStep}
                actionHistory={actionHistory}
            />
            {/* Other controls... */}
        </div>
    );
};

export default ReplayController;
