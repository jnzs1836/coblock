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
import MinecraftSyncChatGPTPanel from "../minecraft-collaboration/minecraft-sync-chatgpt-panel";
import { SyncState } from "../sync/hooks";
import MinecraftChatGPTSyncPanel from "../minecraft-collaboration/minecraft-chatgpt-sync-panel";
import MinecraftWorldDebugComp from "../minecraft-collaboration/minecraft-debug-comp";
import { ExperimentType } from "./types";
import { validCurrentStructure } from "../minecraft-collaboration/utils/validation";
import { PromptCheckpoint } from "../types/prompt";


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
    syncState: SyncState,
    ready: boolean,
    experimentType?: ExperimentType,
    feedbackPaylod?: Record<string, string | number>,
    backendVersion?: string
    promptCheckpoint?: PromptCheckpoint 

};


export default function BiAgentHumanMachineSyncExperimentComp({
    debug, collaborationSession, state, actions,
    registerAutoExecution, updateFetchResult, chatGPTLogFunctions, initializedRecordId, syncWorldBlocks, syncState, ready, experimentType , feedbackPaylod, backendVersion, promptCheckpoint
}: Props) {

    let validExperimentType = experimentType ? experimentType : ExperimentType.Individual;
    const { state: biAgentState } = useBiAgentExperiment(collaborationSession, ExperimentMode.HumanMachine);

    if (!biAgentState) {
        return (<div>Not a bi-agent experiment</div>)
    }
    
    const currentStructureValid = validCurrentStructure(actions.getCurrentBlocks(), collaborationSession.blueprint);

    const onSubmitFeedback = validExperimentType === ExperimentType.Individual ? (feedback: string, isSuccess: boolean) => {
        const formData = new FormData();
        formData.append("session_id", collaborationSession.id);
        formData.append("record", initializedRecordId);
        formData.append("content", `${isSuccess ? "Task completed" : "Task incompleted"} \n` + feedback);
        formData.append("spec", JSON.stringify(biAgentState.agentBetaConfig));
        return fetch("/api/feedback/", {
            method: "POST",
            body: formData
        }).then(res => {
            return res;
        });
    } : (feedback: string, isSuccess: boolean) => {
        const postData = {
            ...feedbackPaylod,
            
            collaboration_experiment_feedback: {
                session_id: collaborationSession.id,
                record: initializedRecordId,
                content: `${isSuccess ? "Task completed" : "Task incompleted"} \n` + feedback,
                spec: JSON.stringify(biAgentState.agentBetaConfig),
                is_complete: isSuccess
            }
            // ... other fields
        };

        // formData.append("session_id", sessionId);
        // formData.append("record", initializedRecordId);
        // formData.append("content", `${isSuccess ? "Task completed" : "Task incompleted"} \n` + feedback);
        // formData.append("spec", JSON.stringify(agentConfig));
        return fetch("/api/pfdback/", {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json',
            }
        },
        ).then(res => {
            return res;
        });
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


            {ready && <MinecraftChatGPTSyncPanel
                sessionId={collaborationSession ? collaborationSession.id : ""}
                key={1}
                blueprint={collaborationSession.blueprint.spec}
                minecraftWorldState={state}
                minecraftWorldActions={actions}
                promptCheckpoint={promptCheckpoint||collaborationSession.config.promptCheckpoint}
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
                currentTurn={syncState.currentTurn}
                experimentType={validExperimentType}
                onSubmitFeedback={onSubmitFeedback}
                backendVersion={backendVersion || 'gpt-4'}
                
            />}
            {/* <MinecraftWorldDebugComp
                state={state}
            />    */}

        </Fragment>
    )

}
