import React, { useState } from "react";
import {
  Alert
} from "@mui/material";

interface Props {
}

const LoginSuccessAlert: React.FC<Props> = ({
}) => {
  return (
    <Alert 
    severity="success">Success! Redirecting to the home page.</Alert>
  );
};

export default LoginSuccessAlert;
