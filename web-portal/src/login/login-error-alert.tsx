import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert
} from "@mui/material";

interface LoginErrorDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginErrorAlert: React.FC<LoginErrorDialogProps> = ({
  open,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    // handle form submission here
  };

  return (
    <Alert 
    severity="error">Username and password mistached, please check them!</Alert>
  );
};

export default LoginErrorAlert;
