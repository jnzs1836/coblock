import { MinecraftWorldAgentAction } from "../hooks"
import { MinecraftWorldAgentBreakAction, MinecraftWorldAgentPlaceAction, MinecraftWorldAgentMessageAction, MinecraftWorldAgentEndAction } from "../../types/agent"
function getActionText(action: MinecraftWorldAgentAction): string {
    switch (action.actionType) {
        case 'place':
            let placeAction = action as MinecraftWorldAgentPlaceAction;
            return `place a ${placeAction.blockType} block at (${placeAction.blockPos.x}, ${placeAction.blockPos.y}, ${placeAction.blockPos.z})`
        case 'break':
            let breakAction = action as MinecraftWorldAgentBreakAction;
            return `break the block ${breakAction.uid}`;
        case 'message':
            let messageAction = action as MinecraftWorldAgentMessageAction;
            return `send a message: ${messageAction.message}`
        case 'end_session':
            return "end session"
        case 'null':
            return "null"
        default:
            return 'unknown'
    }
}

function getActionCommandStr(action: MinecraftWorldAgentAction): string {
    switch (action.actionType) {
        case 'place':
            let placeAction = action as MinecraftWorldAgentPlaceAction;
            return `place_block(block_type=${placeAction.blockType}, pos=(${placeAction.blockPos.x}, ${placeAction.blockPos.y}, ${placeAction.blockPos.z}))`
        case 'break':
            let breakAction = action as MinecraftWorldAgentBreakAction;
            return `break_block(uid=${breakAction.uid})`;
        case 'message':
            let messageAction = action as MinecraftWorldAgentMessageAction;
            return `send_message(message="${messageAction.message}")`
        case 'end_session':
            let endSessionAction = action as MinecraftWorldAgentEndAction;
            return `end_session(message="${endSessionAction.message}")`;
        case 'null':
            return "wait()"
        default:
            return 'unknown'
    }
}

export { getActionText , getActionCommandStr}