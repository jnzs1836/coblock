
import React, { useState } from 'react';
import { Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import UserMotiveForm from './user-motive-form';


// Styled components
const MotiveFormDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
      minWidth: '300px',
    },
  });
  
  const MotiveFormTitle = styled(DialogTitle)({
    textAlign: 'center',
  });
  
  const MotiveFormActions = styled(DialogActions)({
    justifyContent: 'center',
  });

  const ControlPanel = styled(Card)({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingTop: "8px",
    paddingLeft: "5px",
    paddingRIght: "5px"
  });

export {MotiveFormActions, MotiveFormDialog, MotiveFormTitle, ControlPanel};

  