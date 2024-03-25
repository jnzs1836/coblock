import {MinecraftWorldAgentActionResponse, MinecraftWorldAgentMessageAction, MinecraftWorldAgentNullAction, MinecraftWorldAgentEndAction, MinecraftWorldAgentBreakAction, MinecraftWorldAgentPlaceAction} from "./agent";
import { MinecraftBlock, MinecraftBlockPos, MinecraftCollaborationCheckpoint, MinecraftWorldAgent, MinecraftWorldAgentInventoryBlockState, MinecraftWorldAgentState, MinecraftWorldAgentAction, MinecraftWorldState } from './minecraft';
import { DialogueMessage } from '../chatgpt/common';

interface MinecraftWorldAgentControlState {
    inventory: Array<MinecraftWorldAgentInventoryBlockState>;
    breakableBlocks: Array<MinecraftBlock>;
    allowAction: boolean
}


interface MinecraftWorldAgentControlActions {
    placeBlock: (blockType: string, blockPos: MinecraftBlockPos) => MinecraftWorldAgentActionResponse,
    breakBlock: (uid: string) => MinecraftWorldAgentActionResponse,
    sendMessage: (message: string) => MinecraftWorldAgentActionResponse,
    endSession: (message: string) => MinecraftWorldAgentActionResponse,
    nullAction: () => MinecraftWorldAgentActionResponse,
    preCheckAction: (action: MinecraftWorldAgentAction) => MinecraftWorldAgentActionResponse,
    getAgentName : () => string,
}



interface MinecraftWorldActions {
    addAgentAction: (action: MinecraftWorldAgentAction) => MinecraftWorldAgentActionResponse;
    generateAgentControlProps: (agent: string, allowAlert?: boolean) => { state: MinecraftWorldAgentControlState, actions: MinecraftWorldAgentControlActions };
    getMessages: () => Array<DialogueMessage>;
    getCurrentBlocks: () => MinecraftBlock[];
    getState: () => MinecraftWorldState;
    loadState: (state: MinecraftWorldState) => void;
    addAgentAdjust: (agentName: string) => void;
    getAgentCurrentActionBatch: (agentName: string) => Array<MinecraftWorldAgentAction>
}

export type {
    MinecraftWorldAgentControlState, MinecraftWorldAgentControlActions, MinecraftWorldActions
}