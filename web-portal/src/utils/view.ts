import { MinecraftStructure, MinecraftBlock,  MinecraftBlock2DPos, MinecraftBlockPos, MinecraftBlock2D} from '../types/minecraft';
import {MinecraftTaskAgentView} from "../types/task";

function convertStructureTo2DCoordinates(structure: MinecraftStructure, view: MinecraftTaskAgentView | undefined): MinecraftBlock2D[] {
  const { blocks } = structure;

  // Calculate the distance of each block from the viewpoint
  const blocksWithDistance = blocks.map((block) => {
    const { pos } = block;

    let distance = 0;
    switch (view) {
      case MinecraftTaskAgentView.View2DFront:
        distance = pos.z;
        break;
      case MinecraftTaskAgentView.View2DTop:
        distance = pos.y;
        break;
      case MinecraftTaskAgentView.View2DLeft:
      case MinecraftTaskAgentView.View2DRight:
        distance = pos.x;
        break;
      case MinecraftTaskAgentView.View2DBottom:
        distance = -pos.y;
        break;
      case MinecraftTaskAgentView.View2DBehind:
        distance = -pos.z;
        break;
      default:
        break;
    }

    return { ...block, distance };
  });

  // Sort the blocks by distance in descending order
  const sortedBlocks = blocksWithDistance.sort((a, b) => b.distance - a.distance);

  // Convert the sorted blocks into 2D coordinates
  return sortedBlocks.map((block) => {
    const { pos, blockType, uid } = block;
    let x = pos.x;
    let y = pos.y;
    // Adjust coordinates based on the selected view
    switch (view) {
      case MinecraftTaskAgentView.View2DFront:
        x = pos.x;
        y = pos.y;
        break;
      case MinecraftTaskAgentView.View2DTop:
        x = pos.x;
        y = pos.z;
        break;
      case MinecraftTaskAgentView.View2DLeft:
        x = pos.z;
        y = pos.y;
        break;
      case MinecraftTaskAgentView.View2DRight:
        x = -pos.z;
        y = pos.y;
        break;
      case MinecraftTaskAgentView.View2DBottom:
        x = pos.x;
        y = -pos.z;
        break;
      case MinecraftTaskAgentView.View2DBehind:
        x = -pos.x;
        y = pos.y;
        break;
      default:
        break;
    }

    return { pos: { x, y }, blockType, uid };
  });
}

export {convertStructureTo2DCoordinates}