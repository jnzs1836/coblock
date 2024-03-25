import * as React from 'react';
import { Card, CardContent, CardHeader, IconButton, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { Save as SaveIcon } from '@mui/icons-material';
import { useRequestWrapper } from '../../web/hooks';
import { saveCheckpointAPI } from './api';
import LoadingProgress from '../../page/loading-progress';

interface SaveDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
  }

  const MinecraftIconButton = styled(IconButton)({
    float: 'right',
  });

  const StyledTextField = styled(TextField)({
    marginBottom: 20,
  });
  
const CheckpointSaveDialog: React.FC<SaveDialogProps> = ({ open, onClose, onConfirm }) => {
    const [name, setName] = React.useState('');

    const {
      wrappedRequestFunc: wrappedConfirm,
      status: onSaveStatus,
  } = useRequestWrapper(async (name: string) => {return onConfirm(name)}, true);
  
    return (
      <div style={{ display: open ? 'block' : 'none' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={onClose}></div>
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, backgroundColor: '#fff', padding: '16px', borderRadius: '4px' }}>
          <h2 style={{ margin: 0 }}>Confirm Save</h2>
          <p style={{ marginTop: '8px', marginBottom: '16px' }}>Are you sure you want to save this checkpoint?</p>
          <StyledTextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <MinecraftIconButton onClick={onClose}>
              Cancel
            </MinecraftIconButton>
            <MinecraftIconButton color="primary" onClick={() =>{
              // wrappedSaveAPI(name, onConfirm)
              wrappedConfirm(name);
            }}>
              Save
            </MinecraftIconButton>
          </div>
          <LoadingProgress
                    status={onSaveStatus}
                    errorMessage="Failed to save prompt."
                    successMessage="Prompt saved!"
                />
        </div>
        
      </div>
    );
  };
  
  export default CheckpointSaveDialog;