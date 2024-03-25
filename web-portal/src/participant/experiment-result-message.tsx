import { Dialog, Alert } from "@mui/material";

interface Props {
    success: boolean;
    code: string;
    warning?: boolean;
}

export default function ExperimentResultMessage({ success, code, warning=false}: Props) {
    return (
        <Alert severity={success ? (warning? "warning" :"success") : "info"}>
            {
                success? ( warning? "Please notice that some tasks are failed. You can still submit the task but the payment will not be guaranteed. HIT code:" + `WN-${code}` :"Thanks for your participation! The hit code is " + `KL-${code}` ): "Please finish the above tasks."
            }


        </Alert>
    )
}