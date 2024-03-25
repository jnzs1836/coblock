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
import MinecraftChatGPTPanel from "../minecraft-collaboration/minecraft-chatgpt-panel";
import { computeStructureProgress, validCurrentStructure } from "../minecraft-collaboration/utils/validation";
import CollaborationTrackerPanel from "../minecraft-collaboration/auto-control/collaboration-tracker-panel";
import { PromptCheckpoint } from "../types/prompt";

interface Props {
    debug: boolean;
    collaborationSession: MinecraftCollaborationSession,
    state: MinecraftWorldState,
    actions: MinecraftWorldActions,
    registerAutoExecution: (autoExecution: AgentAutoMeta, index: number) => void,
    updateFetchResult: (result: string, status: RequestStatus, index: number) => void,
    chatGPTLogFunctions?: Record<string, (messages: Array<String>, response: string) => void | undefined>,
    initializedRecordId: string,
    syncWorldBlocks: (blocks: MinecraftBlock[]) => void,
    backendVersion: string;
    promptCheckpoint?: PromptCheckpoint
};


export default function BiAgentMachineOnlyExperimentComp({
    debug, collaborationSession, state, actions,
    registerAutoExecution, updateFetchResult, chatGPTLogFunctions, initializedRecordId, syncWorldBlocks, promptCheckpoint, backendVersion, 
}: Props) {

    const { state: biAgentState } = useBiAgentExperiment(collaborationSession, ExperimentMode.MachineOnly);

    if (!biAgentState) {
        return (<div>Not a bi-agent experiment</div>)
    }
    const currentStructureValid = validCurrentStructure(actions.getCurrentBlocks(), { spec: collaborationSession.blueprint.spec, id: "", name: "", description: "" });
    const progress = computeStructureProgress(actions.getCurrentBlocks(), collaborationSession.blueprint);


    return (
        <Fragment>
            <CollaborationTrackerPanel
                taskCompleted={currentStructureValid}
                progress={progress}
            />
            <MinecraftChatGPTPanel
                sessionId={collaborationSession ? collaborationSession.id : ""}
                key={0}
                blueprint={collaborationSession.blueprint.spec}
                minecraftWorldState={state}
                minecraftWorldActions={actions}
                promptCheckpoint={promptCheckpoint}
                agent={{
                    name: biAgentState.agentAlphaConfig.name,
                    role: biAgentState.agentAlphaConfig.role,
                }}
                registerAutoExecution={registerAutoExecution}
                updateFetchResult={updateFetchResult}
                agentConfig={biAgentState.agentBetaConfig}
                agentIndex={0}
                logChatGPT={chatGPTLogFunctions ? chatGPTLogFunctions[0] : undefined}
                backendVersion={backendVersion}


            />
            <MinecraftChatGPTPanel
                sessionId={collaborationSession ? collaborationSession.id : ""}
                key={1}
                blueprint={collaborationSession.blueprint.spec}
                minecraftWorldState={state}
                minecraftWorldActions={actions}
                promptCheckpoint={promptCheckpoint}
                agent={{
                    name: biAgentState.agentBetaConfig.name,
                    role: biAgentState.agentBetaConfig.role,
                }}
                registerAutoExecution={registerAutoExecution}
                updateFetchResult={updateFetchResult}
                agentConfig={biAgentState.agentBetaConfig}
                agentIndex={1}
                logChatGPT={chatGPTLogFunctions ? chatGPTLogFunctions[1] : undefined}
                backendVersion={backendVersion}

            />


        </Fragment>
    )

}
