import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  title: string;
  content: string;
}
export default function ProcessingDialogue(props: Props){
    return (
        <Dialog open={props.open} onClose={()=>{}}>
          <DialogTitle>Delete </DialogTitle>
          <DialogContent>
            <Typography>
                {props.content}
            </Typography>
             <LinearProgress />
          </DialogContent>
        </Dialog>
      );
    
} 

