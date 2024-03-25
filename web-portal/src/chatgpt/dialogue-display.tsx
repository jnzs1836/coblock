import {
    Button, Typography, FormControl, Switch, FormControlLabel,
    List, ListItem, Avatar, ListItemText, ListItemAvatar, Card, Box, Divider
} from "@mui/material";
import { StyledCard, StyledCardHeader } from "../page/styled-components";
import { MinecraftStructure } from "../types/minecraft";
import { useChatGPTStrcutureDescription, buildMinecraftStructureText } from "./chatgpt-hooks";
import { useState, Fragment } from "react";
import TextDisplay from "./text-display";
import styled from "@emotion/styled";
import { MessageCard, SenderAvatar, InputPanel, DialogueMessage, MessageCardContent } from "./common";

interface DialogueDisplayProps {
    messages: DialogueMessage[];
}

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    // flexBasis: "200px",
    height: "100%",
    // flexGrow: 0,
    overflowY: "scroll",

})

export default function DialogueDisplay({ messages }: DialogueDisplayProps) {

    return (
        <Container>
            <List
                sx={{
                    // height: "100%",
                    paddingBottom: "20px",
                    marginBottom: "20px"
                }}
            >
                {messages.map((message: DialogueMessage, index) => (
                    <Fragment key={index}>
                        {index > 0 && <Divider variant="inset" component="li" />}
                        <ListItem alignItems="flex-start" >
                            <ListItemAvatar>
                                <SenderAvatar>{message.sender.toUpperCase().charAt(0)}</SenderAvatar>
                            </ListItemAvatar>
                            <Box display="flex" alignItems="center" >
                                <MessageCard >
                                    <MessageCardContent
                                        sx={{
                                            // width: "90%"
                                            maxWidth: "320px"
                                        }}
                                    >
                                        <Typography variant="body2" color="textSecondary" >
                                            {message.sender}
                                        </Typography>
                                        <Typography variant="body2" style={{ textAlign: 'left', maxWidth: '100%', wordWrap: 'break-word' }}>{message.message}</Typography>
                                    </MessageCardContent>
                                </MessageCard>
                            </Box>
                        </ListItem>
                    </Fragment>
                ))}
            </List>
        </Container>
    )
}