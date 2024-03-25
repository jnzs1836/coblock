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
import { RequestState } from "../web/types";
import LoadingProgress from "./loading-progress";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  status: RequestState;
  successMessage?: string;
  errorMessage?: string;
}

const RequestConfirmDialogue = (props: Props) => {

  const handleConfirm = async () => {
    props.onConfirm();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Delete </DialogTitle>
      <DialogContent>
        <Typography>
            {props.content}
        </Typography>
        <LoadingProgress
          status={props.status}
          errorMessage = {props.errorMessage || "Failed"}
          successMessage={ props.successMessage || "Success" }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={props.status !== RequestState.IDLE}
        >
          {props.status === RequestState.LOADING ? "Deleting..." : "Confirm to delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestConfirmDialogue;
