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
    Tooltip

} from '@mui/material';
import { Place, Chat, Delete, HelpOutline, AddCircleOutline, RemoveDone, Send, HelpCenter } from '@mui/icons-material';
import { MinecraftWorldAgentAction, MinecraftWorldState } from './hooks';
import FeedbackDialog from './experiment/feedback-dialog';
import MinecraftExperimentForm from './minecraft-experiment-form';
import { StyledCard, StyledCardContent, StyledCardHeader } from '../page/styled-components';
import { getActionText } from './utils/text';

const CardContainer = styled("div")({
    padding: '1rem',
});

const ActionsContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    overflowX: "scroll"
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
    state: MinecraftWorldState;
}

export default function MinecraftWorldDebugComp({ state }: Props) {

    const renderActionIcon = (actionType: string) => {
        switch (actionType) {
            case 'place':
                return <AddCircleOutline />;
            case 'break':
                return <Delete />;
            case 'message':
                return <Chat />;
            default:
                return <HelpOutline/>    ;
        }
    };



    let actions = state.agentActions;
    return (
        <StyledCard>
            <StyledCardHeader title="Minecraft World Debug" />
            <StyledCardContent>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <ActionText>Actions:</ActionText>
                    </Grid>
                    <Grid item xs={8}>
                        <ActionsContainer>
                            {
                                actions.map((action, index) => {
                                    return (
                                        <Tooltip title={getActionText(action)}>
                                            {renderActionIcon(action.actionType)
                                            }
                                        </Tooltip>
                                    )
                                })
                            }
                        </ActionsContainer>
                    </Grid>

                </Grid>

            </StyledCardContent>
        </StyledCard>

    )
}