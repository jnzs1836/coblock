import {MinecraftWorldAgentAction} from "./minecraft";


interface MinecraftWorldAgentActionResponse {
    success: boolean,
    message: string,
}


interface MinecraftWorldAgentPlaceAction extends MinecraftWorldAgentAction {
    readonly actionType: 'place';
    agentName: string,
    blockType: string;
    blockPos: { x: number; y: number; z: number };
    uid: string;
}

interface MinecraftWorldAgentBreakAction extends MinecraftWorldAgentAction {
    readonly actionType: 'break';
    uid: string
}

interface MinecraftWorldAgentMessageAction extends MinecraftWorldAgentAction {
    readonly actionType: 'message';
    message: string;
}

interface MinecraftWorldAgentEndAction extends MinecraftWorldAgentAction {
    readonly actionType: 'end_session';
    message: string;
}

interface MinecraftWorldAgentNullAction extends MinecraftWorldAgentAction {
    readonly actionType: "null";

}

export type { MinecraftWorldAgentActionResponse, MinecraftWorldAgentMessageAction, MinecraftWorldAgentNullAction, MinecraftWorldAgentEndAction, MinecraftWorldAgentBreakAction, MinecraftWorldAgentPlaceAction };
