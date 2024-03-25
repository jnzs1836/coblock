import { useEffect, useMemo, useState } from 'react';
import { MinecraftBlock, MinecraftBlockPos, MinecraftCollaborationCheckpoint, MinecraftWorldAgent, MinecraftWorldAgentInventoryBlockState, MinecraftWorldAgentState, MinecraftWorldAgentAction, MinecraftWorldState } from '../../types/minecraft';
import { MinecraftWorldAgentActionResponse, MinecraftWorldAgentMessageAction, MinecraftWorldAgentNullAction, MinecraftWorldAgentEndAction, MinecraftWorldAgentBreakAction, MinecraftWorldAgentPlaceAction } from '../../types/agent';
import {computeAgentActionBudget, computeAgentCurrentActionBatch} from "./budget";


function generateCurrentBlocks(initiablocks: MinecraftBlock[], agentActions: Array<MinecraftWorldAgentAction>): MinecraftBlock[] {
    const currentBlocks = [...initiablocks];
    for (const action of agentActions) {
        if (action.actionType === "place") {
            let breakAction = action as MinecraftWorldAgentPlaceAction;
            currentBlocks.push({
                blockType: breakAction.blockType,
                pos: breakAction.blockPos,
                uid: breakAction.uid,
            });
        } else if (action.actionType === "break") {
            let breakAction = action as MinecraftWorldAgentBreakAction;
            const index = currentBlocks.findIndex(block => block.uid === breakAction.uid);
            if (index !== -1) {
                currentBlocks.splice(index, 1);
            }
        }
    }
    return currentBlocks;
}



export {generateCurrentBlocks};