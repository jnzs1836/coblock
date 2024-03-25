import React from 'react';
import logo from './logo.svg';
import '../App.css';
import NavigationBar from '../page/navigation-bar';
import PageContent from '../page/page-content';
import MinecraftViewerContainer from '../minecraft-viewer/minecraft-viewer-container';
// import styled from '@emotion/styled';
import { styled } from "@mui/material"
import MinecraftEditor from '../minecraft-editor/minecraft-editor';
import { MinecraftBlock, MinecraftCollaborationCheckpoint } from '../types/minecraft';
import { generateUId } from '../types/utils';
import ChatGPTPanel from '../chatgpt/chatgpt-panel';
import { useMinecraftBlueprint } from '../minecraft-blueprint/blueprint-hooks';
import MinecraftCollaborationInput from '../minecraft-collaboration/minecraft-collaboration-input';
import { useCollaborationExperiment, useCollaborationSession, useMinecraftWorld, useParticipantExperiment } from '../minecraft-collaboration/hooks';
import MinecraftCollaborationDialogue from '../minecraft-collaboration/minecraft-collaboration-dialogue';
import MinecraftChatGPTPanel from '../minecraft-collaboration/minecraft-chatgpt-panel';
import { withAuthUser, useAuthUser, useAuthHeader } from 'react-auth-kit'
import BlueprintTable from '../management/blueprint-table';
import { useBlueprintListAPI } from '../management/blueprint-management-hooks';
import { useParams } from 'react-router-dom';
import CheckpointPanel from "../minecraft-collaboration/checkpoint/checkpoint-panel";
import { useCollaborationCheckpoint } from '../minecraft-collaboration/checkpoint/checkpoint-hooks';
import { saveCheckpointAPI } from '../minecraft-collaboration/checkpoint/api';
import { MinecraftTaskAgentSpec } from "../types/task";
import CollaborationAutoControlPanel from "../minecraft-collaboration/auto-control/collaboration-auto-control-panel"
import { useAutoExecution } from '../minecraft-collaboration/auto-control/hooks';
import { useRecordLogging } from '../minecraft-collaboration/record/record-hooks';
import { finished } from 'stream';
import MinecraftChatGPTProdPanel from '../minecraft-collaboration/minecraft-chatgpt-prod-panel';
import { BiAgentHumanMachineExperimentComp } from '../bi-agent/bi-agent-human-machine-experiment-comp';
import { useSyncWorld } from '../sync/hooks';
import BiAgentHumanMachineSyncExperimentComp from '../bi-agent/bi-agent-human-machine-sync-experiment-comp';
import SyncControlComp from '../sync/sync-control-comp';
import MinecraftMotiveViewer from '../minecraft-viewer/minecraft-motive-viewer';
import { ExperimentType } from '../bi-agent/types';

import { validCurrentStructure } from '../minecraft-collaboration/utils/validation';
const Column = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    height: '100vh',
    color: 'white',
    marginLeft: '1rem',
});

// const initialBlocks: MinecraftBlock[] = [
//   { blockType: 'red', pos: { x: 0, y: 1, z: 2 }, uid: generateUId() },
//   { blockType: 'green', pos: { x: 1, y: 2, z: 3 }, uid: generateUId()  },
//   // { blockType: 'blue', pos: { x: -1, y: 0, z: -1 } },
//   ];

