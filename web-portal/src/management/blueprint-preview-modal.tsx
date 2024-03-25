import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinecraftViewer from '../minecraft-viewer/minecraft-viewer';
import { MinecraftBlueprint } from '../types/minecraft';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
}));

interface Props {
    open: boolean;
    onClose: () => void;
    blueprint?: MinecraftBlueprint
}   

const BlueprintPreviewModal = ({open, onClose, blueprint}: Props) => {

  const handleOpen = () => {
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <StyledDialogTitle>
          <Typography variant="h6">Minecraft Viewer {blueprint?blueprint?.name : ""}</Typography>
          <StyledIconButton onClick={handleClose}>
            <CloseIcon />
          </StyledIconButton>
        </StyledDialogTitle>
        <MinecraftViewer blocks={blueprint? blueprint.spec.blocks: []}/>
      </Dialog>
    </>
  );
};

export default BlueprintPreviewModal;
