import { useEffect, useState } from "react";
import { RequestStatus } from "../../chatgpt/chatgpt-hooks";
import { validCurrentStructure } from "../utils/validation";

interface AgentAutoMeta {
    sessionId: string,
    fetchAction: (delayTime?: number) => void;
    result: string;
    fetchStatus: RequestStatus;
    postAction: (text: string) => void;
    index: number
};

enum AutoExecutionStatus {
    IDLE = "IDLE",
    READY = "READY",
    RUNNING = "RUNNING",
    FINISHED = "FINISHED",
    ABORTED = "ABORTED",
    ERROR = "ERROR",
}

enum WithinStepStatus {
    Idle,
    Fetching,
    Processing,
    Processed,
    Error,
    Delaying
}

const useAutoExecution = (sessionFinished: boolean, sessionId?: string, delayTime: number = 0) => {

    const [numTurns, setNumTurns] = useState<number>(8);
    const [status, setStatus] = useState<AutoExecutionStatus>(AutoExecutionStatus.IDLE);

    const [agentMetaList, setAgentMetaList] = useState<AgentAutoMeta[]>([]);


    const [currentTurn, setCurrentTurn] = useState<number>(0);
    const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(0);
    const [withinStepStatus, setWithinStepStatus] = useState<WithinStepStatus>(WithinStepStatus.Idle);


    useEffect(() => {

    }, [currentTurn]);

    let currentAgentMeta = agentMetaList[currentAgentIndex];

    let fetchStatus = currentAgentMeta?.fetchStatus;



    useEffect(() => {
        if (status === AutoExecutionStatus.RUNNING) {
            if (withinStepStatus === WithinStepStatus.Idle) {
                currentAgentMeta.fetchAction(delayTime);
                setWithinStepStatus(WithinStepStatus.Fetching);
            } else if (withinStepStatus === WithinStepStatus.Fetching) {
                if (currentAgentMeta.fetchStatus === RequestStatus.SUCCESS) {

                    // setWithinStepStatus(WithinStepStatus.Processing);
                    currentAgentMeta.postAction(currentAgentMeta.result);
                    setWithinStepStatus(WithinStepStatus.Processed);
                }
            }
            else if (withinStepStatus === WithinStepStatus.Processed) {
                if (currentAgentIndex === agentMetaList.length - 1) {
                    if (currentTurn === numTurns - 1) {
                        setStatus(AutoExecutionStatus.FINISHED);
                        setCurrentTurn(0);
                        setCurrentAgentIndex(0);
                    } else {
                        setCurrentTurn(currentTurn + 1);
                        setCurrentAgentIndex(0);
                    }

                } else {
                    setCurrentAgentIndex(currentAgentIndex + 1);
                }
                // setWithinStepStatus(WithinStepStatus.Idle);
                setWithinStepStatus(WithinStepStatus.Idle);

            }
            else if (withinStepStatus === WithinStepStatus.Error) {
                setStatus(AutoExecutionStatus.ERROR);
            } else if (withinStepStatus === WithinStepStatus.Delaying) {
                setTimeout(() => {
                    setWithinStepStatus(WithinStepStatus.Idle);
                }
                    , delayTime);
            }
        }

    }, [status, withinStepStatus, currentAgentMeta, fetchStatus, sessionFinished]);
    useEffect(() => {

    }, [status]);

    useEffect(() => {
        setStatus(AutoExecutionStatus.IDLE);
        setCurrentTurn(0);
        setCurrentAgentIndex(0);
        setWithinStepStatus(WithinStepStatus.Idle);
        // setAgentMetaList([]);
        setAgentMetaList(prev => {
            return prev.filter(d => parseInt(d.sessionId) === parseInt(sessionId?.toString() || ""))
        });
    }, [sessionId]);

    useEffect(() => {
        if (sessionFinished) {
            setStatus(AutoExecutionStatus.FINISHED);
            setCurrentTurn(0);
            setCurrentAgentIndex(0);
        }
    }, [sessionFinished])

    return {
        currentTurn,
        numTurns,
        setNumTurns,
        status,
        currentAgentIndex,
        start: async () => {
            if (!sessionFinished) {
                setStatus(AutoExecutionStatus.RUNNING);
            }
        },
        registerAutoExecution: (actionMeta: AgentAutoMeta, index: number) => {
            let rand = Math.random(); //Generate Random number between 5 - 10
            // console.log("[debug]: myrand", rand);
            setTimeout(() => {
                setAgentMetaList(prevList => {
                    // console.log("[debug]: my", prevList);
                    let pushedArray = [...prevList, actionMeta];
                    pushedArray.sort((a, b) => { return a.index - b.index });
                    return [...pushedArray]
                }
                    // [...prevList, actionMeta]
                    // console.log("[debug]: my", prevList);
                    // let pushedArray = [...prevList, actionMeta];
                    // pushedArray.sort((a, b) => { return a.index - b.index });
                    // return [...pushedArray]
                );
            }, rand * 100);


        },
        updateFetchResult: (result: string, status: RequestStatus, index: number) => {
            let newAgentMeta = agentMetaList[index];
            if (newAgentMeta) {
                newAgentMeta.result = result;
                newAgentMeta.fetchStatus = status;
                setAgentMetaList([...agentMetaList]);
            }

        },
        resetStatus: () => {
            // setStatus(AutoExecutionStatus.IDLE);
            setStatus(AutoExecutionStatus.IDLE);
            setCurrentTurn(0);
            setCurrentAgentIndex(0);
            setWithinStepStatus(WithinStepStatus.Idle);


        }
    }
}

export { useAutoExecution, AutoExecutionStatus };
export type { AgentAutoMeta };