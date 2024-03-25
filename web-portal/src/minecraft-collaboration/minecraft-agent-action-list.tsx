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
import { MinecraftWorldAgentAction } from './hooks';
import FeedbackDialog from './experiment/feedback-dialog';
import MinecraftExperimentForm from './minecraft-experiment-form';

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
    onSubmit: () => Promise<void>;
    actions: Array<MinecraftWorldAgentAction>
}

export default function MinecraftAgentActionListComp ({onSubmit, actions}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roundsProcessed, setRoundsProcessed] = useState(0);

    const renderActionIcon = (actionType: string) => {
        switch (actionType) {
            case 'place':
                return <AddCircleOutline />;
            case 'break':
                return <Delete />;
            case 'message':
                return <Chat />;
            default:
                return null;
        }
    };
    
    const isButtonDisabled = actions.length < 3;
    
    const handleSubmission = async () => {
        setIsSubmitting(true);
        await onSubmit();
        setIsSubmitting(false);
        setRoundsProcessed(roundsProcessed + 1);
    };

    const renderedSlots = Array.from({ length: 3 }).map((_, index) => {
        const action = actions[index];
        return (
            <Slot key={index}>
                {action ? (
                    renderActionIcon(action.actionType)
                ) : (
                    <EmptyIcon />
                )}
            </Slot>
        );
    }); 
    return (
        <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                    <ActionText>Actions:</ActionText>
                </Grid>
                <Grid item xs={5}>
                    <ActionsContainer>
                        {renderedSlots}
                    </ActionsContainer>
                </Grid>
                <Grid item xs={3} container justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}
                        disabled={isSubmitting || isButtonDisabled}
                    >
                        {isSubmitting ? (
                            <CircularProgress color="inherit" size={24} />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                    {/* <p>Rounds Processed: {roundsProcessed}</p> */}
                </Grid>

            </Grid>
    )
}