// BatchControlPanel.tsx
import React from 'react';
import { Batch } from '../types/batch';
import { Card, TextField, Typography, Button, ButtonGroup, Grid, FormControl, FormControlLabel, Select, MenuItem, InputLabel } from '@mui/material';
import { StyledCard, StyledCardContent, StyledCardHeader } from '../page/styled-components';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { PromptCheckpoint } from '../types/prompt';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import PromptCheckpointPanel from '../management/prompt-checkpoint/prompt-checkpoint-panel';
import { useRequestWrapper } from '../web/hooks';
import { saveBatchLog } from './api';
import LoadingProgress from '../page/loading-progress';
import { BatchRecordLog, useBatchLogger } from './logger';
import { useAuthHeader } from 'react-auth-kit';


type BatchControlPanelProps = {
    batch: Batch;
    onBatchUpdate: (fn: (prev: Batch) => Batch) => void;
    onStartStop: () => void;
    isRunning: boolean;
    delayTime: number;
    setDelayTime: (value: number) => void;
    promptCheckpoint: PromptCheckpoint | undefined;
    setPromptCheckpoint: React.Dispatch<React.SetStateAction<PromptCheckpoint | undefined>>;
    backendVersion: string;
    setBackendVersion: React.Dispatch<React.SetStateAction<string>>;
    promptCheckpointList: PromptCheckpoint[];
    batchLog: BatchRecordLog;
};


const BatchControlPanel: React.FC<BatchControlPanelProps> = ({ batch, onBatchUpdate, onStartStop, isRunning, delayTime, setDelayTime,
    promptCheckpoint, setPromptCheckpoint, backendVersion, setBackendVersion, promptCheckpointList, batchLog
}) => {
    const [batchName, setBatchName] = React.useState(batch.name);
    const [modelName, setModelName] = React.useState(batch.backendVersion);

    const authHeader = useAuthHeader();

    const handleBatchUpdate = () => {
        onBatchUpdate(prev => ({
            ...prev,
            name: batchName,
            model: modelName,
        }));
    };

    const handleBackendVersionChange = (value: string) => {
        setBackendVersion(value);
        onBatchUpdate(prev => ({
            ...prev,
            backendVersion: value
        }));
    }

    const {wrappedRequestFunc, status} = useRequestWrapper(saveBatchLog, true);

    return (
        <StyledCard sx={{ mb: 2, pb: 2, pl: "10px", pr: "10px" }}>
            <StyledCardHeader
                sx={{
                    marginBottom: 2,
                }}
                title={"Batch Control Panel"}>

            </StyledCardHeader>
            <Grid container spacing={1} justifyContent={"center"}>
                <Grid item xs={3} md={3}>
                    <TextField
                        label="Batch Name"
                        value={batchName}
                        onChange={(event) => setBatchName(event.target.value)}
                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <TextField
                        label="Delay Time"
                        value={delayTime}
                        onChange={(event) => setDelayTime(parseInt(event.target.value))}
                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Backend</InputLabel>
                        <Select
                            value={undefined}
                            onChange={(e) => {
                                handleBackendVersionChange(e.target.value as string)
                            }
                            }
                        >
                            <MenuItem value={"gpt-3.5"}>gpt-3.5</MenuItem>
                            <MenuItem value={"gpt-4"}>gpt-4</MenuItem>
                        </Select>
                    </FormControl>

                </Grid>

                <Grid item xs={3} md={3}>
                    <PromptCheckpointPanel
                        selectedCheckpoint={promptCheckpoint?.id}
                        setSelectedCheckpoint={(value) => {
                            setPromptCheckpoint(promptCheckpointList.find(checkpoint => checkpoint.id === value));
                        }}
                        promptCheckpointList={promptCheckpointList}

                    />
                </Grid>
            </Grid>



            <Typography variant="body1">
                Number of sessions in the batch: {batch.sessionIndices.length}
            </Typography>
            <Grid container spacing={1} justifyContent={"center"}>
                <Grid item xs={3} md={3}>
                    <Button
                        variant='contained'
                        onClick={handleBatchUpdate}>Update Batch</Button>
                </Grid>

                <Grid item xs={3} md={3}>
                    <Button
                        sx={{
                        }}
                        onClick={onStartStop}
                        variant='contained'
                        startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
                    >
                        {isRunning ? 'Stop' : 'Start'}
                    </Button>

                </Grid>
                <Grid item xs={3} md={3}>
                    <Button
                        sx={{
                        }}
                        onClick={() => {
                            wrappedRequestFunc(batchLog, batchName, backendVersion, promptCheckpoint, authHeader);
                         }}
                        variant='contained'
                        startIcon={<SaveAltIcon />}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>

            <LoadingProgress 
                errorMessage={"Failed to save batch log"}
                successMessage='Batch log saved successfully'
            status={status} />

        </StyledCard>
    );
};

export default BatchControlPanel;