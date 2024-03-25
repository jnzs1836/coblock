import { RequestStatus } from "../chatgpt/chatgpt-hooks";
import React from 'react';
import { Chip } from "@mui/material";
import { RotateLeft, CheckCircleOutline, ErrorOutline, AlarmOn } from '@mui/icons-material';
import { AutoExecutionStatus } from "../minecraft-collaboration/auto-control/hooks";

interface StatusCompProps {
    status: AutoExecutionStatus 
}



export default function ExecutionStatusComp(props: StatusCompProps) {
    const { status } = props;

    switch (status) {
      case AutoExecutionStatus.FINISHED:
        return <Chip 
        
        icon={<CheckCircleOutline style={{ color: 'green' }} />} label="Success" />
      case AutoExecutionStatus.RUNNING:
        return <Chip 
        
        icon={ <RotateLeft  />} label="Loading" /> 
      case AutoExecutionStatus.IDLE:
        return <Chip 
        
        icon={<ErrorOutline style={{ color: 'gray' }} />} label="Idle..." />
      case AutoExecutionStatus.READY:
        return <Chip
        
        icon={ <AlarmOn style={{ color: 'red' }} /> } label="Ready.." /> ;
      default:
        return null;
    }
  
}