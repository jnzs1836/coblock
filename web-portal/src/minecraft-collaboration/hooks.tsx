import { useEffect, useMemo, useState } from 'react';
import { MinecraftBlock, MinecraftBlockPos, MinecraftCollaborationCheckpoint, MinecraftWorldAgent, MinecraftWorldAgentInventoryBlockState, MinecraftWorldAgentState, MinecraftWorldAgentAction, MinecraftWorldState } from '../types/minecraft';
import { generateUId } from '../types/utils';
import useSWR from 'swr'
import { useAuthHeader } from 'react-auth-kit';
import { MinecraftBlueprint } from '../types/minecraft';
import { useNavigate } from 'react-router-dom';
import { MinecraftCollaborationSession, MinecraftTaskInstance } from '../types/task';
import { PromptCheckpoint, convertResponseToPrompCheckpoint } from '../types/prompt';
import { MinecraftWorldAgentActionResponse, MinecraftWorldAgentMessageAction, MinecraftWorldAgentNullAction, MinecraftWorldAgentEndAction, MinecraftWorldAgentBreakAction, MinecraftWorldAgentPlaceAction } from "../types/agent"
import {
    MinecraftWorldAgentControlState, MinecraftWorldAgentControlActions, MinecraftWorldActions
} from "../types/world";
import { computeAgentActionBudget, computeAgentCurrentActionBatch } from "./utils/budget"
import { generateCurrentBlocks } from "./utils/current";
import { getActionResponseAnyType } from './utils/action-response';
import { ParticipantTaskMeta } from './types';


