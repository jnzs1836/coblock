import { StyledCard, StyledCardHeader } from "../page/styled-components";
import MinecraftAgentPanel from "./minecraft-agent-panel";
import { useMinecraftWorld, MinecraftWorldState, MinecraftWorldActions } from "./hooks";
import { MinecraftBlock } from "../types/minecraft";
import { MinecraftTaskAgentSpec } from "../types/task";
import MinecraftAgentControl from "./minecraft-agent-control";

interface MinecraftCollaborationInputProps {
    syncBlocks: (blocks: MinecraftBlock[]) => void;
    state: MinecraftWorldState;
    actions: MinecraftWorldActions;
    agentConfig: MinecraftTaskAgentSpec
}


export default function MinecraftCollaborationInput({syncBlocks, state, actions, agentConfig}: MinecraftCollaborationInputProps){
    
    

    return (
        <StyledCard
            sx={{
                marginBottom: 2,
                paddingBottom: 2,
            }}
        >
            <StyledCardHeader title={agentConfig.name} titleTypographyProps={{variant:"h6"}}
            ></StyledCardHeader>
            
            <MinecraftAgentPanel sx={{
                marginRight: 2,
            }}
                agentControlProps={{
                    ...actions.generateAgentControlProps(agentConfig.name, true),
                }}
            />
           
        </StyledCard>
    )
}