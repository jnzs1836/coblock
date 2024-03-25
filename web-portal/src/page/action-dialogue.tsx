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
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ActionDialog = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // Do any async operations here (e.g. API calls)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSuccess(true);
    setLoading(false);
    // Once the operation is complete, call the onConfirm callback
    props.onConfirm();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Delete </DialogTitle>
      <DialogContent>
        <Typography>
            {props.content}
        </Typography>
        {loading && <LinearProgress />}
        {success && (
          <Typography variant="caption" color="success">
            Successfully deleted !
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Confirm to delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
