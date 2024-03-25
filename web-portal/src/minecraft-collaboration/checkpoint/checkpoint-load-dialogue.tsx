import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { MinecraftCollaborationCheckpoint } from "../../types/minecraft";

// Define types for the component props
type CheckpointLoadDialogueProps = {
  open: boolean;
  onClose: () => void;
  checkpoints: MinecraftCollaborationCheckpoint[];
  onConfirm: (checkpoint: MinecraftCollaborationCheckpoint) => void;
};

// Define a custom styled component for the save text field
const SaveTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    width: "100%",
  },
});

const CheckpointLoadDialogue: React.FC<CheckpointLoadDialogueProps> = ({
  open,
  onClose,
  checkpoints, onConfirm
}) => {
  const [selected, setSelected] = useState<number>(-1);

  const handleListItemClick = (index: number) => {
    setSelected(index);
  };

  const handleLoadButtonClick = () => {
    if(selected === -1) return;
     onConfirm(checkpoints[selected]);
    // Handle the load button click event
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Load Checkpoint</DialogTitle>
      <DialogContent>
        <List>
          {checkpoints.map((checkpoint, index) => (
            <ListItem
              key={index}
              button
              selected={selected === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemText
                primary={checkpoint.name}
                secondary={
                  <Typography variant="body2">
                    {checkpoint.name}
                    {/* {checkpoint.date.toLocaleString()} */}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleLoadButtonClick}
          disabled={selected === -1}
          variant="contained"
          
        >
          Load
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckpointLoadDialogue;
