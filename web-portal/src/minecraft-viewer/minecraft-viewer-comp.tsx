import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { MinecraftBlock } from "../types/minecraft";
import { useMinecraftViewer } from "./hooks";
import { GUI } from 'dat.gui';
import { ButtonGroup, styled, Box, Typography, Switch } from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MinecraftTextViewer from "./minecraft-text-viewer";


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

const MinecraftViewerComp: React.FC<MinecraftViewerProps> = ({ blocks }) => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [prevMousePosition, setPrevMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [{ canvasRef, containerRef }, { resetCamera }] = useMinecraftViewer(blocks, true);

  

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
     <StyledCanvasContainer>
        <AspectRatioContainer
          ref={containerRef}
        >
          <StyledCanvas
            // width={"100%"},
            ref={canvasRef}
          />

        </AspectRatioContainer>
      </StyledCanvasContainer>


    </Container>
  )

};

export default MinecraftViewerComp;
