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
import { useCollaborationExperiment, useCollaborationSession, useMinecraftWorld } from '../minecraft-collaboration/hooks';
import MinecraftCollaborationDialogue from '../minecraft-collaboration/minecraft-collaboration-dialogue';
import MinecraftChatGPTPanel from '../minecraft-collaboration/minecraft-chatgpt-panel';
import { withAuthUser, useAuthUser, useAuthHeader } from 'react-auth-kit'
import { useParams } from 'react-router-dom';
import CheckpointPanel from "../minecraft-collaboration/checkpoint/checkpoint-panel";
import { useCollaborationCheckpoint } from '../minecraft-collaboration/checkpoint/checkpoint-hooks';
import { saveCheckpointAPI } from '../minecraft-collaboration/checkpoint/api';
import { MinecraftTaskAgentSpec } from "../types/task";
import CollaborationAutoControlPanel from "../minecraft-collaboration/auto-control/collaboration-auto-control-panel"
import { useAutoExecution } from '../minecraft-collaboration/auto-control/hooks';
import { useRecordLogging } from '../minecraft-collaboration/record/record-hooks';
import ExperimentConfigForm from '../minecraft-collaboration/experiment-config.tsx/experiment-config-form';
import { ExperimentConfig } from '../types/experiment';
import { useExperimentConfig } from '../minecraft-collaboration/experiment-config.tsx/hooks';
import BiAgentMachineOnlyExperimentComp from '../bi-agent/bi-agent-machine-only-experiment-comp';
import MinecraftMotiveViewer from '../minecraft-viewer/minecraft-motive-viewer';

const Column = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    height: '100vh',
    color: 'white',
    marginLeft: '1rem',
});

const Row = styled('div')({
    display: 'flex',
    flexDirection: 'row',
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

function CollaborationPage() {

    const { sessionId } = useParams();
    const [blocks, setBlocks] = React.useState<Array<MinecraftBlock>>([]);
    // const {blueprint} = useMinecraftBlueprint();
    const syncWorldBlocks = (blocks: MinecraftBlock[]) => {
        setBlocks(blocks);
    }
    const { state: { collaborationSession, isLoading } } = useCollaborationSession(sessionId);
    const [state, actions, sessionFinished] = useMinecraftWorld([], syncWorldBlocks, collaborationSession?.config);

    const { state: checkpointHookState, actions: checkpointHookActions } = useCollaborationCheckpoint(actions.loadState, collaborationSession);


    const authHeader = useAuthHeader();

    const {
        registerAutoExecution, start, updateFetchResult, currentTurn, currentAgentIndex, numTurns, setNumTurns, status: executionStatus
    } = useAutoExecution(sessionFinished);

    const { onSaveRecord, chatGPTLogFunctions, initializedRecordId } = useRecordLogging(state, state.agentActions,
        collaborationSession, true);


    const { experimentConfig, onUpdateMode, onUpdatePrompt, promptCheckpointList } = useExperimentConfig(collaborationSession);


    if (!collaborationSession) {
        return <div></div>
    }
    const blueprint = collaborationSession.blueprint;



    const minecraftStructure = {
        blocks: blocks,
    }

    const renderAgentPanel = (agentConfig: MinecraftTaskAgentSpec, index: number) => {
        if (agentConfig.role === "machine") {
            return (
                <MinecraftChatGPTPanel
                    sessionId={sessionId ? sessionId : ""}
                    key={index}
                    blueprint={blueprint.spec}
                    minecraftWorldState={state}
                    minecraftWorldActions={actions}
                    promptCheckpoint={collaborationSession.config.promptCheckpoint}
                    agent={{
                        name: agentConfig.name,
                        role: agentConfig.role,
                    }}
                    registerAutoExecution={registerAutoExecution}
                    updateFetchResult={updateFetchResult}
                    agentConfig={agentConfig}
                    agentIndex={index}
                    logChatGPT={chatGPTLogFunctions ? chatGPTLogFunctions[index] : undefined}
                    backendVersion='gpt-4'
                />
            )
        } else {
            return (<MinecraftCollaborationInput
                key={index}
                state={state}
                actions={actions}
                syncBlocks={syncWorldBlocks}
                agentConfig={agentConfig}
            />)
        }
    }

    return (
        <div className="App">
            <NavigationBar />
            <PageContent
                sx={{
                    paddingBottom: '3rem',
                }}
            >

                <Column>
                    <MinecraftViewerContainer
                        sx={{ marginBottom: 2 }}
                        blocks={blocks}
                    />
                    {/* <MinecraftViewerContainer
                        blocks={blueprint.spec.blocks}
                    /> */}
                    <MinecraftMotiveViewer
                        motive={collaborationSession.config.agents[0].motives[0]}
                        sx={{
                            flexBasis: "300px"
                        }}
                    />

                </Column>
                <Column
                    sx={{
                        marginRight: '1rem',

                    }}
                >

                    <ExperimentConfigForm
                        experimentConfig={experimentConfig}
                        onUpdateMode={onUpdateMode}
                        onUpdatePrompt={onUpdatePrompt}
                        promptCheckpointList={promptCheckpointList}
                    />

                    <CollaborationAutoControlPanel
                        currentTurn={currentTurn}
                        currentAgentIndex={currentAgentIndex}
                        start={start}
                        numTurns={numTurns}
                        setNumTurns={setNumTurns}
                        status={executionStatus}
                        sessionFinished={sessionFinished}
                    />
                    <BiAgentMachineOnlyExperimentComp
                        collaborationSession={collaborationSession}
                        state={state}
                        actions={actions}
                        // promptCheckpoint={collaborationSession.config.promptCheckpoint}
                        registerAutoExecution={registerAutoExecution}
                        updateFetchResult={updateFetchResult}
                        chatGPTLogFunctions={chatGPTLogFunctions}
                        initializedRecordId={initializedRecordId ? initializedRecordId : ""}
                        syncWorldBlocks={syncWorldBlocks}
                        debug={false}
                        backendVersion='gpt-4'
                    />
                </Column>
                <Column
                    sx={{
                        marginRight: '1rem',

                    }}>
                    <MinecraftCollaborationDialogue
                        sx={{ marginBottom: 2 }}
                        messages={actions.getMessages()}
                    />
                    <CheckpointPanel
                        onSave={(name: string) => {
                            return saveCheckpointAPI(authHeader(), name, collaborationSession, state);
                            // checkpointHookActions.onSave(name, state);
                        }}
                        onLoad={(checkpoint: MinecraftCollaborationCheckpoint) => {
                            checkpointHookActions.onLoad(checkpoint);
                        }}
                        checkpoints={checkpointHookState.checkpoints}
                    />

                </Column>
            </PageContent>
        </div>
    )
}

export default CollaborationPage