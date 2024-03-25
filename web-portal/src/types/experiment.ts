import { PromptCheckpoint } from "./prompt";

enum ExperimentMode{
    HumanMachine = "HumanMachine",
    MachineOnly = "MachineOnly",

};

interface ExperimentConfig {
    mode: ExperimentMode,
    prompt?: PromptCheckpoint,
};

interface HumanMachineExperimentConfig {
    mode: ExperimentMode.HumanMachine,
    prompt: PromptCheckpoint,
}

interface MachineOnlyExperimentConfig {
    mode: ExperimentMode.MachineOnly,
    prompt: PromptCheckpoint,
}



export {ExperimentMode};
export type { ExperimentConfig, MachineOnlyExperimentConfig, HumanMachineExperimentConfig };