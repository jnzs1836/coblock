import { MinecraftBlock, MinecraftStructure } from "../types/minecraft";
import Minecraft2DViewer from "./minecraft-2d-viewer";
import { convertStructureTo2DCoordinates } from "../utils/view";
import { MinecraftTaskAgentView } from "../types/task";
// import styled from "@emotion/styled";
import MinecraftViewSelector from "./minecraft-view-selector";
import { useState } from "react";
import { Alert, Card } from "@mui/material";
import MinecraftViewer from "./minecraft-viewer";
import MinecraftViewerContainer from "./minecraft-viewer-container";
import { styled } from "@mui/material";
interface Props {
    // structure: MinecraftStructure
    blocks: MinecraftBlock[],
    availableViews?: MinecraftTaskAgentView[],
    flexDirection?: "row" | "column",
    hint?: string,
}

const Container = styled("div")({
    // width: '540px'
    height: "320px"
})

const Content = styled("div")({
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    width: "100%",
    height: "320px"
})

const HintContainer = styled("div")({
    display: "flex",
    flexGrow: 5,
    flexBasis: "200px",
    flexShrink: 2,
    overflow: 'hidden'  // Added this line

    // flexDirection: "row",
    // alignItems: "stretch",
    // width: "100%",
    // height: "320px"
})

export default function MinecraftPartialViewer({ blocks, availableViews, flexDirection, hint }: Props) {

    const [currentView, setCurrentView] = useState<MinecraftTaskAgentView | undefined>(availableViews ? availableViews[0] : undefined);


    let block2D = convertStructureTo2DCoordinates({ blocks }, currentView);

    let validDirection = flexDirection ?? "row";

    return (

        <Container
            sx={{
                width: "100%"
            }}
        >
            <Content
                sx={{
                    display: "flex",
                    flexDirection: validDirection,
                    alignItems: "stretch",
                }}
            >
                <Card
                    sx={{
                        paddingTop: validDirection === "row" ? "10px" : "5px",
                        paddingBottom: validDirection === "row" ? "0px" : "5px",
                        paddingRight: validDirection === "row" ? "0px" : "5px",
                        flexGrow: 0,
                        marginBottom: validDirection === "column" ? 1 : 0,
                        marginRight: validDirection === "row" ? 1 : 0,
                        display: "flex",
                        flexDirection: validDirection === "row" ? "column" : "row",
                        maxWidth: "540px"
                    }}
                >
                    <MinecraftViewSelector
                        currentView={currentView}
                        onChange={(view) => setCurrentView(view)}
                        availableViews={availableViews}
                        sx={{
                            flexBasis: validDirection === "row" ? "30px" : "20px",
                            flexGrow: 0,
                        }}
                    />
                    <HintContainer>
                        <Alert severity="info"
                            sx={{
                                overflow: 'hidden', // Added this line
                                textOverflow: 'ellipsis', // Added for visual truncation
                                // whiteSpace: 'nowrap', // Added this line
                        
                                // width: "50%"
                            }}
                        >
                            {
                                hint || "Please try to chat with your partner though the chat command as much as possible."
                            }
                        </Alert>
                    </HintContainer>

                </Card>
                {
                    currentView !== MinecraftTaskAgentView.View3D &&
                    <Minecraft2DViewer
                        blocks={block2D}
                        gridSize={10}
                        blockSize={10}
                        sx={{
                            flexBasis: "220px",
                            flexGrow: 2,
                        }}
                    />
                }
                {
                    currentView === MinecraftTaskAgentView.View3D &&
                    <Card
                        sx={
                            {
                                flexBasis: "220px",
                                flexGrow: 2,
                                
                            }
                        }
                    >

                        <MinecraftViewer
                            blocks={blocks}
                        />

                    </Card>
                }

            </Content>
        </Container>

    )
}