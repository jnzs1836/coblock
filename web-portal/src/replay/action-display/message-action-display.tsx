import { Chat } from "@mui/icons-material";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { MinecraftWorldAgentMessageAction } from "../../minecraft-collaboration/hooks";

interface MessageActionDisplayProps {
    action: MinecraftWorldAgentMessageAction,
    sx?: Record<string, any>
}

export default function MessageActionDisplay({ action, sx }: MessageActionDisplayProps) {

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
                        <Chat />

                    </Grid>

                    <Grid
                        item xs={8}
                    >
                        <Typography
                            variant='body1'
                        >
                            {action.message}
                        </Typography>

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}