import { useState } from "react";
import { ExperimentMode, ExperimentConfig } from "../../types/experiment";
import { MinecraftCollaborationSession } from "../../types/task";
import { usePromptCheckpointList } from "../../management/prompt-checkpoint/hooks";
import { PromptCheckpoint } from "../../types/prompt";


function useExperimentConfig(collaborationSession: MinecraftCollaborationSession) {
    const [mode, setMode] = useState<ExperimentMode>(ExperimentMode.MachineOnly);
    const [prompt, setPrompt] = useState<PromptCheckpoint>();

    const { result: promptCheckpointList } = usePromptCheckpointList();

    const experimentConfig: ExperimentConfig = {
        mode: mode,
        prompt: prompt,
    }
    return {
        experimentConfig, 
        promptCheckpointList,
        setExperimentConfig: (config: ExperimentConfig) => {
            setMode(config.mode);
            setPrompt(config?.prompt);
        },
        onUpdateMode: (mode: ExperimentMode) => {
            setMode(mode);
        },
        onUpdatePrompt: (prompt: PromptCheckpoint) => {
            setPrompt(prompt);
        }
    }
}

export { useExperimentConfig };