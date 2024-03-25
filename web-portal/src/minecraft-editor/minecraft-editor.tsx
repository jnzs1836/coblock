import React, { useState } from 'react';
import { useMinecraftEditor } from './hooks';
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


interface MinecraftEditorProps {
  blocks: MinecraftBlock[],
  syncBlocks: (blocks: MinecraftBlock[]) => void,
  initialReady: boolean,
}

interface MinecraftBlockItemProps {
  block: MinecraftBlock,
  index: number,
  newBlockType: string,
  newBlockPos: MinecraftBlockPos,
  handleNewBlockPosChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleNewBlockTypeChange: (blockType: string) => void,
  editingStatus: boolean,
  saveBlock: () => void,
  cancelEdit: () => void,
  deleteBlock: (index: number) => void,
  editBlock: (index: number) => void,
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


interface MinecraftBlockItemEditProps {
  newBlockType: string,
  newBlockPos: MinecraftBlockPos,
  handleNewBlockPosChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleNewBlockTypeChange: (blockType: string) => void,
  saveBlock: () => void,
  cancelEdit: () => void,
}

const EditorBlockCard = styled(Card)({
  display: "flex", flexDirection: "row", alignItems: "center",
  paddingLeft: 10, paddingRight: 10,
  marginBottom: 10,
  paddingBottom: 4,
  paddingTop: 6,
  justifyContent: "center",
  // marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10,

});

const EditorBlockIconSet = styled(Box)({
  flexBasis: 2,
  minWidth: 60,
})

const MinecraftBlockItemDisplay: React.FC<MinecraftBlockItemProps> = ({ block, index, newBlockType, newBlockPos, handleNewBlockPosChange, handleNewBlockTypeChange, editBlock, deleteBlock }: MinecraftBlockItemProps) => {
  return (
    <EditorBlockCard>
      <ViewInAr
        sx={{ color: mapColorNameToHex(block.blockType) }}
      />
      <Typography variant="body1" component="div" sx={{ flexGrow: 1, paddingLeft: 3 }}
        align='left'
      >
        {`${block.blockType} (x=${block.pos.x}, y=${block.pos.y}, z=${block.pos.z})`}
      </Typography>
      <EditorBlockIconSet>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => {
            editBlock(index);
          }}
        >
          <Edit />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => { deleteBlock(index); }}
        >
          <Delete />
        </IconButton>
      </EditorBlockIconSet>
    </EditorBlockCard>

  );
};

const MinecraftBlockItemEdit: React.FC<MinecraftBlockItemEditProps> = ({ handleNewBlockPosChange, handleNewBlockTypeChange, newBlockPos, newBlockType,
  saveBlock, cancelEdit
}: MinecraftBlockItemEditProps) => {
  return (
    <EditorBlockCard
    >

      {/* // <Card */}
      {/* //   sx={{ paddingLeft: 2, paddingRight: 2, paddingTop: 2, paddingBottom: 2 }} */}
      {/* // > */}

      <ViewInAr />
      <Grid
        sx={
          {
            flexBasis: 2,
            flexGrow: 2,
            paddingLeft: 3,
          }
        }
        container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Select
            sx={{ width: '100%' }}
            size="small"
            value={newBlockType}
            label="Block"
            onChange={(event: SelectChangeEvent) => {
              // @ts-ignore
              handleNewBlockTypeChange(event.target.value as string);
              // agentControlActions.setActionPlaceBlockType(event.target.value as string);
            }}

          >
            {
              BlockTypes.map(
                (item, index) => {
                  return (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  );
                }
              )
            }
          </Select>
          {/* <TextField
              name="type"
              label="Type"
              value={ newBlockType || ''}
              onChange={handleNewBlockTypeChange}
              size="small"
              // sx={{ mb: 1 }}
            /> */}
        </Grid>
        <Grid item xs={3}>
          <TextField
            name="x"
            label="X"
            value={newBlockPos.x}
            onChange={handleNewBlockPosChange}
            size="small"
          // sx={{ mb: 1 }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            name="y"
            label="Y"
            value={newBlockPos.y}
            onChange={handleNewBlockPosChange}
            size="small"
          // sx={{ mb: 1 }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            name="z"
            label="Z"
            value={newBlockPos.z}
            onChange={handleNewBlockPosChange}
            size="small"
          // sx={{ mb: 1 }}
          />
        </Grid>



        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end',
            paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 0
      }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              saveBlock();
            }}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              cancelEdit();
            }}
          >
            Cancel
          </Button>
        </Box> */}

      </Grid>
      <EditorBlockIconSet
        sx={
          {

          }
        }
      >
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => {
            saveBlock();
          }}
        >
          <Save />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => {
            cancelEdit();
          }}
        >
          <Cancel />
        </IconButton>
      </EditorBlockIconSet>
    </EditorBlockCard>
  );
}


