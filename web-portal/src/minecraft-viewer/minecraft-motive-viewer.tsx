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
import { MinecraftTaskAgentView, MotiveDetailLevel, StructureMotiveInstance, MotiveVisualDescription, MotiveTextualDescription } from '../types/task';
import { MotiveFormActions, MotiveFormDialog, MotiveFormTitle, ControlPanel } from "../management/user-motive/motive-components";
import { StyledCard } from '../page/styled-components';
import MinecraftViewer from './minecraft-viewer';
import MotiveBlockSelection from '../management/user-motive/motive-block-selection';
import Minecraft2DViewer from './minecraft-2d-viewer';
import MinecraftPartialViewer from './minecraft-partial-viewer';

interface Props {
    motive: StructureMotiveInstance,
    sx?: Record<string, any>
}

const Container = styled("div")({

})


export default function MinecraftMotiveViewer({ motive , sx}: Props) {

    const [blockIndices, setBlockIndices] = useState<number[]>(motive?.config.blockIndices || []);

    const [detailLevel, setDetailLevel] = useState<MotiveDetailLevel>(motive?.config.detailLevel || MotiveDetailLevel.VISUAL);

    const [selectedViews, setSelectedViews] = useState<MinecraftTaskAgentView[]>(motive?.description?.descriptionType === "VISUAL"
        ? (motive.description as MotiveVisualDescription)?.views ?? []
        : []
    );
    const [textualDescription, setTextualDescription] = useState<string>(motive?.description?.descriptionType === "TEXTUAL"
        ? (motive.description as MotiveTextualDescription)?.text ?? ''
        : '');

    const [motiveName, setMotiveName] = useState<string>(motive?.name || '');
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

    if (motive.description.descriptionType === "VISUAL") {
        let visualMotiveDescription = motive.description as MotiveVisualDescription;
        let availableViews = visualMotiveDescription.views;
        return (
            <Container
                sx={{...sx}}
            >
                        {/* <MinecraftViewer blocks={visualMotiveDescription.blocks} /> */}
                        <MinecraftPartialViewer
                            blocks={visualMotiveDescription.blocks}
                            availableViews={availableViews}
                            flexDirection='column'
                            hint={motive.hint}


                        //    blocks={blueprint.spec.blocks.filter((block, index) => blockIndices.includes(index))} 
                        />
            </Container>
        )
    }


    return (
        <div>

        </div>
    )


}