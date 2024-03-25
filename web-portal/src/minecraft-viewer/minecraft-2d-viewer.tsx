import React, { useRef, useEffect, useState } from 'react';
import { MinecraftBlock2D } from '../types/minecraft';
import { Card, styled } from '@mui/material';
import Minecraft2DViewerControl from './minecraft-2d-viewer-control';


interface Props {
  blocks: MinecraftBlock2D[];
  gridSize: number;
  blockSize: number;
  sx ?: Record<string, unknown>;
}

const Container = styled(Card)({
  flexBasis: "200px",
  flexGrow: 1,
});

const Content = styled("div")({
  display: "flex",
  flexDirection: "row",
  marginTop: "10px",
  marginBottom: "10px",
  marginLeft: "10px",
  marginRight: "10px",
  alignItems: "center",
  width: "100%",
})

const StyledCanvas = styled("canvas")({
  flexBasis: "100px",
})

const Minecraft2DViewer: React.FC<Props> = ({ blocks, gridSize, blockSize, sx }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [verticalOffset, setVerticalOffset] = React.useState(0);
  const [horizontalOffset, setHorizontalOffset] = React.useState(0);
  const [scaleRatio, setScaleRatio] = useState(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Render the blocks
    blocks.forEach((block) => {
      const { pos: { x, y }, blockType, uid } = block;
      const left = (x - 0.5 + horizontalOffset) * blockSize * scaleRatio / 100 + canvas.width / 2;
      const top = canvas.height - ((y - 0.5 + verticalOffset) * scaleRatio / 100 * blockSize + canvas.height / 2);
      // Render the block as a colored rectangle
      context.fillStyle = blockType;
      context.fillRect(left, top, blockSize * scaleRatio / 100, blockSize * scaleRatio / 100);
    });
  }, [blocks, gridSize, blockSize, scaleRatio, verticalOffset, horizontalOffset]);

  return (
    <Container
      sx={sx}
    >
      <Content>
        <StyledCanvas ref={canvasRef} width={gridSize * blockSize} height={gridSize * blockSize} />
        <Minecraft2DViewerControl
          sx={{
            marginLeft: "10px",
            flexGrow: 5,
            marginRight: "30px"
          }}
          verticalOffset={verticalOffset}
          horizontalOffset={horizontalOffset}
          scaleRatio={scaleRatio}
          onVerticalOffsetChange={setVerticalOffset}
          onHorizontalOffsetChange={setHorizontalOffset}
          onScaleRatioChange={setScaleRatio}
        />
      </Content>

    </Container>
  )
};

export default Minecraft2DViewer;