function SyncParticipantPage() {

    const { linkId } = useParams();
    const [blocks, setBlocks] = React.useState<Array<MinecraftBlock>>([]);
    // const {blueprint} = useMinecraftBlueprint();
    const syncWorldBlocks = (blocks: MinecraftBlock[]) => {
        setBlocks(blocks);
    }


    const { state: { collaborationSession, isLoading, participantTaskMeta, promptCheckpoint, backendVersion } } = useParticipantExperiment(linkId);
    // const [state, actions, sessionFinished] = useMinecraftWorld([], syncWorldBlocks, collaborationSession?.config);

    const [state, actions, sessionFinished, syncState, ready] = useSyncWorld([], syncWorldBlocks, collaborationSession?.config, 1, true);
    const { state: checkpointHookState, actions: checkpointHookActions } = useCollaborationCheckpoint(actions.loadState, collaborationSession);



    const authHeader = useAuthHeader();

    const {
        registerAutoExecution, start, updateFetchResult, currentTurn, currentAgentIndex, numTurns, setNumTurns, status: executionStatus
    } = useAutoExecution(sessionFinished);

    const { onSaveRecord, chatGPTLogFunctions, logId, initializedRecordId } = useRecordLogging(state, state.agentActions,
        collaborationSession, true);

    if (!collaborationSession) {
        return <div></div>
    }
    const blueprint = collaborationSession.blueprint;


    const currentValid = validCurrentStructure(actions.getCurrentBlocks(), blueprint);
    const minecraftStructure = {
        blocks: blocks,
    }


    const onSubmitFeedbackAssemble = (feedback: string, isSuccess: boolean,) => {


    }


    const payload = {
        user_id: 'value1',
        link: 'value2',
        ptask: 211,
    };


    return (
        <div className="App">
            <NavigationBar />
            <PageContent
                sx={{
                    paddingBottom: '3rem',
                    flexWrap: "wrap",
                }}
            >

                <Column
                    sx={{
                        maxWidth: "540px"
                    }}
                >

                    <MinecraftViewerContainer
                        sx={{ marginBottom: 2, flexGrow: 0, flexShrink: 0 }}
                        blocks={blocks}

                    />
                    <MinecraftMotiveViewer
                        motive={collaborationSession.config.agents[0].motives[0]}
                        sx={{
                            flexBasis: "300px"
                        }}
                    />
                    {/* <MinecraftViewerContainer
                        blocks={blueprint.spec.blocks}
                    /> */}

                </Column>
                <Column
                    sx={{
                        marginRight: '1rem',
                        flexBasis: "320px",
                        flexGrow: 1,


                    }}
                >
                    <SyncControlComp
                        agentStatus={syncState.agentStatus}
                        currentTurn={syncState.currentTurn}
                    />
                    <BiAgentHumanMachineSyncExperimentComp
                        collaborationSession={collaborationSession}
                        state={state}
                        actions={actions}
                        registerAutoExecution={registerAutoExecution}
                        updateFetchResult={updateFetchResult}
                        chatGPTLogFunctions={[]}
                        initializedRecordId={initializedRecordId ? initializedRecordId : ""}
                        syncWorldBlocks={syncWorldBlocks}
                        debug={false}
                        syncState={syncState}
                        ready={ready}
                        experimentType={ExperimentType.Batch}
                        feedbackPaylod={{
                            user_id: participantTaskMeta.userId,
                            link: linkId ? linkId : 'invalid',
                            ptask: participantTaskMeta.taskId
                        }}
                        backendVersion={backendVersion}
                        promptCheckpoint={promptCheckpoint}
                    />
                </Column>
                <Column
                    sx={{
                        marginRight: '1rem',
                        display: "flex",
                        flexDirection: "column",
                        flexBasis: "320px",
                        flexGrow: 1


                    }}>
                    <MinecraftCollaborationDialogue
                        sx={{
                            marginBottom: 2,
                            flexBasis: "300px",
                            flexGrow: 3
                        }}
                        messages={actions.getMessages()}
                    />
                    {/* <CheckpointPanel
                        sx={{ marginBottom: 2,
                            flexBasis: "150px",
                            flexGrow: 0
                        }}
                        onSave={(name: string) => {
                            return saveCheckpointAPI(authHeader(), name, collaborationSession, state);
                            // checkpointHookActions.onSave(name, state);
                        }}
                        onLoad={(checkpoint: MinecraftCollaborationCheckpoint) => {
                            checkpointHookActions.onLoad(checkpoint);
                        }}
                        checkpoints={checkpointHookState.checkpoints}
                    /> */}

                </Column>
            </PageContent>
        </div>
    )
}

export default SyncParticipantPage 