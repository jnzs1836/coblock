import { RequestState } from "../web/types";
import { Fragment } from "react";

import { Alert, LinearProgress, Box } from "@mui/material";

interface LoadingProgressProps {
    status: RequestState;
    errorMessage?: string;
    successMessage?: string;

}

export default function LoadingProgress({ status, errorMessage, successMessage }: LoadingProgressProps) {
    return (
        <Fragment>
            {status === RequestState.LOADING && <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>}
            {status === RequestState.SUCCESS && <Alert
                severity="success">{successMessage}</Alert>}
            {status === RequestState.ERROR && <Alert
                severity="error">{errorMessage}</Alert>}
        </Fragment>
    )

}