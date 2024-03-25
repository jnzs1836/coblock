import { AddCircleOutline } from "@mui/icons-material";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { MinecraftWorldAgentMessageAction, MinecraftWorldAgentPlaceAction } from "../../minecraft-collaboration/hooks";

interface PlaceActionDisplayProps {
    action: MinecraftWorldAgentPlaceAction,
    sx?: Record<string, any>
}

export default function PlaceActionDisplay({action, sx}: PlaceActionDisplayProps) {

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
                        <AddCircleOutline />

                    </Grid>
                    <Grid
                        item xs={2}
                    >
                        <Typography 
                            variant='body1'
                        >
                            {action.blockPos.x}
                        </Typography>

                    </Grid>
                    <Grid
                        item xs={2}
                    >
                        <Typography 
                            variant='body1'
                        >
                            {action.blockPos.y}
                        </Typography>

                    </Grid>
                    <Grid
                        item xs={2}
                    >
                        <Typography 
                            variant='body1'
                        >
                            {action.blockPos.z}
                        </Typography>

                    </Grid>
                    <Grid
                        item xs={2}
                    >
                        <Typography 
                            variant='body1'
                        >
                            {action.blockType}
                        </Typography>

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}