import { useEffect, useState } from "react"
import { Batch } from "../types/batch";
import { MinecraftCollaborationSession } from "../types/task";
import { AutoExecutionStatus, useAutoExecution } from "../minecraft-collaboration/auto-control/hooks";
import { useRecordLogging } from "../minecraft-collaboration/record/record-hooks";
import { validCurrentStructure } from "../minecraft-collaboration/utils/validation";
import { useMinecraftWorld } from "../minecraft-collaboration/hooks";
import { MinecraftBlock } from "../types/minecraft";
import { PromptCheckpoint } from "../types/prompt";
import { usePromptCheckpointList } from "../management/prompt-checkpoint/hooks";


function useBatchConfig(sessionList: MinecraftCollaborationSession[]) {
    const [batch, setBatch] = useState<Batch>({
        name: "Default",
        backendVersion: "gpt-3.5",
        sessionIndices: [],
        promptCheckpoint: undefined
    });


    const [contextualStatus, setContextualStatus] = useState<number>(0);

    const [runningStatus, setRunningStatus] = useState<AutoExecutionStatus>();


    const onSessionRemove = (sessionId: string) => {
        setBatch(prev => {
            return {
                ...prev,
                sessionIndices: prev.sessionIndices.filter(id => id !== sessionId)
            }
        })
    }

    return {
        batch, setBatch: (fn: (prev: Batch) => Batch) => {
            setContextualStatus(prev => prev + 1);
            setBatch(fn);
        }, runningStatus, setRunningStatus, contextualStatus, setContextualStatus, onSessionRemove
    };

}

const useBatchExecution = (sessionList: MinecraftCollaborationSession[], delayTime: number, syncWorldBlocks: (blocks: Array<MinecraftBlock>) => void) => {
    let batchConfig = useBatchConfig(sessionList);

    const {result: promptCheckpointList} = usePromptCheckpointList();
    const [runningCount, setRunningCount] = useState<number>(0);

    const [status, setStatus] = useState<AutoExecutionStatus>(AutoExecutionStatus.IDLE);


    const [promptCheckpoint, setPromptCheckpoint] = useState<PromptCheckpoint>();
    const [backendVersion, setBackendVersion] = useState<string>("gpt-4");

    let currentSession = sessionList.find(session => session.id === batchConfig.batch.sessionIndices[runningCount < batchConfig.batch.sessionIndices.length ? runningCount : batchConfig.batch.sessionIndices.length - 1])
    
    const [state, actions, systemFinsihedStatus] = useMinecraftWorld([], syncWorldBlocks, currentSession?.config);

    console.log(systemFinsihedStatus);

    const structureFinished = currentSession ? validCurrentStructure(
        actions.getCurrentBlocks(), currentSession?.blueprint
    ): false;
    const sessionFinished = systemFinsihedStatus || structureFinished;

    const { registerAutoExecution, start, updateFetchResult, currentTurn, currentAgentIndex, numTurns, setNumTurns, status: executionStatus, resetStatus: resetExecutionStatus } = useAutoExecution(sessionFinished, currentSession?.id, delayTime,);


    // const { onSaveRecord, chatGPTLogFunctions, logId, initializedRecordId } = useRecordLogging(state, state.agentActions,
    //     currentSession, true);

    const batchName = batchConfig.batch.name;


    const onStartStop = () => {
        if (status === AutoExecutionStatus.IDLE) {
            setStatus(AutoExecutionStatus.RUNNING);
        } else if (status === AutoExecutionStatus.RUNNING) {
            setStatus(AutoExecutionStatus.IDLE);
        }
    }
    useEffect(() => {
        if (status === AutoExecutionStatus.RUNNING) {
            if (executionStatus === AutoExecutionStatus.IDLE) {
                if (runningCount === 0) {
                    start();
                } else if (runningCount === batchConfig.batch.sessionIndices.length) {
                    // setStatus(AutoExecutionStatus.IDLE);
                    // setRunningCount(prev => prev + );

                } else {
                    // setRunningCount(prev => prev + 1);
                    setTimeout(() => {
                        start();
                    }, 1000);

                }

            } else if (executionStatus === AutoExecutionStatus.FINISHED) {
                if (runningCount === batchConfig.batch.sessionIndices.length) {
                    setStatus(AutoExecutionStatus.IDLE);
                    // setRunningCount(prev => prev + 1);
                }
                else {
                    // start();
                    setRunningCount(prev => prev + 1);
                }
                // resetExecutionStatus()
            } else if (
                executionStatus === AutoExecutionStatus.RUNNING
            ) {


            }


        }
    }, [status, executionStatus]);
    return { ...batchConfig, onStartStop, currentSession, runningCount, setRunningCount, status, setStatus, registerAutoExecution, updateFetchResult, currentTurn, currentAgentIndex, numTurns, setNumTurns, executionStatus, state, actions,
    promptCheckpoint, setPromptCheckpoint, backendVersion, setBackendVersion, promptCheckpointList, batchName
    }
}


export { useBatchConfig, useBatchExecution }