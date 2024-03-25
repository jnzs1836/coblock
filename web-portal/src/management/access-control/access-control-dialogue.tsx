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
import AccessControlForm from "./access-control-form";
import { MinecraftBlueprint } from "../../types/minecraft";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  blueprint?: MinecraftBlueprint;
}

const AccessControlDialog = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
    const {blueprint} = props;
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
      <DialogTitle>Access </DialogTitle>
      <DialogContent>
        {blueprint && <AccessControlForm
            blueprint={blueprint}
        />}
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={props.onClose}>Cancel</Button> */}
        <Button
          variant="contained"
          color="secondary"
            onClick={props.onClose}
          disabled={loading}
        >
            Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccessControlDialog;