const MinecraftBlockItem: React.FC<MinecraftBlockItemProps> = ({ block, index,
  newBlockType, newBlockPos, handleNewBlockPosChange, handleNewBlockTypeChange,
  editingStatus, saveBlock, cancelEdit, editBlock, deleteBlock
}: MinecraftBlockItemProps) => {
  return (
    <React.Fragment key={index}>
      {/* <ListItem
        sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}
      > */}
      {/* <ListItemAvatar>
          <Avatar sx={{ bgcolor: mapColorNameToHex(block.blockType) }} />
        </ListItemAvatar> */}
      {
        !editingStatus ?
          <MinecraftBlockItemDisplay
            deleteBlock={deleteBlock}
            block={block}
            index={index}
            newBlockType={newBlockType}
            newBlockPos={newBlockPos}
            handleNewBlockPosChange={handleNewBlockPosChange}
            handleNewBlockTypeChange={handleNewBlockTypeChange}
            editingStatus={editingStatus}
            saveBlock={saveBlock}
            cancelEdit={cancelEdit}
            editBlock={editBlock}
          />
          :
          <MinecraftBlockItemEdit
            newBlockType={newBlockType}
            newBlockPos={newBlockPos}
            handleNewBlockPosChange={handleNewBlockPosChange}
            handleNewBlockTypeChange={handleNewBlockTypeChange}
            saveBlock={saveBlock}
            cancelEdit={cancelEdit}

          />
      }


      {/* </ListItem> */}

      {/* <Divider /> */}
    </React.Fragment>

  );
}

const Row = styled("div")({
  display: "flex",
  marginRight: 0
})

const MinecraftEditor: React.FC<MinecraftEditorProps> = ({ blocks, syncBlocks, initialReady }) => {
  const [editorState, editorActions] = useMinecraftEditor(blocks, syncBlocks, initialReady);

  const {
    selectedBlockIndex,
    newBlockType,
    newBlockPos,
    blocks: blockList,
  } = editorState;

  const {
    addBlock,
    deleteBlock,
    saveBlock,
    cancelEdit,
    editBlock,
    handleNewBlockTypeChange,
    handleNewBlockPosChange,
  } = editorActions;

  const [showAddBlockPanel, setShowAddBlockPanel] = useState<boolean>(false);


  const saveEditingBlock = () => {
    // saveBlock(newBlockType, newBlockPos);
  };

  const handleShowAddPanel = () => {
    setShowAddBlockPanel(true);
  };

  return (
    <StyledCard
      sx={{
        // width: '480px',
        // paddingLeft: 2,
        // paddingRight: 2,
        marginBottom: 2,
      }}
    >
      <StyledCardHeader title="Editor" titleTypographyProps={{ variant: "h6" }} />
      <StyledCardContent
        sx={{
          // paddingLeft: 2,
          // paddingRight: 2,
          overflowY: 'scroll',
          maxHeight: '400px',
        }}
      >
        <Row>
          <TextField 
            sx={{
              flexBasis: "60px",
              flexGrow: 0, 
            }}

          ></TextField>
          <TextField
            sx={{
              flexBasis: "60px",
              flexGrow: 0, 
            }}
          >

          </TextField>
          <TextField
            sx={{
              flexBasis: "60px",
              flexGrow: 0, 
            }}
          >

          </TextField>

        </Row>
        


        <List sx={{
          width: "420px"
        }}>
          {blockList.map((block, index) => (
            // <li key={index}>
            <MinecraftBlockItem
              editingStatus={selectedBlockIndex === index}
              block={block}
              index={index}
              newBlockType={newBlockType}
              newBlockPos={newBlockPos}
              handleNewBlockPosChange={handleNewBlockPosChange}
              handleNewBlockTypeChange={handleNewBlockTypeChange}
              saveBlock={saveBlock}
              cancelEdit={cancelEdit}
              editBlock={editBlock}
              deleteBlock={deleteBlock}
            />
            // </li>
          ))}
          {
            showAddBlockPanel ? <MinecraftBlockItemEdit
              newBlockType={newBlockType}
              newBlockPos={newBlockPos}
              handleNewBlockPosChange={handleNewBlockPosChange}
              handleNewBlockTypeChange={handleNewBlockTypeChange}
              saveBlock={() => {
                addBlock();
                setShowAddBlockPanel(false);
              }}
              cancelEdit={cancelEdit}
            /> : <Button
              fullWidth
              variant="outlined" color="primary" startIcon={<Add />} onClick={handleShowAddPanel}>
              Add
            </Button>
          }


        </List>
      </StyledCardContent>
    </StyledCard>
  );
};

export default MinecraftEditor;