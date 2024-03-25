import styled from "@emotion/styled";
import { Card, Grid, IconButton, TextField, Typography } from "@mui/material";
import { StyledCard, StyledCardHeader } from "../../page/styled-components";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import StatusComp from "../../page/status-comp";
import { AutoExecutionStatus } from "./hooks";
import ExecutionStatusComp from "../../page/execution-status-comp";


interface Props {
    start: () => void,
    currentTurn: number,
    currentAgentIndex: number,
    numTurns: number,
    setNumTurns: (numTurns: number) => void,
    status: AutoExecutionStatus,
    sessionFinished: boolean,
}

const Container = styled(Card)({

})

const Content = styled("div")({

})

export default function MinecraftCollaborationPanel({ start, currentTurn, currentAgentIndex, numTurns, setNumTurns, status, sessionFinished }: Props) {

    return (
        <StyledCard
            sx={{
                marginBottom: 2,
                flexGrow: 10,
                flexShrink: 0,
            }}
        >
            <StyledCardHeader title={"Machine Control"} />

            <Content>
                <Grid container>
                    <Grid item xs={2} md={1}>
                        <IconButton
                            onClick={() => {
                                start();
                            }}
                        >
                            <PlayCircleIcon />
                        </IconButton>
                    </Grid>

                    <Grid item xs={2} md={1}>
                        <IconButton>
                            <StopCircleIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={2} md={4}>
                        <ExecutionStatusComp
                            status={status}
                        />    
                    </Grid>
                    <Grid item xs={8} md={6}>
                        <TextField
                            id="filled-number"
                            label="Number"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(event) => {
                                setNumTurns(parseInt(event.target.value));
                            }}
                            value={numTurns}
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <Typography variant="body1">
                            Turn {currentTurn}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <Typography variant="body1">
                            Agent {currentAgentIndex}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <Typography variant="body1">
                            Finished {sessionFinished? "Yes" : "No"}
                        </Typography>
                    </Grid>
                </Grid>
            </Content>
        </StyledCard>
    )

}