import React, { useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText, Typography, Grid, IconButton, Alert } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import {
    MinecraftWorldAgent, MinecraftWorldAgentState, MinecraftWorldAgentControlState,
    MinecraftWorldAgentControlActions,
    MinecraftWorldAgentPlaceAction,
    generateUId
} from './hooks';
import { MinecraftBlockPos, MinecraftWorldAgentAction } from '../types/minecraft';
import { RemoveDone, Send, AddCircleOutline, Chat, HourglassBottom } from '@mui/icons-material';
import { getPlaceActionResponse } from './utils/action-response';
interface MinecraftAGentPanelProps {
    // agent: MinecraftWorldAgent;
    // agentState: MinecraftWorldAgentState;
    agentControlProps: { state: MinecraftWorldAgentControlState, actions: MinecraftWorldAgentControlActions };
    sx?: Record<string, any>;
}


interface MinecraftAgentControlState {
    actionPlacePos: MinecraftBlockPos,
    actionPlaceBlockType: string,
    actionBreakUid: string,
    actionMessage: string,
}

interface MinecraftAgentControlActions {
    setActionPlacePos: (pos: MinecraftBlockPos) => void;
    setActionPlaceBlockType: (blockType: string) => void;
    setActionBreakUid: (uid: string) => void;
    setActionMessage: (message: string) => void;
    handlePlaceBlock: () => void;
    handleBreakBlock: () => void;
    handleMessage: () => void;
    handleNull: () => void
}



function useMinecraftAgentControl(agentControlProps: { state: MinecraftWorldAgentControlState, actions: MinecraftWorldAgentControlActions }): [MinecraftAgentControlState, MinecraftAgentControlActions] {
    const [actionPlacePos, setActionPlacePos] = useState<MinecraftBlockPos>({ x: 0, y: 0, z: 0 });
    const [actionPlaceBlockType, setActionPlaceBlockType] = useState<string>('red');
    const [actionBreakUid, setActionBreakUid] = useState<string>('');
    const [actionMessage, setActionMessage] = useState<string>('');

    const state = {
        actionPlacePos, actionMessage, actionPlaceBlockType, actionBreakUid
    }

    const handlePlaceBlock = () => {
        let action = {
            agentName: agentControlProps.actions.getAgentName(),
            actionType: 'place',
            blockType: actionPlaceBlockType,
            blockPos: actionPlacePos,
            uid: generateUId()
        } as MinecraftWorldAgentPlaceAction;
        let response = agentControlProps.actions.preCheckAction(action as MinecraftWorldAgentAction);
        if(!response.success){
            alert(response.message);
            return 
        }
        if (actionPlaceBlockType && actionPlacePos) {
            let response = agentControlProps.actions.placeBlock(actionPlaceBlockType, actionPlacePos);
            if(!response.success){
                alert(response.message);
            }
        } else {
            alert('Please select a block type and a position to place the block');
        }

    }

    const handleBreakBlock = () => {
        agentControlProps.actions.breakBlock(actionBreakUid);
    }

    const handleMessage = () => {
        agentControlProps.actions.sendMessage(actionMessage);
    }
    const handleNull = () => {
        agentControlProps.actions.nullAction();
    }


    const actions = {
        setActionBreakUid, setActionMessage, setActionPlacePos, setActionPlaceBlockType, handleBreakBlock, handlePlaceBlock,
        handleMessage, handleNull
    }

    return [state, actions];
}

