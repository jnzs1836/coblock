import { MinecraftWorldState } from "../../types/minecraft";


function computeAgentCurrentActionBatch(agentName: string, state: MinecraftWorldState) {
    let budgetAdjustRecords = state.agentActionBudgetAdjustRecords.filter((record) => record.agentName === agentName);
    if (budgetAdjustRecords.length > 0) {
        let lastRecord = budgetAdjustRecords[budgetAdjustRecords.length - 1];
        let currentActions = state.agentActions.slice(lastRecord.actionStep, state.agentActions.length);
        return currentActions.filter((action) => action.agentName === agentName)
    } else {
        let currentActions = state.agentActions;
        return currentActions.filter((action) => action.agentName === agentName)
    }
}




function computeAgentActionBudget(agentName: string, state: MinecraftWorldState) {
    return 10000;
    // return 3 - computeAgentCurrentActionBatch(agentName, state).length
}

export {computeAgentActionBudget, computeAgentCurrentActionBatch}