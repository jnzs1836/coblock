import { StyledCard, StyledCardContent, StyledCardHeader } from "../page/styled-components";
import React, { useState } from 'react';
import {
    Button,
    CircularProgress,
    IconButton,
    styled,
    Card,
    CardContent,
    Grid,
    Typography,

} from '@mui/material';
import { Place, Chat, Delete, HelpOutline, AddCircleOutline, RemoveDone, Send } from '@mui/icons-material';
import { MinecraftTaskInstance } from "../types/task";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CardContainer = styled("div")({
    padding: '1rem',
});

const ActionsContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const ActionText = styled('div')({
    marginRight: '1rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
});

const Slot = styled('div')(({ theme }) => ({
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    border: `2px solid ${theme.palette.primary.main}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem',
    color: theme.palette.text.secondary,
    marginRight: '0.5rem',
}));

const EmptySlot = styled(Slot)(({ theme }) => ({
    backgroundColor: theme.palette.action.disabledBackground,
}));

const EmptyIcon = styled(HelpOutline)(({ theme }) => ({
    fontSize: '1.2rem',
    color: theme.palette.text.disabled,
}));

const ActionIcon = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

interface Props {
    currentTurn: number, 
    agentStatus: Array<boolean>
}



export default function SyncControlComp({ currentTurn, agentStatus }: Props) {
    const renderedSlots = agentStatus.map((indicator, index) => {

        return (
            <Slot key={index}>
                {indicator ? (
                    <CheckCircleIcon />
                ) : (
                    <EmptyIcon />
                )}
            </Slot>
        );
    });
    return (
        <StyledCard>
            <StyledCardHeader
            ></StyledCardHeader>

            <StyledCardContent>
                <Grid container spacing={1}
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                >
                    <Grid item xs={5}>
                        <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                            Turn: {currentTurn} 
                            </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        Sync: 
                    </Grid>
                    <Grid item xs={4}
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"center"}
                    >
                        {
                            renderedSlots
                        }
                    </Grid>
                </Grid>
            </StyledCardContent>
        </StyledCard>
    )
}