import { RemoveDone } from "@mui/icons-material";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { MinecraftWorldAgentBreakAction, MinecraftWorldAgentMessageAction } from "../../minecraft-collaboration/hooks";

interface BreakActionDisplayProps {
    action: MinecraftWorldAgentBreakAction,
    sx?: Record<string, any>

}

export default function BreakActionDisplay({action, sx}: BreakActionDisplayProps) {

    return (
        <Card
            sx={sx}
        >
            <CardContent>
                <Grid container>
                <Grid
                        item xs={2}
                    >
                        <Typography>
                            {action.agentName}
                        </Typography>
                    </Grid>
                    <Grid
                        item xs={2}
                    >
                        <RemoveDone />

                    </Grid>
                    <Grid
                        item xs={8}
                    >
                        <Typography 
                            variant='body1'
                        >
                            {
                                action.uid
                            }
                        </Typography>

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}