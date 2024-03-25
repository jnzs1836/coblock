interface MinecraftBlockPos {
    x: number,
    y: number,
    z: number
}

interface MinecraftBlock2DPos {
    x: number, 
    y: number
}

interface MinecraftBlock {
    uid: string,
    blockType: string,
    pos: MinecraftBlockPos,
}

interface MinecraftBlock2D {
    uid: string,
    blockType: string,
    pos: MinecraftBlock2DPos,
}

interface MinecraftStructure {
    blocks: MinecraftBlock[],
    desc?: string,
}

interface MinecraftBlueprint {
    id: string,
    spec: MinecraftStructure,
    name: string,
    description: string,
}



interface MinecraftWorldAgent {
    role: string;
    name: string,
    // inventory: MinecraftWorldAgentInventoryBlockState[],
    // blueprint: MinecraftBlueprint | undefined,
}

interface MinecraftWorldAgentInventoryBlockState {
    blockType: string;
    count: number;
}

interface MinecraftWorldAgentState {
    agent: MinecraftWorldAgent;
    inventory: Array<MinecraftWorldAgentInventoryBlockState>;
}
interface MinecraftWorldAgentAction {
    agentName: string;
    actionType: "message" | "place" | "break" | "end_session" | "null",
}

interface AgentActionBudgetAdjust {
    agentName: string;
    actionStep: number;
}

interface MinecraftWorldState {
    initiablocks: MinecraftBlock[];
    initialAgentStates: Array<MinecraftWorldAgentState>;
    agentActions: Array<MinecraftWorldAgentAction>;
    agents: Array<MinecraftWorldAgent>;
    initialized: boolean;
    agentActionBudgetAdjustRecords: Array<AgentActionBudgetAdjust>;
}



interface MinecraftCollaborationCheckpoint {
    sessionId: string,
    state: MinecraftWorldState,
    name: string,
}

interface BlueprintAccess {
    id: string,
    collaborator: string,
    collaboratorName: string,
    canEdit: boolean,
    canView: boolean,
    canManage: boolean,
}


const BlockTypes = [
    "red", "blue", "yellow", "green", "black", "purple"
]

const colorMap: Record<string, string> = {
    red: '#f44336',
    blue: '#2196f3',
    yellow: '#ffeb3b',
    purple: '#9c27b0',
    green: '#4caf50',
    black: '#000000',
  };

function mapColorToHex(color: string): string {
    let colorHex = colorMap[color];
    if(colorHex === undefined) {
        colorHex = '#000000';
    }
    return colorHex;
}

export type { MinecraftBlockPos, MinecraftBlock, MinecraftStructure, MinecraftBlueprint, MinecraftCollaborationCheckpoint, MinecraftWorldState,
    MinecraftWorldAgent, MinecraftWorldAgentInventoryBlockState, MinecraftWorldAgentState, MinecraftWorldAgentAction, BlueprintAccess, MinecraftBlock2DPos, MinecraftBlock2D
};
export { BlockTypes, colorMap, mapColorToHex };