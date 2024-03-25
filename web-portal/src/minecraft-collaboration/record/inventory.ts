import { MinecraftWorldAgentPlaceAction, MinecraftWorldState } from "../hooks";

function getCurrentInventory(state: MinecraftWorldState, agentName: string){
    let initialInventory = state.initialAgentStates.find((agentState) => agentState.agent.name=== agentName)?.inventory;
    if(initialInventory){
        let consumedBlocks = state.agentActions.filter((action) => action.agentName === agentName && action.actionType === "place").map((action) => {
            let placeAction = action as MinecraftWorldAgentPlaceAction
            return placeAction.blockType
        });

        return initialInventory.map( (inventoryBlock) => {
            let consumedCount = consumedBlocks.filter((blockType) => blockType === inventoryBlock.blockType).length;
            return {
                blockType: inventoryBlock.blockType,
                count: inventoryBlock.count - consumedCount
            }
        }).filter( d => d.count > 0);
    }else{
        return []
    }

}

export {getCurrentInventory};