const useMinecraftWorld = (initialBlocks: MinecraftBlock[], syncBlocks: (blocks: MinecraftBlock[],

) => void, taskConfig: MinecraftTaskInstance | undefined
): [MinecraftWorldState, MinecraftWorldActions, boolean] => {
    const [initialized, setInitialized] = useState<boolean>(false);

    const initialState = useMemo<MinecraftWorldState>(() => {
        return {
            initiablocks: [],
            initialAgentStates: [
                {
                    agent: {
                        role: taskConfig ? taskConfig.agents[0].role : "human",
                        name: taskConfig ? taskConfig.agents[0].name : "user"
                    },
                    inventory: taskConfig ? taskConfig.agents[0].inventory : []
                    // [{blockType: "red", count: 10}, {blockType: "yellow", count: 10}, {blockType: "blue", count: 10}]
                },
                {
                    agent: {
                        role: taskConfig ? taskConfig.agents[1].role : "assistant",
                        name: taskConfig ? taskConfig.agents[1].name : "assistant"
                    },
                    inventory: taskConfig ? taskConfig.agents[1].inventory : []
                    // [{blockType: "purple", count: 10}, {blockType: "green", count: 10}, {blockType: "blue", count: 10}]
                }
            ],
            agentActions: [

            ],
            agents: [
                {
                    role: taskConfig ? taskConfig.agents[0].role : "human",
                    name: taskConfig ? taskConfig.agents[0].name : "user"
                },
                {
                    role: taskConfig ? taskConfig.agents[1].role : "assistant",
                    name: taskConfig ? taskConfig.agents[1].name : "assistant"
                }
            ],
            initialized: false,
            agentActionBudgetAdjustRecords: []
        };
    }, []);
    const [state, setState] = useState<MinecraftWorldState>(initialState);


    useEffect(() => {

        setState(
            {
                initiablocks: initialBlocks,
                initialAgentStates: [
                    {
                        agent: {
                            role: taskConfig ? taskConfig.agents[0].role : "human",
                            name: taskConfig ? taskConfig.agents[0].name : "user"
                        },
                        inventory: taskConfig ? taskConfig.agents[0].inventory : []
                    },
                    {
                        agent: {
                            role: taskConfig ? taskConfig.agents[1].role : "assistant",
                            name: taskConfig ? taskConfig.agents[1].name : "assistant"
                        },
                        inventory: taskConfig ? taskConfig.agents[1].inventory : []
                    }
                ],
                agentActions: [

                ],
                agents: [
                    {
                        role: taskConfig ? taskConfig.agents[0].role : "human",
                        name: taskConfig ? taskConfig.agents[0].name : "user"
                    },
                    {
                        role: taskConfig ? taskConfig.agents[1].role : "assistant",
                        name: taskConfig ? taskConfig.agents[1].name : "assistant"
                    },
                ],
                initialized: true,
                agentActionBudgetAdjustRecords: []
            }
        );
        setInitialized(true);

    }, [taskConfig]);



    const addAgentAction = (action: MinecraftWorldAgentAction) => {

        switch (action.actionType) {
            case "break":
                let breakAction = action as MinecraftWorldAgentBreakAction;

        }

        setState((prev: MinecraftWorldState) => {
            return {
                ...prev,
                agentActions: [...prev.agentActions, action]
            }
        });
        return {
            success: true,
            message: ""
        }
    }

    const agentActionPlaceBlock = (blockType: string, blockPos: MinecraftBlockPos,
        agentName: string
    ) => {

        const action: MinecraftWorldAgentPlaceAction = {
            agentName: agentName,
            actionType: "place",
            blockType,
            blockPos,
            uid: generateUId()
        };
        addAgentAction(action);
    }

    const agentActionBreakBlock = (uid: string, agentName: string) => {
        const action: MinecraftWorldAgentBreakAction = {
            agentName: agentName,
            actionType: "break",
            uid
        };
        addAgentAction(action);
    }

    const agentActionMessage = (agentName: string, message: string) => {
        const action: MinecraftWorldAgentMessageAction = {
            agentName: agentName,
            actionType: "message",
            message
        };
        addAgentAction(action);
    }

    const agentEndSessionMessage = (agentName: string, message: string) => {
        const action: MinecraftWorldAgentEndAction = {
            agentName: agentName,
            actionType: "end_session",
            message
        };
        addAgentAction(action);
    }

    const agentNullAction = (agentName: string) => {
        const action: MinecraftWorldAgentNullAction = {
            agentName: agentName,
            actionType: "null",
        };
        addAgentAction(action);
    }



    const getMessages = () => {
        return state.agentActions.filter((action) => action.actionType === "message").map((action) => {
            return {
                sender: (action as MinecraftWorldAgentMessageAction).agentName,
                message: (action as MinecraftWorldAgentMessageAction).message
            }
        }
        );
    };

    const generateAgentControlProps = (agentName: string, allowAlert?: boolean) => {
        let inventory = state.initialAgentStates.find((agentState) => agentState.agent.name === agentName)?.inventory;

        let agent = state.agents.find((agent) => agent.name === agentName);

        if (!inventory) {
            inventory = [];
        }
        const agentState: MinecraftWorldAgentControlState = {
            inventory,
            breakableBlocks: generateCurrentBlocks(state.initiablocks, state.agentActions),
            allowAction: true
        };

        const agentActions: MinecraftWorldAgentControlActions = {
            breakBlock: (uid: string) => {
                if (!agent) {
                    return {
                        success: false,
                        message: `Block with uid ${uid} not found`
                    }
                }
                let budget = computeAgentActionBudget(agentName, state);
                if (budget <= 0) {
                    alert("Cannot do more action. Please submit the current batch first.");
                    return {
                        success: false,
                        message: `Batch full`
                    };
                }
                agentActionBreakBlock(uid, agent.name);
                return {
                    success: true,
                    message: `Block with uid ${uid} broken`
                }
            }
            ,
            placeBlock: (blockType: string, pos: MinecraftBlockPos) => {
                if (!agent) {
                    return {
                        success: false,
                        message: `Agent ${agentName} not found`
                    }
                }
                let budget = computeAgentActionBudget(agentName, state);
                if (budget <= 0) {
                    alert("Cannot do more action. Please submit the current batch first.");
                    return {
                        success: false,
                        message: `Batch full`
                    };
                }
                let currentBlocks = generateCurrentBlocks(state.initiablocks, state.agentActions);
                let searchBlock = currentBlocks.find((block) => block.pos.x === pos.x && block.pos.y === pos.y && block.pos.z === pos.z);
                if (searchBlock) {
                    alert("Cannot do build the block as it exists");
                    return {
                        success: false,
                        message: "Block exists"
                    }
                }

                agentActionPlaceBlock(blockType, pos, agent.name);
                return {
                    success: true,
                    message: `Block with type ${blockType} placed`
                }
            },
            sendMessage: (message: string) => {
                if (!agent) {
                    return {
                        success: false,
                        message: `Agent ${agentName} not found`
                    }
                }
                let budget = computeAgentActionBudget(agentName, state);
                if (budget <= 0) {
                    alert("Cannot do more action. Please submit the current batch first.");
                    return {
                        success: false,
                        message: `Batch full`
                    }
                }
                agentActionMessage(agent.name, message);
                return {
                    success: true,
                    message: "Message sent"
                }
            },
            endSession: (message: string) => {
                if (!agent) {
                    return {
                        success: false,
                        message: `Agent ${agentName} not found`
                    }
                }
                agentEndSessionMessage(agent.name, message);
                return {
                    success: true,
                    message: "Session ended"
                }
            },
            nullAction: () => {
                if (!agent) {
                    return {
                        success: false,
                        message: `Agent ${agentName} not found`
                    }
                }
                agentNullAction(agent.name);
                return {
                    success: true,
                    message: "Null action"
                }
            },
            preCheckAction(action: MinecraftWorldAgentAction) {
                return getActionResponseAnyType(action, state);
            },
            getAgentName() {
                return agentName;
            }
        }

        return { state: agentState, actions: agentActions };

    }

    const findUIdByPos = (pos: MinecraftBlockPos) => {
        const block = getCurrentBlocks().find((block) => block.pos.x === pos.x && block.pos.y === pos.y && block.pos.z === pos.z);
        if (block) {
            return block.uid;
        }
        return null;
    }


    const getCurrentBlocks = () => {
        return generateCurrentBlocks(state.initiablocks, state.agentActions);
    }

    const getState = () => {
        return state;
    }


    const loadState = (newState: MinecraftWorldState) => {
        setState(newState);
    }

    const addAgentAdjust = (agentName: string) => {
        setState((prev: MinecraftWorldState) => {
            let actionStep = prev.agentActions.length;
            return {
                ...prev,
                agentActionBudgetAdjustRecords: [...prev.agentActionBudgetAdjustRecords, { agentName, actionStep }]
            }
        }
        );
    }

    const getAgentCurrentActionBatch = (agentName: string) => {
        return computeAgentCurrentActionBatch(agentName, state);
    }


    const actions: MinecraftWorldActions = {
        addAgentAction,
        generateAgentControlProps,
        getMessages,
        getCurrentBlocks,
        getState,
        loadState,
        addAgentAdjust,
        getAgentCurrentActionBatch
    };

    useEffect(() => {
        syncBlocks(generateCurrentBlocks(state.initiablocks, state.agentActions));
    }, [state.agentActions, state.agentActions.length]);
    const allAgentsFinished = state.agents.map((agent) => { return state.agentActions.filter(d => d.agentName === agent.name && d.actionType === "end_session").length > 0 }).reduce((prev, curr) => prev && curr, true);

    // state.agentActions.filter(d => d.actionType === "end_session").length > 0
    return [state, actions, allAgentsFinished];
};


