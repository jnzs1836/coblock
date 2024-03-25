import DialogueDisplay from "../chatgpt/dialogue-display";
import { DialogueMessage } from "../chatgpt/common";
import { StyledCard, StyledCardHeader } from "../page/styled-components";

interface MinecraftCollaborationDialogueProps {
    sx?: Record<string, any>;
    messages: Array<DialogueMessage>;

}

export default function MinecraftCollaborationDialogue({sx, messages}: MinecraftCollaborationDialogueProps){
    return (
        <StyledCard
            sx={
                {
                    ...sx
                }
            }
        >
            <StyledCardHeader 
                
                title={"Dialogue"} titleTypographyProps={{variant:"h6"}}></StyledCardHeader>
            <DialogueDisplay
                messages={messages}
            />
        </StyledCard>
    )
}
