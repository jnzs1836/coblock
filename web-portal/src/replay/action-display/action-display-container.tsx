import { MinecraftWorldAgentBreakAction, MinecraftWorldAgentMessageAction, MinecraftWorldAgentNullAction, MinecraftWorldAgentPlaceAction } from "../../minecraft-collaboration/hooks";
import { StyledCard, StyledCardContent, StyledCardHeader } from "../../page/styled-components";
import { MinecraftWorldAgentAction } from "../../types/minecraft";
import BreakActionDisplay from "./break-action-display";
import MessageActionDisplay from "./message-action-display";
import NullActionDisplay from "./null-action-display";
import PlaceActionDisplay from "./place-action-display";

interface ActionDisplayContainerProps {
    step: number,
    actionHistory: Array<MinecraftWorldAgentAction>
}

export default function ActionDisplayContainer ({actionHistory, step}: ActionDisplayContainerProps){

    return (
        <StyledCard>
            <StyledCardHeader
            ></StyledCardHeader>
            <StyledCardContent
                sx={{
                    height: "90%",
                    overflowY: "scroll"
                }}
            >
                {
                    actionHistory.map((action, index) => {
                        if(action.actionType === "message"){
                            return (
                                <MessageActionDisplay   
                                    action={action as MinecraftWorldAgentMessageAction}
                                    sx={{
                                        marginBottom: 1,
                                        border: index === step ? "2px solid steelblue" : undefined,
                                    }}
                                />
                            )
                        }else if(action.actionType === "break"){
                            return (
                                <BreakActionDisplay 
                                    action={action as MinecraftWorldAgentBreakAction}
                                    sx={{
                                        marginBottom: 1,
                                        border: index === step ? "2px solid steelblue" : undefined,
                                    }}
                                />
                            )
                        }else if (action.actionType === "place"){
                            return (
                                <PlaceActionDisplay
                                    
                                    action={action as MinecraftWorldAgentPlaceAction}
                                    sx={{
                                        marginBottom: 1,
                                        border: index === step ? "2px solid steelblue" : undefined,
                                    }}
                                />
                            )
                        }else if (action.actionType === "null"){
                            return (
                                <NullActionDisplay
                                    action={action as MinecraftWorldAgentNullAction}
                                    sx={{
                                        marginBottom: 1,
                                        border: index === step ? "2px solid steelblue" : undefined,
                                    }}
                                /> 
                            )
                        }
                    })
                }
            </StyledCardContent>
        </StyledCard>
    )

}