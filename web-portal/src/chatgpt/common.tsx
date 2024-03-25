import React, { useState } from 'react';
import { styled } from '@mui/material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';


const MessageCard = styled(Card)({
    width: '100%',
    marginBottom: '16px',
});

const SenderAvatar = styled(Avatar)({
    marginRight: '8px',
});

const InputPanel = styled(Grid)({
    marginTop: '16px',
});

interface ChatGPTMessage {
    role: string;
    content: string;
}

interface DialogueMessage {
    sender: string;
    message: string;
}

const MessageCardContent = CardContent;

export { MessageCard, SenderAvatar, InputPanel, MessageCardContent };
export type { DialogueMessage, ChatGPTMessage };