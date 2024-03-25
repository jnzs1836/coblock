import React, { useState } from 'react';
import {
    Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, List, ListItem,
    ListItemText, ListItemAvatar, Avatar, IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import UserMotiveForm from './user-motive-form';
import { MotiveFormActions, MotiveFormDialog, MotiveFormTitle } from './motive-components';
import { MotiveDetailLevel, StructureMotiveInstance } from '../../types/task';
import { MinecraftBlueprint } from '../../types/minecraft';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import DeleteIcon from '@mui/icons-material/Delete';


const Container = styled(Card)({
    display: "flex",
    flexDirection: "column"
})

// Component for displaying and managing user motives
const UserMotives: React.FC<{ motives: StructureMotiveInstance[], onAdd: () => void, onEdit: (index: number, updatedMotive: StructureMotiveInstance, ) => void, onDelete: (index: number) => void, blueprint: MinecraftBlueprint | undefined, sx ?: Record<string, any> }> = ({ motives, onAdd, onEdit, onDelete, blueprint, sx }) => {

    const [editIndex, setEditIndex] = useState<number>(-1);

    return (
        <Container
            sx={{...sx}}
        >
            <Typography variant="h6">User Motives:</Typography>

            <List dense={true}
                sx={{
                    overflowY: "scroll",
                }}
            >
                
                {motives.map((motive, index) => (
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete"
                                onClick={() =>{
                                    onDelete(index);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                        <Avatar
                            onClick={() => {
                                setEditIndex(index);
                            }}
                        >
                            {
                                motive.config.detailLevel === MotiveDetailLevel.VISUAL ? <ImageSearchIcon /> : <TextFormatIcon />
                            }
                        </Avatar>
                        
                        </ListItemAvatar>
                        <ListItemText
                            primary={motive.name}
                        />
                    </ListItem>

                    //   <div key={`motive-${index}`}>
                    //     <Typography variant="body1">Blocks: {motive.config.blockIndices.join(', ')}</Typography>
                    //     <Typography variant="body1">Detail Level: {motive.config.detailLevel}</Typography>
                    //     <Button onClick={() => {
                    //         setEditIndex(index);
                    //     }}>Edit</Button>
                    //     <Button onClick={() => onDelete(index)}>Delete</Button>
                    //   </div>
                ))}

            </List>
            <Button onClick={onAdd}>Add Motive</Button>
            {blueprint && <UserMotiveForm
                blueprint={blueprint}
                open={editIndex >= 0}
                motive={motives[editIndex]}
                onSave={(motive) => {
                    onEdit(editIndex, motive);
                }}
                onCancel={() => {
                    setEditIndex(-1);
                }}

            />}
        </Container>
    );
};


export default UserMotives;