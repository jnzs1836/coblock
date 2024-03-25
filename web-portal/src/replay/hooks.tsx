import React, { useState, useEffect } from 'react';
import { MinecraftBlock, MinecraftWorldAgent, MinecraftWorldAgentAction } from '../types/minecraft';
import { MinecraftCollaborationRecord } from '../types/record';
import { generateCurrentBlocks } from '../minecraft-collaboration/hooks';

interface ReplayControls {
    step: number;
    speed: number;
    autoPlay: boolean;
    action: MinecraftWorldAgentAction | null;
    next: () => void;
    previous: () => void;
    speedUp: () => void;
    speedDown: () => void;
    toggleAutoPlay: () => void;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    playedActions: Array<MinecraftWorldAgentAction>,
    currentBlocks: Array<MinecraftBlock>
}

const useReplay = (record: MinecraftCollaborationRecord | undefined): ReplayControls => {
    const [step, setStep] = useState(0);
    const [speed, setSpeed] = useState(1); // speed multiplier
    const [autoPlay, setAutoPlay] = useState(false);
    const [action, setAction] = useState<MinecraftWorldAgentAction | null>(null);

    // Step through record
    useEffect(() => {
        if (record) {

            setAction(record.actionHistory[step]);
        }
    }, [step, record]);

    // Auto play
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (autoPlay && record && step < record.actionHistory.length) {
            timer = setTimeout(() => {
                setStep((prevStep) => prevStep + 1);
            }, 1000 / speed); // adjust delay based on speed
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [autoPlay, step, speed, record]);

    const next = () => {
        if (record) {
            if (step < record.actionHistory.length - 1) {
                setStep(step + 1);
            }
        }

    };

    const previous = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const speedUp = () => {
        setSpeed(speed * 2);
    };

    const speedDown = () => {
        if (speed > 0.1) { // limit minimum speed
            setSpeed(speed / 2);
        }
    };

    const toggleAutoPlay = () => {
        setAutoPlay(!autoPlay);
    };

    const playedActions = record?.actionHistory.slice(0, step) || [];
    let currentBlocks = generateCurrentBlocks([], playedActions); 

    return {
        step,
        setStep,
        speed,
        autoPlay,
        action,
        next,
        previous,
        speedUp,
        speedDown,
        toggleAutoPlay,
        playedActions,
        currentBlocks 
    };
};


export type { ReplayControls }
export { useReplay };