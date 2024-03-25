import { useEffect, useMemo, useState } from 'react';
import { MinecraftBlock, MinecraftBlockPos, MinecraftCollaborationCheckpoint, MinecraftWorldAgent, MinecraftWorldAgentInventoryBlockState, MinecraftWorldAgentState, MinecraftWorldAgentAction, MinecraftWorldState } from '../../types/minecraft';
import { MinecraftWorldAgentActionResponse, MinecraftWorldAgentMessageAction, MinecraftWorldAgentNullAction, MinecraftWorldAgentEndAction, MinecraftWorldAgentBreakAction, MinecraftWorldAgentPlaceAction } from '../../types/agent';
import {computeAgentActionBudget, computeAgentCurrentActionBatch} from "./budget";
import {generateCurrentBlocks} from "./current";
import { getCurrentInventory } from '../record/inventory';
import { checkPlaceBlockValid } from './valid';

function getBreakActionResponse (breakAction: MinecraftWorldAgentBreakAction, state: MinecraftWorldState): MinecraftWorldAgentActionResponse{
    let {uid, agentName} = breakAction;
    if (!breakAction.agentName) {
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
    return {
        success: true,
        message: `Block with uid ${uid} broken`
    }

} 

function getPlaceActionResponse(placeAction: MinecraftWorldAgentPlaceAction, state: MinecraftWorldState): MinecraftWorldAgentActionResponse{
    let {
        agentName, blockType, blockPos 
    } = placeAction;
    
    let budget = computeAgentActionBudget(agentName, state);
    if (budget <= 0) {
        // alert("Cannot do more action. Please submit the current batch first.");
        return {
            success: false,
            message: `Batch full`
        };
    }
    let currentBlocks = generateCurrentBlocks(state.initiablocks, state.agentActions);
    let searchBlock = currentBlocks.find((block) => block.pos.x === blockPos.x && block.pos.y === blockPos.y && block.pos.z === blockPos.z);
    if (searchBlock) {
        // alert("Cannot do build the block as it exists");
        return {
            success: false,
            message: "Block exists"
        }
    }

    let currentInventory = getCurrentInventory(state, agentName);
    if (currentInventory.filter((inventoryBlock) => inventoryBlock.blockType === blockType).length <= 0) {
        return {
            success: false,
            message: `Block with type ${blockType} not found in inventory`
        }
    }

    if(!checkPlaceBlockValid(blockType, blockPos, currentBlocks)){
        return {
            success: false,
            message: `Block position (${blockPos.x}, ${blockPos.y}, ${blockPos.z}) is not either on the ground or adjacent to any existing block.`
        }
    }

    return {
        success: true,
        message: `Block with type ${blockType} placed`
    }
}

function getEndSessionActionResponse(endSessionAction: MinecraftWorldAgentEndAction, state: MinecraftWorldState): MinecraftWorldAgentActionResponse{
    let {agentName, message} = endSessionAction;
    return {
        success: true,
        message: "Session ended"
    }
}

function getMessageActionResponse(messageAction: MinecraftWorldAgentMessageAction, state: MinecraftWorldState): MinecraftWorldAgentActionResponse{
    let {agentName, message} = messageAction;
    let budget = computeAgentActionBudget(agentName, state);
    if (budget <= 0) {
        alert("Cannot do more action. Please submit the current batch first.");
        return {
            success: false,
            message: `Batch full`
        }
    }
    return {
        success: true,
        message: "Message sent"
    }
}

function getNullActionResponse(nullAction: MinecraftWorldAgentNullAction, state: MinecraftWorldState): MinecraftWorldAgentActionResponse{
    return {
        success: true,
        message: "Null action"
    } 
}


function getActionResponseAnyType(action: MinecraftWorldAgentAction, state: MinecraftWorldState): MinecraftWorldAgentActionResponse{
    switch(action.actionType){
        case "break":
            return getBreakActionResponse(action as MinecraftWorldAgentBreakAction, state);
        case "place":
            return getPlaceActionResponse(action as MinecraftWorldAgentPlaceAction, state);
        case "end_session":
            return getEndSessionActionResponse(action as MinecraftWorldAgentEndAction, state);
        case "message":
            return getMessageActionResponse(action as MinecraftWorldAgentMessageAction, state);
        case "null":
            return getNullActionResponse(action as MinecraftWorldAgentNullAction, state);
        default:
            return { 
                success: false,
                message: "Action type not found"
            }
        }
}

export {getBreakActionResponse, getPlaceActionResponse, getMessageActionResponse, getEndSessionActionResponse, getNullActionResponse, getActionResponseAnyType};