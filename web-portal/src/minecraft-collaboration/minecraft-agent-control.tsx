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
    Alert
    
} from '@mui/material';
import { Place, Chat, Delete, HelpOutline, AddCircleOutline, RemoveDone, Send } from '@mui/icons-material';
import { MinecraftWorldAgentAction } from './hooks';
import FeedbackDialog from './experiment/feedback-dialog';
import MinecraftExperimentForm from './minecraft-experiment-form';
import MinecraftAgentActionListComp from './minecraft-agent-action-list';
import MinecraftWorldActionListComp from './minecraft-debug-comp';

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

interface MinecraftAgentControlProps {
    actions: MinecraftWorldAgentAction[];
    onSubmit: () => Promise<void>;
    onSubmitFeedback: (feedback: string, isSuccess: boolean) => Promise<Response>;
    syncMode?: boolean;
    currentStructureValid?: boolean;
    allowFailure ?: boolean;
}

const MinecraftAgentControl: React.FC<MinecraftAgentControlProps> = ({ actions, onSubmit, onSubmitFeedback, syncMode,
     currentStructureValid = false, allowFailure = true
    }) => {
    const [numTurns, setNumTurns] = useState<number>(0);
    
    let validSyncMode = syncMode? true: false;
    return (
        <CardContainer>
            
            {!syncMode && <MinecraftAgentActionListComp
                actions={actions}
                onSubmit={onSubmit}
            />}
            {
                currentStructureValid&& <Alert>
                    Looks the structure has been already complete. You can submit the task.
                </Alert>
            }
            {
                !currentStructureValid&& <Alert severity='info'>
                    Looks the structure is not complete. Please keep working!. If you though the task is not possible to finish, you can click fail after ten turns.
                </Alert>
            }
            <MinecraftExperimentForm
                onSubmitFeedback={onSubmitFeedback}
                numTurns={numTurns}
                currentStructureValid={currentStructureValid}
                allowFaiure={allowFailure}
            />
        </CardContainer>
    );
};

export default MinecraftAgentControl;
