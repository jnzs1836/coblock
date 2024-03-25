import { ExperimentConfig, ExperimentMode } from "../types/experiment";
import { MinecraftCollaborationSession } from "../types/task";
import { MinecraftTaskAgentSpec } from "../types/task";


function biAgentCheck(collaborationSession: MinecraftCollaborationSession, mode: ExperimentMode) {
    return true;
}

function processAgentConfig(baseConfig: MinecraftTaskAgentSpec, role: string) {
    return {
        ...baseConfig,
        role: role,
    }
}

function useBiAgentExperiment (collaborationSession: MinecraftCollaborationSession, experimentMode: ExperimentMode){

    if(!biAgentCheck(collaborationSession, experimentMode)){
        return {
            state: undefined
        }
    }

    let agentAlphaRole = experimentMode ===  ExperimentMode.HumanMachine? "human" : "machine";
    let agentBetaRole = "machine";

    let agentAlphaConfig: MinecraftTaskAgentSpec = processAgentConfig(collaborationSession.config.agents[0], agentAlphaRole);

    let agentBetaConfig: MinecraftTaskAgentSpec = processAgentConfig(collaborationSession.config.agents[1], agentBetaRole);
    return {
        state: {agentAlphaConfig, agentBetaConfig},  
    }

}

export {useBiAgentExperiment};