function useCollaborationSessionGETAPI(sessionId?: string) {
    const authHeader = useAuthHeader();

    const fetcher = (url: URL) => fetch(url,
        {
            method: 'GET',
            headers: {
                // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                'Authorization': authHeader()
                // ...authHeader(),
            },
        }
    ).then(r => r.json()).then((data) => {
        let newData = {
            ...data,
        }
        if (data) {
            newData.config = data.task_config;
        }

        if (newData && newData.config) {

            newData = {
                ...newData,
                config: {
                    ...newData.config,
                    promptCheckpoint: convertResponseToPrompCheckpoint(newData?.prompt_checkpoint),
                }
            }
        }
        return newData
    })
    let { data, error, isLoading } = useSWR(`/api/collaboration/${sessionId}/`, fetcher);



    const dataAsCollaborationSession = data as MinecraftCollaborationSession;
    return { data: dataAsCollaborationSession, error, isLoading }

}

function useCollaborationExperimentGETAPI(link?: string) {
    const authHeader = useAuthHeader();

    const fetcher = (url: URL) => fetch(url,
        {
            method: 'GET',
            headers: {
            },
        }
    ).then(r => r.json()).then((data) => {
        let sessionData = {
            ...data.session,
        }
        if (sessionData) {
            sessionData.config = sessionData.task_config;
        }

        if (sessionData && sessionData.config) {
            // console.log(sessionData?.prompt_checkpoint)
            sessionData = {
                ...sessionData,
                config: {
                    ...sessionData.config,
                    promptCheckpoint: convertResponseToPrompCheckpoint(sessionData?.prompt_checkpoint),
                }
            }
        }
        let backendVersion = data.backend_version;
        // let promptCheckpoint = data.prompt_checkpoint;
        const promptCheckpoint = convertResponseToPrompCheckpoint(data?.prompt_checkpoint) as PromptCheckpoint;

        return {sessionData, backendVersion, promptCheckpoint}
    })
    let { data, error, isLoading } = useSWR(`/api/w/${link}/`, fetcher);



    const dataAsCollaborationSession = data?.sessionData as MinecraftCollaborationSession;
    let backendVersion = data?.backendVersion as string;
    let promptCheckpoint = data?.promptCheckpoint as PromptCheckpoint;
    
    return { data: {collaborationSession: dataAsCollaborationSession, backendVersion, promptCheckpoint}, error, isLoading }

}


