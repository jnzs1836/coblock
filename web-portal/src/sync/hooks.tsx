import { useEffect, useMemo, useState } from "react";
import { MinecraftWorldAgentBreakAction, MinecraftWorldAgentEndAction, MinecraftWorldAgentMessageAction, MinecraftWorldAgentNullAction, MinecraftWorldAgentPlaceAction, generateUId, useCollaborationSession, useMinecraftWorld } from "../minecraft-collaboration/hooks";
import { MinecraftBlock, MinecraftWorldAgentAction, MinecraftWorldState, MinecraftBlockPos } from "../types/minecraft";
import { MinecraftTaskInstance } from "../types/task";
import { MinecraftWorldActions } from "../minecraft-collaboration/hooks";
import { type } from "os";
import { getActionResponseAnyType, getBreakActionResponse, getPlaceActionResponse } from "../minecraft-collaboration/utils/action-response";

enum SyncWorldStatus { }

const reduceAgentActions = (agentActions: Array<MinecraftWorldActions>) => { }

interface SyncState {
    agentStatus: Array<boolean>;
    currentTurn: number
}


function useSyncWorld(initialBlocks: MinecraftBlock[], syncBlocks: (blocks: MinecraftBlock[]
) => void, taskConfig: MinecraftTaskInstance | undefined, numActionPerTurn?: number, allowAsync?: boolean): [MinecraftWorldState, MinecraftWorldActions, boolean, SyncState, boolean] {

    const [currentTurnAgentActions, setCurrentTurnAgentActions] = useState<Array<MinecraftWorldAgentAction>>([]);

    const [executionCount, setExecutionCount] = useState<number>(0);
    let validNumActionPerTurn = numActionPerTurn ? numActionPerTurn : 1;

    const [currentTurn, setCurrentTurn] = useState<number>(0);

    const [blocks, setBlocks] = useState<Array<MinecraftBlock>>([]);
    const [state, actions, sessionFinished] = useMinecraftWorld(initialBlocks, syncBlocks, taskConfig);
    const syncState: SyncState = {
        agentStatus: taskConfig?.agents.map(agent => currentTurnAgentActions.map(d => d.agentName).includes(agent.name)) || [],
        currentTurn: currentTurn
    };


    const checkAllowActionStatus = (agentName: string) => currentTurnAgentActions.filter(mAction => mAction.agentName === agentName).length < validNumActionPerTurn



    let checkAgentValidForAction = useMemo(() => {
        return (action: MinecraftWorldAgentAction) => {
            if (currentTurnAgentActions.filter(mAction => mAction.agentName === action.agentName).length < validNumActionPerTurn) {
                setCurrentTurnAgentActions(prev => {
                    if (prev.filter(mAction => mAction.agentName === action.agentName).length >= validNumActionPerTurn) {
                        return prev;
                    }
                    return [...prev, action];
                })
                return true;
            } else {
                return false;
            }
        }
    }, [currentTurnAgentActions])

    // let addAgentActionToCurrentTurn = useMemo(() => {
    //     return (action: MinecraftWorldAgentAction) => {
    //         setCurrentTurnAgentActions(prev => {
    //             return [...prev, action];
    //         })
    //     }
    // }, [currentTurnAgentActions]);

    useEffect(() => {
        if (allowAsync) {
            if (currentTurnAgentActions.length === 0 || currentTurnAgentActions.length === executionCount) {
                return;
            }
            const nextAction = currentTurnAgentActions[executionCount];
            let actionResponse = getActionResponseAnyType(nextAction, state);
            if (actionResponse.success) {
                actions.addAgentAction(nextAction);
            }

            if (executionCount + 1 === taskConfig?.agents.length) {
                setCurrentTurn(prev => {
                    return prev + 1;
                });
                setCurrentTurnAgentActions([]);
                setExecutionCount(0);
            } else {
                setExecutionCount(prev => prev + 1);
            }
            
        } else {
            if (currentTurnAgentActions.length === taskConfig?.agents.length) {
                for (let action of currentTurnAgentActions) {
                    actions.addAgentAction(
                        action
                    )
                }

                setCurrentTurn(prev => {
                    return prev + 1;
                });
                setCurrentTurnAgentActions([]);
            }
        }

    }, [currentTurnAgentActions, allowAsync, executionCount]);


    let syncActions: MinecraftWorldActions = {
        ...actions,
        addAgentAction(action) {
            if (currentTurnAgentActions.filter(mAction => mAction.agentName === action.agentName).length >= validNumActionPerTurn) {
            } else {
                setCurrentTurnAgentActions((prev) => {
                    return [...prev, action];
                });
            }
            return {
                success: true,
                "message": ""
            }
        },
        generateAgentControlProps: (agentName: string) => {
            const originalActions = actions.generateAgentControlProps(agentName).actions
            return {
                state: {
                    ...actions.generateAgentControlProps(agentName).state,
                    allowAction: checkAllowActionStatus(agentName)
                },
                actions: {
                    ...actions.generateAgentControlProps(agentName).actions,
                    placeBlock: (blockType: string, pos: MinecraftBlockPos) => {
                        const action: MinecraftWorldAgentPlaceAction = {
                            agentName: agentName,
                            actionType: "place",
                            blockType: blockType,
                            blockPos: pos,
                            uid: generateUId()
                        };
                        const response = getPlaceActionResponse(action, state);
                        
                        if (checkAgentValidForAction(action)) {
                            // actions.generateAgentControlProps(agentName).actions.placeBlock(blockType, pos);
                        } else {
                            alert("You have already used up your action for this turn!");
                        }
                        return response;
                        if (!response.success) {
                            return response;
                        }
                        return {
                            success: true,
                            "message": ""
                        }
                    },
                    breakBlock(uid) {
                        const action: MinecraftWorldAgentBreakAction = {
                            agentName: agentName,
                            actionType: "break",
                            uid: uid,
                        };
                        if (checkAgentValidForAction(action)) {
                        } else {
                            alert("You have already used up your action for this turn!");
                        }
                        const response = getBreakActionResponse(action, state);
                        if (!response.success) {
                            // alert(response.message);
                            return response;
                        }
                        return {
                            success: true,
                            "message": ""
                        }
                    },
                    sendMessage(message) {
                        let action: MinecraftWorldAgentMessageAction = {
                            agentName: agentName,
                            actionType: "message",
                            message: message,
                        }
                        if (checkAgentValidForAction(action)) {
                            // actions.generateAgentControlProps(agent).actions.sendMessage(message);
                        } else {
                            alert("You have already used up your action for this turn!");
                        }
                        return {
                            success: true,
                            "message": ""
                        }
                    },
                    nullAction: () => {
                        let action: MinecraftWorldAgentNullAction = {
                            agentName: agentName,
                            actionType: "null",
                        }
                        if (checkAgentValidForAction(action)) {
                            // actions.generateAgentControlProps(agent).actions.sendMessage(message);
                        } else {
                            alert("You have already used up your action for this turn!");
                        }
                        return {
                            success: true,
                            "message": ""
                        }
                    },
                    endSession: (message: string) => {
                        let action: MinecraftWorldAgentEndAction = {
                            agentName: agentName,
                            actionType: "end_session",
                            message: message,
                        }
                        if (checkAgentValidForAction(action)) {
                            // actions.generateAgentControlProps(agent).actions.sendMessage(message);
                        } else {
                            alert("You have already used up your action for this turn!");
                        }
                        return {
                            success: true,
                            "message": ""
                        }
                    }
                }
            }
        }
    }
    const ready = taskConfig !== undefined;
    return [state, syncActions, sessionFinished, syncState, ready];

}

export { useSyncWorld };
export type { SyncState };