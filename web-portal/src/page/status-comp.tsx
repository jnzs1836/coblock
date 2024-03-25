import { RequestStatus } from "../chatgpt/chatgpt-hooks";
import React from 'react';
import { Chip } from "@mui/material";
import { RotateLeft, CheckCircleOutline, ErrorOutline, AlarmOn } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import ReplayIcon from '@mui/icons-material/Replay';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';


interface StatusCompProps {
    status: RequestStatus
}



export default function StatusComp(props: StatusCompProps) {
    const { status } = props;

    switch (status) {
      case RequestStatus.SUCCESS:
        return <Chip 
        
        icon={<CheckCircleOutline style={{ color: 'green' }} />} label="Success" />
      case RequestStatus.LOADING:
        return <Chip 
        
        icon={ <RotateLeft  />} label="Loading" /> 
      case RequestStatus.IDLE:
        return <Chip 
        
        icon={<ErrorOutline style={{ color: 'gray' }} />} label="Idle..." />
      case RequestStatus.READY:
        return <Chip
        
        icon={ <AlarmOn style={{ color: 'red' }} /> } label="Ready.." /> ;
      case RequestStatus.ERROR:
          return <Chip
          icon={ <ErrorIcon style={{ color: 'red' }} /> } label="Error.." /> ;
      case RequestStatus.RETRYING:
          return <Chip
          icon={ <ReplayIcon style={{ color: 'red' }} /> } label="Retry.." /> ;
      case RequestStatus.DELAYING:
          return <Chip
          icon={ <HourglassBottomIcon style={{ color: 'gray' }} /> } label="Delay.." /> ;
      default:
        return null;
    }
  
}