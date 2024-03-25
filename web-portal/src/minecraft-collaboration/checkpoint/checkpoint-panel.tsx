import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { styled } from "@mui/system";
import { MinecraftCollaborationCheckpoint, MinecraftWorldAgentState } from "../../types/minecraft";
import CheckpointSaveDialog from "./checkpoint-save-dialogue";
import CheckpointLoadDialogue from "./checkpoint-load-dialogue";

import { StyledCard, StyledCardContent, StyledCardHeader } from "../../page/styled-components";
// const StyledCard = styled(Card)({
//   maxWidth: 500,
//   margin: "auto",
//   marginTop: 50,
//   marginBottom: 50,
//   position: "relative",
//   overflow: "auto",
//   height: 300,

// });

// const StyledCardContent = styled(CardContent)({
//   display: "flex",
//   flexDirection: "column",
// });

const StyledTextField = styled(TextField)({
  marginBottom: 20,
});

const StyledButton = styled(Button)({
  marginRight: 10,
  flexGrow: 5
  
});

const ButtonGroup = styled("div")({
    display: "flex",
    // justifyContent: "flex-end",
    marginTop: 20,
});

const StyledCheckpointList = styled("ul")({
  listStyle: "none",
  margin: 0,
  padding: 0,
  position: "absolute",
  top: "100%",
  left: 0,
  backgroundColor: "#fff",
  boxShadow: "0px 2px 5px 1px rgba(0,0,0,0.3)",
  borderRadius: "3px",
  zIndex: 1,
  maxHeight: 150,
  overflowY: "auto",
  width: "100%",
  "& li": {
    padding: "5px 10px",
    borderBottom: "1px solid #ccc",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
});


interface CheckpointPanelProps {
  onSave: (name: string) => void;
  onLoad: (checkpoint: MinecraftCollaborationCheckpoint) => void;
    checkpoints: MinecraftCollaborationCheckpoint[];
    sx?: Record<string, any>;
}

const CheckpointPanel: React.FC<CheckpointPanelProps> = ({
  onSave,
  onLoad,
  checkpoints,
  sx
}) => {
  const [showList, setShowList] = React.useState(false);

  const handleSaveClick = () => {
    // onSave(name);
    setSaveOpen(true);
  };
  const [saveOpen, setSaveOpen] = React.useState(false);

  const [loadOpen, setLoadOpen] = React.useState(false);

  const handleLoadClick = (id: string) => {
    // onLoad(id);
    setShowList(false);
  };
  return (
    <StyledCard
      sx={sx}
    >
      <StyledCardHeader title="Checkpoints" />
      <StyledCardContent>
        
        <ButtonGroup>
          <StyledButton variant="contained" onClick={handleSaveClick}>
            Save
          </StyledButton>
          <StyledButton variant="contained" onClick={() => {
                setLoadOpen(true);
            }
            }>
            Load
          </StyledButton>
        </ButtonGroup>

      </StyledCardContent>
      <CheckpointSaveDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onConfirm={(name: string) => {
            return onSave(name);
            // setSaveOpen(false);
        }} 
      />
      <CheckpointLoadDialogue
        open={loadOpen}
        onClose={() => setLoadOpen(false)}
        checkpoints={checkpoints}
        onConfirm={(checkpoint: MinecraftCollaborationCheckpoint) => {
            onLoad(checkpoint);
            setLoadOpen(false);
            }}
      />
    </StyledCard>
  );
};

export default CheckpointPanel;
