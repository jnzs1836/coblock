import React from 'react';
import {
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox, styled,
    Card,
} from '@mui/material';
import { MinecraftBlock, MinecraftBlueprint } from '../../types/minecraft';

const StyledFormGroup = styled(FormGroup)({
    maxHeight: '200px',
    overflow: 'auto',
});


interface MotiveBlockSelectionProps {
    blueprint: MinecraftBlueprint;
    motiveBlocks: number[];
    onAddBlock: (blockIndex: number) => void;
    onRemoveBlock: (blockIndex: number) => void;
}

const MotiveBlockSelection: React.FC<MotiveBlockSelectionProps> = ({ blueprint, motiveBlocks, onAddBlock, onRemoveBlock }) => {
    const handleAddBlock = (blockIndex: number) => {
        onAddBlock(blockIndex);
    };

    const handleRemoveBlock = (blockIndex: number) => {
        onRemoveBlock(blockIndex);
    };

    return (
        <Card
            sx={{
                paddingLeft: '1rem',
                paddingTop: '1rem',
            }}
        >

            <FormControl
                sx={{
                    width: '100%',
                }}
            >
                <FormLabel>Select Blocks</FormLabel>
                <StyledFormGroup>
                    {blueprint.spec.blocks.map((block, index) => (
                        <FormControlLabel
                            key={`block-${index}`}
                            control={
                                <Checkbox
                                    checked={motiveBlocks.some((motiveBlock) => motiveBlock === index)}
                                    onChange={() => {
                                        if (motiveBlocks.some((motiveBlock) => motiveBlock === index)) {
                                            handleRemoveBlock(index);
                                        } else {
                                            handleAddBlock(index);
                                        }
                                    }}
                                />
                            }
                            label={`${block.blockType} (${block.pos.x}, ${block.pos.y}, ${block.pos.z})`}
                        />
                    ))}
                </StyledFormGroup>

            </FormControl>

        </Card>
    );
};

export default MotiveBlockSelection;