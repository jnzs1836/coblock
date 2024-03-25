import { Fragment, useState } from "react";
import {
    Button,
    CircularProgress,
    IconButton,
    styled,
    Card,
    CardContent,
    Grid,
    Typography,

} from '@mui/material';
import { Place, Chat, Delete, HelpOutline, AddCircleOutline, RemoveDone, Send } from '@mui/icons-material';
import { MinecraftWorldAgentAction } from './hooks';
import FeedbackDialog from './experiment/feedback-dialog';

interface Props {
    onSubmitFeedback: (feedback: string, isSuccess: boolean) => Promise<Response>;
    numTurns: number;
    currentStructureValid?: boolean;
    allowFaiure?: boolean;
}

enum FeedbackType {
    FAIL = "fail",
    SUCCESS = "success"
}

export default function MinecraftExperimentForm({
 onSubmitFeedback, numTurns, currentStructureValid, allowFaiure=true
}: Props) {

    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.FAIL);

    return (
        <Fragment>
            <Grid
                sx={{
                    marginTop: "1rem"
                }}
                container spacing={2} alignItems="center" >
                <Grid item xs={3}>
                    <Typography variant="body1" color="textSecondary">
                        Batch: {numTurns}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!currentStructureValid}
                        onClick={() => {
                            setFeedbackType(FeedbackType.SUCCESS)
                            setFeedbackOpen(true);
                        }}
                    >
                        Finish
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!allowFaiure}
                        onClick={() => {
                            setFeedbackType(FeedbackType.FAIL);
                            setFeedbackOpen(true);
                        }}
                    >
                       Fail 
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            window.location.href = window.location.href;
                        }}>
                        Restart
                    </Button>
                </Grid>
            </Grid>
            <FeedbackDialog
                open={feedbackOpen}
                onClose={() => setFeedbackOpen(false)}
                onSubmit={onSubmitFeedback}
                feedbackType={feedbackType}
            />
        </Fragment>
    )
}