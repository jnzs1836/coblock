import { HourglassBottom } from "@mui/icons-material";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { MinecraftWorldAgentMessageAction, MinecraftWorldAgentNullAction } from "../../minecraft-collaboration/hooks";

interface MessageActionDisplayProps {
    action: MinecraftWorldAgentNullAction,
    sx?: Record<string, any>
}

export default function NullActionDisplay({ action, sx }: MessageActionDisplayProps) {

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
                        <HourglassBottom />

                    </Grid>

                    <Grid
                        item xs={8}
                    >
                        <Typography
                            variant='body1'
                        >
                            Wait for the partner
                        </Typography>

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}