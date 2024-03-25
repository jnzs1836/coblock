import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import '../App.css';
import NavigationBar from '../page/navigation-bar';
import PageContent from '../page/page-content';
import MinecraftViewerContainer from '../minecraft-viewer/minecraft-viewer-container';
// import styled from '@emotion/styled';
import { styled, Button, Card } from "@mui/material"
import { MinecraftBlock } from '../types/minecraft';
import { useMinecraftBlueprint } from '../minecraft-blueprint/blueprint-hooks';
import { useMinecraftWorld } from '../minecraft-collaboration/hooks';
import { Column, FlexStartColumn, StyledCard, StyledCardContent, StyledCardHeader } from '../page/styled-components';
import BlueprintTable from '../management/blueprint-table';
import { useBlueprintListAPI, useBlueprintTable } from '../management/blueprint-management-hooks';
import TaskConfigPanel from '../management/task-config/task-config-panel';
import { useTaskConfig } from '../management/task-config/hooks';
import TaskAgentEditPanel from '../management/task-config/task-agent-edit-panel';
import TaskSpecConfig from "../management/task-config/task-spec-config";
import BlueprintSelection from "../management/task-config/task-blueprint-select";
import TaskAgentConfigPanel from "../management/task-config/task-agent-config-panel";
import { TaskWorkLoadType, TaskMotiveType, TaskSkillsetType, MinecraftTaskSpec, MinecraftTaskInstance, StructureMotiveInstance, MinecraftCollaborationSession } from "../types/task";
import BatchControlPanel from '../minecraft-batch/batch-control-panel';
import CollaborationSessionTable from '../management/collaboration-session-table';
import { useCollaborationSessionTable } from '../management/session-hooks';
import { Batch } from '../types/batch';
import { useBatchExecution } from '../minecraft-batch/hooks';
import { AutoExecutionStatus, useAutoExecution } from '../minecraft-collaboration/auto-control/hooks';
import { renderAgentPanel } from '../minecraft-collaboration/collaboration-components';
import { useCollaborationSession } from '../minecraft-collaboration/hooks';
import { useCollaborationCheckpoint } from '../minecraft-collaboration/checkpoint/checkpoint-hooks';
import BatchStatusMonitor from '../minecraft-batch/batch-status-monitor';
import { useRecordLogging } from '../minecraft-collaboration/record/record-hooks';
import BiAgentMachineOnlyExperimentComp from '../bi-agent/bi-agent-machine-only-experiment-comp';
import { usePromptCheckpointList } from '../management/prompt-checkpoint/hooks';
import { useBatchLogger } from '../minecraft-batch/logger';


export default function BatchExecutionPage() {

    const {
        collaborationSessions, onSessionResume, onSessionDelete,
    } = useCollaborationSessionTable();
    const [delayTime, setDelayTime] = useState<number>(0);



    const [blocks, setBlocks] = React.useState<Array<MinecraftBlock>>([]);
    // const {blueprint} = useMinecraftBlueprint();
    const syncWorldBlocks = (blocks: MinecraftBlock[]) => {
        setBlocks(blocks);
    }



    const { batch, setBatch, runningStatus, setRunningStatus, onStartStop, contextualStatus, currentSession, onSessionRemove, runningCount, registerAutoExecution, updateFetchResult, currentTurn, currentAgentIndex, numTurns, setNumTurns, status: executionStatus, state, actions, backendVersion, setBackendVersion,
        promptCheckpoint, setPromptCheckpoint, promptCheckpointList, batchName
    } = useBatchExecution(collaborationSessions, delayTime, syncWorldBlocks);


    const { state: checkpointHookState, actions: checkpointHookActions } = useCollaborationCheckpoint(actions.loadState, currentSession);

    const { onSaveRecord, chatGPTLogFunctions, initializedRecordId } = useRecordLogging(state, state.agentActions,
        currentSession, true);

    const { batchLog, setBatchLog} = useBatchLogger(
        initializedRecordId, currentSession
    )



    useEffect(() => {

    }, []);


    console.log(runningCount);



    return (
        <div className="App">
            <NavigationBar />
            <PageContent>
                <FlexStartColumn
                    sx={{
                        flex: 1,
                        flexGrow: 2
                    }}
                >
                    <BatchControlPanel
                        batch={batch}
                        onBatchUpdate={setBatch}
                        onStartStop={onStartStop}
                        isRunning={runningStatus === AutoExecutionStatus.RUNNING}
                        delayTime={delayTime}
                        setDelayTime={setDelayTime}
                        promptCheckpoint={promptCheckpoint}
                        setPromptCheckpoint={setPromptCheckpoint}
                        backendVersion={backendVersion}
                        setBackendVersion={setBackendVersion}
                        promptCheckpointList={promptCheckpointList}
                        batchLog={batchLog}
                    />
                    <StyledCard>

                        <CollaborationSessionTable
                            sessions={collaborationSessions}
                            onSessionResume={onSessionResume}
                            onSessionDelete={onSessionDelete}
                            additionalActions={[
                                {
                                    name: "Start Batch",
                                    onClick: (session: MinecraftCollaborationSession) => {
                                        setBatch((prev) => ({
                                            ...prev,
                                            sessionIndices: [...prev.sessionIndices, session.id]
                                        }))
                                    },
                                    disabledText: "Batch is running",
                                    enabled: (session: MinecraftCollaborationSession) => !batch.sessionIndices.includes(session.id),
                                }
                            ]}
                            contextualStatus={contextualStatus}
                        />

                    </StyledCard>
                </FlexStartColumn>
                <FlexStartColumn
                    sx={{
                        flex: 1,
                        flexGrow: 2
                    }}
                >
                    <BatchStatusMonitor
                        batch={batch}
                        runningCount={runningCount}
                        onSessionRemove={onSessionRemove}
                        collaborationSessions={collaborationSessions}
                        isRunning={runningStatus === AutoExecutionStatus.RUNNING}
                    />
                    {
                        currentSession && <BiAgentMachineOnlyExperimentComp
                            key={currentSession.id}
                            collaborationSession={currentSession}
                            state={state}
                            actions={actions}
                            registerAutoExecution={registerAutoExecution}
                            updateFetchResult={updateFetchResult}
                            chatGPTLogFunctions={chatGPTLogFunctions}
                            initializedRecordId={initializedRecordId ? initializedRecordId : ""}
                            syncWorldBlocks={syncWorldBlocks}
                            debug={true}
                            backendVersion={backendVersion}
                            promptCheckpoint={promptCheckpoint}
                        />
                    }

                    {/* {
                        currentSession?.config.agents.map((agentConfig, index) => {
                            return renderAgentPanel(
                                currentSession.id,
                                agentConfig, index, state, actions,
                                currentSession.blueprint.spec, currentSession,
                                registerAutoExecution,
                                updateFetchResult,
                                syncWorldBlocks,
                                chatGPTLogFunctions[index]
                            );
                        }
                        )
                    } */}

                    {/* <MinecraftEditor
                syncBlocks={setBlocks}
                blocks={initialBlocks}
                /> */}

                </FlexStartColumn>
            </PageContent>
        </div>
    )
}