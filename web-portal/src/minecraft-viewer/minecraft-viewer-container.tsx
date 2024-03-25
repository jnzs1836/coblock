import styled from "@emotion/styled"
import { Button, Card, CardContent, Typography, CardHeader, Container, Switch, FormControlLabel, Box } from "@mui/material"
import MinecraftViewer from "./minecraft-viewer"
import { MinecraftBlock } from "../types/minecraft";
import { StyledCardHeader } from "../page/styled-components";
import MinecraftTextViewer from "./minecraft-text-viewer";
import { useState } from "react";


interface MinecraftViewerContainerProps {
    sx?: Record<string, any>;
    blocks: MinecraftBlock[]
}

const ContainerCard = styled(Card)({
    flexBasis: 5,
    flexGrow: 5,
    flexShrink: 5,
    minWidth: 540,
    height: 540,
    display: "flex",
    flexDirection: "column",
})

const HeaderContainer = styled("div")({

    flexBasis: 1,
    flexGrow: 0,

});


export default function MinecraftViewerContainer({ blocks, sx }: MinecraftViewerContainerProps) {
    const [isTextView, setIsTextView] = useState(false);

    const toggleView = () => {
        setIsTextView(!isTextView);
    };

    return (
        <ContainerCard sx={sx}>
            <StyledCardHeader
                sx={{
                    flexBasis: 1,
                    flexGrow: 1,
                }}
                title={"Minecraft Viewer"} />
                  

            <MinecraftViewer blocks={blocks} />            {/* <MinecraftViewer blocks={blocks} />
            <MinecraftTextViewer
                blocks={blocks}
            /> */}


        </ContainerCard>
    )
}