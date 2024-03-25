import { MinecraftCollaborationCheckpoint, MinecraftWorldAgentAction } from "./minecraft";

interface MinecraftCollaborationRecordTurn {
    index: number,
    checkpoint: MinecraftCollaborationCheckpoint;
    lastAction: MinecraftWorldAgentAction; 
};

interface ChatGPTRecordTurn {
    index: number,
    messages: String[],
    response: String,   
};

interface ChatGPTRecord {
    agentIndex: number,
    turns: ChatGPTRecordTurn[],
} 

interface MinecraftCollaborationRecord {
    id: string,
    turns: MinecraftCollaborationRecordTurn[],
    chatGPTRecords: ChatGPTRecord[],
    actionHistory: Array<MinecraftWorldAgentAction>,
};

export type { MinecraftCollaborationRecord, MinecraftCollaborationRecordTurn, ChatGPTRecord, ChatGPTRecordTurn };
