import React, { useEffect, useState } from 'react';
import {
    Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    TextField, Typography,
    MenuItem, Select, FormControl, FormLabel, FormGroup,
    FormControlLabel, Checkbox, Grid, Card
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { MinecraftTaskAgentView, MotiveDetailLevel, StructureMotiveInstance, MotiveVisualDescription, MotiveTextualDescription } from '../../types/task';
import { MotiveFormActions, MotiveFormDialog, MotiveFormTitle, ControlPanel } from "./motive-components";
import { MinecraftBlock, MinecraftBlueprint } from '../../types/minecraft';
import MinecraftViewer from '../../minecraft-viewer/minecraft-viewer';
import MotiveBlockSelection from './motive-block-selection';
import Minecraft2DViewer from '../../minecraft-viewer/minecraft-2d-viewer';
import MinecraftPartialViewer from '../../minecraft-viewer/minecraft-partial-viewer';

// Define the available views for the motive structure
const availableViews: MinecraftTaskAgentView[] = [
    MinecraftTaskAgentView.View2DBehind,
    MinecraftTaskAgentView.View2DFront,
    MinecraftTaskAgentView.View2DLeft,
    MinecraftTaskAgentView.View2DRight,
    MinecraftTaskAgentView.View2DTop,
    MinecraftTaskAgentView.View3D,
];

// Component for adding/editing user motive
const UserMotiveForm: React.FC<{ open: boolean, onSave: (motive: StructureMotiveInstance) => void, onCancel: () => void, motive?: StructureMotiveInstance, blueprint: MinecraftBlueprint }> = ({ open, onSave, onCancel, motive, blueprint }) => {
    const [blockIndices, setBlockIndices] = useState<number[]>(motive?.config.blockIndices || []);

    const [detailLevel, setDetailLevel] = useState<MotiveDetailLevel>(motive?.config.detailLevel || MotiveDetailLevel.VISUAL);

    const [selectedViews, setSelectedViews] = useState<MinecraftTaskAgentView[]>(motive?.description?.descriptionType === "VISUAL"
        ? (motive.description as MotiveVisualDescription)?.views ?? []
        : []
    );
    const [textualDescription, setTextualDescription] = useState<string>(motive?.description?.descriptionType === "TEXTUAL"
        ? (motive.description as MotiveTextualDescription)?.text ?? ''
        : '');
    const [hint, setHint] = useState<string>(motive?.hint || '');

    const [motiveName, setMotiveName] = useState<string>(motive?.name || '');

    useEffect(() => {
        setBlockIndices(motive?.config.blockIndices || []);
        if (motive?.description.descriptionType === "TEXTUAL") {
            let motiveDesc = motive.description as MotiveTextualDescription;
            setTextualDescription(motiveDesc.text);
        } else if (motive?.description.descriptionType === "VISUAL") {
            let motiveDesc = motive.description as MotiveVisualDescription;
            setSelectedViews(motiveDesc.views);
        }
        setDetailLevel(motive?.config.detailLevel || MotiveDetailLevel.VISUAL);
        setMotiveName(motive?.name || '');
        setHint(motive?.hint || '');
        // setSelectedViews(motive?.description.views || []);
    }, [motive]);

    const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setSelectedViews(prevSelectedViews => {
            if (checked) {
                return [...prevSelectedViews, value as MinecraftTaskAgentView];
            } else {
                return prevSelectedViews.filter(view => view !== value);
            }
        });

    };



    const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setBlocks(e.target.value.split(','));
    };



    const handleSave = () => {
        if (detailLevel === MotiveDetailLevel.VISUAL) {
            onSave({ config: { blockIndices, detailLevel }, description: { descriptionType: 'VISUAL', views: selectedViews, blocks: blueprint.spec.blocks.filter((block, index) => blockIndices.includes(index)) }, name: motiveName, hint });
        } else {
            onSave({ config: { blockIndices, detailLevel }, description: { descriptionType: 'TEXTUAL', text: textualDescription }, name: motiveName, hint });
        }

    };


    const handleDetailLevelChange = (e: SelectChangeEvent<MotiveDetailLevel>) => {
        setDetailLevel(e.target.value as MotiveDetailLevel);
    };



    const handleTextualDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextualDescription(e.target.value);
    };

    const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHint(e.target.value);
    };



    return (
        <MotiveFormDialog open={open} onClose={onCancel}>
            <MotiveFormTitle>{motive ? 'Edit Motive' : 'Add Motive'}</MotiveFormTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={2} md={2}>
                        <TextField
                            label="Motive Name"
                            value={motiveName}
                            onChange={(e) => setMotiveName(e.target.value)}
                            sx={{
                                marginTop: '8px',
                            }}
                        />

                    </Grid>
                    <Grid item xs={10} md={10}>
                        <MotiveBlockSelection
                            motiveBlocks={blockIndices}
                            blueprint={blueprint}
                            onAddBlock={(blockIndex) => setBlockIndices(prevBlockIndices => [...prevBlockIndices, blockIndex])}
                            onRemoveBlock={(blockIndex) => setBlockIndices(prevBlockIndices => prevBlockIndices.filter(b => b !== blockIndex))}
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Card>
                            <MinecraftViewer blocks={blueprint.spec.blocks} />
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Card>
                            <MinecraftViewer blocks={blueprint.spec.blocks.filter((block, index) => blockIndices.includes(index))} />
                        </Card>
                    </Grid>

                    <Grid item xs={4} md={4} >
                        <FormControl>
                            <FormLabel>Select Detail Level</FormLabel>
                            <Select
                                value={detailLevel}
                                onChange={handleDetailLevelChange}
                                fullWidth
                            >
                                <MenuItem value={MotiveDetailLevel.VISUAL}>Visual</MenuItem>
                                <MenuItem value={MotiveDetailLevel.FINE_DESCRIPTION}>Fine Description</MenuItem>
                                <MenuItem value={MotiveDetailLevel.COARSE_DESCRIPTION}>Coarse Description</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} md={8} >
                        {detailLevel === MotiveDetailLevel.VISUAL && <ControlPanel>
                            <FormControl>
                                <FormLabel>Select Views</FormLabel>
                                <FormGroup
                                    sx={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {availableViews.map(view => (
                                        <FormControlLabel
                                            key={view}
                                            control={<Checkbox checked={selectedViews.includes(view)} onChange={handleViewChange} value={view} />}
                                            label={view}
                                        />
                                    ))}

                                </FormGroup>
                            </FormControl>


                        </ControlPanel>}

                        {detailLevel !== MotiveDetailLevel.VISUAL && (
                            <TextField
                                label="Textual Description"
                                value={textualDescription}
                                onChange={handleTextualDescriptionChange}
                                fullWidth
                            />
                        )}

                    </Grid>
                    {/* <Grid item xs={12} md={12}>
                        <MinecraftPartialViewer
                            blocks={blockIndices.map(index => blueprint.spec.blocks[index])}
                        //    blocks={blueprint.spec.blocks.filter((block, index) => blockIndices.includes(index))} 
                        />
                    </Grid> */}
                    <Grid item xs={12} md={12}>
                        <TextField
                            sx={{
                                width: '100%'
                            }}
                            label="Hint" variant="standard"
                            value={ hint|| ""}
                            onChange={handleHintChange}
                        />
                    </Grid>

                </Grid>



            </DialogContent>
            <MotiveFormActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={!blockIndices.length || !detailLevel || (detailLevel !== MotiveDetailLevel.VISUAL && !textualDescription)}>
                    {motive ? 'Update' : 'Save'}
                </Button>
            </MotiveFormActions>

        </MotiveFormDialog>
    );
};


export default UserMotiveForm;