interface CollaborationSessionHookState {
    collaborationSession: MinecraftCollaborationSession,
}
interface CollaborationSessionHookActions {

}

function useCollaborationSession(sessionId?: string) {
    const { data: collaborationSession, error, isLoading } = useCollaborationSessionGETAPI(sessionId);

    return {
        state: {
            collaborationSession, isLoading
        },
        actions: {

        }
    }

}


function useCollaborationExperiment(linkId?: string) {
    const { data: {collaborationSession, backendVersion, promptCheckpoint}, error, isLoading } = useCollaborationExperimentGETAPI(linkId);

    
    return {
        state: {
            collaborationSession, isLoading, backendVersion, promptCheckpoint
        },
        actions: {

        }
    }

}


function useParticipantExperimentGETAPI(link?: string) {

    const fetcher = (url: URL) => fetch(url,
        {
            method: 'GET',
            headers: {
            },
        }
    ).then(r => r.json()).then((participantData) => {
        const data = participantData.experiment;
        let sessionData = {
            ...data.session,
        }
        if (sessionData) {
            sessionData.config = sessionData.task_config;
        }

        if (sessionData && sessionData.config) {
            sessionData = {
                ...sessionData,
                config: {
                    ...sessionData.config,
                    promptCheckpoint: convertResponseToPrompCheckpoint(sessionData?.prompt_checkpoint),
                }
            }
        }
        
        const participantTaskMeta: ParticipantTaskMeta = {
            userId: participantData.participant,
            taskId: participantData.id,
            link: participantData.link,
        }
        const backendVersion = data?.backend_version as string;
        const promptCheckpoint = convertResponseToPrompCheckpoint(data?.prompt_checkpoint) as PromptCheckpoint;
        return { sessionData, participantTaskMeta, backendVersion, promptCheckpoint }
    })
    let { data, error, isLoading } = useSWR(`/api/pt/${link}/`, fetcher);


    const dataAsCollaborationSession = data?.sessionData as MinecraftCollaborationSession;
    const participantTaskMeta = data?.participantTaskMeta as ParticipantTaskMeta;
    const backendVersion = data?.backendVersion as string;
    const promptCheckpoint = data?.promptCheckpoint as PromptCheckpoint;
    return { data: dataAsCollaborationSession, error, isLoading, participantTaskMeta, backendVersion, promptCheckpoint }

}


function useParticipantExperiment(linkId?: string) {
    const { data: collaborationSession, error, isLoading, participantTaskMeta, backendVersion, promptCheckpoint } = useParticipantExperimentGETAPI(linkId);
    return {
        state: {
            collaborationSession, isLoading, participantTaskMeta, backendVersion, promptCheckpoint
        },
        actions: {

        }
    }
}


export { useMinecraftWorld, useCollaborationSession, useCollaborationExperiment, generateCurrentBlocks, generateUId, useParticipantExperiment };


export type {
    MinecraftWorldState, MinecraftWorldActions, MinecraftWorldAgentPlaceAction, MinecraftWorldAgentBreakAction, MinecraftWorldAgentMessageAction, MinecraftWorldAgent, MinecraftWorldAgentState, MinecraftWorldAgentAction,
    MinecraftWorldAgentControlState, MinecraftWorldAgentControlActions,
    CollaborationSessionHookActions, CollaborationSessionHookState,
    MinecraftWorldAgentEndAction, MinecraftWorldAgentNullAction,
};