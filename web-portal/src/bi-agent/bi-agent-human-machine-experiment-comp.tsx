import { Fragment } from "react";
import MinecraftChatGPTProdPanel from '../minecraft-collaboration/minecraft-chatgpt-prod-panel';
import { MinecraftCollaborationSession, MinecraftTaskAgentSpec } from "../types/task";
import { ExperimentMode } from "../types/experiment";
import { useBiAgentExperiment } from "./hooks";
import { MinecraftBlock, MinecraftWorldState } from "../types/minecraft";
import { MinecraftWorldActions } from "../minecraft-collaboration/hooks";
import { AgentAutoMeta } from "../minecraft-collaboration/auto-control/hooks";
import { RequestStatus, useChatGPTCollaboration } from "../chatgpt/chatgpt-hooks";
import MinecraftCollaborationInput from "../minecraft-collaboration/minecraft-collaboration-input";

interface Props {
    debug: boolean;
    collaborationSession: MinecraftCollaborationSession,
    state: MinecraftWorldState,
    actions: MinecraftWorldActions,
    registerAutoExecution: (autoExecution: AgentAutoMeta, index: number) => void,
    updateFetchResult: (result: string, status: RequestStatus, index: number) => void,
    chatGPTLogFunctions?: Array<(messages: Array<String>, response: string) => void | undefined>,
    initializedRecordId: string,
    syncWorldBlocks: (blocks: MinecraftBlock[]) => void,
 
};


export function BiAgentHumanMachineExperimentComp({
    debug, collaborationSession, state, actions,
    registerAutoExecution, updateFetchResult, chatGPTLogFunctions, initializedRecordId, syncWorldBlocks
}: Props) {

    const { state: biAgentState } = useBiAgentExperiment(collaborationSession, ExperimentMode.HumanMachine);

    if (!biAgentState) {
        return (<div>Not a bi-agent experiment</div>)
    }

    return (
        <Fragment>
            <MinecraftCollaborationInput
                key={0}
                state={state}
                actions={actions}
                syncBlocks={syncWorldBlocks}
                agentConfig={biAgentState.agentAlphaConfig}
            />
            <MinecraftChatGPTProdPanel
                sessionId={collaborationSession ? collaborationSession.id : ""}
                key={1}
                blueprint={collaborationSession.blueprint.spec}
                minecraftWorldState={state}
                minecraftWorldActions={actions}
                promptCheckpoint={collaborationSession.config.promptCheckpoint}
                agent={{
                    name: biAgentState.agentBetaConfig.name,
                    role: biAgentState.agentBetaConfig.role,
                }}
                registerAutoExecution={registerAutoExecution}
                updateFetchResult={updateFetchResult}
                agentConfig={biAgentState.agentBetaConfig}
                agentIndex={1}
                logChatGPT={chatGPTLogFunctions ? chatGPTLogFunctions[0] : undefined}
                initializedRecordId={initializedRecordId ? initializedRecordId : ""}
                postProcess={() => {
                    actions.addAgentAdjust(collaborationSession.config.agents[0].name);
                }}
            />

            
        </Fragment>
    )

}
