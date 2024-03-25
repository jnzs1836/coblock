import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { MinecraftBlock } from "../types/minecraft";
import { useMinecraftViewer } from "./hooks";
import { GUI } from 'dat.gui';
import { ButtonGroup, styled, Box, Typography, Switch } from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MinecraftTextViewer from "./minecraft-text-viewer";
import MinecraftViewerComp from "./minecraft-viewer-comp";


interface MinecraftViewerProps {
  blocks: MinecraftBlock[];
}

const StyledCanvasContainer = styled("div")({
  flexBasis: "140px",
  flexGrow: 1,
  backgroundColor: "lightgreen",
  position: "relative",
});

const AspectRatioContainer = styled("div")({
  width: "100%",
  position: "relative",
  overflow: "scroll",
  height: "100%",
});


const StyledCanvas = styled("canvas")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});


const StyledCanvasBackup = styled("canvas")({
  flexBasis: "190px",
  flexGrow: 1,
  backgroundColor: "lightgreen",
  aspectRatio: "4:3"
  // width: "720px",
  // height: "480px",
});

const MinecraftEditorBlock = () => {
  return (
    <Card>

    </Card>
  )
}

const Container = styled("div")({
  flexBasis: "200px",
  flexGrow: 2,
  display: "flex",
  flexDirection: "column",
  position: "relative",
  height: "100%",

})

const MinecraftViewer: React.FC<MinecraftViewerProps> = ({ blocks }) => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTextView, setIsTextView] = useState(false);

  const toggleView = () => {
    setIsTextView(!isTextView);
  };

  return (
    <Container>
      {/* <ButtonGroup
        sx={{
          flexBasis: 1,
          flexGrow: 0,
        }}
      >
        <Button
          onClick={resetCamera}
        > Reset </Button>
      </ButtonGroup> */}
      <Box

        sx={{
          marginLeft: "10px",
          marginRight: "10px"

        }}
        alignSelf={"flex-end"}
        display="flex" alignItems="center"
        justifyContent="flex-end" width="200px">
        <Typography variant="body1">Text View</Typography>
        <Switch checked={!isTextView} onChange={toggleView} />
        <Typography variant="body1">3D View</Typography>
      </Box>
      {isTextView ? <MinecraftTextViewer blocks={blocks} /> : 
      <MinecraftViewerComp
        blocks={blocks}
      /> 
      }


    </Container>
  )

};

export default MinecraftViewer;
