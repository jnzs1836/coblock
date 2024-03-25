import { useEffect, useState } from "react";
import {
    MinecraftCollaborationRecord, MinecraftCollaborationRecordTurn, ChatGPTRecordTurn, ChatGPTRecord
} from "../../types/record"
import { MinecraftCollaborationSession, MinecraftTaskAgentSpec, MinecraftTaskInstance } from "../../types/task";
import { MinecraftWorldAgentAction, MinecraftWorldState } from "../hooks";
import { MinecraftCollaborationCheckpoint } from "../../types/minecraft";
import { actions } from "react-table";
import { useActionQueueRequest, useGetAPI, useRequestWrapper } from "../../web/hooks";
import { useAuthHeader } from 'react-auth-kit';

function initializeChatGPTRecord(agentConfig: MinecraftTaskAgentSpec, agentIndex: number): ChatGPTRecord {
    return {
        agentIndex,
        turns: [],
    }
}

function generateRandomStringId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

function useRecordUpdateAPI(recordId: string | undefined, record: MinecraftCollaborationRecord | undefined, enabled: boolean, collaborationSessionId: string) {

    const [currentSessionId, setCurrentSessionId] = useState<string>();

    useEffect(() => { }, [record]);

    const authHeader = useAuthHeader();
    const [initializedRecordId, setInitializedId] = useState<string | undefined>(recordId);
    const { wrappedRequestFunc, status } = useRequestWrapper<MinecraftCollaborationRecord | undefined>(
        async (record: MinecraftCollaborationRecord, myRecordId: string, recordIdSetter: (newId: string) => void, sessionId: string) => {
            if (record && enabled) {
                let bodyData = new FormData();
                bodyData.append("session_id", sessionId);
                bodyData.append("record", JSON.stringify(record));
                if (myRecordId) {
                    return fetch(`/api/record/${myRecordId}/`, {
                        method: "PUT",
                        headers: {
                            "Authorization": authHeader(),
                        },
                        body: bodyData,
                    }).then(res => res.json()).then(
                        r => {
                            return r as MinecraftCollaborationRecord;
                        }
                    )
                } else {
                    return fetch(`/api/record/`, {
                        method: "POST",
                        headers: {
                            "Authorization": authHeader(),
                        },
                        body: bodyData,
                    }).then(res => res.json()).then(
                        r => {
                            setInitializedId(r.id);
                            return r as MinecraftCollaborationRecord;
                        }
                    )
                }
            } else {
                return undefined;
            }
        }, enabled
    );

    useEffect(() => {
        setInitializedId(undefined);
        setCurrentSessionId(collaborationSessionId);
    }, [collaborationSessionId])

    useEffect(() => {
        if (currentSessionId) {
            wrappedRequestFunc(record, initializedRecordId, setInitializedId, currentSessionId).then((r) => {
            })
        }
    }, [initializedRecordId, record, enabled, currentSessionId]);
    return { status, initializedRecordId };
}

function useRecordLogging(worldState: MinecraftWorldState, agentActions: MinecraftWorldAgentAction[], collaborationSession?: MinecraftCollaborationSession, autoSave?: boolean) {

    let taskInstance = collaborationSession?.config as MinecraftTaskInstance;

    const [record, setRecord] = useState<MinecraftCollaborationRecord>();
    const [logId, setLogId] = useState<string>("");
    useEffect(() => {
        if (collaborationSession) {
            setRecord(
                {
                    id: "",
                    turns: [],
                    chatGPTRecords: taskInstance.agents.filter(agent => agent.role === "machine").map((agent, index) => initializeChatGPTRecord(agent, index)),
                    actionHistory: []
                }
            )
            setLogId(generateRandomStringId(10));
        }

    }, [collaborationSession?.id]);
    function generateLogFunctionMap(record: MinecraftCollaborationRecord | undefined): Record<number, (messages: Array<String>, response: String) => void> {
        let functionMap: Record<number, (messages: Array<String>, response: String) => void> = {};
        record?.chatGPTRecords.forEach((chatGPTRecord, index) => {
            let fn = (messages: Array<String>, response: String) => {
                setRecord((prev: MinecraftCollaborationRecord | undefined) => {
                    if (prev) {
                        return {
                            ...prev,
                            chatGPTRecords: prev.chatGPTRecords.map((chatGPTRecord, recordIndex) => {
                                if (recordIndex === index) {
                                    return {
                                        ...chatGPTRecord,
                                        turns: [...chatGPTRecord.turns, {
                                            index: worldState.agentActions.length,
                                            messages: messages,
                                            response: response,
                                        }]
                                    }
                                } else {
                                    return chatGPTRecord;
                                }
                            })
                        }
                    } else {
                        return prev
                    }
                })
            };
            functionMap[index] = fn;
        });

        return functionMap;
    }

    let chatGPTLogFunctions = generateLogFunctionMap(record);
    const onSaveRecord = (state: MinecraftWorldState, lastAction: MinecraftWorldAgentAction) => {
        let checkpoint: MinecraftCollaborationCheckpoint = {
            sessionId: collaborationSession?.id || "",
            name: `${collaborationSession?.id || "Unknown"}-${logId}-${state.agentActions.length}`,
            state: state,
        };

        setRecord((prev: MinecraftCollaborationRecord | undefined) => {
            if (prev) {
                return {
                    ...prev,
                    turns: [...prev.turns, {
                        index: state.agentActions.length,
                        checkpoint: checkpoint,
                        lastAction,
                    }],
                    actionHistory: state.agentActions,
                }
            } else {
                return prev;
            }

        });
    }
    const lastAction = agentActions[agentActions.length - 1];
    const { addToQueue } = useActionQueueRequest<{
        worldState: MinecraftWorldState,
        lastAction: MinecraftWorldAgentAction,
    }>({
        action: async (item: {
            worldState: MinecraftWorldState,
            lastAction: MinecraftWorldAgentAction,
        }) => {
            onSaveRecord(item.worldState, item.lastAction);
            return;
            // return new Promise<void>(() => {

            //     return ;
            // })
        }
    });
    useEffect(() => {
        if (autoSave) {
            addToQueue({
                worldState, lastAction
            })
            // onSaveRecord(worldState, lastAction);
        }
    },
        [worldState, lastAction]);
    const {initializedRecordId} = useRecordUpdateAPI(
        record?.id, record, autoSave || false, collaborationSession?.id || "")

    return {
        record, setRecord, onSaveRecord, chatGPTLogFunctions, logId, initializedRecordId
    };

}

function useRecordGet(recordId: string | undefined) {
    const {result} = useGetAPI(`/api/record/${recordId}/`,true, res => {
        return res !== undefined  ? res.record as MinecraftCollaborationRecord : undefined
    });
    if(!result){
        return {
            result: undefined
        }
    }
    return {result};
}

export { useRecordLogging, useRecordGet };