export default function MinecraftAgentPanel({ sx, agentControlProps }: MinecraftAGentPanelProps) {

    const [agentControlState, agentControlActions] = useMinecraftAgentControl(agentControlProps);


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', ...sx }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Grid
                    sx={
                        {
                            flexBasis: 2,
                            flexGrow: 2,
                            paddingLeft: 3,
                        }
                    }
                    container spacing={1} alignItems="center">
                    <Grid item xs={2} >
                        <Typography variant="body1">Place</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Select
                            sx={{ width: '100%' }}
                            size="small"
                            value={agentControlState.actionPlaceBlockType}
                            label="Block"
                            onChange={(event: SelectChangeEvent) => {
                                agentControlActions.setActionPlaceBlockType(event.target.value as string);
                            }}

                        >
                            {
                                agentControlProps.state.inventory.map(
                                    (item, index) => {
                                        return (
                                            <MenuItem key={index} value={item.blockType}>{item.blockType}: {item.count}</MenuItem>
                                        );
                                    }
                                )
                            }
                        </Select>

                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            name="x"
                            label="X"
                            type="number"
                            value={agentControlState.actionPlacePos.x}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if(event.target.value === "-" || event.target.value === "0-"){
                                    agentControlActions.setActionPlacePos({
                                        ...agentControlState.actionPlacePos,
                                        x:-1 
                                    }) 
                                    return ;
                                }else if(event.target.value[event.target.value.length - 1 ]=== '-'){
                                    const prefixValue = event.target.value.slice(0, event.target.value.length - 1);
                                    const newValue = parseInt(prefixValue);
                                    const updatedValue = isNaN(newValue) ? 0 : -newValue;
                                    agentControlActions.setActionPlacePos({
                                        ...agentControlState.actionPlacePos,
                                        x: updatedValue
                                    })
                                    return ;
    
                                }
                                const newValue = parseInt(event.target.value);
                                const updatedValue = isNaN(newValue) ? 0 : newValue;

                                agentControlActions.setActionPlacePos({
                                    ...agentControlState.actionPlacePos,
                                    x: updatedValue
                                })
                            }}
                            size="small"
                        // sx={{ mb: 1 }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            name="y"
                            label="Y"
                            // inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            type="number"
                            value={agentControlState.actionPlacePos.y}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                                if(event.target.value === "-" || event.target.value === "0-"){
                                    agentControlActions.setActionPlacePos({
                                        ...agentControlState.actionPlacePos,
                                        y:-1 
                                    }) 
                                    return ;
                                }else if(event.target.value[event.target.value.length - 1 ]=== '-'){
                                    const prefixValue = event.target.value.slice(0, event.target.value.length - 1);
                                    const newValue = parseInt(prefixValue);
                                    const updatedValue = isNaN(newValue) ? 0 : -newValue;
                                    agentControlActions.setActionPlacePos({
                                        ...agentControlState.actionPlacePos,
                                        y: updatedValue
                                    })
                                    return ;
    
                                }
                                const newValue = parseInt(event.target.value);
                                const updatedValue = isNaN(newValue) ? 0 : newValue;
                                
                                agentControlActions.setActionPlacePos({
                                    ...agentControlState.actionPlacePos,
                                    y: updatedValue
                                })
                            }}
                            size="small"
                        // sx={{ mb: 1 }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            name="z"
                            label="Z"
                            type="number"
                            value={agentControlState.actionPlacePos.z}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if(event.target.value === "-" || event.target.value === "0-"){
                                    agentControlActions.setActionPlacePos({
                                        ...agentControlState.actionPlacePos,
                                        z:-1 
                                    }) 
                                    return ;
                                }else if(event.target.value[event.target.value.length - 1 ]=== '-'){
                                    const prefixValue = event.target.value.slice(0, event.target.value.length - 1);
                                    const newValue = parseInt(prefixValue);
                                    const updatedValue = isNaN(newValue) ? 0 : -newValue;
                                    agentControlActions.setActionPlacePos({
                                        ...agentControlState.actionPlacePos,
                                        z: updatedValue
                                    })
                                    return ;
    
                                }
                                const newValue = parseInt(event.target.value);
                                const updatedValue = isNaN(newValue) ? 0 : newValue;

                                agentControlActions.setActionPlacePos({
                                    ...agentControlState.actionPlacePos,
                                    z: updatedValue
                                })
                            }}
                            size="small"
                        // sx={{ mb: 1 }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            disabled={!agentControlProps.state.allowAction}
                            onClick={agentControlActions.handlePlaceBlock}
                        >
                            <AddCircleOutline />
                        </IconButton>
                    </Grid>


                </Grid>
                <Grid
                    sx={
                        {
                            flexBasis: 2,
                            flexGrow: 2,
                            paddingLeft: 3,
                        }
                    }
                    container spacing={1} alignItems="center">
                    <Grid item xs={2}>
                        <Typography variant="body1">Break</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Select
                            sx={{ width: '100%' }}
                            size="small"
                            value={agentControlState.actionBreakUid}
                            onChange={(event: SelectChangeEvent) => {
                                agentControlActions.setActionBreakUid(event.target.value as string);
                            }}
                        >
                            {
                                agentControlProps.state.breakableBlocks.map(
                                    (block, index) => {
                                        return (
                                            <MenuItem key={index} value={block.uid}>{block.blockType}: {`(${block.pos.x}, ${block.pos.y}, ${block.pos.z})`}</MenuItem>
                                        );
                                    }
                                )
                            }
                        </Select>

                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            disabled={!agentControlProps.state.allowAction || !agentControlState.actionBreakUid || !agentControlProps.state.breakableBlocks.map( d => d.uid).includes(agentControlState.actionBreakUid)}

                            onClick={agentControlActions.handleBreakBlock}
                        >
                            <RemoveDone />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid
                    sx={
                        {
                            flexBasis: 2,
                            flexGrow: 2,
                            paddingLeft: 3,
                        }
                    }
                    container spacing={1} alignItems="center">
                    <Grid item xs={2}>
                        <Typography variant="body1">Chat</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            name="message"
                            label="Chat"
                            value={agentControlState.actionMessage}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                agentControlActions.setActionMessage(event.target.value as string);
                            }}
                            sx={{
                                width: '100%'
                            }}
                            size="small"
                        // sx={{ mb: 1 }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            disabled={!agentControlProps.state.allowAction}

                            onClick={agentControlActions.handleMessage}
                        >
                            <Chat />
                        </IconButton>
                    </Grid>

                </Grid>
                <Grid
                    sx={
                        {
                            flexBasis: 2,
                            flexGrow: 2,
                            paddingLeft: 3,
                        }
                    }
                    container spacing={1} alignItems="center">
                    <Grid item xs={2}>
                        <Typography variant="body1">Wait</Typography>
                    </Grid>
                    <Grid item xs={8}>
                    <Typography variant="caption">Wait for your partner to take its action since you do not have job to do for right now.</Typography>
                        
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            disabled={!agentControlProps.state.allowAction}

                            onClick={agentControlActions.handleNull}
                        >
                            <HourglassBottom />
                        </IconButton>
                    </Grid>

                </Grid>
                {!agentControlProps.state.allowAction && <Alert severity="warning" sx={{ marginLeft: 3 }}>Please wait for your partner to complete the action</Alert>}

            </Box>
        </Box>
    )
}