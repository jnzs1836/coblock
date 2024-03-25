import { Button, Typography, FormControl, Switch, FormControlLabel, 
    List, ListItem, Avatar, ListItemText, ListItemAvatar, Card, Box, Divider
} from "@mui/material";
import { StyledCard, StyledCardHeader } from "../page/styled-components";
import { MinecraftStructure } from "../types/minecraft";
import { useChatGPTStrcutureDescription, buildMinecraftStructureText, parseGPTCommand } from "./chatgpt-hooks";
import { useState, Fragment } from "react";
import TextDisplay from "./text-display";
import styled from "@emotion/styled";
import { MessageCard, SenderAvatar, InputPanel, DialogueMessage, MessageCardContent} from "./common";
import DialogueDisplay from "./dialogue-display";
interface ChatGPTPanelProps {
    minecraftStructure: MinecraftStructure
}   

const CardContent = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-evenly",
    width: "100%",
    color: "white",
})

export default function ChatGPTPanel({minecraftStructure}: ChatGPTPanelProps) {

    const promptText = "You are a minecraft structure descriptor, who should describe a given structure by the natural language. The structure is described by the XML format, defined as follows: \n" + 
    "<Strcuture> <Block type=red x=0 y=1 z=2/> <Block type=green x=1 y=2 z=3/> </Structure> \n" +
    "\n" +
    "Below, the user will send a XML format structure to you, and you should describe the structure by the natural language. The ground is the y=0 plane.\n" +
    "Some examples are followed: \n" +
    "User: <Strcuture> <Block type=red x=0 y=0 z=0/> <Block type=red x=1 y=0 z=0/> <Block type=red x=0 y=0 z=1/><Block type=red x=1 y=0 z=1/><Block type=red x=0 y=0 z=0/> </Structure>" + 
    "Description: a 2x2 red square on the ground. \n" +
    "\n" +
    "User: <Strcuture> <Block type=red x=0 y=0 z=0/> <Block type=red x=0 y=1 z=0/> <Block type=red x=0 y=2 z=0/><Block type=red x=0 y=3 z=0/><Block type=red x=0 y=4 z=0/><Block type=red x=4 y=0 z=0/> <Block type=red x=4 y=1 z=0/><Block type=red x=4 y=2 z=0/><Block type=red x=4 y=3 z=0/> <Block type=green x=4 y=4 z=0/><Block type=green x=3 y=4 z=0/><Block type=green x=2 y=4 z=0/><Block type=green x=1 y=4 z=0/><Block type=green x=0 y=4 z=0/></Structure>" +
    "Description: a door with the red pillars and green beam. \n"


    const [enabled, setEnabled] = useState<boolean>(false);

    const {result} = useChatGPTStrcutureDescription(minecraftStructure, promptText, enabled);
    const messages = [
        {
            sender: "User",
            message: buildMinecraftStructureText(minecraftStructure)
        },
        {
            sender: "ChatGPT",
            message: result
        }
    ]

    
  return <StyledCard
    sx={{paddingBottom: "1rem"}}
  >
        <StyledCardHeader title="ChatGPT" action={
          <FormControlLabel
            control={<Switch checked={enabled} onChange={() => {
                setEnabled(!enabled);
            }} />}
            label="Enabled"
          />
        }
        titleTypographyProps={{variant:"h6"}}
        />
        <CardContent >
            {/* <TextDisplay 
                text={buildMinecraftStructureText(minecraftStructure)}/>
            <TextDisplay text={result}/> */}
            <DialogueDisplay
                messages={messages}
            />
        </CardContent>
        
    </StyledCard>;
}