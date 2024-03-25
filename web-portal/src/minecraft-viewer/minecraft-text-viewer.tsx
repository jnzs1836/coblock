import React, { useState } from 'react';
import { MinecraftBlock, MinecraftBlockPos } from '../types/minecraft';
import { StyledCard, StyledCardContent, StyledCardHeader } from '../page/styled-components';
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import {
    Avatar,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Stack,
    Chip,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Delete, Edit, Add, Save, Cancel, ViewInAr } from '@mui/icons-material';
import styled from '@emotion/styled';
import { BlockTypes } from '../types/minecraft';


interface Props {
    blocks: MinecraftBlock[];
}

interface MinecraftBlockItemProps {
    block: MinecraftBlock;
    index: number
}

function mapColorNameToHex(colorName: string) {
    const colorMap: Record<string, string> = {
        "red": '#f44336',
        "blue": '#2196f3',
        "yellow": '#ffeb3b',
        "purple": '#9c27b0',
        "green": '#4caf50',
    };
    return colorMap[colorName] || '#000000';
}


const EditorBlockCard = styled(Card)({
    display: "flex", flexDirection: "row", alignItems: "center",
    paddingLeft: 2, paddingRight: 2,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: 10,
    paddingBottom: 4,
    paddingTop: 6,
    justifyContent: "center",
    width: "100%"
    // marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10,

});

const EditorBlockIconSet = styled(Box)({
    flexBasis: 2,
    minWidth: 60,
})

const MinecraftBlockItemDisplay: React.FC<MinecraftBlockItemProps> = ({ block, index }: MinecraftBlockItemProps) => {
    return (
        <EditorBlockCard>
            <ViewInAr
                sx={{ color: mapColorNameToHex(block.blockType) }}
            />
            <Typography variant="body1" component="div" sx={{ flexGrow: 1, paddingLeft: 3, flexBasis: "80px" }}
                align='left'
            >
                {`${block.blockType} (x=${block.pos.x}, y=${block.pos.y}, z=${block.pos.z})`}
            </Typography>
        </EditorBlockCard>

    );
};


const Container = styled("div")({
    overflowY: "scroll",
    paddingLeft: "2px",
    paddingRight: "15px",
})

export default function MinecraftTextViewer({ blocks }: Props) {
    const blockList = blocks;
    return (

        <Container>

            <List sx={{
                // width: "420px",
            }}>
                {blocks.map((block, index) => (
                    // <li key={index}>
                    <MinecraftBlockItemDisplay
                        block={block}
                        index={index}
                    />
                    // </li>
                ))}
            </List>

        </Container>
    )
}

