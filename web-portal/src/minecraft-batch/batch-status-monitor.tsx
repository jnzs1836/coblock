// BatchStatusMonitor.tsx
import React from 'react';
import { Card, List, ListItem, ListItemText, Typography, collapseClasses, LinearProgress } from '@mui/material';
import { Batch } from '../types/batch';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green, orange, grey } from '@mui/material/colors';
import { StyledCard, StyledCardHeader } from '../page/styled-components';
import { MinecraftCollaborationSession } from '../types/task';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


interface BatchStatusMonitorProps {
    batch: Batch;
    collaborationSessions: MinecraftCollaborationSession[];
    onSessionRemove: (sessionId: string) => void;
    runningCount: number,
    isRunning: boolean
};

const BatchStatusMonitor: React.FC<BatchStatusMonitorProps> = ({ batch, onSessionRemove, collaborationSessions, runningCount, isRunning }) => {
    const handleRemoveSession = (sessionId: string) => {
        onSessionRemove(sessionId);
    };

    return (
        <StyledCard sx={{ mb: 2 }}>
            <StyledCardHeader title={"Batch Status Monitor"}></StyledCardHeader>
            <LinearProgress 
                sx={{ml: 4, mr:4}}
            variant="determinate" value={batch.sessionIndices.length > 0? 100 * runningCount / batch.sessionIndices.length: 0} />

            <div style={{ maxHeight: '200px', overflow: 'scroll' }}>
                <List>
                    {batch.sessionIndices.map((sessionIndex, seq) => {
                        let session = collaborationSessions.find((session) => session.id === sessionIndex);
                        if (!session) { return null; }
                        else {

                            return (
                                <ListItem key={session.id}>
                                    {((!isRunning && runningCount === seq)|| runningCount <  seq)&& (
                                    <PlayArrowIcon style={{ color: green[500] }} />
                                )}
                                { isRunning && runningCount === seq && (
                                    <HourglassEmptyIcon style={{ color: orange[500] }} />
                                )}
                                {runningCount > seq && (
                                    <CheckCircleIcon style={{ color: grey[500] }} />
                                )}
                                    <ListItemText primary={session.id} secondary={""} />
                                    <IconButton
                                        aria-label="Remove"
                                        onClick={() => handleRemoveSession(session? session.id: "")}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>)

                        }
                    }
                    )}
                </List>
            </div>
        </StyledCard>
    );
};

export default BatchStatusMonitor;